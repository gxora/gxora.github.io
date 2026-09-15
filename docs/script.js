const STRINGS = {
  ru: {
    aboutText: 'GXora — небольшая студия, которая делает цифровые проекты и творческие штуки: от программ и игр до визуальных экспериментов. Формат может быть любым — важно, чтобы получалось по-человечески, понятно и надолго.',
    newsEmpty: 'Записей пока нет — скоро здесь будет что почитать.',
    contactLabel: 'написать',
    status: { actively: 'в работе', concept: 'концепт', frozen: 'заморожен', canceled: 'закрыт' },
  },
  en: {
    aboutText: 'GXora is a small studio building digital projects and creative work — software, games, visual experiments. The format varies, but the goal stays the same: make things that feel human, clear, and worth sticking around.',
    newsEmpty: 'Nothing posted yet — check back soon.',
    contactLabel: 'reach out',
    status: { actively: 'active', concept: 'concept', frozen: 'frozen', canceled: 'canceled' },
  },
};

const SECTIONS = ['about', 'projects', 'news'];
let currentLang = localStorage.getItem('gxora-lang') || 'ru';
let projectsData = [];

function applyLang() {
  const t = STRINGS[currentLang];
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.dataset.i18n;
    if (t[key] !== undefined) el.textContent = t[key];
  });
  document.getElementById('lang-ru').classList.toggle('active', currentLang === 'ru');
  document.getElementById('lang-en').classList.toggle('active', currentLang === 'en');
  renderProjects();
}

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('gxora-lang', lang);
  applyLang();
}

function renderProjects() {
  const container = document.getElementById('projects-grid');
  const t = STRINGS[currentLang];
  container.textContent = '';

  for (const project of projectsData) {
    const link = document.createElement('a');
    link.className = 'project-card';
    link.href = project.url;

    const top = document.createElement('span');
    top.className = 'project-card-top';

    const name = document.createElement('span');
    name.className = 'project-name';
    name.textContent = project.name;

    const badge = document.createElement('span');
    badge.className = `badge status-${project.status}`;
    badge.textContent = t.status[project.status] || project.status;

    top.appendChild(name);
    top.appendChild(badge);

    const desc = document.createElement('span');
    desc.className = 'project-desc';
    desc.textContent = (project.desc && project.desc[currentLang]) || '';

    link.appendChild(top);
    link.appendChild(desc);
    container.appendChild(link);
  }
}

async function loadProjects() {
  try {
    const response = await fetch('projects.json', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Projects request failed: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data.projects)) throw new Error('Projects response must contain a projects array.');
    projectsData = data.projects;
  } catch (error) {
    console.error(error);
    projectsData = [];
  }
  renderProjects();
}

function setupNav() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const target = document.getElementById(item.dataset.target);
      if (!target) return;
      const top = target.getBoundingClientRect().top + window.pageYOffset - 48;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  function computeActive() {
    const line = 90;
    let current = SECTIONS[0];
    for (const key of SECTIONS) {
      const node = document.getElementById(key);
      if (!node) continue;
      if (node.getBoundingClientRect().top <= line) current = key;
    }
    navItems.forEach((item) => item.classList.toggle('active', item.dataset.target === current));
  }

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => { computeActive(); ticking = false; });
  }, { passive: true });
  window.addEventListener('resize', computeActive);
  computeActive();
}

document.getElementById('lang-ru').addEventListener('click', () => setLang('ru'));
document.getElementById('lang-en').addEventListener('click', () => setLang('en'));

loadProjects().then(applyLang);
setupNav();
