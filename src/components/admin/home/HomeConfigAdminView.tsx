import React, { useMemo, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CompetitionItem,
  HomeUpcomingClassItem,
  HomeUpcomingClassMode
} from '../../../types';
import {
  Trophy,
  Calendar,
  Plus,
  ArrowUp,
  ArrowDown,
  Trash2,
  Edit3,
  Search,
  X,
  AlertTriangle,
  MapPin,
  Users,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface ClassFormDraft {
  id: string | null;
  batchNo: string;
  name: string;
  startDate: string;
  city: string;
  mode: HomeUpcomingClassMode;
  remainingSeats: string;
}

const createEmptyClassDraft = (existing: HomeUpcomingClassItem[]): ClassFormDraft => {
  // 自动推算下一期号（默认在当前最大数字期数 + 1）
  const maxBatchNum = existing.reduce((max, item) => {
    const n = parseInt(item.batchNo.replace(/\D/g, ''), 10);
    return Number.isFinite(n) && n > max ? n : max;
  }, 86);

  return {
    id: null,
    batchNo: String(maxBatchNum + 1),
    name: '',
    startDate: '2026-12-28',
    city: '北京',
    mode: '线上同步',
    remainingSeats: '10'
  };
};

const normalizeBatchNo = (raw: string): string => {
  return raw.trim().replace(/^batch[-\s]*/i, '').toUpperCase();
};

const getCompStatusBadge = (status: CompetitionItem['status']) => {
  if (status === 'ongoing') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        进行中
      </span>
    );
  }
  if (status === 'unstarted') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/20 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
        未开始
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700 whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
      已结束
    </span>
  );
};

const PICKER_PAGE_SIZE = 10;

const getPickerStatusDot = (status: CompetitionItem['status']) => {
  if (status === 'ongoing') {
    return (
      <span className="inline-flex items-center gap-2 text-slate-200 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
        <span>进行中</span>
      </span>
    );
  }
  if (status === 'unstarted') {
    return (
      <span className="inline-flex items-center gap-2 text-slate-200 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
        <span>未开始</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-2 text-slate-400 whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
      <span>已结束</span>
    </span>
  );
};

const getCompetitionCreatedAt = (comp: CompetitionItem, idx: number): string => {
  if (comp.createdAt) return comp.createdAt;
  const datePart = (comp.startTime || '2026-10-01 00:00:00').slice(0, 10);
  const hh = String(10 + (idx % 8)).padStart(2, '0');
  const mm = String(12 + ((idx * 7) % 45)).padStart(2, '0');
  const ss = String(15 + ((idx * 13) % 40)).padStart(2, '0');
  return `${datePart} ${hh}:${mm}:${ss}`;
};

export const HomeConfigAdminView: React.FC = () => {
  const {
    competitions,
    homeFeaturedCompetitionIds,
    setHomeFeaturedCompetitionIds,
    homeUpcomingClasses,
    setHomeUpcomingClasses,
    showToast
  } = useApp();

  // ==========================================
  // 区块一：近期热门赛事选择器弹窗状态（1页10条，支持翻页/状态筛选/名称搜索/多选导入）
  // ==========================================
  const [compPickerOpen, setCompPickerOpen] = useState(false);
  const [compPickerSearch, setCompPickerSearch] = useState('');
  const [compPickerStatus, setCompPickerStatus] = useState<'all' | CompetitionItem['status']>('all');
  const [pickerSelectedIds, setPickerSelectedIds] = useState<string[]>([]);
  const [pickerPage, setPickerPage] = useState<number>(1);

  // ==========================================
  // 区块二：近期开班计划弹窗状态
  // ==========================================
  const [classModalOpen, setClassModalOpen] = useState(false);
  const [classDraft, setClassDraft] = useState<ClassFormDraft>(() =>
    createEmptyClassDraft(homeUpcomingClasses)
  );

  // 删除确认弹窗（不使用 window.confirm）
  const [deleteTargetClass, setDeleteTargetClass] = useState<HomeUpcomingClassItem | null>(null);

  // 解析当前已选赛事（按配置顺序）
  const configuredCompetitions = useMemo(() => {
    const map = new Map(competitions.map((c) => [c.id, c]));
    return homeFeaturedCompetitionIds
      .map((id) => map.get(id))
      .filter((c): c is CompetitionItem => Boolean(c));
  }, [competitions, homeFeaturedCompetitionIds]);

  // 弹窗中筛选后的赛事池（支持按赛事状态筛选 + 按赛事名称搜索）
  const filteredPickerCompetitions = useMemo(() => {
    const q = compPickerSearch.trim().toLowerCase();
    return competitions.filter((comp) => {
      if (compPickerStatus !== 'all' && comp.status !== compPickerStatus) return false;
      if (q && !comp.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [competitions, compPickerSearch, compPickerStatus]);

  const pickerTotalPages = Math.max(
    1,
    Math.ceil(filteredPickerCompetitions.length / PICKER_PAGE_SIZE)
  );
  const safePickerPage = Math.min(pickerPage, pickerTotalPages);
  const paginatedPickerCompetitions = useMemo(() => {
    const start = (safePickerPage - 1) * PICKER_PAGE_SIZE;
    return filteredPickerCompetitions.slice(start, start + PICKER_PAGE_SIZE);
  }, [filteredPickerCompetitions, safePickerPage]);

  const allCurrentPageSelected =
    paginatedPickerCompetitions.length > 0 &&
    paginatedPickerCompetitions.every((c) => pickerSelectedIds.includes(c.id));

  const toggleSelectCurrentPageAll = () => {
    const pageIds = paginatedPickerCompetitions.map((c) => c.id);
    if (allCurrentPageSelected) {
      const pageSet = new Set(pageIds);
      setPickerSelectedIds((prev) => prev.filter((id) => !pageSet.has(id)));
    } else {
      setPickerSelectedIds((prev) => {
        const merged = [...prev];
        for (const id of pageIds) {
          if (!merged.includes(id)) merged.push(id);
        }
        return merged;
      });
    }
  };

  // 打开选择赛事弹窗
  const openCompetitionPicker = () => {
    setPickerSelectedIds([...homeFeaturedCompetitionIds]);
    setCompPickerSearch('');
    setCompPickerStatus('all');
    setPickerPage(1);
    setCompPickerOpen(true);
  };

  const togglePickerCompetition = (compId: string) => {
    setPickerSelectedIds((prev) =>
      prev.includes(compId) ? prev.filter((id) => id !== compId) : [...prev, compId]
    );
  };

  const handleConfirmCompetitionPicker = () => {
    setHomeFeaturedCompetitionIds(pickerSelectedIds);
    setCompPickerOpen(false);
    showToast(`已成功导入 ${pickerSelectedIds.length} 场赛事至首页展示列表`);
  };

  const moveFeaturedCompetition = (index: number, direction: 'up' | 'down') => {
    setHomeFeaturedCompetitionIds((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const removeFeaturedCompetition = (compId: string, title: string) => {
    setHomeFeaturedCompetitionIds((prev) => prev.filter((id) => id !== compId));
    showToast(`已将赛事「${title}」从首页展示中移除`);
  };

  // ==========================================
  // 区块二：近期开班计划 CRUD 与排序
  // ==========================================
  const openAddClassModal = () => {
    setClassDraft(createEmptyClassDraft(homeUpcomingClasses));
    setClassModalOpen(true);
  };

  const openEditClassModal = (cls: HomeUpcomingClassItem) => {
    setClassDraft({
      id: cls.id,
      batchNo: cls.batchNo,
      name: cls.name,
      startDate: cls.startDate,
      city: cls.city,
      mode: cls.mode,
      remainingSeats: String(cls.remainingSeats)
    });
    setClassModalOpen(true);
  };

  const handleSaveClass = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedBatch = normalizeBatchNo(classDraft.batchNo);
    if (!cleanedBatch) {
      showToast('请输入期数编号（如 87、91）');
      return;
    }

    const trimmedName = classDraft.name.trim();
    if (!trimmedName) {
      showToast('请输入班次名称');
      return;
    }
    if (trimmedName.length > 60) {
      showToast('班次名称不能超过 60 个字');
      return;
    }

    if (!classDraft.startDate) {
      showToast('请选择开班日期');
      return;
    }

    const trimmedCity = classDraft.city.trim();
    if (!trimmedCity) {
      showToast('请输入开班地点');
      return;
    }

    const seatsNum = Number(classDraft.remainingSeats);
    if (
      classDraft.remainingSeats.trim() === '' ||
      !Number.isFinite(seatsNum) ||
      seatsNum < 0 ||
      !Number.isInteger(seatsNum)
    ) {
      showToast('请输入有效的剩余席位（非负整数）');
      return;
    }

    if (classDraft.id) {
      setHomeUpcomingClasses((prev) =>
        prev.map((item) =>
          item.id === classDraft.id
            ? {
                ...item,
                batchNo: cleanedBatch,
                name: trimmedName,
                startDate: classDraft.startDate,
                city: trimmedCity,
                mode: classDraft.mode,
                remainingSeats: seatsNum
              }
            : item
        )
      );
      showToast(`已更新开班计划「BATCH-${cleanedBatch} · ${trimmedName}」`);
    } else {
      const newItem: HomeUpcomingClassItem = {
        id: `home-cls-${Date.now()}`,
        batchNo: cleanedBatch,
        name: trimmedName,
        startDate: classDraft.startDate,
        city: trimmedCity,
        mode: classDraft.mode,
        remainingSeats: seatsNum
      };
      setHomeUpcomingClasses((prev) => [...prev, newItem]);
      showToast(`已新增开班计划「BATCH-${cleanedBatch}」，并已同步至首页`);
    }

    setClassModalOpen(false);
  };

  const moveClassItem = (index: number, direction: 'up' | 'down') => {
    setHomeUpcomingClasses((prev) => {
      const next = [...prev];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return next;
    });
  };

  const confirmDeleteClass = () => {
    if (!deleteTargetClass) return;
    setHomeUpcomingClasses((prev) => prev.filter((item) => item.id !== deleteTargetClass.id));
    showToast(`已删除开班计划「BATCH-${deleteTargetClass.batchNo}」`);
    setDeleteTargetClass(null);
  };

  return (
    <div className="space-y-6">
      {/* ========================================================
          区块一：近期热门赛事配置
         ======================================================== */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shrink-0">
              <Trophy className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-black text-white">近期热门赛事配置</h2>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono tabular-nums">
                  当前展示 {configuredCompetitions.length} 场
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                从赛事发布列表中选择需要在首页第二栏展示的热门赛事，并支持通过上移 / 下移调整前台展示顺序。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openCompetitionPicker}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>选择赛事</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-4 w-20">展示排序</th>
                <th className="py-3.5 px-4 min-w-[260px]">赛事名称</th>
                <th className="py-3.5 px-4 min-w-[140px]">主办方</th>
                <th className="py-3.5 px-4 min-w-[100px]">赛事状态</th>
                <th className="py-3.5 px-4 min-w-[190px]">赛事时间</th>
                <th className="py-3.5 px-4 text-right min-w-[200px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {configuredCompetitions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Trophy className="w-8 h-8 mx-auto mb-2 opacity-35" />
                    <p className="text-sm font-bold text-slate-300">暂未配置首页展示赛事</p>
                    <p className="text-xs mt-1">请点击右上角「选择赛事」从已发布赛事中挑选展示</p>
                  </td>
                </tr>
              ) : (
                configuredCompetitions.map((comp, index) => (
                  <tr key={comp.id} className="hover:bg-slate-800/40 transition">
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-indigo-300 font-mono font-bold text-[11px] tabular-nums">
                        {index + 1}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-[13px] leading-snug">
                        {comp.title}
                      </div>
                      {comp.introduction?.awards?.[0]?.reward && (
                        <div className="text-[11px] text-slate-400 mt-0.5 truncate max-w-md">
                          主奖激励：{comp.introduction.awards[0].reward}
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                      {comp.organizer}
                    </td>

                    <td className="py-3.5 px-4">{getCompStatusBadge(comp.status)}</td>

                    <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                      {comp.startTime.slice(0, 10)} ~ {comp.endTime.slice(0, 10)}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveFeaturedCompetition(index, 'up')}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border transition ${
                            index === 0
                              ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
                          }`}
                        >
                          <ArrowUp className="w-3 h-3" />
                          <span>上移</span>
                        </button>

                        <button
                          type="button"
                          disabled={index === configuredCompetitions.length - 1}
                          onClick={() => moveFeaturedCompetition(index, 'down')}
                          className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border transition ${
                            index === configuredCompetitions.length - 1
                              ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 cursor-pointer'
                          }`}
                        >
                          <ArrowDown className="w-3 h-3" />
                          <span>下移</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => removeFeaturedCompetition(comp.id, comp.title)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>移除</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          区块二：近期开班计划配置
         ======================================================== */}
      <section className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
        <div className="p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-sm font-black text-white">近期开班计划配置</h2>
                <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono tabular-nums">
                  共 {homeUpcomingClasses.length} 期班次
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                维护首页第二栏展示的近期开班排期信息，支持新增、编辑、排序与删除，修改后实时同步前台展示。
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={openAddClassModal}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>新增开班计划</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[11px]">
                <th className="py-3.5 px-4 min-w-[110px]">期数</th>
                <th className="py-3.5 px-4 min-w-[240px]">班次名称</th>
                <th className="py-3.5 px-4 min-w-[120px]">开班日期</th>
                <th className="py-3.5 px-4 min-w-[100px]">开班地点</th>
                <th className="py-3.5 px-4 min-w-[110px]">开班方式</th>
                <th className="py-3.5 px-4 min-w-[110px]">剩余席位</th>
                <th className="py-3.5 px-4 text-right min-w-[220px]">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-slate-300">
              {homeUpcomingClasses.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-35" />
                    <p className="text-sm font-bold text-slate-300">暂无近期开班计划</p>
                    <p className="text-xs mt-1">点击右上角「新增开班计划」添加班次排期</p>
                  </td>
                </tr>
              ) : (
                homeUpcomingClasses.map((cls, index) => {
                  const isUrgent = cls.remainingSeats <= 5;
                  return (
                    <tr key={cls.id} className="hover:bg-slate-800/40 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-300 whitespace-nowrap">
                        BATCH-{cls.batchNo}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white text-[13px]">{cls.name}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300 whitespace-nowrap">
                        {cls.startDate}
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="inline-flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {cls.city}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${
                            cls.mode === '线上同步'
                              ? 'bg-sky-500/10 text-sky-300 border-sky-500/25'
                              : 'bg-amber-500/10 text-amber-300 border-amber-500/25'
                          }`}
                        >
                          {cls.mode}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-mono font-bold tabular-nums border ${
                            isUrgent
                              ? 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                              : 'bg-slate-800 text-slate-300 border-slate-700'
                          }`}
                        >
                          仅剩 {cls.remainingSeats} 席
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => moveClassItem(index, 'up')}
                            title="上移"
                            className={`p-1.5 rounded-lg border transition ${
                              index === 0
                                ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 cursor-pointer'
                            }`}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            disabled={index === homeUpcomingClasses.length - 1}
                            onClick={() => moveClassItem(index, 'down')}
                            title="下移"
                            className={`p-1.5 rounded-lg border transition ${
                              index === homeUpcomingClasses.length - 1
                                ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 cursor-pointer'
                            }`}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>

                          <button
                            type="button"
                            onClick={() => openEditClassModal(cls)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>编辑</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setDeleteTargetClass(cls)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                          >
                            <Trash2 className="w-3 h-3" />
                            <span>删除</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================================
          弹窗一：从赛事发布中选择首页展示赛事（标准暗色表格，1页10条，支持翻页/状态筛选/名称搜索/多选导入）
         ======================================================== */}
      {compPickerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setCompPickerOpen(false)}
        >
          <div
            className="w-full max-w-6xl rounded-2xl bg-[#182032] border border-slate-700/80 shadow-2xl overflow-hidden flex flex-col max-h-[88vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 弹窗标题栏 */}
            <div className="px-6 py-4 border-b border-slate-700/70 flex items-center justify-between shrink-0 bg-[#141b2b]">
              <div>
                <h3 className="text-sm font-black text-white">选择赛事导入</h3>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  勾选需要展示在首页第二栏「近期热门赛事」的赛事，支持跨页多选，点击确定完成导入
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCompPickerOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 筛选与搜索区：按赛事名称搜索 + 按赛事状态筛选（未开始、进行中、已结束） */}
            <div className="px-6 py-3.5 border-b border-slate-700/70 bg-[#161e2e] flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                <div className="relative flex-1 max-w-sm">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={compPickerSearch}
                    onChange={(e) => {
                      setCompPickerSearch(e.target.value);
                      setPickerPage(1);
                    }}
                    placeholder="按赛事名称搜索..."
                    className="w-full pl-9 pr-3 py-2 bg-[#111827] border border-slate-700 rounded-lg text-xs text-slate-100 placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 whitespace-nowrap">赛事状态：</span>
                  <select
                    value={compPickerStatus}
                    onChange={(e) => {
                      setCompPickerStatus(e.target.value as 'all' | CompetitionItem['status']);
                      setPickerPage(1);
                    }}
                    className="px-3 py-2 bg-[#111827] border border-slate-700 rounded-lg text-xs text-slate-100 font-medium outline-none focus:border-indigo-500 cursor-pointer"
                  >
                    <option value="all">全部状态</option>
                    <option value="unstarted">未开始</option>
                    <option value="ongoing">进行中</option>
                    <option value="ended">已结束</option>
                  </select>
                </div>
              </div>

              <div className="text-xs text-slate-400 font-mono tabular-nums">
                共 {filteredPickerCompetitions.length} 条赛事 · 每页 {PICKER_PAGE_SIZE} 条
              </div>
            </div>

            {/* 赛事数据表格（与参考图保持一致，去除赛事类型列） */}
            <div className="flex-1 overflow-auto bg-[#1b2333]">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 z-10 bg-[#222b3e] border-b border-slate-700/80 text-slate-300">
                  <tr>
                    <th className="py-3.5 px-4 w-12">
                      <input
                        type="checkbox"
                        checked={allCurrentPageSelected}
                        onChange={toggleSelectCurrentPageAll}
                        aria-label="全选当前页赛事"
                        className="w-3.5 h-3.5 rounded border-slate-600 bg-transparent accent-indigo-500 cursor-pointer"
                      />
                    </th>
                    <th className="py-3.5 px-4 font-medium min-w-[210px] border-r border-slate-700/40">
                      赛事名称
                    </th>
                    <th className="py-3.5 px-4 font-medium min-w-[190px]">赛事时间</th>
                    <th className="py-3.5 px-4 font-medium min-w-[110px]">赛事状态</th>
                    <th className="py-3.5 px-4 font-medium min-w-[160px]">主办方</th>
                    <th className="py-3.5 px-4 font-medium min-w-[88px]">状态</th>
                    <th className="py-3.5 px-4 font-medium min-w-[165px]">创建时间</th>
                    <th className="py-3.5 px-4 font-medium min-w-[90px]">创建者</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50 text-slate-200">
                  {paginatedPickerCompetitions.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-16 text-center text-slate-400">
                        暂无符合筛选条件的赛事数据
                      </td>
                    </tr>
                  ) : (
                    paginatedPickerCompetitions.map((comp, rowIdx) => {
                      const isSelected = pickerSelectedIds.includes(comp.id);
                      const globalIdx = (safePickerPage - 1) * PICKER_PAGE_SIZE + rowIdx;
                      const createdAt = getCompetitionCreatedAt(comp, globalIdx);
                      const creator = comp.creator || 'admin';
                      const visibilityLabel = comp.isInternalOnly ? '隐藏' : '公开';

                      return (
                        <tr
                          key={comp.id}
                          onClick={() => togglePickerCompetition(comp.id)}
                          className={`transition cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-500/12 hover:bg-indigo-500/18'
                              : 'hover:bg-[#232c40]'
                          }`}
                        >
                          <td
                            className="py-3.5 px-4"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePickerCompetition(comp.id)}
                              aria-label={`选择 ${comp.title}`}
                              className="w-3.5 h-3.5 rounded border-slate-600 bg-transparent accent-indigo-500 cursor-pointer"
                            />
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-slate-100">{comp.title}</span>
                          </td>

                          <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300 leading-relaxed whitespace-nowrap">
                            <div>{comp.startTime} ~</div>
                            <div>{comp.endTime}</div>
                          </td>

                          <td className="py-3.5 px-4">{getPickerStatusDot(comp.status)}</td>

                          <td className="py-3.5 px-4 text-slate-300">{comp.organizer}</td>

                          <td className="py-3.5 px-4 whitespace-nowrap text-slate-200">
                            {visibilityLabel}
                          </td>

                          <td className="py-3.5 px-4 font-mono tabular-nums text-slate-300 whitespace-nowrap">
                            {createdAt}
                          </td>

                          <td className="py-3.5 px-4 text-slate-300 whitespace-nowrap">
                            {creator}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* 底部翻页 + 多选确定导入操作栏 */}
            <div className="px-6 py-3.5 border-t border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 bg-[#141b2b]">
              {/* 分页控件 */}
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="font-mono tabular-nums mr-1">
                  第 {safePickerPage} / {pickerTotalPages} 页
                </span>
                <button
                  type="button"
                  disabled={safePickerPage <= 1}
                  onClick={() => setPickerPage((p) => Math.max(1, p - 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 inline-flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>上一页</span>
                </button>

                {Array.from({ length: pickerTotalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => setPickerPage(pageNum)}
                    className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                      pageNum === safePickerPage
                        ? 'bg-indigo-600 text-white border border-indigo-500'
                        : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  type="button"
                  disabled={safePickerPage >= pickerTotalPages}
                  onClick={() => setPickerPage((p) => Math.min(pickerTotalPages, p + 1))}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 inline-flex items-center gap-1 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>下一页</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 已选统计 + 取消 / 确定导入 */}
              <div className="flex items-center justify-end gap-3">
                <span className="text-xs text-slate-400 font-mono">
                  已选 <span className="text-indigo-400 font-bold">{pickerSelectedIds.length}</span> 项
                </span>
                <button
                  type="button"
                  onClick={() => setCompPickerOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={handleConfirmCompetitionPicker}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  确定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          弹窗二：新增 / 编辑近期开班计划
         ======================================================== */}
      {classModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setClassModalOpen(false)}
        >
          <div
            className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">
                {classDraft.id ? '编辑近期开班计划' : '新增近期开班计划'}
              </h3>
              <button
                type="button"
                onClick={() => setClassModalOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClass} className="p-6 space-y-4">
              {/* 期数 + 开班日期 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    期数（BATCH-XX） <span className="text-rose-400">*</span>
                  </label>
                  <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl overflow-hidden focus-within:border-indigo-500 transition">
                    <span className="px-3 py-2.5 bg-slate-900 text-slate-400 border-r border-slate-800 text-xs font-mono font-bold select-none">
                      BATCH-
                    </span>
                    <input
                      type="text"
                      maxLength={10}
                      value={classDraft.batchNo}
                      onChange={(e) =>
                        setClassDraft((prev) => ({ ...prev, batchNo: e.target.value }))
                      }
                      placeholder="如 91"
                      className="w-full px-3 py-2.5 bg-transparent text-xs text-white font-mono placeholder:text-slate-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    开班日期 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={classDraft.startDate}
                    onChange={(e) =>
                      setClassDraft((prev) => ({ ...prev, startDate: e.target.value }))
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono outline-none focus:border-indigo-500 transition"
                  />
                </div>
              </div>

              {/* 班次名称 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    班次名称 <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                    {classDraft.name.length}/60
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={60}
                  value={classDraft.name}
                  onChange={(e) => setClassDraft((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="例如：大模型微调与企业级 RAG 交付实战高阶班"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                />
              </div>

              {/* 开班地点 + 开班方式 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    开班地点 <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    maxLength={20}
                    value={classDraft.city}
                    onChange={(e) => setClassDraft((prev) => ({ ...prev, city: e.target.value }))}
                    placeholder="例如：北京、上海、深圳、杭州"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-200 mb-1.5">
                    开班方式 <span className="text-rose-400">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {(['线上同步', '线下实训'] as HomeUpcomingClassMode[]).map((modeOpt) => {
                      const active = classDraft.mode === modeOpt;
                      return (
                        <button
                          key={modeOpt}
                          type="button"
                          onClick={() => setClassDraft((prev) => ({ ...prev, mode: modeOpt }))}
                          className={`py-2.5 px-3 rounded-xl text-xs font-bold border transition cursor-pointer ${
                            active
                              ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500'
                              : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {modeOpt}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* 剩余席位 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>剩余席位</span>
                    <span className="text-rose-400">*</span>
                  </label>
                  <span className="text-[11px] font-mono text-slate-400">
                    前台展示：
                    <span className="text-indigo-300 font-bold ml-1">
                      仅剩 {classDraft.remainingSeats || '0'} 席
                    </span>
                  </span>
                </div>
                <div className="relative">
                  <input
                    type="number"
                    min={0}
                    step={1}
                    value={classDraft.remainingSeats}
                    onChange={(e) =>
                      setClassDraft((prev) => ({ ...prev, remainingSeats: e.target.value }))
                    }
                    placeholder="例如：5"
                    className="w-full pl-3.5 pr-12 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tabular-nums placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                  />
                  <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                    席
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5">
                  提示：剩余席位 ≤ 5 席时，首页将自动使用紧张提醒样式高亮标注。
                </p>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setClassModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  保存配置
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================
          弹窗三：删除开班计划确认弹窗
         ======================================================== */}
      {deleteTargetClass && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setDeleteTargetClass(null)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-5 h-5 text-rose-400" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white">确认删除该开班计划？</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    即将删除「BATCH-{deleteTargetClass.batchNo} · {deleteTargetClass.name}」，删除后首页第二栏将同步移除该班次。
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setDeleteTargetClass(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmDeleteClass}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  确认删除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
