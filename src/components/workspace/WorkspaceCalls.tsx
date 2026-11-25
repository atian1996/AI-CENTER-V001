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
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#1A1A1A]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2.5">
            <span>我的调用</span>
            <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-[#F5F5F5] text-[#555555] border border-[#EAEAEA]">
              API & 算法监控
            </span>
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            监控大模型 API 调用日志、异步计算任务状态与 Token 消耗统计
          </p>
        </div>
      </div>

      {/* SubTabs bar */}
      <div className="flex items-center gap-6 border-b border-[#EAEAEA] text-xs">
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
              className={`pb-3 px-1 flex items-center gap-2 border-b-2 transition cursor-pointer ${
                isActive ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold' : 'border-transparent text-[#666666] hover:text-[#1A1A1A] font-medium'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 1. API Call Logs */}
      {activeSubTab === 'api' && (
        <div className="space-y-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-md border border-[#EAEAEA]">
            <div className="flex items-center gap-2 text-xs font-medium">
              {[
                { key: 'all', label: '全部状态' },
                { key: '200 OK', label: '200 成功' },
                { key: '429 Rate Limit', label: '429 限流' },
              ].map(s => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-3 py-1.5 rounded-md transition cursor-pointer border ${
                    statusFilter === s.key
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white text-[#555555] border-[#EAEAEA] hover:bg-[#F5F5F5] hover:text-[#1A1A1A]'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-[#999999] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索模型/Agent或接口..."
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#E0E0E0] rounded-md text-[#1A1A1A] placeholder-[#999999] outline-none focus:border-[#1A1A1A] transition"
              />
            </div>
          </div>

          <div className="bg-white rounded-md border border-[#EAEAEA] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                  <tr>
                    <th className="py-3.5 px-4">调用时间</th>
                    <th className="py-3.5 px-4">目标模型 / Agent</th>
                    <th className="py-3.5 px-4">API 端点</th>
                    <th className="py-3.5 px-4">Input / Output Tokens</th>
                    <th className="py-3.5 px-4">费用 (元)</th>
                    <th className="py-3.5 px-4">响应耗时</th>
                    <th className="py-3.5 px-4">状态</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2F2F2]">
                  {filteredLogs.map(log => {
                    const isSuccess = log.status === '200 OK';
                    return (
                      <tr key={log.id} className="hover:bg-[#FAFAFA] transition">
                        <td className="py-3.5 px-4 text-[#666666] font-mono tabular-nums text-[11px] whitespace-nowrap">{log.timestamp}</td>
                        <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">{log.targetName}</td>
                        <td className="py-3.5 px-4">
                          <code className="px-2 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] text-[#333333] font-mono text-[11px]">
                            {log.endpoint}
                          </code>
                        </td>
                        <td className="py-3.5 px-4 text-[#333333] font-mono tabular-nums">
                          <span className="font-semibold">{log.inputTokens} / {log.outputTokens}</span>{' '}
                          <span className="text-[#888888] font-normal">({log.tokensUsed} Total)</span>
                        </td>
                        <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-[#1A1A1A]">¥{(log.cost ?? 0).toFixed(4)}</td>
                        <td className="py-3.5 px-4 font-mono tabular-nums text-[#333333]">{log.responseTimeMs} ms</td>
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium font-mono ${
                            isSuccess ? 'text-[#166534]' : 'text-[#991B1B]'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${isSuccess ? 'bg-[#15803D]' : 'bg-[#B91C1C]'}`} />
                            <span>{log.status}</span>
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* 2. Async Call Tasks */}
      {activeSubTab === 'async' && (
        <div className="bg-white rounded-md border border-[#EAEAEA] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
                <tr>
                  <th className="py-3.5 px-4">任务编号</th>
                  <th className="py-3.5 px-4">任务类型</th>
                  <th className="py-3.5 px-4">创建时间</th>
                  <th className="py-3.5 px-4">处理耗时</th>
                  <th className="py-3.5 px-4">预估花费</th>
                  <th className="py-3.5 px-4">当前状态</th>
                  <th className="py-3.5 px-4 text-right">操作 / 交付</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2F2F2]">
                {asyncTasks.map(tsk => {
                  const isDone = tsk.status === '已完成';
                  return (
                    <tr key={tsk.id} className="hover:bg-[#FAFAFA] transition">
                      <td className="py-3.5 px-4">
                        <code className="px-2 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] font-mono text-[11px] text-[#333333]">
                          {tsk.id}
                        </code>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-[#1A1A1A]">{tsk.taskType}</td>
                      <td className="py-3.5 px-4 text-[#666666] font-mono tabular-nums">{tsk.createdAt}</td>
                      <td className="py-3.5 px-4 font-mono tabular-nums text-[#333333]">{tsk.durationSec} 秒</td>
                      <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-[#1A1A1A]">¥{(tsk.cost ?? 0).toFixed(2)}</td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium ${
                          isDone ? 'text-[#166534]' : 'text-[#555555]'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isDone ? 'bg-[#15803D]' : 'bg-[#666666]'}`} />
                          <span>{tsk.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        {tsk.outputUrl ? (
                          <a
                            href={tsk.outputUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[#1A1A1A] hover:underline font-medium inline-flex items-center gap-1 justify-end"
                          >
                            <span>查看产出</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        ) : (
                          <span className="text-[#999999]">计算中...</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. Usage Charts */}
      {activeSubTab === 'charts' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-md border border-[#EAEAEA] space-y-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">API 调用量每日趋势</h3>
            <div className="h-48 bg-[#FAFAFA] rounded-md border border-[#EAEAEA] flex items-end justify-between p-4 gap-2">
              {[120, 340, 560, 480, 890, 720, 1100].map((val, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <span className="text-[10px] font-mono tabular-nums font-medium text-[#555555]">{val}</span>
                  <div style={{ height: `${(val / 1200) * 100}%` }} className="w-full bg-[#1A1A1A] rounded-t" />
                  <span className="text-[10px] text-[#888888] font-mono">Day {idx + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-md border border-[#EAEAEA] space-y-4">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">Token 消耗占比 (Input vs Output)</h3>
            <div className="p-4 rounded-md bg-[#FAFAFA] border border-[#EAEAEA] space-y-3">
              <div className="flex justify-between text-xs font-semibold text-[#1A1A1A]">
                <span>Input Tokens (65%)</span>
                <span>Output Tokens (35%)</span>
              </div>
              <div className="w-full h-3.5 bg-[#EAEAEA] rounded-full overflow-hidden flex">
                <div className="w-[65%] bg-[#1A1A1A] h-full" />
                <div className="w-[35%] bg-[#888888] h-full" />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
