import React, {useEffect} from "react";
import {JotaiProvider} from "./provider";
import {ThemeProvider} from '@mui/material/styles';
import {darkTheme, globalThemeAtom, lightTheme, ThemeKey} from "@/layout/theme.tsx";
import './global.scss'
import {useAtom} from "jotai";

export function GlobalLayout({
                                               children
                                           }: {
    children: React.ReactNode
}) {
    const [globalTheme, setGlobalTheme] = useAtom(globalThemeAtom)
    useEffect(() => {
        const themeClassName = `${globalTheme}-theme`
        window.document.body.classList.add(themeClassName)
    }, [globalTheme])
    const currentTheme = (globalTheme) === 'dark' ? darkTheme : lightTheme
    return <JotaiProvider>
            <ThemeProvider theme={currentTheme}>
                {children}
            </ThemeProvider>
    </JotaiProvider>
}
