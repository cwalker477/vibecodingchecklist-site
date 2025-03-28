# Technical Context: VibeCodingChecklist.com

## Technologies Used

*   **Frontend/Framework:** Next.js (React)
*   **Backend/API (for AI Features):** Serverless Functions via Next.js API routes
*   **Styling:** Tailwind CSS
*   **Build Tools:** Next.js default (Webpack/SWC)
*   **Hosting/Deployment:** Vercel
*   **AI Integration:** Google Gemini Pro API (via Serverless Functions)
*   **Content Management:** Markdown files stored in the Git repository
*   **Database:** None planned for V1 (Content is file-based)

## Development Setup

*   **Prerequisites:** Node.js (LTS version recommended), pnpm (preferred, but npm/yarn usable)
*   **Installation:** `pnpm install` (or `npm install` / `yarn install`)
*   **Running Locally:** `pnpm dev` (or `npm run dev` / `yarn dev`)
*   **Building for Production:** `pnpm build` (or `npm run build` / `yarn build`)
*   **Environment Variables:**
    *   `GOOGLE_API_KEY`: Required for Gemini Pro integration via backend functions. (Will need to be set up in Vercel and locally via `.env.local`)
    *   *(Potentially others as features are built)*

## Technical Constraints

*   Reliance on Vercel's infrastructure for hosting and serverless functions.
*   Content updates require Git commits and redeploys (standard for Markdown-based sites).
*   Gemini API usage costs and rate limits need consideration for AI features.

## Key Dependencies (Initial)

*   **`next`:** Core framework
*   **`react`**, **`react-dom`:** UI library
*   **`tailwindcss`:** Styling
*   **`gray-matter`:** Parsing Markdown frontmatter
*   **`remark`**, **`remark-html`** (or similar like `unified`, `rehype`): Processing Markdown content to HTML
*   **`@google/generative-ai`:** Official Google AI SDK for Gemini integration (in backend functions)
*   *(Others to be added as needed, e.g., for date formatting, SEO)*
