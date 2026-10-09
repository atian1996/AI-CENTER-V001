import React, { useState, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';
import Markdown from 'react-markdown';
import { useApp } from '../../../context/AppContext';
import { DatasetItem, AdminMenuKey } from '../../../types';
import {
  Database,
  Tag,
  Activity,
  Search,
  Plus,
  Trash2,
  Edit2,
  Power,
  CheckCircle,
  CheckCircle2,
  XCircle,
  Eye,
  ArrowLeft,
  Upload,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  PlusCircle,
  ArrowUpDown,
  FileText,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Code,
  Quote,
  Link as LinkIcon,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Download,
  FolderArchive,
  Layers,
  BarChart3,
  Calendar,
  Clock,
  ArrowUp,
  ArrowDown,
  Info,
  CheckSquare,
  Square,
  FileSpreadsheet,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  HelpCircle
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface DatasetAdminViewsProps {
  activeSubMenu: AdminMenuKey;
}

export const DatasetAdminViews: React.FC<DatasetAdminViewsProps> = ({ activeSubMenu }) => {
  return (
    <div className="space-y-6">
      {activeSubMenu === 'dataset_list' && <DatasetListAdminView />}
      {activeSubMenu === 'dataset_audit' && <DatasetAuditAdminView />}
      {activeSubMenu === 'dataset_stats' && <DatasetStatsAdminView />}
    </div>
  );
};

// ============================================================================
// 4. 数据集审核视图 (DatasetAuditAdminView)
// ============================================================================

const DatasetAuditAdminView: React.FC = () => {
  const { datasets, updateDataset, showToast } = useApp();

  const [statusFilter, setStatusFilter] = useState<'全部' | '待审核' | '已通过' | '已驳回'>('待审核');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal / Detail State
  const [detailDataset, setDetailDataset] = useState<DatasetItem | null>(null);
  const [rejectModalDataset, setRejectModalDataset] = useState<DatasetItem | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filter list
  const filteredAuditList = useMemo(() => {
    return datasets.filter(ds => {
      const status = ds.status || '已上架';
      if (statusFilter !== '全部') {
        if (statusFilter === '待审核' && status !== '待审核') return false;
        if (statusFilter === '已通过' && status !== '已通过' && status !== '已上架' && status !== '已下架') return false;
        if (statusFilter === '已驳回' && status !== '已驳回') return false;
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = ds.name.toLowerCase().includes(q);
        const matchUploader = (ds.uploaderName || ds.author || '').toLowerCase().includes(q);
        if (!matchName && !matchUploader) return false;
      }
      return true;
    });
  }, [datasets, statusFilter, searchQuery]);

  const handleApprove = (ds: DatasetItem) => {
    updateDataset(ds.id, {
      status: '已通过' as any,
      auditReason: ''
    });
    showToast(`数据集【${ds.name}】已审核通过！用户现在可在【我的数据集】中进行上架。`);
    if (detailDataset?.id === ds.id) {
      setDetailDataset(null);
    }
  };

  const handleOpenRejectModal = (ds: DatasetItem) => {
    setRejectModalDataset(ds);
    setRejectReason(ds.auditReason || '');
  };

  const handleConfirmReject = () => {
    if (!rejectModalDataset) return;
    if (!rejectReason.trim()) {
      showToast('请输入驳回原因！');
      return;
    }
    updateDataset(rejectModalDataset.id, {
      status: '已驳回' as any,
      auditReason: rejectReason.trim()
    });
    showToast(`已驳回数据集【${rejectModalDataset.name}】的审核申请`);
    if (detailDataset?.id === rejectModalDataset.id) {
      setDetailDataset(null);
    }
    setRejectModalDataset(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            {(['待审核', '已通过', '已驳回', '全部'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative flex-1 md:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索数据集名称 / 上传者..."
              className="w-full bg-slate-950 border border-slate-800 text-white placeholder:text-slate-500 rounded-xl pl-8 pr-3 py-1.5 text-xs focus:border-indigo-500 outline-none transition"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          共找到 <span className="text-indigo-400 font-bold">{filteredAuditList.length}</span> 项数据集审核记录
        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 select-none">
              <tr>
                <th className="p-4 min-w-[220px]">数据集名称</th>
                <th className="p-4 min-w-[120px]">上传者</th>
                <th className="p-4 min-w-[120px]">模态</th>
                <th className="p-4 min-w-[100px]">文件大小</th>
                <th className="p-4 min-w-[140px]">上传时间</th>
                <th className="p-4 min-w-[100px]">状态</th>
                <th className="p-4 min-w-[180px] text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredAuditList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500">
                    <CheckCircle2 className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                    <div className="text-sm font-bold text-slate-400">暂无符合条件的审核记录</div>
                  </td>
                </tr>
              ) : (
                filteredAuditList.map(ds => {
                  const status = ds.status || '已上架';
                  const isPending = status === '待审核';
                  const isApproved = status === '已通过' || status === '已上架' || status === '已下架';
                  const isRejected = status === '已驳回';

                  return (
                    <tr key={ds.id} className="hover:bg-slate-800/40 transition">
                      {/* Name */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 text-indigo-400">
                            <Database className="w-4 h-4" />
                          </div>
                          <div className="min-w-0 space-y-0.5">
                            <div className="font-bold text-white truncate max-w-xs">{ds.name}</div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">{ds.brief || ds.description?.slice(0, 30)}</div>
                          </div>
                        </div>
                      </td>

                      {/* Uploader */}
                      <td className="p-4 text-slate-300">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-indigo-400 shrink-0">
                            {(ds.uploaderName || ds.author || '管')[0].toUpperCase()}
                          </div>
                          <span className="truncate max-w-[100px]">{ds.uploaderName || ds.author || '平台管理员'}</span>
                        </div>
                      </td>

                      {/* Modality */}
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-lg bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 font-bold text-[11px]">
                          {ds.modalities?.[0] || ds.modalityCategory || '表格数据'}
                        </span>
                      </td>

                      {/* Size */}
                      <td className="p-4 font-mono font-bold text-slate-200">
                        {ds.fileSize || ds.scale || '267.5 MB'}
                      </td>

                      {/* Time */}
                      <td className="p-4 font-mono text-slate-400 text-[11px]">
                        {ds.updatedAt || '2026-08-20 14:30'}
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {isPending && (
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" />
                            <span>待审核</span>
                          </span>
                        )}
                        {isApproved && (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>已通过</span>
                          </span>
                        )}
                        {isRejected && (
                          <span className="px-2.5 py-1 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 font-bold text-[11px] flex items-center gap-1 w-fit">
                            <XCircle className="w-3 h-3" />
                            <span>已驳回</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setDetailDataset(ds)}
                            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>查看详情</span>
                          </button>
                          {isPending && (
                            <>
                              <button
                                onClick={() => handleApprove(ds)}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>通过</span>
                              </button>
                              <button
                                onClick={() => handleOpenRejectModal(ds)}
                                className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>驳回</span>
                              </button>
                            </>
                          )}
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

      {/* Audit Detail Modal */}
      {detailDataset && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-3xl w-full p-6 space-y-6 shadow-2xl animate-fade-in my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white">{detailDataset.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5">审核详情与文件内容安全扫描控制台</p>
                </div>
              </div>
              <button
                onClick={() => setDetailDataset(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 基本信息 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">一、基本信息</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">上传者</span>
                  <div className="font-bold text-slate-200 truncate">{detailDataset.uploaderName || detailDataset.author || '平台管理员'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">模态</span>
                  <div className="font-bold text-slate-200 truncate">{detailDataset.modalities?.join(', ') || detailDataset.modalityCategory || '表格数据'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">文件大小</span>
                  <div className="font-bold text-slate-200 font-mono">{detailDataset.fileSize || detailDataset.scale || '267.5 MB'}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500">上传时间</span>
                  <div className="font-bold text-slate-200 font-mono">{detailDataset.updatedAt || '2026-08-20 14:30'}</div>
                </div>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs space-y-1">
                <span className="text-[10px] text-slate-500 font-bold">描述与简介</span>
                <p className="text-slate-300 leading-relaxed">{detailDataset.brief || detailDataset.description || '暂无详细描述信息'}</p>
              </div>
            </div>

            {/* 文件预览 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">二、文件预览与结构</h4>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                    <span>包含文件清单 (样例预览)</span>
                  </span>
                  <span className="font-mono text-[11px]">Format: {detailDataset.formats?.join('/') || 'CSV'}</span>
                </div>
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 font-mono text-[11px] text-slate-300 space-y-1.5 overflow-x-auto">
                  <div className="text-emerald-400 font-bold">✓ dataset_data_sample.csv (2,500 rows, 18 columns)</div>
                  <div className="text-slate-500 border-t border-slate-800 pt-1.5">
                    Header: [id, timestamp, feature_a, feature_b, category_label, score_weight...]
                  </div>
                  <div className="text-slate-400">
                    Row 1: 10001, 2026-08-20T10:00:00Z, 0.8421, "Normal", 1, 0.95
                  </div>
                  <div className="text-slate-400">
                    Row 2: 10002, 2026-08-20T10:01:00Z, 0.1205, "Standard", 0, 0.88
                  </div>
                </div>
              </div>
            </div>

            {/* 安全扫描结果 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">三、自动安全扫描结果</h4>
              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-start gap-3 text-xs">
                <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-emerald-300">安全扫描已通过</div>
                  <div className="text-emerald-400/80 leading-relaxed">
                    经过 ClamAV 杀毒引擎与 VirusTotal 自动化离线分析，未在数据包中检测出恶意可执行脚本、挂马程序、加密木马或高危敏感信息泄露风险。
                  </div>
                </div>
              </div>
            </div>

            {/* 审核结果/驳回原因展示 */}
            {detailDataset.status === '已驳回' && detailDataset.auditReason && (
              <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 space-y-1 text-xs">
                <div className="font-bold text-rose-400">驳回原因</div>
                <p className="text-rose-200">{detailDataset.auditReason}</p>
              </div>
            )}

            {/* Footer 操作按钮 */}
            <div className="flex items-center justify-end gap-3 border-t border-slate-800 pt-4">
              <button
                onClick={() => setDetailDataset(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                关闭
              </button>
              {(detailDataset.status || '已上架') === '待审核' && (
                <>
                  <button
                    onClick={() => handleOpenRejectModal(detailDataset)}
                    className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 text-rose-300 text-xs font-bold transition cursor-pointer"
                  >
                    驳回申请
                  </button>
                  <button
                    onClick={() => handleApprove(detailDataset)}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
                  >
                    通过审核
                  </button>
                </>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Reject Reason Modal */}
      {rejectModalDataset && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">驳回数据集审核</h3>
              <button
                onClick={() => setRejectModalDataset(null)}
                className="text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-400">
              请填写驳回【{rejectModalDataset.name}】的具体原因，该通知将同步反馈给上传用户：
            </p>

            <textarea
              rows={4}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="请输入清晰具体的驳回原因，如：缺少字段字典、文件格式无法读取、包含敏感隐秘信息等..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition resize-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setRejectModalDataset(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer shadow-md"
              >
                确认驳回
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ============================================================================
// 1. 数据集管理 - 列表及配置视图 (DatasetListAdminView)
// ============================================================================

const DatasetListAdminView: React.FC = () => {
  const { datasets, addDataset, updateDataset, deleteDataset, toggleDatasetStatus, datasetTagDimensions, showToast } = useApp();

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedModality, setSelectedModality] = useState('全部模态');
  const [selectedTaskType, setSelectedTaskType] = useState('全部任务');
  const [selectedDomain, setSelectedDomain] = useState('全部领域');
  const [selectedFormat, setSelectedFormat] = useState('全部格式');
  const [selectedStatus, setSelectedStatus] = useState<'全部' | '已上架' | '已下架' | '草稿'>('全部');
  const [sortBy, setSortBy] = useState<'updatedAt' | 'downloadCount'>('updatedAt');

  // Batch Select State
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<string[]>([]);

  // Modal State
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingDataset, setEditingDataset] = useState<DatasetItem | null>(null);

  // Preview Drawer/Modal State
  const [previewDataset, setPreviewDataset] = useState<DatasetItem | null>(null);

  // Delete Confirm Modal State
  const [deletingDataset, setDeletingDataset] = useState<DatasetItem | null>(null);

  // Filtered & Sorted Datasets
  const filteredDatasets = useMemo(() => {
    return datasets.filter(ds => {
      // Search keyword
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchName = ds.name.toLowerCase().includes(q);
        const matchBrief = ds.brief?.toLowerCase().includes(q);
        const matchDesc = ds.description?.toLowerCase().includes(q);
        const matchAuthor = ds.author?.toLowerCase().includes(q);
        if (!matchName && !matchBrief && !matchDesc && !matchAuthor) return false;
      }

      // Modality filter
      if (selectedModality !== '全部模态') {
        const hasMod = ds.modalities?.includes(selectedModality) || ds.modalityCategory === selectedModality || (selectedModality === '表格数据' && ds.modalityCategory === '表格');
        if (!hasMod) return false;
      }

      // Task type filter
      if (selectedTaskType !== '全部任务') {
        const hasTask = ds.taskTypes?.includes(selectedTaskType) || ds.taskType === selectedTaskType;
        if (!hasTask) return false;
      }

      // Domain filter
      if (selectedDomain !== '全部领域') {
        const hasDomain = ds.domains?.includes(selectedDomain) || ds.domainTags?.includes(selectedDomain) || ds.theme === selectedDomain;
        if (!hasDomain) return false;
      }

      // Format filter
      if (selectedFormat !== '全部格式') {
        const hasFmt = ds.formats?.includes(selectedFormat) || ds.fileFormats?.toLowerCase().includes(selectedFormat.toLowerCase());
        if (!hasFmt) return false;
      }

      // Status filter
      if (selectedStatus !== '全部') {
        if ((ds.status || '已上架') !== selectedStatus) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'downloadCount') return (b.downloadCount || 0) - (a.downloadCount || 0);
      return (b.updatedAt || '').localeCompare(a.updatedAt || '');
    });
  }, [datasets, searchTerm, selectedModality, selectedTaskType, selectedDomain, selectedFormat, selectedStatus, sortBy]);

  const handleOpenCreateModal = () => {
    setEditingDataset(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (ds: DatasetItem) => {
    setEditingDataset(ds);
    setIsFormModalOpen(true);
  };

  const handleToggleSelectAll = () => {
    if (selectedDatasetIds.length === filteredDatasets.length) {
      setSelectedDatasetIds([]);
    } else {
      setSelectedDatasetIds(filteredDatasets.map(d => d.id));
    }
  };

  const handleToggleSelect = (id: string) => {
    if (selectedDatasetIds.includes(id)) {
      setSelectedDatasetIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedDatasetIds(prev => [...prev, id]);
    }
  };

  const handleBatchStatus = (status: '已上架' | '已下架') => {
    if (selectedDatasetIds.length === 0) return;
    selectedDatasetIds.forEach(id => toggleDatasetStatus(id, status));
    showToast(`已批量将 ${selectedDatasetIds.length} 个数据集状态更新为【${status}】`);
    setSelectedDatasetIds([]);
  };

  const handleBatchDelete = () => {
    if (selectedDatasetIds.length === 0) return;
    if (window.confirm(`确定要批量删除选中的 ${selectedDatasetIds.length} 个数据集吗？此操作不可逆！`)) {
      selectedDatasetIds.forEach(id => deleteDataset(id));
      setSelectedDatasetIds([]);
    }
  };

  if (isFormModalOpen) {
    return (
      <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
        <DatasetFormModal
          isOpen={isFormModalOpen}
          dataset={editingDataset}
          onClose={() => setIsFormModalOpen(false)}
          onSave={(data) => {
            if (editingDataset) {
              updateDataset(editingDataset.id, data);
            } else {
              addDataset(data);
            }
            setIsFormModalOpen(false);
          }}
          tagDimensions={datasetTagDimensions}
        />
      </div>
    );
  }

  if (previewDataset) {
    return (
      <div className="space-y-6 text-slate-100 animate-in fade-in duration-200">
        <DatasetPreviewModal
          dataset={previewDataset}
          onClose={() => setPreviewDataset(null)}
          onEdit={() => {
            setEditingDataset(previewDataset);
            setPreviewDataset(null);
            setIsFormModalOpen(true);
          }}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Action Bar & Filter Ribbon */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="搜索数据集名称、简介、作者、标签..."
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

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            {selectedDatasetIds.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-indigo-950/60 border border-indigo-500/30 text-xs font-bold text-indigo-300">
                <span>已选中 {selectedDatasetIds.length} 项</span>
                <div className="h-3 w-px bg-indigo-500/30 mx-1" />
                <button
                  onClick={() => handleBatchStatus('已上架')}
                  className="hover:text-emerald-400 text-xs transition cursor-pointer"
                >
                  批量上架
                </button>
                <button
                  onClick={() => handleBatchStatus('已下架')}
                  className="hover:text-amber-400 text-xs transition cursor-pointer"
                >
                  批量下架
                </button>
                <button
                  onClick={handleBatchDelete}
                  className="hover:text-rose-400 text-xs transition cursor-pointer"
                >
                  批量删除
                </button>
              </div>
            )}

            <button
              id="admin-create-dataset-btn"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/30 flex items-center gap-2 cursor-pointer transition transform active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>创建数据集</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdown Bar */}
        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800/80">
          {/* Modality Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>模态:</span>
            <select
              value={selectedModality}
              onChange={(e) => setSelectedModality(e.target.value)}
              className="bg-slate-950/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="全部模态">全部模态</option>
              {datasetTagDimensions.modality.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Task Type Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>任务类型:</span>
            <select
              value={selectedTaskType}
              onChange={(e) => setSelectedTaskType(e.target.value)}
              className="bg-slate-950/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="全部任务">全部任务</option>
              {datasetTagDimensions.taskType.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          {/* Domain Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>行业领域:</span>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="bg-slate-950/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="全部领域">全部领域</option>
              {datasetTagDimensions.domain.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Format Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>文件格式:</span>
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-slate-950/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="全部格式">全部格式</option>
              {datasetTagDimensions.format.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <span>状态:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="bg-slate-950/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="全部">全部状态</option>
              <option value="已上架">已上架</option>
              <option value="已下架">已下架</option>
              <option value="草稿">草稿</option>
            </select>
          </div>

          {/* Sorter */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium ml-auto">
            <span>排序:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950/90 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="updatedAt">更新时间 (最新)</option>
              <option value="downloadCount">累计下载量 (最多)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Dataset Table Card */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950/80 text-slate-400 font-bold border-b border-slate-800 select-none">
              <tr>
                <th className="p-4 w-10 text-center">
                  <button
                    onClick={handleToggleSelectAll}
                    className="text-slate-400 hover:text-white"
                  >
                    {selectedDatasetIds.length > 0 && selectedDatasetIds.length === filteredDatasets.length ? (
                      <CheckSquare className="w-4 h-4 text-indigo-400" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="p-4 min-w-[240px]">数据集名称</th>
                <th className="p-4 min-w-[120px]">上传者</th>
                <th className="p-4 min-w-[120px]">模态</th>
                <th className="p-4 min-w-[130px]">任务类型</th>
                <th className="p-4 min-w-[130px]">行业领域</th>
                <th className="p-4 min-w-[110px]">文件格式</th>
                <th className="p-4 min-w-[100px]">数据集大小</th>
                <th className="p-4 min-w-[90px]">下载量</th>
                <th className="p-4 min-w-[90px]">状态</th>
                <th className="p-4 min-w-[170px] text-right">操作</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filteredDatasets.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-16 text-center text-slate-500">
                    <Database className="w-10 h-10 mx-auto text-slate-600 mb-3" />
                    <div className="text-sm font-bold text-slate-400">未找到符合条件的数据集</div>
                    <div className="text-xs text-slate-500 mt-1">请尝试调整搜索条件或点击上方按钮创建数据集</div>
                  </td>
                </tr>
              ) : (
                filteredDatasets.map(ds => {
                  const isSelected = selectedDatasetIds.includes(ds.id);
                  const curStatus = ds.status || '已上架';

                  return (
                    <tr
                      key={ds.id}
                      className={`hover:bg-slate-800/40 transition group ${isSelected ? 'bg-indigo-950/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="p-4 text-center">
                        <button
                          onClick={() => handleToggleSelect(ds.id)}
                          className="text-slate-500 hover:text-white"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-indigo-400" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Dataset Name & Brief */}
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-900/60 to-slate-800 border border-slate-700/80 flex items-center justify-center shrink-0 mt-0.5">
                            <Database className="w-4 h-4 text-indigo-400" />
                          </div>
                          <div className="space-y-0.5 min-w-0">
                            <div className="font-bold text-slate-100 hover:text-indigo-400 transition cursor-pointer flex items-center gap-1.5">
                              <span onClick={() => setPreviewDataset(ds)} className="truncate max-w-xs">{ds.name}</span>
                            </div>
                            <div className="text-[11px] text-slate-400 line-clamp-1">
                              {ds.brief || ds.description?.slice(0, 40) || '暂无一句话简介'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Uploader */}
                      <td className="p-4 text-slate-300 font-medium">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-[10px] font-mono font-bold text-indigo-400 shrink-0">
                            {(ds.uploaderName || ds.author || '管')[0].toUpperCase()}
                          </div>
                          <span className="truncate max-w-[100px] text-xs" title={ds.uploaderName || ds.author || '平台管理员'}>
                            {ds.uploaderName || ds.author || '平台管理员'}
                          </span>
                        </div>
                      </td>

                      {/* Modality */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(ds.modalities && ds.modalities.length > 0 ? ds.modalities : [ds.modalityCategory === '表格' ? '表格数据' : (ds.modalityCategory || '表格数据')]).map((m, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/30"
                            >
                              {m}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Task Type */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(ds.taskTypes && ds.taskTypes.length > 0 ? ds.taskTypes : [ds.taskType || '分类任务']).map((t, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700/80"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Domain */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(ds.domains && ds.domains.length > 0 ? ds.domains : (ds.domainTags && ds.domainTags.length > 0 ? ds.domainTags : [ds.theme || '商业/管理'])).slice(0, 2).map((d, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/20"
                            >
                              {d}
                            </span>
                          ))}
                          {(ds.domains?.length || 0) > 2 && (
                            <span className="text-[10px] text-slate-500">+{ds.domains!.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* File Format */}
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {(ds.formats && ds.formats.length > 0 ? ds.formats : [ds.fileFormats || 'CSV/XLSX']).map((f, i) => (
                            <span
                              key={i}
                              className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800/80 text-slate-300 border border-slate-700/60"
                            >
                              {f}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* Dataset Size */}
                      <td className="p-4">
                        <span className="font-mono font-bold text-slate-200">
                          {ds.fileSize || ds.scale || '10.5 MB'}
                        </span>
                      </td>

                      {/* Downloads */}
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <div className="font-mono font-bold text-slate-100 flex items-center gap-1">
                            <Download className="w-3 h-3 text-slate-400" />
                            <span>{ds.downloadCount || 0}</span>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {ds.viewsCount || 0} 浏览
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        {curStatus === '已上架' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            已上架
                          </span>
                        )}
                        {curStatus === '已下架' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                            已下架
                          </span>
                        )}
                        {curStatus === '草稿' && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 border border-slate-700 text-[10px] font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            草稿
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Quick Preview */}
                          <button
                            onClick={() => setPreviewDataset(ds)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                            title="查看详情"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* Edit Button */}
                          <button
                            id={`edit-dataset-${ds.id}`}
                            onClick={() => handleOpenEditModal(ds)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/30 text-indigo-300 text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                          >
                            <Edit2 className="w-3 h-3" />
                            <span>编辑</span>
                          </button>

                          {/* Toggle Publish/Unpublish */}
                          {curStatus === '已上架' ? (
                            <button
                              onClick={() => toggleDatasetStatus(ds.id, '已下架')}
                              className="px-2 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/30 border border-amber-500/30 text-amber-400 text-xs font-bold transition cursor-pointer"
                              title="下架数据集"
                            >
                              下架
                            </button>
                          ) : (
                            <button
                              onClick={() => toggleDatasetStatus(ds.id, '已上架')}
                              className="px-2 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition cursor-pointer"
                              title="上架数据集"
                            >
                              上架
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => setDeletingDataset(ds)}
                            className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                            title="删除数据集"
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

        {/* Table Footer Pagination / Summary */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div>
            共 <span className="font-bold text-slate-200">{filteredDatasets.length}</span> 个数据集
          </div>
          <div className="flex items-center gap-2">
            <span>第 1 页 / 共 1 页</span>
          </div>
        </div>
      </div>

      {/* Dataset Create / Edit Modal */}
      {isFormModalOpen && (
        <DatasetFormModal
          isOpen={isFormModalOpen}
          dataset={editingDataset}
          onClose={() => setIsFormModalOpen(false)}
          onSave={(data) => {
            if (editingDataset) {
              updateDataset(editingDataset.id, data);
            } else {
              addDataset(data);
            }
            setIsFormModalOpen(false);
          }}
          tagDimensions={datasetTagDimensions}
        />
      )}

      {/* Preview Modal */}
      {previewDataset && (
        <DatasetPreviewModal
          dataset={previewDataset}
          onClose={() => setPreviewDataset(null)}
          onEdit={() => {
            setEditingDataset(previewDataset);
            setPreviewDataset(null);
            setIsFormModalOpen(true);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingDataset && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-fade-in">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">确认删除数据集？</h3>
                <p className="text-xs text-slate-400">此操作将永久移除该数据集所有元数据与文件</p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              数据集名称：<span className="font-bold text-white">{deletingDataset.name}</span>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingDataset(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={() => {
                  deleteDataset(deletingDataset.id);
                  setDeletingDataset(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ============================================================================
// 创建/编辑数据集表单弹窗 (DatasetFormModal)
// ============================================================================

interface DatasetFormModalProps {
  isOpen: boolean;
  dataset: DatasetItem | null;
  onClose: () => void;
  onSave: (data: Partial<DatasetItem>) => void;
  tagDimensions: {
    modality: string[];
    taskType: string[];
    domain: string[];
    format: string[];
  };
}

const DatasetFormModal: React.FC<DatasetFormModalProps> = ({
  isOpen,
  dataset,
  onClose,
  onSave,
  tagDimensions
}) => {
  const isEditing = !!dataset;

  // Form Fields
  const [name, setName] = useState(dataset?.name || '');
  const [brief, setBrief] = useState(dataset?.brief || dataset?.description?.slice(0, 50) || '');
  const [modalities, setModalities] = useState<string[]>(
    dataset?.modalities || (dataset?.modalityCategory ? [dataset.modalityCategory === '表格' ? '表格数据' : dataset.modalityCategory] : ['表格数据'])
  );
  const [taskTypes, setTaskTypes] = useState<string[]>(
    dataset?.taskTypes || (dataset?.taskType ? [dataset.taskType] : ['分类任务'])
  );
  const [domains, setDomains] = useState<string[]>(
    dataset?.domains || (dataset?.domainTags && dataset.domainTags.length > 0 ? dataset.domainTags : ['商业/管理'])
  );
  const [formats, setFormats] = useState<string[]>(
    dataset?.formats || (dataset?.fileFormats ? [dataset.fileFormats.includes('csv') ? 'CSV/XLSX' : 'JSON/JSONL'] : ['CSV/XLSX'])
  );
  const [description, setDescription] = useState(
    dataset?.description || `## 数据集概述\n\n本数据集包含完整的业务与特征字段，可直接用于多任务机器学习与深度学习模型训练。\n\n### 字段说明\n- \`ID\`: 样本唯一序列标识\n- \`Feature_A\`: 关键特征变量 1\n- \`Feature_B\`: 关键特征变量 2\n- \`Label\`: 目标分类或回归标签\n\n### 数据来源与脱敏\n数据经过规范化清洗脱敏，无隐私合规风险。`
  );
  const [fileName, setFileName] = useState(dataset?.files?.[0]?.name || (dataset?.name ? `${dataset.name}.zip` : 'retail_dataset_master.zip'));
  const [fileSize, setFileSize] = useState(dataset?.fileSize || dataset?.scale || '10.5 GB');
  const [isUploaded, setIsUploaded] = useState(true);
  const [status, setStatus] = useState<'已上架' | '已下架' | '待审核' | '已通过' | '已驳回' | '草稿'>(dataset?.status || '已上架');

  // Markdown Editor Tab (edit / preview / split)
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');

  // File Upload Drag & Drop simulation
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Errors
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      setIsUploaded(true);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      setIsUploaded(true);
    }
  };

  // Toggle multi-select tags
  const toggleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      if (list.length === 1) return; // keep at least 1
      setList(list.filter(i => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  // Markdown formatting helpers
  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById('dataset-md-textarea') as HTMLTextAreaElement;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end) || '示例文本';
    const newText = textarea.value.substring(0, start) + prefix + selectedText + suffix + textarea.value.substring(end);
    setDescription(newText);
  };

  // Form Validation & Submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = '请输入数据集名称';
    } else if (name.trim().length > 30) {
      newErrors.name = '数据集名称不能超过30字';
    }

    if (!brief.trim()) {
      newErrors.brief = '请输入一句话简介';
    } else if (brief.trim().length > 50) {
      newErrors.brief = '一句话简介不能超过50字';
    }

    if (modalities.length === 0) newErrors.modalities = '请至少选择一种模态';
    if (taskTypes.length === 0) newErrors.taskTypes = '请至少选择一种任务类型';
    if (domains.length === 0) newErrors.domains = '请至少选择一个行业领域';
    if (formats.length === 0) newErrors.formats = '请至少选择一种文件格式';
    if (!description.trim()) newErrors.description = '请输入数据描述';
    if (!isUploaded || !fileName) newErrors.file = '请上传数据集文件';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onSave({
      name: name.trim(),
      brief: brief.trim(),
      modalities,
      taskTypes,
      domains,
      formats,
      description: description.trim(),
      fileSize,
      fileFormats: formats.join(', '),
      status,
      modalityCategory: (modalities[0] === '表格数据' ? '表格' : modalities[0] as any) || '表格',
      taskType: taskTypes[0] || '分类任务',
      theme: domains[0] || '商业/管理',
      domainTags: domains
    });
  };

  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回数据集列表</span>
          </button>
          <div>
            <h2 className="text-base font-black text-white">
              {isEditing ? `编辑数据集: ${dataset.name}` : '创建新数据集'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              完整配置数据集元数据、多维标签、详细数据字典与文件资源包
            </p>
          </div>
        </div>
      </div>

      {/* Form Body */}
      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          
          {/* 1. 数据集名称 (必填, 限30字) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200 flex items-center gap-1">
                <span>数据集名称</span>
                <span className="text-rose-400 font-black">*</span>
              </label>
              <span className={`font-mono text-[11px] ${name.length > 30 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                {name.length}/30 字
              </span>
            </div>
            <input
              type="text"
              value={name}
              maxLength={35}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：PowerBI零售数据分析实战配套数据集"
              className={`w-full bg-slate-950 border ${errors.name ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition`}
            />
            {errors.name && <p className="text-rose-400 text-[11px]">{errors.name}</p>}
          </div>

          {/* 2. 一句话简介 (必填, 限50字) */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200 flex items-center gap-1">
                <span>一句话简介</span>
                <span className="text-rose-400 font-black">*</span>
              </label>
              <span className={`font-mono text-[11px] ${brief.length > 50 ? 'text-rose-400 font-bold' : 'text-slate-500'}`}>
                {brief.length}/50 字
              </span>
            </div>
            <input
              type="text"
              value={brief}
              maxLength={55}
              onChange={(e) => setBrief(e.target.value)}
              placeholder="简明扼要概括数据集的核心内容、特征和应用场景（展示在卡片首页）"
              className={`w-full bg-slate-950 border ${errors.brief ? 'border-rose-500' : 'border-slate-700'} rounded-xl px-3.5 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 transition`}
            />
            {errors.brief && <p className="text-rose-400 text-[11px]">{errors.brief}</p>}
          </div>

          {/* 3. 模态 (多选下拉 / Tag Selector, 必填) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-1">
              <span>模态 (可多选)</span>
              <span className="text-rose-400 font-black">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {tagDimensions.modality.map(m => {
                const isSelected = modalities.includes(m);
                return (
                  <button
                    type="button"
                    key={m}
                    onClick={() => toggleSelection(modalities, setModalities, m)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white border border-indigo-500 shadow-xs'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{m}</span>
                  </button>
                );
              })}
            </div>
            {errors.modalities && <p className="text-rose-400 text-[11px]">{errors.modalities}</p>}
          </div>

          {/* 4. 任务类型 (多选下拉 / Tag Selector, 必填) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-1">
              <span>任务类型 (可多选)</span>
              <span className="text-rose-400 font-black">*</span>
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              {tagDimensions.taskType.map(t => {
                const isSelected = taskTypes.includes(t);
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => toggleSelection(taskTypes, setTaskTypes, t)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-indigo-400" />}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
            {errors.taskTypes && <p className="text-rose-400 text-[11px]">{errors.taskTypes}</p>}
          </div>

          {/* 5. 行业领域 (多选下拉 / Tag Selector, 必填) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-1">
              <span>行业领域 (可多选)</span>
              <span className="text-rose-400 font-black">*</span>
            </label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 rounded-xl bg-slate-950/60 border border-slate-800">
              {tagDimensions.domain.map(d => {
                const isSelected = domains.includes(d);
                return (
                  <button
                    type="button"
                    key={d}
                    onClick={() => toggleSelection(domains, setDomains, d)}
                    className={`px-2.5 py-1 rounded-lg font-medium transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-cyan-400" />}
                    <span>{d}</span>
                  </button>
                );
              })}
            </div>
            {errors.domains && <p className="text-rose-400 text-[11px]">{errors.domains}</p>}
          </div>

          {/* 6. 文件格式 (多选下拉 / Tag Selector, 必填) */}
          <div className="space-y-2">
            <label className="font-bold text-slate-200 flex items-center gap-1">
              <span>文件格式 (可多选)</span>
              <span className="text-rose-400 font-black">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {tagDimensions.format.map(f => {
                const isSelected = formats.includes(f);
                return (
                  <button
                    type="button"
                    key={f}
                    onClick={() => toggleSelection(formats, setFormats, f)}
                    className={`px-2.5 py-1 rounded-lg font-mono font-bold transition flex items-center gap-1 cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                    <span>{f}</span>
                  </button>
                );
              })}
            </div>
            {errors.formats && <p className="text-rose-400 text-[11px]">{errors.formats}</p>}
          </div>

          {/* 7. 数据描述 (Markdown 编辑器, 必填) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-bold text-slate-200 flex items-center gap-1">
                <span>数据描述 (Markdown 格式)</span>
                <span className="text-rose-400 font-black">*</span>
              </label>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                <button
                  type="button"
                  onClick={() => setEditorMode('edit')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${editorMode === 'edit' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  编辑源码
                </button>
                <button
                  type="button"
                  onClick={() => setEditorMode('preview')}
                  className={`px-2.5 py-1 rounded-lg font-bold transition cursor-pointer ${editorMode === 'preview' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                  效果预览
                </button>
              </div>
            </div>

            {/* Markdown Toolbar */}
            {editorMode === 'edit' && (
              <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-950 rounded-t-xl border-t border-x border-slate-700/80 text-slate-400">
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('**', '**')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                  title="加粗"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('*', '*')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                  title="斜体"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('### ')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                  title="标题"
                >
                  <Heading className="w-3.5 h-3.5" />
                </button>
                <div className="h-3 w-px bg-slate-800 mx-1" />
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('- ')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                  title="无序列表"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('1. ')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                  title="有序列表"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('`', '`')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                  title="代码"
                >
                  <Code className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('> ')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                  title="引用"
                >
                  <Quote className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdownSyntax('[链接文字](', ')')}
                  className="p-1.5 rounded hover:bg-slate-800 hover:text-white cursor-pointer"
                  title="链接"
                >
                  <LinkIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {editorMode === 'edit' ? (
              <textarea
                id="dataset-md-textarea"
                rows={7}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="详细说明数据内容、来源、字段含义、数据分布、脱敏规则等..."
                className={`w-full bg-slate-950 border ${errors.description ? 'border-rose-500' : 'border-slate-700/80'} rounded-b-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 transition leading-relaxed`}
              />
            ) : (
              <div className="p-4 bg-slate-950 border border-slate-700/80 rounded-xl min-h-[180px] max-h-72 overflow-y-auto text-slate-200 prose prose-invert prose-xs max-w-none">
                <Markdown>{description || '*暂无数据描述内容*'}</Markdown>
              </div>
            )}
            {errors.description && <p className="text-rose-400 text-[11px]">{errors.description}</p>}
          </div>

          {/* 8 & 9. 数据集文件上传与大小自动识别 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-800">
            {/* File Upload Box */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-200 flex items-center gap-1">
                <span>数据集文件上传</span>
                <span className="text-rose-400 font-black">*</span>
              </label>
              
              <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleFileDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition flex flex-col items-center justify-center gap-2 ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-950/30' 
                    : 'border-slate-700 bg-slate-950/80 hover:border-slate-600 hover:bg-slate-950'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".zip,.rar,.7z,.tar,.gz,.csv,.json,.parquet"
                />
                <FolderArchive className="w-8 h-8 text-indigo-400" />
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-200">
                    {fileName ? fileName : '点击或拖拽上传数据集文件'}
                  </div>
                  <div className="text-[11px] text-slate-500">
                    支持 ZIP / RAR / 7z 压缩包或 CSV / Parquet 等原始文件
                  </div>
                </div>
              </div>
              {errors.file && <p className="text-rose-400 text-[11px]">{errors.file}</p>}
            </div>

            {/* Read-only Size & Status */}
            <div className="space-y-4 flex flex-col justify-between">
              {/* Size Display */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200 flex items-center gap-1.5">
                  <span>数据集大小 (系统自动识别)</span>
                  <span title="上传文件后由系统算法自动解析并展示，不可手动修改">
                    <Info className="w-3.5 h-3.5 text-slate-500" />
                  </span>
                </label>
                <div className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 font-mono font-black text-sm border border-indigo-500/20">
                    {fileSize}
                  </span>
                  <span className="text-[11px] text-slate-400">
                    {isUploaded ? '已自动计算并校验文件大小' : '请先上传文件'}
                  </span>
                </div>
              </div>

              {/* Status Switch */}
              <div className="space-y-1.5">
                <label className="font-bold text-slate-200">上架状态</label>
                <div className="flex items-center justify-between p-3 bg-slate-950 border border-slate-800 rounded-xl">
                  <div>
                    <div className="font-bold text-slate-200">
                      {status === '已上架' ? '立即上架 (前台可见)' : status === '已下架' ? '下架状态 (前台不可见)' : '保存为草稿'}
                    </div>
                    <div className="text-[10px] text-slate-500">
                      控制前台数据集广场与搜索索引是否可见
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStatus(status === '已上架' ? '已下架' : '已上架')}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${
                      status === '已上架' ? 'bg-indigo-600' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                        status === '已上架' ? 'left-7' : 'left-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer Buttons */}
          <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30 transition transform active:scale-95 cursor-pointer"
            >
              {isEditing ? '保存修改' : '立即创建数据集'}
            </button>
          </div>

        </form>
    </div>
  );
};

// ============================================================================
// 预览页面 (DatasetPreviewModal)
// ============================================================================

const DatasetPreviewModal: React.FC<{
  dataset: DatasetItem;
  onClose: () => void;
  onEdit: () => void;
}> = ({ dataset, onClose, onEdit }) => {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回数据集列表</span>
          </button>
          <div>
            <h2 className="text-base font-black text-white">{dataset.name}</h2>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <span>更新于 {dataset.updatedAt}</span>
              <span>•</span>
              <span className="font-mono">{dataset.fileSize || dataset.scale}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md transition"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>编辑数据集</span>
          </button>
        </div>
      </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          {/* Brief */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
            <div className="font-bold text-indigo-400">一句话简介</div>
            <p className="text-slate-200 leading-relaxed">{dataset.brief || dataset.description?.slice(0, 80)}</p>
          </div>

          {/* Tags Matrix */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500">上传者</span>
              <div className="font-bold text-slate-200 truncate flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-indigo-500/20 text-indigo-400 text-[10px] flex items-center justify-center font-bold">
                  {(dataset.uploaderName || dataset.author || '管')[0].toUpperCase()}
                </span>
                <span>{dataset.uploaderName || dataset.author || '平台管理员'}</span>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500">模态</span>
              <div className="font-bold text-slate-200 truncate">
                {dataset.modalities?.join(', ') || dataset.modalityCategory || '表格数据'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500">任务类型</span>
              <div className="font-bold text-slate-200 truncate">
                {dataset.taskTypes?.join(', ') || dataset.taskType || '分类任务'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500">行业领域</span>
              <div className="font-bold text-slate-200 truncate">
                {dataset.domains?.join(', ') || dataset.theme || '商业/管理'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-[10px] text-slate-500">文件格式</span>
              <div className="font-bold text-slate-200 truncate">
                {dataset.formats?.join(', ') || dataset.fileFormats || 'CSV/XLSX'}
              </div>
            </div>
          </div>

          {/* Markdown Content */}
          <div className="space-y-2">
            <div className="font-bold text-slate-100 text-sm">数据描述与说明</div>
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 prose prose-invert prose-xs max-w-none text-slate-200 leading-relaxed">
              <Markdown>{dataset.description || dataset.dataDesc || '暂无详细描述'}</Markdown>
            </div>
          </div>
        </div>
    </div>
  );
};

// ============================================================================
// 3. 数据集使用统计视图 (DatasetStatsAdminView)
// ============================================================================

const DatasetStatsAdminView: React.FC = () => {
  const { datasets, datasetTagDimensions, showToast } = useApp();

  const [tableSearch, setTableSearch] = useState('');
  const [tableModality, setTableModality] = useState('全部模态');
  const [tableSortBy, setTableSortBy] = useState<'downloads' | 'time'>('downloads');

  // Key Statistics Calculations
  const totalDatasetsCount = datasets.filter(d => (d.status || '已上架') === '已上架').length;
  const totalDownloads = datasets.reduce((acc, curr) => acc + (curr.downloadCount || 0), 0);
  const sevenDaysDownloads = Math.floor(totalDownloads * 0.18) + 128; // 近7天模拟或实际统计

  // Top 10 Ranked Datasets
  const top10Datasets = useMemo(() => {
    return [...datasets]
      .sort((a, b) => (b.downloadCount || 0) - (a.downloadCount || 0))
      .slice(0, 10);
  }, [datasets]);

  // Chart 1: 每日下载趋势 (近30天)
  const dailyDownloadTrendData = useMemo(() => {
    const dates = [];
    const baseDownloads = Math.floor(totalDownloads / 30);
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = `${d.getMonth() + 1}/${d.getDate()}`;
      // Random variance curve
      const variance = Math.sin(i / 3) * 120 + Math.cos(i / 2) * 80 + Math.random() * 40;
      const downloads = Math.max(20, Math.floor(baseDownloads + variance));
      const views = Math.floor(downloads * 3.4 + Math.random() * 50);
      dates.push({ date: dateStr, downloads, views });
    }
    return dates;
  }, [totalDownloads]);

  // Chart 2: 模态分布 (Pie / Donut)
  const modalityDistributionData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    datasets.forEach(ds => {
      const mods = ds.modalities && ds.modalities.length > 0 ? ds.modalities : [ds.modalityCategory === '表格' ? '表格数据' : (ds.modalityCategory || '表格数据')];
      mods.forEach(m => {
        counts[m] = (counts[m] || 0) + 1;
      });
    });

    const colors = ['#6366f1', '#38bdf8', '#34d399', '#f59e0b', '#ec4899', '#a855f7'];
    return Object.entries(counts).map(([name, value], i) => ({
      name,
      value,
      color: colors[i % colors.length]
    }));
  }, [datasets]);

  // Chart 3: 行业分布 (Bar Chart)
  const industryDistributionData = useMemo(() => {
    const counts: { [key: string]: number } = {};
    datasets.forEach(ds => {
      const doms = ds.domains && ds.domains.length > 0 ? ds.domains : (ds.domainTags && ds.domainTags.length > 0 ? ds.domainTags : [ds.theme || '商业/管理']);
      doms.forEach(d => {
        counts[d] = (counts[d] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([name, value]) => ({ name, count: value }));
  }, [datasets]);

  // Filtered Table Data
  const detailedTableData = useMemo(() => {
    return datasets.filter(ds => {
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        if (!ds.name.toLowerCase().includes(q)) return false;
      }
      if (tableModality !== '全部模态') {
        const hasMod = ds.modalities?.includes(tableModality) || ds.modalityCategory === tableModality || (tableModality === '表格数据' && ds.modalityCategory === '表格');
        if (!hasMod) return false;
      }
      return true;
    }).sort((a, b) => {
      if (tableSortBy === 'downloads') return (b.downloadCount || 0) - (a.downloadCount || 0);
      return (b.lastDownloadTime || '').localeCompare(a.lastDownloadTime || '');
    });
  }, [datasets, tableSearch, tableModality, tableSortBy]);

  const handleExportData = () => {
    showToast('已导出数据集使用统计报表 (CSV)');
  };

  return (
    <div className="space-y-6">
      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Datasets */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">总数据集数</span>
            <Database className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{totalDatasetsCount}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              已上架
            </span>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2">
            平台全部可检索与下载的精选数据集
          </div>
        </div>

        {/* Total Downloads */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">总下载量</span>
            <Download className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{totalDownloads.toLocaleString()}</span>
            <span className="text-xs font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20 font-mono">
              +14.2%
            </span>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2">
            全部数据集累计下载与加载次数
          </div>
        </div>

        {/* 7-day Downloads */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">近7天下载量</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black text-white font-mono">{sevenDaysDownloads.toLocaleString()}</span>
            <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 font-mono">
              活跃周
            </span>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2">
            过去 7 天内新增下载次数
          </div>
        </div>

        {/* Top 1 Dataset */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-3 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-medium">热门下载榜首</span>
            <Sparkles className="w-4 h-4 text-amber-400" />
          </div>
          <div className="space-y-0.5">
            <div className="text-sm font-black text-white truncate max-w-[200px]">
              {top10Datasets[0]?.name || '暂无数据'}
            </div>
            <div className="text-xs font-mono text-amber-400 font-bold">
              {top10Datasets[0]?.downloadCount || 0} 次下载
            </div>
          </div>
          <div className="text-[11px] text-slate-500 border-t border-slate-800 pt-2">
            全站下载热度最高的数据集
          </div>
        </div>
      </div>

      {/* Charts Grid: 1 Trend Area + 1 Donut + 1 Bar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 1. 每日下载趋势 (2 columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>每日下载趋势 (近30天)</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                追踪过去一个月内用户对数据集资源的下载与拉取动态
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 text-xs font-mono font-bold border border-indigo-500/20">
              近30日
            </span>
          </div>

          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyDownloadTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="downloadGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="downloads" name="下载次数" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#downloadGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. 热门下载排行 Top 10 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              <span>热门下载排行 Top 10</span>
            </h3>
          </div>

          <div className="space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {top10Datasets.map((ds, idx) => (
              <div
                key={ds.id}
                className="flex items-center justify-between p-2 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-md flex items-center justify-center font-mono font-bold text-[10px] shrink-0 ${
                    idx === 0 ? 'bg-amber-500 text-slate-950' :
                    idx === 1 ? 'bg-slate-300 text-slate-950' :
                    idx === 2 ? 'bg-amber-700 text-white' : 'bg-slate-800 text-slate-400'
                  }`}>
                    {idx + 1}
                  </span>
                  <span className="font-bold text-slate-200 truncate max-w-[140px]" title={ds.name}>
                    {ds.name}
                  </span>
                </div>
                <div className="font-mono text-indigo-400 font-bold shrink-0">
                  {ds.downloadCount || 0} 次
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 模态分布 (Donut Chart) */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-indigo-400" />
            <span>模态分布占比</span>
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={modalityDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={75}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {modalityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. 行业分布 (Bar Chart 2 columns) */}
        <div className="lg:col-span-2 rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4">
          <h3 className="text-sm font-black text-white flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-cyan-400" />
            <span>行业领域数据集分布</span>
          </h3>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={industryDistributionData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="count" name="数据集数量" fill="#38bdf8" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Detailed Data Table */}
      <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-black text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-indigo-400" />
              <span>详细使用明细表</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              各数据集的实时模态、任务类型、物理体积、下载次数及最后活跃下载时间戳
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="搜索明细数据集..."
                className="w-44 bg-slate-950 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>

            <select
              value={tableModality}
              onChange={(e) => setTableModality(e.target.value)}
              className="bg-slate-950 border border-slate-700/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 transition"
            >
              <option value="全部模态">全部模态</option>
              {datasetTagDimensions.modality.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>

            <button
              onClick={handleExportData}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出表格</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950/60">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-slate-950 text-slate-400 font-bold border-b border-slate-800 select-none">
              <tr>
                <th className="p-3.5 min-w-[220px]">数据集名称</th>
                <th className="p-3.5 min-w-[110px]">模态</th>
                <th className="p-3.5 min-w-[120px]">任务类型</th>
                <th className="p-3.5 min-w-[100px]">数据集大小</th>
                <th className="p-3.5 min-w-[90px]">累计下载量</th>
                <th className="p-3.5 min-w-[150px]">最后下载时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {detailedTableData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-500">
                    暂无匹配明细数据
                  </td>
                </tr>
              ) : (
                detailedTableData.map(ds => (
                  <tr key={ds.id} className="hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-200">{ds.name}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{ds.brief || ds.description?.slice(0, 30)}</div>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-300 border border-indigo-500/20">
                        {ds.modalities?.[0] || ds.modalityCategory || '表格数据'}
                      </span>
                    </td>
                    <td className="p-3.5">
                      <span className="text-slate-300">
                        {ds.taskTypes?.[0] || ds.taskType || '分类任务'}
                      </span>
                    </td>
                    <td className="p-3.5 font-mono font-bold text-slate-200">
                      {ds.fileSize || ds.scale || '10.5 MB'}
                    </td>
                    <td className="p-3.5 font-mono font-bold text-indigo-400">
                      {ds.downloadCount || 0}
                    </td>
                    <td className="p-3.5 font-mono text-slate-400 text-[11px]">
                      {ds.lastDownloadTime || '2026-08-19 14:20:00'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
