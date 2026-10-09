import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { ModelItem, ModelBillingRule } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Copy, 
  Check, 
  Play, 
  Code2, 
  Sparkles, 
  Sliders, 
  Send, 
  Download, 
  X, 
  CheckCircle2, 
  Terminal, 
  Cpu, 
  Zap, 
  ShieldCheck, 
  ExternalLink,
  Layers,
  FileText,
  CreditCard,
  MessageSquare,
  Bot,
  ArrowRight
} from 'lucide-react';

interface ModelDetailProps {
  model: ModelItem;
  onBack: () => void;
  fromTitle?: string;
}

export const ModelDetail: React.FC<ModelDetailProps> = ({ model, onBack, fromTitle }) => {
  const effectiveFromTitle = fromTitle || '模型广场';
  const { showToast, agents, openAgentDetail } = useApp();

  // 匹配使用该模型的 Agent 列表
  const matchedAgents = agents.filter(ag => 
    (ag.baseModelId && ag.baseModelId === model.id) ||
    (ag.linkedModel && (ag.linkedModel.toLowerCase().includes(model.name.toLowerCase()) || model.name.toLowerCase().includes(ag.linkedModel.toLowerCase()))) ||
    (ag.baseModel && (ag.baseModel.toLowerCase().includes(model.name.toLowerCase()) || model.name.toLowerCase().includes(ag.baseModel.toLowerCase())))
  );
  
  const displayAgents = matchedAgents.length > 0 ? matchedAgents : agents.slice(0, 3);

  // Active Tab: 'overview' | 'capabilities' | 'pricing' | 'apiDocs'
  const [activeTab, setActiveTab] = useState<'overview' | 'capabilities' | 'pricing' | 'apiDocs'>('overview');

  // Favorites & Copy state
  const [isFavorited, setIsFavorited] = useState(false);
  const [copiedId, setCopiedId] = useState(false);
  const [copiedCodeLang, setCopiedCodeLang] = useState<string | null>(null);

  // Trial Chat Side-Drawer state
  const [showTrialDrawer, setShowTrialDrawer] = useState(false);
  const [temperature, setTemperature] = useState<number>(0.7);
  const [maxTokens, setMaxTokens] = useState<number>(2048);
  const trialLimit = model.trialCountLimit !== undefined ? model.trialCountLimit : 5;
  const isTrialDisabled = trialLimit <= 0;

  const [trialMessages, setTrialMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    { role: 'assistant', content: `你好！我是 **${model.name}**。基于深度学习神经网络，支持高效智能问答、代码生成与复杂推理。请在下方输入框中向我提问。` }
  ]);
  const [trialInput, setTrialInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [trialLeft, setTrialLeft] = useState(trialLimit);

  // Subscription Modal state
  const [showSubscribeModal, setShowSubscribeModal] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<'week' | 'month' | 'quarter' | 'year'>('month');

  const modelId = model.modelCodeName || model.id || 'deepseek-v4-pro-0813';
  const authorName = model.author || model.vendor || 'DeepSeek';
  const vendorName = model.vendor || '官方接入';

  // Handle Copy Model ID
  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(modelId);
    }
    setCopiedId(true);
    showToast(`已复制模型 ID：${modelId}`);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Handle Favorite Toggle
  const handleToggleFavorite = () => {
    setIsFavorited(prev => {
      const next = !prev;
      showToast(next ? '已加入收藏夹' : '已取消收藏');
      return next;
    });
  };

  // Handle Share
  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('已复制模型公开链接到剪贴板！');
    } else {
      showToast('已生成分享链接！');
    }
  };

  // Handle Trial Chat Send
  const handleSendTrialMessage = () => {
    if (!trialInput.trim() || isTyping) return;
    if (trialLeft <= 0) {
      showToast('今日 30 次免费体验已用完，请订阅套餐获取无限制调用！');
      return;
    }

    const userText = trialInput.trim();
    setTrialInput('');
    setTrialMessages(prev => [...prev, { role: 'user', content: userText }]);
    setTrialLeft(prev => Math.max(0, prev - 1));
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      let aiResponse = `对于您提出的问题：“${userText}”，【${model.name}】（上下文长度 ${model.contextLength || '128K'}）给出以下智能分析与回答：\n\n1. **逻辑推理与解答**：模型已对输入 Prompt 进行深入理解与模态解析。\n2. **输出建议**：在包含 Temperature=${temperature}、Max Tokens=${maxTokens} 的推理参数下，该输出具备高度准确性与创造性。`;
      setTrialMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setIsTyping(false);
    }, 1000);
  };

  // Billing rules derived or defined
  const getBillingRules = (): ModelBillingRule[] => {
    if (model.billingRules && model.billingRules.length > 0) {
      return model.billingRules;
    }
    // Default fallback rules based on model fields
    const modalName = model.typeTag || '文本';
    return [
      {
        id: 'r_in_1',
        modality: modalName,
        direction: '输入',
        unit: 'Token（按M tokens）',
        price: parseFloat(model.priceInput.replace(/[^0-9.]/g, '')) || 9.0
      },
      {
        id: 'r_out_1',
        modality: modalName,
        direction: '输出',
        unit: 'Token（按M tokens）',
        price: parseFloat(model.priceOutput.replace(/[^0-9.]/g, '')) || 27.0
      }
    ];
  };

  const billingRules = getBillingRules();
  const inputRules = billingRules.filter(r => r.direction === '输入');
  const outputRules = billingRules.filter(r => r.direction === '输出' || r.direction !== '输入');

  // Code snippet generator
  const getPythonSnippet = () => {
    if (model.codePython) return model.codePython;
    return `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="${model.apiUrl || 'https://api.tokendance.space/gateway/v1'}"
)

response = client.chat.completions.create(
    model="${modelId}",
    messages=[{"role": "user", "content": "你好，请自我介绍"}],
    temperature=${temperature},
    max_tokens=${maxTokens},
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`;
  };

  const getCurlSnippet = () => {
    if (model.codeCurl) return model.codeCurl;
    return `curl ${model.apiUrl || 'https://api.tokendance.space/gateway/v1/chat/completions'} \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelId}",
    "messages": [{"role": "user", "content": "你好，请自我介绍"}],
    "temperature": ${temperature},
    "max_tokens": ${maxTokens},
    "stream": true
  }'`;
  };

  const handleCopyCode = (type: 'python' | 'curl', codeStr: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(codeStr);
    }
    setCopiedCodeLang(type);
    showToast(`已复制 ${type === 'python' ? 'Python' : 'cURL'} 代码示例到剪贴板！`);
    setTimeout(() => setCopiedCodeLang(null), 2000);
  };

  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 select-none">
      
      {/* 1. 顶部操作导航条 */}
      <div className="flex items-center justify-between border-b border-slate-200/80 pb-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 text-xs font-bold transition shadow-2xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回{effectiveFromTitle}</span>
        </button>
      </div>

      {/* 2. 顶部信息区 (两栏布局) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          
          {/* 左侧：模型基础与视觉元数据 */}
          <div className="flex items-start gap-5 flex-1 min-w-0">
            {/* Logo */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-slate-900 text-white border border-slate-800 flex items-center justify-center font-black text-2xl sm:text-3xl shrink-0 shadow-md">
              {model.logo ? (
                <img src={model.logo} alt={model.name} className="w-full h-full object-cover rounded-2xl" />
              ) : (
                vendorName.slice(0, 1)
              )}
            </div>

            <div className="space-y-2 min-w-0 flex-1">
              {/* 大号模型名称 */}
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight truncate">
                  {model.name}
                </h1>
              </div>

              {/* 模型ID 带复制按钮 */}
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
                <span>模型ID：{modelId}</span>
                <button
                  onClick={handleCopyId}
                  className="p-1 hover:bg-slate-100 rounded text-slate-400 hover:text-indigo-600 transition cursor-pointer"
                  title="复制模型ID"
                >
                  {copiedId ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* 作者 · 厂商 */}
              <div className="text-xs text-slate-600 font-semibold flex items-center gap-1.5">
                <span>{authorName}</span>
                <span className="text-slate-300">·</span>
                <span>{vendorName}</span>
                {model.providerList && model.providerList.length > 0 && (
                  <span className="text-slate-400 font-normal">
                    (涵盖 {model.providerList.slice(0, 3).join('、')})
                  </span>
                )}
              </div>

              {/* 模型一句话简介 */}
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium line-clamp-2">
                {model.brief || model.description || '暂无详细介绍'}
              </p>

              {/* 模态标签列表 */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                {(model.modalities || model.inputModalities || [model.typeTag]).map((mod, idx) => (
                  <span 
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200/80"
                  >
                    <span>🏷️</span>
                    <span>{mod}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* 右侧：操作按钮 */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-2.5 shrink-0 min-w-[160px]">
            {/* 【在线体验】 */}
            {isTrialDisabled ? (
              <button
                disabled
                className="w-full px-5 py-3 rounded-2xl bg-slate-100 text-slate-400 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-not-allowed border border-slate-200"
                title="管理者未开放在线体验或体验额度已设为0"
              >
                <Play className="w-4 h-4 text-slate-400" />
                <span>暂不支持在线体验</span>
              </button>
            ) : (
              <button
                onClick={() => setShowTrialDrawer(true)}
                className="w-full px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white text-xs font-extrabold shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>在线体验</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* 3. Tab 切换区 */}
      <div id="tab-contents-area" className="bg-white rounded-2xl p-1.5 border border-slate-200/80 shadow-2xs flex items-center gap-1">
        {[
          { id: 'overview', label: '模型介绍', icon: <FileText className="w-4 h-4" /> },
          { id: 'capabilities', label: '模型能力', icon: <Cpu className="w-4 h-4" /> },
          { id: 'pricing', label: '定价说明', icon: <CreditCard className="w-4 h-4" /> },
          { id: 'apiDocs', label: 'API文档', icon: <Terminal className="w-4 h-4" /> },
        ].map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 font-black'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* 4. Tab 内容区域 */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-2xs min-h-[360px]">
        
        {/* Tab 1: 模型介绍 */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-indigo-600" />
              <span>详细模型介绍与背景</span>
            </h3>

            <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
              <Markdown>
                {model.apiDocContent || model.description || '暂无 Markdown 详细介绍文档。'}
              </Markdown>
            </div>

            {/* 模型下载地址（如有） */}
            {model.downloadUrl && (
              <div className="mt-6 p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Download className="w-5 h-5 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">开源权重/模型文件下载地址</h4>
                    <p className="text-[11px] text-slate-500">可直接获取该开源大模型在 HuggingFace 或 ModelScope 的权重文件</p>
                  </div>
                </div>
                <a
                  href={model.downloadUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 transition shadow-2xs flex items-center gap-1.5 shrink-0"
                >
                  <span>访问下载链接</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}

            {/* 推荐Agent：使用该模型的Agent */}
            <div className="mt-8 pt-6 border-t border-slate-100 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-600" />
                  <h3 className="text-sm font-black text-slate-900">推荐 Agent（使用该模型的 Agent）</h3>
                </div>
                <span className="text-[11px] text-slate-400 font-medium">
                  共 {displayAgents.length} 个基座关联智能体
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayAgents.map(ag => (
                  <div
                    key={ag.id}
                    onClick={() => openAgentDetail(ag)}
                    className="p-4 rounded-2xl bg-slate-50 hover:bg-indigo-50/50 border border-slate-200/80 hover:border-indigo-200 transition-all cursor-pointer group space-y-3 shadow-2xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs shrink-0 group-hover:scale-105 transition">
                        {ag.avatar && ag.avatar.startsWith('http') ? (
                          <img src={ag.avatar} alt={ag.name} className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          <span>{ag.avatar || '🤖'}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-black text-slate-900 truncate group-hover:text-indigo-600 transition">
                          {ag.name}
                        </h4>
                        <span className="text-[11px] text-slate-500 font-medium truncate block">
                          {ag.category || ag.techForm || '智能助手'}
                        </span>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-normal">
                      {ag.slogan || ag.description || '基于该底座模型能力深度微调构建的高效智能体。'}
                    </p>

                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-indigo-600 font-bold">
                      <span>体验此 Agent</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: 模型能力 */}
        {activeTab === 'capabilities' && (
          <div className="space-y-8">
            {/* 1) 输入/输出模态 */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Layers className="w-5 h-5 text-indigo-600" />
                <span>输入 / 输出模态支持</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-xs font-bold text-slate-500">输入模态 (Input Modalities)</span>
                  <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                    {model.inputModalities?.join(' / ') || model.typeTag || '文本'}
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <span className="text-xs font-bold text-slate-500">输出模态 (Output Modalities)</span>
                  <p className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    {model.outputModalities?.join(' / ') || model.typeTag || '文本'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2) 能力参数 */}
            <div className="space-y-4">
              <h3 className="text-base font-black text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                <Cpu className="w-5 h-5 text-indigo-600" />
                <span>关键能力参数与协议</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-bold text-slate-500">上下文长度 (Context Window)</span>
                  <div className="text-lg font-black font-mono text-indigo-600">
                    {model.contextLength || '128K Tokens'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-bold text-slate-500">最大输出 Tokens</span>
                  <div className="text-lg font-black font-mono text-emerald-600">
                    {model.maxOutputTokens ? `${model.maxOutputTokens}` : '131,072 Tokens'}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                  <span className="text-xs font-bold text-slate-500">支持协议 (Supported Protocols)</span>
                  <div className="text-sm font-bold text-slate-800 flex flex-wrap gap-1 mt-1">
                    {(model.protocols || [model.protocol || 'Chat Completions']).map((p, i) => (
                      <span key={i} className="px-2 py-0.5 bg-white border border-slate-200 rounded text-xs font-mono">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 定价说明 */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-600" />
                <span>标准计费规则列表</span>
              </div>
              <span className="text-xs font-normal text-slate-500">支持阶梯扣费与包月代金券抵扣</span>
            </h3>

            {/* 输入规则分组 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500" />
                <span>1. 输入计费规则 (Input Pricing)</span>
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">适用模态</th>
                      <th className="p-3.5">计费方向</th>
                      <th className="p-3.5">计价单位</th>
                      <th className="p-3.5 text-right">单价 (人民币)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {inputRules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="p-3.5 font-bold text-slate-900">{rule.modality}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            {rule.direction}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{rule.unit}</td>
                        <td className="p-3.5 text-right font-black font-mono text-emerald-600 text-sm">
                          {rule.price !== undefined ? `¥${rule.price} / ${rule.unit.split('（')[0]}` : model.priceInput}
                        </td>
                      </tr>
                    ))}
                    {inputRules.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-400">暂无输入计费规则</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 输出规则分组 */}
            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>2. 输出计费规则 (Output Pricing)</span>
              </h4>

              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3.5">适用模态</th>
                      <th className="p-3.5">计费方向</th>
                      <th className="p-3.5">计价单位</th>
                      <th className="p-3.5 text-right">单价 (人民币)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    {outputRules.map((rule, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/60 transition">
                        <td className="p-3.5 font-bold text-slate-900">{rule.modality}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            {rule.direction}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600">{rule.unit}</td>
                        <td className="p-3.5 text-right font-black font-mono text-emerald-600 text-sm">
                          {rule.price !== undefined ? `¥${rule.price} / ${rule.unit.split('（')[0]}` : model.priceOutput}
                        </td>
                      </tr>
                    ))}
                    {outputRules.length === 0 && (
                      <tr>
                        <td colSpan={4} className="p-4 text-center text-slate-400">暂无输出计费规则</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: API文档 */}
        {activeTab === 'apiDocs' && (
          <div className="space-y-6">
            <h3 className="text-base font-black text-slate-900 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-indigo-600" />
                <span>OpenAI 兼容 API 调用规范</span>
              </div>
              <span className="text-xs font-mono text-slate-500">HTTP REST / Streaming Gateway</span>
            </h3>

            {/* 接入概览 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">接口 Base URL</span>
                <p className="text-xs font-mono font-bold text-slate-800 truncate">
                  {model.apiUrl || 'https://api.tokendance.space/gateway/v1'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">认证方式 (Auth)</span>
                <p className="text-xs font-bold text-slate-800">
                  {model.authType || 'Bearer Token / API Key'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                <span className="text-[11px] font-bold text-slate-400">指定模型参数 (model)</span>
                <p className="text-xs font-mono font-bold text-indigo-600 truncate">
                  {modelId}
                </p>
              </div>
            </div>

            {/* 请求参数说明 */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700">主要 Body 请求参数：</h4>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead className="bg-slate-50 text-slate-500 font-bold border-b border-slate-200">
                    <tr>
                      <th className="p-3">参数名</th>
                      <th className="p-3">类型</th>
                      <th className="p-3">必选</th>
                      <th className="p-3">描述</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="p-3 font-mono font-bold text-indigo-600">model</td>
                      <td className="p-3 font-mono text-slate-500">string</td>
                      <td className="p-3 text-rose-600 font-bold">是</td>
                      <td className="p-3">模型的逻辑ID，请输入 <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-indigo-600">{modelId}</code></td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-indigo-600">messages</td>
                      <td className="p-3 font-mono text-slate-500">array</td>
                      <td className="p-3 text-rose-600 font-bold">是</td>
                      <td className="p-3">对话上下文消息数组，包含 system / user / assistant 角色</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-indigo-600">temperature</td>
                      <td className="p-3 font-mono text-slate-500">float</td>
                      <td className="p-3 text-slate-400">否</td>
                      <td className="p-3">采样温度，范围 0.0 - 2.0，默认 0.7</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-indigo-600">max_tokens</td>
                      <td className="p-3 font-mono text-slate-500">integer</td>
                      <td className="p-3 text-slate-400">否</td>
                      <td className="p-3">单次生成最大 Token 数，最高限制为 {model.maxOutputTokens || 131072}</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-mono font-bold text-indigo-600">stream</td>
                      <td className="p-3 font-mono text-slate-500">boolean</td>
                      <td className="p-3 text-slate-400">否</td>
                      <td className="p-3">是否流式输出 (Server-Sent Events)</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 代码示例 (Python 优先，curl 次之) */}
            <div className="space-y-4 pt-2">
              {/* Python 示例 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">Python</span>
                    <span>1. Python SDK 示例 (优先使用)</span>
                  </span>
                  <button
                    onClick={() => handleCopyCode('python', getPythonSnippet())}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    {copiedCodeLang === 'python' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制 Python 代码</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{getPythonSnippet()}</code>
                </pre>
              </div>

              {/* cURL 示例 */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-mono text-[10px] font-bold">cURL</span>
                    <span>2. cURL 命令行请求示例</span>
                  </span>
                  <button
                    onClick={() => handleCopyCode('curl', getCurlSnippet())}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
                  >
                    {copiedCodeLang === 'curl' ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">已复制</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>复制 cURL 代码</span>
                      </>
                    )}
                  </button>
                </div>
                <pre className="p-4 rounded-2xl bg-slate-950 text-indigo-300 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800">
                  <code>{getCurlSnippet()}</code>
                </pre>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* 5. 在线体验抽屉 (Side Drawer) */}
      {showTrialDrawer && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end transition-opacity animate-fade-in">
          <div className="w-full max-w-xl bg-white h-full shadow-2xl flex flex-col justify-between animate-slide-left">
            
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                  <Play className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <span>{model.name} 在线实时体验</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                      在线可用
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                    每日 {trialLimit} 次免费体验，本日剩余: <strong className="text-indigo-600 font-bold">{trialLeft}</strong> 次
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowTrialDrawer(false)}
                className="p-2 hover:bg-slate-200/60 rounded-xl text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Parameter Adjustment Panel */}
            <div className="p-4 bg-slate-100/70 border-b border-slate-200/80 grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Temperature (采样温度)</span>
                  <span className="font-mono text-indigo-600">{temperature}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2"
                  step="0.1"
                  value={temperature}
                  onChange={(e) => setTemperature(parseFloat(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Max Tokens (单次输出)</span>
                  <span className="font-mono text-indigo-600">{maxTokens}</span>
                </div>
                <input
                  type="range"
                  min="256"
                  max="8192"
                  step="256"
                  value={maxTokens}
                  onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                  className="w-full accent-indigo-600 cursor-pointer"
                />
              </div>
            </div>

            {/* Chat Messages Stream */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
              {trialMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-xs leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-xs font-medium'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none shadow-xs'
                    }`}
                  >
                    <Markdown>{msg.content}</Markdown>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="p-3 rounded-2xl bg-white border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-600 animate-ping" />
                    <span>模型正在生成回答...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Footer */}
            <div className="p-4 bg-white border-t border-slate-200 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={trialInput}
                  onChange={(e) => setTrialInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendTrialMessage()}
                  placeholder={`向 ${model.name} 提问或发送测试指令...`}
                  className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 focus:bg-white transition"
                />
                <button
                  onClick={handleSendTrialMessage}
                  disabled={!trialInput.trim() || isTyping}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>发送</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 6. 订阅套餐 Modal (周卡/月卡/季卡/年卡选择) */}
      {showSubscribeModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 shadow-2xl relative">
            
            <button
              onClick={() => setShowSubscribeModal(false)}
              className="absolute top-5 right-5 p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-700 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2 text-center">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6 fill-current" />
              </div>
              <h3 className="text-lg font-black text-slate-900">
                订阅【{model.name}】通用算力额度
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                选择适合您的 Token 算力订阅方案，开启高效大模型调用
              </p>
            </div>

            {/* 套餐卡片选择 Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: 'week', name: '周卡', price: 49, tokens: '20 万 Token', tag: '短期体验' },
                { id: 'month', name: '月卡', price: 99, tokens: '50 万 Token', tag: '🔥 热门推荐', recommend: true },
                { id: 'quarter', name: '季卡', price: 199, tokens: '120 万 Token', tag: '性价比首选' },
                { id: 'year', name: '年卡', price: 499, tokens: '350 万 Token', tag: '超值省钱' },
              ].map(pkg => {
                const isSelected = selectedPackage === pkg.id;
                return (
                  <div
                    key={pkg.id}
                    onClick={() => setSelectedPackage(pkg.id as any)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/40 shadow-md shadow-amber-100'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    {pkg.tag && (
                      <span className={`absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                        pkg.recommend ? 'bg-amber-500 text-white' : 'bg-slate-900 text-white'
                      }`}>
                        {pkg.tag}
                      </span>
                    )}

                    <div className="space-y-1">
                      <span className="text-xs font-bold text-slate-700">{pkg.name}</span>
                      <div className="text-xl font-black font-mono text-slate-900">
                        ¥{pkg.price}
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-amber-700 bg-amber-100/70 px-2 py-1 rounded-lg mt-3 text-center">
                      {pkg.tokens}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 确认订阅按钮 */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setShowSubscribeModal(false);
                  showToast(`成功订阅【${model.name}】算力套餐！已发放对应 Token 额度到账户。`);
                }}
                className="w-full py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md shadow-amber-200 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>立即支付并完成订阅</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
