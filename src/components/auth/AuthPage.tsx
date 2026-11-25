import React, { useEffect, useRef, useState } from 'react';
import { ArrowLeft, Check, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

/**
 * 极轻量 2D Canvas 3D 投影莫比乌斯环动态粒子点阵
 * 纯黑白灰配色，无发光、无阴影，缓慢旋转与呼吸
 */
const MobiusParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const uSteps = 84;
    const vSteps = 9;
    const totalPoints = uSteps * vSteps;

    // Precompute parametric coordinates (u, v) once
    const uArr = new Float32Array(totalPoints);
    const vArr = new Float32Array(totalPoints);
    let idx = 0;
    for (let i = 0; i < uSteps; i++) {
      const u = (i / uSteps) * Math.PI * 2;
      for (let j = 0; j < vSteps; j++) {
        const v = (j / (vSteps - 1)) * 2 - 1; // [-1, 1]
        uArr[idx] = u;
        vArr[idx] = v;
        idx++;
      }
    }

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      width = parent.clientWidth || window.innerWidth * 0.55;
      height = parent.clientHeight || window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    let rafId = 0;
    let startTime = performance.now();

    const render = (now: number) => {
      const t = (now - startTime) * 0.001;

      ctx.clearRect(0, 0, width, height);

      // Slow organic rotation + gentle breathing
      const rotY = t * 0.16;
      const rotX = 0.52 + Math.sin(t * 0.28) * 0.14;
      const rotZ = Math.cos(t * 0.19) * 0.1;

      const cosY = Math.cos(rotY);
      const sinY = Math.sin(rotY);
      const cosX = Math.cos(rotX);
      const sinX = Math.sin(rotX);
      const cosZ = Math.cos(rotZ);
      const sinZ = Math.sin(rotZ);

      const breathe = 1 + Math.sin(t * 0.85) * 0.045;
      const R = 1.62 * breathe;
      const halfWidth = 0.56 * (1 + Math.cos(t * 0.7) * 0.05);

      const scale = Math.min(width, height) * 0.34;
      const cx = width * 0.5;
      const cy = height * 0.5;
      const cameraDist = 5.4;

      for (let i = 0; i < totalPoints; i++) {
        const u = uArr[i];
        const v = vArr[i];
        const halfU = u * 0.5;

        // Subtle fluid wave ripple along the Möbius ribbon
        const ripple = Math.sin(u * 3 - t * 1.1 + v * 2) * 0.04;
        const r = R + (v * halfWidth + ripple) * Math.cos(halfU);
        const x0 = r * Math.cos(u);
        const y0 = r * Math.sin(u);
        const z0 = (v * halfWidth + ripple) * Math.sin(halfU);

        // Rotate around X
        const y1 = y0 * cosX - z0 * sinX;
        const z1 = y0 * sinX + z0 * cosX;

        // Rotate around Y
        const x2 = x0 * cosY + z1 * sinY;
        const z2 = -x0 * sinY + z1 * cosY;

        // Rotate around Z
        const x3 = x2 * cosZ - y1 * sinZ;
        const y3 = x2 * sinZ + y1 * cosZ;

        const perspective = cameraDist / (cameraDist - z2);
        const sx = cx + x3 * scale * perspective;
        const sy = cy + y3 * scale * perspective;

        // Normalize depth in [0, 1] for calm monochrome hierarchy
        const depth = Math.max(0, Math.min(1, (z2 + 2.4) / 4.8));
        const radius = 0.85 + depth * 1.45;
        const alpha = 0.06 + depth * 0.24;

        // Pure neutral monochrome ink (#1A1A1A for closer dots, #666666 for mid/far)
        const shade = Math.round(165 - depth * 135);
        ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
};

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
          左侧视觉区 (55%)：极浅暖灰 #F9F9F8 + 莫比乌斯环粒子点阵 + 巨型 Logo 与 Slogan
         ===================================================================== */}
      <section className="hidden lg:flex lg:w-[55%] h-full relative bg-[#F9F9F8] border-r border-[#EAEAEA] flex-col items-center justify-center overflow-hidden">
        {/* 轻量 3D 莫比乌斯环动态粒子点阵 */}
        <MobiusParticleCanvas />

        {/* 左上角极简返回入口 */}
        <button
          type="button"
          onClick={handleCloseAuthPage}
          className="absolute top-8 left-8 z-20 inline-flex items-center gap-1.5 text-[13px] text-[#666666] hover:text-[#000000] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.6} />
          <span>返回首页</span>
        </button>

        {/* 正中品牌视觉焦点 */}
        <div className="relative z-10 text-center px-10 pointer-events-none">
          <div className="text-[56px] xl:text-[68px] font-bold text-[#000000] tracking-[-0.03em] leading-none">
            XCTF·AI
          </div>
          <p className="mt-5 text-[15px] text-[#555555] font-normal tracking-[2px]">
            让 AI 能力可见，让技术价值兑现。
          </p>
        </div>

        {/* 左下角极简版权与版本标识 */}
        <div className="absolute bottom-8 left-8 z-10 text-[12px] text-[#999999] tracking-[1px]">
          © 2026 XCTF·AI · ENTERPRISE AI DELIVERY PLATFORM
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
