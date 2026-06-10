# 🌌 MathVerse: Future Tech City

<div align="center">

![MathVerse](https://img.shields.io/badge/MathVerse-Future%20Tech%20City-00f0ff?style=for-the-badge&logo=react&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-R3F-black?style=flat-square&logo=threedotjs)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

**منصة تعليمية ثلاثية الأبعاد تفاعلية مبنية على الويب**
*An immersive 3D educational platform for learning Mathematics & Technology*

[🎮 Live Demo](#) • [🚀 Getting Started](#-getting-started)

</div>

---

## 🎯 About

**MathVerse: Future Tech City** is a gamified 3D educational platform where students explore a futuristic smart city to learn mathematics and technology. Navigate your avatar through the city, enter educational buildings, earn XP, and level up your mathematical knowledge!

Students can:
- 🏙️ Explore a fully interactive 3D city with keyboard controls
- 🎭 Customize their avatar (color, gender, accessories)
- 🏆 Earn XP and level up through math challenges
- 🗺️ Navigate using a live minimap
- 📷 Switch between Follow Camera & Top-Down view

---

## 🏛️ Buildings & Subjects

| Building | Subject | District |
|---|---|---|
| 🔵 **Algebra Tower** | Algebra & Equations | Inner City |
| 🟢 **Geometry Center** | Shapes & Space | Inner City |
| 🟡 **Data Center** | Statistics & Data | Inner City |
| 🟣 **AI Lab** | Artificial Intelligence | Inner City |
| 🔴 **Cyber Security HQ** | Cybersecurity | South District |
| 🟠 **Function Observatory** | Functions & Graphs | West District |
| 💚 **Algorithm Arena** | Algorithms & Logic | East District |
| 🩷 **Probability Lab** | Probability & Stats | North District |
| 🎵 **Pattern Academy** | Patterns & Sequences | North District |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + Vite |
| **3D Engine** | Three.js via React Three Fiber (R3F) |
| **3D Helpers** | @react-three/drei (Float, Cloud, Sky, KeyboardControls) |
| **Animations** | Framer Motion |
| **State** | React useState / useRef / useFrame |
| **Persistence** | localStorage |
| **Styling** | Vanilla CSS (Glassmorphism + Dark Theme) |

---

## 🚀 Getting Started

### Prerequisites
- Node.js `>= 18`
- npm `>= 9`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/AIabood/MathVerse-.git
cd MathVerse-

# 2. Install dependencies
npm install

# 3. Start the dev server
npm run dev
```

Open your browser at `http://localhost:5173` 🎉

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎮 Controls

| Key | Action |
|---|---|
| `W` / `↑` | Move Forward |
| `S` / `↓` | Move Backward |
| `A` / `←` | Turn Left |
| `D` / `→` | Turn Right |
| `⚙️ Settings` | Open Settings Menu |
| `📷 Camera` | Toggle Top-Down / Follow View |

---

## 📁 Project Structure

```
MathVerse-/
├── public/
├── src/
│   ├── components/
│   │   ├── FutureTechCity.jsx   # Main 3D world (buildings, roads, player)
│   │   ├── AvatarBuilder.jsx    # Avatar customization UI
│   │   ├── UserProfile.jsx      # Player profile & XP display
│   │   ├── ProfileCreation.jsx  # Initial profile setup
│   │   ├── WelcomeCard.jsx      # Welcome screen
│   │   └── WelcomeModal.jsx     # Intro modal
│   ├── App.jsx                  # Root component + settings HUD
│   ├── main.jsx
│   └── index.css                # Global styles
├── index.html
├── vite.config.js
└── package.json
```

---

## ✨ Features

- 🌆 **Futuristic 3D City** — Roads, roundabout, streetlights, trees, rocks, clouds
- 🚶 **Third-Person Player** — Smooth WASD movement with collision detection
- 🏗️ **Unique Building Designs** — Each subject has a custom architectural style
- 🗺️ **Interactive Minimap** — Color-coded buildings with player position tracking
- ⚙️ **Settings Panel** — Avatar HUD, camera toggle, player profile in one menu
- 🎭 **Avatar Builder** — Gender, color, and accessories customization
- 📊 **XP System** — Level-based progression saved in localStorage
- 🌤️ **Dynamic Sky** — Animated clouds, sky gradient, and ambient lighting
- 🌳 **Physics Collision** — Player cannot walk through trees, rocks, or buildings

---

## 🗺️ Roadmap

- [ ] Interactive math challenges inside each building
- [ ] Multiplayer support
- [ ] Firebase/Supabase backend for cloud saves
- [ ] Mobile touch controls
- [ ] Sound effects & background music
- [ ] More districts and subjects

---

## 👨‍💻 Author

**AIabood** — [@AIabood](https://github.com/AIabood)

---

## 📄 License

This project is licensed under the **MIT License**.
