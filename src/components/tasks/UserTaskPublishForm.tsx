import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskDomainType, TaskDifficultyLevel, TaskItem } from '../../types';
import {
  ArrowLeft,
  ChevronRight,
  FileText,
  AlertCircle,
  Bold,
  Italic,
  Link,
  Check,
  ShieldCheck,
  Coins,
  Sparkles,
  Calendar,
  CheckCircle2,
  HelpCircle,
  Layers,
  Code,
  Cpu,
  Zap,
  Palette,
  Award
} from 'lucide-react';

interface UserTaskPublishFormProps {
  onBack: () => void;
  initialTask?: TaskItem | null;
  fromTitle?: string;
}

export const UserTaskPublishForm: React.FC<UserTaskPublishFormProps> = ({ onBack, initialTask, fromTitle }) => {
  const { addTask, updateTask, showToast, agents, models, datasets, skills } = useApp();
  const effectiveFromTitle = fromTitle || (initialTask ? '我的已发布任务' : '任务大厅');

  // 1. 任务信息区
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<TaskDomainType>('技术开发');
  const [difficulty, setDifficulty] = useState<TaskDifficultyLevel>('简单');
  
  // 富文本编辑器（简易HTML/Markdown内容）
  const [description, setDescription] = useState(
    '### 任务内容与背景需求\n详细说明任务目标、技术框架、功能点要求与部署背景。\n\n### 交付细节\n1. 源代码及测试脚本；\n2. 可运行的系统/模型配置文件。'
  );
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(
    '1. 交付经过严格测验的源码包与文档；\n2. 指标达查并在测试数据上顺利通过复核；\n3. 附带本地或云端部署复现说明。'
  );

  // 2. 奖励设置区
  const [cashReward, setCashReward] = useState<number>(2000);
  const [pointsReward, setPointsReward] = useState<number>(200);

  // 交付周期区
  const [startTime, setStartTime] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
  });
  const [endTime, setEndTime] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  });

  // 3. 推荐平台资源（可选）状态管理
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>(['ag_01']);
  const [pendingAgentId, setPendingAgentId] = useState<string>('');
  
  const [selectedModelIds, setSelectedModelIds] = useState<string[]>(['m_01']);
  const [pendingModelId, setPendingModelId] = useState<string>('');
  
  const [selectedDatasetIds, setSelectedDatasetIds] = useState<string[]>(['ds_01']);
  const [pendingDatasetId, setPendingDatasetId] = useState<string>('');

  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>(['sk_01']);
  const [pendingSkillId, setPendingSkillId] = useState<string>('');

  const [selectedEnvSpec, setSelectedEnvSpec] = useState<string>('NVIDIA RTX4090 / 24GB VRAM');
  const [selectedEnvImage, setSelectedEnvImage] = useState<string>('Ubuntu 22.04 LTS (PyTorch 2.0)');

  // 4. 发布确认区
  const [confirmInfoValid, setConfirmInfoValid] = useState(true);
  const [agreeProtocol, setAgreeProtocol] = useState(true);

  // 环境规格选项
  const envSpecOptions = [
    '2核CPU / 8GB 内存',
    '4核CPU / 16GB 内存',
    '8核CPU / 32GB 内存',
    'NVIDIA T4 / 16GB VRAM',
    'NVIDIA V100 / 32GB VRAM',
    'NVIDIA RTX4090 / 24GB VRAM',
    'NVIDIA A100 / 40GB VRAM'
  ];

  // 镜像选项
  const envImageOptions = [
    'Ubuntu 22.04 LTS (PyTorch 2.0)',
    'Ubuntu 22.04 LTS (TensorFlow 2.13)',
    'Ubuntu 20.04 LTS (CUDA 11.8)',
    'DeepLearning Base Python 3.10'
  ];

  // 初始化预填
  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title || '');
      setDomain(initialTask.domain || '技术开发');
      setDifficulty(initialTask.difficulty || '简单');
      setDescription(initialTask.description || '');
      setAcceptanceCriteria(initialTask.acceptanceCriteria || '');
      setCashReward(initialTask.cashReward ?? 2000);
      setPointsReward(initialTask.pointsReward ?? 200);
      setStartTime(initialTask.startTime || new Date().toISOString().slice(0, 19).replace('T', ' '));
      setEndTime(initialTask.endTime || new Date().toISOString().slice(0, 19).replace('T', ' '));
      
      if (initialTask.recommendedResources) {
        setSelectedAgentIds(initialTask.recommendedResources.agents || []);
        setSelectedModelIds(initialTask.recommendedResources.models || []);
        setSelectedDatasetIds(initialTask.recommendedResources.datasets || []);
        setSelectedSkillIds(initialTask.recommendedResources.skills || []);
        if (initialTask.recommendedResources.environment) {
          setSelectedEnvSpec(initialTask.recommendedResources.environment.spec || 'NVIDIA RTX4090 / 24GB VRAM');
          setSelectedEnvImage(initialTask.recommendedResources.environment.image || 'Ubuntu 22.04 LTS (PyTorch 2.0)');
        }
      }
    }
  }, [initialTask]);

  // 添加资源处理逻辑
  const handleAddAgent = () => {
    if (!pendingAgentId) return;
    if (selectedAgentIds.length >= 3) {
      showToast('Agent推荐最多允许选择1-3个');
      return;
    }
    if (selectedAgentIds.includes(pendingAgentId)) {
      showToast('该Agent已在推荐列表中');
      return;
    }
    setSelectedAgentIds([...selectedAgentIds, pendingAgentId]);
    setPendingAgentId('');
  };

  const handleAddModel = () => {
    if (!pendingModelId) return;
    if (selectedModelIds.length >= 3) {
      showToast('模型推荐最多允许选择1-3个');
      return;
    }
    if (selectedModelIds.includes(pendingModelId)) {
      showToast('该模型已在推荐列表中');
      return;
    }
    setSelectedModelIds([...selectedModelIds, pendingModelId]);
    setPendingModelId('');
  };

  const handleAddDataset = () => {
    if (!pendingDatasetId) return;
    if (selectedDatasetIds.length >= 3) {
      showToast('数据集推荐最多允许选择1-3个');
      return;
    }
    if (selectedDatasetIds.includes(pendingDatasetId)) {
      showToast('该数据集已在推荐列表中');
      return;
    }
    setSelectedDatasetIds([...selectedDatasetIds, pendingDatasetId]);
    setPendingDatasetId('');
  };

  const handleAddSkill = () => {
    if (!pendingSkillId) return;
    if (selectedSkillIds.length >= 3) {
      showToast('Skill推荐最多允许选择1-3个');
      return;
    }
    if (selectedSkillIds.includes(pendingSkillId)) {
      showToast('该Skill已在推荐列表中');
      return;
    }
    setSelectedSkillIds([...selectedSkillIds, pendingSkillId]);
    setPendingSkillId('');
  };

  // 富文本格式化帮助函数
  const insertFormatting = (target: 'desc' | 'criteria', prefix: string, suffix: string = '') => {
    if (target === 'desc') {
      setDescription(prev => `${prev}\n${prefix}示范内容${suffix}`);
    } else {
      setAcceptanceCriteria(prev => `${prev}\n${prefix}验收规则${suffix}`);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      showToast('请输入任务标题（限30字）');
      return;
    }
    if (title.length > 30) {
      showToast('任务标题最多不能超过30字');
      return;
    }
    if (!description.trim()) {
      showToast('请输入任务描述内容');
      return;
    }
    if (!acceptanceCriteria.trim()) {
      showToast('请输入验收标准');
      return;
    }
    if (cashReward <= 0 && pointsReward <= 0) {
      showToast('现金和积分至少有一项必须大于0');
      return;
    }
    if (!confirmInfoValid || !agreeProtocol) {
      showToast('请确认勾选信息真实有效并同意《任务发布协议》');
      return;
    }

    const recResources = {
      agents: selectedAgentIds,
      models: selectedModelIds,
      datasets: selectedDatasetIds,
      skills: selectedSkillIds,
      environment: {
        spec: selectedEnvSpec,
        image: selectedEnvImage
      }
    };

    if (initialTask) {
      updateTask({
        ...initialTask,
        title: title.trim(),
        taskType: '标准任务',
        domain,
        difficulty,
        description,
        acceptanceCriteria,
        cashReward,
        pointsReward,
        startTime,
        endTime,
        recommendedResources: recResources,
        status: '审核中'
      });
      showToast('任务已修改并重新提交审核');
    } else {
      addTask({
        title: title.trim(),
        taskType: '标准任务',
        domain,
        difficulty,
        description,
        acceptanceCriteria,
        cashReward,
        pointsReward,
        startTime,
        endTime,
        recommendedResources: recResources
      });
      showToast('任务发布申请已提交，等待平台审核上线');
    }

    onBack();
  };

  return (
    <div className="space-y-6 select-none animate-fade-in max-w-5xl mx-auto pb-20 font-sans">
      
      {/* 1. 顶部面包屑与返回导航栏 */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回{effectiveFromTitle}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="cursor-pointer hover:text-indigo-600" onClick={onBack}>{effectiveFromTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-700 font-bold">
              {initialTask ? '修改任务需求' : '发布新需求任务'}
            </span>
          </div>
        </div>
      </div>

      {/* 2. 页面头部 Hero Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-7 shadow-xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-indigo-100/50 via-purple-50/20 to-transparent rounded-bl-full pointer-events-none -z-0" />
        
        <div className="relative z-10 flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black shadow-md shadow-indigo-200 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {initialTask ? '修改并重新发布任务需求' : '发布需求悬赏任务'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              填写完整任务规范与交付要求，全额悬赏资金托管保障，专业极客高效承接与交付
            </p>
          </div>
        </div>
      </div>

      {/* 3. 表单主体 (单栏结构化流畅排版) */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 第一个区域：任务基础信息 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <span className="w-3 h-3 rounded-full bg-indigo-600" />
            <h2 className="text-base font-black text-slate-900">1. 任务基础信息</h2>
          </div>

          {/* 1. 任务标题 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800">
                <span className="text-red-500 mr-0.5">*</span> 任务标题
              </label>
              <span className={`text-xs font-mono font-bold ${title.length > 30 ? 'text-red-600' : 'text-slate-400'}`}>
                {title.length} / 30 字
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={30}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入清晰明确的任务标题（例如：基于LoRA微调电商客服问答大模型），限制30字以内"
              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          {/* 2. 所属领域与难度 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800">
                <span className="text-red-500 mr-0.5">*</span> 所属领域分类
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as TaskDomainType)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500 cursor-pointer"
              >
                <option value="技术开发">技术开发 (前端/后端/系统)</option>
                <option value="AI模型与数据">AI模型与数据 (算法/微调/标注)</option>
                <option value="工具与自动化">工具与自动化 (脚本/工作流/插件)</option>
                <option value="内容创作">内容创作 (设计/Prompt/文案)</option>
                <option value="咨询与培训">咨询与培训 (方案/辅导/架构)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800">
                <span className="text-red-500 mr-0.5">*</span> 任务难度评级
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['简单', '中等', '困难'] as TaskDifficultyLevel[]).map(df => (
                  <button
                    key={df}
                    type="button"
                    onClick={() => setDifficulty(df)}
                    className={`py-2.5 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      difficulty === df
                        ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    {df}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. 任务描述 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800">
                <span className="text-red-500 mr-0.5">*</span> 任务描述与背景需求
              </label>
              {/* 富文本快捷操作 */}
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => insertFormatting('desc', '**', '**')}
                  className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded text-xs font-bold transition"
                  title="加粗"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('desc', '*', '*')}
                  className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded text-xs font-bold transition"
                  title="斜体"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('desc', '[链接文字](http://...)')}
                  className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded text-xs font-bold transition"
                  title="插入链接"
                >
                  <Link className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <textarea
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="请详细说明任务背景、具体功能需求、代码架构及交付物要求..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium leading-relaxed outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>

          {/* 4. 验收标准 */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-slate-800">
                <span className="text-red-500 mr-0.5">*</span> 成果验收标准
              </label>
              <div className="flex items-center gap-1 text-slate-400">
                <button
                  type="button"
                  onClick={() => insertFormatting('criteria', '1. ')}
                  className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded text-xs font-bold transition"
                  title="有序序号"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <textarea
              required
              rows={5}
              value={acceptanceCriteria}
              onChange={(e) => setAcceptanceCriteria(e.target.value)}
              placeholder="请明确列出成果验收的硬性指标、复现步骤或性能参数标准..."
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium leading-relaxed outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        {/* 第二个区域：奖励设置与交付周期 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <span className="w-3 h-3 rounded-full bg-amber-500" />
            <h2 className="text-base font-black text-slate-900">2. 悬赏奖励与交付截止周期</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800">
                现金悬赏奖励（元）
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">¥</span>
                <input
                  type="number"
                  min={0}
                  value={cashReward}
                  onChange={(e) => setCashReward(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono font-bold outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-800">
                额外积分奖励（个）
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-xs">+</span>
                <input
                  type="number"
                  min={0}
                  value={pointsReward}
                  onChange={(e) => setPointsReward(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono font-bold outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-800">
              <span className="text-red-500 mr-0.5">*</span> 任务截止交付时间 (到期自动停止接单)
            </label>
            <div className="relative">
              <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="YYYY-MM-DD HH:mm:ss"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono font-bold outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-medium pt-0.5">
              * 提示：任务发布并通过审核后将自动上架并进入【进行中】状态，到达截止时间后若验收通过将结算打款。
            </p>
          </div>
        </div>

        {/* 第三个区域：推荐平台资源（可选） */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <span className="w-3 h-3 rounded-full bg-cyan-500" />
              <h2 className="text-base font-black text-slate-900">3. 推荐平台资源（可选）</h2>
            </div>
            <span className="text-[11px] font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
              推荐后接单人可见
            </span>
          </div>

          <p className="text-xs text-slate-500 font-medium leading-relaxed bg-cyan-50/40 p-3.5 rounded-xl border border-cyan-100">
            💡 以下资源将展示给任务接单人，帮助其快速理解任务背景并高效完成。不选不影响任务发布。
          </p>

          <div className="space-y-4">
            {/* Agent 推荐 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>Agent推荐</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">数量限制：1-3个</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pendingAgentId}
                  onChange={(e) => setPendingAgentId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">搜索或选择Agent...</option>
                  {agents.map(ag => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.category || '智能体'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddAgent}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {selectedAgentIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 font-bold">已选：</span>
                  {selectedAgentIds.map(id => {
                    const item = agents.find(a => a.id === id);
                    const name = item ? item.name : id;
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedAgentIds(selectedAgentIds.filter(i => i !== id))}
                          className="hover:text-red-500 transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 模型推荐 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span>模型推荐</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">数量限制：1-3个</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pendingModelId}
                  onChange={(e) => setPendingModelId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">搜索或选择模型...</option>
                  {models.map(m => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.vendor || 'AI底座'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddModel}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {selectedModelIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 font-bold">已选：</span>
                  {selectedModelIds.map(id => {
                    const item = models.find(m => m.id === id);
                    const name = item ? item.name : id;
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200 font-bold">
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedModelIds(selectedModelIds.filter(i => i !== id))}
                          className="hover:text-red-500 transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 数据集推荐 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>数据集推荐</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">数量限制：1-3个</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pendingDatasetId}
                  onChange={(e) => setPendingDatasetId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">搜索或选择数据集...</option>
                  {datasets.map(d => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.modalityCategory || '公开数据集'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddDataset}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {selectedDatasetIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 font-bold">已选：</span>
                  {selectedDatasetIds.map(id => {
                    const item = datasets.find(d => d.id === id);
                    const name = item ? item.name : id;
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedDatasetIds(selectedDatasetIds.filter(i => i !== id))}
                          className="hover:text-red-500 transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Skill 推荐 */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Skill推荐</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">数量限制：1-3个</span>
              </div>
              <div className="flex items-center gap-2">
                <select
                  value={pendingSkillId}
                  onChange={(e) => setPendingSkillId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 font-medium outline-none focus:border-indigo-500 cursor-pointer"
                >
                  <option value="">搜索或选择Skill...</option>
                  {skills.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category || 'Skill'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {selectedSkillIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                  <span className="text-slate-500 font-bold">已选：</span>
                  {selectedSkillIds.map(id => {
                    const item = skills.find(s => s.id === id);
                    const name = item ? item.name : id;
                    return (
                      <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 font-bold">
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedSkillIds(selectedSkillIds.filter(i => i !== id))}
                          className="hover:text-red-500 transition cursor-pointer"
                        >
                          ✕
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 环境推荐（算力工坊） */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>环境推荐（算力工坊）</span>
                </label>
                <span className="text-[11px] font-mono text-slate-400">数量限制：1个</span>
              </div>

              <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold">规格选择：</span>
                    <select
                      value={selectedEnvSpec}
                      onChange={(e) => setSelectedEnvSpec(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {envSpecOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <span className="text-slate-500 font-bold">推荐镜像：</span>
                    <select
                      value={selectedEnvImage}
                      onChange={(e) => setSelectedEnvImage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-bold outline-none focus:border-indigo-500 cursor-pointer"
                    >
                      {envImageOptions.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* 第四个区域：发布合规确认与操作 */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-2.5 border-b border-slate-100 pb-4">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <h2 className="text-base font-black text-slate-900">4. 发布合规确认</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-bold text-slate-700 bg-slate-50/80 p-4 rounded-2xl border border-slate-200/60">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmInfoValid}
                onChange={(e) => setConfirmInfoValid(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
              />
              <span className="leading-relaxed">我已确认所填写的任务需求、验收指标与奖励信息真实有效</span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeProtocol}
                onChange={(e) => setAgreeProtocol(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer shrink-0"
              />
              <span className="leading-relaxed">我已阅读并同意《AI运营中心任务悬赏发布与成果验收协议》</span>
            </label>
          </div>

          {/* 操作按钮组 */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3.5">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto px-8 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              取消返回
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto px-10 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition cursor-pointer"
            >
              {initialTask ? '保存并提交审核' : '提交审核发布'}
            </button>
          </div>
        </div>

      </form>

    </div>
  );
};
