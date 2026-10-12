import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Cpu,
  FileCheck2,
  Building2,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { EcoActivityItem } from './mockEcoData';

interface EcoActivityDetailModalProps {
  activity: EcoActivityItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EcoActivityDetailModal: React.FC<EcoActivityDetailModalProps> = ({
  activity,
  isOpen,
  onClose
}) => {
  if (!isOpen || !activity) return null;

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
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-bold">
                    {activity.type}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 text-[11px] font-mono">
                    对应服务项：{activity.serviceCategory}
                  </span>
                </div>
                <h3 className="text-base font-black text-white mt-1">{activity.title}</h3>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* 内容 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* 元信息统计行 */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-slate-500 font-medium flex items-center gap-1">
                  <Users className="w-3.5 h-3.5 text-indigo-400" />
                  <span>参与人数</span>
                </div>
                <div className="font-extrabold font-mono text-white text-sm mt-1">{activity.participantsCount} 人</div>
              </div>

              <div>
                <div className="text-slate-500 font-medium flex items-center gap-1">
                  <FileCheck2 className="w-3.5 h-3.5 text-cyan-400" />
                  <span>产出成果数</span>
                </div>
                <div className="font-extrabold font-mono text-white text-sm mt-1">{activity.outputCount} 项</div>
              </div>

              <div>
                <div className="text-slate-500 font-medium flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-emerald-400" />
                  <span>算力消耗</span>
                </div>
                <div className="font-extrabold font-mono text-emerald-400 text-sm mt-1">{activity.computeConsumed} 卡时</div>
              </div>

              <div>
                <div className="text-slate-500 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>举行时间</span>
                </div>
                <div className="font-bold font-mono text-slate-300 text-xs mt-1">{activity.date}</div>
              </div>
            </div>

            {/* 地点与主办方 */}
            <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>活动地点：<strong className="text-white">{activity.location}</strong></span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>主办/承办单位：<strong className="text-white">{activity.organizer}</strong></span>
              </div>
            </div>

            {/* 活动总结与成果亮点 */}
            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-indigo-500 rounded-full" />
                <span>活动纪实与总结概述</span>
              </h4>
              <p className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl text-xs text-slate-300 leading-relaxed font-medium">
                {activity.summary}
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-3 bg-emerald-500 rounded-full" />
                <span>核心产出成果与突破亮点</span>
              </h4>
              <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl space-y-2">
                {activity.keyAchievements.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 font-medium">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 现场写真记录 */}
            {activity.photos && activity.photos.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-1.5 h-3 bg-amber-500 rounded-full" />
                  <span>活动现场写真图集</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {activity.photos.map((url, idx) => (
                    <img
                      key={idx}
                      src={url}
                      alt="活动现场"
                      className="w-full h-36 rounded-2xl object-cover border border-slate-800 shadow-md"
                    />
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* 底部 */}
          <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between shrink-0">
            <span className="text-xs text-slate-500 font-mono">活动编号: {activity.id}</span>
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
