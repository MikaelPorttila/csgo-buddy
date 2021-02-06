import languagedetect from 'languagedetect';
const langDetector = new languagedetect();

export function detectLanguage(text: string): string | null {
  let result = null;
  const detectionResult = langDetector.detect(text, 1);

  if (detectionResult.length > 0) {
    const [language, float] = detectionResult[0];
    result = language;
  }

  return result;
}
