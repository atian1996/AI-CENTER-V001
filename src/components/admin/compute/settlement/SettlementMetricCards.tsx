import React from 'react';
import {
  FileText,
  Clock,
  CreditCard,
  Coins,
  TrendingUp,
  Building2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface SettlementMetricCardsProps {
  totalStatements: number;
  pendingCount: number;
  confirmedCount: number;
  settledCount: number;
  totalPayable: number;
  totalRevenue: number;
  totalProfit: number;
  avgMargin: number;
}

export const SettlementMetricCards: React.FC<SettlementMetricCardsProps> = ({
  totalStatements,
  pendingCount,
  confirmedCount,
  settledCount,
  totalPayable,
  totalRevenue,
  totalProfit,
  avgMargin
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. 对账单总览 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">结算单总期数</span>
          <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-lg">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-white font-mono tracking-tight">
            {totalStatements}
          </span>
          <span className="text-xs text-slate-400">期账单</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
          <span className="text-emerald-400 font-semibold">已归档 {settledCount} 期</span>
          <span className="text-cyan-400">待打款 {confirmedCount} 期</span>
        </div>
      </div>

      {/* 2. 待核对状态 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">待核对账单 (待对账)</span>
          <div className="p-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 rounded-lg">
            <Clock className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-amber-400 font-mono tracking-tight">
            {pendingCount}
          </span>
          <span className="text-xs text-slate-400">期待财务复核</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-amber-400/90 flex items-center gap-1 text-[11px]">
            <AlertCircle className="w-3 h-3" />
            {pendingCount > 0 ? '需尽快核实卡时与协议单价' : '所有账单均已复核'}
          </span>
        </div>
      </div>

      {/* 3. 应付运营商成本 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">应付运营商总成本</span>
          <div className="p-2 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 rounded-lg">
            <CreditCard className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-100 font-mono tracking-tight">
            ¥{totalPayable.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-400 text-[11px]">
          <span>按实际 GPU 租用秒数精确核算</span>
        </div>
      </div>

      {/* 4. 平台结算毛利 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4.5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">累计结算毛利 (综合毛利率)</span>
          <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg">
            <Coins className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-emerald-400 font-mono tracking-tight">
            ¥{totalProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </span>
          <span className="text-xs text-emerald-400 font-medium font-mono">({avgMargin}%)</span>
        </div>
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 text-[11px]">
          <span>总平台流水: ¥{totalRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
        </div>
      </div>
    </div>
  );
};
