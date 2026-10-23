import React from 'react';
import { X, Copy, Share2, Sparkles, Gift } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const InviteFriendsModal: React.FC = () => {
  const { isInviteModalOpen, setIsInviteModalOpen, showToast, user } = useApp();

  if (!isInviteModalOpen) return null;

  const inviteCode = 'QIANJI-VIP-8829';
  const inviteUrl = `https://qianji.ai/register?invite=${inviteCode}`;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(inviteCode);
    showToast('专属邀请码已复制到剪贴板！');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(inviteUrl);
    showToast('专属邀请链接已复制到剪贴板，快发给好友吧！');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 select-none">
        
        {/* Header with warm festive gradient */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 p-6 text-white relative">
          <button
            onClick={() => setIsInviteModalOpen(false)}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-xl">🤝</span>
            <span className="text-[11px] font-bold tracking-wider uppercase opacity-90 px-2 py-0.5 rounded-full bg-white/20">
              开发者邀请计划 · 双方有礼
            </span>
          </div>

          <h2 className="text-2xl font-black flex items-center gap-2">
            <span>邀请好友，双方各得</span>
            <span className="text-amber-200 font-mono">¥20</span>
          </h2>
          
          <p className="text-xs text-white/90 mt-1.5 leading-relaxed">
            好友通过您的专属链接或邀请码完成注册，系统自动派发 20 元现金抵扣券与 100 初始积分，全额抵扣模型与算力！
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 text-left">
          
          {/* 邀请码 */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5 flex items-center justify-between">
              <span>您的专属邀请码</span>
              <span className="text-[11px] text-amber-600 font-mono font-medium">邀请人: {user.name}</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteCode}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 font-mono text-sm font-black text-indigo-900 focus:outline-none select-all"
              />
              <button
                onClick={handleCopyCode}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-bold transition cursor-pointer flex items-center gap-1.5 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>复制</span>
              </button>
            </div>
          </div>

          {/* 专属邀请链接 */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">专属邀请链接</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={inviteUrl}
                className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono text-slate-600 truncate focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-xs hover:scale-[1.02] active:scale-[0.98]"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>复制链接</span>
              </button>
            </div>
          </div>

          {/* 返利规则说明 */}
          <div className="bg-amber-50/70 border border-amber-200/90 rounded-2xl p-3.5 text-xs text-amber-900 leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1 text-amber-800">
              <Gift className="w-3.5 h-3.5 text-amber-600" />
              <span>返利与奖励机制：</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800/90 pl-1">
              <li>好友完成新用户注册，¥20 体验金与 100 积分即刻到账；</li>
              <li>好友首月在平台调用模型或租用算力，您享 10% 佣金返还；</li>
              <li>邀请无上限，推荐越多，累计算力抵扣金与现金奖励越高。</li>
            </ul>
          </div>

          <button
            onClick={() => {
              handleCopyLink();
              setIsInviteModalOpen(false);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold text-xs shadow-md transition cursor-pointer flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>复制链接并分享给好友</span>
          </button>
        </div>

      </div>
    </div>
  );
};
