import React, { useState, useEffect } from 'react';
import {
  X,
  Settings,
  ArrowUp,
  ArrowDown,
  Play,
  RotateCcw,
  Check,
  CheckSquare,
  Square,
  Clock,
  MousePointer,
  Tv,
  HelpCircle,
  Sparkles,
  Layers,
  Scaling,
  Monitor
} from 'lucide-react';
import {
  ScreencastSettings,
  ScreencastPageConfig,
  getScreencastSettings,
  saveScreencastSettings,
  getDefaultScreencastSettings
} from './screencastConfig';

interface ScreencastSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ecosystem' | 'compute-ops';
  onLaunch?: () => void;
}

export const ScreencastSettingsModal: React.FC<ScreencastSettingsModalProps> = ({
  isOpen,
  onClose,
  type,
  onLaunch
}) => {
  const [settings, setSettings] = useState<ScreencastSettings>(() => getScreencastSettings(type));
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync settings whenever modal opens
  useEffect(() => {
    if (isOpen) {
      setSettings(getScreencastSettings(type));
    }
  }, [isOpen, type]);

  const showInternalToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  if (!isOpen) return null;

  const dashboardName = type === 'ecosystem' ? 'AI生态看板' : '算力运营中心';

  // Toggle page enable state
  const handleTogglePage = (id: string) => {
    const enabledCount = settings.pages.filter(p => p.enabled).length;
    const target = settings.pages.find(p => p.id === id);
    if (target?.enabled && enabledCount <= 1) {
      showInternalToast('⚠️ 至少需要保留 1 个页面进行投屏展示');
      return;
    }
    setSettings(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === id ? { ...p, enabled: !p.enabled } : p)
    }));
  };

  // Move page up
  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setSettings(prev => {
      const nextPages = [...prev.pages];
      const temp = nextPages[index - 1];
      nextPages[index - 1] = nextPages[index];
      nextPages[index] = temp;
      return { ...prev, pages: nextPages };
    });
  };

  // Move page down
  const handleMoveDown = (index: number) => {
    if (index >= settings.pages.length - 1) return;
    setSettings(prev => {
      const nextPages = [...prev.pages];
      const temp = nextPages[index + 1];
      nextPages[index + 1] = nextPages[index];
      nextPages[index] = temp;
      return { ...prev, pages: nextPages };
    });
  };

  // Select all pages
  const handleSelectAll = () => {
    setSettings(prev => ({
      ...prev,
      pages: prev.pages.map(p => ({ ...p, enabled: true }))
    }));
  };

  // Reset to default
  const handleResetDefault = () => {
    const defaults = getDefaultScreencastSettings(type);
    setSettings(defaults);
    saveScreencastSettings(type, defaults);
    showInternalToast('已恢复默认投屏设置');
  };

  // Save settings
  const handleSave = () => {
    const enabledCount = settings.pages.filter(p => p.enabled).length;
    if (enabledCount === 0) {
      showInternalToast('⚠️ 请至少勾选一个投屏页面');
      return;
    }
    saveScreencastSettings(type, settings);
    showInternalToast('投屏设置已成功保存！');
    setTimeout(() => {
      onClose();
    }, 400);
  };

  // Save and launch screencast in new tab
  const handleSaveAndLaunch = () => {
    const enabledCount = settings.pages.filter(p => p.enabled).length;
    if (enabledCount === 0) {
      showInternalToast('⚠️ 请至少勾选一个投屏页面');
      return;
    }
    saveScreencastSettings(type, settings);
    onClose();
    if (onLaunch) {
      onLaunch();
    } else {
      const url = `${window.location.origin}${window.location.pathname}?screencast=${type}`;
      window.open(url, '_blank');
    }
  };

  const INTERVAL_PRESETS = [3, 5, 8, 10, 15, 30, 60];
  const IDLE_PRESETS = [3, 5, 10, 15, 30];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      {/* Toast tip inside modal */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-indigo-600/95 text-white text-xs font-bold rounded-xl shadow-xl border border-indigo-400/30 flex items-center gap-2 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* 标题栏 */}
        <div className="px-6 py-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Settings className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>{dashboardName} · 投屏播放设置</span>
                <span className="text-[10px] font-mono font-normal px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  大屏轮播配置
                </span>
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                自定义在新窗口全屏投屏时的页面选择、轮播顺序、时间间隔与交互响应规则
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 内容主体 */}
        <div className="p-6 space-y-6 overflow-y-auto flex-1 text-xs text-slate-300">
          
          {/* 一、页面勾选与轮播调序 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-indigo-400" />
                <span>投屏轮播页面勾选与排序</span>
                <span className="text-[11px] text-slate-400 font-normal">
                  (已选 {settings.pages.filter(p => p.enabled).length} / {settings.pages.length} 页)
                </span>
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer flex items-center gap-1"
                >
                  <CheckSquare className="w-3 h-3 text-indigo-400" />
                  <span>全选</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const defaults = getDefaultScreencastSettings(type);
                    setSettings(prev => ({ ...prev, pages: [...defaults.pages] }));
                    showInternalToast('已恢复默认页面顺序');
                  }}
                  className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] transition cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>恢复初始排序</span>
                </button>
              </div>
            </div>

            <div className="space-y-2 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
              {settings.pages.map((page, index) => {
                const isFirst = index === 0;
                const isLast = index === settings.pages.length - 1;

                return (
                  <div
                    key={page.id}
                    className={`flex items-center justify-between p-2.5 rounded-lg border transition-all ${
                      page.enabled
                        ? 'bg-slate-900/90 border-slate-700/80 shadow-sm'
                        : 'bg-slate-950/40 border-slate-800/60 opacity-60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Checkbox */}
                      <button
                        type="button"
                        onClick={() => handleTogglePage(page.id)}
                        className={`w-5 h-5 rounded-md flex items-center justify-center transition cursor-pointer ${
                          page.enabled
                            ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/40'
                            : 'border border-slate-700 bg-slate-800 text-transparent hover:border-slate-500'
                        }`}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>

                      {/* 顺序标号 */}
                      <span className="w-6 h-6 rounded-md bg-slate-800 border border-slate-700 text-slate-300 font-mono text-[11px] font-bold flex items-center justify-center">
                        {index + 1}
                      </span>

                      {/* 标题 */}
                      <span className={`text-xs font-semibold ${page.enabled ? 'text-white' : 'text-slate-400'}`}>
                        {page.label}
                      </span>
                    </div>

                    {/* 调序上下箭头 */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMoveUp(index)}
                        className={`p-1.5 rounded-md transition ${
                          isFirst
                            ? 'text-slate-700 cursor-not-allowed'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                        }`}
                        title="上移此页面"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMoveDown(index)}
                        className={`p-1.5 rounded-md transition ${
                          isLast
                            ? 'text-slate-700 cursor-not-allowed'
                            : 'text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer'
                        }`}
                        title="下移此页面"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[11px] text-slate-400 flex items-center gap-1">
              <HelpCircle className="w-3 h-3 text-slate-400" />
              <span>投屏页面将按照上方列表从上到下按序放映，未勾选的页面将被跳过。</span>
            </p>
          </div>

          {/* 二、自动轮播与手动模式切换 */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between gap-4">
            <div>
              <div className="text-xs font-bold text-white flex items-center gap-2">
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>自动轮播开关</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  settings.autoRotate
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {settings.autoRotate ? '已开启自动轮播' : '手动翻页模式'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                {settings.autoRotate
                  ? '投屏页面将按设定的时间间隔自动翻页轮播'
                  : '关闭后在大屏端通过键盘左右方向键【← / →】或【A / D】键手动切换页面'}
              </p>
            </div>

            {/* 开关 Toggle */}
            <button
              type="button"
              onClick={() => setSettings(prev => ({ ...prev, autoRotate: !prev.autoRotate }))}
              className={`w-12 h-6.5 rounded-full transition-colors relative cursor-pointer ${
                settings.autoRotate ? 'bg-indigo-600' : 'bg-slate-800'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                  settings.autoRotate ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* 三、轮播间隔设置 (仅在自动轮播开启时可用) */}
          <div className={`space-y-3 transition-opacity ${settings.autoRotate ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>轮播间隔时间 (秒)</span>
              </span>
              <span className="font-mono text-cyan-400 font-bold text-xs">
                当前设定：{settings.interval} 秒 / 页
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {INTERVAL_PRESETS.map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, interval: sec }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                    settings.interval === sec
                      ? 'bg-indigo-600 text-white border-indigo-400 shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                  }`}
                >
                  {sec}秒 {sec === 5 && '(默认)'}
                </button>
              ))}

              {/* 自定义秒数输入 */}
              <div className="flex items-center gap-1.5 ml-2 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400">自定义:</span>
                <input
                  type="number"
                  min={2}
                  max={300}
                  value={settings.interval}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 2) {
                      setSettings(prev => ({ ...prev, interval: val }));
                    }
                  }}
                  className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white font-mono text-center focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-slate-400">秒</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              大屏投屏演示默认推荐 5 秒。若用于详细业务汇报，建议设为 10~15 秒。
            </p>
          </div>

          {/* 四、键鼠停止操作间隔多久后继续轮播 */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <MousePointer className="w-3.5 h-3.5 text-amber-400" />
                <span>键鼠停止操作后继续轮播等待时长 (秒)</span>
              </span>
              <span className="font-mono text-amber-300 font-bold text-xs">
                当前设定：{settings.idleResumeDelay} 秒
              </span>
            </label>

            <div className="flex flex-wrap items-center gap-2">
              {IDLE_PRESETS.map(sec => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, idleResumeDelay: sec }))}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer border ${
                    settings.idleResumeDelay === sec
                      ? 'bg-amber-600 text-white border-amber-400 shadow-sm shadow-amber-600/30'
                      : 'bg-slate-800/80 text-slate-300 border-slate-700/80 hover:bg-slate-700'
                  }`}
                >
                  {sec}秒 {sec === 5 && '(默认)'}
                </button>
              ))}

              {/* 自定义输入 */}
              <div className="flex items-center gap-1.5 ml-2 bg-slate-800/80 px-2 py-1 rounded-lg border border-slate-700">
                <span className="text-[11px] text-slate-400">自定义:</span>
                <input
                  type="number"
                  min={1}
                  max={120}
                  value={settings.idleResumeDelay}
                  onChange={e => {
                    const val = parseInt(e.target.value, 10);
                    if (!isNaN(val) && val >= 1) {
                      setSettings(prev => ({ ...prev, idleResumeDelay: val }));
                    }
                  }}
                  className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs text-white font-mono text-center focus:outline-none focus:border-amber-500"
                />
                <span className="text-[11px] text-slate-400">秒</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              在投屏过程中，若演讲者移动鼠标或按键交互（如下钻查看台账/消耗明细详情弹窗），系统将自动暂停轮播；当键鼠停止操作超过设定的时间后，自动无缝恢复轮播。
            </p>
          </div>

          {/* 五、屏幕自适应排版模式设置 (按 1920*1080 优化) */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-white flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Scaling className="w-3.5 h-3.5 text-cyan-400" />
                <span>屏幕自适应与排版模式 (1920×1080)</span>
              </span>
              <span className="font-mono text-cyan-300 font-bold text-xs">
                {settings.fitMode === 'fill' ? '铺满全屏 (1920*1080 无空白)' : settings.fitMode === 'contain' ? '等比居中 (16:9 标准比例)' : '流式排版'}
              </span>
            </label>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
              {[
                {
                  mode: 'fill',
                  title: '满屏自适应 (推荐)',
                  desc: '按 1920*1080 标准大屏自动缩放铺满窗口，零黑边零空白',
                },
                {
                  mode: 'contain',
                  title: '等比缩放 (16:9)',
                  desc: '保持严格 16:9 比例居中展示，适合投影仪或标准比例电视',
                },
                {
                  mode: 'fluid',
                  title: '流式排版',
                  desc: '按浏览器窗口宽度流动排版，适合常规窗口化浏览',
                },
              ].map(item => (
                <button
                  key={item.mode}
                  type="button"
                  onClick={() => setSettings(prev => ({ ...prev, fitMode: item.mode as any }))}
                  className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    settings.fitMode === item.mode
                      ? 'bg-cyan-950/40 border-cyan-500/80 text-white shadow-md shadow-cyan-500/10'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold">{item.title}</span>
                    {settings.fitMode === item.mode && (
                      <span className="w-2 h-2 rounded-full bg-cyan-400" />
                    )}
                  </div>
                  <span className="text-[11px] text-slate-400 leading-snug">{item.desc}</span>
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-400">
              提示：若在全屏窗口下出现上下或左右空白区域，请选择【满屏自适应】，系统将按 1920×1080 分辨率自动缩放占满整个屏幕。
            </p>
          </div>

        </div>

        {/* 底部操作按钮 */}
        <div className="px-6 py-4 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleResetDefault}
            className="px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>恢复默认设置</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>保存设置</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAndLaunch}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-lg shadow-indigo-600/30 ring-1 ring-indigo-400/40"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>保存并立即投屏</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
