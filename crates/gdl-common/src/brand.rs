//! A identidade do app: nome, IDs, pastas e endereços.

/// O repositório principal do projeto (issues, releases e a busca por versão nova).
pub const PROJECT_URL: &str = "https://github.com/tzanella/gdrive-desktop-linux";

/// Se o build traz o Client ID oficial embutido em vez de pedir o do usuário.
pub const OFFICIAL: bool = false;

/// O id do app: o nome do `.desktop`, do ícone e da classe das janelas.
pub const APP_ID: &str = "io.github.tzanella.GDriveDesktopLinux";

/// O `.desktop` principal (menu e início automático).
pub const DESKTOP_FILE: &str = "io.github.tzanella.GDriveDesktopLinux.desktop";

/// O nome do pacote, das pastas XDG, do chaveiro e do programa da linha de comando.
pub const PACKAGE: &str = "gdrive-desktop-linux";
pub const DAEMON: &str = "gdrive-desktop-linuxd";
pub const TRAY_PROGRAM: &str = "gdrive-desktop-linux-tray";
pub const UI_PROGRAM: &str = "gdrive-desktop-linux-ui";
pub const MCP_PROGRAM: &str = "gdrive-desktop-linux-mcp";

/// O log do serviço, em `<state_dir>/logs`.
pub const LOG_FILE: &str = "gdrive-desktop-linuxd.log";

/// O nome que o usuário vê (menus, notificações, barra lateral).
pub const DISPLAY_NAME: &str = "Google Drive";

/// A pasta montada em `~`.
pub const MOUNT_DIR: &str = "Google Drive";

/// O nome do serviço no D-Bus: o id do app com a versão da interface.
pub const BUS_NAME: &str = "io.github.tzanella.GDriveDesktopLinux1";
pub const OBJECT_PATH: &str = "/io/github/tzanella/GDriveDesktopLinux1";
pub const UI_BUS_NAME: &str = "io.github.tzanella.GDriveDesktopLinux1.Ui";
pub const UI_OBJECT_PATH: &str = "/io/github/tzanella/GDriveDesktopLinux1/Ui";
pub const TRAY_BUS_NAME: &str = "io.github.tzanella.GDriveDesktopLinux1.Tray";

/// A página do app (ajuda, privacidade e termos).
pub const SITE_URL: &str = "https://tzanella.github.io/gdrive-desktop-linux/";
