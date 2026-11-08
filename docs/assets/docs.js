/* =========================================================
   GDrive Desktop — Documentação
   Chrome compartilhado (cabeçalho, menu lateral, idioma)
   ========================================================= */
(function () {
  "use strict";

  document.documentElement.classList.add("js");

  const LOCALE_KEY = "gdl-locale";
  const SITE = "../../";
  const ROOT = "../../";

  /* Páginas da documentação (id = pasta em /docs) */
  const PAGES = [
    { id: "home", pt: "Visão geral", en: "Overview" },
    { id: "install-guide", pt: "Guia de instalação", en: "Installation guide" },
    { id: "client-id", pt: "Client ID do Google Cloud", en: "Google Cloud Client ID" },
    { id: "features", pt: "Recursos do app", en: "App features" },
    { id: "file-managers", pt: "Gerenciadores de arquivos", en: "File managers" },
    { id: "cli", pt: "CLI e servidor MCP", en: "CLI and MCP server" },
    { id: "troubleshooting", pt: "Solução de problemas", en: "Troubleshooting" },
  ];

  const CHROME = {
    "pt-BR": {
      title: "Documentação",
      backToSite: "Voltar ao site",
      onThisPage: "Nesta página",
      prev: "Anterior",
      next: "Próxima",
      search: "Procurar na documentação",
      copy: "copiar",
      copied: "copiado",
      updated: "Última versão: 1.2.5",
    },
    "en-US": {
      title: "Documentation",
      backToSite: "Back to the site",
      onThisPage: "On this page",
      prev: "Previous",
      next: "Next",
      search: "Search the documentation",
      copy: "copy",
      copied: "copied",
      updated: "Latest version: 1.2.5",
    },
  };

  let locale = "pt-BR";
  try {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved === "pt-BR" || saved === "en-US") locale = saved;
  } catch (e) {}

  const T = (k) => (CHROME[locale] && CHROME[locale][k]) || k;

  /* ---------------------------------------------------------
     Cabeçalho
     --------------------------------------------------------- */
  function renderHeader() {
    const el = document.getElementById("docs-header");
    if (!el) return;
    const current = document.body.dataset.page || "";
    const label = (p) => (locale === "en-US" ? p.en : p.pt);
    el.innerHTML = `
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <a href="${ROOT}" class="group flex items-center gap-2.5">
          <img src="${ROOT}assets/img/icon-128.png" alt="" class="h-8 w-8 transition-transform duration-500 group-hover:rotate-12">
          <span class="font-display text-sm font-bold text-white">GDrive <span class="text-slate-400">Desktop</span></span>
          <span class="hidden text-slate-600 sm:inline">/</span>
          <span class="hidden text-sm font-medium text-slate-400 sm:inline">${T("title")}</span>
        </a>
        <div class="flex items-center gap-2">
          <a href="${ROOT}" class="hidden rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-white/10 hover:text-white sm:inline-block">
            ← ${T("backToSite")}
          </a>
          <div class="lang-switch" role="group" aria-label="Language">
            <span class="lang-pill" id="lang-pill"></span>
            <button class="lang-btn" data-locale="pt-BR" aria-pressed="${locale === "pt-BR"}">PT</button>
            <button class="lang-btn" data-locale="en-US" aria-pressed="${locale === "en-US"}">EN</button>
          </div>
        </div>
      </div>
      <nav class="mobile-docs-nav lg:hidden" aria-label="${T("title")}">
        <div class="mx-auto flex max-w-7xl gap-2 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-8">
          ${PAGES.map(
            (p) => `
            <a href="${p.id}/" class="mobile-doc-link ${p.id === current ? "active" : ""}" ${p.id === current ? 'aria-current="page"' : ""}>
              ${label(p)}
            </a>`
          ).join("")}
        </div>
      </nav>`;
  }

  /* ---------------------------------------------------------
     Menu lateral
     --------------------------------------------------------- */
  function renderSidebar() {
    const el = document.getElementById("docs-sidebar");
    if (!el) return;
    const current = document.body.dataset.page || "";
    el.innerHTML = `
      <div class="mb-4">
        <input id="docs-search" type="search" placeholder="${T("search")}"
               class="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-300 placeholder:text-slate-600 outline-none transition focus:border-gdrive-blue/50 focus:bg-white/[.08]">
      </div>
      <nav class="docs-sidebar" aria-label="${T("title")}">
        <p class="mb-2 px-3 text-[11px] font-bold uppercase tracking-[.14em] text-slate-600">${T("title")}</p>
        <ul class="space-y-0.5">
          ${PAGES.map(
            (p, i) => `
            <li>
              <a href="${p.id}/" class="side-link ${p.id === current ? "active" : ""}" ${p.id === current ? 'aria-current="page"' : ""}>
                <span class="side-num">${String(i + 1).padStart(2, "0")}</span>
                <span>${locale === "en-US" ? p.en : p.pt}</span>
              </a>
            </li>`
          ).join("")}
        </ul>
      </nav>`;
  }

  /* ---------------------------------------------------------
     Navegação anterior / próxima
     --------------------------------------------------------- */
  function renderPager() {
    const el = document.getElementById("docs-pager");
    if (!el) return;
    const current = document.body.dataset.page || "";
    const idx = PAGES.findIndex((p) => p.id === current);
    if (idx === -1) return;
    const prev = PAGES[idx - 1];
    const next = PAGES[idx + 1];
    const label = (p) => (locale === "en-US" ? p.en : p.pt);
    el.innerHTML = `
      <div class="doc-nav">
        ${
          prev
            ? `<a href="${prev.id}/"><div class="lbl">← ${T("prev")}</div><div class="ttl">${label(prev)}</div></a>`
            : `<a href="${ROOT}"><div class="lbl">← ${T("backToSite")}</div><div class="ttl">GDrive Desktop</div></a>`
        }
        ${
          next
            ? `<a href="${next.id}/"><div class="lbl">${T("next")} →</div><div class="ttl">${label(next)}</div></a>`
            : `<a href="https://github.com/tzanella/gdrivedesktoplinux" target="_blank" rel="noopener"><div class="lbl">${T("next")} →</div><div class="ttl">GitHub</div></a>`
        }
      </div>`;
  }

  /* ---------------------------------------------------------
     Sumário (TOC) a partir dos h2/h3 do artigo
     --------------------------------------------------------- */
  function renderToc() {
    const el = document.getElementById("docs-toc");
    const article = document.getElementById("article");
    if (!el || !article) return;
    const block = article.querySelector('[data-lang="' + locale + '"]') || article;
    const heads = Array.from(block.querySelectorAll("h2"));
    if (!heads.length) {
      el.innerHTML = "";
      return;
    }
    const slugify = (text) =>
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");
    const used = new Set();
    heads.forEach((h) => {
      if (!h.id) {
        let base = slugify(h.textContent) || "secao";
        let id = base;
        let i = 2;
        while (used.has(id)) id = base + "-" + i++;
        used.add(id);
        h.id = id;
      } else {
        used.add(h.id);
      }
    });
    el.innerHTML =
      `<p class="mb-2 text-[11px] font-bold uppercase tracking-[.14em] text-slate-600">${T("onThisPage")}</p>` +
      heads
        .map(
          (h) =>
            `<a href="#${h.id}" data-toc="${h.id}">${h.textContent.replace(/^\d+[.\s]*/, "")}</a>`
        )
        .join("");
  }

  /* ---------------------------------------------------------
     Troca de idioma
     --------------------------------------------------------- */
  function applyLocale(next) {
    locale = next;
    try { localStorage.setItem(LOCALE_KEY, next); } catch (e) {}

    // Blocos de conteúdo bilíngue
    document.querySelectorAll("[data-lang]").forEach((el) => {
      el.style.display = el.dataset.lang === next ? "" : "none";
    });

    // Chrome
    document.querySelectorAll(".lang-btn").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.locale === next));
    });

    renderHeader();
    renderSidebar();
    renderPager();
    renderToc();
    initTocHighlight();
    movePill();
    setPageTitle();
  }

  function scrollActiveMobileNav() {
    const active = document.querySelector(".mobile-doc-link.active");
    if (!active) return;
    const wrap = active.parentElement;
    if (!wrap) return;
    const left = active.offsetLeft - (wrap.clientWidth - active.offsetWidth) / 2;
    if (typeof wrap.scrollTo === "function") {
      wrap.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
    }
  }

  function movePill() {
    const pill = document.getElementById("lang-pill");
    const active = Array.from(document.querySelectorAll(".lang-btn")).find(
      (b) => b.dataset.locale === locale
    );
    if (!pill || !active) return;
    const wrap = active.parentElement;
    pill.style.width = active.offsetWidth + "px";
    pill.style.transform = `translateX(${active.offsetLeft - 4}px)`;
  }

  function setPageTitle() {
    const t = document.title;
    const base = t.split(" · ")[0];
    document.title = base + " · " + (locale === "en-US" ? "Docs" : "Documentação");
  }

  /* ---------------------------------------------------------
     Blocos de código com botão de copiar
     --------------------------------------------------------- */
  function initCopy() {
    document.querySelectorAll(".code-block").forEach((block) => {
      if (block.querySelector(".copy-btn")) return;
      const btn = document.createElement("button");
      btn.className = "copy-btn";
      btn.textContent = T("copy");
      btn.addEventListener("click", async () => {
        const code = block.querySelector("code");
        const text = code ? code.textContent : "";
        try {
          await navigator.clipboard.writeText(text);
        } catch (e) {
          const ta = document.createElement("textarea");
          ta.value = text;
          document.body.appendChild(ta);
          ta.select();
          try { document.execCommand("copy"); } catch (err) {}
          document.body.removeChild(ta);
        }
        btn.textContent = T("copied");
        btn.classList.add("ok");
        setTimeout(() => {
          btn.textContent = T("copy");
          btn.classList.remove("ok");
        }, 1600);
      });
      block.appendChild(btn);
    });
  }

  /* ---------------------------------------------------------
     Reveal + TOC highlight
     --------------------------------------------------------- */
  function initReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach((i) => i.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((i) => io.observe(i));
  }

  let tocObserver = null;

  function initTocHighlight() {
    const links = Array.from(document.querySelectorAll(".toc a"));
    if (!links.length || !("IntersectionObserver" in window)) return;
    if (tocObserver) {
      tocObserver.disconnect();
      tocObserver = null;
    }
    const map = new Map();
    links.forEach((l) => {
      const t = document.getElementById(l.dataset.toc);
      if (t) map.set(t, l);
    });
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            links.forEach((l) => l.classList.remove("text-white"));
            const l = map.get(e.target);
            if (l) l.classList.add("text-white");
          }
        });
      },
      { rootMargin: "-90px 0px -70% 0px", threshold: 0 }
    );
    tocObserver = io;
    map.forEach((_, t) => io.observe(t));
  }

  /* ---------------------------------------------------------
     Cabeçalho fixo com sombra ao rolar
     --------------------------------------------------------- */
  function initHeaderScroll() {
    const header = document.getElementById("docs-topbar");
    if (!header) return;
    const onScroll = () => {
      header.classList.toggle("bg-[#0b0f19]/85", window.scrollY > 8);
      header.classList.toggle("border-white/10", window.scrollY > 8);
      header.classList.toggle("shadow-lg", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------------------------------------------------------
     Busca simples: filtra os links do menu lateral
     --------------------------------------------------------- */
  function initSearch() {
    // Delegated: the sidebar is re-rendered on every language change.
    document.addEventListener("input", (e) => {
      if (!e.target || e.target.id !== "docs-search") return;
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll("#docs-sidebar .side-link").forEach((a) => {
        const txt = a.textContent.toLowerCase();
        const id = a.getAttribute("href").replace("/", "");
        const idx = PAGES.findIndex((p) => p.id === id);
        const page = idx >= 0 ? PAGES[idx] : null;
        const extra = page ? `${page.pt} ${page.en}`.toLowerCase() : "";
        a.style.display = !q || txt.includes(q) || extra.includes(q) ? "" : "none";
      });
    });
  }

  /* ---------------------------------------------------------
     Boot
     --------------------------------------------------------- */
  function boot() {
    applyLocale(locale);

    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-locale]");
      if (btn) applyLocale(btn.dataset.locale);
    });

    window.addEventListener("resize", movePill);
    scrollActiveMobileNav();
    initReveal();
    initCopy();
    initTocHighlight();
    initHeaderScroll();
    initSearch();
    setTimeout(movePill, 250);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
