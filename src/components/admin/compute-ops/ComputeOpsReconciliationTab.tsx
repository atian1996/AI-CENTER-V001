import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Filter,
  ChevronDown,
  CheckCircle2,
  Clock,
  Layers,
  Coins,
  ArrowUpRight,
  Play,
  Pause,
  Server,
  FileSpreadsheet,
  FileText,
  Download,
  DollarSign,
  TrendingUp,
  Cpu,
  Info
} from 'lucide-react';
import {
  mockPoolReconciliationList,
  mockBusinessReconciliationList,
  mockConsumptionDetails,
  ConsumptionDetailRow
} from './mockComputeOpsData';
import { useApp } from '../../../context/AppContext';

interface ComputeOpsReconciliationTabProps {
  onSelectInstance: (item: ConsumptionDetailRow) => void;
}

export const ComputeOpsReconciliationTab: React.FC<ComputeOpsReconciliationTabProps> = ({
  onSelectInstance
}) => {
  const { showToast } = useApp();

  // 1. 筛选状态
  const [selectedPeriod, setSelectedPeriod] = useState<string>('2026年9月');
  const [selectedPool, setSelectedPool] = useState<string>('全部');
  const [selectedBusiness, setSelectedBusiness] = useState<string>('全部');

  // 结算状态：已支付 / 待支付
  const [settlementStatus, setSettlementStatus] = useState<'已支付' | '待支付'>('已支付');

  // 导出下拉菜单状态
  const [showExportMenu, setShowExportMenu] = useState<boolean>(false);

  // 消耗明细滚动走马灯
  const [isTickerPlaying, setIsTickerPlaying] = useState<boolean>(true);
  const [tickerOffset, setTickerOffset] = useState<number>(0);

  // 筛选后的消耗明细
  const filteredDetails = useMemo(() => {
    let list = [...mockConsumptionDetails];
    if (selectedPool !== '全部') {
      list = list.filter(item => item.poolName === selectedPool);
    }
    if (selectedBusiness !== '全部') {
      list = list.filter(item => item.businessLine === selectedBusiness);
    }
    return list.length > 0 ? list : mockConsumptionDetails;
  }, [selectedPool, selectedBusiness]);

  // 滚动计时器：每 5 秒自动向上滚动一行
  useEffect(() => {
    if (!isTickerPlaying) return;
    const interval = setInterval(() => {
      setTickerOffset(prev => (prev + 1) % filteredDetails.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isTickerPlaying, filteredDetails.length]);

  // 导出操作
  const handleExportExcel = () => {
    setShowExportMenu(false);
    showToast(`已成功导出《${selectedPeriod}算力对账明细表.xlsx》`);
  };

  const handleExportPdf = () => {
    setShowExportMenu(false);
    showToast(`已成功导出《${selectedPeriod}算力对账结算单.pdf》`);
  };

  const toggleSettlementStatus = () => {
    const nextStatus = settlementStatus === '已支付' ? '待支付' : '已支付';
    setSettlementStatus(nextStatus);
    showToast(`结算状态已切换为【${nextStatus}】`);
  };

  return (
    <div className="w-full text-slate-100 flex flex-col gap-5 select-none font-sans">
      
      {/* ========================================================
          区域一：顶部标题栏 (约 60px)
          - 左侧: 算力运营中心 · 算力对账明细 (标题固定)
          - 中间: 无
          - 右侧: 2026年10月12日 + 【导出对账单】按钮 (导出PDF/Excel)
         ======================================================== */}
      <div className="flex items-center justify-between px-1 shrink-0 h-[60px] bg-slate-900/60 border border-slate-800/80 rounded-2xl px-4 shadow-sm">
        {/* 左侧标题 */}
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
          <h2 className="text-base font-black text-white tracking-wide flex items-center gap-2">
            算力运营中心 · 算力对账明细
          </h2>
        </div>

        {/* 右侧：当前日期 + 【导出对账单】按钮 */}
        <div className="flex items-center gap-3 relative">

          {/* 导出对账单下拉按钮 */}
          <div className="relative">
            <button
              onClick={() => setShowExportMenu(prev => !prev)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-md shadow-blue-600/30 border border-blue-400/40 cursor-pointer active:scale-95"
            >
              <Download className="w-3.5 h-3.5" />
              <span>导出对账单</span>
              <ChevronDown className="w-3.5 h-3.5 ml-0.5 opacity-80" />
            </button>

            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl py-1.5 z-50">
                <button
                  onClick={handleExportExcel}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition"
                >
                  <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                  <div>
                    <div className="font-bold">导出为 Excel 表格</div>
                    <div className="text-[10px] text-slate-400">含资源池与明细流水 (.xlsx)</div>
                  </div>
                </button>
                <div className="h-px bg-slate-800 my-1" />
                <button
                  onClick={handleExportPdf}
                  className="w-full px-3.5 py-2 text-left text-xs text-slate-200 hover:bg-slate-800 flex items-center gap-2 cursor-pointer transition"
                >
                  <FileText className="w-4 h-4 text-purple-400" />
                  <div>
                    <div className="font-bold">导出为 PDF 结算单</div>
                    <div className="text-[10px] text-slate-400">含公章电子凭证 (.pdf)</div>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================
          区域二：第一行 筛选栏 (约 60px)
          - 对账周期: 下拉选择 (年月，默认 2026年9月)
          - 资源池: 全部 / 电信云-华东1 / 移动云-华北2 / 联通云-华南1 (默认 全部)
          - 业务线: 全部 / 赛事 / 实训 / 实验场 / 模型调用 / Agent调用 (默认 全部)
          - 说明: 大屏默认展示“本月”+“全部”数据，如需切换可在后台管理界面操作，大屏端仅做展示。
         ======================================================== */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 px-4 py-2.5 flex items-center justify-between shadow-md shrink-0 h-[60px]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
            <Filter className="w-3.5 h-3.5 text-blue-400" />
            <span>筛选维度</span>
          </div>

          {/* 对账周期 */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-400 font-medium">对账周期:</label>
            <div className="relative">
              <select
                value={selectedPeriod}
                onChange={e => setSelectedPeriod(e.target.value)}
                aria-label="选择对账周期"
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="2026年9月">2026年9月</option>
                <option value="2026年10月">2026年10月</option>
                <option value="2026年8月">2026年8月</option>
                <option value="2026年7月">2026年7月</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 资源池 */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-400 font-medium">资源池:</label>
            <div className="relative">
              <select
                value={selectedPool}
                onChange={e => setSelectedPool(e.target.value)}
                aria-label="选择资源池"
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="全部">全部</option>
                <option value="电信云-华东1">电信云-华东1</option>
                <option value="移动云-华北2">移动云-华北2</option>
                <option value="联通云-华南1">联通云-华南1</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>

          {/* 业务线 */}
          <div className="flex items-center gap-2">
            <label className="text-[11px] text-slate-400 font-medium">业务线:</label>
            <div className="relative">
              <select
                value={selectedBusiness}
                onChange={e => setSelectedBusiness(e.target.value)}
                aria-label="选择业务线"
                className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-blue-500 font-medium"
              >
                <option value="全部">全部</option>
                <option value="赛事">赛事</option>
                <option value="实训">实训</option>
                <option value="实验场">实验场</option>
                <option value="模型调用">模型调用</option>
                <option value="Agent调用">Agent调用</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
            </div>
          </div>
        </div>

      </div>

      {/* ========================================================
          区域三：第二行 结算汇总卡片 (4个横向等宽排列，约 148px)
          结论先行，让资方一眼看到本期应付金额
          1. 本期总卡时: 12,580 卡时 | 日均 420 卡时/天 | 该周期内资方提供的算力消耗总量
          2. 本期应付金额: ¥18,870 | 环比 ↑18% | 平台应付给资方的费用
          3. 结算周期: 2026年9月 | 月度结算 | 当前对账月份
          4. 结算状态: 已支付 / 待支付 | 2026-10-05 已结清 | 已支付 / 待支付
         ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 shrink-0 h-[148px]">
        
        {/* 卡片 1: 本期总卡时 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-blue-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-blue-400" />
              <span>本期总卡时</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
              日均 420 卡时/天
            </span>
          </div>

          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-white tracking-tight leading-none">
                12,580
              </span>
              <span className="text-xs text-slate-400 font-normal ml-1">卡时</span>
            </div>
            <div className="text-xs text-blue-400 font-medium mt-1">
              资方算力平稳消纳
            </div>
          </div>

        </div>

        {/* 卡片 2: 本期应付金额 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-emerald-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>本期应付金额</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 flex items-center gap-0.5">
              <TrendingUp className="w-3 h-3" />
              环比 ↑18%
            </span>
          </div>

          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-emerald-400 tracking-tight leading-none">
                ¥18,870
              </span>
            </div>
            <div className="text-xs text-emerald-300 font-medium mt-1">
              执行协议约定单价 ¥1.50/卡时
            </div>
          </div>

        </div>

        {/* 卡片 3: 结算周期 */}
        <div className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-cyan-500/10">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>结算周期</span>
            </span>
            <span className="text-[11px] font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded-full border border-cyan-500/20">
              月度结算
            </span>
          </div>

          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl lg:text-3xl font-bold font-mono text-cyan-300 tracking-tight leading-none">
                {selectedPeriod}
              </span>
            </div>
            <div className="text-xs text-cyan-400 font-medium mt-1">
              2026-09-01 ~ 2026-09-30
            </div>
          </div>

        </div>

        {/* 卡片 4: 结算状态 */}
        <div
          onClick={toggleSettlementStatus}
          className="group p-3.5 bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-2xl flex flex-col justify-between transition-all duration-200 shadow-md hover:shadow-amber-500/10 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>结算状态</span>
            </span>
            <span className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-full border ${
              settlementStatus === '已支付'
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20'
                : 'text-amber-400 bg-amber-500/10 border-amber-500/20'
            }`}>
              {settlementStatus === '已支付' ? '2026-10-05 已结清' : '待资方确权'}
            </span>
          </div>

          <div className="my-0.5">
            <div className="flex items-baseline gap-1.5">
              <span className={`text-2xl lg:text-3xl font-bold font-mono tracking-tight leading-none ${
                settlementStatus === '已支付' ? 'text-emerald-400' : 'text-amber-400'
              }`}>
                {settlementStatus}
              </span>
            </div>
            <div className="text-xs text-slate-300 font-medium mt-1 flex items-center gap-1">
              <span>点击切换对账状态</span>
              <ArrowUpRight className="w-3 h-3 text-slate-400" />
            </div>
          </div>

        </div>

      </div>

      {/* ========================================================
          区域四：第三行
          左侧：按资源池对账明细 (50% 宽度，约 400px)
          右侧：按业务线对账明细 (50% 宽度，约 400px)
         ======================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 shrink-0 h-[400px]">
        
        {/* 左侧：按资源池对账明细 */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex flex-col justify-between shadow-md h-full">
          {/* 标题 */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500" />
              <h3 className="text-sm font-black text-white">按资源池对账明细</h3>
            </div>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto my-auto py-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/70">
                  <th className="py-2.5 px-3">资源池</th>
                  <th className="py-2.5 px-3">运营商</th>
                  <th className="py-2.5 px-3 font-mono">总卡时</th>
                  <th className="py-2.5 px-3 font-mono">协议单价</th>
                  <th className="py-2.5 px-3 font-mono">小计</th>
                  <th className="py-2.5 px-3 font-mono text-right">占比</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockPoolReconciliationList.map(item => (
                  <tr key={item.poolName} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-1.5">
                      <Server className="w-3.5 h-3.5 text-blue-400" />
                      <span>{item.poolName}</span>
                    </td>
                    <td className="py-3 px-3 text-slate-300 font-medium">
                      {item.operator}
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">
                      {item.hours.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300">
                      {item.unitPrice}
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold">
                      ¥{item.subtotal.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300 text-right font-semibold">
                      {item.percentage}%
                    </td>
                  </tr>
                ))}
                
                {/* 底部合计行加粗显示，方便资方核对总金额 */}
                <tr className="bg-slate-950/90 font-bold border-t-2 border-slate-700 text-sm">
                  <td className="py-3 px-3 text-amber-300 font-black">合计</td>
                  <td className="py-3 px-3 text-slate-500">—</td>
                  <td className="py-3 px-3 font-mono text-cyan-300 font-black">12,580</td>
                  <td className="py-3 px-3 text-slate-500">—</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-black">¥18,870</td>
                  <td className="py-3 px-3 font-mono text-slate-100 text-right font-black">100%</td>
                </tr>
              </tbody>
            </table>
          </div>


        </div>

        {/* 右侧：按业务线对账明细 */}
        <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-3.5 flex flex-col justify-between shadow-md h-full">
          {/* 标题 */}
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500" />
              <h3 className="text-sm font-black text-white">按业务线对账明细</h3>
            </div>
          </div>

          {/* 表格 */}
          <div className="overflow-x-auto my-auto py-1">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 font-semibold bg-slate-950/70">
                  <th className="py-2.5 px-3">业务线</th>
                  <th className="py-2.5 px-3 font-mono">卡时</th>
                  <th className="py-2.5 px-3 font-mono">占比</th>
                  <th className="py-2.5 px-3 font-mono text-right">应付金额</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {mockBusinessReconciliationList.map(item => (
                  <tr key={item.line} className="hover:bg-slate-800/40 transition">
                    <td className="py-3 px-3 font-bold text-white flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${
                        item.line === '赛事' ? 'bg-[#2563EB]' : item.line === '实训' ? 'bg-[#10B981]' : item.line === '实验场' ? 'bg-[#8B5CF6]' : item.line === '模型调用' ? 'bg-[#06B6D4]' : 'bg-[#F59E0B]'
                      }`} />
                      <span>{item.line}</span>
                    </td>
                    <td className="py-3 px-3 font-mono text-cyan-400 font-semibold">
                      {item.hours.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-mono text-slate-300 font-semibold">
                      {item.percentage}%
                    </td>
                    <td className="py-3 px-3 font-mono text-emerald-400 font-bold text-right">
                      ¥{item.payable.toLocaleString()}
                    </td>
                  </tr>
                ))}
                
                {/* 底部合计行加粗显示 */}
                <tr className="bg-slate-950/90 font-bold border-t-2 border-slate-700 text-sm">
                  <td className="py-3 px-3 text-amber-300 font-black">合计</td>
                  <td className="py-3 px-3 font-mono text-cyan-300 font-black">12,580</td>
                  <td className="py-3 px-3 font-mono text-slate-100 font-black">100%</td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-black text-right">¥18,870</td>
                </tr>
              </tbody>
            </table>
          </div>


        </div>

      </div>

      {/* ========================================================
          区域五：第四行 消耗明细滚动列表 (约 280px)
          展示最近消耗记录，每5秒自动向上滚动一行。
          这是对账账单的原始凭据，让资方看到每一笔消耗的构成。
          字段: 时间 ｜ 资源池 ｜ 实例ID ｜ 业务线 ｜ 卡时 ｜ 金额
          说明: 每笔消耗可点击下钻到实例详情和起止时间，满足审计追溯需求。大屏端点击弹窗展示，后台管理界面支持完整查看。
         ======================================================== */}
      <div
        className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 flex flex-col justify-between shadow-md shrink-0 h-[295px]"
        onMouseEnter={() => setIsTickerPlaying(false)}
        onMouseLeave={() => setIsTickerPlaying(true)}
      >
        {/* 标题栏与滚动控制 */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse shadow-sm shadow-cyan-400" />
            <h3 className="text-sm font-black text-white">
              消耗明细滚动列表
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsTickerPlaying(prev => !prev)}
              className="px-2.5 py-1 rounded-xl bg-slate-950 border border-slate-800 text-[10px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer transition"
            >
              {isTickerPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
              <span>{isTickerPlaying ? '暂停滚动' : '自动滚动'}</span>
            </button>
          </div>
        </div>

        {/* 表头 (严格对应字段: 时间 | 资源池 | 实例ID | 业务线 | 卡时 | 金额) */}
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-400 px-3 py-1.5 bg-slate-950/70 rounded-xl my-1">
          <span className="col-span-2">时间</span>
          <span className="col-span-2">资源池</span>
          <span className="col-span-3">实例ID</span>
          <span className="col-span-2">业务线</span>
          <span className="col-span-1 font-mono">卡时</span>
          <span className="col-span-1 font-mono">金额</span>
          <span className="col-span-1 text-right">审计下钻</span>
        </div>

        {/* 滚动显示 3 行明细 (高度恰好适配 280px) */}
        <div className="space-y-1.5 overflow-hidden flex-1 flex flex-col justify-around">
          {[0, 1, 2].map(idx => {
            const itemIndex = (tickerOffset + idx) % filteredDetails.length;
            const row = filteredDetails[itemIndex];
            if (!row) return null;
            const isHighlight = idx === 0;

            return (
              <div
                key={`${row.id}-${idx}`}
                onClick={() => onSelectInstance(row)}
                className={`grid grid-cols-12 gap-2 text-xs px-3 py-2 rounded-xl border transition-all cursor-pointer items-center ${
                  isHighlight
                    ? 'bg-slate-950/90 border-blue-500/50 text-white ring-1 ring-blue-500/20 shadow-md shadow-blue-500/5'
                    : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                }`}
              >
                <span className="col-span-2 font-mono text-[11px] text-slate-400">{row.time}</span>
                <span className="col-span-2 font-medium text-white">{row.poolName}</span>
                <span className="col-span-3 font-mono text-cyan-400 font-bold flex items-center gap-1.5">
                  <Server className="w-3 h-3 text-slate-500 shrink-0" />
                  <span className="underline decoration-slate-600 underline-offset-2">{row.instanceId}</span>
                </span>
                <div className="col-span-2">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    row.businessLine === '赛事'
                      ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      : row.businessLine === '实训'
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                      : row.businessLine === '实验场'
                      ? 'bg-purple-500/15 text-purple-300 border border-purple-500/30'
                      : row.businessLine === '模型调用'
                      ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    {row.businessLine}
                  </span>
                </div>
                <span className="col-span-1 font-mono text-white font-bold">{row.hours}卡时</span>
                <span className="col-span-1 font-mono text-emerald-400 font-bold">¥{row.amount.toFixed(2)}</span>
                <div className="col-span-1 flex justify-end">
                  <span className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-blue-300 flex items-center gap-0.5">
                    <span>详情</span>
                    <ArrowUpRight className="w-2.5 h-2.5 text-blue-400" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 底部说明 */}
        <div className="text-[11px] text-slate-400 pt-1.5 flex justify-end border-t border-slate-800/80 mt-1">
          <span className="text-slate-300 font-mono">共收录 {mockConsumptionDetails.length} 条原始上报记录</span>
        </div>
      </div>

    </div>
  );
};
