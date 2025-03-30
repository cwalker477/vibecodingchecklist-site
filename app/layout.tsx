import '../globals.css';

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
      <body className="bg-white dark:bg-dark-bg text-neutral-800 dark:text-dark-text transition-colors duration-300">
        {children}
      </body>
    </html>
  );
}
