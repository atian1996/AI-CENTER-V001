import React, { useState } from 'react';
import {
  Layers,
  Cpu,
  Download,
  ArrowUpDown,
  TrendingUp,
  Percent,
  CheckCircle2
} from 'lucide-react';
import { ComputeSpecUsageDetail } from '../../../../types';

interface SpecUsageTableProps {
  data: ComputeSpecUsageDetail[];
}

export const SpecUsageTable: React.FC<SpecUsageTableProps> = ({ data }) => {
  const [sortBy, setSortBy] = useState<'totalRevenue' | 'totalHours' | 'totalInstances' | 'runningInstances' | 'utilizationRate'>('totalRevenue');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortBy] || 0;
    const valB = b[sortBy] || 0;
    return sortOrder === 'desc' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
  });

  const toggleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['规格名称', 'GPU型号', '显存大小', '按量单价(元/时)', '累计实例数', '运行中实例', '累计时长(卡时)', '总创收流水(元)', '利用率(%)'];
    const rows = sortedData.map(s => [
      s.specName,
      s.gpuModel,
      s.memory || '-',
      s.unitPrice.toFixed(2),
      s.totalInstances,
      s.runningInstances,
      s.totalHours,
      s.totalRevenue.toFixed(2),
      s.utilizationRate
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GPU规格用量明细_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* 头部 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            <span>GPU 规格用量与创收产出分析表</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            按 GPU 算力型号统计总实例数、在线运行量、累计产出卡时、流水创收与综合利用率
          </p>
        </div>

        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>导出规格报表</span>
        </button>
      </div>

      {/* 表格 */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="py-3 px-4">规格名称 / GPU芯片</th>
                <th className="py-3 px-3">按量单价</th>
                <th
                  onClick={() => toggleSort('totalInstances')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center gap-1">
                    <span>累计实例</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('runningInstances')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center gap-1">
                    <span>当前运行</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('totalHours')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center gap-1">
                    <span>累计卡时</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('totalRevenue')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>总流水营收</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('utilizationRate')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>综合利用率</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {sortedData.map((spec) => (
                <tr key={spec.specId} className="hover:bg-slate-800/30 transition-colors">
                  {/* 规格名 */}
                  <td className="py-3 px-4 font-sans">
                    <div className="font-semibold text-slate-200">{spec.specName}</div>
                    <div className="text-[11px] text-slate-400 font-mono mt-0.5 flex items-center gap-2">
                      <span>{spec.gpuModel}</span>
                      {spec.memory && (
                        <>
                          <span>·</span>
                          <span className="text-cyan-400">{spec.memory}</span>
                        </>
                      )}
                    </div>
                  </td>

                  {/* 单价 */}
                  <td className="py-3 px-3 text-slate-300">
                    ¥{spec.unitPrice.toFixed(2)}/h
                  </td>

                  {/* 累计实例 */}
                  <td className="py-3 px-3 text-slate-200">
                    {spec.totalInstances} 台
                  </td>

                  {/* 当前运行 */}
                  <td className="py-3 px-3">
                    <span className="text-emerald-400 font-bold">
                      {spec.runningInstances} 台
                    </span>
                  </td>

                  {/* 累计时长 */}
                  <td className="py-3 px-3 text-slate-300">
                    {spec.totalHours.toLocaleString()} hrs
                  </td>

                  {/* 总流水 */}
                  <td className="py-3 px-4 text-right font-bold text-emerald-400">
                    ¥{spec.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </td>

                  {/* 利用率 */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-20 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            spec.utilizationRate > 85 ? 'bg-rose-500' : spec.utilizationRate > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${spec.utilizationRate}%` }}
                        />
                      </div>
                      <span className="font-semibold text-slate-200 text-xs">{spec.utilizationRate}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
