import React, { useState } from 'react';
import { ModelItem } from '../../types';
import { 
  X, 
  Copy, 
  Check, 
  MessageSquare, 
  Zap, 
  Activity, 
  Terminal, 
  Server, 
  BarChart2, 
  CheckCircle2, 
  Layers,
  Sparkles,
  ExternalLink,
  Play
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ModelDetailModalProps {
  model: ModelItem | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenTryout: (model: ModelItem) => void;
}

export const ModelDetailModal: React.FC<ModelDetailModalProps> = ({
  model,
  isOpen,
  onClose,
  onOpenTryout
}) => {
  const { showToast } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'providers' | 'performance' | 'quickstart'>('overview');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [copiedModelCode, setCopiedModelCode] = useState(false);
  const [codeLang, setCodeLang] = useState<'curl' | 'python' | 'node'>('curl');

  if (!isOpen || !model) return null;

  const modelCode = model.modelCodeName || `${model.vendor.toLowerCase()}-${model.name.toLowerCase().replace(/\s+/g, '-')}`;

  const handleCopyModelCode = () => {
    navigator.clipboard.writeText(modelCode);
    setCopiedModelCode(true);
    showToast('已复制模型 ID：' + modelCode);
    setTimeout(() => setCopiedModelCode(false), 2000);
  };

  const getCodeSnippet = () => {
    if (codeLang === 'curl') {
      return `curl https://tokendance.space/gateway/v1/chat/completions \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${modelCode}",
    "messages": [{"role": "user", "content": "Hello!"}],
    "stream": true
  }'`;
    } else if (codeLang === 'python') {
      return `from openai import OpenAI

client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://tokendance.space/gateway/v1"
)

response = client.chat.completions.create(
    model="${modelCode}",
    messages=[{"role": "user", "content": "Hello!"}],
    stream=True
)

for chunk in response:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="")`;
    } else {
      return `import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.YOUR_API_KEY,
  baseURL: 'https://tokendance.space/gateway/v1',
});

async function main() {
  const stream = await openai.chat.completions.create({
    model: '${modelCode}',
    messages: [{ role: 'user', content: 'Hello!' }],
    stream: true,
  });

  for await (const chunk of stream) {
    process.stdout.write(chunk.choices[0]?.delta?.content || '');
  }
}

main();`;
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(getCodeSnippet());
    setCopiedCode(true);
    showToast('已复制代码片段！');
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyMarkdown = () => {
    const contextStr = model.contextLength ? `\n- **Context**: ${model.contextLength}` : '';
    const md = `### ${model.vendor}: ${model.name}\n- **Model ID**: \`${modelCode}\`${contextStr}\n- **Input Price**: ${model.priceInput}\n- **Output Price**: ${model.priceOutput}`;
    navigator.clipboard.writeText(md);
    setCopiedMarkdown(true);
    showToast('已复制 Markdown 说明！');
    setTimeout(() => setCopiedMarkdown(false), 2000);
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
        
        {/* Modal Top Header */}
        <div className="p-6 border-b border-slate-200/80 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm shadow-xs">
                {model.vendor.slice(0, 1)}
              </div>
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                {model.vendor}: {model.name}
              </h2>
              <button
                onClick={() => {
                  onClose();
                  onOpenTryout(model);
                }}
                className="px-4 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm flex items-center gap-1.5 transition cursor-pointer"
              >
                <Play className="w-3.5 h-3.5 fill-white" />
                <span>体验</span>
              </button>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
              <span>提供商: {model.author || model.vendor}</span>
              <span>·</span>
              <span className="font-mono bg-white px-2.5 py-0.5 rounded-lg text-slate-700 border border-slate-200/80 flex items-center gap-1.5 font-bold shadow-2xs">
                <span>{modelCode}</span>
                <button onClick={handleCopyModelCode} title="复制模型ID" className="hover:text-indigo-600 transition cursor-pointer">
                  {copiedModelCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </span>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              {model.contextLength && (
                <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 font-mono">
                  上下文 {model.contextLength}
                </span>
              )}
              <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                {model.inputModalities?.join('、') || '文本'} → {model.outputModalities?.join('、') || '文本'}
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

        {/* Modal Nav Anchor Tabs */}
        <div className="px-6 border-b border-slate-200/80 flex items-center gap-8 text-xs font-bold bg-white">
          {[
            { id: 'overview', label: '全览', icon: Layers },
            { id: 'providers', label: '服务商', icon: Server },
            { id: 'performance', label: '性能', icon: Activity },
            { id: 'quickstart', label: '快速开始', icon: Terminal },
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
        <div className="p-6 overflow-y-auto space-y-8 text-xs">
          
          {/* Section 1: 模型服务商信息 */}
          {(activeTab === 'overview' || activeTab === 'providers') && (
            <div className="space-y-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                  <Server className="w-4 h-4 text-indigo-600" />
                  <span>{model.vendor}: {model.name} 的基础设施路线</span>
                </h3>
                <p className="text-slate-500 text-[11px]">
                  请求会自动路由到最佳服务商节点，并在故障时无缝自动切换备用集群以保障高可用。
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                {/* Provider Card Header */}
                <div className="p-4 bg-slate-50/80 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="font-extrabold text-slate-900 text-sm">{model.vendor}</span>
                    <div className="flex items-center gap-1.5 text-[10px]">
                      <span className="px-2.5 py-0.5 rounded-md bg-slate-200/70 text-slate-800 font-bold font-mono">
                        {model.protocol || 'OpenAI Completions'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 font-mono">
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">平均延迟</div>
                      <div className="font-extrabold text-slate-800">{model.latencyMs || 708}ms</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">吞吐量</div>
                      <div className="font-extrabold text-slate-800">{model.throughputTps || 76}tps</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] text-slate-400">可用性</div>
                      <div className="font-extrabold text-emerald-600 flex items-center justify-end gap-1">
                        <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                        {model.availabilityPercent || 99.9}%
                      </div>
                    </div>
                  </div>
                </div>

                {/* Price Metrics Grid */}
                <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white text-slate-700 font-medium">
                  {model.contextLength && (
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                      <div className="text-[10px] text-slate-400 mb-0.5">上下文长度</div>
                      <div className="font-extrabold font-mono text-slate-900 text-xs">{model.contextLength}</div>
                    </div>
                  )}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 mb-0.5">输入计费</div>
                    <div className="font-extrabold font-mono text-emerald-600 text-xs">{model.priceInput}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 mb-0.5">输出计费</div>
                    <div className="font-extrabold font-mono text-emerald-600 text-xs">{model.priceOutput}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="text-[10px] text-slate-400 mb-0.5">缓存命中</div>
                    <div className="font-extrabold font-mono text-indigo-600 text-xs">{model.cachedPrice || '¥0.025 /M tokens'}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 2: 性能多维监控图表 */}
          {(activeTab === 'overview' || activeTab === 'performance') && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 mb-1 flex items-center gap-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>{model.vendor}: {model.name} 的实时性能监控矩阵</span>
                </h3>
                <p className="text-slate-500 text-[11px]">过去 7 天内聚合多节点的可用性、首包延迟与缓存命中率表现。</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* 1. 可用性 */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-700 font-extrabold">
                    <span>服务可用性</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  </div>
                  <div className="h-16 flex items-end justify-between gap-1 pt-2">
                    {[100, 100, 100, 100, 99.8, 100, 100].map((v, i) => (
                      <div key={i} className="flex-1 bg-slate-100 rounded-t h-full flex items-end">
                        <div 
                          className="w-full bg-emerald-500 rounded-t transition-all"
                          style={{ height: `${v}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
                    <span>全天平均</span>
                    <span className="font-extrabold text-slate-800">100.0%</span>
                  </div>
                </div>

                {/* 2. 首事件延迟 */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-700 font-extrabold">
                    <span>首包延迟 (TTFT)</span>
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  </div>
                  <div className="h-16 flex items-end justify-between gap-1 pt-2">
                    {[40, 45, 42, 50, 48, 55, 60].map((v, i) => (
                      <div key={i} className="flex-1 bg-slate-100 rounded-t h-full flex items-end">
                        <div 
                          className="w-full bg-indigo-600 rounded-t transition-all"
                          style={{ height: `${v}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
                    <span>全天平均</span>
                    <span className="font-extrabold text-slate-800">708 ms</span>
                  </div>
                </div>

                {/* 3. 端到端延迟 */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-700 font-extrabold">
                    <span>端到端延迟</span>
                    <span className="w-2 h-2 bg-indigo-500 rounded-full"></span>
                  </div>
                  <div className="h-16 flex items-end justify-between gap-1 pt-2">
                    {[70, 68, 75, 72, 80, 85, 78].map((v, i) => (
                      <div key={i} className="flex-1 bg-slate-100 rounded-t h-full flex items-end">
                        <div 
                          className="w-full bg-indigo-500 rounded-t transition-all"
                          style={{ height: `${v}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
                    <span>全天平均</span>
                    <span className="font-extrabold text-slate-800">1.82 s</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* 4. 吞吐量 */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-700 font-extrabold">
                    <span>生成吞吐量</span>
                    <span className="w-2 h-2 bg-indigo-600 rounded-full"></span>
                  </div>
                  <div className="h-16 flex items-end justify-between gap-1 pt-2">
                    {[30, 45, 60, 50, 70, 85, 90].map((v, i) => (
                      <div key={i} className="flex-1 bg-slate-100 rounded-t h-full flex items-end">
                        <div 
                          className="w-full bg-indigo-600 rounded-t transition-all"
                          style={{ height: `${v}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
                    <span>平均速度</span>
                    <span className="font-extrabold text-slate-800">76 tok/s</span>
                  </div>
                </div>

                {/* 5. 缓存命中率 */}
                <div className="p-4 rounded-2xl border border-slate-200/80 bg-white space-y-3 shadow-2xs">
                  <div className="flex items-center justify-between text-slate-700 font-extrabold">
                    <span>Prompt 缓存命中率</span>
                    <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
                  </div>
                  <div className="h-16 flex items-end justify-between gap-1 pt-2">
                    {[60, 70, 75, 80, 85, 82, 88].map((v, i) => (
                      <div key={i} className="flex-1 bg-slate-100 rounded-t h-full flex items-end">
                        <div 
                          className="w-full bg-emerald-500 rounded-t transition-all"
                          style={{ height: `${v}%` }}
                        ></div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 border-t border-slate-100 pt-2 font-mono">
                    <span>平均命中率</span>
                    <span className="font-extrabold text-slate-800">80.6%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section 3: 快速开始 */}
          {(activeTab === 'overview' || activeTab === 'quickstart') && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-indigo-600" />
                    <span>{model.vendor}: {model.name} 代码调用快捷集成</span>
                  </h3>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    替换 <code className="bg-slate-100 text-indigo-600 px-1 py-0.5 rounded font-mono font-bold">YOUR_API_KEY</code> 密钥即可通过标准 API 访问该模型。
                  </p>
                </div>

                <button
                  onClick={handleCopyMarkdown}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
                >
                  {copiedMarkdown ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>复制为 Markdown</span>
                </button>
              </div>

              {/* Language Tabs */}
              <div className="rounded-2xl border border-slate-900 bg-slate-950 overflow-hidden shadow-xl">
                <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold">
                    {[
                      { id: 'curl', label: 'cURL' },
                      { id: 'python', label: 'Python' },
                      { id: 'node', label: 'Node.js' },
                    ].map(lang => (
                      <button
                        key={lang.id}
                        onClick={() => setCodeLang(lang.id as any)}
                        className={`px-3 py-1 rounded-lg transition cursor-pointer font-extrabold ${
                          codeLang === lang.id
                            ? 'bg-indigo-600 text-white'
                            : 'text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={handleCopyCode}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-white transition cursor-pointer flex items-center gap-1 text-[11px]"
                    title="复制代码"
                  >
                    {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode ? '已复制' : '复制代码'}</span>
                  </button>
                </div>

                {/* Code Block Area */}
                <pre className="p-4 text-emerald-400 font-mono text-[11px] overflow-x-auto leading-relaxed select-text">
                  <code>{getCodeSnippet()}</code>
                </pre>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Footer Actions */}
        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium font-mono">
            标准计费: 输入 {model.priceInput} · 输出 {model.priceOutput}
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-700 font-bold text-xs transition cursor-pointer"
            >
              关闭
            </button>
            {model.typeTag === '文本' && (
              <button
                onClick={() => {
                  onClose();
                  onOpenTryout(model);
                }}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-1.5 transition cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>立即体验此模型</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
