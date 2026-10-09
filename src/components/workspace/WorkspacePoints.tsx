import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Wallet, 
  Coins, 
  CreditCard, 
  PlusCircle, 
  CalendarCheck, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  HelpCircle,
  Gift,
  X,
  History,
  Search,
  Check,
  ChevronRight,
  Flame,
  Zap,
  Info
} from 'lucide-react';
import { AccountTransaction, TransactionCategory } from '../../types';
import { mockAccountTransactions, mockPointStoreItems } from '../../data/mockData';

export const WorkspacePoints: React.FC = () => {
  const { user, setUser, showToast, setWorkspaceSubTab } = useApp();

  // Tab State: 5 tabs as requested
  // 'all' | 'recharge' | 'expense' | 'points_earn' | 'points_spend'
  const [activeTab, setActiveTab] = useState<TransactionCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Transactions State
  const [transactions, setTransactions] = useState<AccountTransaction[]>(mockAccountTransactions);

  // Check-in State
  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const continuousDays = (user.continuousCheckInDays ?? 3) + (hasCheckedInToday ? 1 : 0);

  // Recharge Modal State
  const [showRechargeModal, setShowRechargeModal] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState<number>(100);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'wechat' | 'alipay'>('wechat');
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Modal Triggers
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showStoreModal, setShowStoreModal] = useState(false);

  const currentBalance = user.balance ?? 25800.00;
  const currentPoints = user.points ?? 15000;
  const pointsWorthRmb = (currentPoints * 0.01).toFixed(2);
  const frozenBalance = user.frozenBalance ?? 0;
  const frozenPoints = user.frozenPoints ?? 0;
  const frozenPointsWorthRmb = (frozenPoints * 0.01).toFixed(2);

  const presetAmounts = [30, 50, 100, 200, 500, 1000];

  // Format current date for transaction time string: "MM-DD HH:mm"
  const getNowTimeString = () => {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${month}-${day} ${hours}:${minutes}`;
  };

  // Handle Recharge Execution
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

      // Update User Balance in AppContext
      setUser(prev => ({
        ...prev,
        balance: newBal
      }));

      const payMethodLabel = paymentMethod === 'wechat' ? '微信支付' : '支付宝';

      // Add New Transaction Record
      const newTx: AccountTransaction = {
        id: `tx_${Date.now()}`,
        time: getNowTimeString(),
        type: '充值',
        category: 'recharge',
        detail: payMethodLabel,
        amountText: `+¥${finalAmount.toFixed(2)}`,
        balanceChangeText: `¥${prevBal.toFixed(2)}→¥${newBal.toFixed(2)}`,
        status: '成功',
        paymentMethod: payMethodLabel,
        rmbAmount: finalAmount,
        rmbBalanceAfter: newBal
      };

      setTransactions(prev => [newTx, ...prev]);
      setIsProcessingPay(false);
      setShowRechargeModal(false);
      setCustomAmount('');
      showToast(`充值成功！已成功向账户充值 ¥${finalAmount.toFixed(2)} 元`);
    }, 500);
  };

  // Handle Daily Checkin with Transaction Record
  const handleCheckIn = () => {
    if (hasCheckedInToday) {
      showToast(`今日已签到，已连续签到 ${continuousDays} 天！`);
      return;
    }

    const nextStreak = (user.continuousCheckInDays ?? 3) + 1;
    // 连续签到 7 天额外 +20 积分，常规每天 5 积分
    const isStreakBonus = nextStreak % 7 === 0;
    const earnedPoints = isStreakBonus ? 25 : 5;
    const prevPoints = currentPoints;
    const newPoints = prevPoints + earnedPoints;

    setHasCheckedInToday(true);
    setUser(prev => ({
      ...prev,
      points: newPoints,
      todayEarnedPoints: (prev.todayEarnedPoints || 0) + earnedPoints,
      continuousCheckInDays: nextStreak
    }));

    const newTx: AccountTransaction = {
      id: `tx_checkin_${Date.now()}`,
      time: getNowTimeString(),
      type: '积分获取',
      category: 'points_earn',
      detail: '每日签到',
      amountText: `+${earnedPoints}分`,
      balanceChangeText: `${prevPoints.toLocaleString()}→${newPoints.toLocaleString()}分`,
      status: '成功',
      source: '每日签到',
      pointsAmountNum: earnedPoints,
      remark: `连续签到第${nextStreak}天${isStreakBonus ? ' (含7天连续奖励+20分)' : ''}`,
      pointsAmount: earnedPoints,
      pointsBalanceAfter: newPoints
    };

    setTransactions(prev => [newTx, ...prev]);
    showToast(`🎉 签到成功！获得 +${earnedPoints} 积分，已连续签到 ${nextStreak} 天！`);
  };

  // Filter transactions based on active Tab and search query
  const filteredTransactions = transactions.filter(tx => {
    if (activeTab !== 'all' && tx.category !== activeTab) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDetail = tx.detail?.toLowerCase().includes(q);
      const matchMethod = tx.paymentMethod?.toLowerCase().includes(q);
      const matchScene = tx.scene?.toLowerCase().includes(q);
      const matchProduct = tx.productName?.toLowerCase().includes(q);
      const matchSource = tx.source?.toLowerCase().includes(q);
      const matchPurpose = tx.purpose?.toLowerCase().includes(q);
      const matchRemark = tx.remark?.toLowerCase().includes(q);
      const matchAmount = tx.amountText?.toLowerCase().includes(q);
      return matchDetail || matchMethod || matchScene || matchProduct || matchSource || matchPurpose || matchRemark || matchAmount;
    }
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-slate-800">
      
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Wallet className="w-6 h-6 text-indigo-600" />
            <span>我的账户</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-extrabold bg-indigo-50 text-indigo-700 border border-indigo-100">
              资金与积分中心
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            用户管理资金和积分的核心页面，整合余额、充值、积分、签到与流水记录，明晰钱与积分的流向
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRulesModal(true)}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <HelpCircle className="w-4 h-4 text-slate-500" />
            <span>抵扣与规则说明</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 顶部资产卡 (展示可用余额 & 积分余额) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 space-y-4">
        
        {/* 卡片主面板 */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-7 shadow-lg relative overflow-hidden border border-slate-800">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            
            {/* 左侧：可用余额 */}
            <div className="space-y-4 lg:border-r lg:border-white/10 lg:pr-8 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <span>可用余额 (人民币)</span>
                </div>
                
                <div className="flex flex-wrap items-baseline gap-4 mt-2">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-white font-mono">
                    ¥{currentBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  
                  <button
                    onClick={() => setShowRechargeModal(true)}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white text-xs font-black shadow-md hover:shadow-lg transition-all transform active:scale-95 flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>充 值</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 font-medium flex flex-wrap items-center gap-2 sm:gap-3 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-400">冻结资金：</span>
                  <strong className="text-cyan-300 font-mono font-bold">
                    ¥{frozenBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </strong>
                </span>
                <span className="text-white/20">•</span>
                <span className="px-1.5 py-0.5 rounded bg-indigo-500/30 text-indigo-200 text-[10px] font-bold">
                  发布任务托管
                </span>
                <span className="text-white/20">•</span>
                <span className="text-emerald-400 font-medium">支持在线按量扣费与实例续费</span>
              </div>
            </div>

            {/* 右侧：积分 */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-xs text-slate-300 font-bold uppercase tracking-wider flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <span>我的积分</span>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-black tracking-tight text-amber-400 font-mono">
                    {currentPoints.toLocaleString()}
                  </span>
                  <span className="text-sm font-extrabold text-amber-200/90 font-mono">
                    （=¥{pointsWorthRmb}）
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-slate-300 font-medium flex flex-wrap items-center gap-2 sm:gap-3 pt-2 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="text-slate-400">冻结积分：</span>
                  <strong className="text-amber-300 font-mono font-bold">
                    {frozenPoints.toLocaleString()} 积分
                  </strong>
                  <span className="text-amber-200/80 text-[10px] font-mono">(=¥{frozenPointsWorthRmb})</span>
                </span>
                <span className="text-white/20">•</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/30 text-amber-200 text-[10px] font-bold">
                  发布任务托管
                </span>
                <span className="text-white/20">•</span>
                <span className="text-amber-300/90 font-medium">1积分=¥0.01 抵扣</span>
              </div>
            </div>

          </div>

          {/* 背景光影 */}
          <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-12 -top-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        </div>
      </div>

      {/* ============================================================ */}
      {/* 中部：5个 Tab 切换与流水列表 */}
      {/* ============================================================ */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-0">
        
        {/* Tab 选项卡导航 */}
        <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* 5个 Tab 按钮 */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 md:pb-0">
            {[
              { key: 'all', label: '全部流水' },
              { key: 'recharge', label: '充值记录' },
              { key: 'expense', label: '消费记录' },
              { key: 'points_earn', label: '积分获取' },
              { key: 'points_spend', label: '积分消耗' },
            ].map(tab => {
              const isActive = activeTab === tab.key;
              const count = transactions.filter(t => tab.key === 'all' || t.category === tab.key).length;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as any)}
                  className={`px-4 py-2 rounded-xl text-xs font-extrabold transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                    isActive 
                      ? 'bg-indigo-600 text-white shadow-xs' 
                      : 'bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-slate-200/80'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 搜索框 */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              placeholder="搜索流水/商品/方式..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white rounded-xl border border-slate-200 text-xs font-medium focus:border-indigo-600 focus:ring-1 focus:ring-indigo-100 outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 表格内容区域 (根据当前选中的 Tab 专属列展示) */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs space-y-2">
              <History className="w-10 h-10 mx-auto text-slate-300" />
              <div className="font-bold text-slate-500">暂无相关流水记录</div>
              <div className="text-[11px] text-slate-400">您可以尝试切换上方 Tab 标签或清除搜索词</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              
              {/* ======================= ① 全部流水表头 ======================= */}
              {activeTab === 'all' && (
                <thead className="bg-slate-100/70 text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 pl-6">时间</th>
                    <th className="p-3.5">类型</th>
                    <th className="p-3.5">详情</th>
                    <th className="p-3.5">金额 / 积分变动</th>
                    <th className="p-3.5">余额 / 积分变化</th>
                    <th className="p-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              {/* ======================= ② 充值记录表头 ======================= */}
              {activeTab === 'recharge' && (
                <thead className="bg-slate-100/70 text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 pl-6">时间</th>
                    <th className="p-3.5">支付方式</th>
                    <th className="p-3.5">充值金额</th>
                    <th className="p-3.5">余额结余</th>
                    <th className="p-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              {/* ======================= ③ 消费记录表头 ======================= */}
              {activeTab === 'expense' && (
                <thead className="bg-slate-100/70 text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 pl-6">时间</th>
                    <th className="p-3.5">消费场景</th>
                    <th className="p-3.5">商品名称</th>
                    <th className="p-3.5">消费金额</th>
                    <th className="p-3.5">余额变动</th>
                    <th className="p-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              {/* ======================= ④ 积分获取表头 ======================= */}
              {activeTab === 'points_earn' && (
                <thead className="bg-slate-100/70 text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 pl-6">时间</th>
                    <th className="p-3.5">获取来源</th>
                    <th className="p-3.5">获取积分</th>
                    <th className="p-3.5">说明备注</th>
                    <th className="p-3.5">积分结余</th>
                    <th className="p-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              {/* ======================= ⑤ 积分消耗表头 ======================= */}
              {activeTab === 'points_spend' && (
                <thead className="bg-slate-100/70 text-slate-500 font-extrabold border-b border-slate-200">
                  <tr>
                    <th className="p-3.5 pl-6">时间</th>
                    <th className="p-3.5">消耗用途</th>
                    <th className="p-3.5">消耗积分</th>
                    <th className="p-3.5">抵扣说明</th>
                    <th className="p-3.5">积分结余</th>
                    <th className="p-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredTransactions.map(tx => {
                  return (
                    <tr key={tx.id} className="hover:bg-slate-50/80 transition">
                      
                      {/* 1. 全部流水视图 */}
                      {activeTab === 'all' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono text-slate-600 whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            {tx.category === 'recharge' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                                充值
                              </span>
                            )}
                            {tx.category === 'expense' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200/80">
                                消费
                              </span>
                            )}
                            {tx.category === 'points_earn' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200/80">
                                积分获取
                              </span>
                            )}
                            {tx.category === 'points_spend' && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200/80">
                                积分消耗
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-extrabold text-slate-900 text-xs">
                              {tx.detail || tx.title}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className={`font-black text-xs ${
                              tx.amountText?.startsWith('+') 
                                ? (tx.category === 'recharge' ? 'text-emerald-600' : 'text-amber-600')
                                : (tx.category === 'expense' ? 'text-rose-600' : 'text-slate-700')
                            }`}>
                              {tx.amountText || (tx.rmbAmount !== undefined ? `${tx.rmbAmount > 0 ? '+' : ''}¥${tx.rmbAmount.toFixed(2)}` : '')}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-xs">
                            {tx.balanceChangeText || '-'}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* 2. 充值记录视图 */}
                      {activeTab === 'recharge' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono text-slate-600 whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-xl bg-slate-100 font-extrabold text-slate-800 text-[11px] inline-flex items-center gap-1.5">
                              {tx.paymentMethod === '微信支付' ? (
                                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                              ) : (
                                <span className="w-2 h-2 rounded-full bg-sky-500" />
                              )}
                              <span>{tx.paymentMethod || tx.detail || '微信支付'}</span>
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className="font-black text-emerald-600 text-xs">
                              {tx.amountText?.startsWith('+') ? tx.amountText : `+¥${tx.rmbAmount ? tx.rmbAmount.toFixed(2) : '100.00'}`}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-xs">
                            {tx.balanceChangeText || (tx.rmbBalanceAfter ? `余额 ¥${tx.rmbBalanceAfter.toFixed(2)}` : '-')}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* 3. 消费记录视图 */}
                      {activeTab === 'expense' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono text-slate-600 whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-xl bg-indigo-50 text-indigo-700 font-extrabold text-[11px]">
                              {tx.scene || (tx.detail?.includes('Agent') ? 'Agent订阅' : '算力租赁')}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-extrabold text-slate-900 text-xs">
                              {tx.productName || tx.detail}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className="font-black text-rose-600 text-xs">
                              {tx.amountText || (tx.rmbAmount ? `-¥${Math.abs(tx.rmbAmount).toFixed(2)}` : '-')}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-xs">
                            {tx.balanceChangeText || (tx.rmbBalanceAfter ? `¥${tx.rmbBalanceAfter.toFixed(2)}` : '-')}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* 4. 积分获取视图 */}
                      {activeTab === 'points_earn' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono text-slate-600 whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2.5 py-1 rounded-xl bg-amber-50 text-amber-800 font-extrabold text-[11px] inline-flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-amber-500" />
                              <span>{tx.source || tx.detail || '每日签到'}</span>
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className="font-black text-amber-600 text-xs">
                              {tx.amountText || (tx.pointsAmountNum ? `+${tx.pointsAmountNum}` : (tx.pointsAmount ? `+${tx.pointsAmount}` : '+5'))}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 text-xs">
                            {tx.remark || '签到奖励'}
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-xs">
                            {tx.balanceChangeText || (tx.pointsBalanceAfter ? `结余 ${tx.pointsBalanceAfter}分` : '-')}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* 5. 积分消耗视图 */}
                      {activeTab === 'points_spend' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono text-slate-600 whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            <span className="font-extrabold text-slate-900 text-xs">
                              {tx.purpose || tx.detail || 'Agent订阅抵扣'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono">
                            <span className="font-black text-purple-600 text-xs">
                              {tx.amountText || (tx.pointsAmountNum ? `${tx.pointsAmountNum}` : (tx.pointsAmount ? `${tx.pointsAmount}` : '-300'))}
                            </span>
                          </td>
                          <td className="p-3.5 text-slate-600 text-xs">
                            <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 font-bold border border-amber-200/60 text-[11px]">
                              {tx.remark || tx.deductionInfo || '抵扣¥3.00'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono text-slate-500 text-xs">
                            {tx.balanceChangeText || (tx.pointsBalanceAfter ? `结余 ${tx.pointsBalanceAfter}分` : '-')}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-700">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* 底部固定区域：每日签到按钮与连续打卡卡片 */}
      {/* ============================================================ */}
      <div className="bg-gradient-to-r from-amber-500/10 via-amber-50 to-orange-50/80 rounded-3xl border border-amber-200/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* 左侧说明与7天连续签到进度 */}
        <div className="space-y-3 w-full md:w-auto">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-white flex items-center justify-center shadow-md shrink-0">
              <CalendarCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <span>每日签到</span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-black bg-amber-200 text-amber-900 flex items-center gap-1">
                  <Flame className="w-3 h-3 text-amber-700" />
                  <span>5积分 / 天</span>
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full font-black bg-orange-100 text-orange-800 border border-orange-200">
                  连续7天额外+20积分
                </span>
              </h3>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                坚持每日打卡赚取免费积分，可用于抵扣全平台 Agent 订阅订单费用
              </p>
            </div>
          </div>

          {/* 7 天连续签到徽章日历条 */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-1">
            {[1, 2, 3, 4, 5, 6, 7].map(day => {
              const isChecked = day <= continuousDays;
              const isTodayTarget = day === continuousDays + (hasCheckedInToday ? 0 : 1);
              const isBonusDay = day === 7;

              return (
                <div 
                  key={day}
                  className={`px-2.5 py-1.5 rounded-xl text-center border text-[11px] flex-1 sm:flex-initial transition ${
                    isChecked
                      ? 'bg-amber-500 border-amber-600 text-white font-black shadow-2xs'
                      : isTodayTarget
                      ? 'bg-white border-amber-400 text-amber-800 font-extrabold ring-2 ring-amber-300/60'
                      : 'bg-white/60 border-slate-200 text-slate-400 font-medium'
                  }`}
                >
                  <div className="text-[10px] opacity-90">第{day}天</div>
                  <div className="font-bold flex items-center justify-center gap-0.5">
                    {isChecked ? <Check className="w-3 h-3" /> : isBonusDay ? '+25' : '+5'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 右侧签到主行动按钮 */}
        <div className="w-full md:w-auto shrink-0 flex flex-col sm:flex-row items-center gap-3">
          <button
            onClick={handleCheckIn}
            disabled={hasCheckedInToday}
            className={`w-full sm:w-auto px-7 py-3.5 rounded-2xl text-xs sm:text-sm font-black transition shadow-md flex items-center justify-center gap-2 cursor-pointer ${
              hasCheckedInToday
                ? 'bg-slate-200 text-slate-500 cursor-not-allowed shadow-none border border-slate-300'
                : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 active:scale-95 text-white hover:shadow-lg'
            }`}
          >
            {hasCheckedInToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>今日已签到 (已连续签到 {continuousDays} 天)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>点击签到 (+5积分)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 充值 Modal (点击【充值】按钮进入) */}
      {/* ============================================================ */}
      {showRechargeModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-6 animate-scale-up relative">
            
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
                onClick={() => setShowRechargeModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* 当前余额提示 */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500 font-bold">当前可用余额</span>
              <span className="font-black text-slate-900 text-sm font-mono">¥{currentBalance.toFixed(2)}</span>
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
                    <span>确认支付 ¥{customAmount ? parseFloat(customAmount) || 0 : selectedAmount} 元</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 积分规则 Modal */}
      {/* ============================================================ */}
      {showRulesModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-indigo-600" />
                <span>积分获取与抵扣规则</span>
              </h3>
              <button onClick={() => setShowRulesModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs space-y-4 text-slate-600 leading-relaxed font-medium">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/80 text-amber-900 font-bold">
                <div className="flex items-center gap-1.5 text-xs text-amber-900 font-black">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>1 积分 = ¥0.01 元人民币，用于消费抵扣</span>
                </div>
              </div>

              {/* 积分获取规则表格 */}
              <div className="space-y-2">
                <div className="font-extrabold text-slate-900 text-xs flex items-center gap-1.5">
                  <Coins className="w-4 h-4 text-amber-500" />
                  <span>积分获取规则表</span>
                </div>
                <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-2xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100/90 text-slate-700 font-extrabold border-b border-slate-200">
                      <tr>
                        <th className="p-2.5 pl-3">行为</th>
                        <th className="p-2.5">奖励</th>
                        <th className="p-2.5">频率限制</th>
                        <th className="p-2.5 pr-3">说明</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      <tr className="hover:bg-amber-50/40 transition">
                        <td className="p-2.5 pl-3 font-bold text-slate-900">每日签到</td>
                        <td className="p-2.5 font-mono font-black text-amber-600">+5</td>
                        <td className="p-2.5 text-slate-600 font-medium">每日1次</td>
                        <td className="p-2.5 pr-3 text-slate-500 text-[11px]">连续签到7天额外+20</td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 transition">
                        <td className="p-2.5 pl-3 font-bold text-slate-900">上传数据集</td>
                        <td className="p-2.5 font-mono font-black text-amber-600">+50</td>
                        <td className="p-2.5 text-slate-600 font-medium">每月上限3个</td>
                        <td className="p-2.5 pr-3 text-slate-500 text-[11px]">审核通过后发放</td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 transition">
                        <td className="p-2.5 pl-3 font-bold text-slate-900">上传Skill</td>
                        <td className="p-2.5 font-mono font-black text-amber-600">+50</td>
                        <td className="p-2.5 text-slate-600 font-medium">每月上限3个</td>
                        <td className="p-2.5 pr-3 text-slate-500 text-[11px]">审核通过后发放</td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 transition">
                        <td className="p-2.5 pl-3 font-bold text-slate-900">发布帖子</td>
                        <td className="p-2.5 font-mono font-black text-amber-600">+5</td>
                        <td className="p-2.5 text-slate-600 font-medium">每日上限3次</td>
                        <td className="p-2.5 pr-3 text-slate-500 text-[11px]">社区发帖</td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 transition bg-amber-50/20">
                        <td className="p-2.5 pl-3 font-bold text-slate-900 flex items-center gap-1">
                          <span>帖子加精</span>
                          <span className="text-[10px] px-1.5 py-0.2 bg-amber-100 text-amber-800 rounded font-black">奖励</span>
                        </td>
                        <td className="p-2.5 font-mono font-black text-amber-600">+10</td>
                        <td className="p-2.5 text-slate-600 font-medium">无上限</td>
                        <td className="p-2.5 pr-3 text-slate-500 text-[11px]">帖子被设为精华文章后自动发放发帖人</td>
                      </tr>
                      <tr className="hover:bg-amber-50/40 transition">
                        <td className="p-2.5 pl-3 font-bold text-slate-900">完成一次任务</td>
                        <td className="p-2.5 font-mono font-black text-amber-600">+30</td>
                        <td className="p-2.5 text-slate-600 font-medium">不限</td>
                        <td className="p-2.5 pr-3 text-slate-500 text-[11px]">任务验收通过后自动发放</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 抵扣与通用说明 */}
              <div className="space-y-1.5 pt-1 text-slate-600">
                <div className="font-extrabold text-slate-900 text-xs">使用、抵扣与资产冻结规则说明</div>
                <ul className="space-y-1.5 list-disc pl-4 text-[11px] text-slate-600">
                  <li><strong>积分价值：</strong>1 积分等额折算 ¥0.01 元，可直接抵扣消费金额。</li>
                  <li><strong>积分有效期：</strong>平台赠送及赚取的积分长期有效，不设过期时间。</li>
                  <li><strong>任务发布冻结资金与积分：</strong>在任务大厅发布悬赏任务时，预扣的现金赏金与积分奖励自动转入【冻结资金】与【冻结积分】托管池。在任务处于审核中或进行中期间，冻结资产不可挪用；任务验收通过后自动向接单开发者发放结算；若任务审核被驳回或取消，冻结的资金与积分将全额原路退还至您的账户。</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setShowRulesModal(false)}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs cursor-pointer transition shadow-sm"
            >
              我知道了
            </button>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 积分商城 Modal (福利兑换) */}
      {/* ============================================================ */}
      {showStoreModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Gift className="w-4 h-4 text-amber-500" />
                <span>积分商城与兑换福利</span>
              </h3>
              <button onClick={() => setShowStoreModal(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {mockPointStoreItems.map(item => (
                <div key={item.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="text-2xl">{item.image}</div>
                  <div className="text-xs font-black text-slate-900">{item.name}</div>
                  <div className="text-[11px] text-slate-500">{item.description}</div>
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-amber-600">{item.pointsRequired} 积分</span>
                    <button
                      onClick={() => {
                        if (user.points < item.pointsRequired) {
                          showToast(`积分不足！需要 ${item.pointsRequired} 积分`);
                        } else {
                          const newPts = user.points - item.pointsRequired;
                          setUser(prev => ({ ...prev, points: newPts }));
                          
                          // 增加积分消耗流水
                          const storeTx: AccountTransaction = {
                            id: `tx_store_${Date.now()}`,
                            time: getNowTimeString(),
                            type: '积分消耗',
                            category: 'points_spend',
                            detail: `兑换【${item.name}】`,
                            amountText: `-${item.pointsRequired}分`,
                            balanceChangeText: `${user.points}→${newPts}分`,
                            status: '成功',
                            purpose: '积分商城兑换',
                            pointsAmountNum: -item.pointsRequired,
                            remark: `兑换${item.name}`,
                            pointsAmount: -item.pointsRequired,
                            pointsBalanceAfter: newPts
                          };
                          setTransactions(prev => [storeTx, ...prev]);

                          showToast(`成功兑换【${item.name}】！福利已自动发放`);
                          setShowStoreModal(false);
                        }
                      }}
                      className="px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold cursor-pointer transition"
                    >
                      兑换
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
