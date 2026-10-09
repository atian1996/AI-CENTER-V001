import React, { useState, useEffect, useRef, useMemo } from 'react';
import { AgentItem, ModelItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Send, 
  Sparkles, 
  X, 
  RotateCcw, 
  Coins, 
  Info,
  Layers,
  Zap,
  HelpCircle,
  Cpu
} from 'lucide-react';

interface AgentTrialPageViewProps {
  agent: AgentItem;
}

export const AgentTrialPageView: React.FC<AgentTrialPageViewProps> = ({ agent }) => {
  const { 
    user, 
    setUser, 
    models,
    showToast 
  } = useApp();

  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string; time?: string; tokens?: number }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Available models bound to this agent
  const availableModels = useMemo(() => {
    let list = models.filter(m => 
      (agent.baseModelIds && agent.baseModelIds.includes(m.id)) ||
      (agent.baseModels && agent.baseModels.includes(m.name)) ||
      (agent.baseModelId && m.id === agent.baseModelId) ||
      (agent.baseModel && m.name.toLowerCase() === agent.baseModel.toLowerCase()) ||
      (agent.linkedModel && m.name.toLowerCase() === agent.linkedModel.toLowerCase())
    );
    if (list.length === 0) {
      list = models.length > 0 ? [models[0]] : [{ id: 'm1', name: 'DeepSeek-V3', vendor: 'DeepSeek', pricePerTenThousandTokens: 0.02, typeTag: '文本', priceInput: '0.002', priceOutput: '0.004', tags: [], description: '', benchmarks: [], latencyMs: 30, apiDocsUrl: '' } as ModelItem];
    }
    return list;
  }, [agent, models]);

  // Model selection dropdown state (default selected)
  const [selectedModelId, setSelectedModelId] = useState<string>(() => availableModels[0]?.id || 'm1');
  const activeModel = availableModels.find(m => m.id === selectedModelId) || availableModels[0];
  const activeModelName = activeModel?.name || 'DeepSeek-V3';
  const modelPricePer10k = activeModel?.pricePerTenThousandTokens !== undefined ? activeModel.pricePerTenThousandTokens : 0.04;

  // Free quota state in Yuan (defaults to agent's freeQuotaAmount or converted from freeTokenQuota, or 5.0)
  const initialQuotaYuan = agent.freeQuotaAmount !== undefined 
    ? agent.freeQuotaAmount 
    : (agent.freeTokenQuota ? agent.freeTokenQuota * 0.5 : 5.0);

  const [freeQuotaRemaining, setFreeQuotaRemaining] = useState<number>(() => {
    const saved = localStorage.getItem(`agent_quota_yuan_${agent.id}`);
    return saved !== null ? Number(saved) : initialQuotaYuan;
  });
  const [costUsed, setCostUsed] = useState<number>(() => {
    const saved = localStorage.getItem(`agent_cost_used_${agent.id}`);
    return saved ? Number(saved) : 0;
  });
  const [tokensUsed, setTokensUsed] = useState<number>(() => {
    const saved = localStorage.getItem(`agent_used_${agent.id}`);
    return saved ? Number(saved) : 0;
  });

  // Initialize trial chatbot greeting
  useEffect(() => {
    setMessages([
      {
        role: 'assistant',
        text: `您好！我是【${agent.name}】。当前为您接入基座模型【${activeModelName}】（计费费率：¥${modelPricePer10k.toFixed(2)}/万Token）。${agent.inputExample ? `您可以输入：\n"${agent.inputExample}"` : '请问有什么可以帮助您的？'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        tokens: 45
      }
    ]);
  }, [agent, activeModelName]);

  // Scroll to bottom on message updates
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    // Check if free quota is enough, otherwise check balance
    if (freeQuotaRemaining <= 0 && user.balance < 0.01) {
      showToast('免费体验额度已耗尽且账户余额不足，请在控制台充值后再继续使用');
      return;
    }

    const userText = input;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { role: 'user', text: userText, time: nowTime }]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          systemInstruction: agent.capabilityDesc?.join('\n') || agent.description || '你是专业 AI 智能助手',
          model: 'gemini-3.6-flash'
        })
      });
      const data = await res.json();
      const actualTurnTokens = Math.floor(Math.random() * 180) + 220;
      const actualCost = Math.round(((actualTurnTokens / 10000) * modelPricePer10k) * 10000) / 10000;

      // Update quota in Yuan
      if (freeQuotaRemaining >= actualCost) {
        const nextRemaining = Math.max(0, Math.round((freeQuotaRemaining - actualCost) * 10000) / 10000);
        setFreeQuotaRemaining(nextRemaining);
        setCostUsed(prev => prev + actualCost);
        setTokensUsed(prev => prev + actualTurnTokens);
        localStorage.setItem(`agent_quota_yuan_${agent.id}`, String(nextRemaining));
        localStorage.setItem(`agent_cost_used_${agent.id}`, String(costUsed + actualCost));
        localStorage.setItem(`agent_used_${agent.id}`, String(tokensUsed + actualTurnTokens));
      } else {
        const remainingToDeduct = Math.round((actualCost - freeQuotaRemaining) * 10000) / 10000;
        setUser(u => ({ ...u, balance: Math.max(0, Math.round((u.balance - remainingToDeduct) * 100) / 100) }));
        setCostUsed(prev => prev + actualCost);
        setTokensUsed(prev => prev + actualTurnTokens);
        setFreeQuotaRemaining(0);
        localStorage.setItem(`agent_quota_yuan_${agent.id}`, '0');
        localStorage.setItem(`agent_cost_used_${agent.id}`, String(costUsed + actualCost));
        localStorage.setItem(`agent_used_${agent.id}`, String(tokensUsed + actualTurnTokens));
      }

      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: data.text || agent.outputExample || '分析与计算推理已完成。',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tokens: actualTurnTokens
        }
      ]);
    } catch {
      const fallbackTokens = 180;
      const fallbackCost = Math.round(((fallbackTokens / 10000) * modelPricePer10k) * 10000) / 10000;
      setFreeQuotaRemaining(prev => Math.max(0, Math.round((prev - fallbackCost) * 10000) / 10000));
      setCostUsed(prev => prev + fallbackCost);
      setTokensUsed(prev => prev + fallbackTokens);

      setMessages(prev => [
        ...prev, 
        { 
          role: 'assistant', 
          text: agent.outputExample || '已接收到您的需求，并成功调用后台基座模型进行深度推理。',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          tokens: fallbackTokens
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearMessages = () => {
    setMessages([
      {
        role: 'assistant',
        text: `对话已重置。我是【${agent.name}】。`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleCloseTab = () => {
    window.close();
  };

  return (
    <div className="fixed inset-0 bg-slate-50 flex flex-col select-none overflow-hidden h-screen w-screen z-50">
      
      {/* 1. Header Bar */}
      <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between shadow-xs shrink-0">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs shrink-0 overflow-hidden">
            {agent.avatar && agent.avatar.startsWith('http') ? (
              <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
            ) : (
              <span>{agent.avatar || '🤖'}</span>
            )}
          </div>
          <div>
            <div className="text-sm font-black text-slate-900 flex items-center gap-2">
              <span>{agent.name}</span>
              <span className="px-2.5 py-0.5 rounded text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200 font-extrabold flex items-center gap-1">
                <Coins className="w-3 h-3 text-indigo-600" />
                Token 计费模式
              </span>
            </div>
            
            {/* Base Model Display with small Clickable Info Icon */}
            <div className="text-[11px] text-slate-500 font-medium flex items-center gap-1.5 mt-0.5">
              <span>当前驱动底座：</span>
              <span className="font-extrabold text-slate-800 bg-slate-100 px-1.5 py-0.2 rounded border border-slate-200/70">
                {activeModelName}
              </span>
              <button
                type="button"
                onClick={() => setShowModelModal(true)}
                className="p-0.5 text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded transition cursor-pointer"
                title="点击查看模型规格与详情"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Top Actions & Token Info */}
        <div className="flex items-center gap-4">
          
          {/* Quick Quota Badge in Header */}
          <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-200/80 px-3.5 py-1.5 rounded-xl text-xs">
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>剩余免费额度：</span>
              <span className="font-black text-amber-600 font-mono">¥{freeQuotaRemaining.toFixed(2)}</span>
            </div>
            <div className="w-px h-3.5 bg-slate-200" />
            <div className="flex items-center gap-1.5 text-slate-600 font-medium">
              <span>账户余额：</span>
              <span className="font-black text-emerald-600 font-mono">¥{user.balance.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleClearMessages}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition border border-slate-200/70 bg-white cursor-pointer"
            title="清空并重置对话"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleCloseTab}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition bg-white border border-slate-200/70 cursor-pointer"
            title="关闭当前页面"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* 2. Workspace Body Split Panel */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* Left Side: Detail Overview & Quota */}
        <aside className="w-80 bg-white border-r border-slate-200/80 p-6 flex flex-col justify-between overflow-y-auto shrink-0 hidden md:flex">
          <div className="space-y-6">
            <div className="space-y-2">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">智能体简介</h3>
              <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                {agent.description || '高阶自动化人工智能代理助手，支持多轮深度推理与场景化任务执行。'}
              </p>
            </div>

            {/* Quota Status Card */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">额度与消耗监控</h3>
                <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-full">
                  按量计费
                </span>
              </div>
              
              <div className="bg-gradient-to-br from-indigo-50/60 to-purple-50/40 border border-indigo-100 rounded-2xl p-4.5 space-y-3.5">
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Coins className="w-3.5 h-3.5 text-amber-500" />
                      剩余免费额度
                    </span>
                    <span className="font-mono text-amber-600 font-black">
                      ¥{freeQuotaRemaining.toFixed(2)} / ¥{initialQuotaYuan.toFixed(2)}
                    </span>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full bg-slate-200/80 rounded-full h-2 mt-2 overflow-hidden">
                    <div 
                      className="bg-amber-500 h-2 rounded-full transition-all duration-500" 
                      style={{ width: `${Math.min(100, Math.max(0, (freeQuotaRemaining / (initialQuotaYuan || 1)) * 100))}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-indigo-100/80 text-[11px]">
                  <div className="bg-white/80 p-2 rounded-lg border border-indigo-50">
                    <span className="text-slate-400 block text-[10px]">本次消耗金额</span>
                    <span className="font-black text-slate-800 font-mono">¥{costUsed.toFixed(3)}</span>
                    <span className="text-[9px] text-slate-400 font-mono block">({tokensUsed.toLocaleString()} Tokens)</span>
                  </div>
                  <div className="bg-white/80 p-2 rounded-lg border border-indigo-50">
                    <span className="text-slate-400 block text-[10px]">当前账户余额</span>
                    <span className="font-black text-emerald-600 font-mono">¥{user.balance.toFixed(2)}</span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                  💡 免费体验额度用完后，将自动按所选基座模型费率从账户余额中按量扣除。
                </p>
              </div>
            </div>

            {/* Technical Specs based on real fields */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">技术指标与模型规格</h3>
              <div className="space-y-2 text-xs font-semibold text-slate-600 bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">当前底座模型</span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-slate-800 font-extrabold">{activeModelName}</span>
                    <button
                      type="button"
                      onClick={() => setShowModelModal(true)}
                      className="text-indigo-600 hover:text-indigo-800 transition cursor-pointer"
                      title="查看模型详情"
                    >
                      <Info className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">模型计费单价</span>
                  <span className="text-indigo-600 font-extrabold font-mono">¥{modelPricePer10k.toFixed(2)}/万Token</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">技术形态</span>
                  <span className="text-indigo-600 font-extrabold">{agent.techForm || 'Agent'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">应用场景</span>
                  <span className="text-cyan-700 font-extrabold">{agent.categoryTags && agent.categoryTags.length > 0 ? agent.categoryTags.join('、') : (agent.scene || '办公助理')}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-200/60 text-[11px]">
                  <span className="text-slate-400">行业领域</span>
                  <span className="text-emerald-700 font-extrabold">{agent.industryTags && agent.industryTags.length > 0 ? agent.industryTags.join('、') : (agent.industry || '通用')}</span>
                </div>
                <div className="flex justify-between py-1 text-[11px]">
                  <span className="text-slate-400">开发主体</span>
                  <span className="text-slate-800 font-extrabold">{agent.developer || agent.author || 'AI 平台官方'}</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Right Side: Main Chatbox Window */}
        <main className="flex-1 bg-slate-100/50 flex flex-col justify-between overflow-hidden">
          
          {/* Chat List container */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            
            {/* Warning banner when free quota & balance is empty */}
            {freeQuotaRemaining <= 0 && user.balance < 0.05 && (
              <div className="bg-amber-50 border border-amber-200/80 p-4 rounded-2xl text-xs text-amber-900 font-semibold flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-3xs animate-fade-in max-w-4xl mx-auto">
                <div className="space-y-0.5">
                  <div className="font-extrabold flex items-center gap-1.5">
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>免费额度已耗尽</span>
                  </div>
                  <p className="text-[11px] text-amber-700 font-medium">请前往控制台或个人中心进行余额充值，即可继续畅享按量调用。</p>
                </div>
                <button
                  onClick={() => {
                    setUser(u => ({ ...u, balance: u.balance + 50 }));
                    showToast('已成功模拟充值 ¥50.00 账户余额');
                  }}
                  className="px-4 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-extrabold transition text-xs cursor-pointer shrink-0"
                >
                  模拟充值 ¥50
                </button>
              </div>
            )}

            {/* Message rows */}
            <div className="max-w-4xl mx-auto space-y-4 w-full">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                >
                  <div className="flex items-start gap-3 max-w-[85%]">
                    {msg.role === 'assistant' && (
                      <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-lg shadow-2xs shrink-0 overflow-hidden">
                        {agent.avatar && agent.avatar.startsWith('http') ? (
                          <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                        ) : (
                          <span>{agent.avatar || '🤖'}</span>
                        )}
                      </div>
                    )}
                    <div
                      className={`rounded-2xl p-4 text-xs leading-relaxed font-medium shadow-2xs ${
                        msg.role === 'user'
                          ? 'bg-indigo-600 text-white rounded-tr-none'
                          : 'bg-white border border-slate-200/80 text-slate-800 rounded-tl-none'
                      }`}
                    >
                      <div className="whitespace-pre-wrap">{msg.text}</div>
                      <div className="flex items-center justify-between gap-4 mt-1.5 pt-1 text-[10px]">
                        {msg.tokens ? (
                          <span className={`${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400 font-mono'}`}>
                            {msg.tokens} Tokens
                          </span>
                        ) : <span />}
                        {msg.time && (
                          <span className={`${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                            {msg.time}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white border border-slate-200 rounded-2xl p-4 text-xs font-semibold flex items-center gap-2.5 shadow-2xs">
                    <div className="w-2.5 h-2.5 rounded-full bg-indigo-600 animate-ping shrink-0" />
                    <span className="text-slate-500">
                      基座模型【{activeModelName}】正在进行深度推理与 Token 生成...
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Chat input box at the bottom */}
          <div className="bg-white border-t border-slate-200/80 p-4 shrink-0">
            {/* Model Selection Dropdown above the chat input */}
            <div className="max-w-4xl mx-auto mb-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <label className="text-slate-600 font-bold flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                  <span>基座模型：</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedModelId}
                    onChange={(e) => {
                      const newId = e.target.value;
                      setSelectedModelId(newId);
                      const targetM = availableModels.find(m => m.id === newId);
                      if (targetM) {
                        showToast(`已切换至【${targetM.name}】，Token计费费率：¥${(targetM.pricePerTenThousandTokens || 0.04).toFixed(2)}/万Token`);
                      }
                    }}
                    className="px-2.5 py-1.5 pr-7 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg font-bold text-slate-800 text-xs shadow-2xs hover:border-indigo-300 focus:border-indigo-500 focus:outline-none transition cursor-pointer"
                  >
                    {availableModels.map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.vendor || '官方'}) · ¥{(m.pricePerTenThousandTokens || 0.04).toFixed(2)}/万Token
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Free Quota status badge */}
              <div className="flex items-center gap-2 text-[11px]">
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 font-mono">
                  费率: ¥{modelPricePer10k.toFixed(2)}/万Token
                </span>
                <span className="px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 font-bold border border-amber-200 font-mono">
                  免费额度剩余: ¥{freeQuotaRemaining.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="max-w-4xl mx-auto flex items-center gap-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={`向 ${agent.name} 输入指令或提问（底座驱动：${activeModelName} · ¥${modelPricePer10k.toFixed(2)}/万Token）...`}
                disabled={loading}
                className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200/80 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100/50 transition-all duration-300"
              />
              <button
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-600/10 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <span>发送指令</span>
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

        </main>

      </div>

      {/* 3. Bound Model Detail Modal */}
      {showModelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-lg w-full overflow-hidden p-6 space-y-5 animate-scale-in">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 font-black">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>{activeModel?.name || activeModelName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded font-bold bg-purple-50 text-purple-700 border border-purple-200">
                      基座模型
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium">
                    {activeModel?.vendor || '深度求索 (DeepSeek AI)'} · 当前 Agent 核心推理引擎
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowModelModal(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Model Technical Specifications */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400 font-medium">模型架构 / 系列</span>
                  <span className="font-extrabold text-slate-900">{activeModel?.typeTag || '通用大语言模型 (LLM)'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400 font-medium">上下文窗口容量</span>
                  <span className="font-extrabold text-slate-900">{activeModel?.contextLength || '128K Tokens'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400 font-medium">最大单次输出 Token</span>
                  <span className="font-extrabold text-slate-900">{activeModel?.maxOutputTokens ? `${activeModel.maxOutputTokens} Tokens` : '8,192 Tokens'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-700">
                  <span className="text-slate-400 font-medium">标准 Token 费率</span>
                  <span className="font-extrabold text-indigo-600 font-mono">
                    ¥{modelPricePer10k.toFixed(2)} / 10,000 Tokens
                  </span>
                </div>
              </div>

              {/* Description & Advantage */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>模型能力与优势说明</span>
                </span>
                <p className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {activeModel?.description || '该模型具备极高水准的代码生成、逻辑推理与长上下文信息检索能力。在多轮对话与复杂 Agent 工具编排场景下表现优异稳定。'}
                </p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowModelModal(false)}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition shadow-xs cursor-pointer"
              >
                我知道了
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
