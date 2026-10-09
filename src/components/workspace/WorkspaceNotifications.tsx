import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bell, 
  CheckCheck, 
  MessageCircle, 
  Coins, 
  Cpu,
  Sparkles,
  Bot,
  Database,
  Zap,
  Briefcase,
  Trophy,
  ChevronLeft,
  ChevronRight,
  Filter
} from 'lucide-react';
import { AppNotification, NotificationTabType } from '../../types';

export const WorkspaceNotifications: React.FC = () => {
  const { 
    notifications, 
    markNotificationAsRead, 
    markNotificationsAsRead,
    markAllNotificationsRead
  } = useApp();

  const [activeTab, setActiveTab] = useState<NotificationTabType>('all');
  const [onlyUnread, setOnlyUnread] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // 3个Tab严格按照要求定义
  const tabs: { key: NotificationTabType; label: string; desc: string }[] = [
    { key: 'all', label: '全部消息', desc: '所有通知汇总，按时间倒序' },
    { key: 'business', label: '业务通知', desc: 'AI集市、任务大厅、算力工坊、赛事中心、账户相关' },
    { key: 'interaction', label: '社区互动', desc: '社区帖子相关的互动通知（点赞、评论、回复、收藏、加精）' },
  ];

  // 业务子分类映射配置
  const SUB_CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; badgeClass: string; iconBg: string }> = {
    agent: {
      label: 'AI集市 · Agent',
      icon: <Bot className="w-4 h-4 text-indigo-600" />,
      badgeClass: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
      iconBg: 'bg-indigo-100/80 text-indigo-700'
    },
    model: {
      label: 'AI集市 · 模型',
      icon: <Cpu className="w-4 h-4 text-violet-600" />,
      badgeClass: 'bg-violet-50 text-violet-700 border-violet-200/80',
      iconBg: 'bg-violet-100/80 text-violet-700'
    },
    dataset: {
      label: 'AI集市 · 数据集',
      icon: <Database className="w-4 h-4 text-sky-600" />,
      badgeClass: 'bg-sky-50 text-sky-700 border-sky-200/80',
      iconBg: 'bg-sky-100/80 text-sky-700'
    },
    skill: {
      label: 'AI集市 · Skill',
      icon: <Zap className="w-4 h-4 text-amber-600" />,
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200/80',
      iconBg: 'bg-amber-100/80 text-amber-700'
    },
    task: {
      label: '任务大厅',
      icon: <Briefcase className="w-4 h-4 text-blue-600" />,
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200/80',
      iconBg: 'bg-blue-100/80 text-blue-700'
    },
    compute: {
      label: '算力工坊',
      icon: <Cpu className="w-4 h-4 text-rose-600" />,
      badgeClass: 'bg-rose-50 text-rose-700 border-rose-200/80',
      iconBg: 'bg-rose-100/80 text-rose-700'
    },
    competition: {
      label: '赛事中心',
      icon: <Trophy className="w-4 h-4 text-purple-600" />,
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200/80',
      iconBg: 'bg-purple-100/80 text-purple-700'
    },
    account: {
      label: '账户相关',
      icon: <Coins className="w-4 h-4 text-emerald-600" />,
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
      iconBg: 'bg-emerald-100/80 text-emerald-700'
    },
    community: {
      label: '社区互动',
      icon: <MessageCircle className="w-4 h-4 text-teal-600" />,
      badgeClass: 'bg-teal-50 text-teal-700 border-teal-200/80',
      iconBg: 'bg-teal-100/80 text-teal-700'
    }
  };

  // 过滤通知列表
  const filtered = useMemo(() => {
    return notifications.filter(n => {
      // 彻底排除系统公告类通知
      if (n.category === ('system' as any) || n.type === ('system' as any) || n.subCategory === ('system' as any)) {
        return false;
      }
      // 明确排除关注者与@提醒类通知
      if (n.title.includes('关注者') || n.title.includes('@了您')) {
        return false;
      }
      if (activeTab !== 'all') {
        const itemCategory = n.category || (n.type === 'interaction' ? 'interaction' : 'business');
        if (itemCategory !== activeTab) return false;
      }
      if (onlyUnread && n.read) return false;
      return true;
    });
  }, [notifications, activeTab, onlyUnread]);

  // 总页数与当前页切片
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPageSafe = Math.min(currentPage, totalPages);

  const paginatedItems = useMemo(() => {
    const start = (currentPageSafe - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, currentPageSafe]);

  // 切换Tab或过滤条件时重置回第1页
  const handleTabChange = (key: NotificationTabType) => {
    setActiveTab(key);
    setCurrentPage(1);
  };

  // 自动已读逻辑：第1页加载时自动标记为已读，翻页后该页未读通知自动标记为已读
  useEffect(() => {
    const unreadIdsOnPage = paginatedItems.filter(n => !n.read).map(n => n.id);
    if (unreadIdsOnPage.length > 0) {
      const timer = setTimeout(() => {
        markNotificationsAsRead(unreadIdsOnPage);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [currentPageSafe, activeTab, paginatedItems, markNotificationsAsRead]);

  const totalUnreadCount = notifications.filter(n => 
    !n.read && 
    n.category !== ('system' as any) && 
    n.type !== ('system' as any) && 
    n.subCategory !== ('system' as any) &&
    !n.title.includes('关注者') &&
    !n.title.includes('@了您')
  ).length;

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>通知中心</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              消息网关
            </span>
            {totalUnreadCount > 0 && (
              <span className="text-xs px-2 py-0.5 rounded-full font-extrabold bg-red-500 text-white shadow-2xs">
                {totalUnreadCount} 未读
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            实时接收业务通知（AI集市、任务大厅、算力工坊、赛事中心、账户）与社区互动
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setOnlyUnread(!onlyUnread);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer border ${
              onlyUnread 
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700 shadow-2xs' 
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>仅看未读</span>
          </button>

          {totalUnreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <CheckCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>全部标记为已读</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Tabs: 全部消息、业务通知、社区互动 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-200 text-xs font-extrabold scrollbar-none">
        {tabs.map(t => {
          const unreadCount = notifications.filter(n => {
            if (n.category === ('system' as any) || n.type === ('system' as any) || n.subCategory === ('system' as any)) return false;
            if (t.key === 'all') return !n.read;
            const itemCategory = n.category || (n.type === 'interaction' ? 'interaction' : 'business');
            return itemCategory === t.key && !n.read;
          }).length;

          const totalCount = notifications.filter(n => {
            if (n.category === ('system' as any) || n.type === ('system' as any) || n.subCategory === ('system' as any)) return false;
            if (t.key === 'all') return true;
            const itemCategory = n.category || (n.type === 'interaction' ? 'interaction' : 'business');
            return itemCategory === t.key;
          }).length;

          const isActive = activeTab === t.key;

          return (
            <button
              key={t.key}
              onClick={() => handleTabChange(t.key)}
              title={t.desc}
              className={`pb-2.5 px-3.5 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isActive 
                  ? 'border-indigo-600 text-indigo-600 font-black' 
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <span>{t.label}</span>
              {unreadCount > 0 ? (
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold leading-tight ${
                  isActive ? 'bg-indigo-600 text-white' : 'bg-red-500 text-white'
                }`}>
                  {unreadCount}
                </span>
              ) : (
                <span className="text-[10px] text-slate-400 font-medium">
                  {totalCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 描述小提示 */}
      <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/60">
        <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
        <span>{tabs.find(t => t.key === activeTab)?.desc}</span>
      </div>

      {/* Notification List (10 items per page) */}
      <div className="space-y-3">
        {paginatedItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/90 text-slate-400 text-xs font-medium space-y-2">
            <Bell className="w-10 h-10 mx-auto text-slate-300 opacity-60" />
            <p className="text-slate-600 font-bold text-sm">暂无此类通知消息</p>
            <p className="text-slate-400 text-[11px]">
              {onlyUnread ? '当前分类下没有未读消息，可关闭“仅看未读”查看历史记录' : '最新变动或平台通知下发后将在此处实时呈现'}
            </p>
          </div>
        ) : (
          paginatedItems.map((n) => {
            const subKey = n.subCategory || (n.category === 'interaction' ? 'community' : 'task');
            const config = SUB_CATEGORY_CONFIG[subKey] || SUB_CATEGORY_CONFIG.task;

            return (
              <div
                key={n.id}
                onClick={() => {
                  if (!n.read) {
                    markNotificationAsRead(n.id);
                  }
                }}
                className={`p-4 sm:p-5 rounded-2xl border transition flex items-start gap-3.5 ${
                  !n.read 
                    ? 'bg-indigo-50/30 border-indigo-200 shadow-2xs' 
                    : 'bg-white border-slate-200/90'
                }`}
              >
                {/* Category Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 mt-0.5 shadow-2xs ${config.iconBg}`}>
                  {config.icon}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border ${config.badgeClass}`}>
                      {config.label}
                    </span>
                    <h4 className="text-xs sm:text-sm font-extrabold text-slate-900">
                      {n.title.includes('未通过验收') || n.title.includes('未被选中') ? '❌ 您的提交被驳回' : n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0" title="未读消息" />
                    )}
                  </div>

                  {/* Notification Content with Reason Highlighting if present */}
                  {(() => {
                    let contentText = n.content;
                    if (n.title.includes('未通过验收') || n.title.includes('未被选中') || n.title.includes('您的提交被驳回')) {
                      contentText = contentText
                        .replace('未通过验收。', '已被驳回。')
                        .replace('未被选中。', '已被驳回。');
                    }
                    
                    const hasReason = contentText.includes('驳回原因：') || contentText.includes('原因：');
                    
                    if (hasReason) {
                      const parts = contentText.split(/(驳回原因：|原因：)/);
                      return (
                        <div className="text-xs text-slate-600 font-normal leading-relaxed">
                          <span>{parts[0]}</span>
                          <span className="inline-block mt-1 p-2 bg-rose-50/80 border border-rose-200/80 rounded-xl text-rose-800 text-[11px] font-medium w-full">
                            <strong className="font-extrabold text-rose-700">驳回原因：</strong>
                            {parts.slice(2).join('') || parts[2] || ''}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <p className="text-xs text-slate-600 font-normal leading-relaxed whitespace-pre-line">
                        {contentText}
                      </p>
                    );
                  })()}

                  <div className="text-[11px] text-slate-400 font-medium pt-0.5">
                    {n.time}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* 分页控制栏 (10条/页) */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-200 text-xs text-slate-500">
          <div>
            共 <span className="font-bold text-slate-700">{filtered.length}</span> 条通知，每页 {PAGE_SIZE} 条，当前第 <span className="font-bold text-indigo-600">{currentPageSafe}</span> / {totalPages} 页
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPageSafe <= 1}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
                currentPageSafe <= 1 
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' 
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer bg-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>上一页</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-bold transition cursor-pointer flex items-center justify-center ${
                  currentPageSafe === pageNum
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPageSafe >= totalPages}
              className={`px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 transition ${
                currentPageSafe >= totalPages 
                  ? 'border-slate-200 text-slate-300 cursor-not-allowed bg-slate-50' 
                  : 'border-slate-200 text-slate-700 hover:bg-slate-100 cursor-pointer bg-white'
              }`}
            >
              <span>下一页</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
