import React, { useState } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  AlertTriangle, 
  Sliders, 
  Send, 
  RefreshCw, 
  BookOpen, 
  Wrench, 
  Variable, 
  ChevronDown, 
  Globe, 
  Search, 
  CheckCircle2, 
  ChevronRight, 
  ExternalLink,
  MessageSquare,
  Bot,
  User,
  Zap,
  Info,
  Maximize2,
  Minimize2,
  Copy,
  Check
} from 'lucide-react';
import { PromptGeneratorModal } from './PromptGeneratorModal';

interface AgentOrchestratorProps {
  agent: AgentItem;
  model: string;
  onOpenModelModal: () => void;
}

export const AgentOrchestrator: React.FC<AgentOrchestratorProps> = ({
  agent,
  model,
  onOpenModelModal
}) => {
  const { showToast } = useApp();

  // Left panel states
  const [prompt, setPrompt] = useState<string>(
    agent.techDocs || `# 职位描述: 数据分析助手\n## 角色\n我的主要目标是为用户提供专家级的数据分析建议。利用详尽的数据资源，告诉我您想要分析的股票（提供股票代码）。我将以专家的身份，为您提供股票进行基础分析、技术分析、市场情绪分析以及宏观经济分析。\n\n## 技能\n### 技能1: 使用'Yahoo Finance'的'Ticker'搜索股票信息\n### 技能2: 使用'News'搜索目标公司的最新新闻\n### 技能3: 使用'Analytics'搜索目标公司的财务数据和分析\n\n## 工作流程\n1. 引导用户输入目标股票代号\n2. 依次调用新闻与财报分析工具\n3. 输出完整的投资决策建议报告`
  );
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  // Variables
  const [variables, setVariables] = useState([
    { id: 'v1', key: 'company', name: 'company', type: 'string', required: false, defaultVal: '' }
  ]);
  const [showAddVarModal, setShowAddVarModal] = useState(false);
  const [newVarKey, setNewVarKey] = useState('');

  // Knowledge bases
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([]);
  const [metaFilter, setMetaFilter] = useState<'disabled' | 'enabled'>('disabled');

  // Agent Tools
  const [tools, setTools] = useState([
    { id: 't1', name: 'yahoo 分析', desc: '用于深度财务比率与估值分析', enabled: true, hasWarning: true },
    { id: 't2', name: 'yahoo 新闻', desc: '实时获取华尔街最新快讯与情绪', enabled: true, hasWarning: false },
    { id: 't3', name: 'yahoo 股票信息', desc: '查询历史K线、市值、市盈率', enabled: true, hasWarning: true }
  ]);
  const [showAddToolModal, setShowAddToolModal] = useState(false);

  // Right panel (Debug & Preview)
  const [companyVarInput, setCompanyVarInput] = useState('');
  const [chatInput, setChatInput] = useState('');
  const [isThinking, setIsThinking] = useState(false);
  const [activeStep, setActiveStep] = useState<string | null>(null);

  const [messages, setMessages] = useState<Array<{
    id: string;
    role: 'assistant' | 'user';
    text: string;
    suggestedQuestions?: string[];
    toolCalls?: { tool: string; input: string; output: string }[];
  }>>([
    {
      id: 'm1',
      role: 'assistant',
      text: '欢迎使用您的个性化美股分析助手，在这里我们会深入地股票分析，为您提供全面的洞察。为了开始我们的金融之旅，请尝试提问：',
      suggestedQuestions: [
        '分析特斯拉的股票。',
        'Nvidia最近有哪些新闻？',
        '对亚马逊进行基本面分析。'
      ]
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
        type: 'string',
        required: false,
        defaultVal: ''
      }
    ]);
    setNewVarKey('');
    setShowAddVarModal(false);
    showToast(`已成功添加变量 {x} ${newVarKey}`);
  };

  const handleToggleTool = (id: string) => {
    setTools(prev => prev.map(t => t.id === id ? { ...t, enabled: !t.enabled } : t));
  };

  const handleDeleteTool = (id: string) => {
    setTools(prev => prev.filter(t => t.id !== id));
    showToast('已移除该工具调用插件');
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || chatInput;
    if (!query.trim() || isThinking) return;

    setChatInput('');
    const userMsgId = `u_${Date.now()}`;
    setMessages(prev => [...prev, { id: userMsgId, role: 'user', text: query }]);

    setIsThinking(true);
    setActiveStep('规划工具调用链...');

    setTimeout(() => {
      setActiveStep('正在执行 [yahoo 股票信息] 获取实时指标...');
      setTimeout(() => {
        setActiveStep('正在执行 [yahoo 新闻] 检索最新舆情研报...');
        setTimeout(() => {
          setIsThinking(false);
          setActiveStep(null);

          let replyText = '';
          if (query.includes('特斯拉') || query.includes('TSLA')) {
            replyText = `### 📊 特斯拉 (NASDAQ: TSLA) 综合分析报告\n\n**1. 核心财务指标**\n- 当前市值: ~$8,200 亿美元 | 市盈率 (TTM): 68.4\n- 自由现金流 (Q2): 13.4 亿美元，毛利率稳步维持在 18.2%\n\n**2. 实时舆情与催化剂**\n- FSD v13 自动驾驶在北美推送好评率上升；\n- Robotaxi 商业化落地预期与能源存储业务增长超 125%。\n\n**3. 投资决策评级**\n综合 Yahoo Finance 研报，维持 **【买入 / 增持】** 建议，目标价区间 $260 - $290。`;
          } else if (query.includes('Nvidia') || query.includes('NVDA') || query.includes('英伟达')) {
            replyText = `### 🚀 英伟达 (NASDAQ: NVDA) 最新动态与财报洞察\n\n**1. 近期重大新闻**\n- Blackwell 架构芯片产能全部订满，微软与 Meta 持续追加数十万张 B200 订单；\n- 数据中心业务同比增幅达到 154%，毛利率达 75.1%。\n\n**2. 风险与关注点**\n- 供应链 CoWoS 封装良率爬坡周期；\n\n**3. 评级**\n华尔街 48 家投行中 42 家给出 **【强力买入】** 评级。`;
          } else {
            replyText = `已针对目标实体 **${companyVarInput || query}** 调用 Yahoo Finance 多维工具链完成了深度研报检索。\n\n- **基本面**: 资产负债表稳健，现金储备充裕；\n- **技术面**: 50日均线向上穿越200日均线形成黄金交叉；\n- **分析师共识**: 综合评分 4.2 / 5.0。`;
          }

          setMessages(prev => [
            ...prev,
            {
              id: `a_${Date.now()}`,
              role: 'assistant',
              text: replyText,
              toolCalls: [
                { tool: 'yahoo 股票信息', input: 'symbol: TSLA/NVDA', output: 'status: 200 OK, metrics retrieved.' },
                { tool: 'yahoo 新闻', input: 'query: latest market sentiment', output: '15 relevant news parsed.' }
              ]
            }
          ]);
        }, 600);
      }, 600);
    }, 600);
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: 'm1',
        role: 'assistant',
        text: '欢迎使用您的个性化美股分析助手，在这里我们会深入地股票分析，为您提供全面的洞察。为了开始我们的金融之旅，请尝试提问：',
        suggestedQuestions: [
          '分析特斯拉的股票。',
          'Nvidia最近有哪些新闻？',
          '对亚马逊进行基本面分析。'
        ]
      }
    ]);
    showToast('已重置调试会话');
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100 select-none">
      
      {/* Prompt AI Generator Modal */}
      <PromptGeneratorModal
        isOpen={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
        onApply={(p) => {
          setPrompt(p);
          showToast('已成功应用生成的系统提示词！');
        }}
        appName={agent.name}
        appType="Agent"
      />

      {/* Add Variable Modal */}
      {showAddVarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800">添加输入变量</h4>
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">变量名 (Key)</label>
              <input
                type="text"
                autoFocus
                placeholder="例如：company 或 symbol"
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
                确定添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tool Modal */}
      {showAddToolModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-md shadow-xl space-y-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800">添加 Agent 工具插件 (Tools)</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {[
                { name: 'Google Search API', desc: '实时全网搜索与最新研报获取' },
                { name: 'Python Code Runner', desc: '在沙箱中运行量化回测与数学绘图' },
                { name: 'AlphaVantage API', desc: '全球外汇、加密货币与宏观经济指标' }
              ].map((t) => (
                <div 
                  key={t.name}
                  onClick={() => {
                    setTools(prev => [...prev, { id: `t_${Date.now()}`, name: t.name, desc: t.desc, enabled: true, hasWarning: false }]);
                    setShowAddToolModal(false);
                    showToast(`已添加工具【${t.name}】`);
                  }}
                  className="p-3 border border-slate-200 hover:border-blue-500 hover:bg-blue-50/40 rounded-xl cursor-pointer transition flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800">{t.name}</div>
                    <div className="text-[11px] text-slate-400">{t.desc}</div>
                  </div>
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => setShowAddToolModal(false)}
                className="px-4 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Column: Configuration Cards (55% width) */}
      <div className="w-[52%] h-full overflow-y-auto p-5 space-y-4 border-r border-slate-200/90 bg-slate-50/50">
        
        {/* 1. Prompt Card */}
        <div className="bg-white border-2 border-blue-600/90 rounded-2xl shadow-xs overflow-hidden transition">
          {/* Card Header */}
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-blue-50/20">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-800">提示词</span>
              <span className="text-[11px] text-slate-400 font-medium">系统设定 (System Role)</span>
            </div>
            <button
              onClick={() => setPromptModalOpen(true)}
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-blue-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>生成</span>
            </button>
          </div>

          {/* Prompt Textarea */}
          <div className="p-3 relative">
            <textarea
              rows={11}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-xs font-mono text-slate-800 leading-relaxed bg-transparent outline-none resize-none"
              placeholder="输入 Agent 设定的系统提示词..."
            />
            {/* Bottom status */}
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

          {variables.length > 0 ? (
            <div className="space-y-2">
              {variables.map((v) => (
                <div 
                  key={v.id}
                  className="px-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-blue-600 font-mono font-bold">{"{x}"}</span>
                    <span className="font-bold text-slate-800">{v.key}</span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500">{v.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-slate-400 font-mono">{v.type}</span>
                    <button 
                      onClick={() => setVariables(prev => prev.filter(item => item.id !== v.id))}
                      className="text-slate-300 hover:text-red-500 transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-slate-400 py-1">暂无输入变量，可点击右上角添加</div>
          )}
        </div>

        {/* 3. Knowledge Base Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">知识库</span>
            <button
              onClick={() => {
                setKnowledgeBases(['美股投资研究研报知识库 (12.4 MB)']);
                showToast('已挂载美股投资知识库！');
              }}
              className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加</span>
            </button>
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
            <span className="text-slate-500 font-medium">元数据过滤</span>
            <button 
              onClick={() => setMetaFilter(metaFilter === 'disabled' ? 'enabled' : 'disabled')}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-medium flex items-center gap-1 cursor-pointer"
            >
              <span>{metaFilter === 'disabled' ? '禁用' : '启用'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* 4. Tools Card (Agent Unique Feature - Exactly matching agent应用-编排.png) */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">工具</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-400 font-mono">
                {tools.filter(t => t.enabled).length}/{tools.length} 启用
              </span>
              <button
                onClick={() => setShowAddToolModal(true)}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {tools.map((tool) => (
              <div 
                key={tool.id}
                className="p-3 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-5 h-5 rounded-md bg-slate-200 text-slate-600 flex items-center justify-center shrink-0">
                    <Wrench className="w-3 h-3" />
                  </div>
                  <span className="font-bold text-slate-800 truncate" title={tool.name}>
                    {tool.name}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {tool.hasWarning && (
                    <span title="该工具建议配置专属 API Token">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                    </span>
                  )}
                  <button
                    onClick={() => handleDeleteTool(tool.id)}
                    className="text-slate-300 hover:text-red-500 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleToggleTool(tool.id)}
                    className={`w-7 h-4 rounded-full transition relative cursor-pointer ${
                      tool.enabled ? 'bg-blue-600' : 'bg-slate-300'
                    }`}
                  >
                    <span className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition ${
                      tool.enabled ? 'left-3.5' : 'left-0.5'
                    }`} />
                  </button>
                </div>
              </div>
            ))}
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

        {/* Variables Input Bar */}
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50/30 space-y-1.5">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>company <span className="text-slate-400">(选填)</span></span>
          </div>
          <input
            type="text"
            placeholder="company"
            value={companyVarInput}
            onChange={(e) => setCompanyVarInput(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-white border border-slate-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-100 outline-none transition"
          />
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

                {/* Tool call traces */}
                {m.toolCalls && m.toolCalls.length > 0 && (
                  <div className="p-2.5 bg-slate-900 text-slate-200 rounded-xl text-[11px] font-mono space-y-1.5 border border-slate-800">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold">
                      <Wrench className="w-3.5 h-3.5" />
                      <span>Agent 执行工具调用链路:</span>
                    </div>
                    {m.toolCalls.map((tc, i) => (
                      <div key={i} className="pl-4 border-l-2 border-slate-700 text-slate-300">
                        <span className="text-amber-400 font-bold">[{tc.tool}]</span> &rarr; {tc.output}
                      </div>
                    ))}
                  </div>
                )}

                {/* Suggested questions (Pills) */}
                {m.suggestedQuestions && (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {m.suggestedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(q)}
                        className="px-3 py-1.5 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-xs font-medium transition cursor-pointer text-left"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {m.role === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Thinking / Running Step Indicator */}
          {isThinking && (
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-2xl rounded-tl-xs text-xs text-blue-700 flex items-center gap-2 font-medium">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{activeStep || 'Agent 正在进行多步推理...'}</span>
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
              disabled={!chatInput.trim() || isThinking}
              className="absolute right-2.5 bottom-3.5 p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-200 text-white rounded-xl transition cursor-pointer shadow-xs"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Bottom Bar: Feature enabled & Manage */}
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
