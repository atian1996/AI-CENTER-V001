import { UserPostItem, UserCommentItem, UserFavoriteItem } from '../types';

export const mockUserPostsExtended: UserPostItem[] = [
  {
    id: 'up-1',
    title: '实战经验：如何用 ComfyUI + SDXL LoRA 搭建高保真工业级视觉生成工作流？',
    content: '在实际产业落地中，LoRA 权重的动态融合与 ControlNet 深度图预处理对于保证生成一致性至关重要。本文详细记录了从环境部署到显存优化的完整步骤...',
    board: '干货分享',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 68,
    commentsCount: 24,
    collectsCount: 45,
    createdAt: '2026-08-22 15:40'
  },
  {
    id: 'up-2',
    title: '【开源分享】基于 LangGraph 的多角色 Code Review 自动化审计工具',
    content: '写了一个轻量级的代码审计工作流，支持自动检测 SQL 注入、越权访问并生成带行号的修复 Patch，已部署在平台，欢迎大家体验交流！',
    board: '干货分享',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 112,
    commentsCount: 38,
    collectsCount: 89,
    createdAt: '2026-08-19 11:20'
  },
  {
    id: 'up-3',
    title: '关于大模型 Agent 自主调用外部 Python 沙箱环境时的安全性思考',
    content: '智能体在生成并执行动态代码时，若未做严格的 cgroup 资源配额与网络隔离，可能引发宿主机提权与数据窃取风险。本方案提出了一种新型的轻量级 MicroVM 容器隔离法...',
    board: '前沿观察',
    status: 'reviewing',
    statusLabel: '审核中',
    likesCount: 0,
    commentsCount: 0,
    collectsCount: 0,
    createdAt: '2026-08-24 08:30'
  },
  {
    id: 'up-4',
    title: '求助：在 RTX 4090 上对 70B 模型进行 QLoRA 微调时出现 CUDA OOM 报错',
    content: '设置了 batch_size=1, gradient_accumulation_steps=16, 仍然在反向传播第 4 步抛出 CUDA out of memory，请问各位大佬有遇到类似情况吗？',
    board: '求助答疑',
    status: 'rejected',
    statusLabel: '已驳回',
    rejectReason: '帖子排版包含较长无格式化报错日志，请使用 Markdown 代码块排版后重新提交审核。',
    likesCount: 0,
    commentsCount: 0,
    collectsCount: 0,
    createdAt: '2026-08-16 19:10'
  },
  {
    id: 'up-5',
    title: '【干货】DeepSeek-R1 8B/32B vLLM 高并发部署优化全指南（含 TensorRT-LLM 对比实测）',
    content: '大语言模型推测思考链在长文本与推理计算密集场景中表现卓越，本文结合 PagedAttention、Chunked Prefill 与 FP8 混合精度量化在算力工坊进行了压测与调优。',
    board: '干货分享',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 342,
    commentsCount: 28,
    collectsCount: 156,
    createdAt: '2026-08-15 14:30'
  },
  {
    id: 'up-6',
    title: '【踩坑总结】LangChain + RAG 向量数据库混合检索精度翻倍实战',
    content: '很多同学在搭建企业知识库 RAG 时发现命中率只有 60% 左右。本文详细记录通过 BM25 + 稠密向量混合重排将准确率提升到 92% 的方案。',
    board: '干货分享',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 95,
    commentsCount: 18,
    collectsCount: 64,
    createdAt: '2026-08-14 10:15'
  },
  {
    id: 'up-7',
    title: '【代码片段】Agent 智能体 Tool-Use 异常重试与结构化输出范式',
    content: '在使用大模型执行函数调用时经常遇到 JSON 解析截断或字段缺失问题。本文提供一套健壮的 Pydantic 重试拦截器代码。',
    board: '干货分享',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 210,
    commentsCount: 42,
    collectsCount: 118,
    createdAt: '2026-08-12 16:50'
  },
  {
    id: 'up-8',
    title: '【变现实录】在接单平台靠定制企业级客服 Agent 月入 3 万的实际经验',
    content: '结合自己的真实接单心得，分享如何快速理清客户需求、设计工作流并完成标准化私有化交付。',
    board: '赚钱交流',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 520,
    commentsCount: 88,
    collectsCount: 320,
    createdAt: '2026-08-10 20:00'
  },
  {
    id: 'up-9',
    title: '【北京寻队友】AI 创客马拉松 Hackathon 组队：招募全栈前端与 AI 算法工程师',
    content: '我们目前有产品与算力资源支持，计划参赛打造垂直领域多模态分析助手，寻找志同道合的伙伴一起冲击奖池！',
    board: '同行交流',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 46,
    commentsCount: 15,
    collectsCount: 22,
    createdAt: '2026-08-08 09:40'
  },
  {
    id: 'up-10',
    title: '【爆笑】让 DeepSeek 帮我写一首诗赞美丢失的半角分号，居然被 AI 嘲讽了',
    content: '凌晨两点排查 Bug 排查到心力交瘁，结果发现是把英文分号打成了中文分号，让 AI 写诗它居然押韵嘲讽了我整整三段！',
    board: '娱乐灌水',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 680,
    commentsCount: 120,
    collectsCount: 85,
    createdAt: '2026-08-05 23:10'
  },
  {
    id: 'up-11',
    title: '【实践经验】算力工坊 A100/T4 节点模型训练成本对比与出包路径',
    content: '对比了不同规格算力节点的单位产出比，分析了模型训练与批量推理时的单 Token 成本拐点。',
    board: '干货分享',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 140,
    commentsCount: 33,
    collectsCount: 77,
    createdAt: '2026-08-03 11:25'
  },
  {
    id: 'up-12',
    title: '【前沿观察】2026 企业级 Agent 市场报告：垂直行业 Agentic 架构正在爆发',
    content: '从泛用聊天机器人走向业务端深度集成的自主智能体，分析金融、法律、医疗等领域的落地趋势。',
    board: '前沿观察',
    status: 'reviewing',
    statusLabel: '审核中',
    likesCount: 0,
    commentsCount: 0,
    collectsCount: 0,
    createdAt: '2026-08-01 18:20'
  },
  {
    id: 'up-13',
    title: '【求助】双卡 RTX 4090 开启 Tensor Parallelism 报错 NVLink 缺失',
    content: '本地组装的双卡机器没有物理 NVLink 桥接金手指，在启动 TP=2 时报错 NCCL WARN，有什么替代方案吗？',
    board: '求助答疑',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 35,
    commentsCount: 19,
    collectsCount: 12,
    createdAt: '2026-07-28 14:15'
  },
  {
    id: 'up-14',
    title: '【经验】企业 AI 咨询与培训服务怎么定价？附完整商业计划书模板',
    content: '总结了面向中小企业提供大模型内部应用落地的培训与咨询交付清单，欢迎下载交流。',
    board: '赚钱交流',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 310,
    commentsCount: 45,
    collectsCount: 198,
    createdAt: '2026-07-25 16:30'
  },
  {
    id: 'up-15',
    title: '【上海搭子】寻找 LLM Agent 研究学习搭子，每周固定阅读讨论一篇顶级论文',
    content: '每周六下午在线上交流最新 ArXiv 论文与代码复现进展，欢迎在沪对智能体感兴趣的朋友加入！',
    board: '同行交流',
    status: 'published',
    statusLabel: '已发布',
    likesCount: 58,
    commentsCount: 22,
    collectsCount: 31,
    createdAt: '2026-07-20 20:45'
  }
];

export const mockUserCommentsExtended: UserCommentItem[] = [
  {
    id: 'uc-1',
    content: '这个多Agent路由策略非常优雅！我们在政务知识库检索场景也遇到了类似的多意图分流问题，受教了！',
    postTitle: '【技术方案】基于 Redis Vector 的大模型上下文缓存与 Token 降本方案',
    postId: 'pst_gh_06',
    board: '干货分享',
    likesCount: 15,
    createdAt: '2026-08-23 14:20'
  },
  {
    id: 'uc-2',
    content: '建议将 FlashAttention-2 开启，并在 Deepspeed Zero-3 中配置 CPU offload，显存占用可以再降 35% 左右。',
    postTitle: '【求助】Llama-3 70B 加载 FlashAttention-2 出现 CUDA OOM 报错求排查',
    postId: 'pst_qz_01',
    board: '求助答疑',
    likesCount: 28,
    createdAt: '2026-08-21 16:45'
  },
  {
    id: 'uc-3',
    content: '非常详实的白皮书解读！GRPO 算法省去 Critic 网络对于显存受限团队来说是极大的利好。',
    postTitle: '【前沿】DeepSeek-R1 开源技术白皮书深度解读：MoE 架构与 GRPO 强化学习',
    postId: 'pst_qy_01',
    board: '前沿观察',
    likesCount: 19,
    createdAt: '2026-08-18 10:30'
  },
  {
    id: 'uc-4',
    content: '实测在 A100 双卡开启 FP8 KV Cache 后延迟确实降到了 400ms 左右，收益非常明显！',
    postTitle: '【干货】DeepSeek-R1 8B/32B vLLM 高并发部署优化全指南（含 TensorRT-LLM 对比实测）',
    postId: 'pst_gh_01',
    board: '干货分享',
    likesCount: 42,
    createdAt: '2026-08-15 11:20'
  },
  {
    id: 'uc-5',
    content: '感谢楼主分享！关于 Rerank 环节耗时增加 30ms 是否划算，在我们的客服评测中命中率提升确实远大于延迟代价。',
    postTitle: '【踩坑总结】LangChain + RAG 向量数据库混合检索精度翻倍实战',
    postId: 'pst_gh_02',
    board: '干货分享',
    likesCount: 23,
    createdAt: '2026-08-14 17:35'
  },
  {
    id: 'uc-6',
    content: '针对 JSON 函数调用的幻觉问题，可以尝试给 System Prompt 增加强校验 Schema，或者使用 Instructor 库强制校验。',
    postTitle: '【请教】Qwen2.5-Coder 32B 在做 JSON 函数调用时幻觉输出字符串怎么解？',
    postId: 'pst_qz_02',
    board: '求助答疑',
    likesCount: 31,
    createdAt: '2026-08-13 09:15'
  },
  {
    id: 'uc-7',
    content: '确实！客户根本不在乎你用了什么先进算法，只在乎工作流能不能真正替代一个初级审核员的工时。',
    postTitle: '【变现实录】在接单平台靠定制企业级客服 Agent 月入 3 万的实际经验',
    postId: 'pst_zq_01',
    board: '赚钱交流',
    likesCount: 65,
    createdAt: '2026-08-11 15:40'
  },
  {
    id: 'uc-8',
    content: '已投递简历！我们团队以前做过基于 React Flow 的 Agent 编排画布，期待一起组队冲刺大赛！',
    postTitle: '【北京寻队友】AI 创客马拉松 Hackathon 组队：招募全栈前端与 AI 算法工程师',
    postId: 'pst_tx_01',
    board: '同行交流',
    likesCount: 12,
    createdAt: '2026-08-09 19:25'
  },
  {
    id: 'uc-9',
    content: '哈哈哈这段写得太真实了，中文分号和英文分号简直是程序员的宿敌！',
    postTitle: '【爆笑】让 DeepSeek 帮我写一首诗赞美丢失的半角分号，居然被 AI 嘲讽了',
    postId: 'pst_yl_01',
    board: '娱乐灌水',
    likesCount: 88,
    createdAt: '2026-08-06 14:10'
  },
  {
    id: 'uc-10',
    content: '建议在调用前增加 Token 预截断，同时设置严格的 API 调用单次预算限额，防止循环跑飞。',
    postTitle: '【梗图】当你的 Agent 决定在凌晨 3 点陷入死循环并消耗了 $50 额度时',
    postId: 'pst_yl_02',
    board: '娱乐灌水',
    likesCount: 34,
    createdAt: '2026-08-04 18:50'
  },
  {
    id: 'uc-11',
    content: 'ComfyUI 的图生图放大节点用 Ultimate SD Upscale 配合 4x-UltraSharp 模型效果非常惊艳。',
    postTitle: '【工作流分享】ComfyUI + Flux.1 高清插画生成控制流与 8K 放大',
    postId: 'pst_gh_08',
    board: '干货分享',
    likesCount: 27,
    createdAt: '2026-08-02 12:05'
  },
  {
    id: 'uc-12',
    content: '律所的合同交付一定要签订数据隔离与免责协议，防止客户因模型幻觉产生法律纠纷。',
    postTitle: '【商业化】为律所搭建私有化 RAG 法律知识库项目的收费标准与交付流程',
    postId: 'pst_zq_02',
    board: '赚钱交流',
    likesCount: 51,
    createdAt: '2026-07-30 16:45'
  },
  {
    id: 'uc-13',
    content: '深圳线下沙龙支持线上直播同步吗？坐标南山科技园，周六下午刚好有空参加！',
    postTitle: '【深圳线下】深圳 AI 硬件与具身智能开发者沙龙，周末线下 Meetup 报名中',
    postId: 'pst_tx_02',
    board: '同行交流',
    likesCount: 16,
    createdAt: '2026-07-27 10:30'
  },
  {
    id: 'uc-14',
    content: 'Chunk 粒度建议 512 tokens 并留 10% overlap，这样既保留上下文语义又不会稀释密集检索向量。',
    postTitle: '【问答】RAG 向量数据库 Chunk 切分颗粒度设置多少检索召回率最高？',
    postId: 'pst_qz_03',
    board: '求助答疑',
    likesCount: 39,
    createdAt: '2026-07-24 13:20'
  },
  {
    id: 'uc-15',
    content: '企业级 Agent 的多角色协作正在重塑传统的 ERP 流程，未来的 SaaS 软件大概率都要重构一遍。',
    postTitle: '【观察】2026 企业级 Agent 市场报告：垂直行业 Agentic 架构正在爆发',
    postId: 'pst_qy_02',
    board: '前沿观察',
    likesCount: 44,
    createdAt: '2026-07-21 21:00'
  }
];

export const mockUserFavoritesExtended: UserFavoriteItem[] = [
  {
    id: 'uf-1',
    postId: 'pst_gh_01',
    postTitle: '【干货】DeepSeek-R1 8B/32B vLLM 高并发部署优化全指南（含 TensorRT-LLM 对比实测）',
    authorName: '王AI-深度架构师',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    board: '干货分享',
    collectedAt: '2026-08-23 20:15',
    likesCount: 342,
    commentsCount: 28
  },
  {
    id: 'uf-2',
    postId: 'pst_gh_02',
    postTitle: '【踩坑总结】LangChain + RAG 向量数据库混合检索精度翻倍实战',
    authorName: '李向量-数据专家',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    board: '干货分享',
    collectedAt: '2026-08-20 18:40',
    likesCount: 95,
    commentsCount: 18
  },
  {
    id: 'uf-3',
    postId: 'pst_qy_01',
    postTitle: '【前沿】DeepSeek-R1 开源技术白皮书深度解读：MoE 架构与 GRPO 强化学习',
    authorName: '张前沿-AI研报',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    board: '前沿观察',
    collectedAt: '2026-08-15 09:30',
    likesCount: 420,
    commentsCount: 56
  },
  {
    id: 'uf-4',
    postId: 'pst_zq_01',
    postTitle: '【变现实录】在接单平台靠定制企业级客服 Agent 月入 3 万的实际经验',
    authorName: '钱客-商业化',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    board: '赚钱交流',
    collectedAt: '2026-08-12 14:20',
    likesCount: 520,
    commentsCount: 88
  },
  {
    id: 'uf-5',
    postId: 'pst_gh_03',
    postTitle: '【代码片段】Agent 智能体 Tool-Use 异常重试与结构化输出范式',
    authorName: '极客小千',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    board: '干货分享',
    collectedAt: '2026-08-10 11:15',
    likesCount: 210,
    commentsCount: 42
  },
  {
    id: 'uf-6',
    postId: 'pst_gh_04',
    postTitle: '【工作流分享】Dify + Agent 零代码搭建自动化客服工单路由',
    authorName: '陈Workflow',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    board: '干货分享',
    collectedAt: '2026-08-08 16:30',
    likesCount: 164,
    commentsCount: 23
  },
  {
    id: 'uf-7',
    postId: 'pst_qz_01',
    postTitle: '【求助】Llama-3 70B 加载 FlashAttention-2 出现 CUDA OOM 报错求排查',
    authorName: '刘调优-开源LLM',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    board: '求助答疑',
    collectedAt: '2026-08-06 09:45',
    likesCount: 78,
    commentsCount: 32
  },
  {
    id: 'uf-8',
    postId: 'pst_zq_02',
    postTitle: '【商业化】为律所搭建私有化 RAG 法律知识库项目的收费标准与交付流程',
    authorName: '法AI-律所咨询',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    board: '赚钱交流',
    collectedAt: '2026-08-04 15:50',
    likesCount: 280,
    commentsCount: 39
  },
  {
    id: 'uf-9',
    postId: 'pst_gh_08',
    postTitle: '【工作流分享】ComfyUI + Flux.1 高清插画生成控制流与 8K 放大',
    authorName: '周ComfyUI-视觉师',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    board: '干货分享',
    collectedAt: '2026-08-01 19:10',
    likesCount: 185,
    commentsCount: 26
  },
  {
    id: 'uf-10',
    postId: 'pst_tx_01',
    postTitle: '【北京寻队友】AI 创客马拉松 Hackathon 组队：招募全栈前端与 AI 算法工程师',
    authorName: '赵领航-创业者',
    authorAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    board: '同行交流',
    collectedAt: '2026-07-29 12:20',
    likesCount: 46,
    commentsCount: 15
  },
  {
    id: 'uf-11',
    postId: 'pst_yl_01',
    postTitle: '【爆笑】让 DeepSeek 帮我写一首诗赞美丢失的半角分号，居然被 AI 嘲讽了',
    authorName: '代码诗人-摸鱼中',
    authorAvatar: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&auto=format&fit=crop&q=80',
    board: '娱乐灌水',
    collectedAt: '2026-07-26 14:00',
    likesCount: 680,
    commentsCount: 120
  },
  {
    id: 'uf-12',
    postId: 'pst_gh_06',
    postTitle: '【技术方案】基于 Redis Vector 的大模型上下文缓存与 Token 降本方案',
    authorName: '架构师老张',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    board: '干货分享',
    collectedAt: '2026-07-23 17:35',
    likesCount: 156,
    commentsCount: 31
  },
  {
    id: 'uf-13',
    postId: 'pst_qy_02',
    postTitle: '【观察】2026 企业级 Agent 市场报告：垂直行业 Agentic 架构正在爆发',
    authorName: '产业观察员小周',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    board: '前沿观察',
    collectedAt: '2026-07-20 08:50',
    likesCount: 310,
    commentsCount: 48
  },
  {
    id: 'uf-14',
    postId: 'pst_zq_03',
    postTitle: '【案例分享】做了一款 AI 视频数字人生成工具，半年做到 5 万美金 MRR',
    authorName: '独立开发Max',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    board: '赚钱交流',
    collectedAt: '2026-07-16 16:15',
    likesCount: 450,
    commentsCount: 72
  },
  {
    id: 'uf-15',
    postId: 'pst_gh_05',
    postTitle: '【工具推荐】Ollama 本地大模型轻量化工具量化对比与显存测算',
    authorName: '刘端侧AI',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    board: '干货分享',
    collectedAt: '2026-07-12 10:40',
    likesCount: 88,
    commentsCount: 14
  }
];
