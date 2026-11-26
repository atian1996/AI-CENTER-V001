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
  theme?: 'light' | 'dark' | 'minimal';
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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isDark = theme === 'dark';
  const isMinimal = theme === 'minimal';

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

  if (isMinimal) {
    return (
      <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] focus-within:border-[#1A1A1A] transition-colors overflow-hidden">
        {/* Top Bar: Minimalist Text Tabs + Character Count */}
        <div className="flex items-center justify-between gap-3 px-3.5 py-2.5 bg-[#FFFFFF] border-b border-[#EAEAEA]">
          <div className="flex items-center gap-4 text-[13px]">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`pb-0.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'write'
                  ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                  : 'border-transparent text-[#999999] hover:text-[#1A1A1A] font-normal'
              }`}
            >
              编辑 (Markdown)
            </button>
            <span className="text-[#EAEAEA] select-none">|</span>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`pb-0.5 border-b-2 transition-colors cursor-pointer ${
                activeTab === 'preview'
                  ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                  : 'border-transparent text-[#999999] hover:text-[#1A1A1A] font-normal'
              }`}
            >
              实时预览
            </button>
          </div>

          <span className="text-[11px] font-mono text-[#999999] tabular-nums">
            {value.length} 字符
          </span>
        </div>

        {/* Pure White Toolbar with Monochrome Thin-Stroke Black Icons */}
        {activeTab === 'write' && (
          <div className="flex flex-wrap items-center gap-1 px-3 py-2 bg-[#FFFFFF] border-b border-[#EAEAEA]">
            <button
              type="button"
              onClick={() => insertSyntax('**', '**', '加粗文字')}
              title="加粗"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <Bold className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('*', '*', '斜体文字')}
              title="斜体"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <Italic className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('## ', '', '二级标题')}
              title="二级标题"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <Heading2 className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('### ', '', '三级标题')}
              title="三级标题"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <Heading3 className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>

            <span className="w-px h-3.5 bg-[#EAEAEA] mx-1" />

            <button
              type="button"
              onClick={() =>
                insertSyntax('```python\n# 核心函数实现\n', '\n```\n', 'def run():\n    pass')
              }
              title="代码块"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <Code className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('> ', '', '引用内容')}
              title="引用块"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <Quote className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('- ', '', '列表项')}
              title="无序列表"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <List className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('1. ', '', '有序步骤')}
              title="有序列表"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <ListOrdered className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() =>
                insertSyntax(
                  '| 列1 | 列2 | 说明 |\n| :--- | :--- | :--- |\n| 数据A | 数据B | ',
                  ' |\n',
                  '示例'
                )
              }
              title="插入表格"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <Table className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
            <button
              type="button"
              onClick={() => insertSyntax('[链接文本](', 'https://example.com)', '点击访问')}
              title="超链接"
              className="p-1.5 rounded-[4px] text-[#1A1A1A] hover:bg-[#F5F5F5] transition-colors cursor-pointer"
            >
              <LinkIcon className="w-3.5 h-3.5" strokeWidth={1.6} />
            </button>
          </div>
        )}

        {/* Pure White Input / Preview Surface */}
        {activeTab === 'write' ? (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ minHeight }}
            className="w-full p-4 bg-[#FFFFFF] border-0 text-[13px] font-mono text-[#1A1A1A] placeholder:text-[#999999] leading-relaxed outline-none resize-y"
          />
        ) : (
          <div
            style={{ minHeight }}
            className="p-5 bg-[#FFFFFF] text-[14px] text-[#1A1A1A] leading-relaxed overflow-y-auto max-h-[500px] prose prose-slate max-w-none"
          >
            {value.trim() ? (
              <Markdown>{value}</Markdown>
            ) : (
              <div className="py-12 text-center text-[13px] text-[#999999]">
                暂无内容，请切换至「编辑 (Markdown)」开始书写。
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

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

        {/* Right: Status */}
        <div className="flex items-center gap-2">
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
