/**
 * Minimal ZIP writer (STORE, no compression) — browser download without deps.
 */

function crc32(data: Uint8Array): number {
  let crc = 0xffffffff;
  for (let i = 0; i < data.length; i++) {
    crc ^= data[i];
    for (let j = 0; j < 8; j++) crc = crc & 1 ? (crc >>> 1) ^ 0xedb88320 : crc >>> 1;
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function u16(n: number) { return [n & 0xff, (n >>> 8) & 0xff]; }
function u32(n: number) { return [n & 0xff, (n >> 8) & 0xff, (n >> 16) & 0xff, (n >> 24) & 0xff]; }

export function downloadFilesAsZip(
  files: { path: string; content: string }[],
  zipName: string,
): void {
  const enc = new TextEncoder();
  const parts: Uint8Array[] = [];
  const central: Uint8Array[] = [];
  let offset = 0;

  for (const file of files) {
    const nameBytes = enc.encode(file.path.replace(/\\/g, '/'));
    const data = enc.encode(file.content);
    const crc = crc32(data);
    const local = new Uint8Array([
      0x50, 0x4b, 0x03, 0x04, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00,
      ...u32(crc),
      ...u32(data.length),
      ...u32(data.length),
      ...u16(nameBytes.length),
      0x00, 0x00,
      ...nameBytes,
      ...data,
    ]);
    parts.push(local);

    const cd = new Uint8Array([
      0x50, 0x4b, 0x01, 0x02, 0x14, 0x00, 0x0a, 0x00, 0x00, 0x00, 0x00, 0x00,
      ...u32(crc),
      ...u32(data.length),
      ...u32(data.length),
      ...u16(nameBytes.length),
      0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
      ...u32(offset),
      ...nameBytes,
    ]);
    central.push(cd);
    offset += local.length;
  }

  const centralSize = central.reduce((s, c) => s + c.length, 0);
  const centralStart = offset;
  const end = new Uint8Array([
    0x50, 0x4b, 0x05, 0x06, 0x00, 0x00, 0x00, 0x00,
    ...u16(files.length),
    ...u16(files.length),
    ...u32(centralSize),
    ...u32(centralStart),
    0x00, 0x00,
  ]);

  const total = new Uint8Array(
    [...parts, ...central].reduce((s, p) => s + p.length, 0) + end.length,
  );
  let pos = 0;
  for (const p of [...parts, ...central]) {
    total.set(p, pos);
    pos += p.length;
  }
  total.set(end, pos);

  const blob = new Blob([total], { type: 'application/zip' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = zipName.endsWith('.zip') ? zipName : `${zipName}.zip`;
  a.click();
  URL.revokeObjectURL(url);
}
