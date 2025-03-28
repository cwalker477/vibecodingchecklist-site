# Module 6: Homepage + UI Block Structure

## Design Inspiration
*   Jasper.ai (Clean, professional, benefit-focused)
*   Sprout Social (Organized, data-rich, clear navigation)

## Homepage Structure

1.  **🔷 Hero Section**
    *   **Content:**
        *   Headline: "Master the Art of Vibe Coding" (or similar)
        *   Sub-headline: "Your central hub for guides, tool comparisons, and AI coding insights."
        *   CTAs: Primary "Start Learning" (links to `/guides/getting-started-with-vibe-coding`), Secondary "Compare Tools" (links to `/comparisons/`)
    *   **Layout:** Clean, prominent headline, clear CTAs, potentially a subtle background graphic related to AI/code.

2.  **🔷 Featured Guides Section**
    *   **Content:** Cards showcasing 3-4 key guides (e.g., Getting Started, Best Prompts, Cline/Cursor tutorial).
    *   **Card Layout:** Icon/Image, Category Tag (e.g., "Guide", "Comparison"), Title, Short Description, Link/CTA ("Read Guide").
    *   **Layout:** Grid or horizontal scroll on mobile. Clear visual hierarchy.

3.  **🔷 Tool Tracker/Comparison Snippet**
    *   **Content:** A preview of the tool comparison data. Could be:
        *   Static list/logos of key tools covered (Cline, Cursor, Bolt, etc.) linking to `/comparisons/`.
        *   A simplified version of the comparison table for top tools.
        *   (V2+) Live widget showing popularity/ranking from `/analytics/`.
    *   **Layout:** Visually distinct section, perhaps using logos prominently.

4.  **🔷 Social Pulse / Latest Updates Section**
    *   **Content:** Feed showing latest model updates (from `/models/weekly-model-updates`) or trending topics/tweets (from `/analytics/social-signal-feed`).
    *   **Layout:** Simple list format, potentially with timestamps and source links. Could be tabbed (Updates | Trends).

5.  **🔷 Footer**
    *   **Content:**
        *   Newsletter Signup (Simple email field + submit button).
        *   Navigation Links (About, FAQ, Guides, Comparisons, etc.).
        *   Social Media Links (Twitter, GitHub if applicable).
        *   Disclaimer/Copyright.
        *   Optional: Dark/Light Mode Toggle.
        *   Link to project GitHub repo (if public).
    *   **Layout:** Standard multi-column footer layout.

## Article Page UI Blocks (General)

*   **Header:** Clear Title, Author (if applicable), Publish/Update Date, Category Tags.
*   **Table of Contents:** Auto-generated for longer articles, sticky on desktop?
*   **Content Blocks:**
    *   Standard Paragraph Text (Prioritize readability: font size, line height, contrast).
    *   Headings (H2, H3, H4) with clear hierarchy.
    *   Code Blocks (Syntax highlighting, copy button).
    *   Blockquotes (For highlighting key insights or quotes).
    *   Images/Screenshots (With captions).
    *   Checklists (For step-by-step guides).
    *   Comparison Tables (Responsive design).
    *   Call-to-Action Blocks (Visually distinct, clear action).
    *   Info/Warning Boxes (For tips, security notes, etc.).
*   **Sidebar (Optional):** Related articles, tool links, interactive widgets (e.g., Prompt Optimizer).
*   **Footer:** Standard site footer.
