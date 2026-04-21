# IPAS — International Psychotherapy Association
### Website powered by Next.js + Supabase + GitHub Pages

---

## 🚀 Quick Setup (30 minutes)

### Step 1 — Create GitHub Repository

1. Go to https://github.com/new
2. Name it `ipas-site`
3. Set to **Public**
4. Upload all these files (drag & drop the folder)

---

### Step 2 — Create Supabase Database (free)

1. Go to https://app.supabase.com → **New Project**
2. Name: `ipas` | Region: nearest to you
3. Once created → **SQL Editor** → paste content of `data/supabase-setup.sql` → **Run**
4. Copy your credentials:
   - **Project URL**: Settings → API → Project URL
   - **Anon Key**: Settings → API → Project API Keys → `anon public`

---

### Step 3 — Add GitHub Secrets

In your GitHub repo → **Settings → Secrets and variables → Actions → New repository secret**:

| Secret Name | Value |
|------------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `ADMIN_PASSWORD` | Choose a password for /admin |
| `RESEND_API_KEY` | From https://resend.com (free tier: 100 emails/day) |

---

### Step 4 — Enable GitHub Pages

1. GitHub repo → **Settings → Pages**
2. Source: **GitHub Actions**
3. Push any change to `main` branch → site builds automatically

---

### Step 5 — Connect your domain intpas.com

In your domain DNS provider (wherever intpas.com is registered):

**Option A — Apex domain (intpas.com):**
```
Type    Name    Value
A       @       185.199.108.153
A       @       185.199.109.153
A       @       185.199.110.153
A       @       185.199.111.153
```

**Option B — www subdomain:**
```
Type    Name    Value
CNAME   www     YOUR-USERNAME.github.io
```

Then in GitHub repo → Settings → Pages → **Custom domain** → enter `intpas.com`

---

### Step 6 — Import existing certificates

Run the scraper to collect all old certificate IDs:
```bash
node scripts/scrape-cert-ids.js
```

Then import `data/certificates-seed.sql` into Supabase SQL editor.

**OR** import a CSV file directly:
- Supabase → Table Editor → `certificates` → **Import data from CSV**

---

## 📁 Project Structure

```
ipas-site/
├── pages/
│   ├── index.tsx          # Homepage
│   ├── [certId].tsx       # ALL certificate pages (old URLs preserved)
│   ├── verify.tsx         # Certificate verification
│   ├── about.tsx          # About IPAS
│   ├── admin/
│   │   └── index.tsx      # Admin panel (/admin)
│   └── api/
│       ├── certificate-pdf.ts    # PDF generation
│       └── send-certificate.ts  # Email with PDF attachment
├── components/
│   ├── Nav.tsx
│   └── CertificateVisual.tsx
├── lib/
│   ├── supabase.ts        # Database client
│   └── generatePDF.ts     # PDF generator
├── data/
│   ├── supabase-setup.sql # Run once in Supabase
│   └── certificates-export.csv  # Your migrated data
├── scripts/
│   └── scrape-cert-ids.js # Migration tool
└── .github/
    └── workflows/
        └── deploy.yml     # Auto-deploy on push to main
```

---

## 🔐 Admin Panel

Access at: `https://intpas.com/admin`

Features:
- ✅ Create new certificate (form → auto-generates ID)
- ✅ Live preview as you type
- ✅ Generate & save to database
- ✅ Auto-send PDF email to student
- ✅ Search all certificates
- ✅ Download PDF for any certificate
- ✅ Re-send email to any student

---

## 🔗 Certificate URLs

All old Wix URLs are automatically preserved:
- `intpas.com/032523122` → shows Fatima Dadashsoy's certificate
- `intpas.com/13iu21e3az0028` → shows Vusala Abdullayeva's certificate
- Any new ID added via Admin → immediately accessible via URL

QR codes on printed certificates still work as-is. No changes needed.

---

## 📧 Email Setup (Resend)

1. Sign up at https://resend.com (free: 100 emails/day, 3000/month)
2. Add your domain `intpas.com` in Resend → Domains
3. Copy API key → add as `RESEND_API_KEY` in GitHub Secrets
4. Update `from` address in `pages/api/send-certificate.ts` if needed

---

## 🆘 Troubleshooting

**Certificate page shows "not found"**
→ Check that the ID exists in Supabase → Table Editor → certificates

**Build fails in GitHub Actions**
→ Check that all 4 secrets are set correctly in GitHub Settings

**PDF doesn't download**
→ The API routes need a Node.js server — for GitHub Pages (static), PDF is generated client-side
→ For full API support, deploy to Vercel (free) instead of GitHub Pages

**Admin login fails**
→ Default password: `ipas2024admin` (change via ADMIN_PASSWORD secret)
