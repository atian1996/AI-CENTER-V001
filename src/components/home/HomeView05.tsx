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
  ShareNetwork,
  CopySimple,
  Play as PlayPhosphor,
  CheckCircle,
  VideoCamera,
  X as XPhosphor
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
  Building2,
  Clock,
  Code2,
  Database,
  Wrench,
  Server,
  Zap,
  Activity,
  Award,
  BookOpen
} from 'lucide-react';
import { AgentItem, ModelItem, DatasetItem, SkillPluginItem, RentalGPUCard } from '../../types';

interface HomeView05Props {
  onSwitchToVersion01?: () => void;
  onSwitchToVersion02?: () => void;
  onSwitchToVersion04?: () => void;
}

export const HomeView05: React.FC<HomeView05Props> = ({
  onSwitchToVersion01,
  onSwitchToVersion02,
  onSwitchToVersion04
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

  // 4. 视频教程弹窗
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

  // 5. 新用户福利条是否关闭
  const [isNewUserBannerDismissed, setIsNewUserBannerDismissed] = useState(false);

  // 动态构建算力卡片列表供预设与跳转使用
  const availableRentalCards: RentalGPUCard[] = useMemo(() => {
    const onlineSpecs = (computeSpecs || []).filter(s => s.status === '上架');
    if (onlineSpecs.length > 0) {
      return onlineSpecs.map((s, idx) => {
        const borderColors = [
          'border-t-[#6D4AFF]',
          'border-t-[#16A36A]',
          'border-t-[#3B82F6]',
          'border-t-[#F59E0B]',
          'border-t-[#8B5CF6]',
          'border-t-[#06B6D4]'
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
        topBorderColor: 'border-t-[#16A36A]',
        gpuModel: 'RTX 4090',
        vram: '24 GB GDDR6X',
        cpu: '16 vCPU',
        ram: '64 GB',
        disk: '100 GB NVMe'
      }
    ];
  }, [computeSpecs]);

  // 真实平台统计数据（精准对齐平台实际数据）
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

  // 轮播 Banner 列表 (5条：品牌介绍、限时特惠、算力秒杀、新用户礼遇、赛事/任务推荐)
  const banners = useMemo(() => [
    {
      id: 1,
      isBrandHero: true,
      badge: '平台主视界 · 核心动力',
      badgeClass: 'bg-[#F0EDFF] text-[#6D4AFF] border-[#E0D9FF]',
      title: '汇聚 AI 之力，成就万千可能',
      subtitle: '一站式全场景 AI 算力调度、大模型 API 服务、Agent 智能体及开发者协同，秒级拉起，即刻落地',
      buttonText: '探索智能体',
      secondaryBtnText: '启动 GPU 算力',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80',
      action: () => {
        setMarketplaceTab('agent');
        setActiveTab('marketplace');
      },
      secondaryAction: () => {
        setActiveTab('compute');
      }
    },
    {
      id: 2,
      isBrandHero: false,
      badge: '限时特惠 · 8折',
      badgeClass: 'bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]',
      title: 'DeepSeek-V3 深度求索模型 8 折，本周内有效',
      subtitle: '超强 671B MoE 架构，通用推理与代码生成领先，API 每百万 Token 仅需 ¥9.0',
      buttonText: '立即查看模型',
      bgImage: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80',
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
      id: 3,
      isBrandHero: false,
      badge: '算力秒杀 · ¥1.2/时',
      badgeClass: 'bg-[#ECFDF5] text-[#16A36A] border-[#A7F3D0]',
      title: 'RTX 4090 算力限时抢购 ¥1.2 / 小时',
      subtitle: '支持一键拉起 PyTorch / vLLM / ComfyUI 官方镜像，秒级调度，即开即用零等待',
      buttonText: '启动算力工坊',
      bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
      action: () => {
        const found = availableRentalCards?.find(c => c.gpuModel.toLowerCase().includes('4090')) || availableRentalCards?.[0];
        if (found) {
          setCreateComputePreset?.({ card: found });
        }
        setCreateComputeModalOpen(true);
      }
    },
    {
      id: 4,
      isBrandHero: false,
      badge: '新用户礼遇 · 注册即送',
      badgeClass: 'bg-[#F0EDFF] text-[#6D4AFF] border-[#E0D9FF]',
      title: '注册即送 20 元体验金，无门槛畅享百款模型',
      subtitle: '可全额抵扣大模型 API 调用、Agent 智能体订阅与 GPU 算力租赁计费',
      buttonText: '查看体验金说明',
      bgImage: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80',
      action: () => {
        showToast('20元新用户体验金已发放至钱包账户，可抵扣任意模型与算力订单！');
      }
    },
    {
      id: 5,
      isBrandHero: false,
      badge: '重磅赛事 · ¥50,000 奖金',
      badgeClass: 'bg-[#FEF3C7] text-[#D97706] border-[#FDE68A]',
      title: '2026 AI 数据科学挑战赛火热报名中',
      subtitle: '面向产业和高校算法开发者，提供专属免费算力配额与企业直接签约通道',
      buttonText: '立即报名参赛',
      bgImage: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      action: () => {
        setActiveTab('creative');
      }
    }
  ], [models, openModelDetail, setActiveTab, setCreateComputeModalOpen, setCreateComputePreset, setMarketplaceTab, showToast, availableRentalCards]);

  // 轮播定时器（5秒自动切换 + 平滑细线进度）
  useEffect(() => {
    if (isBannerPaused) return;
    const intervalTime = 50;
    const step = 100 / (5000 / intervalTime);

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

  // 快捷入口 6 个卡片（符合规范：严禁彩色大色块，采用极简白色卡片 + 细浅灰边框 + 品牌浅紫底座图标）
  const quickActions = [
    {
      name: '使用Agent',
      desc: '86 款即用智能体',
      IconComponent: Robot,
      action: () => {
        setMarketplaceTab('agent');
        setActiveTab('marketplace');
      }
    },
    {
      name: '找模型',
      desc: '主流开源与商业模型',
      IconComponent: BrainIcon,
      action: () => {
        setMarketplaceTab('model');
        setActiveTab('marketplace');
      }
    },
    {
      name: '启动算力',
      desc: 'RTX 4090 / A100 秒拉起',
      IconComponent: HardDrives,
      action: () => {
        setActiveTab('compute');
      }
    },
    {
      name: '发布任务',
      desc: '揭榜挂帅众包协同',
      IconComponent: ClipboardText,
      action: () => {
        setPublishTaskModalOpen(true);
      }
    },
    {
      name: '看赛事',
      desc: '算法与创新巅峰对抗',
      IconComponent: TrophyIcon,
      action: () => {
        setActiveTab('creative');
      }
    },
    {
      name: hasCheckedInToday ? `已连续签到 ${continuousDays} 天` : '签到领积分',
      desc: hasCheckedInToday ? '今日奖励已成功入账' : '每日领积分抵扣调用',
      IconComponent: CalendarIcon,
      action: () => {
        setIsCheckInModalOpen(true);
      }
    }
  ];

  // 特价模型专区数据（统一极简白底，去除花哨彩色渐变，精细文字层级）
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
      desc: '2.8万亿参数全球最大开源模型，原生多模态视觉理解，在软件工程、长文本深度推理中表现顶尖。',
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

  // 场景化“我猜你想...”卡片
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

  // 资源榜单 (5个子榜单：模型、Agent、Skill、数据集、GPU实例)
  const rankingBoards = [
    {
      id: 'models',
      title: '模型调用榜',
      icon: Brain,
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
      cover: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&auto=format&fit=crop&q=80',
      statusBadge: 'bg-[#ECFDF5] text-[#16A36A] border-[#A7F3D0]'
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
      statusBadge: 'bg-[#ECFDF5] text-[#16A36A] border-[#A7F3D0]'
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
      statusBadge: 'bg-[#ECFDF5] text-[#16A36A] border-[#A7F3D0]'
    }
  ];

  // 社区热帖
  const featuredCommunityPost = {
    id: 'post-llm-finetune',
    title: 'LLM 微调踩坑记录与显存调优实战',
    summary: '分享在微调 LLM 时遇到的真实经验，包括数据清洗、学习率设置、显存优化。涵盖从 LLaMA 到 DeepSeek 系列的全流程调优避坑实测。',
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
      title: 'LLM 微调踩坑记录与显存优化',
      section: '干货分享',
      author: '张三',
      comments: 12,
      likes: 45
    },
    {
      id: 'post-rag-framework',
      rank: 2,
      title: '企业级 RAG 检索知识库选型指南',
      section: '求助答疑',
      author: '李四',
      comments: 8,
      likes: 32
    },
    {
      id: 'post-ai-paint-workflow',
      rank: 3,
      title: 'Flux + ComfyUI 商业设计工作流精讲',
      section: '前沿观察',
      author: '王五',
      comments: 15,
      likes: 28
    },
    {
      id: 'post-nlp-team',
      rank: 4,
      title: '金融 NLP 评测任务组队招募',
      section: '同行交流',
      author: '赵六',
      comments: 6,
      likes: 18
    },
    {
      id: 'post-data-annotation',
      rank: 5,
      title: '高吞吐数据流转与自动化标注工具',
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
      showToast('今日已经签过到啦，明日继续保持哦！');
      return;
    }
    checkInToday();
    setContinuousDays(prev => prev + 1);
    showToast('签到成功！获得 +5 积分奖励 🎉');
  };

  return (
    <div className="w-full space-y-6 antialiased text-[#242139] pb-20 select-none relative font-sans">
      
      {/* 科技感浅色背景纹理与柔和紫蓝微光（对比度极低，清透干净） */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[#F7F7FC]" />
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#E2E1EC_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[400px] bg-[#F0EDFF]/70 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/5 w-[450px] h-[400px] bg-[#E0E7FF]/40 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ========================================================
          1. 顶部通知与活动小条 (新用户福利与邀请返利)
         ======================================================== */}
      <div className="space-y-2.5">
        {!isNewUserBannerDismissed && (
          <div className="rounded-xl bg-white border border-[#E8E7F0] p-3 sm:px-4 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(36,33,57,0.03)] relative overflow-hidden">
            <div className="flex items-center gap-3 text-xs sm:text-[13px] font-medium text-[#242139] truncate">
              <span className="w-6 h-6 rounded-md bg-[#F0EDFF] text-[#6D4AFF] flex items-center justify-center text-xs font-bold shrink-0">
                🎁
              </span>
              <span className="truncate">
                新用户注册即享 <strong className="text-[#6D4AFF] font-bold font-mono">¥20</strong> 体验金，全平台模型 API 与 GPU 算力无门槛抵扣
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  showToast('20元体验金已激活！您可在调用模型或创建算力实例时直接抵扣。');
                  setIsNewUserBannerDismissed(true);
                }}
                className="px-3 py-1 rounded-lg bg-[#6D4AFF] hover:bg-[#5735D8] text-white font-medium text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
              >
                <span>立即领取</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                onClick={() => setIsNewUserBannerDismissed(true)}
                className="p-1 text-[#9692A6] hover:text-[#242139] transition cursor-pointer"
                title="关闭提示"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* 邀请返利条 */}
        <div className="rounded-xl bg-white border border-[#E8E7F0] p-3 sm:px-4 flex items-center justify-between gap-3 shadow-[0_2px_8px_rgba(36,33,57,0.03)]">
          <div className="flex items-center gap-2.5 text-xs sm:text-[13px] font-medium text-[#242139]">
            <span className="w-6 h-6 rounded-md bg-[#F0EDFF] text-[#6D4AFF] flex items-center justify-center text-xs shrink-0">
              🤝
            </span>
            <span>
              邀请开发者好友注册平台，双方账户各立得 <strong className="text-[#6D4AFF] font-bold font-mono">¥20</strong> 账户余额与积分奖励
            </span>
          </div>
          <button
            onClick={() => setIsInviteModalOpen(true)}
            className="px-3 py-1 rounded-lg bg-white border border-[#6D4AFF] text-[#6D4AFF] hover:bg-[#F0EDFF] font-medium text-xs transition cursor-pointer shrink-0 flex items-center gap-1"
          >
            <span>立即邀请</span>
            <Share2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* ========================================================
          2. 快捷入口 (6个极简卡片 · 去除彩色背景 · 统一浅灰边框 + 浅紫底座)
         ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-3.5">
        {quickActions.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className="bg-white border border-[#E8E7F0] hover:border-[#6D4AFF] rounded-xl p-3.5 flex flex-col justify-between text-left transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(109,74,255,0.08)] cursor-pointer group select-none h-[112px]"
          >
            <div className="w-9 h-9 rounded-lg bg-[#F0EDFF] flex items-center justify-center shrink-0 transition-colors group-hover:bg-[#6D4AFF] text-[#6D4AFF] group-hover:text-white">
              <item.IconComponent size={20} weight="duotone" className="transition-colors" />
            </div>

            <div className="min-w-0">
              <div className="font-semibold text-sm text-[#242139] group-hover:text-[#6D4AFF] transition-colors truncate">
                {item.name}
              </div>
              <div className="text-xs text-[#716D83] truncate mt-0.5">
                {item.desc}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* ========================================================
          3. 轮播 Banner 区 (高度紧凑 160-200px · 左右分栏 · 第一页承担品牌主视觉)
         ======================================================== */}
      <div
        onMouseEnter={() => setIsBannerPaused(true)}
        onMouseLeave={() => setIsBannerPaused(false)}
        className="relative rounded-2xl overflow-hidden min-h-[175px] sm:min-h-[195px] border border-[#E8E7F0] shadow-[0_2px_12px_rgba(36,33,57,0.04)] select-none bg-white group"
      >
        {banners.map((item, idx) => {
          const isActive = idx === bannerIndex;
          return (
            <div
              key={item.id}
              className={`absolute inset-0 transition-opacity duration-500 ${
                isActive ? 'opacity-100 pointer-events-auto z-10' : 'opacity-0 pointer-events-none z-0'
              }`}
            >
              {/* 背景装饰及遮罩 */}
              <div className="absolute right-0 top-0 bottom-0 w-2/5 md:w-1/2 overflow-hidden pointer-events-none">
                <img
                  src={item.bgImage}
                  alt={item.title}
                  className="w-full h-full object-cover object-center opacity-85 scale-100 group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
              </div>

              {/* Banner 内容：左右分栏平衡布局 */}
              <div className="relative z-10 h-full p-5 sm:p-6 lg:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                
                {/* 左侧文字与操作区 */}
                <div className="max-w-xl flex flex-col justify-between h-full space-y-2">
                  <div>
                    <span className={`inline-block px-2 py-0.5 rounded text-[11px] font-semibold border ${item.badgeClass} mb-1.5`}>
                      {item.badge}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-[#242139] tracking-tight leading-snug">
                      {item.title}
                    </h2>
                    <p className="text-xs sm:text-[13px] text-[#716D83] leading-relaxed line-clamp-2 mt-1">
                      {item.subtitle}
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 pt-1">
                    <button
                      onClick={item.action}
                      className="px-4 py-2 rounded-lg bg-[#6D4AFF] hover:bg-[#5735D8] text-white font-medium text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>{item.buttonText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    {item.isBrandHero && item.secondaryBtnText && (
                      <button
                        onClick={item.secondaryAction}
                        className="px-4 py-2 rounded-lg bg-white border border-[#E8E7F0] hover:border-[#6D4AFF] text-[#242139] hover:text-[#6D4AFF] font-medium text-xs transition cursor-pointer flex items-center gap-1.5"
                      >
                        <HardDrives weight="duotone" className="w-3.5 h-3.5 text-[#6D4AFF]" />
                        <span>{item.secondaryBtnText}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* 右侧：若为品牌介绍第一页，展示四项核心数据卡片；其他页展示视觉指标 */}
                {item.isBrandHero ? (
                  <div className="grid grid-cols-2 gap-2.5 w-full md:w-auto shrink-0 pr-2 lg:pr-6">
                    <div className="bg-white/90 backdrop-blur-md border border-[#E8E7F0] p-2.5 rounded-xl min-w-[120px]">
                      <div className="text-[11px] text-[#716D83]">全模态模型</div>
                      <div className="text-lg font-bold text-[#242139] font-mono mt-0.5">{heroStats.modelCount} 款</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md border border-[#E8E7F0] p-2.5 rounded-xl min-w-[120px]">
                      <div className="text-[11px] text-[#716D83]">即用智能体</div>
                      <div className="text-lg font-bold text-[#6D4AFF] font-mono mt-0.5">{heroStats.agentCount} 款</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md border border-[#E8E7F0] p-2.5 rounded-xl min-w-[120px]">
                      <div className="text-[11px] text-[#716D83]">纳管算力池</div>
                      <div className="text-lg font-bold text-[#242139] font-mono mt-0.5">{heroStats.gpuCards} 卡</div>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md border border-[#E8E7F0] p-2.5 rounded-xl min-w-[120px]">
                      <div className="text-[11px] text-[#716D83]">在招赏金任务</div>
                      <div className="text-lg font-bold text-[#16A36A] font-mono mt-0.5">{heroStats.activeTasks} 个</div>
                    </div>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-2 pr-4 text-right">
                    <div className="bg-white/90 backdrop-blur-md border border-[#E8E7F0] p-3 rounded-xl shadow-2xs">
                      <div className="text-xs text-[#716D83]">平台特惠保障</div>
                      <div className="text-sm font-bold text-[#6D4AFF] mt-0.5">高速专线 · 实时结算</div>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}

        {/* 顶部微型细线播放进度条 */}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[#F0EDFF] z-20 overflow-hidden">
          <div
            className="h-full bg-[#6D4AFF] transition-all duration-75"
            style={{ width: `${bannerProgress}%` }}
          />
        </div>

        {/* 底部指示器 */}
        <div className="absolute bottom-3 right-5 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-full border border-[#E8E7F0] shadow-xs text-xs">
          <span className="font-mono text-[10px] text-[#9692A6]">
            0{bannerIndex + 1} / 0{banners.length}
          </span>
          <div className="flex items-center gap-1">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => handleSelectBanner(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  i === bannerIndex ? 'w-4 bg-[#6D4AFF]' : 'w-1.5 bg-[#E8E7F0] hover:bg-[#9692A6]'
                }`}
                title={`切换至第 ${i + 1} 张`}
              />
            ))}
          </div>
        </div>

        {/* 左右箭头控制 */}
        <button
          onClick={() => handleSelectBanner((bannerIndex - 1 + banners.length) % banners.length)}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#242139] flex items-center justify-center shadow-xs transition cursor-pointer border border-[#E8E7F0] opacity-0 group-hover:opacity-100"
          title="上一张"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleSelectBanner((bannerIndex + 1) % banners.length)}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 z-20 w-7 h-7 rounded-full bg-white/90 hover:bg-white text-[#242139] flex items-center justify-center shadow-xs transition cursor-pointer border border-[#E8E7F0] opacity-0 group-hover:opacity-100"
          title="下一张"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* ========================================================
          4. 特价模型专区 (白底卡片 · 细边框 · 品牌紫高亮)
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] p-5 shadow-[0_2px_12px_rgba(36,33,57,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E7F0]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#F0EDFF] text-[#6D4AFF]">
              <Brain className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#242139]">特价模型 · 限时优惠</h2>
              <span className="text-xs text-[#716D83]">官方直签授权 · 算力专线高速直连 · 实时生效</span>
            </div>
          </div>
          <button
            onClick={() => {
              setMarketplaceTab('model');
              setActiveTab('marketplace');
            }}
            className="text-xs font-semibold text-[#6D4AFF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>查看全部模型</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {specialModels.map(model => (
            <div
              key={model.name}
              className="p-4 rounded-xl border border-[#E8E7F0] hover:border-[#6D4AFF] bg-white flex flex-col justify-between transition-all duration-200 group hover:shadow-[0_4px_16px_rgba(109,74,255,0.06)]"
            >
              <div>
                <div className="flex items-center justify-between mb-1 gap-1">
                  <span className="font-bold text-sm text-[#242139] group-hover:text-[#6D4AFF] transition truncate">
                    {model.name}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#FEF3C7] text-[#D97706] border border-[#FDE68A] shrink-0">
                    {model.discount}
                  </span>
                </div>
                
                <div className="text-xs text-[#716D83] mb-2 font-medium">
                  {model.provider}
                </div>

                <p className="text-xs text-[#716D83] line-clamp-2 leading-relaxed min-h-[32px]">
                  {model.desc}
                </p>

                {/* 特性标签（去胶囊化，精简纯净展示） */}
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {model.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-2 py-0.5 rounded bg-[#F7F7FC] border border-[#E8E7F0] text-[#716D83]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-2.5 border-t border-[#E8E7F0] mt-3 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-[#9692A6]">
                  <span>原价</span>
                  <span className="line-through">{model.originalPrice} /M</span>
                </div>

                <div className="flex items-baseline justify-between pt-0.5">
                  <span className="text-xs font-semibold text-[#6D4AFF]">现价</span>
                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-[#6D4AFF]">{model.currentPrice}</span>
                    <span className="text-[10px] text-[#9692A6] font-mono ml-0.5">/1M</span>
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
                  className="w-full mt-2 py-1.5 rounded-lg border border-[#6D4AFF] text-[#6D4AFF] hover:bg-[#6D4AFF] hover:text-white font-medium text-xs transition cursor-pointer flex items-center justify-center gap-1"
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
          5. 我猜你想（场景化解决方案 · 生动封面与视频教程）
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] p-5 shadow-[0_2px_12px_rgba(36,33,57,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E7F0]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#F0EDFF] text-[#6D4AFF]">
              <Sparkles className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#242139]">我猜你想...</h2>
              <span className="text-xs text-[#716D83]">场景化开箱即用 · 4款核心业务直通车与实战视频</span>
            </div>
          </div>
          <span className="text-xs text-[#6D4AFF] font-medium">场景驱动推荐</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {scenarioSolutions.map(s => {
            const IconComp = s.icon;
            return (
              <div
                key={s.id}
                className="rounded-xl border border-[#E8E7F0] hover:border-[#6D4AFF] bg-white overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-2xs hover:shadow-md group"
              >
                {/* 封面图 */}
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
                    className="absolute inset-0 w-full h-full object-cover object-center opacity-90 group-hover:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

                  <div className="relative z-10 flex items-center justify-between">
                    <div className="w-7 h-7 rounded-lg bg-white/95 text-[#242139] shadow-xs flex items-center justify-center">
                      <IconComp className="w-3.5 h-3.5 text-[#6D4AFF]" />
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-white/95 text-[#6D4AFF] font-medium shadow-2xs">
                      {s.badge}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-bold text-sm text-white drop-shadow-xs">
                      {s.title}
                    </h3>
                    <p className="text-[11px] text-white/90 truncate mt-0.5">
                      {s.subtitle}
                    </p>
                  </div>
                </div>

                {/* 描述与操作 */}
                <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                  <div>
                    <p className="text-xs text-[#716D83] leading-relaxed line-clamp-2">
                      {s.desc}
                    </p>
                    <div className="mt-2 text-xs text-[#242139]">
                      <span className="text-[#9692A6]">推荐方案:</span>{' '}
                      <strong className="text-[#6D4AFF] font-medium">{s.recommendAgent}</strong>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8E7F0] mt-3 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        const matched = agents.find(a => a.name.includes(s.recommendAgent.replace('Agent', ''))) || agents[0];
                        if (matched) openAgentDetail(matched);
                        else {
                          setMarketplaceTab('agent');
                          setActiveTab('marketplace');
                        }
                      }}
                      className="flex-1 py-1.5 rounded-lg bg-[#F7F7FC] hover:bg-[#6D4AFF] text-[#242139] hover:text-white border border-[#E8E7F0] hover:border-transparent font-medium text-xs transition cursor-pointer text-center"
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
                      className="px-2.5 py-1.5 rounded-lg bg-[#F0EDFF] hover:bg-[#E0D9FF] text-[#6D4AFF] text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                      title="观看视频教程"
                    >
                      <Play className="w-3 h-3 fill-[#6D4AFF]" />
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
          6. AI 资源榜单 (5个子榜单横向排列：模型、Agent、Skill、数据集、GPU实例)
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] p-5 shadow-[0_2px_12px_rgba(36,33,57,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E7F0]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#F0EDFF] text-[#6D4AFF]">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#242139]">AI 资源榜单</h2>
              <span className="text-xs text-[#716D83]">全要素资源排行 · 发现全网最受欢迎生产力资产</span>
            </div>
          </div>
          <span className="text-xs text-[#6D4AFF] font-medium">全网热度趋势</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-3.5">
          {rankingBoards.map(board => {
            const BoardIcon = board.icon;
            return (
              <div
                key={board.id}
                className="p-3.5 rounded-xl border border-[#E8E7F0] bg-[#F7F7FC]/50 hover:bg-white hover:border-[#6D4AFF] flex flex-col justify-between transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-[#E8E7F0] mb-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-md bg-[#F0EDFF] text-[#6D4AFF] flex items-center justify-center">
                        <BoardIcon className="w-3 h-3" />
                      </div>
                      <h3 className="font-bold text-xs text-[#242139]">{board.title}</h3>
                    </div>
                    <span className="text-[10px] text-[#9692A6]">{board.metricLabel}</span>
                  </div>

                  <div className="space-y-1.5">
                    {board.items.map(item => (
                      <div
                        key={item.rank}
                        onClick={() => board.onItemClick(item)}
                        className="relative p-1.5 rounded-lg hover:bg-[#F0EDFF]/50 transition cursor-pointer flex items-center justify-between gap-1.5 group overflow-hidden"
                      >
                        {/* 刻度背景指示条 */}
                        <div
                          className="absolute left-0 top-0 bottom-0 bg-[#F0EDFF]/40 group-hover:bg-[#F0EDFF]/80 transition-all pointer-events-none"
                          style={{ width: `${item.progress}%` }}
                        />

                        <div className="relative z-10 flex items-center gap-2 min-w-0">
                          <span
                            className={`w-4 h-4 rounded text-[10px] font-mono font-bold flex items-center justify-center shrink-0 ${
                              item.rank === 1
                                ? 'bg-[#6D4AFF] text-white'
                                : item.rank === 2
                                ? 'bg-[#F0EDFF] text-[#6D4AFF]'
                                : item.rank === 3
                                ? 'bg-[#E8E7F0] text-[#242139]'
                                : 'text-[#9692A6]'
                            }`}
                          >
                            {item.rank}
                          </span>
                          <span className="font-medium text-xs text-[#242139] group-hover:text-[#6D4AFF] truncate">
                            {item.name}
                          </span>
                        </div>

                        <span className="relative z-10 text-[11px] font-mono font-semibold text-[#6D4AFF] shrink-0">
                          {item.metric}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2 border-t border-[#E8E7F0] mt-2 text-center">
                  <button
                    onClick={board.onMoreClick}
                    className="text-[11px] text-[#716D83] hover:text-[#6D4AFF] transition cursor-pointer flex items-center justify-center gap-0.5 mx-auto"
                  >
                    <span>查看完整榜单</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================
          7. 热门任务 (独立横向4卡片 · 展示高额悬赏)
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] p-5 shadow-[0_2px_12px_rgba(36,33,57,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E7F0]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#ECFDF5] text-[#16A36A]">
              <ClipboardList className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#242139]">热门任务</h2>
              <span className="text-xs text-[#716D83]">高额赏金揭榜需求 · 企业协同攻关与技术交付</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('tasks')}
            className="text-xs font-semibold text-[#6D4AFF] hover:underline flex items-center gap-0.5 cursor-pointer"
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
              className="p-4 rounded-xl border border-[#E8E7F0] hover:border-[#16A36A] bg-white hover:bg-[#ECFDF5]/10 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs group hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#16A36A]">
                    {task.category}
                  </span>
                  <span className="text-[11px] text-[#9692A6] flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3 text-[#9692A6]" />
                    剩余 {task.remainingDays}
                  </span>
                </div>

                <h3 className="font-bold text-sm text-[#242139] group-hover:text-[#16A36A] transition line-clamp-1">
                  {task.title}
                </h3>

                <p className="text-xs text-[#716D83] mt-1 truncate">
                  发布方: {task.publisher}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8E7F0] mt-3 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-[#9692A6] block">赏金总额</span>
                  <span className="text-base font-bold font-mono text-[#16A36A] leading-none">
                    {task.reward}
                  </span>
                </div>

                <span className="text-xs text-[#16A36A] font-medium group-hover:underline flex items-center gap-0.5">
                  任务详情 <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          8. 热门赛事 (与赛事中心字段严格一致)
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] p-5 shadow-[0_2px_12px_rgba(36,33,57,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E7F0]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#FEF2F2] text-[#E5484D]">
              <Trophy className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#242139]">热门赛事</h2>
              <span className="text-xs text-[#716D83]">挑战顶尖算法 · 争夺官方荣誉勋章与高额现金激励</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('creative')}
            className="text-xs font-semibold text-[#6D4AFF] hover:underline flex items-center gap-0.5 cursor-pointer"
          >
            <span>赛事中心</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3.5">
          {hotCompetitionList.map(comp => (
            <div
              key={comp.trackId}
              onClick={() => {
                if (openCompetitionDetail) openCompetitionDetail(comp.id);
                setActiveTab('creative');
              }}
              className="rounded-xl border border-[#E8E7F0] hover:border-[#6D4AFF] bg-white overflow-hidden transition-all duration-200 group cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between hover:-translate-y-0.5"
            >
              <div className="h-32 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={comp.cover}
                  alt={comp.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                />
                <span className={`absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-[10px] font-semibold border ${comp.statusBadge} bg-white/95 shadow-2xs`}>
                  {comp.status}
                </span>
                <div className="absolute bottom-2.5 left-3 text-white font-bold text-sm truncate max-w-[85%] drop-shadow-md">
                  {comp.title}
                </div>
              </div>

              <div className="p-3.5 bg-white">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[11px] text-[#716D83]">{comp.type}</span>
                  <span className="font-mono font-bold text-[#6D4AFF] text-sm">{comp.prize}</span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-[#E8E7F0] flex items-center justify-between">
                  <span className="text-[11px] text-[#9692A6]">{comp.participants}</span>
                  <span className="text-xs font-medium text-[#6D4AFF] group-hover:underline flex items-center gap-0.5">
                    赛事详情 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          9. 社区热帖 (左侧精选大卡 60% + 右侧热帖榜 40%)
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] p-5 shadow-[0_2px_12px_rgba(36,33,57,0.03)]">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8E7F0]">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#F0EDFF] text-[#6D4AFF]">
              <MessageSquare className="w-4 h-4" />
            </span>
            <div>
              <h2 className="text-base font-bold text-[#242139]">社区热帖</h2>
              <span className="text-xs text-[#716D83]">开发者避坑经验、技术干货与组队前沿讨论</span>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('community')}
            className="text-xs font-semibold text-[#6D4AFF] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>进入社区</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-3.5 items-stretch">
          {/* 左侧 60%：精选热帖大卡 */}
          <div
            onClick={() => {
              if (openPostDetailWithOrigin) {
                openPostDetailWithOrigin('pst_gh_01', 'home');
              }
              setActiveTab('community');
            }}
            className="lg:col-span-7 bg-white rounded-xl border border-[#E8E7F0] hover:border-[#6D4AFF] p-4 transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md group flex flex-col sm:flex-row gap-4 items-stretch justify-between"
          >
            <div className="w-full sm:w-52 shrink-0 aspect-[16/10] sm:aspect-auto sm:h-auto min-h-[140px] rounded-lg overflow-hidden bg-slate-100 relative">
              <img
                src={featuredCommunityPost.cover}
                alt={featuredCommunityPost.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
              />
              <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/95 text-[#6D4AFF] shadow-2xs">
                {featuredCommunityPost.section}
              </span>
            </div>

            <div className="flex-1 flex flex-col justify-between min-w-0 py-0.5">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-[#6D4AFF] font-semibold mb-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>精选推荐</span>
                </div>
                <h3 className="font-bold text-base text-[#242139] group-hover:text-[#6D4AFF] transition leading-snug line-clamp-2">
                  {featuredCommunityPost.title}
                </h3>
                <p className="text-xs text-[#716D83] line-clamp-2 mt-1.5 leading-relaxed">
                  {featuredCommunityPost.summary}
                </p>
              </div>

              <div className="pt-2.5 mt-2 border-t border-[#E8E7F0] flex items-center justify-between text-xs text-[#716D83]">
                <div className="flex items-center gap-1.5">
                  <img
                    src={featuredCommunityPost.avatar}
                    alt={featuredCommunityPost.author}
                    className="w-5 h-5 rounded-full object-cover border border-[#E8E7F0]"
                  />
                  <span className="font-medium text-[#242139] text-xs">{featuredCommunityPost.author}</span>
                </div>
                <div className="flex items-center gap-2.5 font-mono text-xs text-[#9692A6]">
                  <span>💬 {featuredCommunityPost.comments}</span>
                  <span>⭐ {featuredCommunityPost.likes}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧 40%：热帖榜 */}
          <div className="lg:col-span-5 bg-white rounded-xl border border-[#E8E7F0] p-4 flex flex-col justify-between shadow-2xs">
            <div className="flex items-center justify-between pb-2 mb-1 border-b border-[#E8E7F0]">
              <div className="flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-[#F59E0B]" />
                <h3 className="text-sm font-bold text-[#242139]">热帖榜</h3>
              </div>
              <span className="text-[10px] text-[#6D4AFF] font-mono">TOP 5 · 实时热度</span>
            </div>

            <div className="divide-y divide-[#E8E7F0] flex-1 flex flex-col justify-around">
              {hotPostRanking.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (openPostDetailWithOrigin) {
                      openPostDetailWithOrigin('pst_gh_01', 'home');
                    }
                    setActiveTab('community');
                  }}
                  className="py-1.5 px-2 rounded-lg flex items-center justify-between gap-2.5 group cursor-pointer hover:bg-[#F7F7FC] transition"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className={`w-4 h-4 rounded text-[10px] font-bold flex items-center justify-center shrink-0 ${
                        item.rank === 1
                          ? 'bg-[#6D4AFF] text-white'
                          : item.rank === 2
                          ? 'bg-[#F0EDFF] text-[#6D4AFF]'
                          : item.rank === 3
                          ? 'bg-[#E8E7F0] text-[#242139]'
                          : 'text-[#9692A6]'
                      }`}
                    >
                      {item.rank}
                    </span>

                    <div className="min-w-0">
                      <h4 className="text-xs font-medium text-[#242139] group-hover:text-[#6D4AFF] transition truncate max-w-[170px] sm:max-w-[210px]">
                        {item.title}
                      </h4>
                      <div className="flex items-center gap-1 text-[10px] text-[#9692A6] mt-0.5">
                        <span className="text-[#6D4AFF]">{item.section}</span>
                        <span>·</span>
                        <span className="truncate">{item.author}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] text-[#9692A6]">
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
          10. 平台数据与实力背书
         ======================================================== */}
      <div className="bg-white rounded-2xl border border-[#E8E7F0] p-6 shadow-[0_2px_12px_rgba(36,33,57,0.03)] text-center space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-[#E8E7F0]">
          <div className="pt-2 md:pt-0">
            <div className="text-xs text-[#716D83]">注册开发者</div>
            <div className="text-2xl lg:text-3xl font-bold text-[#242139] font-mono mt-1">12,580+</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-xs text-[#716D83]">上架 Agent 智能体</div>
            <div className="text-2xl lg:text-3xl font-bold text-[#6D4AFF] font-mono mt-1">{heroStats.agentCount} 款</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-xs text-[#716D83]">累计完成任务</div>
            <div className="text-2xl lg:text-3xl font-bold text-[#16A36A] font-mono mt-1">1,234 件</div>
          </div>
          <div className="pt-2 md:pt-0">
            <div className="text-xs text-[#716D83]">GPU 纳管平均利用率</div>
            <div className="text-2xl lg:text-3xl font-bold text-[#242139] font-mono mt-1">78.5%</div>
          </div>
        </div>

        {/* 合作伙伴 Logo 墙 */}
        <div className="pt-4 border-t border-[#E8E7F0]">
          <div className="text-xs text-[#9692A6] mb-3">平台生态合作伙伴</div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            {partnerLogos.map(p => (
              <div
                key={p.name}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F7F7FC] border border-[#E8E7F0] text-[#716D83] text-xs font-medium hover:border-[#6D4AFF] hover:text-[#6D4AFF] transition"
                title={p.tag}
              >
                <Building2 className="w-3.5 h-3.5 text-[#9692A6]" />
                <span>{p.name}</span>
                <span className="text-[10px] text-[#9692A6] font-mono hidden sm:inline">[{p.tag}]</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ========================================================
          11. 底部导航链接与版权
         ======================================================== */}
      <div className="pt-4 border-t border-[#E8E7F0] text-center text-xs text-[#9692A6] space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-[#716D83] font-medium">
          <button onClick={() => showToast('关于我们：赛宁·千机 AI 场景驱动与普惠算力平台')} className="hover:text-[#6D4AFF] transition cursor-pointer">关于我们</button>
          <span className="text-[#E8E7F0]">|</span>
          <button onClick={() => showToast('用户服务协议已生效，保障开发者与企业数据资产权益')} className="hover:text-[#6D4AFF] transition cursor-pointer">用户协议</button>
          <span className="text-[#E8E7F0]">|</span>
          <button onClick={() => showToast('全流程遵循数据安全与脱敏审计规范')} className="hover:text-[#6D4AFF] transition cursor-pointer">隐私政策</button>
          <span className="text-[#E8E7F0]">|</span>
          <button onClick={() => showToast('在线工单系统全天候技术专员响应')} className="hover:text-[#6D4AFF] transition cursor-pointer">帮助中心</button>
          <span className="text-[#E8E7F0]">|</span>
          <button onClick={() => showToast('商务合作邮箱：service@qianji-ai.com')} className="hover:text-[#6D4AFF] transition cursor-pointer">联系我们</button>
        </div>
        <p className="text-[11px] text-[#9692A6]">
          © 2026 赛宁·千机 AI 综合应用门户 · 苏ICP备20260812号-1 · 南京市人工智能生态示范工程
        </p>
      </div>

      {/* ========================================================
          弹窗 1: 每日签到弹窗
         ======================================================== */}
      {isCheckInModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl border border-[#E8E7F0]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarIcon weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
                <h3 className="font-bold text-base text-[#242139]">每日签到领积分</h3>
              </div>
              <button
                onClick={() => setIsCheckInModalOpen(false)}
                className="text-[#9692A6] hover:text-[#242139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#F7F7FC] rounded-xl p-4 text-center space-y-1">
              <div className="text-xs text-[#716D83]">已连续签到</div>
              <div className="text-3xl font-bold text-[#6D4AFF] font-mono">{continuousDays} 天</div>
              <div className="text-[11px] text-[#9692A6]">每日签到可获得 5 积分，可无门槛抵扣 API 额度</div>
            </div>

            <button
              onClick={handleCheckIn}
              disabled={hasCheckedInToday}
              className={`w-full py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                hasCheckedInToday
                  ? 'bg-[#F7F7FC] text-[#9692A6] cursor-not-allowed border border-[#E8E7F0]'
                  : 'bg-[#6D4AFF] hover:bg-[#5735D8] text-white shadow-xs'
              }`}
            >
              {hasCheckedInToday ? '今日已签到' : '立即签到领 +5 积分'}
            </button>
          </div>
        </div>
      )}

      {/* ========================================================
          弹窗 2: 邀请好友返利弹窗
         ======================================================== */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-[#E8E7F0]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-[#6D4AFF]" />
                <h3 className="font-bold text-base text-[#242139]">邀请开发者好友</h3>
              </div>
              <button
                onClick={() => setIsInviteModalOpen(false)}
                className="text-[#9692A6] hover:text-[#242139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-[#F0EDFF] rounded-xl p-4 space-y-1 text-center">
              <div className="text-xs text-[#716D83]">每成功邀请 1 位好友注册</div>
              <div className="text-xl font-bold text-[#6D4AFF]">双方各得 ¥20 抵扣金 + 100 积分</div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-[#716D83] block mb-1">您的专属邀请码</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="QIANJI-VIP-888"
                    className="flex-1 bg-[#F7F7FC] border border-[#E8E7F0] rounded-lg px-3 py-2 text-xs font-mono font-bold text-[#242139]"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('QIANJI-VIP-888');
                      setInviteCopied(true);
                      showToast('邀请码已复制到剪贴板！');
                      setTimeout(() => setInviteCopied(false), 2000);
                    }}
                    className="px-3 py-2 rounded-lg bg-[#6D4AFF] text-white text-xs font-medium cursor-pointer"
                  >
                    {inviteCopied ? '已复制' : '复制'}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs text-[#716D83] block mb-1">专属邀请推广链接</label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value="https://qianji.ai/register?invite=QIANJI-VIP-888"
                    className="flex-1 bg-[#F7F7FC] border border-[#E8E7F0] rounded-lg px-3 py-2 text-xs text-[#716D83] truncate"
                  />
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText('https://qianji.ai/register?invite=QIANJI-VIP-888');
                      showToast('邀请链接已复制到剪贴板！');
                    }}
                    className="px-3 py-2 rounded-lg bg-white border border-[#E8E7F0] text-[#242139] hover:text-[#6D4AFF] text-xs font-medium cursor-pointer"
                  >
                    复制链接
                  </button>
                </div>
              </div>
            </div>

            <div className="text-[11px] text-[#9692A6] leading-relaxed pt-2">
              提示：被邀请人完成手机号验证并注册成功后，奖励额度将秒级自动充入您的千机平台个人账户。
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          弹窗 3: 沉浸视频实战教程播放器
         ======================================================== */}
      {activeVideoModal && activeVideoModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-[#E8E7F0] space-y-4 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <VideoCamera weight="duotone" className="w-5 h-5 text-[#6D4AFF]" />
                <h3 className="font-bold text-base text-[#242139]">{activeVideoModal.title}</h3>
              </div>
              <button
                onClick={() => setActiveVideoModal(null)}
                className="text-[#9692A6] hover:text-[#242139] cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 模拟播放屏幕 */}
            <div className="aspect-video bg-slate-950 rounded-xl relative flex items-center justify-center overflow-hidden group">
              <div className="text-center text-white space-y-2">
                <button
                  onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                  className="w-12 h-12 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md flex items-center justify-center mx-auto transition cursor-pointer"
                >
                  {isVideoPlaying ? (
                    <Pause className="w-6 h-6 text-white fill-white" />
                  ) : (
                    <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                  )}
                </button>
                <div className="text-xs text-slate-300 font-medium">
                  {activeVideoModal.agentName} 实操演示 ({activeVideoModal.duration})
                </div>
              </div>

              {/* 播放器控制条 */}
              <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-2">
                  <button onClick={() => setIsVideoPlaying(!isVideoPlaying)} className="cursor-pointer">
                    {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </button>
                  <button onClick={() => setIsMuted(!isMuted)} className="cursor-pointer">
                    {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </button>
                  <span className="font-mono text-[10px]">00:45 / 03:00</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPlaybackSpeed(playbackSpeed === 1.0 ? 1.5 : playbackSpeed === 1.5 ? 2.0 : 1.0)}
                    className="px-1.5 py-0.5 rounded bg-white/20 text-[10px] font-mono cursor-pointer"
                  >
                    {playbackSpeed}x
                  </button>
                </div>
              </div>
            </div>

            <div className="text-xs text-[#716D83] leading-relaxed">
              {activeVideoModal.description}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
