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
    <div className="p-6 space-y-6 max-w-7xl mx-auto font-sans text-[#1A1A1A]">
      
      {/* 顶部标题 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#EAEAEA]">
        <div>
          <h2 className="text-xl font-semibold text-[#1A1A1A] tracking-tight flex items-center gap-2.5">
            <User className="w-5 h-5 text-[#333333]" />
            <span>我的资料</span>
          </h2>
          <p className="text-xs text-[#666666] mt-1">
            管理更新您的头像、昵称、身份类型、个人简介及社交主页链接
          </p>
        </div>
      </div>

      {/* Profile Form Container */}
      <div className="bg-white p-6 sm:p-8 rounded-md border border-[#EAEAEA] space-y-6">
        
        {/* Avatar Section */}
        <div className="flex items-center gap-5 pb-6 border-b border-[#F2F2F2]">
          <div className="relative group">
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-20 h-20 rounded-md object-cover border border-[#EAEAEA]" 
            />
            <button
              onClick={() => showToast('选择新头像功能已调起')}
              className="absolute inset-0 rounded-md bg-black/45 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
            >
              <Camera className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2.5">
              <h3 className="text-base font-semibold text-[#1A1A1A]">{user.name}</h3>
              {/* 身份标签：纯黑底白字，彰显高级极简质感 */}
              <span className="px-2.5 py-0.5 rounded text-[11px] font-medium bg-[#1A1A1A] text-white">
                {identityTag}
              </span>
            </div>
            <p className="text-xs text-[#888888]">支持 JPG、PNG 格式，建议尺寸 200×200px</p>
            <button
              onClick={() => showToast('选择新头像功能已调起')}
              className="px-3.5 py-1.5 rounded-md bg-white hover:bg-[#F5F5F5] border border-[#D4D4D4] hover:border-[#1A1A1A] text-[#333333] hover:text-[#1A1A1A] text-xs font-medium transition cursor-pointer"
            >
              更换头像
            </button>
          </div>
        </div>

        {/* Input Fields：纯白背景 + 极细浅灰边框，聚焦变纯黑边框 */}
        <div className="space-y-5 text-xs">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#1A1A1A] font-semibold mb-1.5">
                昵称 / 开发者 ID
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="请输入您的开发者昵称"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E0E0] rounded-md font-medium text-[#1A1A1A] placeholder-[#999999] outline-none focus:border-[#1A1A1A] transition"
              />
            </div>

            <div>
              <label className="block text-[#1A1A1A] font-semibold mb-1.5">
                身份类型
              </label>
              <select
                value={identityTag}
                onChange={(e) => setIdentityTag(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E0E0] rounded-md font-medium text-[#1A1A1A] outline-none focus:border-[#1A1A1A] transition cursor-pointer"
              >
                <option value="高级开发者 / 算法工程师">高级开发者 / 算法工程师</option>
                <option value="AI 创客 / 独立开发者">AI 创客 / 独立开发者</option>
                <option value="企业研发组 / 架构师">企业研发组 / 架构师</option>
                <option value="数据贡献者 / 数据分析师">数据贡献者 / 数据分析师</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#1A1A1A] font-semibold mb-1.5">
              个人简介 / Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={4}
              placeholder="介绍一下自己，如熟悉的 AI 框架、擅长的开发领域或个人项目..."
              className="w-full px-3.5 py-2.5 bg-white border border-[#E0E0E0] rounded-md text-[#1A1A1A] placeholder-[#999999] outline-none focus:border-[#1A1A1A] transition leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-1">
            <div>
              <label className="block text-[#1A1A1A] font-semibold mb-1.5 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-[#555555]" />
                <span>GitHub 个人主页</span>
              </label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/username"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E0E0] rounded-md text-[#1A1A1A] placeholder-[#999999] outline-none focus:border-[#1A1A1A] transition"
              />
            </div>

            <div>
              <label className="block text-[#1A1A1A] font-semibold mb-1.5 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#555555]" />
                <span>个人/公司官网 URL</span>
              </label>
              <input
                type="text"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#E0E0E0] rounded-md text-[#1A1A1A] placeholder-[#999999] outline-none focus:border-[#1A1A1A] transition"
              />
            </div>
          </div>

        </div>

        {/* Footer save bar inside card */}
        <div className="pt-5 border-t border-[#F2F2F2] flex items-center justify-between">
          <span className="text-[11px] text-[#888888] flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#666666]" />
            <span>修改后点击此处的保存按钮即可更新</span>
          </span>

          <button
            onClick={handleSaveProfile}
            className="px-5 py-2 rounded-md bg-[#1A1A1A] hover:bg-[#333333] text-white text-xs font-semibold transition cursor-pointer"
          >
            保存资料
          </button>
        </div>

      </div>

    </div>
  );
};
