import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Bot, Send, Sparkles, Terminal, Wrench, RotateCcw } from 'lucide-react';

export const AgentSandboxModal: React.FC = () => {
  const { sandboxAgent, setSandboxAgent, showToast } = useApp();

  const [messages, setMessages] = useState([
    { sender: 'assistant', text: '您好！我是您的智能助手。请问今天有什么我可以协助您的？', time: '刚刚' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  if (!sandboxAgent) return null;

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(prev => [...prev, { sender: 'user', text: userMsg, time: '刚刚' }]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        {
          sender: 'assistant',
          text: `【${sandboxAgent.name} 深度推理响应】\n已接收到关于 "${userMsg}" 的指令。根据预设的知识库与 API 工具，以下是解析分析方案：\n1. 结构化问题拆解与定位\n2. 推荐最优化解决策略\n3. 自动化代码/文本生成完成。`,
          time: '刚刚'
        }
      ]);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[80vh] my-auto">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{sandboxAgent.avatar}</div>
            <div>
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <span>{sandboxAgent.name}</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                  在线沙盒试用
                </span>
              </div>
              <div className="text-[10px] text-slate-500 font-medium">底座模型: {sandboxAgent.baseModel} · 版本 v{sandboxAgent.version}</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setMessages([])} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 bg-slate-100" title="清空对话">
              <RotateCcw className="w-4 h-4" />
            </button>
            <button onClick={() => setSandboxAgent(null)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/50 text-xs font-medium">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
              {msg.sender === 'assistant' && (
                <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-lg shrink-0">
                  {sandboxAgent.avatar}
                </div>
              )}
              <div className={`max-w-xl p-4 rounded-2xl leading-relaxed whitespace-pre-wrap ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-xs'
                  : 'bg-white border border-slate-200/80 text-slate-800 rounded-bl-none shadow-xs'
              }`}>
                {msg.text}
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex items-center gap-2 text-slate-500 text-xs font-mono font-medium">
              <Sparkles className="w-4 h-4 text-indigo-600 animate-spin" />
              Agent 正在思考思考链中...
            </div>
          )}
        </div>

        {/* Input Controls */}
        <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={`向 ${sandboxAgent.name} 发送测试指令...`}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500 font-medium"
          />
          <button
            onClick={handleSend}
            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>发送</span>
          </button>
        </div>

      </div>
    </div>
  );
};
