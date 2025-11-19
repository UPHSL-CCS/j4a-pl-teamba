const symptomRules = [
  {
    keywords: ['fever', 'cough', 'cold', 'body', 'aches'],
    severity: 'moderate',
    advice:
      'You may be experiencing flu-like symptoms. Stay hydrated, rest, and monitor your temperature. Book a consultation if symptoms persist beyond 3 days.',
    recommendedActions: ['Book Appointment', 'Request Medicine', 'View Doctors'],
    possibleConditions: ['Seasonal Flu', 'Viral Infection'],
  },
  {
    keywords: ['chest', 'pain', 'pressure', 'breath', 'shortness'],
    severity: 'emergency',
    advice:
      'This could be a medical emergency. Contact emergency services or visit the nearest hospital immediately.',
    recommendedActions: ['Emergency Contacts', 'Call Hotline'],
    possibleConditions: ['Cardiac Event', 'Severe Asthma'],
  },
  {
    keywords: ['headache', 'migraine', 'dizzy', 'stress'],
    severity: 'mild',
    advice:
      'Headaches can be caused by stress or dehydration. Rest in a quiet room and drink water. If pain worsens, book a consultation.',
    recommendedActions: ['Book Appointment', 'Health Tips'],
    possibleConditions: ['Migraine', 'Dehydration'],
  },
  {
    keywords: ['pregnant', 'prenatal', 'baby'],
    severity: 'advisory',
    advice:
      'For prenatal concerns, please coordinate with our maternal health unit. We can help schedule an appointment with an OB-GYN.',
    recommendedActions: ['Book Appointment', 'Contact Clinic'],
    possibleConditions: ['Prenatal Care'],
  },
];

export function analyzeSymptoms(keywords = []) {
  const normalized = keywords.map((kw) => kw.toLowerCase());

  for (const rule of symptomRules) {
    const matches = rule.keywords.filter((keyword) => normalized.includes(keyword));
    if (matches.length >= Math.ceil(rule.keywords.length * 0.3)) {
      return {
        severity: rule.severity,
        advice: rule.advice,
        suggestedActions: rule.recommendedActions,
        possibleConditions: rule.possibleConditions,
        confidence: Math.min(0.6 + matches.length * 0.1, 0.95),
      };
    }
  }

  return {
    severity: 'general',
    advice:
      'I can help with general health guidance. Could you tell me more about your symptoms or concerns?',
    suggestedActions: ['Book Appointment', 'View FAQ'],
    possibleConditions: [],
    confidence: 0.4,
  };
}


