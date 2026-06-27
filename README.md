# Subham Das — Interactive macOS like Developer Portfolio

An interactive, high-fidelity macOS Desktop simulation built using vanilla HTML, CSS, and JavaScript. This portfolio showcases engineering projects, work history, and creative endeavors through a developer-focused monospace terminal layout.

🔗 **Live Link**: [https://subhamdas2806.github.io/](https://subhamdas2806.github.io/)

---

## 🚀 Key Features

### 1. Draggable macOS Window System
* **Desktop Drag & Drop**: Click and hold the window header to reposition the simulator anywhere inside your browser workspace.
* **Smart Physics Bounds**: Boundary protections prevent the window from getting lost off-screen.
* **Control Dots Interactivity**:
  * **Close (Red Dot)**: Initiates system shutdown and boots into the simulated **System Offline terminal console**.
  * **Minimize (Yellow Dot)**: Animates the window to the bottom, opening a floating **Restore Window pill** widget.
  * **Maximize (Green Dot)**: Toggles full-screen layout.

### 2. Interactive Zsh Terminal Emulator
Click the terminal card in the **Connect** section to focus the active shell prompt. A blinking caret captures keyboard entries for the following interactive shell commands:
* `help` — Lists all available shell commands.
* `neofetch` — Outputs ASCII profile logo alongside dynamic system stats (uptime, viewport resolution, theme, etc.).
* `about` — Prints bio information.
* `experience` — Lists professional work history & internships.
* `participation` — Lists hackathon and competition history.
* `projects` — Lists key project summaries & tech stacks.
* `skills` — Outputs language and frontend/backend expertise.
* `theme` — Toggles between Dark Mode (Solid Slate) and Light Mode (macOS Silver).
* `wallpaper` — Cycles through available desktop gradients.
* `clear` — Empties the terminal command history log.
* `email` / `linkedin` / `github` — Copies email or opens social handles.

### 3. Spotlight Search Split View (⌘)
Press `Alt + K` (or click the search pill at the top of the window header) to trigger Spotlight Search:
* **Two-Column Layout**: Left-hand navigation matches key sections, and the right-hand panel renders dynamic summaries and shortcuts.
* **Terminal Mode**: Type `/` to invoke direct shell parser queries (e.g., `/help`, `/about`, `/theme`) directly in search.

### 4. Desktop Wallpaper customizer
Switch between multiple desktop gradients that persist across page reloads using `localStorage`:
* **Monterey Wave** (Default pink-violet abstract waves)
* **Sonoma Aurora** (Warm golden-orange-purple)
* **Deep Space** (Dark starry layout)
* **Matrix Terminal** (Neon green digital glow)

---

## ⌨️ Keyboard Shortcuts Cheat Sheet

Press these keys globally when the Spotlight search dialog is closed:

| Shortcut | Description |
| :--- | :--- |
| **`Alt + K`** | Open / Close Spotlight Search |
| **`Alt + H`** | Scroll to **Hero** section |
| **`Alt + A`** | Scroll to **About** section |
| **`Alt + X`** | Scroll to **Work Experience** section |
| **`Alt + W`** | Scroll to **Selected Work** section |
| **`Alt + S`** | Scroll to **Tech Stack** section |
| **`Alt + O`** | Scroll to **Outside Code (Creative)** section |
| **`Alt + E`** | Scroll to **Education** section |
| **`Alt + V`** | Scroll to **Participation** section |
| **`Alt + C`** | Scroll to **Connect** section |
| **`Alt + T`** | Toggle Theme (Dark / Light) |
| **`Alt + P`** | Cycle Desktop Wallpaper |
| **`Alt + M`** | Copy Email to Clipboard |
| **`Alt + G`** | Open GitHub Profile |

---

## 🛠️ Built With

* **Core**: Semantic HTML5, CSS3 Custom Properties (Variables), Vanilla JavaScript (ES6+).
* **Interactions**: Intersection Observer API (Scroll Reveal animations), Custom Drag Event Handlers.
* **Typography**: IBM Plex Mono, JetBrains Mono, and Inter (loaded from Google Fonts).
