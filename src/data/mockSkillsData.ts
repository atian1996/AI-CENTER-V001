import { SkillPluginItem } from '../types';

export const mockSkillPlugins: SkillPluginItem[] = [
  // 1. 股票价值投资分析系统 (图2/图3/图4中的核心示例)
  {
    id: 'sk_valuation_analysis',
    name: '股票价值投资分析系统',
    repoPath: '@user_a38fd8a2/valuation-analysis',
    category: '行业专业',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.3,
    aiRatingDesc: '4.3 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 175,
    hasVoted: false,
    developer: '弗兰克斯基 (Franski)',
    authorSignature: '弗兰克斯基 (Franski)',
    developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    version: 'v1.0.0',
    updatedAt: '4个月前更新',
    relativeTime: '4个月前',
    installs: 33000,
    downloadsCount: 33000,
    viewsCount: 98000,
    likesCount: 175,
    favoritesCount: 175,
    isLiked: false,
    isFavorite: false,
    description: 'A股和港股价值投资分析系统。基于价值投资经典方法论，提供完整的投资分析框架：护城河分析、财务健康检查、DCF估值、管理层评估、行业分析、投资决策整合。适用于以下场景：(1) 全面分析股票投资价值，(2) 评估经济护城河与竞争优势，(3) 评估财务健康与会计质量，(4) 使用DCF模型计算内在价值，(5) 评估管理层质量，(6) 分析行业结构与动态，(7) 整合做出投资决策。',
    license: '知识产权保护 / 个人学习开源',
    compatibleAgents: '金融分析 Agent / 投研助手 / 报告撰写 Agent',
    runtimeEnv: 'Python 3.10+ / Markdown 框架',
    packageFormat: 'ZIP / Skill 包',
    packageSize: '2.8 MB',
    requiredPermissions: ['只读运行', '无特殊外联网络权限'],
    tags: ['行业专业', '金融分析', '行业研究', '4个月前更新', 'v1.0.0'],
    copyrightNotice: '本技能及相关文档、脚本代码的著作权归弗兰克斯基（Franski）所有。',
    licenseTerms: {
      allowed: [
        '允许个人学习、研究、非商业用途使用',
        '允许修改后个人使用'
      ],
      forbidden: [
        '禁止直接复制核心算法用于商业产品或竞争性服务',
        '禁止移除或修改作者署名后重新分发',
        '禁止将本技能包装成独立产品对外销售'
      ]
    },
    disclaimer: '本技能提供的分析结果仅供参考，不构成投资建议。使用者应自行判断并承担投资风险。',
    authorBio: '基于《股市真规则》（The Five Rules for Successful Stock Investing）的完整投资分析框架，由晨星公司首席股票分析师帕特·多尔西(Pat Dorsey)方法论构建。\n作者：弗兰克斯基（Franski）',
    dependencies: [
      {
        name: 'pdf-parser',
        purpose: '提取财报PDF中的财务数据',
        installCmd: 'clawhub install pdf-parser'
      }
    ],
    systemArchAscii: `+-------------------------------------------------------------------------+
|                           投资决策整合框架                                |
|                 modules/investment_decision_framework.md                |
+-------------------------------------------------------------------------+
                                     |
    +--------------------------------+--------------------------------+
    |                                |                                |
    v                                v                                v
+------------------+     +------------------+     +------------------+
|    护城河分析    |     |     财务分析     |     |    管理层评估    |
|       模块       |     |       模块       |     |       模块       |
|      (Moat)      |     |    (Financial)   |     |   (Management)   |
+------------------+     +------------------+     +------------------+
                                     |
                                     v
                         +----------------------+
                         |       行业分析       |
                         |         模块         |
                         |      (Industry)      |
                         +----------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                              工具层 (Tools)                             |
|  - DCF计算器        - 估值快照           - 同业对比                     |
|  - Watchlist管理    - 财务健康检查       - 护城河检查清单               |
+-------------------------------------------------------------------------+`,
    coreModules: [
      {
        name: '护城河分析',
        functionDesc: '五步检验法识别可持续竞争优势',
        docPath: 'modules/moat_analysis.md'
      },
      {
        name: '财务分析',
        functionDesc: '六步财务健康检查与会计质量评估',
        docPath: 'modules/financial_analysis.md'
      },
      {
        name: '管理层评估',
        functionDesc: '三维评估框架（能力/诚信/股东导向）',
        docPath: 'modules/management_evaluation.md'
      },
      {
        name: '行业分析',
        functionDesc: '生命周期定位与行业特定指标',
        docPath: 'modules/industry_analysis.md'
      },
      {
        name: '投资决策整合',
        functionDesc: '多维加权打分与投资建议评级矩阵',
        docPath: 'modules/investment_decision.md'
      }
    ],
    backgroundDesc: '股票价值投资分析系统专为长期持有、商业模式优先、估值合理的投资风格设计，融合了晨星护城河评级理论、经典DCF折现现金流模型与杜邦财务健康分析。',
    featuresDesc: [
      '护城河五步评定：无形资产、转换成本、网络效应、成本优势、规模效应',
      '财务透视：自由现金流质量、资产负债率、ROIC资本回报率及应收账款异动诊断',
      '估值矩阵：三阶段DCF自由现金流折现模型、敏感度分析及安全边际折价计算',
      '全自动化生成 Markdown 与 PDF 研报，支持一键导出与二次编辑'
    ],
    toolDefinitionSchema: `{
  "name": "analyze_stock_valuation",
  "description": "基于价值投资框架对指定 A 股/港股标的执行护城河、财务健康度、管理层治理与 DCF 估值全面分析",
  "parameters": {
    "type": "object",
    "properties": {
      "ticker": {
        "type": "string",
        "description": "股票代码，如 600519.SH (贵州茅台) 或 00700.HK (腾讯控股)"
      },
      "analysis_depth": {
        "type": "string",
        "enum": ["quick_snapshot", "comprehensive_report", "dcf_only"],
        "default": "comprehensive_report",
        "description": "研报分析深度"
      },
      "discount_rate": {
        "type": "number",
        "default": 0.09,
        "description": "DCF折现率 (WACC)，默认 9%"
      },
      "margin_of_safety": {
        "type": "number",
        "default": 0.25,
        "description": "安全边际折价比例，默认 25%"
      }
    },
    "required": ["ticker"]
  }
}`,
    pythonDecoratorCode: `from qianji_agent.skills import tool
from typing import Dict, Any

@tool(
    name="analyze_stock_valuation",
    description="对指定的上市企业执行基本面与价值投资估值分析",
    permissions=["read_only"]
)
def analyze_stock_valuation(ticker: str, analysis_depth: str = "comprehensive_report", discount_rate: float = 0.09) -> Dict[str, Any]:
    """
    Args:
        ticker: 股票代码 (例如: 600519.SH)
        analysis_depth: 分析深度
        discount_rate: 折现率 WACC
    """
    from scripts.dcf_calculator import calculate_intrinsic_value
    from scripts.financial_health_check import run_financial_audit
    
    audit_res = run_financial_audit(ticker)
    valuation_res = calculate_intrinsic_value(ticker, discount_rate=discount_rate)
    
    return {
        "ticker": ticker,
        "moat_rating": "Wide (宽护城河)",
        "financial_health_score": audit_res.get("score", 92),
        "intrinsic_value": valuation_res.get("fair_value", 1850.0),
        "margin_of_safety_price": valuation_res.get("buy_price", 1387.5),
        "investment_decision": "Strong Buy (强烈买入建议)"
    }`,
    agentIntegrationCode: `# 挂载价值投资 Skill 插件到智能投研 Agent
from qianji_agent import Agent
from skills.valuation_analysis import analyze_stock_valuation

investment_agent = Agent(
    name="晨星投研分析师 Agent",
    model="deepseek-r1",
    system_prompt="你是一位恪守价值投资原则的专业证券分析师。请使用帕特·多尔西护城河理论结合 DCF 模型客观评估企业内在价值与安全边际。",
    tools=[analyze_stock_valuation]
)

report = investment_agent.run("请对贵州茅台 (600519.SH) 进行详细的护城河评估与 DCF 估值测算")
print(report.content)`,
    files: [
      {
        id: 'f_val_modules',
        name: 'modules',
        path: '/modules',
        size: '12.4 KB',
        type: 'folder',
        children: [
          {
            id: 'f_val_m1',
            name: 'moat_analysis.md',
            path: '/modules/moat_analysis.md',
            size: '3.2 KB',
            type: 'file',
            language: 'markdown',
            content: `# 经济护城河分析模块 (Economic Moat Analysis)

## 1. 核心理论
基于帕特·多尔西《股市真规则》，企业的经济护城河分为五大类：

### 1.1 无形资产 (Intangible Assets)
- 强大品牌知名度与定价权溢价
- 行业壁垒极高的专利技术与研发积累
- 稀缺法定经营特许牌照（如烟草、电力网、特定金融特许）

### 1.2 客户转换成本 (Switching Costs)
- 深度嵌入工作流的软件与业务系统（如 ERP / 数据库）
- 高昂的员工培训与数据迁移隐性成本

### 1.3 网络效应 (Network Effect)
- 随着接入节点增加，网络对现有用户的效用呈指数级跃升（如即时通讯、交易电商平台）

### 1.4 成本优势 (Cost Advantages)
- 廉价流程与全球化制造供应链
- 得天独厚的地理区位与低成本原材料

### 1.5 规模效应 (Efficient Scale)
- 市场容量有限但沉没资本巨大的自然垄断领域（如管道运输、机场枢纽）

## 2. 评级标准
- **Wide Moat (宽护城河)**：预计可持续 20 年以上超额资本回报率 (ROIC > WACC)。
- **Narrow Moat (窄护城河)**：预计可持续 10 年超额回报。
- **None (无护城河)**：同质化竞争，资本回报率迅速趋近行业平均资金成本。`
          },
          {
            id: 'f_val_m2',
            name: 'financial_analysis.md',
            path: '/modules/financial_analysis.md',
            size: '2.8 KB',
            type: 'file',
            language: 'markdown',
            content: `# 财务健康检查与会计质量评估模块

## 核心指标诊断清单
1. **ROIC (资本回报率)**：连续 5 年 > 15%，验证竞争优势真实性。
2. **自由现金流 / 净利润**：比值 > 80%，防范虚假账面利润。
3. **资产负债率与有息负债比**：抗经济周期波动与加息冲击的能力。
4. **应收账款周转天数**：评估下游客户拖欠与坏账暴露风险。
5. **毛利率与净利率趋势**：是否存在降价促销或原材料涨价侵蚀。`
          },
          {
            id: 'f_val_m3',
            name: 'management_evaluation.md',
            path: '/modules/management_evaluation.md',
            size: '2.1 KB',
            type: 'file',
            language: 'markdown',
            content: `# 管理层评估模块 (Management Evaluation)

## 三维评估框架
- **专业能力 (Capability)**：资本配置效率、过往战略执行力与抗逆周期魄力。
- **诚实守信 (Integrity)**：信息披露透明度、关联交易合理性与财报保守度。
- **股东导向 (Shareholder Orientation)**：长期分红派息记录、管理层薪酬与长期ROE挂钩机制。`
          },
          {
            id: 'f_val_m4',
            name: 'industry_analysis.md',
            path: '/modules/industry_analysis.md',
            size: '2.4 KB',
            type: 'file',
            language: 'markdown',
            content: `# 行业分析模块 (Industry Analysis)

## 波特五力与生命周期模型
- 行业进入门槛与潜在颠覆者威胁
- 供应商与下游大客户的议价博弈
- 替代品威胁与技术范式转移风险
- 存量市场竞争烈度与产能出清节奏`
          },
          {
            id: 'f_val_m5',
            name: 'investment_decision.md',
            path: '/modules/investment_decision.md',
            size: '1.9 KB',
            type: 'file',
            language: 'markdown',
            content: `# 投资决策整合框架

## 综合决策矩阵
| 护城河评级 | 财务健康 | 估值与现价折扣 | 投资评级建议 |
| :--- | :--- | :--- | :--- |
| Wide (宽) | 优良 (A) | 现价 < 内在价值 x 75% | **强烈买入 (Strong Buy)** |
| Narrow (窄) | 良好 (B) | 现价 ≈ 内在价值 | **谨慎持有 (Hold)** |
| None (无) | 较弱 (C) | 现价 > 内在价值 | **卖出 / 规避 (Sell)** |`
          }
        ]
      },
      {
        id: 'f_val_references',
        name: 'references',
        path: '/references',
        size: '5.6 KB',
        type: 'folder',
        children: [
          {
            id: 'f_val_r1',
            name: 'dcf_model_guide.md',
            path: '/references/dcf_model_guide.md',
            size: '3.1 KB',
            type: 'file',
            language: 'markdown',
            content: `# DCF 折现现金流估值模型操作指南

## 模型公式
$$PV = \\sum_{t=1}^{n} \\frac{FCF_t}{(1 + WACC)^t} + \\frac{Terminal Value}{(1 + WACC)^n}$$

### 参数假设准则
- 永续增长率 $g$ 一般设定在 2% ~ 3% 之间（不应超过长期 GDP 增速）。
- 折现率 WACC 建议在 8% ~ 11% 之间进行敏感性测试。`
          },
          {
            id: 'f_val_r2',
            name: 'ratio_benchmarks.json',
            path: '/references/ratio_benchmarks.json',
            size: '2.5 KB',
            type: 'file',
            language: 'json',
            content: `{
  "industries": {
    "consumer_staples": {
      "benchmark_roic": 0.18,
      "benchmark_gross_margin": 0.45,
      "safe_debt_ratio": 0.40
    },
    "technology_software": {
      "benchmark_roic": 0.22,
      "benchmark_gross_margin": 0.65,
      "safe_debt_ratio": 0.30
    },
    "advanced_manufacturing": {
      "benchmark_roic": 0.12,
      "benchmark_gross_margin": 0.28,
      "safe_debt_ratio": 0.55
    }
  }
}`
          }
        ]
      },
      {
        id: 'f_val_scripts',
        name: 'scripts',
        path: '/scripts',
        size: '8.3 KB',
        type: 'folder',
        children: [
          {
            id: 'f_val_s1',
            name: 'dcf_calculator.py',
            path: '/scripts/dcf_calculator.py',
            size: '3.4 KB',
            type: 'file',
            language: 'python',
            content: `"""
DCF Discounted Cash Flow Valuation Calculator
"""
from typing import Dict, Any, List

def calculate_intrinsic_value(
    ticker: str,
    base_fcf: float = 100.0,
    growth_stage1: float = 0.12,
    years_stage1: int = 5,
    growth_stage2: float = 0.06,
    years_stage2: int = 5,
    perpetual_growth: float = 0.025,
    discount_rate: float = 0.09
) -> Dict[str, Any]:
    """计算 DCF 企业内在价值与每股合理买入价"""
    pv_fcf = 0.0
    current_fcf = base_fcf
    
    # 阶段 1: 高速成长期
    for t in range(1, years_stage1 + 1):
        current_fcf *= (1 + growth_stage1)
        pv_fcf += current_fcf / ((1 + discount_rate) ** t)
        
    # 阶段 2: 稳健过渡期
    for t in range(years_stage1 + 1, years_stage1 + years_stage2 + 1):
        current_fcf *= (1 + growth_stage2)
        pv_fcf += current_fcf / ((1 + discount_rate) ** t)
        
    # 阶段 3: 永续年金价值 (Terminal Value)
    terminal_fcf = current_fcf * (1 + perpetual_growth)
    terminal_value = terminal_fcf / (discount_rate - perpetual_growth)
    pv_terminal_value = terminal_value / ((1 + discount_rate) ** (years_stage1 + years_stage2))
    
    enterprise_value = pv_fcf + pv_terminal_value
    fair_value = round(enterprise_value, 2)
    buy_price_with_mos = round(fair_value * 0.75, 2)
    
    return {
        "ticker": ticker,
        "pv_explicit_cashflow": round(pv_fcf, 2),
        "pv_terminal_value": round(pv_terminal_value, 2),
        "fair_value": fair_value,
        "buy_price_25pct_mos": buy_price_with_mos
    }
`
          },
          {
            id: 'f_val_s2',
            name: 'financial_health_check.py',
            path: '/scripts/financial_health_check.py',
            size: '2.6 KB',
            type: 'file',
            language: 'python',
            content: `"""
Financial Health & Quality Check
"""
def run_financial_audit(ticker: str) -> dict:
    return {
        "ticker": ticker,
        "score": 94,
        "roic_5yr_avg": 0.284,
        "fcf_conversion_ratio": 0.98,
        "debt_to_equity": 0.18,
        "audit_opinion": "Unqualified (标准无保留意见，财务极度健康)"
    }
`
          },
          {
            id: 'f_val_s3',
            name: 'moat_scorer.py',
            path: '/scripts/moat_scorer.py',
            size: '2.3 KB',
            type: 'file',
            language: 'python',
            content: `"""
Economic Moat Rating Scorer
"""
def score_economic_moat(brand_power: int, switching_cost: int, network_effect: int, cost_advantage: int) -> str:
    total = brand_power + switching_cost + network_effect + cost_advantage
    if total >= 30:
        return "Wide Moat (宽护城河)"
    elif total >= 18:
        return "Narrow Moat (窄护城河)"
    return "None (无明显护城河)"
`
          }
        ]
      },
      {
        id: 'f_val_readme',
        name: 'README.md',
        path: '/README.md',
        size: '4.3 KB',
        type: 'file',
        language: 'markdown',
        content: `# 股票价值投资分析系统 (valuation-analysis)
A股和港股价值投资分析系统。基于价值投资经典方法论构建。

## 适用场景
1. 全面分析股票投资价值
2. 评估经济护城河与竞争优势
3. 评估财务健康与会计质量
4. 使用DCF模型计算内在价值
5. 评估管理层质量与公司治理
6. 分析行业结构与生命周期动态
7. 整合做出买入/持有/卖出决策

## 快速上手
\`\`\`bash
# 安装依赖
pip install -r requirements.txt

# 运行 DCF 快速计算
python scripts/dcf_calculator.py
\`\`\`
`
      },
      {
        id: 'f_val_req',
        name: 'requirements.txt',
        path: '/requirements.txt',
        size: '387 B',
        type: 'file',
        language: 'text',
        content: `numpy>=1.24.0
pandas>=2.0.0
scipy>=1.10.0
pydantic>=2.0.0
requests>=2.31.0
rich>=13.0.0
`
      },
      {
        id: 'f_val_skill_md',
        name: 'SKILL.md',
        path: '/SKILL.md',
        size: '22.5 KB',
        type: 'file',
        language: 'markdown',
        content: `---
name: valuation-analysis
description: 股票价值投资分析系统。基于价值投资经典方法论提供护城河分析、财务健康检查、DCF估值及投资决策整合。
version: 1.0.0
author: Franski
license: Proprietary / Educational Open Source
tags:
  - 价值投资
  - DCF估值
  - 护城河分析
  - 财报健康
---

# 股票价值投资分析系统 (Valuation Analysis System)

## 1. 架构总览
本 Skill 遵循自上而下与自下而上相结合的价值投资框架：
- **第一步：护城河初筛** (无形资产/转换成本/网络效应/成本优势/规模效应)
- **第二步：财务体检** (ROIC/自由现金流质量/资产负债结构)
- **第三步：管理层画像** (资本配置/诚信记录/股权激励)
- **第四步：量化 DCF 估值** (保守增长率/折现率设定/安全边际折价)
- **第五步：投资备忘录生成** (清晰的买入/观望/卖出评级)

## 2. 核心调用示例
请在 Agent 提示词或工具列表中挂载 \`analyze_stock_valuation\` 函数。
`
      }
    ],
    comments: [
      {
        id: 'c_val_1',
        userName: '量化研报老兵',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        userRole: '持牌证券投顾',
        rating: 5,
        time: '3天前',
        content: '非常扎实的价值投资方法论框架！护城河五步检验法与 DCF 的结合逻辑很顺畅，生成的研究报告可读性极高。建议后续可以接入实时行情数据源做动态折现。',
        likes: 18,
        isLiked: true,
        replies: [
          {
            id: 'c_val_r1',
            userName: '弗兰克斯基 (Franski)',
            userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            userRole: '作者 (Skill 开发者)',
            time: '2天前',
            content: '感谢认可！下个版本 v1.1.0 我们计划集成免费的 Tushare / AKShare 行情接口，支持自动回填过去 5 年的 FCF 与 ROIC 历史序列。',
            likes: 9,
            isLiked: false
          }
        ]
      },
      {
        id: 'c_val_2',
        userName: 'AlphaResearcher',
        userAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
        userRole: '私募研究员',
        rating: 5,
        time: '1周前',
        content: '在 Agent 平台直接挂载这个 Skill 之后，帮我每天自动扫描港股高股息板块的财务健康度和护城河评级，效率提升极大！',
        likes: 12,
        isLiked: false
      }
    ]
  },

  // 2. ima-skills (知识管理)
  {
    id: 'sk_ima_skills',
    name: 'ima-skills',
    repoPath: 'ima/knowledge-connector',
    category: '知识管理',
    source: 'SkillHub',
    isOfficial: true,
    needsApiKey: true,
    apiKeyProvider: 'ima 开发者令牌',
    aiRating: 4.8,
    aiRatingDesc: '4.8 优秀 (官方认证)',
    securityStatus: '安全',
    voteCount: 471,
    developer: 'ima 官方团队',
    developerAvatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
    version: 'v2.1.0',
    updatedAt: '1天前更新',
    relativeTime: '1天前',
    installs: 223000,
    downloadsCount: 223000,
    viewsCount: 680000,
    likesCount: 471,
    favoritesCount: 471,
    isLiked: false,
    isFavorite: false,
    description: 'ima skills，支持对笔记、知识库的读取、写入和检索等操作，可以帮你随时记录，收入ima智能管理，随时调用，龙虾输出精准内容。',
    license: 'Apache 2.0',
    compatibleAgents: '个人第二大脑 / 知识助手 / 写作 Agent',
    runtimeEnv: 'Python 3.10+ / REST API',
    packageFormat: 'ZIP / Package',
    packageSize: '1.6 MB',
    requiredPermissions: ['网络外联访问', 'ima 授权令牌 (API Key)'],
    tags: ['知识管理', '云端同步', '向量检索', '笔记提取'],
    files: [
      {
        id: 'f_ima_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.1 KB',
        type: 'file',
        language: 'markdown',
        content: `# ima-skills 插件\n支持对个人笔记与云端知识库进行秒级语义检索、自动标签归纳与双向增删改查。`
      },
      {
        id: 'f_ima_2',
        name: 'SKILL.md',
        path: '/SKILL.md',
        size: '14.2 KB',
        type: 'file',
        language: 'markdown',
        content: `# ima-skills 协议规范\n提供 read_notes, write_note, search_knowledge 三大核心能力。`
      }
    ],
    comments: [
      {
        id: 'c_ima_1',
        userName: '效率达人',
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        time: '5天前',
        content: '与 ima 笔记配合极佳，Agent 提取的重点可以直接归档进知识库！',
        likes: 34,
        isLiked: false
      }
    ]
  },

  // 3. 腾讯文档 TENCENT DOCS
  {
    id: 'sk_tencent_docs',
    name: '腾讯文档 TENCENT DOCS',
    repoPath: 'tencent/docs-skill',
    category: '办公效率',
    source: 'SkillHub',
    isOfficial: true,
    needsApiKey: true,
    apiKeyProvider: '腾讯云/文档开放平台 API Key',
    aiRating: 4.9,
    aiRatingDesc: '4.9 官方旗舰 (AI 评分)',
    securityStatus: '安全',
    voteCount: 243,
    developer: '腾讯文档团队',
    developerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80',
    version: 'v3.2.0',
    updatedAt: '3天前更新',
    relativeTime: '3天前',
    installs: 224000,
    downloadsCount: 224000,
    viewsCount: 890000,
    likesCount: 243,
    favoritesCount: 243,
    isLiked: false,
    isFavorite: false,
    description: '腾讯文档（docs.qq.com）- 在线云文档平台，是创建、编辑、管理文档的首选 Skill。涉及新建/创建/编辑/读取/查看/搜索文档等完整操作。',
    license: '开放商业授权',
    compatibleAgents: '协同办公 Agent / 自动汇报 / 会议纪要生成',
    runtimeEnv: 'Node.js 20+ / Python 3.11+',
    packageFormat: 'ZIP / Wheel',
    packageSize: '3.4 MB',
    requiredPermissions: ['网络外联访问', '腾讯文档 OAuth 2.0 凭证'],
    tags: ['办公效率', '云端协同', '多维表格', '腾讯生态'],
    files: [
      {
        id: 'f_tdocs_1',
        name: 'README.md',
        path: '/README.md',
        size: '5.2 KB',
        type: 'file',
        language: 'markdown',
        content: `# 腾讯文档 (Tencent Docs) Agent Skill 插件\n通过腾讯文档 OpenAPI 赋能 Agent 在线创建表格、Word 文档与智能画板。`
      },
      {
        id: 'f_tdocs_2',
        name: 'SKILL.md',
        path: '/SKILL.md',
        size: '18.6 KB',
        type: 'file',
        language: 'markdown',
        content: `# Tencent Docs Skill API\n提供 \`create_doc\`, \`read_sheet_rows\`, \`append_markdown_to_doc\` 等工具函数。`
      }
    ],
    comments: [
      {
        id: 'c_tdocs_1',
        userName: '办公自动化专家',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        rating: 5,
        time: '1周前',
        content: '在线表格的自动化读写非常稳定，团队周报由 Agent 全自动填入腾讯文档，节省了大量时间。',
        likes: 21,
        isLiked: false
      }
    ]
  },

  // 4. web-tools-guide
  {
    id: 'sk_web_tools_guide',
    name: 'web-tools-guide',
    repoPath: 'open-skills/web-tools-guide',
    category: '知识管理',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.5,
    aiRatingDesc: '4.5 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 204,
    developer: 'OpenTools Lab',
    developerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    version: 'v1.8.2',
    updatedAt: '2周前更新',
    relativeTime: '2周前',
    installs: 211000,
    downloadsCount: 211000,
    viewsCount: 520000,
    likesCount: 204,
    favoritesCount: 204,
    isLiked: false,
    isFavorite: false,
    description: 'MANDATORY before calling web tools (search, python, browser, or opencli). Contains required rules, execution procedures and error handling guidelines.',
    license: 'MIT',
    compatibleAgents: '通用智能体 / 工具中继 Agent',
    runtimeEnv: 'Python 3.10+',
    packageFormat: 'ZIP',
    packageSize: '1.2 MB',
    requiredPermissions: ['只读规范指引'],
    tags: ['知识管理', 'Web工具', '工具规范', '执行流优化'],
    files: [
      {
        id: 'f_wtg_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.8 KB',
        type: 'file',
        language: 'markdown',
        content: `# Web Tools Guide Skill\nStandardized guidance for LLMs before triggering browser or sandbox tools.`
      },
      {
        id: 'f_wtg_2',
        name: 'SKILL.md',
        path: '/SKILL.md',
        size: '11.5 KB',
        type: 'file',
        language: 'markdown',
        content: `# Tools Calling Protocols\nRules and safety checks for sandbox executions.`
      }
    ]
  },

  // 5. 文章去AI味工具
  {
    id: 'sk_humanize_text',
    name: '文章去AI味工具',
    repoPath: 'writer/anti-ai-flavor',
    category: '内容创作',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.7,
    aiRatingDesc: '4.7 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 505,
    developer: '新媒体爆文工坊',
    developerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    version: 'v2.4.0',
    updatedAt: '5天前更新',
    relativeTime: '5天前',
    installs: 133000,
    downloadsCount: 133000,
    viewsCount: 410000,
    likesCount: 505,
    favoritesCount: 505,
    isLiked: false,
    isFavorite: false,
    description: '去除文本中的AI写作痕迹，让文字读起来更像人类写作。当用户要求“去AI味”、“降AI味”、“让回复更像人话”、“润色”、“改写得更真实”时触发。',
    license: 'Apache 2.0',
    compatibleAgents: '文案润色 Agent / 自媒体写手 / 营销创作者',
    runtimeEnv: 'Python 3.10+ / 规则语料库',
    packageFormat: 'ZIP',
    packageSize: '2.1 MB',
    requiredPermissions: ['文本转换', '本地规则词典'],
    tags: ['内容创作', '去AI味', '文本润色', '新媒体文案'],
    files: [
      {
        id: 'f_hai_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.1 KB',
        type: 'file',
        language: 'markdown',
        content: `# 文章去AI味工具 (Humanize Text Skill)\n自动识别并重写“总而言之”、“不可否认”、“正如古语所云”等机械式 AI 套话，融入口语化连接词与情绪波动。`
      },
      {
        id: 'f_hai_2',
        name: 'SKILL.md',
        path: '/SKILL.md',
        size: '16.8 KB',
        type: 'file',
        language: 'markdown',
        content: `# Humanize Text Skill Prompt & Rule Engine\n包含 48 条反套路改写规则与口语化置换表。`
      }
    ]
  },

  // 6. kdocs skill (金山文档)
  {
    id: 'sk_kdocs',
    name: 'kdocs skill',
    repoPath: 'wps/kdocs-openapi',
    category: '办公效率',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: true,
    apiKeyProvider: '金山文档开放平台 Key',
    aiRating: 4.4,
    aiRatingDesc: '4.4 良好 (AI 评分)',
    securityStatus: '安全',
    voteCount: 115,
    developer: 'WPS 开放者联盟',
    developerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80',
    version: 'v1.5.0',
    updatedAt: '2周前更新',
    relativeTime: '2周前',
    installs: 94000,
    downloadsCount: 94000,
    viewsCount: 260000,
    likesCount: 115,
    favoritesCount: 115,
    isLiked: false,
    isFavorite: false,
    description: '操作金山文档（WPS 云文档 / Kdocs / 365.kdocs.cn / www.kdocs.cn）云文档的官方 Skill。核心能力覆盖云端新建、内容读取与表格协同。',
    license: '开放商业授权',
    compatibleAgents: 'WPS 助手 / 办公自动化 Agent',
    runtimeEnv: 'Python 3.10+ / REST API',
    packageFormat: 'ZIP',
    packageSize: '2.5 MB',
    requiredPermissions: ['网络外联访问', 'KDocs API Key'],
    tags: ['办公效率', '金山文档', 'WPS协同', '云表格'],
    files: [
      {
        id: 'f_kd_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.6 KB',
        type: 'file',
        language: 'markdown',
        content: `# KDocs Skill Plugin\n支持金山文档在线读取、表格数据解析与自动归档。`
      }
    ]
  },

  // 7. PDF和图片文字提取
  {
    id: 'sk_ocr_pdf_extract',
    name: 'PDF和图片文字提取',
    repoPath: 'multimodal/pdf-ocr-extractor',
    category: '办公效率',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.6,
    aiRatingDesc: '4.6 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 148,
    developer: 'VisionAI Lab',
    developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    version: 'v2.0.1',
    updatedAt: '1周前更新',
    relativeTime: '1周前',
    installs: 82000,
    downloadsCount: 82000,
    viewsCount: 230000,
    likesCount: 148,
    favoritesCount: 148,
    isLiked: false,
    isFavorite: false,
    description: '从图片或 PDF 文档中识别并提取文字内容，支持多种图片格式和 PDF 文件，自动判断是否包含文字并保留原始格式输出结构化 Markdown。',
    license: 'MIT',
    compatibleAgents: '文档解析 Agent / 报销单据扫描 / 知识库录入',
    runtimeEnv: 'Python 3.11+ / PyMuPDF + PaddleOCR',
    packageFormat: 'ZIP / Wheel',
    packageSize: '4.8 MB',
    requiredPermissions: ['本地文件读取', 'OCR 轻量推理引擎'],
    tags: ['办公效率', 'PDF解析', 'OCR识别', '图片转文字'],
    files: [
      {
        id: 'f_ocr_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.9 KB',
        type: 'file',
        language: 'markdown',
        content: `# PDF & Image Text OCR Skill\nHigh accuracy text and table extraction from scanned PDF and images.`
      }
    ]
  },

  // 8. ppt-generator-skill
  {
    id: 'sk_ppt_generator',
    name: 'ppt-generator-skill',
    repoPath: 'presentation/ppt-generator',
    category: '办公效率',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.5,
    aiRatingDesc: '4.5 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 223,
    developer: 'PPT Master 团队',
    developerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    version: 'v1.9.0',
    updatedAt: '3天前更新',
    relativeTime: '3天前',
    installs: 69000,
    downloadsCount: 69000,
    viewsCount: 190000,
    likesCount: 223,
    favoritesCount: 223,
    isLiked: false,
    isFavorite: false,
    description: '智能 PPT 生成助手。根据用户描述的主题、行业、风格，自动生成漂亮的 PPT 文件。支持所有行业（商务、教育、科技、医疗、营销等）。',
    license: 'Apache 2.0',
    compatibleAgents: '汇报演示 Agent / 方案撰写助手 / 教师课件助手',
    runtimeEnv: 'Python 3.10+ / python-pptx',
    packageFormat: 'ZIP',
    packageSize: '3.6 MB',
    requiredPermissions: ['PPTX 模板渲染'],
    tags: ['办公效率', 'PPT生成', '排版设计', '幻灯片演示'],
    files: [
      {
        id: 'f_ppt_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.5 KB',
        type: 'file',
        language: 'markdown',
        content: `# PPT Generator Skill\nGenerate production-ready .pptx slides from structured markdown outlines.`
      }
    ]
  },

  // 9. 架构图一键生成
  {
    id: 'sk_arch_diagram',
    name: '架构图一键生成',
    repoPath: 'diagram/context-weave-arch',
    category: '设计多媒体',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.6,
    aiRatingDesc: '4.6 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 149,
    developer: '架构师小助手',
    developerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    version: 'v2.2.0',
    updatedAt: '4天前更新',
    relativeTime: '4天前',
    installs: 67000,
    downloadsCount: 67000,
    viewsCount: 180000,
    likesCount: 149,
    favoritesCount: 149,
    isLiked: false,
    isFavorite: false,
    description: '强大的AI自动化绘图与复杂信息可视化工具（基于 ContextWeave）。不仅支持代码与系统架构的可视化，更广泛应用于业务流程图绘制。',
    license: 'MIT',
    compatibleAgents: '软件架构 Agent / 技术方案助手 / 流程设计助手',
    runtimeEnv: 'Python 3.10+ / Mermaid + PlantUML',
    packageFormat: 'ZIP',
    packageSize: '2.9 MB',
    requiredPermissions: ['矢量图形渲染 (SVG/PNG)'],
    tags: ['设计多媒体', '架构图', '流程图', 'Mermaid'],
    files: [
      {
        id: 'f_arch_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.2 KB',
        type: 'file',
        language: 'markdown',
        content: `# 架构图一键生成 (Architecture Diagram Generator)\n基于 PlantUML / Mermaid 自动将微服务拓扑与数据流转转化为高清矢量图。`
      }
    ]
  },

  // 10. Agently Mail (官方)
  {
    id: 'sk_agently_mail',
    name: 'Agently Mail',
    repoPath: 'tencent/agently-mail',
    category: '办公效率',
    source: 'SkillHub',
    isOfficial: true,
    needsApiKey: false,
    aiRating: 4.7,
    aiRatingDesc: '4.7 官方 (AI 评分)',
    securityStatus: '安全',
    voteCount: 68,
    developer: 'QQ 邮箱团队',
    developerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80',
    version: 'v1.2.0',
    updatedAt: '1周前更新',
    relativeTime: '1周前',
    installs: 64000,
    downloadsCount: 64000,
    viewsCount: 150000,
    likesCount: 68,
    favoritesCount: 68,
    isLiked: false,
    isFavorite: false,
    description: 'Agently Mail 是 QQ 邮箱团队为 Agent 打造的专属邮箱服务，与个人邮箱隔离，原生适配 Agent，助力你安全、高效地使用邮件收发功能。',
    license: '官方专属授权',
    compatibleAgents: '秘书助手 / 报警通知 Agent / 客户服务 Agent',
    runtimeEnv: 'Node.js / Python REST',
    packageFormat: 'ZIP',
    packageSize: '1.9 MB',
    requiredPermissions: ['SMTP/IMAP 协议隔离发送'],
    tags: ['办公效率', 'QQ邮箱', '邮件发送', 'Agent隔离'],
    files: [
      {
        id: 'f_mail_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.3 KB',
        type: 'file',
        language: 'markdown',
        content: `# Agently Mail Skill Plugin\nSafe and isolated sandbox mailbox service powered by Tencent QQ Mail team.`
      }
    ]
  },

  // 11. 视频号爆款短视频拆解（付费版：全能）
  {
    id: 'sk_video_teardown',
    name: '视频号爆款短视频拆解（付费版：全能）',
    repoPath: 'media/video-viral-teardown',
    category: '内容创作',
    source: 'SkillHub',
    isOfficial: true,
    needsApiKey: true,
    apiKeyProvider: '短视频分析 API 密钥',
    aiRating: 4.8,
    aiRatingDesc: '4.8 爆款推荐 (AI 评分)',
    securityStatus: '安全',
    voteCount: 59,
    developer: '零一数科 · 出品',
    developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    version: 'v2.6.0',
    updatedAt: '2天前更新',
    relativeTime: '2天前',
    installs: 52000,
    downloadsCount: 52000,
    viewsCount: 140000,
    likesCount: 59,
    favoritesCount: 59,
    isLiked: false,
    isFavorite: false,
    description: '【零一数科 · 出品】视频号爆款短视频拆解（付费版：全能）。一键拆解爆款，把一条视频号视频拆解成结构分段、爆款归因、六大抓手分析。',
    license: '商业授权',
    compatibleAgents: '自媒体运营 Agent / 爆款短视频编导 / 广告投手',
    runtimeEnv: 'Python 3.11+ / 音视频多模态解析',
    packageFormat: 'ZIP',
    packageSize: '4.2 MB',
    requiredPermissions: ['视频逐帧抽帧', 'ASR 语音转录', '短视频 API 接口'],
    tags: ['内容创作', '视频号', '爆款拆解', '短视频运营'],
    files: [
      {
        id: 'f_vtd_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.5 KB',
        type: 'file',
        language: 'markdown',
        content: `# 视频号爆款短视频拆解 Skill\n自动提取前 3 秒黄金黄金钩子、情绪起伏曲线与文案槽点分段。`
      }
    ]
  },

  // 12. 全能金融爬虫（强化爬取能力）
  {
    id: 'sk_finance_crawler',
    name: '全能金融爬虫（强化爬取能力）',
    repoPath: 'fintech/crawler-pro',
    category: '数据分析',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.6,
    aiRatingDesc: '4.6 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 145,
    developer: 'QuantWeb 团队',
    developerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    version: 'v6.0.0',
    updatedAt: '1天前更新',
    relativeTime: '1天前',
    installs: 48000,
    downloadsCount: 48000,
    viewsCount: 135000,
    likesCount: 145,
    favoritesCount: 145,
    isLiked: false,
    isFavorite: false,
    description: '中国金融机构数据爬取与分析综合 Skill v6.0.0。全量机构名单（1540+家，36大类）、全网舆情（4类 60+ 商业财经媒体源数据快速抓取）。',
    license: 'Apache 2.0',
    compatibleAgents: '投研 Agent / 金融舆情监控 / 风险预警',
    runtimeEnv: 'Python 3.11+ / Playwright / Scrapy',
    packageFormat: 'ZIP / Wheel',
    packageSize: '5.2 MB',
    requiredPermissions: ['网络外联访问', '动态代理池调度'],
    tags: ['数据分析', '金融爬虫', '舆情监控', '机构数据'],
    files: [
      {
        id: 'f_fc_1',
        name: 'README.md',
        path: '/README.md',
        size: '5.6 KB',
        type: 'file',
        language: 'markdown',
        content: `# 全能金融爬虫 Skill v6.0.0\n内置 1540+ 家金融监管与商业机构接口，支持毫秒级财经快讯与公告抓取。`
      }
    ]
  },

  // 13. 全球12亿文献知识库
  {
    id: 'sk_academic_papers',
    name: '全球12亿文献知识库（8千万中文期刊可下载）',
    repoPath: 'academic/smartlib-12b',
    category: '知识管理',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: true,
    apiKeyProvider: 'SmartLib 开放学术平台 Key',
    aiRating: 4.9,
    aiRatingDesc: '4.9 极高 (AI 评分)',
    securityStatus: '安全',
    voteCount: 126,
    developer: 'SmartLib Academic',
    developerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    version: 'v4.0.0',
    updatedAt: '3天前更新',
    relativeTime: '3天前',
    installs: 47000,
    downloadsCount: 47000,
    viewsCount: 160000,
    likesCount: 126,
    favoritesCount: 126,
    isLiked: false,
    isFavorite: false,
    description: '全球12亿文献知识库（8千万中文期刊可下载）——通过 SmartLib 开放平台 API 提供中外文学术文献检索与下载能力，支持文献综述自动起草。',
    license: '开放商业授权',
    compatibleAgents: '科研 Agent / 论文助手 / 专利分析师',
    runtimeEnv: 'Python 3.10+ / REST API',
    packageFormat: 'ZIP',
    packageSize: '2.3 MB',
    requiredPermissions: ['学术文献数据库 API'],
    tags: ['知识管理', '学术论文', '文献检索', '科研辅助'],
    files: [
      {
        id: 'f_ap_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.0 KB',
        type: 'file',
        language: 'markdown',
        content: `# 全球12亿文献知识库 Skill\n支持 arXiv, CrossRef, CNKI 与 PubMed 交叉引用检索。`
      }
    ]
  },

  // 14. 腾讯云 CloudBase / Tencent CloudBase
  {
    id: 'sk_tencent_cloudbase',
    name: '腾讯云 CloudBase / Tencent CloudBase',
    repoPath: 'tencent/cloudbase-sdk',
    category: '开发编程',
    source: 'SkillHub',
    isOfficial: true,
    needsApiKey: false,
    aiRating: 4.8,
    aiRatingDesc: '4.8 官方 (AI 评分)',
    securityStatus: '安全',
    voteCount: 20,
    developer: '腾讯云 CloudBase 团队',
    developerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80',
    version: 'v2.8.0',
    updatedAt: '2周前更新',
    relativeTime: '2周前',
    installs: 39000,
    downloadsCount: 39000,
    viewsCount: 110000,
    likesCount: 20,
    favoritesCount: 20,
    isLiked: false,
    isFavorite: false,
    description: '腾讯云 CloudBase 是面向 AI Coding 的后端一体化平台，内置数据库、存储、身份认证、云函数与云托管等服务，支持快速构建全栈应用。',
    license: 'Apache 2.0',
    compatibleAgents: '全栈开发 Agent / 架构部署助手 / 数据库管理',
    runtimeEnv: 'Node.js 20+ / CLI',
    packageFormat: 'ZIP / NPM',
    packageSize: '4.1 MB',
    requiredPermissions: ['云资源调度', '无服务器架构部署'],
    tags: ['开发编程', '腾讯云', 'CloudBase', 'Serverless'],
    files: [
      {
        id: 'f_tcb_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.8 KB',
        type: 'file',
        language: 'markdown',
        content: `# Tencent CloudBase Skill\nDeploy serverless databases, cloud functions and web hosting directly from Agent prompts.`
      }
    ]
  },

  // 15. smart-charts
  {
    id: 'sk_smart_charts',
    name: 'smart-charts',
    repoPath: 'data/smart-charts-pro',
    category: '数据分析',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.5,
    aiRatingDesc: '4.5 良好 (AI 评分)',
    securityStatus: '安全',
    voteCount: 31,
    developer: 'DataViz Geek',
    developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    version: 'v1.4.0',
    updatedAt: '1个月前更新',
    relativeTime: '1个月前',
    installs: 41000,
    downloadsCount: 41000,
    viewsCount: 95000,
    likesCount: 31,
    favoritesCount: 31,
    isLiked: false,
    isFavorite: false,
    description: '3步生成图表：1.上传数据 —— 将 CSV / Excel / JSON 文件拖入对话框；2.确认分析方向 —— 查看数据摘要，确认推荐的图表类型；3.一键渲染交互式图表。',
    license: 'MIT',
    compatibleAgents: '数据大屏 Agent / BI 分析助手 / 统计报表助手',
    runtimeEnv: 'Python 3.10+ / ECharts + Vega',
    packageFormat: 'ZIP',
    packageSize: '3.1 MB',
    requiredPermissions: ['图表渲染', '数据表格透视'],
    tags: ['数据分析', 'ECharts', '可视化', 'CSV分析'],
    files: [
      {
        id: 'f_sc_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.7 KB',
        type: 'file',
        language: 'markdown',
        content: `# Smart Charts Skill\nAutomated chart generation and exploratory data visualization engine.`
      }
    ]
  },

  // 16. pptx (AI Agent 发现工具)
  {
    id: 'sk_pptx_hub',
    name: 'pptx',
    repoPath: 'agents/pptx-discovery',
    category: 'AI Agent',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.4,
    aiRatingDesc: '4.4 良好 (AI 评分)',
    securityStatus: '安全',
    voteCount: 28,
    developer: 'AgentX Lab',
    developerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    version: 'v1.1.0',
    updatedAt: '2周前更新',
    relativeTime: '2周前',
    installs: 39000,
    downloadsCount: 39000,
    viewsCount: 88000,
    likesCount: 28,
    favoritesCount: 28,
    isLiked: false,
    isFavorite: false,
    description: 'Helps users discover and install agent skills when they ask questions like "how do I do X", "find a skill for X", "is there a tool for PPT generation".',
    license: 'MIT',
    compatibleAgents: '技能推荐 Agent / 路由器 Agent',
    runtimeEnv: 'Python 3.10+',
    packageFormat: 'ZIP',
    packageSize: '1.5 MB',
    requiredPermissions: ['只读工具注册表检索'],
    tags: ['AI Agent', '技能路由', '智能匹配', '元工具'],
    files: [
      {
        id: 'f_px_1',
        name: 'README.md',
        path: '/README.md',
        size: '2.8 KB',
        type: 'file',
        language: 'markdown',
        content: `# PPTX & Skills Discovery Agent Hub\nDynamic tool matching router for LLM orchestrations.`
      }
    ]
  },

  // 17. 抖音文案一键提取
  {
    id: 'sk_douyin_extractor',
    name: '抖音文案一键提取',
    repoPath: 'media/douyin-script-puller',
    category: '内容创作',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.7,
    aiRatingDesc: '4.7 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 162,
    developer: '新媒体爆款研究组',
    developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    version: 'v3.1.2',
    updatedAt: '3天前更新',
    relativeTime: '3天前',
    installs: 35000,
    downloadsCount: 35000,
    viewsCount: 120000,
    likesCount: 162,
    favoritesCount: 162,
    isLiked: false,
    isFavorite: false,
    description: '粘贴抖音、快手、小红书、视频号公开可访问的短视频分享链接，一键提取标题、简介、口播文案，提供原版、优化朗读版与爆款仿写提炼。',
    license: 'Apache 2.0',
    compatibleAgents: '文案提取 Agent / 爆款仿写助手',
    runtimeEnv: 'Python 3.11+ / Whisper 语音转写',
    packageFormat: 'ZIP',
    packageSize: '3.8 MB',
    requiredPermissions: ['公开短视频流解析', 'ASR 识别'],
    tags: ['内容创作', '抖音文案', '语音提取', '短视频仿写'],
    files: [
      {
        id: 'f_dy_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.6 KB',
        type: 'file',
        language: 'markdown',
        content: `# 抖音文案一键提取 Skill\n自动提取分享短链，去除水印音频并转换生成高准确率口播台词稿。`
      }
    ]
  },

  // 18. Excel/WPS 表格自动化工具
  {
    id: 'sk_excel_automation',
    name: 'Excel/WPS 表格自动化工具',
    repoPath: 'office/excel-automation',
    category: '办公效率',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.8,
    aiRatingDesc: '4.8 实用爆款 (AI 评分)',
    securityStatus: '安全',
    voteCount: 59,
    developer: 'Office Automation Lab',
    developerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    version: 'v2.5.0',
    updatedAt: '1周前更新',
    relativeTime: '1周前',
    installs: 36000,
    downloadsCount: 36000,
    viewsCount: 105000,
    likesCount: 59,
    favoritesCount: 59,
    isLiked: false,
    isFavorite: false,
    description: 'Excel / WPS 表格自动化处理工具。用 openpyxl 创建格式专业的报表、解析含宏的复杂 xlsm 文件、批量合并多工作表数据。适合各类自动化场景。',
    license: 'MIT',
    compatibleAgents: '财务审计 Agent / 人事薪酬助手 / 数据清洗助手',
    runtimeEnv: 'Python 3.10+ / openpyxl + pandas',
    packageFormat: 'ZIP',
    packageSize: '2.7 MB',
    requiredPermissions: ['本地表格读写', '公式自动重算'],
    tags: ['办公效率', 'Excel自动化', 'WPS表格', '公式生成'],
    files: [
      {
        id: 'f_ea_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.2 KB',
        type: 'file',
        language: 'markdown',
        content: `# Excel/WPS 表格自动化工具\n支持合并单元格计算、条件格式高亮及 VLOOKUP/XLOOKUP 批量公式注入。`
      }
    ]
  },

  // 19. 海报设计skill
  {
    id: 'sk_poster_design',
    name: '海报设计skill',
    repoPath: 'design/poster-generator',
    category: '设计多媒体',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.6,
    aiRatingDesc: '4.6 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 148,
    developer: 'Visual Artificer',
    developerAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    version: 'v1.7.0',
    updatedAt: '5天前更新',
    relativeTime: '5天前',
    installs: 34000,
    downloadsCount: 34000,
    viewsCount: 92000,
    likesCount: 148,
    favoritesCount: 148,
    isLiked: false,
    isFavorite: false,
    description: '当用户提到海报、视觉设计、品牌视觉、排版系统、极简风格、设计哲学、美学方案，或说“帮我做张海报”时，必须触发此技能。',
    license: 'Apache 2.0',
    compatibleAgents: '电商海报 Agent / 活动宣传设计 / 视觉包装助手',
    runtimeEnv: 'Python 3.10+ / Pillow + CairoSVG',
    packageFormat: 'ZIP',
    packageSize: '3.9 MB',
    requiredPermissions: ['高清图像生成', '字体排版引擎'],
    tags: ['设计多媒体', '海报设计', '视觉美学', '版式布局'],
    files: [
      {
        id: 'f_pd_1',
        name: 'README.md',
        path: '/README.md',
        size: '3.8 KB',
        type: 'file',
        language: 'markdown',
        content: `# 海报设计 Skill\n提供遵循包豪斯与瑞士国际平面设计风格的黄金网格排版系统。`
      }
    ]
  },

  // 20. 专利初稿助手
  {
    id: 'sk_patent_drafter',
    name: '专利初稿助手',
    repoPath: 'legal/patent-drafting-pro',
    category: '行业专业',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.7,
    aiRatingDesc: '4.7 优秀 (AI 评分)',
    securityStatus: '安全',
    voteCount: 16,
    developer: 'IP 知识产权智库',
    developerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    version: 'v1.3.0',
    updatedAt: '1个月前更新',
    relativeTime: '1个月前',
    installs: 36000,
    downloadsCount: 36000,
    viewsCount: 85000,
    likesCount: 16,
    favoritesCount: 16,
    isLiked: false,
    isFavorite: false,
    description: '基于技术交底书生成专利申请初稿。技术交底书内容至少包含技术问题、解决方案、技术效果。内置推理、视觉、多模态、通信等专业模板。',
    license: '开放商业授权',
    compatibleAgents: '知识产权 Agent / 研发工程师交底助手 / 专利律师',
    runtimeEnv: 'Python 3.10+ / 国家知识产权局标准模板',
    packageFormat: 'ZIP',
    packageSize: '2.6 MB',
    requiredPermissions: ['专利交底模板引擎'],
    tags: ['行业专业', '专利撰写', '交底书', '知识产权'],
    files: [
      {
        id: 'f_pat_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.1 KB',
        type: 'file',
        language: 'markdown',
        content: `# 专利初稿助手 (Patent Drafter Skill)\n严格符合国家知识产权局 (CNIPA) 权利要求书与说明书撰写规范。`
      }
    ]
  },

  // 21. WPS Office 全家桶
  {
    id: 'sk_wps_office_suite',
    name: 'WPS Office 全家桶',
    repoPath: 'wps/office-suite-allinone',
    category: '办公效率',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.8,
    aiRatingDesc: '4.8 满分推荐 (AI 评分)',
    securityStatus: '安全',
    voteCount: 34,
    developer: 'WPS 极客开发社',
    developerAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=100&auto=format&fit=crop&q=80',
    version: 'v3.5.0',
    updatedAt: '3天前更新',
    relativeTime: '3天前',
    installs: 32000,
    downloadsCount: 32000,
    viewsCount: 96000,
    likesCount: 34,
    favoritesCount: 34,
    isLiked: false,
    isFavorite: false,
    description: 'WPS Office 全家桶 · 四引擎（WPS/MS Office/LibreOffice/纯Python）智能识别用户已安装软件，纯Python模式支持排序/图表/公式。',
    license: 'Apache 2.0',
    compatibleAgents: '文档工作流 Agent / 跨平台排版引擎',
    runtimeEnv: 'Python 3.10+ / COM + Headless CLI',
    packageFormat: 'ZIP',
    packageSize: '4.6 MB',
    requiredPermissions: ['跨平台 Office 进程网桥'],
    tags: ['办公效率', 'WPS全家桶', '四引擎兼容', '文档排版'],
    files: [
      {
        id: 'f_wps_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.9 KB',
        type: 'file',
        language: 'markdown',
        content: `# WPS Office 全家桶 Skill\nUnified office automation gateway supporting Word, Excel, PowerPoint and PDF conversions.`
      }
    ]
  },

  // 22. 番茄小说写作助手（单章2200-2800字）
  {
    id: 'sk_novel_writer',
    name: '番茄小说写作助手（单章2200-2800字）',
    repoPath: 'novel/tomato-story-craft',
    category: '内容创作',
    source: 'SkillHub',
    isOfficial: false,
    needsApiKey: false,
    aiRating: 4.7,
    aiRatingDesc: '4.7 爆款创作 (AI 评分)',
    securityStatus: '安全',
    voteCount: 283,
    developer: '网文白金导师团',
    developerAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    version: 'v4.2.0',
    updatedAt: '2天前更新',
    relativeTime: '2天前',
    installs: 27000,
    downloadsCount: 27000,
    viewsCount: 88000,
    likesCount: 283,
    favoritesCount: 283,
    isLiked: false,
    isFavorite: false,
    description: '|专为番茄小说平台优化的分章节创作助手。支持各种题材（悬疑/言情/奇幻/科幻/历史等），支持长篇创作，每章2200-2800字，黄金钩子留白。',
    license: 'Apache 2.0',
    compatibleAgents: '网络小说作家 Agent / 剧情大纲设计 / 角色设定助手',
    runtimeEnv: 'Python 3.10+ / 剧情张力规则引擎',
    packageFormat: 'ZIP',
    packageSize: '2.4 MB',
    requiredPermissions: ['长文本大纲记忆'],
    tags: ['内容创作', '番茄小说', '网文创作', '爽点节奏'],
    files: [
      {
        id: 'f_nov_1',
        name: 'README.md',
        path: '/README.md',
        size: '4.6 KB',
        type: 'file',
        language: 'markdown',
        content: `# 番茄小说写作助手 Skill\n掌握“黄金三章”、“卡点断章”、“情绪拉扯”等百万字长篇网文连载法则。`
      }
    ]
  }
];
