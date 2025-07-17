# Minimal TV Launcher

A minimal, fast, and customizable TV launcher for Windows, built with Electron. Designed to turn any PC into a simple, remote-controlled media center.

> 💡 _Don't forget to add and insert a screenshot of your launcher here!_

---

## ✨ Features

- **Simple Tile-Based UI** – Clean interface inspired by modern TV operating systems.
- **Fully Customizable** – Modify a single `config.json` file to add, remove, or change tiles. No need to recompile.
- **Remote Control Friendly** – Operated entirely via arrow keys and Enter, perfect for IR remotes using tools like [EventGhost](http://www.eventghost.net/).
- **Launch Anything** – Open websites, local applications (`.exe`), or run system commands (e.g. sleep, shutdown).
- **Kiosk Mode** – Runs in a fullscreen, borderless window for a distraction-free experience.
- **Lightweight** – Built with vanilla HTML, CSS, and JS—no heavy dependencies.

---

## 🚀 Getting Started

### For End Users

1. Visit the [Releases](https://github.com/kernellevel/tv-launcher/releases) page.
2. Download the latest `portable.exe`.
3. Place the `.exe` in a folder along with:

   - `config.json`
   - `renderer/`
   - `assets/`

4. Customize `config.json` to your preferences.
5. Run the `.exe`.

---

### For Developers

1. **Clone the repository:**

   ```bash
   git clone https://github.com/kernellevel/tv-launcher.git
   cd tv-launcher
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run in development mode:**

   ```bash
   npm start
   ```

4. **Build a portable executable:**

   ```bash
   npm run dist
   ```

   The build output will appear in the `dist/` folder.

---

## ⚙️ Configuration

The launcher is fully configured through a single `config.json` file. Each tile is defined as a JSON object:

```json
[
	{
		"name": "Tile Name",
		"icon": "path/to/icon.png",
		"action": "action_to_perform"
	}
]
```

**Parameters:**

- `name`: Text displayed on the tile.
- `icon`: Path to the tile's icon image (relative to the app root).
- `action`: What happens when the tile is selected:

  - Website: `"https://example.com"`
  - Application: `"C:/Path/To/App.exe"` or `"notepad.exe"`
  - System command: `"system:sleep"` or `"system:shutdown"`

---

## 📸 Screenshot

> _(Insert launcher screenshot here)_

---

## 💡 Troubleshooting

### Sleep button shuts down the PC or takes a long time to wake up

This is a standard Windows 10 behavior when hibernation is enabled. The `system:sleep` command triggers hibernation instead of a light sleep (Suspend to RAM).

**To fix this, you need to disable hibernation once on your system.** This will also free up several gigabytes on your system drive.

1.  Open the Start Menu.
2.  Type `cmd`, right-click on **Command Prompt** and select **"Run as administrator"**.
3.  In the black window that appears, type the following command and press Enter:
    ```
    powercfg /hibernate off
    ```
4.  That's it! Now the "Sleep" button will work instantly. To wake the PC, simply press a key on your keyboard or remote.

---

## 📝 License

This project is licensed under the [MIT License](./LICENSE).

---
