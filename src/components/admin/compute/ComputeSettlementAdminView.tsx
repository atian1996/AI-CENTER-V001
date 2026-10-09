import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { ComputeSettlementItem } from '../../../types';
import { SettlementMetricCards } from './settlement/SettlementMetricCards';
import { SettlementDetailModal } from './settlement/SettlementDetailModal';
import { SettlementPaymentModal } from './settlement/SettlementPaymentModal';
import { SettlementGenerateModal } from './settlement/SettlementGenerateModal';
import {
  FileText,
  Search,
  Plus,
  CheckCircle2,
  Clock,
  Coins,
  Building2,
  CreditCard,
  Check,
  X,
  Eye,
  Calendar,
  Layers,
  ArrowUpRight,
  Receipt,
  Download,
  Filter,
  ShieldCheck,
  FileCheck,
  HelpCircle
} from 'lucide-react';

export const ComputeSettlementAdminView: React.FC = () => {
  const {
    computeSettlements,
    confirmComputeSettlement,
    markComputeSettlementPaid,
    generateComputeSettlement,
    computePools,
    showToast
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | '待对账' | '已确认' | '已结算'>('all');
  const [operatorFilter, setOperatorFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<string>('all');

  // Modals
  const [generateModalOpen, setGenerateModalOpen] = useState(false);
  const [detailSettlement, setDetailSettlement] = useState<ComputeSettlementItem | null>(null);
  const [paymentModalSettlement, setPaymentModalSettlement] = useState<ComputeSettlementItem | null>(null);

  // 提取账期选项
  const periodOptions = useMemo(() => {
    return Array.from(new Set(computeSettlements.map(s => s.period)));
  }, [computeSettlements]);

  // 提取运营商选项
  const operatorOptions = useMemo(() => {
    return Array.from(new Set(computeSettlements.map(s => s.operator)));
  }, [computeSettlements]);

  // 统计概览
  const stats = useMemo(() => {
    const totalStatements = computeSettlements.length;
    const pendingCount = computeSettlements.filter(s => s.status === '待对账').length;
    const confirmedCount = computeSettlements.filter(s => s.status === '已确认').length;
    const settledCount = computeSettlements.filter(s => s.status === '已结算').length;

    const totalPayable = computeSettlements.reduce((acc, s) => acc + (s.payableAmount ?? 0), 0);
    const totalRevenue = computeSettlements.reduce((acc, s) => acc + (s.platformRevenue ?? 0), 0);
    const totalProfit = computeSettlements.reduce((acc, s) => acc + (s.platformGrossProfit ?? 0), 0);
    const avgMargin = totalRevenue > 0 ? Number(((totalProfit / totalRevenue) * 100).toFixed(1)) : 24.5;

    return {
      totalStatements,
      pendingCount,
      confirmedCount,
      settledCount,
      totalPayable,
      totalRevenue,
      totalProfit,
      avgMargin
    };
  }, [computeSettlements]);

  // 筛选结算单列表
  const filteredSettlements = useMemo(() => {
    return computeSettlements.filter(s => {
      // 搜索匹配 (单号、运营商、发票号、凭证号)
      if (searchTerm.trim()) {
        const q = searchTerm.trim().toLowerCase();
        const matchId = s.id.toLowerCase().includes(q);
        const matchNo = s.statementNo ? s.statementNo.toLowerCase().includes(q) : false;
        const matchOp = s.operator.toLowerCase().includes(q);
        const matchInv = s.invoiceNo ? s.invoiceNo.toLowerCase().includes(q) : false;
        const matchVou = s.paymentVoucher ? s.paymentVoucher.toLowerCase().includes(q) : false;
        if (!matchId && !matchNo && !matchOp && !matchInv && !matchVou) return false;
      }

      // 状态筛选
      if (statusFilter !== 'all' && s.status !== statusFilter) return false;

      // 运营商筛选
      if (operatorFilter !== 'all' && s.operator !== operatorFilter) return false;

      // 账期筛选
      if (periodFilter !== 'all' && s.period !== periodFilter) return false;

      return true;
    });
  }, [computeSettlements, searchTerm, statusFilter, operatorFilter, periodFilter]);

  // 批量导出 CSV
  const handleExportAllCSV = () => {
    const headers = [
      '对账单号',
      '运营商',
      '结算账期',
      '总消耗卡时',
      '协议均价(元/h)',
      '应付运营商金额(元)',
      '平台前台营收(元)',
      '平台毛利(元)',
      '毛利率(%)',
      '对账状态',
      '发票号',
      '打款凭证',
      '确认时间',
      '结算时间'
    ];

    const rows = filteredSettlements.map(s => [
      s.statementNo || s.id,
      s.operator,
      s.period,
      s.totalCardHours,
      s.agreedPrice.toFixed(2),
      s.payableAmount.toFixed(2),
      s.platformRevenue.toFixed(2),
      s.platformGrossProfit.toFixed(2),
      s.grossMargin,
      s.status,
      s.invoiceNo || '-',
      s.paymentVoucher || '-',
      s.confirmedAt || '-',
      s.settledAt || '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `对账结算单汇总_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 顶部核心指标看板 */}
      <SettlementMetricCards
        totalStatements={stats.totalStatements}
        pendingCount={stats.pendingCount}
        confirmedCount={stats.confirmedCount}
        settledCount={stats.settledCount}
        totalPayable={stats.totalPayable}
        totalRevenue={stats.totalRevenue}
        totalProfit={stats.totalProfit}
        avgMargin={stats.avgMargin}
      />

      {/* 搜索、筛选与操作栏 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[320px]">
          {/* 搜索框 */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索单号 / 运营商 / 发票号 / 付款凭证..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* 状态筛选 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">状态:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">全部状态</option>
              <option value="待对账">待对账 (核对中)</option>
              <option value="已确认">已确认 (待打款)</option>
              <option value="已结算">已结算 (已打款)</option>
            </select>
          </div>

          {/* 运营商筛选 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">运营商:</span>
            <select
              value={operatorFilter}
              onChange={e => setOperatorFilter(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">全部运营商</option>
              {operatorOptions.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          {/* 账期筛选 */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium">账期:</span>
            <select
              value={periodFilter}
              onChange={e => setPeriodFilter(e.target.value)}
              className="bg-slate-950/80 border border-slate-800 text-slate-200 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:border-indigo-500 font-mono"
            >
              <option value="all">全部账期</option>
              {periodOptions.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 右侧动作 */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handleExportAllCSV}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>导出报表</span>
          </button>

          <button
            onClick={() => setGenerateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white rounded-lg text-xs font-semibold shadow-md shadow-indigo-500/20 transition cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>生成周期对账单</span>
          </button>
        </div>
      </div>

      {/* 对账单列表 Table */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800 tracking-wider">
                <th className="py-3 px-4">对账单号</th>
                <th className="py-3 px-4">运营商 & 账期</th>
                <th className="py-3 px-3 text-center">实际消耗卡时</th>
                <th className="py-3 px-3 text-right">协议均价</th>
                <th className="py-3 px-4 text-right">应付成本 (元)</th>
                <th className="py-3 px-4 text-right">平台营收与毛利</th>
                <th className="py-3 px-3 text-center">对账状态</th>
                <th className="py-3 px-4">发票 / 打款凭证</th>
                <th className="py-3 px-4 text-right">操作管理</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-xs font-sans">
              {filteredSettlements.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                    未检索到符合条件的对账单记录
                  </td>
                </tr>
              ) : (
                filteredSettlements.map(stl => (
                  <tr key={stl.id} className="hover:bg-slate-800/30 transition-colors">
                    {/* 单号 */}
                    <td className="py-3.5 px-4 font-mono font-bold text-indigo-300">
                      <div>{stl.statementNo || stl.id}</div>
                      <div className="text-[10px] text-slate-500 font-normal mt-0.5">{stl.createdAt?.slice(0, 10)}</div>
                    </td>

                    {/* 运营商与账期 */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{stl.operator}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-indigo-300 font-mono mt-0.5">
                        <Calendar className="w-3 h-3 text-slate-400" />
                        <span>账期: {stl.period}</span>
                      </div>
                    </td>

                    {/* 总消耗卡时 */}
                    <td className="py-3.5 px-3 text-center font-mono text-slate-200">
                      <span className="font-semibold">{stl.totalCardHours.toLocaleString()}</span>
                      <span className="text-[10px] text-slate-400 ml-1">hrs</span>
                    </td>

                    {/* 协议均价 */}
                    <td className="py-3.5 px-3 text-right font-mono text-slate-300">
                      ¥{stl.agreedPrice.toFixed(2)}/h
                    </td>

                    {/* 应付运营商 (成本) */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="text-xs font-bold text-slate-100">
                        ¥{stl.payableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>

                    {/* 平台营收与毛利 */}
                    <td className="py-3.5 px-4 text-right font-mono">
                      <div className="text-emerald-400 font-medium text-xs">
                        收 ¥{stl.platformRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                      <div className="text-[11px] text-indigo-300 mt-0.5">
                        利 ¥{stl.platformGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({stl.grossMargin}%)
                      </div>
                    </td>

                    {/* 对账状态 */}
                    <td className="py-3.5 px-3 text-center">
                      {stl.status === '待对账' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 border border-amber-500/20 text-amber-400">
                          <Clock className="w-3 h-3" />
                          待对账
                        </span>
                      )}
                      {stl.status === '已确认' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                          <Check className="w-3 h-3" />
                          已确认 (待打款)
                        </span>
                      )}
                      {stl.status === '已结算' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" />
                          已结算归档
                        </span>
                      )}
                    </td>

                    {/* 发票与打款凭证 */}
                    <td className="py-3.5 px-4 text-[11px] font-mono">
                      {stl.invoiceNo ? (
                        <div className="space-y-0.5">
                          <div className="text-slate-200 font-medium">{stl.invoiceNo}</div>
                          {stl.paymentVoucher && (
                            <div className="text-emerald-400/90 text-[10px]">{stl.paymentVoucher}</div>
                          )}
                        </div>
                      ) : (
                        <span className="text-slate-600 font-sans">待登记发票</span>
                      )}
                    </td>

                    {/* 操作按钮 */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setDetailSettlement(stl)}
                          className="px-2.5 py-1 text-xs bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-slate-400" />
                          <span>明细</span>
                        </button>

                        {stl.status === '待对账' && (
                          <button
                            onClick={() => confirmComputeSettlement(stl.id)}
                            className="px-2.5 py-1 text-xs bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 rounded-lg transition-colors font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>确认核对</span>
                          </button>
                        )}

                        {stl.status === '已确认' && (
                          <button
                            onClick={() => setPaymentModalSettlement(stl)}
                            className="px-2.5 py-1 text-xs bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 rounded-lg transition-colors font-semibold cursor-pointer flex items-center gap-1"
                          >
                            <FileCheck className="w-3 h-3" />
                            <span>打款结算</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 生成对账单弹窗 */}
      {generateModalOpen && (
        <SettlementGenerateModal
          pools={computePools}
          onClose={() => setGenerateModalOpen(false)}
          onGenerate={generateComputeSettlement}
        />
      )}

      {/* 查看明细弹窗 */}
      {detailSettlement && (
        <SettlementDetailModal
          settlement={detailSettlement}
          onClose={() => setDetailSettlement(null)}
        />
      )}

      {/* 结算付款与发票登记弹窗 */}
      {paymentModalSettlement && (
        <SettlementPaymentModal
          settlement={paymentModalSettlement}
          onClose={() => setPaymentModalSettlement(null)}
          onConfirmPaid={(id, invoiceNo, paymentVoucher, paymentMethod, remark) => {
            markComputeSettlementPaid(id, invoiceNo, paymentVoucher, paymentMethod, remark);
            setPaymentModalSettlement(null);
          }}
        />
      )}
    </div>
  );
};
