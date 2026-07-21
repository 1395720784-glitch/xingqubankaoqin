import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, ClipboardCheck, FileText, Menu, X, Download, Share2 } from 'lucide-react';
import { useState, useEffect } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: '工作台' },
  { to: '/students', icon: Users, label: '学生管理' },
  { to: '/attendance', icon: ClipboardCheck, label: '上课打卡' },
  { to: '/records', icon: FileText, label: '考勤记录' },
];

export default function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // 检测 iOS
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream);

    // 监听 PWA 安装事件（Android/Chrome）
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);

    // 检查是否已经安装
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallBanner(false);
    }

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!installPrompt) return;
    installPrompt.prompt();
    const result = await installPrompt.userChoice;
    if (result.outcome === 'accepted') {
      setShowInstallBanner(false);
    }
    setInstallPrompt(null);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 via-white to-rose-50">
      <aside className="hidden lg:flex flex-col w-56 bg-white border-r border-slate-200 shadow-sm">
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">舞</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-800 leading-tight">舞蹈班管理</h1>
            <p className="text-[10px] text-slate-400">学员计费考勤</p>
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-rose-50 text-rose-600 shadow-sm'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }`
              }
            >
              <item.icon className="w-4.5 h-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
            <span className="text-white text-xs font-bold">舞</span>
          </div>
          <span className="text-sm font-bold text-slate-800">舞蹈班管理</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="p-1.5 rounded-lg hover:bg-slate-100">
          {mobileOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-30">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-14 left-0 right-0 bg-white border-b border-slate-200 shadow-lg p-3">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive ? 'bg-rose-50 text-rose-600' : 'text-slate-500 hover:bg-slate-50'
                    }`
                  }
                >
                  <item.icon className="w-4.5 h-4.5" />
                  {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>
      )}

      <main className="flex-1 overflow-auto lg:pt-0 pt-14">
        <div className="max-w-6xl mx-auto p-4 lg:p-6">{children}</div>
      </main>

      {showInstallBanner && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg px-4 py-3 safe-bottom">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                <Download className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">添加到主屏幕</p>
                <p className="text-xs text-slate-400">
                  {isIOS ? '点分享按钮 → 添加到主屏幕' : '像 App 一样使用，无需每次打开浏览器'}
                </p>
              </div>
            </div>
            {isIOS ? (
              <div className="flex items-center gap-1 text-rose-500 text-xs font-medium">
                <Share2 className="w-4 h-4" />
                <span>分享</span>
              </div>
            ) : (
              <button
                onClick={handleInstall}
                className="px-4 py-2 bg-gradient-to-r from-rose-400 to-pink-500 text-white rounded-xl text-sm font-medium hover:shadow-lg transition-all whitespace-nowrap"
              >
                一键安装
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}