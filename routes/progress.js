const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Progress = require('../models/Progress');
const User = require('../models/User');
const { getXPForAction } = require('../utils/xpCalculator');
const { checkBadgeUnlocks } = require('../utils/badges');

// All routes require authentication
router.use(authMiddleware);

// GET /api/progress — get full user progress
router.get('/', async (req, res) => {
  try {
    const progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });
    res.json({ progress });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// POST /api/progress/action — submit a simulation action
router.post('/action', async (req, res) => {
  const { levelId, taskId, action } = req.body;

  if (!levelId || !taskId || !action) {
    return res.status(400).json({ error: 'levelId, taskId, and action required' });
  }

  try {
    const progress = await Progress.findOne({ userId: req.user._id });
    if (!progress) return res.status(404).json({ error: 'Progress not found' });

    const level = progress.levels.find(l => l.levelId === Number(levelId));
    if (!level) return res.status(404).json({ error: 'Level not found' });

    // Security: enforce level lock
    if (level.status === 'locked') {
      return res.status(403).json({ error: 'This level is locked. Complete previous levels first.' });
    }

    const task = level.tasks.find(t => t.taskId === taskId);
    if (!task) return res.status(404).json({ error: 'Task not found' });

    if (task.status === 'locked') {
      return res.status(403).json({ error: 'Complete previous tasks first.' });
    }

    if (task.status === 'completed') {
      return res.status(400).json({ error: 'Task already completed.' });
    }

    if (task.attempts >= task.maxAttempts) {
      return res.status(400).json({ error: 'No retakes left for this task.' });
    }

    // Calculate XP from action
    const { xpDelta, result, feedback, riskIncrease } = getXPForAction(levelId, taskId, action);

    // Record action
    task.actionsTaken.push({ action, result, xpDelta });

    if (result === 'correct') {
      task.status = 'completed';
      task.xpEarned += xpDelta;
      task.completedAt = new Date();
      level.xpEarned += xpDelta;
      progress.totalXP += xpDelta;

      // Unlock next task
      const taskIndex = level.tasks.findIndex(t => t.taskId === taskId);
      if (taskIndex + 1 < level.tasks.length) {
        level.tasks[taskIndex + 1].status = 'available';
      } else {
        // All tasks in level done — complete the level
        level.status = 'completed';
        level.completedAt = new Date();

        // Unlock next game level
        const nextLevel = progress.levels.find(l => l.levelId === Number(levelId) + 1);
        if (nextLevel) {
          nextLevel.status = 'available';
          nextLevel.tasks[0].status = 'available';
        }
      }
    } else if (result === 'wrong') {
      task.attempts += 1;
      progress.riskMeter = Math.min(100, progress.riskMeter + riskIncrease);

      if (task.attempts >= task.maxAttempts) {
        task.status = 'failed';
      }
    } else if (result === 'partial') {
      task.attempts += 1;
      task.xpEarned += xpDelta;
      level.xpEarned += xpDelta;
      progress.totalXP += xpDelta;
      progress.riskMeter = Math.min(100, progress.riskMeter + (riskIncrease / 2));
    }

    await progress.save();

    // Update user XP and level
    const user = await User.findById(req.user._id);
    user.xp = progress.totalXP;
    user.currentGameLevel = Math.max(
      user.currentGameLevel,
      progress.levels.filter(l => l.status !== 'locked').length
    );

    // Check badge unlocks
    const newBadges = checkBadgeUnlocks(user, progress);
    if (newBadges.length > 0) {
      user.badges.push(...newBadges);
    }

    await user.save();

    res.json({
      result,
      xpDelta,
      feedback,
      riskMeter: progress.riskMeter,
      totalXP: progress.totalXP,
      taskStatus: task.status,
      newBadges,
      levelCompleted: level.status === 'completed',
      nextLevelUnlocked: level.status === 'completed' && Number(levelId) < 4
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to process action' });
  }
});

module.exports = router;
