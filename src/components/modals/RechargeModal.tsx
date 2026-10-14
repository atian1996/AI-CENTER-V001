import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  CreditCard, 
  ShieldCheck, 
  Zap
} from 'lucide-react';

interface RechargeModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultAmount?: number;
}

export const RechargeModal: React.FC<RechargeModalProps> = () => {
  const { 
    rechargeModalOpen, 
    setRechargeModalOpen, 
    user, 
    setUser, 
    showToast 
  } = useApp();

  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [isProcessingPay, setIsProcessingPay] = useState<boolean>(false);

  if (!rechargeModalOpen) return null;

  const currentBalance = user?.balance ?? 25800.00;
  const presetAmounts = [30, 50, 100, 200, 500, 1000];

  const handleClose = () => {
    setRechargeModalOpen(false);
    setCustomAmount('');
    setIsProcessingPay(false);
  };

  const handleConfirmRecharge = () => {
    const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
    if (isNaN(finalAmount) || finalAmount <= 0) {
      showToast('请输入有效的充值金额');
      return;
    }

    setIsProcessingPay(true);

    setTimeout(() => {
      const prevBal = currentBalance;
      const newBal = prevBal + finalAmount;

      setUser(prev => ({
        ...prev,
        balance: newBal
      }));

      setIsProcessingPay(false);
      setRechargeModalOpen(false);
      setCustomAmount('');
      showToast(`充值成功！已成功向账户充值 ¥${finalAmount.toFixed(2)} 元`);
    }, 500);
  };

  const rawAmount = customAmount ? parseFloat(customAmount) : selectedAmount;
  const displayAmount = isNaN(rawAmount) || rawAmount <= 0 ? 0 : rawAmount;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-[120] flex items-center justify-center p-4 overflow-y-auto animate-fade-in select-none">
      <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-6 animate-scale-up relative my-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900">账户充值</h3>
              <p className="text-[11px] text-slate-400 font-medium">即时到账 · 实时更新可用余额</p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 当前余额提示 */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-bold">当前可用余额</span>
          <span className="font-black text-slate-900 text-sm font-mono">¥{currentBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
        </div>

        {/* 充值金额选择 (6档) */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-800 block">选择充值金额</label>
          <div className="grid grid-cols-3 gap-2.5">
            {presetAmounts.map(amt => {
              const isSelected = selectedAmount === amt && !customAmount;
              return (
                <button
                  key={amt}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(amt);
                    setCustomAmount('');
                  }}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer ${
                    isSelected 
                      ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-black ring-2 ring-indigo-200' 
                      : 'border-slate-200 hover:border-slate-300 text-slate-700 font-bold bg-white'
                  }`}
                >
                  <div className="text-base font-mono">¥{amt}</div>
                  <div className="text-[10px] text-slate-400 font-normal">充 ¥{amt} 余额</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 自定义金额 */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700 block">自定义金额 (元)</label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">¥</span>
            <input
              type="number"
              placeholder="输入自定义金额（如 150）"
              value={customAmount}
              onChange={(e) => {
                setCustomAmount(e.target.value);
              }}
              className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs font-extrabold outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
            />
          </div>
        </div>

        {/* 支付方式 (微信支付 / 支付宝) */}
        <div className="space-y-2">
          <label className="text-xs font-black text-slate-800 block">选择支付方式</label>
          <div className="grid grid-cols-2 gap-3">
            
            {/* 微信支付 */}
            <button
              type="button"
              onClick={() => setPaymentMethod('wechat')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                paymentMethod === 'wechat'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800 font-black ring-2 ring-emerald-200'
                  : 'border-slate-200 text-slate-700 font-bold bg-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center">
                微
              </span>
              <span className="text-xs">微信支付</span>
            </button>

            {/* 支付宝 */}
            <button
              type="button"
              onClick={() => setPaymentMethod('alipay')}
              className={`p-3 rounded-2xl border flex items-center justify-center gap-2 transition cursor-pointer ${
                paymentMethod === 'alipay'
                  ? 'border-sky-500 bg-sky-50 text-sky-800 font-black ring-2 ring-sky-200'
                  : 'border-slate-200 text-slate-700 font-bold bg-white'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-sky-500 text-white text-xs font-bold flex items-center justify-center">
                支
              </span>
              <span className="text-xs">支付宝</span>
            </button>

          </div>
        </div>

        {/* 确认支付 */}
        <div className="pt-2">
          <button
            onClick={handleConfirmRecharge}
            disabled={isProcessingPay}
            className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-sm transition shadow-lg hover:shadow-xl active:scale-98 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isProcessingPay ? (
              <>
                <Zap className="w-4 h-4 animate-spin text-white" />
                <span>正在处理充值...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>确认支付 ¥{displayAmount} 元</span>
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
