import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Trophy, 
  Search, 
  Clock, 
  Calendar,
  Building2, 
  ChevronRight,
  User,
  Users
} from 'lucide-react';

export interface UserRegisteredCompetition {
  id: string;
  competitionId: string;
  title: string;
  organizer: string;
  typeTags: string[];
  startTime: string;
  endTime: string;
  teamType: '个人参赛' | '团队参赛';
}

const initialRegisteredCompetitions: UserRegisteredCompetition[] = [
  {
    id: 'user-comp-01',
    competitionId: 'comp-01',
    title: '2026 AI创新巅峰赛',
    organizer: '中国人工智能学会',
    typeTags: ['AI数据科学赛', 'AI产品创新赛'],
    startTime: '2026-08-01 00:00',
    endTime: '2026-10-31 23:59',
    teamType: '团队参赛'
  },
  {
    id: 'user-comp-02',
    competitionId: 'comp-02',
    title: '2026 数据科学挑战赛',
    organizer: '国家数据科学研究院',
    typeTags: ['AI数据科学赛'],
    startTime: '2026-10-01 09:00',
    endTime: '2026-11-30 18:00',
    teamType: '个人参赛'
  },
  {
    id: 'user-comp-03',
    competitionId: 'comp-03',
    title: '2026 网络与AI安全攻防挑战赛',
    organizer: '网络空间安全人才培养基地',
    typeTags: ['AI安全挑战赛'],
    startTime: '2026-06-01 09:00',
    endTime: '2026-07-31 20:00',
    teamType: '个人参赛'
  },
  {
    id: 'user-comp-04',
    competitionId: 'comp-04',
    title: '2026 产业大模型应用创意赛',
    organizer: '数字经济产业创新联合体',
    typeTags: ['AIGC生成赛', 'AI产品创新赛'],
    startTime: '2026-08-15 00:00',
    endTime: '2026-10-15 20:00',
    teamType: '团队参赛'
  }
];

// 根据赛事起止时间动态判断赛事状态
export const getCompetitionStatusByTime = (startTime: string, endTime: string): 'unstarted' | 'ongoing' | 'ended' => {
  const now = Date.now();
  const start = new Date(startTime.replace(/-/g, '/')).getTime();
  const end = new Date(endTime.replace(/-/g, '/')).getTime();
  if (!isNaN(start) && now < start) return 'unstarted';
  if (!isNaN(end) && now > end) return 'ended';
  return 'ongoing';
};

export const WorkspaceCompetitions: React.FC = () => {
  const { openCompetitionDetail } = useApp();
  
  const [competitionsList] = useState<UserRegisteredCompetition[]>(initialRegisteredCompetitions);

  // Filters
  const [statusFilter, setStatusFilter] = useState<'all' | 'unstarted' | 'ongoing' | 'ended'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 动态计算每个赛事的实时状态
  const itemsWithComputedStatus = useMemo(() => {
    return competitionsList.map(item => ({
      ...item,
      computedStatus: getCompetitionStatusByTime(item.startTime, item.endTime)
    }));
  }, [competitionsList]);

  // Filtered
  const filteredList = useMemo(() => {
    return itemsWithComputedStatus.filter((comp) => {
      // 赛事状态筛选
      if (statusFilter !== 'all' && comp.computedStatus !== statusFilter) return false;

      // 赛事模式筛选 (支持包含多个模式标签)
      if (typeFilter !== 'all') {
        const matchMode = comp.typeTags.some(tag => tag.includes(typeFilter) || typeFilter.includes(tag));
        if (!matchMode) return false;
      }

      // 搜索筛选
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = comp.title.toLowerCase().includes(q);
        const matchOrg = comp.organizer.toLowerCase().includes(q);
        const matchTags = comp.typeTags.some(t => t.toLowerCase().includes(q));
        if (!matchTitle && !matchOrg && !matchTags) return false;
      }

      return true;
    });
  }, [itemsWithComputedStatus, statusFilter, typeFilter, searchQuery]);

  // 各状态计数
  const unstartedTotal = useMemo(() => itemsWithComputedStatus.filter(c => c.computedStatus === 'unstarted').length, [itemsWithComputedStatus]);
  const ongoingTotal = useMemo(() => itemsWithComputedStatus.filter(c => c.computedStatus === 'ongoing').length, [itemsWithComputedStatus]);
  const endedTotal = useMemo(() => itemsWithComputedStatus.filter(c => c.computedStatus === 'ended').length, [itemsWithComputedStatus]);

  const getStatusBadge = (status: 'unstarted' | 'ongoing' | 'ended') => {
    switch (status) {
      case 'unstarted':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3 h-3 text-amber-500" />
            未开始
          </span>
        );
      case 'ongoing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            进行中
          </span>
        );
      case 'ended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
            已结束
          </span>
        );
    }
  };

  const getTypeTagStyle = (tag: string) => {
    if (tag.includes('数据科学')) {
      return 'bg-cyan-50 text-cyan-700 border-cyan-200';
    }
    if (tag.includes('安全') || tag.includes('挑战')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (tag.includes('AIGC') || tag.includes('生成')) {
      return 'bg-purple-50 text-purple-700 border-purple-200';
    }
    if (tag.includes('产品') || tag.includes('创新') || tag.includes('应用')) {
      return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    }
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div id="workspace-competitions-view" className="p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* 顶部标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Trophy className="w-5 h-5 text-indigo-600" />
            我的赛事
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            展示您报名参与的所有官方赛事，便捷查看赛程详情并一键直达竞赛平台
          </p>
        </div>
      </div>

      {/* 筛选与检索栏 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* 赛事状态筛选 */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-400 font-bold mr-1">赛事状态:</span>
            {[
              { id: 'all', label: '全部' },
              { id: 'unstarted', label: `未开始 (${unstartedTotal})` },
              { id: 'ongoing', label: `进行中 (${ongoingTotal})` },
              { id: 'ended', label: `已结束 (${endedTotal})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id as any)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${
                  statusFilter === tab.id
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* 赛事模式 & 搜索 */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-bold">赛事模式:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 cursor-pointer"
              >
                <option value="all">全部赛事模式</option>
                <option value="AI数据科学赛">AI数据科学赛</option>
                <option value="AIGC生成赛">AIGC生成赛</option>
                <option value="AI产品创新赛">AI产品创新赛</option>
                <option value="AI安全挑战赛">AI安全挑战赛</option>
              </select>
            </div>

            <div className="relative min-w-[220px]">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索赛事名称、主办方或模式..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-100 rounded-xl text-xs text-slate-800 placeholder-slate-400 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>
          </div>

        </div>
      </div>

      {/* 赛事列表 */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-2xs overflow-hidden">
        {filteredList.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Trophy className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-slate-700">暂无匹配的赛事</div>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              您可以前往赛事中心浏览并报名当前热门的 AI 官方巅峰赛与技术挑战赛
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-3.5 px-4 min-w-[200px]">赛事名称</th>
                  <th className="py-3.5 px-4 min-w-[150px]">主办单位</th>
                  <th className="py-3.5 px-4 min-w-[160px]">赛事模式</th>
                  <th className="py-3.5 px-4 min-w-[170px]">赛事时间</th>
                  <th className="py-3.5 px-4 min-w-[100px]">赛事状态</th>
                  <th className="py-3.5 px-4 min-w-[100px]">参赛模式</th>
                  <th className="py-3.5 px-4 text-right min-w-[100px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-700">
                {filteredList.map((item) => {
                  const startDateOnly = item.startTime.split(' ')[0];
                  const endDateOnly = item.endTime.split(' ')[0];

                  return (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      
                      {/* 1. 赛事名称 (已移除“国家一级学会”等所有标签) */}
                      <td className="py-3.5 px-4">
                        <span className="font-extrabold text-slate-900 leading-snug">
                          {item.title}
                        </span>
                      </td>

                      {/* 2. 主办单位 (独立一列展示) */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-600 flex items-center gap-1.5 font-medium">
                          <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{item.organizer}</span>
                        </div>
                      </td>

                      {/* 3. 赛事模式 (支持展示多个模式标签) */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-wrap gap-1.5">
                          {item.typeTags.map((tag) => (
                            <span 
                              key={tag} 
                              className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${getTypeTagStyle(tag)}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* 4. 赛事时间 (赛事开始时间到截止时间的时间段) */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                          <span>{startDateOnly} ~ {endDateOnly}</span>
                        </div>
                      </td>

                      {/* 5. 赛事状态 (根据时间动态判断) */}
                      <td className="py-3.5 px-4">
                        {getStatusBadge(item.computedStatus)}
                      </td>

                      {/* 6. 参赛模式 (仅区分 团队参赛 / 个人参赛) */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          item.teamType === '团队参赛'
                            ? 'bg-purple-50 text-purple-700 border border-purple-100'
                            : 'bg-slate-100 text-slate-700 border border-slate-200/70'
                        }`}>
                          {item.teamType === '团队参赛' ? (
                            <Users className="w-3 h-3 text-purple-500" />
                          ) : (
                            <User className="w-3 h-3 text-slate-500" />
                          )}
                          <span>{item.teamType}</span>
                        </span>
                      </td>

                      {/* 7. 操作栏 (仅保留 赛事详情 按钮) */}
                      <td className="py-3.5 px-4 text-right">
                        <button
                          id={`view-detail-${item.id}`}
                          onClick={() => openCompetitionDetail(item.competitionId)}
                          className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-600 text-slate-700 hover:text-white font-extrabold text-xs transition-all shadow-2xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>赛事详情</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};


