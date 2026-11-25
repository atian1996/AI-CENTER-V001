import React, { useEffect, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import type { Components } from 'react-markdown';
import { CertificationItem } from '../../types';
import { useApp } from '../../context/AppContext';
import { AdvisorContactModal } from './AdvisorContactModal';
import { Check } from 'lucide-react';

interface CertificationDetailViewProps {
  certification: CertificationItem;
  onBack: () => void;
}

interface TocItem {
  id: string;
  label: string;
  level: 1 | 2;
}

/**
 * 极简黑白灰 Markdown 渲染映射组件（规范正文 14px-15px，严格依赖字号与字重构建层次）
 */
const MARKDOWN_COMPONENTS: Components = {
  h2: ({ children }) => (
    <h3 className="text-[18px] font-semibold text-[#1a1a1a] tracking-tight mt-7 mb-3 first:mt-0">
      {children}
    </h3>
  ),
  h3: ({ children }) => (
    <h4 className="text-[16px] font-semibold text-[#1a1a1a] tracking-tight mt-6 mb-2.5 first:mt-0">
      {children}
    </h4>
  ),
  p: ({ children }) => (
    <p className="text-[14.5px] font-normal text-[#333333] leading-[1.8] mb-3.5 last:mb-0">
      {children}
    </p>
  ),
  ul: ({ children }) => (
    <ul className="space-y-2 my-3 pl-5 list-disc marker:text-[#999999] text-[14.5px] text-[#333333] leading-[1.75]">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="space-y-2 my-3 pl-5 list-decimal marker:text-[#666666] text-[14.5px] text-[#333333] leading-[1.75]">
      {children}
    </ol>
  ),
  li: ({ children }) => <li className="pl-1">{children}</li>,
  strong: ({ children }) => (
    <strong className="font-semibold text-[#1a1a1a]">{children}</strong>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-4 px-4 py-3 bg-[#f7f7f7] border border-[#eaeaea] rounded-[8px] text-[14px] text-[#666666]">
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code className="px-1.5 py-0.5 rounded bg-[#f7f7f7] border border-[#eaeaea] text-[#1a1a1a] font-mono text-[13px]">
      {children}
    </code>
  ),
  hr: () => <hr className="my-6 border-t border-[#eaeaea]" />
};

export const CertificationDetailView: React.FC<CertificationDetailViewProps> = ({
  certification,
  onBack
}) => {
  const { setActiveTab } = useApp();
  const [advisorModalOpen, setAdvisorModalOpen] = useState(false);

  // 动态生成左侧 Sticky 目录项（一级：课程介绍、课程大纲；二级：课程大纲各模块）
  const tocItems = useMemo<TocItem[]>(() => {
    const items: TocItem[] = [
      { id: 'section-intro', label: '课程介绍', level: 1 },
      { id: 'section-syllabus', label: '课程大纲', level: 1 }
    ];
    certification.learningPath.forEach((step, idx) => {
      items.push({
        id: `syllabus-step-${step.id}`,
        label: `${idx + 1}. ${step.title}`,
        level: 2
      });
    });
    return items;
  }, [certification.learningPath]);

  const [activeSectionId, setActiveSectionId] = useState<string>('section-intro');

  // 进入详情页时滚动到顶部并重置当前高亮章节
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    setActiveSectionId('section-intro');
  }, [certification.id]);

  // ScrollSpy：监听页面滚动，自动高亮当前阅读章节
  useEffect(() => {
    const sectionIds = tocItems.map((item) => item.id);

    const handleScroll = () => {
      const scrollThreshold = 156;
      let currentActive = sectionIds[0];

      const nearBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 40;
      if (nearBottom && sectionIds.length > 0) {
        setActiveSectionId(sectionIds[sectionIds.length - 1]);
        return;
      }

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        if (rect.top <= scrollThreshold) {
          currentActive = id;
        }
      }
      setActiveSectionId(currentActive);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [tocItems]);

  const handleJumpToSection = (sectionId: string) => {
    const target = document.getElementById(sectionId);
    if (!target) return;
    setActiveSectionId(sectionId);
    const headerOffset = 96;
    const targetTop = target.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: 'smooth'
    });
  };

  const heroTitle = certification.detailTitle || certification.name;
  const breadcrumbLevelLabel =
    certification.shortLevelName ||
    `${certification.systemName.replace('体系', '').trim()} ${certification.level}`;

  return (
    <div className="w-auto min-h-[calc(100vh-140px)] bg-[#ffffff] text-[#1a1a1a] -mx-8 px-8 -my-6 py-8 sm:py-10 font-sans antialiased">
      {/* 1200px 居中主内容容器，左右大面积留白 */}
      <div className="w-full max-w-[1200px] mx-auto">
        {/* 顶部极简面包屑：首页 / 课程培训 / FDE 体系 / FDE 初级 */}
        <nav aria-label="面包屑导航" className="flex flex-wrap items-center gap-2 text-[13px] text-[#666666] mb-6">
          <button
            type="button"
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            }}
            className="text-[#666666] hover:text-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            首页
          </button>
          <span className="text-[#cccccc]" aria-hidden="true">/</span>
          <button
            type="button"
            onClick={onBack}
            className="text-[#666666] hover:text-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            课程培训
          </button>
          <span className="text-[#cccccc]" aria-hidden="true">/</span>
          <button
            type="button"
            onClick={onBack}
            className="text-[#666666] hover:text-[#1a1a1a] transition-colors cursor-pointer whitespace-nowrap shrink-0"
          >
            {certification.systemName}
          </button>
          <span className="text-[#cccccc]" aria-hidden="true">/</span>
          <span className="text-[#1a1a1a] font-medium whitespace-nowrap">
            {breadcrumbLevelLabel}
          </span>
        </nav>

        {/* ================================================================
            模块二：头部课程摘要大卡片（Hero Card）
           ================================================================ */}
        <section className="w-full bg-[#ffffff] border border-[#eaeaea] rounded-[12px] p-7 sm:p-9 lg:p-10 shadow-[0_4px_20px_rgba(0,0,0,0.03)]">
          {/* 1. 卡片上半部分（横向满宽） */}
          <div className="space-y-3.5">
            {/* 胶囊标签区：等级标签文字加粗、边框加深；课程属性标签浅灰底色与边框 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#f7f7f7] border border-[#1a1a1a]/35 text-[#1a1a1a] whitespace-nowrap">
                {certification.level}
              </span>
              {certification.customTags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-normal bg-[#f7f7f7] border border-[#eaeaea] text-[#666666] whitespace-nowrap"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* 课程名称大标题（32px / 600字重） */}
            <h1 className="text-[26px] sm:text-[32px] font-semibold text-[#1a1a1a] tracking-tight leading-[1.3]">
              {heroTitle}
            </h1>

            {/* 所属体系副标题 */}
            <p className="text-[14px] font-normal text-[#666666]">
              所属体系：{certification.systemName}
            </p>
          </div>

          {/* 2. 卡片下半部分（左右分栏结构） */}
          <div className="mt-8 pt-8 border-t border-[#eaeaea] grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            {/* 左侧：核心决策区 */}
            <div className="lg:col-span-5 flex flex-col justify-between gap-6">
              <div className="space-y-5">
                {/* 价格模块与费用说明 */}
                <div>
                  <div className="text-[32px] sm:text-[36px] font-semibold text-[#1a1a1a] tracking-tight tabular-nums leading-none">
                    {certification.priceDisplay}
                  </div>
                  <p className="text-[13px] font-normal text-[#666666] leading-[1.65] mt-3 max-w-md">
                    {certification.feeDescription}
                  </p>
                </div>

                {/* 课程学时色块 */}
                <div className="bg-[#f7f7f7] border border-[#eaeaea] rounded-[8px] px-4 py-3 flex items-center justify-between text-[13.5px] max-w-[320px]">
                  <span className="text-[#666666] font-normal">课程总学时</span>
                  <span className="text-[#1a1a1a] font-semibold tabular-nums">
                    {certification.courseHours}
                  </span>
                </div>
              </div>

              {/* 黑底白字“立即报名”主按钮 */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setAdvisorModalOpen(true)}
                  className="w-full sm:w-auto sm:min-w-[196px] px-7 py-3 rounded-[10px] bg-[#1a1a1a] hover:bg-[#333333] text-[#ffffff] text-[14px] font-semibold transition-colors cursor-pointer whitespace-nowrap"
                >
                  立即报名
                </button>
              </div>
            </div>

            {/* 右侧：核心能力展示区 */}
            <div className="lg:col-span-7 bg-[#f7f7f7] rounded-[12px] p-6 sm:p-7 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-[#666666] tracking-wide mb-4">
                  核心能力
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3.5">
                  {certification.coreCapabilities.map((capability) => (
                    <div
                      key={capability}
                      className="flex items-center gap-2.5 text-[14px] font-normal text-[#1a1a1a]"
                    >
                      <Check
                        className="w-4 h-4 text-emerald-600 shrink-0"
                        strokeWidth={2}
                      />
                      <span className="leading-snug">{capability}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 底部极简适用人群行 */}
              <div className="mt-6 pt-4 border-t border-[#eaeaea] flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[12px] text-[#666666] tabular-nums">
                <span>适用人群：{certification.targetAudience}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            模块三：主内容区与左侧 Sticky 悬浮目录（垂直间距 56px）
           ================================================================ */}
        <div className="mt-14 sm:mt-16 flex flex-col md:flex-row items-start gap-8 lg:gap-10 xl:gap-14">
          {/* 左侧侧边目录（Sticky 悬浮定位，整列右侧带浅灰细竖线 + ScrollSpy 黑色粗竖线反馈） */}
          <aside className="w-full md:w-[228px] lg:w-[240px] shrink-0 md:sticky md:top-24 md:self-start md:max-h-[calc(100vh-7rem)] md:overflow-y-auto">
            <nav
              aria-label="课程详情章节目录"
              className="relative flex flex-row md:flex-col gap-1 md:gap-0.5 overflow-x-auto md:overflow-visible pb-2 md:pb-0 md:border-r md:border-[#eaeaea]"
            >
              {tocItems.map((item) => {
                const isActive = activeSectionId === item.id;
                const isSub = item.level === 2;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleJumpToSection(item.id)}
                    className={`relative text-left py-2.5 pr-4 transition-colors cursor-pointer whitespace-nowrap md:whitespace-normal shrink-0 text-[14px] leading-snug ${
                      isSub ? 'pl-5 text-[13px]' : 'pl-2'
                    } ${
                      isActive
                        ? 'text-[#1a1a1a] font-semibold'
                        : 'text-[#666666] hover:text-[#1a1a1a] font-normal'
                    }`}
                  >
                    <span>{item.label}</span>
                    {/* 右侧粗黑色激活竖线（桌面端对齐目录右侧细竖线） */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="hidden md:block absolute top-1.5 bottom-1.5 right-[-1px] w-[2px] bg-[#1a1a1a] rounded-full"
                      />
                    )}
                    {/* 移动端底部黑色激活线 */}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="md:hidden absolute left-2 right-4 bottom-0 h-[2px] bg-[#1a1a1a] rounded-full"
                      />
                    )}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* 右侧宽主内容区（支持竖向滚动与 Markdown 渲染） */}
          <div className="flex-1 min-w-0 w-full space-y-14 sm:space-y-16">
            {/* 区块一：课程介绍（固定栏目） */}
            <section id="section-intro" className="scroll-mt-24">
              <h2 className="text-[24px] font-semibold text-[#1a1a1a] tracking-tight pb-4 border-b border-[#eaeaea]">
                课程介绍
              </h2>
              <div className="pt-6">
                <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                  {certification.introMarkdown}
                </ReactMarkdown>
              </div>
            </section>

            {/* 区块二：课程大纲（模块化章节时间线） */}
            <section id="section-syllabus" className="scroll-mt-24">
              <h2 className="text-[24px] font-semibold text-[#1a1a1a] tracking-tight pb-4 border-b border-[#eaeaea]">
                课程大纲
              </h2>

              <div className="relative mt-8 pl-10 sm:pl-12 space-y-10">
                {/* 贯穿最左侧的浅灰细竖线 */}
                <div
                  aria-hidden="true"
                  className="absolute left-[13px] top-3 bottom-6 w-px bg-[#eaeaea]"
                />

                {certification.learningPath.map((step, idx) => (
                  <div
                    key={step.id}
                    id={`syllabus-step-${step.id}`}
                    className="relative scroll-mt-24"
                  >
                    {/* 叠加在竖线上的圆形序号节点 */}
                    <div
                      aria-hidden="true"
                      className="absolute -left-10 sm:-left-12 top-0.5 w-7 h-7 rounded-full bg-[#ffffff] border border-[#1a1a1a]/30 text-[#1a1a1a] text-xs font-semibold tabular-nums flex items-center justify-center z-10"
                    >
                      {idx + 1}
                    </div>

                    {/* 章节标题与课时标注 */}
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-[18px] font-semibold text-[#1a1a1a] tracking-tight">
                        {step.title}
                      </h3>
                      {step.hint && (
                        <span className="text-[12px] font-medium text-[#666666] bg-[#f7f7f7] border border-[#eaeaea] px-2.5 py-0.5 rounded-[4px] tabular-nums shrink-0">
                          {step.hint}
                        </span>
                      )}
                    </div>

                    {/* 浅灰边框大纲正文卡片（支持 Markdown 渲染） */}
                    <div className="mt-3.5 bg-[#ffffff] border border-[#eaeaea] rounded-[12px] p-5 sm:p-6">
                      <ReactMarkdown components={MARKDOWN_COMPONENTS}>
                        {step.contentMarkdown}
                      </ReactMarkdown>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* ================================================================
          模块四：课程报名留资弹窗（联系课程顾问）
         ================================================================ */}
      <AdvisorContactModal
        certification={{
          ...certification,
          name: heroTitle
        }}
        title="联系课程顾问"
        subtitlePrefix="咨询课程："
        isOpen={advisorModalOpen}
        onClose={() => setAdvisorModalOpen(false)}
      />
    </div>
  );
};
