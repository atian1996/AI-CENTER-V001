import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { DatasetItem, DatasetFileItem, DatasetCommentItem, DatasetCommentReply } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
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
  ChevronRight,
  FolderOpen,
  Tag,
  Building2,
  HardDrive,
  User,
  ShieldCheck,
  ThumbsUp,
  CornerDownRight,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  X
} from 'lucide-react';
import { validateTextOnlyComment } from '../../utils/commentValidator';

interface DatasetDetailProps {
  dataset: DatasetItem;
  onBack: () => void;
  fromTitle?: string;
}

export const DatasetDetail: React.FC<DatasetDetailProps> = ({ dataset, onBack, fromTitle }) => {
  const effectiveFromTitle = fromTitle || '数据集广场';
  const { showToast, downloadDataset, user } = useApp();

  // Active Tab: overview | files | comments
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'comments'>('overview');

  // Files Tab State
  const filesList: DatasetFileItem[] = dataset.files && dataset.files.length > 0 ? dataset.files : [
    {
      id: 'f_default_1',
      name: `${dataset.name || 'dataset'}.${dataset.formats?.[0]?.toLowerCase()?.includes('json') ? 'json' : 'csv'}`,
      size: dataset.fileSize || dataset.scale || '10.5 MB',
      format: dataset.formats?.[0]?.toLowerCase()?.includes('json') ? 'json' : 'csv',
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
  const [commentsList, setCommentsList] = useState<DatasetCommentItem[]>(dataset.comments && dataset.comments.length > 0 ? dataset.comments : [
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
        },
        {
          id: 'r_default_2',
          userName: 'CV老法师',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          userRole: '算法工程师',
          time: '18 小时前',
          timestamp: Date.now() - 64800000,
          content: '实测在旋转框目标检测任务上，mAP50 达到了 0.923，小目标标注特别清晰。',
          likes: 14,
          isLiked: false
        },
        {
          id: 'r_default_3',
          userName: '数据科学研究员',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          userRole: '认证数据科学家',
          replyToUser: 'CV老法师',
          time: '12 小时前',
          timestamp: Date.now() - 43200000,
          content: '有做数据增强和马赛克拼接实验吗？旋转角度的扰动对收敛速度影响大吗？',
          likes: 6,
          isLiked: false
        },
        {
          id: 'r_default_4',
          userName: 'CV老法师',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          userRole: '算法工程师',
          replyToUser: '数据科学研究员',
          time: '8 小时前',
          timestamp: Date.now() - 28800000,
          content: '旋转扰动在 ±15 度内效果最好，马赛克拼接可以有效防止过拟合。',
          likes: 9,
          isLiked: false
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
  ]);

  const [commentSort, setCommentSort] = useState<'hot' | 'latest'>('hot');
  const [newCommentText, setNewCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ commentId: string; targetAuthor: string; replyId?: string } | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [expandedRepliesMap, setExpandedRepliesMap] = useState<Record<string, boolean>>({});
  const [repliesPageMap, setRepliesPageMap] = useState<Record<string, number>>({});

  // 计算评论区全量条数（一级评论 + 所有二级回复）
  const totalCommentsCount = commentsList.reduce(
    (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
    0
  );

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('已复制数据集公开分享链接到剪贴板！');
    } else {
      showToast('已生成数据集分享链接！');
    }
  };

  // 添加一级评论（严格纯文字规范：仅限文字，禁止表情和图片）
  const handleAddComment = () => {
    const textToSubmit = newCommentText.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message || '请输入讨论内容');
      return;
    }

    const newComment: DatasetCommentItem = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userName: user.name || '当前用户',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
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

  // 添加二级回复（严格纯文字规范：仅限文字，禁止表情）
  const handleAddReply = (commentId: string, targetAuthor: string) => {
    const textToSubmit = replyInput.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message?.replace('评论', '回复') || '请输入回复内容');
      return;
    }

    const newReply: DatasetCommentReply = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userName: user.name || '当前用户',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      userRole: user.identityTag || '开发者',
      time: '刚刚',
      timestamp: Date.now(),
      content: textToSubmit,
      replyToUser: targetAuthor,
      likes: 0,
      isLiked: false
    };

    let targetPage = 1;
    setCommentsList(prev => prev.map(c => {
      if (c.id === commentId) {
        const nextReplies = [...(c.replies || []), newReply];
        targetPage = Math.ceil(nextReplies.length / 10);
        return {
          ...c,
          replies: nextReplies
        };
      }
      return c;
    }));

    // 自动展开该评论的二级回复并跳转到包含新回复的最后一页
    setExpandedRepliesMap(prev => ({ ...prev, [commentId]: true }));
    setRepliesPageMap(prev => ({ ...prev, [commentId]: targetPage }));

    setReplyInput('');
    setReplyTarget(null);
    showToast('回复成功！');
  };

  // 一级评论点赞/取消赞
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

  // 二级回复点赞/取消赞
  const handleLikeReply = (commentId: string, replyId: string) => {
    setCommentsList(prev => prev.map(c => {
      if (c.id === commentId) {
        const nextReplies = (c.replies || []).map(r => {
          if (r.id === replyId) {
            const isLiked = !r.isLiked;
            const likes = isLiked ? (r.likes || 0) + 1 : Math.max(0, (r.likes || 0) - 1);
            return { ...r, isLiked, likes };
          }
          return r;
        });
        return { ...c, replies: nextReplies };
      }
      return c;
    }));
  };

  // 删除一级评论：连带所有二级回复移除
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('确定要删除该讨论吗？其名下的所有二级回复也将一并移除。')) {
      setCommentsList(prev => prev.filter(c => c.id !== commentId));
      showToast('讨论及名下回复已成功删除');
    }
  };

  // 删除二级回复
  const handleDeleteReply = (commentId: string, replyId: string) => {
    if (window.confirm('确定要删除该条二级回复吗？')) {
      setCommentsList(prev => prev.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            replies: (c.replies || []).filter(r => r.id !== replyId)
          };
        }
        return c;
      }));
      showToast('二级回复已删除');
    }
  };

  // Filter sample rows by tableSearchQuery
  const filteredSampleRows = (currentFile?.sampleRows || []).filter(row => {
    if (!tableSearchQuery.trim()) return true;
    const q = tableSearchQuery.toLowerCase();
    return Object.values(row).some(val => String(val).toLowerCase().includes(q));
  });

  const modalitiesText = dataset.modalities?.join('、') || dataset.modalityCategory || '表格数据';
  const taskTypesText = dataset.taskTypes?.join('、') || dataset.taskType || '分类任务';
  const domainsList = dataset.domains || dataset.domainTags || [];
  const formatsText = dataset.formats?.join(' / ') || dataset.fileFormats || dataset.format || 'CSV';
  const isPlatformUploader = dataset.uploaderType === 'platform' || !dataset.uploaderType || dataset.uploaderName === '平台管理';
  const uploaderDisplay = isPlatformUploader ? '平台管理' : (dataset.uploaderName || dataset.author || '用户上传');

  return (
    <div className="space-y-6 select-none animate-fade-in max-w-7xl mx-auto pb-16">
      
      {/* Top Breadcrumb & Return Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-2xs transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回{effectiveFromTitle}</span>
        </button>

        <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
          <span className="cursor-pointer hover:text-indigo-600" onClick={onBack}>{effectiveFromTitle}</span>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-700 font-bold truncate max-w-xs">{dataset.name}</span>
        </div>
      </div>

      {/* Dataset Header Hero Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          {/* Left info */}
          <div className="space-y-3 flex-1 min-w-0">
            {/* Badges: Modality, Task Type, Format, Uploader */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-bold flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" />
                <span>{modalitiesText}</span>
              </span>

              <span className="px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-xs font-bold flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                <span>{taskTypesText}</span>
              </span>

              <span className="px-3 py-1 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-mono font-bold">
                {formatsText}
              </span>

              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold ${
                isPlatformUploader 
                  ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200'
              }`}>
                {isPlatformUploader ? <ShieldCheck className="w-3.5 h-3.5 text-blue-600" /> : <User className="w-3.5 h-3.5 text-amber-600" />}
                <span>上传者: {uploaderDisplay}</span>
              </span>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {dataset.name}
            </h1>

            {/* Brief Introduction */}
            {dataset.brief && (
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-2xl border border-slate-100">
                {dataset.brief}
              </p>
            )}

            {/* Metadata Chips: Update Time, Views, Downloads */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
              <div className="flex items-center gap-1.5 text-slate-500">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>更新时间：{dataset.updatedAt}</span>
              </div>

              <div className="flex items-center gap-1.5 text-slate-500">
                <HardDrive className="w-3.5 h-3.5 text-slate-400" />
                <span>数据大小：<strong className="font-mono text-slate-800">{dataset.fileSize || dataset.scale || '0 B'}</strong></span>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5" /> {dataset.viewsCount ?? 0} 次浏览
                </span>
                <span className="flex items-center gap-1">
                  <Download className="w-3.5 h-3.5" /> {dataset.downloadCount ?? 0} 次下载
                </span>
              </div>
            </div>

            {/* Domain Tags */}
            {domainsList.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[11px] text-slate-400 font-medium">行业领域：</span>
                {domainsList.map(tag => (
                  <span
                    key={tag}
                    className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-bold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {/* Share Button */}
            <button
              onClick={handleShare}
              className="px-4 py-2.5 rounded-xl text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 cursor-pointer bg-white shadow-2xs"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>分享</span>
            </button>

            {/* Download Package */}
            <button
              onClick={() => downloadDataset(dataset)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-sm shadow-indigo-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>下载完整数据 ({dataset.fileSize || dataset.scale || '完整包'})</span>
            </button>
          </div>

        </div>

        {/* 3 Main Tabs: Overview, Files, Comments */}
        <div className="flex items-center gap-4 border-t border-slate-100 pt-4 text-xs font-black">
          {[
            { key: 'overview', label: '概述', icon: FileText, count: undefined },
            { key: 'files', label: '文件', icon: FolderOpen, count: filesList.length },
            { key: 'comments', label: '评论', icon: MessageSquare, count: totalCommentsCount }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`pb-2 px-3 border-b-2 flex items-center gap-2 transition cursor-pointer text-sm ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600 font-black'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* ================= TAB 1: 概述 (Overview) ================= */}
      {activeTab === 'overview' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 text-slate-900 font-black text-sm pb-3 border-b border-slate-100">
            <FileText className="w-4 h-4 text-indigo-600" />
            <span>数据描述</span>
          </div>
          
          {/* Render Backend Markdown Description */}
          <div className="prose prose-sm prose-slate max-w-none text-slate-700 text-xs leading-relaxed">
            <Markdown>
              {dataset.description || dataset.brief || '暂无数据描述。'}
            </Markdown>
          </div>
        </div>
      )}

      {/* ================= TAB 2: 文件 (Files) ================= */}
      {activeTab === 'files' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[600px]">
            
            {/* Left Col: File Explorer Tree (4 Cols) */}
            <div className="lg:col-span-4 border-r border-slate-200/80 p-4 space-y-4 bg-slate-50/60">
              
              {/* Search file in dataset */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索子文件..."
                  value={fileSearchQuery}
                  onChange={(e) => setFileSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 font-bold px-1">
                <span>包含文件 ({filesList.length})</span>
                <span>格式 / 大小</span>
              </div>

              {/* Files Tree List */}
              <div className="space-y-1.5 overflow-y-auto max-h-[500px]">
                {filesList
                  .filter(f => f.name.toLowerCase().includes(fileSearchQuery.toLowerCase()))
                  .map(f => {
                    const isSelected = f.id === selectedFileId;
                    return (
                      <button
                        key={f.id}
                        onClick={() => setSelectedFileId(f.id)}
                        className={`w-full text-left p-3 rounded-2xl border transition-all flex items-center justify-between gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                            : 'bg-white border-slate-200/80 text-slate-700 hover:border-indigo-200 hover:bg-slate-100/80'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                          }`}>
                            {f.format === 'csv' || f.format === 'xlsx' ? (
                              <FileSpreadsheet className="w-4 h-4" />
                            ) : (
                              <FileText className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className={`text-xs font-bold truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                              {f.name}
                            </div>
                            <div className={`text-[10px] font-medium ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                              {f.rowsCount ? `${f.rowsCount.toLocaleString()} 行 · ` : ''}{f.colsCount ? `${f.colsCount} 列` : ''}
                            </div>
                          </div>
                        </div>

                        <div className={`text-[11px] font-mono shrink-0 font-bold ${
                          isSelected ? 'text-indigo-100' : 'text-slate-500'
                        }`}>
                          {f.size}
                        </div>
                      </button>
                    );
                  })}
              </div>

            </div>

            {/* Right Col: Structured Table Data Previewer (8 Cols) */}
            <div className="lg:col-span-8 p-6 flex flex-col justify-between space-y-4">
              
              {/* Header Info Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-slate-900">{currentFile?.name}</span>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold">
                      {currentFile?.format?.toUpperCase() || 'CSV'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">编码: {currentFile?.encoding || 'UTF-8'}</span>
                  </div>
                  <div className="text-xs text-slate-500 font-medium">
                    文件大小: <span className="font-bold text-slate-800">{currentFile?.size}</span> · 
                    数据规模: <span className="font-bold text-slate-800">{currentFile?.rowsCount?.toLocaleString() || '10,000+'}</span> 行 · 
                    字段数: <span className="font-bold text-slate-800">{currentFile?.colsCount || (currentFile?.headers?.length || 6)}</span> 列
                  </div>
                </div>

                {/* Search in current table */}
                <div className="flex items-center gap-2">
                  <div className="relative w-48 sm:w-60">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="过滤表格样本..."
                      value={tableSearchQuery}
                      onChange={(e) => setTableSearchQuery(e.target.value)}
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <button
                    onClick={() => showToast(`正在导出文件【${currentFile?.name}】`)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                    title="下载单表"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Table Data View */}
              <div className="flex-1 overflow-x-auto border border-slate-200/80 rounded-2xl bg-white shadow-2xs max-h-[440px]">
                {currentFile?.headers && currentFile.headers.length > 0 ? (
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 text-slate-700 font-extrabold sticky top-0 z-10 border-b border-slate-200 shadow-2xs">
                      <tr>
                        <th className="py-2.5 px-3 border-r border-slate-200 w-12 text-center text-slate-400 font-mono">
                          #
                        </th>
                        {currentFile.headers.map(h => (
                          <th key={h} className="py-2.5 px-3 border-r border-slate-200 whitespace-nowrap font-bold text-slate-800">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredSampleRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-indigo-50/40 transition">
                          <td className="py-2 px-3 border-r border-slate-100 text-center text-slate-400 font-mono text-[10px]">
                            {idx + 1}
                          </td>
                          {currentFile.headers!.map(h => (
                            <td key={h} className="py-2 px-3 border-r border-slate-100 font-mono text-slate-700 whitespace-nowrap">
                              {String(row[h] ?? '-')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div className="p-8 text-center text-slate-400 text-xs space-y-2">
                    <Table className="w-8 h-8 mx-auto text-slate-300" />
                    <div>当前文件为非结构化格式，请下载后使用对应工具读取解析。</div>
                  </div>
                )}
              </div>

              {/* Footer row counter */}
              <div className="flex items-center justify-between text-xs text-slate-400 pt-2 font-medium">
                <div>
                  展示前 <span className="font-bold text-slate-700">{filteredSampleRows.length}</span> 条采样样本（完整数据共 {currentFile?.rowsCount?.toLocaleString() || '10,000+'} 条）
                </div>
                <div className="text-[11px] text-indigo-600 font-bold">
                  ● 结构化样本视图已就绪
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= TAB 3: 评论 (Comments) ================= */}
      {activeTab === 'comments' && (() => {
        // 一级评论排序
        const sortedComments = [...commentsList].sort((a, b) => {
          if (commentSort === 'hot') {
            const aScore = (a.likes || 0) * 2 + (a.replies ? a.replies.length * 3 : 0);
            const bScore = (b.likes || 0) * 2 + (b.replies ? b.replies.length * 3 : 0);
            return bScore - aScore;
          }
          return (b.timestamp || 0) - (a.timestamp || 0);
        });

        return (
          <div className="space-y-6">
            
            {/* Post Comment Card */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>发表讨论与使用反馈</span>
                </div>
                <span className="text-[11px] font-mono text-slate-400">{newCommentText.length}/500</span>
              </div>

              <textarea
                rows={3}
                placeholder="分享您对该数据集的使用心得、清洗体验或向发布者反馈（最多500字，仅限纯文字）..."
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value.slice(0, 500))}
                className="w-full p-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:bg-white leading-relaxed resize-none transition"
              />

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <MessageSquare className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>遵循社区公约 · 仅限纯文字讨论（禁止表情与图片） · 自动安全审核</span>
                </div>

                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>发布讨论</span>
                </button>
              </div>
            </div>

            {/* Comments List */}
            <div className="bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-2xs space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <h3 className="text-sm font-bold text-slate-900">
                  全部讨论（{totalCommentsCount}）
                </h3>

                <div className="flex items-center p-0.5 rounded-lg bg-slate-100 text-xs">
                  <button
                    type="button"
                    onClick={() => setCommentSort('hot')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      commentSort === 'hot' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    热门
                  </button>
                  <button
                    type="button"
                    onClick={() => setCommentSort('latest')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      commentSort === 'latest' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    最新
                  </button>
                </div>
              </div>

              {sortedComments.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto text-xl shadow-2xs">
                    🛋️
                  </div>
                  <div className="text-sm font-bold text-slate-700">暂无讨论，快来抢沙发</div>
                  <p className="text-xs text-slate-400">分享您对该数据集的使用心得、清洗体验或向发布者反馈吧！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedComments.map(comment => {
                    // 二级回复全部按时间正序排列
                    const sortedReplies = [...(comment.replies || [])].sort((a, b) => {
                      const tA = a.timestamp || 0;
                      const tB = b.timestamp || 0;
                      return tA - tB;
                    });

                    // 智能预览规则：
                    // 仅展示点赞数超过10的二级回复，并按点赞数从高到低排序，最多预览3条
                    const highLikedReplies = [...(comment.replies || [])]
                      .filter(r => (r.likes || 0) > 10)
                      .sort((a, b) => (b.likes || 0) - (a.likes || 0));

                    const previewReplies = highLikedReplies.slice(0, 3);
                    const isExpanded = !!expandedRepliesMap[comment.id];

                    // 二级回复展开后分页展示：每页10条，按时间正序排列
                    const REPLY_PAGE_SIZE = 10;
                    const totalReplies = sortedReplies.length;
                    const replyTotalPages = Math.ceil(totalReplies / REPLY_PAGE_SIZE) || 1;
                    const rawCurrentReplyPage = repliesPageMap[comment.id] || 1;
                    const currentReplyPage = Math.min(Math.max(1, rawCurrentReplyPage), replyTotalPages);

                    const replyStartIndex = (currentReplyPage - 1) * REPLY_PAGE_SIZE;
                    const replyEndIndex = Math.min(replyStartIndex + REPLY_PAGE_SIZE, totalReplies);

                    const visibleReplies = isExpanded 
                      ? sortedReplies.slice(replyStartIndex, replyEndIndex) 
                      : previewReplies;

                    return (
                      <div key={comment.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
                        
                        {/* 一级评论头部与主体 */}
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={comment.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                              alt={comment.userName}
                              className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                            />
                            <div>
                              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                                <span>{comment.userName}</span>
                                {comment.userRole && (
                                  <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 text-[9px] font-bold border border-indigo-100">
                                    {comment.userRole}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-slate-400 font-medium">{comment.time}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 sm:gap-3">
                            {/* 一级评论点赞 */}
                            <button
                              type="button"
                              onClick={() => handleLikeComment(comment.id)}
                              className={`flex items-center gap-1 text-xs font-medium cursor-pointer transition px-2 py-1 rounded-lg hover:bg-white ${
                                comment.isLiked ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                              }`}
                              title="点赞"
                            >
                              <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-500' : ''}`} />
                              <span>{comment.likes || 0}</span>
                            </button>

                            {/* 一级评论回复按钮 */}
                            <button
                              type="button"
                              onClick={() => {
                                if (replyTarget?.commentId === comment.id && !replyTarget?.replyId) {
                                  setReplyTarget(null);
                                } else {
                                  setReplyTarget({
                                    commentId: comment.id,
                                    targetAuthor: comment.userName
                                  });
                                  setReplyInput('');
                                }
                              }}
                              className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
                            >
                              <CornerDownRight className="w-3.5 h-3.5" />
                              <span>回复</span>
                              {comment.replies && comment.replies.length > 0 && (
                                <span className="text-[10px] text-slate-400 font-normal">({comment.replies.length})</span>
                              )}
                            </button>

                            {/* 一级评论删除按钮 */}
                            <button
                              type="button"
                              onClick={() => handleDeleteComment(comment.id)}
                              className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 cursor-pointer transition px-2 py-1 rounded-lg hover:bg-rose-50"
                              title="删除该讨论及其所有回复"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline text-[11px]">删除</span>
                            </button>
                          </div>
                        </div>

                        {/* 一级评论正文 */}
                        <p className="text-xs text-slate-800 leading-relaxed font-normal pl-10">
                          {comment.content}
                        </p>

                        {/* 一级评论附带图片 */}
                        {comment.images && comment.images.length > 0 && (
                          <div className="pl-10 flex flex-wrap gap-2 pt-1">
                            {comment.images.map((img, idx) => (
                              <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                                <img src={img} alt="讨论附图" className="w-full h-full object-cover" />
                              </div>
                            ))}
                          </div>
                        )}

                        {/* 一级评论的行内回复输入框 */}
                        {replyTarget?.commentId === comment.id && !replyTarget?.replyId && (
                          <div className="ml-10 pt-1 animate-fade-in space-y-2">
                            <div className="flex gap-2">
                              <input
                                type="text"
                                autoFocus
                                value={replyInput}
                                onChange={(e) => setReplyInput(e.target.value)}
                                placeholder={`回复 @${comment.userName}（仅限纯文字）...`}
                                className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600 shadow-2xs"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddReply(comment.id, comment.userName);
                                  }
                                }}
                              />
                              <button
                                type="button"
                                onClick={() => handleAddReply(comment.id, comment.userName)}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95 transition"
                              >
                                提交回复
                              </button>
                              <button
                                type="button"
                                onClick={() => setReplyTarget(null)}
                                className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shrink-0 cursor-pointer transition"
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        )}

                        {/* 二级回复区域：智能预览 + 展开分页 */}
                        {comment.replies && comment.replies.length > 0 && (
                          <div className="ml-6 sm:ml-10 space-y-2 pt-2 border-l-2 border-indigo-200/80 pl-3">
                            {visibleReplies.map((rep) => (
                              <div key={rep.id} className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5 text-xs shadow-2xs">
                                <div className="flex items-center justify-between gap-2 flex-wrap">
                                  <div className="flex items-center gap-1.5 flex-wrap">
                                    <span className="text-indigo-400 font-mono font-bold select-none text-xs">└─</span>
                                    <img
                                      src={rep.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                                      alt={rep.userName}
                                      className="w-5 h-5 rounded-full object-cover shrink-0"
                                    />
                                    <span className="font-bold text-slate-900">{rep.userName}</span>
                                    {rep.userRole && (
                                      <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-medium">
                                        {rep.userRole}
                                      </span>
                                    )}
                                    {rep.replyToUser && (
                                      <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                        <span>回复</span>
                                        <strong className="text-indigo-600 font-bold bg-indigo-50 px-1 py-0.2 rounded">
                                          @{rep.replyToUser}
                                        </strong>
                                      </span>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                                    <span className="text-[10px] text-slate-400">{rep.time}</span>

                                    {/* 二级回复点赞 */}
                                    <button
                                      type="button"
                                      onClick={() => handleLikeReply(comment.id, rep.id)}
                                      className={`flex items-center gap-1 text-[11px] font-medium cursor-pointer transition ${
                                        rep.isLiked ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                                      }`}
                                      title="点赞该回复"
                                    >
                                      <ThumbsUp className={`w-3 h-3 ${rep.isLiked ? 'fill-rose-500' : ''}`} />
                                      <span>{rep.likes || 0}</span>
                                    </button>

                                    {/* 二级回复回复按钮 */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (replyTarget?.commentId === comment.id && replyTarget?.replyId === rep.id) {
                                          setReplyTarget(null);
                                        } else {
                                          setReplyTarget({
                                            commentId: comment.id,
                                            targetAuthor: rep.userName,
                                            replyId: rep.id
                                          });
                                          setReplyInput('');
                                        }
                                      }}
                                      className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer"
                                      title="回复该回复"
                                    >
                                      <CornerDownRight className="w-3 h-3" />
                                      <span>回复</span>
                                    </button>

                                    {/* 二级回复删除按钮 */}
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteReply(comment.id, rep.id)}
                                      className="text-slate-400 hover:text-rose-600 cursor-pointer transition p-0.5 rounded hover:bg-rose-50"
                                      title="删除回复"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* 二级回复正文 */}
                                <p className="text-slate-700 leading-relaxed font-normal pl-6 sm:pl-7">
                                  {rep.content}
                                </p>

                                {/* 行内回复输入框（回复该二级回复） */}
                                {replyTarget?.commentId === comment.id && replyTarget?.replyId === rep.id && (
                                  <div className="ml-6 sm:ml-7 pt-2 animate-fade-in space-y-2">
                                    <div className="flex gap-2">
                                      <input
                                        type="text"
                                        autoFocus
                                        value={replyInput}
                                        onChange={(e) => setReplyInput(e.target.value)}
                                        placeholder={`回复 @${rep.userName}（仅限纯文字）...`}
                                        className="flex-1 px-3 py-1.5 bg-slate-50 border border-indigo-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition"
                                        onKeyDown={(e) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddReply(comment.id, rep.userName);
                                          }
                                        }}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => handleAddReply(comment.id, rep.userName)}
                                        className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95 transition"
                                      >
                                        提交回复
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setReplyTarget(null)}
                                        className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shrink-0 cursor-pointer transition"
                                      >
                                        取消
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* 二级回复展开/收起/分页控制栏 */}
                            <div className="pt-1.5">
                              {!isExpanded && (
                                <>
                                  {previewReplies.length > 0 ? (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setExpandedRepliesMap(prev => ({ ...prev, [comment.id]: true }));
                                        setRepliesPageMap(prev => ({ ...prev, [comment.id]: 1 }));
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-indigo-200/90 transition cursor-pointer shadow-2xs group"
                                    >
                                      <span className="font-mono text-indigo-400">└─</span>
                                      <span>展开更多回复（共 {comment.replies.length} 条回复，分页展示）</span>
                                      <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setExpandedRepliesMap(prev => ({ ...prev, [comment.id]: true }));
                                        setRepliesPageMap(prev => ({ ...prev, [comment.id]: 1 }));
                                      }}
                                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition cursor-pointer group"
                                    >
                                      <span className="font-mono text-indigo-400">└─</span>
                                      <span>共 {comment.replies.length} 条回复，点击展开分页查看</span>
                                      <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                    </button>
                                  )}
                                </>
                              )}

                              {isExpanded && (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200/70">
                                  {replyTotalPages > 1 ? (
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      <button
                                        type="button"
                                        disabled={currentReplyPage <= 1}
                                        onClick={() => {
                                          setRepliesPageMap(prev => ({
                                            ...prev,
                                            [comment.id]: Math.max(1, currentReplyPage - 1)
                                          }));
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                      >
                                        <ChevronLeft className="w-3 h-3" />
                                        <span>上一页</span>
                                      </button>

                                      <div className="flex items-center gap-1">
                                        {Array.from({ length: replyTotalPages }, (_, i) => i + 1).map(p => (
                                          <button
                                            key={p}
                                            type="button"
                                            onClick={() => {
                                              setRepliesPageMap(prev => ({ ...prev, [comment.id]: p }));
                                            }}
                                            className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                                              p === currentReplyPage
                                                ? 'bg-indigo-600 text-white shadow-2xs'
                                                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                          >
                                            {p}
                                          </button>
                                        ))}
                                      </div>

                                      <button
                                        type="button"
                                        disabled={currentReplyPage >= replyTotalPages}
                                        onClick={() => {
                                          setRepliesPageMap(prev => ({
                                            ...prev,
                                            [comment.id]: Math.min(replyTotalPages, currentReplyPage + 1)
                                          }));
                                        }}
                                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                      >
                                        <span>下一页</span>
                                        <ChevronRight className="w-3 h-3" />
                                      </button>

                                      <span className="text-[11px] text-slate-400 font-mono ml-1">
                                        第 {currentReplyPage}/{replyTotalPages} 页
                                      </span>
                                    </div>
                                  ) : (
                                    <div className="text-[11px] text-slate-400 font-medium">
                                      已显示全部 {totalReplies} 条二级回复
                                    </div>
                                  )}

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setExpandedRepliesMap(prev => ({ ...prev, [comment.id]: false }));
                                    }}
                                    className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                                  >
                                    <ChevronUp className="w-3.5 h-3.5" />
                                    <span>收起</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              )}

            </div>

          </div>
        );
      })()}

    </div>
  );
};

