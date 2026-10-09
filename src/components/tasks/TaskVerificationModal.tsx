import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskSubmissionRecord } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Paperclip, 
  Download, 
  Clock, 
  ShieldCheck,
  AlertCircle,
  Award,
  Check,
  CheckSquare,
  RotateCcw,
  Users
} from 'lucide-react';

interface TaskVerificationModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskVerificationModal: React.FC<TaskVerificationModalProps> = ({ task: initialTask, isOpen, onClose }) => {
  const { tasks, verifyTaskSubmission, rejectAllAndRefund, showToast } = useApp();

  // 实时从全局任务库中获取最新任务实体，确保驳回与退款状态即时同步
  const task = (initialTask ? tasks.find(t => t.id === initialTask.id) : null) || initialTask;

  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingSubId, setRejectingSubId] = useState<string | null>(null);
  const [batchRejectModalOpen, setBatchRejectModalOpen] = useState(false);
  const [batchRejectReason, setBatchRejectReason] = useState('任务已到期截止，提交成果未能达到立项考核标准，全部驳回。');

  const submissions = task?.submissions || [];

  // 判断单份成果是否已被驳回
  const isSubRejected = (sub: TaskSubmissionRecord) => {
    if (sub.status === '已驳回') return true;
    const taker = task?.takers?.find(tk => tk.submissionId === sub.id || tk.username === sub.username);
    if (taker?.status === '已驳回') return true;
    return false;
  };

  const isWon = !!task?.winner || (submissions || []).some(s => s.status === '已通过');
  const isRefunded = !!task?.refunded;
  const isTaskExpired = task ? (
    (task.remainingDays !== undefined && task.remainingDays <= 0) || 
    (task.endTime ? new Date(task.endTime.replace(' ', 'T')).getTime() <= Date.now() : false) || 
    task.status === '已结束'
  ) : false;

  const isFinished = isWon || isRefunded;
  const allRejected = submissions.length > 0 && submissions.every(s => isSubRejected(s));

  // 当弹窗打开或任务切换时，默认只选中第一份未被驳回的待验收成果
  useEffect(() => {
    if (isOpen && submissions.length > 0) {
      const validPendingSub = submissions.find(s => !isSubRejected(s) && s.status === '待验收');
      setSelectedSubId(validPendingSub ? validPendingSub.id : null);
    } else {
      setSelectedSubId(null);
    }
    setRejectingSubId(null);
    setRejectReason('');
    setBatchRejectModalOpen(false);
  }, [isOpen, task?.id]);

  // 严禁已驳回任务成果被选中：如果当前选中的成果被驳回，立即解除选中并寻找下一份有效成果
  useEffect(() => {
    if (selectedSubId) {
      const currentSelected = submissions.find(s => s.id === selectedSubId);
      if (!currentSelected || isSubRejected(currentSelected)) {
        const nextValid = submissions.find(s => s.id !== selectedSubId && !isSubRejected(s) && s.status === '待验收');
        setSelectedSubId(nextValid ? nextValid.id : null);
      }
    }
  }, [submissions, selectedSubId]);

  if (!isOpen || !task) return null;

  const chosenSubObj = submissions.find(s => s.id === selectedSubId && !isSubRejected(s));

  const handleConfirmVerification = () => {
    if (!selectedSubId) {
      showToast('请先在成果列表中选择一位接单人的合格交付成果');
      return;
    }
    const chosenSub = submissions.find(s => s.id === selectedSubId);
    if (!chosenSub) return;

    if (isSubRejected(chosenSub)) {
      showToast('发布人已驳回的任务成果无法选中作为验收成果！请选择其他有效成果');
      return;
    }

    verifyTaskSubmission(task.id, selectedSubId, true);
    showToast(`确认验收成功！已将【${chosenSub.username}】选为唯一获胜成果，赏金全额结算发放，任务正式结束。`);
    onClose();
  };

  const handleOpenReject = (subId: string) => {
    setRejectingSubId(subId);
    setRejectReason('');
  };

  const handleConfirmReject = (subId: string) => {
    const finalReason = rejectReason.trim() || '交付成果未能完全满足任务验收考核指标，发布人已驳回。请修改后重新提交。';
    verifyTaskSubmission(task.id, subId, false, finalReason);
    setRejectingSubId(null);
    setRejectReason('');

    // 如果当前选中的正是被驳回的这项，立即解除选中，并自动寻找下一份有效成果
    if (selectedSubId === subId) {
      const nextValid = submissions.find(s => s.id !== subId && !isSubRejected(s));
      setSelectedSubId(nextValid ? nextValid.id : null);
    }
  };

  const handleConfirmBatchReject = () => {
    if (!batchRejectReason.trim()) {
      showToast('请填写驳回原因');
      return;
    }
    rejectAllAndRefund(task.id, batchRejectReason.trim());
    setBatchRejectModalOpen(false);
    setSelectedSubId(null);
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
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-3xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isRefunded && submissions.length === 0 ? '任务到期退款详情' : '任务成果验收管理'}
                </h3>
                <p className="text-xs text-slate-500">
                  {task.title}（{submissions.length > 0 ? `收件箱共 ${submissions.length} 份成果` : '当前收件箱无交付成果'}）
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {/* 1. 已验收通过提示 */}
            {isWon && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>该任务已由发布者验收通过（获胜开发者：<span className="font-extrabold">{task.winner?.username || '已确定开发者'}</span>），全额赏金已结算发放，任务已正式结束。</span>
              </div>
            )}

            {/* 2. 已退款结束提示 */}
            {isRefunded && (
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <RotateCcw className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-black text-sm text-amber-950">任务金额与积分已全额退回发布人</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900">
                      已全额退款
                    </span>
                  </div>
                  <p className="text-amber-900 text-xs mt-1 leading-relaxed">
                    {task.refundReason || '该任务已到期结束，发布人已将所有交付成果驳回，预付赏金及积分已全部原路退回至发布人账户。'}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-2 text-xs">
                    <span className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg font-bold text-amber-900">
                      退回资金：<span className="font-mono text-indigo-700 font-black">¥{(task.refundCash ?? task.cashReward ?? task.bounty ?? 0).toLocaleString()}</span>
                    </span>
                    <span className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg font-bold text-amber-900">
                      退回积分：<span className="font-mono text-indigo-700 font-black">{task.refundPoints ?? task.pointsReward ?? 0} 积分</span>
                    </span>
                    {task.refundTime && (
                      <span className="text-slate-400 text-[11px]">退还时间：{task.refundTime}</span>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 3. 到期未验收提示 (若到期且未通过且未退款) */}
            {!isWon && !isRefunded && isTaskExpired && (
              <div className="p-4 bg-amber-50/90 border border-amber-300 rounded-2xl text-xs text-amber-950 flex items-start gap-3 shadow-2xs">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="font-black text-sm text-amber-900">任务已到期截止 · 验收与退回规则</h4>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900">
                      到期评审
                    </span>
                  </div>
                  <p className="text-amber-800 text-xs mt-1 leading-relaxed font-medium">
                    当前任务已到达截止时间。若有符合验收标准的方案，可勾选并通过验收；<span className="font-extrabold text-rose-600">若发布人将所有成果都驳回，则任务预付金额 (¥{(task.cashReward ?? task.bounty ?? 0).toLocaleString()}) 和积分 ({task.pointsReward || 0} 积分) 将全部原路退回至您的账户。</span>
                  </p>
                  {submissions.some(s => !isSubRejected(s)) && (
                    <div className="mt-3">
                      <button
                        onClick={() => setBatchRejectModalOpen(true)}
                        className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>到期全部驳回并全额退回赏金与积分</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* 4. 常规进行中规则说明 */}
            {!isFinished && !isTaskExpired && (
              <div className="p-3.5 bg-indigo-50/80 border border-indigo-200/80 rounded-xl text-xs text-indigo-900 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed font-medium">
                  <p className="font-extrabold">验收规则提示：</p>
                  <p>发布人只能选择一位开发者的成果作为验收通过项。已驳回的成果无法选中作为验收成果。选择合格成果后，点击底部<span className="font-black text-indigo-700">“确认验收”</span>按钮完成结算，任务正式结束。</p>
                </div>
              </div>
            )}

            {submissions.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50/70 rounded-2xl border border-dashed border-slate-200">
                <FileText className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
                <p className="text-sm font-bold text-slate-700">
                  {isRefunded 
                    ? ((task.takers || []).length === 0 
                      ? '任务公示周期内无人接单，已到期结束' 
                      : '接单极客在截止时间前未提交交付成果，已到期结束')
                    : '暂无接单人提交交付成果'}
                </p>
                <p className="text-xs mt-1 text-slate-500 max-w-md mx-auto">
                  {isRefunded 
                    ? '任务预付托管赏金与平台积分已全额退还至发布人账户，无需进行成果验收。'
                    : '接单开发者上传成果后将在此处统一展示供您验收'}
                </p>
                {isRefunded && (task.takers || []).length > 0 && (
                  <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-600 shadow-2xs">
                    <Users className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>接单极客：{(task.takers || []).map(tk => tk.username).join('、')}（截止日前未提交成果）</span>
                  </div>
                )}
              </div>
            ) : (
              submissions.map((sub) => {
                const isRejected = isSubRejected(sub);
                const isSelected = selectedSubId === sub.id && !isRejected;
                const isPassed = sub.status === '已通过';
                const isNotPassed = sub.status === '成果未通过' || (isFinished && !isPassed && !isRejected);

                return (
                  <div
                    key={sub.id}
                    onClick={() => {
                      if (isRejected) {
                        showToast('发布人已驳回的任务成果无法选中作为验收成果！');
                        return;
                      }
                      if (!isFinished) {
                        setSelectedSubId(sub.id);
                      }
                    }}
                    className={`p-5 rounded-2xl border transition-all relative ${
                      isFinished
                        ? sub.status === '已通过'
                          ? 'bg-emerald-50/40 border-emerald-300 shadow-2xs'
                          : 'bg-slate-50 border-slate-200 opacity-60'
                        : isRejected
                        ? 'bg-slate-50/90 border-slate-200 cursor-not-allowed opacity-80 select-none'
                        : isSelected
                        ? 'bg-indigo-50/30 border-indigo-600 shadow-md ring-2 ring-indigo-500/20 cursor-pointer'
                        : 'bg-white border-slate-200 hover:border-slate-300 cursor-pointer'
                    }`}
                  >
                    {/* 选中高亮边角标记 */}
                    {!isFinished && isSelected && (
                      <div className="absolute top-0 right-0 bg-indigo-600 text-white text-[11px] font-black px-3 py-1 rounded-bl-xl flex items-center gap-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                        <span>已选为验收目标</span>
                      </div>
                    )}

                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {/* 勾选框 / 驳回禁止选中标记 */}
                        {!isFinished && (
                          isRejected ? (
                            <div 
                              className="w-5 h-5 rounded-full border border-rose-300 bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 cursor-not-allowed" 
                              title="发布人已驳回，无法选中作为验收成果"
                            >
                              <X className="w-3 h-3 stroke-[3]" />
                            </div>
                          ) : (
                            <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition shrink-0 ${
                              isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                            }`}>
                              {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                            </div>
                          )
                        )}

                        <img
                          src={sub.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                          alt={sub.username}
                          className="w-10 h-10 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-sm text-slate-900">{sub.username}</span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                                isPassed
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : isRejected
                                  ? 'bg-rose-100 text-rose-700 border border-rose-200'
                                  : isNotPassed
                                  ? 'bg-slate-100 text-slate-600 border border-slate-200'
                                  : isSelected
                                  ? 'bg-indigo-100 text-indigo-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}
                            >
                              {isPassed ? '🏆 验收通过 (获胜者)' : isRejected ? '发布人已驳回 (无法选中)' : isNotPassed ? '成果未通过' : isSelected ? '待点击“确认验收”' : sub.status}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                            <Clock className="w-3.5 h-3.5" />
                            <span>提交时间：{sub.submitTime}</span>
                          </div>
                        </div>
                      </div>

                      {/* 赏金说明 */}
                      <div className="text-right">
                        <div className="text-xs text-slate-400">应结算赏金</div>
                        <div className="text-sm font-black font-mono text-indigo-600">
                          ¥{(task.cashReward ?? task.bounty ?? 0).toLocaleString()} {(task.pointsReward || 0) > 0 ? `+ ${task.pointsReward} 积分` : ''}
                        </div>
                      </div>
                    </div>

                    {/* 成果说明 */}
                    <div className="mt-3.5 p-3.5 bg-white rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium">
                      <div className="text-slate-400 font-bold mb-1">成果说明 / 交付报告：</div>
                      <p className="whitespace-pre-line">{sub.notes}</p>
                    </div>

                    {/* 交付文件 */}
                    {sub.files && sub.files.length > 0 && (
                      <div className="mt-3 space-y-1.5">
                        <div className="text-xs font-bold text-slate-600">交付附件：</div>
                        <div className="flex flex-wrap gap-2">
                          {sub.files.map((f: any) => (
                            <div
                              key={f.id || f.name}
                              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-xs font-bold text-slate-700 cursor-pointer transition"
                              onClick={(e) => {
                                e.stopPropagation();
                                showToast(`已开始下载交付附件：${f.name}`);
                              }}
                            >
                              <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                              <span>{f.name}</span>
                              <span className="text-slate-400 font-mono text-[10px]">({f.size})</span>
                              <Download className="w-3.5 h-3.5 text-slate-500 ml-1" />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 驳回原因展示 */}
                    {isRejected && sub.rejectReason && (
                      <div className="mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
                        <span className="font-bold">发布人驳回原因：</span>{sub.rejectReason}
                      </div>
                    )}

                    {/* 驳回修改展开输入抽屉 */}
                    {rejectingSubId === sub.id && (
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="mt-3.5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2.5"
                      >
                        <div className="text-xs font-black text-rose-800 flex items-center justify-between">
                          <span className="flex items-center gap-1.5">
                            <AlertCircle className="w-4 h-4 text-rose-600" />
                            <span>填写驳回原因 (必填)</span>
                          </span>
                          {isTaskExpired && (
                            <span className="text-[11px] text-amber-700 font-medium">
                              若到期全部成果驳回，赏金和积分将全额退回
                            </span>
                          )}
                        </div>
                        <textarea
                          rows={2}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="说明未达验收标准的原因，发布人已驳回后该成果将无法选为验收成果..."
                          className="w-full p-2.5 bg-white border border-rose-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-rose-200"
                        />
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setRejectingSubId(null)}
                            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50"
                          >
                            取消
                          </button>
                          <button
                            onClick={() => handleConfirmReject(sub.id)}
                            className="px-3.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold shadow-xs cursor-pointer"
                          >
                            确认驳回
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 已驳回提示条：不可选 */}
                    {!isFinished && isRejected && (
                      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-rose-600 font-medium">
                        <span className="flex items-center gap-1.5">
                          <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span>发布人已驳回该成果 · 无法选中作为验收成果</span>
                        </span>
                        <span className="text-[11px] text-rose-400 font-bold">不可选</span>
                      </div>
                    )}

                    {/* 单项驳回操作 */}
                    {!isFinished && !isRejected && rejectingSubId !== sub.id && (
                      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">
                          {isSelected ? '已选中此项为合格成果' : '点击此卡片可选中作为验收通过项'}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenReject(sub.id);
                          }}
                          className="px-3 py-1 rounded-lg border border-rose-200 bg-white hover:bg-rose-50 text-rose-600 font-bold text-[11px] transition flex items-center gap-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>驳回成果</span>
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* 弹窗底部操作区 */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {!isFinished && submissions.length > 0 ? (
              <>
                <div className="text-xs text-slate-600 font-medium flex items-center gap-1.5">
                  <CheckSquare className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>
                    {chosenSubObj ? (
                      <>拟验收通过：<span className="font-extrabold text-indigo-600">{chosenSubObj.username}</span> 的成果</>
                    ) : allRejected ? (
                      <span className="text-rose-600 font-bold">
                        发布人已驳回所有成果，无法选中作为验收成果。
                        {isTaskExpired && '（已到期结束，任务金额和积分已全额退回发布人）'}
                      </span>
                    ) : (
                      <span className="text-slate-500">请在上方勾选合格成果（发布人已驳回的任务成果无法选中作为验收成果）</span>
                    )}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 font-bold text-slate-700 text-xs transition cursor-pointer"
                  >
                    暂不验收
                  </button>
                  <button
                    onClick={handleConfirmVerification}
                    disabled={!selectedSubId || !chosenSubObj || isSubRejected(chosenSubObj) || allRejected}
                    className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>确认验收</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {isRefunded ? '任务已到期全部驳回，赏金积分已全额退还发布人' : '验收完成或无待验收提交项'}
                </span>
                <button
                  onClick={onClose}
                  className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 text-xs transition cursor-pointer"
                >
                  关闭窗口
                </button>
              </div>
            )}
          </div>
        </motion.div>

        {/* 批量全部驳回并退款确认弹窗 */}
        {batchRejectModalOpen && (
          <div className="fixed inset-0 z-60 overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-slate-200 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center">
                  <RotateCcw className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-base text-slate-900">到期全部驳回并全额退款</h4>
                  <p className="text-xs text-slate-400">任务已到期，发布人驳回所有提交成果</p>
                </div>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                确定将当前任务的所有交付成果全部驳回吗？确认后，任务将正式结束，托管赏金 <span className="font-mono font-black text-rose-600">¥{(task.cashReward ?? task.bounty ?? 0).toLocaleString()}</span> 及 <span className="font-mono font-black text-rose-600">{task.pointsReward || 0} 积分</span> 将全部原路退回至您的账户。
              </p>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">驳回说明：</label>
                <textarea
                  rows={3}
                  value={batchRejectReason}
                  onChange={(e) => setBatchRejectReason(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-200"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setBatchRejectModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-600"
                >
                  取消
                </button>
                <button
                  onClick={handleConfirmBatchReject}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-md cursor-pointer"
                >
                  确认驳回并退款
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AnimatePresence>
  );
};
