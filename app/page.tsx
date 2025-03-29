"use client"; // Required for Framer Motion

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function HomePage() {
  return (
    <main className="px-4 md:px-10 max-w-5xl mx-auto py-12 md:py-20"> {/* Added padding */}
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }} // Added transition duration
        className="mb-12 md:mb-16 text-center" // Centered text
      >
        <h1 className="font-serif text-5xl md:text-6xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100 mb-4"> {/* Adjusted font weight, added dark mode text */}
          The Vibe Coding Checklist
        </h1>
        <p className="font-sans text-lg text-neutral-700 dark:text-neutral-300 max-w-2xl mx-auto"> {/* Centered paragraph, added dark mode text */}
          A living system for coding with clarity, creativity, and confidence.
          Built for devs, designers, and dreamers who want more than just best practices.
        </p>
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }} // Added delay
        className="flex justify-center mb-16 md:mb-24" // Centered button
      >
        <Link href="/guides">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }} // Added tap animation
            className="bg-black dark:bg-white text-white dark:text-black px-6 py-3 rounded-lg font-medium transition-transform duration-200 ease-in-out" // Adjusted rounding and added dark mode styles
          >
            Explore the Guides
          </motion.button>
        </Link>
      </motion.div>

      {/* Featured Guides Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }} // Added delay
      >
        <h2 className="text-3xl font-serif font-semibold mb-8 text-center dark:text-neutral-100">Featured Guides</h2> {/* Added section title */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"> {/* Adjusted grid columns and gap */}
          {/* Example Card 1 */}
          <Link href="/guides/example-guide-1"> {/* Wrap card in Link */}
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }} // Added y-offset on hover
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm hover:shadow-lg dark:hover:border-neutral-600 transition-all duration-200 ease-in-out cursor-pointer bg-white dark:bg-neutral-800" // Added dark mode styles, cursor, background
            >
              <h3 className="font-serif text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Design Systems</h3> {/* Adjusted heading tag, added dark mode text */}
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Bring harmony to your UI with reusable patterns and flexible structure.</p>
            </motion.div>
          </Link>

          {/* Example Card 2 */}
          <Link href="/guides/example-guide-2">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm hover:shadow-lg dark:hover:border-neutral-600 transition-all duration-200 ease-in-out cursor-pointer bg-white dark:bg-neutral-800"
            >
              <h3 className="font-serif text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">Prompt Engineering</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Master the art of crafting effective prompts for AI code generation.</p>
            </motion.div>
          </Link>

          {/* Example Card 3 */}
          <Link href="/guides/example-guide-3">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              className="rounded-xl border border-neutral-200 dark:border-neutral-700 p-6 shadow-sm hover:shadow-lg dark:hover:border-neutral-600 transition-all duration-200 ease-in-out cursor-pointer bg-white dark:bg-neutral-800"
            >
              <h3 className="font-serif text-xl font-semibold mb-2 text-neutral-900 dark:text-neutral-100">AI Tool Comparisons</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Choose the right AI coding assistant for your specific workflow.</p>
            </motion.div>
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
