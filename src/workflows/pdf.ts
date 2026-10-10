interface PdfImage { bytes: Uint8Array; width: number; height: number }
// Image-backed PDF keeps Arabic shaping identical to the browser's canvas rendering.
// Output is deliberately unencrypted and labelled as demonstration data.
export function assemblePdf(pages: PdfImage[]): Uint8Array {
  if (!pages.length) throw new Error('No pages to export');
  const encode = (text: string) => new TextEncoder().encode(text);
  const chunks: Uint8Array[] = [];
  let length = 0;
  const append = (bytes: Uint8Array) => { chunks.push(bytes); length += bytes.length; };
  const offsets = [0];
  const object = (id: number, body: Uint8Array[]) => {
    offsets[id] = length;
    append(encode(`${id} 0 obj\n`)); body.forEach(append); append(encode('\nendobj\n'));
  };
  append(encode('%PDF-1.4\n'));
  object(1, [encode('<< /Type /Catalog /Pages 2 0 R >>')]);
  object(2, [encode(`<< /Type /Pages /Count ${pages.length} /Kids [${pages.map((_, i) => `${3 + i * 3} 0 R`).join(' ')}] >>`)]);
  pages.forEach((page, i) => {
    const id = 3 + i * 3;
    object(id, [encode(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /XObject << /Im${i} ${id + 1} 0 R >> >> /Contents ${id + 2} 0 R >>`)]);
    object(id + 1, [encode(`<< /Type /XObject /Subtype /Image /Width ${page.width} /Height ${page.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.bytes.length} >>\nstream\n`), page.bytes, encode('\nendstream')]);
    const commands = encode(`q\n595 0 0 842 0 0 cm\n/Im${i} Do\nQ`);
    object(id + 2, [encode(`<< /Length ${commands.length} >>\nstream\n`), commands, encode('\nendstream')]);
  });
  const start = length;
  append(encode(`xref\n0 ${offsets.length}\n0000000000 65535 f \n`));
  for (const offset of offsets.slice(1)) append(encode(`${String(offset).padStart(10, '0')} 00000 n \n`));
  append(encode(`trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${start}\n%%EOF\n`));
  const output = new Uint8Array(length);
  let cursor = 0;
  chunks.forEach(chunk => { output.set(chunk, cursor); cursor += chunk.length; });
  return output;
}

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url; link.download = filename; document.body.append(link); link.click(); link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export async function downloadTextPdf(title: string, text: string, filename: string, isAr = false, watermark = '') {
  if (!text.trim()) throw new Error('No report content to export');
  await document.fonts.ready;
  const canvas = document.createElement('canvas');
  canvas.width = 1240; canvas.height = 1754;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('PDF rendering is unavailable');
  ctx.font = `26px ${isAr ? 'Cairo' : 'Manrope'}, sans-serif`;
  const lines: string[] = [];
  for (const paragraph of text.trim().split('\n')) {
    let line = '';
    for (const word of paragraph.split(/\s+/)) {
      const next = line ? `${line} ${word}` : word;
      if (ctx.measureText(next).width > 1080 && line) { lines.push(line); line = word; }
      else line = next;
    }
    lines.push(line);
  }
  const perPage = 39, pages: PdfImage[] = [], total = Math.ceil(lines.length / perPage);
  const generated = new Date().toLocaleString(isAr ? 'ar-OM' : 'en-GB');
  for (let page = 0; page < total; page++) {
    ctx.fillStyle = '#F8F5F0'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#071426'; ctx.fillRect(0, 0, canvas.width, 130);
    ctx.font = 'bold 34px Manrope, sans-serif'; ctx.fillStyle = '#C5A365'; ctx.textAlign = 'left'; ctx.direction = 'ltr';
    ctx.fillText('AL-AMEEN · DEMONSTRATION REPORT', 70, 62);
    ctx.font = `28px ${isAr ? 'Cairo' : 'Manrope'}, sans-serif`; ctx.fillStyle = '#F8F5F0';
    ctx.fillText(title, 70, 107, 1100);
    ctx.fillStyle = '#071426'; ctx.font = `26px ${isAr ? 'Cairo' : 'Manrope'}, sans-serif`;
    ctx.textAlign = isAr ? 'right' : 'left'; ctx.direction = isAr ? 'rtl' : 'ltr';
    lines.slice(page * perPage, (page + 1) * perPage).forEach((line, i) => ctx.fillText(line, isAr ? 1170 : 70, 200 + i * 36, 1100));
    ctx.font = '20px Manrope, sans-serif'; ctx.textAlign = 'left'; ctx.direction = 'ltr';
    ctx.fillText(`Generated ${generated} · Page ${page + 1} of ${total} · Unencrypted demo output`, 70, 1680, 1100);
    if (watermark) { ctx.save(); ctx.translate(620, 870); ctx.rotate(-Math.PI / 5); ctx.globalAlpha = 0.12; ctx.font = 'bold 70px Manrope, sans-serif'; ctx.textAlign = 'center'; ctx.fillText(watermark, 0, 0, 1100); ctx.restore(); }
    const encoded = canvas.toDataURL('image/jpeg', 0.9).split(',')[1];
    pages.push({ bytes: Uint8Array.from(atob(encoded), c => c.charCodeAt(0)), width: canvas.width, height: canvas.height });
  }
  const bytes = assemblePdf(pages);
  downloadFile(new Blob([bytes.buffer as ArrayBuffer], { type: 'application/pdf' }), filename);
}
