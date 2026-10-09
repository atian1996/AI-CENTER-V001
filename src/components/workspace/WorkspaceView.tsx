import React from 'react';
import { useApp } from '../../context/AppContext';
import { WorkspaceSubTab } from '../../types';
import { 
  FolderGit2, 
  CheckSquare, 
  PhoneCall, 
  Key, 
  Bell, 
  Wallet,
  User,
  Cpu,
  Trophy,
  MessageSquare
} from 'lucide-react';

import { WorkspaceHeader } from './WorkspaceHeader';
import { WorkspacePoints } from './WorkspacePoints';
import { WorkspaceAssets } from './WorkspaceAssets';
import { WorkspaceTasks } from './WorkspaceTasks';
import { WorkspaceCompute } from './WorkspaceCompute';
import { WorkspaceCompetitions } from './WorkspaceCompetitions';
import { WorkspaceCommunity } from './WorkspaceCommunity';
import { WorkspaceCalls } from './WorkspaceCalls';
import { WorkspaceApiKeys } from './WorkspaceApiKeys';
import { WorkspaceNotifications } from './WorkspaceNotifications';
import { WorkspaceSettings } from './WorkspaceSettings';

export const WorkspaceView: React.FC = () => {
  const { workspaceSubTab, setWorkspaceSubTab, unreadCount } = useApp();

  const sidebarItems: { id: WorkspaceSubTab; label: string; icon: React.ReactNode; badge?: number }[] = [
    { id: 'points', label: '我的账户', icon: <Wallet className="w-4 h-4" /> },
    { id: 'assets', label: '我的资产', icon: <FolderGit2 className="w-4 h-4" /> },
    { id: 'my-tasks', label: '我的任务', icon: <CheckSquare className="w-4 h-4" /> },
    { id: 'compute', label: '我的算力', icon: <Cpu className="w-4 h-4" /> },
    { id: 'competitions', label: '我的赛事', icon: <Trophy className="w-4 h-4" /> },
    { id: 'community', label: '我的社区', icon: <MessageSquare className="w-4 h-4" /> },
    { id: 'calls', label: '我的调用', icon: <PhoneCall className="w-4 h-4" /> },
    { id: 'apikeys', label: 'API Key管理', icon: <Key className="w-4 h-4" /> },
    { id: 'notifications', label: '通知中心', icon: <Bell className="w-4 h-4" />, badge: unreadCount },
    { id: 'settings', label: '我的资料', icon: <User className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800 -m-4 md:-m-8">
      
      {/* Workspace Header */}
      <WorkspaceHeader />

      {/* Main Layout Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-60 bg-white border-r border-slate-200/80 p-4 shrink-0 space-y-1">
          <div className="px-3 py-2 text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
            工作台功能导航
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = workspaceSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setWorkspaceSubTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-extrabold transition cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'text-white' : 'text-slate-400'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      isActive ? 'bg-white text-indigo-700' : 'bg-red-500 text-white'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main Subpage Content */}
        <main className="flex-1 min-w-0">
          {workspaceSubTab === 'points' && <WorkspacePoints />}
          {workspaceSubTab === 'assets' && <WorkspaceAssets />}
          {workspaceSubTab === 'my-tasks' && <WorkspaceTasks />}
          {workspaceSubTab === 'compute' && <WorkspaceCompute />}
          {workspaceSubTab === 'competitions' && <WorkspaceCompetitions />}
          {workspaceSubTab === 'community' && <WorkspaceCommunity />}
          {workspaceSubTab === 'calls' && <WorkspaceCalls />}
          {workspaceSubTab === 'apikeys' && <WorkspaceApiKeys />}
          {workspaceSubTab === 'notifications' && <WorkspaceNotifications />}
          {workspaceSubTab === 'settings' && <WorkspaceSettings />}
        </main>

      </div>

    </div>
  );
};
