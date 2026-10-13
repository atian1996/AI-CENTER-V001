import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Calendar,
  Users,
  FileCheck2,
  Cpu,
  Building2,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Award,
  Layers,
  ArrowUpRight,
  TrendingUp,
  PieChart as PieIcon,
  CheckCircle2,
  Zap,
  Clock
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { EcoActivityItem } from './mockEcoData';

// 11 场覆盖 2026 年全年 1-10 月的产业活动明细（让“财政花的钱”和“发生的事”一一对应）
export const ANNUAL_ACTIVITIES_LIST: EcoActivityItem[] = [
  {
    id: 'act_2026_01',
    title: '2026 首届 AI 产业创新挑战赛（认知唤醒赛）',
    type: '赛事',
    month: '1月',
    date: '2026-01-15 ~ 2026-01-20',
    participantsCount: 220,
    outputCount: 32,
    serviceCategory: '认知唤醒赛',
    computeConsumed: 1100,
    location: '人工智能产业园学术报告厅 & 在线云端',
    organizer: '市科技局 & 平台运营中心',
    summary: '聚焦企业大模型初体验，通过“低门槛、重应用”的算法竞赛激发全域创新活力，吸引 22 家企业代表队参赛。',
    photos: ['https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['辐射 22 家企业，产出 32 项 Agent 算法雏形', '直接选拔 15 名技术骨干进入春季实训营']
  },
  {
    id: 'act_2026_02',
    title: '大模型落地生态新春技术沙龙（第 1 期）',
    type: '沙龙',
    month: '2月',
    date: '2026-02-22',
    participantsCount: 50,
    outputCount: 4,
    serviceCategory: '社区运营',
    computeConsumed: 180,
    location: '创智空间咖啡厅 & 线上研讨室',
    organizer: 'AI 社区运营组',
    summary: '探讨 DeepSeek/Qwen 开源大模型私有化部署要点与企业数据合规，促进生态企业技术研讨。',
    photos: ['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['交流沉淀 4 套企业私有化部署架构模板', '吸引 18 家本地软件企业工程师参与']
  },
  {
    id: 'act_2026_03',
    title: '企业工程师实训营（第 1 期：工业 Agent 架构实战）',
    type: '实训',
    month: '3月',
    date: '2026-03-05 ~ 2026-03-28',
    participantsCount: 140,
    graduatesCount: 132,
    outputCount: 20,
    serviceCategory: '工程师实训',
    computeConsumed: 2100,
    location: '智能计算实训基地 3 楼机房',
    organizer: '平台实训基地 & 高校联合指导',
    summary: '面向制造与电子信息企业技术骨干，展开脱产强化封闭实训，攻关企业级工业 Agent 场景搭建。',
    photos: ['https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['132 名学员通过综合考核结业', '孵化 20 项高复用工业级 Agent 插件', '参训企业 16 家']
  },
  {
    id: 'act_2026_04',
    title: '智能制造大模型垂直场景沙龙（第 2 期）',
    type: '沙龙',
    month: '4月',
    date: '2026-04-18',
    participantsCount: 60,
    outputCount: 6,
    serviceCategory: '社区运营',
    computeConsumed: 220,
    location: '智能制造产业创新中心',
    organizer: '市工信局指导 / 平台运营部',
    summary: '汇聚 14 家规上工业企业代表，研讨产线质检与数字孪生大模型微调方案，促成供需精准对接。',
    photos: ['https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['发布 6 项典型制造企业 AI 需求清单', '达成 3 项产线智能化合作意向']
  },
  {
    id: 'act_2026_05',
    title: 'AI 创业项目揭榜挂帅路演专场（春季场）',
    type: '路演',
    month: '5月',
    date: '2026-05-20',
    participantsCount: 55,
    outputCount: 4,
    serviceCategory: '揭榜项目',
    computeConsumed: 320,
    location: '紫金创投大厦多功能演播厅',
    organizer: '市发改委 & 产业基金联盟',
    summary: '联动 4 家场景企业出题揭榜，组织优秀生态初创团队现场路演，推进投融资与场景落地。',
    photos: ['https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['现场签约 4 项重点攻坚课题', '达成意向投资 ¥1,200 万元']
  },
  {
    id: 'act_2026_06',
    title: '2026 产业大模型应用攻关赛（夏季赛）',
    type: '赛事',
    month: '6月',
    date: '2026-06-12 ~ 2026-06-25',
    participantsCount: 180,
    outputCount: 25,
    serviceCategory: '认知唤醒赛',
    computeConsumed: 950,
    location: '江北算力中心 & 在线竞技平台',
    organizer: '市科技局 & 平台联合承办',
    summary: '聚焦电子信息与软件行业实际技术痛点，设置代码生成、文档问答等 5 大实战命题赛道。',
    photos: ['https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['25 项高分赛题算法全量沉淀至平台组件库', '吸引 18 家企业战队参战']
  },
  {
    id: 'act_2026_07',
    title: '生物医药大模型与多模态研发沙龙（第 3 期）',
    type: '沙龙',
    month: '7月',
    date: '2026-07-22',
    participantsCount: 55,
    outputCount: 5,
    serviceCategory: '社区运营',
    computeConsumed: 240,
    location: '生物医药谷研发展示中心',
    organizer: '医药创新联盟 & 平台社区组',
    summary: '聚焦药物分子生成、病理切片多模态分析的大模型微调，探讨医药行业算力补贴与数据安全。',
    photos: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['促成 2 家药企接入平台算力池开展虚拟化合物筛选实验', '产出 5 份合规分析报告']
  },
  {
    id: 'act_2026_08',
    title: '全产业链 AI 赋能揭榜挂帅路演专场（秋季场）',
    type: '路演',
    month: '8月',
    date: '2026-08-16',
    participantsCount: 65,
    outputCount: 5,
    serviceCategory: '揭榜项目',
    computeConsumed: 380,
    location: '金融城路演大厅',
    organizer: '市工信局 & 产业基金',
    summary: '聚焦新能源与智能电网领域，发布 6 大重点场景榜单，撮合揭榜团队与龙头企业深入对接。',
    photos: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['5 个揭榜项目达成采购合作意向', '意向签约金额累计突破 ¥1,800 万元']
  },
  {
    id: 'act_2026_09',
    title: '工程师实训营（第 2 期：领域大模型微调与 RAG 落地）',
    type: '实训',
    month: '9月',
    date: '2026-09-02 ~ 2026-09-28',
    participantsCount: 180,
    graduatesCount: 168,
    outputCount: 25,
    serviceCategory: '工程师实训',
    computeConsumed: 2400,
    location: '智能计算实训基地 5 楼机房',
    organizer: '平台实训基地',
    summary: '深度聚焦领域大模型微调优化、知识图谱与企业私有向量库搭建，17 家企业选派研发骨干参与。',
    photos: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['168 名技术骨干结业', '沉淀 25 套行业高可用微调脚本与知识库', '参训企业 17 家']
  },
  {
    id: 'act_2026_09_b',
    title: '开发者生态极客沙龙与开源技术夜（第 4 期）',
    type: '沙龙',
    month: '9月',
    date: '2026-09-26',
    participantsCount: 55,
    outputCount: 7,
    serviceCategory: '社区运营',
    computeConsumed: 260,
    location: '创智咖啡馆 & 线上直播',
    organizer: '平台社区运营组',
    summary: '分享开源端侧模型量化剪枝与向量数据库检索加速实践，增强开发者粘性与社区活跃度。',
    photos: ['https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['沉淀 7 套开源量化工具包', '当月社区讨论帖新增 200+ 篇']
  },
  {
    id: 'act_2026_10',
    title: '2026 南京产业智能场景挑战赛年度总决赛',
    type: '赛事',
    month: '10月',
    date: '2026-10-08 ~ 2026-10-11',
    participantsCount: 220,
    outputCount: 32,
    serviceCategory: '认知唤醒赛',
    computeConsumed: 1150,
    location: '国际博览中心会议大厅',
    organizer: '市人民政府指导 / 市科技局与平台联合承办',
    summary: '年度最高规格产业 AI 盛会，汇集智能制造、电子信息、生物医药、新能源四大赛道优胜团队会师决赛。',
    photos: ['https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'],
    keyAchievements: ['评选表彰 15 个一二三等奖项目', '促成 32 项核心成果入库', '辐射参赛企业 34 家']
  }
];

// 活动类型色彩与标签配置
export const ACTIVITY_TYPE_CONFIG: Record<
  string,
  {
    color: string;
    bgBadge: string;
    textBadge: string;
    borderBadge: string;
    barColor: string;
  }
> = {
  赛事: {
    color: '#3b82f6',
    bgBadge: 'bg-blue-500/20',
    textBadge: 'text-blue-300',
    borderBadge: 'border-blue-500/40',
    barColor: '#3b82f6'
  },
  实训: {
    color: '#10b981',
    bgBadge: 'bg-emerald-500/20',
    textBadge: 'text-emerald-300',
    borderBadge: 'border-emerald-500/40',
    barColor: '#10b981'
  },
  沙龙: {
    color: '#f59e0b',
    bgBadge: 'bg-amber-500/20',
    textBadge: 'text-amber-300',
    borderBadge: 'border-amber-500/40',
    barColor: '#f59e0b'
  },
  路演: {
    color: '#8b5cf6',
    bgBadge: 'bg-purple-500/20',
    textBadge: 'text-purple-300',
    borderBadge: 'border-purple-500/40',
    barColor: '#8b5cf6'
  }
};

// 第三行图表 1：活动类型分布饼图数据
export const ACTIVITY_DISTRIBUTION_PIE = [
  { name: '赛事', count: 3, percentage: 27, color: '#3b82f6' },
  { name: '实训', count: 2, percentage: 18, color: '#10b981' },
  { name: '沙龙', count: 4, percentage: 37, color: '#f59e0b' },
  { name: '路演', count: 2, percentage: 18, color: '#8b5cf6' }
];

// 第三行图表 2：年度产出汇总柱状图数据
export const ANNUAL_OUTPUT_BARS = [
  { label: '赛事成果', count: 89, max: 100, color: '#3b82f6', note: '来自 3 场赛事实战沉淀' },
  { label: '实训作品', count: 45, max: 100, color: '#10b981', note: '来自 2 期工程师实训营结业' },
  { label: '沙龙交流', count: 14, max: 100, color: '#f59e0b', note: '来自 4 场技术沙龙研讨架构' },
  { label: '路演签约', count: 8, max: 100, color: '#8b5cf6', note: '来自 2 场揭榜挂帅签约意向' }
];

interface EcoActivitiesTabProps {
  onSelectActivity?: (activity: EcoActivityItem) => void;
}

export const EcoActivitiesTab: React.FC<EcoActivitiesTabProps> = ({
  onSelectActivity
}) => {
  // 当前高亮选中的活动卡片索引 (0 ~ 10)
  const [activeIndex, setActiveIndex] = useState<number>(0);
  // 是否正在自动轮播 (每5秒切换一个活动，适合大屏汇报)
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(true);

  // 5秒自动轮播高亮
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex(prev => (prev + 1) % ANNUAL_ACTIVITIES_LIST.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeActivity = ANNUAL_ACTIVITIES_LIST[activeIndex] || ANNUAL_ACTIVITIES_LIST[0];

  const handlePrev = () => {
    setActiveIndex(prev => (prev === 0 ? ANNUAL_ACTIVITIES_LIST.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex(prev => (prev + 1) % ANNUAL_ACTIVITIES_LIST.length);
  };

  return (
    <div className="w-full text-slate-100 flex flex-col gap-2.5 select-none h-full">
      
      {/* 顶部标题栏 (约50px) */}
      <div className="flex items-center justify-between px-1 shrink-0 h-9">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shadow-sm shadow-amber-400" />
          <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
            AI生态看板 · 年度活动汇总
          </h2>
          <span className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-sans hidden sm:inline-block">
            财政投入与业务事项对应时间轴
          </span>
        </div>
        <div className="text-xs font-mono font-bold text-slate-300 bg-slate-900/90 px-3.5 py-1 rounded-xl border border-slate-800 shadow-sm flex items-center gap-2">
          <span>2026年10月12日</span>
          <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            自动轮播中 (5s)
          </span>
        </div>
      </div>

      {/* 第一行：五个核心汇总指标卡片 (横向等宽排列，高度适配1920*1080) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 shrink-0 h-[135px]">
        
        {/* 卡片 1：产业活动举办场次 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-amber-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">产业活动举办场次</span>
            <span className="p-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Trophy className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-white tracking-tight leading-none">11</span>
              <span className="text-xs text-slate-400 font-normal ml-1">场</span>
            </div>
            <div className="text-xs text-amber-300 font-medium mt-1">
              四大业务形态联动
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            赛事 <span className="font-mono text-blue-300">3</span> / 实训 <span className="font-mono text-emerald-300">2</span> / 沙龙 <span className="font-mono text-amber-300">4</span> / 路演 <span className="font-mono text-purple-300">2</span>
          </div>
        </div>

        {/* 卡片 2：活动参与规模 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">活动参与规模</span>
            <span className="p-1 rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-blue-400 tracking-tight leading-none">1,280</span>
              <span className="text-xs text-slate-400 font-normal ml-1">人次</span>
            </div>
            <div className="text-xs text-blue-300 font-medium mt-1">
              高校与产业人才共聚
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            赛事 <span className="font-mono text-slate-200">620</span> / 实训 <span className="font-mono text-slate-200">320</span> / 沙龙 <span className="font-mono text-slate-200">220</span>
          </div>
        </div>

        {/* 卡片 3：产业成果产出 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-emerald-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">产业成果产出</span>
            <span className="p-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <FileCheck2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-emerald-400 tracking-tight leading-none">156</span>
              <span className="text-xs text-slate-400 font-normal ml-1">项</span>
            </div>
            <div className="text-xs text-emerald-300 font-medium mt-1">
              成果转化率达标
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            赛事 <span className="font-mono text-slate-200">89</span> / 实训 <span className="font-mono text-slate-200">45</span> / 其他 <span className="font-mono text-slate-200">22</span>
          </div>
        </div>

        {/* 卡片 4：算力资源投入 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-cyan-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">算力资源投入</span>
            <span className="p-1 rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Cpu className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-cyan-400 tracking-tight leading-none">12,580</span>
              <span className="text-xs text-slate-400 font-normal ml-1">卡时</span>
            </div>
            <div className="text-xs text-cyan-300 font-medium mt-1">
              全额公共算力保障
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            赛事 <span className="font-mono text-slate-200">3,200</span> / 实训 <span className="font-mono text-slate-200">4,500</span>
          </div>
        </div>

        {/* 卡片 5：活动覆盖企业 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-purple-500/10 h-full">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">活动覆盖企业</span>
            <span className="p-1 rounded-md bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Building2 className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="my-1">
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-bold font-mono text-purple-400 tracking-tight leading-none">89</span>
              <span className="text-xs text-slate-400 font-normal ml-1">家</span>
            </div>
            <div className="text-xs text-purple-300 font-medium mt-1">
              产业领航标杆企业
            </div>
          </div>
          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 truncate">
            参赛企业 <span className="font-mono text-slate-200">56</span> / 实训企业 <span className="font-mono text-slate-200">33</span>
          </div>
        </div>

      </div>

      {/* 第二行：活动时间轴（自动轮播与高亮聚焦，高度扩展至 460px） */}
      <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md shrink-0 h-[460px]">
        {/* 时间轴标题与控制栏 */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-black text-white">
              年度活动全景脉络时间轴
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              (2026年1月 — 10月，共 11 场，每 5 秒自动轮播)
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* 图例 */}
            <div className="flex items-center gap-3 text-[11px] hidden md:flex font-medium">
              <span className="flex items-center gap-1.5 text-blue-300">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                赛事 (3场)
              </span>
              <span className="flex items-center gap-1.5 text-emerald-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                实训 (2期)
              </span>
              <span className="flex items-center gap-1.5 text-amber-300">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                沙龙 (4场)
              </span>
              <span className="flex items-center gap-1.5 text-purple-300">
                <span className="w-2 h-2 rounded-full bg-purple-500" />
                路演 (2场)
              </span>
            </div>

            {/* 播放/暂停 & 上下切换 */}
            <div className="flex items-center gap-1 bg-slate-950 p-0.5 rounded-xl border border-slate-800">
              <button
                onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                className={`p-1 rounded-lg text-xs transition cursor-pointer ${
                  isAutoPlaying ? 'bg-amber-500/20 text-amber-400' : 'text-slate-400 hover:text-white'
                }`}
                title={isAutoPlaying ? '暂停轮播' : '恢复轮播'}
              >
                {isAutoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={handlePrev}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="上一个活动"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleNext}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="下一个活动"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* 横向时间轴滑轨：11 个节点的流线进度条 */}
        <div className="relative pt-2 pb-1 shrink-0 overflow-x-hidden">
          {/* 贯穿轴线 */}
          <div className="absolute top-4 left-3 right-3 h-0.5 bg-slate-800" />
          <div
            className="absolute top-4 left-3 h-0.5 bg-gradient-to-r from-blue-500 via-emerald-500 to-amber-500 transition-all duration-500"
            style={{ width: `${(activeIndex / (ANNUAL_ACTIVITIES_LIST.length - 1)) * 96}%` }}
          />

          {/* 11 个时间轴圆点节点 */}
          <div className="relative flex justify-between px-1">
            {ANNUAL_ACTIVITIES_LIST.map((act, idx) => {
              const isSelected = idx === activeIndex;
              const typeCfg = ACTIVITY_TYPE_CONFIG[act.type] || ACTIVITY_TYPE_CONFIG['赛事'];
              return (
                <button
                  key={act.id}
                  onClick={() => setActiveIndex(idx)}
                  className="group flex flex-col items-center cursor-pointer transition-all duration-300"
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-300 flex items-center justify-center ${
                      isSelected
                        ? 'ring-4 ring-amber-400/30 scale-125'
                        : 'bg-slate-800 hover:bg-slate-700'
                    }`}
                    style={{ backgroundColor: isSelected ? typeCfg.color : undefined }}
                  >
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-1 transition-colors ${
                      isSelected ? 'font-black text-amber-300' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  >
                    {act.month}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 当前选中的高亮活动大卡片（突出显示主旨、人次、成果、算力、服务项） */}
        <div className="mt-1 flex-1 bg-slate-950/90 border border-amber-500/30 rounded-xl p-3.5 flex flex-col justify-between shadow-inner relative overflow-hidden group">
          <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />

          {/* 上部：标题与标签 */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
                  ACTIVITY_TYPE_CONFIG[activeActivity.type].bgBadge
                } ${ACTIVITY_TYPE_CONFIG[activeActivity.type].textBadge} ${
                  ACTIVITY_TYPE_CONFIG[activeActivity.type].borderBadge
                }`}
              >
                {activeActivity.type}
              </span>
              <h3 className="text-sm lg:text-base font-black text-white flex items-center gap-2">
                {activeActivity.title}
              </h3>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                {activeActivity.date}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400">
                对应服务项：
                <span className="text-amber-300 font-bold ml-1">{activeActivity.serviceCategory}</span>
              </span>
              {onSelectActivity && (
                <button
                  onClick={() => onSelectActivity(activeActivity)}
                  className="px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/40 text-[11px] font-bold transition flex items-center gap-1 cursor-pointer"
                >
                  <span>查看详情</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* 中部：核心效益四宫格指标 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-2">
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-blue-500/10 text-blue-400 shrink-0">
                <Users className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-400">参与规模</div>
                <div className="text-sm font-black font-mono text-white truncate">
                  {activeActivity.participantsCount}
                  <span className="text-[10px] text-slate-400 font-sans ml-0.5">人次</span>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-emerald-500/10 text-emerald-400 shrink-0">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-400">产出成果</div>
                <div className="text-sm font-black font-mono text-emerald-400 truncate">
                  {activeActivity.outputCount}
                  <span className="text-[10px] text-slate-400 font-sans ml-0.5">项</span>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-cyan-500/10 text-cyan-400 shrink-0">
                <Cpu className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-400">算力消耗</div>
                <div className="text-sm font-black font-mono text-cyan-400 truncate">
                  {activeActivity.computeConsumed}
                  <span className="text-[10px] text-slate-400 font-sans ml-0.5">卡时</span>
                </div>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center gap-2.5">
              <div className="p-1.5 rounded-md bg-purple-500/10 text-purple-400 shrink-0">
                <Building2 className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <div className="text-[10px] text-slate-400">主办及指导</div>
                <div className="text-xs font-bold text-slate-200 truncate">
                  {activeActivity.organizer}
                </div>
              </div>
            </div>
          </div>

          {/* 下部：业务主旨与核心成效 */}
          <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <p className="text-slate-300 truncate max-w-2xl">
              <span className="text-amber-400 font-bold mr-1">活动纪要：</span>
              {activeActivity.summary}
            </p>
            <div className="text-[11px] text-slate-400 flex items-center gap-1.5 shrink-0 font-mono">
              <Clock className="w-3 h-3 text-amber-400" />
              <span>当前第 {activeIndex + 1} / {ANNUAL_ACTIVITIES_LIST.length} 场</span>
            </div>
          </div>
        </div>
      </div>

      {/* 第三行：活动类型分布 + 年度产出汇总 (高度适配 345px) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 shrink-0 h-[345px]">
        
        {/* 左侧：活动类型分布 (环形图) */}
        <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md h-full">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-black text-white">活动类型分布</span>
            </div>
            <span className="text-xs text-slate-400 font-mono">全年共 11 场重点活动</span>
          </div>

          <div className="flex items-center justify-between gap-4 flex-1 min-h-0 py-1">
            {/* 环形图 */}
            <div className="w-[170px] h-[155px] relative shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ACTIVITY_DISTRIBUTION_PIE}
                    dataKey="count"
                    nameKey="name"
                    innerRadius={42}
                    outerRadius={68}
                    paddingAngle={3}
                    stroke="none"
                  >
                    {ACTIVITY_DISTRIBUTION_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-slate-950/95 border border-slate-700 px-2.5 py-1.5 rounded-lg shadow-xl text-xs">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: data.color }} />
                              {data.name}
                            </div>
                            <div className="text-slate-300 mt-1">
                              场次：<span className="font-mono font-bold text-white">{data.count} 场</span> ({data.percentage}%)
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* 环形中心数据 */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-lg font-black font-mono text-white leading-none">11</span>
                <span className="text-[10px] text-slate-400 mt-0.5">举办总场次</span>
              </div>
            </div>

            {/* 图例与拆解说明 */}
            <div className="flex-1 grid grid-cols-2 gap-2 text-xs">
              {ACTIVITY_DISTRIBUTION_PIE.map(item => (
                <div
                  key={item.name}
                  className="p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col justify-between"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-1.5 text-slate-300 font-bold">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                      {item.name}
                    </span>
                    <span className="font-mono text-slate-400">{item.percentage}%</span>
                  </div>
                  <div className="text-base font-black font-mono text-white mt-1">
                    {item.count}
                    <span className="text-[10px] text-slate-400 font-sans ml-1 font-normal">场</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
            <span>赛事 3 场 · 实训 2 期 · 沙龙 4 场 · 路演 2 场</span>
            <span className="text-slate-500 font-mono">重点活动闭环推进</span>
          </div>
        </div>

        {/* 右侧：年度产出汇总 (条形柱状图) */}
        <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-2xl flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between pb-1.5 border-b border-slate-800 shrink-0">
            <div className="flex items-center gap-2">
              <Award className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-xs font-black text-white">年度产出汇总</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-400">累计产出 156 项</span>
          </div>

          <div className="flex flex-col justify-around flex-1 py-1 space-y-2">
            {ANNUAL_OUTPUT_BARS.map(bar => (
              <div key={bar.label} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-bold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: bar.color }} />
                    {bar.label}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 hidden sm:inline">{bar.note}</span>
                    <span className="font-mono font-black text-white text-xs">{bar.count} 项</span>
                  </div>
                </div>
                <div className="h-2 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${(bar.count / bar.max) * 100}%`,
                      backgroundColor: bar.color
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80 flex items-center justify-between">
            <span>赛事成果 89 项 ｜ 实训作品 45 项 ｜ 沙龙交流 14 项 ｜ 路演签约 8 项</span>
            <span className="text-slate-500 font-mono">成果转化率 35.9%</span>
          </div>
        </div>

      </div>

    </div>
  );
};
