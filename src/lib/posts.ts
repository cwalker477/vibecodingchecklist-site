import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
// Removed unified and related imports as we'll use next-mdx-remote
// import { unified } from 'unified';
// import remarkParse from 'remark-parse';
// import remarkRehype from 'remark-rehype';
// import rehypeSlug from 'rehype-slug';
// import rehypeAutolinkHeadings from 'rehype-autolink-headings';
// import rehypeStringify from 'rehype-stringify';
// import { visit } from 'unist-util-visit';
// import { Root as HastRoot, Element as HastElement, Properties as HastProperties, Text as HastText } from 'hast';
import readingTime from 'reading-time'; // Import reading-time
import { serialize } from 'next-mdx-remote/serialize';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';
// Optional: Add remark/rehype plugins for MDX serialization if needed
import remarkGfm from 'remark-gfm'; // Example: GitHub Flavored Markdown
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';

// Define the path to the content directory
const contentDirectory = path.join(process.cwd(), 'content');

// Define an interface for the expected frontmatter structure for ALL posts/guides
// Standardizing on publishedAt and adding format, readingTime
export interface PostMetadata {
  slug: string; // The URL slug
  title: string;
  publishedAt: string; // ISO 8601 date string
  description?: string;
  tags?: string[];
  format?: string; // e.g., 'field-guide', 'checklist', 'brain-dump'
  readingTime?: number; // Estimated reading time in minutes
  // Allow other string-keyed properties
  [key: string]: any;
}

// Define the structure for extracted headings (used in getPostData)
export interface Heading {
  level: number;
  text: string;
  slug: string;
}

// REMOVED getSortedPostsData function as getAllPostsMetadata serves a similar purpose with more details.

/**
 * Gets metadata for all posts in a subdirectory, sorted by publishedAt date (newest first).
 * Reads .mdx files and includes reading time.
 * @param subDirectory The subdirectory within /content (e.g., 'guides')
 * @returns An array of PostMetadata objects.
 */
export function getAllPostsMetadata(subDirectory: string): PostMetadata[] {
  const postsDirectory = path.join(contentDirectory, subDirectory);
  let fileNames: string[] = [];
  try {
      fileNames = fs.readdirSync(postsDirectory);
  } catch (err) {
      console.error(`Error reading directory ${postsDirectory}:`, err);
      return []; // Return empty array if directory doesn't exist or isn't readable
  }

  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.mdx')) // Process .mdx files
    .map((fileName): PostMetadata | null => {
      const slugFromFile = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(postsDirectory, fileName);

      try {
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const matterResult = matter(fileContents);
        const frontmatter = matterResult.data;

        // Calculate reading time from the content part
        const stats = readingTime(matterResult.content);
        const readTime = Math.ceil(stats.minutes);

        // Use slug from frontmatter if available, otherwise use filename
        const slug = typeof frontmatter.slug === 'string' && frontmatter.slug ? frontmatter.slug : slugFromFile;

        // Basic validation for required fields
        if (!frontmatter.title || !frontmatter.publishedAt) {
            console.warn(`Skipping ${fileName}: Missing required frontmatter (title or publishedAt).`);
            return null;
        }

        return {
          slug: slug,
          title: frontmatter.title,
          publishedAt: frontmatter.publishedAt, // Expecting ISO string
          description: frontmatter.description || '', // Provide default empty string
          tags: frontmatter.tags || [], // Default to empty array
          format: frontmatter.format || 'unknown', // Default format
          readingTime: readTime,
          // Include any other frontmatter fields if needed
          ...frontmatter, // Spread remaining fields, potentially overwriting calculated ones if named the same
        };
      } catch (err) {
          console.error(`Error processing file ${fileName}:`, err);
          return null; // Skip files that cause errors
      }
    })
    .filter((post): post is PostMetadata => post !== null); // Filter out null values from errors/skips

  // Sort posts by publishedAt date (newest first)
  return allPostsData.sort((a, b) => {
    // Compare ISO date strings directly
    if (a.publishedAt < b.publishedAt) {
      return 1;
    } else if (a.publishedAt > b.publishedAt) {
      return -1;
    } else {
      return 0;
    }
  });
}


// Function to get all possible slugs for a specific subdirectory (for getStaticPaths)
export function getAllPostSlugs(subDirectory: string) {
  const postsDirectory = path.join(contentDirectory, subDirectory);
   let fileNames: string[] = [];
   try {
       fileNames = fs.readdirSync(postsDirectory);
   } catch (err) {
       console.error(`Error reading directory ${postsDirectory} for slugs:`, err);
       return [];
   }

  // Returns an array that looks like:
  // [
  //   { params: { slug: 'ssg-ssr' } },
  //   { params: { slug: 'getting-started-with-cline' } },
  //   ...
  // ]
  // It should prioritize the slug from frontmatter if possible, but reading all files
  // just for slugs is inefficient. Using filename is standard practice here.
  return fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map((fileName) => {
          return {
              params: {
                  slug: fileName.replace(/\.mdx$/, ''),
              },
          };
      });
}

// Function to get the serialized MDX source and metadata of a single post by slug
export async function getPostData(subDirectory: string, slug: string): Promise<{
  mdxSource: MDXRemoteSerializeResult; // Serialized source for MDXRemote
} & PostMetadata> { // Return combined type including metadata
  const postsDirectory = path.join(contentDirectory, subDirectory);
  // Assume slug corresponds to filename for lookup, actual slug might differ in frontmatter
  const fullPath = path.join(postsDirectory, `${slug}.mdx`);
  let fileContents: string;
  try {
      fileContents = fs.readFileSync(fullPath, 'utf8');
  } catch (err) {
       throw new Error(`Could not read post file for slug "${slug}" at ${fullPath}: ${err}`);
  }


  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);
  const frontmatter = matterResult.data;

  // Calculate reading time from content
  const stats = readingTime(matterResult.content);
  const calculatedReadingTime = Math.ceil(stats.minutes); // Round up

  // Serialize the MDX content
  const mdxSource = await serialize(matterResult.content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {
      remarkPlugins: [remarkGfm], // Add GFM support (tables, strikethrough, etc.)
      rehypePlugins: [
        rehypeSlug, // Add slugs to headings
        [rehypeAutolinkHeadings, { // Add links to headings
          behavior: 'append',
          properties: { className: ['anchor-link'], ariaHidden: true, tabIndex: -1 },
          content: { type: 'text', value: '#' }
        }],
      ],
      format: 'mdx', // Specify format if needed, though usually inferred
    },
    // Pass frontmatter data to the MDX component if needed via scope
    scope: frontmatter,
  });


  // Construct the final PostMetadata object (excluding content)
  const postMetadata: PostMetadata = {
      slug: typeof frontmatter.slug === 'string' && frontmatter.slug ? frontmatter.slug : slug,
      title: frontmatter.title || 'Untitled Post',
      publishedAt: frontmatter.publishedAt || new Date().toISOString(),
      description: frontmatter.description || '',
      tags: frontmatter.tags || [],
      format: frontmatter.format || 'unknown',
      readingTime: frontmatter.readingTime ?? calculatedReadingTime, // Use frontmatter readingTime if present, else calculated
      ...frontmatter,
  };

  // Combine the metadata with the serialized MDX source
  return {
    ...postMetadata,
    mdxSource,
  };
}
