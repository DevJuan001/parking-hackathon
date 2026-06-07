# Design system

> Colors, dark mode, typography, spacing, transitions, animations.
> The app uses raw hex values inline today — promote to a token only when a color is used in 3+ places.

---

## 1. Colors

| Token (informal)         | Light                          | Dark                            | Use                                  |
| ------------------------ | ------------------------------ | ------------------------------- | ------------------------------------ |
| App background           | `#FBF9FC`                      | `#0a0a0a` / `black`             | Page background                      |
| Surface (card/modal)     | `#FBF9FC` / `#F5F3F6`          | `black` / `#101012`             | Card, modal, button bg in dark       |
| Border                   | `#e5e7eb` / `#a1a1a131`        | `#1e1e20cb` / `#28282bbd`       | Borders, dividers                    |
| Muted text               | `#75777E` / `#7E7777`          | `#7E8088` / `#b4aab4`           | Labels, inactive nav                 |
| Hover background (light) | `#e5e7eb96` / `#efedf0`        | —                               | Hover on light surfaces              |
| Hover background (dark)  | —                              | `#181818` / `#202022` / `#28282bbd` | Hover on dark                    |
| Active nav               | `bg-black text-white`          | `bg-white text-black`           | `NavItem` active state               |
| Success                  | `#22c55e` bg `#dcfce7`         | `bg-green-950`                  | Success icon and circle              |
| Error                    | `#dc2626` bg `#fee2e2`         | `bg-[#450a0a81]`                | Error icon and circle                |

If a color is used in **3+** places, promote it to a `--color-*` token in `index.css` `@theme` and reference it via `bg-[var(--color-...)]` or a Tailwind utility.

---

## 2. Dark mode

- Tailwind v4 with the custom variant defined in `index.css`:
  ```css
  @custom-variant dark (&:where(.dark, .dark *));
  ```
- The `.dark` class is toggled on `<html>` by `useTheme()`.
- Every color that changes between modes **must** have a `dark:` variant. Audit visually before finishing.
- For icons that should invert in dark mode, prefer `className="dark:invert"` or `dark:brightness-200`.

---

## 3. Typography

Three families registered in `index.css`:

- `--default-font-family: "Inter"` — body, default. No class needed.
- `--font-poppins: "Poppins"` — modal titles and decorative text. Apply with `font-poppins`.
- `DM Sans` is imported but not exposed as a Tailwind utility yet; reach for it if Inter/Poppins feel wrong (register `--font-dm-sans` in `@theme` first).

---

## 4. Spacing, radius, shadows

- Cards/modals: `rounded-2xl` / `rounded-3xl` / `rounded-[32px]`.
- Pills (NavItem, nav buttons): `rounded-full`.
- Active nav shadow: `shadow-[0px_0px_32px_-9px_#000000]` (light) / `shadow-[0px_0px_32px_-11px_#ffffff]` (dark).
- Focus glow on inputs: `focus-within:shadow-[0_0_3px_2px_#e5e7eb]` (light) / `dark:focus-within:shadow-[0_0_3px_3px_#28282b]`.
- Validation error glow: `shadow-[0_0_2.5px_1px_#f87171] dark:shadow-[0_0_4px_1.5px_#7f1d1d] animate-shake`.

---

## 5. Responsive breakpoints

Use Tailwind's defaults (`sm`, `md`, `lg`, `xl`). Examples in the codebase:

- `h-[13%] sm:h-[9%] md:h-[6%]` on `TopSection`.
- `w-[350px] md:w-[400px]` on `modalStyles.select`.
- `hidden ... lg:block` for elements that appear only on desktop (e.g. `CreateButton` text label).

---

## 6. Transitions

- Default for hover/state changes: `transition-colors duration-300` or `transition-all duration-700` for layout shifts.
- Use **ease-in-out** for reversible effects, **ease-out** for entrances, **ease-in** for exits.
- NavItem: 700ms, ease-in-out, on gap, color, and max-width.
- Modal/buttons: 300-500ms.

---

## 7. Animations and keyframes

`src/globals/styles/transitions.css` holds the `@keyframes`. Each one must be **registered in `@theme`** in `index.css` to be used as a Tailwind utility:

```css
@theme {
  --animate-blur-up: blurUp 0.3s ease-in forwards;
  --animate-shake: shake 0.35s ease-in;
}
```

Use as `className="animate-blur-up"`.

### Available right now

| Class              | Source keyframe | Direction                                |
| ------------------ | --------------- | ---------------------------------------- |
| `animate-blur-up`  | `blurUp`        | Entrance (forwards)                      |
| `animate-rotation` | `rotation`      | Continuous spin                          |
| `animate-shake`    | `shake`         | Error feedback                           |
| `animate-grow-in`  | `growIn`        | Hover entrance (forwards)                |
| `animate-grow-out` | `growOut`       | Hover exit (forwards) — use with `group-not-hover:` |

### Adding a new keyframe

1. Add the `@keyframes` block to `transitions.css`.
2. Register a `--animate-<name>: <name> <duration> <easing> <fill-mode>` token in `@theme` in `index.css`.
3. Use the class in your component. Tailwind will pick up the new utility automatically (no restart needed for CSS — restart opencode only if the change affects file-based skill/agent routing).
