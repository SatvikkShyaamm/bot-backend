/**
 * XP Calculator - implements scoring from BOT PDF
 * Every action maps to a result: 'correct', 'wrong', or 'partial'
 */

const TASK_DIFFICULTY = {
  easy:   { multiplier: 1.0 },
  medium: { multiplier: 1.5 },
  hard:   { multiplier: 2.0 }
};

const BASE_XP = {
  1: { correct: 30, partial: 10, wrong: 0 },
  2: { correct: 50, partial: 15, wrong: 0 },
  3: { correct: 75, partial: 20, wrong: 0 },
  4: { correct: 100, partial: 25, wrong: 0 }
};

// Per-retake XP deduction
const RETAKE_PENALTY = 5;

// All valid actions per task with their outcomes
const TASK_ACTIONS = {
  // ===================== LEVEL 1: SOCIAL ENGINEERING =====================
  l1t1_easy: {
    difficulty: 'easy',
    actions: {
      'report_phishing': { result: 'correct', feedback: '🛡️ Excellent! Reporting phishing is the correct response. You earned XP and protected the system!' },
      'request_it_support': { result: 'correct', feedback: '✅ Good instinct! Verifying through official IT support is the right move.' },
      'ignore_message': { result: 'partial', feedback: '⚠️ Ignoring is better than complying, but reporting it would have been the best action.' },
      'share_password': { result: 'wrong', feedback: '💀 BREACH! Sharing your password with an unverified source is a critical security failure. Never share credentials!' }
    }
  },
  l1t2_easy: {
    difficulty: 'easy',
    actions: {
      'verify_identity': { result: 'correct', feedback: '🛡️ Smart move! Always verify the identity of anyone requesting access.' },
      'ask_callback_number': { result: 'correct', feedback: '✅ Perfect! Getting a callback number to verify through official channels is textbook security.' },
      'comply_immediately': { result: 'wrong', feedback: '💀 BREACH! Complying without verification is exactly what social engineers count on.' },
      'ignore': { result: 'partial', feedback: '⚠️ Ignoring helps, but actively verifying and reporting is the stronger action.' }
    }
  },
  l1t3_medium: {
    difficulty: 'medium',
    actions: {
      'check_sender_domain': { result: 'correct', feedback: '🛡️ Great detective work! Always validate sender domains in suspicious messages.' },
      'report_to_security_team': { result: 'correct', feedback: '✅ Reporting to the security team is the gold standard response.' },
      'respond_cautiously': { result: 'partial', feedback: '⚠️ Responding cautiously is better than ignoring, but reporting is the right move.' },
      'follow_instructions': { result: 'wrong', feedback: '💀 BREACH! Following unverified instructions opened a backdoor into the system!' }
    }
  },
  l1t4_medium: {
    difficulty: 'medium',
    actions: {
      'escalate_to_supervisor': { result: 'correct', feedback: '🛡️ Excellent! Escalating unusual requests is proper security protocol.' },
      'deny_access_and_log': { result: 'correct', feedback: '✅ Denying and logging the incident is a professional security response!' },
      'delay_and_verify': { result: 'partial', feedback: '⚠️ Delaying is smart but make sure to also report the incident.' },
      'grant_access': { result: 'wrong', feedback: '💀 BREACH! Unauthorized access granted. The attacker now has control!' }
    }
  },
  l1t5_hard: {
    difficulty: 'hard',
    actions: {
      'isolate_and_report': { result: 'correct', feedback: '🛡️ Elite response! Isolating the threat and reporting shows professional-level awareness.' },
      'document_interaction': { result: 'correct', feedback: '✅ Documenting the full interaction provides critical evidence for incident response.' },
      'block_contact': { result: 'partial', feedback: '⚠️ Blocking helps contain the threat, but you should also report and document.' },
      'engage_further': { result: 'wrong', feedback: '💀 BREACH! Engaging with the attacker allowed them to gather more intelligence on your systems!' }
    }
  },

  // ===================== LEVEL 2: PHISHING =====================
  l2t1_easy: {
    difficulty: 'easy',
    actions: {
      'inspect_sender': { result: 'correct', feedback: '🛡️ Sharp eye! The sender domain was spoofed — you caught it!' },
      'report_phishing': { result: 'correct', feedback: '✅ Correct! Reporting the phishing email protects the entire organization.' },
      'mark_safe': { result: 'wrong', feedback: '💀 BREACH! That was a phishing email. Marking it safe puts everyone at risk!' },
      'click_link': { result: 'wrong', feedback: '💀 INSTANT BREACH! You clicked a malicious link. Credentials and data are now compromised!' }
    }
  },
  l2t2_easy: {
    difficulty: 'easy',
    actions: {
      'preview_link': { result: 'correct', feedback: '🛡️ Smart! Hovering to preview the link revealed the malicious URL. Never click unverified links.' },
      'check_grammar': { result: 'correct', feedback: '✅ Good catch! Phishing emails often have grammar errors — a key red flag.' },
      'click_link': { result: 'wrong', feedback: '💀 BREACH! The link redirected to a credential harvesting site!' },
      'reply_to_email': { result: 'partial', feedback: '⚠️ Replying confirms your email is active. Better to report and delete.' }
    }
  },
  l2t3_medium: {
    difficulty: 'medium',
    actions: {
      'verify_with_hr_directly': { result: 'correct', feedback: '🛡️ Perfect protocol! Always verify payroll or HR requests through official internal channels.' },
      'report_to_it_security': { result: 'correct', feedback: '✅ Excellent! The IT security team can investigate and warn others.' },
      'update_payroll': { result: 'wrong', feedback: '💀 BREACH! You submitted your banking details to a fake site. Financial fraud imminent!' },
      'forward_to_colleague': { result: 'partial', feedback: '⚠️ Forwarding spreads the threat. Report to IT instead.' }
    }
  },
  l2t4_medium: {
    difficulty: 'medium',
    actions: {
      'check_attachment_name': { result: 'correct', feedback: '🛡️ Sharp! Double extensions like "invoice.pdf.exe" are a classic malware delivery trick.' },
      'sandbox_scan_attachment': { result: 'correct', feedback: '✅ Professional move! Scanning attachments in a sandbox is best practice.' },
      'open_attachment': { result: 'wrong', feedback: '💀 BREACH! The attachment contained a macro virus. Your system is now infected!' },
      'save_for_later': { result: 'partial', feedback: '⚠️ Saving the file still puts it on your system. Report and delete it.' }
    }
  },
  l2t5_hard: {
    difficulty: 'hard',
    actions: {
      'full_incident_report': { result: 'correct', feedback: '🛡️ Superb! A full incident report enables company-wide protection and forensics.' },
      'isolate_affected_systems': { result: 'correct', feedback: '✅ Perfect response! Isolating prevents lateral movement across the network.' },
      'change_credentials_only': { result: 'partial', feedback: '⚠️ Changing credentials is good but the underlying breach needs full investigation.' },
      'ignore_and_delete': { result: 'wrong', feedback: '💀 BREACH! Evidence destroyed and the attacker still has access to your systems!' }
    }
  },

  // ===================== LEVEL 3: AI SCAMS =====================
  l3t1_easy: {
    difficulty: 'easy',
    actions: {
      'verify_via_call': { result: 'correct', feedback: '🛡️ Excellent! Calling back through the official company number is the right verification move.' },
      'ignore_message': { result: 'correct', feedback: '✅ Smart! Ignoring unverified AI-generated requests prevents fraud.' },
      'transfer_funds': { result: 'wrong', feedback: '💀 MAJOR LOSS! You transferred funds based on an AI-generated deepfake voice. Financial fraud confirmed!' },
      'ask_for_more_info': { result: 'partial', feedback: '⚠️ Asking for more info shows suspicion but verify through a completely separate channel.' }
    }
  },
  l3t2_easy: {
    difficulty: 'easy',
    actions: {
      'check_tone_consistency': { result: 'correct', feedback: '🛡️ Great catch! AI-generated audio often has inconsistent tone and pacing — a key tell.' },
      'report_suspicious_audio': { result: 'correct', feedback: '✅ Reporting suspicious AI-generated content protects the whole organization.' },
      'comply_with_request': { result: 'wrong', feedback: '💀 BREACH! The audio was a deepfake. The request was fraudulent.' },
      'delay_response': { result: 'partial', feedback: '⚠️ Delaying is wise but make sure to escalate through official channels.' }
    }
  },
  l3t3_medium: {
    difficulty: 'medium',
    actions: {
      'verify_bank_details': { result: 'correct', feedback: '🛡️ Smart! Always cross-reference bank details with official records before any transfer.' },
      'secondary_channel_confirm': { result: 'correct', feedback: '✅ Using a secondary communication channel to confirm is best practice against AI scams.' },
      'process_payment': { result: 'wrong', feedback: '💀 MAJOR LOSS! The bank details were fraudulent. Funds transferred to attacker!' },
      'partial_transfer': { result: 'partial', feedback: '⚠️ Even partial transfers to unverified accounts cause damage.' }
    }
  },
  l3t4_medium: {
    difficulty: 'medium',
    actions: {
      'use_code_word': { result: 'correct', feedback: '🛡️ Elite! Using a pre-agreed code word to verify identity defeats AI voice cloning.' },
      'escalate_to_ciso': { result: 'correct', feedback: '✅ Escalating AI scam attempts to the CISO enables rapid organizational response.' },
      'trust_the_voice': { result: 'wrong', feedback: '💀 BREACH! Voice alone is no longer reliable authentication in the age of AI.' },
      'partial_comply': { result: 'partial', feedback: '⚠️ Any compliance with unverified requests is a security risk.' }
    }
  },
  l3t5_hard: {
    difficulty: 'hard',
    actions: {
      'full_ai_scam_report': { result: 'correct', feedback: '🛡️ Outstanding! Filing a full AI scam incident report helps defend against future attempts organization-wide.' },
      'deploy_verification_protocol': { result: 'correct', feedback: '✅ Deploying multi-factor verification protocols is the gold standard defense.' },
      'ignore_completely': { result: 'partial', feedback: '⚠️ Ignoring without reporting misses an opportunity to protect others.' },
      'engage_with_attacker': { result: 'wrong', feedback: '💀 BREACH! Engagement with the scammer provided them more intelligence to refine their attack!' }
    }
  },

  // ===================== LEVEL 4: MALWARE ATTACKS =====================
  l4t1_easy: {
    difficulty: 'easy',
    actions: {
      'isolate_device': { result: 'correct', feedback: '🛡️ Immediate isolation is the #1 response to suspected malware. Network spread prevented!' },
      'terminate_process': { result: 'correct', feedback: '✅ Terminating the malicious process stops active damage — great first response.' },
      'ignore_alert': { result: 'wrong', feedback: '💀 COMPANY BREACH! Ignoring the alert allowed the malware to spread across the network!' },
      'restart_computer': { result: 'partial', feedback: '⚠️ Restarting may not stop persistent malware. Isolate and report first.' }
    }
  },
  l4t2_easy: {
    difficulty: 'easy',
    actions: {
      'check_process_list': { result: 'correct', feedback: '🛡️ Smart forensics! Checking the process list reveals suspicious running processes.' },
      'block_outbound_ip': { result: 'correct', feedback: '✅ Blocking C2 server communication stops the malware from receiving commands.' },
      'delete_suspicious_file': { result: 'partial', feedback: '⚠️ Deleting helps but preserve evidence for forensic analysis first.' },
      'continue_working': { result: 'wrong', feedback: '💀 DATA LEAK! Continuing work while malware runs allowed full data exfiltration!' }
    }
  },
  l4t3_medium: {
    difficulty: 'medium',
    actions: {
      'analyze_network_traffic': { result: 'correct', feedback: '🛡️ Excellent! Network traffic analysis reveals C2 communications and lateral movement.' },
      'deploy_edr_scan': { result: 'correct', feedback: '✅ Running an EDR scan provides comprehensive threat detection across all processes.' },
      'patch_and_ignore': { result: 'partial', feedback: '⚠️ Patching helps but an active infection requires full incident response.' },
      'wipe_without_backup': { result: 'wrong', feedback: '💀 DATA LOSS! Wiping without forensic backup destroyed evidence needed for full remediation!' }
    }
  },
  l4t4_medium: {
    difficulty: 'medium',
    actions: {
      'contain_and_eradicate': { result: 'correct', feedback: '🛡️ Textbook incident response! Contain, eradicate, then recover — in that order.' },
      'notify_incident_response': { result: 'correct', feedback: '✅ Notifying the incident response team immediately enables coordinated defense.' },
      'pay_ransom': { result: 'wrong', feedback: '💀 CRITICAL FAILURE! Paying ransom funds criminal organizations and doesn\'t guarantee recovery!' },
      'partial_isolation': { result: 'partial', feedback: '⚠️ Partial isolation still leaves attack vectors open. Complete isolation is required.' }
    }
  },
  l4t5_hard: {
    difficulty: 'hard',
    actions: {
      'full_forensic_investigation': { result: 'correct', feedback: '🛡️ ELITE! Full forensic investigation documents the attack chain for legal action and future prevention.' },
      'restore_from_clean_backup': { result: 'correct', feedback: '✅ Restoring from a verified clean backup is the proper recovery procedure.' },
      'quick_fix_and_resume': { result: 'partial', feedback: '⚠️ Quick fixes leave the root cause unaddressed. Persistent threats will return.' },
      'pay_and_hope': { result: 'wrong', feedback: '💀 CATASTROPHIC! Paying ransom and hoping led to total data loss and regulatory violation!' }
    }
  }
};

function getXPForAction(levelId, taskId, action) {
  const taskConfig = TASK_ACTIONS[taskId];
  if (!taskConfig) {
    return { xpDelta: 0, result: 'wrong', feedback: 'Unknown task.', riskIncrease: 10 };
  }

  const actionConfig = taskConfig.actions[action];
  if (!actionConfig) {
    return { xpDelta: 0, result: 'wrong', feedback: 'Invalid action.', riskIncrease: 10 };
  }

  const difficulty = taskConfig.difficulty;
  const multiplier = TASK_DIFFICULTY[difficulty].multiplier;
  const base = BASE_XP[levelId];

  let xpDelta = 0;
  let riskIncrease = 0;

  if (actionConfig.result === 'correct') {
    xpDelta = Math.round(base.correct * multiplier);
    riskIncrease = 0;
  } else if (actionConfig.result === 'partial') {
    xpDelta = Math.round(base.partial * multiplier);
    riskIncrease = 10;
  } else {
    xpDelta = 0;
    riskIncrease = 25;
  }

  return {
    xpDelta,
    result: actionConfig.result,
    feedback: actionConfig.feedback,
    riskIncrease
  };
}

module.exports = { getXPForAction, TASK_ACTIONS };
