// =============================================================
// EthiMarket — Analyse EXIF locale (zéro dépendance, zéro API)
//
// Extrait des métadonnées JPEG (EXIF TIFF IFD) : date de prise
// de vue, coordonnées GPS, appareil, logiciel. Utilisé pour le
// contrôle automatique des photos soumises aux défis :
//  - la photo a-t-elle été prise APRÈS le lancement du défi ?
//  - le GPS est-il présent et proche des coordonnées déclarées ?
//  - un logiciel d'édition est-il passé par là ?
//
// HONNÊTETÉ : l'absence d'EXIF n'est PAS une preuve de fraude
// (WhatsApp et beaucoup d'apps strippent les métadonnées). Les
// signaux sont présentés comme des INDICES à l'auditeur humain,
// jamais comme un verdict automatique.
// =============================================================

export interface ExifData {
  hasExif: boolean;
  takenAt?: Date;          // DateTimeOriginal
  gps?: { lat: number; lon: number };
  make?: string;           // fabricant de l'appareil
  model?: string;
  software?: string;       // logiciel ayant écrit le fichier
}

export interface ExifSignal {
  severity: 'good' | 'info' | 'warning';
  code: 'taken_after_challenge' | 'taken_before_challenge' | 'no_exif' | 'no_date'
      | 'gps_present' | 'gps_missing' | 'gps_near_declared' | 'gps_far_from_declared'
      | 'editing_software' | 'camera_known';
  detail: string;
}

// -------------------- Parseur EXIF (JPEG APP1) --------------------

function readUint16(view: DataView, offset: number, little: boolean): number {
  return view.getUint16(offset, little);
}
function readUint32(view: DataView, offset: number, little: boolean): number {
  return view.getUint32(offset, little);
}

/** Lit une chaîne ASCII à un offset donné. */
function readAscii(view: DataView, offset: number, length: number): string {
  let s = '';
  for (let i = 0; i < length; i++) {
    const c = view.getUint8(offset + i);
    if (c === 0) break;
    s += String.fromCharCode(c);
  }
  return s.trim();
}

/** Lit un rationnel non signé (num/den). */
function readRational(view: DataView, offset: number, little: boolean): number {
  const num = readUint32(view, offset, little);
  const den = readUint32(view, offset + 4, little);
  return den === 0 ? 0 : num / den;
}

interface IfdEntry { tag: number; type: number; count: number; valueOffset: number }

function readIfdEntries(view: DataView, ifdOffset: number, little: boolean): IfdEntry[] {
  const entries: IfdEntry[] = [];
  if (ifdOffset + 2 > view.byteLength) return entries;
  const count = readUint16(view, ifdOffset, little);
  for (let i = 0; i < count; i++) {
    const base = ifdOffset + 2 + i * 12;
    if (base + 12 > view.byteLength) break;
    entries.push({
      tag: readUint16(view, base, little),
      type: readUint16(view, base + 2, little),
      count: readUint32(view, base + 4, little),
      valueOffset: base + 8,
    });
  }
  return entries;
}

/** Résout l'offset réel de la valeur (inline si ≤ 4 octets, sinon pointeur). */
function valuePointer(view: DataView, e: IfdEntry, tiffStart: number, little: boolean): number {
  const sizes: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 };
  const byteLen = (sizes[e.type] ?? 1) * e.count;
  return byteLen <= 4 ? e.valueOffset : tiffStart + readUint32(view, e.valueOffset, little);
}

function parseExifDate(s: string): Date | undefined {
  // Format EXIF : "YYYY:MM:DD HH:MM:SS"
  const m = s.match(/^(\d{4}):(\d{2}):(\d{2})[ T](\d{2}):(\d{2}):(\d{2})/);
  if (!m) return undefined;
  const d = new Date(Date.UTC(+m[1], +m[2] - 1, +m[3], +m[4], +m[5], +m[6]));
  return Number.isNaN(d.getTime()) ? undefined : d;
}

/**
 * Parse les métadonnées EXIF d'un JPEG. Fonction PURE (ArrayBuffer in).
 * Retourne hasExif=false si le fichier n'est pas JPEG ou sans APP1.
 */
export function parseExif(buffer: ArrayBuffer): ExifData {
  const view = new DataView(buffer);
  const none: ExifData = { hasExif: false };
  if (view.byteLength < 4 || view.getUint16(0) !== 0xFFD8) return none; // pas un JPEG

  // Cherche le segment APP1 (EXIF)
  let offset = 2;
  let app1: number | null = null;
  while (offset + 4 < view.byteLength) {
    const marker = view.getUint16(offset);
    const size = view.getUint16(offset + 2);
    if (marker === 0xFFE1) { app1 = offset + 4; break; }
    if ((marker & 0xFF00) !== 0xFF00) break;
    offset += 2 + size;
  }
  if (app1 === null) return none;
  if (readAscii(view, app1, 4) !== 'Exif') return none;

  const tiffStart = app1 + 6;
  if (tiffStart + 8 > view.byteLength) return none;
  const byteOrder = view.getUint16(tiffStart);
  const little = byteOrder === 0x4949;
  if (!little && byteOrder !== 0x4D4D) return none;

  const ifd0Offset = tiffStart + readUint32(view, tiffStart + 4, little);
  const ifd0 = readIfdEntries(view, ifd0Offset, little);

  const result: ExifData = { hasExif: true };
  let exifIfdPtr: number | null = null;
  let gpsIfdPtr: number | null = null;

  for (const e of ifd0) {
    const ptr = valuePointer(view, e, tiffStart, little);
    if (e.tag === 0x010F) result.make = readAscii(view, ptr, e.count);        // Make
    if (e.tag === 0x0110) result.model = readAscii(view, ptr, e.count);       // Model
    if (e.tag === 0x0131) result.software = readAscii(view, ptr, e.count);    // Software
    if (e.tag === 0x8769) exifIfdPtr = tiffStart + readUint32(view, e.valueOffset, little); // ExifIFD
    if (e.tag === 0x8825) gpsIfdPtr = tiffStart + readUint32(view, e.valueOffset, little);  // GPSIFD
  }

  if (exifIfdPtr !== null) {
    for (const e of readIfdEntries(view, exifIfdPtr, little)) {
      if (e.tag === 0x9003 || e.tag === 0x9004) { // DateTimeOriginal / DateTimeDigitized
        const ptr = valuePointer(view, e, tiffStart, little);
        const d = parseExifDate(readAscii(view, ptr, e.count));
        if (d && !result.takenAt) result.takenAt = d;
      }
    }
  }

  if (gpsIfdPtr !== null) {
    let latRef = 'N'; let lonRef = 'E';
    let lat: number | undefined; let lon: number | undefined;
    for (const e of readIfdEntries(view, gpsIfdPtr, little)) {
      const ptr = valuePointer(view, e, tiffStart, little);
      if (e.tag === 0x0001) latRef = readAscii(view, ptr, e.count) || 'N';
      if (e.tag === 0x0003) lonRef = readAscii(view, ptr, e.count) || 'E';
      if (e.tag === 0x0002 && e.count >= 3) {
        lat = readRational(view, ptr, little)
          + readRational(view, ptr + 8, little) / 60
          + readRational(view, ptr + 16, little) / 3600;
      }
      if (e.tag === 0x0004 && e.count >= 3) {
        lon = readRational(view, ptr, little)
          + readRational(view, ptr + 8, little) / 60
          + readRational(view, ptr + 16, little) / 3600;
      }
    }
    if (lat !== undefined && lon !== undefined && (lat !== 0 || lon !== 0)) {
      result.gps = {
        lat: latRef.toUpperCase().startsWith('S') ? -lat : lat,
        lon: lonRef.toUpperCase().startsWith('W') ? -lon : lon,
      };
    }
  }

  return result;
}

// -------------------- Signaux d'audit (fonctions pures) --------------------

/** Distance haversine en km. */
export function haversineKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371;
  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLon = (b.lon - a.lon) * Math.PI / 180;
  const s = Math.sin(dLat / 2) ** 2
    + Math.cos(a.lat * Math.PI / 180) * Math.cos(b.lat * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(s)) * 10) / 10;
}

/** Parse "lat, lon" déclaré par le producteur (formats souples). */
export function parseGpsString(s: string | null | undefined): { lat: number; lon: number } | null {
  if (!s) return null;
  const m = s.match(/(-?\d+(?:[.,]\d+)?)\s*[,;]\s*(-?\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  const lat = parseFloat(m[1].replace(',', '.'));
  const lon = parseFloat(m[2].replace(',', '.'));
  if (Number.isNaN(lat) || Number.isNaN(lon) || Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

const EDITING_SOFTWARE = /photoshop|gimp|lightroom|canva|pixlr|snapseed|picsart|affinity/i;

/**
 * Produit les signaux d'audit pour une photo de défi.
 * challengeCreatedAt : date de création du défi (la photo doit être postérieure).
 * declaredGps : coordonnées GPS déclarées par le producteur (optionnel).
 */
export function analyzeChallengePhoto(
  exif: ExifData,
  challengeCreatedAt: Date,
  declaredGps?: { lat: number; lon: number } | null,
): ExifSignal[] {
  const signals: ExifSignal[] = [];

  if (!exif.hasExif) {
    signals.push({
      severity: 'info', code: 'no_exif',
      detail: "Aucune métadonnée EXIF (courant : WhatsApp et beaucoup d'apps les suppriment). À corroborer par le contenu de la photo.",
    });
    return signals;
  }

  // Date de prise de vue vs lancement du défi
  if (exif.takenAt) {
    if (exif.takenAt.getTime() >= challengeCreatedAt.getTime() - 60_000) {
      signals.push({
        severity: 'good', code: 'taken_after_challenge',
        detail: `Photo prise le ${exif.takenAt.toISOString().slice(0, 16).replace('T', ' ')} UTC, APRÈS le lancement du défi — cohérent.`,
      });
    } else {
      signals.push({
        severity: 'warning', code: 'taken_before_challenge',
        detail: `⚠️ Photo datée du ${exif.takenAt.toISOString().slice(0, 16).replace('T', ' ')} UTC, AVANT le lancement du défi : le code ne peut pas y figurer légitimement.`,
      });
    }
  } else {
    signals.push({ severity: 'info', code: 'no_date', detail: 'Pas de date de prise de vue dans les EXIF.' });
  }

  // GPS
  if (exif.gps) {
    if (declaredGps) {
      const km = haversineKm(exif.gps, declaredGps);
      if (km <= 10) {
        signals.push({
          severity: 'good', code: 'gps_near_declared',
          detail: `GPS de la photo à ${km} km des coordonnées déclarées de l'exploitation — cohérent.`,
        });
      } else {
        signals.push({
          severity: 'warning', code: 'gps_far_from_declared',
          detail: `⚠️ GPS de la photo à ${km} km des coordonnées déclarées (${exif.gps.lat.toFixed(4)}, ${exif.gps.lon.toFixed(4)}). À questionner.`,
        });
      }
    } else {
      signals.push({
        severity: 'good', code: 'gps_present',
        detail: `Coordonnées GPS présentes (${exif.gps.lat.toFixed(4)}, ${exif.gps.lon.toFixed(4)}) — vérifiables sur carte satellite.`,
      });
    }
  } else {
    signals.push({ severity: 'info', code: 'gps_missing', detail: 'Pas de GPS dans les EXIF (GPS désactivé ou métadonnées retirées).' });
  }

  // Logiciel d'édition
  if (exif.software && EDITING_SOFTWARE.test(exif.software)) {
    signals.push({
      severity: 'warning', code: 'editing_software',
      detail: `⚠️ Fichier passé par un logiciel d'édition : ${exif.software}.`,
    });
  }

  // Appareil identifié
  if (exif.make || exif.model) {
    signals.push({
      severity: 'good', code: 'camera_known',
      detail: `Appareil : ${[exif.make, exif.model].filter(Boolean).join(' ')}.`,
    });
  }

  return signals;
}
