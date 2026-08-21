# Engenharia Reversa — `portfolio-henna-pi-77.vercel.app`

**Stack real:** HTML5 estático + CSS puro (custom properties) + JavaScript vanilla ES6 (classe única `PortfolioApp`). Sem framework, sem bundler. Deploy Vercel, multi-página (`index.html`, `pages/projetos.html`, `pages/certificados.html`, `pages/curriculo.html`).

**Arquivos:**

| Caminho | Tamanho | Papel |
|---|---|---|
| `index.html` | ~26 KB | Markup semântico + JSON-LD `Person` + 2 `<style>` inline (overrides de contato/hero) |
| `styles/style.css` | ~19 KB | Design system completo, tokens, componentes, media queries, `@media print` |
| `scripts/app.js` | ~58 KB | Dicionário i18n (~260 linhas), classe `PortfolioApp` (~520 linhas), array `CERTIFICATES` (~50 itens) |

---

## 1. Estrutura Semântica (HTML/DOM)

### 1.1 Hierarquia de topo

```
<html lang="pt-BR" data-theme="dark|light">   ← estado do tema vive no <html>
└── <body>
    ├── <noscript>.noscript-warning           ← faixa vermelha sticky de fallback
    ├── <a.skip-link href="#inicio">           ← a11y: fora da tela até :focus
    ├── <header.navbar role="banner">
    │   └── .container.inner
    │       ├── a.brand > img.logo
    │       ├── nav.nav-links#nav-links
    │       ├── button#lang-toggle.btn.secondary   (PT/EN)
    │       ├── button#theme-toggle.icon-btn.theme-toggle  (2 SVGs: .sun/.moon)
    │       └── button#nav-toggle.nav-toggle       (hamburger, só < 820px)
    ├── <main>
    │   ├── section#inicio.hero.container
    │   │   ├── div.reveal.intro    → span.tag (badge) + h1 + p + .kpis + .hero-ctas
    │   │   └── aside.hero-side     → div.avatar > img  +  div.card (stack list)
    │   ├── section#sobre.section    → h2 + p.sub + .grid.cards (3× div.card)
    │   ├── section#projetos.section → h2 + p.sub + .grid.cards (3× article.card.project-card) + .actions.project-actions
    │   └── section#contato.section  → h2 + p.sub + .contact-grid
    │       ├── aside.card.contact-card#whats-card[data-whatsapp]
    │       └── form.card.contact-card#contact-form[novalidate][data-email-to]
    └── <footer.footer role="contentinfo">
        ├── .container.top  → .cta | nav.sitemap | .social
        └── .container.bottom → <small> © + a.back-top
```

### 1.2 Componentes lógicos

| Componente | Seletor raiz | Contrato de dados |
|---|---|---|
| Navbar | `header.navbar` | `.nav-links a[href^="#"]` viram `Map` no JS |
| Hero | `section#inicio.hero` | grid `1fr 400px` |
| Card genérico | `.card` | flex column, `gap:20px`, spotlight via `--mx/--my` |
| Card de projeto | `article.card.project-card` | `data-project` + `data-tags="backend architecture"` |
| Filtro | `#project-filters` | botões com `data-filter="all\|backend\|frontend\|data\|mobile\|architecture"` |
| Tag de skill | `span.tag.skill.indentificador.<Nome>` | classe define `--pin` (cor do ponto) |
| KPI | `span.kpi` | pílula `border-radius:999px` |
| Certificado | `.certs-grid > .card` | renderizado por JS a partir de `CERTIFICATES[]` |
| Reveal | qualquer `.reveal` | recebe `.visible` pelo IntersectionObserver |

### 1.3 Padrões de acessibilidade aplicados

- `aria-labelledby` em cada `<section>` apontando para o `id` do `<h2>`.
- `aria-current="page"` sincronizado com a seção ativa.
- `aria-expanded` / `aria-controls` / `aria-label` dinâmicos no hamburger.
- `aria-invalid` por campo no submit do formulário.
- `role="status" aria-live="polite"` para sucesso, `role="alert"` para erro.
- `aria-hidden="true"` em todos os SVGs decorativos.
- `data-i18n="chave"` como marcador universal de tradução.

---

## 2. Visual e UI (CSS)

### 2.1 Tokens — Dark-first

```css
:root {
  /* Paleta Zinc + Yellow */
  --bg-base:     #09090b;
  --bg-soft:     #18181b;
  --text-main:   #f4f4f5;
  --text-muted:  #a1a1aa;
  --primary:     #FACC15;
  --primary-glow: rgba(250, 204, 21, 0.15);
  --secondary:   #EAB308;

  /* Glassmorphism */
  --card-bg:      rgba(24, 24, 27, 0.65);
  --glass:        rgba(255, 255, 255, 0.03);
  --border-light: rgba(255, 255, 255, 0.08);
  --border-hover: rgba(250, 204, 21, 0.3);

  /* Geometria */
  --radius:       16px;
  --shadow-base:  0 8px 30px rgba(0,0,0,0.5);
  --shadow-hover: 0 20px 40px rgba(0,0,0,0.8);
  --grid-color:   rgba(255,255,255,0.03);

  /* Curvas */
  --ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275);
  --ease-out:    cubic-bezier(0.165, 0.84, 0.44, 1);
}

:root[data-theme="light"] {
  --bg-base:#fafafa; --bg-soft:#ffffff;
  --text-main:#09090b; --text-muted:#52525b;
  --primary:#eab308; --primary-glow:rgba(234,179,8,.15);
  --card-bg:rgba(255,255,255,.8);
  --border-light:rgba(0,0,0,.08); --border-hover:rgba(234,179,8,.4);
  --grid-color:rgba(0,0,0,.03);
  --shadow-base:0 4px 20px -8px rgba(0,0,0,.08);
}
```

### 2.2 Fundo composto (3 camadas em uma propriedade)

O "grid + glow" do fundo é feito só com `background-image`, sem elemento extra:

```css
body {
  background-color: var(--bg-base);
  background-image:
    radial-gradient(ellipse 80% 50% at 50% -20%, var(--primary-glow), transparent), /* halo amarelo */
    linear-gradient(var(--grid-color) 1px, transparent 1px),                        /* linhas H */
    linear-gradient(90deg, var(--grid-color) 1px, transparent 1px);                 /* linhas V */
  background-size: 100% 100%, 40px 40px, 40px 40px;
  background-attachment: fixed;   /* parallax "grátis" no scroll */
}
```

### 2.3 Tipografia

| Elemento | Família | Tamanho | Peso | Extra |
|---|---|---|---|---|
| `body` | `'Inter'` (400/500/600/700/800) | 1rem | 400 | `line-height:1.6`, antialiased |
| `h1` | Inter | `clamp(2.5rem, 6vw, 4.2rem)` | 800 | `line-height:1.1`, gradient text |
| `h2` | Inter | `clamp(1.75rem, 4vw, 2.5rem)` | 700 | `line-height:1.2` |
| `.card h3` | Inter | 1.4rem | 800 | `line-height:1.3` |
| `.sub` | Inter | 1.125rem | 400 | `color: var(--text-muted)` |
| `.card p` | Inter | 0.95rem | 400 | `flex-grow:1` (empurra o botão pro rodapé) |
| `.tag` | `'JetBrains Mono'` | 0.75rem | 400 | |
| `.kpi` / `.credential-code` | JetBrains Mono | 0.85rem | 400 | |

`h1,h2,h3` recebem `letter-spacing:-0.03em` e `text-wrap:balance`.

**Título com gradiente (truque de 3 linhas):**

```css
h1 {
  background: linear-gradient(to right bottom, #ffffff 20%, #a1a1aa);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
}
:root[data-theme="light"] h1 {
  background: linear-gradient(to right bottom, #09090b 20%, #52525b);
  -webkit-background-clip: text; background-clip: text;
}
```

### 2.4 Layout / espaçamento

```css
.container   { width: min(1100px, 92%); margin: 0 auto; }
.section     { padding: 80px 0; }
.grid.cards  { display:grid; grid-template-columns: repeat(auto-fill, minmax(320px,1fr)); gap:32px; }
.certs-grid  { grid-template-columns: repeat(auto-fill, minmax(340px,1fr)); gap:32px; }
.hero        { display:grid; grid-template-columns: 1fr 400px; gap:60px; min-height:85vh; }
.footer .top { display:grid; grid-template-columns: 2fr 1fr 1fr; gap:40px; }
html         { scroll-behavior:smooth; scroll-padding-top:100px; } /* compensa navbar sticky */
```

**Breakpoints:** `900px` (hero vira 1 coluna) · `820px` (menu mobile) · `768px` (hero centralizado, footer 1 coluna).

### 2.5 Card com spotlight

```css
.card {
  position: relative;
  background: var(--card-bg);
  backdrop-filter: blur(16px);
  border: 1px solid var(--border-light);
  border-radius: var(--radius);
  padding: 32px;
  box-shadow: var(--shadow-base);
  display: flex; flex-direction: column; gap: 20px;
  overflow: hidden;                 /* contém o brilho */
  transition: transform .4s var(--ease-spring), border-color .4s ease, box-shadow .4s ease;
  will-change: transform;
}
.card::before {                     /* o brilho segue o rato via --mx/--my */
  content:""; position:absolute; inset:0; z-index:0; pointer-events:none;
  background: radial-gradient(600px circle at var(--mx,50%) var(--my,50%),
              rgba(250,204,21,.08), transparent 40%);
  opacity:0; transition: opacity .5s ease;
}
.card:hover {
  transform: translateY(-8px);
  border-color: var(--border-hover);
  box-shadow: var(--shadow-hover), inset 0 1px 0 rgba(255,255,255,.1);
}
.card:hover::before { opacity:1; }
.card > * { position:relative; z-index:1; }   /* conteúdo acima do brilho */
```

### 2.6 Anatomia dos botões

```css
.btn {
  display:inline-flex; align-items:center; justify-content:center;
  padding:12px 28px; font-weight:600; font-size:.95rem;
  border-radius:12px; border:1px solid transparent;
  text-decoration:none; cursor:pointer; overflow:hidden; position:relative;
  transition: all .3s var(--ease-spring);
}
/* onda magnética branca no hover */
.btn::after {
  content:""; position:absolute; inset:0; pointer-events:none;
  background: radial-gradient(120px circle at var(--mx,50%) var(--my,50%),
              rgba(255,255,255,.25), transparent 60%);
  opacity:0; transition: opacity .3s ease;
}
.btn:hover::after { opacity:1; }
```

| Variante | Default | Hover | Notas |
|---|---|---|---|
| **Primário** `.btn` | `bg:var(--primary)`, `color:#000`, `shadow:0 4px 14px var(--primary-glow)` | `translateY(-3px)`, `bg:#fde047`, `shadow:0 8px 24px rgba(250,204,21,.4)` | seletor real: `.btn:not(.secondary):not(.light)` |
| **Secundário** `.btn.secondary` | `bg:var(--glass)`, borda `--border-light` | `bg:rgba(255,255,255,.05)`, borda `--primary`, `translateY(-3px)` | no tema claro: `bg:transparent`, borda `#d4d4d8` |
| **Light** `.btn.light` | `bg:#fff`, `color:#111` | `translateY(-3px)`, `shadow:0 8px 20px rgba(255,255,255,.15)` | invertido no tema claro |
| **Disabled** | *não existe no original* | — | ver seção 5 para a implementação sugerida |
| **Focus** | `:focus-visible → outline:2px solid var(--primary); outline-offset:4px` | — | `:focus:not(:focus-visible){outline:none}` |

### 2.7 Tag de skill com ponto colorido

O ponto colorido vem de uma variável setada por classe da linguagem:

```css
.tag { font-family:'JetBrains Mono',monospace; font-size:.75rem; padding:6px 12px;
       border-radius:6px; background:var(--glass); border:1px solid var(--border-light);
       color:var(--text-muted); }
.tag.skill { display:inline-flex; align-items:center; gap:8px; color:var(--text-main); }
.tag.skill::before {
  content:""; width:8px; height:8px; border-radius:50%;
  background: var(--pin, var(--text-muted));
  box-shadow: 0 0 10px var(--pin, transparent);   /* halo neon */
}
/* mapa de cores (classe .indentificador — sic, typo do original) */
.indentificador.Java      { --pin:#f89820; }
.indentificador.Docker    { --pin:#2496ED; }
.indentificador.Kubernetes{ --pin:#326CE5; }
.indentificador.PostgreSQL{ --pin:#336791; }
.indentificador.Node\ js  { --pin:#339933; }
.indentificador.React     { --pin:#61DAFB; }
.indentificador.TypeScript{ --pin:#3178C6; }
/* ...~19 linguagens no total */
```

### 2.8 Detalhes de acabamento

```css
::-webkit-scrollbar { width:8px; }
::-webkit-scrollbar-thumb { background:#3f3f46; border-radius:10px; border:2px solid var(--bg-base); }
::-webkit-scrollbar-thumb:hover { background:var(--primary); }
::selection { background:var(--primary); color:#000; }

input, textarea {
  background: rgba(0,0,0,.3); border:1px solid var(--border-light);
  border-radius:12px; padding:16px; font-family:inherit; font-size:1rem;
  box-shadow: inset 0 2px 4px rgba(0,0,0,.2); transition: all .3s ease;
}
input:focus, textarea:focus {
  outline:none; background:rgba(0,0,0,.5); border-color:var(--primary);
  box-shadow: 0 0 0 4px var(--primary-glow), inset 0 2px 4px rgba(0,0,0,.2);
}
```

---

## 3. Animações

### 3.1 Inventário

| # | Alvo | Gatilho | Propriedade | Duração / curva |
|---|---|---|---|---|
| 1 | `.reveal` → `.visible` | scroll (IO `threshold: 0.14`) | `opacity 0→1`, `translateY(40px→0)` | `.8s var(--ease-out)` |
| 2 | `.card` | hover | `translateY(-8px)` + borda + sombra | `.4s var(--ease-spring)` |
| 3 | `.card::before` | hover + `pointermove` | `opacity 0→1`, posição do gradiente | `.5s ease` |
| 4 | `.btn::after` | hover + `pointermove` | `opacity 0→1` | `.3s ease` |
| 5 | `.btn` (primário/secundário/light) | hover | `translateY(-3px)` + sombra | `.3s var(--ease-spring)` |
| 6 | `.hero .avatar` | contínuo | `@keyframes morph` (border-radius) | `8s ease-in-out infinite` |
| 7 | `.brand .logo` | hover no `.brand` | `scale(1.15) rotate(8deg)` | `.4s var(--ease-spring)` |
| 8 | `.nav-links a::after` | hover / `.active` | `translateX(-50%) scale(0→1)` | `.3s var(--ease-spring)` |
| 9 | `.theme-toggle .sun/.moon` | click (troca `data-theme`) | `opacity` + `rotate(±90deg)` | `.3s` / `.5s cubic-bezier(.2,.8,.2,1)` |
| 10 | `.nav-links` mobile | click no hamburger | `opacity`, `visibility`, `translateY(-10px→0)` | `.4s var(--ease-spring)` |
| 11 | `.project-card img` | hover no card | `scale(1.03)` | `.6s var(--ease-out)` |
| 12 | `.social a` | hover | `translateY(-6px) scale(1.1)` + inversão de cor | `.3s var(--ease-spring)` |
| 13 | `.back-top::after` (`↑`) | hover | `translateY(-3px)` | `.3s ease` |
| 14 | `.kpi` | hover | `translateY(-2px)` + cor primária | `.3s ease` |
| 15 | cards filtrados | click no filtro | `opacity` + `scale(.95↔1)` via JS inline | `.4s` (timeout 10ms/400ms) |

### 3.2 Os únicos `@keyframes` do projeto

```css
@keyframes morph {
  0%   { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; }
  34%  { border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%; }
  67%  { border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%; }
  100% { border-radius: 40% 60% 70% 30% / 40% 40% 60% 50%; }
}
.hero .avatar {
  width:260px; height:260px; padding:8px;
  border:1px solid var(--border-light);
  background: linear-gradient(135deg, var(--primary-glow), transparent);
  box-shadow: inset 0 0 20px rgba(255,255,255,.05), var(--shadow-hover);
  overflow:hidden;
  animation: morph 8s ease-in-out infinite;
}
.hero .avatar img { width:100%; height:100%; object-fit:cover; border-radius:inherit; }
```

> Todo o resto é `transition`, não `animation`. É essa a razão de o site parecer fluido sem custo de CPU.

### 3.3 Reveal + kill-switch de movimento

```css
.reveal {
  opacity:0; transform: translateY(40px);
  transition: opacity .8s var(--ease-out), transform .8s var(--ease-out);
  will-change: opacity, transform;
}
.reveal.visible { opacity:1; transform: translateY(0); }

@media (prefers-reduced-motion: reduce) {
  * { animation:none !important; transition:none !important; }
  .reveal { opacity:1; transform:none; }
  html { scroll-behavior:auto; }
}
```

---

## 4. Funções e Lógica (JavaScript)

### 4.1 Arquitetura

Classe única instanciada no `DOMContentLoaded`. O construtor faz cache de DOM uma única vez e `init()` orquestra 9 módulos:

```js
class PortfolioApp {
  constructor() {
    this.DOM = {
      html: document.documentElement,
      navToggle:   document.querySelector('#nav-toggle'),
      navLinks:    document.querySelector('#nav-links'),
      themeBtn:    document.querySelector('#theme-toggle'),
      contactForm: document.querySelector('#contact-form'),
      filterBar:   document.querySelector('#project-filters'),
      projectCards:document.querySelectorAll('[data-project]'),
      reveals:     document.querySelectorAll('.reveal'),
      certsGrid:   document.querySelector('.certs-grid'),
      sections:    document.querySelectorAll('section[id]'),
      navItems: new Map(
        [...document.querySelectorAll('.nav-links a[href^="#"]')]
          .map(a => [a.getAttribute('href').slice(1), a])
      )
    };
    this.init();
  }
  init() {
    this.initTheme();            // 1. antes de tudo (evita flash)
    this.initI18n();             // 2. dispara initCertificates(lang)
    this.initNavigation();
    this.initScrollReveal();
    this.initSmoothScroll();
    this.initSectionHighlight();
    this.initProjectFilters();
    this.initContactHandling();
    this.initMagneticButtons();
    this.initLocalDevFeatures();
    this.setupDynamicYears();
  }
}
document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
```

### 4.2 Estado — tudo em `localStorage` + atributo no `<html>`

| Estado | Chave | Onde vive no DOM |
|---|---|---|
| Tema | `localStorage.theme` = `'dark'\|'light'` | `<html data-theme>` |
| Idioma | `localStorage.language` = `'pt'\|'en'` | `<html lang>` + rótulo do `#lang-toggle` |
| Menu mobile | — (efêmero) | `.nav-links.open` + `aria-expanded` |
| Seção ativa | — (efêmero) | `.nav-links a.active` + `aria-current` |
| Filtro ativo | — (efêmero) | `#project-filters button.active` |
| Projetos custom | `localStorage` (só em localhost) | injetados no grid |

**Tema** — fallback em cascata: `localStorage` → `prefers-color-scheme` → `'dark'`.

```js
initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const initialTheme = saved || (prefersDark ? 'dark' : 'light');
  this.DOM.html.setAttribute('data-theme', initialTheme);
  this.syncThemeA11y();

  this.DOM.themeBtn?.addEventListener('click', () => {
    const current = this.DOM.html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    this.DOM.html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    this.syncThemeA11y();
  });
}
syncThemeA11y() {
  const isDark = this.DOM.html.getAttribute('data-theme') === 'dark';
  this.DOM.themeBtn.setAttribute('type','button');
  this.DOM.themeBtn.setAttribute('aria-label',
    isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro');
}
```

> Não há troca de ícone por JS: os dois SVGs (`.sun` / `.moon`) estão sempre no DOM e o CSS decide qual aparece pelo seletor `:root[data-theme="light"]`. É a razão de o cross-fade ser suave.

### 4.3 i18n — dicionário + `data-i18n`

```js
const i18nDict = { pt: { 'nav-home':'Início', /* ...~250 chaves */ }, en: { ... } };

setLanguage(lang) {
  this.DOM.html.setAttribute('lang', lang === 'pt' ? 'pt-BR' : 'en');
  localStorage.setItem('language', lang);
  langBtn.textContent = lang === 'pt' ? 'EN' : 'PT';   // mostra o próximo idioma

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (i18nDict[lang]?.[key]) el.textContent = i18nDict[lang][key];
  });
  document.querySelectorAll('a[download]').forEach(link => { /* troca o PDF do CV */ });
  this.initCertificates(lang);   // re-renderiza a grelha traduzida
}
```

### 4.4 Menu mobile

```js
const toggleMenu = (forceClose = false) => {
  const isOpen  = this.DOM.navLinks.classList.contains('open');
  const willOpen = forceClose ? false : !isOpen;
  this.DOM.navLinks.classList.toggle('open', willOpen);
  this.DOM.navToggle.setAttribute('aria-expanded', String(willOpen));
  this.DOM.navToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
};
this.DOM.navToggle.addEventListener('click', () => toggleMenu());
this.DOM.navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(true)));
// click-outside
document.addEventListener('click', (e) => {
  if (this.DOM.navLinks.classList.contains('open')
      && !this.DOM.navLinks.contains(e.target)
      && !this.DOM.navToggle.contains(e.target)) toggleMenu(true);
});
// ESC
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(true); });
```

### 4.5 Reveal, smooth scroll e seção ativa (3 observers/delegações)

```js
initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.14 });
  this.DOM.reveals.forEach(el => observer.observe(el));   // sem unobserve: reveal é one-way
}

initSmoothScroll() {                       // delegação: funciona com conteúdo injetado
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const href = a.getAttribute('href');
    if (href && href.length > 1) {
      e.preventDefault();
      const id = href.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' });
      history.replaceState(null, '', '#' + id);   // replace, não push: não polui o histórico
    }
  });
}

initSectionHighlight() {
  const activeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.id;
      this.DOM.navItems.forEach((a, key) => {
        const isMatch = key === id;
        a.classList.toggle('active', isMatch);
        isMatch ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });   // faixa de ~5% no meio da tela
  this.DOM.sections.forEach(s => activeObserver.observe(s));
}
```

> O `rootMargin: '-40% 0px -55% 0px'` reduz a viewport a uma faixa fina no centro. Só a seção que cruza essa faixa fica ativa — sem debounce, sem `scroll` listener.

### 4.6 Filtro de projetos

Delegação no `#project-filters`; a transição é CSS (`.card` já tem `transition`) e o JS só orquestra `display` / `opacity` / `scale` com dois timeouts.

```js
this.DOM.filterBar.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-filter]');
  if (!btn) return;

  this.DOM.filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const filter = btn.dataset.filter;

  this.DOM.projectCards.forEach(card => {
    const tags = (card.dataset.tags || '').split(' ');
    const isMatch = filter === 'all' || tags.includes(filter);

    if (isMatch) {
      card.style.setProperty('display','flex','important');
      setTimeout(() => {                       // 10ms: força reflow p/ a transição rodar
        card.style.opacity = '1';
        card.style.transform = 'scale(1)';
      }, 10);
    } else {
      card.style.opacity = '0';
      card.style.transform = 'scale(0.95)';
      setTimeout(() => {                       // 400ms: espera a transição terminar
        if (card.style.opacity === '0') card.style.setProperty('display','none','important');
      }, 400);
    }
  });
});
```

### 4.7 Efeito magnético (o núcleo do "premium")

Um único listener global em `document`, com throttle por `requestAnimationFrame`, e **só em ponteiros finos** (não dispara em touch).

```js
initMagneticButtons() {
  let raf = null, lastEvent = null;
  const handler = (e) => {
    lastEvent = e;
    if (raf) return;                      // throttle: no máximo 1 update por frame
    raf = requestAnimationFrame(() => {
      raf = null;
      const ev = lastEvent;
      if (!ev) return;
      const t = ev.target.closest('.btn, .card');
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', `${ev.clientX - r.left}px`);
      t.style.setProperty('--my', `${ev.clientY - r.top}px`);
    });
  };
  if (window.matchMedia('(pointer:fine)').matches) {
    document.addEventListener('pointermove', handler);
  }
}
```

O JS só escreve duas custom properties; **quem desenha é o CSS** (`.card::before` e `.btn::after`). Zero manipulação de DOM por frame.

### 4.8 Contato — EmailJS com fallback `mailto:`

```js
const CONFIG = {
  SEND_MODE: 'emailjs',
  EMAILJS_SERVICE_ID:  'service_xk4sbkx',
  EMAILJS_TEMPLATE_ID: 'template_kebelwh',
  EMAILJS_PUBLIC_KEY:  'jDkz7HbrEe779bCuH',
  GAS_URL: '',
  CONTACT_EMAIL: 'allanbamirati@live.com'
};

const sendEmailJS = async (data) => {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method:'POST', headers:{'Content-Type':'application/json'},
    body: JSON.stringify({
      service_id: CONFIG.EMAILJS_SERVICE_ID,
      template_id: CONFIG.EMAILJS_TEMPLATE_ID,
      user_id: CONFIG.EMAILJS_PUBLIC_KEY,
      template_params: { from_name:data.name, reply_to:data.email, message:data.message }
    })
  });
  if (!res.ok) throw new Error('EmailJS error');
};

const sendMailto = (data) => {
  const subject = encodeURIComponent(`Contato via portfólio — ${data.name}`);
  const body = encodeURIComponent(`${data.message}\n\n${data.name} <${data.email}>`);
  window.location.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${subject}&body=${body}`;
};

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  successBox.style.display = 'none'; errorBox.style.display = 'none';
  const fd = new FormData(form);
  const data = { name:fd.get('name')?.trim(), email:fd.get('email')?.trim(), message:fd.get('message')?.trim() };

  if (!data.name || !data.email || !data.message) {
    errorBox.style.display = 'block';
    if (!data.name)    document.getElementById('name')   ?.setAttribute('aria-invalid','true');
    if (!data.email)   document.getElementById('email')  ?.setAttribute('aria-invalid','true');
    if (!data.message) document.getElementById('message')?.setAttribute('aria-invalid','true');
    return;
  }
  try {
    btn.disabled = true;                                  // trava o duplo-envio
    CONFIG.SEND_MODE === 'emailjs' ? await sendEmailJS(data) : sendMailto(data);
    form.reset();
    successBox.style.display = 'block';
  } catch (err) {
    errorBox.style.display = 'block';
  } finally { btn.disabled = false; }
});
```

**WhatsApp** — o card `#whats-card[data-whatsapp="5511947573410"]` monta o deep link com o texto do `<textarea>`:

```js
document.getElementById('whats-send')?.addEventListener('click', () => {
  const num = document.getElementById('whats-card').dataset.whatsapp;
  const msg = encodeURIComponent(document.getElementById('whats-message').value.trim());
  window.open(`https://wa.me/${num}?text=${msg}`, '_blank', 'noopener');
});
```

### 4.9 Certificados

`CERTIFICATES[]` (~50 objetos `{title, issuer, issued, code, url, tags}`) → `DocumentFragment` → um único `appendChild`. Todo campo passa por `escapeHTML()` antes de entrar no template literal. Re-renderiza a cada troca de idioma.

### 4.10 Extras

- `setupDynamicYears()` — `document.querySelectorAll('[data-year]')` recebe `new Date().getFullYear()`.
- `initLocalDevFeatures()` — só se `location.hostname` for `localhost`/`127.0.0.1`: abre modal para adicionar projetos, persistidos em `localStorage`.
- **JSON-LD `Person`** no `<head>` (schema.org) com `sameAs`, `alumniOf`, `knowsAbout`.

---

## 5. Código de Replicação

O arquivo `replica.html` entregue junto é uma reimplementação **autocontida e funcional** de tudo acima (tema, i18n, menu, reveal, spotlight, filtros, formulário, print styles). Abaixo estão os módulos isolados, prontos para copiar.

### 5.1 Esqueleto HTML

```html
<!doctype html>
<html lang="pt-BR" data-theme="dark">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Nome — Cargo</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap">
  <link rel="stylesheet" href="styles/style.css">
</head>
<body>
  <a class="skip-link" href="#inicio">Pular para conteúdo principal</a>

  <header class="navbar" role="banner">
    <div class="container inner">
      <a class="brand" href="/"><img class="logo" src="assets/logo.svg" alt="Logo"></a>
      <nav class="nav-links" id="nav-links" aria-label="Navegação Principal">
        <a href="#inicio"   data-i18n="nav-home"    class="active" aria-current="page">Início</a>
        <a href="#sobre"    data-i18n="nav-about">Sobre</a>
        <a href="#projetos" data-i18n="nav-projects">Projetos</a>
        <a href="#contato"  data-i18n="nav-contact">Contato</a>
      </nav>
      <button id="lang-toggle" class="btn secondary" type="button">EN</button>
      <button id="theme-toggle" class="icon-btn theme-toggle" type="button" aria-label="Alternar para tema claro">
        <svg class="sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4"></circle>
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"></path>
        </svg>
        <svg class="moon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"></path>
        </svg>
      </button>
      <button id="nav-toggle" class="nav-toggle" type="button" aria-controls="nav-links" aria-expanded="false" aria-label="Abrir menu">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
             stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M3 6h18M3 12h18M3 18h18"></path>
        </svg>
      </button>
    </div>
  </header>

  <main>
    <section id="inicio" class="hero container" aria-label="Apresentação">
      <div class="reveal intro">
        <span class="tag" style="margin-bottom:16px;display:inline-flex;align-items:center;gap:8px">
          <span class="pulse-dot"></span><span data-i18n="hero-badge">Disponível para novos desafios</span>
        </span>
        <h1 data-i18n="hero-title">Engenheiro de Software</h1>
        <p data-i18n="hero-desc">Descrição com <strong>destaques</strong>.</p>
        <div class="kpis">
          <span class="kpi">Java</span><span class="kpi">AWS</span><span class="kpi">Microsserviços</span>
        </div>
        <div class="hero-ctas">
          <a class="btn" href="#contato" data-i18n="hero-btn-talk">Fale Comigo</a>
          <a class="btn secondary" href="#" data-i18n="hero-btn-cv">Ver Currículo</a>
        </div>
      </div>
      <aside class="hero-side reveal">
        <div class="avatar" aria-hidden="true">
          <img src="img/foto.jpg" alt="" width="220" height="220" fetchpriority="high">
        </div>
        <div class="card">
          <ul class="stack-list">
            <li><svg viewBox="0 0 24 24" width="16" height="16" fill="var(--primary)" aria-hidden="true">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path></svg>
                Arquitetura &amp; Microsserviços</li>
          </ul>
        </div>
      </aside>
    </section>

    <section id="projetos" class="section" aria-labelledby="projetos-title">
      <div class="container">
        <h2 id="projetos-title" class="reveal">Projetos</h2>
        <p class="sub reveal">Subtítulo.</p>

        <div id="project-filters" class="reveal">
          <button class="btn secondary active" type="button" data-filter="all">Todos</button>
          <button class="btn secondary" type="button" data-filter="backend">Back-End</button>
          <button class="btn secondary" type="button" data-filter="data">Data</button>
        </div>

        <div class="grid cards">
          <article class="card project-card reveal" data-project data-tags="backend architecture">
            <img src="img/projeto.jpg" alt="" loading="lazy" decoding="async">
            <h3>Título</h3>
            <p>Descrição.</p>
            <div class="project-meta">
              <span class="tag skill indentificador Java">Java</span>
              <span class="tag skill indentificador Docker">Docker</span>
            </div>
            <div class="actions">
              <a class="btn" href="#" target="_blank" rel="noopener noreferrer">Deploy</a>
              <a class="btn secondary" href="#" target="_blank" rel="noopener noreferrer">Repositório</a>
            </div>
          </article>
        </div>
      </div>
    </section>
  </main>
</body>
</html>
```

### 5.2 CSS — módulo `disabled` (ausente no original, recomendado)

```css
.btn[disabled], .btn[aria-disabled="true"] {
  opacity: .45;
  cursor: not-allowed;
  pointer-events: none;      /* mata hover, ::after e translateY */
  filter: grayscale(.4);
  box-shadow: none;
  transform: none;
}
```

### 5.3 JS — arquivo modular completo

```js
/* app.js — replicação */
const i18nDict = {
  pt: { 'nav-home':'Início', 'nav-about':'Sobre', 'nav-projects':'Projetos', 'nav-contact':'Contato' },
  en: { 'nav-home':'Home',   'nav-about':'About', 'nav-projects':'Projects', 'nav-contact':'Contact' }
};

const escapeHTML = (s = '') => String(s).replace(/[&<>"']/g,
  c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c]));

class PortfolioApp {
  constructor() {
    this.DOM = {
      html:  document.documentElement,
      navToggle: document.querySelector('#nav-toggle'),
      navLinks:  document.querySelector('#nav-links'),
      themeBtn:  document.querySelector('#theme-toggle'),
      langBtn:   document.querySelector('#lang-toggle'),
      filterBar: document.querySelector('#project-filters'),
      projectCards: document.querySelectorAll('[data-project]'),
      reveals:   document.querySelectorAll('.reveal'),
      sections:  document.querySelectorAll('section[id]'),
      contactForm: document.querySelector('#contact-form'),
      navItems: new Map([...document.querySelectorAll('.nav-links a[href^="#"]')]
        .map(a => [a.getAttribute('href').slice(1), a]))
    };
    this.init();
  }

  init() {
    this.initTheme();
    this.initI18n();
    this.initNavigation();
    this.initScrollReveal();
    this.initSmoothScroll();
    this.initSectionHighlight();
    this.initProjectFilters();
    this.initMagneticButtons();
    this.initContactHandling();
    this.setupDynamicYears();
  }

  /* --- 1. TEMA --- */
  initTheme() {
    let saved = null;
    try { saved = localStorage.getItem('theme'); } catch {}
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    this.DOM.html.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
    this.syncThemeA11y();

    this.DOM.themeBtn?.addEventListener('click', () => {
      const next = this.DOM.html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      this.DOM.html.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch {}
      this.syncThemeA11y();
    });
  }
  syncThemeA11y() {
    if (!this.DOM.themeBtn) return;
    const isDark = this.DOM.html.getAttribute('data-theme') === 'dark';
    this.DOM.themeBtn.setAttribute('aria-label', isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro');
  }

  /* --- 2. i18n --- */
  initI18n() {
    const btn = this.DOM.langBtn; if (!btn) return;
    let lang = 'pt';
    try { lang = localStorage.getItem('language') || 'pt'; } catch {}

    const setLanguage = (l) => {
      this.DOM.html.setAttribute('lang', l === 'pt' ? 'pt-BR' : 'en');
      try { localStorage.setItem('language', l); } catch {}
      btn.textContent = l === 'pt' ? 'EN' : 'PT';
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const val = i18nDict[l]?.[key];
        if (val) el.textContent = val;
      });
    };
    setLanguage(lang);
    btn.addEventListener('click', () => {
      lang = lang === 'pt' ? 'en' : 'pt';
      setLanguage(lang);
    });
  }

  /* --- 3. NAV MOBILE --- */
  initNavigation() {
    const { navToggle, navLinks } = this.DOM;
    if (!navToggle || !navLinks) return;
    const toggleMenu = (forceClose = false) => {
      const willOpen = forceClose ? false : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    };
    navToggle.addEventListener('click', () => toggleMenu());
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(true)));
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) toggleMenu(true);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggleMenu(true); });
  }

  /* --- 4. REVEAL --- */
  initScrollReveal() {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.14 });
    this.DOM.reveals.forEach(el => io.observe(el));
  }

  /* --- 5. SMOOTH SCROLL --- */
  initSmoothScroll() {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href || href.length <= 1) return;
      e.preventDefault();
      const id = href.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' });
      history.replaceState(null, '', '#' + id);
    });
  }

  /* --- 6. SEÇÃO ATIVA --- */
  initSectionHighlight() {
    if (!this.DOM.sections.length || !this.DOM.navItems.size) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        this.DOM.navItems.forEach((a, key) => {
          const match = key === id;
          a.classList.toggle('active', match);
          match ? a.setAttribute('aria-current','page') : a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    this.DOM.sections.forEach(s => io.observe(s));
  }

  /* --- 7. FILTROS --- */
  initProjectFilters() {
    const { filterBar, projectCards } = this.DOM;
    if (!filterBar || !projectCards.length) return;
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;

      projectCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        const match = filter === 'all' || tags.includes(filter);
        if (match) {
          card.style.setProperty('display','flex','important');
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => {
            if (card.style.opacity === '0') card.style.setProperty('display','none','important');
          }, 400);
        }
      });
    });
  }

  /* --- 8. SPOTLIGHT MAGNÉTICO --- */
  initMagneticButtons() {
    if (!matchMedia('(pointer:fine)').matches) return;
    let raf = null, last = null;
    document.addEventListener('pointermove', (e) => {
      last = e;
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const t = last?.target.closest('.btn, .card');
        if (!t) return;
        const r = t.getBoundingClientRect();
        t.style.setProperty('--mx', `${last.clientX - r.left}px`);
        t.style.setProperty('--my', `${last.clientY - r.top}px`);
      });
    }, { passive: true });
  }

  /* --- 9. FORMULÁRIO --- */
  initContactHandling() {
    const form = this.DOM.contactForm; if (!form) return;
    const ok  = form.querySelector('.success');
    const bad = form.querySelector('.error');
    const CONFIG = { SEND_MODE:'mailto', CONTACT_EMAIL:'voce@exemplo.com' };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      ok.style.display = bad.style.display = 'none';
      const fd = new FormData(form);
      const data = {
        name:    (fd.get('name')    || '').trim(),
        email:   (fd.get('email')   || '').trim(),
        message: (fd.get('message') || '').trim()
      };
      ['name','email','message'].forEach(k =>
        form.querySelector(`#${k}`)?.setAttribute('aria-invalid', String(!data[k])));

      if (!data.name || !data.email || !data.message) { bad.style.display = 'block'; return; }

      const submitBtn = form.querySelector('button[type=submit]');
      try {
        submitBtn.disabled = true;
        const subject = encodeURIComponent(`Contato via portfólio — ${data.name}`);
        const body    = encodeURIComponent(`${data.message}\n\n${data.name} <${data.email}>`);
        location.href = `mailto:${CONFIG.CONTACT_EMAIL}?subject=${subject}&body=${body}`;
        form.reset();
        ok.style.display = 'block';
      } catch { bad.style.display = 'block'; }
      finally { submitBtn.disabled = false; }
    });
  }

  setupDynamicYears() {
    const y = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = y; });
  }
}

document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
```

---

## Observações técnicas

**Pontos fortes do original**
- Tokens 100% em custom properties → troca de tema por 1 atributo, sem reflow de classes.
- `pointermove` global + `requestAnimationFrame` + gate `(pointer:fine)` → spotlight sem custo em mobile.
- IntersectionObserver em vez de listeners de `scroll` nos dois casos (reveal e nav ativa).
- `@media (prefers-reduced-motion: reduce)` desliga tudo com `*{animation:none!important;transition:none!important}`.
- `@media print` dedicado — o CV imprime limpo.
- `escapeHTML()` em todo conteúdo injetado por template literal.

**Problemas a corrigir na sua réplica**
1. **Chaves EmailJS expostas no client** (`service_id`, `template_id`, `public_key` em texto puro). A public key do EmailJS é pública por design, mas sem *domain allowlist* configurada no painel qualquer um pode usar sua cota. Ative a restrição de domínio ou mova o envio para uma serverless function.
2. **`.indentificador`** — typo de `identificador`, propagado em HTML e CSS. Renomeie antes de crescer o projeto.
3. **Sem estado `disabled`** nos botões (ver 5.2).
4. **`!important` em excesso** no CSS de cards (`padding`, `display`, `gap`, `margin`). Sintoma de guerra de especificidade com os `<style>` inline do HTML. Consolide num só arquivo.
5. **`data-project` vazio** — funciona como marcador booleano; melhor usar `data-project="slug"` para permitir deep-link.
6. **`aria-hidden="true"` no `.avatar`** com `<img alt="Foto de Allan">` dentro: o `alt` fica inacessível. Ou remova o `aria-hidden`, ou deixe o `alt=""`.
7. **JSON-LD com placeholder** — `"url": "https://seusite.com"` ainda não foi trocado pelo domínio real.
