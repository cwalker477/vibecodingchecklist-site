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

## Next Steps

*   **Verify Vercel Deployment:** Confirm the site deploys and functions correctly on Vercel with the new structure.
*   **Production Polish:** Address SEO, Open Graph, `.env` configuration as per user guidance.
*   **Start Implementing UI Blocks:** Begin creating components based on `uiBlocks.md`.

## Active Decisions & Considerations

*   **`create-next-app` options:** Using `--typescript`, `--tailwind`, `--eslint`, `--app` (for App Router), `--src-dir`, `--import-alias "@/*"`. Using `pnpm`.
*   **Directory Structure:** Project files are now located at the root level. Content is in `/content/`.
