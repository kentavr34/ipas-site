# Структура Google Sheet — IPAS Database

После запуска `initSpreadsheet()` в Apps Script создаются 5 листов.
Ниже — поля и примеры данных. Первая строка листа — заголовки (фиксированы).

---

## 1. `certificates` — сертификаты

| Колонка | Тип | Пример | Описание |
|---|---|---|---|
| `id` | text | `032523122` | URL-слаг, совпадает со старыми Wix-ссылками |
| `display_id` | text | `C032513528` | ID, напечатанный на самом сертификате (часто = id, но у `13iu21e3az00XX` страниц отличается) |
| `full_name` | text | `Fatima Dadashsoy` | Полное имя |
| `first_name` | text | `Fatima` | Имя |
| `last_name` | text | `Dadashsoy` | Фамилия |
| `email` | text | `fatima@mail.com` | Email (может быть пустым) |
| `program` | text | `Child Psychology / Cognitive behavioural therapy` | Один или несколько курсов через ` / ` |
| `module` | text | `Module III` | Модуль (необязательно) |
| `hours` | number | `72` | Суммарно часов по всем курсам |
| `courses_count` | number | `2` | Сколько курсов завершено |
| `courses_raw` | text | `Child Psychology (36 hours) \| Cognitive behavioural therapy (36 hours)` | Исходная строка курсов с часами |
| `issue_date` | date | `2024-04-03` | Дата выдачи |
| `issued_by` | text | `IPAS / IPI` | Организация |
| `status` | text | `valid` / `revoked` | Статус |
| `membership_type` | text | `Community Member` | Тип членства |
| `valid_period` | text | `03/04/2024 - 05/04/2025` | Период действия |
| `language` | text | `in azerbaijani and russian language` | Язык обучения |
| `director` | text | `Society Ambasador Kenan Rahimov` | Директор курса |
| `teacher` | text | `Tamilla Suleymanova` | Преподаватель |
| `source_url` | text | `https://www.intpas.com/032523122` | Старая ссылка Wix (для истории) |
| `created_at` | datetime | `2026-04-17 12:30:00` | Когда добавлен |

---

## 2. `news_posts` — публикации/новости

| Колонка | Пример |
|---|---|
| `id` | uuid (автоген) |
| `slug` | `new-course-relational-2026` |
| `title` | `New Course: Relational Psychotherapy 2026` |
| `excerpt` | Короткий тизер на 1-2 строки |
| `content` | Полный HTML/Markdown текст поста |
| `category` | `News` / `Events` / `Research` |
| `published_at` | `2026-04-15` |
| `published` | `TRUE` / `FALSE` |
| `created_at` | datetime |

---

## 3. `events` — календарь программ

| Колонка | Пример |
|---|---|
| `id` | uuid |
| `title` | `Module II — Relational Psychotherapy` |
| `description` | Описание |
| `starts_at` | `2026-06-10 10:00` |
| `ends_at` | `2026-06-14 18:00` |
| `location` | `Baku, IPAS Centre` |
| `url` | ссылка на регистрацию |
| `price` | `€450` |
| `created_at` | datetime |

---

## 4. `access_log` — лог проверок сертификатов

Пишется автоматически при каждом публичном запросе `action=cert`.
Приватный — пользователи его не видят.

| Колонка | Описание |
|---|---|
| `id` | uuid |
| `cert_id` | какой сертификат проверяли |
| `ref` | откуда пришли (Referer) |
| `ua` | User-Agent |
| `at` | когда |

---

## 5. `audit_log` — лог админских действий

| Колонка | Описание |
|---|---|
| `id` | uuid |
| `action` | `createCert`, `updateCert`, `revokeCert`, `upsertPost`, ... |
| `details` | JSON с подробностями |
| `at` | когда |

---

## Как заполнять руками

Можно открыть Sheet и редактировать ячейки как обычную таблицу.
Все изменения сразу видны через API. Это удобно для:
- быстрой правки опечатки в имени
- массового импорта через Import CSV
- скачивания бэкапа (File → Download → CSV)
