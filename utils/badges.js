const BADGES = [
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Complete your first task',
    icon: '⚔️',
    condition: (user, progress) => progress.totalXP >= 30 && !hasBadge(user, 'first_blood')
  },
  {
    id: 'social_shield',
    name: 'Social Shield',
    description: 'Complete Level 1: Social Engineering',
    icon: '🛡️',
    condition: (user, progress) => {
      const l1 = progress.levels.find(l => l.levelId === 1);
      return l1?.status === 'completed' && !hasBadge(user, 'social_shield');
    }
  },
  {
    id: 'phish_slayer',
    name: 'Phish Slayer',
    description: 'Complete Level 2: Phishing',
    icon: '🎣',
    condition: (user, progress) => {
      const l2 = progress.levels.find(l => l.levelId === 2);
      return l2?.status === 'completed' && !hasBadge(user, 'phish_slayer');
    }
  },
  {
    id: 'ai_detective',
    name: 'AI Detective',
    description: 'Complete Level 3: AI Scams',
    icon: '🤖',
    condition: (user, progress) => {
      const l3 = progress.levels.find(l => l.levelId === 3);
      return l3?.status === 'completed' && !hasBadge(user, 'ai_detective');
    }
  },
  {
    id: 'malware_hunter',
    name: 'Malware Hunter',
    description: 'Complete Level 4: Malware Attacks',
    icon: '🦠',
    condition: (user, progress) => {
      const l4 = progress.levels.find(l => l.levelId === 4);
      return l4?.status === 'completed' && !hasBadge(user, 'malware_hunter');
    }
  },
  {
    id: 'cyber_elite',
    name: 'Cyber Elite',
    description: 'Complete all 4 levels',
    icon: '🏆',
    condition: (user, progress) => {
      const allDone = progress.levels.every(l => l.status === 'completed');
      return allDone && !hasBadge(user, 'cyber_elite');
    }
  },
  {
    id: 'xp_500',
    name: 'XP Warrior',
    description: 'Earn 500 XP total',
    icon: '⚡',
    condition: (user, progress) => progress.totalXP >= 500 && !hasBadge(user, 'xp_500')
  },
  {
    id: 'no_miss',
    name: 'Flawless',
    description: 'Complete a level without any wrong answers',
    icon: '💎',
    condition: (user, progress) => {
      return progress.levels.some(l => {
        if (l.status !== 'completed') return false;
        return l.tasks.every(t => t.attempts === 0 || t.status === 'completed');
      }) && !hasBadge(user, 'no_miss');
    }
  }
];

function hasBadge(user, badgeId) {
  return user.badges.some(b => b.id === badgeId);
}

function checkBadgeUnlocks(user, progress) {
  const newBadges = [];
  for (const badge of BADGES) {
    if (badge.condition(user, progress)) {
      newBadges.push({
        id: badge.id,
        name: badge.name,
        description: badge.description,
        icon: badge.icon,
        earnedAt: new Date()
      });
    }
  }
  return newBadges;
}

module.exports = { checkBadgeUnlocks, BADGES };
