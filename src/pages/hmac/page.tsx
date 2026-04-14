import { useEffect } from 'react'
import { css } from '@emotion/css'
import HmacComponent from './hmac'
import { ToolsLayout } from '@/layout/layout'
import { useParams } from 'react-router'
import { transKey } from '@/locales/normal'
import { defaultLanguage, getTargetLang, isSupportedLanguage } from '@/locales/language'
import { NotFoundPage } from '@/pages/notFound'

const pageStyle = css`width: min(960px, 100%); margin: 0 auto; padding: 16px; box-sizing: border-box;`

export function HmacPage() {
    let { lang } = useParams()
    if (!lang) { lang = getTargetLang(navigator.language, defaultLanguage) }
    else if (!isSupportedLanguage(lang)) { return <NotFoundPage /> }
    useEffect(() => {
        document.documentElement.lang = lang!
        document.title = transKey(lang!, 'tools.hmac.name')
        document.querySelector('meta[name="description"]')?.setAttribute('content', transKey(lang!, 'tools.hmac.description'))
    }, [lang])
    return (
        <ToolsLayout lang={lang}>
            <div className={pageStyle}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: 12 }}>{transKey(lang, 'tools.hmac.name')}</h1>
                <HmacComponent lang={lang} />
            </div>
        </ToolsLayout>
    )
}
