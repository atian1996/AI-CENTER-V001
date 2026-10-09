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

  // 4 个顶部快速场景 Preset 卡片定义 (参考图片 3)
  const quickPresets = [
    {
      id: 'notebook',
      badge: '数据实验',
      badgeStyle: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      icon: <BookOpen className="w-5 h-5 text-cyan-600" />,
      iconBg: 'bg-cyan-50 border-cyan-100',
      title: '📓 Notebook 开发',
      description: '预装 JupyterLab 与 PyTorch 框架，开箱即用，支持在线交互调试',
      actionText: '一键创建 Notebook',
      actionColor: 'text-indigo-600 hover:text-indigo-700',
      scene: 'Notebook开发' as GPUInstance['scene'],
      imageName: 'PyTorch 2'
    },
    {
      id: 'finetune',
      badge: '大模型微调',
      badgeStyle: 'bg-amber-50 text-amber-800 border-amber-200',
      icon: <Flame className="w-5 h-5 text-amber-600" />,
      iconBg: 'bg-amber-50 border-amber-100',
      title: '🔥 大模型微调 (LLaMA/Qwen)',
      description: '适配 A100 80G 多卡集群，包含 DeepSpeed, LLaMA-Factory 与 LoRA',
      actionText: '一键创建微调环境',
      actionColor: 'text-indigo-600 hover:text-indigo-700',
      scene: 'LLaMA/Qwen微调' as GPUInstance['scene'],
      imageName: 'PyTorch 2'
    },
    {
      id: 'comfyui',
      badge: 'AIGC 绘画',
      badgeStyle: 'bg-purple-50 text-purple-700 border-purple-200',
      icon: <Palette className="w-5 h-5 text-purple-600" />,
      iconBg: 'bg-purple-50 border-purple-100',
      title: '🎨 文生图生成 (ComfyUI)',
      description: '预装 Flux.1, ControlNet 基础模型包与节点拓展，开箱直接渲染',
      actionText: '一键创建 ComfyUI',
      actionColor: 'text-indigo-600 hover:text-indigo-700',
      scene: 'ComfyUI绘图' as GPUInstance['scene'],
      imageName: '🧘 ComfyUI v0.19.3 (包含 WAN2.2 Animation)'
    },
    {
      id: 'custom',
      badge: '全自由配置',
      badgeStyle: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <Sliders className="w-5 h-5 text-emerald-600" />,
      iconBg: 'bg-emerald-50 border-emerald-100',
      title: '⚙️ 自定义自由配置',
      description: '自由选择 GPU 型号、显存大小、网络带宽与私有 Docker 镜像',
      actionText: '高级自定义创建',
      actionColor: 'text-indigo-600 hover:text-indigo-700',
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
    <div className="w-full space-y-6 animate-fade-in text-slate-800 pb-12 select-none font-sans">
      
      {/* Standard Unified Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <Zap className="w-6 h-6 fill-indigo-600" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              算力工坊
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                GPU 容器云
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              提供按量计费的优质高性能 GPU 算力资源，包含 RTX PRO 6000、5090、H100、4090 等多样化容器实例
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setHistoryModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
          >
            <History className="w-4 h-4 text-slate-400" />
            <span>历史明细 & 账单</span>
          </button>
        </div>
      </div>

      {/* TOP NAVIGATION TABS */}
      <div className="flex items-center border-b border-slate-200">
        <button
          onClick={() => setActiveTab('available')}
          className={`px-6 py-3 font-extrabold text-sm transition relative cursor-pointer ${
            activeTab === 'available'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          可租用实例
        </button>

        <button
          onClick={() => setActiveTab('my_instances')}
          className={`px-6 py-3 font-extrabold text-sm transition relative cursor-pointer flex items-center gap-2 ${
            activeTab === 'my_instances'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>我租用的实例</span>
          <span className="px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            {gpuInstances.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my_images')}
          className={`px-6 py-3 font-extrabold text-sm transition relative cursor-pointer flex items-center gap-2 ${
            activeTab === 'my_images'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <span>我的镜像</span>
          <span className="px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-200">
            {myCustomImages.length}
          </span>
        </button>
      </div>

      {/* TAB 1: 可租用实例 */}
      {activeTab === 'available' && (
        <div className="space-y-8">
          
          {/* SECTION A: 顶部4个快速方案卡片 (严格还原参考图片 3) */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <h2 className="text-sm font-extrabold text-slate-900">快速开箱配置（根据应用场景一键部署）</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {quickPresets.map((preset) => (
                <div 
                  key={preset.id}
                  onClick={() => handleQuickPresetClick(preset)}
                  className="group relative rounded-2xl bg-white border border-slate-200/90 p-5 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1 cursor-pointer overflow-hidden"
                >
                  <div className="space-y-3">
                    {/* Header: Icon & Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className={`w-10 h-10 rounded-xl ${preset.iconBg} border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                        {preset.icon}
                      </div>

                      <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-extrabold border ${preset.badgeStyle}`}>
                        {preset.badge}
                      </span>
                    </div>

                    {/* Title */}
                    <h3 className="text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {preset.title}
                    </h3>

                    {/* Description */}
                    <p className="text-xs text-slate-500 leading-relaxed font-normal min-h-[38px]">
                      {preset.description}
                    </p>
                  </div>

                  {/* Action Link */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                    <span>{preset.actionText}</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* SECTION B: 丰富的实例数据卡片列表 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-indigo-600" />
                <h2 className="text-sm font-extrabold text-slate-900">裸金属与 GPU 容器实例大厅 ({availableRentalCards.length})</h2>
              </div>
              <span className="text-xs text-slate-400 font-medium">按需弹性秒级拉起 • 秒级计费</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableRentalCards.map((card) => (
                <div 
                  key={card.id}
                  className={`bg-white rounded-2xl border border-slate-200/90 ${card.topBorderColor} border-t-4 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-5`}
                >
                  {/* Header: Title + Available Badge */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight">
                        {card.title}
                      </h2>
                      <span className="px-3 py-1 rounded-full text-xs font-extrabold text-blue-600 bg-blue-50 border border-blue-200/80">
                        {card.maxGpuCount ?? card.availableCards}卡可用
                      </span>
                    </div>

                    {/* Pricing Display */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-600 font-medium pb-2 border-b border-slate-100">
                      <Tag className="w-3.5 h-3.5 text-indigo-500 fill-indigo-100" />
                      <span>按量使用</span>
                      <span className="text-red-500 font-black text-lg font-mono">¥{(card.hourlyPrice ?? 0).toFixed(2)}</span>
                      <span className="text-slate-400">/ 小时</span>
                    </div>

                    {/* Specs List */}
                    <div className="space-y-2.5 text-xs font-medium text-slate-700">
                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center">🟢</span>
                        <span className="text-slate-500 font-bold">GPU</span>
                        <span className="font-semibold text-slate-900">{card.gpuModel}，共 {card.vram}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center">💻</span>
                        <span className="text-slate-500 font-bold">CPU</span>
                        <span className="font-semibold text-slate-900">{card.cpu}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center">🧠</span>
                        <span className="text-slate-500 font-bold">内存</span>
                        <span className="font-semibold text-slate-900">{card.ram}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="w-5 text-center">🗄️</span>
                        <span className="text-slate-500 font-bold">硬盘</span>
                        <span className="font-semibold text-slate-900">{card.disk}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button */}
                  <button
                    onClick={() => handleStartCardRental(card)}
                    className="w-full py-2.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 font-extrabold text-xs transition cursor-pointer active:scale-98"
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
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 hover:shadow-xs transition"
                  >
                    {/* Header Row: 规格名称 / 单价 / 状态 Tag <---> 实例 ID */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3.5">
                      <div className="flex items-center gap-3">
                        <span className="text-base font-black text-slate-900">{inst.name}</span>
                        <span className="text-xs font-extrabold text-amber-600 bg-amber-50/60 px-2 py-0.5 rounded-md border border-amber-200/50">
                          {inst.hourlyCost} 元 / 小时
                        </span>

                        {/* Status Tags */}
                        {isRunning && (
                          <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            运行中
                          </span>
                        )}

                        {isStarting && (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-300 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                            {inst.progressPercent ? `正在下载镜像: ${inst.progressPercent}%` : '正在开机...'}
                          </span>
                        )}

                        {isCreatingImage && (
                          <span className="text-[11px] font-bold text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-300 flex items-center gap-1">
                            <RefreshCw className="w-3 h-3 animate-spin text-purple-600" />
                            创建镜像中
                          </span>
                        )}

                        {isStopped && (
                          <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-300">
                            已关机
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 font-mono">
                        实例 ID: <span className="text-slate-600 font-bold">{inst.id}</span>
                      </div>
                    </div>

                    {/* Middle Info Grid: 2 Columns Layout (左硬件右费用) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs leading-relaxed">
                      {/* Left Column: 硬件配置 */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs">🟢</span>
                          <span className="font-extrabold text-slate-800 shrink-0">GPU</span>
                          <span className="text-slate-600 font-medium">
                            {inst.gpuCount} 块 {inst.gpuModel}，共 {inst.vram} 显存
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs">💻</span>
                          <span className="font-extrabold text-slate-800 shrink-0">CPU</span>
                          <span className="text-slate-600 font-medium">{inst.cpu}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs">🟧</span>
                          <span className="font-extrabold text-slate-800 shrink-0">内存</span>
                          <span className="text-slate-600 font-medium">{inst.ram}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs">🗄️</span>
                          <span className="font-extrabold text-slate-800 shrink-0">硬盘</span>
                          <span className="text-slate-600 font-medium">{inst.disk || '375.8 GB'}</span>
                        </div>
                      </div>

                      {/* Right Column: 租用与费用明细 */}
                      <div className="space-y-2 border-l border-slate-100 pl-0 md:pl-6">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">租用时间</span>
                          <span className="text-slate-800 font-bold font-mono">{inst.startTime || inst.createdAt || '2026-08-19 14:22'}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">租用方式</span>
                          <span className="text-slate-800 font-bold">{inst.billingType}</span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">费用情况</span>
                          <span className="text-slate-800 font-medium">
                            共计 <strong className="font-bold">{inst.totalCost ?? 0.0}</strong> 元，其中积分已抵扣 <strong className="font-bold">{inst.voucherDeduction ?? 0.0}</strong> 元
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <span className="text-slate-500 font-medium">到期时间</span>
                          <span className="text-slate-800 font-medium">
                            {inst.expireTime ? (
                              <strong className="text-amber-600">{inst.expireTime} 到期</strong>
                            ) : (
                              <span>当前余额预计还可使用 <strong className="font-bold">{inst.remainingHours ?? 8}</strong> 小时</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Banner & Remarks Section (开机中 / 创建镜像中 / 专属备注) */}
                    {(isStarting || isCreatingImage || inst.remark) && (
                      <div className="pt-1">
                        {isCreatingImage ? (
                          <div className="p-3 rounded-xl bg-purple-50/70 border border-purple-200/60 text-xs text-purple-900 space-y-1">
                            {inst.remark && (
                              <div className="font-bold text-slate-700">备注: {inst.remark}</div>
                            )}
                            <div className="text-purple-700 flex items-center gap-1.5">
                              <AlertCircle className="w-3.5 h-3.5 text-purple-600 shrink-0" />
                              <span>该实例正在创建镜像，你可以在我的镜像中查看进度，创建完成后，实例将自动关机停止计费</span>
                            </div>
                          </div>
                        ) : isStarting ? (
                          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900 flex items-center gap-2">
                            <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-600" />
                            <span>实例已创建，正在进行网络与环境部署 ({inst.progressPercent || 39}%)...</span>
                          </div>
                        ) : (
                          <div className="text-xs text-slate-500 font-medium bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
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
