import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { AdminMenuKey, TaskItem } from '../../types';
import { AdminTaskEditModal } from './AdminTaskEditModal';
import { ComputeSpecAdminView } from './compute/ComputeSpecAdminView';
import { ComputeImageAdminView } from './compute/ComputeImageAdminView';
import { ComputePoolAdminView } from './compute/ComputePoolAdminView';
import { ComputeOrderAdminView } from './compute/ComputeOrderAdminView';
import { ComputeInstanceMonitorView } from './compute/ComputeInstanceMonitorView';
import { ComputeStatsAdminView } from './compute/ComputeStatsAdminView';
import { ComputeSettlementAdminView } from './compute/ComputeSettlementAdminView';
import { AgentAdminViews } from './agent/AgentAdminViews';
import { DatasetAdminViews } from './dataset/DatasetAdminViews';
import { SkillAdminView } from './skill/SkillAdminView';
import { CommunityAdminViews } from './community/CommunityAdminViews';
import { OperationsDashboard } from './operations/OperationsDashboard';
import {
  ModelListAdminView,
  ModelCallsAdminView,
  ModelStatsAdminView
} from './model/ModelAdminViews';
import {
  LayoutDashboard,
  Store,
  Briefcase,
  Cpu,
  Trophy,
  Settings,
  ShieldCheck,
  CheckCircle2,
  Activity,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  Search,
  Sparkles,
  Server,
  Users,
  Bell,
  RefreshCw,
  Clock,
  Filter,
  Eye,
  SlidersHorizontal,
  FileCheck,
  FileText,
  MessageSquare,
  ShieldAlert,
  Database,
  Tag,
  Layers,
  Terminal,
  Zap,
  HelpCircle,
  TrendingUp,
  AlertCircle,
  Check,
  Coins,
  Receipt,
  Bot,
  History,
  Puzzle,
  Edit3,
  Trash2,
  AlertTriangle
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { 
    activeAdminMenu, 
    setActiveAdminMenu, 
    exitAdminMode, 
    user,
    showToast,
    tasks,
    agents,
    models,
    competitions,
    gpuInstances,
    computeSpecs
  } = useApp();

  // Task sub-menu collapse state
  const [taskMenuExpanded, setTaskMenuExpanded] = useState<boolean>(true);
  // Compute sub-menu collapse state
  const [computeMenuExpanded, setComputeMenuExpanded] = useState<boolean>(true);
  // Agent sub-menu collapse state
  const [agentMenuExpanded, setAgentMenuExpanded] = useState<boolean>(true);
  // Dataset sub-menu collapse state
  const [datasetMenuExpanded, setDatasetMenuExpanded] = useState<boolean>(true);
  // Model sub-menu collapse state
  const [modelMenuExpanded, setModelMenuExpanded] = useState<boolean>(true);
  // Skill sub-menu collapse state
  const [skillMenuExpanded, setSkillMenuExpanded] = useState<boolean>(true);

  // Search keyword inside admin view
  const [adminSearch, setAdminSearch] = useState('');

  const handleMenuClick = (key: AdminMenuKey) => {
    setActiveAdminMenu(key);
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const isTaskSubMenu = activeAdminMenu === 'publish_audit' || activeAdminMenu === 'task_monitor';
  const isComputeSubMenu = activeAdminMenu.startsWith('compute_');
  const isAgentSubMenu = ['agent_list', 'agent_calls', 'agent_stats'].includes(activeAdminMenu);
  const isDatasetSubMenu = ['dataset_list', 'dataset_audit', 'dataset_stats'].includes(activeAdminMenu);
  const isModelSubMenu = ['model_list', 'model_calls', 'model_stats'].includes(activeAdminMenu);
  const isSkillSubMenu = ['skill_list', 'skill_audit'].includes(activeAdminMenu);

  // Navigation Items
  const mainNav = [
    {
      id: 'operations' as AdminMenuKey,
      label: '运营中心',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'agent_admin_group',
      label: 'Agent管理',
      icon: <Bot className="w-4 h-4" />,
      isGroup: true,
      children: [
        {
          id: 'agent_list' as AdminMenuKey,
          label: 'Agent管理',
          icon: <Bot className="w-3.5 h-3.5" />
        },
        {
          id: 'agent_calls' as AdminMenuKey,
          label: '调用记录',
          icon: <History className="w-3.5 h-3.5" />
        },
        {
          id: 'agent_stats' as AdminMenuKey,
          label: '用量统计',
          icon: <Activity className="w-3.5 h-3.5" />
        }
      ]
    },
    {
      id: 'dataset_admin_group',
      label: '数据集管理',
      icon: <Database className="w-4 h-4" />,
      isGroup: true,
      children: [
        {
          id: 'dataset_list' as AdminMenuKey,
          label: '数据集管理',
          icon: <Database className="w-3.5 h-3.5" />
        },
        {
          id: 'dataset_audit' as AdminMenuKey,
          label: '数据集审核',
          icon: <FileCheck className="w-3.5 h-3.5" />
        },
        {
          id: 'dataset_stats' as AdminMenuKey,
          label: '数据集使用统计',
          icon: <Activity className="w-3.5 h-3.5" />
        }
      ]
    },
    {
      id: 'model_admin_group',
      label: '模型管理',
      icon: <Cpu className="w-4 h-4" />,
      isGroup: true,
      children: [
        {
          id: 'model_list' as AdminMenuKey,
          label: '模型管理',
          icon: <Cpu className="w-3.5 h-3.5" />
        },
        {
          id: 'model_calls' as AdminMenuKey,
          label: '模型调用记录',
          icon: <Clock className="w-3.5 h-3.5" />
        },
        {
          id: 'model_stats' as AdminMenuKey,
          label: '模型使用统计',
          icon: <TrendingUp className="w-3.5 h-3.5" />
        }
      ]
    },
    {
      id: 'skill_admin_group',
      label: 'Skill管理',
      icon: <Puzzle className="w-4 h-4" />,
      isGroup: true,
      children: [
        {
          id: 'skill_list' as AdminMenuKey,
          label: 'Skill管理',
          icon: <Puzzle className="w-3.5 h-3.5" />
        },
        {
          id: 'skill_audit' as AdminMenuKey,
          label: 'Skill审核',
          icon: <FileCheck className="w-3.5 h-3.5" />
        }
      ]
    },
    {
      id: 'task_admin_group',
      label: '任务管理',
      icon: <Briefcase className="w-4 h-4" />,
      isGroup: true,
      children: [
        {
          id: 'publish_audit' as AdminMenuKey,
          label: '发布审核',
          icon: <FileCheck className="w-3.5 h-3.5" />
        },
        {
          id: 'task_monitor' as AdminMenuKey,
          label: '任务监控',
          icon: <Activity className="w-3.5 h-3.5" />
        }
      ]
    },
    {
      id: 'community_admin_group',
      label: '社区管理',
      icon: <Users className="w-4 h-4" />,
      isGroup: true,
      children: [
        {
          id: 'community_audit' as AdminMenuKey,
          label: '发帖审核',
          icon: <FileCheck className="w-3.5 h-3.5" />
        },
        {
          id: 'community_post' as AdminMenuKey,
          label: '帖子管理',
          icon: <FileText className="w-3.5 h-3.5" />
        },
        {
          id: 'community_comment' as AdminMenuKey,
          label: '评论管理',
          icon: <MessageSquare className="w-3.5 h-3.5" />
        },
        {
          id: 'community_stats' as AdminMenuKey,
          label: '数据统计',
          icon: <TrendingUp className="w-3.5 h-3.5" />
        }
      ]
    },
    {
      id: 'compute_admin_group',
      label: '算力管理',
      icon: <Cpu className="w-4 h-4" />,
      isGroup: true,
      children: [
        {
          id: 'compute_spec' as AdminMenuKey,
          label: '规格管理',
          icon: <Cpu className="w-3.5 h-3.5" />
        },
        {
          id: 'compute_image' as AdminMenuKey,
          label: '镜像管理',
          icon: <Terminal className="w-3.5 h-3.5" />
        },
        {
          id: 'compute_pool' as AdminMenuKey,
          label: '资源池管理',
          icon: <Server className="w-3.5 h-3.5" />
        },
        {
          id: 'compute_order' as AdminMenuKey,
          label: '实例订单管理',
          icon: <Receipt className="w-3.5 h-3.5" />
        },
        {
          id: 'compute_instance' as AdminMenuKey,
          label: '运行实例监控',
          icon: <Activity className="w-3.5 h-3.5" />
        },
        {
          id: 'compute_stat' as AdminMenuKey,
          label: '资源使用统计',
          icon: <TrendingUp className="w-3.5 h-3.5" />
        },
        {
          id: 'compute_settlement' as AdminMenuKey,
          label: '对账结算',
          icon: <Coins className="w-3.5 h-3.5" />
        }
      ]
    },
    {
      id: 'competition_admin' as AdminMenuKey,
      label: '赛事管理',
      icon: <Trophy className="w-4 h-4" />
    },
    {
      id: 'system_admin' as AdminMenuKey,
      label: '系统管理',
      icon: <Settings className="w-4 h-4" />
    }
  ];

  // Helper to get page title and breadcrumb
  const getPageMeta = () => {
    switch (activeAdminMenu) {
      case 'operations':
        return {
          title: '运营中心大屏',
          subtitle: '平台核心运营数据全景指挥看板与全局健康度监控',
          category: '全局概览',
          crumb: ['后台管理', '运营中心']
        };
      case 'agent_list':
        return {
          title: 'Agent 列表及配置',
          subtitle: '发布与维护全平台智能体、设置上架属性、配置接口网关与计费单价套餐',
          category: '智能体管理',
          crumb: ['后台管理', 'Agent管理', '列表及配置']
        };
      case 'agent_calls':
        return {
          title: 'Agent 调用记录',
          subtitle: '查看全站用户对各智能体的在线体验与 API 调用明细日志、Token 吞吐、底座模型消耗与费用分摊',
          category: '智能体管理',
          crumb: ['后台管理', 'Agent管理', '调用记录']
        };
      case 'agent_stats':
        return {
          title: '智能体用量统计',
          subtitle: '全站智能体 API 调用频次、Token 吞吐流量、热门排行与营收统计大盘',
          category: '用量与统计',
          crumb: ['后台管理', 'Agent管理', '用量统计']
        };
      case 'dataset_list':
        return {
          title: '数据集管理',
          subtitle: '全站开放数据集发布、多模态与任务类型元数据配置、文件大小自动识别及上下架状态管控',
          category: '数据集管理',
          crumb: ['后台管理', '数据集管理', '数据集管理']
        };
      case 'dataset_audit':
        return {
          title: '数据集审核',
          subtitle: '处理用户在前台上传提交的数据集审核队列，审核通过后用户可进行自主上架并在数据集广场展示',
          category: '数据集管理',
          crumb: ['后台管理', '数据集管理', '数据集审核']
        };
      case 'dataset_stats':
        return {
          title: '数据集使用统计',
          subtitle: '总数据集数、累计下载量、近7天热度趋势、Top 10 排行榜、模态与行业领域分布大盘',
          category: '数据集管理',
          crumb: ['后台管理', '数据集管理', '数据集使用统计']
        };
      case 'model_list':
        return {
          title: '大模型配置与计费规则管理',
          subtitle: '维护模型基本信息、接入网关URL、认证凭证、多模态规格及阶梯计费规则',
          category: '模型管理',
          crumb: ['后台管理', '模型管理', '模型管理']
        };
      case 'model_calls':
        return {
          title: '模型API调用明细日志',
          subtitle: '全量记录各模型API调用审计日志、算力Token开销、成功率及实时扣费明细',
          category: '模型管理',
          crumb: ['后台管理', '模型管理', '模型调用记录']
        };
      case 'model_stats':
        return {
          title: '大模型用量与营收分析',
          subtitle: '统计近30天全站大模型调用吞吐量、多模态占比、热门模型榜单与API服务营收',
          category: '模型管理',
          crumb: ['后台管理', '模型管理', '模型使用统计']
        };
      case 'publish_audit':
        return {
          title: '任务发布审核',
          subtitle: '对雇主发布的极客任务、算力外包与智能体定制需求进行合规性与预算初审',
          category: '任务管理',
          crumb: ['后台管理', '任务管理', '发布审核']
        };
      case 'task_monitor':
        return {
          title: '任务执行监控',
          subtitle: '追踪全平台任务接单状态、阶段交付物提交流程、里程碑资金托管与履约进度',
          category: '任务管理',
          crumb: ['后台管理', '任务管理', '任务监控']
        };
      case 'compute_spec':
        return {
          title: '规格管理',
          subtitle: '定义平台可提供的 GPU 规格（型号、显存、CPU/内存/存储、按量及日/周/月套餐价格与可用库存）',
          category: '算力管理',
          crumb: ['后台管理', '算力管理', '规格管理']
        };
      case 'compute_image':
        return {
          title: '镜像管理',
          subtitle: '管理用户在创建实例时可选的官方系统镜像、App 市场应用镜像与社区镜像',
          category: '算力管理',
          crumb: ['后台管理', '算力管理', '镜像管理']
        };
      case 'compute_pool':
        return {
          title: '资源池管理',
          subtitle: '管理平台接入的各运营商算力集群节点、容量水位、利用率及告警阈值',
          category: '算力管理',
          crumb: ['后台管理', '算力管理', '资源池管理']
        };
      case 'compute_order':
        return {
          title: '实例订单管理',
          subtitle: '查看与处理所有用户的 GPU 容器/虚拟机实例订单、计费明细与异常调度',
          category: '算力管理',
          crumb: ['后台管理', '算力管理', '实例订单管理']
        };
      case 'compute_instance':
        return {
          title: '运行实例监控',
          subtitle: '实时查看所有运行中的实例遥测指标（GPU/CPU/显存/温度/功耗），支持远程重启与强制停机',
          category: '算力管理',
          crumb: ['后台管理', '算力管理', '运行实例监控']
        };
      case 'compute_stat':
        return {
          title: '资源使用统计',
          subtitle: '平台算力资源利用率、热门型号排行、用户用量排行、运营商营收与成本结构分析',
          category: '算力管理',
          crumb: ['后台管理', '算力管理', '资源使用统计']
        };
      case 'compute_settlement':
        return {
          title: '对账结算',
          subtitle: '与算力运营商的账期卡时消耗核对、应付成本计算与发票结款归档',
          category: '算力管理',
          crumb: ['后台管理', '算力管理', '对账结算']
        };
      case 'compute_admin':
        return {
          title: '算力概览',
          subtitle: '管控多机房 GPU 算力集群节点、容器化实例状态、算力配额与硬件利用率',
          category: '算力管理',
          crumb: ['后台管理', '算力管理']
        };
      case 'competition_admin':
        return {
          title: '赛事活动管理',
          subtitle: 'AI数据科学赛、AI安全挑战赛、AIGC生成赛、AI产品创新赛官方发布、评审标准配置与作品管理',
          category: '生态竞技',
          crumb: ['后台管理', '赛事管理']
        };
      case 'system_admin':
        return {
          title: '系统与安全管理',
          subtitle: '平台角色权限 (RBAC)、审计安全日志、参数配置、API 网关及第三方接入',
          category: '系统支撑',
          crumb: ['后台管理', '系统管理']
        };
      case 'skill_list':
        return {
          title: 'Skill 插件管理',
          subtitle: '挂载与管理全平台 Agent 扩展 Skill 插件，支持文件导入与场景分类绑定',
          category: 'Skill管理',
          crumb: ['后台管理', 'Skill管理', 'Skill列表']
        };
      case 'skill_audit':
        return {
          title: 'Skill 插件审核',
          subtitle: '审核用户在前台提交创建的 Skill 扩展包，全面审查代码安全性与包文件结构',
          category: 'Skill管理',
          crumb: ['后台管理', 'Skill管理', 'Skill审核']
        };
      case 'community_audit':
        return {
          title: '社区发帖审核',
          subtitle: '审核用户新发布的动态内容，确保合规展示，支持详情调阅、驳回原因填写与自动审核推送',
          category: '社区管理',
          crumb: ['后台管理', '社区管理', '发帖审核']
        };
      case 'community_post':
        return {
          title: '社区帖子管理',
          subtitle: '管理全平台已发布的帖子，支持置顶、加精、锁定与彻底删除，并提供社区板块配置维系',
          category: '社区管理',
          crumb: ['后台管理', '社区管理', '帖子管理']
        };
      case 'community_comment':
        return {
          title: '社区评论管理',
          subtitle: '全局调阅与管控用户动态评论列表，支持违规内容快速检索、关联帖子追溯与彻底删除',
          category: '社区管理',
          crumb: ['后台管理', '社区管理', '评论管理']
        };
      case 'community_stats':
        return {
          title: '社区数据统计与图表分析',
          subtitle: '监控全社区发帖走势、用户互动活度、热门板块分布以及核心贡献用户排行榜',
          category: '社区管理',
          crumb: ['后台管理', '社区管理', '数据统计']
        };
      default:
        return {
          title: '管理后台',
          subtitle: 'AI运营中心全域运营管理体系',
          category: '系统',
          crumb: ['后台管理']
        };
    }
  };

  const meta = getPageMeta();

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans flex flex-col antialiased">
      {/* 顶部极客暗黑系背景光晕 */}
      <div className="fixed top-0 left-0 right-0 h-96 bg-gradient-to-b from-indigo-950/40 via-slate-950/80 to-slate-950 pointer-events-none -z-10 blur-3xl" />

      {/* 整体两栏布局 */}
      <div className="flex-1 flex w-full max-w-[1920px] mx-auto min-h-screen">
        
        {/* 左侧固定侧边栏 (260px) */}
        <aside 
          id="admin-sidebar"
          className="w-64 shrink-0 bg-slate-900/90 border-r border-slate-800/90 backdrop-blur-xl flex flex-col justify-between sticky top-0 h-screen z-30 select-none"
        >
          <div>
            {/* 顶部 Logo & 管理系统标识 */}
            <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-cyan-500 p-0.5 shadow-md shadow-indigo-500/20 flex items-center justify-center">
                  <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div>
                  <div className="text-sm font-black tracking-tight text-white flex items-center gap-1.5">
                    AI运营中心
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-mono border border-indigo-500/30">ADMIN</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono tracking-wider">后台综合管理平台</div>
                </div>
              </div>
            </div>



            {/* 导航菜单列表 */}
            <nav className="p-3 space-y-1.5 overflow-y-auto max-h-[calc(100vh-260px)]">
              <div className="px-3 py-1.5 text-[10px] font-black tracking-widest text-slate-500 uppercase">
                系统功能导航
              </div>

              {mainNav.map((item) => {
                if (item.isGroup && item.children) {
                  const isCompute = item.id === 'compute_admin_group';
                  const isTask = item.id === 'task_admin_group';
                  const isAgent = item.id === 'agent_admin_group';
                  const isDataset = item.id === 'dataset_admin_group';
                  const isModel = item.id === 'model_admin_group';
                  const isSkill = item.id === 'skill_admin_group';
                  const isGroupActive = isCompute ? isComputeSubMenu : isTask ? isTaskSubMenu : isAgent ? isAgentSubMenu : isDataset ? isDatasetSubMenu : isModel ? isModelSubMenu : isSkillSubMenu;
                  const isExpanded = isCompute ? computeMenuExpanded : isTask ? taskMenuExpanded : isAgent ? agentMenuExpanded : isDataset ? datasetMenuExpanded : isModel ? modelMenuExpanded : skillMenuExpanded;
                  const toggleExpanded = () => {
                    if (isCompute) setComputeMenuExpanded(!computeMenuExpanded);
                    if (isTask) setTaskMenuExpanded(!taskMenuExpanded);
                    if (isAgent) setAgentMenuExpanded(!agentMenuExpanded);
                    if (isDataset) setDatasetMenuExpanded(!datasetMenuExpanded);
                    if (isModel) setModelMenuExpanded(!modelMenuExpanded);
                    if (isSkill) setSkillMenuExpanded(!skillMenuExpanded);
                  };

                  return (
                    <div key={item.id} className="space-y-1">
                      {/* 一级父菜单 */}
                      <button
                        onClick={toggleExpanded}
                        className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                          isGroupActive 
                            ? 'bg-slate-800 text-indigo-300 border border-slate-700/80' 
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className={`${isGroupActive ? 'text-indigo-400' : 'text-slate-400'}`}>
                            {item.icon}
                          </span>
                          <span>{item.label}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {isExpanded ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* 二级子菜单 */}
                      {isExpanded && (
                        <div className="pl-4 space-y-1 border-l-2 border-slate-800 ml-4 py-1">
                          {item.children.map(sub => {
                            const isSubActive = activeAdminMenu === sub.id;
                            return (
                              <button
                                key={sub.id}
                                id={`admin-menu-${sub.id}`}
                                onClick={() => handleMenuClick(sub.id)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                  isSubActive
                                    ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{sub.icon}</span>
                                  <span>{sub.label}</span>
                                </div>

                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                // 常规一级菜单
                const isActive = activeAdminMenu === item.id;
                return (
                  <button
                    key={item.id}
                    id={`admin-menu-${item.id}`}
                    onClick={() => handleMenuClick(item.id as AdminMenuKey)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </div>


                  </button>
                );
              })}
            </nav>
          </div>

          {/* 左侧底部管理员信息与状态栏 */}
          <div className="p-4 border-t border-slate-800/80 bg-slate-900/95 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <div className="text-xs font-bold text-slate-200 leading-tight flex items-center gap-1.5">
                    {user.name}
                    <span className="text-[9px] px-1 rounded bg-amber-500/20 text-amber-300 font-mono">超级管理</span>
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: ROOT-ADMIN-01</div>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium font-mono text-[10px]">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                后台集群运行中
              </span>
              <span className="text-slate-500 font-mono text-[10px]">v2.6.4</span>
            </div>
          </div>
        </aside>

        {/* 右侧主工作台区域 */}
        <div className="flex-1 flex flex-col min-w-0 bg-slate-950/60 overflow-y-auto">
          
          {/* 后台顶部控制栏 */}
          <header className="h-16 shrink-0 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-20">
            {/* 左侧面包屑与分类 */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                {meta.crumb.map((c, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <span className="text-slate-600">/</span>}
                    <span className={i === meta.crumb.length - 1 ? 'text-indigo-400 font-bold' : 'hover:text-slate-300'}>
                      {c}
                    </span>
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* 右侧操作区 */}
            <div className="flex items-center gap-3">
              {/* 返回前台大按钮 */}
              <button
                onClick={exitAdminMode}
                className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold shadow-md shadow-indigo-500/20 flex items-center gap-1.5 cursor-pointer transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>返回前台</span>
              </button>
            </div>
          </header>

          {/* 主内容区域 */}
          <main className="p-8 flex-1 space-y-6 max-w-[1660px]">
            
            {/* 页面 Header 介绍卡片 */}
            <div className="relative rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-slate-800 p-6 overflow-hidden shadow-lg shadow-black/40">
              <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-indigo-500/10 to-transparent pointer-events-none" />
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 relative z-10">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-bold">
                      {meta.category}
                    </span>
                    <h1 className="text-xl font-black text-white tracking-tight">{meta.title}</h1>
                  </div>
                  <p className="text-xs text-slate-400 mt-1 max-w-3xl leading-relaxed">
                    {meta.subtitle}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80 text-xs font-mono text-slate-300 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    <span>系统时间：2026-08-17</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 页面具体内容区（按当前选中的菜单渲染） */}
            {activeAdminMenu === 'operations' && <OperationsDashboard />}
            {activeAdminMenu === 'publish_audit' && <PublishAuditAdminView />}
            {activeAdminMenu === 'task_monitor' && <TaskMonitorAdminView />}
            
            {/* Agent管理 3 大核心子视图 */}
            {['agent_list', 'agent_calls', 'agent_stats'].includes(activeAdminMenu) && (
              <AgentAdminViews activeSubMenu={activeAdminMenu} />
            )}

            {/* 数据集管理 3 大核心子视图 */}
            {['dataset_list', 'dataset_audit', 'dataset_stats'].includes(activeAdminMenu) && (
              <DatasetAdminViews activeSubMenu={activeAdminMenu} />
            )}

            {/* 模型管理 3 大核心模块 */}
            {activeAdminMenu === 'model_list' && <ModelListAdminView />}
            {activeAdminMenu === 'model_calls' && <ModelCallsAdminView />}
            {activeAdminMenu === 'model_stats' && <ModelStatsAdminView />}

            {/* Skill管理 2 大核心子视图 */}
            {['skill_list', 'skill_audit'].includes(activeAdminMenu) && (
              <SkillAdminView activeSubMenu={activeAdminMenu} />
            )}

            {/* 社区管理 4 大核心子视图 */}
            {['community_audit', 'community_post', 'community_comment', 'community_stats'].includes(activeAdminMenu) && (
              <CommunityAdminViews activeSubMenu={activeAdminMenu as any} />
            )}
            
            {/* 算力管理 7 大核心模块 */}
            {activeAdminMenu === 'compute_spec' && <ComputeSpecAdminView />}
            {activeAdminMenu === 'compute_image' && <ComputeImageAdminView />}
            {activeAdminMenu === 'compute_pool' && <ComputePoolAdminView />}
            {activeAdminMenu === 'compute_order' && <ComputeOrderAdminView />}
            {activeAdminMenu === 'compute_instance' && <ComputeInstanceMonitorView />}
            {activeAdminMenu === 'compute_stat' && <ComputeStatsAdminView />}
            {activeAdminMenu === 'compute_settlement' && <ComputeSettlementAdminView />}
            {activeAdminMenu === 'compute_admin' && <ComputeSpecAdminView />}

            {activeAdminMenu === 'competition_admin' && <CompetitionAdminView />}
            {activeAdminMenu === 'system_admin' && <SystemAdminView />}

          </main>
        </div>

      </div>
    </div>
  );
};

// ==========================================
// 1. 发布审核（任务管理子菜单 1）
// ==========================================
const PublishAuditAdminView: React.FC = () => {
  const { tasks, auditTask, showToast } = useApp();
  const [rejectingTaskId, setRejectingTaskId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [viewingTask, setViewingTask] = useState<TaskItem | null>(null);

  // 综合多维筛选控制台状态
  const [searchQuery, setSearchQuery] = useState<string>(''); // 关键词搜索
  const [domainFilter, setDomainFilter] = useState<string>('全部'); // 全部 / 各领域
  const [statusFilter, setStatusFilter] = useState<string>('待审核'); // 全部 / 待审核 / 审核通过 / 已驳回

  // 过滤后的任务列表
  const filteredAuditTasks = useMemo(() => {
    return tasks.filter(task => {
      // 1. 关键词搜索 (匹配标题、需求描述、发布者)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = (task.description || task.brief || '').toLowerCase().includes(q);
        const matchPublisher = (task.publisher || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchPublisher) return false;
      }
      // 2. 所属领域筛选
      if (domainFilter !== '全部' && task.domain !== domainFilter) {
        return false;
      }
      // 3. 任务状态筛选
      if (statusFilter !== '全部') {
        if (statusFilter === '待审核' && task.status !== '审核中') return false;
        if (statusFilter === '审核通过' && (task.status === '审核中' || task.status === '已驳回')) return false;
        if (statusFilter === '已驳回' && task.status !== '已驳回') return false;
      }
      return true;
    });
  }, [tasks, searchQuery, domainFilter, statusFilter]);

  const handlePass = (taskId: string, title: string) => {
    auditTask(taskId, true);
    showToast(`任务【${title}】审核通过！已实时进入进行中状态并在任务大厅展示。`);
  };

  const handleOpenReject = (taskId: string) => {
    setRejectingTaskId(taskId);
    setRejectReason('');
  };

  const handleConfirmReject = (taskId: string) => {
    if (!rejectReason.trim()) {
      showToast('请填写驳回原因（必填）');
      return;
    }
    auditTask(taskId, false, rejectReason.trim());
    showToast(`任务已成功驳回，已通知发布雇主全额解冻预付资金。`);
    setRejectingTaskId(null);
  };

  return (
    <div className="space-y-6">
      {/* 1. 综合多维筛选控制台 */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-indigo-400" />
          <span>任务发布审核多维查询控制台</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 关键词搜索 */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 mb-1 block">关键词搜索</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索标题、需求描述或发布者..."
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 font-medium outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 筛选1：所属领域 */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 mb-1 block">所属领域</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500"
            >
              <option value="全部">全部领域</option>
              <option value="技术开发">技术开发</option>
              <option value="内容创作">内容创作</option>
              <option value="AI模型与数据">AI模型与数据</option>
              <option value="工具与自动化">工具与自动化</option>
              <option value="咨询与培训">咨询与培训</option>
            </select>
          </div>

          {/* 筛选2：审核状态 */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 mb-1 block">审核状态</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500"
            >
              <option value="全部">全部状态</option>
              <option value="待审核">待审核</option>
              <option value="审核通过">审核通过</option>
              <option value="已驳回">已驳回</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. 传统标准表格列表展示区 */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <FileCheck className="w-5 h-5 text-amber-400" />
              <span>任务发布审核与预算清算表</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">审核需求完整度、预付款托管记录，并通过表格集中分列操作</p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
            共检索到: {filteredAuditTasks.length} 条记录
          </span>
        </div>

        {filteredAuditTasks.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto opacity-60" />
            <p className="text-sm font-bold text-slate-300">暂无满足筛选条件的任务数据</p>
            <p className="text-xs">您可以调整上方的关键字或选单条件重新检索</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4 min-w-[200px]">任务标题</th>
                  <th className="py-3 px-3 min-w-[100px]">所属领域</th>
                  <th className="py-3 px-3 min-w-[80px]">难度</th>
                  <th className="py-3 px-4 min-w-[120px]">发布人</th>
                  <th className="py-3 px-3 min-w-[130px]">发布时间</th>
                  <th className="py-3 px-3 text-right min-w-[100px]">赏金预算</th>
                  <th className="py-3 px-3 min-w-[130px]">截止时间</th>
                  <th className="py-3 px-3 min-w-[90px]">审核状态</th>
                  <th className="py-3 px-4 text-center min-w-[180px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredAuditTasks.map(task => {
                  const isAuditing = task.status === '审核中';
                  const isRejected = task.status === '已驳回';

                  return (
                    <React.Fragment key={task.id}>
                      <tr className="hover:bg-slate-800/40 transition">
                        {/* 1. 任务标题（单字段，无多余混合标签） */}
                        <td className="py-3.5 px-4">
                          <div className="font-extrabold text-white text-xs line-clamp-2" title={task.title}>
                            {task.title}
                          </div>
                        </td>

                        {/* 2. 所属领域 */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 font-medium text-[11px]">
                            {task.domain}
                          </span>
                        </td>

                        {/* 3. 难度 */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                            {task.difficulty}
                          </span>
                        </td>

                        {/* 4. 发布人 */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <img
                              src={task.publisherAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'}
                              alt={task.publisher}
                              className="w-5 h-5 rounded-full object-cover border border-slate-700"
                            />
                            <span className="font-bold text-slate-200 text-xs">{task.publisher}</span>
                          </div>
                        </td>

                        {/* 5. 发布时间 */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                          {task.publishTime || '-'}
                        </td>

                        {/* 6. 赏金预算 */}
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <div className="font-black font-mono text-emerald-400 text-xs">
                            ¥{(task.cashReward || 0).toLocaleString()}
                          </div>
                          {(task.pointsReward || 0) > 0 && (
                            <div className="text-[10px] text-amber-400 font-mono">+{task.pointsReward} 积分</div>
                          )}
                        </td>

                        {/* 7. 截止时间 */}
                        <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                          {task.endTime || task.deadline || '-'}
                        </td>

                        {/* 8. 审核状态 */}
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className={`px-2.5 py-1 rounded-lg text-[11px] font-black ${
                            isAuditing
                              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                              : isRejected
                              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                              : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {isAuditing ? '待审核' : isRejected ? '已驳回' : '已通过'}
                          </span>
                        </td>

                        {/* 9. 集中操作列 */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setViewingTask(task)}
                              className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 font-bold text-xs transition cursor-pointer"
                            >
                              查看详情
                            </button>

                            {isAuditing && (
                              <>
                                <button
                                  onClick={() => handlePass(task.id, task.title)}
                                  className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs transition cursor-pointer flex items-center gap-1 shadow-xs"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  <span>通过</span>
                                </button>
                                <button
                                  onClick={() => handleOpenReject(task.id)}
                                  className="px-2.5 py-1.5 rounded-lg border border-red-500/40 text-red-400 hover:bg-red-500/10 font-bold text-xs transition cursor-pointer"
                                >
                                  驳回
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* 展开的驳回原因填写行 */}
                      {rejectingTaskId === task.id && (
                        <tr className="bg-red-950/30 border-b border-red-900/50">
                          <td colSpan={9} className="p-4">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-bold text-red-300 shrink-0">驳回说明：</span>
                              <input
                                type="text"
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                placeholder="例如：任务描述不完整或需求验收指标不可量化..."
                                className="flex-1 px-3 py-1.5 bg-slate-900 border border-red-700 rounded-lg text-xs text-white outline-none focus:border-red-500"
                              />
                              <button
                                onClick={() => setRejectingTaskId(null)}
                                className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 text-xs hover:bg-slate-700 cursor-pointer"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleConfirmReject(task.id)}
                                className="px-4 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs cursor-pointer"
                              >
                                确认驳回退款
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 详情查看弹窗（与编辑任务字段完全一致，只读模式，不显示平台运行状态与接单监控） */}
      <AdminTaskEditModal
        task={viewingTask}
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        readOnly={true}
        mode="audit_detail"
      />
    </div>
  );
};

// ==========================================
// 4. 任务监控（任务管理子菜单 2）
// ==========================================
const TaskMonitorAdminView: React.FC = () => {
  const { tasks, deleteTask, showToast } = useApp();
  const [viewingTask, setViewingTask] = useState<TaskItem | null>(null);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);
  const [deletingTask, setDeletingTask] = useState<TaskItem | null>(null);

  // 筛选控制台状态
  const [searchQuery, setSearchQuery] = useState<string>(''); // 关键词搜索
  const [domainFilter, setDomainFilter] = useState<string>('全部'); // 全部 / 各领域
  const [statusFilter, setStatusFilter] = useState<string>('全部'); // 全部 / 进行中 / 已结束

  // 仅监控已通过审核的任务（排除审核中和已驳回）
  const approvedTasks = useMemo(() => {
    return tasks.filter(t => t.status !== '审核中' && t.status !== '已驳回');
  }, [tasks]);

  const filteredMonitoredTasks = useMemo(() => {
    return approvedTasks.filter(task => {
      // 1. 关键词匹配
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = (task.description || task.brief || '').toLowerCase().includes(q);
        const matchPublisher = (task.publisher || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchPublisher) return false;
      }
      // 2. 所属领域
      if (domainFilter !== '全部' && task.domain !== domainFilter) {
        return false;
      }
      // 3. 运行状态
      if (statusFilter !== '全部') {
        const isFinished = task.status === '已结束' || task.status === '已验收';
        if (statusFilter === '进行中' && isFinished) return false;
        if (statusFilter === '已结束' && !isFinished) return false;
      }
      return true;
    });
  }, [approvedTasks, searchQuery, domainFilter, statusFilter]);

  return (
    <div className="space-y-6">
      {/* 1. 多维筛选控制台 */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-cyan-400" />
          <span>全网任务执行轨迹监控筛选控制台</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* 关键词搜索 */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 mb-1 block">关键词搜索</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索标题、描述或发布者..."
                className="w-full pl-8 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 font-medium outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 mb-1 block">所属领域</label>
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500"
            >
              <option value="全部">全部领域</option>
              <option value="技术开发">技术开发</option>
              <option value="内容创作">内容创作</option>
              <option value="AI模型与数据">AI模型与数据</option>
              <option value="工具与自动化">工具与自动化</option>
              <option value="咨询与培训">咨询与培训</option>
            </select>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-400 mb-1 block">任务运行状态</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500"
            >
              <option value="全部">全部状态</option>
              <option value="进行中">进行中</option>
              <option value="已结束">已结束</option>
            </select>
          </div>
        </div>
      </div>

      {/* 2. 传统标准表格监控数据表 */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span>全网任务履约与进度表格（共 {filteredMonitoredTasks.length} 条记录）</span>
          </h3>
        </div>

        {filteredMonitoredTasks.length === 0 ? (
          <div className="py-16 text-center text-slate-500 space-y-2">
            <Activity className="w-10 h-10 text-cyan-400 mx-auto opacity-50" />
            <p className="text-sm font-bold text-slate-300">暂无监控中的任务</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3 px-4 min-w-[200px]">任务标题</th>
                  <th className="py-3 px-3 min-w-[100px]">所属领域</th>
                  <th className="py-3 px-3 min-w-[80px]">难度</th>
                  <th className="py-3 px-4 min-w-[120px]">发布雇主</th>
                  <th className="py-3 px-3 min-w-[130px]">发布时间</th>
                  <th className="py-3 px-3 min-w-[90px]">接单人数</th>
                  <th className="py-3 px-3 min-w-[90px]">提交成果</th>
                  <th className="py-3 px-3 text-right min-w-[100px]">赏金预算</th>
                  <th className="py-3 px-3 min-w-[130px]">截止时间</th>
                  <th className="py-3 px-3 min-w-[90px]">运行状态</th>
                  <th className="py-3 px-4 text-center min-w-[160px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredMonitoredTasks.map(task => {
                  const takers = task.takers || [];
                  const submissions = task.submissions || [];
                  const isFinished = task.status === '已结束' || task.status === '已验收';

                  return (
                    <tr key={task.id} className="hover:bg-slate-800/40 transition">
                      {/* 1. 任务标题（单字段） */}
                      <td className="py-3.5 px-4">
                        <div className="font-extrabold text-white text-xs line-clamp-2" title={task.title}>
                          {task.title}
                        </div>
                      </td>

                      {/* 2. 所属领域 */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-slate-700 font-medium text-[11px]">
                          {task.domain}
                        </span>
                      </td>

                      {/* 3. 难度 */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium text-[11px]">
                          {task.difficulty}
                        </span>
                      </td>

                      {/* 4. 发布雇主 */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <img
                            src={task.publisherAvatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80'}
                            alt={task.publisher}
                            className="w-5 h-5 rounded-full object-cover border border-slate-700"
                          />
                          <span className="font-bold text-slate-200 text-xs">{task.publisher}</span>
                        </div>
                      </td>

                      {/* 5. 发布时间 */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                        {task.publishTime || '-'}
                      </td>

                      {/* 6. 接单人数 */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs text-slate-300">
                        {takers.length} 人
                      </td>

                      {/* 7. 提交成果 */}
                      <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs text-slate-300">
                        {submissions.length} 份
                      </td>

                      {/* 8. 赏金预算 */}
                      <td className="py-3.5 px-3 text-right whitespace-nowrap">
                        <div className="font-black font-mono text-emerald-400 text-xs">
                          ¥{(task.cashReward || 0).toLocaleString()}
                        </div>
                        {(task.pointsReward || 0) > 0 && (
                          <div className="text-[10px] text-amber-400 font-mono">+{task.pointsReward} 积分</div>
                        )}
                      </td>

                      {/* 9. 截止时间 */}
                      <td className="py-3.5 px-3 font-mono text-[11px] text-slate-300 whitespace-nowrap">
                        {task.endTime || task.deadline || '-'}
                      </td>

                      {/* 10. 运行状态 */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className={`px-2.5 py-1 rounded-lg text-[11px] font-bold ${
                          isFinished
                            ? 'bg-slate-800 text-slate-400 border border-slate-700'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {isFinished ? '已结束' : '进行中'}
                        </span>
                      </td>

                      {/* 11. 集中操作列 */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => setEditingTask(task)}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>编辑</span>
                          </button>
                          <button
                            onClick={() => setViewingTask(task)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 font-bold transition cursor-pointer"
                          >
                            查看详情
                          </button>
                          <button
                            onClick={() => setDeletingTask(task)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs"
                            title="删除任务"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 详情查看弹窗（展示接单监控与交付详情，只读模式） */}
      <AdminTaskEditModal
        task={viewingTask}
        isOpen={!!viewingTask}
        onClose={() => setViewingTask(null)}
        readOnly={true}
        mode="monitor_detail"
      />

      {/* 编辑弹窗（不展示接单监控区，仅编辑任务需求与奖励等） */}
      <AdminTaskEditModal
        task={editingTask}
        isOpen={!!editingTask}
        onClose={() => setEditingTask(null)}
        readOnly={false}
        mode="monitor_edit"
      />

      {/* 删除二次确认弹窗 */}
      {deletingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">确认删除该任务？</h3>
                <p className="text-xs text-slate-400 mt-0.5">删除后前后台将同步下架并移除该任务</p>
              </div>
            </div>

            <div className="text-xs text-slate-300 bg-slate-800/60 p-3.5 rounded-xl border border-slate-700/60 space-y-2">
              <div className="font-extrabold text-white text-sm line-clamp-2">
                【{deletingTask.title}】
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-slate-700/40">
                <div>发布者：<span className="text-slate-200 font-medium">{deletingTask.publisher}</span></div>
                <div>所属领域：<span className="text-slate-200 font-medium">{deletingTask.domain}</span></div>
                <div>赏金预算：<span className="text-emerald-400 font-mono font-bold">¥{(deletingTask.cashReward || 0).toLocaleString()}</span></div>
                <div>接单人数：<span className="text-slate-200 font-mono">{(deletingTask.takers || []).length} 人</span></div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingTask(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={() => {
                  if (deletingTask) {
                    deleteTask(deletingTask.id);
                    setDeletingTask(null);
                  }
                }}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-rose-600/20 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>确认删除</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 5. 算力管理子视图
// ==========================================
const ComputeAdminView: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-base font-black text-white">GPU 算力集群与资源调度</h3>
          <p className="text-xs text-slate-400 mt-1">管理 H800 / RTX 4090 / A100 服务器节点集群、容器资源分配与算力券下发</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">
          + 添加物理算力节点
        </button>
      </div>

      <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
          <Cpu className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-slate-200">算力集群管理控制台已就绪</h4>
        <p className="text-xs max-w-md text-slate-500">
          支持节点健康探针、显存占用实时监控、容器按需秒级启停及跨机房算力负载均衡调度。
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 6. 赛事管理子视图
// ==========================================
const CompetitionAdminView: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-base font-black text-white">赛事中心活动与赛题管理</h3>
          <p className="text-xs text-slate-400 mt-1">发布各类 AI 竞赛、配置赛道规则、上传评测基准数据集、管理专家评委打分流</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition">
          + 创建新赛事
        </button>
      </div>

      <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-amber-400">
          <Trophy className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-slate-200">赛事管理控制台已就绪</h4>
        <p className="text-xs max-w-md text-slate-500">
          包含【赛事发布流程】、【赛道与基线指标设定】、【选手作品评阅】与【排行榜防作弊校验】等管理模块。
        </p>
      </div>
    </div>
  );
};

// ==========================================
// 7. 系统管理子视图
// ==========================================
const SystemAdminView: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-base font-black text-white">系统权限与平台参数配置</h3>
          <p className="text-xs text-slate-400 mt-1">管理员 RBAC 角色权限、操作审计日志、网关密钥及第三方基础设施集成</p>
        </div>
        <button className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white text-xs font-bold transition">
          导出审计日志
        </button>
      </div>

      <div className="py-16 flex flex-col items-center justify-center text-center space-y-3 text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-indigo-400">
          <Settings className="w-7 h-7" />
        </div>
        <h4 className="text-sm font-bold text-slate-200">系统管理配置控制台已就绪</h4>
        <p className="text-xs max-w-md text-slate-500">
          支持系统级环境变量监控、安全防护策略（WAF / 频率限制）、短信/邮件通知渠道及第三方模型厂商 API 配置。
        </p>
      </div>
    </div>
  );
};
