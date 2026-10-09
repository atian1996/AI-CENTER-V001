import React, { useState } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  Users, 
  Clock, 
  Coins, 
  TrendingUp, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Filter, 
  RefreshCw, 
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  BarChart3
} from 'lucide-react';

interface OrchestrationMonitorViewProps {
  agent: AgentItem;
}

export const OrchestrationMonitorView: React.FC<OrchestrationMonitorViewProps> = ({ agent }) => {
  const { showToast } = useApp();

  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('7d');

  const logs = [
    { id: 'run_9921a', trigger: 'REST API', time: '10:14:02', status: 'succeeded', latency: '242ms', tokens: 168, cost: '$0.0004' },
    { id: 'run_9920b', trigger: 'Web App', time: '10:12:18', status: 'succeeded', latency: '310ms', tokens: 215, cost: '$0.0006' },
    { id: 'run_9919c', trigger: 'REST API', time: '10:05:44', status: 'succeeded', latency: '198ms', tokens: 142, cost: '$0.0003' },
    { id: 'run_9918d', trigger: 'Debug Test', time: '09:58:30', status: 'failed', latency: '120ms', tokens: 0, cost: '$0.0000', error: 'Input schema validation failed' },
    { id: 'run_9917e', trigger: 'REST API', time: '09:45:11', status: 'succeeded', latency: '405ms', tokens: 320, cost: '$0.0009' }
  ];

  return (
    <div className="flex-1 overflow-y-auto bg-slate-50 p-8 select-none">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header & Filter Bar */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              <span>{agent.name} · 运行指标监测与可观测性</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">实时监控调用量、延迟分布、Token 消耗及错误率</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Time Range Pills */}
            <div className="bg-slate-200/80 p-1 rounded-xl flex gap-1 text-xs font-bold text-slate-600">
              <button
                onClick={() => setTimeRange('24h')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  timeRange === '24h' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                过去 24 小时
              </button>
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  timeRange === '7d' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                过去 7 天
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                  timeRange === '30d' ? 'bg-white text-blue-600 shadow-xs' : 'hover:text-slate-900'
                }`}
              >
                过去 30 天
              </button>
            </div>

            <button 
              onClick={() => showToast('已刷新最新监控指标')}
              className="p-2 bg-white border border-slate-200 hover:bg-slate-100 rounded-xl text-slate-600 transition cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Metric Cards (Matches 工作流应用-监测.png) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Metric 1 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>活跃终端用户 (UV)</span>
              <Users className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">1,420</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12.4% 较上周同期</span>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>总调用请求量 (Requests)</span>
              <Activity className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">28,590</div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18.2% 运行负载</span>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>P95 响应延迟 (Latency)</span>
              <Clock className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">412 <span className="text-sm font-normal text-slate-400">ms</span></div>
            <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-8.1% 响应速度提升</span>
            </div>
          </div>

          {/* Metric 4 */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Token 总消耗 (Tokens)</span>
              <Coins className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-slate-900">3.42 <span className="text-sm font-normal text-slate-400">M</span></div>
            <div className="text-[11px] text-slate-400 font-mono">预估消耗: ~$14.28</div>
          </div>

        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Main Chart: Requests & Success Rate (2 Cols) */}
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">请求量与成功率走势</h3>
              <span className="text-xs text-emerald-600 font-bold">成功率 99.84%</span>
            </div>

            {/* Visual Bars Mock */}
            <div className="h-44 flex items-end justify-between gap-3 pt-6 px-2">
              {[
                { day: '05-04', val: 65, err: 2 },
                { day: '05-05', val: 78, err: 0 },
                { day: '05-06', val: 92, err: 1 },
                { day: '05-07', val: 85, err: 0 },
                { day: '05-08', val: 110, err: 3 },
                { day: '05-09', val: 145, err: 1 },
                { day: '05-10', val: 160, err: 0 },
              ].map((b) => (
                <div key={b.day} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                  <div className="w-full flex flex-col items-center justify-end h-32 bg-slate-50 rounded-lg p-1 group-hover:bg-blue-50/50 transition">
                    <div 
                      style={{ height: `${(b.val / 160) * 100}%` }}
                      className="w-full max-w-[28px] bg-blue-600 group-hover:bg-blue-500 rounded-md transition"
                    />
                  </div>
                  <span className="text-[11px] text-slate-400 font-mono">{b.day}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Node Breakdown */}
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-800">节点耗时占比分布</h3>
            
            <div className="space-y-3 pt-2 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">大语言模型 (LLM)</span>
                  <span className="font-mono text-slate-900 font-bold">82% · 338ms</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[82%] h-full bg-indigo-600 rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">文档提取 / 知识库检索</span>
                  <span className="font-mono text-slate-900 font-bold">12% · 50ms</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[12%] h-full bg-blue-500 rounded-full" />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-medium">
                  <span className="text-slate-700">条件分支 & 变量赋值</span>
                  <span className="font-mono text-slate-900 font-bold">6% · 24ms</span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div className="w-[6%] h-full bg-emerald-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Recent Run Traces Table */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800">最近执行追踪日志 (Execution Traces)</h3>
            <span className="text-[11px] text-slate-400">保留近 30 天链路追踪</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400">
                  <th className="py-2.5 font-bold">执行 ID</th>
                  <th className="py-2.5 font-bold">触发源</th>
                  <th className="py-2.5 font-bold">时间</th>
                  <th className="py-2.5 font-bold">执行状态</th>
                  <th className="py-2.5 font-bold">延迟</th>
                  <th className="py-2.5 font-bold">Tokens</th>
                  <th className="py-2.5 font-bold text-right">预估费用</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-mono font-bold text-blue-600">{log.id}</td>
                    <td className="py-3 text-slate-700">{log.trigger}</td>
                    <td className="py-3 text-slate-400 font-mono">{log.time}</td>
                    <td className="py-3">
                      {log.status === 'succeeded' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          成功
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 font-medium" title={log.error}>
                          <XCircle className="w-3.5 h-3.5" />
                          失败
                        </span>
                      )}
                    </td>
                    <td className="py-3 font-mono text-slate-600">{log.latency}</td>
                    <td className="py-3 font-mono text-slate-600">{log.tokens}</td>
                    <td className="py-3 font-mono text-slate-600 text-right">{log.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
