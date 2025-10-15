// --- THEME ----------------------------------------------------
const mql = window.matchMedia("(prefers-color-scheme: dark)");
const root = document.documentElement;

function resolveMode() {
  const stored = localStorage.getItem("mode") || "auto";      // 'auto' | 'light' | 'dark'
  const dark = stored === "dark" || (stored === "auto" && mql.matches);
  return { stored, dark };
}

function applyMode() {
  const { stored, dark } = resolveMode();
  // Set attribute used by CSS
  root.dataset.theme = dark ? "dark" : "light";
  root.style.colorScheme = dark ? "dark" : "light";

  // Keep the old .dark class for compatibility if you used it
  document.body.classList.toggle("dark", dark);

  // Update the browser UI color (address bar on mobile, etc.)
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  if (themeMeta) {
    // Try to use your brand primary in both modes; fall back to sensible bg
    const brand = getComputedStyle(root).getPropertyValue("--brand-primary").trim();
    themeMeta.setAttribute("content", brand || (dark ? "#0b0c0d" : "#ffffff"));
  }

  // Optional: reflect current mode on the toggle button for a11y
  const btn = document.querySelector("[data-toggle-mode]");
  if (btn) {
    const label = stored === "auto" ? "Auto" : (dark ? "Dark" : "Light");
    btn.setAttribute("aria-label", `Theme: ${label} (click to change)`);
  }
}

// React to OS theme changes only when user is in 'auto'
mql.addEventListener("change", () => {
  if ((localStorage.getItem("mode") || "auto") === "auto") applyMode();
});

// Cycle modes: Auto → Light → Dark → Auto
document.addEventListener("click", (e) => {
  const btn = e.target.closest("[data-toggle-mode]");
  if (!btn) return;
  const modes = ["auto", "light", "dark"];
  const current = localStorage.getItem("mode") || "auto";
  const next = modes[(modes.indexOf(current) + 1) % modes.length];
  localStorage.setItem("mode", next);
  applyMode();
});

// Initial paint-safe apply (head script already set the attribute; this syncs everything else)
applyMode();

// --- SCROLL PROGRESS & ACCENT HUE --------------------------------;
const progress = document.querySelector('.progress');
function onScroll() {
  const scrolled = window.scrollY;
  const h = (scrolled / Math.max(1, document.body.scrollHeight - innerHeight)) * 320;
  root.style.setProperty('--accent-hue', (12 + h) % 360);
  if (progress) {
    const pct = Math.min(100, (scrolled / (document.documentElement.scrollHeight - innerHeight)) * 100);
    progress.style.width = pct + "%";
  }
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    document.querySelector(a.getAttribute('href'))?.scrollIntoView({behavior:'smooth', block:'start'});
  });
});

const form = document.querySelector('form#contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const subject = encodeURIComponent("[Site] " + data.get('name') + " — " + data.get('subject'));
    const body = encodeURIComponent(data.get('message') + "\n\nFrom: " + data.get('name') + " <" + data.get('email') + ">");
    window.location.href = `mailto:Bonnie_soto13@yahoo.com?subject=${subject}&body=${body}`;
  });
}


(() => {
  const out = document.getElementById('term-output');
  const termForm = document.getElementById('term-form');
  const input = document.getElementById('term-input');
  if (!out || !termForm || !input) return; // terminal not on this page

// ------- Python-friendly examples -------
// Removed duplicate declaration of 'exercises' to avoid redeclaration error

  // ------- Helpers -------
  // Removed duplicate declaration of 'historyIdx' to avoid redeclaration error

  function println(text='', cls=''){
    const div = document.createElement('div');
    div.className = `line ${cls||''}`.trim();
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function banner(){
    println("Python Terminal — type 'help' to get started", 'ok');
  }

  function help(){
    println("Available commands:", 'ok');
    println("  help            • show this help");
    println("  clear           • clear the screen");
    println("  ls              • list example snippets");
    println("  view <name>     • show snippet code  (e.g., view fizzbuzz)");
    println("  run <name>      • put snippet into the input");
    println("Or just type Python and press Enter. For blocks, see multiline tip in step 3.");
  }

  function ls(){
    const names = Object.keys(exercises);
    if(!names.length){ return println("No exercises yet. Add some in JS.", "warn"); }
    println(names.map(n => `• ${n} — ${exercises[n].desc}`).join("\n"));
  }

  function view(name){
    const ex = exercises[name];
    if(!ex) return println(`No such exercise: ${name}`, 'err');
    println(`# ${name}: ${ex.desc}`, 'ok');
    println(ex.code);
  }

  function insert(name){
    const ex = exercises[name];
    if(!ex) return println(`No such exercise: ${name}`, 'err');
    input.value = ex.code.replace(/\n/g, ' '); // single-line input fallback
    input.focus();
  }

  // ------- Pyodide (Python-in-browser) -------
  let pyReady = null;
  function ensurePyodide(){
    if (pyReady) return pyReady;
    println("Loading Python runtime…", "warn");
    pyReady = loadPyodide().then(py => {
      py.setStdout({ batched: s => { if (s) println(s, 'ok'); }});
      py.setStderr({ batched: s => { if (s) println(s, 'err'); }});
      try {
        const v = py.runPython("import sys; sys.version.split('\\n')[0]");
        println(`Python ready: ${v}`, 'ok');
      } catch(e){ println(String(e), 'err'); }
      return py;
    });
    return pyReady;
  }

async function runPython(code){
  const py = await ensurePyodide();

  // --- TERMINAL (Python-enabled, multiline-safe) ------------------
  (() => {
    const out  = document.getElementById('term-output');
    const form = document.getElementById('term-form');
    const input = document.getElementById('term-input');
    if (!out || !form || !input) return; // terminal not on this page

    // Ensure the rest of the terminal logic is implemented here
  })();
}

  // ------- Python-friendly examples -------
  const exercises = {
    fizzbuzz: {
      desc: "FizzBuzz 1..30 (Python)",
      code: `for i in range(1, 31):
    s = ('' if i%3 else 'Fizz') + ('' if i%5 else 'Buzz')
    print(s or i)`
    },
    palindrome: {
      desc: "Palindrome check",
      code: `def is_pal(s):
    s=''.join(ch.lower() for ch in s if ch.isalnum())
    return s==s[::-1]
print(is_pal('Able was I ere I saw Elba'))`
    },
    sumrange: {
      desc: "Sum 1..100",
      code: `print(sum(range(1,101)))`
    }
  };

  // ------- Helpers -------
  const history = [];
  let historyIdx = -1;

  function println(text = '', cls = '') {
    const div = document.createElement('div');
    div.className = `line ${cls}`.trim();
    div.textContent = text;
    out.appendChild(div);
    out.scrollTop = out.scrollHeight;
  }

  function banner() {
    println("Python Terminal — type 'help' to get started", 'ok');
  }

  function help() {
    println("Available commands:", 'ok');
    println("  help            • show this help");
    println("  clear           • clear the screen");
    println("  ls              • list example snippets");
    println("  view <name>     • show snippet code  (e.g., view fizzbuzz)");
    println("  run <name>      • insert snippet into the editor");
    println("Or just type Python and press Enter. Shift+Enter inserts a newline.");
  }

  function ls() {
    const names = Object.keys(exercises);
    if (!names.length) {
      return println("No exercises yet. Add some in JS.", "warn");
    }
    println(names.map(n => `• ${n} — ${exercises[n].desc}`).join("\n"));
  }
