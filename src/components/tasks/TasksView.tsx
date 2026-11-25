import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import {
  Plus,
  Search,
  Clock,
  Layers,
  FileText,
  X,
  ArrowUpDown,
  Award,
  Code,
  Cpu,
  CheckCircle2,
  ArrowRight,
  Zap,
  Palette,
  UserCheck,
  Check
} from 'lucide-react';
import { TaskDetailSubPage } from './TaskDetailSubPage';
import { UserTaskPublishForm } from './UserTaskPublishForm';

export const TasksView: React.FC = () => {
  const { 
    tasks, 
    user, 
    publishTaskModalOpen, 
    setPublishTaskModalOpen,
    selectedTaskIdForDetail,
    setSelectedTaskIdForDetail
  } = useApp();

  // 搜索与过滤状态
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('全部'); // 全部 / 进行中 / 已结束
  const [selectedMyStatus, setSelectedMyStatus] = useState<string>('全部'); // 全部 / 我已接单 / 未接单 / 我发布的
  const [selectedDomain, setSelectedDomain] = useState<string>('全部'); // 全部 / 技术开发 / 内容创作 / AI模型与数据 / 工具与自动化 / 咨询与培训
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('全部'); // 全部 / 简单 / 中等 / 困难
  const [sortBy, setSortBy] = useState<'latest' | 'deadline' | 'reward'>('latest'); // 最新发布 / 即将截止 / 奖励最高

  // 二级页面控制
  const [detailTaskId, setDetailTaskId] = useState<string | null>(selectedTaskIdForDetail);
  const [isPublishingTask, setIsPublishingTask] = useState<boolean>(false);

  React.useEffect(() => {
    if (selectedTaskIdForDetail) {
      setDetailTaskId(selectedTaskIdForDetail);
    }
  }, [selectedTaskIdForDetail]);

  // 判断是否为当前登录用户
  const isCurrentUser = (name?: string) => {
    if (!name) return false;
    return name === user.name || name.includes('你') || name.includes('极客小千');
  };

  // 判断任务大状态 (进行中 VS 已结束)
  const isTaskFinished = (task: TaskItem) => {
    return (
      task.status === '已结束' ||
      task.status === '已验收' ||
      (task.remainingDays !== undefined && task.remainingDays <= 0) ||
      task.isAccepted === true ||
      !!task.winner ||
      (task.submissions || []).some(s => s.status === '已通过')
    );
  };

  // 任务大厅只展示审核通过并在架展示的任务
  const publicTasks = useMemo(() => {
    return tasks.filter(t => t.status === '进行中' || t.status === '已结束' || t.status === '已验收' || t.status === '已发布');
  }, [tasks]);

  // 领域定义及统计
  const domainsList = [
    { id: '全部', label: '全部领域', icon: Layers },
    { id: '技术开发', label: '技术开发', icon: Code },
    { id: 'AI模型与数据', label: 'AI模型与数据', icon: Cpu },
    { id: '工具与自动化', label: '工具与自动化', icon: Zap },
    { id: '内容创作', label: '内容创作', icon: Palette },
    { id: '咨询与培训', label: '咨询与培训', icon: Award }
  ];

  // 过滤与排序
  const filteredTasks = useMemo(() => {
    return publicTasks.filter(task => {
      const myTakerRecord = (task.takers || []).find(tk => isCurrentUser(tk.username));
      const hasTaken = !!myTakerRecord;
      const isPublisher = isCurrentUser(task.publisher);

      // 接单状态过滤 (全部 / 我已接单 / 未接单 / 我发布的)
      if (selectedMyStatus === '我已接单' && !hasTaken) return false;
      if (selectedMyStatus === '未接单' && (hasTaken || isPublisher)) return false;
      if (selectedMyStatus === '我发布的' && !isPublisher) return false;

      // 搜索匹配 (标题、描述、发布者模糊匹配)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = task.title.toLowerCase().includes(q);
        const matchDesc = (task.brief || task.description || '').toLowerCase().includes(q);
        const matchPublisher = (task.publisher || '').toLowerCase().includes(q);
        if (!matchTitle && !matchDesc && !matchPublisher) return false;
      }

      // 任务状态筛选 (全部 / 进行中 / 已结束)
      const finished = isTaskFinished(task);
      if (selectedStatus === '进行中' && finished) return false;
      if (selectedStatus === '已结束' && !finished) return false;

      // 所属领域筛选
      if (selectedDomain !== '全部' && task.domain !== selectedDomain) {
        return false;
      }

      // 任务难度筛选
      if (selectedDifficulty !== '全部' && task.difficulty !== selectedDifficulty) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'reward') {
        const rewardA = (a.cashReward || 0) + (a.pointsReward || 0);
        const rewardB = (b.cashReward || 0) + (b.pointsReward || 0);
        return rewardB - rewardA;
      }
      if (sortBy === 'deadline') {
        return (a.remainingDays || 14) - (b.remainingDays || 14);
      }
      // 最新发布
      return new Date(b.publishTime || b.startTime || Date.now()).getTime() - new Date(a.publishTime || a.startTime || Date.now()).getTime();
    });
  }, [publicTasks, searchQuery, selectedStatus, selectedMyStatus, selectedDomain, selectedDifficulty, sortBy, user.name]);

  const difficultiesList = ['全部', '简单', '中等', '困难'];
  const statusesList = ['全部', '进行中', '已结束'];
  const myStatusList = [
    { id: '全部', label: '全部任务' },
    { id: '我已接单', label: '我已接单' },
    { id: '未接单', label: '未接单' },
    { id: '我发布的', label: '我发布的' }
  ];

  // 计算我接单的任务数
  const myTakenTasksCount = useMemo(() => {
    return publicTasks.filter(t => (t.takers || []).some(tk => isCurrentUser(tk.username))).length;
  }, [publicTasks, user.name]);

  // 重置筛选
  const handleResetFilters = () => {
    setSelectedStatus('全部');
    setSelectedMyStatus('全部');
    setSelectedDomain('全部');
    setSelectedDifficulty('全部');
    setSearchQuery('');
    setSortBy('latest');
  };

  const hasActiveFilters = selectedStatus !== '全部' || selectedMyStatus !== '全部' || selectedDomain !== '全部' || selectedDifficulty !== '全部' || !!searchQuery.trim() || sortBy !== 'latest';

  // If UserTaskPublishForm subpage is active, render UserTaskPublishForm
  if (isPublishingTask || publishTaskModalOpen) {
    return (
      <UserTaskPublishForm
        onBack={() => {
          setIsPublishingTask(false);
          setPublishTaskModalOpen(false);
        }}
      />
    );
  }

  // If Detail Subpage is active, render TaskDetailSubPage
  if (detailTaskId) {
    return (
      <TaskDetailSubPage
        taskId={detailTaskId}
        onBack={() => {
          setDetailTaskId(null);
          setSelectedTaskIdForDetail(null);
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-[1320px] mx-auto space-y-6 animate-fade-in pb-16 pt-2 select-none font-sans antialiased">
      {/* 1. Unified Page Header */}
      <header className="pb-8 border-b border-[var(--border-light)] flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[var(--text-main)] leading-tight">
            AI 商业交付中心
          </h1>
          <p className="text-[14px] text-[var(--text-sub)] leading-[1.6]">
            连接企业真实业务场景与认证开发者。在线承接大模型开发与工程调优任务，实现从技术实战到商业变现的闭环。
          </p>
        </div>

        <button
          onClick={() => setIsPublishingTask(true)}
          className="px-4 py-2 rounded-[4px] bg-[var(--brand-color)] hover:opacity-80 text-[#FFFFFF] font-medium text-[13px] flex items-center gap-2 cursor-pointer transition-opacity shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>发布新需求任务</span>
        </button>
      </header>

      {/* 2. 领域快捷筛选栏 */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {domainsList.map(dom => {
          const Icon = dom.icon;
          const isActive = selectedDomain === dom.id;
          const count = dom.id === '全部'
            ? publicTasks.length
            : publicTasks.filter(t => t.domain === dom.id).length;

          return (
            <button
              key={dom.id}
              onClick={() => setSelectedDomain(dom.id)}
              className={`px-3.5 py-2 rounded-[4px] text-[13px] font-medium transition-colors flex items-center gap-2 shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-[var(--text-main)] text-[#FFFFFF] border-[var(--text-main)]'
                  : 'bg-[var(--bg-card)] text-[var(--text-sub)] hover:text-[var(--text-main)] border-[var(--border-light)] hover:border-[var(--border-dark)]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFFFFF]' : 'text-[var(--text-muted)]'}`} />
              <span>{dom.label}</span>
              <span className={`text-[12px] tabular-nums ${
                isActive ? 'text-[#FFFFFF]/80' : 'text-[var(--text-muted)]'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. 高级搜索与筛选控制栏 */}
      <div className="bg-[var(--bg-card)] rounded-[6px] p-4 border border-[var(--border-light)] space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索任务标题、需求描述或发布者 (按回车或即时匹配)"
              className="w-full pl-10 pr-9 py-2 bg-[var(--bg-page)] border border-[var(--border-light)] rounded-[4px] text-[var(--text-main)] text-[13px] outline-none focus:bg-[var(--bg-card)] focus:border-[var(--border-dark)] transition-colors placeholder:text-[var(--text-muted)]"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-[var(--text-muted)] hover:text-[var(--text-main)] cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 右侧组合筛选与排序 */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 我的接单状态筛选 */}
            <div className="flex items-center bg-[var(--bg-page)] p-1 rounded-[4px] border border-[var(--border-light)] shrink-0">
              {myStatusList.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMyStatus(item.id)}
                  className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    selectedMyStatus === item.id
                      ? 'bg-[var(--text-main)] text-[#FFFFFF]'
                      : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {item.id === '我已接单' && (
                    <CheckCircle2 className={`w-3.5 h-3.5 ${selectedMyStatus === item.id ? 'text-[#FFFFFF]' : 'text-[var(--text-main)]'}`} />
                  )}
                  <span>{item.label}</span>
                  {item.id === '我已接单' && myTakenTasksCount > 0 && (
                    <span className={`text-[11px] tabular-nums ${
                      selectedMyStatus === item.id ? 'text-[#FFFFFF]/80' : 'text-[var(--text-muted)]'
                    }`}>
                      {myTakenTasksCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 任务状态切换 (全部 / 进行中 / 已结束) */}
            <div className="flex items-center bg-[var(--bg-page)] p-1 rounded-[4px] border border-[var(--border-light)] shrink-0">
              {statusesList.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium transition-colors cursor-pointer ${
                    selectedStatus === s
                      ? 'bg-[var(--text-main)] text-[#FFFFFF]'
                      : 'text-[var(--text-sub)] hover:text-[var(--text-main)]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* 难度筛选 */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-page)] border border-[var(--border-light)] px-3 py-1.5 rounded-[4px] shrink-0">
              <Award className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-transparent text-[var(--text-main)] text-[12px] font-medium outline-none cursor-pointer pr-1"
              >
                {difficultiesList.map(df => (
                  <option key={df} value={df}>{df === '全部' ? '全部难度' : `${df}难度`}</option>
                ))}
              </select>
            </div>

            {/* 排序规则 */}
            <div className="flex items-center gap-1.5 bg-[var(--bg-page)] border border-[var(--border-light)] px-3 py-1.5 rounded-[4px] shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-[var(--text-muted)]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[var(--text-main)] text-[12px] font-medium outline-none cursor-pointer pr-1"
              >
                <option value="latest">最新发布</option>
                <option value="deadline">即将截止</option>
                <option value="reward">奖励金额最高</option>
              </select>
            </div>

            {/* 重置按钮 */}
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-2.5 py-1.5 text-[12px] font-medium text-[var(--text-main)] border border-[var(--border-light)] hover:border-[var(--border-dark)] bg-transparent rounded-[4px] transition-colors cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>重置</span>
              </button>
            )}
          </div>
        </div>

        {/* 筛选结果概况条 */}
        <div className="flex items-center justify-between text-[12px] text-[var(--text-sub)] pt-2.5 border-t border-[var(--border-light)]">
          <div>
            共筛选出 <span className="font-semibold text-[var(--text-main)] tabular-nums">{filteredTasks.length}</span> 个符合条件的需求任务
            {selectedMyStatus !== '全部' && <span className="ml-2 text-[var(--text-main)] font-medium">· 接单状态: {selectedMyStatus}</span>}
            {selectedStatus !== '全部' && <span className="ml-2 text-[var(--text-sub)]">· 任务状态: {selectedStatus}</span>}
            {selectedDomain !== '全部' && <span className="ml-2 text-[var(--text-sub)]">· 领域: {selectedDomain}</span>}
            {selectedDifficulty !== '全部' && <span className="ml-2 text-[var(--text-sub)]">· 难度: {selectedDifficulty}</span>}
          </div>
          <span className="text-[var(--text-muted)] hidden sm:inline">点击任意卡片即可查看任务要求及接单交付</span>
        </div>
      </div>

      {/* 4. 任务卡片列表 */}
      {filteredTasks.length === 0 ? (
        <div className="bg-[var(--bg-card)] rounded-[6px] p-16 text-center border border-[var(--border-light)] space-y-3.5">
          <div className="w-12 h-12 rounded-[6px] bg-[var(--bg-hover)] flex items-center justify-center text-[var(--text-muted)] mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-[16px] font-semibold text-[var(--text-main)]">暂无匹配的任务需求</h3>
          <p className="text-[13px] text-[var(--text-sub)] max-w-sm mx-auto leading-relaxed">
            未检索到符合当前筛选条件的任务，您可以重置筛选条件或发布新的专属定制需求
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-[4px] bg-transparent border border-[var(--border-light)] hover:border-[var(--border-dark)] text-[var(--text-main)] text-[13px] font-medium transition-colors cursor-pointer"
              >
                重置筛选
              </button>
            )}
            <button
              onClick={() => setIsPublishingTask(true)}
              className="px-4 py-2 rounded-[4px] bg-[var(--brand-color)] hover:opacity-80 text-[#FFFFFF] text-[13px] font-medium transition-opacity cursor-pointer"
            >
              发布新任务需求
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredTasks.map(task => {
            const myTakerRecord = (task.takers || []).find(tk => isCurrentUser(tk.username));
            const hasTaken = !!myTakerRecord;
            const isPublisher = isCurrentUser(task.publisher);
            const acceptedNum = (task.takers || []).length || task.acceptedCount || 0;
            const submittedNum = (task.submissions || []).length || task.submittedCount || 0;
            const finished = isTaskFinished(task);

            return (
              <div
                key={task.id}
                onClick={() => setDetailTaskId(task.id)}
                className={`bg-[var(--bg-card)] rounded-[6px] border border-[var(--border-light)] hover:border-[var(--border-dark)] transition-colors flex flex-col justify-between p-6 group cursor-pointer ${
                  finished ? 'opacity-75 hover:opacity-100' : ''
                }`}
              >
                {/* 上半区：标题 + 状态 + 标签 + 简介 */}
                <div className="space-y-3.5">
                  <div className="flex items-start justify-between gap-2.5">
                    <h3 className="text-[16px] font-semibold text-[var(--text-main)] line-clamp-1 flex-1 leading-snug">
                      {task.title}
                    </h3>

                    {/* 右上角极简黑白灰状态标识 */}
                    <div className="shrink-0 flex items-center gap-1.5">
                      {hasTaken ? (
                        <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-medium bg-[var(--text-main)] text-[#FFFFFF] inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>
                            {myTakerRecord?.status === '已验收'
                              ? '我已接单 · 已验收'
                              : myTakerRecord?.status === '已提交'
                              ? '我已接单 · 待验收'
                              : myTakerRecord?.status === '已驳回'
                              ? '我已接单 · 需修改'
                              : '我已接单'}
                          </span>
                        </span>
                      ) : isPublisher ? (
                        <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-medium bg-[var(--bg-hover)] text-[var(--text-main)] inline-flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>我发布的</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-[var(--bg-hover)] text-[var(--text-sub)]">
                          未接单
                        </span>
                      )}

                      {finished ? (
                        <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-[var(--bg-hover)] text-[var(--text-sub)]">
                          已结束
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-medium bg-[var(--text-main)] text-[#FFFFFF]">
                          进行中
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 属性标签栏 (领域 / 难度 / 接单时间 / 剩余天数) */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-[var(--bg-hover)] text-[var(--text-sub)]">
                      {task.domain}
                    </span>
                    <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-[var(--bg-hover)] text-[var(--text-sub)]">
                      {task.difficulty}难度
                    </span>
                    {hasTaken && (
                      <span className="px-2 py-0.5 rounded-[4px] text-[12px] font-normal bg-[var(--bg-hover)] text-[var(--text-main)] inline-flex items-center gap-1">
                        <Check className="w-3 h-3" />
                        <span>{myTakerRecord?.takeTime ? `${myTakerRecord.takeTime.split(' ')[0]} 接单` : '已接单参与'}</span>
                      </span>
                    )}
                    <span className="text-[var(--text-muted)] text-[12px] ml-auto inline-flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3" />
                      {finished ? '已结束' : `剩余 ${task.remainingDays || 14} 天`}
                    </span>
                  </div>

                  {/* 需求简介 */}
                  <p className="text-[14px] text-[var(--text-sub)] leading-[1.6] line-clamp-2 min-h-[44px]">
                    {task.brief || task.description.replace(/<[^>]+>/g, '').substring(0, 80)}
                  </p>
                </div>

                {/* 下半区：严格 2 列网格对齐（左：赏金金额；右：接单态势） */}
                <div className="mt-5 pt-4 border-t border-[var(--border-light)] space-y-4">
                  <div className="grid grid-cols-2 items-end gap-4">
                    <div>
                      <div className="text-[12px] text-[var(--text-sub)]">悬赏金额</div>
                      <div className="text-[20px] font-bold text-[var(--text-main)] tabular-nums leading-tight mt-1">
                        ¥ {(task.cashReward || 0).toLocaleString()}
                      </div>
                      {(task.pointsReward || 0) > 0 && (
                        <div className="text-[12px] text-[var(--text-sub)] mt-0.5 tabular-nums">
                          +{task.pointsReward}积分
                        </div>
                      )}
                    </div>

                    <div className="text-right">
                      <div className="text-[12px] text-[var(--text-sub)]">接单态势</div>
                      <div className="text-[12px] text-[var(--text-sub)] mt-1.5 tabular-nums">
                        <span className="font-semibold text-[var(--text-main)]">{acceptedNum}</span> 接单
                        <span className="mx-1 text-[var(--text-muted)]">/</span>
                        <span className="font-semibold text-[var(--text-main)]">{submittedNum}</span> 交付
                      </div>
                    </div>
                  </div>

                  {/* 底栏：发布者信息 + 任务详情按钮固定在右下角 */}
                  <div className="pt-3.5 border-t border-[var(--border-light)] flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <img
                        src={task.publisherAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                        alt={task.publisher}
                        className="w-6 h-6 rounded-full object-cover border border-[var(--border-light)] shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-[13px] font-medium text-[var(--text-main)] truncate max-w-[130px] leading-tight">
                          {task.publisher}
                        </span>
                        <span className="text-[11px] text-[var(--text-muted)] leading-none mt-0.5">
                          {isPublisher ? '我发布的' : '需求雇主'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailTaskId(task.id);
                      }}
                      className="px-3 py-1.5 rounded-[4px] border border-[var(--border-dark)] bg-transparent text-[var(--text-main)] hover:bg-[var(--text-main)] hover:text-[#FFFFFF] font-medium text-[12px] transition-colors cursor-pointer inline-flex items-center gap-1 shrink-0"
                    >
                      <span>任务详情</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
