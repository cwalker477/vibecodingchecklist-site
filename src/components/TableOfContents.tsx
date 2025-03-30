"use client"; // Mark this as a Client Component

import { useState, useEffect, useRef } from 'react';
import { Heading } from '@/lib/posts'; // Import the Heading type

interface TableOfContentsProps {
  headings: Heading[];
}

export default function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingElementsRef = useRef<{ [key: string]: IntersectionObserverEntry }>({});

  useEffect(() => {
    // Disconnect previous observer if it exists
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // Function to handle intersection changes
    const handleIntersect: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        headingElementsRef.current[entry.target.id] = entry;
      });

      // Find the topmost visible or intersecting heading
      let visibleSlug: string | null = null;
      Object.keys(headingElementsRef.current).forEach((id) => {
        const entry = headingElementsRef.current[id];
        if (entry.isIntersecting || entry.boundingClientRect.top < window.innerHeight * 0.2) { // Consider headings near the top 20% of viewport
           if (visibleSlug === null || entry.boundingClientRect.top < headingElementsRef.current[visibleSlug].boundingClientRect.top) {
             visibleSlug = id;
           }
        }
      });

      setActiveSlug(visibleSlug);
    };

    // Create Intersection Observer
    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '0px 0px -80% 0px', // Observe intersection in the top 20% of the viewport
      threshold: 1.0,
    });

    // Observe each heading element
    const headingElements = document.querySelectorAll('h2[id], h3[id]');
    headingElements.forEach((el) => observerRef.current?.observe(el));

    // Cleanup function
    return () => {
      observerRef.current?.disconnect();
      headingElementsRef.current = {};
    };
  }, [headings]); // Rerun effect if headings change (though unlikely for static content)

  if (!headings || headings.length === 0) {
    return null; // Don't render if no headings
  }

  return (
    // Basic styling - sticky positioning and mobile handling would be done in the parent layout
    <nav className="space-y-2 text-sm" aria-labelledby="toc-heading">
      <h2 id="toc-heading" className="font-semibold text-neutral-700 dark:text-neutral-300 mb-3">On this page</h2>
      <ul className="space-y-1">
        {headings.map((heading) => (
          <li key={heading.slug} className={`${heading.level === 3 ? 'ml-4' : ''}`}>
            <a
              href={`#${heading.slug}`}
              className={`block hover:text-blue-600 dark:hover:text-blue-400 ${
                activeSlug === heading.slug
                  ? 'text-blue-600 dark:text-blue-400 font-medium'
                  // ? 'text-blue-600 dark:text-blue-400 font-medium border-l-2 border-blue-600 pl-2' // Example active style
                  : 'text-neutral-600 dark:text-neutral-400'
              }`}
              // Smooth scroll behavior can be added via CSS scroll-behavior: smooth; on <html>
              onClick={(e) => {
                // Optional: Add JS smooth scroll if CSS isn't sufficient
                // e.preventDefault();
                // document.getElementById(heading.slug)?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
