import { FeedPost } from '../types';

export const mockFeedPosts60ExpandedPart2: FeedPost[] = [
  // ==========================================
  // 2. 求助答疑 (10条)
  // ==========================================
  {
    id: 'pst_qz_01',
    title: '【求助】Llama-3 70B 加载 FlashAttention-2 出现 CUDA OOM 报错求排查',
    author: '林BugHunter',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    authorTag: '研究生',
    content: `## 一、报错背景与运行环境

各位算力工坊的大佬们好！我最近在算力工坊租用了双卡 **NVIDIA A100 (80GB PCIe)** 环境，尝试对 **Meta-Llama-3-70B-Instruct** 进行全序列长文本（目标上下文 32k tokens）微调评估。

### 详细运行环境如下：
- 系统架构：Ubuntu 22.04 LTS
- 基础驱动：CUDA 12.2, Driver 535.129.03
- 核心依赖：PyTorch 2.3.0+cu121, Transformers 4.40.1, Flash-Attn 2.5.8
- 启动命令：\`torchrun --nproc_per_node=2 finetune.py --model_name_or_path /models/Llama-3-70B --use_flash_attention_2 True --max_seq_length 32768\`

---

## 二、具体报错堆栈信息

当数据加载到第 18 个批次，进入反向传播计算梯度时，系统直接崩溃并抛出如下错误：

\`\`\`text
RuntimeError: CUDA out of memory. Tried to allocate 2.40 GiB 
(GPU 1; 79.15 GiB total capacity; 75.80 GiB already allocated; 
850.00 MiB free; 2.50 GiB reserved in PyTorch by allocator)
[rank1]: Traceback (most recent call last):
  File "flash_attn/flash_attn_interface.py", line 428, in _flash_attn_backward
    _flash_attn_backward(dout, q, k, v, out, softmax_lse, dq, dk, dv, ...)
torch.cuda.OutOfMemoryError: CUDA out of memory.
\`\`\`

---

## 三、我已尝试过的排查手段

1. **调整梯度累积步数**：将 \`per_device_train_batch_size\` 已经调小到 1，并将 \`gradient_accumulation_steps\` 增加到了 16，但在长文本送入时依然瞬间 OOM；
2. **启用 Gradient Checkpointing**：开启了梯度检查点 \`model.gradient_checkpointing_enable()\`，虽然首轮省了显存，但在反向传播时显存峰值仍然超出 80GB；
3. **设置显存分配参数**：配置了 \`export PYTORCH_CUDA_ALLOC_CONF=max_split_size_mb:128\`，仍无法缓解。

请问论坛里有哪位大佬成功在 2x A100 上跑通 32k 长度的 70B 吗？是不是必须开启 DeepSpeed ZeRO-3 卸载或者对 sequence 做 Chunk 并行拆分？急求各位给点配置建议，非常感谢！`,
    board: '求助答疑',
    likesCount: 15,
    commentsCount: 24,
    sharesCount: 2,
    viewsCount: 450,
    time: '1小时前',
    tags: ['CUDA', 'OOM', 'Llama3', 'FlashAttention']
  },
  {
    id: 'pst_qz_02',
    title: '【请教】Qwen2.5-Coder 32B 在做 JSON 函数调用时幻觉输出字符串怎么解？',
    author: '郭前端全栈',
    authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    authorTag: '全栈开发者',
    content: `## 一、业务场景与遇到的困扰

各位社区同行好！我们团队正在基于 **Qwen2.5-Coder-32B-Instruct** 开发一款代码审查与自动化重构智能体。该智能体需要分析前端 Git Diff，并通过标准的 Function Calling（工具调用）机制返回结构化的修改点：

\`\`\`json
{
  "file_path": "src/App.tsx",
  "line_start": 45,
  "line_end": 52,
  "issue_type": "PERFORMANCE_LEAK",
  "suggested_patch": "const memoized = useMemo(() => ...);"
}
\`\`\`

---

## 二、模型幻觉复现表现

虽然该模型在日常代码补全测试中表现极其优异（HumanEval 超过 85 分），但在高并发调用工具返回 JSON 时，偶尔会出现令人头疼的**类型漂移与伪结构体幻觉**：

1. **字段格式自作主张变动**：有时模型不返回约定的整型数字，而是返回 \`"line_start": "line 45"\` 或者 \`"line_start": "第45行"\`；
2. **在 JSON 外部追加自然语言唠叨**：在 JSON 字符串后面追加 \`Hope this helps you fix the performance issue!\`，导致后端的快速 JSON 解析器直接报错抛出语法异常；
3. **把布尔值输出为中文**：定义为 boolean 类型的字段，偶尔被输出成了 \`"is_critical": "是"\`。

---

## 三、目前 Prompt 的防范措施与诉求

我已经在 System Prompt 中写了非常严苛的红线约束：
\`\`\`text
You must strictly return valid JSON that conforms to the schema. 
Do not include any markdown format, explanations, or leading/trailing text.
\`\`\`
但每天几十万次 API 调用中依然有约 3% ~ 5% 的概率出现上述畸形数据，直接打挂了后端工作流。

想向大家请教：
- 业内目前更推荐使用 **Outlines / Guided Decoding** 语法约束，还是使用 **Instructor + Zod/Pydantic 重试机制**？
- 在 vLLM 服务端是否可以通过设置 \`--guided-decoding-backend outlines\` 彻底根治该问题？求踩过坑的架构师指点迷津！`,
    board: '求助答疑',
    likesCount: 22,
    commentsCount: 19,
    sharesCount: 5,
    viewsCount: 680,
    time: '3小时前',
    tags: ['Qwen', 'FunctionCalling', 'JSONSchema', '结构化输出']
  },
  {
    id: 'pst_qz_03',
    title: '【问答】RAG 向量数据库 Chunk 切分颗粒度设置多少检索召回率最高？',
    author: '王算法小白',
    authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    authorTag: '初级算法工程师',
    content: `## 一、背景与实验迷茫

最近正在为公司的企业内网知识库（主要是产品说明书、IT 故障排查知识库、HR 人事问答）构建 RAG 向量检索系统，选用的向量模型是 **bge-large-zh-v1.5**，底座数据库是 Milvus。

但在文本预处理切分阶段，团队内部对 **Chunk Size（分块大小）与 Overlap（重叠滑动窗口）** 的设定产生了非常大的分歧：

---

## 二、当前两种不同观点的激烈讨论

- **观点派别 A（主张小块：200 ~ 300 Tokens）**：
  - 理由：Embedding 向量对于短文本的信息压缩效率最高，语义聚集度好，余弦相似度计算更精准；
  - 弊端：段落经常被生硬切断，一旦一个故障排查步骤跨越了两个切片，召回其中一块时严重缺乏上下文前提。

- **观点派别 B（主张大块：1000 ~ 1500 Tokens）**：
  - 理由：上下文信息完整，大模型阅读时不至于断章取义；
  - 弊端：单个块中杂糅了太多的无关冗余信息，导致整个向量被“稀释”，针对精准小知识点的 Top-K 检索召回率大幅下滑。

---

## 三、想向社区各位前辈请教的实战问题

1. 针对中文技术说明书与 FAQ 问答混杂的语料库，大家生产线上验证出的**黄金分块尺寸**一般是多少？
2. 是否有必要引入 **Parent-Child Document 机制（即用小 Chunk 做索引召回，召回后向大模型提交对应的大 Parent Chunk）**？
3. Overlap 比例通常设置在多少既能防止上下文边界断裂，又不会过多浪费向量存储与计算开销？欢迎大家分享自己的调优经验和测试数据！`,
    board: '求助答疑',
    likesCount: 38,
    commentsCount: 31,
    sharesCount: 7,
    viewsCount: 890,
    time: '6小时前',
    tags: ['RAG', 'Chunk切分', '向量数据库', '召回率']
  },
  {
    id: 'pst_qz_04',
    title: '【求助】vLLM 连续批处理在 Docker 容器中高并发请求超时断连',
    author: '刘运维工程师',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    authorTag: 'SRE运维专家',
    content: `## 一、生产事故现场还原

我们团队最近使用 Docker 容器化打包了 **vLLM (v0.6.2)** 推理镜像，运行模型为 **Qwen2.5-72B-Instruct-GPTQ-Int4**，部署在 4 张 A10 24GB 机器上。

在单用户压测时接口表现非常完美（TTFT 280ms，吞吐量 45 tokens/s）。然而今天下午业务方将客户端流量切换过来，并发请求瞬间上升到 **120 QPS** 时，容器服务突然出现了灾难性的超时崩溃：

1. 前端大量报错 \`504 Gateway Timeout\` 与 \`Client disconnected\`；
2. 容器内部的 Python 进程并未挂掉，但 GPU 利用率出现剧烈的锯齿状断崖（从 95% 突然骤降到 0% 卡死数秒）；
3. 后台日志出现大量 \`Engine is busy, request has been waiting in queue for 15000ms\` 告警。

---

## 二、当前 Docker 启动参数与配置

\`\`\`yaml
services:
  vllm-engine:
    image: vllm/vllm-openai:v0.6.2
    command: >
      --model /models/Qwen2.5-72B-GPTQ
      --tensor-parallel-size 4
      --gpu-memory-utilization 0.95
      --max-num-batched-tokens 4096
      --max-num-seqs 256
      --port 8000
    ipc: host
    deploy:
      resources:
        reservations:
          devices:
            - driver: nvidia
              count: 4
              capabilities: [gpu]
\`\`\`

---

## 三、请教各位排查思路

- 是否因为 \`--gpu-memory-utilization 0.95\` 设得过高，导致 KV Cache 占满后触发了系统级交换或死锁？
- \`--max-num-seqs\` 设为 256 是否超出了 A10 显卡在 GPTQ 下的批处理并发上限？
- 在面对突发流量洪峰时，应该如何在 vLLM 前方配置 Nginx 或 Envoy 的限流排队缓冲区以保护推理引擎？急盼各位资深高并发架构师指点！`,
    board: '求助答疑',
    likesCount: 19,
    commentsCount: 22,
    sharesCount: 4,
    viewsCount: 520,
    time: '8小时前',
    tags: ['vLLM', 'Docker', '高并发', '超时排查']
  },
  {
    id: 'pst_qz_05',
    title: '【疑问】医疗数据集微调 LoRA 模组时，Rank (r) 设 16 还是 64 效果好？',
    author: '赵医药AI研究员',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=100&auto=format&fit=crop&q=80',
    authorTag: '医学博士',
    content: `## 一、实验背景与研究目标

我们正在使用经过权威三甲医院专家脱敏审核的 5 万条临床病历与诊疗指南数据，基于开源底座模型微调一个面向罕见病鉴别与用药禁忌推荐的垂直大模型。

在应用低秩自适应（LoRA / QLoRA）微调时，关于超参数 **Rank ($r$) 和 Scaling Factor ($\\alpha$)** 的取值，学术界和开源社区存在截然不同的实践观点：

---

## 二、我们的顾虑与困惑

1. **若设置较小（如 $r=8$ 或 $r=16$）**：
   - 优势：可训练参数量极少（仅占模型总参数的 0.1% 左右），训练速度极快，防过拟合能力强；
   - 隐患：医学领域专业术语极其庞杂、逻辑因果链条紧密，低阶矩阵是否缺乏足够的参数容量来编码这些高密度的全新专业知识？

2. **若设置较大（如 $r=64$ 或 $r=128$）**：
   - 优势：模型表达能力更强，能吸收更复杂的长尾知识分布；
   - 隐患：在小样本数据集上极其容易造成严重灾难性遗忘（Catastrophic Forgetting），丧失底座原有的通识推理能力，且显存开销翻倍。

---

## 三、请教业内同行

想请问在金融、医疗、法律等强专业壁垒垂直行业做 LoRA 微调的同仁们：
- 你们在生产环境最终收敛的 $r$ 与 $\\alpha$ 分别是多少？
- 是否建议只微调注意力层（\`q_proj, v_proj\`），还是将 MLP 门控层（\`gate_proj, up_proj, down_proj\`）全量开启？
非常期待听到各位的宝贵意见与评测实验心得！`,
    board: '求助答疑',
    likesCount: 29,
    commentsCount: 18,
    sharesCount: 3,
    viewsCount: 610,
    time: '12小时前',
    tags: ['LoRA', '模型微调', '医疗AI', '超参数调优']
  },
  {
    id: 'pst_qz_06',
    title: '【求助】LangGraph 状态持久化 Checkpoint 写入 PostgreSQL 报错',
    author: '陈后端小哥',
    authorAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&auto=format&fit=crop&q=80',
    authorTag: '全栈开发',
    content: `## 一、技术栈与业务目标

我们正在使用 **LangGraph (Python 0.2+)** 构建一个具备人机协同（Human-in-the-loop）审批功能的企业级采购审批 Agent。

根据设计，当采购金额超过 10 万元时，Agent 工作流需要自动中断挂起，将当前执行的会话状态通过 **PostgresSaver** 完整持久化写入 PostgreSQL 数据库的 Checkpoint 游标表中，等待部门主管在 Web 前端点击审批同意后唤醒继续往下执行。

---

## 二、报错现象与堆栈信息

在单轮简单执行时一切正常，但只要工作流中传递了较为复杂的多轮历史消息列表（包含 ToolMessage 和自定义状态对象），就会偶发抛出如下序列化失败报错：

\`\`\`text
TypeError: Object of type CustomToolResult is not JSON serializable
  File "langgraph/checkpoint/postgres/__init__.py", line 184, in put
    cursor.execute(INSERT_QUERY, (thread_id, checkpoint_id, json.dumps(checkpoint)))
psycopg2.errors.UndefinedTable: relation "checkpoints" does not exist
\`\`\`

---

## 三、排查中的具体疑点

1. **内置表结构初始化问题**：官方文档中提到 \`with PostgresSaver.from_conn_string(DB_URI) as checkpointer: checkpointer.setup()\`，但我们在微服务多实例热重载启动时，经常报错提示表锁冲突或表不存在；
2. **非基础数据类型的序列化**：当 State 中包含了不可序列化的对象时，LangGraph 默认的序列化器该如何优雅注册自定义 Encoder 插件？

恳请对 LangGraph 底层原理有深入研究的架构师指点一下避坑指南，非常感谢！`,
    board: '求助答疑',
    likesCount: 17,
    commentsCount: 15,
    sharesCount: 1,
    viewsCount: 430,
    time: '1天前',
    tags: ['LangGraph', 'PostgreSQL', 'Checkpoint', '状态持久化']
  },
  {
    id: 'pst_qz_07',
    title: '【请教】DeepSeek-R1 CoT 思维链推导在 8k 阶段被截断如何设置 MaxTokens？',
    author: '孙研一学生',
    authorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    authorTag: 'AI方向研究生',
    content: `## 一、遇到的问题现象

大家好！我正在做关于 **DeepSeek-R1** 在复杂几何数学证明题（AIME 竞赛集）上的自动化推理解析研究。

使用官方 API 或者本地部署的推理接口时，经常遇到一个尴尬的现象：DeepSeek-R1 在 \`<think>\` 标签内进行严密的自我审视、逻辑回溯和假设推演时，由于问题极其复杂，思维链往往洋洋洒洒写了超过 7,000 个 tokens。

结果在即将给出最终结论时，突然返回了 \`finish_reason: "length"\`！最终的正式回答甚至还没来得及写出答案就生生被截断了，导致这道题被判定为 0 分。

---

## 二、当前调用参数配置

\`\`\`python
client = OpenAI(api_key="...", base_url="...")

response = client.chat.completions.create(
    model="deepseek-reasoner",
    messages=[{"role": "user", "content": math_problem_prompt}],
    max_tokens=8192,
    temperature=0.6
)
\`\`\`

---

## 三、请教各位解决思路

1. \`max_tokens\` 是指**输出的总长度（包含思考过程 + 最终结论）**，当思考过程占满 8192 时，模型根本没有剩余空间输出正文。请问大家是如何合理配置或通过上下文断点接续（Continuation / Stream resume）让模型接着写出答案的？
2. 是否有提示词工程可以引导模型“在 3000 tokens 内精简思维链，迅速输出结论”，同时又不损伤其深度推理的正确率？求大佬赐教！`,
    board: '求助答疑',
    likesCount: 34,
    commentsCount: 26,
    sharesCount: 6,
    viewsCount: 790,
    time: '1天前',
    tags: ['DeepSeek', 'CoT', '思维链', 'MaxTokens']
  },
  {
    id: 'pst_qz_08',
    title: '【问答】HuggingFace Transformers 管道多 GPU 并行卡主死锁问题',
    author: '钱全栈算法',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&auto=format&fit=crop&q=80',
    authorTag: '算法工程师',
    content: `## 一、问题背景与死锁现象

各位极客好，我最近在本地多卡服务器（4x RTX 4090）上使用 HuggingFace 的 \`pipeline\` 批量对 20 万篇新闻语料做实体抽取与摘要提取。

使用 \`device_map="auto"\` 加载模型，并使用 Python 的 \`multiprocessing\` 或多线程同时向 pipeline 推送批处理数据时，程序运行了约 10 分钟后，所有 GPU 的显存占用均停留在 80%，但**GPU-Util 全部掉到 0%**，整个进程陷入永久死锁阻塞，不报错也不退出了！

---

## 二、最小复现代码片段

\`\`\`python
from transformers import pipeline
import torch

# 自动多卡切分加载
pipe = pipeline(
    "text-generation",
    model="/models/Qwen2.5-14B",
    device_map="auto",
    torch_dtype=torch.float16
)

# 多线程或并发调用
from concurrent.futures import ThreadPoolExecutor

def worker(text):
    return pipe(text, max_new_tokens=128)

with ThreadPoolExecutor(max_workers=8) as executor:
    results = list(executor.map(worker, dataset[:1000]))
\`\`\`

---

## 三、排查疑点与求助

- 官方文档说 \`device_map="auto"\` 是基于 Accelerate 的 Hooks 实现的，是不是在多线程环境下底层的 CUDA Stream 锁发生了竞态冲突？
- 批量离线吞吐任务，大家是推荐改用单卡多进程（每个进程绑定一个单独的 CUDA 独立卡），还是改用 vLLM 离线推理引擎（\`LLM.generate()\`）？
有遇到过类似多卡死锁问题的大佬请指点一下正确姿势，谢谢！`,
    board: '求助答疑',
    likesCount: 16,
    commentsCount: 13,
    sharesCount: 2,
    viewsCount: 380,
    time: '2天前',
    tags: ['Transformers', '多卡并行', 'CUDA死锁', 'HuggingFace']
  },
  {
    id: 'pst_qz_09',
    title: '【求助】Gradio 部署在 Cloud Run 容器中 WebSocket 连接频繁掉线',
    author: '周云计算迷',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    authorTag: '云计算爱好者',
    content: `## 一、架构架构与故障现象

为了向客户快速展示我们的 AI 生图原型，我把一个基于 **Gradio 4.x** 开发的 Web 界面打包成了 Docker 镜像，并部署到了云厂商的无服务器托管平台（类似 Google Cloud Run / 阿里云函数计算容器版）。

在本地测试时流式输出体验丝滑流畅，但在生产线上，用户只要输入稍长的 Prompt，模型生成耗时超过 30 秒，前端页面就会突然弹窗报错：
\`\`\`text
Connection errored out. The WebSocket connection was closed unexpectedly.
\`\`\`
用户辛苦填写的参数全部被清空重置，体验极差。

---

## 二、配置排查与尝试

1. **检查容器超时设置**：已经将云平台服务的 Request Timeout 延长到了 600 秒；
2. **Gradio 启动配置**：
   \`\`\`python
   demo.queue(max_size=32).launch(
       server_name="0.0.0.0",
       server_port=7860,
       show_error=True
   )
   \`\`\`
3. 发现云网关前置负载均衡器（Load Balancer）在 30 秒内如果未收到心跳帧包，会自动主动切断空闲 TCP 连接。

请问各位在容器云上部署 Gradio 时，是如何保持 WebSocket 持续保活心跳的？或者有哪些替代方案（如 FastAPI + Server-Sent Events）更加稳定可靠？`,
    board: '求助答疑',
    likesCount: 12,
    commentsCount: 11,
    sharesCount: 1,
    viewsCount: 340,
    time: '2天前',
    tags: ['Gradio', 'WebSocket', 'CloudRun', '流式传输']
  },
  {
    id: 'pst_qz_10',
    title: '【求助】双卡 RTX 4090 开启 Tensor Parallelism 报错 NVLink 缺失',
    author: '吴硬件极客',
    authorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    authorTag: '硬件玩家',
    content: `## 一、硬件配置与组网背景

我自己在机架服务器上组装了双卡 **NVIDIA GeForce RTX 4090 (24GB x 2)**，主板是华硕 Pro WS W790，支持双 PCIe 4.0 x16 全速插槽。

众所周知，从 40 系列消费级显卡开始，NVIDIA 物理移除了 NVLink 桥接金手指。因此两张显卡之间的全部通信必须走主板 PCIe 总线。

---

## 二、报错信息与现象

当我在 vLLM 或者 SGLang 中配置 \`--tensor-parallel-size 2\` 启动 70B 模型时，服务直接抛出 NCCL 通信故障并退出：

\`\`\`text
[NCCL WARN] NVLink is not supported on this device. Falling back to PCIe.
RuntimeError: NCCL error in: /pytorch/torch/csrc/cuda/nccl.cpp:68, unhandled system error
NCCL failure: network failure / system error
\`\`\`

哪怕通过设置 \`export NCCL_P2P_DISABLE=1\` 强制禁用 P2P 绕过了启动崩溃，后续的实际推理吞吐量也慢得像老牛拉破车（从单卡的 40 t/s 暴跌到了只有 4.2 t/s），PCIe 总线利用率几乎打爆。

---

## 三、请教各位双卡 4090 最优解

- 在没有物理 NVLink 的双卡 4090 上，是否**完全不应该使用 Tensor Parallelism（张量并行）**？
- 应该如何配置 **Pipeline Parallelism（流水线并行）** 或者分层卸载架构，才能让两张 4090 达到最佳的吞吐利用率？求硬件老鸟不吝赐教！`,
    board: '求助答疑',
    likesCount: 25,
    commentsCount: 20,
    sharesCount: 4,
    viewsCount: 560,
    time: '3天前',
    tags: ['RTX4090', 'NVLink', 'TensorParallel', 'NCCL']
  }
];
