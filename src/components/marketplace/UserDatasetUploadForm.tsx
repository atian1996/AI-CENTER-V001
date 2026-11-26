import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { MarkdownEditor } from '../common/MarkdownEditor';
import { ArrowLeft, Upload, Database, FileArchive } from 'lucide-react';

interface UserDatasetUploadFormProps {
  onBack: () => void;
  fromTitle?: string;
}

export const UserDatasetUploadForm: React.FC<UserDatasetUploadFormProps> = ({
  onBack
}) => {
  const { datasetTagDimensions, submitDatasetForApproval, showToast, user } = useApp();

  // Form Fields (功能字段完全不变)
  const [name, setName] = useState('');
  const [brief, setBrief] = useState('');
  const [modalities, setModalities] = useState<string[]>(['表格数据']);
  const [taskTypes, setTaskTypes] = useState<string[]>(['分类任务']);
  const [domains, setDomains] = useState<string[]>(['商业/管理']);
  const [formats, setFormats] = useState<string[]>(['CSV/XLSX']);
  const [description, setDescription] = useState(
    `## 数据集概述

本数据集面向数据科学分析与机器学习任务，包含结构化特征字段与清洗后标签。

### 字段说明
- \`ID\`: 样本唯一序列标识
- \`Feature_A\`: 核心特征维度 1
- \`Feature_B\`: 核心特征维度 2
- \`Label\`: 目标分类/回归标签

### 数据来源与脱敏说明
数据经过合规脱敏处理，不包含任何个人隐私与机密敏感信息。`
  );

  // File Upload State
  const [fileName, setFileName] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [isUploaded, setIsUploaded] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitting, setSubmitting] = useState(false);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      setIsUploaded(true);
      if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
      showToast(`已选择数据集文件: ${file.name}`);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setFileName(file.name);
      setFileSize(formatFileSize(file.size));
      setIsUploaded(true);
      if (errors.file) setErrors((prev) => ({ ...prev, file: '' }));
      showToast(`已成功载入文件: ${file.name}`);
    }
  };

  const toggleSelection = (
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    item: string
  ) => {
    if (list.includes(item)) {
      if (list.length === 1) return; // Keep at least 1
      setList(list.filter((i) => i !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = '请输入数据集名称';
    } else if (name.trim().length > 40) {
      newErrors.name = '数据集名称不能超过40字';
    }

    if (!brief.trim()) {
      newErrors.brief = '请输入一句话简介';
    } else if (brief.trim().length > 60) {
      newErrors.brief = '一句话简介不能超过60字';
    }

    if (modalities.length === 0) newErrors.modalities = '请至少选择一种模态';
    if (taskTypes.length === 0) newErrors.taskTypes = '请至少选择一种任务类型';
    if (domains.length === 0) newErrors.domains = '请至少选择一个行业领域';
    if (formats.length === 0) newErrors.formats = '请至少选择一种文件格式';
    if (!description.trim()) newErrors.description = '请输入数据集详细描述';
    if (!isUploaded || !fileName) newErrors.file = '请上传数据集压缩包或文件';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast('请完整填写必填项并上传文件！');
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      submitDatasetForApproval({
        name: name.trim(),
        brief: brief.trim(),
        modalities,
        taskTypes,
        domains,
        formats,
        description,
        fileSize: fileSize || '18.4 MB',
        files: [
          {
            id: `f_${Date.now()}`,
            name: fileName || `${name.trim()}.csv`,
            size: fileSize || '18.4 MB',
            format: formats[0]?.toLowerCase().includes('csv') ? 'csv' : 'json',
            rowsCount: 15000,
            colsCount: 16,
            encoding: 'UTF-8',
            headers: ['ID', 'Timestamp', 'Value_A', 'Value_B', 'Label'],
            sampleRows: []
          }
        ]
      });
      setSubmitting(false);
      onBack();
    }, 400);
  };

  return (
    <div className="w-full max-w-4xl mx-auto pt-2 pb-24 select-none animate-fade-in text-[#1A1A1A] antialiased">
      {/* 1. 顶部 Header 区：去卡片化，与发布新需求任务页、发布新动态页排版一致 */}
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
            上传并发布新数据集
          </h1>

          <div className="inline-flex items-center gap-1.5 text-[12px] text-[#888888] font-normal">
            <Database className="w-3.5 h-3.5 text-[#888888]" strokeWidth={1.5} />
            <span>开放数据共享计划</span>
          </div>
        </div>
      </header>

      {/* 2. 须知提示块：去灰底、去大框，左侧 2px 纯黑竖线 + 右侧 14px 中灰文字（行高 1.8） */}
      <div className="mt-7 border-l-2 border-[#1A1A1A] pl-4 py-0.5 text-[14px] text-[#666666] leading-[1.8]">
        <span className="font-medium text-[#1A1A1A]">数据集上传与审核流程须知：</span>
        1. 用户提交后将进入平台后台【待审核】队列；2. 平台管理员将对数据集格式、样本质量与合规性进行审核，审核通过后由管理员【点击上架】；3. 上架成功后，数据集将在【数据集广场】全网公开展示并支持下载，您可在【工作台 &gt; 我的资产 &gt; 我的数据集 &gt; 我上传的】实时追踪审核状态。
      </div>

      {/* 3. 主表单：极简黑白灰分隔结构 */}
      <form onSubmit={handleSubmit} className="mt-4 divide-y divide-[#EAEAEA]">
        {/* 区块 01：基本信息与概况 */}
        <section className="py-8 space-y-6">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[12px] font-mono text-[#999999]">01</span>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A] tracking-[-0.01em]">
              基本信息与概况
            </h2>
          </div>

          <div className="space-y-5">
            {/* 数据集名称 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[13px] font-medium text-[#1A1A1A]">
                  数据集名称 <span className="text-[#999999]">*</span>
                </label>
                <span className="text-[12px] text-[#999999] font-mono tabular-nums">
                  {name.length} / 40
                </span>
              </div>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                }}
                placeholder="例如：2026 全国主要城市空气质量与微气候时序数据"
                className={`w-full px-3.5 py-2.5 rounded-[6px] border bg-[#FFFFFF] text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors ${
                  errors.name ? 'border-[#1A1A1A]' : 'border-[#EAEAEA] focus:border-[#1A1A1A]'
                }`}
                maxLength={40}
              />
              {errors.name && <p className="text-[12px] text-[#1A1A1A]">{errors.name}</p>}
            </div>

            {/* 一句话简介 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-[13px] font-medium text-[#1A1A1A]">
                  一句话简介 <span className="text-[#999999]">*</span>
                </label>
                <span className="text-[12px] text-[#999999] font-mono tabular-nums">
                  {brief.length} / 60
                </span>
              </div>
              <input
                type="text"
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value);
                  if (errors.brief) setErrors((prev) => ({ ...prev, brief: '' }));
                }}
                placeholder="简明扼要概括数据集的核心特征与典型应用场景"
                className={`w-full px-3.5 py-2.5 rounded-[6px] border bg-[#FFFFFF] text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors ${
                  errors.brief ? 'border-[#1A1A1A]' : 'border-[#EAEAEA] focus:border-[#1A1A1A]'
                }`}
                maxLength={60}
              />
              {errors.brief && <p className="text-[12px] text-[#1A1A1A]">{errors.brief}</p>}
            </div>

            {/* 上传者标识 */}
            <div className="space-y-2">
              <label className="block text-[13px] font-medium text-[#1A1A1A]">上传者标识</label>
              <div className="w-full px-3.5 py-2.5 rounded-[6px] border border-[#EAEAEA] bg-[#FFFFFF] text-[13px] text-[#1A1A1A] flex items-center justify-between">
                <span>{user.name || '当前用户'}</span>
                <span className="text-[12px] text-[#888888]">用户原创上传</span>
              </div>
            </div>
          </div>
        </section>

        {/* 区块 02：标签与分类维度 */}
        <section className="py-8 space-y-6">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[12px] font-mono text-[#999999]">02</span>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A] tracking-[-0.01em]">
              标签与分类维度
            </h2>
          </div>

          {/* 数据模态 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#1A1A1A]">
                数据模态 <span className="text-[#999999]">*</span>
                <span className="text-[12px] text-[#999999] font-normal ml-1.5">可多选</span>
              </label>
              <span className="text-[12px] text-[#999999] font-mono tabular-nums">
                已选 {modalities.length} 项
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {datasetTagDimensions.modality.map((m) => {
                const selected = modalities.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleSelection(modalities, setModalities, m)}
                    className={`px-3.5 py-1.5 rounded-[6px] border text-[13px] font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#FFFFFF]'
                        : 'bg-transparent border-[#EAEAEA] text-[#555555] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 任务类型 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#1A1A1A]">
                任务类型 <span className="text-[#999999]">*</span>
                <span className="text-[12px] text-[#999999] font-normal ml-1.5">可多选</span>
              </label>
              <span className="text-[12px] text-[#999999] font-mono tabular-nums">
                已选 {taskTypes.length} 项
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {datasetTagDimensions.taskType.map((t) => {
                const selected = taskTypes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleSelection(taskTypes, setTaskTypes, t)}
                    className={`px-3.5 py-1.5 rounded-[6px] border text-[13px] font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#FFFFFF]'
                        : 'bg-transparent border-[#EAEAEA] text-[#555555] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 行业领域 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#1A1A1A]">
                行业领域 <span className="text-[#999999]">*</span>
                <span className="text-[12px] text-[#999999] font-normal ml-1.5">可多选</span>
              </label>
              <span className="text-[12px] text-[#999999] font-mono tabular-nums">
                已选 {domains.length} 项
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {datasetTagDimensions.domain.map((d) => {
                const selected = domains.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleSelection(domains, setDomains, d)}
                    className={`px-3.5 py-1.5 rounded-[6px] border text-[13px] font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#FFFFFF]'
                        : 'bg-transparent border-[#EAEAEA] text-[#555555] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 文件格式 */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-medium text-[#1A1A1A]">
                文件格式 <span className="text-[#999999]">*</span>
                <span className="text-[12px] text-[#999999] font-normal ml-1.5">可多选</span>
              </label>
              <span className="text-[12px] text-[#999999] font-mono tabular-nums">
                已选 {formats.length} 项
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {datasetTagDimensions.format.map((f) => {
                const selected = formats.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleSelection(formats, setFormats, f)}
                    className={`px-3.5 py-1.5 rounded-[6px] border text-[13px] font-medium transition-colors cursor-pointer ${
                      selected
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-[#FFFFFF]'
                        : 'bg-transparent border-[#EAEAEA] text-[#555555] hover:border-[#1A1A1A] hover:text-[#1A1A1A]'
                    }`}
                  >
                    {f}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* 区块 03：上传数据包文件（浅色虚线框 #EAEAEA + 纯黑线条图标 + 纯白背景） */}
        <section className="py-8 space-y-5">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[12px] font-mono text-[#999999]">03</span>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A] tracking-[-0.01em]">
              上传数据包文件 <span className="text-[#999999] font-normal">*</span>
            </h2>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".zip,.tar.gz,.csv,.json,.jsonl,.parquet,.txt,.xlsx"
          />

          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-[6px] p-9 text-center bg-[#FFFFFF] transition-colors cursor-pointer ${
              isDragging
                ? 'border-[#1A1A1A]'
                : isUploaded
                  ? 'border-[#1A1A1A]'
                  : 'border-[#EAEAEA] hover:border-[#1A1A1A]'
            }`}
          >
            {isUploaded ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <FileArchive className="w-7 h-7 text-[#1A1A1A]" strokeWidth={1.5} />
                <div className="text-[14px] font-medium text-[#1A1A1A] pt-1">{fileName}</div>
                <div className="text-[12px] text-[#888888] font-mono">
                  文件大小：{fileSize || '18.4 MB'} · 已准备就绪
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-1 text-[12px] text-[#666666] hover:text-[#1A1A1A] underline underline-offset-4 transition-colors cursor-pointer"
                >
                  更换文件
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-2.5">
                <Upload className="w-7 h-7 text-[#1A1A1A]" strokeWidth={1.5} />
                <div className="text-[14px] font-medium text-[#1A1A1A]">
                  点击上传或将数据集文件拖拽至此区域
                </div>
                <div className="text-[12px] text-[#888888]">
                  支持 .zip、.tar.gz、.csv、.json、.parquet 格式，单文件上限 50 GB
                </div>
              </div>
            )}
          </div>
          {errors.file && <p className="text-[12px] text-[#1A1A1A]">{errors.file}</p>}
        </section>

        {/* 区块 04：数据集详细描述 (纯白底 + 1px 浅灰边框 + 黑色细线工具栏 Markdown 编辑器) */}
        <section className="py-8 space-y-4">
          <div className="flex items-baseline gap-2.5">
            <span className="text-[12px] font-mono text-[#999999]">04</span>
            <h2 className="text-[16px] font-semibold text-[#1A1A1A] tracking-[-0.01em]">
              数据集详细描述 <span className="text-[#999999] font-normal">*</span>
            </h2>
          </div>

          <MarkdownEditor
            value={description}
            onChange={(val) => {
              setDescription(val);
              if (errors.description) setErrors((prev) => ({ ...prev, description: '' }));
            }}
            theme="minimal"
            minHeight="240px"
            placeholder="请输入数据集背景、字段定义、特征工程、采样方法与使用指南..."
          />
          {errors.description && (
            <p className="text-[12px] text-[#1A1A1A]">{errors.description}</p>
          )}
        </section>

        {/* 底部操作栏：左侧取消返回（白底黑字无边框），右侧提交审核（纯黑底白字，无图标） */}
        <div className="pt-7 flex items-center justify-between gap-4">
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
            {submitting ? '正在提交审核...' : '提交审核'}
          </button>
        </div>
      </form>
    </div>
  );
};
