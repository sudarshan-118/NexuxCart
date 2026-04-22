'use client';
import { useStore } from '@/lib/state';
import { MessageSquare, X, Send } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { chatAssistant } from '@/lib/ai';
import Markdown from 'react-markdown';
import { clsx } from 'clsx';

export default function Chatbot() {
  const { isChatOpen, setChatOpen } = useStore();
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi there! I am your AI assistant. How can I help you find what you are looking for today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isChatOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || loading) return;
    
    const userMsg = input;
    setInput('');
    setMessages(p => [...p, { role: 'user', content: userMsg }]);
    setLoading(true);

    try {
      const resp = await chatAssistant([...messages, { role: 'user', content: userMsg }]);
      setMessages(p => [...p, { role: 'assistant', content: resp || '' }]);
    } catch (err) {
      setMessages(p => [...p, { role: 'assistant', content: 'Oops, something went wrong.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="flex flex-col items-end space-y-4">
        {isChatOpen ? (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-80 md:w-96 flex flex-col overflow-hidden h-[500px]">
            <div className="p-4 bg-white border-b border-gray-200 text-[#202124] font-medium flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                 <span className="text-xs font-bold">AI Assistant</span>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#f8f9fa]">
              {messages.map((msg, i) => (
                <div key={i} className={clsx("flex flex-col max-w-[85%]", msg.role === 'user' ? "ml-auto items-end" : "mr-auto items-start")}>
                  <div className={clsx("px-4 py-2 rounded-2xl", msg.role === 'user' ? "bg-blue-600 text-white rounded-br-sm" : "bg-white border border-gray-200 shadow-sm text-sm text-[#202124] rounded-bl-sm")}>
                     {msg.role === 'assistant' ? <div className="prose prose-sm max-w-none"><Markdown>{msg.content}</Markdown></div> : <span className="text-sm">{msg.content}</span>}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="mr-auto px-4 py-3 bg-white border border-gray-200 rounded-2xl rounded-bl-sm shadow-sm flex gap-1 items-center h-[40px]">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s'}} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s'}} />
                </div>
              )}
              <div ref={endRef} />
            </div>

            <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-200 flex gap-2">
              <input 
                suppressHydrationWarning
                value={input} 
                onChange={e => setInput(e.target.value)}
                placeholder="Ask anything..." 
                className="flex-1 bg-gray-100 border-transparent rounded-lg px-4 py-2 text-sm focus:outline-none focus:bg-white focus:ring-2 ring-blue-500 transition-all"
              />
              <button suppressHydrationWarning type="submit" disabled={loading || !input.trim()} className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-2xl shadow-xl w-64 p-4 hidden lg:block mb-4">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-xs font-bold text-[#202124]">AI Assistant</p>
            </div>
            <p className="text-[11px] text-gray-600 mb-3 px-1">&quot;Hi there! Need help finding the perfect item?&quot;</p>
            <div className="flex space-x-2">
              <button suppressHydrationWarning onClick={() => setChatOpen(true)} className="bg-blue-600 text-white text-[10px] px-3 py-1.5 rounded-lg font-bold">Ask anything</button>
            </div>
          </div>
        )}

        <button 
          suppressHydrationWarning
          onClick={() => setChatOpen(!isChatOpen)}
          className="w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transform transition-all focus:outline-none"
        >
           {isChatOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      </div>
    </div>
  );
}
