import {
  CertificationAdvisorField,
  CertificationItem,
  CertificationSystem
} from '../types';

export const CERTIFICATION_SYSTEMS: CertificationSystem[] = [
  {
    id: 'zhipu',
    name: '智谱 GLM 体系',
    shortName: '智谱 GLM',
    description: '围绕 GLM 基座模型生态打造的分级开发、智能体编排与模型微调能力认证。'
  },
  {
    id: 'tencent',
    name: '腾讯云 AI 体系',
    shortName: '腾讯云 AI',
    description: '面向企业级 AI 工程部署、混元大模型应用与云原生智能体交付的官方认证体系。'
  },
  {
    id: '360',
    name: '360 ADE / FDE 体系',
    shortName: '360 安全与交付',
    description: '聚焦大模型安全护栏、安全智能体应用开发与政企前沿交付落地的专业认证。'
  },
  {
    id: 'aigc',
    name: 'AIGC 部委与学会认证',
    shortName: '部委与学会',
    description: '联合权威行业学会与人才评测机构推出的通用生成式 AI 与产业工程人才认证。'
  }
];

const DEFAULT_ADVISOR_CONTACTS: CertificationAdvisorField[] = [
  { label: '联系人', value: '林顾问（认证服务中心）' },
  { label: '联系电话', value: '400-886-2026 转 802', copyable: true },
  { label: '电子邮箱', value: 'certification@qianji-ai.cn', copyable: true },
  { label: '服务时段', value: '工作日 09:00 - 19:00' }
];

export const MOCK_CERTIFICATIONS: CertificationItem[] = [
  {
    id: 'cert-zhipu-l1',
    systemId: 'zhipu',
    systemName: '智谱 GLM 体系',
    name: '大模型应用工程师（初级）',
    issuingBodies: ['智谱 AI', '中国计算机行业协会'],
    level: '初级',
    levelCode: 'L1',
    customTags: ['语言模型', '入门必考'],
    briefIntro:
      '大模型应用工程师认证（初级）旨在评估学员对大模型理论知识的掌握程度以及实际应用能力，帮助开发者快速接入大模型生态。',
    targetAudience: '培养AI入门级业务人才',
    coreCapabilities: [
      'Python基础',
      'API调用',
      '简易RAG搭建',
      '基础调试',
      '前后端交互',
      '接口封装'
    ],
    priceDisplay: '¥399.00',
    feeDescription: '费用含全套官方视频课程、在线实验环境及 1 次免费补考机会，开通即生效。',
    examFormat: '线上理论机考 + 实操编程评测',
    examDuration: '90 分钟',
    passingScore: '70 / 100 分',
    validityPeriod: '长期有效',
    courseHours: '24 课时',
    feeText: '¥399 / 次',
    enrolledCount: 4820,
    syllabus: [
      {
        title: '模块一：大语言模型核心原理与 GLM 生态概览',
        duration: '6 课时',
        topics: [
          'Transformer 基础架构与上下文窗口机制',
          'GLM 系列模型选型与 Token 成本核算',
          '结构化提示词编写与输出格式控制'
        ]
      },
      {
        title: '模块二：Python SDK 接入与接口工程封装',
        duration: '8 课时',
        topics: [
          'API Key 安全管理与流式输出（SSE）实现',
          '异常重试、限流控制与响应延迟优化',
          'RESTful 后端服务封装与前后端联调'
        ]
      },
      {
        title: '模块三：轻量级知识库（RAG）应用实战',
        duration: '10 课时',
        topics: [
          '文档解析切片策略与 Embedding 向量化',
          '向量检索召回与上下文注入实践',
          '端到端问答助手调试与基础效果评估'
        ]
      }
    ],
    recognitionPoints: [
      '智谱 AI 与中国计算机行业协会双章联合认证，支持官方编号在线核验',
      '纳入智谱生态合作企业初级 AI 研发岗位能力评估参考标准',
      '通过考试可获得平台开发者主页专属认证标识与算力抵扣券'
    ],
    introMarkdown: `**大模型应用工程师（初级）**由智谱 AI 与中国计算机行业协会联合推出，面向希望系统迈入大模型应用开发领域的开发者与高校学员，全面评估基础理论认知、模型接口集成及轻量级业务应用落地能力。

### 这个认证能证明什么？
- **体系化工程基础**：证明你掌握大语言模型核心工作原理、Token 成本控制与结构化提示词设计方法。
- **独立接口集成能力**：具备使用 Python SDK 调用 GLM 系列模型、处理流式输出（SSE）及封装业务后端 API 的实操能力。
- **轻量级 RAG 实战能力**：能够独立完成文档解析、向量化索引及检索增强问答系统的搭建与效果调试。

### 学完后你能够应用于
- **企业内部问答助手**：快速构建面向制度文档、产品手册的检索增强型知识库问答系统。
- **业务流程提效插件**：为现有 Web 应用或办公系统接入摘要生成、文本分类与结构化抽取能力。
- **求职与转岗能力背书**：为简历、项目答辩及 AI 应用研发初级岗位面试提供官方可核验的能力证明。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '24 课时',
        contentMarkdown: `系统学习官方配套录播与代码实验课程，覆盖从模型选型到完整 RAG 应用落地的核心知识点：

- **模块 01 · 大模型基础与 GLM 生态（6 课时）**：Transformer 推理机制、上下文窗口管理、模型选型与结构化 Prompt 工程。
- **模块 02 · Python SDK 与接口封装（8 课时）**：API 鉴权规范、流式响应（SSE）处理、异常重试策略及前后端接口联调。
- **模块 03 · 轻量级 RAG 实战项目（10 课时）**：文本切片策略、Embedding 向量检索、上下文注入及问答效果基础评测。`
      },
      {
        id: 'step-prep',
        title: '备考与体验',
        hint: '开通后解锁',
        contentMarkdown: `开通认证后自动解锁官方考前模拟题库与云端免配置 Python 实操沙盒：

- **全真模拟评测**：提供 3 套覆盖全部考纲的高仿真理论模拟卷，支持即时错题解析与薄弱点定位。
- **在线实验沙盒**：内置预配置 GLM API 测试额度与示例知识库语料，无需本地折腾环境即可完成全部实验任务。`
      },
      {
        id: 'step-exam',
        title: '参加考试',
        hint: '线上机考 · 90 分钟',
        contentMarkdown: `完成规定课时学习后，可在认证有效期内随时预约线上正式考试：

- **考核形式**：线上理论机考（单选/多选/判断，占 60%）+ 代码实操任务评测（占 40%）。
- **通过标准**：总分达到 **70 / 100 分** 即为通过；首次未通过可免费使用 1 次补考资格。`
      },
      {
        id: 'step-cert',
        title: '领取证书',
        hint: '官方双章核验',
        contentMarkdown: `考试通过后 3 个工作日内，系统自动签发由 **智谱 AI · 中国计算机行业协会** 联合认证的电子证书：

- 支持一键下载高清 PDF 电子证书与官方唯一编号核验链接。
- 平台个人主页自动点亮 **L1 初级认证** 标识，并同步发放平台算力与模型体验激励额度。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  },
  {
    id: 'cert-zhipu-l2',
    systemId: 'zhipu',
    systemName: '智谱 GLM 体系',
    name: 'GLM 智能体开发工程师（中级）',
    issuingBodies: ['智谱 AI', '中国人工智能学会'],
    level: '中级',
    levelCode: 'L2',
    customTags: ['Agent开发', '实战评测', '有效期2年'],
    briefIntro:
      '面向具备工程开发经验的研发人员，系统考核基于 GLM 模型构建多轮工具调用、企业知识库检索增强与多智能体工作流编排能力。',
    targetAudience: '应用开发工程师 / 算法助理',
    coreCapabilities: [
      'Function Calling',
      '企业级RAG架构',
      '多Agent编排',
      'Prompt评测调优',
      '向量检索优化',
      '高并发服务部署'
    ],
    priceDisplay: '¥699.00',
    feeDescription: '费用含 36 课时实战课程、企业级沙盒环境、官方机考评测与 1 次补考机会。',
    examFormat: '场景架构设计 + 沙盒项目实战答辩',
    examDuration: '120 分钟',
    passingScore: '75 / 100 分',
    validityPeriod: '2 年',
    courseHours: '36 课时',
    feeText: '¥699 / 次',
    enrolledCount: 2390,
    syllabus: [
      {
        title: '模块一：工具调用（Function Calling）与 MCP 协议集成',
        duration: '10 课时',
        topics: [
          '复杂函数 Schema 定义与多步工具链路调度',
          '外部数据库、业务 API 与代码解释器安全接入',
          '上下文记忆管理与长对话压缩策略'
        ]
      },
      {
        title: '模块二：企业级 RAG 混合检索与精排优化',
        duration: '14 课时',
        topics: [
          'BM25 + 向量双路召回与 Rerank 重排模型应用',
          '多模态表格/PDF 复杂版面解析管线',
          '幻觉抑制、溯源引用与自动化评测基准构建'
        ]
      },
      {
        title: '模块三：多智能体协同编排与生产部署',
        duration: '12 课时',
        topics: [
          '状态机工作流与多角色 Agent 分工协作',
          '可观测性链路追踪与并发吞吐压测',
          '灰度发布、版本回滚与 Token 成本治理'
        ]
      }
    ],
    recognitionPoints: [
      '认证成绩可作为承接平台高额悬赏智能体开发任务的优先资质证明',
      '配备完整企业级真实业务沙盒实验环境与考前冲刺模拟题库',
      '证书支持中英文双语电子版下载与 LinkedIn / 简历核验链接'
    ],
    introMarkdown: `**GLM 智能体开发工程师（中级）**聚焦生产级智能体工程实践，重点评估研发人员在复杂业务场景下设计混合检索架构、多工具链路调用及多 Agent 协同工作流的综合能力。

### 核心考察维度
- **工具调用与外部系统集成**：熟练使用 Function Calling 与 MCP 协议，安全对接企业数据库、业务 API 及代码沙盒。
- **高精度企业级 RAG 优化**：掌握 BM25 + 向量多路召回、Rerank 精排、复杂表格解析与回答溯源防幻觉方案。
- **生产级可观测与高并发部署**：具备构建自动化评测集、链路追踪监控及 Token 成本治理的工程落地经验。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '36 课时',
        contentMarkdown: `深入拆解企业级智能体研发全流程，配套完整源码工程：

- **模块 01 · 工具调用与 MCP 协议（10 课时）**：复杂函数 Schema 设计、多步工具编排与长对话上下文压缩。
- **模块 02 · 企业级 RAG 精排优化（14 课时）**：双路召回、重排模型接入、PDF 复杂版面解析与幻觉评测。
- **模块 03 · 多 Agent 协同与生产部署（12 课时）**：状态机工作流编排、链路追踪与高并发压测调优。`
      },
      {
        id: 'step-prep',
        title: '备考与体验',
        hint: '开通后解锁',
        contentMarkdown: `提供企业级智能体沙盒演练平台与专项评测数据集：

- 包含金融研报分析、智能工单路由 2 个完整企业级实操案例演练。
- 开放自动化评测脚本，帮助考前检验 Agent 召回准确率与响应延迟指标。`
      },
      {
        id: 'step-exam',
        title: '参加考试',
        hint: '实战考核 · 120 分钟',
        contentMarkdown: `采用架构设计题与在线沙盒工程交付相结合的考核方式：

- 在规定 **120 分钟** 内完成架构方案作答与核心智能体代码调试提交。
- 综合得分达到 **75 / 100 分** 通过认证考核。`
      },
      {
        id: 'step-cert',
        title: '领取证书',
        hint: '有效期 2 年',
        contentMarkdown: `考核通过后签发中英文双语官方电子证书，有效期 2 年：

- 可用于平台高额悬赏智能体任务的承接资质优先推荐。
- 支持证书到期前通过轻量级续证课程完成在线续期。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  },
  {
    id: 'cert-zhipu-l3',
    systemId: 'zhipu',
    systemName: '智谱 GLM 体系',
    name: 'GLM 大模型架构与微调专家（高级）',
    issuingBodies: ['智谱 AI', '中国计算机行业协会'],
    level: '高级',
    levelCode: 'L3',
    customTags: ['模型微调', '专家级认证'],
    briefIntro:
      '针对企业私有化大模型定制与分布式训练场景，深入考核 LoRA 与全参数微调、偏好对齐、推理量化加速及行业大模型端到端架构设计能力。',
    targetAudience: '资深算法工程师 / 技术架构师',
    coreCapabilities: [
      'LoRA高效微调',
      '数据治理清洗',
      'RLHF对齐训练',
      'vLLM推理加速',
      '私有化集群部署',
      '模型安全合规'
    ],
    priceDisplay: '¥1,299.00',
    feeDescription: '含 48 课时专家级课程、A100 实训算力代金券、实战评审与官方专家证书。',
    examFormat: '深度笔试 + 分布式微调实操 + 专家评审',
    examDuration: '150 分钟',
    passingScore: '80 / 100 分',
    validityPeriod: '3 年',
    courseHours: '48 课时',
    feeText: '¥1,299 / 次',
    enrolledCount: 910,
    syllabus: [
      {
        title: '模块一：高质量指令数据集构建与数据飞轮',
        duration: '14 课时',
        topics: [
          '垂直领域语料去重、清洗、合成与质量评分体系',
          'SFT 指令样本配比设计与灾难性遗忘规避',
          '偏好对（DPO/RLHF）数据标注规范'
        ]
      },
      {
        title: '模块二：分布式高效微调与对齐实践',
        duration: '18 课时',
        topics: [
          'LoRA / QLoRA / DeepSpeed ZeRO 显存优化实战',
          '多机多卡并行训练监控与超参调优',
          '自动化评测集搭建与领域基准横向对比'
        ]
      },
      {
        title: '模块三：高性能推理部署与企业级安全治理',
        duration: '16 课时',
        topics: [
          'INT4/FP8 量化压缩与 vLLM / TensorRT-LLM 吞吐优化',
          '多租户算力隔离、弹性扩缩容与容灾设计',
          '内容合规审计、红队攻防与私有化交付规范'
        ]
      }
    ],
    recognitionPoints: [
      '智谱 GLM 体系最高阶工程专家认证，直通智谱生态技术专家库',
      '赠送平台 A100/H800 算力工坊专项微调实训体验额度',
      '支持企业团队批量定制考评与内训人才能力画像报告'
    ],
    introMarkdown: `**GLM 大模型架构与微调专家（高级）**是智谱 GLM 体系最高阶工程专家认证，专为负责行业大模型定制训练、高性能推理部署及私有化基础设施建设的资深算法与架构专家设立。

### 这个认证能证明什么？
- **数据飞轮与微调对齐能力**：具备从行业语料清洗、配比设计到 LoRA / DPO / RLHF 分布式微调的全链路实战经验。
- **极致推理性能优化能力**：精通模型量化压缩、KV Cache 调度及 vLLM / TensorRT-LLM 高吞吐服务架构。
- **私有化集群治理能力**：能够主导多租户 GPU 集群规划、容灾高可用及模型安全合规验收。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '48 课时',
        contentMarkdown: `深度工程课程覆盖大模型定制训练与私有化推理全栈技术：

- **模块 01 · 指令数据工程与数据飞轮（14 课时）**：行业语料清洗合成、样本配比与偏好标注标准。
- **模块 02 · 分布式微调与对齐训练（18 课时）**：LoRA/QLoRA、DeepSpeed ZeRO 显存优化与评测基准构建。
- **模块 03 · 量化加速与私有化交付（16 课时）**：FP8/INT4 量化、vLLM 吞吐调优与红队安全合规审计。`
      },
      {
        id: 'step-prep',
        title: '算力实训与备考',
        hint: '赠 A100 实训额度',
        contentMarkdown: `开通认证后自动发放平台算力工坊专项微调实训额度：

- 直接在云端多卡 GPU 容器内复现行业模型 LoRA 微调与 vLLM 压测全过程。
- 配套专家级架构案例剖析文档与评审答辩指引。`
      },
      {
        id: 'step-exam',
        title: '参加考试与评审',
        hint: '实操 + 专家评审',
        contentMarkdown: `考核由深度理论笔试、模型微调实操结果评测与专家方案评审三部分构成：

- 考核总时长 **150 分钟**，综合评定达到 **80 / 100 分** 通过认证。`
      },
      {
        id: 'step-cert',
        title: '领取专家证书',
        hint: '有效期 3 年',
        contentMarkdown: `通过后颁发 L3 高级专家认证电子与纸质双版证书，有效期 3 年，并优先受邀加入智谱生态技术专家顾问网络。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  },
  {
    id: 'cert-tencent-fde',
    systemId: 'tencent',
    systemName: '腾讯云 AI 体系',
    name: '腾讯云人工智能前沿部署工程师（FDE）',
    issuingBodies: ['腾讯云'],
    level: '高级',
    customTags: ['职业认证', '有效期2年'],
    briefIntro:
      '企业 AI 项目端到端交付能力的厂商官方认证，聚焦需求挖掘、企业智能体搭建与安全治理，要求具备企业项目交付经验。',
    targetAudience: '交付工程师 / 架构师',
    coreCapabilities: [
      '需求挖掘',
      'Agent 搭建',
      'Prompt 工程',
      'PEV交付闭环',
      '企业级安全治理',
      'FDE方法论'
    ],
    priceDisplay: '¥1,200.00',
    feeDescription: '费用含官方认证课程、企业级实操案例库、正式认证考试与电子/纸质证书。',
    examFormat: '官方机考 + 企业级场景方案评审',
    examDuration: '120 分钟',
    passingScore: '75 / 100 分',
    validityPeriod: '2 年',
    courseHours: '40 课时',
    feeText: '¥1,200 / 次',
    enrolledCount: 3150,
    syllabus: [
      {
        title: '模块一：FDE 前沿部署方法论与业务需求拆解',
        duration: '10 课时',
        topics: [
          '高价值 AI 业务场景识别与 ROI 可行性评估',
          '从 POC 原型验证到生产级交付的里程碑规划',
          'PEV（Plan-Execute-Verify）交付闭环落地实践'
        ]
      },
      {
        title: '模块二：企业智能体搭建与 Prompt 工程体系',
        duration: '16 课时',
        topics: [
          '腾讯云大模型知识引擎（LKE）深度编排与插件扩展',
          '复杂业务规则下的系统提示词工程与回归评测集设计',
          '多系统 ERP/CRM/OA 接口协同与人机协同审批流'
        ]
      },
      {
        title: '模块三：企业级安全治理与规模化运维交付',
        duration: '14 课时',
        topics: [
          '敏感数据分级保护、权限隔离与审计日志规范',
          '大模型输入输出内容安全风控策略配置',
          'SLA 监控告警、成本核算与客户验收移交标准'
        ]
      }
    ],
    recognitionPoints: [
      '腾讯云官方颁发并纳入腾讯云生态合作伙伴核心技术资质体系',
      '覆盖金融、政务、制造、零售四大行业真实企业交付案例剖析',
      '认证持证人可优先加入腾讯云 AI 前沿交付专家生态网络'
    ],
    introMarkdown: `**腾讯云人工智能前沿部署工程师（FDE）**是腾讯云面向企业级 AI 项目交付推出的权威官方职业认证，围绕真实企业客户现场落地挑战，全面检验从业务价值识别到规模化安全交付的端到端实战能力。

### 这个认证能证明什么？
- **体系化交付方法论**：掌握 FDE 与 PEV（Plan-Execute-Verify）交付闭环，能将模糊的客户诉求转化为可量化的 AI 交付指标。
- **企业级智能体工程落地**：熟练基于腾讯云知识引擎（LKE）构建复杂业务工作流，打通 ERP/CRM/OA 等核心系统接口。
- **合规安全与 SLA 保障**：具备制定敏感数据分级防护、内容安全风控及客户验收移交标准的专业能力。

### 适用价值场景
- **云生态伙伴交付资质**：作为腾讯云合作伙伴招投标与重点 AI 项目的官方核心人员资质背书。
- **企业内部 AI 落地负责人**：指导企业完成从 POC 试点到生产级规模化运营的规范化推进。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '40 课时',
        contentMarkdown: `涵盖金融、政务、制造、零售四大行业真实交付项目拆解：

- **模块 01 · FDE 方法论与需求挖掘（10 课时）**：高价值场景筛选、ROI 评估与 PEV 交付闭环设计。
- **模块 02 · 企业 Agent 搭建与 Prompt 工程（16 课时）**：LKE 知识引擎深度编排、回归评测与业务系统集成。
- **模块 03 · 企业级安全治理与运维移交（14 课时）**：权限隔离、内容风控策略与 SLA 验收标准。`
      },
      {
        id: 'step-prep',
        title: '备考与体验',
        hint: '开通后解锁',
        contentMarkdown: `解锁腾讯云官方实验环境与高仿真场景交付模板：

- 提供全套企业项目需求文档模板、提示词回归测试表与验收移交清单。
- 开放官方考纲模拟测评，提前熟悉真实案例评审打分维度。`
      },
      {
        id: 'step-exam',
        title: '参加考试',
        hint: '机考 + 方案评审',
        contentMarkdown: `考核包含线上理论与实务机考及企业级方案评审：

- 考试时长 **120 分钟**，综合成绩达到 **75 / 100 分** 即可获得认证资格。`
      },
      {
        id: 'step-cert',
        title: '领取证书',
        hint: '有效期 2 年',
        contentMarkdown: `成绩合格后由 **腾讯云官方** 签发认证证书（有效期 2 年），支持腾讯云官网认证查询系统公开核验。`
      }
    ],
    advisorContacts: [
      { label: '联系人', value: '陈顾问（腾讯云生态认证组）' },
      { label: '联系电话', value: '400-886-2026 转 805', copyable: true },
      { label: '电子邮箱', value: 'tencent-cert@qianji-ai.cn', copyable: true },
      { label: '服务时段', value: '工作日 09:00 - 19:00' }
    ],
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  },
  {
    id: 'cert-tencent-hunyuan',
    systemId: 'tencent',
    systemName: '腾讯云 AI 体系',
    name: '腾讯云混元大模型应用开发工程师（中级）',
    issuingBodies: ['腾讯云', '腾讯教育'],
    level: '中级',
    customTags: ['混元生态', '上机实操'],
    briefIntro:
      '依托腾讯云混元大模型与 TI 平台工具链，考核开发者在多模态内容生成、智能客服编排与云原生 AI 应用集成中的综合工程实践能力。',
    targetAudience: '全栈工程师 / 云开发工程师',
    coreCapabilities: [
      '混元API集成',
      '多模态工作流',
      'TI平台运维',
      '知识库召回优化',
      '云端成本控制',
      '业务场景评测'
    ],
    priceDisplay: '¥680.00',
    feeDescription: '含 30 课时混元官方课程、云端实操沙盒时长与 1 次认证考试机会。',
    examFormat: '理论考试 + 云端实验实操',
    examDuration: '100 分钟',
    passingScore: '70 / 100 分',
    validityPeriod: '2 年',
    courseHours: '30 课时',
    feeText: '¥680 / 次',
    enrolledCount: 2740,
    syllabus: [
      {
        title: '模块一：腾讯混元大模型能力矩阵与 SDK 集成',
        duration: '8 课时',
        topics: [
          '混元文本、代码与多模态视觉模型能力边界',
          '云函数 SCF 与混元 API 低延迟网关对接',
          '流式对话状态维护与上下文缓存机制'
        ]
      },
      {
        title: '模块二：TI 平台模型精调与知识检索应用',
        duration: '12 课时',
        topics: [
          'TI-ONE 平台数据准备、精调任务配置与模型托管',
          '企业级智能客服与营销助手多轮对话编排',
          '多模态图文理解与内容安全审核链路集成'
        ]
      },
      {
        title: '模块三：云原生观测、评测与成本优化',
        duration: '10 课时',
        topics: [
          '调用指标监控、延迟诊断与弹性配额策略',
          '业务准确率/满意度自动化评测流水线搭建',
          '大促高并发场景下的降级与容错设计'
        ]
      }
    ],
    recognitionPoints: [
      '腾讯云与腾讯教育联合认证，直通云端真实实验沙盒环境',
      '覆盖全栈开发者日常高频落地场景，即学即用',
      '证书在腾讯生态企业招聘与项目投标中具备官方权威背书'
    ],
    introMarkdown: `**腾讯云混元大模型应用开发工程师（中级）**由腾讯云与腾讯教育联合打造，重点面向全栈开发与云原生研发工程师，考核基于混元大模型与 TI 平台工具链快速构建生产级多模态 AI 应用的能力。

### 核心考核能力
- **混元多模态 API 与云函数集成**：熟练对接文本、代码与视觉理解模型，优化网关延迟与流式对话体验。
- **TI 平台精调与运维托管**：掌握数据集上传、精调任务配置、弹性扩缩容及调用配额管控。
- **高并发容错与成本优化**：能够设计缓存策略、降级容错方案及自动化业务评测流水线。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '30 课时',
        contentMarkdown: `通过云原生全栈项目实战，系统掌握混元生态工具链：

- **模块 01 · 混元能力矩阵与 SDK 集成（8 课时）**：云函数 SCF 接入、流式会话与上下文缓存。
- **模块 02 · TI 平台精调与多模态编排（12 课时）**：TI-ONE 托管实践、智能客服与图文安全审核。
- **模块 03 · 观测评测与成本治理（10 课时）**：延迟诊断、准确率评测与高并发降级设计。`
      },
      {
        id: 'step-prep',
        title: '云端实验备考',
        hint: '开通后解锁',
        contentMarkdown: `配套腾讯云端实验资源与官方模拟真题，支持浏览器一键启动完整云开发实验环境。`
      },
      {
        id: 'step-exam',
        title: '参加考试',
        hint: '理论 + 上机实操',
        contentMarkdown: `线上考试总时长 **100 分钟**，含客观理论考核与云端上机实操题，总分达 **70 / 100 分** 即为通过。`
      },
      {
        id: 'step-cert',
        title: '领取证书',
        hint: '有效期 2 年',
        contentMarkdown: `通过考核后签发腾讯云与腾讯教育双联合认证电子证书，有效期 2 年，支持官方编号核验。`
      }
    ],
    advisorContacts: [
      { label: '联系人', value: '陈顾问（腾讯云生态认证组）' },
      { label: '联系电话', value: '400-886-2026 转 805', copyable: true },
      { label: '电子邮箱', value: 'tencent-cert@qianji-ai.cn', copyable: true },
      { label: '服务时段', value: '工作日 09:00 - 19:00' }
    ],
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  },
  {
    id: 'cert-360-ade',
    systemId: '360',
    systemName: '360 ADE / FDE 体系',
    name: '360 安全大模型应用开发工程师（ADE）',
    issuingBodies: ['360 数字安全集团', 'ISC 认证中心'],
    level: '中级',
    customTags: ['安全大模型', '实战认证', '企业认可'],
    briefIntro:
      '聚焦 AI 原生安全与大模型攻防实战，考核安全语料构建、内容安全护栏配置及基于安全大模型的威胁研判与自动化响应开发能力。',
    targetAudience: '安全开发工程师 / AI工程师',
    coreCapabilities: [
      '大模型安全护栏',
      '提示词注入防御',
      '威胁情报研判',
      'SOAR联动编排',
      '数据脱敏治理',
      '安全评估报告'
    ],
    priceDisplay: '¥799.00',
    feeDescription: '含 32 课时安全攻防实战课程、靶场实训环境与 ISC 官方认证考试资格。',
    examFormat: '安全理论考核 + 靶场攻防实操',
    examDuration: '120 分钟',
    passingScore: '75 / 100 分',
    validityPeriod: '2 年',
    courseHours: '32 课时',
    feeText: '¥799 / 次',
    enrolledCount: 1680,
    syllabus: [
      {
        title: '模块一：大模型安全风险全景与护栏机制',
        duration: '10 课时',
        topics: [
          'OWASP LLM Top 10 漏洞原理与攻击面分析',
          '提示词注入（Prompt Injection）与越狱检测拦截',
          '敏感信息防泄漏（DLP）与动态脱敏网关设计'
        ]
      },
      {
        title: '模块二：安全大模型应用开发（ADE）实战',
        duration: '12 课时',
        topics: [
          '告警日志降噪与自动化威胁研判智能体构建',
          '安全知识图谱与私有漏洞库 RAG 增强检索',
          '与 SIEM / SOAR 平台联动实现分钟级应急响应'
        ]
      },
      {
        title: '模块三：AI 系统合规评测与红队演练',
        duration: '10 课时',
        topics: [
          '生成式人工智能服务安全基本要求落地自查',
          '自动化红队对抗测试集构建与风险量化评分',
          '企业级 AI 安全评估报告输出与整改闭环'
        ]
      }
    ],
    recognitionPoints: [
      '360 数字安全集团与 ISC 认证中心联合签发，紧贴政企安全合规刚需',
      '基于真实安全攻防靶场环境考核，强化工程实战含金量',
      '适用于金融、能源、政企等高安全等级行业 AI 项目准入'
    ],
    introMarkdown: `**360 安全大模型应用开发工程师（ADE）**由 360 数字安全集团与 ISC 认证中心联合推出，深度结合大模型内生安全防护与安全运营智能体开发两大实战方向。

### 这个认证能证明什么？
- **大模型安全护栏工程能力**：能针对提示词注入、越狱攻击、数据泄漏等典型风险构建输入输出安全防护网关。
- **AI 赋能安全运营（SecOps）**：能够开发告警降噪、威胁研判智能体并与 SIEM/SOAR 联动实现自动化响应。
- **合规自查与红队评测能力**：熟悉国内生成式 AI 安全合规要求，能独立完成红队演练与安全评估报告交付。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '32 课时',
        contentMarkdown: `结合 360 一线攻防实战沉淀，构建完整的 AI 安全开发知识体系：

- **模块 01 · 大模型安全风险与护栏设计（10 课时）**：OWASP LLM Top 10 拆解、注入防御与动态脱敏网关。
- **模块 02 · 安全运营智能体开发实战（12 课时）**：威胁情报 RAG、日志降噪与 SOAR 应急编排联动。
- **模块 03 · 红队对抗与安全合规评测（10 课时）**：自动化红队测试集与企业 AI 安全评估报告撰写。`
      },
      {
        id: 'step-prep',
        title: '攻防靶场体验',
        hint: '开通后解锁',
        contentMarkdown: `开放 360 在线安全大模型靶场，包含 12 个典型提示词攻防与安全研判场景演练任务。`
      },
      {
        id: 'step-exam',
        title: '参加考试',
        hint: '理论 + 靶场实操',
        contentMarkdown: `采用线上安全理论考核与靶场实操攻防验证，时长 **120 分钟**，**75 分** 及格通过。`
      },
      {
        id: 'step-cert',
        title: '领取证书',
        hint: 'ISC 官方认证',
        contentMarkdown: `通过考核后由 360 数字安全集团与 ISC 认证中心联合签发认证证书（有效期 2 年）。`
      }
    ],
    advisorContacts: [
      { label: '联系人', value: '周顾问（360 安全认证中心）' },
      { label: '联系电话', value: '400-886-2026 转 809', copyable: true },
      { label: '电子邮箱', value: 'sec-cert@qianji-ai.cn', copyable: true },
      { label: '服务时段', value: '工作日 09:00 - 18:30' }
    ],
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  },
  {
    id: 'cert-360-fde',
    systemId: '360',
    systemName: '360 ADE / FDE 体系',
    name: '360 企业级 AI 前沿交付专家（FDE）',
    issuingBodies: ['360 智脑', '360 数字安全集团'],
    level: '高级',
    customTags: ['前沿交付', '高含金量', '有效期2年'],
    briefIntro:
      '面向政企复杂业务系统的 AI 规模化落地专家认证，覆盖私有化知识大脑部署、跨系统智能体协同及全链路安全合规审计交付标准。',
    targetAudience: '政企解决方案专家 / 交付总监',
    coreCapabilities: [
      '政企架构设计',
      '多源知识融合',
      '智能体协同治理',
      '私有云高可用',
      '合规审计落地',
      '全周期项目管控'
    ],
    priceDisplay: '¥1,399.00',
    feeDescription: '含 42 课时政企标杆案例课程、架构评审辅导及双体系高级专家认证。',
    examFormat: '架构答辩 + 综合方案评审',
    examDuration: '150 分钟',
    passingScore: '80 / 100 分',
    validityPeriod: '2 年',
    courseHours: '42 课时',
    feeText: '¥1,399 / 次',
    enrolledCount: 840,
    syllabus: [
      {
        title: '模块一：政企级 AI 基础设施与私有化架构蓝图',
        duration: '14 课时',
        topics: [
          '国产化信创算力适配与私有云高可用集群设计',
          '跨部门异构数据源接入与多模态知识大脑融合',
          '业务流程重构与组织级 AI 转型顶层规划'
        ]
      },
      {
        title: '模块二：复杂多智能体协同与全链路安全审计',
        duration: '16 课时',
        topics: [
          '分级分权访问控制与跨智能体任务调度治理',
          '端到端内容安全审计与可追溯水印体系',
          '核心业务系统稳定性压测与容灾切换预案'
        ]
      },
      {
        title: '模块三：FDE 项目全生命周期交付与价值验收',
        duration: '12 课时',
        topics: [
          '里程碑风险识别、变更控制与跨团队协同管理',
          '量化业务指标验收与持续运营迭代机制',
          '大型政企标杆案例复盘与方案答辩演练'
        ]
      }
    ],
    recognitionPoints: [
      '360 智脑与数字安全双体系联合背书的高级交付架构师认证',
      '聚焦大型政企私有化、信创化与高安全合规交付核心场景',
      '持证专家优先获得平台重点企业悬赏需求定向推荐资格'
    ],
    introMarkdown: `**360 企业级 AI 前沿交付专家（FDE）**面向主导政企与大型央国企 AI 私有化落地项目的解决方案专家与交付总监，系统考核信创基础设施规划、多源知识融合与全链路安全审计交付能力。

### 核心证明价值
- **信创与私有化顶层架构能力**：精通国产化算力适配、高可用私有云部署及跨部门异构数据治理架构。
- **复杂多智能体安全治理**：具备分级分权控制、全链路内容审计与可追溯水印方案的设计交付能力。
- **政企项目全周期管控**：能够制定量化验收标准并把控大型 AI 项目从立项到持续运营的全生命周期风险。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '42 课时',
        contentMarkdown: `深度复盘大型政企私有化 AI 落地标杆案例：

- **模块 01 · 政企私有化架构蓝图（14 课时）**：信创算力适配、多模态知识大脑与组织转型规划。
- **模块 02 · 多智能体协同与安全审计（16 课时）**：分级分权治理、安全水印与容灾切换预案。
- **模块 03 · 全生命周期交付管控（12 课时）**：变更风险管理、指标验收与标杆案例复盘。`
      },
      {
        id: 'step-prep',
        title: '方案演练与辅导',
        hint: '开通后解锁',
        contentMarkdown: `提供政企级 AI 架构设计评审清单与标杆交付文档模板，并包含考前专家在线答疑辅导。`
      },
      {
        id: 'step-exam',
        title: '综合答辩与评审',
        hint: '150 分钟',
        contentMarkdown: `提交完整政企 AI 交付架构方案并完成线上专家答辩，综合评分达到 **80 / 100 分** 即通过认证。`
      },
      {
        id: 'step-cert',
        title: '领取专家证书',
        hint: '有效期 2 年',
        contentMarkdown: `签发 360 智脑与 360 数字安全集团双体系高级专家认证证书，并优先对接平台重点企业交付需求。`
      }
    ],
    advisorContacts: [
      { label: '联系人', value: '周顾问（360 安全认证中心）' },
      { label: '联系电话', value: '400-886-2026 转 809', copyable: true },
      { label: '电子邮箱', value: 'sec-cert@qianji-ai.cn', copyable: true },
      { label: '服务时段', value: '工作日 09:00 - 18:30' }
    ],
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  },
  {
    id: 'cert-aigc-l1',
    systemId: 'aigc',
    systemName: 'AIGC 部委与学会认证',
    name: 'AIGC 生成式人工智能应用师（初级）',
    issuingBodies: ['工信部教育与考试中心', '中国计算机学会'],
    level: '初级',
    customTags: ['部委发证', '全国通用', '零基础友好'],
    briefIntro:
      '权威部委与学会联合推出的通用 AI 素养认证，考核生成式文本、图像与办公自动化提效工具的规范化使用及人工智能伦理合规常识。',
    targetAudience: '职场办公人员 / 高校在校生',
    coreCapabilities: [
      '提示词写作',
      'AI办公提效',
      '多模态内容生成',
      '数据分析辅助',
      '版权与伦理合规',
      '场景化工作流'
    ],
    priceDisplay: '¥360.00',
    feeDescription: '费用含 20 课时通识实操课程、全国统考报名费及官方纸质/电子双版证书。',
    examFormat: '全国统考线上机考（客观题 + 实操任务）',
    examDuration: '90 分钟',
    passingScore: '60 / 100 分',
    validityPeriod: '长期有效',
    courseHours: '20 课时',
    feeText: '¥360 / 次',
    enrolledCount: 6420,
    syllabus: [
      {
        title: '模块一：生成式 AI 基础认知与高效提示词工程',
        duration: '6 课时',
        topics: [
          '主流大模型工具生态与任务匹配原则',
          '结构化提示词框架（角色/背景/约束/示例）',
          '常见幻觉识别与事实交叉核验技巧'
        ]
      },
      {
        title: '模块二：全场景办公与多模态创作提效',
        duration: '8 课时',
        topics: [
          '公文写作、会议纪要、PPT 与表格公式自动化',
          'AI 辅助视觉设计、配图生成与短视频脚本制作',
          '零代码个人效率智能体快速搭建'
        ]
      },
      {
        title: '模块三：数据安全、知识产权与 AI 伦理规范',
        duration: '6 课时',
        topics: [
          '企业敏感信息脱敏与合规使用边界',
          'AIGC 生成内容版权归属与标识规范',
          '行业典型违规案例解析与风险规避'
        ]
      }
    ],
    recognitionPoints: [
      '证书全国通用、官方平台可查，纳入专项技术技能人才测评档案',
      '零编程基础友好，系统化提升个人数字化职场核心竞争力',
      '支持高校学分认定参考及企事业单位员工 AI 通识培训考核'
    ],
    introMarkdown: `**AIGC 生成式人工智能应用师（初级）**面向非技术与通用职场人群及高校学生，零编程门槛，帮助学习者系统建立高效提示词写作、办公自动化与 AI 合规使用素养。

### 核心学习收获
- **结构化提示词方法论**：告别零散提问，掌握可复用的角色设定、约束边界与交叉核验技巧。
- **全场景办公提效**：覆盖公文撰写、表格数据清洗、PPT 生成及多模态配图视频辅助创作。
- **版权与信息安全意识**：明晰企业敏感数据脱敏红线与 AIGC 内容合规标识要求。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '20 课时',
        contentMarkdown: `零基础循序渐进掌握职场高频 AIGC 工具与工作流：

- **模块 01 · 生成式 AI 认知与提示词框架（6 课时）**：主流工具选型、结构化提示词与幻觉核验。
- **模块 02 · 全场景办公与多模态创作（8 课时）**：文档、表格、PPT 与视觉内容高效协同。
- **模块 03 · 数据安全与伦理合规（6 课时）**：信息脱敏边界、版权归属与合规标识规范。`
      },
      {
        id: 'step-prep',
        title: '题库练习与体验',
        hint: '开通后解锁',
        contentMarkdown: `解锁全国统考官方真题题库与 20+ 职场实战提示词模板包，考前轻松演练。`
      },
      {
        id: 'step-exam',
        title: '参加统考',
        hint: '线上机考 · 90 分钟',
        contentMarkdown: `每月开放多场全国线上统考批次，时长 **90 分钟**，**60 / 100 分** 及格通过。`
      },
      {
        id: 'step-cert',
        title: '领取全国通用证书',
        hint: '长期有效',
        contentMarkdown: `成绩合格后纳入专项人才测评档案，颁布长期有效的全国通用电子与纸质证书。`
      }
    ],
    advisorContacts: [
      { label: '联系人', value: '孙老师（部委认证教务处）' },
      { label: '联系电话', value: '400-886-2026 转 812', copyable: true },
      { label: '电子邮箱', value: 'aigc-exam@qianji-ai.cn', copyable: true },
      { label: '服务时段', value: '周一至周六 09:00 - 18:00' }
    ],
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  },
  {
    id: 'cert-aigc-l2',
    systemId: 'aigc',
    systemName: 'AIGC 部委与学会认证',
    name: '工业与信息化领域 AI 工程技术人才（中级）',
    issuingBodies: ['工信部人才交流中心', '中国人工智能学会'],
    level: '中级',
    customTags: ['国家级背书', '人才入库'],
    briefIntro:
      '纳入国家重点领域产业人才能力评价体系，重点考察行业模型评测、数据工程管线搭建、自动化智能体集成及企业数字化转型落地能力。',
    targetAudience: '行业数字化骨干 / AI产品经理',
    coreCapabilities: [
      '行业需求建模',
      '数据管线构建',
      '模型效果评测',
      '智能体方案设计',
      '业务ROI核算',
      '跨部门协作交付'
    ],
    priceDisplay: '¥780.00',
    feeDescription: '含 34 课时产业实战课程、案例评审指导及国家级人才评价入库证书。',
    examFormat: '综合理论评测 + 行业案例方案设计',
    examDuration: '120 分钟',
    passingScore: '70 / 100 分',
    validityPeriod: '长期有效',
    courseHours: '34 课时',
    feeText: '¥780 / 次',
    enrolledCount: 2180,
    syllabus: [
      {
        title: '模块一：产业数字化场景分析与 AI 产品建模',
        duration: '10 课时',
        topics: [
          '工业、金融、医疗等垂直场景 AI 落地路径拆解',
          '业务痛点抽象、评测指标定义与 ROI 测算模型',
          'AI 产品原型设计与人机协同交互规范'
        ]
      },
      {
        title: '模块二：行业数据工程管线与模型评测体系',
        duration: '12 课时',
        topics: [
          '企业非结构化文档治理与知识资产沉淀标准',
          '多维度模型评测基准与成本/精度平衡策略',
          '持续反馈数据回流与迭代闭环管理'
        ]
      },
      {
        title: '模块三：智能化方案集成与跨部门项目推进',
        duration: '12 课时',
        topics: [
          '智能体工作流与现有信息化系统集成方案',
          '跨算法、研发、合规与业务团队的高效协同',
          '项目上线验收、运营指标看板与持续推广'
        ]
      }
    ],
    recognitionPoints: [
      '考核通过后纳入工业和信息化领域专业技术人才评价数据库',
      '兼顾技术工程理解与业务产品落地，适配 AI 转型核心骨干岗位',
      '提供官方纸质与电子双版证书，助力职称评审与职业晋升'
    ],
    introMarkdown: `**工业与信息化领域 AI 工程技术人才（中级）**由工信部人才交流中心与中国人工智能学会联合背书，考核兼具业务洞察与工程落地能力的复合型产业 AI 骨干人才。

### 这个认证能证明什么？
- **产业场景建模与 ROI 评估**：能够精准识别垂直行业高价值 AI 落地切入点并建立量化投入产出评估模型。
- **数据资产与评测闭环能力**：掌握企业非结构化知识治理标准、多维模型评测体系与反馈数据回流机制。
- **跨部门 AI 项目推进能力**：具备统筹算法、工程、合规与业务团队完成智能化方案上线验收的综合实力。`,
    learningPath: [
      {
        id: 'step-course',
        title: '课程学习',
        hint: '34 课时',
        contentMarkdown: `紧贴工业、金融、医疗等实体产业数字化转型实践：

- **模块 01 · 产业场景分析与 AI 产品建模（10 课时）**：垂直行业路径拆解、ROI 测算与人机协同原型设计。
- **模块 02 · 数据工程管线与评测体系（12 课时）**：非结构化知识治理、评测基准与数据回流迭代。
- **模块 03 · 智能化集成与跨部门推进（12 课时）**：信息化系统集成、上线验收与运营指标看板。`
      },
      {
        id: 'step-prep',
        title: '案例研习与备考',
        hint: '开通后解锁',
        contentMarkdown: `解锁行业真实转型案例库与方案设计评分细则，支持在线模拟自测。`
      },
      {
        id: 'step-exam',
        title: '参加评测考试',
        hint: '综合评测 · 120 分钟',
        contentMarkdown: `线上完成综合理论评测与行业方案设计考核，时长 **120 分钟**，**70 / 100 分** 及格。`
      },
      {
        id: 'step-cert',
        title: '人才入库与领证',
        hint: '长期有效',
        contentMarkdown: `考核通过后正式纳入工业和信息化领域专业技术人才评价数据库，签发官方电子与纸质双版证书。`
      }
    ],
    advisorContacts: [
      { label: '联系人', value: '孙老师（部委认证教务处）' },
      { label: '联系电话', value: '400-886-2026 转 812', copyable: true },
      { label: '电子邮箱', value: 'aigc-exam@qianji-ai.cn', copyable: true },
      { label: '服务时段', value: '周一至周六 09:00 - 18:00' }
    ],
    advisorQrHint: '扫码添加专属顾问获取报名通道'
  }
];
