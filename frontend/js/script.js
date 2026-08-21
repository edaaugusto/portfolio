if('scrollRestoration' in history) history.scrollRestoration = 'manual';
window.scrollTo(0, 0);
window.addEventListener('load', () => window.scrollTo(0, 0));

/* ============================================================ */
/* i18n dictionary                                              */
/* ============================================================ */
const i18nDict = {
  pt: {},   // PT é o texto que já está no HTML
  en: {
    'nav-home':'Home','nav-about':'About','nav-projects':'Projects','nav-cv':'Resume','nav-contact':'Contact',
    'hero-title':'Junior Full-Stack Developer',
    'hero-desc':'Undergraduate in Systems Analysis and Development, with hands-on experience in full-stack web development and data analysis. Looking for an internship or junior role to get hands-on and keep learning.',
    'hero-btn-talk':'Get in touch','hero-btn-cv':'View Projects',
    'stack-1':'Full-Stack Web Development (Node.js, MySQL & EJS)','stack-2':'Business Intelligence (Power BI, DAX & ETL)','stack-3':'Java, Python & Cloud fundamentals (GCP/AWS)',
    'about-title':'About me','about-sub':'From sales and a call center to tech — building my path through practice, communication and a will to learn.',
    'about-c1-t':'My Journey','about-c1-d':'I started early, balancing a technical high school in Web Development with freelance gigs at events and helping my family. I worked as a salesperson at a surf shop, then spent nearly two years at a call center, where I developed public speaking, negotiation skills and a solid grasp of interest rates and deals.',
    'about-c2-t':'Education','about-c2-d':'Technical degree in Web Development from FIEB (2021–2023). Currently studying Systems Analysis and Development at Universidade Cruzeiro do Sul (2024–present), focused on development, programming, project management and agile methodologies.',
    'about-c3-t':'Skills & Tools','about-c3-d':'Java, Node.js, MySQL and Python, always improving.',
    'skill-1':'Google Cloud Computing Foundations certification','skill-2':'Power BI — Senai','skill-3':'Informática — Microcamp','skill-4':'Generative AI Solutions with AWS','skill-link':'View certificate',
    'proj-title':'Featured Projects','proj-sub':'A selection of hands-on projects in web development, data and design.',
    'cv-title':'Resume','cv-sub':'My professional journey summarized in one place.',
    'cv-resumo-title':'Summary','cv-resumo-text':'Undergraduate in Systems Analysis and Development, I found my way into tech after a path through sales and nearly two years at a call center — experiences that gave me public speaking, negotiation skills and a sharp read on deals. I have hands-on knowledge in Java, MySQL and full-stack web development, proven in the Accex academic project, plus data analysis skills with Power BI (Dashboards and DAX) and a Google Cloud Computing Foundations certification. I\'m also enthusiastic about Artificial Intelligence, studying Generative AI solutions with AWS services. Looking for an internship or junior opportunity, bringing adaptability, good communication and a genuine will to learn.',
    'cv-projetos-title':'Projects',
    'cv-proj-1-t':'Accex — Urban Accessibility','cv-proj-1-d':'Full-stack web platform (Node.js, MySQL, EJS) for urban accessibility classification — technical school capstone project.',
    'cv-proj-2-t':'Sales Analytics Dashboard','cv-proj-2-d':'Hands-on Power BI project with ETL, data modeling and DAX measures to track sales performance and business indicators.',
    'cv-proj-3-t':'Visual Identity — F M Locação','cv-proj-3-d':'Project management, branding, digital materials and ongoing Instagram marketing management (reels, photos and videos).',
    'cv-formacao-title':'Education',
    'cv-form-1-t':'Systems Analysis and Development','cv-form-1-y':'Aug.2024 – Present','cv-form-1-d':'Universidade Cruzeiro do Sul',
    'cv-form-2-t':'Technical High School in Web Development','cv-form-2-y':'Jan.2021 – Dec.2023','cv-form-2-d':'FIEB — Fundação Instituto de Educação de Barueri',
    'cv-certificacoes-title':'Certifications',
    'cv-cert-1-t':'Google Cloud Computing Foundations','cv-cert-1-link':'View certificate',
    'cv-cursos-title':'Courses',
    'cv-curso-1-t':'Power BI','cv-curso-1-d':'Business Intelligence with Microsoft Power BI, data handling and treatment, dashboard and report development.',
    'cv-curso-2-t':'Computing','cv-curso-2-d':'General technology concepts, Office suite (Word, Excel, PowerPoint), image editing with Adobe Photoshop.',
    'cv-curso-3-t':'Generative AI Solutions with AWS','cv-curso-3-d':'Hands-on study of Generative AI solutions using AWS services.',
    'f-all':'All','f-web':'Web','f-data':'Data','f-design':'Design',
    'p1-t':'Accex — Urban Accessibility','p1-d':'Full-stack web platform for urban accessibility classification, built as a group capstone project.',
    'p2-t':'Sales Analytics Dashboard','p2-d':'Hands-on Power BI project with ETL, data modeling and DAX measures to track sales performance and business indicators.',
    'p3-t':'Visual Identity — F M Locação','p3-d':'Consulting, project management and visual identity creation for a local business: logo, digital materials and ongoing Instagram marketing, producing reels, photos and videos.',
    'btn-deploy':'Open Deploy','btn-site':'Open Site','btn-repo':'Repository','btn-insta':'View Instagram','proj-all':'See more on GitHub',
    'contact-title':'Contact','contact-sub':'Looking for a dedicated intern or junior developer for your team? Let’s talk.',
    'wpp-title':'Direct Call','wpp-desc':'Send a direct WhatsApp message for an immediate reply.','lbl-msg2':'Your Message','wpp-btn':'Send on WhatsApp',
    'mail-title':'Via E-mail','mail-desc':'Prefer the formality of e-mail? Fill in the fields below.',
    'lbl-name':'Full Name','lbl-email':'E-mail Address','lbl-msg':'Opportunity Details','btn-send':'Send E-mail',
    'msg-ok':'Excellent! Message sent successfully.','msg-err':'Please check that all fields are filled in correctly.',
    'footer-title':'Let’s build the future together?','footer-desc':'Open to internships or entry-level tech roles — development, data, or wherever I can add value to the team.',
    'footer-btn':'Review Résumé','footer-copy':'Built with clean code (pure HTML/CSS/JS).','footer-back':'Back to top'
  }
};

/* ============================================================ */
/* PortfolioApp                                                 */
/* ============================================================ */
class PortfolioApp {
  constructor(){
    this.DOM = {
      html: document.documentElement,
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
    this.ptSnapshot = new Map();
    [...document.querySelectorAll('[data-i18n]')].forEach(el =>
      this.ptSnapshot.set(el, el.textContent));
    this.init();
  }

  init(){
    this.initTheme();
    this.initI18n();
    this.initNavigation();
    this.initHeroIntro();
    this.initScrollReveal();
    this.initSmoothScroll();
    this.initSectionHighlight();
    this.initProjectFilters();
    this.initMagneticButtons();
    this.initContactHandling();
    this.setupDynamicYears();
  }

  /* --- TEMA --- */
  initTheme(){
    let saved = null; try { saved = localStorage.getItem('theme'); } catch(e){}
    const prefersDark = matchMedia('(prefers-color-scheme: dark)').matches;
    this.DOM.html.setAttribute('data-theme', saved || (prefersDark ? 'dark' : 'light'));
    this.syncThemeA11y();
    this.DOM.themeBtn?.addEventListener('click', () => {
      const next = this.DOM.html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      this.DOM.html.setAttribute('data-theme', next);
      try { localStorage.setItem('theme', next); } catch(e){}
      this.syncThemeA11y();
    });
  }
  syncThemeA11y(){
    if(!this.DOM.themeBtn) return;
    const isDark = this.DOM.html.getAttribute('data-theme') === 'dark';
    this.DOM.themeBtn.setAttribute('aria-label', isDark ? 'Alternar para tema claro' : 'Alternar para tema escuro');
  }

  /* --- i18n --- */
  initI18n(){
    const btn = this.DOM.langBtn; if(!btn) return;
    let lang = 'pt'; try { lang = localStorage.getItem('language') || 'pt'; } catch(e){}
    const setLanguage = (l) => {
      this.DOM.html.setAttribute('lang', l === 'pt' ? 'pt-BR' : 'en');
      try { localStorage.setItem('language', l); } catch(e){}
      btn.textContent = l === 'pt' ? 'EN' : 'PT';
      this.ptSnapshot.forEach((ptText, el) => {
        const key = el.getAttribute('data-i18n');
        el.textContent = (l === 'pt') ? ptText : (i18nDict.en[key] ?? ptText);
      });
    };
    setLanguage(lang);
    btn.addEventListener('click', () => { lang = lang === 'pt' ? 'en' : 'pt'; setLanguage(lang); });
  }

  /* --- NAV MOBILE --- */
  initNavigation(){
    const { navToggle, navLinks } = this.DOM;
    if(!navToggle || !navLinks) return;
    const toggleMenu = (forceClose=false) => {
      const willOpen = forceClose ? false : !navLinks.classList.contains('open');
      navLinks.classList.toggle('open', willOpen);
      navToggle.setAttribute('aria-expanded', String(willOpen));
      navToggle.setAttribute('aria-label', willOpen ? 'Fechar menu' : 'Abrir menu');
    };
    navToggle.addEventListener('click', () => toggleMenu());
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => toggleMenu(true)));
    document.addEventListener('click', (e) => {
      if(navLinks.classList.contains('open') && !navLinks.contains(e.target) && !navToggle.contains(e.target)) toggleMenu(true);
    });
    document.addEventListener('keydown', (e) => { if(e.key === 'Escape') toggleMenu(true); });
  }

  /* --- INTRO DO HERO (decodificação + encaixe) ---
     Por padrão (sem JS, ou se algo aqui falhar) o Hero já mostra o
     layout final, totalmente visível — este método só adiciona a
     animação por cima quando consegue rodar até o fim. */
  initHeroIntro(){
    const stage = document.querySelector('#inicio');
    const namePanel = document.querySelector('#hero-namepanel');
    const eyebrow = document.querySelector('#hnp-eyebrow');
    const fullname = document.querySelector('#hnp-fullname');
    const brand = document.querySelector('.brand');
    if(!stage || !namePanel || !eyebrow || !fullname) return;

    const eyebrowText = eyebrow.textContent;
    const fullnameText = fullname.textContent;
    const GLITCH_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ#$%&*';
    let introToken = 0;
    let panelAnim = null;

    const glitchInto = (el, text, token, onDone) => {
      el.innerHTML = '';
      const spans = text.split('').map(ch => {
        const s = document.createElement('span');
        s.className = 'pending';
        s.textContent = ch === ' ' ? ' ' : ch;
        el.appendChild(s);
        return s;
      });
      let settled = 0;
      spans.forEach((span, i) => {
        if(text[i] === ' '){ settled++; return; }
        let ticks = 0;
        const maxTicks = 4 + Math.floor(Math.random()*3) + Math.floor(i/2);
        const iv = setInterval(() => {
          if(token !== introToken){ clearInterval(iv); return; }
          ticks++;
          if(ticks < maxTicks){
            span.textContent = GLITCH_CHARS[Math.floor(Math.random()*GLITCH_CHARS.length)];
          } else {
            span.textContent = text[i];
            span.className = '';
            clearInterval(iv);
            settled++;
            if(settled >= text.length && onDone) onDone();
          }
        }, 95);
      });
    };

    const expandToHero = (token) => {
      if(token !== introToken) return;
      const first = namePanel.getBoundingClientRect();
      document.body.classList.remove('intro-cover');
      const last = namePanel.getBoundingClientRect();
      const dx = first.left - last.left;
      const dy = first.top - last.top;
      const sx = first.width / last.width;
      const sy = first.height / last.height;
      if(panelAnim) panelAnim.cancel();
      panelAnim = namePanel.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
        { transform: 'translate(0px, 0px) scale(1, 1)' }
      ], { duration: 1100, easing: 'cubic-bezier(.65,0,.35,1)', fill: 'forwards' });
    };

    const playIntro = () => {
      const token = ++introToken;
      try {
        if(panelAnim){ panelAnim.cancel(); panelAnim = null; }
        window.scrollTo(0, 0);
        document.body.classList.add('intro-cover');
        requestAnimationFrame(() => window.scrollTo(0, 0));
        setTimeout(() => window.scrollTo(0, 0), 50);
        let doneCount = 0;
        const checkBoth = () => {
          if(token !== introToken) return;
          doneCount++;
          if(doneCount === 2) setTimeout(() => expandToHero(token), 1800);
        };
        glitchInto(eyebrow, eyebrowText, token, checkBoth);
        glitchInto(fullname, fullnameText, token, checkBoth);
      } catch(e) {
        document.body.classList.remove('intro-cover');
      }
    };

    playIntro();
    if(brand) brand.addEventListener('click', playIntro);
  }

  /* --- REVEAL --- */
  initScrollReveal(){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.14 });
    this.DOM.reveals.forEach(el => io.observe(el));
  }

  /* --- SMOOTH SCROLL --- */
  initSmoothScroll(){
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if(!a) return;
      const href = a.getAttribute('href');
      if(!href || href.length <= 1) return;
      e.preventDefault();
      const id = href.slice(1);
      document.getElementById(id)?.scrollIntoView({ behavior:'smooth', block:'start' });
      history.replaceState(null, '', '#' + id);
    });
  }

  /* --- SEÇÃO ATIVA --- */
  initSectionHighlight(){
    if(!this.DOM.sections.length || !this.DOM.navItems.size) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(!entry.isIntersecting) return;
        const id = entry.target.id;
        this.DOM.navItems.forEach((a, key) => {
          const match = key === id;
          a.classList.toggle('active', match);
          if(match) a.setAttribute('aria-current','page'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 });
    this.DOM.sections.forEach(s => io.observe(s));
  }

  /* --- FILTROS --- */
  initProjectFilters(){
    const { filterBar, projectCards } = this.DOM;
    if(!filterBar || !projectCards.length) return;
    filterBar.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if(!btn) return;
      filterBar.querySelectorAll('button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(/\s+/);
        const match = filter === 'all' || tags.includes(filter);
        if(match){
          card.style.setProperty('display','flex','important');
          setTimeout(() => { card.style.opacity = '1'; card.style.transform = 'scale(1)'; }, 10);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'scale(0.95)';
          setTimeout(() => { if(card.style.opacity === '0') card.style.setProperty('display','none','important'); }, 400);
        }
      });
    });
  }

  /* --- SPOTLIGHT MAGNÉTICO --- */
  initMagneticButtons(){
    if(!matchMedia('(pointer:fine)').matches) return;
    let raf = null, last = null;
    document.addEventListener('pointermove', (e) => {
      last = e;
      if(raf) return;
      raf = requestAnimationFrame(() => {
        raf = null;
        const t = last && last.target.closest && last.target.closest('.btn, .card');
        if(!t) return;
        const r = t.getBoundingClientRect();
        t.style.setProperty('--mx', (last.clientX - r.left) + 'px');
        t.style.setProperty('--my', (last.clientY - r.top)  + 'px');
      });
    }, { passive:true });
  }

  /* --- CONTATO --- */
  initContactHandling(){
    const form = this.DOM.contactForm;
    if(form){
      const ok  = form.querySelector('.success');
      const bad = form.querySelector('.error');
      const CONTACT_EMAIL = form.dataset.emailTo;
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        ok.style.display = 'none'; bad.style.display = 'none';
        const fd = new FormData(form);
        const data = {
          name:    (fd.get('name')    || '').trim(),
          email:   (fd.get('email')   || '').trim(),
          message: (fd.get('message') || '').trim()
        };
        ['name','email','message'].forEach(k =>
          form.querySelector('#' + k)?.setAttribute('aria-invalid', String(!data[k])));
        if(!data.name || !data.email || !data.message){ bad.style.display = 'block'; return; }

        const submitBtn = form.querySelector('button[type=submit]');
        submitBtn.disabled = true;
        const subject = encodeURIComponent('Contato via portfólio — ' + data.name);
        const body    = encodeURIComponent(data.message + '\n\n' + data.name + ' <' + data.email + '>');
        window.location.href = 'mailto:' + CONTACT_EMAIL + '?subject=' + subject + '&body=' + body;
        form.reset();
        ok.style.display = 'block';
        setTimeout(() => { submitBtn.disabled = false; }, 800);
      });
    }

    document.getElementById('whats-send')?.addEventListener('click', () => {
      const num = document.getElementById('whats-card').dataset.whatsapp;
      const msg = encodeURIComponent(document.getElementById('whats-message').value.trim());
      window.open('https://wa.me/' + num + '?text=' + msg, '_blank', 'noopener');
    });
  }

  setupDynamicYears(){
    const y = new Date().getFullYear();
    document.querySelectorAll('[data-year]').forEach(el => { el.textContent = y; });
  }
}

document.addEventListener('DOMContentLoaded', () => new PortfolioApp());
