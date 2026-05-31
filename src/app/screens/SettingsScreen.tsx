import { useApp } from '../context/AppContext';
import { Settings, Moon, Sun, Globe, Bell, DollarSign } from 'lucide-react';

export default function SettingsScreen() {
  const { settings, updateSettings } = useApp();

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-2">
            <Settings className="w-8 h-8 text-[#FF6B00]" />
            Settings
          </h1>
          <p className="text-white/70 mt-1">Manage your app preferences</p>
        </div>

        <div className="glass rounded-3xl p-6 space-y-6">
          {/* Appearance */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Appearance</h2>
            <div className="glass rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {settings.darkMode ? (
                  <Moon className="w-6 h-6 text-[#FF6B00]" />
                ) : (
                  <Sun className="w-6 h-6 text-[#FF6B00]" />
                )}
                <div>
                  <p className="text-white font-medium">Theme Mode</p>
                  <p className="text-white/60 text-sm">
                    {settings.darkMode ? 'Dark mode enabled' : 'Light mode enabled'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => updateSettings({ darkMode: !settings.darkMode })}
                className="bg-gradient-to-r from-[#FF6B00] to-[#FF8F3D] text-white px-5 py-2 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-[#FF6B00]/30 transition-all"
              >
                Toggle Mode
              </button>
            </div>
          </div>

          {/* Localization */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Localization</h2>
            <div className="space-y-3">
              <div className="glass rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Globe className="w-6 h-6 text-[#FF6B00]" />
                  <div>
                    <p className="text-white font-medium">Language</p>
                    <p className="text-white/60 text-sm">{settings.language}</p>
                  </div>
                </div>
                <select
                  value={settings.language}
                  onChange={(e) => updateSettings({ language: e.target.value })}
                  className="bg-[#0b1329] text-white border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिन्दी (Hindi)</option>
                  <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                  <option value="Spanish">Español (Spanish)</option>
                </select>
              </div>

              <div className="glass rounded-xl p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-[#FF6B00]" />
                  <div>
                    <p className="text-white font-medium">Currency</p>
                    <p className="text-white/60 text-sm">
                      {settings.currency === 'INR' && 'Indian Rupee (₹)'}
                      {settings.currency === 'USD' && 'US Dollar ($)'}
                      {settings.currency === 'EUR' && 'Euro (€)'}
                    </p>
                  </div>
                </div>
                <select
                  value={settings.currency}
                  onChange={(e) => updateSettings({ currency: e.target.value as 'INR' | 'USD' | 'EUR' })}
                  className="bg-[#0b1329] text-white border border-white/10 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-[#FF6B00] transition-colors"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div>
            <h2 className="text-xl font-bold text-white mb-4">Notifications</h2>
            <div className="glass rounded-xl p-5">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <Bell className="w-6 h-6 text-[#FF6B00]" />
                  <div>
                    <p className="text-white font-medium">Push Notifications</p>
                    <p className="text-white/60 text-sm">Receive alerts and updates</p>
                  </div>
                </div>
                <button
                  onClick={() => updateSettings({ notificationsEnabled: !settings.notificationsEnabled })}
                  className={`w-12 h-6 rounded-full relative transition-colors ${
                    settings.notificationsEnabled ? 'bg-[#FF6B00]' : 'bg-white/10'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                      settings.notificationsEnabled ? 'right-1' : 'left-1'
                    }`}
                  ></div>
                </button>
              </div>

              {settings.notificationsEnabled && (
                <div className="space-y-3 ml-9">
                  {['Price Alerts', 'Milestone Updates', 'Payment Reminders', 'AI Recommendations'].map((item) => (
                    <div key={item} className="flex items-center justify-between py-2">
                      <p className="text-white/70 text-sm">{item}</p>
                      <button className="w-10 h-5 bg-[#FF6B00] rounded-full relative">
                        <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
