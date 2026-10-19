import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Robot,
  Brain as BrainIcon,
  HardDrives,
  ClipboardText,
  Trophy as TrophyIcon,
  CalendarCheck as CalendarIcon
} from '@phosphor-icons/react';
import {
  Bot,
  Brain,
  Cpu,
  ClipboardList,
  Trophy,
  CalendarCheck,
  Sparkles,
  ArrowRight,
  TrendingUp,
  MessageSquare,
  Gift,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  CheckCircle2,
  Share2,
  Copy,
  ChevronRight,
  ChevronLeft,
  Flame,
  Star,
  Users,
  Eye,
  Coins,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Tv,
  Check,
  Building2,
  Clock,
  ExternalLink,
  Code2,
  Database,
  Wrench,
  Server,
  Zap,
  Activity,
  Award,
  BookOpen,
  Send
} from 'lucide-react';
import { AgentItem, ModelItem, DatasetItem, SkillPluginItem, RentalGPUCard } from '../../types';

interface HomeView02Props {
  onSwitchToVersion01?: () => void;
}

export const HomeView02: React.FC<HomeView02Props> = ({ onSwitchToVersion01 }) => {
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

  // Hero 区真实平台统计数据（精准对齐平台实际数据）
  const heroStats = useMemo(() => {
    // 标签1：模型数量（平台实际接入数量，31款）
    const modelCount = models?.length || 31;
    // 标签2：上架Agent数量（平台实际上架Agent数量，86款）
    const agentCount = agents?.filter(a => a.status !== '已下架').length || agents?.length || 86;
    // 标签3：平台实际GPU总卡数（全网纳管 1,200 卡）
    const gpuCards = '1,200';
    // 标签4：在招任务数（平台实际进行中/已发布任务数，17个）
    const activeTasks = tasks?.filter(t => t.status === '进行中' || t.status === '已发布').length || 17;

    return {
      modelCount,
      agentCount,
      gpuCards,
      activeTasks
    };
  }, [models, agents, tasks]);

  // 1. 轮播 Banner 状态 (5秒自动切换 + 平滑进度条)
  const [bannerIndex, setBannerIndex] = useState(0);
  const [isBannerPaused, setIsBannerPaused] = useState(false);
  const [bannerProgress, setBannerProgress] = useState(0);

  // 2. 每日签到弹窗
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [continuousDays, setContinuousDays] = useState(user.continuousCheckInDays || 3);

  // 3. 邀请返利弹窗
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  // 4. 视频教程大弹窗
  const [activeVideoModal, setActiveVideoModal] = useState<{
    isOpen: boolean;
    title: string;
    duration: string;
    agentName: string;
    agentId?: string;
    description?: string;
  } | null>(null);

  // 模拟视频播放状态
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(25);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // 5. 新用户横幅关闭状态
  const [isNewUserBannerDismissed, setIsNewUserBannerDismissed] = useState(false);

  // 轮播 Banner 列表 (5条，5秒自动切换，亮色明亮通透设计)
  const banners = useMemo(() => [
    {
      id: 1,
      badge: '限时特惠 · 8折',
      title: 'DeepSeek-V3 深度求索模型 8 折，本周内有效',
      subtitle: '超强 671B MoE 架构，通用推理与代码生成领先，API 每百万 Token 仅 ¥9.0',
      buttonText: '立即查看模型',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-blue-100 text-blue-700 border-blue-200',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
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
      badge: '算力秒杀 · ¥1.2/时',
      title: 'RTX 4090 算力限时抢购 ¥1.2 / 小时',
      subtitle: '支持一键拉起 PyTorch / vLLM / ComfyUI 官方镜像，秒级调度，即开即用零等待',
      buttonText: '启动算力工坊',
      bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      btnColor: 'bg-emerald-600 hover:bg-emerald-700',
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
      badge: '新用户礼遇 · 注册即送',
      title: '注册即送 20 元体验金，无门槛畅享百款模型',
      subtitle: '可全额抵扣大模型 API 调用、Agent 智能体订阅与 GPU 算力租赁计费',
      buttonText: '查看体验金说明',
      bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-purple-100 text-purple-700 border-purple-200',
      btnColor: 'bg-purple-600 hover:bg-purple-700',
      action: () => {
        showToast('20元新用户体验金已发放至钱包账户，可抵扣任意模型与算力订单！');
      }
    },
    {
      id: 4,
      badge: '重磅赛事 · ¥50,000 奖金',
      title: '2026 AI 数据科学挑战赛火热报名中',
      subtitle: '面向产业和高校算法开发者，提供专属免费算力配额与企业直接签约通道',
      buttonText: '立即报名参赛',
      bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-amber-100 text-amber-800 border-amber-200',
      btnColor: 'bg-amber-600 hover:bg-amber-700',
      action: () => {
        setActiveTab('creative');
      }
    },
    {
      id: 5,
      badge: '高赏金任务 · 揭榜挂帅',
      title: '金融模型优化需求揭榜挂帅，赏金 ¥2,000',
      subtitle: '华泰数科创新实验室发布，真实金融研报实体抽取与合规对齐，协同开发',
      buttonText: '查看揭榜任务',
      bgImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&auto=format&fit=crop&q=80',
      tagColor: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      btnColor: 'bg-indigo-600 hover:bg-indigo-700',
      action: () => {
        setActiveTab('tasks');
      }
    }
  ], [models, openModelDetail, setActiveTab, setCreateComputeModalOpen, setCreateComputePreset, setMarketplaceTab, showToast, availableRentalCards]);

  // 轮播定时器（5秒自动切换 + 平滑进度条）
  useEffect(() => {
    if (isBannerPaused) return;
    const intervalTime = 50; // 50ms 更新一次
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

  // 手动切换 banner
  const handleSelectBanner = (index: number) => {
    setBannerIndex(index);
    setBannerProgress(0);
  };

  // 快捷入口 6 个图标卡片配置（极浅低饱和彩系渐变 + Phosphor Duotone 双调图标 + 优雅克制）
  const quickActions = [
    {
      name: '使用Agent',
      desc: '86 款即用智能体',
      bgGradient: 'linear-gradient(135deg, #FAF5FF 0%, #F3E8FF 100%)',
      iconColor: '#7C3AED',
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
      IconComponent: BrainIcon,
      action: () => {
        setMarketplaceTab('model');
        setActiveTab('marketplace');
      }
    },
    {
      name: '启动算力',
      desc: 'RTX 4090 / A100 秒拉起',
      bgGradient: 'linear-gradient(135deg, #ECFEFF 0%, #CFFAFE 100%)',
      iconColor: '#0891B2',
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
      IconComponent: TrophyIcon,
      action: () => {
        setActiveTab('creative');
      }
    },
    {
      name: hasCheckedInToday ? `已签到 ${continuousDays} 天` : '签到领积分',
      desc: hasCheckedInToday ? '今日签到奖励已入账' : '领积分抵扣调用额度',
      bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
      iconColor: '#059669',
      IconComponent: CalendarIcon,
      action: () => {
        setIsCheckInModalOpen(true);
      }
    }
  ];

  // 特价模型专区真实模型数据（换用最新最前沿指定4大模型，原价划线 + 现价区分输入输出 + 高亮折扣标签）
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

  // 场景化“我猜你想...”卡片配置（彩色生动高清水印图 + 浅色明亮卡片）
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

  // 10. 热门任务（横向 4 个任务卡片，展示高赏金任务）
  const hotTaskList = [
    {
      id: 'task-1',
      title: '金融模型优化需求',
      category: '大模型微调',
      reward: '¥2,000',
      remainingDays: '5天',
      publisher: '华泰数科创新实验室',
      bids: 18,
      verified: true
    },
    {
      id: 'task-2',
      title: '智能客服Agent开发',
      category: 'Agent开发',
      reward: '¥1,500',
      remainingDays: '3天',
      publisher: '南京智慧文旅集团',
      bids: 12,
      verified: true
    },
    {
      id: 'task-3',
      title: '电商评论情感分析',
      category: '数据挖掘',
      reward: '¥800',
      remainingDays: '7天',
      publisher: '苏宁零售技术院',
      bids: 32,
      verified: true
    },
    {
      id: 'task-4',
      title: '医疗CT影像病灶分割',
      category: '计算机视觉',
      reward: '¥6,000',
      remainingDays: '20天',
      publisher: '协和医科创新联合体',
      bids: 9,
      verified: true
    }
  ];

  // 11. 热门赛事（与赛事中心字段和实际赛道严格一致）
  const hotCompetitionList = [
    {
      id: 'comp-01',
      trackId: 'track-01-1',
      title: '2026 AI创新巅峰赛 - AI数据科学赛',
      type: 'AI数据科学赛',
      status: '进行中',
      prize: '¥50,000',
      participants: '428 人已参赛',
      cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'comp-01',
      trackId: 'track-01-2',
      title: '2026 AI创新巅峰赛 - AI安全挑战赛',
      type: 'AI安全挑战赛',
      status: '进行中',
      prize: '¥50,000',
      participants: '310 人已参赛',
      cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'comp-01',
      trackId: 'track-01-3',
      title: '2026 AI创新巅峰赛 - AIGC生成赛',
      type: 'AIGC生成赛',
      status: '进行中',
      prize: '¥50,000',
      participants: '560 人已参赛',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  // 12. 社区热帖数据（按方案1：精选热帖大卡片 + 热帖榜列表）
  const featuredCommunityPost = {
    id: 'post-llm-finetune',
    title: 'LLM 微调踩坑记录',
    summary: '分享我在微调 LLM 时遇到的坑，包括数据清洗、学习率设置、显存优化等。涵盖从 LLaMA 到 DeepSeek 系列的全流程调优经验与实测避坑总结。',
    author: '张三',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    section: '干货分享',
    sectionBadge: 'bg-blue-50 text-blue-700 border-blue-200',
    comments: 12,
    likes: 45,
    cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  };

  const hotPostRanking = [
    {
      id: 'post-llm-finetune',
      rank: 1,
      title: 'LLM 微调踩坑记录',
      section: '干货分享',
      author: '张三',
      comments: 12,
      likes: 45
    },
    {
      id: 'post-rag-framework',
      rank: 2,
      title: '有没有好用的 RAG 框架推荐？',
      section: '求助答疑',
      author: '李四',
      comments: 8,
      likes: 32
    },
    {
      id: 'post-ai-paint-workflow',
      rank: 3,
      title: 'AI 绘画工作流分享',
      section: '前沿观察',
      author: '王五',
      comments: 15,
      likes: 28
    },
    {
      id: 'post-nlp-team',
      rank: 4,
      title: 'NLP 任务组队',
      section: '同行交流',
      author: '赵六',
      comments: 6,
      likes: 18
    },
    {
      id: 'post-data-annotation',
      rank: 5,
      title: '分享一个数据标注工具',
      section: '干货分享',
      author: '孙七',
      comments: 9,
      likes: 15
    }
  ];

  // 13. 合作伙伴
  const partnerLogos = [
    { name: '中国电信', tag: '天翼云算力专线直连' },
    { name: '中国移动', tag: '九天大模型产业生态' },
    { name: '中国联通', tag: '云网融合智能算网' },
    { name: '华为云', tag: '昇腾 AI 算力集群底座' },
    { name: '南京智算中心', tag: '国家级公共算力节点' }
  ];

  // 执行签到
  const handleCheckIn = () => {
    if (hasCheckedInToday) {
      showToast('今日已经签过到啦，明天继续保持哦！');
      return;
    }
    checkInToday();
    setContinuousDays(prev => prev + 1);
    showToast('签到成功！获得 +5 积分奖励 🎉');
  };

  return (
    <div className="w-full space-y-6 antialiased text-slate-800 pb-20 select-none relative">
      
      {/* 科技感浅色背景纹理与柔和微光晕（精准对齐设计图明亮纯净质感） */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#F5F7FD]" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#dce3f5_1px,transparent_1px)] [background-size:24px_24px] opacity-75" />
      <div className="absolute top-0 right-1/4 w-[600px] h-[500px] bg-indigo-200/20 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/5 w-[500px] h-[500px] bg-violet-200/15 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ========================================================
          1. Hero 区 (动态流动“绚烂白”母贝极光质感 · 纯白主基调 + 5色流光漂移呼吸)
         ======================================================== */}
      <div className="relative rounded-3xl bg-white border border-slate-200/80 py-5 px-6 sm:py-6 sm:px-10 shadow-[0_10px_36px_-10px_rgba(161,196,253,0.18),0_2px_10px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* 背景 5 个独立彩色光斑层（白色基底 + 5 个 500x500 独立动画光斑 div） */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
"          {/* 1. 纯白基底 */}
          <div className="absolute inset-0 bg-white" />

          {/* 2. 光斑 1：淡紫 (#E0C3FC) */}
          <div
            className="hero-glow-spot-1"
            style={{
              position: 'absolute',
              top: '-100px',
              left: '-80px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #E0C3FC 0%, transparent 70%)',
              filter: 'blur(80px)',
              opacity: 0.55,
              animation: 'glowFloatSpot1 22s ease-in-out infinite alternate',
              willChange: 'transform'
            }}
          />

          {/* 3. 光斑 2：淡蓝 (#A1C4FD) */}
          <div
            className="hero-glow-spot-2"
            style={{
              position: 'absolute',
              top: '-100px',
              right: '-80px',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #A1C4FD 0%, transparent 70%)',
              filter: 'blur(80px)',
              opacity: 0.55,
              animation: 'glowFloatSpot2 27s ease-in-out infinite alternate -4s',
              willChange: 'transform'
            }}
          />

          {/* 4. 光斑 3：淡粉 (#FBC2EB) */}
          <div
            className="hero-glow-spot-3"
            style={{
              position: 'absolute',
              bottom: '-120px',
              left: '5%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FBC2EB 0%, transparent 70%)',
              filter: 'blur(80px)',
              opacity: 0.55,
              animation: 'glowFloatSpot3 21s ease-in-out infinite alternate -9s',
              willChange: 'transform'
            }}
          />

          {/* 5. 光斑 4：淡青 (#A1E3F9) */}
          <div
            className="hero-glow-spot-4"
            style={{
              position: 'absolute',
              top: '-60px',
              left: '30%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #A1E3F9 0%, transparent 70%)',
              filter: 'blur(80px)',
              opacity: 0.55,
              animation: 'glowFloatSpot4 25s ease-in-out infinite alternate -2s',
              willChange: 'transform'
            }}
          />

          {/* 6. 光斑 5：淡黄 (#FDEB71) */}
          <div
            className="hero-glow-spot-5"
            style={{
              position: 'absolute',
              bottom: '-120px',
              right: '5%',
              width: '500px',
              height: '500px',
              borderRadius: '50%',
              background: 'radial-gradient(circle, #FDEB71 0%, transparent 70%)',
              filter: 'blur(80px)',
              opacity: 0.55,
              animation: 'glowFloatSpot5 29s ease-in-out infinite alternate -7s',
              willChange: 'transform'
            }}
          />

          {/* 7. 轻薄纯白透光平滑覆盖层 */}
          <div className="absolute inset-0 bg-white/10 pointer-events-none" />
        </div>"

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-1 sm:pt-2">
          {/* 艺术感主标题（微调尺寸，兼顾视觉冲击力与紧凑度） */}
          <h1 className="text-2xl sm:text-4xl lg:text-[40px] font-black text-slate-900 tracking-tight leading-[1.2]">
            汇聚 AI 之力，成就
            <span className="relative inline-block ml-1.5 sm:ml-2">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 drop-shadow-xs">
                万千可能
              </span>
              {/* 现代微光弧线 */}
              <svg className="absolute -bottom-2 left-0 w-full h-3 text-indigo-400/50" viewBox="0 0 180 12" fill="none">
                <path d="M2.5 9C45 2.5 135 2.5 177.5 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* 副标题 */}
          <p className="text-base sm:text-lg text-slate-700 font-bold mt-2 tracking-tight">
            从模型到 Agent，一站式搞定
          </p>
          {/* 实时交付方案数据胶囊 */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/95 border border-indigo-200/80 shadow-2xs backdrop-blur-md text-xs font-semibold text-indigo-900 mt-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>今日已有</span>
            <strong className="font-mono font-black text-sm text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">1,283</strong>
            <span>人在此找到AI方案</span>
          </div>

          {/* 平台四大核心功能卡片（紧凑微质感 · 真实平台数据驱动） */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mt-4.5 pt-4 border-t border-slate-200/70">
            {/* 标签1：模型广场 */}
            <div
              onClick={() => {
                setMarketplaceTab('model');
                setActiveTab('marketplace');
              }}
              className="py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white border border-slate-200/80 hover:border-indigo-300 flex items-center gap-2.5 text-left shadow-2xs hover:shadow-md hover:shadow-indigo-500/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Brain className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1 leading-none">
                  <span>模型广场</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xs font-black text-slate-800 truncate font-mono mt-1">{heroStats.modelCount}款主流大模型</div>
                <div className="text-[10px] text-slate-400 truncate">文本·图像·音频全模态</div>
              </div>
            </div>

            {/* 标签2：场景智能体 */}
            <div
              onClick={() => {
                setMarketplaceTab('agent');
                setActiveTab('marketplace');
              }}
              className="py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white border border-slate-200/80 hover:border-violet-300 flex items-center gap-2.5 text-left shadow-2xs hover:shadow-md hover:shadow-violet-500/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-600 border border-violet-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-violet-600 font-semibold flex items-center gap-1 leading-none">
                  <span>场景智能体</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <div className="text-xs font-black text-slate-800 truncate font-mono mt-1">{heroStats.agentCount}款即用Agent</div>
                <div className="text-[10px] text-slate-400 truncate">开箱即用·覆盖垂直行业</div>
              </div>
            </div>

            {/* 标签3：纳管算力池 */}
            <div
              onClick={() => setActiveTab('compute')}
              className="py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white border border-slate-200/80 hover:border-sky-300 flex items-center gap-2.5 text-left shadow-2xs hover:shadow-md hover:shadow-sky-500/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-sky-50 text-sky-600 border border-sky-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-sky-600 font-semibold flex items-center gap-1 leading-none">
                  <span>纳管算力池</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xs font-black text-slate-800 truncate font-mono mt-1">{heroStats.gpuCards}卡GPU算力</div>
                <div className="text-[10px] text-slate-400 truncate">RTX4090·A100·秒级拉起</div>
              </div>
            </div>

            {/* 标签4：任务赏金池 */}
            <div
              onClick={() => setActiveTab('tasks')}
              className="py-2.5 px-3 rounded-xl bg-white/95 hover:bg-white border border-slate-200/80 hover:border-amber-300 flex items-center gap-2.5 text-left shadow-2xs hover:shadow-md hover:shadow-amber-500/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <ClipboardList className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-amber-600 font-semibold flex items-center gap-1 leading-none">
                  <span>任务赏金池</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                </div>
                <div className="text-xs font-black text-slate-800 truncate font-mono mt-1">{heroStats.activeTasks}个在招任务</div>
                <div className="text-[10px] text-slate-400 truncate">发布需求·高效交付</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 新用户提示横幅 (明亮彩度卡片 · 仅未登录/新用户可见)
         ======================================================== */}
      {!isNewUserBannerDismissed && (
        <div className="rounded-2xl bg-gradient-to-r from-indigo-50 via-sky-50 to-purple-50 border border-indigo-200/80 p-3.5 sm:px-5 flex items-center justify-between gap-3 shadow-2xs relative overflow-hidden">
          <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 truncate relative z-10">
            <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center text-sm shadow-xs shrink-0">
              🎁
            </span>
            <span className="truncate">
              新用户注册即享 <strong className="text-indigo-600 font-bold font-mono">¥20</strong> 体验金，可全额抵扣模型 API 调用与算力租赁计费
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0 relative z-10">
            <button
              onClick={() => {
                showToast('20元体验金已激活！您可在调用模型或创建算力实例时直接抵扣。');
                setIsNewUserBannerDismissed(true);
              }}
              className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1"
            >
              <span>立即激活</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsNewUserBannerDismissed(true)}
              className="p-1 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              title="关闭提示"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          3. 快捷入口 (6个极淡低饱和彩系卡片 · Phosphor Duotone 38px双调图标 · 1px #E5E7EB 边框 · hover #2563EB 边框)
         ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-4.5 lg:gap-5">
        {quickActions.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="relative h-[124px] rounded-[16px] p-4 flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-md cursor-pointer group select-none border border-[#E5E7EB] hover:border-[#2563EB] shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden"
            style={{
              background: item.bgGradient
            }}
          >
            {/* 顶栏：Phosphor Duotone 双调图标 */}
            <div className="flex items-center justify-between">
              <item.IconComponent
                size={38}
                weight="duotone"
                color={item.iconColor}
                className="shrink-0 transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* 底栏：深灰主标题 #111827 与 中灰副标题 #6B7280 */}
            <div className="min-w-0">
              <div className="font-bold text-sm text-[#111827] truncate">
                {item.name}
              </div>
              <div className="text-xs text-[#6B7280] font-normal truncate mt-0.5">
                {item.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ========================================================
          4. 邀请返利小横幅 (浅色明快香槟金 · 优雅圆角横幅)
         ======================================================== */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-50/90 via-orange-50/60 to-white border border-amber-200/80 p-3.5 sm:px-5 flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs sm:text-sm font-semibold text-slate-800">
          <span className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-400/30 text-amber-600 flex items-center justify-center text-sm shadow-2xs shrink-0">
            🤝
          </span>
          <span>
            邀请开发者好友注册平台，双方账户各立得 <strong className="text-amber-600 font-bold font-mono">¥20</strong> 账户余额奖励
          </span>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0 flex items-center gap-1"
        >
          <span>立即邀请</span>
          <Share2 className="w-3 h-3" />
        </button>
      </div>

      {/* ========================================================
          5. 轮播 Banner (5秒自动切换 · 亮色明快通透底 + 彩色高清水印大图)
         ======================================================== */}
      <div
        onMouseEnter={() => setIsBannerPaused(true)}
        onMouseLeave={() => setIsBannerPaused(false)}
        className="relative rounded-2xl overflow-hidden h-[190px] sm:h-[210px] border border-slate-200/90 shadow-sm select-none bg-white group"
      >
        {banners.map((item, idx) => (
          <div
            key={item.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              idx === bannerIndex ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
            }`}
          >
            {/* 右侧生动清晰的彩色大图 */}
            <div className="absolute right-0 top-0 bottom-0 w-3/5 overflow-hidden">
              <img
                src={item.bgImage}
                alt={item.title}
                className="w-full h-full object-cover object-center opacity-90 scale-100 group-hover:scale-105 transition-transform duration-1000"
              />
              {/* 从左往右纯白渐变遮罩，绝不发黑，让文字清晰自然 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
            </div>

            {/* 左侧文字与内容：文字深色高对比 */}
            <div className="relative z-10 h-full p-6 sm:p-8 flex flex-col justify-between max-w-xl">
              <div>
                <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${item.tagColor} mb-2 shadow-2xs`}>
                  {item.badge}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium mt-1.5 line-clamp-2">
                  {item.subtitle}
                </p>
              </div>

              <div className="flex items-center justify-between mt-2">
                <button
                  onClick={item.action}
                  className={`px-4 py-2 rounded-xl ${item.btnColor} text-white font-bold text-xs shadow-sm transition cursor-pointer flex items-center gap-1.5`}
                >
                  <span>{item.buttonText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* 顶部微型自动播放进度条 */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-slate-100 z-20 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-600 to-violet-600 transition-all duration-75"
            style={{ width: `${bannerProgress}%` }}
          />
        </div>

        {/* 亮色轮播指示器与切换小控制台 */}
        <div className="absolute bottom-4 right-6 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-200/90 shadow-sm text-slate-700 text-xs">
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

        {/* 上一张 / 下一张控制按钮 */}
        <button
          onClick={() => handleSelectBanner((bannerIndex - 1 + banners.length) % banners.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition cursor-pointer border border-slate-200 opacity-0 group-hover:opacity-100"
          title="上一张"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => handleSelectBanner((bannerIndex + 1) % banners.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md transition cursor-pointer border border-slate-200 opacity-0 group-hover:opacity-100"
          title="下一张"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
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
          9. 热门任务 (独立一栏 · 横向4个任务卡片 · 展示高赏金需求)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 hover:border-indigo-200/90 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200/60">
              <ClipboardList className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">
                热门任务
              </h2>
              <span className="text-xs text-slate-500">
                高额赏金揭榜需求 · 企业协同攻关与技术交付
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>任务大厅</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {hotTaskList.map(task => (
            <div
              key={task.id}
              onClick={() => {
                if (setSelectedTaskIdForDetail) setSelectedTaskIdForDetail(task.id);
                setActiveTab('tasks');
              }}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-400 bg-white hover:bg-emerald-50/20 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-sm group hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                    {task.category}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-slate-400" />
                    剩余 {task.remainingDays}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-slate-900 group-hover:text-emerald-600 transition line-clamp-1">
                  {task.title}
                </h3>

                <p className="text-[11px] text-slate-500 mt-1 truncate">
                  发布方: {task.publisher}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block">赏金总额</span>
                  <span className="text-base font-black font-mono text-emerald-600 leading-none">
                    {task.reward}
                  </span>
                </div>

                <span className="text-xs text-emerald-600 font-bold group-hover:underline flex items-center gap-0.5">
                  任务详情 <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          10. 热门赛事 (独立一栏 · 与赛事中心字段严格一致)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 hover:border-indigo-200/90 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-50 text-rose-600 border border-rose-200/60">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-black text-slate-900">
                热门赛事
              </h2>
              <span className="text-xs text-slate-500">
                挑战顶尖算法 · 争夺官方荣誉勋章与高额现金激励
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('creative')}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>赛事中心</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3.5">
          {hotCompetitionList.map(comp => (
            <div
              key={comp.title}
              onClick={() => {
                if (openCompetitionDetail) openCompetitionDetail(comp.id);
                setActiveTab('creative');
              }}
              className="rounded-xl border border-slate-200/80 hover:border-rose-400 bg-white overflow-hidden transition-all duration-200 group cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div className="h-32 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={comp.cover}
                  alt={comp.title}
                  className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-all duration-500"
                />
                <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[10px] font-bold border ${comp.statusBadge} bg-white/95 backdrop-blur-xs shadow-2xs`}>
                  {comp.status}
                </span>
                <div className="absolute bottom-2.5 left-3 text-white font-bold text-sm truncate max-w-[85%] drop-shadow-md">
                  {comp.title}
                </div>
              </div>

              <div className="p-3.5 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500 font-medium">{comp.type}</span>
                  <span className="font-mono font-black text-rose-600 text-sm">{comp.prize}</span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{comp.participants}</span>
                  <span className="text-xs font-bold text-rose-600 group-hover:underline flex items-center gap-0.5">
                    赛事详情 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          11. 社区热帖 (方案1：左侧精选热帖大卡片 60% + 右侧热帖榜 40%)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 hover:border-indigo-200/90 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-lg leading-none">📝</span>
            <div>
              <h2 className="text-base font-black text-slate-900">
                社区热帖
              </h2>
              <span className="text-xs text-slate-500">
                开发者避坑经验、技术干货与组队前沿讨论
              </span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer group"
          >
            <span>进入社区</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
          </button>
        </div>

        {/* 左右两栏布局：间距 20px (gap-5)，紧凑对齐其他栏目高度 */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mt-3.5 items-stretch">
          {/* 左侧：精选热帖大卡片 (占约 60% 宽度，lg:col-span-7 · 左右横向精简排版，高度同频) */}
          <div
            onClick={() => {
              if (openPostDetailWithOrigin) {
                openPostDetailWithOrigin('pst_gh_01', 'home');
              }
              setActiveTab('community');
            }}
            className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 p-4 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md group flex flex-col sm:flex-row gap-4 items-stretch justify-between"
          >
            {/* 左侧：精选封面图，16:10 / 16:9，圆角12px */}
            <div className="w-full sm:w-52 md:w-56 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-auto min-h-[148px] rounded-xl overflow-hidden bg-slate-100 relative shadow-inner">
              <img
                src={featuredCommunityPost.cover}
                alt={featuredCommunityPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 backdrop-blur-xs text-indigo-700 border border-indigo-200/80 shadow-2xs">
                {featuredCommunityPost.section}
              </span>
            </div>

            {/* 右侧：标题、摘要、作者及数据 */}
            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-bold mb-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>精选推荐</span>
                </div>
                {/* 帖子标题（加粗，16-18px） */}
                <h3 className="font-bold text-base sm:text-lg text-[#111827] group-hover:text-indigo-600 transition leading-snug line-clamp-2">
                  {featuredCommunityPost.title}
                </h3>
                {/* 一句话摘要（灰色，13px，最多两行，超出省略） */}
                <p className="text-xs sm:text-[13px] text-[#6B7280] line-clamp-2 mt-1.5 leading-relaxed font-normal">
                  {featuredCommunityPost.summary}
                </p>
              </div>

              {/* 底部：元信息行 */}
              <div className="pt-2.5 mt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                {/* 作者头像 + 昵称 */}
                <div className="flex items-center gap-1.5">
                  <img
                    src={featuredCommunityPost.avatar}
                    alt={featuredCommunityPost.author}
                    className="w-5 h-5 rounded-full object-cover border border-indigo-200"
                  />
                  <span className="font-semibold text-slate-800 text-xs">{featuredCommunityPost.author}</span>
                </div>

                {/* 评论数与点赞数 */}
                <div className="flex items-center gap-2.5 font-mono text-xs text-slate-400">
                  <span className="flex items-center gap-0.5 hover:text-indigo-600">
                    💬 {featuredCommunityPost.comments}
                  </span>
                  <span className="flex items-center gap-0.5 hover:text-amber-600">
                    ⭐ {featuredCommunityPost.likes}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：热帖榜列表 (占约 40% 宽度，lg:col-span-5 · 紧凑舒适排版) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-4 flex flex-col justify-between shadow-2xs">
            {/* 顶部标题：🔥 热帖榜 + 实时热度标签 */}
            <div className="flex items-center justify-between pb-2.5 mb-1 border-b border-slate-100">
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">🔥</span>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  热帖榜
                </h3>
              </div>
              <span className="text-[10px] text-indigo-600 bg-indigo-50/80 border border-indigo-100/80 px-2 py-0.5 rounded-full font-semibold font-mono">
                TOP 5 · 实时热度
              </span>
            </div>

            {/* 列表展示 5 条热帖 */}
            <div className="divide-y divide-slate-100/80 flex-1 flex flex-col justify-around">
              {hotPostRanking.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (openPostDetailWithOrigin) {
                      openPostDetailWithOrigin('pst_gh_01', 'home');
                    }
                    setActiveTab('community');
                  }}
                  className="py-1.5 px-2 rounded-xl flex items-center justify-between gap-2.5 group cursor-pointer hover:bg-indigo-50/50 transition"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    {/* 排名数字（1-5，用橙色/品牌色区分） */}
                    <span
                      className={`w-4.5 h-4.5 rounded text-[10px] font-black flex items-center justify-center shrink-0 ${
                        item.rank === 1
                          ? 'bg-amber-500 text-white shadow-2xs'
                          : item.rank === 2
                          ? 'bg-indigo-600 text-white shadow-2xs'
                          : item.rank === 3
                          ? 'bg-violet-500 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {item.rank}
                    </span>

                    {/* 帖子标题 + 板块 + 作者 */}
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[#111827] group-hover:text-indigo-600 transition truncate max-w-[170px] sm:max-w-[230px]">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        <span className="text-indigo-600 font-medium">{item.section}</span>
                        <span>·</span>
                        <span className="truncate max-w-[70px]">{item.author}</span>
                      </div>
                    </div>
                  </div>

                  {/* 评论数 + 点赞数 (靠右显示) */}
                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] text-slate-400">
                    <span>💬 {item.comments}</span>
                    <span>⭐ {item.likes}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          12. 平台数据 + 合作伙伴 (数据 + Logo墙)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-[0_2px_14px_rgba(15,23,42,0.03)] text-center space-y-4">
        {/* 实时平台数据证明 */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-600" />
            <span><strong className="font-mono text-indigo-700 font-bold">12,580</strong> 注册用户</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-violet-600" />
            <span><strong className="font-mono text-violet-700 font-bold">{heroStats.agentCount}</strong> 款即用Agent</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            <span><strong className="font-mono text-emerald-700 font-bold">1,234</strong> 任务完成</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-sky-600" />
            <span><strong className="font-mono text-sky-700 font-bold">78.5%</strong> GPU利用率</span>
          </div>
        </div>

        {/* 合作伙伴 Logo 墙 (清爽明亮浅灰色) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {partnerLogos.map(p => (
            <div
              key={p.name}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-50/80 border border-slate-200/70 text-slate-600 hover:text-indigo-900 hover:border-indigo-300 hover:bg-white transition"
              title={p.tag}
            >
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-xs font-bold">{p.name}</span>
              <span className="text-[10px] text-slate-400 font-mono hidden sm:inline">[{p.tag}]</span>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          13. 底部导航链接
         ======================================================== */}
      <div className="pt-4 border-t border-slate-200 text-center text-xs text-slate-500 space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-slate-600 font-medium">
          <button onClick={() => showToast('关于我们：赛宁·千机 AI 场景驱动与普惠算力平台')} className="hover:text-blue-600 transition cursor-pointer">关于我们</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => showToast('用户服务协议已生效，保障开发者与企业数据资产权益')} className="hover:text-blue-600 transition cursor-pointer">用户协议</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => showToast('全流程遵循数据安全与脱敏审计规范')} className="hover:text-blue-600 transition cursor-pointer">隐私政策</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => showToast('在线工单系统全天候技术专员响应')} className="hover:text-blue-600 transition cursor-pointer">帮助中心</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => showToast('商务合作邮箱：service@qianji-ai.com')} className="hover:text-blue-600 transition cursor-pointer">联系我们</button>
        </div>
        <p className="text-[11px] text-slate-400">
          © 2026 赛宁·千机 AI 综合应用门户 · 苏ICP备20260812号-1 · 南京市人工智能生态示范工程
        </p>
      </div>

      {/* ========================================================
          浮动版本切换按钮 (保留，不明显，方便用户在 0.1 与 0.2 之间随心切换)
         ======================================================== */}
      {onSwitchToVersion01 && (
        <div className="fixed bottom-4 right-4 z-40">
          <button
            onClick={onSwitchToVersion01}
            className="px-3.5 py-1.5 rounded-full bg-slate-900/85 hover:bg-slate-900 text-slate-200 hover:text-white border border-slate-700 shadow-xl backdrop-blur-md text-[11px] font-mono flex items-center gap-2 transition cursor-pointer"
            title="点击切换到原版首页 (0.1)"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>首页 0.2 新版 · 点击切换 0.1 原版</span>
          </button>
        </div>
      )}

      {/* ========================================================
          弹窗组件 1: 每日签到弹窗
         ======================================================== */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white relative">
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl">📅</span>
                <h3 className="text-lg font-black tracking-tight">每日签到领积分</h3>
              </div>
              <p className="text-xs text-white/90 mt-1">
                连续签到可获大额宝箱，积分可直接抵扣模型推理与算力租赁！
              </p>

              <div className="mt-4 p-3 rounded-2xl bg-black/20 backdrop-blur-sm flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-white/80">当前可用积分</span>
                  <div className="text-2xl font-black font-mono leading-none mt-0.5">
                    {user.points} <span className="text-xs font-normal">pts</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-white/80">已连续签到</span>
                  <div className="text-2xl font-black font-mono text-amber-200 leading-none mt-0.5">
                    {continuousDays} <span className="text-xs font-normal">天</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-4">
              {/* 7 天连续签到阶梯 */}
              <div className="grid grid-cols-7 gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7].map(day => {
                  const isPast = day < continuousDays || (day === continuousDays && hasCheckedInToday);
                  const isCurrent = day === continuousDays && !hasCheckedInToday;
                  return (
                    <div
                      key={day}
                      className={`p-2 rounded-xl text-center border flex flex-col items-center justify-between h-16 ${
                        isPast
                          ? 'bg-amber-50 border-amber-200 text-amber-800'
                          : isCurrent
                          ? 'bg-orange-500 text-white border-orange-500 shadow-sm ring-2 ring-orange-300'
                          : 'bg-slate-50 border-slate-200 text-slate-500'
                      }`}
                    >
                      <span className="text-[10px] font-mono">第{day}天</span>
                      <span className="text-xs font-black font-mono">
                        {isPast ? <Check className="w-3.5 h-3.5 text-amber-600" /> : `+${day * 2 + 3}`}
                      </span>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleCheckIn}
                disabled={hasCheckedInToday}
                className={`w-full py-3 rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer ${
                  hasCheckedInToday
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                    : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                }`}
              >
                {hasCheckedInToday ? (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>今日已签到</span>
                  </>
                ) : (
                  <>
                    <Gift className="w-4 h-4" />
                    <span>立即签到领 +5 积分</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          弹窗组件 2: 邀请返利弹窗
         ======================================================== */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-6 text-white relative">
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-2">
                <span className="text-2xl">🎁</span>
                <h3 className="text-lg font-black tracking-tight">邀请好友 · 各领 ¥20</h3>
              </div>
              <p className="text-xs text-white/90 mt-1">
                好友通过您的专属链接注册，双方均可自动获得 20 元无门槛抵扣余额！
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <span className="text-xs text-slate-500 font-medium">您的专属邀请码</span>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-black font-mono text-orange-600 tracking-wider">
                    QIANJI-VIP-{user.id?.slice(-4).toUpperCase() || '8888'}
                  </span>
                  <button
                    onClick={() => {
                      setInviteCopied(true);
                      showToast('邀请码与推广链接已复制到剪贴板！');
                      setTimeout(() => setInviteCopied(false), 2000);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                  >
                    {inviteCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{inviteCopied ? '已复制' : '复制链接'}</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400">已成功邀请</span>
                  <div className="text-lg font-black font-mono text-slate-800 mt-0.5">3 位开发者</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[11px] text-slate-400">累计返利奖励</span>
                  <div className="text-lg font-black font-mono text-emerald-600 mt-0.5">¥60.00</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          弹窗组件 3: 沉浸视频实战教程播放器 (亮色明亮框架)
         ======================================================== */}
      {activeVideoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            {/* 顶栏 */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-bold text-sm text-slate-900">
                  {activeVideoModal.title}
                </h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 font-mono font-medium">
                  {activeVideoModal.duration}
                </span>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-600 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 现代科技感视频播放画布 */}
            <div className="relative aspect-video bg-slate-900 flex flex-col justify-between p-6 overflow-hidden text-white">
              {/* 背景仿真演示画面 */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-900 to-sky-950 pointer-events-none" />
              <div className="absolute inset-0 bg-[radial-gradient(#475569_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

              {/* 视频中心动态演示界面模拟 */}
              <div className="relative z-10 my-auto flex flex-col items-center text-center max-w-md mx-auto">
                <div className="w-16 h-16 rounded-2xl bg-indigo-500/20 border border-indigo-400/40 backdrop-blur-md flex items-center justify-center text-indigo-300 mb-3 shadow-lg shadow-indigo-500/20">
                  <Play className={`w-8 h-8 fill-indigo-400 ${isVideoPlaying ? 'animate-pulse' : ''}`} />
                </div>
                <h4 className="font-black text-lg text-white">
                  【{activeVideoModal.agentName}】应用部署流程
                </h4>
                <p className="text-xs text-slate-300 mt-1 max-w-sm">
                  {activeVideoModal.description || '当前正在演示从配置提示词到 API 接口打通的端到端最佳实践'}
                </p>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-emerald-400 border border-slate-700">
                    4K Ultra HD
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-blue-400 border border-slate-700">
                    60 FPS 极速串流
                  </span>
                </div>
              </div>

              {/* 播放器底栏控制条 */}
              <div className="relative z-10 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl border border-slate-700/80 space-y-2 mt-auto">
                {/* 进度条 */}
                <div
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const clickX = e.clientX - rect.left;
                    setVideoProgress((clickX / rect.width) * 100);
                  }}
                  className="w-full h-1.5 bg-slate-800 rounded-full cursor-pointer overflow-hidden group"
                >
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full transition-all"
                    style={{ width: `${videoProgress}%` }}
                  />
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="p-1 text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                    </button>
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 text-slate-300 hover:text-white transition cursor-pointer"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="font-mono text-[11px] text-slate-400">
                      01:14 / {activeVideoModal.duration}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* 倍速切换 */}
                    <div className="flex items-center gap-1 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700">
                      {[1.0, 1.25, 1.5].map(speed => (
                        <button
                          key={speed}
                          onClick={() => setPlaybackSpeed(speed)}
                          className={`text-[10px] font-mono px-1 rounded transition cursor-pointer ${
                            playbackSpeed === speed ? 'text-indigo-400 font-bold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          {speed}x
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        const matched = agents.find(a => a.name.includes(activeVideoModal.agentName.replace('Agent', ''))) || agents[0];
                        setActiveVideoModal(null);
                        if (matched) openAgentDetail(matched);
                        else {
                          setMarketplaceTab('agent');
                          setActiveTab('marketplace');
                        }
                      }}
                      className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1 shadow-sm"
                    >
                      <span>一键克隆该工作流</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
