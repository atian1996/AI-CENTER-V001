import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  User, 
  Camera,
  Github,
  Globe,
  Sparkles
} from 'lucide-react';

export const WorkspaceSettings: React.FC = () => {
  const { user, setUser, showToast } = useApp();

  // Profile Form state
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio);
  const [githubUrl, setGithubUrl] = useState(user.githubUrl || '');
  const [websiteUrl, setWebsiteUrl] = useState(user.websiteUrl || '');
  const [identityTag, setIdentityTag] = useState(user.identityTag);

  const handleSaveProfile = () => {
    setUser({
      ...user,
      name,
      bio,
      githubUrl,
      websiteUrl,
      identityTag
    });
    showToast('🎉 个人资料保存成功！');
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto font-sans text-slate-800">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200/80">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-indigo-600" />
            <span>我的资料</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
              个人信息
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            管理更新您的头像、昵称、身份类型、个人简介及社交主页链接
          </p>
        </div>
      </div>

      {/* Profile Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-6">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-5 pb-6 border-b border-slate-100">
          <div className="relative group">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-20 h-20 rounded-2xl object-cover ring-4 ring-indigo-50 shadow-md" 
            />
            <button
              onClick={() => showToast('选择新头像功能已调起')}
              className="absolute inset-0 rounded-2xl bg-slate-950/40 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">{user.name}</h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200">
                {identityTag}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">支持 JPG、PNG 格式，建议尺寸 200×200px</p>
            <button
              onClick={() => showToast('选择新头像功能已调起')}
              className="px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              更换头像
            </button>
          </div>
        </div>

        {/* Input Fields */}
        <div className="space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-slate-800 font-black mb-1.5">
                昵称 / 开发者 ID
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的开发者昵称"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-black mb-1.5">
                身份类型
              </label>
              <select
                value={identityTag}
                onChange={(e) => setIdentityTag(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition cursor-pointer"
              >
                <option value="高级开发者 / 算法工程师">高级开发者 / 算法工程师</option>
                <option value="AI 创客 / 独立开发者">AI 创客 / 独立开发者</option>
                <option value="企业研发组 / 架构师">企业研发组 / 架构师</option>
                <option value="数据贡献者 / 数据分析师">数据贡献者 / 数据分析师</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-800 font-black mb-1.5">
              个人简介 / Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="介绍一下自己，如熟悉的 AI 框架、擅长的开发领域或个人项目..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div>
              <label className="block text-slate-800 font-black mb-1.5 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-slate-600" />
                <span>GitHub 个人主页</span>
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition"
              />
            </div>

            <div>
              <label className="block text-slate-800 font-black mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-600" />
                <span>个人/公司官网 URL</span>
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-800 outline-none focus:bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-600/10 transition"
              />
            </div>
          </div>

        </div>

        {/* Footer save bar inside card */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>修改后点击此处的保存按钮即可更新</span>
          </span>

          <button
            onClick={handleSaveProfile}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition shadow-xs cursor-pointer"
          >
            保存资料
          </button>
        </div>

      </div>

    </div>
  );
};
