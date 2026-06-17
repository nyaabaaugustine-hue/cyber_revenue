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
  IcnActivity as Activity,
  IcnBarChart as BarChart,
  IcnDollar as DollarSign,
} from "@/components/ui/Icons";
import { useAuth } from "../utils/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { roleLabels } from "../utils/permissions";
import { toast } from "sonner";

const features = [
  { icon: Building, label: "3,420+ Businesses", sub: "Registered across 5 zones", color: "from-indigo-500 to-indigo-600" },
  { icon: MapPin, label: "Live GPS Tracking", sub: "Real-time agent location monitoring", color: "from-emerald-500 to-emerald-600" },
  { icon: BarChart, label: "Real-time Analytics", sub: "Revenue trends & agent performance", color: "from-violet-500 to-violet-600" },
  { icon: DollarSign, label: "GHS 800K+ Monthly", sub: "Revenue collection target", color: "from-amber-500 to-amber-600" },
  { icon: UsersIcon, label: "6 Role-Based Access", sub: "Admin, Supervisor, Accountant, Manager, Field Officer", color: "from-rose-500 to-rose-600" },
  { icon: Activity, label: "Smart Audit Trail", sub: "Every action logged & traceable", color: "from-cyan-500 to-cyan-600" },
];

const roleColors: Record<string, string> = {
  admin: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
  supervisor: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  accountant: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  manager: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  field_officer: "bg-rose-500/20 text-rose-300 border-rose-500/30",
};

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedQuick, setSelectedQuick] = useState<string | null>(null);
  const { login, availableUsers, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate("/", { replace: true });
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

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-950">
      {/* Left Panel — Immersive Branding */}
      <div className="hidden lg:flex lg:w-[55%] relative overflow-hidden">
        <img
          src="https://res.cloudinary.com/dwsl2ktt2/image/upload/v1781679029/VV_pl3beb.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover scale-105 brightness-[0.35] saturate-[0.6]"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950/95 via-slate-950/90 to-indigo-950/85" />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px), radial-gradient(circle at 75% 75%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }} />
        <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-violet-500/8 rounded-full blur-[120px]" />

        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          <div>
            <div className="inline-flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-600 rounded-2xl shadow-lg shadow-indigo-500/25 flex items-center justify-center ring-1 ring-white/10">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight">CyberRevenue</h1>
                <p className="text-[11px] text-indigo-300/70 font-medium tracking-widest uppercase">Revenue Command System</p>
              </div>
            </div>
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg">
            <div className="space-y-3 mb-10">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Kumasi Metropolitan Assembly
              </div>
              <h2 className="text-5xl font-bold text-white leading-[1.1] tracking-tight">
                Revenue Intelligence
                <br />
                <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">
                  Command Center
                </span>
              </h2>
              <p className="text-slate-400 text-base leading-relaxed max-w-md">
                Unified platform for district revenue collection, agent tracking, financial oversight, and real-time analytics.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {features.map((f, i) => (
                <div
                  key={i}
                  className="group flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.1] transition-all duration-300 cursor-default"
                >
                  <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center shrink-0 shadow-lg shadow-black/20 ring-1 ring-white/10`}>
                    <f.icon className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white/90">{f.label}</p>
                    <p className="text-[11px] text-slate-500 leading-snug mt-0.5">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-8 text-sm">
            {[
              { value: "99.9%", label: "Uptime" },
              { value: "256-bit", label: "Encryption" },
              { value: "24/7", label: "Monitoring" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-lg font-bold text-white">{s.value}</span>
                <span className="text-xs text-slate-500">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel — Login Form */}
      <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-8 relative bg-slate-950">
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 1px)`,
          backgroundSize: '40px 40px'
        }} />

        <div className="w-full max-w-[460px] relative z-10 flex flex-col">
          {/* Mobile-only logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl mb-4 shadow-lg shadow-indigo-500/25 ring-1 ring-white/10">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">CyberRevenue</h1>
            <p className="text-slate-400 text-sm mt-1.5">District Revenue Command System</p>
          </div>

          {/* Form Card — Enhanced visibility */}
          <div className="bg-white/[0.10] border border-white/[0.12] rounded-2xl p-6 sm:p-8 shadow-2xl shadow-black/50">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
              <p className="text-slate-300 text-sm mt-2">Sign in to access the command center</p>
            </div>

            {error && (
              <div className="mb-5 px-4 py-3 rounded-xl bg-red-500/15 border border-red-500/25 text-sm text-red-300 flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-red-400">!</span>
                </div>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    type="email"
                    placeholder="you@kma.gov.gh"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    autoFocus
                    className="pl-11 h-12 bg-white/[0.08] border-white/[0.15] text-white placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-indigo-400/20 rounded-xl transition-all text-[15px]"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-400 transition-colors" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(""); }}
                    className="pl-11 pr-11 h-12 bg-white/[0.08] border-white/[0.15] text-white placeholder:text-slate-500 focus:border-indigo-400/80 focus:ring-indigo-400/20 rounded-xl transition-all text-[15px]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div className="w-4 h-4 rounded border border-white/15 bg-white/[0.05] flex items-center justify-center">
                    <CheckCircle className="w-3 h-3 text-transparent" />
                  </div>
                  <span className="text-xs text-slate-400">Remember me</span>
                </label>
                <button type="button" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-12 bg-gradient-to-r from-indigo-600 via-indigo-600 to-violet-600 hover:from-indigo-500 hover:via-indigo-500 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-600/25 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-sm tracking-wide"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Authenticating...
                  </span>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/[0.08]" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 py-1 bg-white/[0.10] rounded-full text-slate-400 border border-white/[0.08]">or</span>
              </div>
            </div>

            {/* Quick Select — 2 rows of 3 for better visibility */}
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold mb-3 text-center">Quick Access</p>
              <div className="grid grid-cols-3 gap-3">
                {availableUsers.map((u) => (
                  <button
                    key={u.id}
                    onClick={() => quickLogin(u)}
                    disabled={isLoading}
                    className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-200 group ${
                      selectedQuick === u.id
                        ? "bg-indigo-500/15 border-indigo-500/35 shadow-lg shadow-indigo-500/15 scale-95"
                        : "bg-white/[0.04] border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15] hover:scale-105"
                    } disabled:opacity-40`}
                  >
                    <img
                      src={u.avatarUrl}
                      alt={u.fullName}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-white/[0.10] group-hover:ring-white/[0.20] transition-all"
                    />
                    <div className="text-center min-w-0 w-full">
                      <p className="text-[11px] font-semibold text-white truncate leading-tight">
                        {u.fullName.split(" ").slice(-1)[0]}
                      </p>
                      <p className="text-[9px] text-slate-500 truncate mt-0.5">
                        {u.fullName.split(" ").slice(0, -1).join(" ")}
                      </p>
                      <span className={`text-[9px] px-2 py-0.5 rounded border font-semibold mt-1.5 inline-block ${roleColors[u.role] || ""}`}>
                        {roleLabels[u.role] || u.role}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p className="text-center text-[11px] text-slate-600 mt-6">
            &copy; 2024 CyberRevenue &middot; Built for Kumasi Metropolitan Assembly
          </p>
        </div>
      </div>
    </div>
  );
}
