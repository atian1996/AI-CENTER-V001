import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Users,
  Building2,
  Briefcase,
  GraduationCap,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  Clock,
  Award,
  Zap,
  Tag,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  mockActiveUsers,
  mockCertifiedEnterprises,
  mockEcosystemCases,
  mockTalentsList,
  EcoUserItem,
  EcoEnterpriseItem,
  EcoCaseItem,
  EcoTalentItem
} from './mockEcoData';

export type DrilldownType = 'users' | 'enterprises' | 'cases' | 'talents' | null;

interface EcoFourLedgerDrilldownModalProps {
  type: DrilldownType;
  isOpen: boolean;
  onClose: () => void;
  onSelectCase?: (caseItem: EcoCaseItem) => void;
}

export const EcoFourLedgerDrilldownModal: React.FC<EcoFourLedgerDrilldownModalProps> = ({
  type,
  isOpen,
  onClose,
  onSelectCase
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'enterprises' | 'cases' | 'talents'>(type || 'users');
  const [searchKey, setSearchKey] = useState('');
  const [filterCategory, setFilterCategory] = useState('全部');

  // Keep activeTab synced with type when opened
  React.useEffect(() => {
    if (type) {
      setActiveTab(type);
      setSearchKey('');
      setFilterCategory('全部');
    }
  }, [type]);

  if (!isOpen || !type) return null;

  // Filtered User list
  const filteredUsers = mockActiveUsers.filter(u => {
    const matchSearch = u.nickname.toLowerCase().includes(searchKey.toLowerCase()) || u.role.toLowerCase().includes(searchKey.toLowerCase());
    const matchFilter = filterCategory === '全部' || u.businessLine === filterCategory;
    return matchSearch && matchFilter;
  });

  // Filtered Enterprises list
  const filteredEnterprises = mockCertifiedEnterprises.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(searchKey.toLowerCase());
    const matchFilter = filterCategory === '全部' || e.industry === filterCategory;
    return matchSearch && matchFilter;
  });

  // Filtered Cases list
  const filteredCases = mockEcosystemCases.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(searchKey.toLowerCase()) || c.enterpriseName.toLowerCase().includes(searchKey.toLowerCase());
    const matchFilter = filterCategory === '全部' || c.industry === filterCategory || c.source === filterCategory;
    return matchSearch && matchFilter;
  });

  // Filtered Talents list
  const filteredTalents = mockTalentsList.filter(t => {
    const matchSearch = t.name.toLowerCase().includes(searchKey.toLowerCase()) || t.courseOrCert.toLowerCase().includes(searchKey.toLowerCase());
    const matchFilter = filterCategory === '全部' || t.type === filterCategory;
    return matchSearch && matchFilter;
  });

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
          className="relative w-full max-w-5xl max-h-[88vh] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden z-10 text-slate-100"
        >
          {/* 模态窗头部 */}
          <div className="px-6 py-5 border-b border-slate-800/80 bg-slate-950/70 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                {activeTab === 'users' && <Users className="w-5 h-5" />}
                {activeTab === 'enterprises' && <Building2 className="w-5 h-5" />}
                {activeTab === 'cases' && <Briefcase className="w-5 h-5" />}
                {activeTab === 'talents' && <GraduationCap className="w-5 h-5" />}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white">四本账穿透下钻台账明细</h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[11px] font-mono font-bold">
                    全量数据库关联
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">直观穿透至具体主体记录、项目成果与成果孵化轨迹</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* TAB 切换导航 */}
          <div className="px-6 pt-4 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <div className="flex items-center gap-2">
              <button
                onClick={() => { setActiveTab('users'); setFilterCategory('全部'); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'users'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>活跃用户 (8,240)</span>
              </button>

              <button
                onClick={() => { setActiveTab('enterprises'); setFilterCategory('全部'); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'enterprises'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Building2 className="w-4 h-4" />
                <span>已认证企业 (356)</span>
              </button>

              <button
                onClick={() => { setActiveTab('cases'); setFilterCategory('全部'); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'cases'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <Briefcase className="w-4 h-4" />
                <span>产业案例/成果 (128)</span>
              </button>

              <button
                onClick={() => { setActiveTab('talents'); setFilterCategory('全部'); }}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer ${
                  activeTab === 'talents'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>人才台账 (520)</span>
              </button>
            </div>

            {/* 搜索框 */}
            <div className="relative w-64 pb-3 sm:pb-0">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchKey}
                onChange={e => setSearchKey(e.target.value)}
                placeholder="关键字快速检索..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-indigo-500 font-medium"
              />
            </div>
          </div>

          {/* 列表区域 */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            
            {/* 1. 活跃用户列表 */}
            {activeTab === 'users' && (
              <div className="space-y-3">
                {/* 业务线二次筛选 */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-indigo-400" />
                    <span>业务线筛选：</span>
                  </span>
                  {['全部', '赛事', '实训', '实验场', '模型调用', 'Agent调用'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        filterCategory === cat
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-bold uppercase text-[11px]">
                        <th className="py-3 px-4">用户昵称</th>
                        <th className="py-3 px-3">系统身份/角色</th>
                        <th className="py-3 px-3">活跃归属业务线</th>
                        <th className="py-3 px-3">注册时间</th>
                        <th className="py-3 px-3">最后活跃</th>
                        <th className="py-3 px-4 text-right">算力消耗 (卡时)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-slate-900/50 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img src={u.avatar} alt={u.nickname} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                              <span className="font-bold text-white">{u.nickname}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-medium">{u.role}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold">
                              {u.businessLine}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{u.registerTime}</td>
                          <td className="py-3 px-3 text-slate-400 font-mono text-[11px]">{u.lastActiveTime}</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{u.computeConsumed} 卡时</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 2. 已认证企业列表 */}
            {activeTab === 'enterprises' && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-400 font-bold flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5 text-indigo-400" />
                    <span>产业链筛选：</span>
                  </span>
                  {['全部', '智能制造', '电子信息', '生物医药', '新能源', '文旅', '城市治理'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setFilterCategory(cat)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        filterCategory === cat
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                          : 'bg-slate-950/80 text-slate-400 border border-slate-800 hover:text-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-bold uppercase text-[11px]">
                        <th className="py-3 px-4">企业全称</th>
                        <th className="py-3 px-3">所属主导产业链</th>
                        <th className="py-3 px-3">企业资质</th>
                        <th className="py-3 px-3 text-center">发任务数</th>
                        <th className="py-3 px-3 text-center">委托实训数</th>
                        <th className="py-3 px-4 text-right">算力卡时消耗</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredEnterprises.map(e => (
                        <tr key={e.id} className="hover:bg-slate-900/50 transition">
                          <td className="py-3 px-4 font-bold text-white">{e.name}</td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-medium text-[11px]">
                              {e.industry}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[11px] font-bold">
                              {e.status}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">{e.tasksPublishedCount} 个</td>
                          <td className="py-3 px-3 text-center font-mono font-bold text-slate-200">{e.trainingsSponsoredCount} 期</td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">{e.computeConsumed} 卡时</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. 产业案例/成果列表 */}
            {activeTab === 'cases' && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {filteredCases.map(c => (
                    <div
                      key={c.id}
                      onClick={() => onSelectCase && onSelectCase(c)}
                      className="p-4 bg-slate-950/80 border border-slate-800 hover:border-indigo-500/50 rounded-2xl space-y-2.5 transition cursor-pointer group shadow-sm"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 text-[11px] font-bold">
                          {c.industry}
                        </span>
                        <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black ${
                          c.status === '已落地' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                          c.status === '试点中' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                          'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        }`}>
                          {c.status}
                        </span>
                      </div>

                      <h4 className="text-sm font-extrabold text-white group-hover:text-indigo-300 transition line-clamp-1">
                        {c.title}
                      </h4>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-medium">
                        {c.problemSolved}
                      </p>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                        <span>企业：{c.enterpriseName}</span>
                        <span className="text-emerald-400 font-mono font-bold">算力：{c.computeConsumed} 卡时</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. 人才台账列表 */}
            {activeTab === 'talents' && (
              <div className="space-y-3">
                <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/60">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 bg-slate-900/90 text-slate-400 font-bold uppercase text-[11px]">
                        <th className="py-3 px-4">人才姓名</th>
                        <th className="py-3 px-3">人才分类标记</th>
                        <th className="py-3 px-4">完成结业实训 / 认证项目</th>
                        <th className="py-3 px-3">发证/结业日期</th>
                        <th className="py-3 px-4">当前就业/协同服务状态</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {filteredTalents.map(t => (
                        <tr key={t.id} className="hover:bg-slate-900/50 transition">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <img src={t.avatar} alt={t.name} className="w-7 h-7 rounded-full object-cover border border-slate-700" />
                              <span className="font-bold text-white">{t.name}</span>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[11px] font-bold">
                              {t.type}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-medium text-slate-200">{t.courseOrCert}</td>
                          <td className="py-3 px-3 font-mono text-slate-400 text-[11px]">{t.certDate}</td>
                          <td className="py-3 px-4 font-bold text-indigo-300">{t.currentStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

          </div>

          {/* 模态窗底部 */}
          <div className="px-6 py-4 border-t border-slate-800/80 bg-slate-950/80 flex items-center justify-between shrink-0 text-xs text-slate-400">
            <div>
              数据刷新频率：<span className="text-slate-200 font-mono font-bold">实时/每日 24:00</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold transition cursor-pointer"
            >
              关闭
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
