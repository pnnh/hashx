export const langEnUS = 'en'
export const langEsES = 'es'   // Spanish
export const langFrFR = 'fr'   // French
export const langJaJP = 'ja'   // Japanese
export const langPtPT = 'pt-PT' // Portuguese
export const langZhCN = 'zh'

export type LangKeyType =
    typeof langEnUS |
    typeof langEsES |
    typeof langFrFR |
    typeof langJaJP |
    typeof langZhCN |
    typeof langPtPT

export type LangTextValue = {
    [key in LangKeyType]: string
}

export const defaultLanguage = langEnUS
export const unknownLanguage = 'unknown'

export const supportedLanguages = [
    { key: langEnUS, name: 'English' },
    { key: langEsES, name: 'Español' },
    { key: langFrFR, name: 'Français' },
    { key: langPtPT, name: 'Português' },
    { key: langJaJP, name: '日本語' },
    { key: langZhCN, name: '简体中文' },
]

export function getLangInfo(lang: string): { key: string, name: string } | undefined {
    const targetLang = getTargetLang(lang, defaultLanguage)
    return supportedLanguages.find(item => item.key === targetLang)
}

export function getTargetLang(wantLang: string, fallbackLang: string): string {
    wantLang = wantLang.trim()
    if (supportedLanguages.findIndex(item => item.key === wantLang) !== -1) {
        return wantLang
    }
    return fallbackLang
}

export function getLangFromUrl(url: string): string | undefined {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/')
    let hasLang = false
    for (const item of supportedLanguages) {
        if (segments[1] === item.key) {
            hasLang = true
        }
    }
    if (hasLang) {
        return segments[1]
    }
    return undefined
}

export function replaceLangInUrl(url: string, lang: string): string {
    const urlObj = new URL(url);
    const segments = urlObj.pathname.split('/')
    if (segments.length >= 1) {
        let hasLang = false
        for (const item of supportedLanguages) {
            if (segments[1] === item.key) {
                hasLang = true
            }
        }
        if (hasLang) {
            urlObj.pathname = `/${lang}` + urlObj.pathname.substring(segments[1].length + 1)
        } else {
            urlObj.pathname = `/${lang}` + urlObj.pathname
        }
    } else {
        urlObj.pathname = `/${lang}`
    }
    return urlObj.toString()
}

export function isSupportedLanguage(lang: string): boolean {
    return supportedLanguages.findIndex(item => item.key === lang) !== -1
}
