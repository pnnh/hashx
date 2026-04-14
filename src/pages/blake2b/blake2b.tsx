'use client'

import { useState, useCallback } from 'react'
import { blake2b } from '@noble/hashes/blake2.js'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import HashTool from '@/components/HashTool'
import { transKey } from '@/locales/normal'

const OUTPUT_LENGTHS = [16, 20, 28, 32, 48, 64] as const
type OutputLen = typeof OUTPUT_LENGTHS[number]

export default function Blake2bComponent({ lang }: { lang: string }) {
    const [dkLen, setDkLen] = useState<OutputLen>(32)

    const computeHash = useCallback(
        (bytes: Uint8Array) => blake2b(bytes, { dkLen }),
        [dkLen]
    )

    const extraOptions = (
        <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="b2b-len-label">{transKey(lang, 'tools.blake2b.outputLength')}</InputLabel>
            <Select
                labelId="b2b-len-label"
                value={String(dkLen)}
                label={transKey(lang, 'tools.blake2b.outputLength')}
                onChange={(e: SelectChangeEvent) => setDkLen(Number(e.target.value) as OutputLen)}
            >
                {OUTPUT_LENGTHS.map(len => (
                    <MenuItem key={len} value={String(len)}>
                        {len} bytes ({len * 8} bits)
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )

    return (
        <HashTool
            lang={lang}
            title={transKey(lang, 'tools.blake2b.name')}
            description={transKey(lang, 'tools.blake2b.description')}
            algorithmLabel={`BLAKE2b-${dkLen * 8}`}
            historyKey="blake2b"
            computeHash={computeHash}
            extraOptions={extraOptions}
        />
    )
}
