# UI & Styling Standards

Our goal is to build a **premium, responsive, consistent, and maintainable user interface** across the Food Remit application.

To achieve this, we strictly standardize our UI implementation around **Tailwind CSS** and our shared design system.

## The `cn` Utility

Never use manual string concatenation or template literals for conditional class names.

Always use the `cn` utility, which combines `clsx` and `tailwind-merge`.

This ensures class names are composed safely and helps prevent conflicts where Tailwind classes unintentionally override one another.

```tsx
// ❌ BAD

className={`rounded-xl px-4 ${
  isActive ? "bg-emerald-500" : "bg-slate-200"
}`}
```

```tsx
// ✅ GOOD

className={cn(
  "rounded-xl px-4 transition-colors",
  isActive
    ? "bg-emerald-500 text-white"
    : "bg-slate-200 text-slate-700"
)}
```

Using `cn()` should be the standard approach whenever class names depend on conditions, component state, or dynamic values.

---

## Responsive Design

We follow a **Mobile-First** approach.

The default Tailwind classes should target mobile devices first. Larger screen layouts should then be introduced using responsive prefixes such as:

- `sm:`
- `md:`
- `lg:`
- `xl:`

For example:

```tsx
className = "w-full md:w-1/2 lg:w-1/3";
```

### Responsive Modals & Dialogs

When building modals, dialogs, drawers, or other complex overlays, they must remain fully constrained within the viewport on smaller screens.

Avoid layouts that cause horizontal scrolling or content to slide outside the viewport.

A typical responsive dialog structure should use constraints such as:

```tsx
className = "w-[95%] max-h-[90vh] flex flex-col";
```

For long modal content:

- Keep the header fixed.
- Keep the footer fixed.
- Make only the content area scrollable.
- Use `overflow-y-auto` inside the modal body.

For example:

```tsx
<DialogContent className="flex max-h-[90vh] w-[95%] flex-col">
  <DialogHeader>{/* Fixed header */}</DialogHeader>

  <div className="flex-1 overflow-y-auto">{/* Scrollable content */}</div>

  <DialogFooter>{/* Fixed footer */}</DialogFooter>
</DialogContent>
```

The UI must never introduce unnecessary horizontal scrolling on mobile devices.

---

# Aesthetic Guidelines

The Food Remit application should maintain a **premium, modern, and polished visual identity** across all screens.

## Avoid Flat Colors

Avoid using arbitrary hard-coded hex colors whenever an equivalent Tailwind color is available.

Prefer Tailwind's curated color palette for consistency across the application.

For example:

```tsx
text - slate - 900;
bg - emerald - 600;
border - slate - 200;
```

Instead of repeatedly introducing custom colors such as:

```tsx
#123456
#0F8A5F
```

Custom colors should only be introduced when they are genuinely required by the design system.

---

## Use Depth

Interfaces should have appropriate visual hierarchy and depth rather than appearing completely flat.

Use subtle techniques such as:

- Glassmorphism
- Soft shadows
- Ring borders
- Background opacity
- Backdrop blur

Examples:

```tsx
bg-white/85 backdrop-blur-xl
```

```tsx
shadow - sm;
shadow - xl;
```

```tsx
ring-1 ring-slate-200/60
```

These effects should remain subtle and purposeful rather than being applied to every element.

---

## Micro-Interactions

Interactive elements should provide clear visual feedback while maintaining a smooth and responsive experience.

Buttons, cards, dropdowns, and other interactive components should generally use transitions such as:

```tsx
transition-all duration-200
```

Where appropriate, use subtle hover movement:

```tsx
hover: -translate - y - 0.5;
```

Interactive elements should also have appropriate:

- Hover states
- Active states
- Focus states
- Disabled states
- Loading states

Animations should be subtle and should never interfere with usability or performance.

---

# Empty States

Never leave a screen completely blank when there is no data.

Every meaningful empty state should clearly communicate:

1. **What is empty**
2. **Why the user is seeing the empty state**
3. **What the user can do next**

A standard empty state should generally include:

- A relevant icon or illustration
- A clear heading
- A short supporting description
- A relevant call-to-action button when an action is available

For example:

```text
[ Icon ]

No categories found

You haven't created any categories yet.

[ Create Category ]
```

The goal is to make every screen feel intentional, even when there is currently no data to display.

---

## General Principle

Every UI component should be:

**Responsive → Consistent → Accessible → Interactive → Maintainable**

The Food Remit design system should feel consistent across the entire application regardless of which feature or team member implemented the screen.
