import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem } from '../../types';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  CheckCircle2,
  Paperclip,
  Download,
  AlertCircle,
  ShieldCheck,
  Award,
  Coins,
  Calendar,
  Layers,
  Tag,
  User,
  Share2,
  FileCheck,
  Sparkles,
  ExternalLink,
  Code,
  Cpu,
  Zap,
  Palette,
  Bot,
  Database,
  Wrench,
  Star,
  HardDrive,
  Terminal,
  ArrowUpRight,
  Activity,
  Box,
  FileCode,
  Server,
  RotateCcw,
  XCircle
} from 'lucide-react';
import { SubmitResultModal } from './SubmitResultModal';
import { TaskVerificationModal } from './TaskVerificationModal';
import { AgentDetailSubPage } from '../marketplace/AgentDetailSubPage';
import { ModelDetail } from '../marketplace/ModelDetail';
import { DatasetDetail } from '../marketplace/DatasetDetail';
import { SkillDetail } from '../marketplace/SkillDetail';
import { AgentItem, ModelItem, DatasetItem, SkillPluginItem } from '../../types';

interface TaskDetailSubPageProps {
  taskId: string;
  onBack: () => void;
  readOnly?: boolean;
  fromTitle?: string;
}

export const TaskDetailSubPage: React.FC<TaskDetailSubPageProps> = ({ taskId, onBack, readOnly, fromTitle }) => {
  const effectiveFromTitle = fromTitle || '任务大厅';
  const { 
    tasks, 
    user, 
    takeTask, 
    showToast, 
    isAdminMode,
    agents,
    models,
    datasets,
    skills,
    openAgentDetail,
    openModelDetail,
    downloadDataset,
    downloadSkill,
    setCreateComputeModalOpen
  } = useApp();

  const isReadOnly = readOnly !== undefined ? readOnly : isAdminMode;

  // TAB 切换: 任务介绍 | 推荐平台资源 | 接单列表
  const [activeTab, setActiveTab] = useState<'intro' | 'recommended' | 'takers'>('intro');
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [activeResourceDetail, setActiveResourceDetail] = useState<
    | { type: 'agent'; data: AgentItem }
    | { type: 'model'; data: ModelItem }
    | { type: 'dataset'; data: DatasetItem }
    | { type: 'skill'; data: SkillPluginItem }
    | null
  >(null);

  // If a recommended resource detail is open, render its exact AI Marketplace detail subpage
  if (activeResourceDetail) {
    if (activeResourceDetail.type === 'agent') {
      return (
        <AgentDetailSubPage
          agent={activeResourceDetail.data}
          onBack={() => setActiveResourceDetail(null)}
          fromTitle="任务详情"
        />
      );
    }
    if (activeResourceDetail.type === 'model') {
      return (
        <ModelDetail
          model={activeResourceDetail.data}
          onBack={() => setActiveResourceDetail(null)}
          fromTitle="任务详情"
        />
      );
    }
    if (activeResourceDetail.type === 'dataset') {
      return (
        <DatasetDetail
          dataset={activeResourceDetail.data}
          onBack={() => setActiveResourceDetail(null)}
          fromTitle="任务详情"
        />
      );
    }
    if (activeResourceDetail.type === 'skill') {
      return (
        <SkillDetail
          skill={activeResourceDetail.data}
          onBack={() => setActiveResourceDetail(null)}
          fromTitle="任务详情"
        />
      );
    }
  }

  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return (
      <div className="w-full max-w-7xl mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-700">未找到该任务信息</h3>
        <p className="text-xs text-slate-400">该任务可能已被删除或下架。</p>
        <button
          onClick={onBack}
          className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500 transition cursor-pointer"
        >
          返回任务大厅
        </button>
      </div>
    );
  }

  const isPublisher = !isReadOnly && (task.publisher === user.name || user.name.includes(task.publisher) || (user.name === '极客小千' && task.publisher.includes('你')));

  // 判定是否为已结束状态：已验收 / 已结束 / 剩余天数<=0 / 已有 winner
  const isFinished = 
    task.status === '已结束' || 
    task.status === '已验收' || 
    (task.remainingDays !== undefined && task.remainingDays <= 0) ||
    task.isAccepted === true ||
    !!task.winner ||
    (task.submissions || []).some(s => s.status === '已通过');

  const myTakerRecord = !isReadOnly ? (task.takers || []).find(tk => tk.username === user.name || tk.username.includes('你') || tk.username.includes('极客小千')) : undefined;
  const hasTaken = !isReadOnly && !!myTakerRecord;
  const mySubmission = !isReadOnly ? (task.submissions || []).find(s => s.username === user.name || s.username.includes('你') || s.username.includes('极客小千')) : undefined;
  const isRejected = !isFinished && (mySubmission?.status === '已驳回' || myTakerRecord?.status === '已驳回');
  const hasSubmitted = !isReadOnly && (mySubmission?.status === '待验收' || mySubmission?.status === '已通过' || myTakerRecord?.status === '已提交' || myTakerRecord?.status === '已验收');

  const takersList = task.takers || [];
  const submissionsList = task.submissions || [];

  const handleTake = () => {
    takeTask(task.id);
  };

  const handleAgentTrial = (ag: AgentItem) => {
    if (ag.id === 'ag_22' || ag.name.includes('企业客服') || ag.trialUrl) {
      const targetUrl = (ag.id === 'ag_22' || ag.name.includes('企业客服'))
        ? 'https://agent001-six.vercel.app/'
        : (ag.trialUrl || 'https://agent001-six.vercel.app/');
      showToast(`正在打开【${ag.name}】独立在线体验系统...`);
      window.open(targetUrl, '_blank', 'noopener,noreferrer');
      return;
    }
    const trialUrl = `${window.location.origin}${window.location.pathname}?trial=${ag.id}`;
    window.open(trialUrl, '_blank');
  };

  const getDomainIcon = (domain: string) => {
    switch (domain) {
      case '技术开发':
        return Code;
      case 'AI模型与数据':
        return Cpu;
      case '工具与自动化':
        return Zap;
      case '内容创作':
        return Palette;
      default:
        return Award;
    }
  };

  const DomainIcon = getDomainIcon(task.domain);

  return (
    <div className="space-y-6 select-none animate-fade-in max-w-7xl mx-auto pb-20 font-sans">
      
      {/* 1. 顶部面包屑与返回导航栏 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200/80 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 shadow-2xs transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回{effectiveFromTitle}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
            <span className="cursor-pointer hover:text-indigo-600" onClick={onBack}>{effectiveFromTitle}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-500 font-semibold">{task.domain}</span>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-slate-700 font-bold truncate max-w-xs md:max-w-md">{task.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <button
            onClick={() => {
              if (navigator.clipboard) {
                navigator.clipboard.writeText(window.location.href);
              }
              showToast('已复制任务详情链接到剪贴板');
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 font-bold shadow-2xs transition hover:bg-slate-50 cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>分享任务</span>
          </button>
        </div>
      </div>

      {/* 2. 任务头部核心卡片 (Hero Card) */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6 relative overflow-hidden">
        {/* 背景轻微渐变装饰 */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-indigo-50/60 via-blue-50/20 to-transparent rounded-bl-full pointer-events-none -z-0" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-6">
          
          {/* 左侧主体信息 */}
          <div className="space-y-4 flex-1 min-w-0">
            {/* 徽章横条 */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/80 text-xs font-bold flex items-center gap-1.5">
                <DomainIcon className="w-3.5 h-3.5" />
                <span>{task.domain}</span>
              </span>

              <span
                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                  task.difficulty === '简单'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/80'
                    : task.difficulty === '中等'
                    ? 'bg-blue-50 text-blue-700 border border-blue-200/80'
                    : 'bg-purple-50 text-purple-700 border border-purple-200/80'
                }`}
              >
                <Tag className="w-3.5 h-3.5" />
                <span>{task.difficulty}难度</span>
              </span>

              {isFinished ? (
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>已结束</span>
                </span>
              ) : (
                <span className="px-3 py-1 rounded-xl text-xs font-black bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>进行中</span>
                </span>
              )}

              <span className="px-3 py-1 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>{isFinished ? '已到期' : `剩余 ${task.remainingDays || 14} 天`}</span>
              </span>
            </div>

            {/* 任务大标题 */}
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-900 tracking-tight leading-snug">
              {task.title}
            </h1>

            {/* 雇主与发布时间 */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-medium pt-1">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
                  {task.publisher.charAt(0)}
                </div>
                <span className="text-slate-800 font-bold">需求发布人：{task.publisher}</span>
                {isPublisher && (
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200">
                    我的发布
                  </span>
                )}
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>发布时间：{task.publishTime || task.startTime}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1 text-slate-600 font-semibold">
                <span>截止时间：{task.endTime}</span>
              </div>
            </div>
          </div>

          {/* 右侧：高额赏金与主操作卡片 */}
          <div className="w-full lg:w-80 bg-gradient-to-br from-indigo-50/90 via-slate-50 to-white rounded-2xl border border-indigo-100/90 p-5 shadow-xs shrink-0 flex flex-col justify-between gap-4">
            <div>
              <div className="text-[11px] font-extrabold text-indigo-900/70 uppercase tracking-wider mb-1">
                <span>悬赏报酬</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-black font-mono text-indigo-600 tracking-tight">
                  ¥{(task.cashReward || 0).toLocaleString()}
                </span>
                <span className="text-xs font-bold text-slate-500">元现金</span>
              </div>
              {task.pointsReward && task.pointsReward > 0 ? (
                <div className="mt-1.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-50 border border-amber-200/80 text-amber-800 text-xs font-bold font-mono">
                  <Coins className="w-3.5 h-3.5 text-amber-600" />
                  <span>+ {task.pointsReward} 平台积分</span>
                </div>
              ) : null}
            </div>

            {/* 顶栏操作按钮 */}
            <div className="pt-2 border-t border-indigo-100/80 space-y-2">
              {isReadOnly ? (
                <div className="w-full py-2 bg-slate-100 text-slate-600 font-bold text-xs rounded-xl text-center border border-slate-200">
                  后台任务监控模式 · 仅供查阅
                </div>
              ) : (
                <>
                  {/* 发布人视角 */}
                  {isPublisher && (submissionsList.length > 0 || task.refunded) && (
                    <button
                      onClick={() => setVerifyModalOpen(true)}
                      className={`w-full py-2.5 text-white font-black text-xs rounded-xl shadow-md transition active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                        task.refunded
                          ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                          : (task.isAccepted || !!task.winner || (task.submissions || []).some(s => s.status === '已通过'))
                          ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/20'
                          : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/20'
                      }`}
                    >
                      {task.refunded ? (
                        <>
                          <RotateCcw className="w-4 h-4" />
                          <span>{submissionsList.length > 0 ? '查看驳回与退款详情' : '查看退款详情'}</span>
                        </>
                      ) : (task.isAccepted || !!task.winner || (task.submissions || []).some(s => s.status === '已通过')) ? (
                        <>
                          <Award className="w-4 h-4" />
                          <span>查看验收结果</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>{isFinished ? '到期验收评审' : '去验收交付成果'} ({submissionsList.length})</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* 开发者视角：未接单 & 进行中 */}
                  {!isPublisher && !isFinished && !hasTaken && (
                    <button
                      onClick={handleTake}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-md shadow-indigo-600/20 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>立即接单承接</span>
                    </button>
                  )}

                  {/* 开发者视角：被驳回 & 进行中 -> 修改交付成果并重提 */}
                  {!isPublisher && !isFinished && hasTaken && isRejected && (
                    <button
                      onClick={() => setSubmitModalOpen(true)}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl shadow-md shadow-rose-600/20 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>修改交付成果并重新提交</span>
                    </button>
                  )}

                  {/* 开发者视角：已接单 & 未提交 & 未被驳回 & 进行中 */}
                  {!isPublisher && !isFinished && hasTaken && !hasSubmitted && !isRejected && (
                    <button
                      onClick={() => setSubmitModalOpen(true)}
                      className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs rounded-xl shadow-md shadow-emerald-600/20 transition active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <FileCheck className="w-4 h-4" />
                      <span>提交交付成果</span>
                    </button>
                  )}
                </>
              )}

              {/* 状态文字 */}
              <div className="text-[11px] text-center text-slate-500 font-medium">
                {isReadOnly ? (
                  <span className="text-slate-500 font-medium">任务状态：{task.status} · 共有 {takersList.length} 位接单人</span>
                ) : task.refunded ? (
                  <span className="text-amber-700 font-bold flex items-center justify-center gap-1">
                    <RotateCcw className="w-3.5 h-3.5 text-amber-600" />
                    <span>已到期全部驳回 · 资金与积分已全部退回发布人</span>
                  </span>
                ) : isFinished ? (
                  <span className="text-slate-400 font-bold">任务已到期截止</span>
                ) : isPublisher ? (
                  <span className="text-indigo-600 font-bold">已收到 {takersList.length} 位极客接单响应</span>
                ) : isRejected ? (
                  <span className="text-rose-600 font-bold">⚠️ 您的成果已被驳回，支持修改后重新提交</span>
                ) : hasTaken ? (
                  <span className="text-emerald-600 font-bold">✓ 您已于 {myTakerRecord?.takeTime} 接单</span>
                ) : (
                  <span>支持多位极客同时接单，择优验收结算</span>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 退款提示横幅 */}
      {task.refunded && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-3xl text-xs text-amber-950 flex items-start gap-3.5 shadow-2xs">
          <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
            <RotateCcw className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between gap-2">
              <h4 className="font-black text-sm text-amber-950">任务已到期结束 · 预付金额与积分已全额退还发布人</h4>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-200 text-amber-900">
                已全额退款
              </span>
            </div>
            <p className="text-amber-800 text-xs mt-1 leading-relaxed">
              {task.refundReason || '该任务已到期结束，发布人已将所有交付成果驳回，任务预付金额和积分已全额原路退回至发布人账户。'}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg font-bold text-amber-900">
                退回金额：<span className="font-mono text-indigo-700 font-black">¥{(task.refundCash ?? task.cashReward ?? task.bounty ?? 0).toLocaleString()}</span>
              </span>
              <span className="px-2.5 py-1 bg-white border border-amber-200 rounded-lg font-bold text-amber-900">
                退回积分：<span className="font-mono text-indigo-700 font-black">{task.refundPoints ?? task.pointsReward ?? 0} 积分</span>
              </span>
              {task.refundTime && (
                <span className="text-slate-400 text-[11px]">退还时间：{task.refundTime}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 3. 中间 TAB 导航与内容区 */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-xs space-y-6">
        
        {/* TAB 导航条 */}
        <div className="flex items-center gap-8 border-b border-slate-200">
          {[
            { key: 'intro', label: '任务介绍与需求规范' },
            { key: 'recommended', label: '推荐平台资源' },
            { key: 'takers', label: `接单极客列表 (${takersList.length})` }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`pb-3.5 text-sm font-extrabold transition-all relative cursor-pointer ${
                activeTab === tab.key
                  ? 'text-indigo-600'
                  : 'text-slate-500 hover:text-slate-800 font-bold'
              }`}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div
                  layoutId="taskSubPageTabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </button>
          ))}
        </div>

        {/* 1. 任务介绍 TAB */}
        {activeTab === 'intro' && (
          <div className="space-y-7">
            
            {/* 任务描述 */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                <span>任务背景与需求描述</span>
              </h3>
              <div
                className="p-6 bg-slate-50/60 border border-slate-200/90 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: task.description }}
              />
            </div>

            {/* 验收标准 */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                <span>成果验收标准与交付规范</span>
              </h3>
              <div
                className="p-6 bg-emerald-50/40 border border-emerald-200/90 rounded-2xl text-xs text-slate-700 leading-relaxed font-medium whitespace-pre-line"
                dangerouslySetInnerHTML={{ __html: task.acceptanceCriteria }}
              />
            </div>

            {/* 奖励与结算细则 */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>奖励明细与托管机制</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-6 bg-slate-50/80 border border-slate-200/90 rounded-2xl text-xs">
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold">现金奖励 (托管至平台账户)</div>
                  <div className="text-xl font-black font-mono text-indigo-600">
                    ¥{(task.cashReward || 0).toLocaleString()} 元
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    验收通过后资金即时转入开发者个人钱包，可随时提现。
                  </p>
                </div>
                <div className="space-y-1">
                  <div className="text-slate-400 font-bold">成长积分奖励</div>
                  <div className="text-xl font-black font-mono text-amber-600">
                    {task.pointsReward || 0} 个积分
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    用于极客荣誉等级晋级与算力资源折扣抵扣。
                  </p>
                </div>
              </div>
            </div>

            {/* 交付周期说明 */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                <span>交付周期与时间节点</span>
              </h3>
              <div className="p-5 bg-slate-50 border border-slate-200/90 rounded-2xl text-xs flex flex-wrap items-center justify-between gap-4 font-medium text-slate-700">
                <div>发布启动时间：<span className="font-bold font-mono text-slate-900">{task.publishTime || task.startTime}</span></div>
                <div>最终截止时间：<span className="font-bold font-mono text-indigo-600">{task.endTime}</span></div>
                <div>周期状态：<span className="font-bold text-slate-800">{isFinished ? '已截止' : `剩余有效时间 ${task.remainingDays || 14} 天`}</span></div>
              </div>
            </div>

          </div>
        )}

        {/* 2. 推荐平台资源 TAB */}
        {activeTab === 'recommended' && (
          <div className="space-y-6">
            {/* 提示信息 */}
            <div className="text-xs text-slate-600 font-medium leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200/80 flex items-center gap-2">
              <span className="text-indigo-600 font-bold shrink-0">💡 提示：</span>
              <span>接单时可参考使用发布人推荐的以下资源，平台仅作信息展示与推荐，不强制使用，请按实际需求自行选用。</span>
            </div>

            {/* 炫酷卡片网格 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* 1. Agent 推荐卡片 */}
              {((task.recommendedResources?.agents && task.recommendedResources.agents.length > 0)
                ? agents.filter(a => task.recommendedResources!.agents!.includes(a.id))
                : agents.slice(0, 2)
              ).map(ag => (
                <div
                  key={`ag-${ag.id}`}
                  className="relative group rounded-3xl bg-white border border-slate-200/90 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 space-y-4"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-0 group-hover:bg-indigo-100/60 transition" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xl shadow-2xs shrink-0 group-hover:scale-105 transition">
                          {ag.avatar && ag.avatar.startsWith('http') ? (
                            <img src={ag.avatar} alt={ag.name} className="w-full h-full object-cover rounded-2xl" />
                          ) : (
                            <span>{ag.avatar || '🤖'}</span>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-indigo-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs">
                              Agent
                            </span>
                            <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {ag.rating || '4.8'}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition mt-1">
                            {ag.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                      {ag.slogan || ag.description || '具备完善上下文理解与自动化能力，帮助高效解决特定业务需求。'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                        <Cpu className="w-3 h-3 text-indigo-500" />
                        底座: {ag.baseModel || ag.linkedModel || 'DeepSeek V4'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                        <Activity className="w-3 h-3 text-emerald-500" />
                        调用: {ag.usageCount || (ag as any).downloadsCount || 1280} 次
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveResourceDetail({ type: 'agent', data: ag })}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      查看详情
                    </button>
                    <button
                      onClick={() => handleAgentTrial(ag)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-200 hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>快速试用</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* 2. 模型 推荐卡片 */}
              {((task.recommendedResources?.models && task.recommendedResources.models.length > 0)
                ? models.filter(m => task.recommendedResources!.models!.includes(m.id))
                : models.slice(0, 1)
              ).map(m => (
                <div
                  key={`m-${m.id}`}
                  className="relative group rounded-3xl bg-white border border-slate-200/90 hover:border-purple-300 hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 space-y-4"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50 rounded-bl-full -z-0 group-hover:bg-purple-100/60 transition" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-purple-50 border border-purple-100 text-purple-600 flex items-center justify-center font-bold text-xl shadow-2xs shrink-0 group-hover:scale-105 transition">
                          <Bot className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-purple-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs">
                              模型
                            </span>
                            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                              {m.vendor || 'AI Base'}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-purple-600 transition mt-1">
                            {m.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                      {m.description || '支持长上下文推理、代码自动生成与多轮复杂逻辑拆解。'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 text-[11px] font-semibold flex items-center gap-1 border border-purple-100">
                        <Box className="w-3 h-3 text-purple-500" />
                        窗口: 128K Tokens
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                        <Zap className="w-3 h-3 text-amber-500" />
                        吞吐: 120 Tokens/s
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveResourceDetail({ type: 'model', data: m })}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      查看详情
                    </button>
                    <button
                      onClick={() => setActiveResourceDetail({ type: 'model', data: m })}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs shadow-md shadow-purple-200 hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>API文档</span>
                      <FileCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* 3. 数据集 推荐卡片 */}
              {((task.recommendedResources?.datasets && task.recommendedResources.datasets.length > 0)
                ? datasets.filter(d => task.recommendedResources!.datasets!.includes(d.id))
                : datasets.slice(0, 1)
              ).map(d => (
                <div
                  key={`d-${d.id}`}
                  className="relative group rounded-3xl bg-white border border-slate-200/90 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 space-y-4"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-0 group-hover:bg-emerald-100/60 transition" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-600 flex items-center justify-center font-bold text-xl shadow-2xs shrink-0 group-hover:scale-105 transition">
                          <Database className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs">
                              数据集
                            </span>
                            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                              {d.modalityCategory || '公开数据集'}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-emerald-600 transition mt-1">
                            {d.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                      {d.description || '精心清洗与标注的数据集，开箱即用，支持任务指标测评与复现验证。'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-[11px] font-semibold flex items-center gap-1 border border-emerald-100">
                        <HardDrive className="w-3 h-3 text-emerald-600" />
                        容量: {d.size || '1.2 GB'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                        <Layers className="w-3 h-3 text-teal-600" />
                        条目: {(d as any).sampleCount || '50,000 条'}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveResourceDetail({ type: 'dataset', data: d })}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      查看详情
                    </button>
                    <button
                      onClick={() => downloadDataset(d)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-200 hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>下载</span>
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* 4. Skill 推荐卡片 */}
              {((task.recommendedResources?.skills && task.recommendedResources.skills.length > 0)
                ? skills.filter(s => task.recommendedResources!.skills!.includes(s.id))
                : skills.slice(0, 1)
              ).map(sk => (
                <div
                  key={`sk-${sk.id}`}
                  className="relative group rounded-3xl bg-white border border-slate-200/90 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300 overflow-hidden flex flex-col justify-between p-6 space-y-4"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-bl-full -z-0 group-hover:bg-amber-100/60 transition" />
                  
                  <div className="relative z-10 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center font-bold text-xl shadow-2xs shrink-0 group-hover:scale-105 transition">
                          <Wrench className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-0.5 rounded-md bg-amber-600 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs">
                              Skill
                            </span>
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                              {sk.category || '工具扩展'}
                            </span>
                          </div>
                          <h4 className="text-sm font-black text-slate-900 group-hover:text-amber-600 transition mt-1">
                            {sk.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 font-normal leading-relaxed line-clamp-2">
                      {sk.description || '提供标准化处理管线与自动工具，可无缝接入 Agent 编排流程。'}
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <span className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-[11px] font-semibold flex items-center gap-1 border border-amber-100">
                        <Terminal className="w-3 h-3 text-amber-600" />
                        版本: {sk.version || 'v1.2.0'}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[11px] font-semibold flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        作者: {(sk as any).author || '@official'}
                      </span>
                    </div>
                  </div>

                  <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                    <button
                      onClick={() => setActiveResourceDetail({ type: 'skill', data: sk })}
                      className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
                    >
                      查看详情
                    </button>
                    <button
                      onClick={() => downloadSkill(sk)}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs shadow-md shadow-amber-200 hover:shadow-lg transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>安装</span>
                      <Zap className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}

              {/* 5. 算力环境 推荐卡片 */}
              <div className="md:col-span-2 relative group rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white border border-blue-500/30 hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden p-6 sm:p-7 space-y-4">
                <div className="absolute top-0 right-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 text-cyan-400 flex items-center justify-center font-bold text-2xl shadow-inner shrink-0">
                        <Server className="w-6 h-6 animate-pulse" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md bg-blue-500 text-white font-extrabold text-[10px] tracking-wider uppercase shadow-2xs">
                            环境推荐（算力工坊）
                          </span>
                          <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/80 px-2.5 py-0.5 rounded-md border border-cyan-800">
                            预装深度学习镜像
                          </span>
                        </div>
                        <h4 className="text-base font-black text-white mt-1 flex items-center gap-2">
                          <span>{task.recommendedResources?.environment?.spec || 'NVIDIA RTX4090 / 24GB VRAM'}</span>
                        </h4>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-normal max-w-2xl">
                      建议镜像：<span className="text-cyan-300 font-bold">{task.recommendedResources?.environment?.image || 'Ubuntu 22.04 LTS (PyTorch 2.0 / CUDA 11.8)'}</span>。发布人推荐在此同款算力环境与依赖库下开箱调试，保障实验数据与最终交付指标的高度一致。
                    </p>
                  </div>

                  <div className="relative z-10 flex items-center gap-3 shrink-0 self-end md:self-center">
                    <button
                      onClick={() => setCreateComputeModalOpen(true)}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition cursor-pointer flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>一键创建实例</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 3. 接单列表 TAB */}
        {activeTab === 'takers' && (
          <div className="space-y-4">
            {takersList.length === 0 ? (
              <div className="py-16 text-center text-slate-400 text-xs font-bold space-y-2.5 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                <AlertCircle className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-sm text-slate-600 font-bold">暂无极客开发者接单</p>
                <p className="text-xs text-slate-400 font-normal">欢迎各位开发者点击右上方【立即接单】参与方案提交。</p>
              </div>
            ) : (
              takersList.map(tk => {
                const sub = submissionsList.find(s => s.username === tk.username || s.id === tk.submissionId);
                const isMyRecord = tk.username === user.name || tk.username.includes(user.name) || (user.name === '极客小千' && tk.username.includes('你'));

                // 精确判读五大接单记录状态：未提交成果 | 待验收 | 通过验收 | 已驳回 | 成果未通过
                const isAcceptedWinner = 
                  sub?.status === '已通过' || 
                  tk.status === '已验收' || 
                  task.winner?.username === tk.username ||
                  (task.winner?.username && (tk.username.includes(task.winner.username) || task.winner.username.includes(tk.username)));

                const isRejected = sub?.status === '已驳回' || tk.status === '已驳回';
                const hasTaskSettledWinner = !!task.winner || task.isAccepted || (task.submissions || []).some(s => s.status === '已通过');
                const isTaskEnded = task.status === '已结束' || task.status === '已验收';
                const isSubmissionUnsuccessful = !isAcceptedWinner && !isRejected && (sub?.status === '成果未通过' || tk.status === '成果未通过' || ((hasTaskSettledWinner || isTaskEnded) && !!sub));
                const isPending = sub && (sub.status === '待验收' || tk.status === '已提交') && !isAcceptedWinner && !isRejected && !isSubmissionUnsuccessful;
                const isNotSubmitted = !sub && tk.status !== '已提交' && tk.status !== '已验收' && tk.status !== '成果未通过';

                return (
                  <div
                    key={tk.id}
                    className={`p-6 rounded-2xl border transition-all space-y-4 ${
                      isAcceptedWinner
                        ? 'bg-emerald-50/60 border-emerald-300 shadow-2xs'
                        : isRejected
                        ? 'bg-red-50/40 border-red-200'
                        : isSubmissionUnsuccessful
                        ? 'bg-slate-50/70 border-slate-200'
                        : isPending
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200/90 shadow-2xs'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                      <div className="flex items-center gap-3.5">
                        <img
                          src={tk.userAvatar}
                          alt={tk.username}
                          className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                            <span>{tk.username}</span>
                            {isMyRecord && (
                              <span className="px-2 py-0.5 rounded text-[10px] font-black bg-indigo-100 text-indigo-700 border border-indigo-200">
                                我的接单记录
                              </span>
                            )}
                            {isAcceptedWinner && (
                              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-emerald-600 text-white flex items-center gap-1">
                                <Award className="w-3 h-3" />
                                <span>获胜承接方案</span>
                              </span>
                            )}
                          </div>
                          <div className="text-slate-400 mt-1 flex flex-wrap items-center gap-2">
                            <span>接单时间：{tk.takeTime}</span>
                            {sub?.submitTime && (
                              <>
                                <span>·</span>
                                <span className="text-indigo-600 font-medium">
                                  交付时间：{sub.submitTime}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* 右侧状态标准展示：未提交成果 | 待验收 | 通过验收 | 已驳回 */}
                      <div className="shrink-0">
                        {isAcceptedWinner ? (
                          <span className="px-3.5 py-1.5 bg-emerald-600 text-white font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4" />
                            <span>通过验收</span>
                          </span>
                        ) : (isRejected || isSubmissionUnsuccessful) ? (
                          <span className="px-3.5 py-1.5 bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-red-600" />
                            <span>已驳回</span>
                          </span>
                        ) : isPending ? (
                          <span className="px-3.5 py-1.5 bg-amber-100 text-amber-800 font-bold text-xs rounded-xl border border-amber-200 flex items-center gap-1.5">
                            <Clock className="w-4 h-4 text-amber-600" />
                            <span>待验收</span>
                          </span>
                        ) : (
                          <span className="px-3.5 py-1.5 bg-slate-100 text-slate-500 font-bold text-xs rounded-xl border border-slate-200/80">
                            未提交成果
                          </span>
                        )}
                      </div>
                    </div>

                    {/* 交付成果与关联文件区（如果是本人记录、发布者或管理员，可直接查看与下载） */}
                    {(isMyRecord || isPublisher || isAdminMode || isReadOnly) ? (
                      <div className="pt-3 border-t border-slate-200/80 space-y-2.5">
                        {sub ? (
                          <>
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-500">
                              <span>交付成果说明与提交文件：</span>
                              {isMyRecord && !isReadOnly && (
                                <span className="text-indigo-600 font-semibold">您可以查看并预览自己提交的文件</span>
                              )}
                            </div>
                            <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl text-xs text-slate-700 leading-relaxed font-medium">
                              {sub.notes}
                            </div>

                            {/* 上传的文件列表 */}
                            {sub.files && sub.files.length > 0 ? (
                              <div className="space-y-1.5 pt-1">
                                <div className="text-[11px] font-bold text-slate-400">已提交附件：</div>
                                <div className="flex flex-wrap gap-2.5">
                                  {sub.files.map(f => (
                                    <button
                                      type="button"
                                      key={f.id || f.name}
                                      onClick={() => showToast(`正在为您下载文件【${f.name}】`)}
                                      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-xs font-bold text-slate-800 rounded-xl cursor-pointer transition shadow-2xs"
                                    >
                                      <Paperclip className="w-3.5 h-3.5 text-indigo-600" />
                                      <span>{f.name}</span>
                                      <span className="text-slate-400 text-[11px]">({f.size})</span>
                                      <Download className="w-3.5 h-3.5 text-indigo-500 ml-1" />
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="text-[11px] text-slate-400 font-medium">暂无附带交付文件</div>
                            )}
                          </>
                        ) : (
                          <div className="p-4 bg-amber-50/50 border border-amber-200/60 rounded-xl text-xs text-amber-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                            <span>当前接单状态为 <b>未提交</b>{isReadOnly ? '。' : '，请在截止日前尽快提交交付成果。'}</span>
                            {isMyRecord && !isFinished && !isReadOnly && (
                              <button
                                onClick={() => setSubmitModalOpen(true)}
                                className="px-4 py-1.5 bg-indigo-600 text-white font-extrabold text-xs rounded-xl hover:bg-indigo-500 cursor-pointer shadow-xs transition active:scale-95"
                              >
                                立即提交成果
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="pt-2 border-t border-slate-100 text-[11px] text-slate-400 italic">
                        受极客隐私保护协议保护，非本人或发布雇主不可查阅其他开发者的交付细节与源码文件。
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        )}

      </div>

      {/* 交付与验收弹窗挂载 */}
      <SubmitResultModal
        task={task}
        isOpen={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
        existingSubmission={isRejected ? mySubmission : undefined}
      />

      <TaskVerificationModal
        task={task}
        isOpen={verifyModalOpen}
        onClose={() => setVerifyModalOpen(false)}
      />
    </div>
  );
};
