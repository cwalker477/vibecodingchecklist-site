"use client";

import { useState, useEffect } from 'react';

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  const toggleVisibility = () => {
    if (window.scrollY > 300) { // Show after scrolling 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  // Set up scroll listener
  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  // Scroll to top smoothly
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`
        ${isVisible ? 'opacity-100' : 'opacity-0'}
        fixed bottom-5 right-5 z-50
        hidden sm:inline-flex items-center justify-center
        w-10 h-10 rounded-full
        bg-blue-600 hover:bg-blue-700 text-white
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
        transition-opacity duration-300 ease-in-out
      `}
      aria-label="Scroll back to top"
    >
      {/* Simple Arrow Up Icon */}
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18" />
      </svg>
    </button>
  );
}
