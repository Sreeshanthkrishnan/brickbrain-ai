import { Bell, AlertTriangle, CheckCircle, Info, Sun, CloudRain, CloudSun, Thermometer, Droplets } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function NotificationsScreen() {
  const { notifications, clearNotifications, markNotificationRead } = useApp();

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      default: return Info;
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  // Mock Weather Data for construction planning
  const weatherData = {
    temp: '28°C',
    humidity: '82%',
    condition: 'Intermittent Showers',
    wind: '14 km/h',
    advisory: 'Advisory: High moisture and rain forecast. Avoid external wall plastering and keep open cement bag stacks covered with heavy tarps.',
    forecast: [
      { day: 'Tomorrow', temp: '29°C', condition: 'Cloudy', icon: CloudSun },
      { day: 'Mon, Jun 1', temp: '26°C', condition: 'Heavy Rain', icon: CloudRain },
      { day: 'Tue, Jun 2', temp: '32°C', condition: 'Sunny', icon: Sun }
    ]
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-2">
              <Bell className="w-8 h-8 text-[#FF6B00]" />
              Notifications & Weather
            </h1>
            <p className="text-white/70 mt-1">Stay updated with AI alerts, reminders, and daily weather reports</p>
          </div>
          {notifications.length > 0 && (
            <button
              onClick={clearNotifications}
              className="text-[#FF6B00] text-sm font-medium hover:underline cursor-pointer"
            >
              Clear all
            </button>
          )}
        </div>

        {/* WEATHER CONDITIONS CARD */}
        <div className="glass rounded-3xl p-6 border border-white/10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            {/* Left Section: Live Weather */}
            <div className="flex items-center gap-5">
              <div className="bg-blue-500/20 p-4 rounded-2xl flex items-center justify-center text-blue-400">
                <CloudRain className="w-10 h-10 animate-bounce" />
              </div>
              <div>
                <p className="text-white/50 text-xs font-semibold uppercase tracking-wider">Live Weather Status</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-extrabold text-white">{weatherData.temp}</span>
                  <span className="text-white/80 text-sm font-medium">{weatherData.condition}</span>
                </div>
                <div className="flex gap-4 mt-1.5 text-xs text-white/60">
                  <span className="flex items-center gap-1"><Thermometer className="w-3.5 h-3.5" /> Feels like 30°</span>
                  <span className="flex items-center gap-1"><Droplets className="w-3.5 h-3.5" /> Humidity: {weatherData.humidity}</span>
                </div>
              </div>
            </div>

            {/* Right Section: 3-Day Forecast */}
            <div className="flex items-center gap-4 bg-white/5 border border-white/5 rounded-2xl p-4 flex-wrap">
              {weatherData.forecast.map((fc, i) => {
                const IconComponent = fc.icon;
                return (
                  <div key={i} className="text-center px-3 border-r last:border-0 border-white/10">
                    <p className="text-white/50 text-[10px] uppercase font-semibold">{fc.day}</p>
                    <IconComponent className="w-5 h-5 mx-auto my-1.5 text-[#FF8F3D]" />
                    <p className="text-white font-bold text-xs">{fc.temp}</p>
                    <p className="text-white/40 text-[9px]">{fc.condition}</p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Construction Advisory Alert Box */}
          <div className="mt-5 bg-yellow-500/10 border border-yellow-500/25 rounded-2xl p-4 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-yellow-400 font-semibold text-sm">Construction Feasibility Advisory</p>
              <p className="text-white/80 text-xs mt-1 leading-relaxed">{weatherData.advisory}</p>
            </div>
          </div>
        </div>

        {/* Unread count display */}
        <div className="glass rounded-2xl p-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#FF6B00]/20 p-3 rounded-xl">
              <Bell className="w-6 h-6 text-[#FF6B00]" />
            </div>
            <div>
              <p className="text-white font-semibold">{unreadCount} New Notifications</p>
              <p className="text-white/60 text-sm">{notifications.length} notifications total</p>
            </div>
          </div>
        </div>

        {/* Notification feed */}
        <div className="glass rounded-3xl p-6">
          <h2 className="text-xl font-bold text-white mb-6">Recent Alerts</h2>

          <div className="space-y-3">
            {notifications.map((notif) => {
              const IconComponent = getIcon(notif.type);
              const isWarning = notif.type === 'warning';
              const isSuccess = notif.type === 'success';
              const iconColorClass = isWarning ? 'text-[#FF8F3D]' : isSuccess ? 'text-green-400' : 'text-blue-400';
              const bgColorClass = isWarning ? 'bg-[#FF6B00]/20' : isSuccess ? 'bg-green-500/20' : 'bg-blue-500/20';

              return (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`glass rounded-xl p-5 hover:bg-white/5 transition-all cursor-pointer relative overflow-hidden ${
                    !notif.read ? 'border-l-4 border-[#FF6B00]' : ''
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${bgColorClass}`}>
                      <IconComponent className={`w-5 h-5 ${iconColorClass}`} />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <h3 className="text-white font-semibold">
                          {notif.type === 'warning' ? 'AI Weather Alert' : notif.type === 'success' ? 'Task Completed' : 'AI Insight'}
                        </h3>
                        <span className="text-white/50 text-xs whitespace-nowrap ml-4">{notif.time}</span>
                      </div>
                      <p className="text-white/70 text-sm leading-relaxed">{notif.message}</p>
                    </div>
                  </div>
                </div>
              );
            })}
            {notifications.length === 0 && (
              <div className="text-center py-12 text-white/50">
                <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p>No new notifications</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
