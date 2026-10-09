import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { GPUInstance } from '../../types';
import { 
  X, 
  Cpu, 
  Play, 
  Square, 
  RotateCcw, 
  Trash2, 
  ExternalLink, 
  Copy, 
  Check, 
  Server, 
  HardDrive, 
  Shield, 
  Activity, 
  FileText, 
  Folder, 
  Save, 
  Terminal, 
  Layers, 
  Download, 
  Upload, 
  Clock, 
  Coins 
} from 'lucide-react';

export const InstanceDetailModal: React.FC = () => {
  const { 
    detailInstance, 
    setDetailInstance, 
    toggleGpuInstanceStatus, 
    restartGpuInstance, 
    deleteGpuInstance, 
    showToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'monitor' | 'disk' | 'security' | 'files' | 'snapshot' | 'billing' | 'logs'>('info');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Editable Name State
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameValue, setNameValue] = useState(detailInstance?.name || '');

  // Snapshot Form
  const [snapshotName, setSnapshotName] = useState('');
  const [snapshotDesc, setSnapshotDesc] = useState('');

  if (!detailInstance) return null;

  const inst = detailInstance;
  const isServer = inst.instanceType === 'server';

  const copyText = (txt: string, key: string) => {
    navigator.clipboard.writeText(txt);
    setCopiedKey(key);
    showToast('已复制到剪贴板');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSaveSnapshot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snapshotName.trim()) {
      showToast('请输入快照镜像名称');
      return;
    }
    showToast(`镜像快照【${snapshotName}】构建成功，已保存至私有快照库`);
    setSnapshotName('');
    setSnapshotDesc('');
  };

  return (
    <div className="fixed inset-0 z-[95] overflow-y-auto flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-md animate-fade-in select-none">
      <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col h-[88vh] my-auto">
        
        {/* Header Bar */}
        <div className="p-5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4 bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg shrink-0 font-bold ${
              isServer ? 'bg-indigo-50 text-indigo-600 border border-indigo-200' : 'bg-cyan-50 text-cyan-600 border border-cyan-200'
            }`}>
              {isServer ? <Server className="w-5 h-5" /> : <Cpu className="w-5 h-5" />}
            </div>

            <div>
              <div className="flex items-center gap-2">
                {isEditingName ? (
                  <input
                    type="text"
                    value={nameValue}
                    onChange={(e) => setNameValue(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    className="p-1 text-sm font-bold border border-cyan-400 rounded outline-none bg-white"
                    autoFocus
                  />
                ) : (
                  <span onClick={() => setIsEditingName(true)} className="text-base font-extrabold text-slate-900 cursor-pointer hover:text-indigo-600 flex items-center gap-1">
                    {nameValue || inst.name}
                  </span>
                )}

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                  isServer ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                }`}>
                  {isServer ? '云服务器实例' : '容器实例'}
                </span>

                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                  inst.status === 'running' 
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}>
                  {inst.status === 'running' ? '● 运行中' : '○ 已停止'}
                </span>
              </div>

              <div className="text-[11px] text-slate-500 font-mono mt-0.5 font-medium">
                ID: {inst.id} · 地域: {inst.region} · 镜像: {inst.imageName}
              </div>
            </div>
          </div>

          {/* Quick Instance Actions */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => toggleGpuInstanceStatus(inst.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition cursor-pointer ${
                inst.status === 'running'
                  ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-200'
                  : 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
              }`}
            >
              {inst.status === 'running' ? <Square className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
              <span>{inst.status === 'running' ? '停止' : '启动'}</span>
            </button>

            <button
              onClick={() => restartGpuInstance(inst.id)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>重启</span>
            </button>

            <button
              onClick={() => {
                deleteGpuInstance(inst.id);
                setDetailInstance(null);
              }}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 flex items-center gap-1 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>释放销毁</span>
            </button>

            <button
              onClick={() => setDetailInstance(null)}
              className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 bg-slate-100 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 border-b border-slate-200 bg-slate-50/50 text-xs font-bold text-slate-600 overflow-x-auto">
          <button
            onClick={() => setActiveTab('info')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'info' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>基本信息与连接</span>
          </button>

          <button
            onClick={() => setActiveTab('monitor')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'monitor' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>实时性能监控</span>
          </button>

          {!isServer && (
            <button
              onClick={() => setActiveTab('files')}
              className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'files' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Folder className="w-3.5 h-3.5" />
              <span>可视化文件管理</span>
            </button>
          )}

          {isServer && (
            <button
              onClick={() => setActiveTab('disk')}
              className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'disk' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <HardDrive className="w-3.5 h-3.5" />
              <span>云盘与存储扩容</span>
            </button>
          )}

          {isServer && (
            <button
              onClick={() => setActiveTab('security')}
              className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'security' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span>安全组防火墙</span>
            </button>
          )}

          {!isServer && (
            <button
              onClick={() => setActiveTab('snapshot')}
              className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                activeTab === 'snapshot' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
              }`}
            >
              <Save className="w-3.5 h-3.5" />
              <span>保存自定义镜像</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('billing')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'billing' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>费用明细流水</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`py-3 px-3 border-b-2 transition flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'logs' ? 'border-indigo-600 text-indigo-600' : 'border-transparent hover:text-slate-900'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>操作运行日志</span>
          </button>
        </div>

        {/* Tab Content Container */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-50/50 text-xs text-slate-700 font-medium">
          
          {/* TAB 1: Basic Info & Connection */}
          {activeTab === 'info' && (
            <div className="space-y-6">
              
              {/* Quick Remote Entrance Box */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Terminal className="w-4 h-4 text-indigo-600" />
                  快捷远程连接入口
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {inst.jupyterUrl && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>🪐 JupyterLab 在线 IDE</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">内置 Web Terminal 与交互 Notebook 页面</div>
                      </div>
                      <a
                        href={inst.jupyterUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <span>一键打开 JupyterLab</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  {inst.vncUrl && (
                    <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>🖥 Web VNC 图形控制台</span>
                        </div>
                        <div className="text-[11px] text-slate-500 mt-1">无需任何客户端，浏览器直接操控桌面 GUI</div>
                      </div>
                      <a
                        href={inst.vncUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <span>一键打开 VNC 控制台</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>💻 SSH 命令行终端</span>
                        <button
                          onClick={() => copyText(inst.sshCommand || '', 'ssh')}
                          className="text-indigo-600 hover:underline text-[11px] font-bold flex items-center gap-1"
                        >
                          {copiedKey === 'ssh' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedKey === 'ssh' ? '已复制' : '复制命令'}</span>
                        </button>
                      </div>
                      <div className="text-[11px] font-mono text-slate-700 bg-white p-2 rounded border border-slate-200 mt-1 truncate">
                        {inst.sshCommand}
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3">
                    <div>
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <span>⚡ VS Code Remote SSH</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-1">支持本地 VS Code 一键直连远端 Docker 环境</div>
                    </div>
                    <button
                      onClick={() => showToast('已成功复制 VS Code Remote SSH 配置块！')}
                      className="w-full py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>复制 VS Code 配置</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Hardware Specs Breakdown Table */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                <div className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
                  硬件规格与配置明细
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-mono">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-sans font-medium">GPU 算力卡型号</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">{inst.gpuModel} × {inst.gpuCount}卡</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-sans font-medium">显存容量 (VRAM)</div>
                    <div className="text-indigo-600 font-bold text-sm mt-0.5">{inst.vram}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-sans font-medium">vCPU 核心 / RAM 内存</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">{inst.cpu} / {inst.ram}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-sans font-medium">计费单价</div>
                    <div className="text-amber-600 font-bold text-sm mt-0.5">¥{(inst.hourlyCost ?? 0).toFixed(2)} / 小时</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-sans font-medium">系统盘规格</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">{inst.systemDisk}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-sans font-medium">数据持久盘</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">{inst.dataDisk}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-sans font-medium">公网 IP / 带宽</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">{inst.publicIp}</div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="text-slate-400 text-[10px] font-sans font-medium">创建时间</div>
                    <div className="text-slate-900 font-bold text-sm mt-0.5">{inst.createdAt}</div>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: Performance Monitoring */}
          {activeTab === 'monitor' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-slate-900 text-sm">GPU / CPU / 显存 实时负载监控</span>
                <span className="text-slate-400 text-[11px] font-mono">数据每 5 秒自动刷新</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* GPU Utilization Bar Chart */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>GPU 算力核心利用率</span>
                    <span className="text-cyan-600 font-mono">92%</span>
                  </div>
                  <div className="h-32 flex items-end gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {(inst.monitoring?.gpuUsage || [30, 45, 60, 80, 92, 88, 94, 91]).map((v, i) => (
                      <div key={i} className="flex-1 bg-cyan-500 rounded-t transition-all" style={{ height: `${v}%` }} title={`${v}%`} />
                    ))}
                  </div>
                </div>

                {/* VRAM Usage */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>显存使用率 (VRAM)</span>
                    <span className="text-indigo-600 font-mono">95% (76GB / 80GB)</span>
                  </div>
                  <div className="h-32 flex items-end gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {(inst.monitoring?.vramUsage || [50, 65, 75, 85, 90, 93, 95, 95]).map((v, i) => (
                      <div key={i} className="flex-1 bg-indigo-500 rounded-t transition-all" style={{ height: `${v}%` }} title={`${v}%`} />
                    ))}
                  </div>
                </div>

                {/* CPU Usage */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>vCPU 核心利用率</span>
                    <span className="text-emerald-600 font-mono">68%</span>
                  </div>
                  <div className="h-32 flex items-end gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {(inst.monitoring?.cpuUsage || [20, 35, 45, 50, 62, 58, 65, 68]).map((v, i) => (
                      <div key={i} className="flex-1 bg-emerald-500 rounded-t transition-all" style={{ height: `${v}%` }} title={`${v}%`} />
                    ))}
                  </div>
                </div>

                {/* RAM Memory Usage */}
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
                  <div className="flex justify-between font-bold text-slate-800">
                    <span>内存 RAM 使用率</span>
                    <span className="text-amber-600 font-mono">58% (37GB / 64GB)</span>
                  </div>
                  <div className="h-32 flex items-end gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {(inst.monitoring?.ramUsage || [30, 40, 45, 52, 55, 56, 58, 58]).map((v, i) => (
                      <div key={i} className="flex-1 bg-amber-500 rounded-t transition-all" style={{ height: `${v}%` }} title={`${v}%`} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Visual File Manager (Containers) */}
          {activeTab === 'files' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
                  <Folder className="w-4 h-4 text-cyan-600" />
                  容器工作区文件在线浏览器 (/root/workspace)
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => showToast('已成功新建文件夹 /root/workspace/new_dir')} className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700">
                    + 新建目录
                  </button>
                  <button onClick={() => showToast('请选择本地文件进行并行上传')} className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center gap-1 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>上传文件</span>
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100 font-mono">
                {(inst.fileList || [
                  { name: 'train.py', size: '14 KB', isDir: false, modified: '刚刚' },
                  { name: 'datasets/', size: '2.4 GB', isDir: true, modified: '1小时前' }
                ]).map((f, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between hover:bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2 font-bold text-slate-800">
                      <span>{f.isDir ? '📁' : '📄'}</span>
                      <span>{f.name}</span>
                    </div>

                    <div className="flex items-center gap-6 text-[11px] text-slate-500">
                      <span>{f.size}</span>
                      <span>修改于 {f.modified}</span>
                      <button onClick={() => showToast(`已启动下载【${f.name}】`)} className="text-indigo-600 hover:underline font-bold">
                        下载
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Disks (Server Instances) */}
          {activeTab === 'disk' && (
            <div className="space-y-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="font-extrabold text-slate-900 text-sm">已挂载云盘管理</div>
                  <button onClick={() => showToast('打开挂载新数据盘配置界面')} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold">
                    + 挂载数据盘
                  </button>
                </div>

                <div className="space-y-3 font-mono">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">系统盘 (NVMe High-Speed)</div>
                      <div className="text-[11px] text-slate-500">容量: {inst.systemDisk} · 挂载点: /dev/vda1</div>
                    </div>
                    <button onClick={() => showToast('已提交系统盘扩容申请 (100GB)')} className="px-3 py-1 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs">
                      在线扩容
                    </button>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-900">数据盘 (High-Throughput NVMe)</div>
                      <div className="text-[11px] text-slate-500">容量: {inst.dataDisk} · 挂载点: /data</div>
                    </div>
                    <button onClick={() => showToast('已提交数据盘扩容申请 (1TB)')} className="px-3 py-1 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs">
                      在线扩容
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Security Firewall */}
          {activeTab === 'security' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="font-extrabold text-slate-900 text-sm">安全组入站/出站防火墙策略规则</div>
                <button onClick={() => showToast('已添加新的安全组端口放行规则')} className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white font-bold">
                  + 添加放行规则
                </button>
              </div>

              <div className="space-y-2 font-mono">
                {(inst.securityRules || [
                  { port: '22', protocol: 'TCP', cidr: '0.0.0.0/0', desc: 'SSH 远端控制' },
                  { port: '8000', protocol: 'TCP', cidr: '0.0.0.0/0', desc: 'API 端口' }
                ]).map((r, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-indigo-600">端口 {r.port} ({r.protocol})</span>
                      <span className="text-slate-500 text-[11px] ml-3">来源: {r.cidr}</span>
                    </div>
                    <span className="text-slate-600 text-xs font-sans font-medium">{r.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: Snapshot */}
          {activeTab === 'snapshot' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3">
                将当前容器环境镜像保存为私有快照
              </div>

              <form onSubmit={handleSaveSnapshot} className="space-y-4 max-w-xl">
                <div>
                  <label className="font-bold text-slate-800 block mb-1">快照镜像名称 *</label>
                  <input
                    type="text"
                    required
                    value={snapshotName}
                    onChange={(e) => setSnapshotName(e.target.value)}
                    placeholder="例如：my-custom-deepspeed-v1"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-800 block mb-1">描述说明</label>
                  <textarea
                    rows={2}
                    value={snapshotDesc}
                    onChange={(e) => setSnapshotDesc(e.target.value)}
                    placeholder="备注预装的 Python 依赖包与配置更改..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:bg-white"
                  />
                </div>

                <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl cursor-pointer">
                  立即打打快照保存
                </button>
              </form>
            </div>
          )}

          {/* TAB 7: Billing Details */}
          {activeTab === 'billing' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-4 font-mono">
              <div className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 font-sans">
                实时费用明细流水账单
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 font-sans">
                <div className="flex justify-between">
                  <span>计费模式:</span>
                  <span className="font-bold text-slate-900">{inst.billingType}</span>
                </div>
                <div className="flex justify-between">
                  <span>算力规格单价:</span>
                  <span className="font-bold text-amber-600">¥{(inst.hourlyCost ?? 0).toFixed(2)} / 小时</span>
                </div>
                <div className="flex justify-between">
                  <span>累计运行时间:</span>
                  <span className="font-bold text-slate-900">{(inst.runningHours ?? 0).toFixed(1)} 小时</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold">
                  <span>本实例已产生费用:</span>
                  <span className="text-amber-600">¥{(inst.totalCost ?? 0).toFixed(2)} 元</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: Logs */}
          {activeTab === 'logs' && (
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3 font-mono">
              <div className="font-extrabold text-slate-900 text-sm border-b border-slate-100 pb-3 font-sans">
                实例调度与系统操作运行日志
              </div>

              <div className="space-y-2">
                {(inst.logs || [
                  { id: '1', action: '实例调度分配资源', time: '刚刚', status: '成功' }
                ]).map((l, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between text-xs">
                    <div>
                      <span className="text-emerald-600 font-bold">[{l.status}]</span>
                      <span className="ml-2 text-slate-800">{l.action}</span>
                    </div>
                    <span className="text-slate-400">{l.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
