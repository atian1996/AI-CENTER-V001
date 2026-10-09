import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart as RePieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ReTooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useApp } from '../../../context/AppContext';
import { ModelItem, ModelBillingRule, ModelCallRecord, ModelUserConsumption } from '../../../types';
import {
  mock30DaysModelTrend,
  mockModalityDistribution,
  mockTop10ModelsRank
} from '../../../data/mockModelData';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronDown,
  ChevronUp,
  SlidersHorizontal,
  RefreshCw,
  Sparkles,
  DollarSign,
  TrendingUp,
  Activity,
  Layers,
  FileText,
  Code,
  Download,
  AlertCircle,
  Copy,
  ExternalLink,
  ShieldCheck,
  Zap,
  BarChart3,
  PieChart,
  UserCheck,
  Info,
  Check,
  X,
  Cpu,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  ArrowLeft,
  HelpCircle,
  Upload
} from 'lucide-react';

// ==========================================
// 1. 模型管理列表与新增/编辑组件
// ==========================================
export const ModelListAdminView: React.FC = () => {
  const { models, addModel, updateModel, deleteModel, toggleModelStatus, showToast } = useApp();

  // 搜索与过滤状态
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('全部');
  const [modalityFilter, setModalityFilter] = useState<string>('全部');

  // 弹窗与删除状态
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingModel, setEditingModel] = useState<ModelItem | null>(null);
  const [deletingModelId, setDeletingModelId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<Partial<ModelItem>>({
    name: '',
    id: '',
    modelCodeName: '',
    vendor: '深度求索',
    author: 'DeepSeek',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
    brief: '',
    downloadUrl: '',
    description: '',
    modalities: ['文本'],
    inputModalities: ['文本'],
    outputModalities: ['文本'],
    contextLengthValue: 128,
    contextLengthUnit: 'K',
    maxOutputTokens: 65536,
    apiUrl: 'https://api.deepseek.com/v1/chat/completions',
    authType: 'API Key',
    authCredential: '',
    timeoutSeconds: 30,
    billingRules: [
      { id: 'br_init_1', modality: '文本', direction: '输入', unit: 'Token（按M tokens）', price: 1.0 },
      { id: 'br_init_2', modality: '文本', direction: '输出', unit: 'Token（按M tokens）', price: 3.0 }
    ],
    protocols: ['Chat Completions'],
    status: '已上架',
    tags: ['热门', '高性能']
  });

  const [formError, setFormError] = useState<string | null>(null);
  const [activeFormTab, setActiveFormTab] = useState<'base' | 'spec' | 'auth' | 'billing' | 'protocol' | 'doc'>('base');

  // 计算可选择的模态并集 (输入模态与输出模态的并集)
  const availableRuleModalities = useMemo(() => {
    const inputs = formData.inputModalities || ['文本'];
    const outputs = formData.outputModalities || ['文本'];
    const unionSet = new Set<string>([...inputs, ...outputs]);
    return Array.from(unionSet);
  }, [formData.inputModalities, formData.outputModalities]);

  // 上传 Logo 图片处理
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      if (showToast) showToast('图片文件大小不能超过 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setFormData(prev => ({ ...prev, logo: result }));
        if (showToast) showToast('Logo 图片已成功上传');
      }
    };
    reader.readAsDataURL(file);
  };

  // 重置表单
  const handleOpenCreate = () => {
    setEditingModel(null);
    setFormData({
      name: '',
      id: '',
      modelCodeName: '',
      vendor: '深度求索',
      author: 'DeepSeek',
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      brief: '',
      downloadUrl: '',
      description: '',
      modalities: ['文本'],
      inputModalities: ['文本'],
      outputModalities: ['文本'],
      contextLengthValue: 128,
      contextLengthUnit: 'K',
      maxOutputTokens: 65536,
      trialCountLimit: 5,
      apiUrl: 'https://api.deepseek.com/v1/chat/completions',
      authType: 'API Key',
      authCredential: '',
      timeoutSeconds: 30,
      billingRules: [
        { id: 'br_init_1', modality: '文本', direction: '输入', unit: 'Token（按M tokens）', price: 1.0 },
        { id: 'br_init_2', modality: '文本', direction: '输出', unit: 'Token（按M tokens）', price: 3.0 }
      ],
      protocols: ['Chat Completions'],
      status: '已上架',
      tags: ['热门']
    });
    setFormError(null);
    setActiveFormTab('base');
    setIsFormOpen(true);
  };

  const handleOpenEdit = (model: ModelItem) => {
    setEditingModel(model);
    setFormData({ 
      ...model,
      trialCountLimit: model.trialCountLimit !== undefined ? model.trialCountLimit : 5
    });
    setFormError(null);
    setActiveFormTab('base');
    setIsFormOpen(true);
  };

  // 复制ID
  const handleCopyId = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    if (showToast) showToast(`已复制模型ID: ${id}`);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // 筛选数据
  const filteredModels = useMemo(() => {
    return models.filter(m => {
      const matchSearch =
        m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.brief.toLowerCase().includes(searchTerm.toLowerCase());
      const matchStatus = statusFilter === '全部' || m.status === statusFilter;
      const matchModality =
        modalityFilter === '全部' ||
        (m.modalities && m.modalities.includes(modalityFilter)) ||
        (m.inputModalities && m.inputModalities.includes(modalityFilter)) ||
        (m.outputModalities && m.outputModalities.includes(modalityFilter));
      return matchSearch && matchStatus && matchModality;
    });
  }, [models, searchTerm, statusFilter, modalityFilter]);

  // 添加计费行
  const handleAddBillingRule = () => {
    const defaultMod = availableRuleModalities[0] || '文本';
    const newRule: ModelBillingRule = {
      id: `br_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      modality: defaultMod,
      direction: '输入',
      unit: 'Token（按M tokens）',
      price: 1.0
    };
    setFormData(prev => ({
      ...prev,
      billingRules: [...(prev.billingRules || []), newRule]
    }));
  };

  // 删减计费行
  const handleRemoveBillingRule = (ruleId: string) => {
    setFormData(prev => ({
      ...prev,
      billingRules: (prev.billingRules || []).filter(r => r.id !== ruleId)
    }));
  };

  // 更新计费行
  const handleUpdateBillingRule = (ruleId: string, updates: Partial<ModelBillingRule>) => {
    setFormData(prev => ({
      ...prev,
      billingRules: (prev.billingRules || []).map(r => (r.id === ruleId ? { ...r, ...updates } : r))
    }));
  };

  // 校验规则唯一性
  const checkBillingRulesDuplicates = (rules: ModelBillingRule[]): string | null => {
    const seen = new Set<string>();
    for (const r of rules) {
      const key = `${r.modality}_${r.direction}`;
      if (seen.has(key)) {
        return `重复的计费规则定义: 【${r.modality} - ${r.direction}】不能重复添加，请检查并合并！`;
      }
      seen.add(key);
    }
    return null;
  };

  // 提交模型表单
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.name?.trim()) {
      setFormError('模型名称不能为空');
      setActiveFormTab('base');
      return;
    }
    if (!formData.id?.trim()) {
      setFormError('模型唯一ID/代码名称不能为空');
      setActiveFormTab('base');
      return;
    }
    if (!formData.vendor?.trim()) {
      setFormError('所属厂商不能为空');
      setActiveFormTab('base');
      return;
    }
    if (!formData.apiUrl?.trim()) {
      setFormError('API 接口地址不能为空');
      setActiveFormTab('auth');
      return;
    }

    // 校验计费规则重复
    const rules = formData.billingRules || [];
    const duplicateError = checkBillingRulesDuplicates(rules);
    if (duplicateError) {
      setFormError(duplicateError);
      setActiveFormTab('billing');
      return;
    }

    // 自动更新并集 modalities 数组
    const allMods = Array.from(
      new Set([...(formData.inputModalities || []), ...(formData.outputModalities || [])])
    );

    const contextLengthStr = `${formData.contextLengthValue || 128}${formData.contextLengthUnit || 'K'}`;

    const modelPayload: ModelItem = {
      id: formData.id!.trim(),
      name: formData.name!.trim(),
      modelCodeName: formData.id!.trim(),
      vendor: formData.vendor!.trim(),
      author: formData.author?.trim() || formData.vendor!.trim(),
      logo: formData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      brief: formData.brief?.trim() || '',
      downloadUrl: formData.downloadUrl?.trim() || '',
      description: formData.description?.trim() || '暂无详细描述信息。',
      modalities: allMods.length > 0 ? allMods : ['文本'],
      inputModalities: formData.inputModalities || ['文本'],
      outputModalities: formData.outputModalities || ['文本'],
      contextLength: contextLengthStr,
      contextLengthValue: formData.contextLengthValue || 128,
      contextLengthUnit: formData.contextLengthUnit || 'K',
      maxOutputTokens: formData.maxOutputTokens || 65536,
      trialCountLimit: formData.trialCountLimit !== undefined ? Number(formData.trialCountLimit) : 5,
      apiUrl: formData.apiUrl!.trim(),
      authType: formData.authType || 'API Key',
      authCredential: formData.authCredential || '',
      timeoutSeconds: formData.timeoutSeconds || 30,
      billingRules: rules,
      protocols: formData.protocols || ['Chat Completions'],
      status: formData.status || '已上架',
      tags: formData.tags || ['热门'],
      updatedAt: new Date().toISOString().split('T')[0],
      apiDocContent: formData.apiDocContent || '### API 调用快速开始...',
      codeCurl: formData.codeCurl || `curl ${formData.apiUrl} -H "Authorization: Bearer YOUR_API_KEY"`,
      codePython: formData.codePython || `from openai import OpenAI\nclient = OpenAI(api_key="YOUR_KEY", base_url="${formData.apiUrl}")`,
      typeTag: formData.typeTag || '文本',
      priceInput: formData.priceInput || '¥1.00 / M tokens',
      priceOutput: formData.priceOutput || '¥3.00 / M tokens',
      benchmarks: formData.benchmarks || [{ name: 'MMLU', score: 88.5 }],
      latencyMs: formData.latencyMs || 280,
      apiDocsUrl: formData.apiDocsUrl || formData.apiUrl || 'https://api.deepseek.com'
    };

    if (editingModel) {
      updateModel(modelPayload.id, modelPayload);
      if (showToast) showToast(`成功更新模型配置【${modelPayload.name}】`);
    } else {
      // 检查ID重复
      if (models.some(m => m.id === modelPayload.id)) {
        setFormError(`模型ID "${modelPayload.id}" 已存在，请使用唯一的模型代码`);
        setActiveFormTab('base');
        return;
      }
      addModel(modelPayload);
      if (showToast) showToast(`成功创建并上架大模型【${modelPayload.name}】`);
    }

    setIsFormOpen(false);
  };

  if (isFormOpen) {
    return (
      <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回模型列表</span>
            </button>
            <div>
              <h3 className="font-bold text-base text-white">
                {editingModel ? `编辑大模型: ${editingModel.name}` : '添加与接入新大模型'}
              </h3>
              <p className="text-xs text-slate-400">请配置模型属性、规格参数与计费策略</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleSubmitForm}
            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer"
          >
            {editingModel ? '保存变更配置' : '立即保存上架'}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 text-xs overflow-x-auto rounded-xl">
          {[
            { key: 'base', label: '基础信息' },
            { key: 'spec', label: '模态与规格' },
            { key: 'auth', label: '接入与凭证' },
            { key: 'billing', label: '计费策略' },
            { key: 'protocol', label: '支持协议与状态' },
            { key: 'doc', label: '文档与示例代码' }
          ].map(tab => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveFormTab(tab.key as any)}
              className={`px-4 py-3 font-semibold transition border-b-2 whitespace-nowrap ${
                activeFormTab === tab.key
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {formError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-xs flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        <form onSubmit={handleSubmitForm} className="space-y-6">
          {/* 第一选项卡：基础信息 */}
          {activeFormTab === 'base' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    模型唯一代号 (ID) <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    disabled={!!editingModel}
                    placeholder="如: deepseek-r1, gpt-4o, qwen-max"
                    value={formData.id || ''}
                    onChange={e => setFormData({ ...formData, id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 outline-none transition disabled:opacity-50"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">全局唯一，提交后不可变更，用于 API 调用的 model 参数</p>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">
                    模型显示名称 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="如: DeepSeek R1 深度推理"
                    value={formData.name || ''}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">所属厂商 / 机构</label>
                  <input
                    type="text"
                    placeholder="如: DeepSeek, OpenAI, 阿里达摩院"
                    value={formData.vendor || ''}
                    onChange={e => setFormData({ ...formData, vendor: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                  />
                </div>

                {/* LOGO 图标上传组件 */}
                <div>
                  <label className="block text-slate-300 font-bold mb-1">模型 LOGO 图标</label>
                  <div className="flex items-center gap-3 p-2 bg-slate-950 border border-slate-800 rounded-xl">
                    <img
                      src={formData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80'}
                      alt="Logo preview"
                      className="w-10 h-10 rounded-lg object-cover border border-slate-700 bg-slate-900 shrink-0"
                    />
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="输入图片网络 URL 地址"
                        value={formData.logo || ''}
                        onChange={e => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full bg-transparent text-xs text-white placeholder:text-slate-600 outline-none"
                      />
                    </div>
                    <label className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold transition cursor-pointer flex items-center gap-1 shrink-0">
                      <Upload className="w-3.5 h-3.5" />
                      <span>上传图片</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={e => {
                          const file = e.target.files?.[0];
                          if (file) {
                            if (file.size > 2 * 1024 * 1024) {
                              alert('图片文件不能超过 2MB');
                              return;
                            }
                            const reader = new FileReader();
                            reader.onload = (event) => {
                              if (event.target?.result) {
                                setFormData({ ...formData, logo: event.target.result as string });
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">模型功能简介</label>
                <textarea
                  rows={3}
                  placeholder="简要描述模型核心优势、适用场景等..."
                  value={formData.description || ''}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">免费体验次数上限</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={1000}
                    value={formData.trialCountLimit !== undefined ? formData.trialCountLimit : 5}
                    onChange={e => setFormData({ ...formData, trialCountLimit: parseInt(e.target.value) || 0 })}
                    className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 outline-none transition"
                  />
                  <span className="text-slate-400">次 / 用户 (设置为 0 时禁用前台对话体验功能)</span>
                </div>
              </div>
            </div>
          )}

          {/* 第二选项卡：模态与规格 */}
          {activeFormTab === 'spec' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">输入模态支持</label>
                  <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {['文本', '图像', '音频', '视频', '文档'].map(m => {
                      const checked = (formData.inputModalities || ['文本']).includes(m);
                      return (
                        <button
                          type="button"
                          key={m}
                          onClick={() => {
                            const list = formData.inputModalities || ['文本'];
                            const next = checked ? list.filter(i => i !== m) : [...list, m];
                            setFormData({ ...formData, inputModalities: next });
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                            checked
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">输出模态支持</label>
                  <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-3 rounded-xl border border-slate-800">
                    {['文本', '图像', '音频', '视频', '代码'].map(m => {
                      const checked = (formData.outputModalities || ['文本']).includes(m);
                      return (
                        <button
                          type="button"
                          key={m}
                          onClick={() => {
                            const list = formData.outputModalities || ['文本'];
                            const next = checked ? list.filter(i => i !== m) : [...list, m];
                            setFormData({ ...formData, outputModalities: next });
                          }}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                            checked
                              ? 'bg-indigo-600 text-white border-indigo-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">上下文窗口长度</label>
                  <input
                    type="text"
                    placeholder="如: 64k, 128k, 1M"
                    value={formData.contextLength || ''}
                    onChange={e => setFormData({ ...formData, contextLength: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">最大单次输出 Token</label>
                  <input
                    type="number"
                    placeholder="如: 8192"
                    value={formData.maxOutputTokens || 8192}
                    onChange={e => setFormData({ ...formData, maxOutputTokens: parseInt(e.target.value) || 4096 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">平均响应延迟 (ms)</label>
                  <input
                    type="number"
                    placeholder="如: 320"
                    value={formData.latencyMs || 280}
                    onChange={e => setFormData({ ...formData, latencyMs: parseInt(e.target.value) || 300 })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 第三选项卡：接入与凭证 */}
          {activeFormTab === 'auth' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">
                  API 端点 Base URL <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="https://api.deepseek.com/v1"
                  value={formData.apiUrl || ''}
                  onChange={e => setFormData({ ...formData, apiUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">鉴权类型</label>
                  <select
                    value={formData.authType || 'API Key'}
                    onChange={e => setFormData({ ...formData, authType: e.target.value as any })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 outline-none transition"
                  >
                    <option value="API Key">Bearer API Key</option>
                    <option value="OAuth2">OAuth2 Token</option>
                    <option value="Custom Header">Custom Header</option>
                    <option value="无鉴权">无鉴权 / 内网暴露</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">密钥 / Credential (暗文存储)</label>
                  <input
                    type="password"
                    placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                    value={formData.authCredential || ''}
                    onChange={e => setFormData({ ...formData, authCredential: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">请求超时时间 (秒)</label>
                <input
                  type="number"
                  min={5}
                  max={600}
                  value={formData.timeoutSeconds || 60}
                  onChange={e => setFormData({ ...formData, timeoutSeconds: parseInt(e.target.value) || 60 })}
                  className="w-32 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>
          )}

          {/* 第四选项卡：计费策略 */}
          {activeFormTab === 'billing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-200">计费策略明细规则</h4>
                  <p className="text-[11px] text-slate-400">针对文本、图像、音视频等不同模态分输入输出方向精准核算单价</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddBillingRule}
                  className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-400 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>添加计费规则</span>
                </button>
              </div>

              <div className="space-y-3">
                {(formData.billingRules || []).length === 0 ? (
                  <div className="p-6 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-xs">
                    暂未添加计费规则，前台将默认显示为免费试用
                  </div>
                ) : (
                  (formData.billingRules || []).map((rule, idx) => (
                    <div key={rule.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex flex-wrap items-center gap-3 text-xs">
                      <span className="text-slate-500 font-mono w-6">#{idx + 1}</span>

                      <select
                        value={rule.modality}
                        onChange={e => handleUpdateBillingRule(rule.id, { modality: e.target.value as any })}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                      >
                        <option value="文本">文本 (Tokens)</option>
                        <option value="图像">图像 (张)</option>
                        <option value="音频">音频 (分钟)</option>
                        <option value="视频">视频 (秒)</option>
                      </select>

                      <select
                        value={rule.direction}
                        onChange={e => handleUpdateBillingRule(rule.id, { direction: e.target.value as any })}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                      >
                        <option value="Input">输入 (Prompt)</option>
                        <option value="Output">输出 (Completion)</option>
                      </select>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400">单价 ¥</span>
                        <input
                          type="number"
                          step="0.001"
                          min="0"
                          value={rule.price}
                          onChange={e => handleUpdateBillingRule(rule.id, { price: parseFloat(e.target.value) || 0 })}
                          className="w-24 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-amber-300 font-mono outline-none"
                        />
                      </div>

                      <select
                        value={rule.unit}
                        onChange={e => handleUpdateBillingRule(rule.id, { unit: e.target.value as any })}
                        className="bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-slate-200 outline-none"
                      >
                        <option value="/ 1K tokens">/ 1K tokens</option>
                        <option value="/ 1M tokens">/ 1M tokens</option>
                        <option value="/ 张">/ 张</option>
                        <option value="/ 分钟">/ 分钟</option>
                        <option value="/ 秒">/ 秒</option>
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveBillingRule(rule.id)}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-900 transition ml-auto"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* 第五选项卡：支持协议与状态 */}
          {activeFormTab === 'protocol' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">支持协议</label>
                <div className="flex items-center gap-2 flex-wrap bg-slate-950 p-3 rounded-xl border border-slate-800">
                  {['Chat Completions', 'Embeddings', 'Responses / Stream', 'Realtime WebSockets', 'Anthropic Claude Spec'].map(p => {
                    const checked = (formData.protocols || ['Chat Completions']).includes(p);
                    return (
                      <button
                        type="button"
                        key={p}
                        onClick={() => {
                          const list = formData.protocols || ['Chat Completions'];
                          const next = checked ? list.filter(i => i !== p) : [...list, p];
                          setFormData({ ...formData, protocols: next });
                        }}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition ${
                          checked
                            ? 'bg-indigo-600 text-white border-indigo-500'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {p}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">上架状态</label>
                <select
                  value={formData.status || '已上架'}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white focus:border-indigo-500 outline-none transition"
                >
                  <option value="已上架">已上架 (前台用户可见且可调用)</option>
                  <option value="已下架">已下架 (暂停服务，仅后台可见)</option>
                  <option value="草稿">草稿 (内部测试准备中)</option>
                </select>
              </div>
            </div>
          )}

          {/* 第六选项卡：文档与示例代码 */}
          {activeFormTab === 'doc' && (
            <div className="space-y-4">
              <div>
                <label className="block text-slate-300 font-bold mb-1">cURL 请求示例</label>
                <textarea
                  rows={3}
                  value={formData.codeCurl || ''}
                  onChange={e => setFormData({ ...formData, codeCurl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-indigo-300 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Python 调用示例</label>
                <textarea
                  rows={4}
                  value={formData.codePython || ''}
                  onChange={e => setFormData({ ...formData, codePython: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 font-mono text-xs text-emerald-300 focus:border-indigo-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">官方 API 文档链接</label>
                <input
                  type="text"
                  placeholder="https://platform.openai.com/docs"
                  value={formData.apiDocsUrl || ''}
                  onChange={e => setFormData({ ...formData, apiDocsUrl: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-white font-mono placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl border border-slate-700 transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              {editingModel ? '保存变更配置' : '立即保存上架'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 顶部搜索与过滤工具栏 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl">
        {/* 搜索框 */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="搜索模型名称、ID代码、厂商、简介关键词..."
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 右侧筛选下拉与新建按钮 */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">状态:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="全部">全部状态</option>
                <option value="已上架">已上架</option>
                <option value="已下架">已下架</option>
                <option value="草稿">草稿</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">模态:</span>
              <select
                value={modalityFilter}
                onChange={e => setModalityFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="全部">全部模态</option>
                <option value="文本">文本</option>
                <option value="图像">图像</option>
                <option value="音频">音频</option>
                <option value="视频">视频</option>
                <option value="向量">向量</option>
              </select>
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 transition cursor-pointer active:scale-95"
            >
              <Plus className="w-4 h-4" />
              添加新模型
            </button>
          </div>
        </div>

      {/* 模型列表表格 */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold text-[11px]">
                <th className="py-3.5 px-3">Logo</th>
                <th className="py-3.5 px-3">模型名称</th>
                <th className="py-3.5 px-3">模型唯一ID</th>
                <th className="py-3.5 px-3">所属厂商</th>
                <th className="py-3.5 px-3">输入模态</th>
                <th className="py-3.5 px-3">输出模态</th>
                <th className="py-3.5 px-3">上下文长度</th>
                <th className="py-3.5 px-3 text-center">免费体验</th>
                <th className="py-3.5 px-3">计费策略</th>
                <th className="py-3.5 px-3">状态</th>
                <th className="py-3.5 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredModels.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <Cpu className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    未找到匹配的大模型配置
                  </td>
                </tr>
              ) : (
                filteredModels.map(model => (
                  <tr key={model.id} className="hover:bg-slate-800/40 transition">
                    {/* Logo */}
                    <td className="py-3.5 px-3">
                      <img
                        src={model.logo}
                        alt={model.name}
                        className="w-9 h-9 rounded-xl object-cover border border-slate-700/80 bg-slate-950 shrink-0"
                      />
                    </td>

                    {/* 模型名称 */}
                    <td className="py-3.5 px-3 font-extrabold text-slate-100 whitespace-nowrap">
                      {model.name}
                    </td>

                    {/* 模型唯一ID */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-indigo-400 bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800 w-fit whitespace-nowrap">
                        <span>{model.id}</span>
                        <button
                          onClick={e => handleCopyId(model.id, e)}
                          className="text-slate-500 hover:text-slate-300 transition"
                          title="复制模型ID"
                        >
                          {copiedId === model.id ? (
                            <Check className="w-3 h-3 text-emerald-400" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    </td>

                    {/* 所属厂商 */}
                    <td className="py-3.5 px-3 text-slate-300 whitespace-nowrap text-xs">
                      {model.vendor}
                    </td>

                    {/* 输入模态 */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {(model.inputModalities || ['文本']).map(m => (
                          <span key={m} className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700/60 text-slate-300 text-[10px]">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 输出模态 */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center gap-1 flex-wrap">
                        {(model.outputModalities || ['文本']).map(m => (
                          <span key={m} className="px-1.5 py-0.2 rounded bg-slate-800 border border-slate-700/60 text-slate-300 text-[10px]">
                            {m}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* 上下文长度 */}
                    <td className="py-3.5 px-3 font-mono font-bold text-slate-200 text-xs whitespace-nowrap">
                      {model.contextLength}
                    </td>

                    {/* 免费体验 */}
                    <td className="py-3.5 px-3 text-center font-mono font-bold text-amber-400 text-xs whitespace-nowrap">
                      {model.trialCountLimit !== undefined ? model.trialCountLimit : 5} 次
                    </td>

                    {/* 计费策略 */}
                    <td className="py-3.5 px-3">
                      <div className="space-y-1">
                        {model.billingRules && model.billingRules.length > 0 ? (
                          model.billingRules.slice(0, 2).map(r => (
                            <div key={r.id} className="text-[11px] flex items-center gap-1.5 text-slate-300">
                              <span className="px-1 py-0.2 bg-slate-800 text-slate-400 rounded text-[9px] border border-slate-700">
                                {r.modality}-{r.direction}
                              </span>
                              <span className="font-bold text-amber-300">¥{r.price.toFixed(2)}</span>
                            </div>
                          ))
                        ) : (
                          <span className="text-slate-500 text-[11px]">免费 / 未定义</span>
                        )}
                      </div>
                    </td>

                    {/* 状态 */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <button
                        onClick={() => {
                          const nextStatus = model.status === '已上架' ? '已下架' : '已上架';
                          toggleModelStatus(model.id, nextStatus);
                          if (showToast) showToast(`已将模型【${model.name}】状态切换为: ${nextStatus}`);
                        }}
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1.5 transition cursor-pointer ${
                          model.status === '已上架'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                            : model.status === '已下架'
                            ? 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                        }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${model.status === '已上架' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'}`} />
                        {model.status}
                      </button>
                    </td>

                    {/* 操作列 */}
                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleOpenEdit(model)}
                          className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 transition cursor-pointer"
                          title="编辑配置"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeletingModelId(model.id)}
                          className="p-1.5 rounded-lg bg-slate-800/60 hover:bg-rose-950/80 text-rose-400 border border-rose-900/40 hover:border-rose-700 transition cursor-pointer"
                          title="删除模型"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      {deletingModelId && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl text-slate-100 animate-fade-in">
            <div className="flex items-center gap-3 text-rose-400">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="font-bold text-base">确认彻底删除大模型？</h3>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              您即将删除模型ID为 <code className="text-indigo-300 font-mono bg-slate-950 px-1.5 py-0.5 rounded border border-slate-800">{deletingModelId}</code> 的配置。此操作将同时清空关联计费项，且不可恢复。
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingModelId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteModel(deletingModelId);
                  setDeletingModelId(null);
                  if (showToast) showToast('已彻底删除该模型配置');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-600/30 transition cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}













              {/* 2. 模态与规格 */}
              {activeFormTab === 'spec' && (
                <div className="space-y-5">
                  {/* 输入模态多选 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      输入模态支持 <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['文本', '图像', '音频', '视频'].map(m => {
                        const active = (formData.inputModalities || []).includes(m);
                        return (
                          <button
                            type="button"
                            key={m}
                            onClick={() => {
                              const curr = formData.inputModalities || [];
                              const next = active ? curr.filter(x => x !== m) : [...curr, m];
                              if (next.length === 0) return;
                              setFormData({ ...formData, inputModalities: next });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                              active
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:bg-slate-800'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 输出模态多选 */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">
                      输出模态支持 <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {['文本', '图像', '音频', '视频', '向量'].map(m => {
                        const active = (formData.outputModalities || []).includes(m);
                        return (
                          <button
                            type="button"
                            key={m}
                            onClick={() => {
                              const curr = formData.outputModalities || [];
                              const next = active ? curr.filter(x => x !== m) : [...curr, m];
                              if (next.length === 0) return;
                              setFormData({ ...formData, outputModalities: next });
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition ${
                              active
                                ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:bg-slate-800'
                            }`}
                          >
                            {m}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 上下文长度 */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        上下文窗口数值 <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="number"
                        min={1}
                        value={formData.contextLengthValue || 128}
                        onChange={e => setFormData({ ...formData, contextLengthValue: Number(e.target.value) })}
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">上下文单位</label>
                      <select
                        value={formData.contextLengthUnit || 'K'}
                        onChange={e => setFormData({ ...formData, contextLengthUnit: e.target.value as 'K' | 'M' })}
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="K">K (千tokens, 默认)</option>
                        <option value="M">M (百万tokens, 1.0M等)</option>
                      </select>
                    </div>
                  </div>

                  {/* 最大输出 Token */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">最大单次输出 Token 数</label>
                    <input
                      type="number"
                      step={1024}
                      value={formData.maxOutputTokens || 65536}
                      onChange={e => setFormData({ ...formData, maxOutputTokens: Number(e.target.value) })}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              )}

              {/* 3. 接入与凭证 */}
              {activeFormTab === 'auth' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      API 网关 Base URL <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="https://api.deepseek.com/v1/chat/completions"
                      value={formData.apiUrl || ''}
                      onChange={e => setFormData({ ...formData, apiUrl: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">认证类型</label>
                      <select
                        value={formData.authType || 'API Key'}
                        onChange={e => setFormData({ ...formData, authType: e.target.value as any })}
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="API Key">API Key (Header / Bearer)</option>
                        <option value="Bearer">Bearer Token</option>
                        <option value="公开">公开访问 (免鉴权)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">请求超时时间 (秒)</label>
                      <input
                        type="number"
                        min={5}
                        max={300}
                        value={formData.timeoutSeconds || 30}
                        onChange={e => setFormData({ ...formData, timeoutSeconds: Number(e.target.value) })}
                        className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">上游认证凭证 / API Key</label>
                    <input
                      type="password"
                      placeholder="sk-xxxxxxxxxxxxxxxxxxxxxxxx"
                      value={formData.authCredential || ''}
                      onChange={e => setFormData({ ...formData, authCredential: e.target.value })}
                      className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 font-mono"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">后台安全加密存储，仅供系统代理请求时调用。</p>
                  </div>
                </div>
              )}

              {/* 4. 阶梯计费策略 */}
              {activeFormTab === 'billing' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-200 text-xs">模型计费规则</h4>
                      <p className="text-[11px] text-slate-400">
                        【适用模态】下拉继承自输入/输出模态之并集：[{availableRuleModalities.join(', ')}]
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={handleAddBillingRule}
                      className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs rounded-xl flex items-center gap-1 font-semibold transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      增加计费项
                    </button>
                  </div>

                  <div className="space-y-3">
                    {(formData.billingRules || []).map((rule, idx) => (
                      <div
                        key={rule.id}
                        className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 grid grid-cols-12 gap-2 items-center text-xs"
                      >
                        {/* 适用模态 */}
                        <div className="col-span-3">
                          <label className="block text-[10px] text-slate-500 mb-0.5">适用模态</label>
                          <select
                            value={rule.modality}
                            onChange={e => {
                              const val = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                billingRules: (prev.billingRules || []).map(r => (r.id === rule.id ? { ...r, modality: val } : r))
                              }));
                            }}
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                          >
                            {availableRuleModalities.map(m => (
                              <option key={m} value={m}>
                                {m}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* 方向 */}
                        <div className="col-span-2">
                          <label className="block text-[10px] text-slate-500 mb-0.5">方向</label>
                          <select
                            value={rule.direction}
                            onChange={e => {
                              const val = e.target.value as '输入' | '输出';
                              setFormData(prev => ({
                                ...prev,
                                billingRules: (prev.billingRules || []).map(r => (r.id === rule.id ? { ...r, direction: val } : r))
                              }));
                            }}
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                          >
                            <option value="输入">输入</option>
                            <option value="输出">输出</option>
                          </select>
                        </div>

                        {/* 计价单位 */}
                        <div className="col-span-3">
                          <label className="block text-[10px] text-slate-500 mb-0.5">计价单位</label>
                          <select
                            value={rule.unit}
                            onChange={e => {
                              const val = e.target.value;
                              setFormData(prev => ({
                                ...prev,
                                billingRules: (prev.billingRules || []).map(r => (r.id === rule.id ? { ...r, unit: val } : r))
                              }));
                            }}
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-slate-100"
                          >
                            <option value="Token（按M tokens）">Token（按M tokens）</option>
                            <option value="字符（按千字）">字符（按千字）</option>
                            <option value="张数（按张）">张数（按张）</option>
                            <option value="秒数（按秒）">秒数（按秒）</option>
                          </select>
                        </div>

                        {/* 单价 (元) */}
                        <div className="col-span-3">
                          <label className="block text-[10px] text-slate-500 mb-0.5">单价 (元)</label>
                          <input
                            type="number"
                            step={0.01}
                            min={0}
                            value={rule.price}
                            onChange={e => {
                              const val = Number(e.target.value);
                              setFormData(prev => ({
                                ...prev,
                                billingRules: (prev.billingRules || []).map(r => (r.id === rule.id ? { ...r, price: val } : r))
                              }));
                            }}
                            className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-2 py-1.5 text-xs text-slate-100 font-bold text-amber-400"
                          />
                        </div>

                        {/* 删除 */}
                        <div className="col-span-1 text-right pt-3">
                          <button
                            type="button"
                            onClick={() => handleRemoveBillingRule(rule.id)}
                            className="p-1 text-slate-500 hover:text-rose-400 transition"
                            title="删除此规则"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

    </div>
  );
};


// ==========================================
// 2. 模型调用记录管理组件
// ==========================================
export const ModelCallsAdminView: React.FC = () => {
  const { modelCallRecords, models } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [timeRange, setTimeRange] = useState<'all' | 'today' | '7days' | 'month'>('all');
  const [selectedModelFilter, setSelectedModelFilter] = useState<string>('全部');
  const [statusFilter, setStatusFilter] = useState<string>('全部');

  // 排序控制
  const [sortField, setSortField] = useState<'callTime' | 'cost' | 'inputCount' | 'latencyMs'>('callTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // 详情 Modal
  const [selectedRecord, setSelectedRecord] = useState<ModelCallRecord | null>(null);

  // 过滤逻辑
  const filteredRecords = useMemo(() => {
    return modelCallRecords
      .filter(record => {
        const matchSearch =
          record.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.modelName.toLowerCase().includes(searchTerm.toLowerCase());

        const matchModel = selectedModelFilter === '全部' || record.modelName === selectedModelFilter;
        const matchStatus = statusFilter === '全部' || record.status === statusFilter;

        return matchSearch && matchModel && matchStatus;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];

        if (typeof valA === 'string') {
          return sortOrder === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
        }
        return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [modelCallRecords, searchTerm, selectedModelFilter, statusFilter, sortField, sortOrder]);

  // 统计数据
  const stats = useMemo(() => {
    const totalCalls = filteredRecords.length;
    const totalCost = filteredRecords.reduce((acc, curr) => acc + curr.cost, 0);
    const successCalls = filteredRecords.filter(r => r.status === '成功').length;
    const successRate = totalCalls > 0 ? ((successCalls / totalCalls) * 100).toFixed(1) : '100.0';
    const avgLatency =
      totalCalls > 0 ? (filteredRecords.reduce((acc, curr) => acc + curr.latencyMs, 0) / totalCalls).toFixed(0) : '0';

    return { totalCalls, totalCost, successRate, avgLatency };
  }, [filteredRecords]);

  const handleToggleSort = (field: 'callTime' | 'cost' | 'inputCount' | 'latencyMs') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="space-y-6">
      {/* 4 大核心指标卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">调用总频次</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">{stats.totalCalls.toLocaleString()} <span className="text-xs text-slate-500 font-normal">次</span></div>
          <p className="text-[10px] text-emerald-400 font-medium">包含文本、图像与多模态模型</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">算力扣费总额</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-indigo-400">¥{stats.totalCost.toFixed(4)}</div>
          <p className="text-[10px] text-slate-500">按精确计费规则扣除</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">成功率</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400">{stats.successRate}%</div>
          <p className="text-[10px] text-slate-500">异常调用自动进入重试诊断</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">平均响应延时</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">{stats.avgLatency} <span className="text-xs text-slate-500 font-normal">ms</span></div>
          <p className="text-[10px] text-slate-500">网关全程耗时监控</p>
        </div>
      </div>

      {/* 搜索与多维过滤条 */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="搜索调用ID、用户名、UID、模型名称..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/80 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">模型选择:</span>
              <select
                value={selectedModelFilter}
                onChange={e => setSelectedModelFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="全部">全部模型</option>
                {models.map(m => (
                  <option key={m.id} value={m.name}>
                    {m.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">状态:</span>
              <select
                value={statusFilter}
                onChange={e => setStatusFilter(e.target.value)}
                className="bg-slate-950/80 border border-slate-700/80 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="全部">全部状态</option>
                <option value="成功">成功</option>
                <option value="失败">失败</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* 调用日志表格 */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-semibold">
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('callTime')}>
                  <div className="flex items-center gap-1">
                    调用时间 / 单号
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">调用用户 (UID)</th>
                <th className="py-3.5 px-4">请求大模型</th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('inputCount')}>
                  <div className="flex items-center gap-1">
                    使用量 / Token开销
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('cost')}>
                  <div className="flex items-center gap-1">
                    扣费金额
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4 cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('latencyMs')}>
                  <div className="flex items-center gap-1">
                    耗时 (ms)
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-4 text-right">日志</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {filteredRecords.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500">
                    未查找到相关模型API调用日志
                  </td>
                </tr>
              ) : (
                filteredRecords.map(record => (
                  <tr key={record.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{record.callTime}</div>
                      <div className="font-mono text-[10px] text-slate-500">{record.id}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200">{record.userName}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{record.userId}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-indigo-400">{record.modelName}</div>
                      <div className="text-[10px] text-slate-500">{record.matchedBillingRule}</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-200 font-mono">
                        入: {record.inputCount} / 出: {record.outputCount}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-bold text-amber-300 font-mono">
                      ¥{record.cost.toFixed(4)}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-300">
                      {record.latencyMs} ms
                    </td>

                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                          record.status === '成功'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                        }`}
                      >
                        {record.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => setSelectedRecord(record)}
                        className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 rounded-lg text-xs font-medium transition flex items-center gap-1 ml-auto cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 二级页面: 调用日志详情 */}
      {selectedRecord ? (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回调用日志列表</span>
              </button>
              <div>
                <h3 className="font-bold text-sm text-slate-100">模型API调用明细日志档案</h3>
                <p className="text-xs text-slate-400">调用ID: {selectedRecord.id}</p>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                selectedRecord.status === '成功'
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
              }`}
            >
              {selectedRecord.status}
            </span>
          </div>

          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 bg-slate-950 rounded-xl border border-slate-800">
              <div><span className="text-slate-500 block">调用ID</span> <span className="font-mono font-semibold text-slate-200 mt-0.5 block">{selectedRecord.id}</span></div>
              <div><span className="text-slate-500 block">调用时间</span> <span className="text-slate-200 font-mono mt-0.5 block">{selectedRecord.callTime}</span></div>
              <div><span className="text-slate-500 block">调用用户</span> <span className="text-slate-200 font-bold mt-0.5 block">{selectedRecord.userName} ({selectedRecord.userId})</span></div>
              <div><span className="text-slate-500 block">请求模型</span> <span className="font-bold text-indigo-400 mt-0.5 block">{selectedRecord.modelName}</span></div>
              <div><span className="text-slate-500 block">命中计费规则</span> <span className="text-slate-200 mt-0.5 block">{selectedRecord.matchedBillingRule}</span></div>
              <div><span className="text-slate-500 block">计费结算金额</span> <span className="font-bold text-amber-300 font-mono text-sm mt-0.5 block">¥{selectedRecord.cost.toFixed(4)}</span></div>
            </div>

            {selectedRecord.status === '失败' && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/30 text-rose-400 rounded-xl space-y-1">
                <div className="font-bold flex items-center gap-1.5 text-xs">
                  <AlertTriangle className="w-4 h-4" />
                  失败原因诊断:
                </div>
                <div className="text-xs">{selectedRecord.failReason || '未知错误'}</div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">请求体摘要（Request Summary）</label>
                <pre className="p-4 bg-slate-950 text-slate-300 border border-slate-800 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap min-h-[140px]">
                  {selectedRecord.requestParamsSummary || '{}'}
                </pre>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1.5">响应结果摘要（Response Summary）</label>
                <pre className="p-4 bg-slate-950 text-emerald-400 border border-slate-800 rounded-xl font-mono text-[11px] overflow-x-auto whitespace-pre-wrap min-h-[140px]">
                  {selectedRecord.responseSummary || '无响应'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};


// ==========================================
// 3. 模型使用统计组件
// ==========================================
export const ModelStatsAdminView: React.FC = () => {
  const { models, modelUserConsumptions } = useApp();

  // 状态管理：时间范围、指标过滤、搜索与图表视图模式
  const [timeRange, setTimeRange] = useState<'7d' | '14d' | '30d'>('30d');
  const [metricView, setMetricView] = useState<'all' | 'calls' | 'revenue'>('all');
  const [userSearchTerm, setUserSearchTerm] = useState('');

  // 自定义 Recharts 悬浮提示 Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-950/95 border border-slate-700/80 p-3 rounded-xl shadow-2xl text-xs space-y-1.5 backdrop-blur-md z-50">
          <p className="font-bold text-slate-200 border-b border-slate-800/80 pb-1 flex items-center justify-between gap-4">
            <span>日期: {label}</span>
            <span className="text-[10px] text-slate-400 font-normal">SLA 正常</span>
          </p>
          {payload.map((entry: any, index: number) => (
            <div key={`item-${index}`} className="flex items-center justify-between gap-4">
              <span className="font-medium flex items-center gap-1.5 text-slate-300">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
                {entry.name}:
              </span>
              <span className="font-bold font-mono text-slate-100">
                {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
                {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // 根据选中的 timeRange 过滤并转换 30 天趋势数据
  const chartTrendData = useMemo(() => {
    const limit = timeRange === '7d' ? 7 : timeRange === '14d' ? 14 : 30;
    return mock30DaysModelTrend.slice(-limit).map((item, i) => {
      // 附加计算 token 消耗量（以 M 为单位）与平均响应时延/TPS
      const inputTokensM = Number(((item.calls * 0.008) + (i % 3) * 0.2).toFixed(2));
      const outputTokensM = Number(((item.calls * 0.004) + (i % 2) * 0.1).toFixed(2));
      const avgLatencyMs = Math.round(180 + Math.sin(i) * 35 + (item.revenue % 40));
      const tps = Math.round(85 + Math.cos(i) * 20 + (item.calls % 30));

      return {
        ...item,
        inputTokensM,
        outputTokensM,
        totalTokensM: Number((inputTokensM + outputTokensM).toFixed(2)),
        avgLatencyMs,
        tps
      };
    });
  }, [timeRange]);

  // 计算动态指标汇总
  const totalCallsCalc = useMemo(() => chartTrendData.reduce((acc, curr) => acc + curr.calls, 0), [chartTrendData]);
  const totalRevenueCalc = useMemo(() => chartTrendData.reduce((acc, curr) => acc + curr.revenue, 0), [chartTrendData]);
  const avgLatencyCalc = useMemo(() => Math.round(chartTrendData.reduce((acc, curr) => acc + curr.avgLatencyMs, 0) / chartTrendData.length), [chartTrendData]);

  // 过滤头部消费用户
  const filteredUserConsumptions = useMemo(() => {
    if (!userSearchTerm.trim()) return modelUserConsumptions;
    const term = userSearchTerm.toLowerCase();
    return modelUserConsumptions.filter(
      u => u.userName.toLowerCase().includes(term) || u.userId.toLowerCase().includes(term) || u.favoriteModel.toLowerCase().includes(term)
    );
  }, [modelUserConsumptions, userSearchTerm]);

  // 饼图颜色定义
  const MODALITY_COLORS = ['#6366f1', '#ec4899', '#38bdf8', '#f59e0b', '#10b981'];

  return (
    <div className="space-y-6">
      {/* 顶部工具栏：时间粒度与多维过滤 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/80 border border-slate-800 p-4 rounded-2xl shadow-sm">
        <div>
          <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            全站大模型使用统计与算力分析看板
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            实时监控全站 API 调用频次、Token 消耗、响应时延与算力收益
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* 指标维度控制 */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setMetricView('all')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                metricView === 'all' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              全部维度
            </button>
            <button
              type="button"
              onClick={() => setMetricView('calls')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                metricView === 'calls' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              仅调用频次
            </button>
            <button
              type="button"
              onClick={() => setMetricView('revenue')}
              className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                metricView === 'revenue' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              仅算力营收
            </button>
          </div>

          {/* 时间范围选择 */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['7d', '14d', '30d'] as const).map(range => (
              <button
                key={range}
                type="button"
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1 rounded-lg font-medium transition cursor-pointer ${
                  timeRange === range ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {range === '7d' ? '近 7 天' : range === '14d' ? '近 14 天' : '近 30 天'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 4 大核心指标牌 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">已上架大模型</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Cpu className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100">
            {models.filter(m => m.status === '已上架').length} <span className="text-xs text-slate-500 font-normal">款</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
            <CheckCircle className="w-3 h-3" />
            包含 1.0M 极长上下文旗舰模型
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">周期累计调用次数</span>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-slate-100 font-mono">
            {totalCallsCalc.toLocaleString()} <span className="text-xs text-slate-500 font-normal">次</span>
          </div>
          <div className="text-[10px] text-emerald-400 font-medium">↑ 18.5% 较上周期稳步增长</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">周期 API 算力营收</span>
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-400 font-mono">
            ¥{totalRevenueCalc.toLocaleString()}
          </div>
          <div className="text-[10px] text-indigo-300 font-medium">平均单次调用: ¥{(totalRevenueCalc / (totalCallsCalc || 1)).toFixed(3)}</div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-2 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition" />
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">平均响应延时 (SLA)</span>
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            {avgLatencyCalc} <span className="text-xs text-slate-500 font-normal">ms</span>
          </div>
          <div className="text-[10px] text-slate-500">网关高并发流式响应监控</div>
        </div>
      </div>

      {/* 主图表 1：调用量与营收变化趋势 AreaChart */}
      <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              模型 API 调用量与营收变化走势曲线
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              跨日期维度精准洞察多模态大模型的并发吞吐量与算力计费趋势
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" />
              <span className="text-slate-300">调用次数 (次)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block" />
              <span className="text-slate-300">算力营收 (元)</span>
            </div>
          </div>
        </div>

        <div className="w-full h-72 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorCallsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorRevenueGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
              <YAxis yAxisId="leftCalls" stroke="#818cf8" fontSize={11} tickLine={false} />
              <YAxis yAxisId="rightRev" orientation="right" stroke="#fbbf24" fontSize={11} tickLine={false} />
              <ReTooltip content={<CustomTooltip />} />
              {(metricView === 'all' || metricView === 'calls') && (
                <Area
                  yAxisId="leftCalls"
                  type="monotone"
                  dataKey="calls"
                  name="调用次数"
                  unit=" 次"
                  stroke="#6366f1"
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill="url(#colorCallsGrad)"
                />
              )}
              {(metricView === 'all' || metricView === 'revenue') && (
                <Area
                  yAxisId="rightRev"
                  type="monotone"
                  dataKey="revenue"
                  name="算力营收"
                  unit=" 元"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenueGrad)"
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 核心双栏：多模态调用占比 (PieChart) + 网关 SLA 与 TPS 走势 (LineChart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 多模态模型调用分布比 PieChart */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <PieChart className="w-4 h-4 text-indigo-400" />
              多模态模型类型调用占比
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">文本/图像/音频/视频/向量模型分布</p>
          </div>

          <div className="w-full h-52 relative flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={mockModalityDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {mockModalityDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || MODALITY_COLORS[index % MODALITY_COLORS.length]} />
                  ))}
                </Pie>
                <ReTooltip content={<CustomTooltip />} />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-black text-slate-100">100%</span>
              <span className="text-[10px] text-slate-400">模态总分布</span>
            </div>
          </div>

          <div className="space-y-2 pt-1 border-t border-slate-800/80 text-xs">
            {mockModalityDistribution.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <div className="font-mono font-semibold text-slate-200">
                  {item.value}% <span className="text-slate-500 font-normal">({item.calls})</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 网关延迟与 TPS 性能 LineChart */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-emerald-400" />
                网关平均响应延时与 TPS 吞吐走势
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">SLA 稳定性监控与高并发算力集群负载表现</p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="text-emerald-400 flex items-center gap-1">● 延时 (ms)</span>
              <span className="text-sky-400 flex items-center gap-1">● 吞吐 (TPS)</span>
            </div>
          </div>

          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartTrendData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis yAxisId="lat" stroke="#10b981" fontSize={11} tickLine={false} />
                <YAxis yAxisId="tps" orientation="right" stroke="#38bdf8" fontSize={11} tickLine={false} />
                <ReTooltip content={<CustomTooltip />} />
                <Line
                  yAxisId="lat"
                  type="monotone"
                  dataKey="avgLatencyMs"
                  name="平均响应延时"
                  unit=" ms"
                  stroke="#10b981"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
                <Line
                  yAxisId="tps"
                  type="monotone"
                  dataKey="tps"
                  name="TPS 吞吐"
                  unit=" Tokens/s"
                  stroke="#38bdf8"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 排行榜区域：Top 10 热门模型 BarChart + 高频消费用户表格 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 10 模型排行榜 BarChart */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-400" />
              模型调用量 TOP 10 榜单柱状图
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">全站最受欢迎的底层大模型调用对比</p>
          </div>

          <div className="w-full h-60 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockTop10ModelsRank} margin={{ top: 10, right: 10, left: -10, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <ReTooltip content={<CustomTooltip />} />
                <Bar dataKey="calls" name="调用次数" unit=" 次" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t border-slate-800/80 pt-3 max-h-56 overflow-y-auto custom-scrollbar">
            {mockTop10ModelsRank.map((m, idx) => (
              <div key={m.name} className="flex items-center justify-between p-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-xs">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      idx === 0
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        : idx === 1
                        ? 'bg-slate-700/40 text-slate-200 border border-slate-600/30'
                        : idx === 2
                        ? 'bg-amber-700/20 text-amber-400 border border-amber-700/30'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-200">{m.name}</span>
                </div>
                <div className="flex items-center gap-4 text-right font-mono">
                  <div>
                    <span className="text-slate-100 font-bold">{m.calls.toLocaleString()} 次</span>
                    <span className="text-[10px] text-amber-400 ml-3">¥{m.revenue}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 头部高频/高消费用户分析 */}
        <div className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-slate-100 text-sm flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-indigo-400" />
                头部高频/高消费用户透视
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">企业级账号与核心用户的算力消费全貌</p>
            </div>
            <div className="relative max-w-xs">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索用户或模型..."
                value={userSearchTerm}
                onChange={e => setUserSearchTerm(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto max-h-[420px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left text-xs">
              <thead className="sticky top-0 bg-slate-950/90 backdrop-blur-md border-b border-slate-800 text-slate-400 z-10">
                <tr>
                  <th className="py-2.5 px-3">用户信息</th>
                  <th className="py-2.5 px-3">累计调用</th>
                  <th className="py-2.5 px-3">总消费 (元)</th>
                  <th className="py-2.5 px-3">偏好模型</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredUserConsumptions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-12 text-center text-slate-500">
                      未找到相关高消费用户数据
                    </td>
                  </tr>
                ) : (
                  filteredUserConsumptions.map(u => (
                    <tr key={u.userId} className="hover:bg-slate-800/40 transition">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          {u.userAvatar ? (
                            <img src={u.userAvatar} alt={u.userName} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                          ) : (
                            <div className="w-7 h-7 rounded-full bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                              {u.userName.slice(0, 1)}
                            </div>
                          )}
                          <div>
                            <div className="font-bold text-slate-200">{u.userName}</div>
                            <div className="text-[10px] text-slate-500 font-mono">{u.userId}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200 font-mono">
                        {u.totalCalls.toLocaleString()} 次
                      </td>
                      <td className="py-3 px-3 font-bold text-amber-300 font-mono">
                        ¥{u.totalCost.toFixed(2)}
                      </td>
                      <td className="py-3 px-3 font-medium text-indigo-400">
                        {u.favoriteModel}
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
  );
};
