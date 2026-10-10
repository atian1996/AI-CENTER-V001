/**
 * AI运营中心 - 类型定义
 */

export type MainTabType = 
  | 'home' 
  | 'marketplace' 
  | 'tasks' 
  | 'compute' 
  | 'creative'
  | 'community' 
  | 'workspace';

export type MarketplaceSubTab = 'agent' | 'model' | 'dataset' | 'skill';

export type WorkspaceSubTab = 
  | 'points'
  | 'assets' 
  | 'my-tasks' 
  | 'compute'
  | 'competitions'
  | 'community'
  | 'calls' 
  | 'apikeys' 
  | 'notifications' 
  | 'settings';

export type AgentCategory = 
  | 'all' 
  | 'dialogue' 
  | 'coding' 
  | 'data' 
  | 'image' 
  | 'vertical';

export type ModelTypeTag = '文本' | '图像' | '音频' | '视频' | 'Embedding' | '重排' | '向量';

// 用户信息与积分
export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  levelBadge: string;
  identityTag: string;
  skills: string[];
  balance: number; // 账户人民币可用余额(元)
  frozenBalance?: number; // 冻结资金(元)
  points: number; // 可用积分
  frozenPoints?: number; // 冻结积分
  todayEarnedPoints: number;
  continuousCheckInDays?: number; // 连续签到天数
  githubUrl?: string;
  websiteUrl?: string;
  bio: string;
  mfaEnabled: boolean;
}

export type TransactionType = '充值' | '消费' | '积分获取' | '积分消耗';
export type TransactionCategory = 'recharge' | 'expense' | 'points_earn' | 'points_spend';
export type TransactionStatus = '成功' | '处理中' | '失败';

export interface AccountTransaction {
  id: string;
  time: string; // 如 "08-24 14:30"
  type: TransactionType; // '充值' | '消费' | '积分获取' | '积分消耗'
  category: TransactionCategory; // 'recharge' | 'expense' | 'points_earn' | 'points_spend'
  detail: string; // 详情，如 "Agent订阅-智能客服月卡", "Agent订阅抵扣", "微信支付", "算力租赁-RTX4090按量3.5h", "每日签到", "支付宝"
  amountText: string; // 金额显示，如 "+¥100.00", "-¥29.90", "+5分", "-300分"
  balanceChangeText: string; // 余额/积分变化，如 "¥200→¥170.10", "1,500→1,200分", "¥100→¥200", "¥106.55→¥100", "1,495→1,500分", "¥50→¥100"
  status: TransactionStatus; // '成功' | '处理中' | '失败'
  
  // 结构化字段供各Tab专属视图使用：
  paymentMethod?: string; // 支付方式 (如 '微信支付', '支付宝') - 用于【充值记录】
  scene?: string; // 场景 (如 'Agent订阅', '算力租赁') - 用于【消费记录】
  productName?: string; // 商品 (如 '智能客服-月卡', 'RTX4090-按量3.5h') - 用于【消费记录】
  source?: string; // 来源 (如 '每日签到') - 用于【积分获取】
  pointsAmountNum?: number; // 积分数值 (如 5, 300)
  purpose?: string; // 用途 (如 'Agent订阅抵扣') - 用于【积分消耗】
  remark?: string; // 说明 (如 '连续签到第3天', '抵扣¥3.00')
  
  // 历史兼容字段
  title?: string;
  currencyType?: 'rmb' | 'points' | 'both';
  rmbAmount?: number;
  pointsAmount?: number;
  rmbBalanceAfter?: number;
  pointsBalanceAfter?: number;
  deductionInfo?: string;
}

export interface PointRecord {
  id: string;
  title: string;
  amount: number; // 正数为获取，负数为消耗
  type: 'earn' | 'spend';
  source: string;
  timestamp: string;
}

export interface OnboardingTask {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  completed: boolean;
  actionKey: string;
}

export type NotificationTabType = 'all' | 'business' | 'interaction';

export interface AppNotification {
  id: string;
  title: string;
  content: string;
  category?: 'business' | 'interaction';
  subCategory?: 'agent' | 'model' | 'dataset' | 'skill' | 'task' | 'compute' | 'competition' | 'account' | 'community';
  type?: 'interaction' | 'task' | 'points' | 'compute' | 'audit' | 'business';
  time: string;
  read: boolean;
  targetTab?: MainTabType;
  targetId?: string;
  actionLabel?: string;
  actionType?: 'recharge' | 'link' | 'view';
}

// Agent 资产分类与形态筛选
export type AppType = '工作流' | 'Chatflow' | '聊天助手' | 'Agent' | '文本生成应用';
export type TechFormType = 'Chatbot' | 'Agent' | 'Chatflow' | 'Workflow' | '对话流' | '工作流' | '文本生成' | AppType;
export type AppSceneType = '内容创作' | '数据分析' | '智能客服' | '办公助理' | '编程开发' | '营销推广' | '教育培训' | '行业垂直';
export type IndustryDomainType = '政务' | '制造' | '零售' | '金融' | '医疗' | '教育' | '文旅' | '通用' | '企业' | '物流';
export type PriceModeFilterType = 'all' | 'free' | 'token';

export interface AgentComment {
  id: string;
  userName: string;
  userAvatar: string;
  rating: number;
  content: string;
  date: string;
}

export interface AgentVersionLog {
  version: string;
  date: string;
  log: string;
}

export interface AgentItem {
  id: string;
  name: string;
  avatar: string;
  description: string;
  category: AgentCategory;
  rating: number; // 1-5
  ratingCount: number;
  priceType: 'free' | 'points' | 'cash' | 'token';
  priceValue: number; // 0 或 积分值 或 元
  priceModel?: '免费' | '按Token计费';
  priceText?: string; // 如 "¥0.50 / 万Token"
  techForm?: TechFormType;
  appType?: AppType;
  iconBgColor?: string;
  iconType?: string;
  scene?: AppSceneType;
  industry?: IndustryDomainType;
  servicedCount?: number; // 如 1234
  developer?: string; // 如 "张三科技"
  giftTokenText?: string; // 如 "新用户赠送 10万Token体验额度（7天有效）"
  capabilityDesc?: string[];
  applicableScenes?: string[];
  inputExample?: string;
  outputExample?: string;
  useGuide?: string;
  versionLogs?: AgentVersionLog[];
  comments?: AgentComment[];
  usageCount: number;
  tags: string[]; // ['热门', '新上', '官方']
  author: string;
  authorAvatar?: string;
  baseModel?: string;
  baseModelId?: string; // 关联平台内的模型ID (默认首选)
  baseModelIds?: string[]; // 关联的基座模型ID列表（支持多选）
  baseModels?: string[]; // 关联的基座模型名称列表（支持多选）
  version?: string;
  techDocs?: string;
  createdAt?: string;
  updatedAt?: string;
  isFavorite?: boolean;
  todayTokenUsage?: number;
  isPurchased?: boolean;
  isDeveloped?: boolean;
  publishStatus?: 'published' | 'reviewing' | 'offline';
  slogan?: string;
  pricePerTenThousandTokens?: number;
  linkedModel?: string;
  subscribersCount?: number;
  callUsersCount?: number; // 调用用户数 (当前使用该Agent的用户数量)
  hasTrialQuota?: boolean;
  trialQuotaVal?: number;
  trialQuotaValidityDays?: number;
  freeTokenQuota?: number; // 兼容旧字段：免费Token额度 (万Token)
  freeQuotaAmount?: number; // 免费体验额度 (单位：元)
  weekCardPrice?: number;
  weekCardTokens?: number;
  monthCardPrice?: number;
  monthCardTokens?: number;
  quarterCardPrice?: number;
  quarterCardTokens?: number;
  yearCardPrice?: number;
  yearCardTokens?: number;
  apiAddress?: string;
  status?: '已上架' | '未上架' | '已停止新订阅' | '已下架' | '草稿';
  freeTrialCount?: number; // 兼容旧字段
  trialUrl?: string; // 外部免费试用或独立体验页面URL
  categoryTags?: string[];
  industryTags?: string[];
  isUsed?: boolean;
}

// Agent 订阅套餐定义
export interface SubscriptionPackage {
  id: 'week' | 'month' | 'quarter' | 'year';
  name: string;
  price: number;
  tokenAmountText: string;
  tokenAmountVal: number; // 单位：万Token
  unitPriceText: string; // 换算每万Token单价
  validityDays: number;
  isRecommended?: boolean;
  tag?: string;
  targetAudience: string;
}

// 用户订阅的 Agent 记录
export interface AgentSubscriptionItem {
  agentId: string;
  agentName: string;
  tier: 'week' | 'month' | 'quarter' | 'year';
  tierName: string;
  price: number;
  tokenAmountVal: number;
  tokensLeftVal: number;
  expireDate: string;
  subscribedAt: string;
}

// 计费规则
export interface ModelBillingRule {
  id: string;
  modality: '文本' | '图像' | '音频' | '视频' | string; // 适用模态（来自输入/输出模态并集）
  direction: '输入' | '输出'; // 计费方向
  unit: 'Token（按M tokens）' | '字符（按千字符）' | '张数' | '秒数' | string; // 计价单位
  price?: number; // 价格（不填或0为免费，支持4位小数）
}

// 模型
export interface ModelItem {
  id: string;
  name: string;
  vendor: string; // 如 'DeepSeek', 'Google', '阿里', '智谱'
  author?: string; // 作者品牌，如 'DeepSeek', 'MoonshotAI', 'ByteDance', 'Alibaba', 'Z.ai', 'Qwen', 'MiniMax'
  logo?: string; // 模型LOGO (1:1比例图片)
  brief?: string; // 模型简介（限30字，用于列表卡片展示）
  downloadUrl?: string; // 模型下载地址（开源模型提供）
  providerList?: string[]; // 提供商列表，如 ['无问芯穹', '阿里云百炼', '百度千帆', '百度智能云', '腾讯云']
  modelCodeName?: string; // 如 'deepseek-v4-pro-0813'
  versionName?: string; // 如 'DeepSeek V4 Pro 0813 版本'
  totalTokensUsed?: string; // 如 '1.11B tokens', '10.31B tokens'
  totalCalls?: number; // 累计调用次数
  totalRevenue?: number; // 累计营收 (元)
  protocol?: string; // 如 'Chat Completions'
  protocols?: string[]; // 支持协议 多选: ['Chat Completions', 'Responses', 'Gemini', 'Anthropic']
  modalities?: string[]; // 模型模态 多选: ['文本', '图像', '音频', '视频', '向量']
  inputModalities?: string[]; // 输入模态 多选: ['文本', '图像', '音频', '视频']
  outputModalities?: string[]; // 输出模态 多选: ['文本', '图像', '音频', '视频', '向量']
  contextLength?: string; // 兼容字面量如 '128K', '1.0M'
  contextLengthValue?: number; // 如 1000, 128, 1
  contextLengthUnit?: 'K' | 'M'; // K / M
  maxOutputTokens?: number; // 最大输出Tokens 如 131072
  
  // 接入配置
  apiUrl?: string; // 模型的调用接口URL
  authType?: '无认证' | 'API Key' | 'Bearer Token'; // 认证方式
  authCredential?: string; // 认证凭证
  timeoutSeconds?: number; // 超时时间（秒，默认30）

  // 计费规则
  billingRules?: ModelBillingRule[];
  billingRuleSummary?: string; // 摘要，如“输入文本¥9/M tokens，输出文本¥27/M tokens”

  // 状态与协议
  status?: '已上架' | '已下架' | '草稿';
  trialCountLimit?: number; // 每日在线体验次数限制（默认5次，设置为0时前台置灰）

  // API文档与代码示例
  apiDocContent?: string; // Markdown 文档
  codeCurl?: string; // curl 代码示例
  codePython?: string; // Python 代码示例
  codeNode?: string; // Node.js 代码示例

  // 价格与标签兼容
  cachedPrice?: string; // 如 '¥0.025 /M tokens'
  throughputTps?: number; // 如 76
  availabilityPercent?: number; // 如 99.9
  typeTag: ModelTypeTag;
  priceInput: string; // ¥0.002 / 1k tokens
  priceOutput: string;
  pricePerTenThousandTokens?: number; // 每万tokens价格（单位：元）
  tags: string[]; // ['热门', '国产', '免费额度']
  description: string;
  benchmarks: { name: string; score: number }[];
  latencyMs: number;
  apiDocsUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

// 模型调用记录
export interface ModelCallRecord {
  id: string; // 调用ID（系统生成，唯一标识）
  userId: string; // UID，如 'U892301'
  userName: string; // 用户名，如 '李明华'
  userAvatar?: string;
  userPhone?: string;
  modelId: string; // 模型ID
  modelName: string; // 模型名称
  agentId?: string; // 如果是通过Agent调用，关联的Agent ID
  agentName?: string; // 如果是通过Agent调用，关联的Agent名称
  callSource?: 'agent' | 'direct'; // 调用来源
  callType: 'API' | '在线体验'; // 调用方式
  inputAmount: string; // 如 “1,234 tokens” 或 “5张” 或 “120秒”
  inputCount: number;
  outputAmount: string; // 如 “567 tokens” 或 “2张”
  outputCount: number;
  cost: number; // 本次调用费用，如 0.0009
  callTime: string; // YYYY-MM-DD HH:mm:ss
  status: '成功' | '失败';
  failReason?: string; // 如失败则显示
  requestParamsSummary?: string; // 本次调用的输入内容摘要
  responseSummary?: string; // 本次调用的输出内容摘要
  matchedBillingRule?: string; // 命中的计费规则（适用模态+计费方向+计价单位）
  latencyMs?: number; // 耗时
  apiKeyPrefix?: string; // 调用的API Key来源
}

// Agent调用明细记录 (与模型调用记录同源，从Agent视角查看)
export interface AgentCallRecord {
  id: string; // 调用ID（系统生成，唯一标识）
  userId: string; // 用户UID，如 'U892301'
  userName: string; // 用户名，如 '李明华'
  userAvatar?: string;
  agentId: string; // 被调用的 Agent
  agentName: string; // 被调用的 Agent 名称
  baseModelId?: string; // 绑定的模型 ID
  baseModelName: string; // 该 Agent 绑定的模型名称
  inputTokens: number; // 本次调用消耗的输入Token数
  outputTokens: number; // 本次调用消耗的输出Token数
  priceInput?: string; // 命中模型的输入单价
  priceOutput?: string; // 命中模型的输出单价
  cost: number; // 按绑定模型单价计算的费用
  callTime: string; // 调用时间 (YYYY-MM-DD HH:mm:ss)
  status: '成功' | '失败';
  failReason?: string; // 如失败则显示
  requestSummary: string; // 输入内容摘要
  responseSummary: string; // 输出内容摘要
  latencyMs?: number; // 耗时
  callType?: '在线体验' | 'API调用';
}

// 用户模型消费汇总
export interface ModelUserConsumption {
  userId: string;
  userName: string;
  userAvatar?: string;
  totalCalls: number;
  totalCost: number;
  favoriteModel: string;
  lastCallTime: string;
}

// 数据集文件与结构
export interface DatasetFileItem {
  id: string;
  name: string;
  size: string;
  format: 'csv' | 'xlsx' | 'json' | 'jsonl' | 'parquet' | 'txt' | 'zip';
  rowsCount: number;
  colsCount: number;
  encoding: string;
  headers: string[];
  sampleRows: Record<string, string | number>[];
}

export interface DatasetCommentReply {
  id: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  time: string;
  timestamp?: number;
  content: string;
  replyToUser?: string;
  likes?: number;
  isLiked?: boolean;
}

export interface DatasetCommentItem {
  id: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  time: string;
  timestamp?: number;
  content: string;
  likes?: number;
  isLiked?: boolean;
  images?: string[];
  replies?: DatasetCommentReply[];
}

// 数据集
export interface DatasetItem {
  id: string;
  name: string;
  repoPath: string; // 如 "open-rs/HRSC2016", "PowerBI零售数据分析实战配套数据集"
  coverImage?: string; // 封面图
  author: string;
  authorAvatar?: string;
  authorOrg?: string; // 如 "逐聚开源智能平台", "百度开源", "中科天机", "开放数据集镜像"
  updatedAt: string; // 如 "2026/08/13"
  relativeTime: string; // 如 "1 年前", "2 年前", "3 天前", "6 天前", "5 个月前"
  viewsCount: number; // 👁 浏览量 (如 12091, 2254, 72)
  downloadCount: number; // ⬇ 下载量 (如 734, 146, 9)
  likesCount: number; // 👍 点赞数
  favoritesCount: number; // ⭐ 收藏数 (♡ 0, ♡ 2)
  isLiked?: boolean;
  isFavorite?: boolean;
  isCreatedByMe?: boolean;
  isMounted?: boolean;

  // 分类与标签
  modalityCategory: '多模态' | '计算机视觉' | '自然语言处理' | '音频' | '表格' | '强化学习';
  taskType: string; // 如 '图像描述', '无条件图像生成', '文本生成', '时间序列预测', '特征抽取', '文本分类', '物体检测'
  domainTags: string[]; // 如 ['科技互联网', '经济', '商业', '电商', '金融科技', '数据分析', '数据挖掘']
  license: string; // 如 'CC0 公共领域共享', 'Apache 2.0', 'MIT', 'CC-BY-4.0'
  language: string; // '中文' | 'English' | '多语言'

  // 描述与文档 (对齐详情页-概述)
  description: string;
  backgroundDesc: string; // 背景描述
  dataDesc: string; // 数据说明
  sourceDesc: string; // 数据来源
  problemDesc: string; // 问题描述

  // 基础信息 (对齐详情页-概述右侧信息)
  mountPath: string; // 挂载目录如 "/home/mw/input/sjiiaa8769"
  fileFormats: string; // 如 ".csv, .xlsx"
  fileSize: string; // 如 "267.5 MB", "1.2 MB", "30.8 GB"
  filesCount: number; // 如 6, 1, 20
  theme: string; // 主题 如 "商业", "科技互联网", "医疗健康", "气象"
  techDomain: string; // 技术领域 如 "数据挖掘", "特征工程", "多模态大模型"

  // 关联文件列表 (对齐详情页-文件)
  files: DatasetFileItem[];

  // 评论列表 (对齐详情页-评论)
  comments: DatasetCommentItem[];

  // 兼容性字段
  industry?: string;
  format?: string;
  scale?: string;
  size?: string;
  rowsCount?: string;
  dataType?: string;
  sampleRows?: any[];
  fields?: { name: string; type: string; desc: string }[];
  lineage?: string[];
  isPrivate?: boolean;
  uploaderType?: 'platform' | 'user'; // 上传者类型
  uploaderName?: string; // 上传者名称
  status?: '已上架' | '已下架' | '待审核' | '已通过' | '已驳回' | '草稿';
  auditReason?: string; // 审核意见
  auditTime?: string; // 审核时间
  brief?: string; // 一句话简介 (限50字)
  modalities?: string[]; // 多选模态
  taskTypes?: string[]; // 多选任务类型
  domains?: string[]; // 多选行业领域
  formats?: string[]; // 多选文件格式
  lastDownloadTime?: string; // 最近一次下载时间
}

// 数据集分类标签项
export interface DatasetTagItem {
  id: string;
  name: string;
  dimension: 'modality' | 'taskType' | 'domain' | 'format';
  count: number; // 关联数据集数量
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// Skill 插件文件节点
export interface SkillFileNode {
  id: string;
  name: string;
  path: string;
  size: string;
  type: 'file' | 'folder';
  language?: 'python' | 'json' | 'yaml' | 'markdown' | 'dockerfile' | 'bash' | 'text';
  content?: string; // 文件内容，用于代码与文本在线预览
  children?: SkillFileNode[];
}

// Skill 插件二级回复
export interface SkillCommentReply {
  id: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  time: string;
  timestamp?: number;
  content: string;
  replyToUser?: string;
  likes: number;
  isLiked?: boolean;
}

// Skill 插件评论
export interface SkillCommentItem {
  id: string;
  userName: string;
  userAvatar: string;
  userRole?: string;
  rating?: number;
  time: string;
  timestamp?: number;
  content: string;
  likes: number;
  isLiked?: boolean;
  images?: string[];
  replies?: SkillCommentReply[];
}

// Skill 插件
export interface SkillPluginItem {
  id: string;
  name: string;
  icon?: string;
  repoPath?: string; // 如 "@user_a38fd8a2/valuation-analysis", "google/live-web-search"
  category: string; // '知识管理' | '办公效率' | '内容创作' | '设计多媒体' | '数据分析' | '开发编程' | '行业专业' | 'AI Agent' | '自动化'
  source?: string; // 'SkillHub' | '官方' | '开源社区'
  isOfficial?: boolean; // 官方认证小蓝盾
  needsApiKey?: boolean; // 需配置 API Key
  apiKeyProvider?: string; // API Key 提供方
  aiRating?: number; // 如 4.3
  aiRatingDesc?: string; // 如 "优秀 (AI 评分)"
  securityStatus?: string; // 如 "安全"
  voteCount?: number; // 投票数
  hasVoted?: boolean;
  
  developer: string;
  developerAvatar?: string;
  developerOrg?: string;
  authorSignature?: string; // 如 "弗兰克斯基 (Franski)"
  uploaderType?: 'platform' | 'user'; // 上传者类型
  uploaderName?: string; // 上传者名称
  isCreatedByMe?: boolean; // 是否当前用户上传/创建
  status?: '已上架' | '已下架' | '待审核' | '已通过' | '已驳回' | '草稿';
  auditReason?: string; // 审核意见
  auditTime?: string; // 审核时间
  version: string;
  updatedAt?: string;
  relativeTime?: string;
  installs: number; // 安装量
  downloadsCount?: number; // 下载量
  viewsCount?: number;
  likesCount?: number;
  favoritesCount?: number;
  isLiked?: boolean;
  isFavorite?: boolean;
  description: string;
  license?: string;
  compatibleAgents: string;
  runtimeEnv?: string; // 如 "Python 3.11+", "Node.js 20+", "Docker Sandbox"
  packageFormat?: string; // 如 "ZIP, Wheel, Git"
  packageSize?: string; // 如 "1.4 MB", "3.2 MB"
  requiredPermissions: string[];
  tags?: string[];
  
  // 详情页 - 概述扩展 (Markdown 格式)
  overviewMarkdown?: string; // 概述 (Markdown 编辑器生成内容)
  copyrightNotice?: string; // 知识产权声明
  licenseTerms?: {
    allowed: string[]; // 允许的项目
    forbidden: string[]; // 禁止的项目
  };
  disclaimer?: string; // 免责声明
  authorBio?: string; // 作者及方法论说明
  dependencies?: {
    name: string;
    purpose: string;
    installCmd: string;
  }[];
  systemArchAscii?: string; // 系统架构 ASCII 示意框图
  coreModules?: {
    name: string;
    functionDesc: string;
    docPath: string;
  }[];
  backgroundDesc?: string;
  featuresDesc?: string[];
  toolDefinitionSchema?: string; // Function Calling JSON Schema
  pythonDecoratorCode?: string; // Python @tool 装饰器代码
  agentIntegrationCode?: string; // Agent 接入示例代码
  
  // 详情页 - 文件树与预览
  files?: SkillFileNode[];
  
  // 详情页 - 评论
  comments?: SkillCommentItem[];
}

// 数据集下载记录
export interface DatasetDownloadRecord {
  id: string;
  datasetId: string;
  datasetName: string;
  uploaderType: 'platform' | 'user';
  uploaderName: string;
  downloadTime: string;
  downloadedAt?: string;
  fileFormat: string;
  fileSize: string;
  downloadCount: number;
  mountPath?: string;
  modalityCategory?: string;
  modality?: string;
  coverImage?: string;
}

// Skill 插件下载记录
export interface SkillDownloadRecord {
  id: string;
  skillId: string;
  skillName: string;
  uploaderType: 'platform' | 'user';
  uploaderName: string;
  developer?: string;
  category: string;
  version: string;
  packageSize: string;
  downloadTime: string;
  downloadedAt?: string;
  downloadCount: number;
  developerAvatar?: string;
}

// 任务大厅规范类型
export type TaskKindType = '接单任务' | '标准任务' | '比稿';
export type TaskCategoryType = '任务';
export type TaskDomainType = '技术开发' | '内容创作' | 'AI模型与数据' | '工具与自动化' | '咨询与培训';
export type TaskDomain = TaskDomainType;
export type TaskDifficultyLevel = '简单' | '中等' | '困难';
export type TaskGlobalStatus = '审核中' | '已驳回' | '已发布' | '进行中' | '已结束' | '已验收';
export type UserTakeStatus = '未接单' | '已接单' | '已提交' | '已验收' | '已驳回';

// 兼容别名
export type TaskType = string;
export type TaskCategory = TaskDomainType | '技术开发' | '数据服务' | '模型训练' | '应用构建' | '方案设计' | '其他';
export type TaskDifficulty = TaskDifficultyLevel | '入门' | '进阶' | '专家' | '大师';
export type TaskStatus = TaskGlobalStatus;

export interface TaskBidItem {
  id: string;
  taskId: string;
  bidderId: string;
  bidderName: string;
  bidderAvatar: string;
  bidderTitle: string;
  bidderScore: number;
  bidAmount: number;
  bidUnit: '¥' | '积分';
  proposal: string;
  deliverDays: number;
  submittedTime: string;
  status: '待审核' | '已中标' | '已谢绝';
}

export interface TaskFileItem {
  id: string;
  name: string;
  size: string;
  url?: string;
}

export interface TaskSubmissionRecord {
  id: string;
  taskId: string;
  username: string;
  userAvatar: string;
  takeTime?: string;
  submitTime: string;
  notes: string;
  files: TaskFileItem[];
  status: '待验收' | '已通过' | '已驳回' | '成果未通过' | '未通过验收';
  rejectReason?: string;
  verifiedTime?: string;
}

export interface TaskTakerRecord {
  id: string;
  taskId: string;
  username: string;
  userAvatar: string;
  takeTime: string;
  status: '已接单' | '已提交' | '已验收' | '已驳回' | '成果未通过' | '未通过验收';
  submissionId?: string;
  submission?: TaskSubmissionRecord;
}

// 推荐平台资源字段定义
export interface RecommendedResources {
  agents?: string[]; // Agent ID 列表，1-3个
  models?: string[]; // Model ID 列表，1-3个
  datasets?: string[]; // Dataset ID 列表，1-3个
  skills?: string[]; // Skill ID 列表，1-3个
  environment?: {
    spec?: string; // 规格 如 '2核CPU / 8GB' | 'NVIDIA RTX4090 / 24GB' 等
    image?: string; // 镜像 如 'Ubuntu 22.04 LTS'
  };
}

export interface TaskItem {
  id: string;
  title: string; // 标题限30字
  taskType?: TaskKindType | string; // 统一为接单任务/标准任务
  maxTakersLimit?: number; // 上限人数（0表示不限）
  brief?: string; // 一句话简述
  domain: TaskDomainType; // 所属领域5选1
  difficulty: TaskDifficultyLevel; // 简单/中等/困难
  recommendedResources?: RecommendedResources; // 推荐平台资源
  
  // 描述与验收标准（富文本）
  description: string; // 富文本HTML/Markdown
  acceptanceCriteria: string; // 富文本HTML/Markdown
  
  // 奖励设置
  cashReward: number; // 现金奖励（元）
  pointsReward: number; // 积分奖励（个）
  totalCashReward?: number; // 兼容总现金
  totalPointsReward?: number; // 兼容总积分
  
  // 交付周期
  startTime: string; // YYYY-MM-DD HH:mm:ss
  endTime: string; // YYYY-MM-DD HH:mm:ss
  deadline?: string; // 兼容字段
  remainingDays?: number; // 剩余天数
  
  // 发布者信息
  publisher: string;
  publisherAvatar: string;
  publishTime: string; // 提交/发布时间
  
  // 任务全局状态
  status: TaskGlobalStatus; // '审核中' | '已驳回' | '已发布' | '进行中' | '已结束' | '已验收'
  isAccepted?: boolean;
  rejectReason?: string; // 审核驳回原因
  auditTime?: string;
  refunded?: boolean; // 到期全部成果驳回后是否已全额退还赏金与积分
  refundTime?: string;
  refundReason?: string;
  refundCash?: number;
  refundPoints?: number;
  
  // 中标获胜者信息
  winner?: {
    username: string;
    userAvatar: string;
    passTime: string;
    notes?: string;
  };
  
  // 统计数据
  acceptedCount: number; // 已接单人数
  submittedCount: number; // 已提交人数
  verifiedCount: number; // 已验收人数 (0 或 1)
  
  // 明细记录
  takers?: TaskTakerRecord[];
  submissions?: TaskSubmissionRecord[];
  
  // 兼容与可选字段
  categoryType?: string;
  taskCount?: number;
  type?: any;
  category?: any;
  bounty?: number;
  bountyUnit?: '¥' | '积分';
  rewardText?: string;
  requiredSkills?: string[];
  bidCount?: number;
  viewCount?: number;
  deliverables?: string;
  attachments?: any;
  escrow?: any;
  bids?: any;
  milestones?: any;
}

// 算力工坊
export type ComputeMode = 'container' | 'server'; // 容器实例 | 云服务器实例

export interface RentalGPUCard {
  id: string;
  title: string;
  availableCards: number;
  hourlyPrice: number;
  dayPrice: number;
  weekPrice: number;
  monthPrice: number;
  topBorderColor: string; // border-t-amber-600等
  gpuModel: string;
  vram: string;
  cpu: string;
  ram: string;
  disk: string;
  
  // 多卡联动支持
  allowedGpuCounts?: number[]; // 可选GPU数量列表，如 [1, 2, 3, 4, 5, 6, 7, 8] 或 [1, 2, 4, 8]
  maxGpuCount?: number; // 最大可选GPU数量
  singleCardCpu?: number; // 单卡CPU核数，如 14 或 16
  singleCardRam?: number; // 单卡内存，如 56 或 60
  singleCardDisk?: number; // 单卡硬盘，如 373 或 750
  perCardCpu?: number; // 单卡CPU核数 (别名)
  perCardRam?: number; // 单卡内存 (别名)
  perCardDisk?: number; // 单卡硬盘 (别名)
  cpuModel?: string; // CPU型号，如 "AMD EPYC 7453"
  rawSpecId?: string;
}

export interface InstanceFileItem {
  name: string;
  size: string;
  isDir: boolean;
  modified: string;
}

export interface InstanceSnapshot {
  id: string;
  name: string;
  description: string;
  size: string;
  createdAt: string;
  gpuModel: string;
}

export interface ImageCommentItem {
  id: string;
  userName: string;
  userAvatar?: string;
  createdAtAgo: string;
  likes: number;
  content: string;
}

export interface MyCustomImage {
  id: string;
  name: string;
  status: 'compressing' | 'ready' | 'failed' | 'available'; // '正在压缩镜像文件' | '已创建' / '可用' / '创建失败'
  size: string; // 如 "20.0 GB" 或 "0 B"
  authorName: string;
  authorAvatar?: string;
  userId?: string;
  userPhone?: string;
  createdAt: string; // 如 "2026-08-19 14:28"
  isPrivate: boolean; // 是否仅自己可见
  tags?: string[];
  description: string; // 镜像详情
  comments: ImageCommentItem[];
  baseImage?: string; // 基础环境
  lastUsedDays?: number; // 距离上次使用天数
  lastUsedTime?: string;
  refCount?: number; // 引用实例数
  isViolating?: boolean; // 是否被标记为违规
}

export interface GPUInstance {
  id: string;
  name: string;
  instanceType?: ComputeMode; // 'container' | 'server'
  scene?: string;
  gpuModel: string;
  gpuCount: number;
  vram: string;
  cpu: string;
  ram: string;
  disk?: string;
  region?: string;
  billingType: string;
  status: 'running' | 'stopped' | 'allocating' | 'starting' | 'creating_image' | 'failed' | 'destroyed';
  isCpuOnly?: boolean;
  
  // 截图列表与费用专有字段
  startTime?: string; // 租用时间 2026-08-19 14:22
  hourlyCost: number; // 元/小时
  totalCost?: number; // 共计费用元
  voucherDeduction?: number; // 积分抵扣元
  remainingHours?: number; // 预计剩余可用小时
  expireTime?: string; // 到期时间
  progressPercent?: number; // 进度百分比，如 39%
  remark?: string; // 备注说明，如 "这里是备注"
  autoReturnOnExpiry?: boolean; // 到期后自动归还实例

  // 存储与网络
  systemDisk?: string;
  dataDisk?: string;
  publicIp?: string;
  osName?: string;
  
  // 连接入口
  ipAddress?: string;
  runningHours?: number;
  createdAt?: string;
  jupyterUrl?: string;
  vncUrl?: string;
  vscodeUrl?: string;
  pycharmUrl?: string;
  sshCommand?: string;
  imageName?: string;

  // 监控与数据
  monitoring?: {
    gpuUsage: number[];
    vramUsage: number[];
    cpuUsage: number[];
    ramUsage: number[];
  };
  fileList?: InstanceFileItem[];
  snapshots?: InstanceSnapshot[];
  securityRules?: { port: string; protocol: string; cidr: string; desc: string }[];
  logs?: { id: string; action: string; time: string; status: string }[];
}

export interface GpuPricing {
  model: string;
  vram: string;
  scenario: string;
  pricePerHour: number;
  discountPrice?: number;
  badge: string;
}

export interface ComputeImageItem {
  id: string;
  name: string;
  category: '官方镜像' | '社区热门' | 'App市场';
  tag: string;
  version: string;
  description: string;
  downloads: number;
  icon: string;
  presetScene: GPUInstance['scene'];
}

// 社区
export type CommunityBoard = 
  | '干货分享' 
  | '求助答疑' 
  | '前沿观察' 
  | '赚钱交流' 
  | '同行交流' 
  | '娱乐灌水'
  | (string & {});

export interface FeedPost {
  id: string;
  title?: string;
  author: string;
  authorAvatar: string;
  authorTag: string;
  content: string;
  images?: string[];
  board: CommunityBoard;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  viewsCount?: number;
  favoritesCount?: number;
  time: string;
  createdAtTimestamp?: number;
  isLiked?: boolean;
  isCollected?: boolean;
  isTop?: boolean;
  isPinned?: boolean; // 是否置顶
  pinnedAt?: string; // 最新置顶时间（ISO字符串）
  isEssential?: boolean; // 是否精华
  status?: '待审核' | '已通过' | '已驳回' | '已锁定' | '已发布';
  rejectReason?: string; // 驳回原因
  tags?: string[];
  commentsList?: {
    id: string;
    author: string;
    avatar: string;
    authorTag?: string;
    content: string;
    time: string;
    likesCount?: number;
    replies?: {
      id: string;
      author: string;
      avatar: string;
      authorTag?: string;
      content: string;
      time: string;
      replyToUser?: string;
      likesCount?: number;
      isLiked?: boolean;
    }[];
  }[];
}

// 社区板块配置项
export interface CommunityBoardItem {
  id: string;
  name: string;
  description: string;
  postCount: number;
  sortWeight: number; // 数值越小越靠前
  status: '已启用' | '已停用';
}

// 社区评论管理项
export interface CommunityCommentItem {
  id: string;
  content: string;
  author: string;
  authorAvatar?: string;
  authorTag?: string;
  postId: string;
  postTitle: string;
  board: CommunityBoard | string;
  likesCount: number;
  time: string;
}

// API Key 管理
export interface ApiKeyItem {
  id: string;
  name: string;
  prefix: string;
  keySecret?: string;
  scope: string; // 'Full Access' | 'Read Only'
  dailyLimit: number;
  usedToday: number;
  totalCalls: number;
  createdAt: string;
  lastUsedAt: string;
  status: 'active' | 'revoked';
}

// API 调用记录
export interface ApiCallLog {
  id: string;
  timestamp: string;
  targetName: string; // Agent / Model 名称
  endpoint: string;
  inputTokens: number;
  outputTokens: number;
  tokensUsed: number;
  cost: number;
  status: '200 OK' | '429 Rate Limit' | '500 Error';
  responseTimeMs: number;
}

// 异步任务记录
export interface AsyncCallTask {
  id: string;
  taskType: '视频生成' | '图像生成' | '模型微调' | '音频合成';
  status: '排队中' | '处理中' | '已完成' | '已失败';
  durationSec: number;
  cost: number;
  createdAt: string;
  outputUrl?: string;
  errorMsg?: string;
}

// 交易订单
export interface OrderItem {
  id: string;
  orderNo: string;
  itemName: string;
  type: 'Agent购买' | '算力充值' | '积分充值';
  amount: number;
  amountUnit: '元' | '积分';
  payMethod: '微信支付' | '支付宝' | '积分扣减';
  payTime: string;
  status: '待支付' | '已支付' | '已取消' | '已退款';
  transactionNo: string;
}

// 积分商城商品
export interface PointStoreItem {
  id: string;
  name: string;
  type: '算力卡' | 'Token包' | '认证考试券' | '实体周边';
  pointsRequired: number;
  stock: number;
  image: string;
  description: string;
}

// 数据集审批申请
export interface DatasetApplication {
  id: string;
  datasetId: string;
  datasetName: string;
  applicantName: string;
  applicantAvatar: string;
  purpose: string;
  applyTime: string;
  status: '待审批' | '已通过' | '已驳回';
}

// 任务协作空间消息
export interface TaskCollaborationMessage {
  id: string;
  senderName: string;
  senderAvatar: string;
  isSelf: boolean;
  content: string;
  image?: string;
  attachmentName?: string;
  attachmentSize?: string;
  time: string;
  versionTag?: string;
}

// 赛事中心类型定义
export type CompetitionStatus = 'all' | 'unstarted' | 'ongoing' | 'ended';

export type CompetitionTypeTag = 
  | 'AI数据科学赛' 
  | 'AI安全挑战赛'
  | 'AIGC生成赛' 
  | 'AI产品创新赛';

export interface MatchTrackItem {
  id: string;
  name: string; // 全称 如 "AI数据科学赛"
  shortName: string; // 简称 如 "数据科学赛"，用于 TAB 名称
  coverImage: string; // 比赛封面小图
  timeRange: string; // 如 "2026-09-01 00:00:00 ~ 2026-10-15 23:59:59"
  typeTag: CompetitionTypeTag;
  description: string; // 赛道介绍
  problemStatement: string; // 赛题说明
  evaluationMetrics: string; // 评估指标
  dataDescription?: string; // 数据说明
  ruleDescription?: string; // 赛规说明
  targetUrl?: string; // 进入比赛的目标跳转 URL
  submissionsCount?: number;
  participantsCount?: number;
  featuredWorks?: {
    id: string;
    title: string;
    author: string;
    avatar: string;
    image: string;
    score?: string;
    description: string;
    likes: number;
  }[];
}

export interface CompetitionItem {
  id: string;
  title: string; // 赛事名称
  organizer: string; // 主办方名称 如 "中国人工智能学会"
  organizerBadge?: string; // 主办方标签 如 "国家一级学会"
  coverImage: string; // 赛事封面图片 (列表卡片用)
  bannerImage: string; // 详情页顶部长条 BANNER 图片
  startTime: string; // 年月日时分秒 如 "2026-08-01 00:00:00"
  endTime: string; // 年月日时分秒 如 "2026-10-31 23:59:59"
  status: 'unstarted' | 'ongoing' | 'ended'; // 状态: 未开始 / 进行中 / 已结束
  typeTags: CompetitionTypeTag[]; // 赛事模式列表
  tags?: string[]; // 自定义赛事技术标签 (如 '机器学习', '二分类', 'NLP')
  viewsCount?: number; // 点击量 / 浏览量
  isInternalOnly?: boolean; // 是否为企业内部专有赛事 (仅限受邀人员)
  
  // 赛事介绍 TAB 固定内容
  introduction: {
    summary: string; // 赛事简介
    schedule: { stage: string; time: string; desc: string }[]; // 赛事流程阶段
    awards: { rank: string; reward: string; quota: string; iconBg?: string }[]; // 奖项设置
    evaluationStandards: string[]; // 评审标准
    organizingCommittee: { role: string; name: string }[]; // 组委会信息
  };

  // 绑定的比赛赛道列表
  tracks: MatchTrackItem[];
}

// 登录设备管理
export interface LoginDeviceItem {
  id: string;
  deviceName: string;
  deviceType?: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os?: string;
  ip: string;
  location: string;
  loginTime?: string;
  lastActiveTime?: string;
  isCurrent: boolean;
}

// 后台管理菜单
export type AdminMenuKey = 
  | 'operations'          // 运营中心
  | 'marketplace_admin'   // AI集市管理
  | 'publish_audit'       // 任务管理 - 发布审核
  | 'task_monitor'        // 任务管理 - 任务监控
  | 'compute_spec'        // 算力管理 - 规格管理
  | 'compute_image'       // 算力工坊 - 镜像管理
  | 'compute_pool'        // 算力工坊 - 资源池管理
  | 'compute_order'       // 算力工坊 - 实例订单管理
  | 'compute_instance'    // 算力工坊 - 运行实例监控
  | 'compute_stat'        // 算力工坊 - 资源使用统计
  | 'compute_settlement'  // 算力工坊 - 对账结算
  | 'compute_admin'       // 算力管理（兼容主入口）
  | 'competition_admin'   // 赛事管理
  | 'system_admin'        // 系统管理
  | 'agent_list'          // Agent管理 - 列表及配置
  | 'agent_calls'         // Agent管理 - Agent调用记录
  | 'agent_stats'         // Agent管理 - 用量统计
  | 'dataset_list'        // 数据集管理 - 数据集列表及配置
  | 'dataset_audit'       // 数据集管理 - 数据集审核
  | 'dataset_stats'       // 数据集管理 - 数据集使用统计
  | 'model_list'          // 模型管理 - 模型管理与计费配置
  | 'model_calls'         // 模型管理 - 模型调用记录
  | 'model_stats'         // 模型管理 - 模型使用统计
  | 'skill_list'          // Skill管理 - 列表及配置
  | 'skill_audit'          // Skill管理 - Skill审核
  | 'community_audit'      // 社区管理 - 发帖审核
  | 'community_post'       // 社区管理 - 帖子管理
  | 'community_comment'    // 社区管理 - 评论管理
  | 'community_stats';     // 社区管理 - 数据统计

export interface AgentOrderItem {
  id: string; // 订单号 (系统生成)
  userName: string; // 下单用户
  userAvatar?: string;
  agentId: string;
  agentName: string;
  orderType: '免费试用包' | 'Token充值包' | '按Token计费' | '企业Token包' | '免费领取' | '按Token订阅' | string;
  orderAmount: number; // 实付金额
  tokenAmount: number; // 包含的Token数 (万Token)
  status: '已生效' | '已用完' | '已过期';
  createdAt: string;
  payTime: string;
  startTime: string;
  expireTime: string;
  usedTokens: number;
}

// ==========================================
// 算力工坊后台管理类型定义
// ==========================================

// 1. 实例规格
export interface ComputeSpecItem {
  id: string;
  name: string; // 规格名称如 "RTX 4090 标准版" (限30字)
  gpuModel: string; // GPU型号 如 "NVIDIA RTX 4090"
  allowedGpuCounts: number[]; // 可选GPU数量 (多选，如 [1, 2, 4, 8] 或 [1, 2, 3, 4, 5, 6, 7, 8])
  maxGpuCount?: number; // 最大可选GPU数量
  vram: string; // 显存 如 "24 GB"
  vramValue?: number; // 24
  vramUnit?: 'GB' | 'TB';
  cpu: number; // 单卡CPU核数 如 16
  cpuModel?: string; // CPU型号 如 "AMD EPYC 9354"
  ram: number; // 单卡内存大小 如 60 (GB)
  ramUnit?: 'GB' | 'TB';
  disk: number; // 单卡硬盘大小 如 750 (GB)
  diskUnit?: 'GB' | 'TB';
  description?: string; // 规格描述，限200字符

  // 关联配置 (支持多选)
  linkedImageIds?: string[]; // 关联镜像ID列表
  linkedOperators?: string[]; // 关联运营商资源池名称列表

  // 定价策略
  hourlyPrice: number; // 按量价格 (元/小时，必填)
  dayPrice?: number; // 日租价格 (元/天，选填，留空不支持)
  weekPrice?: number; // 周租价格 (元/周，选填，留空不支持)
  monthPrice?: number; // 月租价格 (元/月，选填，留空不支持)

  // 上架状态
  status: '上架' | '下架'; // 控制前台算力工坊是否可见

  // 使用统计
  totalUsedCount: number; // 累计被用户创建实例的总次数
  recent7DaysCount?: number; // 近7天使用次数

  // 时间戳
  createTime: string;
  updateTime: string;

  // 兼容老字段
  stock?: number; // 可用库存 (台)
  totalStock?: number; // 总库存 (台)
  operator?: string; // 主运营商
  tags?: string[];
  features?: string[];
}

// 2. 镜像分类与管理
export type ComputeImageCategory = 
  | 'PyTorch' 
  | 'TensorFlow' 
  | 'Jupyter' 
  | 'ComfyUI' 
  | 'vLLM' 
  | '大模型' 
  | '其他';

export interface ComputeImageAdminItem {
  id: string;
  name: string; // 运维人员识别用的名称，如 "PyTorch 2.2.2 - CUDA 12.1"
  registryUrl: string; // 完整镜像仓库地址，如 "docker.io/pytorch/pytorch:2.2.2-cuda12.1"
  category: ComputeImageCategory; // 镜像分类
  description?: string; // 镜像描述，限200字符
  size?: string; // 镜像大小，如 "15.3 GB"
  version?: string; // 版本号，如 "v2.2.2"
  changelog?: string; // 更新说明，本次新增或更新的内容说明
  status: '已启用' | '已停用' | '上架' | '下架'; // 启用/停用，停用后创建实例时不可选
  refCount: number; // 被引用次数，当前正在使用该镜像的实例数量
  createdAt: string; // 创建时间
  updatedAt: string; // 最后更新时间
  // 历史兼容字段
  type?: '官方' | '社区' | 'App市场';
  baseOs?: string;
  preinstalled?: string;
  maintainer?: string;
  downloads?: number;
  cudaVersion?: string;
  defaultPort?: number;
  updateTime?: string;
  createTime?: string;
}

// 3. 资源池
export interface GpuDistributionItem {
  gpuModel: string;
  total: number;
  allocated: number;
  available: number;
  rate: number; // 百分比
}

export interface ResourcePoolLogItem {
  id: string;
  time: string;
  operator: string;
  action: string;
  result: '成功' | '失败';
  detail?: string;
}

export interface ComputePoolItem {
  id: string;
  name: string; // "电信云-华东1"
  operator: string; // "中国电信"
  region: string; // "上海"
  remark?: string; // 备注

  // 连接配置
  apiUrl?: string; // 接入地址
  authType?: 'API Key' | '用户名密码';
  authCredential?: string; // 对应Key或Token
  timeoutSeconds?: number; // 超时时间（秒，默认30）

  // 状态双维度
  saleStatus?: '已上架' | '已下架'; // 人工控制，默认已上架
  runStatus?: '正常' | '异常' | '维护中' | '已断开'; // 系统自动判断

  lastSyncTime?: string;
  nextSyncTime?: string;

  distribution: GpuDistributionItem[];
  logs?: ResourcePoolLogItem[];

  // 协议价格配置（平台与运营商结算协议单价）
  agreedPricings?: {
    gpuModel: string;
    agreedPrice: number; // 元/卡时
    effectiveDate: string; // 生效日期 YYYY-MM-DD
  }[];

  gpuTypes?: string[]; // ["RTX 4090", "A100", "RTX 3060"]
  supportedSpecIds?: string[]; // 支持的规格ID列表
  supportedSpecNames?: string[]; // 支持的规格名称列表
  totalCapacity?: number; // 100 卡
  allocatedCount?: number; // 67 卡
  availableCount?: number; // 33 卡
  utilizationRate?: number; // 67%
  status?: '正常' | '告警' | '维护中' | '异常' | string;
  hourlyTrend?: { time: string; rate: number; created: number; released: number }[];
  alertThreshold?: number; // 告警阈值 (默认85%)
  totalNodes?: number;
  totalGpus?: number;
  usedGpus?: number;
  freeGpus?: number;
  networkArch?: string;
  clusterPowerUsage?: string;
}

// 4. 实例订单
export type ComputeOrderStatus = '待支付' | '已支付' | '分配中' | '运行中' | '已停止' | '已释放' | '创建失败' | '异常';

export interface ComputeOrderBillingLog {
  id: string;
  time: string;
  type: '预扣冻结' | '按量扣费' | '包周期抵扣' | '存储保全费' | '计费变更调整' | '退款返还';
  amount: number; // 正数为扣费，负数为退费
  balanceAfter: number;
  note: string;
}

export interface ComputeOrderBillingChange {
  id: string;
  changeTime: string;
  oldBillingType: string;
  newBillingType: string;
  operator: string;
  reason: string;
  adjustedAmount?: number;
}

export interface ComputeOrderStatusTimeline {
  time: string;
  status: string;
  title: string;
  description: string;
  operator?: string;
}

export interface ComputeOrderItem {
  id: string;
  orderNo?: string; // "INST-20260815-001"
  userId: string;
  userName: string;
  userAvatar?: string;
  userPhone?: string;
  specName: string; // "RTX 4090 (单卡)"
  specDetail?: string; // "24GB显存 / 16核 / 60GB内存 / 750GB硬盘"
  gpuModel?: string; // "NVIDIA RTX 4090"
  gpuCount?: number; // 1
  imageName: string; // "PyTorch 2.3.1 + CUDA 12.1"
  billingType: '按量' | '日租' | '周租' | '月租' | '按量计费' | '包日' | '包周' | '包月' | string;
  unitPrice?: number; // 单价，如 1.88 元/时 或 42.00 元/天
  unitPriceLabel?: string; // "¥1.88 / 小时"
  orderAmount?: number; // 预付/冻结金额
  pendingAmount?: number; // 待结算金额
  currentCost?: number; // 累计费用
  totalCost: number; // 实际累计结算/扣款总额
  refundAmount?: number; // 已退款金额
  status: ComputeOrderStatus | string;
  createTime?: string;
  createdAt: string;
  payTime?: string; // 支付时间
  startTime?: string; // 实例启动就绪时间
  stopTime?: string; // 关机停止时间
  releaseTime?: string; // 彻底释放时间
  runningHours?: string | number; // "14小时20分钟" 或 14.5
  runningDuration?: string; // "2小时15分钟"
  operator: string; // 资源池或运营商 "电信云-华东1 (临港集群)"
  poolId?: string;
  instanceId?: string;
  errorMessage?: string;
  refundLogs?: {
    id: string;
    time: string;
    amount: number;
    reason: string;
    operator: string;
    status: '已退款' | '处理中' | '已拒绝';
  }[];
  billingLogs?: ComputeOrderBillingLog[];
  billingChanges?: ComputeOrderBillingChange[];
  timeline?: ComputeOrderStatusTimeline[];
}

// 5. 运行实例监控
export interface ComputeInstanceMetricPoint {
  time: string;
  gpu: number;
  vram: number;
  cpu: number;
  ram: number;
  temp: number;
  power: number;
}

export interface ComputeRunningInstanceItem {
  id: string;
  instanceId: string; // "i-abc123xyz"
  orderId?: string; // 关联订单ID "INST-20260818-001"
  userId: string;
  userName: string;
  userAvatar?: string;
  userPhone?: string;
  specName: string;
  gpuSpec?: string; // "RTX 4090 · 24GB"
  gpuModel?: string; // "NVIDIA RTX 4090"
  gpuCount?: number; // 1
  cpuCores?: number; // 16
  ramGb?: number; // 60
  diskGb?: number; // 750
  imageName: string;
  imageId?: string;
  operator: string; // 运营商
  poolId?: string;
  hostNode: string; // 物理节点 "node-gpu-sh-05"
  ipAddress?: string; // "10.0.1.123"
  publicIp?: string; // "123.57.190.22"
  createdAt: string;
  startTime?: string;
  stoppedAt?: string;
  runningHours?: string | number;
  runningDuration?: string; // "2小时15分钟"
  gpuUsage?: number; // 78%
  gpuUtil?: number; // 78%
  vramUsage?: number; // 65%
  vramUsed?: string; // "16.3GB"
  vramTotal?: string; // "24.0GB"
  ramUsage?: number; // 45%
  ramUsed?: string; // "27.0GB / 60GB"
  cpuUtil?: number; // 52%
  diskUsage?: number; // 28%
  temp?: number; // 64 °C
  power?: string; // "320W / 450W"
  health?: '良好' | '高载' | '告警' | '故障' | string;
  gpuUsageHistory?: number[];
  vramUsageHistory?: number[];
  metricHistory?: ComputeInstanceMetricPoint[];
  sshCommand?: string; // "ssh root@10.0.1.123 -p 22022"
  jupyterUrl?: string; // "http://10.0.1.123:8888"
  status?: '运行中' | '已停止' | '已关机' | '调度中' | '异常' | string;
  logs?: { time: string; level: 'INFO' | 'WARN' | 'ERROR'; message: string; source?: string }[];
}

// 6. 结算明细
export interface SettlementSpecDetail {
  gpuModel: string;
  hours: number;
  agreedPrice: number; // 协议单价
  subtotal: number;
  percentage: number;
}

export interface ComputeSettlementItem {
  id: string;
  statementNo?: string; // 对账单编号，如 "ST-202608-001"
  operator: string; // "中国电信天翼云"
  period: string; // "2026年8月"
  totalCardHours: number; // 1240 卡时
  specDetails: SettlementSpecDetail[];
  agreedPrice: number; // 加权协议单价
  payableAmount: number; // 应付金额 (需支付给运营商)
  platformRevenue: number; // 平台收入 (该周期从用户收到的已结算费用)
  platformGrossProfit: number; // 平台毛利 (平台收入 - 应付金额)
  grossMargin: number; // 毛利率 (平台毛利 / 平台收入 × 100%)
  status: '待对账' | '已确认' | '已结算';
  invoiceNo?: string;
  paymentVoucher?: string;
  paymentMethod?: string;
  confirmedAt?: string;
  confirmedBy?: string;
  settledAt?: string;
  paidBy?: string;
  createdAt: string;
  remark?: string;
}

// 7. 资源使用统计详细明细类型
export interface ComputeUserUsageDetail {
  userId: string;
  userName: string;
  userAvatar?: string;
  phone?: string;
  userPhone?: string;
  organization?: string;
  company?: string;
  totalCost: number; // 累计消费金额
  totalSpent?: number;
  totalHours: number; // 使用总时长(卡时)
  instanceCount: number; // 累计实例数
  orderCount?: number; // 订单数
  runningCount: number; // 当前在线运行实例数
  runningInstanceCount?: number;
  primarySpec?: string; // 偏好 GPU 型号
  lastActiveAt?: string; // 最后活跃时间
  lastUsedTime?: string;
}

export interface ComputeSpecUsageDetail {
  specId: string;
  specName: string;
  gpuModel: string;
  memory?: string;
  unitPrice: number;
  totalInstances: number; // 总实例数
  runningInstances: number; // 当前运行中实例数
  totalHours: number; // 总运行时长(卡时)
  totalCardHours?: number;
  totalRevenue: number; // 总消费金额
  utilizationRate: number; // 平均利用率
}

export interface ComputeStatsData {
  totalInstances: number;
  runningInstances: number;
  avgGpuUtilization: number;
  monthlyRevenue: number;
  dailyTrend: { date: string; revenue: number; orders: number }[];
  instanceTrends: { date: string; createdCount: number; activeCount: number }[];
  utilizationTrends: { time: string; rate: number }[];
  specDistribution: { name: string; specName: string; count: number; value: number; percentage: number; color: string }[];
  operatorContribution: { name: string; cards: number; share: number; totalCards: number; allocatedCards: number; rate: number }[];
  topUsers: { rank: number; name: string; userId: string; userName: string; company: string; cardHours: number; totalHours: number; totalSpent: number; totalCost: number; instanceCount: number }[];
  billingTypeDistribution?: { pay_as_you_go: number; daily: number; weekly: number; monthly: number };
  userDetails?: ComputeUserUsageDetail[];
  specUsageDetails?: ComputeSpecUsageDetail[];
  refreshMeta?: {
    lastRefreshed?: string;
    gpuUtilFreq?: string;
    runningInstFreq?: string;
    revenueFreq?: string;
    trendFreq?: string;
    userRankFreq?: string;
    operatorFreq?: string;
    instances?: string;
    users?: string;
    revenue?: string;
  };
}

export interface CourseChapterItem {
  id: string;
  title: string;
  duration: string;
  notebookPreset?: string;
}

export interface CourseItem {
  id: string;
  title: string;
  cover: string;
  description: string;
  category: string;
  level?: string;
  duration?: string;
  lessonsCount?: number;
  chaptersCount?: number;
  studentCount?: number;
  studentsCount?: number;
  instructor?: string;
  instructorTitle?: string;
  author?: {
    name: string;
    avatar: string;
    title: string;
  };
  rating: number;
  tags?: string[];
  hasCert?: boolean;
  chapters?: CourseChapterItem[];
}

export interface LearningPathItem {
  id: string;
  title: string;
  description: string;
  stepsCount?: number;
  stepCount?: number;
  estimatedHours?: number;
  difficulty?: string;
  courses?: string[];
  badgeName?: string;
  targetRole?: string;
}

export interface UserPostItem {
  id: string;
  title: string;
  content: string;
  board: string;
  status: 'published' | 'reviewing' | 'rejected';
  statusLabel: string;
  likesCount: number;
  commentsCount: number;
  collectsCount: number;
  createdAt: string;
  rejectReason?: string;
}

export interface UserCommentItem {
  id: string;
  content: string;
  postTitle: string;
  postId: string;
  board: string;
  likesCount: number;
  createdAt: string;
}

export interface UserFavoriteItem {
  id: string;
  postId: string;
  postTitle: string;
  authorName: string;
  authorAvatar: string;
  board: string;
  collectedAt: string;
  likesCount: number;
  commentsCount: number;
}

