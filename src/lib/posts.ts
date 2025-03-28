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

// Define an interface for the expected frontmatter structure
interface PostFrontmatter {
  title: string;
  date: string;
  description?: string; // Optional description
  tags?: string[];     // Optional tags array
  author?: string;     // Optional author
  // Allow other string-keyed properties
  [key: string]: any;
}

// Define the structure for extracted headings
export interface Heading {
  level: number;
  text: string;
  slug: string;
}

// Function to get sorted data for all posts in a specific subdirectory (e.g., 'guides')
export function getSortedPostsData(subDirectory: string) {
  const postsDirectory = path.join(contentDirectory, subDirectory);
  // Get file names under /content/[subDirectory]
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames.map((fileName) => {
    // Remove ".md" from file name to get id (slug)
    const id = fileName.replace(/\.md$/, '');

    // Read markdown file as string
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents);

    // Combine the data with the id
    return {
      id,
      ...(matterResult.data as PostFrontmatter), // Use the PostFrontmatter interface
    };
  });
  // Sort posts by date
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}

// Function to get metadata for all posts in a subdirectory, sorted by date
export function getAllPosts(subDirectory: string) {
  const postsDirectory = path.join(contentDirectory, subDirectory);
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((fileName) => fileName.endsWith('.md')) // Ensure we only process markdown files
    .map((fileName) => {
      // Remove ".md" from file name to get id (slug)
      const slug = fileName.replace(/\.md$/, '');

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents);

      // Combine the data with the slug
      return {
        slug,
        ...(matterResult.data as PostFrontmatter),
      };
    });

  // Sort posts by date (newest first)
  return allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
}


// Function to get all possible slugs (ids) for a specific subdirectory
export function getAllPostIds(subDirectory: string) {
  const postsDirectory = path.join(contentDirectory, subDirectory);
  const fileNames = fs.readdirSync(postsDirectory);

  // Returns an array that looks like:
  // [
  //   {
  //     params: {
  //       slug: 'ssg-ssr' // or 'getting-started-with-cline'
  //     }
  //   },
  //   ...
  // ]
  return fileNames.map((fileName) => {
    return {
      params: {
        // Use 'slug' as the parameter name to match the dynamic route [slug]
        slug: fileName.replace(/\.md$/, ''),
      },
    };
  });
}

// Function to get the content, headings, and read time of a single post by id (slug)
export async function getPostData(subDirectory: string, id: string): Promise<{
  id: string;
  contentHtml: string;
  headings: Heading[];
  readTime: number; // Add readTime in minutes
} & PostFrontmatter> {
  const postsDirectory = path.join(contentDirectory, subDirectory);
  const fullPath = path.join(postsDirectory, `${id}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');

  // Use gray-matter to parse the post metadata section
  const matterResult = matter(fileContents);

  // Calculate reading time
  const stats = readingTime(matterResult.content);
  const readTime = Math.ceil(stats.minutes); // Round up to nearest minute

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

        const slug = node.properties?.id as string || ''; // Get slug added by rehype-slug
        if (text && slug) {
          headings.push({
            level: node.tagName === 'h2' ? 2 : 3,
            text,
            slug,
          });
        }
      }
    });
  };

  // Use unified pipeline to process markdown
  const processedContent = await unified()
    .use(remarkParse) // Parse markdown
    .use(remarkRehype) // Convert to rehype (HTML AST)
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

  // Combine the data with the id, contentHtml, headings, and readTime
  return {
    id,
    contentHtml,
    headings,
    readTime,
    ...(matterResult.data as PostFrontmatter),
  };
}
