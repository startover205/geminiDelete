export const SUPPORTED_LANGUAGES = ['en', 'zh_TW', 'zh_CN', 'ja', 'ko', 'es', 'fr', 'ru', 'ar'] as const;
export type AppLanguage = typeof SUPPORTED_LANGUAGES[number];

export function normalizeLanguage(browserLang: string): AppLanguage {
  const lang = browserLang.toLowerCase().replace('_', '-');
  
  if (lang.startsWith('zh-tw') || lang.startsWith('zh-hk')) return 'zh_TW';
  if (lang.startsWith('zh')) return 'zh_CN';
  if (lang.startsWith('ja')) return 'ja';
  if (lang.startsWith('ko')) return 'ko';
  if (lang.startsWith('es')) return 'es';
  if (lang.startsWith('fr')) return 'fr';
  if (lang.startsWith('ru')) return 'ru';
  if (lang.startsWith('ar')) return 'ar';
  
  return 'en';
}

export function getNextLanguage(current: AppLanguage): AppLanguage {
  const currentIndex = SUPPORTED_LANGUAGES.indexOf(current);
  const nextIndex = (currentIndex + 1) % SUPPORTED_LANGUAGES.length;
  return SUPPORTED_LANGUAGES[nextIndex];
}
