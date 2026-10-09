import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  MainTabType, 
  MarketplaceSubTab, 
  WorkspaceSubTab, 
  UserProfile, 
  AgentItem, 
  AgentSubscriptionItem,
  ModelItem, 
  ModelCallRecord,
  ModelUserConsumption,
  DatasetItem, 
  SkillPluginItem,
  TaskItem, 
  CourseItem, 
  GPUInstance, 
  RentalGPUCard,
  FeedPost, 
  AppNotification, 
  OnboardingTask,
  PointRecord,
  ApiKeyItem,
  CompetitionItem,
  AdminMenuKey,
  ComputeSpecItem,
  ComputeImageAdminItem,
  ComputePoolItem,
  ComputeOrderItem,
  ComputeRunningInstanceItem,
  ComputeSettlementItem,
  MyCustomImage,
  DatasetDownloadRecord,
  SkillDownloadRecord,
  CommunityBoardItem
} from '../types';
import { validateTextOnlyComment } from '../utils/commentValidator';
import { 
  initialUserProfile, 
  initialOnboardingTasks, 
  initialNotifications, 
  mockAgents, 
  mockModels, 
  mockDatasets, 
  mockSkills,
  mockCourses, 
  mockGpuInstances, 
  mockMyCustomImages,
  mockFeedPosts, 
  mockApiKeys, 
  mockPointRecords, 
  mockCompetitions 
} from '../data/mockData';
import { 
  initialAdminModels, 
  initialModelCallRecords, 
  initialUserConsumptions 
} from '../data/mockModelData';
import { mockRichTasks } from '../data/mockTasksData';
import {
  mockComputeSpecs,
  mockComputeImages,
  mockComputePools,
  mockComputeOrders,
  mockRunningInstances,
  mockComputeSettlements,
  mockComputeStats
} from '../data/mockComputeAdminData';

interface AppContextType {
  // Navigation State
  activeTab: MainTabType;
  setActiveTab: (tab: MainTabType) => void;
  setSelectedMainTab: (tab: MainTabType) => void;
  tabResetKey: Record<MainTabType, number>;
  marketplaceTab: MarketplaceSubTab;
  setMarketplaceTab: (tab: MarketplaceSubTab) => void;
  workspaceSubTab: WorkspaceSubTab;
  setWorkspaceSubTab: (sub: WorkspaceSubTab) => void;
  workspaceCommunitySubTab: 'posts' | 'comments' | 'favorites';
  setWorkspaceCommunitySubTab: (sub: 'posts' | 'comments' | 'favorites') => void;

  // Backend Admin System State
  isAdminMode: boolean;
  setIsAdminMode: (admin: boolean) => void;
  activeAdminMenu: AdminMenuKey;
  setActiveAdminMenu: (menu: AdminMenuKey) => void;
  enterAdminMode: (defaultMenu?: AdminMenuKey) => void;
  exitAdminMode: () => void;

  // Search & Global Modals
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Active User State
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  checkInToday: () => void;
  hasCheckedInToday: boolean;
  pointRecords: PointRecord[];
  onboardingTasks: OnboardingTask[];
  completeOnboardingTask: (taskId: string) => void;

  // Notifications
  notifications: AppNotification[];
  unreadCount: number;
  markAllNotificationsRead: () => void;
  markNotificationAsRead: (id: string) => void;
  markNotificationsAsRead: (ids: string[]) => void;

  // Data Collections
  agents: AgentItem[];
  setAgents: React.Dispatch<React.SetStateAction<AgentItem[]>>;
  userAgents: AgentItem[];
  datasets: DatasetItem[];
  skills: SkillPluginItem[];
  setSkills: React.Dispatch<React.SetStateAction<SkillPluginItem[]>>;
  favorites: AgentItem[];
  toggleFavoriteAgent: (agentId: string) => void;
  tasks: TaskItem[];
  setTasks: React.Dispatch<React.SetStateAction<TaskItem[]>>;
  courses: CourseItem[];
  gpuInstances: GPUInstance[];
  posts: FeedPost[];
  apiKeys: ApiKeyItem[];
  createApiKey: (nameOrItem: string | Omit<ApiKeyItem, 'id'>, scope?: string, limit?: number) => void;
  revokeApiKey: (id: string) => void;

  // Modal Triggers & Selection State
  openModal: (modalType: string) => void;
  sandboxAgent: AgentItem | null;
  setSandboxAgent: (agent: AgentItem | null) => void;
  detailModalAgent: AgentItem | null;
  setDetailModalAgent: React.Dispatch<React.SetStateAction<AgentItem | null>>;
  subscribeModalAgent: AgentItem | null;
  setSubscribeModalAgent: React.Dispatch<React.SetStateAction<AgentItem | null>>;
  quotaModalAgent: AgentItem | null;
  setQuotaModalAgent: React.Dispatch<React.SetStateAction<AgentItem | null>>;
  trialCountLeft: number;
  setTrialCountLeft: React.Dispatch<React.SetStateAction<number>>;
  subscriptions: Record<string, AgentSubscriptionItem>;
  setSubscriptions: React.Dispatch<React.SetStateAction<Record<string, AgentSubscriptionItem>>>;
  payPerTokenAgents: Record<string, boolean>;
  setPayPerTokenAgents: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
  openAgentDetail: (agent: AgentItem) => void;
  openAgentSubscribe: (agent: AgentItem) => void;
  tryoutModel: ModelItem | null;
  setTryoutModel: (model: ModelItem | null) => void;
  detailModel: ModelItem | null;
  setDetailModel: React.Dispatch<React.SetStateAction<ModelItem | null>>;
  openModelDetail: (model: ModelItem) => void;
  detailDataset: DatasetItem | null;
  setDetailDataset: React.Dispatch<React.SetStateAction<DatasetItem | null>>;
  openDatasetDetail: (dataset: DatasetItem) => void;
  detailSkill: SkillPluginItem | null;
  setDetailSkill: React.Dispatch<React.SetStateAction<SkillPluginItem | null>>;
  openSkillDetail: (skill: SkillPluginItem) => void;
  selectedCompareModels: ModelItem[];
  toggleCompareModel: (model: ModelItem) => void;
  clearCompareModels: () => void;

  // Model Management Admin Operations
  models: ModelItem[];
  setModels: React.Dispatch<React.SetStateAction<ModelItem[]>>;
  addModel: (model: Partial<ModelItem>) => void;
  updateModel: (id: string, updates: Partial<ModelItem>) => void;
  deleteModel: (id: string) => boolean;
  toggleModelStatus: (id: string, status?: '已上架' | '已下架' | '草稿') => void;
  modelCallRecords: ModelCallRecord[];
  addModelCallRecord: (record: Partial<ModelCallRecord>) => void;
  modelUserConsumptions: ModelUserConsumption[];

  // Competitions
  competitions: CompetitionItem[];
  selectedCompetitionId: string | null;
  setSelectedCompetitionId: (id: string | null) => void;
  openCompetitionDetail: (compId: string) => void;

  // Action Modals & Task Flow
  createAgentModalOpen: boolean;
  setCreateAgentModalOpen: (open: boolean) => void;
  publishTaskModalOpen: boolean;
  setPublishTaskModalOpen: (open: boolean) => void;
  createComputeModalOpen: boolean;
  setCreateComputeModalOpen: (open: boolean) => void;
  createComputePreset: { mode?: 'container' | 'server'; scene?: GPUInstance['scene']; imageName?: string; card?: RentalGPUCard } | null;
  setCreateComputePreset: (preset: { mode?: 'container' | 'server'; scene?: GPUInstance['scene']; imageName?: string; card?: RentalGPUCard } | null) => void;
  detailInstance: GPUInstance | null;
  setDetailInstance: (inst: GPUInstance | null) => void;
  historyModalOpen: boolean;
  setHistoryModalOpen: (open: boolean) => void;
  
  // 任务导航跳转
  selectedTaskIdForDetail: string | null;
  setSelectedTaskIdForDetail: (id: string | null) => void;
  selectedTaskForVerification: TaskItem | null;
  setSelectedTaskForVerification: (task: TaskItem | null) => void;

  // 社区帖子跳转与来源追踪（从哪儿点开就返回哪儿）
  selectedPostIdForDetail: string | null;
  setSelectedPostIdForDetail: (id: string | null) => void;
  selectedPostDetailOrigin: string | null;
  setSelectedPostDetailOrigin: (origin: string | null) => void;
  openPostDetailWithOrigin: (postId: string, origin?: string) => void;

  // 充值中心弹窗
  rechargeModalOpen: boolean;
  setRechargeModalOpen: (open: boolean) => void;
  openRechargeModal: (defaultAmount?: number) => void;

  // 我租用的实例与我的镜像
  myCustomImages: MyCustomImage[];
  deleteMyCustomImage: (id: string) => void;
  forceDeleteUserCustomImage: (id: string, reason?: string) => void;
  addMyCustomImageComment: (imageId: string, commentText: string) => void;
  updateMyCustomImageDescription: (imageId: string, desc: string) => void;
  userImageQuota: number;
  setUserImageQuota: (quota: number) => void;
  userImageAutoCleanupDays: number;
  setUserImageAutoCleanupDays: (days: number) => void;

  // Interactive Operations
  addAgent: (agent: Omit<AgentItem, 'id' | 'rating' | 'ratingCount' | 'usageCount' | 'createdAt'>) => void;
  purchaseAgent: (agentId: string) => void;
  addTask: (task: any) => void;
  auditTask: (taskId: string, approved: boolean, remark?: string) => void;
  withdrawTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  takeTask: (taskId: string) => void;
  submitTaskResult: (taskId: string, notes: string, files: { name: string; size: string }[]) => void;
  verifyTaskSubmission: (taskId: string, submissionId: string, approved: boolean, rejectReason?: string) => void;
  rejectAllAndRefund: (taskId: string, reason?: string) => void;
  updateTask: (task: TaskItem) => void;
  adminUpdateTask: (id: string, updates: Partial<TaskItem>) => void;
  submitTaskBid: (taskId: string, proposal: string, quoteAmount: number, estimatedDays: number, attachments?: string[]) => void;
  submitTaskDeliverable: (taskId: string, fileName: string, fileSize: string, summary: string, demoUrl?: string) => void;
  acceptTaskSubmission: (taskId: string, submissionId: string, comment?: string) => void;
  rejectTaskSubmission: (taskId: string, submissionId: string, comment: string) => void;
  launchGpuInstance: (scene: GPUInstance['scene'], gpuModel: string, imageName: string, customOpts?: Partial<GPUInstance>) => void;
  updateInstanceRemark: (instId: string, remark: string) => void;
  changeInstanceRentalDuration: (instId: string, durationType: string, autoReturn: boolean) => void;
  createImageFromInstance: (instId: string, autoShutdown: boolean, overwrite: boolean) => void;
  toggleGpuInstanceStatus: (id: string) => void;
  restartGpuInstance: (id: string) => void;
  deleteGpuInstance: (id: string) => void;
  createPost: (content: string, board: FeedPost['board'], images?: string[], title?: string, tags?: string[]) => void;
  likePost: (postId: string) => void;
  setPosts: React.Dispatch<React.SetStateAction<FeedPost[]>>;

  // 社区板块与互动管理
  communityBoards: CommunityBoardItem[];
  setCommunityBoards: React.Dispatch<React.SetStateAction<CommunityBoardItem[]>>;
  addCommunityBoard: (board: Omit<CommunityBoardItem, 'id' | 'postCount'>) => void;
  updateCommunityBoard: (id: string, updates: Partial<CommunityBoardItem>) => void;
  toggleCommunityBoardStatus: (id: string) => void;
  deleteCommunityBoard: (id: string) => boolean;

  // 帖子操作与防刷
  updatePost: (id: string, updates: Partial<FeedPost>) => void;
  deletePost: (id: string) => void;
  togglePinPost: (id: string) => void;
  toggleEssentialPost: (id: string) => void;
  recordPostView: (postId: string) => void;
  hasUserViewedPost: (postId: string) => boolean;

  // Toast System
  toast: string | null;
  showToast: (msg: string) => void;

  // 算力工坊后台管理
  computeSpecs: ComputeSpecItem[];
  addComputeSpec: (spec: Omit<ComputeSpecItem, 'id' | 'createTime' | 'updateTime'>) => boolean;
  updateComputeSpec: (id: string, updates: Partial<ComputeSpecItem>) => void;
  deleteComputeSpec: (id: string) => boolean;
  toggleComputeSpecStatus: (id: string, status: '上架' | '下架') => void;

  computeImages: ComputeImageAdminItem[];
  addComputeImage: (image: Omit<ComputeImageAdminItem, 'id' | 'updateTime'>) => void;
  updateComputeImage: (id: string, updates: Partial<ComputeImageAdminItem>) => void;
  deleteComputeImage: (id: string) => void;
  toggleComputeImageStatus: (id: string, status: '上架' | '下架') => void;

  computePools: ComputePoolItem[];
  addComputePool: (pool: Partial<ComputePoolItem>) => void;
  updateComputePool: (id: string, updates: Partial<ComputePoolItem>) => void;
  deleteComputePool: (id: string) => void;
  syncComputePoolStatus: (poolId: string) => void;
  setComputePoolAlertThreshold: (poolId: string, threshold: number) => void;
  toggleComputePoolMaintenance: (poolId: string) => void;

  computeOrders: ComputeOrderItem[];
  focusedComputeOrderId: string | null;
  setFocusedComputeOrderId: (id: string | null) => void;
  navigateToComputeOrder: (orderId: string) => void;
  stopComputeOrder: (orderId: string) => void;
  releaseComputeOrder: (orderId: string) => void;
  retryComputeOrder: (orderId: string) => void;
  refundComputeOrder: (orderId: string, refundAmount: number, reason: string) => void;
  changeComputeOrderBilling: (orderId: string, newBillingType: string, reason: string) => void;

  computeRunningInstances: ComputeRunningInstanceItem[];
  focusedComputeInstanceId: string | null;
  setFocusedComputeInstanceId: (id: string | null) => void;
  navigateToComputeInstance: (instanceId: string) => void;
  restartComputeRunningInstance: (id: string) => void;
  stopComputeRunningInstance: (id: string) => void;
  releaseComputeRunningInstance: (id: string) => void;

  computeSettlements: ComputeSettlementItem[];
  confirmComputeSettlement: (id: string) => void;
  markComputeSettlementPaid: (id: string, invoiceNo?: string, paymentVoucher?: string, paymentMethod?: string, remark?: string) => void;
  generateComputeSettlement: (operator: string, period: string) => void;

  // 数据集管理与集市交互
  addDataset: (dataset: Partial<DatasetItem>) => void;
  updateDataset: (id: string, updates: Partial<DatasetItem>) => void;
  deleteDataset: (id: string) => boolean;
  toggleDatasetStatus: (id: string, status: '已上架' | '已下架' | '草稿') => void;
  datasetTagDimensions: { modality: string[]; taskType: string[]; domain: string[]; format: string[] };
  addDatasetTag: (dimension: 'modality' | 'taskType' | 'domain' | 'format', tag: string) => boolean;
  updateDatasetTag: (dimension: 'modality' | 'taskType' | 'domain' | 'format', oldTag: string, newTag: string) => boolean;
  deleteDatasetTag: (dimension: 'modality' | 'taskType' | 'domain' | 'format', tag: string) => boolean;
  reorderDatasetTags: (dimension: 'modality' | 'taskType' | 'domain' | 'format', startIndex: number, endIndex: number) => void;
  
  // 数据集与Skill下载记录及前台提交审核工作流
  datasetDownloads: DatasetDownloadRecord[];
  setDatasetDownloads: React.Dispatch<React.SetStateAction<DatasetDownloadRecord[]>>;
  skillDownloads: SkillDownloadRecord[];
  setSkillDownloads: React.Dispatch<React.SetStateAction<SkillDownloadRecord[]>>;
  downloadDataset: (dataset: DatasetItem) => void;
  downloadSkill: (skill: SkillPluginItem) => void;
  submitDatasetForApproval: (dataset: Partial<DatasetItem>) => void;
  submitSkillForApproval: (skill: Partial<SkillPluginItem>) => void;
  auditDataset: (id: string, action: 'pass' | 'reject', reason?: string) => void;
  publishDataset: (id: string) => void;
  auditSkill: (id: string, action: 'pass' | 'reject', reason?: string) => void;
  publishSkill: (id: string) => void;
  deleteSkill: (id: string) => void;
  updateSkill: (id: string, updates: Partial<SkillPluginItem>) => void;
  toggleSkillStatus: (id: string, nextStatus?: '已上架' | '已下架' | '待审核' | '已通过' | '已驳回' | '草稿') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<MainTabType>('home');
  const [marketplaceTab, setMarketplaceTab] = useState<MarketplaceSubTab>('agent');
  const [workspaceSubTab, setWorkspaceSubTab] = useState<WorkspaceSubTab>('points');
  const [workspaceCommunitySubTab, setWorkspaceCommunitySubTab] = useState<'posts' | 'comments' | 'favorites'>('posts');

  const [searchOpen, setSearchOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [user, setUser] = useState<UserProfile>(initialUserProfile);
  const [hasCheckedInToday, setHasCheckedInToday] = useState<boolean>(false);
  const [pointRecords, setPointRecords] = useState<PointRecord[]>(mockPointRecords);
  const [onboardingTasks, setOnboardingTasks] = useState<OnboardingTask[]>(initialOnboardingTasks);

  const [notifications, setNotifications] = useState<AppNotification[]>(() => 
    initialNotifications.filter(n => 
      n.category !== ('system' as any) && 
      n.type !== ('system' as any) &&
      !n.title.includes('关注者') &&
      !n.title.includes('@了您') &&
      n.id !== 'n_comm_04' &&
      n.id !== 'n_comm_05'
    )
  );
  
  const INITIAL_PURCHASED_IDS = [
    'ag_22',
    'ag_new_01',
    'ag_new_02',
    'ag_new_03',
    'ag_new_04',
    'ag_new_08',
    'ag_new_09',
    'ag_new_10'
  ];

  const [agents, setAgents] = useState<AgentItem[]>(() => 
    mockAgents.map(a => {
      const origForm = (a.techForm || a.appType || 'Agent') as string;
      const mappedForm = origForm === 'Chatflow' ? '对话流' : origForm === 'Workflow' ? '工作流' : (origForm || 'Agent');
      
      // Normalize scene
      let sceneVal = a.scene;
      if (!sceneVal) {
        if (a.category === 'coding') sceneVal = '编程开发';
        else if (a.category === 'data') sceneVal = '数据分析';
        else if (a.category === 'image') sceneVal = '内容创作';
        else if (a.category === 'dialogue') sceneVal = '办公助理';
        else sceneVal = '内容创作';
      }
      
      // Normalize industry
      const industryVal = a.industry || '通用';

      return {
        ...a,
        isPurchased: a.isPurchased || INITIAL_PURCHASED_IDS.includes(a.id),
        techForm: mappedForm as any,
        scene: sceneVal as any,
        industry: industryVal as any,
        categoryTags: a.categoryTags && a.categoryTags.length > 0 ? a.categoryTags : [sceneVal as any],
        industryTags: a.industryTags && a.industryTags.length > 0 ? a.industryTags : [industryVal as any],
        slogan: a.slogan || a.description?.slice(0, 30) || '高阶自动化智能体应用',
        subscribersCount: a.subscribersCount || Math.floor(Math.random() * 450 + 90),
      };
    })
  );
  const [models, setModels] = useState<ModelItem[]>(initialAdminModels);
  const [modelCallRecords, setModelCallRecords] = useState<ModelCallRecord[]>(initialModelCallRecords);
  const [modelUserConsumptions, setModelUserConsumptions] = useState<ModelUserConsumption[]>(initialUserConsumptions);

  const addModel = (modelData: Partial<ModelItem>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newId = modelData.id || modelData.modelCodeName || `model-${Date.now()}`;
    const newModel: ModelItem = {
      id: newId,
      name: modelData.name || '新模型',
      vendor: modelData.vendor || '深度求索',
      author: modelData.author || modelData.vendor || 'DeepSeek',
      logo: modelData.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150&auto=format&fit=crop&q=80',
      brief: modelData.brief || modelData.description?.slice(0, 30) || '高可用多模态大模型',
      downloadUrl: modelData.downloadUrl || '',
      providerList: modelData.providerList || ['智算网关'],
      modelCodeName: modelData.modelCodeName || newId,
      versionName: modelData.versionName || `${modelData.name || 'Model'} 正式版`,
      typeTag: (modelData.modalities?.[0] as any) || (modelData.typeTag as any) || '文本',
      modalities: modelData.modalities || ['文本'],
      inputModalities: modelData.inputModalities || ['文本'],
      outputModalities: modelData.outputModalities || ['文本'],
      contextLength: modelData.contextLength || (modelData.contextLengthValue ? `${modelData.contextLengthValue}${modelData.contextLengthUnit || 'K'}` : '128K'),
      contextLengthValue: modelData.contextLengthValue || 128,
      contextLengthUnit: modelData.contextLengthUnit || 'K',
      maxOutputTokens: modelData.maxOutputTokens || 65536,
      apiUrl: modelData.apiUrl || 'https://api.gateway.local/v1/chat/completions',
      authType: modelData.authType || 'API Key',
      authCredential: modelData.authCredential || '',
      timeoutSeconds: modelData.timeoutSeconds || 30,
      billingRules: modelData.billingRules || [
        { id: `br_${Date.now()}_1`, modality: '文本', direction: '输入', unit: 'Token（按M tokens）', price: 1.0 },
        { id: `br_${Date.now()}_2`, modality: '文本', direction: '输出', unit: 'Token（按M tokens）', price: 3.0 }
      ],
      billingRuleSummary: modelData.billingRuleSummary || '输入文本¥1.0/M tokens，输出文本¥3.0/M tokens',
      protocols: modelData.protocols || ['Chat Completions'],
      status: modelData.status || '已上架',
      totalTokensUsed: '0 tokens',
      totalCalls: 0,
      totalRevenue: 0,
      cachedPrice: '¥0.01 /M tokens',
      throughputTps: 80,
      availabilityPercent: 99.9,
      priceInput: modelData.priceInput || '¥1.0/M tokens',
      priceOutput: modelData.priceOutput || '¥3.0/M tokens',
      tags: modelData.tags || ['新模型', '高性能'],
      description: modelData.description || '这是新创建的模型实例。',
      apiDocContent: modelData.apiDocContent || '### API 调用说明\n支持标准请求格式。',
      codeCurl: modelData.codeCurl || '',
      codePython: modelData.codePython || '',
      codeNode: modelData.codeNode || '',
      benchmarks: [{ name: 'MMLU', score: 88.0 }],
      latencyMs: 250,
      apiDocsUrl: 'https://docs.local',
      createdAt: nowStr,
      updatedAt: nowStr,
      ...modelData
    };

    setModels(prev => [newModel, ...prev]);
    showToast(`模型【${newModel.name}】已成功${newModel.status === '草稿' ? '保存为草稿' : '创建并上架'}！`);
  };

  const updateModel = (id: string, updates: Partial<ModelItem>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setModels(prev => prev.map(m => {
      if (m.id === id) {
        return {
          ...m,
          ...updates,
          updatedAt: nowStr
        };
      }
      return m;
    }));
    showToast('模型配置已成功更新！');
  };

  const deleteModel = (id: string): boolean => {
    const target = models.find(m => m.id === id);
    if (!target) return false;
    
    setModels(prev => prev.filter(m => m.id !== id));
    showToast(`已删除模型【${target.name}】`);
    return true;
  };

  const toggleModelStatus = (id: string, nextStatus?: '已上架' | '已下架' | '草稿') => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setModels(prev => prev.map(m => {
      if (m.id === id) {
        let determinedStatus = nextStatus;
        if (!determinedStatus) {
          determinedStatus = m.status === '已上架' ? '已下架' : '已上架';
        }
        return { ...m, status: determinedStatus, updatedAt: nowStr };
      }
      return m;
    }));
    showToast(`模型状态已变更为【${nextStatus || '已切换'}】`);
  };

  const addModelCallRecord = (record: Partial<ModelCallRecord>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newRecord: ModelCallRecord = {
      id: `call_${Date.now()}_${Math.floor(Math.random() * 899 + 100)}`,
      userId: user.id || 'U892301',
      userName: user.name || '李明华',
      userAvatar: user.avatar,
      modelId: record.modelId || 'deepseek-v4-pro-0813',
      modelName: record.modelName || 'DeepSeek V4 Pro',
      callType: record.callType || '在线体验',
      inputAmount: record.inputAmount || '800 tokens',
      inputCount: record.inputCount || 800,
      outputAmount: record.outputAmount || '420 tokens',
      outputCount: record.outputCount || 420,
      cost: record.cost || 0.0185,
      callTime: nowStr,
      status: record.status || '成功',
      requestParamsSummary: record.requestParamsSummary || '{"messages":[{"role":"user","content":"用户提示词"}]}',
      responseSummary: record.responseSummary || '模型响应结果...',
      matchedBillingRule: record.matchedBillingRule || '标准Token计费',
      latencyMs: record.latencyMs || 320,
      apiKeyPrefix: record.apiKeyPrefix || 'Web-Console',
      ...record
    };

    setModelCallRecords(prev => [newRecord, ...prev]);

    // 更新模型调用次数和营收
    setModels(prev => prev.map(m => {
      if (m.id === newRecord.modelId || m.name === newRecord.modelName) {
        return {
          ...m,
          totalCalls: (m.totalCalls || 0) + 1,
          totalRevenue: Number(((m.totalRevenue || 0) + (newRecord.cost || 0)).toFixed(4))
        };
      }
      return m;
    }));

    // 扣减用户账户余额
    if (newRecord.cost > 0) {
      setUser(prev => ({
        ...prev,
        balance: Math.max(0, Number((prev.balance - newRecord.cost).toFixed(4)))
      }));
    }
  };

  const [datasets, setDatasets] = useState<DatasetItem[]>(() =>
    mockDatasets.map((ds, idx) => {
      const isPlatform = ds.uploaderType === 'platform' || idx % 2 === 0 || ds.id === 'ds_powerbi_retail';
      return {
        ...ds,
        uploaderType: isPlatform ? 'platform' : 'user',
        uploaderName: isPlatform ? '平台管理' : (ds.author || 'AI开发者_908'),
        status: (ds.status || (idx === 3 ? '草稿' : idx === 4 ? '已下架' : '已上架')) as any,
        brief: ds.brief || ds.description?.slice(0, 50) || '精选高质量开放数据集，适用于多场景深度学习与数据挖掘',
        modalities: ds.modalities && ds.modalities.length > 0 
          ? ds.modalities 
          : [ds.modalityCategory === '表格' ? '表格数据' : (ds.modalityCategory || '表格数据')],
        taskTypes: ds.taskTypes && ds.taskTypes.length > 0 
          ? ds.taskTypes 
          : [ds.taskType || '分类任务'],
        domains: ds.domains && ds.domains.length > 0 
          ? ds.domains 
          : (ds.domainTags && ds.domainTags.length > 0 ? ds.domainTags : [ds.theme || '商业/管理']),
        formats: ds.formats && ds.formats.length > 0 
          ? ds.formats 
          : [ds.fileFormats?.toLowerCase().includes('csv') ? 'CSV/XLSX' : ds.fileFormats?.toLowerCase().includes('json') ? 'JSON/JSONL' : 'Parquet'],
        lastDownloadTime: ds.lastDownloadTime || (idx === 0 ? '2026-08-19 15:42:10' : idx === 1 ? '2026-08-19 11:20:05' : '2026-08-18 09:15:33'),
      };
    })
  );

  // 数据集分类标签字典维度
  const [datasetTagDimensions, setDatasetTagDimensions] = useState<{
    modality: string[];
    taskType: string[];
    domain: string[];
    format: string[];
  }>({
    modality: ['表格数据', '计算机视觉', '自然语言处理', '音频', '多模态'],
    taskType: [
      '分类任务', '回归任务', '时间序列预测', '物体检测', 
      '图像分类', '图像分割', '图像生成', '文本分类', 
      '文本生成', '文本摘要', '翻译', '问答', '视觉问答', '语音识别'
    ],
    domain: [
      '商业/管理', '电商', '科技互联网', '金融', '医疗健康', 
      '教育', '科研', '政务/公共管理', '制造业', '农业', 
      '能源', '法律', '气象/环境', '地理遥感', '数理逻辑'
    ],
    format: [
      'CSV/XLSX', 'JSON/JSONL', 'Parquet', 'TXT', 
      'NetCDF/GeoTIFF', 'PNG/JPG', 'WAV/MP3', 'MP4/AVI', 'PDF'
    ]
  });

  const addDataset = (datasetData: Partial<DatasetItem>) => {
    const newId = `ds_${Date.now()}`;
    const newDs: DatasetItem = {
      id: newId,
      name: datasetData.name || '新建数据集',
      repoPath: `${user.name || 'admin'}/${datasetData.name || 'dataset'}`,
      author: user.name || '平台运营管理员',
      authorAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      authorOrg: 'AI运营中心',
      updatedAt: '2026/08/20 10:00',
      relativeTime: '刚刚',
      viewsCount: 1,
      downloadCount: 0,
      likesCount: 0,
      favoritesCount: 0,
      isLiked: false,
      isFavorite: false,
      isCreatedByMe: true,
      isMounted: false,
      modalityCategory: (datasetData.modalities?.[0] === '表格数据' ? '表格' : datasetData.modalities?.[0] as any) || '表格',
      taskType: datasetData.taskTypes?.[0] || '分类任务',
      domainTags: datasetData.domains || ['商业/管理'],
      license: datasetData.license || 'CC-BY-4.0',
      language: '中文',
      description: datasetData.description || datasetData.brief || '暂无详细描述',
      backgroundDesc: datasetData.description?.slice(0, 100) || '',
      dataDesc: datasetData.description || '',
      sourceDesc: '平台原创上传',
      problemDesc: '可用于算法训练与数据科学建模',
      mountPath: `/datasets/shared/${newId}`,
      fileFormats: datasetData.formats?.join(', ') || '.csv',
      fileSize: datasetData.fileSize || '10.5 MB',
      filesCount: 1,
      theme: datasetData.domains?.[0] || '商业/管理',
      techDomain: datasetData.taskTypes?.[0] || '数据分析',
      files: [],
      comments: [],
      status: datasetData.status || '已上架',
      brief: datasetData.brief || datasetData.description?.slice(0, 50) || '',
      modalities: datasetData.modalities || ['表格数据'],
      taskTypes: datasetData.taskTypes || ['分类任务'],
      domains: datasetData.domains || ['商业/管理'],
      formats: datasetData.formats || ['CSV/XLSX'],
      lastDownloadTime: '暂无下载记录',
      ...datasetData
    };

    setDatasets(prev => [newDs, ...prev]);
    showToast(`数据集【${newDs.name}】已成功${newDs.status === '草稿' ? '保存为草稿' : '创建并发布'}！`);
  };

  const updateDataset = (id: string, updates: Partial<DatasetItem>) => {
    setDatasets(prev => prev.map(ds => {
      if (ds.id === id) {
        return {
          ...ds,
          ...updates,
          updatedAt: '2026/08/20 10:00',
          relativeTime: '刚刚'
        };
      }
      return ds;
    }));
    showToast('数据集配置已成功更新！');
  };

  const deleteDataset = (id: string): boolean => {
    const target = datasets.find(d => d.id === id);
    if (!target) return false;
    setDatasets(prev => prev.filter(d => d.id !== id));
    showToast(`已删除数据集【${target.name}】`);
    return true;
  };

  const toggleDatasetStatus = (id: string, status: '已上架' | '已下架' | '草稿') => {
    setDatasets(prev => prev.map(ds => {
      if (ds.id === id) {
        return { ...ds, status };
      }
      return ds;
    }));
    showToast(`数据集状态已变更为【${status}】`);
  };

  const addDatasetTag = (dimension: 'modality' | 'taskType' | 'domain' | 'format', tag: string): boolean => {
    const trimmed = tag.trim();
    if (!trimmed) return false;
    if (datasetTagDimensions[dimension].includes(trimmed)) {
      showToast(`该${dimension === 'modality' ? '模态' : dimension === 'taskType' ? '任务类型' : dimension === 'domain' ? '行业领域' : '文件格式'}标签已存在！`);
      return false;
    }
    setDatasetTagDimensions(prev => ({
      ...prev,
      [dimension]: [...prev[dimension], trimmed]
    }));
    showToast(`已成功添加标签【${trimmed}】`);
    return true;
  };

  const updateDatasetTag = (dimension: 'modality' | 'taskType' | 'domain' | 'format', oldTag: string, newTag: string): boolean => {
    const trimmed = newTag.trim();
    if (!trimmed || oldTag === trimmed) return false;
    setDatasetTagDimensions(prev => ({
      ...prev,
      [dimension]: prev[dimension].map(t => t === oldTag ? trimmed : t)
    }));
    // 同步更新已存在的数据集对应字段
    setDatasets(prev => prev.map(ds => {
      if (dimension === 'modality') {
        const nextMods = ds.modalities?.map(m => m === oldTag ? trimmed : m);
        return { ...ds, modalities: nextMods };
      }
      if (dimension === 'taskType') {
        const nextTasks = ds.taskTypes?.map(t => t === oldTag ? trimmed : t);
        return { ...ds, taskTypes: nextTasks, taskType: ds.taskType === oldTag ? trimmed : ds.taskType };
      }
      if (dimension === 'domain') {
        const nextDomains = ds.domains?.map(d => d === oldTag ? trimmed : d);
        return { ...ds, domains: nextDomains, domainTags: ds.domainTags?.map(d => d === oldTag ? trimmed : d) };
      }
      if (dimension === 'format') {
        const nextFormats = ds.formats?.map(f => f === oldTag ? trimmed : f);
        return { ...ds, formats: nextFormats };
      }
      return ds;
    }));
    showToast(`标签【${oldTag}】已重命名为【${trimmed}】并已同步相关数据集！`);
    return true;
  };

  const deleteDatasetTag = (dimension: 'modality' | 'taskType' | 'domain' | 'format', tag: string): boolean => {
    // 检查是否有数据集正在使用该标签
    const inUseCount = datasets.filter(ds => {
      if (dimension === 'modality') return ds.modalities?.includes(tag) || ds.modalityCategory === tag;
      if (dimension === 'taskType') return ds.taskTypes?.includes(tag) || ds.taskType === tag;
      if (dimension === 'domain') return ds.domains?.includes(tag) || ds.domainTags?.includes(tag);
      if (dimension === 'format') return ds.formats?.includes(tag);
      return false;
    }).length;

    if (inUseCount > 0) {
      showToast(`无法删除：当前有 ${inUseCount} 个数据集正在使用此标签【${tag}】，请先解绑或修改数据集！`);
      return false;
    }

    setDatasetTagDimensions(prev => ({
      ...prev,
      [dimension]: prev[dimension].filter(t => t !== tag)
    }));
    showToast(`已成功删除标签【${tag}】`);
    return true;
  };

  const reorderDatasetTags = (dimension: 'modality' | 'taskType' | 'domain' | 'format', startIndex: number, endIndex: number) => {
    setDatasetTagDimensions(prev => {
      const list = [...prev[dimension]];
      const [moved] = list.splice(startIndex, 1);
      list.splice(endIndex, 0, moved);
      return { ...prev, [dimension]: list };
    });
    showToast('标签排序已更新');
  };
  const [skills, setSkills] = useState<SkillPluginItem[]>(() =>
    mockSkills.map((sk, idx) => {
      const isPlatform = sk.uploaderType === 'platform' || sk.isOfficial || idx % 2 === 0;
      return {
        ...sk,
        uploaderType: isPlatform ? 'platform' : 'user',
        uploaderName: isPlatform ? '平台管理' : (sk.developer || '插件极客_Alex'),
        status: sk.status || '已上架',
      };
    })
  );

  // 数据集下载记录状态
  const [datasetDownloads, setDatasetDownloads] = useState<DatasetDownloadRecord[]>([
    {
      id: 'rec_ds_01',
      datasetId: 'ds_weather_python',
      datasetName: '云上气象Python',
      uploaderType: 'user',
      uploaderName: '气科气科',
      downloadTime: '2026-08-20 14:32:10',
      fileFormat: 'CSV',
      fileSize: '763.9 KB',
      downloadCount: 3,
      mountPath: '/home/mw/input/weather_python_lab',
      modalityCategory: '表格',
      coverImage: 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'rec_ds_02',
      datasetId: 'ds_powerbi_retail',
      datasetName: 'PowerBI_零售与商超商品销售',
      uploaderType: 'platform',
      uploaderName: '平台管理',
      downloadTime: '2026-08-19 11:15:40',
      fileFormat: 'CSV/XLSX',
      fileSize: '267.5 MB',
      downloadCount: 1,
      mountPath: '/datasets/shared/retail_master',
      modalityCategory: '表格',
      coverImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&auto=format&fit=crop&q=80'
    },
    {
      id: 'rec_ds_03',
      datasetId: 'ds_gpr_china_temp',
      datasetName: 'GPRChinaTemp1km',
      uploaderType: 'user',
      uploaderName: 'lqy',
      downloadTime: '2026-08-18 09:20:00',
      fileFormat: 'GeoTIFF / CSV',
      fileSize: '30.8 GB',
      downloadCount: 2,
      mountPath: '/home/mw/input/GPRChinaTemp1km',
      modalityCategory: '多模态',
      coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=400&auto=format&fit=crop&q=80'
    }
  ]);

  // Skill 插件下载记录状态
  const [skillDownloads, setSkillDownloads] = useState<SkillDownloadRecord[]>([
    {
      id: 'rec_sk_01',
      skillId: 'sk_web_search',
      skillName: '实时全网深度搜索',
      uploaderType: 'platform',
      uploaderName: '平台管理',
      category: '效率工具',
      version: 'v2.4.0',
      packageSize: '1.2 MB',
      downloadTime: '2026-08-20 16:10:05',
      downloadCount: 2,
      developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'rec_sk_02',
      skillId: 'sk_python_code_runner',
      skillName: 'Python 沙箱代码执行器',
      uploaderType: 'platform',
      uploaderName: '平台管理',
      category: '编程开发',
      version: 'v3.1.2',
      packageSize: '4.8 MB',
      downloadTime: '2026-08-19 18:40:22',
      downloadCount: 1,
      developerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'
    },
    {
      id: 'rec_sk_03',
      skillId: 'sk_financial_valuation',
      skillName: 'DCF 财务估值建模引擎',
      uploaderType: 'user',
      uploaderName: 'Franski',
      category: '数据分析',
      version: 'v1.0.4',
      packageSize: '2.6 MB',
      downloadTime: '2026-08-18 10:25:12',
      downloadCount: 1,
      developerAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&auto=format&fit=crop&q=80'
    }
  ]);

  // 前台用户上传数据集 (待审核)
  const submitDatasetForApproval = (datasetData: Partial<DatasetItem>) => {
    const newId = `ds_user_${Date.now()}`;
    const newDs: DatasetItem = {
      id: newId,
      name: datasetData.name || '用户提交数据集',
      repoPath: `${user.name || 'user'}/${datasetData.name || 'dataset'}`,
      author: user.name || '当前用户',
      authorAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      authorOrg: '开发者个人',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      relativeTime: '刚刚',
      viewsCount: 0,
      downloadCount: 0,
      likesCount: 0,
      favoritesCount: 0,
      isLiked: false,
      isFavorite: false,
      isCreatedByMe: true,
      isMounted: false,
      uploaderType: 'user',
      uploaderName: user.name || '当前用户',
      status: '待审核',
      auditTime: '等待管理员审核',
      modalityCategory: (datasetData.modalities?.[0] === '表格数据' ? '表格' : datasetData.modalities?.[0] as any) || '表格',
      taskType: datasetData.taskTypes?.[0] || '分类任务',
      domainTags: datasetData.domains || ['商业/管理'],
      license: datasetData.license || 'CC-BY-4.0',
      language: '中文',
      description: datasetData.description || '用户上传数据集详细描述',
      backgroundDesc: datasetData.description?.slice(0, 100) || '',
      dataDesc: datasetData.description || '',
      sourceDesc: '用户原创上传',
      problemDesc: '可用于算法训练与数据科学建模',
      mountPath: `/home/user/datasets/${newId}`,
      fileFormats: datasetData.formats?.join(', ') || '.csv',
      fileSize: datasetData.fileSize || '15.2 MB',
      filesCount: 1,
      theme: datasetData.domains?.[0] || '商业/管理',
      techDomain: datasetData.taskTypes?.[0] || '数据分析',
      files: [
        {
          id: `f_${newId}`,
          name: datasetData.files?.[0]?.name || `${datasetData.name || 'data'}.csv`,
          size: datasetData.fileSize || '15.2 MB',
          format: 'csv',
          rowsCount: 10000,
          colsCount: 12,
          encoding: 'UTF-8',
          headers: ['ID', 'Feature_A', 'Feature_B', 'Label'],
          sampleRows: []
        }
      ],
      comments: [],
      brief: datasetData.brief || datasetData.description?.slice(0, 50) || '用户上传数据集',
      modalities: datasetData.modalities || ['表格数据'],
      taskTypes: datasetData.taskTypes || ['分类任务'],
      domains: datasetData.domains || ['商业/管理'],
      formats: datasetData.formats || ['CSV/XLSX'],
      lastDownloadTime: '暂无下载记录',
      ...datasetData
    };
    setDatasets(prev => [newDs, ...prev]);
    showToast(`数据集【${newDs.name}】已提交审核！待后台审核通过并点击上架后在广场可见。`);
  };

  // 前台用户创建 Skill (待审核)
  const submitSkillForApproval = (skillData: Partial<SkillPluginItem>) => {
    const newId = skillData.id || `sk_user_${Date.now()}`;
    const newSkill: SkillPluginItem = {
      id: newId,
      name: skillData.name || '用户提交Skill插件',
      repoPath: `@${user.name || 'user'}/${skillData.id || 'custom-skill'}`,
      category: skillData.category || '效率工具',
      developer: user.name || '当前用户',
      developerAvatar: user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      uploaderType: 'user',
      uploaderName: user.name || '当前用户',
      isCreatedByMe: true,
      status: '待审核',
      auditTime: '等待管理员审核',
      version: skillData.version || 'v1.0.0',
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      relativeTime: '刚刚',
      installs: 0,
      downloadsCount: 0,
      viewsCount: 0,
      likesCount: 0,
      favoritesCount: 0,
      isLiked: false,
      isFavorite: false,
      description: skillData.description || '用户创建的 Skill 插件功能描述',
      compatibleAgents: skillData.compatibleAgents || '全量 Agent 兼容',
      packageFormat: 'ZIP / Skill 包',
      packageSize: skillData.packageSize || '2.4 MB',
      requiredPermissions: skillData.requiredPermissions || ['网络访问', '本地沙盒'],
      ...skillData
    };
    setSkills(prev => [newSkill, ...prev]);
    showToast(`Skill 插件【${newSkill.name}】已提交审核！待后台审核通过并点击上架后在市场可见。`);
  };

  // 后台审核数据集 (通过/驳回)
  const auditDataset = (id: string, action: 'pass' | 'reject', reason?: string) => {
    setDatasets(prev => prev.map(ds => {
      if (ds.id === id) {
        return {
          ...ds,
          status: action === 'pass' ? '已下架' : '已驳回', // 刚通过审核的数据集默认为下架状态
          auditReason: reason || (action === 'pass' ? '符合平台数据集规范，审核通过' : '数据集元数据或样本文件不符合规范，请修改后重新提交'),
          auditTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return ds;
    }));
    showToast(`数据集审核已完成：【${action === 'pass' ? '审核通过（默认下架）' : '已驳回'}】`);
  };

  // 后台将已通过的数据集上架
  const publishDataset = (id: string) => {
    setDatasets(prev => prev.map(ds => {
      if (ds.id === id) {
        return { ...ds, status: '已上架' };
      }
      return ds;
    }));
    showToast('数据集已成功上架！现已在数据集广场全员可见');
  };

  // 后台审核 Skill 插件 (通过/驳回)
  const auditSkill = (id: string, action: 'pass' | 'reject', reason?: string) => {
    setSkills(prev => prev.map(sk => {
      if (sk.id === id) {
        return {
          ...sk,
          status: action === 'pass' ? '已下架' : '已驳回', // 刚通过审核的 Skill 默认为下架状态
          auditReason: reason || (action === 'pass' ? '代码与安全规范检查通过，准予通过' : '插件代码或权限配置不合规，请检查后重新提交'),
          auditTime: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return sk;
    }));
    showToast(`Skill 插件审核已完成：【${action === 'pass' ? '审核通过（默认下架）' : '已驳回'}】`);
  };

  // 后台将已通过的 Skill 上架
  const publishSkill = (id: string) => {
    setSkills(prev => prev.map(sk => {
      if (sk.id === id) {
        return { ...sk, status: '已上架' };
      }
      return sk;
    }));
    showToast('Skill 插件已成功上架！现已在 Skill 插件市场全员可见');
  };

  // Skill 删除、更新、状态切换
  const deleteSkill = (id: string) => {
    setSkills(prev => prev.filter(sk => sk.id !== id));
    showToast('已成功删除 Skill 插件');
  };

  const updateSkill = (id: string, updates: Partial<SkillPluginItem>) => {
    setSkills(prev => prev.map(sk => {
      if (sk.id === id) {
        return {
          ...sk,
          ...updates,
          status: '待审核',
          auditReason: undefined,
          updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
        };
      }
      return sk;
    }));
    showToast('Skill 插件配置已修改并重新提交审核！');
  };

  const toggleSkillStatus = (id: string, nextStatus?: '已上架' | '已下架' | '待审核' | '已通过' | '已驳回' | '草稿') => {
    setSkills(prev => prev.map(sk => {
      if (sk.id === id) {
        const determinedStatus = nextStatus || (sk.status === '已上架' ? '已下架' : '已上架');
        showToast(`Skill 插件【${sk.name}】状态已变更为: ${determinedStatus}`);
        return {
          ...sk,
          status: determinedStatus
        };
      }
      return sk;
    }));
  };

  // 下载数据集记录
  const downloadDataset = (dataset: DatasetItem) => {
    const isPlat = dataset.uploaderType === 'platform' || !dataset.uploaderType;
    const newRec: DatasetDownloadRecord = {
      id: `rec_ds_${Date.now()}`,
      datasetId: dataset.id,
      datasetName: dataset.name,
      uploaderType: isPlat ? 'platform' : 'user',
      uploaderName: isPlat ? '平台管理' : (dataset.uploaderName || dataset.author || '平台管理员'),
      downloadTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      fileFormat: dataset.fileFormats || dataset.format || 'CSV/XLSX',
      fileSize: dataset.fileSize || dataset.scale || '10.5 MB',
      downloadCount: 1,
      mountPath: dataset.mountPath,
      modalityCategory: dataset.modalityCategory || '表格',
      coverImage: dataset.coverImage
    };
    setDatasetDownloads(prev => {
      const existing = prev.find(r => r.datasetId === dataset.id);
      if (existing) {
        return prev.map(r => r.datasetId === dataset.id ? { ...r, downloadCount: r.downloadCount + 1, downloadTime: newRec.downloadTime } : r);
      }
      return [newRec, ...prev];
    });
    setDatasets(prev => prev.map(d => d.id === dataset.id ? { ...d, downloadCount: (d.downloadCount || 0) + 1 } : d));
    showToast(`正在下载【${dataset.name}】数据包...`);
  };

  // 下载 Skill 插件记录
  const downloadSkill = (skill: SkillPluginItem) => {
    const isPlat = skill.uploaderType === 'platform' || skill.isOfficial;
    const newRec: SkillDownloadRecord = {
      id: `rec_sk_${Date.now()}`,
      skillId: skill.id,
      skillName: skill.name,
      uploaderType: isPlat ? 'platform' : 'user',
      uploaderName: isPlat ? '平台管理' : (skill.uploaderName || skill.developer || '插件开发者'),
      category: skill.category || '效率工具',
      version: skill.version || 'v1.0.0',
      packageSize: skill.packageSize || '1.8 MB',
      downloadTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      downloadCount: 1,
      developerAvatar: skill.developerAvatar
    };
    setSkillDownloads(prev => {
      const existing = prev.find(r => r.skillId === skill.id);
      if (existing) {
        return prev.map(r => r.skillId === skill.id ? { ...r, downloadCount: r.downloadCount + 1, downloadTime: newRec.downloadTime } : r);
      }
      return [newRec, ...prev];
    });
    setSkills(prev => prev.map(s => s.id === skill.id ? { ...s, downloadsCount: (s.downloadsCount || 0) + 1, installs: (s.installs || 0) + 1 } : s));
    showToast(`正在下载【${skill.name}】插件源码包...`);
  };
  const [favoriteAgentIds, setFavoriteAgentIds] = useState<string[]>(['ag_01', 'ag_03']);
  const [tasks, setTasks] = useState<TaskItem[]>(mockRichTasks);
  const [courses] = useState<CourseItem[]>(mockCourses);
  const [gpuInstances, setGpuInstances] = useState<GPUInstance[]>(mockGpuInstances);
  const [myCustomImages, setMyCustomImages] = useState<MyCustomImage[]>(mockMyCustomImages);
  const [rechargeModalOpen, setRechargeModalOpen] = useState<boolean>(false);
  const [userImageQuota, setUserImageQuota] = useState<number>(200); // 默认存储配额 200 GB
  const [userImageAutoCleanupDays, setUserImageAutoCleanupDays] = useState<number>(180); // 长期未使用清理阈值 180 天

  const openRechargeModal = (defaultAmount?: number) => {
    setRechargeModalOpen(true);
  };

  const deleteMyCustomImage = (id: string) => {
    setMyCustomImages(prev => prev.filter(img => img.id !== id));
    showToast('已成功删除自定义镜像，存储空间已立即释放！');
  };

  const forceDeleteUserCustomImage = (id: string, reason?: string) => {
    const targetImage = myCustomImages.find(img => img.id === id);
    if (!targetImage) return;

    setMyCustomImages(prev => prev.filter(img => img.id !== id));
    
    // 下发合规通知给该用户
    const newNotice: AppNotification = {
      id: `n_violation_${Date.now()}`,
      title: '🚨 用户镜像违规强制删除提醒',
      content: `您的自定义镜像【${targetImage.name}】因${reason || '包含违规或安全风险文件'}已被平台系统管理员强制删除并释放存储空间。如有疑问请联系客服申诉。`,
      category: 'business',
      subCategory: 'compute',
      type: 'compute',
      time: '刚刚',
      read: false,
      targetTab: 'compute'
    };
    setNotifications(prev => [newNotice, ...prev]);
    showToast(`已强制下线并销毁用户镜像【${targetImage.name}】，已向用户发送合规处理通知`);
  };

  const addMyCustomImageComment = (imageId: string, commentText: string) => {
    const textToSubmit = commentText.trim();
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message || '请输入评论内容');
      return;
    }
    setMyCustomImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const newComment = {
          id: `cm_${Date.now()}`,
          userName: user.name || '冷库的雪人',
          userAvatar: user.avatar,
          createdAtAgo: '刚刚',
          likes: 0,
          content: textToSubmit
        };
        return {
          ...img,
          comments: [newComment, ...img.comments]
        };
      }
      return img;
    }));
    showToast('评论发表成功！');
  };

  const updateMyCustomImageDescription = (imageId: string, desc: string) => {
    setMyCustomImages(prev => prev.map(img => {
      if (img.id === imageId) {
        return { ...img, description: desc };
      }
      return img;
    }));
    showToast('镜像详情描述已保存！');
  };

  // 社区板块初始默认数据
  const defaultInitialBoards: CommunityBoardItem[] = [
    { id: 'b1', name: '干货分享', description: '技术方案、踩坑总结、工具推荐、代码片段', postCount: 24, sortWeight: 1, status: '已启用' },
    { id: 'b2', name: '求助答疑', description: '环境报错、模型调优、算法理解', postCount: 18, sortWeight: 2, status: '已启用' },
    { id: 'b3', name: '前沿观察', description: '新产品发布、论文解读、技术趋势', postCount: 15, sortWeight: 3, status: '已启用' },
    { id: 'b4', name: '赚钱交流', description: '接单经验、AI变现路径、副业思路', postCount: 12, sortWeight: 4, status: '已启用' },
    { id: 'b5', name: '同行交流', description: '找合作、找学习搭子、线下meetup', postCount: 9, sortWeight: 5, status: '已启用' },
    { id: 'b6', name: '娱乐灌水', description: 'AI趣事、梗图、日常、非技术闲聊', postCount: 6, sortWeight: 6, status: '已启用' },
  ];

  const [communityBoards, setCommunityBoards] = useState<CommunityBoardItem[]>(() => {
    try {
      const saved = localStorage.getItem('app_community_boards');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return defaultInitialBoards;
  });

  useEffect(() => {
    try {
      localStorage.setItem('app_community_boards', JSON.stringify(communityBoards));
    } catch (e) {}
  }, [communityBoards]);

  // 防刷机制：同一用户/IP对同一帖子的多次查看只计1次
  const [viewedPostKeys, setViewedPostKeys] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem('app_viewed_posts');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {}
    return {};
  });

  const [posts, setPosts] = useState<FeedPost[]>(mockFeedPosts);
  const [apiKeys, setApiKeys] = useState<ApiKeyItem[]>(mockApiKeys);
  
  // 算力工坊后台管理状态
  const [computeSpecs, setComputeSpecs] = useState<ComputeSpecItem[]>(mockComputeSpecs);
  const [computeImages, setComputeImages] = useState<ComputeImageAdminItem[]>(mockComputeImages);
  const [computePools, setComputePools] = useState<ComputePoolItem[]>(mockComputePools);
  const [computeOrders, setComputeOrders] = useState<ComputeOrderItem[]>(mockComputeOrders);
  const [computeRunningInstances, setComputeRunningInstances] = useState<ComputeRunningInstanceItem[]>(mockRunningInstances);
  const [computeSettlements, setComputeSettlements] = useState<ComputeSettlementItem[]>(mockComputeSettlements);

  // 算力后台联动高亮与定位状态
  const [focusedComputeOrderId, setFocusedComputeOrderId] = useState<string | null>(null);
  const [focusedComputeInstanceId, setFocusedComputeInstanceId] = useState<string | null>(null);

  const navigateToComputeOrder = (orderId: string) => {
    setFocusedComputeOrderId(orderId);
    setActiveAdminMenu('compute_order');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  const navigateToComputeInstance = (instanceId: string) => {
    setFocusedComputeInstanceId(instanceId);
    setActiveAdminMenu('compute_instance');
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  };

  // 1. 规格操作
  const addComputeSpec = (spec: Omit<ComputeSpecItem, 'id' | 'createTime' | 'updateTime'>): boolean => {
    // 前置依赖校验 1: 检查是否存在已启用的镜像
    const hasEnabledImage = computeImages.some(img => img.status === '已启用' || img.status === '上架');
    if (!hasEnabledImage) {
      showToast('请先在镜像管理中添加并启用至少一个镜像');
      return false;
    }

    // 前置依赖校验 2: 检查是否存在状态正常的资源池
    const hasNormalPool = computePools.some(pool => pool.status === '正常');
    if (!hasNormalPool) {
      showToast('请先在资源池管理中添加并启用至少一个资源池');
      return false;
    }

    // 关联镜像与运营商校验
    if (!spec.linkedImageIds || spec.linkedImageIds.length === 0) {
      showToast('请至少选择一个支持的镜像');
      return false;
    }
    if (!spec.linkedOperators || spec.linkedOperators.length === 0) {
      showToast('请至少选择一个可部署的运营商资源池');
      return false;
    }

    const newSpec: ComputeSpecItem = {
      ...spec,
      id: `spec_${Date.now()}`,
      totalUsedCount: spec.totalUsedCount ?? 0,
      recent7DaysCount: spec.recent7DaysCount ?? 0,
      createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setComputeSpecs(prev => [newSpec, ...prev]);
    showToast(`实例规格 "${spec.name}" 添加成功！`);
    return true;
  };

  const updateComputeSpec = (id: string, updates: Partial<ComputeSpecItem>) => {
    setComputeSpecs(prev => prev.map(s => s.id === id ? {
      ...s,
      ...updates,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    } : s));
    showToast('规格配置已更新！');
  };

  const deleteComputeSpec = (id: string): boolean => {
    const spec = computeSpecs.find(s => s.id === id);
    if (!spec) return false;

    // 删除限制校验：若该规格累计创建过实例，或在订单/运行实例中存在，严禁删除
    const isUsedInOrders = computeOrders.some(o => o.specName.includes(spec.name) || o.specName.includes(spec.gpuModel));
    const isUsedInInstances = computeRunningInstances.some(i => i.specName.includes(spec.name) || i.specName.includes(spec.gpuModel));
    const hasBeenCreated = (spec.totalUsedCount ?? 0) > 0;

    if (hasBeenCreated || isUsedInOrders || isUsedInInstances) {
      showToast('该规格已被使用，无法删除');
      return false;
    }

    setComputeSpecs(prev => prev.filter(s => s.id !== id));
    showToast('规格已删除！');
    return true;
  };

  const toggleComputeSpecStatus = (id: string, status: '上架' | '下架') => {
    setComputeSpecs(prev => prev.map(s => s.id === id ? {
      ...s,
      status,
      updateTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
    } : s));
    showToast(`规格状态已切换为: ${status}`);
  };

  // 2. 镜像操作
  const addComputeImage = (image: Partial<ComputeImageAdminItem>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newImg: ComputeImageAdminItem = {
      id: `img_${Date.now()}`,
      name: image.name || '未命名镜像',
      registryUrl: image.registryUrl || 'docker.io/library/ubuntu:latest',
      category: image.category || '其他',
      description: image.description || '',
      size: image.size || '15.0 GB',
      version: image.version || 'v1.0.0',
      changelog: image.changelog || '首次创建镜像',
      status: (image.status as any) || '已启用',
      refCount: 0,
      createdAt: nowStr,
      updatedAt: nowStr,
      type: image.type || '官方',
      baseOs: image.baseOs || 'Ubuntu 22.04 LTS',
      preinstalled: image.preinstalled || '',
      maintainer: image.maintainer || '平台运维',
      downloads: 0,
      updateTime: nowStr,
      createTime: nowStr,
      ...image
    };
    setComputeImages(prev => [newImg, ...prev]);
    showToast(`镜像【${newImg.name}】创建成功！`);
  };

  const updateComputeImage = (id: string, updates: Partial<ComputeImageAdminItem>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setComputeImages(prev => prev.map(img => img.id === id ? { ...img, ...updates, updatedAt: nowStr, updateTime: nowStr } : img));
    showToast('镜像配置已更新！');
  };

  const deleteComputeImage = (id: string) => {
    const target = computeImages.find(img => img.id === id);
    if (target && (target.refCount ?? 0) > 0) {
      showToast(`【删除失败】该镜像当前正被 ${target.refCount} 台实例引用，不可删除！`);
      return;
    }
    setComputeImages(prev => prev.filter(img => img.id !== id));
    showToast('镜像已成功删除！');
  };

  const toggleComputeImageStatus = (id: string, nextStatus?: '已启用' | '已停用' | '上架' | '下架') => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setComputeImages(prev => prev.map(img => {
      if (img.id === id) {
        let determinedStatus = nextStatus;
        if (!determinedStatus) {
          const isCurrentlyActive = img.status === '已启用' || img.status === '上架';
          determinedStatus = isCurrentlyActive ? '已停用' : '已启用';
        }
        showToast(`镜像【${img.name}】状态已切换为: ${determinedStatus}`);
        return { ...img, status: determinedStatus as any, updatedAt: nowStr, updateTime: nowStr };
      }
      return img;
    }));
  };

  // 3. 资源池操作
  const addComputePool = (pool: Partial<ComputePoolItem>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const nextSyncStr = new Date(Date.now() + 5 * 60000).toISOString().replace('T', ' ').substring(0, 19);
    const defaultDist = [
      { gpuModel: 'NVIDIA RTX 4090', total: 32, allocated: 12, available: 20, rate: 37.5 },
      { gpuModel: 'NVIDIA A100-SXM4-80GB', total: 16, allocated: 8, available: 8, rate: 50.0 }
    ];
    const initialDist = pool.distribution && pool.distribution.length > 0 ? pool.distribution : defaultDist;
    const totalGpusVal = initialDist.reduce((acc, item) => acc + item.total, 0);
    const usedGpusVal = initialDist.reduce((acc, item) => acc + item.allocated, 0);
    const freeGpusVal = totalGpusVal - usedGpusVal;

    const newPool: ComputePoolItem = {
      id: `pool_${Date.now()}`,
      name: pool.name || '新建智算资源池',
      operator: pool.operator || '中国电信天翼云',
      region: pool.region || '上海',
      remark: pool.remark || '',
      apiUrl: pool.apiUrl || 'https://api.compute-provider.com/v1/cluster/inventory',
      authType: pool.authType || 'API Key',
      authCredential: pool.authCredential || 'qj_key_' + Math.random().toString(36).substring(2, 12),
      timeoutSeconds: pool.timeoutSeconds || 30,
      saleStatus: pool.saleStatus || '已上架',
      runStatus: pool.runStatus || '正常',
      lastSyncTime: nowStr,
      nextSyncTime: nextSyncStr,
      gpuTypes: initialDist.map(d => d.gpuModel),
      supportedSpecIds: pool.supportedSpecIds || [],
      supportedSpecNames: pool.supportedSpecNames || [],
      totalCapacity: totalGpusVal,
      allocatedCount: usedGpusVal,
      availableCount: freeGpusVal,
      utilizationRate: totalGpusVal > 0 ? Number(((usedGpusVal / totalGpusVal) * 100).toFixed(1)) : 0,
      status: '正常',
      alertThreshold: pool.alertThreshold || 85,
      totalNodes: Math.ceil(totalGpusVal / 8) || 4,
      totalGpus: totalGpusVal,
      usedGpus: usedGpusVal,
      freeGpus: freeGpusVal,
      distribution: initialDist,
      logs: [
        {
          id: `log_${Date.now()}`,
          time: nowStr,
          operator: `${user.name} (管理员)`,
          action: '手动新增资源池',
          result: '成功',
          detail: '添加基础配置与连接凭证并开启上架'
        }
      ]
    };

    setComputePools(prev => [newPool, ...prev]);
    showToast(`资源池【${newPool.name}】新增成功！现可点击【同步】拉取集群规格`);
  };

  const updateComputePool = (id: string, updates: Partial<ComputePoolItem>) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setComputePools(prev => prev.map(p => {
      if (p.id === id) {
        const isCredentialChanged = (updates.apiUrl && updates.apiUrl !== p.apiUrl) || (updates.authCredential && updates.authCredential !== p.authCredential);
        const newLogs = [
          {
            id: `log_${Date.now()}`,
            time: nowStr,
            operator: `${user.name} (管理员)`,
            action: isCredentialChanged ? '修改连接配置凭证' : '更新资源池属性',
            result: '成功' as const,
            detail: isCredentialChanged ? '更新了 API 接入地址或鉴权 Key，需重新触发同步验证' : '编辑保存基础数据'
          },
          ...(p.logs || [])
        ];

        return {
          ...p,
          ...updates,
          logs: newLogs
        };
      }
      return p;
    }));
    showToast('资源池配置更新成功！');
  };

  const deleteComputePool = (id: string) => {
    setComputePools(prev => prev.filter(p => p.id !== id));
    showToast('资源池已成功删除！');
  };

  const syncComputePoolStatus = (poolId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const nextSyncStr = new Date(Date.now() + 5 * 60000).toISOString().replace('T', ' ').substring(0, 19);

    setComputePools(prev => prev.map(p => {
      if (p.id === poolId) {
        // 如果当前 distribution 为空，给予默认的算力硬件
        const currentDist = p.distribution && p.distribution.length > 0 ? p.distribution : [
          { gpuModel: 'NVIDIA RTX 4090', total: 40, allocated: 28, available: 12, rate: 70.0 },
          { gpuModel: 'NVIDIA A100-SXM4-80GB', total: 20, allocated: 15, available: 5, rate: 75.0 }
        ];

        // 模拟拉取微调库存
        const updatedDist = currentDist.map(item => {
          const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
          const newAllocated = Math.max(0, Math.min(item.total, item.allocated + delta));
          const newAvailable = item.total - newAllocated;
          const rate = Number(((newAllocated / item.total) * 100).toFixed(1));
          return {
            ...item,
            allocated: newAllocated,
            available: newAvailable,
            rate
          };
        });

        const totalGpusVal = updatedDist.reduce((acc, item) => acc + item.total, 0);
        const usedGpusVal = updatedDist.reduce((acc, item) => acc + item.allocated, 0);
        const freeGpusVal = totalGpusVal - usedGpusVal;
        const utilRate = totalGpusVal > 0 ? Number(((usedGpusVal / totalGpusVal) * 100).toFixed(1)) : 0;

        const syncLog = {
          id: `log_${Date.now()}`,
          time: nowStr,
          operator: '系统 API 自动同步',
          action: '拉取最新 GPU 规格与库存',
          result: '成功' as const,
          detail: `成功拉取 ${updatedDist.length} 种 GPU 型号，共 ${totalGpusVal} 卡，可用 ${freeGpusVal} 卡`
        };

        return {
          ...p,
          runStatus: '正常',
          status: utilRate > (p.alertThreshold || 85) ? '告警' : '正常',
          lastSyncTime: nowStr,
          nextSyncTime: nextSyncStr,
          distribution: updatedDist,
          totalCapacity: totalGpusVal,
          allocatedCount: usedGpusVal,
          availableCount: freeGpusVal,
          totalGpus: totalGpusVal,
          usedGpus: usedGpusVal,
          freeGpus: freeGpusVal,
          utilizationRate: utilRate,
          gpuTypes: updatedDist.map(d => d.gpuModel),
          logs: [syncLog, ...(p.logs || [])]
        };
      }
      return p;
    }));

    showToast('资源池同步成功！已自动更新 GPU 型号规格与实时库存');
  };

  const setComputePoolAlertThreshold = (poolId: string, threshold: number) => {
    setComputePools(prev => prev.map(p => p.id === poolId ? { ...p, alertThreshold: threshold } : p));
    showToast(`告警水位阈值已设置为 ${threshold}%`);
  };

  const toggleComputePoolMaintenance = (poolId: string) => {
    setComputePools(prev => prev.map(p => {
      if (p.id === poolId) {
        const nextStatus = p.status === '维护中' ? '正常' : '维护中';
        showToast(`资源池已切换为: ${nextStatus}`);
        return { ...p, status: nextStatus };
      }
      return p;
    }));
  };

  // 4. 实例订单操作与双向联动
  const stopComputeOrder = (orderId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let linkedInstId: string | undefined;

    setComputeOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNo === orderId) {
        linkedInstId = o.instanceId;
        const newTimeline = [
          ...(o.timeline || []),
          { time: nowStr, status: '已停止', title: '管理员强制关机', description: '管理员从后台控制台下发停机指令，GPU计算资源已停止计费挂起', operator: `${user.name} (管理员)` }
        ];
        return {
          ...o,
          status: '已停止',
          stopTime: nowStr,
          timeline: newTimeline
        };
      }
      return o;
    }));

    // 同步更新监控中的运行实例状态为“已关机/已停止”
    if (linkedInstId) {
      setComputeRunningInstances(prev => prev.map(inst => {
        if (inst.id === linkedInstId || inst.instanceId === linkedInstId || inst.orderId === orderId) {
          const newLogs = [
            ...(inst.logs || []),
            { time: nowStr.slice(11), level: 'WARN' as const, message: 'Received forced shutdown signal from management plane.', source: 'Admin Console' }
          ];
          return {
            ...inst,
            status: '已停止',
            gpuUsage: 0,
            gpuUtil: 0,
            vramUsage: 0,
            vramUsed: '0.0GB',
            ramUsage: 5,
            ramUsed: '2.0GB',
            cpuUtil: 0,
            temp: 35,
            power: '25W',
            health: '良好',
            stoppedAt: nowStr,
            logs: newLogs
          };
        }
        return inst;
      }));
    }

    showToast(`订单 ${orderId} 对应实例已强制停机，并同步更新运行监控状态`);
  };

  const releaseComputeOrder = (orderId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let linkedInstId: string | undefined;

    setComputeOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNo === orderId) {
        linkedInstId = o.instanceId;
        const newTimeline = [
          ...(o.timeline || []),
          { time: nowStr, status: '已释放', title: '实例强制释放销毁', description: '管理员从后台彻底释放实例资源，回收显卡硬件并结清账单', operator: `${user.name} (管理员)` }
        ];
        return {
          ...o,
          status: '已释放',
          releaseTime: nowStr,
          pendingAmount: 0,
          timeline: newTimeline
        };
      }
      return o;
    }));

    // 实例已释放，不再占用实时运维硬件监控，安全从监控大盘中移除
    setComputeRunningInstances(prev => prev.filter(inst => {
      if (inst.orderId === orderId || (linkedInstId && (inst.id === linkedInstId || inst.instanceId === linkedInstId))) {
        return false;
      }
      return true;
    }));

    showToast(`订单 ${orderId} 实例资源已强制释放并销毁，监控列表已同步移除`);
  };

  const retryComputeOrder = (orderId: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const newInstId = `i-retry${Date.now().toString().slice(-6)}`;

    setComputeOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNo === orderId) {
        const newTimeline = [
          ...(o.timeline || []),
          { time: nowStr, status: '运行中', title: '重新分配调度就绪', description: `管理员手动重试调度，已重新在资源池完成物理节点绑定并就绪 (实例ID: ${newInstId})`, operator: `${user.name} (管理员)` }
        ];
        return {
          ...o,
          status: '运行中',
          instanceId: newInstId,
          startTime: nowStr,
          errorMessage: undefined,
          timeline: newTimeline
        };
      }
      return o;
    }));

    // 在运行实例监控中补充分配成功的实例
    const targetOrder = computeOrders.find(o => o.id === orderId || o.orderNo === orderId);
    if (targetOrder) {
      const newRunningInst: ComputeRunningInstanceItem = {
        id: newInstId,
        instanceId: newInstId,
        orderId: targetOrder.id,
        userId: targetOrder.userId,
        userName: targetOrder.userName,
        userAvatar: targetOrder.userAvatar,
        userPhone: targetOrder.userPhone || '13800000000',
        specName: targetOrder.specName,
        gpuSpec: targetOrder.specName,
        gpuModel: targetOrder.gpuModel || 'NVIDIA GPU',
        gpuCount: targetOrder.gpuCount || 1,
        cpuCores: 16,
        ramGb: 64,
        diskGb: 500,
        imageName: targetOrder.imageName,
        operator: targetOrder.operator,
        poolId: targetOrder.poolId,
        hostNode: 'node-gpu-failover-01',
        ipAddress: '10.0.9.99',
        publicIp: '123.57.199.99',
        createdAt: nowStr,
        startTime: nowStr,
        runningHours: '0.1h',
        runningDuration: '刚刚启动',
        gpuUsage: 12,
        gpuUtil: 12,
        vramUsage: 18,
        vramUsed: '4.2GB',
        vramTotal: '24.0GB',
        ramUsage: 20,
        ramUsed: '12.8GB / 64GB',
        cpuUtil: 15,
        diskUsage: 15,
        temp: 45,
        power: '120W / 450W',
        health: '良好',
        gpuUsageHistory: [10, 12],
        vramUsageHistory: [15, 18],
        metricHistory: [
          { time: nowStr.slice(11, 16), gpu: 12, vram: 18, cpu: 15, ram: 20, temp: 45, power: 120 }
        ],
        sshCommand: 'ssh root@123.57.199.99 -p 22022',
        jupyterUrl: 'http://123.57.199.99:8888',
        status: '运行中',
        logs: [
          { time: nowStr.slice(11), level: 'INFO', message: 'Manual failover allocation succeeded. Container booted.', source: 'Scheduler' }
        ]
      };
      setComputeRunningInstances(prev => [newRunningInst, ...prev]);
    }

    showToast('已重新触发实例调度分配，新实例已启动并加入实时监控');
  };

  const refundComputeOrder = (orderId: string, refundAmount: number, reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setComputeOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNo === orderId) {
        const currentRefund = (o.refundAmount || 0) + refundAmount;
        const newRefundLogs = [
          ...(o.refundLogs || []),
          {
            id: `rf_${Date.now()}`,
            time: nowStr,
            amount: refundAmount,
            reason: reason || '管理员后台发起财务退款',
            operator: `${user.name} (管理员)`,
            status: '已退款' as const
          }
        ];
        const newBillingLogs = [
          ...(o.billingLogs || []),
          {
            id: `bl_rf_${Date.now()}`,
            time: nowStr,
            type: '退款返还' as const,
            amount: -refundAmount,
            balanceAfter: (o.orderAmount || 0) - currentRefund,
            note: `后台退款: ${reason || '订单退费核算处理'}`
          }
        ];
        const newTimeline = [
          ...(o.timeline || []),
          {
            time: nowStr,
            status: o.status,
            title: '财务退款处理完成',
            description: `成功退款 ¥${refundAmount.toFixed(2)}。原因：${reason || '核算退费'}`,
            operator: `${user.name} (管理员)`
          }
        ];

        return {
          ...o,
          refundAmount: currentRefund,
          refundLogs: newRefundLogs,
          billingLogs: newBillingLogs,
          timeline: newTimeline
        };
      }
      return o;
    }));

    showToast(`订单 ${orderId} 成功处理退款 ¥${refundAmount.toFixed(2)}，已生成财务对账流水！`);
  };

  const changeComputeOrderBilling = (orderId: string, newBillingType: string, reason: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setComputeOrders(prev => prev.map(o => {
      if (o.id === orderId || o.orderNo === orderId) {
        const oldType = o.billingType;
        const newChanges = [
          ...(o.billingChanges || []),
          {
            id: `bc_${Date.now()}`,
            changeTime: nowStr,
            oldBillingType: oldType,
            newBillingType: newBillingType,
            operator: `${user.name} (管理员)`,
            reason: reason || '管理员调整计费模式'
          }
        ];
        const newTimeline = [
          ...(o.timeline || []),
          {
            time: nowStr,
            status: o.status,
            title: '计费模式变更',
            description: `计费模式由【${oldType}】调整为【${newBillingType}】。说明：${reason || '后台配置变更'}`,
            operator: `${user.name} (管理员)`
          }
        ];

        return {
          ...o,
          billingType: newBillingType,
          billingChanges: newChanges,
          timeline: newTimeline
        };
      }
      return o;
    }));

    showToast(`订单 ${orderId} 计费模式已成功调整为【${newBillingType}】！`);
  };

  // 5. 运行实例操作与双向联动
  const restartComputeRunningInstance = (id: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setComputeRunningInstances(prev => prev.map(inst => {
      if (inst.id === id || inst.instanceId === id) {
        const newLogs = [
          ...(inst.logs || []),
          { time: nowStr.slice(11), level: 'INFO' as const, message: 'Instance soft restart executed by operator. Container recycled.', source: 'Admin Action' }
        ];
        return {
          ...inst,
          logs: newLogs
        };
      }
      return inst;
    }));
    showToast(`已向宿主机下发实例 ${id} 重启指令，容器正在重新初始化...`);
  };

  const stopComputeRunningInstance = (id: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let targetOrderId: string | undefined;

    setComputeRunningInstances(prev => prev.map(i => {
      if (i.id === id || i.instanceId === id) {
        targetOrderId = i.orderId;
        const newLogs = [
          ...(i.logs || []),
          { time: nowStr.slice(11), level: 'WARN' as const, message: 'Instance manually powered off from monitor console.', source: 'Ops Console' }
        ];
        return {
          ...i,
          status: '已停止',
          gpuUsage: 0,
          gpuUtil: 0,
          vramUsage: 0,
          vramUsed: '0.0GB',
          ramUsage: 5,
          ramUsed: '2.0GB',
          cpuUtil: 0,
          temp: 35,
          power: '25W',
          health: '良好',
          stoppedAt: nowStr,
          logs: newLogs
        };
      }
      return i;
    }));

    // 同步更新订单状态为已停止
    if (targetOrderId || id) {
      setComputeOrders(prev => prev.map(o => {
        if (o.id === targetOrderId || o.orderNo === targetOrderId || o.instanceId === id) {
          const newTimeline = [
            ...(o.timeline || []),
            { time: nowStr, status: '已停止', title: '运维监控停机', description: '运维人员在监控中心强制关机，GPU资源已挂起', operator: `${user.name} (运维)` }
          ];
          return {
            ...o,
            status: '已停止',
            stopTime: nowStr,
            timeline: newTimeline
          };
        }
        return o;
      }));
    }

    showToast(`实例 ${id} 已安全关机，对应订单状态已联动更新为【已停止】`);
  };

  const releaseComputeRunningInstance = (id: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let targetOrderId: string | undefined;

    const targetInst = computeRunningInstances.find(i => i.id === id || i.instanceId === id);
    if (targetInst) {
      targetOrderId = targetInst.orderId;
    }

    // 从监控列表中安全移除
    setComputeRunningInstances(prev => prev.filter(i => i.id !== id && i.instanceId !== id));

    // 同步更新订单状态为已释放
    setComputeOrders(prev => prev.map(o => {
      if (o.id === targetOrderId || o.orderNo === targetOrderId || o.instanceId === id) {
        const newTimeline = [
          ...(o.timeline || []),
          { time: nowStr, status: '已释放', title: '运维监控强制释放', description: '运维人员在监控中心强制释放销毁实例，GPU已归还资源池', operator: `${user.name} (运维)` }
        ];
        return {
          ...o,
          status: '已释放',
          releaseTime: nowStr,
          pendingAmount: 0,
          timeline: newTimeline
        };
      }
      return o;
    }));

    showToast(`实例 ${id} 已彻底释放并销毁，对应订单已结清并更新为【已释放】`);
  };

  // 6. 对账结算操作
  const confirmComputeSettlement = (id: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setComputeSettlements(prev => prev.map(s => s.id === id ? {
      ...s,
      status: '已确认',
      confirmedAt: nowStr,
      confirmedBy: `${user.name} (财务主管)`
    } : s));
    showToast('对账单已成功确认，进入待打款/结算状态！');
  };

  const markComputeSettlementPaid = (
    id: string,
    invoiceNo?: string,
    paymentVoucher?: string,
    paymentMethod: string = '企业对公银行电汇',
    remark?: string
  ) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    setComputeSettlements(prev => prev.map(s => s.id === id ? {
      ...s,
      status: '已结算',
      invoiceNo: invoiceNo || `FP-${Date.now().toString().slice(-6)}`,
      paymentVoucher: paymentVoucher || `VOUCHER-${Date.now().toString().slice(-8)}`,
      paymentMethod,
      settledAt: nowStr,
      paidBy: `${user.name} (出纳专员)`,
      remark: remark || s.remark
    } : s));
    showToast('已完成对账结算打款确认并归档！');
  };

  const generateComputeSettlement = (operator: string, period: string) => {
    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const count = computeSettlements.length + 1;
    const periodTag = period.replace(/[^0-9]/g, '').slice(0, 6) || '202608';
    const statementNo = `ST-${periodTag}-${String(count).padStart(3, '0')}`;

    // 查找该运营商在资源池里的规格与协议单价
    const matchedPool = computePools.find(p => p.operator.includes(operator) || operator.includes(p.operator));
    const agreedList = matchedPool?.agreedPricings || [
      { gpuModel: 'RTX 4090 (单卡)', agreedPrice: 1.45, effectiveDate: '2026-01-01' },
      { gpuModel: 'A100 SXM4 (80G)', agreedPrice: 6.80, effectiveDate: '2026-01-01' }
    ];

    const specDetails = agreedList.map((item, idx) => {
      const hours = idx === 0 ? 1120 : 640;
      const subtotal = Number((hours * item.agreedPrice).toFixed(2));
      return {
        gpuModel: item.gpuModel,
        hours,
        agreedPrice: item.agreedPrice,
        subtotal,
        percentage: idx === 0 ? 63.6 : 36.4
      };
    });

    const totalCardHours = specDetails.reduce((a, b) => a + b.hours, 0);
    const payableAmount = Number(specDetails.reduce((a, b) => a + b.subtotal, 0).toFixed(2));
    const avgAgreedPrice = totalCardHours > 0 ? Number((payableAmount / totalCardHours).toFixed(2)) : 1.5;
    const platformRevenue = Number((payableAmount * 1.32).toFixed(2));
    const platformGrossProfit = Number((platformRevenue - payableAmount).toFixed(2));
    const grossMargin = Number(((platformGrossProfit / platformRevenue) * 100).toFixed(1));

    const newStl: ComputeSettlementItem = {
      id: `stl_${Date.now()}`,
      statementNo,
      operator,
      period,
      totalCardHours,
      specDetails,
      agreedPrice: avgAgreedPrice,
      payableAmount,
      platformRevenue,
      platformGrossProfit,
      grossMargin,
      status: '待对账',
      createdAt: nowStr,
      remark: `系统自动汇总 ${operator} 在 ${period} 的实际 GPU 消耗数据并生成对账单`
    };
    setComputeSettlements(prev => [newStl, ...prev]);
    showToast(`已生成 ${operator}【${statementNo}】算力消耗对账单！`);
  };
  
  // 任务导航状态
  const [selectedTaskIdForDetail, setSelectedTaskIdForDetail] = useState<string | null>(null);
  const [selectedTaskForVerification, setSelectedTaskForVerification] = useState<TaskItem | null>(null);

  // 社区帖子跳转与来源追踪
  const [selectedPostIdForDetail, setSelectedPostIdForDetail] = useState<string | null>(null);
  const [selectedPostDetailOrigin, setSelectedPostDetailOrigin] = useState<string | null>(null);

  const openPostDetailWithOrigin = (postId: string, origin: string = 'community') => {
    setSelectedPostIdForDetail(postId);
    setSelectedPostDetailOrigin(origin);
    setActiveTab('community');
  };

  // Modals & Selection
  const [sandboxAgentState, setSandboxAgentState] = useState<AgentItem | null>(null);
  const [detailModalAgent, setDetailModalAgent] = useState<AgentItem | null>(null);
  const [subscribeModalAgent, setSubscribeModalAgent] = useState<AgentItem | null>(null);
  const [quotaModalAgent, setQuotaModalAgent] = useState<AgentItem | null>(null);
  const [trialCountLeft, setTrialCountLeft] = useState<number>(() => {
    const saved = localStorage.getItem('trialCountLeft');
    return saved !== null ? Number(saved) : 25;
  });

  useEffect(() => {
    localStorage.setItem('trialCountLeft', String(trialCountLeft));
  }, [trialCountLeft]);

  const [subscriptions, setSubscriptions] = useState<Record<string, AgentSubscriptionItem>>({
    ag_22: {
      agentId: 'ag_22',
      agentName: '企业客服Agent',
      tier: 'year',
      tierName: '企业年度订阅',
      price: 2999,
      tokenAmountVal: 5000000,
      tokensLeftVal: 4620000,
      expireDate: '2027-09-20',
      subscribedAt: '2026-09-20'
    },
    ag_new_01: {
      agentId: 'ag_new_01',
      agentName: 'AI 图像提示词工程师',
      tier: 'month',
      tierName: '月度订阅',
      price: 99,
      tokenAmountVal: 500000,
      tokensLeftVal: 385000,
      expireDate: '2026-10-24',
      subscribedAt: '2026-09-24'
    },
    ag_new_02: {
      agentId: 'ag_new_02',
      agentName: '结构化数据提取专家',
      tier: 'quarter',
      tierName: '季度订阅',
      price: 269,
      tokenAmountVal: 1500000,
      tokensLeftVal: 1120000,
      expireDate: '2026-12-24',
      subscribedAt: '2026-09-24'
    },
    ag_new_03: {
      agentId: 'ag_new_03',
      agentName: '会议纪要与行动项生成器',
      tier: 'month',
      tierName: '月度订阅',
      price: 69,
      tokenAmountVal: 300000,
      tokensLeftVal: 270000,
      expireDate: '2026-10-24',
      subscribedAt: '2026-09-24'
    },
    ag_new_04: {
      agentId: 'ag_new_04',
      agentName: '智能合同审核助手',
      tier: 'year',
      tierName: '法务年度订阅',
      price: 1899,
      tokenAmountVal: 3000000,
      tokensLeftVal: 2890000,
      expireDate: '2027-08-15',
      subscribedAt: '2026-08-15'
    },
    ag_new_08: {
      agentId: 'ag_new_08',
      agentName: '深度投研研报速读器',
      tier: 'quarter',
      tierName: '金融机构季度订阅',
      price: 599,
      tokenAmountVal: 2000000,
      tokensLeftVal: 1750000,
      expireDate: '2026-11-30',
      subscribedAt: '2026-08-30'
    },
    ag_new_09: {
      agentId: 'ag_new_09',
      agentName: '自动化单元测试编写助手',
      tier: 'month',
      tierName: '开发者月度订阅',
      price: 129,
      tokenAmountVal: 800000,
      tokensLeftVal: 640000,
      expireDate: '2026-10-18',
      subscribedAt: '2026-09-18'
    },
    ag_new_10: {
      agentId: 'ag_new_10',
      agentName: '英语口语私教与发音润色',
      tier: 'month',
      tierName: '个人专业月卡',
      price: 49,
      tokenAmountVal: 300000,
      tokensLeftVal: 210000,
      expireDate: '2026-10-12',
      subscribedAt: '2026-09-12'
    }
  });
  const [payPerTokenAgents, setPayPerTokenAgents] = useState<Record<string, boolean>>({});

  const setSandboxAgent = (agent: AgentItem | null) => {
    setSandboxAgentState(agent);
    if (agent) {
      setDetailModalAgent(agent);
    }
  };

  const openAgentDetail = (agent: AgentItem) => {
    setDetailModalAgent(agent);
  };

  const openAgentSubscribe = (agent: AgentItem) => {
    setSubscribeModalAgent(agent);
  };

  const [tryoutModel, setTryoutModel] = useState<ModelItem | null>(null);
  const [detailModel, setDetailModel] = useState<ModelItem | null>(null);

  const openModelDetail = (model: ModelItem) => {
    setDetailModel(model);
  };

  const [detailDataset, setDetailDataset] = useState<DatasetItem | null>(null);
  const openDatasetDetail = (dataset: DatasetItem) => {
    setDetailDataset(dataset);
  };

  const [detailSkill, setDetailSkill] = useState<SkillPluginItem | null>(null);
  const openSkillDetail = (skill: SkillPluginItem) => {
    setDetailSkill(skill);
  };

  const [selectedCompareModels, setSelectedCompareModels] = useState<ModelItem[]>([]);

  // Competitions
  const [competitions] = useState<CompetitionItem[]>(mockCompetitions);
  const [selectedCompetitionId, setSelectedCompetitionId] = useState<string | null>(null);

  // Tab reset keys to force fresh initial view on menu switches
  const [tabResetKey, setTabResetKey] = useState<Record<MainTabType, number>>({
    home: 0,
    marketplace: 0,
    tasks: 0,
    compute: 0,
    creative: 0,
    community: 0,
    workspace: 0,
  });

  // Backend Admin System State
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [activeAdminMenu, setActiveAdminMenu] = useState<AdminMenuKey>('operations');

  const enterAdminMode = (defaultMenu: AdminMenuKey = 'operations') => {
    setIsAdminMode(true);
    setActiveAdminMenu(defaultMenu);
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  };

  const exitAdminMode = () => {
    setIsAdminMode(false);
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch {
      // ignore
    }
  };

  const handleSetActiveTab = (tab: MainTabType) => {
    // If in admin mode, exiting back to frontend
    setIsAdminMode(false);

    // Reset all sub-page states across modules to their clean initial default
    setSelectedCompetitionId(null);
    setMarketplaceTab('agent');
    setWorkspaceSubTab('points');
    setSelectedCompareModels([]);
    setDetailModalAgent(null);
    setSubscribeModalAgent(null);
    setQuotaModalAgent(null);
    setDetailModel(null);
    setTryoutModel(null);
    setDetailInstance(null);
    setCreateComputePreset(null);
    setCreateComputeModalOpen(false);
    setCreateAgentModalOpen(false);
    setPublishTaskModalOpen(false);
    setHistoryModalOpen(false);

    // Bump reset key for this tab to force clean re-mount and reset internal subpage states
    setTabResetKey(prev => ({
      ...prev,
      [tab]: (prev[tab] || 0) + 1
    }));

    // Scroll window and document element back to top
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    } catch {
      // ignore fallback
    }

    setActiveTab(tab);
  };

  const openCompetitionDetail = (compId: string) => {
    const targetComp = competitions.find(c => c.id === compId);
    if (targetComp?.isInternalOnly) {
      showToast('本赛事为企业内部专有赛事，仅限受邀人员参与，暂不面向大众开放报名。敬请关注后续更多公开赛事。');
      return;
    }
    handleSetActiveTab('creative');
    // Set selected competition detail explicitly after resetting tab
    setSelectedCompetitionId(compId);
  };

  const [createAgentModalOpen, setCreateAgentModalOpen] = useState<boolean>(false);
  const [publishTaskModalOpen, setPublishTaskModalOpen] = useState<boolean>(false);
  const [createComputeModalOpen, setCreateComputeModalOpen] = useState<boolean>(false);
  const [createComputePreset, setCreateComputePreset] = useState<{ mode?: 'container' | 'server'; scene?: GPUInstance['scene']; imageName?: string; card?: RentalGPUCard } | null>(null);
  const [detailInstance, setDetailInstance] = useState<GPUInstance | null>(null);
  const [historyModalOpen, setHistoryModalOpen] = useState<boolean>(false);

  const [toast, setToast] = useState<string | null>(null);

  const setSelectedMainTab = (tab: MainTabType) => setActiveTab(tab);

  const userAgents = agents.filter(a => 
    a.author === user.name || 
    a.author === 'zj' || 
    a.id.startsWith('ag_custom') || 
    a.id.startsWith('app_') || 
    a.isDeveloped || 
    a.isPurchased || 
    !!subscriptions[a.id] || 
    !!payPerTokenAgents[a.id]
  );
  const favorites = agents.filter(a => favoriteAgentIds.includes(a.id));

  const purchaseAgent = (agentId: string) => {
    setAgents(prev => prev.map(a => a.id === agentId ? { ...a, isPurchased: true } : a));
    setSubscriptions(prev => {
      if (prev[agentId]) return prev;
      const targetAgent = agents.find(a => a.id === agentId);
      return {
        ...prev,
        [agentId]: {
          agentId,
          agentName: targetAgent?.name || '未知Agent',
          tier: 'month',
          tierName: '月度订阅',
          price: 0,
          tokenAmountVal: 100,
          tokensLeftVal: 100,
          expireDate: new Date(Date.now() + 30 * 86400000).toLocaleDateString('zh-CN'),
          subscribedAt: new Date().toLocaleDateString('zh-CN')
        }
      };
    });
    showToast('已成功添加使用权限，可在工作台/我的Agent中随时管理！');
  };

  const toggleFavoriteAgent = (agentId: string) => {
    setFavoriteAgentIds(prev => {
      if (prev.includes(agentId)) {
        showToast('已取消收藏');
        return prev.filter(id => id !== agentId);
      } else {
        showToast('已加入我的收藏');
        return [...prev, agentId];
      }
    });
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('已全部标记为已读');
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markNotificationsAsRead = (ids: string[]) => {
    if (!ids || ids.length === 0) return;
    const idSet = new Set(ids);
    setNotifications(prev => prev.map(n => idSet.has(n.id) ? { ...n, read: true } : n));
  };

  const openModal = (modalType: string) => {
    if (modalType === 'createAgent') setCreateAgentModalOpen(true);
    else if (modalType === 'publishTask') setPublishTaskModalOpen(true);
    else if (modalType === 'createCompute') setCreateComputeModalOpen(true);
    else if (modalType === 'history') setHistoryModalOpen(true);
  };

  const createApiKey = (nameOrItem: string | Omit<ApiKeyItem, 'id'>, scope?: string, limit?: number) => {
    if (typeof nameOrItem === 'object') {
      const newKey: ApiKeyItem = {
        id: `key_${Date.now()}`,
        ...nameOrItem
      };
      setApiKeys(prev => [newKey, ...prev]);
    } else {
      const rawSecret = `qj_sk_${Math.random().toString(36).substring(2, 18)}`;
      const newKey: ApiKeyItem = {
        id: `key_${Date.now()}`,
        name: nameOrItem,
        prefix: `qj_sk_${Math.random().toString(36).substring(2, 8)}...`,
        keySecret: rawSecret,
        scope: scope || 'Full Access',
        dailyLimit: limit || 10000,
        usedToday: 0,
        totalCalls: 0,
        createdAt: '刚刚',
        lastUsedAt: '从未使用',
        status: 'active'
      };
      setApiKeys(prev => [newKey, ...prev]);
    }
    showToast('成功创建 API Key！');
  };

  const revokeApiKey = (id: string) => {
    setApiKeys(prev => prev.map(k => k.id === id ? { ...k, status: 'revoked' } : k));
    showToast('API Key 已撤销失效');
  };

  const checkInToday = () => {
    if (hasCheckedInToday) {
      showToast('今日已签到，明日再来吧！');
      return;
    }
    setHasCheckedInToday(true);
    const earnedPoints = 5;
    setUser(prev => ({
      ...prev,
      points: prev.points + earnedPoints,
      todayEarnedPoints: prev.todayEarnedPoints + earnedPoints
    }));
    const newRecord: PointRecord = {
      id: `pr_${Date.now()}`,
      title: '每日签到领积分',
      amount: earnedPoints,
      type: 'earn',
      source: '每日签到',
      timestamp: '刚刚'
    };
    setPointRecords(prev => [newRecord, ...prev]);

    // Update onboarding task
    setOnboardingTasks(prev => prev.map(t => t.actionKey === 'checkin' ? { ...t, completed: true } : t));

    showToast(`🎉 签到成功！已获取 +${earnedPoints} 积分`);
  };

  const completeOnboardingTask = (taskId: string) => {
    setOnboardingTasks(prev => prev.map(t => {
      if (t.id === taskId && !t.completed) {
        setUser(u => ({ ...u, points: u.points + t.pointsReward }));
        showToast(`完成任务【${t.title}】！获得 +${t.pointsReward} 积分`);
        return { ...t, completed: true };
      }
      return t;
    }));
  };

  const toggleCompareModel = (model: ModelItem) => {
    if (selectedCompareModels.some(m => m.id === model.id)) {
      setSelectedCompareModels(prev => prev.filter(m => m.id !== model.id));
      showToast(`已将 ${model.name} 从对比项移除`);
    } else {
      if (selectedCompareModels.length >= 3) {
        showToast('最多同时对比 3 个模型');
        return;
      }
      setSelectedCompareModels(prev => [...prev, model]);
      showToast(`已添加 ${model.name} 到对比模型列表`);
    }
  };

  const clearCompareModels = () => {
    setSelectedCompareModels([]);
  };

  const addAgent = (newAgentData: Omit<AgentItem, 'id' | 'rating' | 'ratingCount' | 'usageCount' | 'createdAt'>) => {
    const newAgent: AgentItem = {
      ...newAgentData,
      id: `ag_custom_${Date.now()}`,
      rating: 5.0,
      ratingCount: 1,
      usageCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };
    setAgents(prev => [newAgent, ...prev]);
    showToast(` Agent【${newAgent.name}】创建成功并上线！`);
  };

  const addTask = (newTaskData: any) => {
    const cashReq = Number(newTaskData.totalCashReward ?? newTaskData.cashReward ?? newTaskData.bounty ?? 0);
    const pointsReq = Number(newTaskData.totalPointsReward ?? newTaskData.pointsReward ?? 0);

    // 检查可用资金与积分
    if (user.balance < cashReq) {
      showToast(`可用余额不足 (需 ¥${cashReq.toLocaleString()}，当前可用 ¥${user.balance.toLocaleString()})，请先充值`);
      return;
    }
    if (user.points < pointsReq) {
      showToast(`可用积分不足 (需 ${pointsReq} 积分，当前可用 ${user.points} 积分)`);
      return;
    }

    // 资金与积分转入冻结
    setUser(prev => ({
      ...prev,
      balance: Math.max(0, prev.balance - cashReq),
      frozenBalance: (prev.frozenBalance || 0) + cashReq,
      points: Math.max(0, prev.points - pointsReq),
      frozenPoints: (prev.frozenPoints || 0) + pointsReq
    }));

    const newTask: TaskItem = {
      id: `tsk_${Date.now()}`,
      title: newTaskData.title?.trim() || '未命名任务',
      taskType: '标准任务',
      brief: newTaskData.brief || newTaskData.description?.replace(/<[^>]+>/g, '').slice(0, 50) || '任务简述',
      domain: newTaskData.domain || '技术开发',
      difficulty: newTaskData.difficulty || '简单',
      description: newTaskData.description || '',
      acceptanceCriteria: newTaskData.acceptanceCriteria || '',
      cashReward: cashReq,
      pointsReward: pointsReq,
      totalCashReward: cashReq,
      totalPointsReward: pointsReq,
      startTime: newTaskData.startTime || new Date().toISOString().replace('T', ' ').substring(0, 19),
      endTime: newTaskData.endTime || new Date(Date.now() + 14 * 86400000).toISOString().replace('T', ' ').substring(0, 19),
      remainingDays: 14,
      publisher: user.name,
      publisherAvatar: user.avatar,
      publishTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      status: '审核中', // 发布任务默认进入审核中
      acceptedCount: 0,
      submittedCount: 0,
      verifiedCount: 0,
      takers: [],
      submissions: [],
      // 兼容字段
      bounty: cashReq,
      bountyUnit: '¥'
    };

    setTasks(prev => [newTask, ...prev]);
    showToast(`任务【${newTask.title}】已提交审核！已预付托管 ¥${cashReq.toLocaleString()} 及 ${pointsReq} 积分`);
  };

  const auditTask = (taskId: string, approved: boolean, remark?: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (approved) {
          showToast(`已审核通过任务【${t.title}】，已上架并在大厅展示！`);
          return {
            ...t,
            status: '进行中' as const,
            auditTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        } else {
          // 审核驳回：若发布者是当前用户，全额解冻退还
          if (t.publisher === user.name) {
            const refundCash = t.cashReward || t.totalCashReward || (t.bounty || 0);
            const refundPoints = t.pointsReward || t.totalPointsReward || 0;
            setUser(u => ({
              ...u,
              balance: u.balance + refundCash,
              frozenBalance: Math.max(0, (u.frozenBalance || 0) - refundCash),
              points: u.points + refundPoints,
              frozenPoints: Math.max(0, (u.frozenPoints || 0) - refundPoints)
            }));
          }
          showToast(`已驳回任务【${t.title}】，预付托管资金已全额解冻退回！`);
          return {
            ...t,
            status: '已驳回' as const,
            rejectReason: remark || '任务描述不够详尽或存在违规内容，请修改后重新提交。',
            auditTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
      }
      return t;
    }));
  };

  const withdrawTask = (taskId: string) => {
    deleteTask(taskId);
  };

  const deleteTask = (taskId: string) => {
    setTasks(prev => {
      const target = prev.find(t => t.id === taskId);
      if (!target) return prev;
      if (target.publisher === user.name && target.status === '审核中') {
        const refundCash = target.cashReward || target.totalCashReward || 0;
        const refundPoints = target.pointsReward || target.totalPointsReward || 0;
        setUser(u => ({
          ...u,
          balance: u.balance + refundCash,
          frozenBalance: Math.max(0, (u.frozenBalance || 0) - refundCash),
          points: u.points + refundPoints,
          frozenPoints: Math.max(0, (u.frozenPoints || 0) - refundPoints)
        }));
        showToast(`已删除任务【${target.title}】，预付托管资金已全额退回可用账户`);
      } else {
        showToast(`已成功删除任务【${target.title}】`);
      }
      return prev.filter(t => t.id !== taskId);
    });
  };

  const takeTask = (taskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        if (t.status === '已结束' || t.status === '已验收') {
          showToast('该任务已结束，无法继续接单');
          return t;
        }
        if (t.status !== '进行中' && t.status !== '已发布') {
          showToast('该任务当前不可接单');
          return t;
        }
        // 上限人数校验
        if (t.maxTakersLimit && (t.acceptedCount || 0) >= t.maxTakersLimit) {
          showToast(`该任务已达到最高接单人数限制 (${t.maxTakersLimit}人)`);
          return t;
        }
        // 检查是否已接单
        const existing = (t.takers || []).find(tk => tk.username === user.name || tk.username.includes('你'));
        if (existing) {
          showToast('您已经接单该任务，请在“我接单的任务”中提交交付成果');
          return t;
        }
        const newTaker = {
          id: `tk_${Date.now()}`,
          taskId,
          username: `${user.name} (你)`,
          userAvatar: user.avatar,
          takeTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
          status: '已接单' as const
        };
        const updatedStatus = t.status === '已发布' ? '进行中' : t.status;
        showToast(`成功接单【${t.title}】！`);
        return {
          ...t,
          status: updatedStatus,
          acceptedCount: (t.acceptedCount || 0) + 1,
          takers: [newTaker, ...(t.takers || [])]
        };
      }
      return t;
    }));
  };

  const submitTaskResult = (taskId: string, notes: string, files: { name: string; size: string }[]) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (targetTask && (targetTask.status === '已结束' || targetTask.status === '已验收')) {
      showToast('该任务发布者已验收结束，无法继续提交成果');
      return;
    }

    const subId = `sub_${Date.now()}`;
    const newSubmission = {
      id: subId,
      taskId,
      username: `${user.name} (你)`,
      userAvatar: user.avatar,
      submitTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes,
      files: files.map((f, i) => ({ id: `f_${Date.now()}_${i}`, name: f.name, size: f.size })),
      status: '待验收' as const
    };

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        // 如果该极客之前已有提交记录（例如被驳回的记录），则替换为最新修改成果，状态恢复为【待验收】
        const isMySubmission = (s: any) =>
          s.username === user.name || s.username.includes('你') || s.username.includes('极客小千') || s.username.includes(user.name);
        
        const hasExistingSub = (t.submissions || []).some(isMySubmission);
        const finalSubmissions = hasExistingSub
          ? (t.submissions || []).map(s => isMySubmission(s) ? newSubmission : s)
          : [newSubmission, ...(t.submissions || [])];

        const updatedTakers = (t.takers || []).map(tk => {
          if (tk.username === user.name || tk.username.includes('你') || tk.username.includes('极客小千') || tk.username.includes(user.name)) {
            return { ...tk, status: '已提交' as const, submissionId: subId, submission: newSubmission };
          }
          return tk;
        });

        // 如果之前没有 taker 记录，自动补上
        const hasTaker = updatedTakers.some(tk => tk.username.includes(user.name) || tk.username.includes('你') || tk.username.includes('极客小千'));
        const finalTakers = hasTaker ? updatedTakers : [
          {
            id: `tk_${Date.now()}`,
            taskId,
            username: `${user.name} (你)`,
            userAvatar: user.avatar,
            takeTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
            status: '已提交' as const,
            submissionId: subId,
            submission: newSubmission
          },
          ...updatedTakers
        ];

        return {
          ...t,
          submittedCount: finalSubmissions.length,
          submissions: finalSubmissions,
          takers: finalTakers
        };
      }
      return t;
    }));

    showToast('交付成果已提交，请耐心等待雇主验收！');
  };

  const verifyTaskSubmission = (taskId: string, submissionId: string, approved: boolean, rejectReason?: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    let subTargetUser = '';
    let subTargetAvatar = '';
    let subNotes = '';

    const targetSub = targetTask.submissions?.find(s => s.id === submissionId);
    if (targetSub) {
      subTargetUser = targetSub.username;
      subTargetAvatar = targetSub.userAvatar;
      subNotes = targetSub.notes;
    }

    // 检查是否在驳回后触发到期全额退款
    const isTaskExpiredOrEnded = 
      targetTask.status === '已结束' || 
      (targetTask.remainingDays !== undefined && targetTask.remainingDays <= 0) || 
      (targetTask.endTime && new Date(targetTask.endTime.replace(' ', 'T')).getTime() <= Date.now());

    const otherSubs = (targetTask.submissions || []).filter(s => s.id !== submissionId);
    const willAllSubsBeRejected = !approved && (targetTask.submissions || []).length > 0 && otherSubs.every(s => s.status === '已驳回');
    const shouldRefund = willAllSubsBeRejected && isTaskExpiredOrEnded && !targetTask.refunded;

    const refundCash = targetTask.cashReward || targetTask.totalCashReward || (targetTask.bounty || 0);
    const refundPoints = targetTask.pointsReward || targetTask.totalPointsReward || 0;

    // 1. 更新任务列表状态
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        // 更新提交记录
        const updatedSubs = (t.submissions || []).map(s => {
          if (s.id === submissionId) {
            return {
              ...s,
              status: approved ? ('已通过' as const) : ('已驳回' as const),
              rejectReason: approved ? undefined : (rejectReason || '交付成果未能完全满足任务验收考核指标，发布人已驳回。请修改后重新提交。'),
              verifiedTime: nowStr
            };
          } else if (approved) {
            // 已驳回的接单人与成果保持 “已驳回” 状态（保留原有驳回原因与记录，不被覆盖）
            if (s.status === '已驳回') {
              return s;
            }
            // 其他所有已提交但未被选中的成果：状态全部变更为 “成果未通过”
            return {
              ...s,
              status: '成果未通过' as const,
              rejectReason: s.rejectReason || '发布人已验收通过其他接单人的交付方案，您的交付成果未被选为获胜方案（成果未通过）。'
            };
          }
          return s;
        });

        // 更新接单人记录
        const updatedTakers = (t.takers || []).map(tk => {
          const isWinnerTaker = tk.submissionId === submissionId || tk.username === subTargetUser;
          if (isWinnerTaker) {
            return {
              ...tk,
              status: approved ? ('已验收' as const) : ('已驳回' as const)
            };
          }

          if (approved) {
            const takerSub = (t.submissions || []).find(s => s.username === tk.username || s.id === tk.submissionId);
            // 已驳回的接单人保持 “已驳回” 状态
            if (tk.status === '已驳回' || takerSub?.status === '已驳回') {
              return {
                ...tk,
                status: '已驳回' as const
              };
            }
            // 其他所有已提交但未被选中的成果：对应接单人状态同步变更为 “成果未通过”
            if (takerSub || tk.status === '已提交' || tk.status === '成果未通过') {
              return {
                ...tk,
                status: '成果未通过' as const
              };
            }
            // 未提交的接单人保持原有未提交状态（“已接单” / “未提交成果”）
            return tk;
          }

          return tk;
        });

        if (shouldRefund) {
          return {
            ...t,
            status: '已结束' as const,
            refunded: true,
            refundTime: nowStr,
            refundReason: `任务已到期结束，发布人已驳回所有成果。预付赏金 ¥${refundCash.toLocaleString()} 及 ${refundPoints} 积分已全部退回至发布人账户。`,
            refundCash,
            refundPoints,
            submissions: updatedSubs,
            takers: updatedTakers
          };
        }

        return {
          ...t,
          verifiedCount: approved ? 1 : (t.verifiedCount || 0),
          status: approved ? ('已结束' as const) : t.status,
          winner: approved ? {
            username: subTargetUser,
            userAvatar: subTargetAvatar,
            passTime: nowStr,
            notes: subNotes
          } : t.winner,
          submissions: updatedSubs,
          takers: updatedTakers
        };
      }
      return t;
    }));

    // 2. 资金及积分结算 (在 setTasks 外安全执行)
    if (approved) {
      if (targetTask.publisher === user.name) {
        const cashAmount = targetTask.cashReward || 0;
        const pointsAmount = targetTask.pointsReward || 0;
        setUser(u => ({
          ...u,
          frozenBalance: Math.max(0, (u.frozenBalance || 0) - cashAmount),
          frozenPoints: Math.max(0, (u.frozenPoints || 0) - pointsAmount)
        }));
      }

      if (subTargetUser.includes(user.name) || subTargetUser.includes('你')) {
        const earnedCash = targetTask.cashReward || 0;
        const earnedPoints = targetTask.pointsReward || 0;
        setUser(u => ({
          ...u,
          balance: u.balance + earnedCash,
          points: u.points + earnedPoints,
          todayEarnedPoints: u.todayEarnedPoints + earnedPoints
        }));
        showToast(`🎉 恭喜！您的方案成果已被选为【验收通过】，赏金 ¥${earnedCash.toLocaleString()} 及 ${earnedPoints} 积分已到账！`);
      } else if (targetTask.publisher === user.name) {
        showToast(`已成功将【${subTargetUser}】的成果【选为通过】！赏金结算完毕，任务已顺利结束。`);
      }
    } else {
      if (shouldRefund) {
        const isPublisherCurrentUser = targetTask.publisher === user.name || 
          user.name.includes(targetTask.publisher) || 
          targetTask.publisher.includes('你') || 
          targetTask.publisher.includes('极客小千');

        if (isPublisherCurrentUser) {
          setUser(u => ({
            ...u,
            balance: u.balance + refundCash,
            frozenBalance: Math.max(0, (u.frozenBalance || 0) - refundCash),
            points: u.points + refundPoints,
            frozenPoints: Math.max(0, (u.frozenPoints || 0) - refundPoints)
          }));
        }

        showToast(`已成功驳回【${subTargetUser}】的成果。由于任务已到期且全部成果均已驳回，预付托管赏金 ¥${refundCash.toLocaleString()} 及 ${refundPoints} 积分已全部原路退还至发布人账户！`);
      } else {
        showToast(`已成功驳回【${subTargetUser}】提交的成果。发布人已驳回的成果无法选中作为验收成果。`);
      }
    }
  };

  const rejectAllAndRefund = (taskId: string, reason?: string) => {
    const targetTask = tasks.find(t => t.id === taskId);
    if (!targetTask) return;

    const nowStr = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const defaultReason = reason || '任务已到期截止，提交的成果未能达到立项考核验收标准，已全部驳回。';
    const refundCash = targetTask.cashReward || targetTask.totalCashReward || (targetTask.bounty || 0);
    const refundPoints = targetTask.pointsReward || targetTask.totalPointsReward || 0;

    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        const updatedSubs = (t.submissions || []).map(s => ({
          ...s,
          status: '已驳回' as const,
          rejectReason: s.status === '已驳回' ? s.rejectReason : defaultReason,
          verifiedTime: s.verifiedTime || nowStr
        }));

        const updatedTakers = (t.takers || []).map(tk => {
          const hasSub = (t.submissions || []).some(s => s.username === tk.username || s.id === tk.submissionId);
          if (hasSub || tk.status === '已提交' || tk.status === '已驳回') {
            return {
              ...tk,
              status: '已驳回' as const
            };
          }
          return tk;
        });

        return {
          ...t,
          status: '已结束' as const,
          refunded: true,
          refundTime: nowStr,
          refundReason: `任务已到期结束，发布人已驳回所有成果。预付赏金 ¥${refundCash.toLocaleString()} 及 ${refundPoints} 积分已全部原路退还至发布人账户。`,
          refundCash,
          refundPoints,
          submissions: updatedSubs,
          takers: updatedTakers
        };
      }
      return t;
    }));

    if (!targetTask.refunded) {
      const isPublisherCurrentUser = targetTask.publisher === user.name || 
        user.name.includes(targetTask.publisher) || 
        targetTask.publisher.includes('你') || 
        targetTask.publisher.includes('极客小千');

      if (isPublisherCurrentUser) {
        setUser(u => ({
          ...u,
          balance: u.balance + refundCash,
          frozenBalance: Math.max(0, (u.frozenBalance || 0) - refundCash),
          points: u.points + refundPoints,
          frozenPoints: Math.max(0, (u.frozenPoints || 0) - refundPoints)
        }));
      }
    }

    showToast(`任务已到期结束且所有成果已全部驳回，托管赏金 ¥${refundCash.toLocaleString()} 与 ${refundPoints} 积分已全部全额退回至发布人账户！`);
  };

  const updateTask = (updatedTask: TaskItem) => {
    setTasks(prev => {
      const existing = prev.find(t => t.id === updatedTask.id);
      if (existing && existing.status === '已驳回') {
        const cashReq = updatedTask.cashReward || updatedTask.totalCashReward || 0;
        const pointsReq = updatedTask.pointsReward || updatedTask.totalPointsReward || 0;
        setUser(u => ({
          ...u,
          balance: Math.max(0, u.balance - cashReq),
          frozenBalance: (u.frozenBalance || 0) + cashReq,
          points: Math.max(0, u.points - pointsReq),
          frozenPoints: (u.frozenPoints || 0) + pointsReq
        }));
      }

      return prev.map(t => {
        if (t.id === updatedTask.id) {
          return {
            ...updatedTask,
            status: '审核中' as const,
            rejectReason: undefined,
            auditTime: undefined,
            publishTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
        }
        return t;
      });
    });
    showToast(`任务【${updatedTask.title}】已修改并重新提交审核！`);
  };

  const adminUpdateTask = (id: string, updates: Partial<TaskItem>) => {
    setTasks(prev => prev.map(t => {
      if (t.id === id) {
        return {
          ...t,
          ...updates,
          totalCashReward: updates.cashReward !== undefined ? updates.cashReward : t.totalCashReward,
          totalPointsReward: updates.pointsReward !== undefined ? updates.pointsReward : t.totalPointsReward,
        };
      }
      return t;
    }));
    showToast(`任务【${updates.title || '内容'}】已成功更新保存！`);
  };

  const submitTaskBid = (taskId: string, proposal: string, quoteAmount: number, estimatedDays: number, attachments?: string[]) => {
    showToast('交付方案已提交！');
  };

  const submitTaskDeliverable = (taskId: string, fileName: string, fileSize: string, summary: string, demoUrl?: string) => {
    submitTaskResult(taskId, summary, [{ name: fileName, size: fileSize }]);
  };

  const acceptTaskSubmission = (taskId: string, submissionId: string, comment?: string) => {
    verifyTaskSubmission(taskId, submissionId, true, comment);
  };

  const rejectTaskSubmission = (taskId: string, submissionId: string, comment: string) => {
    verifyTaskSubmission(taskId, submissionId, false, comment);
  };

  const launchGpuInstance = (scene: GPUInstance['scene'], gpuModel: string, imageName: string, customOpts?: Partial<GPUInstance>) => {
    let hourlyCost = 2.5;
    if (gpuModel.includes('4090') || gpuModel.includes('3090')) hourlyCost = 2.90;
    if (gpuModel.includes('V100') || gpuModel.includes('A10')) hourlyCost = 8.0;
    if (gpuModel.includes('A100')) hourlyCost = 25.0;

    const instanceType = customOpts?.instanceType || 'container';
    const gpuCount = customOpts?.gpuCount || 1;
    const region = customOpts?.region || '华北 · 北京';
    const billingType = customOpts?.billingType || '按量计费';

    const newInst: GPUInstance = {
      id: `inst_${instanceType === 'server' ? 's' : 'c'}_${Date.now().toString().slice(-4)}`,
      name: customOpts?.name || `${scene.toLowerCase()}-${gpuModel.split(' ')[0].toLowerCase()}-node`,
      instanceType,
      scene,
      gpuModel,
      gpuCount,
      vram: gpuModel.includes('A100') ? `${80 * gpuCount} GB` : gpuModel.includes('24GB') || gpuModel.includes('4090') || gpuModel.includes('3090') ? `${24 * gpuCount} GB` : '16 GB',
      cpu: customOpts?.cpu || '16 核',
      ram: customOpts?.ram || '64 GB',
      region,
      billingType,
      status: 'running',
      systemDisk: customOpts?.systemDisk || (instanceType === 'server' ? '100GB NVMe' : '50GB NVMe'),
      dataDisk: customOpts?.dataDisk || '200GB NVMe',
      publicIp: customOpts?.publicIp || `120.24.${Math.floor(Math.random()*200+10)}.${Math.floor(Math.random()*200+10)}`,
      osName: customOpts?.osName || 'Ubuntu 22.04 LTS (Docker 26.1)',
      ipAddress: `10.240.18.${Math.floor(Math.random() * 90 + 10)}:8888`,
      runningHours: 0.1,
      hourlyCost: hourlyCost * gpuCount,
      totalCost: (hourlyCost * gpuCount) * 0.1,
      createdAt: '刚刚',
      jupyterUrl: instanceType === 'container' ? `https://jupyter.qianji.ai/?token=qj_${Date.now()}` : undefined,
      vncUrl: instanceType === 'server' ? `https://vnc.qianji.ai/?node=${Date.now()}` : undefined,
      vscodeUrl: `https://vscode.qianji.ai/?instance=${Date.now()}`,
      sshCommand: `ssh -p ${Math.floor(Math.random() * 500 + 22000)} root@gpu-cluster.qianji.ai`,
      imageName,
      monitoring: {
        gpuUsage: [15, 30, 45, 60, 80, 85, 90, 88],
        vramUsage: [20, 35, 50, 65, 75, 82, 85, 84],
        cpuUsage: [10, 20, 35, 40, 50, 55, 52, 54],
        ramUsage: [25, 30, 35, 40, 45, 48, 50, 49]
      },
      fileList: [
        { name: 'workspace/', size: '128 MB', isDir: true, modified: '刚刚' },
        { name: 'README.md', size: '2.4 KB', isDir: false, modified: '刚刚' }
      ],
      logs: [
        { id: `lg_${Date.now()}`, action: '系统成功调度并分配算力卡资源', time: '刚刚', status: '成功' }
      ]
    };
    setGpuInstances(prev => [newInst, ...prev]);

    // 下游联动：规格使用次数+1，镜像引用次数+1
    setComputeSpecs(prev => prev.map(s => {
      if (s.gpuModel === gpuModel || s.name.includes(gpuModel) || gpuModel.includes(s.name)) {
        return {
          ...s,
          totalUsedCount: (s.totalUsedCount ?? 0) + 1,
          recent7DaysCount: (s.recent7DaysCount ?? 0) + 1
        };
      }
      return s;
    }));

    setComputeImages(prev => prev.map(img => {
      if (img.name === imageName || img.id === imageName || imageName.includes(img.name)) {
        return {
          ...img,
          refCount: (img.refCount ?? 0) + 1
        };
      }
      return img;
    }));

    showToast(` ${instanceType === 'server' ? '云服务器' : '容器'}实例【${newInst.name}】成功发布并秒级拉起！`);
  };

  const toggleGpuInstanceStatus = (id: string) => {
    let nextStatus = '';
    let instName = '';
    setGpuInstances(prev => prev.map(inst => {
      if (inst.id === id) {
        nextStatus = inst.status === 'running' ? 'stopped' : 'running';
        instName = inst.name;
        return { ...inst, status: nextStatus as any };
      }
      return inst;
    }));
    if (instName) {
      showToast(`算力实例 ${instName} 已${nextStatus === 'running' ? '启动' : '停止'}`);
    }
  };

  const updateInstanceRemark = (instId: string, remark: string) => {
    setGpuInstances(prev => prev.map(inst => {
      if (inst.id === instId) {
        return { ...inst, remark };
      }
      return inst;
    }));
    showToast('实例备注更新成功');
  };

  const changeInstanceRentalDuration = (instId: string, durationType: string, autoReturn: boolean) => {
    const labelMap: Record<string, string> = { daily: '日租', weekly: '周租', monthly: '月租' };
    const label = labelMap[durationType] || durationType;
    setGpuInstances(prev => prev.map(inst => {
      if (inst.id === instId) {
        return { 
          ...inst, 
          billingType: label, 
          autoReturnOnExpiry: autoReturn 
        };
      }
      return inst;
    }));
    showToast(`实例计费方式已成功变更为【${label}】`);
  };

  const createImageFromInstance = (instId: string, autoShutdown: boolean, overwrite: boolean) => {
    setGpuInstances(prev => prev.map(inst => {
      if (inst.id === instId) {
        return { 
          ...inst, 
          status: 'creating_image' 
        };
      }
      return inst;
    }));
    showToast('已开始保存实例为镜像，任务完成后将自动停机');
  };

  const restartGpuInstance = (id: string) => {
    let instName = '';
    setGpuInstances(prev => prev.map(inst => {
      if (inst.id === id) {
        instName = inst.name;
        return { ...inst, status: 'running' };
      }
      return inst;
    }));
    if (instName) {
      showToast(`算力实例 ${instName} 已重新启动`);
    }
  };

  const deleteGpuInstance = (id: string) => {
    setGpuInstances(prev => prev.filter(inst => inst.id !== id));
    showToast('已成功释放销毁算力实例');
  };

  const createPost = (content: string, board: FeedPost['board'], images?: string[], title?: string, tags?: string[]) => {
    const newPost: FeedPost = {
      id: `pst_${Date.now()}`,
      title,
      author: user.name,
      authorAvatar: user.avatar,
      authorTag: user.identityTag,
      content,
      images,
      board,
      tags,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      viewsCount: 1,
      time: '刚刚',
      createdAtTimestamp: Date.now(),
      isLiked: false,
      status: '已通过'
    };
    setPosts(prev => [newPost, ...prev]);
    showToast('社区动态发表成功！');
  };

  const likePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1)
        };
      }
      return p;
    }));
  };

  // 防刷记录查看数
  const recordPostView = (postId: string) => {
    const userKey = `${user.id || user.name || 'current_user'}_${postId}`;
    if (viewedPostKeys[userKey]) {
      // 已经查看过，防刷机制生效，不再增加查看数
      return;
    }

    // 初次查看，标记已查看，并仅自增1次
    setViewedPostKeys(prev => {
      const next = { ...prev, [userKey]: true };
      try {
        localStorage.setItem('app_viewed_posts', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          viewsCount: (p.viewsCount || 0) + 1
        };
      }
      return p;
    }));
  };

  const hasUserViewedPost = (postId: string): boolean => {
    const userKey = `${user.id || user.name || 'current_user'}_${postId}`;
    return !!viewedPostKeys[userKey];
  };

  // 板块管理方法
  const addCommunityBoard = (board: Omit<CommunityBoardItem, 'id' | 'postCount'>) => {
    const newBoard: CommunityBoardItem = {
      id: `b_${Date.now()}`,
      name: board.name.trim(),
      description: board.description.trim(),
      postCount: 0,
      sortWeight: board.sortWeight,
      status: board.status || '已启用'
    };
    setCommunityBoards(prev => [...prev, newBoard]);
    showToast(`板块【${newBoard.name}】已成功添加`);
  };

  const updateCommunityBoard = (id: string, updates: Partial<CommunityBoardItem>) => {
    setCommunityBoards(prev => prev.map(b => (b.id === id ? { ...b, ...updates } : b)));
    showToast('板块信息已成功更新');
  };

  const toggleCommunityBoardStatus = (id: string) => {
    const board = communityBoards.find(b => b.id === id);
    if (!board) return;
    const nextStatus = board.status === '已启用' ? '已停用' : '已启用';
    setCommunityBoards(prev => prev.map(b => (b.id === id ? { ...b, status: nextStatus } : b)));
    showToast(`板块【${board.name}】已${nextStatus}`);
  };

  const deleteCommunityBoard = (id: string): boolean => {
    if (communityBoards.length <= 1) {
      showToast('系统必须至少保留一个板块，无法删除');
      return false;
    }
    const board = communityBoards.find(b => b.id === id);
    if (!board) return false;

    const countInPosts = posts.filter(p => p.board === board.name).length;
    if (countInPosts > 0 || board.postCount > 0) {
      showToast(`该板块下存在 ${countInPosts || board.postCount} 篇帖子，无法删除！请先转移或清理相关帖子。`);
      return false;
    }

    setCommunityBoards(prev => prev.filter(b => b.id !== id));
    showToast(`已彻底删除板块【${board.name}】`);
    return true;
  };

  // 帖子修改与管理
  const updatePost = (id: string, updates: Partial<FeedPost>) => {
    setPosts(prev => prev.map(p => (p.id === id ? { ...p, ...updates } : p)));
    showToast('帖子信息已更新');
  };

  const deletePost = (id: string) => {
    setPosts(prev => prev.filter(p => p.id !== id));
    showToast('已彻底删除该帖子');
  };

  const togglePinPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const nextState = !post?.isPinned && !post?.isTop;
    const nowIso = new Date().toISOString();
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isPinned: nextState,
          isTop: nextState,
          pinnedAt: nextState ? nowIso : undefined
        };
      }
      return p;
    }));
    showToast(nextState ? '已将该帖子置顶于板块头部' : '已取消该帖子的置顶状态');
  };

  const toggleEssentialPost = (postId: string) => {
    const post = posts.find(p => p.id === postId);
    const nextState = !post?.isEssential;
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          isEssential: nextState
        };
      }
      return p;
    }));

    if (nextState) {
      // 帖子加精后奖励发帖人10积分，没有次数上限
      const isCurrentUser = post?.author === user.name || post?.author === 'zj';
      if (isCurrentUser) {
        setUser(prev => ({ ...prev, points: prev.points + 10 }));
        setNotifications(prev => [
          {
            id: `n_essential_${Date.now()}`,
            title: '✨ 您的帖子被加精',
            content: `您的帖子《${post?.title || '社区文章'}》已被管理员设为精华文章，恭喜获得 10 积分奖励！`,
            category: 'interaction',
            subCategory: 'community',
            type: 'interaction',
            time: '刚刚',
            read: false,
            targetTab: 'community',
            targetId: postId
          },
          ...prev
        ]);
      }
      showToast('已将该帖子设为【精华文章】，已向发帖人奖励 10 积分（无次数上限）');
    } else {
      showToast('已取消该帖子的精华标志');
    }
  };

  return (
    <AppContext.Provider value={{
      activeTab,
      setActiveTab: handleSetActiveTab,
      setSelectedMainTab: handleSetActiveTab,
      tabResetKey,
      marketplaceTab,
      setMarketplaceTab,
      workspaceSubTab,
      setWorkspaceSubTab,
      workspaceCommunitySubTab,
      setWorkspaceCommunitySubTab,
      isAdminMode,
      setIsAdminMode,
      activeAdminMenu,
      setActiveAdminMenu,
      enterAdminMode,
      exitAdminMode,
      searchOpen,
      setSearchOpen,
      searchQuery,
      setSearchQuery,
      user,
      setUser,
      checkInToday,
      hasCheckedInToday,
      pointRecords,
      onboardingTasks,
      completeOnboardingTask,
      notifications,
      unreadCount,
      markAllNotificationsRead,
      markNotificationAsRead,
      markNotificationsAsRead,
      agents,
      setAgents,
      userAgents,
      models,
      datasets,
      skills,
      setSkills,
      favorites,
      toggleFavoriteAgent,
      tasks,
      setTasks,
      courses,
      gpuInstances,
      // 充值中心
      rechargeModalOpen,
      setRechargeModalOpen,
      openRechargeModal,
      // 我租用的实例与我的镜像
      myCustomImages,
      deleteMyCustomImage,
      forceDeleteUserCustomImage,
      addMyCustomImageComment,
      updateMyCustomImageDescription,
      userImageQuota,
      setUserImageQuota,
      userImageAutoCleanupDays,
      setUserImageAutoCleanupDays,
      posts,
      apiKeys,
      createApiKey,
      revokeApiKey,
      openModal,
      sandboxAgent: sandboxAgentState,
      setSandboxAgent,
      detailModalAgent,
      setDetailModalAgent,
      subscribeModalAgent,
      setSubscribeModalAgent,
      quotaModalAgent,
      setQuotaModalAgent,
      trialCountLeft,
      setTrialCountLeft,
      subscriptions,
      setSubscriptions,
      payPerTokenAgents,
      setPayPerTokenAgents,
      openAgentDetail,
      openAgentSubscribe,
      tryoutModel,
      setTryoutModel,
      detailModel,
      setDetailModel,
      openModelDetail,
      detailDataset,
      setDetailDataset,
      openDatasetDetail,
      detailSkill,
      setDetailSkill,
      openSkillDetail,
      selectedCompareModels,
      toggleCompareModel,
      clearCompareModels,
      competitions,
      selectedCompetitionId,
      setSelectedCompetitionId,
      openCompetitionDetail,
      createAgentModalOpen,
      setCreateAgentModalOpen,
      publishTaskModalOpen,
      setPublishTaskModalOpen,
      createComputeModalOpen,
      setCreateComputeModalOpen,
      createComputePreset,
      setCreateComputePreset,
      detailInstance,
      setDetailInstance,
      historyModalOpen,
      setHistoryModalOpen,
      selectedTaskIdForDetail,
      setSelectedTaskIdForDetail,
      selectedTaskForVerification,
      setSelectedTaskForVerification,
      selectedPostIdForDetail,
      setSelectedPostIdForDetail,
      selectedPostDetailOrigin,
      setSelectedPostDetailOrigin,
      openPostDetailWithOrigin,
      addAgent,
      purchaseAgent,
      addTask,
      auditTask,
      withdrawTask,
      deleteTask,
      takeTask,
      submitTaskResult,
      verifyTaskSubmission,
      rejectAllAndRefund,
      updateTask,
      adminUpdateTask,
      submitTaskBid,
      submitTaskDeliverable,
      acceptTaskSubmission,
      rejectTaskSubmission,
      launchGpuInstance,
      updateInstanceRemark,
      changeInstanceRentalDuration,
      createImageFromInstance,
      toggleGpuInstanceStatus,
      restartGpuInstance,
      deleteGpuInstance,
      createPost,
      likePost,
      setPosts,
      communityBoards,
      setCommunityBoards,
      addCommunityBoard,
      updateCommunityBoard,
      toggleCommunityBoardStatus,
      deleteCommunityBoard,
      updatePost,
      deletePost,
      togglePinPost,
      toggleEssentialPost,
      recordPostView,
      hasUserViewedPost,
      toast,
      showToast,
      // 算力工坊后台管理
      computeSpecs,
      addComputeSpec,
      updateComputeSpec,
      deleteComputeSpec,
      toggleComputeSpecStatus,
      computeImages,
      addComputeImage,
      updateComputeImage,
      deleteComputeImage,
      toggleComputeImageStatus,
      computePools,
      addComputePool,
      updateComputePool,
      deleteComputePool,
      syncComputePoolStatus,
      setComputePoolAlertThreshold,
      toggleComputePoolMaintenance,
      computeOrders,
      focusedComputeOrderId,
      setFocusedComputeOrderId,
      navigateToComputeOrder,
      stopComputeOrder,
      releaseComputeOrder,
      retryComputeOrder,
      refundComputeOrder,
      changeComputeOrderBilling,
      computeRunningInstances,
      focusedComputeInstanceId,
      setFocusedComputeInstanceId,
      navigateToComputeInstance,
      restartComputeRunningInstance,
      stopComputeRunningInstance,
      releaseComputeRunningInstance,
      computeSettlements,
      confirmComputeSettlement,
      markComputeSettlementPaid,
      generateComputeSettlement,
      // 数据集后台管理
      addDataset,
      updateDataset,
      deleteDataset,
      toggleDatasetStatus,
      datasetTagDimensions,
      addDatasetTag,
      updateDatasetTag,
      deleteDatasetTag,
      reorderDatasetTags,
      // 数据集与Skill下载记录及前台审核工作流
      datasetDownloads,
      setDatasetDownloads,
      skillDownloads,
      setSkillDownloads,
      downloadDataset,
      downloadSkill,
      submitDatasetForApproval,
      submitSkillForApproval,
      auditDataset,
      publishDataset,
      auditSkill,
      publishSkill,
      deleteSkill,
      updateSkill,
      toggleSkillStatus,
      // 模型后台管理
      setModels,
      addModel,
      updateModel,
      deleteModel,
      toggleModelStatus,
      modelCallRecords,
      addModelCallRecord,
      modelUserConsumptions
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
