export type AppTheme = 'default' | 'minimal';

export const THEME_STORAGE_KEY = 'ai_ops_theme_v2';
export const THEME_CHANGE_EVENT = 'app-theme-change';

/**
 * 读取本地持久化的主题配置（原生 localStorage，默认为极简科技风 minimal）
 */
export function getStoredTheme(): AppTheme {
  if (typeof window === 'undefined') return 'minimal';
  try {
    const saved = window.localStorage.getItem(THEME_STORAGE_KEY);
    return saved === 'default' ? 'default' : 'minimal';
  } catch {
    return 'minimal';
  }
}

/**
 * 获取当前 <html> 标签上的 data-theme 状态
 */
export function getCurrentTheme(): AppTheme {
  if (typeof document === 'undefined') return 'minimal';
  const attr = document.documentElement.getAttribute('data-theme');
  if (attr === 'minimal' || attr === 'default') {
    return attr;
  }
  return getStoredTheme();
}

/**
 * 原生 DOM 方式应用主题，并写入 localStorage 保持刷新不丢失
 */
export function applyTheme(theme: AppTheme): AppTheme {
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // 忽略隐私模式下 localStorage 不可用错误
    }
    window.dispatchEvent(new CustomEvent<AppTheme>(THEME_CHANGE_EVENT, { detail: theme }));
  }
  return theme;
}

/**
 * 初始化主题（页面挂载时同步 <html> data-theme 属性）
 */
export function initTheme(): AppTheme {
  const theme = getStoredTheme();
  if (typeof document !== 'undefined') {
    document.documentElement.setAttribute('data-theme', theme);
  }
  return theme;
}

/**
 * 在“默认风格 (default)”与“极简科技风 (minimal)”之间来回切换
 */
export function toggleTheme(): AppTheme {
  const current = getCurrentTheme();
  const next: AppTheme = current === 'minimal' ? 'default' : 'minimal';
  return applyTheme(next);
}

/**
 * 订阅原生自定义主题变更事件（支持多组件同步）
 */
export function subscribeThemeChange(listener: (theme: AppTheme) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  const handleCustomEvent = (event: Event) => {
    const customEvent = event as CustomEvent<AppTheme>;
    listener(customEvent.detail === 'default' ? 'default' : 'minimal');
  };
  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === THEME_STORAGE_KEY) {
      const next: AppTheme = event.newValue === 'default' ? 'default' : 'minimal';
      document.documentElement.setAttribute('data-theme', next);
      listener(next);
    }
  };
  window.addEventListener(THEME_CHANGE_EVENT, handleCustomEvent);
  window.addEventListener('storage', handleStorageEvent);
  return () => {
    window.removeEventListener(THEME_CHANGE_EVENT, handleCustomEvent);
    window.removeEventListener('storage', handleStorageEvent);
  };
}
