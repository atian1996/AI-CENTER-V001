import React, { useState, useEffect } from 'react';
import {
  FileText,
  Download,
  Users,
  Briefcase,
  Building2,
  Cpu,
  Search,
  Filter,
  TrendingUp,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Play,
  Pause
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  mockV2TalentRecords,
  mockV2CaseLedgerRecords,
  mockV2EnterpriseLedgerRecords,
  mockV2ComputeLedgerRecords,
  mockV2EnterpriseTypes
} from './mockEcoV2Data';
import { useApp } from '../../../../context/AppContext';

export const EcoV2LedgersTab: React.FC = () => {
  const { showToast } = useApp();

  // 当前激活的台账分类：'talents' | 'cases' | 'enterprises' | 'compute'
  const [activeLedger, setActiveLedger] = useState<'talents' | 'cases' | 'enterprises' | 'compute'>('talents');

  // 明细搜索
  const [searchQuery, setSearchQuery] = useState('');
  // 自动滚动开关
  const [isAutoScroll, setIsAutoScroll] = useState(true);
  const [scrollIndex, setScrollIndex] = useState(0);

  // 12 个月人才台账月度趋势数据
  const talentTrendData = [
    { month: '25.11', 结业: 15, 认证: 10, 普惠: 90 },
    { month: '25.12', 结业: 22, 认证: 16, 普惠: 140 },
    { month: '26.01', 结业: 35, 认证: 25, 普惠: 210 },
    { month: '26.02', 结业: 42, 认证: 32, 普惠: 270 },
    { month: '26.03', 结业: 58, 认证: 45, 普惠: 360 },
    { month: '26.04', 结业: 70, 认证: 55, 普惠: 430 },
    { month: '26.05', 结业: 82, 认证: 66, 普惠: 510 },
    { month: '26.06', 结业: 94, 认证: 75, 普惠: 590 },
    { month: '26.07', 结业: 102, 认证: 82, 普惠: 640 },
    { month: '26.08', 结业: 110, 认证: 89, 普惠: 690 },
    { month: '26.09', 结业: 114, 认证: 93, 普惠: 730 },
    { month: '26.10', 结业: 118, 认证: 96, 普惠: 760 },
  ];

  // 案例台账趋势数据
  const caseTrendData = [
    { month: '26.01', 落地: 8, 试点: 5, 签约: 4 },
    { month: '26.03', 落地: 16, 试点: 12, 签约: 8 },
    { month: '26.05', 落地: 28, 试点: 22, 签约: 15 },
    { month: '26.07', 落地: 39, 试点: 31, 签约: 22 },
    { month: '26.09', 落地: 48, 试点: 38, 签约: 27 },
    { month: '26.10', 落地: 56, 试点: 42, 签约: 30 },
  ];

  // 算力台账用量趋势
  const computeTrendData = [
    { quarter: 'Q1', 昇腾集群: 1200, 通用GPU: 1100, 异构混合: 500 },
    { quarter: 'Q2', 昇腾集群: 5800, 通用GPU: 4600, 异构混合: 2000 },
    { quarter: 'Q3', 昇腾集群: 8200, 通用GPU: 5900, 异构混合: 2700 },
    { quarter: 'Q4至今', 昇腾集群: 2400, 通用GPU: 1600, 异构混合: 800 },
  ];

  // 每 5 秒自动向上滚动明细
  useEffect(() => {
    if (!isAutoScroll) return;
    const timer = setInterval(() => {
      setScrollIndex(prev => (prev + 1) % 10);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoScroll]);

  const handleExport = () => {
    showToast('已启动台账数据导出，正在生成《数据台账汇总验收合规全卷报告.xlsx》');
  };

  return (
    <div className="w-full text-slate-100 space-y-5 select-none font-sans">
      
      {/* 1. 顶部标题栏 */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 pt-2 pb-1 border-b border-slate-800/80">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">
            数据台账汇总
          </h1>
        </div>

        <button
          onClick={handleExport}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-600/30 border border-emerald-400/40 flex items-center gap-2 cursor-pointer transition transform hover:scale-[1.02] self-start md:self-auto"
        >
          <Download className="w-4 h-4 text-white" />
          <span>导出完整台账报告</span>
        </button>
      </div>

      {/* 2. 台账分类标签（高度约60px） */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <button
          onClick={() => setActiveLedger('talents')}
          className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
            activeLedger === 'talents'
              ? 'bg-slate-900 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 ring-1 ring-indigo-400/40'
              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <div>
            <div className="text-sm font-extrabold flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>人才台账</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">结业与认证名单 (118/96人)</div>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-400">01</span>
        </button>

        <button
          onClick={() => setActiveLedger('cases')}
          className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
            activeLedger === 'cases'
              ? 'bg-slate-900 border-cyan-500 text-white shadow-lg shadow-cyan-600/20 ring-1 ring-cyan-400/40'
              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <div>
            <div className="text-sm font-extrabold flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-cyan-400" />
              <span>案例台账</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">可追溯到主体的成果 (128项)</div>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400">02</span>
        </button>

        <button
          onClick={() => setActiveLedger('enterprises')}
          className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
            activeLedger === 'enterprises'
              ? 'bg-slate-900 border-amber-500 text-white shadow-lg shadow-amber-600/20 ring-1 ring-amber-400/40'
              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <div>
            <div className="text-sm font-extrabold flex items-center gap-2">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span>企业台账</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">入驻与注册数 (58家实体)</div>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400">03</span>
        </button>

        <button
          onClick={() => setActiveLedger('compute')}
          className={`p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between cursor-pointer ${
            activeLedger === 'compute'
              ? 'bg-slate-900 border-emerald-500 text-white shadow-lg shadow-emerald-600/20 ring-1 ring-emerald-400/40'
              : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:bg-slate-900 hover:text-slate-200'
          }`}
        >
          <div>
            <div className="text-sm font-extrabold flex items-center gap-2">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>用量台账</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">资源池对账数据 (36,800卡时)</div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-400">04</span>
        </button>
      </div>

      {/* 3. 台账数据展示区（核心指标 + 趋势图 + 构成明细，高度约700px） */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
        
        {/* 顶部副标题 */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <h2 className="text-base font-extrabold text-white">
              {activeLedger === 'talents' && '人才台账 · 考培认证与实训档案'}
              {activeLedger === 'cases' && '案例台账 · 产业化落地与降本增效凭证'}
              {activeLedger === 'enterprises' && '企业台账 · 招商入驻与规上后备培育底册'}
              {activeLedger === 'compute' && '用量台账 · 公共算力消纳与对账结算清单'}
            </h2>
          </div>
          <span className="text-xs text-slate-400">数据源直接挂钩项目中期考核验收口径</span>
        </div>

        {/* 三栏布局：左侧核心指标卡 (宽约400px)，中间趋势图 (宽约800px)，右侧构成明细 (宽约600px) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* 左侧：核心指标台账卡 (占 3 列) */}
          <div className="lg:col-span-3 space-y-3">
            {activeLedger === 'talents' && (
              <>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">实训结业人数</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">118 <span className="text-xs font-normal text-slate-400">/ 160 人</span></div>
                  <div className="text-xs text-emerald-400 font-bold mt-1">目标完成率 74%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">专业技术认证人数</div>
                  <div className="text-2xl font-black text-purple-300 font-mono mt-1">96 <span className="text-xs font-normal text-slate-400">/ 130 人</span></div>
                  <div className="text-xs text-purple-400 font-bold mt-1">目标完成率 74%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">普惠培养规模</div>
                  <div className="text-2xl font-black text-blue-400 font-mono mt-1">760 <span className="text-xs font-normal text-slate-400">/ 1,000 人次</span></div>
                  <div className="text-xs text-blue-400 font-bold mt-1">目标完成率 76%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">特聘导师与企业讲师</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">44 <span className="text-xs font-normal text-slate-400">位</span></div>
                  <div className="text-xs text-slate-400 mt-1">均有省市工信委备案</div>
                </div>
              </>
            )}

            {activeLedger === 'cases' && (
              <>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">核心AI落地项目实体</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">6 <span className="text-xs font-normal text-slate-400">个</span></div>
                  <div className="text-xs text-emerald-400 font-bold mt-1">本季度新增 +2</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">企业降本增效案例</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">24 <span className="text-xs font-normal text-slate-400">个</span></div>
                  <div className="text-xs text-emerald-300 font-bold mt-1">财务核验可追溯</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">揭榜产业化攻坚项目</div>
                  <div className="text-2xl font-black text-blue-400 font-mono mt-1">2 <span className="text-xs font-normal text-slate-400">项</span></div>
                  <div className="text-xs text-blue-300 font-bold mt-1">产值相关度达标</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">赛事获奖落地注册</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">3 <span className="text-xs font-normal text-slate-400">家</span></div>
                  <div className="text-xs text-amber-300 font-bold mt-1">均完成工商实缴</div>
                </div>
              </>
            )}

            {activeLedger === 'enterprises' && (
              <>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">辖区入驻企业</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">11 <span className="text-xs font-normal text-slate-400">家</span></div>
                  <div className="text-xs text-emerald-400 font-bold mt-1">入驻率 58%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">规上企业入统</div>
                  <div className="text-2xl font-black text-amber-400 font-mono mt-1">1 <span className="text-xs font-normal text-slate-400">/ 3 家</span></div>
                  <div className="text-xs text-amber-300 font-bold mt-1">智造精工已入库</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">规上后备培育企业</div>
                  <div className="text-2xl font-black text-blue-400 font-mono mt-1">4 <span className="text-xs font-normal text-slate-400">家</span></div>
                  <div className="text-xs text-blue-300 font-bold mt-1">专班专项辅导中</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">入驻实体总数</div>
                  <div className="text-2xl font-black text-purple-400 font-mono mt-1">58 <span className="text-xs font-normal text-slate-400">家</span></div>
                  <div className="text-xs text-purple-300 font-bold mt-1">多元生态集聚</div>
                </div>
              </>
            )}

            {activeLedger === 'compute' && (
              <>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">年度算力消纳总量</div>
                  <div className="text-2xl font-black text-white font-mono mt-1">36,800 <span className="text-xs font-normal text-slate-400">卡时</span></div>
                  <div className="text-xs text-amber-400 font-bold mt-1">基准 54,200 (68%)</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">累计资源池结算金额</div>
                  <div className="text-2xl font-black text-emerald-400 font-mono mt-1">1,840 <span className="text-xs font-normal text-slate-400">万元</span></div>
                  <div className="text-xs text-emerald-300 font-bold mt-1">按卡时计量对账</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">Q3用量消纳</div>
                  <div className="text-2xl font-black text-blue-400 font-mono mt-1">16,800 <span className="text-xs font-normal text-slate-400">卡时</span></div>
                  <div className="text-xs text-blue-300 font-bold mt-1">环比增长 +12%</div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800">
                  <div className="text-xs text-slate-400">已对账资源池集群</div>
                  <div className="text-2xl font-black text-purple-400 font-mono mt-1">4 <span className="text-xs font-normal text-slate-400">个</span></div>
                  <div className="text-xs text-purple-300 font-bold mt-1">异构互联调度</div>
                </div>
              </>
            )}
          </div>

          {/* 中间：台账趋势图 (占 5 列) */}
          <div className="lg:col-span-5 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-slate-300">
                {activeLedger === 'talents' && '近12个月人才培育与认证变化趋势'}
                {activeLedger === 'cases' && '近6个月产业化成果与落地转化推进趋势'}
                {activeLedger === 'enterprises' && '入驻实体与规上培育月度推进趋势'}
                {activeLedger === 'compute' && '各季度算力资源池消纳与对账走势'}
              </span>
              <span className="text-[11px] text-slate-500 font-mono">12个月时序</span>
            </div>

            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                {activeLedger === 'talents' ? (
                  <LineChart data={talentTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="普惠" stroke="#3B82F6" strokeWidth={2} dot={false} />
                    <Line type="monotone" dataKey="结业" stroke="#10B981" strokeWidth={2.5} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="认证" stroke="#8B5CF6" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                ) : activeLedger === 'cases' ? (
                  <LineChart data={caseTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="month" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Line type="monotone" dataKey="落地" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                    <Line type="monotone" dataKey="试点" stroke="#06B6D4" strokeWidth={2} dot={{ r: 2 }} />
                    <Line type="monotone" dataKey="签约" stroke="#F59E0B" strokeWidth={2} dot={{ r: 2 }} />
                  </LineChart>
                ) : (
                  <BarChart data={computeTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <XAxis dataKey="quarter" stroke="#64748B" fontSize={10} tickLine={false} />
                    <YAxis stroke="#64748B" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }} />
                    <Bar dataKey="昇腾集群" fill="#3B82F6" stackId="a" radius={[2, 2, 0, 0]} />
                    <Bar dataKey="通用GPU" fill="#10B981" stackId="a" />
                    <Bar dataKey="异构混合" fill="#F59E0B" stackId="a" />
                  </BarChart>
                )}
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
              <span>绿线：实训结业/落地 · 紫线：专业认证 · 蓝柱：国产昇腾</span>
              <span>数据出处：验收台账组</span>
            </div>
          </div>

          {/* 右侧：台账构成明细 (占 4 列) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col justify-between space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-slate-300">台账拆解构成明细</span>
              <span className="text-[11px] text-slate-500">穿透细项</span>
            </div>

            {activeLedger === 'talents' && (
              <div className="space-y-2 py-1 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">大模型微调应用实训</div>
                    <div className="text-[11px] text-slate-400">涵盖YOLO、多模态、Agent实训</div>
                  </div>
                  <span className="font-black text-emerald-400 font-mono">68 人结业</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">高级AI算法工程师认证</div>
                    <div className="text-[11px] text-slate-400">工信教考中心联合考培</div>
                  </div>
                  <span className="font-black text-purple-300 font-mono">52 人获证</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">高校研究生联合培养</div>
                    <div className="text-[11px] text-slate-400">南大、东南联合科研课题</div>
                  </div>
                  <span className="font-black text-blue-400 font-mono">44 人在册</span>
                </div>
              </div>
            )}

            {activeLedger === 'cases' && (
              <div className="space-y-2 py-1 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">智能制造与工业质检</div>
                    <div className="text-[11px] text-slate-400">江宁智造精工等38项</div>
                  </div>
                  <span className="font-black text-emerald-400 font-mono">38 项</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">电子信息与半导体EDA</div>
                    <div className="text-[11px] text-slate-400">芯灵半导体等32项</div>
                  </div>
                  <span className="font-black text-cyan-400 font-mono">32 项</span>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                  <div>
                    <div className="font-bold text-white">生物医药化合物筛选</div>
                    <div className="text-[11px] text-slate-400">博奥基因等24项</div>
                  </div>
                  <span className="font-black text-blue-400 font-mono">24 项</span>
                </div>
              </div>
            )}

            {activeLedger === 'enterprises' && (
              <div className="space-y-2 py-1 text-xs">
                {mockV2EnterpriseTypes.slice(0, 3).map((item, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{item.type}</div>
                      <div className="text-[11px] text-slate-400">{item.desc}</div>
                    </div>
                    <span className="font-black text-amber-300 font-mono">{item.count} 家</span>
                  </div>
                ))}
              </div>
            )}

            {activeLedger === 'compute' && (
              <div className="space-y-2 py-1 text-xs">
                {mockV2ComputeLedgerRecords.slice(0, 3).map((item, i) => (
                  <div key={i} className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white truncate max-w-[160px]">{item.pool}</div>
                      <div className="text-[11px] text-slate-400">{item.quarter}结算：{item.cost}</div>
                    </div>
                    <span className="font-black text-emerald-400 font-mono">{item.sharePct}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="text-[11px] text-slate-500 text-right pt-2 border-t border-slate-800/80">
              经第三方会计师事务所审计复核
            </div>
          </div>

        </div>
      </div>

      {/* 4. 台账明细滚动列表（逐条记录，每5秒自动向上滚动一行，高度约280px） */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>台账逐条明细记录核对表</span>
            </h3>
            <button
              onClick={() => setIsAutoScroll(!isAutoScroll)}
              className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {isAutoScroll ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isAutoScroll ? '自动滚动中(5s)' : '已暂停'}</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索单条记录/姓名/企业..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-2.5 py-1 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-52"
            />
          </div>
        </div>

        {/* 滚动表格容器 */}
        <div className="h-[220px] overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
          {activeLedger === 'talents' && (
            mockV2TalentRecords.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">{item.id}</span>
                  <span className="font-bold text-white font-sans">{item.name}</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-indigo-900/30 text-indigo-300 border border-indigo-800/40">{item.type}</span>
                </div>
                <div className="text-slate-300 font-sans truncate max-w-xs">{item.courseOrLevel}</div>
                <div className="text-slate-400 text-[11px] font-sans truncate">{item.unit}</div>
                <div className="text-slate-400">{item.time}</div>
                <div className="text-emerald-400 font-bold font-sans">{item.status}</div>
              </div>
            ))
          )}

          {activeLedger === 'cases' && (
            mockV2CaseLedgerRecords.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-[200px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">{item.id}</span>
                  <span className="font-bold text-white font-sans">{item.name}</span>
                  <span className="text-[11px] px-1.5 py-0.2 rounded bg-cyan-900/30 text-cyan-300 border border-cyan-800/40">{item.type}</span>
                </div>
                <div className="text-slate-300 font-sans">{item.company} · {item.district}</div>
                <div className="text-blue-400">{item.compute}</div>
                <div className="text-amber-400 font-bold font-sans">{item.output}</div>
              </div>
            ))
          )}

          {activeLedger === 'enterprises' && (
            mockV2EnterpriseLedgerRecords.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-[240px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">{item.id}</span>
                  <span className="font-bold text-white font-sans">{item.name}</span>
                </div>
                <div className="text-slate-300 font-sans">{item.category} · {item.district}</div>
                <div className="text-slate-400 font-sans">租赁 {item.rentArea}</div>
                <div className="text-amber-400 font-bold font-sans">{item.status}</div>
              </div>
            ))
          )}

          {activeLedger === 'compute' && (
            mockV2ComputeLedgerRecords.map(item => (
              <div key={item.id} className="p-2.5 rounded-xl bg-slate-950/70 hover:bg-slate-950 border border-slate-800/80 flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-[240px]">
                  <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px]">{item.id}</span>
                  <span className="font-bold text-white font-sans">{item.pool}</span>
                </div>
                <div className="text-slate-300 font-sans">{item.quarter} 消纳 {item.totalHours}</div>
                <div className="text-emerald-400 font-bold font-sans">结算 {item.cost}</div>
                <div className="text-cyan-400 font-bold font-sans">{item.status}</div>
              </div>
            ))
          )}
        </div>

        {/* 底部说明 */}
        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-end text-xs">
          <div className="text-slate-500 text-[11px]">
            数据台账汇总全部支持溯源至合同盖章扫描件与电子发票对账单
          </div>
        </div>
      </div>

    </div>
  );
};
