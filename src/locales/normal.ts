import {langDeDE, langEsES, langFrFR, langJaJP, langPtPT, langZhCN, langZhTW} from "./language"
import {TransTexts} from "./texts";

export function transKey(lang: string, keyName: keyof typeof TransTexts): string {
    const langText = TransTexts[keyName]
    if (!langText) {
        throw new Error('Translation key not found: ' + keyName)
    }
    switch (lang) {
        case langZhCN:
            return langText.zh
        case langJaJP:
            return langText.ja
        case langEsES:
            return langText.es
        case langFrFR:
            return langText.fr
        case langDeDE:
            return langText["de-DE"]
        case langPtPT:
            return langText["pt-PT"]
        case langZhTW:
            return langText["zh-TW"]
    }
    // Fallback to English
    return langText.en
}
