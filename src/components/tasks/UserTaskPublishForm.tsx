import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskDomainType, TaskDifficultyLevel, TaskItem } from '../../types';
import {
  ArrowLeft,
  Bold,
  Italic,
  Link,
  ListOrdered,
  Calendar,
  X
} from 'lucide-react';

interface UserTaskPublishFormProps {
  onBack: () => void;
  initialTask?: TaskItem | null;
  fromTitle?: string;
}

export const UserTaskPublishForm: React.FC<UserTaskPublishFormProps> = ({
  onBack,
  initialTask,
  fromTitle
}) => {
  const { addTask, updateTask, showToast, agents, models, datasets, skills } = useApp();
  const effectiveFromTitle = fromTitle || (initialTask ? '我的已发布任务' : '任务大厅');

  // 1. 任务信息区
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<TaskDomainType>('技术开发');
  const [difficulty, setDifficulty] = useState<TaskDifficultyLevel>('简单');

  // 富文本编辑器（使用浅灰色占位符替代杂乱内置提示文本）
  const [description, setDescription] = useState('');
  const [acceptanceCriteria, setAcceptanceCriteria] = useState('');

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

  // 初始化预填（编辑模式）
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
          setSelectedEnvSpec(
            initialTask.recommendedResources.environment.spec || 'NVIDIA RTX4090 / 24GB VRAM'
          );
          setSelectedEnvImage(
            initialTask.recommendedResources.environment.image || 'Ubuntu 22.04 LTS (PyTorch 2.0)'
          );
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
      setDescription((prev) => `${prev ? `${prev}\n` : ''}${prefix}文本内容${suffix}`);
    } else {
      setAcceptanceCriteria((prev) => `${prev ? `${prev}\n` : ''}${prefix}验收要求${suffix}`);
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
    <div className="max-w-4xl mx-auto pt-2 pb-24 select-none animate-fade-in text-[#1A1A1A] antialiased">
      {/* 1. 极简顶部标题区：无外框卡片、无图标，仅保留文字返回链 + 28px 纯黑标题 + 14px 浅灰副标题 + 极细分隔线 */}
      <header className="pb-7 border-b border-[#EAEAEA]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#666666] hover:text-[#000000] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.6} />
          <span>返回{effectiveFromTitle}</span>
        </button>

        <h1 className="mt-5 text-[28px] font-bold text-[#000000] tracking-[-0.02em] leading-tight">
          {initialTask ? '修改并重新发布任务需求' : '发布需求悬赏任务'}
        </h1>
        <p className="mt-2 text-[14px] text-[#888888] font-normal leading-relaxed">
          填写完整任务规范与交付要求，全额悬赏资金托管保障，专业极客高效承接与交付。
        </p>
      </header>

      {/* 2. 表单主体：纯白极简黑白灰排版 */}
      <form onSubmit={handleSubmit} className="divide-y divide-[#EAEAEA]">
        {/* 区块 1：任务基础信息 */}
        <section className="py-8 space-y-6">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[12px] font-mono text-[#999999]">01</span>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A] tracking-[-0.01em]">
              任务基础信息
            </h2>
          </div>

          {/* 任务标题 */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#1A1A1A]">
                任务标题 <span className="text-[#999999]">*</span>
              </label>
              <span
                className={`text-[12px] font-mono tabular-nums ${
                  title.length > 30 ? 'text-[#1A1A1A] font-semibold' : 'text-[#999999]'
                }`}
              >
                {title.length} / 30
              </span>
            </div>
            <input
              type="text"
              required
              maxLength={30}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="请输入清晰明确的任务标题（例如：基于 LoRA 微调电商客服问答大模型），限 30 字以内"
              className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none focus:border-[#1A1A1A] transition-colors"
            />
          </div>

          {/* 所属领域与难度评级 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#1A1A1A]">
                所属领域分类 <span className="text-[#999999]">*</span>
              </label>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value as TaskDomainType)}
                className="w-full px-3.5 py-2.5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[14px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
              >
                <option value="技术开发">技术开发 (前端/后端/系统)</option>
                <option value="AI模型与数据">AI模型与数据 (算法/微调/标注)</option>
                <option value="工具与自动化">工具与自动化 (脚本/工作流/插件)</option>
                <option value="内容创作">内容创作 (设计/Prompt/文案)</option>
                <option value="咨询与培训">咨询与培训 (方案/辅导/架构)</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#1A1A1A]">
                任务难度评级 <span className="text-[#999999]">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {(['简单', '中等', '困难'] as TaskDifficultyLevel[]).map((df) => (
                  <button
                    key={df}
                    type="button"
                    onClick={() => setDifficulty(df)}
                    className={`py-2.5 rounded-[6px] text-[13px] font-medium border transition-colors cursor-pointer ${
                      difficulty === df
                        ? 'bg-[#1A1A1A] text-[#FFFFFF] border-[#1A1A1A]'
                        : 'bg-[#FFFFFF] border-[#EAEAEA] text-[#666666] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {df}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 任务描述与背景需求（纯白底 + 极简黑色细线工具栏 + 极细分隔线 + 浅灰占位符） */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#1A1A1A]">
              任务描述与背景需求 <span className="text-[#999999]">*</span>
            </label>
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] focus-within:border-[#1A1A1A] transition-colors overflow-hidden">
              <div className="px-3 py-2 bg-[#FFFFFF] border-b border-[#EAEAEA] flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormatting('desc', '**', '**')}
                  title="加粗"
                  className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                >
                  <Bold className="w-3.5 h-3.5" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('desc', '*', '*')}
                  title="斜体"
                  className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                >
                  <Italic className="w-3.5 h-3.5" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('desc', '[链接文字](https://...)')}
                  title="插入链接"
                  className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                >
                  <Link className="w-3.5 h-3.5" strokeWidth={1.6} />
                </button>
              </div>
              <textarea
                required
                rows={6}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="请详细说明任务背景、技术框架、核心功能要求及需要交付的源代码、配置文件或文档说明..."
                className="w-full p-4 bg-[#FFFFFF] border-0 text-[14px] text-[#1A1A1A] placeholder:text-[#999999] leading-relaxed outline-none resize-y"
              />
            </div>
          </div>

          {/* 成果验收标准 */}
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#1A1A1A]">
              成果验收标准 <span className="text-[#999999]">*</span>
            </label>
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] focus-within:border-[#1A1A1A] transition-colors overflow-hidden">
              <div className="px-3 py-2 bg-[#FFFFFF] border-b border-[#EAEAEA] flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => insertFormatting('criteria', '1. ')}
                  title="有序列表"
                  className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                >
                  <ListOrdered className="w-3.5 h-3.5" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => insertFormatting('criteria', '**', '**')}
                  title="加粗"
                  className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
                >
                  <Bold className="w-3.5 h-3.5" strokeWidth={1.6} />
                </button>
              </div>
              <textarea
                required
                rows={5}
                value={acceptanceCriteria}
                onChange={(e) => setAcceptanceCriteria(e.target.value)}
                placeholder="请明确列出成果验收的量化指标、测试集复核标准以及本地或云端部署复现说明..."
                className="w-full p-4 bg-[#FFFFFF] border-0 text-[14px] text-[#1A1A1A] placeholder:text-[#999999] leading-relaxed outline-none resize-y"
              />
            </div>
          </div>
        </section>

        {/* 区块 2：悬赏奖励与交付截止周期 */}
        <section className="py-8 space-y-6">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[12px] font-mono text-[#999999]">02</span>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A] tracking-[-0.01em]">
              悬赏奖励与交付截止周期
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#1A1A1A]">
                现金悬赏奖励（元）
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] font-mono text-[13px]">
                  ¥
                </span>
                <input
                  type="number"
                  min={0}
                  value={cashReward}
                  onChange={(e) => setCashReward(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[14px] text-[#1A1A1A] font-mono tabular-nums outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#1A1A1A]">
                额外积分奖励（个）
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#999999] font-mono text-[13px]">
                  +
                </span>
                <input
                  type="number"
                  min={0}
                  value={pointsReward}
                  onChange={(e) => setPointsReward(Math.max(0, parseInt(e.target.value, 10) || 0))}
                  className="w-full pl-8 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[14px] text-[#1A1A1A] font-mono tabular-nums outline-none focus:border-[#1A1A1A] transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#1A1A1A]">
              任务截止交付时间（到期自动停止接单） <span className="text-[#999999]">*</span>
            </label>
            <div className="relative">
              <Calendar
                className="w-4 h-4 text-[#999999] absolute left-3.5 top-1/2 -translate-y-1/2"
                strokeWidth={1.6}
              />
              <input
                type="text"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="YYYY-MM-DD HH:mm:ss"
                className="w-full pl-10 pr-4 py-2.5 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[14px] text-[#1A1A1A] font-mono tabular-nums placeholder:text-[#999999] outline-none focus:border-[#1A1A1A] transition-colors"
              />
            </div>
            <p className="text-[12px] text-[#999999] pt-0.5">
              任务审核通过后将自动上架并进入进行中状态，成果验收通过后结算赏金。
            </p>
          </div>
        </section>

        {/* 区块 3：推荐平台资源（可选） */}
        <section className="py-8 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2.5">
              <span className="text-[12px] font-mono text-[#999999]">03</span>
              <h2 className="text-[16px] font-semibold text-[#1A1A1A] tracking-[-0.01em]">
                推荐平台资源（可选）
              </h2>
            </div>
            <span className="text-[12px] text-[#999999]">推荐后接单人可见</span>
          </div>

          <p className="text-[13px] text-[#666666] leading-relaxed">
            以下平台资源将作为参考展示给任务接单人，帮助其快速启动开发；不选不影响任务发布。
          </p>

          <div className="space-y-4">
            {/* Agent 推荐 */}
            <div className="p-4 rounded-[6px] bg-[#FFFFFF] border border-[#EAEAEA] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[#1A1A1A]">Agent 推荐</label>
                <span className="text-[12px] font-mono text-[#999999]">限 1-3 个</span>
              </div>
              <div className="flex items-center gap-2.5">
                <select
                  value={pendingAgentId}
                  onChange={(e) => setPendingAgentId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[13px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <option value="">选择推荐 Agent...</option>
                  {agents.map((ag) => (
                    <option key={ag.id} value={ag.id}>
                      {ag.name} ({ag.category || '智能体'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddAgent}
                  className="px-4 py-2 bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {selectedAgentIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedAgentIds.map((id) => {
                    const item = agents.find((a) => a.id === id);
                    const name = item ? item.name : id;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#FFFFFF] text-[#1A1A1A] border border-[#EAEAEA] text-[12px]"
                      >
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedAgentIds(selectedAgentIds.filter((i) => i !== id))}
                          className="text-[#999999] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                          aria-label={`移除 ${name}`}
                        >
                          <X className="w-3 h-3" strokeWidth={1.6} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 模型推荐 */}
            <div className="p-4 rounded-[6px] bg-[#FFFFFF] border border-[#EAEAEA] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[#1A1A1A]">模型推荐</label>
                <span className="text-[12px] font-mono text-[#999999]">限 1-3 个</span>
              </div>
              <div className="flex items-center gap-2.5">
                <select
                  value={pendingModelId}
                  onChange={(e) => setPendingModelId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[13px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <option value="">选择推荐模型...</option>
                  {models.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.vendor || 'AI底座'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddModel}
                  className="px-4 py-2 bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {selectedModelIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedModelIds.map((id) => {
                    const item = models.find((m) => m.id === id);
                    const name = item ? item.name : id;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#FFFFFF] text-[#1A1A1A] border border-[#EAEAEA] text-[12px]"
                      >
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedModelIds(selectedModelIds.filter((i) => i !== id))}
                          className="text-[#999999] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                          aria-label={`移除 ${name}`}
                        >
                          <X className="w-3 h-3" strokeWidth={1.6} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 数据集推荐 */}
            <div className="p-4 rounded-[6px] bg-[#FFFFFF] border border-[#EAEAEA] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[#1A1A1A]">数据集推荐</label>
                <span className="text-[12px] font-mono text-[#999999]">限 1-3 个</span>
              </div>
              <div className="flex items-center gap-2.5">
                <select
                  value={pendingDatasetId}
                  onChange={(e) => setPendingDatasetId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[13px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <option value="">选择推荐数据集...</option>
                  {datasets.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.modalityCategory || '公开数据集'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddDataset}
                  className="px-4 py-2 bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {selectedDatasetIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedDatasetIds.map((id) => {
                    const item = datasets.find((d) => d.id === id);
                    const name = item ? item.name : id;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#FFFFFF] text-[#1A1A1A] border border-[#EAEAEA] text-[12px]"
                      >
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedDatasetIds(selectedDatasetIds.filter((i) => i !== id))
                          }
                          className="text-[#999999] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                          aria-label={`移除 ${name}`}
                        >
                          <X className="w-3 h-3" strokeWidth={1.6} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Skill 推荐 */}
            <div className="p-4 rounded-[6px] bg-[#FFFFFF] border border-[#EAEAEA] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[#1A1A1A]">Skill 推荐</label>
                <span className="text-[12px] font-mono text-[#999999]">限 1-3 个</span>
              </div>
              <div className="flex items-center gap-2.5">
                <select
                  value={pendingSkillId}
                  onChange={(e) => setPendingSkillId(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[13px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                >
                  <option value="">选择推荐 Skill...</option>
                  {skills.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category || 'Skill'})
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-2 bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#1A1A1A] text-[#1A1A1A] rounded-[6px] text-[13px] font-medium transition-colors cursor-pointer shrink-0"
                >
                  添加
                </button>
              </div>
              {selectedSkillIds.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  {selectedSkillIds.map((id) => {
                    const item = skills.find((s) => s.id === id);
                    const name = item ? item.name : id;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#FFFFFF] text-[#1A1A1A] border border-[#EAEAEA] text-[12px]"
                      >
                        <span>{name}</span>
                        <button
                          type="button"
                          onClick={() => setSelectedSkillIds(selectedSkillIds.filter((i) => i !== id))}
                          className="text-[#999999] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                          aria-label={`移除 ${name}`}
                        >
                          <X className="w-3 h-3" strokeWidth={1.6} />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 环境推荐（算力工坊） */}
            <div className="p-4 rounded-[6px] bg-[#FFFFFF] border border-[#EAEAEA] space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[13px] font-medium text-[#1A1A1A]">
                  环境推荐（算力工坊）
                </label>
                <span className="text-[12px] font-mono text-[#999999]">限 1 个</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="block text-[12px] text-[#666666]">规格选择</span>
                  <select
                    value={selectedEnvSpec}
                    onChange={(e) => setSelectedEnvSpec(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[13px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    {envSpecOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <span className="block text-[12px] text-[#666666]">推荐镜像</span>
                  <select
                    value={selectedEnvImage}
                    onChange={(e) => setSelectedEnvImage(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] text-[13px] text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    {envImageOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 区块 4：发布合规确认与操作 */}
        <section className="py-8 space-y-6">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[12px] font-mono text-[#999999]">04</span>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A] tracking-[-0.01em]">
              发布合规确认
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-[#4A4A4A] bg-[#FFFFFF] p-4 rounded-[6px] border border-[#EAEAEA]">
            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={confirmInfoValid}
                onChange={(e) => setConfirmInfoValid(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-[2px] border-[#CCCCCC] accent-[#1A1A1A] cursor-pointer shrink-0"
              />
              <span className="leading-relaxed">
                我已确认所填写的任务需求、验收指标与奖励信息真实有效
              </span>
            </label>

            <label className="flex items-start gap-2.5 cursor-pointer">
              <input
                type="checkbox"
                checked={agreeProtocol}
                onChange={(e) => setAgreeProtocol(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded-[2px] border-[#CCCCCC] accent-[#1A1A1A] cursor-pointer shrink-0"
              />
              <span className="leading-relaxed">
                我已阅读并同意《AI运营中心任务悬赏发布与成果验收协议》
              </span>
            </label>
          </div>

          {/* 底部极简按钮组 */}
          <div className="pt-2 flex flex-col-reverse sm:flex-row items-center justify-end gap-3">
            <button
              type="button"
              onClick={onBack}
              className="w-full sm:w-auto h-[42px] px-7 rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] hover:border-[#1A1A1A] text-[#1A1A1A] font-medium text-[13px] transition-colors cursor-pointer"
            >
              取消返回
            </button>
            <button
              type="submit"
              className="w-full sm:w-auto h-[42px] px-8 rounded-[6px] bg-[#1A1A1A] hover:bg-[#333333] text-[#FFFFFF] font-medium text-[13px] transition-colors cursor-pointer"
            >
              {initialTask ? '保存并提交审核' : '提交审核发布'}
            </button>
          </div>
        </section>
      </form>
    </div>
  );
};
