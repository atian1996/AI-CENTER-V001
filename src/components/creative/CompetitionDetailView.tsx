import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CompetitionItem, MatchTrackItem } from '../../types';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  Sparkles, 
  ExternalLink, 
  Trophy, 
  FileText, 
  Layers, 
  ShieldAlert, 
  BarChart3, 
  Palette, 
  Rocket, 
  CheckCircle2, 
  Clock, 
  Eye, 
  Play, 
  Award, 
  Users, 
  TrendingUp, 
  FileCheck,
  Heart,
  ChevronRight,
  Share2,
  Bookmark
} from 'lucide-react';

interface CompetitionDetailViewProps {
  competition: CompetitionItem;
  onBack: () => void;
}

export const getCompetitionLinkByType = (typeOrName: string): string => {
  const str = (typeOrName || '').toLowerCase();
  if (str.includes('挑战') || str.includes('安全') || str.includes('ctf') || str.includes('agentctf')) {
    return 'http://10.2.89.1/saas/contest/agentctf/d6a21329d479860493c6f3a6aeee9896';
  }
  if (str.includes('数据科学') || str.includes('时序')) {
    return 'http://10.2.89.1/saas/contest/web/contest/ai/enter/805f06cb51fea51263cf33ea15c2b1f6/rank';
  }
  if (str.includes('aigc') || str.includes('生成') || str.includes('创作') || str.includes('营销')) {
    return 'http://10.2.89.1/competitions-hall/competitions/aia-race-detail/40f258969d2e43858383b6e5a7423e3a';
  }
  if (str.includes('产品') || str.includes('创新') || str.includes('应用') || str.includes('原生')) {
    return 'http://10.2.89.1/competitions-hall/competitions/aia-race-detail/1973c668ec1a4bd2aae36e2a3043890d';
  }
  return 'http://10.2.89.1/competitions-hall/competitions/aia-race-detail/1973c668ec1a4bd2aae36e2a3043890d';
};

export const CompetitionDetailView: React.FC<CompetitionDetailViewProps> = ({ competition, onBack }) => {
  const { showToast } = useApp();

  // TAB 状态：'intro' 代表固定赛事介绍；其他值为 track.id
  const [activeTabId, setActiveTabId] = useState<string>('intro');

  // 作品点赞状态存储
  const [likedWorks, setLikedWorks] = useState<Record<string, boolean>>({});

  // 作品阅览弹窗预览
  const [previewWork, setPreviewWork] = useState<any | null>(null);

  const getStatusBadge = (status: CompetitionItem['status']) => {
    switch (status) {
      case 'ongoing':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500 text-white shadow-xs flex items-center gap-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 rounded-full bg-white" />
            进行中
          </span>
        );
      case 'unstarted':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-white shadow-xs flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            未开始
          </span>
        );
      case 'ended':
        return (
          <span className="px-3 py-1 rounded-full text-xs font-black bg-slate-500 text-white shadow-xs flex items-center gap-1.5">
            已结束
          </span>
        );
    }
  };

  const getTypeTagStyle = (tag: string) => {
    switch (tag) {
      case 'AI数据科学赛':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200';
      case 'AI安全挑战赛':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'AIGC生成赛':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'AI产品创新赛':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const handleEnterMatch = (track: MatchTrackItem) => {
    const targetUrl = track.targetUrl || getCompetitionLinkByType(track.typeTag || track.name);
    showToast(`正在跳转进入【${track.name}】官方参赛平台...`);
    window.open(targetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleToggleLike = (workId: string) => {
    setLikedWorks(prev => {
      const isLiked = !!prev[workId];
      if (!isLiked) {
        showToast('已为该参赛作品点赞投票！');
      }
      return { ...prev, [workId]: !isLiked };
    });
  };

  const activeTrack = competition.tracks.find(t => t.id === activeTabId);

  // 大赛时间节点列表计算 (参考用户上传设计图)
  const timelineNodes = useMemo(() => {
    if (competition.introduction.schedule && competition.introduction.schedule.length > 0) {
      return competition.introduction.schedule.map((s, idx) => {
        let name = s.stage.replace(/^第[一二三四五\d]+阶段[：:]\s*/, '').trim();
        if (idx === 0 && !name.includes('报名')) name = '比赛报名';
        else if (idx === 1 && !name.includes('初赛')) name = '线上初赛';
        else if (idx === 2 && !name.includes('决赛')) name = '决赛提交期';

        let time = s.time;
        if (time.includes('~')) {
          const parts = time.split('~').map(p => p.trim());
          const formatPart = (p: string, isEnd = false) => {
            if (p.length === 16) {
              return `${p}:00`;
            } else if (p.length === 10) {
              return isEnd ? `${p} 23:59:59` : `${p} 00:00:00`;
            }
            return p;
          };
          time = `${formatPart(parts[0], false)} ~ ${formatPart(parts[1], true)}`;
        }
        return { name, time };
      });
    }

    return [
      { name: '比赛报名', time: '2026-07-01 00:00:00 ~ 2026-07-31 23:59:59' },
      { name: '线上初赛', time: '2026-08-01 09:00:00 ~ 2026-08-21 09:00:00' },
      { name: '决赛提交期', time: '2026-09-01 00:00:00 ~ 2026-09-30 00:00:00' }
    ];
  }, [competition]);

  return (
    <div id="competition-detail-container" className="w-full space-y-6 animate-fade-in pb-16 select-none font-sans">
      
      {/* 顶部返回与快捷操作栏 */}
      <div className="flex items-center justify-between gap-4">
        <button
          id="back-to-competitions-list-btn"
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/50 text-slate-700 hover:text-indigo-600 text-xs font-extrabold shadow-2xs transition-all cursor-pointer group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span>返回赛事列表</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => showToast('赛事链接已复制到剪贴板，快分享给队友吧！')}
            className="px-3.5 py-2 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>分享赛事</span>
          </button>
          <button
            onClick={() => showToast('已收藏该赛事，将在开赛/评测关键节点提醒您！')}
            className="px-3.5 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-600 text-xs font-bold flex items-center gap-1.5 shadow-2xs hover:bg-indigo-100 transition cursor-pointer"
          >
            <Bookmark className="w-3.5 h-3.5" />
            <span>关注赛事</span>
          </button>
        </div>
      </div>

      {/* 顶部长条 BANNER 与赛事主标题区 */}
      <div className="relative rounded-3xl overflow-hidden border border-slate-200/90 bg-slate-900 shadow-lg">
        {/* 长条 BANNER 图片 */}
        <div className="relative w-full h-56 sm:h-72 lg:h-80 overflow-hidden">
          <img 
            src={competition.bannerImage} 
            alt={competition.title}
            className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/40" />
          
          {/* BANNER 内部浮动信息 */}
          <div className="absolute bottom-6 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2">
                {getStatusBadge(competition.status)}
              </div>

              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight drop-shadow-md">
                {competition.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-300 font-medium">
                <div className="flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-indigo-400" />
                  <span>主办方：<strong className="text-white font-bold">{competition.organizer}</strong></span>
                  {competition.organizerBadge && (
                    <span className="px-2 py-0.5 rounded-md bg-indigo-500/30 text-indigo-200 text-[10px] font-bold border border-indigo-400/40">
                      {competition.organizerBadge}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 font-mono text-slate-300">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>赛事周期：{competition.startTime} ~ {competition.endTime}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* 赛事多 TAB 导航切换栏 */}
      <div id="competition-detail-tabs-bar" className="bg-white rounded-2xl border border-slate-200/90 p-2 shadow-2xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* TAB 1: 赛事介绍 (固定存在) */}
          <button
            id="tab-competition-intro"
            onClick={() => setActiveTabId('intro')}
            className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
              activeTabId === 'intro'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>赛事介绍</span>
          </button>

          {/* 比赛 TAB 1 ~ N: TAB 名称去数字序号、去掉“赛道”改为“赛”、去掉右侧灰色模式标签 */}
          {competition.tracks.map((track) => {
            const isActive = activeTabId === track.id;
            const displayTabName = track.shortName.replace(/赛道$/, '赛').replace(/赛道/g, '赛');
            return (
              <button
                key={track.id}
                id={`tab-match-track-${track.id}`}
                onClick={() => setActiveTabId(track.id)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 scale-[1.02]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{displayTabName}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 内容展示与全局同级侧栏 (大赛时间节点) */}
      <div className="flex flex-col lg:flex-row items-start gap-6">
        
        {/* 左侧主要 TAB 视图内容 (随 TAB 切换变化) */}
        <div className="flex-1 min-w-0 space-y-6 w-full">
          
          {/* ========================================================================= */}
          {/* 1. 赛事介绍 TAB 固定内容                                                  */}
          {/* ========================================================================= */}
          {activeTabId === 'intro' && (
            <div id="tab-content-intro" className="space-y-6">
              
              {/* 赛事简介 */}
              <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100 flex items-center justify-center font-bold">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">赛事简介</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal text-justify">
                  {competition.introduction.summary}
                </p>
              </div>

              {/* 赛事流程与阶段 */}
              <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-cyan-50 text-cyan-600 border border-cyan-100 flex items-center justify-center font-bold">
                    <Clock className="w-4 h-4" />
                  </div>
                  <h3 className="text-base font-black text-slate-900">赛事日程与流程规划</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {competition.introduction.schedule.map((item, idx) => (
                    <div 
                      key={idx} 
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2 relative overflow-hidden group hover:bg-indigo-50/40 hover:border-indigo-200 transition"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-indigo-100 text-indigo-700">
                          阶段 0{idx + 1}
                        </span>
                        <span className="text-[11px] font-mono text-slate-400 font-bold">
                          {item.time.split(' ~ ')[0].split(' ')[0]}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {item.stage}
                      </h4>

                      <div className="text-[11px] font-mono text-indigo-600 font-bold">
                        {item.time}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed pt-1">
                        {item.desc}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 奖项设置 */}
              <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
                <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center font-bold">
                    <Award className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">奖项与激励设置</h3>
                    <p className="text-xs text-slate-500 font-medium">总奖池超 20 万元现金奖励、算力补贴与大厂推优直通车</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {competition.introduction.awards.map((award, idx) => (
                    <div 
                      key={idx}
                      className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3 hover:shadow-md hover:-translate-y-0.5 transition-all relative overflow-hidden"
                    >
                      <div className="flex items-center justify-between">
                        <div className={`w-9 h-9 rounded-xl bg-gradient-to-tr ${award.iconBg || 'from-amber-400 to-amber-600'} text-white flex items-center justify-center font-black shadow-xs`}>
                          <Trophy className="w-4 h-4" />
                        </div>
                        <span className="text-[11px] font-extrabold text-slate-500">
                          {award.quota}
                        </span>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-slate-500">{award.rank}</div>
                        <div className="text-sm font-black text-amber-600 mt-1 leading-snug">
                          {award.reward}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 评审标准与组委会信息 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 评审标准 */}
                <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">评审标准与评分维度</h3>
                  </div>

                  <ul className="space-y-3">
                    {competition.introduction.evaluationStandards.map((std, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{std}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 组委会信息 */}
                <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
                    <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <h3 className="text-base font-black text-slate-900">组织机构与支持</h3>
                  </div>

                  <div className="space-y-3">
                    {competition.introduction.organizingCommittee.map((org, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/60">
                        <div className="text-[11px] text-slate-400 font-medium">{org.role}</div>
                        <div className="text-xs font-bold text-slate-800 mt-0.5">{org.name}</div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* 2. 比赛赛道 TAB 页内容 (顶部栏 + 比赛介绍 + 赛题/数据/指标 + 作品阅览)      */}
          {/* ========================================================================= */}
          {activeTrack && (
            <div id={`tab-content-track-${activeTrack.id}`} className="space-y-6">
              
              {/* 比赛 TAB 顶部栏 */}
              <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* 比赛封面小图 */}
                  <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border border-slate-200 shrink-0 shadow-2xs relative">
                    <img 
                      src={activeTrack.coverImage} 
                      alt={activeTrack.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1.5 left-1.5">
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border shadow-2xs ${getTypeTagStyle(activeTrack.typeTag)}`}>
                        {activeTrack.typeTag}
                      </span>
                    </div>
                  </div>

                  {/* 比赛名称与元信息 */}
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl font-black text-slate-900">
                        {activeTrack.name}
                      </h2>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>比赛周期：<strong className="text-slate-800 font-bold">{activeTrack.timeRange}</strong></span>
                    </div>

                    <div className="flex items-center gap-4 text-[11px] text-slate-500">
                      <span>👥 已报名参赛: <strong className="text-indigo-600 font-bold">{activeTrack.participantsCount || 300}</strong> 人</span>
                      <span>📤 累计提交次数: <strong className="text-slate-800 font-bold">{activeTrack.submissionsCount || 500}</strong> 次</span>
                    </div>
                  </div>
                </div>

                {/* 操作按钮区 */}
                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {/* 所有比赛都有【进入比赛】按钮 */}
                  <button
                    id={`enter-match-btn-${activeTrack.id}`}
                    onClick={() => handleEnterMatch(activeTrack)}
                    className="flex-1 md:flex-initial px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-black shadow-md shadow-indigo-200 flex items-center justify-center gap-2 cursor-pointer transition transform active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>进入比赛</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>

                  {/* AIGC生成赛和AI产品创新赛额外增加【作品阅览】按钮 */}
                  {(activeTrack.typeTag === 'AIGC生成赛' || activeTrack.typeTag === 'AI产品创新赛') && (
                    <button
                      id={`view-works-btn-${activeTrack.id}`}
                      onClick={() => {
                        const el = document.getElementById('match-featured-works-section');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth' });
                        } else {
                          showToast('正在加载当前赛道作品阅览库...');
                        }
                      }}
                      className="flex-1 md:flex-initial px-5 py-2.5 rounded-xl bg-white border border-purple-200 hover:border-purple-400 hover:bg-purple-50 text-purple-700 text-xs font-bold shadow-2xs flex items-center justify-center gap-2 cursor-pointer transition"
                    >
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span>作品阅览 ({activeTrack.featuredWorks?.length || 0})</span>
                    </button>
                  )}
                </div>

              </div>

              {/* 比赛介绍内容区 */}
              <div className="space-y-6">
                
                {/* 赛道概述 */}
                <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>【比赛介绍】</span>
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {activeTrack.description}
                  </p>
                </div>

                {/* 赛题说明 */}
                <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                  <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-600" />
                    <span>赛题任务与业务背景说明</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-800 leading-relaxed">
                    {activeTrack.problemStatement}
                  </div>
                </div>

                {/* 数据说明 */}
                {activeTrack.dataDescription && (
                  <div className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-emerald-600" />
                      <span>数据说明与下载指南</span>
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                      {activeTrack.dataDescription}
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={() => showToast('已成功通过安全网关获取数据集下载凭据！')}
                        className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-slate-500" />
                        <span>下载比赛基线数据集 (脱敏包)</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* 评估指标与规则说明 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 评估指标 */}
                  <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                    <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-indigo-600" />
                      <span>评估指标与排榜依据</span>
                    </h3>
                    <div className="p-3.5 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs text-indigo-950 leading-relaxed font-medium">
                      {activeTrack.evaluationMetrics}
                    </div>
                  </div>

                  {/* 规则说明 */}
                  {activeTrack.ruleDescription && (
                    <div className="p-6 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-3">
                      <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                        <ShieldAlert className="w-4 h-4 text-amber-600" />
                        <span>提交规则与合规要求</span>
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed">
                        {activeTrack.ruleDescription}
                      </p>
                    </div>
                  )}
                </div>

                {/* 算力与环境推荐 */}
                <div className="p-6 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl text-white shadow-md space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-black">官方赛事专属算力支持</span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-relaxed">
                    参赛选手拉起【算力工坊】GPU 容器可直接挂载官方评测镜像，免去配环境困扰。
                  </p>
                  <button
                    onClick={() => handleEnterMatch(activeTrack)}
                    className="w-full sm:w-auto px-6 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black shadow-xs cursor-pointer transition"
                  >
                    立即进入参赛平台
                  </button>
                </div>

              </div>

              {/* 作品阅览板块 (仅针对 AIGC生成赛与 AI产品创新赛) */}
              {(activeTrack.typeTag === 'AIGC生成赛' || activeTrack.typeTag === 'AI产品创新赛') && activeTrack.featuredWorks && activeTrack.featuredWorks.length > 0 && (
                <div id="match-featured-works-section" className="p-7 bg-white rounded-3xl border border-slate-200/90 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 border border-purple-100 flex items-center justify-center font-bold">
                        <Eye className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900">精选参赛作品阅览</h3>
                        <p className="text-xs text-slate-500 font-medium">浏览当前赛道选手提交的 AIGC 视觉与 AI 产品创新成果</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-slate-400 font-mono">
                      共 {activeTrack.featuredWorks.length} 个作品
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {activeTrack.featuredWorks.map((work) => {
                      const isLiked = !!likedWorks[work.id];
                      return (
                        <div 
                          key={work.id}
                          className="rounded-2xl border border-slate-200/80 overflow-hidden bg-slate-50/50 hover:shadow-md hover:border-purple-200 transition-all flex flex-col justify-between"
                        >
                          <div className="relative h-48 overflow-hidden group cursor-pointer" onClick={() => setPreviewWork(work)}>
                            <img 
                              src={work.image} 
                              alt={work.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                            
                            {work.score && (
                              <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[11px] font-black bg-amber-500 text-white shadow-xs">
                                🏆 初赛评测：{work.score}
                              </div>
                            )}

                            <div className="absolute bottom-3 left-4 right-4 text-white">
                              <h4 className="text-sm font-black drop-shadow-sm">{work.title}</h4>
                            </div>
                          </div>

                          <div className="p-4 space-y-3">
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                              {work.description}
                            </p>

                            <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                              <div className="flex items-center gap-2">
                                <img src={work.avatar} alt={work.author} className="w-5 h-5 rounded-full object-cover" />
                                <span className="text-xs font-bold text-slate-700">{work.author}</span>
                              </div>

                              <button
                                onClick={() => handleToggleLike(work.id)}
                                className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition ${
                                  isLiked
                                    ? 'bg-rose-50 text-rose-600 border border-rose-200'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                                }`}
                              >
                                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                                <span>{work.likes + (isLiked ? 1 : 0)}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

            </div>
          )}

        </div>

        {/* 右侧全局常驻侧栏：大赛时间节点 (与所有 TAB 处于同等层级，切换 TAB 不受影响) */}
        <div className="w-full lg:w-80 xl:w-96 shrink-0 space-y-6 lg:sticky lg:top-6">
          <div id="global-competition-timeline-nodes-card" className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
            <div className="px-5 py-3.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                <span>大赛时间节点</span>
              </h3>
            </div>

            <div className="p-5 space-y-0">
              {timelineNodes.map((node, index) => {
                const isLast = index === timelineNodes.length - 1;
                return (
                  <div key={index} className="relative flex items-start gap-3 pb-5 last:pb-1">
                    {/* 垂直连接线 */}
                    {!isLast && (
                      <div className="absolute left-[4.5px] top-[14px] bottom-0 w-[1.5px] bg-slate-200" />
                    )}

                    {/* 蓝色圆点 */}
                    <div className="relative z-10 w-2.5 h-2.5 rounded-full bg-blue-500 ring-4 ring-blue-50 shrink-0 mt-1" />

                    {/* 节点名称与时间 */}
                    <div className="space-y-0.5">
                      <h4 className="text-xs sm:text-sm font-semibold text-slate-800">
                        {node.name}
                      </h4>
                      <div className="text-[11px] sm:text-xs text-slate-400 font-mono tracking-tight">
                        {node.time}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </div>

      {/* 作品详情大图预览弹窗 */}
      {previewWork && (
        <div className="fixed inset-0 z-[100] overflow-y-auto flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
          <div className="bg-white rounded-3xl overflow-hidden max-w-2xl w-full border border-slate-200 shadow-2xl space-y-4 p-6 my-auto">
            <div className="flex items-center justify-between">
              <h3 className="font-black text-slate-900 text-base">{previewWork.title}</h3>
              <button 
                onClick={() => setPreviewWork(null)}
                className="p-1.5 rounded-xl bg-slate-100 text-slate-500 hover:text-slate-900 cursor-pointer"
              >
                ✕
              </button>
            </div>
            
            <div className="h-72 rounded-2xl overflow-hidden border border-slate-200">
              <img src={previewWork.image} alt={previewWork.title} className="w-full h-full object-cover" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                <span>作者：<strong className="text-slate-800">{previewWork.author}</strong></span>
                {previewWork.score && <span>评测得分：<strong className="text-amber-600">{previewWork.score}</strong></span>}
              </div>
              <p className="text-xs text-slate-700 leading-relaxed">{previewWork.description}</p>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => {
                  handleToggleLike(previewWork.id);
                  setPreviewWork(null);
                }}
                className="px-4 py-2 rounded-xl bg-rose-50 text-rose-600 font-bold text-xs border border-rose-200 cursor-pointer"
              >
                ❤️ 为 TA 点赞
              </button>
              <button
                onClick={() => setPreviewWork(null)}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs cursor-pointer"
              >
                关闭预览
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
