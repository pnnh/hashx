import React from "react";
import { JotaiProvider } from "./provider";
import { ThemeProvider } from '@mui/material/styles';
import { lightTheme } from "@/layout/theme.tsx";
import './global.scss'

export function GlobalLayout({ children }: { children: React.ReactNode }) {
    return (
        <JotaiProvider>
            <ThemeProvider theme={lightTheme}>
                {children}
            </ThemeProvider>
        </JotaiProvider>
    );
}
