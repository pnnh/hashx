import styles from './navbar.module.scss'
import {PSLanguageSelector} from "@/layout/language.tsx";
import {ThemeSwitch} from "@/layout/theme.tsx";
import {transKey} from "@/locales/normal.ts";
import {css} from "@emotion/css";

const pageStyles = {
    toolLink: css`
        text-decoration: none;
        color: var(--text-color);
        font-size: 14px;
        margin-right: 16px;
        display: inline-block;
        border-radius: 4px;
        &:hover {
            background-color: var(--background-color);
        } 
    `,
    toolLinkActive: {
        color: 'var(--primary-color)',
    }
}

export function ContentPublicNavbar({lang}:{lang:string}) {
    const isLinkActive = (toolKey:string) => {
        const currentPath = window.location.pathname;
        if (currentPath.indexOf(toolKey) !== -1) {
            return true;
        }
        return toolKey === 'md5' && currentPath.length <= 6;
    }
    return <div className={styles.navHeader}>
        <div className={styles.leftNav}>
            <a className={styles.brandLink} href={`/`}>
                <img src='/logo48.png' alt='logo' />
            </a>
        </div>
        <div>
            <a className={pageStyles.toolLink } style={isLinkActive('md5')?pageStyles.toolLinkActive:{}}
               href={`/${lang}`} >
                {transKey(lang, "tools.md5.name")}</a>
            <a className={pageStyles.toolLink } style={isLinkActive('sha256')?pageStyles.toolLinkActive:{}}
               href={`/${lang}/sha256`}>
                {transKey(lang, "tools.sha256.name")}</a>
            <a className={pageStyles.toolLink } style={isLinkActive('sha512')?pageStyles.toolLinkActive:{}}
               href={`/${lang}/sha512`}>
                {transKey(lang, "tools.sha512.name")}</a>
        </div>
        <div className={styles.rightNav}>
            <ThemeSwitch lang={lang}/>
            <PSLanguageSelector lang={lang}/>
        </div>
    </div>
}


