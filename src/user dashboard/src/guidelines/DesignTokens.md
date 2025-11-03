# PromptBrain Design Tokens Reference

Quick reference guide for using design tokens in the PromptBrain application.

## 🎨 Using Design Tokens

### In Inline Styles (Recommended for Consistency)

```tsx
// Spacing
style={{ padding: 'var(--spacing-4)', gap: 'var(--spacing-2)' }}

// Typography
style={{ fontSize: 'var(--text-lg)', lineHeight: 1.4 }}

// Colors
style={{ background: 'var(--pb-near-black)', color: 'var(--pb-white)' }}

// Transitions
style={{ transition: 'all var(--transition-base) var(--ease-out)' }}
```

### Spacing Scale (8px Grid)

| Token | Value | Use Case |
|-------|-------|----------|
| `--spacing-1` | 8px | Tight spacing, icon gaps |
| `--spacing-2` | 16px | Input padding, small gaps |
| `--spacing-3` | 24px | Card padding, medium gaps |
| `--spacing-4` | 32px | Section spacing, large gaps |
| `--spacing-5` | 40px | Component margins |
| `--spacing-6` | 48px | Section padding |
| `--spacing-8` | 64px | Large section spacing |
| `--spacing-10` | 80px | Hero padding |
| `--spacing-12` | 96px | Extra large spacing |
| `--spacing-16` | 128px | Maximum spacing |

### Typography Scale (Fluid)

| Token | Min → Max | Use Case |
|-------|-----------|----------|
| `--text-xs` | 12px → 14px | Captions, labels |
| `--text-sm` | 14px → 16px | Small text, metadata |
| `--text-base` | 16px → 18px | Body text, inputs |
| `--text-lg` | 18px → 24px | Large body, subheadings |
| `--text-xl` | 20px → 30px | Section headings |
| `--text-2xl` | 24px → 40px | Page subheadings |
| `--text-3xl` | 30px → 48px | Large headings |
| `--text-4xl` | 36px → 60px | Hero subheadings |
| `--text-5xl` | 48px → 80px | Hero headings |
| `--text-6xl` | 60px → 104px | Main hero title |

### Color Palette

| Token | Value | Use Case |
|-------|-------|----------|
| `--pb-black` | #000000 | Primary background |
| `--pb-near-black` | #0A0A0A | Card/surface backgrounds |
| `--pb-dark-gray` | #1A1A1A | Secondary surfaces |
| `--pb-gray` | #333333 | Borders, dividers |
| `--pb-mid-gray` | #666666 | Placeholder text |
| `--pb-light-gray` | #999999 | Disabled states |
| `--pb-white` | #FFFFFF | Primary text |
| `--pb-cyan` | #00D9FF | Primary accent, focus |
| `--pb-cyan-dark` | #0099FF | Gradient end, hover |
| `--pb-cyan-light` | #4DFFFF | Highlights, glow |

### Animation Timing

| Token | Value | Use Case |
|-------|-------|----------|
| `--transition-fast` | 200ms | Hover states, micro-interactions |
| `--transition-base` | 300ms | Standard transitions |
| `--transition-slow` | 500ms | Complex animations, page transitions |
| `--ease-out` | cubic-bezier(0.16, 1, 0.3, 1) | Smooth deceleration |
| `--ease-in-out` | cubic-bezier(0.4, 0, 0.2, 1) | Balanced acceleration |

## 📋 Common Patterns

### Card/Surface Component
```tsx
<div
  className="backdrop-blur-xl border rounded-2xl"
  style={{
    background: 'var(--pb-near-black)',
    borderColor: 'var(--pb-gray)',
    padding: 'var(--spacing-4)',
    gap: 'var(--spacing-3)'
  }}
>
  {/* Content */}
</div>
```

### Button with Hover
```tsx
<button
  className="rounded-xl hover:scale-105"
  style={{
    padding: 'var(--spacing-2) var(--spacing-4)',
    fontSize: 'var(--text-base)',
    background: 'var(--pb-cyan)',
    color: 'var(--pb-black)',
    transition: 'all var(--transition-fast) var(--ease-out)'
  }}
>
  Click me
</button>
```

### Heading with Fluid Typography
```tsx
<h2
  style={{
    fontSize: 'var(--text-5xl)',
    lineHeight: 1.2,
    letterSpacing: '-0.01em',
    marginBottom: 'var(--spacing-4)'
  }}
>
  Section Title
</h2>
```

### Input Field
```tsx
<input
  className="w-full backdrop-blur-xl border rounded-2xl"
  style={{
    padding: 'var(--spacing-2) var(--spacing-3)',
    fontSize: 'var(--text-base)',
    background: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'var(--pb-gray)',
    color: 'var(--pb-white)',
    transition: 'all var(--transition-base) var(--ease-out)'
  }}
/>
```

### Container with 8px Grid
```tsx
<section
  style={{
    padding: 'var(--spacing-16) var(--spacing-4)',
    gap: 'var(--spacing-8)',
    display: 'flex',
    flexDirection: 'column'
  }}
>
  {/* Content */}
</section>
```

## ✅ Best Practices

1. **Always use design tokens** instead of hardcoded values
2. **Maintain 8px grid** for all spacing (use --spacing-* tokens)
3. **Use fluid typography** for responsive text scaling
4. **Apply consistent transitions** using timing tokens
5. **Follow color palette** for brand consistency
6. **Test accessibility** with proper contrast ratios
7. **Use semantic HTML** with ARIA labels
8. **Implement focus states** with --pb-cyan

## 🚫 Avoid

- ❌ Hardcoded pixel values (use tokens)
- ❌ Arbitrary spacing (stick to 8px grid)
- ❌ Fixed font sizes (use clamp() via tokens)
- ❌ Custom colors (use palette tokens)
- ❌ Inconsistent transitions (use timing tokens)
- ❌ Missing focus states (always show keyboard navigation)

---

**Quick Copy-Paste Examples**

```tsx
// Standard section
<section style={{ padding: 'var(--spacing-16) var(--spacing-4)' }}>

// Card spacing
<div style={{ padding: 'var(--spacing-4)', gap: 'var(--spacing-3)' }}>

// Heading
<h2 style={{ fontSize: 'var(--text-5xl)', marginBottom: 'var(--spacing-4)' }}>

// Button
<button style={{ 
  padding: 'var(--spacing-2) var(--spacing-4)',
  transition: 'all var(--transition-base) var(--ease-out)'
}}>

// Flex container
<div style={{ display: 'flex', gap: 'var(--spacing-2)' }}>
```

---

**Version**: 1.0.0  
**Last Updated**: October 17, 2025
