import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Robot,
  Brain as BrainIcon,
  HardDrives,
  ClipboardText,
  Trophy as TrophyIcon,
  CalendarCheck as CalendarIcon,
  Sparkle as SparklesPhosphor,
  ArrowRight as ArrowRightPhosphor,
  Flame as FlamePhosphor,
  Users as UsersPhosphor,
  ChatCircleText,
  Play as PlayPhosphor,
  CheckCircle,
  VideoCamera,
  X as XPhosphor,
  ShieldCheck as ShieldCheckPhosphor,
  ShareNetwork,
  CopySimple,
  TrendUp,
  Cpu as CpuPhosphor,
  Database as DatabasePhosphor,
  Wrench as WrenchPhosphor,
  Eye as EyePhosphor,
  Coins as CoinsPhosphor
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

interface HomeView03Props {
  onSwitchToVersion01?: () => void;
  onSwitchToVersion02?: () => void;
}

export const HomeView03: React.FC<HomeView03Props> = ({ onSwitchToVersion01, onSwitchToVersion02 }) => {
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
          'border-t-[#6D4AFF]',
          'border-t-[#16A679]',
          'border-t-[#3478F6]',
          'border-t-[#F59E0B]',
          'border-t-purple-600',
          'border-t-indigo-600'
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
        topBorderColor: 'border-t-[#16A679]',
        gpuModel: 'RTX 4090',
        vram: '24 GB GDDR6X',
        cpu: '16 vCPU',
        ram: '64 GB',
        disk: '100 GB NVMe'
      }
    ];
  }, [computeSpecs]);

  // Hero 区真实平台统计数据
  const heroStats = useMemo(() => {
    const modelCount = models?.length || 31;
    const agentCount = agents?.filter(a => a.status !== '已下架').length || agents?.length || 86;
    const gpuCards = '1,200';
    const activeTasks = tasks?.filter(t => t.status === '进行中' || t.status === '已发布').length || 17;

    return {
      modelCount,
      agentCount,
      gpuCards,
      activeTasks
    };
  }, [models, agents, tasks]);

  // 1. 轮播 Banner 状态
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

  const [isVideoPlaying, setIsVideoPlaying] = useState(true);
  const [videoProgress, setVideoProgress] = useState(25);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isMuted, setIsMuted] = useState(false);

  // 5. 新用户横幅关闭状态
  const [isNewUserBannerDismissed, setIsNewUserBannerDismissed] = useState(false);

  // 轮播 Banner 列表 (符合品牌紫 #6D4AFF SaaS 风格)
  const banners = useMemo(() => [
    {
      id: 1,
      badge: '限时特惠 · 8折',
      title: 'DeepSeek-V3 深度求索模型 8 折，本周内有效',
      subtitle: '超强 671B MoE 架构，通用推理与代码生成领先，API 每百万 Token 仅 ¥9.0',
      buttonText: '立即查看模型',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      badgeClass: 'bg-[#EDE7FF] text-[#6D4AFF] border border-[#6D4AFF]/20',
      btnClass: 'bg-[#6D4AFF] hover:bg-[#5B3CE6] text-white',
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
      badgeClass: 'bg-emerald-50 text-[#16A679] border border-[#16A679]/20',
      btnClass: 'bg-[#16A679] hover:bg-[#128a64] text-white',
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
      badgeClass: 'bg-[#EDE7FF] text-[#6D4AFF] border border-[#6D4AFF]/20',
      btnClass: 'bg-[#6D4AFF] hover:bg-[#5B3CE6] text-white',
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
      badgeClass: 'bg-amber-50 text-[#F59E0B] border border-[#F59E0B]/20',
      btnClass: 'bg-[#F59E0B] hover:bg-[#d98205] text-white',
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
      badgeClass: 'bg-blue-50 text-[#3478F6] border border-[#3478F6]/20',
      btnClass: 'bg-[#3478F6] hover:bg-[#2860cb] text-white',
      action: () => {
        setActiveTab('tasks');
      }
    }
  ], [models, openModelDetail, setActiveTab, setCreateComputeModalOpen, setCreateComputePreset, setMarketplaceTab, showToast, availableRentalCards]);

  // 轮播定时器
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
  }, [isBannerPaused, banners.length]);

  const handleSelectBanner = (index: number) => {
    setBannerIndex(index);
    setBannerProgress(0);
  };

  // 6 个核心功能入口 (白色卡片底，1px #E8ECF4 边框，#EDE7FF 图标底座，#6D4AFF 图标)
  const quickActions = [
    {
      name: '使用 Agent',
      desc: '86 款即用智能体',
      icon: Robot,
      action: () => {
        setMarketplaceTab('agent');
        setActiveTab('marketplace');
      }
    },
    {
      name: '找模型',
      desc: '主流开源与商业模型',
      icon: BrainIcon,
      action: () => {
        setMarketplaceTab('model');
        setActiveTab('marketplace');
      }
    },
    {
      name: '启动算力',
      desc: 'RTX 4090 / A100 秒拉起',
      icon: HardDrives,
      action: () => {
        setActiveTab('compute');
      }
    },
    {
      name: '发布任务',
      desc: '揭榜挂帅众包协同',
      icon: ClipboardText,
      action: () => {
        setPublishTaskModalOpen(true);
      }
    },
    {
      name: '看赛事',
      desc: '算法与创新巅峰对抗',
      icon: TrophyIcon,
      action: () => {
        setActiveTab('creative');
      }
    },
    {
      name: hasCheckedInToday ? `已签到 ${continuousDays} 天` : '签到领积分',
      desc: hasCheckedInToday ? '今日签到奖励已入账' : '领积分抵扣调用额度',
      icon: CalendarIcon,
      action: () => {
        setIsCheckInModalOpen(true);
      }
    }
  ];

  // 特价模型专区
  const specialModels = [
    {
      name: 'DeepSeek-V4.1-Flash (1017版)',
      provider: '深度求索（DeepSeek）',
      desc: '智能体推理与“许愿式编程”能力全面升级，极致的智效比与高并发吞吐。',
      originalPrice: '输入 ¥6 ｜ 输出 ¥20',
      currentPrice: '输入 ¥3.6 ｜ 输出 ¥12',
      discount: '6.0折',
      tags: ['百万上下文', '原生Agent', '极速推理'],
      searchKeyword: 'DeepSeek'
    },
    {
      name: 'Qwen3.8-Max',
      provider: '阿里云百炼',
      desc: '2.4万亿总参数MoE架构，智能体编程与复杂工具调用达到领域SOTA水平，支持深度思考模式。',
      originalPrice: '输入 ¥12 ｜ 输出 ¥36',
      currentPrice: '输入 ¥9 ｜ 输出 ¥27',
      discount: '7.5折',
      tags: ['超万亿MoE', '深度思考', '全能编程'],
      searchKeyword: 'Qwen'
    },
    {
      name: 'Kimi K3 (Max)',
      provider: '月之暗面（Moonshot AI）',
      desc: '2.8万亿参数全球最大开源模型，原生多模态视觉理解，在软件工程、长文本深度推理及前端开发中表现顶尖。',
      originalPrice: '输入 ¥20 ｜ 输出 ¥100',
      currentPrice: '输入 ¥13 ｜ 输出 ¥66',
      discount: '6.6折',
      tags: ['2.8T旗舰参数', '原生多模态', '超强长文本'],
      searchKeyword: 'Kimi'
    },
    {
      name: 'GLM-5.3',
      provider: '智谱 AI',
      desc: '智谱最新旗舰，通过极致后训练Scaling大幅提升复杂软件工程与多步Agent任务能力，编程体验跃升50%。',
      originalPrice: '输入 ¥8 ｜ 输出 ¥28',
      currentPrice: '输入 ¥4 ｜ 输出 ¥14',
      discount: '5.0折',
      tags: ['新一代旗舰', '极速编程', '复杂Agent协同'],
      searchKeyword: 'GLM'
    }
  ];

  // 场景化“我猜你想...”卡片配置
  const scenarioSolutions = [
    {
      id: 'custom-service',
      title: '智能客服',
      subtitle: '快速搭建 7×24h 智能问答客服机器人',
      desc: '接入企业私有知识库，自动识别访客意图并秒级解答，降低 80% 人工转接成本',
      recommendAgent: '智能客服Agent',
      badge: '快速搭建',
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
      videoDuration: '3分钟配置',
      bgImage: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=600&auto=format&fit=crop&q=80',
      icon: Code2
    }
  ];

  // AI资源榜单
  const rankingBoards = [
    {
      id: 'models',
      title: '模型调用榜',
      icon: BrainIcon,
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
      icon: Robot,
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
      icon: WrenchPhosphor,
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
      icon: DatabasePhosphor,
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
      icon: CpuPhosphor,
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

  // 热门任务
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

  // 热门赛事
  const hotCompetitionList = [
    {
      id: 'comp-01',
      trackId: 'track-01-1',
      title: '2026 AI创新巅峰赛 - AI数据科学赛',
      type: 'AI数据科学赛',
      status: '进行中',
      prize: '¥50,000',
      participants: '428 人已参赛',
      cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'comp-01',
      trackId: 'track-01-2',
      title: '2026 AI创新巅峰赛 - AI安全挑战赛',
      type: 'AI安全挑战赛',
      status: '进行中',
      prize: '¥50,000',
      participants: '310 人已参赛',
      cover: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&auto=format&fit=crop&q=80'
    },
    {
      id: 'comp-01',
      trackId: 'track-01-3',
      title: '2026 AI创新巅峰赛 - AIGC生成赛',
      type: 'AIGC生成赛',
      status: '进行中',
      prize: '¥50,000',
      participants: '560 人已参赛',
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&auto=format&fit=crop&q=80'
    }
  ];

  // 社区热帖数据
  const featuredCommunityPost = {
    id: 'post-llm-finetune',
    title: 'LLM 微调踩坑记录',
    summary: '分享我在微调 LLM 时遇到的坑，包括数据清洗、学习率设置、显存优化等。涵盖从 LLaMA 到 DeepSeek 系列的全流程调优经验与实测避坑总结。',
    author: '张三',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    section: '干货分享',
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

  // 合作伙伴
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
    showToast('🎉 签到成功！已为您发放 +5 积分奖励');
  };

  return (
    <div className="relative min-h-screen bg-[#F6F7FB] text-[#1D2433] font-sans pb-16 space-y-6">

      {/* ========================================================
          1. 顶部品牌 Hero 区域 (SaaS 浅色科技风 · 冷白底色 + 柔光 + 精致指标)
         ======================================================== */}
      <div className="relative rounded-2xl bg-white border border-[#E8ECF4] py-8 px-6 sm:px-10 shadow-[0_2px_10px_rgba(31,41,55,0.035)] overflow-hidden">
        {/* 紫蓝柔和背景光影 */}
        <div className="absolute -top-24 -left-20 w-96 h-96 bg-[#EDE7FF]/60 rounded-full blur-3xl pointer-events-none select-none" />
        <div className="absolute -bottom-24 -right-20 w-96 h-96 bg-[#E0E7FF]/50 rounded-full blur-3xl pointer-events-none select-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EDE7FF] border border-[#6D4AFF]/20 text-[#6D4AFF] text-xs font-semibold">
              <SparklesPhosphor weight="duotone" className="w-3.5 h-3.5" />
              <span>赛宁·千机 AI 算力运营平台 0.3 SaaS 旗舰版</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[#1D2433]">
              汇聚 <span className="bg-gradient-to-r from-[#6D4AFF] to-[#3478F6] bg-clip-text text-transparent">AI 之力</span>，成就万千可能
            </h1>

            <p className="text-sm sm:text-base text-[#667085] leading-relaxed">
              一站式全场景 AI 算力调度、大模型 API 服务、Agent 智能体及开发者创客社区，助您秒拉起全能算力，快速落地 AI 应用。
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  setMarketplaceTab('agent');
                  setActiveTab('marketplace');
                }}
                className="px-5 py-2.5 rounded-lg bg-[#6D4AFF] hover:bg-[#5B3CE6] text-white text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs flex items-center gap-2"
              >
                <span>探索 Agent 智能体</span>
                <ArrowRightPhosphor weight="bold" className="w-4 h-4" />
              </button>
              <button
                onClick={() => setActiveTab('compute')}
                className="px-5 py-2.5 rounded-lg bg-white border border-[#E8ECF4] hover:border-[#6D4AFF] text-[#1D2433] hover:text-[#6D4AFF] text-xs sm:text-sm font-semibold transition cursor-pointer flex items-center gap-2 shadow-2xs"
              >
                <HardDrives weight="duotone" className="w-4 h-4 text-[#6D4AFF]" />
                <span>快速启动 GPU 算力</span>
              </button>
            </div>
          </div>

          {/* 精致四项平铺指标 */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto shrink-0">
            <div className="bg-[#F6F7FB] border border-[#E8ECF4] p-3.5 rounded-xl min-w-[130px] flex flex-col justify-center">
              <div className="text-xs text-[#667085] font-medium">模型库</div>
              <div className="text-xl font-bold text-[#1D2433] mt-0.5 font-mono">{heroStats.modelCount} 款</div>
            </div>
            <div className="bg-[#F6F7FB] border border-[#E8ECF4] p-3.5 rounded-xl min-w-[130px] flex flex-col justify-center">
              <div className="text-xs text-[#667085] font-medium">智能体</div>
              <div className="text-xl font-bold text-[#1D2433] mt-0.5 font-mono">{heroStats.agentCount} 款</div>
            </div>
            <div className="bg-[#F6F7FB] border border-[#E8ECF4] p-3.5 rounded-xl min-w-[130px] flex flex-col justify-center">
              <div className="text-xs text-[#667085] font-medium">纳管 GPU</div>
              <div className="text-xl font-bold text-[#6D4AFF] mt-0.5 font-mono">{heroStats.gpuCards} 卡</div>
            </div>
            <div className="bg-[#F6F7FB] border border-[#E8ECF4] p-3.5 rounded-xl min-w-[130px] flex flex-col justify-center">
              <div className="text-xs text-[#667085] font-medium">在招任务</div>
              <div className="text-xl font-bold text-[#16A679] mt-0.5 font-mono">{heroStats.activeTasks} 个</div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          2. 顶部通知与活动提示栏 (36px - 44px 高度)
         ======================================================== */}
      {!isNewUserBannerDismissed && (
        <div className="rounded-xl bg-white border border-[#E8ECF4] px-4 py-2.5 shadow-[0_2px_10px_rgba(31,41,55,0.035)] flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-[#1D2433] font-medium min-w-0">
            <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#EDE7FF] text-[#6D4AFF] font-bold text-[11px]">
              福利通知
            </span>
            <span className="truncate">
              新用户注册即赠 <strong className="text-[#6D4AFF] font-bold font-mono">¥20</strong> 体验金，全平台模型 API 与 GPU 算力无门槛抵扣！
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => showToast('20元体验金已发放至资产中心！')}
              className="text-[#6D4AFF] hover:underline font-bold text-xs cursor-pointer"
            >
              立即领取 &gt;
            </button>
            <button
              onClick={() => setIsNewUserBannerDismissed(true)}
              className="text-[#98A2B3] hover:text-[#1D2433] transition cursor-pointer p-0.5"
            >
              <XPhosphor className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          3. 六个核心功能入口 (白色卡片底，1px #E8ECF4 边框，#EDE7FF 图标底座)
         ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {quickActions.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="group relative bg-white border border-[#E8ECF4] hover:border-[#6D4AFF] rounded-xl p-4 text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(70,60,130,0.08)] cursor-pointer select-none flex flex-col justify-between h-[116px]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#EDE7FF] flex items-center justify-center shrink-0">
              <item.icon weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
            </div>
            <div>
              <div className="font-semibold text-sm text-[#1D2433] group-hover:text-[#6D4AFF] transition-colors truncate">
                {item.name}
              </div>
              <div className="text-xs text-[#667085] truncate mt-0.5">
                {item.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ========================================================
          4. 算力优惠及推广 Banner (横向大卡片，紫蓝色系 SaaS 风格)
         ======================================================== */}
      <div
        className="relative rounded-2xl bg-white border border-[#E8ECF4] shadow-[0_2px_10px_rgba(31,41,55,0.035)] overflow-hidden"
        onMouseEnter={() => setIsBannerPaused(true)}
        onMouseLeave={() => setIsBannerPaused(false)}
      >
        <div className="p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="max-w-xl space-y-3">
            <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold ${banners[bannerIndex].badgeClass}`}>
              {banners[bannerIndex].badge}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1D2433]">
              {banners[bannerIndex].title}
            </h2>
            <p className="text-xs sm:text-sm text-[#667085] leading-relaxed">
              {banners[bannerIndex].subtitle}
            </p>
            <div className="pt-2">
              <button
                onClick={banners[bannerIndex].action}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold transition cursor-pointer shadow-xs ${banners[bannerIndex].btnClass}`}
              >
                {banners[bannerIndex].buttonText}
              </button>
            </div>
          </div>

          {/* 右侧配图 */}
          <div className="w-full md:w-72 h-40 sm:h-48 rounded-xl overflow-hidden relative shrink-0 border border-[#E8ECF4]">
            <img
              src={banners[bannerIndex].bgImage}
              alt="Banner"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </div>
        </div>

        {/* 底部指示器 */}
        <div className="px-6 py-3 bg-[#F6F7FB] border-t border-[#E8ECF4] flex items-center justify-between">
          <div className="flex items-center gap-2">
            {banners.map((b, idx) => (
              <button
                key={b.id}
                onClick={() => handleSelectBanner(idx)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  idx === bannerIndex ? 'w-6 bg-[#6D4AFF]' : 'w-2 bg-[#98A2B3]/40'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-[#98A2B3] font-mono">
            0{bannerIndex + 1} / 0{banners.length}
          </div>
        </div>
      </div>

      {/* ========================================================
          5. 特价模型专区
         ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainIcon weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
            <h2 className="text-lg font-bold text-[#1D2433]">特价模型专区</h2>
            <span className="text-xs text-[#667085] hidden sm:inline">基座大模型 API 优惠直降</span>
          </div>
          <button
            onClick={() => {
              setMarketplaceTab('model');
              setActiveTab('marketplace');
            }}
            className="text-xs font-semibold text-[#6D4AFF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>查看全模型库</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {specialModels.map((m, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#E8ECF4] hover:border-[#6D4AFF] rounded-xl p-4 flex flex-col justify-between transition-all duration-200 hover:shadow-[0_6px_20px_rgba(70,60,130,0.08)]"
            >
              <div>
                <div className="flex items-start justify-between gap-1.5">
                  <div className="font-bold text-[#1D2433] text-sm truncate">{m.name}</div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-xs shrink-0">
                    {m.discount}
                  </span>
                </div>
                <div className="text-[11px] text-[#98A2B3] mt-0.5">{m.provider}</div>
                <p className="text-xs text-[#667085] mt-2 line-clamp-2 leading-relaxed min-h-[32px]">
                  {m.desc}
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {m.tags.map((t, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded-md bg-[#F6F7FB] border border-slate-200/70 text-[#667085] font-semibold">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 mt-3 border-t border-[#E8ECF4] space-y-1">
                <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>原价</span>
                  <span className="line-through text-slate-400">{m.originalPrice} /M</span>
                </div>
                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-[11px] font-bold text-rose-600">现价</span>
                  <div className="text-right">
                    <span className="text-xs font-black font-mono text-rose-600">{m.currentPrice}</span>
                    <span className="text-[10px] text-slate-400 font-mono ml-0.5">/1M</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const found = models.find(mod => mod.name.toLowerCase().includes(m.searchKeyword.toLowerCase())) || models[0];
                    if (found) openModelDetail(found);
                    else {
                      setMarketplaceTab('model');
                      setActiveTab('marketplace');
                    }
                  }}
                  className="w-full mt-2 py-1.5 rounded-lg border border-[#6D4AFF] text-[#6D4AFF] hover:bg-[#6D4AFF] hover:text-white text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1"
                >
                  立即使用
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          6. 场景化“我猜你想...”卡片
         ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SparklesPhosphor weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
            <h2 className="text-lg font-bold text-[#1D2433]">我猜你想...</h2>
            <span className="text-xs text-[#667085] hidden sm:inline">常见场景一键上手指南</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {scenarioSolutions.map(s => (
            <div
              key={s.id}
              className="bg-white border border-[#E8ECF4] rounded-xl p-4 flex flex-col justify-between hover:border-[#6D4AFF] transition-all duration-200 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <s.icon className="w-4 h-4 text-[#6D4AFF]" />
                    <span className="font-bold text-sm text-[#1D2433]">{s.title}</span>
                  </div>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#EDE7FF] text-[#6D4AFF] font-semibold">
                    {s.badge}
                  </span>
                </div>
                <div className="text-xs font-medium text-[#1D2433] mt-2">{s.subtitle}</div>
                <p className="text-xs text-[#667085] mt-1 line-clamp-2 leading-relaxed">
                  {s.desc}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E8ECF4] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    const agent = agents.find(a => a.name.includes(s.title)) || agents[0];
                    if (agent) openAgentDetail(agent);
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#6D4AFF] hover:bg-[#5B3CE6] text-white text-xs font-semibold transition cursor-pointer shrink-0"
                >
                  立即体验
                </button>
                <button
                  onClick={() => {
                    setActiveVideoModal({
                      isOpen: true,
                      title: `${s.title}部署指南`,
                      duration: s.videoDuration,
                      agentName: s.recommendAgent,
                      description: s.desc
                    });
                  }}
                  className="text-xs text-[#667085] hover:text-[#6D4AFF] font-medium flex items-center gap-1 cursor-pointer truncate"
                >
                  <VideoCamera className="w-3.5 h-3.5 text-[#6D4AFF]" />
                  <span>{s.videoDuration}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          7. AI 资源榜单
         ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendUp weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
            <h2 className="text-lg font-bold text-[#1D2433]">AI 资源榜单</h2>
            <span className="text-xs text-[#667085] hidden sm:inline">全网热度与调用趋势排行</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {rankingBoards.map(board => (
            <div key={board.id} className="bg-white border border-[#E8ECF4] rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-[#E8ECF4] pb-2.5">
                  <div className="flex items-center gap-2">
                    <board.icon weight="duotone" className="w-4 h-4 text-[#6D4AFF]" />
                    <span className="font-bold text-xs text-[#1D2433]">{board.title}</span>
                  </div>
                  <button
                    onClick={board.onMoreClick}
                    className="text-[11px] text-[#6D4AFF] hover:underline font-semibold cursor-pointer"
                  >
                    查看完整资源
                  </button>
                </div>

                <div className="space-y-2 mt-3">
                  {board.items.map(item => (
                    <div
                      key={item.rank}
                      onClick={() => board.onItemClick(item)}
                      className="group flex items-center justify-between text-xs cursor-pointer p-1 rounded hover:bg-[#F6F7FB] transition"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                          item.rank === 1 ? 'bg-[#6D4AFF] text-white' :
                          item.rank === 2 ? 'bg-[#EDE7FF] text-[#6D4AFF]' :
                          item.rank === 3 ? 'bg-slate-200 text-[#1D2433]' : 'text-[#98A2B3]'
                        }`}>
                          {item.rank}
                        </span>
                        <span className="truncate text-[#1D2433] group-hover:text-[#6D4AFF] font-medium">
                          {item.name}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#98A2B3] font-mono shrink-0 ml-1">
                        {item.metric}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          8. 热门任务区域
         ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardText weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
            <h2 className="text-lg font-bold text-[#1D2433]">热门任务</h2>
            <span className="text-xs text-[#667085] hidden sm:inline">揭榜挂帅众包大模型任务</span>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs font-semibold text-[#6D4AFF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>任务大厅</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {hotTaskList.map(t => (
            <div
              key={t.id}
              className="bg-white border border-[#E8ECF4] hover:border-[#6D4AFF] rounded-xl p-4 flex flex-col justify-between transition-all duration-200 shadow-2xs"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-[#F6F7FB] text-[#667085]">
                    {t.category}
                  </span>
                  <span className="text-xs font-bold text-[#6D4AFF] font-mono">{t.reward}</span>
                </div>
                <div className="font-bold text-sm text-[#1D2433] mt-2 truncate">{t.title}</div>
                <div className="text-xs text-[#667085] mt-1">{t.publisher}</div>
              </div>

              <div className="pt-3 mt-3 border-t border-[#E8ECF4] flex items-center justify-between">
                <span className="text-[11px] text-[#98A2B3]">剩余 {t.remainingDays} · {t.bids} 人投标</span>
                <button
                  onClick={() => {
                    setSelectedTaskIdForDetail(t.id);
                    setActiveTab('tasks');
                  }}
                  className="px-3 py-1.5 rounded-lg bg-[#F6F7FB] hover:bg-[#EDE7FF] text-[#6D4AFF] text-xs font-semibold transition cursor-pointer"
                >
                  任务详情
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          9. 热门赛事区域
         ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrophyIcon weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
            <h2 className="text-lg font-bold text-[#1D2433]">热门赛事</h2>
            <span className="text-xs text-[#667085] hidden sm:inline">算法竞技与创新巅峰赛</span>
          </div>
          <button
            onClick={() => setActiveTab('creative')}
            className="text-xs font-semibold text-[#6D4AFF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>赛事中心</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          {hotCompetitionList.map(c => (
            <div
              key={c.trackId}
              className="bg-white border border-[#E8ECF4] hover:border-[#6D4AFF] rounded-xl overflow-hidden transition-all duration-200 shadow-2xs group cursor-pointer"
              onClick={() => {
                openCompetitionDetail(c.id);
              }}
            >
              <div className="h-36 overflow-hidden relative">
                <img
                  src={c.cover}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-[#16A679] text-white">
                  {c.status}
                </span>
              </div>
              <div className="p-4 space-y-2">
                <div className="font-bold text-sm text-[#1D2433] line-clamp-1 group-hover:text-[#6D4AFF] transition-colors">
                  {c.title}
                </div>
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-[#6D4AFF] font-bold font-mono">奖池 {c.prize}</span>
                  <span className="text-[#98A2B3]">{c.participants}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          10. 社区热帖区域 (左右双栏：左60%精选大卡，右40%热帖榜)
         ======================================================== */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ChatCircleText weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
            <h2 className="text-lg font-bold text-[#1D2433]">社区热帖</h2>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs font-semibold text-[#6D4AFF] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>进入社区 &gt;</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* 左侧 60%：精选热帖大卡片 */}
          <div
            onClick={() => openPostDetailWithOrigin(featuredCommunityPost.id)}
            className="lg:col-span-7 bg-white border border-[#E8ECF4] hover:border-[#6D4AFF] rounded-2xl p-5 cursor-pointer transition-all duration-200 shadow-2xs group flex flex-col justify-between"
          >
            <div>
              <div className="h-48 sm:h-56 rounded-xl overflow-hidden relative mb-4">
                <img
                  src={featuredCommunityPost.cover}
                  alt={featuredCommunityPost.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md text-xs font-bold bg-[#EDE7FF] text-[#6D4AFF]">
                  {featuredCommunityPost.section}
                </span>
              </div>
              <h3 className="font-bold text-base sm:text-lg text-[#1D2433] group-hover:text-[#6D4AFF] transition-colors line-clamp-1">
                {featuredCommunityPost.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#667085] mt-2 line-clamp-2 leading-relaxed">
                {featuredCommunityPost.summary}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-[#E8ECF4] flex items-center justify-between text-xs text-[#98A2B3]">
              <div className="flex items-center gap-2">
                <img
                  src={featuredCommunityPost.avatar}
                  alt={featuredCommunityPost.author}
                  className="w-6 h-6 rounded-full object-cover"
                />
                <span className="font-medium text-[#1D2433]">{featuredCommunityPost.author}</span>
              </div>
              <div className="flex items-center gap-3">
                <span>💬 {featuredCommunityPost.comments}</span>
                <span>⭐ {featuredCommunityPost.likes}</span>
              </div>
            </div>
          </div>

          {/* 右侧 40%：热帖榜 */}
          <div className="lg:col-span-5 bg-white border border-[#E8ECF4] rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 border-b border-[#E8ECF4] pb-3 mb-3">
                <FlamePhosphor weight="duotone" className="w-5 h-5 text-[#F59E0B]" />
                <h3 className="font-bold text-sm text-[#1D2433]">🔥 热帖榜</h3>
              </div>

              <div className="space-y-3">
                {hotPostRanking.map(post => (
                  <div
                    key={post.id}
                    onClick={() => openPostDetailWithOrigin(post.id)}
                    className="group flex items-center justify-between text-xs cursor-pointer p-2 rounded-lg hover:bg-[#F6F7FB] transition"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span className={`w-5 h-5 rounded font-bold text-xs flex items-center justify-center shrink-0 ${
                        post.rank === 1 ? 'bg-[#6D4AFF] text-white' :
                        post.rank === 2 ? 'bg-[#EDE7FF] text-[#6D4AFF]' :
                        post.rank === 3 ? 'bg-slate-200 text-[#1D2433]' : 'text-[#98A2B3]'
                      }`}>
                        {post.rank}
                      </span>
                      <div className="min-w-0">
                        <div className="font-medium text-[#1D2433] group-hover:text-[#6D4AFF] truncate">
                          {post.title}
                        </div>
                        <div className="text-[10px] text-[#98A2B3] mt-0.5">
                          {post.section} · {post.author}
                        </div>
                      </div>
                    </div>
                    <div className="text-[11px] text-[#98A2B3] shrink-0 ml-2">
                      💬 {post.comments} ⭐ {post.likes}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          11. 平台统计与合作伙伴
         ======================================================== */}
      <div className="bg-white border border-[#E8ECF4] rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center divide-x divide-[#E8ECF4]">
          <div>
            <div className="text-xs text-[#667085]">注册开发者</div>
            <div className="text-2xl font-bold text-[#1D2433] mt-1 font-mono">12,480+</div>
          </div>
          <div>
            <div className="text-xs text-[#667085]">上架 Agent</div>
            <div className="text-2xl font-bold text-[#6D4AFF] mt-1 font-mono">86 款</div>
          </div>
          <div>
            <div className="text-xs text-[#667085]">已完成协同任务</div>
            <div className="text-2xl font-bold text-[#16A679] mt-1 font-mono">1,820 件</div>
          </div>
          <div>
            <div className="text-xs text-[#667085]">GPU 平均利用率</div>
            <div className="text-2xl font-bold text-[#3478F6] mt-1 font-mono">92.4%</div>
          </div>
        </div>

        <div className="pt-4 border-t border-[#E8ECF4]">
          <div className="text-xs text-[#98A2B3] mb-3 text-center">生态合作伙伴</div>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {partnerLogos.map((p, idx) => (
              <div key={idx} className="px-3 py-1.5 rounded-lg border border-[#E8ECF4] bg-[#F6F7FB] text-xs text-[#667085] font-medium">
                {p.name}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 签到弹窗 */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E8ECF4]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
                <h3 className="font-bold text-base text-[#1D2433]">每日签到领积分</h3>
              </div>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="text-[#98A2B3] hover:text-[#1D2433] cursor-pointer"
              >
                <XPhosphor className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#F6F7FB] rounded-xl p-4 text-center space-y-1">
              <div className="text-xs text-[#667085]">已连续签到</div>
              <div className="text-3xl font-bold text-[#6D4AFF] font-mono">{continuousDays} 天</div>
              <div className="text-[11px] text-[#98A2B3]">每日签到可获得 5 积分，可抵扣 API 额度</div>
            </div>

            <button
              onClick={handleCheckIn}
              disabled={hasCheckedInToday}
              className={`w-full py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                hasCheckedInToday
                  ? 'bg-[#F6F7FB] text-[#98A2B3] cursor-not-allowed border border-[#E8ECF4]'
                  : 'bg-[#6D4AFF] hover:bg-[#5B3CE6] text-white shadow-xs'
              }`}
            >
              {hasCheckedInToday ? '今日已签到' : '立即签到领 +5 积分'}
            </button>
          </div>
        </div>
      )}

      {/* 视频教程弹窗 */}
      {activeVideoModal && activeVideoModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E8ECF4] space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VideoCamera weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
                <h3 className="font-bold text-base text-[#1D2433]">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-[#98A2B3] hover:text-[#1D2433] cursor-pointer"
              >
                <XPhosphor className="w-5 h-5" />
              </button>
            </div>

            <div className="aspect-video bg-slate-900 rounded-xl relative flex items-center justify-center overflow-hidden">
              <div className="text-center text-white space-y-2">
                <PlayPhosphor weight="fill" className="w-12 h-12 text-[#6D4AFF] mx-auto animate-pulse" />
                <div className="text-xs text-slate-300 font-medium">视频教程播放演示中 ({activeVideoModal.duration})</div>
              </div>
            </div>

            <div className="text-xs text-[#667085] leading-relaxed">
              {activeVideoModal.description}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
