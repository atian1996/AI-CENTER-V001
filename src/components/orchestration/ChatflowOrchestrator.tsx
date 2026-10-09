import React, { useState } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Play, 
  Sparkles, 
  GitFork, 
  FileText, 
  MessageSquare, 
  Layers, 
  CheckCircle2, 
  RefreshCw, 
  X, 
  Send, 
  Bot, 
  User, 
  Sliders, 
  Maximize2, 
  ChevronRight, 
  SlidersHorizontal,
  ChevronDown,
  Info,
  Plus,
  Eye
} from 'lucide-react';

interface ChatflowOrchestratorProps {
  agent: AgentItem;
  model: string;
  onOpenModelModal: () => void;
}

export const ChatflowOrchestrator: React.FC<ChatflowOrchestratorProps> = ({
  agent,
  model,
  onOpenModelModal
}) => {
  const { showToast } = useApp();

  const [zoom, setZoom] = useState(90);
  const [showPreviewDrawer, setShowPreviewDrawer] = useState(false);

  // Chatflow Preview state
  const [chatInput, setChatInput] = useState('');
  const [dialogueCount, setDialogueCount] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeBranch, setActiveBranch] = useState<'case1' | 'case2' | null>(null);

  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'assistant' | 'user';
    text: string;
    branchTag?: string;
  }>>([
    {
      id: 'm1',
      role: 'assistant',
      text: '你好！我是 Chatflow 文件翻译助手。请上传文档或直接发送文本及目标翻译语言。'
    }
  ]);

  const handleSend = () => {
    if (!chatInput.trim() || isProcessing) return;

    const userText = chatInput.trim();
    setChatInput('');
    const userMsgId = `u_${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);

    setIsProcessing(true);

    if (dialogueCount === 1) {
      setActiveBranch('case1');
      setTimeout(() => {
        setIsProcessing(false);
        setDialogueCount(prev => prev + 1);
        setMessages(prev => [
          ...prev,
          {
            id: `a_${Date.now()}`,
            role: 'assistant',
            text: `[Case 1 分支命中: 首次对话]\n已成功提取文档并为 conversation.text 赋值。\n\nDocument Processed! 请告诉我您期望的翻译语言或风格调整要求。`,
            branchTag: '首次对话: 提取文档 & 变量赋值'
          }
        ]);
        setActiveBranch(null);
      }, 900);
    } else {
      setActiveBranch('case2');
      setTimeout(() => {
        setIsProcessing(false);
        setDialogueCount(prev => prev + 1);
        setMessages(prev => [
          ...prev,
          {
            id: `a_${Date.now()}`,
            role: 'assistant',
            text: `[Case 2 分支命中: 轮次 ${dialogueCount}]\n【识别意图】: 用户要求将文本以专业商务语气翻译为目标语言。\n\n【LLM 翻译输出】:\n"In today's fast-moving era of artificial intelligence, automated multi-agent chatflows fundamentally transform cross-lingual communication and document comprehension."`,
            branchTag: '后续对话: 意图识别 -> LLM 翻译'
          }
        ]);
        setActiveBranch(null);
      }, 1000);
    }
  };

  const handleReset = () => {
    setDialogueCount(1);
    setMessages([
      {
        id: 'm1',
        role: 'assistant',
        text: '你好！我是 Chatflow 文件翻译助手。请上传文档或直接发送文本及目标翻译语言。'
      }
    ]);
    showToast('已重置 Chatflow 对话流状态 (dialogue_count = 1)');
  };

  return (
    <div className="flex-1 flex overflow-hidden relative select-none bg-[#f8fafc]">
      
      {/* Top Floating Control Bar */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <button
          onClick={() => setShowPreviewDrawer(!showPreviewDrawer)}
          className={`px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer ${
            showPreviewDrawer 
              ? 'bg-blue-600 text-white' 
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>预览调试</span>
        </button>

        <div className="text-xs text-slate-400 bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-slate-200">
          自动保存 10:16:42 · 未发布
        </div>
      </div>

      {/* Main Canvas Scroll Area (Matches chatflow应用-编排.png) */}
      <div className="flex-1 h-full overflow-auto p-12 bg-tech-grid relative">
        <div className="min-w-[1400px] flex items-start gap-8 pt-8 pb-20">
          
          {/* Col 1: Start Node */}
          <div className="w-60 space-y-4 shrink-0">
            {/* Note 1 */}
            <div className="p-3 bg-white/90 border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600 leading-relaxed">
              这是工作流的起点。用户需要上传一个文档并选择目标语言进行翻译。
              <div className="text-[10px] text-slate-400 pt-1">Dify</div>
            </div>

            {/* Start Node */}
            <div className="bg-white border-2 border-blue-500 rounded-2xl shadow-xs overflow-hidden">
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-blue-600 text-white flex items-center justify-center">
                  <Play className="w-2.5 h-2.5 fill-current" />
                </div>
                <span className="text-xs font-bold text-slate-800">开始</span>
              </div>
              <div className="p-3 space-y-1.5 text-xs">
                <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span className="font-mono text-slate-700">{"{x}"} text</span>
                  <span className="text-[10px] text-slate-400">必填</span>
                </div>
                <div className="p-1.5 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                  <span className="font-mono text-slate-700">{"{x}"} target_language</span>
                  <span className="text-[10px] text-slate-400">必填</span>
                </div>
              </div>
            </div>
          </div>

          {/* Col 2: Condition Fork Node (条件分支) */}
          <div className="w-64 space-y-4 shrink-0">
            {/* Note 2 */}
            <div className="p-3 bg-white/90 border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600 leading-relaxed">
              判断当前对话是否是首次对话或后续对话，根据对话次数决定下一步操作。
              <div className="text-[10px] text-slate-400 pt-1">Dify</div>
            </div>

            {/* Fork Node */}
            <div className={`bg-white border-2 rounded-2xl shadow-xs overflow-hidden transition ${
              activeBranch ? 'border-sky-500 ring-2 ring-sky-100' : 'border-slate-200'
            }`}>
              <div className="px-3 py-2 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-sky-500 text-white flex items-center justify-center">
                  <GitFork className="w-3 h-3" />
                </div>
                <span className="text-xs font-bold text-slate-800">条件分支</span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className={`p-2 rounded-lg border text-[11px] font-mono ${
                  activeBranch === 'case1' ? 'bg-sky-50 border-sky-300 font-bold' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-slate-400">CASE 1 (IF)</span>
                  <div className="text-red-500">sys.dialogue_count = 1</div>
                </div>
                <div className={`p-2 rounded-lg border text-[11px] font-mono ${
                  activeBranch === 'case2' ? 'bg-indigo-50 border-indigo-300 font-bold' : 'bg-slate-50 border-slate-200'
                }`}>
                  <span className="text-slate-400">CASE 2 (ELIF)</span>
                  <div className="text-red-500">sys.dialogue_count &gt; 1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Col 3: Multi-Branches (Case 1 Upper / Case 2 Lower) */}
          <div className="space-y-12 shrink-0">
            
            {/* Case 1 Upper Stream */}
            <div className="flex items-start gap-6">
              {/* Doc Extractor */}
              <div className="w-56 space-y-3">
                <div className="p-2.5 bg-white/90 border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600">
                  从上传的文档中提取文本，准备进行翻译。
                  <div className="text-[10px] text-slate-400">Dify</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-4 h-4 rounded bg-emerald-500 text-white flex items-center justify-center text-[10px]">📄</span>
                    <span>文档提取器</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">@ 开始.text</div>
                </div>
              </div>

              {/* Variable Assign */}
              <div className="w-56 space-y-3">
                <div className="p-2.5 bg-white/90 border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600">
                  将提取的文本分配给 conversation.text 变量。
                  <div className="text-[10px] text-slate-400">Dify</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-4 h-4 rounded bg-blue-500 text-white flex items-center justify-center text-[10px] font-bold">(=)</span>
                    <span>变量赋值</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono text-emerald-600 font-bold">text 覆盖</div>
                </div>
              </div>

              {/* Direct Reply */}
              <div className="w-52 space-y-3">
                <div className="p-2.5 bg-white/90 border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600">
                  确认文档已经成功处理，作为对用户的反馈。
                  <div className="text-[10px] text-slate-400">Dify</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center text-[10px]">💬</span>
                    <span>直接回复</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">Document Processed!</div>
                </div>
              </div>
            </div>

            {/* Case 2 Lower Stream */}
            <div className="flex items-start gap-6 pt-4">
              {/* Intent Recognition */}
              <div className="w-60 space-y-3">
                <div className="p-2.5 bg-white/90 border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600 leading-relaxed">
                  此节点用于解读和总结用户对翻译的具体要求，提取语气、风格偏好。
                  <div className="text-[10px] text-slate-400">Dify</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px]">🧠</span>
                    <span>识别用户意图</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">gpt-5.1 CHAT</div>
                </div>
              </div>

              {/* LLM Translate */}
              <div className="w-60 space-y-3">
                <div className="p-2.5 bg-white/90 border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600 leading-relaxed">
                  根据用户的附加指令或条件，进一步优化翻译。
                  <div className="text-[10px] text-slate-400">Dify</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-4 h-4 rounded bg-indigo-600 text-white flex items-center justify-center text-[10px]">🌐</span>
                    <span>LLM 翻译</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono">gpt-5.1 CHAT</div>
                </div>
              </div>

              {/* Direct Reply Output */}
              <div className="w-52 space-y-3">
                <div className="p-2.5 bg-white/90 border border-slate-200 rounded-xl shadow-2xs text-[11px] text-slate-600">
                  使用 AI 语言模型处理翻译，根据目标语言输出。
                  <div className="text-[10px] text-slate-400">Dify</div>
                </div>
                <div className="bg-white border border-slate-200 rounded-xl p-3 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                    <span className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center text-[10px]">💬</span>
                    <span>直接回复</span>
                  </div>
                  <div className="text-[11px] text-slate-600 font-medium">@ LLM 翻译.text</div>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Bar Controls */}
        <div className="absolute bottom-4 left-4 z-20 flex items-center gap-4 text-xs text-slate-500">
          <button 
            onClick={() => showToast('已清除节点运行时缓存')}
            className="hover:text-slate-900 cursor-pointer font-medium"
          >
            查看缓存 · 清除
          </button>
        </div>

        {/* Bottom Right Zoom & Minimap */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-2">
          <div className="w-16 h-12 bg-white/90 border border-slate-200 rounded-lg shadow-2xs flex items-center justify-center p-1">
            <div className="w-full h-full bg-slate-100 rounded flex items-center justify-center gap-1">
              <div className="w-2 h-3 bg-sky-500/40 rounded-xs" />
              <div className="w-3 h-4 bg-indigo-500/40 rounded-xs" />
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl px-2 py-1 shadow-2xs flex items-center gap-1.5 text-xs text-slate-600 font-bold">
            <button onClick={() => setZoom(Math.max(50, zoom - 10))} className="p-1 hover:text-slate-900 cursor-pointer">-</button>
            <span className="w-9 text-center font-mono">{zoom}%</span>
            <button onClick={() => setZoom(Math.min(150, zoom + 10))} className="p-1 hover:text-slate-900 cursor-pointer">+</button>
          </div>
        </div>
      </div>

      {/* Right Slide-over Preview Chat Drawer */}
      {showPreviewDrawer && (
        <div className="w-[420px] h-full bg-white border-l border-slate-200 shadow-2xl flex flex-col z-30 animate-in slide-in-from-right duration-200">
          
          <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">Chatflow 预览调试</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-100 text-sky-700 font-mono">
                轮次: {dialogueCount}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="text-xs text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
                title="重置会话"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setShowPreviewDrawer(false)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m) => (
              <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {m.role === 'assistant' && (
                  <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div className="max-w-[85%] space-y-1">
                  {m.branchTag && (
                    <div className="text-[10px] text-sky-600 font-mono font-bold">
                      ↳ {m.branchTag}
                    </div>
                  )}
                  <div className={`p-3 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                    m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-800 border border-slate-200/80'
                  }`}>
                    {m.text}
                  </div>
                </div>
                {m.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isProcessing && (
              <div className="p-3 bg-sky-50 border border-sky-200 rounded-xl text-xs text-sky-700 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Chatflow 正在根据条件分支执行流转...</span>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-slate-100 bg-white">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="relative"
            >
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={dialogueCount === 1 ? "输入待翻译的文本或上传文档..." : "输入目标语言与调整要求..."}
                className="w-full text-xs p-3 pr-12 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
              />
              <button
                type="submit"
                disabled={!chatInput.trim() || isProcessing}
                className="absolute right-2 top-2 p-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white rounded-lg transition"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

        </div>
      )}

    </div>
  );
};
