import fs from 'fs/promises';
import path from 'path';
import axios, { AxiosError } from 'axios';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Ensure this endpoint is correct for the Gemini model you intend to use
// Using v1beta as it often has newer models like 1.5 Pro
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${GEMINI_API_KEY}`;

const PROMPTS_DIR = path.resolve(process.cwd(), 'prompts');
const OUTPUT_DIR = path.resolve(process.cwd(), 'content/guides');

type ArticleFormat = 'checklist' | 'field-guide' | 'brain-dump';
const VALID_FORMATS: ArticleFormat[] = ['checklist', 'field-guide', 'brain-dump'];

interface Frontmatter {
    title: string;
    slug: string;
    description: string;
    format: ArticleFormat;
    tags: string[];
    publishedAt: string; // ISO 8601 format e.g., '2025-03-29T12:00:00Z'
    readingTime: number; // minutes
}

// --- Gemini API Helper ---

/**
 * Centralized function to call the Gemini API with retry logic.
 * @param promptText The full prompt to send to the API.
 * @param retries Number of retries allowed.
 * @returns The generated text content from the API response.
 * @throws Throws an error if the API call fails after all retries.
 */
async function callGemini(promptText: string, retries = 1): Promise<string> {
    if (!GEMINI_API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set.');
    }

    const payload = {
        // Structure based on Gemini API docs (v1beta)
        contents: [{ parts: [{ text: promptText }] }],
        // Optional: Add generationConfig if needed (e.g., temperature, maxOutputTokens)
        // generationConfig: {
        //   temperature: 0.7,
        //   maxOutputTokens: 2048,
        // }
    };

    let attempts = 0;
    while (attempts <= retries) {
        attempts++;
        try {
            const response = await axios.post(GEMINI_API_URL, payload, {
                headers: { 'Content-Type': 'application/json' },
            });

            // Adjust parsing based on actual Gemini API response structure
            // Example assumes response.data.candidates[0].content.parts[0].text
            const generatedText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!generatedText) {
                // Handle cases where the response structure is unexpected but not an error status
                if (response.data?.promptFeedback?.blockReason) {
                     throw new Error(`Gemini API blocked request: ${response.data.promptFeedback.blockReason}`);
                }
                 throw new Error('Invalid or empty response structure from Gemini API.');
            }

            return generatedText.trim(); // Return the successfully generated text

        } catch (error: any) {
            console.error(`\t\tGemini API call attempt ${attempts} failed:`, error.message);
            if (axios.isAxiosError(error)) {
                const axiosError = error as AxiosError;
                console.error(`\t\tStatus: ${axiosError.response?.status}`);
                // Log response data only if it seems safe (avoid logging sensitive info)
                if (axiosError.response?.data && typeof axiosError.response.data === 'object') {
                     // Check if it's the standard error format
                     const errorData = axiosError.response.data as any;
                     if (errorData.error && errorData.error.message) {
                         console.error(`\t\tAPI Error: ${errorData.error.message}`);
                     } else {
                         // Avoid logging potentially large/complex unknown data structures
                         console.error('\t\tResponse data structure not recognized.');
                     }
                }
            }

            if (attempts > retries) {
                console.error(`\t\tGemini API call failed after ${attempts} attempts.`);
                throw new Error(`Gemini API call failed: ${error.message}`); // Rethrow after final attempt
            }

            // Wait before retrying (e.g., exponential backoff or simple delay)
            const delay = 1000 * attempts; // Simple linear backoff
            console.log(`\t\tRetrying in ${delay / 1000}s...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    // Should not be reachable if retries >= 0, but satisfies TypeScript
    throw new Error('Gemini API call failed after all retries.');
}


// --- Helper Functions (Slug, Reading Time, Prompt Loading) ---

/**
 * Generates a kebab-case slug from a title string.
 */
function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/\?/g, '') // Remove question marks
        .replace(/[^a-z0-9\s-]/g, '') // Remove special chars except space/hyphen
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-'); // Replace multiple hyphens
}

/**
 * Estimates reading time in minutes based on word count.
 */
function calculateReadingTime(text: string): number {
    const wordsPerMinute = 200;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
}

/**
 * Loads a prompt content based on the determined format.
 */
async function loadPromptByFormat(format: ArticleFormat): Promise<string> {
    const filePath = path.join(PROMPTS_DIR, `${format}.txt`);
    try {
        const prompt = await fs.readFile(filePath, 'utf-8');
        return prompt;
    } catch (error) {
        console.error(`Error reading prompt file at ${filePath}:`, error);
        throw new Error(`Failed to load system prompt for format: ${format}.`);
    }
}

/**
 * Saves the generated article content and frontmatter to an MDX file.
 */
async function saveAsMDX(frontmatter: Frontmatter, content: string): Promise<string> {
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
        return filePath; // Return the path where it was saved
    } catch (error) {
        console.error(`Error saving article to ${filePath}:`, error);
        throw new Error('Failed to save article file.');
    }
}

// --- Core Generation Logic ---

/**
 * STEP 2: Determines the best format for a given topic using the REAL Gemini API.
 */
async function determineBestFormat(topic: string): Promise<ArticleFormat> {
    const determinationPrompt = `Given the topic '${topic}', which format would be most helpful for a blog post on vibecodingchecklist.com: checklist, field-guide, or brain-dump? Respond with only the format name.`;
    console.log(`\tDetermining format for topic: "${topic}"...`);

    try {
        const formatText = await callGemini(determinationPrompt); // Use the helper
        const sanitizedFormat = formatText.toLowerCase().trim();

        if (VALID_FORMATS.includes(sanitizedFormat as ArticleFormat)) {
            console.log(`\tFormat determined: ${sanitizedFormat}`);
            return sanitizedFormat as ArticleFormat;
        } else {
            console.warn(`\tWarning: Gemini returned invalid format ('${formatText}'). Defaulting to 'field-guide'.`);
            return 'field-guide'; // Default fallback
        }
    } catch (error: any) {
        console.error(`\tError determining format via Gemini API: ${error.message}`);
        console.warn("\tDefaulting to 'field-guide' due to error.");
        return 'field-guide'; // Default fallback on error
    }
}

/**
 * STEP 4: Generates the article BODY content using the REAL Gemini API.
 * Note: This function now only returns the body content string.
 */
async function generateArticleContent(
    topic: string,
    format: ArticleFormat,
    promptTemplate: string
): Promise<string> { // Returns only the body content string

    // Inject topic into the specific format's prompt template
    let topicPlaceholder = '[User will provide the specific topic for the field guide here]'; // Default
    if (format === 'checklist') {
        topicPlaceholder = '[User will provide the specific topic for the checklist here]';
    } else if (format === 'brain-dump') {
        topicPlaceholder = '[User will provide the specific topic or idea for the brain dump here]';
    }
    const fullPrompt = promptTemplate.replace(topicPlaceholder, topic);

    console.log(`\tGenerating content for topic: "${topic}" (Format: ${format})...`);

    try {
        const generatedContent = await callGemini(fullPrompt); // Use the helper
        console.log('\tSuccessfully generated content body from Gemini API.');
        return generatedContent; // Return just the body content

    } catch (error: any) {
        console.error(`\tError generating content via Gemini API: ${error.message}`);
        // Rethrow the error to be caught by the main loop
        throw new Error(`Failed to generate content for topic "${topic}": ${error.message}`);
    }
}

// --- Frontmatter Generation Helpers ---

function generateFrontmatterTitle(topic: string, format: ArticleFormat): string {
    // Simple generation logic, can be refined
    if (format === 'brain-dump') return `Brain Dump: Exploring ${topic}`;
    if (format === 'checklist') return `Checklist: ${topic}`;
    // Default for field-guide or others
    return `${format.charAt(0).toUpperCase() + format.slice(1)}: ${topic}`;
}

function generateFrontmatterDescription(topic: string, format: ArticleFormat): string {
    // Simple generation logic
    return `An auto-generated ${format} about the key aspects of ${topic}.`;
}

function generateFrontmatterTags(topic: string, format: ArticleFormat): string[] {
     // Simple generation logic - create a basic tag from the topic slug
    const topicTag = generateSlug(topic).substring(0, 20).replace(/-+/g, '-'); // Keep it short
    const baseTags = [format, 'ai-generated'];
    if (topicTag) {
        baseTags.push(topicTag);
    }
    if (format === 'brain-dump') baseTags.push('thinking-out-loud');
    if (format === 'checklist') baseTags.push('how-to');
    return [...new Set(baseTags)]; // Ensure uniqueness
}


// --- Main Batch Generation Function ---

async function generateBatchArticles(topics: string[]) {
    console.log(`Starting batch generation for ${topics.length} topics...`);
    if (!GEMINI_API_KEY) {
        console.error("Error: GEMINI_API_KEY is not set in .env.local. Aborting.");
        return;
    }

    let successCount = 0;
    let failCount = 0;

    for (const topic of topics) {
        console.log(`\nProcessing topic: "${topic}"`);
        try {
            // Step 2: Determine Format
            const format = await determineBestFormat(topic);

            // Step 3: Load Prompt
            const promptTemplate = await loadPromptByFormat(format);

            // Step 4: Generate Article Body Content
            const bodyContent = await generateArticleContent(topic, format, promptTemplate);

            // Generate Frontmatter Fields Programmatically
            const generatedTitle = generateFrontmatterTitle(topic, format);
            const generatedDescription = generateFrontmatterDescription(topic, format);
            const generatedTags = generateFrontmatterTags(topic, format);

            // Prepare final frontmatter object
            const slug = generateSlug(generatedTitle);
            const readingTime = calculateReadingTime(bodyContent);
            const publishedAt = new Date().toISOString();

            const frontmatter: Frontmatter = {
                title: generatedTitle,
                slug: slug,
                description: generatedDescription,
                format: format,
                tags: generatedTags, // Already includes format tag
                publishedAt: publishedAt,
                readingTime: readingTime,
            };

            // Step 5: Save Article
            const savedPath = await saveAsMDX(frontmatter, bodyContent);

            // Log Success
            console.log(`\t✅ Generated: ${frontmatter.title}`);
            console.log(`\t🧠 Format: ${frontmatter.format}`);
            console.log(`\t💾 Saved to: ${path.relative(process.cwd(), savedPath)}`);
            successCount++;

        } catch (error: any) {
            console.error(`\t❌ Failed to process topic "${topic}": ${error.message}`);
            failCount++;
            // Continue to the next topic
        }
    }

    console.log(`\nBatch generation complete.`);
    console.log(`\tSuccessfully generated: ${successCount} articles.`);
    console.log(`\tFailed to generate: ${failCount} articles.`);
}

// --- Script Execution ---

// Step 1: Define Topics
const topicsToGenerate: string[] = [
    "LangChain vs AutoGen: When to use each?",
    "Best practices for building AI-native devtools",
    "Self-healing agents: are we close?",
    "Secure API key handling in AI workflows",
    "What prompt engineering looks like in 2025"
];

// Run the batch generation
generateBatchArticles(topicsToGenerate).catch(err => {
    console.error("\nAn unexpected error occurred during batch processing:", err);
    process.exit(1);
});
