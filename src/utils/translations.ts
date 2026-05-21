import enMessages from '../locales/en/messages.json';
import zhTWMessages from '../locales/zh_TW/messages.json';
import zhCNMessages from '../locales/zh_CN/messages.json';
import jaMessages from '../locales/ja/messages.json';
import koMessages from '../locales/ko/messages.json';
import esMessages from '../locales/es/messages.json';
import frMessages from '../locales/fr/messages.json';
import ruMessages from '../locales/ru/messages.json';
import arMessages from '../locales/ar/messages.json';

import { AppLanguage } from './language';

type RawLocaleMessages = typeof enMessages;
export type TranslationKey = keyof RawLocaleMessages;
export type Translation = Record<TranslationKey, string>;

function extractTranslations<M extends Record<string, { message: string }>>(
  raw: M,
): Record<keyof M, string> {
  const out = {} as Record<keyof M, string>;
  for (const key of Object.keys(raw) as Array<keyof M>) {
    out[key] = raw[key].message;
  }
  return out;
}

export const TRANSLATIONS: Record<AppLanguage, Translation> = {
  en: extractTranslations(enMessages),
  zh_TW: extractTranslations(zhTWMessages),
  zh_CN: extractTranslations(zhCNMessages),
  ja: extractTranslations(jaMessages),
  ko: extractTranslations(koMessages),
  es: extractTranslations(esMessages),
  fr: extractTranslations(frMessages),
  ru: extractTranslations(ruMessages),
  ar: extractTranslations(arMessages),
};

export function t(key: TranslationKey, lang: AppLanguage): string {
  return TRANSLATIONS[lang]?.[key] ?? TRANSLATIONS.en[key] ?? key;
}
