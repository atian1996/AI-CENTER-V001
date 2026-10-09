import React, { useState, useMemo } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../../context/AppContext';
import { ComputeImageAdminItem, ComputeImageCategory } from '../../../types';
import { UserImageAdminTab } from './UserImageAdminTab';
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
  Copy,
  Check,
  Eye,
  Terminal,
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
  FileCode,
  ShieldCheck,
  TrendingUp,
  Tag,
  ArrowLeft
} from 'lucide-react';

const CATEGORY_CONFIG: Record<ComputeImageCategory, { label: string; bg: string; text: string; border: string }> = {
  'PyTorch': {
    label: 'PyTorch',
    bg: 'bg-orange-500/10',
    text: 'text-orange-400',
    border: 'border-orange-500/20'
  },
  'TensorFlow': {
    label: 'TensorFlow',
    bg: 'bg-amber-500/10',
    text: 'text-amber-400',
    border: 'border-amber-500/20'
  },
  'Jupyter': {
    label: 'Jupyter',
    bg: 'bg-yellow-500/10',
    text: 'text-yellow-400',
    border: 'border-yellow-500/20'
  },
  'ComfyUI': {
    label: 'ComfyUI',
    bg: 'bg-purple-500/10',
    text: 'text-purple-400',
    border: 'border-purple-500/20'
  },
  'vLLM': {
    label: 'vLLM',
    bg: 'bg-indigo-500/10',
    text: 'text-indigo-400',
    border: 'border-indigo-500/20'
  },
  '大模型': {
    label: '大模型',
    bg: 'bg-cyan-500/10',
    text: 'text-cyan-400',
    border: 'border-cyan-500/20'
  },
  '其他': {
    label: '其他',
    bg: 'bg-slate-500/10',
    text: 'text-slate-400',
    border: 'border-slate-500/20'
  }
};

const ALL_CATEGORIES: ComputeImageCategory[] = [
  'PyTorch',
  'TensorFlow',
  'Jupyter',
  'ComfyUI',
  'vLLM',
  '大模型',
  '其他'
];

export const ComputeImageAdminView: React.FC = () => {
  const {
    computeImages,
    myCustomImages,
    addComputeImage,
    updateComputeImage,
    deleteComputeImage,
    toggleComputeImageStatus,
    computeRunningInstances,
    showToast
  } = useApp();

  // 顶层 TAB 页：'platform' (平台镜像) | 'user' (用户镜像)
  const [activeImageTab, setActiveImageTab] = useState<'platform' | 'user'>('platform');

  // 搜索与筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | '已启用' | '已停用'>('all');

  // 分页状态
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 弹窗状态
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentImage, setCurrentImage] = useState<ComputeImageAdminItem | null>(null);

  // 详情弹窗状态
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailImage, setDetailImage] = useState<ComputeImageAdminItem | null>(null);

  // 删除确认弹窗
  const [deleteConfirmImage, setDeleteConfirmImage] = useState<ComputeImageAdminItem | null>(null);

  // Markdown 编辑器 Tab (编辑 / 预览)
  const [mdEditorTab, setMdEditorTab] = useState<'edit' | 'preview'>('edit');

  // 复制反馈
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // 表单状态
  const [formData, setFormData] = useState<{
    name: string;
    registryUrl: string;
    category: ComputeImageCategory;
    description: string;
    size: string;
    version: string;
    changelog: string;
    status: '已启用' | '已停用';
  }>({
    name: '',
    registryUrl: '',
    category: 'PyTorch',
    description: '',
    size: '15.3 GB',
    version: 'v2.2.2',
    changelog: '',
    status: '已启用'
  });

  // 复制仓库地址
  const handleCopyUrl = (url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    showToast('镜像仓库地址已复制到剪贴板');
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // 全局使用统计概览
  const stats = useMemo(() => {
    const total = computeImages.length;
    const active = computeImages.filter(img => img.status === '已启用' || img.status === '上架').length;
    const inactive = computeImages.filter(img => img.status === '已停用' || img.status === '下架').length;
    const inUse = computeImages.filter(img => (img.refCount ?? 0) > 0).length;

    // 最热门镜像
    let mostPopular: { name: string; refCount: number } | null = null;
    if (computeImages.length > 0) {
      const sorted = [...computeImages].sort((a, b) => (b.refCount ?? 0) - (a.refCount ?? 0));
      if (sorted[0] && (sorted[0].refCount ?? 0) > 0) {
        mostPopular = {
          name: sorted[0].name,
          refCount: sorted[0].refCount ?? 0
        };
      }
    }

    return { total, active, inactive, inUse, mostPopular };
  }, [computeImages]);

  // 筛选列表
  const filteredImages = useMemo(() => {
    return computeImages
      .filter(img => {
        const matchSearch =
          img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (img.registryUrl || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (img.description || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (img.version || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
          (img.changelog || '').toLowerCase().includes(searchTerm.toLowerCase());

        const matchCategory = categoryFilter === 'all' || img.category === categoryFilter;
        
        let matchStatus = true;
        if (statusFilter === '已启用') {
          matchStatus = img.status === '已启用' || img.status === '上架';
        } else if (statusFilter === '已停用') {
          matchStatus = img.status === '已停用' || img.status === '下架';
        }

        return matchSearch && matchCategory && matchStatus;
      })
      .sort((a, b) => {
        // 创建时间倒序
        const timeA = new Date(a.createdAt || a.createTime || a.updatedAt || 0).getTime();
        const timeB = new Date(b.createdAt || b.createTime || b.updatedAt || 0).getTime();
        return timeB - timeA;
      });
  }, [computeImages, searchTerm, categoryFilter, statusFilter]);

  // 分页计算
  const totalPages = Math.max(1, Math.ceil(filteredImages.length / pageSize));
  const paginatedImages = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredImages.slice(start, start + pageSize);
  }, [filteredImages, currentPage, pageSize]);

  // 打开新增表单
  const handleOpenAdd = () => {
    setIsEditing(false);
    setCurrentImage(null);
    setFormData({
      name: '',
      registryUrl: '',
      category: 'PyTorch',
      description: '',
      size: '15.0 GB',
      version: 'v1.0.0',
      changelog: '初始版本发布，预装基础运行环境与加速库',
      status: '已启用'
    });
    setEditModalOpen(true);
  };

  // 打开编辑表单
  const handleOpenEdit = (img: ComputeImageAdminItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setIsEditing(true);
    setCurrentImage(img);
    setFormData({
      name: img.name,
      registryUrl: img.registryUrl || `docker.io/library/${img.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}:latest`,
      category: img.category || 'PyTorch',
      description: img.description || '',
      size: img.size || '15.0 GB',
      version: img.version || 'v1.0.0',
      changelog: img.changelog || '',
      status: (img.status === '已启用' || img.status === '上架') ? '已启用' : '已停用'
    });
    setEditModalOpen(true);
  };

  // 打开详情
  const handleOpenDetail = (img: ComputeImageAdminItem) => {
    setDetailImage(img);
    setDetailModalOpen(true);
  };

  // 提交保存
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      showToast('请输入镜像名称');
      return;
    }
    if (formData.name.length > 50) {
      showToast('镜像名称不能超过 50 个字符');
      return;
    }
    if (!formData.registryUrl.trim()) {
      showToast('请输入完整镜像仓库地址');
      return;
    }

    if (isEditing && currentImage) {
      updateComputeImage(currentImage.id, {
        name: formData.name.trim(),
        registryUrl: formData.registryUrl.trim(),
        category: formData.category,
        description: formData.description.trim(),
        size: formData.size.trim() || '15.0 GB',
        version: formData.version.trim() || 'v1.0.0',
        changelog: formData.changelog.trim(),
        status: formData.status
      });
    } else {
      addComputeImage({
        name: formData.name.trim(),
        registryUrl: formData.registryUrl.trim(),
        category: formData.category,
        description: formData.description.trim(),
        size: formData.size.trim() || '15.0 GB',
        version: formData.version.trim() || 'v1.0.0',
        changelog: formData.changelog.trim() || '首次创建镜像配置',
        status: formData.status,
        refCount: 0,
        createdAt: new Date().toLocaleString(),
        updatedAt: new Date().toLocaleString()
      });
    }
    setEditModalOpen(false);
  };

  // 确认删除
  const handleConfirmDelete = () => {
    if (deleteConfirmImage) {
      deleteComputeImage(deleteConfirmImage.id);
      setDeleteConfirmImage(null);
    }
  };

  // 关联运行中实例
  const getReferencedInstances = (img: ComputeImageAdminItem) => {
    return computeRunningInstances.filter(inst => {
      const matchImageName = (inst.imageName || '').toLowerCase() === img.name.toLowerCase();
      const matchId = (inst.imageId || '') === img.id;
      return matchImageName || matchId;
    });
  };

  // =========================================================================
  // 一、新增/编辑镜像 二级页面 (Early Return)
  // =========================================================================
  if (editModalOpen) {
    return (
      <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setEditModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回镜像列表</span>
              </button>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isEditing ? `编辑镜像: ${currentImage?.name}` : '新增镜像'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEditing ? `修改镜像【${currentImage?.name}】的基础信息与配置` : '配置并发布新的官方或应用市场 GPU 容器镜像'}
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

          <form onSubmit={handleSave} className="space-y-5 text-xs">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200">镜像名称 *</label>
                <input
                  type="text"
                  required
                  placeholder="例: PyTorch 2.2.2-cuda12.1-cudnn8-devel"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200">所属分类 *</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value as ComputeImageCategory })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  {ALL_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">Docker Registry 镜像仓库完整 URL *</label>
              <input
                type="text"
                required
                placeholder="例: registry.cn-hangzhou.aliyuncs.com/suanli-ai/pytorch:2.2.2-cuda12.1"
                value={formData.registryUrl}
                onChange={e => setFormData({ ...formData, registryUrl: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200">版本号</label>
                <input
                  type="text"
                  placeholder="例: v2.2.2"
                  value={formData.version}
                  onChange={e => setFormData({ ...formData, version: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200">解压镜像文件体积</label>
                <input
                  type="text"
                  placeholder="例: 15.3 GB"
                  value={formData.size}
                  onChange={e => setFormData({ ...formData, size: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-semibold text-slate-200">启用状态</label>
                <select
                  value={formData.status}
                  onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="已启用">已启用 (前台可见)</option>
                  <option value="已停用">已停用 (前台隐藏)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-semibold text-slate-200">镜像简介说明</label>
              <textarea
                rows={2}
                placeholder="简要描述镜像预装的 CUDA/cuDNN 及常用 Python 库..."
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-200">预装环境与 Changelog 说明 (支持 Markdown)</label>
                <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setMdEditorTab('edit')}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition ${
                      mdEditorTab === 'edit' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    编辑内容
                  </button>
                  <button
                    type="button"
                    onClick={() => setMdEditorTab('preview')}
                    className={`px-3 py-1 rounded-md text-[11px] font-semibold transition ${
                      mdEditorTab === 'preview' ? 'bg-slate-800 text-blue-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    实时预览
                  </button>
                </div>
              </div>

              {mdEditorTab === 'edit' ? (
                <textarea
                  rows={5}
                  placeholder="### 预装包清单:&#10;- torch 2.2.2&#10;- torchvision 0.17.2&#10;- flash-attn 2.5.6"
                  value={formData.changelog}
                  onChange={e => setFormData({ ...formData, changelog: e.target.value })}
                  className="w-full bg-slate-950/60 border border-slate-800 text-slate-200 text-xs rounded-xl p-3 focus:outline-none focus:border-blue-500 font-mono"
                />
              ) : (
                <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl min-h-[120px] text-xs text-slate-300">
                  {formData.changelog ? (
                    <div className="markdown-body">
                      <Markdown>{formData.changelog}</Markdown>
                    </div>
                  ) : (
                    <span className="text-slate-500 italic">暂无 Changelog 内容</span>
                  )}
                </div>
              )}
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
                {isEditing ? '保存修改' : '确认创建'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 二、镜像详情 二级页面 (Early Return)
  // =========================================================================
  if (detailModalOpen && detailImage) {
    return (
      <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回镜像列表</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">{detailImage.name}</h3>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                    CATEGORY_CONFIG[detailImage.category]?.bg || 'bg-slate-500/10'
                  } ${CATEGORY_CONFIG[detailImage.category]?.text || 'text-slate-400'} border ${
                    CATEGORY_CONFIG[detailImage.category]?.border || 'border-slate-500/20'
                  }`}>
                    {detailImage.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5 font-mono">{detailImage.registryUrl}</p>
              </div>
            </div>
            <button
              onClick={() => {
                setDetailModalOpen(false);
                handleOpenEdit(detailImage);
              }}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>编辑镜像</span>
            </button>
          </div>

          <div className="space-y-6 text-xs">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <div>
                <span className="text-[11px] text-slate-500 block">版本号</span>
                <span className="text-xs font-semibold text-slate-200 mt-0.5 block font-mono">
                  {detailImage.version || 'v1.0.0'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">镜像文件大小</span>
                <span className="text-xs font-semibold text-cyan-400 mt-0.5 block font-mono">
                  {detailImage.size || '10.0 GB'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">累计引用次数</span>
                <span className="text-xs font-bold text-indigo-400 mt-0.5 block font-mono">
                  {detailImage.refCount || 0} 次
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 block">启用状态</span>
                <span className="text-xs font-semibold mt-0.5 block">
                  {detailImage.status === '已启用' ? (
                    <span className="text-emerald-400">已启用 (前台可见)</span>
                  ) : (
                    <span className="text-slate-500">已停用 (前台隐藏)</span>
                  )}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-300">镜像仓库地址</h4>
              <div className="flex items-center gap-2 p-3 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-300 text-xs">
                <Terminal className="w-4 h-4 text-slate-500 shrink-0" />
                <span className="truncate flex-1">{detailImage.registryUrl}</span>
                <button
                  onClick={(e) => handleCopyUrl(detailImage.registryUrl, e)}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition text-[11px] flex items-center gap-1 shrink-0"
                >
                  {copiedUrl === detailImage.registryUrl ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedUrl === detailImage.registryUrl ? '已复制' : '复制'}</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-300">镜像简介与功能描述</h4>
              <p className="text-slate-300 bg-slate-950/60 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {detailImage.description || '暂无详细描述'}
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-300">预装框架与环境说明 (Changelog)</h4>
              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-slate-300 min-h-[100px]">
                {detailImage.changelog ? (
                  <div className="markdown-body">
                    <Markdown>{detailImage.changelog}</Markdown>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">暂无环境变更说明</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-300 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>使用该镜像运行中的实例 ({getReferencedInstances(detailImage).length})</span>
              </h4>
              {getReferencedInstances(detailImage).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {getReferencedInstances(detailImage).map(inst => (
                    <div key={inst.id} className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-200">{inst.instanceId || inst.id}</div>
                        <div className="text-[11px] text-slate-500 font-mono mt-0.5">{inst.gpuSpec || inst.specName}</div>
                      </div>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        运行中
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic p-3 bg-slate-950/40 rounded-xl border border-slate-800">
                  当前暂无正在运行的实例使用此镜像
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-mono">镜像 ID: {detailImage.id}</span>
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
      {/* 顶层 TAB 页切换：平台镜像 / 用户镜像 */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveImageTab('platform')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeImageTab === 'platform'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Box className="w-3.5 h-3.5" />
            <span>平台镜像</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeImageTab === 'platform' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {computeImages.length}
            </span>
          </button>

          <button
            onClick={() => setActiveImageTab('user')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
              activeImageTab === 'user'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>用户镜像</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
              activeImageTab === 'user' ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
            }`}>
              {myCustomImages.length}
            </span>
          </button>
        </div>

        <div className="text-xs text-slate-400 hidden sm:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>
            {activeImageTab === 'platform' 
              ? '当前视图：管理系统官方及平台预设的计算镜像' 
              : '当前视图：审计与维护用户创建的自定义镜像 (仅支持查看与违规删除)'}
          </span>
        </div>
      </div>

      {activeImageTab === 'user' ? (
        <UserImageAdminTab />
      ) : (
        <>
          {/* 搜索、筛选与操作工具栏 */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
          {/* 搜索框 */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索镜像名称、仓库地址、版本号或更新说明..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
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

          {/* 镜像分类下拉筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">镜像分类:</span>
            <select
              value={categoryFilter}
              onChange={e => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">全部分类</option>
              {ALL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* 状态下拉筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">状态:</span>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="已启用">已启用</option>
              <option value="已停用">已停用</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* 筛选结果统计与快捷重置 */}
          {(searchTerm || categoryFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter('all');
                setStatusFilter('all');
                setCurrentPage(1);
              }}
              className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
            >
              重置筛选条件
            </button>
          )}

          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 active:scale-98 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            新增镜像
          </button>
        </div>
      </div>

      {/* 镜像列表 Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-800/60 border-b border-slate-800 text-xs font-semibold text-slate-400">
                <th className="py-3.5 px-4 min-w-[220px]">镜像名称</th>
                <th className="py-3.5 px-4 min-w-[260px]">镜像地址</th>
                <th className="py-3.5 px-4">镜像分类</th>
                <th className="py-3.5 px-4">镜像大小</th>
                <th className="py-3.5 px-4">版本</th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-4 text-right min-w-[170px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-sm">
              {paginatedImages.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                      <div className="p-3 bg-slate-800 border border-slate-700 rounded-2xl text-slate-400 mb-3">
                        <Box className="w-8 h-8 opacity-60" />
                      </div>
                      <div className="text-sm font-semibold text-slate-200">
                        {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                          ? '未检索到匹配的镜像'
                          : '暂无镜像，点击右上角新增'}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 mb-4">
                        {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all'
                          ? '请尝试更换关键词或清除筛选过滤条件'
                          : '创建新的 GPU 容器镜像配置后，即可在实例创建中按需选择'}
                      </p>
                      {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' ? (
                        <button
                          onClick={() => {
                            setSearchTerm('');
                            setCategoryFilter('all');
                            setStatusFilter('all');
                          }}
                          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors"
                        >
                          清除筛选
                        </button>
                      ) : (
                        <button
                          onClick={handleOpenAdd}
                          className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white rounded-lg transition-colors"
                        >
                          立即新增镜像
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedImages.map(img => {
                  const isActive = img.status === '已启用' || img.status === '上架';
                  const catStyle = CATEGORY_CONFIG[img.category || '其他'] || CATEGORY_CONFIG['其他'];
                  const refCountVal = img.refCount ?? 0;
                  const isReferenced = refCountVal > 0;
                  const displayRegistryUrl = img.registryUrl || `docker.io/library/${img.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}:latest`;

                  return (
                    <tr
                      key={img.id}
                      onClick={() => handleOpenDetail(img)}
                      className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                    >
                      {/* 1. 镜像名称 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg shrink-0 group-hover:border-indigo-500/40 transition-colors">
                            <Box className="w-4 h-4" />
                          </div>
                          <div>
                            <div className="font-semibold text-slate-100 group-hover:text-indigo-300 transition-colors text-xs sm:text-sm">
                              {img.name}
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2">
                              <span>创建于: {img.createdAt || img.createTime || '2026-08-01'}</span>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. 镜像地址 */}
                      <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2 max-w-[280px]">
                          <span
                            className="font-mono text-xs text-slate-300 bg-slate-800/90 border border-slate-700/80 px-2 py-1 rounded truncate select-all"
                            title={displayRegistryUrl}
                          >
                            {displayRegistryUrl}
                          </span>
                          <button
                            onClick={e => handleCopyUrl(displayRegistryUrl, e)}
                            className="p-1 text-slate-400 hover:text-indigo-300 hover:bg-slate-800 rounded transition-colors shrink-0"
                            title="复制完整镜像地址"
                          >
                            {copiedUrl === displayRegistryUrl ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 3. 镜像分类 */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${catStyle.bg} ${catStyle.text} ${catStyle.border}`}>
                          {img.category || '其他'}
                        </span>
                      </td>

                      {/* 4. 镜像大小 */}
                      <td className="py-3.5 px-4">
                        <div className="inline-flex items-center gap-1.5 text-xs text-slate-300 font-mono">
                          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
                          <span>{img.size || '15.0 GB'}</span>
                        </div>
                      </td>

                      {/* 5. 版本 */}
                      <td className="py-3.5 px-4">
                        <span className="text-xs font-mono text-slate-200 px-2 py-0.5 bg-slate-800/90 border border-slate-700/80 rounded">
                          {img.version || 'v1.0.0'}
                        </span>
                      </td>

                      {/* 6. 状态 */}
                      <td className="py-3.5 px-4" onClick={e => e.stopPropagation()}>
                        {isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            已启用
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/20 text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            已停用
                          </span>
                        )}
                      </td>

                      {/* 8. 操作列 */}
                      <td className="py-3.5 px-4 text-right" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 编辑 */}
                          <button
                            onClick={e => handleOpenEdit(img, e)}
                            className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-md transition-colors cursor-pointer"
                          >
                            编辑
                          </button>

                          {/* 停用 / 启用 */}
                          <button
                            onClick={() => toggleComputeImageStatus(img.id, isActive ? '下架' : '上架')}
                            className={`px-2.5 py-1 text-xs rounded-md transition-colors border cursor-pointer ${
                              isActive
                                ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            {isActive ? '停用' : '启用'}
                          </button>

                          {/* 删除：被引用的镜像禁用 */}
                          <button
                            disabled={isReferenced}
                            onClick={() => setDeleteConfirmImage(img)}
                            title={isReferenced ? `该镜像正被 ${refCountVal} 台运行实例引用，不可删除` : '删除镜像配置'}
                            className={`p-1.5 rounded-md transition-colors border ${
                              isReferenced
                                ? 'bg-slate-800/40 border-slate-800 text-slate-600 cursor-not-allowed'
                                : 'bg-rose-500/10 hover:bg-rose-500/20 border-rose-500/20 text-rose-400 cursor-pointer'
                            }`}
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

        {/* 分页控件 */}
        {filteredImages.length > 0 && (
          <div className="p-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
            <div>
              共 <span className="text-slate-200 font-medium font-mono">{filteredImages.length}</span> 条镜像记录，当前展示第{' '}
              <span className="text-slate-200 font-medium font-mono">{(currentPage - 1) * pageSize + 1}</span> -{' '}
              <span className="text-slate-200 font-medium font-mono">{Math.min(currentPage * pageSize, filteredImages.length)}</span> 条
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-300 rounded-md transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-1 font-mono">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-7 h-7 rounded-md text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-700 text-slate-300 rounded-md transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 三、新增/编辑镜像二级页面 */}
      {/* ========================================================================= */}
      {editModalOpen && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setEditModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回镜像列表</span>
              </button>
              <div>
                <h3 className="text-base font-bold text-white">
                  {isEditing ? `编辑镜像: ${currentImage?.name}` : '新增镜像'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  {isEditing ? `修改镜像【${currentImage?.name}】的基础信息与配置` : '配置并发布新的官方或应用市场 GPU 容器镜像'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSave}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              {isEditing ? '保存修改' : '确认新增'}
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
              {/* 第一部分：基础信息 */}
              {/* 镜像精简配置字段 */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* 镜像名称 */}
                  <div className="space-y-1.5 md:col-span-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                        镜像名称 <span className="text-rose-400">*</span>
                      </label>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {formData.name.length}/50 字符
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={50}
                      required
                      placeholder="镜像识别名称，如“PyTorch 2.2.2 - CUDA 12.1”"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* 镜像地址 */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                      镜像仓库地址 (Registry URL) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="完整镜像仓库地址，如 docker.io/pytorch/pytorch:2.2.2-cuda12.1"
                        value={formData.registryUrl}
                        onChange={e => setFormData({ ...formData, registryUrl: e.target.value })}
                        className="w-full font-mono bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-indigo-300 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                      />
                    </div>
                  </div>

                  {/* 镜像分类 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                      镜像分类 <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value as ComputeImageCategory })}
                      className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3.5 py-2 focus:outline-none focus:border-indigo-500"
                    >
                      {ALL_CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* 镜像大小 */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-300">
                      镜像大小
                    </label>
                    <input
                      type="text"
                      placeholder="如 15.3 GB"
                      value={formData.size}
                      onChange={e => setFormData({ ...formData, size: e.target.value })}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                    />
                  </div>

                  {/* 状态 */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-medium text-slate-300 flex items-center gap-1">
                      状态 <span className="text-rose-400">*</span>
                    </label>
                    <div className="flex items-center gap-4 pt-1">
                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="imageStatus"
                          checked={formData.status === '已启用'}
                          onChange={() => setFormData({ ...formData, status: '已启用' })}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs text-emerald-400 font-medium">启用 (前端可选)</span>
                      </label>

                      <label className="inline-flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="imageStatus"
                          checked={formData.status === '已停用'}
                          onChange={() => setFormData({ ...formData, status: '已停用' })}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs text-slate-400 font-medium">停用 (不可选)</span>
                      </label>
                    </div>
                  </div>

                  {/* 镜像详情 (Markdown 编辑器) */}
                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <label className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
                        <FileCode className="w-4 h-4 text-indigo-400" />
                        <span>镜像详情 (支持 Markdown 语法)</span>
                      </label>

                      {/* 编辑 / 实时预览 切页按钮 */}
                      <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                        <button
                          type="button"
                          onClick={() => setMdEditorTab('edit')}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                            mdEditorTab === 'edit'
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          编辑源码
                        </button>
                        <button
                          type="button"
                          onClick={() => setMdEditorTab('preview')}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                            mdEditorTab === 'preview'
                              ? 'bg-indigo-600 text-white shadow-sm'
                              : 'text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          实时预览
                        </button>
                      </div>
                    </div>

                    {mdEditorTab === 'edit' ? (
                      <div className="space-y-1.5">
                        {/* 快捷工具栏 */}
                        <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-slate-950/80 border border-slate-800 rounded-t-lg text-[11px]">
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, description: prev.description + '\n### 标题名称\n' }))}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                          >
                            H3 标题
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, description: prev.description + ' **加粗文本** ' }))}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition font-bold cursor-pointer"
                          >
                            B 加粗
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, description: prev.description + '\n- 特性列表项1\n- 特性列表项2\n' }))}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition cursor-pointer"
                          >
                            • 列表
                          </button>
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, description: prev.description + '\n```bash\n# 运行命令\npython main.py\n```\n' }))}
                            className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition font-mono cursor-pointer"
                          >
                            &lt;/&gt; 代码块
                          </button>
                        </div>

                        <textarea
                          rows={6}
                          placeholder="可使用 Markdown 详细说明镜像预装软件、深度学习框架、Python 版本及快速运行命令..."
                          value={formData.description}
                          onChange={e => setFormData({ ...formData, description: e.target.value })}
                          className="w-full bg-slate-950/80 border border-slate-800 rounded-b-lg px-3.5 py-2.5 text-xs text-slate-200 font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-y min-h-[120px]"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-slate-950/90 border border-slate-800 rounded-lg min-h-[160px] max-h-[300px] overflow-y-auto text-xs text-slate-200 leading-relaxed">
                        {formData.description ? (
                          <div className="markdown-body prose prose-invert prose-xs max-w-none">
                            <Markdown>{formData.description}</Markdown>
                          </div>
                        ) : (
                          <span className="text-slate-500 italic">尚未填写镜像详情 Markdown 内容</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 表单底部操作 */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-indigo-500/20 transition-all cursor-pointer"
                >
                  {isEditing ? '保存修改' : '确认新增'}
                </button>
              </div>
            </form>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 四、镜像详情二级页面 (点击镜像名称进入) */}
      {/* ========================================================================= */}
      {detailModalOpen && detailImage && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回镜像列表</span>
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white">
                    {detailImage.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-300 px-2 py-0.5 bg-slate-800 border border-slate-700 rounded">
                    {detailImage.version || 'v1.0.0'}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  镜像详细配置参数与实时被引用实例列表
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                setDetailModalOpen(false);
                handleOpenEdit(detailImage);
              }}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer"
            >
              编辑镜像
            </button>
          </div>

          <div className="space-y-6">
              {/* 基本信息 & 状态信息卡片 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 基本信息 */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                    <Info className="w-3.5 h-3.5 text-indigo-400" />
                    基本信息
                  </h4>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="text-slate-400 block text-[11px]">完整仓库地址</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-slate-200 bg-slate-900 border border-slate-800 px-2 py-1 rounded text-[11px] truncate flex-1 select-all">
                          {detailImage.registryUrl || `docker.io/library/${detailImage.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}:latest`}
                        </span>
                        <button
                          onClick={() => handleCopyUrl(detailImage.registryUrl || '')}
                          className="p-1 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded transition-colors"
                          title="复制地址"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <div>
                        <span className="text-slate-400 block text-[11px]">镜像分类</span>
                        <span className="text-slate-200 font-medium mt-0.5 block">
                          {detailImage.category || '其他'}
                        </span>
                      </div>

                      <div>
                        <span className="text-slate-400 block text-[11px]">镜像大小</span>
                        <span className="text-slate-200 font-mono mt-0.5 block">
                          {detailImage.size || '15.3 GB'}
                        </span>
                      </div>
                    </div>

                    <div className="pt-1">
                      <span className="text-slate-400 block text-[11px] mb-1 font-semibold">镜像详情</span>
                      <div className="text-slate-300 text-xs leading-relaxed bg-slate-900/60 p-3 rounded-lg border border-slate-800 markdown-body prose prose-invert prose-xs max-w-none">
                        <Markdown>{detailImage.description || '暂无详细镜像说明'}</Markdown>
                      </div>
                    </div>

                    {detailImage.changelog && (
                      <div className="pt-1">
                        <span className="text-slate-400 block text-[11px]">更新说明</span>
                        <p className="text-indigo-300 text-xs mt-0.5 leading-relaxed bg-indigo-500/5 p-2.5 rounded-lg border border-indigo-500/10 font-mono">
                          {detailImage.changelog}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 状态与时间信息 */}
                <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-3 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 border-b border-slate-800 pb-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      状态与运维信息
                    </h4>

                    <div className="space-y-3 text-xs mt-3">
                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">当前可用状态</span>
                        {(detailImage.status === '已启用' || detailImage.status === '上架') ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                            <CheckCircle2 className="w-3 h-3" />
                            已启用 (创建实例可选)
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-500/10 border border-slate-500/20 text-slate-400">
                            <XCircle className="w-3 h-3" />
                            已停用 (不可选)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">当前被引用实例数</span>
                        <span className="text-cyan-400 font-bold font-mono">
                          {detailImage.refCount ?? 0} 台实例
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                        <span className="text-slate-400">创建时间</span>
                        <span className="text-slate-300 font-mono">
                          {detailImage.createdAt || detailImage.createTime || '2026-08-01 10:00:00'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between py-1">
                        <span className="text-slate-400">最后更新时间</span>
                        <span className="text-slate-300 font-mono">
                          {detailImage.updatedAt || detailImage.updateTime || '2026-08-18 10:30:00'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
                    <button
                      onClick={() => {
                        setDetailModalOpen(false);
                        handleOpenEdit(detailImage);
                      }}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors"
                    >
                      编辑此镜像
                    </button>
                    <button
                      onClick={() => {
                        const nextStatus = (detailImage.status === '已启用' || detailImage.status === '上架') ? '下架' : '上架';
                        toggleComputeImageStatus(detailImage.id, nextStatus);
                        setDetailImage(prev => prev ? {
                          ...prev,
                          status: nextStatus === '下架' ? '已停用' : '已启用'
                        } : null);
                      }}
                      className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                        (detailImage.status === '已启用' || detailImage.status === '上架')
                          ? 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/20 text-amber-400'
                          : 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/20 text-emerald-400'
                      }`}
                    >
                      {(detailImage.status === '已启用' || detailImage.status === '上架') ? '设为停用' : '立即启用'}
                    </button>
                  </div>
                </div>
              </div>

              {/* 引用实例列表 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                    <Server className="w-4 h-4 text-indigo-400" />
                    当前引用此镜像的运行中实例列表 ({getReferencedInstances(detailImage).length || detailImage.refCount || 0} 台)
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    实时监控在线容器实例
                  </span>
                </div>

                {getReferencedInstances(detailImage).length === 0 ? (
                  <div className="bg-slate-800/30 border border-dashed border-slate-800 rounded-xl p-8 text-center">
                    <Server className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                    <div className="text-xs font-medium text-slate-300">暂无运行中实例引用此镜像</div>
                    <p className="text-[11px] text-slate-500 mt-1">
                      当用户在前台或控制台选择该镜像拉起容器实例后，将在此实时呈现运行状态
                    </p>
                  </div>
                ) : (
                  <div className="border border-slate-800 rounded-xl overflow-hidden">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-800/60 border-b border-slate-800 text-slate-400 font-medium">
                          <th className="py-2.5 px-3.5">实例 ID</th>
                          <th className="py-2.5 px-3.5">用户</th>
                          <th className="py-2.5 px-3.5">GPU 规格</th>
                          <th className="py-2.5 px-3.5">运行时长</th>
                          <th className="py-2.5 px-3.5">GPU 负载 / 温度</th>
                          <th className="py-2.5 px-3.5">健康状态</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {getReferencedInstances(detailImage).map(inst => (
                          <tr key={inst.id} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-2.5 px-3.5 font-mono text-indigo-300 font-semibold">
                              {inst.id}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-200">
                              {inst.userName}
                            </td>
                            <td className="py-2.5 px-3.5 text-slate-300">
                              {inst.gpuSpec}
                            </td>
                            <td className="py-2.5 px-3.5 font-mono text-slate-400">
                              {inst.runningDuration || (inst.runningHours ? `${inst.runningHours}小时` : '2.5小时')}
                            </td>
                            <td className="py-2.5 px-3.5">
                              <div className="flex items-center gap-2 font-mono">
                                <span className={inst.gpuUtil > 80 ? 'text-amber-400 font-bold' : 'text-emerald-400'}>
                                  {inst.gpuUtil}%
                                </span>
                                <span className="text-slate-500">|</span>
                                <span className="text-slate-300 flex items-center gap-0.5">
                                  <Flame className="w-3 h-3 text-rose-400" />
                                  {inst.temp}°C
                                </span>
                              </div>
                            </td>
                            <td className="py-2.5 px-3.5">
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <CheckCircle2 className="w-2.5 h-2.5" />
                                {inst.health || '良好'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end pt-4 border-t border-slate-800">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                关闭
              </button>
            </div>
        </div>
      )}
      </>
      )}

      {/* 删除二次确认弹窗 */}
      {deleteConfirmImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl p-6">
            <div className="flex items-center gap-3 text-rose-400 mb-4">
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">确认删除此镜像？</h3>
                <p className="text-xs text-slate-400 mt-0.5">此操作将移除该镜像在平台的配置记录</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 leading-relaxed">
              确定要删除镜像 <span className="text-white font-semibold">【{deleteConfirmImage.name}】</span>（版本：{deleteConfirmImage.version || 'v1.0.0'}）吗？
            </p>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => setDeleteConfirmImage(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-lg shadow-sm shadow-rose-600/20 transition-colors cursor-pointer"
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
