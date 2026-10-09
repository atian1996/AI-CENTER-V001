import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { FeedPost, UserPostItem, UserCommentItem, UserFavoriteItem } from '../../types';
import { 
  mockUserPostsExtended, 
  mockUserCommentsExtended, 
  mockUserFavoritesExtended 
} from '../../data/mockWorkspaceCommunity';
import { 
  MessageSquare, 
  Heart, 
  Bookmark, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink, 
  X, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  CornerDownRight, 
  Send,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const initialUserPosts: UserPostItem[] = mockUserPostsExtended;
const initialUserComments: UserCommentItem[] = mockUserCommentsExtended;
const initialUserFavorites: UserFavoriteItem[] = mockUserFavoritesExtended;

export const WorkspaceCommunity: React.FC = () => {
  const { 
    setActiveTab, 
    showToast, 
    communityBoards, 
    posts: appPosts, 
    user, 
    updatePost, 
    deletePost,
    openPostDetailWithOrigin,
    workspaceCommunitySubTab,
    setWorkspaceCommunitySubTab
  } = useApp();

  const activeSubTab = workspaceCommunitySubTab || 'posts';
  const setActiveSubTab = (tab: 'posts' | 'comments' | 'favorites') => {
    setWorkspaceCommunitySubTab(tab);
  };
  
  // Data States: combine initial posts with posts created by the user in appPosts
  const [posts, setPosts] = useState<UserPostItem[]>(() => {
    const userAppPosts: UserPostItem[] = appPosts
      .filter(p => p.author === user.name && !initialUserPosts.some(ip => ip.id === p.id))
      .map(p => ({
        id: p.id,
        title: p.title || '（无标题社区动态）',
        content: p.content,
        board: p.board,
        status: (p.status === '待审核' ? 'reviewing' : p.status === '已驳回' ? 'rejected' : 'published') as UserPostItem['status'],
        statusLabel: p.status === '待审核' ? '审核中' : p.status === '已驳回' ? '已驳回' : '已发布',
        rejectReason: p.rejectReason,
        likesCount: p.likesCount,
        commentsCount: p.commentsCount,
        collectsCount: p.favoritesCount || 0,
        createdAt: p.time
      }));
    return [...userAppPosts, ...initialUserPosts];
  });
  const [comments, setComments] = useState<UserCommentItem[]>(initialUserComments);
  const [favorites, setFavorites] = useState<UserFavoriteItem[]>(initialUserFavorites);

  // Pagination States (10 items per page)
  const [postPage, setPostPage] = useState<number>(1);
  const [commentPage, setCommentPage] = useState<number>(1);
  const [favoritePage, setFavoritePage] = useState<number>(1);
  const PAGE_SIZE = 10;

  // Filters for Posts
  const [postStatusFilter, setPostStatusFilter] = useState<'all' | 'published' | 'reviewing' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [viewPostModal, setViewPostModal] = useState<UserPostItem | null>(null);
  const [editPostModal, setEditPostModal] = useState<UserPostItem | null>(null);
  const [editForm, setEditForm] = useState({ title: '', content: '', board: '干货分享' });
  const [deleteConfirm, setDeleteConfirm] = useState<{ type: 'post' | 'comment'; id: string } | null>(null);

  // Filtered Posts
  const filteredPosts = posts.filter(p => {
    if (postStatusFilter !== 'all' && p.status !== postStatusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.content.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Filtered Comments
  const filteredComments = comments.filter(c => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!c.content.toLowerCase().includes(q) && !c.postTitle.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Filtered Favorites
  const filteredFavorites = favorites.filter(f => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      if (!f.postTitle.toLowerCase().includes(q) && !f.authorName.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  // Reset pages when filters change
  useEffect(() => {
    setPostPage(1);
  }, [postStatusFilter, searchQuery]);

  useEffect(() => {
    setCommentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    setFavoritePage(1);
  }, [searchQuery]);

  const totalPostPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE));
  const paginatedPosts = filteredPosts.slice((postPage - 1) * PAGE_SIZE, postPage * PAGE_SIZE);

  const totalCommentPages = Math.max(1, Math.ceil(filteredComments.length / PAGE_SIZE));
  const paginatedComments = filteredComments.slice((commentPage - 1) * PAGE_SIZE, commentPage * PAGE_SIZE);

  const totalFavoritePages = Math.max(1, Math.ceil(filteredFavorites.length / PAGE_SIZE));
  const paginatedFavorites = filteredFavorites.slice((favoritePage - 1) * PAGE_SIZE, favoritePage * PAGE_SIZE);

  const renderPagination = (currentPage: number, totalPages: number, totalCount: number, onPageChange: (p: number) => void) => {
    if (totalCount === 0) return null;
    return (
      <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div>
          共 <span className="font-bold text-slate-700">{totalCount}</span> 条数据，每页 <span className="font-bold text-slate-700">{PAGE_SIZE}</span> 条，第 <span className="font-bold text-slate-700">{currentPage}</span> / {totalPages} 页
        </div>
        <div className="flex items-center gap-1.5">
          <button 
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            disabled={currentPage <= 1}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-bold text-xs transition cursor-pointer ${
              currentPage <= 1 
                ? 'bg-slate-50 text-slate-300 border-slate-200/60 cursor-not-allowed' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>上一页</span>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                currentPage === p
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
              }`}
            >
              {p}
            </button>
          ))}

          <button 
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage >= totalPages}
            className={`px-2.5 py-1.5 rounded-lg border flex items-center gap-1 font-bold text-xs transition cursor-pointer ${
              currentPage >= totalPages 
                ? 'bg-slate-50 text-slate-300 border-slate-200/60 cursor-not-allowed' 
                : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
            }`}
          >
            <span>下一页</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  };

  // Actions
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editPostModal) return;
    if (!editForm.title.trim() || !editForm.content.trim()) {
      showToast('标题与正文内容不能为空');
      return;
    }

    // 检查所选板块是否处于停用状态
    const targetBoard = communityBoards.find(b => b.name === editForm.board);
    if (targetBoard && targetBoard.status === '已停用') {
      showToast('所选板块已被停用，不可选，请选择其他正常启用的板块！');
      return;
    }

    setPosts(prev => prev.map(p => {
      if (p.id === editPostModal.id) {
        return {
          ...p,
          title: editForm.title,
          content: editForm.content,
          board: editForm.board,
          status: 'reviewing',
          statusLabel: '审核中'
        };
      }
      return p;
    }));

    // 同步更新全局 AppContext 中的对应帖子（如果存在）
    updatePost(editPostModal.id, {
      title: editForm.title,
      content: editForm.content,
      board: editForm.board,
      status: '待审核'
    });

    showToast('帖子修改成功，已提交重新审核');
    setEditPostModal(null);
  };

  const handleConfirmDelete = () => {
    if (!deleteConfirm) return;
    if (deleteConfirm.type === 'post') {
      setPosts(prev => prev.filter(p => p.id !== deleteConfirm.id));
      deletePost(deleteConfirm.id);
      showToast('帖子已成功删除');
    } else if (deleteConfirm.type === 'comment') {
      setComments(prev => prev.filter(c => c.id !== deleteConfirm.id));
      showToast('评论已删除');
    }
    setDeleteConfirm(null);
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites(prev => prev.filter(f => f.id !== id));
    showToast('已取消收藏');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* 顶部标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-emerald-600" />
            我的社区
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            统一管理您在社区发布的帖子、讨论评论与收藏的精华干货
          </p>
        </div>

        <button
          onClick={() => setActiveTab('community')}
          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>去社区广场发帖</span>
        </button>
      </div>

      {/* 1. 顶部 Tab 切换 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-2 shadow-2xs flex items-center gap-2">
        <button
          onClick={() => { setActiveSubTab('posts'); setSearchQuery(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'posts'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>我的帖子 ({posts.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('comments'); setSearchQuery(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'comments'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <CornerDownRight className="w-4 h-4" />
          <span>我的评论 ({comments.length})</span>
        </button>

        <button
          onClick={() => { setActiveSubTab('favorites'); setSearchQuery(''); }}
          className={`flex-1 py-2.5 rounded-xl text-xs font-black transition flex items-center justify-center gap-2 cursor-pointer ${
            activeSubTab === 'favorites'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>我的收藏 ({favorites.length})</span>
        </button>
      </div>

      {/* 2. 搜索与状态筛选栏 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* 状态筛选（仅在我的帖子tab展示） */}
        {activeSubTab === 'posts' ? (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold mr-1">审核状态:</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'published', label: `已发布 (${posts.filter(p => p.status === 'published').length})` },
              { id: 'reviewing', label: `审核中 (${posts.filter(p => p.status === 'reviewing').length})` },
              { id: 'rejected', label: `已驳回 (${posts.filter(p => p.status === 'rejected').length})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setPostStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  postStatusFilter === tab.id
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="text-xs font-bold text-slate-500">
            {activeSubTab === 'comments' ? '我的历史发表评论记录' : '我收藏的社区优质技术帖子'}
          </div>
        )}

        {/* 搜索框 */}
        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={activeSubTab === 'posts' ? '搜索我的帖子标题/内容...' : activeSubTab === 'comments' ? '搜索评论内容/原帖标题...' : '搜索收藏帖子/作者...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>
      </div>

      {/* =========================================================================
          TAB 1: 我的帖子
      ========================================================================= */}
      {activeSubTab === 'posts' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">暂无相关帖子</div>
              <p className="text-xs text-slate-400">
                您可以前往社区广场分享您的技术实践、经验心得或发起技术提问
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">帖子标题与概要</th>
                    <th className="py-3.5 px-4">所属板块</th>
                    <th className="py-3.5 px-4">审核状态</th>
                    <th className="py-3.5 px-4">互动数据</th>
                    <th className="py-3.5 px-4">发布时间</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {paginatedPosts.map((post) => {
                    const isPublished = post.status === 'published';
                    const isReviewing = post.status === 'reviewing';
                    const isRejected = post.status === 'rejected';

                    return (
                      <tr key={post.id} className="hover:bg-slate-50/70 transition-colors">
                        {/* 标题 */}
                        <td className="py-3.5 px-4 max-w-md">
                          <div className="space-y-1">
                            <div 
                              onClick={() => openPostDetailWithOrigin(post.id, 'workspace:community:posts')}
                              className="font-black text-slate-900 hover:text-indigo-600 transition-colors cursor-pointer line-clamp-1 text-sm"
                            >
                              {post.title}
                            </div>
                            <p className="text-slate-500 line-clamp-1 text-[11px]">
                              {post.content}
                            </p>
                            {isRejected && post.rejectReason && (
                              <div className="text-[11px] text-rose-600 bg-rose-50 p-1.5 rounded-lg border border-rose-100">
                                驳回原因: {post.rejectReason}
                              </div>
                            )}
                          </div>
                        </td>

                        {/* 所属板块 */}
                        <td className="py-3.5 px-4">
                          {(() => {
                            const boardObj = communityBoards.find(b => b.name === post.board);
                            const isBoardDisabled = boardObj?.status === '已停用';
                            return (
                              <div className="flex flex-col items-start gap-1">
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                                  {post.board}
                                </span>
                                {isBoardDisabled && (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200/80">
                                    板块已停用
                                  </span>
                                )}
                              </div>
                            );
                          })()}
                        </td>

                        {/* 状态 */}
                        <td className="py-3.5 px-4">
                          {isPublished && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              已发布
                            </span>
                          )}
                          {isReviewing && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
                              <Clock className="w-3 h-3 text-amber-600" />
                              审核中
                            </span>
                          )}
                          {isRejected && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              <AlertCircle className="w-3 h-3 text-rose-600" />
                              已驳回
                            </span>
                          )}
                        </td>

                        {/* 互动数据 */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3 text-[11px] text-slate-500">
                            <span className="flex items-center gap-0.5 text-rose-600" title="点赞数">
                              <Heart className="w-3.5 h-3.5 fill-rose-100" /> {post.likesCount}
                            </span>
                            <span className="flex items-center gap-0.5 text-indigo-600" title="评论数">
                              <MessageSquare className="w-3.5 h-3.5" /> {post.commentsCount}
                            </span>
                            <span className="flex items-center gap-0.5 text-amber-600" title="收藏数">
                              <Bookmark className="w-3.5 h-3.5" /> {post.collectsCount}
                            </span>
                          </div>
                        </td>

                        {/* 发布时间 */}
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                          {post.createdAt}
                        </td>

                        {/* 操作 */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openPostDetailWithOrigin(post.id, 'workspace:community:posts')}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                              title="查看帖子"
                            >
                              <Eye className="w-3 h-3" />
                              <span>查看帖子</span>
                            </button>
                            <button
                              onClick={() => {
                                setEditPostModal(post);
                                setEditForm({ title: post.title, content: post.content, board: post.board });
                              }}
                              className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                              title="编辑帖子"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>编辑</span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ type: 'post', id: post.id })}
                              className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                              title="删除帖子"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>

              {/* 分页组件 */}
              {renderPagination(postPage, totalPostPages, filteredPosts.length, setPostPage)}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 2: 我的评论
      ========================================================================= */}
      {activeSubTab === 'comments' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          {filteredComments.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CornerDownRight className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">暂无评论记录</div>
              <p className="text-xs text-slate-400">
                在社区帖子下发表您的独到见解，与其他开发者交流互动
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">评论内容</th>
                    <th className="py-3.5 px-4">所属原帖</th>
                    <th className="py-3.5 px-4">所属板块</th>
                    <th className="py-3.5 px-4">获赞</th>
                    <th className="py-3.5 px-4">评论时间</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {paginatedComments.map((comment) => (
                    <tr key={comment.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 评论内容 */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div className="font-bold text-slate-800 line-clamp-2 leading-relaxed">
                          {comment.content}
                        </div>
                      </td>

                      {/* 所属原帖 */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div 
                          onClick={() => openPostDetailWithOrigin(comment.postId, 'workspace:community:comments')}
                          className="font-bold text-indigo-600 hover:underline cursor-pointer line-clamp-1 flex items-center gap-1"
                          title="查看帖子"
                        >
                          <span>{comment.postTitle}</span>
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </div>
                      </td>

                      {/* 板块 */}
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-600">
                          {comment.board}
                        </span>
                      </td>

                      {/* 获赞 */}
                      <td className="py-3.5 px-4">
                        <span className="text-rose-600 font-bold flex items-center gap-1">
                          <Heart className="w-3.5 h-3.5 fill-rose-100" /> {comment.likesCount}
                        </span>
                      </td>

                      {/* 评论时间 */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {comment.createdAt}
                      </td>

                      {/* 操作 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPostDetailWithOrigin(comment.postId, 'workspace:community:comments')}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                            title="查看帖子"
                          >
                            <Eye className="w-3 h-3" />
                            <span>查看帖子</span>
                          </button>
                          <button
                            onClick={() => setDeleteConfirm({ type: 'comment', id: comment.id })}
                            className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                            title="删除评论"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 分页组件 */}
              {renderPagination(commentPage, totalCommentPages, filteredComments.length, setCommentPage)}
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          TAB 3: 我的收藏
      ========================================================================= */}
      {activeSubTab === 'favorites' && (
        <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
          {filteredFavorites.length === 0 ? (
            <div className="text-center py-16 px-4 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <div className="text-sm font-bold text-slate-700">暂无收藏内容</div>
              <p className="text-xs text-slate-400">
                在社区广场浏览时，点击帖子下方的书签图标即可将其加入收藏夹
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-3.5 px-4">帖子标题</th>
                    <th className="py-3.5 px-4">作者信息</th>
                    <th className="py-3.5 px-4">所属板块</th>
                    <th className="py-3.5 px-4">互动数据</th>
                    <th className="py-3.5 px-4">收藏时间</th>
                    <th className="py-3.5 px-4 text-right">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                  {paginatedFavorites.map((fav) => (
                    <tr key={fav.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* 标题 */}
                      <td className="py-3.5 px-4 max-w-sm">
                        <div 
                          onClick={() => openPostDetailWithOrigin(fav.postId, 'workspace:community:favorites')}
                          className="font-black text-slate-900 hover:text-emerald-600 cursor-pointer line-clamp-1 text-sm flex items-center gap-1"
                          title="查看帖子"
                        >
                          <span>{fav.postTitle}</span>
                          <ExternalLink className="w-3 h-3 text-slate-400 shrink-0" />
                        </div>
                      </td>

                      {/* 作者 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2">
                          <img 
                            src={fav.authorAvatar} 
                            alt={fav.authorName} 
                            className="w-5 h-5 rounded-full object-cover" 
                          />
                          <span className="text-slate-800 font-bold">{fav.authorName}</span>
                        </div>
                      </td>

                      {/* 所属板块 */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {fav.board}
                        </span>
                      </td>

                      {/* 互动数据 */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2 text-[11px] text-slate-400">
                          <span className="flex items-center gap-0.5 text-rose-500">
                            <Heart className="w-3.5 h-3.5" /> {fav.likesCount}
                          </span>
                          <span className="flex items-center gap-0.5 text-indigo-500">
                            <MessageSquare className="w-3.5 h-3.5" /> {fav.commentsCount}
                          </span>
                        </div>
                      </td>

                      {/* 收藏时间 */}
                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {fav.collectedAt}
                      </td>

                      {/* 操作 */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => openPostDetailWithOrigin(fav.postId, 'workspace:community:favorites')}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-xs transition cursor-pointer flex items-center gap-1"
                            title="查看帖子"
                          >
                            <Eye className="w-3 h-3" />
                            <span>查看帖子</span>
                          </button>
                          <button
                            onClick={() => handleRemoveFavorite(fav.id)}
                            className="px-2.5 py-1 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 font-bold text-xs transition cursor-pointer"
                          >
                            取消收藏
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* 分页组件 */}
              {renderPagination(favoritePage, totalFavoritePages, filteredFavorites.length, setFavoritePage)}
            </div>
          )}
        </div>
      )}

      {/* 4. 查看帖子详情弹窗 */}
      {viewPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {viewPostModal.board}
              </span>
              <button
                onClick={() => setViewPostModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3">
              <h3 className="text-base font-black text-slate-900 leading-snug">
                {viewPostModal.title}
              </h3>
              <div className="text-xs text-slate-400 flex items-center gap-2">
                <span>发布时间: {viewPostModal.createdAt}</span>
                <span>•</span>
                <span className="text-emerald-600 font-bold">{viewPostModal.statusLabel}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                {viewPostModal.content}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3 text-slate-500">
                <span className="flex items-center gap-1 text-rose-600 font-bold"><Heart className="w-3.5 h-3.5 fill-rose-100" /> {viewPostModal.likesCount} 点赞</span>
                <span className="flex items-center gap-1 text-indigo-600 font-bold"><MessageSquare className="w-3.5 h-3.5" /> {viewPostModal.commentsCount} 评论</span>
                <span className="flex items-center gap-1 text-amber-600 font-bold"><Bookmark className="w-3.5 h-3.5" /> {viewPostModal.collectsCount} 收藏</span>
              </div>
              <button
                onClick={() => setViewPostModal(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition cursor-pointer"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 5. 编辑帖子弹窗 */}
      {editPostModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl border border-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-indigo-600" />
                编辑社区帖子
              </h3>
              <button
                onClick={() => setEditPostModal(null)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-700">所属板块</label>
                  {communityBoards.find(b => b.name === editForm.board)?.status === '已停用' && (
                    <span className="text-[11px] font-bold text-rose-500">
                      （当前板块已停用，必须更换板块）
                    </span>
                  )}
                </div>
                <select
                  value={editForm.board}
                  onChange={(e) => setEditForm({ ...editForm, board: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-bold"
                >
                  {communityBoards.map(b => {
                    const isDisabled = b.status === '已停用';
                    return (
                      <option 
                        key={b.id} 
                        value={b.name}
                        disabled={isDisabled}
                        className={isDisabled ? "text-slate-400 bg-slate-100 italic" : "text-slate-900 font-semibold"}
                      >
                        {b.name}{isDisabled ? ' (已停用 - 不可选)' : ''}
                      </option>
                    );
                  })}
                </select>
                {communityBoards.find(b => b.name === editForm.board)?.status === '已停用' && (
                  <p className="text-[11px] text-amber-600 font-medium">
                    ⚠️ 当前所属板块已被系统停用，请选择其他已启用的板块后方可提交修改。
                  </p>
                )}
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">帖子标题</label>
                <input
                  type="text"
                  required
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-700">正文内容</label>
                <textarea
                  required
                  rows={5}
                  value={editForm.content}
                  onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 text-slate-900 font-medium leading-relaxed"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditPostModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-xs cursor-pointer"
                >
                  保存修改
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* 6. 删除确认弹窗 */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-black text-slate-900">
              确认删除该{deleteConfirm.type === 'post' ? '帖子' : '评论'}？
            </h3>
            <p className="text-xs text-slate-500">
              删除后此操作不可撤回，关联的互动数据将一并清理。
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs cursor-pointer shadow-xs"
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
