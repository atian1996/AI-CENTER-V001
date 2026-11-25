import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Key, 
  Plus, 
  Copy, 
  Check, 
  Trash2, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  Activity, 
  Lock,
  Sparkles
} from 'lucide-react';
import { ApiKeyItem } from '../../types';

export const WorkspaceApiKeys: React.FC = () => {
  const { apiKeys, createApiKey, revokeApiKey, showToast } = useApp();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [newKeyScope, setNewKeyScope] = useState('Full Access');
  const [newKeyLimit, setNewKeyLimit] = useState('10000');
  const [createdKeySecret, setCreatedKeySecret] = useState<string | null>(null);

  const handleCopy = (id: string, secret: string) => {
    navigator.clipboard.writeText(secret);
    setCopiedId(id);
    showToast('API Key 已复制到剪贴板！');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCreate = () => {
    if (!newKeyName.trim()) {
      showToast('请输入 API Key 名称');
      return;
    }
    const rawSecret = `qj_live_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`;
    createApiKey({
      name: newKeyName,
      prefix: `${rawSecret.substring(0, 12)}...`,
      scope: newKeyScope,
      dailyLimit: parseInt(newKeyLimit) || 10000,
      usedToday: 0,
      totalCalls: 0,
      createdAt: '2026-08-11',
      lastUsedAt: '从未',
      status: 'active'
    });
    setCreatedKeySecret(rawSecret);
    setNewKeyName('');
    showToast('API Key 创建成功！请复制保存');
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto text-[#1A1A1A]">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2.5">
            <span>API Key 管理</span>
            <span className="text-[11px] px-2 py-0.5 rounded font-medium bg-[#F5F5F5] text-[#555555] border border-[#EAEAEA]">
              密钥访问控制
            </span>
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            配置用于程序化调用 AI运营中心大模型与 Agent 接口的全功能 API Key 密钥
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedKeySecret(null);
            setShowCreateModal(true);
          }}
          className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>创建 API Key</span>
        </button>
      </div>

      {/* Security Alert Banner: 纯白底 + 左侧 3px 暗琥珀色竖线 + 深灰黑文字 */}
      <div className="bg-white border border-[#EAEAEA] border-l-[3px] border-l-[#D97706] rounded-md p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-[#D97706] shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-semibold text-[#1A1A1A]">API Key 安全保管守则</h4>
          <p className="text-[#555555] leading-relaxed">
            请妥善保管您的 API Key，切勿将其硬编码写在前端公开 JavaScript 或提交至开源 GitHub 仓库中。如怀疑密钥已泄露，请立即点击“销毁”并在生产环境中替换新密钥。
          </p>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="bg-white rounded-md border border-[#EAEAEA] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F8F9FA] text-[#333333] font-semibold border-b border-[#EAEAEA]">
              <tr>
                <th className="py-3.5 px-4">Key 名称</th>
                <th className="py-3.5 px-4">Prefix / 前缀</th>
                <th className="py-3.5 px-4">权限范围</th>
                <th className="py-3.5 px-4">今日用量 / 上限</th>
                <th className="py-3.5 px-4">总调用次数</th>
                <th className="py-3.5 px-4">创建时间</th>
                <th className="py-3.5 px-4">状态</th>
                <th className="py-3.5 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2F2F2]">
              {apiKeys.map((k) => (
                <tr key={k.id} className="hover:bg-[#FAFAFA] transition">
                  <td className="py-3.5 px-4">
                    <div className="font-semibold text-[#1A1A1A]">{k.name}</div>
                    <div className="text-[11px] text-[#888888] mt-0.5">上次使用: {k.lastUsedAt}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <code className="px-2 py-0.5 rounded bg-[#F5F5F5] border border-[#EAEAEA] font-mono text-[11px] text-[#333333]">
                      {k.prefix}
                    </code>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-[#F5F5F5] text-[#4B5563] border border-[#EAEAEA]">
                      {k.scope}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums text-[#333333]">
                    <span className="font-semibold text-[#1A1A1A]">{k.usedToday.toLocaleString()}</span> / {k.dailyLimit.toLocaleString()} 次
                  </td>
                  <td className="py-3.5 px-4 font-mono tabular-nums font-semibold text-[#1A1A1A]">{k.totalCalls.toLocaleString()} 次</td>
                  <td className="py-3.5 px-4 text-[#666666] font-mono tabular-nums">{k.createdAt}</td>
                  <td className="py-3.5 px-4 whitespace-nowrap">
                    {k.status === 'active' ? (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#166534]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#15803D]" />
                        <span>正常启用</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-[#888888]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#9CA3AF]" />
                        <span>已销毁</span>
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-3 whitespace-nowrap">
                    <button
                      onClick={() => handleCopy(k.id, k.prefix)}
                      className="text-[#333333] hover:text-[#1A1A1A] hover:underline font-medium cursor-pointer"
                    >
                      {copiedId === k.id ? '已复制' : '复制'}
                    </button>
                    {k.status === 'active' && (
                      <button
                        onClick={() => revokeApiKey(k.id)}
                        className="text-[#991B1B] hover:text-[#7F1D1D] no-underline hover:underline font-medium cursor-pointer"
                      >
                        销毁 Key
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-md p-6 border border-[#EAEAEA] space-y-4 animate-scale-up">
            <h3 className="text-sm font-semibold text-[#1A1A1A]">创建新 API Key</h3>

            {createdKeySecret ? (
              <div className="space-y-4">
                <div className="p-4 rounded-md bg-[#FAFAFA] border border-[#EAEAEA] border-l-[3px] border-l-[#15803D] text-xs space-y-2">
                  <div className="font-semibold text-[#1A1A1A]">请保存您的 API Key（它仅展示一次）</div>
                  <div className="p-2.5 bg-white rounded border border-[#EAEAEA] font-mono text-[11px] text-[#1A1A1A] font-medium break-all">
                    {createdKeySecret}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleCopy('new', createdKeySecret);
                    setShowCreateModal(false);
                  }}
                  className="w-full py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white font-semibold text-xs cursor-pointer transition"
                >
                  复制并关闭
                </button>
              </div>
            ) : (
              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1.5">Key 名称描述</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="例如：生产环境 Node.js 后端 Key"
                    className="w-full p-2.5 bg-white border border-[#E0E0E0] rounded-md text-[#1A1A1A] placeholder-[#999999] outline-none focus:border-[#1A1A1A] transition"
                  />
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1.5">权限类型</label>
                  <select
                    value={newKeyScope}
                    onChange={(e) => setNewKeyScope(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E0E0E0] rounded-md text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition"
                  >
                    <option value="Full Access">Full Access (读写全部模型与 Agent)</option>
                    <option value="Read Only">Read Only (只读获取数据)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#1A1A1A] font-semibold mb-1.5">每日调用上限 (次)</label>
                  <input
                    type="number"
                    value={newKeyLimit}
                    onChange={(e) => setNewKeyLimit(e.target.value)}
                    className="w-full p-2.5 bg-white border border-[#E0E0E0] rounded-md text-[#1A1A1A] font-mono outline-none focus:border-[#1A1A1A] transition"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-md bg-white border border-[#EAEAEA] hover:bg-[#F5F5F5] text-[#555555] font-medium cursor-pointer transition"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white font-semibold cursor-pointer transition"
                  >
                    生成密钥
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
