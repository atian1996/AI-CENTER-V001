import React, { useState } from 'react';
import { 
  Cpu, 
  X, 
  Check, 
  Sliders, 
  AlertTriangle, 
  Zap, 
  Sparkles,
  Info,
  Layers,
  ChevronDown
} from 'lucide-react';

interface ModelSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentModel: string;
  onSelectModel: (model: string) => void;
}

export const ModelSettingsModal: React.FC<ModelSettingsModalProps> = ({
  isOpen,
  onClose,
  currentModel,
  onSelectModel,
}) => {
  const [selectedModelId, setSelectedModelId] = useState(currentModel || 'gpt-4-1106-preview');
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.95);
  const [presencePenalty, setPresencePenalty] = useState(0.0);
  const [frequencyPenalty, setFrequencyPenalty] = useState(0.0);
  const [maxTokens, setMaxTokens] = useState(4096);
  const [responseFormat, setResponseFormat] = useState<'text' | 'json_object'>('text');

  if (!isOpen) return null;

  const modelsList = [
    {
      provider: 'OpenAI',
      models: [
        { id: 'gpt-4-1106-preview', name: 'gpt-4-1106-preview', desc: '128k 上下文，具备强大的函数调用与结构化推理能力', tag: '推荐 Agent' },
        { id: 'gpt-4o', name: 'gpt-4o', desc: '全模态旗舰模型，极速推理与复杂逻辑分析', tag: '最快响应' },
        { id: 'gpt-5.4-mini', name: 'gpt-5.4-mini', desc: '轻量高效，极低延迟与成本，适合高频 Workflow 处理', tag: '经济高效' },
      ]
    },
    {
      provider: 'DeepSeek / 开源生态',
      models: [
        { id: 'deepseek-v3', name: 'DeepSeek-V3', desc: '671B MoE 架构，顶级代码生成与数学逻辑能力', tag: '高智商' },
        { id: 'deepseek-r1', name: 'DeepSeek-R1 (推理强化)', desc: '深度思考链路 (CoT)，复杂决策与跨工具调用', tag: '深度思考' },
        { id: 'qwen-2.5-72b', name: 'Qwen-2.5-72B-Instruct', desc: '卓越的中文理解与多语言泛化支持', tag: '中文最强' }
      ]
    },
    {
      provider: 'MiniMax / 其他商业模型',
      models: [
        { id: 'abab5.5-chat', name: 'abab5.5-chat', desc: '优秀的中文长文本理解与拟人化交互', tag: '对话调优' },
        { id: 'claude-3-5-sonnet', name: 'claude-3-5-sonnet', desc: '强大的代码编写、复杂文档解析与长上下文召回', tag: '高精度' },
      ]
    }
  ];

  const handleSave = () => {
    onSelectModel(selectedModelId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">大语言模型配置与参数调优</h3>
              <p className="text-xs text-slate-500">选择满足业务场景的底座模型并配置超参数</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Layout: 2 Columns */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden">
          
          {/* Left: Model Selector (7 cols) */}
          <div className="md:col-span-7 p-5 border-r border-slate-100 overflow-y-auto space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              可用模型供应商与架构
            </div>

            {modelsList.map((grp) => (
              <div key={grp.provider} className="space-y-2">
                <div className="text-[11px] font-bold text-slate-400 px-1">{grp.provider}</div>
                <div className="space-y-1.5">
                  {grp.models.map((m) => {
                    const isSelected = selectedModelId === m.id;
                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedModelId(m.id)}
                        className={`p-3 rounded-xl border transition cursor-pointer flex items-start justify-between gap-3 ${
                          isSelected
                            ? 'bg-indigo-50/80 border-indigo-300 ring-2 ring-indigo-200/50'
                            : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-900">{m.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                              {m.tag}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 leading-normal">{m.desc}</p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                          isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Right: Hyperparameters (5 cols) */}
          <div className="md:col-span-5 p-5 bg-slate-50/50 overflow-y-auto space-y-4">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              模型推理超参数 (Hyperparameters)
            </div>

            {/* Temperature */}
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Temperature (发散度)</span>
                <span className="font-mono font-bold text-indigo-600">{temperature}</span>
              </div>
              <input
                type="range"
                min="0"
                max="2"
                step="0.05"
                value={temperature}
                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>0.0 (严谨精准)</span>
                <span>1.0 (平衡)</span>
                <span>2.0 (极具创意)</span>
              </div>
            </div>

            {/* Top P */}
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">Top P (核采样)</span>
                <span className="font-mono font-bold text-indigo-600">{topP}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={topP}
                onChange={(e) => setTopP(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Max Tokens */}
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">最大回复 Token 限制</span>
                <span className="font-mono font-bold text-indigo-600">{maxTokens}</span>
              </div>
              <input
                type="range"
                min="256"
                max="16384"
                step="256"
                value={maxTokens}
                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
            </div>

            {/* Response format */}
            <div className="space-y-1.5 bg-white p-3 rounded-xl border border-slate-200/80">
              <span className="text-xs font-semibold text-slate-700 block">返回数据格式 (Response Format)</span>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setResponseFormat('text')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                    responseFormat === 'text' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  普通纯文本 / MD
                </button>
                <button
                  type="button"
                  onClick={() => setResponseFormat('json_object')}
                  className={`py-1.5 px-2 rounded-lg text-xs font-medium border text-center transition cursor-pointer ${
                    responseFormat === 'json_object' 
                      ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-bold' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  JSON Object 结构化
                </button>
              </div>
            </div>

            {/* Note */}
            <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-[11px] text-amber-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>当前配置将作为该 Agent 编排调试及生产运行的全局模型参数。</span>
            </div>

          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-white border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-xl transition cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={handleSave}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>保存模型配置</span>
          </button>
        </div>

      </div>
    </div>
  );
};
