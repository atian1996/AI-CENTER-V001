import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Minimize2,
  Settings,
  X,
  Clock,
  Sparkles,
  Info,
  Tv,
  ArrowRight,
  Scaling,
  Monitor
} from 'lucide-react';
import {
  ScreencastSettings,
  ScreencastFitMode,
  getScreencastSettings,
  saveScreencastSettings
} from './screencastConfig';
import { ScreencastSettingsModal } from './ScreencastSettingsModal';

// Ecosystem tab components (v0.2 only)
import { EcoV2OverviewTab } from '../ecosystem/v2/EcoV2OverviewTab';
import { EcoV2IndustryTab } from '../ecosystem/v2/EcoV2IndustryTab';
import { EcoV2ActivitiesTab } from '../ecosystem/v2/EcoV2ActivitiesTab';
import { EcoV2LedgersTab } from '../ecosystem/v2/EcoV2LedgersTab';

// Compute Ops tab components
import { ComputeOpsOverviewTab } from '../compute-ops/ComputeOpsOverviewTab';
import { ComputeOpsReconciliationTab } from '../compute-ops/ComputeOpsReconciliationTab';
import { ComputeOpsRevenueTab } from '../compute-ops/ComputeOpsRevenueTab';
import { ComputeOpsCapacityAlertsTab } from '../compute-ops/ComputeOpsCapacityAlertsTab';
import { ComputeOpsClusterOnboardingTab } from '../compute-ops/ComputeOpsClusterOnboardingTab';
import { ComputeOpsInstanceDetailModal } from '../compute-ops/ComputeOpsInstanceDetailModal';

interface ScreencastPlayerViewProps {
  type: 'ecosystem' | 'compute-ops';
}

export const ScreencastPlayerView: React.FC<ScreencastPlayerViewProps> = ({ type }) => {
  // Load settings
  const [settings, setSettings] = useState<ScreencastSettings>(() => getScreencastSettings(type));
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const playerContainerRef = useRef<HTMLDivElement | null>(null);

  // 视口尺寸跟踪，为 1920*1080 大屏自适应提供动态换算比
  const [viewport, setViewport] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1920,
    height: typeof window !== 'undefined' ? window.innerHeight : 1080,
  });

  useEffect(() => {
    const handleResize = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 计算以 1920*1080 为基准的缩放系数
  const scaleX = viewport.width / 1920;
  const scaleY = viewport.height / 1080;
  const scaleContain = Math.min(scaleX, scaleY);

  // 快捷切换屏幕自适应模式
  const toggleFitMode = () => {
    const nextMode: ScreencastFitMode =
      settings.fitMode === 'fill' ? 'contain' : settings.fitMode === 'contain' ? 'fluid' : 'fill';
    const updated = { ...settings, fitMode: nextMode };
    setSettings(updated);
    saveScreencastSettings(type, updated);
  };

  // Enabled pages list
  const activePages = settings.pages.filter(p => p.enabled);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Play / Pause manual toggle
  const [isPausedManually, setIsPausedManually] = useState(false);

  // User activity tracking ("键鼠停止操作间隔多久后继续轮播")
  const [isUserActive, setIsUserActive] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Timer countdown progress (0 to 100%)
  const [progressPercent, setProgressPercent] = useState(0);
  const progressTimerRef = useRef<NodeJS.Timeout | null>(null);

  // UI HUD visibility
  const [showHud, setShowHud] = useState(true);
  const hudHideTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initial welcome toast
  const [showWelcome, setShowWelcome] = useState(true);

  // Modal states for Compute Ops drilldowns
  const [selectedInstance, setSelectedInstance] = useState<any | null>(null);

  // Any modal open? If modal is open, rotation should pause
  const isAnyModalOpen = Boolean(selectedInstance || isSettingsOpen);

  // Safe current index clamp
  const safeIndex = activePages.length > 0 ? (currentIndex % activePages.length + activePages.length) % activePages.length : 0;
  const currentPage = activePages[safeIndex] || null;

  // Listen to cross-window or local settings updates
  useEffect(() => {
    const handleSettingsUpdate = (e: any) => {
      if (e.detail?.type === type && e.detail?.settings) {
        setSettings(e.detail.settings);
      }
    };
    window.addEventListener('screencast-settings-updated', handleSettingsUpdate);
    return () => {
      window.removeEventListener('screencast-settings-updated', handleSettingsUpdate);
    };
  }, [type]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Dismiss welcome banner after 4.5s
  useEffect(() => {
    const timer = setTimeout(() => setShowWelcome(false), 4500);
    return () => clearTimeout(timer);
  }, []);

  // Page switching functions
  const goToNextPage = useCallback(() => {
    if (activePages.length <= 1) return;
    setCurrentIndex(prev => (prev + 1) % activePages.length);
    setProgressPercent(0);
  }, [activePages.length]);

  const goToPrevPage = useCallback(() => {
    if (activePages.length <= 1) return;
    setCurrentIndex(prev => (prev - 1 + activePages.length) % activePages.length);
    setProgressPercent(0);
  }, [activePages.length]);

  // Keyboard navigation: ArrowLeft / ArrowRight / A / D / Space / F
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        goToPrevPage();
      } else if (e.key === ' ') {
        e.preventDefault();
        setIsPausedManually(prev => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        e.preventDefault();
        toggleFullScreen();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNextPage, goToPrevPage]);

  // Mouse & key interaction detection with configurable idleResumeDelay
  const handleUserActivity = useCallback(() => {
    setShowHud(true);
    setIsUserActive(true);

    // Reset HUD hide timer (dims controls after 3.5s)
    if (hudHideTimerRef.current) clearTimeout(hudHideTimerRef.current);
    hudHideTimerRef.current = setTimeout(() => {
      setShowHud(false);
    }, 3500);

    // Reset idle resume timer
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    const delayMs = (settings.idleResumeDelay || 5) * 1000;
    idleTimerRef.current = setTimeout(() => {
      setIsUserActive(false);
    }, delayMs);
  }, [settings.idleResumeDelay]);

  useEffect(() => {
    const events = ['mousemove', 'mousedown', 'keydown', 'wheel', 'touchstart'];
    events.forEach(evt => window.addEventListener(evt, handleUserActivity, { passive: true }));
    return () => {
      events.forEach(evt => window.removeEventListener(evt, handleUserActivity));
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (hudHideTimerRef.current) clearTimeout(hudHideTimerRef.current);
    };
  }, [handleUserActivity]);

  // Auto-rotation timer mechanism
  useEffect(() => {
    // If not autoRotate, paused manually, user is actively interacting, or modal open: don't tick
    const isPaused = !settings.autoRotate || isPausedManually || isUserActive || isAnyModalOpen;

    if (isPaused || activePages.length <= 1) {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
      return;
    }

    const intervalSec = Math.max(settings.interval || 5, 2);
    const tickMs = 100; // update 10 times per second for smooth progress
    const increment = (tickMs / (intervalSec * 1000)) * 100;

    progressTimerRef.current = setInterval(() => {
      setProgressPercent(prev => {
        const next = prev + increment;
        if (next >= 100) {
          goToNextPage();
          return 0;
        }
        return next;
      });
    }, tickMs);

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [settings.autoRotate, settings.interval, isPausedManually, isUserActive, isAnyModalOpen, activePages.length, goToNextPage]);

  // Fullscreen toggle
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => {
          console.error('Exit fullscreen failed:', err);
        });
      }
    }
  };

  const isRotationPaused = !settings.autoRotate || isPausedManually || isUserActive || isAnyModalOpen;

  return (
    <div
      ref={playerContainerRef}
      className={`relative w-screen h-screen overflow-hidden bg-[#0a0f1d] text-slate-100 flex items-center justify-center font-sans select-none selection:bg-blue-600 selection:text-white ${
        settings.fitMode === 'fluid' ? 'min-h-screen overflow-y-auto block' : ''
      }`}
      onMouseMove={handleUserActivity}
      onClick={handleUserActivity}
      onKeyDown={handleUserActivity}
    >
      
      {/* 顶部微型轮播进度条 (自动轮播时动态填充) */}
      {settings.autoRotate && activePages.length > 1 && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-slate-900/60 z-50">
          <div
            className={`h-full transition-all duration-100 ease-linear ${
              isRotationPaused
                ? 'bg-amber-400 opacity-60'
                : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      )}

      {/* 欢迎与快捷键操作指引浮层 */}
      {showWelcome && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl bg-slate-900/95 border border-indigo-500/40 text-xs text-white shadow-2xl backdrop-blur-md flex items-center gap-3 animate-fadeIn">
          <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
            <Tv className="w-3.5 h-3.5" />
          </div>
          <div className="space-y-0.5">
            <span className="font-bold flex items-center gap-1.5 text-indigo-300">
              已进入【{type === 'ecosystem' ? 'AI生态看板' : '算力运营中心'}】投屏全屏大屏演示
            </span>
            <span className="text-[11px] text-slate-300">
              快捷键：【← / →】或【A / D】翻页 |【空格】暂停 |【F】全屏放映
            </span>
          </div>
          <button
            onClick={() => setShowWelcome(false)}
            className="ml-2 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 悬浮控制工具栏 HUD (无操作时微暗淡，鼠标移动时点亮) */}
      <div
        className={`fixed top-3 right-4 z-40 transition-all duration-300 ${
          showHud ? 'opacity-100 translate-y-0' : 'opacity-25 hover:opacity-100 translate-y-0'
        }`}
      >
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900/90 border border-slate-700/80 shadow-2xl backdrop-blur-xl text-xs">
          
          {/* 页码与当前页面名 */}
          <div className="px-3 py-1 rounded-xl bg-slate-950/80 border border-slate-800 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono font-bold text-indigo-300 text-xs">
              {safeIndex + 1} / {activePages.length}
            </span>
            <span className="font-bold text-white text-xs max-w-[120px] truncate">
              {currentPage?.label?.replace(/^\d+\.\s*/, '')}
            </span>
          </div>

          {/* 状态徽标：倒计时或暂停状态 */}
          {settings.autoRotate && (
            <div
              className={`px-2.5 py-1 rounded-xl border flex items-center gap-1.5 font-mono text-[11px] font-bold ${
                isRotationPaused
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              }`}
            >
              <Clock className="w-3 h-3" />
              <span>
                {isAnyModalOpen
                  ? '弹窗开启·暂停'
                  : isUserActive
                  ? '交互中·暂停'
                  : isPausedManually
                  ? '已暂停'
                  : `${Math.ceil(((100 - progressPercent) / 100) * settings.interval)}s`}
              </span>
            </div>
          )}

          {/* 上一页 */}
          <button
            onClick={goToPrevPage}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="上一页 (快捷键: ← 或 A)"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* 暂停 / 播放 (仅在开启自动轮播时可用) */}
          {settings.autoRotate && (
            <button
              onClick={() => setIsPausedManually(prev => !prev)}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title={isPausedManually ? '恢复自动轮播 (快捷键: 空格)' : '暂停自动轮播 (快捷键: 空格)'}
            >
              {isPausedManually ? (
                <Play className="w-4 h-4 text-emerald-400" />
              ) : (
                <Pause className="w-4 h-4 text-amber-400" />
              )}
            </button>
          )}

          {/* 下一页 */}
          <button
            onClick={goToNextPage}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="下一页 (快捷键: → 或 D)"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-slate-800 my-auto" />

          {/* 自适应模式切换按钮 */}
          <button
            onClick={toggleFitMode}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer flex items-center gap-1.5"
            title={`当前屏幕自适应：${settings.fitMode === 'fill' ? '铺满全屏 (1920*1080 零黑边)' : settings.fitMode === 'contain' ? '等比居中 (16:9 比例)' : '流式排版'} (点击切换)`}
          >
            <Scaling className="w-4 h-4 text-cyan-400" />
            <span className="text-[10px] font-bold hidden xl:inline text-cyan-300">
              {settings.fitMode === 'fill' ? '1920*1080满屏' : settings.fitMode === 'contain' ? '16:9等比' : '流式排版'}
            </span>
          </button>

          {/* 投屏设置按钮 */}
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title="投屏播放设置"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* 全屏切换 */}
          <button
            onClick={toggleFullScreen}
            className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            title={isFullScreen ? '退出浏览器全屏 (快捷键: F)' : '进入浏览器全屏 (快捷键: F)'}
          >
            {isFullScreen ? (
              <Minimize2 className="w-4 h-4 text-blue-400" />
            ) : (
              <Maximize2 className="w-4 h-4 text-blue-400" />
            )}
          </button>

          {/* 关闭/退出投屏 */}
          <button
            onClick={() => {
              if (window.opener) {
                window.close();
              } else {
                window.location.search = '';
              }
            }}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
            title="退出投屏窗口"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 投屏核心内容展示区 (按 1920*1080 标准大屏进行自适应缩放与铺满) */}
      <main
        className={`w-full h-full flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
          settings.fitMode === 'fluid' ? 'p-4 lg:p-6 block overflow-y-auto min-h-screen' : ''
        }`}
      >
        <div
          className={`shrink-0 overflow-hidden bg-[#0a0f1d] flex flex-col justify-between ${
            settings.fitMode === 'fluid'
              ? 'w-full min-h-full'
              : 'w-[1920px] h-[1080px] p-5 shadow-2xl relative'
          }`}
          style={
            settings.fitMode === 'fluid'
              ? undefined
              : {
                  width: 1920,
                  height: 1080,
                  transform:
                    settings.fitMode === 'contain'
                      ? `scale(${scaleContain})`
                      : `scale(${scaleX}, ${scaleY})`,
                  transformOrigin: 'center center',
                  position: 'absolute',
                  left: '50%',
                  top: '50%',
                  marginLeft: -960,
                  marginTop: -540,
                }
          }
        >
          {/* AI 生态看板的 4 个 TAB 页面 (固定 0.2 考核大屏版) */}
          {type === 'ecosystem' && currentPage && (
            <div key={`eco-v2-${currentPage.id}`} className="w-full h-full animate-fadeIn flex flex-col justify-between overflow-hidden">
              {currentPage.id === 'overview' && <EcoV2OverviewTab />}
              {currentPage.id === 'industry' && <EcoV2IndustryTab />}
              {currentPage.id === 'activities' && <EcoV2ActivitiesTab />}
              {currentPage.id === 'reports' && <EcoV2LedgersTab />}
            </div>
          )}

          {/* 算力运营中心的 5 个 TAB 页面 */}
          {type === 'compute-ops' && currentPage && (
            <div key={`comp-${currentPage.id}`} className="w-full h-full animate-fadeIn flex flex-col justify-between">
              {currentPage.id === 'overview' && <ComputeOpsOverviewTab />}
              {currentPage.id === 'reconciliation' && (
                <ComputeOpsReconciliationTab
                  onSelectInstance={item => setSelectedInstance(item)}
                />
              )}
              {currentPage.id === 'revenue' && <ComputeOpsRevenueTab />}
              {currentPage.id === 'alerts' && <ComputeOpsCapacityAlertsTab />}
              {currentPage.id === 'progress' && <ComputeOpsClusterOnboardingTab />}
            </div>
          )}

          {/* 空状态保护 */}
          {(!currentPage || activePages.length === 0) && (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8 space-y-4">
              <Tv className="w-16 h-16 text-slate-600 animate-pulse" />
              <h3 className="text-base font-bold text-white">未勾选任何投屏页面</h3>
              <p className="text-xs text-slate-400 max-w-md">
                请点击右上角设置按钮，至少勾选一个参与轮播展示的看板页面。
              </p>
              <button
                onClick={() => setIsSettingsOpen(true)}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/30"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>打开投屏设置</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 挂载算力中心穿透弹窗 */}
      {type === 'compute-ops' && (
        <ComputeOpsInstanceDetailModal
          item={selectedInstance}
          isOpen={!!selectedInstance}
          onClose={() => setSelectedInstance(null)}
        />
      )}

      {/* 挂载投屏设置弹窗 */}
      <ScreencastSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => {
          setIsSettingsOpen(false);
          // Refresh settings in case they were updated
          setSettings(getScreencastSettings(type));
        }}
        type={type}
      />
    </div>
  );
};
