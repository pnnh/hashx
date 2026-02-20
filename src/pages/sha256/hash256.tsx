'use client'

import * as React from 'react';
import Button from '@mui/material/Button';
import {transKey} from "@/locales/normal";
import {encodeSHA256} from "@pnnh/atom";
import {css} from "@emotion/css";

const sha256PageStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    gap: 16px;
    scrollbar-width: thin;
    overflow-y: hidden;
    overflow-x: hidden;
`;

const sourceTextStyle = css`
    width: 900px;
    height: 160px;
    padding: 8px;
    flex-shrink: 0;
    background: #FFFFFF;
    border: 1px solid #d3d3d3;
    border-radius: 8px;
`;

const toolButtonsStyle = css`
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 16px;
    flex-shrink: 0;
`;

const targetTextStyle = css`
    width: 900px;
    height: 160px;
    padding: 8px;
    flex-shrink: 0;
    background: #FFFFFF;
    border: 1px solid #d3d3d3;
    border-radius: 8px;
`;

export default function Hash256Component({lang}: { lang: string}) {
    const [source, setSource] = React.useState('');
    const [output, setOutput] = React.useState('');

    const encodeFunc = () => {
        if (!source) {
            return;
        }
        setOutput(encodeSHA256(source));
    }
    return <div className={sha256PageStyle}>
        <h1>{transKey(lang, "tools.sha256.name")}</h1>
        <textarea className={sourceTextStyle} placeholder={
            transKey(lang, "tools.common.inputPlaceholder")
        } value={source}
                  onChange={(event) => setSource(event.target.value)}/>
        <div className={toolButtonsStyle}>
            <Button variant="contained" size={'small'} onClick={encodeFunc}>
                {transKey(lang, "tools.sha256.encode")}
            </Button>
        </div>
        <textarea className={targetTextStyle} placeholder={
            transKey(lang, "tools.common.resultPlaceholder")
        } value={output} onChange={(event) =>
            setOutput(event.target.value)}/>
    </div>
}
