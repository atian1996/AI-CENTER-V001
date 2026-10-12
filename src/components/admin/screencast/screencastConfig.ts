export interface ScreencastPageConfig {
  id: string;
  label: string;
  enabled: boolean;
}

export type ScreencastFitMode = 'fill' | 'contain' | 'fluid';

export interface ScreencastSettings {
  pages: ScreencastPageConfig[];
  autoRotate: boolean;       // 是否自动轮播
  interval: number;         // 轮播间隔（秒）
  idleResumeDelay: number;  // 键鼠停止操作间隔多久后继续轮播（秒）
  fitMode: ScreencastFitMode; // 屏幕自适应模式 (fill: 铺满1920*1080, contain: 16:9等比, fluid: 流式)
}

export const DEFAULT_ECOSYSTEM_PAGES: ScreencastPageConfig[] = [
  { id: 'overview', label: '1. 算力运营概览', enabled: true },
  { id: 'industry', label: '2. 产业应用赋能', enabled: true },
  { id: 'activities', label: '3. 开发者活动', enabled: true },
  { id: 'reports', label: '4. 数据台账报告', enabled: true },
];

export const DEFAULT_COMPUTE_OPS_PAGES: ScreencastPageConfig[] = [
  { id: 'overview', label: '1. 算力资源总览', enabled: true },
  { id: 'reconciliation', label: '2. 算力对账明细', enabled: true },
  { id: 'revenue', label: '3. 算力结算营收', enabled: true },
  { id: 'alerts', label: '4. 算力容量告警', enabled: true },
  { id: 'progress', label: '5. 算力纳管进度', enabled: true },
];

export const getDefaultScreencastSettings = (type: 'ecosystem' | 'compute-ops'): ScreencastSettings => {
  return {
    pages: type === 'ecosystem' ? [...DEFAULT_ECOSYSTEM_PAGES] : [...DEFAULT_COMPUTE_OPS_PAGES],
    autoRotate: true,
    interval: 5,
    idleResumeDelay: 5,
    fitMode: 'fill',
  };
};

const STORAGE_PREFIX = 'app_screencast_settings_';

export const getScreencastSettings = (type: 'ecosystem' | 'compute-ops'): ScreencastSettings => {
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}${type}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed.pages) && typeof parsed.autoRotate === 'boolean') {
        // Ensure all default pages exist in case new ones were added
        const defaultPages = type === 'ecosystem' ? DEFAULT_ECOSYSTEM_PAGES : DEFAULT_COMPUTE_OPS_PAGES;
        const pageIds = new Set(parsed.pages.map((p: ScreencastPageConfig) => p.id));
        const mergedPages = [...parsed.pages];
        defaultPages.forEach(dp => {
          if (!pageIds.has(dp.id)) {
            mergedPages.push({ ...dp });
          }
        });
        return {
          pages: mergedPages,
          autoRotate: parsed.autoRotate,
          interval: typeof parsed.interval === 'number' && parsed.interval > 0 ? parsed.interval : 5,
          idleResumeDelay: typeof parsed.idleResumeDelay === 'number' && parsed.idleResumeDelay >= 0 ? parsed.idleResumeDelay : 5,
          fitMode: parsed.fitMode === 'contain' || parsed.fitMode === 'fluid' || parsed.fitMode === 'fill' ? parsed.fitMode : 'fill',
        };
      }
    }
  } catch (e) {
    console.error('Error reading screencast settings:', e);
  }
  return getDefaultScreencastSettings(type);
};

export const saveScreencastSettings = (type: 'ecosystem' | 'compute-ops', settings: ScreencastSettings): void => {
  try {
    localStorage.setItem(`${STORAGE_PREFIX}${type}`, JSON.stringify(settings));
    // Trigger custom event so any active player on the same origin can update immediately
    window.dispatchEvent(new CustomEvent('screencast-settings-updated', { detail: { type, settings } }));
  } catch (e) {
    console.error('Error saving screencast settings:', e);
  }
};
