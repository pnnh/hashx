'use client'

import React, { useState, useRef, useCallback } from 'react'
import Button from '@mui/material/Button'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import AbcIcon from '@mui/icons-material/Abc'
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import UploadFileIcon from '@mui/icons-material/UploadFile'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'
import { css } from '@emotion/css'

import { transKey } from '@/locales/normal'
import {
    OutputFormat,
    TextEncoding,
    HistoryEntry,
    formatHashOutput,
    textToBytes,
    addHistoryEntry,
    loadHistory,
    clearHistory as clearHistoryStore,
    FILE_SIZE_LIMIT,
    formatFileSize,
    readFileAsBytes,
    exportCsv,
} from '@/utils/hash'
import { copyToClipboard } from '@/utils/clipboard'

// ── Styles ───────────────────────────────────────────────────────────────────

const styles = {
    container: css`
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
        max-width: 900px;
        margin: 0 auto;
        padding-bottom: 32px;
    `,
    description: css`
        color: #666;
        font-size: 0.875rem;
        margin: 0;
        line-height: 1.5;
    `,
    textarea: css`
        width: 100%;
        box-sizing: border-box;
        height: 140px;
        padding: 10px 12px;
        font-size: 14px;
        font-family: inherit;
        background: #fff;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
        resize: vertical;
        outline: none;
        &:focus { border-color: #1976d2; }
    `,
    resultTextarea: css`
        width: 100%;
        box-sizing: border-box;
        height: 100px;
        padding: 10px 12px;
        font-size: 13px;
        font-family: 'Courier New', Courier, monospace;
        background: #f8f8f8;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
        resize: none;
        outline: none;
        color: #333;
    `,
    rowBetween: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    `,
    rowStart: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
        flex-wrap: wrap;
    `,
    optionsRow: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 16px;
        flex-wrap: wrap;
        padding: 8px 0;
    `,
    dropZone: css`
        border: 2px dashed #bbb;
        border-radius: 12px;
        padding: 40px 24px;
        text-align: center;
        cursor: pointer;
        transition: border-color 0.2s, background-color 0.2s;
        background: #fafafa;
        &:hover, &.dragover { border-color: #1976d2; background: #e3f2fd; }
    `,
    dropZoneText: css`
        color: #888;
        font-size: 0.95rem;
        margin-top: 10px;
    `,
    fileInfo: css`
        margin-top: 10px;
        font-size: 0.875rem;
        color: #444;
    `,
    warningText: css`
        color: #d32f2f;
        font-size: 0.875rem;
        margin-top: 8px;
    `,
    verifyRow: css`
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 12px;
    `,
    verifyInput: css`
        flex: 1;
        padding: 8px 12px;
        font-size: 13px;
        font-family: 'Courier New', Courier, monospace;
        background: #fff;
        border: 1px solid #d3d3d3;
        border-radius: 8px;
        outline: none;
        &:focus { border-color: #1976d2; }
    `,
    matchChip: css`
        display: inline-flex;
        align-items: center;
        gap: 4px;
        padding: 4px 10px;
        border-radius: 99px;
        font-size: 0.8rem;
        font-weight: 600;
    `,
    matchGreen: css`
        background: #e8f5e9;
        color: #2e7d32;
    `,
    matchRed: css`
        background: #ffebee;
        color: #c62828;
    `,
    historyTime: css`
        font-size: 0.75rem;
        color: #999;
        white-space: nowrap;
    `,
    historyInput: css`
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.8rem;
        color: #555;
        max-width: 160px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    `,
    historyHash: css`
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.75rem;
        color: #333;
        max-width: 240px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        cursor: pointer;
    `,
    labelText: css`
        font-size: 0.8rem;
        color: #666;
        font-weight: 500;
    `,
}

// ── Props ────────────────────────────────────────────────────────────────────

export interface HashToolProps {
    lang: string
    title: string
    description?: string
    algorithmLabel: string   // e.g. "SHA-256", stored in history
    historyKey: string       // localStorage namespace key
    computeHash: (bytes: Uint8Array) => Uint8Array
    extraOptions?: React.ReactNode  // algorithm-specific controls (HMAC key, SHA-3 variant…)
}

// ── Component ────────────────────────────────────────────────────────────────

type TabValue = 'text' | 'file' | 'batch'

export default function HashTool({
    lang,
    title,
    description,
    algorithmLabel,
    historyKey,
    computeHash,
    extraOptions,
}: HashToolProps) {
    // Tabs
    const [tab, setTab] = useState<TabValue>('text')

    // Text tab
    const [sourceText, setSourceText] = useState('')
    const [outputText, setOutputText] = useState('')

    // File tab
    const [file, setFile] = useState<File | null>(null)
    const [fileSizeWarning, setFileSizeWarning] = useState(false)
    const [fileOutput, setFileOutput] = useState('')
    const [dragOver, setDragOver] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Batch tab
    const [batchInput, setBatchInput] = useState('')
    const [batchResults, setBatchResults] = useState<Array<{ input: string; hash: string }>>([])

    // Options
    const [outputFormat, setOutputFormat] = useState<OutputFormat>('hex-lower')
    const [textEncoding, setTextEncoding] = useState<TextEncoding>('utf-8')

    // Verify
    const [expectedHash, setExpectedHash] = useState('')

    // History
    const [history, setHistory] = useState<HistoryEntry[]>(() => loadHistory(historyKey))

    // Copy feedback
    const [copied, setCopied] = useState(false)
    const [fileCopied, setFileCopied] = useState(false)

    // ── Helpers ──────────────────────────────────────────────────────────────

    const doFormat = useCallback((bytes: Uint8Array) =>
        formatHashOutput(bytes, outputFormat), [outputFormat])

    const pushHistory = useCallback((inputPreview: string, result: string) => {
        const updated = addHistoryEntry(historyKey, {
            algorithm: algorithmLabel,
            inputPreview,
            outputFormat,
            result,
        })
        setHistory(updated)
    }, [historyKey, algorithmLabel, outputFormat])

    const handleCopy = (text: string, setter: (v: boolean) => void) => {
        copyToClipboard(text).then(() => {
            setter(true)
            setTimeout(() => setter(false), 1500)
        })
    }

    // ── Text compute ─────────────────────────────────────────────────────────

    const handleComputeText = useCallback(() => {
        if (!sourceText.trim()) return
        const bytes = textToBytes(sourceText, textEncoding)
        const hashBytes = computeHash(bytes)
        const result = doFormat(hashBytes)
        setOutputText(result)
        pushHistory(sourceText.slice(0, 60), result)
    }, [sourceText, textEncoding, computeHash, doFormat, pushHistory])

    // ── File handling ─────────────────────────────────────────────────────────

    const acceptFile = (f: File) => {
        if (f.size > FILE_SIZE_LIMIT) {
            setFileSizeWarning(true)
            setFile(f)
            setFileOutput('')
        } else {
            setFileSizeWarning(false)
            setFile(f)
            setFileOutput('')
        }
    }

    const handleFileDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const f = e.dataTransfer.files?.[0]
        if (f) acceptFile(f)
    }

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (f) acceptFile(f)
    }

    const handleComputeFile = useCallback(async () => {
        if (!file || fileSizeWarning) return
        const bytes = await readFileAsBytes(file)
        const hashBytes = computeHash(bytes)
        const result = doFormat(hashBytes)
        setFileOutput(result)
        pushHistory(`[file] ${file.name}`, result)
    }, [file, fileSizeWarning, computeHash, doFormat, pushHistory])

    // ── Batch compute ─────────────────────────────────────────────────────────

    const handleComputeBatch = useCallback(() => {
        const lines = batchInput.split('\n').filter(l => l.trim() !== '')
        const results = lines.map(line => {
            const bytes = textToBytes(line, textEncoding)
            const hashBytes = computeHash(bytes)
            return { input: line, hash: doFormat(hashBytes) }
        })
        setBatchResults(results)
    }, [batchInput, textEncoding, computeHash, doFormat])

    // ── Verify ────────────────────────────────────────────────────────────────

    const currentOutput = tab === 'file' ? fileOutput : outputText
    const verifyStatus = (): 'match' | 'mismatch' | 'none' => {
        if (!expectedHash || !currentOutput) return 'none'
        return expectedHash.trim().toLowerCase() === currentOutput.toLowerCase() ? 'match' : 'mismatch'
    }

    // ── Clear history ─────────────────────────────────────────────────────────

    const handleClearHistory = () => {
        clearHistoryStore(historyKey)
        setHistory([])
    }

    // ── Render ────────────────────────────────────────────────────────────────

    return (
        <div className={styles.container}>
            {/* Description */}
            {description && <p className={styles.description}>{description}</p>}

            {/* Tabs */}
            <Tabs
                value={tab}
                onChange={(_e, v) => setTab(v as TabValue)}
                variant="standard"
                sx={{ borderBottom: '1px solid #e0e0e0', minHeight: 40 }}
            >
                <Tab value="text" label={transKey(lang, 'tools.common.textMode')} sx={{ minHeight: 40, py: 0.5 }} />
                <Tab value="file" label={transKey(lang, 'tools.common.fileInput')} sx={{ minHeight: 40, py: 0.5 }} />
                <Tab value="batch" label={transKey(lang, 'tools.common.batchMode')} sx={{ minHeight: 40, py: 0.5 }} />
            </Tabs>

            {/* ── Text Tab ── */}
            {tab === 'text' && (
                <>
                    <textarea
                        className={styles.textarea}
                        placeholder={transKey(lang, 'tools.common.inputPlaceholder')}
                        value={sourceText}
                        onChange={e => setSourceText(e.target.value)}
                    />
                    <OptionsPanel
                        lang={lang}
                        outputFormat={outputFormat}
                        setOutputFormat={setOutputFormat}
                        textEncoding={textEncoding}
                        setTextEncoding={setTextEncoding}
                        showEncoding
                        extraOptions={extraOptions}
                    />
                    <div className={styles.rowStart}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleComputeText}
                            disabled={!sourceText.trim()}
                        >
                            {transKey(lang, 'tools.common.compute')}
                        </Button>
                    </div>
                    <ResultArea
                        lang={lang}
                        output={outputText}
                        setOutput={setOutputText}
                        copied={copied}
                        onCopy={() => handleCopy(outputText, setCopied)}
                    />
                </>
            )}

            {/* ── File Tab ── */}
            {tab === 'file' && (
                <>
                    <div
                        className={`${styles.dropZone}${dragOver ? ' dragover' : ''}`}
                        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                        onDragLeave={() => setDragOver(false)}
                        onDrop={handleFileDrop}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <UploadFileIcon sx={{ fontSize: 40, color: '#bbb' }} />
                        <p className={styles.dropZoneText}>
                            {transKey(lang, 'tools.common.fileDrop')}
                        </p>
                        {file && (
                            <p className={styles.fileInfo}>
                                {transKey(lang, 'tools.common.fileSelected')}: <strong>{file.name}</strong>
                                &nbsp;({formatFileSize(file.size)})
                            </p>
                        )}
                        {fileSizeWarning && (
                            <p className={styles.warningText}>
                                {transKey(lang, 'tools.common.fileSizeWarning')}
                            </p>
                        )}
                    </div>
                    <input
                        ref={fileInputRef}
                        type="file"
                        style={{ display: 'none' }}
                        onChange={handleFileSelect}
                    />
                    <OptionsPanel
                        lang={lang}
                        outputFormat={outputFormat}
                        setOutputFormat={setOutputFormat}
                        showEncoding={false}
                        extraOptions={extraOptions}
                    />
                    <div className={styles.rowStart}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleComputeFile}
                            disabled={!file || fileSizeWarning}
                        >
                            {transKey(lang, 'tools.common.compute')}
                        </Button>
                    </div>
                    <ResultArea
                        lang={lang}
                        output={fileOutput}
                        setOutput={setFileOutput}
                        copied={fileCopied}
                        onCopy={() => handleCopy(fileOutput, setFileCopied)}
                    />
                </>
            )}

            {/* ── Batch Tab ── */}
            {tab === 'batch' && (
                <>
                    <textarea
                        className={styles.textarea}
                        style={{ height: 180 }}
                        placeholder={transKey(lang, 'tools.common.batchInputPlaceholder')}
                        value={batchInput}
                        onChange={e => setBatchInput(e.target.value)}
                    />
                    <OptionsPanel
                        lang={lang}
                        outputFormat={outputFormat}
                        setOutputFormat={setOutputFormat}
                        textEncoding={textEncoding}
                        setTextEncoding={setTextEncoding}
                        showEncoding
                        extraOptions={extraOptions}
                    />
                    <div className={styles.rowBetween}>
                        <Button
                            variant="contained"
                            size="small"
                            onClick={handleComputeBatch}
                            disabled={!batchInput.trim()}
                        >
                            {transKey(lang, 'tools.common.compute')}
                        </Button>
                        {batchResults.length > 0 && (
                            <Button
                                variant="outlined"
                                size="small"
                                onClick={() => exportCsv(batchResults)}
                            >
                                {transKey(lang, 'tools.common.exportCsv')}
                            </Button>
                        )}
                    </div>
                    {batchResults.length > 0 && (
                        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 2 }}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ background: '#fafafa' }}>
                                        <TableCell sx={{ fontWeight: 600, width: '35%' }}>
                                            {transKey(lang, 'tools.common.batchInput')}
                                        </TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontFamily: 'monospace' }}>
                                            {transKey(lang, 'tools.common.batchResult')}
                                        </TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {batchResults.map((row, i) => (
                                        <TableRow key={i} hover>
                                            <TableCell sx={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {row.input}
                                            </TableCell>
                                            <TableCell sx={{ fontFamily: 'monospace', fontSize: '0.78rem', wordBreak: 'break-all' }}>
                                                {row.hash}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </>
            )}

            {/* ── Verify (text & file only) ── */}
            {tab !== 'batch' && (
                <Accordion elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                        <span className={styles.labelText}>{transKey(lang, 'tools.common.verifyHash')}</span>
                    </AccordionSummary>
                    <AccordionDetails sx={{ pt: 0 }}>
                        <div className={styles.verifyRow}>
                            <input
                                className={styles.verifyInput}
                                placeholder={transKey(lang, 'tools.common.expectedHash')}
                                value={expectedHash}
                                onChange={e => setExpectedHash(e.target.value)}
                            />
                            {verifyStatus() !== 'none' && (
                                <span className={`${styles.matchChip} ${verifyStatus() === 'match' ? styles.matchGreen : styles.matchRed}`}>
                                    {verifyStatus() === 'match'
                                        ? <><CheckCircleOutlineIcon fontSize="small" />{transKey(lang, 'tools.common.hashMatch')}</>
                                        : <><CancelOutlinedIcon fontSize="small" />{transKey(lang, 'tools.common.hashNotMatch')}</>
                                    }
                                </span>
                            )}
                        </div>
                    </AccordionDetails>
                </Accordion>
            )}

            {/* ── History ── */}
            <Accordion
                elevation={0}
                defaultExpanded={history.length > 0}
                sx={{ border: '1px solid #e0e0e0', borderRadius: '8px !important', '&:before': { display: 'none' } }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                    <div className={styles.rowBetween} style={{ width: '100%', paddingRight: 8 }}>
                        <span className={styles.labelText}>
                            {transKey(lang, 'tools.common.history')}
                            {history.length > 0 && ` (${history.length})`}
                        </span>
                        {history.length > 0 && (
                            <Button
                                size="small"
                                color="inherit"
                                variant="text"
                                sx={{ fontSize: '0.75rem', py: 0, minWidth: 'auto', color: '#999' }}
                                onClick={e => { e.stopPropagation(); handleClearHistory() }}
                            >
                                {transKey(lang, 'tools.common.clearHistory')}
                            </Button>
                        )}
                    </div>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0, px: 0 }}>
                    {history.length === 0 ? (
                        <p style={{ color: '#999', fontSize: '0.85rem', padding: '0 16px', margin: 0 }}>
                            {transKey(lang, 'tools.common.historyEmpty')}
                        </p>
                    ) : (
                        <TableContainer>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ background: '#fafafa' }}>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 0.5, width: 72 }}>Time</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 0.5, width: 96 }}>Algo</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 0.5 }}>Input</TableCell>
                                        <TableCell sx={{ fontWeight: 600, fontSize: '0.78rem', py: 0.5 }}>Result</TableCell>
                                        <TableCell sx={{ py: 0.5, width: 36 }} />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {history.map(entry => (
                                        <HistoryRow
                                            key={entry.id}
                                            entry={entry}
                                            onCopy={copyToClipboard}
                                        />
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

// ── Sub-components ────────────────────────────────────────────────────────────

interface OptionsPanelProps {
    lang: string
    outputFormat: OutputFormat
    setOutputFormat: (f: OutputFormat) => void
    textEncoding?: TextEncoding
    setTextEncoding?: (e: TextEncoding) => void
    showEncoding: boolean
    extraOptions?: React.ReactNode
}

function OptionsPanel({
    lang,
    outputFormat,
    setOutputFormat,
    textEncoding,
    setTextEncoding,
    showEncoding,
    extraOptions,
}: OptionsPanelProps) {
    return (
        <Accordion elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: '8px !important', '&:before': { display: 'none' } }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ minHeight: 40, '& .MuiAccordionSummary-content': { my: 0.5 } }}>
                <span style={{ fontSize: '0.8rem', color: '#666', fontWeight: 500 }}>
                    {transKey(lang, 'tools.common.options')}
                </span>
            </AccordionSummary>
            <AccordionDetails>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 16, flexWrap: 'wrap', alignItems: 'flex-end' }}>
                    {/* Output format */}
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel id="fmt-label">{transKey(lang, 'tools.common.outputFormat')}</InputLabel>
                        <Select
                            labelId="fmt-label"
                            value={outputFormat}
                            label={transKey(lang, 'tools.common.outputFormat')}
                            onChange={(e: SelectChangeEvent) => setOutputFormat(e.target.value as OutputFormat)}
                        >
                            <MenuItem value="hex-lower">{transKey(lang, 'tools.common.outputFormatHexLower')}</MenuItem>
                            <MenuItem value="hex-upper">{transKey(lang, 'tools.common.outputFormatHexUpper')}</MenuItem>
                            <MenuItem value="base64">{transKey(lang, 'tools.common.outputFormatBase64')}</MenuItem>
                            <MenuItem value="base64url">{transKey(lang, 'tools.common.outputFormatBase64url')}</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Text encoding (only text/batch tabs) */}
                    {showEncoding && textEncoding && setTextEncoding && (
                        <FormControl size="small" sx={{ minWidth: 180 }}>
                            <InputLabel id="enc-label">{transKey(lang, 'tools.common.textEncoding')}</InputLabel>
                            <Select
                                labelId="enc-label"
                                value={textEncoding}
                                label={transKey(lang, 'tools.common.textEncoding')}
                                onChange={(e: SelectChangeEvent) => setTextEncoding(e.target.value as TextEncoding)}
                            >
                                <MenuItem value="utf-8">UTF-8</MenuItem>
                                <MenuItem value="utf-16le">UTF-16LE</MenuItem>
                                <MenuItem value="latin-1">Latin-1</MenuItem>
                            </Select>
                        </FormControl>
                    )}

                    {/* Extra algorithm-specific options */}
                    {extraOptions}
                </div>
            </AccordionDetails>
        </Accordion>
    )
}

interface ResultAreaProps {
    lang: string
    output: string
    setOutput: (v: string) => void
    copied: boolean
    onCopy: () => void
}

function ResultArea({ lang, output, setOutput, copied, onCopy }: ResultAreaProps) {
    const toggleCase = () => {
        if (!output) return
        const isLower = output === output.toLowerCase()
        setOutput(isLower ? output.toUpperCase() : output.toLowerCase())
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<AbcIcon fontSize="small" />}
                    onClick={toggleCase}
                    disabled={!output}
                    sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                    {transKey(lang, 'tools.common.toggleCase')}
                </Button>
                <Button
                    size="small"
                    variant="outlined"
                    startIcon={<ContentCopyIcon fontSize="small" />}
                    onClick={onCopy}
                    disabled={!output}
                    sx={{ fontSize: '0.75rem', py: 0.5 }}
                >
                    {copied ? transKey(lang, 'tools.common.copied') : transKey(lang, 'tools.common.copy')}
                </Button>
            </div>
            <textarea
                className={styles.resultTextarea}
                readOnly
                value={output}
                placeholder={transKey(lang, 'tools.common.resultPlaceholder')}
            />
        </div>
    )
}

// ── History Row (with per-row copy button) ────────────────────────────────────

interface HistoryRowProps {
    entry: HistoryEntry
    onCopy: (text: string) => void
}

function HistoryRow({ entry, onCopy }: HistoryRowProps) {
    const [rowCopied, setRowCopied] = React.useState(false)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        onCopy(entry.result)
        setRowCopied(true)
        setTimeout(() => setRowCopied(false), 1500)
    }

    return (
        <TableRow hover>
            <TableCell sx={{ py: 0.5 }}>
                <span style={{ fontSize: '0.72rem', color: '#999', whiteSpace: 'nowrap' }}>
                    {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
            </TableCell>
            <TableCell sx={{ py: 0.5, fontSize: '0.78rem' }}>{entry.algorithm}</TableCell>
            <TableCell sx={{ py: 0.5, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: '#555' }}>
                    {entry.inputPreview}
                </span>
            </TableCell>
            <TableCell sx={{ py: 0.5, maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                <Tooltip title={entry.result}>
                    <span style={{ fontFamily: 'monospace', fontSize: '0.75rem', color: '#333', cursor: 'default' }}>
                        {entry.result}
                    </span>
                </Tooltip>
            </TableCell>
            <TableCell sx={{ py: 0.5, pr: 1 }}>
                <Tooltip title={rowCopied ? 'Copied!' : 'Copy'}>
                    <span
                        onClick={handleCopy}
                        style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', color: rowCopied ? '#2e7d32' : '#aaa' }}
                    >
                        <ContentCopyIcon sx={{ fontSize: 15 }} />
                    </span>
                </Tooltip>
            </TableCell>
        </TableRow>
    )
}
