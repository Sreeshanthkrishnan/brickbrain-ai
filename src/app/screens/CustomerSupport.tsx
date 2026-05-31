import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, Bot } from 'lucide-react';

interface ChatMsg {
  sender: 'bot' | 'user';
  message: string;
  time: string;
}

export default function CustomerSupport() {
  const [messages, setMessages] = useState<ChatMsg[]>([
    { sender: 'bot', message: 'Hello! I am BrickBrain AI Assistant. How can I help you today?', time: '10:00 AM' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const quickActions = [
    'How to add team members?',
    'How to view live prices?',
    'Where is the 3D model?',
    'Show me AI News & Tips'
  ];

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    if (input.includes('team') || input.includes('member') || input.includes('worker')) {
      return 'To manage your personnel, go to the Team Management screen. You can add new workers, set their roles and daily wages, and toggle their attendance under the Attendance Monitoring screen.';
    }
    if (input.includes('price') || input.includes('cost') || input.includes('estimate') || input.includes('budget')) {
      return 'For cost estimation, use the "AI Estimation Form" to enter your plot specs. You can track actual costs in "Budget Tracking" and view daily market rates on the "Live Material Pricing" dashboard.';
    }
    if (input.includes('3d') || input.includes('floor') || input.includes('model') || input.includes('visualization')) {
      return 'Head to the "3D House Visualization" to inspect your structure, plumbing, or electrical layers in a rotatable 3D view. You can also customize the style, roof design, number of floors, and color scheme directly in the sidebar customizer.';
    }
    if (input.includes('news') || input.includes('tip') || input.includes('article') || input.includes('safety')) {
      return 'To read the latest updates, tips, and guidelines, visit the "AI News" screen in the sidebar navigation. It contains categories like Construction News, Material Price Trends, Safety Tips, and Budget Saving Tips.';
    }
    if (input.includes('password') || input.includes('profile') || input.includes('security')) {
      return 'You can change your password directly on your Profile screen. Go to "Profile", locate the "Security Settings" section at the bottom, and fill out the password change form.';
    }
    return 'I hear you! I am here to help you coordinate your BrickBrain project. Try asking about "3D models", "live prices", "AI news", "changing password", or "managing team members".';
  };

  const handleSendMessage = (text: string) => {
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMsg = {
      sender: 'user',
      message: text,
      time
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: ChatMsg = {
        sender: 'bot',
        message: getBotResponse(text),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleQuickAction = (action: string) => {
    handleSendMessage(action);
  };

  const handleConnectAgent = () => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          sender: 'bot',
          message: 'Connecting you to a human Support Representative... Representative Amit is now online. "Hello! How can I help you refine your brick estimations?"',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <MessageCircle className="w-8 h-8 text-[#FF6B00]" />
            Customer Support
          </h1>
          <p className="text-white/70 mt-1">24/7 AI-powered support at your service</p>
        </div>

        <div className="glass rounded-3xl p-6 flex flex-col h-[600px]">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white font-semibold">BrickBrain AI Support</p>
              <p className="text-white/60 text-sm flex items-center gap-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Always Available
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-6 space-y-4 pr-1">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  {msg.sender === 'bot' && (
                    <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-white text-xs">
                      🤖
                    </div>
                  )}
                  <div
                    className={`rounded-2xl p-4 ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white rounded-tr-none'
                        : 'glass text-white rounded-tl-none'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-line mb-1 leading-relaxed">{msg.message}</p>
                    <p className={`text-[10px] text-right ${msg.sender === 'user' ? 'text-white/80' : 'text-white/60'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2.5 max-w-[80%]">
                  <div className="w-8 h-8 rounded-full bg-white/10 flex-shrink-0 flex items-center justify-center text-white text-xs">
                    🤖
                  </div>
                  <div className="glass rounded-2xl rounded-tl-none p-4 text-white/50 text-sm flex items-center gap-1.5">
                    <span>Typing</span>
                    <span className="animate-pulse">...</span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action)}
                  className="glass px-3 py-2 rounded-lg text-white text-xs hover:bg-white/10 hover:border-[#FF6B00]/40 transition-all border border-white/5 cursor-pointer"
                >
                  {action}
                </button>
              ))}
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputValue);
              }}
              className="flex items-center gap-3"
            >
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your question..."
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
              />
              <button
                type="submit"
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] p-3 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/50 transition-all cursor-pointer"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>
        </div>

        {/* Human assistance section removed */}
      </div>
    </div>
  );
}
