import React, { useState, useMemo, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';
import { useApp } from '../../context/AppContext';
import { FeedPost, CommunityBoard } from '../../types';
import { sortCommunityPosts } from '../../utils/communityScore';
import { 
  Users, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Send, 
  Sparkles, 
  BookOpen,
  HelpCircle,
  Compass,
  TrendingUp,
  Coffee,
  Plus,
  Search,
  Bookmark,
  X,
  Eye,
  Tag as TagIcon,
  ArrowLeft,
  FileText,
  CheckCircle2,
  Bold,
  Italic,
  Heading,
  Code,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  CornerDownRight,
  Edit3,
  Heart,
  Pin,
  Layers,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  ArrowUp,
  Trash2,
  AlertCircle
} from 'lucide-react';
import { validateTextOnlyComment } from '../../utils/commentValidator';
import { mockUserPostsExtended } from '../../data/mockWorkspaceCommunity';

// 社区帖子首图解析助手：取帖子详情中的第一张图片，若无图片则无封面
const getPostFirstImage = (p: FeedPost): string | null => {
  if (p.images && p.images.length > 0 && p.images[0]) {
    return p.images[0];
  }
  if (p.content) {
    const mdMatch = p.content.match(/!\[.*?\]\((https?:\/\/[^\s\)]+|data:image\/[^\s\)]+)\)/);
    if (mdMatch && mdMatch[1]) {
      return mdMatch[1];
    }
    const htmlMatch = p.content.match(/<img[^>]+src=["'](https?:\/\/[^"'>]+|data:image\/[^"'>]+)["']/i);
    if (htmlMatch && htmlMatch[1]) {
      return htmlMatch[1];
    }
  }
  return null;
};

// 敏感词审核库
const SENSITIVE_WORDS = [
  '涉黄', '暴力', '反动', '博彩', '违禁', '广告推销', '政治敏感', '刷单', '黑产', 
  '欺诈', '骂人', '傻逼', '垃圾网站', '攻击辱骂', '代考', '洗钱'
];

// 敏感词自动审核函数，返回命中的敏感词或 null
const checkSensitiveContent = (text: string): string | null => {
  if (!text) return null;
  for (const word of SENSITIVE_WORDS) {
    if (text.includes(word)) {
      return word;
    }
  }
  return null;
};

interface BoardConfig {
  id: 'all' | CommunityBoard;
  label: string;
  desc: string;
  icon: React.ReactNode;
}

interface LocalReply {
  id: string;
  author: string;
  avatar: string;
  authorTag?: string;
  content: string;
  time: string;
  timestamp?: number;
  replyToUser?: string;
  likesCount: number;
  isLiked?: boolean;
}

interface LocalComment {
  id: string;
  author: string;
  avatar: string;
  authorTag?: string;
  content: string;
  time: string;
  timestamp?: number;
  likesCount: number;
  isLiked?: boolean;
  replies: LocalReply[];
  images?: string[];
}

export const CommunityView: React.FC = () => {
  const { 
    posts, 
    createPost, 
    user, 
    showToast, 
    communityBoards, 
    recordPostView,
    selectedPostIdForDetail,
    setSelectedPostIdForDetail,
    selectedPostDetailOrigin,
    setSelectedPostDetailOrigin,
    setActiveTab,
    setWorkspaceSubTab,
    setWorkspaceCommunitySubTab
  } = useApp();

  // Navigation View Mode: 'feed' | 'publish' | 'detail'
  const [viewMode, setViewMode] = useState<'feed' | 'publish' | 'detail'>('feed');
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);

  // Sync with AppContext navigation if navigated from other pages (e.g. Workspace Community)
  useEffect(() => {
    if (selectedPostIdForDetail) {
      recordPostView(selectedPostIdForDetail);
      setSelectedPostId(selectedPostIdForDetail);
      setViewMode('detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedPostIdForDetail]);

  // State
  const [activeBoard, setActiveBoard] = useState<'all' | CommunityBoard>('all');
  const [activeFilter, setActiveFilter] = useState<'recommend' | 'latest'>('recommend');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Local interaction states
  const [collectedPosts, setCollectedPosts] = useState<Record<string, boolean>>({});
  const [postLikesMap, setPostLikesMap] = useState<Record<string, { count: number; isLiked: boolean }>>({});
  
  // Comments and Replies Map keyed by postId
  const [commentsMap, setCommentsMap] = useState<Record<string, LocalComment[]>>({});
  const [mainCommentInput, setMainCommentInput] = useState('');
  // 评论回复目标：一级评论ID、被回复人姓名、可选的具体回复ID
  const [replyTarget, setReplyTarget] = useState<{
    commentId: string;
    targetAuthor: string;
    replyId?: string;
  } | null>(null);
  const [replyInput, setReplyInput] = useState('');

  // 评论区交互控制状态
  // 1. 一级评论无限滚动：当前已加载展示的一级评论条数（初始 20 条，触底自动加载下 20 条）
  const [visibleTopCommentsCount, setVisibleTopCommentsCount] = useState<number>(20);
  const infiniteScrollSentinelRef = useRef<HTMLDivElement>(null);

  // 2. 评论输入框悬浮状态与回到顶部
  const inlineInputRef = useRef<HTMLDivElement>(null);
  const [isFloatingInput, setIsFloatingInput] = useState<boolean>(false);
  const [isFullInputModalOpen, setIsFullInputModalOpen] = useState<boolean>(false);

  // 3. 二级回复智能预览与展开状态：commentId -> boolean（默认折叠仅显示点赞数>10的前3条智能预览）
  const [expandedRepliesMap, setExpandedRepliesMap] = useState<Record<string, boolean>>({});
  // 5. 二级回复展开后的分页页码：commentId -> number（展开后分页展示，每页10条，无需“加载更多回复”）
  const [repliesPageMap, setRepliesPageMap] = useState<Record<string, number>>({});

  // 6. 评论区锚点 Ref，用于发布评论后平滑滚回顶部
  const commentsSectionRef = useRef<HTMLDivElement>(null);

  // Publishing State
  const [newPostBoard, setNewPostBoard] = useState<CommunityBoard>('干货分享');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTags, setNewPostTags] = useState<string[]>(['DeepSeek', 'Agent']);
  const [tagInput, setTagInput] = useState('');
  const [editorTab, setEditorTab] = useState<'write' | 'preview'>('write');

  // Helper for dynamic board icons
  const getBoardIcon = (name: string) => {
    switch (name) {
      case '干货分享': return <BookOpen className="w-4 h-4 text-emerald-600" />;
      case '求助答疑': return <HelpCircle className="w-4 h-4 text-amber-600" />;
      case '前沿观察': return <Compass className="w-4 h-4 text-indigo-600" />;
      case '赚钱交流': return <TrendingUp className="w-4 h-4 text-rose-600" />;
      case '同行交流': return <Users className="w-4 h-4 text-cyan-600" />;
      case '娱乐灌水': return <Coffee className="w-4 h-4 text-purple-600" />;
      default: return <Layers className="w-4 h-4 text-slate-600" />;
    }
  };

  // 板块停用后前台社区中应该隐藏此板块，并按后台排序权重展示
  const enabledBoards = useMemo(() => {
    return communityBoards
      .filter(b => b.status === '已启用')
      .sort((a, b) => a.sortWeight - b.sortWeight);
  }, [communityBoards]);

  const boardConfigs: BoardConfig[] = useMemo(() => {
    return [
      {
        id: 'all',
        label: '全部板块',
        desc: '浏览全站 AI 开发者最新实践、经验与问答',
        icon: <Sparkles className="w-4 h-4 text-indigo-600" />
      },
      ...enabledBoards.map(b => ({
        id: b.name as CommunityBoard,
        label: b.name,
        desc: b.description || '社区开发者讨论与分享',
        icon: getBoardIcon(b.name)
      }))
    ];
  }, [enabledBoards]);

  // 如果当前选中的板块被后台停用了，自动回退到“全部板块”
  useEffect(() => {
    if (activeBoard !== 'all') {
      const isStillEnabled = enabledBoards.some(b => b.name === activeBoard);
      if (!isStillEnabled) {
        setActiveBoard('all');
      }
    }
  }, [activeBoard, enabledBoards]);

  // 如果待发帖板块被停用了，自动切换为第一个有效板块
  useEffect(() => {
    const currentBoardObj = communityBoards.find(b => b.name === newPostBoard);
    if (!currentBoardObj || currentBoardObj.status === '已停用') {
      const firstEnabled = enabledBoards[0];
      if (firstEnabled) {
        setNewPostBoard(firstEnabled.name as CommunityBoard);
      }
    }
  }, [communityBoards, enabledBoards, newPostBoard]);

  // Helper to get initial or stored comments for a post
  const getPostComments = (postId: string): LocalComment[] => {
    if (commentsMap[postId]) {
      return commentsMap[postId];
    }

    const now = Date.now();

    // 默认提供丰富且真实的多级评论数据：
    // - 一级评论包含 26 条（首屏展示前20条，可点击“加载更多评论”加载下一页）
    // - 评论1 包含 8 条二级回复（默认展示前3条，可展开剩余5条）
    // - 评论2 包含 22 条二级回复（超出20条，支持展开20条后再“加载更多回复”与“收起”）
    // - 支持“按时间倒序”与“按热度（点赞数）”排序
    const baseComments: LocalComment[] = [
      {
        id: 'c_top_1',
        author: '张Dev-算法架构',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        authorTag: '高级开发者',
        content: '干货满满！请问在上下文超过 32k 时，启用 `--kv-cache-dtype fp8` 会不会引起精度下降导致思维链推理中断？',
        time: '1小时前',
        timestamp: now - 3600 * 1000 * 1,
        likesCount: 28,
        isLiked: false,
        // 14条二级回复：按时间正序排列（最早在前）
        replies: [
          {
            id: 'r_1_1',
            author: '王AI-深度架构师',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            authorTag: '楼主',
            content: '我们对 GSM8K 与 HumanEval 进行了专门评测，FP8 产生的 PPL 困惑度漂移在 0.3% 以内，完全不影响逻辑链条输出。',
            time: '50分钟前',
            timestamp: now - 3000 * 1000,
            replyToUser: '张Dev-算法架构',
            likesCount: 24, // >10 热门
            isLiked: false
          },
          {
            id: 'r_1_2',
            author: '陈Agent-极客',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            authorTag: '极客开发者',
            content: '非常受用！如果并发请求量大，建议再结合投机采样（Speculative Decoding）降低显存占用。',
            time: '45分钟前',
            timestamp: now - 2700 * 1000,
            replyToUser: '王AI-深度架构师',
            likesCount: 18, // >10 热门
            isLiked: false
          },
          {
            id: 'r_1_3',
            author: '李向量-数据专家',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
            authorTag: '数据库专家',
            content: '请教下大家，投机采样用什么草稿模型比较合适？1.5B 还是 0.5B？',
            time: '40分钟前',
            timestamp: now - 2400 * 1000,
            replyToUser: '陈Agent-极客',
            likesCount: 5,
            isLiked: false
          },
          {
            id: 'r_1_4',
            author: '陈Agent-极客',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            authorTag: '极客开发者',
            content: '推荐用 Qwen2.5-Coder-1.5B 作为草稿模型，兼顾语法严谨与解码速度。',
            time: '35分钟前',
            timestamp: now - 2100 * 1000,
            replyToUser: '李向量-数据专家',
            likesCount: 12, // >10 (第4高赞，预览上限3条故展开后才可见)
            isLiked: false
          },
          {
            id: 'r_1_5',
            author: 'AI智囊',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            authorTag: '官方架构师',
            content: '投机采样的投机窗口长度建议设置多少？太大是不是会反向减速？',
            time: '30分钟前',
            timestamp: now - 1800 * 1000,
            replyToUser: '陈Agent-极客',
            likesCount: 4,
            isLiked: false
          },
          {
            id: 'r_1_6',
            author: '极客小千',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            authorTag: '全栈极客',
            content: '实测设置为 3~5 效益最佳，太长由于接受率衰减反而增加验证延迟。',
            time: '25分钟前',
            timestamp: now - 1500 * 1000,
            replyToUser: 'AI智囊',
            likesCount: 15, // >10 热门
            isLiked: false
          },
          {
            id: 'r_1_7',
            author: '周模型-工程师',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
            authorTag: '模型工程师',
            content: '感谢小千分享，明天在集群上实操压测一下！',
            time: '15分钟前',
            timestamp: now - 900 * 1000,
            replyToUser: '极客小千',
            likesCount: 3,
            isLiked: false
          },
          {
            id: 'r_1_8',
            author: '张Dev-算法架构',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
            authorTag: '高级开发者',
            content: '压测结果如果出来，方便在这条回复下同步下对比数据吗？多谢！',
            time: '10分钟前',
            timestamp: now - 600 * 1000,
            replyToUser: '周模型-工程师',
            likesCount: 2,
            isLiked: false
          },
          {
            id: 'r_1_9',
            author: '王AI-深度架构师',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            authorTag: '楼主',
            content: '没问题，明天下午我会更新一版包含 P99 延迟与吞吐 TPS 对比的完整评测表。',
            time: '8分钟前',
            timestamp: now - 480 * 1000,
            replyToUser: '张Dev-算法架构',
            likesCount: 5,
            isLiked: false
          },
          {
            id: 'r_1_10',
            author: '孙智能体-创业者',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            authorTag: '社区成员',
            content: '期待楼主更新！我们也在做客服场景的实时 Agent 流式推理，很关注 TTFT（首字延迟）。',
            time: '7分钟前',
            timestamp: now - 420 * 1000,
            replyToUser: '王AI-深度架构师',
            likesCount: 3,
            isLiked: false
          },
          {
            id: 'r_1_11',
            author: '李向量-数据专家',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
            authorTag: '数据库专家',
            content: 'TTFT 方面，草稿模型提前预热 KV Cache 效果非常明显，基本能压缩到 60ms 以内。',
            time: '5分钟前',
            timestamp: now - 300 * 1000,
            replyToUser: '孙智能体-创业者',
            likesCount: 4,
            isLiked: false
          },
          {
            id: 'r_1_12',
            author: '赵云算力-工程师',
            avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
            authorTag: '算力架构',
            content: '请教下你们是用 Triton Kernel 还是 CUDA C 自定义编译的算子？',
            time: '4分钟前',
            timestamp: now - 240 * 1000,
            replyToUser: '李向量-数据专家',
            likesCount: 2,
            isLiked: false
          },
          {
            id: 'r_1_13',
            author: '王AI-深度架构师',
            avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
            authorTag: '楼主',
            content: '基础层直接使用了 FlashAttention-2 的 Triton 实现，开发成本更低，性能与纯 CUDA 几乎持平。',
            time: '2分钟前',
            timestamp: now - 120 * 1000,
            replyToUser: '赵云算力-工程师',
            likesCount: 6,
            isLiked: false
          },
          {
            id: 'r_1_14',
            author: '极客小千',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
            authorTag: '全栈极客',
            content: '受教了！今晚回去就按照这个思路调整一下我们集群的部署参数。',
            time: '刚刚',
            timestamp: now - 60 * 1000,
            replyToUser: '王AI-深度架构师',
            likesCount: 1,
            isLiked: false
          }
        ]
      },
      {
        id: 'c_top_2',
        author: '李向量-数据专家',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
        authorTag: '数据库专家',
        content: '我们在生产环境压测了 vLLM 的 PagedAttention 算子调度，吞吐量比原生 HuggingFace 提升了 4.2 倍！',
        time: '2小时前',
        timestamp: now - 7200 * 1000,
        likesCount: 45,
        isLiked: false,
        // 22条二级回复：按时间正序排列（最早在前）
        replies: Array.from({ length: 22 }, (_, idx) => ({
          id: `r_2_${idx + 1}`,
          author: idx % 3 === 0 ? '王AI-深度架构师' : idx % 3 === 1 ? '技术极客' : '算力运维小哥',
          avatar: `https://images.unsplash.com/photo-${1500000000000 + ((idx * 11111) % 50000000)}?w=100&auto=format&fit=crop&q=80`,
          authorTag: idx % 2 === 0 ? '系统架构' : '测试工程师',
          content: idx === 0 
            ? '请问是在什么 GPU 卡型上测试的？4090 还是 A100？'
            : idx === 1 
            ? '在双卡 A100 SXM 80GB 上跑的，批大小设为了 64。'
            : `测试轮次 #${idx + 1}：针对第 ${idx + 1} 批次 Prompt 长度混合调优，连续运行无内存泄漏。`,
          time: `${Math.max(1, 60 - idx * 2)}分钟前`,
          timestamp: now - (60 - idx * 2) * 60 * 1000,
          replyToUser: idx === 0 ? '李向量-数据专家' : idx % 2 === 1 ? '王AI-深度架构师' : '技术极客',
          likesCount: idx === 0 ? 19 : idx === 1 ? 14 : Math.min(8, Math.floor((22 - idx) / 3) + 1),
          isLiked: false
        }))
      },
      ...Array.from({ length: 48 }, (_, i) => {
        const commentId = `c_top_${i + 3}`;
        const authors = [
          '刘数据-LLM研究员', '赵云算力-工程师', '孙智能体-创业者', '钱前沿-技术总监', 
          '吴大模型-实战派', '郑开源-布道师', '冯提示词-调优师', '陈算力-架构师',
          '楚模型-算法专家', '魏微调-研究员', '蒋工程-技术专家', '沈推理-优化师'
        ];
        const topics = [
          '文章中提到的 chunk 向量切分大小具体是多少？我们用的 512 tokens 召回率还行。',
          '收藏了，这个配置在我们的 RTX 4090 单卡工作站上也能正常跑起来吗？',
          '实测确实有效！感谢博主分享，给社区贡献了高价值实践总结！',
          '对于长文本上下文，有没有做过 needle-in-a-haystack 大海捞针的召回测试？',
          '请问关于 speculative decoding，在多卡张量并行（TP）下的兼容性如何？',
          '关注了楼主，期待下一期关于多模态模型部署和量化的深入剖析！'
        ];
        const commentLikes = [35, 29, 21, 18, 16, 14, 11, 9, 8, 6, 5, 4, 3, 2, 1][i % 15];
        return {
          id: commentId,
          author: authors[i % authors.length],
          avatar: `https://images.unsplash.com/photo-${1530000000000 + ((i * 23456) % 50000000)}?w=100&auto=format&fit=crop&q=80`,
          authorTag: i % 2 === 0 ? '极客认证' : '社区成员',
          content: `${topics[i % topics.length]} [第 ${i + 3} 楼实践探讨]`,
          time: `${i + 3}小时前`,
          timestamp: now - (i + 3) * 3600 * 1000,
          likesCount: commentLikes,
          isLiked: false,
          replies: i === 0 ? [
            // c_top_3: 4条回复，全部点赞数<=10，测试“无高赞回复时不展示预览内容，仅显示‘共4条回复’入口”
            {
              id: `r_3_1`,
              author: '王AI-深度架构师',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              authorTag: '楼主',
              content: '感谢反馈！单卡 4090 可以跑 8B 模型的 FP8 量化版本，显存占用约 10GB 左右。',
              time: '2小时前',
              timestamp: now - 2 * 3600 * 1000,
              replyToUser: '刘数据-LLM研究员',
              likesCount: 6,
              isLiked: false
            },
            {
              id: `r_3_2`,
              author: '全栈运维',
              avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
              authorTag: '运维工程师',
              content: '注意驱动版本需要升级到 535 以上，CUDA 建议 12.2。',
              time: '1.5小时前',
              timestamp: now - 1.5 * 3600 * 1000,
              replyToUser: '王AI-深度架构师',
              likesCount: 3,
              isLiked: false
            },
            {
              id: `r_3_3`,
              author: '技术小白',
              avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
              authorTag: '社区新手',
              content: '请问有 Dockerfile 一键拉起镜像的方案吗？',
              time: '1小时前',
              timestamp: now - 1 * 3600 * 1000,
              replyToUser: '全栈运维',
              likesCount: 2,
              isLiked: false
            },
            {
              id: `r_3_4`,
              author: '王AI-深度架构师',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              authorTag: '楼主',
              content: '在文章末尾的 GitHub 仓库中有准备好的 docker-compose.yml 文件。',
              time: '30分钟前',
              timestamp: now - 30 * 60 * 1000,
              replyToUser: '技术小白',
              likesCount: 4,
              isLiked: false
            }
          ] : i % 5 === 0 ? [
            {
              id: `r_extra_${i}_1`,
              author: '王AI-深度架构师',
              avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
              authorTag: '楼主',
              content: '感谢支持，大家有什么好的架构思路欢迎随时跟帖！',
              time: `${i + 2}小时前`,
              timestamp: now - (i + 2) * 3600 * 1000,
              replyToUser: authors[i % authors.length],
              likesCount: 1,
              isLiked: false
            }
          ] : []
        };
      })
    ];

    return baseComments;
  };

  // Filter & Search Logic
  const filteredPosts = useMemo(() => {
    let list = [...posts];

    // 1. 板块停用后前台社区中应该隐藏此板块的帖子
    const disabledBoardNames = new Set(
      communityBoards.filter(b => b.status === '已停用').map(b => b.name)
    );
    list = list.filter(p => !disabledBoardNames.has(p.board));

    // 2. 仅展示已审核通过或发布的帖子
    list = list.filter(p => !p.status || p.status === '已通过' || p.status === '已发布');

    // 3. Filter by board
    if (activeBoard !== 'all') {
      list = list.filter(p => p.board === activeBoard);
    }

    // 4. Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        p.content.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    // 5. 排序规则：
    // - 后台帖子的置顶效果在前台可见，最新置顶的靠前 (pinnedAt 倒序)
    // - 加精只是加个“精华”标签，不影响帖子排序
    // - 推荐帖子按照公式实时计算：帖子得分 = 加权互动分 ÷ (发帖小时数 + 2) ^ 1.5
    //   加权互动分 = 评论数×5 + 收藏数×4 + 点赞数×2 + 查看数×0.2
    //   发帖小时数 = 当前时间 - 发帖时间（小时），向下取整，最小为0
    // - 最新帖子按发帖时间倒序
    return sortCommunityPosts(list, activeFilter, {
      likesMap: postLikesMap,
      bookmarksMap: collectedPosts,
      commentsMap: commentsMap
    });
  }, [posts, activeBoard, searchQuery, activeFilter, communityBoards, postLikesMap, collectedPosts, commentsMap]);

  // Selected post object for detail view
  const currentPost = useMemo(() => {
    if (!selectedPostId) return null;
    const found = posts.find(p => p.id === selectedPostId);
    if (found) return found;

    const foundUserPost = mockUserPostsExtended.find(p => p.id === selectedPostId);
    if (foundUserPost) {
      return {
        id: foundUserPost.id,
        title: foundUserPost.title,
        content: foundUserPost.content,
        board: foundUserPost.board as CommunityBoard,
        author: user.name,
        authorAvatar: user.avatar,
        authorTag: '社区先锋',
        time: foundUserPost.createdAt,
        likesCount: foundUserPost.likesCount,
        commentsCount: foundUserPost.commentsCount,
        viewsCount: foundUserPost.likesCount * 12 + 120,
        tags: [foundUserPost.board, '经验分享'],
        images: [],
        isLiked: false,
      } as FeedPost;
    }

    return posts[0];
  }, [selectedPostId, posts, user]);

  // Helper for Board Badge Styling
  const getBoardStyle = (board: CommunityBoard) => {
    switch (board) {
      case '干货分享':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/80';
      case '求助答疑':
        return 'bg-amber-50 text-amber-700 border-amber-200/80';
      case '前沿观察':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200/80';
      case '赚钱交流':
        return 'bg-rose-50 text-rose-700 border-rose-200/80';
      case '同行交流':
        return 'bg-cyan-50 text-cyan-700 border-cyan-200/80';
      case '娱乐灌水':
        return 'bg-purple-50 text-purple-700 border-purple-200/80';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Toggle Bookmark
  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCollectedPosts(prev => {
      const nextState = !prev[id];
      showToast(nextState ? '已成功收藏该条动态' : '已取消收藏');
      return { ...prev, [id]: nextState };
    });
  };

  // Toggle Like for Post
  const handleLikePost = (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setPostLikesMap(prev => {
      const current = prev[postId] || { 
        count: posts.find(p => p.id === postId)?.likesCount || 0, 
        isLiked: posts.find(p => p.id === postId)?.isLiked || false 
      };
      const nextLiked = !current.isLiked;
      const nextCount = nextLiked ? current.count + 1 : Math.max(0, current.count - 1);
      showToast(nextLiked ? '点赞成功！' : '已取消点赞');
      return { ...prev, [postId]: { count: nextCount, isLiked: nextLiked } };
    });
  };

  // Get current post likes info
  const getPostLikes = (post: FeedPost) => {
    if (postLikesMap[post.id]) {
      return postLikesMap[post.id];
    }
    return { count: post.likesCount, isLiked: !!post.isLiked };
  };

  // Open Post Detail - 支持防刷查看计数（同一用户/IP对同一帖子多次查看只计1次）
  const openPostDetail = (postId: string) => {
    recordPostView(postId);
    setSelectedPostId(postId);
    setViewMode('detail');
    setVisibleTopCommentsCount(20);
    setExpandedRepliesMap({});
    setRepliesPageMap({});
    setReplyTarget(null);
    setIsFullInputModalOpen(false);
    setIsFloatingInput(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 监听输入框滚动位置，当输入框超出视口上方时自动固定悬浮在屏幕底部，并提供回到顶部按钮
  useEffect(() => {
    if (viewMode !== 'detail') {
      setIsFloatingInput(false);
      return;
    }

    const handleScroll = () => {
      if (!inlineInputRef.current) return;
      const rect = inlineInputRef.current.getBoundingClientRect();
      // 当原输入框底部滚到视口上方（小于顶部导航栏约60px）时判定为超出可视区域
      setIsFloatingInput(rect.bottom < 60);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [viewMode, selectedPostId]);

  // 一级评论触底无限滚动自动加载下一页
  useEffect(() => {
    if (viewMode !== 'detail') return;

    const sentinel = infiniteScrollSentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setVisibleTopCommentsCount(prev => prev + 20);
      }
    }, { rootMargin: '300px' });

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [viewMode, selectedPostId, visibleTopCommentsCount]);

  // Add Top Level Comment (严格纯文字规范：仅限文字，禁止表情和图片)
  const handleAddMainComment = (postId: string, customContent?: string) => {
    const textToSubmit = (customContent !== undefined ? customContent : mainCommentInput).trim();
    
    // 纯文字规则校验（禁止包含表情符号）
    const validation = validateTextOnlyComment(textToSubmit);
    if (!validation.valid) {
      showToast(validation.message || '请输入评论内容');
      return;
    }

    // 敏感词自动审核
    const sensitiveWord = checkSensitiveContent(textToSubmit);
    if (sensitiveWord) {
      showToast(`评论未通过自动安全审核：包含敏感词【${sensitiveWord}】，请修改后重新提交`);
      return;
    }

    const newComment: LocalComment = {
      id: `c_${Date.now()}`,
      author: user.name || '我的账号',
      avatar: user.avatar,
      authorTag: user.identityTag || '社区成员',
      content: textToSubmit,
      time: '刚刚',
      timestamp: Date.now(),
      likesCount: 0,
      isLiked: false,
      replies: []
    };

    setCommentsMap(prev => {
      const existing = prev[postId] || getPostComments(postId);
      return {
        ...prev,
        [postId]: [newComment, ...existing]
      };
    });

    setMainCommentInput('');
    setIsFullInputModalOpen(false);
    showToast('评论发表成功！已展示在评论区最上方');

    // 发送后评论出现在一级评论列表顶部，平滑滚回原位置
    if (commentsSectionRef.current) {
      commentsSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Add Reply to a Comment (严格纯文字规范：仅限文字，禁止表情)
  // 整个评论区只分两级，评论的回复和评论的回复的回复都按回复时间在二级区域往后排，含敏感词自动审核
  const handleAddReply = (postId: string, commentId: string, targetAuthor: string) => {
    const replyText = replyInput.trim();
    
    // 纯文字规则校验（禁止包含表情符号）
    const validation = validateTextOnlyComment(replyText);
    if (!validation.valid) {
      showToast(validation.message?.replace('评论', '回复') || '请输入回复内容');
      return;
    }

    // 敏感词自动审核
    const sensitiveWord = checkSensitiveContent(replyText);
    if (sensitiveWord) {
      showToast(`回复未通过自动安全审核：包含敏感词【${sensitiveWord}】，请修改后重新提交`);
      return;
    }

    const newReply: LocalReply = {
      id: `r_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      author: user.name || '我的账号',
      avatar: user.avatar,
      authorTag: user.identityTag || '社区成员',
      content: replyText,
      time: '刚刚',
      timestamp: Date.now(),
      replyToUser: targetAuthor,
      likesCount: 0,
      isLiked: false
    };

    let targetPage = 1;
    setCommentsMap(prev => {
      const list = prev[postId] || getPostComments(postId);
      const updatedList = list.map(c => {
        if (c.id === commentId) {
          const nextReplies = [...c.replies, newReply];
          targetPage = Math.ceil(nextReplies.length / 10);
          return {
            ...c,
            replies: nextReplies
          };
        }
        return c;
      });
      return { ...prev, [postId]: updatedList };
    });

    // 自动展开该评论的二级回复并跳转到包含新回复的最后一页（每页10条分页展示）
    setExpandedRepliesMap(prev => ({ ...prev, [commentId]: true }));
    setRepliesPageMap(prev => ({ ...prev, [commentId]: targetPage }));

    setReplyInput('');
    setReplyTarget(null);
    showToast('回复发表成功！');
  };

  // 删除一级评论：连带名下所有二级回复一并移除并自动刷新列表
  const handleDeleteComment = (postId: string, commentId: string) => {
    if (window.confirm('确定要删除该评论吗？其名下的所有二级回复也将一并移除。')) {
      setCommentsMap(prev => {
        const existing = prev[postId] || getPostComments(postId);
        return {
          ...prev,
          [postId]: existing.filter(c => c.id !== commentId)
        };
      });
      showToast('评论及所有二级回复已成功删除');
    }
  };

  // 删除二级回复
  const handleDeleteReply = (postId: string, commentId: string, replyId: string) => {
    if (window.confirm('确定要删除该条二级回复吗？')) {
      setCommentsMap(prev => {
        const existing = prev[postId] || getPostComments(postId);
        const updated = existing.map(c => {
          if (c.id === commentId) {
            return {
              ...c,
              replies: c.replies.filter(r => r.id !== replyId)
            };
          }
          return c;
        });
        return { ...prev, [postId]: updated };
      });
      showToast('二级回复已删除');
    }
  };

  // Toggle Like on Comment
  const handleLikeComment = (postId: string, commentId: string) => {
    setCommentsMap(prev => {
      const list = prev[postId] || getPostComments(postId);
      const updatedList = list.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          const likesCount = isLiked ? c.likesCount + 1 : Math.max(0, c.likesCount - 1);
          return { ...c, isLiked, likesCount };
        }
        return c;
      });
      return { ...prev, [postId]: updatedList };
    });
  };

  // Toggle Like on Reply (in secondary area)
  const handleLikeReply = (postId: string, commentId: string, replyId: string) => {
    setCommentsMap(prev => {
      const list = prev[postId] || getPostComments(postId);
      const updatedList = list.map(c => {
        if (c.id === commentId) {
          const updatedReplies = c.replies.map(r => {
            if (r.id === replyId) {
              const isLiked = !r.isLiked;
              const likesCount = isLiked ? (r.likesCount || 0) + 1 : Math.max(0, (r.likesCount || 0) - 1);
              return { ...r, isLiked, likesCount };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      });
      return { ...prev, [postId]: updatedList };
    });
  };

  // Insert markdown syntax helper
  const insertMarkdownSyntax = (prefix: string, suffix: string = '') => {
    setNewPostContent(prev => {
      if (!prev) return `${prefix}示例文本${suffix}`;
      return `${prev}\n${prefix}示例文本${suffix}`;
    });
  };

  // Tag Handlers in Modal / Page
  const handleAddTag = (tag: string) => {
    const clean = tag.replace(/^#/, '').trim();
    if (clean && !newPostTags.includes(clean)) {
      setNewPostTags(prev => [...prev, clean]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (tag: string) => {
    setNewPostTags(prev => prev.filter(t => t !== tag));
  };

  // Submit Post Logic
  const handlePublishSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newPostContent.trim()) {
      showToast('请填写动态正文内容');
      return;
    }
    const targetBoardObj = communityBoards.find(b => b.name === newPostBoard);
    if (targetBoardObj && targetBoardObj.status === '已停用') {
      showToast('所选板块已被停用，不可选，请选择其他已启用的板块！');
      return;
    }
    createPost(
      newPostContent,
      newPostBoard,
      undefined,
      newPostTitle.trim() || undefined,
      newPostTags.length > 0 ? newPostTags : undefined
    );

    // Reset Form
    setNewPostTitle('');
    setNewPostContent('');
    setNewPostTags(['DeepSeek', 'Agent']);
    setViewMode('feed');
    showToast('动态发布成功，已被收录进社区广场！');
  };

  const quickTags = ['DeepSeek', 'Agent', 'RAG', 'Prompt', '大模型微调', 'SaaS变现', '黑客松', 'ComfyUI', 'Python'];

  // ================= 渲染：详情页 View Mode === 'detail' =================
  if (viewMode === 'detail' && currentPost) {
    const isCollected = !!collectedPosts[currentPost.id];
    const likesInfo = getPostLikes(currentPost);
    const postComments = getPostComments(currentPost.id);
    const totalCommentsCount = postComments.reduce((acc, c) => acc + 1 + (c.replies ? c.replies.length : 0), 0);

    // 一级评论默认按时间倒序排列
    const sortedTopComments = [...postComments].sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

    // 一级评论无限滚动展示列表（首屏20条，触底自动追加）
    const visibleTopComments = sortedTopComments.slice(0, visibleTopCommentsCount);

    return (
      <div className="w-full space-y-6 animate-fade-in pb-16 max-w-4xl mx-auto select-none">
        
        {/* Top Header & Back Button Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-4">
          <button
            onClick={() => {
              if (selectedPostDetailOrigin) {
                const origin = selectedPostDetailOrigin;
                setSelectedPostIdForDetail(null);
                setSelectedPostDetailOrigin(null);
                if (origin.startsWith('workspace')) {
                  setActiveTab('workspace');
                  setWorkspaceSubTab('community');
                  if (origin.includes('posts')) {
                    setWorkspaceCommunitySubTab('posts');
                  } else if (origin.includes('comments')) {
                    setWorkspaceCommunitySubTab('comments');
                  } else if (origin.includes('favorites')) {
                    setWorkspaceCommunitySubTab('favorites');
                  }
                } else {
                  setActiveTab(origin as any);
                }
              } else {
                setViewMode('feed');
                setSelectedPostId(null);
                setSelectedPostIdForDetail(null);
              }
            }}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回</span>
          </button>

          <div className="flex items-center gap-2 flex-wrap">
            {(currentPost.isPinned || currentPost.isTop) && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-rose-50 text-rose-600 border border-rose-200/90 flex items-center gap-1 shadow-2xs">
                <Pin className="w-3.5 h-3.5 text-rose-600 fill-rose-100" />
                置顶
              </span>
            )}
            {currentPost.isEssential && (
              <span className="px-2.5 py-0.5 rounded-lg text-xs font-black bg-amber-50 text-amber-700 border border-amber-200/90 flex items-center gap-1 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 fill-amber-100" />
                精华
              </span>
            )}
            <span className={`px-2.5 py-0.5 rounded-lg text-xs font-bold border ${getBoardStyle(currentPost.board)}`}>
              {currentPost.board}
            </span>
            <span className="text-xs font-bold text-slate-500">动态详情</span>
          </div>
        </div>

        {/* Article Full Detail Card */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden p-6 sm:p-8 space-y-6">
          
          {/* Author Info Banner */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-5">
            <div className="flex items-center gap-3">
              <img 
                src={currentPost.authorAvatar} 
                alt={currentPost.author} 
                className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-100" 
              />
              <div>
                <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>{currentPost.author}</span>
                  <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 text-[10px] font-bold border border-indigo-200/60">
                    {currentPost.authorTag}
                  </span>
                </div>
                <div className="text-xs text-slate-400 font-medium mt-0.5">
                  发布于 {currentPost.time}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <Eye className="w-4 h-4 text-slate-400" />
              <span>{currentPost.viewsCount || 1280} 浏览</span>
            </div>
          </div>

          {/* Article Title */}
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug tracking-tight">
            {currentPost.title || '社区动态分享'}
          </h1>

          {/* Tags */}
          {currentPost.tags && currentPost.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {currentPost.tags.map((t, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-bold flex items-center gap-1 border border-slate-200/80">
                  <TagIcon className="w-3 h-3 text-indigo-500" />
                  #{t}
                </span>
              ))}
            </div>
          )}

          {/* Main Article Content rendered with Markdown */}
          <div className="pt-2 border-t border-slate-100 text-slate-800 text-sm leading-relaxed space-y-4">
            <div className="prose prose-slate max-w-none font-normal leading-relaxed text-slate-800">
              <Markdown>{currentPost.content}</Markdown>
            </div>
          </div>

          {/* Article Images (if any) */}
          {currentPost.images && currentPost.images.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {currentPost.images.map((img, idx) => (
                <div key={idx} className="rounded-2xl overflow-hidden border border-slate-200">
                  <img src={img} alt="article attachment" className="w-full h-56 object-cover hover:scale-105 transition duration-300" />
                </div>
              ))}
            </div>
          )}

          {/* Article Bottom Action Toolbar: Like, Bookmark, Share */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              
              {/* Like Button */}
              <button
                onClick={(e) => handleLikePost(currentPost.id, e)}
                className={`px-5 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition cursor-pointer active:scale-95 ${
                  likesInfo.isLiked 
                    ? 'bg-rose-50 text-rose-600 border-rose-200 shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${likesInfo.isLiked ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>点赞 ({likesInfo.count})</span>
              </button>

              {/* Bookmark/Collect Button */}
              <button
                onClick={(e) => toggleBookmark(currentPost.id, e)}
                className={`px-5 py-2.5 rounded-xl border flex items-center gap-2 text-xs font-bold transition cursor-pointer active:scale-95 ${
                  isCollected 
                    ? 'bg-amber-50 text-amber-600 border-amber-200 shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isCollected ? 'fill-amber-500 text-amber-500' : ''}`} />
                <span>{isCollected ? '已收藏' : '收藏文章'}</span>
              </button>

              {/* Share Button */}
              <button
                onClick={() => showToast('文章链接已复制到剪贴板！')}
                className="px-5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Share2 className="w-4 h-4 text-slate-500" />
                <span>分享</span>
              </button>

            </div>
          </div>

        </div>

        {/* Comments & Replies Section */}
        <div ref={commentsSectionRef} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6">
          
          {/* Header with Total Count */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                  <span>全部评论（{totalCommentsCount}条）</span>
                </h3>
              </div>
            </div>
          </div>

          {/* Top Level Comment Input Box */}
          <div ref={inlineInputRef} className="flex items-start gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 transition-all">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-indigo-100" 
            />
            <div className="flex-1 space-y-3">
              <textarea
                rows={3}
                value={mainCommentInput}
                onChange={(e) => setMainCommentInput(e.target.value)}
                placeholder="发表你的见解，与全站开发者探讨交流（仅限纯文字，不可发表情与图片）..."
                className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-indigo-500 transition leading-relaxed resize-none"
              />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                  <AlertCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                  <span>遵循社区公约 · 仅限纯文字评论 · 自动安全审核</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAddMainComment(currentPost.id)}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>发表评论</span>
                </button>
              </div>
            </div>
          </div>

          {/* Comments List */}
          {sortedTopComments.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-500 flex items-center justify-center mx-auto text-xl shadow-2xs">
                🛋️
              </div>
              <div className="text-sm font-bold text-slate-700">暂无评论，快来抢沙发</div>
              <p className="text-xs text-slate-400">发表第一条见解，开启这场技术探讨吧！</p>
            </div>
          ) : (
            <div className="space-y-4 pt-2">
              {visibleTopComments.map((comment) => {
                // 二级回复全部按时间正序（最早在前，符合对话逻辑）排列
                const sortedReplies = [...(comment.replies || [])].sort((a, b) => {
                  const tA = a.timestamp || 0;
                  const tB = b.timestamp || 0;
                  return tA - tB;
                });

                // 智能预览规则：
                // 仅展示点赞数超过10的二级回复，并按点赞数从高到低排序，最多预览3条；
                // 若点赞超过10的回复不足3条，则展示实际数量；
                // 若没有任何回复点赞超过10，则不展示预览内容，但会显示“共X条回复”的入口提示。
                // 预览内容会随点赞数变化动态更新。
                const highLikedReplies = [...(comment.replies || [])]
                  .filter(r => (r.likesCount || 0) > 10)
                  .sort((a, b) => (b.likesCount || 0) - (a.likesCount || 0));

                const previewReplies = highLikedReplies.slice(0, 3);
                const isExpanded = !!expandedRepliesMap[comment.id];

                // 二级回复展开后分页展示：每页10条，按时间正序排列，无需“加载更多回复”
                const REPLY_PAGE_SIZE = 10;
                const totalReplies = sortedReplies.length;
                const replyTotalPages = Math.ceil(totalReplies / REPLY_PAGE_SIZE) || 1;
                const rawCurrentReplyPage = repliesPageMap[comment.id] || 1;
                const currentReplyPage = Math.min(Math.max(1, rawCurrentReplyPage), replyTotalPages);

                const replyStartIndex = (currentReplyPage - 1) * REPLY_PAGE_SIZE;
                const replyEndIndex = Math.min(replyStartIndex + REPLY_PAGE_SIZE, totalReplies);

                // 未展开展示高赞智能预览；展开后按时间正序分页展示，每页10条
                const visibleReplies = isExpanded 
                  ? sortedReplies.slice(replyStartIndex, replyEndIndex) 
                  : previewReplies;

                return (
                  <div key={comment.id} className="p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-3.5">
                    
                    {/* 一级评论头部与主体 */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={comment.avatar} 
                          alt={comment.author} 
                          className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200" 
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{comment.author}</span>
                            {comment.authorTag && (
                              <span className="px-1.5 py-0.2 rounded bg-indigo-50 text-indigo-600 text-[9px] font-bold border border-indigo-100">
                                {comment.authorTag}
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-slate-400 font-medium">{comment.time}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 sm:gap-3">
                        {/* 一级评论点赞按钮 */}
                        <button
                          type="button"
                          onClick={() => handleLikeComment(currentPost.id, comment.id)}
                          className={`flex items-center gap-1 text-xs font-medium cursor-pointer transition px-2 py-1 rounded-lg hover:bg-white ${
                            comment.isLiked ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                          }`}
                          title="点赞"
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${comment.isLiked ? 'fill-rose-500' : ''}`} />
                          <span>{comment.likesCount}</span>
                        </button>

                        {/* 一级评论回复按钮 */}
                        <button
                          type="button"
                          onClick={() => {
                            if (replyTarget?.commentId === comment.id && !replyTarget?.replyId) {
                              setReplyTarget(null);
                            } else {
                              setReplyTarget({
                                commentId: comment.id,
                                targetAuthor: comment.author
                              });
                              setReplyInput('');
                            }
                          }}
                          className="flex items-center gap-1 text-xs text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer px-2 py-1 rounded-lg hover:bg-indigo-50 transition"
                        >
                          <CornerDownRight className="w-3.5 h-3.5" />
                          <span>回复</span>
                          {comment.replies && comment.replies.length > 0 && (
                            <span className="text-[10px] text-slate-400 font-normal">({comment.replies.length})</span>
                          )}
                        </button>

                        {/* 一级评论删除按钮 */}
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(currentPost.id, comment.id)}
                          className="flex items-center gap-1 text-xs text-slate-400 hover:text-rose-600 cursor-pointer transition px-2 py-1 rounded-lg hover:bg-rose-50"
                          title="删除该评论及其所有回复"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline text-[11px]">删除</span>
                        </button>
                      </div>
                    </div>

                    {/* 一级评论正文 */}
                    <p className="text-xs text-slate-800 leading-relaxed font-normal pl-10">
                      {comment.content}
                    </p>

                    {/* 一级评论附带图片展示 */}
                    {comment.images && comment.images.length > 0 && (
                      <div className="pl-10 flex flex-wrap gap-2 pt-1">
                        {comment.images.map((img, idx) => (
                          <div key={idx} className="w-24 h-24 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs">
                            <img src={img} alt="评论附图" className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    )}

                    {/* 一级评论的行内回复输入框 */}
                    {replyTarget?.commentId === comment.id && !replyTarget?.replyId && (
                      <div className="ml-10 pt-1 animate-fade-in space-y-2">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            autoFocus
                            value={replyInput}
                            onChange={(e) => setReplyInput(e.target.value)}
                            placeholder={`回复 @${comment.author}（仅限纯文字）...`}
                            className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600 shadow-2xs"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddReply(currentPost.id, comment.id, comment.author);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => handleAddReply(currentPost.id, comment.id, comment.author)}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95 transition"
                          >
                            提交回复
                          </button>
                          <button
                            type="button"
                            onClick={() => setReplyTarget(null)}
                            className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shrink-0 cursor-pointer transition"
                          >
                            取消
                          </button>
                        </div>
                      </div>
                    )}

                    {/* 二级回复区域：智能预览 + 展开分页 */}
                    {comment.replies && comment.replies.length > 0 && (
                      <div className="ml-6 sm:ml-10 space-y-2 pt-2 border-l-2 border-indigo-200/80 pl-3">
                        {/* 回复列表渲染（智能预览或全部展开） */}
                        {visibleReplies.map((rep) => (
                          <div key={rep.id} className="p-2.5 sm:p-3 rounded-xl bg-white border border-slate-200/80 space-y-1.5 text-xs shadow-2xs">
                            {/* 头部信息 */}
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className="text-indigo-400 font-mono font-bold select-none text-xs">└─</span>
                                <img src={rep.avatar} alt={rep.author} className="w-5 h-5 rounded-full object-cover shrink-0" />
                                <span className="font-bold text-slate-900">{rep.author}</span>
                                {rep.authorTag && (
                                  <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-500 text-[9px] font-medium">
                                    {rep.authorTag}
                                  </span>
                                )}
                                {rep.replyToUser && (
                                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                    <span>回复</span>
                                    <strong className="text-indigo-600 font-bold bg-indigo-50 px-1 py-0.2 rounded">
                                      @{rep.replyToUser}
                                    </strong>
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
                                <span className="text-[10px] text-slate-400">{rep.time}</span>
                                
                                {/* 二级回复点赞 */}
                                <button
                                  type="button"
                                  onClick={() => handleLikeReply(currentPost.id, comment.id, rep.id)}
                                  className={`flex items-center gap-1 text-[11px] font-medium cursor-pointer transition ${
                                    rep.isLiked ? 'text-rose-600 font-bold' : 'text-slate-400 hover:text-slate-700'
                                  }`}
                                  title="赞同该回复"
                                >
                                  <ThumbsUp className={`w-3 h-3 ${rep.isLiked ? 'fill-rose-500' : ''}`} />
                                  <span>{rep.likesCount || 0}</span>
                                </button>

                                {/* 二级回复回复按钮 */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (replyTarget?.commentId === comment.id && replyTarget?.replyId === rep.id) {
                                      setReplyTarget(null);
                                    } else {
                                      setReplyTarget({
                                        commentId: comment.id,
                                        targetAuthor: rep.author,
                                        replyId: rep.id
                                      });
                                      setReplyInput('');
                                    }
                                  }}
                                  className="flex items-center gap-1 text-[11px] text-indigo-600 font-bold hover:text-indigo-700 cursor-pointer"
                                  title="回复该回复"
                                >
                                  <CornerDownRight className="w-3 h-3" />
                                  <span>回复</span>
                                </button>

                                {/* 二级回复删除按钮 */}
                                <button
                                  type="button"
                                  onClick={() => handleDeleteReply(currentPost.id, comment.id, rep.id)}
                                  className="text-slate-400 hover:text-rose-600 cursor-pointer transition p-0.5 rounded hover:bg-rose-50"
                                  title="删除回复"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>

                            {/* 二级回复正文 */}
                            <p className="text-slate-700 leading-relaxed font-normal pl-6 sm:pl-7">
                              {rep.content}
                            </p>

                            {/* 行内回复输入框（回复该二级回复） */}
                            {replyTarget?.commentId === comment.id && replyTarget?.replyId === rep.id && (
                              <div className="ml-6 sm:ml-7 pt-2 animate-fade-in space-y-2">
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    autoFocus
                                    value={replyInput}
                                    onChange={(e) => setReplyInput(e.target.value)}
                                    placeholder={`回复 @${rep.author}（仅限纯文字）...`}
                                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-indigo-300 rounded-xl text-xs text-slate-900 outline-none focus:border-indigo-600 focus:bg-white transition"
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddReply(currentPost.id, comment.id, rep.author);
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleAddReply(currentPost.id, comment.id, rep.author)}
                                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs shrink-0 cursor-pointer active:scale-95 transition"
                                  >
                                    提交回复
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setReplyTarget(null)}
                                    className="px-2.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-xl shrink-0 cursor-pointer transition"
                                  >
                                    取消
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}

                        {/* 二级回复展开/收起/分页控制栏 */}
                        <div className="pt-1.5">
                          {!isExpanded && (
                            <>
                              {previewReplies.length > 0 ? (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedRepliesMap(prev => ({ ...prev, [comment.id]: true }));
                                    setRepliesPageMap(prev => ({ ...prev, [comment.id]: 1 }));
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-indigo-200/90 transition cursor-pointer shadow-2xs group"
                                >
                                  <span className="font-mono text-indigo-400">└─</span>
                                  <span>展开更多回复（共 {comment.replies.length} 条回复，分页展示）</span>
                                  <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                </button>
                              ) : (
                                // 若没有任何回复点赞超过10，则不展示预览内容，但会显示“共X条回复”的入口提示
                                <button
                                  type="button"
                                  onClick={() => {
                                    setExpandedRepliesMap(prev => ({ ...prev, [comment.id]: true }));
                                    setRepliesPageMap(prev => ({ ...prev, [comment.id]: 1 }));
                                  }}
                                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition cursor-pointer group"
                                >
                                  <span className="font-mono text-indigo-400">└─</span>
                                  <span>共 {comment.replies.length} 条回复，点击展开分页查看</span>
                                  <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                                </button>
                              )}
                            </>
                          )}

                          {isExpanded && (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 border-t border-slate-200/70">
                              {/* 分页控制区：展开后分页展示，每页10条，无需“加载更多回复” */}
                              {replyTotalPages > 1 ? (
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <button
                                    type="button"
                                    disabled={currentReplyPage <= 1}
                                    onClick={() => {
                                      setRepliesPageMap(prev => ({
                                        ...prev,
                                        [comment.id]: Math.max(1, currentReplyPage - 1)
                                      }));
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                  >
                                    <ChevronLeft className="w-3 h-3" />
                                    <span>上一页</span>
                                  </button>

                                  {/* 页码按钮 */}
                                  <div className="flex items-center gap-1">
                                    {Array.from({ length: replyTotalPages }, (_, i) => i + 1).map(p => (
                                      <button
                                        key={p}
                                        type="button"
                                        onClick={() => {
                                          setRepliesPageMap(prev => ({ ...prev, [comment.id]: p }));
                                        }}
                                        className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center transition cursor-pointer ${
                                          p === currentReplyPage
                                            ? 'bg-indigo-600 text-white shadow-2xs'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                                        }`}
                                      >
                                        {p}
                                      </button>
                                    ))}
                                  </div>

                                  <button
                                    type="button"
                                    disabled={currentReplyPage >= replyTotalPages}
                                    onClick={() => {
                                      setRepliesPageMap(prev => ({
                                        ...prev,
                                        [comment.id]: Math.min(replyTotalPages, currentReplyPage + 1)
                                      }));
                                    }}
                                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100 transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                  >
                                    <span>下一页</span>
                                    <ChevronRight className="w-3 h-3" />
                                  </button>

                                  <span className="text-[11px] text-slate-400 font-mono ml-1">
                                    第 {currentReplyPage}/{replyTotalPages} 页
                                  </span>
                                </div>
                              ) : (
                                <div className="text-[11px] text-slate-400 font-medium">
                                  已显示全部 {totalReplies} 条二级回复
                                </div>
                              )}

                              {/* 收起按钮：回到智能预览状态 */}
                              <button
                                type="button"
                                onClick={() => {
                                  setExpandedRepliesMap(prev => ({ ...prev, [comment.id]: false }));
                                }}
                                className="self-start sm:self-auto px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs flex items-center gap-1 transition cursor-pointer"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                                <span>收起</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}

          {/* 无限滚动加载锚点与状态提示 */}
          <div ref={infiniteScrollSentinelRef} className="py-6">
            {sortedTopComments.length > visibleTopCommentsCount ? (
              <div className="flex items-center justify-center gap-2.5 text-xs text-indigo-600 font-medium">
                <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                <span>正在加载更多评论...（向下滚动自动加载）</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 text-xs text-slate-400 font-medium">
                <div className="h-px bg-slate-200 flex-1 max-w-[120px]" />
                <span>已加载全部评论（共 {sortedTopComments.length} 条）</span>
                <div className="h-px bg-slate-200 flex-1 max-w-[120px]" />
              </div>
            )}
          </div>

        </div>

        {/* 悬浮输入框（当页面向下滚动导致原输入框超出屏幕可见区域时固定展示在屏幕底部） */}
        {isFloatingInput && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-xl px-2 animate-fade-in-up">
            <div 
              onClick={() => setIsFullInputModalOpen(true)}
              className="flex items-center gap-3 p-3 bg-white/95 backdrop-blur-md rounded-2xl border border-indigo-200 shadow-2xl shadow-indigo-500/15 cursor-pointer hover:border-indigo-400 transition-all group ring-4 ring-indigo-100/50"
            >
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-8 h-8 rounded-full object-cover shrink-0 ring-2 ring-indigo-200" 
              />
              <div className="flex-1 text-xs text-slate-400 group-hover:text-slate-600 transition truncate">
                {mainCommentInput.trim() ? mainCommentInput : "发表见解，探讨交流（仅限纯文字）..."}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="px-3.5 py-1.5 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-1 shadow-xs group-hover:bg-indigo-700 transition">
                  <Send className="w-3.5 h-3.5" />
                  <span>发表</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 回到顶部图标（当输入框处于悬浮状态时展示在右下角，点击平滑滚回顶部） */}
        {isFloatingInput && (
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-6 right-6 z-40 w-12 h-12 rounded-2xl bg-white border border-slate-200/90 shadow-xl text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-pointer group ring-2 ring-indigo-50"
            title="回到顶部"
          >
            <ArrowUp className="w-5 h-5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        )}

        {/* 完整评论输入弹窗（仅支持纯文字输入，含敏感词安全审核） */}
        {isFullInputModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl overflow-hidden animate-scale-up">
              <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">发表评论</h3>
                    <p className="text-[11px] text-slate-400">仅限纯文字内容，不可发表情与图片</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsFullInputModalOpen(false)}
                  className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-4 sm:p-5 space-y-3">
                <textarea
                  rows={5}
                  autoFocus
                  value={mainCommentInput}
                  onChange={(e) => setMainCommentInput(e.target.value)}
                  placeholder="在此输入你的见解，探讨技术细节（仅限纯文字）..."
                  className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition leading-relaxed font-sans resize-none"
                />

                {/* 弹窗工具栏 */}
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                    <AlertCircle className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                    <span>仅限纯文字 · 禁止表情与图片 · 自动敏感词拦截</span>
                  </div>
                </div>
              </div>

              <div className="p-4 sm:p-5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFullInputModalOpen(false)}
                  className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  取消
                </button>
                <button
                  type="button"
                  onClick={() => handleAddMainComment(currentPost.id)}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>确认发表</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    );
  }

  // ================= 渲染：我要发帖页面 View Mode === 'publish' =================
  if (viewMode === 'publish') {
    return (
      <div className="w-full space-y-6 animate-fade-in pb-12 select-none max-w-4xl mx-auto">
        
        {/* Top Header & Back Button Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm flex items-center justify-between gap-4">
          <button
            onClick={() => setViewMode('feed')}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回社区大厅</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-800">创作中心 · 我要发帖</span>
          </div>
        </div>

        {/* Publish Form Container */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          
          <div className="border-b border-slate-100 pb-4">
            <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              发布新的社区动态
            </h1>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              分享你的 AI Agent 开发实践、报错排查、副业商业化思考或学习干货（支持 Markdown 编辑）
            </p>
          </div>

          <form onSubmit={handlePublishSubmit} className="space-y-6">
            
            {/* Row 1: Board Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-2">
                选择发布板块 <span className="text-rose-500">*</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {communityBoards.map(board => {
                  const isSelected = newPostBoard === board.name;
                  const isDisabled = board.status === '已停用';
                  return (
                    <button
                      type="button"
                      key={board.id}
                      disabled={isDisabled}
                      onClick={() => {
                        if (!isDisabled) {
                          setNewPostBoard(board.name as CommunityBoard);
                        }
                      }}
                      className={`p-3 rounded-xl border text-xs font-bold transition text-left flex items-center justify-between ${
                        isDisabled
                          ? 'opacity-50 bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed'
                          : isSelected 
                            ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 shadow-xs cursor-pointer' 
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700 cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className="truncate">{board.name}</span>
                        {isDisabled && (
                          <span className="text-[10px] text-rose-500 font-semibold shrink-0">
                            (已停用)
                          </span>
                        )}
                      </div>
                      {isSelected && !isDisabled && <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title Field */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                动态标题 (推荐填写)
              </label>
              <input
                type="text"
                value={newPostTitle}
                onChange={(e) => setNewPostTitle(e.target.value)}
                placeholder="【标题】用一句话概括核心观点，例如：DeepSeek-R1 量化部署优化总结..."
                className="w-full p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition font-medium"
              />
            </div>

            {/* Markdown Content Editor Component */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-indigo-600" />
                  正文内容 (Markdown 编辑器) <span className="text-rose-500">*</span>
                </label>

                {/* Editor Tabs: Edit vs Preview */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setEditorTab('write')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      editorTab === 'write' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    编辑 (Markdown)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditorTab('preview')}
                    className={`px-3 py-1 rounded-md text-[11px] font-bold transition cursor-pointer ${
                      editorTab === 'preview' ? 'bg-white text-indigo-600 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    实时渲染预览
                  </button>
                </div>
              </div>

              {/* Markdown Toolbar (Only visible in 'write' mode) */}
              {editorTab === 'write' && (
                <div className="p-2 bg-slate-100/90 border border-slate-200 rounded-t-xl flex flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('**', '**')}
                    title="加粗"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('*', '*')}
                    title="斜体"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('### ')}
                    title="三级标题"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Heading className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-slate-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('```python\n# 请在此输入代码\n', '\n```')}
                    title="代码块"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('> ')}
                    title="引用"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('- ')}
                    title="无序列表"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('1. ')}
                    title="有序列表"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertMarkdownSyntax('[链接名称](', 'https://example.com)')}
                    title="插入超链接"
                    className="p-1.5 rounded hover:bg-slate-200 text-slate-700 cursor-pointer"
                  >
                    <LinkIcon className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-slate-400 font-mono ml-auto pr-2">
                    支持 Markdown 标准语法
                  </span>
                </div>
              )}

              {/* Textarea or Preview */}
              {editorTab === 'write' ? (
                <textarea
                  rows={10}
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="在此输入正文内容（支持 Markdown 语法，如加粗 **文字**、代码块 ``` 等）..."
                  className="w-full p-4 bg-slate-50 border border-slate-200 rounded-b-xl text-xs text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition leading-relaxed font-mono"
                />
              ) : (
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl min-h-[240px] text-xs text-slate-800 leading-relaxed overflow-y-auto">
                  {newPostContent.trim() ? (
                    <div className="prose prose-slate max-w-none text-slate-800 text-xs">
                      <Markdown>{newPostContent}</Markdown>
                    </div>
                  ) : (
                    <div className="text-slate-400 italic text-center pt-16">
                      暂无正文内容，请在“编辑”选项卡中书写...
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Markdown Editor</span>
                <span>已输入 {newPostContent.length} 字</span>
              </div>
            </div>

            {/* Tags Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-800 mb-1.5">
                技术标签
              </label>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                {newPostTags.map(t => (
                  <span key={t} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold flex items-center gap-1 border border-indigo-200">
                    #{t}
                    <button type="button" onClick={() => handleRemoveTag(t)} className="hover:text-rose-600">
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <TagIcon className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTag(tagInput);
                      }
                    }}
                    placeholder="输入自定义标签按回车添加..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 outline-none focus:bg-white focus:border-indigo-500"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleAddTag(tagInput)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  添加
                </button>
              </div>

              {/* Quick Tags Suggestions */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 text-[10px] text-slate-500">
                <span className="font-bold text-slate-600">推荐标签:</span>
                {quickTags.map(qt => (
                  <button
                    key={qt}
                    type="button"
                    onClick={() => handleAddTag(qt)}
                    className="px-2 py-0.5 rounded bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 cursor-pointer transition font-medium"
                  >
                    #{qt}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setViewMode('feed')}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition cursor-pointer"
              >
                取消并返回
              </button>
              <button
                type="submit"
                className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-indigo-500/20 flex items-center gap-2 transition cursor-pointer active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>确认发表</span>
              </button>
            </div>

          </form>

        </div>

      </div>
    );
  }

  // ================= 默认渲染：社区主视图 (Feed View) =================
  return (
    <div className="w-full space-y-6 animate-fade-in pb-12 select-none relative">
      
      {/* Standard Unified Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-2xs shrink-0">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              开发者技术社区
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                生态圈
              </span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              汇聚全球 AI 开发者、算法工程师与独立创作者，分享实践经验、解答技术难题与人脉连接
            </p>
          </div>
        </div>

        {/* Action: 我要发帖 button */}
        <div className="shrink-0">
          <button
            onClick={() => setViewMode('publish')}
            className="px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-200 flex items-center gap-2 cursor-pointer transition-all hover:scale-[1.02]"
          >
            <Plus className="w-4 h-4" />
            <span>我要发帖</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Left Sidebar (Category Navigation) + Right Stream (Waterfall Feed) */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left Sidebar: Clean Categories (Tags & Numbers deleted as requested) */}
        <div className="lg:col-span-1 space-y-3 sticky top-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2">
              社区板块分类
            </div>

            <div className="space-y-1.5">
              {boardConfigs.map(b => {
                const isActive = activeBoard === b.id;

                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBoard(b.id)}
                    className={`w-full text-left p-3 rounded-xl transition flex items-start gap-3 cursor-pointer group ${
                      isActive 
                        ? 'bg-indigo-50/80 border border-indigo-200/80 shadow-xs' 
                        : 'bg-white hover:bg-slate-50 border border-transparent hover:border-slate-200/60'
                    }`}
                  >
                    <div className={`p-2 rounded-lg shrink-0 transition ${
                      isActive ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}>
                      {b.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs font-bold block ${isActive ? 'text-indigo-900' : 'text-slate-800'}`}>
                        {b.label}
                      </span>
                      <p className="text-[10px] text-slate-500 line-clamp-1 mt-0.5 leading-tight font-normal">
                        {b.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Area: Top Filter Bar & Waterfall Feed */}
        <div className="lg:col-span-3 space-y-4">
          
          {/* Top Filter Bar: 推荐 / 最新 (Removed "关注" tab as requested) & Search */}
          <div className="p-3.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            
            {/* Filter Tabs: Only 推荐 & 最新 */}
            <div className="flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-xl">
              {[
                { id: 'recommend', label: '推荐' },
                { id: 'latest', label: '最新' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveFilter(tab.id as any)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    activeFilter === tab.id
                      ? 'bg-white text-indigo-600 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input Bar */}
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="搜索动态标题、技术标签或关键词..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 outline-none focus:bg-white focus:border-indigo-500 transition font-medium"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Feed Post Status Indicator */}
          <div className="flex items-center justify-between text-xs text-slate-500 px-1 font-medium">
            <span>正在展示 <strong className="text-slate-900 font-bold">{filteredPosts.length}</strong> 条社区动态</span>
            {activeBoard !== 'all' && (
              <span className="text-indigo-600 font-bold">当前板块：{activeBoard}</span>
            )}
          </div>

          {/* Waterfall Feed Grid */}
          {filteredPosts.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-white border border-slate-200/80 space-y-3">
              <Sparkles className="w-8 h-8 text-slate-300 mx-auto" />
              <div className="text-sm font-bold text-slate-800">暂无相关社区动态</div>
              <p className="text-xs text-slate-400">尝试更换搜索词或选择其他板块，也可以发布第一条动态！</p>
              <button
                onClick={() => setViewMode('publish')}
                className="mt-2 px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl shadow-xs cursor-pointer"
              >
                发布动态
              </button>
            </div>
          ) : (
            <div className="columns-1 md:columns-2 xl:columns-2 gap-4 space-y-4">
              {filteredPosts.map(post => {
                const isCollected = !!collectedPosts[post.id];
                const likesInfo = getPostLikes(post);
                const boardStyle = getBoardStyle(post.board);

                return (
                  <div
                    key={post.id}
                    onClick={() => openPostDetail(post.id)}
                    className="break-inside-avoid p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-indigo-300 transition-all shadow-xs hover:shadow-md space-y-3.5 group cursor-pointer"
                  >
                    {/* Card Header: Author Info & Board Badge */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <img 
                          src={post.authorAvatar} 
                          alt={post.author} 
                          className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-100" 
                        />
                        <div>
                          <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                            <span>{post.author}</span>
                          </div>
                          <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1.5 mt-0.5">
                            <span className="text-indigo-600 font-bold">{post.authorTag}</span>
                            <span>·</span>
                            <span>{post.time}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tags: 置顶, 精华 & 板块标签 */}
                      <div className="flex items-center gap-1.5 flex-wrap shrink-0">
                        {(post.isPinned || post.isTop) && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-200/90 flex items-center gap-1 shadow-2xs">
                            <Pin className="w-3 h-3 text-rose-600 fill-rose-100" />
                            置顶
                          </span>
                        )}
                        {post.isEssential && (
                          <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-amber-50 text-amber-700 border border-amber-200/90 flex items-center gap-1 shadow-2xs">
                            <Sparkles className="w-3 h-3 text-amber-600 fill-amber-100" />
                            精华
                          </span>
                        )}
                        <span className={`px-2.5 py-0.5 rounded-lg text-[10px] font-bold border shrink-0 ${boardStyle}`}>
                          {post.board}
                        </span>
                      </div>
                    </div>

                    {/* Post Title */}
                    {post.title && (
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition leading-snug">
                        {post.title}
                      </h3>
                    )}

                    {/* Post Content Snippet */}
                    <p className="text-xs text-slate-600 leading-relaxed font-normal line-clamp-4">
                      {post.content}
                    </p>

                    {/* 帖子卡片封面：取自帖子详情中的第一张图片，若详情中没有图片则没有封面 */}
                    {(() => {
                      const firstImg = getPostFirstImage(post);
                      if (!firstImg) return null;
                      return (
                        <div className="rounded-xl overflow-hidden border border-slate-100 pt-1">
                          <img 
                            src={firstImg} 
                            alt={post.title || "post cover"} 
                            className="w-full h-40 object-cover hover:scale-105 transition duration-300" 
                          />
                        </div>
                      );
                    })()}

                    {/* Tags Pills */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {post.tags.map((t, idx) => (
                          <span key={idx} className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium hover:bg-indigo-50 hover:text-indigo-600 transition">
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer Actions */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
                      
                      <div className="flex items-center gap-4">
                        {/* Like Button */}
                        <button
                          onClick={(e) => handleLikePost(post.id, e)}
                          className={`flex items-center gap-1 hover:text-indigo-600 transition cursor-pointer ${
                            likesInfo.isLiked ? 'text-indigo-600 font-bold' : ''
                          }`}
                        >
                          <ThumbsUp className={`w-3.5 h-3.5 ${likesInfo.isLiked ? 'fill-indigo-600' : ''}`} />
                          <span>{likesInfo.count}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openPostDetail(post.id);
                          }}
                          className="flex items-center gap-1 hover:text-cyan-600 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{post.commentsCount || 12}</span>
                        </button>

                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => toggleBookmark(post.id, e)}
                          className={`flex items-center gap-1 hover:text-amber-600 transition cursor-pointer ${
                            isCollected ? 'text-amber-600 font-bold' : ''
                          }`}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isCollected ? 'fill-amber-500' : ''}`} />
                        </button>

                        {/* Share Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            showToast('动态链接已复制到剪贴板');
                          }}
                          className="flex items-center gap-1 hover:text-slate-900 transition cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Views Count */}
                      <div className="flex items-center gap-1 text-[10px] text-slate-400 font-mono">
                        <Eye className="w-3 h-3" />
                        <span>{post.viewsCount || 120}</span>
                      </div>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
