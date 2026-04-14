import styles from './navbar.module.scss'
import { PSLanguageSelector } from '@/layout/language'
import { css } from '@emotion/css'

const toolLink = css`
    text-decoration: none;
    color: var(--text-color);
    font-size: 13px;
    padding: 3px 8px;
    border-radius: 4px;
    white-space: nowrap;
    &:hover { background-color: #f0f0f0; }
`

const toolLinkActive = css`
    color: var(--primary-color);
    font-weight: 600;
    background-color: #e8f0fe;
    &:hover { background-color: #d2e3fc; }
`

const HASH_TOOLS = [
    { key: 'md5',       path: '',           label: 'MD5'        },
    { key: 'sha1',      path: '/sha1',      label: 'SHA-1'      },
    { key: 'sha256',    path: '/sha256',    label: 'SHA-256'    },
    { key: 'sha512',    path: '/sha512',    label: 'SHA-512'    },
    { key: 'sha3',      path: '/sha3',      label: 'SHA-3'      },
    { key: 'blake2b',   path: '/blake2b',   label: 'BLAKE2b'    },
    { key: 'blake3',    path: '/blake3',    label: 'BLAKE3'     },
    { key: 'ripemd160', path: '/ripemd160', label: 'RIPEMD-160' },
    { key: 'hmac',      path: '/hmac',      label: 'HMAC'       },
] as const

function isToolActive(key: string, lang: string): boolean {
    const path = window.location.pathname
    if (key === 'md5') {
        return path === `/${lang}` || path === `/${lang}/` || path === '/'
    }
    return path.includes(`/${key}`)
}

export function ContentPublicNavbar({ lang }: { lang: string }) {
    return (
        <div className={styles.navHeader}>
            {/* Logo */}
            <div className={styles.leftNav}>
                <a className={styles.brandLink} href="/">
                    <img src="/logo48.png" alt="Hashx logo" />
                </a>
            </div>

            {/* Tool links — horizontal row */}
            <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                {HASH_TOOLS.map(tool => {
                    const active = isToolActive(tool.key, lang)
                    return (
                        <a
                            key={tool.key}
                            className={`${toolLink} ${active ? toolLinkActive : ''}`}
                            href={`/${lang}${tool.path}`}
                        >
                            {tool.label}
                        </a>
                    )
                })}
            </nav>

            {/* Right: language selector */}
            <div className={styles.rightNav}>
                <PSLanguageSelector lang={lang} />
            </div>
        </div>
    )
}
