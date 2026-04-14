'use client'

import { useCallback } from 'react'
import { sha256 } from '@noble/hashes/sha2.js'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

export default function Hash256Component({ lang }: { lang: string }) {
    const computeHash = useCallback((bytes: Uint8Array) => sha256(bytes), [])

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.sha256.name')}
            description={transKey(lang, 'tools.sha256.description')}
            algorithmLabel="SHA-256"
            historyKey="sha256"
            computeHash={computeHash}
        />
    )
}
