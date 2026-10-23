import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Robot,
  Brain as BrainIcon,
  HardDrives,
  ClipboardText,
  Trophy as TrophyIcon,
  ChatCircleText,
  CalendarCheck as CalendarIcon
} from '@phosphor-icons/react';
import {
  Bot,
  Brain,
  Cpu,
  ClipboardList,
  Trophy,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Gift,
  Play,
  Pause,
  X,
  CheckCircle2,
  Share2,
  Copy,
  ChevronRight,
  ChevronLeft,
  Flame,
  Star,
  Users,
  Layers,
  ArrowUpRight,
  Building2,
  Clock,
  Code2,
  Database,
  Wrench,
  Server,
  Zap,
  Megaphone,
  Radio
} from 'lucide-react';
import { AgentItem, ModelItem, DatasetItem, SkillPluginItem, RentalGPUCard } from '../../types';

interface HomeView04Props {
  onSwitchToVersion01?: () => void;
  onSwitchToVersion02?: () => void;
}

export const HomeView04: React.FC<HomeView04Props> = ({
  onSwitchToVersion01,
  onSwitchToVersion02
}) => {
  const {
    user,
    setActiveTab,
    setMarketplaceTab,
    setWorkspaceSubTab,
    checkInToday,
    hasCheckedInToday,
    setPublishTaskModalOpen,
    setCreateComputeModalOpen,
    setCreateComputePreset,
    agents,
    models,
    skills,
    datasets,
    tasks,
    posts,
    competitions,
    computeSpecs,
    openAgentDetail,
    openModelDetail,
    openDatasetDetail,
    openSkillDetail,
    openPostDetailWithOrigin,
    openCompetitionDetail,
    setSelectedTaskIdForDetail,
    showToast
  } = useApp();

  // 连续签到天数
  const continuousDays = user.continuousCheckInDays || 1;

  // 弹窗状态
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [activeVideoModal, setActiveVideoModal] = useState<{
    isOpen: boolean;
    title: string;
    duration: string;
    agentName: string;
    description: string;
  }>({
    isOpen: false,
    title: '',
    duration: '',
    agentName: '',
    description: ''
  });
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(15);

  // 1. 顶部轮播 Banner 状态
  const [bannerIndex, setBannerIndex] = useState(0);
  const [bannerProgress, setBannerProgress] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);

  // 动态构建算力卡片列表供预设与跳转使用
  const availableRentalCards: RentalGPUCard[] = useMemo(() => {
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
          availableCards: s.stock ?? 4,
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
        id: 'rtx-4090',
        title: 'RTX 4090 24G',
        availableCards: 8,
        hourlyPrice: 1.2,
        dayPrice: 26,
        weekPrice: 160,
        monthPrice: 620,
        topBorderColor: 'border-t-emerald-600',
        gpuModel: 'RTX 4090',
        vram: '24 GB GDDR6X',
        cpu: '16 vCPU',
        ram: '64 GB',
        disk: '100 GB NVMe'
      }
    ];
  }, [computeSpecs]);

  // 平台实时统计指标
  const heroStats = useMemo(() => {
    const modelCount = models?.length || 31;
    const agentCount = agents?.length || 86;
    const gpuCards = '1,200';
    const activeTasks = tasks?.filter(t => t.status === '进行中' || t.status === '已发布')?.length || 17;
    return { modelCount, agentCount, gpuCards, activeTasks };
  }, [models, agents, tasks]);

  // 顶部轮播 Banner 数据（精简清爽 · 留关键卖点）
  const banners = useMemo(() => [
    {
      id: 'hero-overview',
      isHero: true,
      badge: '全景生态 · 智算枢纽',
      title: '汇聚 AI 之力，成就万千可能',
      keywords: ['精选主流大模型', '垂直场景智能体', '弹性现货算力'],
      buttonText: '进入模型广场',
      action: () => {
        setMarketplaceTab('model');
        setActiveTab('marketplace');
      }
    },
    {
      id: 1,
      badge: '限时 6.0 折',
      title: 'DeepSeek-V4.1-Flash',
      keywords: ['百万超长上下文', '原生 Agent 推理', '现价输入 ¥3.6 ｜ 输出 ¥12'],
      buttonText: '立即调试 API',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      btnColor: 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700',
      action: () => {
        const found = models.find(m => m.name.toLowerCase().includes('deepseek')) || models[0];
        if (found) openModelDetail(found);
        else {
          setMarketplaceTab('model');
          setActiveTab('marketplace');
        }
      }
    },
    {
      id: 2,
      badge: '秒级调度 · ¥1.2/时起',
      title: 'RTX 4090 / A100 弹性集群',
      keywords: ['预装 PyTorch & ComfyUI', '秒级开箱即用', '按量弹性计费'],
      buttonText: '进入算力工坊',
      bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      btnColor: 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700',
      action: () => {
        const found = availableRentalCards?.find(c => c.gpuModel.toLowerCase().includes('4090')) || availableRentalCards?.[0];
        if (found) {
          setCreateComputePreset?.({ card: found });
        }
        setCreateComputeModalOpen(true);
      }
    },
    {
      id: 3,
      badge: '新人礼遇 · 注册即领',
      title: '注册立享 ¥20 体验金',
      keywords: ['全额抵扣模型与算力', '零门槛极速体验', '即刻到账'],
      buttonText: '领取 20 元体验金',
      bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
      btnColor: 'bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700',
      action: () => {
        showToast('20元体验金已激活！您可在调用模型或创建算力实例时直接抵扣。');
      }
    },
    {
      id: 4,
      badge: '算法黑客松 · 奖金 ¥50,000',
      title: '2026 AI 数据科学挑战赛',
      keywords: ['免费算力配额', '官方权威证书', '名企求职绿通'],
      buttonText: '立即报名参赛',
      bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-amber-50 text-amber-800 border-amber-200',
      btnColor: 'bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700',
      action: () => {
        setActiveTab('creative');
      }
    },
    {
      id: 5,
      badge: '揭榜挂帅 · 赏金 ¥15,000',
      title: '金融模型结构化抽取攻关',
      keywords: ['研报实体对齐', '合规智能质检', '极客揭榜速领'],
      buttonText: '查看揭榜任务',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      btnColor: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700',
      action: () => {
        setActiveTab('tasks');
      }
    }
  ], [models, openModelDetail, setActiveTab, setCreateComputeModalOpen, setCreateComputePreset, setMarketplaceTab, showToast, availableRentalCards]);

  // 顶部轮播定时器（5秒自动循环）
  useEffect(() => {
    if (isBannerPaused) return;
    const intervalTime = 50;
    const step = (100 / (5000 / intervalTime));

    const progressTimer = setInterval(() => {
      setBannerProgress(prev => {
        if (prev >= 100) {
          setBannerIndex(curr => (curr + 1) % banners.length);
          return 0;
        }
        return prev + step;
      });
    }, intervalTime);

    return () => clearInterval(progressTimer);
  }, [banners.length, isBannerPaused]);

  const handleSelectBanner = (index: number) => {
    setBannerIndex(index);
    setBannerProgress(0);
  };

  // 2. 七个核心业务入口（不能删，高度降低，每个卡片将图标与两行文字平行水平放置）
  const quickActions = [
    {
      name: '使用Agent',
      desc: '86 款即用智能体',
      bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
      iconColor: '#7C3AED',
      iconBg: 'bg-purple-100/80 text-purple-700 border-purple-200',
      IconComponent: Robot,
      action: () => {
        setMarketplaceTab('agent');
        setActiveTab('marketplace');
      }
    },
    {
      name: '找模型',
      desc: '主流开源与商业模型',
      bgGradient: 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
      iconColor: '#2563EB',
      iconBg: 'bg-blue-100/80 text-blue-700 border-blue-200',
      IconComponent: BrainIcon,
      action: () => {
        setMarketplaceTab('model');
        setActiveTab('marketplace');
      }
    },
    {
      name: '启动算力',
      desc: '4090/A100秒拉起',
      bgGradient: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)',
      iconColor: '#0891B2',
      iconBg: 'bg-cyan-100/80 text-cyan-700 border-cyan-200',
      IconComponent: HardDrives,
      action: () => {
        setActiveTab('compute');
      }
    },
    {
      name: '发布任务',
      desc: '揭榜挂帅众包协同',
      bgGradient: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
      iconColor: '#D97706',
      iconBg: 'bg-amber-100/80 text-amber-700 border-amber-200',
      IconComponent: ClipboardText,
      action: () => {
        setPublishTaskModalOpen(true);
      }
    },
    {
      name: '看赛事',
      desc: '算法与创新巅峰对抗',
      bgGradient: 'linear-gradient(135deg, #FDF2F8 0%, #FCE7F3 100%)',
      iconColor: '#DB2777',
      iconBg: 'bg-pink-100/80 text-pink-700 border-pink-200',
      IconComponent: TrophyIcon,
      action: () => {
        setActiveTab('creative');
      }
    },
    {
      name: '逛社区',
      desc: '前沿探讨与实战干货',
      bgGradient: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)',
      iconColor: '#4F46E5',
      iconBg: 'bg-indigo-100/80 text-indigo-700 border-indigo-200',
      IconComponent: ChatCircleText,
      action: () => {
        setActiveTab('community');
      }
    },
    {
      name: hasCheckedInToday ? `已签到${continuousDays}天` : '签到领积分',
      desc: hasCheckedInToday ? '今日奖励已入账' : '领积分抵扣调用额度',
      bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      iconColor: '#059669',
      iconBg: 'bg-emerald-100/80 text-emerald-700 border-emerald-200',
      IconComponent: CalendarIcon,
      action: () => {
        setIsCheckInModalOpen(true);
      }
    }
  ];

  // 3. 最新动态跑马灯事件列表（汇集任务、赛事、社区热帖与算力平台动态）
  const tickerEvents = useMemo(() => [
    {
      id: 't-1',
      tag: '热门悬赏',
      tagColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      text: '华泰数科发布《金融模型研报多维实体抽取算法》，赏金 ¥15,000 招募揭榜中',
      target: () => setActiveTab('tasks')
    },
    {
      id: 't-2',
      tag: '重磅赛事',
      tagColor: 'bg-purple-50 text-purple-700 border-purple-200',
      text: '2026 全国大模型智能体创新极客松火热报名中，免费提供千卡专属集群',
      target: () => setActiveTab('creative')
    },
    {
      id: 't-3',
      tag: '技术热帖',
      tagColor: 'bg-blue-50 text-blue-700 border-blue-200',
      text: '《DeepSeek-R1 纯强化学习思维链在企业知识库落地实操全纪录》(342赞/89评)',
      target: () => setActiveTab('community')
    },
    {
      id: 't-4',
      tag: '算力直降',
      tagColor: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      text: '华东昇腾 910B 国产算力集群新增 128 卡现货上架，秒级拉起低至 ¥1.2/时',
      target: () => setActiveTab('compute')
    },
    {
      id: 't-5',
      tag: '特惠上线',
      tagColor: 'bg-rose-50 text-rose-700 border-rose-200',
      text: 'DeepSeek-V4.1-Flash (1017版) 限时 6.0 折火热直调，百万上下文推理秒级响应',
      target: () => {
        setMarketplaceTab('model');
        setActiveTab('marketplace');
      }
    },
    {
      id: 't-6',
      tag: '任务交付',
      tagColor: 'bg-amber-50 text-amber-700 border-amber-200',
      text: '工业边缘缺陷检测算法项目通过验收，¥8,500 赏金已成功划转托管账户',
      target: () => setActiveTab('tasks')
    }
  ], [setActiveTab, setMarketplaceTab]);

  // 4. 特价模型专区真实模型数据（0.2 版本：4 款核心热门模型）
  const specialModels = [
    {
      name: 'DeepSeek-V4.1-Flash (1017版)',
      provider: '深度求索（DeepSeek）',
      desc: '智能体推理与“许愿式编程”能力全面升级，极致的智效比与高并发吞吐。',
      originalPrice: '输入 ¥6 ｜ 输出 ¥20',
      currentPrice: '输入 ¥3.6 ｜ 输出 ¥12',
      discount: '6.0折',
      tags: ['百万上下文', '原生Agent', '极速推理'],
      searchKeyword: 'DeepSeek',
      bgPattern: 'from-blue-50/80 via-white to-slate-50/50'
    },
    {
      name: 'Qwen3.8-Max',
      provider: '阿里云百炼',
      desc: '2.4万亿总参数MoE架构，智能体编程与复杂工具调用达到领域SOTA水平，支持深度思考模式。',
      originalPrice: '输入 ¥12 ｜ 输出 ¥36',
      currentPrice: '输入 ¥9 ｜ 输出 ¥27',
      discount: '7.5折',
      tags: ['超万亿MoE', '深度思考', '全能编程'],
      searchKeyword: 'Qwen',
      bgPattern: 'from-sky-50/80 via-white to-slate-50/50'
    },
    {
      name: 'Kimi K3 (Max)',
      provider: '月之暗面（Moonshot AI）',
      desc: '2.8万亿参数全球最大开源模型，原生多模态视觉理解，在软件工程、长文本深度推理及前端开发中表现顶尖。',
      originalPrice: '输入 ¥20 ｜ 输出 ¥100',
      currentPrice: '输入 ¥13 ｜ 输出 ¥66',
      discount: '6.6折',
      tags: ['2.8T旗舰参数', '原生多模态', '超强长文本'],
      searchKeyword: 'Kimi',
      bgPattern: 'from-emerald-50/80 via-white to-slate-50/50'
    },
    {
      name: 'GLM-5.3',
      provider: '智谱 AI',
      desc: '智谱最新旗舰，通过极致后训练Scaling大幅提升复杂软件工程与多步Agent任务能力，编程体验跃升50%。',
      originalPrice: '输入 ¥8 ｜ 输出 ¥28',
      currentPrice: '输入 ¥4 ｜ 输出 ¥14',
      discount: '5.0折',
      tags: ['新一代旗舰', '极速编程', '复杂Agent协同'],
      searchKeyword: 'GLM',
      bgPattern: 'from-purple-50/80 via-white to-slate-50/50'
    }
  ];

  // 5. 场景化“我猜你想...”卡片配置（0.2 版本：4款核心场景）
  const scenarioSolutions = [
    {
      id: 'custom-service',
      title: '智能客服',
      subtitle: '快速搭建 7×24h 智能问答客服机器人',
      desc: '接入企业私有知识库，自动识别访客意图并秒级解答，降低 80% 人工转接成本',
      recommendAgent: '智能客服Agent',
      badge: '快速搭建',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      videoDuration: '3分钟上手',
      bgImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80',
      icon: MessageSquare
    },
    {
      id: 'data-analysis',
      title: '数据分析',
      subtitle: '一键生成深度商业多维分析报告',
      desc: '上传 Excel / CSV 数据表，自动清洗脏数据、绘制关键走势图表并输出洞察分析',
      recommendAgent: '数据分析助手',
      badge: '一键生成',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      videoDuration: '5分钟实战',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=80',
      icon: TrendingUp
    },
    {
      id: 'ai-painting',
      title: 'AI绘画',
      subtitle: '文生图与可控电商海报超清工作流',
      desc: '支持 Flux / SDXL 商业模型，快速生成电商主图、游戏素材与广告海报高清设计稿',
      recommendAgent: '文生图Pro',
      badge: '高质量生成',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      videoDuration: '4分钟工作流',
      bgImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=600&auto=format&fit=crop&q=80',
      icon: Sparkles
    },
    {
      id: 'code-assistant',
      title: '代码助手',
      subtitle: '代码生成、单元测试与快速调试优化',
      desc: '支持 Python / TS / Go / Java 等主流语言，智能定位逻辑 Bug 并提供性能重构建议',
      recommendAgent: '代码助手Agent',
      badge: '代码调试',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      videoDuration: '3分钟配置',
      bgImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      icon: Code2
    }
  ];

  // 9. AI资源榜单 (5个子榜单：模型、Agent、Skill、数据集、GPU实例)
  const rankingBoards = [
    {
      id: 'models',
      title: '模型调用榜',
      icon: Brain,
      iconColor: 'text-blue-600 bg-blue-50/80 border border-blue-200/60',
      metricLabel: '调用量',
      items: [
        { rank: 1, name: 'DeepSeek-V3', metric: '23.4万', category: '通用语言', progress: 100 },
        { rank: 2, name: '通义千问 Qwen2.5', metric: '18.2万', category: '全能基座', progress: 78 },
        { rank: 3, name: '文心一言 4.0', metric: '12.1万', category: '中文知识', progress: 52 },
        { rank: 4, name: 'GLM-4', metric: '9.8万', category: '长文推理', progress: 42 },
        { rank: 5, name: 'Claude 3.5 Sonnet', metric: '7.6万', category: '代码生成', progress: 32 }
      ],
      onItemClick: (item: { name: string }) => {
        const found = models.find(m => m.name.toLowerCase().includes(item.name.toLowerCase().split(' ')[0])) || models[0];
        if (found) openModelDetail(found);
        else {
          setMarketplaceTab('model');
          setActiveTab('marketplace');
        }
      },
      onMoreClick: () => {
        setMarketplaceTab('model');
        setActiveTab('marketplace');
      }
    },
    {
      id: 'agents',
      title: 'Agent调用榜',
      icon: Bot,
      iconColor: 'text-indigo-600 bg-indigo-50/80 border border-indigo-200/60',
      metricLabel: '调用量',
      items: [
        { rank: 1, name: '智能客服Agent', metric: '1,234', category: '客户服务', progress: 100 },
        { rank: 2, name: '数据分析助手', metric: '987', category: '商业智能', progress: 80 },
        { rank: 3, name: '文生图Pro', metric: '856', category: '创意图像', progress: 69 },
        { rank: 4, name: '代码助手', metric: '743', category: '研发提效', progress: 60 },
        { rank: 5, name: '翻译助手', metric: '621', category: '多语互译', progress: 50 }
      ],
      onItemClick: (item: { name: string }) => {
        const found = agents.find(a => a.name.includes(item.name.slice(0, 4))) || agents[0];
        if (found) openAgentDetail(found);
        else {
          setMarketplaceTab('agent');
          setActiveTab('marketplace');
        }
      },
      onMoreClick: () => {
        setMarketplaceTab('agent');
        setActiveTab('marketplace');
      }
    },
    {
      id: 'skills',
      title: 'Skill下载榜',
      icon: Wrench,
      iconColor: 'text-amber-600 bg-amber-50/80 border border-amber-200/60',
      metricLabel: '下载量',
      items: [
        { rank: 1, name: 'WebSearch Pro', metric: '3,456', category: '全网检索', progress: 100 },
        { rank: 2, name: 'Python Sandbox', metric: '2,890', category: '安全沙箱', progress: 83 },
        { rank: 3, name: 'PDF文档深度解析', metric: '2,345', category: '文档抽取', progress: 68 },
        { rank: 4, name: 'SQL自动查询器', metric: '1,890', category: '数据引擎', progress: 54 },
        { rank: 5, name: '图表可视化插件', metric: '1,567', category: '渲染分析', progress: 45 }
      ],
      onItemClick: (item: { name: string }) => {
        const found = skills.find(s => s.name.includes(item.name.slice(0, 4))) || skills[0];
        if (found) openSkillDetail(found);
        else {
          setMarketplaceTab('skill');
          setActiveTab('marketplace');
        }
      },
      onMoreClick: () => {
        setMarketplaceTab('skill');
        setActiveTab('marketplace');
      }
    },
    {
      id: 'datasets',
      title: '数据集下载榜',
      icon: Database,
      iconColor: 'text-emerald-600 bg-emerald-50/80 border border-emerald-200/60',
      metricLabel: '下载量',
      items: [
        { rank: 1, name: '中文金融对话语料', metric: '890次', category: '垂直微调', progress: 100 },
        { rank: 2, name: '医疗问答知识库', metric: '756次', category: '权威分诊', progress: 85 },
        { rank: 3, name: '工业质检缺陷标注', metric: '623次', category: '机器视觉', progress: 70 },
        { rank: 4, name: '法律判例与合规库', metric: '512次', category: '法务审校', progress: 57 },
        { rank: 5, name: '自动驾驶场景点云', metric: '421次', category: '3D 感知', progress: 47 }
      ],
      onItemClick: (item: { name: string }) => {
        const found = datasets.find(d => d.name.includes(item.name.slice(0, 4))) || datasets[0];
        if (found) openDatasetDetail(found);
        else {
          setMarketplaceTab('dataset');
          setActiveTab('marketplace');
        }
      },
      onMoreClick: () => {
        setMarketplaceTab('dataset');
        setActiveTab('marketplace');
      }
    },
    {
      id: 'gpus',
      title: 'GPU实例租用榜',
      icon: Cpu,
      iconColor: 'text-purple-600 bg-purple-50/80 border border-purple-200/60',
      metricLabel: '租用量',
      items: [
        { rank: 1, name: 'RTX 4090 (24G)', metric: '5,800卡时', category: '性价比之王', progress: 100 },
        { rank: 2, name: 'A100 SXM4 (80G)', metric: '4,200卡时', category: '大模型训练', progress: 72 },
        { rank: 3, name: 'Tesla T4 (16G)', metric: '2,580卡时', category: '轻量推理', progress: 44 },
        { rank: 4, name: 'H800 SXM5 (80G)', metric: '1,200卡时', category: '千卡集群', progress: 21 },
        { rank: 5, name: 'V100 (32G)', metric: '980卡时', category: '稳健老牌', progress: 17 }
      ],
      onItemClick: (item: { name: string }) => {
        const keyword = item.name.split(' ')[0].toLowerCase();
        const found = availableRentalCards?.find(c => c.gpuModel.toLowerCase().includes(keyword)) || availableRentalCards?.[0];
        if (found) {
          setCreateComputePreset?.({ card: found });
        }
        setActiveTab('compute');
      },
      onMoreClick: () => {
        setActiveTab('compute');
      }
    }
  ];

  // 合作伙伴 Logo 数据
  const partnerLogos = [
    { name: '阿里云百炼', tag: '生态共建伙伴' },
    { name: '深度求索 (DeepSeek)', tag: '官方技术授权' },
    { name: '智谱 AI', tag: '基座模型联盟' },
    { name: '月之暗面 (Moonshot)', tag: '战略合作方' },
    { name: '火山引擎 (字节跳动)', tag: '基础设施支持' },
    { name: '华为昇腾生态', tag: '国产化适配基地' },
    { name: '南京集成电路培训基地', tag: '人才培育基地' },
    { name: '南京大学人工智能学院', tag: '联合产学研实验室' }
  ];

  return (
    <div className="w-full space-y-5 text-slate-800 relative min-h-screen pb-12 select-none">
      {/* 极浅网格高质感背景底 */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#F5F7FD]" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#dce3f5_1px,transparent_1px)] [background-size:24px_24px] opacity-75" />

      {/* ========================================================
          1. 顶部轮播 Banner (将原 Hero 与下方的 Banner 合并，高度减小，置于页面顶部 · 全屏自适应)
         ======================================================== */}
      <div
        onMouseEnter={() => setIsBannerPaused(true)}
        onMouseLeave={() => setIsBannerPaused(false)}
        className="relative rounded-2xl sm:rounded-3xl overflow-hidden h-[165px] sm:h-[175px] lg:h-[180px] border border-slate-200/90 shadow-[0_6px_24px_-8px_rgba(99,102,241,0.12)] select-none bg-white group"
      >
        {banners.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === bannerIndex ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            {item.isHero ? (
              <div className="relative z-10 h-full w-full px-5 py-4 sm:px-8 sm:py-5 flex items-center justify-between gap-6">
                {/* 背景 5 个独立彩色光斑层（白色基底 + 5 个 500x500 独立动画光斑 div） */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-10">
                  <div className="absolute inset-0 bg-white" />
                  <div
                    className="hero-glow-spot-1 absolute -top-[80px] -left-[60px] w-[500px] h-[500px] rounded-full blur-[80px] opacity-60"
                    style={{ background: 'radial-gradient(circle, #E0C3FC 0%, transparent 70%)' }}
                  />
                  <div
                    className="hero-glow-spot-2 absolute -top-[80px] -right-[60px] w-[500px] h-[500px] rounded-full blur-[80px] opacity-60"
                    style={{ background: 'radial-gradient(circle, #A1C4FD 0%, transparent 70%)' }}
                  />
                  <div
                    className="hero-glow-spot-3 absolute -bottom-[100px] left-[5%] w-[500px] h-[500px] rounded-full blur-[80px] opacity-60"
                    style={{ background: 'radial-gradient(circle, #FBC2EB 0%, transparent 70%)' }}
                  />
                  <div
                    className="hero-glow-spot-4 absolute -top-[50px] left-[32%] w-[500px] h-[500px] rounded-full blur-[80px] opacity-60"
                    style={{ background: 'radial-gradient(circle, #A1E3F9 0%, transparent 70%)' }}
                  />
                  <div
                    className="hero-glow-spot-5 absolute -bottom-[100px] right-[5%] w-[500px] h-[500px] rounded-full blur-[80px] opacity-60"
                    style={{ background: 'radial-gradient(circle, #FDEB71 0%, transparent 70%)' }}
                  />
                  <div className="absolute inset-0 bg-white/20 pointer-events-none" />
                </div>

                {/* 左侧：精简清爽主标题 + 核心关键词 + 探索按钮 */}
                <div className="flex-1 min-w-0 pr-2 lg:pr-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border border-indigo-200/80 bg-white/95 text-indigo-700 shadow-2xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                      <span>{item.badge}</span>
                    </span>
                  </div>

                  {/* 艺术感主标题 */}
                  <h1 className="text-xl sm:text-2xl lg:text-[26px] font-black text-slate-900 tracking-tight leading-none">
                    汇聚 AI 之力，成就
                    <span className="relative inline-block ml-2">
                      <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
                        万千可能
                      </span>
                      <svg className="absolute -bottom-1 left-0 w-full h-2 text-indigo-400/50" viewBox="0 0 180 12" fill="none">
                        <path d="M2.5 9C45 2.5 135 2.5 177.5 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
                      </svg>
                    </span>
                  </h1>

                  {/* 核心亮点关键词（清爽通透，不堆文字） */}
                  <div className="flex flex-wrap items-center gap-2 mt-2.5 text-xs text-slate-600 font-medium">
                    {item.keywords?.map((kw, kwIdx) => (
                      <span key={kwIdx} className="inline-flex items-center gap-1.5">
                        <span className="w-1 h-1 rounded-full bg-indigo-500" />
                        <span>{kw}</span>
                        {kwIdx < item.keywords.length - 1 && (
                          <span className="text-slate-300 font-light ml-1">｜</span>
                        )}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={item.action}
                      className="px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-sm hover:shadow transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* 右侧：纯粹清爽的3项核心生态数据（磨砂玻璃胶囊，无小卡片堆砌） */}
                <div className="hidden md:flex items-center gap-6 xl:gap-8 px-6 py-3.5 rounded-2xl bg-white/75 backdrop-blur-md border border-white/90 shadow-sm shrink-0">
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                      {heroStats.modelCount}<span className="text-indigo-600 text-sm font-bold">+</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">主流大模型</div>
                  </div>
                  <div className="w-px h-7 bg-slate-200/80" />
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                      {heroStats.agentCount}<span className="text-violet-600 text-sm font-bold">+</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">场景智能体</div>
                  </div>
                  <div className="w-px h-7 bg-slate-200/80" />
                  <div className="text-center">
                    <div className="text-2xl font-black font-mono text-slate-900 tracking-tight">
                      {heroStats.gpuCards}<span className="text-sky-600 text-sm font-bold">卡</span>
                    </div>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">现货算力池</div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* 右侧生动清晰的彩色大图 */}
                <div className="absolute right-0 top-0 bottom-0 w-1/2 lg:w-5/12 overflow-hidden">
                  <img
                    src={item.bgImage}
                    alt={item.title}
                    className="w-full h-full object-cover object-center opacity-85 scale-100 group-hover:scale-105 transition-transform duration-1000"
                  />
                  {/* 从左往右纯白平滑渐变遮罩 */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
                </div>

                {/* 左侧文字与按钮（清爽简洁，关键词排版） */}
                <div className="relative z-10 h-full px-5 py-4 sm:px-8 sm:py-5 flex flex-col justify-between max-w-xl lg:max-w-2xl">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border shadow-2xs ${item.tagColor} bg-white/95`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                        <span>{item.badge}</span>
                      </span>
                    </div>

                    <h2 className="text-xl sm:text-2xl lg:text-[25px] font-black text-slate-900 tracking-tight leading-snug">
                      {item.title}
                    </h2>

                    {/* 关键特性标签（清晰关键词） */}
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600 font-medium">
                      {item.keywords?.map((kw, kwIdx) => (
                        <span key={kwIdx} className="inline-flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-indigo-500" />
                          <span>{kw}</span>
                          {kwIdx < item.keywords.length - 1 && (
                            <span className="text-slate-300 font-light ml-1">｜</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-3">
                    <button
                      onClick={item.action}
                      className={`px-4 py-1.5 sm:py-2 rounded-xl ${item.btnColor} text-white font-bold text-xs shadow-sm hover:shadow transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]`}
                    >
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}

        {/* 顶部微型自动播放进度条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 transition-all duration-75"
            style={{ width: `${bannerProgress}%` }}
          />
        </div>

        {/* 轮播指示器与切换小控制台 */}
        <div className="absolute bottom-3 right-4 sm:bottom-4 sm:right-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full border border-slate-200/90 shadow-sm text-slate-700 text-xs">
          <span className="font-mono text-[11px] text-slate-500 font-bold">
            0{bannerIndex + 1} / 0{banners.length}
          </span>
          <div className="flex items-center gap-1 ml-1">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectBanner(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === bannerIndex ? 'w-4 bg-indigo-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
                }`}
                title={`切换至第 ${i + 1} 张`}
              />
            ))}
          </div>
        </div>

        {/* 悬停显示的上一张/下一张按钮 */}
        <button
          onClick={() => handleSelectBanner((bannerIndex - 1 + banners.length) % banners.length)}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition cursor-pointer border border-slate-200 opacity-0 group-hover:opacity-100"
          title="上一张"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSelectBanner((bannerIndex + 1) % banners.length)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition cursor-pointer border border-slate-200 opacity-0 group-hover:opacity-100"
          title="下一张"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ========================================================
          2. 七个核心业务入口 (高度大幅降低 · 图标与两行文字平行水平放置 · 全屏自适应)
         ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3 xl:gap-3.5">
        {quickActions.map((item, idx) => {
          const IconComp = item.IconComponent;
          return (
            <button
              key={idx}
              onClick={item.action}
              className="py-2.5 px-3 xl:py-3 xl:px-4 rounded-xl border border-slate-200/90 hover:border-indigo-400 bg-white hover:bg-slate-50/80 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-md transition-all duration-200 cursor-pointer group flex items-center gap-2.5 xl:gap-3 text-left select-none overflow-hidden"
              style={{ background: item.bgGradient }}
            >
              {/* 左侧：Phosphor Duotone 双调图标 */}
              <div className="w-9 h-9 xl:w-10 xl:h-10 rounded-lg bg-white/90 border border-slate-200/80 flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <IconComp
                  size={24}
                  weight="duotone"
                  color={item.iconColor}
                  className="shrink-0"
                />
              </div>

              {/* 右侧：两行文字水平并列放置 */}
              <div className="min-w-0 flex-1">
                <div className="font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-indigo-600 transition truncate leading-snug">
                  {item.name}
                </div>
                <div className="text-[10px] xl:text-[11px] text-slate-500 font-medium truncate mt-0.5 leading-none">
                  {item.desc}
                </div>
              </div>
            </button>
          );
        })}
      </div>




      {/* ========================================================
          6. 特价模型专区 (横向 4 个真实热门模型卡片 · 浅色明快)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 hover:border-indigo-200/90 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/60">
              <Brain className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">
                特价模型 · 限时优惠
              </h2>
              <span className="text-xs text-slate-500">
                官方直签授权 · 算力专线高速直连 · 实时生效
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              setMarketplaceTab('model');
              setActiveTab('marketplace');
            }}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>查看全部模型</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {specialModels.map(model => (
            <div
              key={model.name}
              className={`p-4 rounded-xl border border-slate-200/80 hover:border-indigo-300 bg-gradient-to-b ${model.bgPattern} flex flex-col justify-between transition-all duration-200 group shadow-2xs hover:shadow-md hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5 gap-1">
                  <span className="font-black text-sm text-slate-900 group-hover:text-indigo-600 transition truncate">
                    {model.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white shadow-xs text-[11px] font-black tracking-tight shrink-0 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                    <span>{model.discount}</span>
                  </span>
                </div>
                
                <div className="text-[11px] text-slate-500 mb-2 font-medium">
                  {model.provider}
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed min-h-[32px]">
                  {model.desc}
                </p>

                {/* 特性标签（精炼3个卖点） */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {model.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded-md bg-white/95 border border-slate-200/90 text-slate-700 font-semibold shadow-2xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-slate-200/80 mt-3 space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span className="text-slate-400 font-sans">原价</span>
                  <span className="line-through text-slate-400 font-medium">
                    {model.originalPrice}
                    <span className="text-[9px] text-slate-400 font-sans ml-0.5">/M</span>
                  </span>
                </div>

                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-[11px] font-black text-rose-600 flex items-center gap-1 shrink-0">
                    <span>现价</span>
                  </span>
                  <div className="text-right">
                    <span className="text-xs font-black font-mono text-rose-600 tracking-tight">
                      {model.currentPrice}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono ml-0.5">/1M</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    const found = models.find(m => m.name.toLowerCase().includes(model.searchKeyword.toLowerCase())) || models[0];
                    if (found) openModelDetail(found);
                    else {
                      setMarketplaceTab('model');
                      setActiveTab('marketplace');
                    }
                  }}
                  className="w-full mt-2 py-1.5 rounded-lg bg-white hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 text-indigo-600 hover:text-white border border-indigo-200 hover:border-transparent font-bold text-xs transition-all duration-200 cursor-pointer flex items-center justify-center gap-1 shadow-2xs hover:shadow-xs"
                >
                  <span>立即使用</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          7. 我猜你想（场景化解决方案 · 生动彩色封面，绝不黑漆漆）
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 hover:border-indigo-200/90 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-violet-50 text-violet-600 border border-violet-200/60">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">
                我猜你想...
              </h2>
              <span className="text-xs text-slate-500">
                场景化开箱即用 · 4款核心业务直通车与实战视频
              </span>
            </div>
          </div>
          <span className="text-xs text-violet-600 font-mono font-medium">
            场景驱动推荐
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {scenarioSolutions.map(s => {
            const IconComp = s.icon;
            return (
              <div
                key={s.id}
                className="rounded-xl border border-slate-200/80 hover:border-violet-300 bg-white overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 group"
              >
                {/* 顶部：生动鲜明彩色摄影封面 + 柔和通透遮罩 */}
                <div
                  onClick={() => {
                    const matched = agents.find(a => a.name.includes(s.recommendAgent.replace('Agent', ''))) || agents[0];
                    if (matched) openAgentDetail(matched);
                    else {
                      setMarketplaceTab('agent');
                      setActiveTab('marketplace');
                    }
                  }}
                  className="relative h-28 p-3 flex flex-col justify-between cursor-pointer overflow-hidden bg-slate-100"
                >
                  <img
                    src={s.bgImage}
                    alt={s.title}
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-95 group-hover:scale-105 transition-all duration-700"
                  />
                  {/* 柔和透光微遮罩，画面明亮通透鲜艳 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/45 via-transparent to-transparent" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="w-8 h-8 rounded-lg bg-white/95 text-slate-900 shadow-sm flex items-center justify-center">
                      <IconComp className="w-4 h-4 text-violet-600" />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border shadow-2xs font-semibold ${s.badgeColor} bg-white/95`}>
                      {s.badge}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-black text-sm tracking-wide text-white drop-shadow-sm group-hover:text-violet-200 transition-colors">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-white/90 drop-shadow-sm truncate mt-0.5 font-medium">
                      {s.subtitle}
                    </p>
                  </div>
                </div>

                {/* 底部白色区域：文字描述与视频教程按钮 */}
                <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {s.desc}
                    </p>
                    <div className="mt-2.5 text-xs text-slate-700 font-medium">
                      <span className="text-slate-400">推荐方案:</span>{' '}
                      <strong className="text-violet-600 font-bold">{s.recommendAgent}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const matched = agents.find(a => a.name.includes(s.recommendAgent.replace('Agent', ''))) || agents[0];
                        if (matched) openAgentDetail(matched);
                        else {
                          setMarketplaceTab('agent');
                          setActiveTab('marketplace');
                        }
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-slate-50 hover:bg-gradient-to-r hover:from-indigo-600 hover:to-violet-600 text-slate-700 hover:text-white border border-slate-200/80 hover:border-transparent font-bold text-xs transition-all duration-200 cursor-pointer text-center shadow-2xs"
                    >
                      立即体验
                    </button>

                    <button
                      onClick={() => {
                        setActiveVideoModal({
                          isOpen: true,
                          title: `${s.title} · 实战应用工作流指引`,
                          duration: s.videoDuration,
                          agentName: s.recommendAgent,
                          description: s.desc
                        });
                        setIsVideoPlaying(true);
                        setVideoProgress(15);
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200/80 text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                      title="观看视频教程"
                    >
                      <Play className="w-3 h-3 fill-violet-600" />
                      <span className="text-[11px] font-mono">{s.videoDuration}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          8. AI资源榜单 (5个子榜单横向排列：模型、Agent、Skill、数据集、GPU实例)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 hover:border-indigo-200/90 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/60">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">
                AI 资源榜单
              </h2>
              <span className="text-xs text-slate-500">
                平台真实数据排行 · 发现全网最受欢迎核心生产力资产
              </span>
            </div>
          </div>
          <span className="text-xs text-indigo-600 font-mono font-medium">
            全要素资源榜
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-3.5">
          {rankingBoards.map(board => {
            const BoardIcon = board.icon;
            return (
              <div
                key={board.id}
                className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/40 hover:bg-white hover:border-indigo-300 flex flex-col justify-between transition-all duration-200 shadow-2xs"
              >
                <div>
                  {/* 子榜单标题 */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/50 mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className={`w-6 h-6 rounded-md flex items-center justify-center ${board.iconColor}`}>
                        <BoardIcon className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="font-black text-xs text-slate-900">
                        {board.title}
                      </h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {board.metricLabel}
                    </span>
                  </div>

                  {/* Top 5 列表 */}
                  <div className="space-y-1.5">
                    {board.items && board.items.length > 0 ? (
                      board.items.map(item => (
                        <div
                          key={item.rank}
                          onClick={() => board.onItemClick(item)}
                          className="relative p-1.5 rounded-lg hover:bg-indigo-50/60 transition cursor-pointer flex items-center justify-between gap-1.5 group overflow-hidden"
                        >
                          {/* 背景刻度指示条 */}
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-indigo-100/35 group-hover:bg-indigo-200/40 transition-all pointer-events-none"
                            style={{ width: `${item.progress}%` }}
                          />

                          <div className="relative z-10 flex items-center gap-2 min-w-0">
                            <span
                              className={`w-4 h-4 rounded text-[10px] font-mono font-black flex items-center justify-center shrink-0 ${
                                item.rank === 1
                                  ? 'bg-amber-400 text-slate-950 font-bold shadow-2xs'
                                  : item.rank === 2
                                  ? 'bg-slate-300 text-slate-900'
                                  : item.rank === 3
                                  ? 'bg-amber-200 text-amber-950'
                                  : 'bg-slate-200 text-slate-600'
                              }`}
                            >
                              {item.rank}
                            </span>
                            <div className="min-w-0">
                              <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-600 truncate block">
                                {item.name}
                              </span>
                            </div>
                          </div>

                          <span className="relative z-10 text-[11px] font-mono font-bold text-indigo-600 shrink-0">
                            {item.metric}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="py-6 text-center text-xs text-slate-400">
                        暂无数据
                      </div>
                    )}
                  </div>
                </div>

                {/* 底部更多 */}
                <div className="pt-2 border-t border-slate-100 mt-2 text-center">
                  <button
                    onClick={board.onMoreClick}
                    className="text-[11px] font-semibold text-slate-500 hover:text-indigo-600 transition cursor-pointer flex items-center justify-center gap-0.5 mx-auto"
                  >
                    <span>查看完整资源</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>


      {/* ========================================================
          8. 底部导航与版权
         ======================================================== */}
      <div className="pt-3 border-t border-slate-200 text-center text-xs text-slate-500 space-y-1.5 pb-6">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600 font-medium">
          <button onClick={() => showToast('关于我们：千机 AI 场景驱动与普惠算力平台')} className="hover:text-indigo-600 transition cursor-pointer">关于我们</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => showToast('用户服务协议已生效，保障开发者与企业数据资产权益')} className="hover:text-indigo-600 transition cursor-pointer">用户协议</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => showToast('全流程遵循数据安全与脱敏审计规范')} className="hover:text-indigo-600 transition cursor-pointer">隐私政策</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => showToast('在线工单系统全天候技术专员响应')} className="hover:text-indigo-600 transition cursor-pointer">帮助中心</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => showToast('商务合作邮箱：service@qianji-ai.com')} className="hover:text-indigo-600 transition cursor-pointer">联系我们</button>
        </div>
        <p className="text-[11px] text-slate-400">
          © 2026 赛宁·千机 AI 综合应用门户 · 苏ICP备20260812号-1 · 南京市人工智能生态示范工程
        </p>
      </div>

      {/* ========================================================
          弹窗组件 1: 每日签到弹窗
         ======================================================== */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 text-white relative">
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">📅</span>
                <span className="text-xs font-bold tracking-wider uppercase opacity-90">每日签到 · 积分奖励</span>
              </div>
              <h2 className="text-2xl font-black">签到赚积分，抵扣算力与API</h2>
              <p className="text-xs text-white/90 mt-1">
                连续签到奖励递增，积分可 1:1 抵扣模型推理与算力租赁费用
              </p>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">已连续签到</span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {continuousDays} <span className="text-sm font-normal text-slate-500">天</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">可用积分余额</span>
                  <div className="text-2xl font-black text-emerald-600 font-mono mt-0.5">
                    {user.points || 0}
                  </div>
                </div>
              </div>

              {/* 7日签到进度胶囊 */}
              <div className="grid grid-cols-7 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map(day => {
                  const isPast = day <= continuousDays;
                  const isToday = day === continuousDays;
                  return (
                    <div
                      key={day}
                      className={`rounded-xl p-2 text-center border transition-all ${
                        isPast
                          ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                          : 'bg-slate-50 border-slate-200 text-slate-400'
                      }`}
                    >
                      <div className="text-[10px] font-bold">第{day}天</div>
                      <div className="text-xs font-black mt-1">+{day * 5}</div>
                      <div className="mt-1 flex justify-center">
                        {isPast ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2">
                <button
                  disabled={hasCheckedInToday}
                  onClick={() => {
                    checkInToday();
                    showToast('签到成功！积分已发放至您的钱包账户。');
                    setIsCheckInModalOpen(false);
                  }}
                  className={`w-full py-3 rounded-xl font-black text-sm shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    hasCheckedInToday
                      ? 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed shadow-none'
                      : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-emerald-500/20 hover:shadow-lg'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{hasCheckedInToday ? '今日已完成签到' : '立即签到 (+5积分)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          弹窗组件 2: 邀请好友返利弹窗
         ======================================================== */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white relative">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xl">🤝</span>
                <span className="text-xs font-bold tracking-wider uppercase opacity-90">开发者邀请计划</span>
              </div>
              <h2 className="text-2xl font-black">邀请好友，双方各得 ¥20</h2>
              <p className="text-xs text-white/90 mt-1">
                好友通过您的专属链接完成注册，系统自动派发 20 元现金抵扣券与 100 积分
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">您的专属邀请码</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="QIANJI-VIP-8829"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-bold text-slate-800 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('QIANJI-VIP-8829');
                      showToast('邀请码已复制到剪贴板！');
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>复制</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">专属邀请链接</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://qianji.ai/register?invite=QIANJI-VIP-8829"
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 truncate focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText('https://qianji.ai/register?invite=QIANJI-VIP-8829');
                      showToast('邀请链接已复制到剪贴板！');
                    }}
                    className="px-3 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>分享</span>
                  </button>
                </div>
              </div>

              <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-3 text-xs text-amber-800 leading-relaxed">
                <strong>💡 返利规则：</strong> 好友成功注册后，体验金即刻到账；好友首月消费算力，您还可额外享受 10% 算力返佣奖励。
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          弹窗组件 3: 视频播放弹窗
         ======================================================== */}
      {activeVideoModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <button
                onClick={() => setActiveVideoModal({ ...activeVideoModal, isOpen: false })}
                className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/20 hover:bg-white/40 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* 模拟视频播放画面 */}
              <div className="text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 flex items-center justify-center mx-auto text-white shadow-lg animate-pulse">
                  {isVideoPlaying ? (
                    <Play className="w-8 h-8 fill-white ml-1" />
                  ) : (
                    <Pause className="w-8 h-8 fill-white" />
                  )}
                </div>
                <h3 className="text-white font-black text-lg">{activeVideoModal.title}</h3>
                <p className="text-xs text-slate-400 max-w-md mx-auto">{activeVideoModal.description}</p>
                <span className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-mono">
                  视频模拟播放中 · 进度 {videoProgress}% / {activeVideoModal.duration}
                </span>
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-1 bg-slate-800">
                <div className="h-full bg-indigo-500" style={{ width: `${videoProgress}%` }} />
              </div>
            </div>

            <div className="p-5 bg-slate-900 flex items-center justify-between border-t border-slate-800">
              <div className="text-xs text-slate-400">
                推荐关联：<strong className="text-white">{activeVideoModal.agentName}</strong>
              </div>
              <button
                onClick={() => {
                  setActiveVideoModal({ ...activeVideoModal, isOpen: false });
                  setMarketplaceTab('agent');
                  setActiveTab('marketplace');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <span>立即上手该工作流</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
