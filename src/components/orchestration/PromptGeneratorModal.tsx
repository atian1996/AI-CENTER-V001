import React, { useState } from 'react';
import { 
  Sparkles, 
  X, 
  Wand2, 
  ArrowRight, 
  Copy, 
  Check,
  RefreshCw,
  Sliders,
  CheckCircle2
} from 'lucide-react';

interface PromptGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (generatedPrompt: string) => void;
  appName?: string;
  appType?: string;
}

export const PromptGeneratorModal: React.FC<PromptGeneratorModalProps> = ({
  isOpen,
  onClose,
  onApply,
  appName = '智能助手',
  appType = 'Agent'
}) => {
  const [taskDescription, setTaskDescription] = useState('');
  const [tone, setTone] = useState<'professional' | 'concise' | 'creative' | 'technical'>('professional');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    if (!taskDescription.trim()) return;
    setIsGenerating(true);
    setTimeout(() => {
      let promptTemplate = '';
      if (appType.includes('文本生成') || appType.includes('SQL')) {
        promptTemplate = `# 角色定位
你是一个专业的 ${appName}，具备精湛的语法解析、结构化转换与代码生成能力。

## 目标与任务
将用户输入的自然语言需求及指定的目标环境/数据库 {{A}}，精确转化成为高效、安全且符合行业标准的文本/代码输出。

## 输入变量规范
- {{A}}: 目标上下文/数据库类型 (如 MySQL, Postgres, ClickHouse)
- {{default_input}}: 用户的具体业务查询与逻辑要求

## 执行指南
1. 深入分析用户输入的业务逻辑，识别核心实体、关联关系与过滤条件。
2. 确保输出的语法精确无误，自动添加索引优化建议与字段注释。
3. 严格只输出最终结果，不要有多余的寒暄与闲聊。`;
      } else if (appType.includes('Agent')) {
        promptTemplate = `# 职位描述: ${appName}
## 角色
我的主要目标是为用户提供专家级的深度分析、策略建议与决策支持。利用详尽的数据资源，结合精准的工具调用，为用户进行基础分析、实时数据检索、市场情绪分析以及宏观推演。

## 技能与工具
### 技能1: 实时信息检索
使用相关工具搜索最新的动态、财报与重大资讯。

### 技能2: 深度指标拆解
调用分析工具检索核心指标与趋势对比。

### 技能3: 结构化报告输出
整理形成专业维度的决策研报，包含背景、核心洞察、风险提示与明确建议。

## 工作流程
1. 澄清并解析用户的分析诉求与关键实体。
2. 规划并按需调用工具获取第一手数据。
3. 综合多维数据进行逻辑推理并给出清晰结论。`;
      } else {
        promptTemplate = `# 角色
你是一位经过严格训练的高效【${appName}】，专注于以精准、结构化且易于理解的方式解决用户的问题。

## 核心任务
${taskDescription}

## 交互指南
1. 先用一句话概括核心结论或执行方案。
2. 使用清晰的项目符号列出 3-5 个关键要点。
3. 语言保持客观、平实、严谨，避免套话。
4. 如遇到模糊信息，主动且礼貌地请求用户补充关键参数。`;
      }

      setGeneratedPrompt(promptTemplate);
      setIsGenerating(false);
    }, 900);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150 select-none">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-blue-50/60 to-indigo-50/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI 自动生成提示词 (Prompt)</h3>
              <p className="text-xs text-slate-500">描述您想要实现的功能，AI 将为您构建工业级高质量系统提示词</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              这个 Agent 或应用具体要做什么？ <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={taskDescription}
              onChange={(e) => setTaskDescription(e.target.value)}
              placeholder="例如：分析美股上市公司的财报与新闻，结合 Yahoo Finance 工具给出买入或持有建议，输出结构化投资分析报告..."
              className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition resize-none text-slate-800"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-600">语气风格:</span>
              {(['professional', 'concise', 'technical', 'creative'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer ${
                    tone === t 
                      ? 'bg-blue-600 text-white shadow-2xs' 
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {t === 'professional' && '专业严谨'}
                  {t === 'concise' && '精炼要点'}
                  {t === 'technical' && '技术极客'}
                  {t === 'creative' && '活泼启发'}
                </button>
              ))}
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !taskDescription.trim()}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>AI 正在构建中...</span>
                </>
              ) : (
                <>
                  <Wand2 className="w-3.5 h-3.5" />
                  <span>立即生成 Prompt</span>
                </>
              )}
            </button>
          </div>

          {generatedPrompt && (
            <div className="pt-2 border-t border-slate-100 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  AI 生成结果 (可直接预览或应用)
                </span>
                <button
                  onClick={handleCopy}
                  className="text-xs text-slate-500 hover:text-blue-600 flex items-center gap-1 cursor-pointer font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已复制' : '复制内容'}</span>
                </button>
              </div>

              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl font-mono text-xs max-h-56 overflow-y-auto leading-relaxed whitespace-pre-wrap select-text border border-slate-800">
                {generatedPrompt}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/70 rounded-xl transition cursor-pointer"
          >
            取消
          </button>
          <button
            onClick={() => {
              if (generatedPrompt) {
                onApply(generatedPrompt);
                onClose();
              }
            }}
            disabled={!generatedPrompt}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>应用到提示词</span>
          </button>
        </div>
      </div>
    </div>
  );
};
