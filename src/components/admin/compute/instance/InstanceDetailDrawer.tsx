import React, { useState, useEffect } from 'react';
import { ComputeRunningInstanceItem } from '../../../../types';
import {
  X,
  Activity,
  Cpu,
  Terminal,
  Server,
  Zap,
  Flame,
  HardDrive,
  Clock,
  User,
  PowerOff,
  RotateCcw,
  Trash2,
  Copy,
  Check,
  ArrowUpRight,
  ExternalLink,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  FileText,
  RefreshCw
} from 'lucide-react';

interface InstanceDetailDrawerProps {
  instance: ComputeRunningInstanceItem | null;
  onClose: () => void;
  onNavigateToOrder: (orderId: string) => void;
  onRestartInstance: (instanceId: string) => void;
  onStopInstance: (instanceId: string) => void;
  onReleaseInstance: (instanceId: string) => void;
}

export const InstanceDetailDrawer: React.FC<InstanceDetailDrawerProps> = ({
  instance,
  onClose,
  onNavigateToOrder,
  onRestartInstance,
  onStopInstance,
  onReleaseInstance
}) => {
  const [activeTab, setActiveTab] = useState<'metrics' | 'logs' | 'connect' | 'hardware'>('metrics');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [logFilter, setLogFilter] = useState<'all' | 'INFO' | 'WARN' | 'ERROR'>('all');

  if (!instance) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const gpuPercent = instance.gpuUtil ?? instance.gpuUsage ?? 0;
  const vramPercent = instance.vramUsage ?? 0;
  const isWarning = instance.health === '告警' || (instance.temp ?? 0) > 80;
  const isHighLoad = instance.health === '高载' || gpuPercent > 85;

  // 历史波形数据点（从 metricHistory 或生成模拟）
  const metricPoints = instance.metricHistory || [
    { time: '14:00', gpu: 45, vram: 60, cpu: 30, temp: 58, power: 220 },
    { time: '14:15', gpu: 68, vram: 75, cpu: 42, temp: 64, power: 280 },
    { time: '14:30', gpu: 88, vram: 85, cpu: 55, temp: 72, power: 340 },
    { time: '14:45', gpu: 92, vram: 90, cpu: 62, temp: 76, power: 380 },
    { time: '15:00', gpu: gpuPercent, vram: vramPercent, cpu: instance.cpuUtil ?? 50, temp: instance.temp ?? 68, power: 390 }
  ];

  const filteredLogs = (instance.logs || []).filter(log => {
    if (logFilter === 'all') return true;
    return log.level === logFilter;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isWarning ? 'bg-rose-500/10 border-rose-500/30 text-rose-400' :
              isHighLoad ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
              'bg-cyan-500/10 border-cyan-500/30 text-cyan-400'
            }`}>
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-white tracking-wide font-mono">
                  {instance.instanceId || instance.id}
                </h3>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1.5 ${
                  instance.status === '运行中'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                    : 'bg-slate-800 text-slate-400 border border-slate-700'
                }`}>
                  {instance.status === '运行中' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                  {instance.status}
                </span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                  instance.health === '告警' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                  instance.health === '高载' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                  'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                }`}>
                  健康: {instance.health || '良好'}
                </span>
              </div>

              <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                <span>节点: <span className="font-mono text-slate-300">{instance.hostNode || 'node-gpu-01'}</span></span>
                <span>IP: <span className="font-mono text-slate-300">{instance.publicIp || instance.ipAddress || '10.0.1.12'}</span></span>
                {instance.orderId && (
                  <span className="flex items-center gap-1">
                    关联订单:
                    <button
                      onClick={() => onNavigateToOrder(instance.orderId!)}
                      className="font-mono text-indigo-400 hover:text-indigo-300 underline font-medium"
                    >
                      {instance.orderId}
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {instance.orderId && (
              <button
                onClick={() => onNavigateToOrder(instance.orderId!)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-medium transition-all"
                title="直达关联订单管理页面"
              >
                <span>查看订单</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 导航 */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-800 bg-slate-900/60 overflow-x-auto">
          {[
            { id: 'metrics', label: '实时遥测与波形图', icon: Activity },
            { id: 'logs', label: '容器事件与系统日志', icon: Terminal, count: instance.logs?.length },
            { id: 'connect', label: '连接与端口映射', icon: Server },
            { id: 'hardware', label: '硬件拓扑与驱动', icon: Cpu }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 px-3.5 border-b-2 text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-cyan-500 text-cyan-400'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800 text-slate-400">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Tab 页面内容 */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 实时遥测仪表盘与波形 */}
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              {/* 四大核心遥测卡片 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {/* GPU 利用率 */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>GPU 算力利用率</span>
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-cyan-400">
                    {gpuPercent}%
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        gpuPercent > 85 ? 'bg-amber-500' : 'bg-cyan-500'
                      }`}
                      style={{ width: `${Math.min(100, gpuPercent)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                    <span>{instance.gpuModel || 'RTX 4090'}</span>
                    <span>x{instance.gpuCount || 1}</span>
                  </div>
                </div>

                {/* 显存 VRAM */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>显存 VRAM 占用</span>
                    <Zap className="w-3.5 h-3.5 text-indigo-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-indigo-300">
                    {vramPercent}%
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{ width: `${Math.min(100, vramPercent)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                    <span>已用: {instance.vramUsed || '21.6GB'}</span>
                    <span>/ {instance.vramTotal || '24.0GB'}</span>
                  </div>
                </div>

                {/* 核心温度 */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>GPU 核心温度</span>
                    <Flame className={`w-3.5 h-3.5 ${isWarning ? 'text-rose-400' : 'text-amber-400'}`} />
                  </div>
                  <div className={`text-2xl font-bold font-mono ${
                    (instance.temp ?? 0) > 80 ? 'text-rose-400' :
                    (instance.temp ?? 0) > 70 ? 'text-amber-400' :
                    'text-emerald-400'
                  }`}>
                    {instance.temp || 55}℃
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        (instance.temp ?? 0) > 80 ? 'bg-rose-500' :
                        (instance.temp ?? 0) > 70 ? 'bg-amber-500' :
                        'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.min(100, ((instance.temp || 55) / 95) * 100)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                    <span>安全阈值: 82℃</span>
                    <span>功耗: {instance.power || '350W'}</span>
                  </div>
                </div>

                {/* 主机内存 RAM & CPU */}
                <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 space-y-2">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>主机 CPU / 内存</span>
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="text-2xl font-bold font-mono text-slate-200">
                    {instance.ramUsage || 45}%
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full bg-slate-400 transition-all duration-500"
                      style={{ width: `${Math.min(100, instance.ramUsage || 45)}%` }}
                    />
                  </div>
                  <div className="text-[10px] text-slate-400 flex justify-between font-mono">
                    <span>CPU: {instance.cpuUtil || 35}%</span>
                    <span>{instance.ramUsed || '28.8GB'}</span>
                  </div>
                </div>
              </div>

              {/* 历史遥测走势图（SVG 高保真波形呈现） */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                    <Activity className="w-4 h-4 text-cyan-400" />
                    <span>GPU 算力利用率 & 显存负载历史波形 (近2小时)</span>
                  </div>
                  <div className="flex items-center gap-3 text-[11px]">
                    <span className="flex items-center gap-1.5 text-cyan-400">
                      <span className="w-2.5 h-0.5 bg-cyan-400 rounded" />
                      GPU计算率
                    </span>
                    <span className="flex items-center gap-1.5 text-indigo-400">
                      <span className="w-2.5 h-0.5 bg-indigo-400 rounded" />
                      显存占用
                    </span>
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <span className="w-2.5 h-0.5 bg-amber-400 rounded" />
                      温度(℃)
                    </span>
                  </div>
                </div>

                {/* 波形图容器 */}
                <div className="h-44 w-full relative pt-2">
                  <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 500 120">
                    {/* 背景网格线 */}
                    <line x1="0" y1="20" x2="500" y2="20" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
                    <line x1="0" y1="60" x2="500" y2="60" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />
                    <line x1="0" y1="100" x2="500" y2="100" stroke="#334155" strokeDasharray="3 3" strokeOpacity="0.4" />

                    {/* GPU 折线 */}
                    <polyline
                      fill="none"
                      stroke="#22d3ee"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={metricPoints.map((pt, i) => `${(i / (metricPoints.length - 1)) * 500},${110 - (pt.gpu / 100) * 90}`).join(' ')}
                    />

                    {/* 显存 折线 */}
                    <polyline
                      fill="none"
                      stroke="#818cf8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={metricPoints.map((pt, i) => `${(i / (metricPoints.length - 1)) * 500},${110 - (pt.vram / 100) * 90}`).join(' ')}
                    />

                    {/* 温度 折线 */}
                    <polyline
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="1.5"
                      strokeDasharray="4 2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={metricPoints.map((pt, i) => `${(i / (metricPoints.length - 1)) * 500},${110 - ((pt.temp || 55) / 100) * 90}`).join(' ')}
                    />

                    {/* 数据点标记 */}
                    {metricPoints.map((pt, i) => (
                      <circle
                        key={i}
                        cx={(i / (metricPoints.length - 1)) * 500}
                        cy={110 - (pt.gpu / 100) * 90}
                        r="3.5"
                        fill="#0f172a"
                        stroke="#22d3ee"
                        strokeWidth="2"
                      />
                    ))}
                  </svg>

                  {/* X 轴时间刻度 */}
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-2">
                    {metricPoints.map((pt, i) => (
                      <span key={i}>{pt.time}</span>
                    ))}
                  </div>
                </div>
              </div>

              {/* 用户信息与生命周期 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>租用用户信息</span>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <img
                      src={instance.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                      alt="avatar"
                      className="w-9 h-9 rounded-full border border-slate-700"
                    />
                    <div>
                      <div className="font-semibold text-slate-200">{instance.userName}</div>
                      <div className="text-slate-400 font-mono text-[11px]">{instance.userPhone || instance.userId}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-4 space-y-2.5 text-xs">
                  <div className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>运行周期与时长</span>
                  </div>
                  <div className="space-y-1 text-slate-300 text-[11px]">
                    <div>启动时间: <span className="font-mono text-slate-400">{instance.startTime || instance.createdAt}</span></div>
                    <div>累计连续运行: <span className="font-bold text-emerald-400 font-mono">{instance.runningDuration || instance.runningHours || '1.5小时'}</span></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 容器事件与日志 */}
          {activeTab === 'logs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">日志级别:</span>
                  {(['all', 'INFO', 'WARN', 'ERROR'] as const).map(lvl => (
                    <button
                      key={lvl}
                      onClick={() => setLogFilter(lvl)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                        logFilter === lvl
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {lvl === 'all' ? '全部级别' : lvl}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => alert('已获取宿主机最新容器系统事件日志')}
                  className="flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs transition-colors"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>实时拉取</span>
                </button>
              </div>

              {/* 黑色终端窗口 */}
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-slate-300 space-y-2 h-96 overflow-y-auto">
                <div className="text-slate-400 pb-2 border-b border-slate-900 flex justify-between">
                  <span># Container System Journal (tail -n 100)</span>
                  <span>PID: 49202</span>
                </div>
                {filteredLogs.length > 0 ? (
                  filteredLogs.map((log, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 leading-relaxed hover:bg-slate-900/50 p-1 rounded transition-colors">
                      <span className="text-slate-400 shrink-0">{log.time}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold shrink-0 ${
                        log.level === 'ERROR' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' :
                        'bg-emerald-500/10 text-emerald-400'
                      }`}>
                        {log.level}
                      </span>
                      <span className="text-slate-400 shrink-0">[{log.source || 'Kernel'}]</span>
                      <span className="text-slate-200 flex-1 break-all">{log.message}</span>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center text-slate-400">
                    暂无该级别事件日志
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: 连接与端口映射 */}
          {activeTab === 'connect' && (
            <div className="space-y-4 text-xs">
              {/* SSH 连接 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span>SSH 终端连接指令</span>
                  </div>
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-300 rounded text-[10px]">免密公钥 / 密码</span>
                </div>
                <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between gap-2 font-mono">
                  <span className="text-cyan-300 truncate">{instance.sshCommand || `ssh root@${instance.publicIp || '123.57.199.12'} -p 22022`}</span>
                  <button
                    onClick={() => handleCopy(instance.sshCommand || `ssh root@${instance.publicIp || '123.57.199.12'} -p 22022`, 'ssh')}
                    className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors shrink-0"
                  >
                    {copiedKey === 'ssh' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Web 开发环境直达 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <ExternalLink className="w-4 h-4 text-indigo-400" />
                  <span>Web IDE 与开发工具直达</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href={instance.jupyterUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="p-3 bg-slate-900 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 rounded-xl flex items-center justify-between transition-all group"
                  >
                    <div>
                      <div className="font-bold text-slate-200 group-hover:text-indigo-300">JupyterLab</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">端口 8888 · 已就绪</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-300" />
                  </a>

                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">TensorBoard 监控</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">端口 6006 · 监听中</div>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>

              {/* 开放端口映射表 */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3">
                <div className="font-bold text-slate-200">容器网络与端口映射拓扑</div>
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-2 px-3">服务</th>
                      <th className="py-2 px-3">容器内端口</th>
                      <th className="py-2 px-3">宿主机映射端口</th>
                      <th className="py-2 px-3">协议</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    <tr>
                      <td className="py-2 px-3 font-sans">SSH Daemon</td>
                      <td className="py-2 px-3">22</td>
                      <td className="py-2 px-3 text-cyan-300">22022</td>
                      <td className="py-2 px-3">TCP</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans">JupyterLab</td>
                      <td className="py-2 px-3">8888</td>
                      <td className="py-2 px-3 text-cyan-300">38888</td>
                      <td className="py-2 px-3">HTTP</td>
                    </tr>
                    <tr>
                      <td className="py-2 px-3 font-sans">Custom App</td>
                      <td className="py-2 px-3">8080</td>
                      <td className="py-2 px-3 text-cyan-300">38080</td>
                      <td className="py-2 px-3">TCP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 4: 硬件拓扑与驱动 */}
          {activeTab === 'hardware' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-3">
                <div className="font-bold text-slate-200 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>宿主机物理 GPU 节点信息</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                    <span className="text-slate-400">GPU 芯片型号:</span>
                    <div className="font-bold text-slate-200 font-mono">{instance.gpuModel || 'NVIDIA GeForce RTX 4090'}</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                    <span className="text-slate-400">驱动版本:</span>
                    <div className="font-bold text-emerald-400 font-mono">NVIDIA 535.129.03 / CUDA 12.2</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                    <span className="text-slate-400">PCIe 总线链路:</span>
                    <div className="font-bold text-slate-200 font-mono">PCIe 4.0 x16 (31.5 GB/s)</div>
                  </div>
                  <div className="p-3 bg-slate-900 rounded-lg space-y-1">
                    <span className="text-slate-400">功耗上限 (TDP):</span>
                    <div className="font-bold text-amber-400 font-mono">450W Max (Current: {instance.power || '350W'})</div>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4.5 space-y-2">
                <div className="font-bold text-slate-200">系统环境与镜像</div>
                <div className="text-slate-300 font-mono bg-slate-900 p-3 rounded-lg">
                  <div>镜像: {instance.imageName}</div>
                  <div className="text-slate-400 text-[11px] mt-1">Ubuntu 22.04 LTS · PyTorch 2.3.0 · cuDNN 8.9.7 · Python 3.10</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer 运维控制 */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            运维控制指令将直接下发至集群 K8s/Docker 调度引擎
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onRestartInstance(instance.id)}
              className="px-3.5 py-2 bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/30 text-indigo-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>软重启容器</span>
            </button>

            {instance.status === '运行中' && (
              <button
                onClick={() => onStopInstance(instance.id)}
                className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
              >
                <PowerOff className="w-3.5 h-3.5" />
                <span>强制关机停机</span>
              </button>
            )}

            <button
              onClick={() => onReleaseInstance(instance.id)}
              className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>强制释放销毁</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
