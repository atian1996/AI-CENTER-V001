import React from 'react';
import { TaskItem, TaskSubmissionRecord } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Paperclip, 
  Download, 
  AlertCircle, 
  Award,
  RotateCcw,
  ShieldCheck,
  Lock
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface MySubmissionModalProps {
  task: TaskItem | null;
  submission: TaskSubmissionRecord | null;
  isOpen: boolean;
  onClose: () => void;
  onResubmit?: () => void;
}

export const MySubmissionModal: React.FC<MySubmissionModalProps> = ({
  task,
  submission,
  isOpen,
  onClose,
  onResubmit
}) => {
  const { showToast } = useApp();

  if (!isOpen || !task || !submission) return null;

  const isFinished = task.status === '已结束' || task.status === '已验收';
  const isWinner = task.winner?.username === submission.username || 
    (task.winner?.username && (submission.username.includes(task.winner.username) || task.winner.username.includes(submission.username)));
  const isApproved = submission.status === '已通过' || isWinner;
  const isRejected = submission.status === '已驳回';
  const hasTaskSettledWinner = !!task.winner || task.isAccepted || (task.submissions || []).some(s => s.status === '已通过');
  const isNotSelected = !isApproved && !isRejected && (submission.status === '成果未通过' || ((hasTaskSettledWinner || isFinished) && !task.refunded));
  const isPending = !isApproved && !isRejected && !isNotSelected && submission.status === '待验收';

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
          className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          {/* 弹窗头部 */}
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-slate-900">我的交付成果详情</h3>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-black ${
                      isApproved
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : isRejected
                        ? 'bg-red-100 text-red-700 border border-red-200'
                        : isNotSelected
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : 'bg-amber-100 text-amber-800 border border-amber-200'
                    }`}
                  >
                    {isApproved ? '🏆 验收通过' : isRejected ? '已驳回修改' : isNotSelected ? '成果未通过' : '待雇主验收'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">针对任务：{task.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* 隐私提示条 */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>成果隐私保护：此交付内容仅您本人与雇主 <b>{task.publisher}</b> 在工作台中可见，未在公开大厅展示。</span>
            </div>

            {/* 状态通知横幅 */}
            {isApproved && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-black text-emerald-950">恭喜！您的交付成果已通过雇主验收</div>
                  <div className="text-xs text-emerald-700 mt-0.5">
                    悬赏赏金 ¥{(task.cashReward ?? task.bounty ?? 0).toLocaleString()} 已全额结算至您的账户余额。
                  </div>
                </div>
              </div>
            )}

            {isRejected && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-red-800 text-sm font-black">
                  <AlertCircle className="w-4 h-4 text-red-600" />
                  <span>雇主验收驳回意见</span>
                </div>
                <p className="text-xs text-red-700 font-medium pl-6 leading-relaxed">
                  {submission.rejectReason || '成果未完全达到验收指标要求，请根据需求标准修改后重新提交。'}
                </p>
              </div>
            )}

            {isNotSelected && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                <div>
                  <div className="text-sm font-black text-rose-950">成果未通过</div>
                  <div className="text-xs text-rose-800 leading-relaxed font-medium mt-0.5">
                    发布人已验收通过其他接单人的交付方案，您的交付成果未被选为获胜方案（成果未通过）。
                  </div>
                </div>
              </div>
            )}

            {isPending && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                <div className="text-xs text-amber-800 leading-relaxed font-medium">
                  成果已成功上传，正在等待雇主 <b>{task.publisher}</b> 查验与测试。若通过，赏金将自动结算并发放。
                </div>
              </div>
            )}

            {/* 提交元信息 */}
            <div className="flex items-center justify-between text-xs text-slate-500 px-1">
              <span className="font-bold text-slate-700">提交时间：{submission.submitTime}</span>
              <span className="font-mono text-slate-400">交付记录 ID: {submission.id}</span>
            </div>

            {/* 交付说明与复现指南 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-indigo-600 rounded-full" />
                <span>交付成果说明与复现指南</span>
              </label>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line">
                {submission.notes}
              </div>
            </div>

            {/* 交付文件列表 */}
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-800 flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-emerald-600 rounded-full" />
                <span>交付附件包 ({submission.files?.length || 0})</span>
              </label>

              {(!submission.files || submission.files.length === 0) ? (
                <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-400 text-center">
                  无附件文件
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {submission.files.map(f => (
                    <div
                      key={f.id || f.name}
                      onClick={() => showToast(`正在下载交付附件：${f.name}`)}
                      className="flex items-center justify-between p-3 bg-slate-50 hover:bg-indigo-50/60 border border-slate-200 hover:border-indigo-200 rounded-xl text-xs font-bold text-slate-800 cursor-pointer transition group"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Paperclip className="w-4 h-4 text-indigo-600 shrink-0" />
                        <span className="truncate">{f.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-slate-400 font-mono text-[11px]">({f.size})</span>
                        <Download className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* 底部操作条 */}
          <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs">
            <div className="text-slate-500">
              {isRejected && !isFinished ? (
                <span className="text-red-600 font-bold">您可以修改代码与文档后重新提交</span>
              ) : (
                <span>如对验收有疑问，可在社区联系雇主沟通</span>
              )}
            </div>

            <div className="flex items-center gap-2.5">
              {isRejected && !isFinished && onResubmit && (
                <button
                  onClick={() => {
                    if (onResubmit) onResubmit();
                  }}
                  className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs shadow-xs transition flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>重新提交成果</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 text-xs transition"
              >
                关闭
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
