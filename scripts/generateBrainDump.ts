import fs from 'fs/promises';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
// import * as readline from 'node:readline/promises'; // For interactive input
// import { stdin as input, stdout as output } from 'node:process'; // For interactive input

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Ensure this endpoint is correct for the Gemini model you intend to use
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

const PROMPT_FILE_PATH = path.resolve(process.cwd(), 'prompts/brain-dump.txt');
const OUTPUT_DIR = path.resolve(process.cwd(), 'content/guides'); // Saving alongside other formats for now

interface Frontmatter {
    title: string;
    slug: string;
    description: string;
    format: string; // Will be 'brain-dump'
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
    // Allow question marks in slugs for this format? Maybe not standard. Sticking to basic slug.
    return title
        .toLowerCase()
        .replace(/\?/g, '') // Remove question marks specifically
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
 * Calls the Google Gemini API to generate brain dump content.
 * NOTE: Placeholder structure. Needs actual API implementation.
 * Prompt asks Gemini *not* to output frontmatter, only the body.
 * This function needs to return the body and *also* generate/extract frontmatter fields.
 */
async function callGeminiApiForBrainDump(systemPrompt: string, topicOrIdea: string): Promise<{ title: string; description: string; tags: string[]; content: string }> {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    // Inject the topic/idea into the prompt
    const fullPrompt = systemPrompt.replace('[User will provide the specific topic or idea for the brain dump here]', topicOrIdea);

    console.log(`Calling Gemini API for brain dump topic/idea: "${topicOrIdea}"...`);

    try {
        /*
        // --- Placeholder for actual API call ---
        const response = await axios.post(
            `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
            {
                contents: [{ parts: [{ text: fullPrompt }] }],
                // generationConfig: { temperature: 0.8 } // Maybe higher temp for creativity?
            },
            { headers: { 'Content-Type': 'application/json' } }
        );

        // --- Placeholder for response parsing ---
        // Similar challenge as checklist: extract frontmatter + body
        const generatedContent = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!generatedContent) {
            throw new Error('Invalid response structure from Gemini API.');
        }
        // Generate frontmatter based on topic/idea or parse from content if possible
        const generatedTitle = `Brain Dump: Exploring ${topicOrIdea}`; // Simple generation
        const generatedDescription = `Some initial thoughts and questions about ${topicOrIdea}.`; // Simple generation
        const generatedTags = ['brain-dump', 'thinking-out-loud', 'curious']; // Simple generation

        console.log('Successfully received response from Gemini API.');
        return {
            title: generatedTitle,
            description: generatedDescription,
            tags: generatedTags,
            content: generatedContent, // Just the body starting from "## Loose Intro"
        };
        */

        // --- Using dummy data until API call is implemented ---
        console.warn('Using dummy data instead of calling Gemini API.');
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate delay
        const dummyTitle = `What if Agents Could Write Agents? A Brain Dump`;
        const dummyDescription = `Thinking out loud about the recursive potential and pitfalls of AI agents building other AI agents.`;
        const dummyTags = ['brain-dump', 'agents', 'meta-ai', 'speculation', 'future'];
        const dummyContent = `
## Loose Intro

Okay, so I was messing around with AutoGen the other day, setting up a simple writer/critic pair, and this thought hit me: what if the *output* of an agent system wasn't just code or text, but the configuration or code for *another* agent system? Feels a bit like inception, right?

## Thinking Through It

*   **The Recursive Loop:** Could you prompt an agent system (System A) to design a *better* version of itself (System B)? System A analyzes its own performance, identifies weaknesses, and then generates the prompts, tool definitions, and orchestration logic for System B. Seems plausible for narrow tasks.
*   **Complexity Explosion:** My gut feeling is this gets wildly complex, fast. How does System A even *evaluate* "better"? Speed? Cost? Accuracy? Task-specific metrics? Defining that evaluation function seems like the core challenge. It's like asking a human junior dev to hire their own replacement – they might optimize for the wrong things.
*   **Tooling & Bootstrapping:** Would the agent-building agent need special tools? Maybe a "meta-tool" that allows it to define and connect other tools? Or does it just output LangChain/AutoGen/CrewAI config files? The bootstrapping problem is interesting – how do you get the first agent-builder agent?
*   **Guardrails & Runaway Agents:** This is where it gets sci-fi spooky, but practically, how do you prevent infinite loops or resource exhaustion? If System B builds System C, which builds System D... you need robust termination conditions and monitoring. Maybe cost-based limits?

## Unsolved Problems

1.  How do you define the objective function for an agent whose goal is to build a *better* agent?
2.  What's the minimum viable "agent-building agent"? What core capabilities must it have?
3.  How do you ensure alignment and safety in these recursive systems?

## Still Thinking About...

This whole idea feels powerful but fragile. Maybe the first step isn't full agent generation, but agents suggesting improvements or alternative configurations for existing agent setups. That seems more achievable and less likely to summon Skynet. Definitely need to explore this more.
        `.trim();

        return {
            title: dummyTitle,
            description: dummyDescription,
            tags: dummyTags,
            content: dummyContent,
        };
        // --- End of dummy data ---

    } catch (error: any) {
        console.error('Error calling Gemini API for brain dump:');
        if (axios.isAxiosError(error)) {
            console.error('Status:', error.response?.status);
            console.error('Data:', error.response?.data);
        } else {
            console.error(error.message);
        }
        throw new Error('Failed to generate brain dump content using Gemini API.');
    }
}

/**
 * Saves the generated brain dump content and frontmatter to an MDX file.
 */
async function saveBrainDump(frontmatter: Frontmatter, content: string): Promise<void> {
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
        console.log(`Successfully saved brain dump to: ${filePath}`);
    } catch (error) {
        console.error(`Error saving brain dump to ${filePath}:`, error);
        throw new Error('Failed to save brain dump file.');
    }
}

/**
 * Main function to generate and save a brain dump article.
 * @param topicOrIdea - The specific topic or idea for the brain dump.
 */
async function generateBrainDump(topicOrIdea: string): Promise<void> {
    console.log(`Starting brain dump generation for topic/idea: "${topicOrIdea}"`);
    if (!topicOrIdea || topicOrIdea.trim() === '') {
        console.error("Error: Topic/idea cannot be empty.");
        return;
    }

    try {
        const systemPrompt = await loadPrompt(PROMPT_FILE_PATH);
        const { title, description, tags, content } = await callGeminiApiForBrainDump(systemPrompt, topicOrIdea);

        const slug = generateSlug(title);
        const readingTime = calculateReadingTime(content);
        const publishedAt = new Date().toISOString();

        const frontmatter: Frontmatter = {
            title,
            slug,
            description,
            format: 'brain-dump', // Set format specifically
            tags: [...new Set(['brain-dump', ...tags])], // Ensure 'brain-dump' tag is present
            publishedAt,
            readingTime,
        };

        await saveBrainDump(frontmatter, content);

        console.log(`Brain dump generation complete for topic/idea: "${topicOrIdea}"`);

    } catch (error: any) {
        console.error(`\n--- Brain dump generation failed for topic/idea: "${topicOrIdea}" ---`);
        console.error(error.message);
    }
}

// --- How to Use ---
// Example from another script or command line:
// node -e "require('./scripts/generateBrainDump').generateBrainDump('What if agents could write agents?')"

// Or, uncomment below for interactive use (requires 'readline' import)
/*
async function runInteractive() {
    if (!GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is not set in .env.local. Please add it.");
        return;
    }
    const rl = readline.createInterface({ input, output });
    const topicOrIdea = await rl.question('Enter the topic/idea for the brain dump: ');
    rl.close();

    if (topicOrIdea) {
        await generateBrainDump(topicOrIdea);
    } else {
        console.log("No topic/idea entered. Exiting.");
    }
}

runInteractive().catch(err => {
    console.error("An unexpected error occurred:", err);
    process.exit(1);
});
*/

// Export the main function if needed
export { generateBrainDump };

console.log("generateBrainDump.ts script loaded. Call generateBrainDump('Your Topic/Idea') to start.");
