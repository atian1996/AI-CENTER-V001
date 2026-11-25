import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { RentalGPUCard, GPUInstance } from '../../types';
import { 
  ChangeRentalDurationModal,
  UpdateInstanceRemarkModal,
  CreateImageFromInstanceModal
} from './InstanceActionModals';
import { MyImagesView } from './MyImagesView';
import { 
  Zap, 
  Cpu, 
  Play, 
  Square, 
  Trash2, 
  ExternalLink, 
  Search, 
  History, 
  Copy, 
  Check, 
  Box, 
  Sparkles, 
  Tag,
  BookOpen,
  Flame,
  Palette,
  Sliders,
  ChevronRight,
  ArrowRight,
  ChevronDown,
  RefreshCw,
  Terminal,
  Code,
  HardDrive,
  Clock,
  CreditCard,
  AlertCircle,
  Filter,
  ChevronLeft
} from 'lucide-react';

export const ComputeView: React.FC = () => {
  const { 
    gpuInstances, 
    myCustomImages,
    computeSpecs,
    toggleGpuInstanceStatus, 
    restartGpuInstance,
    deleteGpuInstance, 
    updateInstanceRemark,
    changeInstanceRentalDuration,
    createImageFromInstance,
    setCreateComputeModalOpen, 
    setCreateComputePreset,
    setDetailInstance, 
    setHistoryModalOpen, 
    showToast 
  } = useApp();

  // Top Main Tabs: 'available' (可租用实例) | 'my_instances' (我租用的实例) | 'my_images' (我的镜像)
  const [activeTab, setActiveTab] = useState<'available' | 'my_instances' | 'my_images'>('available');

  // Filters for My Instances
  const [statusFilter, setStatusFilter] = useState<'all' | 'running' | 'stopped'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInstIds, setSelectedInstIds] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 3 大弹窗与下拉菜单控制
  const [modalType, setModalType] = useState<'duration' | 'remark' | 'image' | null>(null);
  const [activeModalInst, setActiveModalInst] = useState<GPUInstance | null>(null);
  const [dropdownInstId, setDropdownInstId] = useState<string | null>(null);
  const [restartDropdownId, setRestartDropdownId] = useState<string | null>(null);

  // 4 个顶部快速场景 Preset 卡片定义（极简设计系统：24px 纯黑线性图标，无彩色条）
  const quickPresets = [
    {
      id: 'notebook',
      badge: '数据实验',
      icon: <BookOpen className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.6} />,
      title: 'Notebook 开发',
      description: '预装 JupyterLab 与 PyTorch 框架，开箱即用，支持在线交互调试',
      actionText: '一键创建 Notebook',
      scene: 'Notebook开发' as GPUInstance['scene'],
      imageName: 'PyTorch 2'
    },
    {
      id: 'finetune',
      badge: '大模型微调',
      icon: <Flame className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.6} />,
      title: '大模型微调 (LLaMA/Qwen)',
      description: '适配 A100 80G 多卡集群，包含 DeepSpeed, LLaMA-Factory 与 LoRA',
      actionText: '一键创建微调环境',
      scene: 'LLaMA/Qwen微调' as GPUInstance['scene'],
      imageName: 'PyTorch 2'
    },
    {
      id: 'comfyui',
      badge: 'AIGC 绘画',
      icon: <Palette className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.6} />,
      title: '文生图生成 (ComfyUI)',
      description: '预装 Flux.1, ControlNet 基础模型包与节点拓展，开箱直接渲染',
      actionText: '一键创建 ComfyUI',
      scene: 'ComfyUI绘图' as GPUInstance['scene'],
      imageName: '🧘 ComfyUI v0.19.3 (包含 WAN2.2 Animation)'
    },
    {
      id: 'custom',
      badge: '全自由配置',
      icon: <Sliders className="w-6 h-6 text-[#1A1A1A]" strokeWidth={1.6} />,
      title: '自定义自由配置',
      description: '自由选择 GPU 型号、显存大小、网络带宽与私有 Docker 镜像',
      actionText: '高级自定义创建',
      scene: '自定义部署' as GPUInstance['scene'],
      imageName: 'Ubuntu 22.04 纯净版'
    }
  ];

  // 动态映射前台可租用规格（仅展示后台“已上架”状态的规格）
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
          'border-t-blue-600',
          'border-t-yellow-600',
          'border-t-teal-600'
        ];
        return {
          id: s.id,
          title: s.name,
          availableCards: s.stock ?? Math.floor(Math.random() * 8 + 2),
          hourlyPrice: s.hourlyPrice,
          dayPrice: s.dayPrice ?? Math.round(s.hourlyPrice * 22),
          weekPrice: s.weekPrice ?? Math.round(s.hourlyPrice * 22 * 6.5),
          monthPrice: s.monthPrice ?? Math.round(s.hourlyPrice * 22 * 26),
          topBorderColor: borderColors[idx % borderColors.length],
          gpuModel: s.gpuModel,
          vram: `${s.vram} 显存`,
          cpu: `${s.cpu} 核 ${s.cpuModel ? `(${s.cpuModel})` : '高性能 CPU'}`,
          ram: `${s.ram} ${s.ramUnit || 'GB'} 内存`,
          disk: `${s.disk} ${s.diskUnit || 'GB'} NVMe 存储`,
          allowedGpuCounts: s.allowedGpuCounts || [1, 2, 4],
          maxGpuCount: s.maxGpuCount || 4,
          perCardCpu: s.cpu,
          perCardRam: s.ram,
          perCardDisk: s.disk
        };
      });
    }

    // 默认兜底卡片
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
        vram: '96.0 GB 显存',
        cpu: '30 核 AMD EPYC 9J14',
        ram: '128.8 GB',
        disk: '1.1 TB 或更多',
        allowedGpuCounts: [1, 2, 4],
        maxGpuCount: 4
      }
    ];
  }, [computeSpecs]);

  // Filter instances for My Instances Tab
  const myInstances = gpuInstances.filter(inst => {
    if (statusFilter !== 'all' && inst.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        inst.name.toLowerCase().includes(q) ||
        inst.id.toLowerCase().includes(q) ||
        inst.gpuModel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const runningInstances = myInstances.filter(i => i.status === 'running');
  const stoppedInstances = myInstances.filter(i => i.status === 'stopped');

  const copySSH = (cmd: string, id: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedId(id);
    showToast('SSH 链接已复制到剪贴板');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleStartCardRental = (card: RentalGPUCard) => {
    setCreateComputePreset({ card });
    setCreateComputeModalOpen(true);
  };

  const handleQuickPresetClick = (preset: typeof quickPresets[0]) => {
    setCreateComputePreset({
      scene: preset.scene,
      imageName: preset.imageName,
      card: availableRentalCards[0] // 默认选中首张优质卡
    });
    setCreateComputeModalOpen(true);
  };

  const handleBatchStop = () => {
    if (selectedInstIds.length === 0) return;
    selectedInstIds.forEach(id => {
      const inst = gpuInstances.find(i => i.id === id);
      if (inst && inst.status === 'running') toggleGpuInstanceStatus(id);
    });
    setSelectedInstIds([]);
    showToast('已批量停止选中算力实例');
  };

  const handleBatchDelete = () => {
    if (selectedInstIds.length === 0) return;
    selectedInstIds.forEach(id => deleteGpuInstance(id));
    setSelectedInstIds([]);
    showToast('已批量释放销毁选中算力实例');
  };

  const toggleSelectInst = (id: string) => {
    if (selectedInstIds.includes(id)) {
      setSelectedInstIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedInstIds(prev => [...prev, id]);
    }
  };

  return (
    <div className="w-full max-w-[1320px] mx-auto space-y-8 animate-fade-in text-[var(--text-main)] pb-16 pt-2 select-none antialiased">
      
      {/* Unified Page Header */}
      <header className="pb-8 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[var(--text-main)] leading-tight">
            算力工坊
          </h1>
          <p className="text-[14px] text-[var(--text-sub)] leading-[1.6]">
            提供按量计费的优质高性能 GPU 算力资源，包含 RTX PRO 6000、5090、H100、4090 等多样化容器实例。
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="px-4 py-2 rounded-[4px] bg-transparent border border-[var(--border-light)] hover:border-[var(--border-dark)] text-[var(--text-main)] font-medium text-[13px] flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <History className="w-4 h-4 text-[var(--text-main)]" strokeWidth={1.6} />
            <span>历史明细 &amp; 账单</span>
          </button>
        </div>
      </header>

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center border-b border-[var(--border-light)]">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-3 font-semibold text-[14px] transition-colors relative cursor-pointer ${
            activeTab === 'available'
              ? 'text-[var(--text-main)] border-b-2 border-[var(--text-main)]'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
          }`}
        >
          可租用实例
        </button>

        <button
          onClick={() => setActiveTab('my_instances')}
          className={`px-6 py-3 font-semibold text-[14px] transition-colors relative cursor-pointer flex items-center gap-2 ${
            activeTab === 'my_instances'
              ? 'text-[var(--text-main)] border-b-2 border-[var(--text-main)]'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
          }`}
        >
          <span>我租用的实例</span>
          <span className="px-2 py-0.5 rounded-[4px] bg-[var(--bg-hover)] text-[var(--text-main)] text-[12px] font-medium tabular-nums">
            {gpuInstances.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my_images')}
          className={`px-6 py-3 font-semibold text-[14px] transition-colors relative cursor-pointer flex items-center gap-2 ${
            activeTab === 'my_images'
              ? 'text-[var(--text-main)] border-b-2 border-[var(--text-main)]'
              : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
          }`}
        >
          <span>我的镜像</span>
          <span className="px-2 py-0.5 rounded-[4px] bg-[var(--bg-hover)] text-[var(--text-main)] text-[12px] font-medium tabular-nums">
            {myCustomImages.length}
          </span>
        </button>
      </div>

      {/* TAB 1: 可租用实例 */}
      {activeTab === 'available' && (
        <div className="space-y-12">
          
          {/* SECTION A: 顶部4个快速方案卡片 — 纯白卡片 + 1px solid #EAEAEA + 24px 纯黑线性图标 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[var(--text-main)]">
                快速开箱配置（根据应用场景一键部署）
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickPresets.map((preset) => (
                <div 
                  key={preset.id}
                  onClick={() => handleQuickPresetClick(preset)}
                  className="group rounded-[6px] bg-[var(--bg-card)] border border-[var(--border-light)] hover:border-[var(--border-dark)] p-6 transition-colors flex flex-col justify-between space-y-5 cursor-pointer"
                >
                  <div className="space-y-3">
                    {/* Header: 24px 纯黑线性图标 & 极简线框标签 */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="shrink-0">
                        {preset.icon}
                      </div>

                      <span className="text-[12px] px-2 py-0.5 rounded-[4px] font-normal border border-[var(--border-light)] bg-transparent text-[var(--text-sub)]">
                        {preset.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-[16px] font-semibold text-[var(--text-main)] leading-snug">
                      {preset.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[14px] text-[var(--text-sub)] leading-[1.6] font-normal min-h-[44px]">
                      {preset.description}
                    </p>
                  </div>

                  {/* Text Action Link */}
                  <div className="pt-4 border-t border-[var(--border-light)] flex items-center justify-between text-[13px] font-medium text-[var(--text-main)]">
                    <span>{preset.actionText}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" strokeWidth={1.6} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: GPU 容器实例大厅 — 纯白卡片 + 1px #EAEAEA 边框，去彩色条/圆点 */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-[16px] font-semibold text-[var(--text-main)]">
                裸金属与 GPU 容器实例大厅 ({availableRentalCards.length})
              </h2>
              <span className="text-[12px] text-[var(--text-sub)]">按需弹性秒级拉起 · 秒级计费</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableRentalCards.map((card) => (
                <div 
                  key={card.id}
                  className="bg-[var(--bg-card)] rounded-[6px] border border-[var(--border-light)] p-6 transition-colors hover:border-[var(--border-dark)] flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-5">
                    {/* Header: 硬件规格主标题 + 可用卡数 */}
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-[18px] font-semibold text-[var(--text-main)] tracking-tight leading-snug">
                        {card.title}
                      </h3>
                      <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal text-[var(--text-sub)] bg-transparent border border-[var(--border-light)] shrink-0 tabular-nums">
                        {card.maxGpuCount ?? card.availableCards}卡可用
                      </span>
                    </div>

                    {/* Price Display: 超大号加粗深黑价格 + 小号灰色单位 */}
                    <div className="pb-4 border-b border-[var(--border-light)] flex items-baseline gap-1.5">
                      <span className="text-[28px] font-bold text-[var(--text-main)] tabular-nums leading-none tracking-tight">
                        ¥ {(card.hourlyPrice ?? 0).toFixed(2)}
                      </span>
                      <span className="text-[12px] text-[var(--text-sub)]">/小时</span>
                      <span className="ml-auto text-[12px] text-[var(--text-muted)]">按量计费</span>
                    </div>

                    {/* Specs Hierarchy: 去除所有绿/红/蓝圆点，清晰分层排版 */}
                    <div className="space-y-2.5">
                      <div className="text-[14px] font-semibold text-[var(--text-main)] leading-snug">
                        {card.gpuModel} · {card.vram}
                      </div>

                      <div className="space-y-1.5 text-[12px] text-[var(--text-sub)]">
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[var(--text-muted)] shrink-0">CPU</span>
                          <span className="text-[var(--text-sub)] text-right truncate">{card.cpu}</span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[var(--text-muted)] shrink-0">内存</span>
                          <span className="text-[var(--text-sub)] text-right truncate">{card.ram}</span>
                        </div>
                        <div className="flex items-baseline justify-between gap-4">
                          <span className="text-[var(--text-muted)] shrink-0">硬盘</span>
                          <span className="text-[var(--text-sub)] text-right truncate">{card.disk}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button: 100% 宽度，白底黑框，hover 反转为黑底白字 */}
                  <button
                    onClick={() => handleStartCardRental(card)}
                    className="w-full py-2.5 rounded-[4px] bg-[#FFFFFF] border border-[var(--border-dark)] text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[#FFFFFF] font-medium text-[13px] transition-colors cursor-pointer"
                  >
                    开始使用
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: 我租用的实例 (截图 1 - 8 极高还原重构) */}
      {activeTab === 'my_instances' && (
        <div className="space-y-4 animate-fade-in">
          
          {/* Top Search & Filter Bar (参考截图 1, 2) */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="搜索实例名称，按回车开始搜索"
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-slate-400 text-slate-800 font-medium"
                />
              </div>
              <button className="px-3 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-black font-bold text-xs flex items-center gap-1 shrink-0 cursor-pointer transition shadow-2xs">
                <Filter className="w-3.5 h-3.5" />
                <span>搜索</span>
              </button>
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">1</span>
              <button className="p-1.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-600 cursor-pointer">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Instances Cards List */}
          {myInstances.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-400">
              <Box className="w-12 h-12 mx-auto mb-2 opacity-30 text-indigo-600" />
              <p className="text-xs font-medium">暂无正在租用中的算力容器实例</p>
              <button
                onClick={() => setActiveTab('available')}
                className="mt-3 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-black cursor-pointer transition"
              >
                前去租用算力实例
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {myInstances.map((inst) => {
                const isRunning = inst.status === 'running';
                const isStarting = inst.status === 'starting';
                const isCreatingImage = inst.status === 'creating_image';
                const isStopped = inst.status === 'stopped';

                return (
                  <div
                    key={inst.id}
                    className="bg-[var(--bg-card)] rounded-[6px] border border-[var(--border-light)] p-6 space-y-4"
                  >
                    {/* Header Row: 规格名称 / 单价 / 状态 Tag <---> 实例 ID */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-light)] pb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-[16px] font-semibold text-[var(--text-main)]">{inst.name}</span>
                        <span className="text-[12px] font-medium text-[var(--text-sub)] tabular-nums">
                          ¥{inst.hourlyCost} / 小时
                        </span>

                        {/* Status Tags — 极简黑白灰体系 */}
                        {isRunning && (
                          <span className="text-[12px] font-medium text-[#FFFFFF] bg-[var(--text-main)] px-2 py-0.5 rounded-[4px]">
                            运行中
                          </span>
                        )}

                        {isStarting && (
                          <span className="text-[12px] font-medium text-[var(--text-main)] bg-[var(--bg-hover)] px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin text-[var(--text-main)]" />
                            {inst.progressPercent ? `正在下载镜像: ${inst.progressPercent}%` : '正在开机...'}
                          </span>
                        )}

                        {isCreatingImage && (
                          <span className="text-[12px] font-medium text-[var(--text-main)] bg-[var(--bg-hover)] px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin text-[var(--text-main)]" />
                            创建镜像中
                          </span>
                        )}

                        {isStopped && (
                          <span className="text-[12px] font-medium text-[var(--text-sub)] bg-[var(--bg-hover)] px-2 py-0.5 rounded-[4px]">
                            已关机
                          </span>
                        )}
                      </div>

                      <div className="text-[12px] text-[var(--text-muted)] font-mono">
                        实例 ID: <span className="text-[var(--text-main)] font-medium">{inst.id}</span>
                      </div>
                    </div>

                    {/* Middle Info Grid: 2 Columns Layout (左硬件右费用) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-[13px] leading-relaxed">
                      {/* Left Column: 硬件配置 */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[var(--text-main)] w-10 shrink-0">GPU</span>
                          <span className="text-[var(--text-sub)]">
                            {inst.gpuCount} 块 {inst.gpuModel}，共 {inst.vram} 显存
                          </span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[var(--text-main)] w-10 shrink-0">CPU</span>
                          <span className="text-[var(--text-sub)]">{inst.cpu}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[var(--text-main)] w-10 shrink-0">内存</span>
                          <span className="text-[var(--text-sub)]">{inst.ram}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[var(--text-main)] w-10 shrink-0">硬盘</span>
                          <span className="text-[var(--text-sub)]">{inst.disk || '375.8 GB'}</span>
                        </div>
                      </div>

                      {/* Right Column: 租用与费用明细 */}
                      <div className="space-y-2 border-l border-[var(--border-light)] pl-0 md:pl-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-sub)]">租用时间</span>
                          <span className="text-[var(--text-main)] font-medium tabular-nums">{inst.startTime || inst.createdAt || '2026-08-19 14:22'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-sub)]">租用方式</span>
                          <span className="text-[var(--text-main)] font-medium">{inst.billingType}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-sub)]">费用情况</span>
                          <span className="text-[var(--text-main)] tabular-nums">
                            共计 <strong className="font-semibold">{inst.totalCost ?? 0.0}</strong> 元，其中积分已抵扣 <strong className="font-semibold">{inst.voucherDeduction ?? 0.0}</strong> 元
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-[var(--text-sub)]">到期时间</span>
                          <span className="text-[var(--text-main)] tabular-nums">
                            {inst.expireTime ? (
                              <strong className="font-semibold">{inst.expireTime} 到期</strong>
                            ) : (
                              <span>当前余额预计还可使用 <strong className="font-semibold">{inst.remainingHours ?? 8}</strong> 小时</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Banner & Remarks Section */}
                    {(isStarting || isCreatingImage || inst.remark) && (
                      <div className="pt-1">
                        {isCreatingImage ? (
                          <div className="p-3 rounded-[4px] bg-[var(--bg-hover)] border border-[var(--border-light)] text-[12px] text-[var(--text-main)] space-y-1">
                            {inst.remark && (
                              <div className="font-semibold">备注: {inst.remark}</div>
                            )}
                            <div className="text-[var(--text-sub)] flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-[var(--text-main)] shrink-0" />
                              <span>该实例正在创建镜像，你可以在我的镜像中查看进度，创建完成后，实例将自动关机停止计费</span>
                            </div>
                          </div>
                        ) : isStarting ? (
                          <div className="p-3 rounded-[4px] bg-[var(--bg-hover)] border border-[var(--border-light)] text-[12px] text-[var(--text-main)] flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-[var(--text-main)]" />
                            <span>实例已创建，正在进行网络与环境部署 ({inst.progressPercent || 39}%)...</span>
                          </div>
                        ) : (
                          <div className="text-[12px] text-[var(--text-sub)] bg-[var(--bg-page)] px-3 py-1.5 rounded-[4px] border border-[var(--border-light)]">
                            备注: {inst.remark}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Bottom Function Buttons Row (仅在非创建部署、非创建镜像状态下显示) */}
                    {!isStarting && !isCreatingImage && (
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                        
                        {/* Button 1: 【打开工作区 ▾】主下拉按钮 */}
                        <div className="relative">
                          <div className="inline-flex rounded-xl shadow-2xs overflow-hidden border border-slate-900 bg-slate-900 text-white text-xs font-bold">
                            <button
                              onClick={() => {
                                if (inst.jupyterUrl) window.open(inst.jupyterUrl, '_blank');
                                else showToast(`正在打开实例 ${inst.name} 的工作区...`);
                              }}
                              className="px-4 py-2 hover:bg-black transition cursor-pointer flex items-center gap-1.5"
                            >
                              <span>打开工作区</span>
                            </button>

                            <button
                              onClick={() => setDropdownInstId(dropdownInstId === inst.id ? null : inst.id)}
                              className="px-2 border-l border-slate-700 hover:bg-black transition cursor-pointer flex items-center justify-center"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Dropdown Menu for Open Workspace */}
                          {dropdownInstId === inst.id && (
                            <div className="absolute left-0 mt-1 w-48 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-fade-in">
                              <button
                                onClick={() => {
                                  const cmd = inst.sshCommand || `ssh -p 22321 root@gpu-${inst.id.slice(0, 8)}.qianji.ai`;
                                  navigator.clipboard.writeText(cmd);
                                  showToast('已成功复制 SSH 登录指令！');
                                  setDropdownInstId(null);
                                }}
                                className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left font-medium cursor-pointer"
                              >
                                <Terminal className="w-4 h-4 text-slate-500" />
                                <span>SSH 连接 (点击复制)</span>
                              </button>

                              <button
                                onClick={() => {
                                  showToast('正在用 VS Code 唤起远程连接...');
                                  setDropdownInstId(null);
                                }}
                                className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left font-medium cursor-pointer"
                              >
                                <Code className="w-4 h-4 text-blue-500" />
                                <span>用 VS Code 打开</span>
                              </button>

                              <button
                                onClick={() => {
                                  showToast('正在唤起 PyCharm 远程环境...');
                                  setDropdownInstId(null);
                                }}
                                className="w-full px-4 py-2.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 text-left font-medium cursor-pointer"
                              >
                                <Zap className="w-4 h-4 text-emerald-500" />
                                <span>PyCharm 远程连接</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Button 2: 【强制重启 ▾】下拉按钮 */}
                        <div className="relative">
                          <div className="inline-flex rounded-xl shadow-2xs overflow-hidden border border-slate-900 bg-slate-900 text-white text-xs font-bold">
                            <button
                              onClick={() => restartGpuInstance(inst.id)}
                              className="px-4 py-2 hover:bg-black transition cursor-pointer flex items-center gap-1.5"
                            >
                              <span>强制重启</span>
                            </button>

                            <button
                              onClick={() => setRestartDropdownId(restartDropdownId === inst.id ? null : inst.id)}
                              className="px-2 border-l border-slate-700 hover:bg-black transition cursor-pointer flex items-center justify-center"
                            >
                              <ChevronDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {/* Dropdown Menu for Restart */}
                          {restartDropdownId === inst.id && (
                            <div className="absolute left-0 mt-1 w-40 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-fade-in">
                              <button
                                onClick={() => {
                                  showToast('已触发初始化重置，实例将恢复至出厂默认镜像');
                                  setRestartDropdownId(null);
                                }}
                                className="w-full px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left font-medium cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5 text-amber-500" />
                                <span>恢复出厂状态</span>
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Button 3: 转长租 */}
                        <button
                          onClick={() => {
                            setActiveModalInst(inst);
                            setModalType('duration');
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition"
                        >
                          转长租
                        </button>

                        {/* Button 4: 备注 */}
                        <button
                          onClick={() => {
                            setActiveModalInst(inst);
                            setModalType('remark');
                          }}
                          className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition"
                        >
                          备注
                        </button>

                        {/* Button 5: 退还实例 (红框) */}
                        <button
                          onClick={() => deleteGpuInstance(inst.id)}
                          className="px-4 py-2 rounded-xl border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold cursor-pointer transition"
                        >
                          退还实例
                        </button>

                        {/* Button 6: 创建镜像 (黄/橙框) */}
                        <button
                          onClick={() => {
                            setActiveModalInst(inst);
                            setModalType('image');
                          }}
                          className="px-4 py-2 rounded-xl border border-amber-400 text-amber-700 hover:bg-amber-50 text-xs font-bold cursor-pointer transition"
                        >
                          创建镜像
                        </button>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

        </div>
      )}

      {/* TAB 3: 我的镜像 (截图 1, 2, 3 极高还原重构) */}
      {activeTab === 'my_images' && <MyImagesView />}

      {/* Action Modals Mounts (变更为长期租用 / 修改备注 / 创建镜像) */}
      <ChangeRentalDurationModal
        isOpen={modalType === 'duration'}
        instance={activeModalInst}
        onClose={() => {
          setModalType(null);
          setActiveModalInst(null);
        }}
        onConfirm={(instId, type, autoReturn) => {
          changeInstanceRentalDuration(instId, type, autoReturn);
          setModalType(null);
          setActiveModalInst(null);
        }}
      />

      <UpdateInstanceRemarkModal
        isOpen={modalType === 'remark'}
        instance={activeModalInst}
        onClose={() => {
          setModalType(null);
          setActiveModalInst(null);
        }}
        onSave={(instId, remark) => {
          updateInstanceRemark(instId, remark);
          setModalType(null);
          setActiveModalInst(null);
        }}
      />

      <CreateImageFromInstanceModal
        isOpen={modalType === 'image'}
        instance={activeModalInst}
        onClose={() => {
          setModalType(null);
          setActiveModalInst(null);
        }}
        onConfirm={(instId, autoShutdown, overwrite) => {
          createImageFromInstance(instId, autoShutdown, overwrite);
          setModalType(null);
          setActiveModalInst(null);
        }}
      />

    </div>
  );
};
