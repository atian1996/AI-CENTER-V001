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
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col font-sans text-[#1A1A1A] -m-4 md:-m-8">
      
      {/* Workspace Header */}
      <WorkspaceHeader />

      {/* Main Layout Container: Sidebar + Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-60 bg-white border-r border-[#EAEAEA] p-4 shrink-0 space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold text-[#999999] tracking-wider">
            工作台功能导航
          </div>

          <nav className="space-y-1">
            {sidebarItems.map((item) => {
              const isActive = workspaceSubTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setWorkspaceSubTab(item.id)}
                  className={`theme-nav-item w-full flex items-center justify-between px-3.5 py-2.5 rounded-md text-xs font-semibold cursor-pointer ${
                    isActive
                      ? 'theme-sidebar-active'
                      : 'text-[#666666] hover:text-[#1A1A1A] hover:bg-[#F5F5F5]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={isActive ? 'theme-sidebar-icon text-white' : 'text-[#888888]'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold tabular-nums ${
                      isActive
                        ? 'bg-[#991B1B] text-white'
                        : 'bg-[#991B1B] text-white'
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
