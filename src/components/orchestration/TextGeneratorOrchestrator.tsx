import React, { useState } from 'react';
import { AgentItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  RefreshCw, 
  BookOpen, 
  ChevronDown, 
  CheckCircle2, 
  ChevronRight, 
  FileText, 
  Play, 
  Copy, 
  Check, 
  SlidersHorizontal,
  Info,
  Code,
  Layers,
  Database
} from 'lucide-react';
import { PromptGeneratorModal } from './PromptGeneratorModal';

interface TextGeneratorOrchestratorProps {
  agent: AgentItem;
  model: string;
  onOpenModelModal: () => void;
}

export const TextGeneratorOrchestrator: React.FC<TextGeneratorOrchestratorProps> = ({
  agent,
  model,
  onOpenModelModal
}) => {
  const { showToast } = useApp();

  // Prompt state
  const [prompt, setPrompt] = useState<string>(
    agent.techDocs || `你是一个 SQL 生成器，将输入的自然语言查询要求以及目标数据库 {{A}}，转化成为 SQL 语言。{{default_input}}`
  );
  const [promptModalOpen, setPromptModalOpen] = useState(false);

  // Variables state
  const [variables, setVariables] = useState([
    { id: 'v1', key: 'A', name: '目标数据库', type: 'select', required: true, options: ['MySQL 8.0', 'PostgreSQL 16', 'ClickHouse', 'Oracle', 'SQLite'] },
    { id: 'v2', key: 'default_input', name: '查询内容', type: 'paragraph', required: true }
  ]);
  const [showAddVarModal, setShowAddVarModal] = useState(false);
  const [newVarKey, setNewVarKey] = useState('');
  const [newVarName, setNewVarName] = useState('');
  const [newVarType, setNewVarType] = useState('text');

  // Knowledge base state
  const [knowledgeBases, setKnowledgeBases] = useState<string[]>([]);
  const [metaFilter, setMetaFilter] = useState<'disabled' | 'enabled'>('disabled');

  // Right debug form values
  const [selectedDb, setSelectedDb] = useState('MySQL 8.0');
  const [queryInput, setQueryInput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [runStats, setRunStats] = useState<{ timeMs: number; tokens: number } | null>(null);

  const handleAddVariable = () => {
    if (!newVarKey.trim()) return;
    setVariables(prev => [
      ...prev,
      {
        id: `v_${Date.now()}`,
        key: newVarKey.trim(),
        name: newVarName.trim() || newVarKey.trim(),
        type: newVarType,
        required: true
      }
    ]);
    setNewVarKey('');
    setNewVarName('');
    setShowAddVarModal(false);
    showToast(`已添加变量 {{${newVarKey}}}`);
  };

  const handleClear = () => {
    setSelectedDb('MySQL 8.0');
    setQueryInput('');
    setGeneratedOutput(null);
    setRunStats(null);
    showToast('已清空输入与输出');
  };

  const handleRun = () => {
    if (!queryInput.trim()) {
      showToast('请先在右侧填写「查询内容」');
      return;
    }

    setIsRunning(true);
    setGeneratedOutput(null);
    setRunStats(null);

    setTimeout(() => {
      setIsRunning(false);
      const isPg = selectedDb.includes('PostgreSQL');
      const isClickhouse = selectedDb.includes('ClickHouse');

      let sqlCode = '';
      if (isPg) {
        sqlCode = `-- Target Database: PostgreSQL 16
-- 业务需求: ${queryInput}

SELECT 
    c.customer_id,
    c.customer_name,
    c.email,
    COUNT(o.order_id) AS total_orders,
    COALESCE(SUM(o.payment_amount), 0.00) AS total_spent_30d,
    MAX(o.created_at) AS last_order_time
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id 
    AND o.created_at >= NOW() - INTERVAL '30 days'
    AND o.order_status = 'PAID'
GROUP BY 
    c.customer_id, c.customer_name, c.email
HAVING 
    COALESCE(SUM(o.payment_amount), 0.00) > 0
ORDER BY 
    total_spent_30d DESC
LIMIT 100;

-- 索引与性能优化建议:
-- CREATE INDEX idx_orders_customer_created ON orders (customer_id, created_at, order_status);`;
      } else if (isClickhouse) {
        sqlCode = `-- Target Database: ClickHouse
-- 业务需求: ${queryInput}

SELECT 
    customer_id,
    any(customer_name) AS customer_name,
    count() AS total_orders,
    sum(payment_amount) AS total_spent_30d,
    max(created_at) AS last_order_time
FROM orders
WHERE created_at >= subtractDays(now(), 30)
  AND order_status = 'PAID'
GROUP BY customer_id
ORDER BY total_spent_30d DESC
LIMIT 100;`;
      } else {
        sqlCode = `-- Target Database: MySQL 8.0 (InnoDB)
-- 业务需求: ${queryInput}

SELECT 
    c.customer_id,
    c.customer_name,
    c.phone,
    COUNT(o.order_id) AS total_orders,
    IFNULL(SUM(o.payment_amount), 0.00) AS total_spent_30d,
    MAX(o.created_at) AS last_order_time
FROM 
    customers c
LEFT JOIN 
    orders o ON c.customer_id = o.customer_id 
    AND o.created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
    AND o.order_status = 'COMPLETED'
GROUP BY 
    c.customer_id, c.customer_name, c.phone
HAVING 
    total_spent_30d > 0
ORDER BY 
    total_spent_30d DESC
LIMIT 100;

/*
优化说明:
1. 使用了 LEFT JOIN 保证无订单客户或过滤后的聚合统计准确性。
2. 建议在 orders 表上建立复合索引: (customer_id, created_at, order_status, payment_amount)。
*/`;
      }

      setGeneratedOutput(sqlCode);
      setRunStats({
        timeMs: Math.floor(Math.random() * 200) + 180,
        tokens: Math.floor(Math.random() * 80) + 210
      });
      showToast('文本生成执行成功！');
    }, 850);
  };

  const handleCopy = () => {
    if (!generatedOutput) return;
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    showToast('已复制 SQL 到剪贴板');
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-slate-100 select-none">
      
      {/* Prompt Generator Modal */}
      <PromptGeneratorModal
        isOpen={promptModalOpen}
        onClose={() => setPromptModalOpen(false)}
        onApply={(p) => {
          setPrompt(p);
          showToast('已成功更新前缀提示词！');
        }}
        appName={agent.name}
        appType="文本生成应用"
      />

      {/* Add Variable Modal */}
      {showAddVarModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl p-5 w-full max-w-sm shadow-xl space-y-4 border border-slate-200">
            <h4 className="text-sm font-bold text-slate-800">添加输入表单变量</h4>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">变量 Key (在提示词中引用如 {'{{key}}'})</label>
                <input
                  type="text"
                  autoFocus
                  placeholder="例如：table_schema 或 target_format"
                  value={newVarKey}
                  onChange={(e) => setNewVarKey(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">表单字段名称</label>
                <input
                  type="text"
                  placeholder="例如：表结构说明"
                  value={newVarName}
                  onChange={(e) => setNewVarName(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1">表单组件类型</label>
                <select
                  value={newVarType}
                  onChange={(e) => setNewVarType(e.target.value)}
                  className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-blue-500 outline-none"
                >
                  <option value="text">单行文本 (text)</option>
                  <option value="paragraph">多行段落 (paragraph)</option>
                  <option value="select">下拉选择 (select)</option>
                  <option value="number">数值 (number)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-2">
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

      {/* Left Column: Configuration Cards (50% width) */}
      <div className="w-[50%] h-full overflow-y-auto p-5 space-y-4 border-r border-slate-200/90 bg-slate-50/50">
        
        {/* 1. Prefix Prompt Card */}
        <div className="bg-white border-2 border-blue-600/90 rounded-2xl shadow-xs overflow-hidden transition">
          <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-blue-50/20">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-800">前缀提示词</span>
              <Info className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <button
              onClick={() => setPromptModalOpen(true)}
              className="px-3 py-1 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border border-blue-200"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>生成</span>
            </button>
          </div>

          <div className="p-3 relative">
            <textarea
              rows={9}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full text-xs font-mono text-slate-800 leading-relaxed bg-transparent outline-none resize-none"
              placeholder="输入文本生成前缀提示词..."
            />
            <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] text-slate-400">
              <span className="font-mono">{prompt.length} 字符</span>
              <div className="w-8 h-1 bg-slate-200 rounded-full mx-auto cursor-ns-resize" />
            </div>
          </div>
        </div>

        {/* 2. Variables Card (Matches 文本生成器应用-编排.png) */}
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

          <div className="space-y-2">
            {variables.map((v) => (
              <div 
                key={v.id}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-2">
                  <span className="text-blue-600 font-mono font-bold">{"{x}"}</span>
                  <span className="font-bold text-slate-800">{v.key}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-600">{v.name}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md font-bold bg-slate-200 text-slate-600 uppercase">
                    REQUIRED
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono bg-white px-2 py-0.5 rounded-md border border-slate-200">
                    {v.type}
                  </span>
                  <button 
                    onClick={() => setVariables(prev => prev.filter(item => item.id !== v.id))}
                    className="text-slate-300 hover:text-red-500 transition cursor-pointer ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Knowledge Base Card */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-800">知识库</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => showToast('召回设置：向量召回与重排序')}
                className="text-xs text-slate-500 hover:text-slate-800 font-medium flex items-center gap-1 cursor-pointer"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>召回设置</span>
              </button>
              <button
                onClick={() => {
                  setKnowledgeBases(['企业数据字典与库表结构.ddl (4.5MB)']);
                  showToast('已挂载数据库字典知识库！');
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-bold flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加</span>
              </button>
            </div>
          </div>

          {knowledgeBases.length > 0 ? (
            <div className="space-y-1.5">
              {knowledgeBases.map((kb, idx) => (
                <div key={idx} className="p-2.5 bg-blue-50/50 border border-blue-200 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 font-medium text-slate-800">
                    <Database className="w-3.5 h-3.5 text-blue-600" />
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

      </div>

      {/* Right Column: Debug & Preview (Form-based Completion - Matches 文本生成器应用-编排.png) */}
      <div className="w-[50%] h-full flex flex-col bg-white border-l border-slate-200/80 shadow-2xs overflow-hidden">
        
        {/* Top Header */}
        <div className="h-12 px-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <span className="text-xs font-bold text-slate-800">调试与预览</span>
          <span className="text-[11px] text-slate-400">文本生成单次执行模式</span>
        </div>

        {/* Scrollable Main Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          
          {/* User Input Section (Card matching 文本生成器应用-编排.png) */}
          <div className="bg-slate-50/70 border border-slate-200/90 rounded-2xl p-4 space-y-3.5">
            <div>
              <div className="flex items-center gap-1 text-xs font-bold text-slate-800">
                <span>用户输入</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                填入变量的值，该值将在每次提交问题时自动替换到提示词中
              </p>
            </div>

            {/* Field 1: 目标数据库 Select */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                目标数据库 <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedDb}
                onChange={(e) => setSelectedDb(e.target.value)}
                className="w-full text-xs p-2.5 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none text-slate-800 font-medium"
              >
                <option value="MySQL 8.0">MySQL 8.0</option>
                <option value="PostgreSQL 16">PostgreSQL 16</option>
                <option value="ClickHouse">ClickHouse (OLAP)</option>
                <option value="Oracle 19c">Oracle 19c</option>
                <option value="SQLite">SQLite 3</option>
              </select>
            </div>

            {/* Field 2: 查询内容 Paragraph */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-700 block">
                查询内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={4}
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="例如：统计近30天每个客户的支付总额与最后下单时间，按消费金额倒序排列并只要前100条..."
                className="w-full text-xs p-3 bg-white border border-slate-200 rounded-xl focus:border-blue-500 outline-none resize-none transition"
              />
            </div>

            {/* Actions: Clear & Run */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-200/70 rounded-xl transition cursor-pointer"
              >
                清空
              </button>

              <button
                type="button"
                onClick={handleRun}
                disabled={isRunning}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>正在执行生成...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>运行</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Banner link */}
          <div className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 cursor-pointer font-medium px-1">
            <span>✨ 开启功能增强 web app 用户体验</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Output Display Area */}
          {generatedOutput ? (
            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-xs animate-in fade-in duration-200">
              <div className="px-4 py-2.5 bg-slate-900 text-white flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-blue-400" />
                  <span className="font-bold">生成 SQL 结果</span>
                  {runStats && (
                    <span className="text-[11px] text-slate-400 font-mono">
                      (耗时 {runStats.timeMs}ms · 消耗 {runStats.tokens} Tokens)
                    </span>
                  )}
                </div>

                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs flex items-center gap-1 transition cursor-pointer font-medium"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? '已复制' : '复制结果'}</span>
                </button>
              </div>

              <div className="p-4 bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto leading-relaxed whitespace-pre-wrap select-text">
                {generatedOutput}
              </div>
            </div>
          ) : (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-3 text-slate-300">
              <Sparkles className="w-10 h-10 stroke-[1.5]" />
              <span className="text-xs font-medium text-slate-400">输出结果展示在这</span>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
