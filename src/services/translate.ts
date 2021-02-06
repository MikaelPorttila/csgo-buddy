import * as https from 'https';

const translationCache: any = {};
export async function translate(
  language: string,
  message: string,
  ignoreList?: string[]
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const cacheResult = translationCache[message];
    if (cacheResult) {
      console.log('[translate]: Cache hit');
      resolve(cacheResult);
      return;
    }
    console.log('[translate]: Cache miss');

    const encodedMessage = encodeURIComponent(message);
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${language}&dt=t&q=${encodedMessage}"`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        const [engText, orgText] = (JSON.parse(data) as [[[string, string]]])[0][0];
        translationCache[message] = engText;
        resolve(engText);
      });
      res.on('error', () => reject());
    });
  });
}
