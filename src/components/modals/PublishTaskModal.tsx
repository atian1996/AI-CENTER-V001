import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskDomainType, TaskDifficultyLevel, TaskItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  FileText,
  AlertCircle,
  Bold,
  Italic,
  Link,
  Upload,
  Check,
  ShieldCheck
} from 'lucide-react';

interface PublishTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTask?: TaskItem | null;
}

export const PublishTaskModal: React.FC<PublishTaskModalProps> = ({ isOpen, onClose, initialTask }) => {
  const { addTask, updateTask, user, showToast } = useApp();

  // 1. 任务信息区
  const [title, setTitle] = useState('');
  const [domain, setDomain] = useState<TaskDomainType>('技术开发');
  const [difficulty, setDifficulty] = useState<TaskDifficultyLevel>('简单');
  
  // 富文本编辑器（简易HTML/Markdown内容）
  const [description, setDescription] = useState(
    '### 任务内容与背景需求\n详细说明任务目标、技术框架、功能点要求与部署背景。\n\n### 交付细节\n1. 源代码及测试脚本；\n2. 可运行的系统/模型配置文件。'
  );
  const [acceptanceCriteria, setAcceptanceCriteria] = useState(
    '1. 交付经过严格测验的源码包与文档；\n2. 指标达标并在测试数据上顺利通过复核；\n3. 附带本地或云端部署复现说明。'
  );

  // 2. 奖励设置区
  const [cashReward, setCashReward] = useState<number>(2000);
  const [pointsReward, setPointsReward] = useState<number>(200);

  // 3. 交付周期区
  const [startTime, setStartTime] = useState<string>(() => {
    const now = new Date();
    return now.toISOString().slice(0, 19).replace('T', ' ');
  });
  const [endTime, setEndTime] = useState<string>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 14);
    return d.toISOString().slice(0, 19).replace('T', ' ');
  });

  // 4. 发布确认区
  const [confirmInfoValid, setConfirmInfoValid] = useState(true);
  const [agreeProtocol, setAgreeProtocol] = useState(true);

  // 初始化预填
  useEffect(() => {
    if (initialTask && isOpen) {
      setTitle(initialTask.title || '');
      setDomain(initialTask.domain || '技术开发');
      setDifficulty(initialTask.difficulty || '简单');
      setDescription(initialTask.description || '');
      setAcceptanceCriteria(initialTask.acceptanceCriteria || '');
      setCashReward(initialTask.cashReward ?? 2000);
      setPointsReward(initialTask.pointsReward ?? 200);
      setStartTime(initialTask.startTime || new Date().toISOString().slice(0, 19).replace('T', ' '));
      setEndTime(initialTask.endTime || new Date().toISOString().slice(0, 19).replace('T', ' '));
    } else if (!initialTask && isOpen) {
      setTitle('');
      setDomain('技术开发');
      setDifficulty('简单');
      setDescription('### 任务内容与背景需求\n详细说明任务目标、技术框架、功能点要求与部署背景。\n\n### 交付细节\n1. 源代码及测试脚本；\n2. 可运行的系统/模型配置文件。');
      setAcceptanceCriteria('1. 交付经过严格测验的源码包与文档；\n2. 指标达标并在测试数据上顺利通过复核；\n3. 附带本地或云端部署复现说明。');
      setCashReward(2000);
      setPointsReward(200);
    }
  }, [initialTask, isOpen]);

  if (!isOpen) return null;

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
        endTime
      });
    }

    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          {/* 顶栏 */}
          <div className="flex items-center justify-between px-7 py-4.5 border-b border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-600/10 text-indigo-600 flex items-center justify-center font-black">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                  {initialTask ? '修改并重新发布任务' : '发布任务'}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  填写完整任务规范与交付要求，提交平台进行合规审核
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 表单滚动主体 */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-7 space-y-8">
            {/* 第一个区域：任务信息 */}
            <div className="space-y-5">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <h4 className="text-sm font-black text-slate-900">任务信息</h4>
              </div>

              {/* 1. 任务标题 */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
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
                  placeholder="请输入清晰明确的任务标题，限制30个字以内"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-semibold outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* 2. 所属领域与难度 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    <span className="text-red-500 mr-0.5">*</span> 所属领域
                  </label>
                  <select
                    value={domain}
                    onChange={(e) => setDomain(e.target.value as TaskDomainType)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-bold outline-none focus:bg-white focus:border-indigo-500"
                  >
                    <option value="技术开发">技术开发</option>
                    <option value="内容创作">内容创作</option>
                    <option value="AI模型与数据">AI模型与数据</option>
                    <option value="工具与自动化">工具与自动化</option>
                    <option value="咨询与培训">咨询与培训</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    <span className="text-red-500 mr-0.5">*</span> 任务难度
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['简单', '中等', '困难'] as TaskDifficultyLevel[]).map(df => (
                      <button
                        key={df}
                        type="button"
                        onClick={() => setDifficulty(df)}
                        className={`py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
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

              {/* 4. 任务描述（富文本） */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-800">
                    <span className="text-red-500 mr-0.5">*</span> 任务描述
                  </label>
                  {/* 简易富文本工具栏 */}
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <button
                      type="button"
                      onClick={() => insertFormatting('desc', '**', '**')}
                      className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded text-xs font-bold"
                      title="加粗"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('desc', '*', '*')}
                      className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded text-xs font-bold"
                      title="斜体"
                    >
                      <Italic className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertFormatting('desc', '[链接文字](http://...)')}
                      className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded text-xs font-bold"
                      title="插入链接"
                    >
                      <Link className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <textarea
                  required
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="请详细说明任务背景、具体功能需求、代码架构及交付物要求..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium leading-relaxed outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>

              {/* 5. 验收标准（富文本） */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-black text-slate-800">
                    <span className="text-red-500 mr-0.5">*</span> 验收标准
                  </label>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <button
                      type="button"
                      onClick={() => insertFormatting('criteria', '1. ')}
                      className="p-1 hover:text-slate-800 hover:bg-slate-100 rounded text-xs font-bold"
                    >
                      <Bold className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <textarea
                  required
                  rows={4}
                  value={acceptanceCriteria}
                  onChange={(e) => setAcceptanceCriteria(e.target.value)}
                  placeholder="请明确列出成果验收的硬性指标、复现步骤或性能参数标准..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium leading-relaxed outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
                />
              </div>
            </div>

            {/* 第二个区域：奖励设置 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <h4 className="text-sm font-black text-slate-900">奖励设置</h4>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    现金奖励（元）
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={cashReward}
                    onChange={(e) => setCashReward(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono font-bold outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-xs font-black text-slate-800 mb-1.5 block">
                    积分奖励（个）
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={pointsReward}
                    onChange={(e) => setPointsReward(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono font-bold outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                * 提示：现金与积分可填0，至少现金和积分有一项大于0。
              </p>
            </div>

            {/* 第三个区域：交付周期 */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <h4 className="text-sm font-black text-slate-900">交付截止时间</h4>
              </div>

              <div>
                <label className="text-xs font-black text-slate-800 mb-1.5 block">
                  任务截止时间
                </label>
                <input
                  type="text"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  placeholder="YYYY-MM-DD HH:mm:ss"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono font-bold outline-none focus:bg-white focus:border-indigo-500"
                />
              </div>

              <p className="text-[11px] text-slate-400 font-medium">
                * 提示：任务发布并通过审核后将自动上架并进入【进行中】状态，到达截止时间后将自动下架打款。
              </p>
            </div>

            {/* 第四个区域：发布确认区 */}
            <div className="space-y-4 pt-2">
              <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs text-amber-900 space-y-2">
                <div className="font-extrabold flex items-center gap-1.5 text-amber-950">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>发布须知：</span>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed font-medium">
                  发布任务需预付全部现金与积分奖励至平台托管账户，任务提交后资金与积分自动冻结托管；任务完成后自动结算，任务因违规被驳回或取消则全额原路解冻退还。
                </p>
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmInfoValid}
                    onChange={(e) => setConfirmInfoValid(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>我已确认以上信息真实有效</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreeProtocol}
                    onChange={(e) => setAgreeProtocol(e.target.checked)}
                    className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>我已阅读并同意《任务发布协议》</span>
                </label>
              </div>
            </div>

            {/* 最底部显示预付总额与提交按钮 */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs">
                <span className="text-slate-500 font-bold">需预付总额：</span>
                <span className="text-lg font-black font-mono text-indigo-600 ml-1">
                  ¥{cashReward.toLocaleString()} 元
                </span>
                {pointsReward > 0 && (
                  <span className="text-xs font-bold text-amber-600 ml-2">
                    + {pointsReward} 积分
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 font-bold text-xs transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 sm:flex-none px-7 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition cursor-pointer"
                >
                  提交审核
                </button>
              </div>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
