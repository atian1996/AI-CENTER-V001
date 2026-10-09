import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Cpu, X, Scale, ArrowRight, CheckCircle2 } from 'lucide-react';

export const ModelCompareBar: React.FC = () => {
  const { selectedCompareModels, toggleCompareModel, clearCompareModels } = useApp();
  const [compareModalOpen, setCompareModalOpen] = useState(false);

  if (selectedCompareModels.length === 0) return null;

  return (
    <>
      {/* Bottom Floating Bar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[80] animate-bounce-short select-none">
        <div className="flex items-center gap-4 px-5 py-3 rounded-2xl bg-white/95 border border-indigo-200 shadow-2xl shadow-indigo-950/10 backdrop-blur-md text-xs text-slate-800 font-medium">
          <div className="flex items-center gap-2 font-extrabold text-indigo-700">
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>已选 <strong className="font-mono text-sm">{selectedCompareModels.length}</strong> 个对比模型</span>
          </div>

          <div className="flex items-center gap-2 max-w-md overflow-x-auto py-0.5">
            {selectedCompareModels.map(m => (
              <span key={m.id} className="px-2.5 py-1 rounded-xl bg-slate-100 border border-slate-200/80 flex items-center gap-1.5 font-bold text-slate-800 text-[11px] shrink-0">
                <span className="truncate max-w-[120px]">{m.name}</span>
                <button 
                  onClick={() => toggleCompareModel(m)} 
                  className="text-slate-400 hover:text-slate-700 p-0.5 hover:bg-slate-200 rounded transition cursor-pointer"
                  title="移除此模型"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <button
              onClick={() => setCompareModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold flex items-center gap-1.5 shadow-md shadow-indigo-500/20 transition cursor-pointer"
            >
              <span>开始横向对比</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={clearCompareModels} 
              className="text-slate-400 hover:text-slate-800 font-bold transition text-[11px] cursor-pointer"
            >
              清空
            </button>
          </div>
        </div>
      </div>

      {/* Comparison Modal */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-[95] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in select-none">
          <div className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 text-xs text-slate-700 font-medium max-h-[90vh] overflow-y-auto">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold">
                  <Scale className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-slate-900">
                    大模型多维度指标横向测评对比
                  </h2>
                  <p className="text-slate-500 text-xs mt-0.5">
                    基于同一测评基准对比多款大语言模型的上下文、价格、延迟与权威 Benchmark 指标
                  </p>
                </div>
              </div>

              <button 
                onClick={() => setCompareModalOpen(false)} 
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Comparison Table */}
            <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200/80 bg-slate-50/80">
                    <th className="p-4 font-extrabold text-slate-500 w-44 text-xs">对比维度与指标</th>
                    {selectedCompareModels.map(m => (
                      <th key={m.id} className="p-4 font-black text-slate-900 text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-[10px]">
                            {m.vendor.slice(0, 1)}
                          </span>
                          <div>
                            <div>{m.name}</div>
                            <div className="text-[10px] font-normal text-slate-400">{m.vendor}</div>
                          </div>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="p-4 font-bold text-slate-600">上下文窗口 (Context)</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-4 font-mono font-extrabold text-indigo-600 text-xs">{m.contextLength}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-600">输入价格 (Input)</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-4 font-mono font-extrabold text-emerald-600 text-xs">{m.priceInput}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-600">输出价格 (Output)</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-4 font-mono font-extrabold text-emerald-600 text-xs">{m.priceOutput}</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-600">平均首包延迟 (Latency)</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-4 font-mono font-extrabold text-slate-800 text-xs">{m.latencyMs || 708} ms</td>
                    ))}
                  </tr>
                  <tr>
                    <td className="p-4 font-bold text-slate-600">基准测试 Benchmark</td>
                    {selectedCompareModels.map(m => (
                      <td key={m.id} className="p-4 space-y-1.5">
                        {m.benchmarks.map((b, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[11px] font-mono bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                            <span className="text-slate-500 font-medium">{b.name}:</span>
                            <span className="font-extrabold text-indigo-600">{b.score}%</span>
                          </div>
                        ))}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setCompareModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

