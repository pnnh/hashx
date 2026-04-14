'use client'

import { useCallback } from 'react'
import { ripemd160 } from '@noble/hashes/legacy.js'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

export default function Ripemd160Component({ lang }: { lang: string }) {
    const computeHash = useCallback((bytes: Uint8Array) => ripemd160(bytes), [])

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.ripemd160.name')}
            description={transKey(lang, 'tools.ripemd160.description')}
            algorithmLabel="RIPEMD-160"
            historyKey="ripemd160"
            computeHash={computeHash}
        />
    )
}
