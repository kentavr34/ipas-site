/**
 * Генерирует D:\WEB\ipas\Инструкция-IPAS.docx — пошаговая инструкция
 * по управлению сайтом IPAS на русском языке.
 *
 * Запуск: node scripts/build-instructions-doc.js
 */
const fs = require('fs');
const path = require('path');
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  HeadingLevel, AlignmentType, LevelFormat, BorderStyle, WidthType,
  ShadingType, PageBreak,
} = require('docx');

// ─── Утилиты ──────────────────────────────────────────────────────
const P = (text, opts = {}) =>
  new Paragraph({
    children: [new TextRun({ text, font: 'Arial', ...opts })],
    spacing: { after: 120 },
  });

const Pheading = (text, level) =>
  new Paragraph({
    heading: level,
    children: [new TextRun({ text, font: 'Arial' })],
    spacing: { before: 240, after: 160 },
  });

const Pbold = (text) => P(text, { bold: true });

const Pmono = (text) =>
  new Paragraph({
    children: [new TextRun({ text, font: 'Consolas', size: 22 })],
    spacing: { after: 80 },
    indent: { left: 360 },
  });

const Pbullet = (text, level = 0) =>
  new Paragraph({
    numbering: { reference: 'bullets', level },
    children: [new TextRun({ text, font: 'Arial' })],
    spacing: { after: 80 },
  });

const Pnumber = (text) =>
  new Paragraph({
    numbering: { reference: 'numbers', level: 0 },
    children: [new TextRun({ text, font: 'Arial' })],
    spacing: { after: 80 },
  });

const Pkey = (label, value) =>
  new Paragraph({
    children: [
      new TextRun({ text: label + ': ', bold: true, font: 'Arial' }),
      new TextRun({ text: value, font: 'Arial' }),
    ],
    spacing: { after: 60 },
  });

const Pnote = (text) =>
  new Paragraph({
    children: [new TextRun({ text: '⚠ ' + text, italics: true, font: 'Arial', color: '7A4900' })],
    spacing: { before: 80, after: 80 },
    indent: { left: 360 },
  });

// ─── Содержимое ──────────────────────────────────────────────────
const children = [];

// Титул
children.push(
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'Инструкция по управлению сайтом', font: 'Arial', size: 36, bold: true })],
    spacing: { after: 120 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'IPAS — International Psychotherapy Association', font: 'Arial', size: 28, color: 'B8912A' })],
    spacing: { after: 240 },
  }),
  new Paragraph({
    alignment: AlignmentType.CENTER,
    children: [new TextRun({ text: 'intpas.com', font: 'Arial', size: 22, italics: true })],
    spacing: { after: 480 },
  }),
);

// Куда заходить
children.push(Pheading('Где что находится', HeadingLevel.HEADING_1));
children.push(Pkey('Сайт', 'https://intpas.com (после переезда DNS)'));
children.push(Pkey('Текущий тестовый адрес', 'https://kentavr34.github.io/ipas-site/'));
children.push(Pkey('Админка сайта', 'https://intpas.com/admin (логин — ADMIN_TOKEN из Apps Script)'));
children.push(Pkey('Google-таблица (база данных)', 'IPAS Database — единственный источник правды для сертификатов, заявок, новостей и событий'));
children.push(Pkey('Apps Script (бэкенд)', 'https://script.google.com/home/projects/1if5ghmnEvb50TWFWZSMW0WZIS6F-PVatUYxJjgFkJBXnvvA-zuo8gTXp/edit'));
children.push(P('Все правки контента делаются либо через админку /admin на сайте, либо прямо в Google-таблице. Никакого FTP, кода или SSH трогать не нужно.'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// 1. Мероприятия
children.push(Pheading('1. Мероприятия (Events)', HeadingLevel.HEADING_1));

children.push(Pheading('Как создать своё мероприятие', HeadingLevel.HEADING_2));
children.push(Pnumber('Открой админку: https://intpas.com/admin'));
children.push(Pnumber('Введи ADMIN_TOKEN (из Apps Script → ⚙️ Project Settings → Script Properties)'));
children.push(Pnumber('Сверху выбери вкладку «Events»'));
children.push(Pnumber('Нажми кнопку «New event» (справа сверху)'));
children.push(Pnumber('Заполни поля:'));
children.push(Pbullet('Title — название', 1));
children.push(Pbullet('Location — место (город, площадка или «Online»)', 1));
children.push(Pbullet('Starts at — дата и время начала', 1));
children.push(Pbullet('Ends at — дата и время окончания', 1));
children.push(Pbullet('URL — внешняя ссылка на регистрацию (если есть)', 1));
children.push(Pbullet('Price — стоимость, например «$120» или «Free»', 1));
children.push(Pbullet('Description — описание (можно несколько абзацев)', 1));
children.push(Pnumber('Нажми «Save»'));
children.push(Pnumber('Мероприятие сразу появится на странице https://intpas.com/events (без пересборки сайта)'));

children.push(Pheading('Как редактировать или удалить', HeadingLevel.HEADING_2));
children.push(Pnumber('Админка → Events'));
children.push(Pnumber('В списке найди нужное событие'));
children.push(Pnumber('Кнопка «Edit» — редактировать; иконка корзины — удалить'));

children.push(Pheading('Автоподтягивание мероприятий с IPI (theipi.org)', HeadingLevel.HEADING_2));
children.push(Pnote('Пока не настроено. На roadmap — автоматический ежедневный скрапер событий с theipi.org. После запуска: события Master Speaker Series, Weekend Conferences, Special Topics будут появляться сами раз в сутки. Скажи «настроить IPI-скрапер» — добавлю.'));
children.push(P('Сейчас создавать события можно только вручную через админку. Это занимает 1 минуту на событие.'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// 2. Новости
children.push(Pheading('2. Новости (News)', HeadingLevel.HEADING_1));

children.push(Pheading('Как опубликовать пост', HeadingLevel.HEADING_2));
children.push(Pnumber('Открой админку: https://intpas.com/admin'));
children.push(Pnumber('Вкладка «News»'));
children.push(Pnumber('Нажми «New post»'));
children.push(Pnumber('Заполни поля:'));
children.push(Pbullet('Slug — короткий идентификатор латиницей через дефис (например, april-conference-recap). Это часть URL', 1));
children.push(Pbullet('Title — заголовок', 1));
children.push(Pbullet('Category — News / Announcements / Press / Research', 1));
children.push(Pbullet('Excerpt — короткий тизер для списка новостей (1–2 предложения)', 1));
children.push(Pbullet('Content — полный текст. Поддерживаются HTML-теги и упрощённый Markdown: **жирный**, *курсив*, заголовки # ## ###, ссылки [текст](url)', 1));
children.push(Pbullet('Published — галочка «опубликовать». Без неё пост сохранится как черновик и не покажется на сайте', 1));
children.push(Pnumber('Save — пост сразу появляется на https://intpas.com/news/<slug>'));

children.push(Pheading('Редактирование и удаление', HeadingLevel.HEADING_2));
children.push(P('Админка → News → Edit / иконка корзины. Изменения видны сразу, без пересборки сайта.'));

children.push(Pheading('Автоподтягивание новостей с IPI', HeadingLevel.HEADING_2));
children.push(Pnote('Пока не настроено. На roadmap — RSS-feed с theipi.org/blog → автоматический импорт постов как «category: IPI». После запуска появятся около 50 архивных постов и далее раз в сутки новые.'));
children.push(P('Сейчас новости публикуем вручную через админку.'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// 3. Курсы
children.push(Pheading('3. Курсы (Programs)', HeadingLevel.HEADING_1));

children.push(P('У IPAS 13 учебных программ. Они описаны подробно (около 2 страниц текста на каждую) и НЕ редактируются через админку — они задаются в коде сайта (файл data/programs.ts).'));
children.push(P('Чтобы добавить или серьёзно изменить программу — пишешь мне, я обновлю код и пересоберу сайт. Мелкие правки текста (опечатка, изменение часов) тоже через меня — это занимает 10 минут.'));

children.push(Pheading('Как найти нужную программу на сайте', HeadingLevel.HEADING_2));
children.push(Pnumber('Открой https://intpas.com/programs'));
children.push(Pnumber('Видишь список из 13 карточек, у каждой название, длительность, краткое описание'));
children.push(Pnumber('Кликаешь карточку → попадаешь на детальную страницу (например /programs/clinical-psychotherapy)'));

children.push(Pheading('Прямые ссылки на все 13 программ', HeadingLevel.HEADING_2));

const programs = [
  ['Clinical Psychotherapy', '/programs/clinical-psychotherapy'],
  ['Clinical Psychology and Psychotherapy', '/programs/clinical-psychology-and-psychotherapy'],
  ['Child Psychology', '/programs/child-psychology'],
  ['Clinical Child and Adolescent Psychology', '/programs/clinical-child-and-adolescent-psychology'],
  ['Cognitive Behavioural Therapy', '/programs/cognitive-behavioural-therapy'],
  ['Applied Behavior Analysis', '/programs/applied-behavior-analysis'],
  ['Couples Counselling in Family Therapy', '/programs/couples-counselling-in-family-therapy'],
  ['Object Relations Theory and Practice', '/programs/object-relations-theory-and-practice'],
  ['Psychoanalytic Couple Therapy', '/programs/psychoanalytic-couple-therapy'],
  ['Infant Observation', '/programs/infant-observation'],
  ['Psychoanalytic Psychotherapy Consultation', '/programs/psychoanalytic-psychotherapy-consultation'],
  ['Master Speaker Series', '/programs/master-speaker-series'],
];

programs.forEach(([name, url], i) => {
  children.push(new Paragraph({
    children: [
      new TextRun({ text: `${i + 1}. ${name}: `, bold: true, font: 'Arial' }),
      new TextRun({ text: `intpas.com${url}`, font: 'Consolas', size: 20 }),
    ],
    spacing: { after: 60 },
  }));
});

children.push(Pheading('Как сослаться на программу из статьи или письма', HeadingLevel.HEADING_2));
children.push(P('Просто бери URL из таблицы выше и вставляй ссылку. Эти страницы стабильны, slug не меняется.'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// 4. Сертификаты
children.push(Pheading('4. Сертификаты', HeadingLevel.HEADING_1));

children.push(P('Сертификаты — главный рабочий процесс IPAS. Логика такая же, как была в старой системе: один студент = один код = одна публичная страница. У одного студента может быть несколько курсов — все на одной странице.'));

children.push(Pheading('Шаг 1. Заполнить строку в Google-таблице', HeadingLevel.HEADING_2));
children.push(Pnumber('Открой Google Sheet «IPAS Database»'));
children.push(Pnumber('Перейди на лист «certificates» (вкладки внизу)'));
children.push(Pnumber('Добавь новую строку (или заполни пустую). Обязательные колонки:'));

const certCols = [
  ['id', 'Цифровой код студента без ведущего нуля. Например: 32513617'],
  ['display_id', 'Тот же код но с ведущим нулём для печати. Например: 032513617'],
  ['full_name', 'Полное имя: Aybeniz Hasanova'],
  ['first_name', 'Имя: Aybeniz'],
  ['last_name', 'Фамилия: Hasanova'],
  ['email', 'Адрес для отправки PDF (если оставить пустым — письмо не уйдёт)'],
  ['program', 'Название программы: Clinical Psychotherapy'],
  ['module', 'Модуль (необязательно)'],
  ['hours', 'Часы курса: 200'],
  ['issue_date', 'Дата выдачи в формате YYYY-MM-DD: 2026-04-25'],
  ['issued_by', 'IPAS / IPI'],
  ['status', 'valid (или revoked если отзываешь)'],
  ['teacher', 'Имя преподавателя (необязательно)'],
  ['language', 'Язык обучения (необязательно)'],
];

certCols.forEach(([col, desc]) => {
  children.push(new Paragraph({
    children: [
      new TextRun({ text: '• ' + col + ' — ', bold: true, font: 'Arial' }),
      new TextRun({ text: desc, font: 'Arial' }),
    ],
    spacing: { after: 60 },
    indent: { left: 360 },
  }));
});

children.push(Pnote('Если у студента несколько курсов — заполняешь несколько строк. У всех ОДИНАКОВЫЕ id и display_id. Меняются только program, hours, issue_date, teacher, module. На сайте все курсы видны на одной странице студента.'));

children.push(Pheading('Шаг 2. Сгенерировать и отправить сертификат', HeadingLevel.HEADING_2));
children.push(Pnumber('Поставь курсор на нужную строку в листе certificates'));
children.push(Pnumber('Сверху меню «IPAS» → «Send certificate (selected row)»'));
children.push(Pnumber('Скрипт автоматически:'));
children.push(Pbullet('Берёт твой Google Slides шаблон с дизайном из Corel', 1));
children.push(Pbullet('Подставляет в плейсхолдеры данные из строки: {{full_name}}, {{program}}, {{hours}}, {{issue_date}}, {{display_id}}, {{teacher}}', 1));
children.push(Pbullet('Сохраняет результат в PDF', 1));
children.push(Pbullet('Отправляет email студенту с PDF во вложении', 1));
children.push(Pbullet('Помечает в таблице emailed_at — текущая дата (чтобы случайно не отправить повторно)', 1));
children.push(Pbullet('Тебе на BCC приходит копия письма', 1));

children.push(Pheading('Шаг 3. (опционально) Дождаться появления страницы на сайте', HeadingLevel.HEADING_2));
children.push(P('Чтобы публичная страница intpas.com/032513617 заработала, сайт должен пересобраться. Варианты:'));
children.push(Pbullet('Авто: каждую ночь в 06:00 (Баку) пересборка идёт сама'));
children.push(Pbullet('Вручную: меню «IPAS» → «Rebuild website (apply new certificates)» — займёт 2 минуты'));

children.push(Pheading('Тест-режим — все письма идут только тебе', HeadingLevel.HEADING_2));
children.push(P('Чтобы потренироваться без риска разослать кому-то лишнего:'));
children.push(Pnumber('Apps Script → ⚙️ Project Settings → Script Properties'));
children.push(Pnumber('Свойство TEST_MODE = true'));
children.push(Pnumber('Свойство BCC = твой email'));
children.push(P('Теперь все «Send certificate» идут только тебе с темой [TEST]. Чтобы выключить — TEST_MODE = false (или удалить свойство).'));

children.push(Pheading('Полезные действия из меню IPAS в Google Sheets', HeadingLevel.HEADING_2));
children.push(Pkey('Send certificate (selected row)', 'Отправить выбранную строку'));
children.push(Pkey('Resend certificate (selected row)', 'Переотправить (если письмо не дошло)'));
children.push(Pkey('Send ALL pending', 'Массовая рассылка всем у кого status=valid и emailed_at пуст'));
children.push(Pkey('Rebuild website', 'Принудительно пересобрать сайт сейчас'));

children.push(Pheading('Редактирование данных существующего сертификата', HeadingLevel.HEADING_2));
children.push(Pnumber('Просто исправь нужную ячейку прямо в таблице (Sheets) — изменения видны на сайте моментально, без пересборки'));
children.push(Pnumber('Альтернатива: админка /admin → Certificates → Edit'));

children.push(Pheading('Отзыв сертификата', HeadingLevel.HEADING_2));
children.push(Pnumber('В таблице меняешь status с «valid» на «revoked»'));
children.push(Pnumber('На странице студента сертификат сразу помечается красным «revoked»'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// 5. Проверка
children.push(Pheading('5. Проверка сертификата', HeadingLevel.HEADING_1));

children.push(P('Любой человек может проверить подлинность сертификата IPAS — для этого не нужны логины, регистрации или мобильные приложения. Достаточно знать код студента (он напечатан на бумажном сертификате).'));

children.push(Pheading('Способ 1. QR-код на бумажном сертификате', HeadingLevel.HEADING_2));
children.push(Pnumber('Любой смартфон → встроенная камера → навести на QR-код'));
children.push(Pnumber('Появится ссылка вида intpas.com/032513617'));
children.push(Pnumber('Тап → открывается официальная страница студента с его именем, программой, часами, преподавателем, датой выдачи и статусом'));

children.push(Pheading('Способ 2. Прямой URL', HeadingLevel.HEADING_2));
children.push(P('В адресной строке набираешь:'));
children.push(Pmono('intpas.com/032513617'));
children.push(P('Работает любая форма кода — с ведущим нулём (032513617) и без (32513617). Старые ссылки со старого сайта продолжают работать благодаря backward-compatibility-редиректам.'));

children.push(Pheading('Способ 3. Поиск на главной странице', HeadingLevel.HEADING_2));
children.push(Pnumber('Открыть https://intpas.com'));
children.push(Pnumber('В блоке «Verify a Certificate» в строку вводишь код студента ИЛИ имя'));
children.push(Pnumber('По мере набора показываются совпадения — кликаешь нужное'));

children.push(Pheading('Что показывает страница студента', HeadingLevel.HEADING_2));
children.push(Pbullet('Полное имя'));
children.push(Pbullet('Код студента (display_id)'));
children.push(Pbullet('Бейдж статуса: ✓ Verified (зелёный) или ✗ revoked (красный)'));
children.push(Pbullet('Сводка: количество программ, общая сумма часов, дата последнего сертификата'));
children.push(Pbullet('Список всех сертификатов студента — каждый с программой, часами, датой, преподавателем'));
children.push(Pbullet('QR-код для повторной проверки (можно распечатать)'));
children.push(Pbullet('Ссылку на каждый отдельный сертификат с его персональной страницей'));

children.push(Pheading('Что фиксируется при каждой проверке', HeadingLevel.HEADING_2));
children.push(P('Каждый просмотр страницы автоматически записывается в скрытый лист access_log в Google-таблице:'));
children.push(Pbullet('cert_id — какой сертификат проверяли'));
children.push(Pbullet('ref — откуда пришли (Google, бумажный QR, прямая ссылка)'));
children.push(Pbullet('ua — браузер / устройство'));
children.push(Pbullet('at — точное время'));
children.push(P('Это даёт тебе аналитику: сколько раз проверяли каждый сертификат, какие самые востребованные.'));

children.push(new Paragraph({ children: [new PageBreak()] }));

// Контакты на проблемы
children.push(Pheading('Если что-то сломалось', HeadingLevel.HEADING_1));
children.push(P('1. Открой Apps Script → слева 🕒 Executions — там видны логи всех запусков с ошибками'));
children.push(P('2. Сделай скриншот красной строки и пришли мне'));
children.push(P('3. Если сайт не открывается совсем — проверь https://github.com/kentavr34/ipas-site/actions — последний run должен быть зелёный'));

children.push(new Paragraph({
  alignment: AlignmentType.CENTER,
  children: [new TextRun({ text: '— конец инструкции —', font: 'Arial', italics: true, color: '888888' })],
  spacing: { before: 480 },
}));

// ─── Документ ─────────────────────────────────────────────────────
const doc = new Document({
  creator: 'IPAS',
  title: 'Инструкция по управлению сайтом IPAS',
  styles: {
    default: { document: { run: { font: 'Arial', size: 22 } } },
    paragraphStyles: [
      { id: 'Heading1', name: 'Heading 1', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 36, bold: true, font: 'Arial', color: '1F4A3E' },
        paragraph: { spacing: { before: 360, after: 200 }, outlineLevel: 0 } },
      { id: 'Heading2', name: 'Heading 2', basedOn: 'Normal', next: 'Normal', quickFormat: true,
        run: { size: 28, bold: true, font: 'Arial', color: 'B8912A' },
        paragraph: { spacing: { before: 240, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: 'bullets',
        levels: [
          { level: 0, format: LevelFormat.BULLET, text: '•', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 720, hanging: 360 } } } },
          { level: 1, format: LevelFormat.BULLET, text: '◦', alignment: AlignmentType.LEFT,
            style: { paragraph: { indent: { left: 1080, hanging: 360 } } } },
        ] },
      { reference: 'numbers',
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: '%1.', alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11906, height: 16838 }, // A4
        margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
      },
    },
    children,
  }],
});

const out = path.join(__dirname, '..', 'Инструкция-IPAS.docx');
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(out, buf);
  console.log('Saved:', out, '(' + buf.length + ' bytes)');
});
