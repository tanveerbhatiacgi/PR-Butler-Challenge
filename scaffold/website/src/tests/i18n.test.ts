import { beforeEach, describe, expect, it } from 'vitest'
import english from '../translations/en.json'
import french from '../translations/fr.json'
import { getCurrentLanguage, loadTranslations, setLanguage, t } from '../i18n'

function flattenEntries(
  value: Record<string, unknown>,
  prefix = ''
): Array<[string, string]> {
  return Object.entries(value).flatMap(([key, entry]) => {
    const path = prefix ? `${prefix}.${key}` : key
    if (entry !== null && typeof entry === 'object' && !Array.isArray(entry)) {
      return flattenEntries(entry as Record<string, unknown>, path)
    }
    return [[path, String(entry)]]
  })
}

describe('translations', () => {
  beforeEach(() => {
    setLanguage('en')
  })

  it('provides all English keys in French with matching interpolation tokens', () => {
    const englishEntries = flattenEntries(english)
    const frenchEntries = flattenEntries(french)
    const englishValues = new Map(englishEntries)
    const frenchValues = new Map(frenchEntries)

    expect([...frenchValues.keys()].sort()).toEqual([...englishValues.keys()].sort())

    for (const [key, englishValue] of englishValues) {
      const frenchValue = frenchValues.get(key)
      expect(frenchValue).toBeDefined()
      expect(frenchValue?.match(/\{\{?\s*[\w.]+\s*\}\}?|%[sd]/g) ?? [])
        .toEqual(englishValue.match(/\{\{?\s*[\w.]+\s*\}\}?|%[sd]/g) ?? [])
    }
  })

  it('loads static locale data and returns values for the selected language', async () => {
    await expect(loadTranslations()).resolves.toBeUndefined()
    expect(getCurrentLanguage()).toBe('en')
    expect(t('app.title')).toBe('My Task Manager')

    setLanguage('fr')

    expect(getCurrentLanguage()).toBe('fr')
    expect(t('app.title')).toBe('Mon Gestionnaire de Tâches')
  })

  it('falls back to the key for missing translations or unsupported locales', () => {
    setLanguage('fr')
    expect(t('missing.key')).toBe('missing.key')

    setLanguage('es')
    expect(t('app.title')).toBe('app.title')
  })
})