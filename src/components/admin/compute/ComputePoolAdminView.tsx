import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComputePoolItem, GpuDistributionItem } from '../../../types';
import {
  Plus,
  Search,
  RefreshCw,
  Eye,
  Edit3,
  Trash2,
  X,
  Server,
  Building2,
  MapPin,
  Key,
  ToggleLeft,
  ToggleRight,
  Layers,
  History,
  Activity,
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Cpu
} from 'lucide-react';

export const ComputePoolAdminView: React.FC = () => {
  const {
    computePools,
    computeSpecs,
    addComputePool,
    updateComputePool,
    deleteComputePool,
    syncComputePoolStatus,
    showToast
  } = useApp();

  // 筛选与搜索
  const [saleStatusFilter, setSaleStatusFilter] = useState<'all' | '已上架' | '已下架'>('all');
  const [operatorSearch, setOperatorSearch] = useState('');
  const [nameSearch, setNameSearch] = useState('');

  // 点击同步时的按钮 loading 状态 ID
  const [syncingPoolId, setSyncingPoolId] = useState<string | null>(null);

  // 详情 Modal 状态
  const [detailPool, setDetailPool] = useState<ComputePoolItem | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  // 新增 / 编辑 Modal 状态
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingPoolId, setEditingPoolId] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState({
    name: '',
    operator: '中国电信',
    region: '上海',
    remark: '',
    apiUrl: 'https://api.ctyun.cn/v2/gpu/pools/sh-01',
    authType: 'API Key' as 'API Key' | '用户名密码',
    authCredential: '',
    timeoutSeconds: 30,
    saleStatus: '已上架' as '已上架' | '已下架',
    agreedPricings: [
      { gpuModel: 'NVIDIA RTX 4090', agreedPrice: 1.45, effectiveDate: '2026-01-01' },
      { gpuModel: 'NVIDIA A100-SXM4-80GB', agreedPrice: 6.80, effectiveDate: '2026-01-01' }
    ]
  });

  // 删除确认 Modal
  const [deleteConfirmPool, setDeleteConfirmPool] = useState<ComputePoolItem | null>(null);

  // 过滤后的资源池列表
  const filteredPools = useMemo(() => {
    return computePools.filter(pool => {
      // 1. 上架状态筛选
      const currentSale = pool.saleStatus || '已上架';
      if (saleStatusFilter !== 'all' && currentSale !== saleStatusFilter) {
        return false;
      }

      // 2. 运营商模糊匹配
      if (operatorSearch.trim() && !pool.operator.toLowerCase().includes(operatorSearch.trim().toLowerCase())) {
        return false;
      }

      // 3. 资源池名称模糊匹配
      if (nameSearch.trim() && !pool.name.toLowerCase().includes(nameSearch.trim().toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [computePools, saleStatusFilter, operatorSearch, nameSearch]);

  // 打开新增弹窗
  const handleOpenAdd = () => {
    setEditingPoolId(null);
    setFormData({
      name: '',
      operator: '中国电信',
      region: '上海',
      remark: '',
      apiUrl: 'https://api.compute-cloud.cn/v1/cluster/gpu/nodes',
      authType: 'API Key',
      authCredential: 'qj_key_' + Math.random().toString(36).substring(2, 10),
      timeoutSeconds: 30,
      saleStatus: '已上架',
      agreedPricings: [
        { gpuModel: 'NVIDIA RTX 4090', agreedPrice: 1.45, effectiveDate: '2026-01-01' },
        { gpuModel: 'NVIDIA A100-SXM4-80GB', agreedPrice: 6.80, effectiveDate: '2026-01-01' }
      ]
    });
    setEditModalOpen(true);
  };

  // 打开编辑弹窗
  const handleOpenEdit = (pool: ComputePoolItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setEditingPoolId(pool.id);
    setFormData({
      name: pool.name,
      operator: pool.operator,
      region: pool.region,
      remark: pool.remark || '',
      apiUrl: pool.apiUrl || 'https://api.compute-cloud.cn/v1/cluster/gpu/nodes',
      authType: pool.authType || 'API Key',
      authCredential: pool.authCredential || '',
      timeoutSeconds: pool.timeoutSeconds || 30,
      saleStatus: pool.saleStatus || '已上架',
      agreedPricings: pool.agreedPricings && pool.agreedPricings.length > 0 ? pool.agreedPricings : [
        { gpuModel: 'NVIDIA RTX 4090', agreedPrice: 1.45, effectiveDate: '2026-01-01' },
        { gpuModel: 'NVIDIA A100-SXM4-80GB', agreedPrice: 6.80, effectiveDate: '2026-01-01' }
      ]
    });
    setEditModalOpen(true);
  };

  // 添加协议价格行
  const handleAddAgreedPricingRow = () => {
    setFormData(prev => ({
      ...prev,
      agreedPricings: [
        ...prev.agreedPricings,
        { gpuModel: 'NVIDIA RTX 4090', agreedPrice: 1.50, effectiveDate: new Date().toISOString().slice(0, 10) }
      ]
    }));
  };

  // 删除协议价格行
  const handleRemoveAgreedPricingRow = (index: number) => {
    setFormData(prev => ({
      ...prev,
      agreedPricings: prev.agreedPricings.filter((_, i) => i !== index)
    }));
  };

  // 修改协议价格行
  const handleUpdateAgreedPricingRow = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      agreedPricings: prev.agreedPricings.map((row, i) => i === index ? { ...row, [field]: value } : row)
    }));
  };

  // 提交新增/编辑
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('请输入资源池名称');
      return;
    }
    if (!formData.operator.trim()) {
      showToast('请输入运营商');
      return;
    }
    if (!formData.region.trim()) {
      showToast('请输入地域');
      return;
    }
    if (!formData.apiUrl.trim()) {
      showToast('请输入接入地址');
      return;
    }
    if (!formData.authCredential.trim()) {
      showToast('请输入认证凭证');
      return;
    }

    if (editingPoolId) {
      updateComputePool(editingPoolId, {
        name: formData.name.trim(),
        operator: formData.operator.trim(),
        region: formData.region.trim(),
        remark: formData.remark.trim(),
        apiUrl: formData.apiUrl.trim(),
        authType: formData.authType,
        authCredential: formData.authCredential.trim(),
        timeoutSeconds: Number(formData.timeoutSeconds) || 30,
        saleStatus: formData.saleStatus,
        agreedPricings: formData.agreedPricings
      });
      showToast(`资源池【${formData.name}】修改保存成功！协议价格已同步更新`);
    } else {
      addComputePool({
        name: formData.name.trim(),
        operator: formData.operator.trim(),
        region: formData.region.trim(),
        remark: formData.remark.trim(),
        apiUrl: formData.apiUrl.trim(),
        authType: formData.authType,
        authCredential: formData.authCredential.trim(),
        timeoutSeconds: Number(formData.timeoutSeconds) || 30,
        saleStatus: formData.saleStatus,
        runStatus: '正常',
        agreedPricings: formData.agreedPricings
      });
    }

    setEditModalOpen(false);
  };

  // 触发手动同步
  const handleTriggerSync = (poolId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSyncingPoolId(poolId);
    setTimeout(() => {
      syncComputePoolStatus(poolId);
      setSyncingPoolId(null);

      // 如果当前正打开此资源池详情，同步更新详情模态框中的对象
      if (detailPool && detailPool.id === poolId) {
        const updated = computePools.find(p => p.id === poolId);
        if (updated) setDetailPool({ ...updated });
      }
    }, 600);
  };

  // 上架 / 下架切换
  const handleToggleSaleStatus = (pool: ComputePoolItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const currentSale = pool.saleStatus || '已上架';
    const nextSale = currentSale === '已上架' ? '已下架' : '已上架';
    updateComputePool(pool.id, { saleStatus: nextSale });
    if (nextSale === '已下架') {
      showToast(`资源池【${pool.name}】已下架，前台不可再分配该池算力（已有运行实例不受影响）`);
    } else {
      showToast(`资源池【${pool.name}】已重新上架！`);
    }
  };

  // 打开查看详情 Modal
  const handleOpenDetail = (pool: ComputePoolItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setDetailPool(pool);
    setDetailModalOpen(true);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (!deleteConfirmPool) return;
    deleteComputePool(deleteConfirmPool.id);
    setDeleteConfirmPool(null);
  };

  // 辅助方法：生成 GPU 库存概要文本如 "RTX 4090: 18/50卡 · A100: 5/30卡"
  const renderGpuInventorySummary = (dist?: GpuDistributionItem[]) => {
    if (!dist || dist.length === 0) {
      return <span className="text-slate-500 italic">暂无集群库存数据 (请点击同步)</span>;
    }
    return dist.map((d, idx) => {
      let shortName = d.gpuModel;
      if (shortName.includes('4090')) shortName = 'RTX 4090';
      else if (shortName.includes('A100')) shortName = 'A100';
      else if (shortName.includes('H800')) shortName = 'H800';
      else if (shortName.includes('H100')) shortName = 'H100';
      else if (shortName.includes('3090')) shortName = 'RTX 3090';
      else if (shortName.includes('L40S')) shortName = 'L40S';
      else if (shortName.includes('V100')) shortName = 'V100';
      else if (shortName.includes('910B')) shortName = '昇腾 910B';

      return (
        <React.Fragment key={d.gpuModel + idx}>
          <span className="inline-flex items-center gap-1 font-mono">
            <span className="text-slate-200 font-semibold">{shortName}:</span>
            <span className="text-emerald-400 font-bold">{d.available}</span>
            <span className="text-slate-500">/{d.total}卡</span>
          </span>
          {idx < dist.length - 1 && <span className="text-slate-600 mx-1">·</span>}
        </React.Fragment>
      );
    });
  };

  // 关联规格数统计（匹配该资源池下的规格数量）
  const getLinkedSpecCount = (pool: ComputePoolItem) => {
    if (pool.supportedSpecIds && pool.supportedSpecIds.length > 0) {
      return pool.supportedSpecIds.length;
    }
    const matched = computeSpecs.filter(s => {
      if (pool.gpuTypes && pool.gpuTypes.includes(s.gpuModel)) return true;
      if (pool.distribution && pool.distribution.some(d => d.gpuModel === s.gpuModel)) return true;
      return false;
    });
    return matched.length || 1;
  };

  // =========================================================================
  // 一、新增/编辑资源池 二级页面 (Early Return)
  // =========================================================================
  if (editModalOpen) {
    return (
      <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
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
                <span>返回资源池列表</span>
              </button>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {editingPoolId ? `编辑资源池: ${formData.name}` : '新增算力资源池'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  配置基础设施集群的 API 自动化调度对接配置、上架状态及与各规格关联的协议采购价格
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmitForm}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              {editingPoolId ? '保存修改' : '确认创建'}
            </button>
          </div>

          <form onSubmit={handleSubmitForm} className="space-y-6 text-xs">
            {/* 表单 1：集群基本信息 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                集群基本信息
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">资源池名称 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例: 华东-杭州一区集群"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">算力运营商 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例: 算力云官方 / 运营商A"
                    value={formData.operator}
                    onChange={e => setFormData({ ...formData, operator: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">物理节点区域 *</label>
                  <input
                    type="text"
                    required
                    placeholder="例: 华东 / 华北"
                    value={formData.region}
                    onChange={e => setFormData({ ...formData, region: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200">资源池备注说明 (选填)</label>
                <input
                  type="text"
                  placeholder="例: 高性能 NVLink 互联集群，专用于万亿参数大模型训练"
                  value={formData.remark}
                  onChange={e => setFormData({ ...formData, remark: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* 表单 2：接口对接配置 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                API 自动化调度对接配置
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 md:col-span-2">
                  <label className="font-semibold text-slate-200">集群 API 端点 URL *</label>
                  <input
                    type="text"
                    required
                    placeholder="例: https://pool-hz01.suanli-cloud.internal/v1"
                    value={formData.apiUrl}
                    onChange={e => setFormData({ ...formData, apiUrl: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">认证方式 *</label>
                  <select
                    value={formData.authType}
                    onChange={e => setFormData({ ...formData, authType: e.target.value as any })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer font-mono"
                  >
                    <option value="BearerToken">Bearer Token 令牌认证</option>
                    <option value="AK/SK">AK/SK 签名认证</option>
                    <option value="OAuth2">OAuth2 协议</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-semibold text-slate-200">认证密钥/凭证 *</label>
                  <input
                    type="password"
                    required
                    placeholder="请输入加密 Token 或 AK/SK"
                    value={formData.authCredential}
                    onChange={e => setFormData({ ...formData, authCredential: e.target.value })}
                    className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 表单 3：与规格价格协议结算 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  协议采购价与供给结算规则
                </div>
                <span className="text-[11px] text-slate-400">设置运营商内部成本/采购协议价</span>
              </div>

              <div className="space-y-3">
                {formData.agreedPricings.map((pricing, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <div className="font-bold text-slate-200 flex items-center gap-2">
                        <span className="text-[11px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
                          {pricing.gpuModel}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        生效日期: <span className="text-slate-300 font-mono">{pricing.effectiveDate || '2026-01-01'}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[11px] text-slate-400">运营商结算协议价:</span>
                      <div className="flex items-center gap-1 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
                        <span className="text-amber-400 font-mono text-xs font-bold">¥</span>
                        <input
                          type="number"
                          step="0.01"
                          value={pricing.agreedPrice}
                          onChange={e => handleUpdateAgreedPricingRow(idx, 'agreedPrice', Number(e.target.value))}
                          className="w-20 bg-transparent text-amber-400 font-bold font-mono text-xs focus:outline-none"
                        />
                        <span className="text-slate-500 text-[10px]">/h</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAgreedPricingRow(idx)}
                        className="p-1 text-slate-500 hover:text-rose-400 transition"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  type="button"
                  onClick={handleAddAgreedPricingRow}
                  className="w-full py-2 border border-dashed border-slate-700 hover:border-slate-600 rounded-xl text-slate-400 hover:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加 GPU 协议单价规则</span>
                </button>
              </div>
            </div>

            {/* 表单 4：上架状态 */}
            <div className="space-y-4 pt-4 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200">资源池调度上线状态 *</label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, saleStatus: '已上架' })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                      formData.saleStatus === '已上架'
                        ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>已上架 (允许分配)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, saleStatus: '已下架' })}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-1.5 border cursor-pointer ${
                      formData.saleStatus === '已下架'
                        ? 'bg-rose-500/20 border-rose-500 text-rose-300'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>已下架 (暂停分配)</span>
                  </button>
                </div>
              </div>
            </div>

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
                {editingPoolId ? '保存修改' : '确认创建'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 二、查看详情 二级页面 (Early Return)
  // =========================================================================
  if (detailModalOpen && detailPool) {
    return (
      <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDetailModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回资源池列表</span>
              </button>
              <div>
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-slate-100">{detailPool.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    detailPool.runStatus === '正常'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                      : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                  }`}>
                    {detailPool.runStatus}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{detailPool.apiUrl}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setDetailModalOpen(false);
                handleOpenEdit(detailPool);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>编辑资源池</span>
            </button>
          </div>

          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-500 block">所属运营商</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                  {detailPool.operator}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">物理机房区域</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                  {detailPool.region}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">上架状态</span>
                <span className="text-xs font-semibold mt-0.5 block">
                  {detailPool.saleStatus === '已上架' ? (
                    <span className="text-emerald-400">已上架 (正常派单)</span>
                  ) : (
                    <span className="text-rose-400">已下架 (暂停派单)</span>
                  )}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">更新/同步时间</span>
                <span className="text-xs text-slate-400 mt-0.5 block font-mono">
                  {detailPool.lastSyncTime || '2026-08-20 12:00'}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-bold text-slate-300 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                集群实时 GPU 库存与在用分布
              </h4>
              <div className="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800 text-[11px]">
                    <tr>
                      <th className="py-2.5 px-3.5">GPU 型号</th>
                      <th className="py-2.5 px-3.5">已用卡数</th>
                      <th className="py-2.5 px-3.5">总容量卡数</th>
                      <th className="py-2.5 px-3.5">使用率</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 font-mono text-slate-300">
                    {(detailPool.distribution && detailPool.distribution.length > 0) ? (
                      detailPool.distribution.map((item, idx) => {
                        const used = item.allocated ?? 0;
                        const total = item.total ?? 0;
                        const pct = item.rate ?? (total > 0 ? Math.round((used / total) * 100) : 0);
                        return (
                          <tr key={idx} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3.5 font-bold text-slate-100">{item.gpuModel}</td>
                            <td className="py-2.5 px-3.5 text-cyan-400">{used} 卡</td>
                            <td className="py-2.5 px-3.5">{total} 卡</td>
                            <td className="py-2.5 px-3.5">
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                                  <div
                                    className="bg-cyan-500 h-full rounded-full"
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-[11px] text-slate-400">{pct}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={4} className="py-4 text-center text-slate-500 italic">
                          暂无库存明细
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">资源池 ID: {detailPool.id}</span>
            <button
              onClick={() => setDetailModalOpen(false)}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 rounded-xl transition cursor-pointer"
            >
              关闭
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部标题栏与新增按钮 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            资源池管理
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            底层运营商集群对接中心，自动拉取真实 GPU 型号与实时库存，为规格管理与前台自动分配调度提供依据。
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] whitespace-nowrap cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          新增资源池
        </button>
      </div>

      {/* 筛选与搜索工具栏 */}
      <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          {/* 上架状态筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">状态:</span>
            <select
              value={saleStatusFilter}
              onChange={e => setSaleStatusFilter(e.target.value as any)}
              className="bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-blue-500 cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="已上架">🟢 已上架</option>
              <option value="已下架">🔴 已下架</option>
            </select>
          </div>

          {/* 运营商搜索 */}
          <div className="relative min-w-[160px]">
            <input
              type="text"
              placeholder="搜索运营商..."
              value={operatorSearch}
              onChange={e => setOperatorSearch(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* 资源池名称搜索 */}
          <div className="relative min-w-[200px] flex-1 sm:flex-initial">
            <input
              type="text"
              placeholder="搜索资源池名称或地域..."
              value={nameSearch}
              onChange={e => setNameSearch(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl pl-8 pr-3 py-2 focus:outline-none focus:border-blue-500 placeholder:text-slate-500"
            />
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* 重置筛选 */}
          {(saleStatusFilter !== 'all' || operatorSearch || nameSearch) && (
            <button
              onClick={() => {
                setSaleStatusFilter('all');
                setOperatorSearch('');
                setNameSearch('');
              }}
              className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              重置
            </button>
          )}
        </div>

        <div className="text-xs text-slate-400 text-right">
          找到 <span className="text-blue-400 font-semibold">{filteredPools.length}</span> 个集群资源池
        </div>
      </div>

      {/* 资源池列表表格 */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800 backdrop-blur-sm overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[11px] font-semibold border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">资源池名称</th>
                <th className="py-3.5 px-4">运营商</th>
                <th className="py-3.5 px-4">地域</th>
                <th className="py-3.5 px-4 text-center">关联规格数</th>
                <th className="py-3.5 px-4">GPU 库存概要</th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-4">最后同步时间</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPools.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                    没有找到符合条件的资源池
                  </td>
                </tr>
              ) : (
                filteredPools.map(pool => {
                  const saleStatus = pool.saleStatus || '已上架';
                  const runStatus = pool.runStatus || '正常';
                  const isSyncing = syncingPoolId === pool.id;
                  const specCount = getLinkedSpecCount(pool);

                  return (
                    <tr
                      key={pool.id}
                      onClick={() => handleOpenDetail(pool)}
                      className="hover:bg-slate-800/40 transition cursor-pointer group"
                    >
                      {/* 资源池名称 */}
                      <td className="py-3.5 px-4 font-semibold text-slate-100 group-hover:text-blue-400 transition">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-slate-400 shrink-0" />
                          <span>{pool.name}</span>
                        </div>
                      </td>

                      {/* 运营商 */}
                      <td className="py-3.5 px-4 text-slate-300">
                        {pool.operator}
                      </td>

                      {/* 地域 */}
                      <td className="py-3.5 px-4 text-slate-300">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {pool.region}
                        </span>
                      </td>

                      {/* 关联规格数 */}
                      <td className="py-3.5 px-4 text-center font-mono">
                        <span className="px-2.5 py-1 rounded-full bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-[11px]">
                          {specCount} 款
                        </span>
                      </td>

                      {/* GPU 库存概要 */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="text-xs truncate" title="库存汇总">
                          {renderGpuInventorySummary(pool.distribution)}
                        </div>
                      </td>

                      {/* 状态 (上架状态 + 运行状态组合) */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border backdrop-blur-sm bg-slate-950/40 border-slate-800">
                          {saleStatus === '已上架' ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              已上架
                            </span>
                          ) : (
                            <span className="text-rose-400 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                              已下架
                            </span>
                          )}
                          <span className="text-slate-600">·</span>
                          <span className={
                            runStatus === '正常' ? 'text-emerald-300' :
                            runStatus === '维护中' ? 'text-amber-300' :
                            runStatus === '异常' ? 'text-red-400' : 'text-slate-400'
                          }>
                            {runStatus}
                          </span>
                        </div>
                      </td>

                      {/* 最后同步时间 */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                        {pool.lastSyncTime || '未同步'}
                      </td>

                      {/* 操作按钮 */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 同步按钮 */}
                          <button
                            onClick={e => handleTriggerSync(pool.id, e)}
                            disabled={isSyncing}
                            className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium transition cursor-pointer flex items-center gap-1"
                            title="同步运营商实时GPU型号与库存"
                          >
                            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-blue-300' : ''}`} />
                            <span>{isSyncing ? '同步中' : '同步'}</span>
                          </button>

                          {/* 查看详情 */}
                          <button
                            onClick={e => handleOpenDetail(pool, e)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>详情</span>
                          </button>

                          {/* 编辑 */}
                          <button
                            onClick={e => handleOpenEdit(pool, e)}
                            className="px-2 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                            title="修改属性与凭证"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-slate-400" />
                          </button>

                          {/* 上架 / 下架切换 */}
                          <button
                            onClick={e => handleToggleSaleStatus(pool, e)}
                            className={`px-2.5 py-1.5 rounded-lg border font-medium transition cursor-pointer ${
                              saleStatus === '已上架'
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border-amber-500/30'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            }`}
                            title={saleStatus === '已上架' ? '下架该资源池' : '重新上架该资源池'}
                          >
                            {saleStatus === '已上架' ? '下架' : '上架'}
                          </button>

                          {/* 删除 */}
                          <button
                            onClick={e => {
                              e.stopPropagation();
                              setDeleteConfirmPool(pool);
                            }}
                            className="px-2 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 transition cursor-pointer"
                            title="删除资源池"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 新增/编辑资源池 二级页面 */}
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
                <span>返回资源池列表</span>
              </button>
              <div>
                <h3 className="text-base font-bold text-slate-100">
                  {editingPoolId ? `编辑资源池: ${formData.name}` : '新增算力集群资源池'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">请填写资源池基础设施信息、API对接秘钥与下属集群协议价格</p>
              </div>
            </div>
            <button
              onClick={handleSubmitForm}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition cursor-pointer"
            >
              {editingPoolId ? '保存修改' : '立即创建'}
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmitForm} className="space-y-6 text-xs">
              {/* 第一部分：基础信息 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80 text-blue-400 font-bold">
                  <Building2 className="w-4 h-4" />
                  <span>第一部分：基础信息</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 资源池名称 */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      资源池名称 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      maxLength={30}
                      placeholder="限30字符，如: 电信云-华东1"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* 运营商 */}
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      运营商 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="如: 中国电信"
                      value={formData.operator}
                      onChange={e => setFormData({ ...formData, operator: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* 地域 */}
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      地域 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="如: 上海"
                      value={formData.region}
                      onChange={e => setFormData({ ...formData, region: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                      required
                    />
                  </div>

                  {/* 备注 */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      备注 <span className="text-slate-500 font-normal">(选填)</span>
                    </label>
                    <textarea
                      rows={2}
                      placeholder="补充说明该算力集群的机房特性、集群优势等"
                      value={formData.remark}
                      onChange={e => setFormData({ ...formData, remark: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2 focus:outline-none focus:border-blue-500 resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* 第二部分：连接配置 */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pb-1 border-b border-slate-800/80 text-blue-400 font-bold">
                  <Key className="w-4 h-4" />
                  <span>第二部分：连接配置</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* 接入地址 */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      接入地址 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="运营商 API 的访问地址，如: https://api.ctyun.cn/v2/gpu/pools/sh-01"
                      value={formData.apiUrl}
                      onChange={e => setFormData({ ...formData, apiUrl: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                      required
                    />
                  </div>

                  {/* 认证方式 */}
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      认证方式 <span className="text-red-400">*</span>
                    </label>
                    <select
                      value={formData.authType}
                      onChange={e => setFormData({ ...formData, authType: e.target.value as any })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="API Key">API Key</option>
                      <option value="用户名密码">用户名密码</option>
                    </select>
                  </div>

                  {/* 超时时间 */}
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      超时时间 (秒)
                    </label>
                    <input
                      type="number"
                      min={5}
                      max={300}
                      value={formData.timeoutSeconds}
                      onChange={e => setFormData({ ...formData, timeoutSeconds: Number(e.target.value) })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                    />
                  </div>

                  {/* 认证凭证 */}
                  <div className="sm:col-span-2">
                    <label className="block font-semibold text-slate-300 mb-1.5">
                      认证凭证 <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="对应的 Key 或 Token/密码"
                      value={formData.authCredential}
                      onChange={e => setFormData({ ...formData, authCredential: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono text-[11px]"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* 第三部分：协议价格配置 (与运营商结算协议价) */}
              <div className="space-y-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block text-xs flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-cyan-400" />
                      <span>第三部分：协议价格配置 (与运营商结算标准)</span>
                    </span>
                    <span className="text-[11px] text-slate-400">配置平台向运营商采购各 GPU 算力的协议结算单价 (元/卡·时)，用于后台对账结算自动化核算。</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleAddAgreedPricingRow}
                    className="px-2.5 py-1 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg text-xs font-medium flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>添加型号协议价</span>
                  </button>
                </div>

                <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-900/60">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950/80 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2 px-3">GPU 型号</th>
                        <th className="py-2 px-3">协议单价 (元/卡时)</th>
                        <th className="py-2 px-3">生效日期</th>
                        <th className="py-2 px-3 text-right">操作</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {formData.agreedPricings.map((item, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={item.gpuModel}
                              onChange={e => handleUpdateAgreedPricingRow(idx, 'gpuModel', e.target.value)}
                              placeholder="如 NVIDIA RTX 4090"
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs focus:outline-none focus:border-cyan-500"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <div className="relative">
                              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">¥</span>
                              <input
                                type="number"
                                step="0.01"
                                min="0.1"
                                value={item.agreedPrice}
                                onChange={e => handleUpdateAgreedPricingRow(idx, 'agreedPrice', parseFloat(e.target.value) || 0)}
                                className="w-full pl-6 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                              />
                            </div>
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="date"
                              value={item.effectiveDate}
                              onChange={e => handleUpdateAgreedPricingRow(idx, 'effectiveDate', e.target.value)}
                              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-slate-200 text-xs font-mono focus:outline-none focus:border-cyan-500"
                            />
                          </td>
                          <td className="py-2 px-3 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveAgreedPricingRow(idx)}
                              disabled={formData.agreedPricings.length <= 1}
                              className={`p-1 rounded text-slate-400 hover:text-red-400 hover:bg-slate-800 transition ${
                                formData.agreedPricings.length <= 1 ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer'
                              }`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 第四部分：上架状态 */}
              <div className="space-y-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-200 block">第四部分：上架状态</span>
                    <span className="text-[11px] text-slate-400">开启后前台算力工坊创建实例时可调度分配该资源池的算力。</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, saleStatus: formData.saleStatus === '已上架' ? '已下架' : '已上架' })}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    {formData.saleStatus === '已上架' ? (
                      <ToggleRight className="w-8 h-8 text-emerald-400" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-600" />
                    )}
                    <span className={`font-semibold ${formData.saleStatus === '已上架' ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {formData.saleStatus}
                    </span>
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold shadow-md shadow-blue-500/20 transition cursor-pointer"
                >
                  {editingPoolId ? '保存修改' : '立即创建'}
                </button>
              </div>
            </form>
        </div>
      )}

      {/* 查看详情 二级页面 */}
      {detailModalOpen && detailPool && (
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
                <span>返回资源池列表</span>
              </button>
              <div>
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span>{detailPool.name}</span>
                  <span className="text-xs font-normal text-slate-400">({detailPool.operator})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">资源池集群通信参数与可用 GPU 硬件规格分发</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTriggerSync(detailPool.id)}
                disabled={syncingPoolId === detailPool.id}
                className="px-3.5 py-2 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${syncingPoolId === detailPool.id ? 'animate-spin' : ''}`} />
                <span>{syncingPoolId === detailPool.id ? '正在同步...' : '立即同步'}</span>
              </button>
              <button
                onClick={() => {
                  setDetailModalOpen(false);
                  handleOpenEdit(detailPool);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
              >
                编辑资源池
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="space-y-6 text-xs">
              {/* 基本信息区 */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-400" />
                  <span>基本信息</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                  <div>
                    <span className="text-slate-500 block text-[11px] mb-0.5">资源池名称</span>
                    <span className="font-semibold text-slate-200">{detailPool.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] mb-0.5">所属运营商</span>
                    <span className="font-semibold text-slate-200">{detailPool.operator}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] mb-0.5">部署地域</span>
                    <span className="font-semibold text-slate-200 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {detailPool.region}
                    </span>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-slate-500 block text-[11px] mb-0.5">API 接入地址</span>
                    <span className="font-mono text-slate-300 break-all bg-slate-900 px-2 py-1 rounded border border-slate-800 block text-[11px]">
                      {detailPool.apiUrl || 'https://api.ctyun.cn/v2/gpu/pools/sh-01'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[11px] mb-0.5">备注</span>
                    <span className="text-slate-300">{detailPool.remark || '无备注说明'}</span>
                  </div>
                </div>
              </div>

              {/* 状态信息区 */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Activity className="w-4 h-4 text-emerald-400" />
                  <span>状态与同步监控</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 border border-slate-800/80 rounded-xl">
                  <div>
                    <span className="text-slate-500 block text-[11px] mb-0.5">上架状态</span>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-semibold border ${
                      (detailPool.saleStatus || '已上架') === '已上架'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {detailPool.saleStatus || '已上架'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px] mb-0.5">运行状态</span>
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold text-xs">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {detailPool.runStatus || '正常'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px] mb-0.5">最后同步时间</span>
                    <span className="font-mono text-slate-300 text-[11px]">{detailPool.lastSyncTime || '未同步'}</span>
                  </div>

                  <div>
                    <span className="text-slate-500 block text-[11px] mb-0.5">下次自动刷新</span>
                    <span className="font-mono text-blue-400 text-[11px]">
                      {detailPool.nextSyncTime || '5 分钟内'}
                    </span>
                  </div>
                </div>
              </div>

              {/* GPU 库存列表 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-indigo-400" />
                    <span>GPU 规格与实时库存矩阵</span>
                  </div>
                  <span className="text-[11px] text-slate-400">来自 API 交互同步，5分钟轮询刷新</span>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3.5">GPU 型号</th>
                        <th className="py-2.5 px-3.5 text-center">总容量 (卡)</th>
                        <th className="py-2.5 px-3.5 text-center">已分配 (卡)</th>
                        <th className="py-2.5 px-3.5 text-center">可用 (卡)</th>
                        <th className="py-2.5 px-3.5 text-right">利用率</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {(!detailPool.distribution || detailPool.distribution.length === 0) ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500 font-sans">
                            暂无库存数据，请点击右上角【立即同步】
                          </td>
                        </tr>
                      ) : (
                        detailPool.distribution.map((dist, i) => (
                          <tr key={dist.gpuModel + i} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3.5 font-sans font-semibold text-slate-200">
                              {dist.gpuModel}
                            </td>
                            <td className="py-2.5 px-3.5 text-center text-slate-300">
                              {dist.total}
                            </td>
                            <td className="py-2.5 px-3.5 text-center text-amber-400 font-semibold">
                              {dist.allocated}
                            </td>
                            <td className="py-2.5 px-3.5 text-center text-emerald-400 font-bold">
                              {dist.available}
                            </td>
                            <td className="py-2.5 px-3.5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      dist.rate > 85 ? 'bg-rose-500' : dist.rate > 60 ? 'bg-amber-500' : 'bg-emerald-500'
                                    }`}
                                    style={{ width: `${dist.rate}%` }}
                                  />
                                </div>
                                <span className="text-slate-300 font-semibold">{dist.rate}%</span>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 协议结算价格配置 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>运营商协议结算价标准 (协议价)</span>
                  </div>
                  <span className="text-[11px] text-slate-400">用于月度对账自动化结算</span>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3.5">GPU 型号</th>
                        <th className="py-2.5 px-3.5 text-center">协议单价</th>
                        <th className="py-2.5 px-3.5 text-center">计费周期单位</th>
                        <th className="py-2.5 px-3.5 text-right">生效日期</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {(!detailPool.agreedPricings || detailPool.agreedPricings.length === 0) ? (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500 font-sans">
                            暂未配置协议结算价格（默认按基础单价结算）
                          </td>
                        </tr>
                      ) : (
                        detailPool.agreedPricings.map((ap, i) => (
                          <tr key={i} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3.5 font-sans font-semibold text-slate-200">
                              {ap.gpuModel}
                            </td>
                            <td className="py-2.5 px-3.5 text-center text-cyan-400 font-bold">
                              ¥{ap.agreedPrice.toFixed(2)}
                            </td>
                            <td className="py-2.5 px-3.5 text-center text-slate-300 font-sans">
                              元 / 卡·时
                            </td>
                            <td className="py-2.5 px-3.5 text-right text-slate-400">
                              {ap.effectiveDate}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 操作日志区 */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <History className="w-4 h-4 text-purple-400" />
                  <span>资源池同步与运维日志历史</span>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-3.5">操作时间</th>
                        <th className="py-2.5 px-3.5">操作人</th>
                        <th className="py-2.5 px-3.5">操作类型</th>
                        <th className="py-2.5 px-3.5">结果</th>
                        <th className="py-2.5 px-3.5">详细信息</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                      {(!detailPool.logs || detailPool.logs.length === 0) ? (
                        <tr>
                          <td colSpan={5} className="py-6 text-center text-slate-500 font-sans">
                            暂无操作日志记录
                          </td>
                        </tr>
                      ) : (
                        detailPool.logs.map((log) => (
                          <tr key={log.id} className="hover:bg-slate-800/30">
                            <td className="py-2.5 px-3.5 text-slate-400 whitespace-nowrap">
                              {log.time}
                            </td>
                            <td className="py-2.5 px-3.5 font-sans text-slate-300 whitespace-nowrap">
                              {log.operator}
                            </td>
                            <td className="py-2.5 px-3.5 font-sans text-slate-200 whitespace-nowrap">
                              {log.action}
                            </td>
                            <td className="py-2.5 px-3.5 whitespace-nowrap">
                              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold font-sans ${
                                log.result === '成功' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                              }`}>
                                {log.result}
                              </span>
                            </td>
                            <td className="py-2.5 px-3.5 font-sans text-slate-400">
                              {log.detail || '-'}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
      )}

      {/* 删除确认 Modal */}
      {deleteConfirmPool && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center gap-3 text-red-400 font-bold text-base">
              <AlertCircle className="w-6 h-6" />
              <span>确认彻底删除资源池？</span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              您确定要删除资源池 <strong className="text-white">【{deleteConfirmPool.name}】</strong> 吗？
              <br />
              <span className="text-rose-400/90 font-medium mt-1 block">
                警告：该操作不可撤销。仅当资源池无任何活跃运行中的实例时允许操作。删除后该资源池将停止前台自动调度分配。
              </span>
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmPool(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-semibold shadow-md transition cursor-pointer"
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
