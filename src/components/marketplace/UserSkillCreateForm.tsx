import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MarkdownEditor, DEFAULT_SKILL_OVERVIEW_TEMPLATE } from '../common/MarkdownEditor';
import {
  ArrowLeft,
  Sparkles,
  Zap,
  Terminal,
  FileText,
  BarChart3,
  Code2,
  BookOpen,
  Bot,
  Palette,
  FileArchive,
  Check,
  X
} from 'lucide-react';

interface UserSkillCreateFormProps {
  onBack: () => void;
  fromTitle?: string;
}

export const UserSkillCreateForm: React.FC<UserSkillCreateFormProps> = ({ onBack }) => {
  const { submitSkillForApproval, showToast, user } = useApp();

  // Form states (功能字段与校验逻辑完全保持不变)
  const [slug, setSlug] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [category, setCategory] = useState('知识管理');
  const [iconType, setIconType] = useState<'preset' | 'custom'>('preset');
  const [selectedPresetIcon, setSelectedPresetIcon] = useState('Zap');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [description, setDescription] = useState('');

  // Tags (最多 5 个)
  const [tags, setTags] = useState<string[]>(['知识管理', '自动化']);
  const [tagInput, setTagInput] = useState('');

  // 概述 (Markdown 编辑器)
  const [overviewMarkdown, setOverviewMarkdown] = useState(DEFAULT_SKILL_OVERVIEW_TEMPLATE);

  // File package state
  const [fileUploaded, setFileUploaded] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [isDragging, setIsDragging] = useState(false);

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

  // 所有预设图标彻底去除彩色，统一为纯灰 (#999999) / 选中纯黑 (#1A1A1A) 线框图标
  const presetIcons = [
    { name: 'Zap', label: '闪电/通用', Icon: Zap },
    { name: 'Terminal', label: '终端/代码', Icon: Terminal },
    { name: 'FileText', label: '文档/知识', Icon: FileText },
    { name: 'BarChart3', label: '图表/数据', Icon: BarChart3 },
    { name: 'Code2', label: '开发/云端', Icon: Code2 },
    { name: 'BookOpen', label: '阅读/研报', Icon: BookOpen },
    { name: 'Sparkles', label: '智能/AI', Icon: Sparkles },
    { name: 'Bot', label: 'Agent机器人', Icon: Bot },
    { name: 'Palette', label: '设计/多媒体', Icon: Palette }
  ];

  // File refs
  const folderInputRef = useRef<HTMLInputElement>(null);
  const zipInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const handleFolderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const folderName = files[0].webkitRelativePath.split('/')[0] || 'selected-folder';
      setFileUploaded(true);
      setUploadedFileName(`${folderName}/ (包含 ${files.length} 个文件，已解析 SKILL.md)`);
      showToast(`文件夹【${folderName}】已成功选择并解析！`);
      if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileUploaded(true);
      setUploadedFileName(`${file.name} (${sizeMB} MB)`);
      showToast(`ZIP/压缩包【${file.name}】选择成功！校验 SKILL.md 结构无误。`);
      if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
      setFileUploaded(true);
      setUploadedFileName(`${file.name} (${sizeMB} MB)`);
      showToast(`文件【${file.name}】拖拽上传成功！`);
      if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      const url = URL.createObjectURL(file);
      setCustomIconUrl(url);
      showToast(`图片【${file.name}】上传成功！`);
    }
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

    setTags((prev) => [...prev, rawTag]);
    if (tagToAdd === undefined) {
      setTagInput('');
    }
  };

  const handleRemoveTag = (indexToRemove: number) => {
    setTags((prev) => prev.filter((_, idx) => idx !== indexToRemove));
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
    <div className="w-full max-w-4xl mx-auto pt-2 pb-24 select-none animate-fade-in text-[#1A1A1A] antialiased">
      {/* 1. 顶部 Header 区：去掉大卡片，与发布新需求任务页、发布新动态页排版保持一致 */}
      <header className="pb-6 border-b border-[#EAEAEA]">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[13px] text-[#666666] hover:text-[#000000] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.6} />
          <span>返回</span>
        </button>

        <div className="mt-5 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <h1 className="text-[24px] font-bold text-[#000000] tracking-[-0.02em] leading-tight">
            创建 Skill
          </h1>
          <span className="text-[12px] text-[#888888] font-normal">应用规范保持一致</span>
        </div>
      </header>

      {/* 主表单：纯白极简黑白灰风格 */}
      <form onSubmit={handleSubmit} className="pt-8 space-y-8">
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

        {/* 1. 上传 ZIP 压缩包：浅灰虚线框 + 纯黑线条图标 + 中灰文字 */}
        <div className="space-y-2.5">
          <label className="block text-[13px] font-medium text-[#1A1A1A]">
            选择 ZIP 压缩包 <span className="text-[#999999]">*</span>
          </label>
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={handleTriggerZipSelect}
            className={`w-full px-6 py-7 rounded-[6px] border border-dashed bg-[#FFFFFF] transition-colors cursor-pointer flex items-center gap-4 ${
              isDragging
                ? 'border-[#1A1A1A]'
                : 'border-[#EAEAEA] hover:border-[#1A1A1A]'
            }`}
          >
            <FileArchive className="w-7 h-7 text-[#1A1A1A] shrink-0" strokeWidth={1.5} />
            <div className="flex-1 min-w-0">
              <div className="text-[14px] font-medium text-[#1A1A1A]">
                选择 ZIP / 压缩包
                <span className="ml-2 text-[12px] text-[#999999] font-normal">推荐</span>
              </div>
              <div className="text-[13px] text-[#777777] mt-1">
                自动解压并校验 SKILL.md 结构，支持点击选择或直接拖拽 ZIP 文件到此处
              </div>
            </div>
          </div>

          {errors.file && <p className="text-[12px] text-[#1A1A1A]">{errors.file}</p>}

          {fileUploaded && (
            <div className="px-4 py-3 rounded-[6px] bg-[#FFFFFF] border border-[#EAEAEA] text-[13px] text-[#1A1A1A] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 min-w-0">
                <Check className="w-4 h-4 text-[#1A1A1A] shrink-0" strokeWidth={1.8} />
                <span className="font-mono truncate">{uploadedFileName}</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFileUploaded(false);
                  setUploadedFileName('');
                }}
                className="text-[12px] text-[#666666] hover:text-[#1A1A1A] underline underline-offset-4 transition-colors cursor-pointer shrink-0"
              >
                重新选择
              </button>
            </div>
          )}
        </div>

        {/* 2. Slug 与 显示名称 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#1A1A1A]">
              Slug <span className="text-[#999999]">*</span>
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => {
                setSlug(e.target.value);
                if (errors.slug) setErrors((prev) => ({ ...prev, slug: '' }));
              }}
              placeholder="唯一标识符，仅允许小写字母、数字和连字符"
              className={`w-full px-3.5 py-2.5 rounded-[6px] border bg-[#FFFFFF] text-[14px] font-mono text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors ${
                errors.slug ? 'border-[#1A1A1A]' : 'border-[#EAEAEA] focus:border-[#1A1A1A]'
              }`}
            />
            {errors.slug && <p className="text-[12px] text-[#1A1A1A]">{errors.slug}</p>}
          </div>

          <div className="space-y-2">
            <label className="block text-[13px] font-medium text-[#1A1A1A]">
              显示名称 <span className="text-[#999999]">*</span>
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => {
                setDisplayName(e.target.value);
                if (errors.displayName) setErrors((prev) => ({ ...prev, displayName: '' }));
              }}
              placeholder="请输入 Skill 显示名称"
              className={`w-full px-3.5 py-2.5 rounded-[6px] border bg-[#FFFFFF] text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors ${
                errors.displayName ? 'border-[#1A1A1A]' : 'border-[#EAEAEA] focus:border-[#1A1A1A]'
              }`}
            />
            {errors.displayName && (
              <p className="text-[12px] text-[#1A1A1A]">{errors.displayName}</p>
            )}
          </div>
        </div>

        {/* 3. 场景分类 */}
        <div className="space-y-2.5">
          <label className="block text-[13px] font-medium text-[#1A1A1A]">
            场景分类 <span className="text-[#999999]">*</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {categoriesList.map((catItem) => {
              const isSelected = category === catItem;
              return (
                <button
                  type="button"
                  key={catItem}
                  onClick={() => setCategory(catItem)}
                  className={`px-3.5 py-1.5 rounded-[6px] border text-[13px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#FFFFFF]'
                      : 'bg-transparent border-[#EAEAEA] text-[#555555] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                  }`}
                >
                  {catItem}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. 图标选择区：彻底消灭彩色，全部纯灰 (#999) 线框图标，选中态 2px 纯黑外边框 + 纯黑图标 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-[13px] font-medium text-[#1A1A1A]">图标</label>

            <div className="flex items-center gap-4 text-[13px]">
              <button
                type="button"
                onClick={() => setIconType('preset')}
                className={`pb-0.5 border-b-2 transition-colors cursor-pointer ${
                  iconType === 'preset'
                    ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                    : 'border-transparent text-[#999999] hover:text-[#1A1A1A] font-normal'
                }`}
              >
                预设图标
              </button>
              <span className="text-[#EAEAEA] select-none">|</span>
              <button
                type="button"
                onClick={() => setIconType('custom')}
                className={`pb-0.5 border-b-2 transition-colors cursor-pointer ${
                  iconType === 'custom'
                    ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold'
                    : 'border-transparent text-[#999999] hover:text-[#1A1A1A] font-normal'
                }`}
              >
                自定义
              </button>
            </div>
          </div>

          {iconType === 'preset' ? (
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2.5">
              {presetIcons.map((item) => {
                const isSel = selectedPresetIcon === item.name;
                const IconComponent = item.Icon;
                return (
                  <button
                    type="button"
                    key={item.name}
                    onClick={() => setSelectedPresetIcon(item.name)}
                    className={`p-3.5 rounded-[6px] bg-[#FFFFFF] flex flex-col items-center justify-center gap-2 transition-colors cursor-pointer ${
                      isSel
                        ? 'border-2 border-[#1A1A1A] text-[#1A1A1A]'
                        : 'border border-[#EAEAEA] text-[#999999] hover:border-[#CCCCCC] hover:text-[#666666]'
                    }`}
                  >
                    <IconComponent
                      className={`w-5 h-5 ${isSel ? 'text-[#1A1A1A]' : 'text-[#999999]'}`}
                      strokeWidth={1.6}
                    />
                    <span
                      className={`text-[12px] ${
                        isSel ? 'text-[#1A1A1A] font-medium' : 'text-[#777777] font-normal'
                      }`}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleTriggerImageSelect}
                  className="h-[38px] px-4 rounded-[6px] bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#1A1A1A] text-[#1A1A1A] text-[13px] font-medium transition-colors cursor-pointer"
                >
                  点击上传图片
                </button>
                {customIconUrl && (
                  <img
                    src={customIconUrl}
                    alt="Icon Preview"
                    className="w-10 h-10 rounded-[6px] border border-[#EAEAEA] object-cover"
                  />
                )}
              </div>
              <p className="text-[12px] text-[#888888]">
                支持 jpg / png / webp，最大 5MB；上传后需经过合规审核。
              </p>
            </div>
          )}
        </div>

        {/* 5. 描述 */}
        <div className="space-y-2">
          <label className="block text-[13px] font-medium text-[#1A1A1A]">描述</label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="请输入 Skill 描述，将展示在插件卡片与详情页顶部简介处"
            className="w-full px-3.5 py-2.5 rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none focus:border-[#1A1A1A] transition-colors resize-none leading-relaxed"
          />
        </div>

        {/* 6. 标签与快捷添加区：已添加纯黑底白字带 ×，快捷添加纯中灰文字链悬浮变黑加下划线 */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-medium text-[#1A1A1A]">
              Skill 标签
              <span className="text-[12px] font-normal text-[#999999] ml-2 font-mono">
                最多 5 个（{tags.length}/5）
              </span>
            </label>
            {tags.length >= 5 && (
              <span className="text-[12px] text-[#666666]">已达上限 5 个</span>
            )}
          </div>

          {tags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[4px] bg-[#1A1A1A] text-[#FFFFFF] text-[12px] font-medium"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(idx)}
                    className="text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label={`移除标签 ${tag}`}
                  >
                    <X className="w-3 h-3" strokeWidth={1.8} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {tags.length < 5 && (
            <div className="flex items-center gap-2.5">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                placeholder="输入自定义标签名称后按回车或点击添加（如：投资研究、数据清洗）"
                className="flex-1 px-3.5 py-2.5 rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] text-[13px] text-[#1A1A1A] placeholder:text-[#999999] outline-none focus:border-[#1A1A1A] transition-colors"
              />
              <button
                type="button"
                onClick={() => handleAddTag()}
                className="h-[40px] px-4 rounded-[6px] bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#1A1A1A] text-[#1A1A1A] text-[13px] font-medium transition-colors cursor-pointer shrink-0"
              >
                添加标签
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 pt-0.5 text-[12px]">
            <span className="text-[#999999]">快捷添加：</span>
            {['金融分析', '行业专业', '代码审查', '多维表格', '自动化', '办公效率', '知识管理', '研报生成']
              .filter((t) => !tags.includes(t))
              .slice(0, 6)
              .map((suggested) => (
                <button
                  key={suggested}
                  type="button"
                  disabled={tags.length >= 5}
                  onClick={() => handleAddTag(suggested)}
                  className="text-[#777777] hover:text-[#1A1A1A] hover:underline underline-offset-4 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {suggested}
                </button>
              ))}
          </div>
        </div>

        {/* 7. 概述 (纯白背景 + 1px 浅灰边框 Markdown 编辑器) */}
        <div className="space-y-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <label className="text-[13px] font-medium text-[#1A1A1A]">
              Skill 概述
              <span className="text-[12px] font-normal text-[#999999] ml-2">
                对应前台 Skill 详情页【概述】选项卡中渲染的内容
              </span>
            </label>
          </div>

          <MarkdownEditor
            value={overviewMarkdown}
            onChange={setOverviewMarkdown}
            theme="minimal"
            placeholder="在此以 Markdown 格式编写 Skill 插件详细概述（知识产权、使用许可、免责声明、架构及核心模块说明）..."
          />
        </div>

        {/* 底部操作栏：左侧取消（白底黑字无边框），右侧提交创建（纯黑底白字） */}
        <div className="pt-7 border-t border-[#EAEAEA] flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="h-[42px] px-2 bg-[#FFFFFF] border-0 text-[#1A1A1A] hover:opacity-65 text-[13px] font-medium transition-opacity cursor-pointer"
          >
            取消返回
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="h-[42px] px-8 rounded-[6px] bg-[#1A1A1A] hover:bg-[#333333] text-[#FFFFFF] text-[13px] font-medium transition-colors cursor-pointer disabled:opacity-50"
          >
            {submitting ? '提交中...' : '提交创建'}
          </button>
        </div>
      </form>
    </div>
  );
};
