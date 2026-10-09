import React, { useState } from 'react';
import { ComputeOrderItem } from '../../../../types';
import {
  X,
  Receipt,
  User,
  Cpu,
  Terminal,
  Server,
  Clock,
  Coins,
  History,
  Activity,
  AlertTriangle,
  ArrowRight,
  Download,
  RotateCcw,
  CheckCircle2,
  DollarSign,
  FileText,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface OrderDetailDrawerProps {
  order: ComputeOrderItem | null;
  onClose: () => void;
  onNavigateToInstance: (instanceId: string) => void;
  onOpenRefund: (order: ComputeOrderItem) => void;
  onOpenBillingChange: (order: ComputeOrderItem) => void;
  onStopOrder: (orderId: string) => void;
  onReleaseOrder: (orderId: string) => void;
  onRetryOrder: (orderId: string) => void;
}

export const OrderDetailDrawer: React.FC<OrderDetailDrawerProps> = ({
  order,
  onClose,
  onNavigateToInstance,
  onOpenRefund,
  onOpenBillingChange,
  onStopOrder,
  onReleaseOrder,
  onRetryOrder
}) => {
  const [activeTab, setActiveTab] = useState<'info' | 'billing' | 'changes' | 'timeline' | 'refund'>('info');

  if (!order) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case '运行中':
        return <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 rounded-full text-xs font-semibold"><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />运行中</span>;
      case '已停止':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-700/50 text-slate-300 border border-slate-600 rounded-full text-xs font-semibold">已关机 (停止)</span>;
      case '已释放':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-slate-800 text-slate-400 border border-slate-700/80 rounded-full text-xs font-semibold">已释放销毁</span>;
      case '待支付':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/30 rounded-full text-xs font-semibold">待用户支付</span>;
      case '创建失败':
        return <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/30 rounded-full text-xs font-semibold">调度创建失败</span>;
      default:
        return <span className="inline-flex items-center px-3 py-1 bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 rounded-full text-xs font-semibold">{status}</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-5 bg-slate-900/95 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-base font-bold text-white tracking-wide">
                  订单详情 · <span className="font-mono text-indigo-300">{order.orderNo || order.id}</span>
                </h3>
                {getStatusBadge(order.status)}
              </div>
              <div className="text-xs text-slate-400 mt-0.5 flex items-center gap-3">
                <span>创建时间: {order.createTime || order.createdAt}</span>
                {order.instanceId && (
                  <span className="flex items-center gap-1">
                    关联实例:
                    <button
                      onClick={() => onNavigateToInstance(order.instanceId!)}
                      className="font-mono text-cyan-400 hover:text-cyan-300 underline font-medium"
                    >
                      {order.instanceId}
                    </button>
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {order.instanceId && order.status === '运行中' && (
              <button
                onClick={() => onNavigateToInstance(order.instanceId!)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-lg text-xs font-medium transition-all"
                title="直达运行实例监控页面"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>实时监控</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-800 bg-slate-900/60 overflow-x-auto">
          {[
            { id: 'info', label: '基本与配置', count: undefined },
            { id: 'billing', label: '财务与扣费明细', count: order.billingLogs?.length },
            { id: 'changes', label: '计费变更记录', count: order.billingChanges?.length },
            { id: 'timeline', label: '生命周期轨迹', count: order.timeline?.length },
            { id: 'refund', label: '退款与核算', count: order.refundLogs?.length }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`py-3.5 px-3 border-b-2 text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{tab.label}</span>
              {typeof tab.count === 'number' && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  activeTab === tab.id ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: 基础与硬件配置 */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* 核心财务卡片 */}
              <div className="grid grid-cols-3 gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">累计实际扣费</div>
                  <div className="text-xl font-bold text-amber-400 mt-1">¥{(order.totalCost ?? order.currentCost ?? 0).toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">单价: {order.unitPriceLabel || `¥${order.unitPrice || '1.88'}/时`}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">预付 / 冻结金额</div>
                  <div className="text-xl font-bold text-slate-200 mt-1">¥{(order.orderAmount ?? 0).toFixed(2)}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">待结清: ¥{(order.pendingAmount ?? 0).toFixed(2)}</div>
                </div>
                <div>
                  <div className="text-[11px] text-slate-400 font-medium">已累计退款</div>
                  <div className={`text-xl font-bold mt-1 ${order.refundAmount ? 'text-rose-400' : 'text-slate-400'}`}>
                    ¥{(order.refundAmount ?? 0).toFixed(2)}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">运行时长: {order.runningDuration || order.runningHours || '—'}</div>
                </div>
              </div>

              {/* 用户信息 */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200 mb-3">
                  <User className="w-4 h-4 text-indigo-400" />
                  <span>下单用户信息</span>
                </div>
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="flex items-center gap-3">
                    <img 
                      src={order.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'} 
                      alt="avatar" 
                      className="w-10 h-10 rounded-full border border-slate-700" 
                    />
                    <div>
                      <div className="font-semibold text-slate-200">{order.userName}</div>
                      <div className="text-slate-400 text-[11px] font-mono">UID: {order.userId}</div>
                    </div>
                  </div>
                  <div className="space-y-1 text-slate-400">
                    <div>联系电话: <span className="text-slate-300 font-mono">{order.userPhone || '138****0000'}</span></div>
                    <div>用户属性: <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded text-[10px]">开发者认证</span></div>
                  </div>
                </div>
              </div>

              {/* 规格与硬件配置 */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>GPU算力规格与硬件配置</span>
                </div>
                <div className="grid grid-cols-2 gap-y-2.5 gap-x-4 text-xs">
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">规格名称:</span>
                    <span className="font-semibold text-slate-200">{order.specName}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">计费模式:</span>
                    <span className="font-semibold text-indigo-300">{order.billingType}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">硬件参数:</span>
                    <span className="text-slate-300 text-right">{order.specDetail || '24GB显存 / 16核 / 60GB内存 / 750GB硬盘'}</span>
                  </div>
                  <div className="flex justify-between py-1.5 border-b border-slate-800/50">
                    <span className="text-slate-400">资源池 / 机房:</span>
                    <span className="text-slate-300 text-right">{order.operator}</span>
                  </div>
                </div>
              </div>

              {/* 镜像与软件环境 */}
              <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-200">
                  <Terminal className="w-4 h-4 text-emerald-400" />
                  <span>部署镜像与运行环境</span>
                </div>
                <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-200">{order.imageName}</div>
                    <div className="text-slate-400 text-[11px] mt-0.5">预置 CUDA 驱动、PyTorch / 深度学习框架及常用加速库</div>
                  </div>
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded text-[10px]">官方已验证</span>
                </div>
              </div>

              {/* 异常信息（如有） */}
              {order.errorMessage && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-400 mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>调度/执行异常原因</span>
                  </div>
                  <div className="text-xs text-rose-300 leading-relaxed font-mono mt-1">
                    {order.errorMessage}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: 财务扣费流水 */}
          {activeTab === 'billing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  共计 <span className="text-slate-200 font-bold">{order.billingLogs?.length || 0}</span> 笔实时扣费流水与变动记录
                </div>
                <button
                  onClick={() => alert('已导出当前订单扣费对账单 CSV 文件')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg text-xs transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>导出明细</span>
                </button>
              </div>

              {order.billingLogs && order.billingLogs.length > 0 ? (
                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-left text-xs text-slate-300">
                    <thead className="bg-slate-800/60 text-slate-400 border-b border-slate-800 text-[11px]">
                      <tr>
                        <th className="py-2.5 px-3.5">变动时间</th>
                        <th className="py-2.5 px-3">类型</th>
                        <th className="py-2.5 px-3 text-right">金额 (¥)</th>
                        <th className="py-2.5 px-3 text-right">结余 (¥)</th>
                        <th className="py-2.5 px-3.5">说明备注</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50 font-mono text-[11px]">
                      {order.billingLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="py-2.5 px-3.5 text-slate-400">{log.time}</td>
                          <td className="py-2.5 px-3 font-sans">
                            <span className={`px-2 py-0.5 rounded text-[10px] ${
                              log.type === '预扣冻结' ? 'bg-indigo-500/10 text-indigo-400' :
                              log.type === '按量扣费' ? 'bg-amber-500/10 text-amber-400' :
                              log.type === '退款返还' ? 'bg-emerald-500/10 text-emerald-400' :
                              'bg-slate-800 text-slate-300'
                            }`}>
                              {log.type}
                            </span>
                          </td>
                          <td className={`py-2.5 px-3 text-right font-bold ${log.amount < 0 ? 'text-emerald-400' : 'text-slate-200'}`}>
                            {log.amount > 0 ? `+${log.amount.toFixed(2)}` : log.amount.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3 text-right text-slate-400">
                            ¥{log.balanceAfter.toFixed(2)}
                          </td>
                          <td className="py-2.5 px-3.5 font-sans text-slate-400 truncate max-w-[200px]" title={log.note}>
                            {log.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/20 border border-slate-800/60 rounded-xl">
                  暂无实时扣费流水
                </div>
              )}
            </div>
          )}

          {/* TAB 3: 计费变更记录 */}
          {activeTab === 'changes' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-slate-400">
                  计费方式变更历史（如按量转包月、周期升级调整）
                </div>
                <button
                  onClick={() => onOpenBillingChange(order)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors"
                >
                  <Coins className="w-3.5 h-3.5" />
                  <span>调整当前计费模式</span>
                </button>
              </div>

              {order.billingChanges && order.billingChanges.length > 0 ? (
                <div className="space-y-3">
                  {order.billingChanges.map((change) => (
                    <div key={change.id} className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-800 text-slate-400 rounded text-[11px]">{change.oldBillingType}</span>
                          <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 font-bold rounded text-[11px]">{change.newBillingType}</span>
                        </div>
                        <span className="text-slate-400 font-mono text-[11px]">{change.changeTime}</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">变更原因: {change.reason}</div>
                      <div className="text-slate-400 text-[10px]">操作人: {change.operator}</div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/20 border border-slate-800/60 rounded-xl">
                  该订单自创建起未变更过计费模式
                </div>
              )}
            </div>
          )}

          {/* TAB 4: 生命周期轨迹 */}
          {activeTab === 'timeline' && (
            <div className="space-y-4">
              <div className="text-xs text-slate-400">
                订单生命周期审计时间线（从下单、调度、就绪、运行到关机释放）
              </div>

              {order.timeline && order.timeline.length > 0 ? (
                <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
                  {order.timeline.map((item, idx) => (
                    <div key={idx} className="relative group">
                      <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-slate-900 border-2 border-indigo-500 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                      </div>
                      <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3.5 text-xs space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-200">{item.title}</span>
                          <span className="text-slate-400 font-mono text-[11px]">{item.time}</span>
                        </div>
                        <p className="text-slate-400 text-[11px] leading-relaxed">{item.description}</p>
                        {item.operator && (
                          <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800/40">
                            执行主体: {item.operator}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/20 border border-slate-800/60 rounded-xl">
                  暂无时间线记录
                </div>
              )}
            </div>
          )}

          {/* TAB 5: 退款与核算 */}
          {activeTab === 'refund' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-950/60 border border-slate-800 rounded-xl">
                <div>
                  <div className="text-xs text-slate-400">已退款总金额</div>
                  <div className="text-xl font-bold text-rose-400 mt-1">¥{(order.refundAmount ?? 0).toFixed(2)}</div>
                </div>
                <button
                  onClick={() => onOpenRefund(order)}
                  className="flex items-center gap-1.5 px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>发起财务退款核算</span>
                </button>
              </div>

              {order.refundLogs && order.refundLogs.length > 0 ? (
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-300">退款记录流水</div>
                  {order.refundLogs.map((rf) => (
                    <div key={rf.id} className="p-4 bg-slate-950/40 border border-slate-800 rounded-xl text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-rose-400">退款金额: ¥{rf.amount.toFixed(2)}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{rf.time}</span>
                      </div>
                      <div className="text-slate-300 text-[11px]">原因: {rf.reason}</div>
                      <div className="flex items-center justify-between text-slate-400 text-[10px] pt-1 border-t border-slate-800/50">
                        <span>经办人: {rf.operator}</span>
                        <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded">{rf.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-950/20 border border-slate-800/60 rounded-xl">
                  该订单暂无退款历史
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer 快速操作 */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onOpenRefund(order)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-rose-400 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              退款核算
            </button>
            <button
              onClick={() => onOpenBillingChange(order)}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 rounded-lg text-xs font-medium transition-colors"
            >
              变更计费
            </button>
          </div>

          <div className="flex items-center gap-2">
            {order.status === '运行中' && (
              <>
                <button
                  onClick={() => onStopOrder(order.id)}
                  className="px-3.5 py-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  强制停机关机
                </button>
                <button
                  onClick={() => onReleaseOrder(order.id)}
                  className="px-3.5 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 rounded-lg text-xs font-semibold transition-colors"
                >
                  强制释放销毁
                </button>
              </>
            )}

            {order.status === '已停止' && (
              <button
                onClick={() => onReleaseOrder(order.id)}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold transition-colors"
              >
                彻底释放资源
              </button>
            )}

            {order.status === '创建失败' && (
              <button
                onClick={() => onRetryOrder(order.id)}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>重新分配调度</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
