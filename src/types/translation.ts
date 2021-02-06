import { LanguageIso } from '.';

export class Translation {
  constructor(
    public language: LanguageIso,
    public text: string
  ) {}
}
