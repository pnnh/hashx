'use client'

import { useCallback } from 'react'
import { blake3 } from '@noble/hashes/blake3.js'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

export default function Blake3Component({ lang }: { lang: string }) {
    const computeHash = useCallback((bytes: Uint8Array) => blake3(bytes), [])

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.blake3.name')}
            description={transKey(lang, 'tools.blake3.description')}
            algorithmLabel="BLAKE3"
            historyKey="blake3"
            computeHash={computeHash}
        />
    )
}
