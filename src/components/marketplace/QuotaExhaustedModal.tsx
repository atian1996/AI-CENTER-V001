import React from 'react';
import { AgentItem } from '../../types';
import { X, Lightbulb, Zap, ArrowRight, ShieldCheck, Coins } from 'lucide-react';

interface QuotaExhaustedModalProps {
  agent: AgentItem;
  isOpen: boolean;
  onClose: () => void;
  onSelectPayPerToken: () => void;
  onSelectSubscribe: () => void;
}

export const QuotaExhaustedModal: React.FC<QuotaExhaustedModalProps> = ({
  agent,
  isOpen,
  onClose,
  onSelectPayPerToken,
  onSelectSubscribe
}) => {
  if (!isOpen) return null;

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[120] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/65 backdrop-blur-xs animate-fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden my-auto cursor-default"
      >
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white relative">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Lightbulb className="w-5 h-5 text-amber-100" />
            </div>
            <div>
              <h3 className="text-base font-black tracking-tight">
                💡 今日免费额度已用完
              </h3>
              <p className="text-[11px] text-amber-100 font-medium mt-0.5">
                【{agent.name}】免费试用次数已耗尽
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed font-medium">
            每日免费试用体验次数已达上限（30次/天）。为保障对话连贯与业务使用，请选择适合您的继续体验方式：
          </p>

          <div className="grid grid-cols-1 gap-3 pt-1">
            
            {/* Option 1: 按Token继续使用 */}
            <div
              onClick={onSelectPayPerToken}
              className="group p-4 rounded-2xl border-2 border-slate-200 hover:border-amber-500 bg-slate-50 hover:bg-amber-50/40 transition-all cursor-pointer flex items-center justify-between"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-slate-900 group-hover:text-amber-700">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>按 Token 继续使用</span>
                </div>
                <p className="text-[11px] text-slate-500 font-medium">
                  标准价 ¥0.50/万 Token，用多少从账户余额实时扣多少
                </p>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-200 group-hover:bg-amber-500 text-slate-700 group-hover:text-white text-xs font-bold transition shrink-0 flex items-center gap-1">
                <span>按Token</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Option 2: 立即订阅套餐 */}
            <div
              onClick={onSelectSubscribe}
              className="group p-4 rounded-2xl border-2 border-indigo-500/80 bg-indigo-50/60 hover:bg-indigo-50 hover:border-indigo-600 transition-all cursor-pointer flex items-center justify-between shadow-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs font-black text-indigo-900">
                  <Zap className="w-4 h-4 text-indigo-600 fill-indigo-100" />
                  <span>立即订阅套餐（更划算）</span>
                  <span className="bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-md">
                    ¥49/周起
                  </span>
                </div>
                <p className="text-[11px] text-indigo-700 font-medium">
                  享受专属 Token 额度包，单价低至 ¥1.43/万 Token，更省钱
                </p>
              </div>

              <div className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shrink-0 shadow-xs flex items-center gap-1">
                <span>立即订阅</span>
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-100 text-center">
          <span className="text-[11px] text-slate-400 font-medium">
            每日零点自动刷新 30 次免费试用额度
          </span>
        </div>

      </div>
    </div>
  );
};
