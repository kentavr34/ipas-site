/**
 * Простая админка IPAS. Логин по ADMIN_TOKEN (Script Properties в Apps Script).
 * Токен хранится в localStorage. Всё общается через Apps Script Web App.
 *
 * Вкладки:
 *   - Certificates: поиск, создание, правка, отзыв, повтор письма
 *   - News posts:   создание/правка/удаление
 *   - Events:       создание/правка/удаление (+ расписание IPI-скрапера)
 */
import { useEffect, useMemo, useState } from 'react';
import { Layout } from '../components/Layout';
import { api } from '../lib/api';
import type { Certificate, NewsPost, IpasEvent } from '../lib/types';
import {
  Search, Plus, Save, Trash2, RefreshCcw, LogOut,
  Mail, ShieldAlert, FileText, CalendarDays, GraduationCap,
} from 'lucide-react';

type Tab = 'certs' | 'posts' | 'events';
const TOKEN_KEY = 'ipas_admin_token';

export default function Admin() {
  const [token, setToken] = useState<string>('');
  const [authed, setAuthed] = useState(false);
  const [tab, setTab] = useState<Tab>('certs');

  useEffect(() => {
    const saved = typeof window !== 'undefined'
      ? localStorage.getItem(TOKEN_KEY) || '' : '';
    if (saved) { setToken(saved); setAuthed(true); }
  }, []);

  const login = () => {
    if (!token.trim()) return;
    localStorage.setItem(TOKEN_KEY, token.trim());
    setAuthed(true);
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(''); setAuthed(false);
  };

  return (
    <Layout title="Admin" description="IPAS administration">
      <div className="container-p py-10 sm:py-14">
        {!authed ? (
          <div className="mx-auto max-w-md rounded-xl border border-brand-gold/30
                          bg-surface-muted p-6">
            <h1 className="font-display text-2xl">Admin login</h1>
            <p className="mt-2 text-sm text-fg-muted">
              Paste the ADMIN_TOKEN from Google Apps Script → Project Settings →
              Script Properties.
            </p>
            <input
              type="password"
              value={token}
              onChange={e => setToken(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="ADMIN_TOKEN"
              className="input mt-4"
            />
            <button
              onClick={login}
              className="btn-primary mt-3 w-full justify-center"
            >
              Sign in
            </button>
          </div>
        ) : (
          <>
            <header className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-widest text-brand-gold">
                  Administration
                </div>
                <h1 className="mt-1 font-display text-3xl sm:text-4xl">
                  IPAS Admin
                </h1>
              </div>
              <button onClick={logout} className="btn-ghost">
                <LogOut size={14} /> Sign out
              </button>
            </header>

            <nav className="mt-6 flex gap-2 border-b border-brand-gold/20">
              {([
                ['certs',  'Certificates', GraduationCap],
                ['posts',  'News',         FileText],
                ['events', 'Events',       CalendarDays],
              ] as [Tab, string, any][]).map(([key, label, Icon]) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={
                    'flex items-center gap-2 px-4 py-2 text-sm transition -mb-px border-b-2 ' +
                    (tab === key
                      ? 'border-brand-gold text-brand-gold'
                      : 'border-transparent text-fg-muted hover:text-fg')
                  }
                >
                  <Icon size={14} /> {label}
                </button>
              ))}
            </nav>

            <div className="mt-6">
              {tab === 'certs'  && <CertsPanel  token={token} />}
              {tab === 'posts'  && <PostsPanel  token={token} />}
              {tab === 'events' && <EventsPanel token={token} />}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}

// ─── Certificates ───────────────────────────────────────────────────

function CertsPanel({ token }: { token: string }) {
  const [q, setQ] = useState('');
  const [rows, setRows] = useState<Certificate[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [draft, setDraft] = useState<Partial<Certificate> | null>(null);
  const [sendEmail, setSendEmail] = useState(true);

  const doSearch = async () => {
    setBusy(true); setErr('');
    try { setRows(await api.searchCerts(q || 'a')); }
    catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  useEffect(() => { doSearch(); /* eslint-disable-next-line */ }, []);

  const save = async () => {
    if (!draft) return;
    setBusy(true); setErr('');
    try {
      if (draft.id && rows.find(r => String(r.id) === String(draft.id))) {
        await api.updateCert(draft, token);
      } else {
        await api.createCert(draft, sendEmail, token);
      }
      setDraft(null);
      await doSearch();
    } catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  const revoke = async (id: string | number) => {
    const reason = prompt('Revoke reason?') || '';
    setBusy(true);
    try { await api.revokeCert(String(id), reason, token); await doSearch(); }
    catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  const resend = async (id: string | number) => {
    setBusy(true);
    try { await api.resendCert(String(id), token); alert('Email sent'); }
    catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  return (
    <section>
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded-md border
                        border-brand-gold/30 bg-surface px-3">
          <Search size={14} className="text-brand-gold" />
          <input
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && doSearch()}
            placeholder="Search by ID or name…"
            className="h-10 flex-1 bg-transparent outline-none"
          />
        </div>
        <button onClick={doSearch} className="btn-ghost" disabled={busy}>
          <RefreshCcw size={14} /> Refresh
        </button>
        <button
          onClick={() => setDraft({
            id: '', full_name: '', first_name: '', last_name: '',
            email: '', program: '', module: '', hours: 0,
            issue_date: new Date().toISOString().slice(0, 10),
            status: 'valid',
          } as any)}
          className="btn-primary"
        >
          <Plus size={14} /> New
        </button>
      </div>

      {err && (
        <p className="mt-3 rounded-md border border-red-500/40 bg-red-500/10 p-2 text-sm text-red-400">
          {err}
        </p>
      )}

      <div className="mt-4 overflow-x-auto rounded-lg border border-brand-gold/20">
        <table className="w-full text-sm">
          <thead className="bg-surface-muted text-[10px] uppercase tracking-widest text-fg-muted">
            <tr>
              <Th>ID</Th><Th>Name</Th><Th>Program</Th>
              <Th>Issued</Th><Th>Status</Th><Th>Email</Th><Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r => (
              <tr key={String(r.id)} className="border-t border-brand-gold/10">
                <Td className="font-mono text-xs">{String(r.display_id || r.id)}</Td>
                <Td>{r.full_name}</Td>
                <Td className="max-w-[220px] truncate">{r.program}</Td>
                <Td>{r.issue_date ? String(r.issue_date).slice(0,10) : '—'}</Td>
                <Td>
                  <span className={
                    'rounded-full px-2 py-0.5 text-[10px] uppercase tracking-widest ' +
                    (String(r.status).toLowerCase() === 'valid'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-red-500/15 text-red-400')
                  }>{r.status || '—'}</span>
                </Td>
                <Td className="text-xs text-fg-muted">{r.email || '—'}</Td>
                <Td className="space-x-1 whitespace-nowrap text-right">
                  <button onClick={() => setDraft(r)} className="btn-ghost !px-2 !py-1">
                    Edit
                  </button>
                  {r.email && (
                    <button onClick={() => resend(r.id)} className="btn-ghost !px-2 !py-1">
                      <Mail size={12} />
                    </button>
                  )}
                  <button onClick={() => revoke(r.id)} className="btn-ghost !px-2 !py-1 text-red-400">
                    <ShieldAlert size={12} />
                  </button>
                </Td>
              </tr>
            ))}
            {!rows.length && (
              <tr><td colSpan={7} className="p-4 text-center text-fg-muted">
                {busy ? 'Loading…' : 'No results'}
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {draft && (
        <Modal title={draft.id ? `Edit ${draft.id}` : 'New certificate'}
               onClose={() => setDraft(null)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="ID" value={String(draft.id ?? '')}
                   onChange={v => setDraft({ ...draft, id: v })} />
            <Field label="Full name" value={draft.full_name || ''}
                   onChange={v => setDraft({ ...draft, full_name: v })} />
            <Field label="First name" value={draft.first_name || ''}
                   onChange={v => setDraft({ ...draft, first_name: v })} />
            <Field label="Last name" value={draft.last_name || ''}
                   onChange={v => setDraft({ ...draft, last_name: v })} />
            <Field label="Email" value={draft.email || ''}
                   onChange={v => setDraft({ ...draft, email: v })} />
            <Field label="Program" value={draft.program || ''}
                   onChange={v => setDraft({ ...draft, program: v })} />
            <Field label="Module" value={draft.module || ''}
                   onChange={v => setDraft({ ...draft, module: v })} />
            <Field label="Hours" type="number" value={String(draft.hours ?? '')}
                   onChange={v => setDraft({ ...draft, hours: Number(v) })} />
            <Field label="Issue date" type="date"
                   value={String(draft.issue_date || '').slice(0,10)}
                   onChange={v => setDraft({ ...draft, issue_date: v })} />
            <Field label="Status" value={draft.status || 'valid'}
                   onChange={v => setDraft({ ...draft, status: v as any })} />
          </div>
          {!rows.find(r => String(r.id) === String(draft.id)) && (
            <label className="mt-3 flex items-center gap-2 text-sm">
              <input type="checkbox" checked={sendEmail}
                     onChange={e => setSendEmail(e.target.checked)} />
              Send certificate PDF by email on create
            </label>
          )}
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setDraft(null)} className="btn-ghost">Cancel</button>
            <button onClick={save} className="btn-primary" disabled={busy}>
              <Save size={14} /> Save
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

// ─── News posts ─────────────────────────────────────────────────────

function PostsPanel({ token }: { token: string }) {
  const [rows, setRows] = useState<NewsPost[]>([]);
  const [draft, setDraft] = useState<Partial<NewsPost> | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    setBusy(true); setErr('');
    try { setRows(await api.posts()); }
    catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft) return;
    setBusy(true); setErr('');
    try { await api.upsertPost(draft, token); setDraft(null); await load(); }
    catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete this post?')) return;
    setBusy(true);
    try { await api.deletePost(id, token); await load(); }
    catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  return (
    <section>
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setDraft({
          slug: '', title: '', excerpt: '', content: '',
          category: 'News', published: false,
          published_at: new Date().toISOString(),
        } as any)}>
          <Plus size={14} /> New post
        </button>
      </div>
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

      <div className="mt-4 grid gap-2">
        {rows.map(p => (
          <div key={p.slug} className="flex items-center justify-between
                                      rounded-lg border border-brand-gold/20 p-3">
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{p.title}</div>
              <div className="truncate text-xs text-fg-muted">
                /{p.slug} · {p.category} · {p.published ? 'published' : 'draft'}
              </div>
            </div>
            <div className="space-x-1">
              <button className="btn-ghost !px-2 !py-1" onClick={() => setDraft(p)}>Edit</button>
              <button className="btn-ghost !px-2 !py-1 text-red-400" onClick={() => del(p.id || p.slug)}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
        {!rows.length && (
          <div className="p-4 text-center text-fg-muted">{busy ? 'Loading…' : 'No posts yet'}</div>
        )}
      </div>

      {draft && (
        <Modal title={draft.id ? 'Edit post' : 'New post'} onClose={() => setDraft(null)}>
          <div className="grid gap-3">
            <Field label="Slug" value={draft.slug || ''}
                   onChange={v => setDraft({ ...draft, slug: v })} />
            <Field label="Title" value={draft.title || ''}
                   onChange={v => setDraft({ ...draft, title: v })} />
            <Field label="Category" value={draft.category || 'News'}
                   onChange={v => setDraft({ ...draft, category: v })} />
            <Field label="Excerpt" value={draft.excerpt || ''}
                   onChange={v => setDraft({ ...draft, excerpt: v })} />
            <label className="text-xs uppercase tracking-widest text-fg-muted">
              Content (HTML/MD)
              <textarea
                rows={8}
                value={draft.content || ''}
                onChange={e => setDraft({ ...draft, content: e.target.value })}
                className="input mt-1 font-mono text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox"
                     checked={!!draft.published}
                     onChange={e => setDraft({ ...draft, published: e.target.checked })} />
              Published
            </label>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setDraft(null)} className="btn-ghost">Cancel</button>
            <button onClick={save} className="btn-primary" disabled={busy}>
              <Save size={14} /> Save
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

// ─── Events ─────────────────────────────────────────────────────────

function EventsPanel({ token }: { token: string }) {
  const [rows, setRows] = useState<IpasEvent[]>([]);
  const [draft, setDraft] = useState<Partial<IpasEvent> | null>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  const load = async () => {
    setBusy(true); setErr('');
    try { setRows(await api.events()); }
    catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!draft) return;
    setBusy(true); setErr('');
    try {
      // upsertEvent не экспортирован в api.ts — используем fetch напрямую
      const res = await fetch(process.env.NEXT_PUBLIC_API_URL || '', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'upsertEvent', token, event: draft }),
      });
      const body = await res.json();
      if (!body.ok) throw new Error(body.error || 'API error');
      setDraft(null); await load();
    } catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  const del = async (id: string) => {
    if (!confirm('Delete event?')) return;
    setBusy(true);
    try {
      await fetch(process.env.NEXT_PUBLIC_API_URL || '', {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'deleteEvent', token, id }),
      });
      await load();
    } catch (e: any) { setErr(String(e.message || e)); }
    finally { setBusy(false); }
  };

  return (
    <section>
      <div className="flex justify-end">
        <button className="btn-primary" onClick={() => setDraft({
          title: '', description: '', starts_at: '', ends_at: '',
          location: '', url: '', price: '',
        } as any)}>
          <Plus size={14} /> New event
        </button>
      </div>
      {err && <p className="mt-3 text-sm text-red-400">{err}</p>}

      <div className="mt-4 grid gap-2">
        {rows.map(e => (
          <div key={String(e.id)} className="flex items-center justify-between
                                            rounded-lg border border-brand-gold/20 p-3">
            <div className="min-w-0 flex-1">
              <div className="truncate font-medium">{e.title}</div>
              <div className="truncate text-xs text-fg-muted">
                {String(e.starts_at).slice(0,16)} · {e.location || '—'}
              </div>
            </div>
            <div className="space-x-1">
              <button className="btn-ghost !px-2 !py-1" onClick={() => setDraft(e)}>Edit</button>
              <button className="btn-ghost !px-2 !py-1 text-red-400" onClick={() => del(String(e.id))}>
                <Trash2 size={12} />
              </button>
            </div>
          </div>
        ))}
        {!rows.length && (
          <div className="p-4 text-center text-fg-muted">{busy ? 'Loading…' : 'No upcoming events'}</div>
        )}
      </div>

      {draft && (
        <Modal title={draft.id ? 'Edit event' : 'New event'} onClose={() => setDraft(null)}>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Title" value={draft.title || ''}
                   onChange={v => setDraft({ ...draft, title: v })} />
            <Field label="Location" value={draft.location || ''}
                   onChange={v => setDraft({ ...draft, location: v })} />
            <Field label="Starts at" type="datetime-local"
                   value={String(draft.starts_at || '').slice(0,16)}
                   onChange={v => setDraft({ ...draft, starts_at: v })} />
            <Field label="Ends at" type="datetime-local"
                   value={String(draft.ends_at || '').slice(0,16)}
                   onChange={v => setDraft({ ...draft, ends_at: v })} />
            <Field label="URL" value={draft.url || ''}
                   onChange={v => setDraft({ ...draft, url: v })} />
            <Field label="Price" value={draft.price || ''}
                   onChange={v => setDraft({ ...draft, price: v })} />
          </div>
          <label className="mt-3 block text-xs uppercase tracking-widest text-fg-muted">
            Description
            <textarea rows={4}
                      value={draft.description || ''}
                      onChange={e => setDraft({ ...draft, description: e.target.value })}
                      className="input mt-1" />
          </label>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setDraft(null)} className="btn-ghost">Cancel</button>
            <button onClick={save} className="btn-primary" disabled={busy}>
              <Save size={14} /> Save
            </button>
          </div>
        </Modal>
      )}
    </section>
  );
}

// ─── Shared UI bits ────────────────────────────────────────────────

function Th({ children, className = '' }: any) {
  return <th className={'px-3 py-2 text-left font-normal ' + className}>{children}</th>;
}
function Td({ children, className = '' }: any) {
  return <td className={'px-3 py-2 align-middle ' + className}>{children}</td>;
}
function Field({
  label, value, onChange, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string;
}) {
  return (
    <label className="block text-xs uppercase tracking-widest text-fg-muted">
      {label}
      <input type={type} value={value}
             onChange={e => onChange(e.target.value)}
             className="input mt-1" />
    </label>
  );
}
function Modal({
  title, children, onClose,
}: {
  title: string; children: React.ReactNode; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center
                    overflow-y-auto bg-black/60 p-4 sm:items-center">
      <div className="w-full max-w-2xl rounded-xl border border-brand-gold/30
                      bg-surface p-5 shadow-glow">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl">{title}</h2>
          <button onClick={onClose} className="btn-ghost !px-2 !py-1">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
