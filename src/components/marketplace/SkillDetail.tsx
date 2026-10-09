import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { SkillPluginItem, SkillFileNode, SkillCommentItem, SkillCommentReply } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  ArrowLeft,
  Download,
  Share2,
  Copy,
  Check,
  FileCode,
  FileText,
  FileJson,
  Calendar,
  Eye,
  ThumbsUp,
  User,
  Send,
  Search,
  ExternalLink,
  Code2,
  ShieldCheck,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  CornerDownRight,
  Trash2,
  Folder,
  FolderOpen,
  File,
  Sparkles,
  ArrowUp,
  X,
  Shield,
  Puzzle,
  CheckCircle2,
  XCircle,
  Clock,
  Terminal,
  Layers,
  Award,
  MessageSquare
} from 'lucide-react';
import { validateTextOnlyComment } from '../../utils/commentValidator';

interface SkillDetailProps {
  skill: SkillPluginItem;
  onBack: () => void;
  initialTab?: 'overview' | 'files' | 'comments';
  fromTitle?: string;
}

export const SkillDetail: React.FC<SkillDetailProps> = ({ skill, onBack, initialTab = 'overview', fromTitle }) => {
  const effectiveFromTitle = fromTitle || '插件市场';
  const { showToast, downloadSkill, user } = useApp();

  // Active Tab: overview | files | comments
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'comments'>(initialTab);

  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Files Tab State
  const filesList: SkillFileNode[] = skill.files && skill.files.length > 0 ? skill.files : [
    {
      id: 'f_def_readme',
      name: 'README.md',
      path: '/README.md',
      size: '4.3 KB',
      type: 'file',
      language: 'markdown',
      content: `# ${skill.name}\n\n${skill.description}\n\n## 适用场景\n${skill.compatibleAgents}`
    },
    {
      id: 'f_def_skill',
      name: 'SKILL.md',
      path: '/SKILL.md',
      size: '22.5 KB',
      type: 'file',
      language: 'markdown',
      content: `# ${skill.name} Protocol Specification\n\n版本: ${skill.version}\n开发者: ${skill.developer}`
    },
    {
      id: 'f_def_req',
      name: 'requirements.txt',
      path: '/requirements.txt',
      size: '387 B',
      type: 'file',
      language: 'text',
      content: `python>=3.10\nrequests>=2.31.0\npydantic>=2.0.0`
    }
  ];

  // Helper to count total files in tree recursively
  const countAllFiles = (nodes: SkillFileNode[]): number => {
    let count = 0;
    nodes.forEach(node => {
      if (node.type === 'file') {
        count += 1;
      } else if (node.children) {
        count += countAllFiles(node.children);
      }
    });
    return count;
  };

  const totalFilesCount = countAllFiles(filesList);

  // Helper to find first file in tree for initial selection
  const findFirstFile = (nodes: SkillFileNode[]): SkillFileNode | null => {
    for (const node of nodes) {
      if (node.type === 'file') return node;
      if (node.children) {
        const found = findFirstFile(node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const [selectedFile, setSelectedFile] = useState<SkillFileNode | null>(findFirstFile(filesList));
  const [openFolders, setOpenFolders] = useState<Record<string, boolean>>({
    '/modules': true,
    '/references': true,
    '/scripts': true
  });
  const [copiedFileCode, setCopiedFileCode] = useState(false);

  // Comments Tab State
  const initialSkillComments: SkillCommentItem[] = (skill.comments && skill.comments.length > 0) ? skill.comments : [
    {
      id: 'c_val_1',
      userName: '量化研报老兵',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      userRole: '持牌证券投顾',
      rating: 5,
      time: '3天前',
      timestamp: Date.now() - 259200000,
      content: '非常扎实的价值投资方法论框架！护城河五步检验法与 DCF 的结合逻辑很顺畅，生成的研究报告可读性极高。建议后续可以接入实时行情数据源做动态折现。',
      likes: 26,
      isLiked: true,
      replies: [
        {
          id: 'c_val_r1',
          userName: skill.authorSignature || skill.developer || 'Skill开发者',
          userAvatar: skill.developerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
          userRole: '作者 (Skill 开发者)',
          time: '2天前',
          timestamp: Date.now() - 172800000,
          content: '感谢认可！下个版本计划集成免费的 Tushare / AKShare 行情接口，支持自动回填过去 5 年的 FCF 与 ROIC 历史序列。',
          likes: 19,
          isLiked: true
        },
        {
          id: 'c_val_r2',
          userName: 'Python高频客',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          userRole: '量化开发者',
          time: '1天前',
          timestamp: Date.now() - 86400000,
          content: '在本地挂载测试了，回测耗时从 4.2s 降到了 0.8s，装饰器封装得非常优雅！',
          likes: 14,
          isLiked: false
        },
        {
          id: 'c_val_r3',
          userName: '量化研报老兵',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          userRole: '持牌证券投顾',
          replyToUser: 'Python高频客',
          time: '20小时前',
          timestamp: Date.now() - 72000000,
          content: '你配置了本地 Redis 缓存吗？多轮对话中上下文 token 消耗如何？',
          likes: 5,
          isLiked: false
        },
        {
          id: 'c_val_r4',
          userName: 'Python高频客',
          userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
          userRole: '量化开发者',
          replyToUser: '量化研报老兵',
          time: '16小时前',
          timestamp: Date.now() - 57600000,
          content: '挂了本地内存缓存，基本只消耗首次提取财务指标的 tokens，后续分析零重复消耗。',
          likes: 8,
          isLiked: false
        }
      ]
    },
    {
      id: 'c_val_2',
      userName: 'AlphaResearcher',
      userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
      userRole: '私募研究员',
      rating: 5,
      time: '1周前',
      timestamp: Date.now() - 604800000,
      content: '在 Agent 平台直接挂载这个 Skill 之后，帮我每天自动扫描高股息板块的财务健康度和护城河评级，效率提升极大！',
      likes: 12,
      isLiked: false,
      replies: [
        {
          id: 'c_val_r5',
          userName: '开源极客',
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          userRole: '开发者',
          time: '5天前',
          timestamp: Date.now() - 432000000,
          content: '赞同，配合定时触发器自动跑日报简直无敌。',
          likes: 11,
          isLiked: false
        }
      ]
    }
  ];

  const [commentSort, setCommentSort] = useState<'hot' | 'latest'>('hot');
  const [commentInput, setCommentInput] = useState('');
  const [comments, setComments] = useState<SkillCommentItem[]>(initialSkillComments);
  const [replyTarget, setReplyTarget] = useState<{ commentId: string; targetAuthor: string; replyId?: string } | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [expandedRepliesMap, setExpandedRepliesMap] = useState<Record<string, boolean>>({});
  const [repliesPageMap, setRepliesPageMap] = useState<Record<string, number>>({});

  // 全量评论条数（一级评论 + 所有二级回复）
  const totalCommentsCount = comments.reduce(
    (acc, c) => acc + 1 + (c.replies ? c.replies.length : 0),
    0
  );

  const handleShare = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    showToast('已复制 Skill 分享链接至剪贴板');
  };

  const handleDownload = () => {
    downloadSkill(skill);
  };

  const handleCopyText = (text: string, identifier: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCmd(identifier);
    showToast(`已复制命令: ${text}`);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleToggleFolder = (path: string) => {
    setOpenFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };

  const handleSelectFile = (file: SkillFileNode) => {
    if (file.type === 'file') {
      setSelectedFile(file);
    }
  };

  const handleJumpToFile = (docPath: string) => {
    setActiveTab('files');
    // Find file in tree by path or name
    const findFileByPath = (nodes: SkillFileNode[]): SkillFileNode | null => {
      for (const node of nodes) {
        if (node.path.endsWith(docPath) || node.path.includes(docPath.replace('modules/', ''))) {
          return node;
        }
        if (node.children) {
          const found = findFileByPath(node.children);
          if (found) return found;
        }
      }
      return null;
    };

    const target = findFileByPath(filesList);
    if (target) {
      setSelectedFile(target);
      showToast(`已跳转并打开文件: ${target.name}`);
    }
  };

  // 添加一级评论（严格纯文字规范：仅限文字，禁止表情和图片）
  const handleAddComment = () => {
    const textToSubmit = commentInput.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message || '请输入评论内容');
      return;
    }

    const newComment: SkillCommentItem = {
      id: 'c_' + Date.now() + '_' + Math.random().toString(36).slice(2, 6),
      userName: user.name || '当前用户',
      userAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      userRole: user.identityTag || '开发者',
      rating: 5,
      time: '刚刚',
      timestamp: Date.now(),
      content: textToSubmit,
      likes: 0,
      isLiked: false,
      replies: []
    };

    setComments([newComment, ...comments]);
    setCommentInput('');
    showToast('评论发表成功！已展示在顶部');
  };

  // 添加二级回复（严格纯文字规范：仅限文字，禁止表情）
  const handleAddReply = (commentId: string, targetAuthor: string) => {
    const textToSubmit = replyInput.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message?.replace('评论', '回复') || '请输入回复内容');
      return;
    }

    const newReply: SkillCommentReply = {
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
    setComments(prev => prev.map(c => {
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

    // 自动展开二级回复并跳转到新回复所在页
    setExpandedRepliesMap(prev => ({ ...prev, [commentId]: true }));
    setRepliesPageMap(prev => ({ ...prev, [commentId]: targetPage }));

    setReplyInput('');
    setReplyTarget(null);
    showToast('回复成功！');
  };

  // 一级评论点赞/取消赞
  const handleToggleCommentLike = (commentId: string) => {
    setComments(list => list.map(c => {
      if (c.id === commentId) {
        const isLiked = !c.isLiked;
        const likes = isLiked ? (c.likes || 0) + 1 : Math.max(0, (c.likes || 0) - 1);
        return { ...c, isLiked, likes };
      }
      return c;
    }));
  };

  // 二级回复点赞/取消赞
  const handleToggleReplyLike = (commentId: string, replyId: string) => {
    setComments(list => list.map(c => {
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

  // 删除一级评论
  const handleDeleteComment = (commentId: string) => {
    if (window.confirm('确定要删除该评论吗？其名下的所有二级回复也将一并移除。')) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      showToast('评论及名下回复已成功删除');
    }
  };

  // 删除二级回复
  const handleDeleteReply = (commentId: string, replyId: string) => {
    if (window.confirm('确定要删除该条二级回复吗？')) {
      setComments(prev => prev.map(c => {
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

  // Render File Tree Node
  const renderFileNode = (node: SkillFileNode, depth = 0) => {
    if (node.type === 'folder') {
      const isOpen = !!openFolders[node.path];
      return (
        <div key={node.id} className="select-none">
          <div
            onClick={() => handleToggleFolder(node.path)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 text-xs text-slate-800 font-medium cursor-pointer transition"
            style={{ paddingLeft: `${depth * 16 + 12}px` }}
          >
            {isOpen ? (
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            )}
            <Folder className="w-4 h-4 text-blue-500 shrink-0" />
            <span className="font-mono">{node.name}</span>
          </div>

          {isOpen && node.children && (
            <div className="space-y-0.5">
              {node.children.map(child => renderFileNode(child, depth + 1))}
            </div>
          )}
        </div>
      );
    }

    // File item
    const isSelected = selectedFile?.id === node.id;
    return (
      <div
        key={node.id}
        onClick={() => handleSelectFile(node)}
        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs cursor-pointer transition select-none ${
          isSelected
            ? 'bg-blue-50/80 text-blue-700 font-semibold border-l-2 border-blue-600'
            : 'hover:bg-slate-50 text-slate-700 font-medium'
        }`}
        style={{ paddingLeft: `${depth * 16 + 16}px` }}
      >
        <div className="flex items-center gap-2 min-w-0">
          <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
          <span className="font-mono truncate">{node.name}</span>
        </div>
        <span className="text-[11px] text-slate-400 font-mono ml-2 shrink-0">{node.size}</span>
      </div>
    );
  };

  return (
    <div className="w-full space-y-6 select-none animate-fade-in pb-20 max-w-6xl mx-auto">
      
      {/* 1. Header Area (Matching skill详情-概述.png exactly) */}
      <div className="space-y-4">
        
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium transition cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>返回{effectiveFromTitle}</span>
        </button>

        {/* Top Info Card */}
        <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
          
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            
            {/* Left: Icon, Title, Repo, Ratings, Description */}
            <div className="flex items-start gap-4 flex-1">
              
              {/* Skill Icon */}
              <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shadow-xs shrink-0">
                <div className="w-7 h-7 rounded-full border-4 border-amber-600 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-amber-600" />
                </div>
              </div>

              {/* Title & Meta Info */}
              <div className="space-y-1.5 flex-1 min-w-0">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">
                  {skill.name}
                </h1>
                
                <div className="text-xs font-mono text-slate-500">
                  {skill.repoPath || `@user_a38fd8a2/${skill.id}`}
                </div>
              </div>

            </div>

            {/* Right: Actions (分享, 下载) */}
            <div className="flex items-center gap-2.5 shrink-0 self-start">
              <button
                onClick={handleShare}
                className="px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5 text-slate-500" />
                <span>分享</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 Skill 包</span>
              </button>
            </div>

          </div>

          {/* Description Paragraph */}
          <p className="text-xs text-slate-600 leading-relaxed font-normal pt-1">
            {skill.description}
          </p>

          {/* Tags row */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {skill.tags?.map((tag, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-full bg-slate-50 border border-slate-200 text-slate-600 text-[11px] font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

        </div>

      </div>

      {/* 2. Navigation Tabs */}
      <div className="flex items-center gap-8 border-b border-slate-200 text-sm font-medium px-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 relative transition cursor-pointer ${
            activeTab === 'overview'
              ? 'text-slate-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>概述</span>
          {activeTab === 'overview' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('files')}
          className={`pb-3 relative transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'files'
              ? 'text-slate-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>文件</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
            {totalFilesCount}
          </span>
          {activeTab === 'files' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
          )}
        </button>

        <button
          onClick={() => setActiveTab('comments')}
          className={`pb-3 relative transition cursor-pointer flex items-center gap-1.5 ${
            activeTab === 'comments'
              ? 'text-slate-900 font-black'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          <span>评论</span>
          <span className="px-1.5 py-0.2 rounded-full bg-slate-100 text-slate-600 text-[10px] font-mono">
            {totalCommentsCount}
          </span>
          {activeTab === 'comments' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-900 rounded-full" />
          )}
        </button>
      </div>

      {/* 3. TAB CONTENT AREA */}

      {/* 3.1 TAB: 概述 (Overview) - Exact match to skill详情-概述.png */}
      {activeTab === 'overview' && (
        <div className="space-y-8 bg-white p-8 rounded-2xl border border-slate-200/80 shadow-2xs">
          {skill.overviewMarkdown ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 pb-4">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {skill.name} ({skill.id.replace('sk_', '')})
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  版本: {skill.version} · 更新时间: {skill.updatedAt || '最近'} · 开发者: {skill.developer}
                </p>
              </div>

              <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-800 leading-relaxed font-normal">
                <Markdown>{skill.overviewMarkdown}</Markdown>
              </div>
            </div>
          ) : (
            <>
              {/* Main Title Header */}
              <div className="space-y-1">
                <h2 className="text-xl font-black text-slate-900 tracking-tight">
                  {skill.name} ({skill.id.replace('sk_', '')})
                </h2>
              </div>

          {/* Section: 知识产权声明 */}
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-slate-900">知识产权声明</h3>
            <p className="text-xs text-slate-600">
              {skill.copyrightNotice || `本技能及相关文档、脚本代码的著作权归${skill.developer}所有。`}
            </p>
          </div>

          {/* Section: 使用许可 */}
          <div className="space-y-2.5">
            <h3 className="text-sm font-bold text-slate-900">使用许可:</h3>
            <div className="space-y-1.5 text-xs text-slate-700">
              {skill.licenseTerms ? (
                <>
                  {skill.licenseTerms.allowed.map((item, idx) => (
                    <div key={'allow_' + idx} className="flex items-center gap-2 text-slate-700">
                      <span className="text-emerald-600 font-bold">✔</span>
                      <span>{item}</span>
                    </div>
                  ))}
                  {skill.licenseTerms.forbidden.map((item, idx) => (
                    <div key={'forbid_' + idx} className="flex items-center gap-2 text-slate-700">
                      <span className="text-rose-600 font-bold">✖</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>允许个人学习、研究、非商业用途使用</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-emerald-600 font-bold">✔</span>
                    <span>允许修改后个人使用</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>禁止直接复制核心算法用于商业产品或竞争性服务</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>禁止移除或修改作者署名后重新分发</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="text-rose-600 font-bold">✖</span>
                    <span>禁止将本技能包装成独立产品对外销售</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Section: 免责声明 */}
          <div className="space-y-2">
            <p className="text-xs text-slate-700">
              <strong className="text-slate-900">免责声明：</strong>
              {skill.disclaimer || '本技能提供的分析结果仅供参考，不构成投资建议。使用者应自行判断并承担投资风险。'}
            </p>
          </div>

          {/* Section: 作者与方法论背景 */}
          <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-700 leading-relaxed">
            <p>
              {skill.authorBio || `基于《股市真规则》（The Five Rules for Successful Stock Investing）的完整投资分析框架，由晨星公司首席股票分析师帕特·多尔西(Pat Dorsey)方法论构建。`}
            </p>
            <p className="font-bold text-slate-900">
              作者：{skill.authorSignature || skill.developer}
            </p>
          </div>

          {/* Section: 依赖技能表格 */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">依赖技能</h3>
            <p className="text-xs text-slate-500">本技能依赖以下技能，请确保已安装：</p>
            
            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-4 w-1/4">依赖技能</th>
                    <th className="py-2.5 px-4 w-1/2">用途</th>
                    <th className="py-2.5 px-4 w-1/4">安装命令</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                  {(skill.dependencies || [
                    {
                      name: 'pdf-parser',
                      purpose: '提取财报PDF中的财务数据',
                      installCmd: 'clawhub install pdf-parser'
                    }
                  ]).map((dep, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-mono font-bold text-slate-900">{dep.name}</td>
                      <td className="py-2.5 px-4">{dep.purpose}</td>
                      <td className="py-2.5 px-4">
                        <div className="flex items-center justify-between bg-purple-50/70 text-purple-700 px-2.5 py-1 rounded-md font-mono text-[11px] border border-purple-100">
                          <span>{dep.installCmd}</span>
                          <button
                            onClick={() => handleCopyText(dep.installCmd, 'dep_' + idx)}
                            className="text-purple-600 hover:text-purple-900 ml-2"
                            title="复制命令"
                          >
                            {copiedCmd === 'dep_' + idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: 系统架构 (ASCII Box Diagram) */}
          <div className="space-y-3 pt-2">
            <h3 className="text-sm font-bold text-slate-900">系统架构</h3>
            
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 overflow-x-auto leading-tight shadow-inner">
              <pre>{skill.systemArchAscii || `+-------------------------------------------------------------------------+
|                           投资决策整合框架                                |
|                 modules/investment_decision_framework.md                |
+-------------------------------------------------------------------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                |                                |
    v                                v                                v
+------------------+     +------------------+     +------------------+
|    护城河分析    |     |     财务分析     |     |    管理层评估    |
|       模块       |     |       模块       |     |       模块       |
|      (Moat)      |     |    (Financial)   |     |   (Management)   |
+------------------+     +------------------+     +------------------+
                                     |
                                     v
                         +----------------------+
                         |       行业分析       |
                         |         模块         |
                         |      (Industry)      |
                         +----------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                              工具层 (Tools)                             |
|  - DCF计算器        - 估值快照           - 同业对比                     |
|  - Watchlist管理    - 财务健康检查       - 护城河检查清单               |
+-------------------------------------------------------------------------+`}</pre>
            </div>
          </div>

          {/* Section: 核心模块表格 */}
          <div className="space-y-3 pt-2">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">核心模块</h3>
              <p className="text-xs text-slate-500">
                {skill.backgroundDesc || '价值投资导向的股票估值分析工具集，专为长期持有、商业模式优先、估值合理的投资风格设计。'}
              </p>
            </div>

            <div className="overflow-hidden rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-bold">
                  <tr>
                    <th className="py-2.5 px-4 w-1/4">模块</th>
                    <th className="py-2.5 px-4 w-1/2">功能</th>
                    <th className="py-2.5 px-4 w-1/4">文档路径</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-normal">
                  {(skill.coreModules || [
                    {
                      name: '护城河分析',
                      functionDesc: '五步检验法识别可持续竞争优势',
                      docPath: 'modules/moat_analysis.md'
                    },
                    {
                      name: '财务分析',
                      functionDesc: '六步财务健康检查与会计质量评估',
                      docPath: 'modules/financial_analysis.md'
                    },
                    {
                      name: '管理层评估',
                      functionDesc: '三维评估框架（能力/诚信/股东导向）',
                      docPath: 'modules/management_evaluation.md'
                    },
                    {
                      name: '行业分析',
                      functionDesc: '生命周期定位与行业特定指标',
                      docPath: 'modules/industry_analysis.md'
                    }
                  ]).map((mod, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-2.5 px-4 font-bold text-slate-900">{mod.name}</td>
                      <td className="py-2.5 px-4 text-slate-600">{mod.functionDesc}</td>
                      <td className="py-2.5 px-4">
                        <button
                          onClick={() => handleJumpToFile(mod.docPath)}
                          className="font-mono text-purple-600 hover:text-purple-800 hover:underline bg-purple-50/50 px-2 py-0.5 rounded text-[11px] text-left cursor-pointer"
                        >
                          {mod.docPath}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          </>
        )}

        </div>
      )}

      {/* 3.2 TAB: 文件 (Files Tree & Preview) - Exact match to skill详情-文件.png */}
      {activeTab === 'files' && (
        <div className="space-y-4">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* Left: File Tree Explorer (4 Columns) */}
            <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
              
              {/* Header: Total Files Count */}
              <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-700 flex items-center justify-between">
                <span>共 {totalFilesCount} 个文件</span>
                <span className="text-[11px] text-slate-400 font-mono">/root</span>
              </div>

              {/* Tree list */}
              <div className="p-2 space-y-0.5 max-h-[540px] overflow-y-auto">
                {filesList.map(node => renderFileNode(node, 0))}
              </div>

            </div>

            {/* Right: File Content Previewer (8 Columns) */}
            <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col min-h-[480px]">
              
              {selectedFile ? (
                <>
                  {/* File preview header toolbar */}
                  <div className="p-3.5 bg-slate-50/80 border-b border-slate-200 flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 min-w-0">
                      <FileCode className="w-4 h-4 text-indigo-600 shrink-0" />
                      <span className="font-mono font-bold text-slate-800 truncate">
                        {selectedFile.path}
                      </span>
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-mono text-[10px]">
                        {selectedFile.size}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(selectedFile.content || '');
                          setCopiedFileCode(true);
                          showToast(`已复制文件【${selectedFile.name}】源码`);
                          setTimeout(() => setCopiedFileCode(false), 2000);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-medium flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      >
                        {copiedFileCode ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-600">已复制</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>复制代码</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => showToast(`已下载文件【${selectedFile.name}】`)}
                        className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition shadow-2xs cursor-pointer"
                        title="下载此文件"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* File preview content area */}
                  <div className="p-5 font-mono text-xs text-slate-800 overflow-x-auto leading-relaxed flex-1 bg-white">
                    <pre className="whitespace-pre font-mono">
                      {selectedFile.content || '// 文件为空或暂无文本内容'}
                    </pre>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 text-slate-300" />
                  <p className="text-xs">请在左侧文件树中点击任意文件进行在线预览</p>
                </div>
              )}

            </div>

          </div>

        </div>
      )}

      {/* 3.3 TAB: 评论 (Comments) */}
      {activeTab === 'comments' && (() => {
        // 一级评论排序
        const sortedComments = [...comments].sort((a, b) => {
          if (commentSort === 'hot') {
            const aScore = (a.likes || 0) * 2 + (a.replies ? a.replies.length * 3 : 0);
            const bScore = (b.likes || 0) * 2 + (b.replies ? b.replies.length * 3 : 0);
            return bScore - aScore;
          }
          return (b.timestamp || 0) - (a.timestamp || 0);
        });

        return (
          <div className="space-y-6">
            
            {/* Top: Comment Input Box Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                  <MessageSquare className="w-4 h-4 text-indigo-600" />
                  <span>与 {skill.authorSignature || skill.developer} 一起讨论这个 Skill</span>
                </div>
                <span className="font-mono text-slate-400">{commentInput.length}/500</span>
              </div>

              {/* Textarea */}
              <textarea
                value={commentInput}
                onChange={e => setCommentInput(e.target.value.slice(0, 500))}
                placeholder="分享您对该 Skill 插件的使用心得、优化建议或向作者提问（最多500字，仅限纯文字）..."
                rows={3}
                className="w-full p-3.5 rounded-xl bg-slate-50/50 border border-slate-200 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-indigo-500 transition resize-none leading-relaxed"
              />

              {/* Bottom tools: Text-only hint & Submit Button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>遵循公约 · 仅限纯文字评论（禁止表情与图片） · 自动安全审核</span>
                </div>

                {/* Submit Button */}
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>发表评论</span>
                </button>
              </div>

            </div>

            {/* Bottom: Comments List Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-6">
              
              {/* Header: Title & Hot/Latest Filter */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-sm font-bold text-slate-900">
                  全部评论（{totalCommentsCount}）
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

              {/* List */}
              {sortedComments.length === 0 ? (
                <div className="py-16 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto text-xl shadow-2xs">
                    🛋️
                  </div>
                  <div className="text-sm font-bold text-slate-700">暂无评论，快来抢沙发</div>
                  <p className="text-xs text-slate-400">分享您对该 Skill 的使用心得或向作者反馈吧！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sortedComments.map(comment => {
                    // 二级回复按时间正序排列
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
                              onClick={() => handleToggleCommentLike(comment.id)}
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
                              title="删除该评论及其所有回复"
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
                                <img src={img} alt="评论附图" className="w-full h-full object-cover" />
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
                                      onClick={() => handleToggleReplyLike(comment.id, rep.id)}
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
