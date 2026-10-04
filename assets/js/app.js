(function () {
  "use strict";

  const root = document.documentElement;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.prototype.slice.call((ctx || document).querySelectorAll(sel));
  const store = {
    get(k, d) {
      try {
        const v = localStorage.getItem("ag:" + k);
        return v === null ? d : v;
      } catch (e) {
        return d;
      }
    },
    set(k, v) {
      try {
        localStorage.setItem("ag:" + k, v);
      } catch (e) {
        /* ignore */
      }
    }
  };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const detectLang = () => {
    const saved = store.get("lang", null);
    if (saved === "fa" || saved === "en") return saved;
    const nav = (navigator.language || "en").toLowerCase();
    const list = (navigator.languages || [nav]).map((l) => l.toLowerCase());
    return list.some((l) => l.indexOf("fa") === 0 || l.indexOf("pe") === 0) ? "fa" : "en";
  };

  let lang = detectLang();
  let filter = "all";

  const T = (v) => {
    if (v === null || v === undefined) return "";
    if (typeof v === "object" && ("en" in v || "fa" in v)) return v[lang] || v.en || "";
    return v;
  };

  const esc = (s) =>
    String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  /* ---------------- theme + language ---------------- */

  const applyTheme = (mode) => {
    root.dataset.theme = mode;
    const meta = $("#metaThemeColor");
    if (meta) meta.setAttribute("content", mode === "dark" ? DATA.site.themeColor : "#f6f8fc");
  };

  const initTheme = () => {
    const saved = store.get("theme", null);
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(saved || (prefersLight ? "light" : "dark"));
  };

  const applyLang = () => {
    root.lang = lang;
    root.dir = lang === "fa" ? "rtl" : "ltr";
    const t = T(DATA.meta.title);
    const d = T(DATA.meta.description);
    document.title = t;
    $("#pageTitle").textContent = t;
    $("#metaDescription").setAttribute("content", d);
    $("#ogTitle").setAttribute("content", t);
    $("#ogDesc").setAttribute("content", d);
    $("#twTitle").setAttribute("content", t);
    $("#twDesc").setAttribute("content", d);
    $("#ogLocale").setAttribute("content", lang === "fa" ? "fa_IR" : "en_US");
    const alt = $("#ogLocale").parentElement.querySelector('[property="og:locale:alternate"]');
    if (alt) alt.setAttribute("content", lang === "fa" ? "en_US" : "fa_IR");
    $("#langLabel").textContent = lang === "fa" ? "English" : "فارسی";
    const lt = $("#langToggle");
    lt.setAttribute("title", T(DATA.ui.switchLanguage));
    lt.setAttribute("aria-label", T(DATA.ui.switchLanguage));
    $("#themeToggle").setAttribute("title", T(DATA.ui.toggleTheme));
    $("#themeToggle").setAttribute("aria-label", T(DATA.ui.toggleTheme));
    $("#printBtn").setAttribute("title", T(DATA.ui.printResume));
    $("#printBtn").setAttribute("aria-label", T(DATA.ui.printResume));
    $("#menuToggle").setAttribute("title", T(DATA.ui.menu));
    $("#cmdBtn").setAttribute("title", T(DATA.ui.search));
    $("#paletteInput").placeholder = T(DATA.ui.search);
    $("#toTop").setAttribute("title", T(DATA.ui.backToTop));
    $("#toTop").setAttribute("aria-label", T(DATA.ui.backToTop));
    const skip = $(".skip-link");
    if (skip) skip.textContent = lang === "fa" ? "رفتن به محتوا" : "Skip to content";
    $("#footCopy").innerHTML =
      "&copy; " + new Date().getFullYear() + " " + esc(T(DATA.hero.name)) + " &middot; " + esc(T(DATA.ui.footerBuilt)) +
      " &middot; " + esc(T(DATA.ui.footerHost));
  };

  const setLang = (next) => {
    lang = next === "fa" ? "fa" : "en";
    store.set("lang", lang);
    applyLang();
    renderAll();
    restartTypewriter();
    restartCodeRotator();
  };

  /* ---------------- renderers ---------------- */

  function renderStatic() {
    $$("[data-t]").forEach((el) => {
      const val = T(DATA.ui[el.dataset.t] !== undefined ? DATA.ui[el.dataset.t] : keyLookup(el.dataset.t));
      if (val) el.textContent = val;
    });
  }

  function keyLookup(path) {
    return path
      .split(".")
      .reduce((acc, k) => (acc && typeof acc === "object" ? acc[k] : undefined), DATA) || path;
  }

  function renderStats() {
    $("#statsRow").innerHTML = DATA.stats
      .map(
        (s) => `<div class="stat reveal">
          <b data-count="${s.value}" data-suffix="${esc(s.suffix || "")}">0</b>
          <span>${esc(T(s.label))}</span>
        </div>`
      )
      .join("");
  }

  function renderAbout() {
    $("#aboutParas").innerHTML = DATA.about.paragraphs
      .map((p) => `<p class="reveal">${esc(T(p))}</p>`)
      .join("");
    $("#funFacts").innerHTML = DATA.about.funFacts
      .map(
        (f) =>
          `<li class="reveal"><span aria-hidden="true">${esc(f.icon)}</span><span>${esc(T(f.text))}</span></li>`
      )
      .join("");
  }

  function renderSkills() {
    $("#skillsGrid").innerHTML = DATA.skills.groups
      .map((g, gi) => {
        const allLearning = g.items.every((s) => s.state === "learning");
        const anyLearning = g.items.some((s) => s.state === "learning");
        return `<div class="card reveal" style="--d:${gi * 60}ms">
          <div class="card-head">
            <div class="card-icon" aria-hidden="true">${esc(g.icon)}</div>
            <h3>${esc(T(g.label))}</h3>
          </div>
          <div class="skill-list">
            ${g.items
              .map(
                (s) => `<div class="skill-row">
                  <div class="skill-top">
                    <b>${esc(s.name)}</b>
                    <i>${s.level}%</i>
                  </div>
                  <div class="bar ${s.state === "learning" ? "learning" : ""}" style="--lvl:${s.level}%"><span></span></div>
                </div>`
              )
              .join("")}
          </div>
          <div style="margin-block-start:14px">
            <span class="badge ${allLearning ? "learning" : "core"}">${esc(
              T(allLearning ? DATA.ui.learning : anyLearning ? DATA.ui.core : DATA.ui.core)
            )}</span>
          </div>
        </div>`;
      })
      .join("");
  }

  function renderTimeline() {
    $("#timeline").innerHTML = DATA.journey.items
      .map(
        (it, i) => `<li class="tl-item reveal ${esc(it.type)}" style="--d:${i * 70}ms">
          <span class="tl-period">
            <span>${esc(it.period)}</span>
            <span class="badge">${esc(it.type === "education" ? T(DATA.ui.education) : T(DATA.ui.experience))}</span>
          </span>
          <h3>${esc(T(it.title))}</h3>
          <div class="tl-org">
            <span>${esc(T(it.org))}</span>
            <span class="sep">•</span>
            <span>${esc(T(it.location))}</span>
          </div>
          <p>${esc(T(it.desc))}</p>
          <div class="chips">${(it.tags || []).map((tag) => `<span class="chip">${esc(tag)}</span>`).join("")}</div>
        </li>`
      )
      .join("");
  }

  function projectTags() {
    const tags = [];
    DATA.projects.items.forEach((p) => (p.tags || []).forEach((tag) => { if (tags.indexOf(tag) < 0) tags.push(tag); }));
    return tags;
  }

  function renderFilters() {
    const tags = projectTags();
    $("#projectFilters").innerHTML = ["all"]
      .concat(tags)
      .map(
        (tag) =>
          `<button class="filter${filter === tag ? " active" : ""}" data-tag="${esc(tag)}" type="button" role="tab" aria-selected="${filter === tag}">${esc(
            tag === "all" ? T(DATA.projects.allTag) : tag
          )}</button>`
      )
      .join("");
  }

  function renderProjects() {
    const items = DATA.projects.items;
    $("#projectsGrid").innerHTML = items
      .map((p, i) => {
        const hidden = filter !== "all" && (p.tags || []).indexOf(filter) < 0;
        const status = p.status === "draft"
          ? `<span class="badge draft">${esc(T(DATA.ui.draft))}</span>`
          : `<span class="badge live">${esc(T(DATA.ui.live))}</span>`;
        const link = p.url
          ? `<a class="card-link" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(T(DATA.ui.viewProject))} →</a>`
          : `<span class="card-link" style="opacity:.6;cursor:default">${esc(T(DATA.ui.draft))}</span>`;
        return `<article class="card reveal${p.status === "draft" ? " is-draft" : ""}${hidden ? " is-hidden" : ""}" style="--d:${i * 60}ms" data-tags="${esc((p.tags || []).join("|"))}">
          <div class="card-head">
            <div class="card-icon" aria-hidden="true">${p.featured ? "★" : "◈"}</div>
            <h3>${esc(p.title)}</h3>
          </div>
          <p>${esc(T(p.desc))}</p>
          <ul class="card-tags chips">${(p.tags || [])
            .map((tag) => `<li><span class="chip chip-accent">${esc(tag)}</span></li>`)
            .join("")}</ul>
          <div class="card-foot">
            ${link}
            ${status}
          </div>
        </article>`;
      })
      .join("");
    observeReveals();
  }

  function renderNow() {
    $("#nowGrid").innerHTML = DATA.now.items
      .map(
        (n, i) => `<div class="card reveal" style="--d:${i * 70}ms">
          <div class="card-head">
            <div class="card-icon" aria-hidden="true">${esc(n.icon)}</div>
            <h3>${esc(T(n.label))}</h3>
          </div>
          <p>${esc(T(n.desc))}</p>
        </div>`
      )
      .join("");
    $("#interests").innerHTML = DATA.now.interests
      .map((t) => `<span class="chip">${esc(T(t))}</span>`)
      .join("");
  }

  function renderContact() {
    $("#contactChannels").innerHTML = DATA.contact.channels
      .map(
        (c, i) => `<div class="channel reveal" style="--d:${i * 60}ms">
          <a href="${esc(c.href)}" target="_blank" rel="noopener" style="display:contents;text-decoration:none">
            <div class="channel-ic" aria-hidden="true">${esc(c.icon)}</div>
            <div class="channel-txt">
              <small>${esc(T(c.label))}</small>
              <b>${esc(c.value)}</b>
            </div>
          </a>
          ${c.copy ? `<button class="copy-btn" type="button" data-copy="${esc(c.value)}">${esc(T(DATA.ui.copyEmail))}</button>` : ""}
        </div>`
      )
      .join("");
  }

  function renderAll() {
    renderStatic();
    renderStats();
    renderAbout();
    renderSkills();
    renderTimeline();
    renderFilters();
    renderProjects();
    renderNow();
    renderContact();
    observeReveals();
    revealHero();
    updateProgress();
  }

  /* ---------------- typewriter + code rotator ---------------- */

  let typeTimer = null;
  function restartTypewriter() {
    const el = $("#typedRole");
    if (!el) return;
    if (typeTimer) clearInterval(typeTimer);
    const roles = DATA.hero.roles.map(T);
    if (reduceMotion || !roles.length) {
      el.textContent = roles[0] || "";
      return;
    }
    let i = 0;
    let c = 0;
    let deleting = false;
    const tick = () => {
      const word = roles[i];
      c = deleting ? c - 1 : c + 1;
      el.textContent = word.slice(0, c);
      let wait = deleting ? 40 : 85;
      if (!deleting && c === word.length) {
        deleting = true;
        wait = 1700;
      } else if (deleting && c === 0) {
        deleting = false;
        i = (i + 1) % roles.length;
        wait = 350;
      }
      typeTimer = setTimeout(tick, wait);
    };
    el.textContent = "";
    tick();
  }

  let codeTimer = null;
  function restartCodeRotator() {
    const el = $("#codeRotator");
    if (!el) return;
    if (codeTimer) clearTimeout(codeTimer);
    const snippets = DATA.codeSnippets;
    if (reduceMotion) {
      el.textContent = snippets[0];
      return;
    }
    let i = 0;
    let c = 0;
    let deleting = false;
    const step = () => {
      const text = snippets[i];
      c = deleting ? c - 2 : c + 2;
      el.textContent = text.slice(0, c);
      let wait = deleting ? 18 : 14;
      if (!deleting && c >= text.length) {
        deleting = true;
        wait = 2600;
      } else if (deleting && c <= 0) {
        deleting = false;
        i = (i + 1) % snippets.length;
        wait = 300;
      }
      codeTimer = setTimeout(step, wait);
    };
    step();
  }

  /* ---------------- reveal on scroll + counters + bars ---------------- */

  let revealObserver = null;

  function observeReveals() {
    const targets = $$(".reveal:not(.in)");
    if (reduceMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("in"));
      targets.forEach((el) => countUp(el));
      return;
    }
    if (!revealObserver) {
      revealObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("in");
            countUp(entry.target);
            revealObserver.unobserve(entry.target);
          });
        },
        { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
      );
    }
    targets.forEach((el) => revealObserver.observe(el));
  }

  function revealHero() {
    $$(".hero .reveal").forEach((el, i) => {
      el.classList.add("in");
      el.style.setProperty("--d", i * 70 + "ms");
    });
  }

  function countUp(scope) {
    const nodes = [];
    if (scope.matches && scope.matches("[data-count]")) nodes.push(scope);
    else if (scope.querySelectorAll) nodes.push.apply(nodes, scope.querySelectorAll("[data-count]"));
    nodes.forEach((node) => {
      if (node.dataset.done) return;
      node.dataset.done = "1";
      const target = parseFloat(node.dataset.count) || 0;
      const suffix = node.dataset.suffix || "";
      if (reduceMotion) {
        node.textContent = target + suffix;
        return;
      }
      const duration = 900;
      const clock = () =>
        window.performance && typeof window.performance.now === "function" ? window.performance.now() : Date.now();
      const start = clock();
      const raf = window.requestAnimationFrame || ((fn) => setTimeout(() => fn(), 16));
      const tick = (stamp) => {
        const t = typeof stamp === "number" ? stamp : clock();
        const p = Math.min(Math.max((t - start) / duration, 0), 1);
        const eased = 1 - Math.pow(1 - p, 3);
        node.textContent = Math.round(target * eased) + suffix;
        if (p < 1) raf(tick);
      };
      raf(tick);
    });
  }

  /* ---------------- nav, progress, to-top ---------------- */

  function updateProgress() {
    const doc = document.documentElement;
    const max = doc.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    const bar = $("#progressBar");
    if (bar) bar.style.width = (ratio * 100).toFixed(2) + "%";
    $("#toTop").classList.toggle("show", window.scrollY > 420);
  }

  function initScrollSpy() {
    const sections = $$("main section[id]");
    const links = $$(".nav a");
    const setActive = (id) => links.forEach((a) => a.classList.toggle("active", a.dataset.nav === id));

    if (!("IntersectionObserver" in window)) {
      window.addEventListener(
        "scroll",
        () => {
          const y = window.scrollY + (($(".topbar") || {}).offsetHeight || 60) + 40;
          let current = sections.length ? sections[0].id : null;
          sections.forEach((s) => {
            if (s.offsetTop <= y) current = s.id;
          });
          setActive(current);
        },
        { passive: true }
      );
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          setActive(entry.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => io.observe(s));
  }

  function smoothScrollTo(hash) {
    const target = document.querySelector(hash);
    if (!target) return;
    const header = $(".topbar");
    const offset = (header ? header.offsetHeight : 60) + 10;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* ---------------- toast ---------------- */

  let toastTimer = null;
  function toast(message) {
    const el = $("#toast");
    el.textContent = message;
    el.classList.add("show");
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2400);
  }

  function copyText(value) {
    const done = () => toast(T(DATA.ui.copied));
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(value).then(done, () => fallbackCopy(value, done));
    } else {
      fallbackCopy(value, done);
    }
  }

  function fallbackCopy(value, done) {
    const ta = document.createElement("textarea");
    ta.value = value;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand("copy");
      done();
    } catch (e) {
      toast(value);
    }
    document.body.removeChild(ta);
  }

  /* ---------------- vCard ---------------- */

  function downloadVCard() {
    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "N:Golbooee;Ahmad;;;",
      "FN:Ahmad Golbooee",
      "ORG:Isfahan University of Technology",
      "TITLE:Software Developer",
      "EMAIL;TYPE=INTERNET:" + DATA.site.email,
      "URL:" + "https://ahmadgolbooee.github.io",
      "ADR;TYPE=WORK:;;;Isfahan;;Iran;;;;",
      "NOTE:" + DATA.hero.roles.map(T).join(", "),
      "END:VCARD"
    ];
    const blob = new Blob([lines.join("\r\n")], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "AhmadGolbooee.vcf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1500);
    toast(lang === "fa" ? "فایل مخاطب ساخته شد" : "Contact file created");
  }

  /* ---------------- command palette ---------------- */

  function commands() {
    const list = [];
    const navLabels = {
      home: T(DATA.ui.home),
      about: T(DATA.ui.about),
      skills: T(DATA.ui.skills),
      journey: T(DATA.ui.journey),
      projects: T(DATA.ui.projects),
      now: T(DATA.ui.now),
      contact: T(DATA.ui.contact)
    };
    Object.keys(navLabels).forEach((id) => {
      list.push({
        icon: "→",
        label: navLabels[id],
        hint: "#" + id,
        run: () => smoothScrollTo("#" + id)
      });
    });
    list.push({ icon: "🎨", label: T(DATA.ui.toggleTheme), hint: "", run: () => $("#themeToggle").click() });
    list.push({ icon: "🌐", label: T(DATA.ui.switchLanguage), hint: "", run: () => $("#langToggle").click() });
    list.push({ icon: "🖨️", label: T(DATA.ui.printResume), hint: "", run: () => window.print() });
    list.push({ icon: "📇", label: T(DATA.ui.downloadVCard), hint: ".vcf", run: downloadVCard });
    list.push({ icon: "✉️", label: T(DATA.ui.copyEmail), hint: DATA.site.email, run: () => copyText(DATA.site.email) });
    list.push({ icon: "🐙", label: "GitHub", hint: "@AhmadGolbooee", run: () => window.open(DATA.site.github, "_blank", "noopener") });
    list.push({ icon: "📄", label: T(DATA.ui.sourceCode), hint: "repo", run: () => window.open(DATA.site.siteRepo, "_blank", "noopener") });
    return list;
  }

  const palette = {
    el: $("#palette"),
    input: $("#paletteInput"),
    list: $("#paletteList"),
    empty: $("#paletteEmpty"),
    items: [],
    sel: 0
  };

  function renderPalette(query) {
    const all = commands();
    const q = (query || "").trim().toLowerCase();
    palette.items = q
      ? all.filter((c) => (c.label + " " + (c.hint || "")).toLowerCase().indexOf(q) > -1)
      : all;
    palette.sel = 0;
    palette.list.innerHTML = palette.items
      .map(
        (c, i) =>
          `<li class="${i === 0 ? "sel" : ""}" data-i="${i}"><i aria-hidden="true">${c.icon}</i><span>${esc(c.label)}</span>${
            c.hint ? `<small>${esc(c.hint)}</small>` : ""
          }</li>`
      )
      .join("");
    palette.empty.hidden = palette.items.length > 0;
    palette.empty.textContent = T(DATA.ui.noResults);
  }

  function moveSelection(delta) {
    if (!palette.items.length) return;
    palette.sel = (palette.sel + delta + palette.items.length) % palette.items.length;
    $$("#paletteList li").forEach((li, i) => li.classList.toggle("sel", i === palette.sel));
    const active = $("#paletteList li.sel");
    if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
  }

  function openPalette() {
    palette.el.hidden = false;
    renderPalette(palette.input.value);
    palette.input.focus();
    palette.input.select();
  }

  function closePalette() {
    palette.el.hidden = true;
    $("#cmdBtn").focus();
  }

  function runPalette(i) {
    const item = palette.items[i];
    if (!item) return;
    closePalette();
    setTimeout(() => item.run(), 60);
  }

  /* ---------------- contact form ---------------- */

  function initForm() {
    const form = $("#contactForm");
    if (!form) return;
    const field = (name) => form.querySelector('[name="' + name + '"]');
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      const name = (field("name").value || "").trim();
      const email = (field("email").value || "").trim();
      const message = (field("message").value || "").trim();
      if (!name || !email || !message) {
        toast(T(DATA.ui.formEmpty));
        return;
      }
      const subject = encodeURIComponent((lang === "fa" ? "پیام از سایت شخصی" : "Message from personal site") + " — " + name);
      const body = encodeURIComponent(
        (lang === "fa" ? "نام: " : "Name: ") + name + "\n" +
        (lang === "fa" ? "ایمیل: " : "Email: ") + email + "\n\n" + message
      );
      window.location.href = "mailto:" + DATA.site.email + "?subject=" + subject + "&body=" + body;
    });
  }

  /* ---------------- wiring ---------------- */

  function init() {
    initTheme();
    applyLang();
    renderAll();
    initScrollSpy();
    initForm();
    restartTypewriter();
    restartCodeRotator();

    $("#langToggle").addEventListener("click", () => setLang(lang === "fa" ? "en" : "fa"));

    $("#themeToggle").addEventListener("click", () => {
      const next = root.dataset.theme === "dark" ? "light" : "dark";
      applyTheme(next);
      store.set("theme", next);
    });

    $("#printBtn").addEventListener("click", () => window.print());
    $("#vcardBtn").addEventListener("click", downloadVCard);

    $("#menuToggle").addEventListener("click", () => $("#nav").classList.toggle("open"));
    $$("#nav a").forEach((a) =>
      a.addEventListener("click", (ev) => {
        ev.preventDefault();
        smoothScrollTo(a.getAttribute("href"));
        $("#nav").classList.remove("open");
      })
    );
    $(".brand").addEventListener("click", (ev) => {
      ev.preventDefault();
      smoothScrollTo("#home");
    });

    $("#projectFilters").addEventListener("click", (ev) => {
      const btn = ev.target.closest(".filter");
      if (!btn) return;
      filter = btn.dataset.tag;
      renderFilters();
      let visible = 0;
      $$("#projectsGrid .card").forEach((card) => {
        const tags = (card.dataset.tags || "").split("|");
        const hidden = filter !== "all" && tags.indexOf(filter) < 0;
        card.classList.toggle("is-hidden", hidden);
        if (!hidden) visible++;
      });
      const empty = $("#projectsEmpty");
      empty.hidden = visible > 0;
      empty.textContent = T(DATA.projects.emptyState);
    });

    $("#contactChannels").addEventListener("click", (ev) => {
      const btn = ev.target.closest("[data-copy]");
      if (btn) copyText(btn.dataset.copy);
    });

    const toTop = $("#toTop");
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));
    $("#footTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" }));

    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    updateProgress();

    $("#cmdBtn").addEventListener("click", openPalette);
    palette.el.addEventListener("click", (ev) => {
      if (ev.target.hasAttribute("data-close")) closePalette();
      const li = ev.target.closest("li");
      if (li) runPalette(Number(li.dataset.i));
    });
    palette.input.addEventListener("input", () => renderPalette(palette.input.value));
    palette.input.addEventListener("keydown", (ev) => {
      if (ev.key === "ArrowDown") {
        ev.preventDefault();
        moveSelection(1);
      } else if (ev.key === "ArrowUp") {
        ev.preventDefault();
        moveSelection(-1);
      } else if (ev.key === "Enter") {
        ev.preventDefault();
        runPalette(palette.sel);
      } else if (ev.key === "Escape") {
        closePalette();
      }
    });

    document.addEventListener("keydown", (ev) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName);
      if ((ev.ctrlKey || ev.metaKey) && ev.key.toLowerCase() === "k") {
        ev.preventDefault();
        palette.el.hidden ? openPalette() : closePalette();
        return;
      }
      if (ev.key === "Escape" && !palette.el.hidden) {
        closePalette();
        return;
      }
      if (typing) return;
      if (ev.key === "/") {
        ev.preventDefault();
        openPalette();
      }
    });

    window.addEventListener("beforeprint", () => {
      $$(".reveal").forEach((el) => el.classList.add("in"));
    });

    if ("serviceWorker" in navigator && location.protocol !== "file:") {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("sw.js").catch(() => {});
      });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
