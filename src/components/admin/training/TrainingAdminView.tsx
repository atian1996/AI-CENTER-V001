import React, { useMemo, useState } from 'react';
import { useApp } from '../../../context/AppContext';
import {
  CertificationItem,
  CertificationLevel,
  CertificationPathStep,
  CertificationSystem
} from '../../../types';
import { MarkdownEditor } from '../../common/MarkdownEditor';
import {
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Edit3,
  ArrowRight,
  ChevronRight,
  Search,
  X,
  ArrowUp,
  ArrowDown,
  BookOpen,
  Layers,
  AlertTriangle,
  Check,
  Save,
  ArrowLeft
} from 'lucide-react';

type ViewMode = 'systems' | 'courses' | 'course_editor';

interface ChapterDraft {
  id: string;
  title: string;
  hours: string;
  contentMarkdown: string;
}

interface CourseFormDraft {
  id: string | null; // null = create mode
  name: string;
  level: CertificationLevel;
  hours: string;
  fee: string;
  feeDescription: string;
  targetAudience: string;
  customTags: string[];
  coreCapabilities: string[];
  briefIntro: string;
  introMarkdown: string;
  chapters: ChapterDraft[];
}

const DEFAULT_ADVISOR_CONTACTS = [
  { label: '教务与课程顾问微信', value: 'AI_Training_01', copyable: true },
  { label: '官方报名咨询电话', value: '400-880-2026', copyable: true },
  { label: '企业团报与内训邮箱', value: 'training@ai-ops-center.cn', copyable: true }
];

const formatDateTime = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

const parseNumberFromText = (text: string | undefined, fallback: string): string => {
  if (!text) return fallback;
  const cleaned = text.replace(/,/g, '');
  const match = cleaned.match(/\d+(\.\d+)?/);
  return match ? match[0] : fallback;
};

const truncateText = (text: string, maxLen: number): string => {
  if (!text) return '—';
  return text.length > maxLen ? `${text.slice(0, maxLen)}...` : text;
};

const createEmptyCourseDraft = (): CourseFormDraft => ({
  id: null,
  name: '',
  level: '初级',
  hours: '24',
  fee: '399.00',
  feeDescription: '含全套高清录播课程、实战代码仓库、实验算力券及导师答疑服务',
  targetAudience: '零基础开发者、AI 应用研发工程师及希望系统进阶大模型实战的技术人员',
  customTags: ['实战'],
  coreCapabilities: [],
  briefIntro: '',
  introMarkdown:
    '## 课程目标\n\n通过体系化理论精讲与企业级项目实战，帮助学员快速掌握核心技术栈并具备独立落地交付能力。\n\n## 适合人群\n\n- 希望从零到一构建完整项目经验的开发者\n- 需要将前沿 AI 能力引入实际业务线的工程师',
  chapters: [
    {
      id: `ch-${Date.now()}-1`,
      title: '模块一：核心原理与开发环境搭建',
      hours: '6',
      contentMarkdown: '### 本章学习重点\n\n- 理解核心架构原理与工程边界\n- 完成本地与云端实战开发环境配置'
    }
  ]
});

const buildDraftFromCourse = (course: CertificationItem): CourseFormDraft => {
  const parsedFeeNum = Number(parseNumberFromText(course.priceDisplay, '399'));
  const feeFormatted = Number.isFinite(parsedFeeNum) ? parsedFeeNum.toFixed(2) : '399.00';

  const chapters: ChapterDraft[] =
    course.learningPath && course.learningPath.length > 0
      ? course.learningPath.map((step, idx) => ({
          id: step.id || `ch-${Date.now()}-${idx}`,
          title: step.title || '',
          hours: parseNumberFromText(step.hint, '6'),
          contentMarkdown: step.contentMarkdown || ''
        }))
      : [];

  return {
    id: course.id,
    name: course.name || '',
    level: course.level || '初级',
    hours: parseNumberFromText(course.courseHours, '24'),
    fee: feeFormatted,
    feeDescription: course.feeDescription || '',
    targetAudience: course.targetAudience || '',
    customTags: [...(course.customTags || [])],
    coreCapabilities: [...(course.coreCapabilities || [])],
    briefIntro: course.briefIntro || '',
    introMarkdown: course.introMarkdown || '',
    chapters
  };
};

export const TrainingAdminView: React.FC = () => {
  const {
    user,
    showToast,
    trainingSystems,
    setTrainingSystems,
    trainingCourses,
    setTrainingCourses
  } = useApp();

  // 三级视图状态
  const [viewMode, setViewMode] = useState<ViewMode>('systems');
  const [activeSystemId, setActiveSystemId] = useState<string | null>(null);

  // ==========================================
  // 第一级：课程体系列表状态
  // ==========================================
  const [selectedSystemIds, setSelectedSystemIds] = useState<string[]>([]);
  const [systemModalOpen, setSystemModalOpen] = useState(false);
  const [editingSystem, setEditingSystem] = useState<CertificationSystem | null>(null);
  const [systemNameInput, setSystemNameInput] = useState('');

  // ==========================================
  // 第二级：课程列表状态
  // ==========================================
  const [courseSearch, setCourseSearch] = useState('');
  const [courseLevelFilter, setCourseLevelFilter] = useState<'全部' | CertificationLevel>('全部');
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  // ==========================================
  // 第三级：课程编辑页表单状态
  // ==========================================
  const [courseDraft, setCourseDraft] = useState<CourseFormDraft>(createEmptyCourseDraft());
  const [tagInput, setTagInput] = useState('');
  const [capabilityInput, setCapabilityInput] = useState('');

  // 通用删除确认弹窗状态（严禁使用 window.confirm）
  const [confirmModal, setConfirmModal] = useState<{
    title: string;
    description: string;
    confirmLabel: string;
    onConfirm: () => void;
  } | null>(null);

  // 计算每个体系的课程总数
  const courseCountBySystem = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of trainingCourses) {
      map[c.systemId] = (map[c.systemId] || 0) + 1;
    }
    return map;
  }, [trainingCourses]);

  const activeSystem = useMemo(
    () => trainingSystems.find((s) => s.id === activeSystemId) || null,
    [trainingSystems, activeSystemId]
  );

  // 当前体系下筛选后的课程列表
  const filteredCourses = useMemo(() => {
    if (!activeSystemId) return [];
    const q = courseSearch.trim().toLowerCase();
    return trainingCourses.filter((c) => {
      if (c.systemId !== activeSystemId) return false;
      if (courseLevelFilter !== '全部' && c.level !== courseLevelFilter) return false;
      if (q && !c.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [trainingCourses, activeSystemId, courseSearch, courseLevelFilter]);

  // ==========================================
  // 第一级操作：课程体系 CRUD & 批量操作
  // ==========================================
  const allSystemsSelected =
    trainingSystems.length > 0 && selectedSystemIds.length === trainingSystems.length;

  const toggleSelectAllSystems = () => {
    if (allSystemsSelected) {
      setSelectedSystemIds([]);
    } else {
      setSelectedSystemIds(trainingSystems.map((s) => s.id));
    }
  };

  const toggleSelectSystem = (id: string) => {
    setSelectedSystemIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const openAddSystemModal = () => {
    setEditingSystem(null);
    setSystemNameInput('');
    setSystemModalOpen(true);
  };

  const openEditSystemModal = (sys: CertificationSystem) => {
    setEditingSystem(sys);
    setSystemNameInput(sys.name);
    setSystemModalOpen(true);
  };

  const handleSaveSystem = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = systemNameInput.trim();
    if (!trimmed) {
      showToast('请输入课程体系名称');
      return;
    }
    if (trimmed.length > 20) {
      showToast('课程体系名称不能超过 20 个字');
      return;
    }

    const duplicate = trainingSystems.some(
      (s) => s.name === trimmed && (!editingSystem || s.id !== editingSystem.id)
    );
    if (duplicate) {
      showToast('已存在同名的课程体系，请修改后重试');
      return;
    }

    if (editingSystem) {
      // 编辑：仅修改体系名称，并同步更新关联课程中的 systemName
      setTrainingSystems((prev) =>
        prev.map((s) =>
          s.id === editingSystem.id
            ? { ...s, name: trimmed, shortName: trimmed.replace('体系', '').trim() || trimmed }
            : s
        )
      );
      setTrainingCourses((prev) =>
        prev.map((c) => (c.systemId === editingSystem.id ? { ...c, systemName: trimmed } : c))
      );
      showToast(`课程体系名称已更新为「${trimmed}」`);
    } else {
      // 新增：默认状态为「隐藏」
      const newId = `sys-${Date.now()}`;
      const newSystem: CertificationSystem = {
        id: newId,
        name: trimmed,
        shortName: trimmed.replace('体系', '').trim() || trimmed,
        description: `${trimmed}核心实战培训课程体系`,
        status: 'hidden',
        creator: user.name || '管理员',
        createdAt: formatDateTime(new Date())
      };
      setTrainingSystems((prev) => [newSystem, ...prev]);
      showToast(`已新增课程体系「${trimmed}」（默认状态为隐藏）`);
    }

    setSystemModalOpen(false);
    setEditingSystem(null);
    setSystemNameInput('');
  };

  const handleBatchSystemStatus = (status: 'public' | 'hidden') => {
    if (selectedSystemIds.length === 0) return;
    const idSet = new Set(selectedSystemIds);
    setTrainingSystems((prev) =>
      prev.map((s) => (idSet.has(s.id) ? { ...s, status } : s))
    );
    showToast(
      `已将选中的 ${selectedSystemIds.length} 个课程体系设为「${status === 'public' ? '公开' : '隐藏'}」`
    );
    setSelectedSystemIds([]);
  };

  const handleBatchDeleteSystems = () => {
    if (selectedSystemIds.length === 0) return;
    const count = selectedSystemIds.length;
    const relatedCourseCount = trainingCourses.filter((c) =>
      selectedSystemIds.includes(c.systemId)
    ).length;

    setConfirmModal({
      title: '确认批量删除课程体系？',
      description:
        relatedCourseCount > 0
          ? `即将删除选中的 ${count} 个课程体系，同时移除其下关联的 ${relatedCourseCount} 门课程。此操作不可撤销。`
          : `即将删除选中的 ${count} 个课程体系，此操作不可撤销。`,
      confirmLabel: '确认删除',
      onConfirm: () => {
        const idSet = new Set(selectedSystemIds);
        setTrainingSystems((prev) => prev.filter((s) => !idSet.has(s.id)));
        setTrainingCourses((prev) => prev.filter((c) => !idSet.has(c.systemId)));
        setSelectedSystemIds([]);
        setConfirmModal(null);
        showToast(`已成功删除 ${count} 个课程体系`);
      }
    });
  };

  const enterSystemCourses = (sysId: string) => {
    setActiveSystemId(sysId);
    setCourseSearch('');
    setCourseLevelFilter('全部');
    setSelectedCourseIds([]);
    setViewMode('courses');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // ==========================================
  // 第二级操作：课程列表筛选、批量操作 & 删除
  // ==========================================
  const allFilteredCoursesSelected =
    filteredCourses.length > 0 &&
    filteredCourses.every((c) => selectedCourseIds.includes(c.id));

  const toggleSelectAllCourses = () => {
    if (allFilteredCoursesSelected) {
      const visibleIds = new Set(filteredCourses.map((c) => c.id));
      setSelectedCourseIds((prev) => prev.filter((id) => !visibleIds.has(id)));
    } else {
      const merged = new Set([...selectedCourseIds, ...filteredCourses.map((c) => c.id)]);
      setSelectedCourseIds(Array.from(merged));
    }
  };

  const toggleSelectCourse = (id: string) => {
    setSelectedCourseIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleBatchCourseStatus = (status: 'public' | 'hidden') => {
    if (selectedCourseIds.length === 0) return;
    const idSet = new Set(selectedCourseIds);
    setTrainingCourses((prev) =>
      prev.map((c) => (idSet.has(c.id) ? { ...c, status } : c))
    );
    showToast(
      `已将选中的 ${selectedCourseIds.length} 门课程设为「${status === 'public' ? '公开' : '隐藏'}」`
    );
    setSelectedCourseIds([]);
  };

  const handleBatchDeleteCourses = () => {
    if (selectedCourseIds.length === 0) return;
    const count = selectedCourseIds.length;
    setConfirmModal({
      title: '确认批量删除课程？',
      description: `即将删除选中的 ${count} 门课程及其全部课程大纲配置，前台将同步移除展示，此操作不可撤销。`,
      confirmLabel: '确认删除',
      onConfirm: () => {
        const idSet = new Set(selectedCourseIds);
        setTrainingCourses((prev) => prev.filter((c) => !idSet.has(c.id)));
        setSelectedCourseIds([]);
        setConfirmModal(null);
        showToast(`已成功删除 ${count} 门课程`);
      }
    });
  };

  const handleDeleteSingleCourse = (course: CertificationItem) => {
    setConfirmModal({
      title: '确认删除该课程？',
      description: `即将删除课程「${course.name}」，删除后前台将不再展示该课程内容，此操作不可撤销。`,
      confirmLabel: '确认删除',
      onConfirm: () => {
        setTrainingCourses((prev) => prev.filter((c) => c.id !== course.id));
        setSelectedCourseIds((prev) => prev.filter((id) => id !== course.id));
        setConfirmModal(null);
        showToast(`已删除课程「${course.name}」`);
      }
    });
  };

  // ==========================================
  // 第三级操作：课程新增 / 编辑表单 & 大纲编辑
  // ==========================================
  const openCreateCourse = () => {
    setCourseDraft(createEmptyCourseDraft());
    setTagInput('');
    setCapabilityInput('');
    setViewMode('course_editor');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const openEditCourse = (course: CertificationItem) => {
    setCourseDraft(buildDraftFromCourse(course));
    setTagInput('');
    setCapabilityInput('');
    setViewMode('course_editor');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  const addCourseTag = () => {
    const val = tagInput.trim();
    if (!val) return;
    if (courseDraft.customTags.includes(val)) {
      showToast('该课程标签已存在');
      return;
    }
    setCourseDraft((prev) => ({ ...prev, customTags: [...prev.customTags, val] }));
    setTagInput('');
  };

  const removeCourseTag = (tag: string) => {
    setCourseDraft((prev) => ({
      ...prev,
      customTags: prev.customTags.filter((t) => t !== tag)
    }));
  };

  const addCoreCapability = () => {
    const val = capabilityInput.trim();
    if (!val) return;
    if (courseDraft.coreCapabilities.length >= 8) {
      showToast('核心能力最多支持添加 8 项');
      return;
    }
    if (courseDraft.coreCapabilities.includes(val)) {
      showToast('该核心能力已存在');
      return;
    }
    setCourseDraft((prev) => ({
      ...prev,
      coreCapabilities: [...prev.coreCapabilities, val]
    }));
    setCapabilityInput('');
  };

  const removeCoreCapability = (cap: string) => {
    setCourseDraft((prev) => ({
      ...prev,
      coreCapabilities: prev.coreCapabilities.filter((c) => c !== cap)
    }));
  };

  const addChapter = () => {
    const nextIdx = courseDraft.chapters.length + 1;
    setCourseDraft((prev) => ({
      ...prev,
      chapters: [
        ...prev.chapters,
        {
          id: `ch-${Date.now()}-${nextIdx}`,
          title: '',
          hours: '4',
          contentMarkdown: ''
        }
      ]
    }));
  };

  const updateChapter = (id: string, patch: Partial<ChapterDraft>) => {
    setCourseDraft((prev) => ({
      ...prev,
      chapters: prev.chapters.map((ch) => (ch.id === id ? { ...ch, ...patch } : ch))
    }));
  };

  const moveChapter = (index: number, direction: 'up' | 'down') => {
    setCourseDraft((prev) => {
      const next = [...prev.chapters];
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= next.length) return prev;
      [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
      return { ...prev, chapters: next };
    });
  };

  const deleteChapter = (id: string) => {
    setCourseDraft((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((ch) => ch.id !== id)
    }));
  };

  const handleSaveCourse = () => {
    if (!activeSystem) {
      showToast('未定位到所属课程体系，请返回重试');
      return;
    }

    const trimmedName = courseDraft.name.trim();
    if (!trimmedName) {
      showToast('请填写课程名称（必填）');
      return;
    }
    if (trimmedName.length > 50) {
      showToast('课程名称不能超过 50 个字');
      return;
    }

    const hoursNum = Number(courseDraft.hours);
    if (!courseDraft.hours.trim() || !Number.isFinite(hoursNum) || hoursNum <= 0) {
      showToast('请输入有效的课时数量（大于 0）');
      return;
    }

    const feeNum = Number(courseDraft.fee);
    if (courseDraft.fee.trim() === '' || !Number.isFinite(feeNum) || feeNum < 0) {
      showToast('请输入有效的课程费用（非负数字）');
      return;
    }

    if (courseDraft.feeDescription.length > 80) {
      showToast('费用说明不能超过 80 个字');
      return;
    }
    if (courseDraft.targetAudience.length > 80) {
      showToast('适用人群不能超过 80 个字');
      return;
    }
    if (courseDraft.briefIntro.length > 100) {
      showToast('课程简介不能超过 100 个字');
      return;
    }

    for (let i = 0; i < courseDraft.chapters.length; i++) {
      const ch = courseDraft.chapters[i];
      if (!ch.title.trim()) {
        showToast(`请填写第 ${i + 1} 章节的章节名称（必填）`);
        return;
      }
      if (ch.title.trim().length > 50) {
        showToast(`第 ${i + 1} 章节名称不能超过 50 个字`);
        return;
      }
    }

    const priceDisplay = `¥${feeNum.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
    const feeText = `¥${feeNum.toFixed(2)} / 门`;
    const courseHours = `${Math.round(hoursNum)} 课时`;
    const learningPath: CertificationPathStep[] = courseDraft.chapters.map((ch, idx) => {
      const chHours = Number(ch.hours);
      const hint = Number.isFinite(chHours) && chHours > 0 ? `${Math.round(chHours)} 课时` : '4 课时';
      return {
        id: ch.id || `step-${idx + 1}`,
        title: ch.title.trim(),
        hint,
        contentMarkdown: ch.contentMarkdown.trim() || '本章节详细大纲内容持续完善中。'
      };
    });

    const shortLevelName = `${activeSystem.shortName || activeSystem.name.replace('体系', '').trim()} ${courseDraft.level}`;

    if (courseDraft.id) {
      // 编辑现有课程（保留原有 status 和 createdAt）
      setTrainingCourses((prev) =>
        prev.map((c) => {
          if (c.id !== courseDraft.id) return c;
          return {
            ...c,
            systemId: activeSystem.id,
            systemName: activeSystem.name,
            name: trimmedName,
            detailTitle: trimmedName,
            shortLevelName,
            level: courseDraft.level,
            courseHours,
            priceDisplay,
            feeText,
            feeDescription: courseDraft.feeDescription.trim(),
            targetAudience: courseDraft.targetAudience.trim(),
            customTags: courseDraft.customTags,
            coreCapabilities: courseDraft.coreCapabilities,
            briefIntro: courseDraft.briefIntro.trim(),
            introMarkdown: courseDraft.introMarkdown,
            learningPath
          };
        })
      );
      showToast(`课程「${trimmedName}」已保存并同步至前台配置`);
    } else {
      // 新增课程：默认状态为「隐藏」
      const newCourse: CertificationItem = {
        id: `course-${Date.now()}`,
        systemId: activeSystem.id,
        systemName: activeSystem.name,
        name: trimmedName,
        detailTitle: trimmedName,
        shortLevelName,
        issuingBodies: [activeSystem.name],
        level: courseDraft.level,
        customTags: courseDraft.customTags,
        briefIntro: courseDraft.briefIntro.trim() || '暂无课程简介',
        targetAudience: courseDraft.targetAudience.trim() || 'AI 开发者与业务实战从业者',
        coreCapabilities: courseDraft.coreCapabilities,
        priceDisplay,
        feeDescription: courseDraft.feeDescription.trim() || '含全套高清课程与项目实战辅导服务',
        examFormat: '线上实战项目交付',
        examDuration: courseHours,
        passingScore: '结业项目评审通过',
        validityPeriod: '永久有效回看',
        courseHours,
        feeText,
        enrolledCount: 0,
        syllabus: [],
        recognitionPoints: [],
        introMarkdown: courseDraft.introMarkdown || '## 课程介绍\n\n课程详情内容待完善。',
        learningPath,
        advisorContacts: DEFAULT_ADVISOR_CONTACTS,
        advisorQrHint: '扫码添加专属教务顾问微信，获取课程试听、开班排期与团报优惠',
        status: 'hidden',
        createdAt: formatDateTime(new Date())
      };
      setTrainingCourses((prev) => [newCourse, ...prev]);
      showToast(`已新增课程「${trimmedName}」（默认状态为隐藏）`);
    }

    setViewMode('courses');
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  };

  // ==========================================
  // 渲染：第一级 课程体系列表页
  // ==========================================
  const renderSystemsLevel = () => {
    const hasSelection = selectedSystemIds.length > 0;

    return (
      <div className="space-y-5">
        {/* 顶部操作区 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              type="button"
              onClick={openAddSystemModal}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>新增课程体系</span>
            </button>

            <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => handleBatchSystemStatus('public')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                hasSelection
                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 cursor-pointer'
                  : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>批量公开</span>
            </button>

            <button
              type="button"
              disabled={!hasSelection}
              onClick={() => handleBatchSystemStatus('hidden')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                hasSelection
                  ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 cursor-pointer'
                  : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
            >
              <EyeOff className="w-3.5 h-3.5" />
              <span>批量隐藏</span>
            </button>

            <button
              type="button"
              disabled={!hasSelection}
              onClick={handleBatchDeleteSystems}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                hasSelection
                  ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30 cursor-pointer'
                  : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
              }`}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>批量删除</span>
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
            {hasSelection && (
              <span className="text-indigo-400 font-bold">
                已勾选 {selectedSystemIds.length} 项
              </span>
            )}
            <span>共 {trainingSystems.length} 个课程体系</span>
          </div>
        </div>

        {/* 课程体系数据表格 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={allSystemsSelected}
                      onChange={toggleSelectAllSystems}
                      aria-label="全选课程体系"
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 accent-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4 min-w-[200px]">课程体系名称</th>
                  <th className="py-3.5 px-4 min-w-[110px]">课程数量</th>
                  <th className="py-3.5 px-4 min-w-[110px]">状态</th>
                  <th className="py-3.5 px-4 min-w-[120px]">创建人</th>
                  <th className="py-3.5 px-4 min-w-[160px]">创建时间</th>
                  <th className="py-3.5 px-4 text-right min-w-[180px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {trainingSystems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500">
                      <Layers className="w-9 h-9 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-bold text-slate-300">暂无课程体系数据</p>
                      <p className="text-xs mt-1">点击左上角「新增课程体系」创建第一个体系分类</p>
                    </td>
                  </tr>
                ) : (
                  trainingSystems.map((sys) => {
                    const isChecked = selectedSystemIds.includes(sys.id);
                    const isPublic = sys.status !== 'hidden';
                    const count = courseCountBySystem[sys.id] || 0;

                    return (
                      <tr
                        key={sys.id}
                        className={`transition ${
                          isChecked ? 'bg-indigo-500/5' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectSystem(sys.id)}
                            aria-label={`勾选 ${sys.name}`}
                            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 accent-indigo-500 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <span className="font-bold text-white text-[13px]">{sys.name}</span>
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-200 font-semibold">
                          {count} 门
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isPublic ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              公开
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                              隐藏
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-slate-300">{sys.creator || '极客小千'}</td>

                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400">
                          {sys.createdAt || '2026-08-01 10:00'}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditSystemModal(sys)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>编辑</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => enterSystemCourses(sys.id)}
                              className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 text-indigo-300 hover:text-white border border-indigo-500/30 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <span>课程配置</span>
                              <ArrowRight className="w-3 h-3" />
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
        </div>
      </div>
    );
  };

  // ==========================================
  // 渲染：第二级 课程列表页
  // ==========================================
  const renderCoursesLevel = () => {
    const hasSelection = selectedCourseIds.length > 0;

    return (
      <div className="space-y-5">
        {/* 顶部面包屑导航：课程体系 / [当前体系名称] */}
        <div className="flex items-center justify-between">
          <nav aria-label="课程配置面包屑" className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setViewMode('systems');
                setSelectedCourseIds([]);
              }}
              className="text-slate-400 hover:text-indigo-400 font-bold inline-flex items-center gap-1.5 transition cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>课程体系</span>
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">{activeSystem?.name || '未知体系'}</span>
          </nav>

          <span className="text-xs font-mono text-slate-400">
            当前体系共 {courseCountBySystem[activeSystemId || ''] || 0} 门课程
          </span>
        </div>

        {/* 筛选与搜索区 + 顶部操作区 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
          {/* 筛选/搜索区 */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={courseSearch}
                onChange={(e) => setCourseSearch(e.target.value)}
                placeholder="搜索课程名称..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-xs text-slate-400 font-bold whitespace-nowrap">课程等级：</label>
              <select
                value={courseLevelFilter}
                onChange={(e) =>
                  setCourseLevelFilter(e.target.value as '全部' | CertificationLevel)
                }
                className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="全部">全部</option>
                <option value="初级">初级</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
              </select>
            </div>
          </div>

          {/* 顶部操作按钮栏 */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={openCreateCourse}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>新增课程</span>
              </button>

              <div className="h-5 w-px bg-slate-800 mx-1 hidden sm:block" />

              <button
                type="button"
                disabled={!hasSelection}
                onClick={() => handleBatchCourseStatus('public')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  hasSelection
                    ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border-emerald-500/30 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>批量公开</span>
              </button>

              <button
                type="button"
                disabled={!hasSelection}
                onClick={() => handleBatchCourseStatus('hidden')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  hasSelection
                    ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border-amber-500/30 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <EyeOff className="w-3.5 h-3.5" />
                <span>批量隐藏</span>
              </button>

              <button
                type="button"
                disabled={!hasSelection}
                onClick={handleBatchDeleteCourses}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition ${
                  hasSelection
                    ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border-rose-500/30 cursor-pointer'
                    : 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                }`}
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>批量删除</span>
              </button>
            </div>

            <div className="text-xs text-slate-400 font-mono flex items-center gap-3">
              {hasSelection && (
                <span className="text-indigo-400 font-bold">
                  已勾选 {selectedCourseIds.length} 项
                </span>
              )}
              <span>检索到 {filteredCourses.length} 门课程</span>
            </div>
          </div>
        </div>

        {/* 课程数据表格 */}
        <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/60 text-slate-400 font-bold uppercase text-[11px]">
                  <th className="py-3.5 px-4 w-12">
                    <input
                      type="checkbox"
                      checked={allFilteredCoursesSelected}
                      onChange={toggleSelectAllCourses}
                      aria-label="全选当前列表课程"
                      className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 accent-indigo-500 cursor-pointer"
                    />
                  </th>
                  <th className="py-3.5 px-4 min-w-[220px]">课程名称</th>
                  <th className="py-3.5 px-4 min-w-[90px]">课程等级</th>
                  <th className="py-3.5 px-4 min-w-[240px]">课程简介</th>
                  <th className="py-3.5 px-4 min-w-[100px]">状态</th>
                  <th className="py-3.5 px-4 min-w-[150px]">创建时间</th>
                  <th className="py-3.5 px-4 text-right min-w-[140px]">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/70 text-slate-300">
                {filteredCourses.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-16 text-center text-slate-500">
                      <BookOpen className="w-9 h-9 mx-auto mb-2 opacity-40" />
                      <p className="text-sm font-bold text-slate-300">暂无符合条件的课程</p>
                      <p className="text-xs mt-1">
                        可调整搜索筛选条件，或点击「新增课程」创建新课程
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredCourses.map((course) => {
                    const isChecked = selectedCourseIds.includes(course.id);
                    const isPublic = course.status !== 'hidden';
                    const levelStyle =
                      course.level === '高级'
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/25'
                        : course.level === '中级'
                        ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25'
                        : 'bg-sky-500/10 text-sky-300 border-sky-500/25';

                    return (
                      <tr
                        key={course.id}
                        className={`transition ${
                          isChecked ? 'bg-indigo-500/5' : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-3.5 px-4">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleSelectCourse(course.id)}
                            aria-label={`勾选 ${course.name}`}
                            className="w-3.5 h-3.5 rounded border-slate-700 bg-slate-900 accent-indigo-500 cursor-pointer"
                          />
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="font-bold text-white text-[13px] leading-snug">
                            {course.name}
                          </div>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-bold border ${levelStyle}`}
                          >
                            {course.level}
                          </span>
                        </td>

                        {/* 课程简介：列表内截断显示前 20 字，悬浮原生 title 展示完整简介 */}
                        <td className="py-3.5 px-4">
                          <span
                            title={course.briefIntro}
                            className="text-slate-400 cursor-help inline-block"
                          >
                            {truncateText(course.briefIntro, 20)}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isPublic ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                              公开
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-800 text-slate-400 border border-slate-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                              隐藏
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 font-mono tabular-nums text-slate-400 whitespace-nowrap">
                          {course.createdAt || '2026-08-10 10:00'}
                        </td>

                        <td className="py-3.5 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditCourse(course)}
                              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                            >
                              <Edit3 className="w-3 h-3" />
                              <span>编辑</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteSingleCourse(course)}
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
        </div>
      </div>
    );
  };

  // ==========================================
  // 渲染：第三级 课程编辑页（基础信息 + 内容与标签 + 课程大纲同页）
  // ==========================================
  const renderCourseEditorLevel = () => {
    const isEdit = Boolean(courseDraft.id);

    return (
      <div className="space-y-6 pb-8">
        {/* 顶部面包屑导航 */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="课程编辑面包屑" className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => {
                setViewMode('systems');
                setSelectedCourseIds([]);
              }}
              className="text-slate-400 hover:text-indigo-400 font-bold transition cursor-pointer"
            >
              课程体系
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <button
              type="button"
              onClick={() => setViewMode('courses')}
              className="text-slate-400 hover:text-indigo-400 font-bold transition cursor-pointer"
            >
              {activeSystem?.name || '未知体系'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
            <span className="text-white font-bold">{isEdit ? '编辑课程' : '新增课程'}</span>
          </nav>

          <button
            type="button"
            onClick={() => setViewMode('courses')}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold inline-flex items-center gap-1.5 border border-slate-700 transition cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>返回课程列表</span>
          </button>
        </div>

        {/* 区块一：基础信息（对应前台顶部 Hero 卡片） */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">区块一：基础信息</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                对应前台课程列表卡片与详情页顶部 Hero 核心摘要区
              </p>
            </div>
            <span className="text-[11px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-0.5 rounded-md">
              所属体系：{activeSystem?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 课程名称 */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">
                  课程名称 <span className="text-rose-400">*</span>
                </label>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {courseDraft.name.length}/50
                </span>
              </div>
              <input
                type="text"
                maxLength={50}
                value={courseDraft.name}
                onChange={(e) => setCourseDraft((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="例如：FDE 体系（初级）：大模型应用工程师实战"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* 课程等级 */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                课程等级 <span className="text-rose-400">*</span>
              </label>
              <select
                value={courseDraft.level}
                onChange={(e) =>
                  setCourseDraft((prev) => ({
                    ...prev,
                    level: e.target.value as CertificationLevel
                  }))
                }
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="初级">初级</option>
                <option value="中级">中级</option>
                <option value="高级">高级</option>
              </select>
            </div>

            {/* 课时数量 */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                课时数量 <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={courseDraft.hours}
                  onChange={(e) => setCourseDraft((prev) => ({ ...prev, hours: e.target.value }))}
                  placeholder="例如：24"
                  className="w-full pl-3.5 pr-12 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tabular-nums placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                  课时
                </span>
              </div>
            </div>

            {/* 课程费用 */}
            <div>
              <label className="block text-xs font-bold text-slate-200 mb-1.5">
                课程费用（元） <span className="text-rose-400">*</span>
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 font-mono">
                  ¥
                </span>
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={courseDraft.fee}
                  onChange={(e) => setCourseDraft((prev) => ({ ...prev, fee: e.target.value }))}
                  placeholder="例如：399.00"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-mono tabular-nums placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            {/* 费用说明 */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">费用说明</label>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {courseDraft.feeDescription.length}/80
                </span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={courseDraft.feeDescription}
                onChange={(e) =>
                  setCourseDraft((prev) => ({ ...prev, feeDescription: e.target.value }))
                }
                placeholder="例如：含全套高清录播课程、实战代码仓库与导师答疑"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>

            {/* 适用人群 */}
            <div className="md:col-span-2">
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">适用人群</label>
                <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                  {courseDraft.targetAudience.length}/80
                </span>
              </div>
              <input
                type="text"
                maxLength={80}
                value={courseDraft.targetAudience}
                onChange={(e) =>
                  setCourseDraft((prev) => ({ ...prev, targetAudience: e.target.value }))
                }
                placeholder="例如：培养 AI 入门级业务人才 / 零基础开发者与全栈工程师"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>
        </section>

        {/* 区块二：内容与标签（对应前台标签与详情介绍） */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3.5">
            <h3 className="text-sm font-black text-white">区块二：内容与标签</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              配置前台属性标签、核心能力清单、列表简介以及 Markdown 长文课程介绍
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 课程标签（动态 Tag 输入，按回车生成） */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">课程标签</label>
                <span className="text-[11px] text-slate-500">输入后按 Enter 生成</span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCourseTag();
                    }
                  }}
                  placeholder="输入标签如：实战、推荐零基础，按回车添加"
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                />
                <button
                  type="button"
                  onClick={addCourseTag}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {courseDraft.customTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {courseDraft.customTags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-xs font-medium"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => removeCourseTag(tag)}
                        aria-label={`移除标签 ${tag}`}
                        className="hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* 核心能力（动态 Tag 输入，限制最多 8 个） */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-200">核心能力</label>
                <span
                  className={`text-[11px] font-mono tabular-nums ${
                    courseDraft.coreCapabilities.length >= 8 ? 'text-amber-400' : 'text-slate-500'
                  }`}
                >
                  {courseDraft.coreCapabilities.length}/8
                </span>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={capabilityInput}
                  disabled={courseDraft.coreCapabilities.length >= 8}
                  onChange={(e) => setCapabilityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addCoreCapability();
                    }
                  }}
                  placeholder={
                    courseDraft.coreCapabilities.length >= 8
                      ? '已达到最多 8 项核心能力上限'
                      : '输入核心能力要点，按回车添加（最多 8 个）'
                  }
                  className="flex-1 px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition disabled:opacity-50"
                />
                <button
                  type="button"
                  disabled={courseDraft.coreCapabilities.length >= 8}
                  onClick={addCoreCapability}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  添加
                </button>
              </div>
              {courseDraft.coreCapabilities.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2.5">
                  {courseDraft.coreCapabilities.map((cap) => (
                    <span
                      key={cap}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/25 text-xs font-medium"
                    >
                      <Check className="w-3 h-3 shrink-0" />
                      <span>{cap}</span>
                      <button
                        type="button"
                        onClick={() => removeCoreCapability(cap)}
                        aria-label={`移除核心能力 ${cap}`}
                        className="hover:text-white cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 课程简介（最多 100 字，带实时字数统计） */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-200">课程简介</label>
              <span
                className={`text-[11px] font-mono tabular-nums ${
                  courseDraft.briefIntro.length >= 100 ? 'text-amber-400 font-bold' : 'text-slate-500'
                }`}
              >
                {courseDraft.briefIntro.length}/100
              </span>
            </div>
            <textarea
              rows={3}
              maxLength={100}
              value={courseDraft.briefIntro}
              onChange={(e) => setCourseDraft((prev) => ({ ...prev, briefIntro: e.target.value }))}
              placeholder="简明扼要介绍这门课程的核心学习内容与实战收获（最多 100 字）..."
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 resize-none leading-relaxed transition"
            />
          </div>

          {/* 课程介绍（Markdown 编辑器） */}
          <div>
            <label className="block text-xs font-bold text-slate-200 mb-1.5">
              课程介绍（Markdown）
            </label>
            <MarkdownEditor
              theme="dark"
              value={courseDraft.introMarkdown}
              onChange={(val) => setCourseDraft((prev) => ({ ...prev, introMarkdown: val }))}
              minHeight="240px"
              placeholder="支持 Markdown 语法编写课程亮点、技术栈与实战项目介绍..."
            />
          </div>
        </section>

        {/* 区块三：课程大纲（动态章节列表，不限数量） */}
        <section className="rounded-2xl bg-slate-900/80 border border-slate-800 p-6 space-y-5">
          <div className="border-b border-slate-800 pb-3.5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-white">区块三：课程大纲</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                按章节配置课程目录、课时与详情内容，前台详情页将自动生成对应锚点导航
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              共 {courseDraft.chapters.length} 个章节
            </span>
          </div>

          {courseDraft.chapters.length === 0 ? (
            <div className="py-10 text-center rounded-xl border border-dashed border-slate-800 text-slate-500">
              <p className="text-xs">暂未添加章节，请点击下方「+ 添加章节」开始编排课程大纲</p>
            </div>
          ) : (
            <div className="space-y-4">
              {courseDraft.chapters.map((chapter, index) => (
                <div
                  key={chapter.id}
                  className="rounded-xl bg-slate-950/70 border border-slate-800 p-5 space-y-4"
                >
                  {/* 章节卡片头：序号 + 上移/下移/删除 */}
                  <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono text-xs font-bold flex items-center justify-center tabular-nums">
                        {index + 1}
                      </span>
                      <span className="text-xs font-bold text-slate-200">
                        第 {index + 1} 章节配置
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveChapter(index, 'up')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border transition ${
                          index === 0
                            ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 cursor-pointer'
                        }`}
                      >
                        <ArrowUp className="w-3 h-3" />
                        <span>上移</span>
                      </button>

                      <button
                        type="button"
                        disabled={index === courseDraft.chapters.length - 1}
                        onClick={() => moveChapter(index, 'down')}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold inline-flex items-center gap-1 border transition ${
                          index === courseDraft.chapters.length - 1
                            ? 'bg-slate-900 text-slate-600 border-slate-800 cursor-not-allowed'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700 cursor-pointer'
                        }`}
                      >
                        <ArrowDown className="w-3 h-3" />
                        <span>下移</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteChapter(chapter.id)}
                        className="px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/25 text-[11px] font-bold inline-flex items-center gap-1 transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>删除</span>
                      </button>
                    </div>
                  </div>

                  {/* 章节名称 + 本节课时数 */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-9">
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="text-xs font-bold text-slate-300">
                          章节名称 <span className="text-rose-400">*</span>
                        </label>
                        <span className="text-[11px] font-mono text-slate-500 tabular-nums">
                          {chapter.title.length}/50
                        </span>
                      </div>
                      <input
                        type="text"
                        maxLength={50}
                        value={chapter.title}
                        onChange={(e) => updateChapter(chapter.id, { title: e.target.value })}
                        placeholder="例如：模块一：大模型应用架构与提示词工程"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                      />
                    </div>

                    <div className="md:col-span-3">
                      <label className="block text-xs font-bold text-slate-300 mb-1.5">
                        本节课时数
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          min={1}
                          step={1}
                          value={chapter.hours}
                          onChange={(e) => updateChapter(chapter.id, { hours: e.target.value })}
                          placeholder="6"
                          className="w-full pl-3.5 pr-12 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono tabular-nums placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-500">
                          课时
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 章节详情内容（Markdown 编辑器） */}
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1.5">
                      章节详情内容（Markdown）
                    </label>
                    <MarkdownEditor
                      theme="dark"
                      value={chapter.contentMarkdown}
                      onChange={(val) => updateChapter(chapter.id, { contentMarkdown: val })}
                      minHeight="160px"
                      placeholder="填写本章节的知识点、实验任务、案例拆解与交付标准..."
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* 底部添加章节按钮 */}
          <div>
            <button
              type="button"
              onClick={addChapter}
              className="w-full py-3 rounded-xl border border-dashed border-indigo-500/40 bg-indigo-500/5 hover:bg-indigo-500/15 text-indigo-300 text-xs font-bold inline-flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>添加章节</span>
            </button>
          </div>
        </section>

        {/* 页面底部操作区：取消 / 保存 */}
        <div className="sticky bottom-0 z-10 rounded-2xl bg-slate-900/95 backdrop-blur-md border border-slate-800 px-6 py-4 flex items-center justify-between shadow-xl shadow-black/40">
          <p className="text-xs text-slate-400">
            {isEdit
              ? '保存后将立即同步更新至前台课程培训中心展示内容'
              : '新增课程默认状态为「隐藏」，可在课程列表中勾选并设为「公开」'}
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('courses')}
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="button"
              onClick={handleSaveCourse}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {viewMode === 'systems' && renderSystemsLevel()}
      {viewMode === 'courses' && renderCoursesLevel()}
      {viewMode === 'course_editor' && renderCourseEditorLevel()}

      {/* 新增 / 编辑课程体系弹窗（仅名称字段，限 20 字） */}
      {systemModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSystemModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white">
                {editingSystem ? '编辑课程体系' : '新增课程体系'}
              </h3>
              <button
                type="button"
                onClick={() => setSystemModalOpen(false)}
                className="text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveSystem} className="p-6 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-200">
                    课程体系名称 <span className="text-rose-400">*</span>
                  </label>
                  <span
                    className={`text-[11px] font-mono tabular-nums ${
                      systemNameInput.length >= 20 ? 'text-amber-400' : 'text-slate-500'
                    }`}
                  >
                    {systemNameInput.length}/20
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={20}
                  autoFocus
                  value={systemNameInput}
                  onChange={(e) => setSystemNameInput(e.target.value)}
                  placeholder="例如：FDE 体系、多模态应用体系"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none focus:border-indigo-500 transition"
                />
                {!editingSystem && (
                  <p className="text-[11px] text-slate-500 mt-2">
                    新增后默认状态为「隐藏」，配置完课程后可批量设为「公开」展示至前台。
                  </p>
                )}
              </div>

              <div className="pt-2 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setSystemModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  确定保存
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 通用删除确认弹窗 */}
      {confirmModal && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setConfirmModal(null)}
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
                  <h3 className="text-sm font-black text-white">{confirmModal.title}</h3>
                  <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                    {confirmModal.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setConfirmModal(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={confirmModal.onConfirm}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  {confirmModal.confirmLabel}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
