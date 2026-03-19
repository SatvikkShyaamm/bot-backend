const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const Progress = require('../models/Progress');

// All simulation data — rich scenario definitions for the frontend
const SCENARIOS = require('../data/scenarios');

router.use(authMiddleware);

// GET /api/simulation/:levelId/:taskId — get scenario for a task
router.get('/:levelId/:taskId', async (req, res) => {
  const { levelId, taskId } = req.params;

  // Verify user has access to this task
  const progress = await Progress.findOne({ userId: req.user._id });
  if (!progress) return res.status(404).json({ error: 'Progress not found' });

  const level = progress.levels.find(l => l.levelId === Number(levelId));
  if (!level || level.status === 'locked') {
    return res.status(403).json({ error: 'Level locked' });
  }

  const task = level.tasks.find(t => t.taskId === taskId);
  if (!task || task.status === 'locked') {
    return res.status(403).json({ error: 'Task locked' });
  }

  const scenario = SCENARIOS[taskId];
  if (!scenario) return res.status(404).json({ error: 'Scenario not found' });

  res.json({
    scenario,
    taskMeta: {
      taskId,
      status: task.status,
      attempts: task.attempts,
      maxAttempts: task.maxAttempts,
      xpEarned: task.xpEarned
    }
  });
});

module.exports = router;
