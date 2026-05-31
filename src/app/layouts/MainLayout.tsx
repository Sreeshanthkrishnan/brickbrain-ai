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
      { path: '/app/subscription', label: 'Subscription Plans', icon: Subscription },
      { path: '/app/notifications', label: 'Notifications', icon: Bell },
      { path: '/app/support', label: 'Customer Support', icon: MessageCircle },
      { path: '/app/faq', label: 'FAQs & Help', icon: HelpCircle },
      { path: '/app/about', label: 'About BrickBrain', icon: Info }
    ]
  }
];

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#0B1F3A] relative">
      <div className="absolute inset-0 pb-20 lg:pb-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00] rounded-full opacity-5 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#FF6B00] rounded-full opacity-5 blur-3xl"></div>
      </div>

      {/* Desktop Sidebar */}
      <div 
        className={`hidden lg:flex flex-col justify-between fixed left-0 top-0 h-full glass border-r border-white/10 z-40 transition-all duration-300 ${
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
      <div className="lg:hidden fixed top-0 left-0 right-0 glass border-b border-white/10 z-50">
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
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
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
          isCollapsed ? 'lg:ml-20' : 'lg:ml-64'
        } pt-16 lg:pt-0 pb-20 lg:pb-0 relative z-0`}
      >
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 glass border-t border-white/10 z-50">
        <div className="grid grid-cols-5 gap-1 p-2">
          {[
            { path: '/app/dashboard', icon: LayoutDashboard, label: 'Home' },
            { path: '/app/estimate', icon: Calculator, label: 'Estimate' },
            { path: '/app/3d-house', icon: Boxes, label: '3D' },
            { path: '/app/notifications', icon: Bell, label: 'Alerts' },
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
    </div>
  );
}
