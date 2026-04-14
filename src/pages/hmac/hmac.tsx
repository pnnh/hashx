'use client'

import { useState, useCallback } from 'react'
import { hmac } from '@noble/hashes/hmac.js'
import { sha1 } from '@noble/hashes/legacy.js'
import { sha256, sha512 } from '@noble/hashes/sha2.js'
import { sha3_256 } from '@noble/hashes/sha3.js'
import { utf8ToBytes } from '@noble/hashes/utils.js'
import type { CHash } from '@noble/hashes/utils.js'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import TextField from '@mui/material/TextField'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

type HmacAlgo = 'sha1' | 'sha256' | 'sha512' | 'sha3_256'

const ALGO_MAP: Record<HmacAlgo, CHash> = {
    sha1,
    sha256,
    sha512,
    sha3_256,
}

const ALGO_LABELS: Record<HmacAlgo, string> = {
    sha1:     'HMAC-SHA1',
    sha256:   'HMAC-SHA256',
    sha512:   'HMAC-SHA512',
    sha3_256: 'HMAC-SHA3-256',
}

export default function HmacComponent({ lang }: { lang: string }) {
    const [algo, setAlgo] = useState<HmacAlgo>('sha256')
    const [secretKey, setSecretKey] = useState('')

    const computeHash = useCallback(
        (bytes: Uint8Array) => {
            const keyBytes = utf8ToBytes(secretKey)
            return hmac(ALGO_MAP[algo], keyBytes, bytes)
        },
        [algo, secretKey]
    )

    const extraOptions = (
        <>
            <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel id="hmac-algo-label">{transKey(lang, 'tools.hmac.algorithm')}</InputLabel>
                <Select
                    labelId="hmac-algo-label"
                    value={algo}
                    label={transKey(lang, 'tools.hmac.algorithm')}
                    onChange={(e: SelectChangeEvent) => setAlgo(e.target.value as HmacAlgo)}
                >
                    {(Object.keys(ALGO_MAP) as HmacAlgo[]).map(key => (
                        <MenuItem key={key} value={key}>{ALGO_LABELS[key]}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <TextField
                size="small"
                label={transKey(lang, 'tools.hmac.secretKey')}
                placeholder={transKey(lang, 'tools.hmac.keyPlaceholder')}
                value={secretKey}
                onChange={e => setSecretKey(e.target.value)}
                sx={{ minWidth: 260 }}
            />
        </>
    )

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.hmac.name')}
            description={transKey(lang, 'tools.hmac.description')}
            algorithmLabel={ALGO_LABELS[algo]}
            historyKey="hmac"
            computeHash={computeHash}
            extraOptions={extraOptions}
        />
    )
}
