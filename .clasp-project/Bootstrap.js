/**
 * Bootstrap.gs — одноразовая настройка проекта.
 * Запускается один раз через `clasp run bootstrap`.
 *
 * Делает:
 *   1. Устанавливает Script Properties (SHEET_ID, TEMPLATE_DOC_ID, ADMIN_TOKEN, FROM_NAME)
 *   2. Создаёт все листы в Sheet (вызывает initSpreadsheet)
 *   3. Заливает 85 сертификатов (вызывает seedCerts)
 */

function bootstrap() {
  // Шаг 1 — свойства скрипта
  const p = PropertiesService.getScriptProperties();
  p.setProperties({
    SHEET_ID: '1vZvM1oJVP8hxIaVyCrxR7ICZNdLSeDKi2m6ptG3CsjQ',
    TEMPLATE_DOC_ID: '1Wo9xWlKR_kDcj-thaxpRsr8hx40-vqpDNksG1Vy--bM',
    ADMIN_TOKEN: p.getProperty('ADMIN_TOKEN') || Utilities.getUuid() + '-' + Utilities.getUuid(),
    FROM_NAME: 'IPAS / IPI',
  });
  Logger.log('1. Script Properties: OK');

  // Шаг 2 — листы
  const r1 = initSpreadsheet();
  Logger.log('2. initSpreadsheet: ' + r1);

  // Шаг 3 — seed
  const n = seedCerts();
  Logger.log('3. seedCerts: ' + n + ' rows');

  return {
    properties: 'set',
    sheets: r1,
    seeded: n,
    admin_token: p.getProperty('ADMIN_TOKEN'),
  };
}

/** Отдельная функция — просто вернуть текущий ADMIN_TOKEN (чтобы передать в фронт). */
function getAdminToken() {
  return PropertiesService.getScriptProperties().getProperty('ADMIN_TOKEN');
}
