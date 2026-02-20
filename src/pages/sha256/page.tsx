import {css} from "@emotion/css";
import Hash256Component from "./hash256";
import {ToolsLayout} from "@/layout/layout.tsx";
import {useParams} from "react-router";
import {defaultLanguage, getTargetLang} from "@/locales/language.tsx";
import {useEffect} from "react";
import {transKey} from "@/locales/normal.ts";

const pageStyles = {
    pageContainer: css`
        width: 960px;
        margin: 0 auto;
    `
}

export  function Sha256Page( ) {
    let { lang } = useParams();
    if (!lang) {
        lang = getTargetLang(navigator.language, defaultLanguage)
    }
    useEffect(() => {
        document.documentElement.lang = lang
        document.title = transKey(lang, 'tools.sha256.name')
        const descEl = document.querySelector('meta[name="description"]')
        if (descEl) {
            descEl.setAttribute('content', transKey(lang, 'tools.sha256.description'));
        }
    }, [lang]);
    return <ToolsLayout lang={lang} >
        <div className={pageStyles.pageContainer}>
            <Hash256Component lang={lang} />
        </div>
    </ToolsLayout>
}
