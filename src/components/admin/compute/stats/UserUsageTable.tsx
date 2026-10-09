import React, { useState, useMemo } from 'react';
import {
  Search,
  Users,
  Download,
  ArrowUpDown,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Filter,
  Flame,
  Clock,
  Coins
} from 'lucide-react';
import { ComputeUserUsageDetail } from '../../../../types';

interface UserUsageTableProps {
  data: ComputeUserUsageDetail[];
  onNavigateToUserOrders?: (userId: string) => void;
}

export const UserUsageTable: React.FC<UserUsageTableProps> = ({
  data,
  onNavigateToUserOrders
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'totalCost' | 'totalHours' | 'instanceCount' | 'runningCount'>('totalCost');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // 搜索和排序
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    if (searchTerm.trim()) {
      const q = searchTerm.trim().toLowerCase();
      result = result.filter(u =>
        u.userName.toLowerCase().includes(q) ||
        u.userId.toLowerCase().includes(q) ||
        (u.phone && u.phone.includes(q)) ||
        (u.organization && u.organization.toLowerCase().includes(q)) ||
        (u.primarySpec && u.primarySpec.toLowerCase().includes(q))
      );
    }

    result.sort((a, b) => {
      const valA = a[sortBy] || 0;
      const valB = b[sortBy] || 0;
      return sortOrder === 'desc' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
    });

    return result;
  }, [data, searchTerm, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredAndSortedData.slice(start, start + pageSize);
  }, [filteredAndSortedData, currentPage, pageSize]);

  const toggleSort = (field: 'totalCost' | 'totalHours' | 'instanceCount' | 'runningCount') => {
    if (sortBy === field) {
      setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'));
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const handleExportCSV = () => {
    const headers = ['用户ID', '用户名', '所属机构/课题组', '联系电话', '累计实例数', '运行中实例', '累计时长(卡时)', '累计消费(元)', '常用规格', '最后活跃时间'];
    const rows = filteredAndSortedData.map(u => [
      u.userId,
      u.userName,
      u.organization || '个人开发者',
      u.phone || '-',
      u.instanceCount,
      u.runningCount,
      u.totalHours,
      u.totalCost.toFixed(2),
      u.primarySpec || '-',
      u.lastActiveAt || '-'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `用户算力消耗明细_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      {/* 头部控制栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-400" />
            <span>用户算力消耗与贡献明细表</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            汇总各租户累计创建实例、当前活跃实例、总消耗时长与总付费流水 (按用户维度聚合)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="搜索用户名 / UID / 手机 / 课题组..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-slate-950/80 border border-slate-800 text-xs text-slate-200 pl-8 pr-3 py-1.5 rounded-lg w-56 sm:w-64 focus:outline-none focus:border-indigo-500"
            />
          </div>

          {/* 导出按钮 */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium border border-slate-700 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>导出 CSV</span>
          </button>
        </div>
      </div>

      {/* 表格主体 */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] font-semibold border-b border-slate-800 tracking-wider">
              <tr>
                <th className="py-3 px-4">用户信息 / 机构</th>
                <th
                  onClick={() => toggleSort('instanceCount')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center gap-1">
                    <span>累计实例</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => toggleSort('runningCount')}
                  className="py-3 px-3 cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center gap-1">
                    <span>运行中</span>
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
                  onClick={() => toggleSort('totalCost')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-white transition"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>累计消费流水</span>
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="py-3 px-3">常用 GPU 规格</th>
                <th className="py-3 px-4 text-right">最后活跃时间</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    未找到匹配的用户用量数据
                  </td>
                </tr>
              ) : (
                paginatedData.map((user, idx) => (
                  <tr key={user.userId} className="hover:bg-slate-800/30 transition-colors">
                    {/* 用户与机构 */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-xs">
                          {user.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-200 flex items-center gap-1.5">
                            <span>{user.userName}</span>
                            {user.totalCost > 8000 && (
                              <span className="px-1.5 py-0.2 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded text-[9px]">
                                VIP
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2 mt-0.5">
                            <span>{user.userId}</span>
                            {user.organization && (
                              <>
                                <span>·</span>
                                <span className="text-slate-400 font-sans">{user.organization}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 累计实例 */}
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {user.instanceCount} 台
                    </td>

                    {/* 运行中 */}
                    <td className="py-3 px-3">
                      {user.runningCount > 0 ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          {user.runningCount} 台在线
                        </span>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">0 台</span>
                      )}
                    </td>

                    {/* 累计卡时 */}
                    <td className="py-3 px-3 font-mono text-slate-300">
                      <span className="font-semibold text-slate-200">{user.totalHours.toLocaleString()}</span>
                      <span className="text-slate-500 text-[10px] ml-1">hrs</span>
                    </td>

                    {/* 累计消费流水 */}
                    <td className="py-3 px-4 text-right font-mono">
                      <div className="text-emerald-400 font-bold text-xs">
                        ¥{user.totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>

                    {/* 常用规格 */}
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 text-[11px] font-mono">
                        {user.primarySpec || 'NVIDIA RTX 4090'}
                      </span>
                    </td>

                    {/* 最后活跃 */}
                    <td className="py-3 px-4 text-right font-mono text-[11px] text-slate-400">
                      {user.lastActiveAt || '2026-08-19 18:30'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页控制 */}
        <div className="px-4 py-3 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div>
            共 <span className="text-slate-200 font-semibold">{filteredAndSortedData.length}</span> 位用户
            {searchTerm && ` (从 ${data.length} 条中筛选)`}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-slate-300">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-1 rounded bg-slate-900 border border-slate-800 text-slate-300 hover:bg-slate-800 disabled:opacity-40 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
