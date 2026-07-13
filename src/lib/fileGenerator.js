// fileGenerator — Utility to generate downloadable files from text content.
// Supports: PDF, TXT, Markdown, Word (.doc), CSV, and HTML.
// Returns File objects that can be uploaded via UploadFile integration.

import { jsPDF } from 'jspdf';

const FILE_CONFIG = {
  pdf: { ext: 'pdf', mime: 'application/pdf', label: 'PDF' },
  txt: { ext: 'txt', mime: 'text/plain', label: 'Texto' },
  markdown: { ext: 'md', mime: 'text/markdown', label: 'Markdown' },
  word: { ext: 'doc', mime: 'application/msword', label: 'Word' },
  csv: { ext: 'csv', mime: 'text/csv', label: 'Hoja de cálculo' },
  html: { ext: 'html', mime: 'text/html', label: 'HTML' },
};

export function getFileInfo(type) {
  return FILE_CONFIG[type] || FILE_CONFIG.txt;
}

export function getSupportedTypes() {
  return Object.keys(FILE_CONFIG);
}

function sanitizeFileName(name) {
  return (name || 'documento')
    .replace(/[^\w\sáéíóúñÁÉÍÓÚÑ-]/g, '')
    .trim()
    .replace(/\s+/g, '_')
    .slice(0, 60);
}

// ── PDF generation via jsPDF ──
function generatePDF(content, fileName) {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 48;
  const maxWidth = pageWidth - margin * 2;
  const lineHeight = 16;
  let y = margin;

  const lines = doc.splitTextToSize(content || '', maxWidth);
  for (const line of lines) {
    if (y + lineHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
    doc.text(line, margin, y);
    y += lineHeight;
  }
  const blob = doc.output('blob');
  return new File([blob], `${fileName}.pdf`, { type: 'application/pdf' });
}

// ── Word document (.doc) via HTML wrapper ──
function generateWord(content, fileName) {
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><title>${fileName}</title></head>
    <body style="font-family: Calibri, Arial, sans-serif; font-size: 11pt;">
    ${(content || '').split('\n').map(p => `<p>${p}</p>`).join('')}
    </body></html>`;
  const blob = new Blob([html], { type: 'application/msword' });
  return new File([blob], `${fileName}.doc`, { type: 'application/msword' });
}

// ── CSV from array of rows or from text ──
function generateCSV(content, fileName) {
  let csvText;
  if (Array.isArray(content)) {
    csvText = content
      .map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n');
  } else {
    csvText = String(content || '');
  }
  const blob = new Blob(['\ufeff' + csvText], { type: 'text/csv;charset=utf-8' });
  return new File([blob], `${fileName}.csv`, { type: 'text/csv' });
}

// ── TXT ──
function generateTXT(content, fileName) {
  const blob = new Blob([content || ''], { type: 'text/plain;charset=utf-8' });
  return new File([blob], `${fileName}.txt`, { type: 'text/plain' });
}

// ── Markdown ──
function generateMarkdown(content, fileName) {
  const blob = new Blob([content || ''], { type: 'text/markdown;charset=utf-8' });
  return new File([blob], `${fileName}.md`, { type: 'text/markdown' });
}

// ── HTML ──
function generateHTML(content, fileName) {
  const blob = new Blob([content || ''], { type: 'text/html;charset=utf-8' });
  return new File([blob], `${fileName}.html`, { type: 'text/html' });
}

const GENERATORS = {
  pdf: generatePDF,
  txt: generateTXT,
  markdown: generateMarkdown,
  word: generateWord,
  csv: generateCSV,
  html: generateHTML,
};

// Main entry — generates a File object from text content.
// type: 'pdf' | 'txt' | 'markdown' | 'word' | 'csv' | 'html'
// content: string (or array of arrays for CSV)
// fileName: string (without extension)
export function generateFile(content, type = 'txt', fileName = 'documento') {
  const safeName = sanitizeFileName(fileName);
  const generator = GENERATORS[type] || generateTXT;
  return generator(content, safeName);
}

// Generate and immediately trigger download (for non-chat contexts).
export function downloadFile(content, type, fileName) {
  const file = generateFile(content, type, fileName);
  const url = URL.createObjectURL(file);
  const a = document.createElement('a');
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return file;
}