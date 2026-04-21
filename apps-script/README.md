# IPAS — Apps Script Backend

Полный бэкенд сайта intpas.com на Google Apps Script + Google Sheets.
Никаких сторонних регистраций, ничего не платим.

---

## Шаг 1. Создать Google Sheet

1. Залогиниться в `gtc.baku@gmail.com`
2. Открыть https://sheets.new
3. Назвать таблицу: **IPAS Database**
4. Скопировать из URL её ID (длинная строка между `/d/` и `/edit`):

   ```
   https://docs.google.com/spreadsheets/d/XXXXXXXXXXXXXXXXXXXXX/edit
                                          ^^^^^^^^^^^^^^^^^^^^
                                          это SHEET_ID
   ```

---

## Шаг 2. Создать Apps Script проект

1. В той же таблице: **Extensions → Apps Script**
2. Удалить содержимое `Code.gs` по умолчанию
3. Скопировать сюда весь [Code.gs](Code.gs) из этой папки
4. Сохранить (Ctrl+S)

---

## Шаг 3. Создать шаблон сертификата в Google Docs

1. Открыть https://docs.new
2. Назвать: **IPAS Certificate Template**
3. Оформить сертификат (логотип, рамка, текст). Вместо имени/ID/даты
   вставить плейсхолдеры:

   ```
   Certificate ID: {{id}}
   This certifies that {{full_name}}
   has completed {{program}} — {{module}}
   ({{hours}} hours)
   Issued: {{issue_date}}
   Issued by: {{issued_by}}
   Verify at: https://intpas.com/{{id}}
   ```

4. Сохранить. Скопировать **TEMPLATE_DOC_ID** из URL (как у Sheet).

---

## Шаг 4. Настроить Script Properties

В редакторе Apps Script:
**File → Project Settings → Script Properties → Add script property**

| Ключ | Значение |
|---|---|
| `SHEET_ID` | ID из шага 1 |
| `TEMPLATE_DOC_ID` | ID из шага 3 |
| `ADMIN_TOKEN` | любая длинная случайная строка (это пароль админки) |
| `FROM_NAME` | `IPAS / IPI` |
| `BCC` | (опционально) адрес для копий писем, например `archive@intpas.com` |

Сохранить.

---

## Шаг 5. Инициализация таблицы

В редакторе Apps Script:
1. Выбрать функцию `initSpreadsheet` в выпадающем списке сверху
2. Нажать **Run**
3. Разрешить доступ (первый раз Google спросит)
4. В логе должно быть: `OK: листы созданы/проверены`

В таблице появятся листы: `certificates`, `news_posts`, `events`, `access_log`, `audit_log`.

---

## Шаг 6. Деплой как Web App

1. **Deploy → New deployment**
2. Тип: **Web app**
3. Description: `IPAS API v1`
4. **Execute as**: `Me (gtc.baku@gmail.com)`
5. **Who has access**: `Anyone`
6. **Deploy** → разрешить доступ
7. Скопировать **Web app URL** — он выглядит так:

   ```
   https://script.google.com/macros/s/AKfycbxxxxxxxxxx/exec
   ```

   Это и есть `NEXT_PUBLIC_API_URL` для фронтенда.

> ⚠️ **Важно**: при каждом изменении кода нужно **New version → Deploy**,
> иначе URL отдаёт старую версию.

---

## Шаг 7. Проверка

Открыть в браузере (подставить свой URL):

```
https://script.google.com/macros/s/AKfyc.../exec?action=ping
```

Должно вернуть:
```json
{"ok":true,"data":{"pong":"2026-04-17T..."}}
```

---

## Шаг 8. Резервное копирование (опционально, но нужно)

1. В редакторе Apps Script слева: **Triggers (будильник)** → **Add Trigger**
2. Function: `dailyBackup`
3. Event source: `Time-driven`
4. Type: `Day timer` → `2am – 3am`
5. Save

Теперь каждую ночь Sheet будет копироваться в папку `IPAS-backups`
на Google Drive, старые копии (>30 дней) удаляются.

---

## API — примеры

### Публичные (GET)

```
/exec?action=ping
/exec?action=cert&id=032523122
/exec?action=search&q=Fatima
/exec?action=posts
/exec?action=post&slug=new-course-launched
/exec?action=events
```

### Админские (POST, требуют `token`)

Content-Type: `text/plain` (чтобы избежать CORS preflight), тело — JSON-строка.

```json
{
  "action": "createCert",
  "token": "YOUR_ADMIN_TOKEN",
  "sendEmail": true,
  "cert": {
    "id": "050124001",
    "full_name": "John Doe",
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "program": "Relational Psychotherapy",
    "module": "Module I",
    "hours": 40,
    "issue_date": "2026-04-15",
    "issued_by": "IPAS / IPI"
  }
}
```

Другие actions: `updateCert`, `revokeCert`, `bulkCreate`, `resendCert`,
`upsertPost`, `deletePost`, `upsertEvent`, `deleteEvent`.

---

## Лимиты Google (ориентиры на 2026)

| Ресурс | Consumer (gmail.com) | Workspace |
|---|---|---|
| Emails/day | 100 | 1500 |
| Script runtime | 6 min / запуск | 6 min |
| URL Fetch calls | 20k/day | 100k/day |
| Triggers | 20 на скрипт | 20 |

Если для массовой рассылки 100/день мало — переключим на Workspace
или на Resend через `UrlFetchApp`.
