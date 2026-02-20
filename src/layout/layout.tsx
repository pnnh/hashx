import React from 'react'
import styles from './layout.module.scss'
import {ContentPublicNavbar} from "@/layout/navbar.tsx";
import {GlobalLayout} from "@/layout/global.tsx";

export function ToolsLayout({lang,
                                              children,
                                          }: {
    lang:string,
    children: React.ReactNode,
}) {
    return <GlobalLayout>
        <div className={styles.templateContainer}>
            <div className={styles.templateNavbar}>
                <ContentPublicNavbar lang={lang}/>
            </div>
            <div className={styles.templateBody}>
                <div className={styles.bodyContainer}>
                    {children}
                </div>
            </div>
        </div>
    </GlobalLayout>
}
