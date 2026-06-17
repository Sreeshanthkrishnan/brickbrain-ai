import { Outlet, useNavigate, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Calculator,
  IndianRupee,
  Hammer,
  Calendar,
  Target,
  Brain,
  Wallet,
  Boxes,
  BarChart3,
  TrendingUp,
  Users,
  UserCheck,
  FileText,
  CreditCard,
  Bell,
  Settings,
  User,
  CreditCard as Subscription,
  HelpCircle,
  MessageCircle,
  Info,
  Menu,
  X,
  Newspaper,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Layers,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavItem {
  path: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

const navSections: NavSection[] = [
  {
    title: 'Core',
    items: [
      { path: '/app/dashboard', label: 'Dashboard', icon: LayoutDashboard }
    ]
  },
  {
    title: 'Projects & Vision',
    items: [
      { path: '/app/projects', label: 'Projects Portfolio', icon: Briefcase },
      { path: '/app/estimate', label: 'AI Cost Estimate', icon: Calculator },
      { path: '/app/3d-house', label: '3D House Visualizer', icon: Boxes },
      { path: '/app/3d-floor', label: '3D Floor Planner', icon: Layers }
    ]
  },
  {
    title: 'Materials & Labor',
    items: [
      { path: '/app/materials', label: 'Materials Calculator', icon: Boxes },
      { path: '/app/labor', label: 'Labour Planning', icon: Hammer },
      { path: '/app/pricing', label: 'Live Material Pricing', icon: IndianRupee },
      { path: '/app/team', label: 'Team Directory', icon: Users },
      { path: '/app/attendance', label: 'Attendance Monitor', icon: UserCheck }
    ]
  },
  {
    title: 'Timeline & Finance',
    items: [
      { path: '/app/timeline', label: 'Project Timeline', icon: Calendar },
      { path: '/app/milestones', label: 'Milestones Tracker', icon: Target },
      { path: '/app/progress', label: 'Construction Progress', icon: TrendingUp },
      { path: '/app/budget', label: 'Budget Tracking', icon: Wallet },
      { path: '/app/payments', label: 'Payment Ledger', icon: CreditCard }
    ]
  },
  {
    title: 'AI & Analytics',
    items: [
      { path: '/app/chatbot', label: 'AI Chatbot', icon: MessageSquare },
      { path: '/app/recommendations', label: 'AI Insights', icon: Brain },
      { path: '/app/ai-news', label: 'AI News', icon: Newspaper },
      { path: '/app/analytics', label: 'Analytics Panel', icon: BarChart3 }
    ]
  },
  {
    title: 'Account & Support',
    items: [
      { path: '/app/profile', label: 'User Profile', icon: User },
      { path: '/app/settings', label: 'App Settings', icon: Settings },
      { path: '/app/support', label: 'Customer Support', icon: MessageCircle },
      { path: '/app/faq', label: 'FAQs & Help', icon: HelpCircle },
      { path: '/app/about', label: 'About BrickBrain', icon: Info }
    ]
  }
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, isLoading, settings, updateSettings } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1024);
  const [showCookies, setShowCookies] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const consent = localStorage.getItem('brickbrain_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShowCookies(true), 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleCookieConsent = (accepted: boolean) => {
    localStorage.setItem('brickbrain_cookie_consent', accepted ? 'accepted' : 'declined');
    setShowCookies(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#FF6B00] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-white/70 text-sm font-medium">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  const isActive = (path: string) => location.pathname === path;
  // Determine mobile layout style based on viewport width
  const isMobileLayout = windowWidth < 1024;

  const renderAppContent = () => (
    <div className={`flex-1 flex flex-col bg-background relative ${
      isMobileLayout
        ? 'h-full max-h-full overflow-hidden'
        : 'min-h-screen'
    }`}>
      {/* Background Glows */}
      <div className="absolute inset-0 pb-20 lg:pb-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6B00] rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Desktop Sidebar */}
      <div 
        className={`${
          isMobileLayout ? 'hidden' : 'flex'
        } flex-col justify-between fixed left-0 top-0 h-full glass border-r border-white/10 z-40 transition-all duration-300 ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        {/* Top Navigation list */}
        <div className="p-4 flex-1 overflow-y-auto scrollbar-none space-y-6">
          {/* Header Row */}
          <div className={`flex items-center gap-2 mb-6 ${isCollapsed ? 'justify-center' : 'justify-between px-2'}`}>
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] p-2 rounded-xl">
                  <Boxes className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">
                  Brick<span className="text-[#FF6B00]">Brain</span>
                </h1>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-white/60 hover:text-white p-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            </button>
          </div>

          {/* Navigation Sections */}
          <div className="space-y-4">
            {navSections.map((section) => (
              <div key={section.title} className="space-y-1">
                {/* Section Title (hidden in slim mode, or shown as simple line divider) */}
                {!isCollapsed ? (
                  <div className="text-[10px] font-bold text-[#FF8F3D]/70 uppercase tracking-widest px-3 pt-2 pb-1 select-none">
                    {section.title}
                  </div>
                ) : (
                  <div className="border-t border-white/5 my-2"></div>
                )}

                {section.items.map((item) => {
                  const active = isActive(item.path);
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center rounded-xl transition-all cursor-pointer ${
                        isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'
                      } ${
                        active
                          ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white shadow-md shadow-[#FF6B00]/25'
                          : 'text-white/70 hover:bg-white/5 hover:text-white'
                      }`}
                      title={isCollapsed ? item.label : undefined}
                    >
                      <item.icon className="w-4.5 h-4.5 shrink-0" />
                      {!isCollapsed && <span className="text-xs font-medium">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Bottom User Card */}
        <div className="p-4 border-t border-white/10 bg-black/20">
          <button
            onClick={() => navigate('/app/profile')}
            className={`w-full flex items-center rounded-2xl bg-white/5 hover:bg-white/10 transition-all border border-white/5 text-left cursor-pointer ${
              isCollapsed ? 'justify-center p-2' : 'p-3 gap-3'
            }`}
            title={isCollapsed ? `${user.name} - ${user.role}` : undefined}
          >
            {/* Avatar circle */}
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#FF6B00] to-[#FF8F3D] flex items-center justify-center font-bold text-white text-sm shrink-0 shadow">
              {user.name.charAt(0)}
            </div>

            {/* Profile info details (hidden in slim mode) */}
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-xs font-bold text-white truncate">{user.name}</p>
                <p className="text-[10px] text-white/50 truncate font-semibold">{user.role}</p>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Top Bar */}
      <div className={`${isMobileLayout ? 'fixed' : 'hidden'} top-0 left-0 right-0 glass border-b border-white/10 z-50 pt-[env(safe-area-inset-top)]`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-[#FF6B00] to-[#FF8F3D] p-2 rounded-lg">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-lg font-bold text-white">
              Brick<span className="text-[#FF6B00]">Brain</span>
            </h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white p-2"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Side Drawer Drawer */}
      {sidebarOpen && (
        <div
          className={`${isMobileLayout ? 'fixed' : 'hidden'} inset-0 bg-black/50 z-40`}
          onClick={() => setSidebarOpen(false)}
        >
          <div
            className="absolute top-16 left-0 right-0 bottom-0 glass border-r border-white/10 overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 space-y-6">
              {navSections.map((section) => (
                <div key={section.title} className="space-y-1">
                  <div className="text-[10px] font-bold text-[#FF8F3D]/70 uppercase tracking-widest px-3 pt-2 pb-1 select-none">
                    {section.title}
                  </div>
                  {section.items.map((item) => {
                    const active = isActive(item.path);
                    return (
                      <button
                        key={item.path}
                        onClick={() => {
                          navigate(item.path);
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                          active
                            ? 'bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white shadow-md shadow-[#FF6B00]/25'
                            : 'text-white/70 hover:bg-white/5 hover:text-white'
                        }`}
                      >
                        <item.icon className="w-4.5 h-4.5" />
                        <span className="text-xs font-medium">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main 
        className={`transition-all duration-300 ${
          isMobileLayout 
            ? 'ml-0 pt-[calc(4rem+env(safe-area-inset-top))] pb-[calc(5.5rem+env(safe-area-inset-bottom))] flex-1 overflow-y-auto' 
            : isCollapsed ? 'ml-20 pt-0 pb-0' : 'ml-64 pt-0 pb-0'
        } relative z-0`}
      >
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className={`${isMobileLayout ? 'fixed' : 'hidden'} bottom-0 left-0 right-0 glass border-t border-white/10 z-50 pb-[env(safe-area-inset-bottom)]`}>
        <div className="grid grid-cols-4 gap-1 p-2">
          {[
            { path: '/app/dashboard', icon: LayoutDashboard, label: 'Home' },
            { path: '/app/estimate', icon: Calculator, label: 'Estimate' },
            { path: '/app/3d-house', icon: Boxes, label: '3D' },
            { path: '/app/profile', icon: User, label: 'Profile' },
          ].map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 py-2 rounded-lg transition-all ${
                isActive(item.path)
                  ? 'text-[#FF6B00]'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Cookie Consent Banner */}
      {showCookies && (
        <div className="fixed bottom-24 lg:bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-lg z-50 animate-slide-up">
          <div className="glass rounded-3xl p-5 border border-white/10 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#0a1329]/90 backdrop-blur-lg">
            <div className="flex-1 space-y-1.5 text-left">
              <p className="text-white font-bold text-sm flex items-center gap-1.5">
                🍪 Cookie & Privacy Policy
              </p>
              <p className="text-white/60 text-xs leading-relaxed">
                We use cookies to sync your local data, secure your session, and personalize construction analytics. Read our{' '}
                <button
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-[#FF6B00] hover:underline font-semibold"
                >
                  Privacy Policy
                </button>
                .
              </p>
            </div>
            <div className="flex gap-2 shrink-0 self-end md:self-auto">
              <button
                onClick={() => handleCookieConsent(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold border border-white/10 text-white/70 hover:bg-white/5 transition-all cursor-pointer"
              >
                Decline
              </button>
              <button
                onClick={() => handleCookieConsent(true)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white hover:shadow-lg hover:shadow-[#FF6B00]/30 transition-all cursor-pointer border border-transparent"
              >
                Accept All
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="glass rounded-3xl w-full max-w-xl p-6 border border-white/10 bg-[#0B1F3A] shadow-2xl flex flex-col max-h-[80vh]">
            <div className="flex justify-between items-center pb-4 border-b border-white/10 shrink-0">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                🔒 Privacy & Cookie Policy
              </h3>
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="text-white/50 hover:text-white text-xl p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-4 text-sm text-white/70 scrollbar-thin pr-1 text-left">
              <div>
                <h4 className="text-white font-semibold mb-1">1. How We Use Cookies</h4>
                <p className="leading-relaxed text-xs">
                  We use necessary cookies and local storage tokens to preserve your login session (via secure JWT credentials) and cache construction project data offline so you can build estimates without network drops.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-1">2. Local Storage & Local Database Sync</h4>
                <p className="leading-relaxed text-xs">
                  Your project portfolio, estimations, expenses, and milestones are periodically synced from the client side to our secure backend database or cached locally on your device's memory for Capacitor builds.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-1">3. Data Protection Policy</h4>
                <p className="leading-relaxed text-xs">
                  BrickBrain does not share, rent, or sell your account metadata or site photo records to third parties. All sensitive passwords stored in local database fallbacks are protected via scrypt verification hash algorithms.
                </p>
              </div>

              <div>
                <h4 className="text-white font-semibold mb-1">4. Your Control Over Data</h4>
                <p className="leading-relaxed text-xs">
                  You can decline optional tracking cookies. Note that declining cookies will not disable essential storage requirements needed to maintain your active account session. You can request account deletion by contacting support.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 shrink-0 flex justify-end">
              <button
                onClick={() => setShowPrivacyModal(false)}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-5 py-2.5 rounded-xl text-xs font-semibold hover:shadow-lg transition-all cursor-pointer"
              >
                Close & Return
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background relative">
      {renderAppContent()}
    </div>
  );
}
