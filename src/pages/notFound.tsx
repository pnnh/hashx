import {transKey} from "@/locales/normal.ts";
import {defaultLanguage, getTargetLang} from "@/locales/language.tsx";

export function NotFoundPage() {
    const lang = getTargetLang(navigator.language, defaultLanguage)
    return (
        <div style={{textAlign: 'center', marginTop: '20vh'}}>
            <h1>{transKey(lang, 'PageNotFound')}</h1>
            <a href={'/'}>{transKey(lang, 'GoBackHome')}</a>
        </div>
    )
}
