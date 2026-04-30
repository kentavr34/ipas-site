/**
 * FakeSeed.gs — генерация 3000 фейковых сертификатов в лист `certificates`.
 *
 * Распределение по странам:
 *   60% США, 10% UK, 7.5% Германия, 7.5% Франция, 5% Канада,
 *   3% Австралия, 2% Япония, 3% другие страны Европы,
 *   1% Россия, 1% Украина.
 *
 * Использование:
 *   1. Поставь TEST_MODE=true в Script Properties (опционально)
 *   2. Запусти функцию seedFakeCerts() один раз из редактора
 *   3. Подожди ~30-60 секунд — добавятся 3000 строк
 *   4. Меню IPAS → Rebuild website (чтобы профили появились на сайте)
 *
 * ОПАСНО: запускать только один раз. Повторный запуск создаст ещё 3000.
 */

function seedFakeCerts() {
  const TARGET = 3000;
  const sh = SpreadsheetApp.openById(
    PropertiesService.getScriptProperties().getProperty('SHEET_ID')
  ).getSheetByName('certificates');

  const headers = sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];

  // Найдём максимальный численный ID, чтобы новые шли с +1
  let maxId = 32513700;
  if (sh.getLastRow() > 1) {
    const ids = sh.getRange(2, headers.indexOf('id') + 1, sh.getLastRow() - 1, 1).getValues();
    ids.forEach(r => {
      const n = parseInt(String(r[0]).replace(/\D/g, ''), 10);
      if (!isNaN(n) && n > maxId) maxId = n;
    });
  }

  const now = new Date();
  const rows = [];
  for (let i = 0; i < TARGET; i++) {
    const country = pickCountry_();
    const [first, last] = pickName_(country);
    const fullName = first + ' ' + last;
    const program = pickProgram_();
    const hours = pickHours_();
    const issueDate = pickDate_();
    maxId += 1;
    const idNum = maxId;
    const displayId = String(idNum).padStart(9, '0'); // 032513701

    const row = {
      id: idNum,
      display_id: displayId,
      student_code: '',
      full_name: fullName,
      first_name: first,
      last_name: last,
      email: '',
      program: program.title,
      module: '',
      hours: hours,
      courses_count: 1,
      courses_raw: program.title + ' (' + hours + ' hours)',
      issue_date: issueDate,
      issued_by: 'IPAS / IPI',
      status: 'valid',
      membership_type: '',
      valid_period: '',
      language: 'English',
      director: 'Robin Mackay',
      teacher: pickTeacher_(country),
      source_url: '',
      created_at: now,
      emailed_at: '',
    };
    rows.push(headers.map(h => row[h] !== undefined ? row[h] : ''));
  }

  // Пишем большой блок одним вызовом — намного быстрее appendRow в цикле
  const startRow = sh.getLastRow() + 1;
  sh.getRange(startRow, 1, rows.length, headers.length).setValues(rows);

  Logger.log('Seeded ' + rows.length + ' fake certificates. Last ID = ' + maxId);
  return { added: rows.length, last_id: maxId };
}

// ─────────────────────────────────────────────────────────────────
//  Распределение стран
// ─────────────────────────────────────────────────────────────────
function pickCountry_() {
  const r = Math.random() * 100;
  if (r < 60)   return 'US';
  if (r < 70)   return 'UK';
  if (r < 77.5) return 'DE';
  if (r < 85)   return 'FR';
  if (r < 90)   return 'CA';
  if (r < 93)   return 'AU';
  if (r < 95)   return 'JP';
  if (r < 98)   return 'EU';   // прочая Европа: IT/ES/PL/NL и т.д.
  if (r < 99)   return 'RU';
  return 'UA';
}

// ─────────────────────────────────────────────────────────────────
//  Имена по странам — реалистичные пулы
// ─────────────────────────────────────────────────────────────────
const NAMES_US = {
  first: ['James','John','Robert','Michael','William','David','Richard','Joseph','Thomas','Charles',
          'Christopher','Daniel','Matthew','Anthony','Mark','Donald','Steven','Andrew','Paul','Joshua',
          'Mary','Patricia','Jennifer','Linda','Elizabeth','Barbara','Susan','Jessica','Sarah','Karen',
          'Lisa','Nancy','Betty','Sandra','Margaret','Ashley','Kimberly','Emily','Donna','Michelle',
          'Carol','Amanda','Melissa','Deborah','Stephanie','Rebecca','Laura','Sharon','Cynthia','Kathleen'],
  last:  ['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez',
          'Hernandez','Lopez','Gonzalez','Wilson','Anderson','Thomas','Taylor','Moore','Jackson','Martin',
          'Lee','Perez','Thompson','White','Harris','Sanchez','Clark','Ramirez','Lewis','Robinson',
          'Walker','Young','Allen','King','Wright','Scott','Torres','Nguyen','Hill','Flores',
          'Green','Adams','Nelson','Baker','Hall','Rivera','Campbell','Mitchell','Carter','Roberts'],
};
const NAMES_UK = {
  first: ['Oliver','George','Harry','Noah','Jack','Charlie','Leo','Jacob','Freddie','Alfie',
          'Olivia','Amelia','Isla','Ava','Mia','Isabella','Sophia','Lily','Grace','Charlotte',
          'James','William','Henry','Thomas','Joshua','Edward','Daniel','Samuel','Benjamin','Joseph',
          'Emily','Eliza','Hannah','Florence','Ella','Poppy','Phoebe','Alice','Sienna','Ruby'],
  last:  ['Smith','Jones','Williams','Brown','Taylor','Davies','Wilson','Evans','Thomas','Roberts',
          'Johnson','Walker','Wright','Robinson','Thompson','White','Hughes','Edwards','Green','Hall',
          'Wood','Harris','Lewis','Martin','Jackson','Clarke','Clark','Turner','Hill','Scott',
          'Cooper','Morris','Ward','Watson','King','Baker','Harrison','Morgan','Patel','Young'],
};
const NAMES_DE = {
  first: ['Maximilian','Alexander','Paul','Leon','Felix','Lukas','Jonas','Elias','Noah','Ben',
          'Mia','Emilia','Sophia','Hannah','Emma','Lina','Ella','Mila','Lea','Anna',
          'Finn','Luca','Tim','Max','Niklas','David','Julian','Moritz','Tobias','Jan',
          'Marie','Lena','Sara','Lara','Laura','Greta','Ida','Klara','Theresa','Charlotte'],
  last:  ['Müller','Schmidt','Schneider','Fischer','Weber','Meyer','Wagner','Becker','Schulz','Hoffmann',
          'Schäfer','Koch','Bauer','Richter','Klein','Wolf','Schröder','Neumann','Schwarz','Zimmermann',
          'Braun','Krüger','Hofmann','Hartmann','Lange','Schmitt','Werner','Schmitz','Krause','Meier',
          'Lehmann','Schmid','Schulze','Maier','Köhler','Herrmann','König','Walter','Mayer','Huber'],
};
const NAMES_FR = {
  first: ['Lucas','Hugo','Léo','Gabriel','Arthur','Louis','Raphaël','Jules','Adam','Maël',
          'Emma','Jade','Louise','Alice','Chloé','Lina','Léa','Manon','Camille','Sarah',
          'Antoine','Nicolas','Thomas','Maxime','Pierre','Alexandre','Benjamin','Romain','Paul','Mathieu',
          'Marie','Sophie','Julie','Anne','Claire','Charlotte','Pauline','Laura','Émilie','Margaux'],
  last:  ['Martin','Bernard','Dubois','Thomas','Robert','Richard','Petit','Durand','Leroy','Moreau',
          'Simon','Laurent','Lefebvre','Michel','Garcia','David','Bertrand','Roux','Vincent','Fournier',
          'Morel','Girard','André','Lefèvre','Mercier','Dupont','Lambert','Bonnet','François','Martinez',
          'Legrand','Garnier','Faure','Rousseau','Blanc','Guérin','Muller','Henry','Roussel','Nicolas'],
};
const NAMES_CA = {
  first: ['Liam','Noah','Oliver','William','Benjamin','Lucas','Henry','Jacob','Ethan','Logan',
          'Olivia','Charlotte','Emma','Amelia','Sophia','Ava','Mia','Harper','Evelyn','Abigail',
          'Pierre','Antoine','Mathieu','Olivier','Sébastien','Étienne','Vincent','Julien','Maxime','Nicolas',
          'Marie','Sophie','Camille','Émilie','Julie','Catherine','Isabelle','Geneviève','Mélanie','Stéphanie'],
  last:  ['Smith','Brown','Tremblay','Martin','Roy','Wilson','MacDonald','Gagnon','Johnson','Lee',
          'Taylor','Anderson','Williams','Côté','Gauthier','Morin','Lavoie','Bouchard','Bergeron','Pelletier',
          'Patel','Singh','Wong','Chen','Nguyen','Khan','Ahmed','Lopez','Garcia','Martinez'],
};
const NAMES_AU = {
  first: ['Oliver','William','Jack','Noah','Lucas','Henry','Thomas','Charlie','James','Liam',
          'Charlotte','Olivia','Amelia','Mia','Ava','Isla','Grace','Chloe','Sophie','Zoe',
          'Ethan','Cooper','Mason','Hunter','Lachlan','Riley','Connor','Tyler','Jackson','Bailey'],
  last:  ['Smith','Jones','Williams','Brown','Wilson','Taylor','Johnson','White','Martin','Anderson',
          'Thompson','Nguyen','Walker','Harris','Robinson','Lee','Clark','Lewis','Young','King',
          'Wright','Scott','Green','Adams','Baker','Mitchell','Campbell','Roberts','Patel','Hill'],
};
const NAMES_JP = {
  first: ['Hiroshi','Takeshi','Yuki','Haruki','Kenji','Akira','Daisuke','Ryo','Sho','Takumi',
          'Hana','Yui','Sakura','Aiko','Yuna','Mei','Hinata','Kotone','Akari','Rina',
          'Kazuki','Tsubasa','Sota','Hayato','Yuto','Yusuke','Naoto','Riku','Kaito','Ren'],
  last:  ['Sato','Suzuki','Takahashi','Tanaka','Watanabe','Ito','Yamamoto','Nakamura','Kobayashi','Kato',
          'Yoshida','Yamada','Sasaki','Matsumoto','Inoue','Kimura','Hayashi','Shimizu','Yamaguchi','Mori',
          'Abe','Ikeda','Hashimoto','Yamazaki','Ishikawa','Nakajima','Maeda','Fujita','Ogawa','Goto'],
};
const NAMES_EU = {
  first: ['Marco','Giulia','Luca','Sofia','Matteo','Aurora','Leonardo','Alice','Giuseppe','Anna',
          'Pablo','María','Diego','Lucía','Javier','Carmen','Antonio','Isabel','Manuel','Elena',
          'Jakub','Anna','Mateusz','Maria','Wojciech','Katarzyna','Piotr','Magdalena','Tomasz','Małgorzata',
          'Daan','Sophie','Sem','Emma','Lucas','Anna','Liam','Julia','Noah','Saar'],
  last:  ['Rossi','Bianchi','Romano','Colombo','Ricci','Bruno','Greco','Conti','Russo','Esposito',
          'García','Rodríguez','González','Fernández','López','Martínez','Pérez','Sánchez','Ramírez','Cruz',
          'Nowak','Kowalski','Wiśniewski','Wójcik','Kamiński','Lewandowski','Zieliński','Szymański','Kozłowski','Jankowski',
          'De Vries','Jansen','De Boer','Visser','Smit','Bakker','Janssen','Mulder','De Groot','Bos'],
};
const NAMES_RU = {
  first: ['Aleksandr','Sergey','Dmitriy','Andrey','Mikhail','Aleksey','Maksim','Ivan','Nikolay','Yuriy',
          'Anna','Maria','Elena','Olga','Tatiana','Natalia','Ekaterina','Svetlana','Irina','Yulia',
          'Pavel','Vladimir','Roman','Anton','Egor','Kirill','Denis','Artem','Igor','Vasily'],
  last:  ['Ivanov','Smirnov','Kuznetsov','Popov','Vasiliev','Petrov','Sokolov','Mikhailov','Novikov','Fedorov',
          'Morozov','Volkov','Alekseev','Lebedev','Semenov','Egorov','Pavlov','Kozlov','Stepanov','Nikolaev',
          'Orlov','Andreev','Makarov','Nikitin','Zaharov','Zaytsev','Soloviev','Borisov','Yakovlev','Grigoriev'],
};
const NAMES_UA = {
  first: ['Oleksandr','Andriy','Dmytro','Mykola','Serhiy','Oleksiy','Maksym','Ivan','Petro','Volodymyr',
          'Olena','Iryna','Tetiana','Natalia','Maria','Anna','Kateryna','Yulia','Svitlana','Halyna',
          'Bohdan','Yaroslav','Roman','Taras','Oleh','Ihor','Vasyl','Yuriy','Vitaliy','Ruslan'],
  last:  ['Melnyk','Shevchenko','Boyko','Koval','Bondarenko','Tkachenko','Kovalenko','Kravchenko','Oliynyk','Shevchuk',
          'Polishchuk','Bondar','Tkachuk','Marchenko','Lysenko','Rudenko','Mazur','Savchenko','Kostenko','Pavlenko',
          'Hrytsenko','Sydorenko','Demchenko','Kuzmenko','Klymenko','Kobyliansky','Yatsenko','Ivanchuk','Karpenko','Pidhirny'],
};

function pickName_(country) {
  const pool = {
    'US': NAMES_US, 'UK': NAMES_UK, 'DE': NAMES_DE, 'FR': NAMES_FR,
    'CA': NAMES_CA, 'AU': NAMES_AU, 'JP': NAMES_JP, 'EU': NAMES_EU,
    'RU': NAMES_RU, 'UA': NAMES_UA,
  }[country] || NAMES_US;
  const first = pool.first[Math.floor(Math.random() * pool.first.length)];
  const last  = pool.last[Math.floor(Math.random() * pool.last.length)];
  return [first, last];
}

// ─────────────────────────────────────────────────────────────────
//  Программы IPAS — те же что в data/programs.ts на сайте
// ─────────────────────────────────────────────────────────────────
const PROGRAMS = [
  { title: 'Clinical Psychotherapy', weight: 18 },
  { title: 'Clinical Psychology and Psychotherapy', weight: 14 },
  { title: 'Child Psychology', weight: 10 },
  { title: 'Cognitive Behavioural Therapy', weight: 12 },
  { title: 'Applied Behavior Analysis', weight: 6 },
  { title: 'Couples Counselling in Family Therapy', weight: 8 },
  { title: 'Object Relations Theory and Practice', weight: 6 },
  { title: 'Psychoanalytic Couple Therapy', weight: 5 },
  { title: 'Infant Observation', weight: 4 },
  { title: 'Psychoanalytic Psychotherapy Consultation', weight: 5 },
  { title: 'Master Speaker Series', weight: 4 },
  { title: 'Clinical Child and Adolescent Psychology', weight: 8 },
];

const PROGRAM_TOTAL = PROGRAMS.reduce((s, p) => s + p.weight, 0);

function pickProgram_() {
  let r = Math.random() * PROGRAM_TOTAL;
  for (const p of PROGRAMS) {
    r -= p.weight;
    if (r <= 0) return p;
  }
  return PROGRAMS[0];
}

// ─────────────────────────────────────────────────────────────────
//  Часы — типичное распределение для IPAS-сертификатов
// ─────────────────────────────────────────────────────────────────
function pickHours_() {
  const r = Math.random() * 100;
  if (r < 35) return 200;   // основной курс
  if (r < 60) return 72;    // короткий
  if (r < 80) return 36;    // мини-курс
  if (r < 92) return 100;   // средний
  if (r < 97) return 730;   // полная клиническая программа
  return 150;
}

// ─────────────────────────────────────────────────────────────────
//  Дата выдачи — взвешенное распределение по периодам:
//    70% — 2012-2019 (исторический корпус)
//    20% — 2020-2024 (недавние)
//    10% — 2025-2026 (свежие)
// ─────────────────────────────────────────────────────────────────
function pickDate_() {
  const r = Math.random() * 100;
  let start, end;
  if (r < 70) {
    start = new Date(2012, 0, 1).getTime();
    end   = new Date(2020, 0, 1).getTime() - 1;
  } else if (r < 90) {
    start = new Date(2020, 0, 1).getTime();
    end   = new Date(2025, 0, 1).getTime() - 1;
  } else {
    start = new Date(2025, 0, 1).getTime();
    end   = new Date(2026, 3, 25).getTime();
  }
  return new Date(start + Math.random() * (end - start));
}

// ─────────────────────────────────────────────────────────────────
//  Преподаватели — пул реалистичных имён
// ─────────────────────────────────────────────────────────────────
const TEACHERS = [
  'Robin Mackay','Jill Savege Scharff','David E. Scharff','Alan Sugarman',
  'Kerry Kelly Novick','Jack Novick','David Tuckett','Anne Alvarez',
  'Stephen Seligman','Glen Gabbard','Otto Kernberg','Nancy McWilliams',
  'Jay Greenberg','Stephen Mitchell','Lewis Aron','Donna Orange',
  'Samira Rustamova','Kenan Rahimov','Aybeniz Hasanova','Patrick Casement',
  'Christopher Bollas','Thomas Ogden','Antonino Ferro','James Grotstein',
];
function pickTeacher_(country) {
  return TEACHERS[Math.floor(Math.random() * TEACHERS.length)];
}
