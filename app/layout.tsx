import '../globals.css';
import Link from 'next/link'; // Import Link

export const metadata = {
  title: 'VibeCodingChecklist',
  description: 'Developer resources and guides',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // Add dark class to html for class-based dark mode
    // Apply base font-sans
    <html lang="en" className="dark font-sans">
      {/* Apply base background and text colors, dark mode variants */}
      <body className="bg-white dark:bg-dark-bg text-neutral-800 dark:text-dark-text transition-colors duration-300 min-h-screen flex flex-col">
        <header className="bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-dark-border sticky top-0 z-10">
          <nav className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" legacyBehavior={false}>
              <span className="font-semibold text-lg cursor-pointer text-neutral-900 dark:text-dark-heading">VibeCodingChecklist</span>
            </Link>
            <div className="flex space-x-6">
              <Link href="/guides" legacyBehavior={false}>
                <span className="cursor-pointer hover:text-dark-accent dark:hover:text-dark-accent transition">Guides</span>
              </Link>
              <Link href="/blog" legacyBehavior={false}>
                <span className="cursor-pointer hover:text-dark-accent dark:hover:text-dark-accent transition">Blog</span>
              </Link>
              {/* Add more links here as needed */}
            </div>
          </nav>
        </header>
        <main className="flex-grow"> {/* Ensure main content area takes up remaining space */}
          {children}
        </main>
        {/* Optional Footer can go here */}
      </body>
    </html>
  );
}
