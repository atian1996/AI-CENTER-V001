import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { mockComputeStats } from '../../../data/mockComputeAdminData';
import { UsageMetricCards } from './stats/UsageMetricCards';
import { UsageChartsSection } from './stats/UsageChartsSection';
import { UserUsageTable } from './stats/UserUsageTable';
import { SpecUsageTable } from './stats/SpecUsageTable';
import {
  BarChart3,
  Users,
  Cpu,
  Calendar,
  Layers,
  Sparkles,
  Download,
  Filter,
  Clock,
  ChevronDown,
  ArrowUpRight,
  Info
} from 'lucide-react';
import { ComputeStatsData } from '../../../types';

export const ComputeStatsAdminView: React.FC = () => {
  const { computeOrders, computeRunningInstances, computePools, showToast } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'specs'>('overview');
  const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'quarter' | 'custom'>('week');
  
  // 自定义日期状态
  const [showCustomDatePicker, setShowCustomDatePicker] = useState(false);
  const [customStartDate, setCustomStartDate] = useState('2026-08-12');
  const [customEndDate, setCustomEndDate] = useState('2026-08-19');

  // 计算自定义天数
  const customDaysCount = useMemo(() => {
    const start = new Date(customStartDate);
    const end = new Date(customEndDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;
  }, [customStartDate, customEndDate]);

  // 动态结合 AppContext 实时数据、mock 模板数据、以及选中的时间段进行多维财务/性能缩放
  const dynamicStats: ComputeStatsData = useMemo(() => {
    // 深度复制 mock 基础数据
    const base = JSON.parse(JSON.stringify(mockComputeStats)) as ComputeStatsData;

    // 1. 结合 AppContext 实时分配的系统订单和运行实例
    if (computeOrders && computeOrders.length > 0) {
      base.totalInstances = Math.max(base.totalInstances, 1280 + computeOrders.length);
    }
    if (computeRunningInstances) {
      const runningCount = computeRunningInstances.filter(i => i.status === '运行中').length;
      if (runningCount > 0) {
        base.runningInstances = runningCount;
      }
    }
    if (computePools && computePools.length > 0) {
      let totalGpu = 0;
      let usedGpu = 0;
      computePools.forEach(p => {
        if (p.distribution) {
          p.distribution.forEach(d => {
            totalGpu += d.total;
            usedGpu += d.allocated;
          });
        }
      });
      if (totalGpu > 0) {
        base.avgGpuUtilization = Number(((usedGpu / totalGpu) * 100).toFixed(1));
      }
    }

    // 2. 根据选中的时间段(TimeRange) 动态缩放数据指标，避免多区间数值完全相同的静态死板体验
    switch (timeRange) {
      case 'day':
        // 今日：营收占月营收的 1/30 (加上小幅正偏)，利用率多体现当日繁忙时段
        base.monthlyRevenue = Number((mockComputeStats.monthlyRevenue / 30 * 1.08).toFixed(2));
        base.avgGpuUtilization = Math.min(94.5, Number((base.avgGpuUtilization * 1.03).toFixed(1)));
        // 限制走势图只展示最后几个小时的微小波动
        base.utilizationTrends = base.utilizationTrends.slice(-12);
        base.instanceTrends = base.instanceTrends.slice(-2).map(item => ({
          ...item,
          createdCount: Math.round(item.createdCount / 3) || 1
        }));
        break;

      case 'week':
        // 近7天：营收占月营收的 7/30 (约 23.3%)
        base.monthlyRevenue = Number((mockComputeStats.monthlyRevenue * 0.233).toFixed(2));
        // 走势图展示全部 7 天 mock 数据
        break;

      case 'month':
        // 本月：满打满算 30 天，采用 mock 的本月总值
        base.monthlyRevenue = mockComputeStats.monthlyRevenue;
        // 走势图在 7 天基础上模拟 4 倍密度插值
        base.instanceTrends = Array.from({ length: 30 }).map((_, idx) => {
          const dateStr = new Date(Date.now() - (30 - idx) * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
          const seed = base.instanceTrends[idx % base.instanceTrends.length];
          return {
            date: dateStr,
            createdCount: Math.round((seed?.createdCount || 10) * (0.8 + Math.random() * 0.4)),
            activeCount: Math.round((seed?.activeCount || 120) * (0.9 + Math.random() * 0.2))
          };
        });
        break;

      case 'quarter':
        // 本季度：三个月营收
        base.monthlyRevenue = Number((mockComputeStats.monthlyRevenue * 2.85).toFixed(2));
        base.totalInstances = Math.round(base.totalInstances * 2.1);
        base.avgGpuUtilization = Math.max(45, Number((base.avgGpuUtilization * 0.95).toFixed(1)));
        // 走势图模拟按周采样 (季度内 12 周)
        base.instanceTrends = Array.from({ length: 12 }).map((_, idx) => {
          const dateStr = `第 ${idx + 1} 周`;
          return {
            date: dateStr,
            createdCount: Math.round(85 * (0.7 + Math.random() * 0.6)),
            activeCount: Math.round(340 * (0.85 + Math.random() * 0.3))
          };
        });
        break;

      case 'custom':
        // 自定义：按选择的实际天数比例自适应生成
        const scaleFactor = customDaysCount / 30;
        base.monthlyRevenue = Number((mockComputeStats.monthlyRevenue * scaleFactor * 1.02).toFixed(2));
        base.totalInstances = Math.max(15, Math.round(base.totalInstances * scaleFactor));
        // 动态裁剪趋势图天数
        const finalDays = Math.min(30, customDaysCount);
        base.instanceTrends = Array.from({ length: finalDays }).map((_, idx) => {
          const dateStr = new Date(new Date(customStartDate).getTime() + idx * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
          const seed = base.instanceTrends[idx % base.instanceTrends.length];
          return {
            date: dateStr,
            createdCount: Math.round((seed?.createdCount || 10) * (0.85 + Math.random() * 0.3)),
            activeCount: Math.round((seed?.activeCount || 120) * (0.9 + Math.random() * 0.25))
          };
        });
        break;
    }

    return base;
  }, [computeOrders, computeRunningInstances, computePools, timeRange, customDaysCount, customStartDate]);



  // 模拟导出 PDF/Excel 大盘综合报告
  const handleExportDashboardReport = () => {
    showToast('正在为您编译大盘多维报表分析摘要 (PDF格式)...');
    setTimeout(() => {
      showToast(`算力平台综合分析报告_${timeRange === 'custom' ? '自定义账期' : timeRange}已生成并模拟下载成功！`);
    }, 1500);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12 text-xs">
      {/* 4 项核心经营业绩统计卡片 */}
      <UsageMetricCards
        totalInstances={dynamicStats.totalInstances}
        runningInstances={dynamicStats.runningInstances}
        avgGpuUtilization={dynamicStats.avgGpuUtilization}
        monthlyRevenue={dynamicStats.monthlyRevenue}
        timeRangeLabel={
          timeRange === 'day' ? '今日' : 
          timeRange === 'week' ? '近7天' : 
          timeRange === 'month' ? '本月' : 
          timeRange === 'quarter' ? '本季度' : 
          `自定义(${customDaysCount}天)`
        }
      />

      {/* 筛选过滤与日期维度控制台 (1920 高级设计规范，轻质渐变边框) */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-xl border border-slate-800 shadow-sm relative z-20">
        
        {/* 左侧大盘分类标签页切换 */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap text-xs ${
              activeTab === 'overview'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>全景负载走势与营收分析</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap text-xs ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>用户算力用量明细</span>
            <span className="px-1.5 py-0.2 bg-indigo-500/20 text-indigo-300 rounded text-[10px]">
              {dynamicStats.userDetails?.length || 0}
            </span>
          </button>

          <button
            onClick={() => setActiveTab('specs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-semibold transition cursor-pointer whitespace-nowrap text-xs ${
              activeTab === 'specs'
                ? 'bg-gradient-to-r from-indigo-600 to-blue-600 text-white shadow-md shadow-indigo-600/10'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>GPU 芯片规格产出分析</span>
            <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded text-[10px]">
              {dynamicStats.specUsageDetails?.length || 0}
            </span>
          </button>
        </div>

        {/* 右侧高级时间筛选过滤器及日期微型卡 */}
        <div className="flex flex-wrap items-center gap-2 self-end md:self-auto justify-end">
          
          {/* 自定义时间配置小弹框，完美配合操作习惯 */}
          {timeRange === 'custom' && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-2.5 py-1.5 rounded-lg border border-slate-800/80 text-[11px] text-slate-300">
              <span className="text-slate-500">从</span>
              <input
                type="date"
                value={customStartDate}
                max={customEndDate}
                onChange={e => {
                  setCustomStartDate(e.target.value);
                  setTimeRange('custom');
                }}
                className="bg-transparent text-slate-200 font-mono focus:outline-none w-24"
              />
              <span className="text-slate-500">至</span>
              <input
                type="date"
                value={customEndDate}
                min={customStartDate}
                onChange={e => {
                  setCustomEndDate(e.target.value);
                  setTimeRange('custom');
                }}
                className="bg-transparent text-slate-200 font-mono focus:outline-none w-24"
              />
              <span className="text-slate-600">|</span>
              <span className="text-indigo-400 font-bold">{customDaysCount}天</span>
            </div>
          )}

          {/* 选项按钮组 */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 font-medium">
            <button
              onClick={() => { setTimeRange('day'); setShowCustomDatePicker(false); }}
              className={`px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                timeRange === 'day' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              今日
            </button>
            <button
              onClick={() => { setTimeRange('week'); setShowCustomDatePicker(false); }}
              className={`px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                timeRange === 'week' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              近7天
            </button>
            <button
              onClick={() => { setTimeRange('month'); setShowCustomDatePicker(false); }}
              className={`px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                timeRange === 'month' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              本月
            </button>
            <button
              onClick={() => { setTimeRange('quarter'); setShowCustomDatePicker(false); }}
              className={`px-3 py-1.5 rounded text-xs transition cursor-pointer ${
                timeRange === 'quarter' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              本季度
            </button>
            <button
              onClick={() => { setTimeRange('custom'); setShowCustomDatePicker(true); }}
              className={`px-3 py-1.5 rounded text-xs transition cursor-pointer flex items-center gap-1 ${
                timeRange === 'custom' ? 'bg-slate-800 text-white font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>自定义</span>
            </button>
          </div>

          {/* 综合导出分析报告 */}
          <button
            onClick={handleExportDashboardReport}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-semibold border border-slate-700 transition cursor-pointer whitespace-nowrap"
            title="生成当前天数及范围的 PDF 全景分析报告"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>导出大盘报告</span>
          </button>
        </div>
      </div>

      {/* 视图内容展现 */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Recharts 6 大多维关联统计走势图 */}
          <UsageChartsSection stats={dynamicStats} timeRange={timeRange === 'custom' ? 'week' : timeRange} />

          {/* 快速大盘底表明细对比 (Flatten 设计：减少卡片嵌套) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-indigo-400" />
                  <span>本月头部租户算力排行 (Top8)</span>
                </span>
                <button onClick={() => setActiveTab('users')} className="text-indigo-400 hover:text-indigo-300 text-[11px] font-semibold cursor-pointer">
                  查看全量用户明细 &rarr;
                </button>
              </div>
              <UserUsageTable data={dynamicStats.userDetails || []} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="font-bold text-slate-200 flex items-center gap-1.5">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>各 GPU 规格采购收益与负载对比表</span>
                </span>
                <button onClick={() => setActiveTab('specs')} className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold cursor-pointer">
                  查看规格贡献分析 &rarr;
                </button>
              </div>
              <SpecUsageTable data={dynamicStats.specUsageDetails || []} />
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <UserUsageTable data={dynamicStats.userDetails || []} />
      )}

      {activeTab === 'specs' && (
        <SpecUsageTable data={dynamicStats.specUsageDetails || []} />
      )}
    </div>
  );
};
