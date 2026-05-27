@AGENTS.md

# GenerateID — Project Brief

> Customizable ID card generator web app. Users pick a style, fill in their details, tweak colors, and export for social media or print.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16.2.6 (App Router, Turbopack) |
| React | 19.2.4 |
| Styling | Tailwind CSS 4 + global CSS (`app/globals.css`) |
| State | Zustand 5 (`app/store/card-store.ts`) |
| Animation | Framer Motion 12 |
| Export | html-to-image 1.x (`toPng` with `pixelRatio`) |
| Icons | Lucide React |
| Fonts | Geist Sans, Geist Mono (UI), Playfair Display (card elegance) |

## Architecture

```
app/
├── page.tsx                    # Server component — renders <Editor />
├── layout.tsx                  # Root layout, fonts, metadata
├── globals.css                 # Tailwind import, animations, custom utilities
├── components/
│   ├── editor.tsx              # Main orchestrator — sidebar, preview, export
│   ├── card-renderer.tsx       # 6 style renderers + shared helpers (Photo, InfoLine, etc.)
│   └── export-modal.tsx        # Export with inline email gate + social/print download
├── store/
│   └── card-store.ts           # Zustand store — all card state + actions
└── lib/
    └── styles.ts               # Style definitions (id, name, tagline, default colors)
```

### Key patterns
- **Client-only app** — `editor.tsx` is the sole `'use client'` entry point; `page.tsx` stays a server component.
- **Card dimensions** — `CARD_W = 510`, `CARD_H = 320` (landscape). Portrait swaps them. Preview container has explicit card-sized dimensions for proper centering, then scaled via CSS `transform` + `ResizeObserver` to fit the viewport.
- **Color transitions** — The `.color-transition` CSS class applies 350ms transitions to all color properties, so live color changes are smooth without re-mounting.
- **Export strategy** — Hidden off-screen elements (`fixed`, `left: -9999px`) are captured by `html-to-image`. Social: 1080×1350 with gradient background. Print: card only at 4× pixel ratio (300+ DPI).
- **Style switching** — Changing style resets colors to that style's defaults via `getStyleById()`.

## Card Styles

| Style | Purpose | Visual Signature |
|-------|---------|-----------------|
| **Fancy** | VIP events, luxury brands, social media | Deep purple gradient, gold corner ornaments, Playfair Display serif |
| **Executive** | Corporate leadership, business networking | Dark charcoal, gold top accent bar, diagonal line pattern |
| **Minimal** | Tech, startups, modern workplaces | White background, thin border, accent dot, maximum whitespace |
| **Creative** | Designers, artists, agencies | Purple-to-pink gradient, geometric blob, bold black typography |
| **Government** | Official IDs, institutions, agencies | Navy header bar with seal, structured grid labels, red accent stripe |
| **Academic** | Universities, schools, education | Warm cream tones, school crest badge, academic year display |

## Customization Surface

- **7 text fields**: Full Name, Title, Organization, Department, ID Number, Email, Phone
- **Unlimited custom fields**: label + value pairs, add/remove dynamically
- **Photo upload**: FileReader → data URL, displayed in card's photo frame
- **5 colors**: Primary, Secondary, Accent, Text, Background — per-style defaults, user-overridable, one-click reset
- **Orientation**: Landscape / Portrait toggle with 3D flip animation
- **Export formats**: Social media post (1080×1350) and print-ready (high-res PNG)

## Email Gate

- **Not shown on start.** User lands directly in the editor.
- Triggered only on first export attempt (inside `export-modal.tsx`).
- Collects email → stores in `localStorage('generateid-email')` → auto-starts the download.
- One-time: never asked again after the first export.
- No backend — purely client-side.

## Attribution

- Header shows "by TimX Design" linking to [x.com/timxdesign](https://x.com/timxdesign).
- Hidden on mobile (`hidden sm:inline`).

## Running

```bash
npm run dev    # http://localhost:3000
npm run build  # production build
npm run lint   # ESLint
```

## What's Not Built Yet

- Backend / database (emails are localStorage only)
- User accounts / saved cards
- QR code on card
- Barcode generation
- Multiple card management / batch export
- Dark mode for the editor UI
- Mobile-specific export sizes (stories, etc.)
- Custom font selection per card
- Card back side / dual-sided printing
