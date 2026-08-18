// @vitest-environment node
// =============================================================
// Tests de l'analyseur EXIF local : parseur binaire (JPEG
// synthétique construit octet par octet), signaux d'audit,
// distance haversine et parsing GPS déclaré.
// =============================================================

import { describe, it, expect } from 'vitest';
import {
  parseExif, analyzeChallengePhoto, haversineKm, parseGpsString,
} from '../lib/exifAnalyzer';

// -------------------- Constructeur de JPEG EXIF synthétique --------------------

function buildExifJpeg(opts: {
  dateTimeOriginal?: string;    // "2026:08:18 10:30:00"
  gps?: { lat: number; lon: number };
  make?: string;
  software?: string;
}): ArrayBuffer {
  // Structure TIFF little-endian minimale avec IFD0 (+ ExifIFD, + GPSIFD)

  const push16 = (arr: number[], v: number) => { arr.push(v & 0xFF, (v >> 8) & 0xFF); };
  const push32 = (arr: number[], v: number) => { arr.push(v & 0xFF, (v >> 8) & 0xFF, (v >> 16) & 0xFF, (v >>> 24) & 0xFF); };

  // Zone de données après les IFD ; on assemble progressivement
  const ifd0Entries: { tag: number; type: number; count: number; value: number[] }[] = [];
  const exifEntries: { tag: number; type: number; count: number; value: number[] }[] = [];
  const gpsEntries: { tag: number; type: number; count: number; value: number[] }[] = [];
  const dataArea: number[] = [];

  // Layout : TIFF header (8) puis IFD0, ExifIFD, GPSIFD, données.
  // Calcul des tailles : IFD = 2 + n*12 + 4.
  const nIfd0 = (opts.make ? 1 : 0) + (opts.software ? 1 : 0)
    + (opts.dateTimeOriginal ? 1 : 0) /* ExifIFD ptr */
    + (opts.gps ? 1 : 0) /* GPSIFD ptr */;
  const nExif = opts.dateTimeOriginal ? 1 : 0;
  const nGps = opts.gps ? 4 : 0;

  const ifd0Start = 8;
  const ifd0Size = 2 + nIfd0 * 12 + 4;
  const exifStart = ifd0Start + ifd0Size;
  const exifSize = nExif > 0 ? 2 + nExif * 12 + 4 : 0;
  const gpsStart = exifStart + exifSize;
  const gpsSize = nGps > 0 ? 2 + nGps * 12 + 4 : 0;
  const dataStart = gpsStart + gpsSize;

  const addString = (s: string): { offset: number; len: number } => {
    const offset = dataStart + dataArea.length;
    for (const ch of s) dataArea.push(ch.charCodeAt(0));
    dataArea.push(0);
    return { offset, len: s.length + 1 };
  };
  const addRationals = (vals: [number, number][]): number => {
    const offset = dataStart + dataArea.length;
    for (const [num, den] of vals) { push32(dataArea, num); push32(dataArea, den); }
    return offset;
  };

  if (opts.make) {
    const { offset, len } = addString(opts.make);
    ifd0Entries.push({ tag: 0x010F, type: 2, count: len, value: (() => { const a: number[] = []; push32(a, offset); return a; })() });
  }
  if (opts.software) {
    const { offset, len } = addString(opts.software);
    ifd0Entries.push({ tag: 0x0131, type: 2, count: len, value: (() => { const a: number[] = []; push32(a, offset); return a; })() });
  }
  if (opts.dateTimeOriginal) {
    ifd0Entries.push({ tag: 0x8769, type: 4, count: 1, value: (() => { const a: number[] = []; push32(a, exifStart); return a; })() });
    const { offset, len } = addString(opts.dateTimeOriginal);
    exifEntries.push({ tag: 0x9003, type: 2, count: len, value: (() => { const a: number[] = []; push32(a, offset); return a; })() });
  }
  if (opts.gps) {
    ifd0Entries.push({ tag: 0x8825, type: 4, count: 1, value: (() => { const a: number[] = []; push32(a, gpsStart); return a; })() });
    const { lat, lon } = opts.gps;
    const absLat = Math.abs(lat); const absLon = Math.abs(lon);
    const toDms = (v: number): [number, number][] => {
      const d = Math.floor(v);
      const mFloat = (v - d) * 60;
      const m = Math.floor(mFloat);
      const s = Math.round((mFloat - m) * 60 * 1000);
      return [[d, 1], [m, 1], [s, 1000]];
    };
    const latOff = addRationals(toDms(absLat));
    const lonOff = addRationals(toDms(absLon));
    // Réfs ASCII 2 octets ("N\0") → INLINE dans le champ valeur (standard EXIF)
    gpsEntries.push({ tag: 0x0001, type: 2, count: 2, value: [(lat >= 0 ? 'N' : 'S').charCodeAt(0), 0, 0, 0] });
    gpsEntries.push({ tag: 0x0002, type: 5, count: 3, value: (() => { const a: number[] = []; push32(a, latOff); return a; })() });
    gpsEntries.push({ tag: 0x0003, type: 2, count: 2, value: [(lon >= 0 ? 'E' : 'W').charCodeAt(0), 0, 0, 0] });
    gpsEntries.push({ tag: 0x0004, type: 5, count: 3, value: (() => { const a: number[] = []; push32(a, lonOff); return a; })() });
  }

  // Assemble le TIFF
  const tiff: number[] = [];
  tiff.push(0x49, 0x49); // little-endian
  push16(tiff, 42);
  push32(tiff, ifd0Start);
  const writeIfd = (entries: typeof ifd0Entries) => {
    push16(tiff, entries.length);
    for (const e of entries) {
      push16(tiff, e.tag); push16(tiff, e.type); push32(tiff, e.count);
      const v = [...e.value];
      while (v.length < 4) v.push(0);
      tiff.push(...v);
    }
    push32(tiff, 0); // next IFD
  };
  writeIfd(ifd0Entries);
  if (exifSize > 0) writeIfd(exifEntries);
  if (gpsSize > 0) writeIfd(gpsEntries);
  tiff.push(...dataArea);

  // Enveloppe JPEG : SOI + APP1(Exif) + EOI
  const exifHeader = [0x45, 0x78, 0x69, 0x66, 0x00, 0x00]; // "Exif\0\0"
  const app1Len = 2 + exifHeader.length + tiff.length;
  const jpeg: number[] = [0xFF, 0xD8, 0xFF, 0xE1, (app1Len >> 8) & 0xFF, app1Len & 0xFF, ...exifHeader, ...tiff, 0xFF, 0xD9];
  return new Uint8Array(jpeg).buffer;
}

// -------------------- Tests --------------------

describe('parseExif', () => {
  it('fichier non-JPEG → hasExif false', () => {
    expect(parseExif(new Uint8Array([1, 2, 3, 4]).buffer).hasExif).toBe(false);
  });
  it('JPEG sans APP1 → hasExif false', () => {
    expect(parseExif(new Uint8Array([0xFF, 0xD8, 0xFF, 0xD9]).buffer).hasExif).toBe(false);
  });
  it('extrait date, appareil et logiciel', () => {
    const buf = buildExifJpeg({ dateTimeOriginal: '2026:08:18 10:30:00', make: 'TestCam', software: 'Adobe Photoshop 2026' });
    const exif = parseExif(buf);
    expect(exif.hasExif).toBe(true);
    expect(exif.make).toBe('TestCam');
    expect(exif.software).toContain('Photoshop');
    expect(exif.takenAt?.toISOString()).toBe('2026-08-18T10:30:00.000Z');
  });
  it('extrait le GPS (hémisphères N/E et S/W)', () => {
    const ne = parseExif(buildExifJpeg({ gps: { lat: 6.1725, lon: 38.2039 } })); // Yirgacheffe
    expect(ne.gps).toBeDefined();
    expect(ne.gps!.lat).toBeCloseTo(6.1725, 3);
    expect(ne.gps!.lon).toBeCloseTo(38.2039, 3);
    const sw = parseExif(buildExifJpeg({ gps: { lat: -18.9333, lon: -48.2833 } }));
    expect(sw.gps!.lat).toBeCloseTo(-18.9333, 3);
    expect(sw.gps!.lon).toBeCloseTo(-48.2833, 3);
  });
});

describe('haversineKm / parseGpsString', () => {
  it('Paris → Addis-Abeba ≈ 5570 km', () => {
    const km = haversineKm({ lat: 48.8566, lon: 2.3522 }, { lat: 9.0192, lon: 38.7525 });
    expect(km).toBeGreaterThan(5300);
    expect(km).toBeLessThan(5800);
  });
  it('parse des formats souples', () => {
    expect(parseGpsString('6.1725, 38.2039')).toEqual({ lat: 6.1725, lon: 38.2039 });
    expect(parseGpsString('-18,9333; -48,2833')).toEqual({ lat: -18.9333, lon: -48.2833 });
    expect(parseGpsString('n/a')).toBeNull();
    expect(parseGpsString('999, 999')).toBeNull();
    expect(parseGpsString(null)).toBeNull();
  });
});

describe('analyzeChallengePhoto — signaux d\'audit', () => {
  const challengeDate = new Date('2026-08-17T09:00:00Z');

  it('photo APRÈS le défi + GPS proche → signaux positifs', () => {
    const exif = parseExif(buildExifJpeg({
      dateTimeOriginal: '2026:08:18 10:30:00',
      gps: { lat: 6.18, lon: 38.21 },
      make: 'Samsung',
    }));
    const signals = analyzeChallengePhoto(exif, challengeDate, { lat: 6.1725, lon: 38.2039 });
    expect(signals.find(s => s.code === 'taken_after_challenge')?.severity).toBe('good');
    expect(signals.find(s => s.code === 'gps_near_declared')?.severity).toBe('good');
    expect(signals.find(s => s.code === 'camera_known')).toBeDefined();
  });

  it('photo AVANT le défi → alerte (photo antérieure au code)', () => {
    const exif = parseExif(buildExifJpeg({ dateTimeOriginal: '2026:08:01 08:00:00' }));
    const signals = analyzeChallengePhoto(exif, challengeDate);
    expect(signals.find(s => s.code === 'taken_before_challenge')?.severity).toBe('warning');
  });

  it('GPS à 500 km des coordonnées déclarées → alerte', () => {
    const exif = parseExif(buildExifJpeg({ gps: { lat: 10.5, lon: 38.2 } }));
    const signals = analyzeChallengePhoto(exif, challengeDate, { lat: 6.1725, lon: 38.2039 });
    expect(signals.find(s => s.code === 'gps_far_from_declared')?.severity).toBe('warning');
  });

  it('logiciel d\'édition détecté → alerte', () => {
    const exif = parseExif(buildExifJpeg({ software: 'GIMP 2.10' }));
    const signals = analyzeChallengePhoto(exif, challengeDate);
    expect(signals.find(s => s.code === 'editing_software')?.severity).toBe('warning');
  });

  it('pas d\'EXIF → info neutre, JAMAIS une accusation', () => {
    const signals = analyzeChallengePhoto({ hasExif: false }, challengeDate);
    expect(signals).toHaveLength(1);
    expect(signals[0].code).toBe('no_exif');
    expect(signals[0].severity).toBe('info');
  });
});
