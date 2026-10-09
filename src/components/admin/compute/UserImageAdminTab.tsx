import React, { useState, useMemo } from 'react';
import { useApp } from '../../../context/AppContext';
import { MyCustomImage } from '../../../types';
import {
  Search,
  X,
  Eye,
  Trash2,
  HardDrive,
  User,
  Clock,
  AlertTriangle,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Loader2,
  Sliders,
  Sparkles,
  Info,
  Calendar,
  Layers,
  Database,
  ArrowUpDown
} from 'lucide-react';

export const UserImageAdminTab: React.FC = () => {
  const {
    myCustomImages,
    forceDeleteUserCustomImage,
    userImageQuota,
    setUserImageQuota,
    userImageAutoCleanupDays,
    setUserImageAutoCleanupDays,
    showToast
  } = useApp();

  // 搜索与状态筛选
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'compressing' | 'failed'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // 配额设置弹窗 / 展开设置状态
  const [quotaConfigOpen, setQuotaConfigOpen] = useState(false);
  const [tempQuota, setTempQuota] = useState(userImageQuota);
  const [tempCleanupDays, setTempCleanupDays] = useState(userImageAutoCleanupDays);

  // 查看详情弹窗
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<MyCustomImage | null>(null);

  // 强制删除弹窗
  const [forceDeleteModalOpen, setForceDeleteModalOpen] = useState(false);
  const [imageToDelete, setImageToDelete] = useState<MyCustomImage | null>(null);
  const [deleteReason, setDeleteReason] = useState('包含违规内容或存在安全漏洞隐患');
  const [customReasonText, setCustomReasonText] = useState('');

  // 统计概览
  const stats = useMemo(() => {
    const totalCount = myCustomImages.length;
    const availableCount = myCustomImages.filter(img => img.status === 'ready' || img.status === 'available' || !img.status).length;
    const compressingCount = myCustomImages.filter(img => img.status === 'compressing').length;
    const failedCount = myCustomImages.filter(img => img.status === 'failed').length;
    
    // 计算占用存储总空间 (GB)
    const totalStorageGb = myCustomImages.reduce((sum, img) => {
      const match = (img.size || '0').match(/(\d+(\.\d+)?)/);
      return sum + (match ? parseFloat(match[1]) : 0);
    }, 0);

    return {
      totalCount,
      availableCount,
      compressingCount,
      failedCount,
      totalStorageGb: totalStorageGb.toFixed(1)
    };
  }, [myCustomImages]);

  // 筛选过滤
  const filteredList = useMemo(() => {
    return myCustomImages.filter(img => {
      const matchSearch =
        img.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.authorName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.userPhone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.userId || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.baseImage || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (img.description || '').toLowerCase().includes(searchTerm.toLowerCase());

      let matchStatus = true;
      if (statusFilter === 'available') {
        matchStatus = img.status === 'ready' || img.status === 'available' || !img.status;
      } else if (statusFilter === 'compressing') {
        matchStatus = img.status === 'compressing';
      } else if (statusFilter === 'failed') {
        matchStatus = img.status === 'failed';
      }

      return matchSearch && matchStatus;
    });
  }, [myCustomImages, searchTerm, statusFilter]);

  // 分页数据
  const totalPages = Math.ceil(filteredList.length / pageSize) || 1;
  const paginatedList = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredList.slice(start, start + pageSize);
  }, [filteredList, currentPage]);

  const handleOpenDetail = (img: MyCustomImage) => {
    setSelectedImage(img);
    setDetailModalOpen(true);
  };

  const handleOpenForceDelete = (img: MyCustomImage) => {
    setImageToDelete(img);
    setDeleteReason('包含违规内容或存在安全漏洞隐患');
    setCustomReasonText('');
    setForceDeleteModalOpen(true);
  };

  const handleConfirmForceDelete = () => {
    if (!imageToDelete) return;
    const finalReason = deleteReason === '其他原因' ? customReasonText.trim() : deleteReason;
    forceDeleteUserCustomImage(imageToDelete.id, finalReason);
    setForceDeleteModalOpen(false);
    setImageToDelete(null);
  };

  const handleSaveQuotaConfig = () => {
    if (tempQuota < 10) {
      showToast('默认存储配额不能低于 10 GB');
      return;
    }
    if (tempCleanupDays < 30) {
      showToast('长期未使用清理周期不能低于 30 天');
      return;
    }
    setUserImageQuota(tempQuota);
    setUserImageAutoCleanupDays(tempCleanupDays);
    setQuotaConfigOpen(false);
    showToast('用户镜像存储配额及清理规则已成功保存！');
  };

  // 状态渲染辅助函数
  const renderStatusBadge = (status?: string) => {
    if (status === 'compressing') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>创建中</span>
        </span>
      );
    }
    if (status === 'failed') {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-400 border border-rose-500/30">
          <XCircle className="w-3 h-3" />
          <span>创建失败</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
        <CheckCircle2 className="w-3 h-3" />
        <span>可用</span>
      </span>
    );
  };

  return (
    <div className="space-y-6">
      
      {/* 顶部统计卡片与配额管理看板 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">用户镜像总数</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.totalCount}</p>
            <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
              <span className="text-emerald-400 font-semibold">{stats.availableCount} 可用</span>
              <span>·</span>
              <span className="text-amber-400 font-semibold">{stats.compressingCount} 创建中</span>
            </div>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">已占用总存储空间</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{stats.totalStorageGb} <span className="text-sm text-slate-400 font-normal">GB</span></p>
            <p className="text-[11px] text-slate-400 mt-1">全平台自定义镜像总容量</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
            <HardDrive className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">默认单用户存储配额</p>
            <p className="text-2xl font-bold text-indigo-400 mt-1">{userImageQuota} <span className="text-sm text-slate-400 font-normal">GB</span></p>
            <button 
              onClick={() => {
                setTempQuota(userImageQuota);
                setTempCleanupDays(userImageAutoCleanupDays);
                setQuotaConfigOpen(true);
              }}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 underline mt-1 cursor-pointer"
            >
              配置配额与清理策略
            </button>
          </div>
          <div className="w-11 h-11 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            <Sliders className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-slate-400 font-medium">长期闲置清理周期</p>
            <p className="text-2xl font-bold text-cyan-400 mt-1">{userImageAutoCleanupDays} <span className="text-sm text-slate-400 font-normal">天</span></p>
            <p className="text-[11px] text-slate-400 mt-1">超过阈值未引用触发清理</p>
          </div>
          <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Clock className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 配额与清理机制说明横幅 */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-xl p-4.5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3 max-w-3xl">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
            <Info className="w-4 h-4" />
          </div>
          <div className="space-y-1 text-xs">
            <div className="font-bold text-slate-200 flex items-center gap-2">
              <span>用户镜像管理规范及清理机制说明</span>
              <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 text-[10px] font-mono">不可编辑 · 仅查看与违规下线</span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              ① <strong className="text-slate-300">用户配额管理</strong>：每个用户镜像存储上限建议值为 <strong className="text-indigo-300">{userImageQuota}G</strong>；
              ② <strong className="text-slate-300">用户主动删除</strong>：立即释放存储空间；
              ③ <strong className="text-slate-300">账号注销</strong>：自动释放该用户所有镜像；
              ④ <strong className="text-slate-300">长期未使用</strong>：创建超 <strong className="text-indigo-300">{userImageAutoCleanupDays}天</strong> 且无实例引用的镜像将进入归档队列。
            </p>
          </div>
        </div>

        <button
          onClick={() => {
            setTempQuota(userImageQuota);
            setTempCleanupDays(userImageAutoCleanupDays);
            setQuotaConfigOpen(true);
          }}
          className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>修改配额规则</span>
        </button>
      </div>

      {/* 搜索与状态过滤工具栏 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[300px]">
          {/* 搜索框 */}
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索镜像名称、所属用户昵称/手机号/ID、基础环境..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-lg pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 状态筛选 */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium whitespace-nowrap">状态:</span>
            <select
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value as any);
                setCurrentPage(1);
              }}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
            >
              <option value="all">全部状态</option>
              <option value="available">可用</option>
              <option value="compressing">创建中</option>
              <option value="failed">创建失败</option>
            </select>
          </div>
        </div>

        {/* 筛选结果统计与重置 */}
        {(searchTerm || statusFilter !== 'all') && (
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('all');
              setCurrentPage(1);
            }}
            className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 cursor-pointer"
          >
            重置筛选条件
          </button>
        )}
      </div>

      {/* 用户镜像列表表格 */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-800/80 text-slate-400 font-semibold border-b border-slate-700/80">
              <tr>
                <th className="py-3 px-4">镜像名称</th>
                <th className="py-3 px-4">所属用户</th>
                <th className="py-3 px-4">镜像大小</th>
                <th className="py-3 px-4">创建时间</th>
                <th className="py-3 px-4">状态</th>
                <th className="py-3 px-4 text-right">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {paginatedList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <Layers className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
                    <p className="text-sm">暂无匹配的用户镜像记录</p>
                  </td>
                </tr>
              ) : (
                paginatedList.map(img => (
                  <tr key={img.id} className="hover:bg-slate-800/40 transition-colors">
                    
                    {/* 镜像名称 */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white flex items-center gap-2">
                        <span>{img.name}</span>
                        {img.baseImage && (
                          <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-mono border border-slate-700">
                            {img.baseImage}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                        {img.description || '用户未填写备注描述'}
                      </p>
                    </td>

                    {/* 所属用户 */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-[10px] font-bold">
                          {(img.authorName || 'U').substring(0, 1)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-200">{img.authorName || '测试用户'}</div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            {img.userPhone || img.userId || '138****0001'}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* 镜像大小 */}
                    <td className="py-3.5 px-4">
                      <span className="font-mono text-slate-200 font-semibold px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-[11px]">
                        {img.size || '15.0 GB'}
                      </span>
                    </td>

                    {/* 创建时间 */}
                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                      {img.createdAt || '2026-03-20 10:00:00'}
                    </td>

                    {/* 状态 */}
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      {renderStatusBadge(img.status)}
                    </td>

                    {/* 操作：【查看详情】【强制删除】 */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {/* 查看详情 */}
                        <button
                          onClick={() => handleOpenDetail(img)}
                          className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 font-semibold text-xs transition cursor-pointer flex items-center gap-1 border border-indigo-500/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>查看详情</span>
                        </button>

                        {/* 强制删除 (仅违规情况) */}
                        <button
                          onClick={() => handleOpenForceDelete(img)}
                          className="px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-semibold text-xs transition cursor-pointer flex items-center gap-1 border border-rose-500/20"
                          title="仅在用户镜像包含恶意脚本、盗版模型等违规情况时使用"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>强制删除</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页控制 */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>共 {filteredList.length} 个用户镜像</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                上一页
              </button>
              <span className="px-2 font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition"
              >
                下一页
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 用户镜像详情弹窗 (只读) */}
      {detailModalOpen && selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base flex items-center gap-2">
                    <span>{selectedImage.name}</span>
                    {renderStatusBadge(selectedImage.status)}
                  </h3>
                  <p className="text-xs text-slate-400">用户自定义镜像档案详情 (只读模式)</p>
                </div>
              </div>
              <button
                onClick={() => setDetailModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300">
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-slate-400">创建所属用户：</span>
                  <div className="font-bold text-white flex items-center gap-2 mt-1">
                    <User className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{selectedImage.authorName || '未命名用户'}</span>
                    <span className="text-slate-400 font-normal font-mono">({selectedImage.userPhone || '138****0001'})</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-slate-400">存储空间占用：</span>
                  <div className="font-bold text-amber-400 flex items-center gap-2 mt-1">
                    <HardDrive className="w-3.5 h-3.5 text-amber-400" />
                    <span className="font-mono text-sm">{selectedImage.size || '15.0 GB'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-slate-400">创建时间：</span>
                  <div className="font-semibold text-slate-200 flex items-center gap-2 mt-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{selectedImage.createdAt || '2026-03-20 10:00:00'}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                  <span className="text-slate-400">基础源镜像：</span>
                  <div className="font-semibold text-slate-200 flex items-center gap-2 mt-1">
                    <Database className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="truncate">{selectedImage.baseImage || 'PyTorch 2.2.2 / CUDA 12.1'}</span>
                  </div>
                </div>
              </div>

              {/* 镜像描述与说明 */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-medium">镜像说明与环境描述：</span>
                <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/60 text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {selectedImage.description || '用户暂未填写任何附加描述。'}
                </div>
              </div>

              {/* 存储路径与底层标识 */}
              <div className="space-y-1.5">
                <span className="text-slate-400 font-medium">集群底层存储挂载路径：</span>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-[11px] text-indigo-300 border border-slate-800 truncate">
                  /mnt/cluster_storage/user_images/{selectedImage.userId || 'u_1001'}/{selectedImage.id}.img
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                <Info className="w-4 h-4 shrink-0 text-amber-400" />
                <span>后台仅支持对用户镜像进行数据审计与只读查看。如遇严重违规请使用【强制删除】。</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex justify-end">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs transition cursor-pointer"
              >
                关闭
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 强制删除弹窗 (违规情况) */}
      {forceDeleteModalOpen && imageToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-slate-900 border border-rose-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-5 bg-rose-950/40 border-b border-rose-900/40 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">强制删除用户镜像 (违规处理)</h3>
              </div>
              <button
                onClick={() => setForceDeleteModalOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700/80 space-y-1.5">
                <div className="flex justify-between text-slate-400">
                  <span>目标镜像：</span>
                  <span className="font-bold text-white">{imageToDelete.name}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>所属用户：</span>
                  <span className="font-medium text-slate-200">{imageToDelete.authorName} ({imageToDelete.userPhone || '138****0001'})</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>释放空间：</span>
                  <span className="font-bold text-emerald-400 font-mono">{imageToDelete.size}</span>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-slate-300 font-medium">违规原因分类：</label>
                <div className="grid grid-cols-1 gap-2">
                  {[
                    '包含违规内容或存在安全漏洞隐患',
                    '侵犯第三方知识产权或未授权模型',
                    '植入未经批准的挖矿/攻击脚本',
                    '其他原因'
                  ].map(reason => (
                    <label 
                      key={reason}
                      onClick={() => setDeleteReason(reason)}
                      className={`flex items-center gap-2.5 p-2.5 rounded-lg border cursor-pointer transition ${
                        deleteReason === reason 
                          ? 'bg-rose-500/10 border-rose-500/40 text-rose-200 font-bold' 
                          : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deleteReason"
                        checked={deleteReason === reason}
                        onChange={() => setDeleteReason(reason)}
                        className="text-rose-500 focus:ring-rose-500"
                      />
                      <span>{reason}</span>
                    </label>
                  ))}
                </div>
              </div>

              {deleteReason === '其他原因' && (
                <div className="space-y-1">
                  <label className="block text-slate-400">具体违规说明 (将作为下发给用户的通知内容)：</label>
                  <textarea
                    rows={3}
                    placeholder="请输入违规事实说明..."
                    value={customReasonText}
                    onChange={e => setCustomReasonText(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                  />
                </div>
              )}

              <p className="text-[11px] text-rose-400/90 leading-relaxed bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                ⚠️ 警告：执行强制删除后，系统将彻底销毁该镜像存储文件并释放容量，同时向所属用户发送违规处置通知，此操作不可撤销。
              </p>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setForceDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleConfirmForceDelete}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md shadow-rose-600/30 transition cursor-pointer"
              >
                确认强制下线删除
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 用户配额与清理规则配置弹窗 */}
      {quotaConfigOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
            
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-900/90">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-white text-sm">用户镜像配额与清理机制配置</h3>
              </div>
              <button
                onClick={() => setQuotaConfigOpen(false)}
                className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-5 text-xs text-slate-300">
              
              {/* 配额设置项 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>默认用户存储配额 (GB)</span>
                  </label>
                  <span className="text-[11px] text-indigo-400">建议值：200 GB</span>
                </div>
                <input
                  type="number"
                  min={10}
                  max={2048}
                  value={tempQuota}
                  onChange={e => setTempQuota(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500">控制单个普通用户在前台创建自定义镜像时可占用的最高存储上限。</p>
              </div>

              {/* 长期未使用清理周期 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-200 flex items-center gap-1.5">
                    <span>长期闲置镜像清理周期 (天)</span>
                  </label>
                  <span className="text-[11px] text-cyan-400">建议值：180 天</span>
                </div>
                <input
                  type="number"
                  min={30}
                  max={720}
                  value={tempCleanupDays}
                  onChange={e => setTempCleanupDays(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
                />
                <p className="text-[11px] text-slate-500">若自定义镜像超过该天数未在任何租用实例中被启动使用，系统将提醒用户并自动归档清理。</p>
              </div>

              {/* 清理机制规则卡片 */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <h4 className="font-bold text-slate-200 text-xs flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>镜像清理触发场景说明</span>
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  <li className="flex items-center justify-between">
                    <span>1. 用户前台主动删除镜像</span>
                    <span className="text-emerald-400 font-semibold">立即释放存储空间</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>2. 用户注销平台账号</span>
                    <span className="text-indigo-400 font-semibold">释放该用户全部镜像存储</span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span>3. 超过 {tempCleanupDays} 天未使用</span>
                    <span className="text-amber-400 font-semibold">系统提示后归档/清理</span>
                  </li>
                </ul>
              </div>

            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setQuotaConfigOpen(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition cursor-pointer"
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleSaveQuotaConfig}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition cursor-pointer"
              >
                保存配置
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
