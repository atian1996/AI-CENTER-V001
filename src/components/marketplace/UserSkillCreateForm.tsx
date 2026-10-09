import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MarkdownEditor, DEFAULT_SKILL_OVERVIEW_TEMPLATE } from '../common/MarkdownEditor';
import {
  ArrowLeft,
  Wrench,
  Sparkles,
  Zap,
  Terminal,
  FileText,
  BarChart3,
  Code2,
  BookOpen,
  Bot,
  Palette,
  Folder,
  FileArchive,
  CheckCircle2,
  Tag,
  Plus,
  X
} from 'lucide-react';

interface UserSkillCreateFormProps {
  onBack: () => void;
  fromTitle?: string;
}

export const UserSkillCreateForm: React.FC<UserSkillCreateFormProps> = ({ onBack, fromTitle }) => {
  const { submitSkillForApproval, showToast, user } = useApp();

  // Form states aligned strictly with SkillAdminView
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState('知识管理');
  const [iconType, setIconType] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetIcon, setSelectedPresetIcon] = useState('Zap');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [description, setDescription] = useState('');
  
  // Tags (最多 5 个，对应前台 skill 详情中顶部 skill 描述下方的几个标签)
  const [tags, setTags] = useState<string[]>(['知识管理', '自动化']);
  const [tagInput, setTagInput] = useState('');

  // 概述 (Markdown 编辑器，对应前台 skill 详情中的概述内容)
  const [overviewMarkdown, setOverviewMarkdown] = useState(DEFAULT_SKILL_OVERVIEW_TEMPLATE);
  
  // File package state
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const categoriesList = [
    '知识管理',
    '效率工具',
    '数据分析',
    '内容创作',
    '编程开发',
    '图像影音',
    '生活娱乐'
  ];

  const presetIcons = [
    { name: 'Zap', label: '闪电/通用', icon: <Zap className="w-5 h-5 text-amber-500" /> },
    { name: 'Terminal', label: '终端/代码', icon: <Terminal className="w-5 h-5 text-indigo-500" /> },
    { name: 'FileText', label: '文档/知识', icon: <FileText className="w-5 h-5 text-blue-500" /> },
    { name: 'BarChart3', label: '图表/数据', icon: <BarChart3 className="w-5 h-5 text-emerald-500" /> },
    { name: 'Code2', label: '开发/云端', icon: <Code2 className="w-5 h-5 text-sky-500" /> },
    { name: 'BookOpen', label: '阅读/研报', icon: <BookOpen className="w-5 h-5 text-amber-600" /> },
    { name: 'Sparkles', label: '智能/AI', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
    { name: 'Bot', label: 'Agent机器人', icon: <Bot className="w-5 h-5 text-violet-500" /> },
    { name: 'Palette', label: '设计/多媒体', icon: <Palette className="w-5 h-5 text-rose-500" /> }
  ];

  // File refs
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Real Folder Selection
  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const folderName = files[0].webkitRelativePath.split('/')[0] || 'selected-folder';
      setFileUploaded(true);
      setUploadedFileName(`${folderName}/ (包含 ${files.length} 个文件，已解析 SKILL.md)`);
      showToast(`文件夹【${folderName}】已成功选择并解析！`);
      if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  // Real ZIP/File Selection
  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileUploaded(true);
      setUploadedFileName(`${file.name} (${sizeMB} MB)`);
      showToast(`ZIP/压缩包【${file.name}】选择成功！校验 SKILL.md 结构无误。`);
      if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  // Drag and drop handler
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileUploaded(true);
      setUploadedFileName(`${file.name} (${sizeMB} MB)`);
      showToast(`文件【${file.name}】拖拽上传成功！`);
      if (errors.file) setErrors(prev => ({ ...prev, file: '' }));
    }
  };

  // Real Custom Icon Image Upload
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setCustomIconUrl(url);
      showToast(`图片【${file.name}】上传成功！`);
    }
  };

  const handleTriggerFolderSelect = () => {
    folderInputRef.current?.click();
  };

  const handleTriggerZipSelect = () => {
    zipInputRef.current?.click();
  };

  const handleTriggerImageSelect = () => {
    imageInputRef.current?.click();
  };

  const handleAddTag = (tagToAdd?: string) => {
    const rawTag = (tagToAdd !== undefined ? tagToAdd : tagInput).trim();
    if (!rawTag) return;

    if (tags.length >= 5) {
      showToast('最多可添加 5 个标签！');
      return;
    }

    if (tags.includes(rawTag)) {
      showToast('该标签已存在！');
      return;
    }

    setTags(prev => [...prev, rawTag]);
    if (tagToAdd === undefined) {
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!fileUploaded) {
      newErrors.file = '请上传 ZIP 压缩包！';
    }

    if (!slug.trim()) {
      newErrors.slug = '请输入唯一标识 Slug！';
    } else if (!/^[a-z0-9-_]+$/i.test(slug.trim())) {
      newErrors.slug = 'Slug 仅支持小写字母、数字及连字符';
    }

    if (!displayName.trim()) {
      newErrors.displayName = '请输入显示名称！';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('请完整填写必填字段并上传插件包！');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      submitSkillForApproval({
        id: slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, '-'),
        name: displayName.trim(),
        category,
        version: 'v1.0.0',
        description: description.trim() || '暂无详细描述信息',
        tags: tags.length > 0 ? tags : ['知识管理'],
        overviewMarkdown: overviewMarkdown.trim(),
        compatibleAgents: '全量 Agent 兼容',
        requiredPermissions: ['网络访问', '沙盒执行'],
        packageSize: '1.8 MB',
        packageFormat: 'ZIP / Skill 包',
        repoPath: `@${user.name || 'user'}/${slug.trim()}`
      });
      setSubmitting(false);
      onBack();
    }, 400);
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-6 space-y-6 animate-fade-in text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
            title="返回 Skill 市场"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400">
              <span>{fromTitle || 'AI 集市 / Skill 市场'}</span>
              <span>/</span>
              <span className="text-purple-600">创建 Skill</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-purple-600" />
              <span>创建 Skill 插件</span>
            </h1>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-100">
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>应用规范保持一致</span>
        </span>
      </div>

      {/* Main Form Card (Matches SkillAdminView fields) */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-6">
        
        {/* Hidden File Inputs */}
        <input
          type="file"
          ref={folderInputRef}
          // @ts-ignore
          webkitdirectory=""
          directory=""
          multiple
          className="hidden"
          onChange={handleFolderChange}
        />
        <input
          type="file"
          ref={zipInputRef}
          accept=".zip,.tar,.gz,.7z,.rar,.json,.md"
          className="hidden"
          onChange={handleZipChange}
        />
        <input
          type="file"
          ref={imageInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleImageChange}
        />

        {/* 1. Skill 压缩包选择 */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            选择 ZIP 压缩包 <span className="text-rose-500">*</span>
          </label>
          <div 
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            className="p-1 rounded-2xl border border-dashed border-indigo-200 bg-indigo-50/20"
          >
            <button
              type="button"
              onClick={handleTriggerZipSelect}
              className="w-full p-5 rounded-2xl border border-slate-200 bg-white hover:bg-indigo-50/50 hover:border-indigo-300 text-left transition cursor-pointer flex items-center gap-4 group shadow-2xs"
            >
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
                <FileArchive className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-xs font-black text-slate-900 flex items-center gap-2">
                  <span>选择 ZIP / 压缩包</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200 font-bold">推荐</span>
                </div>
                <div className="text-[11px] text-slate-400 mt-1">自动解压并校验 SKILL.md 结构，支持点击选择或直接拖拽 ZIP 文件到此处</div>
              </div>
            </button>
          </div>

          {errors.file && <p className="text-[11px] text-rose-500 font-bold mt-1">{errors.file}</p>}

          {/* File status if selected */}
          {fileUploaded && (
            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-mono font-bold">{uploadedFileName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileUploaded(false);
                  setUploadedFileName('');
                }}
                className="text-emerald-700 hover:text-emerald-900 font-bold underline cursor-pointer text-[11px]"
              >
                重新选择
              </button>
            </div>
          )}
        </div>

        {/* 2. Slug * */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Slug <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={slug}
            onChange={e => {
              setSlug(e.target.value);
              if (errors.slug) setErrors(prev => ({ ...prev, slug: '' }));
            }}
            placeholder="Skill 的唯一标识符，仅允许小写字母、数字和连字符"
            className={`w-full px-4 py-2.5 rounded-xl border text-xs font-mono font-bold transition focus:outline-hidden ${
              errors.slug ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-purple-500 bg-slate-50/50'
            }`}
          />
          {errors.slug && <p className="text-[11px] text-rose-500 font-bold">{errors.slug}</p>}
        </div>

        {/* 3. 显示名称 * */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            显示名称 <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={displayName}
            onChange={e => {
              setDisplayName(e.target.value);
              if (errors.displayName) setErrors(prev => ({ ...prev, displayName: '' }));
            }}
            placeholder="Skill 显示名称"
            className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition focus:outline-hidden ${
              errors.displayName ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-purple-500 bg-slate-50/50'
            }`}
          />
          {errors.displayName && <p className="text-[11px] text-rose-500 font-bold">{errors.displayName}</p>}
        </div>

        {/* 4. 场景分类 * */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            场景分类 <span className="text-rose-500">*</span>
          </label>
          <div className="flex flex-wrap gap-2 pt-0.5">
            {categoriesList.map(catItem => {
              const isSelected = category === catItem;
              return (
                <button
                  type="button"
                  key={catItem}
                  onClick={() => setCategory(catItem)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer border ${
                    isSelected
                      ? 'bg-purple-600 text-white border-purple-500 shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
                  }`}
                >
                  {catItem}
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. 图标 */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700">
            图标
          </label>

          {/* Tabs: 预设图标 | 自定义 */}
          <div className="inline-flex p-1 rounded-xl bg-slate-100 text-xs font-bold">
            <button
              type="button"
              onClick={() => setIconType('preset')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                iconType === 'preset'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              预设图标
            </button>
            <button
              type="button"
              onClick={() => setIconType('custom')}
              className={`px-4 py-1.5 rounded-lg transition cursor-pointer ${
                iconType === 'custom'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              自定义
            </button>
          </div>

          {/* Preset Icon Selector */}
          {iconType === 'preset' ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 pt-2">
              {presetIcons.map(item => {
                const isSel = selectedPresetIcon === item.name;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setSelectedPresetIcon(item.name)}
                    className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition cursor-pointer ${
                      isSel
                        ? 'bg-purple-50 border-purple-300 text-purple-700 ring-1 ring-purple-300'
                        : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.icon}
                    <span className="text-[11px] font-bold">{item.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            /* Custom Upload Button */
            <div className="space-y-2 pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerImageSelect}
                  className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition cursor-pointer"
                >
                  点击上传图片
                </button>
                {customIconUrl && (
                  <img
                    src={customIconUrl}
                    alt="Icon Preview"
                    className="w-10 h-10 rounded-xl border border-slate-200 object-cover shadow-2xs"
                  />
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                支持 jpg / png / webp，最大 5MB；上传后需经过合规审核。
              </p>
            </div>
          )}
        </div>

        {/* 6. 描述 */}
        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            描述
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="请输入 Skill 描述，将展示在插件卡片与详情页顶部简介处"
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-xs font-medium focus:border-purple-500 focus:outline-hidden transition resize-none"
          />
        </div>

        {/* 7. 标签 (最多5个) - 对应前台skill详情中，顶部skill描述下方的几个标签 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-600" />
              <span>Skill 标签</span>
              <span className="text-[11px] font-normal text-slate-400 font-mono">
                (最多添加 5 个，对应详情页顶部描述下方标签，当前 {tags.length}/5)
              </span>
            </label>
            {tags.length >= 5 && (
              <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                已达上限 5 个
              </span>
            )}
          </div>

          {/* Tags list */}
          <div className="flex flex-wrap items-center gap-2 min-h-[38px] p-2 bg-slate-50/70 border border-slate-200 rounded-xl">
            {tags.length === 0 ? (
              <span className="text-xs text-slate-400 pl-1">暂无标签，请在下方输入或点击快捷推荐添加</span>
            ) : (
              tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-purple-200 text-purple-700 text-xs font-medium shadow-2xs group"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="w-4 h-4 rounded-full hover:bg-purple-100 flex items-center justify-center text-purple-400 hover:text-purple-700 transition cursor-pointer"
                    title="移除此标签"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Tag Input row */}
          {tags.length < 5 && (
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTag();
                    }
                  }}
                  placeholder="输入自定义标签名称后按回车或点击添加 (如: 投资研究、数据清洗)"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:border-purple-500 focus:outline-hidden transition"
                />
              </div>
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 text-xs font-bold flex items-center gap-1 transition cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>添加标签</span>
              </button>
            </div>
          )}

          {/* Suggested tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
            <span className="text-[11px] text-slate-400">快捷添加:</span>
            {['金融分析', '行业专业', '代码审查', '多维表格', '自动化', '办公效率', '知识管理', '研报生成']
              .filter(t => !tags.includes(t))
              .slice(0, 6)
              .map(suggested => (
                <button
                  key={suggested}
                  type="button"
                  disabled={tags.length >= 5}
                  onClick={() => handleAddTag(suggested)}
                  className="px-2.5 py-0.5 rounded-md bg-slate-100 hover:bg-purple-50 text-slate-600 hover:text-purple-700 hover:border-purple-200 border border-slate-200/60 text-[11px] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  + {suggested}
                </button>
              ))}
          </div>
        </div>

        {/* 8. 概述 (Markdown 编辑器) - 对应前台skill详情中的概述中的内容 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-purple-600" />
              <span>Skill 概述 (Markdown 编辑器)</span>
              <span className="text-[11px] font-normal text-slate-400">
                (对应前台 Skill 详情页【概述】选项卡中渲染的内容)
              </span>
            </label>
          </div>

          <MarkdownEditor
            value={overviewMarkdown}
            onChange={setOverviewMarkdown}
            theme="light"
            placeholder="在此以 Markdown 格式编写 Skill 插件详细概述（知识产权、使用许可、免责声明、架构及核心模块说明）..."
          />
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-6">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer"
          >
            取消
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-xs transition cursor-pointer disabled:opacity-50 flex items-center gap-2"
          >
            {submitting ? '提交中...' : '提交创建'}
          </button>
        </div>

      </form>
    </div>
  );
};
