# NEXARA Prototype – WordPress Plugin

Minimal WordPress plugin prototype with an admin settings page and a shortcode.

## Features

- **Settings page**: Settings → NEXARA Prototype. Edit a message used by the shortcode.
- **Shortcode**: `[nexara_hello]` – outputs the configured message on any post or page.
- **Activation**: Sets default options on plugin activation.
- **Security**: Nonce and capability checks on the admin form; escaped output.

## Installation

1. Copy the `wordpress-plugin` folder into `wp-content/plugins/` and rename it to `nexara-prototype` (or copy its contents into `wp-content/plugins/nexara-prototype/`).
2. In WordPress admin go to **Plugins** and activate **NEXARA Prototype**.
3. Configure under **Settings → NEXARA Prototype**.
4. Add `[nexara_hello]` to a post or page to show the message.

## File structure

```
wordpress-plugin/
├── nexara-prototype.php   # Main plugin file (single-file prototype)
├── uninstall.php         # Removes options when plugin is deleted
└── README.md             # This file
```

## Requirements

- WordPress 6.0+
- PHP 7.4+

## Uninstall

- **Deactivate**: Plugin in **Plugins**; options are kept.
- **Delete**: Remove the plugin via **Plugins → Delete**; `uninstall.php` runs and removes saved options.

## Extending

- Add more shortcodes in `nexara-prototype.php` and register with `add_shortcode()`.
- Add more options and form fields on the same admin page.
- For larger plugins, split into `includes/` (e.g. `class-nexara-admin.php`, `class-nexara-shortcodes.php`) and require from the main file.
