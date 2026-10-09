import React, { useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import Markdown from 'react-markdown';
import { useApp } from '../../../context/AppContext';
import { FeedPost, CommunityBoard, CommunityBoardItem, CommunityCommentItem } from '../../../types';
import { mockAdminComments25 } from '../../../data/mockCommunityComments';
import { AdminPagination } from './AdminPagination';
import {
  FileCheck,
  FileText,
  MessageSquare,
  BarChart3,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Eye,
  Trash2,
  Lock,
  Unlock,
  Pin,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  Plus,
  Edit3,
  Calendar,
  X,
  User,
  ThumbsUp,
  Bookmark,
  ChevronRight,
  ShieldAlert,
  SlidersHorizontal,
  FolderTree,
  Send,
  HelpCircle,
  BookOpen,
  Compass,
  Users,
  Coffee,
  Check
} from 'lucide-react';

interface CommunityAdminViewsProps {
  activeSubMenu: 'community_audit' | 'community_post' | 'community_comment' | 'community_stats';
}

export const CommunityAdminViews: React.FC<CommunityAdminViewsProps> = ({ activeSubMenu }) => {
  if (activeSubMenu === 'community_audit') {
    return <CommunityAuditAdminView />;
  }
  if (activeSubMenu === 'community_post') {
    return <CommunityPostAdminView />;
  }
  if (activeSubMenu === 'community_comment') {
    return <CommunityCommentAdminView />;
  }
  return <CommunityStatsAdminView />;
};

// ==========================================
// 1. 发帖审核 (CommunityAuditAdminView)
// ==========================================
export const CommunityAuditAdminView: React.FC = () => {
  const { posts, setPosts, showToast, communityBoards } = useApp();

  // Filters State
  const [statusFilter, setStatusFilter] = useState<'全部' | '待审核' | '已通过' | '已驳回'>('待审核'); // 默认筛选“待审核”
  const [boardFilter, setBoardFilter] = useState<string>('全部板块');
  const [timeFilter, setTimeFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Pagination State (每页 10 条)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Selected post for view/audit modal
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  // Initial normalize posts state if status is undefined
  const allPosts = useMemo(() => {
    return posts.map(p => {
      let st = p.status;
      if (!st) {
        // default status if not set
        st = p.id.startsWith('pst_') ? '待审核' : '已通过';
      }
      return { ...p, status: st };
    });
  }, [posts]);

  // Filtered List sorted by publish time desc
  const filteredList = useMemo(() => {
    let list = [...allPosts];

    if (statusFilter !== '全部') {
      list = list.filter(p => p.status === statusFilter);
    }

    if (boardFilter !== '全部板块') {
      list = list.filter(p => p.board === boardFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    }

    // Sort by id / time desc
    return list.sort((a, b) => b.id.localeCompare(a.id));
  }, [allPosts, statusFilter, boardFilter, searchQuery]);

  // Total pages and paginated slice
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Reset to page 1 on filter changes
  const handleStatusFilterChange = (st: '全部' | '待审核' | '已通过' | '已驳回') => {
    setStatusFilter(st);
    setCurrentPage(1);
  };

  const handleBoardFilterChange = (board: string) => {
    setBoardFilter(board);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Approve post
  const handleApprove = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, status: '已通过', rejectReason: undefined };
      }
      return p;
    }));
    showToast('已审核通过该动态，帖子已成功发布在社区展示！');
    setIsDetailModalOpen(false);
    setSelectedPost(null);
  };

  // Open Reject Modal
  const openRejectDialog = (post: FeedPost) => {
    setSelectedPost(post);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  // Confirm Reject
  const handleConfirmReject = () => {
    if (!selectedPost) return;
    if (!rejectReason.trim()) {
      showToast('请填写驳回原因（必填）');
      return;
    }
    if (rejectReason.length > 200) {
      showToast('驳回原因字数不得超过200字');
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === selectedPost.id) {
        return { ...p, status: '已驳回', rejectReason: rejectReason.trim() };
      }
      return p;
    }));

    showToast(`已驳回发帖《${selectedPost.title || '社区动态'}》，驳回原因将通过系统通知推送给用户`);
    setIsRejectModalOpen(false);
    setIsDetailModalOpen(false);
    setSelectedPost(null);
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case '待审核':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1 w-fit"><Clock className="w-3 h-3" />待审核</span>;
      case '已通过':
      case '已发布':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1 w-fit"><CheckCircle2 className="w-3 h-3" />已通过</span>;
      case '已驳回':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center gap-1 w-fit"><XCircle className="w-3 h-3" />已驳回</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-800 text-slate-300 border border-slate-700">常规</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search & Filter Header Toolbar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800/80">
            {(['待审核', '已通过', '已驳回', '全部'] as const).map(st => (
              <button
                key={st}
                onClick={() => handleStatusFilterChange(st)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {st} {st === '待审核' && <span className="ml-1 px-1.5 py-0.2 text-[10px] bg-amber-500/30 text-amber-300 rounded-full font-mono">{allPosts.filter(p => p.status === '待审核').length}</span>}
              </button>
            ))}
          </div>

          {/* Board Selector & Time Range & Search Input */}
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={boardFilter}
              onChange={(e) => handleBoardFilterChange(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium"
            >
              <option value="全部板块">全部板块</option>
              {communityBoards.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>

            <select
              value={timeFilter}
              onChange={(e) => {
                setTimeFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium"
            >
              <option value="全部">全部时间</option>
              <option value="today">今天</option>
              <option value="week">近7天</option>
              <option value="month">近30天</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="搜索标题或发帖作者..."
                className="w-52 pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Audit Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">帖子标题</th>
                <th className="py-3.5 px-4">作者</th>
                <th className="py-3.5 px-4">所属板块</th>
                <th className="py-3.5 px-4">发布时间</th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <FileCheck className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                    <span>暂无符合筛选条件的待审核或已审核帖子</span>
                  </td>
                </tr>
              ) : (
                paginatedList.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40 transition group">
                    
                    {/* Title & Preview */}
                    <td className="py-4 px-5">
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setIsDetailModalOpen(true);
                        }}
                        className="text-left font-bold text-slate-200 hover:text-indigo-400 transition line-clamp-1 block cursor-pointer max-w-md"
                      >
                        {post.title || '【无标题贴】' + post.content.substring(0, 30) + '...'}
                      </button>
                      <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                        {post.content.substring(0, 60)}...
                      </span>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <img src={post.authorAvatar} alt={post.author} className="w-6 h-6 rounded-full object-cover shrink-0 ring-1 ring-slate-700" />
                        <span className="text-slate-200 font-bold">{post.author}</span>
                      </div>
                    </td>

                    {/* Board */}
                    <td className="py-4 px-4">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-bold bg-slate-800 text-indigo-300 border border-slate-700">
                        {post.board}
                      </span>
                    </td>

                    {/* Time */}
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">
                      {post.time}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      {getStatusBadge(post.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setIsDetailModalOpen(true);
                        }}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                      >
                        查看详情
                      </button>

                      {post.status === '待审核' && (
                        <>
                          <button
                            onClick={() => handleApprove(post.id)}
                            className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 font-bold text-xs transition cursor-pointer"
                          >
                            通过
                          </button>
                          <button
                            onClick={() => openRejectDialog(post)}
                            className="px-2.5 py-1 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition cursor-pointer"
                          >
                            驳回
                          </button>
                        </>
                      )}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 底部分页栏 */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredList.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          itemUnit="篇发帖"
        />
      </div>

      {/* Audit Detail Modal */}
      {isDetailModalOpen && selectedPost && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">发帖内容审核详情</h2>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author Info */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedPost.authorAvatar} alt={selectedPost.author} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-500/30" />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedPost.author}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                      {selectedPost.authorTag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 mt-0.5 font-mono">发布时间：{selectedPost.time}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-xs text-slate-400">所属板块</div>
                <div className="text-xs font-bold text-indigo-400">{selectedPost.board}</div>
              </div>
            </div>

            {/* Post Title & Content */}
            <div className="space-y-3">
              <h3 className="text-lg font-black text-white">
                {selectedPost.title || '（未设置标题）'}
              </h3>
              
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed max-h-80 overflow-y-auto">
                <div className="prose prose-invert max-w-none text-xs">
                  <Markdown>{selectedPost.content}</Markdown>
                </div>
              </div>
            </div>

            {/* Reject reason if already rejected */}
            {selectedPost.status === '已驳回' && selectedPost.rejectReason && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  驳回原因说明：
                </div>
                <p className="text-slate-300 pl-5">{selectedPost.rejectReason}</p>
              </div>
            )}

            {/* Action Bar */}
            <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                关闭
              </button>

              {selectedPost.status === '待审核' && (
                <>
                  <button
                    onClick={() => openRejectDialog(selectedPost)}
                    className="px-5 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition cursor-pointer"
                  >
                    驳回发帖
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPost.id)}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                  >
                    审核通过
                  </button>
                </>
              )}
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && selectedPost && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md shadow-2xl p-6 space-y-5 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <XCircle className="w-4 h-4 text-rose-400" />
                驳回帖子 - 填写驳回原因
              </h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs text-slate-400">
              请向作者解释驳回原因（必填，限制 200 字以内），用户将在通知中收到提示：
            </div>

            <textarea
              rows={4}
              maxLength={200}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="例如：发帖内容包含无关广告信息 / 涉及违规宣传 / 排版不符合社区规范，请修改后重新提交..."
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-600 outline-none focus:border-rose-500 transition"
            />

            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>驳回必填项</span>
              <span>{rejectReason.length} / 200 字</span>
            </div>

            <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmReject}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/20 transition cursor-pointer"
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


// ==========================================
// 2. 帖子管理 (CommunityPostAdminView)
// ==========================================
export const CommunityPostAdminView: React.FC = () => {
  const { 
    posts, 
    setPosts, 
    showToast, 
    toggleEssentialPost,
    communityBoards, 
    addCommunityBoard, 
    updateCommunityBoard, 
    toggleCommunityBoardStatus, 
    deleteCommunityBoard 
  } = useApp();

  // Filters
  const [boardFilter, setBoardFilter] = useState<string>('全部板块');
  const [statusFilter, setStatusFilter] = useState<'全部' | '已发布' | '已锁定'>('全部');
  const [pinnedFilter, setPinnedFilter] = useState<'全部' | '是' | '否'>('全部');
  const [essentialFilter, setEssentialFilter] = useState<'全部' | '是' | '否'>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State (每页 10 条)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Post Detail Modal State
  const [selectedPost, setSelectedPost] = useState<FeedPost | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Board Management Drawer/Modal State
  const [isBoardModalOpen, setIsBoardModalOpen] = useState(false);
  
  // Dynamic Boards with postCount calculated from posts
  const boards = useMemo(() => {
    return communityBoards.map(b => ({
      ...b,
      postCount: posts.filter(p => p.board === b.name).length
    })).sort((a, b) => a.sortWeight - b.sortWeight);
  }, [communityBoards, posts]);

  // Board Create / Edit State inside Board Modal
  const [editingBoard, setEditingBoard] = useState<CommunityBoardItem | null>(null);
  const [boardNameInput, setBoardNameInput] = useState('');
  const [boardDescInput, setBoardDescInput] = useState('');
  const [boardSortInput, setBoardSortInput] = useState<number>(1);

  // Normalize posts with default values
  const allPosts = useMemo(() => {
    return posts.map(p => ({
      ...p,
      status: (p.status === '已锁定' ? '已锁定' : '已发布') as FeedPost['status'],
      isPinned: !!p.isPinned || !!p.isTop,
      isEssential: !!p.isEssential,
      favoritesCount: p.favoritesCount || Math.floor(p.likesCount * 0.6)
    }));
  }, [posts]);

  // Filtered List
  const filteredList = useMemo(() => {
    let list = [...allPosts];

    if (boardFilter !== '全部板块') {
      list = list.filter(p => p.board === boardFilter);
    }

    if (statusFilter !== '全部') {
      list = list.filter(p => p.status === statusFilter);
    }

    if (pinnedFilter !== '全部') {
      list = list.filter(p => (pinnedFilter === '是' ? p.isPinned : !p.isPinned));
    }

    if (essentialFilter !== '全部') {
      list = list.filter(p => (essentialFilter === '是' ? p.isEssential : !p.isEssential));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p =>
        (p.title && p.title.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q)
      );
    }

    return list;
  }, [allPosts, boardFilter, statusFilter, pinnedFilter, essentialFilter, searchQuery]);

  // Total pages and paginated slice
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Filter change handlers with page reset
  const handleBoardFilterChange = (board: string) => {
    setBoardFilter(board);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status: '全部' | '已发布' | '已锁定') => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handlePinnedFilterChange = (pinned: '全部' | '是' | '否') => {
    setPinnedFilter(pinned);
    setCurrentPage(1);
  };

  const handleEssentialFilterChange = (essential: '全部' | '是' | '否') => {
    setEssentialFilter(essential);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Toggle Pinned (置顶 / 取消置顶) - 最新置顶的帖子靠前
  const togglePin = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const nextState = !post?.isPinned && !post?.isTop;
    const nowIso = new Date().toISOString();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          isPinned: nextState, 
          isTop: nextState,
          pinnedAt: nextState ? nowIso : undefined
        };
      }
      return p;
    }));
    setSelectedPost(prev => (prev && prev.id === postId ? { 
      ...prev, 
      isPinned: nextState, 
      isTop: nextState,
      pinnedAt: nextState ? nowIso : undefined 
    } : prev));
    showToast(nextState ? '已将该帖子置顶于板块头部' : '已取消该帖子的置顶状态');
  };

  // Toggle Essential (加精 / 取消加精)
  const toggleEssential = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const nextState = !post?.isEssential;
    toggleEssentialPost(postId);
    setSelectedPost(prev => (prev && prev.id === postId ? { ...prev, isEssential: nextState } : prev));
  };

  // Toggle Lock (锁定 / 解锁)
  const toggleLock = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const nextStatus: '已发布' | '已锁定' = post?.status === '已锁定' ? '已发布' : '已锁定';
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, status: nextStatus };
      }
      return p;
    }));
    setSelectedPost(prev => (prev && prev.id === postId ? { ...prev, status: nextStatus } : prev));
    showToast(nextStatus === '已锁定' ? '已锁定该帖子（锁定后不可回复）' : '已解除该帖子的锁定状态');
  };

  // Delete Post
  const handleDeletePost = (postId: string, title?: string) => {
    if (confirm(`确定要彻底删除帖子《${title || '该社区动态'}》吗？删除后不可恢复。`)) {
      setPosts(prev => prev.filter(p => p.id !== postId));
      showToast('已彻底删除该帖子');
      if (selectedPost?.id === postId) {
        setIsDetailModalOpen(false);
        setSelectedPost(null);
      }
    }
  };

  // Save/Update Board
  const handleSaveBoard = () => {
    if (!boardNameInput.trim()) {
      showToast('请输入板块名称');
      return;
    }

    if (editingBoard) {
      updateCommunityBoard(editingBoard.id, {
        name: boardNameInput.trim(),
        description: boardDescInput.trim(),
        sortWeight: boardSortInput
      });
    } else {
      addCommunityBoard({
        name: boardNameInput.trim(),
        description: boardDescInput.trim(),
        sortWeight: boardSortInput,
        status: '已启用'
      });
    }

    setEditingBoard(null);
    setBoardNameInput('');
    setBoardDescInput('');
    setBoardSortInput(1);
  };

  // Toggle Board Status (启用 / 停用)
  const toggleBoardStatus = (boardId: string) => {
    toggleCommunityBoardStatus(boardId);
  };

  // Delete Board validation
  const handleDeleteBoard = (board: CommunityBoardItem) => {
    deleteCommunityBoard(board.id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Top Filter Bar & Board Management Entry Button */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          <div className="flex flex-wrap items-center gap-3">
            {/* Board Selector */}
            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-1">所属板块</label>
              <select
                value={boardFilter}
                onChange={(e) => handleBoardFilterChange(e.target.value)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium"
              >
                <option value="全部板块">全部板块</option>
                {boards.map(b => (
                  <option key={b.id} value={b.name}>{b.name}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-1">帖子状态</label>
              <select
                value={statusFilter}
                onChange={(e) => handleStatusFilterChange(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium"
              >
                <option value="全部">全部状态</option>
                <option value="已发布">已发布</option>
                <option value="已锁定">已锁定</option>
              </select>
            </div>

            {/* Pinned Filter */}
            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-1">是否置顶</label>
              <select
                value={pinnedFilter}
                onChange={(e) => handlePinnedFilterChange(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium"
              >
                <option value="全部">全部</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>

            {/* Essential Filter */}
            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-1">是否精华</label>
              <select
                value={essentialFilter}
                onChange={(e) => handleEssentialFilterChange(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium"
              >
                <option value="全部">全部</option>
                <option value="是">是</option>
                <option value="否">否</option>
              </select>
            </div>

            {/* Search Input */}
            <div>
              <label className="block text-[10px] text-slate-500 font-mono mb-1">关键词搜索</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder="搜索标题或发帖作者..."
                  className="w-48 pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Board Management Entry Button */}
          <div className="shrink-0 pt-3 lg:pt-0">
            <button
              onClick={() => setIsBoardModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 flex items-center gap-2 cursor-pointer transition"
            >
              <FolderTree className="w-4 h-4" />
              <span>板块管理</span>
            </button>
          </div>

        </div>

      </div>

      {/* Posts Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">帖子标题</th>
                <th className="py-3.5 px-4">作者</th>
                <th className="py-3.5 px-4">所属板块</th>
                <th className="py-3.5 px-3 text-center">点赞</th>
                <th className="py-3.5 px-3 text-center">评论</th>
                <th className="py-3.5 px-3 text-center">收藏</th>
                <th className="py-3.5 px-3 text-center">状态</th>
                <th className="py-3.5 px-3 text-center">置顶</th>
                <th className="py-3.5 px-3 text-center">精华</th>
                <th className="py-3.5 px-4">发布时间</th>
                <th className="py-3.5 px-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-12 text-center text-slate-500">
                    <FileText className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                    <span>暂无符合筛选条件的社区帖子</span>
                  </td>
                </tr>
              ) : (
                paginatedList.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40 transition group">
                    
                    {/* Title */}
                    <td className="py-4 px-5">
                      <div className="flex items-center gap-2">
                        {post.isPinned && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 shrink-0">
                            置顶
                          </span>
                        )}
                        {post.isEssential && (
                          <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[10px] font-bold border border-amber-500/30 shrink-0">
                            精华
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedPost(post);
                            setIsDetailModalOpen(true);
                          }}
                          className="font-bold text-slate-200 hover:text-indigo-400 transition line-clamp-1 text-left cursor-pointer max-w-xs"
                        >
                          {post.title || post.content.substring(0, 25) + '...'}
                        </button>
                      </div>
                    </td>

                    {/* Author */}
                    <td className="py-4 px-4 font-medium">
                      <div className="flex items-center gap-2">
                        <img src={post.authorAvatar} alt={post.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
                        <span className="text-slate-300">{post.author}</span>
                      </div>
                    </td>

                    {/* Board */}
                    <td className="py-4 px-4">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                        {post.board}
                      </span>
                    </td>

                    {/* Stats */}
                    <td className="py-4 px-3 text-center font-mono text-slate-300">{post.likesCount}</td>
                    <td className="py-4 px-3 text-center font-mono text-slate-300">{post.commentsCount}</td>
                    <td className="py-4 px-3 text-center font-mono text-slate-300">{post.favoritesCount || 0}</td>

                    {/* Status */}
                    <td className="py-4 px-3 text-center">
                      {post.status === '已锁定' ? (
                        <span className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 text-[10px] font-bold">已锁定</span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">已发布</span>
                      )}
                    </td>

                    {/* Pinned? */}
                    <td className="py-4 px-3 text-center font-bold">
                      {post.isPinned ? <span className="text-indigo-400">是</span> : <span className="text-slate-600">否</span>}
                    </td>

                    {/* Essential? */}
                    <td className="py-4 px-3 text-center font-bold">
                      {post.isEssential ? <span className="text-amber-400">是</span> : <span className="text-slate-600">否</span>}
                    </td>

                    {/* Time */}
                    <td className="py-4 px-4 text-slate-400 font-mono text-[11px]">{post.time}</td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right space-x-1.5">
                      <button
                        onClick={() => {
                          setSelectedPost(post);
                          setIsDetailModalOpen(true);
                        }}
                        className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition cursor-pointer"
                      >
                        详情
                      </button>

                      <button
                        onClick={() => togglePin(post.id)}
                        className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer border ${
                          post.isPinned
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 hover:bg-indigo-500/30'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {post.isPinned ? '取消置顶' : '置顶'}
                      </button>

                      <button
                        onClick={() => toggleEssential(post.id)}
                        className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer border ${
                          post.isEssential
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {post.isEssential ? '取消加精' : '加精'}
                      </button>

                      <button
                        onClick={() => toggleLock(post.id)}
                        className={`px-2 py-1 rounded text-[11px] font-bold transition cursor-pointer border ${
                          post.status === '已锁定'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/30'
                            : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-white'
                        }`}
                      >
                        {post.status === '已锁定' ? '解锁' : '锁定'}
                      </button>

                      <button
                        onClick={() => handleDeletePost(post.id, post.title)}
                        className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                        title="彻底删除"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 底部分页栏 */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredList.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          itemUnit="篇帖子"
        />
      </div>

      {/* Post Detail Modal */}
      {isDetailModalOpen && selectedPost && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">帖子完整内容与详情管理</h2>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={selectedPost.authorAvatar} alt={selectedPost.author} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-bold text-white flex items-center gap-2">
                    <span>{selectedPost.author}</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-800 text-slate-400 border border-slate-700">
                      {selectedPost.authorTag}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">发布于 {selectedPost.time}</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-xs font-mono text-slate-300">
                <div>点赞 <strong>{selectedPost.likesCount}</strong></div>
                <div>评论 <strong>{selectedPost.commentsCount}</strong></div>
                <div>收藏 <strong>{selectedPost.favoritesCount || 0}</strong></div>
              </div>
            </div>

            <div className="space-y-3">
              <h1 className="text-lg font-black text-white">{selectedPost.title || '（未命名帖子）'}</h1>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs text-slate-200 leading-relaxed max-h-80 overflow-y-auto">
                <div className="prose prose-invert max-w-none text-xs">
                  <Markdown>{selectedPost.content}</Markdown>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDeletePost(selectedPost.id, selectedPost.title)}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition cursor-pointer"
              >
                彻底删除帖子
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => togglePin(selectedPost.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  {selectedPost.isPinned ? '取消置顶' : '置顶文章'}
                </button>
                <button
                  onClick={() => toggleEssential(selectedPost.id)}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
                >
                  {selectedPost.isEssential ? '取消加精' : '设为精华'}
                </button>
                <button
                  onClick={() => setIsDetailModalOpen(false)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>

          </div>
        </div>,
        document.body
      )}

      {/* Board Management Drawer/Modal */}
      {isBoardModalOpen && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-6 animate-fade-in">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FolderTree className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">社区板块管理</h2>
              </div>
              <button onClick={() => setIsBoardModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Board Create / Edit Form */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="text-xs font-bold text-indigo-400 flex items-center justify-between">
                <span>{editingBoard ? `编辑板块：${editingBoard.name}` : '添加新板块'}</span>
                {editingBoard && (
                  <button
                    onClick={() => {
                      setEditingBoard(null);
                      setBoardNameInput('');
                      setBoardDescInput('');
                      setBoardSortInput(1);
                    }}
                    className="text-[10px] text-slate-400 hover:text-slate-200 underline cursor-pointer"
                  >
                    取消编辑
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">板块名称 *</label>
                  <input
                    type="text"
                    value={boardNameInput}
                    onChange={(e) => setBoardNameInput(e.target.value)}
                    placeholder="如：干货分享"
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">排序权重 (越小越靠前)</label>
                  <input
                    type="number"
                    value={boardSortInput}
                    onChange={(e) => setBoardSortInput(parseInt(e.target.value) || 1)}
                    className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500 font-mono"
                  />
                </div>

                <div className="sm:col-span-1 flex items-end">
                  <button
                    onClick={handleSaveBoard}
                    className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition cursor-pointer"
                  >
                    {editingBoard ? '保存修改' : '确认新增板块'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[11px] text-slate-400 mb-1">板块简介描述</label>
                <input
                  type="text"
                  value={boardDescInput}
                  onChange={(e) => setBoardDescInput(e.target.value)}
                  placeholder="简要概括该板块的主题范围..."
                  className="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            {/* Board List Table */}
            <div className="rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4">板块名称</th>
                    <th className="py-3 px-4">描述</th>
                    <th className="py-3 px-3 text-center">发帖量</th>
                    <th className="py-3 px-3 text-center">排序权重</th>
                    <th className="py-3 px-3 text-center">状态</th>
                    <th className="py-3 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {boards.map(b => (
                    <tr key={b.id} className="hover:bg-slate-800/30">
                      <td className="py-3 px-4 font-bold text-white">{b.name}</td>
                      <td className="py-3 px-4 text-slate-400 max-w-xs truncate">{b.description}</td>
                      <td className="py-3 px-3 text-center font-mono font-bold text-indigo-400">{b.postCount}</td>
                      <td className="py-3 px-3 text-center font-mono">{b.sortWeight}</td>
                      <td className="py-3 px-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          b.status === '已启用' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingBoard(b);
                            setBoardNameInput(b.name);
                            setBoardDescInput(b.description);
                            setBoardSortInput(b.sortWeight);
                          }}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer"
                        >
                          编辑
                        </button>

                        <button
                          onClick={() => toggleBoardStatus(b.id)}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold cursor-pointer"
                        >
                          {b.status === '已启用' ? '停用' : '启用'}
                        </button>

                        <button
                          onClick={() => handleDeleteBoard(b)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 cursor-pointer"
                          title="删除"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="pt-2 text-[11px] text-slate-500 font-mono">
              提示：板块至少需保留 1 个。删除前系统会自动检测板块下是否存在关联帖子。
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};


// ==========================================
// 3. 评论管理 (CommunityCommentAdminView)
// ==========================================
export const CommunityCommentAdminView: React.FC = () => {
  const { posts, showToast } = useApp();

  // Filters
  const [boardFilter, setBoardFilter] = useState<string>('全部板块');
  const [timeFilter, setTimeFilter] = useState<string>('全部');
  const [searchQuery, setSearchQuery] = useState('');

  // Pagination State (每页 10 条)
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 10;

  // Selected Comment Modal State
  const [selectedComment, setSelectedComment] = useState<CommunityCommentItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Associated post for selected comment
  const selectedCommentPost = useMemo(() => {
    if (!selectedComment) return null;
    return (
      posts.find(p => p.id === selectedComment.postId) ||
      posts.find(p => p.title === selectedComment.postTitle) ||
      null
    );
  }, [selectedComment, posts]);

  // Initial Mock Comments (25条贴合实际业务与技术场景的高质量评论数据)
  const [comments, setComments] = useState<CommunityCommentItem[]>(mockAdminComments25);

  // Filtered List
  const filteredList = useMemo(() => {
    let list = [...comments];

    if (boardFilter !== '全部板块') {
      list = list.filter(c => c.board === boardFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(c => 
        c.content.toLowerCase().includes(q) ||
        c.author.toLowerCase().includes(q) ||
        c.postTitle.toLowerCase().includes(q)
      );
    }

    return list;
  }, [comments, boardFilter, searchQuery]);

  // Total pages and paginated slice
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredList.slice(startIndex, startIndex + pageSize);
  }, [filteredList, currentPage, pageSize]);

  // Filter handlers with page reset
  const handleBoardFilterChange = (board: string) => {
    setBoardFilter(board);
    setCurrentPage(1);
  };

  const handleTimeFilterChange = (time: string) => {
    setTimeFilter(time);
    setCurrentPage(1);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Delete comment
  const handleDeleteComment = (commentId: string) => {
    if (confirm('确认删除该条用户评论吗？删除后该评论及其嵌套回复将不再展示。')) {
      setComments(prev => prev.filter(c => c.id !== commentId));
      showToast('已成功删除该条评论');
      if (selectedComment?.id === commentId) {
        setIsDetailModalOpen(false);
        setSelectedComment(null);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Search & Filter Bar */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={boardFilter}
            onChange={(e) => handleBoardFilterChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium"
          >
            <option value="全部板块">全部板块</option>
            <option value="干货分享">干货分享</option>
            <option value="求助答疑">求助答疑</option>
            <option value="前沿观察">前沿观察</option>
            <option value="赚钱交流">赚钱交流</option>
            <option value="同行交流">同行交流</option>
            <option value="娱乐灌水">娱乐灌水</option>
          </select>

          <select
            value={timeFilter}
            onChange={(e) => handleTimeFilterChange(e.target.value)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 outline-none focus:border-indigo-500 font-medium"
          >
            <option value="全部">全部时间范围</option>
            <option value="today">今天</option>
            <option value="week">近7天</option>
          </select>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="搜索评论内容 / 评论人..."
              className="w-56 pl-8 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 placeholder:text-slate-500 outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="text-xs text-slate-400 font-mono">
          共记录 <strong>{filteredList.length}</strong> 条评论
        </div>

      </div>

      {/* Comment List Table */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-mono uppercase border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-5">评论内容 (前50字)</th>
                <th className="py-3.5 px-4">评论人</th>
                <th className="py-3.5 px-4">所属帖子标题</th>
                <th className="py-3.5 px-4">所属板块</th>
                <th className="py-3.5 px-3 text-center">点赞数</th>
                <th className="py-3.5 px-4">评论时间</th>
                <th className="py-3.5 px-5 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-50" />
                    <span>暂无符合条件的评论数据</span>
                  </td>
                </tr>
              ) : (
                paginatedList.map((c) => {
                  const shortText = c.content.length > 50 ? c.content.substring(0, 50) + '...' : c.content;

                  return (
                    <tr key={c.id} className="hover:bg-slate-800/40 transition">
                      
                      {/* Content Preview */}
                      <td className="py-4 px-5">
                        <button
                          onClick={() => {
                            setSelectedComment(c);
                            setIsDetailModalOpen(true);
                          }}
                          className="font-normal text-slate-200 hover:text-indigo-400 text-left line-clamp-2 max-w-sm cursor-pointer leading-relaxed"
                        >
                          {shortText}
                        </button>
                      </td>

                      {/* Author */}
                      <td className="py-4 px-4 font-medium">
                        <div className="flex items-center gap-2">
                          {c.authorAvatar && (
                            <img src={c.authorAvatar} alt={c.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
                          )}
                          <span className="text-slate-200 font-bold">{c.author}</span>
                        </div>
                      </td>

                      {/* Post Title */}
                      <td className="py-4 px-4">
                        <span className="text-slate-400 hover:text-indigo-300 font-medium line-clamp-1 max-w-xs block">
                          {c.postTitle}
                        </span>
                      </td>

                      {/* Board */}
                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-800 text-slate-300 border border-slate-700">
                          {c.board}
                        </span>
                      </td>

                      {/* Likes */}
                      <td className="py-4 px-3 text-center font-mono font-bold text-indigo-400">
                        {c.likesCount}
                      </td>

                      {/* Time */}
                      <td className="py-4 px-4 font-mono text-[11px] text-slate-400">
                        {c.time}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedComment(c);
                            setIsDetailModalOpen(true);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
                        >
                          查看详情
                        </button>

                        <button
                          onClick={() => handleDeleteComment(c.id)}
                          className="p-1 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-500/20 transition cursor-pointer"
                          title="删除评论"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* 底部分页栏 */}
        <AdminPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={filteredList.length}
          pageSize={pageSize}
          onPageChange={(p) => setCurrentPage(p)}
          itemUnit="条评论"
        />
      </div>

      {/* Comment Detail Modal */}
      {isDetailModalOpen && selectedComment && typeof document !== 'undefined' && createPortal(
        <div className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl p-6 space-y-5 animate-fade-in custom-scrollbar">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-400" />
                <h2 className="text-base font-bold text-white">评论详情与管理</h2>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Author Info */}
            <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                {selectedComment.authorAvatar && (
                  <img src={selectedComment.authorAvatar} alt={selectedComment.author} className="w-8 h-8 rounded-full object-cover" />
                )}
                <div>
                  <div className="text-xs font-bold text-white">{selectedComment.author}</div>
                  <div className="text-[10px] text-slate-500 font-mono">评论时间：{selectedComment.time}</div>
                </div>
              </div>
              <div className="text-xs text-indigo-400 font-bold font-mono">
                点赞量: {selectedComment.likesCount}
              </div>
            </div>

            {/* Comment Content */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400">评论完整内容：</label>
              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                {selectedComment.content}
              </div>
            </div>

            {/* Complete Post Details Section (完整帖子详情内容展示) */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-indigo-400" />
                  <span>完整帖子详情内容</span>
                </label>
                {selectedCommentPost && (
                  <span className="text-[11px] text-slate-400 font-mono">
                    作者：<span className="text-slate-200 font-bold">{selectedCommentPost.author}</span> · {selectedCommentPost.time}
                  </span>
                )}
              </div>

              {selectedCommentPost ? (
                <div className="rounded-xl bg-slate-950/90 border border-slate-800/90 p-4 space-y-4">
                  {/* Post Title & Badges */}
                  <div className="space-y-2 border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {selectedCommentPost.board}
                      </span>
                      {selectedCommentPost.isTop && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          置顶
                        </span>
                      )}
                      {selectedCommentPost.isEssential && (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          精华
                        </span>
                      )}
                      {selectedCommentPost.tags && selectedCommentPost.tags.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.2 rounded text-[10px] font-mono text-slate-400 bg-slate-900 border border-slate-800">
                          #{t}
                        </span>
                      ))}
                    </div>
                    <h3 className="text-sm font-black text-white leading-snug">
                      {selectedCommentPost.title}
                    </h3>
                  </div>

                  {/* Post Content with Markdown */}
                  <div className="text-xs text-slate-300 leading-relaxed max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="prose prose-invert prose-xs max-w-none prose-p:my-1.5 prose-headings:my-2 prose-pre:my-2 prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
                      <Markdown>{selectedCommentPost.content}</Markdown>
                    </div>
                  </div>

                  {/* Post Images if any */}
                  {selectedCommentPost.images && selectedCommentPost.images.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <div className="text-[11px] text-slate-400 font-mono mb-2">帖子配图 ({selectedCommentPost.images.length} 张)：</div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {selectedCommentPost.images.map((img, idx) => (
                          <div key={idx} className="rounded-lg overflow-hidden border border-slate-800 bg-slate-900 aspect-video">
                            <img src={img} alt="post attachment" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Post Stats Bar */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                    <div className="flex items-center gap-3">
                      <span>👍 点赞: {selectedCommentPost.likesCount}</span>
                      <span>💬 评论: {selectedCommentPost.commentsCount}</span>
                      <span>⭐ 收藏: {selectedCommentPost.favoritesCount || 0}</span>
                    </div>
                    <span>👁 浏览: {selectedCommentPost.viewsCount || 0} 次</span>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                  <div className="font-bold text-slate-300">{selectedComment.postTitle}</div>
                  <div className="text-[11px] text-slate-500 font-mono">所属板块：{selectedComment.board} · 该帖子已归档或处于模拟展示状态</div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => handleDeleteComment(selectedComment.id)}
                className="px-4 py-2 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 font-bold text-xs transition cursor-pointer"
              >
                删除此评论
              </button>

              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer"
              >
                关闭
              </button>
            </div>

          </div>
        </div>,
        document.body
      )}

    </div>
  );
};


// ==========================================
// 4. 数据统计 (CommunityStatsAdminView)
// ==========================================
export const CommunityStatsAdminView: React.FC = () => {
  const [rangeFilter, setRangeFilter] = useState<'7d' | '30d' | 'month' | 'custom'>('7d');

  // Stats Card Metrics
  const metrics = [
    { label: '总帖子数', value: '1,428', todayNew: '+12 篇', icon: <FileText className="w-5 h-5 text-indigo-400" /> },
    { label: '总评论数', value: '8,920', todayNew: '+68 条', icon: <MessageSquare className="w-5 h-5 text-cyan-400" /> },
    { label: '今日新增帖子', value: '12 篇', todayNew: '审核通过 10 篇', icon: <Sparkles className="w-5 h-5 text-emerald-400" /> },
    { label: '今日新增评论', value: '68 条', todayNew: '互动率 +18.4%', icon: <TrendingUp className="w-5 h-5 text-amber-400" /> },
  ];

  // Daily Trend Data (7 Days)
  const postTrendData = [
    { date: '08-17', count: 14 },
    { date: '08-18', count: 18 },
    { date: '08-19', count: 22 },
    { date: '08-20', count: 19 },
    { date: '08-21', count: 28 },
    { date: '08-22', count: 35 },
    { date: '08-23', count: 26 },
  ];

  // Board Activity Ranking Data
  const boardRankings = [
    { board: '干货分享', count: 580, percentage: 85 },
    { board: '求助答疑', count: 340, percentage: 62 },
    { board: '前沿观察', count: 220, percentage: 48 },
    { board: '赚钱交流', count: 150, percentage: 35 },
    { board: '同行交流', count: 88, percentage: 22 },
    { board: '娱乐灌水', count: 50, percentage: 14 },
  ];

  // Top 10 Active Users
  const userRankings = [
    { rank: 1, name: '张Dev', postsCount: 42, avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
    { rank: 2, name: 'AI智囊', postsCount: 38, avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
    { rank: 3, name: '极客小千', postsCount: 29, avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
    { rank: 4, name: '李向量-数据专家', postsCount: 24, avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80' },
    { rank: 5, name: '陈Agent', postsCount: 19, avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80' },
  ];

  // Interaction Trend Data (Likes + Comments)
  const interactionData = [
    { date: '08-17', likes: 120, comments: 45 },
    { date: '08-18', likes: 160, comments: 58 },
    { date: '08-19', likes: 210, comments: 82 },
    { date: '08-20', likes: 180, comments: 70 },
    { date: '08-21', likes: 290, comments: 110 },
    { date: '08-22', likes: 340, comments: 140 },
    { date: '08-23', likes: 280, comments: 98 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Time Filter Selector Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-indigo-400" />
          <h2 className="text-sm font-bold text-white">社区全局数据统计与图表分析</h2>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
          {[
            { id: '7d', label: '近 7 天' },
            { id: '30d', label: '近 30 天' },
            { id: 'month', label: '本月' },
            { id: 'custom', label: '自定义' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setRangeFilter(t.id as any)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                rangeFilter === t.id ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-400 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400">{m.label}</span>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">{m.icon}</div>
            </div>
            <div className="text-2xl font-black text-white font-mono">{m.value}</div>
            <div className="text-[11px] text-slate-500 font-mono border-t border-slate-800 pt-2">
              {m.todayNew}
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 1. 发帖趋势 (折线图/柱状图表达) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-400" />
                每日发帖量趋势
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">近 7 天每日新增发帖数据走势</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 font-bold">单位：篇</span>
          </div>

          {/* Bar / Line Visualization */}
          <div className="h-48 pt-6 pb-2 flex items-end justify-between gap-3 px-2 border-b border-slate-800">
            {postTrendData.map((pt, idx) => {
              const maxVal = 40;
              const heightPct = Math.min(100, Math.round((pt.count / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-indigo-300 font-bold opacity-0 group-hover:opacity-100 transition">
                    {pt.count}
                  </span>
                  <div className="w-full bg-slate-950 rounded-t-lg overflow-hidden h-36 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-indigo-600 to-cyan-500 group-hover:from-indigo-500 group-hover:to-cyan-400 transition-all rounded-t-md"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{pt.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. 互动趋势 (点赞 + 评论总量) */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <ThumbsUp className="w-4 h-4 text-cyan-400" />
                互动总量趋势 (点赞 + 评论)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">近 7 天全站用户互动活度变化</p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="flex items-center gap-1 text-cyan-400"><span className="w-2 h-2 rounded-full bg-cyan-400" />点赞</span>
              <span className="flex items-center gap-1 text-indigo-400"><span className="w-2 h-2 rounded-full bg-indigo-400" />评论</span>
            </div>
          </div>

          <div className="h-48 pt-6 pb-2 flex items-end justify-between gap-3 px-2 border-b border-slate-800">
            {interactionData.map((it, idx) => {
              const maxVal = 500;
              const total = it.likes + it.comments;
              const heightPct = Math.min(100, Math.round((total / maxVal) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition">
                    {total}
                  </span>
                  <div className="w-full bg-slate-950 rounded-t-lg overflow-hidden h-36 flex items-end">
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full bg-gradient-to-t from-cyan-600 via-indigo-600 to-purple-500 transition-all rounded-t-md"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{it.date}</span>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Bottom Rankings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 板块活跃排行 */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            各板块发帖活跃度排行
          </h3>

          <div className="space-y-3">
            {boardRankings.map((br, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200">{br.board}</span>
                  <span className="font-mono text-slate-400">{br.count} 篇</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                  <div
                    style={{ width: `${br.percentage}%` }}
                    className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 用户活跃排行 Top 10 */}
        <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-md space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-amber-400" />
            发帖量 Top 5 用户排行榜
          </h3>

          <div className="space-y-3 divide-y divide-slate-800/60">
            {userRankings.map((ur) => (
              <div key={ur.rank} className="pt-2.5 first:pt-0 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-lg font-mono font-bold text-xs flex items-center justify-center ${
                    ur.rank === 1 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                    ur.rank === 2 ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30' :
                    ur.rank === 3 ? 'bg-amber-700/20 text-amber-500 border border-amber-700/30' :
                    'bg-slate-950 text-slate-500 border border-slate-800'
                  }`}>
                    {ur.rank}
                  </span>
                  <img src={ur.avatar} alt={ur.name} className="w-7 h-7 rounded-full object-cover" />
                  <span className="text-xs font-bold text-slate-200">{ur.name}</span>
                </div>

                <div className="text-xs font-mono font-bold text-indigo-400">
                  {ur.postsCount} 篇帖子
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
