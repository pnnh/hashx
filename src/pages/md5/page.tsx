import React, {useEffect} from 'react'
import {css} from "@emotion/css";
import Md5Component from "./md5";
import {ToolsLayout} from "@/layout/layout.tsx";
import {useParams} from "react-router";
import {transKey} from "@/locales/normal.ts";
import {defaultLanguage, getTargetLang, isSupportedLanguage} from "@/locales/language.tsx";
import {NotFoundPage} from "@/pages/notFound.tsx";

const pageStyles = {
    md5Page: css`
        width: 960px;
        margin: 0 auto;
    `,
    productTitle: css`
        font-size: 1.5rem;
        font-weight: 600;
        margin-bottom: 1rem;
    `,
    commentsClient: css`
        margin-top: 2rem;
    `
}

export default function Md5Page( ) {
    let { lang } = useParams();
    if (!lang) {
        lang = getTargetLang(navigator.language, defaultLanguage)
    } else if (!isSupportedLanguage(lang)) {
        return <NotFoundPage/>
    }
    useEffect(() => {
        document.documentElement.lang = lang
        document.title = transKey(lang, 'tools.md5.name')
        const descEl = document.querySelector('meta[name="description"]')
        if (descEl) {
            descEl.setAttribute('content', transKey(lang, 'tools.md5.description'));
        }
    }, [lang]);
    return <ToolsLayout lang={lang}>
        <div className={pageStyles.md5Page}>
            <h1 className={pageStyles.productTitle}>{transKey(lang, "tools.md5.name")}</h1>
            <Md5Component lang={lang}/>
        </div>
    </ToolsLayout>
}
