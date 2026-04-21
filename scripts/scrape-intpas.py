"""
IPAS certificate scraper — full version
=======================================
Собирает со старого сайта www.intpas.com все данные сертификатов:
  - ID (из URL)
  - ФИО (из <title>)
  - Тип членства, период действия, курс+часы, язык, директор, преподаватель
    (из rich-text блоков в HTML)
  - URL картинки оригинального сертификата (og:image)

Выход:
  scripts/output/certificates.csv  — готовый для импорта в Google Sheet
  scripts/output/certificate-images/*.png  — скачанные картинки сертификатов
  scripts/output/scrape.log  — лог

Запуск:
  python scripts/scrape-intpas.py
  python scripts/scrape-intpas.py --limit 3        # для теста
  python scripts/scrape-intpas.py --no-images      # без скачивания PNG
"""
import argparse
import csv
import os
import re
import sys
import time
import urllib.request
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
WORK = ROOT / '.scrape-work'
OUT = ROOT / 'scripts' / 'output'
OUT.mkdir(parents=True, exist_ok=True)
(OUT / 'certificate-images').mkdir(parents=True, exist_ok=True)

SITEMAP_URL = 'https://www.intpas.com/pages-sitemap.xml'
UA = 'Mozilla/5.0 (compatible; IPAS-migration/1.0)'
NON_CERT_PATHS = {'', 'about', 'member', '2024-students', 'user/kenan', 'копия-members'}


def fetch(url: str) -> str:
    """GET → text."""
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=20) as r:
        return r.read().decode('utf-8', errors='ignore')


def fetch_binary(url: str) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read()


def get_cert_urls() -> list[str]:
    xml = fetch(SITEMAP_URL)
    urls = re.findall(r'<loc>([^<]+)</loc>', xml)
    certs = []
    for u in urls:
        path = urllib.parse.urlparse(u).path.strip('/')
        if path in NON_CERT_PATHS:
            continue
        certs.append(u)
    return sorted(set(certs))


def extract_title(html: str) -> str:
    m = re.search(r'<title>([^<]+)</title>', html)
    if not m:
        return ''
    title = m.group(1).strip()
    # "Fatima Dadashsoy | IPAS" → "Fatima Dadashsoy"
    title = re.sub(r'\s*\|\s*IPAS\s*$', '', title).strip()
    return title


def extract_og_image(html: str) -> str:
    m = re.search(r'<meta property="og:image" content="([^"]+)"', html)
    return m.group(1) if m else ''


def extract_rich_text(html: str) -> list[str]:
    """Все блоки wixui-rich-text__text в порядке следования."""
    return [m.group(1).strip()
            for m in re.finditer(r'class="wixui-rich-text__text"[^>]*>([^<]+)<', html)
            if m.group(1).strip()]


def parse_cert_page(url: str, html: str) -> dict:
    """Разбирает страницу сертификата в структуру."""
    url_slug = urllib.parse.urlparse(url).path.strip('/')
    full_name = extract_title(html)
    first_name, last_name = '', ''
    if full_name:
        parts = full_name.split()
        first_name = parts[0]
        last_name = ' '.join(parts[1:])

    og_image = extract_og_image(html)
    rich = extract_rich_text(html)

    # У некоторых страниц (13iu21e3az00XX) отображаемый ID отличается от URL.
    # Храним оба: url_slug (id) и display_id.

    FOOTER_TOKENS = {'info@intpas.com', '&copy;2023 by ipas', '©2023 by ipas'}
    LABELS = {'certificate courses:', 'course director', 'teacher',
              'international psychotherapy association'}

    membership = ''
    period = ''
    courses: list[tuple[str, int]] = []  # (название, часы)
    language = ''
    director = ''
    teacher = ''
    display_id = ''

    membership_types = {'community member', 'professional member', 'student member',
                        'associate member', 'honorary member', 'lifetime member'}

    for i, t in enumerate(rich):
        t_lc = t.lower()
        if t == full_name:
            continue
        if t_lc in LABELS or t_lc in FOOTER_TOKENS:
            continue
        # Период действия — берём первый встречный
        if re.fullmatch(r'\d{2}/\d{2}/\d{4}\s*-\s*\d{2}/\d{2}/\d{4}', t):
            if not period:
                period = t
            continue
        # Язык (записываем только первый — остальные обычно идентичны)
        if t_lc.startswith('in ') and 'language' in t_lc:
            if not language:
                language = t
            continue
        # Тип членства
        if t_lc in membership_types:
            membership = t
            continue
        # Отображаемый ID (C012345 или длинная цифровая строка)
        if not display_id and (
            re.fullmatch(r'C?\d{6,}', t) or re.fullmatch(r'[A-Z]?\d{2,}[a-z]\d+[a-z]+\d+', t)
        ):
            display_id = t
            continue
        # Название курса: либо идёт сразу после "Certificate courses:", либо содержит (N hours)
        prev_lc = rich[i - 1].lower() if i > 0 else ''
        is_course_candidate = (
            prev_lc == 'certificate courses:' or
            bool(re.search(r'\((\d+)\s+hours?\)', t, re.I))
        )
        if is_course_candidate:
            hm = re.search(r'\((\d+)\s+hours?\)', t, re.I)
            hours = int(hm.group(1)) if hm else 0
            courses.append((t, hours))
            continue
        # Элемент после "Course Director" → имя директора
        if prev_lc == 'course director' and not director:
            director = t
            continue
        # Элемент после "Teacher" → имя учителя (перезаписываем — у всех курсов
        # обычно один и тот же преподаватель)
        if prev_lc == 'teacher' and not teacher:
            teacher = t
            continue
        # Society Ambasador ... → это тоже директор
        if t.lower().startswith('society amb') and not director:
            director = t
            continue

    # Даты периода → issue_date (берём первую дату)
    issue_date = ''
    if period:
        m = re.match(r'(\d{2})/(\d{2})/(\d{4})', period)
        if m:
            dd, mm, yy = m.groups()
            issue_date = f'{yy}-{mm}-{dd}'

    # Программа = все курсы через ' / ', часы = сумма
    program_names = [
        re.sub(r'\s*\(\d+\s+hours?\)\s*$', '', c, flags=re.I).strip()
        for c, _ in courses
    ]
    program_names = [n for n in program_names if n]  # выкидываем пустые
    program = ' / '.join(dict.fromkeys(program_names))  # dedup с сохранением порядка
    total_hours = sum(h for _, h in courses)
    courses_raw = ' | '.join(c for c, _ in courses)

    return {
        'id': url_slug,
        'display_id': display_id or url_slug,
        'full_name': full_name,
        'first_name': first_name,
        'last_name': last_name,
        'email': '',
        'program': program,
        'module': '',
        'hours': total_hours,
        'courses_count': len(courses),
        'courses_raw': courses_raw,
        'issue_date': issue_date,
        'issued_by': 'IPAS / IPI',
        'status': 'valid',
        'membership_type': membership,
        'valid_period': period,
        'language': language,
        'director': director,
        'teacher': teacher,
        'source_url': url,
    }


def download_image(image_url: str, cert_id: str) -> str:
    if not image_url:
        return ''
    try:
        data = fetch_binary(image_url)
    except Exception as e:
        return f'ERROR: {e}'
    # Берём расширение из URL
    ext = 'png' if '.png' in image_url.lower() else 'jpg'
    out_path = OUT / 'certificate-images' / f'{cert_id}.{ext}'
    out_path.write_bytes(data)
    return str(out_path.name)


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--limit', type=int, default=0, help='ограничить N первыми для теста')
    parser.add_argument('--no-images', action='store_true', help='не скачивать картинки')
    parser.add_argument('--delay', type=float, default=0.6, help='задержка между запросами, сек')
    args = parser.parse_args()

    print('Получаю список URL...')
    urls = get_cert_urls()
    print(f'  найдено страниц-сертификатов: {len(urls)}')
    if args.limit:
        urls = urls[:args.limit]
        print(f'  ограничиваю до: {args.limit}')

    rows = []
    log_lines = []

    for i, url in enumerate(urls, 1):
        cert_id = urllib.parse.urlparse(url).path.strip('/')
        msg = f'[{i}/{len(urls)}] {cert_id}  '
        try:
            html = fetch(url)
            cert = parse_cert_page(url, html)
            if not args.no_images:
                # og:image у всех страниц одинаковый (логотип), поэтому
                # скачиваем один раз через отдельный скрипт, если нужно.
                pass
            rows.append(cert)
            print(msg + f"{cert['full_name']!r:40s}  {cert['program']!r}  {cert['hours']}h")
            log_lines.append(msg + f"OK  {cert['full_name']}  {cert['program']} {cert['hours']}h")
        except Exception as e:
            print(msg + f'ERROR {e}')
            log_lines.append(msg + f'ERROR {e}')
        time.sleep(args.delay)

    # CSV
    if rows:
        csv_path = OUT / 'certificates.csv'
        with open(csv_path, 'w', encoding='utf-8', newline='') as f:
            w = csv.DictWriter(f, fieldnames=list(rows[0].keys()))
            w.writeheader()
            for r in rows:
                w.writerow(r)
        print(f'\nCSV: {csv_path}')

    (OUT / 'scrape.log').write_text('\n'.join(log_lines), encoding='utf-8')
    print(f'Log: {OUT / "scrape.log"}')
    print(f'Всего обработано: {len(rows)} / {len(urls)}')


if __name__ == '__main__':
    main()
