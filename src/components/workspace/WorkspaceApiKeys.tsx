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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>API Key 管理</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700">
              密钥访问控制
            </span>
          </h2>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            配置用于程序化调用 AI运营中心大模型与 Agent 接口的全功能 API Key 密钥
          </p>
        </div>

        <button
          onClick={() => {
            setCreatedKeySecret(null);
            setShowCreateModal(true);
          }}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-extrabold transition shadow-md flex items-center gap-2 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>创建 API Key</span>
        </button>
      </div>

      {/* Security Alert Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-3xl p-4 flex items-start gap-3">
        <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1 text-xs">
          <h4 className="font-extrabold text-amber-900">🛡️ API Key 安全保管守则</h4>
          <p className="text-amber-800/80 font-medium leading-relaxed">
            请妥善保管您的 API Key，切勿将其硬编码写在前端公开 JavaScript 或提交至开源 GitHub 仓库中。如怀疑密钥已泄露，请立即点击“销毁”并在生产环境中替换新密钥。
          </p>
        </div>
      </div>

      {/* API Keys Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50 text-slate-500 font-extrabold border-b border-slate-200">
            <tr>
              <th className="p-4">Key 名称</th>
              <th className="p-4">Prefix / 前缀</th>
              <th className="p-4">权限范围</th>
              <th className="p-4">今日用量 / 上限</th>
              <th className="p-4">总调用次数</th>
              <th className="p-4">创建时间</th>
              <th className="p-4">状态</th>
              <th className="p-4 text-right">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {apiKeys.map((k) => (
              <tr key={k.id} className="hover:bg-slate-50 transition">
                <td className="p-4">
                  <div className="font-black text-slate-900">{k.name}</div>
                  <div className="text-[10px] text-slate-400">上次使用: {k.lastUsedAt}</div>
                </td>
                <td className="p-4 font-mono font-bold text-slate-700">{k.prefix}</td>
                <td className="p-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-indigo-50 text-indigo-700">
                    {k.scope}
                  </span>
                </td>
                <td className="p-4 font-bold text-slate-800">
                  {k.usedToday.toLocaleString()} / {k.dailyLimit.toLocaleString()} 次
                </td>
                <td className="p-4 font-bold text-indigo-600">{k.totalCalls.toLocaleString()} 次</td>
                <td className="p-4 text-slate-400">{k.createdAt}</td>
                <td className="p-4">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${
                    k.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {k.status === 'active' ? '正常启用' : '已销毁'}
                  </span>
                </td>
                <td className="p-4 text-right space-x-2">
                  <button
                    onClick={() => handleCopy(k.id, k.prefix)}
                    className="text-indigo-600 hover:text-indigo-700 font-extrabold cursor-pointer"
                  >
                    {copiedId === k.id ? '已复制' : '复制'}
                  </button>
                  {k.status === 'active' && (
                    <button
                      onClick={() => revokeApiKey(k.id)}
                      className="text-red-600 hover:text-red-700 font-extrabold cursor-pointer"
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

      {/* Create API Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <h3 className="text-sm font-black text-slate-900">创建新 API Key</h3>

            {createdKeySecret ? (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs space-y-2">
                  <div className="font-extrabold text-emerald-900">⚠️ 请保存您的 API Key（它仅展示一次）</div>
                  <div className="p-2.5 bg-white rounded-xl border border-emerald-200 font-mono text-[11px] text-slate-900 font-bold break-all">
                    {createdKeySecret}
                  </div>
                </div>

                <button
                  onClick={() => {
                    handleCopy('new', createdKeySecret);
                    setShowCreateModal(false);
                  }}
                  className="w-full py-2.5 rounded-xl bg-emerald-600 text-white font-extrabold text-xs cursor-pointer"
                >
                  复制并关闭
                </button>
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">Key 名称描述</label>
                  <input
                    type="text"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    placeholder="例如：生产环境 Node.js 后端 Key"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">权限类型</label>
                  <select
                    value={newKeyScope}
                    onChange={(e) => setNewKeyScope(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  >
                    <option value="Full Access">Full Access (读写全部模型与 Agent)</option>
                    <option value="Read Only">Read Only (只读获取数据)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-extrabold mb-1">每日调用上限 (次)</label>
                  <input
                    type="number"
                    value={newKeyLimit}
                    onChange={(e) => setNewKeyLimit(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreate}
                    className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold cursor-pointer"
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
