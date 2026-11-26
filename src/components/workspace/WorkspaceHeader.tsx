import React from 'react';
import { LayoutDashboard } from 'lucide-react';

export const WorkspaceHeader: React.FC = () => {
  return (
    <div className="bg-white border-b border-[#EAEAEA] px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
      
      {/* Title & Status */}
      <div className="flex items-center gap-3.5 shrink-0">
        <div className="w-9 h-9 rounded-md bg-[#F5F5F5] border border-[#EAEAEA] text-[#1A1A1A] flex items-center justify-center">
          <LayoutDashboard className="w-4.5 h-4.5" />
        </div>
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-base font-semibold text-[#1A1A1A] tracking-tight">
              开发者工作台
            </h1>
          </div>
          <p className="text-xs text-[#666666] mt-0.5">
            全站 AI 资产控制、任务协同、算力调度与云端数据统一管理平台
          </p>
        </div>
      </div>

    </div>
  );
};

