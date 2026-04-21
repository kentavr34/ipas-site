import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { Layout } from '../../components/Layout';
import { api } from '../../lib/api';
import type { NewsPost } from '../../lib/types';

export default function NewsList() {
  const [posts, setPosts] = useState<NewsPost[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.posts().then(setPosts).catch(e => setError(e.message));
  }, []);

  return (
    <Layout
      title="News"
      description="Announcements and publications from the International Psychotherapy Association."
    >
      <div className="container-p py-10 sm:py-14">
        <div className="max-w-2xl">
          <div className="text-xs uppercase tracking-widest text-brand-gold">
            Blog
          </div>
          <h1 className="mt-2 font-display text-4xl sm:text-5xl">News & publications</h1>
          <p className="mt-3 text-fg-muted">
            Announcements, articles and reflections from IPAS faculty and
            community members.
          </p>
        </div>

        <div className="mt-10 space-y-4">
          {posts === null && !error && (
            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <Loader2 size={16} className="animate-spin" /> Loading posts…
            </div>
          )}
          {error && <p className="text-sm text-red-400">{error}</p>}
          {posts && posts.length === 0 && (
            <p className="text-fg-muted">No posts published yet.</p>
          )}
          {posts?.map(p => (
            <Link
              key={p.id}
              href={`/news/${p.slug}`}
              className="card group block"
            >
              <div className="text-[10px] uppercase tracking-widest text-brand-gold">
                {p.published_at && format(new Date(p.published_at), 'd MMMM yyyy')}
              </div>
              <h2 className="mt-2 font-display text-2xl group-hover:text-brand-gold">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-fg-muted">{p.excerpt}</p>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
}
