import React, { useMemo, useState } from 'react';
import {
  CertificationItem,
  CertificationLevel,
  CertificationSystemId
} from '../../types';
import {
  CERTIFICATION_SYSTEMS,
  MOCK_CERTIFICATIONS
} from '../../data/mockCertificationData';
import { CertificationDetailView } from './CertificationDetailView';
import {
  ArrowRight,
  Check,
  RotateCcw
} from 'lucide-react';

type SystemFilterValue = 'all' | CertificationSystemId;
type LevelFilterValue = 'all' | CertificationLevel;

const LEVEL_OPTIONS: { value: LevelFilterValue; label: string }[] = [
  { value: 'all', label: '全部等级' },
  { value: '初级', label: '初级' },
  { value: '中级', label: '中级' },
  { value: '高级', label: '高级' }
];

export const TrainingCertificationView: React.FC = () => {
  const [selectedSystem, setSelectedSystem] = useState<SystemFilterValue>('all');
  const [selectedLevel, setSelectedLevel] = useState<LevelFilterValue>('all');
  const [selectedCert, setSelectedCert] = useState<CertificationItem | null>(null);

  const systemCounts = useMemo(() => {
    const counts: Record<string, number> = { all: MOCK_CERTIFICATIONS.length };
    for (const sys of CERTIFICATION_SYSTEMS) {
      counts[sys.id] = MOCK_CERTIFICATIONS.filter((c) => c.systemId === sys.id).length;
    }
    return counts;
  }, []);

  const filteredCertifications = useMemo(() => {
    return MOCK_CERTIFICATIONS.filter((cert) => {
      if (selectedSystem !== 'all' && cert.systemId !== selectedSystem) return false;
      if (selectedLevel !== 'all' && cert.level !== selectedLevel) return false;
      return true;
    });
  }, [selectedSystem, selectedLevel]);

  const activeSystemMeta = useMemo(() => {
    if (selectedSystem === 'all') {
      return {
        name: '全部认证体系'
      };
    }
    return (
      CERTIFICATION_SYSTEMS.find((s) => s.id === selectedSystem) ?? {
        name: '全部认证体系'
      }
    );
  }, [selectedSystem]);

  const hasActiveFilter = selectedSystem !== 'all' || selectedLevel !== 'all';

  const handleResetFilters = () => {
    setSelectedSystem('all');
    setSelectedLevel('all');
  };

  // 进入二级详情页面
  if (selectedCert) {
    return (
      <CertificationDetailView
        certification={selectedCert}
        onBack={() => {
          setSelectedCert(null);
          window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        }}
      />
    );
  }

  return (
    <div className="w-full max-w-[1320px] mx-auto pb-16 pt-2 antialiased">
      {/* Page Title Header */}
      <header className="pb-8 border-b border-[var(--border-color)]">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-[32px] font-bold tracking-tight text-[var(--text-primary)] leading-tight">
            权威 AI 能力认证中心
          </h1>
          <p className="text-sm text-[var(--text-secondary)]">
            选择认证方向，查阅配套课程、能力评估与行业认可度。
          </p>
        </div>
      </header>

      {/* Main 2-Column Content: Left Certification Systems Sidebar + Right Certification Cards */}
      <div className="flex flex-col md:flex-row items-start gap-8 xl:gap-10 pt-8">
        {/* Left Sidebar: 认证体系方案 + 等级筛选（固定吸附在左侧视野内） */}
        <aside className="w-full md:w-[228px] lg:w-[236px] shrink-0 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-7rem)] md:overflow-y-auto space-y-7">
          {/* System Navigation */}
          <div>
            <h2 className="text-[15px] font-bold text-[var(--text-primary)] mb-3.5 px-1">
              认证体系方案
            </h2>
            <nav
              aria-label="认证体系筛选"
              className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-1 md:pb-0"
            >
              <button
                type="button"
                onClick={() => setSelectedSystem('all')}
                className={`theme-nav-item w-auto md:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium text-left transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                  selectedSystem === 'all'
                    ? 'theme-sidebar-active font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                }`}
              >
                <span>全部认证体系</span>
                <span className="text-xs opacity-70 tabular-nums">
                  {systemCounts.all}
                </span>
              </button>

              {CERTIFICATION_SYSTEMS.map((sys) => {
                const isActive = selectedSystem === sys.id;
                return (
                  <button
                    key={sys.id}
                    type="button"
                    onClick={() => setSelectedSystem(sys.id)}
                    className={`theme-nav-item w-auto md:w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-lg text-[13.5px] font-medium text-left transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      isActive
                        ? 'theme-sidebar-active font-semibold'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    <span className="truncate">{sys.name}</span>
                    <span className="text-xs opacity-70 tabular-nums shrink-0">
                      {systemCounts[sys.id] || 0}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Level Filter */}
          <div className="pt-5 border-t border-[var(--border-color)]">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-xs font-semibold text-[var(--text-secondary)]">
                认证等级
              </h3>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重置</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 md:grid-cols-2 gap-1.5">
              {LEVEL_OPTIONS.map((opt) => {
                const isActive = selectedLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedLevel(opt.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-[var(--brand-primary)] bg-[var(--brand-soft-bg)] text-[var(--brand-primary)] font-semibold'
                        : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-surface-hover)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Content Area: Certification Cards */}
        <section className="flex-1 min-w-0 w-full space-y-5">
          {/* Active Track Context Line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
            <div className="min-w-0">
              <div className="flex items-center gap-2.5">
                <h2 className="text-base font-bold text-[var(--text-primary)]">
                  {activeSystemMeta.name}
                </h2>
              </div>
            </div>
          </div>

          {/* Cards List */}
          {filteredCertifications.length > 0 ? (
            <div className="space-y-5">
              {filteredCertifications.map((cert) => {
                const levelDisplay = cert.levelCode
                  ? `${cert.levelCode} ${cert.level}`
                  : cert.level;

                return (
                  <article
                    key={cert.id}
                    className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--card-radius)] shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] p-6 sm:p-7 transition-all duration-200"
                  >
                    <div className="flex flex-col xl:flex-row items-stretch gap-6 xl:gap-8">
                      {/* Left Main Info Column */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between gap-4">
                        <div className="space-y-3.5">
                          {/* Level + Custom Tags Row (Directly show custom tag values without field label) */}
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border border-[var(--text-primary)]/30 bg-[var(--bg-surface-muted)] text-[var(--text-primary)] whitespace-nowrap">
                              {levelDisplay}
                            </span>
                            {cert.customTags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-normal border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] whitespace-nowrap"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>

                          {/* Certificate Title & Issuing Organizations */}
                          <div>
                            <h3 className="text-xl sm:text-[22px] font-bold text-[var(--text-primary)] tracking-tight leading-snug">
                              {cert.name}
                            </h3>
                            <p className="text-[13px] text-[var(--text-secondary)] mt-1.5">
                              颁发机构：{cert.issuingBodies.join(' · ')}
                            </p>
                          </div>

                          {/* Brief Intro (<= 100 chars) */}
                          <div className="bg-[var(--bg-surface-muted)] rounded-[10px] px-4 py-3.5 text-[13.5px] leading-[1.7] text-[var(--text-secondary)]">
                            {cert.briefIntro}
                          </div>
                        </div>

                        {/* Target Audience (<= 20 chars) + Action CTA */}
                        <div className="pt-1 space-y-4">
                          <div>
                            <div className="text-xs text-[var(--text-muted)]">适用人群</div>
                            <div className="text-[13.5px] font-medium text-[var(--text-primary)] mt-1">
                              {cert.targetAudience}
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-3.5">
                            <button
                              type="button"
                              onClick={() => setSelectedCert(cert)}
                              className="theme-btn-primary px-5 py-2.5 rounded-[10px] text-[13px] font-semibold inline-flex items-center gap-2 cursor-pointer whitespace-nowrap shrink-0"
                            >
                              <span>查看认证详情</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Right Core Capabilities Panel */}
                      <div className="w-full xl:w-[368px] shrink-0 bg-[var(--bg-surface-muted)] rounded-[10px] p-5 flex flex-col">
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-xs font-semibold text-[var(--text-secondary)]">
                              核心能力
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-2.5">
                            {cert.coreCapabilities.map((capability) => (
                              <div
                                key={capability}
                                className="bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg px-3 py-2.5 flex items-center gap-2 text-[12.5px] font-medium text-[var(--text-primary)]"
                              >
                                <Check
                                  className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                                  strokeWidth={2.5}
                                />
                                <span className="truncate" title={capability}>
                                  {capability}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="bg-[var(--card-bg)] border border-[var(--border-color)] rounded-[var(--card-radius)] py-16 px-6 text-center space-y-3">
              <div className="text-base font-semibold text-[var(--text-primary)]">
                暂无匹配的认证项
              </div>
              <p className="text-xs text-[var(--text-muted)] max-w-md mx-auto">
                当前筛选条件下未找到对应的培训认证方案，您可以清空关键词或切换其他认证体系查看。
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="theme-btn-primary px-4 py-2 rounded-[10px] text-xs font-semibold cursor-pointer"
                >
                  查看全部认证
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
