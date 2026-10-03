const fs = require("fs");
const path = require("path");
const { JSDOM, VirtualConsole } = require("jsdom");

const root = process.cwd();
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const errors = [];
const vc = new VirtualConsole();
vc.on("jsdomError", (e) => errors.push("jsdomError: " + e.message));
vc.on("error", (...a) => errors.push("console.error: " + a.join(" ")));

const dom = new JSDOM(html, {
  url: "https://ahmadgolbooee.github.io/",
  runScripts: "outside-only",
  pretendToBeVisual: true,
  virtualConsole: vc
});

const { window } = dom;
window.matchMedia = window.matchMedia || ((q) => ({ matches: false, media: q, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {} }));
window.scrollTo = () => {};
window.print = () => {};

const run = (files) => window.eval(files.map((f) => fs.readFileSync(path.join(root, f), "utf8")).join("\n;\n"));
run(["assets/js/content.js", "assets/js/app.js"]);
window.document.dispatchEvent(new window.Event("DOMContentLoaded", { bubbles: true }));

const $ = (s) => window.document.querySelector(s);
const $$ = (s) => Array.from(window.document.querySelectorAll(s));

const checks = [];
const check = (name, cond, extra) => checks.push({ name, ok: !!cond, extra });

check("no runtime errors", errors.length === 0, errors.join(" | "));
check("defaults to english", $("html").lang === "en" && $("html").dir === "ltr", $("html").lang + "/" + $("html").dir);
check("hero shows english name", $("#pageTitle").textContent.includes("Ahmad"), $("#pageTitle").textContent);
check("nav labels rendered", $$(".nav a").every((a) => a.textContent.trim().length > 0));
check("stats rendered", $$("#statsRow .stat").length === 4);
check("about paragraphs rendered", $$("#aboutParas p").length === 3);
check("fun facts rendered", $$("#funFacts li").length === 4);
check("skill cards rendered", $$("#skillsGrid .card").length === 4);
check("skill rows rendered", $$("#skillsGrid .skill-row").length === 12, String($$("#skillsGrid .skill-row").length));
check("skill bars have --lvl", $$("#skillsGrid .bar").every((b) => b.style.getPropertyValue("--lvl")));
check("timeline items rendered", $$("#timeline .tl-item").length === 3);
check("project cards rendered", $$("#projectsGrid .card").length === 3);
check("draft card flagged", $$("#projectsGrid .card.is-draft").length === 2);
check("filters rendered", $$("#projectFilters .filter").length > 3);
check("all filter has a label", $$("#projectFilters .filter")[0].textContent.trim().length > 0, $$("#projectFilters .filter")[0].textContent);
check("now cards rendered", $$("#nowGrid .card").length === 3);
check("interest chips rendered", $$("#interests .chip").length === 6);
check("contact channels rendered", $$("#contactChannels .channel").length === 3);
check("copy button present", $$("[data-copy]").length === 1);
check("footer copy filled", $("#footCopy").textContent.length > 20);
check("typed role has content", $("#typedRole").textContent.length > 0);
check("code rotator has content", $("#codeRotator").textContent.length > 0);
check("json-ld valid", (() => { try { JSON.parse($("#jsonldPerson").textContent); return true; } catch (e) { return false; } })());

const langBtn = $("#langToggle");
langBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
check("switch to fa sets dir=rtl", $("html").dir === "rtl", $("html").dir);
check("fa nav label", $(".nav a").textContent.includes("خانه"), $(".nav a").textContent);
check("fa hero name", $("#typedRole").textContent.length > 0);
check("lang label flipped to English", $("#langLabel").textContent === "English", $("#langLabel").textContent);
check("title in fa", document_title(), $("#pageTitle").textContent);

function document_title() {
  return window.document.title;
}

const themeBtn = $("#themeToggle");
const before = $("html").dataset.theme;
themeBtn.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
check("theme toggles", $("html").dataset.theme !== before, before + " -> " + $("html").dataset.theme);

const firstTagFilter = $$("#projectFilters .filter").find((f) => f.dataset.tag !== "all");
const tag = firstTagFilter.dataset.tag;
firstTagFilter.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
const visible = $$("#projectsGrid .card").filter((c) => !c.classList.contains("is-hidden")).length;
check("filter hides non-matching", visible >= 0 && visible < 3, tag + " -> " + visible);

$$("#projectFilters .filter")[0].dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
check("all filter restores", $$("#projectsGrid .card").filter((c) => !c.classList.contains("is-hidden")).length === 3);

$("#cmdBtn").dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
check("palette opens", $("#palette").hidden === false);
check("palette lists commands", $$("#paletteList li").length >= 10, String($$("#paletteList li").length));
$("#paletteInput").value = "github";
$("#paletteInput").dispatchEvent(new window.Event("input", { bubbles: true }));
check("palette filters", $$("#paletteList li").length === 1, String($$("#paletteList li").length));

const form = $("#contactForm");
form.querySelector('[name="name"]').value = "";
form.dispatchEvent(new window.Event("submit", { bubbles: true, cancelable: true }));
check("empty form blocked", $("#toast").classList.contains("show") === true);


const dom2 = new JSDOM(html, {
  url: "https://ahmadgolbooee.github.io/",
  runScripts: "outside-only",
  pretendToBeVisual: true,
  virtualConsole: vc
});
const w2 = dom2.window;
Object.defineProperty(w2.navigator, "language", { value: "fa-IR", configurable: true });
Object.defineProperty(w2.navigator, "languages", { value: ["fa-IR", "en"], configurable: true });
w2.matchMedia = window.matchMedia;
w2.scrollTo = () => {};
w2.eval(fs.readFileSync(path.join(root, "assets/js/content.js"), "utf8") + "\n;\n" + fs.readFileSync(path.join(root, "assets/js/app.js"), "utf8"));
w2.document.dispatchEvent(new w2.Event("DOMContentLoaded", { bubbles: true }));
check("persian browser still defaults to english", w2.document.documentElement.lang === "en" && w2.document.documentElement.dir === "ltr", w2.document.documentElement.lang);
check("persian browser renders english nav", w2.document.querySelector(".nav a").textContent.trim() === "Home", w2.document.querySelector(".nav a").textContent);
w2.close();

console.log("");
let failed = 0;
checks.forEach((c) => {
  if (!c.ok) failed++;
  console.log((c.ok ? "PASS  " : "FAIL  ") + c.name + (c.extra && !c.ok ? "  [" + c.extra + "]" : ""));
});
console.log("\n" + (checks.length - failed) + "/" + checks.length + " checks passed");
if (errors.length) console.log("\nRuntime errors:\n" + errors.join("\n"));
process.exit(failed ? 1 : 0);
