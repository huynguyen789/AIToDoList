/**
 * Root layout component for the Priority Task Manager app
 * Provides global styles and context providers
 */

import './globals.css';
import { TaskProvider } from './context/TaskContext';

export const metadata = {
  title: 'Priority Task Manager',
  description: 'Manage your tasks based on priority with the Eisenhower Matrix system.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TaskProvider>{children}</TaskProvider>
      </body>
    </html>
  );
} 