import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { DatasetItem, DatasetFileItem, DatasetCommentItem, DatasetCommentReply } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  X,
  Download, 
  Share2, 
  Copy, 
  Check, 
  FileSpreadsheet, 
  Table, 
  MessageSquare, 
  FileText, 
  Layers, 
  Calendar, 
  Eye, 
  Send, 
  Search, 
  Database,
  Building2,
  HardDrive,
  User,
  ShieldCheck,
  ThumbsUp,
  CornerDownRight,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Sparkles,
  Tag
} from 'lucide-react';
import { validateTextOnlyComment } from '../../utils/commentValidator';

interface DatasetDetailModalProps {
  dataset: DatasetItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const DatasetDetailModal: React.FC<DatasetDetailModalProps> = ({ dataset, isOpen, onClose }) => {
  const { showToast, downloadDataset, user } = useApp();

  // Active Tab: overview | files | comments
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'comments'>('overview');

  // Files Tab State
  const filesList: DatasetFileItem[] = dataset?.files && dataset.files.length > 0 ? dataset.files : [
    {
      id: 'f_default_1',
      name: `${dataset?.name || 'dataset'}.${dataset?.formats?.[0]?.toLowerCase()?.includes('json') ? 'json' : 'csv'}`,
      size: dataset?.fileSize || dataset?.scale || '10.5 MB',
      format: dataset?.formats?.[0]?.toLowerCase()?.includes('json') ? 'json' : 'csv',
      rowsCount: 25000,
      colsCount: 6,
      encoding: 'UTF-8',
      headers: ['ID', 'Category', 'Feature_A', 'Feature_B', 'Label_Value', 'Timestamp'],
      sampleRows: [
        { ID: '1001', Category: 'Sample_A', Feature_A: 'Alpha_01', Feature_B: 'Active', Label_Value: 128.5, Timestamp: '2026-08-01' },
        { ID: '1002', Category: 'Sample_B', Feature_A: 'Beta_02', Feature_B: 'Pending', Label_Value: 94.2, Timestamp: '2026-08-02' },
        { ID: '1003', Category: 'Sample_C', Feature_A: 'Gamma_03', Feature_B: 'Completed', Label_Value: 310.0, Timestamp: '2026-08-03' }
      ]
    }
  ];
  const [selectedFileId, setSelectedFileId] = useState<string>(filesList[0]?.id || '');
  const [fileSearchQuery, setFileSearchQuery] = useState('');
  const [tableSearchQuery, setTableSearchQuery] = useState('');

  // Selected File Object
  const currentFile = filesList.find(f => f.id === selectedFileId) || filesList[0];

  // Comments Tab State
  const [commentsList, setCommentsList] = useState<DatasetCommentItem[]>(() => 
    dataset?.comments && dataset.comments.length > 0 ? dataset.comments : [
      {
        id: 'c_default_1',
        userName: '数据科学研究员',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        userRole: '认证数据科学家',
        time: '2 天前',
        timestamp: Date.now() - 172800000,
        content: '这个数据集的字段清洗得很规整，缺失值比例控制在0.1%以内，可以直接导入做深度学习和多任务分类验证，非常推荐！',
        likes: 28,
        isLiked: true,
        replies: [
          {
            id: 'r_default_1',
            userName: '逐聚开源官方支持',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            userRole: '官方维护者',
            time: '1 天前',
            timestamp: Date.now() - 86400000,
            content: '感谢认可！我们在最新版本中统一了时区格式与坐标基准，后续还会增加增量标注批次。',
            likes: 18,
            isLiked: true
          }
        ]
      },
      {
        id: 'c_default_2',
        userName: 'NLP语料工程师',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        userRole: '开发者',
        time: '3 天前',
        timestamp: Date.now() - 259200000,
        content: '请问一下包含的多语言标签和中文对应索引有单独的映射表或者 embedding 词表提供吗？',
        likes: 11,
        isLiked: false,
        replies: [
          {
            id: 'r_default_5',
            userName: '逐聚开源官方支持',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            userRole: '官方维护者',
            time: '2 天前',
            timestamp: Date.now() - 172800000,
            content: '你好，映射表已挂载在 files 目录下对应的 mapping.jsonl 文件中，可直接拉取预览。',
            likes: 13,
            isLiked: false
          }
        ]
      }
    ]
  );

  const [commentSort, setCommentSort] = useState<'hot' | 'latest'>('hot');
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ commentId: string; targetAuthor: string } | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [expandedRepliesMap, setExpandedRepliesMap] = useState<Record<string, boolean>>({});

  // Sync comments on dataset change
  React.useEffect(() => {
    if (dataset) {
      if (dataset.comments && dataset.comments.length > 0) {
        setCommentsList(dataset.comments);
      }
      if (dataset.files && dataset.files.length > 0) {
        setSelectedFileId(dataset.files[0].id);
      }
    }
  }, [dataset]);

  if (!isOpen || !dataset) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('已复制数据集公开分享链接到剪贴板！');
    } else {
      showToast('已生成数据集分享链接！');
    }
  };

  const handleAddComment = () => {
    const textToSubmit = newCommentText.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message || '请输入讨论内容');
      return;
    }

    const newComment: DatasetCommentItem = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userName: user.name || '平台开发者',
      userAvatar: user.avatar || '',
      userRole: user.identityTag || '开发者',
      time: '刚刚',
      timestamp: Date.now(),
      content: textToSubmit,
      likes: 0,
      isLiked: false,
      replies: []
    };
    setCommentsList(prev => [newComment, ...prev]);
    setNewCommentText('');
    showToast('讨论发布成功！已展示在顶部');
  };

  const handleAddReply = (commentId: string, targetAuthor: string) => {
    const textToSubmit = replyInput.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message?.replace('评论', '回复') || '请输入回复内容');
      return;
    }

    const newReply: DatasetCommentReply = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userName: user.name || '平台开发者',
      userAvatar: user.avatar || '',
      userRole: user.identityTag || '开发者',
      time: '刚刚',
      timestamp: Date.now(),
      content: textToSubmit,
      replyToUser: targetAuthor,
      likes: 0,
      isLiked: false
    };

    setCommentsList(prev => prev.map(c => {
      if (c.id === commentId) {
        return {
          ...c,
          replies: [...(c.replies || []), newReply]
        };
      }
      return c;
    }));

    setExpandedRepliesMap(prev => ({ ...prev, [commentId]: true }));
    setReplyInput('');
    setReplyTarget(null);
    showToast('回复成功！');
  };

  const handleLikeComment = (commentId: string) => {
    setCommentsList(prev => prev.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.isLiked;
        const likes = isLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1);
        return { ...c, isLiked, likes };
      }
      return c;
    }));
  };

  const isPlatform = dataset.uploaderType === 'platform' || dataset.uploaderName === '平台管理';
  const primaryModality = dataset.modalities?.[0] || dataset.modalityCategory || '表格数据';
  const primaryTask = dataset.taskTypes?.[0] || dataset.taskType || '通用分析';
  const licenseText = dataset.license || 'CC-BY-4.0 (允许商用与学术研究)';

  // Filter sample rows by search query
  const sampleHeaders = currentFile?.headers || ['ID', 'Column_1', 'Column_2', 'Label'];
  const sampleRows = (currentFile?.sampleRows || []).filter(row => {
    if (!tableSearchQuery.trim()) return true;
    return Object.values(row).some(val => 
      String(val).toLowerCase().includes(tableSearchQuery.trim().toLowerCase())
    );
  });

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto cursor-pointer select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh] cursor-default select-text"
      >
        {/* Top Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-50/60 via-teal-50/40 to-white border-b border-slate-200/80">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20 shrink-0">
                <Database className="w-7 h-7" />
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight truncate">
                    {dataset.name}
                  </h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                    isPlatform ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isPlatform ? '平台官方' : (dataset.uploaderName || '社区精选')}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {primaryModality}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    {dataset.formats?.[0] || 'CSV'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {dataset.brief || dataset.description || '高标准行业脱敏数据集，支持一键加载与微调训练。'}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>来源: {dataset.uploaderName || '平台管理'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                    <span>规模: {dataset.fileSize || dataset.scale || '10.5 MB'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>协议: {licenseText.split(' ')[0]}</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleShare}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-white border border-slate-200/80 transition cursor-pointer shadow-2xs"
                title="分享链接"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
                title="关闭弹窗"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Navigation Tabs (与 AI 集市 DatasetDetail 保持完全一致) */}
          <div className="flex items-center gap-2 mt-5 -mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-3 text-xs font-bold transition relative cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>概览说明</span>
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`pb-3 px-3 text-xs font-bold transition relative cursor-pointer ${
                activeTab === 'files'
                  ? 'text-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>文件与预览</span>
              {activeTab === 'files' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-3 px-3 text-xs font-bold transition relative cursor-pointer ${
                activeTab === 'comments'
                  ? 'text-emerald-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>讨论与评价 ({commentsList.length})</span>
              {activeTab === 'comments' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 rounded-full" />
              )}
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 max-h-[calc(92vh-200px)]">
          {/* TAB 1: 概览说明 */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 核心指标矩阵卡片 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">数据格式</div>
                  <div className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                    <span>{dataset.formats?.join(', ') || dataset.format || 'CSV / Parquet'}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">文件大小</div>
                  <div className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1">
                    <HardDrive className="w-4 h-4 text-blue-600" />
                    <span>{dataset.fileSize || dataset.scale || '10.5 MB'}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">适用任务</div>
                  <div className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>{primaryTask}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">下载量</div>
                  <div className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-1">
                    <Download className="w-4 h-4 text-emerald-600" />
                    <span>{(dataset.downloadCount || 1580).toLocaleString()} 次</span>
                  </div>
                </div>
              </div>

              {/* 数据集详细描述 */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>数据集详细说明</span>
                </h3>
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-3">
                  <div className="prose prose-slate max-w-none text-xs leading-relaxed">
                    <Markdown>{dataset.description || dataset.brief || '此数据集为标准化行业脱敏语料。'}</Markdown>
                  </div>
                </div>
              </div>

              {/* 字段字典与 Schema */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Table className="w-4 h-4 text-indigo-600" />
                  <span>字段结构定义 (Schema)</span>
                </h3>
                <div className="overflow-hidden rounded-2xl border border-slate-200/80">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="py-2.5 px-4">字段名 (Column)</th>
                        <th className="py-2.5 px-4">数据类型 (Type)</th>
                        <th className="py-2.5 px-4">字段说明 (Description)</th>
                        <th className="py-2.5 px-4">示例数据 (Example)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {(currentFile?.headers || ['id', 'title', 'content', 'label']).map((header, idx) => {
                        const types = ['String', 'Integer', 'Float', 'Categorical', 'Timestamp', 'Array'];
                        const typeVal = types[idx % types.length];
                        const sampleVal = currentFile?.sampleRows?.[0]?.[header] ?? `sample_${idx + 1}`;
                        return (
                          <tr key={`field-${idx}`} className="hover:bg-slate-50/50">
                            <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{header}</td>
                            <td className="py-2.5 px-4">
                              <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                                {typeVal}
                              </span>
                            </td>
                            <td className="py-2.5 px-4 text-slate-600">
                              {idx === 0 ? '唯一主键标识符' : idx === 1 ? '核心分类或主题标签' : '脱敏标准化特征或评测文本'}
                            </td>
                            <td className="py-2.5 px-4 font-mono text-slate-500 truncate max-w-[160px]">
                              {String(sampleVal)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 规范与许可协议 */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-amber-800">
                  <div className="font-bold">数据合规与商用授权</div>
                  <div className="text-[11px] leading-relaxed text-amber-700">
                    本数据集严格遵循 {licenseText} 协议规范，已完成敏感数据脱敏治理与安全筛查。使用者在科研、微调及商用产品中需保留平台出处署名。
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 文件与预览 */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="text-xs font-bold text-slate-700">挂载文件列表:</div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {filesList.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFileId(f.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                          selectedFileId === f.id
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[140px]">{f.name}</span>
                        <span className="text-[10px] opacity-80">({f.size})</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={tableSearchQuery}
                    onChange={(e) => setTableSearchQuery(e.target.value)}
                    placeholder="在当前样本中快速检索..."
                    className="pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:bg-white transition w-full sm:w-56"
                  />
                </div>
              </div>

              {/* 表格预览 */}
              <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-2xs">
                <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs text-slate-600">
                  <div className="font-medium flex items-center gap-2">
                    <span className="font-bold text-slate-800">{currentFile?.name}</span>
                    <span className="text-[10px] text-slate-400">· 编码: {currentFile?.encoding || 'UTF-8'}</span>
                    <span className="text-[10px] text-slate-400">· 预估总行数: {currentFile?.rowsCount?.toLocaleString() || '25,000'}</span>
                  </div>
                  <div className="text-[11px] text-emerald-600 font-bold">
                    样本在线预览 (前 {sampleRows.length} 条)
                  </div>
                </div>

                <div className="overflow-x-auto max-h-[380px]">
                  <table className="w-full text-left text-xs whitespace-nowrap">
                    <thead className="bg-slate-100/80 sticky top-0 text-slate-700 font-extrabold border-b border-slate-200">
                      <tr>
                        {sampleHeaders.map((h, i) => (
                          <th key={`th-${i}`} className="py-2.5 px-4 font-mono">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {sampleRows.length > 0 ? (
                        sampleRows.map((row, rIdx) => (
                          <tr key={`row-${rIdx}`} className="hover:bg-slate-50/80">
                            {sampleHeaders.map((h, cIdx) => (
                              <td key={`cell-${rIdx}-${cIdx}`} className="py-2.5 px-4 font-mono text-slate-600">
                                {String(row[h] ?? '')}
                              </td>
                            ))}
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={sampleHeaders.length} className="py-12 text-center text-slate-400 text-xs">
                            未匹配到符合 "{tableSearchQuery}" 的样本内容
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 评价与讨论 */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* 发表讨论表单 (严格文字验证) */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-emerald-600" />
                    <span>参与数据集质量讨论与技术反馈</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">仅限纯文字 · 严禁图片表情</span>
                </div>

                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="分享您在训练或评测中使用该数据集的经验、字段分布特征或清洗建议..."
                  rows={3}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 resize-none transition"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    发布者账号: <strong className="text-slate-700">{user?.name || '平台开发者'}</strong>
                  </span>
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>发表讨论</span>
                  </button>
                </div>
              </div>

              {/* 评论列表 */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900">全部真实讨论 ({commentsList.length})</h4>
                  <div className="flex items-center gap-1 text-[11px] bg-slate-100 p-0.5 rounded-lg">
                    <button
                      onClick={() => setCommentSort('hot')}
                      className={`px-2.5 py-1 rounded-md font-bold transition ${commentSort === 'hot' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                    >
                      最热
                    </button>
                    <button
                      onClick={() => setCommentSort('latest')}
                      className={`px-2.5 py-1 rounded-md font-bold transition ${commentSort === 'latest' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'}`}
                    >
                      最新
                    </button>
                  </div>
                </div>

                <div className="space-y-3">
                  {commentsList.map((c) => (
                    <div key={c.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={c.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                            alt={c.userName}
                            className="w-7 h-7 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-slate-900 text-xs">{c.userName}</span>
                              {c.userRole && (
                                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded">
                                  {c.userRole}
                                </span>
                              )}
                            </div>
                            <div className="text-[10px] text-slate-400">{c.time || '1天前'}</div>
                          </div>
                        </div>

                        <button
                          onClick={() => handleLikeComment(c.id)}
                          className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                            c.isLiked ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{c.likes || 0}</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-normal pl-9">
                        {c.content}
                      </p>

                      {/* 二级回复展示 */}
                      {c.replies && c.replies.length > 0 && (
                        <div className="ml-9 p-3 bg-white rounded-xl border border-slate-200/80 space-y-2.5">
                          {c.replies.map((r) => (
                            <div key={r.id} className="text-xs space-y-1">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-extrabold text-slate-900 text-[11px]">{r.userName}</span>
                                  {r.replyToUser && (
                                    <span className="text-[10px] text-slate-400">回复 @{r.replyToUser}</span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-400">{r.time || '刚刚'}</span>
                              </div>
                              <p className="text-slate-600 leading-relaxed text-[11px] pl-1">{r.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* 回复触发按钮与输入框 */}
                      <div className="pl-9 flex items-center justify-between">
                        {replyTarget?.commentId === c.id ? (
                          <div className="w-full space-y-2 mt-2">
                            <input
                              type="text"
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              placeholder={`回复 @${c.userName}...`}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-emerald-500"
                            />
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => setReplyTarget(null)}
                                className="px-3 py-1 rounded-lg text-slate-500 text-xs font-medium hover:bg-slate-200"
                              >
                                取消
                              </button>
                              <button
                                onClick={() => handleAddReply(c.id, c.userName)}
                                className="px-3 py-1 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-500"
                              >
                                发送回复
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyTarget({ commentId: c.id, targetAuthor: c.userName })}
                            className="text-[11px] font-bold text-slate-500 hover:text-emerald-600 flex items-center gap-1 cursor-pointer"
                          >
                            <CornerDownRight className="w-3 h-3" />
                            <span>回复讨论</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Footer Actions */}
        <div className="p-4 bg-slate-50 border-t border-slate-200/90 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2 truncate">
            <span className="font-bold text-slate-700">{dataset.name}</span>
            <span>· 格式: {dataset.formats?.[0] || 'CSV'}</span>
            <span>· 大小: {dataset.fileSize || dataset.scale || '10.5 MB'}</span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              关闭
            </button>
            <button
              onClick={() => {
                downloadDataset(dataset);
                showToast(`已开始下载数据集【${dataset.name}】！`);
              }}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-md shadow-emerald-600/20 hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>一键下载数据集</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
