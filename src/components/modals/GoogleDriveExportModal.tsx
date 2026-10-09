import React, { useState, useEffect } from 'react';
import { 
  X, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Cloud, 
  Download, 
  Eye, 
  BookOpen, 
  ShieldCheck, 
  LogOut, 
  Sparkles,
  Loader2
} from 'lucide-react';
import { User } from 'firebase/auth';
import { 
  initAuth, 
  googleSignIn, 
  logoutGoogle, 
  uploadDesignDocToGoogleDrive, 
  GoogleDriveFileResult 
} from '../../services/googleDriveService';
import { SYSTEM_DESIGN_TITLE, SYSTEM_DESIGN_DOCUMENT_MARKDOWN } from '../../docs/systemDesignDoc';
import { useApp } from '../../context/AppContext';

interface GoogleDriveExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GoogleDriveExportModal: React.FC<GoogleDriveExportModalProps> = ({ isOpen, onClose }) => {
  const { showToast } = useApp();

  const [googleUser, setGoogleUser] = useState<User | null>(null);
  const [hasToken, setHasToken] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccessResult, setExportSuccessResult] = useState<GoogleDriveFileResult | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'outline'>('preview');

  // Initialize Auth state listener
  useEffect(() => {
    if (!isOpen) return;

    const unsubscribe = initAuth(
      (user, token) => {
        setGoogleUser(user);
        setHasToken(!!token);
      },
      () => {
        setGoogleUser(null);
        setHasToken(false);
      }
    );

    return () => unsubscribe();
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Google Interactive Sign-in
  const handleSignIn = async () => {
    setIsSigningIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        setGoogleUser(result.user);
        setHasToken(true);
        showToast('Google 账号已成功连接');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      showToast(err.message || '连接 Google 账号失败，请重试');
    } finally {
      setIsSigningIn(false);
    }
  };

  // Handle Google Sign-out
  const handleLogout = async () => {
    try {
      await logoutGoogle();
      setGoogleUser(null);
      setHasToken(false);
      setExportSuccessResult(null);
      showToast('已断开 Google 账号连接');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Trigger Confirmation Dialog before mutating Workspace
  const handleInitiateExport = () => {
    if (!hasToken) {
      handleSignIn();
      return;
    }
    setShowConfirmDialog(true);
  };

  // Perform the actual upload to Google Drive
  const handleConfirmExport = async () => {
    setShowConfirmDialog(false);
    setIsExporting(true);

    try {
      const result = await uploadDesignDocToGoogleDrive(
        SYSTEM_DESIGN_TITLE,
        SYSTEM_DESIGN_DOCUMENT_MARKDOWN
      );

      setExportSuccessResult(result);
      showToast('设计文档已成功同步至您的 Google Drive！');
    } catch (err: any) {
      console.error('Export error:', err);
      showToast(err.message || '导出至 Google Drive 失败，请重试');
    } finally {
      setIsExporting(false);
    }
  };

  // Download local copy
  const handleDownloadLocalMarkdown = () => {
    const blob = new Blob([SYSTEM_DESIGN_DOCUMENT_MARKDOWN], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = '千极AI_系统全功能架构与文字设计规范_V1.0.md';
    link.click();
    URL.revokeObjectURL(url);
    showToast('已开始下载 Markdown 设计文档副本');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh] animate-scale-up">
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 flex items-center justify-center text-indigo-300 border border-white/10 shadow-xs">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base tracking-wide">系统全功能设计规范</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30">
                  Google Drive 协同
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                下次改动平台功能之前，先在文字设计中完成定义与对齐
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="关闭"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          
          {/* Top Google Account Status Bar */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center shadow-2xs shrink-0">
                {/* Google SVG Icon */}
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-slate-800">Google Drive 存储连接</span>
                  {hasToken && googleUser ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3" /> 已连接
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                      <AlertCircle className="w-3 h-3" /> 待连接
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                  {hasToken && googleUser ? (
                    <span>已连接账号：<strong className="text-slate-700">{googleUser.email}</strong></span>
                  ) : (
                    <span>登录您的 Google 账号以直接在 Drive 中创建和编辑文档</span>
                  )}
                </div>
              </div>
            </div>

            <div className="shrink-0 flex items-center gap-2">
              {hasToken && googleUser ? (
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                  title="断开当前连接"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>切换账号</span>
                </button>
              ) : (
                <button
                  onClick={handleSignIn}
                  disabled={isSigningIn}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 text-xs font-bold transition shadow-2xs hover:shadow-xs flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSigningIn ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-600" />
                      <span>正在连接...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" viewBox="0 0 48 48">
                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                        <path fill="none" d="M0 0h48v48H0z" />
                      </svg>
                      <span>Sign in with Google</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Success Banner if exported */}
          {exportSuccessResult && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-black text-emerald-950">
                    设计文档已成功创建并同步到您的 Google Drive！
                  </div>
                  <p className="text-[11px] text-emerald-700 font-medium">
                    文档名称：{exportSuccessResult.name}
                  </p>
                </div>
              </div>

              <a
                href={exportSuccessResult.webViewLink}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition flex items-center gap-1.5 shadow-sm shrink-0 cursor-pointer"
              >
                <span>在 Google Drive 中打开</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Document Info Card */}
          <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-200/80 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span className="text-xs font-black text-indigo-950">文档概览与定位</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-indigo-600 bg-white px-2 py-0.5 rounded-md border border-indigo-200">
                V1.0.0 Baseline
              </span>
            </div>
            <p className="text-[11px] text-indigo-900/90 leading-relaxed font-medium">
              本设计文档汇总了当前千极AI平台所有的<strong>核心业务模块架构、底层交互铁律（如评论区全站严控纯文本、发布任务资金+积分双重预付托管、三Tab通知防打扰）与交互规范</strong>。后续在推进任何功能迭代、页面增改或规则演进前，我们先在 Google Drive 文档中完成文字设计与规则审阅，再执行代码编写。
            </p>
          </div>

          {/* Document Content / Outline Viewer */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'preview'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>文档全文预览</span>
                </button>
                <button
                  onClick={() => setActiveTab('outline')}
                  className={`px-3 py-1 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                    activeTab === 'outline'
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>核心目录结构</span>
                </button>
              </div>

              <button
                onClick={handleDownloadLocalMarkdown}
                className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition cursor-pointer"
                title="下载一份纯 Markdown 文件至本地"
              >
                <Download className="w-3.5 h-3.5" />
                <span>下载 Markdown 副本</span>
              </button>
            </div>

            {/* Tab: Outline */}
            {activeTab === 'outline' && (
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2.5 font-medium text-slate-700">
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>一、产品定位与系统全局愿景（全场景一站式开发者生态）</span>
                </div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>二、全局设计规范与底层核心纪律</span>
                </div>
                <div className="pl-6 space-y-1 text-slate-600 text-[11px]">
                  <div>• 2.1 评论区纯文本严控纪律（严禁表情/图片）</div>
                  <div>• 2.2 发布任务“资金+积分”双重托管冻结纪律（发布即冻结，验收即结算，驳回即退还）</div>
                  <div>• 2.3 积分经济学与价值锚定（1积分=¥0.01元恒定价值）</div>
                  <div>• 2.4 纯净消息通知体系（全部/业务/社区互动，剔除@与关注者冗余通知）</div>
                </div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>三、系统整体信息架构与用户角色体系（8大视图导航与权限矩阵）</span>
                </div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>四、核心业务模块功能与交互设计规范</span>
                </div>
                <div className="pl-6 space-y-1 text-slate-600 text-[11px]">
                  <div>• 4.1 AI 运营中心（首页 Overview）</div>
                  <div>• 4.2 AI 集市（Agent/Skill/Dataset 资产交易与 85% 分成）</div>
                  <div>• 4.3 任务大厅（需求发布、承接打款、争议保障）</div>
                  <div>• 4.4 算力工坊（GPU 算力集群租赁、JupyterLab/WebShell/SSH 控制台）</div>
                  <div>• 4.5 赛事中心（竞赛测试集自动化沙盒评测）</div>
                  <div>• 4.6 极客社区（技术干货与经验问答）</div>
                  <div>• 4.7 个人工作台与账户体系（资产中心、资金与积分托管看板、流水明细）</div>
                  <div>• 4.8 管理后台与风控审核（内容合规准入与争议仲裁）</div>
                </div>
                <div className="font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-600" />
                  <span>五、文字设计优先（Text-First）协作与迭代流程指南（6项检查清单）</span>
                </div>
              </div>
            )}

            {/* Tab: Full Preview */}
            {activeTab === 'preview' && (
              <div className="bg-slate-900 text-slate-200 rounded-2xl p-5 border border-slate-800 text-xs font-mono h-64 overflow-y-auto leading-relaxed whitespace-pre-wrap select-text">
                {SYSTEM_DESIGN_DOCUMENT_MARKDOWN}
              </div>
            )}
          </div>

        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50/80 shrink-0">
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span>基于 Google Workspace 官方安全授权，仅保存设计文档至您的专属网盘</span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold transition cursor-pointer"
            >
              关闭
            </button>

            <button
              onClick={handleInitiateExport}
              disabled={isExporting}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-black shadow-md hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>正在同步至 Google Drive...</span>
                </>
              ) : (
                <>
                  <Cloud className="w-4 h-4" />
                  <span>{hasToken ? '保存至我的 Google Drive' : '连接并保存至 Google Drive'}</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* Confirmation Dialog (Mandatory for mutating/creating Workspace resources) */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scale-up">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Cloud className="w-6 h-6" />
            </div>

            <div>
              <h4 className="text-base font-black text-slate-900">确认保存设计文档到 Google Drive？</h4>
              <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                系统将在您的 Google Drive 网盘根目录下创建一份格式化的 <strong>《{SYSTEM_DESIGN_TITLE}》</strong>（Google Docs 文件格式），后续可随时在 Google Docs 中协同批注与修改文字设计。
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                取消
              </button>
              <button
                onClick={handleConfirmExport}
                className="px-5 py-2 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white transition shadow-sm cursor-pointer"
              >
                确认创建并保存
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
