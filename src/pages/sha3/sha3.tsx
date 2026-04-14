'use client'

import { useState, useCallback } from 'react'
import { sha3_224, sha3_256, sha3_384, sha3_512, keccak_256 } from '@noble/hashes/sha3.js'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

const VARIANTS = {
    sha3_224,
    sha3_256,
    sha3_384,
    sha3_512,
    keccak_256,
} as const

type Sha3Variant = keyof typeof VARIANTS

const VARIANT_LABELS: Record<Sha3Variant, string> = {
    sha3_224: 'SHA3-224',
    sha3_256: 'SHA3-256',
    sha3_384: 'SHA3-384',
    sha3_512: 'SHA3-512',
    keccak_256: 'Keccak-256',
}

export default function Sha3Component({ lang }: { lang: string }) {
    const [variant, setVariant] = useState<Sha3Variant>('sha3_256')

    const computeHash = useCallback(
        (bytes: Uint8Array) => VARIANTS[variant](bytes),
        [variant]
    )

    const extraOptions = (
        <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel id="sha3-variant-label">{transKey(lang, 'tools.sha3.variant')}</InputLabel>
            <Select
                labelId="sha3-variant-label"
                value={variant}
                label={transKey(lang, 'tools.sha3.variant')}
                onChange={(e: SelectChangeEvent) => setVariant(e.target.value as Sha3Variant)}
            >
                {(Object.keys(VARIANTS) as Sha3Variant[]).map(key => (
                    <MenuItem key={key} value={key}>{VARIANT_LABELS[key]}</MenuItem>
                ))}
            </Select>
        </FormControl>
    )

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.sha3.name')}
            description={transKey(lang, 'tools.sha3.description')}
            algorithmLabel={`SHA-3 (${VARIANT_LABELS[variant]})`}
            historyKey="sha3"
            computeHash={computeHash}
            extraOptions={extraOptions}
        />
    )
}
