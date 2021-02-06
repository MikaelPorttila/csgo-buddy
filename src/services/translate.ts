import * as https from 'https';
import { Translation, LanguageIso } from '../types';

const translationCache: any = {};
export async function translate(
  language: string,
  message: string
): Promise<Translation> {
  return new Promise<Translation>((resolve, reject) => {
    const cacheResult = translationCache[message] as Translation | undefined;
    if (cacheResult) {
      resolve(cacheResult);
      return;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodedMessage}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const response = (JSON.parse(data) as [[[string, string]],null, string, null]);
        const [translation, _, language, __] = response;
        const [engText, originalText] = translation[0];
        const result = new Translation(language as LanguageIso, engText);
        translationCache[message] = result;
        resolve(result);
      });
      res.on('error', () => {
        console.log('failed to translate', message);
        reject()
      });
    });
  });
}
