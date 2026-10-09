import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { DatasetItem } from '../../types';
import { 
  ArrowLeft, 
  Upload, 
  Database, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  AlertCircle, 
  Info, 
  ShieldCheck, 
  FileCode, 
  Layers,
  X,
  FileArchive,
  Check
} from 'lucide-react';

interface UserDatasetUploadFormProps {
  onBack: () => void;
  fromTitle?: string;
}

export const UserDatasetUploadForm: React.FC<UserDatasetUploadFormProps> = ({ onBack, fromTitle }) => {
  const { datasetTagDimensions, submitDatasetForApproval, showToast, user } = useApp();

  // Form Fields
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

  // Editor mode
  const [editorMode, setEditorMode] = useState<'edit' | 'preview'>('edit');
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
      showToast(`已成功载入文件: ${file.name}`);
    }
  };

  const toggleSelection = (list: string[], setList: React.Dispatch<React.SetStateAction<string[]>>, item: string) => {
    if (list.includes(item)) {
      if (list.length === 1) return; // Keep at least 1
      setList(list.filter(i => i !== item));
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
    <div className="w-full max-w-5xl mx-auto px-4 py-6 space-y-6 animate-fade-in text-slate-800">
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shrink-0"
            title="返回数据集广场"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-400">{fromTitle || 'AI 集市 / 数据集广场'}</span>
              <span className="text-xs text-slate-300">/</span>
              <span className="text-xs font-extrabold text-blue-600">上传数据集</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5 flex items-center gap-2">
              <Database className="w-5 h-5 text-blue-600" />
              <span>上传并发布新数据集</span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-blue-50 text-blue-700 border border-blue-100">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            <span>开放数据共享计划</span>
          </span>
        </div>
      </div>

      {/* Approval Process Notice Banner */}
      <div className="bg-gradient-to-r from-blue-50 via-indigo-50/50 to-white border border-blue-200/80 rounded-2xl p-5 shadow-xs flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="space-y-1 text-xs text-slate-600">
          <div className="font-extrabold text-slate-900 text-sm">数据集上传与审核流程须知</div>
          <p className="leading-relaxed text-slate-600">
            1. 用户提交后将进入平台后台<strong>【待审核】</strong>队列；<br />
            2. 平台管理员将对数据集格式、样本质量与合规性进行审核，审核通过后由管理员<strong>【点击上架】</strong>；<br />
            3. 上架成功后，数据集将在<strong>【数据集广场】</strong>全网公开展示并支持下载；您可在<strong>【工作台 &gt; 我的资产 &gt; 我的数据集 &gt; 我上传的】</strong>实时追踪审核状态。
          </p>
        </div>
      </div>

      {/* Main Upload Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs space-y-8">
        
        {/* Section 1: 基本元数据 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-2 h-5 bg-blue-600 rounded-full" />
            <h2 className="text-base font-black text-slate-900">1. 基本信息与概况</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700">
                数据集名称 <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                placeholder="例如: 2026全国主要城市空气质量与微气候时序数据"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition focus:outline-hidden ${
                  errors.name ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-blue-500 bg-slate-50/50'
                }`}
                maxLength={40}
              />
              {errors.name && <p className="text-[11px] text-rose-500 font-bold">{errors.name}</p>}
            </div>

            {/* Brief */}
            <div className="space-y-1.5 md:col-span-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  一句话简介 <span className="text-rose-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400 font-mono">{brief.length}/60 字</span>
              </div>
              <input
                type="text"
                value={brief}
                onChange={(e) => {
                  setBrief(e.target.value);
                  if (errors.brief) setErrors(prev => ({ ...prev, brief: '' }));
                }}
                placeholder="简明扼要概括数据集的核心特征与典型应用场景"
                className={`w-full px-4 py-2.5 rounded-xl border text-xs font-bold transition focus:outline-hidden ${
                  errors.brief ? 'border-rose-500 bg-rose-50/20' : 'border-slate-200 focus:border-blue-500 bg-slate-50/50'
                }`}
                maxLength={60}
              />
              {errors.brief && <p className="text-[11px] text-rose-500 font-bold">{errors.brief}</p>}
            </div>

            {/* Uploader Display Info */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-xs font-bold text-slate-700">上传者标识</label>
              <div className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-100/60 text-xs font-bold text-slate-600 flex items-center justify-between">
                <span>{user.name || '当前用户'}</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md font-extrabold">用户原创上传</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 分类与标签维度 (与后台创建严格一致) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-2 h-5 bg-indigo-600 rounded-full" />
            <h2 className="text-base font-black text-slate-900">2. 标签与分类维度</h2>
          </div>

          {/* 模态 (多选) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                数据模态 <span className="text-rose-500">*</span> (可多选)
              </label>
              <span className="text-[10px] text-slate-400">已选 {modalities.length} 项</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {datasetTagDimensions.modality.map(m => {
                const selected = modalities.includes(m);
                return (
                  <button
                    key={m}
                    type="button"
                    onClick={() => toggleSelection(modalities, setModalities, m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{m}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 任务类型 (多选) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                任务类型 <span className="text-rose-500">*</span> (可多选)
              </label>
              <span className="text-[10px] text-slate-400">已选 {taskTypes.length} 项</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {datasetTagDimensions.taskType.map(t => {
                const selected = taskTypes.includes(t);
                return (
                  <button
                    key={t}
                    type="button"
                    onClick={() => toggleSelection(taskTypes, setTaskTypes, t)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{t}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 行业领域 (多选) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                行业领域 <span className="text-rose-500">*</span> (可多选)
              </label>
              <span className="text-[10px] text-slate-400">已选 {domains.length} 项</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {datasetTagDimensions.domain.map(d => {
                const selected = domains.includes(d);
                return (
                  <button
                    key={d}
                    type="button"
                    onClick={() => toggleSelection(domains, setDomains, d)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{d}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 文件格式 (多选) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700">
                文件格式 <span className="text-rose-500">*</span> (可多选)
              </label>
              <span className="text-[10px] text-slate-400">已选 {formats.length} 项</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {datasetTagDimensions.format.map(f => {
                const selected = formats.includes(f);
                return (
                  <button
                    key={f}
                    type="button"
                    onClick={() => toggleSelection(formats, setFormats, f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                      selected
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                    }`}
                  >
                    {selected && <Check className="w-3 h-3" />}
                    <span>{f}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Section 3: 文件上传 */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="w-2 h-5 bg-emerald-600 rounded-full" />
            <h2 className="text-base font-black text-slate-900">3. 上传数据包文件</h2>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
            accept=".zip,.tar.gz,.csv,.json,.jsonl,.parquet,.txt,.xlsx"
          />

          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-8 text-center transition cursor-pointer ${
              isDragging
                ? 'border-blue-500 bg-blue-50/50 scale-[1.01]'
                : isUploaded
                ? 'border-emerald-300 bg-emerald-50/30'
                : 'border-slate-200 hover:border-blue-400 bg-slate-50/50 hover:bg-blue-50/20'
            }`}
          >
            {isUploaded ? (
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                  <FileArchive className="w-6 h-6" />
                </div>
                <div className="text-sm font-extrabold text-slate-900">{fileName}</div>
                <div className="text-xs text-slate-500 font-mono">文件大小: {fileSize || '18.4 MB'} • 准备就绪</div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    fileInputRef.current?.click();
                  }}
                  className="mt-2 text-xs font-bold text-blue-600 hover:text-blue-700 underline"
                >
                  更换文件
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Upload className="w-7 h-7" />
                </div>
                <div>
                  <div className="text-sm font-extrabold text-slate-900">点击上传或将数据集文件拖拽至此区域</div>
                  <div className="text-xs text-slate-400 mt-1">支持 .zip, .tar.gz, .csv, .json, .parquet 格式，单文件上限 50 GB</div>
                </div>
              </div>
            )}
          </div>
          {errors.file && <p className="text-[11px] text-rose-500 font-bold">{errors.file}</p>}
        </div>

        {/* Section 4: 详细说明 (Markdown) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-5 bg-purple-600 rounded-full" />
              <h2 className="text-base font-black text-slate-900">4. 数据集详细描述 (Markdown 格式)</h2>
            </div>
            
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setEditorMode('edit')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  editorMode === 'edit' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                编辑内容
              </button>
              <button
                type="button"
                onClick={() => setEditorMode('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  editorMode === 'preview' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                渲染预览
              </button>
            </div>
          </div>

          {editorMode === 'edit' ? (
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={9}
              className="w-full p-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-xs font-mono text-slate-800 leading-relaxed focus:border-blue-500 focus:outline-hidden"
              placeholder="请输入数据集背景、字段定义、特征工程、采样方法与使用指南..."
            />
          ) : (
            <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/40 text-xs leading-relaxed prose max-w-none text-slate-700">
              <pre className="whitespace-pre-wrap font-sans text-xs">{description}</pre>
            </div>
          )}
          {errors.description && <p className="text-[11px] text-rose-500 font-bold">{errors.description}</p>}
        </div>

        {/* Submit Actions */}
        <div className="flex items-center justify-between pt-6 border-t border-slate-100">
          <button
            type="button"
            onClick={onBack}
            className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold transition cursor-pointer"
          >
            取消返回
          </button>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white text-xs font-extrabold shadow-md shadow-blue-500/20 transition cursor-pointer flex items-center gap-2"
            >
              {submitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>正在提交审核...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>提交审核</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
