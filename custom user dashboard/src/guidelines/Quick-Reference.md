# PromptBrain - Developer Quick Reference Card

**Version:** 3.0.0 | **Last Updated:** October 17, 2025

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run tests
npm run test
```

---

## 📁 File Structure (Quick Nav)

```
/App.tsx                    ← Main entry point
/components/
  ├── Navbar.tsx            ← Top navigation
  ├── HeroSection.tsx       ← Hero with search
  ├── SearchInterface.tsx   ← Main input component
  ├── EmptyState.tsx        ← 4 contextual states
  ├── AffirmativeToast.tsx  ← Success feedback
  ├── FloatingCTA.tsx       ← Scroll CTA
  ├── MidpointCTA.tsx       ← Conversion section
  ├── FeedbackSection.tsx   ← Contact forms
  └── Footer.tsx            ← Footer component
/styles/
  └── globals.css           ← Design tokens + base styles
/guidelines/
  ├── DesignTokens.md       ← Complete token reference
  ├── ComponentHierarchy.md ← Architecture docs
  ├── WCAG-Compliance.md    ← Accessibility guide
  └── [More guides...]
```

---

## 🎨 Design Tokens (Most Used)

### Colors
```css
--pb-black: #000000;      /* Background */
--pb-white: #FFFFFF;      /* Text (21:1) */
--pb-cyan: #00D9FF;       /* Accent (10.2:1) */
--pb-gray: #333333;       /* Borders */
```

### Spacing (8px grid)
```css
--spacing-1: 8px;    --spacing-2: 16px;
--spacing-3: 24px;   --spacing-4: 32px;
--spacing-6: 48px;   --spacing-8: 64px;
```

### Typography
```css
--text-sm: clamp(0.875rem, ...);    /* 14-16px */
--text-base: clamp(1rem, ...);      /* 16-18px */
--text-lg: clamp(1.125rem, ...);    /* 18-24px */
```

### Timing
```css
--transition-fast: 200ms;
--transition-base: 300ms;
--ease-out: cubic-bezier(0.16, 1, 0.3, 1);
```

---

## 🧩 Component Props Quick Ref

### EmptyState
```tsx
<EmptyState 
  type="first-use" | "empty-prompt" | "no-credits" | "error"
  onAction={() => void}
/>
```

### AffirmativeToast
```tsx
<AffirmativeToast 
  message="Refined brilliance unlocked!"
  type="brilliant" | "context" | "optimized" | "enhanced" | "success"
/>
```

### FloatingCTA
```tsx
<FloatingCTA 
  onAction={() => void}
  label="Enhance Now"
/>
```

### MidpointCTA
```tsx
<MidpointCTA 
  onAction={() => void}
/>
```

---

## 🎯 Common Patterns

### Show Toast Notification
```tsx
import { toast } from 'sonner@2.0.3';

toast.custom((t) => (
  <div className="flex items-center bg-gradient-to-r from-[#00D9FF] to-[#0099FF] text-white rounded-2xl">
    <Sparkles className="w-5 h-5" />
    <span>Success!</span>
  </div>
), { duration: 3000 });
```

### Motion Animation
```tsx
import { motion } from 'motion/react';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -10 }}
  transition={{ duration: 0.4 }}
>
  Content
</motion.div>
```

### Scroll to Element
```tsx
const scrollToHero = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
  setTimeout(() => {
    document.getElementById('prompt-input')?.focus();
  }, 600);
};
```

---

## ♿ Accessibility Checklist

- [ ] ARIA labels on interactive elements
- [ ] Focus states visible (2px cyan outline)
- [ ] Touch targets ≥24×24px
- [ ] Color contrast ≥4.5:1 (text), ≥3:1 (UI)
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] Reduced motion supported

---

## 🎨 Animation Standards

### Durations
- **Micro:** 200ms (hover, focus)
- **Standard:** 300ms (transitions)
- **Slow:** 500ms (complex animations)

### Easing
- **Default:** `cubic-bezier(0.16, 1, 0.3, 1)` (ease-out)
- **Bounce:** `type: 'spring'` (for entrances)

### Scale Values
- **Hover:** 1.05 - 1.1
- **Active:** 0.95 - 0.98
- **Typing:** 1.02

---

## 🔧 Utility Functions

### LocalStorage
```tsx
// Check first use
const hasUsed = localStorage.getItem('promptbrain_used');
if (!hasUsed) {
  localStorage.setItem('promptbrain_used', 'true');
}
```

### Validation
```tsx
const validatePrompt = (text: string) => {
  if (text.length < 10) return 'Too short';
  if (text.length > 1000) return 'Too long';
  return '';
};
```

---

## 🐛 Common Issues & Solutions

### Animation not working
✅ Check `prefers-reduced-motion` setting  
✅ Verify Motion/React import  
✅ Check AnimatePresence wrapper

### Focus outline not visible
✅ Ensure `focus-visible` pseudo-class  
✅ Check z-index stacking  
✅ Verify contrast ratio

### Toast not appearing
✅ Import from `sonner@2.0.3`  
✅ Add `<Toaster />` to App  
✅ Check positioning setting

### Input not scaling
✅ Verify `isTyping` state updates  
✅ Check motion.div wrapper  
✅ Ensure no conflicting CSS

---

## 📦 Key Dependencies

```json
{
  "motion/react": "^11.x",
  "lucide-react": "latest",
  "sonner@2.0.3": "toast notifications",
  "react": "^18.x",
  "tailwindcss": "^4.0"
}
```

---

## 🔍 Performance Tips

✅ Use `whileInView` for scroll triggers  
✅ Lazy load heavy components  
✅ Optimize images (use WebP)  
✅ Code split large bundles  
✅ Use CSS transforms (not position)  
✅ Debounce expensive operations

---

## 🎯 Testing Commands

```bash
# Accessibility audit
npm run lighthouse

# Type checking
npm run type-check

# Linting
npm run lint

# Format
npm run format
```

---

## 📝 Code Style

### Component Structure
```tsx
// 1. Imports
import { useState } from 'react';
import { motion } from 'motion/react';

// 2. Types/Interfaces
interface Props {
  onAction: () => void;
}

// 3. Component
export function Component({ onAction }: Props) {
  // 4. State
  const [value, setValue] = useState('');
  
  // 5. Handlers
  const handleClick = () => {};
  
  // 6. Render
  return <div>Content</div>;
}
```

### Naming Conventions
- Components: PascalCase (`SearchInterface.tsx`)
- Files: PascalCase for components
- Functions: camelCase (`handleClick`)
- Constants: UPPER_SNAKE_CASE
- CSS vars: kebab-case (`--pb-cyan`)

---

## 🚨 Emergency Fixes

### Broken build
1. Clear cache: `rm -rf .next node_modules`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Accessibility error
1. Check WCAG-Compliance.md
2. Run axe DevTools scan
3. Fix ARIA labels/roles

### Performance issue
1. Check Lighthouse report
2. Profile with React DevTools
3. Optimize heavy components

---

## 📞 Support Resources

**Documentation:** `/guidelines/`  
**Issues:** GitHub Issues  
**Design System:** DesignTokens.md  
**Architecture:** ComponentHierarchy.md  
**Accessibility:** WCAG-Compliance.md

---

## 🎓 Learning Resources

### Key Concepts
- **Design Tokens:** `/guidelines/DesignTokens.md`
- **Component Hierarchy:** `/guidelines/ComponentHierarchy.md`
- **Accessibility:** `/guidelines/WCAG-Compliance.md`
- **Conversion Flow:** `/guidelines/ConversionFlow-Visual-Guide.md`

### External Docs
- [Motion Docs](https://motion.dev)
- [Tailwind v4](https://tailwindcss.com)
- [WCAG 2.2](https://www.w3.org/WAI/WCAG22/quickref/)
- [Shadcn UI](https://ui.shadcn.com)

---

## ✅ Pre-Commit Checklist

- [ ] Components documented
- [ ] Accessibility verified
- [ ] Animations smooth (60fps)
- [ ] Mobile responsive
- [ ] Types correct
- [ ] No console errors
- [ ] Touch targets adequate
- [ ] Color contrast passes

---

## 🎯 Quick Wins

### Add New Empty State
1. Open `EmptyState.tsx`
2. Add new type to states object
3. Use: `<EmptyState type="your-type" />`

### Create New Toast
1. Import: `import { toast } from 'sonner@2.0.3'`
2. Call: `toast.custom(<YourToast />)`

### Add New CTA
1. Copy `FloatingCTA.tsx` or `MidpointCTA.tsx`
2. Customize content
3. Import and use in App.tsx

---

**Quick Reference Version:** 3.0.0  
**For detailed docs, see:** `/guidelines/`  
**Need help?** Check Project-Complete-Summary.md

---

*Keep this card handy for daily development!* 📌
