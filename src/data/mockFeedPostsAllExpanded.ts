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
const boards: CommunityBoard[] = ['干货分享', '求助答疑', '前沿观察', '赚钱交流', '同行交流', '娱乐灌水'];

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
    title: '【实战】使用 WebGPU 在浏览器端零延迟运行 DeepSeek 量化小模型的探索与坑点总结',
    board: '干货分享' as CommunityBoard,
    tags: ['WebGPU', 'DeepSeek', 'Wasm', '前端AI'],
    content: '最近我们团队尝试将 DeepSeek-R1-Distill 系列的 1.5B 权重量化为 4-bit 并通过 ONNX Runtime Web 与 WebGPU 移植到浏览器前端执行纯本地离线推理。在 M3 Max 上吞吐达到了 32 tok/s，在普通 Chrome 浏览器上也有 15 tok/s 的优异表现。本文整理了内存映射、着色器编译耗时优化以及 KV Cache 绑定的关键代码。',
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【避坑】生产环境 Milvus 2.4.x 向量数据库集群在千万级 HNSW 索引下的内存预警与参数调优',
    board: '求助答疑' as CommunityBoard,
    tags: ['Milvus', '向量检索', '运维架构', 'HNSW'],
    content: '我们在阿里云 ACK 上搭建了 12 节点的 Milvus 集群，在向量量级突破 2,000 万后，QueryNode 频繁发生 OOM 重启。排查发现是 M=16、efConstruction=200 的 HNSW 索引占用了全部 RAM。本文分享了我们将部分旧分区迁移至 DiskANN 混合存储并调整 segment 大小的生产落地配置。',
    image: null
  },
  {
    title: '【前沿速递】最新多模态架构 MoE 路由分发机制解析：为什么动态 Top-k 优于固定 Gate？',
    board: '前沿观察' as CommunityBoard,
    tags: ['多模态', 'MoE', '架构前沿', '深度学习'],
    content: '深入剖析 DeepSeek-V3 与 Qwen-VL 最新的专家路由机制。传统的固定 top-2 门控经常发生部分专家“过载”而其他专家“饥饿”的负载失衡问题，动态辅助损失函数与路由无偏估计让 MoE 在训练收敛速度上提升了近 18%。',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【商业化】独立开发者利用垂直领域 Agent SaaS 做到月入 8 万的真实复盘',
    board: '赚钱交流' as CommunityBoard,
    tags: ['SaaS', '商业化', '独立开发', '赚钱经验'],
    content: '去年辞职后，我一个人花了 2 个月开发了一款针对跨境电商亚马逊商家的自动化客服与评论归因 Agent。目前订阅客户超过 350 家，MRR 稳定在 1.2 万美元左右。关键不要去卷通用大模型套壳，一定要找准细分垂直场景的刚需痛点！',
    image: null
  },
  {
    title: '【同行唠嗑】国内大模型 Infra 团队的日常究竟在忙些什么？从算子优化到显卡故障率排查',
    board: '同行交流' as CommunityBoard,
    tags: ['职场', '大模型Infra', '工程师生活', '同行交流'],
    content: '聊聊在大厂做训练集群基础设施的真实一天：上午排查 IB 网络丢包导致训练中断的机器，下午写 Triton 算子融合减少显存拷贝，晚上做 checkpoint 异步持久化到 Ceph 的压测。欢迎同行交流下各自公司算力利用率 MFU 的指标！',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【茶水间】写提示词写到走火入魔：跟家里的扫地机器人说话都带上了 Few-Shot 和 CoT',
    board: '娱乐灌水' as CommunityBoard,
    tags: ['极客日常', '幽默', '摸鱼', '茶水间'],
    content: '今天扫地机器人卡在桌腿下了，我脱口而出：“你是一个高级扫地智能体，请思考避障步骤，Think step by step，然后再倒车脱困。”旁边的猫都用看智障的眼神看我……大家调大模型有没有什么好笑的职业病？',
    image: null
  },
  {
    title: '【评测】2026 年主流开源 RAG 框架横向评测：LlamaIndex vs LangChain vs 自研轻量 Pipeline',
    board: '干货分享' as CommunityBoard,
    tags: ['RAG', 'LlamaIndex', 'LangChain', '评测对比'],
    content: '我们对 10 万篇医疗与金融合规文档进行了端到端问答准确率评测。结果表明，重度的 LangChain 抽象层带来了平均 200ms 的无谓调度开销，而基于 FastAPI + 自研 Chunk 重排算法的轻量架构在召回率与首包响应时间上取得了最佳平衡。',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【求助】关于 vLLM 的 Prefix Caching 在多轮多分支对话树中的复用命中率疑问',
    board: '求助答疑' as CommunityBoard,
    tags: ['vLLM', 'KVCache', 'PrefixCaching', '求助'],
    content: '请教各位算力架构专家：在同一个任务有多位 Agent 协作探索时，树状结构的分支 Prompt 前缀理论上可以共享父节点的 KV Cache。但在高并发下，我们观察到 cache_hit_rate 只有 35% 左右，远低于单分支的 78%。有遇到同类问题的同行指点一下吗？',
    image: null
  },
  {
    title: '【硬核干货】手把手教你写一个高吞吐的 CUDA 内存池分配器（Memory Pool）',
    board: '干货分享' as CommunityBoard,
    tags: ['CUDA', 'C++', '高性能计算', 'GPU架构'],
    content: 'cudaMalloc 和 cudaFree 在频繁调用时会有微秒级的 Host 同步开销，对于高 QPS 推理服务极其致命。本文实现了一个分段式的 Slab 内存池，并支持动态多 Stream 流隔离与显存碎片整理，代码已开源在 GitHub。',
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80'
  },
  {
    title: '【变现分享】将开源 HuggingFace 模型打包为独立 API 服务的按调用次数计费实操',
    board: '赚钱交流' as CommunityBoard,
    tags: ['API经济', 'SaaS', '变现', '微调模型'],
    content: '把微调好的中文情感分析和信息抽取模型打包为标准化 REST 接口，挂载在开发者集市与国外 RapidAPI 平台上。目前每月被调用约 400 万次，带来几千块零花钱，服务器成本不到 800 元，非常适合个人开发者起步副业。',
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800&auto=format&fit=crop&q=80'
  }
];

// 生成 180 条高质量帖子（使得总帖子数达到 240+ 条）
const generatedPosts: FeedPost[] = Array.from({ length: 180 }, (_, i) => {
  const tpl = topicTemplates[i % topicTemplates.length];
  const author = sampleAuthors[i % sampleAuthors.length];
  const board = boards[i % boards.length];
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
