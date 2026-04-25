/**
 * IPAS — Google Apps Script Backend
 * ================================================================
 * БД: Google Sheets
 * Шаблон сертификата: Google Docs
 * Почта: GmailApp / MailApp
 *
 * ЛИСТЫ в таблице:
 *   certificates   — сертификаты (id, full_name, ... )
 *   news_posts     — публикации
 *   events         — календарь программ/курсов
 *   access_log     — кто/когда проверял сертификат
 *   audit_log      — все изменения в админке
 *
 * НАСТРОЙКА (один раз):
 *   Script Properties (File → Project Settings → Script Properties):
 *     SHEET_ID         — ID Google Sheet (из URL)
 *     TEMPLATE_DOC_ID  — ID Google Docs шаблона сертификата
 *     ADMIN_TOKEN      — случайная строка (пароль админки)
 *     FROM_NAME        — "IPAS / IPI"   (имя отправителя)
 *     BCC              — email для копии каждого письма (опционально)
 *
 * ДЕПЛОЙ:
 *   Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone
 *   Скопировать URL → добавить в .env фронта как NEXT_PUBLIC_API_URL
 */

// ─────────────────────────────────────────────────────────────────
//  Настройки (читаются из Script Properties)
// ─────────────────────────────────────────────────────────────────
const CFG = (() => {
  const p = PropertiesService.getScriptProperties();
  return {
    SHEET_ID: p.getProperty('SHEET_ID'),
    TEMPLATE_DOC_ID: p.getProperty('TEMPLATE_DOC_ID'),
    ADMIN_TOKEN: p.getProperty('ADMIN_TOKEN'),
    FROM_NAME: p.getProperty('FROM_NAME') || 'IPAS / IPI',
    BCC: p.getProperty('BCC') || '',
  };
})();

// ─────────────────────────────────────────────────────────────────
//  Входные точки Web App
// ─────────────────────────────────────────────────────────────────
function doGet(e) {
  try {
    const action = (e && e.parameter && e.parameter.action) || '';
    const data = routeGet(action, (e && e.parameter) || {});
    return json({ ok: true, data });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

function doPost(e) {
  try {
    // Тело приходит как text/plain чтобы избежать CORS preflight
    const body = e && e.postData && e.postData.contents
      ? JSON.parse(e.postData.contents)
      : {};
    const action = body.action || '';
    const needsAuth = !PUBLIC_POST_ACTIONS.has(action);
    if (needsAuth) requireAdmin(body.token);
    const data = routePost(action, body);
    return json({ ok: true, data });
  } catch (err) {
    return json({ ok: false, error: String(err && err.message || err) });
  }
}

// Публичные POST-экшены (без токена).
// submitApplication вызывается с фронта при отправке заявки на членство.
const PUBLIC_POST_ACTIONS = new Set(['submitApplication', 'nowpayIpn']);

// ─────────────────────────────────────────────────────────────────
//  Роутеры
// ─────────────────────────────────────────────────────────────────
function routeGet(action, p) {
  switch (action) {
    case 'cert':     return getCertById(p.id, p);
    case 'search':   return searchCerts(p.q || '');
    case 'listCertIds': return listCertIds();
    case 'posts':    return getPublishedPosts();
    case 'post':     return getPostBySlug(p.slug);
    case 'events':   return getUpcomingEvents();
    case 'ping':     return { pong: new Date().toISOString() };
    default:         throw new Error('Unknown GET action: ' + action);
  }
}

function routePost(action, b) {
  switch (action) {
    case 'createCert':  return createCertificate(b.cert, !!b.sendEmail);
    case 'updateCert':  return updateCertificate(b.cert);
    case 'revokeCert':  return revokeCertificate(b.id, b.reason || '');
    case 'bulkCreate':  return bulkCreateCerts(b.rows || [], !!b.sendEmail);
    case 'resendCert':  return resendCertEmail(b.id);
    case 'upsertPost':  return upsertPost(b.post);
    case 'deletePost':  return deletePost(b.id);
    case 'upsertEvent': return upsertEvent(b.event);
    case 'deleteEvent': return deleteEvent(b.id);
    case 'submitApplication': return submitApplication(b);
    case 'nowpayIpn':   return nowpayIpn(b);
    default:            throw new Error('Unknown POST action: ' + action);
  }
}

// ─────────────────────────────────────────────────────────────────
//  Утилиты
// ─────────────────────────────────────────────────────────────────
function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function requireAdmin(token) {
  if (!CFG.ADMIN_TOKEN) throw new Error('ADMIN_TOKEN не настроен');
  if (token !== CFG.ADMIN_TOKEN) throw new Error('Unauthorized');
}

function sheet(name) {
  if (!CFG.SHEET_ID) throw new Error('SHEET_ID не настроен');
  const ss = SpreadsheetApp.openById(CFG.SHEET_ID);
  const sh = ss.getSheetByName(name);
  if (!sh) throw new Error('Лист не найден: ' + name);
  return sh;
}

/** Читает лист как массив объектов. Первая строка — заголовки. */
function readAll(sheetName) {
  const sh = sheet(sheetName);
  const values = sh.getDataRange().getValues();
  if (values.length < 2) return [];
  const headers = values[0].map(String);
  const rows = [];
  for (let i = 1; i < values.length; i++) {
    const row = values[i];
    const obj = {};
    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = row[j];
    }
    rows.push(obj);
  }
  return rows;
}

/** Возвращает номер строки (1-based) с совпадением по колонке. */
function findRowIndex(sheetName, column, value) {
  const sh = sheet(sheetName);
  const values = sh.getDataRange().getValues();
  const headers = values[0].map(String);
  const colIdx = headers.indexOf(column);
  if (colIdx === -1) throw new Error('Нет колонки ' + column + ' в ' + sheetName);
  for (let i = 1; i < values.length; i++) {
    if (String(values[i][colIdx]) === String(value)) return i + 1;
  }
  return -1;
}

function appendRow(sheetName, obj) {
  const sh = sheet(sheetName);
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const row = headers.map(h => obj[h] !== undefined ? obj[h] : '');
  sh.appendRow(row);
}

function updateRow(sheetName, rowIndex, obj) {
  const sh = sheet(sheetName);
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const current = sh.getRange(rowIndex, 1, 1, headers.length).getValues()[0];
  const next = headers.map((h, i) => obj[h] !== undefined ? obj[h] : current[i]);
  sh.getRange(rowIndex, 1, 1, headers.length).setValues([next]);
}

function withLock(fn) {
  const lock = LockService.getScriptLock();
  lock.waitLock(15000);
  try { return fn(); } finally { lock.releaseLock(); }
}

function audit(action, details) {
  try {
    appendRow('audit_log', {
      id: Utilities.getUuid(),
      action,
      details: typeof details === 'string' ? details : JSON.stringify(details),
      at: new Date(),
    });
  } catch (e) { /* audit лучше чем ничего, но не ломаем основную операцию */ }
}

// ─────────────────────────────────────────────────────────────────
//  Сертификаты — чтение
// ─────────────────────────────────────────────────────────────────
function getCertById(id, meta) {
  if (!id) throw new Error('id обязателен');
  const all = readAll('certificates');
  const cert = all.find(r => String(r.id) === String(id));
  if (!cert) return null;
  // Лог доступа (только для публичных GET)
  try {
    appendRow('access_log', {
      id: Utilities.getUuid(),
      cert_id: id,
      ref: (meta && meta.ref) || '',
      ua: (meta && meta.ua) || '',
      at: new Date(),
    });
  } catch (e) {}
  return cert;
}

/** Возвращает все ID — для статической пред-генерации страниц на билде. */
function listCertIds() {
  return readAll('certificates')
    .map(r => String(r.id))
    .filter(Boolean);
}

function searchCerts(q) {
  const needle = String(q || '').trim().toLowerCase();
  if (!needle) return [];
  const all = readAll('certificates');
  return all.filter(r =>
    String(r.id).toLowerCase().includes(needle) ||
    String(r.full_name).toLowerCase().includes(needle)
  ).slice(0, 20);
}

// ─────────────────────────────────────────────────────────────────
//  Сертификаты — запись
// ─────────────────────────────────────────────────────────────────
function createCertificate(cert, sendEmail) {
  if (!cert || !cert.id || !cert.full_name) {
    throw new Error('id и full_name обязательны');
  }
  return withLock(() => {
    if (findRowIndex('certificates', 'id', cert.id) !== -1) {
      throw new Error('Сертификат с таким ID уже существует');
    }
    const row = Object.assign({
      id: '',
      display_id: '',
      full_name: '',
      first_name: '',
      last_name: '',
      email: '',
      program: '',
      module: '',
      hours: 0,
      courses_count: 0,
      courses_raw: '',
      issue_date: '',
      issued_by: CFG.FROM_NAME,
      status: 'valid',
      membership_type: '',
      valid_period: '',
      language: '',
      director: '',
      teacher: '',
      source_url: '',
      created_at: new Date(),
    }, cert);
    if (!row.display_id) row.display_id = row.id;
    appendRow('certificates', row);
    audit('createCert', { id: row.id });

    let emailed = false;
    if (sendEmail && row.email) {
      sendCertificateEmail_(row);
      emailed = true;
    }
    return { cert: row, emailed };
  });
}

function updateCertificate(cert) {
  if (!cert || !cert.id) throw new Error('id обязателен');
  return withLock(() => {
    const idx = findRowIndex('certificates', 'id', cert.id);
    if (idx === -1) throw new Error('Не найден');
    updateRow('certificates', idx, cert);
    audit('updateCert', { id: cert.id });
    return { updated: true };
  });
}

function revokeCertificate(id, reason) {
  return withLock(() => {
    const idx = findRowIndex('certificates', 'id', id);
    if (idx === -1) throw new Error('Не найден');
    updateRow('certificates', idx, { status: 'revoked' });
    audit('revokeCert', { id, reason });
    return { revoked: true };
  });
}

function bulkCreateCerts(rows, sendEmail) {
  if (!Array.isArray(rows) || !rows.length) throw new Error('rows пусто');
  const results = [];
  for (const cert of rows) {
    try {
      const r = createCertificate(cert, sendEmail);
      results.push({ id: cert.id, ok: true, emailed: r.emailed });
    } catch (e) {
      results.push({ id: cert.id, ok: false, error: String(e.message || e) });
    }
  }
  audit('bulkCreate', { count: rows.length });
  return { results };
}

function resendCertEmail(id) {
  const cert = getCertById(id);
  if (!cert) throw new Error('Не найден');
  if (!cert.email) throw new Error('У сертификата нет email');
  sendCertificateEmail_(cert);
  audit('resendCert', { id });
  return { emailed: true };
}

// ─────────────────────────────────────────────────────────────────
//  Публикации (news_posts)
// ─────────────────────────────────────────────────────────────────
function getPublishedPosts() {
  return readAll('news_posts')
    .filter(p => p.published === true || String(p.published).toUpperCase() === 'TRUE')
    .sort((a, b) => new Date(b.published_at) - new Date(a.published_at));
}

function getPostBySlug(slug) {
  if (!slug) throw new Error('slug обязателен');
  const all = readAll('news_posts');
  return all.find(p => p.slug === slug) || null;
}

function upsertPost(post) {
  if (!post || !post.slug || !post.title) throw new Error('slug и title обязательны');
  return withLock(() => {
    const idx = findRowIndex('news_posts', 'slug', post.slug);
    const payload = Object.assign({
      id: post.id || Utilities.getUuid(),
      slug: '',
      title: '',
      excerpt: '',
      content: '',
      category: 'News',
      published_at: new Date(),
      published: false,
      created_at: new Date(),
    }, post);
    if (idx === -1) {
      appendRow('news_posts', payload);
      audit('createPost', { slug: payload.slug });
      return { created: true, slug: payload.slug };
    } else {
      updateRow('news_posts', idx, payload);
      audit('updatePost', { slug: payload.slug });
      return { updated: true, slug: payload.slug };
    }
  });
}

function deletePost(id) {
  return withLock(() => {
    const idx = findRowIndex('news_posts', 'id', id);
    if (idx === -1) throw new Error('Не найден');
    sheet('news_posts').deleteRow(idx);
    audit('deletePost', { id });
    return { deleted: true };
  });
}

// ─────────────────────────────────────────────────────────────────
//  Календарь событий/программ
// ─────────────────────────────────────────────────────────────────
function getUpcomingEvents() {
  const now = new Date();
  return readAll('events')
    .filter(e => e.starts_at && new Date(e.starts_at) >= now)
    .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at));
}

function upsertEvent(ev) {
  if (!ev || !ev.title || !ev.starts_at) throw new Error('title и starts_at обязательны');
  return withLock(() => {
    const id = ev.id || Utilities.getUuid();
    const idx = findRowIndex('events', 'id', id);
    const payload = Object.assign({
      id,
      title: '',
      description: '',
      starts_at: '',
      ends_at: '',
      location: '',
      url: '',
      price: '',
      created_at: new Date(),
    }, ev, { id });
    if (idx === -1) { appendRow('events', payload); audit('createEvent', { id }); }
    else            { updateRow('events', idx, payload); audit('updateEvent', { id }); }
    return { id };
  });
}

function deleteEvent(id) {
  return withLock(() => {
    const idx = findRowIndex('events', 'id', id);
    if (idx === -1) throw new Error('Не найден');
    sheet('events').deleteRow(idx);
    audit('deleteEvent', { id });
    return { deleted: true };
  });
}

// ─────────────────────────────────────────────────────────────────
//  Генерация PDF из шаблона Google Docs
// ─────────────────────────────────────────────────────────────────
/**
 * В шаблоне Google Docs используй плейсхолдеры:
 *   {{id}}, {{full_name}}, {{first_name}}, {{last_name}},
 *   {{program}}, {{module}}, {{hours}}, {{issue_date}}, {{issued_by}}
 * Также можно вставить URL: https://intpas.com/{{id}}
 */
function buildCertificatePdf_(cert) {
  if (!CFG.TEMPLATE_DOC_ID) throw new Error('TEMPLATE_DOC_ID не настроен');
  const copy = DriveApp.getFileById(CFG.TEMPLATE_DOC_ID)
    .makeCopy('tmp-cert-' + cert.id);
  try {
    const doc = DocumentApp.openById(copy.getId());
    const body = doc.getBody();
    Object.keys(cert).forEach(key => {
      body.replaceText('{{' + key + '}}', String(cert[key] == null ? '' : cert[key]));
    });
    doc.saveAndClose();
    const pdf = copy.getAs('application/pdf').setName('IPAS-' + cert.id + '.pdf');
    return pdf;
  } finally {
    copy.setTrashed(true);
  }
}

function sendCertificateEmail_(cert) {
  const pdf = buildCertificatePdf_(cert);
  const subject = 'Your IPAS Certificate — ' + cert.full_name;
  const verifyUrl = 'https://intpas.com/' + cert.id;
  const html =
    '<p>Dear ' + cert.first_name + ',</p>' +
    '<p>Congratulations! Your certificate from ' + CFG.FROM_NAME +
    ' is attached to this email.</p>' +
    '<p>You can also verify it online:<br>' +
    '<a href="' + verifyUrl + '">' + verifyUrl + '</a></p>' +
    '<p>Certificate ID: <b>' + cert.id + '</b><br>' +
    'Program: ' + (cert.program || '') + '<br>' +
    'Module: ' + (cert.module || '') + '<br>' +
    'Hours: ' + (cert.hours || '') + '</p>' +
    '<p>Best regards,<br>' + CFG.FROM_NAME + '</p>';
  const opts = {
    attachments: [pdf],
    name: CFG.FROM_NAME,
    htmlBody: html,
  };
  if (CFG.BCC) opts.bcc = CFG.BCC;
  GmailApp.sendEmail(cert.email, subject, '', opts);
}

// ─────────────────────────────────────────────────────────────────
//  Меню в Google Sheets — ручная выдача сертификата из таблицы
//  (триггер onOpen ставится автоматически при открытии файла)
// ─────────────────────────────────────────────────────────────────
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('IPAS')
    .addItem('Send certificate (selected row)', 'menuSendCertForRow')
    .addItem('Resend certificate (selected row)', 'menuResendCertForRow')
    .addSeparator()
    .addItem('Send ALL pending (status=valid, email пуст в emailed_at)',
             'menuSendAllPending')
    .addToUi();
}

/** Отправка одному — читает выбранную строку листа certificates. */
function menuSendCertForRow() {
  const ui = SpreadsheetApp.getUi();
  try {
    const cert = readSelectedCertRow_();
    if (!cert) return;
    if (!cert.email) throw new Error('В строке пустой email');
    if (cert.emailed_at) {
      const resp = ui.alert('Уже отправлялось (' + cert.emailed_at + '). Отправить ещё раз?',
                            ui.ButtonSet.YES_NO);
      if (resp !== ui.Button.YES) return;
    }
    sendCertificateEmail_(cert);
    markEmailed_(cert.id);
    audit('menuSendCert', { id: cert.id });
    ui.alert('OK', 'Письмо отправлено на ' + cert.email, ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Ошибка', String(e.message || e), ui.ButtonSet.OK);
  }
}

function menuResendCertForRow() {
  const ui = SpreadsheetApp.getUi();
  try {
    const cert = readSelectedCertRow_();
    if (!cert) return;
    if (!cert.email) throw new Error('В строке пустой email');
    sendCertificateEmail_(cert);
    markEmailed_(cert.id);
    audit('menuResendCert', { id: cert.id });
    ui.alert('OK', 'Письмо переотправлено на ' + cert.email, ui.ButtonSet.OK);
  } catch (e) {
    ui.alert('Ошибка', String(e.message || e), ui.ButtonSet.OK);
  }
}

/** Массовая рассылка всем, у кого status=valid и emailed_at пуст. */
function menuSendAllPending() {
  const ui = SpreadsheetApp.getUi();
  const all = readAll('certificates');
  const pending = all.filter(r =>
    r.email && String(r.status).toLowerCase() === 'valid' && !r.emailed_at
  );
  if (!pending.length) {
    ui.alert('Нет сертификатов в очереди (status=valid + emailed_at пуст).');
    return;
  }
  const resp = ui.alert('Отправить ' + pending.length + ' писем?', ui.ButtonSet.YES_NO);
  if (resp !== ui.Button.YES) return;

  let ok = 0, fail = 0;
  pending.forEach(cert => {
    try { sendCertificateEmail_(cert); markEmailed_(cert.id); ok++; }
    catch (e) { fail++; audit('menuSendAllPending_fail', { id: cert.id, err: String(e) }); }
  });
  audit('menuSendAllPending', { ok, fail });
  ui.alert('Готово', 'Отправлено: ' + ok + ', ошибок: ' + fail, ui.ButtonSet.OK);
}

function readSelectedCertRow_() {
  const ui = SpreadsheetApp.getUi();
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getActiveSheet();
  if (sh.getName() !== 'certificates') {
    ui.alert('Открой лист certificates и поставь курсор на нужную строку.');
    return null;
  }
  const row = sh.getActiveRange().getRow();
  if (row < 2) { ui.alert('Выбери строку с данными (не заголовок).'); return null; }
  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];
  const values  = sh.getRange(row, 1, 1, headers.length).getValues()[0];
  const cert = {};
  headers.forEach((h, i) => cert[h] = values[i]);
  if (!cert.id || !cert.full_name) {
    ui.alert('В строке нет id или full_name.'); return null;
  }
  return cert;
}

function markEmailed_(id) {
  const idx = findRowIndex('certificates', 'id', id);
  if (idx === -1) return;
  updateRow('certificates', idx, { emailed_at: new Date() });
}

// ─────────────────────────────────────────────────────────────────
//  Резервное копирование (запускать по триггеру раз в сутки)
// ─────────────────────────────────────────────────────────────────
function dailyBackup() {
  if (!CFG.SHEET_ID) return;
  const src = DriveApp.getFileById(CFG.SHEET_ID);
  const folder = getOrCreateBackupFolder_();
  const ts = Utilities.formatDate(new Date(), 'Etc/GMT', 'yyyy-MM-dd');
  src.makeCopy('ipas-backup-' + ts, folder);
  // Чистим старше 30 дней
  const cutoff = new Date(Date.now() - 30 * 24 * 3600 * 1000);
  const iter = folder.getFiles();
  while (iter.hasNext()) {
    const f = iter.next();
    if (f.getDateCreated() < cutoff) f.setTrashed(true);
  }
}

function getOrCreateBackupFolder_() {
  const name = 'IPAS-backups';
  const iter = DriveApp.getFoldersByName(name);
  return iter.hasNext() ? iter.next() : DriveApp.createFolder(name);
}

// ─────────────────────────────────────────────────────────────────
//  Первичная инициализация — создаёт листы и заголовки
//  Запустить один раз из редактора (Run → initSpreadsheet)
// ─────────────────────────────────────────────────────────────────
function initSpreadsheet() {
  if (!CFG.SHEET_ID) throw new Error('Сначала задай SHEET_ID в Script Properties');
  const ss = SpreadsheetApp.openById(CFG.SHEET_ID);
  const schema = {
    certificates: [
      'id','display_id','full_name','first_name','last_name','email',
      'program','module','hours','courses_count','courses_raw',
      'issue_date','issued_by','status',
      'membership_type','valid_period','language','director','teacher',
      'source_url','created_at','emailed_at'
    ],
    news_posts: [
      'id','slug','title','excerpt','content','category',
      'published_at','published','created_at'
    ],
    events: [
      'id','title','description','starts_at','ends_at',
      'location','url','price','created_at'
    ],
    access_log: ['id','cert_id','ref','ua','at'],
    audit_log:  ['id','action','details','at'],
    applications: [
      'id','tier','full_name','email','country','phone','bio',
      'doc_urls','status','payment_id','amount_usd',
      'invoice_url','created_at','updated_at'
    ],
    payments: [
      'id','application_id','provider','currency','amount_usd',
      'status','ipn_raw','created_at','updated_at'
    ],
  };
  Object.keys(schema).forEach(name => {
    let sh = ss.getSheetByName(name);
    if (!sh) sh = ss.insertSheet(name);
    if (sh.getLastRow() === 0) {
      sh.getRange(1, 1, 1, schema[name].length).setValues([schema[name]]);
      sh.setFrozenRows(1);
    }
  });
  return 'OK: листы созданы/проверены';
}

// ─────────────────────────────────────────────────────────────────
//  Членство — приём заявок + счёт NOWPayments
// ─────────────────────────────────────────────────────────────────

// Тарифы в USD — должны совпадать с фронтом (lib/tiers.ts).
const TIER_PRICES = {
  community:               49,
  professional:           149,
  faculty:                349,
  verified_professional: 1259,
  society_ambassador:    2365,
  country_ambassador:    5690,
};

function submitApplication(body) {
  const a = body || {};
  if (!a.tier || !a.full_name || !a.email) {
    throw new Error('tier, full_name, email обязательны');
  }
  const price = TIER_PRICES[a.tier];
  if (!price) throw new Error('Неизвестный tier: ' + a.tier);

  const applicationId = 'APP-' + Utilities.formatDate(new Date(), 'GMT', 'yyyyMMdd') +
                        '-' + Math.floor(Math.random() * 1e6).toString(36);

  // Инвойс у NOWPayments
  const invoice = createNowPaymentsInvoice_({
    price_amount: price,
    price_currency: 'usd',
    order_id: applicationId,
    order_description: 'IPAS ' + a.tier + ' membership — ' + a.full_name,
    ipn_callback_url: ScriptApp.getService().getUrl(), // свой же Web App, action=nowpayIpn
    success_url: 'https://intpas.com/membership/thank-you',
    cancel_url:  'https://intpas.com/membership',
  });

  appendRow('applications', {
    id: applicationId,
    tier: a.tier,
    full_name: a.full_name,
    email: a.email,
    country: a.country || '',
    phone: a.phone || '',
    bio: a.bio || '',
    doc_urls: Array.isArray(a.doc_urls) ? a.doc_urls.join('|') : (a.doc_urls || ''),
    status: 'pending_payment',
    payment_id: invoice.id || '',
    amount_usd: price,
    invoice_url: invoice.invoice_url || '',
    created_at: new Date(),
    updated_at: new Date(),
  });
  audit('submitApplication', { id: applicationId, tier: a.tier });

  return {
    application_id: applicationId,
    invoice_url: invoice.invoice_url,
  };
}

function createNowPaymentsInvoice_(payload) {
  const key = PropertiesService.getScriptProperties().getProperty('NOWPAY_API_KEY');
  if (!key) throw new Error('NOWPAY_API_KEY не настроен в Script Properties');
  const res = UrlFetchApp.fetch('https://api.nowpayments.io/v1/invoice', {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': key },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });
  const code = res.getResponseCode();
  const body = res.getContentText();
  if (code < 200 || code >= 300) {
    throw new Error('NOWPayments ' + code + ': ' + body);
  }
  return JSON.parse(body);
}

/**
 * IPN (instant payment notification) — NOWPayments шлёт сюда статус оплаты.
 * Регистрируем платёж и обновляем заявку. Приходит JSON.
 */
function nowpayIpn(body) {
  const paymentId = String(body.payment_id || body.id || '');
  const status    = String(body.payment_status || body.status || '').toLowerCase();
  const orderId   = String(body.order_id || '');

  appendRow('payments', {
    id: 'P-' + Utilities.getUuid().slice(0, 8),
    application_id: orderId,
    provider: 'nowpayments',
    currency: body.pay_currency || '',
    amount_usd: body.price_amount || '',
    status,
    ipn_raw: JSON.stringify(body),
    created_at: new Date(),
    updated_at: new Date(),
  });

  if (orderId) {
    const idx = findRowIndex('applications', 'id', orderId);
    if (idx !== -1) {
      const newStatus = status === 'finished' ? 'pending_review'
                      : status === 'failed'   ? 'rejected'
                      : 'pending_payment';
      updateRow('applications', idx, {
        status: newStatus,
        updated_at: new Date(),
      });
      if (newStatus === 'pending_review') {
        // Уведомление админу (BCC), чтобы проверил документы
        try {
          GmailApp.sendEmail(CFG.BCC || '', 'New IPAS membership application paid', '',
            { htmlBody: 'Application <b>' + orderId + '</b> — ' + status +
              '<br>Open admin: https://intpas.com/admin' });
        } catch (e) {}
      }
    }
  }
  audit('nowpayIpn', { orderId, paymentId, status });
  return { ok: true };
}

