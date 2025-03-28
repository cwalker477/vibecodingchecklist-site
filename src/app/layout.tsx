import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Import Inter font
import "./globals.css";

// Configure Inter font
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter", // Define CSS variable
});

export const metadata: Metadata = {
  title: "Vibe Coding Checklist | Master AI-Assisted Development",
  description: "Your central resource for guides, tool comparisons, and insights into the world of vibe coding and AI development tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply the Inter font variable to the html tag
    <html lang="en" className={`${inter.variable}`}>
      <body className="antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans"> {/* Use font-sans which will default to the variable */}
        {/* Basic structure, Header/Footer can be added later */}
        <main>{children}</main>
      </body>
    </html>
  );
}
