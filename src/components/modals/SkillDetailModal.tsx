import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { SkillPluginItem, SkillFileNode, SkillCommentItem, SkillCommentReply } from '../../types';
import { useApp } from '../../context/AppContext';
import {
  X,
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
  CornerDownRight,
  Folder,
  FolderOpen,
  File,
  Sparkles,
  Shield,
  Puzzle,
  CheckCircle2,
  Terminal,
  Layers,
  Award,
  MessageSquare
} from 'lucide-react';
import { validateTextOnlyComment } from '../../utils/commentValidator';

interface SkillDetailModalProps {
  skill: SkillPluginItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const SkillDetailModal: React.FC<SkillDetailModalProps> = ({ skill, isOpen, onClose }) => {
  const { showToast, downloadSkill, user } = useApp();

  // Active Tab: overview | files | comments
  const [activeTab, setActiveTab] = useState<'overview' | 'files' | 'comments'>('overview');
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  // Files Tab State
  const filesList: SkillFileNode[] = skill?.files && skill.files.length > 0 ? skill.files : [
    {
      id: 'f_def_readme',
      name: 'README.md',
      path: '/README.md',
      size: '4.3 KB',
      type: 'file',
      language: 'markdown',
      content: `# ${skill?.name || 'Skill Plugin'}\n\n${skill?.description || '标准 Tool 规范插件'}\n\n## 适用场景\n${skill?.compatibleAgents || '所有大模型智能体与自动化流'}`
    },
    {
      id: 'f_def_skill',
      name: 'SKILL.md',
      path: '/SKILL.md',
      size: '22.5 KB',
      type: 'file',
      language: 'markdown',
      content: `# ${skill?.name || 'Skill'} Protocol Specification\n\n版本: ${skill?.version || '1.0.0'}\n开发者: ${skill?.developer || '社区开发者'}\n\n\`\`\`json\n{\n  "name": "${skill?.id || 'tool_func'}",\n  "description": "${skill?.description || '功能描述'}",\n  "parameters": {\n    "type": "object",\n    "properties": {\n      "query": { "type": "string", "description": "输入参数" }\n    }\n  }\n}\n\`\`\``
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

  const [selectedFile, setSelectedFile] = useState<SkillFileNode | null>(filesList[0] || null);
  const [copiedFileCode, setCopiedFileCode] = useState(false);

  // Comments Tab State
  const [commentsList, setCommentsList] = useState<SkillCommentItem[]>(() =>
    skill?.comments && skill.comments.length > 0 ? skill.comments : [
      {
        id: 'c_val_1',
        userName: '量化研报老兵',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        userRole: '持牌证券投顾',
        rating: 5,
        time: '3天前',
        timestamp: Date.now() - 259200000,
        content: '非常扎实的价值投资方法论框架！护城河五步检验法与 DCF 的结合逻辑很顺畅，生成的研究报告可读性极高。',
        likes: 26,
        isLiked: true,
        replies: [
          {
            id: 'c_val_r1',
            userName: skill?.authorSignature || skill?.developer || 'Skill开发者',
            userAvatar: skill?.developerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            userRole: '作者 (Skill 开发者)',
            time: '2天前',
            timestamp: Date.now() - 172800000,
            content: '感谢认可！下个版本计划集成更多动态参数与历史指标序列。',
            likes: 19,
            isLiked: true
          }
        ]
      },
      {
        id: 'c_val_2',
        userName: 'Python高频客',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        userRole: '量化开发者',
        rating: 5,
        time: '1天前',
        timestamp: Date.now() - 86400000,
        content: '在本地挂载测试了，回测耗时从 4.2s 降到了 0.8s，装饰器封装得非常优雅！',
        likes: 14,
        isLiked: false
      }
    ]
  );

  const [newCommentText, setNewCommentText] = useState('');
  const [replyTarget, setReplyTarget] = useState<{ commentId: string; targetAuthor: string } | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // Sync state on skill change
  React.useEffect(() => {
    if (skill) {
      if (skill.comments && skill.comments.length > 0) {
        setCommentsList(skill.comments);
      }
      if (skill.files && skill.files.length > 0) {
        setSelectedFile(skill.files[0]);
      }
    }
  }, [skill]);

  if (!isOpen || !skill) return null;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('已复制插件公开分享链接到剪贴板！');
    } else {
      showToast('已生成插件分享链接！');
    }
  };

  const handleCopyCommand = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    showToast(`已复制命令：${cmd}`);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  const handleAddComment = () => {
    const textToSubmit = newCommentText.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message || '请输入讨论内容');
      return;
    }

    const newComment: SkillCommentItem = {
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      userName: user.name || '平台开发者',
      userAvatar: user.avatar || '',
      userRole: user.identityTag || '开发者',
      rating: 5,
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

    const newReply: SkillCommentReply = {
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

  const installCmd = `claw-cli install ${skill.id}`;

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
        <div className="p-6 bg-gradient-to-r from-cyan-50/60 via-blue-50/40 to-white border-b border-slate-200/80">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4 min-w-0">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 shrink-0 text-2xl font-black">
                {skill.icon && skill.icon.length <= 4 ? skill.icon : '⚡'}
              </div>
              <div className="min-w-0 space-y-1.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight truncate">
                    {skill.name}
                  </h2>
                  {skill.isOfficial && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-blue-600" />
                      <span>官方认证</span>
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-200">
                    {skill.category || '功能插件'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    v{skill.version || '1.0.0'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {skill.description || '标准 Tool 规范，赋能任意智能体一键解析与高效执行任务。'}
                </p>

                <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-0.5">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span>开发者: {skill.developer || '平台官方'}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    <span>调用量: {(skill.downloadsCount || skill.installs || 1580).toLocaleString()} 次</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    <span>开源协议: {skill.license || 'Apache-2.0'}</span>
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

          {/* Navigation Tabs (与 AI 集市 SkillDetail 保持完全一致) */}
          <div className="flex items-center gap-2 mt-5 -mb-6 border-b border-slate-200">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-3 text-xs font-bold transition relative cursor-pointer ${
                activeTab === 'overview'
                  ? 'text-cyan-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>概览说明</span>
              {activeTab === 'overview' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('files')}
              className={`pb-3 px-3 text-xs font-bold transition relative cursor-pointer ${
                activeTab === 'files'
                  ? 'text-cyan-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>文件与源码 ({filesList.length})</span>
              {activeTab === 'files' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
              )}
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`pb-3 px-3 text-xs font-bold transition relative cursor-pointer ${
                activeTab === 'comments'
                  ? 'text-cyan-600'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>讨论与评价 ({commentsList.length})</span>
              {activeTab === 'comments' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-cyan-600 rounded-full" />
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
                  <div className="text-[10px] text-slate-400 font-bold uppercase">插件分类</div>
                  <div className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1">
                    <Puzzle className="w-4 h-4 text-cyan-600" />
                    <span>{skill.category || '功能插件'}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">协议版本</div>
                  <div className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1 font-mono">
                    <Code2 className="w-4 h-4 text-blue-600" />
                    <span>v{skill.version || '1.0.0'}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">适用智能体</div>
                  <div className="text-sm font-black text-slate-800 mt-1 flex items-center gap-1 truncate">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span className="truncate">{skill.compatibleAgents || '全系通用'}</span>
                  </div>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-[10px] text-slate-400 font-bold uppercase">开源商用</div>
                  <div className="text-sm font-black text-emerald-600 mt-1 flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>免费开源</span>
                  </div>
                </div>
              </div>

              {/* 一键接入指令 */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-cyan-600" />
                  <span>CLI 安装与智能体快速挂载命令</span>
                </div>
                <div className="p-3 bg-slate-900 rounded-xl flex items-center justify-between font-mono text-xs text-cyan-400 shadow-inner">
                  <span>{installCmd}</span>
                  <button
                    onClick={() => handleCopyCommand(installCmd)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                  >
                    {copiedCmd === installCmd ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCmd === installCmd ? '已复制' : '复制'}</span>
                  </button>
                </div>
              </div>

              {/* 插件详细描述 */}
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-cyan-600" />
                  <span>插件协议与功能说明</span>
                </h3>
                <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-xs text-slate-700 leading-relaxed space-y-3">
                  <div className="prose prose-slate max-w-none text-xs leading-relaxed">
                    <Markdown>{skill.description || '赋能智能体一键调用的标准 Function/Tool 插件。'}</Markdown>
                  </div>
                </div>
              </div>

              {/* 权限与沙箱声明 */}
              <div className="p-4 rounded-2xl bg-cyan-50/60 border border-cyan-200/80 flex items-start gap-3">
                <Shield className="w-5 h-5 text-cyan-600 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-cyan-900">
                  <div className="font-bold">安全执行与环境沙箱隔离</div>
                  <div className="text-[11px] leading-relaxed text-cyan-800">
                    此插件经由平台安全扫描与网络策略校验，可在受限沙箱中无缝接入 Agent 工作流，支持声明式入参校验与幂等性重试机制。
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 文件与源码 */}
          {activeTab === 'files' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-700">浏览文件:</span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {filesList.map((f) => (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFile(f)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                        selectedFile?.id === f.id
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      }`}
                    >
                      <FileCode className="w-3.5 h-3.5" />
                      <span>{f.name}</span>
                      <span className="text-[10px] opacity-80">({f.size})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 代码展示 */}
              <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden shadow-xl">
                <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs text-slate-300">
                  <div className="font-mono flex items-center gap-2">
                    <span className="text-cyan-400 font-bold">{selectedFile?.name}</span>
                    <span className="text-[10px] text-slate-500">· 语言: {selectedFile?.language || 'markdown'}</span>
                  </div>
                  <button
                    onClick={() => {
                      if (selectedFile?.content) {
                        navigator.clipboard.writeText(selectedFile.content);
                        setCopiedFileCode(true);
                        showToast(`已复制代码文件: ${selectedFile.name}`);
                        setTimeout(() => setCopiedFileCode(false), 2000);
                      }
                    }}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                  >
                    {copiedFileCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedFileCode ? '已复制' : '复制内容'}</span>
                  </button>
                </div>

                <pre className="p-4 text-slate-200 font-mono text-[11px] overflow-x-auto leading-relaxed max-h-[380px] select-text">
                  <code>{selectedFile?.content || '# No content available'}</code>
                </pre>
              </div>
            </div>
          )}

          {/* TAB 3: 评价与讨论 */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              {/* 发表讨论表单 */}
              <div className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-cyan-600" />
                    <span>发表插件调用体验与技术建议</span>
                  </h4>
                  <span className="text-[10px] text-slate-400">仅限纯文字 · 严禁图片表情</span>
                </div>

                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="分享您在智能体开发或集成中调用此 Skill 的测试效果、参数设计或优化建议..."
                  rows={3}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 resize-none transition"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">
                    发布账号: <strong className="text-slate-700">{user?.name || '平台开发者'}</strong>
                  </span>
                  <button
                    onClick={handleAddComment}
                    className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>发表讨论</span>
                  </button>
                </div>
              </div>

              {/* 评论列表 */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900">全部讨论反馈 ({commentsList.length})</h4>
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
                                <span className="text-[9px] font-bold px-1.5 py-0.2 bg-cyan-50 text-cyan-700 border border-cyan-100 rounded">
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
                            c.isLiked ? 'bg-cyan-50 text-cyan-600 border border-cyan-200' : 'bg-white text-slate-500 hover:text-slate-800 border border-slate-200'
                          }`}
                        >
                          <ThumbsUp className="w-3 h-3" />
                          <span>{c.likes || 0}</span>
                        </button>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed font-normal pl-9">
                        {c.content}
                      </p>

                      {/* 二级回复 */}
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

                      {/* 回复入口 */}
                      <div className="pl-9 flex items-center justify-between">
                        {replyTarget?.commentId === c.id ? (
                          <div className="w-full space-y-2 mt-2">
                            <input
                              type="text"
                              value={replyInput}
                              onChange={(e) => setReplyInput(e.target.value)}
                              placeholder={`回复 @${c.userName}...`}
                              className="w-full p-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 outline-none focus:border-cyan-500"
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
                                className="px-3 py-1 rounded-lg bg-cyan-600 text-white text-xs font-bold hover:bg-cyan-500"
                              >
                                发送回复
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setReplyTarget({ commentId: c.id, targetAuthor: c.userName })}
                            className="text-[11px] font-bold text-slate-500 hover:text-cyan-600 flex items-center gap-1 cursor-pointer"
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
            <span className="font-bold text-slate-700">{skill.name}</span>
            <span>· 版本: v{skill.version || '1.0.0'}</span>
            <span>· 开发者: {skill.developer || '平台官方'}</span>
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
                downloadSkill(skill);
                showToast(`已开始下载/安装 Skill 插件【${skill.name}】！`);
              }}
              className="px-6 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-black shadow-md shadow-cyan-600/20 hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Download className="w-3.5 h-3.5 text-white" />
              <span>一键安装插件</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
