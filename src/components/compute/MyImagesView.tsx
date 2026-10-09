import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MyCustomImage } from '../../types';
import { 
  MoreVertical, 
  Trash2, 
  Eye, 
  User, 
  ThumbsUp, 
  Send, 
  Edit3, 
  Check, 
  ArrowLeft,
  Sparkles,
  RefreshCw,
  HardDrive
} from 'lucide-react';

export const MyImagesView: React.FC = () => {
  const { 
    myCustomImages, 
    deleteMyCustomImage, 
    updateMyCustomImageDescription,
    showToast 
  } = useApp();

  // 当前正在查看详情的镜像（若为 null 则展示卡片列表）
  const [selectedImageId, setSelectedImageId] = useState<string | null>(null);

  // 卡片三点菜单展开 ID
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // 镜像详情编辑 state
  const [isEditingDesc, setIsEditingDesc] = useState(false);
  const [editDescText, setEditDescText] = useState('');

  // 选中的镜像对象
  const currentImage = myCustomImages.find(img => img.id === selectedImageId);

  // 如果处于“查看详情”状态（参考截图 3）
  if (currentImage) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-2xs space-y-6 animate-fade-in text-slate-800">
        
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <button
            onClick={() => setSelectedImageId(null)}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>返回我的镜像列表</span>
          </button>
        </div>

        {/* Title & Status Bar (参考截图 3) */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {currentImage.name}
            </h1>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                已创建
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
                {currentImage.isPrivate ? '私有' : '公开'}
              </span>
            </div>
            
            <div className="text-xs text-slate-500 font-medium flex items-center gap-2 pt-1">
              <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-xs">
                <User className="w-3 h-3" />
              </div>
              <span>{currentImage.authorName}</span>
              <span>·</span>
              <span>创建于 {currentImage.createdAt}</span>
            </div>
          </div>
        </div>

        {/* Specs Parameters Section (参考截图 3) */}
        <div className="py-4 space-y-3 text-xs border-t border-slate-100">
          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium w-20">镜像大小</span>
            <span className="font-extrabold text-slate-800">{currentImage.size}</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium w-20">使用权限</span>
            <span className="font-extrabold text-slate-800">
              {currentImage.isPrivate ? '仅自己可见' : '公开可用'}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-slate-500 font-medium w-20">镜像标签</span>
            <span className="text-slate-500 font-medium">
              {currentImage.tags && currentImage.tags.length > 0 
                ? currentImage.tags.join(', ') 
                : '暂无标签'}
            </span>
          </div>

          {/* 镜像详情与编辑 */}
          <div className="flex items-start gap-4 pt-2">
            <span className="text-slate-500 font-medium w-20 shrink-0 pt-0.5">镜像详情</span>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                {!isEditingDesc && (
                  <button
                    onClick={() => {
                      setEditDescText(currentImage.description);
                      setIsEditingDesc(true);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>编辑</span>
                  </button>
                )}
              </div>

              {isEditingDesc ? (
                <div className="space-y-2">
                  <textarea
                    rows={3}
                    value={editDescText}
                    onChange={(e) => setEditDescText(e.target.value)}
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white focus:border-indigo-600 font-mono"
                  />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        updateMyCustomImageDescription(currentImage.id, editDescText);
                        setIsEditingDesc(false);
                      }}
                      className="px-3 py-1 bg-indigo-600 text-white rounded-lg font-bold text-xs cursor-pointer"
                    >
                      保存
                    </button>
                    <button
                      onClick={() => setIsEditingDesc(false)}
                      className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-700 font-medium leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {currentImage.description || '这里是镜像详情'}
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    );
  }

  // 镜像列表与存储用量视图（参考截图 1 & 截图 2）
  return (
    <div className="space-y-6 animate-fade-in text-slate-800">
      
      {/* Top Storage Progress Bar (截图 1, 2 顶部) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold text-slate-600">
          <span>我的镜像存储使用情况</span>
          <span className="font-mono text-slate-900">18.7 GiB / 200.0 GiB</span>
        </div>

        {/* Purple Progress Line */}
        <div className="w-full h-2.5 bg-slate-200/80 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: '9.35%' }}
          />
        </div>
      </div>

      {/* Image Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
        {myCustomImages.map((img) => {
          const isCompressing = img.status === 'compressing';

          return (
            <div
              key={img.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs space-y-4 relative flex flex-col justify-between hover:shadow-md transition"
            >
              <div className="space-y-3">
                
                {/* Header Title & 3-Dots Menu */}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-black text-slate-900 tracking-tight leading-snug">
                    {img.name}
                  </h3>

                  {!isCompressing && (
                    <div className="relative">
                      <button
                        onClick={() => setOpenMenuId(openMenuId === img.id ? null : img.id)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>

                      {/* Dropdown Menu (参考截图 2: 查看详情 / 删除) */}
                      {openMenuId === img.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-white rounded-xl shadow-xl border border-slate-200 py-1 z-30 animate-fade-in">
                          <button
                            onClick={() => {
                              setSelectedImageId(img.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3.5 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 text-left font-bold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5 text-slate-500" />
                            <span>查看详情</span>
                          </button>

                          <button
                            onClick={() => {
                              deleteMyCustomImage(img.id);
                              setOpenMenuId(null);
                            }}
                            className="w-full px-3.5 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 text-left font-bold cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500" />
                            <span>删除</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                  <div className="w-5 h-5 rounded-full bg-slate-200 text-slate-600 flex items-center justify-center font-bold text-[10px]">
                    <User className="w-3 h-3" />
                  </div>
                  <span>{img.authorName}</span>
                </div>

                {/* Size Pill (紫色细框) */}
                <div>
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold font-mono text-purple-700 bg-purple-50/60 border border-purple-200">
                    {img.size}
                  </span>
                </div>

              </div>

              {/* Bottom Action / Banner Divider */}
              {isCompressing && (
                <div className="pt-3 border-t border-slate-100 mt-2">
                  <div className="text-xs font-bold text-amber-600 flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                    <span>正在压缩镜像文件</span>
                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
};
