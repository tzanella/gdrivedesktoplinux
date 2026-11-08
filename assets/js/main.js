/* =========================================================
   GDrive Desktop — Site interactions
   ========================================================= */
(function () {
  "use strict";

  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  // Marks that JS is running: content stays visible if scripts fail.
  document.documentElement.classList.add("js");

  /* ---------------------------------------------------------
     1. Locale handling (pt-BR default, en-US optional)
     --------------------------------------------------------- */
  const LOCALES = ["pt-BR", "en-US"];
  let currentLocale = "pt-BR";

  function setLocale(locale, persist) {
    if (!LOCALES.includes(locale)) locale = "pt-BR";
    currentLocale = locale;
    window.I18N.apply(locale);

    $$(".lang-btn").forEach((b) => {
      b.setAttribute("aria-pressed", String(b.dataset.locale === locale));
    });
    movePill();

    if (persist !== false) {
      try { localStorage.setItem("gdl-locale", locale); } catch (e) {}
    }
  }

  function movePill() {
    const pill = $("#lang-pill");
    const active = $$(".lang-btn").find((b) => b.dataset.locale === currentLocale);
    if (!pill || !active) return;
    const wrap = active.parentElement;
    const wrapRect = wrap.getBoundingClientRect();
    const btnRect = active.getBoundingClientRect();
    pill.style.width = btnRect.width + "px";
    pill.style.transform = `translateX(${btnRect.left - wrapRect.left - 4}px)`;
  }

  function initLocale() {
    let saved = null;
    try { saved = localStorage.getItem("gdl-locale"); } catch (e) {}
    // The site is Brazilian by default; English only when explicitly chosen.
    setLocale(LOCALES.includes(saved) ? saved : "pt-BR", false);

    $$(".lang-btn").forEach((b) => {
      b.addEventListener("click", () => setLocale(b.dataset.locale, true));
    });
    window.addEventListener("resize", movePill);
  }

  /* ---------------------------------------------------------
     2. Scroll reveal
     --------------------------------------------------------- */
  function initReveal() {
    const items = $$(".reveal");
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
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );
    items.forEach((i) => io.observe(i));
  }

  /* ---------------------------------------------------------
     3. Nav: shrink on scroll + mobile menu
     --------------------------------------------------------- */
  function initNav() {
    const nav = $("#nav");
    const inner = $("#nav-inner");
    const progress = $("#scroll-progress");
    const menuBtn = $("#menu-btn");
    const menu = $("#mobile-menu");
    const icon = $("#menu-icon");

    let last = 0;
    function onScroll() {
      const y = window.scrollY;
      if (nav) {
        nav.classList.toggle("backdrop-blur-xl", y > 10);
        if (inner) {
          inner.classList.toggle("bg-[#0b0f19]/85", y > 20);
          inner.classList.toggle("shadow-2xl", y > 20);
          inner.classList.toggle("border-white/10", y > 20);
        }
      }
      if (progress) {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.width = h > 0 ? (y / h) * 100 + "%" : "0%";
      }
      last = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    function closeMenu() {
      menu.style.maxHeight = "0px";
      menu.style.opacity = "0";
      if (menuBtn) menuBtn.setAttribute("aria-expanded", "false");
      if (icon) icon.style.transform = "rotate(0deg)";
    }

    if (menuBtn) {
      menuBtn.addEventListener("click", () => {
        const open = menuBtn.getAttribute("aria-expanded") === "true";
        if (open) {
          closeMenu();
        } else {
          menu.style.maxHeight = menu.scrollHeight + "px";
          menu.style.opacity = "1";
          menuBtn.setAttribute("aria-expanded", "true");
          if (icon) icon.style.transform = "rotate(90deg)";
        }
      });
    }

    $$(".mobile-link").forEach((link) => link.addEventListener("click", closeMenu));

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1024) closeMenu();
      movePill();
    });
  }

  /* ---------------------------------------------------------
     4. Spotlight cursor glow (desktop, fine pointers)
     --------------------------------------------------------- */
  function initSpotlight() {
    const dot = $("#spotlight");
    if (!dot) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    document.body.classList.add("has-spotlight");
    let x = 0, y = 0, cx = 0, cy = 0, raf = null;

    window.addEventListener("mousemove", (e) => {
      x = e.clientX;
      y = e.clientY;
      if (!raf) raf = requestAnimationFrame(loop);
    });

    function loop() {
      cx += (x - cx) * 0.08;
      cy += (y - cy) * 0.08;
      dot.style.left = cx + "px";
      dot.style.top = cy + "px";
      if (Math.abs(x - cx) > 0.5 || Math.abs(y - cy) > 0.5) {
        raf = requestAnimationFrame(loop);
      } else {
        raf = null;
      }
    }
  }

  /* ---------------------------------------------------------
     5. Feature card pointer glow
     --------------------------------------------------------- */
  function initCardGlow() {
    $$(".fcard").forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty("--mx", e.clientX - r.left + "px");
        card.style.setProperty("--my", e.clientY - r.top + "px");
      });
    });
  }

  /* ---------------------------------------------------------
     6. Tabs (gallery filters + install panels)
     --------------------------------------------------------- */
  function initTabs() {
    $$("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("[data-filter]").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
        const cat = btn.dataset.filter;
        $$("#gallery .shot").forEach((card) => {
          const show = cat === "all" || card.dataset.cat === cat;
          card.classList.toggle("hidden", !show);
          if (show) {
            card.classList.remove("is-visible");
            requestAnimationFrame(() => card.classList.add("is-visible"));
          }
        });
      });
    });

    $$("#install-tabs [data-tab]").forEach((btn) => {
      btn.addEventListener("click", () => {
        $$("#install-tabs [data-tab]").forEach((b) => b.setAttribute("aria-selected", String(b === btn)));
        const tab = btn.dataset.tab;
        $$(".install-panel").forEach((p) => {
          p.classList.toggle("hidden", p.dataset.panel !== tab);
        });
      });
    });
  }

  /* ---------------------------------------------------------
     7. Lightbox
     --------------------------------------------------------- */
  function initLightbox() {
    const box = $("#lightbox");
    const img = $("#lightbox-img");
    const cap = $("#lightbox-cap");
    if (!box || !img) return;

    function open(src, caption) {
      img.src = src;
      cap.textContent = caption || "";
      box.classList.add("open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      box.classList.remove("open");
      document.body.style.overflow = "";
    }

    $$("#gallery .shot").forEach((card) => {
      card.addEventListener("click", () => {
        const key = card.dataset.titleKey;
        const dict = window.I18N[currentLocale] || {};
        open(card.dataset.shot, dict[key] || "");
      });
    });

    $("#lightbox-close")?.addEventListener("click", close);
    box.addEventListener("click", (e) => {
      if (e.target === box) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && box.classList.contains("open")) close();
    });
  }

  /* ---------------------------------------------------------
     8. Accordion (FAQ)
     --------------------------------------------------------- */
  function initAccordion() {
    $$(".acc-item").forEach((item) => {
      const btn = $("button", item);
      btn.addEventListener("click", () => {
        const isOpen = item.classList.contains("open");
        $$(".acc-item.open").forEach((o) => o.classList.remove("open"));
        if (!isOpen) item.classList.add("open");
      });
    });
  }

  /* ---------------------------------------------------------
     9. Copy to clipboard
     --------------------------------------------------------- */
  function initCopy() {
    $$(".copy-btn").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const code = btn.parentElement.querySelector("code");
        if (!code) return;
        const text = code.textContent.trim();
        const original = btn.textContent;
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
        btn.textContent = "✓";
        btn.classList.add("text-gdrive-green", "border-gdrive-green/40");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("text-gdrive-green", "border-gdrive-green/40");
        }, 1600);
      });
    });
  }

  /* ---------------------------------------------------------
     10. Marquee: duplicate the group for a seamless loop
     --------------------------------------------------------- */
  function initMarquee() {
    const track = $(".marquee__track");
    const group = $(".marquee__group");
    if (!track || !group) return;
    const clone = group.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
  }

  /* ---------------------------------------------------------
     11. Count-up animation for the hero stats
     --------------------------------------------------------- */
  function initCounters() {
    const nums = $$("[data-count]");
    if (!nums.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target;
          io.unobserve(el);
          const target = parseFloat(el.dataset.count);
          if (reduce || isNaN(target)) {
            el.textContent = el.dataset.count;
            return;
          }
          const suffix = el.dataset.suffix || "";
          const dur = 1100;
          const start = performance.now();
          function step(now) {
            const p = Math.min((now - start) / dur, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (p < 1) requestAnimationFrame(step);
          }
          requestAnimationFrame(step);
        });
      },
      { threshold: 0.4 }
    );
    nums.forEach((n) => io.observe(n));
  }

  /* ---------------------------------------------------------
     12. Smooth anchor scrolling with header offset
     --------------------------------------------------------- */
  function initAnchors() {
    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (e) => {
        const id = a.getAttribute("href");
        if (!id || id === "#") return;
        const target = document.querySelector(id);
        if (!target) return;
        e.preventDefault();
        const offset = 90;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: "smooth" });
      });
    });
  }

  /* ---------------------------------------------------------
     13. Dynamic GitHub Releases Fetcher
     --------------------------------------------------------- */
  async function initReleases() {
    const container = $("#dynamic-downloads");
    if (!container) return;
    try {
      const res = await fetch("https://api.github.com/repos/tzanella/gdrivedesktoplinux/releases/latest");
      if (!res.ok) throw new Error("Status " + res.status);
      const data = await res.json();
      const assets = data.assets || [];
      if (!assets.length) throw new Error("No assets found");

      container.innerHTML = "";
      const tagBadge = document.createElement("div");
      tagBadge.className = "w-full text-center text-xs font-semibold text-gdrive-blue mb-1";
      tagBadge.textContent = "Última versão: " + (data.tag_name || data.name || "1.3.1");
      container.appendChild(tagBadge);

      const icons = {
        flatpak: "📦 Flatpak",
        deb: "🐧 .deb",
        rpm: "🎩 .rpm",
        zst: "🏹 Arch",
        tar: "🗜️ .tar.gz"
      };

      assets.forEach((asset) => {
        const name = asset.name;
        if (name.endsWith(".minisig") || name === "SHA256SUMS") return;
        let label = name;
        if (name.endsWith(".flatpak")) label = icons.flatpak;
        else if (name.endsWith(".deb")) label = icons.deb;
        else if (name.endsWith(".rpm")) label = icons.rpm;
        else if (name.endsWith(".pkg.tar.zst")) label = icons.zst;
        else if (name.endsWith(".tar.gz")) label = icons.tar;

        const btn = document.createElement("a");
        btn.href = asset.browser_download_url;
        btn.className = "inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white transition hover:bg-white/10 hover:border-white/20 hover:scale-105";
        btn.innerHTML = `<span>${label}</span> <span class="text-[10px] text-slate-400">(${Math.round(asset.size / (1024 * 1024))} MB)</span>`;
        container.appendChild(btn);
      });
    } catch (err) {
      container.innerHTML = `<span class="text-xs text-slate-400">Acesse diretamente os pacotes no <a href="https://github.com/tzanella/gdrivedesktoplinux/releases/latest" class="text-gdrive-blue hover:underline">GitHub Releases</a>.</span>`;
    }
  }

  /* ---------------------------------------------------------
     14. Boot
     --------------------------------------------------------- */
  function boot() {
    initLocale();
    initReveal();
    initNav();
    initSpotlight();
    initCardGlow();
    initTabs();
    initLightbox();
    initAccordion();
    initCopy();
    initMarquee();
    initCounters();
    initAnchors();
    initReleases();
    movePill();
    setTimeout(movePill, 300);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(movePill).catch(() => {});
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
