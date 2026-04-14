import { useEffect } from 'react'
import { css } from '@emotion/css'
import Md5Component from './md5'
import { ToolsLayout } from '@/layout/layout'
import { useParams } from 'react-router'
import { transKey } from '@/locales/normal'
import { defaultLanguage, getTargetLang, isSupportedLanguage } from '@/locales/language'
import { NotFoundPage } from '@/pages/notFound'

const pageStyle = css`
    width: min(960px, 100%);
    margin: 0 auto;
    padding: 16px;
    box-sizing: border-box;
`

export default function Md5Page() {
    let { lang } = useParams()
    if (!lang) {
        lang = getTargetLang(navigator.language, defaultLanguage)
    } else if (!isSupportedLanguage(lang)) {
        return <NotFoundPage />
    }
    useEffect(() => {
        document.documentElement.lang = lang!
        document.title = transKey(lang!, 'tools.md5.name')
        document.querySelector('meta[name="description"]')
            ?.setAttribute('content', transKey(lang!, 'tools.md5.description'))
    }, [lang])

    return (
        <ToolsLayout lang={lang}>
            <div className={pageStyle}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 12 }}>
                    {transKey(lang, 'tools.md5.name')}
                </h1>
                <Md5Component lang={lang} />
            </div>
        </ToolsLayout>
    )
}
