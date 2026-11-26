import React, { useEffect, useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  OPC_POLICY_KEYS,
  OpcCommunityNode,
  OpcPolicyKey
} from '../../data/mockOpcCommunities';
import { maskPhoneNumber } from '../../data/chinaRegions';
import { StandalonePageHeader } from '../common/StandalonePageHeader';
import { AdvisorContactModal } from '../training/AdvisorContactModal';
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Check,
  ChevronRight,
  Cpu,
  FileCheck,
  MapPin,
  MoreHorizontal,
  Search,
  TrendingUp,
  X
} from 'lucide-react';

const POLICY_ICON_MAP: Record<OpcPolicyKey, React.FC<{ className?: string; strokeWidth?: number }>> = {
  免费工位: Building2,
  算力支持: Cpu,
  创业投资: TrendingUp,
  工商注册: FileCheck
};

export const OpcCommunityNetworkPage: React.FC = () => {
  const { opcCommunities } = useApp();

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('全部');
  const [selectedPolicies, setSelectedPolicies] = useState<OpcPolicyKey[]>([]);

  // Detail modal & secondary contact modal state
  const [activeCommunity, setActiveCommunity] = useState<OpcCommunityNode | null>(null);
  const [contactCommunity, setContactCommunity] = useState<OpcCommunityNode | null>(null);

  // 仅展示后台状态为「公开」的 OPC 社区，并按排序权重降序展示
  const visibleCommunities = useMemo(() => {
    return opcCommunities
      .filter((node) => node.status !== 'hidden')
      .sort((a, b) => (b.sortWeight ?? 0) - (a.sortWeight ?? 0));
  }, [opcCommunities]);

  // 动态聚合所有公开社区覆盖的城市标签
  const dynamicCities = useMemo(() => {
    const cityList: string[] = [];
    const seen = new Set<string>();
    for (const node of visibleCommunities) {
      if (node.city && !seen.has(node.city)) {
        seen.add(node.city);
        cityList.push(node.city);
      }
    }
    return ['全部', ...cityList];
  }, [visibleCommunities]);

  // Close detail modal on Escape (unless secondary contact modal is open)
  useEffect(() => {
    if (!activeCommunity || contactCommunity) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCommunity(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeCommunity, contactCommunity]);

  const togglePolicy = (policy: OpcPolicyKey) => {
    setSelectedPolicies((prev) =>
      prev.includes(policy) ? prev.filter((item) => item !== policy) : [...prev, policy]
    );
  };

  const filteredCommunities = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return visibleCommunities.filter((node) => {
      if (selectedCity !== '全部' && node.city !== selectedCity) return false;
      if (selectedPolicies.length > 0) {
        const matchesAll = selectedPolicies.every((p) => node.policies.includes(p));
        if (!matchesAll) return false;
      }
      if (q) {
        const haystack = [
          node.name,
          node.province || '',
          node.city,
          node.district,
          node.address,
          node.cardSummary || node.summary,
          node.policyOverview || '',
          ...node.policies
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });
  }, [visibleCommunities, searchQuery, selectedCity, selectedPolicies]);

  const hasFilters =
    selectedCity !== '全部' || selectedPolicies.length > 0 || searchQuery.trim().length > 0;

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCity('全部');
    setSelectedPolicies([]);
  };

  return (
    <div className="min-h-screen w-full bg-[#F9F9F8] text-[#1A1A1A] font-sans antialiased flex flex-col">
      {/* 独立版顶栏 Header (高度 64px) */}
      <StandalonePageHeader pageTitle="OPC 社区网络" maxWidthClass="max-w-[1200px]" />

      {/* =====================================================================
          主内容区：OPC 社区列表页
         ===================================================================== */}
      <main className="flex-1 w-full max-w-[1200px] mx-auto px-6 sm:px-8 pt-12 pb-20">
        {/* 1. 页面头部 (Header & Search) */}
        <section>
          <div className="text-left">
            <h1 className="text-[32px] font-semibold text-[#1A1A1A] tracking-[-0.5px] leading-tight">
              OPC 生态社区与政策网络
            </h1>
            <p className="mt-2.5 text-[14px] text-[#666666] leading-[1.6]">
              汇聚全国 500+ OPC 社区节点，提供一站式算力补贴、免费工位与创业政策查询。
            </p>
          </div>

          {/* 搜索框（距离标题 24px，高 48px，极浅灰底，无边框，圆角 4px） */}
          <div className="mt-[24px] relative">
            <Search
              className="w-[18px] h-[18px] text-[#999999] absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none"
              strokeWidth={1.6}
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="搜索社区名称、所在区域或政策关键词..."
              className="w-full h-[48px] pl-11 pr-10 bg-[#EFEFED] border-0 rounded-[4px] text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none focus:bg-[#ECECE9] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                aria-label="清空搜索"
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#999999] hover:text-[#1A1A1A] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" strokeWidth={1.6} />
              </button>
            )}
          </div>
        </section>

        {/* 2. 筛选控制区 (Filters) */}
        <section className="mt-6">
          {/* 城市横向标签（flex 布局，gap: 12px，支持换行展示全国城市节点） */}
          <div className="flex flex-wrap items-center gap-[10px]">
            {dynamicCities.map((city) => {
              const isSelected = selectedCity === city;
              return (
                <button
                  key={city}
                  type="button"
                  onClick={() => setSelectedCity(city)}
                  className={`px-3.5 py-1.5 rounded-[4px] text-[13px] font-medium whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-[#FFFFFF] border border-transparent'
                      : 'bg-[#FFFFFF] text-[#666666] border border-[#EAEAEA] hover:border-[#999999] hover:text-[#1A1A1A]'
                  }`}
                >
                  {city}
                </button>
              );
            })}
          </div>

          {/* 政策属性复选框（距离城市标签 16px） */}
          <div className="mt-[16px] flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2.5">
              {OPC_POLICY_KEYS.map((policy) => {
                const checked = selectedPolicies.includes(policy);
                return (
                  <button
                    key={policy}
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => togglePolicy(policy)}
                    className="inline-flex items-center gap-2 cursor-pointer select-none group"
                  >
                    <span
                      className={`w-4 h-4 rounded-[3px] border flex items-center justify-center transition-colors ${
                        checked
                          ? 'bg-[#FFFFFF] border-[#1A1A1A]'
                          : 'bg-[#FFFFFF] border-[#CCCCCC] group-hover:border-[#999999]'
                      }`}
                    >
                      {checked && (
                        <Check className="w-3 h-3 text-[#1A1A1A]" strokeWidth={2.5} />
                      )}
                    </span>
                    <span
                      className={`text-[14px] transition-colors ${
                        checked
                          ? 'text-[#1A1A1A] font-semibold'
                          : 'text-[#666666] font-normal group-hover:text-[#1A1A1A]'
                      }`}
                    >
                      {policy}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-3 text-[12px] text-[#999999]">
              <span className="tabular-nums">
                共 {filteredCommunities.length} 个匹配节点
              </span>
              {hasFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-[#666666] hover:text-[#1A1A1A] underline underline-offset-2 cursor-pointer transition-colors"
                >
                  重置筛选
                </button>
              )}
            </div>
          </div>
        </section>

        {/* 3. 社区卡片列表区 (双列网格，gap 24px，距筛选区 32px) */}
        <section className="mt-[32px]">
          {filteredCommunities.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#EAEAEA] rounded-[6px] py-16 px-6 text-center">
              <div className="text-[16px] font-semibold text-[#1A1A1A]">
                未找到符合条件的 OPC 社区节点
              </div>
              <p className="mt-2 text-[14px] text-[#666666]">
                请尝试更换搜索关键词、切换城市或减少政策勾选条件。
              </p>
              <button
                type="button"
                onClick={handleResetFilters}
                className="mt-5 px-5 py-2 bg-[#1A1A1A] hover:opacity-85 text-[#FFFFFF] text-[13px] font-medium rounded-[4px] transition-opacity cursor-pointer"
              >
                查看全部社区
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-[24px]">
              {filteredCommunities.map((node) => (
                <article
                  key={node.id}
                  onClick={() => setActiveCommunity(node)}
                  className="group relative bg-[#FFFFFF] border border-[#EAEAEA] hover:border-[#999999] rounded-[6px] p-[24px] flex flex-col justify-between transition-colors cursor-pointer"
                >
                  <div>
                    {/* 顶部区域：所在区域 + 右上角更多/悬浮 ↗ 图标 */}
                    <div className="flex items-center justify-between gap-3">
                      <span className="text-[12px] text-[#999999]">
                        {node.city} · {node.district}
                      </span>
                      <div className="relative w-4 h-4 shrink-0">
                        <MoreHorizontal
                          className="w-4 h-4 text-[#CCCCCC] group-hover:opacity-0 transition-opacity absolute inset-0"
                          strokeWidth={1.75}
                        />
                        <ArrowUpRight
                          className="w-4 h-4 text-[#1A1A1A] opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0"
                          strokeWidth={1.75}
                        />
                      </div>
                    </div>

                    {/* 主标题：社区名称 */}
                    <h2 className="mt-2 text-[18px] font-semibold text-[#1A1A1A] leading-snug">
                      {node.name}
                    </h2>

                    {/* 地址行：极简线框图钉 + 详细地址 */}
                    <div className="mt-2 flex items-start gap-1.5 text-[13px] text-[#666666] leading-[1.6]">
                      <MapPin
                        className="w-3.5 h-3.5 text-[#999999] shrink-0 mt-[3px]"
                        strokeWidth={1.6}
                      />
                      <span>{node.address}</span>
                    </div>

                    {/* 社区简介（对应后台卡片简介，两行截断） */}
                    <p className="mt-2.5 text-[13px] text-[#666666] leading-[1.65] line-clamp-2">
                      {node.cardSummary || node.summary}
                    </p>
                  </div>

                  {/* 底部政策标签组（透明底 + 1px 浅灰边框 + 极简线框图标）+ 右侧极简指示箭头 */}
                  <div className="mt-[24px] flex items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      {node.policies.map((policy) => {
                        const PolicyIcon = POLICY_ICON_MAP[policy];
                        return (
                          <span
                            key={policy}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-[4px] bg-transparent border border-[#EAEAEA] text-[12px] text-[#666666] font-normal"
                          >
                            <PolicyIcon className="w-3 h-3 text-[#666666]" strokeWidth={1.6} />
                            <span>{policy}</span>
                          </span>
                        );
                      })}
                    </div>

                    <ChevronRight
                      className="w-4 h-4 text-[#CCCCCC] group-hover:text-[#1A1A1A] group-hover:translate-x-0.5 transition-all shrink-0"
                      strokeWidth={1.75}
                    />
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* =====================================================================
          第三部分：OPC 详情页弹窗 (居中白底 Modal，宽 640px，圆角 8px)
         ===================================================================== */}
      {activeCommunity && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 animate-fade-in"
          onClick={() => setActiveCommunity(null)}
          role="dialog"
          aria-modal="true"
          aria-labelledby="opc-detail-modal-title"
        >
          <div
            className="relative w-full max-w-[640px] max-h-[90vh] overflow-y-auto bg-[#FFFFFF] border border-[#EAEAEA] rounded-[8px] p-7 sm:p-8 text-[#1A1A1A]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 右上角极简 × 关闭按钮 */}
            <button
              type="button"
              onClick={() => setActiveCommunity(null)}
              aria-label="关闭详情弹窗"
              className="absolute top-6 right-6 p-1 text-[#999999] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" strokeWidth={1.75} />
            </button>

            {/* 1. 面包屑 + 主标题 + 分割线 */}
            <div className="pr-8">
              <div className="text-[12px] text-[#999999]">
                {activeCommunity.city} / {activeCommunity.district}
              </div>
              <h2
                id="opc-detail-modal-title"
                className="mt-2 text-[24px] font-semibold text-[#1A1A1A] leading-snug mb-[24px]"
              >
                {activeCommunity.name}
              </h2>
            </div>

            <div className="border-t border-[#EAEAEA]" />

            {/* 2. 内容详情区 */}
            <div className="py-6 space-y-6">
              {/* 详细地址 */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#1A1A1A]">
                  详细地址
                </h3>
                <div className="mt-2 flex items-start gap-2 text-[14px] text-[#666666] leading-[1.6]">
                  <MapPin
                    className="w-4 h-4 text-[#999999] shrink-0 mt-[3px]"
                    strokeWidth={1.6}
                  />
                  <span>{activeCommunity.address}</span>
                </div>
              </div>

              {/* 政策概述（纯文本，无灰色背景块） */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#1A1A1A]">
                  政策概述
                </h3>
                <p className="mt-2 text-[14px] text-[#666666] leading-[1.8]">
                  {activeCommunity.policyOverview || activeCommunity.summary}
                </p>
              </div>

              {/* 支持政策（2x2 网格，关闭项置灰） */}
              <div>
                <h3 className="text-[14px] font-semibold text-[#1A1A1A]">
                  支持政策
                </h3>
                <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">
                  {activeCommunity.policyDetails.map((item) => {
                    const Icon = POLICY_ICON_MAP[item.key];
                    return (
                      <div
                        key={item.key}
                        className={`flex items-start gap-3 ${item.supported ? '' : 'opacity-45'}`}
                      >
                        <Icon
                          className={`w-[18px] h-[18px] shrink-0 mt-0.5 ${
                            item.supported ? 'text-[#1A1A1A]' : 'text-[#BBBBBB]'
                          }`}
                          strokeWidth={1.6}
                        />
                        <div className="min-w-0">
                          <div
                            className={`text-[14px] font-medium leading-snug ${
                              item.supported ? 'text-[#1A1A1A]' : 'text-[#999999]'
                            }`}
                          >
                            {item.key}
                          </div>
                          <div className="text-[12px] text-[#999999] mt-0.5 leading-relaxed">
                            {item.supported ? item.statusDesc : '暂未开放'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 3. 底部操作区 (Footer)：手机号通过代码自动打码 */}
            <div className="pt-5 border-t border-[#EAEAEA] flex flex-wrap items-center justify-between gap-4">
              <div className="text-[14px] text-[#666666] tabular-nums">
                联系人：{activeCommunity.contactName} |{' '}
                {maskPhoneNumber(activeCommunity.fullPhone || activeCommunity.maskedPhone)}
              </div>

              <button
                type="button"
                onClick={() => setContactCommunity(activeCommunity)}
                className="px-[24px] py-[10px] rounded-[4px] bg-[#1A1A1A] hover:opacity-85 text-[#FFFFFF] text-[14px] font-medium inline-flex items-center gap-1.5 transition-opacity cursor-pointer shrink-0"
              >
                <span>获取联系方式</span>
                <ArrowRight className="w-4 h-4" strokeWidth={1.75} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          4. 二次交互：联系方式弹窗（与认证详情“立即开通”弹窗完全一致）
         ===================================================================== */}
      {contactCommunity && (
        <AdvisorContactModal
          isOpen={true}
          onClose={() => setContactCommunity(null)}
          title="获取联系方式"
          subtitlePrefix="咨询社区："
          certification={{
            id: contactCommunity.id,
            systemId: 'aigc',
            name: `${contactCommunity.name}（${contactCommunity.city} · ${contactCommunity.district}）`,
            advisorContacts: [
              { label: '联系人', value: contactCommunity.contactName },
              { label: '联系电话', value: contactCommunity.fullPhone, copyable: true },
              { label: '电子邮箱', value: contactCommunity.contactEmail, copyable: true },
              { label: '服务时段', value: contactCommunity.serviceHours }
            ],
            advisorQrHint: contactCommunity.qrHint
          }}
        />
      )}
    </div>
  );
};
