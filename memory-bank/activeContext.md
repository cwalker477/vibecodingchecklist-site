# Active Context: VibeCodingChecklist.com

## Current Work Focus

*   **Phase:** Backend Integration / Content System Migration
*   **Goal:** Migrate Guides content management from local Markdown files to Supabase.

## Recent Changes

*   **Blog Integration:**
    *   Installed Supabase client library (`@supabase/supabase-js`).
    *   Created `.env.local` with Supabase Project URL and Anon Key.
    *   Created Supabase client utility (`src/lib/supabaseClient.ts`).
    *   Created data fetching functions for blog posts (`src/lib/blog.ts`).
    *   Refactored `PostCard` component (`src/components/PostCard.tsx`) for reusability.
    *   Created blog index page (`src/app/blog/page.tsx`).
    *   Created dynamic blog post page (`src/app/blog/[slug]/page.tsx`).
*   **Guides Migration:**
    *   Created data fetching functions for guides (`src/lib/guides.ts`) querying Supabase `guides` table.
    *   Updated individual guide page (`src/app/guides/[slug]/page.tsx`) to use Supabase data.
    *   Updated guides index page (`src/app/guides/page.tsx`) to use Supabase data.
    *   Updated homepage (`app/page.tsx`) to fetch featured guides from Supabase.
*   **Cleanup & Navigation:**
    *   Deprecated old Markdown processing code (`src/lib/posts.ts`).
    *   Deleted obsolete `/content/guides` directory.
    *   Added basic site navigation (Home, Guides, Blog) to `app/layout.tsx`.

## Next Steps

*   **Commit & Push:** Commit recent changes (Supabase integration, cleanup, navigation) and push to GitHub.
*   **Verification (Post-Deployment):** User to verify `/guides`, `/guides/[slug]`, `/blog`, `/blog/[slug]`, and homepage featured guides render correctly on the deployed Vercel site using Supabase data.
*   **Documentation:** Update `memory-bank/systemPatterns.md` and `progress.md`.
*   **Refine Styling:** Revisit styling for blog/guide pages, `PostCard`, and header.
*   **Production Polish:** Address SEO, Open Graph for blog/guide posts.
*   **Start Implementing UI Blocks:** Begin creating components based on `uiBlocks.md`.

## Active Decisions & Considerations

*   **Content System:** Migrated Guides and Blog Posts to Supabase. Other content types (comparisons, etc.) still use local Markdown in `/content/`.
*   **Supabase Tables:** Using `blog_posts` and `guides` tables with defined structures.
*   **MDX Rendering:** Using `next-mdx-remote/rsc` for rendering `content` field from Supabase tables.
*   **Package Manager:** Using `npm` as `pnpm` was not found.
