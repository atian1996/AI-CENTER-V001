import React, { useState } from 'react';
import { AgentItem, SubscriptionPackage, AgentSubscriptionItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { X, CheckCircle2, Zap, ShieldCheck, Sparkles, Coins, Flame } from 'lucide-react';

interface SubscribeModalProps {
  agent: AgentItem;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (subItem: AgentSubscriptionItem) => void;
  currentTrialLeft?: number;
}

export const SUBSCRIPTION_PACKAGES: SubscriptionPackage[] = [
  {
    id: 'week',
    name: '周卡',
    price: 49,
    tokenAmountText: '20万Token',
    tokenAmountVal: 20,
    unitPriceText: '¥2.45/万Token',
    validityDays: 7,
    targetAudience: '短期项目、一周密集使用'
  },
  {
    id: 'month',
    name: '月卡',
    price: 99,
    tokenAmountText: '50万Token',
    tokenAmountVal: 50,
    unitPriceText: '¥1.98/万Token',
    validityDays: 30,
    isRecommended: true,
    tag: '🔥 热门推荐',
    targetAudience: '高频个人、月度常规使用'
  },
  {
    id: 'quarter',
    name: '季卡',
    price: 199,
    tokenAmountText: '120万Token',
    tokenAmountVal: 120,
    unitPriceText: '¥1.66/万Token',
    validityDays: 90,
    targetAudience: '企业级用户、长期项目'
  },
  {
    id: 'year',
    name: '年卡',
    price: 499,
    tokenAmountText: '350万Token',
    tokenAmountVal: 350,
    unitPriceText: '¥1.43/万Token',
    validityDays: 365,
    tag: '省超多',
    targetAudience: '政府、大型企业、批量采购'
  }
];

export const SubscribeModal: React.FC<SubscribeModalProps> = ({
  agent,
  isOpen,
  onClose,
  onSuccess,
  currentTrialLeft = 15
}) => {
  const { user, setUser, showToast } = useApp();
  const [selectedTierId, setSelectedTierId] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [usePointsDiscount, setUsePointsDiscount] = useState<boolean>(true);

  if (!isOpen) return null;

  const selectedPkg = SUBSCRIPTION_PACKAGES.find(p => p.id === selectedTierId) || SUBSCRIPTION_PACKAGES[1];

  // 计算积分抵扣: 100积分 = 1元
  const userMaxYuanFromPoints = Math.floor((user.points / 100) * 100) / 100;
  
  // 实际抵扣元
  const actualDiscountYuan = usePointsDiscount 
    ? Math.min(selectedPkg.price, userMaxYuanFromPoints) 
    : 0;
  const usedPointsCount = Math.round(actualDiscountYuan * 100);

  // 最终需支付人民币
  const finalPayAmount = Math.max(0, Math.round((selectedPkg.price - actualDiscountYuan) * 100) / 100);

  const handleConfirmSubscribe = () => {
    if (user.balance < finalPayAmount) {
      // 余额不足，一键模拟充值并完成订阅，提升体验
      showToast('账户余额不足！已自动为您充值补充并完成订阅');
      setUser(prev => ({
        ...prev,
        balance: prev.balance + Math.ceil(finalPayAmount - prev.balance + 50)
      }));
    }

    // 扣除余额和积分
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, Math.round((prev.balance - finalPayAmount) * 100) / 100),
      points: Math.max(0, prev.points - usedPointsCount)
    }));

    const expireDate = new Date(Date.now() + selectedPkg.validityDays * 24 * 3600 * 1000)
      .toISOString().split('T')[0];

    const newSub: AgentSubscriptionItem = {
      agentId: agent.id,
      agentName: agent.name,
      tier: selectedPkg.id,
      tierName: selectedPkg.name,
      price: selectedPkg.price,
      tokenAmountVal: selectedPkg.tokenAmountVal,
      tokensLeftVal: selectedPkg.tokenAmountVal,
      expireDate,
      subscribedAt: new Date().toISOString().split('T')[0]
    };

    showToast(`🎉 成功订阅【${agent.name}】${selectedPkg.name}！已获得 ${selectedPkg.tokenAmountText} 专属额度。`);
    
    if (onSuccess) {
      onSuccess(newSub);
    }
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[120] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in cursor-pointer"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[92vh] my-auto cursor-default"
      >
        
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 text-white flex items-start justify-between relative">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 mb-1">
              <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span>智能Agent订阅专区</span>
            </div>
            <h3 className="text-xl font-black tracking-tight flex items-center gap-2">
              📦 选择订阅套餐
            </h3>
            <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-indigo-200 font-medium">
              <span>Agent：<strong className="text-white">{agent.name}</strong></span>
              <span className="text-indigo-400">•</span>
              <span className="bg-indigo-700/60 px-2 py-0.5 rounded-md text-indigo-100 border border-indigo-500/30">
                当前：试用模式 · 今日剩余 {currentTrialLeft}/30 次
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Recommended Packages Grid */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                <span>推荐套餐（根据你的使用频次智能推荐）</span>
              </label>
              <span className="text-[11px] font-bold text-slate-400">至少一周起订 · 先买后用更实惠</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mb-3.5">
              {SUBSCRIPTION_PACKAGES.slice(0, 3).map(pkg => {
                const isSelected = selectedTierId === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedTierId(pkg.id)}
                    className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                    }`}
                  >
                    {pkg.tag && (
                      <span className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white text-[10px] font-extrabold shadow-xs flex items-center gap-1">
                        {pkg.tag}
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-black text-slate-900">{pkg.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-600 fill-indigo-100" />}
                      </div>

                      <div className="flex items-baseline gap-1 my-2">
                        <span className="text-2xl font-black text-indigo-700">¥{pkg.price}</span>
                        <span className="text-[10px] font-bold text-slate-400">/ {pkg.validityDays}天</span>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="font-bold text-slate-800 flex items-center gap-1">
                          <Coins className="w-3.5 h-3.5 text-amber-500" />
                          <span>{pkg.tokenAmountText}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 font-medium">
                          折合 {pkg.unitPriceText}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-100/80 text-[10px] text-slate-500 font-medium line-clamp-1">
                      {pkg.targetAudience}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4th Package: 年卡 */}
            {SUBSCRIPTION_PACKAGES[3] && (
              <div
                onClick={() => setSelectedTierId(SUBSCRIPTION_PACKAGES[3].id)}
                className={`relative p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                  selectedTierId === SUBSCRIPTION_PACKAGES[3].id
                    ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-200'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 font-black flex items-center justify-center text-xs shrink-0">
                    年卡
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-black text-slate-900">企业与政务年卡套餐</span>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-md">
                        ¥1.43/万Token · 超值省 40%
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      包含 <strong>350万 Token</strong> 额度，365天全周期保障，适合团队与大型项目。
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xl font-black text-indigo-700">¥499</span>
                  <div className="text-[10px] text-slate-400 font-bold">365天有效</div>
                </div>
              </div>
            )}
          </div>

          {/* Account Balance & Points Discount */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-bold text-slate-700">
              <div className="flex items-center gap-2">
                <span>💳 当前账户余额：<strong className="text-slate-900 font-black">¥{(user?.balance ?? 128).toFixed(2)}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span>🌟 可用积分：<strong className="text-amber-600 font-black">{user.points}</strong></span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={usePointsDiscount}
                  onChange={(e) => setUsePointsDiscount(e.target.checked)}
                  className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                />
                <span>使用积分抵扣（使用 {usedPointsCount} 积分抵扣 ¥{actualDiscountYuan.toFixed(2)}）</span>
              </label>

              <div className="text-xs text-slate-500 font-medium">
                原价 ¥{selectedPkg.price} - 抵扣 ¥{actualDiscountYuan.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Price Calculation Row */}
          <div className="flex items-center justify-between pt-2">
            <div className="text-xs text-slate-500">
              订阅即代表您同意《AI运营中心应用平台服务协议》与扣费条款
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 font-bold mr-1">实付金额：</span>
              <span className="text-2xl font-black text-indigo-600">¥{finalPayAmount.toFixed(2)}</span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleConfirmSubscribe}
            className="px-7 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-extrabold shadow-md shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>确认订阅</span>
          </button>
        </div>

      </div>
    </div>
  );
};
