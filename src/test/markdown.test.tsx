// @vitest-environment node
import { describe, it, expect } from 'vitest';
import { renderToStaticMarkup } from 'react-dom/server';
import { renderMarkdown, extractHeadings, slugify } from '../lib/markdown';

const html = (md: string) => renderToStaticMarkup(<>{renderMarkdown(md)}</>);

describe('slugify', () => {
  it('normalise les accents et la ponctuation', () => {
    expect(slugify('Stratégie & Croissance — v1.0')).toBe('strategie-croissance-v10');
  });
  it('tronque à 80 caractères', () => {
    expect(slugify('a'.repeat(200)).length).toBeLessThanOrEqual(80);
  });
});

describe('extractHeadings', () => {
  const md = '# Un\n## Deux\n### Trois\n```\n# pas un titre\n```\n# Un';
  it('extrait h1/h2 et ignore les blocs de code', () => {
    const hs = extractHeadings(md, 2);
    expect(hs.map(h => h.text)).toEqual(['Un', 'Deux', 'Un']);
  });
  it('dédoublonne les ids', () => {
    const hs = extractHeadings(md, 2);
    expect(hs[0].id).toBe('un');
    expect(hs[2].id).toBe('un-2');
  });
  it('respecte maxLevel', () => {
    expect(extractHeadings(md, 3).map(h => h.text)).toContain('Trois');
    expect(extractHeadings(md, 2).map(h => h.text)).not.toContain('Trois');
  });
});

describe('renderMarkdown — blocs', () => {
  it('rend les titres avec ancres', () => {
    const out = html('# Executive Summary');
    expect(out).toContain('id="executive-summary"');
    expect(out).toContain('Executive Summary');
  });

  it('rend une table avec en-tête et corps', () => {
    const out = html('| Col A | Col B |\n|---|---|\n| a1 | b1 |\n| a2 | b2 |');
    expect(out).toContain('<table');
    expect(out).toContain('<th');
    expect(out).toContain('Col A');
    expect(out).toContain('a2');
    // la ligne de séparation ne doit pas devenir une ligne de données
    expect(out).not.toContain('---');
  });

  it('rend les listes à puces et numérotées', () => {
    const ul = html('- premier\n- second');
    expect(ul).toContain('<ul');
    expect(ul).toContain('premier');
    const ol = html('1. un\n2. deux');
    expect(ol).toContain('<ol');
    expect(ol).toContain('deux');
  });

  it('rend les listes imbriquées', () => {
    const out = html('- parent\n  - enfant');
    expect(out.match(/<ul/g)?.length).toBe(2);
    expect(out).toContain('enfant');
  });

  it('rend les cases à cocher', () => {
    const out = html('- [x] fait\n- [ ] à faire');
    expect(out).toContain('fait');
    expect(out).toContain('à faire');
    expect(out).toContain('✓');
  });

  it('rend les citations multi-lignes', () => {
    const out = html('> ligne 1\n> ligne 2');
    expect(out).toContain('<blockquote');
    expect(out).toContain('ligne 2');
  });

  it('rend les blocs de code sans interpréter le contenu', () => {
    const out = html('```\n**pas gras** | pas table\n```');
    expect(out).toContain('<pre');
    expect(out).toContain('**pas gras**');
    expect(out).not.toContain('<table');
  });

  it('rend les séparateurs', () => {
    expect(html('---')).toContain('<hr');
  });
});

describe('renderMarkdown — inline', () => {
  it('rend gras, italique et code inline', () => {
    const out = html('Du **gras**, de l\u2019*italique* et du `code`.');
    expect(out).toContain('<strong');
    expect(out).toContain('<em>');
    expect(out).toContain('<code');
  });

  it('rend les liens avec target _blank', () => {
    const out = html('Voir [Agence Bio](https://www.agencebio.org).');
    expect(out).toContain('href="https://www.agencebio.org"');
    expect(out).toContain('target="_blank"');
    expect(out).toContain('rel="noopener noreferrer"');
  });

  it('laisse le texte brut intact (pas d\u2019injection HTML)', () => {
    const out = html('a < b et c > d');
    expect(out).toContain('a &lt; b');
  });
});

describe('renderMarkdown — robustesse sur les vrais documents', () => {
  it('rend un extrait représentatif du plan stratégique sans erreur', () => {
    const md = [
      '# 1. EXECUTIVE SUMMARY',
      '',
      '**Décision centrale** : B2B d\u2019abord, Nantes comme laboratoire.',
      '',
      '| Orientation | Verdict | Décision |',
      '|---|---|---|',
      '| « Paris d\u2019abord » | ❌ REJETÉ | Nantes/Grand Ouest (§5.1) |',
      '',
      '1. **Le problème réel** : cacao ×3, café +70 %.',
      '2. **Notre réponse** : vérification aux registres.',
      '',
      '---',
      '',
      '## 2.1 Actifs',
      '- Plateforme complète : 590 tests.',
      '  - Sous-point imbriqué.',
    ].join('\n');
    const out = html(md);
    expect(out).toContain('EXECUTIVE SUMMARY');
    expect(out).toContain('REJETÉ');
    expect(out).toContain('590 tests');
    expect(out).toContain('Sous-point imbriqué');
  });

  it('rend un document vide sans planter', () => {
    expect(() => html('')).not.toThrow();
    expect(() => html('\n\n\n')).not.toThrow();
  });
});
