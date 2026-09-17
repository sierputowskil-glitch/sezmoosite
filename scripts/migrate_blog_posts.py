#!/usr/bin/env python3
"""Migrate WordPress blog posts into the static SEZMOO article template."""

from __future__ import annotations

import html
import json
import re
import subprocess
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = Path("/tmp/sezmoo-wp/all_posts.json")
BLOG_ASSETS = ROOT / "assets" / "blog"
INLINE_ASSETS = BLOG_ASSETS / "inline"
BLOG_INDEX = ROOT / "blog" / "index.html"
SITEMAP = ROOT / "sitemap.xml"
TEMPLATE = (ROOT / "artykul" / "index.html").read_text(encoding="utf-8")

# Shared chrome extracted once from the article template.
HEAD_SCRIPTS = """<script>try{var t=localStorage.getItem('sezmoo-theme');if(t)document.documentElement.setAttribute('data-theme',t);}catch(e){}</script>"""
THEME_SCRIPT = """<script>
/* Theme switcher (dark / light) */
(function () {
  var root = document.documentElement;
  var opts = [].slice.call(document.querySelectorAll('[data-theme-set]'));
  function apply(t) {
    root.setAttribute('data-theme', t);
    try { localStorage.setItem('sezmoo-theme', t); } catch (e) {}
    opts.forEach(function (b) {
      var on = b.getAttribute('data-theme-set') === t;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
    });
  }
  opts.forEach(function (b) {
    b.addEventListener('click', function () { apply(b.getAttribute('data-theme-set')); });
  });
  apply(root.getAttribute('data-theme') || 'dark');
})();
</script>"""

NAV = """<nav class="nav">
  <a class="brand" href="/#hero" aria-label="SEZMOO">
    <img class="brand__logo" src="/assets/brand/sezmoo-logo-wy.svg" alt="SEZMOO" />
  </a>
  <div class="nav__menu" id="main-menu">
    <a href="/#hero">Home</a>
    <a href="/#work">Portfolio</a>
    <a href="/uslugi-marketingowe/">Usługi</a>
    <a href="/#team">Zespół</a>
    <a href="/#opinie">Opinie</a>
    <a aria-current="page" href="/blog/">Blog</a>
    <a href="/#kontakt">Kontakt</a>
  </div>
  <div class="nav__right"><div class="nav__tc"><span class="live">●&nbsp;REC</span><span class="label" data-tc>00:00:12:08</span></div>
  <div class="nav__theme" role="group" aria-label="Motyw / Theme"><button class="nav__theme-opt" data-theme-set="dark" type="button" aria-label="Ciemny motyw / Dark">DARK</button><button class="nav__theme-opt" data-theme-set="light" type="button" aria-label="Jasny motyw / Light">LIGHT</button></div><div class="nav__lang" role="group" aria-label="Język / Language"><a class="nav__lang-opt is-active" href="#" aria-current="page">PL</a><a class="nav__lang-opt" href="/en/">EN</a></div><button class="nav__burger" type="button" aria-label="Otwórz menu" aria-expanded="false" aria-controls="main-menu">
    <span></span><span></span><span></span>
  </button>
</div></nav>"""

FOOTER = """  <footer class="footer shell">
  <div class="footer__panel">
    <div class="footer__top">
      <a class="footer__brand" href="/#hero" aria-label="SEZMOO">
        <img src="/assets/brand/sezmoo-logo-wy.svg" alt="SEZMOO" />
      </a>
      <div class="footer__statement">
        <span>AGENCJA KREATYWNA · GDAŃSK · TRÓJMIASTO</span>
        <p>Offline i&nbsp;online marketing w&nbsp;jednym miejscu.</p>
      </div>
    </div>
    <div class="footer__grid">
      <div class="footer__col">
        <span class="footer__label">Kontakt</span>
        <a href="mailto:biuro@sezmoo.com">biuro@sezmoo.com</a>
        <a href="tel:+48502260450">+48 502 260 450</a>
      </div>
      <div class="footer__col">
        <span class="footer__label">Studio</span>
        <a href="/#work">Realizacje</a>
        <a href="/uslugi-marketingowe/">Usługi</a>
        <a href="/#kontakt">Brief</a>
      </div>
      <div class="footer__col">
        <span class="footer__label">Social</span>
        <a href="https://www.instagram.com/sezmoo/" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.facebook.com/sezmooagencja" target="_blank" rel="noopener">Facebook</a>
        <a href="https://www.youtube.com/@sezmooagency" target="_blank" rel="noopener">YouTube</a>
        <a href="https://www.linkedin.com/company/sezmoo/" target="_blank" rel="noopener">LinkedIn</a>
      </div>
      <div class="footer__col">
        <span class="footer__label">Adres</span>
        <p>Zeusa 34<br>80-299 Gdańsk</p>
      </div>
    </div>
    <div class="footer__bottom">
      <span>© 2026 SEZMOO · WSZELKIE PRAWA ZASTRZEŻONE</span><a class="footer__legal" href="/polityka-prywatnosci/">Polityka prywatności</a>
      <a href="#top">Do góry</a>
    </div>
  </div>
</footer>"""

RESERVED = {
    "artykul",
    "assets",
    "blog",
    "en",
    "logs",
    "polityka-prywatnosci",
    "portfolio",
    "portfolio-lista-b",
    "realizacja",
    "realizacja-denza",
    "realizacja-exlantix",
    "realizacja-kapka",
    "realizacja-primespot",
    "realizacja-world-of-warships",
    "uslugi-marketingowe",
    "abonament",
}


def decode(text: str) -> str:
    return html.unescape(text or "").strip()


def strip_tags(text: str) -> str:
    text = re.sub(r"<[^>]+>", " ", text or "")
    return re.sub(r"\s+", " ", decode(text)).strip()


def slugify_heading(text: str) -> str:
    text = strip_tags(text).lower()
    repl = {
        "ą": "a",
        "ć": "c",
        "ę": "e",
        "ł": "l",
        "ń": "n",
        "ó": "o",
        "ś": "s",
        "ź": "z",
        "ż": "z",
    }
    for a, b in repl.items():
        text = text.replace(a, b)
    text = re.sub(r"[^a-z0-9]+", "-", text).strip("-")
    return text[:60] or "sekcja"


def reading_minutes(content_html: str) -> int:
    words = len(strip_tags(content_html).split())
    return max(3, round(words / 200))


def topic_for(title: str, content: str) -> tuple[str, str]:
    """Map post → blog filter. Title-first; Polish case variants; no empty 'post' bucket."""
    t = re.sub(r"\s+", " ", title.lower())

    # Explicit overrides for ambiguous titles
    overrides = {
        "jak przygotować firmę do sesji wizerunkowej": ("PRODUKCJA", "production"),
        "jak zbudować spójną komunikację marki": ("STRATEGIA", "strategy"),
        "agencja kreatywna dla firm – jak wybrać mądrze": ("STRATEGIA", "strategy"),
        "agencja kreatywna dla firm - jak wybrać mądrze": ("STRATEGIA", "strategy"),
        "kampanie paid social, które sprzedają": ("SOCIAL", "social"),
        "film employer branding, który działa": ("PRODUKCJA", "production"),
        "jak zaplanować kampanię employer branding": ("STRATEGIA", "strategy"),
        "agencja reklamowa a produkcja wideo": ("PRODUKCJA", "production"),
        "10 lat world of warships. gaming room i event na 10-lecie.": ("STRATEGIA", "strategy"),
        "aktualne wymiary grafik na social media – kompletny przewodnik 2025": ("SOCIAL", "social"),
    }
    for key, val in overrides.items():
        if key in t or t.startswith(key[:40]):
            return val

    social = (
        "instagram",
        "linkedin",
        "tiktok",
        "social media",
        "social-media",
        "paid social",
        "facebook",
        "reels",
        "rolki",
        "rolka",
        "obsługa social",
        "obsluga social",
        "wymiary grafik",
    )
    if any(k in t for k in social):
        return "SOCIAL", "social"

    production = (
        "wideo",
        "video",
        "film",
        "filmu",
        "produkcja wideo",
        "produkcja –",
        "produkcja -",
        "sesja",
        "sesji",
        "aftermovie",
        "animacja",
        "animacji",
        "fotografia",
        "fotografii",
        "zdjęci",
        "zdjec",
        "dron",
        "dronem",
        "explainer",
        "ujęcia",
        "ujecia",
    )
    if any(k in t for k in production):
        return "PRODUKCJA", "production"

    strategy = (
        "strateg",
        "content",
        "kampan",
        "landing",
        "stron",
        "www",
        "lead",
        "b2b",
        "reklam",
        "marketing",
        "brand",
        "logo",
        "identyfik",
        "outsourcing",
        "abonament",
        "google ads",
        "employer branding",
        "event",
        "ulotk",
        "katalog",
        "księga znaku",
        "ksiega znaku",
        "brand book",
        "druk",
        "komunikac",
        "agencj",
        "freelancer",
        "materiał",
        "material",
        "konwersj",
        "one page",
    )
    if any(k in t for k in strategy):
        return "STRATEGIA", "strategy"

    return "STRATEGIA", "strategy"


def rewrite_urls(content: str) -> str:
    content = content.replace("https://sezmoo.com/uslugi/", "/uslugi-marketingowe/")
    content = content.replace("https://sezmoo.com/o-nas/", "/#team")
    content = content.replace("https://sezmoo.com/kontakt/", "/#kontakt")
    content = content.replace("https://sezmoo.com/uslugi-na-abonament/", "/uslugi-marketingowe/abonamenty/")
    content = content.replace('href="https://sezmoo.com/', 'href="/')
    content = content.replace("&#8211;", "–")
    content = content.replace("&#8217;", "’")
    content = content.replace("&#8220;", "„")
    content = content.replace("&#8221;", "”")
    content = content.replace("&nbsp;", "\u00a0")
    return content


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 0:
        return True
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        r = subprocess.run(
            ["curl", "-fsSL", "--max-time", "60", "-o", str(dest), url],
            capture_output=True,
            text=True,
        )
        if r.returncode == 0 and dest.exists() and dest.stat().st_size > 0:
            return True
        print(f"  ! download failed {url}: {r.stderr.strip() or r.returncode}")
        if dest.exists():
            dest.unlink()
        return False
    except Exception as exc:  # noqa: BLE001
        print(f"  ! download failed {url}: {exc}")
        return False


def featured_url(post: dict) -> str | None:
    media = ((post.get("_embedded") or {}).get("wp:featuredmedia") or [None])[0]
    if not media:
        return None
    sizes = (media.get("media_details") or {}).get("sizes") or {}
    for key in ("large", "medium_large", "full", "medium"):
        if key in sizes and sizes[key].get("source_url"):
            return sizes[key]["source_url"]
    return media.get("source_url")


def localize_images(content: str, slug: str) -> str:
    def repl(match: re.Match[str]) -> str:
        url = match.group(1)
        name = Path(url.split("?")[0]).name
        local = INLINE_ASSETS / f"{slug}-{name}"
        download(url, local)
        return f'src="/assets/blog/inline/{local.name}"'

    return re.sub(r'src="(https://sezmoo\.com/wp-content/uploads/[^"]+)"', repl, content)


def clean_block(html_block: str) -> str:
    html_block = rewrite_urls(html_block)
    # Drop empty paragraphs and WP wrappers.
    html_block = re.sub(r'<div[^>]*class="[^"]*wp-[^"]*"[^>]*>', "", html_block)
    html_block = html_block.replace("</div>", "")
    html_block = re.sub(r"<p>\s*</p>", "", html_block)
    html_block = re.sub(r"\n{3,}", "\n\n", html_block)
    return html_block.strip()


def build_sections(content_html: str, slug: str) -> tuple[str, list[tuple[str, str]], str]:
    content_html = localize_images(content_html, slug)
    content_html = clean_block(content_html)

    parts = re.split(r"(<h2[^>]*>.*?</h2>)", content_html, flags=re.I | re.S)
    intro = clean_block(parts[0]) if parts else ""
    sections: list[tuple[str, str, str]] = []
    used_ids: set[str] = set()

    i = 1
    while i < len(parts):
        heading_html = parts[i]
        body = parts[i + 1] if i + 1 < len(parts) else ""
        title = strip_tags(heading_html)
        sid = slugify_heading(title)
        base = sid
        n = 2
        while sid in used_ids:
            sid = f"{base}-{n}"
            n += 1
        used_ids.add(sid)
        body = clean_block(body)
        # Promote h3 etc. stay as-is inside section.
        sections.append((sid, title, body))
        i += 2

    aside_links = [(sid, title) for sid, title, _ in sections[:6]]
    pieces: list[str] = []
    if intro:
        pieces.append(f'<section id="wstep" class="reveal">\n{intro}\n</section>')
        if ("wstep", "Wstęp") not in aside_links and aside_links:
            aside_links.insert(0, ("wstep", "Wstęp"))
        elif not aside_links:
            aside_links = [("wstep", "Wstęp")]

    for sid, title, body in sections:
        pieces.append(
            f'<section id="{sid}" class="reveal">\n'
            f"          <h2>{html.escape(title)}</h2>\n"
            f"{body}\n"
            f"        </section>"
        )

    return "\n\n        ".join(pieces), aside_links, intro


def first_paragraph(intro_html: str, excerpt: str) -> str:
    m = re.search(r"<p[^>]*>(.*?)</p>", intro_html, flags=re.I | re.S)
    if m:
        text = strip_tags(m.group(1))
        if text:
            return text
    return strip_tags(excerpt)


def meta_description(excerpt: str, lead: str) -> str:
    text = strip_tags(excerpt) or lead
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > 160:
        cut = text[:157].rsplit(" ", 1)[0]
        text = cut.rstrip(".,;:") + "…"
    return text


def render_article(post: dict, image_path: str | None) -> str:
    title = decode(post["title"]["rendered"])
    slug = post["slug"]
    date = datetime.fromisoformat(post["date"]).strftime("%d.%m.%Y")
    content = post["content"]["rendered"]
    excerpt = post.get("excerpt", {}).get("rendered", "")
    minutes = reading_minutes(content)
    topic_label, _ = topic_for(title, content)
    body, aside_links, intro = build_sections(content, slug)
    lead = first_paragraph(intro, excerpt)
    desc = meta_description(excerpt, lead)
    meta_title = f"{title} | SEZMOO"
    canonical = f"https://sezmoo.com/{slug}/"
    og_image = f"https://sezmoo.com{image_path}" if image_path else "https://sezmoo.com/assets/og-image.png"

    aside_html = "\n        ".join(
        f'<a href="#{sid}">{html.escape(label)}</a>' for sid, label in aside_links
    ) or '<a href="#wstep">Treść</a>'

    if image_path:
        media = (
            f'<div class="article__media reveal">\n'
            f'      <div class="frame-media"><img src="{image_path}" alt="{html.escape(title)}" loading="eager" /></div>\n'
            f"      <span>SEZMOO / BLOG</span>\n"
            f"    </div>"
        )
    else:
        media = (
            '<div class="article__media reveal">\n'
            '      <div class="frame-media"></div>\n'
            "      <span>SEZMOO / BLOG</span>\n"
            "    </div>"
        )

    return f"""<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/assets/favicon.png" sizes="any" />
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
<meta name="theme-color" content="#16130e" />
<meta property="og:type" content="article" />
<meta property="og:title" content="{html.escape(meta_title)}" />
<meta property="og:description" content="{html.escape(desc)}" />
<meta property="og:url" content="{canonical}" />
<meta property="og:image" content="{og_image}" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="{html.escape(meta_title)}" />
<meta name="twitter:description" content="{html.escape(desc)}" />
<meta name="twitter:image" content="{og_image}" />
{HEAD_SCRIPTS}
<title>{html.escape(meta_title)}</title>
<meta name="title" content="{html.escape(meta_title)}" />
<meta name="description" content="{html.escape(desc)}" />
<link rel="canonical" href="{canonical}" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body><canvas class="flow-bg-canvas" id="flow-bg-canvas" aria-hidden="true"></canvas>

<div class="grain"></div>
<div class="vignette"></div>
<div class="cursor">PLAY</div>
<div class="cursor-dot"></div>
<div class="scrubber"><div class="scrubber__fill"><span class="scrubber__head"></span></div></div>

{NAV}

<main>
  <article class="article shell">
    <header class="article__head">
      <a class="article__back reveal" href="/blog/">← Wróć do&nbsp;bloga</a>
      <span class="blog-post__meta reveal">{topic_label} · {minutes:02d} MIN · {date}</span>
      <h1 class="article__title reveal">{html.escape(title)}</h1>
      <p class="article__lead reveal" data-d="1">{html.escape(lead)}</p>
    </header>

    {media}

    <div class="article__layout">
      <aside class="article__aside reveal">
        <span>W artykule</span>
        {aside_html}
      </aside>

      <div class="article__content">
        {body}

        <div class="article__cta reveal">
          <h2>Chcesz podobny efekt dla&nbsp;marki?</h2>
          <a href="/#kontakt">Porozmawiajmy</a>
        </div>
      </div>
    </div>
  </article>

{FOOTER}
</main>

<script src="/assets/js/app.js"></script>
<script src="/assets/js/flowing-background.js"></script>
{THEME_SCRIPT}
</body>
</html>
"""


def render_blog_index(posts_meta: list[dict]) -> str:
    feature = posts_meta[0]
    rest = posts_meta[1:]

    def card(p: dict, delay: int | None = None) -> str:
        d_attr = f' data-d="{delay}"' if delay is not None else ""
        return f"""        <article class="blog-post reveal"{d_attr} data-topic="{p['filter']}">
          <span class="blog-post__meta">{p['topic']} · {p['minutes']:02d} MIN · {p['date']}</span>
          <h3><a class="blog-post__title" href="/{p['slug']}/">{html.escape(p['title'])}</a></h3>
          <p>{html.escape(p['excerpt'])}</p>
          <a class="blog-post__more" href="/{p['slug']}/">Czytaj dalej</a>
        </article>"""

    cards = []
    for i, p in enumerate(rest):
        cards.append(card(p, delay=(i % 3) or None))

    feat_media = (
        f'<div class="frame-media"><img src="{feature["image"]}" alt="{html.escape(feature["title"])}" loading="eager" /></div>'
        if feature.get("image")
        else '<div class="frame-media"></div>'
    )

    return f"""<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml" />
<link rel="icon" href="/assets/favicon.png" sizes="any" />
<link rel="apple-touch-icon" href="/assets/apple-touch-icon.png" />
<meta name="theme-color" content="#16130e" />
<meta property="og:image" content="https://sezmoo.com/assets/og-image.png" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:image" content="https://sezmoo.com/assets/og-image.png" />
{HEAD_SCRIPTS}
<title>Blog, produkcja wideo, content i&nbsp;marketing marek | SEZMOO</title>
<meta name="title" content="Blog, produkcja wideo, content i marketing marek | SEZMOO" />
<meta name="description" content="Blog SEZMOO: praktyczne notatki o produkcji wideo, contentu na social media i marketingu marek, z planu, montażu i feedu." />
<link rel="canonical" href="https://sezmoo.com/blog/" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Archivo:ital,wdth,wght@0,62..125,100..900;1,62..125,100..900&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
<link rel="stylesheet" href="/assets/css/styles.css" />
</head>
<body><canvas class="flow-bg-canvas" id="flow-bg-canvas" aria-hidden="true"></canvas>

<div class="grain"></div>
<div class="vignette"></div>
<div class="cursor">PLAY</div>
<div class="cursor-dot"></div>
<div class="scrubber"><div class="scrubber__fill"><span class="scrubber__head"></span></div></div>

{NAV}

<main>
  <section class="blog blog--page shell" id="blog" data-screen-label="Blog">
    <div class="blog-hero">
      <div>
        <span class="eyebrow reveal"><span class="tick"></span>NOTATKI SEZMOO</span>
        <h1 class="blog-hero__title reveal">Notatki z&nbsp;planu, montażu i&nbsp;feedu.</h1>
      </div>
      <p class="blog-hero__copy reveal" data-d="1">Praktyczne wpisy o&nbsp;produkcji wideo, content marketingu, social mediach i&nbsp;stronach, które wspierają sprzedaż.</p>
    </div>

    <div class="blog-topics reveal">
      <a href="#all" class="is-active" data-blog-filter="all">Wszystko</a>
      <a href="#production" data-blog-filter="production">Produkcja</a>
      <a href="#social" data-blog-filter="social">Social</a>
      <a href="#strategy" data-blog-filter="strategy">Strategia</a>
    </div>

    <article class="blog-feature reveal" data-topic="{feature['filter']}">
      <div class="blog-feature__media">
        {feat_media}
        <span>FEATURED</span>
      </div>
      <div class="blog-feature__body">
        <span class="blog-post__meta">{feature['topic']} · {feature['minutes']:02d} MIN · {feature['date']}</span>
        <h2><a class="blog-post__title" href="/{feature['slug']}/">{html.escape(feature['title'])}</a></h2>
        <p>{html.escape(feature['excerpt'])}</p>
        <a class="blog-feature__cta" href="/{feature['slug']}/">Czytaj artykuł</a>
      </div>
    </article>

    <div class="blog-layout">
      <div class="blog__list">
{chr(10).join(cards)}
      </div>

      <aside class="blog-side reveal" data-d="1">
        <span class="blog-side__label">Tematy</span>
        <a href="#production" data-blog-filter="production">Produkcja wideo</a>
        <a href="#social" data-blog-filter="social">Social / Reels / LinkedIn</a>
        <a href="#strategy" data-blog-filter="strategy">Strategia i strony</a>
        <a href="/#kontakt">Zaproponuj temat</a>
      </aside>
    </div>
  </section>

{FOOTER}
</main>

<script src="/assets/js/app.js"></script>
<script src="/assets/js/flowing-background.js"></script>
{THEME_SCRIPT}
<script>
(function () {{
  var filters = [].slice.call(document.querySelectorAll('[data-blog-filter]'));
  var items = [].slice.call(document.querySelectorAll('[data-topic]'));
  function apply(key) {{
    filters.forEach(function (a) {{
      a.classList.toggle('is-active', a.getAttribute('data-blog-filter') === key);
    }});
    items.forEach(function (el) {{
      var show = key === 'all' || el.getAttribute('data-topic') === key;
      el.hidden = !show;
    }});
  }}
  filters.forEach(function (a) {{
    a.addEventListener('click', function (e) {{
      e.preventDefault();
      apply(a.getAttribute('data-blog-filter'));
    }});
  }});
}})();
</script>
</body>
</html>
"""


def update_sitemap(slugs: list[str]) -> None:
    today = datetime.now().strftime("%Y-%m-%d")
    raw = SITEMAP.read_text(encoding="utf-8")
    locs = re.findall(r"<loc>(.*?)</loc>", raw)
    slug_set = set(slugs)
    keep: list[str] = []
    seen: set[str] = set()
    for loc in locs:
        norm = loc if loc.endswith("/") else loc + "/"
        path = norm.replace("https://sezmoo.com/", "").strip("/")
        first = path.split("/")[0] if path else ""
        if first == "artykul" or first in slug_set:
            continue
        if norm not in seen:
            seen.add(norm)
            keep.append(norm)

    lines = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ]
    for loc in keep:
        lines += ["  <url>", f"    <loc>{loc}</loc>", f"    <lastmod>{today}</lastmod>", "  </url>"]
    for slug in slugs:
        lines += [
            "  <url>",
            f"    <loc>https://sezmoo.com/{slug}/</loc>",
            f"    <lastmod>{today}</lastmod>",
            "  </url>",
        ]
    lines.append("</urlset>")
    SITEMAP.write_text("\n".join(lines) + "\n", encoding="utf-8")


def main() -> None:
    posts = json.loads(DATA.read_text(encoding="utf-8"))
    BLOG_ASSETS.mkdir(parents=True, exist_ok=True)
    INLINE_ASSETS.mkdir(parents=True, exist_ok=True)

    meta_list: list[dict] = []
    slugs: list[str] = []

    for i, post in enumerate(posts, 1):
        slug = post["slug"]
        if slug in RESERVED:
            print(f"! skip reserved slug {slug}")
            continue
        title = decode(post["title"]["rendered"])
        print(f"[{i}/{len(posts)}] {slug}")

        feat = featured_url(post)
        image_path = None
        if feat:
            ext = Path(feat.split("?")[0]).suffix or ".webp"
            dest = BLOG_ASSETS / f"{slug}{ext}"
            if download(feat, dest):
                image_path = f"/assets/blog/{dest.name}"

        page = render_article(post, image_path)
        out_dir = ROOT / slug
        out_dir.mkdir(parents=True, exist_ok=True)
        (out_dir / "index.html").write_text(page, encoding="utf-8")

        topic, filt = topic_for(title, post["content"]["rendered"])
        raw_excerpt = strip_tags(post.get("excerpt", {}).get("rendered", ""))
        if not raw_excerpt:
            raw_excerpt = first_paragraph(post["content"]["rendered"], "")
        excerpt = meta_description(raw_excerpt, raw_excerpt)

        meta_list.append(
            {
                "slug": slug,
                "title": title,
                "excerpt": excerpt,
                "date": datetime.fromisoformat(post["date"]).strftime("%d.%m.%Y"),
                "minutes": reading_minutes(post["content"]["rendered"]),
                "topic": topic,
                "filter": filt,
                "image": image_path,
            }
        )
        slugs.append(slug)

    BLOG_INDEX.write_text(render_blog_index(meta_list), encoding="utf-8")
    update_sitemap(slugs)
    print(f"Done: {len(slugs)} posts, blog index + sitemap updated")


if __name__ == "__main__":
    main()
