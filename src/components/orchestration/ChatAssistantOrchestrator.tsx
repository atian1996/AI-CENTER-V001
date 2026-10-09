import React, { useState } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  RefreshCw, 
  BookOpen, 
  ChevronDown, 
  CheckCircle2, 
  ChevronRight, 
  MessageSquare,
  Bot,
  User,
  Info,
  Sliders,
  Send,
  SlidersHorizontal
} from 'lucide-react';
import { PromptGeneratorModal } from './PromptGeneratorModal';

interface ChatAssistantOrchestratorProps {
  agent: AgentItem;
  model: string;
  onOpenModelModal: () => void;
}

export const ChatAssistantOrchestrator: React.FC<ChatAssistantOrchestratorProps> = ({
  agent,
  model,
  onOpenModelModal
}) => {
  const { showToast } = useApp();

  // Prompt state
  const [prompt, setPrompt] = useState<string>(
    agent.techDocs || `你可以重新组织和输出混乱的会议记录，并根据当前状态、遇到的问题和提出的解决方案撰写会议纪要。你只负责会议记录方面的问题，不回答其他。`
  );
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  // Variables state
  const [variables, setVariables] = useState<Array<{ id: string; key: string; name: string; type: string }>>([]);
  const [showAddVarModal, setShowAddVarModal] = useState(false);
  const [newVarKey, setNewVarKey] = useState('');

  // Knowledge base state
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([]);
  const [metaFilter, setMetaFilter] = useState<'disabled' | 'enabled'>('disabled');

  // Debug & Preview Chat state
  const [chatInput, setChatInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'assistant' | 'user';
    text: string;
  }>>([
    {
      id: 'm1',
      role: 'assistant',
      text: '请输入你的会议内容：'
    }
  ]);

  const handleAddVariable = () => {
    if (!newVarKey.trim()) return;
    setVariables(prev => [
      ...prev,
      {
        id: `v_${Date.now()}`,
        key: newVarKey.trim(),
        name: newVarKey.trim(),
        type: 'string'
      }
    ]);
    setNewVarKey('');
    setShowAddVarModal(false);
    showToast(`已添加变量 {{${newVarKey}}}`);
  };

  const handleSend = () => {
    if (!chatInput.trim() || isGenerating) return;

    const userText = chatInput.trim();
    setChatInput('');
    const userMsgId = `u_${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: userText }]);

    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      let replyText = `### 📋 会议纪要整理报告\n\n**1. 会议主题与核心目标**\n- 基于您的输入内容，本场讨论主要聚焦于跨部门业务协同与产品上线推进。\n\n**2. 核心讨论事项与当前现状**\n- 梳理了核心业务链路，明确了各节点的负责人与交付标准；\n- 针对技术架构中面临的并发与鉴权瓶颈展开了技术方案选型。\n\n**3. 决议与行动项 (Action Items)**\n1. 【研发团队】周五前输出压力测试报告；\n2. 【运营团队】同步启动灰度发布名单与种子用户触达；\n3. 【产品经理】跟进下周一的跨组对齐会。`;

      setMessages(prev => [
        ...prev,
        {
          id: `a_${Date.now()}`,
          role: 'assistant',
          text: replyText
        }
      ]);
    }, 700);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'm1',
        role: 'assistant',
        text: '请输入你的会议内容：'
      }
    ]);
    showToast('已重置调试会话');
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100 select-none">
      
      {/* Prompt Generator Modal */}
      <PromptGeneratorModal
        isOpen={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
        onApply={(p) => {
          setPrompt(p);
          showToast('已成功更新提示词！');
        }}
        appName={agent.name}
        appType="聊天助手"
      />

      {/* Add Variable Modal */}
      {showAddVarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800">添加输入变量</h4>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">变量 Key (在 Prompt 中以 {'{{key}}'} 引用)</label>
              <input
                type="text"
                autoFocus
                placeholder="例如：input 或 meeting_topic"
                value={newVarKey}
                onChange={(e) => setNewVarKey(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddVariable()}
                className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
              />
            </div>
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowAddVarModal(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleAddVariable}
                disabled={!newVarKey.trim()}
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl cursor-pointer disabled:opacity-50"
              >
                确定
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Column: Configuration Cards (52% width) */}
      <div className="w-[52%] h-full overflow-y-auto p-5 space-y-4 border-r border-slate-200/90 bg-slate-50/50">
        
        {/* 1. Prompt Card */}
        <div className="bg-white border-2 border-blue-600/90 rounded-2xl shadow-xs overflow-hidden transition">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-blue-50/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">提示词</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <button
              onClick={() => setPromptModalOpen(true)}
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-blue-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>生成</span>
            </button>
          </div>

          <div className="p-3 relative">
            <textarea
              rows={11}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-xs font-mono text-slate-800 leading-relaxed bg-transparent outline-none resize-none"
              placeholder="输入聊天助手系统提示词..."
            />
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <span className="font-mono">{prompt.length} 字符</span>
              <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto cursor-ns-resize" title="拖动调整高度" />
            </div>
          </div>
        </div>

        {/* 2. Variables Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">变量</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <button
              onClick={() => setShowAddVarModal(true)}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            变量能使用户输入表单引入提示词或开场白，你可以尝试在提示词中输入 {'{{input}}'}
          </p>

          {variables.length > 0 && (
            <div className="space-y-2 pt-1">
              {variables.map((v) => (
                <div 
                  key={v.id}
                  className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-mono font-bold">{"{x}"}</span>
                    <span className="font-bold text-slate-800">{v.key}</span>
                  </div>
                  <button 
                    onClick={() => setVariables(prev => prev.filter(item => item.id !== v.id))}
                    className="text-slate-300 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 3. Knowledge Base Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">知识库</span>
          </div>

          {knowledgeBases.length > 0 ? (
            <div className="space-y-1.5">
              {knowledgeBases.map((kb, idx) => (
                <div key={idx} className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                    <span>{kb}</span>
                  </div>
                  <button 
                    onClick={() => setKnowledgeBases([])}
                    className="text-slate-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400">您可以导入知识库作为上下文</p>
          )}

          {/* Meta filter */}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <span className="text-slate-500 font-medium">元数据过滤</span>
              <Info className="w-3 h-3 text-slate-400" />
            </div>
            <button 
              onClick={() => setMetaFilter(metaFilter === 'disabled' ? 'enabled' : 'disabled')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{metaFilter === 'disabled' ? '禁用' : '启用'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

      </div>

      {/* Right Column: Debug & Preview (48% width) */}
      <div className="w-[48%] h-full flex flex-col bg-white border-l border-slate-200/80 shadow-2xs">
        
        {/* Debug Header */}
        <div className="h-12 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-800">调试与预览</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
          </div>
          <button
            onClick={handleResetChat}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            title="清空会话并重置"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m) => (
            <div key={m.id} className={`flex gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 border border-indigo-200">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2`}>
                <div className={`p-3.5 rounded-2xl text-xs leading-relaxed whitespace-pre-wrap ${
                  m.role === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-xs font-medium shadow-2xs' 
                    : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-xs'
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

          {isGenerating && (
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl rounded-tl-xs text-xs text-slate-500 flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-blue-600" />
                <span>助手正在整理撰写会议纪要...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar at Bottom */}
        <div className="p-4 border-t border-slate-200/80 space-y-2 bg-white">
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="relative"
          >
            <textarea
              rows={2}
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="和 Bot 聊天..."
              className="w-full text-xs p-3 pr-12 bg-slate-50 border border-slate-200 rounded-2xl focus:bg-white focus:border-blue-500 outline-none resize-none transition"
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isGenerating}
              className="absolute right-2.5 bottom-3.5 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white rounded-xl transition cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Bottom Bar */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 rounded-full bg-blue-500 text-white flex items-center justify-center text-[9px] font-bold">
                <MessageSquare className="w-2.5 h-2.5" />
              </div>
              <div className="w-4 h-4 rounded-full bg-amber-500 text-white flex items-center justify-center text-[9px] font-bold">
                "
              </div>
              <span>功能已开启</span>
            </div>
            <button 
              onClick={() => showToast('已打开功能高级管理面板')}
              className="text-blue-600 hover:text-blue-700 font-bold flex items-center gap-0.5 cursor-pointer"
            >
              <span>管理</span>
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
