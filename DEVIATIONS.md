# Deviations from REDESIGN_PLAN.md

Logged per Phase, smallest-correct-choice basis, per plan rule 7.

## Phase 0

- **`npm run preview` fails on this project.** `@astrojs/cloudflare`'s adapter
  does not implement Astro's `preview` command ("The @astrojs/cloudflare
  adapter does not support the preview command"). This is pre-existing
  tooling, not something introduced by the redesign. Fallback used for all
  "build and preview" verification steps: `npx wrangler pages dev dist`,
  which serves the actual production build (worker + static assets) locally
  and is the standard way to preview a Cloudflare adapter build. Screenshots
  and route checks in this work were taken against that server.
- **`text-terminal` (`#1E1F21`) had no equivalent in the plan's final
  11-token palette.** It was used once, in `index.astro`'s hero bio block,
  for dark text against the accent-green background band. The plan's
  Phase 0.3 palette list (background, surface, accent, accent-dim, chrome,
  chromeIcon, ink, muted, faint, string, path) doesn't mention it or a
  replacement. Smallest correct choice: mapped it to `text-background`
  (`#092537`), the nearest token in the same dark-navy family, preserving
  contrast against the accent band. Flagging in case a different dark tone
  was intended here.

## Phase 1

- **Navbar's outer container used a fixed `w-[1000px]` instead of
  `max-w-[1000px]`.** Not something this redesign introduced — pre-existing
  on `master`. At viewports narrower than ~1032px this pushed the mobile
  hamburger button off-screen to the right (confirmed via a 375px
  screenshot: the button was fully outside the visible viewport). Since
  Phase 1.3 explicitly rebuilds the mobile menu's accessibility (focus,
  Escape, outside click), leaving its trigger button unreachable without
  horizontal scrolling would make that work moot, so it was fixed here as
  `max-w-[1000px] w-full`. The identical fixed-width pattern (`w-[1000px]`
  on a direct child of a `px-4` flex-center wrapper) also appears in
  `index.astro`, `about.astro`, and `projects.astro`; those are left alone
  for Phase 4's typography/mobile sweep (which owns the 320px/375px
  no-horizontal-scroll acceptance criterion) rather than fixed piecemeal
  now.
