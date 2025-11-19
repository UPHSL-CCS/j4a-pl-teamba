const filipinoIndicators = [
  'kailan',
  'paano',
  'doktor',
  'gamot',
  'sakit',
  'lagnat',
  'ubo',
  'pasiguro',
  'pamilya',
  'barangay',
  'kumusta',
  'salamat',
];

const stopWords = new Set([
  'the',
  'a',
  'an',
  'is',
  'are',
  'was',
  'were',
  'ako',
  'ikaw',
  'siya',
  'and',
  'or',
  'pero',
  'kasi',
  'with',
  'for',
  'please',
  'thank',
  'thanks',
  'hello',
  'hi',
]);

const filipinoToEnglishDictionary = {
  lagnat: 'fever',
  ubo: 'cough',
  sipon: 'cold',
  hilo: 'dizzy',
  sakit: 'pain',
  tiyan: 'stomach',
  ulo: 'head',
  gamot: 'medicine',
  appointment: 'appointment',
  doktor: 'doctor',
  pasyente: 'patient',
  buntis: 'pregnant',
  gamotin: 'treat',
};

const englishToFilipinoDictionary = Object.fromEntries(
  Object.entries(filipinoToEnglishDictionary).map(([fil, eng]) => [eng, fil])
);

export function detectLanguage(text) {
  const normalized = text.toLowerCase();
  const matches = filipinoIndicators.filter((word) => normalized.includes(word));
  if (matches.length >= 2) {
    return 'fil';
  }
  return 'en';
}

export function translateToEnglish(text) {
  return text
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      return filipinoToEnglishDictionary[lower] || word;
    })
    .join(' ');
}

export function translateToFilipino(text) {
  return text
    .split(/\s+/)
    .map((word) => {
      const lower = word.toLowerCase();
      return englishToFilipinoDictionary[lower] || word;
    })
    .join(' ');
}

export function extractKeywords(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((token) => token && !stopWords.has(token))
    .slice(0, 12);
}


