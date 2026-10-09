import React, { useState, useEffect, useMemo } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../context/AppContext';
import { RentalGPUCard, GPUInstance } from '../../types';
import { 
  X, 
  Cpu, 
  Check, 
  AlertTriangle, 
  HardDrive, 
  Sparkles, 
  ChevronDown,
  Layers,
  Info,
  Wallet,
  Coins,
  AlertCircle,
  ArrowRight
} from 'lucide-react';

export const CreateComputeModal: React.FC = () => {
  const { 
    createComputeModalOpen, 
    setCreateComputeModalOpen, 
    createComputePreset, 
    setCreateComputePreset,
    launchGpuInstance,
    computeImages,
    user,
    openRechargeModal,
    showToast 
  } = useApp();

  // 余额不足预警状态
  const [showInsufficientBalanceWarning, setShowInsufficientBalanceWarning] = useState<boolean>(false);
  const [pendingRequiredAmount, setPendingRequiredAmount] = useState<number>(0);

  // Selected GPU Card default: PRO 6000 96GB
  const defaultCard: RentalGPUCard = {
    id: 'pro_6000_96g',
    title: 'PRO 6000 96GB',
    availableCards: 7,
    hourlyPrice: 6.19,
    dayPrice: 145,
    weekPrice: 987,
    monthPrice: 4011,
    topBorderColor: 'border-t-amber-600',
    gpuModel: 'RTX PRO 6000',
    vram: '90 GB',
    cpu: '30 x AMD EPYC 9J14',
    ram: '120 GB',
    disk: '1024 GB'
  };

  const currentCard: RentalGPUCard = createComputePreset?.card || defaultCard;

  // Billing Type selected: 'hourly' | 'daily' | 'weekly' | 'monthly'
  const [billingType, setBillingType] = useState<'hourly' | 'daily' | 'weekly' | 'monthly'>('hourly');

  // Image Category Tab: '官方镜像' | '我的镜像' | '热门镜像'
  const [imageCategory, setImageCategory] = useState<'官方镜像' | '我的镜像' | '热门镜像'>('官方镜像');

  // 动态联动：仅展示状态为“已启用”或“上架”的镜像 (使用 useMemo 保持引用稳定，防止每次 Render 重设 state)
  const availableImages = useMemo(() => {
    return (computeImages || []).filter(
      img => img.status === '已启用' || img.status === '上架'
    );
  }, [computeImages]);

  // Selected Image ID
  const [selectedImageId, setSelectedImageId] = useState<string>('img_pytorch_222');

  // 到期自动归还设置
  const [autoReturnOnExpiry, setAutoReturnOnExpiry] = useState(false);

  // 镜像卡片展开详情状态
  const [expandedImageIds, setExpandedImageIds] = useState<Record<string, boolean>>({});

  const toggleExpandImage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedImageIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Allowed GPU counts derived from card or maxGpuCount
  const allowedCounts: number[] = 
    currentCard.allowedGpuCounts && currentCard.allowedGpuCounts.length > 0 
      ? currentCard.allowedGpuCounts 
      : (currentCard.maxGpuCount ? Array.from({ length: currentCard.maxGpuCount }, (_, i) => i + 1) : [1, 2, 4]);

  // GPU count selected (e.g. 1 x RTX PRO 6000)
  const [gpuCount, setGpuCount] = useState<number>(allowedCounts[0] || 1);

  // 仅在 Modal 打开或更换预设规格时重置计费方式与选卡，避免因为重渲染导致 billingType 被重置为 hourly
  useEffect(() => {
    if (createComputeModalOpen) {
      setBillingType('hourly');
      if (createComputePreset?.card) {
        const counts = createComputePreset.card.allowedGpuCounts;
        if (counts && counts.length > 0) {
          setGpuCount(counts[0]);
        } else {
          setGpuCount(1);
        }
      }
    }
  }, [createComputeModalOpen, createComputePreset]);

  useEffect(() => {
    if (availableImages.length > 0 && (!selectedImageId || !availableImages.some(img => img.id === selectedImageId))) {
      setSelectedImageId(availableImages[0].id);
    }
  }, [availableImages, selectedImageId]);

  // Ensure gpuCount is always valid in allowedCounts
  useEffect(() => {
    if (!allowedCounts.includes(gpuCount)) {
      setGpuCount(allowedCounts[0] || 1);
    }
  }, [allowedCounts, gpuCount]);

  if (!createComputeModalOpen) return null;

  // Extract base numerical values for hardware scaling
  const parseNum = (str: string | number | undefined, defaultVal: number) => {
    if (typeof str === 'number') return str;
    if (!str) return defaultVal;
    const match = str.match(/(\d+(\.\d+)?)/);
    return match ? parseFloat(match[1]) : defaultVal;
  };

  const baseVramNum = parseNum(currentCard.vram, 24);
  const baseCpuNum = currentCard.perCardCpu || parseNum(currentCard.cpu, 16);
  const baseRamNum = currentCard.perCardRam || parseNum(currentCard.ram, 60);
  const baseDiskNum = currentCard.perCardDisk || parseNum(currentCard.disk, 750);

  // Scaled hardware specs
  const scaledVram = `${(baseVramNum * gpuCount).toFixed(0)} GB`;
  const scaledCpu = `${Math.round(baseCpuNum * gpuCount)} 核`;
  const scaledRam = `${Math.round(baseRamNum * gpuCount)} GB`;
  const scaledDisk = `${Math.round(baseDiskNum * gpuCount)} GB NVMe`;

  // Scaled prices (总价 = 单卡价格 × 显卡数量)
  const singleHourly = currentCard.hourlyPrice ?? 1.88;
  const scaledHourly = (singleHourly * gpuCount).toFixed(2);
  const scaledDaily = currentCard.dayPrice ? currentCard.dayPrice * gpuCount : null;
  const scaledWeekly = currentCard.weekPrice ? currentCard.weekPrice * gpuCount : null;
  const scaledMonthly = currentCard.monthPrice ? currentCard.monthPrice * gpuCount : null;

  // 根据当前选择的 billingType 动态计算显示价格文案与计费说明
  let currentBillingLabel = '按量计费';
  let currentDisplayPrice = `¥${scaledHourly}/h`;
  let currentPriceText = `¥${scaledHourly}`;

  if (billingType === 'daily') {
    currentBillingLabel = '包日租用';
    currentDisplayPrice = scaledDaily ? `¥${scaledDaily}/天` : `未开放日租`;
    currentPriceText = scaledDaily ? `¥${scaledDaily}` : '-';
  } else if (billingType === 'weekly') {
    currentBillingLabel = '包周租用';
    currentDisplayPrice = scaledWeekly ? `¥${scaledWeekly}/周` : `未开放周租`;
    currentPriceText = scaledWeekly ? `¥${scaledWeekly}` : '-';
  } else if (billingType === 'monthly') {
    currentBillingLabel = '包月租用';
    currentDisplayPrice = scaledMonthly ? `¥${scaledMonthly}/月` : `未开放月租`;
    currentPriceText = scaledMonthly ? `¥${scaledMonthly}` : '-';
  }

  const displayImages = availableImages.length > 0 ? availableImages : [
    {
      id: 'img_pytorch_222',
      name: 'PyTorch 2.2.2 - CUDA 12.1',
      size: '15.3 GB',
      refCount: 14,
      category: 'PyTorch',
      type: '官方',
      description: '预装 CUDA 12.1 + PyTorch 2.2.2'
    }
  ];

  const selectedImageObj = displayImages.find(img => img.id === selectedImageId) || displayImages[0];

  const handleStartUse = () => {
    let mappedBilling: GPUInstance['billingType'] = '按量计费';
    if (billingType === 'daily') mappedBilling = '包日';
    if (billingType === 'weekly') mappedBilling = '包周';
    if (billingType === 'monthly') mappedBilling = '包月';

    // 计算创建启动实例所需的预估启动金额
    const requiredAmount = 
      billingType === 'daily' ? (scaledDaily ?? singleHourly * 24 * gpuCount) :
      billingType === 'weekly' ? (scaledWeekly ?? singleHourly * 24 * 7 * gpuCount) :
      billingType === 'monthly' ? (scaledMonthly ?? singleHourly * 24 * 30 * gpuCount) :
      (Number(scaledHourly)); // 按量使用首小时启动额

    const userBalance = user?.balance ?? 0;

    // 判断当前用户的账户余额或积分是否允许他创建启动实例
    if (userBalance < requiredAmount) {
      setPendingRequiredAmount(requiredAmount);
      setShowInsufficientBalanceWarning(true);
      return;
    }

    launchGpuInstance(
      'Notebook开发',
      currentCard.gpuModel,
      selectedImageObj.name,
      {
        name: `${currentCard.title.toLowerCase()}-inst`,
        instanceType: 'container',
        gpuCount,
        vram: `${scaledVram} (${baseVramNum}GB × ${gpuCount}卡)`,
        cpu: `${scaledCpu} (${baseCpuNum}核 × ${gpuCount}卡)`,
        ram: `${scaledRam} (${baseRamNum}GB × ${gpuCount}卡)`,
        billingType: mappedBilling,
        hourlyCost: Number(scaledHourly),
        systemDisk: '50GB NVMe',
        dataDisk: scaledDisk
      }
    );

    showToast(`实例调度成功！已为您启动 ${gpuCount}×${currentCard.gpuModel} (${scaledVram} / ${scaledCpu})`);
    setCreateComputeModalOpen(false);
    setCreateComputePreset(null);
  };

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in select-none">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-slate-200">
        
        {/* Modal Scrollable Container */}
        <div className="flex-1 overflow-y-auto">
          
          {/* Top Banner */}
          <div className="relative bg-gradient-to-r from-amber-800 via-amber-700 to-amber-900 text-white p-6 overflow-hidden">
            {/* Background Light Pattern */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {/* NVIDIA Icon Badge */}
                  <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center border border-white/20 font-black text-xl text-emerald-400">
                    <Cpu className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
                      <span>{gpuCount > 1 ? `${gpuCount} × ` : ''}{currentCard.title}</span>
                      <span className="text-xs bg-amber-500/30 text-amber-100 px-2.5 py-0.5 rounded-full border border-amber-400/40 font-bold">
                        {currentCard.maxGpuCount ?? currentCard.availableCards} 卡可用
                      </span>
                      {gpuCount > 1 && (
                        <span className="text-xs bg-emerald-500/30 text-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-400/40 font-bold">
                          多卡协同加速
                        </span>
                      )}
                    </h2>
                    <p className="text-[11px] text-amber-200/90 mt-0.5">
                      GPU型号：{currentCard.gpuModel} · 当前选中 {gpuCount} 卡配置 (已按 {gpuCount} 倍比例扩展算力与内存)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCreateComputeModalOpen(false);
                    setCreateComputePreset(null);
                  }}
                  className="p-1.5 rounded-lg bg-black/20 hover:bg-black/40 text-white/80 hover:text-white transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Hardware Specs Pills (Dynamically Scaled with gpuCount) */}
              <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
                <span className="px-3 py-1 rounded-lg bg-black/30 text-amber-200 backdrop-blur-sm">
                  总显存: <strong className="text-white">{scaledVram}</strong> {gpuCount > 1 && <span className="text-amber-300/70 text-[10px]">({baseVramNum}G×{gpuCount})</span>}
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/30 text-amber-200 backdrop-blur-sm">
                  CPU: <strong className="text-white">{scaledCpu}</strong> {gpuCount > 1 && <span className="text-amber-300/70 text-[10px]">({baseCpuNum}核×{gpuCount})</span>}
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/30 text-amber-200 backdrop-blur-sm">
                  内存: <strong className="text-white">{scaledRam}</strong> {gpuCount > 1 && <span className="text-amber-300/70 text-[10px]">({baseRamNum}G×{gpuCount})</span>}
                </span>
                <span className="px-3 py-1 rounded-lg bg-black/30 text-amber-200 backdrop-blur-sm">
                  磁盘: <strong className="text-white">{scaledDisk}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Mining Warning Banner */}
          <div className="bg-amber-50 border-y border-amber-200/80 px-6 py-2.5 text-xs text-amber-900 font-medium flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>平台严禁任何形式的挖矿行为，如若发现账号封禁且不退款！</span>
            </div>
            {gpuCount > 1 && (
              <span className="text-[11px] text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded font-semibold shrink-0">
                已启用 {gpuCount} 卡多卡调度
              </span>
            )}
          </div>

          {/* Main Form Area */}
          <div className="p-6 space-y-6">
            
            {/* Section 1: Billing Method (计费方式 - 价格根据卡数成倍计算) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-extrabold text-slate-900">
                  计费方式 {gpuCount > 1 && <span className="text-xs font-normal text-slate-500">(已按 {gpuCount} 卡核算总价)</span>}
                </h3>
                {gpuCount > 1 && (
                  <span className="text-xs text-indigo-600 font-medium">
                    单卡 ¥{singleHourly.toFixed(2)}/h × {gpuCount} 卡
                  </span>
                )}
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {/* Hourly */}
                <div 
                  onClick={() => setBillingType('hourly')}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                    billingType === 'hourly' 
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  {billingType === 'hourly' && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-xs text-slate-600 font-bold">按量 ({gpuCount}卡总计)</div>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    <span className="text-emerald-600 font-bold text-xs">¥</span>
                    <span className="text-emerald-600 font-black text-2xl font-mono">{scaledHourly}</span>
                    <span className="text-slate-400 text-[11px] font-normal">/小时</span>
                  </div>
                </div>

                {/* Daily */}
                <div 
                  onClick={() => scaledDaily && setBillingType('daily')}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                    billingType === 'daily' 
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } ${!scaledDaily ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {billingType === 'daily' && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-xs text-slate-600 font-bold">日租 ({gpuCount}卡总计)</div>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    {scaledDaily ? (
                      <>
                        <span className="text-slate-800 font-bold text-xs">¥</span>
                        <span className="text-slate-900 font-black text-2xl font-mono">{scaledDaily}</span>
                        <span className="text-slate-400 text-[11px] font-normal">/天</span>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs py-1">未开放日租</span>
                    )}
                  </div>
                </div>

                {/* Weekly */}
                <div 
                  onClick={() => scaledWeekly && setBillingType('weekly')}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                    billingType === 'weekly' 
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } ${!scaledWeekly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {billingType === 'weekly' && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-xs text-slate-600 font-bold">周租 ({gpuCount}卡总计)</div>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    {scaledWeekly ? (
                      <>
                        <span className="text-slate-800 font-bold text-xs">¥</span>
                        <span className="text-slate-900 font-black text-2xl font-mono">{scaledWeekly}</span>
                        <span className="text-slate-400 text-[11px] font-normal">/周</span>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs py-1">未开放周租</span>
                    )}
                  </div>
                </div>

                {/* Monthly */}
                <div 
                  onClick={() => scaledMonthly && setBillingType('monthly')}
                  className={`p-4 rounded-xl border transition cursor-pointer relative flex flex-col justify-between ${
                    billingType === 'monthly' 
                      ? 'border-emerald-500 bg-white ring-1 ring-emerald-500 shadow-xs' 
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  } ${!scaledMonthly ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {billingType === 'monthly' && (
                    <div className="absolute top-2 right-2 text-emerald-500">
                      <Check className="w-5 h-5" />
                    </div>
                  )}
                  <div className="text-xs text-slate-600 font-bold">月租 ({gpuCount}卡总计)</div>
                  <div className="mt-2 flex items-baseline gap-0.5">
                    {scaledMonthly ? (
                      <>
                        <span className="text-slate-800 font-bold text-xs">¥</span>
                        <span className="text-slate-900 font-black text-2xl font-mono">{scaledMonthly}</span>
                        <span className="text-slate-400 text-[11px] font-normal">/月</span>
                      </>
                    ) : (
                      <span className="text-slate-400 text-xs py-1">未开放月租</span>
                    )}
                  </div>
                </div>
              </div>

              {/* 动态计费说明文案 (按量 / 日租 / 周租 / 月租) */}
              {billingType === 'hourly' && (
                <div className="p-3.5 rounded-xl bg-blue-50/80 border border-blue-200/80 text-[11px] text-slate-700 leading-relaxed space-y-1.5">
                  <div className="flex items-center gap-1.5 text-blue-900 font-bold">
                    <Info className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>按量计费说明</span>
                  </div>
                  <p>实例运行期间实时扣费，优先使用积分抵扣费用。当账户余额不足时，实例将被自动释放，请确保余额充足。</p>
                  <p className="text-slate-500">推荐您先用按量计费方式启动实例，验证环境是否满足需求。确认可用后，再切换为包日/包周/包月等长期租用模式，长期使用更优惠。</p>
                </div>
              )}

              {billingType === 'daily' && (
                <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-slate-700 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-amber-900 font-bold">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>日租计费说明</span>
                  </div>
                  <p>一次性买断该实例接下来24小时的使用权。该方式不支持中途提前退还，请在确认需求后选择。</p>
                  <p>日租到期后，将按下方的配置来决定自动切换为按量计费模式或是直接退还实例：</p>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-amber-300 font-semibold text-slate-800 my-0.5">
                    <input
                      type="checkbox"
                      checked={autoReturnOnExpiry}
                      onChange={e => setAutoReturnOnExpiry(e.target.checked)}
                      className="w-3.5 h-3.5 text-amber-600 rounded border-amber-400 focus:ring-amber-500"
                    />
                    <span>到期后自动归还实例</span>
                  </label>
                  <p className="text-slate-500">若需验证环境是否可用，建议先使用按量计费模式启动实例，确认可用后再转为长期租用即可。</p>
                </div>
              )}

              {billingType === 'weekly' && (
                <div className="p-3.5 rounded-xl bg-indigo-50/80 border border-indigo-200/80 text-[11px] text-slate-700 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-indigo-900 font-bold">
                    <Info className="w-4 h-4 text-indigo-600 shrink-0" />
                    <span>周租计费说明</span>
                  </div>
                  <p>一次性买断该实例接下来7天的使用权。该方式不支持中途提前退还，请在确认需求后选择。</p>
                  <p>周租到期后，将按下方的配置来决定自动切换为按量计费模式或是直接退还实例：</p>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-indigo-300 font-semibold text-slate-800 my-0.5">
                    <input
                      type="checkbox"
                      checked={autoReturnOnExpiry}
                      onChange={e => setAutoReturnOnExpiry(e.target.checked)}
                      className="w-3.5 h-3.5 text-indigo-600 rounded border-indigo-400 focus:ring-indigo-500"
                    />
                    <span>到期后自动归还实例</span>
                  </label>
                  <p className="text-slate-500">若需验证环境是否可用，建议先使用按量计费模式启动实例，确认可用后再转为长期租用即可。</p>
                </div>
              )}

              {billingType === 'monthly' && (
                <div className="p-3.5 rounded-xl bg-purple-50/80 border border-purple-200/80 text-[11px] text-slate-700 leading-relaxed space-y-2">
                  <div className="flex items-center gap-1.5 text-purple-900 font-bold">
                    <Info className="w-4 h-4 text-purple-600 shrink-0" />
                    <span>月租计费说明</span>
                  </div>
                  <p>一次性买断该实例接下来30天的使用权。该方式不支持中途提前退还，请在确认需求后选择。</p>
                  <p>月租到期后，将按下方的配置来决定自动切换为按量计费模式或是直接退还实例：</p>
                  <label className="inline-flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-purple-300 font-semibold text-slate-800 my-0.5">
                    <input
                      type="checkbox"
                      checked={autoReturnOnExpiry}
                      onChange={e => setAutoReturnOnExpiry(e.target.checked)}
                      className="w-3.5 h-3.5 text-purple-600 rounded border-purple-400 focus:ring-purple-500"
                    />
                    <span>到期后自动归还实例</span>
                  </label>
                  <p className="text-slate-500">若需验证环境是否可用，建议先使用按量计费模式启动实例，确认可用后再转为长期租用即可。</p>
                </div>
              )}
            </div>

            {/* Section 2: Choose Image (选择镜像) */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <h3 className="text-sm font-extrabold text-slate-900">选择镜像</h3>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                  {(['官方镜像', '我的镜像', '热门镜像'] as const).map(cat => (
                    <button
                      key={cat}
                      onClick={() => setImageCategory(cat)}
                      className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                        imageCategory === cat ? 'bg-blue-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Radio Item List */}
              <div className="space-y-2.5">
                {displayImages.map(img => {
                  const isExpanded = !!expandedImageIds[img.id];
                  return (
                    <div
                      key={img.id}
                      onClick={() => setSelectedImageId(img.id)}
                      className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col gap-2.5 ${
                        selectedImageId === img.id
                          ? 'border-blue-500 bg-white ring-1 ring-blue-500 shadow-xs'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="space-y-1">
                          <div className="font-extrabold text-slate-900 text-xs flex items-center gap-2">
                            <span>{img.name}</span>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                            <span className="px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-mono text-[10px]">
                              {img.size || '15.0 GB'}
                            </span>
                            <span>已引用 {img.refCount ?? 0} 次</span>
                            {img.category && (
                              <span className="px-1.5 py-0.2 rounded bg-blue-50 text-blue-600 text-[10px] font-bold border border-blue-200">
                                {img.category}
                              </span>
                            )}
                            
                            {/* 查看 / 收起 镜像详情 触发按钮 */}
                            <button
                              type="button"
                              onClick={(e) => toggleExpandImage(img.id, e)}
                              className="text-[11px] text-blue-600 hover:text-blue-700 font-bold hover:underline flex items-center gap-0.5 ml-1 transition cursor-pointer"
                            >
                              <span>{isExpanded ? '收起镜像详情' : '查看镜像详情'}</span>
                              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Radio circle */}
                        <div className="shrink-0">
                          <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            selectedImageId === img.id ? 'border-blue-600 bg-blue-600' : 'border-slate-300'
                          }`}>
                            {selectedImageId === img.id && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                        </div>
                      </div>

                      {/* 点击后在镜像卡片下方展开后台 Markdown 编辑配置的镜像详情 */}
                      {isExpanded && (
                        <div 
                          onClick={e => e.stopPropagation()}
                          className="pt-2.5 mt-0.5 border-t border-slate-100 text-slate-700 text-xs leading-relaxed bg-slate-50/90 p-3.5 rounded-xl border border-slate-200/80 animate-fade-in"
                        >
                          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                            <span>镜像环境与包含依赖库 (Markdown 详情)</span>
                          </div>
                          {img.description ? (
                            <div className="markdown-body prose prose-xs max-w-none text-slate-700">
                              <Markdown>{img.description}</Markdown>
                            </div>
                          ) : (
                            <div className="text-slate-400 italic text-[11px]">
                              管理员暂未为此镜像填写详细 Markdown 说明。
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

        {/* Modal Bottom Action Bar (动态读取 allowedGpuCounts 渲染卡数下拉选项) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Card Selector Dropdown - 动态基于规格配置生成 */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={gpuCount}
                onChange={(e) => setGpuCount(Number(e.target.value))}
                className="appearance-none bg-slate-200 hover:bg-slate-300/80 text-slate-800 font-extrabold text-xs pl-4 pr-9 py-2.5 rounded-xl outline-none cursor-pointer"
              >
                {allowedCounts.map(cnt => (
                  <option key={cnt} value={cnt}>
                    {cnt} × {currentCard.gpuModel} ({currentCard.title})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

            <span className="text-xs text-slate-500 hidden md:inline">
              最大可选 {Math.max(...allowedCounts)} 卡 · {currentBillingLabel} {currentDisplayPrice}
            </span>
          </div>

          {/* User Balance Status & Actions */}
          <div className="flex items-center gap-4">
            
            {/* Balance Preview Badge */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200/90 text-xs">
              <span className="text-slate-500">账户余额:</span>
              <span className="font-black text-slate-900 font-mono">¥{(user?.balance ?? 0).toFixed(2)}</span>
              <button
                type="button"
                onClick={() => openRechargeModal()}
                className="text-indigo-600 hover:text-indigo-700 font-black text-xs hover:underline cursor-pointer ml-1 flex items-center gap-0.5"
              >
                <span>充值</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => {
                  setCreateComputeModalOpen(false);
                  setCreateComputePreset(null);
                }}
                className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs cursor-pointer transition"
              >
                取消
              </button>

              <button
                onClick={handleStartUse}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs cursor-pointer shadow-md shadow-indigo-500/20 transition flex items-center gap-1.5"
              >
                <span>创建并启动</span>
                <span className="font-mono text-xs opacity-90">({currentDisplayPrice})</span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 账户余额或积分不足提示弹窗 */}
      {showInsufficientBalanceWarning && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-scale-up">
            <div className="p-5 bg-gradient-to-r from-amber-500 to-rose-500 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <AlertCircle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-black text-sm">账户余额不足提醒</h3>
                  <p className="text-[11px] text-amber-100 mt-0.5">需充值后方可成功创建并调度算力实例</p>
                </div>
              </div>
              <button
                onClick={() => setShowInsufficientBalanceWarning(false)}
                className="p-1 rounded-lg hover:bg-white/20 text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">实例启动预估费用：</span>
                  <span className="font-black text-rose-600 text-sm font-mono">¥{pendingRequiredAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">当前可用账户余额：</span>
                  <span className="font-bold text-slate-800 font-mono">¥{(user?.balance ?? 0).toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">当前可用积分：</span>
                  <span className="font-bold text-amber-600 font-mono">{(user?.points ?? 0).toLocaleString()} 积分</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <span className="text-slate-700 font-bold">尚需充值金额：</span>
                  <span className="font-black text-rose-600 text-base font-mono">
                    ¥{Math.max(0, pendingRequiredAmount - (user?.balance ?? 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <p className="text-[11px] text-slate-500 leading-relaxed">
                提示：为保障实例稳定运行，按量计费实例创建时需账户至少保有 1 小时预估运行资金。点击下方充值按钮可直接在当前页面打开充值弹窗。
              </p>

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowInsufficientBalanceWarning(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                >
                  稍后充值
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowInsufficientBalanceWarning(false);
                    openRechargeModal(Math.max(50, Math.ceil(pendingRequiredAmount - (user?.balance ?? 0))));
                  }}
                  className="flex-[1.8] py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Wallet className="w-4 h-4" />
                  <span>立即充值</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
