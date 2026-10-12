import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  Sparkles,
  ShieldCheck,
  Printer,
  Clock,
  Layers,
  ChevronDown,
  Play,
  Pause,
  Filter,
  Users,
  Building2,
  Trophy,
  Cpu,
  Coins,
  FileCheck2,
  TrendingUp,
  Eye,
  CheckCircle2,
  ArrowUpRight,
  X,
  FileText,
  BarChart2,
  Search,
  ExternalLink,
  Info
} from 'lucide-react';
import { useApp } from '../../../context/AppContext';

// 台账分类类型定义
export type LedgerCategory =
  | 'platform' // 平台运营台账
  | 'industry' // 产业成果台账
  | 'activities' // 活动台账
  | 'compute' // 算力资源台账
  | 'finance'; // 资金台账

// 筛选条件接口
export interface LedgerFilters {
  timeRange: '本季度' | '本年度' | '近12个月' | '自定义';
  industry: string;
  status: string;
}

// 通用明细记录接口
export interface LedgerDetailRow {
  id: string;
  code: string;
  title: string;
  entity: string;
  category: string;
  subCategory?: string;
  date: string;
  metric1: string;
  metric1Label: string;
  metric2: string;
  metric2Label: string;
  status: string;
  statusType: 'success' | 'warning' | 'info' | 'purple';
  auditCode: string;
  remarks: string;
  dataSource: string;
}

// 模拟各台账的丰富明细数据
const MOCK_PLATFORM_DETAILS: LedgerDetailRow[] = [
  {
    id: 'plt-01',
    code: 'PLT-202610-001',
    title: '2026年10月平台月度运营综合台账',
    entity: '南京市AI生态运营中心',
    category: '平台综合',
    date: '2026-10-12',
    metric1: '8,240 人',
    metric1Label: '月活规模',
    metric2: '356 家',
    metric2Label: '认证企业',
    status: '已核验归档',
    statusType: 'success',
    auditCode: 'AUD-NJ-2026-1001',
    remarks: '平台活跃度环比增长16.2%，发任务企业增至89家，整体运行健康。',
    dataSource: '登录日志库 + 企业认证管理表'
  },
  {
    id: 'plt-02',
    code: 'PLT-202609-002',
    title: '2026年9月开发者主体培育与登录审计',
    entity: '开发者社区运营组',
    category: '用户主体',
    date: '2026-09-30',
    metric1: '8,120 人',
    metric1Label: '月活规模',
    metric2: '345 家',
    metric2Label: '认证企业',
    status: '已核验归档',
    statusType: 'success',
    auditCode: 'AUD-NJ-2026-0902',
    remarks: '高校秋季开学季带动高校研发用户激增420人，微调实训活跃度显著上升。',
    dataSource: '统一身份认证中心(IAM)'
  },
  {
    id: 'plt-03',
    code: 'PLT-202608-003',
    title: '2026年8月任务协同与揭榜履约台账',
    entity: '技术对接与需求分发处',
    category: '任务协同',
    date: '2026-08-31',
    metric1: '1,234 项',
    metric1Label: '累计任务',
    metric2: '92.8%',
    metric2Label: '交付履约率',
    status: '已核验归档',
    statusType: 'success',
    auditCode: 'AUD-NJ-2026-0803',
    remarks: '完成工业质检与大模型微调等核心揭榜任务112项，平均交付周期缩短至18.2天。',
    dataSource: '生态任务工坊交易流水表'
  },
  {
    id: 'plt-04',
    code: 'PLT-202607-004',
    title: '2026年7月专精特新企业认证审核台账',
    entity: '企业服务专班',
    category: '企业主体',
    date: '2026-07-31',
    metric1: '320 家',
    metric1Label: '认证企业',
    metric2: '68 家',
    metric2Label: '专精特新',
    status: '已核验归档',
    statusType: 'success',
    auditCode: 'AUD-NJ-2026-0704',
    remarks: '新入库国家级专精特新“小巨人”企业14家，主要集中在智能制造与EDA领域。',
    dataSource: '政企直通互认服务接口'
  },
  {
    id: 'plt-05',
    code: 'PLT-202606-005',
    title: '2026年半年度平台运营与数据资产总清查',
    entity: '数据资源与资产管理部',
    category: '资产清查',
    date: '2026-06-30',
    metric1: '12,580 人',
    metric1Label: '注册总量',
    metric2: '156 个',
    metric2Label: '开源数据集',
    status: '已核验归档',
    statusType: 'success',
    auditCode: 'AUD-NJ-2026-0605',
    remarks: '上半年累计沉淀核心行业知识库与模型微调权重42项，全部通过合规审计。',
    dataSource: '生态平台数据资产目录系统'
  },
  {
    id: 'plt-06',
    code: 'PLT-202605-006',
    title: '2026年5月模型调用与开放API服务台账',
    entity: '模型工坊调度室',
    category: '能力开放',
    date: '2026-05-31',
    metric1: '89 个',
    metric1Label: '开放API',
    metric2: '2.3 亿',
    metric2Label: '累计Token',
    status: '已核验归档',
    statusType: 'success',
    auditCode: 'AUD-NJ-2026-0506',
    remarks: '面向全市中小企业累计调用语言及多模态推理API超6,800万次。',
    dataSource: 'API网关访问日志与用量统计'
  }
];

const MOCK_INDUSTRY_DETAILS: LedgerDetailRow[] = [
  {
    id: 'ind-01',
    code: 'IND-MFG-001',
    title: '高精度锂电隔膜表面缺陷智能视觉巡检',
    entity: '南京欣旺达新能源有限公司',
    category: '智能制造',
    subCategory: '落地转化',
    date: '2026-09-18',
    metric1: '1,420 万元',
    metric1Label: '经济效益',
    metric2: 'TRL-9级',
    metric2Label: '成熟度',
    status: '已落地转化',
    statusType: 'success',
    auditCode: 'PRJ-MFG-2026-01',
    remarks: '已在溧水生产基地完成3条产线全面部署，误报率降至0.05%以下。',
    dataSource: '成果转化综合验收报告'
  },
  {
    id: 'ind-02',
    code: 'IND-ELE-002',
    title: 'EDA板级多层走线高频信号仿真智能助手',
    entity: '南京国微电子EDA创新联合体',
    category: '电子信息',
    subCategory: '落地转化',
    date: '2026-08-25',
    metric1: '980 万元',
    metric1Label: '经济效益',
    metric2: 'TRL-8级',
    metric2Label: '成熟度',
    status: '已落地转化',
    statusType: 'success',
    auditCode: 'PRJ-ELE-2026-02',
    remarks: '替代传统EDA电磁仿真繁琐网格剖分，仿真耗时由4小时缩短至12分钟。',
    dataSource: '工信局揭榜挂帅项目库'
  },
  {
    id: 'ind-03',
    code: 'IND-BIO-003',
    title: '肿瘤分子靶点AI虚拟高通量筛选协同系统',
    entity: '江苏先声药业国家重点实验室',
    category: '生物医药',
    subCategory: '试点验证',
    date: '2026-07-14',
    metric1: '650 万元',
    metric1Label: '合同金额',
    metric2: 'TRL-7级',
    metric2Label: '成熟度',
    status: '试点验证中',
    statusType: 'warning',
    auditCode: 'PRJ-BIO-2026-03',
    remarks: '完成2.4亿小分子库与靶点蛋白亲和力对接演练，先导化合物命中率提升3倍。',
    dataSource: '医药创新实验场验证日志'
  },
  {
    id: 'ind-04',
    code: 'IND-ENG-004',
    title: '百兆瓦级储能电站AI负荷预测与协同调度',
    entity: '南瑞继保电气有限公司',
    category: '新能源',
    subCategory: '已签约合作',
    date: '2026-06-20',
    metric1: '520 万元',
    metric1Label: '签约金额',
    metric2: 'TRL-8级',
    metric2Label: '成熟度',
    status: '已签约合作',
    statusType: 'info',
    auditCode: 'PRJ-ENG-2026-04',
    remarks: '依托江宁电网侧储能试点完成并网运行协议签署，预计降低调峰弃风弃光率18%。',
    dataSource: '产学研签约合同存证系统'
  },
  {
    id: 'ind-05',
    code: 'IND-SFT-005',
    title: '南京水务物联全域大模型防汛智能调度大脑',
    entity: '南京市水务集团 / 软件谷技术中心',
    category: '软件信息',
    subCategory: '落地转化',
    date: '2026-05-18',
    metric1: '380 万元',
    metric1Label: '社会效益',
    metric2: 'TRL-9级',
    metric2Label: '成熟度',
    status: '已落地转化',
    statusType: 'success',
    auditCode: 'PRJ-SFT-2026-05',
    remarks: '覆盖主城区长江与秦淮河14个闸站智能联动排水，汛期响应时长提升65%。',
    dataSource: '智慧城市数字化项目库'
  },
  {
    id: 'ind-06',
    code: 'IND-LOW-006',
    title: '低空空域多源协同巡检大模型视觉导航',
    entity: '南京若尔通用航空 / 浦口低空经济基地',
    category: '低空经济',
    subCategory: '试点验证',
    date: '2026-04-10',
    metric1: '240 万元',
    metric1Label: '试验产值',
    metric2: 'TRL-6级',
    metric2Label: '成熟度',
    status: '试点验证中',
    statusType: 'warning',
    auditCode: 'PRJ-LOW-2026-06',
    remarks: '在浦口低空试验区完成500架次复杂气象巡检自主规避与管线隐患识别。',
    dataSource: '低空经济产业创新试验场'
  }
];

const MOCK_ACTIVITIES_DETAILS: LedgerDetailRow[] = [
  {
    id: 'act-01',
    code: 'ACT-202610-001',
    title: '2026首届南京主导产业链AI场景创新挑战赛',
    entity: '南京市工业和信息化局 / AI产业生态联盟',
    category: '赛事',
    date: '2026-10-10',
    metric1: '620 人次',
    metric1Label: '参赛规模',
    metric2: '3,200 卡时',
    metric2Label: '算力投入',
    status: '已圆满结案',
    statusType: 'success',
    auditCode: 'ACT-AUD-2026-01',
    remarks: '共收到89项产业解决方案，18个获奖团队与本地重点制造企业现场达成合作。',
    dataSource: '赛事报名与成果评审归档库'
  },
  {
    id: 'act-02',
    code: 'ACT-202609-002',
    title: '大模型微调与工业智能体工程化实训营(第二期)',
    entity: '南京集成电路培训基地 / 算力工坊实训部',
    category: '实训',
    date: '2026-09-22',
    metric1: '180 人次',
    metric1Label: '实训学员',
    metric2: '2,400 卡时',
    metric2Label: '算力投入',
    status: '已圆满结案',
    statusType: 'success',
    auditCode: 'ACT-AUD-2026-02',
    remarks: '考核通过率96.4%，学员人手交付1套工业质检Prompt/LoRA微调工程模型。',
    dataSource: '工程实训平台结业教务系统'
  },
  {
    id: 'act-03',
    code: 'ACT-202608-003',
    title: '大模型工程实训营(第一期·基础与微调)',
    entity: '南京大学人工智能学院 / 麒麟科创园',
    category: '实训',
    date: '2026-08-18',
    metric1: '140 人次',
    metric1Label: '实训学员',
    metric2: '2,100 卡时',
    metric2Label: '算力投入',
    status: '已圆满结案',
    statusType: 'success',
    auditCode: 'ACT-AUD-2026-03',
    remarks: '完成大模型基础理论与分布式训练实操，考核结业135人。',
    dataSource: '工程实训平台结业教务系统'
  },
  {
    id: 'act-04',
    code: 'ACT-202607-004',
    title: '“AI+生物医药”前沿创新闭门产业沙龙',
    entity: '江北新区生物医药谷 / 药石科技',
    category: '沙龙',
    date: '2026-07-28',
    metric1: '65 人次',
    metric1Label: '参会高管',
    metric2: '480 卡时',
    metric2Label: '算力投入',
    status: '已圆满结案',
    statusType: 'success',
    auditCode: 'ACT-AUD-2026-04',
    remarks: '促成先声药业、药石科技等6家药企共建新药分子对接公共算力池意向。',
    dataSource: '产业沙龙会议纪要及签到表'
  },
  {
    id: 'act-05',
    code: 'ACT-202606-005',
    title: '长三角人工智能创新成果投融资闭门路演',
    entity: '南京市紫金科创投 / 源码资本',
    category: '路演',
    date: '2026-06-15',
    metric1: '70 人次',
    metric1Label: '投资人/项目',
    metric2: '1,500 卡时',
    metric2Label: '算力投入',
    status: '已圆满结案',
    statusType: 'success',
    auditCode: 'ACT-AUD-2026-05',
    remarks: '精选12个早期AI成果路演，获得意向投资总额超6,200万元。',
    dataSource: '投融资路演对接登记册'
  },
  {
    id: 'act-06',
    code: 'ACT-202605-006',
    title: '智能制造企业“AI赋能百企行”专家诊断沙龙',
    entity: '南京智能制造装备产业联盟',
    category: '沙龙',
    date: '2026-05-12',
    metric1: '55 人次',
    metric1Label: '参会工程师',
    metric2: '420 卡时',
    metric2Label: '算力投入',
    status: '已圆满结案',
    statusType: 'success',
    auditCode: 'ACT-AUD-2026-06',
    remarks: '走访排摸24家传统离散制造企业，梳理形成AI改造需求清单38条。',
    dataSource: '产业沙龙会议纪要及签到表'
  }
];

const MOCK_COMPUTE_DETAILS: LedgerDetailRow[] = [
  {
    id: 'cmp-01',
    code: 'CMP-202610-001',
    title: '华为昇腾910B集群赛事训练专项调度单',
    entity: '场景赛组委会 / 参赛高校联合战队',
    category: '赛事调度',
    subCategory: '华为昇腾池',
    date: '2026-10-10',
    metric1: '3,200 卡时',
    metric1Label: '调度卡时',
    metric2: '6,400 万',
    metric2Label: 'Token调用',
    status: '核销完成',
    statusType: 'success',
    auditCode: 'CMP-TKT-2026-1001',
    remarks: '提供48台8卡Atlas 800训练服务器，完成多模型分布式测试，无排队阻塞。',
    dataSource: '算力工坊调度日志与计量系统'
  },
  {
    id: 'cmp-02',
    code: 'CMP-202609-002',
    title: '工程师大模型微调实训营专属算力券核销',
    entity: '实训学院教学组 / 320名学员',
    category: '实训调度',
    subCategory: 'NVIDIA高算池',
    date: '2026-09-25',
    metric1: '2,400 卡时',
    metric1Label: '调度卡时',
    metric2: '4,800 万',
    metric2Label: 'Token调用',
    status: '核销完成',
    statusType: 'success',
    auditCode: 'CMP-TKT-2026-0902',
    remarks: '每位学员分配单卡A800容器环境40小时，全量完成LoRA参数微调。',
    dataSource: '智能容器云调度审计平台'
  },
  {
    id: 'cmp-03',
    code: 'CMP-202609-003',
    title: '先声药业分子亲和力大模型分布式推理',
    entity: '江苏先声药业研发中心',
    category: '实验场调度',
    subCategory: '异构超算池',
    date: '2026-09-12',
    metric1: '1,500 卡时',
    metric1Label: '调度卡时',
    metric2: '3,200 万',
    metric2Label: 'Token调用',
    status: '核销完成',
    statusType: 'success',
    auditCode: 'CMP-TKT-2026-0903',
    remarks: '异构高性能超算集群连续运算120小时，完成药物靶点亲和度评估计算。',
    dataSource: '国家超级计算中心南京分中心'
  },
  {
    id: 'cmp-04',
    code: 'CMP-202608-004',
    title: '行业通用大模型推理与API资源池调度',
    entity: '平台认证算法开发者与ISV生态',
    category: '模型调用',
    subCategory: '推理API池',
    date: '2026-08-30',
    metric1: '1,200 卡时',
    metric1Label: '调度卡时',
    metric2: '5,500 万',
    metric2Label: 'Token调用',
    status: '核销完成',
    statusType: 'success',
    auditCode: 'CMP-TKT-2026-0804',
    remarks: '支撑通用大模型API服务与原型验证，支持跨节点动态并发弹性调度。',
    dataSource: 'API网关Token计量中心'
  },
  {
    id: 'cmp-05',
    code: 'CMP-202607-005',
    title: '欣旺达锂电视觉大模型产线适配迁移验证',
    entity: '欣旺达自动化装备研究院',
    category: '实验场调度',
    subCategory: '华为昇腾池',
    date: '2026-07-20',
    metric1: '1,500 卡时',
    metric1Label: '调度卡时',
    metric2: '1,800 万',
    metric2Label: 'Token调用',
    status: '核销完成',
    statusType: 'success',
    auditCode: 'CMP-TKT-2026-0705',
    remarks: '现场边缘推理盒子算力调优，模型剪枝量化至INT8，推理时延降至18ms。',
    dataSource: '工坊边缘计算中心节点日志'
  },
  {
    id: 'cmp-06',
    code: 'CMP-202606-006',
    title: 'EDA高频电磁求解器大模型并行加速调度',
    entity: '国微电子创新中心',
    category: '实验场调度',
    subCategory: 'NVIDIA高算池',
    date: '2026-06-25',
    metric1: '1,200 卡时',
    metric1Label: '调度卡时',
    metric2: '1,300 万',
    metric2Label: 'Token调用',
    status: '核销完成',
    statusType: 'success',
    auditCode: 'CMP-TKT-2026-0606',
    remarks: '多GPU并行跨节点NCCL通信优化，加速大规模板级电磁模拟收敛。',
    dataSource: '算力工坊调度日志与计量系统'
  }
];

const MOCK_FINANCE_DETAILS: LedgerDetailRow[] = [
  {
    id: 'fin-01',
    code: 'FIN-202610-001',
    title: '2026年度主导产业算力券采购与补贴划拨',
    entity: '南京市财政局 / 市工信局',
    category: '算力补贴',
    date: '2026-10-08',
    metric1: '320.0 万元',
    metric1Label: '拨付金额',
    metric2: '89 家',
    metric2Label: '惠企数量',
    status: '已拨付核销',
    statusType: 'success',
    auditCode: 'FIN-NJ-2026-1001',
    remarks: '算力券定向抵扣算力工坊智算费用，企业研发成本直接降低45%。',
    dataSource: '市财政涉企补贴发放专户'
  },
  {
    id: 'fin-02',
    code: 'FIN-202609-002',
    title: '“揭榜挂帅”关键共性算法攻坚任务悬赏金',
    entity: '技术成果承接联合体(12家研发主体)',
    category: '任务赏金',
    date: '2026-09-28',
    metric1: '186.5 万元',
    metric1Label: '拨付金额',
    metric2: '12 项',
    metric2Label: '攻坚课题',
    status: '已拨付核销',
    statusType: 'success',
    auditCode: 'FIN-NJ-2026-0902',
    remarks: '严格按照专家组技术交付验收报告分阶段拨付，第一期款项全部合规到账。',
    dataSource: '财政国库集中支付指令单'
  },
  {
    id: 'fin-03',
    code: 'FIN-202609-003',
    title: '首届场景创新挑战赛优秀项目落地奖金',
    entity: '获奖创新团队(一/二/三等奖18家)',
    category: '赛事奖励',
    date: '2026-09-15',
    metric1: '150.0 万元',
    metric1Label: '拨付金额',
    metric2: '18 个',
    metric2Label: '获奖项目',
    status: '已拨付核销',
    statusType: 'success',
    auditCode: 'FIN-NJ-2026-0903',
    remarks: '包含落地南京注册奖励与研发扶持资金，带动企业追加自筹投资1,420万元。',
    dataSource: '产业发展专项资金专户'
  },
  {
    id: 'fin-04',
    code: 'FIN-202608-004',
    title: 'AI高级工程人才实训与导师认证补贴',
    entity: '各高校联合培训机构与特聘专家',
    category: '实训补贴',
    date: '2026-08-20',
    metric1: '95.0 万元',
    metric1Label: '拨付金额',
    metric2: '320 人',
    metric2Label: '认证工程师',
    status: '已拨付核销',
    statusType: 'success',
    auditCode: 'FIN-NJ-2026-0804',
    remarks: '按结业取得国家人社认证的AI工程技术人员补贴人均3,000元，专款专用。',
    dataSource: '人才开发专项发展基金'
  },
  {
    id: 'fin-05',
    code: 'FIN-202607-005',
    title: '生态看板与数据平台全天候运维保障专项费',
    entity: '平台技术运维服务保障单位',
    category: '运维保障',
    date: '2026-07-15',
    metric1: '98.5 万元',
    metric1Label: '拨付金额',
    metric2: '99.98%',
    metric2Label: 'SLA达标率',
    status: '已拨付核销',
    statusType: 'success',
    auditCode: 'FIN-NJ-2026-0705',
    remarks: '涵盖高可用灾备、安全等保三级评测及7×24小时驻场技术支撑。',
    dataSource: '市数字化建设项目预算表'
  }
];

interface EcoLedgerReportTabProps {
  onPreviewReport?: (report: any) => void;
}

export const EcoLedgerReportTab: React.FC<EcoLedgerReportTabProps> = ({
  onPreviewReport
}) => {
  const { showToast } = useApp();

  // 当前激活的台账分类标签 (默认选中“平台运营台账”)
  const [activeCategory, setActiveCategory] = useState<LedgerCategory>('platform');

  // 筛选条件状态
  const [filters, setFilters] = useState<LedgerFilters>({
    timeRange: '本年度',
    industry: '全部',
    status: '全部'
  });

  // 导出对话框状态
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'PDF' | 'Excel' | 'Word'>('PDF');
  const [isExporting, setIsExporting] = useState(false);

  // 二级台账详情弹窗
  const [selectedDetail, setSelectedDetail] = useState<LedgerDetailRow | null>(null);

  // 明细滚动走马灯状态
  const [isTickerPlaying, setIsTickerPlaying] = useState(true);
  const [tickerOffset, setTickerOffset] = useState(0);
  const tickerContainerRef = useRef<HTMLDivElement>(null);

  // 切换分类时的名称与描述
  const categoryMeta: Record<LedgerCategory, { label: string; desc: string; icon: any }> = {
    platform: {
      label: '平台运营台账',
      desc: '用户、企业、案例、任务、算力核心数据汇总与流转',
      icon: Users
    },
    industry: {
      label: '产业成果台账',
      desc: '南京主导产业链案例明细、转化率与落地状态',
      icon: Building2
    },
    activities: {
      label: '活动台账',
      desc: '产业创新赛事、工程实训、沙龙、路演举办明细与产出',
      icon: Trophy
    },
    compute: {
      label: '算力资源台账',
      desc: '各智算资源池卡时消耗、Token消耗与调度流向',
      icon: Cpu
    },
    finance: {
      label: '资金台账',
      desc: '财政专项投入、算力券补贴、任务赏金与自筹匹配明细',
      icon: Coins
    }
  };

  // 根据所选台账获取明细数据
  const currentDetailList = useMemo(() => {
    let list: LedgerDetailRow[] = [];
    if (activeCategory === 'platform') list = MOCK_PLATFORM_DETAILS;
    else if (activeCategory === 'industry') list = MOCK_INDUSTRY_DETAILS;
    else if (activeCategory === 'activities') list = MOCK_ACTIVITIES_DETAILS;
    else if (activeCategory === 'compute') list = MOCK_COMPUTE_DETAILS;
    else if (activeCategory === 'finance') list = MOCK_FINANCE_DETAILS;

    // 产业链筛选
    if (filters.industry !== '全部') {
      list = list.filter(item => item.category === filters.industry || item.subCategory === filters.industry);
    }
    // 状态筛选
    if (filters.status !== '全部') {
      list = list.filter(item => item.status.includes(filters.status) || item.status === filters.status);
    }

    return list.length > 0 ? list : MOCK_PLATFORM_DETAILS;
  }, [activeCategory, filters]);

  // 明细列表自动平滑滚动 (走马灯效果)
  useEffect(() => {
    if (!isTickerPlaying) return;
    const interval = setInterval(() => {
      setTickerOffset(prev => (prev + 1) % currentDetailList.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [isTickerPlaying, currentDetailList.length]);

  // 执行导出
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      setIsExportModalOpen(false);
      showToast(`已成功导出《${categoryMeta[activeCategory].label}》（${exportFormat}格式）`);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col justify-between select-none text-slate-100 overflow-hidden font-sans">
      
      {/* ========================================================
          顶部标题栏 (约 60px)
          左侧: AI生态看板 · 数据台账报告 (标题固定)
          中间: 无
          右侧: 2026年10月12日 + 【导出报告】按钮
         ======================================================== */}
      <div className="h-[60px] flex items-center justify-between px-6 bg-slate-900/95 border-b border-slate-800/80 rounded-t-2xl backdrop-blur-md shadow-lg shadow-black/20 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/25 border border-emerald-400/40">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-100 to-slate-300">
                AI生态看板 · 数据台账报告
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-300">
                核心业务台账实时汇总
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              平台运营、产业成果、算力资源等关键台账实时汇总与核算
            </p>
          </div>
        </div>

        {/* 右侧：日期 + 导出报告按钮 */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 shadow-inner">
            <Calendar className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-slate-200">2026年10月12日</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse ml-1" />
            <span className="text-[11px] text-slate-400">实时更新</span>
          </div>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs shadow-lg shadow-emerald-600/30 border border-emerald-400/40 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>导出报告</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          第一行：台账分类切换标签 + 筛选条件 (约 60px)
          台账分类标签: 平台运营台账 / 产业成果台账 / 活动台账 / 算力资源台账 / 资金台账
          筛选条件: 时间范围 / 产业链 / 状态
         ======================================================== */}
      <div className="h-[60px] my-2.5 px-6 flex items-center justify-between bg-slate-900/80 border border-slate-800/90 rounded-xl backdrop-blur-sm shrink-0">
        
        {/* 左侧：5个台账分类切换标签 */}
        <div className="flex items-center gap-2">
          {(
            [
              { key: 'platform', label: '平台运营台账', icon: Users },
              { key: 'industry', label: '产业成果台账', icon: Building2 },
              { key: 'activities', label: '活动台账', icon: Trophy },
              { key: 'compute', label: '算力资源台账', icon: Cpu },
              { key: 'finance', label: '资金台账', icon: Coins }
            ] as const
          ).map(tab => {
            const Icon = tab.icon;
            const isSelected = activeCategory === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveCategory(tab.key);
                  setTickerOffset(0);
                }}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md shadow-emerald-600/30 ring-1 ring-emerald-400/50'
                    : 'bg-slate-950/70 hover:bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-800/80'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 右侧：筛选条件 (时间范围 / 产业链 / 状态) */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] font-semibold text-slate-400">台账筛选：</span>
          </div>

          {/* 时间范围筛选 */}
          <div className="relative flex items-center">
            <select
              value={filters.timeRange}
              onChange={e => setFilters(prev => ({ ...prev, timeRange: e.target.value as any }))}
              aria-label="选择时间范围"
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500 hover:border-slate-700"
            >
              <option value="本季度">时间：本季度 (2026 Q3-Q4)</option>
              <option value="本年度">时间：本年度 (2026全域)</option>
              <option value="近12个月">时间：近12个月 (2025.11-2026.10)</option>
              <option value="自定义">时间：自定义区间</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* 产业链筛选 */}
          <div className="relative flex items-center">
            <select
              value={filters.industry}
              onChange={e => setFilters(prev => ({ ...prev, industry: e.target.value }))}
              aria-label="选择产业链"
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500 hover:border-slate-700"
            >
              <option value="全部">产业链：全部主导产业</option>
              <option value="智能制造">智能制造产业链</option>
              <option value="电子信息">电子信息产业链</option>
              <option value="生物医药">生物医药产业链</option>
              <option value="新能源">新能源产业链</option>
              <option value="软件信息">软件信息产业链</option>
              <option value="低空经济">低空经济产业链</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* 状态筛选 */}
          <div className="relative flex items-center">
            <select
              value={filters.status}
              onChange={e => setFilters(prev => ({ ...prev, status: e.target.value }))}
              aria-label="选择落地或核验状态"
              className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-1.5 pr-7 appearance-none cursor-pointer focus:outline-none focus:border-emerald-500 hover:border-slate-700"
            >
              <option value="全部">状态：全部台账状态</option>
              <option value="已落地">已落地 / 转化投产</option>
              <option value="试点">试点验证中</option>
              <option value="已签约">已签约合作</option>
              <option value="已核验">已核验归档</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>

          {/* 重置筛选 */}
          {(filters.industry !== '全部' || filters.status !== '全部' || filters.timeRange !== '本年度') && (
            <button
              onClick={() => setFilters({ timeRange: '本年度', industry: '全部', status: '全部' })}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs cursor-pointer"
              title="重置筛选"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* ========================================================
          第二行：台账数据展示区（核心） (约 700px)
          根据当前选中的台账分类，分别展示经过加工梳理的核心台账数据：
          - 平台运营台账
          - 产业成果台账
          - 活动台账
          - 算力资源台账
          - 资金台账
         ======================================================== */}
      <div className="h-[685px] px-6 py-2 flex flex-col justify-between shrink-0">
        
        {/* 1. 平台运营台账展示区 */}
        {activeCategory === 'platform' && (
          <div className="h-full flex flex-col justify-between">
            {/* 核心指标汇总卡 (5个) */}
            <div className="grid grid-cols-5 gap-2.5 h-[115px] shrink-0">
              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-3 flex flex-col justify-between relative overflow-hidden shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>活跃用户总台账</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">+16.2% 环比</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">8,240</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">人</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>累计注册: 12,580 人</span>
                  <span className="font-mono text-slate-300 font-medium text-blue-400">高校/企业各占40%+</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-3 flex flex-col justify-between relative overflow-hidden shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>企业认证总台账</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">+12.4% 环比</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">356</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">家</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>发任务企业: 89 家</span>
                  <span className="font-mono text-slate-300 font-medium text-amber-400">高新企业 142家</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3 flex flex-col justify-between relative overflow-hidden shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>产业成果沉淀台账</span>
                  </span>
                  <span className="text-[11px] text-indigo-400 font-mono">转化率 43.8%</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">128</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">项</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>赛事 67 / 实训 38 / 实验 23</span>
                  <span className="font-mono text-slate-300 font-medium text-emerald-400">已落地 56项</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-3 flex flex-col justify-between relative overflow-hidden shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>生态任务交付台账</span>
                  </span>
                  <span className="text-[11px] text-purple-400 font-mono">履约率 92.8%</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">1,234</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">项</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>已完成: 1,145 项</span>
                  <span className="font-mono text-slate-400 font-medium">进行中: 89项</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-3 flex flex-col justify-between relative overflow-hidden shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>算力总调度台账</span>
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">全额财政保障</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">12,580</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">卡时</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>Token调用: 2.3 亿</span>
                  <span className="font-mono text-slate-300 font-medium text-cyan-400">日均 420 卡时</span>
                </div>
              </div>
            </div>

            {/* 中部核心台账分析网格 (左右两大科技面板) */}
            <div className="grid grid-cols-12 gap-4 h-[545px]">
              {/* 左侧：主体培育与资质结构台账 */}
              <div className="col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-bold text-slate-200">用户与企业主体培育结构台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">数据来源：登录日志 + 企业认证表</span>
                </div>

                {/* 用户结构 */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-slate-300">活跃用户主体分类结构 (8,240人)</span>
                    <span className="text-blue-400 font-mono">高校与产业研发双轮驱动</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[11px] text-slate-400">高校师生</div>
                      <div className="text-base font-bold font-mono text-white mt-1">3,461人</div>
                      <div className="text-[10px] text-blue-400 font-medium mt-0.5">占比 42.0%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[11px] text-slate-400">企业研发人员</div>
                      <div className="text-base font-bold font-mono text-white mt-1">3,131人</div>
                      <div className="text-[10px] text-emerald-400 font-medium mt-0.5">占比 38.0%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[11px] text-slate-400">独立开发者</div>
                      <div className="text-base font-bold font-mono text-white mt-1">1,236人</div>
                      <div className="text-[10px] text-amber-400 font-medium mt-0.5">占比 15.0%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[11px] text-slate-400">科研院所</div>
                      <div className="text-base font-bold font-mono text-white mt-1">412人</div>
                      <div className="text-[10px] text-purple-400 font-medium mt-0.5">占比 5.0%</div>
                    </div>
                  </div>
                </div>

                {/* 企业资质 */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span className="font-semibold text-slate-300">认证企业资质台账构成 (356家)</span>
                    <span className="text-amber-400 font-mono">科技型企业占比 83.7%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2.5">
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[11px] text-slate-400">高新技术企业</div>
                      <div className="text-base font-bold font-mono text-white mt-1">142家</div>
                      <div className="text-[10px] text-emerald-400 font-medium mt-0.5">占比 39.9%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[11px] text-slate-400">专精特新企业</div>
                      <div className="text-base font-bold font-mono text-white mt-1">68家</div>
                      <div className="text-[10px] text-amber-400 font-medium mt-0.5">国家/省级认定</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[11px] text-slate-400">科技型中小企业</div>
                      <div className="text-base font-bold font-mono text-white mt-1">118家</div>
                      <div className="text-[10px] text-blue-400 font-medium mt-0.5">占比 33.1%</div>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                      <div className="text-[11px] text-slate-400">重点央企/龙头</div>
                      <div className="text-base font-bold font-mono text-white mt-1">28家</div>
                      <div className="text-[10px] text-purple-400 font-medium mt-0.5">链主核心单位</div>
                    </div>
                  </div>
                </div>

                {/* 底部摘要说明 */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>主体台账合规核验：已完成2026年三季度身份合规与企业税号统一校验，合规率100%</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">凭证号：REG-2026-Q3</span>
                </div>
              </div>

              {/* 右侧：任务流转与平台能力建设台账 */}
              <div className="col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-200">任务履约与能力建设台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">数据来源：任务工坊 + 模型库调用</span>
                </div>

                {/* 任务类型分布条形 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">核心任务类型流转台账 (累计1,234项)</span>
                    <span className="text-emerald-400 font-mono">交付完成率 92.8%</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { name: '算法技术攻关 (揭榜挂帅)', count: 468, pct: 38, color: 'bg-blue-500' },
                      { name: '模型精调与LoRA训练适配', count: 342, pct: 28, color: 'bg-emerald-500' },
                      { name: '行业数据集清洗与标注', count: 280, pct: 22, color: 'bg-amber-500' },
                      { name: '原型验证与工程部署测试', count: 144, pct: 12, color: 'bg-purple-500' }
                    ].map(task => (
                      <div key={task.name} className="flex items-center gap-3 text-xs">
                        <span className="w-44 text-slate-400 truncate">{task.name}</span>
                        <div className="flex-1 h-3 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                          <div className={`h-full rounded-full ${task.color}`} style={{ width: `${task.pct}%` }} />
                        </div>
                        <span className="w-16 font-mono text-right text-slate-200 font-bold">{task.count} 项</span>
                        <span className="w-10 font-mono text-right text-slate-400 text-[11px]">{task.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 平台能力建设成效台账 */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-300">平台基础设施与技术资源台账 (5项核心)</span>
                    <span className="text-cyan-400 font-mono">资产总规模持续扩充</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">上线模型</div>
                      <div className="text-sm font-bold font-mono text-cyan-400 mt-0.5">42 个</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">开源数据集</div>
                      <div className="text-sm font-bold font-mono text-emerald-400 mt-0.5">156 个</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">开放API</div>
                      <div className="text-sm font-bold font-mono text-blue-400 mt-0.5">89 个</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">技术文档</div>
                      <div className="text-sm font-bold font-mono text-amber-400 mt-0.5">320 篇</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                      <div className="text-[10px] text-slate-400">生态工具箱</div>
                      <div className="text-sm font-bold font-mono text-purple-400 mt-0.5">64 款</div>
                    </div>
                  </div>
                </div>

                {/* 效益摘要 */}
                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <TrendingUp className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>产出效益审计：平均任务周期从32天压降至18.2天，促成产业链技术订单累计1.2亿元</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-mono font-semibold">履约率 92.8%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. 产业成果台账展示区 */}
        {activeCategory === 'industry' && (
          <div className="h-full flex flex-col justify-between">
            {/* 核心指标汇总卡 (5个) */}
            <div className="grid grid-cols-5 gap-2.5 h-[115px] shrink-0">
              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-blue-400" />
                    <span>产业成果总数台账</span>
                  </span>
                  <span className="text-[11px] text-blue-400 font-mono">TRL 6~9级</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">128</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">项</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>赛事 67 / 实训 38 / 实验 23</span>
                  <span className="font-mono text-slate-300 font-medium text-blue-400">全面建档</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>已落地转化台账</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">转化率 43.8%</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 leading-none">56</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">项</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>智造 18 / 电子 15 / 生医药 10 / 其他 13</span>
                  <span className="font-mono text-slate-300 font-medium text-emerald-400">产线投产</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>试点验证中台账</span>
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">在库验证中</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-amber-400 leading-none">42</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">项</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>智造 14 / 电子 12 / 生医药 8 / 其他 8</span>
                  <span className="font-mono text-slate-300 font-medium text-amber-400">原型测试</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>已签约合作台账</span>
                  </span>
                  <span className="text-[11px] text-purple-400 font-mono">意向转合同</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-purple-400 leading-none">30</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">项</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>智造 10 / 电子 8 / 生医药 6 / 其他 6</span>
                  <span className="font-mono text-slate-300 font-medium text-purple-400">金额 8,650万</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-cyan-400" />
                    <span>覆盖主导产业链</span>
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">全市覆盖</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">6</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">条核心链条</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>智能制造、电子信息、生物医药等</span>
                  <span className="font-mono text-slate-300 font-medium text-cyan-400">链上标杆 100%</span>
                </div>
              </div>
            </div>

            {/* 中部核心台账分析网格 */}
            <div className="grid grid-cols-12 gap-4 h-[545px]">
              {/* 六大产业链转化矩阵 */}
              <div className="col-span-7 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-200">六大产业链成果分布与转化台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">口径：已通过市工信局项目核验</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: '智能制造', total: 42, landed: 18, pilot: 14, signed: 10, val: '4,680 万元', tag: '锂电隔膜视觉巡检等' },
                    { name: '电子信息', total: 35, landed: 15, pilot: 12, signed: 8, val: '3,850 万元', tag: 'EDA多层仿真助手等' },
                    { name: '生物医药', total: 24, landed: 10, pilot: 8, signed: 6, val: '2,120 万元', tag: '分子靶点高通量筛选' },
                    { name: '新能源', total: 14, landed: 7, pilot: 4, signed: 3, val: '1,160 万元', tag: '储能电站AI调度系统' },
                    { name: '软件信息', total: 9, landed: 4, pilot: 3, signed: 2, val: '620 万元', tag: '水务物联防汛调度' },
                    { name: '低空经济', total: 4, landed: 2, pilot: 1, signed: 1, val: '220 万元', tag: '多源巡检视觉导航' }
                  ].map(ind => (
                    <div key={ind.name} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{ind.name}</span>
                        <span className="font-mono text-emerald-400 font-bold text-xs">{ind.total} 项</span>
                      </div>
                      <div className="flex items-center gap-2 my-2 text-[11px] text-slate-400">
                        <span className="text-emerald-400">落 {ind.landed}</span>
                        <span>•</span>
                        <span className="text-amber-400">试 {ind.pilot}</span>
                        <span>•</span>
                        <span className="text-purple-400">签 {ind.signed}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate border-t border-slate-800/80 pt-1.5 flex justify-between">
                        <span className="truncate">{ind.tag}</span>
                        <span className="font-mono text-slate-300 font-semibold shrink-0 ml-1">{ind.val}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* 落地转化周期与效益 */}
                <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>转化周期成效：从技术揭榜到投产落地平均周期 4.2 个月，技术成熟度达 TRL-8/9 级占比 62.5%</span>
                  </div>
                  <span className="text-emerald-400 font-mono font-bold">累计拉动产值 1.26 亿元</span>
                </div>
              </div>

              {/* 右侧：区域载体与知识产权台账 */}
              <div className="col-span-5 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-cyan-500" />
                    <h3 className="text-sm font-bold text-slate-200">区域载体分布与知识产权台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">全市各区落地统计</span>
                </div>

                {/* 区域载体分布 */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">核心板块承接成果台账分布</div>
                  <div className="space-y-1.5">
                    {[
                      { district: '江宁区 (智算中心/欣旺达等)', count: 38, pct: 30, color: 'bg-emerald-500' },
                      { district: '浦口区 (南京集成电路/低空经济)', count: 28, pct: 22, color: 'bg-blue-500' },
                      { district: '栖霞区 (南大/经开区智造集群)', count: 24, pct: 19, color: 'bg-cyan-500' },
                      { district: '雨花台区 (软件谷/南瑞继保)', count: 20, pct: 16, color: 'bg-amber-500' },
                      { district: '玄武区 & 其他主城区 (东大/医药)', count: 18, pct: 13, color: 'bg-purple-500' }
                    ].map(d => (
                      <div key={d.district} className="flex items-center gap-2.5 text-xs">
                        <span className="w-48 text-slate-400 truncate">{d.district}</span>
                        <div className="flex-1 h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800/80">
                          <div className={`h-full rounded-full ${d.color}`} style={{ width: `${d.pct}%` }} />
                        </div>
                        <span className="w-14 font-mono text-right text-slate-200 font-bold">{d.count} 项</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 知识产权与成果产出 */}
                <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-slate-800/80">
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">发明专利申请</div>
                    <div className="text-base font-bold font-mono text-cyan-400 mt-1">47 项</div>
                    <div className="text-[9px] text-emerald-400 mt-0.5">已授权 18 项</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">软件著作权</div>
                    <div className="text-base font-bold font-mono text-emerald-400 mt-1">83 件</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">全量代码存证</div>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-center">
                    <div className="text-[10px] text-slate-400">行业技术标准</div>
                    <div className="text-base font-bold font-mono text-amber-400 mt-1">6 项</div>
                    <div className="text-[9px] text-amber-400 mt-0.5">团体/行业标准</div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>成果权属审计：128项成果均已签署明晰的知识产权归属协议，零法律权属纠纷</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">100% 权属合规</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. 活动台账展示区 */}
        {activeCategory === 'activities' && (
          <div className="h-full flex flex-col justify-between">
            {/* 核心指标汇总卡 (5个) */}
            <div className="grid grid-cols-5 gap-2.5 h-[115px] shrink-0">
              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-amber-400" />
                    <span>产业活动举办场次</span>
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">已全部完成</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">11</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">场</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>赛事 3 / 实训 2 / 沙龙 4 / 路演 2</span>
                  <span className="font-mono text-slate-300 font-medium text-amber-400">100% 办结</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-blue-400" />
                    <span>活动参与规模台账</span>
                  </span>
                  <span className="text-[11px] text-blue-400 font-mono">报名签到审计</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">1,280</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">人次</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>赛事 620 / 实训 320 / 沙龙 220 / 路演 120</span>
                  <span className="font-mono text-slate-300 font-medium text-blue-400">实名核验</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>产业成果产出台账</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">高质量产出</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">156</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">项</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>赛事成果 89 / 实训作品 45 / 其他 22</span>
                  <span className="font-mono text-slate-300 font-medium text-emerald-400">均已归档</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>活动算力投入台账</span>
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">精准计量</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">12,580</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">卡时</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>赛事 3,200 / 实训 4,500 / 其他 4,880</span>
                  <span className="font-mono text-slate-300 font-medium text-cyan-400">全额核销</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-purple-400" />
                    <span>活动覆盖企业台账</span>
                  </span>
                  <span className="text-[11px] text-purple-400 font-mono">深度融入</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">89</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">家</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>参赛企业 56 / 实训企业 33</span>
                  <span className="font-mono text-slate-300 font-medium text-purple-400">覆盖全产业链</span>
                </div>
              </div>
            </div>

            {/* 中部核心台账分析网格 */}
            <div className="grid grid-cols-12 gap-4 h-[545px]">
              {/* 四大活动效益矩阵 */}
              <div className="col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-bold text-slate-200">四大类产业活动投入产出对比台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">数据来源：活动结案报告表</span>
                </div>

                <div className="space-y-3">
                  {[
                    { type: '产业创新赛事 (3场)', count: '620 人次', compute: '3,200 卡时', output: '89 项成果', highlight: '获奖落地率 42%', color: 'border-l-blue-500' },
                    { type: '工程技能实训 (2场)', count: '320 人次', compute: '4,500 卡时', output: '45 项作品', highlight: '结业认证 320 人', color: 'border-l-emerald-500' },
                    { type: '闭门产业沙龙 (4场)', count: '220 人次', compute: '1,880 卡时', output: '42 条需求', highlight: '促成合作 15 家', color: 'border-l-amber-500' },
                    { type: '项目投融路演 (2场)', count: '120 人次', compute: '3,000 卡时', output: '12 个路演', highlight: '融资意向 6,200万', color: 'border-l-purple-500' }
                  ].map(act => (
                    <div key={act.type} className={`p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 border-l-4 ${act.color} flex items-center justify-between`}>
                      <div>
                        <div className="font-bold text-xs text-white">{act.type}</div>
                        <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400">
                          <span>参会：<strong className="text-slate-200">{act.count}</strong></span>
                          <span>投入：<strong className="text-cyan-400">{act.compute}</strong></span>
                          <span>产出：<strong className="text-emerald-400">{act.output}</strong></span>
                        </div>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-slate-900 border border-slate-700/80 text-[11px] font-mono font-bold text-amber-300">
                        {act.highlight}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>活动资金结案审计：11场活动已全部完成第三方专项审计，算力补贴与赛事奖金发放零差错</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">100% 审计合规</span>
                </div>
              </div>

              {/* 校企合作与人才引育效益 */}
              <div className="col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-bold text-slate-200">活动赋能人才引育与校企协同台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">数据来源：学员档案与合作协议</span>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-400">AI紧缺人才结业与认证</div>
                      <div className="text-2xl font-black font-mono text-emerald-400 mt-1">320 人</div>
                      <div className="text-[11px] text-slate-300 mt-2 space-y-1">
                        <div>• 工业大模型微调工程师：180人</div>
                        <div>• 计算机视觉与嵌入式算法：140人</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-emerald-400 font-mono">
                      人社认证考核通过率 96.4%
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-slate-400">赛训促成就业与签约</div>
                      <div className="text-2xl font-black font-mono text-blue-400 mt-1">168 人</div>
                      <div className="text-[11px] text-slate-300 mt-2 space-y-1">
                        <div>• 留宁重点制造/电子企业：124人</div>
                        <div>• 顶尖算法岗位平均月薪：2.2万元</div>
                      </div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] text-blue-400 font-mono">
                      留宁就业转化率 73.8%
                    </div>
                  </div>
                </div>

                {/* 合作高校与科研院所 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>深度协同高校院所 (12所)</span>
                    <span className="text-purple-400 font-mono text-[11px]">南京大学 / 东南大学 / 南航 / 南理工 / 中科院</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['南京大学', '东南大学', '南京航空航天大学', '南京理工大学', '南京邮电大学', '中科院微电子所南京中心'].map(u => (
                      <span key={u} className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                        {u}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>企业满意度评价：活动综合满意度达 98.6%，参会企业AI技术采纳率提升52%</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">98.6% 满意度</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. 算力资源台账展示区 */}
        {activeCategory === 'compute' && (
          <div className="h-full flex flex-col justify-between">
            {/* 核心指标汇总卡 (5个) */}
            <div className="grid grid-cols-5 gap-2.5 h-[115px] shrink-0">
              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>算力总调度量台账</span>
                  </span>
                  <span className="text-[11px] text-cyan-400 font-mono">累计核销</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">12,580</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">卡时</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>日均调度量: 420 卡时/天</span>
                  <span className="font-mono text-slate-300 font-medium text-cyan-400">稳态利用</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Token调用总台账</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">模型调用</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 leading-none">2.3</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">亿次</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>多模态 1.4亿 / 通用 0.9亿</span>
                  <span className="font-mono text-slate-300 font-medium text-emerald-400">毫秒级响应</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-blue-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-400" />
                    <span>算力节点规模台账</span>
                  </span>
                  <span className="text-[11px] text-blue-400 font-mono">集群纳管</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">128</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">物理节点</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>华为昇腾 64 / NVIDIA 48 / 申威 16</span>
                  <span className="font-mono text-slate-300 font-medium text-blue-400">国产占比62%</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>惠企成本减免台账</span>
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">财政直达</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-amber-400 leading-none">468.0</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">万元</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>惠及创新企业 89 家</span>
                  <span className="font-mono text-slate-300 font-medium text-amber-400">研发降本45%</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
                    <span>SLA可用率台账</span>
                  </span>
                  <span className="text-[11px] text-purple-400 font-mono">高可用</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">99.98</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>排队均时 &lt; 1.8 分钟</span>
                  <span className="font-mono text-slate-300 font-medium text-purple-400">零越权事故</span>
                </div>
              </div>
            </div>

            {/* 中部核心台账分析网格 */}
            <div className="grid grid-cols-12 gap-4 h-[545px]">
              {/* 算力使用业务线流向 */}
              <div className="col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-cyan-500" />
                    <h3 className="text-sm font-bold text-slate-200">算力资源调度与使用结构台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">总调度量：12,580 卡时</span>
                </div>

                <div className="space-y-3">
                  {[
                    { line: '实训（技能工程）', hours: 4500, pct: 35.8, color: 'bg-emerald-500', desc: '学员LoRA微调与算法实训环境' },
                    { line: '赛事（产业创新）', hours: 3200, pct: 25.4, color: 'bg-blue-500', desc: '场景赛模型评测与分布式竞赛训练' },
                    { line: '实验场（企业原型）', hours: 2880, pct: 22.9, color: 'bg-purple-500', desc: '重点企业原型验证与产线算法测试' },
                    { line: '模型调用', hours: 1200, pct: 9.5, color: 'bg-cyan-500', desc: '基础与行业垂直大模型推理API在线调用' },
                    { line: 'Agent调用', hours: 800, pct: 6.4, color: 'bg-amber-500', desc: '智能体工作流执行引擎与多工具链自动化调度' }
                  ].map(item => (
                    <div key={item.line} className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{item.line}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-cyan-400 font-bold">{item.hours} 卡时</span>
                          <span className="font-mono text-slate-400 text-[11px]">{item.pct}%</span>
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                      <div className="text-[10px] text-slate-400 pt-0.5">{item.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>计量清算审计：所有卡时消耗与Token日志精确对齐调度单号，支持逐单回溯核验</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">100% 账实相符</span>
                </div>
              </div>

              {/* 集群资源池负载与硬件状态 */}
              <div className="col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-blue-500" />
                    <h3 className="text-sm font-bold text-slate-200">三大算力集群资源池负载台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">实时硬件遥测汇聚</span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">华为昇腾910B集群</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">南京智算中心</div>
                      <div className="text-xl font-bold font-mono text-cyan-400 mt-2">7,420 卡时</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>负载率</span>
                        <span className="font-mono text-emerald-400 font-bold">86.4%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>节点数</span>
                        <span className="font-mono text-white">64 节点</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">NVIDIA A800/H800池</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">智算二期超算机房</div>
                      <div className="text-xl font-bold font-mono text-blue-400 mt-2">3,980 卡时</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>负载率</span>
                        <span className="font-mono text-blue-400 font-bold">79.2%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>节点数</span>
                        <span className="font-mono text-white">48 节点</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">国产超算与异构池</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">麒麟科技城节点</div>
                      <div className="text-xl font-bold font-mono text-purple-400 mt-2">1,180 卡时</div>
                    </div>
                    <div className="mt-3 pt-2 border-t border-slate-800 text-[11px] space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>负载率</span>
                        <span className="font-mono text-purple-400 font-bold">71.5%</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>节点数</span>
                        <span className="font-mono text-white">16 节点</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 调度峰谷与耗用趋势摘要 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1.5">
                  <div className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>近6个月调度量递增台账 (卡时)</span>
                    <span className="text-emerald-400 font-mono text-[11px]">月均稳步提升 +35.8%</span>
                  </div>
                  <div className="grid grid-cols-6 gap-2 text-center pt-1">
                    {[
                      { m: '5月', h: 1900 },
                      { m: '6月', h: 2120 },
                      { m: '7月', h: 2090 },
                      { m: '8月', h: 2500 },
                      { m: '9月', h: 2430 },
                      { m: '10月', h: 2580 }
                    ].map(item => (
                      <div key={item.m} className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                        <div className="text-[10px] text-slate-400">{item.m}</div>
                        <div className="text-xs font-bold font-mono text-white mt-0.5">{item.h}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>算力安全审计：全时段开启隔离沙箱与网络防护，未发生任何数据越界或非法挖矿行为</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">零安全事件</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. 资金台账展示区 */}
        {activeCategory === 'finance' && (
          <div className="h-full flex flex-col justify-between">
            {/* 核心指标汇总卡 (5个) */}
            <div className="grid grid-cols-5 gap-2.5 h-[115px] shrink-0">
              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Coins className="w-3.5 h-3.5 text-amber-400" />
                    <span>财政专项预算台账</span>
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">2026年度</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">850.0</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">万元</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>南京市AI生态专项发展基金</span>
                  <span className="font-mono text-slate-300 font-medium text-amber-400">财政全额核批</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                    <span>算力补贴券已发放</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">惠及89家企业</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-cyan-400 leading-none">320.0</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">万元</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>采购抵扣算力卡时12,580h</span>
                  <span className="font-mono text-slate-300 font-medium text-cyan-400">执行率 94.2%</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                    <span>揭榜与赛事奖金台账</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">精准直达</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-emerald-400 leading-none">186.5</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">万元</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>结算攻坚任务与获奖团队</span>
                  <span className="font-mono text-slate-300 font-medium text-emerald-400">100% 结算</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-purple-400" />
                    <span>撬动企业自筹配套</span>
                  </span>
                  <span className="text-[11px] text-purple-400 font-mono">财政放大效应</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-purple-400 leading-none">1,420.0</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">万元</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>杠杆放大比例 1 : 2.7</span>
                  <span className="font-mono text-slate-300 font-medium text-purple-400">企业跟投强劲</span>
                </div>
              </div>

              <div className="rounded-2xl bg-slate-900/90 hover:bg-slate-900 border border-slate-800 hover:border-emerald-500/40 p-3 flex flex-col justify-between shadow-md group transition-all duration-200">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>预算资金执行率</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-mono">合规审计</span>
                </div>
                <div className="my-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold font-mono tracking-tight text-white leading-none">88.4</span>
                    <span className="text-xs text-slate-400 font-normal ml-1">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1.5 border-t border-slate-800/80">
                  <span>市审计局专项核验合格率 100%</span>
                  <span className="font-mono text-slate-300 font-medium text-emerald-400">合规达标</span>
                </div>
              </div>
            </div>

            {/* 中部核心台账分析网格 */}
            <div className="grid grid-cols-12 gap-4 h-[545px]">
              {/* 资金支出科目明细台账 */}
              <div className="col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-amber-500" />
                    <h3 className="text-sm font-bold text-slate-200">财政专项资金支出科目与拨付台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">总预算：850.0 万元</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { name: '算力资源券采购与直达补贴', budget: '320.0 万元', pct: 37.6, desc: '定向抵扣智算卡时费用，惠及89家企业', color: 'bg-cyan-500' },
                    { name: '“揭榜挂帅”算法任务悬赏金', budget: '186.5 万元', pct: 21.9, desc: '攻关34项关键算法，分阶段验收核拨', color: 'bg-emerald-500' },
                    { name: '场景创新挑战赛优秀奖励', budget: '150.0 万元', pct: 17.6, desc: '18个获奖项目落地注册与研发奖励', color: 'bg-blue-500' },
                    { name: 'AI紧缺工程人才实训补贴', budget: '95.0 万元', pct: 11.2, desc: '人社认证合格学员与特聘导师津贴', color: 'bg-purple-500' },
                    { name: '生态看板与数据平台运维', budget: '98.5 万元', pct: 11.6, desc: '安全等保、灾备及7×24驻场技术保障', color: 'bg-slate-400' }
                  ].map(item => (
                    <div key={item.name} className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white">{item.name}</span>
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-amber-400 font-bold">{item.budget}</span>
                          <span className="font-mono text-slate-400 text-[11px]">{item.pct}%</span>
                        </div>
                      </div>
                      <div className="h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                        <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                      </div>
                      <div className="text-[10px] text-slate-400">{item.desc}</div>
                    </div>
                  ))}
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>国库集中支付审计：每笔款项均持有财政专项审批文号，支付凭证已完成电子验签</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-mono font-semibold">凭证 100% 齐备</span>
                </div>
              </div>

              {/* 受益产业分布与资金执行进度 */}
              <div className="col-span-6 rounded-2xl bg-slate-900/80 border border-slate-800/90 p-5 flex flex-col justify-between shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-4 rounded-full bg-emerald-500" />
                    <h3 className="text-sm font-bold text-slate-200">资金倾斜产业分布与拨付进度台账</h3>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">效益审计与杠杆放大</span>
                </div>

                {/* 受益产业分布 */}
                <div className="space-y-2">
                  <div className="text-xs font-semibold text-slate-300">专项补贴资金倾斜产业分布</div>
                  <div className="space-y-1.5">
                    {[
                      { industry: '智能制造装备与新能源 (江宁/溧水)', amount: '323.0 万元', pct: 38, color: 'bg-emerald-500' },
                      { industry: '电子信息与集成电路EDA (浦口/江北)', amount: '246.5 万元', pct: 29, color: 'bg-blue-500' },
                      { industry: '生物医药与新药研发 (新港/药谷)', amount: '153.0 万元', pct: 18, color: 'bg-purple-500' },
                      { industry: '软件信息与低空经济 (软件谷/浦口)', amount: '127.5 万元', pct: 15, color: 'bg-amber-500' }
                    ].map(item => (
                      <div key={item.industry} className="flex items-center gap-3 text-xs">
                        <span className="w-52 text-slate-400 truncate">{item.industry}</span>
                        <div className="flex-1 h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                        </div>
                        <span className="w-16 font-mono text-right text-slate-200 font-bold">{item.amount}</span>
                        <span className="w-8 font-mono text-right text-slate-400 text-[11px]">{item.pct}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 拨付进度 */}
                <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-2">
                  <div className="text-xs font-semibold text-slate-300 flex justify-between">
                    <span>季度拨付节奏与执行率</span>
                    <span className="text-emerald-400 font-mono text-[11px]">当前执行率 88.4%</span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-center pt-1">
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">第一季度</div>
                      <div className="text-xs font-bold font-mono text-slate-300 mt-0.5">22.0%</div>
                      <div className="text-[9px] text-emerald-400">启动与采购</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">第二季度</div>
                      <div className="text-xs font-bold font-mono text-slate-300 mt-0.5">48.0%</div>
                      <div className="text-[9px] text-emerald-400">算力券首批</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-[10px] text-slate-400">第三季度</div>
                      <div className="text-xs font-bold font-mono text-slate-300 mt-0.5">75.0%</div>
                      <div className="text-[9px] text-emerald-400">揭榜中期核拨</div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-900 border border-slate-800 ring-1 ring-emerald-500/40">
                      <div className="text-[10px] text-emerald-400 font-bold">第四季度(现)</div>
                      <div className="text-xs font-bold font-mono text-emerald-400 mt-0.5">88.4%</div>
                      <div className="text-[9px] text-emerald-400">赛事奖励结算</div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <TrendingUp className="w-4 h-4 text-purple-400 shrink-0" />
                    <span>财政绩效评价：单位财政资金撬动成果产出达 0.18项/万元，企业自筹资金放大2.7倍</span>
                  </div>
                  <span className="text-[11px] text-purple-400 font-mono font-semibold">绩效评价优 (98分)</span>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ========================================================
          第三行：台账明细滚动列表 (约 180px)
          展示当前台账的实时明细流水，支持自动平滑滚动/走马灯轮播；
          放不下的可通过二级弹窗展开查看；
          配有鼠标悬停暂停、翻页控制与单条展开按钮！
         ======================================================== */}
      <div className="h-[180px] px-6 pb-2.5 shrink-0 flex flex-col justify-between">
        <div
          className="h-full rounded-2xl bg-slate-900/90 border border-slate-800/90 p-3.5 flex flex-col justify-between backdrop-blur-md shadow-lg"
          onMouseEnter={() => setIsTickerPlaying(false)}
          onMouseLeave={() => setIsTickerPlaying(true)}
        >
          {/* 明细区域顶部标题与控制器 */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-800/80">
            <div className="flex items-center gap-2.5">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-200">
                {categoryMeta[activeCategory].label} · 实时流水明细 (共 {currentDetailList.length} 条有效记录)
              </span>
              <span className="text-[11px] text-slate-400">
                （支持自动滚动与点击单行展开完整二级凭单）
              </span>
            </div>

            {/* 控制器 */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsTickerPlaying(prev => !prev)}
                className="px-2 py-1 rounded-lg bg-slate-950 border border-slate-800 text-[11px] text-slate-300 hover:text-white flex items-center gap-1 cursor-pointer"
                title={isTickerPlaying ? '暂停轮播' : '继续轮播'}
              >
                {isTickerPlaying ? <Pause className="w-3 h-3 text-amber-400" /> : <Play className="w-3 h-3 text-emerald-400" />}
                <span>{isTickerPlaying ? '暂停轮播' : '自动轮播'}</span>
              </button>

              <button
                onClick={() => setTickerOffset(prev => (prev - 1 + currentDetailList.length) % currentDetailList.length)}
                className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title="上一条"
              >
                <ChevronDown className="w-3 h-3 rotate-180" />
              </button>

              <button
                onClick={() => setTickerOffset(prev => (prev + 1) % currentDetailList.length)}
                className="p-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title="下一条"
              >
                <ChevronDown className="w-3 h-3" />
              </button>

              <button
                onClick={() => setSelectedDetail(currentDetailList[tickerOffset] || currentDetailList[0])}
                className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-[11px] font-semibold text-emerald-300 flex items-center gap-1 cursor-pointer"
              >
                <Eye className="w-3 h-3" />
                <span>二级弹窗展开查看</span>
              </button>
            </div>
          </div>

          {/* 表头 */}
          <div className="grid grid-cols-12 gap-2 text-[11px] font-semibold text-slate-400 px-2 py-1 bg-slate-950/40 rounded-lg">
            <span className="col-span-2">台账凭证编号</span>
            <span className="col-span-3">台账名称 / 申报主体</span>
            <span className="col-span-1">业务分类</span>
            <span className="col-span-1">记账日期</span>
            <span className="col-span-2">核心指标 / 规模</span>
            <span className="col-span-1">核验状态</span>
            <span className="col-span-2 text-right">审计编号 / 操作</span>
          </div>

          {/* 明细走马灯展示行 (显示当前窗口内的3条) */}
          <div ref={tickerContainerRef} className="space-y-1.5 overflow-hidden">
            {[0, 1, 2].map(idx => {
              const itemIndex = (tickerOffset + idx) % currentDetailList.length;
              const row = currentDetailList[itemIndex];
              if (!row) return null;
              const isFirst = idx === 0;

              return (
                <div
                  key={`${row.id}-${idx}`}
                  onClick={() => setSelectedDetail(row)}
                  className={`grid grid-cols-12 gap-2 text-xs px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer items-center ${
                    isFirst
                      ? 'bg-slate-950/80 border-emerald-500/50 shadow-sm shadow-emerald-500/10 text-slate-100 ring-1 ring-emerald-500/20'
                      : 'bg-slate-950/40 border-slate-800/80 text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {/* 凭证编号 */}
                  <span className="col-span-2 font-mono text-[11px] text-cyan-400 font-bold truncate">
                    {row.code}
                  </span>

                  {/* 台账名称 / 主体 */}
                  <div className="col-span-3 truncate">
                    <span className="font-semibold text-white">{row.title}</span>
                    <span className="text-[10px] text-slate-400 block truncate">{row.entity}</span>
                  </div>

                  {/* 业务分类 */}
                  <span className="col-span-1 text-[11px] text-slate-300 truncate">
                    {row.category}
                  </span>

                  {/* 记账日期 */}
                  <span className="col-span-1 font-mono text-[11px] text-slate-400">
                    {row.date}
                  </span>

                  {/* 核心指标 */}
                  <div className="col-span-2 text-[11px]">
                    <span className="font-mono text-emerald-400 font-bold">{row.metric1}</span>
                    <span className="text-[10px] text-slate-400 ml-1.5 font-mono">({row.metric2})</span>
                  </div>

                  {/* 核验状态 */}
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        row.statusType === 'success'
                          ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                          : row.statusType === 'warning'
                          ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          : 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>

                  {/* 操作与审计码 */}
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <span className="font-mono text-[10px] text-slate-400 hidden lg:inline truncate">
                      {row.auditCode}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-[10px] text-slate-200 font-semibold flex items-center gap-1">
                      <span>查阅</span>
                      <ArrowUpRight className="w-2.5 h-2.5 text-emerald-400" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ========================================================
          二级弹窗：核心数据台账明细凭单及审计档案
          (放不下的可通过二级弹窗展开查看)
         ======================================================== */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-[820px] max-w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
            {/* 弹窗头部 */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <span>{selectedDetail.title}</span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {selectedDetail.status}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    凭单流水号：<span className="font-mono text-cyan-400">{selectedDetail.code}</span> ｜ 
                    归属科目：<span className="text-slate-300">{selectedDetail.category}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedDetail(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 弹窗主体内容 */}
            <div className="p-6 space-y-4 max-h-[580px] overflow-y-auto">
              {/* 四个核心信息卡 */}
              <div className="grid grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400">申报/责任主体</div>
                  <div className="text-xs font-bold text-white mt-1 truncate">{selectedDetail.entity}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400">记账与核准日期</div>
                  <div className="text-xs font-bold font-mono text-white mt-1">{selectedDetail.date}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400">{selectedDetail.metric1Label}</div>
                  <div className="text-xs font-bold font-mono text-emerald-400 mt-1">{selectedDetail.metric1}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800">
                  <div className="text-[11px] text-slate-400">{selectedDetail.metric2Label}</div>
                  <div className="text-xs font-bold font-mono text-cyan-400 mt-1">{selectedDetail.metric2}</div>
                </div>
              </div>

              {/* 详细台账说明与说明 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-blue-400" />
                  <span>台账明细业务说明与执行摘要</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {selectedDetail.remarks}
                </p>
              </div>

              {/* 审计存证与数据源溯源 */}
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2.5">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>台账审计编号与官方数据源溯源</span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">审计备案凭证：</span>
                    <span className="font-mono text-emerald-400 font-bold ml-1">{selectedDetail.auditCode}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
                    <span className="text-slate-400">权威数据来源：</span>
                    <span className="text-slate-200 font-medium ml-1">{selectedDetail.dataSource}</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-400">
                  声明：该记录已纳入南京市人工智能综合运营数据安全台账，经市工业和信息化局与第三方审计机构核准，真实有效，具备法律与审计存证效力。
                </p>
              </div>
            </div>

            {/* 弹窗底栏 */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between">
              <span className="text-xs text-slate-400 font-mono">
                数字防伪指纹：SHA256:7b92...e4a1
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    showToast(`已打印《${selectedDetail.title}》台账存根凭据`);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>打印凭证</span>
                </button>
                <button
                  onClick={() => {
                    showToast(`已下载单条凭单档案 (${selectedDetail.code}.pdf)`);
                    setSelectedDetail(null);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>下载单条凭单</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================
          导出报告对话框 (可导出当前台账为 PDF / Excel / Word)
         ======================================================== */}
      {isExportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-[520px] max-w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col text-slate-100">
            {/* 头部 */}
            <div className="p-5 border-b border-slate-800 bg-slate-950/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <Download className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">导出当前台账综合报告</h3>
                  <p className="text-[11px] text-slate-400">
                    当前导出台账：{categoryMeta[activeCategory].label} ({filters.timeRange})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 格式选择 */}
            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-2">选择导出文件格式：</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { format: 'PDF', desc: '用于领导致辞与正式呈报', icon: FileText },
                    { format: 'Excel', desc: '用于数据测算与台账审计', icon: FileSpreadsheet },
                    { format: 'Word', desc: '用于综合文字材料汇编', icon: FileCheck2 }
                  ].map(f => {
                    const Icon = f.icon;
                    const isSel = exportFormat === f.format;
                    return (
                      <button
                        key={f.format}
                        onClick={() => setExportFormat(f.format as any)}
                        className={`p-3 rounded-xl border text-left transition cursor-pointer flex flex-col justify-between ${
                          isSel
                            ? 'bg-emerald-600/20 border-emerald-500 text-white ring-1 ring-emerald-500/40'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <Icon className={`w-4 h-4 ${isSel ? 'text-emerald-400' : 'text-slate-400'}`} />
                          {isSel && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                        </div>
                        <div className="text-xs font-bold">{f.format} 格式</div>
                        <div className="text-[10px] text-slate-400 mt-1">{f.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 包含范围提示 */}
              <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1.5 text-slate-300">
                <div className="font-semibold text-white">导出台账涵盖内容说明：</div>
                <div className="text-[11px] text-slate-400">• 顶部5项核心加工指标汇算与环比分析</div>
                <div className="text-[11px] text-slate-400">• 中部主体结构/产业链转化/算力流向分析矩阵</div>
                <div className="text-[11px] text-slate-400">• 底部全量 {currentDetailList.length} 条已核验流水明细清单与审计编号</div>
              </div>
            </div>

            {/* 底栏 */}
            <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsExportModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleExport}
                disabled={isExporting}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white flex items-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-600/30 disabled:opacity-50"
              >
                {isExporting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>正在生成并导出...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-3.5 h-3.5" />
                    <span>确认导出 {exportFormat}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EcoLedgerReportTab;
