# Шаблон сертификата в Google Docs

Apps Script генерирует PDF **копируя Google Docs шаблон** и подставляя
значения в плейсхолдеры вида `{{имя_поля}}`.

---

## Шаг 1. Создать документ

1. Залогиниться в `gtc.baku@gmail.com`
2. Открыть https://docs.new
3. Назвать: **IPAS Certificate Template**
4. **File → Page setup → Landscape** (ширина ≥ 29см для A4 альбомной)

---

## Шаг 2. Оформление

Идея — сделать красивый сертификат в стиле текущего intpas.com, но
можно использовать:
- Картинку фона через **Insert → Image → Drawing** (рамка, логотип IPAS)
- Декоративный шрифт для имени (Insert → Special characters + Playfair Display)
- Печать/подпись как изображение

---

## Шаг 3. Плейсхолдеры

Apps Script подставит эти значения в документ при генерации PDF.
Просто впиши их как обычный текст (с двойными фигурными скобками):

| Плейсхолдер | Подставится |
|---|---|
| `{{id}}` | `032523122` |
| `{{full_name}}` | `Fatima Dadashsoy` |
| `{{first_name}}` | `Fatima` |
| `{{last_name}}` | `Dadashsoy` |
| `{{program}}` | `Relational Psychotherapy` |
| `{{module}}` | `Module III` |
| `{{hours}}` | `120` |
| `{{issue_date}}` | `2023-03-25` |
| `{{issued_by}}` | `IPAS / IPI` |

---

## Пример текста в шаблоне

```
                    C E R T I F I C A T E

           This is to certify that

                  {{full_name}}

     has successfully completed the program

              {{program}}
              {{module}}   ({{hours}} hours)

     Issued on: {{issue_date}}
     Issued by: {{issued_by}}

     Certificate ID: {{id}}
     Verify at https://intpas.com/{{id}}
```

---

## Шаг 4. QR-код (опционально)

Apps Script не умеет вставлять QR из коробки, но можно
добавить в шаблон картинку из внешнего QR-сервиса:

```
https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://intpas.com/{{id}}
```

Но `{{id}}` в URL картинки Docs не подменит. Поэтому QR рендерим
прямо на странице сертификата на сайте (динамически), а в письме
ограничимся ссылкой на верификацию.

Если QR **обязательно нужен в PDF** — сделаем позже через:
- Google Charts Image API (устарело)
- `UrlFetchApp` → вставка как изображения через `body.insertImage()`

---

## Шаг 5. Сохранить и скопировать ID

После оформления:
1. **File → Share → Anyone with the link — Viewer** (чтобы скрипт мог читать)
2. Скопировать ID документа из URL:

   ```
   https://docs.google.com/document/d/XXXXXXXXXXXXXXXX/edit
                                      ^^^^^^^^^^^^^^^^^
                                      TEMPLATE_DOC_ID
   ```

3. Вставить в **Script Properties → TEMPLATE_DOC_ID**

---

## Готово

Следующий раз, когда админ нажмёт «Создать сертификат + отправить»,
Apps Script:
1. Скопирует этот шаблон во временный файл
2. Подменит все `{{...}}` на реальные значения
3. Экспортирует в PDF
4. Отправит на email студента
5. Удалит временную копию
