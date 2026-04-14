'use client'

import { useCallback } from 'react'
import { sha1 } from '@noble/hashes/legacy.js'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

export default function Sha1Component({ lang }: { lang: string }) {
    const computeHash = useCallback((bytes: Uint8Array) => sha1(bytes), [])

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.sha1.name')}
            description={transKey(lang, 'tools.sha1.description')}
            algorithmLabel="SHA-1"
            historyKey="sha1"
            computeHash={computeHash}
        />
    )
}
