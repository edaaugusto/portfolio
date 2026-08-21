/* ============================================================ */
/* i18n dictionary                                              */
/* ============================================================ */
const i18nDict = {
  pt: {},   // PT é o texto que já está no HTML
  en: {
    'nav-home':'Home','nav-about':'About','nav-projects':'Projects','nav-cv':'Resume','nav-contact':'Contact',
    'hero-title':'Software Engineer',
    'hero-desc':'Focused on software architecture, distributed systems and cloud infrastructure. Resilient APIs, microservices and high-performance data pipelines.',
    'hero-btn-talk':'Get in touch','hero-btn-cv':'View Projects',
    'stack-1':'Architecture, Microservices & DDD','stack-2':'Cloud (AWS), Docker & Kubernetes','stack-3':'Java, Python, Node.js & TypeScript',
    'about-title':'About me','about-sub':'Passionate about solving complex problems through clean code and robust architectures.',
    'about-c1-t':'Education','about-c1-d':'Systems Analysis and Development. Focus on Software Engineering, Data Science and Big Data. 50+ certifications in Cloud, DevOps and Back-End.',
    'about-c2-t':'Backend & Architecture','about-c2-d':'Java, Python, Node.js and SQL. Microservices, Serverless, AWS, CQRS, Circuit Breaker, SAGA and Event-Driven Architecture. PostgreSQL and MongoDB.',
    'about-c3-t':'DevOps & Quality','about-c3-d':'Docker, Kubernetes, CI/CD (GitHub Actions), Apache Airflow. TDD, Clean Architecture, advanced Git flow and agile methodologies.',
    'proj-title':'Featured Projects','proj-sub':'A selection of my most complex back-end architectures and data integrations.',
    'cv-title':'Resume','cv-sub':'My professional journey summarized in one place.',
    'f-all':'All','f-arch':'Architecture','f-back':'Back-End','f-data':'Data',
    'p1-t':'BazaBank Core','p1-d':'Simulated banking core system focused on secure processing of financial operations using microservices and distributed messaging.',
    'p2-t':'CarefulBaza','p2-d':'Dropshipping e-commerce platform focused on resilience and high availability.',
    'p3-t':'Data Dashboard','p3-d':'ETL pipeline and analytics dashboard with ingestion, transformation and near real-time visualization of operational metrics.',
    'btn-deploy':'Open Deploy','btn-site':'Open Site','btn-repo':'Repository','proj-all':'See full project portfolio',
    'contact-title':'Contact','contact-sub':'Need a dedicated engineer for your team or project? Let’s talk.',
    'wpp-title':'Direct Call','wpp-desc':'Send a direct WhatsApp message for an immediate reply.','lbl-msg2':'Your Message','wpp-btn':'Send on WhatsApp',
    'mail-title':'Via E-mail','mail-desc':'Prefer the formality of e-mail? Fill in the fields below.',
    'lbl-name':'Full Name','lbl-email':'E-mail Address','lbl-msg':'Opportunity Details','btn-send':'Send E-mail',
    'msg-ok':'Excellent! Message sent successfully.','msg-err':'Please check that all fields are filled in correctly.',
    'footer-title':'Let’s build the future together?','footer-desc':'Open to challenges requiring robust architecture and complex problem solving.',
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
