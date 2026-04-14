import { bytesToHex } from '@noble/hashes/utils.js'
import { base64, base64urlnopad } from '@scure/base'

// ── Output format ────────────────────────────────────────────────────────────

export type OutputFormat = 'hex-lower' | 'hex-upper' | 'base64' | 'base64url'

export function formatHashOutput(bytes: Uint8Array, format: OutputFormat): string {
    switch (format) {
        case 'hex-lower':  return bytesToHex(bytes)
        case 'hex-upper':  return bytesToHex(bytes).toUpperCase()
        case 'base64':     return base64.encode(bytes)
        case 'base64url':  return base64urlnopad.encode(bytes)
    }
}

// ── Text encoding ────────────────────────────────────────────────────────────

export type TextEncoding = 'utf-8' | 'utf-16le' | 'latin-1'

export function textToBytes(text: string, encoding: TextEncoding): Uint8Array {
    switch (encoding) {
        case 'utf-8': {
            return new TextEncoder().encode(text)
        }
        case 'utf-16le': {
            const buf = new ArrayBuffer(text.length * 2)
            const view = new DataView(buf)
            for (let i = 0; i < text.length; i++) {
                view.setUint16(i * 2, text.charCodeAt(i), true /* little-endian */)
            }
            return new Uint8Array(buf)
        }
        case 'latin-1': {
            const bytes = new Uint8Array(text.length)
            for (let i = 0; i < text.length; i++) {
                bytes[i] = text.charCodeAt(i) & 0xff
            }
            return bytes
        }
    }
}

// ── History ──────────────────────────────────────────────────────────────────

export interface HistoryEntry {
    id: string
    timestamp: number
    algorithm: string
    inputPreview: string
    outputFormat: OutputFormat
    result: string
}

const HISTORY_MAX = 20

export function loadHistory(key: string): HistoryEntry[] {
    try {
        const raw = localStorage.getItem(`hash_history_${key}`)
        return raw ? (JSON.parse(raw) as HistoryEntry[]) : []
    } catch {
        return []
    }
}

export function saveHistory(key: string, entries: HistoryEntry[]): void {
    localStorage.setItem(`hash_history_${key}`, JSON.stringify(entries.slice(0, HISTORY_MAX)))
}

export function addHistoryEntry(
    key: string,
    entry: Omit<HistoryEntry, 'id' | 'timestamp'>
): HistoryEntry[] {
    const existing = loadHistory(key)
    const newEntry: HistoryEntry = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: Date.now(),
        ...entry,
    }
    const updated = [newEntry, ...existing].slice(0, HISTORY_MAX)
    saveHistory(key, updated)
    return updated
}

export function clearHistory(key: string): void {
    localStorage.removeItem(`hash_history_${key}`)
}

// ── File helpers ─────────────────────────────────────────────────────────────

export const FILE_SIZE_LIMIT = 100 * 1024 * 1024 // 100 MB

export function formatFileSize(bytes: number): string {
    if (bytes < 1024)        return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

export async function readFileAsBytes(file: File): Promise<Uint8Array> {
    const buffer = await file.arrayBuffer()
    return new Uint8Array(buffer)
}

// ── Batch CSV export ─────────────────────────────────────────────────────────

export function exportCsv(rows: Array<{ input: string; hash: string }>): void {
    const header = 'Input,Hash\n'
    const body = rows
        .map(r => `"${r.input.replace(/"/g, '""')}","${r.hash}"`)
        .join('\n')
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'hash_results.csv'
    a.click()
    URL.revokeObjectURL(url)
}
