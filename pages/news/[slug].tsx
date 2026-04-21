import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '../../components/Layout';
import { api } from '../../lib/api';
import type { NewsPost } from '../../lib/types';

export default function PostPage() {
  const router = useRouter();
  const { slug } = router.query;
  const [post, setPost] = useState<NewsPost | null | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || typeof slug !== 'string') return;
    api.post(slug).then(setPost).catch(e => setError(e.message));
  }, [slug]);

  if (post === undefined && !error) {
    return (
      <Layout title="Loading">
        <div className="container-p py-20 flex items-center justify-center gap-2 text-fg-muted">
          <Loader2 size={16} className="animate-spin" /> Loading…
        </div>
      </Layout>
    );
  }

  if (error || post === null) {
    return (
      <Layout title="Not found">
        <div className="container-p py-20 text-center">
          <h1 className="font-display text-3xl">Post not found</h1>
          <Link href="/news" className="btn-ghost mt-6 justify-center">
            <ArrowLeft size={14} /> Back to news
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={post!.title} description={post!.excerpt}>
      <article className="container-p py-10 sm:py-14">
        <Link
          href="/news"
          className="inline-flex items-center gap-1 text-xs uppercase
                     tracking-widest text-fg-muted hover:text-brand-gold"
        >
          <ArrowLeft size={12} /> All news
        </Link>
        <header className="mt-4 max-w-3xl">
          <div className="text-[10px] uppercase tracking-widest text-brand-gold">
            {format(new Date(post!.published_at), 'd MMMM yyyy')}
          </div>
          <h1 className="mt-2 font-display text-3xl sm:text-5xl">{post!.title}</h1>
        </header>

        <hr className="gold" />

        <div
          className="prose prose-invert max-w-3xl
                     prose-headings:font-display prose-a:text-brand-gold"
          dangerouslySetInnerHTML={{ __html: markdownToHtml(post!.body_md) }}
        />
      </article>
    </Layout>
  );
}

/**
 * Минимальная md→html конверсия без тяжёлых зависимостей:
 * заголовки, параграфы, ссылки, bold/italic. Для полноценного рендера
 * постов админка может сохранять HTML напрямую.
 */
function markdownToHtml(md: string): string {
  if (!md) return '';
  return md
    .replace(/^### (.*)$/gim, '<h3>$1</h3>')
    .replace(/^## (.*)$/gim, '<h2>$1</h2>')
    .replace(/^# (.*)$/gim, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2">$1</a>')
    .split(/\n{2,}/)
    .map(block => /^<h[1-3]>/.test(block) ? block : `<p>${block.replace(/\n/g, '<br/>')}</p>`)
    .join('\n');
}
