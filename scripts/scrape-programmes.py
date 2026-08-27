import re, html, json, time, urllib.request, os

SP = '/private/tmp/claude-501/-Users-jonashoffmannpetersen/168269c9-bde2-4ef6-ac3a-67f292d698ba/scratchpad/scrape'
BASE = 'https://www.hhs.se'

PROGRAMMES = [
    ('bsc-business-economics',  'BSc Business and Economics',       'Bachelor', '/education/bachelor/business-economics/program-structure/'),
    ('bsc-retail-management',   'BSc Retail Management',            'Bachelor', '/education/bachelor/retail-management/program-structure/'),
    ('msc-avfm',                'MSc Accounting, Valuation and Financial Management', 'Master', '/education/master/accounting-valuation-financial-management/program-structure/'),
    ('msc-business-innovation', 'MSc Business Innovation',          'Master', '/education/master/business-innovation/program-structure/'),
    ('msc-economics',           'MSc Economics',                    'Master', '/education/master/economics/program-structure/'),
    ('msc-finance',             'MSc Finance',                      'Master', '/education/master/finance/program-structure/'),
    ('msc-international-business','MSc International Business',     'Master', '/education/master/international-business/program-structure/'),
    ('msc-public-policy',       'MSc Public Policy',                'Master', '/education/master/public-policy/program-structure/'),
]

def fetch(path):
    cache = os.path.join(SP, path.strip('/').replace('/', '_') + '.html')
    if os.path.exists(cache):
        return open(cache, encoding='utf-8', errors='ignore').read()
    req = urllib.request.Request(BASE + path, headers={'User-Agent': 'Mozilla/5.0'})
    raw = urllib.request.urlopen(req, timeout=30).read().decode('utf-8', 'ignore')
    open(cache, 'w', encoding='utf-8').write(raw)
    time.sleep(1.5)          # be polite
    return raw

def text_of(frag):
    return html.unescape(re.sub(r'<[^>]+>', '', frag)).replace('\xa0', ' ').strip()

def parse(raw):
    """Walk the editorial body in order, tracking the current year and semester."""
    m = re.search(r'<div class="mainBody editorial"[^>]*>(.*?)</div>\s*</div>', raw, re.S)
    body = m.group(1) if m else raw

    out, year, semester = [], None, None
    token = re.compile(r'<h2[^>]*>(.*?)</h2>|<h3[^>]*>(.*?)</h3>|<h4[^>]*>(.*?)</h4>|<li[^>]*>(.*?)</li>', re.S)

    for t in token.finditer(body):
        h2, h3, h4, li = t.groups()
        head = next((x for x in (h2, h3, h4) if x is not None), None)
        if head is not None:
            label = text_of(head)
            if re.match(r'^\s*Year\s', label, re.I):
                year = label
            elif re.search(r'semester|period|term', label, re.I):
                semester = label
            continue
        if li is None or semester is None:
            continue

        raw_li = li
        cid = re.search(r'pcw\.hhs\.se/course/(\d+)', raw_li)
        link = re.search(r'<a[^>]*>(.*?)</a>', raw_li, re.S)
        name = text_of(link.group(1)) if link else text_of(raw_li)
        full = text_of(raw_li)
        ects = re.search(r'([\d]+(?:[.,]\d+)?)\s*ECTS', full)
        name = re.sub(r'\s*\(.*$', '', name).strip()
        if not name:
            continue
        out.append({
            'year': year, 'semester': semester, 'course': name,
            'courseNo': cid.group(1) if cid else None,
            'ects': float(ects.group(1).replace(',', '.')) if ects else None,
            'note': full,
        })
    return out

os.makedirs(SP, exist_ok=True)
result = {}
for key, name, level, path in PROGRAMMES:
    try:
        rows = parse(fetch(path))
    except Exception as e:
        print(f"  !! {name}: {e}")
        continue
    result[key] = {'name': name, 'level': level, 'path': path, 'courses': rows}
    withid = sum(1 for r in rows if r['courseNo'])
    sems = len({r['semester'] for r in rows})
    print(f"  {name:52} {len(rows):3} entries, {withid:3} with course id, {sems} semesters")

json.dump(result, open(os.path.join(SP, 'programmes.json'), 'w'), indent=1)
print("\nwritten:", os.path.join(SP, 'programmes.json'))
