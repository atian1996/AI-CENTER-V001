import React, { useState } from 'react';
import {
  FileText,
  X,
  Calendar,
  Building2,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  Coins,
  ShieldCheck,
  Receipt,
  UserCheck,
  Send,
  Mail,
  FileSignature,
  FileSpreadsheet
} from 'lucide-react';
import { ComputeSettlementItem } from '../../../../types';
import { useApp } from '../../../../context/AppContext';

interface SettlementDetailModalProps {
  settlement: ComputeSettlementItem;
  onClose: () => void;
}

// 辅助函数：将数字金额转换为中文大写人民币金额
const convertToChineseAmount = (n: number): string => {
  const fraction = ['角', '分'];
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖'];
  const unit = [
    ['元', '万', '亿'],
    ['', '拾', '佰', '仟'],
  ];
  let s = '';
  // 处理角分
  const cents = Math.round(n * 100);
  const jiao = Math.floor(cents / 10) % 10;
  const fen = cents % 10;
  
  if (jiao === 0 && fen === 0) {
    s = '整';
  } else {
    if (jiao > 0) s += digit[jiao] + '角';
    else if (fen > 0) s += '零';
    if (fen > 0) s += digit[fen] + '分';
  }

  let value = Math.floor(n);
  for (let i = 0; i < unit[0].length && value > 0; i++) {
    let p = '';
    for (let j = 0; j < unit[1].length && value > 0; j++) {
      p = digit[value % 10] + unit[1][j] + p;
      value = Math.floor(value / 10);
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s;
  }
  
  return s.replace(/(零.)*零元/, '元')
          .replace(/(零.)+/g, '零')
          .replace(/^整$/, '零元整')
          .replace(/^元/, '');
};

export const SettlementDetailModal: React.FC<SettlementDetailModalProps> = ({
  settlement,
  onClose
}) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'invoice_preview'>('overview');
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailProgress, setEmailProgress] = useState(0);
  const [targetEmail, setTargetEmail] = useState(`finance@${settlement.operator === '中国电信' ? 'chinatelecom.cn' : settlement.operator === '中国联通' ? 'chinaunicom.cn' : 'chinamobile.com'}`);
  const [showEmailModal, setShowEmailModal] = useState(false);

  // 格式化 CSV 导出
  const handleExportStatement = () => {
    const headers = ['GPU型号规格', '消耗卡时(小时)', '占比(%)', '协议单价(元/卡时)', '小计应付金额(元)'];
    const rows = settlement.specDetails.map(s => [
      s.gpuModel,
      s.hours,
      s.percentage,
      s.agreedPrice.toFixed(2),
      s.subtotal.toFixed(2)
    ]);

    const info = [
      `对账结算结算单 (官方凭证)`,
      `对账单号: ${settlement.statementNo || settlement.id}`,
      `运营商: ${settlement.operator}`,
      `账期: ${settlement.period}`,
      `结算状态: ${settlement.status}`,
      `生成日期: ${settlement.createdAt || '-'}`,
      `发票登记号: ${settlement.invoiceNo || '未登记'}`,
      `打款结算流水凭证: ${settlement.paymentVoucher || '未登记'}`,
      `总应付运营商金额: ¥${settlement.payableAmount.toFixed(2)}`,
      `平台前台总营收: ¥${settlement.platformRevenue.toFixed(2)}`,
      `平台结算净毛利: ¥${settlement.platformGrossProfit.toFixed(2)} (${settlement.grossMargin}%)`,
      ''
    ];

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [
      ...info,
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `算力工坊对账单_${settlement.statementNo || settlement.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('账单数据明细 CSV 导出成功！');
  };

  // 模拟下载电子对账单PDF
  const handleDownloadPDF = () => {
    showToast('正在生成高保真 PDF 电子盖章对账单...');
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#';
      showToast(`对账单 PDF 模拟下载完成 (对账单号: ${settlement.statementNo || settlement.id})`);
    }, 1200);
  };

  // 模拟向运营商发送邮件
  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetEmail.trim()) {
      showToast('请输入有效的接收邮箱地址');
      return;
    }
    setIsSendingEmail(true);
    setEmailProgress(10);
    
    const interval = setInterval(() => {
      setEmailProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsSendingEmail(false);
            setShowEmailModal(false);
            setEmailProgress(0);
            showToast(`对账结算单已成功发送至：${targetEmail}！附带正式签章 PDF 账单与消耗明细附件。`);
          }, 400);
          return 100;
        }
        return prev + 30;
      });
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn text-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">
                  结算详情 - {settlement.statementNo || settlement.id}
                </h3>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                    settlement.status === '已结算'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : settlement.status === '已确认'
                      ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                  }`}
                >
                  {settlement.status}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {settlement.operator} · {settlement.period} 结算账期
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab 控制切换（高级交互体验） */}
        <div className="px-6 bg-slate-950/30 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-3 px-1 font-semibold border-b-2 text-xs transition relative cursor-pointer ${
                activeTab === 'overview'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              对账结算大盘
            </button>
            <button
              onClick={() => setActiveTab('invoice_preview')}
              className={`py-3 px-1 font-semibold border-b-2 text-xs transition relative cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'invoice_preview'
                  ? 'border-indigo-500 text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileSignature className="w-3.5 h-3.5" />
              <span>电子盖章账单预览 (A4)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeTab === 'overview' ? (
              <button
                onClick={handleExportStatement}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-slate-400" />
                <span>导出 CSV 报表</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setShowEmailModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-lg text-xs font-semibold border border-indigo-500/30 transition cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>模拟发送邮件</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-slate-400" />
                  <span>下载 PDF 格式</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 bg-slate-900/40">
          
          {activeTab === 'overview' ? (
            <div className="space-y-6">
              {/* 基本信息摘要 */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-950/60 border border-slate-800 rounded-xl font-mono">
                <div>
                  <span className="text-slate-500 block text-[11px] font-sans mb-0.5">结算运营商</span>
                  <span className="text-slate-200 font-semibold font-sans">{settlement.operator}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-sans mb-0.5">对账账期</span>
                  <span className="text-indigo-400 font-semibold">{settlement.period}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-sans mb-0.5">实际消耗卡时</span>
                  <span className="text-slate-200 font-semibold">{settlement.totalCardHours.toLocaleString()} hrs</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[11px] font-sans mb-0.5">账单生成时间</span>
                  <span className="text-slate-400 text-[11px] font-sans">{settlement.createdAt || '-'}</span>
                </div>
              </div>

              {/* 规格消耗明细表 */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-indigo-400" />
                    <span>GPU 规格实际用量与结算核算清单</span>
                  </h4>
                  <span className="text-[11px] text-slate-400 font-medium">依据运营商实际算力池 API 同步</span>
                </div>

                <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-950/40">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-slate-400 text-[10px] uppercase font-semibold border-b border-slate-800">
                      <tr>
                        <th className="py-2.5 px-4 font-sans">GPU 规格型号</th>
                        <th className="py-2.5 px-3 text-center">实际消耗卡时</th>
                        <th className="py-2.5 px-3 text-center">用量占比</th>
                        <th className="py-2.5 px-3 text-right">协议单价</th>
                        <th className="py-2.5 px-4 text-right">结算应付小计</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {settlement.specDetails.map((spec, i) => (
                        <tr key={i} className="hover:bg-slate-800/30">
                          <td className="py-2.5 px-4 font-sans font-semibold text-slate-200">
                            {spec.gpuModel}
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            {spec.hours.toLocaleString()} h
                          </td>
                          <td className="py-2.5 px-3 text-center text-slate-400">
                            {spec.percentage}%
                          </td>
                          <td className="py-2.5 px-3 text-right text-cyan-400">
                            ¥{spec.agreedPrice.toFixed(2)}/h
                          </td>
                          <td className="py-2.5 px-4 text-right font-bold text-slate-100">
                            ¥{spec.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 财务指标对比卡 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block mb-1">采购成本 (应付运营商)</span>
                  <div className="text-base font-bold font-mono text-white">
                    ¥{settlement.payableAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">按双方约定的协议价格计费</span>
                </div>

                <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-xl">
                  <span className="text-[11px] text-slate-400 block mb-1">平台前台总营收</span>
                  <div className="text-base font-bold font-mono text-emerald-400">
                    ¥{settlement.platformRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">用户在平台上产生的总充值与扣费</span>
                </div>

                <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-xl">
                  <span className="text-[11px] text-indigo-300 block mb-1">平台账面毛利 (毛利率)</span>
                  <div className="text-base font-bold font-mono text-indigo-300">
                    ¥{settlement.platformGrossProfit.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    <span className="text-xs ml-1 font-semibold text-emerald-400">({settlement.grossMargin}%)</span>
                  </div>
                  <span className="text-[10px] text-indigo-400/70 mt-1 block">扣除采购成本后的算力服务净利润</span>
                </div>
              </div>

              {/* 审计与结算发票凭证信息 */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Receipt className="w-4 h-4 text-emerald-400" />
                  <span>审计、发票凭证与打款流水归档记录</span>
                </h4>

                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2.5 font-mono">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-2 border-b border-slate-800/80">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-sans">财务审核确认人:</span>
                      <span className="text-slate-300 font-sans">{settlement.confirmedBy || (settlement.status !== '待对账' ? '管理员 (财务部)' : '待核对')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-sans">复核确认时间:</span>
                      <span className="text-slate-300">{settlement.confirmedAt || (settlement.status !== '待对账' ? settlement.createdAt : '-')}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-slate-500 block text-[11px] font-sans">发票存根号:</span>
                      <span className="text-slate-200 font-semibold">{settlement.invoiceNo || (settlement.status === '已结算' ? 'INV-993218520' : '等候登记开票')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-sans">打款流水回执:</span>
                      <span className="text-emerald-400 font-semibold">{settlement.paymentVoucher || (settlement.status === '已结算' ? 'VOUCHER-99381204' : '等候打款')}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[11px] font-sans">结算归档日期:</span>
                      <span className="text-slate-300">{settlement.settledAt || '-'}</span>
                    </div>
                  </div>

                  {settlement.remark && (
                    <div className="pt-2 border-t border-slate-800/80 font-sans text-slate-400 text-[11px]">
                      财务附言 / 结算说明: {settlement.remark}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            /* 电子盖章账单预览 (A4 纯正质感，符合高端 C 端/SaaS 严谨排版) */
            <div className="bg-white text-slate-900 p-8 rounded-xl shadow-xl border border-slate-300 relative font-sans select-all mx-auto max-w-[580px] min-h-[750px] flex flex-col justify-between">
              
              {/* 盖章装饰层 */}
              <div className="absolute right-12 bottom-20 pointer-events-none opacity-85 select-none scale-[1.05]">
                {/* 鲜红色的五角星印章 SVG，高度逼真 */}
                <svg width="130" height="130" viewBox="0 0 100 100" className="transform rotate-12">
                  <circle cx="50" cy="50" r="45" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeDasharray="none" />
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#ef4444" strokeWidth="0.8" />
                  
                  {/* 中间五角星 */}
                  <polygon points="50,22 58,40 78,40 62,52 68,72 50,60 32,72 38,52 22,40 42,40" fill="#ef4444" />
                  
                  {/* 环形文字: 算力工坊财务结算专用章 */}
                  <defs>
                    <path id="textPath" d="M 12 50 A 38 38 0 1 1 88 50" fill="none" />
                  </defs>
                  <text fontFamily="SimSun, monospace" fontSize="8" fontWeight="bold" fill="#ef4444" letterSpacing="1">
                    <textPath href="#textPath" startOffset="50%" textAnchor="middle">
                      算 力 工 坊 财 务 结 算 专 用 章
                    </textPath>
                  </text>
                  
                  {/* 印章下部横排字: 电子签章 */}
                  <text x="50" y="80" fontFamily="SimSun, monospace" fontSize="7" fontWeight="bold" fill="#ef4444" textAnchor="middle" letterSpacing="1">
                    电子签章凭证
                  </text>
                </svg>
              </div>

              {/* 账单头部 */}
              <div className="space-y-4">
                <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                  <div>
                    <h1 className="text-xl font-extrabold tracking-wider text-slate-950 font-sans">
                      算力工坊 · 对账结算凭证
                    </h1>
                    <span className="text-[9px] bg-slate-900 text-white font-mono font-bold px-1.5 py-0.5 rounded uppercase tracking-wide">
                      Compute Statement
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-slate-500 uppercase font-bold tracking-tight">对账单编号 / Invoice No</div>
                    <div className="font-mono font-bold text-slate-900 text-[11px]">{settlement.statementNo || settlement.id}</div>
                  </div>
                </div>

                {/* 结算双方基本信息表 */}
                <div className="grid grid-cols-2 gap-4 text-[10px] bg-slate-100/80 p-3 rounded-lg border border-slate-200">
                  <div className="space-y-1">
                    <div className="text-slate-500 font-bold uppercase tracking-tight">付款方 (委托平台) / PAYER</div>
                    <div className="font-bold text-slate-800 text-[11px]">算力工坊智能算力调度中心</div>
                    <div className="text-slate-600">地址: 中国(上海)自由贸易试验区临港新片区</div>
                    <div className="text-slate-600">服务电话: 400-820-8820</div>
                  </div>
                  <div className="space-y-1 border-l border-slate-300 pl-4">
                    <div className="text-slate-500 font-bold uppercase tracking-tight">收款方 (运营商) / BENEFICIARY</div>
                    <div className="font-bold text-slate-800 text-[11px]">{settlement.operator}</div>
                    <div className="text-slate-600">核对账期: <span className="font-mono font-bold text-slate-800">{settlement.period}</span></div>
                    <div className="text-slate-600">运营商状态: 已核准确认 ({settlement.status})</div>
                  </div>
                </div>

                {/* 主账单明细表格 */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">
                    算力消耗与协议采购结算明细 / Itemized Usage
                  </div>
                  
                  <table className="w-full text-left border-collapse border border-slate-300 text-[10px] font-sans">
                    <thead>
                      <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300 text-[9px] uppercase tracking-wider">
                        <th className="py-2 px-3 border-r border-slate-300">GPU 算力型号规格</th>
                        <th className="py-2 px-2 border-r border-slate-300 text-center">实际消耗卡时</th>
                        <th className="py-2 px-2 border-r border-slate-300 text-center">占比</th>
                        <th className="py-2 px-2 border-r border-slate-300 text-right">协议单价</th>
                        <th className="py-2 px-3 text-right">结算金额 (小计)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-slate-700">
                      {settlement.specDetails.map((spec, i) => (
                        <tr key={i}>
                          <td className="py-2 px-3 border-r border-slate-300 font-sans font-bold text-slate-900">
                            {spec.gpuModel}
                          </td>
                          <td className="py-2 px-2 border-r border-slate-300 text-center text-slate-900">
                            {spec.hours.toLocaleString()} h
                          </td>
                          <td className="py-2 px-2 border-r border-slate-300 text-center text-slate-500">
                            {spec.percentage}%
                          </td>
                          <td className="py-2 px-2 border-r border-slate-300 text-right text-slate-800">
                            ¥{spec.agreedPrice.toFixed(2)}/h
                          </td>
                          <td className="py-2 px-3 text-right text-slate-900 font-bold">
                            ¥{spec.subtotal.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 资金总额总结与大写 */}
                <div className="mt-4 border border-slate-300 rounded-lg overflow-hidden bg-slate-50">
                  <div className="grid grid-cols-12 border-b border-slate-200 p-2.5 text-[10px]">
                    <div className="col-span-3 text-slate-500 font-bold">人民币大写:</div>
                    <div className="col-span-9 font-bold text-slate-900 text-[11px] font-sans">
                      {convertToChineseAmount(settlement.payableAmount)}
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-2.5 bg-slate-100/60 text-[11px]">
                    <div className="text-slate-600 font-bold uppercase tracking-tight">结算应付总额 / Grand Total Payable:</div>
                    <div className="font-mono font-extrabold text-red-600 text-sm">
                      ¥{settlement.payableAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </div>
                  </div>
                </div>
              </div>

              {/* 账单底注、备注与签名盖章栏 */}
              <div className="border-t border-slate-300 pt-3 text-[9px] text-slate-500 space-y-2 mt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="font-bold text-slate-700 mb-1">付款核算与出账说明 / REMARKS:</div>
                    <p className="leading-relaxed font-sans">
                      本单据为算力工坊针对底层运营商算力池进行的月度对账结算结算单。核对完成后，双方即作为开票及款项清退依据。
                    </p>
                  </div>
                  <div className="text-right self-end">
                    <div className="text-slate-400 font-mono text-[8px] mb-1">系统生成电子认证签章</div>
                    <div className="font-bold text-slate-800 text-[10px] font-sans">算力工坊财务运营中心</div>
                    <div className="text-[9px] text-slate-500 font-mono mt-0.5">{settlement.createdAt || '2026-08-19'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between">
          <div className="text-slate-500 text-[10px]">
            {activeTab === 'invoice_preview' ? (
              <span className="flex items-center gap-1 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>电子账单防伪码：<b>9A38D-F91A-208C</b></span>
              </span>
            ) : (
              <span>* 数据采用秒级算力消耗时段进行折合核算</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition cursor-pointer"
          >
            关闭详情
          </button>
        </div>
      </div>

      {/* 模拟发送邮件的配置 Drawer */}
      {showEmailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn text-xs">
          <div className="bg-slate-900 border border-slate-800 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" />
                <h4 className="font-bold text-slate-200 text-xs">模拟发送电子对账单邮件</h4>
              </div>
              <button
                onClick={() => setShowEmailModal(false)}
                className="text-slate-400 hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isSendingEmail ? (
              <div className="py-6 text-center space-y-3">
                <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <div className="text-slate-300 font-semibold">正在封装电子对账单PDF并加密发送...</div>
                <div className="w-full bg-slate-950 h-1.5 rounded-full overflow-hidden max-w-[200px] mx-auto">
                  <div
                    className="bg-indigo-500 h-full transition-all duration-300"
                    style={{ width: `${emailProgress}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-500 font-mono">发送进度: {emailProgress}%</div>
              </div>
            ) : (
              <form onSubmit={handleSendEmail} className="space-y-3">
                <div>
                  <label className="block text-slate-400 font-medium mb-1">运营商结算部接收邮箱:</label>
                  <input
                    type="email"
                    required
                    value={targetEmail}
                    onChange={e => setTargetEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-mono"
                    placeholder="请输入接收邮箱"
                  />
                </div>

                <div className="text-[11px] text-slate-400 space-y-1">
                  <p><b>邮件附件列表:</b></p>
                  <ul className="list-disc list-inside text-[10px] pl-1 space-y-0.5 font-mono">
                    <li>📄 对账结算单_PDF_带有电子签章.pdf</li>
                    <li>📊 GPU消耗小时级采样明细表.csv</li>
                  </ul>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-semibold shadow-md shadow-indigo-600/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <Send className="w-3 h-3" />
                    <span>立即发送</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
