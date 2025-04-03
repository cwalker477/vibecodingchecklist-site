# Progress: VibeCodingChecklist.com

## Current Status

*   **Overall:** Backend Integration / Content Migration phase. Integrated Supabase for Blog Posts and Guides, replacing the local Markdown system for guides. Core blog and guide pages updated to use Supabase.
*   **Date:** April 3, 2025

## What Works

*   The `memory-bank` directory structure is created and populated with initial documentation.
*   `.clinerules` file exists and is being followed.
*   Initial review of all memory bank files completed.
*   Project focus clarified: Educational hub for vibe coding.
*   Next.js project files moved from `vibecodingchecklist-site/` to the root directory.
*   Empty `vibecodingchecklist-site/` directory removed.
*   Changes committed and pushed to GitHub.
*   `activeContext.md` updated to reflect current status and next steps.
*   Replaced `src/app/page.tsx` and `src/app/layout.tsx` with minimal working versions to troubleshoot root route 404.
*   Corrected `next.config.ts` by removing unnecessary `experimental.appDir` setting.
*   Resolved persistent Tailwind v4 build errors ("unknown utility class: text-neutral-*") through configuration adjustments (`tailwind.config.js`, `postcss.config.js`), dependency reinstallation (`@tailwindcss/typography`, `autoprefixer`), and cache clearing.
*   Fixed TypeScript syntax error in `src/app/rss/route.ts`.
*   Applied initial dark mode theme styling and typography improvements to layout, homepage, and guide layout components.
*   Resolved Git swap file and index lock issues.
*   Restored MDX guide rendering using `next-mdx-remote` in `src/app/guides/[slug]/page.tsx`.
*   Verified `getPostData` and `getAllPostsMetadata` in `src/lib/posts.ts`.
*   Verified example guide content in `content/guides/example-guide-1.mdx`.
*   Pushed latest changes to GitHub (prior to Supabase integration).
*   Installed Supabase client library (`@supabase/supabase-js`) using npm.
*   Created `.env.local` with Supabase credentials.
*   Created Supabase client utility (`src/lib/supabaseClient.ts`).
*   Created data fetching functions for blog posts (`src/lib/blog.ts`).
*   Refactored `PostCard` component (`src/components/PostCard.tsx`) for reusability.
*   Created blog index page (`src/app/blog/page.tsx`).
*   Created dynamic blog post page (`src/app/blog/[slug]/page.tsx`).
*   Created data fetching functions for guides (`src/lib/guides.ts`).
*   Updated individual guide page (`src/app/guides/[slug]/page.tsx`) to use Supabase.
*   Updated guides index page (`src/app/guides/page.tsx`) to use Supabase.
    *   Updated homepage (`app/page.tsx`) to fetch featured guides from Supabase.
    *   Deprecated old Markdown processing code (`src/lib/posts.ts`).
    *   Deleted obsolete `/content/guides` directory.
    *   Added basic site navigation (Home, Guides, Blog) to `app/layout.tsx`.
    *   Updated `activeContext.md`.

## What's Left to Build / Next Steps

*   **Commit & Push:** Stage, commit, and push recent changes (Supabase integration, cleanup, navigation) to GitHub.
*   **Verification (Post-Deployment):** User to verify `/guides`, `/guides/[slug]`, `/blog`, `/blog/[slug]`, and homepage featured guides render correctly on the deployed Vercel site using Supabase data.
*   **Documentation:** Update `memory-bank/systemPatterns.md`.
*   **Refine Styling:** Revisit styling for blog/guide pages, `PostCard`, and header.
*   **Production Polish:** Address SEO, Open Graph for blog/guide posts.
*   **Implement UI Blocks:** Based on Module 6 output.
*   **Implement Content Structure:** Based on Module 3 output (for remaining non-blog/guide types).
*   **Implement Article Formats:** Based on Module 4 output (for remaining non-blog/guide types).
*   **Integrate AI Features:** Based on Module 5 output.
*   **Implement SEO:** Based on Module 7 output (general + blog/guides).
*   **Populate Initial Content:** Add blog posts/guides via Supabase, continue with other types.
*   **Commit & Push:** Stage, commit, and push recent changes.

## Known Issues / Blockers

*   **Dependency:** Blog and Guide functionality requires user to verify content rendering on Vercel after deployment.
*   **Package Manager:** Project seems set up for `pnpm`, but `npm` was used due to `pnpm` not being found. Potential for future inconsistency.
*   **Vercel Rendering (Original Issue):** The initial reason for investigating (`/guides/[slug]` not rendering Markdown on Vercel) was bypassed by migrating to Supabase. The root cause in the file-based system was not fully diagnosed.
