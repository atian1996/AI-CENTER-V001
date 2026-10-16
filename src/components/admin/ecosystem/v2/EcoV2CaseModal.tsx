import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Building2, MapPin, TrendingDown, Cpu, CheckCircle, ArrowRight } from 'lucide-react';
import { EcoV2CostSavingCase } from './mockEcoV2Data';

interface EcoV2CaseModalProps {
  caseItem: EcoV2CostSavingCase | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EcoV2CaseModal: React.FC<EcoV2CaseModalProps> = ({
  caseItem,
  isOpen,
  onClose
}) => {
  if (!isOpen || !caseItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.2 }}
          className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden text-slate-100"
        >
          {/* 头部条 */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">{caseItem.title}</h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">企业主体：{caseItem.enterpriseName} · {caseItem.district} · {caseItem.industry}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 内容区 */}
          <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
            {/* 核心降本指标卡 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60">
                <div className="text-xs text-emerald-400 flex items-center gap-1.5">
                  <TrendingDown className="w-3.5 h-3.5" />
                  实测降本/增效价值
                </div>
                <div className="text-lg font-black text-emerald-400 mt-1">{caseItem.savingValue}</div>
                <div className="text-[11px] text-slate-400 mt-0.5">财务可核验口径</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-blue-400" />
                  模型算力消耗
                </div>
                <div className="text-lg font-black text-blue-400 mt-1">{caseItem.computeHours.toLocaleString()} <span className="text-xs text-slate-400 font-normal">卡时</span></div>
                <div className="text-[11px] text-slate-500 mt-0.5">平台资源池计量</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                  落地交付状态
                </div>
                <div className="text-sm font-bold text-cyan-400 mt-1">{caseItem.status}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">已签署业务合同</div>
              </div>
            </div>

            {/* 解决的问题痛点 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
              <div className="text-xs font-bold text-amber-400 flex items-center gap-2 mb-1.5">
                <span>⚠️ 传统生产与研发痛点</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {caseItem.problemSolved}
              </p>
            </div>

            {/* AI解决方案与落地形态 */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/40">
              <div className="text-xs font-bold text-blue-300 flex items-center gap-2 mb-1.5">
                <span>🚀 AI赋能解决方案与落地形态</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-medium">
                {caseItem.solution}
              </p>
            </div>

            {/* 溯源链路 */}
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/50 p-3.5 text-xs text-slate-400 flex items-center justify-between">
              <div>溯源主体：<span className="text-white font-bold">{caseItem.enterpriseName}</span></div>
              <div className="text-slate-500">已沉淀至：案例台账 (可逐条核对)</div>
            </div>
          </div>

          {/* 底部 */}
          <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">出处：案例台账</span>
            <button
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition cursor-pointer"
            >
              关闭
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
