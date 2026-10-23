// AI生态看板 0.2版本 考核口径专用数据源
// 严格对齐 0.2 详细设计规范

export interface EcoV2ScaledEnterprise {
  id: string;
  name: string;
  status: '已入统' | '培育中';
  category: '行业应用' | '高校合作' | 'OPC创业' | '初创团队' | '龙头研究院';
  district: string;
  joinDate: string;
  revenue: string;
  targetScaleDate: string;
  computeHours: number;
  highlight: string;
}

export interface EcoV2CostSavingCase {
  id: string;
  title: string;
  enterpriseName: string;
  industry: string;
  district: string;
  problemSolved: string;
  solution: string;
  savingValue: string;
  computeHours: number;
  status: '已落地转化' | '试点验证中' | '已签约合作';
}

export interface EcoV2MediaReport {
  id: string;
  title: string;
  mediaName: string;
  publishTime: string;
  category: '央媒报道' | '省市主流' | '科技创投';
  summary: string;
  linkText: string;
}

export interface EcoV2TimelineActivity {
  id: string;
  month: string;
  name: string;
  type: '认知唤醒赛' | '工程师实训' | '社区运营' | '揭榜项目' | '场景匹配赛';
  participants: number;
  outputCount: number;
  computeHours: number;
  serviceItem: string;
  district: string;
  date: string;
  description: string;
}

// 页面一：算力消纳月度柱状图 (3月-10月，截至10月16日计量值)
export const mockV2MonthlyCompute = [
  { month: '3月', compute: 2800, label: '2,800' },
  { month: '4月', compute: 3600, label: '3,600' },
  { month: '5月', compute: 4100, label: '4,100' },
  { month: '6月', compute: 4700, label: '4,700' },
  { month: '7月', compute: 5200, label: '5,200' },
  { month: '8月', compute: 5600, label: '5,600' },
  { month: '9月', compute: 6000, label: '6,000' },
  { month: '10月', compute: 4800, label: '4,800 (截至10.16)', isCurrent: true },
];

// 页面一：入驻率月度折线 (1月42% -> 10月58%)
export const mockV2OccupancyTrend = [
  { month: '1月', rate: 42 },
  { month: '2月', rate: 43 },
  { month: '3月', rate: 45 },
  { month: '4月', rate: 47 },
  { month: '5月', rate: 49 },
  { month: '6月', rate: 51 },
  { month: '7月', rate: 53 },
  { month: '8月', rate: 54 },
  { month: '9月', rate: 56 },
  { month: '10月', rate: 58 },
];

// 入驻辖区企业类型 (58家，五色高饱和)
export const mockV2EnterpriseTypes = [
  { type: '行业应用企业', count: 28, pct: 48, color: '#2563EB', desc: '深度整合行业垂类模型与生产系统' },
  { type: '高校联合实验室', count: 6, pct: 10, color: '#10B981', desc: '南大、东南等产学研成果转化基地' },
  { type: 'OPC创业', count: 12, pct: 21, color: '#F59E0B', desc: '一人公司与高人效AI超级个体工坊' },
  { type: '孵化初创团队', count: 9, pct: 16, color: '#8B5CF6', desc: '园区苗圃孵化及赛事获奖注册团队' },
  { type: '龙头企业AI研究院', count: 3, pct: 5, color: '#D4A843', desc: '大型央国企与上市公司AI创新中心' },
];

// 规上企业培育清单 (1家入统 / 4家培育中)
export const mockV2ScaledEnterprises: EcoV2ScaledEnterprise[] = [
  {
    id: 'scale-01',
    name: '南京智造精工自动化有限公司',
    status: '已入统',
    category: '行业应用',
    district: '江宁区',
    joinDate: '2026-03-15',
    revenue: '2,480 万元',
    targetScaleDate: '2026-08 (已升规)',
    computeHours: 4200,
    highlight: '通过平台工业视觉质检模型替代人工目检，年降本320万元，Q3产值突破入统门槛'
  },
  {
    id: 'scale-02',
    name: '南微光电传感技术有限公司',
    status: '培育中',
    category: '行业应用',
    district: '雨花台区',
    joinDate: '2026-04-10',
    revenue: '1,860 万元',
    targetScaleDate: '预计 2026-11 入统',
    computeHours: 3100,
    highlight: '已对接工信局升规辅导团队，Q4订单饱满，预估年度产值达2,150万元'
  },
  {
    id: 'scale-03',
    name: '极电动力科技有限公司',
    status: '培育中',
    category: '行业应用',
    district: '江北新区',
    joinDate: '2026-05-18',
    revenue: '1,720 万元',
    targetScaleDate: '预计 2026-12 入统',
    computeHours: 2950,
    highlight: '新能源储能BMS大模型算法已完成实车验证，Q4扩产交付'
  },
  {
    id: 'scale-04',
    name: '金陵绿色材料智造有限公司',
    status: '培育中',
    category: '初创团队',
    district: '六合区',
    joinDate: '2026-06-01',
    revenue: '1,450 万元',
    targetScaleDate: '预计 2027-03 入统',
    computeHours: 2200,
    highlight: '赛事一等奖落地注册企业，环保新材料配方仿真模型已投入生产'
  },
  {
    id: 'scale-05',
    name: '芯灵半导体智能系统研发中心',
    status: '培育中',
    category: '龙头研究院',
    district: '栖霞区',
    joinDate: '2026-06-20',
    revenue: '1,580 万元',
    targetScaleDate: '预计 2027-05 入统',
    computeHours: 3600,
    highlight: '芯片设计EDA微调模型长周期占网运行，团队规模已达60人'
  }
];

// 辖区入驻企业名录 (11家核心运营企业)
export const mockV2SettledEnterprises = [
  {
    id: 'ent-01',
    name: '南京智造精工自动化有限公司',
    type: '行业应用',
    joinDate: '2026-03-15',
    status: '已入统',
    district: '江宁区',
    rentArea: '1,200 ㎡',
    staffCount: 48,
    desc: '高端装备制造与工业视觉检测系统服务商'
  },
  {
    id: 'ent-02',
    name: '南微光电传感技术有限公司',
    type: '行业应用',
    joinDate: '2026-04-10',
    status: '辅导中',
    district: '雨花台区',
    rentArea: '980 ㎡',
    staffCount: 36,
    desc: '微纳光学传感器及多模态融合感知解决方案'
  },
  {
    id: 'ent-03',
    name: '极电动力科技有限公司',
    type: '行业应用',
    joinDate: '2026-05-18',
    status: '辅导中',
    district: '江北新区',
    rentArea: '1,100 ㎡',
    staffCount: 42,
    desc: '新能源智能动力域控制器及AI能量管理'
  },
  {
    id: 'ent-04',
    name: '金陵绿色材料智造有限公司',
    type: '初创团队',
    joinDate: '2026-06-01',
    status: '正常运营',
    district: '六合区',
    rentArea: '650 ㎡',
    staffCount: 22,
    desc: '低碳高分子材料AI配方反向推理与中试转化'
  },
  {
    id: 'ent-05',
    name: '芯灵半导体智能系统研发中心',
    type: '龙头研究院',
    joinDate: '2026-06-20',
    status: '正常运营',
    district: '栖霞区',
    rentArea: '1,500 ㎡',
    staffCount: 65,
    desc: '面向第三代半导体先进制程的AI仿真优化中心'
  },
  {
    id: 'ent-06',
    name: '南大智能仿生联合实验室',
    type: '高校合作',
    joinDate: '2026-03-28',
    status: '正常运营',
    district: '鼓楼区',
    rentArea: '800 ㎡',
    staffCount: 30,
    desc: '具身智能大模型算法与机器人灵巧操作研究'
  },
  {
    id: 'ent-07',
    name: '金陵文旅元宇宙数创工坊',
    type: 'OPC创业',
    joinDate: '2026-07-05',
    status: '正常运营',
    district: '秦淮区',
    rentArea: '420 ㎡',
    staffCount: 12,
    desc: '数字人景区讲解与非遗文创AIGC交互体验'
  },
  {
    id: 'ent-08',
    name: '博奥智慧基因诊断工作室',
    type: '初创团队',
    joinDate: '2026-08-12',
    status: '正常运营',
    district: '玄武区',
    rentArea: '560 ㎡',
    staffCount: 18,
    desc: '基因突变位点大模型筛选与辅助靶点发现'
  },
  {
    id: 'ent-09',
    name: '汇农精智农业AI实验室',
    type: '高校合作',
    joinDate: '2026-08-25',
    status: '正常运营',
    district: '高淳区',
    rentArea: '480 ㎡',
    staffCount: 15,
    desc: '果蔬病虫害高光谱视觉识别与无人机智能飞防'
  },
  {
    id: 'ent-10',
    name: '智选云流OPC工作室',
    type: 'OPC创业',
    joinDate: '2026-09-02',
    status: '正常运营',
    district: '建邺区',
    rentArea: '360 ㎡',
    staffCount: 8,
    desc: '跨境电商AIGC营销脚本与多语言智能客服'
  },
  {
    id: 'ent-11',
    name: '深蓝质检智能科技工坊',
    type: '初创团队',
    joinDate: '2026-09-18',
    status: '正常运营',
    district: '溧水区',
    rentArea: '600 ㎡',
    staffCount: 20,
    desc: '汽车零部件精密冲压边缘AI缺陷检测终端'
  }
];

// 降本增效案例（24个典型代表列表）
export const mockV2CostSavingCases: EcoV2CostSavingCase[] = [
  {
    id: 'case-01',
    title: '汽车精密压铸件AI微米级缺陷实时检测系统',
    enterpriseName: '南京智造精工自动化有限公司',
    industry: '智能制造',
    district: '江宁区',
    problemSolved: '传统人工显微检测疲劳度高、漏检率达3.8%，制约产线节拍',
    solution: '部署边缘YOLOv10微调检测模型，在压铸出模后0.2秒内完成微米级气孔与裂纹检定',
    savingValue: '年化降本 320 万元',
    computeHours: 1850,
    status: '已落地转化'
  },
  {
    id: 'case-02',
    title: '晶圆芯片封装光刻参数多变量智能调优',
    enterpriseName: '芯灵半导体智能系统研发中心',
    industry: '电子信息',
    district: '栖霞区',
    problemSolved: '晶圆厚度公差与光刻温度漂移导致批次成品率波动约5%',
    solution: '建立工艺过程深度强化学习代理模型，实时自动补偿曝光能量与步进机焦点',
    savingValue: '年化挽回废品损失 450 万元',
    computeHours: 2400,
    status: '已落地转化'
  },
  {
    id: 'case-03',
    title: '抗癌小分子化合物靶点亲和力虚拟筛选',
    enterpriseName: '博奥智慧基因诊断工作室',
    industry: '生物医药',
    district: '玄武区',
    problemSolved: '湿实验化学合成周期长达6个月，单分子初筛成本超5万元',
    solution: '利用平台分子大模型进行50万种先导化合物虚拟结合构象打分，周期缩短至3天',
    savingValue: '研发前期试剂降本 210 万元',
    computeHours: 1980,
    status: '已落地转化'
  },
  {
    id: 'case-04',
    title: '储能电池BMS微短路早期热失控预警',
    enterpriseName: '极电动力科技有限公司',
    industry: '新能源',
    district: '江北新区',
    problemSolved: '电池析锂与内阻微变早期难测量，易导致电芯热失控安全隐患',
    solution: '构建长周期电芯电压时序异常检测神经网络，提前48小时精确定位隐患单体',
    savingValue: '避免整包召回潜在损失 580 万元',
    computeHours: 1650,
    status: '已落地转化'
  },
  {
    id: 'case-05',
    title: '非遗传统手工艺图谱AIGC文创快速打样',
    enterpriseName: '金陵文旅元宇宙数创工坊',
    industry: '文旅',
    district: '秦淮区',
    problemSolved: '文创手绘线稿产出周期需2周，难以跟上文旅快速迭代需求',
    solution: '训练金陵云锦与南京剪纸LoRA垂类模型，10分钟生成多版可量产矢量渲染图',
    savingValue: '文创设计打样降本 85 万元',
    computeHours: 620,
    status: '已落地转化'
  },
  {
    id: 'case-06',
    title: '果蔬大棚高光谱病虫害早期无人机飞防定位',
    enterpriseName: '汇农精智农业AI实验室',
    industry: '现代农业',
    district: '高淳区',
    problemSolved: '人工巡棚无法察觉早期真菌感染，全田大面积喷药造成严重农药残留超标',
    solution: '多光谱影像病灶语义分割模型引导变量无人机精准点喷，农药使用量降低65%',
    savingValue: '每千亩节约农资与人工 42 万元',
    computeHours: 580,
    status: '已落地转化'
  }
];

// 媒体报道 (23条精选)
export const mockV2MediaReports: EcoV2MediaReport[] = [
  {
    id: 'rep-01',
    title: '南京算力生态筑巢引凤：首个运营年度以赛引才、以用促产成效显著',
    mediaName: '新华日报',
    publishTime: '2026-10-11',
    category: '省市主流',
    summary: '南京AI产业平台正式签约运营以来，通过公共算力消纳与场景匹配，已吸引58家创新实体集聚，成功培育首批规上企业入统。',
    linkText: '查看报道全文'
  },
  {
    id: 'rep-02',
    title: '从“算力卡时”到“产业产值”：南京探索公共算力资产化运营新范式',
    mediaName: '南京日报 · 科技版',
    publishTime: '2026-09-28',
    category: '省市主流',
    summary: '用量增长带动资源池结算、招商盘活物业、企业升规带来税源，三条清晰资产回报路径展现出算力基础设施强大的造血能力。',
    linkText: '查看报道全文'
  },
  {
    id: 'rep-03',
    title: '全国百支顶尖创客队伍会师金陵：南京AI创新挑战赛优秀成果落地注册率达30%',
    mediaName: '科技日报',
    publishTime: '2026-09-15',
    category: '央媒报道',
    summary: '3家获奖团队当场签约落地江宁与江北园区，实现“赛事造峰值、落地固成果”的良性循环。',
    linkText: '查看报道全文'
  },
  {
    id: 'rep-04',
    title: '聚焦工业质检与大模型微调：南京AI工程师实训结业学员平均薪资涨幅超25%',
    mediaName: '江苏电视台 · 科技之光',
    publishTime: '2026-08-30',
    category: '省市主流',
    summary: '首期与第二期实训118人顺利结业、96人获高级工程师认证，切实缓解本地制造企业AI人才缺口。',
    linkText: '查看视频报道'
  },
  {
    id: 'rep-05',
    title: 'OPC一人公司在南京爆发：AI生态平台如何以极低成本孵化超级个体',
    mediaName: '36氪',
    publishTime: '2026-08-14',
    category: '科技创投',
    summary: '12家OPC工作室扎根南京秦淮与建邺，单人平均调度几十个专业Agent协同完成文创、跨境营销等高价值业务。',
    linkText: '查看特写报道'
  }
];

// 年度活动时间轴数据 (1月~11月，共11个每月1个)
export const mockV2TimelineActivities: EcoV2TimelineActivity[] = [
  {
    id: 'act-01',
    month: '1月',
    name: 'AI创新挑战赛',
    type: '认知唤醒赛',
    participants: 320,
    outputCount: 45,
    computeHours: 2800,
    serviceItem: '场景挖掘与认知激发',
    district: '江北新区',
    date: '2026-01-18',
    description: '面向全省高校与初创团队开展AI创新创意比拼，激发场景落地灵感'
  },
  {
    id: 'act-02',
    month: '2月',
    name: '开发者极客沙龙',
    type: '社区运营',
    participants: 95,
    outputCount: 16,
    computeHours: 920,
    serviceItem: '开源模型与Agent开发实战',
    district: '鼓楼区',
    date: '2026-02-20',
    description: '聚焦开源模型轻量化部署与端侧AI代理实践，聚集骨干开发者技术切磋'
  },
  {
    id: 'act-03',
    month: '3月',
    name: '工程师实训第1期',
    type: '工程师实训',
    participants: 120,
    outputCount: 28,
    computeHours: 3200,
    serviceItem: '大模型微调应用开发',
    district: '雨花台区',
    date: '2026-03-22',
    description: '工业质检与行业知识库微调技能封闭式集训，实操真实算力资源'
  },
  {
    id: 'act-04',
    month: '4月',
    name: '产业大模型问诊会',
    type: '社区运营',
    participants: 110,
    outputCount: 18,
    computeHours: 1100,
    serviceItem: '智造企业智能化转型问诊',
    district: '玄武区',
    date: '2026-04-18',
    description: '邀请传统制造业CTO与AI平台专家面对面，梳理算力赋能与智能化改造路径'
  },
  {
    id: 'act-05',
    month: '5月',
    name: '技术沙龙',
    type: '社区运营',
    participants: 85,
    outputCount: 12,
    computeHours: 800,
    serviceItem: 'Agent架构最佳实践',
    district: '玄武区',
    date: '2026-05-15',
    description: '探讨多Agent协同与工作流编排，本地开发者社群深度技术切磋'
  },
  {
    id: 'act-06',
    month: '6月',
    name: '场景匹配赛',
    type: '场景匹配赛',
    participants: 180,
    outputCount: 32,
    computeHours: 1500,
    serviceItem: '智造质检方案对接',
    district: '江宁区',
    date: '2026-06-25',
    description: '龙头制造企业发布真实质检缺陷痛点，开发者带算法上门打靶对接'
  },
  {
    id: 'act-07',
    month: '7月',
    name: '工程师实训第2期',
    type: '工程师实训',
    participants: 200,
    outputCount: 17,
    computeHours: 1300,
    serviceItem: '多模态RAG实战',
    district: '栖霞区',
    date: '2026-07-20',
    description: '面向企业骨干研发的多模态检索增强生成实战，提升企业内训成效'
  },
  {
    id: 'act-08',
    month: '8月',
    name: '青年创客实战营',
    type: '工程师实训',
    participants: 150,
    outputCount: 24,
    computeHours: 1650,
    serviceItem: '高校算力实训与场景孵化',
    district: '浦口区',
    date: '2026-08-16',
    description: '联合驻宁高校青年极客，开展为期两周的公共算力实训与实战开发营'
  },
  {
    id: 'act-09',
    month: '9月',
    name: '技术路演',
    type: '揭榜项目',
    participants: 60,
    outputCount: 8,
    computeHours: 600,
    serviceItem: '揭榜成果转化评审',
    district: '建邺区',
    date: '2026-09-18',
    description: '首批揭榜挂帅产业化项目中期答辩与创投资本闭门对接'
  },
  {
    id: 'act-10',
    month: '10月',
    name: '行业沙龙',
    type: '社区运营',
    participants: 75,
    outputCount: 6,
    computeHours: 500,
    serviceItem: '生物医药AI场景研讨',
    district: '江北新区',
    date: '2026-10-12',
    description: '医药研发企业与AI生信科研团队面对面探讨先导化合物筛选合作'
  },
  {
    id: 'act-11',
    month: '11月',
    name: '年度巅峰赛',
    type: '认知唤醒赛',
    participants: 120,
    outputCount: 12,
    computeHours: 1200,
    serviceItem: '年度产业场景创新大决赛',
    district: '鼓楼区',
    date: '2026-11-20',
    description: '全年度优秀产业场景总决赛与成果展，决策层领导亲临现场颁奖'
  }
];

// 六大产业链在南京地图上的数据轮播与代表企业
export interface EcoV2IndustryCarouselItem {
  name: string;
  caseCount: number;
  enterprises: string;
  color: string;
  districts: string[];
  districtCounts: Record<string, number>;
  desc: string;
  landingCount: number;
  testingCount: number;
  signingCount: number;
  computeHours: string;
  keyCaseId: string;
  keyCaseTitle: string;
  keyCaseSaving: string;
  topEnterprise: string;
}

export const mockV2IndustryCarousels: EcoV2IndustryCarouselItem[] = [
  {
    name: '智能制造',
    caseCount: 38,
    enterprises: '南京智造精工、中电智能装配、深蓝精密',
    color: '#3B82F6',
    districts: ['江宁区', '溧水区', '六合区'],
    districtCounts: {
      '江宁区': 20,
      '溧水区': 11,
      '六合区': 7
    },
    desc: '工业视觉质检、压铸缺陷检测、柔性自动化产线',
    landingCount: 18,
    testingCount: 12,
    signingCount: 8,
    computeHours: '12,400',
    keyCaseId: 'case-01',
    keyCaseTitle: '汽车精密压铸件AI微米级缺陷实时检测系统',
    keyCaseSaving: '年化降本 320 万元',
    topEnterprise: '南京智造精工自动化有限公司'
  },
  {
    name: '电子信息',
    caseCount: 32,
    enterprises: '芯灵半导体、南微光电、国微芯片',
    color: '#06B6D4',
    districts: ['雨花台区', '栖霞区', '浦口区'],
    districtCounts: {
      '雨花台区': 15,
      '栖霞区': 11,
      '浦口区': 6
    },
    desc: 'EDA半导体微调、光刻参数优化、传感器多源融合',
    landingCount: 14,
    testingCount: 11,
    signingCount: 7,
    computeHours: '9,800',
    keyCaseId: 'case-02',
    keyCaseTitle: '晶圆芯片封装光刻参数多变量智能调优',
    keyCaseSaving: '年化挽回 450 万元',
    topEnterprise: '芯灵半导体智能系统研发中心'
  },
  {
    name: '生物医药',
    caseCount: 24,
    enterprises: '金陵生物制药、博奥基因、先声智能靶点',
    color: '#10B981',
    districts: ['玄武区', '浦口区', '鼓楼区'],
    districtCounts: {
      '玄武区': 10,
      '浦口区': 8,
      '鼓楼区': 6
    },
    desc: '靶点亲和力虚拟筛选、蛋白质折叠、病理切片辅助',
    landingCount: 10,
    testingCount: 9,
    signingCount: 5,
    computeHours: '6,600',
    keyCaseId: 'case-03',
    keyCaseTitle: '肿瘤靶点亲和力虚拟筛选与小分子生成',
    keyCaseSaving: '研发周期压缩 65%',
    topEnterprise: '金陵生物制药联合研发中心'
  },
  {
    name: '新能源',
    caseCount: 16,
    enterprises: '极电动力、国轩储能、南瑞电气',
    color: '#F59E0B',
    districts: ['浦口区', '江宁区'],
    districtCounts: {
      '浦口区': 9,
      '江宁区': 7
    },
    desc: 'BMS热失控预警、电网微网负荷预测、风光功率预测',
    landingCount: 7,
    testingCount: 5,
    signingCount: 4,
    computeHours: '4,200',
    keyCaseId: 'case-04',
    keyCaseTitle: '动力电池全生命周期SOH精准评估算法',
    keyCaseSaving: '热失控预警准确率 99.4%',
    topEnterprise: '极电动力科技有限公司'
  },
  {
    name: '文旅',
    caseCount: 10,
    enterprises: '金陵文旅数创、秦淮元宇宙、夫子庙数智',
    color: '#8B5CF6',
    districts: ['秦淮区', '玄武区', '建邺区'],
    districtCounts: {
      '秦淮区': 5,
      '玄武区': 3,
      '建邺区': 2
    },
    desc: '非遗AIGC文创设计、数字人景区沉浸导览、光影交互',
    landingCount: 4,
    testingCount: 3,
    signingCount: 3,
    computeHours: '2,100',
    keyCaseId: 'case-05',
    keyCaseTitle: '夫子庙数字人智能导览与非遗AIGC文创',
    keyCaseSaving: '二次消费转化 +38%',
    topEnterprise: '金陵文旅元宇宙数创工坊'
  },
  {
    name: '现代农业',
    caseCount: 8,
    enterprises: '汇农智慧农业、绿谷果蔬、南农无人机AI',
    color: '#EC4899',
    districts: ['高淳区', '溧水区'],
    districtCounts: {
      '高淳区': 5,
      '溧水区': 3
    },
    desc: '高光谱大棚病虫害监测、无人机精量点喷、产量预测',
    landingCount: 3,
    testingCount: 2,
    signingCount: 3,
    computeHours: '1,700',
    keyCaseId: 'case-06',
    keyCaseTitle: '特色草莓高光谱病害早期监测预警',
    keyCaseSaving: '减少农药使用 42%',
    topEnterprise: '汇农精智农业AI实验室'
  }
];

// 数据台账汇总明细数据源
export interface EcoV2TalentRecord {
  id: string;
  name: string;
  type: '结业' | '认证' | '普惠';
  courseOrLevel: string;
  time: string;
  status: '已结业' | '已认证' | '已完成';
  unit: string;
}

export const mockV2TalentRecords: EcoV2TalentRecord[] = [
  { id: 'TL-01', name: '张建军', type: '认证', courseOrLevel: '大模型系统架构高级工程师', time: '2026-08-20', status: '已认证', unit: '南京智造精工' },
  { id: 'TL-02', name: '李晓萌', type: '结业', courseOrLevel: '工业视觉检测YOLO微调实训', time: '2026-07-28', status: '已结业', unit: '南微光电' },
  { id: 'TL-03', name: '王振华', type: '认证', courseOrLevel: '工业边缘计算技术认证', time: '2026-08-15', status: '已认证', unit: '极电动力' },
  { id: 'TL-04', name: '陈思宇', type: '普惠', courseOrLevel: '生成式AI普惠实训营第3期', time: '2026-09-02', status: '已完成', unit: '东南大学软件学院' },
  { id: 'TL-05', name: '赵梓涵', type: '结业', courseOrLevel: '多模态RAG知识库架构', time: '2026-07-30', status: '已结业', unit: '深蓝质检' },
  { id: 'TL-06', name: '孙博文', type: '认证', courseOrLevel: 'Prompt工程与Agent研发资质', time: '2026-09-10', status: '已认证', unit: '智选云流工坊' },
  { id: 'TL-07', name: '刘梦洁', type: '普惠', courseOrLevel: '中小微企业数字化普惠讲座', time: '2026-09-18', status: '已完成', unit: '建邺科技园' },
  { id: 'TL-08', name: '周志成', type: '结业', courseOrLevel: '大模型微调应用开发实训第1期', time: '2026-03-30', status: '已结业', unit: '金陵文旅数创' },
  { id: 'TL-09', name: '吴承翰', type: '认证', courseOrLevel: '生物信息计算模型架构师', time: '2026-08-25', status: '已认证', unit: '博奥基因' },
  { id: 'TL-10', name: '郑雅琪', type: '普惠', courseOrLevel: '女性开发者AI赋能专场', time: '2026-10-08', status: '已完成', unit: '南京大学金陵学院' },
];

export const mockV2CaseLedgerRecords = [
  { id: 'CS-01', name: '汽车压铸缺陷视觉检测', company: '智造精工', type: '落地项目', district: '江宁区', compute: '1,850 卡时', output: '年降本320万' },
  { id: 'CS-02', name: '晶圆光刻参数自适应补偿', company: '芯灵半导体', type: '落地项目', district: '栖霞区', compute: '2,400 卡时', output: '挽回损失450万' },
  { id: 'CS-03', name: '抗癌化合物分子靶点亲和力初筛', company: '博奥基因', type: '落地项目', district: '玄武区', compute: '1,980 卡时', output: '降本210万' },
  { id: 'CS-04', name: '储能BMS电芯热失控异常预测', company: '极电动力', type: '落地项目', district: '江北新区', compute: '1,650 卡时', output: '避免召回损失580万' },
  { id: 'CS-05', name: '非遗剪纸与云锦LoRA文创打样', company: '金陵文旅', type: '落地项目', district: '秦淮区', compute: '620 卡时', output: '设计降本85万' },
  { id: 'CS-06', name: '高光谱大棚病虫害无人机精准点喷', company: '汇农精智', type: '落地项目', district: '高淳区', compute: '580 卡时', output: '农资降本42万' },
  { id: 'CS-07', name: '工业机械臂视觉无序抓取', company: '南大联合实验室', type: '降本案例', district: '鼓楼区', compute: '750 卡时', output: '效率提升40%' },
  { id: 'CS-08', name: '电商多语言营销脚本生成', company: '智选云流', type: '降本案例', district: '建邺区', compute: '420 卡时', output: '出海获客成本降50%' },
];

export const mockV2EnterpriseLedgerRecords = [
  { id: 'EP-01', name: '南京智造精工自动化有限公司', category: '行业应用', status: '已入统 (规上)', district: '江宁区', rentArea: '1,200 ㎡', taxCredit: 'A级信用' },
  { id: 'EP-02', name: '南微光电传感技术有限公司', category: '行业应用', status: '培育中 (辅导)', district: '雨花台区', rentArea: '980 ㎡', taxCredit: 'A级信用' },
  { id: 'EP-03', name: '极电动力科技有限公司', category: '行业应用', status: '培育中 (辅导)', district: '江北新区', rentArea: '1,100 ㎡', taxCredit: '拟升规' },
  { id: 'EP-04', name: '金陵绿色材料智造有限公司', category: '初创团队', status: '培育中', district: '六合区', rentArea: '650 ㎡', taxCredit: '赛事落地' },
  { id: 'EP-05', name: '芯灵半导体智能系统研发中心', category: '龙头研究院', status: '培育中', district: '栖霞区', rentArea: '1,500 ㎡', taxCredit: '规上后备' },
  { id: 'EP-06', name: '南大智能仿生联合实验室', category: '高校合作', status: '正常运营', district: '鼓楼区', rentArea: '800 ㎡', taxCredit: '新型研发' },
  { id: 'EP-07', name: '金陵文旅元宇宙数创工坊', category: 'OPC创业', status: '正常运营', district: '秦淮区', rentArea: '420 ㎡', taxCredit: '高人效' },
  { id: 'EP-08', name: '博奥智慧基因诊断工作室', category: '初创团队', status: '正常运营', district: '玄武区', rentArea: '560 ㎡', taxCredit: '科技苗圃' },
];

export const mockV2ComputeLedgerRecords = [
  { id: 'CP-01', pool: '昇腾昇思 910B 国产算力集群', quarter: 'Q3', totalHours: '16,800 卡时', cost: '840 万元', sharePct: '45.6%', status: '已对账结算' },
  { id: 'CP-02', pool: '英伟达 A800 通用高密推理池', quarter: 'Q2', totalHours: '12,400 卡时', cost: '620 万元', sharePct: '33.7%', status: '已对账结算' },
  { id: 'CP-03', pool: '海光 DCU 先进通用计算池', quarter: 'Q4至今', totalHours: '4,800 卡时', cost: '240 万元', sharePct: '13.0%', status: '计量核算中' },
  { id: 'CP-04', pool: '天都星辰 异构混合调度资源池', quarter: 'Q1', totalHours: '2,800 卡时', cost: '140 万元', sharePct: '7.7%', status: '已对账结算' },
];
