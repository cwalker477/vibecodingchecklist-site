import '../globals.css';

export const metadata = {
  title: 'VibeCodingChecklist',
  description: 'Developer resources and guides',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="font-sans"> {/* Apply base font */}
      <body>{children}</body>
    </html>
  );
}
