export class Translation {
  constructor(
    public language: LanguageIso,
    public text: string
  ) {}
}

// ISO
export enum LanguageIso {
  English = 'en',
  Russia = 'ru',
  Swedish = 'sv',
  Danish = 'da',
  Norwegian = 'no'
}