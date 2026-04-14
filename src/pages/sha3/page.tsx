import { useEffect } from 'react'
import { css } from '@emotion/css'
import Sha3Component from './sha3'
import { ToolsLayout } from '@/layout/layout'
import { useParams } from 'react-router'
import { transKey } from '@/locales/normal'
import { defaultLanguage, getTargetLang, isSupportedLanguage } from '@/locales/language'
import { NotFoundPage } from '@/pages/notFound'

const pageStyle = css`width: min(960px, 100%); margin: 0 auto; padding: 16px; box-sizing: border-box;`

export function Sha3Page() {
    let { lang } = useParams()
    if (!lang) { lang = getTargetLang(navigator.language, defaultLanguage) }
    else if (!isSupportedLanguage(lang)) { return <NotFoundPage /> }
    useEffect(() => {
        document.documentElement.lang = lang!
        document.title = transKey(lang!, 'tools.sha3.name')
        document.querySelector('meta[name="description"]')?.setAttribute('content', transKey(lang!, 'tools.sha3.description'))
    }, [lang])
    return (
        <ToolsLayout lang={lang}>
            <div className={pageStyle}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 12 }}>{transKey(lang, 'tools.sha3.name')}</h1>
                <Sha3Component lang={lang} />
            </div>
        </ToolsLayout>
    )
}
