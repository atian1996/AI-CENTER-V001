import React, { useState } from 'react';
import {
  CreditCard,
  X,
  Receipt,
  Building2,
  CheckCircle2,
  FileCheck
} from 'lucide-react';
import { ComputeSettlementItem } from '../../../../types';

interface SettlementPaymentModalProps {
  settlement: ComputeSettlementItem;
  onClose: () => void;
  onConfirmPaid: (
    settlementId: string,
    invoiceNo: string,
    paymentVoucher: string,
    paymentMethod: string,
    remark: string
  ) => void;
}

export const SettlementPaymentModal: React.FC<SettlementPaymentModalProps> = ({
  settlement,
  onClose,
  onConfirmPaid
}) => {
  const [invoiceNo, setInvoiceNo] = useState(`FP-${new Date().getFullYear()}${String(Date.now()).slice(-6)}`);
  const [paymentVoucher, setPaymentVoucher] = useState(`VOUCHER-${String(Date.now()).slice(-8)}`);
  const [paymentMethod, setPaymentMethod] = useState('企业对公银行电汇');
  const [remark, setRemark] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!invoiceNo.trim()) {
      return;
    }
    onConfirmPaid(
      settlement.id,
      invoiceNo.trim(),
      paymentVoucher.trim(),
      paymentMethod,
      remark.trim()
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">确认结算打款与发票凭证归档</h3>
              <p className="text-xs text-slate-400 mt-0.5 font-mono">
                {settlement.statementNo || settlement.id} · {settlement.operator}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 text-xs">
          {/* 金额确认卡片 */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between">
            <div>
              <span className="text-slate-400 block text-[11px] mb-1">本次应结算给运营商金额</span>
              <div className="text-xl font-bold font-mono text-emerald-400">
                ¥{settlement.payableAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </div>
            </div>
            <div className="text-right text-[11px] font-mono text-slate-400">
              <div>消耗卡时: {settlement.totalCardHours} hrs</div>
              <div>账期: {settlement.period}</div>
            </div>
          </div>

          {/* 发票凭证号 */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              运营商发票凭证号 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={invoiceNo}
              onChange={e => setInvoiceNo(e.target.value)}
              placeholder="如: FP-20260819-0091"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* 打款银行流水号 */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              对公付款流水号 / 银行凭证号 <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              required
              value={paymentVoucher}
              onChange={e => setPaymentVoucher(e.target.value)}
              placeholder="如: VOUCHER-99381204 / BK-20260819-9182"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          {/* 结算支付方式 */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              结算支付渠道
            </label>
            <select
              value={paymentMethod}
              onChange={e => setPaymentMethod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="企业对公银行电汇">企业对公银行电汇 (中国工商银行/招商银行)</option>
              <option value="银企直连自动批量代付">银企直连自动批量代付</option>
              <option value="专有预付资金池对冲抵扣">专有预付资金池对冲抵扣</option>
            </select>
          </div>

          {/* 备注 */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">
              财务结算备注 (选填)
            </label>
            <input
              type="text"
              value={remark}
              onChange={e => setRemark(e.target.value)}
              placeholder="如: 已核对8月算力卡时与专线网络抵扣，付款无异议"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <div className="p-3 bg-slate-950/40 border border-slate-800 rounded-lg text-slate-400 text-[11px]">
            💡 确认后，对账单状态将更新为<b>【已结算】</b>，发票与打款流水将写入审计日志并永久归档。
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold shadow-md shadow-emerald-500/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <FileCheck className="w-4 h-4" />
              <span>确认打款并完成结算</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
