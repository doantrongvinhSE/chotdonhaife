import React, { useState } from 'react';
import { Smartphone, Eye, EyeOff, Lock, Mail, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (email: string, password: string) => boolean;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const success = onLogin(email, password);
      if (!success) {
        setError('Email hoặc mật khẩu không đúng');
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: 'url(https://img.freepik.com/premium-photo/online-shopping-concept-3d-smartphone-with-cart-shopping-bag-digital-marketing-promotion-online-payment-3d-render-illustration_265427-805.jpg?semt=ais_hybrid&w=740&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay mờ */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      <div className="relative z-10 w-full max-w-md">
        {/* Logo & Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4 shadow-md"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
            }}
          >
            <Smartphone className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight mb-1">
            PHẦN MỀM HỖ TRỢ BÁN HÀNG
          </h1>
          <p className="text-slate-400 text-sm">
            Đăng nhập để truy cập hệ thống quản lý của bạn
          </p>
        </div>

        {/* Card */}
        <div
          className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100"
          style={{ boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)' }}
        >
          {/* Card Header */}
          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800 mb-1">Chào mừng trở lại</h2>
            <p className="text-slate-400 text-sm">Nhập thông tin đăng nhập của bạn</p>
          </div>

          {/* Error Alert */}
          {error && (
            <div
              className="mb-5 p-3.5 rounded-xl border flex items-start gap-3"
              style={{
                background: '#fef2f2',
                borderColor: '#fecaca'
              }}
            >
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#fee2e2' }}
              >
                <span className="text-red-500 text-xs font-bold">!</span>
              </div>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="block text-slate-700 text-sm font-medium">
                Email <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Mail className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => setEmailFocused(false)}
                  placeholder="Nhập email của bạn"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border text-slate-800 placeholder-slate-300 transition-all duration-300 outline-none rounded-xl"
                  style={{
                    borderColor: emailFocused ? '#3b82f6' : '#e2e8f0',
                    borderWidth: '1.5px',
                    boxShadow: emailFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="block text-slate-700 text-sm font-medium">
                Mật khẩu <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2">
                  <Lock className="w-4 h-4 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={() => setPasswordFocused(false)}
                  placeholder="Nhập mật khẩu của bạn"
                  className="w-full pl-10 pr-12 py-3 bg-slate-50 border text-slate-800 placeholder-slate-300 transition-all duration-300 outline-none rounded-xl"
                  style={{
                    borderColor: passwordFocused ? '#3b82f6' : '#e2e8f0',
                    borderWidth: '1.5px',
                    boxShadow: passwordFocused ? '0 0 0 3px rgba(59, 130, 246, 0.1)' : 'none'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-slate-400 hover:text-slate-600 transition-colors rounded-lg hover:bg-slate-100"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember & Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2.5 cursor-pointer group">
                <div className="relative">
                  <input type="checkbox" className="sr-only peer" />
                  <div
                    className="w-5 h-5 rounded-md border border-slate-300 bg-white peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500/50"
                  />
                  <svg
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-slate-500 text-sm group-hover:text-slate-700 transition-colors">
                  Ghi nhớ đăng nhập
                </span>
              </label>
              <button
                type="button"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 font-semibold py-3.5 px-6 rounded-xl text-white transition-all duration-300 mt-2"
              style={{
                background: isLoading ? '#93c5fd' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                boxShadow: '0 4px 14px rgba(59, 130, 246, 0.35)'
              }}
            >
              {isLoading ? (
                <>
                  <div
                    className="w-5 h-5 border-2 border-white/40 rounded-full animate-spin"
                    style={{ borderTopColor: 'white' }}
                  />
                  <span>Đang đăng nhập...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-400 text-xs mt-6">
          &copy; 2026 Phần mềm hỗ trợ bán hàng. Tất cả quyền được bảo lưu.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
