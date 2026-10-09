import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { TaskItem, TaskSubmissionRecord } from '../../types';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText,
  Clock,
  AlertCircle,
  Plus,
  ShieldCheck,
  Check,
  Eye,
  Send,
  Users,
  Award,
  RotateCcw,
  Trash2,
  CheckCircle2,
  XCircle,
  Zap,
  Palette,
  Edit3
} from 'lucide-react';
import { TaskDetailSubPage } from '../tasks/TaskDetailSubPage';
import { TaskVerificationModal } from '../tasks/TaskVerificationModal';
import { SubmitResultModal } from '../tasks/SubmitResultModal';
import { MySubmissionModal } from '../tasks/MySubmissionModal';
import { UserTaskPublishForm } from '../tasks/UserTaskPublishForm';

export const WorkspaceTasks: React.FC = () => {
  const { tasks, user, withdrawTask, deleteTask, showToast } = useApp();

  // 主切换: 我发布的任务 | 我接单的任务
  const [activeTab, setActiveTab] = useState<'published' | 'undertaken'>('published');
  
  // 我发布的任务 状态过滤: 全部 | 审核中 | 进行中 | 已驳回 | 已结束
  const [publishedFilter, setPublishedFilter] = useState<string>('全部');

  // 我接单的任务 状态过滤: 全部 | 进行中 | 已结束
  const [undertakenFilter, setUndertakenFilter] = useState<string>('全部');

  // 二级页面与弹窗控制
  const [detailTaskId, setDetailTaskId] = useState<string | null>(null);
  const [isCreatingTask, setIsCreatingTask] = useState<boolean>(false);
  const [verifyTaskId, setVerifyTaskId] = useState<string | null>(null);
  const verifyTask = useMemo(() => tasks.find(t => t.id === verifyTaskId) || null, [tasks, verifyTaskId]);
  const [submitTask, setSubmitTask] = useState<TaskItem | null>(null);
  const [resubmitSub, setResubmitSub] = useState<TaskSubmissionRecord | null>(null);
  const [mySubmissionTask, setMySubmissionTask] = useState<TaskItem | null>(null);
  const [mySubmissionRecord, setMySubmissionRecord] = useState<TaskSubmissionRecord | null>(null);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // 1. 我发布的任务数据
  const myPublishedTasks = useMemo(() => {
    return tasks.filter(t => 
      t.publisher === user.name || 
      t.publisher.includes('你') || 
      t.publisher.includes('极客小千')
    );
  }, [tasks, user.name]);

  // 2. 我承接的任务数据
  const myUndertakenTasks = useMemo(() => {
    return tasks.filter(t => 
      (t.takers || []).some(tk => 
        tk.username === user.name || 
        tk.username.includes('你') || 
        tk.username.includes('极客小千')
      )
    );
  }, [tasks, user.name]);

  // 过滤后的发布任务
  const filteredPublishedTasks = useMemo(() => {
    return myPublishedTasks.filter(t => {
      if (publishedFilter === '全部') return true;
      if (publishedFilter === '审核中') return t.status === '审核中';
      if (publishedFilter === '进行中') return t.status === '进行中' || t.status === '已发布';
      if (publishedFilter === '已驳回') return t.status === '已驳回';
      if (publishedFilter === '已结束') return t.status === '已结束' || t.status === '已验收';
      return true;
    });
  }, [myPublishedTasks, publishedFilter]);

  // 过滤后的接单任务
  const filteredUndertakenTasks = useMemo(() => {
    return myUndertakenTasks.filter(t => {
      const isFinished = t.status === '已结束' || t.status === '已验收' || (t.endTime && new Date(t.endTime) < new Date());
      const myRecord = (t.takers || []).find(tk => tk.username === user.name || tk.username.includes('你') || tk.username.includes('极客小千'));
      const mySub = (t.submissions || []).find(s => s.username === user.name || s.username.includes('你') || s.username.includes('极客小千'));
      const isRejected = !isFinished && (mySub?.status === '已驳回' || myRecord?.status === '已驳回');

      if (undertakenFilter === '全部') return true;
      if (undertakenFilter === '进行中') {
        return !isFinished;
      }
      if (undertakenFilter === '已结束') {
        return isFinished;
      }
      return true;
    });
  }, [myUndertakenTasks, undertakenFilter, user.name]);

  const publishedFilterList = ['全部', '审核中', '进行中', '已驳回', '已结束'];
  const undertakenFilterList = ['全部', '进行中', '已结束'];

  // If publishing or editing task, render UserTaskPublishForm
  if (isCreatingTask || editingTask) {
    return (
      <UserTaskPublishForm
        initialTask={editingTask}
        fromTitle="我的已发布任务"
        onBack={() => {
          setIsCreatingTask(false);
          setEditingTask(null);
        }}
      />
    );
  }

  // If Task Detail Subpage is active, render TaskDetailSubPage
  if (detailTaskId) {
    return (
      <TaskDetailSubPage
        taskId={detailTaskId}
        fromTitle={activeTab === 'published' ? '我的已发布任务' : '我接单的任务'}
        onBack={() => setDetailTaskId(null)}
      />
    );
  }

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* 顶部主选项卡切换 + 发布任务入口 */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-slate-100/90 p-1.5 rounded-xl border border-slate-200/80">
          <button
            onClick={() => setActiveTab('published')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'published'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            我发布的任务 ({myPublishedTasks.length})
          </button>
          <button
            onClick={() => setActiveTab('undertaken')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
              activeTab === 'undertaken'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-bold'
            }`}
          >
            我接单的任务 ({myUndertakenTasks.length})
          </button>
        </div>

        <button
          onClick={() => setIsCreatingTask(true)}
          className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs shadow-sm shadow-indigo-600/20 transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>发布新需求</span>
        </button>
      </div>

      {/* 视角一：我发布的任务 */}
      {activeTab === 'published' && (
        <div className="space-y-4">
          {/* 子状态筛选标签: 全部 / 审核中 / 进行中 / 已驳回 / 已结束 */}
          <div className="flex flex-wrap items-center gap-2 px-1">
            <span className="text-xs text-slate-400 font-bold mr-1">状态筛选:</span>
            {publishedFilterList.map(f => (
              <button
                key={f}
                onClick={() => setPublishedFilter(f)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  publishedFilter === f
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredPublishedTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">暂无符合条件的发布任务</p>
              <button
                onClick={() => setIsCreatingTask(true)}
                className="mt-4 px-5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-500 cursor-pointer"
              >
                立即发布任务
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredPublishedTasks.map(task => {
                const pendingCount = (task.submissions || []).filter(s => s.status === '待验收').length;
                const isFinished = task.status === '已结束' || task.status === '已验收';
                const isAuditing = task.status === '审核中';
                const isRejected = task.status === '已驳回';

                return (
                  <div
                    key={task.id}
                    className="bg-white rounded-2xl p-6 border border-slate-200 hover:border-slate-300 shadow-2xs space-y-4 transition"
                  >
                    {/* 头部：标题 + 领域/难度 + 任务状态标签 */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* 所属领域与难度 */}
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            {task.domain}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                            {task.difficulty}难度
                          </span>

                          {/* 任务状态 */}
                          <span
                            className={`px-2.5 py-0.5 rounded-md text-[11px] font-black ${
                              isAuditing
                                ? 'bg-amber-100 text-amber-800'
                                : isRejected
                                ? 'bg-red-100 text-red-700'
                                : task.refunded
                                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                                : isFinished
                                ? 'bg-slate-200 text-slate-600'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {task.refunded ? '已退款结束' : isFinished ? '已结束' : task.status}
                          </span>

                          {/* 详细到期退款分类标记 */}
                          {task.refunded && (task.takers || []).length === 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                              无人接单到期
                            </span>
                          )}

                          {task.refunded && (task.takers || []).length > 0 && (task.submissions || []).length === 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-orange-50 text-orange-700 border border-orange-200">
                              接单超时未提交
                            </span>
                          )}

                          {task.refunded && (task.submissions || []).length > 0 && (
                            <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                              成果全驳回到期
                            </span>
                          )}

                          {pendingCount > 0 && !isFinished && (
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-red-500 text-white animate-pulse">
                              {pendingCount} 份成果待验收
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900">{task.title}</h3>
                      </div>

                      {/* 右侧赏金预算 */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black font-mono text-indigo-600">
                          ¥{(task.cashReward || 0).toLocaleString()}
                        </div>
                        <div className="text-[11px] text-slate-400 font-medium">
                          {(task.pointsReward || 0) > 0 ? `+${task.pointsReward} 积分` : '赏金预算'}
                        </div>
                        {(isAuditing || task.status === '进行中') && (
                          <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-50 text-[10px] font-bold text-indigo-700 border border-indigo-200/80">
                            <span>资金与积分托管中</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 基本信息行：周期、时间和单份奖励 */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs font-medium text-slate-600">
                      <div>开始时间：<span className="font-mono text-slate-800 font-bold">{task.startTime?.split(' ')[0]}</span></div>
                      <div>结束时间：<span className="font-mono text-slate-800 font-bold">{task.endTime?.split(' ')[0]}</span></div>
                      <div>单份现金：<span className="font-mono text-indigo-600 font-bold">¥{task.cashReward}</span></div>
                      <div>单份积分：<span className="font-mono text-amber-600 font-bold">{task.pointsReward} 个</span></div>
                    </div>

                    {/* 被驳回原因 */}
                    {isRejected && task.rejectReason && (
                      <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
                        <span className="font-black">驳回原因：</span>{task.rejectReason}
                      </div>
                    )}

                    {/* 获胜极客信息 */}
                    {isFinished && task.winner && (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Award className="w-4 h-4 text-emerald-600" />
                          <span>已验收获胜极客：<span className="font-extrabold">{task.winner.username}</span>，预付赏金已全额发放。</span>
                        </div>
                      </div>
                    )}

                    {/* 到期全部驳回全额退款信息 */}
                    {isFinished && task.refunded && (
                      <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
                          <span>{task.refundReason || '任务已到期结束，发布人已驳回所有交付成果，任务预付金额和积分已全额退还至发布人账户。'}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-200/90 text-amber-950 text-[10px] font-black shrink-0">
                          已全额退款
                        </span>
                      </div>
                    )}

                    {/* 接单极客团队/列表 */}
                    {(task.takers || []).length > 0 ? (
                      <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-bold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-indigo-500" />
                            接单极客 ({(task.takers || []).length}人):
                          </span>
                          <div className="flex items-center -space-x-1.5 overflow-hidden">
                            {(task.takers || []).map((tk, idx) => (
                              <img
                                key={tk.id || idx}
                                src={tk.userAvatar}
                                alt={tk.username}
                                title={`${tk.username} (${tk.status})`}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover shadow-2xs"
                                referrerPolicy="no-referrer"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(task.takers || []).map((tk, idx) => {
                            const isTaskDone = task.status === '已结束' || task.status === '已验收' || !!task.winner;
                            const tkWinner = task.winner?.username === tk.username || tk.status === '已验收';
                            const tkRejected = tk.status === '已驳回';
                            const tkHasSub = (task.submissions || []).some(s => s.username === tk.username || s.id === tk.submissionId);

                            let statusText: string = tk.status;
                            if (tkWinner) {
                              statusText = '已验收';
                            } else if (tkRejected) {
                              statusText = '已驳回';
                            } else if (isTaskDone) {
                              if (tk.status === '成果未通过' || tkHasSub || tk.status === '已提交') {
                                statusText = '成果未通过';
                              } else {
                                statusText = '未提交';
                              }
                            } else if (tk.status === '已接单' && !tkHasSub) {
                              statusText = '未提交';
                            }

                            return (
                              <span key={tk.id || idx} className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-medium flex items-center gap-1">
                                <span>{tk.username}</span>
                                <span className={`text-[10px] font-bold ${
                                  statusText === '已验收' ? 'text-emerald-600' :
                                  statusText === '已提交' ? 'text-indigo-600' :
                                  statusText === '已驳回' ? 'text-rose-500' :
                                  statusText === '成果未通过' ? 'text-rose-600' : 'text-slate-400'
                                }`}>({statusText})</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    ) : task.refunded ? (
                      <div className="p-3 bg-slate-50/80 border border-slate-200/80 rounded-xl text-xs text-slate-500 flex items-center gap-2 font-medium">
                        <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>接单情况：该任务公示周期内无人接单，已到期结束并全额退款。</span>
                      </div>
                    ) : null}

                    {/* 底部操作行 */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-4 text-slate-500 font-medium">
                        <span>已接单: {(task.takers || []).length} 人</span>
                        <span>已提交成果: {(task.submissions || []).length} 份</span>
                        <span>发布时间: {task.publishTime}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* 1. 查看详情 */}
                        <button
                          onClick={() => setDetailTaskId(task.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                        >
                          查看详情
                        </button>

                        {/* 2. 去验收 / 到期验收评审 / 查看退款详情 / 查看验收结果 */}
                        {!task.winner && !task.refunded && ((task.submissions || []).length > 0 || (task.takers || []).length > 0) && (
                          <button
                            onClick={() => setVerifyTaskId(task.id)}
                            className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>{isFinished ? '到期验收评审' : '去验收'} ({pendingCount})</span>
                          </button>
                        )}

                        {task.refunded && (
                          <button
                            onClick={() => setVerifyTaskId(task.id)}
                            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>{(task.submissions || []).length > 0 ? '查看驳回与退款详情' : '查看退款详情'}</span>
                          </button>
                        )}

                        {task.winner && (
                          <button
                            onClick={() => setVerifyTaskId(task.id)}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>查看验收结果</span>
                          </button>
                        )}

                        {/* 3. 编辑再发布 (针对被驳回任务) */}
                        {isRejected && (
                          <button
                            onClick={() => setEditingTask(task)}
                            className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>编辑再发布</span>
                          </button>
                        )}

                        {/* 4. 删除任务 (针对审核中和被驳回任务，删除后后台同步删除) */}
                        {(isAuditing || isRejected) && (
                          <button
                            onClick={() => {
                              if (window.confirm(`确定要彻底删除任务【${task.title}】吗？删除后后台对应数据也将同步完全删除。`)) {
                                deleteTask(task.id);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>删除</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 视角二：我接单的任务 */}
      {activeTab === 'undertaken' && (
        <div className="space-y-4">
          {/* 子状态筛选标签: 只有 进行中 | 已结束 两个状态 */}
          <div className="flex items-center gap-2 px-1">
            <span className="text-xs text-slate-400 font-bold mr-1">分类状态:</span>
            {undertakenFilterList.map(f => (
              <button
                key={f}
                onClick={() => setUndertakenFilter(f)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  undertakenFilter === f
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          {filteredUndertakenTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-16 text-center border border-slate-200">
              <FileText className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">暂无此状态下的接单需求</p>
              <p className="text-xs text-slate-400 mt-1">前往任务大厅寻找适合您的开发需求接单参与</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredUndertakenTasks.map(task => {
                const myRecord = (task.takers || []).find(tk => tk.username === user.name || tk.username.includes('你') || tk.username.includes('极客小千'));
                const mySub = (task.submissions || []).find(s => s.username === user.name || s.username.includes('你') || s.username.includes('极客小千'));
                const isFinished = task.status === '已结束' || task.status === '已验收' || (task.endTime && new Date(task.endTime) < new Date());
                const isWinner = task.winner?.username === myRecord?.username || task.winner?.username === user.name || mySub?.status === '已通过' || myRecord?.status === '已验收';
                const isRejected = mySub?.status === '已驳回' || myRecord?.status === '已驳回';
                const hasSubmitted = !!mySub || myRecord?.status === '已提交' || myRecord?.status === '已验收' || myRecord?.status === '已驳回' || myRecord?.status === '成果未通过';

                return (
                  <div
                    key={task.id}
                    className={`bg-white rounded-2xl p-6 border shadow-2xs space-y-4 transition ${
                      isFinished && isWinner
                        ? 'border-emerald-300 bg-emerald-50/20'
                        : isRejected
                        ? 'border-rose-200 hover:border-rose-300'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200/60">
                            {task.domain}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-bold bg-slate-100 text-slate-700">
                            {task.difficulty}难度
                          </span>

                          {/* 列表项中的 通过验收 / 成果未通过 / 已驳回 / 进行中 显著标记 */}
                          {isFinished ? (
                            <>
                              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-slate-500 text-white shadow-2xs">
                                已结束
                              </span>
                              {isWinner ? (
                                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1 shadow-2xs">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  <span>通过验收</span>
                                </span>
                              ) : isRejected ? (
                                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 shadow-2xs">
                                  <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                  <span>已驳回</span>
                                </span>
                              ) : !hasSubmitted ? (
                                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                                  <span>未提交</span>
                                </span>
                              ) : (
                                <span className="px-3 py-0.5 rounded-full text-xs font-black bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                                  <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
                                  <span>成果未通过</span>
                                </span>
                              )}
                            </>
                          ) : isRejected ? (
                            <>
                              <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-500 text-white shadow-2xs">
                                进行中
                              </span>
                              <span className="px-3 py-0.5 rounded-full text-xs font-black bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1 shadow-2xs">
                                <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
                                <span>成果被驳回</span>
                              </span>
                            </>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-extrabold bg-emerald-500 text-white shadow-2xs">
                              进行中
                            </span>
                          )}
                        </div>

                        <h3 className="text-base font-extrabold text-slate-900">{task.title}</h3>
                      </div>

                      {/* 赏金展示 */}
                      <div className="text-right shrink-0">
                        <div className="text-sm font-black font-mono text-emerald-600">
                          +¥{(task.cashReward || 0).toLocaleString()}
                        </div>
                        {(task.pointsReward || 0) > 0 && (
                          <div className="text-[11px] font-bold text-amber-600">
                            +{task.pointsReward} 积分
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 被驳回状态：展示驳回意见与重提引导提示栏 */}
                    {isRejected && (
                      <div className="p-4 bg-rose-50/90 border border-rose-200 rounded-2xl space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-rose-800 font-black">
                            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            <span>雇主验收驳回意见：</span>
                          </div>
                          <span className="text-[11px] font-bold text-rose-600 bg-rose-100/80 px-2.5 py-0.5 rounded-md">
                            任务未验收 · 支持修改后重新提交
                          </span>
                        </div>
                        <p className="text-rose-700 leading-relaxed font-medium pl-6 bg-white/80 p-2.5 rounded-xl border border-rose-100">
                          {mySub?.rejectReason || '成果未完全达到验收指标要求，请根据需求规范调整修改后重新提交。'}
                        </p>
                      </div>
                    )}

                    {/* 其他接单极客与竞标状态 */}
                    {(task.takers || []).length > 0 && (
                      <div className="p-3 bg-slate-50/80 border border-slate-100 rounded-xl flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 font-bold flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-indigo-500" />
                            接单极客团队 ({(task.takers || []).length}人):
                          </span>
                          <div className="flex items-center -space-x-1.5 overflow-hidden">
                            {(task.takers || []).map((tk, idx) => (
                              <img
                                key={tk.id || idx}
                                src={tk.userAvatar}
                                alt={tk.username}
                                title={`${tk.username} (${tk.status})`}
                                className="inline-block h-6 w-6 rounded-full ring-2 ring-white object-cover shadow-2xs"
                                referrerPolicy="no-referrer"
                              />
                            ))}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          {(task.takers || []).map((tk, idx) => {
                            const isMe = tk.username === user.name || tk.username.includes('你') || tk.username.includes('极客小千');
                            const tkWinner = task.winner?.username === tk.username || tk.status === '已验收';
                            const tkRejected = tk.status === '已驳回';
                            const tkHasSub = (task.submissions || []).some(s => s.username === tk.username || s.id === tk.submissionId);
                            let tkStatusLabel: string = tk.status;
                            if (tkWinner) {
                              tkStatusLabel = '已验收';
                            } else if (tkRejected) {
                              tkStatusLabel = '已驳回';
                            } else if (isFinished) {
                              if (tk.status === '成果未通过' || tkHasSub || tk.status === '已提交') {
                                tkStatusLabel = '成果未通过';
                              } else {
                                tkStatusLabel = '未提交';
                              }
                            } else if (tk.status === '已接单' && !tkHasSub) {
                              tkStatusLabel = '未提交';
                            }

                            return (
                              <span key={tk.id || idx} className={`px-2 py-0.5 rounded-md text-[11px] font-medium flex items-center gap-1 ${
                                isMe ? 'bg-indigo-50 border border-indigo-200 text-indigo-700 font-bold' : 'bg-white border border-slate-200 text-slate-700'
                              }`}>
                                <span>{tk.username}</span>
                                <span className={`text-[10px] font-bold ${
                                  tkStatusLabel === '已验收' ? 'text-emerald-600' :
                                  tkStatusLabel === '已提交' ? 'text-indigo-600' :
                                  tkStatusLabel === '已驳回' ? 'text-rose-500' :
                                  tkStatusLabel === '成果未通过' ? 'text-rose-600' : 'text-slate-400'
                                }`}>({tkStatusLabel})</span>
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* 雇主与接单基础信息 */}
                    <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3 text-slate-500 font-medium">
                        <span>发布雇主：<strong className="text-slate-800">{task.publisher}</strong></span>
                        <span>· 接单时间：{myRecord?.takeTime || '近期'}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* 查看详情 */}
                        <button
                          onClick={() => setDetailTaskId(task.id)}
                          className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold transition cursor-pointer"
                        >
                          查看详情
                        </button>

                        {/* 查看我的成果 (若曾提交过) */}
                        {hasSubmitted && (
                          <button
                            onClick={() => {
                              const sub = (task.submissions || []).find(s => 
                                s.username === user.name || 
                                s.username.includes('你') || 
                                s.username.includes('极客小千')
                              ) || (task.submissions || [])[0];

                              setMySubmissionTask(task);
                              setMySubmissionRecord(sub || {
                                id: `sub_${task.id}`,
                                taskId: task.id,
                                username: `${user.name} (你)`,
                                userAvatar: user.avatar,
                                submitTime: '近期',
                                notes: '已提交项目源码包、测试文档与环境交付配置说明。',
                                files: [{ id: `f_${task.id}`, name: `${task.title}_交付源码.zip`, size: '8.5 MB' }],
                                status: isWinner ? '已通过' : isRejected ? '已驳回' : (isFinished ? '成果未通过' : '待验收'),
                                rejectReason: mySub?.rejectReason
                              });
                            }}
                            className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 text-indigo-700 font-bold transition flex items-center gap-1 cursor-pointer"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            <span>查看我的成果</span>
                          </button>
                        )}

                        {/* 被驳回后：修改成果重新提交 */}
                        {!isFinished && isRejected && (
                          <button
                            onClick={() => {
                              setResubmitSub(mySub || null);
                              setSubmitTask(task);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span>修改重新提交</span>
                          </button>
                        )}

                        {/* 首次提交交付成果 (若进行中且未提交且未被驳回) */}
                        {!isFinished && !hasSubmitted && !isRejected && (
                          <button
                            onClick={() => {
                              setResubmitSub(null);
                              setSubmitTask(task);
                            }}
                            className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold shadow-2xs transition flex items-center gap-1 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" />
                            <span>提交交付成果</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 各类弹窗挂载 */}
      <TaskVerificationModal
        task={verifyTask}
        isOpen={!!verifyTask}
        onClose={() => setVerifyTaskId(null)}
      />

      <SubmitResultModal
        task={submitTask}
        isOpen={!!submitTask}
        onClose={() => {
          setSubmitTask(null);
          setResubmitSub(null);
        }}
        existingSubmission={resubmitSub}
      />

      <MySubmissionModal
        task={mySubmissionTask}
        submission={mySubmissionRecord}
        isOpen={!!mySubmissionTask && !!mySubmissionRecord}
        onClose={() => {
          setMySubmissionTask(null);
          setMySubmissionRecord(null);
        }}
        onResubmit={() => {
          const targetTask = mySubmissionTask;
          const targetSub = mySubmissionRecord;
          setMySubmissionTask(null);
          setMySubmissionRecord(null);
          if (targetTask) {
            setResubmitSub(targetSub);
            setSubmitTask(targetTask);
          }
        }}
      />
    </div>
  );
};
