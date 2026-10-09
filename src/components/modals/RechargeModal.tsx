import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  X, 
  Wallet, 
  Coins, 
  CreditCard, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap,
  ArrowRight,
  QrCode,
  AlertCircle
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
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay' | 'bank'>('wechat');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [rechargeSuccess, setRechargeSuccess] = useState<boolean>(false);
  const [lastRechargeAmount, setLastRechargeAmount] = useState<number>(0);

  if (!rechargeModalOpen) return null;

  const presetAmounts = [
    { amount: 50, bonus: 0, tag: '' },
    { amount: 100, bonus: 50, tag: '赠50积分' },
    { amount: 200, bonus: 150, tag: '赠150积分' },
    { amount: 500, bonus: 500, tag: '赠500积分' },
    { amount: 1000, bonus: 1200, tag: '加赠1200分' },
    { amount: 2000, bonus: 3000, tag: '尊享特惠' },
  ];

  const currentBalance = user?.balance ?? 128.00;
  const currentPoints = user?.points ?? 1200;

  const finalAmount = customAmount ? parseFloat(customAmount) : selectedAmount;

  const handleExecuteRecharge = () => {
    if (isNaN(finalAmount) || finalAmount <= 0) {
      showToast('请输入有效的充值金额');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const bonusPoints = presetAmounts.find(p => p.amount === finalAmount)?.bonus || Math.floor(finalAmount * 0.5);
      const newBalance = currentBalance + finalAmount;
      const newPoints = currentPoints + bonusPoints;

      // Update user state
      setUser(prev => ({
        ...prev,
        balance: newBalance,
        points: newPoints
      }));

      setLastRechargeAmount(finalAmount);
      setIsProcessing(false);
      setRechargeSuccess(true);
      showToast(`🎉 充值成功！已到账 ¥${finalAmount.toFixed(2)} 元${bonusPoints > 0 ? `，获赠 ${bonusPoints} 积分` : ''}`);
    }, 600);
  };

  const handleClose = () => {
    setRechargeModalOpen(false);
    setRechargeSuccess(false);
    setCustomAmount('');
    setIsProcessing(false);
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in select-none">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200/90 animate-scale-up my-auto">
        
        {/* Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute -right-8 -top-8 w-36 h-36 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
          
          <div className="flex items-center gap-3 z-10">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black tracking-wide flex items-center gap-2">
                <span>账户快速充值中心</span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold">
                  实时秒级到账
                </span>
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                支持算力工坊、AI集市模型调用与任务赏金结算
              </p>
            </div>
          </div>

          <button
            onClick={handleClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer z-10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {rechargeSuccess ? (
          /* Recharge Success View */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <div className="space-y-1">
              <h3 className="text-xl font-black text-slate-900">充值成功！</h3>
              <p className="text-xs text-slate-500">
                已向您的账户成功充值 <span className="font-bold text-slate-900">¥{lastRechargeAmount.toFixed(2)}</span>
              </p>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-around text-xs">
              <div>
                <span className="text-slate-500 block mb-1">当前账户余额</span>
                <span className="text-lg font-black text-slate-900">¥{(user.balance ?? 0).toFixed(2)}</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div>
                <span className="text-slate-500 block mb-1">当前可用积分</span>
                <span className="text-lg font-black text-amber-600">{(user.points ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold shadow-md transition cursor-pointer"
            >
              完成并返回
            </button>
          </div>
        ) : (
          /* Recharge Form View */
          <div className="p-6 space-y-5">
            
            {/* Current Balance Bar */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">当前可用余额：</span>
                <span className="text-sm font-black text-slate-900">¥{currentBalance.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-600 font-bold bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/80">
                <Coins className="w-3.5 h-3.5" />
                <span>{currentPoints.toLocaleString()} 积分</span>
              </div>
            </div>

            {/* Select Amount Grid */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold text-slate-700 block">
                选择充值金额 (人民币)
              </label>
              <div className="grid grid-cols-3 gap-2.5">
                {presetAmounts.map((p) => {
                  const isSelected = selectedAmount === p.amount && !customAmount;
                  return (
                    <button
                      key={p.amount}
                      type="button"
                      onClick={() => {
                        setSelectedAmount(p.amount);
                        setCustomAmount('');
                      }}
                      className={`relative p-3 rounded-xl border text-center transition cursor-pointer flex flex-col items-center justify-center ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/50 text-indigo-900 ring-2 ring-indigo-600/30'
                          : 'border-slate-200 bg-white hover:border-slate-300 text-slate-800'
                      }`}
                    >
                      <span className="text-base font-black">¥{p.amount}</span>
                      {p.tag ? (
                        <span className="text-[10px] text-amber-600 font-bold mt-0.5">
                          {p.tag}
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-400 mt-0.5">标准面额</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Custom Amount Input */}
              <div className="relative mt-2">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                  ¥
                </div>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                  }}
                  placeholder="或输入自定义充值金额 (最低 ¥1.00)"
                  className="w-full pl-8 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-600 font-bold text-slate-800"
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">
                支付方式
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('wechat')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'wechat'
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-1 ring-emerald-500'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-emerald-600 font-black">微信支付</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('alipay')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'alipay'
                      ? 'border-blue-500 bg-blue-50 text-blue-800 ring-1 ring-blue-500'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-blue-600 font-black">支付宝</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank')}
                  className={`p-2.5 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition cursor-pointer ${
                    paymentMethod === 'bank'
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-800 ring-1 ring-indigo-500'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-indigo-600 font-black">企业对公</span>
                </button>
              </div>
            </div>

            {/* Guarantee Note */}
            <div className="flex items-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>资金受官方资金存管保护 · 实例停机后未使用资金可随时申请退款</span>
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                取消
              </button>

              <button
                type="button"
                disabled={isProcessing || isNaN(finalAmount) || finalAmount <= 0}
                onClick={handleExecuteRecharge}
                className="flex-[2] py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-extrabold text-xs shadow-md shadow-indigo-200 transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <span>正在安全连接收银台...</span>
                ) : (
                  <>
                    <span>立即支付 ¥{(isNaN(finalAmount) ? 0 : finalAmount).toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
