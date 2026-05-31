import { useState, useEffect, useRef } from 'react';
import { MessageSquare, Send, Paperclip } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function ContractorCollaboration() {
  const { chatMessages, sendChatMessage } = useApp();
  const [input, setInput] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChatMessage(input.trim());
    setInput('');
  };

  // Scroll to bottom on load/update
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-[#FF6B00]" />
            Contractor Collaboration
          </h1>
          <p className="text-white/70 mt-1">Real-time chat between client and contractor</p>
        </div>

        <div className="glass rounded-3xl p-6 flex flex-col h-[600px] border border-white/5 shadow-2xl relative">
          {/* Header */}
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] rounded-full flex items-center justify-center text-white font-bold">
              RC
            </div>
            <div>
              <p className="text-white font-semibold">Rajesh Construction</p>
              <p className="text-white/60 text-sm flex items-center gap-1">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-2 scrollbar-thin">
            {chatMessages.map((msg) => {
              const isClient = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex ${isClient ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 shadow-md ${
                      isClient
                        ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white rounded-br-none'
                        : 'glass text-white rounded-bl-none border border-white/10'
                    }`}
                  >
                    <p className="text-white/50 text-[10px] font-medium uppercase tracking-wider mb-1">
                      {isClient ? 'You' : 'Contractor'}
                    </p>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                    <p className={`text-[10px] text-right mt-1.5 ${isClient ? 'text-white/70' : 'text-white/40'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={chatEndRef} />
          </div>

          {/* Input form */}
          <form onSubmit={handleSend} className="pt-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <button 
                type="button" 
                onClick={() => alert('Attachments (blueprints, site photos, receipts) can be selected in production.')}
                className="glass p-3.5 rounded-xl hover:bg-white/10 transition-all cursor-pointer"
              >
                <Paperclip className="w-5 h-5 text-white/70" />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
              <button 
                type="submit"
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] p-3.5 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/40 transition-all cursor-pointer border border-transparent"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
