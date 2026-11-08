# Publicação no Flathub e pacote Flatpak

Este documento descreve como gerar o pacote `.flatpak` localmente e como submeter o **Google Drive para Linux** (`io.github.tzanella.GDriveDesktopLinux`) ao [Flathub](https://docs.flathub.org/docs/for-app-authors/submission).

## Estrutura dos arquivos em `packaging/flatpak/`

| Arquivo | Função |
| --- | --- |
| `io.github.tzanella.GDriveDesktopLinux.metainfo.xml` | Metadados AppStream exigidos pelo Flathub (ID reverso DNS, licença, categorias, descrição, capturas de tela, cores de marca, classificação OARS `content_rating` e histórico de versões `<releases>`). |
| `io.github.tzanella.GDriveDesktopLinux.yml` | Manifesto para o `flatpak-builder` usando o runtime `org.gnome.Platform` (WebKitGTK 4.1 + GTK 3) e a extensão `org.freedesktop.Sdk.Extension.rust-stable`. |
| `gdrive-desktop-linux-flatpak` | Script de entrada (`command`) para o ambiente isolado do Flatpak: sobe o `gdrive-desktop-linuxd` em segundo plano caso ainda não esteja rodando no sandbox e inicia a bandeja (`gdrive-desktop-linux-tray`) ou a janela (`gdrive-desktop-linux-ui`). |

## Gerando o `.flatpak` localmente

Para gerar o bundle `.flatpak` (instalável com `flatpak install gdrive-desktop-linux-<versão>-x86_64.flatpak`):

```sh
sh scripts/build-flatpak.sh dist --from target/release
```

Para instalar o pacote gerado:

```sh
flatpak install --user dist/gdrive-desktop-linux-1.3.0-beta-x86_64.flatpak
```

## Justificativa de permissões (`finish-args`) para revisão do Flathub

1. `--share=network`: necessário para sincronizar arquivos com a API do Google Drive (`googleapis.com`) e autenticar via OAuth 2.0.
2. `--socket=wayland`, `--socket=fallback-x11`, `--device=dri`, `--share=ipc`: necessários para renderizar a interface gráfica GTK 3 + WebKitGTK (`wry`/`tao`).
3. `--filesystem=home`: necessário para sincronizar a pasta `~/Google Drive` e as pastas locais escolhidas pelo usuário em *Este computador* (ex.: `~/Documentos`, `~/Imagens`).
4. `--talk-name=org.freedesktop.secrets`: necessário para armazenar o token OAuth com segurança no chaveiro da sessão (GNOME Keyring / KWallet).
5. `--talk-name=org.freedesktop.Notifications`: envio de notificações nativas de sincronização e atualização.
6. `--talk-name=org.kde.StatusNotifierWatcher`: exibição do ícone de status na bandeja do sistema (StatusNotifierItem).
7. `--own-name=io.github.tzanella.GDriveDesktopLinux*`: comunicação D-Bus entre o serviço de sincronização, a bandeja, o CLI e a janela.

## Passo a passo para submissão ao Flathub

Conforme a [documentação oficial de submissão do Flathub](https://docs.flathub.org/docs/for-app-authors/submission):

1. **Gerar as fontes offline do Cargo (`generated-sources.json`):**
   O ambiente de build do Flathub não tem acesso à rede durante a compilação. Use o `flatpak-cargo-generator` para converter o `Cargo.lock`:
   ```sh
   flatpak-cargo-generator Cargo.lock -o packaging/flatpak/generated-sources.json
   ```
   E adicione `- generated-sources.json` na chave `sources:` do `packaging/flatpak/io.github.tzanella.GDriveDesktopLinux.yml`.

2. **Validar o AppStream e o manifesto com o linter do Flathub:**
   ```sh
   flatpak run --command=flatpak-builder-lint org.flatpak.Builder appstream packaging/flatpak/io.github.tzanella.GDriveDesktopLinux.metainfo.xml
   flatpak run --command=flatpak-builder-lint org.flatpak.Builder manifest packaging/flatpak/io.github.tzanella.GDriveDesktopLinux.yml
   ```

3. **Abrir o Pull Request no Flathub:**
   - Faça um fork de `https://github.com/flathub/flathub` no GitHub.
   - Clone o fork e crie uma branch a partir de `new-pr`:
     ```sh
     git checkout -b io.github.tzanella.GDriveDesktopLinux origin/new-pr
     ```
   - Copie `io.github.tzanella.GDriveDesktopLinux.yml` e `generated-sources.json` para a pasta raiz do fork e abra um Pull Request contra a branch `new-pr` de `flathub/flathub`.
