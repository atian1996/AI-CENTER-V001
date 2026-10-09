import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComputeSpecItem, ComputeImageAdminItem, ComputePoolItem } from '../../../types';
import {
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  X,
  Edit3,
  Trash2,
  Sparkles,
  Box,
  HardDrive,
  Check,
  Eye,
  Activity,
  Layers,
  ChevronLeft,
  ChevronRight,
  Info,
  Server,
  User,
  Clock,
  Zap,
  Flame,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Coins,
  ArrowLeft,
  ArrowRight,
  Building2,
  ExternalLink,
  ShieldAlert
} from 'lucide-react';

export const ComputeSpecAdminView: React.FC = () => {
  const {
    computeSpecs,
    computeImages,
    computePools,
    computeOrders,
    computeRunningInstances,
    addComputeSpec,
    updateComputeSpec,
    deleteComputeSpec,
    toggleComputeSpecStatus,
    setSelectedMainTab,
    showToast
  } = useApp();

  // 搜索与筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '上架' | '下架'>('all');
  const [gpuModelFilter, setGpuModelFilter] = useState<string>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 从资源池管理的同步数据中汇总去重 GPU 型号选项
  const availableGpuModels = useMemo(() => {
    const modelSet = new Set<string>();
    computePools.forEach(p => {
      if (p.distribution && Array.isArray(p.distribution)) {
        p.distribution.forEach(d => {
          if (d.gpuModel) modelSet.add(d.gpuModel.trim());
        });
      }
      if (p.gpuTypes && Array.isArray(p.gpuTypes)) {
        p.gpuTypes.forEach(t => {
          if (t) modelSet.add(t.trim());
        });
      }
    });

    // 常用预置兜底选项
    const fallbackList = [
      'NVIDIA RTX 4090',
      'NVIDIA A100-SXM4-80GB',
      'NVIDIA H800 80GB PCIe',
      'NVIDIA H100 SXM5 80GB',
      'NVIDIA RTX 3090',
      'NVIDIA L40S 48GB',
      'NVIDIA Tesla V100S-PCIE-32GB',
      'Huawei Ascend 910B NPU'
    ];
    fallbackList.forEach(m => modelSet.add(m));

    return Array.from(modelSet).sort();
  }, [computePools]);

  // 新增/编辑弹窗状态
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSpec, setCurrentSpec] = useState<ComputeSpecItem | null>(null);

  // 详情弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailSpec, setDetailSpec] = useState<ComputeSpecItem | null>(null);

  // 删除确认弹窗
  const [deleteConfirmSpec, setDeleteConfirmSpec] = useState<ComputeSpecItem | null>(null);

  // 前置依赖阻断弹窗状态
  const [depErrorModal, setDepErrorModal] = useState<{
    open: boolean;
    title: string;
    description: string;
    targetTab: 'compute_image' | 'compute_pool';
    buttonText: string;
  } | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<{
    name: string;
    gpuModel: string;
    allowedGpuCounts: number[];
    maxGpuCount: number;
    vramValue: number;
    vramUnit: 'GB' | 'TB';
    cpu: number;
    cpuModel: string;
    ramValue: number;
    ramUnit: 'GB' | 'TB';
    diskValue: number;
    diskUnit: 'GB' | 'TB';
    description: string;
    hourlyPrice: number;
    dayPrice: string;
    weekPrice: string;
    monthPrice: string;
    status: '上架' | '下架';
    linkedImageIds?: string[];
    linkedOperators?: string[];
  }>({
    name: '',
    gpuModel: 'NVIDIA RTX 4090',
    allowedGpuCounts: [1, 2, 4],
    maxGpuCount: 4,
    vramValue: 24,
    vramUnit: 'GB',
    cpu: 16,
    cpuModel: 'AMD EPYC 9354 32-Core Processor',
    ramValue: 60,
    ramUnit: 'GB',
    diskValue: 750,
    diskUnit: 'GB',
    description: '',
    hourlyPrice: 1.88,
    dayPrice: '42',
    weekPrice: '279',
    monthPrice: '1180',
    status: '上架'
  });

  // 计算当前选中的 GPU 型号在各上架资源池中的可用余量总和
  const availableStockForSelectedModel = useMemo(() => {
    if (!formData.gpuModel) return '-';
    let total = 0;
    let hasMatch = false;
    computePools.forEach(p => {
      if (p.saleStatus === '已下架') return;
      if (p.distribution && Array.isArray(p.distribution)) {
        p.distribution.forEach(d => {
          if (d.gpuModel === formData.gpuModel) {
            total += (d.available ?? 0);
            hasMatch = true;
          }
        });
      }
    });
    return hasMatch ? total : 0;
  }, [formData.gpuModel, computePools]);

  // 获取所有唯一的 GPU 型号列表用于筛选
  const allGpuModels = useMemo(() => {
    const set = new Set<string>();
    computeSpecs.forEach(s => {
      if (s.gpuModel) set.add(s.gpuModel);
    });
    return Array.from(set);
  }, [computeSpecs]);

  // 全局使用统计概览
  const stats = useMemo(() => {
    const total = computeSpecs.length;
    const online = computeSpecs.filter(s => s.status === '上架').length;
    const offline = computeSpecs.filter(s => s.status === '下架').length;
    const totalCreatedCount = computeSpecs.reduce((acc, curr) => acc + (curr.totalUsedCount ?? 0), 0);
    const recent7DaysTotal = computeSpecs.reduce((acc, curr) => acc + (curr.recent7DaysCount ?? 0), 0);

    // 计算最热门规格
    let mostPopularSpec = computeSpecs[0];
    computeSpecs.forEach(s => {
      if ((s.totalUsedCount ?? 0) > (mostPopularSpec?.totalUsedCount ?? 0)) {
        mostPopularSpec = s;
      }
    });

    return {
      total,
      online,
      offline,
      totalCreatedCount,
      recent7DaysTotal,
      mostPopularSpec
    };
  }, [computeSpecs]);

  // 检查规格是否允许删除
  const checkCanDelete = (spec: ComputeSpecItem) => {
    const hasBeenUsed = (spec.totalUsedCount ?? 0) > 0;
    const isUsedInOrders = computeOrders.some(
      o => o.specName.includes(spec.name) || o.specName.includes(spec.gpuModel)
    );
    const isUsedInInstances = computeRunningInstances.some(
      i => i.specName.includes(spec.name) || i.specName.includes(spec.gpuModel)
    );
    return !hasBeenUsed && !isUsedInOrders && !isUsedInInstances;
  };

  // 筛选列表
  const filteredSpecs = useMemo(() => {
    return computeSpecs.filter(spec => {
      const q = searchTerm.trim().toLowerCase();
      const matchSearch =
        !q ||
        spec.name.toLowerCase().includes(q) ||
        spec.gpuModel.toLowerCase().includes(q) ||
        (spec.cpuModel && spec.cpuModel.toLowerCase().includes(q)) ||
        (spec.description && spec.description.toLowerCase().includes(q));

      const matchStatus = statusFilter === 'all' || spec.status === statusFilter;
      const matchGpuModel = gpuModelFilter === 'all' || spec.gpuModel === gpuModelFilter;

      return matchSearch && matchStatus && matchGpuModel;
    });
  }, [computeSpecs, searchTerm, statusFilter, gpuModelFilter]);

  // 分页数据
  const totalPages = Math.max(1, Math.ceil(filteredSpecs.length / pageSize));
  const paginatedSpecs = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredSpecs.slice(start, start + pageSize);
  }, [filteredSpecs, currentPage]);

  // 切换允许的 GPU 挂载卡数
  const toggleAllowedGpuCount = (count: number) => {
    setFormData(prev => {
      const exists = prev.allowedGpuCounts.includes(count);
      let updated: number[];
      if (exists) {
        if (prev.allowedGpuCounts.length === 1) {
          showToast('至少需要保留一个可选卡数');
          return prev;
        }
        updated = prev.allowedGpuCounts.filter(c => c !== count);
      } else {
        updated = [...prev.allowedGpuCounts, count].sort((a, b) => a - b);
      }
      return {
        ...prev,
        allowedGpuCounts: updated,
        maxGpuCount: Math.max(...updated)
      };
    });
  };

  // 变更 GPU 芯片型号时自动带出推荐显存
  const handleGpuModelChange = (model: string) => {
    let defaultVram = 24;
    if (model.includes('A100') || model.includes('H100') || model.includes('H800')) {
      defaultVram = 80;
    } else if (model.includes('L40S') || model.includes('A6000') || model.includes('PRO 6000')) {
      defaultVram = 48;
    } else if (model.includes('3090') || model.includes('4090')) {
      defaultVram = 24;
    } else if (model.includes('3080')) {
      defaultVram = 10;
    } else if (model.includes('V100')) {
      defaultVram = 32;
    }

    setFormData(prev => ({
      ...prev,
      gpuModel: model,
      vramValue: defaultVram
    }));
  };

  // 打开新增规格弹窗
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentSpec(null);
    setFormData({
      name: '',
      gpuModel: 'NVIDIA RTX 4090',
      allowedGpuCounts: [1, 2, 4],
      maxGpuCount: 4,
      vramValue: 24,
      vramUnit: 'GB',
      cpu: 16,
      cpuModel: 'AMD EPYC 9354 32-Core Processor',
      ramValue: 60,
      ramUnit: 'GB',
      diskValue: 750,
      diskUnit: 'GB',
      description: '',
      hourlyPrice: 1.88,
      dayPrice: '42',
      weekPrice: '279',
      monthPrice: '1180',
      status: '上架'
    });
    setEditModalOpen(true);
  };

  // 打开编辑规格弹窗
  const handleOpenEdit = (spec: ComputeSpecItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditing(true);
    setCurrentSpec(spec);

    // 解析显存数值与单位
    let vramVal = 24;
    let vramU: 'GB' | 'TB' = 'GB';
    if (spec.vramValue) {
      vramVal = spec.vramValue;
      vramU = spec.vramUnit || 'GB';
    } else if (spec.vram) {
      const match = spec.vram.match(/(\d+)\s*(GB|TB)/i);
      if (match) {
        vramVal = parseInt(match[1], 10);
        vramU = (match[2].toUpperCase() as 'GB' | 'TB') || 'GB';
      }
    }

    const gpuCounts = spec.allowedGpuCounts && spec.allowedGpuCounts.length > 0 
      ? spec.allowedGpuCounts 
      : [1, 2, 4];
    const maxCount = spec.maxGpuCount || Math.max(...gpuCounts);

    setFormData({
      name: spec.name,
      gpuModel: spec.gpuModel,
      allowedGpuCounts: gpuCounts,
      maxGpuCount: maxCount,
      vramValue: vramVal,
      vramUnit: vramU,
      cpu: spec.cpu,
      cpuModel: spec.cpuModel || '',
      ramValue: spec.ram || 60,
      ramUnit: spec.ramUnit || 'GB',
      diskValue: spec.disk || 750,
      diskUnit: spec.diskUnit || 'GB',
      description: spec.description || '',
      hourlyPrice: spec.hourlyPrice,
      dayPrice: spec.dayPrice !== undefined ? String(spec.dayPrice) : '',
      weekPrice: spec.weekPrice !== undefined ? String(spec.weekPrice) : '',
      monthPrice: spec.monthPrice !== undefined ? String(spec.monthPrice) : '',
      status: spec.status || '上架'
    });
    setEditModalOpen(true);
  };

  // 打开详情弹窗
  const handleOpenDetail = (spec: ComputeSpecItem) => {
    setDetailSpec(spec);
    setDetailModalOpen(true);
  };

  // 提交保存
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    // 必填校验
    if (!formData.name.trim()) {
      showToast('请输入规格名称');
      return;
    }
    if (formData.name.length > 30) {
      showToast('规格名称不能超过 30 个字符');
      return;
    }
    if (!formData.gpuModel.trim()) {
      showToast('请输入 GPU 型号');
      return;
    }
    if (!formData.allowedGpuCounts || formData.allowedGpuCounts.length === 0) {
      showToast('请至少选择一个可选GPU数量');
      return;
    }
    if (!formData.vramValue || formData.vramValue <= 0) {
      showToast('请输入有效的显存大小');
      return;
    }
    if (!formData.cpu || formData.cpu <= 0) {
      showToast('请输入有效的 CPU 核数');
      return;
    }
    if (!formData.ramValue || formData.ramValue <= 0) {
      showToast('请输入有效的内存大小');
      return;
    }
    if (!formData.diskValue || formData.diskValue <= 0) {
      showToast('请输入有效的硬盘容量');
      return;
    }
    if (!formData.hourlyPrice || formData.hourlyPrice <= 0) {
      showToast('按量价格必须大于 0 元/小时');
      return;
    }

    const sortedGpuCounts = [...formData.allowedGpuCounts].sort((a, b) => a - b);
    const maxGpu = Math.max(...sortedGpuCounts);

    const payload = {
      name: formData.name.trim(),
      gpuModel: formData.gpuModel.trim(),
      allowedGpuCounts: sortedGpuCounts,
      maxGpuCount: maxGpu,
      vram: `${formData.vramValue} ${formData.vramUnit}`,
      vramValue: Number(formData.vramValue),
      vramUnit: formData.vramUnit,
      cpu: Number(formData.cpu),
      cpuModel: formData.cpuModel?.trim() || undefined,
      ram: Number(formData.ramValue),
      ramUnit: formData.ramUnit,
      disk: Number(formData.diskValue),
      diskUnit: formData.diskUnit,
      description: formData.description?.trim() || undefined,
      hourlyPrice: Number(formData.hourlyPrice),
      dayPrice: formData.dayPrice ? Number(formData.dayPrice) : undefined,
      weekPrice: formData.weekPrice ? Number(formData.weekPrice) : undefined,
      monthPrice: formData.monthPrice ? Number(formData.monthPrice) : undefined,
      status: formData.status,
      totalUsedCount: currentSpec?.totalUsedCount ?? 0,
      recent7DaysCount: currentSpec?.recent7DaysCount ?? 0,
      operator: '默认运营商'
    };

    if (isEditing && currentSpec) {
      updateComputeSpec(currentSpec.id, payload);
      // 如果当前正在查看此详情，同步更新详情
      if (detailSpec && detailSpec.id === currentSpec.id) {
        setDetailSpec({ ...detailSpec, ...payload });
      }
    } else {
      const ok = addComputeSpec(payload);
      if (!ok) return;
    }

    setEditModalOpen(false);
  };

  // 处理删除
  const handleDeleteClick = (spec: ComputeSpecItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const canDelete = checkCanDelete(spec);
    if (!canDelete) {
      showToast('该规格已被使用，无法删除');
      return;
    }
    setDeleteConfirmSpec(spec);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirmSpec) return;
    const ok = deleteComputeSpec(deleteConfirmSpec.id);
    if (ok) {
      if (detailModalOpen && detailSpec?.id === deleteConfirmSpec.id) {
        setDetailModalOpen(false);
      }
    }
    setDeleteConfirmSpec(null);
  };

  // 快捷切换镜像选中
  const toggleImageSelect = (imgId: string) => {
    setFormData(prev => {
      const exists = prev.linkedImageIds.includes(imgId);
      if (exists) {
        if (prev.linkedImageIds.length === 1) {
          showToast('至少需要保留一个关联镜像');
          return prev;
        }
        return {
          ...prev,
          linkedImageIds: prev.linkedImageIds.filter(id => id !== imgId)
        };
      } else {
        return {
          ...prev,
          linkedImageIds: [...prev.linkedImageIds, imgId]
        };
      }
    });
  };

  // 快捷切换运营商选中
  const toggleOperatorSelect = (opName: string) => {
    setFormData(prev => {
      const exists = prev.linkedOperators.includes(opName);
      if (exists) {
        if (prev.linkedOperators.length === 1) {
          showToast('至少需要保留一个关联运营商');
          return prev;
        }
        return {
          ...prev,
          linkedOperators: prev.linkedOperators.filter(op => op !== opName)
        };
      } else {
        return {
          ...prev,
          linkedOperators: [...prev.linkedOperators, opName]
        };
      }
    });
  };

  if (editModalOpen) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回规格列表</span>
            </button>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {isEditing ? `编辑实例规格: ${formData.name}` : '新增实例规格'}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                定义 GPU 模板的硬件参数、关联镜像生态、可部署运营商及多租期定价策略
              </p>
            </div>
          </div>
          <button
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
          >
            {isEditing ? '保存修改' : '确认创建'}
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSave} className="space-y-6 text-xs">
            {/* 第一部分：硬件配置 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                第一部分：硬件配置
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 规格名称 */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>规格名称 *</span>
                    <span className="text-[11px] font-normal text-slate-400">例: RTX 4090 (24GB) 1/2/4卡通用</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="请输入规格标准名称"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                {/* GPU 芯片型号选择 */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200 flex items-center justify-between">
                    <span>GPU 芯片型号 *</span>
                    <span className="text-[11px] font-normal text-slate-400">来自已启用的资源池或支持的基础设施</span>
                  </label>
                  <select
                    value={formData.gpuModel}
                    onChange={e => handleGpuModelChange(e.target.value)}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
                  >
                    {availableGpuModels.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 多卡挂载策略 */}
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-semibold text-slate-200 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    <span>可选 GPU 挂载数量 *</span>
                  </label>
                  <span className="text-[11px] text-slate-400">勾选用户在租用时可选择的 GPU 卡数</span>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  {[1, 2, 4, 8].map(count => {
                    const isChecked = formData.allowedGpuCounts.includes(count);
                    return (
                      <button
                        key={count}
                        type="button"
                        onClick={() => toggleAllowedGpuCount(count)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold font-mono transition cursor-pointer flex items-center gap-2 border ${
                          isChecked
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center border text-[10px] ${
                          isChecked ? 'bg-blue-500 border-blue-400 text-white font-bold' : 'border-slate-700 bg-slate-950'
                        }`}>
                          {isChecked ? '✓' : ''}
                        </span>
                        <span>{count} 卡 ({count * formData.vramValue} GB 显存)</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 显存、CPU、内存、硬盘 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* 显存容量 */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">单卡显存容量 *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.vramValue}
                      onChange={e => setFormData({ ...formData, vramValue: Number(e.target.value) })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <select
                      value={formData.vramUnit}
                      onChange={e => setFormData({ ...formData, vramUnit: e.target.value as any })}
                      className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
                    >
                      <option value="GB">GB</option>
                      <option value="MB">MB</option>
                    </select>
                  </div>
                </div>

                {/* CPU 核心数 */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">单卡 CPU 核心数 (核) *</label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formData.cpu}
                    onChange={e => setFormData({ ...formData, cpu: Number(e.target.value) })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                {/* 系统内存 */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">单卡系统内存 *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min={1}
                      value={formData.ramValue}
                      onChange={e => setFormData({ ...formData, ramValue: Number(e.target.value) })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <select
                      value={formData.ramUnit}
                      onChange={e => setFormData({ ...formData, ramUnit: e.target.value as any })}
                      className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
                    >
                      <option value="GB">GB</option>
                      <option value="TB">TB</option>
                    </select>
                  </div>
                </div>

                {/* 系统盘/数据盘 */}
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">单卡数据盘容量 *</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      required
                      min={10}
                      value={formData.diskValue}
                      onChange={e => setFormData({ ...formData, diskValue: Number(e.target.value) })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                    />
                    <select
                      value={formData.diskUnit}
                      onChange={e => setFormData({ ...formData, diskUnit: e.target.value as any })}
                      className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
                    >
                      <option value="GB">GB</option>
                      <option value="TB">TB</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* CPU 具体处理器型号选填 */}
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200 flex items-center justify-between">
                  <span>CPU 处理器型号 (选填)</span>
                  <span className="text-[11px] font-normal text-slate-500">例: AMD EPYC 9354 32-Core Processor</span>
                </label>
                <input
                  type="text"
                  placeholder="请输入详细 CPU 型号描述"
                  value={formData.cpuModel}
                  onChange={e => setFormData({ ...formData, cpuModel: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 第二部分：关联镜像生态与推荐适配框架 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  第二部分：关联镜像生态与兼容生态
                </div>
                <span className="text-[11px] text-slate-400">已选 {formData.linkedImageIds.length} 个镜像模板</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                <p className="text-slate-400">选择当前规格支持部署的公共及预置镜像 (默认关联全量可用镜像):</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
                  {computeImages.map(img => {
                    const isSelected = formData.linkedImageIds.includes(img.id);
                    return (
                      <div
                        key={img.id}
                        onClick={() => toggleImageSelect(img.id)}
                        className={`p-2.5 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600/15 border-indigo-500/50 text-slate-100'
                            : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 overflow-hidden">
                          <Layers className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-indigo-400' : 'text-slate-500'}`} />
                          <div className="truncate font-medium">{img.name}</div>
                        </div>
                        <span className={`w-4 h-4 rounded flex items-center justify-center text-[10px] font-bold border shrink-0 ${
                          isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-950'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 第三部分：部署运营商与可用资源池 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  第三部分：关联算力运营商与部署集群
                </div>
                <span className="text-[11px] text-slate-400">已勾选 {formData.linkedOperators.length} 个运营商</span>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 space-y-3">
                <p className="text-slate-400">勾选允许上架投放该规格的算力基础设施提供商:</p>
                <div className="flex flex-wrap items-center gap-3">
                  {Array.from(new Set(computePools.map(p => p.operator))).map(op => {
                    const isSelected = formData.linkedOperators.includes(op);
                    return (
                      <button
                        key={op}
                        type="button"
                        onClick={() => toggleOperatorSelect(op)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer flex items-center gap-2 border ${
                          isSelected
                            ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300'
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                        }`}
                      >
                        <Building2 className="w-3.5 h-3.5" />
                        <span>{op}</span>
                        <span className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] border ${
                          isSelected ? 'bg-emerald-500 border-emerald-400 text-slate-950 font-bold' : 'border-slate-700 bg-slate-950'
                        }`}>
                          {isSelected ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 第四部分：多租期定价策略与上架状态 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  第四部分：多租期定价策略与状态控制
                </div>
                <span className="text-[11px] text-slate-400">单位: 元 (¥) / 单卡</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {/* 按量计费 */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <label className="font-bold text-slate-200 flex items-center justify-between">
                    <span>按量计费 (元/小时/卡) *</span>
                    <span className="text-[10px] text-amber-400 font-mono">必填</span>
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0.01"
                    value={formData.hourlyPrice}
                    onChange={e => setFormData({ ...formData, hourlyPrice: Number(e.target.value) })}
                    className="w-full bg-slate-900 border border-slate-700 text-amber-400 font-bold text-sm rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                {/* 包日 */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <label className="font-bold text-slate-200 flex items-center justify-between">
                    <span>日租包天 (元/天/卡)</span>
                    <span className="text-[10px] text-slate-500">留空为不支持</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="如: 42.00"
                    value={formData.dayPrice}
                    onChange={e => setFormData({ ...formData, dayPrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                {/* 包周 */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <label className="font-bold text-slate-200 flex items-center justify-between">
                    <span>周租包周 (元/周/卡)</span>
                    <span className="text-[10px] text-slate-500">留空为不支持</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="如: 279.00"
                    value={formData.weekPrice}
                    onChange={e => setFormData({ ...formData, weekPrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>

                {/* 包月 */}
                <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-950/60 border border-slate-800">
                  <label className="font-bold text-slate-200 flex items-center justify-between">
                    <span>月租包月 (元/月/卡)</span>
                    <span className="text-[10px] text-slate-500">留空为不支持</span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="如: 1099.00"
                    value={formData.monthPrice}
                    onChange={e => setFormData({ ...formData, monthPrice: e.target.value })}
                    className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-amber-500 font-mono"
                  />
                </div>
              </div>

              {/* 上架与简要说明 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-semibold text-slate-200">规格简要描述与推荐场景 (选填)</label>
                  <input
                    type="text"
                    placeholder="例: 高性价比消费级卡，适配中小型 LLM 微调及 SDXL 图像生成"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">初始投放状态 *</label>
                  <div className="flex items-center gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: '上架' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                        formData.status === '上架'
                          ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>上架开启</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, status: '下架' })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border cursor-pointer ${
                        formData.status === '下架'
                          ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                          : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>暂不下架</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 弹窗底部操作 */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              >
                取消
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
              >
                {isEditing ? '保存修改' : '确认创建'}
              </button>
            </div>
          </form>
      </div>
    );
  }

  if (detailModalOpen && detailSpec) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100 animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setDetailModalOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回规格列表</span>
            </button>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-slate-100">{detailSpec.name}</h3>
                {detailSpec.status === '上架' ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    已上架
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                    已下架
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">{detailSpec.gpuModel}</p>
            </div>
          </div>
          <button
            onClick={() => {
              setDetailModalOpen(false);
              handleOpenEdit(detailSpec);
            }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>编辑规格</span>
          </button>
        </div>

        {/* Body */}
        <div className="space-y-6 text-xs">
          {/* 1. 基本信息区 */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Server className="w-3.5 h-3.5 text-blue-400" />
                基本信息区
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                <div>
                  <span className="text-[11px] text-slate-500 block">GPU 规格</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block font-mono">
                    {detailSpec.gpuModel}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">显存容量</span>
                  <span className="text-xs font-semibold text-cyan-400 mt-0.5 block">
                    {detailSpec.vram}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">CPU 处理器</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                    {detailSpec.cpu} 核 {detailSpec.cpuModel ? `(${detailSpec.cpuModel})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">系统内存</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                    {detailSpec.ram} {detailSpec.ramUnit || 'GB'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">存储硬盘</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                    {detailSpec.disk} {detailSpec.diskUnit || 'GB'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-500 block">默认部署运营商</span>
                  <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                    {detailSpec.operator || '算力云官方'}
                  </span>
                </div>
                <div className="col-span-2">
                  <span className="text-[11px] text-slate-500 block">说明描述</span>
                  <span className="text-xs text-slate-300 mt-0.5 block">
                    {detailSpec.description || '暂无描述信息'}
                  </span>
                </div>
              </div>
            </div>

            {/* 2. 多租期定价策略区 */}
            <div>
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                多租期定价策略
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500">按量计费单价</span>
                  <div className="text-sm font-bold text-amber-400 mt-1 font-mono">
                    ¥{detailSpec.hourlyPrice} <span className="text-xs text-slate-500 font-normal">/小时</span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500">单卡日租价格</span>
                  <div className="text-sm font-bold text-slate-200 mt-1 font-mono">
                    {detailSpec.dayPrice ? (
                      <>
                        ¥{detailSpec.dayPrice}{' '}
                        <span className="text-xs text-slate-500 font-normal">/天</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500 font-normal">未开放日租</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500">单卡周租价格</span>
                  <div className="text-sm font-bold text-slate-200 mt-1 font-mono">
                    {detailSpec.weekPrice ? (
                      <>
                        ¥{detailSpec.weekPrice}{' '}
                        <span className="text-xs text-slate-500 font-normal">/周</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500 font-normal">未开放周租</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                  <span className="text-[11px] text-slate-500">单卡月租价格</span>
                  <div className="text-sm font-bold text-slate-200 mt-1 font-mono">
                    {detailSpec.monthPrice ? (
                      <>
                        ¥{detailSpec.monthPrice}{' '}
                        <span className="text-xs text-slate-500 font-normal">/月</span>
                      </>
                    ) : (
                      <span className="text-xs text-slate-500 font-normal">未开放月租</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. 可选显卡数量与多卡等比资源分配对照表 */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  多卡等比分配与价格对照表
                </h4>
                <span className="text-[11px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
                  最大可选: {detailSpec.maxGpuCount || Math.max(...(detailSpec.allowedGpuCounts || [1, 2, 4]))} 卡
                </span>
              </div>

              <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3.5">GPU 档位</th>
                        <th className="py-2.5 px-3.5">总显存</th>
                        <th className="py-2.5 px-3.5">等比 CPU</th>
                        <th className="py-2.5 px-3.5">等比内存</th>
                        <th className="py-2.5 px-3.5">等比硬盘</th>
                        <th className="py-2.5 px-3.5 text-right">按量计费</th>
                        <th className="py-2.5 px-3.5 text-right">日租总价</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 font-mono text-slate-300">
                      {(detailSpec.allowedGpuCounts && detailSpec.allowedGpuCounts.length > 0 
                        ? detailSpec.allowedGpuCounts 
                        : [1, 2, 4]
                      ).map(cnt => {
                        const totalVram = cnt * detailSpec.vramValue;
                        const totalCpu = cnt * detailSpec.cpu;
                        const totalRam = cnt * detailSpec.ram;
                        const totalDisk = cnt * detailSpec.disk;
                        const totalHourly = (cnt * detailSpec.hourlyPrice).toFixed(2);
                        const totalDay = detailSpec.dayPrice ? (cnt * detailSpec.dayPrice).toFixed(2) : '-';

                        return (
                          <tr key={cnt} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3.5 font-bold text-slate-100">{cnt} 卡</td>
                            <td className="py-2.5 px-3.5 text-cyan-400">{totalVram} GB</td>
                            <td className="py-2.5 px-3.5">{totalCpu} 核</td>
                            <td className="py-2.5 px-3.5">{totalRam} GB</td>
                            <td className="py-2.5 px-3.5">{totalDisk} GB</td>
                            <td className="py-2.5 px-3.5 text-right text-amber-400 font-bold">¥{totalHourly} /h</td>
                            <td className="py-2.5 px-3.5 text-right font-bold">{totalDay !== '-' ? `¥${totalDay}` : '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 4. 关联镜像生态与资源池明细 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* 关联镜像生态 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-400" />
                    关联可用镜像模板
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {(detailSpec.linkedImageIds || []).length} 个镜像
                  </span>
                </h5>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
                  {(detailSpec.linkedImageIds && detailSpec.linkedImageIds.length > 0) ? (
                    detailSpec.linkedImageIds.map(imgId => {
                      const imgObj = computeImages.find(i => i.id === imgId);
                      return (
                        <span key={imgId} className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300 font-mono">
                          {imgObj ? imgObj.name : imgId}
                        </span>
                      );
                    })
                  ) : (
                    <span className="text-slate-500 text-[11px]">全部默认公共镜像</span>
                  )}
                </div>
              </div>

              {/* 关联支持运营商 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <h5 className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400" />
                    投放的算力基础设施运营商
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">
                    {(detailSpec.linkedOperators || []).length} 个运营商
                  </span>
                </h5>
                <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pt-1">
                  {(detailSpec.linkedOperators && detailSpec.linkedOperators.length > 0) ? (
                    detailSpec.linkedOperators.map(op => (
                      <span key={op} className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-300 font-bold">
                        {op}
                      </span>
                    ))
                  ) : (
                    <span className="text-slate-500 text-[11px]">默认全域运营商</span>
                  )}
                </div>
              </div>
            </div>

            {/* 5. 实时使用统计与创建时间 */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/80">
              <div>
                <span className="text-[11px] text-slate-500 block">全站总占用创建实例数</span>
                <span className="text-xs font-bold text-indigo-400 mt-0.5 block font-mono">
                  {detailSpec.totalUsedCount || 0} 台次
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">近7天新增激活数</span>
                <span className="text-xs font-bold text-emerald-400 mt-0.5 block font-mono">
                  +{detailSpec.recent7DaysCount || 0} 台
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">规格建立时间</span>
                <span className="text-xs text-slate-400 mt-0.5 block font-mono">
                  {detailSpec.createTime || '2026-08-01'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">最后更新记录</span>
                <span className="text-xs text-slate-400 mt-0.5 block font-mono">
                  {detailSpec.updateTime || '2026-08-18'}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <div className="text-xs text-slate-500">规格 ID: {detailSpec.id}</div>
            <button
              onClick={() => setDetailModalOpen(false)}
              className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
            >
              关闭
            </button>
          </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 搜索、筛选与操作工具栏 */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* 搜索框 */}
          <div className="relative min-w-[240px] flex-1 sm:flex-initial">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索规格名称、GPU或CPU型号..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3.5 py-2.5 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-500"
            />
          </div>

          {/* 状态筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">状态:</span>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="上架">已上架</option>
              <option value="下架">已下架</option>
            </select>
          </div>

          {/* GPU 型号筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">GPU型号:</span>
            <select
              value={gpuModelFilter}
              onChange={e => {
                setGpuModelFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">全部型号</option>
              {allGpuModels.map(model => (
                <option key={model} value={model}>{model}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 重置筛选 */}
          {(searchTerm || statusFilter !== 'all' || gpuModelFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setGpuModelFilter('all');
                setCurrentPage(1);
              }}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              重置
            </button>
          )}

          <div className="text-xs text-slate-400">
            共 <span className="text-blue-400 font-semibold">{filteredSpecs.length}</span> 条规格
          </div>

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            新增规格
          </button>
        </div>
      </div>

      {/* 规格列表表格 */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">规格名称</th>
                <th className="py-3.5 px-4">GPU 型号</th>
                <th className="py-3.5 px-4">显存大小</th>
                <th className="py-3.5 px-4">CPU 核数</th>
                <th className="py-3.5 px-4">内存容量</th>
                <th className="py-3.5 px-4">硬盘容量</th>
                <th className="py-3.5 px-4">按量单价</th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedSpecs.length > 0 ? (
                paginatedSpecs.map(spec => {
                  const canDelete = checkCanDelete(spec);

                  return (
                    <tr
                      key={spec.id}
                      className="hover:bg-slate-800/40 transition-colors group cursor-pointer"
                      onClick={() => handleOpenDetail(spec)}
                    >
                      {/* 规格名称 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                            <Cpu className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-semibold text-slate-100 group-hover:text-blue-400 transition-colors flex items-center gap-1.5">
                              {spec.name}
                              {spec.totalUsedCount && spec.totalUsedCount > 100 ? (
                                <span className="px-1.5 py-0.2 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                  热门
                                </span>
                              ) : null}
                            </span>
                            <span className="text-[11px] text-slate-500 block truncate max-w-[180px]">
                              {spec.description || '标准 GPU 算力模板'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* GPU 型号 */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-slate-200 font-medium bg-slate-950/60 px-2 py-1 rounded-md border border-slate-800 inline-block">
                          {spec.gpuModel}
                        </span>
                      </td>

                      {/* 显存大小 */}
                      <td className="py-3.5 px-4">
                        <span className="text-cyan-400 font-semibold">{spec.vram}</span>
                      </td>

                      {/* CPU 核数 */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-200 font-medium">{spec.cpu} 核</span>
                      </td>

                      {/* 内存容量 */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300">{spec.ram} {spec.ramUnit || 'GB'}</span>
                      </td>

                      {/* 硬盘容量 */}
                      <td className="py-3.5 px-4">
                        <span className="text-slate-300">{spec.disk} {spec.diskUnit || 'GB'}</span>
                      </td>

                      {/* 按量单价 */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold font-mono">
                          ¥{spec.hourlyPrice.toFixed(2)}/h
                        </span>
                      </td>

                      {/* 状态 */}
                      <td className="py-3.5 px-4">
                        {spec.status === '上架' ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            已上架
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 text-slate-400 border border-slate-500/20">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                            已下架
                          </span>
                        )}
                      </td>

                      {/* 操作列 */}
                      <td className="py-3.5 px-4 text-right">
                        <div
                          className="flex items-center justify-end gap-1.5"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => handleOpenDetail(spec)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition"
                            title="查看详情"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={e => handleOpenEdit(spec, e)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition"
                            title="编辑规格"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() =>
                              toggleComputeSpecStatus(
                                spec.id,
                                spec.status === '上架' ? '下架' : '上架'
                              )
                            }
                            className={`p-1.5 rounded-lg transition text-xs font-medium px-2 py-1 ${
                              spec.status === '上架'
                                ? 'text-amber-400 hover:bg-amber-500/10'
                                : 'text-emerald-400 hover:bg-emerald-500/10'
                            }`}
                            title={spec.status === '上架' ? '下架该规格' : '上架该规格'}
                          >
                            {spec.status === '上架' ? '下架' : '上架'}
                          </button>

                          <button
                            onClick={e => handleDeleteClick(spec, e)}
                            disabled={!canDelete}
                            className={`p-1.5 rounded-lg transition ${
                              canDelete
                                ? 'text-slate-400 hover:text-red-400 hover:bg-red-500/10 cursor-pointer'
                                : 'text-slate-600 cursor-not-allowed opacity-40'
                            }`}
                            title={canDelete ? '删除规格' : '该规格已被使用，无法删除'}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-800/60 border border-slate-700/50 flex items-center justify-center text-slate-400">
                        <Box className="w-6 h-6" />
                      </div>
                      <div className="text-sm font-medium text-slate-300">暂无实例规格</div>
                      <p className="text-xs text-slate-500 max-w-sm">
                        未找到符合条件的规格模板，点击右上角【新增规格】即可配置新的 GPU 模板
                      </p>
                      <button
                        onClick={handleOpenAdd}
                        className="mt-1 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold transition"
                      >
                        新增规格
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 分页控制栏 */}
        {filteredSpecs.length > pageSize && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/40 flex items-center justify-between text-xs text-slate-400">
            <div>
              显示第 {(currentPage - 1) * pageSize + 1} 至{' '}
              {Math.min(currentPage * pageSize, filteredSpecs.length)} 条，共{' '}
              {filteredSpecs.length} 条
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="px-3 py-1 text-slate-200">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 新增 / 编辑规格 二级页面 (四大部分完整字段清单) */}
      {/* ========================================================================= */}
      {editModalOpen && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回规格列表</span>
              </button>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {isEditing ? `编辑实例规格: ${formData.name}` : '新增实例规格'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  定义 GPU 模板的硬件参数、关联镜像生态、可部署运营商及多租期定价策略
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              {isEditing ? '保存修改' : '确认创建'}
            </button>
          </div>

          {/* 表单内容 */}
          <form onSubmit={handleSave} className="space-y-6 text-xs">
              {/* 第一部分：硬件配置 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  第一部分：硬件配置
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 规格名称 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      规格名称 <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={30}
                        placeholder="如: RTX 4090 标准版"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">
                        {formData.name.length}/30
                      </span>
                    </div>
                  </div>

                  {/* GPU 型号（下拉单选，选项自动同步自资源池管理） */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
                      <span>GPU 型号 <span className="text-red-400">*</span></span>
                      <span className="text-[10px] text-blue-400/80 font-normal">同步资源池 ({availableGpuModels.length} 款)</span>
                    </label>
                    <select
                      value={formData.gpuModel}
                      onChange={e => setFormData({ ...formData, gpuModel: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                      required
                    >
                      <option value="" disabled>-- 请选择已同步的 GPU 型号 --</option>
                      {availableGpuModels.map(m => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 可选GPU数量（计数器） */}
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                        <span>可选GPU数量</span>
                        <span className="text-red-400">*</span>
                      </label>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        配置该规格允许用户租用的显卡数量上限（必须为大于等于 0 的整数）。
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          const next = Math.max(0, (formData.maxGpuCount || 0) - 1);
                          const arr = Array.from({ length: next }, (_, i) => i + 1);
                          setFormData({ ...formData, maxGpuCount: next, allowedGpuCounts: arr });
                        }}
                        className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 flex items-center justify-center transition cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={formData.maxGpuCount}
                        onChange={e => {
                          const val = Math.max(0, parseInt(e.target.value || '0', 10));
                          const arr = Array.from({ length: val }, (_, i) => i + 1);
                          setFormData({ ...formData, maxGpuCount: val, allowedGpuCounts: arr });
                        }}
                        className="w-24 bg-slate-900 border border-slate-700 text-slate-100 text-center text-sm font-bold rounded-xl py-2 focus:outline-none focus:border-blue-500 font-mono"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const next = (formData.maxGpuCount || 0) + 1;
                          const arr = Array.from({ length: next }, (_, i) => i + 1);
                          setFormData({ ...formData, maxGpuCount: next, allowedGpuCounts: arr });
                        }}
                        className="w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold border border-slate-700 flex items-center justify-center transition cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="text-[11px] text-amber-300/80 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2 flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>
                      最大不超过资源池中该型号余量：<strong className="text-amber-200 font-mono text-xs">{availableStockForSelectedModel}</strong>
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 显存 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      单卡显存大小 <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="24"
                        value={formData.vramValue}
                        onChange={e =>
                          setFormData({ ...formData, vramValue: Number(e.target.value) })
                        }
                        className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                        required
                      />
                      <select
                        value={formData.vramUnit}
                        onChange={e =>
                          setFormData({ ...formData, vramUnit: e.target.value as 'GB' | 'TB' })
                        }
                        className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-blue-500"
                      >
                        <option value="GB">GB</option>
                        <option value="TB">TB</option>
                      </select>
                    </div>
                  </div>

                  {/* CPU 核数 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      单卡 CPU 核数 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="number"
                      min={1}
                      placeholder="16"
                      value={formData.cpu}
                      onChange={e => setFormData({ ...formData, cpu: Number(e.target.value) })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* CPU 型号 (选填) */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      CPU 型号 <span className="text-slate-500 font-normal">(选填)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="如: AMD EPYC 9354"
                      value={formData.cpuModel}
                      onChange={e => setFormData({ ...formData, cpuModel: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 内存 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      单卡系统内存 <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="60"
                        value={formData.ramValue}
                        onChange={e =>
                          setFormData({ ...formData, ramValue: Number(e.target.value) })
                        }
                        className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                        required
                      />
                      <select
                        value={formData.ramUnit}
                        onChange={e =>
                          setFormData({ ...formData, ramUnit: e.target.value as 'GB' | 'TB' })
                        }
                        className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-blue-500"
                      >
                        <option value="GB">GB</option>
                        <option value="TB">TB</option>
                      </select>
                    </div>
                  </div>

                  {/* 硬盘 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      单卡硬盘容量 <span className="text-red-400">*</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        min={1}
                        placeholder="750"
                        value={formData.diskValue}
                        onChange={e =>
                          setFormData({ ...formData, diskValue: Number(e.target.value) })
                        }
                        className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                        required
                      />
                      <select
                        value={formData.diskUnit}
                        onChange={e =>
                          setFormData({ ...formData, diskUnit: e.target.value as 'GB' | 'TB' })
                        }
                        className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-2.5 focus:outline-none focus:border-blue-500"
                      >
                        <option value="GB">GB</option>
                        <option value="TB">TB</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* 规格描述 */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-300">
                      规格描述 <span className="text-slate-500 font-normal">(选填，限200字符)</span>
                    </label>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formData.description.length}/200
                    </span>
                  </div>
                  <textarea
                    rows={2}
                    maxLength={200}
                    placeholder="如: 性价比首选，高频核心，适合大模型推理、文生图与 LoRA 微调场景"
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-800" />

              {/* 第二部分：定价配置 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  第二部分：定价配置 (单卡价格)
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* 按量价格 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      按量价格 (元/小时) <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                        ¥
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        min="0.01"
                        placeholder="1.88"
                        value={formData.hourlyPrice}
                        onChange={e =>
                          setFormData({ ...formData, hourlyPrice: Number(e.target.value) })
                        }
                        className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-7 pr-3 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                        required
                      />
                    </div>
                  </div>

                  {/* 日租价格 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      日租价格 (元/天) <span className="text-slate-500 font-normal">(选填)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                        ¥
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="留空不支持"
                        value={formData.dayPrice}
                        onChange={e => setFormData({ ...formData, dayPrice: e.target.value })}
                        className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-7 pr-3 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* 周租价格 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      周租价格 (元/周) <span className="text-slate-500 font-normal">(选填)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                        ¥
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="留空不支持"
                        value={formData.weekPrice}
                        onChange={e => setFormData({ ...formData, weekPrice: e.target.value })}
                        className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-7 pr-3 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>

                  {/* 月租价格 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      月租价格 (元/月) <span className="text-slate-500 font-normal">(选填)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-xs">
                        ¥
                      </span>
                      <input
                        type="number"
                        step="0.01"
                        placeholder="留空不支持"
                        value={formData.monthPrice}
                        onChange={e => setFormData({ ...formData, monthPrice: e.target.value })}
                        className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-7 pr-3 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                      />
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 text-[11px] text-amber-400/90 flex items-center gap-2">
                  <Info className="w-4 h-4 shrink-0" />
                  <span>按量价格必填，日租/周租/月租选填。留空的项目在前台用户端将不开放对应的包周期租售。</span>
                </div>
              </div>

              <div className="h-px bg-slate-800" />

              {/* 第三部分：上架状态 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  第三部分：上架状态
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <div className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                      <span>前台发布上架状态</span>
                      {formData.status === '上架' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          已上架 (前台立即可见)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-slate-500/10 text-slate-400 border border-slate-500/20">
                          已下架 (前台隐藏)
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      控制前台算力工坊是否可见该规格模板。下架后不影响已使用该规格正在运行的存量实例。
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({
                        ...formData,
                        status: formData.status === '上架' ? '下架' : '上架'
                      })
                    }
                    className={`w-12 h-6 rounded-full transition-colors relative p-0.5 focus:outline-none ${
                      formData.status === '上架' ? 'bg-emerald-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        formData.status === '上架' ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* 弹窗底部操作 */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition"
                >
                  {isEditing ? '保存修改' : '确认创建'}
                </button>
              </div>
            </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 规格详情 二级页面 (五大信息区：基本信息、关联配置、定价信息、状态信息、使用统计) */}
      {/* ========================================================================= */}
      {detailModalOpen && detailSpec && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回规格列表</span>
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-100">{detailSpec.name}</h3>
                  {detailSpec.status === '上架' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      已上架
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-500/10 text-slate-400 border border-slate-500/20">
                      已下架
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{detailSpec.gpuModel}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setDetailModalOpen(false);
                handleOpenEdit(detailSpec);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>编辑规格</span>
            </button>
          </div>

          {/* Body */}
          <div className="space-y-6 text-xs">
            {/* 1. 基本信息区 */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Server className="w-3.5 h-3.5 text-blue-400" />
                  基本信息区
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-500 block">GPU 规格</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 block font-mono">
                      {detailSpec.gpuModel}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">显存容量</span>
                    <span className="text-xs font-semibold text-cyan-400 mt-0.5 block">
                      {detailSpec.vram}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">CPU 处理器</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                      {detailSpec.cpu} 核 {detailSpec.cpuModel ? `(${detailSpec.cpuModel})` : ''}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">系统内存</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                      {detailSpec.ram} {detailSpec.ramUnit || 'GB'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">存储硬盘</span>
                    <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                      {detailSpec.disk} {detailSpec.diskUnit || 'GB'}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-3">
                    <span className="text-[11px] text-slate-500 block">规格描述</span>
                    <span className="text-xs text-slate-300 mt-0.5 block">
                      {detailSpec.description || '暂无规格描述'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 2. 定价信息区 */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  单卡定价策略
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-500">单卡按量计费</span>
                    <div className="text-sm font-bold text-blue-400 mt-1 font-mono">
                      ¥{detailSpec.hourlyPrice.toFixed(2)}{' '}
                      <span className="text-xs text-slate-500 font-normal">/小时</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-500">单卡日租价格</span>
                    <div className="text-sm font-bold text-slate-200 mt-1 font-mono">
                      {detailSpec.dayPrice ? (
                        <>
                          ¥{detailSpec.dayPrice}{' '}
                          <span className="text-xs text-slate-500 font-normal">/天</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500 font-normal">未开放日租</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-500">单卡周租价格</span>
                    <div className="text-sm font-bold text-slate-200 mt-1 font-mono">
                      {detailSpec.weekPrice ? (
                        <>
                          ¥{detailSpec.weekPrice}{' '}
                          <span className="text-xs text-slate-500 font-normal">/周</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500 font-normal">未开放周租</span>
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
                    <span className="text-[11px] text-slate-500">单卡月租价格</span>
                    <div className="text-sm font-bold text-slate-200 mt-1 font-mono">
                      {detailSpec.monthPrice ? (
                        <>
                          ¥{detailSpec.monthPrice}{' '}
                          <span className="text-xs text-slate-500 font-normal">/月</span>
                        </>
                      ) : (
                        <span className="text-xs text-slate-500 font-normal">未开放月租</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. 可选显卡数量与多卡等比资源分配对照表 */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    多卡等比分配与价格对照表
                  </h4>
                  <span className="text-[11px] text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full font-mono">
                    最大可选: {detailSpec.maxGpuCount || Math.max(...(detailSpec.allowedGpuCounts || [1, 2, 4]))} 卡
                  </span>
                </div>

                <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
                        <tr>
                          <th className="py-2.5 px-3.5">GPU 档位</th>
                          <th className="py-2.5 px-3.5">总显存</th>
                          <th className="py-2.5 px-3.5">等比 CPU</th>
                          <th className="py-2.5 px-3.5">等比内存</th>
                          <th className="py-2.5 px-3.5">等比硬盘</th>
                          <th className="py-2.5 px-3.5 text-right">按量计费</th>
                          <th className="py-2.5 px-3.5 text-right">日租总价</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/50 font-mono text-slate-300">
                        {(detailSpec.allowedGpuCounts && detailSpec.allowedGpuCounts.length > 0 
                          ? detailSpec.allowedGpuCounts 
                          : [1, 2, 4]
                        ).map(cnt => {
                          const vramNum = detailSpec.vramValue || parseInt(detailSpec.vram?.match(/\d+/)?.[0] || '24', 10);
                          const totalVram = `${vramNum * cnt} ${detailSpec.vramUnit || 'GB'}`;
                          const totalCpu = `${detailSpec.cpu * cnt} 核`;
                          const totalRam = `${(detailSpec.ram || 60) * cnt} ${detailSpec.ramUnit || 'GB'}`;
                          const totalDisk = `${(detailSpec.disk || 750) * cnt} ${detailSpec.diskUnit || 'GB'}`;
                          const hourlyTotal = (detailSpec.hourlyPrice * cnt).toFixed(2);
                          const dayTotal = detailSpec.dayPrice ? `¥${(Number(detailSpec.dayPrice) * cnt)}/天` : '-';

                          return (
                            <tr key={cnt} className="hover:bg-slate-900/40 transition-colors">
                              <td className="py-2.5 px-3.5 font-bold text-slate-100 flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                {cnt} × {detailSpec.gpuModel}
                              </td>
                              <td className="py-2.5 px-3.5 text-cyan-300 font-semibold">{totalVram}</td>
                              <td className="py-2.5 px-3.5">{totalCpu}</td>
                              <td className="py-2.5 px-3.5">{totalRam}</td>
                              <td className="py-2.5 px-3.5 text-slate-400">{totalDisk}</td>
                              <td className="py-2.5 px-3.5 text-right text-blue-400 font-bold">¥{hourlyTotal}/h</td>
                              <td className="py-2.5 px-3.5 text-right text-slate-300">{dayTotal}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
                <p className="text-[11px] text-slate-500 mt-2">
                  * 实例调度与创建时，系统将动态核验当前运营商资源池是否具有同时满足“{detailSpec.gpuModel}”及“选定卡数”的空闲物理机资源。
                </p>
              </div>

              {/* 4. 使用统计区 */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                  <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                  使用统计与运维
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
                  <div>
                    <span className="text-[11px] text-slate-500 block">累计创建实例</span>
                    <span className="text-base font-bold text-purple-400 mt-0.5 block font-mono">
                      {detailSpec.totalUsedCount ?? 0} 台次
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">近 7 天创建</span>
                    <span className="text-base font-bold text-amber-400 mt-0.5 block font-mono">
                      {detailSpec.recent7DaysCount ?? 0} 次
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">创建时间</span>
                    <span className="text-xs text-slate-300 mt-0.5 block">
                      {detailSpec.createTime}
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">最后更新时间</span>
                    <span className="text-xs text-slate-300 mt-0.5 block">
                      {detailSpec.updateTime}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 底部 */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="text-xs text-slate-500">规格 ID: {detailSpec.id}</div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer"
              >
                关闭
              </button>
            </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 前置依赖阻断弹窗 */}
      {/* ========================================================================= */}
      {depErrorModal && depErrorModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-100">{depErrorModal.title}</h3>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {depErrorModal.description}
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setDepErrorModal(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                我知道了
              </button>
              <button
                onClick={() => {
                  setDepErrorModal(null);
                  setSelectedMainTab('workspace');
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/20 transition flex items-center justify-center gap-1"
              >
                {depErrorModal.buttonText}
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 删除二次确认弹窗 */}
      {/* ========================================================================= */}
      {deleteConfirmSpec && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl p-6 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-bold text-slate-100">确认删除该规格？</h3>
              <p className="text-xs text-slate-400 mt-2">
                您正在删除规格 <span className="text-slate-200 font-semibold">【{deleteConfirmSpec.name}】</span>。删除后该规格将从系统模板中彻底移除，此操作不可撤销。
              </p>
            </div>
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirmSpec(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-lg shadow-red-500/20 transition"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
