import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
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
    computeSpecs,
    openAgentDetail,
    openModelDetail,
    openDatasetDetail,
    openSkillDetail,
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

  // 快捷入口 6 个图标卡片配置（明亮、生动彩色图片，绝不发黑！）
  const quickActions = [
    {
      icon: '🤖',
      name: '使用Agent',
      desc: '356 款场景智能体',
      subTag: '开箱即用',
      iconBg: 'bg-blue-50 text-blue-600 border-blue-200',
      tintBg: 'from-blue-50/70 via-white to-white',
      accentColor: 'text-blue-600',
      bgImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80',
      action: () => {
        setMarketplaceTab('agent');
        setActiveTab('marketplace');
      }
    },
    {
      icon: '🧠',
      name: '找模型',
      desc: '主流开源与商业模型',
      subTag: '64+ 款基座',
      iconBg: 'bg-indigo-50 text-indigo-600 border-indigo-200',
      tintBg: 'from-indigo-50/70 via-white to-white',
      accentColor: 'text-indigo-600',
      bgImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=500&auto=format&fit=crop&q=80',
      action: () => {
        setMarketplaceTab('model');
        setActiveTab('marketplace');
      }
    },
    {
      icon: '⚡',
      name: '启动算力',
      desc: 'RTX 4090 / A100 秒拉起',
      subTag: '按需租赁',
      iconBg: 'bg-emerald-50 text-emerald-600 border-emerald-200',
      tintBg: 'from-emerald-50/70 via-white to-white',
      accentColor: 'text-emerald-600',
      bgImage: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500&auto=format&fit=crop&q=80',
      action: () => {
        setActiveTab('compute');
      }
    },
    {
      icon: '📋',
      name: '发布任务',
      desc: '揭榜挂帅众包协同',
      subTag: '万企协同',
      iconBg: 'bg-purple-50 text-purple-600 border-purple-200',
      tintBg: 'from-purple-50/70 via-white to-white',
      accentColor: 'text-purple-600',
      bgImage: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=500&auto=format&fit=crop&q=80',
      action: () => {
        setPublishTaskModalOpen(true);
      }
    },
    {
      icon: '🏆',
      name: '看赛事',
      desc: '高额奖金巅峰对抗',
      subTag: '¥120K+ 奖池',
      iconBg: 'bg-amber-50 text-amber-600 border-amber-200',
      tintBg: 'from-amber-50/70 via-white to-white',
      accentColor: 'text-amber-600',
      bgImage: 'https://images.unsplash.com/photo-1569517282132-25d22f4573e6?w=500&auto=format&fit=crop&q=80',
      action: () => {
        setActiveTab('creative');
      }
    },
    {
      icon: '✅',
      name: '每日签到',
      desc: '领积分抵扣调用额度',
      subTag: '每日 +5 积分',
      iconBg: 'bg-rose-50 text-rose-600 border-rose-200',
      tintBg: 'from-rose-50/70 via-white to-white',
      accentColor: 'text-rose-600',
      bgImage: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=500&auto=format&fit=crop&q=80',
      action: () => {
        setIsCheckInModalOpen(true);
      }
    }
  ];

  // 特价模型专区真实模型数据（浅色明亮科技质感，原价划线 + 现价 + 折扣标签）
  const specialModels = [
    {
      name: 'DeepSeek-V3',
      provider: 'DeepSeek 深度求索',
      desc: '671B MoE 全能推理大模型，代码编写与长文本推导领先，中文理解极其卓越',
      originalPrice: '¥12 / 百万Token',
      currentPrice: '¥9 / 百万Token',
      discount: '7.5折',
      tags: ['671B MoE', '128K 上下文', '高性价比'],
      searchKeyword: 'DeepSeek',
      bgPattern: 'from-blue-50/80 via-white to-slate-50/50'
    },
    {
      name: '通义千问 Qwen2.5',
      provider: '阿里云百炼',
      desc: '多语言编程与复杂指令遵循标杆，企业系统自动化与多工具插件调用首选',
      originalPrice: '¥8 / 百万Token',
      currentPrice: '¥6 / 百万Token',
      discount: '7.5折',
      tags: ['指令对齐', '工具调用', '企业商用'],
      searchKeyword: 'Qwen',
      bgPattern: 'from-sky-50/80 via-white to-slate-50/50'
    },
    {
      name: '文心一言 4.0',
      provider: '百度智能云',
      desc: '理解、生成、逻辑与记忆四大核心能力大幅跃升，国内政企知识库高匹配度',
      originalPrice: '¥10 / 百万Token',
      currentPrice: '¥7 / 百万Token',
      discount: '7折',
      tags: ['知识检索', '政企业务', '逻辑推演'],
      searchKeyword: 'ERNIE',
      bgPattern: 'from-purple-50/80 via-white to-slate-50/50'
    },
    {
      name: 'GLM-4',
      provider: '智谱 AI',
      desc: '新一代基座大模型，毫秒级低延迟极速响应，外挂知识库检索与全流程调优出众',
      originalPrice: '¥6 / 百万Token',
      currentPrice: '¥4.5 / 百万Token',
      discount: '7.5折',
      tags: ['极速响应', '智能体协同', '长文档分析'],
      searchKeyword: 'GLM',
      bgPattern: 'from-emerald-50/80 via-white to-slate-50/50'
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

  // 11. 热门赛事（横向 3 个赛事卡片，彩色明亮封面）
  const hotCompetitionList = [
    {
      id: 'c1',
      title: '2026 AI 创新应用巅峰挑战赛',
      type: 'AI产品创新 · 企业级落地',
      status: '进行中',
      prize: '¥50,000',
      participants: '1,420 人已参赛',
      cover: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=600&auto=format&fit=crop&q=80',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    },
    {
      id: 'c2',
      title: '全国行业大模型数据科学挑战赛',
      type: '多模态数据挖掘 · 评测建模',
      status: '即将开赛',
      prize: '¥30,000',
      participants: '890 人已预约',
      cover: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80',
      statusBadge: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    {
      id: 'c3',
      title: 'AI 安全与对抗攻防实战竞技赛',
      type: 'Prompt注入防御 · 越狱检测',
      status: '进行中',
      prize: '¥40,000',
      participants: '650 人已参赛',
      cover: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=600&auto=format&fit=crop&q=80',
      statusBadge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }
  ];

  // 12. 社区热帖（横向 4 个卡片，卡片带鲜艳彩色封面图）
  const communityPosts = [
    {
      id: 'post-1',
      title: 'DeepSeek-V3 / R1 满血版私有化部署避坑与首字加速指引',
      section: '干货分享',
      sectionBadge: 'bg-blue-50 text-blue-700 border-blue-200',
      author: '技术专家 · 林峰',
      time: '2小时前',
      comments: 28,
      likes: 142,
      cover: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'post-2',
      title: '构建高质量企业级 RAG：向量切分与混合重排的实践思考',
      section: '架构探索',
      sectionBadge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      author: '架构师 · 李晨',
      time: '4小时前',
      comments: 19,
      likes: 98,
      cover: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'post-3',
      title: '从0打造电商超清产品海报：ComfyUI 工业级工作流实战拆解',
      section: '创意视觉',
      sectionBadge: 'bg-purple-50 text-purple-700 border-purple-200',
      author: '设计导师 · 王薇',
      time: '昨天',
      comments: 36,
      likes: 215,
      cover: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=500&auto=format&fit=crop&q=80'
    },
    {
      id: 'post-4',
      title: '揭榜挂帅金融知识图谱抽取任务经验复盘：组队协同心得',
      section: '同行交流',
      sectionBadge: 'bg-amber-50 text-amber-800 border-amber-200',
      author: '算法极客 · 赵宇',
      time: '2天前',
      comments: 15,
      likes: 67,
      cover: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=500&auto=format&fit=crop&q=80'
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
      
      {/* 科技感浅色背景纹理与柔和微光晕 */}
      <div className="fixed inset-0 pointer-events-none -z-10 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:24px_24px] opacity-60" />
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-purple-100/35 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-48 left-1/4 w-[450px] h-[450px] bg-indigo-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* ========================================================
          1. Hero 区 (艺术感浅紫色渐变主题 · 标语 + 创意交互组件 + 平台核心能力)
         ======================================================== */}
      <div className="relative rounded-3xl bg-gradient-to-br from-purple-50/90 via-violet-50/50 via-indigo-50/30 to-white/95 backdrop-blur-2xl border border-purple-200/70 p-8 sm:p-12 shadow-[0_12px_44px_-10px_rgba(168,85,247,0.08),0_2px_12px_rgba(0,0,0,0.02)] overflow-hidden">
        {/* 背景艺术极光柔光与矢量动态微网格 */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-[720px] h-[360px] bg-gradient-to-r from-purple-300/30 via-violet-200/25 to-fuchsia-200/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-purple-200/25 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-sky-200/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(#c4b5fd_1px,transparent_1px)] [background-size:24px_24px] opacity-35 pointer-events-none" />

        {/* 优雅装饰性背景流动曲线 */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="purpleSplineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#A855F7" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
          </defs>
          <path d="M-100,120 C200,60 400,220 800,100 C1200,-20 1400,180 1800,90" fill="none" stroke="url(#purpleSplineGrad)" strokeWidth="2" strokeDasharray="6 6" />
        </svg>

        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl mx-auto pt-2 sm:pt-4">
          {/* 艺术感主标题（浅紫与深青渐变） */}
          <h1 className="text-3xl sm:text-5xl lg:text-[48px] font-black text-slate-900 tracking-tight leading-[1.2]">
            汇聚 AI 之力，成就
            <span className="relative inline-block ml-1.5 sm:ml-2.5">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 drop-shadow-xs">
                万千可能
              </span>
              {/* 艺术感浅紫色柔光弧线 */}
              <svg className="absolute -bottom-2.5 left-0 w-full h-3.5 text-purple-400/50" viewBox="0 0 180 12" fill="none">
                <path d="M2.5 9C45 2.5 135 2.5 177.5 9" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            </span>
          </h1>

          {/* 副标题 */}
          <p className="text-lg sm:text-xl text-slate-700 font-bold mt-4 tracking-tight">
            从模型到 Agent，一站式搞定
          </p>
          <p className="text-sm font-semibold text-purple-700 mt-2 tracking-wide flex items-center justify-center gap-1.5">
            <span>今日已有</span>
            <strong className="font-mono font-black text-base text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600">1,283</strong>
            <span>人在此找到AI方案</span>
          </p>

          {/* 平台四大生产力核心引擎状态微条（浅紫主题玻璃态） */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full mt-7 pt-6 border-t border-purple-100/70">
            <div
              onClick={() => {
                setMarketplaceTab('model');
                setActiveTab('marketplace');
              }}
              className="p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-purple-100/90 hover:border-purple-300 flex items-center gap-3 text-left shadow-2xs hover:shadow-md hover:shadow-purple-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-600 border border-purple-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-purple-600 font-semibold flex items-center gap-1">
                  <span>模型广场</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xs font-black text-slate-800 truncate font-mono mt-0.5">64+ 款主流架构</div>
                <div className="text-[10px] text-slate-400 truncate">MoE · 长文 · 视觉全覆</div>
              </div>
            </div>

            <div
              onClick={() => {
                setMarketplaceTab('agent');
                setActiveTab('marketplace');
              }}
              className="p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-purple-100/90 hover:border-purple-300 flex items-center gap-3 text-left shadow-2xs hover:shadow-md hover:shadow-indigo-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-100/70 text-indigo-600 border border-indigo-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-indigo-600 font-semibold flex items-center gap-1">
                  <span>场景智能体</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                </div>
                <div className="text-xs font-black text-slate-800 truncate font-mono mt-0.5">356 款即用方案</div>
                <div className="text-[10px] text-slate-400 truncate">开箱即用 · 垂直行业赋能</div>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('compute')}
              className="p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-purple-100/90 hover:border-purple-300 flex items-center gap-3 text-left shadow-2xs hover:shadow-md hover:shadow-fuchsia-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-fuchsia-100/70 text-fuchsia-600 border border-fuchsia-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Cpu className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-fuchsia-600 font-semibold flex items-center gap-1">
                  <span>纳管算力池</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xs font-black text-slate-800 truncate font-mono mt-0.5">1,200 卡异构算力</div>
                <div className="text-[10px] text-slate-400 truncate">4090 / A100 秒级拉起</div>
              </div>
            </div>

            <div
              onClick={() => setActiveTab('compute')}
              className="p-3.5 rounded-2xl bg-white/80 hover:bg-white border border-purple-100/90 hover:border-purple-300 flex items-center gap-3 text-left shadow-2xs hover:shadow-md hover:shadow-sky-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100/70 text-sky-600 border border-sky-200/60 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] text-sky-600 font-semibold flex items-center gap-1">
                  <span>推理专线时延</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                <div className="text-xs font-black text-slate-800 truncate font-mono mt-0.5">38ms 超快响应</div>
                <div className="text-[10px] text-slate-400 truncate">全网专线加速 · 99.99%可用</div>
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
          3. 快捷入口 (6个卡片 · 宽约160px，高约108px · 亮色明快背景 + 彩色高清水印图，绝不发黑！)
         ======================================================== */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {quickActions.map((item, idx) => (
          <button
            key={idx}
            onClick={item.action}
            className={`relative h-[108px] rounded-2xl overflow-hidden p-3.5 flex flex-col justify-between text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg cursor-pointer group select-none border border-slate-200/90 bg-gradient-to-br ${item.tintBg} shadow-xs hover:border-slate-300`}
          >
            {/* 右侧生动清晰的彩色背景图，带平滑渐变过度，绝不黑化 */}
            <div className="absolute right-0 top-0 bottom-0 w-[55%] overflow-hidden pointer-events-none">
              <img
                src={item.bgImage}
                alt={item.name}
                className="w-full h-full object-cover object-center opacity-85 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
              />
              {/* 明亮浅色横向渐变平滑融入白色背景，保证左侧深色文字极高对比 */}
              <div className="absolute inset-0 bg-gradient-to-r from-white via-white/70 to-transparent" />
            </div>

            {/* 卡片顶栏 */}
            <div className="relative z-10 flex items-center justify-between">
              <span className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg border ${item.iconBg} shadow-2xs`}>
                {item.icon}
              </span>
              <span className="text-[10px] font-mono font-medium text-slate-600 bg-white/90 px-2 py-0.5 rounded-full border border-slate-200/70 shadow-2xs">
                {item.subTag}
              </span>
            </div>

            {/* 卡片底栏：清晰深色文字 */}
            <div className="relative z-10">
              <div className="font-black text-sm text-slate-900 group-hover:text-blue-600 transition-colors flex items-center justify-between">
                <span>{item.name}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition" />
              </div>
              <div className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
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
            className="h-full bg-blue-600 transition-all duration-75"
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
                  i === bannerIndex ? 'w-4 bg-blue-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'
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
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60">
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
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>查看全部模型</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {specialModels.map(model => (
            <div
              key={model.name}
              className={`p-4 rounded-xl border border-slate-200/80 hover:border-blue-400 bg-gradient-to-b ${model.bgPattern} flex flex-col justify-between transition-all duration-200 group shadow-2xs hover:shadow-md hover:-translate-y-0.5`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-black text-sm text-slate-900 group-hover:text-blue-600 transition">
                    {model.name}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 text-[10px] font-bold">
                    {model.discount}
                  </span>
                </div>
                
                <div className="text-[11px] text-slate-500 mb-2 font-medium">
                  {model.provider}
                </div>

                <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed">
                  {model.desc}
                </p>

                {/* 特性标签 */}
                <div className="flex flex-wrap gap-1 mt-2.5">
                  {model.tags.map(tag => (
                    <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white border border-slate-200/80 text-slate-600 font-mono shadow-2xs">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/60 mt-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-xs text-slate-400 line-through font-mono">
                    {model.originalPrice}
                  </span>
                  <span className="text-sm font-black font-mono text-rose-600">
                    {model.currentPrice}
                  </span>
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
                  className="w-full mt-2.5 py-1.5 rounded-lg bg-white hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-200 hover:border-blue-600 font-bold text-xs transition cursor-pointer flex items-center justify-center gap-1 shadow-2xs"
                >
                  <span>立即调用 / 调试</span>
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
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200/60">
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
          <span className="text-xs text-indigo-600 font-mono font-medium">
            场景驱动推荐
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {scenarioSolutions.map(s => {
            const IconComp = s.icon;
            return (
              <div
                key={s.id}
                className="rounded-xl border border-slate-200/80 hover:border-indigo-400 bg-white overflow-hidden flex flex-col justify-between transition-all duration-300 shadow-2xs hover:shadow-md hover:-translate-y-0.5 group"
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
                      <IconComp className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border shadow-2xs font-semibold ${s.badgeColor} bg-white/95`}>
                      {s.badge}
                    </span>
                  </div>

                  <div className="relative z-10">
                    <h3 className="font-black text-sm tracking-wide text-white drop-shadow-sm group-hover:text-blue-200 transition-colors">
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
                      <strong className="text-indigo-600 font-bold">{s.recommendAgent}</strong>
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
                      className="flex-1 py-1.5 rounded-lg bg-slate-50 hover:bg-indigo-600 text-slate-700 hover:text-white border border-slate-200/80 hover:border-indigo-600 font-bold text-xs transition cursor-pointer text-center shadow-2xs"
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
                      className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-2xs"
                      title="观看视频教程"
                    >
                      <Play className="w-3 h-3 fill-indigo-600" />
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
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-50 text-amber-600 border border-amber-200/60">
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
          <span className="text-xs text-amber-600 font-mono font-medium">
            全要素资源榜
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3.5 mt-3.5">
          {rankingBoards.map(board => {
            const BoardIcon = board.icon;
            return (
              <div
                key={board.id}
                className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-indigo-300 flex flex-col justify-between transition-all duration-200 shadow-2xs"
              >
                <div>
                  {/* 子榜单标题 */}
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200/70 mb-2">
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
                          className="relative p-1.5 rounded-lg hover:bg-blue-50/80 transition cursor-pointer flex items-center justify-between gap-1.5 group overflow-hidden"
                        >
                          {/* 背景刻度指示条 */}
                          <div
                            className="absolute left-0 top-0 bottom-0 bg-blue-50/50 group-hover:bg-blue-100/60 transition-all pointer-events-none"
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
                              <span className="font-bold text-xs text-slate-800 group-hover:text-blue-600 truncate block">
                                {item.name}
                              </span>
                            </div>
                          </div>

                          <span className="relative z-10 text-[11px] font-mono font-bold text-blue-600 shrink-0">
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
                <div className="pt-2 border-t border-slate-200/70 mt-2 text-center">
                  <button
                    onClick={board.onMoreClick}
                    className="text-[11px] font-semibold text-slate-500 hover:text-blue-600 transition cursor-pointer flex items-center justify-center gap-0.5 mx-auto"
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
          9. 热门任务 (独立一栏 · 横向4个任务卡片 · 展示高赏金需求)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
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
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>任务大厅</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {hotTaskList.map(task => (
            <div
              key={task.id}
              onClick={() => setActiveTab('tasks')}
              className="p-4 rounded-xl border border-slate-200/80 hover:border-emerald-400 bg-white hover:bg-slate-50/50 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-sm group hover:-translate-y-0.5"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-200">
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

                <span className="text-xs text-blue-600 font-bold group-hover:underline flex items-center gap-0.5">
                  立即投标 ({task.bids}) <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          10. 热门赛事 (独立一栏 · 横向3个赛事卡片 · 鲜艳明亮全彩封面)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
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
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>赛事中心</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3.5">
          {hotCompetitionList.map(comp => (
            <div
              key={comp.id}
              onClick={() => setActiveTab('creative')}
              className="rounded-xl border border-slate-200/80 hover:border-amber-400 bg-white overflow-hidden transition-all duration-200 group cursor-pointer shadow-2xs hover:shadow-md flex flex-col justify-between hover:-translate-y-0.5"
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
                  <span className="text-[11px] text-slate-500">{comp.type}</span>
                  <span className="font-mono font-black text-rose-600 text-sm">{comp.prize}</span>
                </div>
                <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">{comp.participants}</span>
                  <span className="text-xs font-bold text-blue-600 group-hover:underline flex items-center gap-0.5">
                    查看详情 <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          11. 社区热帖 (横向4个卡片 · 全彩封面，明亮通透)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-50 text-purple-600 border border-purple-200/60">
              <BookOpen className="w-4 h-4" />
            </span>
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
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
          >
            <span>进入社区</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-3.5">
          {communityPosts.map(p => (
            <div
              key={p.id}
              onClick={() => setActiveTab('community')}
              className="rounded-xl border border-slate-200/80 hover:border-purple-400 bg-white overflow-hidden flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-2xs hover:shadow-md group hover:-translate-y-0.5"
            >
              <div className="h-28 w-full relative overflow-hidden bg-slate-100">
                <img
                  src={p.cover}
                  alt={p.title}
                  className="w-full h-full object-cover opacity-95 group-hover:scale-105 transition-all duration-500"
                />
                <span className={`absolute top-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold border ${p.sectionBadge} bg-white/95 backdrop-blur-xs shadow-2xs`}>
                  {p.section}
                </span>
              </div>

              <div className="p-3.5 flex flex-col justify-between flex-1">
                <h3 className="font-bold text-xs text-slate-900 group-hover:text-purple-600 transition line-clamp-2 leading-relaxed">
                  {p.title}
                </h3>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-mono">
                  <span className="font-sans font-medium text-slate-600 truncate max-w-[100px]">{p.author}</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <MessageSquare className="w-3 h-3" />
                    {p.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================
          12. 平台数据 + 合作伙伴 (数据 + Logo墙)
         ======================================================== */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/90 p-5 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] text-center space-y-4">
        {/* 实时平台数据证明 */}
        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs sm:text-sm font-semibold text-slate-700">
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4 text-blue-600" />
            <span><strong className="font-mono text-blue-700 font-bold">12,580</strong> 注册用户</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Bot className="w-4 h-4 text-indigo-600" />
            <span><strong className="font-mono text-indigo-700 font-bold">356</strong> 个Agent</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <ClipboardList className="w-4 h-4 text-emerald-600" />
            <span><strong className="font-mono text-emerald-700 font-bold">1,234</strong> 任务完成</span>
          </div>
          <span className="text-slate-300">·</span>
          <div className="flex items-center gap-1.5">
            <Cpu className="w-4 h-4 text-amber-600" />
            <span><strong className="font-mono text-amber-700 font-bold">78.5%</strong> GPU利用率</span>
          </div>
        </div>

        {/* 合作伙伴 Logo 墙 (清爽明亮浅灰色) */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {partnerLogos.map(p => (
            <div
              key={p.name}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-50 border border-slate-200/70 text-slate-600 hover:text-slate-900 hover:border-slate-300 transition"
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
