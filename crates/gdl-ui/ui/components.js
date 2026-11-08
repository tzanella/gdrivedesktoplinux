// Peças de tela, montadas pelo DOM (sem `innerHTML` e sem estilo embutido, por causa da CSP).

const SVG = 'http://www.w3.org/2000/svg';

// `el('p', { class: 'x', onclick }, 'texto', outroElemento)`.
export function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(props)) {
    if (key.startsWith('on')) node.addEventListener(key.slice(2), value);
    else if (value !== false && value != null) node.setAttribute(key, value === true ? '' : value);
  }
  node.append(...children.flat());
  return node;
}

// Cria um elemento SVG no namespace correto.
export function svgEl(tag, attrs = {}, ...children) {
  const node = document.createElementNS(SVG, tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== false && value != null) node.setAttribute(key, String(value));
  }
  node.append(...children.flat());
  return node;
}

// Um símbolo do `icons/sprite.svg`.
export function icon(name) {
  const use = svgEl('use', { href: `icons/sprite.svg#${name}` });
  return svgEl('svg', { class: 'icon', 'aria-hidden': 'true' }, use);
}

// Spinner circular animado de 4 cores estilo Google.
export function googleSpinner() {
  return svgEl(
    'svg',
    { class: 'g-spinner', viewBox: '25 25 50 50', 'aria-hidden': 'true' },
    svgEl('circle', { cx: 50, cy: 50, r: 20 }),
  );
}

// Vetor animado estilo Google Material 3 para o cabeçalho de status (muda conforme o estado).
export function statusGraphic(state = 'synced') {
  const isError = state === 'error' || state === 'quota-full';
  const isSyncing = state === 'syncing' || state === 'checking' || state === 'starting';
  const isPaused = state === 'paused';

  const badgeFill = isError
    ? 'var(--g-red-soft)'
    : isPaused
      ? 'var(--g-yellow-soft)'
      : isSyncing
        ? 'var(--g-blue-soft)'
        : 'var(--g-green-soft)';

  const accentStroke = isError
    ? 'var(--g-red)'
    : isPaused
      ? 'var(--g-yellow)'
      : isSyncing
        ? 'var(--g-blue)'
        : 'var(--g-green)';

  // Forma orgânica recortada (cookie Material 3) de fundo + formas orbitais Google.
  const centerGlyph = isError
    ? svgEl('path', {
      d: 'M24 16v9M24 29.5h.02',
      stroke: accentStroke,
      'stroke-width': 3,
      'stroke-linecap': 'round',
      fill: 'none',
    })
    : isPaused
      ? svgEl('path', {
        d: 'M21 18v12M27 18v12',
        stroke: accentStroke,
        'stroke-width': 3,
        'stroke-linecap': 'round',
        fill: 'none',
      })
      : isSyncing
        ? svgEl('path', {
          class: 'g-shape-spin',
          d: 'M17 24a7 7 0 0 1 12-4.9M31 24a7 7 0 0 1-12 4.9',
          stroke: accentStroke,
          'stroke-width': 2.8,
          'stroke-linecap': 'round',
          fill: 'none',
        })
        : svgEl('path', {
          d: 'M18.5 24.5l3.8 3.8 7.5-7.8',
          stroke: accentStroke,
          'stroke-width': 3,
          'stroke-linecap': 'round',
          'stroke-linejoin': 'round',
          fill: 'none',
        });

  return el(
    'span',
    { class: 'g-vector-scene status-graphic', 'aria-hidden': 'true' },
    svgEl(
      'svg',
      { class: 'g-vector-svg', width: 48, height: 48, viewBox: '0 0 48 48' },
      // Pílula azul decorativa flutuante (topo direito).
      svgEl('rect', {
        class: 'g-shape-float-1',
        x: 34,
        y: 5,
        width: 9,
        height: 9,
        rx: 4.5,
        fill: 'var(--g-blue)',
        opacity: '0.85',
      }),
      // Losango amarelo suave (baixo esquerdo).
      svgEl('rect', {
        class: 'g-shape-float-2',
        x: 5,
        y: 33,
        width: 8,
        height: 8,
        rx: 2.5,
        transform: 'rotate(20 9 37)',
        fill: 'var(--g-yellow)',
        opacity: '0.9',
      }),
      // Ponto vermelho/verde (topo esquerdo).
      svgEl('circle', {
        class: 'g-shape-float-2',
        cx: 9,
        cy: 11,
        r: 3.2,
        fill: isError ? 'var(--g-red)' : 'var(--g-green)',
        opacity: '0.8',
      }),
      // Escudo orgânico central Material 3.
      svgEl('path', {
        class: 'g-shape-spin',
        d: 'M24 6C28.5 6 32.2 8.2 35 11C37.8 13.8 40 17.5 40 22V26C40 30.5 37.8 34.2 35 37C32.2 39.8 28.5 42 24 42C19.5 42 15.8 39.8 13 37C10.2 34.2 8 30.5 8 26V22C8 17.5 10.2 13.8 13 11C15.8 8.2 19.5 6 24 6Z',
        fill: badgeFill,
      }),
      centerGlyph,
    ),
  );
}

// Ilustração vetorial geométrica de 4 cores estilo Google Drive para estados vazios, login e Sobre.
export function googleHeroShapes() {
  return el(
    'div',
    { class: 'g-vector-scene g-hero-shapes', 'aria-hidden': 'true' },
    svgEl(
      'svg',
      { class: 'g-vector-svg', width: 120, height: 68, viewBox: '0 0 120 68' },
      svgEl('rect', {
        class: 'g-shape-float-1',
        x: 10,
        y: 16,
        width: 34,
        height: 34,
        rx: 12,
        transform: 'rotate(-10 27 33)',
        fill: 'var(--g-blue-soft)',
      }),
      svgEl('circle', {
        class: 'g-shape-float-2',
        cx: 60,
        cy: 34,
        r: 22,
        fill: 'var(--g-green-soft)',
      }),
      svgEl('rect', {
        class: 'g-shape-float-1',
        x: 78,
        y: 18,
        width: 30,
        height: 30,
        rx: 15,
        fill: 'var(--g-yellow-soft)',
      }),
      // Triângulo estilizado remetendo às 3 barras do Google Drive.
      svgEl('path', {
        class: 'g-shape-spin',
        d: 'M54 20L66 20L74 34L68 44L46 44L54 20Z',
        fill: 'none',
        stroke: 'var(--g-blue)',
        'stroke-width': 2.5,
        'stroke-linejoin': 'round',
      }),
      svgEl('circle', { cx: 26, cy: 32, r: 5, fill: 'var(--g-blue)' }),
      svgEl('circle', { cx: 93, cy: 33, r: 5, fill: 'var(--g-yellow)' }),
      svgEl('circle', { cx: 60, cy: 14, r: 3.5, fill: 'var(--g-red)' }),
    ),
  );
}

// Estado de carregamento fluido estilo Google (barra 4 cores + spinner + formas + linhas skeleton).
export function googleViewLoader(label = '') {
  const row = (w1, w2) =>
    el(
      'div',
      { class: 'g-skeleton-row' },
      el(
        'div',
        { class: 'g-skeleton-lines' },
        el('div', { class: `g-skeleton-line primary ${w1}` }),
        el('div', { class: `g-skeleton-line secondary ${w2}` }),
      ),
      el('div', { class: 'g-skeleton-actions' }, el('div', { class: 'g-skeleton-pill' })),
    );
  return el(
    'div',
    { class: 'view-loading', role: 'status', 'aria-live': 'polite' },
    el('div', { class: 'g-progress-bar', 'aria-hidden': 'true' }),
    el(
      'div',
      { class: 'view-loading-header' },
      googleSpinner(),
      googleHeroShapes(),
      label ? el('span', {}, label) : [],
    ),
    el(
      'div',
      { class: 'g-skeleton-list', 'aria-hidden': 'true' },
      row('w-wide', 'w-mid'),
      row('w-mid', 'w-short'),
      row('w-wide', 'w-short'),
      row('w-mid', 'w-mid'),
    ),
  );
}

// Uma caixa de seleção ou opção com o texto ao lado (`.choice`).
export function choice(input, ...content) {
  return el('label', { class: 'choice' }, input, el('span', {}, ...content));
}

// Um cartão: título, conteúdo e, se houver, um botão de texto.
export function card(title, content, label, onclick) {
  return el(
    'section',
    { class: 'card' },
    el('h2', {}, title),
    content,
    label ? el('button', { class: 'text', onclick }, label) : [],
  );
}

// Carrega a folha de estilo de uma tela (uma vez); resolve quando ela vale, para a tela não
// aparecer sem estilo.
export function stylesheet(href) {
  if (document.querySelector(`link[href="${href}"]`)) return Promise.resolve();
  return new Promise((resolve) => {
    document.head.append(el('link', { rel: 'stylesheet', href, onload: resolve, onerror: resolve }));
  });
}

// Caixa de diálogo modal: resolve `true` com o botão de confirmar e `false` ao cancelar (ou Esc).
// `ready()` diz se dá para confirmar; vale de novo a cada mudança no conteúdo.
export function confirmDialog({ title, body, confirm, cancel, danger = false, ready = () => true }) {
  return new Promise((resolve) => {
    const ok = el('button', { class: danger ? 'filled danger' : 'filled' }, confirm);
    const no = el('button', { class: 'dialog-cancel' }, cancel);
    const dialog = el(
      'dialog',
      { class: 'dialog' },
      el('h2', { class: 'dialog-title' }, title),
      el('div', { class: 'dialog-body' }, body),
      el('div', { class: 'actions' }, no, ok),
    );
    const finish = (answer) => {
      dialog.close();
      dialog.remove();
      resolve(answer);
    };
    ok.addEventListener('click', () => finish(true));
    no.addEventListener('click', () => finish(false));
    dialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      finish(false);
    });
    const check = () => {
      ok.disabled = !ready();
    };
    dialog.addEventListener('change', check);
    dialog.addEventListener('input', check);
    check();
    document.body.append(dialog);
    dialog.showModal();
  });
}

// Menu suspenso abaixo de `anchor`: `items` são `{ label, action, disabled, id }` (`label` pode ser
// um nó, como a linha de uma conta), `{ node }`
// (conteúdo sem ação, como o cartão da conta) ou `'-'` (separador). Fecha ao escolher, ao clicar
// fora ou com Esc.
let closeOpenMenu = null;
export function popupMenu(anchor, items) {
  closeOpenMenu?.();
  const menu = el('div', { class: 'menu', role: 'menu' });
  const place = () => {
    const box = anchor.getBoundingClientRect();
    const margin = 8;
    const availBelow = window.innerHeight - box.bottom - margin - 4;
    const availAbove = box.top - margin - 4;
    const maxH = Math.max(160, Math.min(window.innerHeight - margin * 2, Math.max(availBelow, availAbove)));
    menu.style.maxHeight = `${maxH}px`;
    const left = Math.min(box.left, window.innerWidth - menu.offsetWidth - margin);
    menu.style.left = `${Math.max(margin, left)}px`;
    const desiredTop = box.bottom + 4;
    const clampedTop = Math.min(desiredTop, window.innerHeight - menu.offsetHeight - margin);
    menu.style.top = `${Math.max(margin, clampedTop)}px`;
  };
  const resized = new ResizeObserver(place);
  const close = () => {
    if (closeOpenMenu === close) closeOpenMenu = null;
    resized.disconnect();
    menu.remove();
    document.removeEventListener('pointerdown', outside, true);
    document.removeEventListener('keydown', escape, true);
  };
  const outside = (e) => {
    if (!menu.contains(e.target)) close();
  };
  const escape = (e) => {
    if (e.key === 'Escape') close();
  };
  for (const item of items) {
    if (item === '-' || item.node) {
      menu.append(item.node ?? el('hr'));
      continue;
    }
    const button = el(
      'button',
      { role: 'menuitem', 'data-action': item.id, disabled: item.disabled },
      item.label,
    );
    button.addEventListener('click', () => {
      close();
      item.action();
    });
    menu.append(button);
  }
  document.body.append(menu);
  closeOpenMenu = close;
  place();
  resized.observe(menu);
  document.addEventListener('pointerdown', outside, true);
  document.addEventListener('keydown', escape, true);
  menu.querySelector('button:not([disabled])')?.focus();
}

// O botão "⋮" de uma linha: abre `popupMenu` com os itens de `items()`, montados no clique.
export function menuButton(label, items) {
  const button = el('button', { class: 'icon-button row-menu', 'aria-label': label }, icon('more_vert'));
  button.addEventListener('click', () => popupMenu(button, items()));
  return button;
}

// A paginação de `paginate`: o que vier em `extra` (o tamanho da página), "Mostrando X–Y de Z" e
// as setas, que chamam `go(-1)` ou `go(1)`.
export function pager(t, page, go, ...extra) {
  return el(
    'div',
    { class: 'pager' },
    ...extra,
    el('span', {}, t('showing', page)),
    el('button', { class: 'icon-button', 'aria-label': t('page-previous'), disabled: page.page <= 1, onclick: () => go(-1) }, icon('chevron_left')),
    el('button', { class: 'icon-button', 'aria-label': t('page-next'), disabled: page.page >= page.pages, onclick: () => go(1) }, icon('chevron_right')),
  );
}

// O rodapé "Alterações pendentes", Cancelar e Salvar das telas que editam e salvam (Preferências e
// Drives compartilhados): `footer` é o elemento e `update(changed, valid)` liga os botões (Salvar
// também pede `valid`).
export function saveFooter(t, { onSave, onCancel }) {
  const pending = el('span', { class: 'pending-changes' }, t('pref-pending'));
  const cancel = el('button', { class: 'tonal cancel', onclick: onCancel }, t('action-cancel'));
  const save = el('button', { class: 'filled save', onclick: onSave }, t('pref-save'));
  return {
    footer: el('footer', { class: 'actions save-footer' }, pending, cancel, save),
    update(changed, valid = true) {
      pending.hidden = !changed;
      cancel.disabled = !changed;
      save.disabled = !changed || !valid;
    },
  };
}

// A trilha "Início › Pasta › Subpasta" (`steps`: `[{ name }]`, o início primeiro): cada parte,
// menos a última, volta para ela (`go(i)`, com `i` as pastas da trilha que ficam). Vai num
// elemento `.crumbs`.
export function crumbs(steps, go) {
  return steps.flatMap((step, i) => {
    const last = i === steps.length - 1;
    const button = el('button', { class: 'text', 'aria-current': last ? 'location' : false, disabled: last }, step.name);
    button.addEventListener('click', () => go(i));
    return i ? [icon('chevron_right'), button] : [button];
  });
}

// Aviso curto no rodapé da janela.
export function toast(text) {
  const note = el('div', { class: 'toast', role: 'status' }, text);
  document.body.append(note);
  setTimeout(() => note.remove(), 4000);
}

// O texto de um erro (do serviço ou do JavaScript).
export const errorText = (error) => error?.message ?? String(error);

// O erro de uma ação do usuário, num aviso.
export const toastError = (error) => toast(errorText(error));

// Espera `promise`; com sucesso chama `done` (com o resultado), com erro mostra o aviso.
export const attempt = (promise, done) => promise.then(done).catch(toastError);
