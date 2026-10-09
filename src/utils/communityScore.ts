import { FeedPost } from '../types';

/**
 * 计算发帖经过的小时数：
 * 发帖小时数 = 当前时间 - 发帖时间（小时），向下取整，最小为0
 */
export function parsePostHoursAgo(timeStr?: string, createdAtTimestamp?: number): number {
  const now = Date.now();

  if (createdAtTimestamp && typeof createdAtTimestamp === 'number') {
    const diffMs = now - createdAtTimestamp;
    return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
  }

  if (!timeStr) return 0;

  // 1. 标准时间格式识别 (例如 '2026-08-22 15:40', '2026-09-20T10:00:00.000Z')
  const parsed = Date.parse(timeStr.replace(/-/g, '/'));
  if (!isNaN(parsed) && parsed > 0) {
    const diffMs = now - parsed;
    if (diffMs > 0) {
      return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    }
  }

  // 2. 相对时间文本识别
  const trimmed = timeStr.trim();
  if (trimmed.includes('刚刚') || trimmed.includes('分钟前') || trimmed.includes('秒前')) {
    return 0;
  }

  const hourMatch = trimmed.match(/([\d.]+)\s*小时前/);
  if (hourMatch) {
    const hrs = parseFloat(hourMatch[1]);
    return Math.max(0, Math.floor(hrs));
  }

  const dayMatch = trimmed.match(/(\d+)\s*天前/);
  if (dayMatch) {
    const days = parseInt(dayMatch[1], 10);
    return Math.max(0, days * 24);
  }

  // 3. '今天 HH:mm' 或 '昨天 HH:mm'
  const currentDate = new Date();
  if (trimmed.includes('今天')) {
    const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const postDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), h, m);
      const diffMs = now - postDate.getTime();
      return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    }
    return 1;
  }

  if (trimmed.includes('昨天')) {
    const timeMatch = trimmed.match(/(\d{1,2}):(\d{2})/);
    if (timeMatch) {
      const h = parseInt(timeMatch[1], 10);
      const m = parseInt(timeMatch[2], 10);
      const postDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1, h, m);
      const diffMs = now - postDate.getTime();
      return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60)));
    }
    return 24;
  }

  if (trimmed.includes('前天')) {
    return 48;
  }

  return 0;
}

export interface PostScoreResult {
  score: number;
  weightedEngagement: number;
  hoursAgo: number;
}

/**
 * 推荐帖子的排序规则按照以下公式来计算：
 * 帖子得分 = 加权互动分 ÷ (发帖小时数 + 2) ^ 1.5，实时计算
 * 
 * 加权互动分 = 评论数×5 + 收藏数×4 + 点赞数×2 + 查看数×0.2
 * 发帖小时数 = 当前时间 - 发帖时间（小时），向下取整，最小为0
 */
export function calculatePostRecommendationScore(
  post: {
    likesCount?: number;
    commentsCount?: number;
    favoritesCount?: number;
    viewsCount?: number;
    time?: string;
    createdAtTimestamp?: number;
  },
  liveStats?: {
    likesCount?: number;
    favoritesCount?: number;
    commentsCount?: number;
    viewsCount?: number;
  }
): PostScoreResult {
  const comments = liveStats?.commentsCount !== undefined ? liveStats.commentsCount : (post.commentsCount || 0);
  const favorites = liveStats?.favoritesCount !== undefined 
    ? liveStats.favoritesCount 
    : (post.favoritesCount !== undefined ? post.favoritesCount : Math.floor((post.likesCount || 0) * 0.6));
  const likes = liveStats?.likesCount !== undefined ? liveStats.likesCount : (post.likesCount || 0);
  const views = liveStats?.viewsCount !== undefined ? liveStats.viewsCount : (post.viewsCount || 0);

  // 加权互动分 = 评论数×5 + 收藏数×4 + 点赞数×2 + 查看数×0.2
  const weightedEngagement = (comments * 5) + (favorites * 4) + (likes * 2) + (views * 0.2);

  // 发帖小时数 = 当前时间 - 发帖时间（小时），向下取整，最小为0
  const hoursAgo = parsePostHoursAgo(post.time, post.createdAtTimestamp);

  // 帖子得分 = 加权互动分 ÷ (发帖小时数 + 2) ^ 1.5
  const denominator = Math.pow(hoursAgo + 2, 1.5);
  const score = denominator > 0 ? weightedEngagement / denominator : 0;

  return {
    score: Number(score.toFixed(4)),
    weightedEngagement: Number(weightedEngagement.toFixed(1)),
    hoursAgo
  };
}

/**
 * 对社区帖子进行排序：
 * 1. 最新置顶的帖子靠前（置顶排最前，多个置顶按 pinnedAt 倒序）
 * 2. 加精只是加个“精华”标签，不影响帖子排序
 * 3. 推荐模式下：非置顶帖子按帖子得分 (score) 降序实时排序
 * 4. 最新模式下：非置顶帖子按时间倒序
 */
export function sortCommunityPosts(
  posts: FeedPost[],
  mode: 'recommend' | 'latest',
  options?: {
    likesMap?: Record<string, { count: number; isLiked: boolean }>;
    bookmarksMap?: Record<string, boolean>;
    commentsMap?: Record<string, any[]>;
  }
): FeedPost[] {
  // 分离置顶帖与普通帖
  const pinnedPosts: FeedPost[] = [];
  const normalPosts: FeedPost[] = [];

  for (const post of posts) {
    if (post.isPinned || post.isTop) {
      pinnedPosts.push(post);
    } else {
      normalPosts.push(post);
    }
  }

  // 1. 置顶帖排序：最新置顶的靠前（pinnedAt 降序）
  pinnedPosts.sort((a, b) => {
    const timeA = a.pinnedAt ? new Date(a.pinnedAt).getTime() : (a.createdAtTimestamp || 0);
    const timeB = b.pinnedAt ? new Date(b.pinnedAt).getTime() : (b.createdAtTimestamp || 0);
    if (timeB !== timeA) {
      return timeB - timeA;
    }
    return b.id.localeCompare(a.id);
  });

  // 2. 非置顶帖子排序
  if (mode === 'recommend') {
    // 按照公式得分实时计算
    normalPosts.sort((a, b) => {
      const liveA = {
        likesCount: options?.likesMap?.[a.id]?.count,
        favoritesCount: options?.bookmarksMap?.[a.id] !== undefined ? (options.bookmarksMap[a.id] ? (a.favoritesCount || 0) + 1 : a.favoritesCount) : undefined,
        commentsCount: options?.commentsMap?.[a.id]?.length
      };
      const liveB = {
        likesCount: options?.likesMap?.[b.id]?.count,
        favoritesCount: options?.bookmarksMap?.[b.id] !== undefined ? (options.bookmarksMap[b.id] ? (b.favoritesCount || 0) + 1 : b.favoritesCount) : undefined,
        commentsCount: options?.commentsMap?.[b.id]?.length
      };

      const scoreA = calculatePostRecommendationScore(a, liveA).score;
      const scoreB = calculatePostRecommendationScore(b, liveB).score;

      if (scoreB !== scoreA) {
        return scoreB - scoreA;
      }
      return b.id.localeCompare(a.id);
    });
  } else {
    // 最新模式：按发帖时间从近到远
    normalPosts.sort((a, b) => {
      const hoursA = parsePostHoursAgo(a.time, a.createdAtTimestamp);
      const hoursB = parsePostHoursAgo(b.time, b.createdAtTimestamp);
      if (hoursA !== hoursB) {
        return hoursA - hoursB; // 小时数小的更近
      }
      return b.id.localeCompare(a.id);
    });
  }

  return [...pinnedPosts, ...normalPosts];
}
