import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import api from "../api/api";

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );

const SpinnerIcon = () => (
  <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

function InputField({ label, id, type = "text", value, onChange, error, success, placeholder, rightSlot }) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-xs font-semibold tracking-widest uppercase text-zinc-400">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={id}
          className={`w-full bg-zinc-900/60 border rounded-xl px-4 py-3.5 text-sm text-white placeholder:text-zinc-600 outline-none transition-all duration-200 focus:ring-2 ${
            error 
              ? "border-red-500/60 focus:ring-red-500/30 focus:border-red-500" 
              : success
                ? "border-emerald-500/60 focus:ring-emerald-500/30 focus:border-emerald-500"
                : "border-zinc-700/60 hover:border-zinc-600 focus:ring-amber-400/40 focus:border-amber-400/60"
          } ${rightSlot ? "pr-12" : ""}`}
        />
        {rightSlot && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">
            {rightSlot}
          </div>
        )}
      </div>
      {error && (
        <p className="text-xs text-red-400 flex items-center gap-1.5">
          <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
}

const EMPTY_LOGIN = { email: "", password: "" };
const EMPTY_REGISTER = { email: "", password: "", confirmPassword: "" };

export default function LoginPage() {
  const { login: authLogin, register: authRegister, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const [mode, setMode] = useState("login"); // "login" | "register"
  const [loginForm, setLoginForm] = useState(EMPTY_LOGIN);
  const [registerForm, setRegisterForm] = useState(EMPTY_REGISTER);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token, navigate, from]);

  const switchMode = (m) => {
    setMode(m);
    setErrors({});
    setServerError("");
    setSuccessMsg("");
    setShowPwd(false);
    setShowConfirmPwd(false);
  };

  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);

  // Real-time Validation Effect
  useEffect(() => {
    if (mode === "login") {
      const errs = validateLogin(loginForm);
      setErrors(errs);
      setIsSubmitDisabled(Object.keys(errs).length > 0 || !loginForm.email || !loginForm.password);
    } else {
      const errs = validateRegister(registerForm);
      setErrors(errs);
      setIsSubmitDisabled(
        Object.keys(errs).length > 0 || 
        !registerForm.email || 
        !registerForm.password || 
        !registerForm.confirmPassword
      );
    }
  }, [loginForm, registerForm, mode]);

  /* ── Validation ── */
  function validateLogin(form) {
    const e = {};
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    if (form.password && form.password.length < 1) e.password = "Password is required";
    return e;
  }

  function validateRegister(form) {
    const e = {};
    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email";
    
    // Strict Regex: Min 8 chars, 1 uppercase, 1 number
    const pwdRegex = /^(?=.*[A-Z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    if (form.password && !pwdRegex.test(form.password)) {
      e.password = "Min 8 chars, 1 uppercase, 1 number";
    }

    if (form.confirmPassword && form.confirmPassword !== form.password) {
      e.confirmPassword = "Passwords do not match";
    }
    return e;
  }

  /* ── Handlers ── */
  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitDisabled) return;
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const result = await authLogin(loginForm.email.trim(), loginForm.password);
      if (result.success) {
        navigate(from, { replace: true });
      } else {
        setServerError(result.message);
      }
    } catch (err) {
      setServerError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitDisabled) return;
    setErrors({});
    setServerError("");
    setLoading(true);
    try {
      const result = await authRegister(registerForm.email.trim(), registerForm.password, "User");
      if (result.success) {
        setSuccessMsg("Account created! Signing you in…");
        // AuthContext register automatically signs in the user!
        navigate(from, { replace: true });
      } else {
        setServerError(result.message);
        setSuccessMsg("");
      }
    } catch (err) {
      setServerError("Registration failed. Please try again.");
      setSuccessMsg("");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") mode === "login" ? handleLogin() : handleRegister();
  };

  /* ── Render ── */
  return (
    <div className="min-h-screen bg-[#07070d] flex flex-col lg:flex-row overflow-hidden">
      {/* Left Side: Image / Branding (50%) */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-600/40 via-[#07070d] to-[#07070d]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-amber-900/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#07070d] via-[#07070d]/60 to-transparent" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPgo8cmVjdCB3aWR0aD0iNCIgaGVpZ2h0PSI0IiBmaWxsPSIjZmZmIiBmaWxsLW9wYWNpdHk9IjAuMDUiLz4KPC9zdmc+')] opacity-20 mix-blend-overlay" />
        </div>

        <Link to="/" className="relative z-10 flex items-center gap-2 group w-fit">
          <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-amber-400 transition-transform duration-300 group-hover:rotate-[-8deg]" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span className="font-display text-2xl tracking-widest uppercase text-white drop-shadow-lg">
            Stage<span className="text-amber-400">Front</span>
          </span>
        </Link>

        <div className="relative z-10 mb-8">
          <h2 className="text-5xl font-display font-bold text-white leading-tight mb-4 drop-shadow-xl">
            Where Every Seat<br/>Is Front Row.
          </h2>
          <p className="text-xl text-zinc-300 font-medium max-w-md drop-shadow-md">
            Join thousands of fans and experience the magic of live music like never before.
          </p>
        </div>
      </div>

      {/* Right Side: Form (50%) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 py-12 lg:px-24 xl:px-32 relative">
        {/* Background effects for the form side */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden lg:hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-amber-500/5 rounded-full blur-[120px]" />
        </div>

        {/* Mobile Logo */}
        <Link to="/" className="mb-12 flex items-center gap-2 group lg:hidden justify-center">
          <svg viewBox="0 0 24 24" fill="none" className="w-7 h-7 text-amber-400 transition-transform duration-300 group-hover:rotate-[-8deg]" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <span className="font-display text-2xl tracking-widest uppercase text-white">
            Stage<span className="text-amber-400">Front</span>
          </span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          {/* Mode toggle */}
          <div className="flex rounded-xl overflow-hidden border border-zinc-800 mb-8 p-1 gap-1 bg-zinc-950/60 w-full max-w-xs mx-auto">
            {["login", "register"].map((m) => (
              <button
                key={m}
                onClick={() => switchMode(m)}
                className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 capitalize ${
                  mode === m
                    ? "bg-amber-400 text-black shadow-[0_2px_12px_rgba(251,191,36,0.3)]"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {m === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-8 text-center lg:text-left">
            <h1 className="font-display text-3xl md:text-4xl tracking-wider text-white uppercase font-bold">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-sm text-zinc-400 mt-2">
              {mode === "login"
                ? "Enter your credentials to access your tickets."
                : "Join StageFront and never miss a show."}
            </p>
          </div>

          {/* Success */}
          {successMsg && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {successMsg}
            </div>
          )}

          {/* Server error */}
          {serverError && (
            <div className="mb-5 flex items-start gap-2 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {serverError}
            </div>
          )}

          {/* Forms */}
          <form className="space-y-5" onSubmit={mode === "login" ? handleLogin : handleRegister}>
            {mode === "login" ? (
              <>
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm((f) => ({ ...f, email: e.target.value }))}
                  error={errors.email}
                  success={loginForm.email.length > 0 && !errors.email}
                  placeholder="you@example.com"
                />
                <InputField
                  label="Password"
                  id="current-password"
                  type={showPwd ? "text" : "password"}
                  value={loginForm.password}
                  onChange={(e) => setLoginForm((f) => ({ ...f, password: e.target.value }))}
                  error={errors.password}
                  success={loginForm.password.length > 0 && !errors.password}
                  placeholder="••••••••"
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="hover:text-zinc-300 transition-colors"
                      tabIndex={-1}
                    >
                      <EyeIcon open={showPwd} />
                    </button>
                  }
                />
              </>
            ) : (
              <>
                <InputField
                  label="Email Address"
                  id="email"
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, email: e.target.value }))}
                  error={errors.email}
                  success={registerForm.email.length > 0 && !errors.email}
                  placeholder="you@example.com"
                />
                <InputField
                  label="Password"
                  id="new-password"
                  type={showPwd ? "text" : "password"}
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, password: e.target.value }))}
                  error={errors.password}
                  success={registerForm.password.length > 0 && !errors.password}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowPwd((v) => !v)}
                      className="hover:text-zinc-300 transition-colors"
                      tabIndex={-1}
                    >
                      <EyeIcon open={showPwd} />
                    </button>
                  }
                />
                <InputField
                  label="Confirm Password"
                  id="confirm-password"
                  type={showConfirmPwd ? "text" : "password"}
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                  error={errors.confirmPassword}
                  success={registerForm.confirmPassword.length > 0 && !errors.confirmPassword}
                  placeholder="Repeat password"
                  rightSlot={
                    <button
                      type="button"
                      onClick={() => setShowConfirmPwd((v) => !v)}
                      className="hover:text-zinc-300 transition-colors"
                      tabIndex={-1}
                    >
                      <EyeIcon open={showConfirmPwd} />
                    </button>
                  }
                />
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || isSubmitDisabled}
              className="mt-8 w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-bold text-sm tracking-wider uppercase text-black bg-amber-400 hover:bg-amber-300 disabled:opacity-50 disabled:bg-zinc-700 disabled:text-zinc-400 disabled:cursor-not-allowed transition-all duration-200 shadow-[0_4px_24px_rgba(251,191,36,0.25)] hover:shadow-[0_4px_32px_rgba(251,191,36,0.4)] disabled:shadow-none active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <SpinnerIcon />
                  {mode === "login" ? "Signing in…" : "Creating account…"}
                </>
              ) : mode === "login" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Toggle hint */}
          <p className="mt-8 text-center text-sm text-zinc-500">
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => switchMode(mode === "login" ? "register" : "login")}
              className="text-amber-400 hover:text-amber-300 font-semibold transition-colors ml-1"
            >
              {mode === "login" ? "Create one here" : "Sign in here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
