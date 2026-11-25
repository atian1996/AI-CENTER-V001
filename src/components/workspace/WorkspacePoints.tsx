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
  const { user, setUser, showToast, setWorkspaceSubTab, openRechargeModal } = useApp();

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
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-[#1A1A1A]">
      
      {/* 顶部标题栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2.5">
            <Wallet className="w-5 h-5 text-[#333333]" />
            <span>我的账户</span>
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            用户管理资金和积分的核心页面，整合余额、充值、积分、签到与流水记录，明晰钱与积分的流向
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowRulesModal(true)}
            className="px-3.5 py-2 rounded-md bg-white hover:bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333] text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-[#666666]" />
            <span>抵扣与规则说明</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 顶部资产卡 (展示可用余额 & 积分余额) */}
      {/* ============================================================ */}
      <div className="bg-white rounded-md border border-[#EAEAEA] p-5 space-y-4">
        
        {/* 卡片主面板 */}
        <div className="bg-[#1A1A1A] text-white rounded-md p-6 sm:p-7 relative overflow-hidden border border-[#2A2A2A]">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative z-10">
            
            {/* 左侧：可用余额 */}
            <div className="space-y-4 lg:border-r lg:border-white/10 lg:pr-8 flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#A3A3A3] font-medium tracking-wider flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-white/10 text-white flex items-center justify-center">
                    <Wallet className="w-3.5 h-3.5" />
                  </div>
                  <span>可用余额 (人民币)</span>
                </div>
                
                <div className="flex flex-wrap items-baseline gap-4 mt-2">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono tabular-nums">
                    ¥{currentBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  
                  <button
                    onClick={() => openRechargeModal()}
                    className="px-4 py-1.5 rounded-md bg-white hover:bg-[#EAEAEA] text-[#1A1A1A] text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>充 值</span>
                  </button>
                </div>
              </div>

              <div className="text-[11px] text-[#A3A3A3] flex flex-wrap items-center gap-2 sm:gap-3 pt-3 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#888888]">冻结资金：</span>
                  <strong className="text-white font-mono font-semibold tabular-nums">
                    ¥{frozenBalance.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </strong>
                </span>
                <span className="text-white/20">·</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#E5E5E5] text-[10px] font-medium">
                  发布任务托管
                </span>
                <span className="text-white/20">·</span>
                <span className="text-[#D4D4D4]">支持在线按量扣费与实例续费</span>
              </div>
            </div>

            {/* 右侧：积分 */}
            <div className="space-y-4 flex flex-col justify-between">
              <div>
                <div className="text-xs text-[#A3A3A3] font-medium tracking-wider flex items-center gap-2 mb-2">
                  <div className="w-6 h-6 rounded bg-white/10 text-[#D97706] flex items-center justify-center">
                    <Coins className="w-3.5 h-3.5" />
                  </div>
                  <span>我的积分</span>
                </div>

                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl sm:text-4xl font-bold tracking-tight text-white font-mono tabular-nums">
                    {currentPoints.toLocaleString()}
                  </span>
                  <span className="text-sm font-medium text-[#A3A3A3] font-mono tabular-nums">
                    （=¥{pointsWorthRmb}）
                  </span>
                </div>
              </div>

              <div className="text-[11px] text-[#A3A3A3] flex flex-wrap items-center gap-2 sm:gap-3 pt-3 border-t border-white/10">
                <span className="flex items-center gap-1.5">
                  <span className="text-[#888888]">冻结积分：</span>
                  <strong className="text-white font-mono font-semibold tabular-nums">
                    {frozenPoints.toLocaleString()} 积分
                  </strong>
                  <span className="text-[#A3A3A3] text-[10px] font-mono tabular-nums">(=¥{frozenPointsWorthRmb})</span>
                </span>
                <span className="text-white/20">·</span>
                <span className="px-1.5 py-0.5 rounded bg-white/10 text-[#E5E5E5] text-[10px] font-medium">
                  发布任务托管
                </span>
                <span className="text-white/20">·</span>
                <span className="text-[#D4D4D4]">1积分=¥0.01 抵扣</span>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 中部：5个 Tab 切换与流水列表 */}
      {/* ============================================================ */}
      <div className="bg-white rounded-md border border-[#EAEAEA] overflow-hidden space-y-0">
        
        {/* Tab 选项卡导航 */}
        <div className="p-4 bg-[#FAFAFA] border-b border-[#EAEAEA] flex flex-col md:flex-row md:items-center justify-between gap-3">
          
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
                  className={`px-3.5 py-1.5 rounded-md text-xs font-medium transition whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                    isActive 
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' 
                      : 'bg-white text-[#555555] hover:text-[#1A1A1A] hover:bg-[#F5F5F5] border-[#EAEAEA]'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono tabular-nums ${
                    isActive ? 'bg-white/15 text-white' : 'bg-[#F5F5F5] text-[#666666]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 搜索框 */}
          <div className="relative min-w-[220px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#999999]" />
            <input 
              type="text"
              placeholder="搜索流水/商品/方式..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-white rounded-md border border-[#E0E0E0] text-xs text-[#1A1A1A] placeholder-[#999999] focus:border-[#1A1A1A] outline-none transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#999999] hover:text-[#333333] text-xs cursor-pointer"
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* 表格内容区域 (根据当前选中的 Tab 专属列展示) */}
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="py-16 text-center text-[#999999] text-xs space-y-2">
              <History className="w-9 h-9 mx-auto text-[#CCCCCC]" />
              <div className="font-semibold text-[#555555]">暂无相关流水记录</div>
              <div className="text-[11px] text-[#999999]">您可以尝试切换上方 Tab 标签或清除搜索词</div>
            </div>
          ) : (
            <table className="w-full text-left text-xs">
              
              {/* ======================= ① 全部流水表头 ======================= */}
              {activeTab === 'all' && (
                <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                  <tr>
                    <th className="py-3 px-3.5 pl-6">时间</th>
                    <th className="py-3 px-3.5">类型</th>
                    <th className="py-3 px-3.5">详情</th>
                    <th className="py-3 px-3.5">金额 / 积分变动</th>
                    <th className="py-3 px-3.5">余额 / 积分变化</th>
                    <th className="py-3 px-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              {/* ======================= ② 充值记录表头 ======================= */}
              {activeTab === 'recharge' && (
                <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                  <tr>
                    <th className="py-3 px-3.5 pl-6">时间</th>
                    <th className="py-3 px-3.5">支付方式</th>
                    <th className="py-3 px-3.5">充值金额</th>
                    <th className="py-3 px-3.5">余额结余</th>
                    <th className="py-3 px-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              {/* ======================= ③ 消费记录表头 ======================= */}
              {activeTab === 'expense' && (
                <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                  <tr>
                    <th className="py-3 px-3.5 pl-6">时间</th>
                    <th className="py-3 px-3.5">消费场景</th>
                    <th className="py-3 px-3.5">商品名称</th>
                    <th className="py-3 px-3.5">消费金额</th>
                    <th className="py-3 px-3.5">余额变动</th>
                    <th className="py-3 px-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              {/* ======================= ④ 积分获取表头 ======================= */}
              {activeTab === 'points_earn' && (
                <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                  <tr>
                    <th className="py-3 px-3.5 pl-6">时间</th>
                    <th className="py-3 px-3.5">获取来源</th>
                    <th className="py-3 px-3.5">获取积分</th>
                    <th className="py-3 px-3.5">说明备注</th>
                    <th className="py-3 px-3.5">积分结余</th>
                    <th className="py-3 px-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              {/* ======================= ⑤ 积分消耗表头 ======================= */}
              {activeTab === 'points_spend' && (
                <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                  <tr>
                    <th className="py-3 px-3.5 pl-6">时间</th>
                    <th className="py-3 px-3.5">消耗用途</th>
                    <th className="py-3 px-3.5">消耗积分</th>
                    <th className="py-3 px-3.5">抵扣说明</th>
                    <th className="py-3 px-3.5">积分结余</th>
                    <th className="py-3 px-3.5 text-right pr-6">状态</th>
                  </tr>
                </thead>
              )}

              <tbody className="divide-y divide-[#F2F2F2] font-normal">
                {filteredTransactions.map(tx => {
                  return (
                    <tr key={tx.id} className="hover:bg-[#FAFAFA] transition">
                      
                      {/* 1. 全部流水视图 */}
                      {activeTab === 'all' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono tabular-nums text-[#666666] whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            {tx.category === 'recharge' && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F5F5] text-[#166534] border border-[#EAEAEA]">
                                充值
                              </span>
                            )}
                            {tx.category === 'expense' && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F5F5] text-[#991B1B] border border-[#EAEAEA]">
                                消费
                              </span>
                            )}
                            {tx.category === 'points_earn' && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F5F5] text-[#166534] border border-[#EAEAEA]">
                                积分获取
                              </span>
                            )}
                            {tx.category === 'points_spend' && (
                              <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F5F5] text-[#4B5563] border border-[#EAEAEA]">
                                积分消耗
                              </span>
                            )}
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-[#1A1A1A] text-xs">
                              {tx.detail || tx.title}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums">
                            <span className={`font-semibold text-xs ${
                              tx.amountText?.startsWith('+') 
                                ? 'text-[#166534]'
                                : (tx.category === 'expense' ? 'text-[#991B1B]' : 'text-[#333333]')
                            }`}>
                              {tx.amountText || (tx.rmbAmount !== undefined ? `${tx.rmbAmount > 0 ? '+' : ''}¥${tx.rmbAmount.toFixed(2)}` : '')}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums text-[#666666] text-xs">
                            {tx.balanceChangeText || '-'}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#166534]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* 2. 充值记录视图 */}
                      {activeTab === 'recharge' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono tabular-nums text-[#666666] whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] font-medium text-[#333333] text-[11px] inline-flex items-center gap-1.5">
                              <span>{tx.paymentMethod || tx.detail || '微信支付'}</span>
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums">
                            <span className="font-semibold text-[#166534] text-xs">
                              {tx.amountText?.startsWith('+') ? tx.amountText : `+¥${tx.rmbAmount ? tx.rmbAmount.toFixed(2) : '100.00'}`}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums text-[#666666] text-xs">
                            {tx.balanceChangeText || (tx.rmbBalanceAfter ? `余额 ¥${tx.rmbBalanceAfter.toFixed(2)}` : '-')}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#166534]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* 3. 消费记录视图 */}
                      {activeTab === 'expense' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono tabular-nums text-[#666666] whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] text-[#4B5563] font-medium text-[11px]">
                              {tx.scene || (tx.detail?.includes('Agent') ? 'Agent订阅' : '算力租赁')}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-[#1A1A1A] text-xs">
                              {tx.productName || tx.detail}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums">
                            <span className="font-semibold text-[#991B1B] text-xs">
                              {tx.amountText || (tx.rmbAmount ? `-¥${Math.abs(tx.rmbAmount).toFixed(2)}` : '-')}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums text-[#666666] text-xs">
                            {tx.balanceChangeText || (tx.rmbBalanceAfter ? `¥${tx.rmbBalanceAfter.toFixed(2)}` : '-')}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#166534]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* 4. 积分获取视图 */}
                      {activeTab === 'points_earn' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono tabular-nums text-[#666666] whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            <span className="px-2 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333] font-medium text-[11px] inline-flex items-center gap-1">
                              <span>{tx.source || tx.detail || '每日签到'}</span>
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums">
                            <span className="font-semibold text-[#166534] text-xs">
                              {tx.amountText || (tx.pointsAmountNum ? `+${tx.pointsAmountNum}` : (tx.pointsAmount ? `+${tx.pointsAmount}` : '+5'))}
                            </span>
                          </td>
                          <td className="p-3.5 text-[#666666] text-xs">
                            {tx.remark || '签到奖励'}
                          </td>
                          <td className="p-3.5 font-mono tabular-nums text-[#666666] text-xs">
                            {tx.balanceChangeText || (tx.pointsBalanceAfter ? `结余 ${tx.pointsBalanceAfter}分` : '-')}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#166534]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                              <span>{tx.status || '成功'}</span>
                            </span>
                          </td>
                        </>
                      )}

                      {/* 5. 积分消耗视图 */}
                      {activeTab === 'points_spend' && (
                        <>
                          <td className="p-3.5 pl-6 font-mono tabular-nums text-[#666666] whitespace-nowrap">
                            {tx.time}
                          </td>
                          <td className="p-3.5">
                            <span className="font-semibold text-[#1A1A1A] text-xs">
                              {tx.purpose || tx.detail || 'Agent订阅抵扣'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums">
                            <span className="font-semibold text-[#991B1B] text-xs">
                              {tx.amountText || (tx.pointsAmountNum ? `${tx.pointsAmountNum}` : (tx.pointsAmount ? `${tx.pointsAmount}` : '-300'))}
                            </span>
                          </td>
                          <td className="p-3.5 text-[#666666] text-xs">
                            <span className="px-2 py-0.5 rounded bg-[#F5F5F5] text-[#4B5563] font-medium border border-[#EAEAEA] text-[11px]">
                              {tx.remark || tx.deductionInfo || '抵扣¥3.00'}
                            </span>
                          </td>
                          <td className="p-3.5 font-mono tabular-nums text-[#666666] text-xs">
                            {tx.balanceChangeText || (tx.pointsBalanceAfter ? `结余 ${tx.pointsBalanceAfter}分` : '-')}
                          </td>
                          <td className="p-3.5 text-right pr-6">
                            <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#166534]">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
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
      {/* 底部固定区域：每日签到按钮与连续打卡卡片（去亮黄降噪，仅图标与主按钮保留暗琥珀 #D97706） */}
      {/* ============================================================ */}
      <div className="bg-[#F9F9F8] rounded-md border border-[#EAEAEA] p-5 sm:p-6 flex flex-col md:flex-row items-center justify-between gap-5">
        
        {/* 左侧说明与7天连续签到进度 */}
        <div className="space-y-3.5 w-full md:w-auto">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-md bg-white border border-[#EAEAEA] text-[#D97706] flex items-center justify-center shrink-0">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-[#1A1A1A] flex flex-wrap items-center gap-2">
                <span>每日签到</span>
                <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-white text-[#333333] border border-[#EAEAEA] inline-flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#D97706]" />
                  <span>5积分 / 天</span>
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-white text-[#555555] border border-[#EAEAEA]">
                  连续7天额外+20积分
                </span>
              </h3>
              <p className="text-xs text-[#666666] mt-0.5">
                坚持每日打卡赚取免费积分，可用于抵扣全平台 Agent 订阅订单费用
              </p>
            </div>
          </div>

          {/* 7 天连续签到徽章日历条 */}
          <div className="flex items-center gap-1.5 sm:gap-2 pt-0.5">
            {[1, 2, 3, 4, 5, 6, 7].map(day => {
              const isChecked = day <= continuousDays;
              const isTodayTarget = day === continuousDays + (hasCheckedInToday ? 0 : 1);
              const isBonusDay = day === 7;

              return (
                <div 
                  key={day}
                  className={`px-2.5 py-1.5 rounded-md text-center border text-[11px] flex-1 sm:flex-initial min-w-[54px] transition ${
                    isChecked
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white font-semibold'
                      : isTodayTarget
                      ? 'bg-white border-[#D97706] text-[#1A1A1A] font-semibold'
                      : 'bg-white border-[#EAEAEA] text-[#999999] font-normal'
                  }`}
                >
                  <div className="text-[10px] opacity-85">第{day}天</div>
                  <div className="font-mono tabular-nums font-semibold flex items-center justify-center gap-0.5 mt-0.5">
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
            className={`w-full sm:w-auto px-6 py-2.5 rounded-md text-xs sm:text-sm font-semibold transition flex items-center justify-center gap-2 cursor-pointer ${
              hasCheckedInToday
                ? 'bg-[#EAEAEA] text-[#666666] cursor-not-allowed border border-[#D4D4D4]'
                : 'bg-[#D97706] hover:bg-[#B45309] text-white'
            }`}
          >
            {hasCheckedInToday ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-[#166534]" />
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
