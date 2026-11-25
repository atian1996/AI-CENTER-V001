import {
  CertificationAdvisorField,
  CertificationItem,
  CertificationSystem
} from '../types';

export const CERTIFICATION_SYSTEMS: CertificationSystem[] = [
  {
    id: 'fde',
    name: 'FDE 体系',
    shortName: 'FDE',
    description: '围绕前沿部署工程（Forward Deployed Engineering）打造的企业级大模型应用与项目落地实战课程。'
  },
  {
    id: 'ade',
    name: 'ADE 体系',
    shortName: 'ADE',
    description: '面向 AI 应用与模型工程开发者的全栈研发、多模态集成与大模型分布式微调高阶课程。'
  },
  {
    id: 'aigc',
    name: 'AIGC 体系',
    shortName: 'AIGC',
    description: '聚焦生成式 AI 办公提效、商业视觉工作流与低代码智能体搭建的通用实战课程。'
  },
  {
    id: 'ai-security',
    name: '人工智能安全体系',
    shortName: 'AI安全',
    description: '紧贴大模型攻防一线，覆盖内容安全护栏、提示词注入防御与政企 AI 合规治理的专项实战课程。'
  }
];

const DEFAULT_ADVISOR_CONTACTS: CertificationAdvisorField[] = [
  { label: '联系人', value: '林顾问（课程培训中心）' },
  { label: '联系电话', value: '400-886-2026 转 802', copyable: true },
  { label: '电子邮箱', value: 'course@qianji-ai.cn', copyable: true },
  { label: '服务时段', value: '工作日 09:00 - 19:00' }
];

const SECURITY_ADVISOR_CONTACTS: CertificationAdvisorField[] = [
  { label: '联系人', value: '周顾问（AI 安全教研组）' },
  { label: '联系电话', value: '400-886-2026 转 809', copyable: true },
  { label: '电子邮箱', value: 'sec-course@qianji-ai.cn', copyable: true },
  { label: '服务时段', value: '工作日 09:00 - 18:30' }
];

const AIGC_ADVISOR_CONTACTS: CertificationAdvisorField[] = [
  { label: '联系人', value: '孙老师（AIGC 教研中心）' },
  { label: '联系电话', value: '400-886-2026 转 812', copyable: true },
  { label: '电子邮箱', value: 'aigc-course@qianji-ai.cn', copyable: true },
  { label: '服务时段', value: '周一至周六 09:00 - 18:00' }
];

export const MOCK_CERTIFICATIONS: CertificationItem[] = [
  // =========================================================================
  // 1. FDE 体系（初级 / 中级 / 高级）
  // =========================================================================
  {
    id: 'course-fde-l1',
    systemId: 'fde',
    systemName: 'FDE 体系',
    name: 'FDE 体系（初级）：大模型应用工程师实战',
    detailTitle: '大模型应用工程师（初级）实战课',
    shortLevelName: 'FDE 初级',
    issuingBodies: ['FDE 教研中心'],
    level: '初级',
    customTags: ['实战', '推荐零基础', '含项目实操'],
    briefIntro:
      '本课程旨在帮开发者快速掌握大模型理论基础与工程实战能力，通过真实业务案例完成 Python SDK 接入、结构化 Prompt 编写与轻量级 RAG 问答助手开发。',
    targetAudience: '培养AI入门级业务人才 / 零基础开发者',
    coreCapabilities: [
      'Python基础',
      'API调用',
      '简易RAG搭建',
      '基础调试',
      '前后端交互',
      '接口封装'
    ],
    priceDisplay: '¥399.00',
    feeDescription: '费用含 24 课时全套高清视频课程、云端在线实验沙盒、完整项目源码与专属导师答疑。',
    examFormat: '阶段项目实操验收',
    examDuration: '随学随练',
    passingScore: '完成项目交付',
    validityPeriod: '长期有效',
    courseHours: '24 课时',
    feeText: '¥399 / 门',
    enrolledCount: 4820,
    syllabus: [
      {
        title: '模块一：大语言模型核心原理与工程基础',
        duration: '6 课时',
        topics: [
          'Transformer 基础架构与上下文窗口机制',
          '主流大模型选型策略与 Token 成本核算',
          '结构化提示词编写与 JSON 输出格式控制'
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
      '零基础友好，配套开箱即用的云端 Python 实训环境与测试额度',
      '手把手交付 1 个可直接写入简历的企业知识库问答 Web 项目',
      '赠送高频业务 Prompt 模板库与完整前后端参考源码'
    ],
    introMarkdown: `**大模型应用工程师（初级）实战课**隶属 FDE 体系入门核心课，面向希望系统迈入大模型应用开发领域的零基础开发者、高校学生及业务技术同学，用“原理精讲 + 代码实操 + 项目交付”的方式带你快速打通大模型工程落地第一公里。

### 学完这门课你将收获什么？
- **体系化工程基础**：透彻理解大语言模型推理机制、上下文窗口边界、Token 成本核算与结构化提示词设计方法。
- **独立接口集成能力**：熟练使用 Python SDK 调用主流大模型接口，掌握流式输出（SSE）、异常重试及 RESTful 后端服务封装。
- **轻量级 RAG 项目落地**：从零搭建企业文档知识库问答助手，完成文档切片、向量化检索、上下文注入及效果调试全流程。

### 典型实战应用场景
- **企业内部问答助手**：快速构建面向制度文档、产品手册的检索增强型知识库问答系统。
- **业务流程提效插件**：为现有 Web 应用或办公系统接入智能摘要、文本分类与结构化抽取能力。
- **项目作品与求职加分**：产出结构规范、可线上演示的完整 AI 应用工程，助力转岗与技术面试。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：大语言模型核心原理与工程基础',
        hint: '6 课时',
        contentMarkdown: `夯实大模型底层认知与工程开发前置知识，告别“只会聊天不会开发”：

- **课时 1-2 · LLM 工作机制**：Transformer 核心原理、Token 计费模型与上下文窗口管理策略。
- **课时 3-4 · 模型选型与参数调优**：Temperature / Top-P / Max Tokens 参数对业务输出稳定性的影响。
- **课时 5-6 · 结构化 Prompt 工程**：角色设定、Few-Shot 示例编写与强制 JSON Schema 输出控制。`
      },
      {
        id: 'mod-2',
        title: '模块二：Python SDK 接入与接口工程封装',
        hint: '6 课时',
        contentMarkdown: `手把手完成从单脚本调用到工程化后端服务的完整演进：

- **课时 7-8 · SDK 规范接入**：API Key 环境变量安全托管、多模型客户端封装与会话历史管理。
- **课时 9-10 · 流式响应（SSE）实战**：实现打字机式实时流式输出，显著优化首字响应体验（TTFT）。
- **课时 11-12 · 稳定性与前后端联调**：超时熔断、指数退避重试机制及 FastAPI + 前端对话页联调。`
      },
      {
        id: 'mod-3',
        title: '模块三：轻量级知识库（RAG）应用实战',
        hint: '8 课时',
        contentMarkdown: `围绕真实企业文档问答需求，亲手构建端到端检索增强生成系统：

- **课时 13-15 · 文档解析与切片策略**：PDF / Markdown / Word 文档清洗、语义分块与重叠窗口设计。
- **课时 16-18 · 向量检索与上下文注入**：Embedding 模型调用、本地向量库索引构建与 Top-K 召回调优。
- **课时 19-20 · 回答溯源与基础调试**：防幻觉提示词约束、引用来源标注及常见检索失败案例排查。`
      },
      {
        id: 'mod-4',
        title: '模块四：综合项目交付与上线演练',
        hint: '4 课时',
        contentMarkdown: `将前序模块整合为可独立运行的生产级原型项目并完成云端部署：

- **课时 21-22 · 项目整合实战**：完成“企业智能制度问答助手”完整前后端功能开发与日志埋点。
- **课时 23-24 · 容器化打包与演示**：编写 Dockerfile 完成一键部署，输出标准项目说明文档与复盘总结。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属课程顾问获取试听与报名通道'
  },
  {
    id: 'course-fde-l2',
    systemId: 'fde',
    systemName: 'FDE 体系',
    name: 'FDE 体系（中级）：企业级智能体与工作流部署实战',
    detailTitle: '企业级智能体与工作流部署（中级）实战课',
    shortLevelName: 'FDE 中级',
    issuingBodies: ['FDE 教研中心'],
    level: '中级',
    customTags: ['实战', '含项目实操', '源码交付'],
    briefIntro:
      '本课程面向具备一定开发经验的工程师，深入讲授 Function Calling、MCP 协议集成、企业级混合检索 RAG 精排优化及多 Agent 协同工作流生产部署。',
    targetAudience: '应用开发工程师 / 全栈研发工程师',
    coreCapabilities: [
      'Function Calling',
      '企业级RAG架构',
      '多Agent编排',
      'Prompt评测调优',
      '向量检索优化',
      '高并发服务部署'
    ],
    priceDisplay: '¥699.00',
    feeDescription: '费用含 36 课时实战精讲、企业级沙盒环境、全套工程源码与多 Agent 架构模板。',
    examFormat: '沙盒项目实战交付',
    examDuration: '随学随练',
    passingScore: '完成沙盒交付',
    validityPeriod: '长期有效',
    courseHours: '36 课时',
    feeText: '¥699 / 门',
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
        duration: '12 课时',
        topics: [
          'BM25 + 向量双路召回与 Rerank 重排模型应用',
          '多模态表格/PDF 复杂版面解析管线',
          '幻觉抑制、溯源引用与自动化评测基准构建'
        ]
      },
      {
        title: '模块三：多智能体协同编排与生产部署',
        duration: '14 课时',
        topics: [
          '状态机工作流与多角色 Agent 分工协作',
          '可观测性链路追踪与并发吞吐压测',
          '灰度发布、版本回滚与 Token 成本治理'
        ]
      }
    ],
    recognitionPoints: [
      '完整拆解金融研报分析与智能工单路由 2 个企业级生产案例',
      '提供自动化 RAG / Agent 评测脚本与全链路追踪模板',
      '直接覆盖企业中高级 AI 应用开发核心技能栈'
    ],
    introMarkdown: `**企业级智能体与工作流部署（中级）实战课**聚焦真实生产环境的工程痛点，系统解决“Demo 惊艳但线上不可用”的落地难题，带你全面掌握复杂工具调用、高精度混合检索与多 Agent 协同编排技术。

### 核心实战能力提升
- **工具调用与 MCP 协议落地**：熟练设计复杂函数 Schema，安全对接企业数据库、业务 API 与外部工具生态。
- **高精度企业级 RAG 架构**：掌握 BM25 + 向量双路召回、Rerank 重排、复杂 PDF 表格解析及自动化评测基准构建。
- **生产级可观测与高并发部署**：具备全链路 Tracing 追踪、并发压测调优、灰度回滚与 Token 成本治理的完整工程经验。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：工具调用与 MCP 协议集成',
        hint: '10 课时',
        contentMarkdown: `打通大模型与外部业务系统的双向连接，实现可控、可审计的工具执行链路：

- **函数 Schema 工程设计**：多参数嵌套校验、容错纠偏与多步工具串并联调用。
- **MCP 协议服务端开发**：编写标准 MCP Server 接入企业数据库查询与内部工单 API。
- **长会话记忆管理**：滑动窗口、摘要压缩与用户画像长期记忆持久化方案。`
      },
      {
        id: 'mod-2',
        title: '模块二：企业级 RAG 混合检索与精排优化',
        hint: '12 课时',
        contentMarkdown: `攻克复杂企业文档召回率低、答案幻觉多等核心瓶颈：

- **复杂文档解析管线**：PDF 跨页表格、扫描件 OCR 与父子文档层级索引设计。
- **混合检索与重排**：BM25 关键词检索 + 向量语义检索融合（RRF）与 Rerank 模型精排。
- **自动化评测体系**：构建黄金评测集，量化追踪 Recall@K、忠实度与答案相关性指标。`
      },
      {
        id: 'mod-3',
        title: '模块三：多智能体状态机编排实战',
        hint: '8 课时',
        contentMarkdown: `从单 Agent 迈向分工明确、状态可控的多智能体协同工作流：

- **图状态机工作流**：路由分发、条件分支、人工介入审批（Human-in-the-Loop）与断点续跑。
- **多角色协同案例**：实战搭建“金融研报自动解析与多维洞察”多 Agent 协同系统。`
      },
      {
        id: 'mod-4',
        title: '模块四：生产级可观测与高并发部署',
        hint: '6 课时',
        contentMarkdown: `面向线上高并发真实流量，补齐 AI 应用的运维与治理能力：

- **全链路追踪与排障**：Prompt 版本管理、每步延迟拆解与异常调用回放分析。
- **并发压测与成本治理**：语义缓存、大小模型分级路由与高并发限流降级实战。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属课程顾问获取试听与报名通道'
  },
  {
    id: 'course-fde-l3',
    systemId: 'fde',
    systemName: 'FDE 体系',
    name: 'FDE 体系（高级）：人工智能前沿部署专家实战',
    detailTitle: '人工智能前沿部署专家（高级）实战课',
    shortLevelName: 'FDE 高级',
    issuingBodies: ['FDE 教研中心'],
    level: '高级',
    customTags: ['实战', '企业级项目', '含架构评审'],
    briefIntro:
      '本课程聚焦企业 AI 项目端到端规模化交付，系统讲授 FDE 与 PEV 交付闭环、多源知识大脑融合、跨系统接口协同与私有化高可用安全治理实战。',
    targetAudience: '交付工程师 / 解决方案架构师',
    coreCapabilities: [
      '需求挖掘',
      'Agent 搭建',
      'Prompt 工程',
      'PEV交付闭环',
      '企业级安全治理',
      'FDE方法论'
    ],
    priceDisplay: '¥1,299.00',
    feeDescription: '费用含 44 课时专家级课程、四大行业标杆交付案例库、交付模板包与架构评审辅导。',
    examFormat: '架构方案评审演练',
    examDuration: '随学随练',
    passingScore: '完成架构评审',
    validityPeriod: '长期有效',
    courseHours: '44 课时',
    feeText: '¥1,299 / 门',
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
        title: '模块二：企业级智能体搭建与跨系统协同集成',
        duration: '14 课时',
        topics: [
          '多源异构知识大脑融合与权限感知检索设计',
          '复杂业务规则下的系统提示词工程与回归评测体系',
          'ERP / CRM / OA 核心业务系统接口协同与审批流集成'
        ]
      },
      {
        title: '模块三：企业级安全治理与规模化验收移交',
        duration: '20 课时',
        topics: [
          '敏感数据分级保护、私有云高可用集群与容灾设计',
          '大模型输入输出内容风控与全链路审计日志规范',
          'SLA 监控告警、成本核算与大型客户验收移交标准'
        ]
      }
    ],
    recognitionPoints: [
      '深度复盘金融、政务、制造、零售四大行业真实交付项目',
      '赠送全套企业需求调研清单、回归测试表与验收移交模板',
      '涵盖从 POC 验证到生产级规模化运营的完整 FDE 方法论'
    ],
    introMarkdown: `**人工智能前沿部署专家（高级）实战课**专为一线企业级 AI 交付工程师、解决方案架构师与技术负责人打造，围绕真实客户现场的复杂交付挑战，系统传授从业务价值诊断到大规模安全落地的端到端方法论与工程实践。

### 课程核心亮点
- **体系化 FDE 与 PEV 交付方法论**：掌握将模糊业务诉求拆解为可量化 AI 验收指标的系统框架，大幅提升项目交付成功率。
- **跨系统复杂业务集成**：实战演练多源异构数据融合、权限感知 RAG 检索及 ERP / CRM / OA 核心系统的深度协同。
- **私有化安全治理与 SLA 移交**：建立完善的敏感数据分级防护、内容安全风控、高可用容灾及客户验收交付标准体系。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：FDE 前沿部署方法论与需求挖掘',
        hint: '10 课时',
        contentMarkdown: `建立面向业务结果的 AI 项目顶层规划思维，避开“技术自嗨”陷阱：

- **高价值场景筛选**：通过可行性与 ROI 矩阵快速锁定企业优先落地场景。
- **PEV 交付闭环实战**：Plan-Execute-Verify 迭代推进机制与 POC 到生产环境的里程碑拆解。`
      },
      {
        id: 'mod-2',
        title: '模块二：多源知识融合与复杂智能体架构',
        hint: '14 课时',
        contentMarkdown: `攻克大型企业跨部门、多系统、多权限的复杂业务集成挑战：

- **权限感知知识大脑**：对接企业 RBAC 权限体系，确保文档检索与回答严格按角色隔离。
- **核心业务系统集成**：打通 ERP / CRM / OA 业务接口，构建带人机协同审批的闭环 Agent。`
      },
      {
        id: 'mod-3',
        title: '模块三：私有化高可用与企业级安全治理',
        hint: '12 课时',
        contentMarkdown: `满足大型央国企与金融客户严苛的安全、合规与稳定性指标要求：

- **私有云集群与信创适配**：国产化算力适配、多租户隔离与故障容灾切换预案。
- **全链路风控与审计**：敏感数据脱敏、输入输出内容安全策略与可追溯审计日志规范。`
      },
      {
        id: 'mod-4',
        title: '模块四：四大行业标杆复盘与验收移交',
        hint: '8 课时',
        contentMarkdown: `真实还原金融、政务、制造、零售四大标杆项目的完整交付细节：

- **量化验收与 SLA 运维**：制定上线验收指标清单、成本监控看板及客户运维移交手册。
- **架构评审实战演练**：针对典型政企招标需求完成端到端架构方案输出与点评优化。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属课程顾问获取试听与报名通道'
  },

  // =========================================================================
  // 2. ADE 体系（初级 / 中级 / 高级）
  // =========================================================================
  {
    id: 'course-ade-l1',
    systemId: 'ade',
    systemName: 'ADE 体系',
    name: 'ADE 体系（初级）：AI 原生应用与全栈开发入门',
    detailTitle: 'AI 原生应用与全栈开发（初级）实战课',
    shortLevelName: 'ADE 初级',
    issuingBodies: ['ADE 教研中心'],
    level: '初级',
    customTags: ['实战', '推荐零基础', '含项目实操'],
    briefIntro:
      '本课程带领开发者从零搭建全栈 AI 原生 Web 应用，覆盖主流大模型网关接入、流式对话界面交互、会话状态持久化与云端一键上线部署。',
    targetAudience: '前端/后端开发者 / 高校计算机学生',
    coreCapabilities: [
      '大模型API网关',
      '流式UI交互',
      '会话上下文管理',
      '结构化JSON输出',
      '错误降级处理',
      '云原生部署'
    ],
    priceDisplay: '¥429.00',
    feeDescription: '费用含 26 课时全栈实战录播、云端开发沙盒、前后端完整项目脚手架与答疑支持。',
    examFormat: '全栈项目实操交付',
    examDuration: '随学随练',
    passingScore: '完成项目上线',
    validityPeriod: '长期有效',
    courseHours: '26 课时',
    feeText: '¥429 / 门',
    enrolledCount: 3260,
    syllabus: [
      {
        title: '模块一：AI 原生应用架构与多模型网关接入',
        duration: '8 课时',
        topics: [
          'AI Native 应用与传统 Web 应用架构差异',
          'OpenAI 兼容协议与多厂商模型统一网关封装',
          'Token 计费监控、限流与熔断降级机制'
        ]
      },
      {
        title: '模块二：流式对话交互与生成式 UI 开发',
        duration: '10 课时',
        topics: [
          'SSE 流式渲染、Markdown 与代码块高亮组件实战',
          '结构化输出驱动动态卡片（Generative UI）交互',
          '会话历史持久化、中断生成与多轮上下文裁剪'
        ]
      },
      {
        title: '模块三：云原生部署与线上性能优化',
        duration: '8 课时',
        topics: [
          '环境变量安全治理与前端防滥用鉴权策略',
          '首字延迟（TTFT）优化与响应缓存实践',
          '全栈项目打包发布与线上日志监控'
        ]
      }
    ],
    recognitionPoints: [
      '手把手打通前端交互、后端网关与云端部署全栈闭环',
      '提供可复用的 React + TypeScript + Node/Python AI 全栈脚手架',
      '适合传统前后端工程师快速转型 AI 应用开发'
    ],
    introMarkdown: `**AI 原生应用与全栈开发（初级）实战课**专为希望快速切入 AI 应用赛道的前后端工程师与高校学生设计，聚焦产品化交付体验，带你从零打造交互流畅、架构规范的全栈 AI 原生 Web 应用。

### 课程核心收获
- **多模型统一网关能力**：一套代码无缝切换多家主流大模型，内置超时重试、限流保护与 Token 账单统计。
- **丝滑流式交互体验**：掌握 SSE 实时流式渲染、Markdown/图表动态展示及结构化数据驱动的生成式 UI 开发。
- **独立上线运营能力**：完成用户鉴权、上下文存储、性能监控与云端部署，交付可真实对外服务的完整产品。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：AI 原生架构与统一模型网关',
        hint: '8 课时',
        contentMarkdown: `建立清晰的 AI 全栈工程分层，屏蔽底层不同模型厂商接口差异：

- **协议适配与路由**：基于标准 OpenAI 兼容协议封装多模型适配层与自动故障切换。
- **成本与限流管控**：实现接口级频率限制、Token 消耗统计与异常降级兜底策略。`
      },
      {
        id: 'mod-2',
        title: '模块二：流式对话交互与生成式 UI 实战',
        hint: '10 课时',
        contentMarkdown: `打造媲美一线 AI 产品的细腻前端交互体验：

- **高流畅流式渲染**：处理 SSE 分片拼接、打断生成、自动滚动与代码/公式高亮渲染。
- **结构化生成式 UI**：让模型稳定输出结构化 JSON，动态渲染对比表格、操作卡片与图表组件。`
      },
      {
        id: 'mod-3',
        title: '模块三：上下文持久化与全栈项目实战',
        hint: '8 课时',
        contentMarkdown: `完整实现“AI 智能写作与研报助手”全栈产品并发布上线：

- **多轮会话管理**：数据库表结构设计、历史对话分页加载与长上下文智能裁剪。
- **安全部署上线**：密钥服务端隔离、基础防刷校验与云端容器一键发布。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属课程顾问获取试听与报名通道'
  },
  {
    id: 'course-ade-l2',
    systemId: 'ade',
    systemName: 'ADE 体系',
    name: 'ADE 体系（中级）：多模态应用与云原生智能体开发',
    detailTitle: '多模态应用与云原生智能体开发（中级）实战课',
    shortLevelName: 'ADE 中级',
    issuingBodies: ['ADE 教研中心'],
    level: '中级',
    customTags: ['实战', '含项目实操', '多模态开发'],
    briefIntro:
      '本课程围绕文本、视觉、语音多模态大模型与云原生工具链，系统演练图文解析管线、多轮智能客服编排、自动化效果评测与云端成本治理实战。',
    targetAudience: '全栈工程师 / 云开发工程师',
    coreCapabilities: [
      '多模态API集成',
      '图文解析工作流',
      '云端服务运维',
      '知识库召回优化',
      '云端成本控制',
      '业务场景评测'
    ],
    priceDisplay: '¥680.00',
    feeDescription: '费用含 32 课时多模态与云原生实战课程、云端实验沙盒时长与完整项目代码仓库。',
    examFormat: '多模态项目实战交付',
    examDuration: '随学随练',
    passingScore: '完成项目交付',
    validityPeriod: '长期有效',
    courseHours: '32 课时',
    feeText: '¥680 / 门',
    enrolledCount: 2740,
    syllabus: [
      {
        title: '模块一：多模态模型能力矩阵与低延迟网关集成',
        duration: '8 课时',
        topics: [
          '文本、视觉理解（VLM）与语音（ASR/TTS）模型能力边界',
          '云函数 Serverless 与多模态低延迟网关对接',
          '大文件音视频切片处理与异步任务队列设计'
        ]
      },
      {
        title: '模块二：多模态图文解析与多轮业务智能体编排',
        duration: '14 课时',
        topics: [
          '复杂单据、图表与商品图的视觉信息结构化抽取',
          '多轮智能客服与营销导购对话状态机编排',
          '多模态图文审核与业务规则引擎协同集成'
        ]
      },
      {
        title: '模块三：云原生观测、自动化评测与成本优化',
        duration: '10 课时',
        topics: [
          '调用指标监控、延迟诊断与弹性扩缩容配置',
          '业务准确率/满意度自动化评测流水线搭建',
          '大促高并发场景下的模型分级路由与容错设计'
        ]
      }
    ],
    recognitionPoints: [
      '一站式掌握文本 + 视觉 + 语音多模态工程落地核心技巧',
      '覆盖电商导购、单据识别、智能客服等高频真实业务场景',
      '提供云端一键启动的完整多模态实训实验环境'
    ],
    introMarkdown: `**多模态应用与云原生智能体开发（中级）实战课**面向全栈及云原生研发工程师，突破纯文本交互局限，深入讲解视觉理解、语音交互与 Serverless 云原生架构的融合实践，助你构建高并发、低成本的生产级多模态 AI 应用。

### 核心工程模块
- **多模态融合接入**：熟练编排视觉大模型（VLM）、语音识别与语音合成链路，攻克图片/音视频异步处理难题。
- **高准确率业务智能体**：结合视觉结构化抽取与多轮意图路由，落地智能单据审单、视觉质检与全渠道智能客服。
- **云原生观测与成本优化**：构建自动化评测流水线、弹性扩缩容及高低配模型动态分流方案，显著降低线上推理成本。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：多模态能力矩阵与云原生网关',
        hint: '8 课时',
        contentMarkdown: `全面掌握文本、图像与语音多模态 API 的工程化调用范式：

- **视觉与语音协同**：图片压缩编码优化、ASR 实时转写与 TTS 流式语音播报链路集成。
- **云函数与异步编排**：基于对象存储与消息队列构建高吞吐多模态文件处理管线。`
      },
      {
        id: 'mod-2',
        title: '模块二：复杂单据图文解析实战',
        hint: '10 课时',
        contentMarkdown: `攻克企业高频的票据、合同扫描件与复杂图表自动解析任务：

- **VLM 结构化抽取**：版面区域定位、表格还原与字段置信度交叉校验。
- **多模态 RAG 检索**：实现图文混排知识库构建与带配图依据的精准问答。`
      },
      {
        id: 'mod-3',
        title: '模块三：多轮业务智能体协同编排',
        hint: '8 课时',
        contentMarkdown: `实战打造支持文字与图片输入的企业级多轮智能客服助手：

- **意图识别与槽位填充**：复杂售后流程引导、订单工具查询与人工坐席平滑转接。
- **安全与合规过滤**：多模态图文内容合规校验与敏感话术拦截机制。`
      },
      {
        id: 'mod-4',
        title: '模块四：线上可观测、评测与成本治理',
        hint: '6 课时',
        contentMarkdown: `保障多模态应用在高并发业务下的稳定运行与可控成本：

- **自动化评测流水线**：批量回放真实业务日志，持续衡量抽取准确率与响应耗时。
- **高并发弹性治理**：热点缓存、大小模型动态路由及限流降级压测实战。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属课程顾问获取试听与报名通道'
  },
  {
    id: 'course-ade-l3',
    systemId: 'ade',
    systemName: 'ADE 体系',
    name: 'ADE 体系（高级）：大模型架构设计与分布式微调实战',
    detailTitle: '大模型架构设计与分布式微调（高级）实战课',
    shortLevelName: 'ADE 高级',
    issuingBodies: ['ADE 教研中心'],
    level: '高级',
    customTags: ['实战', '含算力实操', '深度工程'],
    briefIntro:
      '本课程面向企业私有化行业模型定制场景，深度剖析高质量指令数据飞轮、LoRA/QLoRA 分布式微调、DPO 偏好对齐与 vLLM 量化加速推理部署。',
    targetAudience: '资深算法工程师 / AI技术架构师',
    coreCapabilities: [
      'LoRA高效微调',
      '数据治理清洗',
      'RLHF对齐训练',
      'vLLM推理加速',
      '私有化集群部署',
      '模型性能调优'
    ],
    priceDisplay: '¥1,399.00',
    feeDescription: '费用含 48 课时高阶工程课程、A100 实训算力体验券、完整微调脚本库与专家答疑。',
    examFormat: '分布式微调与压测实操',
    examDuration: '随学随练',
    passingScore: '完成模型微调部署',
    validityPeriod: '长期有效',
    courseHours: '48 课时',
    feeText: '¥1,399 / 门',
    enrolledCount: 910,
    syllabus: [
      {
        title: '模块一：高质量指令数据集构建与数据飞轮',
        duration: '12 课时',
        topics: [
          '垂直领域语料去重、清洗、合成与质量评分体系',
          'SFT 指令样本配比设计与灾难性遗忘规避',
          '偏好对（DPO / RLHF）数据标注与筛选规范'
        ]
      },
      {
        title: '模块二：分布式高效微调与偏好对齐实战',
        duration: '18 课时',
        topics: [
          'LoRA / QLoRA / DeepSpeed ZeRO 显存优化实战',
          '多机多卡并行训练监控、Loss 诊断与超参调优',
          '领域自动化评测基准搭建与横向效果对比'
        ]
      },
      {
        title: '模块三：高性能推理加速与私有化集群部署',
        duration: '18 课时',
        topics: [
          'INT4 / FP8 量化压缩与 vLLM / TensorRT-LLM 吞吐优化',
          'KV Cache 调度、Continuous Batching 与长文本推理加速',
          '多租户 GPU 集群隔离、弹性扩缩容与容灾设计'
        ]
      }
    ],
    recognitionPoints: [
      '赠送平台 A100 / H800 算力工坊专项微调实训体验额度',
      '完整复现垂直行业大模型从数据清洗到 vLLM 压测上线的全流程',
      '直击大模型定制化训练与私有化推理成本优化的核心技术难点'
    ],
    introMarkdown: `**大模型架构设计与分布式微调（高级）实战课**是 ADE 体系最高阶模型工程课程，面向负责行业大模型定制训练、高性能推理优化及私有化算力基础设施建设的资深算法工程师与 AI 技术架构师。

### 课程深度覆盖
- **数据飞轮与样本工程**：系统掌握行业语料清洗、合成数据增强、SFT 样本配比及避免灾难性遗忘的实战策略。
- **高效微调与对齐训练**：在真实 GPU 集群上实战 LoRA / QLoRA、DeepSpeed ZeRO 分布式训练及 DPO 人类偏好对齐。
- **极致推理性能优化**：深入 KV Cache 管理、FP8 / INT4 量化与 vLLM 高吞吐部署，大幅压降企业私有化算力成本。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：指令数据工程与数据飞轮构建',
        hint: '12 课时',
        contentMarkdown: `高质量数据决定行业微调上限，全面掌握工业级数据治理流水线：

- **语料清洗与去重**：MinHash 语义去重、脏数据过滤与垂直领域指令合成策略。
- **样本配比与偏好数据**：通用能力保持配比实验，以及高质量 DPO Chosen/Rejected 样本构建。`
      },
      {
        id: 'mod-2',
        title: '模块二：LoRA / QLoRA 分布式微调实战',
        hint: '14 课时',
        contentMarkdown: `基于真实多卡 GPU 环境，完成从显存估算到分布式训练收敛的全链路实操：

- **显存与并行优化**：FlashAttention、Gradient Checkpointing 与 DeepSpeed ZeRO-2/3 实战配置。
- **训练监控与调优**：学习率调度、过拟合诊断及领域垂直评测集自动化对比分析。`
      },
      {
        id: 'mod-3',
        title: '模块三：DPO 偏好对齐与多任务强化',
        hint: '10 课时',
        contentMarkdown: `让微调模型不仅“懂知识”，更能稳定遵循复杂业务风格与输出规范：

- **DPO / ORPO 对齐实战**：偏好对齐损失函数解析、超参调节与对齐税权衡实验。
- **拒绝采样与迭代飞轮**：基于线上真实 Bad Case 构建自动化数据回流迭代闭环。`
      },
      {
        id: 'mod-4',
        title: '模块四：模型量化加速与私有化高吞吐部署',
        hint: '12 课时',
        contentMarkdown: `将微调后的行业模型以最优性价比推向高并发生产环境：

- **量化压缩与精度检验**：AWQ / GPTQ / FP8 量化实操与量化后领域基准精度回归评估。
- **vLLM 生产集群部署**：Continuous Batching、多卡张量并行（TP）压测与多租户算力隔离治理。`
      }
    ],
    advisorContacts: DEFAULT_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加专属课程顾问获取试听与算力实训名额'
  },

  // =========================================================================
  // 3. AIGC 体系（初级 / 中级）
  // =========================================================================
  {
    id: 'course-aigc-l1',
    systemId: 'aigc',
    systemName: 'AIGC 体系',
    name: 'AIGC 体系（初级）：生成式人工智能办公与创作实战',
    detailTitle: '生成式人工智能办公与创作（初级）实战课',
    shortLevelName: 'AIGC 初级',
    issuingBodies: ['AIGC 教研中心'],
    level: '初级',
    customTags: ['实战', '推荐零基础', '含项目实操'],
    briefIntro:
      '本课程面向职场人与非技术背景学习者，零代码门槛系统教学结构化提示词写作、文档表格自动化、多模态图文视频创作及 AI 合规使用规范。',
    targetAudience: '职场办公人员 / 高校在校生 / 零基础学员',
    coreCapabilities: [
      '提示词写作',
      'AI办公提效',
      '多模态内容生成',
      '数据分析辅助',
      '版权与伦理合规',
      '场景化工作流'
    ],
    priceDisplay: '¥360.00',
    feeDescription: '费用含 20 课时零基础实操课程、20+ 职场高频提示词模板包与案例素材库。',
    examFormat: '场景化作品实操',
    examDuration: '随学随练',
    passingScore: '完成作品提交',
    validityPeriod: '长期有效',
    courseHours: '20 课时',
    feeText: '¥360 / 门',
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
      '零编程基础友好，即学即用，显著提升日常办公与内容创作效率',
      '附赠 20+ 可直接复制使用的职场 Prompt 与零代码工作流模板',
      '兼顾提效实战与企业数据脱敏、版权合规安全红线'
    ],
    introMarkdown: `**生成式人工智能办公与创作（初级）实战课**专为非技术背景职场人士、内容创作者及高校在校生量身打造，全程零编程门槛，通过高频办公与创作真实案例，带你系统建立高效人机协同工作方式。

### 核心学习收获
- **结构化提示词方法论**：告别零散盲目提问，掌握可复用的角色设定、上下文约束与事实交叉核验框架。
- **全场景办公提效**：覆盖公文报告撰写、表格公式与数据可视化、PPT 结构生成及多模态图文短视频创作。
- **零代码个人助手搭建**：亲手搭建专属周报助手、行业资讯汇总助手，并掌握企业数据脱敏与版权合规红线。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：生成式 AI 认知与结构化提示词框架',
        hint: '6 课时',
        contentMarkdown: `建立对主流 AIGC 工具的清晰认知，掌握写出高质量提示词的底层心法：

- **工具选型地图**：文本、长文档、图像与音视频主流工具的优势边界与组合策略。
- **四步提示词框架**：角色 + 背景 + 约束 + 示例，结合链式追问快速打磨专业产出。`
      },
      {
        id: 'mod-2',
        title: '模块二：文档、表格与 PPT 智能办公实战',
        hint: '6 课时',
        contentMarkdown: `针对职场每日高频耗时任务，建立自动化办公提效流水线：

- **长文档与会议处理**：一键提炼万字材料核心结论、行动项拆解与规范公文润色。
- **表格数据与演示文稿**：自然语言生成复杂表格公式、图表解读及高质量 PPT 大纲与排版。`
      },
      {
        id: 'mod-3',
        title: '模块三：多模态视觉与短视频辅助创作',
        hint: '4 课时',
        contentMarkdown: `快速产出具有专业质感的营销配图、活动海报与短视频脚本：

- **AI 视觉出图控制**：构图风格词、主体一致性控制与商用配图二次精修技巧。
- **短视频与播客脚本**：从热点选题、分镜脚本到配音字幕的一站式协同制作。`
      },
      {
        id: 'mod-4',
        title: '模块四：零代码效率智能体与合规安全',
        hint: '4 课时',
        contentMarkdown: `将个人工作经验沉淀为可复用的零代码智能体，同时守好安全边界：

- **个人智能体搭建**：零代码配置知识库与工作流，实现日常重复任务的自动化批处理。
- **安全与版权合规**：企业敏感数据脱敏规范、AIGC 版权风险识别与合规标识要点。`
      }
    ],
    advisorContacts: AIGC_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加 AIGC 课程顾问获取试听与模板包'
  },
  {
    id: 'course-aigc-l2',
    systemId: 'aigc',
    systemName: 'AIGC 体系',
    name: 'AIGC 体系（中级）：商业级视觉工作流与智能体搭建',
    detailTitle: '商业级视觉工作流与智能体搭建（中级）实战课',
    shortLevelName: 'AIGC 中级',
    issuingBodies: ['AIGC 教研中心'],
    level: '中级',
    customTags: ['实战', '含项目实操', '商业案例'],
    briefIntro:
      '本课程深入商业内容生产与产业数字化一线，结合 ComfyUI 节点式视觉流与低代码智能体平台，打造可复用的品牌视觉、营销素材与行业提效管线。',
    targetAudience: '行业数字化骨干 / AI产品经理 / 设计师',
    coreCapabilities: [
      '行业需求建模',
      '多模态管线构建',
      '模型效果评测',
      '智能体方案设计',
      '业务ROI核算',
      '跨部门协作交付'
    ],
    priceDisplay: '¥780.00',
    feeDescription: '费用含 34 课时商业实战课程、ComfyUI 工作流 JSON 模板库与行业项目案例指导。',
    examFormat: '商业工作流项目实战',
    examDuration: '随学随练',
    passingScore: '完成工作流交付',
    validityPeriod: '长期有效',
    courseHours: '34 课时',
    feeText: '¥780 / 门',
    enrolledCount: 2180,
    syllabus: [
      {
        title: '模块一：商业需求建模与 AIGC 管线架构设计',
        duration: '8 课时',
        topics: [
          '电商、品牌营销与内容团队的 AIGC 降本增效路径拆解',
          '可控性、一致性与产出质量评测标准制定',
          '业务 ROI 核算模型与跨部门协作流程设计'
        ]
      },
      {
        title: '模块二：ComfyUI 商业级可控视觉工作流实战',
        duration: '14 课时',
        topics: [
          'ControlNet、IP-Adapter 与 LoRA 风格锁定的节点组合',
          '电商商品换背景、模特换装与高清重绘自动化流水线',
          '批量出图 API 封装与团队共享工作台搭建'
        ]
      },
      {
        title: '模块三：低代码行业智能体与跨平台自动化交付',
        duration: '12 课时',
        topics: [
          '低代码工作流编排（知识库 + 插件 + 条件分支）实战',
          '多渠道内容矩阵自动生成、审核与排期发布闭环',
          '真实商业项目复盘与团队推广落地方法'
        ]
      }
    ],
    recognitionPoints: [
      '附赠 15+ 开箱即用的 ComfyUI 商业级节点工作流与 LoRA 调参手册',
      '完整覆盖电商视觉、品牌创意与营销自动化三大高回报商业场景',
      '帮助 AI 产品经理、设计师与业务骨干掌握团队级 AIGC 落地能力'
    ],
    introMarkdown: `**商业级视觉工作流与智能体搭建（中级）实战课**聚焦从“个人玩转工具”到“团队级商业生产流水线”的跃迁，结合节点式可控视觉生成与低代码智能体平台，带你打造高一致性、可批量复用的商业内容与业务提效方案。

### 课程核心收获
- **商业级可控视觉管线**：精通 ComfyUI 节点编排、ControlNet 结构控制与品牌风格一致性锁定，解决商业出图“抽卡不可控”痛点。
- **低代码智能体系统设计**：串联私有知识库、外部 API 插件与多步工作流，搭建营销文案、竞品监测与客户洞察智能体。
- **业务 ROI 评估与落地推进**：具备从需求建模、效果验收标准制定到跨部门推广复盘的完整项目落地能力。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：商业需求建模与 ROI 评估方法',
        hint: '8 课时',
        contentMarkdown: `站在业务与产品视角规划高回报 AIGC 落地项目：

- **业务瓶颈拆解**：识别内容生产、设计排期与客服运营中的可自动化关键环节。
- **验收标准与 ROI 核算**：建立商业交付质量基准与人力/成本节约测算模型。`
      },
      {
        id: 'mod-2',
        title: '模块二：ComfyUI 商业可控视觉工作流',
        hint: '12 课时',
        contentMarkdown: `深入节点式图像与视频工作流，实现精准可控的批量商业出图：

- **精准控制组合**：ControlNet 构图锁定、IP-Adapter 风格迁移与局部重绘（Inpainting）精修。
- **电商与品牌实战**：搭建商品一键换场景、模特穿戴展示与海报排版自动化工作流。`
      },
      {
        id: 'mod-3',
        title: '模块三：低代码行业智能体编排实战',
        hint: '8 课时',
        contentMarkdown: `使用主流低代码编排平台，将业务 SOP 固化为可执行的智能体服务：

- **多步工作流编排**：结合知识库检索、网页抓取、变量路由与结构化表格回写。
- **自动化内容矩阵**：打造“热点追踪 → 选题策划 → 多平台图文生成”端到端闭环。`
      },
      {
        id: 'mod-4',
        title: '模块四：批量 API 化交付与团队协同运营',
        hint: '6 课时',
        contentMarkdown: `将个人工作流封装为全团队可用的稳定服务：

- **工作流服务封装**：ComfyUI Headless API 集成与飞书/企微群机器人触发实践。
- **标杆商业复盘**：复盘真实消费品牌 AIGC 内容中台搭建路径与常见避坑指南。`
      }
    ],
    advisorContacts: AIGC_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加 AIGC 课程顾问获取试听与工作流资料'
  },

  // =========================================================================
  // 4. 人工智能安全体系（中级 / 高级）
  // =========================================================================
  {
    id: 'course-sec-l2',
    systemId: 'ai-security',
    systemName: '人工智能安全体系',
    name: '人工智能安全体系（中级）：大模型安全护栏与攻防实战',
    detailTitle: '大模型安全护栏与攻防实战（中级）实战课',
    shortLevelName: 'AI安全 中级',
    issuingBodies: ['AI 安全教研中心'],
    level: '中级',
    customTags: ['实战', '含靶场实操', '含项目实操'],
    briefIntro:
      '本课程聚焦 AI 原生安全与大模型攻防一线，系统讲授提示词注入防御、内容安全护栏构建、敏感数据动态脱敏及安全运营智能体联动开发。',
    targetAudience: '安全开发工程师 / AI应用工程师',
    coreCapabilities: [
      '大模型安全护栏',
      '提示词注入防御',
      '威胁情报研判',
      'SOAR联动编排',
      '数据脱敏治理',
      '安全评估报告'
    ],
    priceDisplay: '¥799.00',
    feeDescription: '费用含 32 课时安全攻防实战课程、在线攻防靶场实训权限与安全护栏源码模板。',
    examFormat: '安全靶场攻防演练',
    examDuration: '随学随练',
    passingScore: '完成靶场任务',
    validityPeriod: '长期有效',
    courseHours: '32 课时',
    feeText: '¥799 / 门',
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
        title: '模块二：安全运营智能体（SecOps Agent）开发实战',
        duration: '12 课时',
        topics: [
          '告警日志降噪与自动化威胁研判智能体构建',
          '安全知识图谱与私有漏洞库 RAG 增强检索',
          '与 SIEM / SOAR 平台联动实现分钟级应急响应'
        ]
      },
      {
        title: '模块三：AI 应用合规评测与红队基础演练',
        duration: '10 课时',
        topics: [
          '生成式人工智能服务安全基本要求落地自查',
          '自动化红队对抗测试集构建与风险量化评分',
          '企业级 AI 安全评估报告输出与整改闭环'
        ]
      }
    ],
    recognitionPoints: [
      '配套在线大模型安全攻防靶场，包含 12 个真实提示词攻防演练场景',
      '同时覆盖“保护 AI 应用本身”与“用 AI 赋能安全运营”两大紧缺方向',
      '直接提供可部署的大模型输入输出安全护栏网关参考代码'
    ],
    introMarkdown: `**大模型安全护栏与攻防实战（中级）实战课**深度结合“大模型内生安全防护”与“AI 赋能安全运营（SecOps）”两大核心实战方向，依托真实在线攻防靶场，带你系统掌握大模型应用上线前必须具备的安全工程能力。

### 核心实战能力
- **大模型安全护栏工程**：针对提示词注入、间接注入、越狱诱导与敏感数据泄漏，构建低延迟输入输出安全防护网关。
- **AI 安全运营智能体开发**：实战搭建告警降噪、威胁情报研判智能体，并与 SIEM / SOAR 联动实现自动化应急响应。
- **合规自查与风险评测**：熟练对照生成式 AI 安全合规要求开展自动化红队测试，输出规范的安全评估与整改报告。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：OWASP LLM 风险全景与提示词攻防',
        hint: '8 课时',
        contentMarkdown: `在靶场中亲手复现并防御主流大模型安全漏洞，知攻更懂防：

- **常见攻击面剖析**：直接/间接提示词注入、系统提示词窃取、工具越权调用与模型投毒风险。
- **靶场攻防实操**：完成 6 个典型越狱与注入绕过演练，深入理解攻防对抗机理。`
      },
      {
        id: 'mod-2',
        title: '模块二：输入输出安全护栏与动态脱敏网关',
        hint: '8 课时',
        contentMarkdown: `从零开发一套可插拔的企业级大模型安全代理网关：

- **多层内容护栏**：规则引擎 + 轻量安全分类模型协同实现毫秒级违规拦截。
- **敏感数据防泄漏（DLP）**：身份证/银行卡/源码密钥自动识别、动态脱敏占位与回填还原。`
      },
      {
        id: 'mod-3',
        title: '模块三：AI 安全运营智能体（SecOps）实战',
        hint: '10 课时',
        contentMarkdown: `利用大模型大幅提升安全运营团队的研判与处置效率：

- **威胁研判 RAG**：接入私有漏洞库与攻击情报知识，自动生成告警溯源与处置建议。
- **SOAR 联动闭环**：通过受控工具调用自动执行封禁 IP、隔离终端与工单流转演练。`
      },
      {
        id: 'mod-4',
        title: '模块四：AI 应用安全评测与合规自查报告',
        hint: '6 课时',
        contentMarkdown: `建立系统化的 AI 安全上线前验收流程：

- **自动化红队扫描**：构建多维度安全对抗测试集，输出风险量化评分矩阵。
- **安全评估与整改闭环**：完整编写一份符合政企验收标准的 AI 安全评估报告。`
      }
    ],
    advisorContacts: SECURITY_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加 AI 安全课程顾问获取靶场试听通道'
  },
  {
    id: 'course-sec-l3',
    systemId: 'ai-security',
    systemName: '人工智能安全体系',
    name: '人工智能安全体系（高级）：企业级 AI 红队对抗与合规治理',
    detailTitle: '企业级 AI 红队对抗与合规治理（高级）实战课',
    shortLevelName: 'AI安全 高级',
    issuingBodies: ['AI 安全教研中心'],
    level: '高级',
    customTags: ['实战', '含靶场实操', '政企安全'],
    briefIntro:
      '本课程面向高安全等级政企与金融 AI 落地场景，深度演练自动化红队越狱攻防、多智能体分级分权治理、安全水印溯源与全链路合规审计建设。',
    targetAudience: '安全架构师 / 政企合规与交付负责人',
    coreCapabilities: [
      '自动化红队评测',
      '分级分权治理',
      '数据防泄漏DLP',
      '安全水印溯源',
      '合规审计落地',
      '应急响应闭环'
    ],
    priceDisplay: '¥1,280.00',
    feeDescription: '费用含 40 课时高阶安全架构课程、高级攻防靶场演练时长与政企合规治理文档库。',
    examFormat: '高级红队演练与方案评审',
    examDuration: '随学随练',
    passingScore: '完成合规治理方案',
    validityPeriod: '长期有效',
    courseHours: '40 课时',
    feeText: '¥1,280 / 门',
    enrolledCount: 840,
    syllabus: [
      {
        title: '模块一：自动化红队对抗框架与深度渗透演练',
        duration: '12 课时',
        topics: [
          '多轮诱导越狱、多模态对抗样本与 RAG 知识库投毒深度演练',
          '基于攻击者模型的自动化红队 Fuzzing 测试平台搭建',
          '智能体工具链权限逃逸与代码沙盒隔离加固'
        ]
      },
      {
        title: '模块二：多智能体分级分权与零信任安全架构',
        duration: '14 课时',
        topics: [
          '企业级 AI 零信任网关与跨智能体最小权限访问控制',
          '训练/微调语料合规清洗与数据血缘可追溯治理',
          '隐式文本/图像安全水印嵌入与生成内容溯源体系'
        ]
      },
      {
        title: '模块三：政企与金融 AI 全生命周期合规审计体系',
        duration: '14 课时',
        topics: [
          '大模型备案与安全评估核心指标逐项拆解落地',
          '全链路不可篡改审计日志与异常行为实时告警',
          'AI 安全事件应急响应预案与高安全行业标杆案例复盘'
        ]
      }
    ],
    recognitionPoints: [
      '紧贴金融、能源、政务等高安全等级行业的真实合规与攻防要求',
      '涵盖 RAG 投毒、Agent 沙盒逃逸、隐式水印等前沿深度攻防议题',
      '提供全套政企 AI 安全架构基线清单与合规审计模板'
    ],
    introMarkdown: `**企业级 AI 红队对抗与合规治理（高级）实战课**面向主导高安全等级行业 AI 系统建设的安全架构师、红队专家与政企合规负责人，深入剖析复杂多智能体与私有化大模型环境下的深层安全威胁，系统构建“可测、可控、可审计、可溯源”的企业级 AI 安全治理体系。

### 核心高阶专题
- **自动化红队深度攻防**：掌握多轮越狱对抗、RAG 语料投毒、多模态绕过及 Agent 代码执行沙盒隔离等前沿攻防技术。
- **AI 零信任与安全水印溯源**：设计跨智能体最小权限控制、数据血缘管理及生成内容隐式水印防伪溯源方案。
- **全生命周期合规审计**：系统打通模型备案要求、安全基线落地、不可篡改审计日志与安全事件应急处置闭环。`,
    learningPath: [
      {
        id: 'mod-1',
        title: '模块一：深度红队对抗与自动化 Fuzzing 平台',
        hint: '12 课时',
        contentMarkdown: `超越人工手工测试，构建可持续运行的自动化 AI 红队对抗能力：

- **复杂攻击场景演练**：多轮渐进式越狱、RAG 知识库投毒与多模态图文隐写绕过实战。
- **自动化红队引擎**：利用攻击者模型自动变异攻击载荷，持续发现系统薄弱环节。`
      },
      {
        id: 'mod-2',
        title: '模块二：智能体沙盒隔离与零信任权限治理',
        hint: '10 课时',
        contentMarkdown: `解决智能体具备工具调用与代码执行能力后带来的高危越权风险：

- **最小权限控制**：面向 MCP 与外部 API 的细粒度鉴权、二次确认与策略拦截网关。
- **安全沙盒隔离**：基于微虚拟机/容器构建受限代码执行环境，阻断横向渗透路径。`
      },
      {
        id: 'mod-3',
        title: '模块三：数据血缘治理与隐式安全水印溯源',
        hint: '8 课时',
        contentMarkdown: `覆盖从训练数据到模型输出的全链路知识产权与防泄漏治理：

- **语料合规与血缘**：微调语料版权/隐私自动化审查及数据血缘追踪机制。
- **安全水印体系**：文本与图像隐式数字水印嵌入、鲁棒性验证与泄密内容快速溯源。`
      },
      {
        id: 'mod-4',
        title: '模块四：政企合规审计与应急响应实战',
        hint: '10 课时',
        contentMarkdown: `面向金融、能源与政务核心业务场景，完成企业级安全合规闭环建设：

- **全链路审计与监控**：不可篡改调用审计日志、异常行为基线告警与合规报表自动生成。
- **标杆案例与预案**：复盘大型金融机构 AI 安全治理架构落地全过程与应急演练手册。`
      }
    ],
    advisorContacts: SECURITY_ADVISOR_CONTACTS,
    advisorQrHint: '扫码添加 AI 安全课程顾问获取高阶方案资料'
  }
];
