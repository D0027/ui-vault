# UI Vault

A free, copy-paste UI component library — like uiverse.io/hyperui but yours.
Live preview + one-click "Copy code" for every component.

## Run it

```bash
npm install
npm run dev
```

Open the local URL it prints (usually http://localhost:5173).

## Build for deploy

```bash
npm run build
```

Output goes to `dist/` — drag that folder into Netlify/Vercel/GitHub Pages,
or connect the repo directly to Vercel for auto-deploys.

## Adding components (do this 50,000 times, one at a time or in batches)

Everything lives in **`src/data/components.jsx`**. That is the ONLY file
you need to touch to add content. Nothing else changes.

Each component is one object:

```js
{
  id: 'btn-my-cool-button',      // unique, never reuse
  title: 'My Cool Button',
  category: 'Buttons',           // new categories appear in the sidebar automatically
  tags: ['button', 'gradient'],  // used by search
  preview: (
    <button className="px-4 py-2 rounded-lg bg-violet-500 text-white">
      Click me
    </button>
  ),
  code: `<button class="px-4 py-2 rounded-lg bg-violet-500 text-white">
  Click me
</button>`,
},
```

Notes:
- `preview` is real JSX — this is what actually renders live on the card.
- `code` is a plain string — this is what gets copied to the user's
  clipboard, so it should be framework-agnostic HTML (use `class`, not
  `className`, inside the string) so it works for anyone pasting it into
  a plain HTML/Tailwind project.
- Paste as many objects as you want into the `components` array in one
  go — there's no limit. You could generate these with a script or an
  AI batch job and paste hundreds at once.
- If a component needs actual interactivity beyond CSS/hover (like a
  dropdown that opens), just build the real React version in `preview`
  — the `code` string can note "vanilla JS version" with a `<script>`
  tag included as text.

## Folder map

```
src/
  data/components.jsx     <- ADD YOUR COMPONENTS HERE
  components/
    ComponentCard.jsx      <- the card UI (preview/code tabs, copy button)
    Sidebar.jsx            <- category nav, auto-generated from data
  App.jsx                  <- search + filtering + grid layout
  index.css                <- theme (colors, fonts) via Tailwind v4 @theme
```

## Suggested categories to fill out first

Buttons, Cards, Navbars, Forms, Loaders/Spinners, Badges, Alerts,
Tooltips, Modals, Dropdowns, Tables, Pagination, Breadcrumbs, Tabs,
Accordions, Avatars, Progress bars, Sliders, Testimonials, Pricing,
Footers, Heroes, 404 pages, Empty states, Skeletons.

Once a category has 15-20+ components it starts feeling "real" —
prioritize breadth across categories before going deep in one.
