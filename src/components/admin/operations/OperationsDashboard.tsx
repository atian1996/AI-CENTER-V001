import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useApp } from '../../../context/AppContext';
import { AdminMenuKey } from '../../../types';
import {
  LayoutDashboard,
  Users,
  Coins,
  FileCheck,
  Cpu,
  Zap,
  TrendingUp,
  Bot,
  Briefcase,
  Brain,
  Activity,
  AlertTriangle,
  Clock,
  RefreshCw,
  ChevronRight,
  X,
  ArrowUpRight,
  PieChart as PieIcon,
  BarChart3,
  Server
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

// Data structure for 7-day and 30-day platform trends
const trendData7Days = [
  { date: '08-19', revenue: 4200, users: 180 },
  { date: '08-20', revenue: 4850, users: 210 },
  { date: '08-21', revenue: 4600, users: 195 },
  { date: '08-22', revenue: 5100, users: 240 },
  { date: '08-23', revenue: 5350, users: 260 },
  { date: '08-24', revenue: 5200, users: 235 },
  { date: '08-25', revenue: 5620, users: 283 }
];

const trendData30Days = [
  { date: '07-27', revenue: 3200, users: 140 },
  { date: '08-01', revenue: 3800, users: 165 },
  { date: '08-05', revenue: 4100, users: 175 },
  { date: '08-10', revenue: 4500, users: 200 },
  { date: '08-15', revenue: 4900, users: 220 },
  { date: '08-20', revenue: 4850, users: 210 },
  { date: '08-25', revenue: 5620, users: 283 }
];

// Real-time activity feeds (20 items)
const initialRealtimeFeed = [
  { id: 'act-1', time: '10:29:45', user: '张三', action: '订阅了「智能客服Agent」', type: 'Agent订阅', color: 'text-indigo-300 bg-indigo-950/80 border-indigo-800' },
  { id: 'act-2', time: '10:28:12', user: '李四', action: '发布了「金融分类模型优化」任务', type: '任务发布', color: 'text-sky-300 bg-sky-950/80 border-sky-800' },
  { id: 'act-3', time: '10:26:05', user: '王五', action: '租用了 RTX4090 实例 (8小时)', type: '算力租用', color: 'text-amber-300 bg-amber-950/80 border-amber-800' },
  { id: 'act-4', time: '10:24:33', user: '赵六', action: '调用了 DeepSeek V4 模型 API', type: '模型调用', color: 'text-purple-300 bg-purple-950/80 border-purple-800' },
  { id: 'act-5', time: '10:22:19', user: '孙七', action: '报名了「2026 AI创新赛」应用赛道', type: '赛事报名', color: 'text-rose-300 bg-rose-950/80 border-rose-800' },
  { id: 'act-6', time: '10:20:01', user: '周八', action: '在干货分享板块发布了新帖子', type: '社区发帖', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-800' },
  { id: 'act-7', time: '10:18:40', user: '钱九', action: '成功购买了「文案生成Pro Agent」套餐', type: 'Agent订阅', color: 'text-indigo-300 bg-indigo-950/80 border-indigo-800' },
  { id: 'act-8', time: '10:16:15', user: '吴十', action: '提交了「医疗诊断模型验证」任务方案', type: '任务接单', color: 'text-sky-300 bg-sky-950/80 border-sky-800' },
  { id: 'act-9', time: '10:14:02', user: '郑十一', action: '续租了 A100 80G 实例 (24小时)', type: '算力租用', color: 'text-amber-300 bg-amber-950/80 border-amber-800' },
  { id: 'act-10', time: '10:11:58', user: '王十二', action: '调用了 Gemini 3.6 Pro 多模态接口', type: '模型调用', color: 'text-purple-300 bg-purple-950/80 border-purple-800' },
  { id: 'act-11', time: '10:09:30', user: '陈十三', action: '上传了「电商客服对话数据集v2」', type: '数据上传', color: 'text-teal-300 bg-teal-950/80 border-teal-800' },
  { id: 'act-12', time: '10:07:14', user: '楚十四', action: '订阅了「外贸合同审查Agent」', type: 'Agent订阅', color: 'text-indigo-300 bg-indigo-950/80 border-indigo-800' },
  { id: 'act-13', time: '10:05:00', user: '魏十五', action: '完成了「图像分类标注」任务验收', type: '任务结算', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-800' },
  { id: 'act-14', time: '10:02:44', user: '蒋十六', action: '部署了自定义 Docker 算法镜像', type: '算力工坊', color: 'text-amber-300 bg-amber-950/80 border-amber-800' },
  { id: 'act-15', time: '10:00:10', user: '沈十七', action: '申请了开发者 API Key 密钥', type: '密钥申请', color: 'text-slate-300 bg-slate-800/80 border-slate-700' },
  { id: 'act-16', time: '09:58:22', user: '韩十八', action: '发布了「自动生成代码插件」需求', type: '任务发布', color: 'text-sky-300 bg-sky-950/80 border-sky-800' },
  { id: 'act-17', time: '09:55:09', user: '杨十九', action: '调用了 Qwen-2.5-72B 模型 API', type: '模型调用', color: 'text-purple-300 bg-purple-950/80 border-purple-800' },
  { id: 'act-18', time: '09:52:30', user: '朱二十', action: '购买了「AI代码审查员」包月卡', type: 'Agent订阅', color: 'text-indigo-300 bg-indigo-950/80 border-indigo-800' },
  { id: 'act-19', time: '09:50:11', user: '秦二十一', action: '在社区回复了帖《如何调优RAG召回》', type: '社区发帖', color: 'text-emerald-300 bg-emerald-950/80 border-emerald-800' },
  { id: 'act-20', time: '09:48:00', user: '尤二十二', action: '租用实例配额升级审核已通过', type: '系统通知', color: 'text-blue-300 bg-blue-950/80 border-blue-800' }
];

export const OperationsDashboard: React.FC = () => {
  const { setActiveAdminMenu, showToast } = useApp();

  // Modal control for 待办事项明细
  const [showPendingModal, setShowPendingModal] = useState(false);
  
  // Trend chart time filter ('7' or '30')
  const [trendTimeRange, setTrendTimeRange] = useState<'7' | '30'>('7');
  
  // Refresh timestamp state
  const [lastUpdateTime, setLastUpdateTime] = useState<string>('10:30');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto update clock every few seconds simulating real-time feed update
  const [realtimeFeed] = useState(initialRealtimeFeed);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setLastUpdateTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      const now = new Date();
      setLastUpdateTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setIsRefreshing(false);
      showToast('运营大屏数据已更新至最新状态');
    }, 600);
  };

  const handleNavigate = (menu: AdminMenuKey) => {
    setShowPendingModal(false);
    setActiveAdminMenu(menu);
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">



      {/* ========================================== */}
      {/* 三、顶部 KPI 卡片 (6个)                      */}
      {/* ========================================== */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* KPI 1: 今日活跃用户 */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xs space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">今日活跃用户</span>
            <div className="w-7 h-7 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">1,283</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md w-fit">
            <ArrowUpRight className="w-3 h-3 stroke-[3]" />
            <span>↑12% 环比</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium border-t border-slate-800/80 pt-1.5">
            登录/操作行为 (去重)
          </div>
        </div>

        {/* KPI 2: 今日营收 */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xs space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">今日营收</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">¥5,620</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md w-fit">
            <ArrowUpRight className="w-3 h-3 stroke-[3]" />
            <span>↑8% 环比</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium border-t border-slate-800/80 pt-1.5 truncate">
            订阅+模型+算力到账
          </div>
        </div>

        {/* KPI 3: 待办事项 (可点击弹窗) */}
        <div
          onClick={() => setShowPendingModal(true)}
          className="bg-slate-900/80 p-4 rounded-2xl border border-rose-900/60 shadow-xs space-y-2 hover:border-rose-700 hover:shadow-sm transition cursor-pointer group relative overflow-hidden"
          title="点击查看待办事项明细"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-300 group-hover:text-rose-400 transition">待办事项</span>
            <div className="w-7 h-7 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="text-2xl font-black text-white font-mono tracking-tight">12</div>
            <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-rose-900/80 text-rose-200 border border-rose-700 animate-pulse flex items-center gap-0.5">
              🔴 3异常
            </span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-rose-400 font-bold border-t border-slate-800/80 pt-1.5">
            <span>超24h未处理</span>
            <span className="group-hover:translate-x-0.5 transition">查看明细 →</span>
          </div>
        </div>

        {/* KPI 4: GPU总利用率 */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xs space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">GPU总利用率</span>
            <div className="w-7 h-7 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">78.5%</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md w-fit">
            <ArrowUpRight className="w-3 h-3 stroke-[3]" />
            <span>↑2% 环比</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium border-t border-slate-800/80 pt-1.5 truncate">
            已分配 / 总GPU
          </div>
        </div>

        {/* KPI 5: 今日API调用次数 */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xs space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">今日API调用</span>
            <div className="w-7 h-7 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">23.4万</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md w-fit">
            <ArrowUpRight className="w-3 h-3 stroke-[3]" />
            <span>↑15% 环比</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium border-t border-slate-800/80 pt-1.5 truncate">
            模型广场接口调用
          </div>
        </div>

        {/* KPI 6: 累计注册用户 */}
        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800 shadow-xs space-y-2 hover:border-slate-700 transition">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400">累计注册用户</span>
            <div className="w-7 h-7 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">12,580</div>
          <div className="flex items-center gap-1 text-[11px] font-extrabold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md w-fit">
            <ArrowUpRight className="w-3 h-3 stroke-[3]" />
            <span>↑5% 环比</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium border-t border-slate-800/80 pt-1.5 truncate">
            平台注册用户总数
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 四、中部：四大业务模块看板 (2x2 Grid)      */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* 模块一：🤖 Agent商店 */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">🤖 Agent商店</h3>
                <p className="text-[11px] text-slate-400 font-medium">上架智能体订阅与并发流量监控</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('agent_list')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>进入管理</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 四项核心指标 */}
          <div className="grid grid-cols-4 gap-2 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-center">
            <div>
              <div className="text-[11px] text-slate-400 font-bold">上架Agent</div>
              <div className="text-base font-black text-white font-mono mt-0.5">356</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日订阅</div>
              <div className="text-base font-black text-indigo-400 font-mono mt-0.5">32</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日调用</div>
              <div className="text-base font-black text-white font-mono mt-0.5">1.2万</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日收入</div>
              <div className="text-base font-black text-emerald-400 font-mono mt-0.5">¥890</div>
            </div>
          </div>

          {/* 图表：[订阅量Top5 Agent] */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-indigo-400" />
                <span>订阅量 Top5 Agent</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">今日新增订阅数</span>
            </div>

            <div className="space-y-2">
              {[
                { name: '智能客服Agent', icon: '🤖', count: 142, pct: 100 },
                { name: '外贸合同审查Agent', icon: '📜', count: 98, pct: 69 },
                { name: '论文翻译与润色助手', icon: '🎓', count: 85, pct: 60 },
                { name: 'AI代码审查员', icon: '💻', count: 76, pct: 53 },
                { name: '品牌文案大师', icon: '✍️', count: 64, pct: 45 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                      <span className="w-4 font-mono text-slate-500 text-[11px] text-center">{idx + 1}</span>
                      <span>{item.icon}</span>
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-mono font-bold text-white text-[11px]">{item.count} 次</span>
                  </div>
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-slate-800/50">
                    <div
                      className="bg-indigo-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 模块二：📋 任务大厅 */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">📋 任务大厅</h3>
                <p className="text-[11px] text-slate-400 font-medium">众包任务交付、阶段验收与履约状态</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('publish_audit')}
              className="text-xs text-sky-400 hover:text-sky-300 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>任务审核</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 四项核心指标 */}
          <div className="grid grid-cols-4 gap-2 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-center">
            <div>
              <div className="text-[11px] text-slate-400 font-bold">进行中任务</div>
              <div className="text-base font-black text-white font-mono mt-0.5">89</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日发布</div>
              <div className="text-base font-black text-sky-400 font-mono mt-0.5">12</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日完成</div>
              <div className="text-base font-black text-white font-mono mt-0.5">7</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold truncate">托管赏金总额</div>
              <div className="text-base font-black text-emerald-400 font-mono mt-0.5">¥3.85万</div>
            </div>
          </div>

          {/* 图表：[任务领域分布] */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <PieIcon className="w-3.5 h-3.5 text-sky-400" />
                <span>任务领域分布占比</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">按任务分类</span>
            </div>

            {/* Visual segmented bar */}
            <div className="space-y-3">
              <div className="w-full h-3.5 bg-slate-950/80 rounded-full flex overflow-hidden p-0.5 gap-0.5 border border-slate-800">
                <div className="bg-sky-500 h-full rounded-l-full" style={{ width: '35%' }} title="技术开发 35%" />
                <div className="bg-indigo-500 h-full" style={{ width: '25%' }} title="内容创作 25%" />
                <div className="bg-purple-500 h-full" style={{ width: '20%' }} title="AI模型与数据 20%" />
                <div className="bg-amber-500 h-full" style={{ width: '12%' }} title="工具与自动化 12%" />
                <div className="bg-emerald-500 h-full rounded-r-full" style={{ width: '8%' }} title="咨询与培训 8%" />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">技术开发</span>
                  <span className="font-mono font-bold text-white ml-auto">35%</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">内容创作</span>
                  <span className="font-mono font-bold text-white ml-auto">25%</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">模型与数据</span>
                  <span className="font-mono font-bold text-white ml-auto">20%</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">工具自动化</span>
                  <span className="font-mono font-bold text-white ml-auto">12%</span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-950/60 p-1.5 rounded-lg border border-slate-800/60">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-300 font-medium truncate">咨询与培训</span>
                  <span className="font-mono font-bold text-white ml-auto">8%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 模块三：⚡ 算力工坊 */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">⚡ 算力工坊</h3>
                <p className="text-[11px] text-slate-400 font-medium">GPU集群租用实例与利用率</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('compute_instance')}
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>实例监控</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 四项核心指标 */}
          <div className="grid grid-cols-4 gap-2 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-center">
            <div>
              <div className="text-[11px] text-slate-400 font-bold">运行中实例</div>
              <div className="text-base font-black text-white font-mono mt-0.5">42</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日新租用</div>
              <div className="text-base font-black text-amber-400 font-mono mt-0.5">8</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日收入</div>
              <div className="text-base font-black text-emerald-400 font-mono mt-0.5">¥3,450</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">GPU利用率</div>
              <div className="text-base font-black text-white font-mono mt-0.5">78.5%</div>
            </div>
          </div>

          {/* 图表：[规格占比] */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-amber-400" />
                <span>GPU 规格租用时长占比</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">资源池规格</span>
            </div>

            <div className="space-y-2">
              {[
                { spec: 'NVIDIA RTX 4090 24G', pct: 45, count: '18.9h/天' },
                { spec: 'NVIDIA A100 80G PCIe', pct: 30, count: '12.6h/天' },
                { spec: 'NVIDIA T4 16G', pct: 15, count: '6.3h/天' },
                { spec: 'NVIDIA H800 80G', pct: 10, count: '4.2h/天' }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 text-[11px] truncate">{item.spec}</span>
                    <span className="font-mono font-bold text-white text-[11px]">{item.pct}% ({item.count})</span>
                  </div>
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-slate-800/50">
                    <div
                      className="bg-amber-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 模块四：🧠 模型广场 */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
                <Brain className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">🧠 模型广场</h3>
                <p className="text-[11px] text-slate-400 font-medium">大模型API网关与Token吞吐量</p>
              </div>
            </div>
            <button
              onClick={() => handleNavigate('model_calls')}
              className="text-xs text-purple-400 hover:text-purple-300 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>API监控</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 四项核心指标 */}
          <div className="grid grid-cols-4 gap-2 bg-slate-950/60 rounded-xl p-3 border border-slate-800/80 text-center">
            <div>
              <div className="text-[11px] text-slate-400 font-bold">上架模型</div>
              <div className="text-base font-black text-white font-mono mt-0.5">28</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日API调用</div>
              <div className="text-base font-black text-purple-400 font-mono mt-0.5">23.4万</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">Token消耗</div>
              <div className="text-base font-black text-white font-mono mt-0.5">156M</div>
            </div>
            <div>
              <div className="text-[11px] text-slate-400 font-bold">今日收入</div>
              <div className="text-base font-black text-emerald-400 font-mono mt-0.5">¥1,280</div>
            </div>
          </div>

          {/* 图表：[调用Top5模型] */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between text-xs font-bold text-slate-300">
              <span className="flex items-center gap-1.5">
                <BarChart3 className="w-3.5 h-3.5 text-purple-400" />
                <span>调用量 Top5 大模型</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium">调用频次与 Token</span>
            </div>

            <div className="space-y-2">
              {[
                { name: 'DeepSeek-V4 (DeepThink)', calls: '8.84万次', tokens: '58M', pct: 100 },
                { name: 'Gemini 3.6 Pro (Multimodal)', calls: '6.21万次', tokens: '42M', pct: 70 },
                { name: 'Qwen-2.5-72B-Instruct', calls: '4.52万次', tokens: '31M', pct: 51 },
                { name: 'Claude 3.5 Sonnet', calls: '2.48万次', tokens: '16M', pct: 28 },
                { name: 'Llama 3.3 70B (Groq Accel)', calls: '1.35万次', tokens: '9M', pct: 15 }
              ].map((item, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-200 flex items-center gap-1.5 truncate">
                      <span className="w-4 font-mono text-slate-500 text-[11px] text-center">{idx + 1}</span>
                      <span className="truncate">{item.name}</span>
                    </span>
                    <span className="font-mono font-bold text-white text-[11px] shrink-0 ml-2">
                      {item.calls} <span className="text-slate-500 font-normal text-[10px]">({item.tokens})</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-950/80 rounded-full h-1.5 overflow-hidden border border-slate-800/50">
                    <div
                      className="bg-purple-500 h-1.5 rounded-full transition-all duration-500"
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 五、底部区域: 整体趋势 + 实时动态            */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        
        {/* 5.1 平台整体趋势 (左下, col-span-2) */}
        <div className="lg:col-span-2 bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">📊 平台整体趋势</h3>
                <p className="text-[11px] text-slate-400 font-medium">每日总营收 (元) 与新增注册用户 (人) 变化</p>
              </div>
            </div>

            {/* 时间切换: 近7天 / 近30天 */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl text-xs font-bold border border-slate-800">
              <button
                onClick={() => setTrendTimeRange('7')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  trendTimeRange === '7' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                近7天
              </button>
              <button
                onClick={() => setTrendTimeRange('30')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  trendTimeRange === '30' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                近30天
              </button>
            </div>
          </div>

          {/* Recharts 折线图 */}
          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendTimeRange === '7' ? trendData7Days : trendData30Days}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis yAxisId="left" stroke="#818cf8" fontSize={11} tickLine={false} axisLine={false} unit="元" />
                <YAxis yAxisId="right" orientation="right" stroke="#34d399" fontSize={11} tickLine={false} axisLine={false} unit="人" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', borderColor: '#334155', color: '#fff', fontSize: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Line yAxisId="left" type="monotone" dataKey="revenue" name="每日总营收 (¥)" stroke="#818cf8" strokeWidth={3} dot={{ r: 4, fill: '#818cf8' }} activeDot={{ r: 6 }} />
                <Line yAxisId="right" type="monotone" dataKey="users" name="新增用户 (人)" stroke="#34d399" strokeWidth={2.5} strokeDasharray="4 4" dot={{ r: 3, fill: '#34d399' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* 图例说明 */}
          <div className="flex items-center justify-center gap-6 pt-1 text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500" />
              <span>每日总营收 (¥)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-400 border border-dashed border-emerald-500" />
              <span>新增注册用户 (人)</span>
            </span>
          </div>
        </div>

        {/* 5.2 实时动态 (右下, col-span-1) */}
        <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 shadow-xs space-y-3.5 flex flex-col h-full max-h-[380px]">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Activity className="w-4 h-4 animate-pulse text-indigo-400" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-white">🔔 实时动态</h3>
                <p className="text-[11px] text-slate-400 font-medium">30秒自动轮询平台最新流水</p>
              </div>
            </div>
            <span className="text-[10px] text-emerald-400 font-extrabold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              实时
            </span>
          </div>

          {/* 滚动列表 */}
          <div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin pr-1 text-xs">
            {realtimeFeed.map((item) => (
              <div
                key={item.id}
                className="p-2.5 rounded-xl bg-slate-950/60 hover:bg-slate-800/60 transition border border-slate-800/80 flex items-start gap-2.5"
              >
                <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border shrink-0 mt-0.5 ${item.color}`}>
                  {item.type}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-slate-300 font-medium leading-snug">
                    <strong className="text-white font-bold">{item.user}</strong> {item.action}
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-0.5">{item.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* ========================================== */}
      {/* 5.3 异常预警 (底部通栏)                     */}
      {/* ========================================== */}
      <div className="bg-slate-900/80 rounded-2xl border border-rose-900/50 p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-rose-900/40 pb-2.5">
          <div className="flex items-center gap-2 text-rose-400 font-black text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0" />
            <span>⚠️ 异常预警与系统运行监控</span>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            实时诊断 (4 项待关注，其中 2 项紧急)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 text-xs">
          
          {/* 🔴 紧急 1 */}
          <div
            onClick={() => handleNavigate('dataset_audit')}
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 flex items-start justify-between gap-3 hover:bg-rose-900/40 transition cursor-pointer group"
          >
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-white shrink-0 mt-0.5">
                🔴 紧急
              </span>
              <div>
                <span className="font-bold text-rose-100">审核堆积：</span>
                <span className="font-medium text-rose-200">3个数据集/任务待审核超过24小时，请及时处理</span>
              </div>
            </div>
            <span className="text-rose-400 font-bold text-[11px] shrink-0 group-hover:translate-x-0.5 transition">
              去处理 →
            </span>
          </div>

          {/* 🔴 紧急 2 */}
          <div
            onClick={() => handleNavigate('compute_instance')}
            className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-200 flex items-start justify-between gap-3 hover:bg-rose-900/40 transition cursor-pointer group"
          >
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-rose-600 text-white shrink-0 mt-0.5">
                🔴 紧急
              </span>
              <div>
                <span className="font-bold text-rose-100">节点异常：</span>
                <span className="font-medium text-rose-200">电信云-华东1节点GPU显存负载持续高于85%，建议调度扩容</span>
              </div>
            </div>
            <span className="text-rose-400 font-bold text-[11px] shrink-0 group-hover:translate-x-0.5 transition">
              查看节点 →
            </span>
          </div>

          {/* 🟠 提示 1 */}
          <div
            onClick={() => handleNavigate('compute_settlement')}
            className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 text-amber-200 flex items-start justify-between gap-3 hover:bg-amber-900/40 transition cursor-pointer group"
          >
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-600 text-white shrink-0 mt-0.5">
                🟠 提示
              </span>
              <div>
                <span className="font-bold text-amber-100">订单对账：</span>
                <span className="font-medium text-amber-200">2笔算力订单回调处理超时，请前往结算中心核对</span>
              </div>
            </div>
            <span className="text-amber-400 font-bold text-[11px] shrink-0 group-hover:translate-x-0.5 transition">
              核查账单 →
            </span>
          </div>

          {/* 🟠 提示 2 */}
          <div
            onClick={() => handleNavigate('compute_pool')}
            className="p-3 rounded-xl bg-amber-950/40 border border-amber-900/60 text-amber-200 flex items-start justify-between gap-3 hover:bg-amber-900/40 transition cursor-pointer group"
          >
            <div className="flex items-start gap-2">
              <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-amber-600 text-white shrink-0 mt-0.5">
                🟠 提示
              </span>
              <div>
                <span className="font-bold text-amber-100">资源紧张：</span>
                <span className="font-medium text-amber-200">华北资源池 RTX 4090 实例空闲仅剩 2 槽位，利用率达 94%</span>
              </div>
            </div>
            <span className="text-amber-400 font-bold text-[11px] shrink-0 group-hover:translate-x-0.5 transition">
              查看资源池 →
            </span>
          </div>

        </div>
      </div>

      {/* ========================================== */}
      {/* 待办事项明细弹窗 (Pending Tasks Modal)      */}
      {/* ========================================== */}
      {showPendingModal && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl max-w-xl w-full p-6 space-y-5 text-white animate-fade-in">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-950/80 border border-rose-800 flex items-center justify-center text-rose-400 shrink-0">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">📋 待办事项明细处理中心</h3>
                  <p className="text-xs text-slate-400 font-medium">
                    汇总全平台待审核与待核对队列，点击对应的“前往处理”快速完成审查
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowPendingModal(false)}
                className="p-1.5 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Total summary alert */}
            <div className="p-3.5 rounded-2xl bg-rose-950/60 border border-rose-900/60 text-xs font-bold text-rose-200 flex items-center justify-between">
              <span>待处理事项共 <strong className="text-rose-400 font-mono text-sm">12</strong> 项</span>
              <span className="px-2 py-0.5 bg-rose-600 text-white rounded-md text-[10px]">
                🔴 3 项已超过 24 小时未处理 (紧急)
              </span>
            </div>

            {/* List of queues */}
            <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
              
              {/* Queue 1: 数据集 */}
              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 flex items-center justify-between hover:bg-slate-800/60 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800 font-bold flex items-center justify-center text-xs">
                    数
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">数据集发布审核</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      待审核 <span className="font-bold text-white font-mono">3</span> 项 · <span className="text-rose-400 font-bold">🔴 2项超过 24 小时</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('dataset_audit')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>前往处理</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Queue 2: 任务大厅 */}
              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 flex items-center justify-between hover:bg-slate-800/60 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-sky-950 text-sky-400 border border-sky-800 font-bold flex items-center justify-center text-xs">
                    任
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">任务大厅发布审核</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      待审核 <span className="font-bold text-white font-mono">4</span> 项 · <span className="text-rose-400 font-bold">🔴 1项超过 24 小时</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('publish_audit')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>前往处理</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Queue 3: Skill / 插件发布审核 */}
              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 flex items-center justify-between hover:bg-slate-800/60 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-950 text-purple-400 border border-purple-800 font-bold flex items-center justify-center text-xs">
                    技
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">Skill / 插件发布审核</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      待审核 <span className="font-bold text-white font-mono">3</span> 项 · <span className="text-slate-400">常规审查队列</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('skill_audit')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>前往处理</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Queue 4: 算力结算账单核对 */}
              <div className="p-3.5 rounded-2xl border border-slate-800/80 bg-slate-950/60 flex items-center justify-between hover:bg-slate-800/60 transition">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-950 text-amber-400 border border-amber-800 font-bold flex items-center justify-center text-xs">
                    算
                  </div>
                  <div>
                    <div className="text-xs font-bold text-white">算力工坊异常账单核对</div>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      待处理 <span className="font-bold text-white font-mono">2</span> 项 · <span className="text-amber-400 font-bold">🟠 提示项</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('compute_settlement')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>前往处理</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};
