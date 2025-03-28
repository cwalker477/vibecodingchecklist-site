# Active Context: VibeCodingChecklist.com

## Current Work Focus

*   **Phase:** Project Scaffolding
*   **Goal:** Create the initial Next.js project structure with Tailwind CSS configured.

## Recent Changes

*   Defined and documented the full technology stack (Next.js, Markdown, Tailwind, Vercel, Serverless Functions) in `techContext.md`.
*   Defined and documented the system architecture in `systemPatterns.md`.

## Next Steps

*   **Execute Scaffolding:** Run `create-next-app` to generate the project files in a `vibecodingchecklist-site` directory.
*   **Verify Setup:** Confirm the project is created successfully.
*   **Create Content Directory:** Add the `/content` directory structure based on `contentArchitecture.md`.
*   **Initial Commit:** (User action) Recommend committing the initial project structure.
*   **Start Implementing UI Blocks:** Begin creating components based on `uiBlocks.md`.

## Active Decisions & Considerations

*   **`create-next-app` options:** Using `--typescript`, `--tailwind`, `--eslint`, `--app` (for App Router), `--src-dir`, `--import-alias "@/*"`. Using `pnpm`.
*   **Directory Structure:** Project will be created in `./vibecodingchecklist-site/`. Content will go in `./vibecodingchecklist-site/content/`.
