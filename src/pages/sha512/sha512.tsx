'use client'

import { useCallback } from 'react'
import { sha512 } from '@noble/hashes/sha2.js'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

export default function Sha512Component({ lang }: { lang: string }) {
    const computeHash = useCallback((bytes: Uint8Array) => sha512(bytes), [])

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.sha512.name')}
            description={transKey(lang, 'tools.sha512.description')}
            algorithmLabel="SHA-512"
            historyKey="sha512"
            computeHash={computeHash}
        />
    )
}
