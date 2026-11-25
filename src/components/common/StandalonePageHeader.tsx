import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ArrowLeft, LogIn, LogOut } from 'lucide-react';

interface StandalonePageHeaderProps {
  pageTitle: string;
  maxWidthClass?: string;
}

export const StandalonePageHeader: React.FC<StandalonePageHeaderProps> = ({
  pageTitle,
  maxWidthClass = 'max-w-[1200px]'
}) => {
  const { user, isLoggedIn, logout, openAuthModal } = useApp();
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!avatarMenuOpen) return;
    const handleOutsideClick = (e: MouseEvent) => {
      if (avatarMenuRef.current && !avatarMenuRef.current.contains(e.target as Node)) {
        setAvatarMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [avatarMenuOpen]);

  const homeUrl = typeof window !== 'undefined' ? window.location.pathname || '/' : '/';

  return (
    <header className="sticky top-0 z-40 h-16 w-full bg-[#FFFFFF] border-b border-[#EAEAEA] select-none">
      <div
        className={`w-full ${maxWidthClass} h-full mx-auto px-6 sm:px-8 flex items-center justify-between gap-4`}
      >
        {/* 左侧：Logo + | + 页面名 */}
        <div className="flex items-center gap-3.5 min-w-0">
          <a
            href={homeUrl}
            className="flex items-center shrink-0 hover:opacity-85 transition-opacity"
          >
            <img
              src="/assets/aistudio/ea682d94c6d331b5596968167ea7f0f1_7d972a6f.png"
              alt="XCTF AI"
              className="h-7 sm:h-8 w-auto object-contain"
            />
          </a>
          <span className="text-[#EAEAEA] text-lg font-light select-none" aria-hidden="true">
            |
          </span>
          <span className="text-[14px] font-medium text-[#1A1A1A] tracking-tight truncate">
            {pageTitle}
          </span>
        </div>

        {/* 右侧：← 返回主站 + 圆形用户头像（点击弹出包含退出登录的菜单） */}
        <div className="flex items-center gap-5 shrink-0">
          <a
            href={homeUrl}
            className="text-[13px] font-medium text-[#666666] hover:text-[#1A1A1A] inline-flex items-center gap-1.5 transition-colors whitespace-nowrap"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.75} />
            <span>返回主站</span>
          </a>

          <div ref={avatarMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setAvatarMenuOpen((prev) => !prev)}
              aria-label="用户菜单"
              className="w-8 h-8 rounded-full overflow-hidden border border-[#EAEAEA] hover:border-[#999999] transition-colors cursor-pointer flex items-center justify-center bg-[#F9F9F8]"
            >
              {isLoggedIn && user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[12px] font-semibold text-[#1A1A1A]">
                  {isLoggedIn ? user.name.slice(0, 1) : '客'}
                </span>
              )}
            </button>

            {avatarMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] py-1.5 z-50">
                {isLoggedIn ? (
                  <>
                    <div className="px-3.5 py-2 border-b border-[#EAEAEA]">
                      <div className="text-[13px] font-semibold text-[#1A1A1A] truncate">
                        {user.name}
                      </div>
                      <div className="text-[11px] text-[#999999] truncate mt-0.5">
                        {user.identityTag || 'AI 认证开发者'}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setAvatarMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3.5 py-2 text-left text-[13px] text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F9F9F8] flex items-center gap-2 transition-colors cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" strokeWidth={1.6} />
                      <span>退出登录</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setAvatarMenuOpen(false);
                      openAuthModal('login');
                    }}
                    className="w-full px-3.5 py-2 text-left text-[13px] text-[#1A1A1A] hover:bg-[#F9F9F8] flex items-center gap-2 transition-colors cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5" strokeWidth={1.6} />
                    <span>立即登录</span>
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
