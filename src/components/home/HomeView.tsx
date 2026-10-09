import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, AgentItem } from '../../types';
import { TaskDetailSubPage } from '../tasks/TaskDetailSubPage';
import { 
  Bot, 
  Briefcase, 
  Cpu, 
  Calendar, 
  Sparkles, 
  Flame, 
  ArrowRight, 
  Megaphone, 
  Trophy, 
  TrendingUp, 
  Award,
  Zap,
  Activity,
  UserCheck,
  Palette,
  BarChart3,
  ShieldAlert,
  Landmark,
  Rocket,
  MessageSquare,
  Clock,
  Coins,
  CheckCircle2,
  Users,
  Layers,
  ChevronRight,
  ExternalLink,
  Star,
  Tag,
  ShieldCheck,
  FileText,
  Boxes,
  Compass,
  Play,
  Heart,
  Eye,
  Building2,
  Check,
  Server,
  Sparkle,
  Search,
  Code2,
  Gift,
  X,
  Database,
  Download
} from 'lucide-react';

// 赛事中心 4 大官方赛道卡片数据（融合高质感科技插画背景与前沿赛题）
const competitionTrackCards = [
  {
    id: 'ai_data_science',
    title: 'AI数据科学赛',
    englishTitle: 'AI Data Science Track',
    slogan: '挖掘时序与多模态数据深度特征',
    desc: '基于近千万条金融行情与脱敏新闻语料，构建高精度分类预测模型与多模态决策算法。',
    tag: 'AI数据科学赛',
    prize: '¥50,000 奖金池',
    icon: BarChart3,
    colorClass: 'text-cyan-600',
    bgClass: 'bg-cyan-50/40 hover:bg-cyan-50/80 border-cyan-200/80 hover:border-cyan-300',
    iconBg: 'bg-cyan-100 text-cyan-600',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-cyan-500/15 via-blue-500/5 to-transparent',
    url: 'http://10.2.89.1/saas/contest/web/contest/ai/enter/805f06cb51fea51263cf33ea15c2b1f6/rank'
  },
  {
    id: 'ai_security',
    title: 'AI安全挑战赛',
    englishTitle: 'AI Security Track',
    slogan: '探索大模型攻防对抗与防御护栏',
    desc: '在真实沙箱中挖掘提示词注入（Prompt Injection）、越狱攻击以及智能体越权漏洞。',
    tag: 'AI安全挑战赛',
    prize: '¥50,000 奖金池',
    icon: ShieldAlert,
    colorClass: 'text-emerald-600',
    bgClass: 'bg-emerald-50/40 hover:bg-emerald-50/80 border-emerald-200/80 hover:border-emerald-300',
    iconBg: 'bg-emerald-100 text-emerald-600',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-emerald-500/15 via-teal-500/5 to-transparent',
    url: 'http://10.2.89.1/saas/contest/agentctf/d6a21329d479860493c6f3a6aeee9896'
  },
  {
    id: 'aigc_creation',
    title: 'AIGC生成赛',
    englishTitle: 'AIGC Creative Track',
    slogan: '东方美学与未来赛博视觉生成',
    desc: '利用 Flux、ComfyUI 或自研 LoRA 生成高水准数字概念视觉大片与连贯动态视频。',
    tag: 'AIGC生成赛',
    prize: '¥50,000 奖金池',
    icon: Palette,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-50/40 hover:bg-purple-50/80 border-purple-200/80 hover:border-purple-300',
    iconBg: 'bg-purple-100 text-purple-600',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-purple-500/15 via-indigo-500/5 to-transparent',
    url: 'http://10.2.89.1/competitions-hall/competitions/aia-race-detail/40f258969d2e43858383b6e5a7423e3a'
  },
  {
    id: 'ai_application',
    title: 'AI产品创新赛',
    englishTitle: 'AI Product Innovation Track',
    slogan: '聚焦产业痛点与多Agent协同落地',
    desc: '针对医疗、政务或工业场景，开发具备可用交互与完整商业闭环的 AI 原生应用。',
    tag: 'AI产品创新赛',
    prize: '¥50,000 奖金池',
    icon: Rocket,
    colorClass: 'text-indigo-600',
    bgClass: 'bg-indigo-50/40 hover:bg-indigo-50/80 border-indigo-200/80 hover:border-indigo-300',
    iconBg: 'bg-indigo-100 text-indigo-600',
    image: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80',
    accentGradient: 'from-indigo-500/15 via-purple-500/5 to-transparent',
    url: 'http://10.2.89.1/competitions-hall/competitions/aia-race-detail/1973c668ec1a4bd2aae36e2a3043890d'
  }
];

// 合作伙伴列表
const partnerList = [
  { name: '中国电信', tag: '天翼云算力协同', logoText: 'CHINA TELECOM', badge: '5G算力直连' },
  { name: '中国移动', tag: '九天大模型合作', logoText: 'CHINA MOBILE', badge: '边缘计算集群' },
  { name: '中国联通', tag: '联通云生态共建', logoText: 'CHINA UNICOM', badge: '云网融合底座' },
  { name: '华为云', tag: '昇腾 AI 生态支持', logoText: 'HUAWEI CLOUD', badge: '昇腾 NPU 适配' },
  { name: '阿里云百炼', tag: '通义千问战略伙伴', logoText: 'ALIBABA CLOUD', badge: '百炼大模型矩阵' },
  { name: '腾讯云 TI', tag: '知识图谱与向量库', logoText: 'TENCENT CLOUD', badge: 'TI 平台生态' }
];

export const HomeView: React.FC = () => {
  const { 
    user,
    setActiveTab, 
    setMarketplaceTab,
    setWorkspaceSubTab, 
    checkInToday, 
    hasCheckedInToday, 
    setCreateAgentModalOpen,
    setPublishTaskModalOpen,
    setCreateComputeModalOpen,
    posts,
    agents,
    models,
    datasets,
    computeSpecs,
    subscriptions,
    tasks,
    skills,
    competitions,
    openCompetitionDetail,
    openAgentDetail,
    openModelDetail,
    openDatasetDetail,
    openSkillDetail,
    setCreateComputePreset,
    setSandboxAgent,
    showToast
  } = useApp();

  // 首页任务详情二级页面控制
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);

  // 判断是否为当前登录用户（与任务大厅保持一致）
  const isCurrentUser = (name?: string) => {
    if (!name) return false;
    return name === user.name || name.includes('你') || name.includes('极客小千');
  };

  // 判断任务大状态 进行中 VS 已结束（与任务大厅保持一致）
  const isTaskFinished = (task: TaskItem) => {
    return (
      task.status === '已结束' ||
      task.status === '已验收' ||
      (task.remainingDays !== undefined && task.remainingDays <= 0) ||
      task.isAccepted === true ||
      !!task.winner ||
      (task.submissions || []).some(s => s.status === '已通过')
    );
  };

  // Agent 试用启动逻辑（与 AI 集市保持一致）
  const handleLaunchAgentTrial = (ag: AgentItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (ag.id === 'ag_22' || ag.name.includes('企业客服') || ag.trialUrl) {
      const targetUrl = (ag.id === 'ag_22' || ag.name.includes('企业客服'))
        ? 'https://agent001-six.vercel.app/'
        : (ag.trialUrl || 'https://agent001-six.vercel.app/');
      showToast(`正在打开【${ag.name}】独立在线体验系统...`);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const trialUrl = `${window.location.origin}${window.location.pathname}?trial=${ag.id}`;
    window.open(trialUrl, '_blank');
  };

  // 领域定义及主题色（与任务大厅保持一致）
  const getDomainTheme = (domain: string) => {
    switch (domain) {
      case '技术开发':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
          gradientBar: 'from-blue-500 via-indigo-500 to-cyan-500',
          accentLight: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white',
          borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
          iconColor: 'text-blue-600'
        };
      case 'AI模型与数据':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          gradientBar: 'from-indigo-500 via-purple-500 to-pink-500',
          accentLight: 'bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-white',
          borderHover: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
          iconColor: 'text-indigo-600'
        };
      case '工具与自动化':
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
          gradientBar: 'from-amber-500 via-orange-500 to-red-500',
          accentLight: 'bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white',
          borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
          iconColor: 'text-amber-600'
        };
      case '内容创作':
        return {
          badge: 'bg-pink-50 text-pink-700 border-pink-200/80',
          gradientBar: 'from-pink-500 via-rose-500 to-red-500',
          accentLight: 'bg-gradient-to-br from-pink-50/80 via-rose-50/40 to-white',
          borderHover: 'hover:border-pink-400 hover:shadow-pink-500/10',
          iconColor: 'text-pink-600'
        };
      case '咨询与培训':
        return {
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
          gradientBar: 'from-emerald-500 via-teal-500 to-cyan-500',
          accentLight: 'bg-gradient-to-br from-emerald-50/80 via-teal-50/40 to-white',
          borderHover: 'hover:border-emerald-400 hover:shadow-emerald-500/10',
          iconColor: 'text-emerald-600'
        };
      default:
        return {
          badge: 'bg-slate-50 text-slate-700 border-slate-200/80',
          gradientBar: 'from-slate-500 to-slate-600',
          accentLight: 'bg-slate-50',
          borderHover: 'hover:border-slate-400',
          iconColor: 'text-slate-600'
        };
    }
  };

  // 最新在架任务列表（与任务大厅排序与展示规则一致：过滤已上架或公开任务，按最新发布时间倒序排列取前 8 个）
  const latestPublicTasks = React.useMemo(() => {
    return tasks
      .filter(t => t.status === '进行中' || t.status === '已结束' || t.status === '已验收' || t.status === '已发布')
      .sort((a, b) => new Date(b.publishTime || b.startTime || Date.now()).getTime() - new Date(a.publishTime || a.startTime || Date.now()).getTime())
      .slice(0, 8);
  }, [tasks]);

  // Banner 状态与自动轮播
  const [currentBanner, setCurrentBanner] = useState(0);

  // 动态构建算力卡片列表
  const availableRentalCards = React.useMemo(() => {
    const onlineSpecs = (computeSpecs || []).filter(s => s.status === '上架');
    if (onlineSpecs.length > 0) {
      return onlineSpecs.map((s, idx) => {
        const borderColors = [
          'border-t-amber-500',
          'border-t-emerald-600',
          'border-t-purple-600',
          'border-t-indigo-600',
          'border-t-cyan-600',
          'border-t-blue-600'
        ];
        return {
          id: s.id,
          title: s.name,
          availableCards: s.stock ?? Math.floor(Math.random() * 8 + 2),
          hourlyPrice: s.hourlyPrice,
          dayPrice: s.dayPrice || Math.round(s.hourlyPrice * 24 * 0.95),
          weekPrice: s.weekPrice || Math.round(s.hourlyPrice * 24 * 7 * 0.85),
          monthPrice: s.monthPrice || Math.round(s.hourlyPrice * 24 * 30 * 0.75),
          topBorderColor: borderColors[idx % borderColors.length],
          gpuModel: s.gpuModel,
          vram: `${s.vram} 显存`,
          cpu: `${s.cpu} 核`,
          ram: `${s.ram} ${s.ramUnit || 'GB'}`,
          disk: `${s.disk} ${s.diskUnit || 'GB'}`
        };
      });
    }
    return [
      {
        id: 'pro_6000_96g',
        title: 'PRO 6000 96GB',
        availableCards: 7,
        hourlyPrice: 6.19,
        dayPrice: 145,
        weekPrice: 987,
        monthPrice: 4011,
        topBorderColor: 'border-t-amber-500',
        gpuModel: 'RTX PRO 6000',
        vram: '96GB 显存',
        cpu: '24 核',
        ram: '128GB',
        disk: '1000GB NVMe'
      },
      {
        id: 'rtx_5090_32g',
        title: 'RTX 5090 32GB',
        availableCards: 12,
        hourlyPrice: 4.88,
        dayPrice: 110,
        weekPrice: 750,
        monthPrice: 3100,
        topBorderColor: 'border-t-emerald-600',
        gpuModel: 'NVIDIA RTX 5090',
        vram: '32GB 显存',
        cpu: '16 核',
        ram: '64GB',
        disk: '500GB NVMe'
      },
      {
        id: 'a100_80g',
        title: 'A100 SXM4 80GB',
        availableCards: 5,
        hourlyPrice: 12.50,
        dayPrice: 280,
        weekPrice: 1900,
        monthPrice: 7900,
        topBorderColor: 'border-t-purple-600',
        gpuModel: 'NVIDIA A100',
        vram: '80GB 显存',
        cpu: '32 核',
        ram: '256GB',
        disk: '2000GB NVMe'
      },
      {
        id: 'rtx_4090_24g',
        title: 'RTX 4090 24GB',
        availableCards: 18,
        hourlyPrice: 2.99,
        dayPrice: 68,
        weekPrice: 460,
        monthPrice: 1900,
        topBorderColor: 'border-t-indigo-600',
        gpuModel: 'NVIDIA RTX 4090',
        vram: '24GB 显存',
        cpu: '12 核',
        ram: '32GB',
        disk: '300GB NVMe'
      }
    ];
  }, [computeSpecs]);

  const getSkillIcon = (sk: any) => {
    if (sk.icon && sk.icon.startsWith('http')) {
      return <img src={sk.icon} alt={sk.name} className="w-8 h-8 rounded-lg object-cover shrink-0" />;
    }
    return (
      <div className="w-8 h-8 rounded-lg bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-base shrink-0 shadow-2xs">
        {sk.icon || '⚡'}
      </div>
    );
  };

  // Banner 轮播定时器
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner(prev => (prev + 1) % 3);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // 自定义 Banner 列表数据（明亮通透的科技全景风格）
  const bannerList = [
    {
      id: 'b1',
      title: '发现 AI 智能体的无限可能',
      subtitle: '全栈 Agent 资产即开即用，融合多模型推理、知识库检索与工具调用，加速业务智能化跃迁',
      badge: 'Agent 商店 · 精选资产',
      techTag: 'NEURAL AGENT MATRIX',
      targetTab: 'marketplace' as const,
      subMarketplaceTab: 'agent' as const,
      baseGradient: 'from-slate-900 via-indigo-950/90 to-indigo-900/60',
      badgeBg: 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40',
      image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop&q=80',
      heroMetric: { title: '精选智能体', val: '350+ 款' },
      tag1: '极速纳秒级路由',
      tag2: '企业级安全沙箱'
    },
    {
      id: 'b2',
      title: '算力随行 · 极客 GPU 容器云',
      subtitle: '一键秒级拉起 RTX 5090、PRO 6000 与 H100 实例，预装 JupyterLab、ComfyUI 与微调环境',
      badge: '算力工坊 · 极速启动',
      techTag: 'GPU COMPUTE CLUSTER',
      targetTab: 'compute' as const,
      subMarketplaceTab: undefined,
      baseGradient: 'from-slate-900 via-cyan-950/90 to-blue-900/60',
      badgeBg: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40',
      image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1600&auto=format&fit=crop&q=80',
      heroMetric: { title: '实例启动速度', val: '< 3.2s' },
      tag1: '秒级弹性计费',
      tag2: '预装大模型环境'
    },
    {
      id: 'b3',
      title: '2026 AI 创新巅峰赛火热开赛',
      subtitle: '4 大前沿官方赛道全面开放，从数据科学建模、网安攻防到 AIGC 视觉生成与产业应用落地',
      badge: '赛事中心 · 极客角逐',
      techTag: 'AI COMPETITION',
      targetTab: 'creative' as const,
      subMarketplaceTab: undefined,
      baseGradient: 'from-slate-900 via-indigo-950/90 to-purple-900/60',
      badgeBg: 'bg-indigo-500/25 text-indigo-200 border-indigo-400/40',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80',
      heroMetric: { title: '大赛总奖池', val: '¥200,000+' },
      tag1: '中国人工智能学会主办',
      tag2: '顶会推优 / 算力直通'
    }
  ];

  const currentBannerData = bannerList[currentBanner];

  // 滚动动态列表
  const tickerEvents = [
    { id: 't1', text: '张三发布了新Agent「智能客服」', tag: '新Agent', targetTab: 'marketplace', subTab: 'agent' },
    { id: 't2', text: '李四完成了「金融数据分析」任务 (获得 8,000 赏金)', tag: '任务完成', targetTab: 'tasks' },
    { id: 't3', text: '王五在社区发表了「LLM微调实战与vLLM压测」干货热帖', tag: '社区精选', targetTab: 'community' },
    { id: 't4', text: '赵六获得了平台「AI认证架构师」专业徽章', tag: '开发者荣誉', targetTab: 'workspace' },
    { id: 't5', text: '华西数字医疗课题组上架了「三甲医院全科医疗预诊助手」', tag: '医疗专区', targetTab: 'marketplace', subTab: 'agent' },
    { id: 't6', text: '极客小千开源了全新 Skill 插件「股票价值投资分析系统」', tag: 'Skill上新', targetTab: 'marketplace', subTab: 'skill' }
  ];

  // 动态信息流（用于区域六右侧）
  const followFeeds = [
    {
      id: 'ff1',
      author: '华西数字医疗课题组',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
      action: '发布了新 Agent',
      targetName: '【三甲医院全科医疗预诊助手】',
      preview: '支持结合患者体检指标与主诉进行辅助分诊建议。',
      time: '10分钟前',
      actionBtn: '去试用',
      onAction: () => {
        const ag = agents.find(a => a.id === 'ag_04') || agents[0];
        if (ag) setSandboxAgent(ag);
      }
    },
    {
      id: 'ff2',
      author: '王AI-深度架构师',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      action: '发表了深度技术贴',
      targetName: '《DeepSeek-R1 8B/32B vLLM 高并发部署优化全指南》',
      preview: '通过 Chunked Prefill 机制降低 40% 首字延迟...',
      time: '1小时前',
      actionBtn: '看帖子',
      onAction: () => setActiveTab('community')
    },
    {
      id: 'ff3',
      author: '北京天元律所',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      action: '发布了悬赏任务',
      targetName: '【定制基于 Qwen2.5 的律所合同审查 Agent】',
      preview: '赏金 ¥8,000，急需合同审核与合规风险识别专家...',
      time: '2小时前',
      actionBtn: '去接单',
      onAction: () => setActiveTab('tasks')
    },
    {
      id: 'ff4',
      author: '弗兰克斯基 (Franski)',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      action: '更新了 Skill 插件',
      targetName: '【腾讯文档企业知识库同步组件 v1.2】',
      preview: '新增表格与多维表实时双向写入支持。',
      time: '3小时前',
      actionBtn: '看插件',
      onAction: () => {
        setActiveTab('marketplace');
        setMarketplaceTab('skill');
      }
    },
    {
      id: 'ff5',
      author: '陈Workflow',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
      action: '在算力工坊启动了容器',
      targetName: '【ComfyUI Official + Flux.1 Base】',
      preview: '上海机房 RTX 4090 24GB 正在渲染超清插画。',
      time: '4小时前',
      actionBtn: '去租赁',
      onAction: () => setActiveTab('compute')
    },
    {
      id: 'ff6',
      author: 'SuperQuant',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
      action: '积分榜登顶',
      targetName: '蝉联周榜第一名 (累计 128,500 积分)',
      preview: '贡献了 14 款热门量化策略 Agent 与 8 套清洗数据集。',
      time: '5小时前',
      actionBtn: '看榜单',
      onAction: () => setActiveTab('workspace')
    }
  ];

  // 区域四热门混合列表生成
  const hotMixedList = [
    {
      type: 'agent',
      typeLabel: '热门Agent',
      typeBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: '股票价值投资分析与财报研报 Agent',
      desc: '输入股票代码，自动抓取财报并输出巴菲特估值决策分析。',
      rating: 4.8,
      hotMetric: '2.8k次调用',
      date: '2026-08-11',
      price: '按Token扣费',
      icon: '📈',
      onClick: () => {
        const target = agents.find(a => a.id === 'ag_02') || agents[1];
        openAgentDetail(target);
      }
    },
    {
      type: 'task',
      typeLabel: '高额悬赏',
      typeBadgeColor: 'bg-amber-50 text-amber-700 border-amber-200',
      title: '【悬赏】定制基于 Qwen2.5 的律所合同审查 Agent',
      desc: '自动识别劳动合同与采购协议风险，支持输出红线修改建议。',
      rating: 5.0,
      hotMetric: '14人已接单',
      date: '剩余12天',
      price: '¥8,000 赏金',
      icon: '📋',
      onClick: () => setDetailTaskId('tsk_101')
    },
    {
      type: 'task',
      typeLabel: '重点招标',
      typeBadgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      title: '【招标】微调 70B 医疗多模态大模型',
      desc: '要求 CT/X光片图像与电子病历联合推理，BLEU-4>0.42。',
      rating: 4.9,
      hotMetric: '8人已接单',
      date: '剩余28天',
      price: '¥35,000 赏金',
      icon: '🩺',
      onClick: () => setDetailTaskId('tsk_102')
    },
    {
      type: 'competition',
      typeLabel: '热门赛事',
      typeBadgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      title: '2026 AI 创新巅峰赛 (4大官方赛道开放)',
      desc: '中国人工智能学会主办，国家级高水平综合挑战赛，争夺 20万+ 现金大奖与顶会推优。',
      rating: 5.0,
      hotMetric: '1,892次提交',
      date: '火热进行中',
      price: '¥200,000总奖池',
      icon: '🏆',
      onClick: () => {
        const comp = competitions[0];
        if (comp) {
          openCompetitionDetail(comp.id);
        } else {
          setActiveTab('creative');
        }
      }
    },
    {
      type: 'post',
      typeLabel: '社区热帖',
      typeBadgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      title: '【干货】DeepSeek-R1 8B/32B vLLM 高并发部署优化全指南',
      desc: '首 Token 延迟下降 40% 的全套配置与评测日志分享。',
      rating: 5.0,
      hotMetric: '128赞 · 34评',
      date: '2小时前',
      price: '社区精选',
      icon: '📝',
      onClick: () => setActiveTab('community')
    },
    {
      type: 'skill',
      typeLabel: 'Skill插件',
      typeBadgeColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      title: '股票价值投资分析系统 (ClawHub插件)',
      desc: '标准 Tool 规范，赋能任意智能体一键解析 A 股深度估值。',
      rating: 4.9,
      hotMetric: '3.3万次调用',
      date: 'v1.0.0',
      price: '开源免费',
      icon: '⚡',
      onClick: () => {
        const target = skills.find(s => s.id === 'sk_01' || s.name.includes('价值投资')) || skills[0];
        if (target) {
          openSkillDetail(target);
        } else {
          setActiveTab('marketplace');
          setMarketplaceTab('skill');
        }
      }
    },
    {
      type: 'agent',
      typeLabel: '热门Agent',
      typeBadgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      title: '多语言代码重构与单元测试生成 Agent',
      desc: '支持 Python/TS/Java/Go 代码异味识别与一键生成全覆盖用例。',
      rating: 4.8,
      hotMetric: '1.9k次调用',
      date: '2026-08-10',
      price: '¥19/月 (支持积分抵扣)',
      icon: '💻',
      onClick: () => {
        const target = agents.find(a => a.id === 'ag_03') || agents[2];
        openAgentDetail(target);
      }
    }
  ];

  // 若从首页点击任务进入二级详情页（完整承接接单、交付、提交、验收等全套任务流程）
  if (detailTaskId) {
    return (
      <div className="w-full">
        <TaskDetailSubPage
          taskId={detailTaskId}
          onBack={() => setDetailTaskId(null)}
          fromTitle="首页 · 最新任务"
        />
      </div>
    );
  }

  return (
    <div className="w-full space-y-8 animate-fade-in pb-16 select-none text-slate-800">
      
      {/* =========================================================================
          区域一 + 区域二：Banner + 快捷入口（左右并排布局 68% : 32%）
      ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        
        {/* 左侧 Banner（明亮通透全幅科技大图，从右往左自然透明融合，点击卡片直接跳转） */}
        <div 
          onClick={() => {
            setActiveTab(currentBannerData.targetTab);
            if (currentBannerData.subMarketplaceTab) {
              setMarketplaceTab(currentBannerData.subMarketplaceTab);
            }
          }}
          className={`lg:col-span-8 relative rounded-3xl p-8 lg:p-9 bg-gradient-to-r ${currentBannerData.baseGradient} border border-slate-700/60 shadow-xl overflow-hidden flex flex-col justify-between min-h-[360px] cursor-pointer group hover:border-indigo-400/80 hover:shadow-2xl hover:shadow-indigo-500/20 transition-all duration-500 select-none`}
        >
          {/* 1. 全景科技背景大图（铺满整个 Banner，高透明亮，悬浮微放大） */}
          <img 
            src={currentBannerData.image} 
            alt={currentBannerData.title}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-70 group-hover:scale-105 group-hover:opacity-85 transition-all duration-1000 ease-out pointer-events-none"
          />

          {/* 2. 从右往左渐渐透明的平滑半透遮罩（左侧深蓝灰保证文字 100% 清晰，右侧透亮科技大图自然呈现） */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-900/70 via-50% to-slate-900/10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
          
          {/* 3. 柔和的亮色极光光晕，提升整体明亮度与通透感 */}
          <div className="absolute -top-12 right-1/4 w-96 h-96 bg-indigo-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 right-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl pointer-events-none" />

          {/* 4. 精致的赛博微网格与顶部亮色细线 */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] [background-size:28px_28px] opacity-25 pointer-events-none" />
          <div className="absolute left-0 right-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-indigo-300/80 to-transparent pointer-events-none" />

          {/* 5. 右上角：明亮跳转微提示 */}
          <div className="absolute top-6 right-6 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-600 text-slate-200 text-xs font-semibold backdrop-blur-md group-hover:border-indigo-300 group-hover:text-white group-hover:bg-indigo-600/60 transition-all shadow-md">
            <span>点击直达</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>

          {/* 6. Banner 左侧核心文案区 */}
          <div className="relative z-10 space-y-4 max-w-xl">
            {/* 顶栏 Badge 与 Tech Tag */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black border shadow-xs ${currentBannerData.badgeBg}`}>
                <Sparkle className="w-3.5 h-3.5 text-indigo-300 animate-pulse" />
                <span>{currentBannerData.badge}</span>
              </div>
              <span className="text-[10px] font-mono font-bold tracking-widest text-slate-300 uppercase bg-slate-800/90 border border-slate-700 px-2.5 py-0.5 rounded shadow-2xs">
                {currentBannerData.techTag}
              </span>
            </div>

            {/* 大标题（更加明亮饱满） */}
            <h1 className="text-2xl sm:text-3xl lg:text-[32px] font-black text-white tracking-tight leading-tight drop-shadow-md group-hover:text-indigo-100 transition-colors">
              {currentBannerData.title}
            </h1>

            {/* 副标题说明 */}
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed font-medium line-clamp-2 drop-shadow-2xs">
              {currentBannerData.subtitle}
            </p>
          </div>

          {/* 7. Banner 底部特性胶囊与指示器 */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pt-6 border-t border-slate-700/60 mt-6">
            {/* 核心亮点特性标签 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-100 bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-2xs backdrop-blur-xs">
                <Cpu className="w-3.5 h-3.5 text-indigo-300" />
                <span>{currentBannerData.tag1}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-100 bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-2xs backdrop-blur-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-300" />
                <span>{currentBannerData.tag2}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-100 bg-slate-900/80 border border-slate-700/80 px-3 py-1.5 rounded-xl shadow-2xs backdrop-blur-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>{currentBannerData.heroMetric.title}: <strong className="text-indigo-300 font-mono font-black">{currentBannerData.heroMetric.val}</strong></span>
              </span>
            </div>

            {/* 3 张图圆点指示器（点击圆点切换，阻止冒泡） */}
            <div 
              className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              {bannerList.map((_, idx) => (
                <button
                  key={idx}
                  onClick={(e) => {
                    e.stopPropagation();
                    setCurrentBanner(idx);
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    idx === currentBanner ? 'w-6 bg-indigo-400 shadow-md' : 'w-2 bg-slate-600 hover:bg-slate-400'
                  }`}
                  aria-label={`切换到第 ${idx + 1} 张 Banner`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* 右侧快捷入口（网格布局 2列 × 3行，共 6 个入口，严格匹配目标方案） */}
        <div className="lg:col-span-4 grid grid-cols-2 gap-3.5">
          
          {/* 1. 使用Agent */}
          <button
            onClick={() => {
              setActiveTab('marketplace');
              setMarketplaceTab('agent');
            }}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-lg hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors shadow-2xs">
                <Bot className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded-md truncate max-w-[90px]">
                想快速用AI的用户
              </span>
            </div>
            <div className="mt-2.5 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-indigo-600 flex items-center gap-1">
                🤖 使用Agent
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                Agent商店 · 即开即用
              </div>
            </div>
          </button>

          {/* 2. 查找模型 */}
          <button
            onClick={() => {
              setActiveTab('marketplace');
              setMarketplaceTab('model');
            }}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-400 hover:shadow-lg hover:shadow-blue-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-blue-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-2xs">
                <Search className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded-md truncate max-w-[90px]">
                大模型开发者
              </span>
            </div>
            <div className="mt-2.5 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-blue-600 flex items-center gap-1">
                🔍 查找模型
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                模型广场 · 直调API
              </div>
            </div>
          </button>

          {/* 3. 启用算力 */}
          <button
            onClick={() => {
              setCreateComputeModalOpen(true);
            }}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-50 border border-cyan-100 flex items-center justify-center text-cyan-600 group-hover:bg-cyan-600 group-hover:text-white transition-colors shadow-2xs">
                <Cpu className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-cyan-700 bg-cyan-50 border border-cyan-100 px-1.5 py-0.5 rounded-md truncate max-w-[90px]">
                GPU训练用户
              </span>
            </div>
            <div className="mt-2.5 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-cyan-600 flex items-center gap-1">
                ⚡ 启用算力
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                算力工坊 · 秒级启动
              </div>
            </div>
          </button>

          {/* 4. 发布任务 */}
          <button
            onClick={() => {
              setActiveTab('tasks');
              setPublishTaskModalOpen(true);
            }}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-amber-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors shadow-2xs">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-100 px-1.5 py-0.5 rounded-md truncate max-w-[90px]">
                AI需求外包方
              </span>
            </div>
            <div className="mt-2.5 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-amber-600 flex items-center gap-1">
                📋 发布任务
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                任务大厅 · 悬赏发布
              </div>
            </div>
          </button>

          {/* 5. 我要参赛 */}
          <button
            onClick={() => setActiveTab('creative')}
            className="p-3.5 sm:p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-purple-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#a855f7_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors shadow-2xs">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-100 px-1.5 py-0.5 rounded-md truncate max-w-[90px]">
                参赛/观赛用户
              </span>
            </div>
            <div className="mt-2.5 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-purple-600 flex items-center gap-1">
                🏆 我要参赛
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                赛事中心 · 前沿角逐
              </div>
            </div>
          </button>

          {/* 6. 每日签到 */}
          <button
            onClick={() => {
              checkInToday();
            }}
            className={`p-3.5 sm:p-4 rounded-2xl bg-white border ${
              hasCheckedInToday ? 'border-emerald-300 bg-emerald-50/20' : 'border-slate-200/80 hover:border-emerald-400'
            } hover:shadow-lg hover:shadow-emerald-500/10 hover:-translate-y-0.5 transition-all shadow-2xs flex flex-col justify-between text-left cursor-pointer group relative overflow-hidden`}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-500/10 to-transparent rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
            <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-0 group-hover:opacity-10 transition-opacity pointer-events-none" />

            <div className="flex items-center justify-between relative z-10">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-colors shadow-2xs ${
                hasCheckedInToday ? 'bg-emerald-600 text-white' : 'bg-emerald-50 border border-emerald-100 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white'
              }`}>
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-[9px] font-bold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.5 rounded-md truncate max-w-[90px]">
                所有用户赚积分
              </span>
            </div>
            <div className="mt-2.5 relative z-10">
              <div className="text-xs font-black text-slate-900 group-hover:text-emerald-600 flex items-center gap-1">
                ✅ 每日签到
              </div>
              <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5 truncate">
                {hasCheckedInToday ? '今日已签到 (+5积分)' : '点击一键签到 (+5积分)'}
              </div>
            </div>
          </button>

        </div>

      </div>

      {/* =========================================================================
          区域三：平台动态（滚动通知条 - 高阶浅色风格）
      ========================================================================= */}
      <div className="w-full bg-indigo-50/70 text-slate-700 rounded-2xl px-5 py-3 border border-indigo-100/90 shadow-2xs flex items-center gap-3.5 overflow-hidden">
        <div className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-1 rounded-xl text-xs font-black shrink-0 shadow-xs">
          <Megaphone className="w-3.5 h-3.5" />
          <span>平台动态</span>
        </div>

        {/* 动态滚动条 */}
        <div className="flex-1 overflow-hidden relative">
          <div className="flex items-center gap-8 whitespace-nowrap text-xs text-slate-700 animate-marquee hover:[animation-play-state:paused]">
            {tickerEvents.map((item, idx) => (
              <div
                key={item.id}
                onClick={() => {
                  setActiveTab(item.targetTab as any);
                  if (item.subTab) setMarketplaceTab(item.subTab as any);
                }}
                className="inline-flex items-center gap-2.5 hover:text-indigo-600 transition cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-indigo-700 border border-indigo-200/80 shadow-2xs">
                  {item.tag}
                </span>
                <span className="font-medium text-slate-800">{item.text}</span>
                {idx < tickerEvents.length - 1 && <span className="text-slate-300 font-black">│</span>}
              </div>
            ))}
            {/* 复制一遍用于无缝循环 */}
            {tickerEvents.map((item) => (
              <div
                key={`dup_${item.id}`}
                onClick={() => {
                  setActiveTab(item.targetTab as any);
                  if (item.subTab) setMarketplaceTab(item.subTab as any);
                }}
                className="inline-flex items-center gap-2.5 hover:text-indigo-600 transition cursor-pointer"
              >
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-white text-indigo-700 border border-indigo-200/80 shadow-2xs">
                  {item.tag}
                </span>
                <span className="font-medium text-slate-800">{item.text}</span>
                <span className="text-slate-300 font-black">│</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* =========================================================================
          区域四：精选内容推荐（平铺 8 大主题栏目）
      ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-10">
        
        {/* 标题栏 */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight">
              精选内容推荐
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              全域资产平铺推荐 · 点击卡片直达详情与试用
            </p>
          </div>
        </div>

        {/* 1. 最新 Agent (两行，8个卡片) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                <Bot className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">最新 Agent</h3>
              <span className="text-xs text-slate-400 font-medium ml-1">高智能体应用 · 即开即用</span>
            </div>
            <button
              onClick={() => {
                setActiveTab('marketplace');
                setMarketplaceTab('agent');
              }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>前往 Agent 商店</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5">
            {agents.slice(0, 8).map((ag) => {
              const hasUsed = !!subscriptions[ag.id] || ag.isPurchased || ag.isUsed;
              const displayScenarios: string[] = 
                ag.categoryTags && ag.categoryTags.length > 0 
                  ? ag.categoryTags 
                  : (ag.scene ? [ag.scene] : []);
              const displayIndustries: string[] = 
                ag.industryTags && ag.industryTags.length > 0 
                  ? ag.industryTags 
                  : (ag.industry ? [ag.industry] : []);
              const freeTokensText = ag.freeTokenQuota 
                ? `${(ag.freeTokenQuota >= 10000 ? (ag.freeTokenQuota / 10000) + '万' : (ag.freeTokenQuota / 1000) + 'k')} Token`
                : '5万 Token';

              return (
                <div
                  key={ag.id}
                  onClick={() => openAgentDetail(ag)}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-11 h-11 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-xl shrink-0 group-hover:scale-105 transition-transform overflow-hidden shadow-2xs">
                          {ag.avatar && ag.avatar.startsWith('http') ? (
                            <img src={ag.avatar} alt={ag.name} className="w-full h-full object-cover" />
                          ) : (
                            <span>{ag.avatar || '🤖'}</span>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors truncate">
                            {ag.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <span className="text-[10px] text-indigo-700 bg-indigo-50 font-bold px-1.5 py-0.2 rounded border border-indigo-100/70">
                              {ag.techForm || ag.appType || 'Agent'}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium truncate">
                              {freeTokensText}免费
                            </span>
                          </div>
                        </div>
                      </div>
                      {hasUsed ? (
                        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>使用过</span>
                        </span>
                      ) : (
                        <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 text-[10px] font-bold px-1.5 py-0.5 rounded-md shrink-0">
                          即开即用
                        </span>
                      )}
                    </div>

                    {/* Tags line */}
                    <div className="flex flex-wrap items-center gap-1">
                      {displayScenarios.slice(0, 1).map((sc, idx) => (
                        <span key={`sc-${idx}`} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-cyan-50 text-cyan-700 border border-cyan-100/70">
                          {sc}
                        </span>
                      ))}
                      {displayIndustries.slice(0, 1).map((ind, idx) => (
                        <span key={`ind-${idx}`} className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 border border-slate-200/60">
                          {ind}
                        </span>
                      ))}
                    </div>

                    {/* Slogan highlight box */}
                    <div className="text-xs text-slate-600 pl-2 border-l-2 border-indigo-500 bg-slate-50/70 p-2 rounded-r-lg line-clamp-2 h-13 leading-relaxed font-normal">
                      {ag.slogan || ag.description?.slice(0, 45) || '极高阶人工智能自动化代理助手'}
                    </div>
                  </div>

                  <div className="space-y-2.5 pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{(ag.rating ?? 5.0).toFixed(1)}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({ag.ratingCount ?? 120})</span>
                      </div>
                      <span className="text-[11px] text-indigo-600 font-extrabold">
                        {(ag.callUsersCount ?? ag.subscribersCount ?? ag.usageCount ?? 128).toLocaleString()}人调用
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        onClick={(e) => handleLaunchAgentTrial(ag, e)}
                        className="flex-1 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3 fill-indigo-600" />
                        <span>立即体验</span>
                      </button>
                      <button
                        onClick={() => openAgentDetail(ag)}
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                      >
                        详情
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. 最热模型 (两行，8个卡片) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">最热模型</h3>
              <span className="text-xs text-slate-400 font-medium ml-1">高精度与大上下文模型矩阵</span>
            </div>
            <button
              onClick={() => {
                setActiveTab('marketplace');
                setMarketplaceTab('model');
              }}
              className="text-xs font-bold text-blue-600 hover:text-blue-800 flex items-center gap-1 cursor-pointer"
            >
              <span>前往 模型广场</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.slice(0, 8).map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  openModelDetail(m);
                }}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-7 h-7 rounded-lg bg-slate-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-xs">
                        {m.vendor?.slice(0, 1) || 'M'}
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors truncate">
                        {m.vendor}: {m.name}
                      </h4>
                    </div>
                    <span className="text-[10px] font-mono bg-slate-100 text-slate-500 px-2 py-0.5 rounded-md font-medium shrink-0">
                      {m.typeTag || 'LLM'}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal min-h-[32px]">
                    {m.description || '支持长上下文推理与多模态能力的顶级通用大语言模型。'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="text-[10px] font-mono text-slate-500 font-bold">
                    {m.contextLength ? `${m.contextLength} ctx` : (m.totalTokensUsed || '1.1B tokens')}
                  </div>
                  <div className="text-xs font-bold text-emerald-600">
                    {m.priceOutput || m.priceInput || '免费调用'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 最热数据集 (两行，8个卡片) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <Database className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">最热数据集</h3>
              <span className="text-xs text-slate-400 font-medium ml-1">高质感脱敏训练与评测语料</span>
            </div>
            <button
              onClick={() => {
                setActiveTab('marketplace');
                setMarketplaceTab('dataset');
              }}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>前往 数据集广场</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {datasets.slice(0, 8).map((ds) => {
              const primaryModality = ds.modalities?.[0] || ds.modalityCategory || '表格数据';
              const primaryTask = ds.taskTypes?.[0] || ds.taskType || '通用';
              const isPlatform = ds.uploaderType === 'platform' || ds.uploaderName === '平台管理';
              return (
                <div
                  key={ds.id}
                  onClick={() => {
                    openDatasetDetail(ds);
                  }}
                  className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-1.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/80">
                        {primaryModality}
                      </span>
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        isPlatform ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        {isPlatform ? '平台管理' : (ds.uploaderName || '用户上传')}
                      </span>
                    </div>

                    <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                      {ds.name}
                    </h4>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal min-h-[32px]">
                      {ds.brief || ds.description || '高标准行业脱敏数据集，支持一键加载与微调训练。'}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md">
                      {primaryTask}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-500">
                      {ds.formats?.[0] || ds.format || 'CSV'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. 最热 Skill (两行，8个卡片) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                <Zap className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">最热 Skill</h3>
              <span className="text-xs text-slate-400 font-medium ml-1">标准 Tool/Function 插件体系</span>
            </div>
            <button
              onClick={() => {
                setActiveTab('marketplace');
                setMarketplaceTab('skill');
              }}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
            >
              <span>前往 Skill 插件广场</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {skills.slice(0, 8).map((sk) => (
              <div
                key={sk.id}
                onClick={() => {
                  openSkillDetail(sk);
                }}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      {getSkillIcon(sk)}
                      <div className="min-w-0">
                        <h4 className="text-xs font-extrabold text-slate-900 group-hover:text-cyan-600 transition-colors truncate flex items-center gap-1">
                          <span>{sk.name}</span>
                          {sk.isOfficial && <CheckCircle2 className="w-3 h-3 text-blue-500 shrink-0" />}
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {sk.category || '功能插件'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal min-h-[32px]">
                    {sk.description || '赋能智能体一键调用的标准 Function/Tool 插件。'}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                    <Download className="w-3 h-3" />
                    <span>{(sk.downloadsCount || sk.installs || 1200).toLocaleString()} 次调用</span>
                  </span>
                  <span className="text-xs font-bold text-cyan-600">
                    开源免费
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 5. 最新任务 (两行，8个卡片) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
                <Briefcase className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">最新任务</h3>
              <span className="text-xs text-slate-400 font-medium ml-1">高额悬赏与企业定制需求外包</span>
            </div>
            <button
              onClick={() => setActiveTab('tasks')}
              className="text-xs font-bold text-amber-600 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
            >
              <span>前往 任务大厅</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {latestPublicTasks.map((task) => {
              const myTakerRecord = (task.takers || []).find(tk => isCurrentUser(tk.username));
              const hasTaken = !!myTakerRecord;
              const isPublisher = isCurrentUser(task.publisher);
              const acceptedNum = (task.takers || []).length || task.acceptedCount || 0;
              const submittedNum = (task.submissions || []).length || task.submittedCount || 0;
              const finished = isTaskFinished(task);
              const theme = getDomainTheme(task.domain);

              return (
                <div
                  key={task.id}
                  onClick={() => setDetailTaskId(task.id)}
                  className={`relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-xs ${
                    hasTaken
                      ? 'border-emerald-400/90 ring-2 ring-emerald-500/20 bg-gradient-to-b from-emerald-50/20 via-white to-white hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1'
                      : isPublisher
                      ? 'border-amber-300 ring-1 ring-amber-400/20 bg-gradient-to-b from-amber-50/15 via-white to-white hover:border-amber-400 hover:shadow-xl hover:-translate-y-1'
                      : finished
                      ? 'border-slate-200 bg-slate-50/60 opacity-85 hover:opacity-100 hover:border-slate-300'
                      : `border-slate-200/90 ${theme.borderHover} hover:shadow-xl hover:-translate-y-1`
                  }`}
                >
                  {/* 顶部色彩渐变条 */}
                  <div
                    className={`h-1.5 w-full bg-gradient-to-r ${
                      hasTaken
                        ? 'from-emerald-500 via-teal-500 to-cyan-500'
                        : finished
                        ? 'from-slate-300 to-slate-400'
                        : theme.gradientBar
                    }`}
                  />

                  <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      {/* 领域、难度与状态徽章 */}
                      <div className="flex items-center justify-between gap-1.5 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${theme.badge}`}>
                            {task.domain}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                              task.difficulty === '简单'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                                : task.difficulty === '中等'
                                ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                                : 'bg-purple-50 text-purple-700 border-purple-200/80'
                            }`}
                          >
                            {task.difficulty}难度
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          {hasTaken ? (
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 shadow-2xs ${
                                myTakerRecord?.status === '已验收'
                                  ? 'bg-emerald-600 text-white'
                                  : myTakerRecord?.status === '已提交'
                                  ? 'bg-indigo-600 text-white'
                                  : myTakerRecord?.status === '已驳回'
                                  ? 'bg-rose-600 text-white'
                                  : 'bg-emerald-600 text-white'
                              }`}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>
                                {myTakerRecord?.status === '已验收'
                                  ? '已验收'
                                  : myTakerRecord?.status === '已提交'
                                  ? '待验收'
                                  : myTakerRecord?.status === '已驳回'
                                  ? '需修改'
                                  : '我已接单'}
                              </span>
                            </span>
                          ) : isPublisher ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-0.5 shadow-2xs">
                              <UserCheck className="w-3 h-3 text-amber-700" />
                              <span>我发布的</span>
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                              <span>未接单</span>
                            </span>
                          )}

                          {finished ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                              已结束
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <span className="relative flex h-1.5 w-1.5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                              </span>
                              进行中
                            </span>
                          )}
                        </div>
                      </div>

                      {/* 标题 */}
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 leading-snug">
                        {task.title}
                      </h4>

                      {/* 简述 */}
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal min-h-[32px]">
                        {task.brief || task.description.replace(/<[^>]+>/g, '').substring(0, 80)}
                      </p>
                    </div>

                    {/* 悬赏金额与接单交付态势 */}
                    <div className={`p-2.5 rounded-xl border border-slate-100 ${hasTaken ? 'bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-white' : theme.accentLight} flex items-center justify-between gap-2 shadow-2xs mt-1`}>
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1">
                          <Coins className="w-3 h-3 text-amber-500" />
                          <span>悬赏金额</span>
                        </div>
                        <div className="text-sm font-black font-mono text-amber-600 leading-tight flex items-baseline gap-0.5 mt-0.5">
                          <span className="text-[11px] font-sans text-amber-500 font-bold">¥</span>
                          {(task.cashReward || 0).toLocaleString()}
                          {(task.pointsReward || 0) > 0 && (
                            <span className="text-[9px] font-bold text-indigo-600 ml-1 font-sans bg-indigo-50 border border-indigo-100 px-1 py-0.2 rounded">
                              +{task.pointsReward}积分
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-[10px] text-slate-500 font-semibold flex items-center gap-1 justify-end">
                          <Users className="w-3 h-3 text-indigo-500" />
                          <span>接单态势</span>
                        </div>
                        <div className="text-[11px] font-bold text-slate-700 mt-0.5 font-mono flex items-center gap-1 justify-end">
                          <span className="text-indigo-600 font-black">{acceptedNum}</span>
                          <span className="text-slate-400 text-[10px] font-normal">接单</span>
                          <span className="text-slate-300">/</span>
                          <span className="text-emerald-600 font-black">{submittedNum}</span>
                          <span className="text-slate-400 text-[10px] font-normal">交付</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 卡片底栏: 发布者信息与操作按钮 */}
                  <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={task.publisherAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={task.publisher}
                        className="w-5 h-5 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="font-extrabold text-slate-800 truncate max-w-[90px] leading-tight text-[11px]">
                          {task.publisher}
                        </span>
                        <span className="text-[9px] text-slate-400 leading-none mt-0.5">
                          {finished ? '已结束' : `剩余 ${task.remainingDays || 14} 天`}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailTaskId(task.id);
                      }}
                      className={`px-3 py-1.5 rounded-lg text-white font-bold text-[11px] transition-all cursor-pointer flex items-center gap-1 shadow-xs group/btn ${
                        hasTaken
                          ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'
                          : isPublisher
                          ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100'
                          : finished
                          ? 'bg-slate-600 hover:bg-slate-700'
                          : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 active:scale-95'
                      }`}
                    >
                      <span>任务详情</span>
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 6. 最热算力 (1行，4个卡片) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-100 text-cyan-600 flex items-center justify-center font-bold">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">最热算力</h3>
              <span className="text-xs text-slate-400 font-medium ml-1">高性能 GPU 容器实例 · 秒级拉起</span>
            </div>
            <button
              onClick={() => setActiveTab('compute')}
              className="text-xs font-bold text-cyan-600 hover:text-cyan-800 flex items-center gap-1 cursor-pointer"
            >
              <span>前往 算力工坊</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {availableRentalCards.slice(0, 4).map((card) => (
              <div
                key={card.id}
                onClick={() => {
                  setCreateComputePreset({ card });
                  setCreateComputeModalOpen(true);
                }}
                className={`p-5 rounded-2xl border border-slate-200/80 bg-white ${card.topBorderColor} border-t-4 hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 group cursor-pointer`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black text-slate-900">
                      {card.title}
                    </h4>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-200">
                      {card.availableCards}卡可用
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-medium pb-1.5 border-b border-slate-100">
                    <span>按量计费: </span>
                    <span className="text-rose-600 font-black text-sm font-mono">¥{card.hourlyPrice.toFixed(2)}</span>
                    <span className="text-slate-400 text-[10px]"> / 小时</span>
                  </div>

                  <div className="space-y-1 text-[11px] text-slate-600">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">GPU:</span>
                      <span className="font-bold text-slate-800 truncate">{card.gpuModel} ({card.vram})</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400">配置:</span>
                      <span className="font-medium text-slate-700">{card.cpu} · {card.ram} · {card.disk}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setCreateComputePreset({ card });
                    setCreateComputeModalOpen(true);
                  }}
                  className="w-full py-2 rounded-xl bg-cyan-50 hover:bg-cyan-600 text-cyan-700 hover:text-white font-bold text-xs transition border border-cyan-200 cursor-pointer"
                >
                  启用算力
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* 7. 最新赛事 (1行，4个卡片) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center font-bold">
                <Trophy className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">最新赛事</h3>
              <span className="text-xs text-slate-400 font-medium ml-1">高规格国家级与产业 AI 竞技</span>
            </div>
            <button
              onClick={() => setActiveTab('creative')}
              className="text-xs font-bold text-purple-600 hover:text-purple-800 flex items-center gap-1 cursor-pointer"
            >
              <span>进入 赛事中心</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {competitions.slice(0, 4).map((comp) => {
              const isOngoing = comp.status === 'ongoing';
              const isUnstarted = comp.status === 'unstarted';
              const statusText = isOngoing ? '火热进行中' : isUnstarted ? '火热报名中' : '历届已完赛';
              const statusBadgeClass = isOngoing 
                ? 'bg-purple-500/90 text-white' 
                : isUnstarted 
                ? 'bg-blue-500/90 text-white' 
                : 'bg-slate-700/90 text-slate-200';
              
              const totalPrize = comp.introduction?.awards?.[0]?.reward?.split(' ')?.[0] || '丰厚奖池';

              return (
                <div
                  key={comp.id}
                  onClick={() => openCompetitionDetail(comp.id)}
                  className="rounded-2xl border border-slate-200/80 bg-white hover:border-purple-400 hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col justify-between overflow-hidden cursor-pointer group shadow-2xs"
                >
                  <div className="relative h-28 w-full overflow-hidden bg-slate-900">
                    <img 
                      src={comp.coverImage} 
                      alt={comp.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute top-2.5 left-2.5">
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${statusBadgeClass}`}>
                        {statusText}
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2.5 right-2.5">
                      <div className="text-xs font-black text-white truncate drop-shadow-sm">
                        {comp.title}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 space-y-2 flex-1 flex flex-col justify-between">
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal">
                      {comp.introduction?.summary || '聚焦生成式 AI、大模型攻防与数据科学的尖端挑战赛。'}
                    </p>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-[10px] text-slate-400">奖金池</span>
                      <span className="text-xs font-black text-amber-600 font-mono">
                        {totalPrize}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 8. 社区热贴 (两行卡片形式，8个卡片) */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">社区热帖</h3>
              <span className="text-xs text-slate-400 font-medium ml-1">开发者实战沉淀与踩坑干货</span>
            </div>
            <button
              onClick={() => setActiveTab('community')}
              className="text-xs font-bold text-emerald-600 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
            >
              <span>进入 社区广场</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {posts.slice(0, 8).map((post) => (
              <div
                key={post.id}
                onClick={() => setActiveTab('community')}
                className="p-5 rounded-2xl border border-slate-200/80 bg-white hover:border-emerald-400 hover:shadow-xl hover:shadow-emerald-500/5 hover:-translate-y-0.5 transition-all flex flex-col justify-between space-y-3 cursor-pointer group"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {post.board || '技术交流'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {post.time}
                    </span>
                  </div>

                  <h4 className="text-xs font-black text-slate-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                    {post.title || post.content}
                  </h4>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed font-normal min-h-[32px]">
                    {post.content}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {post.authorAvatar && (
                      <img 
                        src={post.authorAvatar} 
                        alt={post.author} 
                        className="w-4 h-4 rounded-full object-cover shrink-0" 
                      />
                    )}
                    <span className="text-[11px] text-slate-700 font-medium truncate">
                      {post.author}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-slate-400 shrink-0">
                    <span className="flex items-center gap-0.5">
                      <Heart className="w-3 h-3 text-rose-400" /> {post.likesCount || 12}
                    </span>
                    <span className="flex items-center gap-0.5">
                      <MessageSquare className="w-3 h-3 text-indigo-400" /> {post.commentsCount || 4}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>





      </div>



      {/* =========================================================================
          区域七：平台数据 + 合作伙伴
      ========================================================================= */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 shadow-2xs space-y-8">
        
        {/* 平台数据统计 */}
        <div>
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">
                平台实时运营与算力指标
              </h3>
              <p className="text-xs text-slate-500">
                服务于千行百业的 AI 开发者与企业级算力枢纽
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-indigo-50/80 to-slate-50/80 border border-indigo-100/90 relative overflow-hidden group hover:border-indigo-300 transition-all shadow-2xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(#6366f1_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between relative z-10">
                <span>注册用户与开发者</span>
                <Users className="w-4 h-4 text-indigo-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono relative z-10">
                12,580<span className="text-sm font-sans font-normal text-slate-500 ml-1">人</span>
              </div>
              <div className="text-[11px] text-emerald-600 font-bold mt-1.5 flex items-center gap-1 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>↑ 周环比增长 18.4%</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-cyan-50/80 to-slate-50/80 border border-cyan-100/90 relative overflow-hidden group hover:border-cyan-300 transition-all shadow-2xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(#06b6d4_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between relative z-10">
                <span>上架 Agent 智能体</span>
                <Bot className="w-4 h-4 text-cyan-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono relative z-10">
                356<span className="text-sm font-sans font-normal text-slate-500 ml-1">个</span>
              </div>
              <div className="text-[11px] text-cyan-700 font-bold mt-1.5 flex items-center gap-1 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                <span>累计调用 1,280 万次</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50/80 to-slate-50/80 border border-amber-100/90 relative overflow-hidden group hover:border-amber-300 transition-all shadow-2xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between relative z-10">
                <span>完成任务撮合与交付</span>
                <Briefcase className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono relative z-10">
                1,234<span className="text-sm font-sans font-normal text-slate-500 ml-1">笔</span>
              </div>
              <div className="text-[11px] text-amber-700 font-bold mt-1.5 flex items-center gap-1 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <span>撮合总赏金 ¥480万+</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-slate-50/80 border border-emerald-100/90 relative overflow-hidden group hover:border-emerald-300 transition-all shadow-2xs">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-bl-full pointer-events-none group-hover:scale-110 transition-transform" />
              <div className="absolute inset-0 bg-[radial-gradient(#10b981_0.5px,transparent_0.5px)] [background-size:12px_12px] opacity-10 pointer-events-none" />

              <div className="text-xs font-bold text-slate-500 flex items-center justify-between relative z-10">
                <span>累计节省开发者算力</span>
                <Cpu className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 font-mono relative z-10">
                ¥168<span className="text-sm font-sans font-normal text-slate-500 ml-1">万元</span>
              </div>
              <div className="text-[11px] text-emerald-700 font-bold mt-1.5 flex items-center gap-1 relative z-10">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>按需秒级弹性计费</span>
              </div>
            </div>
          </div>
        </div>

        {/* 合作伙伴生态 */}
        <div className="pt-4 border-t border-slate-100">
          <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-4">
            战略合作运营商与生态算力伙伴
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {partnerList.map((p, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70 hover:border-indigo-300 hover:bg-white hover:shadow-md transition flex flex-col justify-between items-center text-center group cursor-pointer"
              >
                <div className="text-xs font-black text-slate-800 group-hover:text-indigo-600">
                  {p.name}
                </div>
                <div className="text-[10px] font-mono text-slate-400 tracking-wider my-1">
                  {p.logoText}
                </div>
                <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-white text-indigo-700 border border-indigo-100">
                  {p.badge}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
