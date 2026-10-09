import React, { useState, useMemo, useRef, useEffect } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../../context/AppContext';
import { AgentItem, AgentCallRecord } from '../../../types';
import {
  Bot,
  Activity,
  Layers,
  Search,
  Plus,
  Trash2,
  Edit2,
  Power,
  CheckCircle,
  XCircle,
  Eye,
  ArrowLeft,
  DollarSign,
  Upload,
  ChevronRight,
  TrendingUp,
  SlidersHorizontal,
  PlusCircle,
  ArrowUpDown,
  FileText,
  Bold,
  Italic,
  Heading,
  List,
  ListOrdered,
  Code,
  Quote,
  Link as LinkIcon,
  Check,
  X,
  ChevronDown,
  Sparkles,
  Image as ImageIcon,
  History,
  Copy,
  Clock,
  Zap,
  CheckCircle2,
  AlertTriangle,
  Calendar,
  Users,
  Coins,
  RefreshCw
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// ============================================================================
// MOCK DATA SEEDING
// ============================================================================

// Initial Categories Mock State
const initialTechForms = ['Chatbot', 'Agent', '对话流', '工作流', '文本生成'];
const initialAppScenarios = ['内容创作', '数据分析', '智能客服', '办公助理', '编程开发', '营销推广', '教育培训', '行业垂直'];
const initialIndustries = ['通用', '政务', '制造', '零售', '金融', '医疗', '教育', '文旅', '物流', '企业'];

// Mock Token Consumption Trend for Recharts (Last 30 Days)
const mockUsageTrend = [
  { date: '07-21', tokens: 120, calls: 3500, revenue: 1540 },
  { date: '07-24', tokens: 145, calls: 4100, revenue: 1820 },
  { date: '07-27', tokens: 190, calls: 5200, revenue: 2300 },
  { date: '07-30', tokens: 165, calls: 4800, revenue: 2100 },
  { date: '08-02', tokens: 210, calls: 5900, revenue: 2800 },
  { date: '08-05', tokens: 250, calls: 6800, revenue: 3200 },
  { date: '08-08', tokens: 280, calls: 7300, revenue: 3450 },
  { date: '08-11', tokens: 320, calls: 8100, revenue: 4100 },
  { date: '08-14', tokens: 360, calls: 9200, revenue: 4700 },
  { date: '08-17', tokens: 410, calls: 10400, revenue: 5400 },
  { date: '08-19', tokens: 450, calls: 11800, revenue: 6100 }
];

const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6'];

// ============================================================================
// MAIN WRAPPER CONTAINER FOR SUBVIEWS
// ============================================================================
export const AgentAdminViews: React.FC<{ activeSubMenu: string }> = ({ activeSubMenu }) => {
  // Shared options states for categories (loaded with initial option values)
  const [techForms, setTechForms] = useState<string[]>(initialTechForms);
  const [appScenarios, setAppScenarios] = useState<string[]>(initialAppScenarios);
  const [industries, setIndustries] = useState<string[]>(initialIndustries);

  switch (activeSubMenu) {
    case 'agent_list':
      return <AgentListAdminView techForms={techForms} appScenarios={appScenarios} industries={industries} />;
    case 'agent_calls':
      return <AgentCallsAdminView />;
    case 'agent_stats':
      return <AgentStatsAdminView techForms={techForms} appScenarios={appScenarios} />;
    default:
      return <AgentListAdminView techForms={techForms} appScenarios={appScenarios} industries={industries} />;
  }
};

// ============================================================================
// SUBVIEW 1: AGENT LIST & CREATION FORM
// ============================================================================
// HELPER REUSABLE COMPONENTS FOR AGENT ADMIN FORM
// ============================================================================

/** 头像上传与预览组件 */
const ImageUploadField: React.FC<{
  value?: string;
  onChange: (url: string) => void;
  label: string;
}> = ({ value, onChange, label }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        alert('图片大小不能超过 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 3 * 1024 * 1024) {
        alert('图片大小不能超过 3MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onChange(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const sampleAvatars = [
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1614680376593-902f749f7ffc?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1633409381648-e866e4a2c5ea?w=120&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1677442136019-21780efad99a?w=120&auto=format&fit=crop&q=80'
  ];

  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-300 block">{label}</label>
      <div className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        {/* Preview Avatar */}
        <div className="relative group shrink-0">
          <img
            src={value || sampleAvatars[0]}
            alt="Avatar"
            className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500/40 bg-slate-800 shadow-md"
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full text-[10px] shadow-sm cursor-pointer"
              title="清除头像"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Upload Action Area */}
        <div className="flex-1 space-y-2.5 w-full">
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition flex items-center justify-center gap-2 ${
              isDragging
                ? 'border-indigo-500 bg-indigo-500/10 text-indigo-300'
                : 'border-slate-800 hover:border-slate-700 bg-slate-900/50 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Upload className="w-4 h-4 text-indigo-400 shrink-0" />
            <span className="text-xs font-semibold">点击上传本地图片，或直接将图片拖拽至此处</span>
            <span className="text-[10px] text-slate-500">(PNG / JPG / SVG / WebP, ≤3MB)</span>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png,image/jpeg,image/webp,image/svg+xml"
              className="hidden"
            />
          </div>

          {/* Direct URL input & Quick Presets */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="或直接输入图片URL网络地址..."
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              className="flex-1 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none"
            />
            <span className="text-[10px] text-slate-500 whitespace-nowrap">预设:</span>
            <div className="flex gap-1">
              {sampleAvatars.slice(0, 4).map((url, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => onChange(url)}
                  className="w-6 h-6 rounded-md overflow-hidden border border-slate-700 hover:border-indigo-500 cursor-pointer shrink-0 transition"
                  title="使用预设头像"
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/** 多选下拉组件（限制最多选择3项） */
const MultiSelectDropdown: React.FC<{
  label: string;
  required?: boolean;
  options: string[];
  selectedValues: string[];
  onChange: (vals: string[]) => void;
  max?: number;
  placeholder?: string;
  badgeTheme?: 'indigo' | 'teal' | 'cyan';
}> = ({
  label,
  required = false,
  options,
  selectedValues,
  onChange,
  max = 3,
  placeholder = '请下拉选择...',
  badgeTheme = 'indigo'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (opt: string) => {
    if (selectedValues.includes(opt)) {
      onChange(selectedValues.filter(v => v !== opt));
    } else {
      if (selectedValues.length >= max) {
        return; // Max reached
      }
      onChange([...selectedValues, opt]);
    }
  };

  const badgeColorClass =
    badgeTheme === 'indigo'
      ? 'bg-indigo-950/90 text-indigo-300 border-indigo-700/60'
      : badgeTheme === 'teal'
      ? 'bg-teal-950/90 text-teal-300 border-teal-700/60'
      : 'bg-cyan-950/90 text-cyan-300 border-cyan-700/60';

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 block">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <span className="text-[11px] font-mono text-slate-400">
          已选 <span className={selectedValues.length >= max ? 'text-amber-400 font-bold' : 'text-indigo-400 font-bold'}>{selectedValues.length}</span> / {max} 项 (最多选{max}个)
        </span>
      </div>

      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[42px] px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition focus-within:border-indigo-500"
      >
        <div className="flex flex-wrap gap-1.5 items-center flex-1">
          {selectedValues.length === 0 ? (
            <span className="text-xs text-slate-600 select-none">{placeholder}</span>
          ) : (
            selectedValues.map(val => (
              <span
                key={val}
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold border ${badgeColorClass}`}
              >
                <span>{val}</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    onChange(selectedValues.filter(v => v !== val));
                  }}
                  className="hover:text-white transition cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform shrink-0 ml-2 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 z-30 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-2 max-h-56 overflow-y-auto space-y-1">
          <div className="px-2 py-1 text-[10px] text-slate-500 font-bold border-b border-slate-800/80 mb-1 flex items-center justify-between">
            <span>可选标签列表 (最多选 {max} 项)</span>
            {selectedValues.length > 0 && (
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); onChange([]); }}
                className="text-indigo-400 hover:underline cursor-pointer"
              >
                清空已选
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-1">
            {options.map(opt => {
              const isSelected = selectedValues.includes(opt);
              const isMaxed = selectedValues.length >= max && !isSelected;
              return (
                <button
                  type="button"
                  key={opt}
                  disabled={isMaxed}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleOption(opt);
                  }}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition text-left cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
                      : isMaxed
                      ? 'bg-slate-950/40 text-slate-600 border border-transparent cursor-not-allowed opacity-60'
                      : 'hover:bg-slate-800 text-slate-300 border border-transparent'
                  }`}
                >
                  <span className="truncate">{opt}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/** 关联基座模型多选下拉组件 */
const ModelMultiSelectDropdown: React.FC<{
  label: string;
  required?: boolean;
  models: any[];
  selectedModelIds: string[];
  onChange: (ids: string[]) => void;
  placeholder?: string;
}> = ({
  label,
  required = false,
  models,
  selectedModelIds,
  onChange,
  placeholder = '请下拉选择关联平台基座模型（支持多选）...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleModel = (id: string) => {
    if (selectedModelIds.includes(id)) {
      if (selectedModelIds.length <= 1) {
        return; // 至少保留一个模型
      }
      onChange(selectedModelIds.filter(v => v !== id));
    } else {
      onChange([...selectedModelIds, id]);
    }
  };

  const selectedModelObjs = models.filter(m => selectedModelIds.includes(m.id));

  return (
    <div className="space-y-1.5 relative" ref={containerRef}>
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 block">
          {label} {required && <span className="text-red-500">*</span>}
          <span className="text-[10px] text-slate-500 font-normal ml-2">(支持多选关联多个基座模型，前台用户可自由切换模型)</span>
        </label>
        <span className="text-[11px] font-mono text-slate-400">
          已关联 <span className="text-indigo-400 font-bold">{selectedModelIds.length}</span> 个基座模型
        </span>
      </div>

      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-[44px] px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between cursor-pointer hover:border-slate-700 transition focus-within:border-indigo-500"
      >
        <div className="flex flex-wrap gap-1.5 items-center flex-1">
          {selectedModelObjs.length === 0 ? (
            <span className="text-xs text-slate-600 select-none">{placeholder}</span>
          ) : (
            selectedModelObjs.map(m => (
              <span
                key={m.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border bg-indigo-950/90 text-indigo-300 border-indigo-700/60 shadow-xs"
              >
                <span>{m.name}</span>
                <span className="text-[10px] text-indigo-400 font-mono">({m.vendor || '官方'} · ¥{(m.pricePerTenThousandTokens || 0.04).toFixed(2)}/万Token)</span>
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleModel(m.id);
                  }}
                  className="hover:text-red-400 transition ml-1 p-0.5 cursor-pointer"
                  title="移除此模型"
                >
                  <X className="w-3 h-3" />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ml-2 shrink-0 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} />
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[10px] text-slate-500 font-bold border-b border-slate-800/80 mb-1 flex items-center justify-between">
            <span>平台已有基座模型列表（点击勾选/取消勾选，至少保留1个）</span>
            <span className="text-indigo-400 font-mono">不同模型 Token 计费费率不同</span>
          </div>
          {models.map(m => {
            const isSelected = selectedModelIds.includes(m.id);
            return (
              <div
                key={m.id}
                onClick={() => toggleModel(m.id)}
                className={`px-3 py-2 rounded-lg text-xs flex items-center justify-between cursor-pointer transition ${
                  isSelected
                    ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-4 h-4 rounded border flex items-center justify-center text-[10px] shrink-0 ${
                    isSelected ? 'bg-indigo-600 border-indigo-500 text-white' : 'border-slate-700 bg-slate-950'
                  }`}>
                    {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  </div>
                  <div>
                    <span className="font-bold text-white mr-2">{m.name}</span>
                    <span className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
                      {m.vendor || '官方'} · {m.typeTag || '通用LLM'}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-mono text-amber-400 font-bold">
                    ¥{(m.pricePerTenThousandTokens || 0.04).toFixed(2)} / 万Token
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

/** Markdown 编辑器组件 (支持工具栏与实时渲染预览) */
const MarkdownEditorField: React.FC<{
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  helperText?: string;
}> = ({
  label,
  value,
  onChange,
  placeholder = '',
  required = false,
  rows = 5,
  helperText
}) => {
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const insertSnippet = (before: string, after: string = '', defaultText: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const replacement = `${before}${selected}${after}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selected.length);
    }, 0);
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
          <span>{label}</span>
          {required && <span className="text-red-500">*</span>}
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
            Markdown
          </span>
        </label>
        {/* Tab switch */}
        <div className="flex items-center bg-slate-950 p-0.5 rounded-lg border border-slate-800 text-[11px] font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('edit')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer ${
              activeTab === 'edit'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            编辑模式
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'preview'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3 h-3" />
            <span>实时渲染预览</span>
          </button>
        </div>
      </div>

      {activeTab === 'edit' ? (
        <div className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden focus-within:border-indigo-500 transition">
          {/* Quick Markdown Toolbar */}
          <div className="flex flex-wrap items-center gap-1 px-2.5 py-1.5 bg-slate-900/80 border-b border-slate-800 text-slate-400 text-xs">
            <button
              type="button"
              onClick={() => insertSnippet('**', '**', '粗体文字')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer font-bold"
              title="加粗"
            >
              <Bold className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('*', '*', '斜体文字')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer italic"
              title="斜体"
            >
              <Italic className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('### ', '', '三级标题')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer font-black text-[11px]"
              title="插入标题"
            >
              <Heading className="w-3.5 h-3.5" />
            </button>
            <div className="w-[1px] h-3.5 bg-slate-800 mx-1" />
            <button
              type="button"
              onClick={() => insertSnippet('- ', '', '列表项')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="无序列表"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('1. ', '', '步骤描述')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="有序列表"
            >
              <ListOrdered className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('```typescript\n', '\n```', '// 示例代码')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="代码块"
            >
              <Code className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('> ', '', '引用说明')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="引用"
            >
              <Quote className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => insertSnippet('[', '](https://example.com)', '链接名称')}
              className="p-1.5 rounded hover:bg-slate-800 hover:text-white transition cursor-pointer"
              title="超链接"
            >
              <LinkIcon className="w-3.5 h-3.5" />
            </button>
            <div className="flex-1" />
            <span className="text-[10px] text-slate-500 font-mono">
              {value.length} 字符
            </span>
          </div>

          <textarea
            ref={textareaRef}
            required={required}
            rows={rows}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3.5 py-3 bg-transparent text-xs text-white placeholder:text-slate-600 outline-none font-mono leading-relaxed resize-y"
          />
        </div>
      ) : (
        <div className="rounded-xl bg-slate-950 border border-slate-800 p-4 min-h-[140px] max-h-[360px] overflow-y-auto">
          {value.trim() ? (
            <div className="text-xs text-slate-200 leading-relaxed space-y-2">
              <Markdown>{value}</Markdown>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-500 italic">
              当前暂无内容，请切换到编辑模式输入 Markdown 文本
            </div>
          )}
        </div>
      )}

      {helperText && <p className="text-[10px] text-slate-500">{helperText}</p>}
    </div>
  );
};

/** 开关按钮组件 (是否上架) */
const ToggleSwitch: React.FC<{
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  activeText?: string;
  inactiveText?: string;
}> = ({
  label,
  checked,
  onChange,
  activeText = '已开启上架：保存后在前台智能体商店公开发布，用户可直接查看、免费试用与购买订阅',
  inactiveText = '未开启上架（草稿状态）：仅在后台管理端可见，前台商店不展示，适合编辑阶段保存'
}) => {
  return (
    <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="text-xs font-bold text-white flex items-center gap-2">
          <span>{label}</span>
          <span
            className={`text-[10px] px-2 py-0.5 rounded-full font-bold font-mono border ${
              checked
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            {checked ? '已开启上架' : '已关闭 (草稿)'}
          </span>
        </div>
        <p className="text-xs text-slate-400">
          {checked ? activeText : inactiveText}
        </p>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-12 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
          checked ? 'bg-emerald-500 shadow-md shadow-emerald-500/30' : 'bg-slate-700'
        }`}
      >
        <span
          aria-hidden="true"
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
            checked ? 'translate-x-6' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  );
};

// ============================================================================
// AGENT LIST VIEW & EDIT/CREATE MODAL
// ============================================================================
interface ListProps {
  techForms: string[];
  appScenarios: string[];
  industries: string[];
}

const AgentListAdminView: React.FC<ListProps> = ({ techForms, appScenarios, industries }) => {
  const { agents, setAgents, models, showToast } = useApp();

  // Selected agent for edit, or true for creating new agent
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editingAgent, setEditingAgent] = useState<Partial<AgentItem> | null>(null);

  // Selected agent for secondary detail view
  const [detailAgent, setDetailAgent] = useState<AgentItem | null>(null);

  // Search and filter inside Agent list
  const [searchQuery, setSearchQuery] = useState('');
  const [techFormFilter, setTechFormFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');

  // Multi-select help state for form
  const [formAppScenarios, setFormAppScenarios] = useState<string[]>([]);
  const [formIndustries, setFormIndustries] = useState<string[]>([]);
  const [formSelectedModelIds, setFormSelectedModelIds] = useState<string[]>([]);
  // Launch status toggle (default: false / 关闭)
  const [isPublishedToggle, setIsPublishedToggle] = useState<boolean>(false);

  // Filtering Logic
  const filteredAgents = useMemo(() => {
    return agents.filter(ag => {
      const matchSearch =
        ag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (ag.slogan || '').toLowerCase().includes(searchQuery.toLowerCase());
      const matchForm = techFormFilter === '全部' || ag.techForm === techFormFilter || ag.appType === techFormFilter;
      const isPublished = ag.status === '已上架';
      const matchStatus = statusFilter === '全部' || (statusFilter === '已上架' ? isPublished : !isPublished);
      return matchSearch && matchForm && matchStatus;
    });
  }, [agents, searchQuery, techFormFilter, statusFilter]);

  // Open creation form (默认上架状态为关闭/未上架)
  const handleOpenCreate = () => {
    const defaultModel = models[0] || { id: 'm1', name: 'DeepSeek-V3' };
    setEditingAgent({
      name: '',
      avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      slogan: '',
      techForm: 'Agent' as any,
      description: '',
      useGuide: '',
      techDocs: '',
      freeQuotaAmount: 5.0,
      freeTokenQuota: 10,
      apiAddress: 'https://api.qianji.ai/v1/agent/invoke',
      status: '未上架',
      baseModelId: defaultModel.id,
      baseModel: defaultModel.name,
      linkedModel: defaultModel.name
    });
    setFormSelectedModelIds([defaultModel.id]);
    setFormAppScenarios([]);
    setFormIndustries([]);
    setIsPublishedToggle(false); // 默认为关闭 (未上架)
    setIsEditing(true);
  };

  // Open edit form
  const handleOpenEdit = (ag: AgentItem) => {
    setEditingAgent(ag);
    const initialScenarios = ag.categoryTags && ag.categoryTags.length > 0 
      ? ag.categoryTags.slice(0, 3) 
      : ag.scene ? [ag.scene] : ['办公助理'];
    const initialInds = ag.industryTags && ag.industryTags.length > 0 
      ? ag.industryTags.slice(0, 3) 
      : ag.industry ? [ag.industry] : ['通用'];
    setFormAppScenarios(initialScenarios);
    setFormIndustries(initialInds);

    let initModelIds: string[] = [];
    if (ag.baseModelIds && ag.baseModelIds.length > 0) {
      initModelIds = ag.baseModelIds;
    } else if (ag.baseModelId) {
      initModelIds = [ag.baseModelId];
    } else {
      const m = models.find(mod => mod.name === ag.baseModel || mod.name === ag.linkedModel);
      initModelIds = [m ? m.id : (models[0]?.id || 'm1')];
    }
    setFormSelectedModelIds(initModelIds);

    setIsPublishedToggle(ag.status === '已上架');
    setIsEditing(true);
  };

  // Handle Form Submit
  const handleSaveAgent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAgent) return;

    if (!editingAgent.name?.trim()) {
      showToast('Agent名称不能为空');
      return;
    }
    if (editingAgent.name.length > 20) {
      showToast('Agent名称限20字以内');
      return;
    }
    if (!editingAgent.slogan?.trim()) {
      showToast('一句话简介不能为空');
      return;
    }
    if (editingAgent.slogan.length > 30) {
      showToast('一句话简介限30字以内');
      return;
    }
    if (formSelectedModelIds.length === 0) {
      showToast('请至少选择一个关联平台已有基座模型');
      return;
    }
    if (formAppScenarios.length === 0) {
      showToast('请至少选择一个应用场景（最多3个）');
      return;
    }
    if (!editingAgent.description?.trim()) {
      showToast('功能介绍不能为空');
      return;
    }
    if (!editingAgent.apiAddress?.trim()) {
      showToast('API调用地址不能为空');
      return;
    }

    const isNew = !editingAgent.id;
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const targetId = editingAgent.id || `ag_${Date.now()}`;
    const selectedModelObjects = models.filter(m => formSelectedModelIds.includes(m.id));
    const primaryModel = selectedModelObjects[0] || models[0];
    const freeAmt = editingAgent.freeQuotaAmount !== undefined 
      ? Math.max(0, editingAgent.freeQuotaAmount) 
      : (editingAgent.freeTokenQuota ? editingAgent.freeTokenQuota * 0.5 : 5.0);

    const finalizedAgent: AgentItem = {
      id: targetId,
      name: editingAgent.name,
      avatar: editingAgent.avatar || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
      slogan: editingAgent.slogan,
      techForm: editingAgent.techForm || 'Agent',
      appType: (editingAgent.techForm as any) || 'Agent',
      category: (editingAgent.category || 'dialogue'),
      description: editingAgent.description || '',
      scene: (formAppScenarios[0] || '办公助理') as any,
      industry: (formIndustries[0] || '通用') as any,
      categoryTags: formAppScenarios.slice(0, 3),
      industryTags: formIndustries.slice(0, 3),
      priceType: 'token',
      priceValue: 0,
      tags: editingAgent.tags || ['官方', '新上'],
      apiAddress: editingAgent.apiAddress || 'https://api.qianji.ai/v1/agent/invoke',
      pricePerTenThousandTokens: primaryModel?.pricePerTenThousandTokens || 0.05,
      freeQuotaAmount: freeAmt,
      freeTokenQuota: Math.round(freeAmt * 2),
      hasTrialQuota: freeAmt > 0,
      trialQuotaVal: freeAmt,
      trialQuotaValidityDays: 30,
      status: isPublishedToggle ? '已上架' : '未上架',
      baseModelIds: formSelectedModelIds,
      baseModels: selectedModelObjects.map(m => m.name),
      baseModelId: primaryModel?.id || editingAgent.baseModelId,
      baseModel: primaryModel?.name || editingAgent.baseModel || 'DeepSeek-V3',
      linkedModel: primaryModel?.name || editingAgent.linkedModel || 'DeepSeek-V3',
      rating: editingAgent.rating || 4.9,
      ratingCount: editingAgent.ratingCount || 12,
      usageCount: editingAgent.usageCount || 1250,
      subscribersCount: editingAgent.subscribersCount || editingAgent.callUsersCount || 88,
      callUsersCount: editingAgent.callUsersCount || editingAgent.subscribersCount || 88,
      createdAt: editingAgent.createdAt || nowStr,
      author: editingAgent.author || 'AI运营中心官方研发',
      useGuide: editingAgent.useGuide || '',
      techDocs: editingAgent.techDocs || ''
    };

    if (isNew) {
      setAgents(prev => [finalizedAgent, ...prev]);
      showToast(`✨ Agent【${finalizedAgent.name}】已成功创建（状态：${finalizedAgent.status}）！`);
    } else {
      setAgents(prev => prev.map(a => a.id === finalizedAgent.id ? finalizedAgent : a));
      showToast(`📝 Agent【${finalizedAgent.name}】配置已成功更新并生效（状态：${finalizedAgent.status}）！`);
    }

    setIsEditing(false);
    setEditingAgent(null);
  };

  // Toggle Publish Status
  const togglePublishStatus = (ag: AgentItem) => {
    const isCurrentlyPublished = ag.status === '已上架';
    const nextStatus: AgentItem['status'] = isCurrentlyPublished ? '未上架' : '已上架';

    setAgents(prev => prev.map(a => a.id === ag.id ? { ...a, status: nextStatus } : a));
    showToast(`Agent【${ag.name}】的状态已变更为【${nextStatus}】`);
  };

  // Delete Agent
  const handleDeleteAgent = (id: string, name: string) => {
    if (confirm(`您确定要删除 Agent【${name}】吗？此操作不可撤销。`)) {
      setAgents(prev => prev.filter(a => a.id !== id));
      showToast(`🗑️ Agent【${name}】已成功从平台移除！`);
    }
  };

  // View Details (Mock trigger detail modal in AppContext)
  const { setDetailModalAgent } = useApp();

  return (
    <div className="space-y-6">
      {detailAgent ? (
        // SECONDARY PAGE: DETAIL VIEW
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-6 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setDetailAgent(null)}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-bold transition cursor-pointer flex items-center gap-1.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回 Agent 列表</span>
              </button>
              <div>
                <h3 className="text-base font-black text-white">{detailAgent.name} 详情档案</h3>
                <p className="text-xs text-slate-400">Agent ID: {detailAgent.id}</p>
              </div>
            </div>
            <button
              onClick={() => {
                const ag = detailAgent;
                setDetailAgent(null);
                handleOpenEdit(ag);
              }}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>编辑此类目</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Card: Basic info */}
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
              <div className="flex items-center gap-3">
                <img src={detailAgent.avatar} alt={detailAgent.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-700 bg-slate-800" />
                <div>
                  <h4 className="text-base font-bold text-white">{detailAgent.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{detailAgent.slogan}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {(detailAgent.baseModels && detailAgent.baseModels.length > 0) ? (
                      detailAgent.baseModels.map((bm, i) => (
                        <span key={i} className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold rounded border border-indigo-500/20">
                          {bm}
                        </span>
                      ))
                    ) : (
                      <span className="inline-block px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-mono font-bold rounded border border-indigo-500/20">
                        {detailAgent.linkedModel || detailAgent.baseModel || 'DeepSeek-V3'}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">技术形态</span>
                  <span className="text-slate-200 font-bold">{detailAgent.techForm || detailAgent.appType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">上架状态</span>
                  <span className={`font-bold ${detailAgent.status === '已上架' ? 'text-emerald-400' : 'text-slate-400'}`}>
                    {detailAgent.status === '已上架' ? '已上架' : '未上架'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">免费体验额度</span>
                  <span className="text-amber-400 font-mono font-bold">
                    ¥{(detailAgent.freeQuotaAmount !== undefined ? detailAgent.freeQuotaAmount : (detailAgent.freeTokenQuota ? detailAgent.freeTokenQuota * 0.5 : 5)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">累计调用量</span>
                  <span className="text-indigo-400 font-mono font-bold">{(detailAgent.usageCount || 0).toLocaleString()} 次</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">调用用户数</span>
                  <span className="text-teal-400 font-mono font-bold">{(detailAgent.callUsersCount || detailAgent.subscribersCount || 0).toLocaleString()} 人</span>
                </div>
              </div>
            </div>

            {/* Right Card: Descriptions & Guides */}
            <div className="md:col-span-2 space-y-4">
              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h5 className="font-bold text-slate-200 border-l-2 border-indigo-500 pl-2">功能介绍</h5>
                <p className="text-slate-300 leading-relaxed whitespace-pre-line">{detailAgent.description || '暂无详细介绍'}</p>
              </div>

              <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                <h5 className="font-bold text-slate-200 border-l-2 border-indigo-500 pl-2">API 接口地址</h5>
                <p className="font-mono text-indigo-400 bg-slate-900 p-2.5 rounded-lg border border-slate-800 break-all">{detailAgent.apiAddress || 'https://api.qianji.ai/v1/agent/invoke'}</p>
              </div>

              {detailAgent.useGuide && (
                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3 text-xs">
                  <h5 className="font-bold text-slate-200 border-l-2 border-indigo-500 pl-2">使用指南</h5>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">{detailAgent.useGuide}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : isEditing && editingAgent ? (
        // EDIT / CREATE FORM PANEL
        <form onSubmit={handleSaveAgent} className="rounded-2xl bg-slate-900 border border-slate-800 p-6 space-y-8 text-slate-100">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => { setIsEditing(false); setEditingAgent(null); }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <div>
                <h3 className="text-base font-black text-white">{editingAgent.id ? '编辑 Agent 属性' : '上架全新智能体'}</h3>
                <p className="text-xs text-slate-400">请准确填写各项元数据与Token计费额度配置，系统将自动关联平台模型管理</p>
              </div>
            </div>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition"
            >
              保存并生效
            </button>
          </div>

          {/* PART 1: SHOW INFO */}
          <div className="space-y-5">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              第一部分：基本展示信息 (对应前台卡片与详情展示)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Agent 名称 */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  Agent名称 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={20}
                  required
                  placeholder="限20字内，简要吸睛"
                  value={editingAgent.name || ''}
                  onChange={e => setEditingAgent({ ...editingAgent, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* 一句话简介 */}
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  一句话简介 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={30}
                  required
                  placeholder="限30字内，展示于前台商店卡片"
                  value={editingAgent.slogan || ''}
                  onChange={e => setEditingAgent({ ...editingAgent, slogan: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>
            </div>

            {/* Agent 头像上传组件 */}
            <ImageUploadField
              label="Agent头像 (支持本地上传、拖拽或输入URL)"
              value={editingAgent.avatar}
              onChange={(url) => setEditingAgent({ ...editingAgent, avatar: url })}
            />

            {/* 技术形态 & 关联基座模型 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">
                  技术形态 <span className="text-red-500">*</span>
                </label>
                <select
                  value={editingAgent.techForm || 'Agent'}
                  onChange={e => setEditingAgent({ ...editingAgent, techForm: e.target.value as any })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition font-bold"
                >
                  {techForms.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>

              {/* 关联基座模型 (多选) */}
              <div className="md:col-span-2">
                <ModelMultiSelectDropdown
                  label="关联基座模型"
                  required
                  models={models}
                  selectedModelIds={formSelectedModelIds}
                  onChange={(ids) => setFormSelectedModelIds(ids)}
                />
              </div>
            </div>

            {/* 应用场景 (多选下拉，最多选3个) */}
            <MultiSelectDropdown
              label="应用场景"
              required
              options={appScenarios}
              selectedValues={formAppScenarios}
              onChange={(vals) => setFormAppScenarios(vals)}
              max={3}
              placeholder="请下拉选择应用场景（最多选3个）..."
              badgeTheme="indigo"
            />

            {/* 行业领域 (多选下拉，最多选3个) */}
            <MultiSelectDropdown
              label="行业领域 (选填)"
              options={industries}
              selectedValues={formIndustries}
              onChange={(vals) => setFormIndustries(vals)}
              max={3}
              placeholder="请下拉选择行业领域（最多选3个）..."
              badgeTheme="teal"
            />

            {/* 功能介绍 (Markdown 编辑器) */}
            <MarkdownEditorField
              label="功能介绍"
              required
              rows={5}
              placeholder="详细说明此智能体的功能特性、算法机制、对业务系统的效率提升..."
              value={editingAgent.description || ''}
              onChange={(val) => setEditingAgent({ ...editingAgent, description: val })}
              helperText="支持标准 Markdown 语法，包括加粗、斜体、标题、代码块、列表及超链接等"
            />

            {/* 使用指南 & 技术文档 (Markdown 编辑器) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <MarkdownEditorField
                label="使用指南"
                rows={5}
                placeholder="如何快速开始、交互技巧、提示词优化要点..."
                value={editingAgent.useGuide || ''}
                onChange={(val) => setEditingAgent({ ...editingAgent, useGuide: val })}
              />

              <MarkdownEditorField
                label="技术文档 / 开发者API集成"
                rows={5}
                placeholder="API调用规范、请求头部鉴权、典型 Python/Node.js 接入代码..."
                value={editingAgent.techDocs || ''}
                onChange={(val) => setEditingAgent({ ...editingAgent, techDocs: val })}
              />
            </div>
          </div>

          {/* PART 2: ACCESSIBLE ENDPOINT CONFIG */}
          <div className="space-y-4">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              第二部分：接入配置 (后端服务调用通道)
            </div>
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1">
                API调用地址 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="https://api.qianji.ai/v1/agent/xxx"
                value={editingAgent.apiAddress || ''}
                onChange={e => setEditingAgent({ ...editingAgent, apiAddress: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
              />
            </div>
          </div>

          {/* PART 3: TOKEN BILLING & FREE QUOTA */}
          <div className="space-y-5">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              第三部分：Token计费与免费额度设置
            </div>

            {/* 免费额度设置 */}
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>免费额度设置</span>
                  <span className="text-[10px] text-slate-500 font-normal">（新用户在未充值前可免费用于发起智能体调用的体验额度，单位：元）</span>
                </label>
                <div className="flex items-center gap-2">
                  {[0, 2, 5, 10, 20].map(cnt => (
                    <button
                      type="button"
                      key={cnt}
                      onClick={() => setEditingAgent({ ...editingAgent, freeQuotaAmount: cnt })}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border transition cursor-pointer ${
                        (editingAgent.freeQuotaAmount === cnt || (cnt === 5 && editingAgent.freeQuotaAmount === undefined && editingAgent.freeTokenQuota === undefined))
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {cnt === 0 ? '不赠送' : `¥${cnt.toFixed(2)}`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold font-mono">¥</span>
                  <input
                    type="number"
                    min={0}
                    step={0.5}
                    placeholder="如：5.00"
                    value={editingAgent.freeQuotaAmount !== undefined ? editingAgent.freeQuotaAmount : (editingAgent.freeTokenQuota ? editingAgent.freeTokenQuota * 0.5 : 5)}
                    onChange={e => setEditingAgent({ ...editingAgent, freeQuotaAmount: Math.max(0, parseFloat(e.target.value) || 0) })}
                    className="w-40 pl-7 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:border-indigo-500 outline-none transition font-mono font-bold"
                  />
                </div>
                <span className="text-xs text-slate-400">元 免费体验额度（填 0 表示不赠送免费额度；不同基座模型 Token 价格不同，统一以元按量扣减）</span>
              </div>
            </div>
          </div>

          {/* PART 4: LAUNCH STATUS (SWITCH BUTTON, DEFAULT OFF) */}
          <div className="space-y-4">
            <div className="text-xs font-black text-indigo-400 uppercase tracking-widest border-l-2 border-indigo-500 pl-2">
              第四部分：上架状态设定
            </div>

            <ToggleSwitch
              label="是否上架至前台商店"
              checked={isPublishedToggle}
              onChange={(checked) => setIsPublishedToggle(checked)}
              activeText="已开启上架：保存后将在前台 AI Agent 商店公开发布，用户可浏览、立即体验及按Token计费调用"
              inactiveText="已关闭上架（未上架状态）：仅在后台管理端可见与调试，前台普通用户不可见"
            />
          </div>

          {/* Buttons */}
          <div className="border-t border-slate-800 pt-5 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => { setIsEditing(false); setEditingAgent(null); }}
              className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs text-slate-300 transition cursor-pointer"
            >
              取消返回
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold cursor-pointer transition shadow-md shadow-indigo-600/30"
            >
              提交保存
            </button>
          </div>
        </form>
      ) : (
        // TABLE LIST VIEW
        <div className="space-y-5">
          {/* Query and Add header */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-end gap-4 justify-between">
            <div className="flex flex-1 flex-col md:flex-row gap-3">
              {/* Search Bar */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="搜索 Agent 标题名称、简介..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:border-indigo-500 outline-none transition"
                />
              </div>

              {/* Tech Form Filter */}
              <div className="w-full md:w-44">
                <select
                  value={techFormFilter}
                  onChange={e => setTechFormFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:border-indigo-500 outline-none transition"
                >
                  <option value="全部">全部技术形态</option>
                  {techForms.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>

              {/* Status filter: 只有已上架和未上架 */}
              <div className="w-full md:w-40">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white font-bold focus:border-indigo-500 outline-none transition"
                >
                  <option value="全部">全部上架状态</option>
                  <option value="已上架">已上架</option>
                  <option value="未上架">未上架</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleOpenCreate}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-md shadow-indigo-600/20 cursor-pointer transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>添加新 Agent</span>
            </button>
          </div>

          {/* Table Container */}
          <div className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-900">
              <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                智能体 Agent 主列表
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
                共 {filteredAgents.length} 款 Agent
              </span>
            </div>

            {filteredAgents.length === 0 ? (
              <div className="py-20 text-center text-slate-500 space-y-2">
                <Bot className="w-10 h-10 mx-auto text-indigo-400 opacity-50" />
                <h4 className="text-sm font-bold text-slate-300">没有检索到对应的 Agent</h4>
                <p className="text-xs">请清空搜索词或更改筛选选项重试</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                      <th className="py-3 px-3">Logo</th>
                      <th className="py-3 px-3">智能体名称</th>
                      <th className="py-3 px-3">一句话简介</th>
                      <th className="py-3 px-3">关联模型</th>
                      <th className="py-3 px-3">技术形态</th>
                      <th className="py-3 px-3">应用场景</th>
                      <th className="py-3 px-3">免费额度</th>
                      <th className="py-3 px-3 text-right">调用量</th>
                      <th className="py-3 px-3 text-right">调用用户数</th>
                      <th className="py-3 px-3">上架状态</th>
                      <th className="py-3 px-4 text-center">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50 text-slate-300">
                    {filteredAgents.map(ag => {
                      const isPublished = ag.status === '已上架';
                      const freeTokens = ag.freeTokenQuota !== undefined ? `${ag.freeTokenQuota} 万Token` : (ag.freeTrialCount ? `${ag.freeTrialCount * 2} 万Token` : '10 万Token');
                      const callUsers = ag.callUsersCount || ag.subscribersCount || 0;

                      return (
                        <tr key={ag.id} className="hover:bg-slate-800/30 transition">
                          {/* Logo */}
                          <td className="py-3.5 px-3">
                            <img
                              src={ag.avatar}
                              alt={ag.name}
                              className="w-9 h-9 rounded-xl object-cover border border-slate-700 bg-slate-800 shrink-0"
                            />
                          </td>

                          {/* Agent Name */}
                          <td className="py-3.5 px-3 font-extrabold text-white text-xs whitespace-nowrap">
                            {ag.name}
                          </td>

                          {/* Slogan */}
                          <td className="py-3.5 px-3 text-[11px] text-slate-400 max-w-[200px] truncate">
                            {ag.slogan}
                          </td>

                          {/* Linked Model */}
                          <td className="py-3.5 px-3">
                            {ag.baseModels && ag.baseModels.length > 0 ? (
                              <div className="flex flex-wrap gap-1 max-w-[150px]">
                                {ag.baseModels.map((bm, i) => (
                                  <span key={i} className="text-[10px] px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded border border-indigo-500/20 font-mono font-bold whitespace-nowrap">
                                    {bm}
                                  </span>
                                ))}
                              </div>
                            ) : (ag.linkedModel || ag.baseModel) ? (
                              <span className="text-[10px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-md border border-indigo-500/20 font-mono font-bold whitespace-nowrap">
                                {ag.linkedModel || ag.baseModel}
                              </span>
                            ) : (
                              <span className="text-slate-600 text-[10px]">-</span>
                            )}
                          </td>

                          {/* Tech Form Badge */}
                          <td className="py-3.5 px-3">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/10 text-blue-400 border border-blue-500/20 whitespace-nowrap">
                              {ag.techForm || ag.appType || 'Agent'}
                            </span>
                          </td>

                          {/* Scenarios */}
                          <td className="py-3.5 px-3">
                            <div className="flex flex-wrap gap-1 max-w-[150px]">
                              {(ag.categoryTags || ['办公助理']).slice(0, 3).map(tag => (
                                <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[10px] border border-slate-700">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Free Quota (in Yuan) */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            <span className="text-amber-400 font-mono font-bold text-xs">
                              ¥{(ag.freeQuotaAmount !== undefined ? ag.freeQuotaAmount : (ag.freeTokenQuota ? ag.freeTokenQuota * 0.5 : 5)).toFixed(2)}
                            </span>
                          </td>

                          {/* Calls Count */}
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-slate-200 whitespace-nowrap">
                            {(ag.usageCount || 0).toLocaleString()} 次
                          </td>

                          {/* Call Users Count (调用用户数) */}
                          <td className="py-3.5 px-3 text-right font-mono font-bold text-teal-400 whitespace-nowrap">
                            {callUsers.toLocaleString()} 人
                          </td>

                          {/* Status: 只有已上架和未上架 */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {isPublished ? (
                              <span className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                已上架
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-slate-500 text-[11px] font-bold">
                                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                                未上架
                              </span>
                            )}
                          </td>

                          {/* Actions column: 保留详情、编辑、上架/下架、删除 */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-2">
                              {/* View details */}
                              <button
                                onClick={() => setDetailAgent(ag)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-indigo-400 hover:text-indigo-300 border border-slate-700 transition cursor-pointer"
                                title="查看详情"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit */}
                              <button
                                onClick={() => handleOpenEdit(ag)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-teal-400 hover:text-teal-300 border border-slate-700 transition cursor-pointer"
                                title="编辑配置"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              {/* Toggle publish status (上架/下架) */}
                              <button
                                onClick={() => togglePublishStatus(ag)}
                                className={`p-1.5 rounded border transition cursor-pointer ${
                                  isPublished
                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                }`}
                                title={isPublished ? '下架' : '上架'}
                              >
                                <Power className="w-3.5 h-3.5" />
                              </button>

                              {/* Delete */}
                              <button
                                onClick={() => handleDeleteAgent(ag.id, ag.name)}
                                className="p-1.5 rounded bg-slate-800 hover:bg-red-900 hover:text-red-300 text-red-400 border border-slate-700 transition cursor-pointer"
                                title="删除"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SUBVIEW 2: AGENT CALL RECORDS (Agent调用记录)
// ============================================================================
const AgentCallsAdminView: React.FC = () => {
  const { modelCallRecords, models, agents } = useApp();

  // Filter States
  const [timeRange, setTimeRange] = useState<'all' | 'today' | '7days' | 'month' | 'custom'>('all');
  const [customStartDate, setCustomStartDate] = useState('');
  const [customEndDate, setCustomEndDate] = useState('');
  const [selectedAgentFilter, setSelectedAgentFilter] = useState('全部');
  const [selectedModelFilter, setSelectedModelFilter] = useState('全部');
  const [statusFilter, setStatusFilter] = useState('全部');
  const [searchKeyword, setSearchKeyword] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<'callTime' | 'cost' | 'inputTokens' | 'outputTokens' | 'latencyMs'>('callTime');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Copy Feedback
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Selected Call for Detail View
  const [selectedCall, setSelectedCall] = useState<AgentCallRecord | null>(null);

  // Extract all unified Agent Call records from shared modelCallRecords
  const agentCalls = useMemo<AgentCallRecord[]>(() => {
    // Filter records initiated by agents or matching agent records
    const records = modelCallRecords.filter(r => r.callSource === 'agent' || r.agentName || r.agentId);

    return records.map(r => {
      const matchedAgent = agents.find(a => a.id === r.agentId || a.name === r.agentName);
      const matchedModel = models.find(m => m.id === r.modelId || m.name === r.modelName);

      const inputToks = r.inputCount ?? (parseInt(r.inputAmount?.replace(/[^0-9]/g, '') || '0', 10) || 1200);
      const outputToks = r.outputCount ?? (parseInt(r.outputAmount?.replace(/[^0-9]/g, '') || '0', 10) || 680);

      return {
        id: r.id,
        userId: r.userId || 'U892301',
        userName: r.userName || '未知用户',
        userAvatar: r.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        agentId: r.agentId || matchedAgent?.id || 'ag_default',
        agentName: r.agentName || matchedAgent?.name || '智能助手',
        baseModelId: r.modelId || matchedModel?.id || 'deepseek-v3',
        baseModelName: r.modelName || matchedModel?.name || (matchedAgent as any)?.baseModelName || 'DeepSeek-V3',
        inputTokens: inputToks,
        outputTokens: outputToks,
        priceInput: matchedModel?.priceInput || '¥0.002 / 1k tokens',
        priceOutput: matchedModel?.priceOutput || '¥0.004 / 1k tokens',
        cost: r.cost,
        callTime: r.callTime,
        status: r.status,
        failReason: r.failReason,
        requestSummary: r.requestParamsSummary || '【用户提问】请基于最新行业数据生成一份关于AI智能体在金融领域的深度分析框架...',
        responseSummary: r.responseSummary || '【Agent输出】已成功检索知识库并调用模型生成结构化研报框架，包含5个核心章节与风险测算指标。',
        latencyMs: r.latencyMs || 360,
        callType: (r.callType as any) || '在线体验'
      };
    });
  }, [modelCallRecords, models, agents]);

  // List of unique agents that appear in records or system agents
  const availableAgentNames = useMemo(() => {
    const names = new Set<string>();
    agents.forEach(a => {
      if (a.name) names.add(a.name);
    });
    agentCalls.forEach(c => {
      if (c.agentName) names.add(c.agentName);
    });
    return Array.from(names);
  }, [agents, agentCalls]);

  // List of unique models
  const availableModelNames = useMemo(() => {
    const names = new Set<string>();
    models.forEach(m => {
      if (m.name) names.add(m.name);
    });
    agentCalls.forEach(c => {
      if (c.baseModelName) names.add(c.baseModelName);
    });
    return Array.from(names);
  }, [models, agentCalls]);

  // Filtering Logic
  const filteredCalls = useMemo(() => {
    return agentCalls.filter(call => {
      // 1. Time range filter
      if (timeRange === 'today') {
        const todayStr = '2026-09-19'; // Today reference
        if (!call.callTime.startsWith(todayStr)) return false;
      } else if (timeRange === '7days') {
        // 近7天
        if (call.callTime < '2026-09-12') return false;
      } else if (timeRange === 'month') {
        // 本月
        if (!call.callTime.startsWith('2026-09')) return false;
      } else if (timeRange === 'custom') {
        if (customStartDate && call.callTime < customStartDate) return false;
        if (customEndDate && call.callTime > customEndDate + ' 23:59:59') return false;
      }

      // 2. Agent Name filter
      if (selectedAgentFilter !== '全部' && call.agentName !== selectedAgentFilter) {
        return false;
      }

      // 3. Bound Model filter
      if (selectedModelFilter !== '全部' && call.baseModelName !== selectedModelFilter) {
        return false;
      }

      // 4. Status filter
      if (statusFilter !== '全部' && call.status !== statusFilter) {
        return false;
      }

      // 5. Search Keyword (User name, UID, Call ID, Agent name)
      if (searchKeyword.trim()) {
        const kw = searchKeyword.toLowerCase();
        const matchId = call.id.toLowerCase().includes(kw);
        const matchUser = call.userName.toLowerCase().includes(kw);
        const matchUid = call.userId.toLowerCase().includes(kw);
        const matchAgent = call.agentName.toLowerCase().includes(kw);
        if (!matchId && !matchUser && !matchUid && !matchAgent) return false;
      }

      return true;
    }).sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];

      if (typeof valA === 'string') {
        return sortOrder === 'asc' ? valA.localeCompare(valB as string) : (valB as string).localeCompare(valA);
      }
      return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
    });
  }, [agentCalls, timeRange, customStartDate, customEndDate, selectedAgentFilter, selectedModelFilter, statusFilter, searchKeyword, sortField, sortOrder]);

  // Quick stats calculation for filtered items
  const stats = useMemo(() => {
    const totalCalls = filteredCalls.length;
    const totalTokens = filteredCalls.reduce((acc, curr) => acc + curr.inputTokens + curr.outputTokens, 0);
    const totalCost = filteredCalls.reduce((acc, curr) => acc + curr.cost, 0);
    const successCalls = filteredCalls.filter(c => c.status === '成功').length;
    const successRate = totalCalls > 0 ? ((successCalls / totalCalls) * 100).toFixed(1) : '100.0';
    const avgLatency = totalCalls > 0 ? (filteredCalls.reduce((acc, curr) => acc + (curr.latencyMs || 0), 0) / totalCalls).toFixed(0) : '0';

    return { totalCalls, totalTokens, totalCost, successRate, avgLatency };
  }, [filteredCalls]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleSort = (field: 'callTime' | 'cost' | 'inputTokens' | 'outputTokens' | 'latencyMs') => {
    if (sortField === field) {
      setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const handleResetFilters = () => {
    setTimeRange('all');
    setCustomStartDate('');
    setCustomEndDate('');
    setSelectedAgentFilter('全部');
    setSelectedModelFilter('全部');
    setStatusFilter('全部');
    setSearchKeyword('');
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP STATS BAR */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Calls */}
        <div className="bg-slate-900/80 border border-slate-800 p-4.5 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Agent 调用总量</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Bot className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-slate-100">
            {stats.totalCalls.toLocaleString()} <span className="text-xs text-slate-500 font-normal">次</span>
          </div>
          <p className="text-[10px] text-slate-500">全站智能体 API 与交互调用</p>
        </div>

        {/* Total Tokens */}
        <div className="bg-slate-900/80 border border-slate-800 p-4.5 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Token 消耗总计</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Zap className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-slate-100">
            {stats.totalTokens.toLocaleString()} <span className="text-xs text-slate-500 font-normal">Tokens</span>
          </div>
          <p className="text-[10px] text-slate-500">输入与输出 Token 汇总</p>
        </div>

        {/* Total Cost */}
        <div className="bg-slate-900/80 border border-slate-800 p-4.5 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">模型结算总费用</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-emerald-400">
            ¥{stats.totalCost.toFixed(4)}
          </div>
          <p className="text-[10px] text-slate-500">按底座基座模型费率结算</p>
        </div>

        {/* Success Rate */}
        <div className="bg-slate-900/80 border border-slate-800 p-4.5 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">调用成功率</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 border border-teal-500/20">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-teal-400">
            {stats.successRate}%
          </div>
          <p className="text-[10px] text-slate-500">服务网关稳定率指标</p>
        </div>

        {/* Avg Latency */}
        <div className="bg-slate-900/80 border border-slate-800 p-4.5 rounded-2xl shadow-xs space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">平均响应耗时</span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl font-black font-mono text-purple-400">
            {stats.avgLatency} <span className="text-xs text-slate-500 font-normal">ms</span>
          </div>
          <p className="text-[10px] text-slate-500">Agent 推理执行耗时</p>
        </div>
      </div>

      {/* 2. SEARCH & FILTER CONTROL PANEL */}
      <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="text-xs font-black text-slate-300 uppercase tracking-wider flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
            <span>Agent 调用明细筛选控制台</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleResetFilters}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>重置所有筛选</span>
            </button>
            <span className="text-[11px] px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 font-mono border border-indigo-500/20">
              命中 {filteredCalls.length} 条记录
            </span>
          </div>
        </div>

        {/* Filter Inputs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 text-xs">
          {/* 1. Keyword Search */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5">搜索用户 / UID / 调用ID</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="搜索用户名、UID或调用ID..."
                value={searchKeyword}
                onChange={e => setSearchKeyword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 outline-none focus:border-indigo-500 transition"
              />
            </div>
          </div>

          {/* 2. Time Range */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5">时间范围</label>
            <select
              value={timeRange}
              onChange={e => setTimeRange(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-medium"
            >
              <option value="all">全部时间</option>
              <option value="today">今日</option>
              <option value="7days">近7天</option>
              <option value="month">本月</option>
              <option value="custom">自定义日期范围</option>
            </select>
          </div>

          {/* 3. Agent Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5">Agent 名称</label>
            <select
              value={selectedAgentFilter}
              onChange={e => setSelectedAgentFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-medium"
            >
              <option value="全部">全部已上架 Agent ({availableAgentNames.length})</option>
              {availableAgentNames.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* 4. Bound Model Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5">绑定基座模型</label>
            <select
              value={selectedModelFilter}
              onChange={e => setSelectedModelFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-medium"
            >
              <option value="全部">全部已配置模型 ({availableModelNames.length})</option>
              {availableModelNames.map(name => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* 5. Status Filter */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 block mb-1.5">调用状态</label>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-medium"
            >
              <option value="全部">全部状态</option>
              <option value="成功">成功 (200 OK)</option>
              <option value="失败">失败 (异常/超时)</option>
            </select>
          </div>
        </div>

        {/* Custom Date Range Row (Conditional) */}
        {timeRange === 'custom' && (
          <div className="pt-2 border-t border-slate-800/80 flex flex-wrap items-center gap-3">
            <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              自定义起始日期:
            </span>
            <input
              type="date"
              value={customStartDate}
              onChange={e => setCustomStartDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-mono"
            />
            <span className="text-slate-500 text-xs">至</span>
            <input
              type="date"
              value={customEndDate}
              onChange={e => setCustomEndDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white outline-none focus:border-indigo-500 font-mono"
            />
          </div>
        )}
      </div>

      {/* 3. MAIN TABLE VIEW */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-800 bg-slate-900 flex items-center justify-between">
          <div className="text-xs font-black text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <History className="w-4 h-4 text-indigo-400" />
            <span>Agent 调用明细日志</span>
            <span className="text-[10px] text-slate-500 font-normal lowercase">（与模型调用同源数据·Agent视角）</span>
          </div>
          <span className="text-xs text-slate-400">
            当前展示 <span className="font-mono text-white font-bold">{filteredCalls.length}</span> 条日志
          </span>
        </div>

        {filteredCalls.length === 0 ? (
          <div className="py-20 text-center text-slate-500 space-y-3">
            <Bot className="w-12 h-12 mx-auto text-slate-600 opacity-60 animate-pulse" />
            <h4 className="text-sm font-bold text-slate-300">没有查找到符合条件的 Agent 调用记录</h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              您可以尝试调整时间范围、更换 Agent / 模型筛选项，或清除搜索关键词后重新查询。
            </p>
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition cursor-pointer"
            >
              清空筛选条件
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                  <th className="py-3.5 px-4 cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('callTime')}>
                    <div className="flex items-center gap-1">
                      <span>调用ID / 时间</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3">调用用户</th>
                  <th className="py-3.5 px-3">被调 Agent</th>
                  <th className="py-3.5 px-3">绑定模型</th>
                  <th className="py-3.5 px-3 text-right cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('inputTokens')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>输入Token</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-right cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('outputTokens')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>输出Token</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-right cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('cost')}>
                    <div className="flex items-center justify-end gap-1">
                      <span>费用</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-center cursor-pointer hover:text-slate-200" onClick={() => handleToggleSort('latencyMs')}>
                    <div className="flex items-center justify-center gap-1">
                      <span>耗时</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="py-3.5 px-3 text-center">状态</th>
                  <th className="py-3.5 px-4 text-center">操作</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-slate-300">
                {filteredCalls.map(call => {
                  const isSuccess = call.status === '成功';
                  return (
                    <tr key={call.id} className="hover:bg-slate-800/30 transition group">
                      {/* Call ID & Time */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-slate-200 text-[11px]">{call.id}</span>
                          <button
                            onClick={() => handleCopy(call.id, call.id)}
                            title="点击复制调用ID"
                            className="p-1 rounded text-slate-500 hover:text-indigo-400 hover:bg-slate-800 transition cursor-pointer"
                          >
                            {copiedId === call.id ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                        <div className="text-[10px] text-slate-500 font-mono mt-0.5">{call.callTime}</div>
                      </td>

                      {/* User */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={call.userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                            alt={call.userName}
                            className="w-6 h-6 rounded-full object-cover border border-slate-800 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-slate-200 text-xs">{call.userName}</div>
                            <div className="text-[10px] font-mono text-slate-500">{call.userId}</div>
                          </div>
                        </div>
                      </td>

                      {/* Agent Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5 font-bold text-white text-xs">
                          <Bot className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span className="truncate max-w-[150px]" title={call.agentName}>{call.agentName}</span>
                        </div>
                      </td>

                      {/* Bound Model */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-400 font-mono text-[11px] font-bold border border-indigo-500/20 whitespace-nowrap">
                          {call.baseModelName}
                        </span>
                      </td>

                      {/* Input Tokens */}
                      <td className="py-3 px-3 text-right font-mono text-slate-300 font-medium">
                        {call.inputTokens.toLocaleString()}
                      </td>

                      {/* Output Tokens */}
                      <td className="py-3 px-3 text-right font-mono text-slate-300 font-medium">
                        {call.outputTokens.toLocaleString()}
                      </td>

                      {/* Cost */}
                      <td className="py-3 px-3 text-right font-mono font-bold text-emerald-400 text-xs">
                        ¥{call.cost.toFixed(4)}
                      </td>

                      {/* Latency */}
                      <td className="py-3 px-3 text-center font-mono text-[11px] text-slate-400">
                        {call.latencyMs} ms
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3 text-center">
                        {isSuccess ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            成功
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-red-500/10 text-red-400 text-[10px] border border-red-500/20 font-bold"
                            title={call.failReason || '调用失败'}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                            失败
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => setSelectedCall(call)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 hover:text-white transition text-[11px] font-bold cursor-pointer inline-flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3 text-indigo-400" />
                          <span>查看详情</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. DETAIL MODAL DIALOG */}
      {selectedCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-white">Agent 调用详情档案</h3>
                    {selectedCall.status === '成功' ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] border border-emerald-500/20 font-bold">
                        调用成功 (200 OK)
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-red-500/10 text-red-400 text-[10px] border border-red-500/20 font-bold">
                        调用失败 (异常)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="font-mono text-slate-300">ID: {selectedCall.id}</span>
                    <button
                      onClick={() => handleCopy(selectedCall.id, 'modal_id')}
                      className="text-slate-500 hover:text-indigo-400 text-[11px] inline-flex items-center gap-1 transition"
                    >
                      {copiedId === 'modal_id' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedId === 'modal_id' ? '已复制' : '复制ID'}</span>
                    </button>
                    <span>·</span>
                    <span className="text-slate-500">{selectedCall.callTime}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setSelectedCall(null)}
                className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)] text-xs">
              {/* If Failure, show diagnosis banner */}
              {selectedCall.status === '失败' && (
                <div className="p-4 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 space-y-1">
                  <div className="flex items-center gap-2 font-bold text-red-200 text-xs">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span>调用异常诊断与报错原因</span>
                  </div>
                  <p className="text-xs text-red-300/90 font-mono">
                    {selectedCall.failReason || '上游基座模型接口限流 429 Too Many Requests: 并发调用量超过配额上限，系统已触发安全熔断。'}
                  </p>
                </div>
              )}

              {/* 4 Info Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 1. User & Agent Card */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
                    <Users className="w-3.5 h-3.5 text-indigo-400" />
                    <span>调用主体与智能体信息</span>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">调用用户:</span>
                      <span className="font-bold text-white">{selectedCall.userName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">用户 UID:</span>
                      <span className="font-mono text-slate-200">{selectedCall.userId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">被调用 Agent:</span>
                      <span className="font-bold text-indigo-400">{selectedCall.agentName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Agent ID:</span>
                      <span className="font-mono text-slate-400">{selectedCall.agentId}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Model & Cost Card */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-800/80 pb-2">
                    <Coins className="w-3.5 h-3.5 text-emerald-400" />
                    <span>底座模型与计费明细</span>
                  </div>
                  <div className="space-y-2 text-slate-300">
                    <div className="flex justify-between">
                      <span className="text-slate-500">绑定基座模型:</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 font-mono font-bold border border-indigo-500/20">
                        {selectedCall.baseModelName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">命中计费单价:</span>
                      <span className="font-mono text-slate-300">{selectedCall.priceInput} / {selectedCall.priceOutput}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">本次结算扣费:</span>
                      <span className="font-mono font-black text-emerald-400 text-sm">¥{selectedCall.cost.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">端到端响应耗时:</span>
                      <span className="font-mono text-purple-400 font-bold">{selectedCall.latencyMs} ms</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Token Metric Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">输入 Token 消耗</span>
                  <span className="text-sm font-black text-slate-200 font-mono mt-1 block">
                    {selectedCall.inputTokens.toLocaleString()} Tokens
                  </span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">输出 Token 消耗</span>
                  <span className="text-sm font-black text-indigo-400 font-mono mt-1 block">
                    {selectedCall.outputTokens.toLocaleString()} Tokens
                  </span>
                </div>
                <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-center">
                  <span className="text-[10px] text-slate-500 block">合计总消耗</span>
                  <span className="text-sm font-black text-teal-400 font-mono mt-1 block">
                    {(selectedCall.inputTokens + selectedCall.outputTokens).toLocaleString()} Tokens
                  </span>
                </div>
              </div>

              {/* Request Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>请求内容 / 提示词摘要 (Request Prompt)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(selectedCall.requestSummary || '', 'req_sum')}
                    className="text-slate-500 hover:text-indigo-400 text-[11px] inline-flex items-center gap-1"
                  >
                    {copiedId === 'req_sum' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'req_sum' ? '已复制' : '复制输入'}</span>
                  </button>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-300 text-xs leading-relaxed whitespace-pre-wrap">
                  {selectedCall.requestSummary || '【输入参数】无详细输入记录'}
                </div>
              </div>

              {/* Response Summary */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Agent 响应内容 / 生成结果 (Response Output)</span>
                  </span>
                  <button
                    onClick={() => handleCopy(selectedCall.responseSummary || '', 'res_sum')}
                    className="text-slate-500 hover:text-indigo-400 text-[11px] inline-flex items-center gap-1"
                  >
                    {copiedId === 'res_sum' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === 'res_sum' ? '已复制' : '复制输出'}</span>
                  </button>
                </div>
                <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-slate-300 text-xs leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                  {selectedCall.responseSummary || '【输出结果】无详细输出记录'}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                数据视角：通过 Agent 发起的调用，底层对应模型调用记录 {selectedCall.id}
              </span>
              <button
                onClick={() => setSelectedCall(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs transition cursor-pointer"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// SUBVIEW 3: USAGE STATISTICS
// ============================================================================
interface StatsProps {
  techForms: string[];
  appScenarios: string[];
}

const AgentStatsAdminView: React.FC<StatsProps> = ({ techForms, appScenarios }) => {
  const { agents } = useApp();

  // 1. Calculate General Aggregated Stats
  const totalAgents = agents.length;
  const totalCalls = useMemo(() => {
    return agents.reduce((sum, item) => sum + (item.usageCount || 0), 0) + 128400; // Adding mock baseline
  }, [agents]);

  const totalTokens = '84.2 亿'; // Large system wide mock number
  const totalRevenue = useMemo(() => {
    return (
      agents.reduce((sum, item) => {
        const subscribers = item.callUsersCount || item.subscribersCount || 0;
        const avgPrice = item.pricePerTenThousandTokens ? 45 : 0; // average token cost
        return sum + subscribers * avgPrice;
      }, 0) + 124500
    );
  }, [agents]);

  // 2. Data rankings (Top 10 Agents by Calls)
  const top10AgentsData = useMemo(() => {
    return [...agents]
      .sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0))
      .slice(0, 10)
      .map(item => ({
        name: item.name.length > 8 ? item.name.substring(0, 8) + '...' : item.name,
        '调用次数': item.usageCount || 0,
        '调用用户数': item.callUsersCount || item.subscribersCount || 0
      }));
  }, [agents]);

  // 3. App Scenarios pie distribution chart data
  const scenarioDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    appScenarios.forEach(sc => {
      counts[sc] = 0;
    });

    agents.forEach(item => {
      if (item.categoryTags) {
        item.categoryTags.forEach(tag => {
          if (counts[tag] !== undefined) {
            counts[tag]++;
          } else {
            counts[tag] = 1;
          }
        });
      }
    });

    return Object.keys(counts)
      .map(key => ({
        name: key,
        value: counts[key] === 0 ? 1 : counts[key] // Fallback baseline for visual beauty
      }))
      .filter(item => item.value > 0);
  }, [agents, appScenarios]);

  // 4. Tech forms distribution pie chart data
  const techFormDistributionData = useMemo(() => {
    const counts: Record<string, number> = {};
    techForms.forEach(form => {
      counts[form] = 0;
    });

    agents.forEach(item => {
      const form = item.techForm || item.appType || '工作流';
      if (counts[form] !== undefined) {
        counts[form]++;
      } else {
        counts[form] = 1;
      }
    });

    return Object.keys(counts)
      .map(key => ({
        name: key,
        value: counts[key] === 0 ? 1 : counts[key]
      }))
      .filter(item => item.value > 0);
  }, [agents, techForms]);

  return (
    <div className="space-y-6 text-slate-100">
      {/* 4 Cards Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Agents */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <span className="text-xs text-slate-400 block">总 Agent 运营数量</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">{totalAgents} 款</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              已全量上架
            </span>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 mt-2">其中包含草稿与测试沙箱</p>
        </div>

        {/* Total calls */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <span className="text-xs text-slate-400 block">总调用次数</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">{totalCalls.toLocaleString()} 次</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              +15.4% 日增
            </span>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 mt-2">API 路由级网关流向累计</p>
        </div>

        {/* Total Token */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <span className="text-xs text-slate-400 block">总 Token 消耗</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-white">{totalTokens}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              流式吞吐
            </span>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 mt-2">基于 LLM 模型底层算力节点统计</p>
        </div>

        {/* Total Revenue */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-2">
          <span className="text-xs text-slate-400 block">累计总营收</span>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl font-black font-mono text-emerald-400">¥{totalRevenue.toLocaleString()}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              分成已打款
            </span>
          </div>
          <p className="text-[10px] text-slate-500 border-t border-slate-800 pt-2 mt-2">算力会员订购与Token计费结算</p>
        </div>
      </div>

      {/* Grid of charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CHART 1: TOP 10 AGENTS CALLS */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white">Agent 热门调用排行榜 (Top 10)</h4>
            <p className="text-xs text-slate-400">展示当前前台调用热度最高的 10 个智能体服务</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={top10AgentsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar dataKey="调用次数" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: TOKEN TREND */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white">Token 流量吞吐趋势 (近30天)</h4>
            <p className="text-xs text-slate-400">平台全量 Agent API 端吞吐指标时序变化监控</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockUsageTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="tokens" name="万Token量" stroke="#3b82f6" strokeWidth={3} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="calls" name="调用频次" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 3: APPLICATION SCENARIO PIE */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white">应用场景产品分布比例</h4>
            <p className="text-xs text-slate-400">全站智能体对应各应用场景领域的数量与活跃权重占比</p>
          </div>
          <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="w-1/2 h-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={scenarioDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {scenarioDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            {/* Custom Legend to fit design */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
              {scenarioDistributionData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="text-slate-400 font-bold">{entry.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CHART 4: TECH FORM PIE */}
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 space-y-4">
          <div>
            <h4 className="text-sm font-black text-white">技术形态核心比重占比</h4>
            <p className="text-xs text-slate-400">当前在架智能体基于 Chatbot, Agent, 工作流等的技术分布比例</p>
          </div>
          <div className="h-64 flex flex-col md:flex-row items-center justify-around gap-4">
            <div className="w-1/2 h-full min-h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={techFormDistributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {techFormDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[(index + 3) % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {techFormDistributionData.map((entry, idx) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[(idx + 3) % COLORS.length] }} />
                  <span className="text-slate-400 font-bold">{entry.name}</span>
                  <span className="text-[10px] font-mono text-slate-500">({entry.value} 款)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* DETAIL RAW DATA TABLE */}
      <div className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-800 bg-slate-900/50">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Activity className="w-4 h-4 text-indigo-400" />
            <span>各智能体 Agent 核心调用与用量明细大表</span>
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-950/60 text-slate-400 uppercase text-[10px] font-black border-b border-slate-800">
                <th className="py-3 px-4">智能体名称</th>
                <th className="py-3 px-3">技术架构形态</th>
                <th className="py-3 px-3 text-right">累计调用次数</th>
                <th className="py-3 px-3 text-right">消耗Token估算</th>
                <th className="py-3 px-3 text-right">调用用户数</th>
                <th className="py-3 px-4 text-right">累计总营收</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-slate-300">
              {agents.map(ag => {
                const calls = ag.usageCount || 0;
                const tokensEst = (calls * 1.45).toFixed(1); // Mock token multiplier
                const callUsers = ag.callUsersCount || ag.subscribersCount || 0;
                const revenueEst = callUsers * (ag.pricePerTenThousandTokens ? 149 : 0);
                return (
                  <tr key={ag.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-3 px-4 font-bold text-white">{ag.name}</td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-[10px]">
                        {ag.techForm || ag.appType || '工作流'}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-slate-200">
                      {calls.toLocaleString()} 次
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300">
                      {tokensEst} 万Token
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-teal-400 font-bold">
                      {callUsers.toLocaleString()} 人
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400">
                      ¥{revenueEst.toLocaleString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

