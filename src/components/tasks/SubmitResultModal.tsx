import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskSubmissionRecord } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import { X, UploadCloud, FileText, CheckCircle2, Paperclip, Trash2, RotateCcw, AlertCircle } from 'lucide-react';

interface SubmitResultModalProps {
  task: TaskItem | null;
  isOpen: boolean;
  onClose: () => void;
  existingSubmission?: TaskSubmissionRecord | null;
}

export const SubmitResultModal: React.FC<SubmitResultModalProps> = ({
  task,
  isOpen,
  onClose,
  existingSubmission
}) => {
  const { submitTaskResult, showToast } = useApp();

  const [notes, setNotes] = useState('');
  const [files, setFiles] = useState<{ id: string; name: string; size: string }[]>([
    { id: 'f_1', name: '模型微调源码与测试脚本.zip', size: '15.4 MB' }
  ]);
  const [uploading, setUploading] = useState(false);

  const isResubmit = !!existingSubmission;

  useEffect(() => {
    if (isOpen) {
      if (existingSubmission) {
        setNotes(existingSubmission.notes || '');
        setFiles(
          existingSubmission.files && existingSubmission.files.length > 0
            ? existingSubmission.files
            : [{ id: 'f_1', name: '修改后的成果与测试脚本.zip', size: '16.8 MB' }]
        );
      } else {
        setNotes('');
        setFiles([{ id: 'f_1', name: '模型微调源码与测试脚本.zip', size: '15.4 MB' }]);
      }
    }
  }, [isOpen, existingSubmission]);

  if (!isOpen || !task) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fls = e.target.files;
    if (!fls || fls.length === 0) return;
    setUploading(true);
    setTimeout(() => {
      const file = fls[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      setFiles(prev => [
        ...prev,
        { id: `f_${Date.now()}`, name: file.name, size: `${sizeMB} MB` }
      ]);
      setUploading(false);
      showToast(`交付附件【${file.name}】已添加`);
    }, 400);
  };

  const handleRemoveFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) {
      showToast('请填写交付成果说明或运行指南');
      return;
    }
    if (files.length === 0) {
      showToast('请至少上传一份交付文件或源码包');
      return;
    }

    submitTaskResult(task.id, notes.trim(), files);
    onClose();
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
          className="relative w-full max-w-2xl max-h-[88vh] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 my-auto text-slate-800"
        >
          <div className="flex items-center justify-between px-6 py-4.5 border-b border-slate-100 bg-slate-50/80 shrink-0">
            <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center font-black ${
                isResubmit ? 'bg-rose-100 text-rose-600' : 'bg-emerald-600/10 text-emerald-600'
              }`}>
                {isResubmit ? <RotateCcw className="w-5 h-5" /> : <UploadCloud className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {isResubmit ? '修改成果重新提交' : '提交任务成果'}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-1">针对任务：{task.title}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
            {/* 驳回意见提示条 */}
            {isResubmit && existingSubmission?.rejectReason && (
              <div className="p-4 bg-rose-50 border border-rose-200 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-rose-800 text-xs font-black">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>雇主验收驳回意见：</span>
                </div>
                <p className="text-xs text-rose-700 leading-relaxed font-medium pl-6">
                  {existingSubmission.rejectReason}
                </p>
                <div className="text-[11px] text-rose-500 font-semibold pl-6 pt-1">
                  💡 您可在下方修改成果说明并重新上传附件，重新提交后将重置为【待验收】状态重新进入雇主验收。
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-black text-slate-800 mb-1.5 block">
                <span className="text-red-500">*</span> 交付成果说明与复现指南
              </label>
              <textarea
                rows={4}
                required
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="详细说明交付的代码结构、依赖安装方式、针对驳回意见的修改点及演示说明..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 leading-relaxed outline-none focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition"
              />
            </div>

            <div>
              <label className="text-xs font-black text-slate-800 mb-1.5 block">
                <span className="text-red-500">*</span> 交付文件清单 (支持源码压缩包、文档、演示视频)
              </label>
              <div className="space-y-2">
                {files.map(f => (
                  <div key={f.id} className="flex items-center justify-between px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs">
                    <div className="flex items-center gap-2">
                      <Paperclip className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="font-bold text-slate-800">{f.name}</span>
                      <span className="text-slate-400 font-mono">({f.size})</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveFile(f.id)}
                      className="text-slate-400 hover:text-red-600 p-1 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <label className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50 hover:bg-slate-50 hover:border-emerald-300 text-xs font-bold text-slate-600 cursor-pointer transition">
                  <UploadCloud className="w-4 h-4 text-emerald-600" />
                  <span>{uploading ? '上传中...' : '点击上传修改后的成果附件 (.zip, .pdf, .tar.gz)'}</span>
                  <input type="file" onChange={handleFileUpload} className="hidden" disabled={uploading} />
                </label>
              </div>
            </div>

            <div className={`p-3 border rounded-xl text-xs font-medium ${
              isResubmit
                ? 'bg-amber-50/70 border-amber-200 text-amber-800'
                : 'bg-emerald-50/60 border-emerald-200 text-emerald-800'
            }`}>
              {isResubmit
                ? '💡 重新提交成果后，交付记录将更新为【待验收】，发布人将能够再次查验并选为验收成果。'
                : '💡 提交成果后，任务状态将变更为【待验收】，发布者将在 7 个工作日内完成验收。验收通过后赏金将立即结算至您的账户。'}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold text-xs hover:bg-slate-50 transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="submit"
                className={`px-6 py-2 rounded-xl text-white font-extrabold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer ${
                  isResubmit
                    ? 'bg-rose-600 hover:bg-rose-700'
                    : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {isResubmit ? <RotateCcw className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                <span>{isResubmit ? '确认修改并重新提交' : '确认提交验收'}</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
