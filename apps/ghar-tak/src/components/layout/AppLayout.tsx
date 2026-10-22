
import type { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ChatbotWidget from '@/components/shared/ChatbotWidget'; // Import the ChatbotWidget

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <Footer />
      <ChatbotWidget /> {/* Add ChatbotWidget here */}
    </div>
  );
}
