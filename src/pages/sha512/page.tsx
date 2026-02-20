import {css} from "@emotion/css";
import {langEn, SymbolUnknown} from "@pnnh/atom";
import Sha512Component from "./sha512";
import {useParams} from "react-router";
import {defaultLanguage, getTargetLang} from "@/locales/language.tsx";
import {useEffect} from "react";
import {transKey} from "@/locales/normal.ts";
import {ToolsLayout} from "@/layout/layout.tsx";

const pageStyles = {
    sha512Page: css`
        width: 960px;
        margin: 0 auto;
    `
}

export function Sha512Page( ) {

    let { lang } = useParams();
    if (!lang) {
        lang = getTargetLang(navigator.language, defaultLanguage)
    }
    useEffect(() => {
        document.documentElement.lang = lang
        document.title = transKey(lang, 'tools.sha512.name')
        const descEl = document.querySelector('meta[name="description"]')
        if (descEl) {
            descEl.setAttribute('content', transKey(lang, 'tools.sha512.description'));
        }
    }, [lang]);
    return <ToolsLayout lang={lang} >
        <div className={pageStyles.sha512Page}>
            <Sha512Component lang={lang} />
        </div>
    </ToolsLayout>
}
