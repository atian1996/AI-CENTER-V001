import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  PhoneCall, 
  Search, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart3, 
  Cpu, 
  Zap, 
  Play, 
  FileVideo, 
  Image as ImageIcon, 
  ExternalLink,
  Download
} from 'lucide-react';
import { ApiCallLog, AsyncCallTask } from '../../types';
import { mockApiLogs, mockAsyncTasks } from '../../data/mockData';

export const WorkspaceCalls: React.FC = () => {
  const { showToast } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'api' | 'async' | 'charts'>('api');
  const [logs, setLogs] = useState<ApiCallLog[]>(mockApiLogs);
  const [asyncTasks, setAsyncTasks] = useState<AsyncCallTask[]>(mockAsyncTasks);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredLogs = logs.filter(l => {
    if (statusFilter !== 'all' && l.status !== statusFilter) return false;
    if (searchQuery && !l.targetName.includes(searchQuery) && !l.endpoint.includes(searchQuery)) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>我的调用</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-cyan-50 text-cyan-700">
              API & 算法监控
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            监控大模型 API 调用日志、异步计算任务状态与 Token 消耗统计
          </p>
        </div>
      </div>

      {/* SubTabs bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-extrabold">
        {[
          { key: 'api', label: 'API 调用记录', icon: PhoneCall },
          { key: 'async', label: '异步任务记录', icon: Zap },
          { key: 'charts', label: '用量图表与分析', icon: BarChart3 },
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeSubTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveSubTab(tab.key as any)}
              className={`pb-3 px-3 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                isActive ? 'border-indigo-600 text-indigo-600 font-black' : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. API Call Logs */}
      {activeSubTab === 'api' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <div className="flex items-center gap-2 text-xs font-bold">
              {[
                { key: 'all', label: '全部状态' },
                { key: '200 OK', label: '200 成功' },
                { key: '429 Rate Limit', label: '429 限流' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-3 py-1.5 rounded-xl transition cursor-pointer ${
                    statusFilter === s.key ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索模型/Agent或接口..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-600"
              />
            </div>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200">
                <tr>
                  <th className="p-4">调用时间</th>
                  <th className="p-4">目标模型 / Agent</th>
                  <th className="p-4">API 端点</th>
                  <th className="p-4">Input / Output Tokens</th>
                  <th className="p-4">费用 (元)</th>
                  <th className="p-4">响应耗时</th>
                  <th className="p-4">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="p-4 text-slate-400 font-mono text-[11px]">{log.timestamp}</td>
                    <td className="p-4 font-black text-slate-900">{log.targetName}</td>
                    <td className="p-4 text-slate-600 font-mono text-[11px]">{log.endpoint}</td>
                    <td className="p-4 text-slate-700 font-bold">
                      {log.inputTokens} / {log.outputTokens} <span className="text-slate-400 font-normal">({log.tokensUsed} Total)</span>
                    </td>
                    <td className="p-4 font-bold text-indigo-600">¥{(log.cost ?? 0).toFixed(4)}</td>
                    <td className="p-4 font-bold text-slate-700">{log.responseTimeMs} ms</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        log.status === '200 OK' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* 2. Async Call Tasks */}
      {activeSubTab === 'async' && (
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200">
              <tr>
                <th className="p-4">任务编号</th>
                <th className="p-4">任务类型</th>
                <th className="p-4">创建时间</th>
                <th className="p-4">处理耗时</th>
                <th className="p-4">预估花费</th>
                <th className="p-4">当前状态</th>
                <th className="p-4 text-right">操作 / 交付</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {asyncTasks.map(tsk => (
                <tr key={tsk.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-mono font-bold text-slate-800">{tsk.id}</td>
                  <td className="p-4 font-extrabold text-slate-900">{tsk.taskType}</td>
                  <td className="p-4 text-slate-400">{tsk.createdAt}</td>
                  <td className="p-4 font-bold text-slate-700">{tsk.durationSec} 秒</td>
                  <td className="p-4 font-bold text-emerald-600">¥{(tsk.cost ?? 0).toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                      tsk.status === '已完成' ? 'bg-emerald-100 text-emerald-700' : 'bg-indigo-100 text-indigo-700'
                    }`}>
                      {tsk.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {tsk.outputUrl ? (
                      <a
                        href={tsk.outputUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 font-extrabold flex items-center gap-1 justify-end"
                      >
                        <span>查看产出</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-slate-400 font-normal">计算中...</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* 3. Usage Charts */}
      {activeSubTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">API 调用量每日趋势</h3>
            <div className="h-48 bg-slate-50 rounded-2xl border border-slate-100 flex items-end justify-between p-4 gap-2">
              {[120, 340, 560, 480, 890, 720, 1100].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-slate-500">{val}</span>
                  <div style={{ height: `${(val / 1200) * 100}%` }} className="w-full bg-indigo-600 rounded-t-lg" />
                  <span className="text-[10px] text-slate-400">Day {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
            <h3 className="text-sm font-black text-slate-900">Token 消耗占比 (Input vs Output)</h3>
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-3">
              <div className="flex justify-between text-xs font-extrabold text-indigo-900">
                <span>Input Tokens (65%)</span>
                <span>Output Tokens (35%)</span>
              </div>
              <div className="w-full h-4 bg-indigo-200 rounded-full overflow-hidden flex">
                <div className="w-[65%] bg-indigo-600 h-full" />
                <div className="w-[35%] bg-purple-500 h-full" />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
