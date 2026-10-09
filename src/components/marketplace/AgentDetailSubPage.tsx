import React, { useState } from 'react';
import { AgentItem, AgentSubscriptionItem, AgentComment } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Star, 
  Zap, 
  Sparkles, 
  CheckCircle2, 
  FileText, 
  BookOpen, 
  MessageSquare, 
  Play, 
  ShieldCheck,
  Coins,
  Send,
  User,
  Clock,
  Layers,
  Cpu,
  Building2,
  Share2,
  ChevronRight
} from 'lucide-react';
import { validateTextOnlyComment } from '../../utils/commentValidator';

interface AgentDetailSubPageProps {
  agent: AgentItem;
  onBack: () => void;
  userSubscription?: AgentSubscriptionItem;
  isPayPerTokenMode?: boolean;
  trialCountLeft?: number;
  fromTitle?: string;
}

export const AgentDetailSubPage: React.FC<AgentDetailSubPageProps> = ({
  agent,
  onBack,
  fromTitle
}) => {
  const effectiveFromTitle = fromTitle || 'Agent 商店';
  const { showToast, user, models, openModelDetail } = useApp();
  const [activeTab, setActiveTab] = useState<'intro' | 'docs' | 'guide' | 'reviews'>('intro');

  // 判断是否为平台已有模型
  const modelName = agent.baseModel || agent.linkedModel || '';
  const matchedModel = models.find(m => 
    (agent.baseModelId && m.id === agent.baseModelId) || 
    (modelName && (m.name.toLowerCase().includes(modelName.toLowerCase()) || modelName.toLowerCase().includes(m.name.toLowerCase())))
  );

  // Review comment form state
  const [comments, setComments] = useState<AgentComment[]>(() => 
    agent.comments && agent.comments.length > 0 
      ? agent.comments 
      : [
          { id: 'c1', userName: '张经理', userAvatar: '', rating: 5, content: '非常好用，多轮对话回复非常精准，给满分！', date: '2026-08-01' },
          { id: 'c2', userName: '刘工', userAvatar: '', rating: 5, content: '接入速度快，API 响应很高效。', date: '2026-08-05' }
        ]
  );
  const [newCommentText, setNewCommentText] = useState('');
  const [newCommentRating, setNewCommentRating] = useState<number>(5);
  const [submittingComment, setSubmittingComment] = useState(false);

  // Launch full-screen trial page in a new tab
  const handleLaunchTrial = () => {
    if (agent.id === 'ag_22' || agent.name.includes('企业客服') || agent.trialUrl) {
      const targetUrl = (agent.id === 'ag_22' || agent.name.includes('企业客服'))
        ? 'https://agent001-six.vercel.app/'
        : (agent.trialUrl || 'https://agent001-six.vercel.app/');
      showToast(`正在打开【${agent.name}】独立在线体验系统...`);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const trialUrl = `${window.location.origin}${window.location.pathname}?trial=${agent.id}`;
    window.open(trialUrl, '_blank');
  };

  // Submit comment handler (纯文字规范：仅限文字，禁止表情和图片)
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
        userName: user?.name || '平台体验官',
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
    }, 300);
  };

  // Display taxonomy tags
  const displayScenarios: string[] = 
    agent.categoryTags && agent.categoryTags.length > 0 
      ? agent.categoryTags 
      : (agent.scene ? [agent.scene] : ['办公助理']);

  const displayIndustries: string[] = 
    agent.industryTags && agent.industryTags.length > 0 
      ? agent.industryTags 
      : (agent.industry ? [agent.industry] : ['通用']);

  const freeQuota = agent.freeTokenQuota ?? 50000;

  return (
    <div className="space-y-6 select-none animate-fade-in max-w-7xl mx-auto pb-12">
      
      {/* 1. Top Navigation Bar */}
      <div className="flex items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 hover:text-indigo-600 hover:border-indigo-200 text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>返回{effectiveFromTitle}</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              showToast('已复制 Agent 分享链接');
            }}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer shadow-xs"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>分享</span>
          </button>
          <button
            onClick={handleLaunchTrial}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black shadow-md shadow-indigo-200 transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>立即体验 (新窗口打开)</span>
          </button>
        </div>
      </div>

      {/* 2. Profile Main Header Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-5">
          <div className="w-18 h-18 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-4xl shadow-xs shrink-0 overflow-hidden">
            {agent.avatar && agent.avatar.startsWith('http') ? (
              <img src={agent.avatar} alt={agent.name} className="w-full h-full object-cover" />
            ) : (
              <span>{agent.avatar || '🤖'}</span>
            )}
          </div>
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{agent.name}</h2>
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-lg">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{(agent.rating ?? 5.0).toFixed(1)}</span>
                <span className="text-slate-400 font-normal">({comments.length + (agent.ratingCount ?? 120)}人评价)</span>
              </div>
            </div>

            {/* Combined Badges */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              {agent.techForm && (
                <span className="bg-indigo-50 text-indigo-700 border border-indigo-100 font-bold px-2.5 py-0.5 rounded-md text-[11px]">
                  {agent.techForm}
                </span>
              )}
              {displayScenarios.map((sc, idx) => (
                <span key={idx} className="bg-cyan-50 text-cyan-700 border border-cyan-100 font-bold px-2.5 py-0.5 rounded-md text-[11px]">
                  {sc}
                </span>
              ))}
              {displayIndustries.map((ind, idx) => (
                <span key={idx} className="bg-emerald-50 text-emerald-700 border border-emerald-100 font-bold px-2.5 py-0.5 rounded-md text-[11px]">
                  {ind}
                </span>
              ))}
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">开发者：<strong className="text-slate-800">{agent.developer || agent.author || 'AI 平台官方'}</strong></span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-medium">调用用户：<strong className="text-indigo-600 font-extrabold">{(agent.callUsersCount ?? agent.subscribersCount ?? 128).toLocaleString()} 人</strong></span>
            </div>

            {/* Slogan */}
            <div className="text-xs font-semibold text-slate-600 pt-0.5">
              {agent.slogan || agent.description?.slice(0, 60) || '高阶多模态自动化智能体助手'}
            </div>
          </div>
        </div>

        {/* Clean Token Billing Status Box */}
        <div className="bg-slate-50 border border-slate-200/80 px-6 py-4 rounded-2xl flex flex-col justify-center min-w-[240px]">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">计费模式与额度</span>
          <div className="mt-1.5 space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-indigo-700 flex items-center gap-1.5 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200">
                <Coins className="w-3.5 h-3.5 text-indigo-600" />
                <span>按 Token 消耗计费</span>
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium flex items-center justify-between">
              <span>免费赠送额度:</span>
              <span className="font-extrabold text-slate-900">{freeQuota.toLocaleString()} Tokens</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Detailed View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left/Main Section: Tabs & Detailed Contents */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs min-h-[500px] flex flex-col">
            
            {/* Tab Selection Navigation */}
            <div className="flex border-b border-slate-200 text-xs font-extrabold gap-6 mb-6">
              {[
                { id: 'intro', label: '功能介绍', icon: Sparkles },
                { id: 'docs', label: '技术文档', icon: FileText },
                { id: 'guide', label: '使用指南', icon: BookOpen },
                { id: 'reviews', label: `用户评价 (${comments.length})`, icon: MessageSquare }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`pb-3 px-1 flex items-center gap-1.5 border-b-2 transition cursor-pointer ${
                      isActive 
                        ? 'border-indigo-600 text-indigo-600 font-black' 
                        : 'border-transparent text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Body */}
            <div className="flex-1 text-xs text-slate-700 font-medium leading-relaxed">
              
              {/* 1. 功能介绍 */}
              {activeTab === 'intro' && (
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5 border-l-4 border-indigo-600 pl-2.5">
                      <span>核心技术能力</span>
                    </h4>
                    <p className="text-slate-600 font-medium leading-relaxed">
                      {agent.description || '该智能体具备深度逻辑推理与自动化生产级编排能力。经过千万级业务语料微调与真实系统测试。'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      {(agent.capabilityDesc || [
                        '智能解答常见问题，支持多轮流畅对话',
                        '支持无缝接入网站、小程序、微信公众号等多种渠道',
                        '可进行专有知识库向量化检索答疑',
                        '具备复杂任务工具调用与多步骤协同规划能力'
                      ]).map((cap, i) => (
                        <div key={i} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl text-slate-700 font-semibold flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 pt-2">
                    <h4 className="text-sm font-black text-slate-900 flex items-center gap-1.5 border-l-4 border-indigo-600 pl-2.5">
                      <span>适用业务场景</span>
                    </h4>
                    <div className="grid grid-cols-1 gap-2.5">
                      {(agent.applicableScenes || [
                        '政务服务：政策法规咨询、办事指南指引与智能流转',
                        '企业协同：跨部门知识检索、会议纪要整理与日程编排',
                        '客户运营：售前售后多语种支持、工单自动分配与满意度跟进'
                      ]).map((sc, i) => (
                        <div key={i} className="p-3 bg-slate-50/70 border border-slate-200/60 rounded-xl text-slate-600 font-semibold flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                          <span>{sc}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. 技术文档 */}
              {activeTab === 'docs' && (
                <div className="space-y-4">
                  <p className="text-slate-600">
                    该 Agent 支持标准 RESTful 接口集成与 SSE 流式响应。通过本平台发放的 API Key，即可将高级智能体服务无缝接入至您的自研系统或业务软件中。
                  </p>
                  <div className="space-y-3 text-xs bg-slate-950 text-slate-100 p-5 rounded-2xl font-mono relative overflow-hidden shadow-sm">
                    <div className="flex items-center justify-between text-slate-400 border-b border-slate-800 pb-2 text-[11px]">
                      <span>API RESTful Specification</span>
                      <span className="text-emerald-400 font-bold">POST /api/v1/agents/{agent.id}/run</span>
                    </div>
                    <pre className="text-[11px] text-slate-300 whitespace-pre-wrap leading-relaxed overflow-x-auto pt-2">
{`// Header: Authorization: Bearer <YOUR_API_KEY>
// Content-Type: application/json
{
  "stream": true,
  "messages": [
    { 
      "role": "user", 
      "content": "${agent.inputExample || '你好，请帮我分析此份数据大纲。'}" 
    }
  ]
}`}
                    </pre>
                  </div>
                  <div className="flex flex-wrap justify-between items-center bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-xs text-slate-600 gap-2">
                    <span className="font-semibold">响应延迟：均值 &lt; 320ms</span>
                    <span className="font-semibold text-indigo-600">支持标准 Server-Sent Events (SSE) 流式传输</span>
                  </div>
                </div>
              )}

              {/* 3. 使用指南 */}
              {activeTab === 'guide' && (
                <div className="space-y-4">
                  <h4 className="text-sm font-black text-slate-900">📖 极速配置与应用指南</h4>
                  <div className="space-y-3 text-slate-600 leading-relaxed bg-indigo-50/30 p-5 rounded-2xl border border-indigo-100">
                    <p>
                      {agent.useGuide || '您可以在当前页面右上角直接点击【免费试用】按钮，本平台将开启全屏沙盒窗口供您进行人机多轮深度对话。体验满意后，点击立即订阅即可开通专属云部署，并解锁无限次高吞吐 API 服务调用权限。'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-medium">
                      注：如需在本地、微信应用、企业微信或 Web 端嵌入该 Agent，请先在“工作台 - API Key”中生成相应密钥，并根据上方技术文档进行接口对接。
                    </p>
                  </div>
                </div>
              )}

              {/* 4. 用户评价区 (含发评论表单) */}
              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  
                  {/* 发表评价 Form */}
                  <form onSubmit={handleSubmitComment} className="p-5 bg-indigo-50/30 border border-indigo-100 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600" />
                        <span>发表您的使用评价</span>
                      </h4>
                      {/* Rating Stars Selector */}
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
                      placeholder="分享您对该 Agent 的使用体验、回复质量或建议（仅限纯文字，不可发表情与图片）..."
                      rows={3}
                      className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 resize-none transition"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-slate-400">仅限纯文字评价 · 已登录为：<strong className="text-slate-700">{user?.name || '体验用户'}</strong></span>
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

                  {/* Comments List */}
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
          </div>
        </div>

        {/* Right Section: Technical Specs (Clean & 精简) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Quick Specifications (Removed interface protocol, version, recommend index) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              <span>技术指标规格</span>
            </h3>
            
            <div className="space-y-3 text-xs text-slate-600 font-medium">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">底座模型</span>
                <div className="flex items-center gap-2">
                  <span className="text-slate-800 font-extrabold">{agent.baseModel || agent.linkedModel || 'DeepSeek V3'}</span>
                  {matchedModel ? (
                    <button
                      onClick={() => openModelDetail(matchedModel)}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <span>申购同款模型</span>
                      <ChevronRight className="w-3 h-3 text-purple-600" />
                    </button>
                  ) : (
                    <button
                      onClick={() => openModelDetail(models[0])}
                      className="px-2.5 py-1 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-[11px] font-bold transition cursor-pointer flex items-center gap-1 shrink-0"
                    >
                      <span>申购同款模型</span>
                      <ChevronRight className="w-3 h-3 text-purple-600" />
                    </button>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">技术形态</span>
                <span className="text-indigo-600 font-extrabold">{agent.techForm || 'Agent'}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-400">应用场景</span>
                <span className="text-cyan-700 font-extrabold">{displayScenarios.join('、')}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-400">行业领域</span>
                <span className="text-emerald-700 font-extrabold">{displayIndustries.join('、')}</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

