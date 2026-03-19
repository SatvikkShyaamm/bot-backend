const mongoose = require('mongoose');

const taskProgressSchema = new mongoose.Schema({
  taskId: { type: String, required: true },
  status: {
    type: String,
    enum: ['locked', 'available', 'in_progress', 'completed', 'failed'],
    default: 'locked'
  },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 3 },
  xpEarned: { type: Number, default: 0 },
  completedAt: Date,
  actionsTaken: [{ // Audit log of actions in simulation
    action: String,
    result: String, // 'correct', 'wrong', 'partial'
    xpDelta: Number,
    timestamp: { type: Date, default: Date.now }
  }]
});

const levelProgressSchema = new mongoose.Schema({
  levelId: { type: Number, required: true },
  status: {
    type: String,
    enum: ['locked', 'available', 'in_progress', 'completed'],
    default: 'locked'
  },
  tasks: [taskProgressSchema],
  xpEarned: { type: Number, default: 0 },
  completedAt: Date
});

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
  },
  levels: [levelProgressSchema],
  totalXP: { type: Number, default: 0 },
  riskMeter: { type: Number, default: 0, min: 0, max: 100 } // Global risk meter
}, { timestamps: true });

// Initialize fresh progress for a new user
progressSchema.statics.initForUser = async function(userId) {
  const levels = [1, 2, 3, 4].map((levelId, idx) => ({
    levelId,
    status: idx === 0 ? 'available' : 'locked',
    tasks: generateTasksForLevel(levelId),
    xpEarned: 0
  }));

  return this.create({ userId, levels, totalXP: 0, riskMeter: 0 });
};

function generateTasksForLevel(levelId) {
  // 5 tasks per level: 2 easy, 2 medium, 1 hard
  const taskIds = {
    1: ['l1t1_easy', 'l1t2_easy', 'l1t3_medium', 'l1t4_medium', 'l1t5_hard'],
    2: ['l2t1_easy', 'l2t2_easy', 'l2t3_medium', 'l2t4_medium', 'l2t5_hard'],
    3: ['l3t1_easy', 'l3t2_easy', 'l3t3_medium', 'l3t4_medium', 'l3t5_hard'],
    4: ['l4t1_easy', 'l4t2_easy', 'l4t3_medium', 'l4t4_medium', 'l4t5_hard'],
  };

  return taskIds[levelId].map((taskId, idx) => ({
    taskId,
    status: idx === 0 ? 'available' : 'locked',
    attempts: 0,
    maxAttempts: 3,
    xpEarned: 0,
    actionsTaken: []
  }));
}

module.exports = mongoose.model('Progress', progressSchema);
