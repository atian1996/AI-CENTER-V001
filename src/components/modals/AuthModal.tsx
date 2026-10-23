import React, { useState } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  User,
  Lock,
  ShieldCheck,
  Smartphone,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle2,
  Gift
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    login,
    showToast
  } = useApp();

  // 登录方式：'password' (用户名密码登录) | 'sms' (手机验证码登录)
  const [loginMethod, setLoginMethod] = useState<'password' | 'sms'>('password');

  // 注册表单状态
  // 1. 用户名
  const [regUsername, setRegUsername] = useState('qianji_dev');
  // 2. 密码
  const [regPassword, setRegPassword] = useState('123456');
  // 3. 二次确认密码
  const [regConfirmPassword, setRegConfirmPassword] = useState('123456');
  // 4. 手机号
  const [regPhone, setRegPhone] = useState('13888886688');
  // 5. 验证码
  const [regCode, setRegCode] = useState('8866');
  // 邀请码
  const [inviteCode, setInviteCode] = useState('QIANJI-VIP-8829');

  // 密码可见性切换
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);

  // 登录表单状态
  // 方式一：用户名密码登录
  const [loginAccount, setLoginAccount] = useState('qianji_dev');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // 方式二：手机验证码登录
  const [loginPhone, setLoginPhone] = useState('13888886688');
  const [loginCode, setLoginCode] = useState('8866');

  // 验证码倒计时状态
  const [isCountingDown, setIsCountingDown] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // 协议勾选
  const [agreed, setAgreed] = useState(true);

  if (!isAuthModalOpen) return null;

  const isRegister = authModalMode === 'register';

  // 发送短信验证码逻辑
  const handleSendCode = (targetPhone: string) => {
    if (isCountingDown) return;
    if (!targetPhone || targetPhone.length < 11) {
      showToast('请输入有效的 11 位手机号码');
      return;
    }
    setIsCountingDown(true);
    if (isRegister) {
      setRegCode('8866');
    } else {
      setLoginCode('8866');
    }
    showToast('【千机AI】短信验证码已发送至手机：8866 (5分钟内有效)');

    let left = 60;
    const timer = setInterval(() => {
      left -= 1;
      setCountdown(left);
      if (left <= 0) {
        clearInterval(timer);
        setIsCountingDown(false);
        setCountdown(60);
      }
    }, 1000);
  };

  // 提交表单处理
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!agreed) {
      showToast('请先阅读并勾选同意《用户服务协议》与《隐私保护政策》');
      return;
    }

    if (isRegister) {
      // 注册表单校验：按照 用户名 -> 密码 -> 确认密码 -> 手机号 -> 验证码 顺序检查
      if (!regUsername.trim()) {
        showToast('请输入用户名');
        return;
      }
      if (regUsername.trim().length < 3) {
        showToast('用户名长度需至少 3 位');
        return;
      }
      if (!regPassword) {
        showToast('请设置登录密码');
        return;
      }
      if (regPassword.length < 6) {
        showToast('密码长度需至少 6 位');
        return;
      }
      if (!regConfirmPassword) {
        showToast('请再次输入密码进行确认');
        return;
      }
      if (regPassword !== regConfirmPassword) {
        showToast('两次输入的密码不一致，请重新核对');
        return;
      }
      if (!regPhone || regPhone.trim().length < 11) {
        showToast('请输入有效的 11 位手机号码');
        return;
      }
      if (!regCode.trim()) {
        showToast('请输入手机短信验证码');
        return;
      }

      // 执行注册登录逻辑
      login();
      setIsAuthModalOpen(false);
      showToast(`🎉 欢迎开发者【${regUsername.trim()}】！注册成功，¥20 算力体验金与 100 积分已发放至您的账户！`);
    } else {
      // 登录模式校验
      if (loginMethod === 'password') {
        // 用户名密码登录
        if (!loginAccount.trim()) {
          showToast('请输入用户名或手机号');
          return;
        }
        if (!loginPassword) {
          showToast('请输入登录密码');
          return;
        }
      } else {
        // 手机验证码登录
        if (!loginPhone || loginPhone.trim().length < 11) {
          showToast('请输入有效的 11 位手机号码');
          return;
        }
        if (!loginCode.trim()) {
          showToast('请输入短信验证码');
          return;
        }
      }

      // 执行登录逻辑
      login();
      setIsAuthModalOpen(false);
      showToast('🎉 欢迎回来！您已成功登录「赛宁·千机」AI 算力运营平台');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 select-none overflow-y-auto">
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200 my-auto">
        
        {/* 顶部标题栏（统一品牌紫调高质感背景） */}
        <div className="bg-gradient-to-br from-[#5735D8] via-[#6D4AFF] to-[#8060FF] px-6 py-5 text-white relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 w-7 h-7 rounded-full bg-black/20 hover:bg-black/30 text-white flex items-center justify-center transition cursor-pointer"
            title="关闭"
          >
            <X className="w-4 h-4" />
          </button>

          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <span>{isRegister ? '开发者新用户注册' : '欢迎登录千机 AI'}</span>
          </h2>
        </div>

        {/* 顶层主选项卡：注册 vs 登录 */}
        <div className="flex border-b border-slate-100 bg-slate-50/70 p-1.5">
          <button
            type="button"
            onClick={() => setAuthModalMode('register')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              isRegister
                ? 'bg-white text-[#6D4AFF] shadow-xs border border-purple-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isRegister ? 'text-[#6D4AFF]' : 'text-slate-400'}`} />
            <span>立即注册</span>
          </button>
          <button
            type="button"
            onClick={() => setAuthModalMode('login')}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
              !isRegister
                ? 'bg-white text-[#6D4AFF] shadow-xs border border-purple-100'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>账号登录</span>
          </button>
        </div>

        {/* 登录模式专属：登录方式双选切换（用户名密码登录 vs 手机验证码登录） */}
        {!isRegister && (
          <div className="px-6 pt-4 pb-1">
            <div className="flex p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setLoginMethod('password')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginMethod === 'password'
                    ? 'bg-white text-[#6D4AFF] shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Lock className="w-3.5 h-3.5" />
                <span>用户名密码登录</span>
              </button>
              <button
                type="button"
                onClick={() => setLoginMethod('sms')}
                className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
                  loginMethod === 'sms'
                    ? 'bg-white text-[#6D4AFF] shadow-xs font-extrabold'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>手机验证码登录</span>
              </button>
            </div>
          </div>
        )}

        {/* 表单主体内容 */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-3.5 text-left max-h-[70vh] overflow-y-auto">
          
          {isRegister ? (
            /* ========================================================
               注册模式表单：严格按顺序：
               1. 用户名
               2. 密码
               3. 二次确认密码
               4. 手机号
               5. 验证码
               ======================================================== */
            <>
              {/* 1. 用户名 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5 text-[#6D4AFF]" />
                    <span>用户名</span>
                    <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">4-16位字母/数字/下划线</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    placeholder="请输入开发者用户名"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              {/* 2. 设置密码 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-[#6D4AFF]" />
                    <span>设置登录密码</span>
                    <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">至少 6 位字符</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="请设置 6 位以上安全密码"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 3. 二次确认密码 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6D4AFF]" />
                    <span>二次确认密码</span>
                    <span className="text-red-500">*</span>
                  </span>
                  {regConfirmPassword && (
                    <span className={`text-[10px] font-medium flex items-center gap-0.5 ${
                      regPassword === regConfirmPassword ? 'text-emerald-600' : 'text-rose-500'
                    }`}>
                      {regPassword === regConfirmPassword ? (
                        <>
                          <CheckCircle2 className="w-3 h-3" />
                          <span>密码一致</span>
                        </>
                      ) : (
                        '两次密码不一致'
                      )}
                    </span>
                  )}
                </label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="请再次输入登录密码"
                    className={`w-full bg-slate-50 border rounded-xl pl-9 pr-9 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:bg-white transition ${
                      regConfirmPassword && regPassword !== regConfirmPassword
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-slate-200 focus:border-[#6D4AFF]'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegConfirmPassword(!showRegConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                  >
                    {showRegConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 4. 手机号 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Smartphone className="w-3.5 h-3.5 text-[#6D4AFF]" />
                    <span>手机号码</span>
                    <span className="text-red-500">*</span>
                  </span>
                  <span className="text-[10px] text-slate-400">用于账号安全验证与通知</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="请输入 11 位手机号"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                    required
                  />
                </div>
              </div>

              {/* 5. 短信验证码 */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-[#6D4AFF]" />
                    <span>短信验证码</span>
                    <span className="text-red-500">*</span>
                  </span>
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={regCode}
                      onChange={(e) => setRegCode(e.target.value)}
                      placeholder="输入 4 位验证码 (8866)"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                      required
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSendCode(regPhone)}
                    disabled={isCountingDown}
                    className={`px-3 py-2 rounded-xl border text-xs font-bold transition cursor-pointer whitespace-nowrap shadow-2xs ${
                      isCountingDown
                        ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                        : 'bg-[#F0EDFF] hover:bg-[#E5DEFF] border-[#6D4AFF]/30 text-[#6D4AFF]'
                    }`}
                  >
                    {isCountingDown ? `${countdown}s 后重发` : '获取验证码'}
                  </button>
                </div>
              </div>

              {/* 邀请码 (选填) */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                  <span className="flex items-center gap-1 text-slate-600">
                    <Gift className="w-3.5 h-3.5 text-amber-600" />
                    <span>好友邀请码 (选填)</span>
                  </span>
                  <span className="text-[10px] text-amber-600 font-medium">填邀请码双方再赠 100 积分</span>
                </label>
                <input
                  type="text"
                  value={inviteCode}
                  onChange={(e) => setInviteCode(e.target.value)}
                  placeholder="请输入专属邀请码 (如 QIANJI-VIP-8829)"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-1.5 text-xs font-mono text-slate-700 focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                />
              </div>
            </>
          ) : (
            /* ========================================================
               登录模式表单：
               支持【用户名密码登录】或【手机验证码登录】
               ======================================================== */
            <>
              {loginMethod === 'password' ? (
                /* 方式 A：用户名密码登录 */
                <>
                  {/* 用户名 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-[#6D4AFF]" />
                        <span>用户名</span>
                      </span>
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        value={loginAccount}
                        onChange={(e) => setLoginAccount(e.target.value)}
                        placeholder="请输入用户名"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 font-medium focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>

                  {/* 登录密码 */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5 text-[#6D4AFF]" />
                        <span>登录密码</span>
                      </label>
                      <button
                        type="button"
                        onClick={() => showToast('请联系平台管理员或使用手机短信验证码快速重置密码')}
                        className="text-[11px] text-[#6D4AFF] hover:underline cursor-pointer"
                      >
                        忘记密码？
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={showLoginPassword ? 'text' : 'password'}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="请输入登录密码"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-9 py-2.5 text-xs text-slate-800 font-mono focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition cursor-pointer"
                      >
                        {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                /* 方式 B：手机验证码登录 */
                <>
                  {/* 手机号 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <Smartphone className="w-3.5 h-3.5 text-[#6D4AFF]" />
                      <span>手机号码</span>
                    </label>
                    <div className="relative">
                      <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        value={loginPhone}
                        onChange={(e) => setLoginPhone(e.target.value)}
                        placeholder="请输入绑定的 11 位手机号"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                        required
                      />
                    </div>
                  </div>

                  {/* 短信验证码 */}
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1 flex items-center gap-1">
                      <KeyRound className="w-3.5 h-3.5 text-[#6D4AFF]" />
                      <span>短信验证码</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={loginCode}
                          onChange={(e) => setLoginCode(e.target.value)}
                          placeholder="输入 4 位短信验证码 (8866)"
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-xs text-slate-800 font-mono font-medium focus:outline-none focus:border-[#6D4AFF] focus:bg-white transition"
                          required
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSendCode(loginPhone)}
                        disabled={isCountingDown}
                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold transition cursor-pointer whitespace-nowrap shadow-2xs ${
                          isCountingDown
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                            : 'bg-[#F0EDFF] hover:bg-[#E5DEFF] border-[#6D4AFF]/30 text-[#6D4AFF]'
                        }`}
                      >
                        {isCountingDown ? `${countdown}s 后重发` : '获取验证码'}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* 服务协议与隐私保护政策勾选 */}
          <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
            <input
              type="checkbox"
              id="auth-agreement"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-[#6D4AFF] border-slate-300 focus:ring-[#6D4AFF] cursor-pointer"
            />
            <label htmlFor="auth-agreement" className="cursor-pointer select-none">
              已阅读并同意
              <span className="text-[#6D4AFF] hover:underline mx-0.5 font-medium">《用户服务协议》</span>
              与
              <span className="text-[#6D4AFF] hover:underline mx-0.5 font-medium">《隐私保护政策》</span>
            </label>
          </div>

          {/* 提交主按钮 */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5735D8] via-[#6D4AFF] to-[#7B59FF] hover:opacity-95 text-white font-bold text-xs shadow-md transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99]"
          >
            {isRegister ? (
              <>
                <span>立即注册</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                <span>立即登录</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

      </div>
    </div>
  );
};
