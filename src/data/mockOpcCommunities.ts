export type OpcPolicyKey = '免费工位' | '算力支持' | '创业投资' | '工商注册';

export interface OpcPolicyDetail {
  key: OpcPolicyKey;
  supported: boolean;
  statusDesc: string;
}

export interface OpcCommunityNode {
  id: string;
  /** 所属省份/直辖市/特别行政区（如 江苏省、上海市、香港特别行政区） */
  province?: string;
  city: string;
  district: string;
  name: string;
  address: string;
  /** 兼容旧字段：社区摘要 */
  summary: string;
  /** 列表卡片简介（150字以内） */
  cardSummary?: string;
  /** 详情弹窗政策概述（300字以内） */
  policyOverview?: string;
  policies: OpcPolicyKey[];
  policyDetails: OpcPolicyDetail[];
  contactName: string;
  maskedPhone: string;
  fullPhone: string;
  contactEmail: string;
  serviceHours: string;
  qrHint: string;
  /** 后台发布状态：public=公开，hidden=隐藏 */
  status?: 'public' | 'hidden';
  /** 排序权重（越大越靠前，默认 0） */
  sortWeight?: number;
  /** 创建时间 (YYYY-MM-DD HH:mm) */
  createdAt?: string;
}

export const OPC_POLICY_KEYS: OpcPolicyKey[] = [
  '免费工位',
  '算力支持',
  '创业投资',
  '工商注册'
];

export const OPC_CITIES: string[] = [
  '全部',
  '上海市',
  '北京市',
  '深圳市',
  '杭州市',
  '成都市',
  '天津市',
  '合肥市',
  '济南市',
  '青岛市',
  '南通市',
  '南京市',
  '武汉市',
  '苏州市',
  '长春市',
  '威海市',
  '马鞍山市'
];

export const MOCK_OPC_COMMUNITIES: OpcCommunityNode[] = [
  // ================= 上海市 =================
  {
    id: 'opc-sh-mh-01',
    city: '上海市',
    district: '闵行区',
    name: '伊莱雅OPC创智空间',
    address: '上海市闵行区江川路街道剑川路和文井路交汇处966号',
    summary:
      '华南师大OPC创智空间依托伊莱雅数字科技产业园，与大学科技园共同打造“零门槛”创业试验区，在产业孵化与技术转化服务上为开发者提供全链路支持。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '最长 12 个月免租工位' },
      { key: '算力支持', supported: true, statusDesc: '园区算力券专项补贴' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '提供免费注册地址与代办' }
    ],
    contactName: '林经理',
    maskedPhone: '138****6612',
    fullPhone: '138-1620-6612',
    contactEmail: 'minhang-yilaiya@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码添加伊莱雅 OPC 创智空间入驻顾问'
  },
  {
    id: 'opc-sh-mh-02',
    city: '上海市',
    district: '闵行区',
    name: '大零号湾·OPC创新创业社区',
    address: '上海市闵行区剑川路951号',
    summary:
      '大零号湾OPC创新创业社区，依托高校院所与硬科技产业生态，面向人工智能与前沿软件超级个体提供开放式孵化支持。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首年免租联合研发席位' },
      { key: '算力支持', supported: true, statusDesc: '高额推理与微调算力券' },
      { key: '创业投资', supported: true, statusDesc: '大零号湾科创基金直通' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '顾顾问',
    maskedPhone: '139****4218',
    fullPhone: '139-1742-4218',
    contactEmail: 'dalinghaowan-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码预约大零号湾 OPC 社区入驻评估'
  },
  {
    id: 'opc-sh-mh-03',
    city: '上海市',
    district: '闵行区',
    name: '上海交大科技园OPC社区',
    address: '上海市闵行区紫竹高新区上海交大科技园',
    summary:
      '依托交大产学研资源，聚焦 AI+OpenClaw 创业生态、数字科技、未来智能医疗等前沿技术领域，提供导师对接与科研算力资源。',
    policies: ['免费工位', '算力支持'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '科技园专属研发工位' },
      { key: '算力支持', supported: true, statusDesc: '高校联合实验室算力配额' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '沈老师',
    maskedPhone: '136****7831',
    fullPhone: '136-2189-7831',
    contactEmail: 'sjtu-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码对接上海交大科技园 OPC 孵化顾问'
  },
  {
    id: 'opc-sh-xh-04',
    city: '上海市',
    district: '徐汇区',
    name: '上海模速空间（上海大模型创新生态社区）',
    address: '上海市徐汇区龙腾大道（西岸传媒港）',
    summary:
      '全国首个生成式人工智能专业孵化与大模型生态社区，开放高频推理算力补贴、模型备案辅导及产业资本常态化路演对接。',
    policies: ['免费工位', '算力支持', '创业投资', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '认证开发者免押入驻 6 个月' },
      { key: '算力支持', supported: true, statusDesc: 'Token 与 GPU 补贴 40%' },
      { key: '创业投资', supported: true, statusDesc: '种子轮直投最高 200 万' },
      { key: '工商注册', supported: true, statusDesc: '一站式注册与算法备案' }
    ],
    contactName: '陈顾问',
    maskedPhone: '139****6210',
    fullPhone: '139-1745-6210',
    contactEmail: 'xuhui-opc@xctf-ai.cn',
    serviceHours: '工作日 09:30 - 18:30',
    qrHint: '扫码预约模速空间实地考察与政策评估'
  },
  {
    id: 'opc-sh-sj-05',
    city: '上海市',
    district: '松江区',
    name: '临港人工智能小镇OPC超级创业者社区',
    address: '上海市松江区洞泾镇砖桥贸易城（临港科技城）',
    summary:
      '依托“长三角G60科创走廊”国家战略腹地，专注人工智能领域的OPC超级创业者社区，上海布局建设的首批创业者社区之一。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首批团队最长 12 个月免租' },
      { key: '算力支持', supported: true, statusDesc: 'G60 算力券最高补贴 30 万' },
      { key: '创业投资', supported: true, statusDesc: '临港产业引导基金对接' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '陆经理',
    maskedPhone: '150****3319',
    fullPhone: '150-2190-3319',
    contactEmail: 'lingang-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码获取临港人工智能小镇入驻手册'
  },
  {
    id: 'opc-sh-yp-06',
    city: '上海市',
    district: '杨浦区',
    name: '聚才社区（杨浦区首个超级创业者集聚区）',
    address: '上海市杨浦区政立路477号',
    summary:
      '已吸引数十个超级个体团队入驻，行业涵盖 3D 引擎、安全大模型与智能体研发，建立不超过两天即完成登记的极速落地入驻机制。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '提供独立极客工位与会议室' },
      { key: '算力支持', supported: true, statusDesc: '杨浦区专项算力补贴通道' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '48 小时极速工商登记' }
    ],
    contactName: '许顾问',
    maskedPhone: '135****8940',
    fullPhone: '135-6412-8940',
    contactEmail: 'yangpu-jucai@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码咨询杨浦聚才社区极速入驻流程'
  },
  {
    id: 'opc-sh-xh-07',
    city: '上海市',
    district: '徐汇区',
    name: '田林251社区OPC工位',
    address: '上海市徐汇区田林路251号（田林街道）',
    summary:
      '徐汇区田林251党群服务中心二楼，依托田林科创社区为周边 AI 研发者提供免费办公席位，面向一人公司创业者，已集聚数十位超级创业者。',
    policies: ['免费工位'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '预约即享免费开放式工位' },
      { key: '算力支持', supported: false, statusDesc: '详情面议' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '周专员',
    maskedPhone: '137****2105',
    fullPhone: '137-6120-2105',
    contactEmail: 'tianlin-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码预约田林 251 社区 OPC 工位'
  },
  {
    id: 'opc-sh-pd-08',
    city: '上海市',
    district: '浦东新区',
    name: 'Aloha&张江创新社区',
    address: '上海市浦东新区张江路665号A1栋',
    summary:
      '张江科学城核心创新平台，已成功孵化 200 余家围绕大模型与智能体的初创企业，拥有 2000 平方米高标准创新研发空间。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '张江核心区孵化席位补贴' },
      { key: '算力支持', supported: true, statusDesc: '张江智算云平台折扣额度' },
      { key: '创业投资', supported: true, statusDesc: '常态化一线 VC 闭门路演' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '唐经理',
    maskedPhone: '186****9102',
    fullPhone: '186-2158-9102',
    contactEmail: 'zhangjiang-aloha@xctf-ai.cn',
    serviceHours: '工作日 09:30 - 18:30',
    qrHint: '扫码加入 Aloha & 张江创新社区'
  },
  {
    id: 'opc-sh-qp-09',
    city: '上海市',
    district: '青浦区',
    name: '青浦区首个创业人才社区',
    address: '上海市青浦区赵巷镇长三角绿洲智谷',
    summary:
      '青浦区聚焦以长三角数字干线、西岑科创中心、虹桥国际中央商务区联动发展为核心载体的创业人才社区，提供全周期政策护航。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '最长 12 个月免租工位' },
      { key: '算力支持', supported: true, statusDesc: '最高 30 万市级算力券' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '免费虚拟注册与刻章' }
    ],
    contactName: '张经理',
    maskedPhone: '138****8888',
    fullPhone: '138-1692-8888',
    contactEmail: 'qingpu-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码添加青浦 OPC 社区入驻顾问'
  },
  {
    id: 'opc-sh-ja-10',
    city: '上海市',
    district: '静安区',
    name: '视听静界·元空间·静安“客”OPC创新社区',
    address: '上海市静安区大宁功能区市北高新核心园区',
    summary:
      '静安区大宁功能区内首个“视听+AI”OPC 专业创新社区，聚焦多模态大模型与数字内容生成，空间面积约 2000 平方米。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '数字视听专项免租工位' },
      { key: '算力支持', supported: true, statusDesc: '多模态渲染与推理算力券' },
      { key: '创业投资', supported: true, statusDesc: '静安文创科创基金对接' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '方经理',
    maskedPhone: '138****5147',
    fullPhone: '138-1834-5147',
    contactEmail: 'jingan-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码对接视听静界 OPC 创新社区'
  },

  // ================= 北京市 =================
  {
    id: 'opc-bj-hd-11',
    city: '北京市',
    district: '海淀区',
    name: '中关村AI北纬社区',
    address: '北京市海淀区中关村北大街（原中关村创业大街核心区域）',
    summary:
      '立足海淀人工智能核心策源地，打造一人公司与超级个体创新空间，提供高额算力券直补、免费独立工位及政企订单优先派发。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '6 个月独立极客工位' },
      { key: '算力支持', supported: true, statusDesc: '最高 50 万算力券直补' },
      { key: '创业投资', supported: true, statusDesc: '中关村科创基金直通车' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '李主任',
    maskedPhone: '136****5092',
    fullPhone: '136-0118-5092',
    contactEmail: 'haidian-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:30',
    qrHint: '扫码对接中关村 AI 北纬社区专员'
  },
  {
    id: 'opc-bj-hd-12',
    city: '北京市',
    district: '海淀区',
    name: '中关村软件园OPC专项',
    address: '北京市海淀区东北旺西路8号（中关村软件园）',
    summary:
      '北京技术高地核心 OPC 中心，承接头部大厂技术生态外溢，开源开发者社区活跃，配套人才公寓与全方位商事托管服务。',
    policies: ['免费工位', '算力支持', '创业投资', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '软件园核心区免租办公位' },
      { key: '算力支持', supported: true, statusDesc: '北京市智算算力券直补' },
      { key: '创业投资', supported: true, statusDesc: '软件园直投生态基金' },
      { key: '工商注册', supported: true, statusDesc: '园区专窗一站式注册' }
    ],
    contactName: '高经理',
    maskedPhone: '139****8310',
    fullPhone: '139-1092-8310',
    contactEmail: 'zpark-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码咨询中关村软件园 OPC 专项政策'
  },
  {
    id: 'opc-bj-hd-13',
    city: '北京市',
    district: '海淀区',
    name: '微软加速器 (Microsoft AI Garage)',
    address: '北京市海淀区丹棱街5号微软大厦',
    summary:
      '北京核心技术极客 OPC 创新枢纽，面向大模型应用与 AI Agent 创业团队提供顶级架构师辅导、云算力额度及全球企业级客户对接。',
    policies: ['算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: false, statusDesc: '详情面议' },
      { key: '算力支持', supported: true, statusDesc: '高额云端 GPU 与 API 额度' },
      { key: '创业投资', supported: true, statusDesc: '头部硬科技投资机构直推' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '杨顾问',
    maskedPhone: '138****1045',
    fullPhone: '138-1102-1045',
    contactEmail: 'aigarage-opc@xctf-ai.cn',
    serviceHours: '工作日 09:30 - 18:00',
    qrHint: '扫码获取微软加速器 OPC 申请指南'
  },
  {
    id: 'opc-bj-hd-14',
    city: '北京市',
    district: '海淀区',
    name: '清华x-lab',
    address: '北京市海淀区清华科技园科技大厦',
    summary:
      '北京高校科研创新 OPC 中心，联动高校实验室、产业导师与早期资本，为师生及校友 AI 创业团队提供成果转化与孵化加速服务。',
    policies: ['免费工位', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '在孵项目免费共享空间' },
      { key: '算力支持', supported: false, statusDesc: '详情面议' },
      { key: '创业投资', supported: true, statusDesc: '校友科创种子基金对接' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '宋老师',
    maskedPhone: '135****7726',
    fullPhone: '135-0136-7726',
    contactEmail: 'xlab-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码联系清华 x-lab 孵化导师'
  },
  {
    id: 'opc-bj-cy-15',
    city: '北京市',
    district: '朝阳区',
    name: '751D·PARK OPC创新中心',
    address: '北京市朝阳区酒仙桥路4号（751北京时尚设计广场）',
    summary:
      '依托 751 工业遗存与文化科技融合优势，打造 AIGC 与视觉创意 OPC 生态基地，支持全周期孵化、商事登记与出海项目加速。',
    policies: ['免费工位', '创业投资', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '开放区工位首年免租' },
      { key: '算力支持', supported: false, statusDesc: '详情面议' },
      { key: '创业投资', supported: true, statusDesc: 'AIGC 文创专项基金孵化' },
      { key: '工商注册', supported: true, statusDesc: '提供注册地址与财税代理' }
    ],
    contactName: '王经理',
    maskedPhone: '135****4417',
    fullPhone: '135-2109-4417',
    contactEmail: 'chaoyang-751@xctf-ai.cn',
    serviceHours: '工作日 09:30 - 18:00',
    qrHint: '扫码获取 751 OPC 创新中心入驻清单'
  },
  {
    id: 'opc-bj-ft-16',
    city: '北京市',
    district: '丰台区',
    name: '91科创·丰台创新港生产力中心OPC社区',
    address: '北京市丰台区丰台科技园创新港',
    summary:
      '落实丰台区创新 60 条政策，联合 91 科创打造的新质生产力 OPC 孵化社区，面向 AI 应用研发团队提供工位补贴与算力支持。',
    policies: ['免费工位', '算力支持'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '创新港免租工位 6-12 月' },
      { key: '算力支持', supported: true, statusDesc: '市区两级算力补贴叠加' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '韩经理',
    maskedPhone: '186****6620',
    fullPhone: '186-1145-6620',
    contactEmail: 'fengtai-91@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码咨询丰台创新港 OPC 政策'
  },

  // ================= 深圳市 =================
  {
    id: 'opc-sz-ns-17',
    city: '深圳市',
    district: '南山区',
    name: '前海深港 AI 超级个体创客中心',
    address: '深圳市南山区梦海大道前海深港青年梦工场北区 B 栋',
    summary:
      '面向大湾区 AI 工程师与一人公司创业者，提供跨境算力专线、最高 30 万元项目交付奖励、深港双创基金对接及极速商事登记服务。',
    policies: ['免费工位', '算力支持', '创业投资', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首批 12 个月零租金工位' },
      { key: '算力支持', supported: true, statusDesc: '鹏城云脑算力配额补贴' },
      { key: '创业投资', supported: true, statusDesc: '深港科创直投基金对接' },
      { key: '工商注册', supported: true, statusDesc: '1 个工作日极速领照' }
    ],
    contactName: '林经理',
    maskedPhone: '186****7305',
    fullPhone: '186-8892-7305',
    contactEmail: 'qianhai-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:30',
    qrHint: '扫码咨询前海 OPC 补贴与入驻通道'
  },

  // ================= 杭州市 =================
  {
    id: 'opc-hz-bj-18',
    city: '杭州市',
    district: '滨江区',
    name: '滨江硅谷 AI 极客部落',
    address: '杭州市滨江区物联网街 451 号芯图大厦 12 层',
    summary:
      '聚焦智能体开发与开源模型工程化落地，提供免费 GPU 实验集群配额、青年人才公寓租金减免、悬赏任务零佣金及早期创投辅导。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '高新区免租联合办公席位' },
      { key: '算力支持', supported: true, statusDesc: '年度最高 25 万算力券' },
      { key: '创业投资', supported: true, statusDesc: '滨江“5050”创业资助对接' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '周顾问',
    maskedPhone: '158****3190',
    fullPhone: '158-6812-3190',
    contactEmail: 'binjiang-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码联系滨江硅谷 AI 极客部落运营官'
  },

  // ================= 成都市 =================
  {
    id: 'opc-cd-jj-19',
    city: '成都市',
    district: '锦江区',
    name: 'AI智算OPC人才社区',
    address: '四川省成都市锦江区西部金融创新中心',
    summary:
      '位于成都市锦江区西部金融创新中心，聚焦 AI 算力调度、金融大模型与智能体开发，面向认证超级个体提供拎包入驻与专项政策扶持。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '认证人才免租工位 6-12 月' },
      { key: '算力支持', supported: true, statusDesc: '成都智算中心普惠算力券' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '锦江区免费注册地址托管' }
    ],
    contactName: '罗经理',
    maskedPhone: '138****4902',
    fullPhone: '138-8041-4902',
    contactEmail: 'jinjiang-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码预约 AI 智算 OPC 人才社区参观'
  },
  {
    id: 'opc-cd-gx-20',
    city: '成都市',
    district: '高新区',
    name: '天府智算IT·OPC',
    address: '四川省成都市高新区天府大道中段 1268 号天府软件园 E 区',
    summary:
      '聚焦 AI+实体经济，采用“一人+单点突破”的轻量化创业模式，配套成都智算机时补贴、开放工位与全流程财税合规托管。',
    policies: ['免费工位', '算力支持', '创业投资', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '认证成员 12 个月免费工位' },
      { key: '算力支持', supported: true, statusDesc: '成都智算中心 5 折机时' },
      { key: '创业投资', supported: true, statusDesc: '高新区天使母基金对接' },
      { key: '工商注册', supported: true, statusDesc: '高新区免费注册地址托管' }
    ],
    contactName: '赵经理',
    maskedPhone: '137****9041',
    fullPhone: '137-0806-9041',
    contactEmail: 'chengdu-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码获取天府智算 IT·OPC 申请表'
  },

  // ================= 天津市 =================
  {
    id: 'opc-tj-hp-21',
    city: '天津市',
    district: '和平区',
    name: '模域OPC社区（天津首个OPC创业者专属社区）',
    address: '天津市和平区解放北路117号和平创新广场',
    summary:
      '依托和平区现代服务业与数字金融生态，天津市首个 OPC 创业者专属社区，打造低成本一人公司办公空间与一站式商事落地服务。',
    policies: ['免费工位', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首批入驻享 6 个月免租' },
      { key: '算力支持', supported: false, statusDesc: '详情面议' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '和平区政务专窗极速注册' }
    ],
    contactName: '郭经理',
    maskedPhone: '138****2074',
    fullPhone: '138-2019-2074',
    contactEmail: 'tianjin-moyu@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码联系模域 OPC 社区入驻顾问'
  },
  {
    id: 'opc-tj-bh-22',
    city: '天津市',
    district: '滨海新区',
    name: '创客方舟·AI Star基地（天津首家AIGC专业OPC基地）',
    address: '天津市滨海新区于家堡创新中心',
    summary:
      '天津滨海新区创新生态基地，天津首家 AIGC 与智能体专业 OPC 基地，配套滨海算力资源、免租研发工位与创投对接服务。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首年免租研发工位' },
      { key: '算力支持', supported: true, statusDesc: '滨海智算中心专项额度' },
      { key: '创业投资', supported: true, statusDesc: '滨海科创引导基金对接' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '马顾问',
    maskedPhone: '139****5518',
    fullPhone: '139-2045-5518',
    contactEmail: 'binhai-aistar@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码咨询创客方舟 AI Star 基地'
  },
  {
    id: 'opc-tj-bh-23',
    city: '天津市',
    district: '滨海新区',
    name: '智慧山【未来营】OPC社区',
    address: '天津市滨海高新区华苑产业园智慧山',
    summary:
      '天津高新区科创智慧山产业园区 OPC 社区，聚焦数字文创、交互设计与大模型轻应用开发者，提供灵活办公席位与算力补贴。',
    policies: ['免费工位', '算力支持'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '创客社区免费联合办公' },
      { key: '算力支持', supported: true, statusDesc: '高新区推理算力券补贴' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '冯专员',
    maskedPhone: '158****7423',
    fullPhone: '158-2214-7423',
    contactEmail: 'zhihuishan-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码对接智慧山未来营 OPC 社区'
  },

  // ================= 合肥市 =================
  {
    id: 'opc-hf-gx-24',
    city: '合肥市',
    district: '高新区',
    name: '模立方OPC社区（合肥首个OPC社区）',
    address: '合肥市高新区创新大道量子产业园（中国声谷核心区）',
    summary:
      '合肥首个大模型与超级个体专属 OPC 社区，配套 1000 万元专项创投基金支持，打通算力调度、模型微调与场景商业化落地。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首批入驻 12 个月免租' },
      { key: '算力支持', supported: true, statusDesc: '合肥智算中心专项算力券' },
      { key: '创业投资', supported: true, statusDesc: '1000 万元专项种子基金' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '程经理',
    maskedPhone: '139****3681',
    fullPhone: '139-5604-3681',
    contactEmail: 'hefei-molifang@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码咨询合肥模立方 OPC 社区政策'
  },
  {
    id: 'opc-hf-gx-25',
    city: '合肥市',
    district: '高新区',
    name: '科大讯飞AI创业营OPC社区',
    address: '合肥市高新区望江西路666号科大讯飞人工智能园区',
    summary:
      '高新区依托科大讯飞星火大模型打造的 AI 生态 OPC 社区，提供开放平台算力补贴、模型工程化指导及千行百业商业场景对接。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: 'AI 创业营专属免费工位' },
      { key: '算力支持', supported: true, statusDesc: '星火大模型 API 与算力补贴' },
      { key: '创业投资', supported: true, statusDesc: '讯飞生态创投基金直投' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '汪顾问',
    maskedPhone: '151****8920',
    fullPhone: '151-5518-8920',
    contactEmail: 'iflytek-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码报名科大讯飞 AI 创业营 OPC 社区'
  },
  {
    id: 'opc-hf-ss-26',
    city: '合肥市',
    district: '蜀山区',
    name: '天鹅湖OPC众创空间',
    address: '合肥市蜀山区政务区天鹅湖科创中心',
    summary:
      '位于高科技与生产性服务业高度集聚核心地段，聚焦智能制造、人工智能与大模型应用等战略性新兴产业，提供便捷商事落地支持。',
    policies: ['免费工位', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '众创空间免租席位支持' },
      { key: '算力支持', supported: false, statusDesc: '详情面议' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '政务区一站式企业注册' }
    ],
    contactName: '徐经理',
    maskedPhone: '138****9123',
    fullPhone: '138-6612-9123',
    contactEmail: 'tianehu-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码对接天鹅湖 OPC 众创空间'
  },

  // ================= 济南市 =================
  {
    id: 'opc-jn-gx-27',
    city: '济南市',
    district: '高新区',
    name: '山东（济南）人工智能岛',
    address: '山东省济南市高新区新泺大街核心起步区',
    summary:
      '济南人工智能核心载体，位于高新区齐鲁软件园片区，总规划面积约 2 万平方米，汇聚算力调度、模型验证、数据交易与 OPC 生态。',
    policies: ['免费工位', '算力支持', '创业投资', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首批团队最长 12 月免租' },
      { key: '算力支持', supported: true, statusDesc: '济南超算与智算券直补' },
      { key: '创业投资', supported: true, statusDesc: '省市科创母基金跟投支持' },
      { key: '工商注册', supported: true, statusDesc: '高新区免费注册托管' }
    ],
    contactName: '孔主任',
    maskedPhone: '139****6408',
    fullPhone: '139-5312-6408',
    contactEmail: 'jinan-aiisland@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码对接山东（济南）人工智能岛'
  },
  {
    id: 'opc-jn-gx-28',
    city: '济南市',
    district: '高新区',
    name: '齐鲁软件园',
    address: '山东省济南市高新区舜华路1766号',
    summary:
      '济南软件产业核心承载园区，济南市重点政策赋能的 AI 与 OPC 创业社区重要物理节点，配套完整软件研发与开源协作生态。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '软件园创客中心免租工位' },
      { key: '算力支持', supported: true, statusDesc: '高新区年度算力券补贴' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '园区政务专窗全程代办' }
    ],
    contactName: '孟经理',
    maskedPhone: '186****7193',
    fullPhone: '186-6014-7193',
    contactEmail: 'qilu-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码获取齐鲁软件园 OPC 入驻指引'
  },
  {
    id: 'opc-jn-lx-29',
    city: '济南市',
    district: '历下区',
    name: '历下人工智能大厦',
    address: '山东省济南市历下区经十路CBD核心区',
    summary:
      '依托历下区中央商务区区位与数字经济产业优势，面向 AI 应用研发与超级个体开放高标准研发空间、算力券与创投路演对接。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: 'CBD 商务楼宇补贴工位' },
      { key: '算力支持', supported: true, statusDesc: '历下区算力补贴专项计划' },
      { key: '创业投资', supported: true, statusDesc: '产融合作天使基金对接' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '魏顾问',
    maskedPhone: '150****8324',
    fullPhone: '150-9871-8324',
    contactEmail: 'lixia-ai@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码咨询历下人工智能大厦政策'
  },

  // ================= 青岛市 =================
  {
    id: 'opc-qd-ls-30',
    city: '青岛市',
    district: '崂山区',
    name: '青岛全球创业加速器',
    address: '山东省青岛市崂山区株洲路核心科创走廊',
    summary:
      '位于崂山区株洲路科创聚集区，全球创业加速平台与 AI 智能体孵化社区，提供免费工位、算力补贴及跨境商业资源对接。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '加速器首年免租工位' },
      { key: '算力支持', supported: true, statusDesc: '崂山区算力券补贴支持' },
      { key: '创业投资', supported: true, statusDesc: '海尔资本等产业基金对接' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '姜经理',
    maskedPhone: '185****4019',
    fullPhone: '185-6172-4019',
    contactEmail: 'qingdao-accel@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码联系青岛全球创业加速器'
  },
  {
    id: 'opc-qd-ls-31',
    city: '青岛市',
    district: '崂山区',
    name: '“繁星空间”青岛国际创新园OPC创业孵化平台',
    address: '山东省青岛市崂山区松岭路169号国际创新园',
    summary:
      '新一代信息技术与大模型垂直应用孵化基地，面向一人公司与初创团队提供免租研发工位、市级算力补贴与商事登记托管。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '国际创新园免费办公席位' },
      { key: '算力支持', supported: true, statusDesc: '最高 20 万市级算力补贴' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '园区免费注册与政策代办' }
    ],
    contactName: '于专员',
    maskedPhone: '136****5290',
    fullPhone: '136-8762-5290',
    contactEmail: 'qingdao-fanxing@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码预约繁星空间 OPC 入驻咨询'
  },

  // ================= 南通市 =================
  {
    id: 'opc-nt-cc-32',
    city: '南通市',
    district: '崇川区',
    name: '南通新电院OPC社区',
    address: '江苏省南通市崇川区青年东路科创园',
    summary:
      '基于南通市 OPC 产业扶持政策，聚焦工业 AI、智能硬件与行业大模型应用研发，提供灵活工位、算力补贴与工商代办服务。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首年免租研发工位' },
      { key: '算力支持', supported: true, statusDesc: '南通市算力消费券支持' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '崇川区一站式商事登记' }
    ],
    contactName: '施经理',
    maskedPhone: '139****7034',
    fullPhone: '139-6291-7034',
    contactEmail: 'nantong-cc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码咨询南通新电院 OPC 社区'
  },
  {
    id: 'opc-nt-tz-33',
    city: '南通市',
    district: '通州区',
    name: '通州“江海智汇”OPC社区',
    address: '江苏省南通市通州区高新区科创园',
    summary:
      '依托南通通州高新区 OPC 产业政策，面向人工智能创业者提供最高 40 万元创业扶持补贴、免费工位及算力配额支持。',
    policies: ['免费工位', '算力支持', '创业投资'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '高新区免租独立工位' },
      { key: '算力支持', supported: true, statusDesc: '专区算力券最高补贴 40 万' },
      { key: '创业投资', supported: true, statusDesc: '通州科创天使基金对接' },
      { key: '工商注册', supported: false, statusDesc: '详情面议' }
    ],
    contactName: '曹顾问',
    maskedPhone: '138****8165',
    fullPhone: '138-6274-8165',
    contactEmail: 'nantong-tz@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码了解通州江海智汇 OPC 补贴政策'
  },

  // ================= 南京 / 武汉 / 苏州 / 长春 / 威海 / 马鞍山 =================
  {
    id: 'opc-nj-jb-34',
    city: '南京市',
    district: '江北新区',
    name: '江北新区研创园数字孪生社区',
    address: '南京市浦口区团结路 99 号孵鹰大厦 C 座 6 层',
    summary:
      '依托南京软件与网络安全产业集群，重点扶持 AI 安全、数字孪生靶场与工业大模型团队，提供算力券、专项基金及免租办公空间。',
    policies: ['免费工位', '算力支持', '创业投资', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '首年免租研发工位 2-6 席' },
      { key: '算力支持', supported: true, statusDesc: '江北智算中心专项额度' },
      { key: '创业投资', supported: true, statusDesc: '新区科创母基金跟投支持' },
      { key: '工商注册', supported: true, statusDesc: '全程代办营业执照与开户' }
    ],
    contactName: '吴主任',
    maskedPhone: '159****2846',
    fullPhone: '159-5180-2846',
    contactEmail: 'nanjing-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码对接江北新区研创园入驻顾问'
  },
  {
    id: 'opc-wh-dh-35',
    city: '武汉市',
    district: '东湖高新区',
    name: '光谷未来科技城 AI 创客枢纽',
    address: '武汉市东湖高新区高新大道 999 号未来科技城 B3 栋',
    summary:
      '联动武大、华科等高校科研力量，为青年 AI 开发者提供共享实训工位、武汉超算/智算普惠补贴以及产学研商业化转化加速服务。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '高校毕业 5 年内免费工位' },
      { key: '算力支持', supported: true, statusDesc: '光谷算力券最高补贴 20 万' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '光谷政务中心专窗代办' }
    ],
    contactName: '刘经理',
    maskedPhone: '189****6138',
    fullPhone: '189-7124-6138',
    contactEmail: 'guanggu-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码咨询光谷 AI 创客枢纽入驻细则'
  },
  {
    id: 'opc-sz-gy-36',
    city: '苏州市',
    district: '工业园区',
    name: '苏州工业园区人工智能产业孵化社区',
    address: '苏州市工业园区金鸡湖大道 88 号人工智能产业园 G2 栋',
    summary:
      '深度融合长三角智能制造与工业质检场景，为超级个体团队提供免费工位、行业标杆客户场景开放及金鸡湖领军人才创业资助对接。',
    policies: ['免费工位', '创业投资', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '园区精选工位 6-12 个月免租' },
      { key: '算力支持', supported: false, statusDesc: '详情面议' },
      { key: '创业投资', supported: true, statusDesc: '领军人才项目最高 100 万资助' },
      { key: '工商注册', supported: true, statusDesc: '园区一站式注册与法律咨询' }
    ],
    contactName: '孙顾问',
    maskedPhone: '188****5529',
    fullPhone: '188-6210-5529',
    contactEmail: 'suzhou-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 18:00',
    qrHint: '扫码对接苏州工业园区 OPC 孵化顾问'
  },
  {
    id: 'opc-cc-jy-37',
    city: '长春市',
    district: '净月高新区',
    name: '吉林青年创客OPC创新中心',
    address: '吉林省长春市净月高新区国际影都科创园',
    summary:
      '位于长春净月高新区国际影都影视数字化基地，聚焦 AI 数字内容生成与文化科技融合的 OPC 创新孵化社区。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '青年创业者免租办公席位' },
      { key: '算力支持', supported: true, statusDesc: '影视渲染与 AIGC 算力补贴' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '净月高新区免费注册辅导' }
    ],
    contactName: '崔经理',
    maskedPhone: '135****6091',
    fullPhone: '135-0441-6091',
    contactEmail: 'changchun-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码对接吉林青年创客 OPC 创新中心'
  },
  {
    id: 'opc-wh-hc-38',
    city: '威海市',
    district: '环翠区',
    name: '威海国际人才港OPC创业街区',
    address: '山东省威海市环翠区文化中路（威海国际人才港）',
    summary:
      '依托威海高层次人才服务体系与海滨宜居生态，面向数字游民与 AI 一人公司提供免费工位、算力补贴与创业落地辅导。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '人才港免租海景创客工位' },
      { key: '算力支持', supported: true, statusDesc: '威海智算节点普惠算力券' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '人才服务专窗免费代办' }
    ],
    contactName: '董顾问',
    maskedPhone: '138****4120',
    fullPhone: '138-6310-4120',
    contactEmail: 'weihai-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码咨询威海国际人才港 OPC 街区'
  },
  {
    id: 'opc-mas-hs-39',
    city: '马鞍山市',
    district: '花山区',
    name: '马鞍山市青年创新创业联合会OPC社区',
    address: '安徽省马鞍山市花山区软件园科创中心',
    summary:
      '马鞍山首个 OPC 社区示范节点，打造低门槛一人公司创业空间，重点聚焦人工智能应用、工业软件与数字传媒等领域。',
    policies: ['免费工位', '算力支持', '工商注册'],
    policyDetails: [
      { key: '免费工位', supported: true, statusDesc: '软件园首批 12 个月免租' },
      { key: '算力支持', supported: true, statusDesc: '长三角协同算力补贴' },
      { key: '创业投资', supported: false, statusDesc: '详情面议' },
      { key: '工商注册', supported: true, statusDesc: '花山区绿色通道快速发照' }
    ],
    contactName: '严经理',
    maskedPhone: '139****5832',
    fullPhone: '139-5552-5832',
    contactEmail: 'maanshan-opc@xctf-ai.cn',
    serviceHours: '工作日 09:00 - 17:30',
    qrHint: '扫码联系马鞍山 OPC 社区入驻专员'
  }
];
