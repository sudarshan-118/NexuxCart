import type {Metadata} from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Chatbot from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'NexusCart AI',
  description: 'Smart e-commerce platform with AI.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className="font-sans text-[#202124] bg-[#f8f9fa] flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 flex flex-col pt-0">{children}</main>
        <Chatbot />
      </body>
    </html>
  );
}
