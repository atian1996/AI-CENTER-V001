// 算力运营中心 - 核心数据结构与静态基准数据

export interface ComputePoolItem {
  name: string;
  utilization: number; // 利用率 %
  assignedCards: number;
  totalCards: number;
  status: '正常' | '维护中';
  lastSyncTime: string;
  remark: string;
}

export interface LoadTrendDay {
  date: string;
  competition: number; // 赛事
  training: number;    // 实训
  sandbox: number;     // 实验场
  modelCall: number;   // 模型调用
  agentCall: number;   // Agent调用
  total: number;
}

export interface GpuModelShare {
  model: string;
  hours: number;
  percentage: number;
  color: string;
}

export interface PoolReconciliationRow {
  poolName: string;
  operator: string;
  hours: number;
  unitPrice: string;
  subtotal: number;
  percentage: number;
  status: '待确认' | '已确认' | '已结算';
}

export interface BusinessReconciliationRow {
  line: '赛事' | '实训' | '实验场' | '模型调用' | 'Agent调用';
  hours: number;
  percentage: number;
  payable: number;
  incomeRatio?: number;
}

export interface ConsumptionDetailRow {
  id: string;
  time: string;
  poolName: string;
  instanceId: string;
  businessLine: '赛事' | '实训' | '实验场' | '模型调用' | 'Agent调用';
  hours: number;
  amount: number;
  startTime: string;
  endTime: string;
  gpuType: string;
  operator: string;
}

export interface RevenueMonthlyTrend {
  month: string;
  amount: number;
}

export interface RevenueBusinessShare {
  line: '赛事' | '实训' | '实验场' | '模型调用' | 'Agent调用';
  amount: number;
  percentage: number;
  color: string;
}

export interface SettlementDetailRow {
  id: string;
  period: string;
  poolName: string;
  hours: number;
  revenue: number;
  status: '待结算' | '已结算';
}

export interface ReconciliationCycleStatus {
  period: string;
  reconStatus: '已确认' | '待确认';
  settleStatus: '已结算' | '待结算';
  remark: string;
}

// 页面一：算力资源总览数据
export const mockPoolRanking: ComputePoolItem[] = [
  {
    name: '电信云-华东1',
    utilization: 82,
    assignedCards: 492,
    totalCards: 600,
    status: '正常',
    lastSyncTime: '2026-10-12 10:30',
    remark: '—'
  },
  {
    name: '移动云-华北2',
    utilization: 76,
    assignedCards: 304,
    totalCards: 400,
    status: '正常',
    lastSyncTime: '2026-10-12 10:30',
    remark: '—'
  },
  {
    name: '联通云-华南1',
    utilization: 68,
    assignedCards: 136,
    totalCards: 200,
    status: '维护中',
    lastSyncTime: '2026-10-12 09:00',
    remark: '预计10-13恢复'
  }
];

export const mockLoadCurveData: LoadTrendDay[] = [
  { date: '10-06', competition: 420, training: 600, sandbox: 320, modelCall: 110, agentCall: 70, total: 1520 },
  { date: '10-07', competition: 380, training: 620, sandbox: 340, modelCall: 110, agentCall: 80, total: 1530 },
  { date: '10-08', competition: 450, training: 580, sandbox: 360, modelCall: 100, agentCall: 70, total: 1560 },
  { date: '10-09', competition: 520, training: 610, sandbox: 380, modelCall: 120, agentCall: 80, total: 1710 },
  { date: '10-10', competition: 480, training: 630, sandbox: 400, modelCall: 130, agentCall: 80, total: 1720 },
  { date: '10-11', competition: 560, training: 600, sandbox: 420, modelCall: 130, agentCall: 90, total: 1800 },
  { date: '10-12', competition: 510, training: 620, sandbox: 440, modelCall: 140, agentCall: 90, total: 1800 }
];

export const mockGpuModelShares: GpuModelShare[] = [
  { model: 'RTX 4090', hours: 5661, percentage: 45, color: '#2563EB' },
  { model: 'A100', hours: 3774, percentage: 30, color: '#10B981' },
  { model: 'T4', hours: 1887, percentage: 15, color: '#F59E0B' },
  { model: 'H800', hours: 1258, percentage: 10, color: '#8B5CF6' }
];

// 页面二：算力对账明细数据
export const mockPoolReconciliationList: PoolReconciliationRow[] = [
  { poolName: '电信云-华东1', operator: '中国电信', hours: 5800, unitPrice: '¥1.50/卡时', subtotal: 8700, percentage: 46, status: '已结算' },
  { poolName: '移动云-华北2', operator: '中国移动', hours: 4200, unitPrice: '¥1.50/卡时', subtotal: 6300, percentage: 33, status: '已结算' },
  { poolName: '联通云-华南1', operator: '中国联通', hours: 2580, unitPrice: '¥1.50/卡时', subtotal: 3870, percentage: 21, status: '已结算' }
];

export const mockBusinessReconciliationList: BusinessReconciliationRow[] = [
  { line: '赛事', hours: 3200, percentage: 25, payable: 4800, incomeRatio: 38 },
  { line: '实训', hours: 4500, percentage: 36, payable: 6750, incomeRatio: 53 },
  { line: '实验场', hours: 3680, percentage: 29, payable: 5520, incomeRatio: 44 },
  { line: '模型调用', hours: 800, percentage: 6, payable: 1200, incomeRatio: 10 },
  { line: 'Agent调用', hours: 400, percentage: 4, payable: 600, incomeRatio: 5 }
];

export const mockConsumptionDetails: ConsumptionDetailRow[] = [
  {
    id: 'c-01',
    time: '2026-09-30 14:30',
    poolName: '电信云-华东1',
    instanceId: 'i-abc123',
    businessLine: '赛事',
    hours: 8,
    amount: 12.0,
    startTime: '2026-09-30 06:30',
    endTime: '2026-09-30 14:30',
    gpuType: 'RTX 4090 (24GB)',
    operator: '挑战赛命题战队A'
  },
  {
    id: 'c-02',
    time: '2026-09-30 13:20',
    poolName: '移动云-华北2',
    instanceId: 'i-def456',
    businessLine: '实训',
    hours: 4,
    amount: 6.0,
    startTime: '2026-09-30 09:20',
    endTime: '2026-09-30 13:20',
    gpuType: 'A100 SXM4 (80GB)',
    operator: '南京微调实训营学员042'
  },
  {
    id: 'c-03',
    time: '2026-09-30 11:15',
    poolName: '电信云-华东1',
    instanceId: 'i-ghi789',
    businessLine: '实验场',
    hours: 12,
    amount: 18.0,
    startTime: '2026-09-29 23:15',
    endTime: '2026-09-30 11:15',
    gpuType: 'H800 PCIe (80GB)',
    operator: '先声药业分子验证集群'
  },
  {
    id: 'c-04',
    time: '2026-09-30 09:00',
    poolName: '联通云-华南1',
    instanceId: 'i-jkl012',
    businessLine: '模型调用',
    hours: 2,
    amount: 3.0,
    startTime: '2026-09-30 07:00',
    endTime: '2026-09-30 09:00',
    gpuType: 'T4 Tensor Core (16GB)',
    operator: '大语言模型在线推理API网关'
  },
  {
    id: 'c-05',
    time: '2026-09-29 22:40',
    poolName: '电信云-华东1',
    instanceId: 'i-mno345',
    businessLine: '赛事',
    hours: 6,
    amount: 9.0,
    startTime: '2026-09-29 16:40',
    endTime: '2026-09-29 22:40',
    gpuType: 'RTX 4090 (24GB)',
    operator: '智能视觉算法先锋队'
  },
  {
    id: 'c-06',
    time: '2026-09-29 20:10',
    poolName: '移动云-华北2',
    instanceId: 'i-pqr678',
    businessLine: '实训',
    hours: 10,
    amount: 15.0,
    startTime: '2026-09-29 10:10',
    endTime: '2026-09-29 20:10',
    gpuType: 'A100 SXM4 (80GB)',
    operator: '集成电路实训班3班'
  },
  {
    id: 'c-07',
    time: '2026-09-29 16:30',
    poolName: '电信云-华东1',
    instanceId: 'i-stu901',
    businessLine: '实验场',
    hours: 16,
    amount: 24.0,
    startTime: '2026-09-29 00:30',
    endTime: '2026-09-29 16:30',
    gpuType: 'H800 PCIe (80GB)',
    operator: '欣旺达锂电视觉模型项目'
  },
  {
    id: 'c-08',
    time: '2026-09-29 14:10',
    poolName: '联通云-华南1',
    instanceId: 'i-vwx234',
    businessLine: 'Agent调用',
    hours: 4,
    amount: 6.0,
    startTime: '2026-09-29 10:10',
    endTime: '2026-09-29 14:10',
    gpuType: 'T4 Tensor Core (16GB)',
    operator: '智能体工作流执行调度引擎'
  },
  {
    id: 'c-09',
    time: '2026-09-29 11:20',
    poolName: '移动云-华北2',
    instanceId: 'i-yz5678',
    businessLine: '赛事',
    hours: 8,
    amount: 12.0,
    startTime: '2026-09-29 03:20',
    endTime: '2026-09-29 11:20',
    gpuType: 'RTX 4090 (24GB)',
    operator: '创新挑战赛总决赛战队07'
  },
  {
    id: 'c-10',
    time: '2026-09-28 21:00',
    poolName: '电信云-华东1',
    instanceId: 'i-k01234',
    businessLine: '实训',
    hours: 12,
    amount: 18.0,
    startTime: '2026-09-28 09:00',
    endTime: '2026-09-28 21:00',
    gpuType: 'A100 SXM4 (80GB)',
    operator: '软件信息产业研修班'
  },
  {
    id: 'c-11',
    time: '2026-09-28 17:40',
    poolName: '移动云-华北2',
    instanceId: 'i-m56789',
    businessLine: '实验场',
    hours: 14,
    amount: 21.0,
    startTime: '2026-09-28 03:40',
    endTime: '2026-09-28 17:40',
    gpuType: 'H800 PCIe (80GB)',
    operator: '低空经济自动避障感知算法'
  },
  {
    id: 'c-12',
    time: '2026-09-28 15:15',
    poolName: '联通云-华南1',
    instanceId: 'i-p90123',
    businessLine: '模型调用',
    hours: 3,
    amount: 4.5,
    startTime: '2026-09-28 12:15',
    endTime: '2026-09-28 15:15',
    gpuType: 'T4 Tensor Core (16GB)',
    operator: '多模态模型在线推理接口'
  }
];

// 页面三：算力收益分成数据
export const mockRevenueTrends: RevenueMonthlyTrend[] = [
  { month: '2025-11', amount: 3200 },
  { month: '2025-12', amount: 3500 },
  { month: '2026-01', amount: 3800 },
  { month: '2026-02', amount: 4100 },
  { month: '2026-03', amount: 4500 },
  { month: '2026-04', amount: 4800 },
  { month: '2026-05', amount: 5200 },
  { month: '2026-06', amount: 5600 },
  { month: '2026-07', amount: 6000 },
  { month: '2026-08', amount: 6500 },
  { month: '2026-09', amount: 10660 },
  { month: '2026-10', amount: 12580 }
];

export const mockRevenueBusinessShares: RevenueBusinessShare[] = [
  { line: '赛事', amount: 4800, percentage: 38, color: '#2563EB' },
  { line: '实训', amount: 3150, percentage: 25, color: '#10B981' },
  { line: '实验场', amount: 3650, percentage: 29, color: '#8B5CF6' },
  { line: '模型调用', amount: 600, percentage: 5, color: '#06B6D4' },
  { line: 'Agent调用', amount: 380, percentage: 3, color: '#F59E0B' }
];

export const mockSettlementDetails: SettlementDetailRow[] = [
  { id: 's-01', period: '2026-09', poolName: '电信云-华东1', hours: 5800, revenue: 8700, status: '已结算' },
  { id: 's-02', period: '2026-09', poolName: '移动云-华北2', hours: 4200, revenue: 6300, status: '已结算' },
  { id: 's-03', period: '2026-09', poolName: '联通云-华南1', hours: 2580, revenue: 3870, status: '已结算' },
  { id: 's-04', period: '2026-08', poolName: '电信云-华东1', hours: 4900, revenue: 7350, status: '已结算' },
  { id: 's-05', period: '2026-08', poolName: '移动云-华北2', hours: 3800, revenue: 5700, status: '已结算' }
];

export const mockReconClosedLoopStatuses: ReconciliationCycleStatus[] = [
  { period: '2026-09', reconStatus: '已确认', settleStatus: '已结算', remark: '9月已结' },
  { period: '2026-08', reconStatus: '已确认', settleStatus: '已结算', remark: '8月已结' },
  { period: '2026-07', reconStatus: '已确认', settleStatus: '已结算', remark: '7月已结' },
  { period: '2026-06', reconStatus: '已确认', settleStatus: '已结算', remark: '6月已结' }
];

// ==========================================
// 页面四：算力容量告警 数据结构与模拟数据
// ==========================================

export interface ClusterWatermarkPool {
  poolName: string;
  totalCards: number;
  allocatedCards: number;
  freeCards: number;
  watermarkRate: number; // 百分比
  status: '正常' | '预警' | '紧急';
}

export interface DispatchSuccessTrend {
  timeSlot: string; // 如 '00:00', '04:00', '08:00', '12:00', '16:00', '20:00'
  successRate: number; // 百分比 如 99.4%
  totalDispatches: number; // 调度总数
  avgLatencySeconds: number; // 平均耗时 秒
}

export interface ActiveAlertItem {
  id: string;
  level: '紧急' | '提示';
  poolName: string;
  title: string;
  description: string;
  timestamp: string;
  metricValue: string;
  thresholdValue: string;
  durationMinutes: number;
  suggestedAction: string;
}

export interface AlertThresholdRule {
  id: string;
  targetMetric: string;
  warningThreshold: string;
  criticalThreshold: string;
  notificationChannels: string[];
  enabled: boolean;
}

export const mockClusterWatermarks: ClusterWatermarkPool[] = [
  {
    poolName: '电信云-华东1',
    totalCards: 550,
    allocatedCards: 462,
    freeCards: 88,
    watermarkRate: 84.0,
    status: '预警'
  },
  {
    poolName: '移动云-华北2',
    totalCards: 420,
    allocatedCards: 348,
    freeCards: 72,
    watermarkRate: 82.9,
    status: '预警'
  },
  {
    poolName: '联通云-华南1',
    totalCards: 230,
    allocatedCards: 132,
    freeCards: 98,
    watermarkRate: 57.4,
    status: '正常'
  }
];

export const mockDispatchSuccessTrends: DispatchSuccessTrend[] = [
  { timeSlot: '00:00-04:00', successRate: 99.6, totalDispatches: 142, avgLatencySeconds: 24 },
  { timeSlot: '04:00-08:00', successRate: 99.8, totalDispatches: 98, avgLatencySeconds: 22 },
  { timeSlot: '08:00-12:00', successRate: 98.9, totalDispatches: 412, avgLatencySeconds: 34 },
  { timeSlot: '12:00-16:00', successRate: 99.1, totalDispatches: 360, avgLatencySeconds: 29 },
  { timeSlot: '16:00-20:00', successRate: 99.0, totalDispatches: 485, avgLatencySeconds: 31 },
  { timeSlot: '20:00-24:00', successRate: 99.4, totalDispatches: 228, avgLatencySeconds: 26 }
];

export const mockActiveAlerts: ActiveAlertItem[] = [
  {
    id: 'ALT-20261012-01',
    level: '紧急',
    poolName: '电信云-华东1',
    title: 'A100资源池水位超阈值 (84% >= 80%)',
    description: '工业视觉算法竞赛多并发作业突发，高优先级任务下发出现队列等待，建议开启跨池突发溢出弹性调度。',
    timestamp: '2026-10-12 09:42:15',
    metricValue: '84.0%',
    thresholdValue: '>= 80.0%',
    durationMinutes: 48,
    suggestedAction: '调度排队作业至移动云-华北2节点'
  },
  {
    id: 'ALT-20261012-02',
    level: '紧急',
    poolName: '移动云-华北2',
    title: '网络互联延迟突增 (28ms >= 20ms)',
    description: '跨地域异构算力纳管专线B链路抖动，部分分布式训练数据同步速率受抑制。',
    timestamp: '2026-10-12 09:15:30',
    metricValue: '28.4ms',
    thresholdValue: '>= 20.0ms',
    durationMinutes: 75,
    suggestedAction: '已自动切换至BGP备用专线'
  },
  {
    id: 'ALT-20261012-03',
    level: '提示',
    poolName: '联通云-华南1',
    title: 'GPU驱动例行维护窗口临近',
    description: '集群4号机柜（32卡 RTX 4090）计划于本周三凌晨02:00执行微码升级与热插拔检测。',
    timestamp: '2026-10-12 08:30:00',
    metricValue: '计划维护',
    thresholdValue: '提前48小时预通知',
    durationMinutes: 120,
    suggestedAction: '请提前通知实训教学任务迁移'
  },
  {
    id: 'ALT-20261012-04',
    level: '提示',
    poolName: '电信云-华东1',
    title: '算力单次下发耗时轻度波动',
    description: '近1小时有3次实例冷启动镜像拉取耗时超过45秒，建议开启镜像本地缓存预热。',
    timestamp: '2026-10-12 07:18:22',
    metricValue: '31秒',
    thresholdValue: '>= 30秒',
    durationMinutes: 190,
    suggestedAction: '下发容器加速镜像预拉取指令'
  }
];

export const mockAlertThresholdRules: AlertThresholdRule[] = [
  {
    id: 'RULE-01',
    targetMetric: '集群资源池容量水位',
    warningThreshold: '>= 75% (提示告警)',
    criticalThreshold: '>= 85% (紧急告警/阻断非关键作业)',
    notificationChannels: ['短信通知', '企业微信', '大屏闪烁'],
    enabled: true
  },
  {
    id: 'RULE-02',
    targetMetric: '实例下发成功率',
    warningThreshold: '< 99.0% (近1小时)',
    criticalThreshold: '< 98.0% (触发自动容灾跨池调度)',
    notificationChannels: ['运维值班电话', '监控钉钉群'],
    enabled: true
  },
  {
    id: 'RULE-03',
    targetMetric: '调度下发响应延迟',
    warningThreshold: '>= 45秒 (提示排队)',
    criticalThreshold: '>= 90秒 (标记节点异常并熔断)',
    notificationChannels: ['运维工单系统', '邮件抄送资方'],
    enabled: true
  },
  {
    id: 'RULE-04',
    targetMetric: '物理机柜温度与硬件离线',
    warningThreshold: '>= 78°C / 单卡ECC瞬时错误',
    criticalThreshold: '>= 85°C / 节点掉线停机隔离',
    notificationChannels: ['机房动环联动', '短信紧急呼叫'],
    enabled: true
  }
];

// ==========================================
// 页面五：算力纳管进度 数据结构与模拟数据
// ==========================================

export interface ManagedClusterOverview {
  clusterName: string;
  provider: string; // 如 '中国电信', '中国移动', '中国联通', '华为昇腾生态', '中科曙光'
  region: string;
  architecture: string; // 如 'NVIDIA Hopper / Ada', '华为昇腾 910B', '海光 DCU'
  plannedCards: number;
  actualIntegratedCards: number;
  progressPercentage: number;
  stage: '网络打通' | '驱动互认' | '监控接入' | '基准测试' | '正式纳管运营';
  status: '纳管完成' | '纳管进行中' | '技术评审中';
  operator: string;
  updatedDate: string;
}

export interface OnboardingPhaseMilestone {
  phaseName: string;
  code: string;
  description: string;
  completedClusters: number;
  totalClusters: number;
  status: '已就绪' | '进行中' | '待启动';
  color: string;
}

export interface ClusterIntegrationLog {
  id: string;
  clusterName: string;
  eventType: '网络联通' | '驱动纳管' | '性能验收' | '上线就绪';
  content: string;
  result: '通过' | '排查中' | '警告';
  timestamp: string;
}

export const mockManagedClusters: ManagedClusterOverview[] = [
  {
    clusterName: '南京智算中心一期 (昇腾)',
    provider: '南京未来科技城 / 华为',
    region: '南京·江宁区',
    architecture: '华为昇腾 910B (32GB)',
    plannedCards: 512,
    actualIntegratedCards: 512,
    progressPercentage: 100,
    stage: '正式纳管运营',
    status: '纳管完成',
    operator: '省智算调度中心运维组',
    updatedDate: '2026-10-10'
  },
  {
    clusterName: '电信云华东算力枢纽 (A100/H800)',
    provider: '中国电信云算力事业部',
    region: '南京·雨花台区',
    architecture: 'NVIDIA A100 / H800 (80GB)',
    plannedCards: 550,
    actualIntegratedCards: 550,
    progressPercentage: 100,
    stage: '正式纳管运营',
    status: '纳管完成',
    operator: '电信云运维专班',
    updatedDate: '2026-10-08'
  },
  {
    clusterName: '移动云华北智算集群 (4090/A800)',
    provider: '中国移动政企云',
    region: '华北算力节点·直连专线',
    architecture: 'RTX 4090 / A800 (24/80GB)',
    plannedCards: 420,
    actualIntegratedCards: 420,
    progressPercentage: 100,
    stage: '正式纳管运营',
    status: '纳管完成',
    operator: '移动云接入组',
    updatedDate: '2026-09-30'
  },
  {
    clusterName: '中科曙光先进计算(昆山)算力池',
    provider: '中科曙光国家先进计算',
    region: '苏南枢纽·光纤直连',
    architecture: '海光 DCU Z100 / 8000',
    plannedCards: 320,
    actualIntegratedCards: 260,
    progressPercentage: 81.2,
    stage: '基准测试',
    status: '纳管进行中',
    operator: '生态纳管专项联合攻坚组',
    updatedDate: '2026-10-11'
  },
  {
    clusterName: '联通云华南异构集群',
    provider: '中国联通广东联通',
    region: '华南节点',
    architecture: 'NVIDIA RTX 4090 (24GB)',
    plannedCards: 230,
    actualIntegratedCards: 230,
    progressPercentage: 100,
    stage: '正式纳管运营',
    status: '纳管完成',
    operator: '联通政企运维组',
    updatedDate: '2026-09-15'
  },
  {
    clusterName: '南京高校科教算力共享池',
    provider: '东南大学 / 南京大学超级计算',
    region: '南京·栖霞区',
    architecture: '异构集群 (NVIDIA+寒武纪)',
    plannedCards: 180,
    actualIntegratedCards: 90,
    progressPercentage: 50.0,
    stage: '监控接入',
    status: '纳管进行中',
    operator: '高校科研算力协同办',
    updatedDate: '2026-10-12'
  }
];

export const mockOnboardingMilestones: OnboardingPhaseMilestone[] = [
  {
    phaseName: '跨域专线与网络互联',
    code: 'STAGE-1',
    description: '完成云网融合SDN专线铺设、跨网段BGP互联与QoS带宽压测',
    completedClusters: 6,
    totalClusters: 6,
    status: '已就绪',
    color: '#10B981'
  },
  {
    phaseName: '异构驱动适配与K8s纳管',
    code: 'STAGE-2',
    description: '通过统一调度Agent完成昇腾/NVIDIA/海光异构芯片驱动注册与调度探针',
    completedClusters: 6,
    totalClusters: 6,
    status: '已就绪',
    color: '#10B981'
  },
  {
    phaseName: '统一计量计费与遥测接入',
    code: 'STAGE-3',
    description: '打通GPU核心利用率、显存、功耗每秒遥测与卡时对账日志流',
    completedClusters: 5,
    totalClusters: 6,
    status: '进行中',
    color: '#3B82F6'
  },
  {
    phaseName: '基准算力性能验收评测',
    code: 'STAGE-4',
    description: '执行标准大模型预训练与推理吞吐测试（ResNet/LLaMA-70B算力标定）',
    completedClusters: 4,
    totalClusters: 6,
    status: '进行中',
    color: '#F59E0B'
  },
  {
    phaseName: '全功能正式发布并单下发',
    code: 'STAGE-5',
    description: '面向赛事、实训、实验场开放秒级实例调度与自动化分成结算',
    completedClusters: 4,
    totalClusters: 6,
    status: '进行中',
    color: '#8B5CF6'
  }
];

export const mockClusterIntegrationLogs: ClusterIntegrationLog[] = [
  {
    id: 'LOG-881',
    clusterName: '中科曙光先进计算(昆山)算力池',
    eventType: '性能验收',
    content: '通过NCCL/HCCL跨节点分布式通信环路带宽压测，达到标称92%效率，进入最后一轮推理吞吐标定。',
    result: '通过',
    timestamp: '2026-10-12 10:15'
  },
  {
    id: 'LOG-880',
    clusterName: '南京高校科教算力共享池',
    eventType: '驱动纳管',
    content: '已成功在寒武纪MLU370节点挂载统一K8s DaemonSet监控守护进程，遥测心跳包正常上报。',
    result: '通过',
    timestamp: '2026-10-12 09:30'
  },
  {
    id: 'LOG-879',
    clusterName: '南京智算中心一期 (昇腾)',
    eventType: '上线就绪',
    content: '昇腾MindSpore与PyTorch多框架镜像仓库同步完成，支持高校实训班一键开箱调度。',
    result: '通过',
    timestamp: '2026-10-11 16:20'
  },
  {
    id: 'LOG-878',
    clusterName: '南京高校科教算力共享池',
    eventType: '网络联通',
    content: '仙林校区至市级政务外网光纤延迟实测1.8ms，丢包率0.00%，已通过网络安全隔离边界认证。',
    result: '通过',
    timestamp: '2026-10-11 14:05'
  },
  {
    id: 'LOG-877',
    clusterName: '中科曙光先进计算(昆山)算力池',
    eventType: '网络联通',
    content: '主备双光纤路由切换演练完成，切换中断时间小于50ms，符合金融级高可靠纳管要求。',
    result: '通过',
    timestamp: '2026-10-10 11:40'
  }
];

