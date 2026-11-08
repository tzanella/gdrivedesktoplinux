// As telas que chegam nas próximas tarefas.

import { el, googleHeroShapes } from '../components.js';

export function render(root, { t }) {
  root.replaceChildren(el('main', { class: 'pending' }, googleHeroShapes(), el('p', {}, t('screen-not-ready'))));
}
