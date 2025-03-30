# Active Context: VibeCodingChecklist.com

## Current Work Focus

*   **Phase:** Project Scaffolding
*   **Goal:** Restructure project layout for Vercel deployment by moving the Next.js app to the root directory.

## Recent Changes

*   Defined and documented the full technology stack (Next.js, Markdown, Tailwind, Vercel, Serverless Functions) in `techContext.md`.
*   Defined and documented the system architecture in `systemPatterns.md`.
*   Moved Next.js project files from `vibecodingchecklist-site/` to the root directory.
*   Removed the empty `vibecodingchecklist-site/` directory.
*   Committed and pushed changes to GitHub.
*   Resolved persistent Tailwind v4 build errors after migrating `gray` to `neutral` by adjusting configurations, reinstalling dependencies, and clearing caches.
*   Fixed TypeScript syntax error in `src/app/rss/route.ts`.
*   Applied initial dark mode theme styling and typography improvements (Inter font, spacing, contrast) to layout, homepage, and guide layout components.

## Next Steps

*   **Verify Vercel Deployment:** Commit changes, push, and confirm the site builds and deploys correctly on Vercel.
*   **Refine Dark Theme:** Continue applying and refining the dark mode theme across all components and content based on Notion/Medium inspiration.
*   **Anchor Link Styling:** Revisit `.anchor-link` styling in `globals.css` if the current fallback colors are not ideal.
*   **Production Polish:** Address SEO, Open Graph, `.env` configuration as per user guidance.
*   **Start Implementing UI Blocks:** Begin creating components based on `uiBlocks.md`.

## Active Decisions & Considerations

*   **`create-next-app` options:** Using `--typescript`, `--tailwind`, `--eslint`, `--app` (for App Router), `--src-dir`, `--import-alias "@/*"`. Using `pnpm`.
*   **Directory Structure:** Project files are now located at the root level. Content is in `/content/`.
