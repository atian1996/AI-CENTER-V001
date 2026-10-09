import { TaskItem } from '../types';

export const mockRichTasks: TaskItem[] = [
  // =========================================================================
  // 1. 我接单的任务 (My Undertaken Tasks) - 各种状态 & 每项 3~5 个接单人
  // =========================================================================

  // [我接单 - 进行中 - 已提交待验收]
  {
    id: 'tsk_101',
    title: '定制基于 Qwen2.5 的法律合同智能审查 Agent',
    taskType: '接单任务',
    brief: '自动识别劳动合同与采购协议隐藏风险，输出格式化审查报告',
    domain: '技术开发',
    difficulty: '困难',
    recommendedResources: {
      agents: ['ag_law_eval_01', 'ag_procurement_guard_02'],
      models: ['mod_qwen_25_coder', 'mod_deepseek_v4_pro'],
      datasets: ['ds_legal_contracts_2026', 'ds_law_knowledge_base'],
      skills: ['sk_pdf_ocr_extractor', 'sk_milvus_vector_retriever'],
      environment: {
        spec: 'NVIDIA A100 / 80GB (双卡)',
        image: 'PyTorch 2.3.1 + CUDA 12.1 + vLLM Sandbox'
      }
    },
    description: `<h3>【项目背景与业务痛点】</h3><p>在大型企业及律所日常商务签署中，海量采购协议、劳动合同与外包服务框架协议存在防范疏漏。现需基于 <b>Qwen2.5-72B-Instruct</b> 与领域向量知识库，构建一套企业级法律合同智能审查 Agent，自动识别法律隐患并输出带高亮锚点的专业修改建议。</p><h3>【核心功能与系统架构要求】</h3><ul><li><b>多格式文档解析：</b>支持精准解析 PDF (含扫描件 OCR)、Docx、TXT 格式合同；</li><li><b>风险条款分类挖掘：</b>覆盖违约金比例偏高、免责条款不对等、不可抗力范围模糊、知识产权归属陷阱等 25+ 类场景；</li><li><b>法条溯源与对比：</b>基于最新《民法典》及司法解释，自动附带法律依据原句及合规修改建议；</li><li><b>标准 API 封装：</b>基于 LangGraph 封装 Agent，暴露 RESTful API 与 SSE 流式响应。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收与量化考核标准】</h3><ol><li>在 200 份盲测合同上，核心风险条款召回率（Recall）≥ 92.5%，准确率 ≥ 90.0%；</li><li>单篇 50 页复杂合同全量分析响应时间 ≤ 15 秒，首 Token 延迟 ≤ 800ms；</li><li>10 个并发审查无显存溢出或服务崩溃，代码通过 PEP8 检测。</li></ol>`,
    cashReward: 8000,
    pointsReward: 500,
    totalCashReward: 8000,
    totalPointsReward: 500,
    startTime: '2026-08-01 00:00:00',
    endTime: '2026-09-25 23:59:59',
    remainingDays: 7,
    publisher: '天元律师事务所',
    publisherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-01 10:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_101_1',
        taskId: 'tsk_101',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-05 14:20:00',
        status: '已提交',
        submissionId: 'sub_101_1'
      },
      {
        id: 'tk_101_2',
        taskId: 'tsk_101',
        username: '清华AI工程队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-06 09:10:00',
        status: '已提交',
        submissionId: 'sub_101_2'
      },
      {
        id: 'tk_101_3',
        taskId: 'tsk_101',
        username: '法务智囊工作室',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-07 16:40:00',
        status: '已接单'
      },
      {
        id: 'tk_101_4',
        taskId: 'tsk_101',
        username: '北大网律前沿组',
        userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-08 11:15:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_101_1',
        taskId: 'tsk_101',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-14 18:30:00',
        notes: '已完成 Qwen2.5-72B 微调与 Milvus 知识库搭建，包含完整前后端 API 与 Dockerfile，经 200 份样本实测召回率 93.8%。',
        files: [
          { id: 'f101_1', name: 'Legal_Agent_Source_v1.0.zip', size: '42.5 MB' },
          { id: 'f101_2', name: '测试报告与性能压测记录.pdf', size: '3.8 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_101_2',
        taskId: 'tsk_101',
        username: '清华AI工程队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-15 11:20:00',
        notes: '基于 LangChain + Qwen2.5 构建了合同风险概率标注引擎，支持高亮 PDF 导出。',
        files: [
          { id: 'f101_3', name: 'Tsinghua_Legal_Agent_Bundle.zip', size: '38.2 MB' }
        ],
        status: '待验收'
      }
    ],
    bounty: 8000,
    bountyUnit: '¥'
  },

  // [我接单 - 进行中 - 已提交待验收]
  {
    id: 'tsk_my_und_bigao_ing2',
    title: 'AI Agent 插件市场 CLI 命令行工具 (Python/Go) 开发',
    taskType: '接单任务',
    brief: '支持命令 plugin install/publish/search 的轻量级终端包管理器',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【需求说明与架构设计】</h3><p>为了让极客开发者可以在终端（Terminal）快速管理 Agent 插件，需编写一款支持 Linux / macOS / Windows 跨平台的开源 CLI 工具。</p><h3>【命令行指令要求】</h3><ul><li><code>qianji login</code>：交互式引导输入平台 API Key，加密存储于本地 Keychain / SecretService；</li><li><code>qianji plugin search &lt;keyword&gt;</code>：搜索平台公共 Agent 插件并展现星级评级；</li><li><code>qianji plugin install &lt;repo-path&gt;</code>：下载解压依赖并校验安全 Hash 签名；</li><li><code>qianji plugin publish</code>：校验 manifest.json 格式、打包上传并触发平台静态审计。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收标准】</h3><ol><li>提供 Python (Click/Rich) 或 Go (Cobra) 实现源码；</li><li>具备终端彩色渲染与进度条显示；</li><li>提供自动化单元测试并输出跨平台编译单二进制包。</li></ol>`,
    cashReward: 5500,
    pointsReward: 500,
    totalCashReward: 5500,
    totalPointsReward: 500,
    startTime: '2026-08-12 00:00:00',
    endTime: '2026-09-30 23:59:59',
    remainingDays: 12,
    publisher: '平台开发者社区',
    publisherAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-12 14:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_und_b2_1',
        taskId: 'tsk_my_und_bigao_ing2',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-14 09:00:00',
        status: '已提交',
        submissionId: 'sub_und_b2_mine'
      },
      {
        id: 'tk_und_b2_2',
        taskId: 'tsk_my_und_bigao_ing2',
        username: 'Go语言开发者联盟',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-13 16:00:00',
        status: '已提交',
        submissionId: 'sub_und_b2_other'
      },
      {
        id: 'tk_und_b2_3',
        taskId: 'tsk_my_und_bigao_ing2',
        username: '终端极客社',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-15 10:20:00',
        status: '已接单'
      },
      {
        id: 'tk_und_b2_4',
        taskId: 'tsk_my_und_bigao_ing2',
        username: '全栈攻城狮小明',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 11:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_und_b2_mine',
        taskId: 'tsk_my_und_bigao_ing2',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-17 14:20:00',
        notes: '使用 Python + Click + Rich 构建跨平台命令行工具，已封装支持 API Key 密钥链安全存储与一键 publish 插件打包校验。',
        files: [
          { id: 'fg_mine_1', name: 'qianji_cli_python_v1.0.tar.gz', size: '12.4 MB' },
          { id: 'fg_mine_2', name: 'CLI工具指令使用与自动化测试说明.pdf', size: '2.1 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_und_b2_other',
        taskId: 'tsk_my_und_bigao_ing2',
        username: 'Go语言开发者联盟',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-16 11:00:00',
        notes: '使用 Go + Cobra 框架编写完成，二进制可执行文件小于 8MB。',
        files: [{ id: 'fg_other', name: 'qianji-cli-go.zip', size: '7.8 MB' }],
        status: '待验收'
      }
    ],
    bounty: 5500,
    bountyUnit: '¥'
  },

  // [我接单 - 进行中 - 已提交待验收]
  {
    id: 'tsk_und_sub_sse',
    title: '企业级大模型流式输出 (SSE) 敏感词合规实时过滤与重组中间件',
    taskType: '接单任务',
    brief: '毫秒级流式文本敏感词树匹配与安全替换，支持 Markdown 语法完备性保护',
    domain: '技术开发',
    difficulty: '困难',
    recommendedResources: {
      models: ['mod_qwen_25_coder'],
      skills: ['sk_ac_automaton_filter', 'sk_sse_stream_rewriter'],
      environment: {
        spec: '4核CPU / 16GB内存',
        image: 'Node.js 20 + Rust N-API Runtime'
      }
    },
    description: `<h3>【业务背景】</h3><p>在企业金融与政务大模型场景中，LLM 流式输出（Server-Sent Events）时若直接进行后置审查容易导致违规内容已推送到前端。需设计一套基于 Aho-Corasick 多模式匹配与状态机的流式合规中间件，在流传输过程中无感切分、过滤并优雅替换敏感违规词汇，同时确保 Markdown 代码块与表格标签不发生语法撕裂破损。</p>`,
    acceptanceCriteria: `<h3>【验收考核】</h3><ol><li>在 10 万级敏感词库下，单 Token 流式追加的过滤额外延迟 ≤ 1.5ms；</li><li>支持跨 Token 拆分拼词检测（如跨越两个 chunk 拼接而成的敏感词）；</li><li>交付 Rust/C++ 核心与 Node.js / Python 绑定库。</li></ol>`,
    cashReward: 7200,
    pointsReward: 600,
    totalCashReward: 7200,
    totalPointsReward: 600,
    startTime: '2026-08-15 00:00:00',
    endTime: '2026-09-28 23:59:59',
    remainingDays: 10,
    publisher: '国家金融科技研究院',
    publisherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-15 10:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_sse_1',
        taskId: 'tsk_und_sub_sse',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 11:30:00',
        status: '已提交',
        submissionId: 'sub_sse_mine'
      },
      {
        id: 'tk_sse_2',
        taskId: 'tsk_und_sub_sse',
        username: '智网信安组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 15:00:00',
        status: '已提交',
        submissionId: 'sub_sse_other'
      },
      {
        id: 'tk_sse_3',
        taskId: 'tsk_und_sub_sse',
        username: '算法工程师阿飞',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 09:10:00',
        status: '已接单'
      },
      {
        id: 'tk_sse_4',
        taskId: 'tsk_und_sub_sse',
        username: '阿里大模型应用队',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-18 14:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_sse_mine',
        taskId: 'tsk_und_sub_sse',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-20 16:30:00',
        notes: '使用 Rust 编写的双数组 AC 自动机流式状态机，支持跨 chunk 拼词识别，平均附加延迟仅 0.8ms。',
        files: [
          { id: 'f_sse1', name: 'stream_safety_guard_rust_v1.tar.gz', size: '15.6 MB' },
          { id: 'f_sse2', name: 'benchmark_100k_test.pdf', size: '1.9 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_sse_other',
        taskId: 'tsk_und_sub_sse',
        username: '智网信安组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-19 18:00:00',
        notes: '基于 C++ 封装的敏感词过滤库与 Python 接口。',
        files: [{ id: 'f_sse3', name: 'safety_sse_cpp.zip', size: '11.2 MB' }],
        status: '待验收'
      }
    ],
    bounty: 7200,
    bountyUnit: '¥'
  },

  // [我接单 - 进行中 - 已接单未提交/开发中]
  {
    id: 'tsk_my_und_fcfs_ing',
    title: '基于 Qwen2-VL 的医疗电子病历多模态 OCR 结构化提取插件',
    taskType: '接单任务',
    brief: '识别手写病历与检验单 PDF，结构化提取患者主诉、诊断及用药明细',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【项目需求与背景】</h3><p>面向医院信息化系统，开发一套采用 <b>Qwen2-VL-7B / 72B</b> 驱动的智能电子病历（EMR）解析插件，精准提取医生模糊手写体与各种规格的化验报告单数据。</p><h3>【核心处理能力】</h3><ul><li>支持扫描图像自动倾斜校正、降噪与对比度增强；</li><li>精准解析包含“主诉、现病史、既往史、初步诊断、医嘱用药”的嵌套 JSON 数据；</li><li>符合国际 HL7 FHIR 医疗数据互操作标准。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收标准】</h3><ol><li>手写体病历识别字符准确率 ≥ 93.5%，化验单数字表格精确率 ≥ 99.0%；</li><li>提供包含 Python SDK 和 FastAPI 封装接口源码；</li><li>提供包含 Docker 环境一键运行脚本及 50 份解密测试样本。</li></ol>`,
    cashReward: 4800,
    pointsReward: 400,
    totalCashReward: 4800,
    totalPointsReward: 400,
    startTime: '2026-08-16 00:00:00',
    endTime: '2026-09-30 23:59:59',
    remainingDays: 12,
    publisher: '华西数字医疗实验室',
    publisherAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-16 10:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_und_fcfs_ing_1',
        taskId: 'tsk_my_und_fcfs_ing',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 10:30:00',
        status: '已接单'
      },
      {
        id: 'tk_und_fcfs_ing_2',
        taskId: 'tsk_my_und_fcfs_ing',
        username: '协和AI标研社',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 11:20:00',
        status: '已提交',
        submissionId: 'sub_emr_2'
      },
      {
        id: 'tk_und_fcfs_ing_3',
        taskId: 'tsk_my_und_fcfs_ing',
        username: '华西医学图像标注组',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 14:00:00',
        status: '已提交',
        submissionId: 'sub_emr_3'
      },
      {
        id: 'tk_und_fcfs_ing_4',
        taskId: 'tsk_my_und_fcfs_ing',
        username: '智医先锋团队',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 09:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_emr_2',
        taskId: 'tsk_my_und_fcfs_ing',
        username: '协和AI标研社',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-18 17:00:00',
        notes: '完成 50 份病历 OCR 测试与 FHIR 格式导出转换模块。',
        files: [{ id: 'f_emr2', name: 'EMR_OCR_Extract_v1.zip', size: '25.3 MB' }],
        status: '待验收'
      },
      {
        id: 'sub_emr_3',
        taskId: 'tsk_my_und_fcfs_ing',
        username: '华西医学图像标注组',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-19 14:30:00',
        notes: '支持多规格检验单倾斜校正与字段提取。',
        files: [{ id: 'f_emr3', name: 'lab_report_parser.py', size: '3.4 MB' }],
        status: '待验收'
      }
    ],
    bounty: 4800,
    bountyUnit: '¥'
  },

  // [我接单 - 进行中 - 已接单未提交/开发中]
  {
    id: 'tsk_hall_01',
    title: '基于 ComfyUI 的电商服装模特虚拟试衣 Agent 工作流',
    taskType: '接单任务',
    brief: '输入平铺服装图与模特写真，自动生成无痕换装的高清宣发图',
    domain: '工具与自动化',
    difficulty: '中等',
    description: `<h3>【需求描述与技术路线】</h3><p>搭建一套适用于快时尚电商的高逼真虚拟换装工作流。输入服装平铺图与模特姿态图，自动产出保留面料质感与剪裁特性的商业级宣传照。</p><h3>【核心工作流节点配置】</h3><ul><li>基于 Flux.1 Dev 或 SDXL 挂载 ControlNet (OpenPose / Openpose + Depth)；</li><li>结合 CatVTON 或 Inpainting 节点，精准替换衣物区域且防范边缘发虚；</li><li>高清修复与超分放大（Ultimate SD Upscale）导出 4K 高保真图像。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>试衣图像细节自然无失真，面料纹理及光影匹配度高；</li><li>提供完整的 ComfyUI API 工作流 JSON 模版，支持单卡批量并发导出；</li><li>提交 10 组不同材质（丝绸/牛仔/针织）换装效果对照图。</li></ol>`,
    cashReward: 3600,
    pointsReward: 250,
    totalCashReward: 3600,
    totalPointsReward: 250,
    startTime: '2026-08-11 00:00:00',
    endTime: '2026-09-28 23:59:59',
    remainingDays: 10,
    publisher: '时尚芭莎数字部',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-11 11:20:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_hall_1',
        taskId: 'tsk_hall_01',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-12 14:00:00',
        status: '已接单'
      },
      {
        id: 'tk_hall_2',
        taskId: 'tsk_hall_01',
        username: 'AIGC视觉魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-13 10:20:00',
        status: '已提交',
        submissionId: 'sub_hall_2'
      },
      {
        id: 'tk_hall_3',
        taskId: 'tsk_hall_01',
        username: '时尚科技工作室',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-14 16:00:00',
        status: '已接单'
      },
      {
        id: 'tk_hall_4',
        taskId: 'tsk_hall_01',
        username: '像素工坊AIGC',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-15 09:40:00',
        status: '已提交',
        submissionId: 'sub_hall_4'
      }
    ],
    submissions: [
      {
        id: 'sub_hall_2',
        taskId: 'tsk_hall_01',
        username: 'AIGC视觉魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-17 10:00:00',
        notes: '使用 SDXL Inpainting + CatVTON 节点实现服装替换，运行稳定。',
        files: [{ id: 'fh3', name: 'CatVTON_SDXL_Workflow.json', size: '2.3 MB' }],
        status: '待验收'
      },
      {
        id: 'sub_hall_4',
        taskId: 'tsk_hall_01',
        username: '像素工坊AIGC',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-18 15:20:00',
        notes: '采用 Flux.1 + Depth ControlNet 进行 4K 试衣放大渲染。',
        files: [{ id: 'fh4', name: 'Flux_Comfy_Fitting.json', size: '3.1 MB' }],
        status: '待验收'
      }
    ],
    bounty: 3600,
    bountyUnit: '¥'
  },

  // [我接单 - 进行中 - 已接单未提交/开发中]
  {
    id: 'tsk_und_git_review',
    title: '打造基于开源 LLM 的全自动 Git 提交代码评审与变更日志生成 Agent',
    taskType: '接单任务',
    brief: '深度理解 git diff 语法树，自动生成清晰 Conventional Commits 与变更日志',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【需求概述】</h3><p>为了让研发团队的代码提交日志标准化并提供自动化 Code Review，需开发一套结合 GitHub Actions / GitLab CI 的智能 Git 助手 Agent。</p><h3>【核心功能】</h3><ul><li>分析提交代码差异（AST 抽象语法树与 diff）；</li><li>自动识别潜在 Bug、死循环与未处理异常；</li><li>生成遵循 AngularJS / Conventional Commits 规范的语义化 commit message 与 CHANGELOG.md。</li></ul>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>提供 GitHub Action 插件与独立 CLI 脚本；</li><li>针对 50 个主流开源代码 PR 测试，Review 建议采纳率 ≥ 80%；</li><li>代码运行耗时 ≤ 5 秒。</li></ol>`,
    cashReward: 4200,
    pointsReward: 350,
    totalCashReward: 4200,
    totalPointsReward: 350,
    startTime: '2026-08-14 00:00:00',
    endTime: '2026-09-29 23:59:59',
    remainingDays: 11,
    publisher: '开源软件推进联盟',
    publisherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-14 11:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_git_1',
        taskId: 'tsk_und_git_review',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-15 14:00:00',
        status: '已接单'
      },
      {
        id: 'tk_git_2',
        taskId: 'tsk_und_git_review',
        username: 'Rust极客组',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-15 16:30:00',
        status: '已提交',
        submissionId: 'sub_git_2'
      },
      {
        id: 'tk_git_3',
        taskId: 'tsk_und_git_review',
        username: '架构喵实验室',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 10:15:00',
        status: '已接单'
      },
      {
        id: 'tk_git_4',
        taskId: 'tsk_und_git_review',
        username: 'DevSecOps工程师',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 11:20:00',
        status: '已提交',
        submissionId: 'sub_git_4'
      }
    ],
    submissions: [
      {
        id: 'sub_git_2',
        taskId: 'tsk_und_git_review',
        username: 'Rust极客组',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-18 19:00:00',
        notes: '提供 Rust 构建的高速 CLI 与 GitHub Action 工作流配置。',
        files: [{ id: 'f_git2', name: 'git-review-ai-action.tar.gz', size: '8.7 MB' }],
        status: '待验收'
      },
      {
        id: 'sub_git_4',
        taskId: 'tsk_und_git_review',
        username: 'DevSecOps工程师',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-19 10:30:00',
        notes: '包含 Git hook 本地拦截与 GitLab CI 自动化流水线模版。',
        files: [{ id: 'f_git4', name: 'gitlab_ci_hook.zip', size: '5.2 MB' }],
        status: '待验收'
      }
    ],
    bounty: 4200,
    bountyUnit: '¥'
  },

  // =========================================================================
  // 我接单的任务 - 进行中 - 成果被驳回 (支持修改后重新提交)
  // =========================================================================
  {
    id: 'tsk_und_rej_asr_quant',
    title: '工业端侧语音识别模型 INT8 动态量化与推理加速',
    taskType: '接单任务',
    brief: '针对 Whisper-Small 模型进行 ONNX/NCNN 算子融合与量化，端侧解码延迟控制在 60ms 内',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【任务目标】</h3><p>将中文工业语音识别模型（基于 Whisper-Small 架构）转换为 INT8 量化格式，针对嵌入式边缘计算板卡（RK3588）完成推理优化与精度校验。</p><h3>【交付范围】</h3><ul><li>导出 ONNX 模型与 INT8 动态量化权重；</li><li>提供 C++/Python 运行时推理 Benchmark 测试套件；</li><li>在开源工业语音数据集上提供 WER（词错误率）损失评测报告。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>RK3588 单核实测单句解码延迟 ≤ 60ms；</li><li>量化后相比 FP16 模型，相对词错误率（WER）增加幅度不超过 1.5%；</li><li>包含一键启动 Docker 环境与完整的编译运行文档。</li></ol>`,
    cashReward: 5800,
    pointsReward: 400,
    totalCashReward: 5800,
    totalPointsReward: 400,
    startTime: '2026-08-14 00:00:00',
    endTime: '2026-09-25 23:59:59',
    remainingDays: 7,
    publisher: '商汤端侧计算联合实验室',
    publisherAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-14 10:00:00',
    status: '进行中',
    acceptedCount: 3,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_rej_asr_1',
        taskId: 'tsk_und_rej_asr_quant',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-14 11:30:00',
        status: '已驳回',
        submissionId: 'sub_rej_asr_mine'
      },
      {
        id: 'tk_rej_asr_2',
        taskId: 'tsk_und_rej_asr_quant',
        username: '边缘计算极客喵',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-15 09:00:00',
        status: '已提交',
        submissionId: 'sub_rej_asr_2'
      },
      {
        id: 'tk_rej_asr_3',
        taskId: 'tsk_und_rej_asr_quant',
        username: 'NPU架构师小周',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 14:20:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_rej_asr_mine',
        taskId: 'tsk_und_rej_asr_quant',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-17 18:30:00',
        notes: '基于 Optimum-Intel 完成了 Whisper-Small 的 INT8 动态量化，交付了模型 ONNX 权重文件与 Python 推理测试脚本。在 RK3588 样机测试平均单句耗时 82ms。',
        files: [
          { id: 'f_asr_m1', name: 'Whisper_Small_INT8_RK3588.zip', size: '118.6 MB' },
          { id: 'f_asr_m2', name: 'Benchmark_Latency_Report.pdf', size: '2.4 MB' }
        ],
        status: '已驳回',
        rejectReason: '【雇主验收驳回意见】实测在 RK3588 开发板上的单句解码延迟为 82ms，未达指标要求的 60ms 阈值红线；且交付附件中缺失 C++ Runtime 部署接入示例。请调整算子融合策略并补充 C++ 验证工程后重新提交。',
        verifiedTime: '2026-08-18 11:20:00'
      },
      {
        id: 'sub_rej_asr_2',
        taskId: 'tsk_und_rej_asr_quant',
        username: '边缘计算极客喵',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-18 16:00:00',
        notes: '提供 NCNN 量化工程与 C++ 推理测试样例。',
        files: [{ id: 'f_asr_2', name: 'ncnn_whisper_engine.tar.gz', size: '94.2 MB' }],
        status: '待验收'
      }
    ],
    bounty: 5800,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_und_rej_rag_rerank',
    title: '跨语种法律合同 RAG 智能重排序与高并发检索中间件',
    taskType: '接单任务',
    brief: '设计支持中英双语的 BGE-Reranker-v2 批处理服务，实现向量+全文混合检索并支持 200 QPS 并发',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【任务目标】</h3><p>构建面向司法与商业合同检索的专用 Cross-Encoder 语义重排序中间件，整合 Milvus 向量检索与 Elasticsearch BM25 结果并进行倒排融合打分。</p><h3>【核心考核项】</h3><ul><li>支持中英文合同条款语义交叉打分；</li><li>支持动态 Batching，显卡显存占用稳定，支持弹性并发扩展；</li><li>提供完整的 RESTful API 与 Python/Node.js SDK。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>在 200 QPS 持续并发压力下，P99 延迟 ≤ 150ms，且无显存泄露（OOM）；</li><li>在公开 Legal-Bench 评测集上 MRR@10 指标提升 ≥ 12%；</li><li>提供 Docker Compose 一键启动集成环境与 Locust 压测脚本。</li></ol>`,
    cashReward: 7600,
    pointsReward: 550,
    totalCashReward: 7600,
    totalPointsReward: 550,
    startTime: '2026-08-15 00:00:00',
    endTime: '2026-09-24 23:59:59',
    remainingDays: 5,
    publisher: '华宇元典法律智能科技',
    publisherAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-15 14:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_rej_rag_1',
        taskId: 'tsk_und_rej_rag_rerank',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-15 16:00:00',
        status: '已驳回',
        submissionId: 'sub_rej_rag_mine'
      },
      {
        id: 'tk_rej_rag_2',
        taskId: 'tsk_und_rej_rag_rerank',
        username: '大模型系统工程师老李',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 10:00:00',
        status: '已提交',
        submissionId: 'sub_rej_rag_2'
      },
      {
        id: 'tk_rej_rag_3',
        taskId: 'tsk_und_rej_rag_rerank',
        username: 'NLP算法先锋团队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 11:30:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_rej_rag_mine',
        taskId: 'tsk_und_rej_rag_rerank',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-18 20:00:00',
        notes: '交付了基于 FastAPI + PyTorch 的 BGE-Reranker-Large 双语重排服务，封装了 RRF（倒排互惠排名）融合算法，附带 Locust 压测脚本。',
        files: [
          { id: 'f_rag_m1', name: 'Legal_Reranker_Service_v1.tar.gz', size: '42.8 MB' },
          { id: 'f_rag_m2', name: 'Locust_Benchmark_Report.html', size: '3.1 MB' }
        ],
        status: '已驳回',
        rejectReason: '【雇主验收驳回意见】在持续 120 QPS 压测 5 分钟后触发 PyTorch 显存泄露 OOM 崩溃；长文本超过 512 Token 时滑动窗口截断逻辑存在乱码。请排查 Batching 显存释放机制与分词编码，修复后支持重新提交验收。',
        verifiedTime: '2026-08-19 09:30:00'
      },
      {
        id: 'sub_rej_rag_2',
        taskId: 'tsk_und_rej_rag_rerank',
        username: '大模型系统工程师老李',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-19 14:00:00',
        notes: '采用 ONNX Runtime C++ 构建的高并发 Rerank 服务，支持动态 batching。',
        files: [{ id: 'f_rag_2', name: 'onnx_reranker_runtime.zip', size: '38.5 MB' }],
        status: '待验收'
      }
    ],
    bounty: 7600,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_und_rej_vision_defect',
    title: '光伏电池片表面微裂纹缺陷检测 YOLOv10 微调与 Web 演示系统',
    taskType: '接单任务',
    brief: '在 5000 张高精度 EL 图像上训练微小暗裂纹检测模型，mAP@0.5 需达到 0.92 以上',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【任务目标】</h3><p>针对光伏组件产线 EL（电致发光）红外检测图像中的黑斑、隐裂、碎片和微裂纹等 6 类缺陷，微调高精度轻量化目标检测网络。</p><h3>【交付清单】</h3><ul><li>PyTorch 训练源码、权重文件（.pt）及 ONNX 导出文件；</li><li>包含数据增强（MixUp/Copy-Paste）与难例挖掘脚本；</li><li>基于 Streamlit 或 Gradio 的产线微裂纹可视化检测演示 Web 界面。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>测试集综合 mAP@0.5 ≥ 0.92，其中微裂纹细分类别 Recall ≥ 85%；</li><li>单图推理耗时在 RTX 4090 下 ≤ 15ms；</li><li>包含完整的 Dockerfile 与一键复现 README 指南。</li></ol>`,
    cashReward: 4500,
    pointsReward: 350,
    totalCashReward: 4500,
    totalPointsReward: 350,
    startTime: '2026-08-16 00:00:00',
    endTime: '2026-09-28 23:59:59',
    remainingDays: 9,
    publisher: '协鑫光伏智能制造检测中心',
    publisherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-16 11:00:00',
    status: '进行中',
    acceptedCount: 3,
    submittedCount: 1,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_rej_pv_1',
        taskId: 'tsk_und_rej_vision_defect',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 15:30:00',
        status: '已驳回',
        submissionId: 'sub_rej_pv_mine'
      },
      {
        id: 'tk_rej_pv_2',
        taskId: 'tsk_und_rej_vision_defect',
        username: '机器视觉研习社',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 10:00:00',
        status: '已接单'
      },
      {
        id: 'tk_rej_pv_3',
        taskId: 'tsk_und_rej_vision_defect',
        username: 'CV算法工程师小吴',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-18 09:20:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_rej_pv_mine',
        taskId: 'tsk_und_rej_vision_defect',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-19 16:40:00',
        notes: '完成了 YOLOv10-M 的微调训练，包含 Streamlit 前端交互展示界面，测试集 mAP@0.5 达到了 0.84。',
        files: [
          { id: 'f_pv_m1', name: 'YOLOv10_Solar_Microcrack_Model.zip', size: '76.4 MB' },
          { id: 'f_pv_m2', name: 'Streamlit_Defect_Demo.zip', size: '12.8 MB' }
        ],
        status: '已驳回',
        rejectReason: '【雇主验收驳回意见】核心考核微裂纹类别召回率仅 73.5%（综合 mAP 仅 0.84，未达到 0.92 验收及格线），且压缩包内未包含 Dockerfile。请进行难例 Focal Loss 重新微调并补充容器化配置后重新提交。',
        verifiedTime: '2026-08-20 10:00:00'
      }
    ],
    bounty: 4500,
    bountyUnit: '¥'
  },

  // [我接单 - 已结束 - 通过验收获胜 1]
  {
    id: 'tsk_my_und_fcfs_win',
    title: '智算节点 GPU 动态监控 Grafana 仪表盘与 PromQL 插件',
    taskType: '接单任务',
    brief: '针对 NVIDIA H100/A100 集群编排实时显存、功耗与 CUDA 占用监控 Dashboard',
    domain: '工具与自动化',
    difficulty: '简单',
    description: `<h3>【任务目标】</h3><p>为算力平台开发一套标准的 Grafana Dashboard 仪表盘与自定义 PromQL 指标解析工具，动态跟踪监控分布式 GPU 集群监控指标。</p><h3>【包含监控面板】</h3><ul><li>GPU 温度热力图、实时功耗与 PCIe 带宽吞吐率；</li><li>NVLink 跨卡传输吞吐与显存利用率（VRAM Used/Total）；</li><li>CUDA Kernel 执行队列堵塞与异常挂死告警阈值联动。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>提供一键导入的 Grafana Dashboard JSON 配置文件，支持 Grafana 10+；</li><li>包含标准的 Prometheus Alertmanager 预警配置文件；</li><li>测试环境中 8 卡 A100/H100 节点渲染流畅，图表刷新无卡死。</li></ol>`,
    cashReward: 2800,
    pointsReward: 200,
    totalCashReward: 2800,
    totalPointsReward: 200,
    startTime: '2026-08-01 00:00:00',
    endTime: '2026-08-15 23:59:59',
    remainingDays: 0,
    publisher: '阿里云智算架构部',
    publisherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-01 11:00:00',
    status: '已结束',
    winner: {
      username: '极客小千 (你)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-05 17:00:00',
      notes: '已完成全套 PromQL 规则编写与 8 块 GPU 压测看板导入模版，实测无延迟报警。'
    },
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_und_fcfs_win_1',
        taskId: 'tsk_my_und_fcfs_win',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-01 12:00:00',
        status: '已验收',
        submissionId: 'sub_fcfs_win_1'
      },
      {
        id: 'tk_und_fcfs_win_2',
        taskId: 'tsk_my_und_fcfs_win',
        username: '云原生可观测性组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-01 14:30:00',
        status: '已提交',
        submissionId: 'sub_fcfs_win_2'
      },
      {
        id: 'tk_und_fcfs_win_3',
        taskId: 'tsk_my_und_fcfs_win',
        username: '监控运维小哥',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-02 09:10:00',
        status: '已接单'
      },
      {
        id: 'tk_und_fcfs_win_4',
        taskId: 'tsk_my_und_fcfs_win',
        username: '华为智算监控社',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-02 16:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_fcfs_win_1',
        taskId: 'tsk_my_und_fcfs_win',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-05 16:00:00',
        notes: '完成了基于 Prometheus + Grafana 10 的 GPU 显存及 Power 仪表盘编排，附带可一键导入的 grafana_gpu_board.json。',
        files: [{ id: 'f_g1', name: 'grafana_gpu_board.json', size: '1.2 MB' }],
        status: '已通过',
        verifiedTime: '2026-08-05 17:00:00'
      },
      {
        id: 'sub_fcfs_win_2',
        taskId: 'tsk_my_und_fcfs_win',
        username: '云原生可观测性组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-04 18:20:00',
        notes: '提供 Grafana 仪表盘与指标抓取配置。',
        files: [{ id: 'f_g2', name: 'gpu_monitor_dashboard.json', size: '1.5 MB' }],
        status: '已驳回',
        rejectReason: '未被采纳：未包含 NVLink 互联吞吐面板。'
      }
    ],
    bounty: 2800,
    bountyUnit: '¥'
  },

  // [我接单 - 已结束 - 通过验收获胜 2]
  {
    id: 'tsk_und_win_langgraph',
    title: '构建基于 LangGraph 的多 Agent 协同数据分析与动态报表生成工作流',
    taskType: '接单任务',
    brief: 'SQL 编写、图表渲染与经营分析报告生成的多智能体协作全自动流水线',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【项目目标】</h3><p>面向金融与新零售经营分析场景，构建基于 <b>LangGraph 状态图框架</b> 的三 Agent 协作系统：1. 数据查询 Agent (Text-to-SQL)；2. 图表绘制 Agent (ECharts/Python Matplotlib)；3. 洞察总结 Agent。</p>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>复杂多表关联 SQL 生成准确率 ≥ 91%；</li><li>生成完整的动态交互式 HTML 经营汇报报表与 PDF 导出版本；</li><li>支持人机协同（Human-in-the-loop）中途干预打回重试。</li></ol>`,
    cashReward: 12000,
    pointsReward: 800,
    totalCashReward: 12000,
    totalPointsReward: 800,
    startTime: '2026-07-20 00:00:00',
    endTime: '2026-08-10 23:59:59',
    remainingDays: 0,
    publisher: '蚂蚁数科金融智能部',
    publisherAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-20 09:00:00',
    status: '已结束',
    winner: {
      username: '极客小千 (你)',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-08 16:30:00',
      notes: '架构优雅，状态回滚机制设计严谨，交付的 5 组真实场景经营大屏图表高度贴合业务。'
    },
    acceptedCount: 4,
    submittedCount: 3,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_lg_1',
        taskId: 'tsk_und_win_langgraph',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-21 10:00:00',
        status: '已验收',
        submissionId: 'sub_lg_mine'
      },
      {
        id: 'tk_lg_2',
        taskId: 'tsk_und_win_langgraph',
        username: '数据魔方开发者社',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-21 14:20:00',
        status: '已提交',
        submissionId: 'sub_lg_2'
      },
      {
        id: 'tk_lg_3',
        taskId: 'tsk_und_win_langgraph',
        username: 'FinTech金融科技组',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-22 09:00:00',
        status: '已提交',
        submissionId: 'sub_lg_3'
      },
      {
        id: 'tk_lg_4',
        taskId: 'tsk_und_win_langgraph',
        username: '报表可视化达人',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-23 11:30:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_lg_mine',
        taskId: 'tsk_und_win_langgraph',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-06 14:00:00',
        notes: '交付 LangGraph 多智能体协作工作流核心代码、PostgreSQL 测试沙箱与 ECharts 前端动态仪表盘渲染组件。',
        files: [
          { id: 'flg1', name: 'LangGraph_MultiAgent_BI_Workflow.zip', size: '36.8 MB' },
          { id: 'flg2', name: '技术实施架构与压测报告.pdf', size: '4.5 MB' }
        ],
        status: '已通过',
        verifiedTime: '2026-08-08 16:30:00'
      },
      {
        id: 'sub_lg_2',
        taskId: 'tsk_und_win_langgraph',
        username: '数据魔方开发者社',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-05 18:20:00',
        notes: '基于 AutoGen 搭建的报表分析工作流。',
        files: [{ id: 'flg3', name: 'autogen_bi.zip', size: '28.1 MB' }],
        status: '已驳回',
        rejectReason: '未被采纳：采用 AutoGen 方案未能满足需求中要求的 LangGraph 状态图回滚约束。'
      }
    ],
    bounty: 12000,
    bountyUnit: '¥'
  },

  // [我接单 - 已结束 - 未通过验收/比稿他人胜出]
  {
    id: 'tsk_und_lose_avatar',
    title: '跨模态语音克隆与口型同步数字人实时推流 SDK',
    taskType: '接单任务',
    brief: '输入音频流与单张肖像图，实时推流生成 25fps+ 超低延迟口型匹配视频流',
    domain: 'AI模型与数据',
    difficulty: '困难',
    description: `<h3>【项目背景】</h3><p>为了在直播与在线客服中实现逼真虚拟数字人，需开发结合 <b>LivePortrait / SadTalker</b> 优化的超低延迟音视频推流引擎，支持 WebRTC 与 RTMP 协议。</p>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>单卡 RTX 4090 运行帧率 ≥ 30fps，端到端音频到视频口型延迟 ≤ 180ms；</li><li>口型与发音清辅音/浊辅音吻合度高，面部微表情自然无撕裂；</li><li>提供 C++ / Python SDK 及 WebRTC 前端播放示例。</li></ol>`,
    cashReward: 9500,
    pointsReward: 700,
    totalCashReward: 9500,
    totalPointsReward: 700,
    startTime: '2026-07-15 00:00:00',
    endTime: '2026-08-05 23:59:59',
    remainingDays: 0,
    publisher: '腾讯云智影实验室',
    publisherAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-15 10:00:00',
    status: '已结束',
    winner: {
      username: '智影前沿算法室',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-04 15:00:00',
      notes: '智影前沿算法室方案在 1080P 分辨率下保持 38fps 帧率，唇形贴合度极高，表现最优。'
    },
    acceptedCount: 4,
    submittedCount: 3,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_av_1',
        taskId: 'tsk_und_lose_avatar',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-16 11:00:00',
        status: '已驳回',
        submissionId: 'sub_av_mine'
      },
      {
        id: 'tk_av_2',
        taskId: 'tsk_und_lose_avatar',
        username: '智影前沿算法室',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-16 14:00:00',
        status: '已验收',
        submissionId: 'sub_av_win'
      },
      {
        id: 'tk_av_3',
        taskId: 'tsk_und_lose_avatar',
        username: '语音极客小林',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-17 09:30:00',
        status: '已提交',
        submissionId: 'sub_av_3'
      },
      {
        id: 'tk_av_4',
        taskId: 'tsk_und_lose_avatar',
        username: '音视频研发社',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-18 16:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_av_mine',
        taskId: 'tsk_und_lose_avatar',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-01 17:00:00',
        notes: '交付基于 TensorRT 优化的 SadTalker 推理流水线，实测 720P 帧率 28fps。',
        files: [{ id: 'fav1', name: 'Digital_Avatar_SDK_TRT.zip', size: '45.2 MB' }],
        status: '已驳回',
        rejectReason: '未被采纳：另一参赛方案在 1080P 下达成 38fps 表现更佳，感谢您的积极参与！'
      },
      {
        id: 'sub_av_win',
        taskId: 'tsk_und_lose_avatar',
        username: '智影前沿算法室',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-02 11:30:00',
        notes: 'LivePortrait 独创显存复用优化方案，帧率 38fps，口型无抖动。',
        files: [{ id: 'fav2', name: 'LivePortrait_UltraLowLatency_SDK.tar.gz', size: '58.4 MB' }],
        status: '已通过',
        verifiedTime: '2026-08-04 15:00:00'
      }
    ],
    bounty: 9500,
    bountyUnit: '¥'
  },

  // [我接单 - 已结束 - 接单但未提交成果]
  {
    id: 'tsk_und_unsubmitted_expired',
    title: '基于 vLLM 的大模型投机采样推理解析与高并发压测优化',
    taskType: '接单任务',
    brief: '针对 70B 级别开源大模型优化 Speculative Decoding 投机采样加速，并完成压测报告交付',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【项目背景】</h3><p>为了在大规模生产环境中降低大模型并发推理延迟与 GPU 显存开销，需在 vLLM 架构下部署 Qwen2.5-72B 与轻量级草稿模型（Draft Model），实现 Speculative Decoding 投机采样加速并进行基准评测。</p>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>在 8*A100 环境下，吞吐量提升 ≥ 2.2x，首字延迟 (TTFT) 降低 30% 以上；</li><li>提供完整的 Benchmark 压测对比脚本与测试报告 Markdown 文档；</li><li>提供容器化 Dockerfile 及一键启动配置说明。</li></ol>`,
    cashReward: 7800,
    pointsReward: 500,
    totalCashReward: 7800,
    totalPointsReward: 500,
    startTime: '2026-07-20 00:00:00',
    endTime: '2026-08-10 23:59:59',
    remainingDays: 0,
    publisher: '智算云海实验室',
    publisherAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-20 10:00:00',
    status: '已结束',
    winner: {
      username: '算力性能先锋队',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-09 16:20:00',
      notes: '压测数据详实，投机采样加速比实测达到 2.38x，交付源码完整严谨，验收通过！'
    },
    acceptedCount: 3,
    submittedCount: 2,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_unsub_1',
        taskId: 'tsk_und_unsubmitted_expired',
        username: '极客小千 (你)',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-25 14:30:00',
        status: '已接单'
      },
      {
        id: 'tk_unsub_2',
        taskId: 'tsk_und_unsubmitted_expired',
        username: '算力性能先锋队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-22 09:15:00',
        status: '已验收',
        submissionId: 'sub_unsub_win'
      },
      {
        id: 'tk_unsub_3',
        taskId: 'tsk_und_unsubmitted_expired',
        username: '并发架构社',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-23 16:40:00',
        status: '已提交',
        submissionId: 'sub_unsub_3'
      }
    ],
    submissions: [
      {
        id: 'sub_unsub_win',
        taskId: 'tsk_und_unsubmitted_expired',
        username: '算力性能先锋队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-07 18:00:00',
        notes: '提供 vLLM Speculative Decoding 压测报告与一键配置 Dockerfile，支持多种 Draft 策略。',
        files: [{ id: 'f_unsub_win', name: 'vllm_speculative_decoding_benchmark.tar.gz', size: '24.6 MB' }],
        status: '已通过',
        verifiedTime: '2026-08-09 16:20:00'
      },
      {
        id: 'sub_unsub_3',
        taskId: 'tsk_und_unsubmitted_expired',
        username: '并发架构社',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-08 20:30:00',
        notes: '交付 vLLM 压测框架脚本与图表分析。',
        files: [{ id: 'f_unsub_3', name: 'perf_report.pdf', size: '5.2 MB' }],
        status: '已驳回',
        rejectReason: '未被采纳：另一参赛方案性能指标更高且提供了完整容器化环境。'
      }
    ],
    bounty: 7800,
    bountyUnit: '¥'
  },


  // =========================================================================
  // 2. 我发布的任务 (My Published Tasks) - 涵盖 审核中/进行中/已驳回/已结束
  // =========================================================================

  // [我发布 - 审核中 1]
  {
    id: 'tsk_my_pub_audit_1',
    title: '基于 DeepSeek-R1 的智能代码重构与安全漏洞扫描 CLI 工具',
    taskType: '接单任务',
    brief: '自动扫描 Git 仓库中的 CWE 常见漏洞并提供重构 Patch 修复补丁',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【项目背景与技术选型】</h3><p>为了提升团队 CI/CD 代码安全合规审查效率，开发基于 <b>DeepSeek-R1 CoT 深度推理能力</b> 的静态代码漏洞扫描与自动修复 CLI 工具。</p><h3>【核心检测项】</h3><ul><li>CWE-79 跨站脚本攻击 (XSS)、CWE-89 SQL 注入、CWE-78 命令注入；</li><li>SQL 内存泄漏、未释放锁、并发竞态条件风险检测；</li><li>自动输出符合 <code>git apply</code> 的 Unified Patch 补丁文件与重构对比报告。</li></ul>`,
    acceptanceCriteria: `<h3>【成果验收标准】</h3><ol><li>在 OWASP Benchmark 标准基准测试集中，漏洞识别准确率 ≥ 88.0%，虚报率 ≤ 8.0%；</li><li>支持 Python / C++ / Go / TypeScript 多语言开源项目；</li><li>提供完整的 CLI 源代码与 GitHub Action 自动化集成示例。</li></ol>`,
    cashReward: 6800,
    pointsReward: 400,
    totalCashReward: 6800,
    totalPointsReward: 400,
    startTime: '2026-08-18 00:00:00',
    endTime: '2026-09-30 23:59:59',
    remainingDays: 12,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-17 19:00:00',
    status: '审核中',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 6800,
    bountyUnit: '¥'
  },

  // [我发布 - 审核中 2]
  {
    id: 'tsk_my_pub_audit_2',
    title: '开发支持百川大模型的微信小程序多轮客服 Agent 接入 SDK',
    taskType: '接单任务',
    brief: '包含打字机效果、流式长连接维护与敏感词前端拦截组件',
    domain: '技术开发',
    difficulty: '简单',
    description: `<h3>【需求描述】</h3><p>微信小程序环境下原生 WebSocket 与 Transfer-Encoding 分块传输有限制，需封装一套可在微信小程序稳定运行的 AI 客服对话 SDK，支持断线重连与 Markdown 公式平滑渲染。</p>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>提供支持原生小程序与 Uni-app / Taro 的 npm 组件包；</li><li>弱网环境下断线重连自动恢复上下文；</li><li>附带 1 个完整运行的 Demo 小程序源码。</li></ol>`,
    cashReward: 5200,
    pointsReward: 350,
    totalCashReward: 5200,
    totalPointsReward: 350,
    startTime: '2026-08-18 00:00:00',
    endTime: '2026-09-20 23:59:59',
    remainingDays: 2,
    publisher: '极客小千',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-18 10:30:00',
    status: '审核中',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 5200,
    bountyUnit: '¥'
  },

  // [我发布 - 进行中 1 (有多位接单人与待验收成果)]
  {
    id: 'tsk_my_pub_ing_fcfs',
    title: '搭建企业级 Milvus 向量数据库开箱即用 K8s Helm Chart',
    taskType: '接单任务',
    brief: '包含分布式 Milvus 2.4 集群、Attu 管理面板及云原生持久化存储编排',
    domain: '工具与自动化',
    difficulty: '中等',
    description: `<h3>【项目背景】</h3><p>为了在云原生 K8s 环境上快速一键拉起可横向扩展的高可用 Milvus 向量数据库集群，需编写开箱即用的 Helm Chart 包。</p><h3>【核心组件配置】</h3><ul><li>集成 Milvus 2.4+ 分布式组件（Proxy、QueryNode、DataNode、IndexNode）；</li><li>依赖项存储编排：MinIO 对象存储集群、Etcd 状态存储、Pulsar / Kafka 消息通道；</li><li>预置 Attu 可视化 GUI 管理面板与 Prometheus 告警 Pod 规则。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li><code>helm install</code> 在 ACK / EKS / K3s 环境一键拉起无报错；</li><li>支持动态设置 StorageClass 持久化卷；</li><li>提供包含 1,000 万条 1536 维向量写入压测脚本。</li></ol>`,
    cashReward: 3500,
    pointsReward: 300,
    totalCashReward: 3500,
    totalPointsReward: 300,
    startTime: '2026-08-15 00:00:00',
    endTime: '2026-09-28 23:59:59',
    remainingDays: 10,
    publisher: '极客小千',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-15 15:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_pub_fcfs_1',
        taskId: 'tsk_my_pub_ing_fcfs',
        username: 'K8s云原生运维队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 09:20:00',
        status: '已提交',
        submissionId: 'sub_pub_helm_1'
      },
      {
        id: 'tk_pub_fcfs_2',
        taskId: 'tsk_my_pub_ing_fcfs',
        username: '阿里云混合云架构组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 14:10:00',
        status: '已提交',
        submissionId: 'sub_pub_helm_2'
      },
      {
        id: 'tk_pub_fcfs_3',
        taskId: 'tsk_my_pub_ing_fcfs',
        username: '智算云原生先锋队',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 10:00:00',
        status: '已接单'
      },
      {
        id: 'tk_pub_fcfs_4',
        taskId: 'tsk_my_pub_ing_fcfs',
        username: '架构喵实验室',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-18 11:30:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_pub_helm_1',
        taskId: 'tsk_my_pub_ing_fcfs',
        username: 'K8s云原生运维队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-18 18:00:00',
        notes: '编写了完整的 Milvus 2.4.5 分布式 Chart 包，含 MinIO Operator 与 Attu GUI 挂载。',
        files: [
          { id: 'f_h1', name: 'milvus-distributed-helm-v2.4.tgz', size: '18.4 MB' },
          { id: 'f_h2', name: 'values_production_example.yaml', size: '0.4 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_pub_helm_2',
        taskId: 'tsk_my_pub_ing_fcfs',
        username: '阿里云混合云架构组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-19 14:20:00',
        notes: '提供支持多 StorageClass 与 Prometheus 监控告警配置的 Helm 模版。',
        files: [{ id: 'f_h3', name: 'milvus-helm-chart-aliyun.zip', size: '14.2 MB' }],
        status: '待验收'
      }
    ],
    bounty: 3500,
    bountyUnit: '¥'
  },

  // [我发布 - 进行中 2]
  {
    id: 'tsk_my_pub_ing_vllm',
    title: '基于 vLLM 算力池的多租户并发限流与弹性伸缩调度中间件',
    taskType: '接单任务',
    brief: '动态监控 GPU 显存 KV Cache 占用，实现基于 PagedAttention 的请求排队调度',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【项目需求】</h3><p>在私有化大模型集群中，多用户并发发起请求极易导致 GPU 显存 OOM 或长尾排队。需开发一套挂载在 vLLM 前置的高性能网关调度中间件，支持根据租户权重优先级动态分配 Token 生成带宽。</p>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>在 500 并发压测下，网关本身 CPU 占用 ≤ 5%，转发吞吐损失 ≤ 2%；</li><li>提供实时 PromQL 监控指标与租户配额管理后台；</li><li>交付 Python / Go 源码与 Docker 编排文件。</li></ol>`,
    cashReward: 11000,
    pointsReward: 900,
    totalCashReward: 11000,
    totalPointsReward: 900,
    startTime: '2026-08-16 00:00:00',
    endTime: '2026-09-30 23:59:59',
    remainingDays: 12,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-16 11:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 1,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_vllm_1',
        taskId: 'tsk_my_pub_ing_vllm',
        username: '华为云智算咨询团队',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 09:30:00',
        status: '已提交',
        submissionId: 'sub_vllm_1'
      },
      {
        id: 'tk_vllm_2',
        taskId: 'tsk_my_pub_ing_vllm',
        username: '清华AI工程队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 14:00:00',
        status: '已接单'
      },
      {
        id: 'tk_vllm_3',
        taskId: 'tsk_my_pub_ing_vllm',
        username: '深蓝算法社',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-18 10:20:00',
        status: '已接单'
      },
      {
        id: 'tk_vllm_4',
        taskId: 'tsk_my_pub_ing_vllm',
        username: '极客老王',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-19 16:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_vllm_1',
        taskId: 'tsk_my_pub_ing_vllm',
        username: '华为云智算咨询团队',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-20 15:00:00',
        notes: '完成基于 Go + eBPF 零拷贝转发的 vLLM 租户流控中间件，支持动态动态 Token 队列。',
        files: [
          { id: 'f_vllm1', name: 'vLLM_MultiTenant_Gateway_Go.tar.gz', size: '22.8 MB' },
          { id: 'f_vllm2', name: '500并发压测报告.pdf', size: '3.2 MB' }
        ],
        status: '待验收'
      }
    ],
    bounty: 11000,
    bountyUnit: '¥'
  },

  // [我发布 - 进行中 3]
  {
    id: 'tsk_my_pub_ing_ui',
    title: '设计智算工坊 3D 数字人交互界面与 WebGL 动效系统',
    taskType: '接单任务',
    brief: '基于 Three.js / React-Three-Fiber 开发沉浸式算力状态动态球与数字人看板',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【设计与前端要求】</h3><p>打造未来科技感极强的 3D 数字人互动大屏，支持根据 GPU 算力负载动态改变 3D 几何粒子球旋转速度与发光色温，响应式适配移动端与桌面端。</p>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>Three.js 动效在常规手机上保持 60fps 流畅运行；</li><li>提供完整的 React 组件源码与 Storybook 演示；</li><li>包含 Figma 原型与资产切图源文件。</li></ol>`,
    cashReward: 4800,
    pointsReward: 350,
    totalCashReward: 4800,
    totalPointsReward: 350,
    startTime: '2026-08-14 00:00:00',
    endTime: '2026-09-26 23:59:59',
    remainingDays: 8,
    publisher: '极客小千',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-14 14:00:00',
    status: '进行中',
    acceptedCount: 3,
    submittedCount: 1,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_ui_1',
        taskId: 'tsk_my_pub_ing_ui',
        username: '视觉设计魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-15 10:00:00',
        status: '已提交',
        submissionId: 'sub_ui_1'
      },
      {
        id: 'tk_ui_2',
        taskId: 'tsk_my_pub_ing_ui',
        username: '前端大师兄',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 11:30:00',
        status: '已接单'
      },
      {
        id: 'tk_ui_3',
        taskId: 'tsk_my_pub_ing_ui',
        username: 'WebGL动效极客',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 15:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_ui_1',
        taskId: 'tsk_my_pub_ing_ui',
        username: '视觉设计魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-19 18:30:00',
        notes: '交付基于 R3F 构建的 3D 发光粒子球组件与完整 Figma 设计系统。',
        files: [
          { id: 'f_ui1', name: 'ThreeJS_Compute_Sphere_Component.zip', size: '14.8 MB' },
          { id: 'f_ui2', name: 'Figma_Design_Assets.fig', size: '28.1 MB' }
        ],
        status: '待验收'
      }
    ],
    bounty: 4800,
    bountyUnit: '¥'
  },

  // [我发布 - 已驳回 1]
  {
    id: 'tsk_my_pub_rejected_1',
    title: '自动批量注册某社交平台账号并绕过人脸活体识别验证',
    taskType: '接单任务',
    brief: '编写自动化脚本绕过手机号短信验证与活体人脸核验',
    domain: '工具与自动化',
    difficulty: '简单',
    description: `<h3>【需求说明】</h3><p>用户希望编写自动化攻击与接码脚本，伪造设备指纹以绕过某平台的真人人脸识别与手机短信验证。</p>`,
    acceptanceCriteria: `<p>交付可批量并发注册无感账号的自动化程序脚本。</p>`,
    cashReward: 15000,
    pointsReward: 0,
    totalCashReward: 15000,
    totalPointsReward: 0,
    startTime: '2026-08-15 00:00:00',
    endTime: '2026-08-25 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-15 11:00:00',
    status: '已驳回',
    rejectReason: '违反平台《安全合规与法务审核条款》：禁止发布涉及未授权绕过人脸识别或黑灰产账号注册相关的违法违规技术需求。预付全额托管款项已原路返还。',
    auditTime: '2026-08-15 11:30:00',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 15000,
    bountyUnit: '¥'
  },

  // [我发布 - 已驳回 2]
  {
    id: 'tsk_my_pub_rejected_2',
    title: '批量爬取某同城房产与商业平台未公开会员手机号码',
    taskType: '接单任务',
    brief: '需要编写高频爬虫绕过反爬风控机制获取业主联系方式',
    domain: '技术开发',
    difficulty: '简单',
    description: `<h3>【需求说明】</h3><p>需求方欲编写高频爬虫脚本，批量获取房产平台未公开的私人联系电话与业主信息。</p>`,
    acceptanceCriteria: `<p>交付包含 10 万条明文手机号的数据库。</p>`,
    cashReward: 3000,
    pointsReward: 0,
    totalCashReward: 3000,
    totalPointsReward: 0,
    startTime: '2026-08-16 00:00:00',
    endTime: '2026-08-26 23:59:59',
    remainingDays: 0,
    publisher: '极客小千',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-16 10:00:00',
    status: '已驳回',
    rejectReason: '违反平台《隐私合规条例》：禁止发布抓取个人未公开隐私或通讯录相关需求。预付冻结资金已全额退回账户。',
    auditTime: '2026-08-16 10:45:00',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 3000,
    bountyUnit: '¥'
  },

  // [我发布 - 已结束/已验收 1]
  {
    id: 'tsk_my_pub_finished_bigao',
    title: '微调 Flux.1 智算硬件 3D 渲染工业风 LoRA 绘画模型',
    taskType: '接单任务',
    brief: '专用于渲染服务器、GPU 机架与芯片电路质感的极简科技风 LoRA',
    domain: 'AI模型与数据',
    difficulty: '困难',
    description: `<h3>【任务需求与艺术风格】</h3><p>基于 500 张高质量 3D 渲染工业风 GPU 机房、数据中心机架与高精芯片结构图像，基于 Kohya_ss 微调专属的 Flux.1 Dev / SDXL 绘画模型 LoRA。</p><h3>【核心风格要求】</h3><ul><li>工业级哑光金属拉丝、极简冷色调暗光与 LED 警示灯带光影；</li><li>支持通过 Trigger Word 灵活控制机房角度（俯拍/近景电路细节/全景机架阵列）；</li><li>避免模型产生过拟合死板重复图像。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>在 ComfyUI 中权重设为 0.7 - 0.8 时，能精准还原物理渲染光影；</li><li>提交打标数据集清单、训练 Log 及 safetensors 权重文件；</li><li>包含 20 张高清测试渲染对比图。</li></ol>`,
    cashReward: 9000,
    pointsReward: 600,
    totalCashReward: 9000,
    totalPointsReward: 600,
    startTime: '2026-07-25 00:00:00',
    endTime: '2026-08-10 23:59:59',
    remainingDays: 0,
    publisher: '极客小千',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-25 10:00:00',
    status: '已结束',
    winner: {
      username: 'SDLoRA专家组',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-08-08 15:00:00',
      notes: '已基于 Kohya_ss 完成 Flux.1 Dev 微调，生成的工业级机房渲染图光影极其细腻自然。'
    },
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_pub_b_1',
        taskId: 'tsk_my_pub_finished_bigao',
        username: 'SDLoRA专家组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-27 11:00:00',
        status: '已验收',
        submissionId: 'sub_pub_b_1'
      },
      {
        id: 'tk_pub_b_2',
        taskId: 'tsk_my_pub_finished_bigao',
        username: '视觉设计魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-28 14:00:00',
        status: '已提交',
        submissionId: 'sub_pub_b_2'
      },
      {
        id: 'tk_pub_b_3',
        taskId: 'tsk_my_pub_finished_bigao',
        username: 'AIGC摄影家',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-29 09:30:00',
        status: '已接单'
      },
      {
        id: 'tk_pub_b_4',
        taskId: 'tsk_my_pub_finished_bigao',
        username: '3D建模工作室',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-30 16:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_pub_b_1',
        taskId: 'tsk_my_pub_finished_bigao',
        username: 'SDLoRA专家组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-06 18:00:00',
        notes: '交付包含 150MB LoRA 权重文件、工作流 JSON 模版及 20 张高清测试渲染对照图。',
        files: [{ id: 'f_lora1', name: 'Flux_Industrial_GPU_v1.safetensors', size: '154 MB' }],
        status: '已通过',
        verifiedTime: '2026-08-08 15:00:00'
      },
      {
        id: 'sub_pub_b_2',
        taskId: 'tsk_my_pub_finished_bigao',
        username: '视觉设计魔法师',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-07 10:00:00',
        notes: '基于 SDXL 微调的 3D 机架渲染权重。',
        files: [{ id: 'f_lora2', name: 'sdxl_gpu_3d_render.safetensors', size: '120 MB' }],
        status: '已驳回',
        rejectReason: '未被采纳：另一组基于 Flux.1 模型的生成光影细节更符合需求要求。'
      }
    ],
    bounty: 9000,
    bountyUnit: '¥'
  },

  // [我发布 - 已结束/已验收 2]
  {
    id: 'tsk_my_pub_end_math',
    title: '构建面向高校智能教育的数学解题 Agent 与公式 LaTeX 渲染引擎',
    taskType: '接单任务',
    brief: '支持高中至大学高数微积分步进式推导解答与 KaTeX 实时矢量渲染',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【项目需求】</h3><p>为了在在线答疑平台提供逻辑清晰的数学步骤拆解，需基于 <b>DeepSeek-Math / Qwen2.5-Math</b> 开发带公式校验的解题推导引擎。</p>`,
    acceptanceCriteria: `<h3>【验收考核】</h3><ol><li>在 GSM8K 与 MATH 权威基准测试集上准确率 ≥ 86.5%；</li><li>LaTeX 公式 100% 通过 KaTeX 语法解析无报错；</li><li>输出包含完整 Python API 与前端 React 渲染组件。</li></ol>`,
    cashReward: 6500,
    pointsReward: 500,
    totalCashReward: 6500,
    totalPointsReward: 500,
    startTime: '2026-07-10 00:00:00',
    endTime: '2026-07-31 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-10 09:00:00',
    status: '已结束',
    winner: {
      username: '清华AI工程队',
      userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      passTime: '2026-07-28 14:00:00',
      notes: '解题步骤推导极其详尽，公式解析无任何语法错误，交付成果令人满意。'
    },
    acceptedCount: 3,
    submittedCount: 2,
    verifiedCount: 1,
    takers: [
      {
        id: 'tk_math_1',
        taskId: 'tsk_my_pub_end_math',
        username: '清华AI工程队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-11 10:00:00',
        status: '已验收',
        submissionId: 'sub_math_1'
      },
      {
        id: 'tk_math_2',
        taskId: 'tsk_my_pub_end_math',
        username: '算法工坊小杨',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-12 14:30:00',
        status: '已提交',
        submissionId: 'sub_math_2'
      },
      {
        id: 'tk_math_3',
        taskId: 'tsk_my_pub_end_math',
        username: '数理逻辑先锋',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-13 09:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_math_1',
        taskId: 'tsk_my_pub_end_math',
        username: '清华AI工程队',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-07-26 18:00:00',
        notes: '交付微调后的 Qwen2.5-Math-7B 权重与 KaTeX 动态渲染组件，MATH 基准测试达到 88.2%。',
        files: [{ id: 'f_m1', name: 'Math_Solver_Agent_Package.zip', size: '32.1 MB' }],
        status: '已通过',
        verifiedTime: '2026-07-28 14:00:00'
      },
      {
        id: 'sub_math_2',
        taskId: 'tsk_my_pub_end_math',
        username: '算法工坊小杨',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-07-27 11:20:00',
        notes: '提供基于 DeepSeek-Math 的解题 API 封装。',
        files: [{ id: 'f_m2', name: 'math_api_deepseek.tar.gz', size: '18.6 MB' }],
        status: '已驳回',
        rejectReason: '未被采纳：另一方案附带的交互式前端渲染体验更加出色。'
      }
    ],
    bounty: 6500,
    bountyUnit: '¥'
  },

  // [我发布 - 已到期结束 - 待验收（部分已驳回，支持测试驳回不可选 & 到期全驳回全额退款）]
  {
    id: 'tsk_my_pub_exp_pending',
    title: '高并发金融行情推流 WebSocket 代理网关与反压调度',
    taskType: '接单任务',
    brief: '50万长连接实时推送、环形缓冲区队列优化与基于水位线的动态背压调度中间件',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【项目背景】</h3><p>为了支撑百万级散户实时盘口数据低延迟推送，需开发基于高效 I/O 多路复用的 WebSocket 网关，支持客户端慢消费时的自适应反压熔断调度。</p><h3>【核心交付要求】</h3><ul><li>支持 50 万并发连接稳定维持，单机内存消耗 ≤ 16GB；</li><li>具备精确的水位线队列缓冲与丢包预警监控；</li><li>提供完整的 Rust / C++ 源码、压测工具与部署文档。</li></ul>`,
    acceptanceCriteria: `<h3>【验收考核标准】</h3><ol><li>在 50 万并发连接突发写入下，P99 延迟 ≤ 20ms，无内存泄露与崩溃；</li><li>客户端慢速接收时，动态反压保护生效，保证服务端稳定运行；</li><li>包含详尽的 Locust / wrk 压测复现报告与自动化测试用例。</li></ol>`,
    cashReward: 5800,
    pointsReward: 350,
    totalCashReward: 5800,
    totalPointsReward: 350,
    startTime: '2026-08-01 00:00:00',
    endTime: '2026-08-20 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-01 09:00:00',
    status: '已结束',
    acceptedCount: 3,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_exp_p1',
        taskId: 'tsk_my_pub_exp_pending',
        username: '极客小明',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-02 10:00:00',
        status: '已驳回',
        submissionId: 'sub_exp_p1'
      },
      {
        id: 'tk_exp_p2',
        taskId: 'tsk_my_pub_exp_pending',
        username: 'Rust异步专家',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-03 14:30:00',
        status: '已提交',
        submissionId: 'sub_exp_p2'
      },
      {
        id: 'tk_exp_p3',
        taskId: 'tsk_my_pub_exp_pending',
        username: '网络攻坚组',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-04 16:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_exp_p1',
        taskId: 'tsk_my_pub_exp_pending',
        username: '极客小明',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-15 17:30:00',
        notes: '交付了基于 Go Gorilla WebSocket 的代理中间件，附带简要测试脚本。',
        files: [{ id: 'f_exp1', name: 'Go_WebSocket_Gateway.zip', size: '15.4 MB' }],
        status: '已驳回',
        rejectReason: '【发布人验收驳回意见】实测在 50 万并发连接突发写入时内存反压机制失效，导致代理进程 OOM 异常退出；未能达到验收指标要求的 0 丢包标准。发布人已确认驳回该方案。',
        verifiedTime: '2026-08-17 11:00:00'
      },
      {
        id: 'sub_exp_p2',
        taskId: 'tsk_my_pub_exp_pending',
        username: 'Rust异步专家',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-19 20:00:00',
        notes: '基于 Rust Tokio + epoll 实现的高性能 WebSocket 推流网关，支持动态背压调节与 RingBuffer 环形缓冲。附带 50 万压测报告。',
        files: [
          { id: 'f_exp2_1', name: 'Rust_Tokio_Gateway_v2.tar.gz', size: '28.6 MB' },
          { id: 'f_exp2_2', name: 'Benchmark_Report_500k.pdf', size: '3.8 MB' }
        ],
        status: '待验收'
      }
    ],
    bounty: 5800,
    bountyUnit: '¥'
  },

  // [我发布 - 已到期结束 - 全部成果已驳回并已全额退还发布人]
  {
    id: 'tsk_my_pub_exp_refunded',
    title: '端侧轻量化实时目标追踪 ByteTrack 模型 NPU 移植与量化',
    taskType: '接单任务',
    brief: '针对 RK3588 NPU 移植 ByteTrack 多目标追踪算法，多路 1080P 达到 30fps',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【项目需求】</h3><p>将 YOLOv8-ByteTrack 多目标跟踪算法部署至嵌入式边缘设备 RK3588，实现 4 路 1080P 视频流实时行人/车辆轨迹跟踪。</p><h3>【验收考核】</h3><p>在 NPU 占用率 ≤ 80% 下稳定 30fps，ID Switch 频率需低于基线 10%。</p>`,
    acceptanceCriteria: `<ol><li>支持 4 路 1080P 30fps 实时运行；</li><li>量化精度损失 ≤ 1.5%；</li><li>提供完整的 C++ 测试工程与开发板部署固件。</li></ol>`,
    cashReward: 4800,
    pointsReward: 300,
    totalCashReward: 4800,
    totalPointsReward: 300,
    startTime: '2026-07-20 00:00:00',
    endTime: '2026-08-15 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-20 10:00:00',
    status: '已结束',
    refunded: true,
    refundCash: 4800,
    refundPoints: 300,
    refundTime: '2026-08-18 16:30:00',
    refundReason: '任务已到期结束，所有接单极客提交的成果均未达到嵌入式 NPU 帧率与精度考核红线，经发布人全面评审后已全部驳回。任务预付托管金额 ¥4,800 及 300 平台积分已全额退还至发布人账户。',
    acceptedCount: 2,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_rf_1',
        taskId: 'tsk_my_pub_exp_refunded',
        username: '嵌入式小李',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-22 11:00:00',
        status: '已驳回',
        submissionId: 'sub_rf_1'
      },
      {
        id: 'tk_rf_2',
        taskId: 'tsk_my_pub_exp_refunded',
        username: 'NPU探索者',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-23 15:30:00',
        status: '已驳回',
        submissionId: 'sub_rf_2'
      }
    ],
    submissions: [
      {
        id: 'sub_rf_1',
        taskId: 'tsk_my_pub_exp_refunded',
        username: '嵌入式小李',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-10 16:00:00',
        notes: '交付了 RKNN 量化权重文件与 Python 推理脚本，实测 4 路 22fps。',
        files: [{ id: 'f_rf1', name: 'bytetrack_rknn_weights.zip', size: '24.2 MB' }],
        status: '已驳回',
        rejectReason: '【发布人验收驳回意见】帧率仅达到 22fps，未能满足 30fps 实时性红线，且长时间运行偶发内存泄漏。',
        verifiedTime: '2026-08-16 10:00:00'
      },
      {
        id: 'sub_rf_2',
        taskId: 'tsk_my_pub_exp_refunded',
        username: 'NPU探索者',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-12 18:00:00',
        notes: '优化了后处理算子，提供 C++ 测试程序。',
        files: [{ id: 'f_rf2', name: 'bytetrack_npu_cpp.tar.gz', size: '36.5 MB' }],
        status: '已驳回',
        rejectReason: '【发布人验收驳回意见】多目标 ID Switch 频繁跳变，精度评测损失高达 8.2%，远超 1.5% 容忍度要求。',
        verifiedTime: '2026-08-17 14:00:00'
      }
    ],
    bounty: 4800,
    bountyUnit: '¥'
  },

  // -------------------------------------------------------------------------
  // [我发布 - 到期结束类型 A：无人接单到期结束]
  // -------------------------------------------------------------------------
  {
    id: 'tsk_my_pub_exp_no_takers_1',
    title: '基于 WebGPU 的医学 DICOM 3D 体绘制与光线投射渲染引擎',
    taskType: '接单任务',
    brief: '纯浏览器端 WebGPU 加速的医学 CT/MRI 三维体绘制，实现 60fps 实时光线投射与传输函数动态调节',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【项目背景】</h3><p>为了在 Web 端实现轻量级远程医疗影像三维重建，急需开发基于标准 WebGPU API 的三维体绘制（Volume Rendering）引擎。</p><h3>【核心要求】</h3><ul><li>支持标准 DICOM/NIfTI 体素数据加载与三维纹理重组；</li><li>纯 WGSL 着色器实现实时光线投射（Ray Marching）与梯度阴影计算；</li><li>在 M1 Mac / RTX 3060 浏览器环境下维持 60fps 流畅交互。</li></ul>`,
    acceptanceCriteria: `<h3>【验收标准】</h3><ol><li>512×512×512 体素数据集旋转与剖切达到 60fps 无掉帧；</li><li>支持一维/二维传递函数（Transfer Function）实时调色板编辑；</li><li>提供完整的 TypeScript + WGSL 源码与沙盒示例工程。</li></ol>`,
    cashReward: 6200,
    pointsReward: 400,
    totalCashReward: 6200,
    totalPointsReward: 400,
    startTime: '2026-06-01 00:00:00',
    endTime: '2026-06-30 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-06-01 09:30:00',
    status: '已结束',
    refunded: true,
    refundCash: 6200,
    refundPoints: 400,
    refundTime: '2026-07-01 00:05:00',
    refundReason: '任务已到达截止时间，公示周期内无开发者接单承接。任务预付托管赏金 ¥6,200 及 400 平台积分已自动全额退还至发布人账户。',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 6200,
    bountyUnit: '¥'
  },
  {
    id: 'tsk_my_pub_exp_no_takers_2',
    title: '分布式时序数据库倒排索引压缩与 SIMD-BP128 算子加速',
    taskType: '接单任务',
    brief: '针对物联网海量时间序列 Tag 倒排列表，基于 SIMD BP128/RoaringBitmap 实现纳秒级交并集查询',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【项目需求】</h3><p>面向工业传感器监控场景，优化自研 TSDB 的倒排索引存储密度与过滤检索性能。需利用 AVX-512/NEON 指令集完成 BitPacking-128 压缩算子研发。</p><h3>【交付范围】</h3><ul><li>C++/Rust 编写的高性能 SIMD 解压与求交集内核；</li><li>相比标准 RoaringBitmap 提升 3x 以上查询吞吐。</li></ul>`,
    acceptanceCriteria: `<ol><li>千万级 Tag 检索延迟 P99 ≤ 50μs；</li><li>无内存泄露并通过 AddressSanitizer 压力检验；</li><li>包含详尽的 Google Benchmark 性能对比测试集。</li></ol>`,
    cashReward: 8500,
    pointsReward: 500,
    totalCashReward: 8500,
    totalPointsReward: 500,
    startTime: '2026-06-15 00:00:00',
    endTime: '2026-07-15 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-06-15 11:00:00',
    status: '已结束',
    refunded: true,
    refundCash: 8500,
    refundPoints: 500,
    refundTime: '2026-07-16 00:05:00',
    refundReason: '任务技术要求与算子优化门槛较高，任务公示期内无开发者接单。预付托管资金 ¥8,500 及 500 平台积分已自动全额原路退还至发布人账户。',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 8500,
    bountyUnit: '¥'
  },
  {
    id: 'tsk_my_pub_exp_no_takers_3',
    title: '小语种（斯瓦希里语/豪萨语）语音识别 ASR 音素对齐数据集构建',
    taskType: '接单任务',
    brief: '非洲本土常用小语种 200 小时母语发音采集、音素标注与 Montreal Forced Aligner 强制对齐',
    domain: 'AI模型与数据',
    difficulty: '困难',
    description: `<h3>【项目背景】</h3><p>为拓展多语言大模型的多语种语音理解能力，需搜集并精细标注 200 小时斯瓦希里语及豪萨语自然语流音频及词级时间戳。</p>`,
    acceptanceCriteria: `<ol><li>音频采样率 16kHz 16-bit 单声道，信噪比 ≥ 25dB；</li><li>音素对齐时间戳误差 ≤ 20ms，标注准确率 ≥ 96%；</li><li>提交符合 Kaldi/HuggingFace 格式规范的数据集包。</li></ol>`,
    cashReward: 3600,
    pointsReward: 200,
    totalCashReward: 3600,
    totalPointsReward: 200,
    startTime: '2026-07-01 00:00:00',
    endTime: '2026-07-25 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-01 10:00:00',
    status: '已结束',
    refunded: true,
    refundCash: 3600,
    refundPoints: 200,
    refundTime: '2026-07-26 00:05:00',
    refundReason: '任务已到达截止时间，公示周期内无开发者接单承接。预付托管赏金 ¥3,600 与 200 平台积分已全额返还至发布人账户。',
    acceptedCount: 0,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [],
    submissions: [],
    bounty: 3600,
    bountyUnit: '¥'
  },

  // -------------------------------------------------------------------------
  // [我发布 - 到期结束类型 B：有人接单但是无人提交然后到期结束]
  // -------------------------------------------------------------------------
  {
    id: 'tsk_my_pub_exp_no_sub_1',
    title: '跨平台 Flutter 渲染引擎低延迟虚拟声卡驱动与混音插件',
    taskType: '接单任务',
    brief: '开发 Windows/macOS 双端虚拟音频环回输入输出驱动，支持 DAW 级低延迟混音与采集',
    domain: '技术开发',
    difficulty: '中等',
    description: `<h3>【需求描述】</h3><p>需要针对 Flutter 桌面端提供 CoreAudio (macOS) 与 WASAPI Exclusive (Windows) 底层环回驱动，解决跨平台在线协作直播中的伴奏混音与降噪问题。</p>`,
    acceptanceCriteria: `<ol><li>端到端音频缓冲延迟 ≤ 15ms；</li><li>支持动态采样率重采样与多路音频流混音；</li><li>提供完整的 Dart FFI 接口与桌面端演示 Demo。</li></ol>`,
    cashReward: 4200,
    pointsReward: 250,
    totalCashReward: 4200,
    totalPointsReward: 250,
    startTime: '2026-07-05 00:00:00',
    endTime: '2026-08-05 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-05 14:00:00',
    status: '已结束',
    refunded: true,
    refundCash: 4200,
    refundPoints: 250,
    refundTime: '2026-08-06 00:05:00',
    refundReason: '任务已到期截止。共有 2 位开发者接单，但接单人在截止时间前均未提交验收成果。任务预付托管金额 ¥4,200 及 250 平台积分已自动全额退还至发布人账户。',
    acceptedCount: 2,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_ns1_1',
        taskId: 'tsk_my_pub_exp_no_sub_1',
        username: '移动端老兵',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-08 14:20:00',
        status: '已接单'
      },
      {
        id: 'tk_ns1_2',
        taskId: 'tsk_my_pub_exp_no_sub_1',
        username: '音频算法狂人',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-10 16:30:00',
        status: '已接单'
      }
    ],
    submissions: [],
    bounty: 4200,
    bountyUnit: '¥'
  },
  {
    id: 'tsk_my_pub_exp_no_sub_2',
    title: '三维工业零件 CAD STEP 文件轻量化 glTF 拓扑减面转换工具',
    taskType: '接单任务',
    brief: '基于 OpenCASCADE 内核开发命令行与 WebAssembly 工具，将 GB 级 STEP 转换为轻量 glTF 并保持装配体层级',
    domain: '工具与自动化',
    difficulty: '困难',
    description: `<h3>【需求描述】</h3><p>将工业 CAD 交换格式（STEP/IGES）自动三角剖分转换至适用于 Web 渲染的 glTF 2.0，需具备高质量几何特征边保形减面与材质分离能力。</p>`,
    acceptanceCriteria: `<ol><li>减面率达 70% 时曲率边界偏差 ≤ 0.2mm；</li><li>保留完整的层级树状装配体（Assembly Tree）与构件元属性；</li><li>支持多线程批量转换与内存上限控制。</li></ol>`,
    cashReward: 5200,
    pointsReward: 300,
    totalCashReward: 5200,
    totalPointsReward: 300,
    startTime: '2026-07-15 00:00:00',
    endTime: '2026-08-10 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-15 15:30:00',
    status: '已结束',
    refunded: true,
    refundCash: 5200,
    refundPoints: 300,
    refundTime: '2026-08-11 00:05:00',
    refundReason: '任务已到达截止时间。共有 3 位极客接单，但由于 CAD 拓扑减面算法难度大，接单人在截止期前未提交验收成果。任务预付托管资金 ¥5,200 与 300 平台积分已全额退还至发布人账户。',
    acceptedCount: 3,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_ns2_1',
        taskId: 'tsk_my_pub_exp_no_sub_2',
        username: 'CAD拓扑研究员',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-16 11:20:00',
        status: '已接单'
      },
      {
        id: 'tk_ns2_2',
        taskId: 'tsk_my_pub_exp_no_sub_2',
        username: '几何算法老王',
        userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-17 09:40:00',
        status: '已接单'
      },
      {
        id: 'tk_ns2_3',
        taskId: 'tsk_my_pub_exp_no_sub_2',
        username: '图形渲染客',
        userAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-18 15:00:00',
        status: '已接单'
      }
    ],
    submissions: [],
    bounty: 5200,
    bountyUnit: '¥'
  },
  {
    id: 'tsk_my_pub_exp_no_sub_3',
    title: '基于 eBPF 的云原生 K8s 服务间拓扑依赖与流量损耗实时侦测 Agent',
    taskType: '接单任务',
    brief: '零侵入侦测 Pod 间 TCP 往返时延（RTT）、重传率与 HTTP/gRPC 调用链路拓扑',
    domain: '技术开发',
    difficulty: '困难',
    description: `<h3>【项目背景】</h3><p>为了免除业务侧手动注入链路追踪 SDK 的痛点，基于 Linux eBPF 内核探测点实现零代码侵入的服务网格流量拓扑与损耗监控 DaemonSet。</p>`,
    acceptanceCriteria: `<ol><li>Agent 单节点 CPU 占用率 ≤ 1.5%，内存消耗 ≤ 128MB；</li><li>准确采集 L4/L7 协议延迟，并按 10s 粒度聚合推流至 Prometheus；</li><li>包含完整的 Helm Chart 与测试集群部署脚本。</li></ol>`,
    cashReward: 6000,
    pointsReward: 350,
    totalCashReward: 6000,
    totalPointsReward: 350,
    startTime: '2026-07-18 00:00:00',
    endTime: '2026-08-12 23:59:59',
    remainingDays: 0,
    publisher: '极客小千 (你)',
    publisherAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-07-18 10:20:00',
    status: '已结束',
    refunded: true,
    refundCash: 6000,
    refundPoints: 350,
    refundTime: '2026-08-13 00:05:00',
    refundReason: '任务已到期截止，接单开发者在截止日前未能按期提交验收成果。任务托管预付资金 ¥6,000 及 350 积分已全额退还至发布人账户。',
    acceptedCount: 1,
    submittedCount: 0,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_ns3_1',
        taskId: 'tsk_my_pub_exp_no_sub_3',
        username: '内核运维极客',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-07-20 10:15:00',
        status: '已接单'
      }
    ],
    submissions: [],
    bounty: 6000,
    bountyUnit: '¥'
  },


  // =========================================================================
  // 3. 任务大厅公共任务 (Marketplace Public Tasks) - 丰富真实社区生态
  // =========================================================================

  {
    id: 'tsk_102',
    title: '胸部X光影像病灶语义区域多模态识别与标注',
    taskType: '接单任务',
    brief: '对肺结节、肺炎及胸腔积液进行精准多边形标注与质量复核',
    domain: 'AI模型与数据',
    difficulty: '中等',
    description: `<h3>【任务概述与背景】</h3><p>本任务面向智能医疗影像辅助诊断研究，需对 1,000 例高质量胸部高分辨率 X 光数字影像进行精准的病灶语义分割与多边形（Polygon）边界标注。</p>`,
    acceptanceCriteria: `<h3>【成果验收与质量指标】</h3><ol><li>标注重合度（Mean IoU）与专家盲测金标准相比 ≥ 0.88；</li><li>无严重标签混淆或漏标关键大病灶；</li><li>提交的 JSON 100% 通过官方 coco-val 校验。</li></ol>`,
    cashReward: 6500,
    pointsReward: 600,
    totalCashReward: 6500,
    totalPointsReward: 600,
    startTime: '2026-08-10 09:00:00',
    endTime: '2026-09-28 18:00:00',
    remainingDays: 10,
    publisher: '迈瑞数字医疗研究院',
    publisherAvatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-10 09:00:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_102_1',
        taskId: 'tsk_102',
        username: '华西医学图像标注组',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-11 10:00:00',
        status: '已提交',
        submissionId: 'sub_102_1'
      },
      {
        id: 'tk_102_2',
        taskId: 'tsk_102',
        username: '协和AI标研社',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-11 11:30:00',
        status: '已提交',
        submissionId: 'sub_102_2'
      },
      {
        id: 'tk_102_3',
        taskId: 'tsk_102',
        username: '中科院智算组',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-12 14:00:00',
        status: '已接单'
      },
      {
        id: 'tk_102_4',
        taskId: 'tsk_102',
        username: '数字病理实验室',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-13 09:20:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_102_1',
        taskId: 'tsk_102',
        username: '华西医学图像标注组',
        userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-13 14:00:00',
        notes: '已完成 1000 张影像精标，已过内部双盲审查，IoU 达标 91.2%。',
        files: [{ id: 'f_h1', name: 'chest_xray_coco_labels.json', size: '32.4 MB' }],
        status: '待验收'
      },
      {
        id: 'sub_102_2',
        taskId: 'tsk_102',
        username: '协和AI标研社',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-14 11:20:00',
        notes: '完成全量影像精标注与交叉核验，附带病灶热力图预览。',
        files: [{ id: 'f_h2', name: 'medical_xray_annotations_v2.zip', size: '48.8 MB' }],
        status: '待验收'
      }
    ],
    bounty: 6500,
    bountyUnit: '¥'
  },

  {
    id: 'tsk_105',
    title: '为传统制造企业提供 DeepSeek 私有化部署与算力选型咨询',
    taskType: '接单任务',
    brief: '输出定制化算力配置方案、国产算力卡适配评估与成本收益测算报告',
    domain: '咨询与培训',
    difficulty: '困难',
    description: `<h3>【咨询服务背景】</h3><p>某大型重工制造企业准备私有化部署 DeepSeek-R1，需要专家团队为其规划工业园区级智算中心架构与硬件算力采购方案。</p>`,
    acceptanceCriteria: `<h3>【成果交付标准】</h3><ol><li>交付完整详尽的 PPT 汇报方案与 Word 详细技术白皮书；</li><li>包含 3 种不同预算梯度下的详细配置清单与报价精算表；</li><li>提供 1 场 2 小时高管闭门研讨答疑。</li></ol>`,
    cashReward: 18000,
    pointsReward: 1000,
    totalCashReward: 18000,
    totalPointsReward: 1000,
    startTime: '2026-08-15 00:00:00',
    endTime: '2026-09-30 23:59:59',
    remainingDays: 12,
    publisher: '工业智联数字化转型办',
    publisherAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    publishTime: '2026-08-15 16:30:00',
    status: '进行中',
    acceptedCount: 4,
    submittedCount: 2,
    verifiedCount: 0,
    takers: [
      {
        id: 'tk_105_1',
        taskId: 'tsk_105',
        username: '华为云智算咨询团队',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 09:00:00',
        status: '已提交',
        submissionId: 'sub_105_1'
      },
      {
        id: 'tk_105_2',
        taskId: 'tsk_105',
        username: '阿里云混合云架构组',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-16 14:30:00',
        status: '已提交',
        submissionId: 'sub_105_2'
      },
      {
        id: 'tk_105_3',
        taskId: 'tsk_105',
        username: '联想企业级算力实验室',
        userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-17 10:00:00',
        status: '已接单'
      },
      {
        id: 'tk_105_4',
        taskId: 'tsk_105',
        username: '中科曙光算力专家组',
        userAvatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&auto=format&fit=crop&q=80',
        takeTime: '2026-08-18 11:00:00',
        status: '已接单'
      }
    ],
    submissions: [
      {
        id: 'sub_105_1',
        taskId: 'tsk_105',
        username: '华为云智算咨询团队',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-17 18:00:00',
        notes: '交付包含昇腾 910B/C 算力集群部署方案、1,000 并发 TCO 成本对比与 Word 技术白皮书。',
        files: [
          { id: 'f_hw1', name: 'DeepSeek_Private_Deployment_Plan_HuaweiCloud.pdf', size: '14.5 MB' },
          { id: 'f_hw2', name: 'DeepSeek_TCO_Cost_Estimation.xlsx', size: '2.1 MB' }
        ],
        status: '待验收'
      },
      {
        id: 'sub_105_2',
        taskId: 'tsk_105',
        username: '阿里云混合云架构组',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        submitTime: '2026-08-18 09:30:00',
        notes: '交付阿里云专有云敏捷版 DeepSeek-R1 部署架构图及 8 卡 H800 组网实测报告。',
        files: [{ id: 'f_ali1', name: 'DeepSeek_Private_Deployment_Aliyun.pdf', size: '18.2 MB' }],
        status: '待验收'
      }
    ],
    bounty: 18000,
    bountyUnit: '¥'
  }
];
