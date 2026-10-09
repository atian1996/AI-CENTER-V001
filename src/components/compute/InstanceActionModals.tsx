import React, { useState } from 'react';
import { GPUInstance } from '../../types';
import { X, Bell, Check } from 'lucide-react';

// 1. 变更为长期租用弹窗 (参考图片 5)
export interface ChangeRentalDurationModalProps {
  isOpen: boolean;
  instance: GPUInstance | null;
  onClose: () => void;
  onConfirm: (instId: string, durationType: 'daily' | 'weekly' | 'monthly', autoReturn: boolean) => void;
}

export const ChangeRentalDurationModal: React.FC<ChangeRentalDurationModalProps> = ({
  isOpen,
  instance,
  onClose,
  onConfirm
}) => {
  const [selectedType, setSelectedType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [autoReturn, setAutoReturn] = useState(false);

  if (!isOpen || !instance) return null;

  // 根据当前实例单价核算卡片金额
  const gpuCount = instance.gpuCount || 1;
  const singleHourly = instance.hourlyCost || 0.69;
  
  const dailyPrice = Math.round(singleHourly * 22 * gpuCount);
  const weeklyPrice = Math.round(singleHourly * 22 * 7 * gpuCount);
  const monthlyPrice = Math.round(singleHourly * 22 * 30 * gpuCount);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-scale-up my-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-base font-extrabold text-slate-900">变更为长期租用</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {/* 3 套餐卡片 */}
          <div className="grid grid-cols-3 gap-3">
            {/* 日租 */}
            <div
              onClick={() => setSelectedType('daily')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                selectedType === 'daily'
                  ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {selectedType === 'daily' && (
                <Check className="w-5 h-5 text-emerald-500 absolute top-2 right-2" />
              )}
              <div className="text-xs font-bold text-slate-600">日租</div>
              <div className="mt-2 text-slate-900 font-extrabold text-lg">
                ¥ <span className="font-mono">{dailyPrice}</span>
              </div>
            </div>

            {/* 周租 */}
            <div
              onClick={() => setSelectedType('weekly')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                selectedType === 'weekly'
                  ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {selectedType === 'weekly' && (
                <Check className="w-5 h-5 text-emerald-500 absolute top-2 right-2" />
              )}
              <div className="text-xs font-bold text-slate-600">周租</div>
              <div className="mt-2 text-slate-900 font-extrabold text-lg">
                ¥ <span className="font-mono">{weeklyPrice}</span>
              </div>
            </div>

            {/* 月租 */}
            <div
              onClick={() => setSelectedType('monthly')}
              className={`p-4 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                selectedType === 'monthly'
                  ? 'border-emerald-500 bg-emerald-50/20 ring-1 ring-emerald-500'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {selectedType === 'monthly' && (
                <Check className="w-5 h-5 text-emerald-500 absolute top-2 right-2" />
              )}
              <div className="text-xs font-bold text-slate-600">月租</div>
              <div className="mt-2 text-slate-900 font-extrabold text-lg">
                ¥ <span className="font-mono">{monthlyPrice}</span>
              </div>
            </div>
          </div>

          {/* 详细规则说明 */}
          <div className="space-y-1.5 text-xs text-slate-600 leading-relaxed">
            <p>
              一次性买断该实例接下来 {selectedType === 'daily' ? '24 小时' : selectedType === 'weekly' ? '7 天' : '30 天'} 的使用权，注意该方式不支持中途提前退还实例。
            </p>
            <p>实例到期后将按下方的配置来决定自动切换为按量计费模式或是直接退还实例：</p>
          </div>

          {/* 开关：到期后自动归还实例 */}
          <div className="flex items-center gap-3 py-1">
            <button
              type="button"
              onClick={() => setAutoReturn(!autoReturn)}
              className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer ${
                autoReturn ? 'bg-slate-800' : 'bg-slate-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  autoReturn ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <span className="text-xs font-bold text-slate-800">到期后自动归还实例</span>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            若需验证环境是否可用，请先使用按量计费模式，再中途转为长期租用即可。
          </p>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(instance.id, selectedType, autoReturn)}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition shadow-xs"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  );
};


// 2. 修改实例备注弹窗 (参考图片 6)
export interface UpdateInstanceRemarkModalProps {
  isOpen: boolean;
  instance: GPUInstance | null;
  onClose: () => void;
  onSave: (instId: string, remark: string) => void;
}

export const UpdateInstanceRemarkModal: React.FC<UpdateInstanceRemarkModalProps> = ({
  isOpen,
  instance,
  onClose,
  onSave
}) => {
  const [remarkText, setRemarkText] = useState(instance?.remark || '');

  React.useEffect(() => {
    if (instance) {
      setRemarkText(instance.remark || '');
    }
  }, [instance]);

  if (!isOpen || !instance) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 animate-scale-up my-auto">
        <div className="p-6 space-y-4 text-center">
          {/* Top Blue Bell Icon */}
          <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
            <Bell className="w-6 h-6" />
          </div>

          <h3 className="text-base font-extrabold text-slate-900">修改实例备注</h3>

          <div className="pt-2 text-left">
            <input
              type="text"
              value={remarkText}
              onChange={(e) => setRemarkText(e.target.value)}
              placeholder="请输入实例备注..."
              className="w-full px-4 py-2.5 text-xs border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition"
          >
            取消
          </button>
          <button
            onClick={() => onSave(instance.id, remarkText)}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition shadow-xs"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  );
};


// 3. 创建镜像弹窗 (参考图片 7)
export interface CreateImageFromInstanceModalProps {
  isOpen: boolean;
  instance: GPUInstance | null;
  onClose: () => void;
  onConfirm: (instId: string, autoShutdown: boolean, overwrite: boolean) => void;
}

export const CreateImageFromInstanceModal: React.FC<CreateImageFromInstanceModalProps> = ({
  isOpen,
  instance,
  onClose,
  onConfirm
}) => {
  const [autoShutdown, setAutoShutdown] = useState(true);
  const [overwrite, setOverwrite] = useState(false);

  if (!isOpen || !instance) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs overflow-y-auto flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden border border-slate-100 animate-scale-up my-auto">
        <div className="p-6 space-y-4">
          {/* Icon + Title */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
              <Bell className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-extrabold text-slate-900">创建镜像</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                该操作将把当前实例制作作成一个镜像，下次可快速创建相同环境的实例。<span className="text-red-500 font-bold">镜像制作过程中实例将被关机，因此请确保没有正在运行的程序。</span>
              </p>
              <p className="text-xs text-slate-500 leading-relaxed">
                实例磁盘的使用量决定了镜像制作时间和每次开机时的拉取时间，可尽量删除无关紧要的大文件来保证最佳体验。
              </p>
            </div>
          </div>

          {/* Options */}
          <div className="pt-2 space-y-2.5 pl-16">
            <div className="text-xs font-bold text-blue-600 mb-2">当镜像制作完成后：</div>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={autoShutdown}
                onChange={(e) => setAutoShutdown(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span>自动关闭实例，停止计费</span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer text-xs font-semibold text-slate-800">
              <input
                type="checkbox"
                checked={overwrite}
                onChange={(e) => setOverwrite(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
              />
              <span>覆盖当前使用的镜像</span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold cursor-pointer transition"
          >
            取消
          </button>
          <button
            onClick={() => onConfirm(instance.id, autoShutdown, overwrite)}
            className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold cursor-pointer transition shadow-xs"
          >
            创建镜像
          </button>
        </div>
      </div>
    </div>
  );
};
