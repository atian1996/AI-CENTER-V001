import React, { useState } from 'react';
import { ComputeOrderItem } from '../../../../types';
import { X, Coins, ArrowRight, AlertCircle } from 'lucide-react';

interface OrderBillingChangeModalProps {
  order: ComputeOrderItem | null;
  onClose: () => void;
  onConfirmChange: (orderId: string, newBillingType: string, reason: string) => void;
}

export const OrderBillingChangeModal: React.FC<OrderBillingChangeModalProps> = ({
  order,
  onClose,
  onConfirmChange
}) => {
  if (!order) return null;

  const currentBilling = order.billingType;
  const billingOptions = ['按量计费', '包日', '包周', '包月'].filter(b => b !== currentBilling);
  
  const [selectedBilling, setSelectedBilling] = useState<string>(billingOptions[0] || '包月');
  const [reason, setReason] = useState<string>('根据客户长期租用协议变更为优惠周期计费');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmChange(order.id, selectedBilling, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">变更订单计费模式</h3>
              <p className="text-xs text-slate-400">订单号: <span className="font-mono text-indigo-300">{order.orderNo || order.id}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 模式切换对比 */}
        <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
          <div className="text-center flex-1">
            <div className="text-[11px] text-slate-400">当前计费方式</div>
            <div className="mt-1 px-3 py-1 bg-slate-800 text-slate-200 font-bold rounded-lg text-xs inline-block">
              {currentBilling}
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-400 shrink-0 mx-2" />
          <div className="text-center flex-1">
            <div className="text-[11px] text-slate-400">调整为新计费方式</div>
            <div className="mt-1 px-3 py-1 bg-indigo-500/20 text-indigo-300 font-bold rounded-lg text-xs inline-block">
              {selectedBilling}
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-2">选择目标计费模式</label>
            <div className="grid grid-cols-3 gap-2">
              {billingOptions.map(option => (
                <button
                  type="button"
                  key={option}
                  onClick={() => setSelectedBilling(option)}
                  className={`p-3 rounded-xl border text-center transition-all ${
                    selectedBilling === option
                      ? 'border-indigo-500 bg-indigo-500/10 text-white font-bold shadow-sm'
                      : 'border-slate-800 bg-slate-950/40 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div>{option}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              计费变更依据与原因 <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="请输入计费模式调整理由（如客户续签企业包月合约、促销政策调整等）..."
              required
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
            />
          </div>

          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-[11px] text-indigo-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>变更计费模式后，系统将从即刻起应用新的周期扣费算法，原有的按量预扣款与周期账单将在对账单中自动调账。</span>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/30 transition-all"
            >
              确认变更
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
