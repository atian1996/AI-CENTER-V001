import React, { useState, useMemo } from 'react';
import {
  Receipt,
  X,
  Building2,
  Calendar,
  Layers,
  Coins,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { ComputePoolItem } from '../../../../types';

interface SettlementGenerateModalProps {
  pools: ComputePoolItem[];
  onClose: () => void;
  onGenerate: (operator: string, period: string) => void;
}

export const SettlementGenerateModal: React.FC<SettlementGenerateModalProps> = ({
  pools,
  onClose,
  onGenerate
}) => {
  const operatorOptions = useMemo(() => {
    const list = Array.from(new Set(pools.map(p => p.operator)));
    if (!list.includes('中国电信天翼云')) list.push('中国电信天翼云');
    if (!list.includes('中国移动九天算力')) list.push('中国移动九天算力');
    if (!list.includes('中国联通沃云智算')) list.push('中国联通沃云智算');
    if (!list.includes('火山引擎智算节点')) list.push('火山引擎智算节点');
    return list;
  }, [pools]);

  const [selectedOperator, setSelectedOperator] = useState(operatorOptions[0] || '中国电信天翼云');
  const [selectedPeriod, setSelectedPeriod] = useState('2026-08');

  // 获取匹配资源池中配置的协议价格
  const matchedPool = useMemo(() => {
    return pools.find(p => p.operator.includes(selectedOperator) || selectedOperator.includes(p.operator));
  }, [pools, selectedOperator]);

  const agreedList = matchedPool?.agreedPricings || [
    { gpuModel: 'NVIDIA RTX 4090', agreedPrice: 1.45, effectiveDate: '2026-01-01' },
    { gpuModel: 'NVIDIA A100-SXM4-80GB', agreedPrice: 6.80, effectiveDate: '2026-01-01' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate(selectedOperator, selectedPeriod);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-xl">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">生成算力消耗对账结算单</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                按运营商与指定账期，拉取实际 GPU 运行时长生成正式核算单据
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4.5 text-xs">
          {/* 选择运营商 */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              <span>选择结算运营商</span>
            </label>
            <select
              value={selectedOperator}
              onChange={e => setSelectedOperator(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 text-xs"
            >
              {operatorOptions.map(op => (
                <option key={op} value={op}>{op}</option>
              ))}
            </select>
          </div>

          {/* 选择账期 */}
          <div>
            <label className="block font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>选择结算账期 (按月结算)</span>
            </label>
            <select
              value={selectedPeriod}
              onChange={e => setSelectedPeriod(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-200 font-mono focus:outline-none focus:border-indigo-500 text-xs"
            >
              <option value="2026-08">2026-08 (本期：2026年8月)</option>
              <option value="2026-07">2026-07 (上期：2026年7月)</option>
              <option value="2026-06">2026-06 (历史账期)</option>
              <option value="2026-05">2026-05 (历史账期)</option>
            </select>
          </div>

          {/* 该运营商绑定的协议结算价格预览 */}
          <div className="space-y-2">
            <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
              <Layers className="w-3 h-3 text-cyan-400" />
              <span>关联生效中的协议单价标准:</span>
            </span>

            <div className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950/60 p-2.5">
              <div className="space-y-1.5">
                {agreedList.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-[11px] font-mono">
                    <span className="text-slate-300 font-sans">{item.gpuModel}</span>
                    <span className="text-cyan-400 font-bold">¥{item.agreedPrice.toFixed(2)} / 卡·时</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-indigo-950/20 border border-indigo-500/20 rounded-xl text-slate-300 text-[11px] space-y-1">
            <div className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5" />
              <span>自动化核算规则说明:</span>
            </div>
            <p className="text-slate-400">
              系统将扫描账期内所有关联该运营商资源池的运行实例，按秒级计费累计精确换算为小时数，自动应用生效协议单价核算应付成本与毛利率，初始状态为<b>【待对账】</b>。
            </p>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold transition cursor-pointer"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold shadow-md shadow-indigo-500/20 transition cursor-pointer flex items-center gap-1.5"
            >
              <span>立即开始核算并生成对账单</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
