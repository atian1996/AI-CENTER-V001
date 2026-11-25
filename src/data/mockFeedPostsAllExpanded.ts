import { FeedPost, CommunityBoard } from '../types';
import { mockFeedPosts60ExpandedPart1 } from './mockPostsExpandedPart1';
import { mockFeedPosts60ExpandedPart2 } from './mockPostsExpandedPart2';
import { mockFeedPosts60ExpandedPart3 } from './mockPostsExpandedPart3';
import { mockFeedPosts60ExpandedPart4 } from './mockPostsExpandedPart4';
import { mockFeedPosts60ExpandedPart5 } from './mockPostsExpandedPart5';
import { mockFeedPosts60ExpandedPart6 } from './mockPostsExpandedPart6';

const basePosts: FeedPost[] = [
  ...mockFeedPosts60ExpandedPart1,
  ...mockFeedPosts60ExpandedPart2,
  ...mockFeedPosts60ExpandedPart3,
  ...mockFeedPosts60ExpandedPart4,
  ...mockFeedPosts60ExpandedPart5,
  ...mockFeedPosts60ExpandedPart6
];

// 扩展生成真实的社区帖子池（共扩展至 240+ 条），支撑 10 页 200 条的瀑布流分页与性能保护验证
const boards: CommunityBoard[] = ['厂商动态', '技术前沿', '活动速递', '行业快讯', '极客圆桌'];

const sampleAuthors = [
  { name: '王AI-深度架构师', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80', tag: 'VIP 核心贡献者' },
  { name: '李向量-数据专家', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80', tag: '向量检索专家' },
  { name: '赵云算力-工程师', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80', tag: '算力架构师' },
  { name: '孙智能体-创业者', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80', tag: '独立开发者' },
  { name: '钱前沿-技术总监', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80', tag: '技术布道师' },
  { name: '吴大模型-实战派', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80', tag: '微调工程师' },
  { name: '郑开源-布道师', avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80', tag: '开源社区核心' },
  { name: '楚模型-算法专家', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80', tag: '算法研究员' },
  { name: '魏微调-研究员', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80', tag: 'Prompt 专家' },
  { name: '蒋工程-技术专家', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80', tag: '后端极客' }
];

const topicTemplates = [
  {
    title: '【厂商动态】昇腾云与国产大模型生态联合发布千卡智算集群推理加速套件',
    board: '厂商动态' as CommunityBoard,
    tags: ['算力生态', '昇腾', '模型厂商', '推理加速'],
    content: '面向万亿参数 MoE 模型的规模化推理需求，主流国产算力厂商联合推出新一代通信融合与算子编排引擎，在 32K 长上下文并发场景下将端到端首包延迟降低 38%，并全面兼容开源推理框架。',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【技术前沿】最新多模态架构 MoE 路由分发机制解析：为什么动态 Top-k 优于固定 Gate？',
    board: '技术前沿' as CommunityBoard,
    tags: ['多模态', 'MoE', '架构前沿', '深度学习'],
    content: '深入剖析 DeepSeek-V3 与 Qwen-VL 最新的专家路由机制。传统的固定 top-2 门控经常发生部分专家“过载”而其他专家“饥饿”的负载失衡问题，动态辅助损失函数与路由无偏估计让 MoE 在训练收敛速度上提升了近 18%。',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【活动速递】2026 全国人工智能大模型攻防演练赛暨高校科研沙龙正式开启报名',
    board: '活动速递' as CommunityBoard,
    tags: ['AI赛事', '学术会议', '科研沙龙', '官方通告'],
    content: '本届大赛设立大模型安全红蓝对抗、多智能体自主编排与算力效率优化三大赛道，面向高校实验室与企业研发团队开放申请，入围决赛队伍将获得专属算力额度与顶级期刊特邀报告机会。',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【行业快讯】全球企业级 Agent 商业化增速超预期：金融、制造与医疗成三大核心落地场景',
    board: '行业快讯' as CommunityBoard,
    tags: ['行业快讯', 'Agent', '企业落地', '趋势速览'],
    content: '最新季度全球 AI 产业报告显示，超过 62% 的中大型企业已将自主智能体工作流引入客服、代码审计与供应链调度环节，推理侧算力消耗首次超过训练侧成为云服务增长主引擎。',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【极客圆桌】使用 WebGPU 在浏览器端零延迟运行 DeepSeek 量化小模型的探索与坑点总结',
    board: '极客圆桌' as CommunityBoard,
    tags: ['WebGPU', 'DeepSeek', 'Wasm', '实战经验'],
    content: '最近我们团队尝试将 DeepSeek-R1-Distill 系列的 1.5B 权重量化为 4-bit 并通过 ONNX Runtime Web 与 WebGPU 移植到浏览器前端执行纯本地离线推理。本文整理了内存映射、着色器编译耗时优化以及 KV Cache 绑定的关键代码。',
    image: null
  },
  {
    title: '【厂商动态】主流云算力平台 H200 / B200 裸金属集群正式上线按秒计费与弹性扩缩容',
    board: '厂商动态' as CommunityBoard,
    tags: ['云厂商', 'GPU集群', '算力调度', '基础设施'],
    content: '多家头部智算云厂商同步升级底层 RDMA 高速互联与弹性调度策略，支持开发者在 45 秒内拉起多机多卡训练任务，并结合空闲算力竞价机制将中小团队的微调成本压低近一半。',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【技术前沿】手把手解析高吞吐 CUDA 内存池分配器与 FP8 量化内核的前沿演进',
    board: '技术前沿' as CommunityBoard,
    tags: ['CUDA', 'FP8量化', '高性能计算', 'GPU架构'],
    content: 'cudaMalloc 和 cudaFree 在频繁调用时会有微秒级的 Host 同步开销，对于高 QPS 推理服务极其致命。本文深入剖析分段式 Slab 内存池与多 Stream 流隔离架构在最新推理框架中的应用。',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【活动速递】ACL / NeurIPS 论文预读会：长上下文推理与强化学习对齐专场日程公布',
    board: '活动速递' as CommunityBoard,
    tags: ['论文精读', '学术会议', 'RLHF', '线上直播'],
    content: '本期学术沙龙特邀多位一线论文一作在线拆解长序列注意力稀疏化、GRPO 推理对齐以及多模态世界模型等热点工作，全程开放 QA 问答与开源代码仓库复现演示。',
    image: null
  },
  {
    title: '【行业快讯】开源大模型 API 价格战进入深水区，长文本缓存命中计费成为行业新标准',
    board: '行业快讯' as CommunityBoard,
    tags: ['API定价', '开源生态', '行业热点', 'ContextCache'],
    content: '随着 Prefix Caching 与磁盘分层 KV 存储成熟，国内外主流模型服务商相继下调上下文缓存命中单价最高达 75%，为超长代码库分析与企业知识库问答打开了大规模应用空间。',
    image: null
  },
  {
    title: '【极客圆桌】生产环境 Milvus 2.4.x 向量集群千万级 HNSW 索引内存预警与调优复盘',
    board: '极客圆桌' as CommunityBoard,
    tags: ['Milvus', '向量检索', '运维架构', '踩坑复盘'],
    content: '我们在生产环境搭建了 12 节点的 Milvus 集群，在向量量级突破 2,000 万后，QueryNode 频繁发生 OOM 重启。本文分享了我们将旧分区迁移至 DiskANN 混合存储并调整 segment 大小的完整落地方案。',
    image: null
  }
];

// 生成 180 条高质量帖子（使得总帖子数达到 240+ 条）
const generatedPosts: FeedPost[] = Array.from({ length: 180 }, (_, i) => {
  const tpl = topicTemplates[i % topicTemplates.length];
  const author = sampleAuthors[i % sampleAuthors.length];
  const board = tpl.board || boards[i % boards.length];
  const id = `pst_ext_${String(i + 1).padStart(3, '0')}`;
  const hoursAgo = Math.floor(i * 1.5) + 3;
  
  return {
    id,
    title: `${tpl.title.replace(/【.*?】/, '')} #${i + 61}`,
    author: author.name,
    authorAvatar: author.avatar,
    authorTag: author.tag,
    board,
    content: `${tpl.content}\n\n> 补充说明：千极AI社区实践经验库第 ${i + 61} 期记录，欢迎各位极客就该技术方案提出优化建议与探讨交流。`,
    images: (i % 3 === 0 && tpl.image) ? [tpl.image] : [],
    likesCount: Math.floor(Math.sin(i) * 35) + 40,
    commentsCount: Math.floor(Math.cos(i) * 15) + 18,
    sharesCount: Math.floor(i % 12) + 2,
    viewsCount: 500 + i * 28,
    favoritesCount: Math.floor(i % 20) + 5,
    tags: tpl.tags,
    time: `${hoursAgo}小时前`,
    createdAtTimestamp: Date.now() - hoursAgo * 3600 * 1000,
    isLiked: false,
    isCollected: false,
    isEssential: i % 15 === 0
  };
});

export const mockFeedPostsAllExpanded: FeedPost[] = [
  ...basePosts,
  ...generatedPosts
];
