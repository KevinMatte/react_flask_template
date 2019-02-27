/* Copyright (C) 2019 Kevin Matte - All Rights Reserved */

// import $ from 'jquery';
import React from 'react';

export function getGridCellStyle(startRow, startCol, endRow, endCol) {
    endRow = (endRow !== undefined) ? endRow : startRow;
    endCol = (endCol !== undefined) ? endCol : startCol;

    return {gridArea: `${startRow} / ${startCol} / ${endRow} / ${endCol}`};
}

export function renderText(text) {
    let lines;
    if (Array.isArray(text))
        lines = text.map(line => line.trimEnd());
    else if (text instanceof Response) {
        lines = [`${text.status}: ${text.statusText}`]
    } else
        lines = (text || "").trimEnd().split("\n");
    return lines.map((line, idx) => <pre key={"key_" + idx}>{line}</pre>);
}



