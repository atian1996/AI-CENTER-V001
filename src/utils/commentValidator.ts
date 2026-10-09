/**
 * 评论校验工具
 * 规范：所有模块的评论都只能发文字，不能发表情和图片
 */

// 检查文本是否包含表情符号 (Emoji / 象形符号)
export const containsEmoji = (str: string): boolean => {
  if (!str) return false;
  const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u{1F300}-\u{1FAFF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/u;
  return emojiRegex.test(str);
};

// 移除文本中的表情符号
export const removeEmojis = (str: string): string => {
  if (!str) return '';
  const emojiRegex = /(\p{Extended_Pictographic}|\p{Emoji_Presentation}|[\u{1F300}-\u{1FAFF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}])/gu;
  return str.replace(emojiRegex, '');
};

// 纯文字校验
export const validateTextOnlyComment = (text: string): { valid: boolean; message?: string } => {
  const trimmed = text.trim();
  if (!trimmed) {
    return { valid: false, message: '请输入评论内容' };
  }
  if (containsEmoji(trimmed)) {
    return { valid: false, message: '评论仅支持发送纯文字，不能包含表情符号！' };
  }
  return { valid: true };
};
