'use client'

import { useCallback } from 'react'
import { stringToMd5 } from '@pnnh/atom'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

// MD5 returns a hex string from @pnnh/atom, convert to Uint8Array for HashTool
function md5ToBytes(input: Uint8Array): Uint8Array {
    // stringToMd5 requires a string; decode bytes back to UTF-8 string
    const text = new TextDecoder().decode(input)
    const hex = stringToMd5(text)
    const bytes = new Uint8Array(hex.length / 2)
    for (let i = 0; i < bytes.length; i++) {
        bytes[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16)
    }
    return bytes
}

export default function Md5Component({ lang }: { lang: string }) {
    const computeHash = useCallback((bytes: Uint8Array) => md5ToBytes(bytes), [])

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.md5.name')}
            description={transKey(lang, 'tools.md5.description')}
            algorithmLabel="MD5"
            historyKey="md5"
            computeHash={computeHash}
        />
    )
}
