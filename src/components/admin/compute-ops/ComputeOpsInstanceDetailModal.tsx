import React from 'react';
import { X, Server, Clock, Cpu, CheckCircle2, DollarSign, Calendar, Layers } from 'lucide-react';
import { ConsumptionDetailRow } from './mockComputeOpsData';

interface ComputeOpsInstanceDetailModalProps {
  item: ConsumptionDetailRow | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ComputeOpsInstanceDetailModal: React.FC<ComputeOpsInstanceDetailModalProps> = ({
  item,
  isOpen,
  onClose
}) => {
  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-[620px] max-w-full bg-[#1E293B] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100 font-sans">
        {/* 标题栏 */}
        <div className="p-5 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/40 flex items-center justify-center text-blue-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>实例调用详情与起止时间</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  {item.instanceId}
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                资源池：{item.poolName} ｜ 业务归属：{item.businessLine}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 主体内容 */}
        <div className="p-6 space-y-4">
          {/* 四个卡片 */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-400" />
                <span>起止运行时间</span>
              </div>
              <div className="text-xs font-mono text-slate-200 mt-2 space-y-1">
                <div>起：{item.startTime}</div>
                <div>止：{item.endTime}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                <span>硬件型号与规格</span>
              </div>
              <div className="text-sm font-bold text-emerald-400 mt-1.5">
                {item.gpuType}
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                独占物理卡直通
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-400" />
                <span>卡时调度计量</span>
              </div>
              <div className="text-2xl font-black font-mono text-amber-400 mt-1">
                {item.hours} <span className="text-xs font-normal text-slate-400">卡时</span>
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                协议单价：¥1.50 / 卡时
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <div className="text-[11px] text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-purple-400" />
                <span>应结金额</span>
              </div>
              <div className="text-2xl font-black font-mono text-purple-400 mt-1">
                ¥{item.amount.toFixed(2)}
              </div>
              <div className="text-[11px] text-emerald-400 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>计量账实一致</span>
              </div>
            </div>
          </div>

          {/* 补充信息 */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-xs space-y-1.5 text-slate-300">
            <div className="flex justify-between">
              <span className="text-slate-400">调度使用主体：</span>
              <span className="font-semibold text-white">{item.operator}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">流水上报时间：</span>
              <span className="font-mono text-slate-300">{item.time}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">所属对账周期：</span>
              <span className="font-mono text-slate-300">2026年9月</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">资源调度网关验证：</span>
              <span className="text-emerald-400 font-mono font-semibold">SIG-VERIFIED-PASS</span>
            </div>
          </div>
        </div>

        {/* 底栏 */}
        <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition cursor-pointer"
          >
            关闭详情
          </button>
        </div>
      </div>
    </div>
  );
};
