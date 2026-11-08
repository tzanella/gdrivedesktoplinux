#!/bin/sh
# Monta o pacote .flatpak (single-file bundle) em <saída> a partir dos binários compilados
# e dos metadados em packaging/flatpak/.
#
#   scripts/build-flatpak.sh [--from DIR] [--runtime VERSÃO] <saída>
#
# Usa `flatpak build-init`, `flatpak build-finish`, `flatpak build-export` e `flatpak build-bundle`.
# Para submissão oficial no Flathub (que exige compilação offline a partir do código-fonte via
# flatpak-builder), consulte packaging/flatpak/io.github.tzanella.GDriveDesktopLinux.yml e docs/flathub.md.
set -eu
repo=$(cd "$(dirname "$0")/.." && pwd)
from="" runtime=""
while [ $# -gt 1 ]; do
  case "$1" in
    --from) from=$2; shift 2 ;;
    --runtime) runtime=$2; shift 2 ;;
    *) echo "argumento desconhecido: $1" >&2; exit 2 ;;
  esac
done
[ $# -eq 1 ] || { echo "uso: scripts/build-flatpak.sh [--from DIR] [--runtime VERSÃO] <saída>" >&2; exit 2; }
mkdir -p "$1"
out=$(cd "$1" && pwd)
version=$(sed -n 's/^version = "\(.*\)"/\1/p' "$repo/Cargo.toml" | head -n 1)
app_id="io.github.tzanella.GDriveDesktopLinux"
name="gdrive-desktop-linux"

if [ -z "$from" ]; then
  (cd "$repo" && cargo build --release -p gdl-daemon -p gdl-cli -p gdl-tray -p gdl-ui -p gdl-mcp --bins)
  from="$repo/target/release"
fi

if [ -z "$runtime" ]; then
  for v in 49 48 50 47 51; do
    if flatpak info "org.gnome.Platform//${v}" >/dev/null 2>&1; then
      runtime="$v"
      break
    fi
  done
  if [ -z "$runtime" ]; then
    flatpak remote-add --if-not-exists flathub https://dl.flathub.org/repo/flathub.flatpakrepo 2>/dev/null || true
    flatpak install -y --noninteractive flathub org.gnome.Platform//48 2>/dev/null || true
    runtime="48"
  fi
fi

work=$(mktemp -d)
trap 'rm -rf "$work"' EXIT
build_dir="$work/build"
ostree_repo="$work/repo"

# 1. Inicializa a árvore Flatpak
sdk="org.gnome.Sdk"
flatpak info "${sdk}//${runtime}" >/dev/null 2>&1 || sdk="org.gnome.Platform"
flatpak build-init "$build_dir" "$app_id" "$sdk" org.gnome.Platform "$runtime"

# 2. Popula /app com os binários, ícones, .desktop, D-Bus e metainfo
mkdir -p "$work/stage"
sh "$repo/scripts/install-dev.sh" --prefix /app --destdir "$work/stage" --from "$from" --no-activate >/dev/null
cp -a "$work/stage/app/." "$build_dir/files/"
install -Dm755 "$repo/packaging/flatpak/gdrive-desktop-linux-flatpak" "$build_dir/files/bin/gdrive-desktop-linux-flatpak"
sed -i 's|^Exec=.*|Exec=gdrive-desktop-linux-flatpak|' \
  "$build_dir/files/share/applications/${app_id}.desktop"

# 3. Finaliza com as permissões do manifesto Flathub
flatpak build-finish "$build_dir" \
  --command=gdrive-desktop-linux-flatpak \
  --share=ipc \
  --share=network \
  --socket=fallback-x11 \
  --socket=wayland \
  --device=dri \
  --filesystem=home \
  --talk-name=org.freedesktop.Notifications \
  --talk-name=org.freedesktop.secrets \
  --talk-name=org.kde.StatusNotifierWatcher \
  --own-name="${app_id}" \
  --own-name="${app_id}1" \
  --own-name="${app_id}1.Ui"

# 4. Exporta para um repositório OSTree local e empacota o bundle .flatpak
flatpak build-export "$ostree_repo" "$build_dir" stable
bundle="$out/$name-$version-x86_64.flatpak"
flatpak build-bundle "$ostree_repo" "$bundle" "$app_id" stable \
  --runtime-repo=https://flathub.org/repo/flathub.flatpakrepo

echo "$bundle"
