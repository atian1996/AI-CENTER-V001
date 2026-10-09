import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ModelItem } from '../../types';
import { 
  X, 
  Send, 
  Sparkles, 
  Paperclip, 
  Sliders, 
  Search, 
  Star, 
  Plus, 
  MessageSquare, 
  ChevronDown, 
  Bot, 
  Check, 
  Cpu, 
  ArrowUp,
  RotateCcw
} from 'lucide-react';

export const ModelTryoutModal: React.FC = () => {
  const { tryoutModel, setTryoutModel, models, showToast } = useApp();

  // 当前激活的对话模型（默认 tryoutModel 或 列表中第一个模型）
  const [selectedModel, setSelectedModel] = useState<ModelItem | null>(tryoutModel || models[0] || null);

  // 控制【选择模型 Modal】显隐 (参考截图 3)
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerSearch, setPickerSearch] = useState('');
  const [pickerInputModality, setPickerInputModality] = useState('all');
  const [pickerOutputModality, setPickerOutputModality] = useState('all');
  const [favoritedModelIds, setFavoritedModelIds] = useState<Record<string, boolean>>({ mod_01: true, mod_04: true });

  // 对话列表与输入
  const [chatHistory, setChatHistory] = useState<Array<{ id: string; title: string }>>([
    { id: 'c1', title: '在吗' },
    { id: 'c2', title: '生成一个比赛封面：“灵境杯 AI影像...”' },
    { id: 'c3', title: '分析一下量化交易策略中的夏普比率...' },
  ]);
  const [activeChatId, setActiveChatId] = useState('c1');

  // 对话消息
  const [messages, setMessages] = useState<Array<{ id: string; sender: 'user' | 'assistant'; text: string; time: string }>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  // 参数配置 Modal
  const [showParamSettings, setShowParamSettings] = useState(false);
  const [temperature, setTemperature] = useState(0.7);
  const [topP, setTopP] = useState(0.9);

  if (!tryoutModel) return null;

  const currentModel = selectedModel || tryoutModel;

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoritedModelIds(prev => ({ ...prev, [id]: !prev[id] }));
    showToast(favoritedModelIds[id] ? '已取消收藏' : '已加入收藏！');
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isGenerating) return;

    const userText = inputMessage;
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setMessages(prev => [...prev, { id: Date.now().toString(), sender: 'user', text: userText, time: now }]);
    setInputMessage('');
    setIsGenerating(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userText,
          model: 'gemini-3.6-flash'
        })
      });
      const data = await res.json();
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          sender: 'assistant', 
          text: data.text || `【${currentModel.name} 原生回答】:\n\n非常高兴能回答您的问题！针对：“${userText}”，基于我的 ${currentModel.contextLength} 上下文与推理引擎，建议采用结构化逻辑进行处理...`, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    } catch {
      setMessages(prev => [
        ...prev, 
        { 
          id: (Date.now() + 1).toString(), 
          sender: 'assistant', 
          text: `【${currentModel.name} 示例生成】:\n已成功接收到您的指令：“${userText}”。\n\n模型的逻辑推理链已验证完毕，生成响应延迟为 ~${currentModel.latencyMs || 200}ms。`, 
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
        }
      ]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNewChat = () => {
    const newId = Date.now().toString();
    setChatHistory(prev => [{ id: newId, title: '新对话 session' }, ...prev]);
    setActiveChatId(newId);
    setMessages([]);
    showToast('已创建新对话');
  };

  // 过滤模型 Picker 列表 (仅支持文本类型模型进行在线对话体验)
  const filteredPickerModels = models.filter(m => {
    if (m.typeTag !== '文本') return false;
    if (pickerSearch && !m.name.toLowerCase().includes(pickerSearch.toLowerCase()) && !m.vendor.toLowerCase().includes(pickerSearch.toLowerCase())) {
      return false;
    }
    return true;
  });

  return (
    <div 
      onClick={() => setTryoutModel(null)}
      className="fixed inset-0 z-[95] overflow-y-auto flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in cursor-pointer select-none"
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-6xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[88vh] my-auto cursor-default relative"
      >
        
        {/* Top Header Bar */}
        <div className="px-5 py-3 border-b border-slate-200/80 bg-slate-50/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-black text-slate-900 flex items-center gap-2">
                大模型在线体验 Playground
              </div>
              <div className="text-[11px] text-slate-400 font-medium">
                多模型在线对话、参数调优与 Prompt 实时对比
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsPickerOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-900 text-xs font-extrabold shadow-2xs hover:shadow-xs flex items-center gap-2 transition cursor-pointer"
            >
              <div className="w-4 h-4 rounded bg-slate-900 text-white flex items-center justify-center font-bold text-[9px]">
                {currentModel.vendor.slice(0, 1)}
              </div>
              <span>当前: {currentModel.vendor}: {currentModel.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            <button
              onClick={() => setTryoutModel(null)}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer"
              title="关闭 Playground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Left History Sidebar + Right Playground Container */}
        <div className="flex-1 flex overflow-hidden">
          
          {/* Left Chat History List (参考截图 2 左侧) */}
          <div className="w-60 border-r border-slate-200 bg-slate-50/50 p-3 flex flex-col justify-between shrink-0 hidden md:flex">
            <div className="space-y-2 overflow-y-auto">
              <button
                onClick={handleNewChat}
                className="w-full py-2.5 px-3 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 text-slate-800 text-xs font-bold shadow-2xs flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-4 h-4 text-indigo-600" />
                <span>新建对话</span>
              </button>

              <div className="text-[10px] font-bold text-slate-400 pt-2 px-1">历史对话</div>

              <div className="space-y-1">
                {chatHistory.map(item => (
                  <button
                    key={item.id}
                    onClick={() => setActiveChatId(item.id)}
                    className={`w-full p-2.5 rounded-xl text-left text-xs font-medium truncate transition cursor-pointer flex items-center gap-2 ${
                      activeChatId === item.id
                        ? 'bg-indigo-50 text-indigo-900 font-extrabold border border-indigo-100'
                        : 'text-slate-600 hover:bg-slate-200/50 hover:text-slate-900'
                    }`}
                  >
                    <MessageSquare className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                    <span className="truncate">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80 text-[10px] text-slate-400 flex items-center justify-between">
              <span>共 {chatHistory.length} 个对话条目</span>
              <button onClick={() => setMessages([])} className="hover:text-slate-700 flex items-center gap-0.5 cursor-pointer">
                <RotateCcw className="w-3 h-3" /> 清空当前
              </button>
            </div>
          </div>

          {/* Right Playground Interactive Canvas (参考截图 2 主页面) */}
          <div className="flex-1 bg-white flex flex-col justify-between overflow-hidden relative">
            
            {/* Message Stream or Empty Welcome Center */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-8 space-y-6">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-5 my-auto max-w-md mx-auto">
                  {/* Central TP / Brand Icon Box */}
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-2xl shadow-xl border border-slate-800 tracking-tight">
                    TP
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                      有什么可以帮你的？
                    </h2>
                    <p className="text-xs text-slate-400 font-medium">
                      先选择一个模型，然后开始对话
                    </p>
                  </div>

                  {/* Model Selector Card (参考截图 2 居中模型选择按钮) */}
                  <button
                    onClick={() => setIsPickerOpen(true)}
                    className="p-3.5 px-6 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 hover:border-indigo-300 shadow-sm transition-all cursor-pointer flex items-center gap-3 group"
                  >
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      +
                    </div>
                    <div className="text-left">
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                        <span>选择模型: {currentModel.vendor}: {currentModel.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-600 transition" />
                      </div>
                      <div className="text-[10px] text-slate-400">浏览全部支持的 {models.length} 个模型</div>
                    </div>
                  </button>
                </div>
              ) : (
                <div className="max-w-3xl mx-auto space-y-6">
                  {messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      {msg.sender === 'assistant' && (
                        <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                          TP
                        </div>
                      )}

                      <div className={`max-w-[80%] rounded-2xl p-4 text-xs font-medium leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-indigo-600 text-white rounded-br-xs shadow-xs'
                          : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-bl-xs'
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.text}</div>
                        <div className={`text-[10px] mt-2 font-mono text-right ${msg.sender === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                          {msg.time}
                        </div>
                      </div>
                    </div>
                  ))}

                  {isGenerating && (
                    <div className="flex gap-3 items-center text-xs text-slate-400 font-medium">
                      <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0 animate-pulse">
                        TP
                      </div>
                      <div className="flex items-center gap-1.5 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
                        <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-spin" />
                        <span>模型正在推理生成中...</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Bottom Input Area (参考截图 2 底部控件) */}
            <div className="p-4 bg-white border-t border-slate-100 max-w-3xl w-full mx-auto">
              <div className="bg-slate-50 rounded-2xl border border-slate-200 p-3 shadow-sm focus-within:bg-white focus-within:border-indigo-500 transition-all space-y-2">
                <textarea
                  rows={2}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="输入消息开始对话..."
                  className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 outline-none resize-none font-medium"
                />

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showToast('已打开上传附件文件夹')}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition cursor-pointer flex items-center gap-1 text-[11px] font-bold"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setShowParamSettings(!showParamSettings)}
                      className={`p-1.5 px-2.5 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 ${
                        showParamSettings ? 'bg-indigo-50 text-indigo-600' : 'text-slate-500 hover:bg-slate-200/60'
                      }`}
                    >
                      <Sliders className="w-3.5 h-3.5" />
                      <span>参数</span>
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim() || isGenerating}
                    className={`p-2 rounded-xl transition cursor-pointer flex items-center justify-center ${
                      inputMessage.trim() && !isGenerating
                        ? 'bg-slate-900 hover:bg-slate-800 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    <ArrowUp className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slider Settings Overlay Panel */}
              {showParamSettings && (
                <div className="mt-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-3 animate-fade-in">
                  <div className="flex items-center justify-between text-slate-700 font-bold">
                    <span>推理超参数调优</span>
                    <button onClick={() => setShowParamSettings(false)} className="text-slate-400 hover:text-slate-600">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Temperature</span>
                        <span className="font-mono font-bold text-indigo-600">{temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={temperature}
                        onChange={(e) => setTemperature(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                        <span>Top P</span>
                        <span className="font-mono font-bold text-indigo-600">{topP}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={topP}
                        onChange={(e) => setTopP(parseFloat(e.target.value))}
                        className="w-full accent-indigo-600"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

      {/* 弹窗 2：双栏 [选择模型 Modal] (1:1 还原参考截图 3) */}
      {isPickerOpen && (
        <div 
          onClick={() => setIsPickerOpen(false)}
          className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in cursor-pointer"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-4xl w-full my-auto overflow-hidden flex flex-col h-[75vh] cursor-default"
          >
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-x divide-slate-200 overflow-hidden">
              
              {/* Left Model List Column (截图 3 左侧) */}
              <div className="p-4 space-y-3 flex flex-col overflow-hidden bg-white">
                {/* Search Bar & Filters */}
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={pickerSearch}
                      onChange={(e) => setPickerSearch(e.target.value)}
                      placeholder="搜索模型"
                      className="w-full pl-9 pr-10 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 font-medium"
                    />
                    <span className="text-[10px] text-slate-400 font-medium absolute right-3 top-2.5">
                      {filteredPickerModels.length}个
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] font-bold text-slate-600">
                    <select
                      value={pickerInputModality}
                      onChange={(e) => setPickerInputModality(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-[11px] cursor-pointer"
                    >
                      <option value="all">输入 ˅</option>
                      <option value="文本">输入: 文本</option>
                      <option value="图像">输入: 图像</option>
                    </select>

                    <select
                      value={pickerOutputModality}
                      onChange={(e) => setPickerOutputModality(e.target.value)}
                      className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-[11px] cursor-pointer"
                    >
                      <option value="all">输出 ˅</option>
                      <option value="文本">输出: 文本</option>
                      <option value="视频">输出: 视频</option>
                    </select>
                  </div>
                </div>

                {/* Vertical Model Items List */}
                <div className="flex-1 overflow-y-auto space-y-1 pr-1">
                  {filteredPickerModels.map(m => {
                    const isSelected = currentModel.id === m.id;
                    const isFav = !!favoritedModelIds[m.id];

                    return (
                      <div
                        key={m.id}
                        onClick={() => setSelectedModel(m)}
                        className={`p-3 rounded-2xl transition cursor-pointer flex items-center justify-between gap-2 border ${
                          isSelected
                            ? 'bg-indigo-50/90 border-indigo-200 text-indigo-900 font-black shadow-xs'
                            : 'bg-white border-transparent hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold text-[10px] shrink-0 ${
                            isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-900 text-white'
                          }`}>
                            {m.vendor.slice(0, 1)}
                          </div>
                          <span className="text-xs truncate font-bold">{m.vendor}: {m.name}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                          <button
                            onClick={(e) => toggleFavorite(m.id, e)}
                            className="text-slate-300 hover:text-amber-500 p-1 cursor-pointer"
                          >
                            <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-400 text-amber-400' : ''}`} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Selected Model Detail Card (截图 3 右侧) */}
              <div className="p-6 flex flex-col justify-between overflow-y-auto bg-slate-50/40">
                <div className="space-y-5">
                  {/* Top Bar */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-md">
                        {currentModel.vendor.slice(0, 1)}
                      </div>
                      <div>
                        <h3 className="text-base font-extrabold text-slate-900">
                          {currentModel.vendor}: {currentModel.name}
                        </h3>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {currentModel.modelCodeName || 'model-id'}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => setIsPickerOpen(false)}
                      className="p-1.5 rounded-xl hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-slate-600 leading-relaxed font-medium bg-white p-3.5 rounded-2xl border border-slate-200/80">
                    {currentModel.description}
                  </p>

                  {/* Attributes Table */}
                  <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden text-xs divide-y divide-slate-100">
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">上下文</span>
                      <span className="font-extrabold font-mono text-slate-900">{currentModel.contextLength}</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">协议</span>
                      <span className="font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[11px]">
                        {currentModel.protocol || 'OpenAI Completions'}
                      </span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">输入模态</span>
                      <div className="flex gap-1">
                        {(currentModel.inputModalities || ['文本']).map((mod, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">输出模态</span>
                      <div className="flex gap-1">
                        {(currentModel.outputModalities || ['文本']).map((mod, i) => (
                          <span key={i} className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-bold text-[10px]">
                            {mod}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">输入</span>
                      <span className="font-extrabold font-mono text-emerald-700">{currentModel.priceInput}</span>
                    </div>
                    <div className="p-3 flex justify-between items-center">
                      <span className="text-slate-400 font-medium">模型 ID</span>
                      <span className="font-mono text-slate-500 text-[11px]">
                        {currentModel.modelCodeName || 'model-id'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom Confirm Choice Button */}
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setIsPickerOpen(false);
                      showToast(`已切换至模型：${currentModel.name}`);
                    }}
                    className="w-full py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition shadow-md cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    <span>确认选择该模型对话</span>
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
