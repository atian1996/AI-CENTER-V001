import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  ArrowLeft,
  Clock,
  CheckCircle2,
  Paperclip,
  Download,
  AlertCircle,
  ShieldCheck,
  Award,
  RotateCcw,
  XCircle
} from 'lucide-react';
import { SubmitResultModal } from './SubmitResultModal';
import { TaskVerificationModal } from './TaskVerificationModal';

interface TaskDetailModalProps {
  taskId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenVerification?: (task: TaskItem) => void;
  readOnly?: boolean;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, isOpen, onClose, readOnly }) => {
  const { tasks, user, takeTask, showToast, isAdminMode } = useApp();

  const isReadOnly = readOnly !== undefined ? readOnly : isAdminMode;

  // TAB 切换: 任务介绍 | 接单列表
  const [activeTab, setActiveTab] = useState<'intro' | 'takers'>('intro');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);

  if (!isOpen || !taskId) return null;

  const task = tasks.find(t => t.id === taskId);
  if (!task) return null;

  const isPublisher = !isReadOnly && (task.publisher === user.name || user.name.includes(task.publisher) || (user.name === '极客小千' && task.publisher.includes('你')));
  
  // 判定是否为已结束状态：已验收 / 已结束 / 剩余天数<=0 / 已有 winner
  const isFinished = 
    task.status === '已结束' || 
    task.status === '已验收' || 
    (task.remainingDays !== undefined && task.remainingDays <= 0) ||
    task.isAccepted === true ||
    !!task.winner;

  const myTakerRecord = !isReadOnly ? (task.takers || []).find(tk => tk.username === user.name || tk.username.includes('你') || tk.username.includes('极客小千')) : undefined;
  const hasTaken = !isReadOnly && !!myTakerRecord;
  const mySubmission = !isReadOnly ? (task.submissions || []).find(s => s.username === user.name || s.username.includes('你') || s.username.includes('极客小千')) : undefined;
  const isRejected = !isFinished && (mySubmission?.status === '已驳回' || myTakerRecord?.status === '已驳回');
  const hasSubmitted = !isReadOnly && (mySubmission?.status === '待验收' || mySubmission?.status === '已通过' || myTakerRecord?.status === '已提交' || myTakerRecord?.status === '已验收');

  const takersList = task.takers || [];
  const submissionsList = task.submissions || [];

  const handleTake = () => {
    takeTask(task.id);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4">
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
          exit={{ opacity: 0, scale: 1, y: 0 }}
          className="relative w-full max-w-4xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          {/* 顶部信息区 */}
          <div className="px-7 py-5 border-b border-slate-100 bg-slate-50/90 shrink-0">
            {/* 返回按钮与顶栏 */}
            <div className="flex items-center justify-between mb-3">
              <button
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-200/60 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回任务列表</span>
              </button>

              <button
                onClick={onClose}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 中间：任务标题 */}
            <div className="flex items-start justify-between gap-4">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {task.title}
              </h2>
            </div>

            {/* 标题下方属性横栏 */}
            <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
              <span className="px-2.5 py-0.5 rounded-md font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/50">
                {task.domain}
              </span>
              <span
                className={`px-2.5 py-0.5 rounded-md font-bold ${
                  task.difficulty === '简单'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50'
                    : task.difficulty === '中等'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/50'
                    : 'bg-purple-50 text-purple-700 border border-purple-200/50'
                }`}
              >
                {task.difficulty}难度
              </span>

              {task.refunded ? (
                <span className="px-2.5 py-0.5 rounded-md font-black bg-amber-100 text-amber-900 border border-amber-300">
                  已退款结束
                </span>
              ) : isFinished ? (
                <span className="px-2.5 py-0.5 rounded-md font-bold bg-slate-200 text-slate-600">
                  已结束
                </span>
              ) : (
                <span className="px-2.5 py-0.5 rounded-md font-bold bg-emerald-500 text-white">
                  进行中
                </span>
              )}

              <span className="text-slate-400">·</span>
              <span className="text-slate-600 font-medium">
                {isFinished ? '已到期' : `剩余 ${task.remainingDays || 14} 天`}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-700 font-bold">发布人：{task.publisher}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400">发布时间：{task.publishTime}</span>
            </div>

            {/* TAB 切换区：仅任务介绍 | 接单列表 */}
            <div className="flex items-center gap-8 mt-5 border-b border-slate-200">
              {[
                { key: 'intro', label: '任务介绍' },
                { key: 'takers', label: `接单列表 (${takersList.length})` }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`pb-3 text-xs font-extrabold transition-all relative cursor-pointer ${
                    activeTab === tab.key
                      ? 'text-indigo-600'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab.label}
                  {activeTab === tab.key && (
                    <motion.div
                      layoutId="taskTabUnderline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* TAB 内容区 */}
          <div className="flex-1 overflow-y-auto p-7 space-y-6">
            {/* 1. 任务介绍 TAB */}
            {activeTab === 'intro' && (
              <div className="space-y-6">
                {/* 任务描述 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600" />
                    <span>任务描述</span>
                  </h4>
                  <div
                    className="p-5 bg-white border border-slate-200 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: task.description }}
                  />
                </div>

                {/* 验收标准 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-600" />
                    <span>验收标准</span>
                  </h4>
                  <div
                    className="p-5 bg-emerald-50/40 border border-emerald-200 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line"
                    dangerouslySetInnerHTML={{ __html: task.acceptanceCriteria }}
                  />
                </div>

                {/* 奖励信息 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <span>奖励信息</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-xs">
                    <div>
                      <div className="text-slate-400 font-bold mb-1">现金奖励</div>
                      <div className="text-lg font-black font-mono text-indigo-600">
                        ¥{(task.cashReward || 0).toLocaleString()} 元
                      </div>
                    </div>
                    <div>
                      <div className="text-slate-400 font-bold mb-1">积分奖励</div>
                      <div className="text-lg font-black font-mono text-amber-600">
                        {task.pointsReward || 0} 个积分
                      </div>
                    </div>
                  </div>
                </div>

                {/* 交付周期 */}
                <div className="space-y-2">
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>交付截止时间</span>
                  </h4>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-4 font-medium text-slate-700">
                    <div>发布时间：<span className="font-bold font-mono">{task.publishTime || task.startTime}</span></div>
                    <div>截止时间：<span className="font-bold font-mono text-indigo-600">{task.endTime}</span></div>
                  </div>
                </div>
              </div>
            )}

            {/* 2. 接单列表 TAB */}
            {activeTab === 'takers' && (
              <div className="space-y-4">
                {takersList.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs font-bold space-y-2">
                    <AlertCircle className="w-8 h-8 mx-auto text-slate-300" />
                    <p>暂无开发者接单</p>
                  </div>
                ) : (
                  takersList.map(tk => {
                    const sub = submissionsList.find(s => s.username === tk.username || s.id === tk.submissionId);
                    const isMyRecord = tk.username === user.name || tk.username.includes(user.name) || (user.name === '极客小千' && tk.username.includes('你'));

                    // 精确判读五大接单记录状态：未提交成果 | 待验收 | 通过验收 | 已驳回 | 成果未通过
                    const isAcceptedWinner = 
                      sub?.status === '已通过' || 
                      tk.status === '已验收' || 
                      task.winner?.username === tk.username ||
                      (task.winner?.username && (tk.username.includes(task.winner.username) || task.winner.username.includes(tk.username)));

                    const isRejected = sub?.status === '已驳回' || tk.status === '已驳回';
                    const hasTaskSettledWinner = !!task.winner || task.isAccepted || (task.submissions || []).some(s => s.status === '已通过');
                    const isTaskEnded = task.status === '已结束' || task.status === '已验收';
                    const isSubmissionUnsuccessful = !isAcceptedWinner && !isRejected && (sub?.status === '成果未通过' || tk.status === '成果未通过' || ((hasTaskSettledWinner || isTaskEnded) && !!sub));
                    const isPending = sub && (sub.status === '待验收' || tk.status === '已提交') && !isAcceptedWinner && !isRejected && !isSubmissionUnsuccessful;
                    const isNotSubmitted = !sub && tk.status !== '已提交' && tk.status !== '已验收' && tk.status !== '成果未通过';

                    return (
                      <div
                        key={tk.id}
                        className={`p-5 rounded-2xl border transition-all space-y-3 ${
                          isAcceptedWinner
                            ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                            : isRejected
                            ? 'bg-red-50/40 border-red-200'
                            : isSubmissionUnsuccessful
                            ? 'bg-slate-50/70 border-slate-200'
                            : isPending
                            ? 'bg-amber-50/40 border-amber-200'
                            : 'bg-white border-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3">
                            <img
                              src={tk.userAvatar}
                              alt={tk.username}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                                <span>{tk.username}</span>
                                {isMyRecord && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200">
                                    我的记录
                                  </span>
                                )}
                                {isAcceptedWinner && (
                                  <span className="px-2 py-0.5 rounded text-[11px] font-black bg-emerald-600 text-white flex items-center gap-1">
                                    <Award className="w-3 h-3" />
                                    <span>获胜承接方案</span>
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-400 mt-0.5">
                                接单时间：{tk.takeTime}
                                {sub?.submitTime && (
                                  <span className="ml-3 text-indigo-600 font-medium">
                                    · 交付时间：{sub.submitTime}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>

                          {/* 右侧状态标准展示：未提交成果 | 待验收 | 通过验收 | 已驳回 | 成果未通过 */}
                          <div>
                            {isAcceptedWinner ? (
                              <span className="px-3 py-1.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>通过验收</span>
                              </span>
                            ) : (isRejected || isSubmissionUnsuccessful) ? (
                              <span className="px-3 py-1.5 bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 flex items-center gap-1">
                                <XCircle className="w-3.5 h-3.5 text-red-600" />
                                <span>已驳回</span>
                              </span>
                            ) : isPending ? (
                              <span className="px-3 py-1.5 bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                <span>待验收</span>
                              </span>
                            ) : (
                              <span className="px-3 py-1.5 bg-slate-100 text-slate-500 font-bold text-xs rounded-xl border border-slate-200/80">
                                未提交成果
                              </span>
                            )}
                          </div>
                        </div>

                        {/* 交付成果与关联文件区（如果是本人记录、发布者或管理员，可直接查看与下载） */}
                        {(isMyRecord || isPublisher || isAdminMode || isReadOnly) ? (
                          <div className="mt-3 pt-3 border-t border-slate-100 space-y-2">
                            {sub ? (
                              <>
                                <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                                  <span>交付成果说明与提交文件：</span>
                                  {isMyRecord && !isReadOnly && (
                                    <span className="text-indigo-600 font-semibold">您可以查看并预览自己提交的文件</span>
                                  )}
                                </div>
                                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-700 leading-relaxed font-medium">
                                  {sub.notes}
                                </div>

                                {/* 上传的文件列表 */}
                                {sub.files && sub.files.length > 0 ? (
                                  <div className="space-y-1.5 pt-1">
                                    <div className="text-[11px] font-bold text-slate-400">已提交文件：</div>
                                    <div className="flex flex-wrap gap-2">
                                      {sub.files.map(f => (
                                        <button
                                          type="button"
                                          key={f.id || f.name}
                                          onClick={() => showToast(`正在为您下载文件【${f.name}】`)}
                                          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-800 rounded-xl cursor-pointer transition shadow-2xs"
                                        >
                                          <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                                          <span>{f.name}</span>
                                          <span className="text-slate-400 text-[11px]">({f.size})</span>
                                          <Download className="w-3.5 h-3.5 text-indigo-500 ml-1" />
                                        </button>
                                      ))}
                                    </div>
                                  </div>
                                ) : (
                                  <div className="text-[11px] text-slate-400 font-medium">暂无附带交付文件</div>
                                )}
                              </>
                            ) : (
                              <div className="p-3 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs text-amber-800 flex items-center justify-between">
                                <span>当前接单状态为 <b>未提交</b>{isReadOnly ? '。' : '，请在截止日前提交交付成果。'}</span>
                                {isMyRecord && !isReadOnly && (
                                  <button
                                    onClick={() => setSubmitModalOpen(true)}
                                    className="px-3 py-1 bg-indigo-600 text-white font-extrabold text-[11px] rounded-lg hover:bg-indigo-500 cursor-pointer"
                                  >
                                    立即提交成果
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic">
                            受极客隐私规则保护，非本人或雇主不可查看其他开发者的交付文件。
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            )}
          </div>

          {/* 底部固定操作区 */}
          <div className="px-7 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-500 font-medium">
              {isReadOnly ? (
                <span className="text-slate-600 font-bold">
                  后台任务监控查看模式 · 状态：{task.status} · 共 {takersList.length} 位接单人 · {submissionsList.length} 份交付成果
                </span>
              ) : isFinished ? (
                <span className="text-slate-400 font-bold">任务已结束</span>
              ) : isPublisher ? (
                <span className="text-indigo-600 font-bold">我是发布人 · 共 {takersList.length} 人接单</span>
              ) : hasTaken ? (
                <span className="text-emerald-600 font-bold">您已承接该任务</span>
              ) : (
                <span className="text-slate-500 font-medium">等待接单响应中</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {isReadOnly ? (
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  关闭
                </button>
              ) : (
                <>
                  {/* 发布人视角 */}
                  {isPublisher && (submissionsList.length > 0 || task.refunded) && (
                    <button
                      onClick={() => setVerifyModalOpen(true)}
                      className={`px-6 py-2 text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5 ${
                        task.refunded
                          ? 'bg-amber-500 hover:bg-amber-600'
                          : task.winner
                          ? 'bg-emerald-600 hover:bg-emerald-500'
                          : 'bg-indigo-600 hover:bg-indigo-500'
                      }`}
                    >
                      {task.refunded ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          <span>{submissionsList.length > 0 ? '查看驳回与退款详情' : '查看退款详情'}</span>
                        </>
                      ) : task.winner ? (
                        <>
                          <Award className="w-4 h-4" />
                          <span>查看验收结果</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>去验收成果 ({submissionsList.length})</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* 开发者视角：进行中且未接单 -> 立即接单 */}
                  {!isPublisher && !isFinished && !hasTaken && (
                    <button
                      onClick={handleTake}
                      className="px-6 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      立即接单
                    </button>
                  )}

                  {/* 开发者视角：被驳回且进行中 -> 修改并重新提交 */}
                  {!isPublisher && !isFinished && hasTaken && isRejected && (
                    <button
                      onClick={() => setSubmitModalOpen(true)}
                      className="px-6 py-2 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>修改成果重新提交</span>
                    </button>
                  )}

                  {/* 开发者视角：已接单且未提交成果且未被驳回 -> 提交成果 */}
                  {!isPublisher && !isFinished && hasTaken && !hasSubmitted && !isRejected && (
                    <button
                      onClick={() => setSubmitModalOpen(true)}
                      className="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
                    >
                      提交交付成果
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* 子弹窗挂载 */}
          <SubmitResultModal
            task={task}
            isOpen={submitModalOpen}
            onClose={() => setSubmitModalOpen(false)}
            existingSubmission={isRejected ? mySubmission : undefined}
          />

          <TaskVerificationModal
            task={task}
            isOpen={verifyModalOpen}
            onClose={() => setVerifyModalOpen(false)}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
