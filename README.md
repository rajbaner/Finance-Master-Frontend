# Finance Master

Pixel-matched recreation of the original signup screen design: dark fintech UI with
an animated, drifting orange glow behind the hero headline.

## Stack

- **Vite + React** (JavaScript, not TS)
- **Tailwind CSS v4** (CSS-first config via `@theme`, no `tailwind.config.js` needed)
- **framer-motion** — installed, available for any future scroll/hover
  interactions. The hero glow itself uses pure CSS `@keyframes` (see below),
  not framer-motion, because it's cheaper for an always-on ambient loop.
- **lucide-react** — icons (logo bolt, eye/eye-off, arrow, contact link)

## Getting started

```bash
cd finance-master
npm install
npm run dev
```

Open **http://localhost:5173**.

```bash
npm run build      # production build → dist/
npm run preview    # preview the production build locally
```

## File structure

```
finance-master/
├── index.html                    # Google Fonts (Inter + Instrument Serif), page title
├── vite.config.js                # react() + tailwindcss() plugins
├── src/
│   ├── main.jsx                  # mounts <App />, imports global CSS
│   ├── App.jsx                   # renders <Landing />
│   ├── pages/
│   │   └── Landing.jsx           # composes Navbar + Hero + glow + SignupForm + Footer
│   ├── components/
│   │   ├── Navbar.jsx            # logo, pill nav, Contact Us button
│   │   ├── Hero.jsx              # eyebrow badge, headline, subcopy
│   │   ├── AnimatedGlow.jsx      # the moving orange background
│   │   ├── SignupForm.jsx        # the form card — UI only, no backend yet
│   │   └── Footer.jsx            # logo, legal links, copyright
│   ├── services/
│   │   └── authService.js        # where the auth API call will live
│   ├── styles/
│   │   ├── globals.css           # @import "tailwindcss" + design tokens (@theme)
│   │   └── animations.css        # @keyframes for the glow + pulse dot
│   └── assets/                   # (empty — drop any static images/icons here)
```

## Design tokens (from the provided color extraction)

All defined in `src/styles/globals.css` under `@theme`, so they're usable
as Tailwind utilities directly (`bg-fm-orange`, `text-fm-silver`, etc.):

| Token | Hex | Used for |
|---|---|---|
| `--color-fm-bg` | `#050505` | page background |
| `--color-fm-bg-panel` | `#0a0a0a` | form card background |
| `--color-fm-orange` | `#FF7A1A` | buttons, glow core, accents |
| `--color-fm-silver` | `#C4C7C7` | secondary/body text |
| `--color-fm-offwhite` | `#E5E2E1` | eyebrow badge text |
| `--color-fm-white` | `#FFFFFF` | headlines, primary text |
| `--color-fm-border` | `#FFFFFF1A` (10% white) | hairline borders |
| `--color-fm-input` | `#FFFFFF0D` (5% white) | input field fills |

Fonts: **Inter** (sans, UI/body) + **Instrument Serif italic** (the
"Smarter, Faster," portion of the headline — matches the reference's
serif-italic mix with bold sans for "Better").

## How the animated glow works (AnimatedGlow.jsx)

Two radial-gradient orbs sit absolutely positioned behind the navbar/hero,
each animated by its own CSS `@keyframes` (`drift-primary` 18s,
`drift-secondary` 26s) defined in `src/styles/animations.css`. Different,
non-multiple durations mean the two orbs phase-shift continuously instead
of looping in a visible, repeating pattern. A third layer is a static
radial vignette that fades the glow into the page background so it
doesn't look like a pasted circle.

It's pure CSS, not JS-driven, so:
- it costs nothing on the main thread,
- it automatically respects `prefers-reduced-motion` (see the media query
  at the bottom of `globals.css`, which freezes both orbs for users who
  have that OS setting on).

To retune the motion: edit the `translate`/`scale`/`opacity` values in the
keyframes, or the orb `width`/`height`/`blur` in `AnimatedGlow.jsx`.

## Wiring up the backend auth API later

Everything is already structured so the backend slots in without touching
layout/styling code:

1. **`src/services/authService.js`** — this is the only file that should
   know how to talk to your API. It currently exports a stubbed
   `registerUser()` that throws. Full instructions with example fetch
   code are written as comments directly in that file.

2. **`src/components/SignupForm.jsx`** — owns all local form state
   (`useState` for each field, `submitting`, `error`). The `handleSubmit`
   function has a clearly marked TODO block — that's the only place
   you need to edit. Import `registerUser` from `authService.js` and
   call it there; the loading/disabled/error UI is already built and
   wired to `submitting` / `error` state.

3. **Environment variables** — create a `.env` file at the project root
   for your API base URL:
   ```
   VITE_API_BASE_URL=https://api.yourapp.com
   ```

4. **Session/token storage** — once you decide between httpOnly cookies
   (set by your server) vs. a client-stored token, add that logic inside
   `authService.js`, not inside the component. Keep `SignupForm.jsx`
   dumb: it should only call a function and react to success/error.

5. **Login flow** — when you build the login page, add a sibling
   `loginUser()` export to `authService.js` and a new
   `src/pages/Login.jsx` + route. If the app grows beyond one page,
   add `react-router-dom` at that point — it's intentionally not
   included yet since there's only one route today.

6. **Validation** — no client-side validation is wired up yet (empty
   fields, password match, email format). Decide whether that lives in
   `SignupForm.jsx` (simple, immediate) or comes back as structured
   errors from the API (simpler to keep in sync with backend rules) —
   either is reasonable, but pick one source of truth rather than both.

## Things intentionally left out (by design, not oversight)

- No router — single page only, add `react-router-dom` when a second
  route (Login, Pricing, etc.) actually exists.
- No global state library — form state is local to `SignupForm`; add
  context/zustand only once auth state needs to be read by other parts
  of the app (e.g. a navbar "logged in as ___" state).
- No tests yet — add Vitest + React Testing Library when there's
  real logic (the auth service) worth testing.
