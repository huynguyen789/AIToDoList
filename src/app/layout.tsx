/**
 * Root layout component for the AI Todo List application
 * Provides the basic HTML structure and metadata
 */

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AI Todo List',
  description: 'A modern todo list application with priority management based on the Eisenhower Matrix',
};

/**
 * Root layout component
 * Input: Children components
 * Process: Wrap children with HTML structure
 * Output: Complete HTML document
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">
        {children}
      </body>
    </html>
  );
} 