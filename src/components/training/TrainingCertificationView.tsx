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
      <header className="pb-8 border-b border-[var(--border-light)]">
        <div className="space-y-2">
          <h1 className="text-[32px] font-semibold tracking-[-0.5px] text-[var(--text-main)] leading-tight">
            权威 AI 能力认证中心
          </h1>
          <p className="text-[14px] text-[var(--text-sub)] leading-[1.6]">
            选择认证方向，查阅配套课程、能力评估与行业认可度。
          </p>
        </div>
      </header>

      {/* Main 2-Column Content: Left Certification Systems Sidebar + Right Clean Divider List */}
      <div className="flex flex-col md:flex-row items-start gap-8 xl:gap-12 pt-8">
        {/* Left Sidebar: 认证体系方案 + 等级筛选 */}
        <aside className="w-full md:w-[228px] lg:w-[236px] shrink-0 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-7rem)] md:overflow-y-auto space-y-8">
          {/* System Navigation — 无灰色底块，选中态左侧 3px #1A1A1A 高亮线 */}
          <div>
            <h2 className="text-[16px] font-semibold text-[var(--text-main)] mb-3 px-3">
              认证体系方案
            </h2>
            <nav
              aria-label="认证体系筛选"
              className="flex flex-row md:flex-col gap-0.5 overflow-x-auto md:overflow-visible pb-1 md:pb-0"
            >
              <button
                type="button"
                onClick={() => setSelectedSystem('all')}
                className={`w-auto md:w-full h-[40px] flex items-center justify-between gap-3 px-3 text-[14px] text-left transition-colors cursor-pointer whitespace-nowrap shrink-0 border-l-[3px] bg-transparent ${
                  selectedSystem === 'all'
                    ? 'border-[var(--border-dark)] text-[var(--text-main)] font-semibold'
                    : 'border-transparent text-[var(--text-sub)] font-normal hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                }`}
              >
                <span>全部认证体系</span>
                <span className="text-[12px] text-[var(--text-muted)] tabular-nums">
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
                    className={`w-auto md:w-full h-[40px] flex items-center justify-between gap-3 px-3 text-[14px] text-left transition-colors cursor-pointer whitespace-nowrap shrink-0 border-l-[3px] bg-transparent ${
                      isActive
                        ? 'border-[var(--border-dark)] text-[var(--text-main)] font-semibold'
                        : 'border-transparent text-[var(--text-sub)] font-normal hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]'
                    }`}
                  >
                    <span className="truncate">{sys.name}</span>
                    <span className="text-[12px] text-[var(--text-muted)] tabular-nums shrink-0">
                      {systemCounts[sys.id] || 0}
                    </span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Level Filter — 极简圆角小标签按钮 */}
          <div className="pt-6 border-t border-[var(--border-light)]">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="text-[12px] font-semibold text-[var(--text-sub)]">
                认证等级
              </h3>
              {hasActiveFilter && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[12px] text-[var(--text-muted)] hover:text-[var(--text-main)] inline-flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>重置</span>
                </button>
              )}
            </div>
            <div className="grid grid-cols-4 md:grid-cols-2 gap-2">
              {LEVEL_OPTIONS.map((opt) => {
                const isActive = selectedLevel === opt.value;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSelectedLevel(opt.value)}
                    className={`px-3 py-1.5 rounded-[4px] text-[12px] font-medium border transition-colors cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'border-[var(--text-main)] bg-[var(--text-main)] text-[#FFFFFF]'
                        : 'border-[var(--border-light)] bg-transparent text-[var(--text-sub)] hover:border-[var(--border-dark)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Right Content Area: 去外框化干净列表，使用 1px 细横线分割 */}
        <section className="flex-1 min-w-0 w-full">
          {/* Active Track Context Line */}
          <div className="flex items-center justify-between pb-4 border-b border-[var(--border-light)]">
            <h2 className="text-[16px] font-semibold text-[var(--text-main)]">
              {activeSystemMeta.name}
            </h2>
            <span className="text-[12px] text-[var(--text-muted)] tabular-nums">
              共 {filteredCertifications.length} 项认证
            </span>
          </div>

          {/* Clean Horizontal-Divider List */}
          {filteredCertifications.length > 0 ? (
            <div className="bg-[var(--bg-card)] rounded-[6px] border border-[var(--border-light)] mt-4 divide-y divide-[var(--border-light)]">
              {filteredCertifications.map((cert) => {
                const levelDisplay = cert.levelCode
                  ? `${cert.levelCode} ${cert.level}`
                  : cert.level;

                return (
                  <article
                    key={cert.id}
                    className="p-6 transition-colors hover:bg-[var(--bg-page)]/50"
                  >
                    <div className="flex flex-col xl:flex-row items-start gap-6 xl:gap-10">
                      {/* Left Main Info Column */}
                      <div className="flex-1 min-w-0 space-y-4">
                        {/* Title Row: 左侧 18px 粗体标题 + 右侧 12px 灰色颁发机构 */}
                        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                          <h3 className="text-[18px] font-semibold text-[var(--text-main)] tracking-tight leading-snug">
                            {cert.name}
                          </h3>
                          <span className="text-[12px] text-[var(--text-sub)] shrink-0">
                            颁发机构：{cert.issuingBodies.join(' · ')}
                          </span>
                        </div>

                        {/* Tag Row: 统一为 1px solid #1A1A1A 细边框，无背景填充 */}
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[12px] font-medium border border-[var(--border-dark)] bg-transparent text-[var(--text-main)] whitespace-nowrap">
                            {levelDisplay}
                          </span>
                          {cert.customTags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center px-2 py-0.5 rounded-[4px] text-[12px] font-normal border border-[var(--border-dark)] bg-transparent text-[var(--text-main)] whitespace-nowrap"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>

                        {/* Brief Intro: 极简正文，去除多余底块 */}
                        <p className="text-[14px] leading-[1.6] text-[var(--text-sub)]">
                          {cert.briefIntro}
                        </p>

                        {/* Target Audience + CTA */}
                        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="text-[12px] text-[var(--text-sub)]">
                            <span className="text-[var(--text-muted)] mr-2">适用人群</span>
                            <span className="text-[var(--text-main)] font-medium">
                              {cert.targetAudience}
                            </span>
                          </div>

                          <button
                            type="button"
                            onClick={() => setSelectedCert(cert)}
                            className="px-4 py-2 rounded-[4px] bg-[var(--brand-color)] hover:opacity-80 text-[#FFFFFF] text-[13px] font-medium inline-flex items-center gap-1.5 transition-opacity cursor-pointer whitespace-nowrap shrink-0 self-start sm:self-auto"
                          >
                            <span>查看认证详情</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Right Core Capabilities: 删除灰色圆角背景块，两列排布 + 纯黑勾号 + 14px 灰字 */}
                      <div className="w-full xl:w-[340px] shrink-0 pt-4 xl:pt-0 xl:pl-8 border-t xl:border-t-0 xl:border-l border-[var(--border-light)]">
                        <div className="text-[12px] font-semibold text-[var(--text-main)] mb-3">
                          核心能力
                        </div>

                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
                          {cert.coreCapabilities.map((capability) => (
                            <div
                              key={capability}
                              className="flex items-start gap-2 text-[14px] leading-[1.5] text-[var(--text-sub)]"
                            >
                              <Check
                                className="w-4 h-4 text-[var(--text-main)] shrink-0 mt-0.5"
                                strokeWidth={1.8}
                              />
                              <span className="truncate" title={capability}>
                                {capability}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="mt-4 bg-[var(--bg-card)] border border-[var(--border-light)] rounded-[6px] py-16 px-6 text-center space-y-3">
              <div className="text-[16px] font-semibold text-[var(--text-main)]">
                暂无匹配的认证项
              </div>
              <p className="text-[14px] text-[var(--text-sub)] max-w-md mx-auto">
                当前筛选条件下未找到对应的培训认证方案，您可以清空筛选或切换其他认证体系查看。
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-[4px] bg-[var(--brand-color)] hover:opacity-80 text-[#FFFFFF] text-[13px] font-medium transition-opacity cursor-pointer"
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
