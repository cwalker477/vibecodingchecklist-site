import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings'; // Import autolink headings
import rehypeStringify from 'rehype-stringify';
import { visit } from 'unist-util-visit';
import { Root as HastRoot, Element as HastElement, Properties as HastProperties, Text as HastText } from 'hast'; // Import HAST types
import readingTime from 'reading-time'; // Import reading-time

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

// Function to get the content, headings, and metadata of a single post by slug
// Updated to read .mdx and return PostMetadata structure
export async function getPostData(subDirectory: string, slug: string): Promise<{
  contentHtml: string;
  headings: Heading[];
} & PostMetadata> { // Return combined type
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

  const headings: Heading[] = [];

  // Custom plugin to extract headings (runs after slugs and autolinks are added)
  const extractHeadingsPlugin = () => (tree: HastRoot) => {
    visit(tree, 'element', (node: HastElement) => {
      if (node.tagName === 'h2' || node.tagName === 'h3') {
        // Find the text content, potentially nested within an anchor tag added by autolink-headings
        let text = '';
        const linkNode = node.children.find(child => child.type === 'element' && child.tagName === 'a') as HastElement | undefined;
        const textNode = (linkNode || node).children.find(child => child.type === 'text') as HastText | undefined;
        text = textNode?.value || '';

        const headingSlug = node.properties?.id as string || ''; // Get slug added by rehype-slug
        if (text && headingSlug) {
          headings.push({
            level: node.tagName === 'h2' ? 2 : 3,
            text,
            slug: headingSlug, // Use the generated slug for the heading
          });
        }
      }
    });
  };

  // Use unified pipeline to process markdown/mdx content
  // NOTE: For full MDX support (components), you'd typically use next-mdx-remote or similar
  // This basic pipeline handles standard markdown within .mdx files
  const processedContent = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkRehype, { allowDangerousHtml: true }) // Convert to rehype, allow potential HTML in MDX
    .use(rehypeSlug) // Add slugs/ids to headings
    .use(rehypeAutolinkHeadings, { // Add links to headings
      behavior: 'append', // Append link inside heading
      properties: {
        className: ['anchor-link'], // Add class for styling
        'aria-hidden': 'true',
        tabIndex: -1,
      },
      content: { type: 'text', value: '#' } // Use '#' as link content
    })
    .use(extractHeadingsPlugin) // Extract headings after slugs/links are added
    .use(rehypeStringify) // Convert AST to HTML string
    .process(matterResult.content);

  const contentHtml = processedContent.toString();

  // Construct the final PostMetadata object
  const postData: PostMetadata = {
      slug: typeof frontmatter.slug === 'string' && frontmatter.slug ? frontmatter.slug : slug, // Prioritize frontmatter slug
      title: frontmatter.title || 'Untitled Post',
      publishedAt: frontmatter.publishedAt || new Date().toISOString(), // Default to now if missing
      description: frontmatter.description || '',
      tags: frontmatter.tags || [],
      format: frontmatter.format || 'unknown',
      readingTime: frontmatter.readingTime || calculatedReadingTime, // Prioritize frontmatter, fallback to calculated
      ...frontmatter, // Include other fields
  };


  // Combine the data with the id, contentHtml, headings
  return {
    ...postData, // Spread the metadata
    contentHtml,
    headings,
  };
}
