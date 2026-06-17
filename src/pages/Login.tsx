import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  IcnShield as Shield,
  IcnMail as Mail,
  IcnLock as Lock,
  IcnEye as Eye,
  IcnEyeOff as EyeOff,
  IcnCheckCircle as CheckCircle,
  IcnBuilding as Building,
  IcnMapPin as MapPin,
  IcnUsers as UsersIcon,
} from "@/components/ui/Icons";
import { useAuth } from "../utils/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roleLabels } from "../utils/permissions";
import { toast } from "sonner";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickSelect, setShowQuickSelect] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);
  const { login, availableUsers, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    setError("");
    try {
      const ok = await login(email, password);
      if (ok) {
        toast.success("Welcome back!");
        navigate("/", { replace: true });
      } else {
        setError("Invalid email or password. Please try again.");
        toast.error("Login failed");
      }
    } catch {
      setError("Connection error. Please try again.");
      toast.error("Connection error");
    } finally {
      setIsLoading(false);
    }
  };

  const quickLogin = async (u: (typeof availableUsers)[0]) => {
    setSelectedQuick(u.id);
    setEmail(u.email);
    setPassword("password123");
    setIsLoading(true);
    setError("");
    try {
      const ok = await login(u.email, "password123");
      if (ok) {
        toast.success(`Welcome, ${u.fullName}!`);
        navigate("/", { replace: true });
      } else {
        setError("Quick login failed. Try again.");
        toast.error("Login failed");
      }
    } catch {
      setError("Connection error. Please try again.");
      toast.error("Connection error");
    } finally {
      setIsLoading(false);
      setSelectedQuick(null);
    }
  };

  const roleColors: Record<string, string> = {
    admin: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    supervisor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
    accountant: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    manager: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    field_officer: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel — Branding with Background Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Background Image */}
        <img
          src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1781679029/VV_pl3beb.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/85 via-slate-950/75 to-slate-950/90" />
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-16 max-w-lg">
          {/* Logo */}
          <div className="inline-flex items-center gap-3 mb-8">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl shadow-lg shadow-indigo-500/30 flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                CyberRevenue
              </h1>
              <p className="text-indigo-300 text-sm font-medium -mt-0.5">
                Revenue Command System
              </p>
            </div>
          </div>

          <p className="text-slate-300 text-base leading-relaxed mb-10 max-w-md">
            Revenue Command System for Ghana District Assemblies. Real-time
            collection tracking, agent monitoring, and financial oversight.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/15 border border-indigo-400/20 flex items-center justify-center backdrop-blur-sm">
                <Building className="w-4 h-4 text-indigo-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  Kumasi Metropolitan Assembly
                </p>
                <p className="text-xs text-slate-400">District Revenue Office</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-400/20 flex items-center justify-center backdrop-blur-sm">
                <MapPin className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Live GPS Tracking</p>
                <p className="text-xs text-slate-400">
                  Real-time agent location monitoring
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-violet-500/15 border border-violet-400/20 flex items-center justify-center backdrop-blur-sm">
                <UsersIcon className="w-4 h-4 text-violet-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">
                  6 Roles &middot; Full Access Control
                </p>
                <p className="text-xs text-slate-400">
                  Admin, Supervisor, Accountant, Manager, Field Officer
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8 bg-slate-950">
        <div className="w-full max-w-md">
          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl mb-4">
              <Shield className="w-7 h-7 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold text-white">CyberRevenue</h1>
            <p className="text-slate-500 text-sm mt-1">
              District Revenue Command System
            </p>
          </div>

          {/* Card */}
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl shadow-black/40">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Sign in</h2>
              <p className="text-slate-400 text-sm mt-1">
                Enter your credentials to access the command center
              </p>
            </div>

            {/* Error Banner */}
            {error && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type="email"
                    placeholder="you@kma.gov.gh"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    autoFocus
                    className="pl-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError("");
                    }}
                    className="pl-10 pr-10 h-11 bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 focus:border-indigo-500 focus:ring-indigo-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white font-medium shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Quick Select */}
            <div className="mt-6 pt-5 border-t border-slate-800">
              <button
                onClick={() => setShowQuickSelect(!showQuickSelect)}
                className="w-full text-xs text-slate-500 hover:text-slate-300 transition-colors text-center"
              >
                {showQuickSelect
                  ? "Hide demo accounts"
                  : "Quick login with a demo account"}
              </button>

              {showQuickSelect && (
                <div className="mt-3 space-y-2">
                  {availableUsers.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => quickLogin(u)}
                      disabled={isLoading}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left group ${
                        selectedQuick === u.id
                          ? "bg-indigo-500/10 border-indigo-500/30"
                          : "bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600"
                      } disabled:opacity-50`}
                    >
                      <img
                        src={u.avatarUrl}
                        alt={u.fullName}
                        className="w-8 h-8 rounded-full ring-2 ring-slate-800"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">
                          {u.fullName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span
                            className={`text-[10px] px-1.5 py-0.5 rounded border font-medium ${
                              roleColors[u.role] || ""
                            }`}
                          >
                            {roleLabels[u.role] || u.role}
                          </span>
                        </div>
                      </div>
                      <CheckCircle className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors flex-shrink-0" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-center text-xs text-slate-600 mt-6">
            &copy; 2024 CyberRevenue Command System &middot; Kumasi Metropolitan
            Assembly
          </p>
        </div>
      </div>
    </div>
  );
}
