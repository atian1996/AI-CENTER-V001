import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AgentCategory, AppSceneType, IndustryDomainType } from '../../types';
import { X, Bot, Sparkles, Plus, Wrench, Shield, Check } from 'lucide-react';

export const CreateAgentModal: React.FC = () => {
  const { createAgentModalOpen, setCreateAgentModalOpen, addAgent, showToast } = useApp();

  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🤖');
  const [scene, setScene] = useState<AppSceneType>('内容创作');
  const [industry, setIndustry] = useState<IndustryDomainType>('通用');
  const [category, setCategory] = useState<AgentCategory>('dialogue');
  const [priceType, setPriceType] = useState<'free' | 'points' | 'cash'>('free');
  const [priceValue, setPriceValue] = useState(0);
  const [baseModel, setBaseModel] = useState('DeepSeek-V3 671B');
  const [prompt, setPrompt] = useState('');
  const [techDocs, setTechDocs] = useState('');
  const [tags, setTags] = useState('自定义, 极客小助手');

  if (!createAgentModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      showToast('请输入 Agent 名称');
      return;
    }
    addAgent({
      name,
      avatar: avatar || '🤖',
      description: prompt.slice(0, 80) || '高效精准的智能助手，支持多维推理与工具调用。',
      category,
      scene,
      industry,
      priceType,
      priceValue: Number(priceValue) || 0,
      tags: tags.split(',').map(t => t.trim()),
      author: '极客小千 (你)',
      authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      baseModel,
      version: '1.0.0',
      techDocs: techDocs || '基于最新的 Prompt Engineering 与 Function Calling 规范搭建。'
    });
    setCreateAgentModalOpen(false);
    setName('');
    setPrompt('');
  };

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2.5 font-bold text-slate-900 text-base">
            <Bot className="w-5 h-5 text-indigo-600" />
            创建并发布新的 Agent 智能体
          </div>
          <button onClick={() => setCreateAgentModalOpen(false)} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 bg-slate-100">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs font-medium text-slate-700">
          <div className="grid grid-cols-4 gap-3">
            <div className="col-span-1">
              <label className="text-slate-800 font-bold mb-1 block">图标 (Emoji)</label>
              <input
                type="text"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-center text-xl outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
            <div className="col-span-3">
              <label className="text-slate-800 font-bold mb-1 block">Agent 名称 *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例如：极客 Python 智能重构与 Debug 专家"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
              />
            </div>
          </div>

          {/* 应用场景与行业领域下拉选择 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-800 font-bold mb-1 block">应用场景 *</label>
              <select
                value={scene}
                onChange={(e) => setScene(e.target.value as AppSceneType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
              >
                {['内容创作', '数据分析', '智能客服', '办公助理', '编程开发', '营销推广', '教育培训', '行业垂直'].map((sc) => (
                  <option key={sc} value={sc}>{sc}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-slate-800 font-bold mb-1 block">行业领域 *</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value as IndustryDomainType)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
              >
                {['通用', '政务', '制造', '零售', '金融', '医疗', '教育', '文旅', '物流'].map((ind) => (
                  <option key={ind} value={ind}>{ind}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-800 font-bold mb-1 block">应用分类</label>
              <select
                value={category}
                onChange={(e: any) => setCategory(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white"
              >
                <option value="dialogue">通用对话</option>
                <option value="coding">代码编程</option>
                <option value="data">数据分析</option>
                <option value="image">图像设计</option>
                <option value="vertical">行业深度应用</option>
              </select>
            </div>
            <div>
              <label className="text-slate-800 font-bold mb-1 block">底座模型选择</label>
              <select
                value={baseModel}
                onChange={(e) => setBaseModel(e.target.value)}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white"
              >
                <option value="DeepSeek-V3 671B">DeepSeek-V3 (671B 商业推荐)</option>
                <option value="Qwen-2.5-72B-Instruct">通义千问 Qwen-2.5-72B</option>
                <option value="Llama-3.3-70B-Instruct">Llama-3.3-70B</option>
                <option value="Claude-3.5-Sonnet">Claude-3.5-Sonnet</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-800 font-bold mb-1 block">System Prompt (系统级提示词编排) *</label>
            <textarea
              rows={4}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="设定 Agent 的角色定位、输入格式、思考推理链与约束条件..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-500 font-mono"
            />
          </div>

          <div>
            <label className="text-slate-800 font-bold mb-1 block">技术文档与调用说明</label>
            <textarea
              rows={2}
              value={techDocs}
              onChange={(e) => setTechDocs(e.target.value)}
              placeholder="面向消费者的 API 使用说明与提示词调优技巧..."
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setCreateAgentModalOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold"
            >
              取消
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-xs cursor-pointer"
            >
              一键创建并上架 AI 集市
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
