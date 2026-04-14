'use client';

import styles from './language.module.scss';
import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import LanguageIcon from '@mui/icons-material/Language';
import { StyledMenu } from '@/components/dropmenu';
import { getLangInfo, replaceLangInUrl, supportedLanguages } from '@/locales/language';

export function PSLanguageSelector({ lang }: { lang: string }) {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    const langInfo = getLangInfo(lang)
    if (!langInfo) {
        throw new Error('Invalid language: ' + lang)
    }

    const open = Boolean(anchorEl);

    const goUrl = (targetLang: string) => {
        const targetUrl = replaceLangInUrl(window.location.href, targetLang);
        setAnchorEl(null);
        window.location.href = targetUrl;
    }

    return (
        <>
            <div
                className={styles.langSelector}
                onClick={e => setAnchorEl(e.currentTarget)}
            >
                <LanguageIcon aria-hidden={undefined} />
                {langInfo.name}
            </div>
            <StyledMenu
                elevation={0}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                anchorEl={anchorEl}
                open={open}
                onClose={() => setAnchorEl(null)}
            >
                {supportedLanguages.map(language => (
                    <MenuItem
                        key={language.key}
                        selected={language.key === lang}
                        onClick={() => goUrl(language.key)}
                        disableRipple
                    >
                        {language.name}
                    </MenuItem>
                ))}
            </StyledMenu>
        </>
    )
}
