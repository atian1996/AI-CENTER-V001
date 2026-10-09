import re

with open('src/data/mockData.ts') as f:
    text = f.read()

# Locate mockFeedPosts array
feed_posts_start = text.find('export const mockFeedPosts: FeedPost[] = [')
feed_posts_end = text.find('export const mockModelLeaderboards', feed_posts_start)
if feed_posts_end == -1:
    feed_posts_end = text.find('export const mockCompetitions', feed_posts_start)

posts_block = text[feed_posts_start:feed_posts_end]

# Regex to match each post
matches = list(re.finditer(r"id:\s*'(pst_[^']+)'", posts_block))
print(f"Total post IDs found: {len(matches)}")

under_500 = []
for i, m in enumerate(matches):
    pid = m.group(1)
    start_pos = m.start()
    end_pos = matches[i+1].start() if i+1 < len(matches) else len(posts_block)
    post_str = posts_block[start_pos:end_pos]
    
    # Extract content
    c_match = re.search(r"content:\s*(?:`([^`]+)`|'([^']+)')", post_str, re.DOTALL)
    if c_match:
        content = c_match.group(1) if c_match.group(1) is not None else c_match.group(2)
        char_count = len(content.strip())
        if char_count < 500:
            under_500.append((pid, char_count))
    else:
        print(f"Failed to match content for {pid}")

print(f"Posts with length < 500: {len(under_500)}")
for pid, cc in under_500:
    print(f"  {pid}: {cc} chars")
