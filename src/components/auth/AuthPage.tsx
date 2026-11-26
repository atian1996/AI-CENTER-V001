import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { AuthParticleScene } from './AuthParticleScene';

export const AuthPage: React.FC = () => {
  const {
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    showToast
  } = useApp();

  const isRegister = authModalMode === 'register';

  // 登录方式：'password' (账号登录) | 'sms' (验证码登录)
  const [loginMethod, setLoginMethod] = useState<'password' | 'sms'>('password');

  // 登录表单状态
  const [loginAccount, setLoginAccount] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginPhone, setLoginPhone] = useState('');
  const [loginCode, setLoginCode] = useState('');

  // 注册表单状态
  const [regUsername, setRegUsername] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regCode, setRegCode] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(true);

  // 验证码倒计时
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearInterval(timerRef.current);
      }
    };
  }, []);

  const handleSendCode = (targetPhone: string) => {
    if (countdown > 0) return;
    if (!targetPhone || targetPhone.trim().length < 11) {
      showToast('请输入有效的 11 位手机号码');
      return;
    }

    if (isRegister) {
      setRegCode('8866');
    } else {
      setLoginCode('8866');
    }
    showToast('验证码已发送：8866（5 分钟内有效）');

    setCountdown(60);
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
    }
    timerRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (timerRef.current !== null) {
            window.clearInterval(timerRef.current);
            timerRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCloseAuthPage = () => {
    setIsAuthModalOpen(false);
    // If accessed via ?auth=... clean URL param without reloading
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      if (url.searchParams.has('auth')) {
        url.searchParams.delete('auth');
        window.history.replaceState({}, '', url.pathname + url.search);
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isRegister) {
      if (!agreed) {
        showToast('请先阅读并勾选同意《用户服务协议》与《隐私保护政策》');
        return;
      }
      if (!regUsername.trim() || regUsername.trim().length < 3) {
        showToast('请输入至少 3 位开发者用户名');
        return;
      }
      if (!regPhone || regPhone.trim().length < 11) {
        showToast('请输入有效的 11 位手机号码');
        return;
      }
      if (!regCode.trim()) {
        showToast('请输入短信验证码');
        return;
      }
      if (!regPassword || regPassword.length < 6) {
        showToast('请设置至少 6 位登录密码');
        return;
      }
      if (regPassword !== regConfirmPassword) {
        showToast('两次输入的密码不一致，请重新核对');
        return;
      }

      login();
      handleCloseAuthPage();
      showToast(`欢迎加入 XCTF·AI，${regUsername.trim()}！注册成功。`);
      return;
    }

    // 登录校验
    if (loginMethod === 'password') {
      if (!loginAccount.trim()) {
        showToast('请输入账号或手机号码');
        return;
      }
      if (!loginPassword) {
        showToast('请输入登录密码');
        return;
      }
    } else {
      if (!loginPhone || loginPhone.trim().length < 11) {
        showToast('请输入有效的 11 位手机号码');
        return;
      }
      if (!loginCode.trim()) {
        showToast('请输入短信验证码');
        return;
      }
    }

    login();
    handleCloseAuthPage();
    showToast('欢迎回来，已成功登录 XCTF·AI 平台');
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden flex bg-[#FFFFFF] text-[#1A1A1A] antialiased select-none"
      style={{
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "PingFang SC", "Helvetica Neue", sans-serif'
      }}
    >
      {/* =====================================================================
          左侧视觉区 (55%)：纯白 #FFFFFF + 极简黑白灰 3D 细点阵星云 + 白色径向遮罩 + 居中大 Logo 与 Slogan
         ===================================================================== */}
      <section className="hidden lg:flex lg:w-[55%] h-full relative bg-[#FFFFFF] border-r border-[#EAEAEA] flex-col items-center justify-center overflow-hidden">
        {/* 极细黑白灰 3D GPU 粒子星云（仅 #333/#666/#999，中心留出圆形真空区） */}
        <AuthParticleScene />

        {/* Logo 与 Slogan 下方的纯白径向渐变遮罩（Radial Gradient Mask），将背后粒子柔和淡出 */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[5] bg-[radial-gradient(ellipse_48%_32%_at_50%_50%,rgba(255,255,255,0.98)_0%,rgba(255,255,255,0.88)_48%,rgba(255,255,255,0)_100%)]"
        />

        {/* 左上角极简返回入口 */}
        <button
          type="button"
          onClick={handleCloseAuthPage}
          className="absolute top-8 left-8 z-20 inline-flex items-center gap-1.5 text-[13px] text-[#666666] hover:text-[#000000] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.6} />
          <span>返回首页</span>
        </button>

        {/* 正中品牌视觉焦点：放大居中 XCTF AI 大 Logo + 正下方 16px 宽字距灰色 Slogan */}
        <div className="relative z-10 flex flex-col items-center text-center px-10 pointer-events-none">
          <img
            src="/assets/aistudio/XCTFAILOGO_7d972a6f.png"
            alt="XCTF AI"
            draggable={false}
            className="w-[360px] xl:w-[460px] max-w-[85%] h-auto object-contain select-none"
          />
          <p className="mt-7 text-[16px] text-[#666666] font-normal tracking-[0.22em]">
            让 AI 能力可见，让技术价值兑现
          </p>
        </div>
      </section>

      {/* =====================================================================
          右侧表单区 (45%)：纯白 #FFFFFF，垂直居中，最大宽度 400px
         ===================================================================== */}
      <section className="w-full lg:w-[45%] h-full bg-[#FFFFFF] relative flex flex-col justify-center items-center px-8 sm:px-12 overflow-hidden">
        {/* 移动端顶部返回按钮（桌面端左侧已有返回，右侧保持绝对纯净） */}
        <button
          type="button"
          onClick={handleCloseAuthPage}
          className="lg:hidden absolute top-6 left-6 inline-flex items-center gap-1.5 text-[13px] text-[#666666] hover:text-[#000000] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.6} />
          <span>返回</span>
        </button>

        <div className="w-full max-w-[400px] mx-auto">
          {!isRegister ? (
            /* ================= 登录视图 ================= */
            <>
              <div>
                <h1 className="text-[28px] font-bold text-[#000000] tracking-[-0.02em] leading-tight">
                  欢迎回来
                </h1>
                <p className="mt-2 text-[14px] text-[#666666]">
                  登录以继续您的 AI 交付之旅
                </p>
              </div>

              {/* 顶部 Tab 切换：账号登录 / 验证码登录 */}
              <div className="mt-9 flex items-center gap-8 border-b border-[#EAEAEA]">
                <button
                  type="button"
                  onClick={() => setLoginMethod('password')}
                  className={`pb-3 text-[14px] transition-colors cursor-pointer -mb-[1px] border-b-2 ${
                    loginMethod === 'password'
                      ? 'text-[#000000] font-semibold border-[#000000]'
                      : 'text-[#999999] hover:text-[#666666] font-normal border-transparent'
                  }`}
                >
                  账号登录
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('sms')}
                  className={`pb-3 text-[14px] transition-colors cursor-pointer -mb-[1px] border-b-2 ${
                    loginMethod === 'sms'
                      ? 'text-[#000000] font-semibold border-[#000000]'
                      : 'text-[#999999] hover:text-[#666666] font-normal border-transparent'
                  }`}
                >
                  验证码登录
                </button>
              </div>

              {/* 极简下划线输入框表单 */}
              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {loginMethod === 'password' ? (
                  <>
                    <div>
                      <input
                        type="text"
                        value={loginAccount}
                        onChange={(e) => setLoginAccount(e.target.value)}
                        placeholder="用户名 / 手机号码"
                        autoComplete="username"
                        className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none px-0 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <div className="relative">
                        <input
                          type={showLoginPassword ? 'text' : 'password'}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="请输入密码"
                          autoComplete="current-password"
                          className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none pl-0 pr-8 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword((prev) => !prev)}
                          aria-label={showLoginPassword ? '隐藏密码' : '显示密码'}
                          className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#999999] hover:text-[#000000] transition-colors cursor-pointer"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="w-4 h-4" strokeWidth={1.6} />
                          ) : (
                            <Eye className="w-4 h-4" strokeWidth={1.6} />
                          )}
                        </button>
                      </div>

                      {/* 密码输入框右下方极小字号文字链 */}
                      <div className="mt-2.5 flex justify-end">
                        <button
                          type="button"
                          onClick={() => showToast('请切换至「验证码登录」或联系管理员重置密码')}
                          className="text-[12px] text-[#999999] hover:text-[#000000] transition-colors cursor-pointer"
                        >
                          忘记密码？
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <input
                        type="tel"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="请输入 11 位手机号码"
                        autoComplete="tel"
                        className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none px-0 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors tabular-nums"
                      />
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={loginCode}
                        onChange={(e) => setLoginCode(e.target.value)}
                        placeholder="请输入短信验证码"
                        className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none pl-0 pr-24 py-3 text-[15px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors tabular-nums"
                      />
                      <button
                        type="button"
                        onClick={() => handleSendCode(loginPhone)}
                        disabled={countdown > 0}
                        className={`absolute right-0 top-1/2 -translate-y-1/2 text-[13px] transition-colors ${
                          countdown > 0
                            ? 'text-[#999999] cursor-not-allowed tabular-nums'
                            : 'text-[#000000] font-medium hover:opacity-65 cursor-pointer'
                        }`}
                      >
                        {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                      </button>
                    </div>
                  </>
                )}

                {/* 主按钮：全宽 100%，高度 48px，纯黑底白字，圆角 4px */}
                <div className="pt-3">
                  <button
                    type="submit"
                    className="w-full h-[48px] bg-[#000000] hover:bg-[#333333] text-[#FFFFFF] text-[14px] font-medium rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    登 录 →
                  </button>
                </div>
              </form>

              {/* 最底部居中文字 */}
              <div className="mt-8 text-center text-[13px] text-[#666666]">
                <span>还没有账号？ </span>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('register')}
                  className="text-[#000000] font-semibold underline underline-offset-4 hover:opacity-75 transition-opacity cursor-pointer"
                >
                  立即注册
                </button>
              </div>
            </>
          ) : (
            /* ================= 注册视图 ================= */
            <>
              <div>
                <h1 className="text-[28px] font-bold text-[#000000] tracking-[-0.02em] leading-tight">
                  创建账号
                </h1>
                <p className="mt-2 text-[14px] text-[#666666]">
                  加入 XCTF·AI，开启您的 AI 实战与交付之旅
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">
                <div>
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="开发者用户名（至少 3 位）"
                    autoComplete="username"
                    className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none px-0 py-2.5 text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="11 位手机号码"
                    autoComplete="tel"
                    className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none px-0 py-2.5 text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors tabular-nums"
                  />
                </div>

                <div className="relative">
                  <input
                    type="text"
                    value={regCode}
                    onChange={(e) => setRegCode(e.target.value)}
                    placeholder="短信验证码"
                    className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none pl-0 pr-24 py-2.5 text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors tabular-nums"
                  />
                  <button
                    type="button"
                    onClick={() => handleSendCode(regPhone)}
                    disabled={countdown > 0}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 text-[13px] transition-colors ${
                      countdown > 0
                        ? 'text-[#999999] cursor-not-allowed tabular-nums'
                        : 'text-[#000000] font-medium hover:opacity-65 cursor-pointer'
                    }`}
                  >
                    {countdown > 0 ? `${countdown}s 后重发` : '获取验证码'}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="设置登录密码（至少 6 位）"
                    autoComplete="new-password"
                    className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none pl-0 pr-8 py-2.5 text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword((prev) => !prev)}
                    aria-label={showRegPassword ? '隐藏密码' : '显示密码'}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#999999] hover:text-[#000000] transition-colors cursor-pointer"
                  >
                    {showRegPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={1.6} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.6} />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="再次确认登录密码"
                    autoComplete="new-password"
                    className="w-full bg-transparent border-0 border-b border-[#EAEAEA] focus:border-[#000000] rounded-none pl-0 pr-8 py-2.5 text-[14px] text-[#1A1A1A] placeholder:text-[#999999] outline-none transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword((prev) => !prev)}
                    aria-label={showRegConfirmPassword ? '隐藏确认密码' : '显示确认密码'}
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#999999] hover:text-[#000000] transition-colors cursor-pointer"
                  >
                    {showRegConfirmPassword ? (
                      <EyeOff className="w-4 h-4" strokeWidth={1.6} />
                    ) : (
                      <Eye className="w-4 h-4" strokeWidth={1.6} />
                    )}
                  </button>
                </div>

                {/* 极简协议勾选 */}
                <div className="pt-1">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={agreed}
                    onClick={() => setAgreed((prev) => !prev)}
                    className="inline-flex items-center gap-2 text-[12px] text-[#666666] cursor-pointer"
                  >
                    <span
                      className={`w-3.5 h-3.5 rounded-[2px] border flex items-center justify-center transition-colors ${
                        agreed ? 'border-[#000000] bg-[#FFFFFF]' : 'border-[#CCCCCC] bg-[#FFFFFF]'
                      }`}
                    >
                      {agreed && <Check className="w-2.5 h-2.5 text-[#000000]" strokeWidth={2.5} />}
                    </span>
                    <span>
                      已阅读并同意 <span className="text-[#1A1A1A] underline underline-offset-2">用户服务协议</span> 与{' '}
                      <span className="text-[#1A1A1A] underline underline-offset-2">隐私政策</span>
                    </span>
                  </button>
                </div>

                {/* 主按钮 */}
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full h-[48px] bg-[#000000] hover:bg-[#333333] text-[#FFFFFF] text-[14px] font-medium rounded-[4px] flex items-center justify-center transition-colors cursor-pointer"
                  >
                    立即注册 →
                  </button>
                </div>
              </form>

              <div className="mt-6 text-center text-[13px] text-[#666666]">
                <span>已有账号？ </span>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('login')}
                  className="text-[#000000] font-semibold underline underline-offset-4 hover:opacity-75 transition-opacity cursor-pointer"
                >
                  立即登录
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
