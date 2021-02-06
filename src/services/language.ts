const langDetect = require('langdetect');

export function detectLanguage(text: string): string | null {
  const detectionResult = langDetect.detect(text);
  const result = detectionResult.length > 0 ? detectionResult[0].lang : null;
  return result;
}
