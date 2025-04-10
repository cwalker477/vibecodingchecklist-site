# System Patterns: VibeCodingChecklist.com

## System Architecture

*   **Overall Structure:** Next.js application deployed on Vercel, leveraging Static Site Generation (SSG) for content and Serverless Functions (via API Routes) for backend AI features.
*   **Key Components:**
    *   **Frontend:** Next.js (React) application.
    *   **Content Source (Hybrid):**
        *   Supabase Database (`guides` and `blog_posts` tables) for Guides and Blog Posts.
        *   Local Markdown files (`/content`) for other types (e.g., comparisons, security).
    *   **Rendering Engine:** Next.js (SSR/ISR/Client for Supabase data, SSG/ISR for Markdown).
    *   **Styling:** Tailwind CSS.
    *   **AI Integration Layer:** Next.js API Routes acting as serverless functions calling the Google Gemini Pro API.
    *   **Deployment/Hosting:** Vercel platform.

## Key Technical Decisions

*   **Framework Choice (Next.js):** Chosen for its robust features for content-driven sites (SSG, routing), React ecosystem, and seamless Vercel integration.
*   **Content Management (Hybrid System):**
    *   **Supabase:** Primary CMS for Guides and Blog Posts, enabling dynamic content management without Git commits.
    *   **Markdown in Git:** Retained for less frequently updated or structurally simpler content types (e.g., comparisons, security).
*   **Styling (Tailwind CSS):** Chosen for rapid UI development and consistency, aligning well with component-based architecture.
*   **Hosting (Vercel):** Natural fit for Next.js, providing CI/CD, CDN, and serverless function hosting.
*   **AI Backend (Serverless Functions):** Leverages Vercel's infrastructure and Next.js API routes for cost-effective, scalable backend logic without managing servers.

## Design Patterns in Use

*   **Frontend Patterns:**
    *   Component-Based UI (React).
    *   Utility-First CSS (Tailwind).
    *   Static Site Generation (SSG) for content pages.
    *   File-based Routing (Next.js `pages` directory).
*   **Backend Patterns:**
    *   Serverless Functions (Next.js API Routes).
    *   API Routes for specific backend tasks (Gemini integration).
*   **Content Patterns:**
    *   Database-driven content using Supabase (`guides`, `blog_posts` tables).
    *   Markdown with Frontmatter for structured content (other types).
    *   Directory-based content organization (`/content/comparisons`, etc.).

## Component Relationships

```mermaid
graph LR
    subgraph Vercel Platform
        CDN --> NextApp[Next.js Frontend];
        NextApp -- Serves --> User[User Browser];
        NextApp -- Builds from --> Git;
        APIRoutes[API Routes / Serverless Functions] -- Hosted on --> Vercel;
    end

    subgraph Git Repository
        Markdown[Markdown Files /content] -- Read by --> NextApp;
        Code[Application Code] -- Contains --> NextApp;
        Code -- Contains --> APIRoutes;
        Git -- Deploys to --> Vercel;
    end

    subgraph External Services
        Gemini[Google Gemini Pro API]
        Supabase[Supabase Database]
    end

    User -- Requests --> NextApp;
    NextApp -- Reads from --> Supabase; // For Guides & Blog Posts
    User -- Interacts with --> FrontendComponent[Frontend Component];
    FrontendComponent -- Calls --> APIRoutes;
    APIRoutes -- Calls --> Gemini;
    Gemini -- Returns response --> APIRoutes;
    APIRoutes -- Returns response --> FrontendComponent;

    style User fill:#f9f,stroke:#333,stroke-width:2px
    style Gemini fill:#ccf,stroke:#333,stroke-width:2px
    style Supabase fill:#9cf,stroke:#333,stroke-width:2px
```

*   **Data Flow (Supabase Content - Guides & Blog Posts):** User requests `/guides`, `/guides/[slug]`, `/blog`, or `/blog/[slug]` -> Next.js page/component fetches data directly from Supabase -> Page is rendered (SSR/ISR/Client) -> Page served to user. (Content updates happen directly in Supabase).
*   **Data Flow (Markdown Content - Other Types):** Developer pushes Markdown changes to Git -> Vercel triggers build -> Next.js reads Markdown, generates static pages -> Pages deployed to Vercel CDN -> User requests page, served by CDN.
*   **Data Flow (AI Feature - e.g., Prompt Optimizer):** User interacts with UI -> Frontend component sends request to `/api/optimize-prompt` -> Vercel executes the associated serverless function -> Function calls Gemini API -> Gemini responds -> Function processes response -> Function responds to frontend -> UI updates.
