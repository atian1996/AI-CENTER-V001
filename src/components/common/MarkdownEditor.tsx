import React, { useState, useRef } from 'react';
import Markdown from 'react-markdown';
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Code,
  Quote,
  List,
  ListOrdered,
  Table,
  Link as LinkIcon,
  Eye,
  Edit3,
  Sparkles,
  FileCode,
  Check
} from 'lucide-react';

export const DEFAULT_SKILL_OVERVIEW_TEMPLATE = `# Skill 插件概述

本插件为 Agent 智能体提供高效、安全的业务分析与自动化能力，开箱即用。

### 知识产权声明
本技能及相关文档、脚本代码的著作权归开发者所有。

### 使用许可
- ✔ 允许个人学习、研究、非商业用途使用
- ✔ 允许修改后在私有 Agent 环境中使用
- ✖ 禁止直接复制核心算法用于未经授权的商业产品或竞争性服务
- ✖ 禁止移除或篡改作者署名后重新分发

### 免责声明
本技能提供的分析结果与生成内容仅供参考，使用者应自行判断并承担操作与投资风险。

### 依赖环境与配置
- **运行时**: Python 3.10+ / Node.js 18+
- **依赖扩展包**: \`requests\`, \`pydantic\`, \`pdf-parser\`
- **网络权限**: 需允许访问外部规范 API 接口

### 核心模块与功能清单
| 模块名称 | 核心功能说明 | 文档 / 调用路径 |
| :--- | :--- | :--- |
| **数据提取模块** | 自动从原始文档中解析结构化财务与业务指标 | \`modules/parser.py\` |
| **规则检验引擎** | 五步护城河与多维健康检查逻辑 | \`modules/check_engine.py\` |
| **研报输出器** | 格式化 Markdown 与数据图表组装 | \`modules/report.py\` |
`;

interface MarkdownEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  theme?: 'light' | 'dark';
  templatePrompt?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  placeholder = '在此输入 Markdown 格式的详细概述内容...',
  minHeight = '280px',
  theme = 'light',
  templatePrompt = '填入标准概述模板'
}) => {
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [copiedTemplate, setCopiedTemplate] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === 'dark';

  const insertSyntax = (prefix: string, suffix: string = '', defaultPlaceholder: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + prefix + defaultPlaceholder + suffix);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    const textToInsert = selectedText || defaultPlaceholder;
    const replacement = prefix + textToInsert + suffix;

    const newValue = value.substring(0, start) + replacement + value.substring(end);
    onChange(newValue);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + prefix.length + textToInsert.length;
      textarea.setSelectionRange(start + prefix.length, newCursorPos);
    }, 10);
  };

  const handleApplyTemplate = () => {
    if (value.trim() && !window.confirm('当前编辑器已有内容，覆盖为标准模板吗？')) {
      return;
    }
    onChange(DEFAULT_SKILL_OVERVIEW_TEMPLATE);
    setCopiedTemplate(true);
    setTimeout(() => setCopiedTemplate(false), 2000);
  };

  return (
    <div className={`rounded-2xl border transition overflow-hidden shadow-2xs ${
      isDark
        ? 'bg-slate-950 border-slate-800'
        : 'bg-white border-slate-200'
    }`}>
      {/* Editor Top Bar: Tabs & Template Button */}
      <div className={`flex flex-wrap items-center justify-between gap-2 px-3 py-2 border-b ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-slate-50/90 border-slate-200'
      }`}>
        {/* Left: Write / Preview Switch */}
        <div className={`inline-flex items-center p-0.5 rounded-lg text-xs font-bold ${
          isDark ? 'bg-slate-950 border border-slate-800' : 'bg-slate-200/70'
        }`}>
          <button
            type="button"
            onClick={() => setActiveTab('write')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'write'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white text-indigo-600 shadow-2xs'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>编辑 (Markdown)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1 rounded-md transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'preview'
                ? isDark
                  ? 'bg-slate-800 text-white shadow-2xs'
                  : 'bg-white text-indigo-600 shadow-2xs'
                : isDark
                  ? 'text-slate-400 hover:text-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>渲染预览</span>
          </button>
        </div>

        {/* Right: Quick Template & Status */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleApplyTemplate}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition cursor-pointer flex items-center gap-1 border ${
              isDark
                ? 'bg-indigo-950/50 hover:bg-indigo-900/60 text-indigo-300 border-indigo-800/80'
                : 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border-indigo-200'
            }`}
            title="填充标准概述内容模板（包含知识产权、使用许可、依赖与模块说明）"
          >
            {copiedTemplate ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500">已应用模板</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span>{templatePrompt}</span>
              </>
            )}
          </button>
          <span className={`text-[10px] font-mono hidden sm:inline ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            {value.length} 字符
          </span>
        </div>
      </div>

      {/* Toolbar (Visible in 'write' mode) */}
      {activeTab === 'write' && (
        <div className={`flex flex-wrap items-center gap-1 px-3 py-1.5 border-b text-xs ${
          isDark ? 'bg-slate-950/70 border-slate-800/80' : 'bg-slate-100/70 border-slate-200/80'
        }`}>
          <button
            type="button"
            onClick={() => insertSyntax('**', '**', '加粗文字')}
            title="加粗 (Ctrl+B)"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Bold className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('*', '*', '斜体文字')}
            title="斜体 (Ctrl+I)"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Italic className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('## ', '', '二级标题')}
            title="二级标题"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Heading2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('### ', '', '三级标题')}
            title="三级标题"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Heading3 className="w-3.5 h-3.5" />
          </button>

          <span className={`w-px h-3.5 mx-1 ${isDark ? 'bg-slate-800' : 'bg-slate-300'}`} />

          <button
            type="button"
            onClick={() => insertSyntax('```python\n# 核心函数实现\n', '\n```\n', 'def run():\n    pass')}
            title="代码块"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Code className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('> ', '', '重点引用声明内容')}
            title="引用块"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Quote className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('- ', '', '列表项')}
            title="无序列表"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('1. ', '', '有序步骤')}
            title="有序列表"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('| 列1 | 列2 | 说明 |\n| :--- | :--- | :--- |\n| 数据A | 数据B | ', ' |\n', '示例')}
            title="插入表格"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => insertSyntax('[链接文本](', 'https://example.com)', '点击访问')}
            title="超链接"
            className={`p-1.5 rounded transition cursor-pointer ${
              isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-700'
            }`}
          >
            <LinkIcon className="w-3.5 h-3.5" />
          </button>

          <span className={`text-[10px] font-medium ml-auto pr-1 hidden md:inline ${
            isDark ? 'text-slate-500' : 'text-slate-400'
          }`}>
            支持标准 Markdown 与 GFM 表格
          </span>
        </div>
      )}

      {/* Editor Main Content: Textarea or Live Markdown Preview */}
      {activeTab === 'write' ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          style={{ minHeight }}
          className={`w-full p-4 text-xs font-mono leading-relaxed transition focus:outline-hidden resize-y ${
            isDark
              ? 'bg-slate-950 text-slate-100 placeholder:text-slate-600 focus:bg-slate-900/60'
              : 'bg-slate-50/40 text-slate-900 placeholder:text-slate-400 focus:bg-white'
          }`}
        />
      ) : (
        <div
          style={{ minHeight }}
          className={`p-6 text-xs leading-relaxed overflow-y-auto max-h-[500px] ${
            isDark
              ? 'bg-slate-950 text-slate-200 prose prose-invert prose-xs max-w-none'
              : 'bg-white text-slate-800 prose prose-slate prose-xs max-w-none'
          }`}
        >
          {value.trim() ? (
            <Markdown>{value}</Markdown>
          ) : (
            <div className={`py-12 text-center italic text-xs ${
              isDark ? 'text-slate-600' : 'text-slate-400'
            }`}>
              暂无概述内容，请切换到「编辑」选项卡开始书写或点击右上角「{templatePrompt}」。
            </div>
          )}
        </div>
      )}
    </div>
  );
};
