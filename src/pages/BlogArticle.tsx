// =============================================================
// EthiMarket — Page de lecture d'un article de blog
// (les cartes du blog pointaient vers href="#" — audit n°5)
// Rendu markdown léger sans dépendance externe.
// =============================================================

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Loader2 } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SEOHead from '../components/SEOHead';
import { supabase } from '../lib/supabase';

interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string | null;
  image_url: string | null;
  author_name: string | null;
  author_avatar: string | null;
  published_at: string | null;
  read_time: string | null;
  content: string | null;
}

/** Rendu markdown minimal : ## titres, **gras**, listes -, paragraphes. */
function renderContent(content: string): React.ReactNode[] {
  const blocks = content.split(/\n\n+/);
  return blocks.map((block, i) => {
    const trimmed = block.trim();
    if (trimmed.startsWith('## ')) {
      return <h2 key={i} className="text-xl font-black text-gray-900 mt-8 mb-3">{inline(trimmed.slice(3))}</h2>;
    }
    if (/^[-•]\s/m.test(trimmed)) {
      const items = trimmed.split('\n').filter(l => /^[-•]\s/.test(l.trim()));
      return (
        <ul key={i} className="list-disc pl-6 space-y-1.5 my-4 text-gray-700 leading-relaxed">
          {items.map((it, j) => <li key={j}>{inline(it.replace(/^[-•]\s/, ''))}</li>)}
        </ul>
      );
    }
    if (/^\*\*\d+\./.test(trimmed) || /^\*\*[^*]+\*\*$/.test(trimmed.split('\n')[0])) {
      // bloc commençant par un intertitre gras
      return <p key={i} className="text-gray-700 leading-relaxed my-4">{inline(trimmed)}</p>;
    }
    return <p key={i} className="text-gray-700 leading-relaxed my-4">{inline(trimmed)}</p>;
  });
}

/** Gras **texte** inline. */
function inline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**')
      ? <strong key={i} className="font-bold text-gray-900">{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>,
  );
}

export default function BlogArticle() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [related, setRelated] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    supabase.from('articles').select('*').eq('slug', slug).maybeSingle()
      .then(async ({ data }) => {
        setArticle(data as Article | null);
        if (data) {
          const { data: rel } = await supabase.from('articles')
            .select('*').eq('category', (data as Article).category)
            .neq('slug', slug).limit(2);
          setRelated((rel ?? []) as Article[]);
        }
        setLoading(false);
        window.scrollTo({ top: 0 });
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin text-brand-500" /></div>
        <Footer />
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center px-4 py-24 text-center">
          <h1 className="text-2xl font-black text-gray-900 mb-3">Article introuvable</h1>
          <Link to="/blog" className="text-sm font-bold text-brand-700 hover:underline">← Retour au magazine</Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SEOHead title={article.title} description={article.excerpt ?? article.title} />
      <Header />
      <main className="flex-1 pt-28 pb-20">
        <article className="max-w-3xl mx-auto px-4 sm:px-6">
          <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-500 hover:text-brand-700 mb-6">
            <ArrowLeft className="w-4 h-4" /> Magazine
          </Link>

          {article.category && (
            <span className="inline-block text-[11px] font-black uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200 rounded-full px-3 py-1 mb-4">
              {article.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 leading-tight">{article.title}</h1>

          <div className="flex items-center gap-3 mt-5 text-sm text-gray-500">
            {article.author_avatar
              ? <img src={article.author_avatar} alt="" className="w-9 h-9 rounded-full object-cover" />
              : <span className="w-9 h-9 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center font-black text-xs">{(article.author_name ?? 'E').slice(0, 1)}</span>}
            <div>
              <p className="font-bold text-gray-800">{article.author_name ?? 'Rédaction EthiMarket'}</p>
              <p className="text-xs flex items-center gap-2">
                {article.published_at && new Date(article.published_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                {article.read_time && <><span>·</span><Clock className="w-3 h-3" /> {article.read_time}</>}
              </p>
            </div>
          </div>

          {article.image_url && (
            <div className="rounded-2xl overflow-hidden my-8 border border-gray-100">
              <img src={article.image_url} alt={article.title} className="w-full h-72 object-cover" loading="lazy" />
            </div>
          )}

          {article.excerpt && <p className="text-lg text-gray-600 leading-relaxed font-medium border-l-4 border-brand-300 pl-4 my-6">{article.excerpt}</p>}

          <div className="prose-sm">
            {article.content ? renderContent(article.content) : <p className="text-gray-500 italic">Contenu à venir.</p>}
          </div>

          {/* Articles liés */}
          {related.length > 0 && (
            <div className="mt-14 pt-8 border-t border-gray-100">
              <h2 className="text-lg font-black text-gray-900 mb-4">À lire aussi</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {related.map(r => (
                  <Link key={r.id} to={`/blog/${r.slug}`}
                    className="rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                    <span className="text-[10px] font-black uppercase text-brand-600">{r.category}</span>
                    <h3 className="font-bold text-gray-900 text-sm mt-1 leading-snug">{r.title}</h3>
                    <p className="text-xs text-gray-500 mt-2 line-clamp-2">{r.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
