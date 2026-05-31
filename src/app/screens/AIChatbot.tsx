import { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Brain, Sparkles, Trash2, ArrowUpRight, Copy, Check, Info } from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

interface QuestionPreset {
  question: string;
  category: 'Construction' | 'Real Estate' | 'House Design' | 'Budgets';
  answer: string;
}

const PRESETS: QuestionPreset[] = [
  {
    category: 'Construction',
    question: "How do I calculate red brick quantities?",
    answer: "To estimate red bricks for a standard 9-inch wall: multiply the wall length by height to get the area in square feet. \n\nFor a 9-inch wall, we estimate approximately **10 to 11 bricks per square foot** (including a standard 10mm mortar layer and 5% wastage). For a 4.5-inch single-brick partition wall, divide this quantity by 2 (about 5 to 5.5 bricks per square foot)."
  },
  {
    category: 'Real Estate',
    question: "Is buying land better than apartments?",
    answer: "Both have distinct investment profiles:\n\n1. **Plot of Land**: Offers higher capital appreciation (often 10-15% CAGR in high-growth sub-markets) and absolute ownership freedom. However, it generates no immediate cash flow and requires secure fencing to prevent encroachment.\n2. **Apartments**: Provide immediate rental yield (typically 2.5% to 3.5% in Indian cities) and lower maintenance hassle. However, capital appreciation is usually limited to 4-7% CAGR, and you own only an Undivided Share of Land (UDS)."
  },
  {
    category: 'House Design',
    question: "What is passive solar home design?",
    answer: "Passive solar design leverages the home's site, climate, and local materials to minimize energy bills. Key strategies include:\n\n- **Orientation**: Aligning the long axis of the house East-West so major window openings face south (in Northern hemisphere) or north (in Southern hemisphere) to maximize winter warmth.\n- **Thermal Mass**: Using concrete slabs, brick walls, or tile surfaces to absorb and release solar heat slowly.\n- **Shading**: Deploying roof overhangs and deciduous trees to block direct summer sun while letting low-angle winter sunlight in."
  },
  {
    category: 'Budgets',
    question: "How is construction cost calculated?",
    answer: "In major metros, house construction is typically quoted per square foot of built-up area:\n\n- **Basic Tier (Standard fittings)**: ₹1,600 to ₹1,800 per sq.ft.\n- **Standard Tier (Good quality materials)**: ₹2,000 to ₹2,400 per sq.ft.\n- **Premium/Luxury Tier (Imported marbles, premium bath fittings)**: ₹2,800 to ₹4,000+ per sq.ft.\n\n*Note: Plot excavation, boundary walls, modular wardrobes, and municipal approval costs are usually billed as extras outside the standard built-up rate.*"
  }
];

// Fallback intelligent response rules based on keywords
const getIntelligentResponse = (query: string): string => {
  const q = query.toLowerCase();

  // 1. Weather/Rain/Monsoon
  if (q.includes('rain') || q.includes('wet') || q.includes('water') || q.includes('storm') || q.includes('monsoon') || q.includes('weather') || q.includes('flood')) {
    return "🌧️ **Site Rain & Moisture Management Protocol:**\n\nIf your construction site experiences rain or a storm warning, execute this emergency guide immediately:\n\n1. **Protect Cement Bags**: Cement is highly moisture-sensitive. Ensure all bags are stacked on elevated wooden pallets (not bare soil) and wrapped in heavy-grade waterproof tarpaulins.\n2. **Halt Structural Concrete Pours**: Do not pour concrete during heavy downpours. Rainwater will mix into the concrete, raising the water-to-cement ratio, which causes structural honeycombing and reduces concrete strength by up to 25-30%.\n3. **Stop Plastering & External Painting**: Fresh cement plaster and acrylic wall paints need at least 24 hours of dry weather to cure. Rain will wash them away or create bubbles.\n4. **Power Down Equipment**: Turn off circuit breakers for welding sets, mixers, and pumps. Water pooling around live cables is extremely hazardous.\n5. **Inspect excavation side-walls**: Footing trenches can easily accumulate mud and slide. Drain them before resuming masonry foundation work.";
  }

  // 2. Budgets, cost optimization, tracking
  if (q.includes('budget') || q.includes('cost') || q.includes('price') || q.includes('lakh') || q.includes('crore') || q.includes('track') || q.includes('saving') || q.includes('expense') || q.includes('billing') || q.includes('finance')) {
    return "📊 **Advanced Budget Sourcing & Cost Control:**\n\nTo prevent cost overruns (which affect over 60% of independent home builds), implement these financial protocols:\n\n- **Contingency Fund (10-15%)**: Keep a cash reserve. Geotechnical challenges, concrete pump failures, or steel price increases are inevitable.\n- **Direct Procurement**: Buy core building blocks (TMT Steel, OPC Cement, and Electrical piping) in bulk directly from local wholesale distributors instead of retail shops to shave 7-12% off margins.\n- **Establish Stage Agreements**: Sign stamp-paper work contracts with subcontractors specifying exact materials grades and stage-wise payment releases (e.g. 10% on excavation, 20% on plinth completion, etc.).\n- **Supervise Mortar Preparation**: Ensure laborers don't mix more mortar than they can apply in 2 hours. Leftover dry mortar wasted at the end of the day is a hidden budget killer.";
  }

  // 3. Real Estate, land verification, appreciation, buying vs renting
  if (q.includes('real estate') || q.includes('property') || q.includes('buy') || q.includes('sell') || q.includes('plot') || q.includes('land') || q.includes('apartment') || q.includes('rera') || q.includes('deed') || q.includes('legal') || q.includes('khata')) {
    return "🏢 **Real Estate Investment & Legal Audit Checklist:**\n\nBefore signing a sale agreement or paying booking advances, follow this vetting framework:\n\n1. **Verify Land Titles**: Review the original **Mother Deed** and obtain a certified **Encumbrance Certificate (EC)** for the last 30 years from the sub-registrar office to ensure no active mortgage exists.\n2. **Validate Sanctions**: Check if the layout is approved by the local municipal body (like BBMP, DDA, HUDA) and verified by **RERA**. RERA-approved properties protect buyers by holding builders legally accountable for delays.\n3. **Land vs Apartment Appreciation**:\n   - **Land/Plots**: Higher appreciation potential (8-14% CAGR in active suburbs) and maximum layout flexibility, but no immediate monthly yield.\n   - **Apartments**: Provides instant rental returns (2.5-3.5% yield) and pre-packaged utilities, but slower value growth (3-6% CAGR).";
  }

  // 4. Materials quality checks (Cement, Bricks, Steel, etc.)
  if (q.includes('cement') || q.includes('brick') || q.includes('steel') || q.includes('aggregate') || q.includes('sand') || q.includes('marble') || q.includes('granite') || q.includes('tile') || q.includes('wood') || q.includes('material')) {
    return "🧱 **Construction Materials Selection & Quality Auditing:**\n\n- **OPC vs PPC Cement**: Use **Ordinary Portland Cement (OPC)** Grade 53 for structural framing (columns, beams, slabs) due to its quick early strength. Use **Portland Pozzolana Cement (PPC)** for plastering, tiling, and brick masonry because it is highly plastic and resists chemical weathering.\n- **TMT Rebars**: Select Fe500D or Fe550D TMT Steel. The 'D' indicates higher ductility, which absorbs seismic shocks during earthquakes without snapping.\n- **Red Bricks vs AAC Blocks**: Red bricks are highly durable but heavy and labor-intensive. **Autoclaved Aerated Concrete (AAC) Blocks** are lightweight, offer 3x better thermal insulation, and require less mortar, saving money on structural steel and plaster budgets.";
  }

  // 5. Foundations, soil bearing, Plinth beams
  if (q.includes('foundation') || q.includes('soil') || q.includes('footing') || q.includes('earthquake') || q.includes('column') || q.includes('beam') || q.includes('plinth')) {
    return "🏗️ **Geotechnical Foundation & Structural Engineering:**\n\n- **Perform Soil Testing**: Execute a core soil bearing capacity test before choosing foundations. Weak clay or black cotton soil expands when wet and shrinks when dry, requiring a **raft or pile foundation**. Solid red gravel or rocky subgrade permits simple **isolated column footings**.\n- **Tie Plinth Beams**: Ensure you cast a horizontal plinth tie-beam at ground level. This locks all pillars together, preventing differential settlement which causes diagonal shear cracks in your brick walls later.\n- **Earthquake Seismic Detailing**: Columns must have vertical steel reinforcements bound by lateral ties spaced closer together (100mm center-to-center) near beam junctions to absorb lateral earth shifts.";
  }

  // 6. Curing concrete
  if (q.includes('curing') || q.includes('cure') || q.includes('hydration')) {
    return "💧 **Cement Concrete Curing Best Practices:**\n\n1. **Duration**: Curing should continue for a minimum of 7 to 10 days for standard OPC cement, and up to 14 days if using mineral admixtures like fly ash.\n2. **Frequency**: Columns and beams should be wrapped in wet gunny bags (hessian sheets) and kept continuously damp. Slabs should undergo 'ponding'—flooding with water to a depth of 25-50mm.\n3. **Why it matters**: Incomplete curing can reduce the final compressive strength of the concrete by up to 30% and lead to micro-cracks.";
  }

  // 7. Contractors and labor management
  if (q.includes('contractor') || q.includes('contract') || q.includes('supervise') || q.includes('workers') || q.includes('labor') || q.includes('mason')) {
    return "👷 **Civil Contractor Management Guidelines:**\n\n1. **Define Brand Specifications**: Do not write general clauses like 'cement will be of good quality'. Specify: 'Ultratech / ACC 53 Grade OPC cement'.\n2. **Stage-Wise Payments**: Never pay advances exceeding 10% of the total estimated cost. Align payouts directly to verified work progress milestones.\n3. **Daily Log Reporting**: Require the contractor to send daily site photographs showing steel binding, block masonry alignment, and curing states.";
  }

  // 8. Greetings & Polite closings
  if (q.includes('hello') || q.includes('hi ') || q.includes('hey') || q.includes('greetings') || q === 'hi') {
    return "Hello! I am your AI Construction & Real Estate Assistant. 🧠🏗️ How can I help you today?\n\nYou can ask me about concrete curing times, managing weather warnings (like rain), budgeting optimization, real estate legal title verification, or choosing structural materials!";
  }
  
  if (q.includes('thank') || q.includes('thanks') || q.includes('bye')) {
    return "You're welcome! Feel free to ask any other questions when you begin your next construction phase. Happy building! 🏠🔨";
  }

  // 9. DYNAMIC DUAL-WORD INTENT PARSER & SENTENCE CONSTRUCTER (GPT/Gemini style fallback)
  const stopWords = new Set([
    'what', 'is', 'how', 'do', 'i', 'the', 'a', 'an', 'to', 'for', 'in', 'on', 'with', 'about', 'can', 'you', 'should',
    'please', 'tell', 'me', 'what to do', 'if', 'when', 'it', 'they', 'are', 'we', 'go', 'get', 'take', 'make', 'use',
    'should', 'we', 'do', 'about', 'my', 'your', 'our', 'this', 'that', 'these', 'those', 'there', 'here', 'any'
  ]);
  
  const words = q
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, "") // remove punctuation
    .split(/\s+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  if (words.length > 0) {
    const primaryTopic = words[0].charAt(0).toUpperCase() + words[0].slice(1);
    const secondaryTopic = words[1] ? words[1].charAt(0).toUpperCase() + words[1].slice(1) : '';
    
    const topicHeading = secondaryTopic ? `${primaryTopic} & ${secondaryTopic}` : primaryTopic;

    return `💡 **Expert Advice on ${topicHeading}:**\n\nRegarding your question about **${words.join(' ')}**, here is what you need to consider from a professional architectural and engineering perspective:\n\n1. **Best Practice**: In house construction, planning around **${primaryTopic}** requires structural calculations to avoid foundation settlement or concrete cracking. Always verify local building codes.\n2. **Material and Quality**: Choosing certified materials (such as Fe500 TMT steel or fresh grade cement) and ensuring proper workmanship reduces maintenance costs for ${primaryTopic} by up to 40% over 10 years.\n3. **Budget Control**: Do not skip soil testing or title search verification before investing capital. Always allocate a **10% contingency reserve** in your expense logs to account for unexpected labor or raw material inflation.\n\n*Would you like more detailed suggestions on related subjects like cement curing, rainwater protocols, plinth beam stability, or budget tracking logs?*`;
  }

  return "Thank you for asking! As an AI Construction & Real Estate Assistant, I can advise that successful building projects rely on:\n\n1. **Rigorous Quality Checks**: Ensure cement is fresh (less than 3 months old) and steel rebars are certified grade (Fe500D or Fe550D TMT).\n2. **Clear Agreements**: Always sign a stamp-paper contract with your civil contractor outlining cost per square foot, materials brand specifications, and stage-wise payment milestones.\n3. **Contingency Reserves**: Keep an extra **10% budget reserve** for unexpected excavation anomalies, minor layout alterations, or supplier price surges.\n\n*Would you like me to elaborate on soil foundations, cement curing times, local building permits, or material sourcing tips?*";
};

export default function AIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('brickbrain_chat_history');
    return saved ? JSON.parse(saved) : [
      {
        id: 'welcome',
        sender: 'assistant',
        text: "Hello! I am your AI Construction & Real Estate Assistant. 🧠🏗️\n\nAsk me anything about building budgets, material quantity calculations, structural design, foundation rules, soil requirements, or real estate investment options. \n\nSelect a preset query on the left or type your own question below!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('brickbrain_chat_history', JSON.stringify(messages));
  }, [messages]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend: string) => {
    if (!textToSend.trim()) return;

    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: Math.random().toString(),
      sender: 'user',
      text: textToSend,
      timestamp
    };

    setMessages(prev => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    // Simulate AI thinking and response
    setTimeout(() => {
      const responseText = getIntelligentResponse(textToSend);
      const assistantMsg: ChatMessage = {
        id: Math.random().toString(),
        sender: 'assistant',
        text: responseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, assistantMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearHistory = () => {
    if (confirm("Are you sure you want to clear your conversation history?")) {
      const welcomeMsg: ChatMessage = {
        id: 'welcome',
        sender: 'assistant',
        text: "Hello! I am your AI Construction & Real Estate Assistant. 🧠🏗️\n\nAsk me anything about building budgets, material quantity calculations, structural design, foundation rules, soil requirements, or real estate investment options. \n\nSelect a preset query on the left or type your own question below!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages([welcomeMsg]);
    }
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Brain className="w-8 h-8 text-[#FF6B00]" />
              AI Assistant Chatbot
            </h1>
            <p className="text-white/70 mt-1">Chat live with our real estate and civil engineering expert agent</p>
          </div>
          <button
            onClick={handleClearHistory}
            className="glass px-4 py-2 rounded-xl text-red-400 border border-red-500/20 hover:bg-red-500/10 transition-all flex items-center gap-2 text-sm font-semibold cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            Clear Chat
          </button>
        </div>

        {/* Chatbot Area Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
          {/* Preset Queries Sidebar Panel */}
          <div className="glass rounded-3xl p-5 border border-white/5 space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[#FF6B00] font-semibold text-sm">
                <Sparkles className="w-4 h-4 animate-pulse" />
                <span>Suggested Questions</span>
              </div>
              <div className="space-y-2">
                {PRESETS.map((preset, index) => (
                  <button
                    key={index}
                    onClick={() => handleSend(preset.question)}
                    className="w-full text-left bg-white/5 hover:bg-[#FF6B00]/10 border border-white/10 hover:border-[#FF6B00]/30 rounded-xl p-3 text-xs text-white/80 hover:text-white transition-all cursor-pointer flex justify-between items-start group"
                  >
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-[#FF8F3D] font-bold block">{preset.category}</span>
                      <p className="font-medium pr-2">{preset.question}</p>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-white/30 group-hover:text-[#FF6B00] flex-shrink-0 mt-0.5" />
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-black/35 border border-white/5 rounded-2xl p-4 mt-4 space-y-2 text-[11px] text-white/60">
              <p className="font-semibold text-white flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-[#FF6B00]" />
                Capabilities:
              </p>
              <ul className="list-disc pl-4 space-y-1">
                <li>Material formulas & sizing</li>
                <li>Budgeting guidelines</li>
                <li>RERA approvals &OC checklists</li>
                <li>Soil & foundations tips</li>
              </ul>
            </div>
          </div>

          {/* Chat Window Panel */}
          <div className="lg:col-span-3 glass rounded-3xl border border-white/5 flex flex-col h-[520px] overflow-hidden bg-slate-950/20">
            {/* Assistant Profile Header */}
            <div className="p-4 border-b border-white/10 bg-black/25 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] flex items-center justify-center font-bold text-white shadow">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">BrickBrain AI Advisor</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-[10px] text-green-400 font-semibold tracking-wide">ONLINE (CIVIL ENGINEER EXPERT)</span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] bg-white/5 border border-white/10 text-white/50 px-2.5 py-1 rounded-lg">
                Response Time: ~1.2s
              </span>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.map((message) => {
                const isUser = message.sender === 'user';
                return (
                  <div
                    key={message.id}
                    className={`flex ${isUser ? 'justify-end' : 'justify-start'} items-start gap-2.5`}
                  >
                    {!isUser && (
                      <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                        <Brain className="w-4.5 h-4.5 text-[#FF6B00]" />
                      </div>
                    )}
                    <div className="max-w-[80%] space-y-1">
                      <div
                        className={`rounded-2xl p-4 text-sm leading-relaxed border relative group ${
                          isUser
                            ? 'bg-[#FF6B00] text-white border-[#FF6B00]/40 rounded-tr-none'
                            : 'glass text-white/90 border-white/5 rounded-tl-none bg-slate-900/50'
                        }`}
                      >
                        <p className="whitespace-pre-line">{message.text}</p>
                        
                        {/* Copy message button */}
                        <button
                          onClick={() => handleCopy(message.id, message.text)}
                          className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-black/40 hover:bg-black/60 text-white/50 hover:text-white cursor-pointer"
                          title="Copy message"
                        >
                          {copiedId === message.id ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <span className={`text-[9px] text-white/40 block ${isUser ? 'text-right' : 'text-left'}`}>
                        {message.timestamp}
                      </span>
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex justify-start items-start gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-white text-xs flex-shrink-0">
                    <Brain className="w-4.5 h-4.5 text-[#FF6B00]" />
                  </div>
                  <div className="glass text-white/90 border-white/5 rounded-2xl rounded-tl-none p-4 text-sm bg-slate-900/50 flex items-center gap-1.5 min-w-[70px]">
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                    <span className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Action Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputVal);
              }}
              className="p-3 border-t border-white/10 bg-black/25 flex items-center gap-2"
            >
              <input
                type="text"
                placeholder="Ask about materials, land buying, laws, curing times..."
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF6B00] transition-colors"
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!inputVal.trim() || isTyping}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] disabled:from-white/5 disabled:to-white/5 disabled:text-white/20 text-white p-3.5 rounded-xl hover:shadow-lg hover:shadow-[#FF6B00]/40 transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
