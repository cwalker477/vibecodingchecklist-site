import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent'; // Replace with actual Gemini Pro 2.5 endpoint if different

const PROMPT_FILE_PATH = path.resolve(process.cwd(), 'prompts/field-guide.txt');
const OUTPUT_DIR = path.resolve(process.cwd(), 'content/guides');

interface Frontmatter {
    title: string;
    slug: string;
    description: string;
    format: string;
    tags: string[];
    publishedAt: string; // ISO 8601 format e.g., '2025-03-29T12:00:00Z'
    readingTime: number; // minutes
}

/**
 * Loads the system prompt from the specified file.
 * @param filePath - Path to the prompt file.
 * @returns The content of the prompt file.
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
 * @param title - The article title.
 * @returns A URL-friendly slug.
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens with single hyphen
}

/**
 * Estimates reading time in minutes based on word count.
 * @param text - The article content.
 * @returns Estimated reading time in minutes.
 */
function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Calls the Google Gemini API to generate content.
 * NOTE: This is a placeholder structure. The actual API request payload
 * and response handling might differ based on the Gemini API documentation.
 * @param systemPrompt - The base system prompt.
 * @param topic - The specific topic for the article.
 * @returns The generated article content (Markdown).
 */
async function callGeminiApi(systemPrompt: string, topic: string): Promise<{ title: string; description: string; content: string }> {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    // Inject the topic into the prompt
    const fullPrompt = systemPrompt.replace('[User will provide the specific topic for the field guide here]', topic);

    console.log(`Calling Gemini API for topic: "${topic}"...`);

    try {
        /*
        // --- Placeholder for actual API call ---
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                // Adjust payload based on Gemini API requirements
                contents: [{ parts: [{ text: fullPrompt }] }],
                // generationConfig: { ... } // Add any generation config if needed
            },
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );

        // --- Placeholder for response parsing ---
        // Adjust parsing based on the actual Gemini API response structure
        const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!generatedText) {
            throw new Error('Invalid response structure from Gemini API.');
        }

        // --- Placeholder for extracting title/description ---
        // This part is tricky and might require Gemini to output structured data
        // or use regex/parsing on the generatedText. For now, using placeholders.
        const generatedTitle = `Generated Field Guide: ${topic}`;
        const generatedDescription = `A field guide exploring ${topic}.`;
        const generatedContent = generatedText; // Assuming the API returns only the body

        console.log('Successfully received response from Gemini API.');
        return {
            title: generatedTitle,
            description: generatedDescription,
            content: generatedContent,
        };
        */

        // --- Using dummy data until API call is implemented ---
        console.warn('Using dummy data instead of calling Gemini API.');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        const dummyTitle = `Field Guide: Mastering ${topic}`;
        const dummyDescription = `An essential field guide to understanding and applying ${topic} in your vibe coding workflow.`;
        const dummyContent = `
## Introduction

Welcome to the field guide on **${topic}**! This guide dives into the core concepts and practical steps you need to get started.

## Core Concepts

*   Concept 1: Explanation...
*   Concept 2: Explanation...

## Practical Steps

1.  **Setup:** How to prepare your environment.
2.  **Execution:** Applying the technique.
    \`\`\`typescript
    // Example code snippet related to ${topic}
    console.log('Vibe coding with ${topic}!');
    \`\`\`
3.  **Verification:** Checking the results.

## Key Takeaways

Remember these key points about ${topic}:
*   Point A
*   Point B

Happy vibe coding!
        `.trim();

        return {
            title: dummyTitle,
            description: dummyDescription,
            content: dummyContent,
        };
        // --- End of dummy data ---

    } catch (error: any) {
        console.error('Error calling Gemini API:');
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
        } else {
            console.error(error.message);
        }
        throw new Error('Failed to generate content using Gemini API.');
    }
}

/**
 * Saves the generated article content and frontmatter to an MDX file.
 * @param frontmatter - The article's frontmatter metadata.
 * @param content - The article's Markdown content.
 */
async function saveArticle(frontmatter: Frontmatter, content: string): Promise<void> {
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
        await fs.mkdir(OUTPUT_DIR, { recursive: true }); // Ensure directory exists
        await fs.writeFile(filePath, fileContent, 'utf-8');
        console.log(`Successfully saved article to: ${filePath}`);
    } catch (error) {
        console.error(`Error saving article to ${filePath}:`, error);
        throw new Error('Failed to save article file.');
    }
}

/**
 * Main function to generate and save a field guide article.
 * @param topic - The specific topic for the field guide.
 * @param tags - Optional array of tags for the article.
 */
async function generateFieldGuide(topic: string, tags: string[] = ['field-guide']): Promise<void> {
    console.log(`Starting generation for topic: "${topic}"`);
    try {
        const systemPrompt = await loadPrompt(PROMPT_FILE_PATH);
        const { title, description, content } = await callGeminiApi(systemPrompt, topic);

        const slug = generateSlug(title);
        const readingTime = calculateReadingTime(content);
        const publishedAt = new Date().toISOString();

        const frontmatter: Frontmatter = {
            title,
            slug,
            description,
            format: 'field-guide',
            tags: [...new Set(['field-guide', ...tags])], // Ensure 'field-guide' tag is present
            publishedAt,
            readingTime,
        };

        await saveArticle(frontmatter, content);

        console.log(`Field guide generation complete for topic: "${topic}"`);

    } catch (error: any) {
        console.error(`\n--- Generation failed for topic: "${topic}" ---`);
        console.error(error.message);
        // Optionally exit process if running as a standalone script
        // process.exit(1);
    }
}

// --- Example Usage (Comment out or remove when integrating into a larger workflow) ---
/*
async function main() {
    // Example: Generate a guide for "Effective Prompt Chaining"
    const topic = "Effective Prompt Chaining";
    const specificTags = ["prompt-engineering", "advanced"];

    if (!GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is not set in .env.local. Please add it.");
        console.log("Skipping example generation.");
        return;
    }

    await generateFieldGuide(topic, specificTags);
}

main().catch(err => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
});
*/

// Export functions if needed for use in other scripts
// export { generateFieldGuide, loadPrompt, generateSlug, calculateReadingTime, saveArticle };

console.log("generateFieldGuide.ts script loaded. Call generateFieldGuide('Your Topic') to start.");
