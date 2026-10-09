import React, { useState } from 'react';
import { AgentItem, AgentSubscriptionItem, AgentComment } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Bot, 
  Star, 
  Heart, 
  Share2, 
  Building2, 
  Zap, 
  Send, 
  Code2, 
  BookOpen, 
  MessageSquare, 
  CheckCircle2, 
  Sparkles, 
  Coins, 
  Play, 
  ShieldCheck, 
  X,
  FileText,
  Copy,
  Check,
  Cpu,
  Layers,
  Activity,
  Terminal,
  Server
} from 'lucide-react';
import { validateTextOnlyComment } from '../../utils/commentValidator';

interface AgentDetailViewModalProps {
  agent: AgentItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenSubscribeModal?: (agent: AgentItem) => void;
  onOpenQuotaModal?: (agent: AgentItem) => void;
  userSubscription?: AgentSubscriptionItem;
  isPayPerTokenMode?: boolean;
  trialCountLeft?: number;
  setTrialCountLeft?: React.Dispatch<React.SetStateAction<number>>;
  setPayPerTokenMode?: (enabled: boolean) => void;
}

export const AgentDetailViewModal: React.FC<AgentDetailViewModalProps> = ({
  agent,
  isOpen,
  onClose,
  userSubscription,
}) => {
  const { user, showToast, models, openModelDetail } = useApp();

  // Active Tab: 结构与 AI 集市 AgentDetailSubPage 保持一致
  const [activeTab, setActiveTab] = useState<'intro' | 'docs' | 'guide' | 'reviews'>('intro');
  const [copiedCodeLang, setCopiedCodeLang] = useState<string | null>(null);
  const [codeLang, setCodeLang] = useState<'curl' | 'python' | 'node'>('curl');

  // Review comment form state
  const [comments, setComments] = useState<AgentComment[]>(() => 
    agent?.comments && agent.comments.length > 0 
      ? agent.comments 
      : [
          { id: 'c1', userName: '张经理', userAvatar: '', rating: 5, content: '非常好用，多轮对话回复非常精准，给满分！', date: '2026-08-01' },
          { id: 'c2', userName: '刘工', userAvatar: '', rating: 5, content: '接入速度快，API 响应很高效。', date: '2026-08-05' }
        ]
  );
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState<number>(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Synchronize comments when agent changes
  React.useEffect(() => {
    if (agent) {
      if (agent.comments && agent.comments.length > 0) {
        setComments(agent.comments);
      }
    }
  }, [agent]);

  if (!isOpen || !agent) return null;

  const hasUsed = !!userSubscription || agent.isPurchased || agent.isUsed;

  // 底座模型
  const modelName = agent.baseModel || agent.linkedModel || 'DeepSeek V3';
  const matchedModel = models.find(m => 
    (agent.baseModelId && m.id === agent.baseModelId) || 
    (modelName && (m.name.toLowerCase().includes(modelName.toLowerCase()) || modelName.toLowerCase().includes(m.name.toLowerCase())))
  );

  const displayScenarios: string[] = 
    agent.categoryTags && agent.categoryTags.length > 0 
      ? agent.categoryTags 
      : (agent.scene ? [agent.scene] : ['智能客服']);

  const displayIndustries: string[] = 
    agent.industryTags && agent.industryTags.length > 0 
      ? agent.industryTags 
      : (agent.industry ? [agent.industry] : ['通用']);

  const freeQuota = agent.freeTokenQuota || 50000;

  // 体验启动逻辑 (统一支持企业客服 agent001 独立链接与外部链接)
  const handleLaunchTrial = () => {
    if (agent.id === 'ag_22' || agent.name.includes('企业客服') || agent.trialUrl) {
      const targetUrl = (agent.id === 'ag_22' || agent.name.includes('企业客服'))
        ? 'https://agent001-six.vercel.app/'
        : (agent.trialUrl || 'https://agent001-six.vercel.app/');
      showToast(`正在打开【${agent.name}】独立在线体验系统...`);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      onClose();
      return;
    }
    const trialUrl = `${window.location.origin}${window.location.pathname}?trial=${agent.id}`;
    window.open(trialUrl, '_blank');
    onClose();
  };

  // 代码示例生成
  const getCodeSnippet = () => {
    if (codeLang === 'curl') {
      return `curl https://api.tokendance.space/v1/agents/${agent.id}/run \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "messages": [
      { "role": "user", "content": "${agent.inputExample || '你好，请帮我分析此项业务。'}" }
    ],
    "stream": true
  }'`;
    } else if (codeLang === 'python') {
      return `import requests

url = "https://api.tokendance.space/v1/agents/${agent.id}/run"
headers = {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json"
}
payload = {
    "messages": [
        {"role": "user", "content": "${agent.inputExample || '你好，请帮我分析此项业务。'}"}
    ],
    "stream": True
}

response = requests.post(url, json=payload, headers=headers, stream=True)
for chunk in response.iter_lines():
    if chunk:
        print(chunk.decode('utf-8'))`;
    } else {
      return `const response = await fetch("https://api.tokendance.space/v1/agents/${agent.id}/run", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    messages: [
      { role: "user", content: "${agent.inputExample || '你好，请帮我分析此项业务。'}" }
    ],
    stream: true
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();
while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  console.log(decoder.decode(value));
}`;
    }
  };

  const handleCopyCode = (lang: string) => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCodeLang(lang);
    showToast(`已复制 ${lang.toUpperCase()} 调用代码示例`);
    setTimeout(() => setCopiedCodeLang(null), 2000);
  };

  // 纯文字评价提交 (与 AI 集市严格保持一致)
  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    const textToSubmit = newCommentText.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message?.replace('评论', '评价') || '请输入评价内容');
      return;
    }

    setSubmittingComment(true);
    setTimeout(() => {
      const newComment: AgentComment = {
        id: `c_${Date.now()}`,
        userName: user?.name || '平台开发者',
        userAvatar: user?.avatar || '',
        rating: newCommentRating,
        content: textToSubmit,
        date: new Date().toISOString().slice(0, 10)
      };

      setComments(prev => [newComment, ...prev]);
      setNewCommentText('');
      setNewCommentRating(5);
      setSubmittingComment(false);
      showToast('评价发布成功！感谢您的真实反馈');
    }, 250);
  };

  return (
    <div 
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-sm animate-fade-in overflow-y-auto cursor-pointer select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col max-h-[92vh] cursor-default"
      >
        
        {/* Modal Top Header (参考首页模型详情弹窗) */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-2xl shadow-xs shrink-0 overflow-hidden">
                {agent.avatar && agent.avatar.startsWith('http') ? (
                  <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
                ) : (
                  <span>{agent.avatar || '🤖'}</span>
                )}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    {agent.name}
                  </h2>
                  <span className="bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-[10px] font-extrabold px-2 py-0.5 rounded-md shrink-0 flex items-center gap-1 shadow-2xs">
                    <Sparkles className="w-3 h-3 text-indigo-600" />
                    <span>{freeQuota.toLocaleString()} Token 体验额度</span>
                  </span>
                  {hasUsed && (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200/80 text-[10px] font-bold px-2 py-0.5 rounded-md shrink-0 flex items-center gap-0.5">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>使用过</span>
                    </span>
                  )}
                </div>
                <div className="flex items-center flex-wrap gap-x-2.5 gap-y-1 text-xs text-slate-500 font-medium mt-1">
                  <span>开发者: <strong className="text-slate-700">{agent.developer || agent.author || '官方团队'}</strong></span>
                  <span>·</span>
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{(agent.rating ?? 5.0).toFixed(1)}</span>
                    <span className="text-slate-400 font-normal">({comments.length + (agent.ratingCount ?? 120)}人评价)</span>
                  </div>
                  <span>·</span>
                  <span className="text-indigo-600 font-extrabold">{(agent.callUsersCount ?? agent.subscribersCount ?? agent.usageCount ?? 1280).toLocaleString()} 次调用</span>
                </div>
              </div>
            </div>

            {/* Taxonomy Badges */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                形态: {agent.techForm || agent.appType || 'Agent'}
              </span>
              {displayScenarios.map((sc, idx) => (
                <span key={`sc-${idx}`} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-cyan-50 text-cyan-700 border border-cyan-100">
                  {sc}
                </span>
              ))}
              {displayIndustries.map((ind, idx) => (
                <span key={`ind-${idx}`} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {ind}
                </span>
              ))}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-100 flex items-center gap-1">
                <Cpu className="w-3 h-3 text-purple-600" />
                <span>底座: {modelName}</span>
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="self-start sm:self-center p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Nav Anchor Tabs (展示和 AI 集市一致的 4 个 TAB) */}
        <div className="px-6 border-b border-slate-200/80 flex items-center gap-8 text-xs font-bold bg-white">
          {[
            { id: 'intro', label: '功能介绍', icon: Sparkles },
            { id: 'docs', label: '技术文档', icon: FileText },
            { id: 'guide', label: '使用指南', icon: BookOpen },
            { id: 'reviews', label: `用户评价 (${comments.length})`, icon: MessageSquare }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3.5 border-b-2 transition flex items-center gap-1.5 cursor-pointer font-extrabold ${
                  isActive
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs flex-1">
          
          {/* TAB 1: 功能介绍 */}
          {activeTab === 'intro' && (
            <div className="space-y-6 animate-fade-in">
              {/* Slogan */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 border-l-4 border-l-indigo-600 text-slate-700 font-medium leading-relaxed">
                <span className="font-bold text-slate-900 mr-2">核心定位：</span>
                {agent.slogan || agent.description || '高阶自动化人工智能代理助手，支持多轮深度对话与专业场景闭环处理。'}
              </div>

              {/* 核心技术能力 */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>核心技术能力</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(agent.capabilityDesc || [
                    '智能解答常见问题，支持多轮流畅上下文理解与自省纠错',
                    '支持无缝接入网站、小程序、微信公众号与外部业务 API',
                    '可进行专有知识库向量化检索与高保真召回答疑',
                    '具备复杂任务工具调用与多步骤协同编排规划能力'
                  ]).map((cap, i) => (
                    <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-slate-700 font-medium flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{cap}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 适用业务场景 */}
              <div className="space-y-3">
                <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-cyan-600" />
                  <span>适用业务场景</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {(agent.applicableScenes || [
                    '政务服务：政策法规咨询、办事指南指引与智能流转答疑',
                    '电商零售：售前售后多语种客服、工单自动分配与订单状态追踪',
                    '企业内部：HR 制度查询、IT 运维报障与会议纪要自动归纳',
                    '开发者支持：SDK 调用范例、常见报错检索与代码重构辅助'
                  ]).map((sc, i) => (
                    <div key={i} className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl text-slate-600 font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                      <span>{sc}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 范例提问与回答 */}
              {(agent.inputExample || agent.outputExample) && (
                <div className="space-y-3">
                  <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-4 h-4 text-purple-600" />
                    <span>交互范例演示</span>
                  </h4>
                  <div className="space-y-2.5 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    {agent.inputExample && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded">用户提问</span>
                        <p className="text-slate-800 font-semibold bg-white p-2.5 rounded-xl border border-slate-200/60 mt-1">
                          {agent.inputExample}
                        </p>
                      </div>
                    )}
                    {agent.outputExample && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Agent 回复</span>
                        <p className="text-slate-700 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-200/60 mt-1">
                          {agent.outputExample}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* 计费模式与额度说明卡片 */}
              <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4 text-indigo-600" />
                    <span className="font-extrabold text-slate-900">按量计费 · 即开即用</span>
                  </div>
                  <p className="text-slate-500 text-[11px]">
                    已全面取消繁琐套餐订阅。按实际消耗 Token 计费，注册即送免费额度，无需预先充值即可在线测试体验。
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs text-indigo-700 font-bold">赠送额度: {freeQuota.toLocaleString()} Tokens</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 技术文档 */}
          {activeTab === 'docs' && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div>
                  <h4 className="text-sm font-extrabold text-slate-900">标准 RESTful API 集成文档</h4>
                  <p className="text-slate-500 text-[11px]">支持标准 HTTP/HTTPS 请求与 Server-Sent Events (SSE) 流式传输</p>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
                  {(['curl', 'python', 'node'] as const).map(lang => (
                    <button
                      key={lang}
                      onClick={() => setCodeLang(lang)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                        codeLang === lang ? 'bg-white text-indigo-600 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Code Snippet Box */}
              <div className="relative rounded-2xl bg-slate-950 text-slate-200 p-4 font-mono text-[11px] overflow-hidden shadow-inner">
                <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 mb-3">
                  <span className="text-emerald-400 font-bold">POST /v1/agents/{agent.id}/run</span>
                  <button
                    onClick={() => handleCopyCode(codeLang)}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold transition cursor-pointer"
                  >
                    {copiedCodeLang === codeLang ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCodeLang === codeLang ? '已复制' : '复制代码'}</span>
                  </button>
                </div>
                <pre className="overflow-x-auto whitespace-pre leading-relaxed text-slate-300">
                  {getCodeSnippet()}
                </pre>
              </div>

              {/* Specs Metric Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block mb-0.5">平均响应延迟</span>
                  <span className="font-extrabold text-slate-900 font-mono text-sm">&lt; 320 ms</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block mb-0.5">传输协议</span>
                  <span className="font-extrabold text-indigo-700 font-mono text-sm">SSE 流式响应</span>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl text-center">
                  <span className="text-[10px] text-slate-400 block mb-0.5">服务高可用性</span>
                  <span className="font-extrabold text-emerald-600 font-mono text-sm">99.95% 可用</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 使用指南 */}
          {activeTab === 'guide' && (
            <div className="space-y-4 animate-fade-in text-slate-600 leading-relaxed">
              <h4 className="text-sm font-extrabold text-slate-900">📖 极速配置与接入指南</h4>
              
              <div className="space-y-3 bg-indigo-50/40 p-4.5 rounded-2xl border border-indigo-100 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">在线即开即用体验</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      点击弹窗底部的【立即体验】按钮，系统将直接在新标签页开启全屏对话沙盒，供您进行人机多轮深度对话与问答效果测评。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">获取 API Key 密钥</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      前往系统【个人工作台】的【API Key管理】板块，一键生成专属调用密钥，并将其妥善保存在您的服务器环境变量中。
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h5 className="font-bold text-slate-900">集成到自研系统或微服务中</h5>
                    <p className="text-slate-500 text-[11px] mt-0.5">
                      参考【技术文档】中的代码示例，向标准 API 端点发送请求即可完成对接。消耗 Token 将实时从账户余额中自动按量扣除。
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: 用户评价 */}
          {activeTab === 'reviews' && (
            <div className="space-y-6 animate-fade-in">
              {/* 发表评价表单 */}
              <form onSubmit={handleSubmitComment} className="p-4.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                    <span>发表您的真实评价</span>
                  </h4>
                  <div className="flex items-center gap-1">
                    <span className="text-[11px] text-slate-400 font-bold mr-1">评分:</span>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewCommentRating(star)}
                        className="p-0.5 cursor-pointer text-amber-400 hover:scale-110 transition-transform"
                      >
                        <Star className={`w-4 h-4 ${star <= newCommentRating ? 'fill-amber-400' : 'text-slate-300'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <textarea
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  placeholder="分享您对该 Agent 的实际使用体验、回答质量或技术反馈（严格规范：仅限纯文字，不可包含表情符号与图片）..."
                  rows={3}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none transition"
                />

                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] text-slate-400">仅限纯文字评价 · 登录账号：<strong className="text-slate-700">{user?.name || '开发者'}</strong></span>
                  <button
                    type="submit"
                    disabled={submittingComment}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{submittingComment ? '提交中...' : '发布评价'}</span>
                  </button>
                </div>
              </form>

              {/* 评价列表 */}
              <div className="space-y-3">
                <h4 className="text-xs font-black text-slate-900">全部真实评价 ({comments.length})</h4>
                <div className="space-y-3">
                  {comments.map((c) => (
                    <div key={c.id} className="p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-[10px] font-black">
                            {c.userName.slice(0, 1)}
                          </div>
                          <span className="font-extrabold text-slate-900 text-xs">{c.userName}</span>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500 font-bold text-xs">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{c.rating}.0</span>
                        </div>
                      </div>
                      <p className="text-slate-700 font-medium leading-relaxed text-xs pl-8">{c.content}</p>
                      <div className="text-[10px] text-slate-400 text-right">{c.date || '2026-08-10'}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Footer (体验按钮放置在弹窗底部，已移除繁琐订阅操作) */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-2">
            {hasUsed ? (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>您已使用过此智能体 · 随时可再次体验</span>
              </span>
            ) : (
              <span className="text-slate-600 font-medium flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>赠送 {freeQuota.toLocaleString()} Token 免费体验额度 · 极速启动</span>
              </span>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              关闭
            </button>
            <button
              onClick={handleLaunchTrial}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-600/20 hover:shadow-lg transition flex items-center gap-1.5 cursor-pointer hover:scale-[1.02] active:scale-95"
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              <span>立即体验</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
