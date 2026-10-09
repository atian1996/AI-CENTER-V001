import { FeedPost } from '../types';
import { mockFeedPosts60ExpandedPart1 } from './mockPostsExpandedPart1';
import { mockFeedPosts60ExpandedPart2 } from './mockPostsExpandedPart2';
import { mockFeedPosts60ExpandedPart3 } from './mockPostsExpandedPart3';
import { mockFeedPosts60ExpandedPart4 } from './mockPostsExpandedPart4';
import { mockFeedPosts60ExpandedPart5 } from './mockPostsExpandedPart5';
import { mockFeedPosts60ExpandedPart6 } from './mockPostsExpandedPart6';

export const mockFeedPostsAllExpanded: FeedPost[] = [
  ...mockFeedPosts60ExpandedPart1,
  ...mockFeedPosts60ExpandedPart2,
  ...mockFeedPosts60ExpandedPart3,
  ...mockFeedPosts60ExpandedPart4,
  ...mockFeedPosts60ExpandedPart5,
  ...mockFeedPosts60ExpandedPart6
];
