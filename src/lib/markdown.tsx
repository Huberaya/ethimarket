import { Fragment, type ReactNode } from 'react';

/**
 * Rendu Markdown maison, déterministe et sans dépendance (politique zéro coût).
 * Couvre le sous-ensemble utilisé par les documents docs/*.md :
 * titres #..####, tables, listes (imbriquées, numérotées, cases à cocher),
 * citations, blocs de code, gras/italique/code inline, liens, séparateurs.
 */

// ---------------------------------------------------------------- slugs

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 80);
}

export interface MdHeading {
  level: number;
  text: string;
  id: string;
}

/** Extrait les titres (pour construire un sommaire). */
export function extractHeadings(md: string, maxLevel = 2): MdHeading[] {
  const headings: MdHeading[] = [];
  const seen = new Map<string, number>();
  let inFence = false;
  for (const line of md.split('\n')) {
    if (/^```/.test(line)) { inFence = !inFence; continue; }
    if (inFence) continue;
    const m = /^(#{1,4})\s+(.*)$/.exec(line);
    if (!m) continue;
    const level = m[1].length;
    if (level > maxLevel) continue;
    const text = m[2].replace(/\*\*?/g, '').trim();
    let id = slugify(text);
    const n = (seen.get(id) ?? 0) + 1;
    seen.set(id, n);
    if (n > 1) id = `${id}-${n}`;
    headings.push({ level, text, id });
  }
  return headings;
}

// ---------------------------------------------------------------- inline

const INLINE_RE = /(`[^`]+`)|(\*\*[^*]+\*\*)|(\*[^*\n]+\*)|(\[[^\]]+\]\([^)\s]+\))/g;

function renderInline(text: string): ReactNode {
  const nodes: ReactNode[] = [];
  let last = 0;
  let key = 0;
  for (const m of text.matchAll(INLINE_RE)) {
    const idx = m.index ?? 0;
    if (idx > last) nodes.push(text.slice(last, idx));
    const tok = m[0];
    if (tok.startsWith('`')) {
      nodes.push(<code key={key++} className="px-1 py-0.5 rounded bg-gray-100 text-[0.85em] font-mono text-brand-800">{tok.slice(1, -1)}</code>);
    } else if (tok.startsWith('**')) {
      nodes.push(<strong key={key++} className="font-bold text-gray-900">{renderInline(tok.slice(2, -2))}</strong>);
    } else if (tok.startsWith('*')) {
      nodes.push(<em key={key++}>{renderInline(tok.slice(1, -1))}</em>);
    } else {
      const lm = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(tok);
      if (lm) {
        nodes.push(
          <a key={key++} href={lm[2]} target="_blank" rel="noopener noreferrer" className="text-brand-700 underline decoration-brand-300 hover:decoration-brand-600">
            {renderInline(lm[1])}
          </a>
        );
      } else nodes.push(tok);
    }
    last = idx + tok.length;
  }
  if (last < text.length) nodes.push(text.slice(last));
  return nodes.length === 1 ? nodes[0] : nodes.map((n, i) => <Fragment key={i}>{n}</Fragment>);
}

// ---------------------------------------------------------------- blocks

interface ListItem { text: string; indent: number; ordered: boolean; children: ListItem[] }

function parseListItems(lines: string[]): ListItem[] {
  const roots: ListItem[] = [];
  for (const line of lines) {
    const m = /^(\s*)(?:[-*]|\d+[.)])\s+(.*)$/.exec(line);
    if (!m) {
      // continuation de l'item précédent (retour à la ligne)
      const target = roots.length ? lastDeep(roots[roots.length - 1]) : null;
      if (target) target.text += ' ' + line.trim();
      continue;
    }
    const item: ListItem = { text: m[2], indent: m[1].length, ordered: /^\s*\d/.test(line), children: [] };
    if (item.indent >= 2 && roots.length > 0) roots[roots.length - 1].children.push(item);
    else roots.push(item);
  }
  return roots;
}

function lastDeep(item: ListItem): ListItem {
  return item.children.length ? lastDeep(item.children[item.children.length - 1]) : item;
}

function ListItemBody({ text }: { text: string }) {
  const cb = /^\[( |x|X)\]\s+(.*)$/.exec(text);
  if (cb) {
    const checked = cb[1].toLowerCase() === 'x';
    return (
      <span className="inline-flex items-start gap-2">
        <span className={`mt-0.5 inline-flex w-4 h-4 shrink-0 items-center justify-center rounded border text-[10px] font-black ${checked ? 'bg-brand-500 border-brand-500 text-white' : 'border-gray-300 text-transparent'}`}>✓</span>
        <span>{renderInline(cb[2])}</span>
      </span>
    );
  }
  return <>{renderInline(text)}</>;
}

function RenderList({ items, ordered }: { items: ListItem[]; ordered: boolean }) {
  const Tag = ordered ? 'ol' : 'ul';
  return (
    <Tag className={`${ordered ? 'list-decimal' : 'list-disc'} pl-5 space-y-1.5 my-3 text-sm text-gray-700 leading-relaxed`}>
      {items.map((it, i) => (
        <li key={i} className="marker:text-brand-500 marker:font-bold">
          <ListItemBody text={it.text} />
          {it.children.length > 0 && <RenderList items={it.children} ordered={it.children[0].ordered} />}
        </li>
      ))}
    </Tag>
  );
}

function RenderTable({ lines }: { lines: string[] }) {
  const rows = lines
    .filter(l => !/^\s*\|?[\s:|-]+\|?\s*$/.test(l) || !/-/.test(l))
    .map(l => l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(c => c.trim()));
  if (rows.length === 0) return null;
  const [head, ...body] = rows;
  return (
    <div className="my-4 overflow-x-auto rounded-xl border border-gray-200">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50">
            {head.map((c, i) => (
              <th key={i} className="text-left px-3 py-2.5 font-bold text-gray-800 text-xs uppercase tracking-wide border-b border-gray-200 whitespace-nowrap">{renderInline(c)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((r, ri) => (
            <tr key={ri} className={ri % 2 ? 'bg-gray-50/50' : 'bg-white'}>
              {r.map((c, ci) => (
                <td key={ci} className="px-3 py-2 text-gray-700 border-b border-gray-100 align-top leading-relaxed">{renderInline(c)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const H_CLS: Record<number, string> = {
  1: 'text-xl sm:text-2xl font-black text-gray-900 mt-10 mb-4 pb-2 border-b-2 border-brand-100 scroll-mt-24',
  2: 'text-lg font-black text-gray-900 mt-8 mb-3 scroll-mt-24',
  3: 'text-base font-bold text-gray-900 mt-6 mb-2 scroll-mt-24',
  4: 'text-sm font-bold text-gray-800 mt-4 mb-2 scroll-mt-24',
};

/** Rend un document Markdown complet en éléments React. */
export function renderMarkdown(md: string): ReactNode {
  const lines = md.split('\n');
  const out: ReactNode[] = [];
  const seenIds = new Map<string, number>();
  let i = 0;
  let key = 0;

  while (i < lines.length) {
    const line = lines[i];

    if (line.trim() === '') { i++; continue; }

    // Bloc de code
    if (/^```/.test(line)) {
      const buf: string[] = [];
      i++;
      while (i < lines.length && !/^```/.test(lines[i])) { buf.push(lines[i]); i++; }
      i++;
      out.push(
        <pre key={key++} className="my-4 p-4 rounded-xl bg-gray-900 text-gray-100 text-xs font-mono overflow-x-auto leading-relaxed whitespace-pre-wrap">{buf.join('\n')}</pre>
      );
      continue;
    }

    // Titre
    const hm = /^(#{1,4})\s+(.*)$/.exec(line);
    if (hm) {
      const level = hm[1].length;
      const text = hm[2].replace(/\*\*?/g, '').trim();
      let id = slugify(text);
      const n = (seenIds.get(id) ?? 0) + 1;
      seenIds.set(id, n);
      if (n > 1) id = `${id}-${n}`;
      const Tag = (`h${Math.min(level + 1, 5)}`) as 'h2' | 'h3' | 'h4' | 'h5';
      out.push(<Tag key={key++} id={id} className={H_CLS[level]}>{renderInline(hm[2].trim())}</Tag>);
      i++;
      continue;
    }

    // Séparateur
    if (/^\s*(---+|\*\*\*+)\s*$/.test(line)) {
      out.push(<hr key={key++} className="my-8 border-gray-200" />);
      i++;
      continue;
    }

    // Table
    if (/^\s*\|/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*\|/.test(lines[i])) { buf.push(lines[i]); i++; }
      out.push(<RenderTable key={key++} lines={buf} />);
      continue;
    }

    // Citation
    if (/^\s*>/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && /^\s*>/.test(lines[i])) { buf.push(lines[i].replace(/^\s*>\s?/, '')); i++; }
      out.push(
        <blockquote key={key++} className="my-4 pl-4 py-2 border-l-4 border-brand-300 bg-brand-50/50 rounded-r-xl text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
          {buf.map((b, bi) => <Fragment key={bi}>{bi > 0 && '\n'}{renderInline(b)}</Fragment>)}
        </blockquote>
      );
      continue;
    }

    // Liste
    if (/^\s*(?:[-*]|\d+[.)])\s+/.test(line)) {
      const buf: string[] = [];
      while (i < lines.length && (/^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i]) || (/^\s{2,}\S/.test(lines[i]) && !/^\s*\|/.test(lines[i])))) {
        buf.push(lines[i]); i++;
      }
      const items = parseListItems(buf);
      if (items.length) out.push(<RenderList key={key++} items={items} ordered={items[0].ordered} />);
      continue;
    }

    // Paragraphe
    {
      const buf: string[] = [];
      while (
        i < lines.length && lines[i].trim() !== '' &&
        !/^(#{1,4})\s/.test(lines[i]) && !/^\s*\|/.test(lines[i]) &&
        !/^\s*>/.test(lines[i]) && !/^```/.test(lines[i]) &&
        !/^\s*(?:[-*]|\d+[.)])\s+/.test(lines[i]) && !/^\s*(---+|\*\*\*+)\s*$/.test(lines[i])
      ) { buf.push(lines[i].trim()); i++; }
      out.push(<p key={key++} className="my-3 text-sm text-gray-700 leading-relaxed">{renderInline(buf.join(' '))}</p>);
    }
  }

  return <>{out}</>;
}
