import React, { useState } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Sparkles, 
  Cpu, 
  Layers, 
  GitFork, 
  Plus, 
  Sliders, 
  X, 
  Check, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  HelpCircle, 
  ChevronRight, 
  ExternalLink,
  Code,
  FileText,
  AlertCircle,
  Eye,
  CheckCircle2,
  RefreshCw,
  SlidersHorizontal,
  ChevronDown,
  Info,
  Settings,
  Minimize2,
  Wand2
} from 'lucide-react';
import { ModelSettingsModal } from './ModelSettingsModal';

interface WorkflowOrchestratorProps {
  agent: AgentItem;
  model: string;
  onOpenModelModal: () => void;
}

export const WorkflowOrchestrator: React.FC<WorkflowOrchestratorProps> = ({
  agent,
  model,
  onOpenModelModal
}) => {
  const { showToast } = useApp();

  // Canvas Viewport & Zoom
  const [zoom, setZoom] = useState(90);
  const [activeTool, setActiveTool] = useState<'select' | 'hand'>('hand');
  
  // Selected Node for Right Drawer
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('node_llm');
  const [activeDrawerTab, setActiveDrawerTab] = useState<'settings' | 'last_run'>('settings');

  // Node LLM Config
  const [llmModel, setLlmModel] = useState('gpt-5.4-mini');
  const [systemPrompt, setSystemPrompt] = useState(
`角色
你是一位熟练的摘要助手，擅长把长文本转成清晰简短的摘要。

任务
阅读用户提供的文本，并写出简洁摘要。

指南
1. 先用一句话概括主要内容。
2. 然后用简单的项目符号列出 3-5 个关键要点。
3. 使用平实、日常的语言，并让摘要明显短于原文。
4. 使用与原文相同的语言撰写摘要。
5. 只输出摘要，不要塞喧、评论或解释。`
  );
  const [userPrompt, setUserPrompt] = useState('{{#node_start.input_text#}}');
  const [visionEnabled, setVisionEnabled] = useState(false);
  const [reasoningSeparation, setReasoningSeparation] = useState(false);
  const [retryOnFail, setRetryOnFail] = useState(false);
  const [exceptionHandling, setExceptionHandling] = useState<'none' | 'fallback'>('none');

  // Test Run Modal State
  const [showTestRunModal, setShowTestRunModal] = useState(false);
  const [testInputText, setTestInputText] = useState(
    '在当今快速发展的科技时代，人工智能（AI）正在从根本上改变软件开发、医疗健康与金融投资的范式。通过大语言模型与多智能体协作，自动化工作流能够处理过去需要数百工时的复杂文档萃取与逻辑归纳，大幅提升全社会的生产力与创新效率。'
  );
  const [isRunning, setIsRunning] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    status: 'success' | 'failed';
    summary: string;
    elapsedMs: number;
    tokens: number;
  } | null>(null);

  const handleTestRun = () => {
    if (!testInputText.trim()) return;
    setIsRunning(true);
    setExecutionResult(null);

    setTimeout(() => {
      setIsRunning(false);
      setExecutionResult({
        status: 'success',
        summary: `【核心概要】\n人工智能与多智能体协作正重构软件、医疗及金融领域的生产范式。\n\n【关键要点】\n• 自动化工作流大幅缩减长文档提取与归纳的耗时；\n• 大模型将数以百计的人工作业转化为毫秒级智能流水线；\n• 科技驱动全社会生产力与创新效能的系统性升级。`,
        elapsedMs: 242,
        tokens: 168
      });
      showToast('工作流测试运行成功完成！');
    }, 1000);
  };

  return (
    <div className="flex-1 flex overflow-hidden relative select-none bg-[#f8fafc]">
      
      {/* Test Run Execution Modal */}
      {showTestRunModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center">
                  <Play className="w-3.5 h-3.5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-800">测试运行工作流</h3>
                  <p className="text-xs text-slate-400">为 [开始节点] 注入测试数据以模拟真实生产执行流</p>
                </div>
              </div>
              <button 
                onClick={() => setShowTestRunModal(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  input_text (输入待摘要长文本) <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  value={testInputText}
                  onChange={(e) => setTestInputText(e.target.value)}
                  className="w-full text-xs p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none resize-none text-slate-800"
                />
              </div>

              {executionResult && (
                <div className="p-4 bg-slate-900 text-slate-100 rounded-xl space-y-2 border border-slate-800">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" />
                      执行成功 (Status 200 OK)
                    </span>
                    <span className="text-slate-400 font-mono text-[11px]">
                      耗时: {executionResult.elapsedMs}ms | 消耗: {executionResult.tokens} Tokens
                    </span>
                  </div>
                  <div className="p-3 bg-slate-950 rounded-lg font-mono text-xs text-slate-200 leading-relaxed whitespace-pre-wrap">
                    {executionResult.summary}
                  </div>
                </div>
              )}
            </div>

            <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setShowTestRunModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/70 rounded-xl"
              >
                关闭
              </button>
              <button
                onClick={handleTestRun}
                disabled={isRunning || !testInputText.trim()}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-xs transition flex items-center gap-1.5 disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>执行中...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>开始执行</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Canvas Area */}
      <div className="flex-1 h-full relative overflow-hidden bg-tech-grid">
        
        {/* Top Floating Control Bar */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
          <button
            onClick={() => setShowTestRunModal(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>测试运行</span>
            <span className="text-[10px] opacity-75 font-normal ml-0.5">Alt R</span>
          </button>
        </div>

        {/* Left Floating Tool Palette */}
        <div className="absolute left-4 top-20 z-20 bg-white border border-slate-200/90 rounded-2xl shadow-sm p-1.5 flex flex-col gap-1">
          <button 
            onClick={() => showToast('已添加新节点')}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer" 
            title="添加节点"
          >
            <Plus className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTool('select')}
            className={`p-2 rounded-xl transition cursor-pointer ${activeTool === 'select' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            title="选择工具"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setActiveTool('hand')}
            className={`p-2 rounded-xl transition cursor-pointer ${activeTool === 'hand' ? 'bg-blue-600 text-white' : 'text-slate-600 hover:bg-slate-100'}`}
            title="拖拽抓手"
          >
            <Sliders className="w-4 h-4" />
          </button>
          <button 
            onClick={() => showToast('已自动对齐画布节点布局')}
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition cursor-pointer" 
            title="自动对齐"
          >
            <Layers className="w-4 h-4" />
          </button>
        </div>

        {/* Interactive Canvas Plane with Nodes */}
        <div className="w-full h-full p-16 overflow-auto flex items-start justify-center gap-16">
          
          {/* Node 1: Start Node (开始节点 - Matches 工作流应用-编排.png) */}
          <div className="space-y-6 pt-12">
            <div 
              onClick={() => setSelectedNodeId('node_start')}
              className="w-56 bg-white border-2 border-slate-200 hover:border-blue-500 rounded-2xl shadow-xs overflow-hidden cursor-pointer transition"
            >
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">
                    <Play className="w-2.5 h-2.5 fill-current" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">开始</span>
                </div>
              </div>

              <div className="p-3 bg-white space-y-1.5">
                <div className="px-2.5 py-1.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                    <span className="text-blue-600 font-mono font-bold">{"{x}"}</span>
                    <span>input_text</span>
                  </div>
                  <span className="text-[10px] text-slate-400">必填</span>
                </div>
              </div>
            </div>

            {/* Note 1 (Yellow Sticky Note matching 工作流应用-编排.png) */}
            <div className="w-64 p-4 bg-amber-50/90 border border-amber-200 rounded-2xl shadow-2xs space-y-2 text-xs text-amber-900 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <span className="w-4 h-4 rounded-sm bg-amber-400 text-white text-[10px] flex items-center justify-center font-black">1</span>
                <span>起点</span>
              </div>
              <p className="text-[11px] text-amber-800/90">
                这里是工作流收集用户输入的地方。在这里，它会要求用户提供想要总结的文本。
              </p>
              <p className="text-[11px] text-amber-700/80 font-medium pt-1">
                <strong>按你的想法调整:</strong> 点击这个框可以重命名输入字段，也可以稍后添加更多输入项（比如语言或长度选项）。
              </p>
            </div>
          </div>

          {/* Connection Line */}
          <div className="pt-20 text-slate-300 font-bold flex items-center">
            <div className="w-12 h-0.5 bg-blue-400 relative">
              <div className="absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
            </div>
          </div>

          {/* Node 2: LLM Node (大语言模型节点 - Matches 工作流应用-编排.png) */}
          <div className="space-y-6">
            <div 
              onClick={() => setSelectedNodeId('node_llm')}
              className={`w-64 bg-white rounded-2xl shadow-xs overflow-hidden cursor-pointer transition border-2 ${
                selectedNodeId === 'node_llm' ? 'border-blue-600 ring-4 ring-blue-100' : 'border-slate-200 hover:border-blue-400'
              }`}
            >
              <div className="px-3.5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                    <Sparkles className="w-3 h-3" />
                  </div>
                  <span className="text-xs font-bold text-slate-800">大语言模型</span>
                </div>
                <span className="text-[11px] text-slate-400">•••</span>
              </div>

              <div className="p-3 bg-white space-y-2 text-xs">
                <div className="p-2 bg-slate-50 rounded-xl border border-slate-200/80 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono font-bold text-slate-800">{llmModel}</span>
                  <span className="text-[10px] px-1 bg-slate-200 text-slate-600 rounded">CHAT</span>
                </div>
                <p className="text-[11px] text-slate-400">阅读文本并写出简短摘要。</p>
              </div>
            </div>

            {/* Note 2 (Yellow Sticky Note Brain) */}
            <div className="w-72 p-4 bg-amber-50/90 border border-amber-200 rounded-2xl shadow-2xs space-y-2 text-xs text-amber-900 leading-relaxed">
              <div className="flex items-center gap-1.5 font-bold text-amber-800">
                <span className="w-4 h-4 rounded-sm bg-amber-400 text-white text-[10px] flex items-center justify-center font-black">2</span>
                <span>大脑</span>
              </div>
              <p className="text-[11px] text-amber-800/90">
                这里是 AI 真正工作的地方。它会读取开始节点中的文本，并写出摘要。
              </p>
              <div className="text-[11px] text-amber-700/90 pt-1 space-y-1">
                <p><strong>重要提示:</strong> 如果你还没安装大语言模型，请先安装配置 API Key。</p>
                <p><strong>按你的想法调整:</strong> 点击这个节点，编辑 System 中的提示词来改变结果。</p>
              </div>
            </div>

            {/* Note 3 (Purple Info Note) */}
            <div className="w-72 p-4 bg-indigo-50/80 border border-indigo-200 rounded-2xl shadow-2xs space-y-2 text-xs text-indigo-950">
              <div className="font-bold text-indigo-900">实用链接</div>
              <p className="text-[11px] text-indigo-700 cursor-pointer hover:underline">
                • 点击此处学习如何写出更好的提示词。
              </p>
              <div className="pt-2 border-t border-indigo-100 text-[11px] space-y-1">
                <div className="font-bold text-indigo-900">接下来你可以做什么</div>
                <p>• 编辑提示词，在模型节点中给 AI 添加更多指令。</p>
                <p>• 添加一个输入项（例如摘要长度）。</p>
                <p>• 发布为网页应用，让更多人使用你搭建的 AI 应用。</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Right Zoom & Minimap Controls (Matches 工作流应用-编排.png) */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          {/* Minimap Preview Box */}
          <div className="w-16 h-12 bg-white/90 border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center p-1">
            <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center gap-1">
              <div className="w-2 h-3 bg-blue-500/40 rounded-xs" />
              <div className="w-3 h-4 bg-indigo-500/40 rounded-xs" />
            </div>
          </div>

          {/* Zoom Selector */}
          <div className="bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <button 
              onClick={() => setZoom(Math.max(50, zoom - 10))}
              className="p-1 hover:text-slate-900 cursor-pointer"
            >
              -
            </button>
            <span className="w-9 text-center font-mono">{zoom}%</span>
            <button 
              onClick={() => setZoom(Math.min(150, zoom + 10))}
              className="p-1 hover:text-slate-900 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

      </div>

      {/* Right Drawer: Selected Node Properties (Matches 工作流应用-编排.png) */}
      {selectedNodeId === 'node_llm' && (
        <div className="w-[420px] h-full bg-white border-l border-slate-200 shadow-xl flex flex-col z-30 animate-in slide-in-from-right duration-200">
          
          {/* Drawer Header */}
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">大语言模型</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => setShowTestRunModal(true)}
                className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                title="单节点测试运行"
              >
                <Play className="w-3.5 h-3.5" />
              </button>
              <button 
                onClick={() => setSelectedNodeId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Sub Header: Settings / Last Run Tabs */}
          <div className="px-5 border-b border-slate-100 flex gap-4 text-xs font-bold">
            <button
              onClick={() => setActiveDrawerTab('settings')}
              className={`py-2.5 border-b-2 transition cursor-pointer ${
                activeDrawerTab === 'settings' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              设置
            </button>
            <button
              onClick={() => setActiveDrawerTab('last_run')}
              className={`py-2.5 border-b-2 transition cursor-pointer ${
                activeDrawerTab === 'last_run' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              上次运行
            </button>
          </div>

          {/* Drawer Body (Settings) */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 text-xs">
            
            {/* Model Selector */}
            <div className="space-y-1.5">
              <label className="font-bold text-slate-700 block">
                模型 <span className="text-red-500">*</span>
              </label>
              <div 
                onClick={onOpenModelModal}
                className="p-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center justify-between cursor-pointer transition"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="font-mono font-bold text-slate-800">{llmModel}</span>
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-600 rounded">CHAT</span>
                </div>
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              </div>
            </div>

            {/* Context */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-slate-600">
                <span className="font-bold">上下文</span>
                <Info className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-400">
                {"{x}"} 设置变量值
              </div>
            </div>

            {/* SYSTEM Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">SYSTEM</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{systemPrompt.length}</span>
                  <span>· Jinja</span>
                  <span className="cursor-pointer text-blue-600">{"{x}"}</span>
                </div>
              </div>
              <textarea
                rows={7}
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono text-[11px] leading-relaxed outline-none focus:bg-white focus:border-blue-500 resize-none text-slate-800"
              />
            </div>

            {/* USER Prompt */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-700">USER</span>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>{userPrompt.length}</span>
                  <span>· Jinja</span>
                  <span className="cursor-pointer text-blue-600">{"{x}"}</span>
                </div>
              </div>
              <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg font-mono text-[11px] flex items-center gap-1 w-fit">
                  <span>@ 开始</span>
                  <span className="font-bold">{"{x} input_text"}</span>
                </div>
              </div>
            </div>

            {/* Feature Toggles matching 工作流应用-编排.png */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">视觉</span>
                <button
                  onClick={() => setVisionEnabled(!visionEnabled)}
                  className={`w-7 h-4 rounded-full transition relative cursor-pointer ${
                    visionEnabled ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition ${
                    visionEnabled ? 'left-3.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 text-slate-700 font-medium">
                  <span>启用推理标签分离</span>
                  <Info className="w-3 h-3 text-slate-400" />
                </div>
                <button
                  onClick={() => setReasoningSeparation(!reasoningSeparation)}
                  className={`w-7 h-4 rounded-full transition relative cursor-pointer ${
                    reasoningSeparation ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition ${
                    reasoningSeparation ? 'left-3.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">输出变量</span>
                <span className="text-slate-400">结构化输出</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">失败时重试</span>
                <button
                  onClick={() => setRetryOnFail(!retryOnFail)}
                  className={`w-7 h-4 rounded-full transition relative cursor-pointer ${
                    retryOnFail ? 'bg-blue-600' : 'bg-slate-300'
                  }`}
                >
                  <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition ${
                    retryOnFail ? 'left-3.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-700 font-medium">异常处理</span>
                <span className="text-slate-500 font-medium">无 v</span>
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
