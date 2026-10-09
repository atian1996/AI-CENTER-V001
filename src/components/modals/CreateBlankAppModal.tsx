import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { AppType, AppSceneType, IndustryDomainType } from '../../types';
import { 
  X, 
  GitFork, 
  MessageSquareShare, 
  Bot, 
  Sparkles, 
  FileText, 
  ChevronDown, 
  ChevronRight,
  Play, 
  Layers, 
  Cpu, 
  Database, 
  Sliders, 
  Code, 
  ArrowRight,
  Check,
  Smile,
  Workflow
} from 'lucide-react';

interface TypeConfig {
  type: AppType;
  title: string;
  subtitle: string;
  iconBg: string;
  badgeBg: string;
  icon: React.ReactNode;
  detailTitle: string;
  detailDesc: string;
  previewType: 'workflow' | 'chatflow' | 'chatbot' | 'agent' | 'textgen';
}

const APP_TYPE_CONFIGS: Record<AppType, TypeConfig> = {
  '工作流': {
    type: '工作流',
    title: '工作流',
    subtitle: '面向单轮自动化任务的编排工作流',
    iconBg: 'bg-blue-600 text-white',
    badgeBg: 'bg-blue-100 text-blue-700',
    icon: <GitFork className="w-5 h-5" />,
    detailTitle: '工作流',
    detailDesc: '基于工作流编排，适用于自动化、批处理等单轮生成类任务的场景。',
    previewType: 'workflow'
  },
  'Chatflow': {
    type: 'Chatflow',
    title: 'Chatflow',
    subtitle: '支持记忆的复杂多轮对话工作流',
    iconBg: 'bg-sky-500 text-white',
    badgeBg: 'bg-sky-100 text-sky-700',
    icon: <MessageSquareShare className="w-5 h-5" />,
    detailTitle: 'Chatflow',
    detailDesc: '支持多轮对话、上下文记忆与复杂业务逻辑判断的工作流编排。',
    previewType: 'chatflow'
  },
  '聊天助手': {
    type: '聊天助手',
    title: '聊天助手',
    subtitle: '简单配置即可构建基于 LLM 的对话机器人',
    iconBg: 'bg-blue-600 text-white',
    badgeBg: 'bg-blue-100 text-blue-700',
    icon: <Bot className="w-4 h-4" />,
    detailTitle: '聊天助手',
    detailDesc: '面向日常智能客服、问答咨询的轻量级对话应用，开箱即用。',
    previewType: 'chatbot'
  },
  'Agent': {
    type: 'Agent',
    title: 'Agent',
    subtitle: '具备推理与自主工具调用的智能助手',
    iconBg: 'bg-purple-600 text-white',
    badgeBg: 'bg-purple-100 text-purple-700',
    icon: <Sparkles className="w-4 h-4" />,
    detailTitle: 'Agent',
    detailDesc: '具备思考推理链（CoT）、工具自主调度与外部 API 调用的高阶智能体。',
    previewType: 'agent'
  },
  '文本生成应用': {
    type: '文本生成应用',
    title: '文本生成应用',
    subtitle: '用于文本生成任务的 AI 助手',
    iconBg: 'bg-emerald-600 text-white',
    badgeBg: 'bg-emerald-100 text-emerald-700',
    icon: <FileText className="w-4 h-4" />,
    detailTitle: '文本生成应用',
    detailDesc: '专注于结构化文案、报告生成、翻译与文章撰写的单向生成工具。',
    previewType: 'textgen'
  }
};

const EMOJI_OPTIONS = ['🤖', '📁', '📝', '⚡', '🎨', '🧠', '📊', '🌐', '💡', '🔍', '🚀', '🔥', '🛡️', '📦'];
const COLOR_OPTIONS = [
  'bg-rose-100 border-rose-200 text-rose-600',
  'bg-amber-100 border-amber-200 text-amber-600',
  'bg-sky-100 border-sky-200 text-sky-600',
  'bg-orange-100 border-orange-200 text-orange-600',
  'bg-slate-100 border-slate-200 text-slate-600',
  'bg-emerald-100 border-emerald-200 text-emerald-600',
  'bg-purple-100 border-purple-200 text-purple-600',
  'bg-indigo-100 border-indigo-200 text-indigo-600'
];

export const CreateBlankAppModal: React.FC = () => {
  const { createAgentModalOpen, setCreateAgentModalOpen, addAgent, showToast } = useApp();

  const [selectedType, setSelectedType] = useState<AppType>('工作流');
  const [appName, setAppName] = useState('');
  const [selectedScene, setSelectedScene] = useState<AppSceneType>('办公助理');
  const [selectedIndustry, setSelectedIndustry] = useState<IndustryDomainType>('通用');
  const [appDesc, setAppDesc] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('🤖');
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [beginnerExpanded, setBeginnerExpanded] = useState(true);

  // Keyboard shortcut Ctrl+Enter to submit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        if (createAgentModalOpen && appName.trim()) {
          handleSubmit();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createAgentModalOpen, appName, selectedType, selectedScene, selectedIndustry, appDesc, selectedEmoji, selectedColor]);

  if (!createAgentModalOpen) return null;

  const currentConfig = APP_TYPE_CONFIGS[selectedType];

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!appName.trim()) {
      showToast('请输入应用名称');
      return;
    }

    const now = new Date();
    const formattedDate = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    addAgent({
      name: appName.trim(),
      avatar: selectedEmoji,
      iconBgColor: selectedColor,
      description: appDesc.trim() || `${currentConfig.title}应用`,
      category: selectedType === '工作流' ? 'coding' : selectedType === 'Agent' ? 'vertical' : 'dialogue',
      priceType: 'free',
      priceValue: 0,
      priceModel: '免费',
      appType: selectedType,
      techForm: selectedType,
      scene: selectedScene,
      categoryTags: [selectedScene],
      industry: selectedIndustry,
      industryTags: [selectedIndustry],
      tags: [selectedScene, selectedIndustry],
      author: '极客小千',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      baseModel: 'DeepSeek-V3 671B',
      version: '1.0.0',
      isDeveloped: true,
      updatedAt: formattedDate,
      techDocs: `基于 ${selectedType} 模式编排的应用。`
    });

    setCreateAgentModalOpen(false);
    setAppName('');
    setAppDesc('');
    setShowToastAndOrchestrate(appName.trim());
  };

  const setShowToastAndOrchestrate = (name: string) => {
    showToast(`✨ 成功创建【${name}】！点击列表卡片即可进入编排界面。`);
  };

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto flex items-center justify-center p-4 md:p-6 bg-slate-900/40 backdrop-blur-xs animate-fade-in select-none">
      <div 
        id="create-blank-app-modal"
        className="w-full max-w-5xl bg-white border border-slate-200/90 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[92vh] text-slate-800 my-auto"
      >
        
        {/* Left Column: Form Details (55%) */}
        <div className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col justify-between">
          <div className="space-y-6">
            
            {/* Modal Title */}
            <div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">创建空白应用</h2>
            </div>

            {/* Section 1: 选择应用类型 */}
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">选择应用类型</label>
              
              {/* Top Row: 工作流 & Chatflow */}
              <div className="grid grid-cols-2 gap-3">
                
                {/* 1. 工作流 */}
                <div
                  onClick={() => setSelectedType('工作流')}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 relative ${
                    selectedType === '工作流'
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/20'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <GitFork className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900">工作流</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                      面向单轮自动化任务的编排工作流
                    </div>
                  </div>
                </div>

                {/* 2. Chatflow */}
                <div
                  onClick={() => setSelectedType('Chatflow')}
                  className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 relative ${
                    selectedType === 'Chatflow'
                      ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/20'
                      : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <MessageSquareShare className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-black text-slate-900">Chatflow</div>
                    <div className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
                      支持记忆的复杂多轮对话工作流
                    </div>
                  </div>
                </div>

              </div>

              {/* Collapsible Trigger: 新手适用 ∨ */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setBeginnerExpanded(!beginnerExpanded)}
                  className="text-[11px] font-bold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer transition py-1"
                >
                  <span>新手适用</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${beginnerExpanded ? 'rotate-0' : '-rotate-90'}`} />
                </button>
              </div>

              {/* Bottom Row: 聊天助手 / Agent / 文本生成应用 */}
              {beginnerExpanded && (
                <div className="grid grid-cols-3 gap-3 pt-0.5">
                  
                  {/* 聊天助手 */}
                  <div
                    onClick={() => setSelectedType('聊天助手')}
                    className={`p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      selectedType === '聊天助手'
                        ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/20'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shrink-0 mb-2 shadow-xs">
                      <Bot className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">聊天助手</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-1 line-clamp-2">
                        简单配置即可构建基于 LLM 的对话机器人
                      </div>
                    </div>
                  </div>

                  {/* Agent */}
                  <div
                    onClick={() => setSelectedType('Agent')}
                    className={`p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      selectedType === 'Agent'
                        ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/20'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-purple-600 text-white flex items-center justify-center shrink-0 mb-2 shadow-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">Agent</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-1 line-clamp-2">
                        具备推理与自主工具调用的智能助手
                      </div>
                    </div>
                  </div>

                  {/* 文本生成应用 */}
                  <div
                    onClick={() => setSelectedType('文本生成应用')}
                    className={`p-3 rounded-xl border-2 transition cursor-pointer flex flex-col justify-between ${
                      selectedType === '文本生成应用'
                        ? 'border-blue-600 bg-blue-50/30 ring-1 ring-blue-600/20'
                        : 'border-slate-200/80 bg-white hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 mb-2 shadow-xs">
                      <FileText className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900">文本生成应用</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-1 line-clamp-2">
                        用于文本生成任务的 AI 助手
                      </div>
                    </div>
                  </div>

                </div>
              )}

            </div>

            {/* Section 2: 应用名称 & 图标 */}
            <div className="space-y-1.5 relative">
              <label className="text-xs font-bold text-slate-700 block">应用名称 & 图标</label>
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={appName}
                    onChange={(e) => setAppName(e.target.value)}
                    placeholder="给你的应用起个名字"
                    className="w-full px-3.5 py-2.5 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl text-xs font-bold text-slate-900 outline-none transition"
                  />
                </div>
                
                {/* Icon Button */}
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className={`w-10 h-10 rounded-xl border flex items-center justify-center text-lg font-bold shadow-2xs hover:scale-105 transition cursor-pointer ${selectedColor}`}
                    title="点击更换图标与配色"
                  >
                    {selectedEmoji}
                  </button>

                  {/* Emoji & Color Dropdown */}
                  {showEmojiPicker && (
                    <div className="absolute right-0 top-12 z-50 p-3 bg-white border border-slate-200 rounded-2xl shadow-xl w-64 space-y-3 animate-fade-in">
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase">选择 Emoji 图标</div>
                        <div className="grid grid-cols-7 gap-1">
                          {EMOJI_OPTIONS.map(em => (
                            <button
                              key={em}
                              type="button"
                              onClick={() => { setSelectedEmoji(em); }}
                              className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm hover:bg-slate-100 ${selectedEmoji === em ? 'bg-indigo-50 ring-1 ring-indigo-500' : ''}`}
                            >
                              {em}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-bold text-slate-400 mb-1.5 uppercase">选择背景配色</div>
                        <div className="grid grid-cols-4 gap-1.5">
                          {COLOR_OPTIONS.map((col, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => { setSelectedColor(col); }}
                              className={`h-6 rounded-md border flex items-center justify-center text-[10px] ${col} ${selectedColor === col ? 'ring-2 ring-blue-500 ring-offset-1' : ''}`}
                            >
                              ✓
                            </button>
                          ))}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setShowEmojiPicker(false)}
                        className="w-full py-1 text-[11px] font-bold text-center text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        确定
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 应用场景与行业领域 下拉选择 */}
            <div className="grid grid-cols-2 gap-3 pt-0.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">应用场景</label>
                <select
                  value={selectedScene}
                  onChange={(e) => setSelectedScene(e.target.value as AppSceneType)}
                  className="w-full px-3 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 outline-none transition cursor-pointer"
                >
                  {['内容创作', '数据分析', '智能客服', '办公助理', '编程开发', '营销推广', '教育培训', '行业垂直'].map(sc => (
                    <option key={sc} value={sc}>{sc}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">行业领域</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value as IndustryDomainType)}
                  className="w-full px-3 py-2 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-slate-200/80 focus:border-blue-500 rounded-xl text-xs font-semibold text-slate-800 outline-none transition cursor-pointer"
                >
                  {['通用', '政务', '制造', '零售', '金融', '医疗', '教育', '文旅', '物流'].map(ind => (
                    <option key={ind} value={ind}>{ind}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Section 3: 描述 (可选) */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 block">描述 <span className="text-slate-400 font-normal">(可选)</span></label>
              <textarea
                rows={3}
                value={appDesc}
                onChange={(e) => setAppDesc(e.target.value)}
                placeholder="输入应用的描述"
                className="w-full p-3 bg-slate-100/80 hover:bg-slate-100 focus:bg-white border border-transparent focus:border-blue-500 rounded-xl text-xs font-medium text-slate-800 outline-none resize-none transition"
              />
            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() => showToast('已为您加载 Dify 推荐应用模板库！')}
              className="text-xs font-bold text-slate-500 hover:text-blue-600 flex items-center gap-1 transition cursor-pointer"
            >
              <span>没有想法？试试我们的模版</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => setCreateAgentModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                取消
              </button>
              
              <button
                type="button"
                onClick={handleSubmit}
                disabled={!appName.trim()}
                className={`px-5 py-2 rounded-xl text-xs font-black shadow-xs transition flex items-center gap-1.5 cursor-pointer ${
                  appName.trim()
                    ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/20'
                    : 'bg-blue-200 text-white/80 cursor-not-allowed'
                }`}
              >
                <span>创建</span>
                <span className="text-[10px] font-mono px-1 py-0.2 rounded bg-white/20 ml-0.5">Ctrl ↵</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Column: Visual Introduction & Preview Mockup (45%) */}
        <div className="w-full md:w-[440px] bg-slate-50 border-l border-slate-200/80 p-6 md:p-8 flex flex-col justify-between relative overflow-hidden">
          
          {/* Close Button */}
          <button
            onClick={() => setCreateAgentModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Type Header Info */}
          <div className="space-y-1.5 pr-8">
            <h3 className="text-sm font-black text-slate-900">{currentConfig.detailTitle}</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {currentConfig.detailDesc}
            </p>
          </div>

          {/* High-Fidelity Interactive Preview Mockup */}
          <div className="my-auto py-4">
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-md p-3 space-y-2.5 overflow-hidden transform hover:scale-[1.01] transition-transform select-none">
              
              {/* Mockup Canvas Header */}
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-[10px]">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="font-bold text-slate-700">Auto-Saved 21:02:35 · Unpublished</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 font-bold text-[9px] flex items-center gap-0.5">
                    <Play className="w-2.5 h-2.5 fill-current" /> Run
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-blue-600 text-white font-bold text-[9px]">
                    Publish ▾
                  </span>
                </div>
              </div>

              {/* Node Flow Diagram Visual */}
              <div className="relative h-44 bg-slate-50/80 rounded-xl border border-slate-100 p-2.5 flex items-center justify-between overflow-hidden">
                
                {/* Node 1: Start Node */}
                <div className="w-24 bg-white border border-slate-200 rounded-lg p-1.5 shadow-2xs space-y-1 z-10">
                  <div className="flex items-center gap-1 text-[9px] font-black text-slate-800">
                    <span className="w-3.5 h-3.5 rounded bg-blue-600 text-white flex items-center justify-center text-[8px]">▶</span>
                    <span>START</span>
                  </div>
                  <div className="text-[8px] text-slate-400 font-mono bg-slate-50 p-0.5 rounded">sys.query</div>
                </div>

                {/* Connecting Line 1 */}
                <div className="flex-1 border-t-2 border-dashed border-blue-400 mx-1 relative flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-blue-500 -ml-1" />
                </div>

                {/* Node 2: LLM Node */}
                <div className="w-28 bg-white border-2 border-blue-500 rounded-lg p-1.5 shadow-xs space-y-1 z-10 ring-2 ring-blue-500/10">
                  <div className="flex items-center justify-between text-[9px] font-black text-blue-700">
                    <div className="flex items-center gap-1">
                      <Cpu className="w-3 h-3 text-blue-600" />
                      <span>LLM</span>
                    </div>
                    <span className="text-[8px] bg-blue-100 text-blue-700 px-1 rounded">GPT-4o</span>
                  </div>
                  <div className="text-[8px] text-slate-500 line-clamp-1">Invoking large language models</div>
                </div>

                {/* Connecting Line 2 */}
                <div className="flex-1 border-t-2 border-dashed border-emerald-400 mx-1 relative flex items-center justify-center">
                  <ChevronRight className="w-3 h-3 text-emerald-500 -ml-1" />
                </div>

                {/* Node 3: End Output Node */}
                <div className="w-24 bg-white border border-amber-300 rounded-lg p-1.5 shadow-2xs space-y-1 z-10">
                  <div className="flex items-center gap-1 text-[9px] font-black text-amber-700">
                    <span className="w-3.5 h-3.5 rounded bg-amber-500 text-white flex items-center justify-center text-[8px]">●</span>
                    <span>END</span>
                  </div>
                  <div className="text-[8px] text-slate-400 font-mono bg-slate-50 p-0.5 rounded">output: text</div>
                </div>

                {/* Floating Node Palette Menu */}
                <div className="absolute left-2 bottom-2 bg-white/95 backdrop-blur-xs border border-slate-200 rounded-lg p-1.5 shadow-lg text-[8px] space-y-0.5 font-bold text-slate-600 z-20">
                  <div className="text-[7px] text-slate-400 uppercase">快捷节点</div>
                  <div className="flex items-center gap-1 text-blue-600"><Cpu className="w-2.5 h-2.5" /> LLM 生成</div>
                  <div className="flex items-center gap-1 text-emerald-600"><Database className="w-2.5 h-2.5" /> 知识库检索</div>
                </div>

              </div>

              {/* Bottom Test Run Info */}
              <div className="bg-slate-50 rounded-lg p-2 text-[9px] flex items-center justify-between text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>就绪状态: 节点已连接 (3 节点)</span>
                </div>
                <span className="text-indigo-600 font-bold">延迟 ~180ms</span>
              </div>

            </div>
          </div>

          {/* Footnote tips */}
          <div className="text-[11px] text-slate-400 font-medium text-center">
            支持随时在编排画布中拖拽节点与调整大模型参数
          </div>

        </div>

      </div>
    </div>
  );
};
