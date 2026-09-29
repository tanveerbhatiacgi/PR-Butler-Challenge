import { Translations } from './types'
import enTranslations from './translations/en.json'
import frTranslations from './translations/fr.json'

let currentLanguage = 'en'
const translations: Translations = {
  en: enTranslations,
  fr: frTranslations
}

/** Resolves once the statically imported locale data is ready for use. */
export async function loadTranslations(): Promise<void> {
  return Promise.resolve()
}

/** Sets the locale used by subsequent translation lookups.
 * @param lang - Locale code used to select the translation dictionary.
 */
export function setLanguage(lang: string): void {
  currentLanguage = lang
}

/** Returns the localized value for a key, or the key when no value exists.
 * @param key - Translation key to look up in the active locale.
 */
export function t(key: string): string {
  return translations[currentLanguage]?.[key] || key
}

/** Returns the currently selected locale code. */
export function getCurrentLanguage(): string {
  return currentLanguage
}
