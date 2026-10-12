import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Printer,
  Download,
  FileText,
  ShieldAlert,
  CheckCircle2,
  TrendingUp,
  Building2,
  Users,
  Briefcase,
  GraduationCap,
  Sparkles,
  Calendar,
  Cpu
} from 'lucide-react';
import { EcoReportItem, mockEcoMonthlyTrends, mockEcosystemCases } from './mockEcoData';
import { useApp } from '../../../context/AppContext';

interface EcoReportPreviewModalProps {
  report: EcoReportItem | null;
  isOpen: boolean;
  onClose: () => void;
}

export const EcoReportPreviewModal: React.FC<EcoReportPreviewModalProps> = ({
  report,
  isOpen,
  onClose
}) => {
  const { showToast } = useApp();

  if (!isOpen || !report) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdf = () => {
    showToast(`正在导出 PDF 版正式报告《${report.title}.pdf》...`);
  };

  const handleDownloadWord = () => {
    showToast(`正在导出 Word 可编辑版报告《${report.title}.docx》...`);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-6 print:p-0 print:static print:z-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/85 backdrop-blur-md print:hidden"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          className="relative w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-10 text-slate-900 print:max-h-none print:shadow-none print:border-none print:rounded-none"
        >
          {/* 顶部控制工具条 */}
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 print:hidden">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-xs font-black">
                {report.type}预览
              </span>
              <h3 className="text-sm font-black text-slate-900 line-clamp-1">{report.title}</h3>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>打印预览</span>
              </button>

              <button
                onClick={handleDownloadPdf}
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 PDF ({report.fileSizePdf})</span>
              </button>

              <button
                onClick={handleDownloadWord}
                className="px-3.5 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white text-xs font-extrabold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>下载 Word ({report.fileSizeWord})</span>
              </button>

              <button
                onClick={onClose}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer ml-2"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* 报告红头 / 正式公文版式主体 */}
          <div className="flex-1 overflow-y-auto p-8 sm:p-12 space-y-10 font-serif leading-relaxed text-slate-900 bg-white">
            
            {/* 封面标题页风格 Header */}
            <div className="text-center space-y-4 pb-8 border-b-2 border-indigo-900/80">
              <div className="text-xs font-sans font-bold tracking-widest text-indigo-900 uppercase">
                ★ 市级人工智能公共服务平台运营分析报告 ★
              </div>

              <h1 className="text-2xl sm:text-3xl font-black font-sans text-slate-950 tracking-tight leading-snug">
                {report.title}
              </h1>

              <div className="flex flex-wrap items-center justify-center gap-6 font-sans text-xs text-slate-600 pt-2 font-medium">
                <span>统计周期：<strong>{report.period}</strong></span>
                <span>呈报时间：<strong>{report.createdTime}</strong></span>
                <span>文件编制：<strong>平台运营管理中心</strong></span>
              </div>
            </div>

            {/* 1. 运营摘要与整体结论 */}
            <section className="space-y-3 font-sans">
              <h2 className="text-base font-black text-indigo-950 border-l-4 border-indigo-600 pl-3 py-0.5">
                一、平台运营总体态势与核心绩效摘要
              </h2>
              <p className="text-xs text-slate-700 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                {report.summary} 截至本期报告统计节点，平台累计归集生态活跃用户 <strong>8,240</strong> 人，认证本地链主及科技企业 <strong>356</strong> 家，培育产业生态成果案例 <strong>128</strong> 项，输送高级 AI 架构师及实训人才 <strong>520</strong> 名。
              </p>
            </section>

            {/* 2. 四本账图表 */}
            <section className="space-y-4 font-sans">
              <h2 className="text-base font-black text-indigo-950 border-l-4 border-indigo-600 pl-3 py-0.5">
                二、平台“四本账”运营数据台账
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <div className="text-slate-500 font-bold">活跃用户数</div>
                  <div className="text-xl font-black font-mono text-indigo-700 mt-1">8,240</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-0.5">↑ 12% 年内</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <div className="text-slate-500 font-bold">已认证企业数</div>
                  <div className="text-xl font-black font-mono text-indigo-700 mt-1">356</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-0.5">↑ 8% 年内</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <div className="text-slate-500 font-bold">孵化案例总数</div>
                  <div className="text-xl font-black font-mono text-indigo-700 mt-1">128</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-0.5">↑ 23% 年内</div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                  <div className="text-slate-500 font-bold">实训人才总数</div>
                  <div className="text-xl font-black font-mono text-indigo-700 mt-1">520</div>
                  <div className="text-[11px] text-emerald-600 font-bold mt-0.5">↑ 15% 年内</div>
                </div>
              </div>
            </section>

            {/* 3. 典型案例摘编 */}
            <section className="space-y-4 font-sans">
              <h2 className="text-base font-black text-indigo-950 border-l-4 border-indigo-600 pl-3 py-0.5">
                三、主导产业链典型案例摘要 (摘选 3 项)
              </h2>

              <div className="space-y-3">
                {mockEcosystemCases.slice(0, 3).map((c, idx) => (
                  <div key={c.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-slate-900 text-sm">{idx + 1}. {c.title}</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded font-bold">
                        {c.status}
                      </span>
                    </div>
                    <div className="text-slate-600 font-medium">涉及企业：<strong>{c.enterpriseName}</strong> | 产业链：<strong>{c.industry}</strong></div>
                    <p className="text-slate-700 leading-relaxed font-medium">{c.problemSolved}</p>
                    <div className="text-emerald-700 font-bold pt-1">经济效益：{c.economicValue}</div>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. 算力使用台账 */}
            <section className="space-y-3 font-sans">
              <h2 className="text-base font-black text-indigo-950 border-l-4 border-indigo-600 pl-3 py-0.5">
                四、算力与 Token 真实业务使用台账
              </h2>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <div className="text-slate-500 font-medium">总消耗卡时</div>
                  <div className="text-lg font-black font-mono text-slate-900 mt-0.5">12,580 卡时</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">总消耗 Token</div>
                  <div className="text-lg font-black font-mono text-slate-900 mt-0.5">2.30 亿 Tokens</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">赛事业务占比</div>
                  <div className="text-lg font-black font-mono text-indigo-700 mt-0.5">41.3%</div>
                </div>
                <div>
                  <div className="text-slate-500 font-medium">实训业务占比</div>
                  <div className="text-lg font-black font-mono text-cyan-700 mt-0.5">30.2%</div>
                </div>
              </div>
            </section>

            {/* 5. 核心合规与“三不承诺”声明 */}
            <section className="space-y-3 font-sans pt-4 border-t border-slate-200">
              <div className="p-4 bg-amber-50 border border-amber-300/80 rounded-2xl space-y-2">
                <div className="flex items-center gap-2 text-amber-900 text-xs font-black">
                  <ShieldAlert className="w-4 h-4 text-amber-700" />
                  <span>口径说明附注与“三不承诺”政策边界划分</span>
                </div>
                <ul className="text-xs text-amber-950 font-medium space-y-1 pl-6 list-disc leading-relaxed">
                  <li><strong>不承诺消纳总量：</strong>本平台提供算力调度与公共服务，算力消纳总量受市场实际业务需求驱动，平台不承诺对算力提供方进行保底买断。</li>
                  <li><strong>不承诺短期税源：</strong>生态培育属于中长期产业基础建设，平台成果着重于技术落地与人才留存，不承诺短期直接产出特定税收额度。</li>
                  <li><strong>不承诺指标即刻达标：</strong>成果转化与产业签约受企业技术对接周期影响，平台指标依据真实履约过程逐步核销呈现。</li>
                </ul>
              </div>
            </section>

          </div>

          {/* 底部 */}
          <div className="px-6 py-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0 font-sans print:hidden">
            <span className="text-xs text-slate-500 font-mono">报告编号: {report.id}</span>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold transition cursor-pointer"
            >
              关闭预览
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
