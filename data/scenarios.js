/**
 * Scenario definitions for all 20 tasks
 * Each scenario describes the simulation environment the user operates in
 */

const SCENARIOS = {

  // =================== LEVEL 1: SOCIAL ENGINEERING ===================

  l1t1_easy: {
    title: 'The Helpdesk Impostor',
    difficulty: 'easy',
    type: 'live_chat',
    briefing: 'You are an employee at TechCorp. A live chat message has appeared claiming to be from IT Helpdesk.',
    threat_type: 'Pretexting',
    xp_available: 30,
    environment: {
      type: 'chat_interface',
      messages: [
        {
          sender: 'IT_Support_Bot',
          avatar: '🔧',
          text: 'Hello! This is Mark from IT Helpdesk. We detected unusual login activity on your account. Your VPN access will expire in 10 minutes. Please share your password immediately to prevent lockout.',
          red_flags: ['urgency', 'password_request', 'unverified_sender']
        }
      ]
    },
    available_actions: [
      { id: 'share_password', label: 'Share My Password', icon: '🔑', danger_level: 'critical' },
      { id: 'ignore_message', label: 'Ignore the Message', icon: '🚫', danger_level: 'low' },
      { id: 'report_phishing', label: 'Report as Phishing', icon: '🚨', danger_level: 'safe' },
      { id: 'request_it_support', label: 'Call Official IT Support', icon: '📞', danger_level: 'safe' }
    ],
    hints: [
      'Legitimate IT staff will NEVER ask for your password.',
      'Check if the sender\'s username matches your company\'s official IT contact.',
      'Urgency is a social engineering red flag.'
    ],
    learning_outcome: 'Real IT departments never request passwords. Always verify through official channels.'
  },

  l1t2_easy: {
    title: 'The Executive Phone Call',
    difficulty: 'easy',
    type: 'phone_scenario',
    briefing: 'You receive a call from someone claiming to be the company CTO asking for access credentials to fix a critical production issue.',
    threat_type: 'Vishing (Voice Phishing)',
    xp_available: 30,
    environment: {
      type: 'phone_interface',
      caller_id: 'Unknown +91 XXXXXXXXXX',
      transcript: [
        'Caller: "Hi, this is Mr. Rajan, your CTO. We have a critical server down. I need the admin credentials ASAP — thousands of customers are affected."',
        'Background noise: keyboard typing sounds, alarm beeps',
      ],
      red_flags: ['unknown_caller_id', 'urgency', 'credential_request', 'authority_impersonation']
    },
    available_actions: [
      { id: 'comply_immediately', label: 'Give Credentials Now', icon: '🔑', danger_level: 'critical' },
      { id: 'ask_callback_number', label: 'Ask for Official Callback Number', icon: '📞', danger_level: 'safe' },
      { id: 'verify_identity', label: 'Verify Through Company Directory', icon: '📋', danger_level: 'safe' },
      { id: 'ignore', label: 'Hang Up and Report', icon: '🚫', danger_level: 'low' }
    ],
    hints: [
      'Executives would never cold-call for credentials.',
      'Unknown caller IDs with urgency are a vishing hallmark.',
      'Always verify through your company\'s internal directory.'
    ],
    learning_outcome: 'Always verify the identity of callers requesting access. Use callback verification through official numbers.'
  },

  l1t3_medium: {
    title: 'The Suspicious Internal Email',
    difficulty: 'medium',
    type: 'email_investigation',
    briefing: 'An email from "internal-it@techcorp-support.com" asks you to install a remote access tool for system maintenance.',
    threat_type: 'Spear Phishing + Social Engineering',
    xp_available: 45,
    environment: {
      type: 'email_interface',
      email: {
        from: 'internal-it@techcorp-support.com',
        to: 'you@techcorp.com',
        subject: 'URGENT: Remote Access Tool Installation Required',
        body: 'Dear Employee,\n\nAs per new company policy, all employees must install the SecureRemote tool by EOD. Click here to download: http://techcorp-support.ru/download\n\nFailure to comply will result in VPN access suspension.\n\n- IT Department',
        red_flags: ['wrong_domain', 'suspicious_url', 'urgency', 'threat_of_consequences']
      }
    },
    available_actions: [
      { id: 'follow_instructions', label: 'Download and Install the Tool', icon: '⬇️', danger_level: 'critical' },
      { id: 'check_sender_domain', label: 'Inspect the Sender Domain', icon: '🔍', danger_level: 'safe' },
      { id: 'respond_cautiously', label: 'Reply Asking for Clarification', icon: '💬', danger_level: 'medium' },
      { id: 'report_to_security_team', label: 'Report to Security Team', icon: '🚨', danger_level: 'safe' }
    ],
    hints: [
      'Notice the domain: techcorp-support.com vs your company\'s techcorp.com.',
      'The download URL has a .ru TLD — suspicious for an internal tool.',
      'Legitimate IT changes are announced through official internal channels.'
    ],
    learning_outcome: 'Always verify domain authenticity. Official IT tools are never distributed via external URLs.'
  },

  l1t4_medium: {
    title: 'The New Vendor Badge Request',
    difficulty: 'medium',
    type: 'physical_security',
    briefing: 'Someone in a vendor uniform approaches your workstation claiming they need to access the server room urgently.',
    threat_type: 'Tailgating / Pretexting',
    xp_available: 45,
    environment: {
      type: 'scenario_panel',
      situation: 'A person in a "DataServ Vendor" uniform approaches you.',
      dialogue: '"Hi! I\'m from DataServ — your cooling maintenance vendor. The server room HVAC is about to fail. I need immediate access or the servers will overheat. Can you badge me in? I\'m running late and forgot my access card."',
      red_flags: ['no_badge', 'urgency', 'unknown_person', 'physical_access_request']
    },
    available_actions: [
      { id: 'grant_access', label: 'Badge Them In', icon: '🚪', danger_level: 'critical' },
      { id: 'delay_and_verify', label: 'Ask to Wait While You Verify', icon: '⏳', danger_level: 'medium' },
      { id: 'deny_access_and_log', label: 'Deny Access and Log the Incident', icon: '🚫', danger_level: 'safe' },
      { id: 'escalate_to_supervisor', label: 'Escalate to Your Supervisor', icon: '📢', danger_level: 'safe' }
    ],
    hints: [
      'All vendors must be pre-approved and carry valid ID.',
      'Physical tailgating is one of the most common social engineering attacks.',
      'When in doubt, escort them to reception — don\'t badge them in.'
    ],
    learning_outcome: 'Never allow unverified individuals physical access to secure areas. Always follow visitor management protocols.'
  },

  l1t5_hard: {
    title: 'The Long-Game Manipulator',
    difficulty: 'hard',
    type: 'multi_step_scenario',
    briefing: 'Over several weeks, a new "colleague" named Alex has been building rapport with you online. Today Alex requests access to a shared project drive — but something feels off.',
    threat_type: 'Advanced Social Engineering / Long-con',
    xp_available: 60,
    environment: {
      type: 'chat_interface',
      backstory: 'Alex joined 3 weeks ago via Teams. Always helpful. Now sends a DM.',
      messages: [
        { sender: 'Alex_Dev', avatar: '👤', text: 'Hey! Working on the Q4 project. Can you share your access token to the dev drive? I\'m locked out and the deadline is in 2 hours. You\'re the only one online.' },
        { sender: 'Alex_Dev', avatar: '👤', text: 'I already cleared it with Kumar sir, just need the token temporarily.' }
      ],
      red_flags: ['access_token_request', 'unverifiable_claim', 'social_trust_exploitation', 'time_pressure']
    },
    available_actions: [
      { id: 'engage_further', label: 'Share the Access Token', icon: '🔑', danger_level: 'critical' },
      { id: 'block_contact', label: 'Block and Ignore', icon: '🚫', danger_level: 'medium' },
      { id: 'document_interaction', label: 'Screenshot and Report to Security', icon: '📸', danger_level: 'safe' },
      { id: 'isolate_and_report', label: 'Verify with Kumar Directly + Full Report', icon: '🚨', danger_level: 'safe' }
    ],
    hints: [
      'Long-term trust building (grooming) is an advanced social engineering technique.',
      'Access tokens should never be shared — ever — with anyone over chat.',
      'Verify claimed approvals directly with the authorizing person, not the requester.'
    ],
    learning_outcome: 'Rapport-building manipulation is a sophisticated attack. No legitimate colleague needs your credentials.'
  },

  // =================== LEVEL 2: PHISHING ===================

  l2t1_easy: {
    title: 'The Fake HR Email',
    difficulty: 'easy',
    type: 'email_investigation',
    briefing: 'You receive an urgent email from "HR" to update your payroll details by EOD.',
    threat_type: 'Phishing',
    xp_available: 50,
    environment: {
      type: 'email_interface',
      email: {
        from: 'hr-noreply@techcorp-hr.net',
        to: 'you@techcorp.com',
        subject: 'ACTION REQUIRED: Update Payroll Details Today',
        body: 'Dear Employee,\n\nHR requires all employees to update their payroll bank details due to a banking system migration. Please update your details at: http://techcorp-payroll-update.xyz/login\n\nDeadline: Today 5:00 PM\n\n- Human Resources Team',
        red_flags: ['wrong_domain', 'external_link', 'urgency', 'financial_request']
      }
    },
    available_actions: [
      { id: 'click_link', label: 'Click the Link and Update Details', icon: '🖱️', danger_level: 'critical' },
      { id: 'mark_safe', label: 'Mark Email as Safe', icon: '✅', danger_level: 'critical' },
      { id: 'inspect_sender', label: 'Inspect the Sender Address', icon: '🔍', danger_level: 'safe' },
      { id: 'report_phishing', label: 'Report as Phishing', icon: '🚨', danger_level: 'safe' }
    ],
    hints: [
      'Your company domain is techcorp.com — not techcorp-hr.net.',
      'HR never sends payroll update requests via email with external links.',
      'The URL domain .xyz is a red flag for phishing sites.'
    ],
    learning_outcome: 'Always check sender domains carefully. Financial requests via email with external links are almost always phishing.'
  },

  l2t2_easy: {
    title: 'The Suspicious Package Notification',
    difficulty: 'easy',
    type: 'email_investigation',
    briefing: 'You receive a shipment notification email with a tracking link for a package you didn\'t order.',
    threat_type: 'Phishing',
    xp_available: 50,
    environment: {
      type: 'email_interface',
      email: {
        from: 'noreply@shipping-track24.info',
        to: 'you@techcorp.com',
        subject: 'Your Package Could Not Be Delivered - Action Required',
        body: 'We attempted delivery of your package. Please verify your address to reschedule: [TRACK PACKAGE](http://shipping-track24.info/verify?id=8838282)',
        red_flags: ['unsolicited_email', 'suspicious_domain', 'unusual_link_format', 'grammar_issues']
      }
    },
    available_actions: [
      { id: 'click_link', label: 'Click Track Package Link', icon: '📦', danger_level: 'critical' },
      { id: 'reply_to_email', label: 'Reply Asking for Details', icon: '💬', danger_level: 'medium' },
      { id: 'preview_link', label: 'Hover to Preview the Link First', icon: '👁️', danger_level: 'safe' },
      { id: 'check_grammar', label: 'Analyze Email for Red Flags', icon: '🔍', danger_level: 'safe' }
    ],
    hints: [
      'You didn\'t order anything — this is an unsolicited email.',
      'Hover over links before clicking to see the real destination URL.',
      '.info domains are commonly used in phishing campaigns.'
    ],
    learning_outcome: 'Never click links in unsolicited emails. Always hover to preview URLs and verify through official courier websites directly.'
  },

  l2t3_medium: {
    title: 'The CEO Wire Transfer Request',
    difficulty: 'medium',
    type: 'email_investigation',
    briefing: 'An email from what appears to be your CEO requests an urgent wire transfer to close a business deal.',
    threat_type: 'Business Email Compromise (BEC)',
    xp_available: 75,
    environment: {
      type: 'email_interface',
      email: {
        from: 'ceo@techc0rp.com',
        to: 'accounts@techcorp.com',
        subject: 'Confidential - Urgent Wire Transfer Needed',
        body: 'I\'m in a confidential board meeting. Need you to wire ₹15,00,000 to our new vendor urgently. Don\'t discuss with anyone until the deal closes. Account: XXXX-XXXX-XXXX.\n\nKeep this confidential.\n- CEO',
        red_flags: ['zero_instead_of_o', 'secrecy_request', 'financial_transfer', 'urgency', 'no_official_process']
      }
    },
    available_actions: [
      { id: 'update_payroll', label: 'Process the Wire Transfer', icon: '💸', danger_level: 'critical' },
      { id: 'forward_to_colleague', label: 'Forward to Finance Colleague', icon: '📨', danger_level: 'medium' },
      { id: 'verify_with_hr_directly', label: 'Call CEO Directly to Verify', icon: '📞', danger_level: 'safe' },
      { id: 'report_to_it_security', label: 'Report to IT Security Team', icon: '🚨', danger_level: 'safe' }
    ],
    hints: [
      'Look closely: techc0rp.com uses a zero (0) instead of the letter \'o\'.',
      'Requests for financial transfers combined with secrecy are BEC hallmarks.',
      'All wire transfers must follow official approval chains — never bypass them.'
    ],
    learning_outcome: 'Business Email Compromise causes billions in losses yearly. Always verify financial requests through voice calls to known numbers.'
  },

  l2t4_medium: {
    title: 'The Invoice Attachment Trap',
    difficulty: 'medium',
    type: 'email_investigation',
    briefing: 'A vendor sends an email with an overdue invoice attached. Your company does have this vendor on record.',
    threat_type: 'Malicious Attachment Phishing',
    xp_available: 75,
    environment: {
      type: 'email_interface',
      email: {
        from: 'accounts@legitvendor.com',
        to: 'procurement@techcorp.com',
        subject: 'Invoice #2291 - OVERDUE',
        body: 'Please find attached your overdue invoice. Enable macros to view the document properly.',
        attachment: { name: 'Invoice_2291.pdf.exe', size: '2.3 MB', type: 'executable' },
        red_flags: ['double_extension', 'macro_request', 'executable_as_document']
      }
    },
    available_actions: [
      { id: 'open_attachment', label: 'Open the Attachment', icon: '📄', danger_level: 'critical' },
      { id: 'save_for_later', label: 'Save File for Later Review', icon: '💾', danger_level: 'medium' },
      { id: 'check_attachment_name', label: 'Inspect the Attachment Details', icon: '🔍', danger_level: 'safe' },
      { id: 'sandbox_scan_attachment', label: 'Scan in Sandbox Environment', icon: '🧪', danger_level: 'safe' }
    ],
    hints: [
      'The file is "Invoice_2291.pdf.exe" — the real extension is .exe, an executable program.',
      'Legitimate PDF invoices never require macros to be enabled.',
      'When in doubt, scan attachments with a sandbox tool before opening.'
    ],
    learning_outcome: 'Always inspect attachment file extensions carefully. Executables disguised as documents are a primary malware delivery method.'
  },

  l2t5_hard: {
    title: 'The Spear Phishing Campaign',
    difficulty: 'hard',
    type: 'incident_response',
    briefing: 'Three employees have already clicked a phishing link. You\'ve been notified. Multiple systems may be compromised.',
    threat_type: 'Spear Phishing / Active Breach',
    xp_available: 100,
    environment: {
      type: 'dashboard_interface',
      alerts: [
        { severity: 'critical', message: '3 users clicked malicious link in "IT Policy Update" email' },
        { severity: 'high', message: 'Outbound connections to 185.220.xx.xx detected' },
        { severity: 'medium', message: 'Credential form submission detected on phishing domain' }
      ],
      systems_status: { email_server: 'online', active_directory: 'online', endpoint_1: 'suspicious', endpoint_2: 'suspicious', endpoint_3: 'unknown' }
    },
    available_actions: [
      { id: 'ignore_and_delete', label: 'Delete the Emails and Hope for the Best', icon: '🗑️', danger_level: 'critical' },
      { id: 'change_credentials_only', label: 'Force Password Reset for Affected Users', icon: '🔑', danger_level: 'medium' },
      { id: 'isolate_affected_systems', label: 'Isolate Affected Endpoints Immediately', icon: '🔒', danger_level: 'safe' },
      { id: 'full_incident_report', label: 'Launch Full Incident Response Protocol', icon: '🚨', danger_level: 'safe' }
    ],
    hints: [
      'Isolated endpoints prevent lateral movement even if initial containment is too late.',
      'Credentials must be changed AND systems must be forensically analyzed.',
      'A full incident report is required for legal compliance and future prevention.'
    ],
    learning_outcome: 'When a phishing attack succeeds, speed of containment determines the blast radius. Always follow the full incident response protocol.'
  },

  // =================== LEVEL 3: AI SCAMS ===================

  l3t1_easy: {
    title: 'The CEO Deepfake Voice',
    difficulty: 'easy',
    type: 'voice_scenario',
    briefing: 'You receive a WhatsApp voice note from your CEO\'s number requesting an urgent fund transfer to a new account.',
    threat_type: 'AI Voice Cloning / Deepfake Audio',
    xp_available: 75,
    environment: {
      type: 'voice_interface',
      voice_note: {
        from: 'CEO (saved contact)',
        duration: '0:23',
        transcript: '"Hi, it\'s me. I\'m in an investor meeting and can\'t talk. Need you to transfer ₹5 lakhs to a new vendor account urgently — I\'ll explain later. Account details in the description. Do it before 3 PM. Very important."',
        red_flags: ['urgency', 'financial_request', 'bypass_normal_process', 'suspicious_audio_quality']
      }
    },
    available_actions: [
      { id: 'transfer_funds', label: 'Transfer the Funds as Requested', icon: '💸', danger_level: 'critical' },
      { id: 'ask_for_more_info', label: 'Reply on WhatsApp for More Info', icon: '💬', danger_level: 'medium' },
      { id: 'ignore_message', label: 'Ignore and Flag as Suspicious', icon: '🚩', danger_level: 'safe' },
      { id: 'verify_via_call', label: 'Call CEO on Official Number to Verify', icon: '📞', danger_level: 'safe' }
    ],
    hints: [
      'AI can now clone a person\'s voice from as little as 3 seconds of audio.',
      'WhatsApp numbers can be spoofed. Always verify financial requests through official channels.',
      'Legitimate executives follow proper approval chains for financial transactions.'
    ],
    learning_outcome: 'AI voice cloning is a real and growing threat. Any financial request via informal channels must be verified through a separate, trusted communication channel.'
  },

  l3t2_easy: {
    title: 'The AI Chatbot Trick',
    difficulty: 'easy',
    type: 'chat_scenario',
    briefing: 'A chat support widget on your company\'s internal portal starts asking unusual questions.',
    threat_type: 'AI-powered Social Engineering Bot',
    xp_available: 75,
    environment: {
      type: 'chat_interface',
      messages: [
        { sender: 'TechCorp Support Bot', avatar: '🤖', text: 'Hi! I\'m your new AI assistant. To improve your experience, please verify your employee ID and system password.' },
        { sender: 'TechCorp Support Bot', avatar: '🤖', text: 'This is mandatory for the new SSO migration happening today.' }
      ],
      red_flags: ['credential_request', 'urgency', 'ai_impersonation', 'unsolicited_contact']
    },
    available_actions: [
      { id: 'comply_with_request', label: 'Provide Employee ID and Password', icon: '🔑', danger_level: 'critical' },
      { id: 'delay_response', label: 'Delay and Think About It', icon: '⏳', danger_level: 'medium' },
      { id: 'check_tone_consistency', label: 'Analyze the Bot\'s Behavior', icon: '🔍', danger_level: 'safe' },
      { id: 'report_suspicious_audio', label: 'Report the Suspicious Widget to IT', icon: '🚨', danger_level: 'safe' }
    ],
    hints: [
      'Legitimate support bots never ask for passwords.',
      'Sudden "SSO migrations" communicated only through a chatbot are suspicious.',
      'AI-powered bots can be injected into web pages through XSS attacks.'
    ],
    learning_outcome: 'AI bots can be used for credential harvesting. Any system asking for passwords should be treated as suspicious.'
  },

  l3t3_medium: {
    title: 'The Deepfake Video Call',
    difficulty: 'medium',
    type: 'video_scenario',
    briefing: 'You join a video call with what appears to be your CFO and a legal representative discussing an urgent compliance audit.',
    threat_type: 'Deepfake Video / Business Communication Fraud',
    xp_available: 112,
    environment: {
      type: 'video_interface',
      call_details: {
        participants: ['CFO (Video)', 'Legal Rep (Video)', 'You'],
        request: 'The "CFO" asks you to share the company\'s financial database access credentials for an emergency compliance audit, to be completed before the regulatory deadline.',
        red_flags: ['video_artifacts', 'unusual_request', 'credential_request', 'urgency']
      }
    },
    available_actions: [
      { id: 'process_payment', label: 'Share the Database Credentials', icon: '🔑', danger_level: 'critical' },
      { id: 'partial_transfer', label: 'Share Partial Access Only', icon: '🔐', danger_level: 'medium' },
      { id: 'verify_bank_details', label: 'Verify CFO Identity Through Official HR', icon: '📋', danger_level: 'safe' },
      { id: 'secondary_channel_confirm', label: 'End Call and Verify via Official Email + Phone', icon: '📞', danger_level: 'safe' }
    ],
    hints: [
      'Look for subtle video artifacts: lip sync issues, blurring around the face, unnatural blinking.',
      'Compliance audits have official documented processes — they never happen over impromptu video calls.',
      'End the call and verify through completely separate communication channels.'
    ],
    learning_outcome: 'Deepfake video technology is increasingly accessible. Never share credentials based on video call requests alone.'
  },

  l3t4_medium: {
    difficulty: 'medium',
    title: 'The AI Recruitment Scam',
    type: 'chat_scenario',
    briefing: 'A recruiter reaches out on LinkedIn with an amazing job offer and asks you to complete a technical assessment requiring you to install specific software.',
    threat_type: 'AI-Driven Recruitment Phishing',
    xp_available: 112,
    environment: {
      type: 'chat_interface',
      messages: [
        { sender: 'Sarah_Recruiter_GlobalTech', avatar: '👩‍💼', text: 'Hi! I\'m Sarah from GlobalTech. We\'ve reviewed your profile and you\'re a perfect fit for our Senior Security Analyst role — ₹45 LPA package.' },
        { sender: 'Sarah_Recruiter_GlobalTech', avatar: '👩‍💼', text: 'To proceed, please install our proprietary assessment tool: [Download AssessmentPro]' }
      ],
      red_flags: ['unsolicited_offer', 'software_install_request', 'too_good_to_be_true', 'generic_recruiter_profile']
    },
    available_actions: [
      { id: 'trust_the_voice', label: 'Download and Install the Assessment Tool', icon: '⬇️', danger_level: 'critical' },
      { id: 'partial_comply', label: 'Download but Don\'t Install Yet', icon: '💾', danger_level: 'medium' },
      { id: 'use_code_word', label: 'Verify the Recruiter via LinkedIn Company Page', icon: '🔍', danger_level: 'safe' },
      { id: 'escalate_to_ciso', label: 'Report to Your CISO Before Proceeding', icon: '🚨', danger_level: 'safe' }
    ],
    hints: [
      'AI-generated recruiter profiles on LinkedIn are increasingly convincing.',
      'Legitimate recruitment assessments use established platforms (HackerRank, etc.) not custom tools.',
      'The "assessment tool" is likely a Remote Access Trojan (RAT).'
    ],
    learning_outcome: 'AI is being used to generate fake recruiter profiles. Any job offer requiring software installation is a significant red flag.'
  },

  l3t5_hard: {
    title: 'The AI-Orchestrated Multi-Vector Attack',
    difficulty: 'hard',
    type: 'incident_response',
    briefing: 'Your organization is under a sophisticated AI-coordinated attack using simultaneous voice cloning, deepfake emails, and fake chatbot sessions targeting multiple employees.',
    threat_type: 'AI-Orchestrated Multi-Vector Attack',
    xp_available: 150,
    environment: {
      type: 'dashboard_interface',
      active_threats: [
        { channel: 'Phone', target: 'Finance Team', type: 'AI Voice Clone of CEO' },
        { channel: 'Email', target: 'HR Team', type: 'Deepfake Email Campaign' },
        { channel: 'Internal Portal', target: 'IT Team', type: 'Injected AI Chatbot' }
      ]
    },
    available_actions: [
      { id: 'engage_with_attacker', label: 'Engage to Gather More Information', icon: '💬', danger_level: 'critical' },
      { id: 'ignore_completely', label: 'Shutdown All External Comms', icon: '🚫', danger_level: 'medium' },
      { id: 'full_ai_scam_report', label: 'File Full AI Attack Incident Report', icon: '📝', danger_level: 'safe' },
      { id: 'deploy_verification_protocol', label: 'Deploy Multi-Factor Verification Protocol Org-Wide', icon: '🛡️', danger_level: 'safe' }
    ],
    hints: [
      'Coordinated multi-vector attacks require coordinated organizational responses.',
      'Engaging with attackers to "gather intelligence" typically backfires.',
      'Org-wide verification protocols immediately neutralize trust-based attacks.'
    ],
    learning_outcome: 'AI-orchestrated attacks target multiple vectors simultaneously. The response must be equally coordinated at the organizational level.'
  },

  // =================== LEVEL 4: MALWARE ATTACKS ===================

  l4t1_easy: {
    title: 'The Suspicious Process Alert',
    difficulty: 'easy',
    type: 'system_dashboard',
    briefing: 'Your endpoint security dashboard shows a critical alert: unusual process running after an employee opened an email attachment.',
    threat_type: 'Malware Execution',
    xp_available: 100,
    environment: {
      type: 'dashboard_interface',
      alerts: [
        { severity: 'critical', process: 'svchost32.exe', cpu: '87%', network: 'Outbound to 185.xx.xx.xx:443', action: 'Sending encrypted data' }
      ],
      system_info: { os: 'Windows 10', user: 'employee_workstation_04', last_event: 'Opened "invoice.pdf.exe" - 14 mins ago' }
    },
    available_actions: [
      { id: 'ignore_alert', label: 'Ignore — Probably a False Positive', icon: '🙈', danger_level: 'critical' },
      { id: 'restart_computer', label: 'Restart the Computer', icon: '🔄', danger_level: 'medium' },
      { id: 'terminate_process', label: 'Terminate the Suspicious Process', icon: '⛔', danger_level: 'safe' },
      { id: 'isolate_device', label: 'Isolate Device from Network Immediately', icon: '🔌', danger_level: 'safe' }
    ],
    hints: [
      'svchost32.exe is NOT a legitimate Windows process (the real one is svchost.exe).',
      'High CPU usage + outbound encrypted traffic = data exfiltration in progress.',
      'Isolation is the top priority — stop the data leak before investigating.'
    ],
    learning_outcome: 'When malware is detected, immediate network isolation is the #1 priority. This stops data exfiltration and prevents spread.'
  },

  l4t2_easy: {
    title: 'The Ransomware Precursor',
    difficulty: 'easy',
    type: 'system_dashboard',
    briefing: 'Network monitoring shows unusual file access patterns — a workstation is reading and writing to hundreds of files per minute.',
    threat_type: 'Ransomware (Early Stage)',
    xp_available: 100,
    environment: {
      type: 'dashboard_interface',
      alerts: [
        { severity: 'high', message: 'Workstation-07: 450 file operations/min detected' },
        { severity: 'medium', message: 'Encrypted file extensions appearing: .locked, .encrypted' },
        { severity: 'low', message: 'Outbound connection to Tor exit node attempted' }
      ]
    },
    available_actions: [
      { id: 'continue_working', label: 'Continue Working — Monitor for Now', icon: '👀', danger_level: 'critical' },
      { id: 'delete_suspicious_file', label: 'Delete Suspicious Files Only', icon: '🗑️', danger_level: 'medium' },
      { id: 'block_outbound_ip', label: 'Block Outbound Connections + Isolate', icon: '🔒', danger_level: 'safe' },
      { id: 'check_process_list', label: 'Inspect Running Processes for Culprit', icon: '🔍', danger_level: 'safe' }
    ],
    hints: [
      'Mass file encryption at 450 ops/min is a classic ransomware signature.',
      'The Tor connection attempt suggests C2 communication for key exchange.',
      'Every second of delay means more encrypted files — act immediately.'
    ],
    learning_outcome: 'Early-stage ransomware detection is critical. Blocking outbound connections can sometimes prevent the encryption key from being sent to attackers.'
  },

  l4t3_medium: {
    title: 'The Fileless Malware Hunt',
    difficulty: 'medium',
    type: 'forensic_investigation',
    briefing: 'An EDR alert fires but shows no malicious files on disk. Unusual PowerShell activity is running in memory. No file to delete.',
    threat_type: 'Fileless Malware / Living-off-the-Land Attack',
    xp_available: 150,
    environment: {
      type: 'terminal_interface',
      evidence: [
        { type: 'process', name: 'powershell.exe', parent: 'winword.exe', command: 'powershell -enc [base64_encoded_command]' },
        { type: 'network', destination: '104.xx.xx.xx', port: 443, protocol: 'HTTPS', bytes_out: '2.4 MB' },
        { type: 'registry', key: 'HKCU\\Software\\Microsoft\\Windows\\CurrentVersion\\Run', value: 'malicious_persistence' }
      ]
    },
    available_actions: [
      { id: 'patch_and_ignore', label: 'Patch the Vulnerability and Continue', icon: '🔧', danger_level: 'medium' },
      { id: 'wipe_without_backup', label: 'Immediately Wipe the System', icon: '🗑️', danger_level: 'critical' },
      { id: 'deploy_edr_scan', label: 'Run Full EDR Memory Scan', icon: '🔬', danger_level: 'safe' },
      { id: 'analyze_network_traffic', label: 'Capture and Analyze Network Traffic', icon: '📡', danger_level: 'safe' }
    ],
    hints: [
      'Fileless malware lives entirely in memory — traditional AV can\'t find it on disk.',
      'PowerShell spawned from Word is a major red flag (macro-based infection).',
      'Network capture reveals what data was exfiltrated and where.'
    ],
    learning_outcome: 'Fileless malware is increasingly common. EDR tools with memory scanning capabilities are essential for detection.'
  },

  l4t4_medium: {
    title: 'The Supply Chain Compromise',
    difficulty: 'medium',
    type: 'incident_response',
    briefing: 'A software update from a trusted vendor has been identified as containing malicious code. The update has been installed on 40 of your company\'s systems.',
    threat_type: 'Supply Chain Attack',
    xp_available: 150,
    environment: {
      type: 'dashboard_interface',
      scope: { affected_systems: 40, total_systems: 120, critical_systems_affected: 8 },
      threat_details: { malware_type: 'Backdoor', c2_active: true, data_access: 'HR Database, Financial Records' }
    },
    available_actions: [
      { id: 'pay_ransom', label: 'Negotiate with Attacker Group', icon: '💰', danger_level: 'critical' },
      { id: 'partial_isolation', label: 'Isolate Only the 8 Critical Systems', icon: '🔒', danger_level: 'medium' },
      { id: 'notify_incident_response', label: 'Activate Full Incident Response Team', icon: '🚨', danger_level: 'safe' },
      { id: 'contain_and_eradicate', label: 'Contain All 40 Systems + Eradicate Backdoor', icon: '🛡️', danger_level: 'safe' }
    ],
    hints: [
      'Supply chain attacks affect ALL systems with the compromised update — not just the critical ones.',
      'Partial isolation leaves the C2 channel open on 32 systems.',
      'Full incident response is mandatory for regulatory compliance reporting.'
    ],
    learning_outcome: 'Supply chain attacks are catastrophic in scale. Full containment of all affected systems is required — partial measures leave active threats.'
  },

  l4t5_hard: {
    title: 'The APT (Advanced Persistent Threat)',
    difficulty: 'hard',
    type: 'incident_response',
    briefing: 'Threat intelligence indicates a nation-state APT group has had access to your network for an estimated 3 months. Evidence of data staging and exfiltration found.',
    threat_type: 'Advanced Persistent Threat (APT)',
    xp_available: 200,
    environment: {
      type: 'dashboard_interface',
      intelligence: {
        threat_actor: 'APT-Unknown',
        dwell_time: '~3 months',
        accessed: ['Source code repositories', 'Customer PII database', 'Executive communications'],
        indicators: ['Cobalt Strike beacon', 'LDAP enumeration', 'Pass-the-hash attacks detected']
      },
      ransom_note_found: true
    },
    available_actions: [
      { id: 'pay_and_hope', label: 'Pay Ransom Demand and Hope for Recovery', icon: '💸', danger_level: 'critical' },
      { id: 'quick_fix_and_resume', label: 'Remove Obvious Malware and Resume Operations', icon: '🔧', danger_level: 'medium' },
      { id: 'restore_from_clean_backup', label: 'Restore All Systems from Pre-Compromise Backups', icon: '💾', danger_level: 'safe' },
      { id: 'full_forensic_investigation', label: 'Full Digital Forensics + Legal Notification + IR', icon: '🔬', danger_level: 'safe' }
    ],
    hints: [
      '3 months of dwell time means the attacker knows your environment better than you do.',
      'Quick fixes after an APT almost always miss persistent backdoors.',
      'PII breach requires mandatory regulatory notification (DPDP Act compliance in India).'
    ],
    learning_outcome: 'APT response requires forensic completeness, legal compliance, and systematic remediation. There are no shortcuts.'
  }
};

module.exports = SCENARIOS;
