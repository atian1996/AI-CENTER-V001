import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Building2, MapPin, Calendar, Award, TrendingUp, Zap, Users, CheckCircle2, FileCheck } from 'lucide-react';
import { EcoV2ScaledEnterprise } from './mockEcoV2Data';

interface EcoV2EnterpriseModalProps {
  enterprise: EcoV2ScaledEnterprise | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EcoV2EnterpriseModal: React.FC<EcoV2EnterpriseModalProps> = ({
  enterprise,
  isOpen,
  onClose
}) => {
  if (!isOpen || !enterprise) return null;

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
              <div className="p-2.5 rounded-xl bg-blue-600/20 border border-blue-500/30 text-blue-400">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-extrabold text-white">{enterprise.name}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                    enterprise.status === '已入统'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}>
                    {enterprise.status}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">企业分类：{enterprise.category} · 所属辖区：{enterprise.district}</p>
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
            {/* 核心指标栅格 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                  当前年化营收/产值
                </div>
                <div className="text-lg font-black text-amber-400 mt-1">{enterprise.revenue}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">达标规上工业考核口径</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-emerald-400" />
                  入统达标时点
                </div>
                <div className="text-sm font-bold text-emerald-400 mt-1">{enterprise.targetScaleDate}</div>
                <div className="text-[11px] text-slate-500 mt-0.5">工信局专项辅导跟进</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                <div className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-blue-400" />
                  算力资源消纳
                </div>
                <div className="text-lg font-black text-blue-400 mt-1">{enterprise.computeHours.toLocaleString()} <span className="text-xs text-slate-400 font-normal">卡时</span></div>
                <div className="text-[11px] text-slate-500 mt-0.5">长周期算法持续训练</div>
              </div>
            </div>

            {/* 成果与落地亮点 */}
            <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/50">
              <div className="text-xs font-bold text-blue-300 flex items-center gap-2 mb-2">
                <FileCheck className="w-4 h-4 text-blue-400" />
                升规培育进展与AI产业赋能亮点
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {enterprise.highlight}
              </p>
            </div>

            {/* 台账核验信息 */}
            <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-2.5 text-xs">
              <div className="font-bold text-slate-300">台账过程核验依据：</div>
              <div className="grid grid-cols-2 gap-2 text-slate-400">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>入驻签约备案：{enterprise.joinDate}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>税务与社保缴纳记录：真实在册经营</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>算力计量结算单：已逐月在平台对账核验</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>产值统计口径：纳入各区工信局规上企业后备库</span>
                </div>
              </div>
            </div>
          </div>

          {/* 底部按钮 */}
          <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
            <span className="text-xs text-slate-500">数据出处：辖区运营台账 & 规上企业培育台账</span>
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
