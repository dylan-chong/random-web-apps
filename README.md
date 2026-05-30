# Random Web Apps

A collection of random Claude-written web apps for various uses, so nothing too exciting.

## 🌐 Live Site

Visit the live site: [https://dylan-chong.github.io/random-web-apps/](https://dylan-chong.github.io/random-web-apps/)

## 📱 Available Apps

### Poker Tracker 🎰
Track player buy-ins and cash-outs for home poker games. Automatically calculates winners, losers, and keeps a running history. All data stored locally in your browser using LocalStorage.

**Features:**
- Player buy-in tracking with timestamps
- Cash-out management
- Automatic win/loss calculations
- Player autocomplete
- Results summary with biggest winner/loser
- Persistent local storage

[Try it →](pages/poker-tracker.html)

### Knight Vision Trainer ♞
Practice recognizing which pieces are defended by knights. Click all pieces that any knight can see, improving your defensive awareness and tactical vision.

**Features:**
- Three difficulty levels (Easy, Medium, Hard)
- SVG chess pieces from Lichess
- Random position generation
- Session and historical performance tracking
- Mobile-friendly touch interface
- Timer for each position

[Try it →](pages/knight-trainer.html)

## 🎨 Design

All apps use the **Tokyo Night Moon** color scheme for a consistent, modern aesthetic:
- Background: `#1e2030` (dark blue-gray)
- Primary Accent: `#82aaff` (light blue)
- Secondary Accent: `#c099ff` (purple)
- Positive: `#c3e88d` (green)
- Negative: `#ff757f` (red)

## 🛠️ Tech Stack

- Pure HTML, CSS, and JavaScript
- No frameworks or build tools required
- Google Fonts (Inter, JetBrains Mono)
- LocalStorage API for data persistence
- Responsive design with CSS Grid/Flexbox

## 💻 Local Development

1. Clone the repository:
```bash
git clone https://github.com/dylan-chong/random-web-apps.git
cd random-web-apps
```

2. Open `index.html` in your browser or use a local server:
```bash
# Using Python 3
python3 -m http.server 8000
```

3. Navigate to `http://localhost:8000`

## 📁 Project Structure

```
random-web-apps/
├── index.html              # Main landing page
├── pages/                  # Individual app pages
│   └── poker-tracker.html
├── assets/
│   ├── css/
│   │   └── tokyo-night-moon.css  # Shared theme
│   ├── js/                 # (Reserved for shared utilities)
│   └── images/             # (Reserved for images)
└── README.md
```

## ➕ Adding New Apps

1. Create a new HTML file in the `pages/` directory
2. Link to the shared stylesheet: `<link rel="stylesheet" href="../assets/css/tokyo-night-moon.css">`
3. Add a card for your app in `index.html`
4. Update this README with the new app details

## 📄 License

MIT License - feel free to use and modify for your own projects.
