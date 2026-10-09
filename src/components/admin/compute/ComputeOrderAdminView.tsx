import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComputeOrderItem } from '../../../types';
import {
  Search,
  Filter,
  Receipt,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  PowerOff,
  Trash2,
  RotateCcw,
  Eye,
  User,
  Cpu,
  Terminal,
  Building2,
  Coins,
  Server,
  RefreshCw,
  Download,
  DollarSign,
  Activity,
  ArrowUpRight,
  Sparkles,
  Copy,
  Check,
  ChevronRight
} from 'lucide-react';
import { OrderDetailDrawer } from './order/OrderDetailDrawer';
import { OrderRefundModal } from './order/OrderRefundModal';
import { OrderBillingChangeModal } from './order/OrderBillingChangeModal';

export const ComputeOrderAdminView: React.FC = () => {
  const {
    computeOrders,
    stopComputeOrder,
    releaseComputeOrder,
    retryComputeOrder,
    refundComputeOrder,
    changeComputeOrderBilling,
    focusedComputeOrderId,
    setFocusedComputeOrderId,
    navigateToComputeInstance,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '运行中' | '已停止' | '已释放' | '创建失败' | '待支付'>('all');
  const [billingFilter, setBillingFilter] = useState<'all' | '按量计费' | '包日' | '包周' | '包月'>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');
  
  // 复制反馈状态
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // 抽屉与模态框状态
  const [selectedOrderForDrawer, setSelectedOrderForDrawer] = useState<ComputeOrderItem | null>(null);
  const [selectedOrderForRefund, setSelectedOrderForRefund] = useState<ComputeOrderItem | null>(null);
  const [selectedOrderForBilling, setSelectedOrderForBilling] = useState<ComputeOrderItem | null>(null);

  // 响应外部跳转聚焦
  useEffect(() => {
    if (focusedComputeOrderId) {
      const target = computeOrders.find(o => o.id === focusedComputeOrderId || o.orderNo === focusedComputeOrderId);
      if (target) {
        setSelectedOrderForDrawer(target);
      }
    }
  }, [focusedComputeOrderId, computeOrders]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    showToast(`已复制订单号: ${text}`);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // 统计概览
  const stats = useMemo(() => {
    const total = computeOrders.length;
    const running = computeOrders.filter(o => o.status === '运行中').length;
    const stopped = computeOrders.filter(o => o.status === '已停止').length;
    const released = computeOrders.filter(o => o.status === '已释放').length;
    const failed = computeOrders.filter(o => o.status === '创建失败').length;
    
    // 财务统计
    const totalRevenue = computeOrders.reduce((acc, o) => acc + (o.totalCost ?? o.currentCost ?? 0), 0);
    const totalPending = computeOrders.reduce((acc, o) => acc + (o.pendingAmount ?? 0), 0);
    const totalRefunded = computeOrders.reduce((acc, o) => acc + (o.refundAmount ?? 0), 0);

    return {
      total,
      running,
      stopped,
      released,
      failed,
      totalRevenue: totalRevenue.toFixed(2),
      totalPending: totalPending.toFixed(2),
      totalRefunded: totalRefunded.toFixed(2)
    };
  }, [computeOrders]);

  // 运营商选项集合
  const operators = useMemo(() => {
    const set = new Set<string>();
    computeOrders.forEach(o => {
      if (o.operator) set.add(o.operator);
    });
    return Array.from(set);
  }, [computeOrders]);

  // 筛选过滤
  const filteredOrders = useMemo(() => {
    return computeOrders.filter(order => {
      const search = searchTerm.trim().toLowerCase();
      const matchSearch =
        !search ||
        (order.orderNo || order.id).toLowerCase().includes(search) ||
        (order.userName || '').toLowerCase().includes(search) ||
        (order.userId || '').toLowerCase().includes(search) ||
        (order.userPhone || '').toLowerCase().includes(search) ||
        (order.specName || '').toLowerCase().includes(search) ||
        (order.imageName || '').toLowerCase().includes(search) ||
        (order.operator || '').toLowerCase().includes(search) ||
        (order.instanceId || '').toLowerCase().includes(search);

      const matchStatus = statusFilter === 'all' || order.status === statusFilter;
      
      const matchBilling = billingFilter === 'all' || 
        (billingFilter === '按量计费' ? (order.billingType === '按量' || order.billingType === '按量计费') :
         billingFilter === '包日' ? (order.billingType === '日租' || order.billingType === '包日') :
         billingFilter === '包周' ? (order.billingType === '周租' || order.billingType === '包周') :
         billingFilter === '包月' ? (order.billingType === '月租' || order.billingType === '包月') :
         order.billingType === billingFilter);

      const matchOperator = operatorFilter === 'all' || order.operator === operatorFilter;

      return matchSearch && matchStatus && matchBilling && matchOperator;
    });
  }, [computeOrders, searchTerm, statusFilter, billingFilter, operatorFilter]);

  const exportOrdersCSV = () => {
    const headers = ['订单号,用户昵称,用户ID,GPU规格,计费方式,订单状态,累计消费(元),退款金额(元),创建时间,关联实例'];
    const rows = filteredOrders.map(o => 
      `"${o.orderNo || o.id}","${o.userName}","${o.userId}","${o.specName}","${o.billingType}","${o.status}","${(o.totalCost ?? 0).toFixed(2)}","${(o.refundAmount ?? 0).toFixed(2)}","${o.createTime || o.createdAt}","${o.instanceId || '—'}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `算力订单财务报表_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('已生成并导出当前筛选的订单财务报表 CSV 文件');
  };

  return (
    <div className="space-y-6">
      {/* 顶部财务与运营宏观大盘 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* 卡片 1: 订单总数与活跃 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>平台实例订单总数</span>
              <span className="px-1.5 py-0.2 bg-indigo-500/10 text-indigo-400 rounded text-[10px]">全周期</span>
            </div>
            <div className="text-2xl font-bold text-white mt-1.5">
              {stats.total} <span className="text-xs font-normal text-slate-400">单</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span className="text-emerald-400 font-semibold">{stats.running} 运行中</span>
              <span>·</span>
              <span className="text-slate-400">{stats.stopped} 关机</span>
              <span>·</span>
              <span className="text-slate-500">{stats.released} 已释放</span>
            </div>
          </div>
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
            <Receipt className="w-6 h-6" />
          </div>
        </div>

        {/* 卡片 2: 累计订单结算收入 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>累计实际结算营收</span>
              <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 rounded text-[10px]">财务实收</span>
            </div>
            <div className="text-2xl font-bold text-amber-400 mt-1.5">
              ¥{stats.totalRevenue}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              包含按量扣费与各周期租金结算
            </div>
          </div>
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-xl">
            <Coins className="w-6 h-6" />
          </div>
        </div>

        {/* 卡片 3: 待结清 / 预扣冻结 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>运行中预扣 / 待结清</span>
              <span className="px-1.5 py-0.2 bg-cyan-500/10 text-cyan-400 rounded text-[10px]">动态池</span>
            </div>
            <div className="text-2xl font-bold text-cyan-400 mt-1.5">
              ¥{stats.totalPending}
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              按量计费正在消耗中的预扣资金
            </div>
          </div>
          <div className="p-3 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-xl">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* 卡片 4: 累计退款支出 */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 flex items-center justify-between shadow-sm">
          <div>
            <div className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
              <span>累计退款与补偿支出</span>
              <span className="px-1.5 py-0.2 bg-rose-500/10 text-rose-400 rounded text-[10px]">财务对账</span>
            </div>
            <div className="text-2xl font-bold text-rose-400 mt-1.5">
              ¥{stats.totalRefunded}
            </div>
            <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-2">
              <span>异常失败订单:</span>
              <span className={`font-semibold ${stats.failed > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
                {stats.failed} 单
              </span>
            </div>
          </div>
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
            <RotateCcw className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* 搜索与高级过滤栏 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* 综合搜索 */}
          <div className="relative flex-1 min-w-[280px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索订单号、用户昵称/UID/手机号、GPU规格、镜像或实例ID..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* 下拉筛选组合 */}
          <div className="flex items-center flex-wrap gap-2.5">
            {/* 计费模式筛选 */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400">计费模式:</span>
              <select
                value={billingFilter}
                onChange={e => setBillingFilter(e.target.value as any)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer"
              >
                <option value="all" className="bg-slate-800">全部模式</option>
                <option value="按量计费" className="bg-slate-800">按量计费</option>
                <option value="包日" className="bg-slate-800">包日 (日租)</option>
                <option value="包周" className="bg-slate-800">包周 (周租)</option>
                <option value="包月" className="bg-slate-800">包月 (月租)</option>
              </select>
            </div>

            {/* 运营商资源池筛选 */}
            <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs text-slate-400">资源机房:</span>
              <select
                value={operatorFilter}
                onChange={e => setOperatorFilter(e.target.value)}
                className="bg-transparent text-slate-200 text-xs font-medium focus:outline-none cursor-pointer max-w-[140px] truncate"
              >
                <option value="all" className="bg-slate-800">全部机房</option>
                {operators.map(op => (
                  <option key={op} value={op} className="bg-slate-800">{op}</option>
                ))}
              </select>
            </div>

            {/* 导出报表 */}
            <button
              onClick={exportOrdersCSV}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
              title="导出当前筛选结果为 CSV 报表"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出对账表</span>
            </button>

            {/* 重置筛选 */}
            {(searchTerm || statusFilter !== 'all' || billingFilter !== 'all' || operatorFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setBillingFilter('all');
                  setOperatorFilter('all');
                  setFocusedComputeOrderId(null);
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1"
              >
                重置筛选
              </button>
            )}
          </div>
        </div>

        {/* 状态快捷标签栏 */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80 overflow-x-auto text-xs">
          <span className="text-slate-400 shrink-0">状态过滤:</span>
          {[
            { key: 'all', label: '全部订单', count: stats.total },
            { key: '运行中', label: '运行中', count: stats.running, activeClass: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
            { key: '已停止', label: '已关机 (停止)', count: stats.stopped, activeClass: 'text-slate-300 bg-slate-700/50 border-slate-600' },
            { key: '已释放', label: '已释放销毁', count: stats.released, activeClass: 'text-slate-400 bg-slate-800 border-slate-700' },
            { key: '待支付', label: '待支付', count: computeOrders.filter(o => o.status === '待支付').length, activeClass: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
            { key: '创建失败', label: '调度失败', count: stats.failed, activeClass: 'text-rose-400 bg-rose-500/10 border-rose-500/30' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setStatusFilter(tab.key as any)}
              className={`px-3 py-1 rounded-lg border text-xs transition-all shrink-0 flex items-center gap-1.5 ${
                statusFilter === tab.key
                  ? (tab.activeClass || 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 font-bold')
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-900 text-slate-400 font-mono">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 订单列表表格（高分辨率专业级财务/运维视图） */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300 border-collapse">
            <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-800 text-[11px] uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">订单号</th>
                <th className="py-3 px-4">用户</th>
                <th className="py-3 px-4">规格与硬件</th>
                <th className="py-3 px-4">镜像环境</th>
                <th className="py-3 px-4">计费模式 & 单价</th>
                <th className="py-3 px-4 text-right">消费金额 (¥)</th>
                <th className="py-3 px-3 text-center">状态</th>
                <th className="py-3 px-4">创建与生命周期</th>
                <th className="py-3 px-4">关联实例 & 机房</th>
                <th className="py-3 px-4 text-center">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order) => {
                  const isFocused = focusedComputeOrderId === order.id || focusedComputeOrderId === order.orderNo;
                  return (
                    <tr
                      key={order.id}
                      className={`hover:bg-slate-800/40 transition-colors ${
                        isFocused ? 'bg-indigo-950/30 border-l-4 border-l-indigo-500' : ''
                      }`}
                    >
                      {/* 1. 订单号 */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedOrderForDrawer(order)}
                            className="font-mono text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:underline transition-colors"
                          >
                            {order.orderNo || order.id}
                          </button>
                          <button
                            onClick={() => handleCopy(order.orderNo || order.id, order.id)}
                            className="text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
                            title="复制订单号"
                          >
                            {copiedId === order.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          ID: {order.id}
                        </div>
                      </td>

                      {/* 2. 用户 */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={order.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&auto=format&fit=crop&q=80'}
                            alt="avatar"
                            className="w-7 h-7 rounded-full border border-slate-700 object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-semibold text-slate-200 truncate max-w-[110px]" title={order.userName}>
                              {order.userName}
                            </div>
                            <div className="text-[10px] text-slate-400 font-mono truncate max-w-[110px]">
                              {order.userPhone || order.userId}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. 规格与硬件 */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-200 flex items-center gap-1">
                          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                          <span>{order.specName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5 max-w-[160px] truncate" title={order.specDetail || '24GB显存 / 16核 / 60GB内存'}>
                          {order.specDetail || '24GB显存 · 16 vCPU · 60GB'}
                        </div>
                      </td>

                      {/* 4. 镜像环境 */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1 text-slate-300 font-medium">
                          <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="truncate max-w-[130px]" title={order.imageName}>{order.imageName}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">官方深度学习套件</div>
                      </td>

                      {/* 5. 计费模式 & 单价 */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                            order.billingType.includes('量') ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
                            order.billingType.includes('月') ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30' :
                            'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                          }`}>
                            {order.billingType}
                          </span>
                          {order.billingChanges && order.billingChanges.length > 0 && (
                            <span className="px-1 py-0.2 bg-purple-500/20 text-purple-300 rounded text-[9px]" title="该订单发生过计费模式变更">
                              已变更
                            </span>
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {order.unitPriceLabel || `¥${order.unitPrice || '1.88'}/时`}
                        </div>
                      </td>

                      {/* 6. 消费金额 (¥) */}
                      <td className="py-3 px-4 text-right font-mono">
                        <div className="text-sm font-bold text-amber-400">
                          ¥{(order.totalCost ?? order.currentCost ?? 0).toFixed(2)}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          预付: ¥{(order.orderAmount ?? 0).toFixed(2)}
                          {order.refundAmount ? (
                            <span className="text-rose-400 ml-1">· 退¥{order.refundAmount.toFixed(2)}</span>
                          ) : null}
                        </div>
                      </td>

                      {/* 7. 状态 */}
                      <td className="py-3 px-3 text-center">
                        {order.status === '运行中' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            运行中
                          </span>
                        )}
                        {order.status === '已停止' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-800 text-slate-300 border border-slate-700 rounded-full text-[11px] font-semibold">
                            已停止
                          </span>
                        )}
                        {order.status === '已释放' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 rounded-full text-[11px]">
                            已释放
                          </span>
                        )}
                        {order.status === '待支付' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-[11px] font-semibold">
                            待支付
                          </span>
                        )}
                        {order.status === '创建失败' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-[11px] font-semibold">
                            调度失败
                          </span>
                        )}
                      </td>

                      {/* 8. 创建与生命周期 */}
                      <td className="py-3 px-4">
                        <div className="text-[11px] text-slate-300 font-mono">
                          {order.createTime || order.createdAt}
                        </div>
                        <div className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3 text-slate-400" />
                          <span>时长: {order.runningDuration || order.runningHours || '—'}</span>
                        </div>
                      </td>

                      {/* 9. 关联实例 & 机房 */}
                      <td className="py-3 px-4">
                        <div className="text-[11px] text-slate-300 truncate max-w-[130px]" title={order.operator}>
                          {order.operator}
                        </div>
                        {order.instanceId && order.status !== '已释放' ? (
                          <button
                            onClick={() => navigateToComputeInstance(order.instanceId!)}
                            className="text-[10px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-0.5 hover:underline mt-0.5 font-semibold"
                            title="点击直接跳转至运维监控页面对应实例"
                          >
                            <span>{order.instanceId}</span>
                            <ArrowUpRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">
                            {order.status === '已释放' ? '已回收销毁' : (order.instanceId || '未分配')}
                          </span>
                        )}
                      </td>

                      {/* 10. 操作栏 */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* 查看详情 */}
                          <button
                            onClick={() => setSelectedOrderForDrawer(order)}
                            className="p-1.5 bg-slate-800 hover:bg-indigo-600 hover:text-white text-slate-300 rounded-lg transition-colors"
                            title="查看订单详情与扣费明细"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {/* 财务退款 */}
                          <button
                            onClick={() => setSelectedOrderForRefund(order)}
                            className="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg transition-colors"
                            title="退款与扣费核算"
                          >
                            <DollarSign className="w-3.5 h-3.5" />
                          </button>

                          {/* 运行中：停止/释放 */}
                          {order.status === '运行中' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`确定要强制停止订单 ${order.orderNo || order.id} 对应实例运行吗？`)) {
                                  stopComputeOrder(order.id);
                                }
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-amber-600 hover:text-white text-amber-400 rounded-lg transition-colors"
                              title="强制关机停机"
                            >
                              <PowerOff className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 已停止：释放 */}
                          {order.status === '已停止' && (
                            <button
                              onClick={() => {
                                if (window.confirm(`确定要彻底释放并销毁订单 ${order.orderNo || order.id} 实例资源吗？`)) {
                                  releaseComputeOrder(order.id);
                                }
                              }}
                              className="p-1.5 bg-slate-800 hover:bg-rose-600 hover:text-white text-rose-400 rounded-lg transition-colors"
                              title="彻底释放销毁资源"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}

                          {/* 创建失败：重试调度 */}
                          {order.status === '创建失败' && (
                            <button
                              onClick={() => retryComputeOrder(order.id)}
                              className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
                              title="重新调度分配"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="py-16 text-center text-slate-400">
                    <div className="max-w-xs mx-auto space-y-2">
                      <Receipt className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs">未找到符合当前筛选条件的算力订单</p>
                      <button
                        onClick={() => {
                          setSearchTerm('');
                          setStatusFilter('all');
                          setBillingFilter('all');
                          setOperatorFilter('all');
                        }}
                        className="text-xs text-indigo-400 hover:underline font-medium"
                      >
                        清空所有筛选条件
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 订单详情抽屉 */}
      {selectedOrderForDrawer && (
        <OrderDetailDrawer
          order={selectedOrderForDrawer}
          onClose={() => {
            setSelectedOrderForDrawer(null);
            setFocusedComputeOrderId(null);
          }}
          onNavigateToInstance={(instanceId) => {
            setSelectedOrderForDrawer(null);
            navigateToComputeInstance(instanceId);
          }}
          onOpenRefund={(order) => setSelectedOrderForRefund(order)}
          onOpenBillingChange={(order) => setSelectedOrderForBilling(order)}
          onStopOrder={(id) => stopComputeOrder(id)}
          onReleaseOrder={(id) => releaseComputeOrder(id)}
          onRetryOrder={(id) => retryComputeOrder(id)}
        />
      )}

      {/* 财务退款核算模态框 */}
      {selectedOrderForRefund && (
        <OrderRefundModal
          order={selectedOrderForRefund}
          onClose={() => setSelectedOrderForRefund(null)}
          onConfirmRefund={(orderId, amount, reason) => {
            refundComputeOrder(orderId, amount, reason);
            // 重新刷新详情抽屉中的订单
            const updated = computeOrders.find(o => o.id === orderId);
            if (updated && selectedOrderForDrawer?.id === orderId) {
              setSelectedOrderForDrawer(updated);
            }
          }}
        />
      )}

      {/* 计费模式调整模态框 */}
      {selectedOrderForBilling && (
        <OrderBillingChangeModal
          order={selectedOrderForBilling}
          onClose={() => setSelectedOrderForBilling(null)}
          onConfirmChange={(orderId, newType, reason) => {
            changeComputeOrderBilling(orderId, newType, reason);
            const updated = computeOrders.find(o => o.id === orderId);
            if (updated && selectedOrderForDrawer?.id === orderId) {
              setSelectedOrderForDrawer(updated);
            }
          }}
        />
      )}
    </div>
  );
};
