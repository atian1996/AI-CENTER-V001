import React, { useState } from 'react';
import { ComputeOrderItem } from '../../../../types';
import { X, DollarSign, AlertCircle, CheckCircle2 } from 'lucide-react';

interface OrderRefundModalProps {
  order: ComputeOrderItem | null;
  onClose: () => void;
  onConfirmRefund: (orderId: string, amount: number, reason: string) => void;
}

export const OrderRefundModal: React.FC<OrderRefundModalProps> = ({
  order,
  onClose,
  onConfirmRefund
}) => {
  if (!order) return null;

  const maxRefundable = Math.max(0, (order.orderAmount ?? order.totalCost ?? 0) - (order.refundAmount ?? 0));
  const [amount, setAmount] = useState<string>(maxRefundable.toFixed(2));
  const [reason, setReason] = useState<string>('服务中断补偿 / 调度硬件异常核算退费');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      alert('请输入有效的退款金额');
      return;
    }
    if (numAmount > maxRefundable) {
      alert(`退款金额不能超过最大可退金额 ¥${maxRefundable.toFixed(2)}`);
      return;
    }
    onConfirmRefund(order.id, numAmount, reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 animate-in fade-in zoom-in-95 duration-200 my-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">发起财务退款核算</h3>
              <p className="text-xs text-slate-400">订单号: <span className="font-mono text-indigo-300">{order.orderNo || order.id}</span></p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 订单财务摘要 */}
        <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl grid grid-cols-3 gap-2 text-xs">
          <div>
            <span className="text-slate-400">订单总金额</span>
            <div className="font-bold text-slate-200 mt-0.5">¥{(order.orderAmount ?? order.totalCost ?? 0).toFixed(2)}</div>
          </div>
          <div>
            <span className="text-slate-400">已退款金额</span>
            <div className="font-bold text-rose-400 mt-0.5">¥{(order.refundAmount ?? 0).toFixed(2)}</div>
          </div>
          <div>
            <span className="text-slate-400">最大可退</span>
            <div className="font-bold text-emerald-400 mt-0.5">¥{maxRefundable.toFixed(2)}</div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              本次退款金额 (¥) <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-bold">¥</span>
              <input
                type="number"
                step="0.01"
                min="0.01"
                max={maxRefundable}
                value={amount}
                onChange={e => setAmount(e.target.value)}
                required
                className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-mono text-sm focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
            <div className="flex gap-2 mt-2">
              <button
                type="button"
                onClick={() => setAmount((maxRefundable * 0.5).toFixed(2))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px]"
              >
                退 50%
              </button>
              <button
                type="button"
                onClick={() => setAmount(maxRefundable.toFixed(2))}
                className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-[11px]"
              >
                全额退款 (100%)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1.5">
              退款审核原因说明 <span className="text-rose-400">*</span>
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="请输入清晰的财务退款理由（如硬件节点故障、调度超时未履约等）..."
              required
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-rose-500 transition-colors resize-none"
            />
          </div>

          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[11px] text-amber-300 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>退款确认后将立即原路退回用户账户余额或预付款流水，并自动在财务对账与生命周期中留下不可篡改的审计记录。</span>
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
              className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-rose-600/30 transition-all"
            >
              确认退款
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
