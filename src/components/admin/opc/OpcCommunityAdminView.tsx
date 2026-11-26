import React, { useMemo, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  OpcCommunityNode,
  OpcPolicyDetail,
  OpcPolicyKey
} from '../../../data/mockOpcCommunities';
import {
  CHINA_REGIONS,
  inferProvinceByCity,
  maskPhoneNumber
} from '../../../data/chinaRegions';
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  Search,
  ArrowLeft,
  Save,
  AlertTriangle,
  Building2,
  Cpu,
  TrendingUp,
  FileCheck,
  MapPin,
  Phone,
  RotateCcw
} from 'lucide-react';

type OpcViewMode = 'list' | 'form';

interface PolicyToggleItem {
  enabled: boolean;
  desc: string;
}

interface OpcFormDraft {
  id: string | null;
  name: string;
  province: string;
  city: string;
  address: string;
  cardSummary: string;
  policyOverview: string;
  policies: Record<OpcPolicyKey, PolicyToggleItem>;
  contactName: string;
  phone: string;
  sortWeight: string;
}

const POLICY_FIELD_CONFIG: {
  key: OpcPolicyKey;
  label: string;
  inputLabel: string;
  placeholder: string;
  icon: React.ReactNode;
}[] = [
  {
    key: '免费工位',
    label: '免费工位',
    inputLabel: '工位说明',
    placeholder: '如：最长 12 个月免租工位',
    icon: <Building2 className="w-4 h-4" />
  },
  {
    key: '算力支持',
    label: '算力支持',
    inputLabel: '算力说明',
    placeholder: '如：园区算力券专项补贴',
    icon: <Cpu className="w-4 h-4" />
  },
  {
    key: '创业投资',
    label: '创业投资',
    inputLabel: '投资说明',
    placeholder: '如：详情面议 / 种子轮直投最高 200 万',
    icon: <TrendingUp className="w-4 h-4" />
  },
  {
    key: '工商注册',
    label: '工商注册',
    inputLabel: '注册说明',
    placeholder: '如：提供免费注册地址与代办',
    icon: <FileCheck className="w-4 h-4" />
  }
];

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

const createEmptyDraft = (): OpcFormDraft => ({
  id: null,
  name: '',
  province: '江苏省',
  city: '南京市',
  address: '',
  cardSummary: '',
  policyOverview: '',
  policies: {
    免费工位: { enabled: true, desc: '' },
    算力支持: { enabled: true, desc: '' },
    创业投资: { enabled: false, desc: '' },
    工商注册: { enabled: false, desc: '' }
  },
  contactName: '',
  phone: '',
  sortWeight: '0'
});

const buildDraftFromNode = (node: OpcCommunityNode): OpcFormDraft => {
  const province = node.province || inferProvinceByCity(node.city);
  const regionObj = CHINA_REGIONS.find((r) => r.province === province);
  const resolvedCity =
    regionObj && regionObj.cities.includes(node.city)
      ? node.city
      : regionObj?.cities[0] || node.city;

  const findPolicy = (key: OpcPolicyKey): PolicyToggleItem => {
    const detail = node.policyDetails?.find((d) => d.key === key);
    if (detail) {
      return {
        enabled: detail.supported,
        desc: detail.supported ? detail.statusDesc : ''
      };
    }
    const enabled = (node.policies || []).includes(key);
    return { enabled, desc: '' };
  };

  return {
    id: node.id,
    name: node.name || '',
    province,
    city: resolvedCity,
    address: node.address || '',
    cardSummary: node.cardSummary || node.summary || '',
    policyOverview: node.policyOverview || node.summary || '',
    policies: {
      免费工位: findPolicy('免费工位'),
      算力支持: findPolicy('算力支持'),
      创业投资: findPolicy('创业投资'),
      工商注册: findPolicy('工商注册')
    },
    contactName: node.contactName || '',
    phone: (node.fullPhone || '').replace(/\D/g, ''),
    sortWeight: String(node.sortWeight ?? 0)
  };
};

export const OpcCommunityAdminView: React.FC = () => {
  const { opcCommunities, setOpcCommunities, showToast } = useApp();

  // 一级列表页 / 新增编辑表单页
  const [viewMode, setViewMode] = useState<OpcViewMode>('list');

  // 列表页筛选条件
  const [filterProvince, setFilterProvince] = useState<string>('全部');
  const [filterCity, setFilterCity] = useState<string>('全部');
  const [searchKeyword, setSearchKeyword] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'public' | 'hidden'>('all');

  // 列表勾选状态
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // 表单页草稿状态
  const [draft, setDraft] = useState<OpcFormDraft>(createEmptyDraft());

  // 通用删除确认弹窗
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    description: string;
    onConfirm: () => void;
  } | null>(null);

  // 列表筛选区：当前省份对应的城市选项
  const filterCityOptions = useMemo(() => {
    if (filterProvince === '全部') return [];
    const found = CHINA_REGIONS.find((r) => r.province === filterProvince);
    return found ? found.cities : [];
  }, [filterProvince]);

  // 表单区：当前省份对应的城市选项
  const formCityOptions = useMemo(() => {
    const found = CHINA_REGIONS.find((r) => r.province === draft.province);
    return found ? found.cities : [];
  }, [draft.province]);

  // 过滤并按排序权重倒序、创建时间倒序排列
  const filteredList = useMemo(() => {
    const q = searchKeyword.trim().toLowerCase();
    return opcCommunities
      .filter((item) => {
        const prov = item.province || inferProvinceByCity(item.city);
        if (filterProvince !== '全部' && prov !== filterProvince) return false;
        if (filterCity !== '全部' && item.city !== filterCity) return false;
        const itemStatus = item.status === 'hidden' ? 'hidden' : 'public';
        if (filterStatus !== 'all' && itemStatus !== filterStatus) return false;
        if (q) {
          const matchName = item.name.toLowerCase().includes(q);
          const matchAddress = item.address.toLowerCase().includes(q);
          if (!matchName && !matchAddress) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const weightDiff = (b.sortWeight ?? 0) - (a.sortWeight ?? 0);
        if (weightDiff !== 0) return weightDiff;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
      });
  }, [opcCommunities, filterProvince, filterCity, filterStatus, searchKeyword]);

  const allVisibleSelected =
    filteredList.length > 0 && filteredList.every((item) => selectedIds.includes(item.id));

  const toggleSelectAll = () => {
    if (allVisibleSelected) {
      const visibleSet = new Set(filteredList.map((i) => i.id));
      setSelectedIds((prev) => prev.filter((id) => !visibleSet.has(id)));
    } else {
      const merged = new Set([...selectedIds, ...filteredList.map((i) => i.id)]);
      setSelectedIds(Array.from(merged));
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleResetFilters = () => {
    setFilterProvince('全部');
    setFilterCity('全部');
    setSearchKeyword('');
    setFilterStatus('all');
  };

  // ==========================================
  // 批量与单项操作
  // ==========================================
  const handleBatchStatus = (status: 'public' | 'hidden') => {
    if (selectedIds.length === 0) return;
    const idSet = new Set(selectedIds);
    setOpcCommunities((prev) =>
      prev.map((item) => (idSet.has(item.id) ? { ...item, status } : item))
    );
    showToast(
      `已将选中的 ${selectedIds.length} 个 OPC 社区设为「${status === 'public' ? '公开' : '隐藏'}」`
    );
    setSelectedIds([]);
  };

  const handleBatchDelete = () => {
    if (selectedIds.length === 0) return;
    const count = selectedIds.length;
    setConfirmModal({
      title: '确认批量删除 OPC 社区？',
      description: `即将删除选中的 ${count} 个 OPC 社区节点，删除后前台将同步移除展示，此操作不可撤销。`,
      onConfirm: () => {
        const idSet = new Set(selectedIds);
        setOpcCommunities((prev) => prev.filter((item) => !idSet.has(item.id)));
        setSelectedIds([]);
        setConfirmModal(null);
        showToast(`已成功删除 ${count} 个 OPC 社区`);
      }
    });
  };

  const handleDeleteSingle = (node: OpcCommunityNode) => {
    setConfirmModal({
      title: '确认删除该 OPC 社区？',
      description: `即将删除社区「${node.name}」，删除后前台 OPC 社区网络页将同步移除该记录，此操作不可撤销。`,
      onConfirm: () => {
        setOpcCommunities((prev) => prev.filter((item) => item.id !== node.id));
        setSelectedIds((prev) => prev.filter((id) => id !== node.id));
        setConfirmModal(null);
        showToast(`已删除 OPC 社区「${node.name}」`);
      }
    });
  };

  // ==========================================
  // 进入新增 / 编辑表单页与保存
  // ==========================================
  const openCreateForm = () => {
    setDraft(createEmptyDraft());
    setViewMode('form');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const openEditForm = (node: OpcCommunityNode) => {
    setDraft(buildDraftFromNode(node));
    setViewMode('form');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const handleProvinceChangeInForm = (newProvince: string) => {
    const found = CHINA_REGIONS.find((r) => r.province === newProvince);
    const firstCity = found?.cities[0] || newProvince;
    setDraft((prev) => ({
      ...prev,
      province: newProvince,
      city: firstCity
    }));
  };

  const togglePolicySwitch = (key: OpcPolicyKey) => {
    setDraft((prev) => ({
      ...prev,
      policies: {
        ...prev.policies,
        [key]: {
          ...prev.policies[key],
          enabled: !prev.policies[key].enabled
        }
      }
    }));
  };

  const updatePolicyDesc = (key: OpcPolicyKey, desc: string) => {
    setDraft((prev) => ({
      ...prev,
      policies: {
        ...prev.policies,
        [key]: {
          ...prev.policies[key],
          desc
        }
      }
    }));
  };

  const handleSaveForm = () => {
    const trimmedName = draft.name.trim();
    if (!trimmedName) {
      showToast('请输入社区名称（必填）');
      return;
    }
    if (trimmedName.length > 30) {
      showToast('社区名称不能超过 30 个字');
      return;
    }

    if (!draft.province || !draft.city) {
      showToast('请选择所属省市');
      return;
    }

    const trimmedAddress = draft.address.trim();
    if (!trimmedAddress) {
      showToast('请输入详细地址（必填）');
      return;
    }
    if (trimmedAddress.length > 100) {
      showToast('详细地址不能超过 100 个字');
      return;
    }

    const trimmedCardSummary = draft.cardSummary.trim();
    if (!trimmedCardSummary) {
      showToast('请输入卡片简介（必填）');
      return;
    }
    if (trimmedCardSummary.length > 150) {
      showToast('卡片简介不能超过 150 个字');
      return;
    }

    const trimmedPolicyOverview = draft.policyOverview.trim();
    if (!trimmedPolicyOverview) {
      showToast('请输入政策概述（必填）');
      return;
    }
    if (trimmedPolicyOverview.length > 300) {
      showToast('政策概述不能超过 300 个字');
      return;
    }

    // 校验开启的政策项
    const policyKeys: OpcPolicyKey[] = ['免费工位', '算力支持', '创业投资', '工商注册'];
    const enabledPolicies: OpcPolicyKey[] = [];
    const policyDetails: OpcPolicyDetail[] = policyKeys.map((key) => {
      const cfg = draft.policies[key];
      if (cfg.enabled) {
        enabledPolicies.push(key);
        return {
          key,
          supported: true,
          statusDesc: cfg.desc.trim() || '支持申请，详情咨询社区顾问'
        };
      }
      return {
        key,
        supported: false,
        statusDesc: '暂未开放'
      };
    });

    const trimmedContact = draft.contactName.trim() || '社区运营顾问';
    const rawPhoneDigits = draft.phone.replace(/\D/g, '');
    if (draft.phone.trim() && rawPhoneDigits.length !== 11) {
      showToast('联系电话请输入真实的 11 位手机号码');
      return;
    }
    const cleanPhone = rawPhoneDigits || '13800000000';
    const maskedPhone = maskPhoneNumber(cleanPhone);

    const parsedWeight = Number(draft.sortWeight);
    const sortWeight = Number.isFinite(parsedWeight) ? Math.round(parsedWeight) : 0;

    // 推导区域简称用于前台卡片顶部辅助展示
    const districtLabel =
      draft.province === draft.city ? draft.city : `${draft.province}`;

    if (draft.id) {
      setOpcCommunities((prev) =>
        prev.map((item) => {
          if (item.id !== draft.id) return item;
          return {
            ...item,
            name: trimmedName,
            province: draft.province,
            city: draft.city,
            district: item.city === draft.city ? item.district : districtLabel,
            address: trimmedAddress,
            summary: trimmedCardSummary,
            cardSummary: trimmedCardSummary,
            policyOverview: trimmedPolicyOverview,
            policies: enabledPolicies,
            policyDetails,
            contactName: trimmedContact,
            fullPhone: cleanPhone,
            maskedPhone,
            sortWeight
          };
        })
      );
      showToast(`OPC 社区「${trimmedName}」已保存并同步至前台`);
    } else {
      // 新增默认状态为「隐藏」
      const newNode: OpcCommunityNode = {
        id: `opc-${Date.now()}`,
        province: draft.province,
        city: draft.city,
        district: districtLabel,
        name: trimmedName,
        address: trimmedAddress,
        summary: trimmedCardSummary,
        cardSummary: trimmedCardSummary,
        policyOverview: trimmedPolicyOverview,
        policies: enabledPolicies,
        policyDetails,
        contactName: trimmedContact,
        fullPhone: cleanPhone,
        maskedPhone,
        contactEmail: 'opc-service@xctf-ai.cn',
        serviceHours: '工作日 09:00 - 18:00',
        qrHint: `扫码添加 ${trimmedName} 专属入驻顾问`,
        status: 'hidden',
        sortWeight,
        createdAt: formatDateTime(new Date())
      };
      setOpcCommunities((prev) => [newNode, ...prev]);
      showToast(`已新增 OPC 社区「${trimmedName}」（默认状态为隐藏）`);
    }

    setViewMode('list');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // ==========================================
  // 视图一：列表页 (List Page)
  // ==========================================
  const renderListPage = () => {
    const hasSelection = selectedIds.length > 0;
    const hasActiveFilters =
      filterProvince !== '全部' ||
      filterCity !== '全部' ||
      searchKeyword.trim() !== '' ||
      filterStatus !== 'all';

    return (
      <div className="space-y-5">
        {/* 1. 顶部筛选/搜索区 + 2. 顶部操作区 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          {/* 筛选/搜索区 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            {/* 城市/区域筛选（省 - 市二级下拉，含港澳台） */}
            <div className="md:col-span-5 flex items-center gap-2">
              <select
                value={filterProvince}
                onChange={(e) => {
                  setFilterProvince(e.target.value);
                  setFilterCity('全部');
                }}
                aria-label="按省份/地区筛选"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="全部">全部省/地区（含港澳台）</option>
                {CHINA_REGIONS.map((region) => (
                  <option key={region.province} value={region.province}>
                    {region.province}
                  </option>
                ))}
              </select>

              <span className="text-slate-600 font-mono">-</span>

              <select
                value={filterCity}
                disabled={filterProvince === '全部'}
                onChange={(e) => setFilterCity(e.target.value)}
                aria-label="按城市筛选"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="全部">全部城市</option>
                {filterCityOptions.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* 关键词搜索（社区名称 / 详细地址） */}
            <div className="md:col-span-4 relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder="搜索社区名称或详细地址..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* 状态筛选 */}
            <div className="md:col-span-3 flex items-center gap-2">
              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value as 'all' | 'public' | 'hidden')
                }
                aria-label="按状态筛选"
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="all">全部状态</option>
                <option value="public">公开</option>
                <option value="hidden">隐藏</option>
              </select>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  title="重置筛选"
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer shrink-0"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* 顶部操作区：+ 新增、公开、隐藏、删除 */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={openCreateForm}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增</span>
              </button>

              <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

              <button
                type="button"
                disabled={!hasSelection}
                onClick={() => handleBatchStatus('public')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition ${
                  hasSelection
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>公开</span>
              </button>

              <button
                type="button"
                disabled={!hasSelection}
                onClick={() => handleBatchStatus('hidden')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition ${
                  hasSelection
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>隐藏</span>
              </button>

              <button
                type="button"
                disabled={!hasSelection}
                onClick={handleBatchDelete}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 border transition ${
                  hasSelection
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>删除</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
              {hasSelection && (
                <span className="text-indigo-400 font-bold">
                  已勾选 {selectedIds.length} 项
                </span>
              )}
              <span>共 {filteredList.length} 个 OPC 社区</span>
            </div>
          </div>
        </div>

        {/* 3. 数据列表 Table */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAll}
                      aria-label="全选当前列表 OPC 社区"
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 accent-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4 min-w-[200px]">社区名称</th>
                  <th className="py-3.5 px-4 min-w-[150px]">所属省市</th>
                  <th className="py-3.5 px-4 min-w-[240px]">详细地址</th>
                  <th className="py-3.5 px-4 min-w-[90px]">状态</th>
                  <th className="py-3.5 px-4 min-w-[150px]">创建时间</th>
                  <th className="py-3.5 px-4 text-right min-w-[140px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500">
                      <Building2 className="w-9 h-9 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-bold text-slate-300">暂无匹配的 OPC 社区记录</p>
                      <p className="text-xs mt-1">
                        可调整上方省市/状态/关键词筛选，或点击「新增」录入新的 OPC 社区
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredList.map((item) => {
                    const isChecked = selectedIds.includes(item.id);
                    const isPublic = item.status !== 'hidden';
                    const prov = item.province || inferProvinceByCity(item.city);
                    const regionText = `${prov}-${item.city}`;

                    return (
                      <tr
                        key={item.id}
                        className={`transition ${
                          isChecked ? 'bg-indigo-500/5' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectRow(item.id)}
                            aria-label={`勾选 ${item.name}`}
                            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 accent-indigo-500 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-[13px] flex items-center gap-2">
                            <span>{item.name}</span>
                            {(item.sortWeight ?? 0) > 0 && (
                              <span className="px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/25 text-[10px] font-mono">
                                权重 {item.sortWeight}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap text-slate-300">
                          {regionText}
                        </td>

                        {/* 详细地址：过长截断，悬浮显示全文 */}
                        <td className="py-3.5 px-4 max-w-[260px]">
                          <div
                            title={item.address}
                            className="truncate text-slate-400 cursor-help"
                          >
                            {item.address}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isPublic ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              公开
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                              隐藏
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                          {item.createdAt || '2026-10-01 09:30'}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditForm(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>编辑</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSingle(item)}
                              className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>删除</span>
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
      </div>
    );
  };

  // ==========================================
  // 视图二：新增 / 编辑表单页 (Form Page)
  // ==========================================
  const renderFormPage = () => {
    const isEdit = Boolean(draft.id);
    const maskedPreview = draft.phone.trim() ? maskPhoneNumber(draft.phone) : '138****5612';

    return (
      <div className="space-y-6 pb-8">
        {/* 顶部返回栏 */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold inline-flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回 OPC 社区列表</span>
          </button>
          <span className="text-xs font-bold text-slate-400">
            {isEdit ? '编辑 OPC 社区信息' : '新增 OPC 社区（保存后默认隐藏）'}
          </span>
        </div>

        {/* 区块一：基础信息 */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3.5 flex items-center gap-2.5">
            <MapPin className="w-4 h-4 text-indigo-400" />
            <div>
              <h3 className="text-sm font-black text-white">区块一：基础信息</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                对应前台 OPC 社区列表卡片头部、详细地址、两行简介以及详情弹窗政策概述
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 社区名称（必填，30字） */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">
                  社区名称 <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {draft.name.length}/30
                </span>
              </div>
              <input
                type="text"
                maxLength={30}
                value={draft.name}
                onChange={(e) => setDraft((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="例如：伊莱雅OPC创智空间"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* 所属省市（二级下拉，含港澳台） */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                所属省市 <span className="text-rose-400">*</span>
              </label>
              <div className="flex items-center gap-2">
                <select
                  value={draft.province}
                  onChange={(e) => handleProvinceChangeInForm(e.target.value)}
                  className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {CHINA_REGIONS.map((region) => (
                    <option key={region.province} value={region.province}>
                      {region.province}
                    </option>
                  ))}
                </select>
                <span className="text-slate-600 font-mono">-</span>
                <select
                  value={draft.city}
                  onChange={(e) => setDraft((prev) => ({ ...prev, city: e.target.value }))}
                  className="flex-1 px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer"
                >
                  {formCityOptions.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* 详细地址（必填，100字） */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">
                  详细地址 <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {draft.address.length}/100
                </span>
              </div>
              <input
                type="text"
                maxLength={100}
                value={draft.address}
                onChange={(e) => setDraft((prev) => ({ ...prev, address: e.target.value }))}
                placeholder="例如：江苏省南京市建邺区江东中路软件大道产业园 A 座 5 层"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* 卡片简介（必填，150字） */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">
                  卡片简介 <span className="text-rose-400">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    draft.cardSummary.length >= 150 ? 'text-amber-400 font-bold' : 'text-slate-500'
                  }`}
                >
                  {draft.cardSummary.length}/150
                </span>
              </div>
              <textarea
                rows={2}
                maxLength={150}
                value={draft.cardSummary}
                onChange={(e) => setDraft((prev) => ({ ...prev, cardSummary: e.target.value }))}
                placeholder="对应前台列表卡片中间的两行简介文字，简明描述社区特色与核心优势..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 resize-none leading-relaxed transition"
              />
            </div>

            {/* 政策概述（必填，300字） */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">
                  政策概述 <span className="text-rose-400">*</span>
                </label>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    draft.policyOverview.length >= 300
                      ? 'text-amber-400 font-bold'
                      : 'text-slate-500'
                  }`}
                >
                  {draft.policyOverview.length}/300
                </span>
              </div>
              <textarea
                rows={4}
                maxLength={300}
                value={draft.policyOverview}
                onChange={(e) =>
                  setDraft((prev) => ({ ...prev, policyOverview: e.target.value }))
                }
                placeholder="对应前台详情弹窗中「政策概述」下方的详细说明文字..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 resize-y leading-relaxed transition"
              />
            </div>
          </div>
        </section>

        {/* 区块二：支持政策（开关 + 描述） */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3.5">
            <h3 className="text-sm font-black text-white">区块二：支持政策</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              开启的政策将在前台卡片底部展示标签，并在详情页四宫格高亮展示说明；关闭项将不在卡片显示，详情页自动置灰。
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {POLICY_FIELD_CONFIG.map((cfg) => {
              const state = draft.policies[cfg.key];
              return (
                <div
                  key={cfg.key}
                  className={`rounded-xl border p-4 space-y-3 transition ${
                    state.enabled
                      ? 'bg-slate-950/80 border-indigo-500/35'
                      : 'bg-slate-950/40 border-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center border ${
                          state.enabled
                            ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                            : 'bg-slate-900 text-slate-500 border-slate-800'
                        }`}
                      >
                        {cfg.icon}
                      </span>
                      <div>
                        <div className="text-xs font-bold text-white">{cfg.label}</div>
                        <div className="text-[11px] text-slate-500">
                          {state.enabled ? '已开启 · 前台展示标签与详情' : '已关闭 · 前台不显示标签，详情置灰'}
                        </div>
                      </div>
                    </div>

                    {/* 开启 / 关闭开关 */}
                    <button
                      type="button"
                      role="switch"
                      aria-checked={state.enabled}
                      onClick={() => togglePolicySwitch(cfg.key)}
                      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors cursor-pointer ${
                        state.enabled ? 'bg-indigo-600' : 'bg-slate-700'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          state.enabled ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>

                  {/* 若开启，显示政策说明输入框 */}
                  {state.enabled && (
                    <div className="pt-1">
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">
                        {cfg.inputLabel}
                      </label>
                      <input
                        type="text"
                        maxLength={60}
                        value={state.desc}
                        onChange={(e) => updatePolicyDesc(cfg.key, e.target.value)}
                        placeholder={cfg.placeholder}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700/80 rounded-lg text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* 区块三：联系方式与排序权重 */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3.5 flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="text-sm font-black text-white">区块三：联系方式与排序权重</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                对应详情弹窗底部联系人信息；真实 11 位手机号在前台将由系统自动打码展示，并控制前台列表展示优先级
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* 联系人姓名 */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                联系人姓名
              </label>
              <input
                type="text"
                maxLength={20}
                value={draft.contactName}
                onChange={(e) => setDraft((prev) => ({ ...prev, contactName: e.target.value }))}
                placeholder="例如：林经理"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* 联系电话（真实 11 位手机号，前台自动打码） */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">联系电话（11位手机号）</label>
                <span className="text-[11px] font-mono text-emerald-400">
                  前台打码：{maskedPreview}
                </span>
              </div>
              <input
                type="tel"
                maxLength={11}
                value={draft.phone}
                onChange={(e) =>
                  setDraft((prev) => ({
                    ...prev,
                    phone: e.target.value.replace(/\D/g, '').slice(0, 11)
                  }))
                }
                placeholder="例如：13812345612"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tabular-nums placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* 排序权重 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">排序权重</label>
                <span className="text-[11px] text-slate-500">数字越大越靠前，默认 0</span>
              </div>
              <input
                type="number"
                step={1}
                value={draft.sortWeight}
                onChange={(e) => setDraft((prev) => ({ ...prev, sortWeight: e.target.value }))}
                placeholder="0"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tabular-nums placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </section>

        {/* 页面底部操作区 */}
        <div className="sticky bottom-0 z-10 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 px-6 py-4 flex items-center justify-between shadow-xl shadow-black/40">
          <p className="text-xs text-slate-400">
            {isEdit
              ? '保存后将立即同步更新至前台 OPC 生态社区与政策网络页面'
              : '新增 OPC 社区默认状态为「隐藏」，可在列表页勾选后点击「公开」展示至前台'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveForm}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {viewMode === 'list' ? renderListPage() : renderFormPage()}

      {/* 删除确认弹窗 */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirmModal(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">{confirmModal.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {confirmModal.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
