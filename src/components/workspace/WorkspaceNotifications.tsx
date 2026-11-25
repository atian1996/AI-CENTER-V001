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

  // 业务子分类映射配置（图标与分类标签全部统一为极简深灰线框 + 极浅灰底）
  const SUB_CATEGORY_CONFIG: Record<string, { label: string; icon: React.ReactNode; badgeClass: string; iconBg: string }> = {
    agent: {
      label: 'AI集市 · Agent',
      icon: <Bot className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
    },
    model: {
      label: 'AI集市 · 模型',
      icon: <Cpu className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
    },
    dataset: {
      label: 'AI集市 · 数据集',
      icon: <Database className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
    },
    skill: {
      label: 'AI集市 · Skill',
      icon: <Zap className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
    },
    task: {
      label: '任务大厅',
      icon: <Briefcase className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
    },
    compute: {
      label: '算力工坊',
      icon: <Cpu className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
    },
    competition: {
      label: '赛事中心',
      icon: <Trophy className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
    },
    account: {
      label: '账户相关',
      icon: <Coins className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
    },
    community: {
      label: '社区互动',
      icon: <MessageCircle className="w-4 h-4 text-[#333333]" />,
      badgeClass: 'bg-[#F5F5F5] text-[#555555] border-[#EAEAEA]',
      iconBg: 'bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333]'
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#1A1A1A]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2.5">
            <span>通知中心</span>
            <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-[#F5F5F5] text-[#555555] border border-[#EAEAEA]">
              消息网关
            </span>
            {totalUnreadCount > 0 && (
              <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-[#991B1B] text-white tabular-nums">
                {totalUnreadCount} 未读
              </span>
            )}
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            实时接收业务通知（AI集市、任务大厅、算力工坊、赛事中心、账户）与社区互动
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              setOnlyUnread(!onlyUnread);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1.5 cursor-pointer border ${
              onlyUnread 
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white' 
                : 'bg-white border-[#EAEAEA] text-[#555555] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>仅看未读</span>
          </button>

          {totalUnreadCount > 0 && (
            <button
              onClick={markAllNotificationsRead}
              className="px-3.5 py-1.5 rounded-md bg-white hover:bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333] text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCheck className="w-3.5 h-3.5 text-[#333333]" />
              <span>全部标记为已读</span>
            </button>
          )}
        </div>
      </div>

      {/* 3 Tabs: 全部消息、业务通知、社区互动 */}
      <div className="flex items-center gap-6 overflow-x-auto border-b border-[#EAEAEA] text-xs scrollbar-none">
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
              className={`pb-3 px-1 border-b-2 transition cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                isActive 
                  ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold' 
                  : 'border-transparent text-[#666666] hover:text-[#1A1A1A] font-medium'
              }`}
            >
              <span>{t.label}</span>
              {unreadCount > 0 ? (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full font-semibold leading-tight bg-[#991B1B] text-white tabular-nums">
                  {unreadCount}
                </span>
              ) : (
                <span className="text-[11px] text-[#888888] font-mono tabular-nums">
                  {totalCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab 描述小提示 */}
      <div className="text-[11px] text-[#666666] flex items-center gap-2 bg-[#FAFAFA] px-3.5 py-2 rounded-md border border-[#EAEAEA]">
        <Bell className="w-3.5 h-3.5 text-[#666666] shrink-0" />
        <span>{tabs.find(t => t.key === activeTab)?.desc}</span>
      </div>

      {/* Notification List (10 items per page) */}
      <div className="space-y-3">
        {paginatedItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-md border border-[#EAEAEA] text-[#888888] text-xs space-y-2">
            <Bell className="w-9 h-9 mx-auto text-[#CCCCCC]" />
            <p className="text-[#333333] font-semibold text-sm">暂无此类通知消息</p>
            <p className="text-[#888888] text-[11px]">
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
                className={`p-4 sm:p-5 rounded-md border transition flex items-start gap-3.5 ${
                  !n.read 
                    ? 'bg-[#FAFAFA] border-[#D4D4D4]' 
                    : 'bg-white border-[#EAEAEA]'
                }`}
              >
                {/* Category Icon（统一深灰线框） */}
                <div className={`w-9 h-9 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${config.iconBg}`}>
                  {config.icon}
                </div>

                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-medium border ${config.badgeClass}`}>
                      {config.label}
                    </span>
                    <h4 className="text-xs sm:text-sm font-semibold text-[#1A1A1A]">
                      {n.title.includes('未通过验收') || n.title.includes('未被选中') ? '您的提交被驳回' : n.title}
                    </h4>
                    {!n.read && (
                      <span className="w-2 h-2 rounded-full bg-[#991B1B] shrink-0" title="未读消息" />
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
                        <div className="text-xs text-[#555555] leading-relaxed">
                          <span>{parts[0]}</span>
                          <span className="inline-block mt-1.5 p-2.5 bg-[#FAFAFA] border border-[#EAEAEA] border-l-[3px] border-l-[#991B1B] rounded text-[#333333] text-[11px] w-full">
                            <strong className="font-semibold text-[#991B1B]">驳回原因：</strong>
                            {parts.slice(2).join('') || parts[2] || ''}
                          </span>
                        </div>
                      );
                    }

                    return (
                      <p className="text-xs text-[#555555] leading-relaxed whitespace-pre-line">
                        {contentText}
                      </p>
                    );
                  })()}

                  <div className="text-[11px] text-[#888888] font-mono tabular-nums pt-0.5">
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
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#EAEAEA] text-xs text-[#666666]">
          <div>
            共 <span className="font-semibold text-[#1A1A1A] tabular-nums">{filtered.length}</span> 条通知，每页 {PAGE_SIZE} 条，当前第 <span className="font-semibold text-[#1A1A1A] tabular-nums">{currentPageSafe}</span> / {totalPages} 页
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPageSafe <= 1}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium flex items-center gap-1 transition ${
                currentPageSafe <= 1 
                  ? 'border-[#EAEAEA] text-[#CCCCCC] cursor-not-allowed bg-[#FAFAFA]' 
                  : 'border-[#EAEAEA] text-[#333333] hover:bg-[#F5F5F5] cursor-pointer bg-white'
              }`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>上一页</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-md text-xs font-medium font-mono tabular-nums transition cursor-pointer flex items-center justify-center border ${
                  currentPageSafe === pageNum
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                    : 'bg-white border-[#EAEAEA] text-[#555555] hover:bg-[#F5F5F5]'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPageSafe >= totalPages}
              className={`px-3 py-1.5 rounded-md border text-xs font-medium flex items-center gap-1 transition ${
                currentPageSafe >= totalPages 
                  ? 'border-[#EAEAEA] text-[#CCCCCC] cursor-not-allowed bg-[#FAFAFA]' 
                  : 'border-[#EAEAEA] text-[#333333] hover:bg-[#F5F5F5] cursor-pointer bg-white'
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
