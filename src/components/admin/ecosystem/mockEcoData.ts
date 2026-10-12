export interface EcoUserItem {
  id: string;
  nickname: string;
  avatar: string;
  role: string;
  businessLine: '赛事' | '实训' | '实验场' | '模型调用' | 'Agent调用';
  registerTime: string;
  lastActiveTime: string;
  computeConsumed: number;
}

export interface EcoEnterpriseItem {
  id: string;
  name: string;
  logo?: string;
  industry: '智能制造' | '电子信息' | '生物医药' | '新能源' | '文旅' | '城市治理';
  certifiedTime: string;
  tasksPublishedCount: number;
  trainingsSponsoredCount: number;
  computeConsumed: number;
  status: '已认证' | '高新技术企业' | '专精特新';
}

export interface EcoCaseItem {
  id: string;
  title: string;
  enterpriseName: string;
  industry: '智能制造' | '电子信息' | '生物医药' | '新能源' | '文旅' | '城市治理';
  problemSolved: string;
  solutionDetail: string;
  source: '场景赛' | '实训' | '任务' | '实验场';
  status: '已落地' | '试点中' | '已签约' | '已落地转化' | '试点验证中' | '已签约合作';
  computeConsumed: number;
  tokensConsumed: string;
  teamMembers: string[];
  deploymentLocation?: string;
  economicValue?: string;
  relatedLink?: string;
}

export interface EcoTalentItem {
  id: string;
  name: string;
  avatar: string;
  type: '结业学员' | '认证专业技术人员' | '聘任讲师与导师';
  courseOrCert: string;
  certDate: string;
  currentStatus: string;
  company?: string;
}

export interface EcoActivityItem {
  id: string;
  title: string;
  type: '赛事' | '实训' | '沙龙' | '路演';
  month: string;
  date: string;
  participantsCount: number;
  graduatesCount?: number;
  outputCount: number;
  serviceCategory: '认知唤醒赛' | '工程师实训' | '社区运营' | '揭榜项目' | '产业对接';
  computeConsumed: number;
  location: string;
  organizer: string;
  summary: string;
  photos: string[];
  keyAchievements: string[];
}

export interface EcoReportItem {
  id: string;
  title: string;
  type: '季度报' | '年度报' | '自定义';
  period: string;
  createdTime: string;
  fileSizePdf: string;
  fileSizeWord: string;
  summary: string;
  includedSections: string[];
}

// 1. 月度趋势 12 个月数据
export const mock12MonthGrowthTrends = [
  { month: '2025-11', activeUsers: 5200, enterprises: 210 },
  { month: '2025-12', activeUsers: 5600, enterprises: 225 },
  { month: '2026-01', activeUsers: 6100, enterprises: 240 },
  { month: '2026-02', activeUsers: 6400, enterprises: 255 },
  { month: '2026-03', activeUsers: 6800, enterprises: 268 },
  { month: '2026-04', activeUsers: 7100, enterprises: 280 },
  { month: '2026-05', activeUsers: 7400, enterprises: 295 },
  { month: '2026-06', activeUsers: 7600, enterprises: 310 },
  { month: '2026-07', activeUsers: 7800, enterprises: 320 },
  { month: '2026-08', activeUsers: 8000, enterprises: 335 },
  { month: '2026-09', activeUsers: 8120, enterprises: 345 },
  { month: '2026-10', activeUsers: 8240, enterprises: 356 },
];

// 用量台账近6个月业务线堆叠数据
export const mock6MonthStackedCompute = [
  { month: '2026-05', competition: 800, training: 600, sandbox: 300, modelCall: 120, agentCall: 80, total: 1900 },
  { month: '2026-06', competition: 900, training: 650, sandbox: 350, modelCall: 130, agentCall: 90, total: 2120 },
  { month: '2026-07', competition: 750, training: 700, sandbox: 400, modelCall: 140, agentCall: 100, total: 2090 },
  { month: '2026-08', competition: 1100, training: 720, sandbox: 420, modelCall: 160, agentCall: 100, total: 2500 },
  { month: '2026-09', competition: 950, training: 750, sandbox: 450, modelCall: 170, agentCall: 110, total: 2430 },
  { month: '2026-10', competition: 1020, training: 780, sandbox: 480, modelCall: 180, agentCall: 120, total: 2580 },
];

// 案例来源分布环形图数据
export const mockCaseSourceDistribution = [
  { name: '赛事', count: 67, percentage: 52, color: '#2563EB' },
  { name: '实训', count: 38, percentage: 30, color: '#10B981' },
  { name: '实验场', count: 23, percentage: 18, color: '#8B5CF6' },
];

// 平台能力建设成效（5项）
export interface PlatformCapabilityItem {
  id: number;
  name: string;
  count: number;
  unit: string;
  source: string;
}

export const mockPlatformCapabilities: PlatformCapabilityItem[] = [
  { id: 1, name: 'Agent上架', count: 28, unit: '个', source: 'Agent表（已上架）' },
  { id: 2, name: '模型上架', count: 12, unit: '个', source: '模型表（已上架）' },
  { id: 3, name: '数据集上架', count: 45, unit: '个', source: '数据集表（已上架）' },
  { id: 4, name: '算力运营商', count: 3, unit: '家', source: '资源池表' },
  { id: 5, name: '覆盖产业链', count: 6, unit: '条', source: '案例标签统计' },
];

// 人才结构分布环形图数据
export const mockTalentStructureDistribution = [
  { name: '结业学员', count: 320, percentage: 61.5, color: '#F59E0B' },
  { name: '认证专业技术人员', count: 156, percentage: 30.0, color: '#06B6D4' },
  { name: '聘任讲师与导师', count: 44, percentage: 8.5, color: '#6366F1' },
];

// 南京主导产业生态地图区划数据
export interface NanjingDistrictItem {
  id: string;
  adcode?: number;
  name: string;
  badge: string;
  subTag: string;
  industry: string;
  totalCases: number;
  deployedCount: number;
  pilotCount: number;
  signedCount: number;
  representativeEnterprise: string;
  coordinates: { x: number; y: number }; // 百分比
}

export const mockNanjingDistricts: NanjingDistrictItem[] = [
  {
    id: 'jiangning',
    adcode: 320115,
    name: '江宁区',
    badge: '智能制造与新能源集群',
    subTag: '核心高新技术主导区',
    industry: '智能制造、新能源汽车',
    totalCases: 36,
    deployedCount: 18,
    pilotCount: 11,
    signedCount: 7,
    representativeEnterprise: '智远重工科技有限公司、绿能智控动力科技',
    coordinates: { x: 61, y: 52 }
  },
  {
    id: 'yuhuatai',
    adcode: 320114,
    name: '雨花台区',
    badge: '中国软件谷·AI算法核',
    subTag: '国家数字服务出口基地',
    industry: '电子信息、AI基础软件',
    totalCases: 25,
    deployedCount: 12,
    pilotCount: 8,
    signedCount: 5,
    representativeEnterprise: '精维微电子装备（南京）有限公司、云谷算法工场',
    coordinates: { x: 52, y: 50 }
  },
  {
    id: 'pukou',
    adcode: 320111,
    name: '浦口区',
    badge: '自主芯片与研创中枢',
    subTag: '江北科创核心承载区',
    industry: '集成电路、智能网联车',
    totalCases: 20,
    deployedCount: 8,
    pilotCount: 7,
    signedCount: 5,
    representativeEnterprise: '先研微纳芯片、浦口智驾感知创新中心',
    coordinates: { x: 44, y: 44 }
  },
  {
    id: 'qixia',
    adcode: 320113,
    name: '栖霞区',
    badge: '紫东科创大走廊',
    subTag: '智能装备产学研示范区',
    industry: '智能装备、光电技术',
    totalCases: 13,
    deployedCount: 5,
    pilotCount: 5,
    signedCount: 3,
    representativeEnterprise: '博远自动化产线系统、光芯视觉智能',
    coordinates: { x: 58, y: 41 }
  },
  {
    id: 'jianye',
    adcode: 320105,
    name: '建邺区',
    badge: '河西金融科技总部港',
    subTag: '数字经济总部聚集区',
    industry: '金融科技、跨境数商',
    totalCases: 12,
    deployedCount: 5,
    pilotCount: 4,
    signedCount: 3,
    representativeEnterprise: '深蓝智算科技、金陵数创金融',
    coordinates: { x: 51, y: 49 }
  },
  {
    id: 'liuhe',
    adcode: 320116,
    name: '六合区',
    badge: '绿色新材料与先进智造',
    subTag: '先进制造转型示范区',
    industry: '新材料、节能环保',
    totalCases: 6,
    deployedCount: 2,
    pilotCount: 2,
    signedCount: 2,
    representativeEnterprise: '棠城智造新材料、南京钛白智控',
    coordinates: { x: 61, y: 24 }
  },
  {
    id: 'xuanwu',
    adcode: 320102,
    name: '玄武区',
    badge: '红山垂类大模型产业集聚区',
    subTag: '大模型应用试验区',
    industry: '垂类大模型、数字文旅',
    totalCases: 5,
    deployedCount: 2,
    pilotCount: 2,
    signedCount: 1,
    representativeEnterprise: '红山大模型工场、文旅智游元宇宙文创',
    coordinates: { x: 58, y: 45 }
  },
  {
    id: 'qinhuai',
    adcode: 320104,
    name: '秦淮区',
    badge: '物联网与智慧文商中心',
    subTag: '物联网产业集聚区',
    industry: '物联网、智慧商业',
    totalCases: 4,
    deployedCount: 1,
    pilotCount: 2,
    signedCount: 1,
    representativeEnterprise: '白下物联网创新中心、夫子庙数智商圈',
    coordinates: { x: 58, y: 47 }
  },
  {
    id: 'gulou',
    adcode: 320106,
    name: '鼓楼区',
    badge: '环五台山数字医疗与智库',
    subTag: '数智健康创新核',
    industry: '生命健康、数字贸易',
    totalCases: 4,
    deployedCount: 1,
    pilotCount: 1,
    signedCount: 2,
    representativeEnterprise: '鼓楼智医云影、长江航运数智中心',
    coordinates: { x: 53, y: 43 }
  },
  {
    id: 'lishui',
    adcode: 320117,
    name: '溧水区',
    badge: '新能源车零部件与临空枢纽',
    subTag: '临空智造产业港',
    industry: '新能源汽车、临空物流',
    totalCases: 2,
    deployedCount: 1,
    pilotCount: 0,
    signedCount: 1,
    representativeEnterprise: '溧水智能车载电源、空港数智冷链',
    coordinates: { x: 75, y: 74 }
  },
  {
    id: 'gaochun',
    adcode: 320118,
    name: '高淳区',
    badge: '医疗器械产业港',
    subTag: '高端智造与绿色生态示范',
    industry: '医疗器械、绿色智造',
    totalCases: 1,
    deployedCount: 1,
    pilotCount: 0,
    signedCount: 0,
    representativeEnterprise: '淳医智械科技、高淳生态传感器',
    coordinates: { x: 63, y: 99 }
  }
];

// 各主导产业链案例落地状态分布数据
export const mockIndustryCaseStatusBreakdown = [
  {
    industry: '智能制造',
    total: 42,
    deployed: 18, // 已落地转化
    pilot: 14,    // 试点验证中
    signed: 10,   // 已签约合作
    deployedRate: '42.9%'
  },
  {
    industry: '电子信息',
    total: 35,
    deployed: 15, // 已落地转化
    pilot: 12,    // 试点验证中
    signed: 8,    // 已签约合作
    deployedRate: '42.9%'
  },
  {
    industry: '生物医药',
    total: 24,
    deployed: 10, // 已落地转化
    pilot: 8,     // 试点验证中
    signed: 6,    // 已签约合作
    deployedRate: '41.7%'
  },
  {
    industry: '其他产业',
    total: 27,
    deployed: 13, // 已落地转化 (含新能源、文旅、城市治理等)
    pilot: 8,     // 试点验证中
    signed: 6,    // 已签约合作
    deployedRate: '48.1%'
  }
];

export const mockEcoMonthlyTrends = [
  { month: '2025-11', users: 5100, activeUsers: 3400, enterprises: 180, cases: 42, computeHours: 680, tokens: 0.9 },
  { month: '2025-12', users: 5800, activeUsers: 3900, enterprises: 210, cases: 50, computeHours: 750, tokens: 1.1 },
  { month: '2026-01', users: 6500, activeUsers: 4200, enterprises: 235, cases: 61, computeHours: 890, tokens: 1.3 },
  { month: '2026-02', users: 7100, activeUsers: 4800, enterprises: 250, cases: 70, computeHours: 920, tokens: 1.4 },
  { month: '2026-03', users: 8000, activeUsers: 5400, enterprises: 272, cases: 82, computeHours: 1100, tokens: 1.6 },
  { month: '2026-04', users: 8900, activeUsers: 6000, enterprises: 290, cases: 90, computeHours: 1050, tokens: 1.7 },
  { month: '2026-05', users: 9600, activeUsers: 6500, enterprises: 305, cases: 98, computeHours: 1150, tokens: 1.8 },
  { month: '2026-06', users: 10400, activeUsers: 7100, enterprises: 320, cases: 106, computeHours: 1210, tokens: 1.9 },
  { month: '2026-07', users: 11100, activeUsers: 7500, enterprises: 332, cases: 114, computeHours: 1180, tokens: 2.0 },
  { month: '2026-08', users: 11800, activeUsers: 7800, enterprises: 345, cases: 120, computeHours: 1240, tokens: 2.1 },
  { month: '2026-09', users: 12200, activeUsers: 8050, enterprises: 350, cases: 124, computeHours: 1260, tokens: 2.2 },
  { month: '2026-10', users: 12580, activeUsers: 8240, enterprises: 356, cases: 128, computeHours: 1280, tokens: 2.3 }
];

// 2. 用量台账按业务线拆解
export const mockComputeUsageByBusinessLine = [
  { name: '赛事', key: 'competition', hours: 4200, percentage: 33.4, tokens: '0.78亿', color: '#2563EB' },
  { name: '实训', key: 'training', hours: 3800, percentage: 30.2, tokens: '0.72亿', color: '#10B981' },
  { name: '实验场', key: 'sandbox', hours: 2680, percentage: 21.3, tokens: '0.45亿', color: '#8B5CF6' },
  { name: '模型调用', key: 'modelCall', hours: 1100, percentage: 8.7, tokens: '0.23亿', color: '#06B6D4' },
  { name: 'Agent调用', key: 'agentCall', hours: 800, percentage: 6.4, tokens: '0.12亿', color: '#F59E0B' }
];

// 3. 活跃用户下钻数据 (8,240 抽取代表性明细)
export const mockActiveUsers: EcoUserItem[] = [
  { id: 'usr_1001', nickname: '极客小千', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', role: 'AI 架构师', businessLine: '赛事', registerTime: '2025-03-12', lastActiveTime: '2026-10-09 21:15', computeConsumed: 185 },
  { id: 'usr_1002', nickname: '算法先锋老张', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', role: '资深开发者', businessLine: '实训', registerTime: '2025-05-18', lastActiveTime: '2026-10-09 19:40', computeConsumed: 240 },
  { id: 'usr_1003', nickname: '清华AI工程队', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', role: '高校研究团队', businessLine: '赛事', registerTime: '2025-08-01', lastActiveTime: '2026-10-09 18:22', computeConsumed: 320 },
  { id: 'usr_1004', nickname: '深蓝智算', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', role: '企业研发工程师', businessLine: '实验场', registerTime: '2025-11-10', lastActiveTime: '2026-10-09 17:05', computeConsumed: 195 },
  { id: 'usr_1005', nickname: '智能科技-刘工', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', role: '算法负责人', businessLine: '模型调用', registerTime: '2026-01-15', lastActiveTime: '2026-10-09 15:30', computeConsumed: 140 },
  { id: 'usr_1006', nickname: '创智数字-王总', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', role: 'CTO', businessLine: 'Agent调用', registerTime: '2026-02-20', lastActiveTime: '2026-10-09 12:10', computeConsumed: 280 },
  { id: 'usr_1007', nickname: '代码行者小李', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', role: '全栈工程师', businessLine: '实训', registerTime: '2026-03-05', lastActiveTime: '2026-10-08 22:18', computeConsumed: 95 },
  { id: 'usr_1008', nickname: '视觉神经元', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', role: 'CV算法专家', businessLine: '赛事', registerTime: '2026-04-12', lastActiveTime: '2026-10-08 20:05', computeConsumed: 210 }
];

// 4. 已认证企业下钻数据 (356 代表性明细)
export const mockCertifiedEnterprises: EcoEnterpriseItem[] = [
  { id: 'ent_2001', name: '智远重工科技有限公司', industry: '智能制造', certifiedTime: '2025-04-10', tasksPublishedCount: 12, trainingsSponsoredCount: 3, computeConsumed: 1250, status: '专精特新' },
  { id: 'ent_2002', name: '精维微电子装备（苏州）有限公司', industry: '电子信息', certifiedTime: '2025-06-18', tasksPublishedCount: 8, trainingsSponsoredCount: 2, computeConsumed: 980, status: '高新技术企业' },
  { id: 'ent_2003', name: '康泰源生物医药研究院', industry: '生物医药', certifiedTime: '2025-09-05', tasksPublishedCount: 6, trainingsSponsoredCount: 1, computeConsumed: 1420, status: '高新技术企业' },
  { id: 'ent_2004', name: '绿能智控动力科技股份公司', industry: '新能源', certifiedTime: '2025-11-22', tasksPublishedCount: 9, trainingsSponsoredCount: 4, computeConsumed: 860, status: '专精特新' },
  { id: 'ent_2005', name: '文旅智游元宇宙文创集团', industry: '文旅', certifiedTime: '2026-01-14', tasksPublishedCount: 5, trainingsSponsoredCount: 2, computeConsumed: 640, status: '已认证' },
  { id: 'ent_2006', name: '城市智慧大脑物联网技术有限公司', industry: '城市治理', certifiedTime: '2026-03-08', tasksPublishedCount: 15, trainingsSponsoredCount: 5, computeConsumed: 1890, status: '专精特新' },
  { id: 'ent_2007', name: '博远自动化产线系统有限公司', industry: '智能制造', certifiedTime: '2026-05-20', tasksPublishedCount: 7, trainingsSponsoredCount: 1, computeConsumed: 720, status: '高新技术企业' }
];

// 5. 产业生态成果案例 (128 代表性明细)
export const mockEcosystemCases: EcoCaseItem[] = [
  {
    id: 'case_3001',
    title: '工业大型旋转设备振动异常与故障实时预测 AI 模型',
    enterpriseName: '智远重工科技有限公司',
    industry: '智能制造',
    problemSolved: '解决大型风机与高压泵齿轮磨损无预警停机难题，预测准确率达到 96.2%',
    solutionDetail: '基于 Spark-Streaming 与 CNN-LSTM 多传感器时序数据融合，建立 100Hz 采样振动频谱诊断 Agent，部署于端侧算力节点。',
    source: '场景赛',
    status: '已落地转化',
    computeConsumed: 120,
    tokensConsumed: '450万',
    teamMembers: ['智远AI实验室', '极客小千 (你)', '清华AI工程队'],
    deploymentLocation: '智远重工江宁第一智能化车间 (42 台机组线)',
    economicValue: '降低非计划停机时间 75%，年节约维护成本 ¥320 万元',
    relatedLink: '/tasks/tsk_101'
  },
  {
    id: 'case_3002',
    title: '半导体晶圆表面微米级缺陷光学检测 (AOI) YOLOv10 微调模型',
    enterpriseName: '精维微电子装备（南京）有限公司',
    industry: '电子信息',
    problemSolved: '取代人工显微镜目测，检测速度提升 800%，划痕与漏印漏检率降至 0.01%',
    solutionDetail: '定制 YOLOv10-X 结合 TensorRT-LLM 图像增强引擎，毫秒级甄别晶圆 12 种微观瑕疵。',
    source: '实训',
    status: '试点验证中',
    computeConsumed: 80,
    tokensConsumed: '280万',
    teamMembers: ['精维质检组', '算法先锋老张'],
    deploymentLocation: '精维微电子雨花软谷试产线 A/B 验证区',
    economicValue: '良品率提高 2.8 百分点，年增加产值约 ¥580 万元',
    relatedLink: '/trainings/tr_01'
  },
  {
    id: 'case_3003',
    title: '多靶点小分子药物溶解度与毒性虚拟筛选 AlphaFold 衍生 Agent',
    enterpriseName: '康泰源生物医药研究院',
    industry: '生物医药',
    problemSolved: '将先导化合物 ADMET 属性预测从 3 个月缩短至 48 小时，极大降低研发风险',
    solutionDetail: '利用 3D 分子图神经网络 (GNN) 与 LLM 结合，构建自动化构效关系分析工作流。',
    source: '实验场',
    status: '已签约合作',
    computeConsumed: 200,
    tokensConsumed: '1200万',
    teamMembers: ['康泰源AI新药组', '深蓝智算'],
    deploymentLocation: '江北新区新药创制算力中心服务器',
    economicValue: '首期签约合作金额 ¥150 万元，节省湿实验费用 ¥400 万元',
    relatedLink: '/sandbox/sb_02'
  },
  {
    id: 'case_3004',
    title: '锂电池极片涂布厚度闭环控制与 AI 补偿调控算法',
    enterpriseName: '绿能智控动力科技股份公司',
    industry: '新能源',
    problemSolved: '涂布过厚或边缘张力不均导致电池短路隐患，AI 实现微米级自动螺杆矫正',
    solutionDetail: '基于强化学习 (PPO) 多变量反馈控制，实时调节机头挤压压力与烘干风速。',
    source: '任务',
    status: '已落地转化',
    computeConsumed: 110,
    tokensConsumed: '310万',
    teamMembers: ['绿能电池工程部', '极客小千 (你)'],
    deploymentLocation: '绿能智控江宁超级工厂 3 号线',
    economicValue: '原料利用率提升 1.5%，涂布废品率降低 60%',
    relatedLink: '/tasks/tsk_my_pub_ing_fcfs'
  },
  {
    id: 'case_3005',
    title: '景区数字人 NPC 多语言实时沉浸式交互导览大模型',
    enterpriseName: '文旅智游元宇宙文创集团',
    industry: '文旅',
    problemSolved: '古迹历史知识库准确讲解与英/日/法/阿 8 种语言超低延迟 3D 形象同步推流',
    solutionDetail: '结合 Qwen2.5 72B 与 LivePortrait 实时推流 SDK，多模态实时响应速度 ≤ 500ms。',
    source: '场景赛',
    status: '已落地转化',
    computeConsumed: 95,
    tokensConsumed: '680万',
    teamMembers: ['文旅智游元宇宙团队', '视觉神经元'],
    deploymentLocation: '夫子庙秦淮风光带数字体验馆',
    economicValue: '累计服务游客 18 万人次，带动文创衍生品增收 ¥220 万元',
    relatedLink: '/competitions/comp_01'
  },
  {
    id: 'case_3006',
    title: '城市高密度交通交叉口信号灯强化学习自适应调度 Agent',
    enterpriseName: '城市智慧大脑物联网技术有限公司',
    industry: '城市治理',
    problemSolved: '晚高峰主干道拥堵指数过高，传统定时红绿灯无法实时应对车流突变',
    solutionDetail: '高空摄像头车流量计算与流式 Actor-Critic 模型联动，按秒级调整绿信比。',
    source: '任务',
    status: '试点验证中',
    computeConsumed: 150,
    tokensConsumed: '520万',
    teamMembers: ['城市大脑交通组', '代码行者小李'],
    deploymentLocation: '南京雨花软件谷 12 个核心十字路口',
    economicValue: '通行效率提升 22%，晚高峰排队长度缩短 35%'
  }
];

// 6. 人才下钻数据 (520 代表性明细)
export const mockTalentsList: EcoTalentItem[] = [
  { id: 'tal_4001', name: '张伟', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', type: '结业学员', courseOrCert: '企业级 Agent 开发与 LangGraph 实战 (第1期)', certDate: '2026-03-25', currentStatus: '已入职智远重工 AI 部门', company: '智远重工科技有限公司' },
  { id: 'tal_4002', name: '李梅', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', type: '认证专业技术人员', courseOrCert: '平台认证高级 AI 架构师 (L4级)', certDate: '2026-05-12', currentStatus: '独立接单开发者', company: '自由极客团队' },
  { id: 'tal_4003', name: '陈建国', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', type: '聘任讲师与导师', courseOrCert: '平台受聘产业导师 / 工业视觉方向', certDate: '2025-10-01', currentStatus: '教授 / 博士生导师', company: '省智能制造研究院' },
  { id: 'tal_4004', name: '王芳', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', type: '结业学员', courseOrCert: '大模型微调与 RAG 向量检索工程师 (第2期)', certDate: '2026-09-28', currentStatus: '已入职精维微电子', company: '精维微电子装备有限公司' },
  { id: 'tal_4005', name: '赵强', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', type: '认证专业技术人员', courseOrCert: '平台认证大模型部署专家 (L3级)', certDate: '2026-07-15', currentStatus: '在职提升', company: '绿能智控动力科技' }
];

// 7. 年度活动汇总数据 (1月 - 10月 时间轴)
export const mockEcoActivities: EcoActivityItem[] = [
  {
    id: 'act_2026_01',
    title: '2026 AI 创新挑战赛（认知唤醒赛）',
    type: '赛事',
    month: '1月',
    date: '2026-01-15 ~ 2026-01-20',
    participantsCount: 320,
    outputCount: 45,
    serviceCategory: '认知唤醒赛',
    computeConsumed: 2800,
    location: '人工智能产业园学术报告厅 & 在线云端',
    organizer: '市科技局 & 平台运营中心',
    summary: '聚焦企业大模型初体验，通过“低门槛、重应用”的算法竞赛激发全域创新热潮。',
    photos: [
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=600&auto=format&fit=crop&q=80'
    ],
    keyAchievements: [
      '吸引 320 名极客与 45 支企业代表队报名参赛',
      '产生 45 项具有工业实用价值的 Agent 构想与原型',
      '直接选拔 12 名优秀学员进入首期工程师实训营'
    ]
  },
  {
    id: 'act_2026_03',
    title: '工程师实训（第 1 期：企业级 Agent 架构实战）',
    type: '实训',
    month: '3月',
    date: '2026-03-01 ~ 2026-03-25',
    participantsCount: 120,
    graduatesCount: 98,
    outputCount: 38,
    serviceCategory: '工程师实训',
    computeConsumed: 3200,
    location: '智能计算实验中心 3 楼机房',
    organizer: '平台实训基地 & 知名高校联合指导',
    summary: '针对本地传统制造与电子企业中青年研发骨干，开展为期 25 天的脱产强化闭门实训。',
    photos: [
      'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=600&auto=format&fit=crop&q=80'
    ],
    keyAchievements: [
      '98 名学员考核合格并获颁平台高级认证证书',
      '结业产出 38 项可直接上架到平台的工业级 Agent 插件',
      '8 家委托企业现场签署学员吸纳协议'
    ]
  },
  {
    id: 'act_2026_06',
    title: '大模型前沿技术沙龙与开发者极客夜',
    type: '沙龙',
    month: '6月',
    date: '2026-06-18',
    participantsCount: 85,
    outputCount: 12,
    serviceCategory: '社区运营',
    computeConsumed: 800,
    location: '创智咖啡馆 & 社区直播间',
    organizer: 'AI 社区运营组',
    summary: '分享开源 Qwen2.5/DeepSeek 微调调优经验、Prompt 提示词工程与向量数据库加速技巧。',
    photos: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80'
    ],
    keyAchievements: [
      '发布 12 篇深度技术干货与开源教程',
      '新增社区活跃沉淀帖 150+ 篇，互动量打破季度记录'
    ]
  },
  {
    id: 'act_2026_08',
    title: 'AI 创业项目揭榜挂帅与投融资路演专场',
    type: '路演',
    month: '8月',
    date: '2026-08-10',
    participantsCount: 150,
    outputCount: 8,
    serviceCategory: '揭榜项目',
    computeConsumed: 1200,
    location: '金融大厦 2 楼多功能演播厅',
    organizer: '市发改委 & 产业基金联盟',
    summary: '连接 8 家场景企业与 20 余家知名 VC 机构，现场展示通过平台孵化的 AI 生态硬核案例。',
    photos: [
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=600&auto=format&fit=crop&q=80'
    ],
    keyAchievements: [
      '8 个重点孵化项目现场签订合作意向书',
      '意向融资额与场景采购预算累计超 ¥2800 万元'
    ]
  },
  {
    id: 'act_2026_09',
    title: '工程师实训（第 2 期：大模型微调与 RAG 落地）',
    type: '实训',
    month: '9月',
    date: '2026-09-01 ~ 2026-09-28',
    participantsCount: 180,
    graduatesCount: 156,
    outputCount: 42,
    serviceCategory: '工程师实训',
    computeConsumed: 2980,
    location: '智能计算实验中心 5 楼机房',
    organizer: '平台实训基地',
    summary: '深度聚焦领域大模型 LorA / QLoRA 训练、Milvus 向量知识库搭建与接口网关部署。',
    photos: [
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'
    ],
    keyAchievements: [
      '156 名学员顺利结业',
      '产出 42 项企业级高复用 RAG 知识库套件'
    ]
  },
  {
    id: 'act_2026_10',
    title: '2026 产业智能场景挑战赛总决赛',
    type: '赛事',
    month: '10月',
    date: '2026-10-08',
    participantsCount: 420,
    outputCount: 67,
    serviceCategory: '认知唤醒赛',
    computeConsumed: 1600,
    location: '国际会展中心 1 号馆大剧院',
    organizer: '市人民政府指导 / 平台联合承办',
    summary: '年度最高规格产业 AI 大赛，面向智能制造、生物医药、电子信息三大主导产业揭榜挂帅。',
    photos: [
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511578314322-379afb476865?w=600&auto=format&fit=crop&q=80'
    ],
    keyAchievements: [
      '选拔出一二三等奖 15 项，奖金池达 ¥120 万元',
      '67 项有效算法与作品全量打通转化入库'
    ]
  }
];

// 8. 历史报告列表
export const mockEcoReports: EcoReportItem[] = [
  {
    id: 'rep_2026_q3',
    title: '2026年第三季度人工智能平台运营与生态建设总结报告',
    type: '季度报',
    period: '2026-07-01 至 2026-09-30',
    createdTime: '2026-10-01 09:30',
    fileSizePdf: '4.8 MB',
    fileSizeWord: '2.1 MB',
    summary: '涵盖三季度四本账指标增长、典型工业场景案例落地、算力托管消耗账单及口径说明附注。',
    includedSections: [
      '四本账图表 (用户/企业/案例/人才)',
      '典型案例摘编 (智能制造/生物医药/电子信息)',
      '年度活动汇总 (赛事/实训/沙龙)',
      '算力使用台账 (卡时与Token按业务线堆叠)',
      '口径说明附注 (含“三不承诺”边界声明)'
    ]
  },
  {
    id: 'rep_2026_q2',
    title: '2026年第二季度人工智能平台运营与成果孵化报告',
    type: '季度报',
    period: '2026-04-01 至 2026-06-30',
    createdTime: '2026-07-01 10:15',
    fileSizePdf: '4.2 MB',
    fileSizeWord: '1.9 MB',
    summary: '汇总二季度工程师实训结业成果、招商引智企业认证率与 GPU 算力卡时核销账单。',
    includedSections: [
      '四本账图表',
      '典型案例摘编',
      '年度活动汇总',
      '算力使用台账',
      '口径说明附注'
    ]
  },
  {
    id: 'rep_2025_annual',
    title: '2025年度人工智能生态建设与公共服务平台总结报告',
    type: '年度报',
    period: '2025-01-01 至 2025-12-31',
    createdTime: '2025-12-31 18:00',
    fileSizePdf: '8.6 MB',
    fileSizeWord: '3.5 MB',
    summary: '全面呈报 2025 全年财政补贴效益、算力池消纳明细、本地产业链赋能实效与合规声明。',
    includedSections: [
      '四本账图表',
      '典型案例摘编',
      '年度活动汇总',
      '算力使用台账',
      '口径说明附注'
    ]
  }
];
