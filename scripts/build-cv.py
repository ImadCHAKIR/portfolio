"""Create the three two-page CVs from the portfolio's shared, verified content.

Dependencies: reportlab, pypdf, arabic-reshaper, python-bidi.
Use --font-dir for a folder containing arial.ttf and arialbd.ttf.
"""
from pathlib import Path
import argparse
import json
import re
import shutil
import sys

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'tmp/pdf-deps'))
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfdoc import PDFString
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from pypdf import PdfReader
import arabic_reshaper
from bidi.algorithm import get_display

parser = argparse.ArgumentParser()
parser.add_argument('--font-dir', default='C:/Windows/Fonts')
args = parser.parse_args()
for name, filename in [('Body', 'arial.ttf'), ('Bold', 'arialbd.ttf')]:
    pdfmetrics.registerFont(TTFont(name, str(Path(args.font_dir) / filename)))

DATA = json.loads((ROOT / 'content/portfolio.json').read_text(encoding='utf-8'))
OUT = ROOT / 'output/pdf'
WEB = ROOT / 'assets/cv'
OUT.mkdir(parents=True, exist_ok=True)
WEB.mkdir(parents=True, exist_ok=True)
W, H = A4
MARGIN = 44
WIDTH = W - 2 * MARGIN
INK = HexColor('#193348')
MUTED = HexColor('#536473')
ACCENT = HexColor('#245f76')


def clean(text):
    return str(text).replace('–', '-').replace('—', '-').replace('\u2011', '-')


def visual(text, rtl=False):
    if not rtl:
        return clean(text)
    # Keep technical tokens (C#, .NET, MP*) and numeric ranges left-to-right.
    def ltr_run(match):
        token = match.group().rstrip(' .')
        return '\u202a' + token + '\u202c' + match.group()[len(token):]
    logical = re.sub(r'\(?[A-Za-z0-9.][A-Za-z0-9 .#/+*_()_-]*', ltr_run, clean(text))
    return get_display(arabic_reshaper.reshape(logical), base_dir='R')


class CV:
    def __init__(self, lang):
        self.lang = lang
        self.data = DATA[lang]
        self.rtl = lang == 'ar'
        self.path = OUT / f'Imad-Chakir-CV-{lang.upper()}.pdf'
        self.pdf = canvas.Canvas(str(self.path), pagesize=A4, pageCompression=1)
        self.pdf.setTitle(f'Imad Chakir - {self.data["title"]}')
        self.pdf.setAuthor('Imad Chakir')
        self.pdf.setSubject(self.data['ui']['cvRole'])
        self.pdf.setCreator('Imad Chakir Portfolio')
        self.pdf._doc.Catalog.Lang = PDFString(lang)
        self.y = H - MARGIN
        self.minimum = []
        self.font_size = 11.5 if self.rtl else 10
        self.leading = 17 if self.rtl else 13.5

    def line(self, text, x=MARGIN, width=WIDTH, size=None, font='Body', color=INK, rtl=None, url=None):
        rtl = self.rtl if rtl is None else rtl
        size = size or self.font_size
        logical = clean(text)
        self.pdf.setFillColor(color)
        self.pdf.setFont(font, size)
        # ActualText preserves the original Unicode content for copy/paste while
        # presentation glyphs provide reliable Arabic shaping in PDF viewers.
        encoded = ('\ufeff' + logical).encode('utf-16-be').hex().upper()
        self.pdf._code.append(f'/Span << /ActualText <{encoded}> >> BDC')
        if rtl:
            self.pdf.drawRightString(x + width, self.y, visual(logical, True))
        else:
            self.pdf.drawString(x, self.y, logical)
        self.pdf._code.append('EMC')
        if url:
            self.pdf.linkURL(url, (x, self.y - 3, x + width, self.y + size), relative=0, thickness=0)

    def wrap(self, text, width, size, font='Body', rtl=None):
        rtl = self.rtl if rtl is None else rtl
        lines, current = [], ''
        for word in clean(text).split():
            trial = f'{current} {word}'.strip()
            if pdfmetrics.stringWidth(visual(trial, rtl), font, size) <= width or not current:
                current = trial
            else:
                lines.append(current)
                current = word
        if current:
            lines.append(current)
        # Avoid a final line consisting only of a word or a short technical token.
        if len(lines) > 1:
            previous = lines[-2].split()
            while len(previous) > 3 and pdfmetrics.stringWidth(visual(lines[-1], rtl), font, size) < width * .22:
                lines[-1] = previous.pop() + ' ' + lines[-1]
            lines[-2] = ' '.join(previous)
        return lines

    def paragraph(self, text, size=None, leading=None, font='Body', color=MUTED, indent=0, gap=5, rtl=None):
        size = size or self.font_size
        leading = leading or self.leading
        x = MARGIN if self.rtl else MARGIN + indent
        for line in self.wrap(text, WIDTH - indent, size, font, rtl):
            self.line(line, x=x, width=WIDTH - indent, size=size, font=font, color=color, rtl=rtl)
            self.y -= leading
        self.y -= gap

    def section(self, title):
        self.y -= 10
        self.line(title if self.rtl else title.upper(), size=10.3 if not self.rtl else 12, font='Bold', color=ACCENT)
        self.y -= 22

    def bullet(self, text):
        self.pdf.setFillColor(ACCENT)
        self.pdf.circle(W - MARGIN - 2 if self.rtl else MARGIN + 2, self.y + 3, 1.35, stroke=0, fill=1)
        self.paragraph(text, indent=12, gap=3)

    def header(self, full=True):
        self.line('Imad Chakir', size=29 if full else 18, font='Bold', rtl=False,
                  x=(W - MARGIN - pdfmetrics.stringWidth('Imad Chakir', 'Bold', 29 if full else 18)) if self.rtl else MARGIN)
        self.y -= 25 if full else 21
        self.line(self.data['ui']['cvRole'], size=11 if not self.rtl else 12, color=ACCENT)
        self.y -= 23
        if full:
            self.line(self.data['location'], size=9.2, color=MUTED)
            contact = f'{DATA["contact"]["phone"]}  |  {DATA["contact"]["email"]}'
            contact_width = pdfmetrics.stringWidth(contact, 'Body', 9.2)
            self.line(contact, x=MARGIN if self.rtl else W - MARGIN - contact_width, width=contact_width, size=9.2, color=MUTED, rtl=False)
            self.y -= 17
            linkedin = 'linkedin.com/in/imad-chakir-594895188'
            github = 'github.com/ImadCHAKIR'
            left_x = MARGIN
            self.line(linkedin, x=left_x, width=pdfmetrics.stringWidth(linkedin, 'Body', 8.8), size=8.8, color=ACCENT, rtl=False, url=DATA['contact']['linkedin'])
            right_width = pdfmetrics.stringWidth(github, 'Body', 8.8)
            self.line(github, x=W - MARGIN - right_width, width=right_width, size=8.8, color=ACCENT, rtl=False, url=DATA['contact']['github'])
            self.y -= 22
        else:
            self.y -= 3

    def finish_page(self, number):
        self.minimum.append(round(self.y, 1))
        if self.y < 40:
            raise RuntimeError(f'{self.lang}: page {number} overflows (baseline {self.y:.1f})')
        self.y = 26
        self.line(f'{self.data["ui"]["page"]} {number} / 2', size=8, color=MUTED)
        self.pdf.showPage()
        self.y = H - MARGIN

    def build(self):
        self.header()
        self.section(self.data['ui']['overview'])
        self.paragraph(self.data['summary'], gap=2)
        self.section(self.data['ui']['experience'])
        for item in self.data['experience']:
            self.line(item['company'], size=11.5, font='Bold')
            self.y -= 17
            self.paragraph(item['role'], size=10, leading=13.5, font='Bold', color=ACCENT, gap=2)
            if item['date']:
                self.line(item['date'], size=8.8, color=MUTED)
                self.y -= 15
            for bullet in item['bullets']:
                self.bullet(bullet)
            self.y -= 8
        self.finish_page(1)

        self.header(full=False)
        self.section(self.data['ui']['toolkit'])
        # Compact, aligned skill rows keep the second page readable.
        for skill in self.data['skills']:
            label_width = 160 if self.rtl else 115
            label_size = 10.8 if self.rtl else 9.8
            item_size = 10.1 if self.rtl else 9.8
            row_leading = 14.5 if self.rtl else 13.5
            label_lines = self.wrap(skill['label'], label_width, label_size, 'Bold')
            items_rtl = self.rtl and bool(re.search(r'[\u0600-\u06ff]', skill['items']))
            text_width = WIDTH - label_width - 12
            item_lines = self.wrap(skill['items'], text_width, item_size, rtl=items_rtl)
            old_y = self.y
            for line in label_lines:
                self.line(line, x=W - MARGIN - label_width if self.rtl else MARGIN, width=label_width, size=label_size, font='Bold')
                self.y -= row_leading
            self.y = old_y
            for line in item_lines:
                self.line(line, x=MARGIN if self.rtl else MARGIN + label_width + 12, width=text_width, size=item_size, color=MUTED, rtl=items_rtl)
                self.y -= row_leading
            self.y = old_y - max(len(label_lines), len(item_lines)) * row_leading - 7

        self.section(self.data['ui']['selectedProjects'])
        for item in self.data['projects']:
            self.paragraph(item['name'], size=10.5, leading=14, font='Bold', color=INK, gap=0)
            self.paragraph(item['description'], size=11.3 if self.rtl else 10, leading=16 if self.rtl else 13.6, gap=0)
            self.paragraph(' · '.join(item['tech']), size=8.9, leading=11.9, color=ACCENT, gap=8, rtl=False)

        self.section(self.data['ui']['education'])
        for item in self.data['education']:
            self.paragraph(f'{item["name"]} | {item["date"]}', size=10, leading=14, font='Bold', color=INK, gap=0)
            self.paragraph(f'{item["description"]} {item["location"]}', size=9.3, leading=13, gap=8)

        self.section(self.data['ui']['languages'])
        language_text = '  |  '.join(f'{item["name"]}: {item["level"]}' for item in self.data['languages'])
        self.paragraph(language_text, size=9.4, leading=14, gap=0)
        self.finish_page(2)
        self.pdf.save()
        reader = PdfReader(self.path)
        assert len(reader.pages) == 2
        assert all(len(page.extract_text()) > 800 for page in reader.pages)
        shutil.copyfile(self.path, WEB / self.path.name)
        print(f'{self.path.name}: 2 pages, bottom baselines {self.minimum}, {self.path.stat().st_size} bytes')


for lang in ['en', 'fr', 'ar']:
    CV(lang).build()
