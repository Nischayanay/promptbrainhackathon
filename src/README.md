# PromptBrain Temple - AI-Powered Prompt Enhancement Platform

A mystical, temple-themed web application for enhancing AI prompts with sophisticated visual design and powerful backend functionality.

## 🏛️ Features

### ✨ **Temple-Themed Authentication**
- Elegant login/signup with "Access the Temple" branding
- 2-step mystical onboarding flow (Role Selection → Gift of Entry)
- Seamless transition to dashboard workspace

### 🎨 **Sophisticated Visual Design**
- 15+ custom CSS animations (temple-glow, cosmic-drift, hieroglyph patterns)
- Responsive temple aesthetic with floating pyramids and sacred geometry
- Complete color palette with royal gold, temple black, and mystical accents
- Inter + Playfair Display typography system

### 🚀 **Dashboard & Workspace**
- Multi-section dashboard with sidebar navigation
- Dual enhancement modes (Direct + Flow Mode)
- 4-step guided Flow Zone (Audience → Purpose → Style → Constraints → Review)
- Archives, profile management, and credits system

### 🔧 **Backend Integration**
- Supabase Edge Functions with Hono web server
- Gemini AI API integration for prompt enhancement
- User authentication and role management
- KV store for data persistence

## 📦 Installation for Kiro IDE

### 1. **Clone or Import**
```bash
# Copy all project files to your Kiro project directory
# Ensure you have the complete file structure
```

### 2. **Install Dependencies**
```bash
npm install
```

### 3. **Environment Setup**
Create `.env.local` file:
```bash
REACT_APP_SUPABASE_URL=your_supabase_url
REACT_APP_SUPABASE_ANON_KEY=your_supabase_anon_key
REACT_APP_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

### 4. **Run the Application**
```bash
npm start
# Application runs on http://localhost:3000
```

## 🏗️ Architecture

### **Frontend Components**
```
components/
├── LoginCard.tsx / SignupCard.tsx    # Authentication
├── RoleSelection.tsx / GiftOfEntry.tsx # Onboarding  
├── Dashboard.tsx                      # Main workspace
├── dashboard/                         # Dashboard sections
│   ├── Sidebar.tsx
│   ├── EnhanceInput.tsx
│   ├── GuidedFlow.tsx
│   └── ...
├── layouts/                           # Layout system
└── ui/                               # shadcn/ui components
```

### **Backend Services**
```
supabase/functions/server/
├── index.tsx        # Main Hono server
└── kv_store.tsx     # Database utilities
```

### **Styling System**
```
styles/globals.css   # Complete temple theme + animations
```

## 🎨 Temple Theme System

### **Color Palette**
- `--temple-black`: #0A0A0A (Primary background)
- `--royal-gold`: #FFD700 (Accent/primary actions) 
- `--marble-white`: #F9F9F9 (Text/foreground)
- `--electric-blue`: #3A86FF (Secondary accent)
- `--cyan-glow`: #00FFF7 (Interactive highlights)

### **Custom Animations**
- `temple-glow`: Mystical text glow effects
- `cosmic-drift`: Floating particle backgrounds
- `hieroglyph-float`: Ancient symbol animations
- `pyramid-glow`: 3D pyramid hover effects
- `beam-rise`: Ascending light beam effects

## 🔧 Customization

### **Brand Colors**
Update CSS variables in `styles/globals.css`:
```css
:root {
  --temple-black: #YourColor;
  --royal-gold: #YourAccent;
  /* ... */
}
```

### **Animation Timing**
Modify animation durations:
```css
.temple-glow {
  animation: temple-glow 4s ease-in-out infinite;
}
```

### **Layout Breakpoints**
Responsive design handled via Tailwind classes and CSS Grid.

## 🚀 Deployment

### **For Standard Node.js Hosting**
- All imports are now standard npm packages
- Environment variables use `process.env`
- Compatible with Vercel, Netlify, Railway, etc.

### **For Supabase Edge Functions**
- Backend uses Hono framework
- Automatic CORS configuration
- KV store integration for data persistence

## 📱 Responsive Design

- **Desktop**: 50/50 split layout for auth pages, full dashboard workspace
- **Tablet**: Optimized stacked layouts with preserved visual effects  
- **Mobile**: Mobile-first approach with adapted navigation and components

## 🔐 Authentication Flow

1. **Login/Signup** → Authentication with temple branding
2. **Role Selection** → Choose Creator, Founder, or Researcher
3. **Gift of Entry** → Mystical onboarding completion
4. **Dashboard** → Full workspace access with credits system

## ⚡ Key Features

- **Production-ready** with complete auth and backend
- **Highly modular** component architecture
- **Easily customizable** temple theme system
- **Responsive** mobile-first design
- **Backend integration** with AI prompt enhancement
- **Sophisticated animations** and visual effects

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS v3
- **Backend**: Supabase Edge Functions, Hono
- **Database**: Supabase PostgreSQL + KV Store
- **AI**: Gemini API integration
- **UI Library**: shadcn/ui components
- **Icons**: Lucide React
- **Animations**: Motion/React + Custom CSS

## 📄 License

Private project - All rights reserved.

---

**Built for Kiro IDE** - A complete, production-ready temple-themed AI application.