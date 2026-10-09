import React, { useState } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  ArrowLeft, 
  Play, 
  Share2, 
  Settings, 
  Sparkles, 
  Sliders, 
  ChevronDown, 
  SlidersHorizontal,
  Activity,
  Server,
  Workflow,
  GitFork,
  MessageSquare,
  Bot,
  FileText,
  CheckCircle2,
  Copy,
  ExternalLink,
  History,
  Tag,
  Cpu
} from 'lucide-react';
import { ModelSettingsModal } from './ModelSettingsModal';
import { WorkflowOrchestrator } from './WorkflowOrchestrator';
import { ChatflowOrchestrator } from './ChatflowOrchestrator';
import { AgentOrchestrator } from './AgentOrchestrator';
import { ChatAssistantOrchestrator } from './ChatAssistantOrchestrator';
import { TextGeneratorOrchestrator } from './TextGeneratorOrchestrator';
import { OrchestrationApiView } from './OrchestrationApiView';
import { OrchestrationMonitorView } from './OrchestrationMonitorView';

interface AppOrchestrationViewProps {
  agent: AgentItem;
  onBack: () => void;
}

export const AppOrchestrationView: React.FC<AppOrchestrationViewProps> = ({ agent, onBack }) => {
  const { showToast } = useApp();

  // Navigation Tab: Orchestration / API / Monitor / Logs
  const [activeMainTab, setActiveMainTab] = useState<'orchestrate' | 'api' | 'monitor' | 'logs'>('orchestrate');

  // App Name
  const [appName, setAppName] = useState(agent.name);
  const [isEditingName, setIsEditingName] = useState(false);

  // Model selection
  const getDefaultModel = () => {
    const type = agent.appType || agent.techForm || 'Agent';
    if (type === '工作流') return 'gpt-5.4-mini';
    if (type === 'Chatflow') return 'gpt-5.1';
    if (type === '聊天助手') return 'abab5.5-chat';
    if (type === '文本生成应用') return 'abab5.5-chat';
    return 'gpt-4-1106-preview';
  };

  const [selectedModel, setSelectedModel] = useState(getDefaultModel());
  const [modelModalOpen, setModelModalOpen] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    setIsPublished(true);
    showToast(`🎉 应用【${appName}】已成功发布最新版本至生产环境！`);
  };

  // Determine current appType
  const appType = agent.appType || agent.techForm || 'Agent';

  return (
    <div className="flex flex-col h-[calc(100vh-80px)] bg-slate-100 text-slate-800 font-sans select-none overflow-hidden">
      
      {/* Model Parameter & Architecture Modal */}
      <ModelSettingsModal
        isOpen={modelModalOpen}
        onClose={() => setModelModalOpen(false)}
        currentModel={selectedModel}
        onSelectModel={(m) => {
          setSelectedModel(m);
          showToast(`已将底座模型切换为【${m}】`);
        }}
      />

      {/* Top Header Navigation Bar */}
      <header className="h-14 bg-white border-b border-slate-200/90 px-5 flex items-center justify-between shrink-0 shadow-2xs z-30">
        
        {/* Left: Back Button & App Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition cursor-pointer flex items-center gap-1"
            title="返回资产列表"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-2xs ${
              appType === '工作流' ? 'bg-blue-600' :
              appType === 'Chatflow' ? 'bg-sky-600' :
              appType === '聊天助手' ? 'bg-emerald-600' :
              appType === '文本生成应用' ? 'bg-amber-600' : 'bg-indigo-600'
            }`}>
              {appType === '工作流' && <Workflow className="w-4 h-4" />}
              {appType === 'Chatflow' && <GitFork className="w-4 h-4" />}
              {appType === '聊天助手' && <MessageSquare className="w-4 h-4" />}
              {appType === '文本生成应用' && <FileText className="w-4 h-4" />}
              {appType === 'Agent' && <Bot className="w-4 h-4" />}
            </div>

            <div className="flex items-center gap-2">
              {isEditingName ? (
                <input
                  type="text"
                  autoFocus
                  value={appName}
                  onChange={(e) => setAppName(e.target.value)}
                  onBlur={() => setIsEditingName(false)}
                  onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
                  className="text-sm font-bold text-slate-900 border-b-2 border-blue-500 bg-transparent outline-none px-1"
                />
              ) : (
                <h1 
                  onClick={() => setIsEditingName(true)}
                  className="text-sm font-bold text-slate-900 hover:text-blue-600 cursor-pointer transition flex items-center gap-1.5"
                  title="点击修改名称"
                >
                  <span>{appName}</span>
                </h1>
              )}

              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                appType === '工作流' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                appType === 'Chatflow' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                appType === '聊天助手' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                appType === '文本生成应用' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                'bg-indigo-50 text-indigo-700 border border-indigo-200'
              }`}>
                {appType}
              </span>
            </div>
          </div>
        </div>

        {/* Center: Main Functional Views Tabs */}
        <div className="flex bg-slate-100/90 p-1 rounded-xl gap-1 text-xs font-bold text-slate-600">
          <button
            onClick={() => setActiveMainTab('orchestrate')}
            className={`px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'orchestrate' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>编排</span>
          </button>

          <button
            onClick={() => setActiveMainTab('api')}
            className={`px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'api' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>访问 API</span>
          </button>

          <button
            onClick={() => setActiveMainTab('monitor')}
            className={`px-4 py-1.5 rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
              activeMainTab === 'monitor' 
                ? 'bg-white text-blue-600 shadow-xs' 
                : 'hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>监测</span>
          </button>
        </div>

        {/* Right: Model Selector & Publish Actions */}
        <div className="flex items-center gap-3">
          
          {/* Model Selector Pill (Matches 图 1、图 6、图 7) */}
          <div 
            onClick={() => setModelModalOpen(true)}
            className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 cursor-pointer transition text-xs shadow-2xs"
            title="配置底座大模型超参数"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="font-mono font-bold text-slate-800">{selectedModel}</span>
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Publish Button */}
          <button
            onClick={handlePublish}
            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition cursor-pointer"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>{isPublished ? '已发布 (更新)' : '发布'}</span>
          </button>

        </div>

      </header>

      {/* Main Viewport Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {activeMainTab === 'api' && (
          <OrchestrationApiView agent={{ ...agent, name: appName }} />
        )}

        {activeMainTab === 'monitor' && (
          <OrchestrationMonitorView agent={{ ...agent, name: appName }} />
        )}

        {activeMainTab === 'orchestrate' && (
          <>
            {/* 1. Workflow Orchestration (对应图 3) */}
            {appType === '工作流' && (
              <WorkflowOrchestrator 
                agent={{ ...agent, name: appName }}
                model={selectedModel}
                onOpenModelModal={() => setModelModalOpen(true)}
              />
            )}

            {/* 2. Chatflow Orchestration (对应图 2) */}
            {appType === 'Chatflow' && (
              <ChatflowOrchestrator 
                agent={{ ...agent, name: appName }}
                model={selectedModel}
                onOpenModelModal={() => setModelModalOpen(true)}
              />
            )}

            {/* 3. Agent Orchestration (对应图 1) */}
            {appType === 'Agent' && (
              <AgentOrchestrator 
                agent={{ ...agent, name: appName }}
                model={selectedModel}
                onOpenModelModal={() => setModelModalOpen(true)}
              />
            )}

            {/* 4. Chat Assistant Orchestration (对应图 6) */}
            {appType === '聊天助手' && (
              <ChatAssistantOrchestrator 
                agent={{ ...agent, name: appName }}
                model={selectedModel}
                onOpenModelModal={() => setModelModalOpen(true)}
              />
            )}

            {/* 5. Text Generator Orchestration (对应图 7) */}
            {appType === '文本生成应用' && (
              <TextGeneratorOrchestrator 
                agent={{ ...agent, name: appName }}
                model={selectedModel}
                onOpenModelModal={() => setModelModalOpen(true)}
              />
            )}
          </>
        )}
      </main>

    </div>
  );
};
