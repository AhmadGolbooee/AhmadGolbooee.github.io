const I18N = {
  en: {
    "nav.home": "Home",
    "nav.about": "About",
    "nav.stack": "Stack",
    "nav.projects": "Projects",
    "nav.now": "Now",
    "nav.contact": "Contact",
    "hero.available": "Open to new opportunities",
    "hero.name": "Ahmad Golbooee",
    "hero.role": "Software Developer · Physics Student",
    "hero.location": "Isfahan University of Technology — Isfahan, Iran",
    "hero.ctaContact": "Get in touch",
    "facts.role": "Role",
    "facts.roleVal": "Software Developer",
    "facts.focus": "Focus",
    "facts.focusVal": "Physics × Code",
    "facts.base": "Based in",
    "facts.baseVal": "Isfahan, Iran",
    "about.title": "About",
    "about.body": "I'm a software developer and physics student at Isfahan University of Technology (IUT). I enjoy turning ideas into working software and exploring the intersection of math, physics, and code.",
    "about.body2": "My work leans toward numerical methods and computational physics — writing simulations, visualising results, and building small tools that make hard problems easier to reason about.",
    "stack.title": "Toolbox",
    "projects.title": "Projects",
    "now.title": "Currently",
    "contact.title": "Contact",
    "contact.body": "Feel free to reach out about collaboration, questions, or anything physics- and code-related.",
    "foot.built": "Built with plain HTML, CSS and JavaScript.",
    "stack.langs": "Languages",
    "stack.frameworks": "Frameworks / Libraries",
    "stack.tools": "Tools & Platforms",
    "project.profile.title": "AhmadGolbooee",
    "project.profile.desc": "Profile README repository — a home for my GitHub presence, README and public notes.",
    "project.profile.stack": "Markdown",
    "project.view": "View repository",
    "now.building": "Building",
    "now.building.desc": "Small tools to solve physics and coding problems.",
    "now.learning": "Learning",
    "now.learning.desc": "Data structures & algorithms, computational physics.",
    "now.reading": "Reading",
    "now.reading.desc": "Technical books and research notes.",
    "now.building.label": "Build",
    "now.learning.label": "Learn",
    "now.reading.label": "Read"
  },
  fa: {
    "nav.home": "خانه",
    "nav.about": "درباره من",
    "nav.stack": "مهارت‌ها",
    "nav.projects": "پروژه‌ها",
    "nav.now": "الان",
    "nav.contact": "تماس",
    "hero.available": "آماده همکاری و پذیرش فرصت جدید",
    "hero.name": "احمد گلبویی",
    "hero.role": "توسعه‌دهنده نرم‌افزار · دانشجوی فیزیک",
    "hero.location": "دانشگاه صنعتی اصفهان — اصفهان، ایران",
    "hero.ctaContact": "تماس بگیرید",
    "facts.role": "نقش",
    "facts.roleVal": "توسعه‌دهنده نرم‌افزار",
    "facts.focus": "تمرکز",
    "facts.focusVal": "فیزیک × کد",
    "facts.base": "محل سکونت",
    "facts.baseVal": "اصفهان، ایران",
    "about.title": "درباره من",
    "about.body": "من توسعه‌دهنده نرم‌افزار و دانشجوی فیزیک در دانشگاه صنعتی اصفهان هستم. تبدیل ایده‌ها به نرم‌افزارهای در حال اجرا و بررسی تلاقی ریاضی، فیزیک و کد را دوست دارم.",
    "about.body2": "کارهایم بیشتر سمت روش‌های عددی و فیزیک محاسباتی است — شبیه‌سازی، مصورسازی نتایج و ساخت ابزارهای کوچکی که حل مسائل سخت را ساده‌تر می‌کنند.",
    "stack.title": "جعبه‌ابزار",
    "projects.title": "پروژه‌ها",
    "now.title": "الان",
    "contact.title": "تماس",
    "contact.body": "برای همکاری، پرسش یا هر موضوع مرتبط با فیزیک و برنامه‌نویسی خوشحال می‌شوم پیام بدهید.",
    "foot.built": "ساخته‌شده با HTML، CSS و JavaScript خالص.",
    "stack.langs": "زبان‌ها",
    "stack.frameworks": "فریم‌ورک‌ها و کتابخانه‌ها",
    "stack.tools": "ابزارها و پلتفرم‌ها",
    "project.profile.title": "AhmadGolbooee",
    "project.profile.desc": "ریپوی پروفایل — خانه‌ی حضور من در گیت‌هاب، شامل ریدمی و یادداشت‌های عمومی.",
    "project.profile.stack": "مارک‌داون",
    "project.view": "مشاهده ریپو",
    "now.building": "در حال ساخت",
    "now.building.desc": "ابزارهای کوچک برای حل مسائل فیزیک و برنامه‌نویسی.",
    "now.learning": "در حال یادگیری",
    "now.learning.desc": "ساختمان داده و الگوریتم، فیزیک محاسباتی.",
    "now.reading": "در حال مطالعه",
    "now.reading.desc": "کتاب‌های فنی و یادداشت‌های پژوهشی.",
    "now.building.label": "ساخت",
    "now.learning.label": "یادگیری",
    "now.reading.label": "مطالعه"
  }
};

const STACK = [
  { key: "stack.langs", accent: true, items: ["C", "C++", "Python"] },
  { key: "stack.frameworks", accent: false, items: ["NumPy", "Matplotlib"] },
  { key: "stack.tools", accent: false, items: ["Git", "GitHub", "VS Code"] }
];

const PROJECTS = [
  {
    titleKey: "project.profile.title",
    descKey: "project.profile.desc",
    stackKey: "project.profile.stack",
    url: "https://github.com/AhmadGolbooee/AhmadGolbooee"
  }
];

const NOW = [
  { key: "now.building", icon: "⚙️" },
  { key: "now.learning", icon: "📘" },
  { key: "now.reading", icon: "📄" }
];

const CONTACTS = [
  {
    icon: "✉️",
    label: "AhmadGolbooee.Main@gmail.com",
    href: "mailto:AhmadGolbooee.Main@gmail.com"
  },
  {
    icon: "🐙",
    label: "@AhmadGolbooee",
    href: "https://github.com/AhmadGolbooee"
  }
];

const html = document.documentElement;
const t = (k) => I18N[lang][k] || I18N.en[k] || k;

let lang = localStorage.getItem("lang") === "fa" ? "fa" : "en";

function render() {
  html.lang = lang;
  html.dir = lang === "fa" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  document.getElementById("langLabel").textContent = lang === "fa" ? "English" : "فارسی";
  document.title = lang === "fa"
    ? "احمد گلبویی — توسعه‌دهنده نرم‌افزار"
    : "Ahmad Golbooee — Software Developer";
  renderStack();
  renderProjects();
  renderNow();
  renderContacts();
}

function renderStack() {
  document.getElementById("stackGrid").innerHTML = STACK.map(
    (g) => `<div class="card">
      <h3>${t(g.key)}</h3>
      <div class="chips">${g.items
        .map((i) => `<span class="chip${g.accent ? " chip-accent" : ""}">${i}</span>`)
        .join("")}</div>
    </div>`
  ).join("");
}

function renderProjects() {
  document.getElementById("projectsGrid").innerHTML = PROJECTS.map(
    (p) => `<div class="card">
      <div class="card-icon">⌘</div>
      <h3>${t(p.titleKey)}</h3>
      <p>${t(p.descKey)}</p>
      <div class="chips"><span class="chip chip-accent">${t(p.stackKey)}</span></div>
      <p style="margin:14px 0 0"><a class="card-link" href="${p.url}" target="_blank" rel="noopener">${t("project.view")} →</a></p>
    </div>`
  ).join("");
}

function renderNow() {
  document.getElementById("nowGrid").innerHTML = NOW.map(
    (n) => `<div class="card">
      <div class="card-icon">${n.icon}</div>
      <h3>${t(n.key + ".label")}</h3>
      <p>${t(n.key + ".desc")}</p>
    </div>`
  ).join("");
}

function renderContacts() {
  document.getElementById("contactRow").innerHTML = CONTACTS.map(
    (c) => `<a class="btn btn-ghost" href="${c.href}"${c.href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>
      <span aria-hidden="true">${c.icon}</span>${c.label}</a>`
  ).join("");
}

document.getElementById("langToggle").addEventListener("click", () => {
  lang = lang === "fa" ? "en" : "fa";
  localStorage.setItem("lang", lang);
  render();
});

const savedTheme = localStorage.getItem("theme");
if (savedTheme) html.dataset.theme = savedTheme;
else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches) {
  html.dataset.theme = "light";
}

document.getElementById("themeToggle").addEventListener("click", () => {
  html.dataset.theme = html.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", html.dataset.theme);
});

const nav = document.getElementById("nav");
document.getElementById("menuToggle").addEventListener("click", () => nav.classList.toggle("open"));
nav.addEventListener("click", (e) => {
  if (e.target.tagName === "A") nav.classList.remove("open");
});

const sections = [...document.querySelectorAll("main section[id]")];
const navLinks = [...document.querySelectorAll(".nav a")];
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => spy.observe(s));

document.getElementById("footYear").textContent = new Date().getFullYear();

render();
