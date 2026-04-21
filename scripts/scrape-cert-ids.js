#!/usr/bin/env node
/**
 * IPAS Certificate ID Scraper
 * 
 * Usage:
 *   node scripts/scrape-cert-ids.js
 * 
 * What it does:
 *   1. Uses Google search to find all indexed pages of intpas.com
 *   2. Extracts certificate IDs from URLs
 *   3. Fetches each page to get the certificate holder's name
 *   4. Outputs a CSV file ready to import into Supabase
 * 
 * Run ONCE to migrate all old certificate data.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// ---------------------------------------------------------------
// Known IDs from manual research (add more as you find them)
// ---------------------------------------------------------------
const KNOWN_IDS = [
  '032523122',
  '032513577',
  '13iu21e3az0028',
  '032523120',
  // Add more IDs here — you can find them by looking at your
  // old QR codes, email logs, or Wix admin export
];

async function fetchPage(url) {
  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; IPAS-migration/1.0)',
      },
      timeout: 10000,
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    });
    req.on('error', () => resolve(''));
    req.on('timeout', () => { req.destroy(); resolve(''); });
  });
}

function extractName(html) {
  // Try common patterns from Wix certificate pages
  const patterns = [
    /<h1[^>]*>([^<]+)<\/h1>/i,
    /<h2[^>]*>([^<]+)<\/h2>/i,
    /class="[^"]*cert[^"]*name[^"]*"[^>]*>([^<]+)</i,
    /"full_name"\s*:\s*"([^"]+)"/i,
  ];
  for (const pat of patterns) {
    const m = html.match(pat);
    if (m && m[1] && m[1].length > 2 && m[1].length < 80) {
      return m[1].trim();
    }
  }
  return '';
}

async function processCertId(id) {
  const url = `https://www.intpas.com/${id}`;
  console.log(`Fetching: ${url}`);
  
  const html = await fetchPage(url);
  
  if (!html || html.includes('404')) {
    return { id, found: false };
  }

  const name = extractName(html);
  
  // Try to extract date
  const dateMatch = html.match(/(\d{1,2}[\s\/\-]\w+[\s\/\-]\d{4}|\w+\s+\d{1,2},?\s+\d{4})/);
  const dateStr = dateMatch ? dateMatch[1] : '';

  return {
    id,
    found: true,
    name,
    dateStr,
    url,
  };
}

async function main() {
  console.log('=== IPAS Certificate ID Scraper ===');
  console.log(`Processing ${KNOWN_IDS.length} known IDs...\n`);

  const results = [];
  
  for (const id of KNOWN_IDS) {
    const result = await processCertId(id);
    results.push(result);
    // Polite delay
    await new Promise(r => setTimeout(r, 800));
  }

  // Write CSV
  const csvLines = [
    'id,full_name,issue_date,program,module,hours,email',
    ...results
      .filter(r => r.found)
      .map(r => `"${r.id}","${r.name || 'Unknown'}","${r.dateStr || ''}","Relational Psychotherapy","","0",""`)
  ];

  const csvPath = path.join(__dirname, '../data/certificates-export.csv');
  fs.writeFileSync(csvPath, csvLines.join('\n'));
  
  console.log(`\n✅ Done! Found ${results.filter(r => r.found).length} certificates.`);
  console.log(`📄 CSV saved to: data/certificates-export.csv`);
  console.log('\n📋 Next step: import this CSV into Supabase:');
  console.log('   → https://app.supabase.com → Table Editor → certificates → Import CSV\n');

  // Also write SQL inserts
  const sqlLines = [
    'INSERT INTO certificates (id, full_name, first_name, last_name, email, program, module, hours, issue_date) VALUES',
    ...results
      .filter(r => r.found && r.name)
      .map((r, i, arr) => {
        const parts = (r.name || '').split(' ');
        const first = parts[0] || '';
        const last = parts.slice(1).join(' ') || '';
        const comma = i < arr.length - 1 ? ',' : '';
        return `('${r.id}', '${r.name}', '${first}', '${last}', '', 'Relational Psychotherapy', '', 0, NULL)${comma}`;
      }),
    'ON CONFLICT (id) DO NOTHING;',
  ];

  const sqlPath = path.join(__dirname, '../data/certificates-seed.sql');
  fs.writeFileSync(sqlPath, sqlLines.join('\n'));
  console.log(`📄 SQL saved to: data/certificates-seed.sql`);
}

main().catch(console.error);
