const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.use(authMiddleware);

// POST /api/claude-analysis — get threat analysis for a scenario before user acts
router.post('/claude-analysis', async (req, res) => {
  const { scenarioTitle, threatType, briefing, environmentText } = req.body;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 400,
        system: `You are a cybersecurity threat analyst AI assistant embedded in a gamified cyber defense training platform called "Battle of Threats". Your role is to help trainees identify threat indicators in the scenario they're about to face.

IMPORTANT:
- Keep your analysis to 3-4 sentences maximum
- Be educational but don't give away the exact correct answer
- Point out 1-2 specific red flags they should look for
- Write in a terse, professional "threat analyst" voice
- Do NOT use bullet points - write in flowing text
- Use terminology like "indicators of compromise", "threat vector", "social engineering vector" etc.`,
        messages: [{
          role: 'user',
          content: `Scenario: "${scenarioTitle}"
Threat Type: ${threatType}
Briefing: ${briefing}
Environment context: ${environmentText}

Provide a brief threat analysis to guide the trainee WITHOUT revealing the correct action.`
        }]
      })
    });

    const data = await response.json();
    const analysis = data.content?.[0]?.text ?? 'Threat analysis unavailable.';
    res.json({ analysis });
  } catch (err) {
    console.error('Claude API error:', err);
    res.json({ analysis: 'AI analyst offline. Trust your training and proceed.' });
  }
});

// POST /api/claude-feedback — get detailed post-action explanation from Claude
router.post('/claude-feedback', async (req, res) => {
  const { scenarioTitle, threatType, actionTaken, result, feedback, xpEarned, levelId, taskId } = req.body;

  const resultContext = {
    correct: 'The trainee made the CORRECT defensive decision.',
    partial: 'The trainee made a PARTIALLY correct decision — better than doing nothing but not optimal.',
    wrong: 'The trainee made the WRONG decision and caused a security breach.'
  };

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 500,
        system: `You are a cybersecurity training instructor AI in the "Battle of Threats" platform. After a trainee makes a decision in a simulation, you provide an educational debrief.

IMPORTANT:
- Write 3-5 sentences maximum
- Be direct and educational
- If correct: reinforce WHY this was the right action and what real-world consequences it prevented
- If wrong/partial: explain what ACTUALLY happened (as if it were real), and what the correct approach would have been
- Reference real-world attack patterns and defensive frameworks where applicable
- Write in a professional but engaging "debrief" tone, not bullet points
- End with one actionable takeaway`,
        messages: [{
          role: 'user',
          content: `Scenario: "${scenarioTitle}"
Threat Type: ${threatType}
Action taken by trainee: "${actionTaken}"
Outcome: ${resultContext[result] ?? 'Unknown outcome'}
System feedback: ${feedback}
XP awarded: ${xpEarned}

Provide an educational debrief for this decision.`
        }]
      })
    });

    const data = await response.json();
    const analysis = data.content?.[0]?.text ?? feedback;
    res.json({ analysis });
  } catch (err) {
    console.error('Claude feedback API error:', err);
    res.json({ analysis: feedback }); // Fall back to pre-scripted feedback
  }
});

module.exports = router;
