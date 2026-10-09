import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import {
  Plus,
  Search,
  Sparkles,
  Briefcase,
  Clock,
  Layers,
  FileText,
  X,
  ArrowUpDown,
  Award,
  Code,
  Cpu,
  Coins,
  CheckCircle2,
  Users,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Flame,
  Zap,
  Palette,
  UserCheck,
  CircleDot,
  XCircle,
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

  // 根据领域获取清爽亮色渐变与主题色配置
  const getDomainTheme = (domain: string) => {
    switch (domain) {
      case '技术开发':
        return {
          badge: 'bg-blue-50 text-blue-700 border-blue-200/80',
          gradientBar: 'from-blue-500 via-indigo-500 to-cyan-500',
          accentLight: 'bg-gradient-to-br from-blue-50/80 via-indigo-50/40 to-white',
          borderHover: 'hover:border-blue-400 hover:shadow-blue-500/10',
          btnBg: 'bg-blue-600 hover:bg-blue-700',
          iconColor: 'text-blue-600'
        };
      case 'AI模型与数据':
        return {
          badge: 'bg-indigo-50 text-indigo-700 border-indigo-200/80',
          gradientBar: 'from-indigo-500 via-purple-500 to-pink-500',
          accentLight: 'bg-gradient-to-br from-indigo-50/80 via-purple-50/40 to-white',
          borderHover: 'hover:border-indigo-400 hover:shadow-indigo-500/10',
          btnBg: 'bg-indigo-600 hover:bg-indigo-700',
          iconColor: 'text-indigo-600'
        };
      case '工具与自动化':
        return {
          badge: 'bg-cyan-50 text-cyan-700 border-cyan-200/80',
          gradientBar: 'from-cyan-500 via-teal-500 to-emerald-500',
          accentLight: 'bg-gradient-to-br from-cyan-50/80 via-teal-50/40 to-white',
          borderHover: 'hover:border-cyan-400 hover:shadow-cyan-500/10',
          btnBg: 'bg-cyan-600 hover:bg-cyan-700',
          iconColor: 'text-cyan-600'
        };
      case '内容创作':
        return {
          badge: 'bg-pink-50 text-pink-700 border-pink-200/80',
          gradientBar: 'from-pink-500 via-rose-500 to-amber-500',
          accentLight: 'bg-gradient-to-br from-pink-50/80 via-rose-50/40 to-white',
          borderHover: 'hover:border-pink-400 hover:shadow-pink-500/10',
          btnBg: 'bg-pink-600 hover:bg-pink-700',
          iconColor: 'text-pink-600'
        };
      default:
        return {
          badge: 'bg-amber-50 text-amber-700 border-amber-200/80',
          gradientBar: 'from-amber-500 via-orange-500 to-rose-500',
          accentLight: 'bg-gradient-to-br from-amber-50/80 via-orange-50/40 to-white',
          borderHover: 'hover:border-amber-400 hover:shadow-amber-500/10',
          btnBg: 'bg-amber-600 hover:bg-amber-700',
          iconColor: 'text-amber-600'
        };
    }
  };

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
    <div className="w-full space-y-6 animate-fade-in pb-16 select-none font-sans">
      
      {/* 1. Standard Unified Page Header (统一前台菜单风格) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              任务大厅
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                需求悬赏 · 极客接单
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              汇聚高质量 AI 开发、模型调优与工程交付需求，在线接单交付，高额赏金撮合验收
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsPublishingTask(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02] shrink-0 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>发布新需求任务</span>
        </button>
      </div>

      {/* 2. 领域快捷筛选分类胶囊栏 */}
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
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shrink-0 cursor-pointer border ${
                isActive
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
                  : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200/90 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              <span>{dom.label}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 3. 高级搜索与筛选控制栏 */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/90 shadow-2xs space-y-3.5">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* 搜索框 */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索任务标题、需求描述或发布者 (按回车或即时匹配)"
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-slate-400"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 右侧组合筛选下拉与排序 */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* 我的接单状态筛选 */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
              {myStatusList.map(item => (
                <button
                  key={item.id}
                  onClick={() => setSelectedMyStatus(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedMyStatus === item.id
                      ? item.id === '我已接单'
                        ? 'bg-emerald-600 text-white shadow-2xs font-extrabold'
                        : 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {item.id === '我已接单' && <CheckCircle2 className={`w-3.5 h-3.5 ${selectedMyStatus === item.id ? 'text-white' : 'text-emerald-600'}`} />}
                  <span>{item.label}</span>
                  {item.id === '我已接单' && myTakenTasksCount > 0 && (
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                      selectedMyStatus === item.id ? 'bg-white/25 text-white' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {myTakenTasksCount}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* 任务状态切换 (全部 / 进行中 / 已结束) */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/80 shrink-0">
              {statusesList.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedStatus === s
                      ? 'bg-white text-slate-900 shadow-2xs font-extrabold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* 难度筛选 */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
              <Award className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="bg-transparent text-slate-800 text-xs font-bold outline-none cursor-pointer pr-1"
              >
                {difficultiesList.map(df => (
                  <option key={df} value={df}>{df === '全部' ? '全部难度' : `${df}难度`}</option>
                ))}
              </select>
            </div>

            {/* 排序规则 */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl shrink-0">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-slate-800 text-xs font-bold outline-none cursor-pointer pr-1"
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
                className="px-2.5 py-1.5 text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition cursor-pointer flex items-center gap-1"
              >
                <X className="w-3 h-3" />
                <span>重置</span>
              </button>
            )}
          </div>
        </div>

        {/* 筛选结果概况条 */}
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500 pt-2 border-t border-slate-100">
          <div>
            共筛选出 <span className="font-bold text-indigo-600">{filteredTasks.length}</span> 个符合条件的需求任务
            {selectedMyStatus !== '全部' && <span className="ml-2 text-emerald-600 font-bold">· 接单状态: {selectedMyStatus}</span>}
            {selectedStatus !== '全部' && <span className="ml-2 text-slate-400">· 任务状态: {selectedStatus}</span>}
            {selectedDomain !== '全部' && <span className="ml-2 text-slate-400">· 领域: {selectedDomain}</span>}
            {selectedDifficulty !== '全部' && <span className="ml-2 text-slate-400">· 难度: {selectedDifficulty}</span>}
          </div>
          <span className="text-slate-400 hidden sm:inline">点击任意卡片即可查看任务要求及接单交付</span>
        </div>
      </div>

      {/* 4. 任务卡片列表 (高质感炫酷明亮卡片设计，清晰展示接单标识) */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center border border-slate-200/90 shadow-2xs space-y-3.5">
          <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mx-auto">
            <FileText className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-800">暂无匹配的任务需求</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            未检索到符合当前筛选条件的任务，您可以重置筛选条件或发布新的专属定制需求
          </p>
          <div className="flex items-center justify-center gap-3 pt-2">
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                重置筛选
              </button>
            )}
            <button
              onClick={() => setIsPublishingTask(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition cursor-pointer"
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
            const theme = getDomainTheme(task.domain);

            return (
              <div
                key={task.id}
                onClick={() => setDetailTaskId(task.id)}
                className={`relative bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer shadow-xs ${
                  hasTaken
                    ? 'border-emerald-400/90 ring-2 ring-emerald-500/20 bg-gradient-to-b from-emerald-50/20 via-white to-white hover:border-emerald-500 hover:shadow-xl hover:-translate-y-1'
                    : isPublisher
                    ? 'border-amber-300 ring-1 ring-amber-400/20 bg-gradient-to-b from-amber-50/15 via-white to-white hover:border-amber-400 hover:shadow-xl hover:-translate-y-1'
                    : finished
                    ? 'border-slate-200 bg-slate-50/60 opacity-85 hover:opacity-100 hover:border-slate-300'
                    : `border-slate-200/90 ${theme.borderHover} hover:shadow-xl hover:-translate-y-1`
                }`}
              >
                {/* 顶部渐变顶条 */}
                <div
                  className={`h-1.5 w-full bg-gradient-to-r ${
                    hasTaken
                      ? 'from-emerald-500 via-teal-500 to-cyan-500'
                      : finished
                      ? 'from-slate-300 to-slate-400'
                      : theme.gradientBar
                  }`}
                />

                <div className="p-5.5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* 标题 & 状态 Badge */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2.5">
                      <h3 className="text-[15px] font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1 flex-1 leading-snug">
                        {task.title}
                      </h3>

                      {/* 右上角状态标识组: 接单标识 + 任务全局状态 */}
                      <div className="shrink-0 flex items-center gap-1.5">
                        {/* 当前用户接单专属标识 */}
                        {hasTaken ? (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-black flex items-center gap-1 shadow-2xs ${
                              myTakerRecord?.status === '已验收'
                                ? 'bg-emerald-600 text-white'
                                : myTakerRecord?.status === '已提交'
                                ? 'bg-indigo-600 text-white'
                                : myTakerRecord?.status === '已驳回'
                                ? 'bg-rose-600 text-white'
                                : 'bg-emerald-600 text-white'
                            }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
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
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 shadow-2xs">
                            <UserCheck className="w-3 h-3 text-amber-700" />
                            <span>我发布的</span>
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 text-slate-500 border border-slate-200 flex items-center gap-1">
                            <CircleDot className="w-2.5 h-2.5 text-slate-400" />
                            <span>未接单</span>
                          </span>
                        )}

                        {/* 全局进行中/已结束 */}
                        {finished ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            已结束
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <span className="relative flex h-1.5 w-1.5">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            进行中
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 标签属性栏 (领域 / 难度 / 接单时间 / 剩余天数) */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${theme.badge}`}>
                        {task.domain}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-lg text-[11px] font-bold border ${
                          task.difficulty === '简单'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200/80'
                            : task.difficulty === '中等'
                            ? 'bg-blue-50 text-blue-700 border-blue-200/80'
                            : 'bg-purple-50 text-purple-700 border-purple-200/80'
                        }`}
                      >
                        {task.difficulty}难度
                      </span>
                      {hasTaken && (
                        <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>{myTakerRecord?.takeTime ? `${myTakerRecord.takeTime.split(' ')[0]} 接单` : '已接单参与'}</span>
                        </span>
                      )}
                      <span className="text-slate-400 text-[11px] font-medium ml-auto flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-400" />
                        {finished ? '已结束' : `剩余 ${task.remainingDays || 14} 天`}
                      </span>
                    </div>

                    {/* 需求简介 */}
                    <p className="text-xs text-slate-600 font-medium leading-relaxed line-clamp-2 min-h-[36px]">
                      {task.brief || task.description.replace(/<[^>]+>/g, '').substring(0, 80)}
                    </p>
                  </div>

                  {/* 亮色高质感赏金与接单态势面板 */}
                  <div className={`p-4 rounded-xl border border-slate-100 ${hasTaken ? 'bg-gradient-to-br from-emerald-50/50 via-teal-50/20 to-white' : theme.accentLight} flex items-center justify-between gap-3 shadow-2xs`}>
                    <div>
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        <span>悬赏金额</span>
                      </div>
                      <div className="text-xl font-black font-mono text-amber-600 leading-tight flex items-baseline gap-1 mt-1">
                        <span className="text-xs font-sans text-amber-500 font-bold">¥</span>
                        {(task.cashReward || 0).toLocaleString()}
                        {(task.pointsReward || 0) > 0 && (
                          <span className="text-[11px] font-bold text-indigo-600 ml-1.5 font-sans bg-indigo-50 border border-indigo-100 px-1.5 py-0.2 rounded-md">
                            +{task.pointsReward}积分
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-[11px] text-slate-500 font-semibold flex items-center gap-1 justify-end">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        <span>接单态势</span>
                      </div>
                      <div className="text-xs font-bold text-slate-700 mt-1 font-mono flex items-center gap-1.5 justify-end">
                        <span className="text-indigo-600 font-black text-sm">{acceptedNum}</span>
                        <span className="text-slate-400 text-[11px] font-normal">接单</span>
                        <span className="text-slate-300">/</span>
                        <span className="text-emerald-600 font-black text-sm">{submittedNum}</span>
                        <span className="text-slate-400 text-[11px] font-normal">交付</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 卡片底栏 (发布者信息 + 查看/交付按钮) */}
                <div className="px-5 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={task.publisherAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                      alt={task.publisher}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200 shrink-0 shadow-2xs"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="font-extrabold text-slate-800 truncate max-w-[120px] leading-tight">
                        {task.publisher}
                      </span>
                      <span className="text-[10px] text-slate-400 leading-none mt-0.5">
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
                    className={`px-4 py-2 rounded-xl text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5 shadow-xs group/btn ${
                      hasTaken
                        ? 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100 hover:scale-[1.03]'
                        : isPublisher
                        ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-100 hover:scale-[1.03]'
                        : finished 
                        ? 'bg-slate-600 hover:bg-slate-700' 
                        : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-100 hover:scale-[1.03] active:scale-95'
                    }`}
                  >
                    <span>任务详情</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
