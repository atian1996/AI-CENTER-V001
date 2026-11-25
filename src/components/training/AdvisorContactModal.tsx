import React, { useEffect, useState } from 'react';
import { CertificationItem } from '../../types';
import { X, Copy, Check } from 'lucide-react';

interface AdvisorContactModalProps {
  certification: Pick<
    CertificationItem,
    'id' | 'systemId' | 'name' | 'advisorContacts' | 'advisorQrHint'
  >;
  isOpen: boolean;
  onClose: () => void;
  subtitlePrefix?: string;
  title?: string;
}

/**
 * 极简风格矢量二维码图形（确保离线与高分屏下均清晰锐利、永不破图）
 */
const MinimalQrSvg: React.FC<{ seed: string }> = ({ seed }) => {
  // Deterministic 15x15 matrix excluding 3 finder corners
  const size = 21;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const isFinder = (r: number, c: number) => {
    const inTopLeft = r < 7 && c < 7;
    const inTopRight = r < 7 && c >= size - 7;
    const inBottomLeft = r >= size - 7 && c < 7;
    return inTopLeft || inTopRight || inBottomLeft;
  };

  const isSeparator = (r: number, c: number) => {
    if (r === 7 && c <= 7) return true;
    if (c === 7 && r <= 7) return true;
    if (r === 7 && c >= size - 8) return true;
    if (c === size - 8 && r <= 7) return true;
    if (r === size - 8 && c <= 7) return true;
    if (c === 7 && r >= size - 8) return true;
    return false;
  };

  const cells: { r: number; c: number }[] = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (isFinder(r, c) || isSeparator(r, c)) continue;
      // Keep center quiet square for clean visual balance
      if (r >= 9 && r <= 11 && c >= 9 && c <= 11) continue;
      const v = ((r * 37 + c * 17 + hash) ^ (r * c + 13)) % 11;
      if (v < 5) {
        cells.push({ r, c });
      }
    }
  }

  const renderFinder = (x: number, y: number) => (
    <g key={`finder-${x}-${y}`}>
      <rect x={x} y={y} width={7} height={7} rx={0.8} fill="#1a1a1a" />
      <rect x={x + 1} y={y + 1} width={5} height={5} rx={0.4} fill="#ffffff" />
      <rect x={x + 2} y={y + 2} width={3} height={3} rx={0.3} fill="#1a1a1a" />
    </g>
  );

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-36 h-36 block"
      role="img"
      aria-label="认证顾问联系二维码"
    >
      <rect x={0} y={0} width={size} height={size} fill="#ffffff" />
      {renderFinder(0, 0)}
      {renderFinder(size - 7, 0)}
      {renderFinder(0, size - 7)}
      {cells.map(({ r, c }) => (
        <rect
          key={`${r}-${c}`}
          x={c}
          y={r}
          width={0.92}
          height={0.92}
          rx={0.15}
          fill="#1a1a1a"
        />
      ))}
      {/* Center minimalist mark */}
      <rect x={9.2} y={9.2} width={2.6} height={2.6} rx={0.5} fill="#1a1a1a" />
      <rect x={10} y={10} width={1} height={1} rx={0.2} fill="#ffffff" />
    </svg>
  );
};

export const AdvisorContactModal: React.FC<AdvisorContactModalProps> = ({
  certification,
  isOpen,
  onClose,
  subtitlePrefix = '咨询认证：',
  title = '联系认证顾问'
}) => {
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleCopy = (val: string) => {
    try {
      navigator.clipboard?.writeText(val);
      setCopiedValue(val);
      window.setTimeout(() => {
        setCopiedValue((prev) => (prev === val ? null : prev));
      }, 1800);
    } catch {
      // Ignore clipboard permission failure
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/50 backdrop-blur-[2px] animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="advisor-contact-modal-title"
    >
      <div
        className="relative w-full max-w-[440px] bg-[#ffffff] border border-[#eaeaea] rounded-[12px] shadow-[0_20px_60px_rgba(0,0,0,0.16)] p-7 sm:p-8 text-[#1a1a1a]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top-Right Minimal Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="关闭弹窗"
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#999999] hover:text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" strokeWidth={1.75} />
        </button>

        {/* Modal Heading */}
        <div className="pr-8">
          <h2
            id="advisor-contact-modal-title"
            className="text-xl font-semibold text-[#1a1a1a] tracking-tight"
          >
            {title}
          </h2>
          <p className="text-xs text-[#666666] mt-1.5 truncate">
            {subtitlePrefix}{certification.name}
          </p>
        </div>

        {/* Middle: Vertical Configurable Advisor Info */}
        <div className="mt-6 border-t border-b border-[#eaeaea] divide-y divide-[#eaeaea]">
          {certification.advisorContacts.map((item) => (
            <div
              key={`${item.label}-${item.value}`}
              className="py-3.5 flex items-center justify-between gap-4 text-[14px]"
            >
              <span className="text-[#666666] shrink-0 w-20 font-normal">
                {item.label}
              </span>
              <div className="flex items-center justify-end gap-2 min-w-0">
                <span className="text-[#1a1a1a] font-medium truncate tabular-nums">
                  {item.value}
                </span>
                {item.copyable && (
                  <button
                    type="button"
                    onClick={() => handleCopy(item.value)}
                    title="复制"
                    aria-label={`复制${item.label}`}
                    className="p-1 rounded text-[#999999] hover:text-[#1a1a1a] hover:bg-[#f7f7f7] transition-colors cursor-pointer shrink-0"
                  >
                    {copiedValue === item.value ? (
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom: Light Gray QR Code Area */}
        <div className="mt-6 bg-[#f7f7f7] border border-[#eaeaea] rounded-[12px] p-6 flex flex-col items-center justify-center text-center">
          <div className="bg-[#ffffff] p-3 rounded-[10px] border border-[#eaeaea]">
            <MinimalQrSvg seed={`${certification.id}-${certification.systemId}`} />
          </div>
          <p className="text-xs text-[#666666] mt-3.5 leading-relaxed">
            {certification.advisorQrHint || '扫码添加专属顾问获取报名通道'}
          </p>
        </div>
      </div>
    </div>
  );
};
