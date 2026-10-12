import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Building2,
  Cpu,
  Users,
  CheckCircle2,
  TrendingUp,
  ExternalLink,
  Award,
  Zap,
  Tag,
  ArrowRight,
  ShieldCheck,
  FileCode2
} from 'lucide-react';
import { EcoCaseItem } from './mockEcoData';

interface EcoCaseDetailModalProps {
  caseItem: EcoCaseItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EcoCaseDetailModal: React.FC<EcoCaseDetailModalProps> = ({
  caseItem,
  isOpen,
  onClose
}) => {
  if (!isOpen || !caseItem) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-slate-100"
        >
          {/* 头部 */}
          <div className="px-6 py-5 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                    {caseItem.industry}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                    caseItem.status === '已落地' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                    caseItem.status === '试点中' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                    'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  }`}>
                    {caseItem.status}
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-1">{caseItem.title}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 内容区 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 1. 企业基本信息与来源 */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-slate-500 font-medium">合作企业</div>
                <div className="font-extrabold text-white mt-1">{caseItem.enterpriseName}</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">成果来源</div>
                <div className="font-bold text-indigo-300 mt-1">{caseItem.source}</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">带动算力消耗</div>
                <div className="font-mono font-bold text-emerald-400 mt-1">{caseItem.computeConsumed} 卡时</div>
              </div>
              <div>
                <div className="text-slate-500 font-medium">Token 吞吐开销</div>
                <div className="font-mono font-bold text-cyan-400 mt-1">{caseItem.tokensConsumed}</div>
              </div>
            </div>

            {/* 2. 问题痛点与 AI 解决方案 */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full" />
                <span>解决的问题与痛点剖析</span>
              </h4>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed font-medium">
                {caseItem.problemSolved}
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-cyan-500 rounded-full" />
                <span>AI 架构设计与解决方案细节</span>
              </h4>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed font-medium">
                {caseItem.solutionDetail}
              </div>
            </div>

            {/* 3. 参与团队与落地效果 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>参与团队与极客开发者</span>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {caseItem.teamMembers.map((m, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-200 font-bold">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
                <div className="text-xs font-bold text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>经济效益与量化评估</span>
                </div>
                <p className="text-xs text-emerald-300 font-bold leading-relaxed pt-1">
                  {caseItem.economicValue || '暂无量化数据说明'}
                </p>
              </div>
            </div>

            {caseItem.deploymentLocation && (
              <div className="p-4 bg-emerald-950/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>实际部署落地节点：<strong className="text-white">{caseItem.deploymentLocation}</strong></span>
                </div>
                <span className="text-emerald-400 font-bold font-mono">运行监控正常</span>
              </div>
            )}

          </div>

          {/* 底部 */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 font-mono">案例 ID: {caseItem.id}</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
            >
              关闭
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
