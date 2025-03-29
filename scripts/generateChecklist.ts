import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
// Note: If running this script directly often, consider adding 'readline' for interactive input
// import * as readline from 'node:readline/promises';
// import { stdin as input, stdout as output } from 'node:process';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Ensure this endpoint is correct for the Gemini model you intend to use
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

const PROMPT_FILE_PATH = path.resolve(process.cwd(), 'prompts/checklist.txt');
const OUTPUT_DIR = path.resolve(process.cwd(), 'content/guides'); // Saving checklists alongside guides for now

interface Frontmatter {
    title: string;
    slug: string;
    description: string;
    format: string; // Will be 'checklist'
    tags: string[];
    publishedAt: string; // ISO 8601 format e.g., '2025-03-29T12:00:00Z'
    readingTime: number; // minutes
}

/**
 * Loads the system prompt from the specified file.
 */
async function loadPrompt(filePath: string): Promise<string> {
    try {
        const prompt = await fs.readFile(filePath, 'utf-8');
        return prompt;
    } catch (error) {
        console.error(`Error reading prompt file at ${filePath}:`, error);
        throw new Error('Failed to load system prompt.');
    }
}

/**
 * Generates a kebab-case slug from a title string.
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
}

/**
 * Estimates reading time in minutes based on word count.
 */
function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200; // Adjust as needed
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Calls the Google Gemini API to generate checklist content.
 * NOTE: Placeholder structure. Needs actual API implementation.
 * The prompt asks Gemini *not* to output frontmatter, only the body.
 * This function needs to return the body and *also* generate/extract frontmatter fields.
 */
async function callGeminiApiForChecklist(systemPrompt: string, topic: string): Promise<{ title: string; description: string; tags: string[]; content: string }> {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    // Inject the topic into the prompt
    const fullPrompt = systemPrompt.replace('[User will provide the specific topic for the checklist here]', topic);

    console.log(`Calling Gemini API for checklist topic: "${topic}"...`);

    try {
        /*
        // --- Placeholder for actual API call ---
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: fullPrompt }] }],
                // Add generationConfig if needed, potentially asking for structured output
                // for frontmatter fields alongside the markdown body.
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        // --- Placeholder for response parsing ---
        // This needs careful implementation based on Gemini's response.
        // If Gemini *can* provide structured frontmatter + markdown body:
        // const generatedData = response.data?.candidates?.[0]?.content?.parts?.[0]; // Adjust path
        // const generatedTitle = generatedData?.title; // Example
        // const generatedDescription = generatedData?.description; // Example
        // const generatedTags = generatedData?.tags; // Example
        // const generatedContent = generatedData?.markdownBody; // Example

        // If Gemini only returns the markdown body (as requested by the prompt):
        const generatedContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!generatedContent) {
            throw new Error('Invalid response structure from Gemini API.');
        }
        // We would need to generate frontmatter fields based on the topic or content.
        const generatedTitle = `Checklist: ${topic}`; // Simple generation
        const generatedDescription = `A practical checklist for ${topic}.`; // Simple generation
        const generatedTags = ['checklist', generateSlug(topic).substring(0, 20)]; // Simple generation

        console.log('Successfully received response from Gemini API.');
        return {
            title: generatedTitle,
            description: generatedDescription,
            tags: generatedTags,
            content: generatedContent, // Just the body starting from "## Context"
        };
        */

        // --- Using dummy data until API call is implemented ---
        console.warn('Using dummy data instead of calling Gemini API.');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        const dummyTitle = `Quick Checklist: ${topic}`;
        const dummyDescription = `Follow these steps for successfully ${topic}.`;
        const dummyTags = ['checklist', 'howto', generateSlug(topic).substring(0, 15)];
        const dummyContent = `
## Context

Getting started with ${topic} can seem daunting. This checklist breaks down the essential steps to get you up and running quickly and efficiently.

## The Checklist

- [ ] Step 1: Initial setup for ${topic}.
- [ ] Step 2: Configure the core components.
- [ ] Step 3: Implement the primary logic.
- [ ] Step 4: Add necessary integrations.
- [ ] Step 5: Write basic tests.
- [ ] Step 6: Verify the output.
- [ ] Step 7: Refactor for clarity.

## Bonus Tips

*   **Pro Tip 1:** Always double-check your environment variables.
*   **Pro Tip 2:** Refer to the official documentation for edge cases.

## Wrap-up

You've now got a solid foundation for ${topic}!
        `.trim();

        return {
            title: dummyTitle,
            description: dummyDescription,
            tags: dummyTags,
            content: dummyContent,
        };
        // --- End of dummy data ---

    } catch (error: any) {
        console.error('Error calling Gemini API for checklist:');
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
        } else {
            console.error(error.message);
        }
        throw new Error('Failed to generate checklist content using Gemini API.');
    }
}

/**
 * Saves the generated checklist content and frontmatter to an MDX file.
 */
async function saveChecklist(frontmatter: Frontmatter, content: string): Promise<void> {
    const filePath = path.join(OUTPUT_DIR, `${frontmatter.slug}.mdx`);

    const fileContent = `---
title: "${frontmatter.title.replace(/"/g, '\\"')}"
slug: "${frontmatter.slug}"
description: "${frontmatter.description.replace(/"/g, '\\"')}"
format: "${frontmatter.format}"
tags: [${frontmatter.tags.map(tag => `"${tag}"`).join(', ')}]
publishedAt: "${frontmatter.publishedAt}"
readingTime: ${frontmatter.readingTime}
---

${content}
`;

    try {
        await fs.mkdir(OUTPUT_DIR, { recursive: true });
        await fs.writeFile(filePath, fileContent, 'utf-8');
        console.log(`Successfully saved checklist to: ${filePath}`);
    } catch (error) {
        console.error(`Error saving checklist to ${filePath}:`, error);
        throw new Error('Failed to save checklist file.');
    }
}

/**
 * Main function to generate and save a checklist article.
 * @param topic - The specific topic for the checklist.
 */
async function generateChecklist(topic: string): Promise<void> {
    console.log(`Starting checklist generation for topic: "${topic}"`);
    if (!topic || topic.trim() === '') {
        console.error("Error: Topic cannot be empty.");
        return;
    }

    try {
        const systemPrompt = await loadPrompt(PROMPT_FILE_PATH);
        // Gemini is expected to return body + potentially frontmatter fields
        const { title, description, tags, content } = await callGeminiApiForChecklist(systemPrompt, topic);

        const slug = generateSlug(title);
        // Calculate reading time based *only* on the body content returned by Gemini
        const readingTime = calculateReadingTime(content);
        const publishedAt = new Date().toISOString();

        const frontmatter: Frontmatter = {
            title,
            slug,
            description,
            format: 'checklist', // Set format specifically
            tags: [...new Set(['checklist', ...tags])], // Ensure 'checklist' tag is present
            publishedAt,
            readingTime,
        };

        await saveChecklist(frontmatter, content);

        console.log(`Checklist generation complete for topic: "${topic}"`);

    } catch (error: any) {
        console.error(`\n--- Checklist generation failed for topic: "${topic}" ---`);
        console.error(error.message);
    }
}

// --- How to Use ---
// This script is designed to be called with a topic.
// Example from another script or command line:
// node -e "require('./scripts/generateChecklist').generateChecklist('Setting up LangChain agents in Node.js')"

// Or, uncomment below for interactive use (requires 'readline' import)
/*
async function runInteractive() {
    if (!GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is not set in .env.local. Please add it.");
        return;
    }
    const rl = readline.createInterface({ input, output });
    const topic = await rl.question('Enter the topic for the checklist: ');
    rl.close();

    if (topic) {
        await generateChecklist(topic);
    } else {
        console.log("No topic entered. Exiting.");
    }
}

runInteractive().catch(err => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
});
*/

// Export the main function if needed
export { generateChecklist };

console.log("generateChecklist.ts script loaded. Call generateChecklist('Your Topic') to start.");
