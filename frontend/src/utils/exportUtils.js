import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Clean and format filename safely
 */
export function sanitizeFilename(name) {
  return (name || 'gyan-notes')
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'gyan-notes';
}

/**
 * Export note as raw Markdown (.md)
 */
export function exportToMarkdown(title, content) {
  const text = `# ${title}\n\n${content}`;
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  triggerDownload(blob, `${sanitizeFilename(title)}.md`);
}

/**
 * Export note as Plain Text (.txt)
 */
export function exportToPlainText(title, content) {
  // Strip Markdown symbols for clean plain text
  const clean = content
    .replace(/```[\s\S]*?```/g, (m) => m.replace(/```\w*\n?|```/g, ''))
    .replace(/`([^`]+)`/g, '$1')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  const text = `${title.toUpperCase()}\n${'='.repeat(title.length)}\n\n${clean}\n\n---\nSynthesized with gyan.ai • Living Tree Engine`;
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  triggerDownload(blob, `${sanitizeFilename(title)}.txt`);
}

/**
 * Convert Markdown text to clean semantic HTML for Word export
 */
function markdownToHtml(title, markdown) {
  let html = markdown
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre style="background:#f1f5f9;border:1px solid #cbd5e1;padding:12px;border-radius:8px;font-family:Consolas,monospace;font-size:11pt;overflow-x:auto;"><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code style="background:#f1f5f9;border:1px solid #e2e8f0;padding:2px 5px;border-radius:4px;font-family:Consolas,monospace;font-size:10pt;color:#059669;">$1</code>')
    // Headings
    .replace(/^### (.*$)/gim, '<h3 style="color:#0f766e;font-size:13pt;font-weight:bold;margin-top:16px;margin-bottom:6px;">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 style="color:#065f46;font-size:16pt;font-weight:bold;margin-top:22px;margin-bottom:8px;border-bottom:1.5px solid #a7f3d0;padding-bottom:4px;">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 style="color:#064e3b;font-size:20pt;font-weight:bold;margin-top:26px;margin-bottom:10px;">$1</h1>')
    // Bold and Italic
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    // Blockquotes
    .replace(/^\> (.*$)/gim, '<blockquote style="border-left:4px solid #10b981;background:#f0fdf4;padding:8px 14px;margin:12px 0;color:#065f46;font-style:italic;">$1</blockquote>')
    // Unordered lists
    .replace(/^\s*-\s+(.*$)/gim, '<li style="margin-bottom:4px;">$1</li>')
    // Ordered lists
    .replace(/^\s*\d+\.\s+(.*$)/gim, '<li style="margin-bottom:4px;">$1</li>')
    // Paragraphs & Line breaks
    .replace(/\n\n/g, '</p><p style="margin-bottom:10px;line-height:1.6;color:#1e293b;">')
    .replace(/\n/g, '<br />');

  return `
    <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>${title}</title>
        <style>
          body {
            font-family: 'Segoe UI', Calibri, Arial, sans-serif;
            font-size: 11.5pt;
            line-height: 1.65;
            color: #1e293b;
            padding: 40px;
          }
          h1, h2, h3, h4 { font-family: 'Segoe UI Semibold', Arial, sans-serif; }
          ul, ol { margin-left: 20px; margin-bottom: 12px; }
          table { border-collapse: collapse; width: 100%; margin: 16px 0; }
          th, td { border: 1px solid #cbd5e1; padding: 8px 12px; font-size: 10.5pt; text-align: left; }
          th { background: #e6f4ea; color: #065f46; font-weight: bold; }
          .header-banner {
            background: linear-gradient(135deg, #059669, #0d9488);
            color: #ffffff;
            padding: 20px 24px;
            border-radius: 12px;
            margin-bottom: 24px;
          }
          .footer-note {
            margin-top: 40px;
            padding-top: 14px;
            border-top: 1px solid #e2e8f0;
            font-size: 9.5pt;
            color: #64748b;
            text-align: center;
          }
        </style>
      </head>
      <body>
        <div class="header-banner" style="background:#059669;color:#ffffff;padding:16px 20px;border-radius:8px;margin-bottom:24px;">
          <div style="font-size:9pt;text-transform:uppercase;letter-spacing:1.5px;font-weight:bold;color:#a7f3d0;margin-bottom:4px;">
            gyan.ai • Living Tree Note Synthesis Engine
          </div>
          <h1 style="color:#ffffff;margin:0;font-size:22pt;line-height:1.2;">${title}</h1>
          <div style="font-size:9pt;color:#d1fae5;margin-top:6px;">
            Generated on ${new Date().toLocaleDateString(undefined, { dateStyle: 'full' })}
          </div>
        </div>

        <div class="content">
          <p style="margin-bottom:10px;line-height:1.6;color:#1e293b;">
            ${html}
          </p>
        </div>

        <div class="footer-note">
          Synthesized by <strong>gyan.ai</strong> • Cultivating Living Neural Knowledge
        </div>
      </body>
    </html>
  `;
}

/**
 * Export note as Microsoft Word document (.doc)
 */
export function exportToWord(title, content) {
  const htmlContent = markdownToHtml(title, content);
  const blob = new Blob(['\ufeff', htmlContent], {
    type: 'application/msword;charset=utf-8',
  });
  triggerDownload(blob, `${sanitizeFilename(title)}.doc`);
}

/**
 * Export note as High-Quality PDF (.pdf)
 */
export async function exportToPDF(title, content, elementRef) {
  // Option A: Render directly from the live DOM element for pixel-perfect diagrams and math
  if (elementRef) {
    try {
      const canvas = await html2canvas(elementRef, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#0a1612', // deep theme background
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Multi-page handling
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
      }

      pdf.save(`${sanitizeFilename(title)}.pdf`);
      return;
    } catch (err) {
      console.warn('html2canvas render failed, falling back to clean text PDF generator:', err);
    }
  }

  // Fallback / Standalone PDF generation
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const margin = 40;
  const pageWidth = doc.internal.pageSize.getWidth();
  const maxLineWidth = pageWidth - margin * 2;

  // Header Banner
  doc.setFillColor(5, 150, 105);
  doc.rect(margin, 35, maxLineWidth, 65, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(167, 243, 208);
  doc.text('GYAN.AI • LIVING TREE SYNTHESIS', margin + 15, 55);

  doc.setFontSize(16);
  doc.setTextColor(255, 255, 255);
  const titleLines = doc.splitTextToSize(title, maxLineWidth - 30);
  doc.text(titleLines, margin + 15, 78);

  let cursorY = 125;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10.5);
  doc.setTextColor(30, 41, 59);

  const cleanContent = content
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1');

  const lines = doc.splitTextToSize(cleanContent, maxLineWidth);

  for (let i = 0; i < lines.length; i++) {
    if (cursorY > doc.internal.pageSize.getHeight() - 40) {
      doc.addPage();
      cursorY = 40;
    }
    doc.text(lines[i], margin, cursorY);
    cursorY += 15;
  }

  doc.save(`${sanitizeFilename(title)}.pdf`);
}

/**
 * Trigger file download helper
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
