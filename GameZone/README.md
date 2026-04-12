# CodeKids Playground

A React-based educational gaming platform designed to teach children coding concepts through interactive games.

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd GameZone

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

## 📦 Build for Production

```bash
npm run build
npm run preview  # Preview the production build
```

## 🎮 Games

### Memory Game
Match Hebrew-English word pairs to learn coding vocabulary. Features:
- Multiple difficulty levels
- Real-time scoring
- Helpful hints with word definitions
- Level progression

## 🛠️ Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **JavaScript (ES6+)** - Language

## 📁 Project Structure

```
src/
├── components/       # React components
├── App.jsx          # Main app structure
├── index.css        # Global styles
├── main.jsx         # Entry point
└── App.css          # App-specific styles
```

## 🌐 Internationalization

- **Hebrew (RTL)** - Primary language
- **English** - Default fallback
- Full right-to-left layout support

## 🎨 Design System

- **Color Theme**: Based on Material Design 3
- **Typography**: Heebo (Hebrew), Plus Jakarta Sans (Headlines)
- **Icons**: Material Symbols Outlined
- **Components**: Tailwind CSS utility-first approach

## 📚 Component Documentation

### Header
Navigation bar with logo and menu

### Footer  
Footer with links and copyright

### Home
Landing page with:
- Hero section with Bit the Robot
- Game selection grid
- Achievement statistics

### MemoryGame
Interactive memory matching game with game logic

## 🔧 Configuration

- `tailwind.config.js` - Tailwind CSS settings and color palette
- `postcss.config.js` - PostCSS processing
- `vite.config.js` - Vite build configuration
- `package.json` - Dependencies and scripts

## 📝 Development Guidelines

1. Use React functional components with hooks
2. Follow Tailwind CSS utility-first approach
3. Maintain RTL layout compatibility
4. Keep components modular and reusable
5. Add proper error handling

## 🚀 Deployment

Ready to deploy on:
- Vercel (recommended)
- Netlify
- GitHub Pages
- Traditional hosting services

```bash
# Build the project
npm run build

# Deploy the 'dist' folder to your hosting service
```

## 📧 Support

For issues or feature requests, please open an issue in the repository.

## 📄 License

This project is open source and available under the MIT License.

---

**Made with ❤️ for learning to code**
