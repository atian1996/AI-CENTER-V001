import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MainTabType, AppNotification } from '../../types';
import { 
  Search, 
  Bell, 
  Coins, 
  User, 
  LayoutDashboard, 
  Settings, 
  LogOut, 
  Sparkles, 
  CheckCheck,
  ChevronDown,
  Bot,
  Store,
  Briefcase,
  Cpu,
  Trophy,
  Users,
  Wallet,
  ShieldCheck,
  Gift,
  ArrowRight,
  Share2
} from 'lucide-react';

export const Header: React.FC = () => {
  const { 
    activeTab, 
    setActiveTab, 
    setSearchOpen, 
    user, 
    isLoggedIn,
    logout,
    openAuthModal,
    openInviteModal,
    notifications, 
    unreadCount, 
    markAllNotificationsRead,
    markNotificationsAsRead,
    openRechargeModal,
    setWorkspaceSubTab,
    enterAdminMode,
    showToast
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [popupNotifications, setPopupNotifications] = useState<AppNotification[]>([]);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleToggleNotif = () => {
    if (!notifOpen) {
      // 获取最多3条最新未读通知（按时间倒序）
      const unreads = notifications.filter(n => !n.read).slice(0, 3);
      setPopupNotifications(unreads);
      
      // 打开popup后立即标记这最多3条未读通知为已读
      if (unreads.length > 0) {
        const unreadIds = unreads.map(n => n.id);
        markNotificationsAsRead(unreadIds);
      }
    }
    setNotifOpen(prev => !prev);
  };

  const navItems: { id: MainTabType; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: '首页', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'marketplace', label: 'AI集市', icon: <Store className="w-4 h-4" /> },
    { id: 'tasks', label: '任务大厅', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'compute', label: '算力工坊', icon: <Cpu className="w-4 h-4" /> },
    { id: 'creative', label: '赛事中心', icon: <Trophy className="w-4 h-4" /> },
    { id: 'community', label: '社区', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 border-b border-slate-200/80 backdrop-blur-md shadow-sm select-none">
      <div className="w-full max-w-[1920px] mx-auto px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Left: Brand Logo */}
        <div 
          onClick={() => setActiveTab('home')}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 p-0.5 shadow-md shadow-indigo-100 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white rounded-[10px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <div className="text-lg font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 font-sans">
              AI运营中心
            </div>
            <div className="text-[10px] text-indigo-600/90 font-mono tracking-widest uppercase font-bold">
              AI OPERATIONS CENTER
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80">
          {navItems.map(item => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 ${
                  isActive
                    ? 'text-white bg-indigo-600 shadow-md shadow-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls Area */}
        <div className="flex items-center gap-3 shrink-0">
          {!isLoggedIn ? (
            /* ========================================================
               游客未登录态：立即注册放在右上角 + 送20体验金视觉呈现
               ======================================================== */
            <div className="flex items-center gap-2 sm:gap-2.5">

              {/* 登录按钮 */}
              <button
                onClick={() => openAuthModal('login')}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-indigo-600 hover:bg-slate-100/90 transition cursor-pointer select-none"
              >
                登录
              </button>

              {/* 立即注册高亮按钮（带专属送¥20角标徽章与微光晕） */}
              <div className="relative group cursor-pointer select-none" onClick={() => openAuthModal('register')}>
                {/* 环绕外溢柔和光晕 */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-400 via-rose-500 to-indigo-600 rounded-xl blur-[3px] opacity-70 group-hover:opacity-100 transition duration-300 animate-pulse" />
                
                {/* 顶置小气泡徽标 (送¥20体验金) */}
                <div className="absolute -top-2.5 -right-1 z-10 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-mono font-black text-[9px] shadow-sm border border-white flex items-center gap-0.5 animate-bounce">
                  <span>送¥20</span>
                </div>

                <button className="relative flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-violet-600 text-white font-black text-xs shadow-md transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>立即注册</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            /* ========================================================
               已注册登录态：积分栏 + 通知 + 工作台 + 正常头像用户名栏
               ======================================================== */
            <>
              {/* Points Balance Button */}
              <button
                onClick={() => {
                  setActiveTab('workspace');
                  setWorkspaceSubTab('points');
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 text-xs font-bold transition cursor-pointer shadow-xs"
                title="点击前往我的账户"
              >
                <Coins className="w-4 h-4 text-amber-500 animate-pulse" />
                <span>{user.points.toLocaleString()} 积分</span>
              </button>

              {/* Notifications Dropdown (Bell Icon) */}
              <div className="relative">
                <button
                  onClick={handleToggleNotif}
                  className="relative p-2 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-600 hover:text-slate-900 transition cursor-pointer"
                  title="通知中心"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Popover */}
                {notifOpen && (
                  <div 
                    className="absolute right-0 mt-3 w-84 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50 animate-fade-in"
                    onClick={() => {
                      const unreadIds = popupNotifications.filter(n => !n.read).map(n => n.id);
                      if (unreadIds.length > 0) {
                        markNotificationsAsRead(unreadIds);
                      }
                    }}
                  >
                    <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
                      <div className="text-xs font-bold text-slate-800 flex items-center gap-2">
                        <Bell className="w-3.5 h-3.5 text-indigo-600" />
                        <span>未读通知提醒</span>
                      </div>
                      <span className="text-[11px] text-slate-400 font-medium">
                        已自动标记已读
                      </span>
                    </div>

                    <div className="max-h-88 overflow-y-auto divide-y divide-slate-100">
                      {popupNotifications.length > 0 ? (
                        popupNotifications.map(n => (
                          <div
                            key={n.id}
                            className="p-3.5 text-xs transition bg-indigo-50/20 hover:bg-slate-50"
                          >
                            <div className="flex items-center justify-between text-slate-800 font-bold mb-1">
                              <span className="truncate pr-2">{n.title}</span>
                              <span className="text-[10px] text-slate-400 font-normal shrink-0">{n.time}</span>
                            </div>
                            <div className="text-slate-600 leading-relaxed text-[11px]">
                              {n.content}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-1.5">
                          <CheckCheck className="w-6 h-6 text-slate-300" />
                          <span>暂无新的未读通知</span>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5 border-t border-slate-100 bg-slate-50 text-center">
                      <button
                        onClick={() => {
                          setActiveTab('workspace');
                          setWorkspaceSubTab('notifications');
                          setNotifOpen(false);
                        }}
                        className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center justify-center gap-1 w-full py-0.5 cursor-pointer"
                      >
                        前往通知中心查看全部 ({notifications.length}) →
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 显眼的工作台按钮 */}
              <button
                onClick={() => setActiveTab('workspace')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer shadow-sm ${
                  activeTab === 'workspace'
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-indigo-700 text-white ring-2 ring-indigo-400/60 shadow-indigo-200/80 scale-[1.02]'
                    : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/90 hover:border-indigo-300 hover:shadow-indigo-100/50'
                }`}
                title="进入个人与团队工作台"
              >
                <LayoutDashboard className={`w-4 h-4 ${activeTab === 'workspace' ? 'text-white' : 'text-indigo-600'}`} />
                <span>工作台</span>
                {activeTab !== 'workspace' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                )}
              </button>

              {/* User Profile Dropdown (正常头像与用户名栏) */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2.5 p-1 pr-2.5 rounded-xl bg-slate-100/90 hover:bg-slate-200/80 border border-slate-200 text-slate-800 transition cursor-pointer"
                >
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover ring-2 ring-indigo-500/30"
                  />
                  <span className="text-xs font-bold max-w-[90px] truncate">{user.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {/* User Menu Popover */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl p-2 z-50 animate-fade-in text-xs divide-y divide-slate-100 select-none">
                    <div className="p-2.5">
                      <div className="font-bold text-slate-900 text-sm">{user.name}</div>
                      <div className="text-indigo-600 font-bold text-[11px] mt-0.5">{user.levelBadge}</div>
                      <div className="text-slate-400 text-[10px] truncate mt-0.5">{user.email}</div>

                      {/* Balance & Points Card */}
                      <div className="mt-2.5 p-2.5 rounded-xl bg-slate-50/90 border border-slate-100 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Wallet className="w-3.5 h-3.5 text-indigo-600" />
                            <span className="text-[11px] font-medium">可用余额</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-slate-900 text-xs">¥{(user.balance ?? 128.00).toFixed(2)}</span>
                            <button
                              type="button"
                              onClick={() => {
                                openRechargeModal();
                                setUserMenuOpen(false);
                              }}
                              className="px-1.5 py-0.5 rounded bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[10px] transition cursor-pointer"
                            >
                              充值
                            </button>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-600">
                            <Coins className="w-3.5 h-3.5 text-amber-500" />
                            <span className="text-[11px] font-medium">账户积分</span>
                          </div>
                          <span className="font-extrabold text-amber-600 text-xs">{user.points.toLocaleString()} 分</span>
                        </div>
                      </div>
                    </div>

                    {/* 立即邀请好友功能入口 */}
                    <div className="py-1">
                      <button
                        onClick={() => {
                          openInviteModal();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50/80 hover:from-amber-100 hover:to-orange-100 border border-amber-200 text-amber-900 text-left transition font-bold shadow-2xs group cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
                            <Share2 className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-black text-amber-900 flex items-center gap-1">
                              <span>立即邀请好友</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                            </div>
                            <div className="text-[10px] text-amber-700 font-medium font-mono">
                              双方立得 ¥20 券 + 100 积分
                            </div>
                          </div>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-amber-200/80 text-amber-900 font-bold border border-amber-300">
                          领奖励
                        </span>
                      </button>
                    </div>

                    {/* 后台管理系统入口 */}
                    <div className="py-1">
                      <button
                        id="header-user-admin-btn"
                        onClick={() => {
                          enterAdminMode();
                          setUserMenuOpen(false);
                          showToast('已进入AI运营中心后台管理系统');
                        }}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-gradient-to-r from-slate-900 to-indigo-950 hover:from-slate-800 hover:to-indigo-900 text-white text-left transition font-bold shadow-xs my-0.5 cursor-pointer group"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-xs">后台管理</span>
                        </div>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-bold">ADMIN</span>
                      </button>
                    </div>

                    {/* 退出登录 */}
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          logout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-left transition font-bold cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-600" />
                        退出登录
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
};
