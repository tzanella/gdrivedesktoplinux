# GDrive Desktop — Site

Site estático do [GDrive Desktop Linux](https://github.com/tzanella/gdrivedesktoplinux),
publicado no GitHub Pages a partir da branch `gh-pages`.

## Estrutura

```
index.html              # página única (hero, recursos, como funciona, telas, instalação, CLI, FAQ)
assets/css/style.css    # tema, animações e componentes (CSS puro)
assets/js/i18n.js       # dicionários pt-BR / en-US
assets/js/main.js       # interações: reveal, abas, lightbox, acordeão, idioma, marquee
assets/img/             # ícone do app e capturas de tela
```

## Desenvolvimento local

```bash
python3 -m http.server 8000
# abrir http://localhost:8000
```

## Idiomas

O site é **pt-BR** por padrão. O seletor `PT / EN` no topo troca o idioma via JavaScript
(`window.I18N`), usando os atributos `data-i18n` no HTML. A escolha fica salva no
`localStorage` (`gdl-locale`).

Para adicionar um texto: crie a chave nos dois dicionários de `assets/js/i18n.js` e
marque o elemento com `data-i18n="chave"`.

## Publicação

A branch `gh-pages` deste repositório é a fonte do GitHub Pages. Para publicar:

```bash
git checkout gh-pages
# ... alterações ...
git add -A && git commit -m "docs: atualiza o site"
git push origin gh-pages
```

Nas configurações do repositório no GitHub: **Settings › Pages › Source → Deploy from a
branch → `gh-pages` / `/ (root)`**.

## Stack

HTML, CSS e JavaScript puros, com Tailwind CSS via CDN e ícones SVG inline (nenhuma
dependência de imagens externas, exceto as fontes do Google).
