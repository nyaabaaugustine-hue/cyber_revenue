// CyberRevenue Design Tokens
// Based on Brand & Design Force v2.0

export const colors = {
  // Primary Brand Colors
  navy: {
    DEFAULT: '#0F2B5B',
    light: '#1A3F7A',
    deep: '#071A3A',
  },
  orange: {
    DEFAULT: '#FF6B00',
    light: '#FF8C3A',
    pale: '#FFF0E6',
  },
  
  // Semantic Colors
  success: {
    DEFAULT: '#10B981',
    light: '#D1FAE5',
    bg: '#ECFDF5',
  },
  warning: {
    DEFAULT: '#F59E0B',
    light: '#FEF3C7',
    bg: '#FFFBEB',
  },
  danger: {
    DEFAULT: '#EF4444',
    light: '#FEE2E2',
    bg: '#FEF2F2',
  },
  critical: {
    DEFAULT: '#7C3AED',
    light: '#EDE9FE',
    bg: '#F5F3FF',
  },
  
  // Neutral / Surface
  surface: '#F8FAFC',
  card: '#FFFFFF',
  border: '#E2E8F0',
  
  // Text Colors
  text: {
    primary: '#1E293B',
    muted: '#64748B',
    hint: '#94A3B8',
  },
};

export const typography = {
  fontFamily: {
    display: '"Sora", "Inter", system-ui, sans-serif',
    body: '"Inter", system-ui, sans-serif',
    mono: '"JetBrains Mono", "Fira Code", monospace',
  },
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem',// 30px
    '4xl': '2rem',    // 32px
  },
  fontWeight: {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

export const spacing = {
  1: '4px',
  2: '8px',
  3: '12px',
  4: '16px',
  5: '24px',
  6: '40px',
  7: '64px',
};

export const borderRadius = {
  sm: '4px',
  DEFAULT: '8px',
  lg: '12px',
  xl: '16px',
  full: '9999px',
};

// Status badge configurations
export const statusConfig = {
  paid: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
  due: {
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    dot: 'bg-amber-500',
  },
  overdue: {
    bg: 'bg-red-50',
    text: 'text-red-700',
    border: 'border-red-200',
    dot: 'bg-red-500',
  },
  partial: {
    bg: 'bg-blue-50',
    text: 'text-blue-700',
    border: 'border-blue-200',
    dot: 'bg-blue-500',
  },
  waived: {
    bg: 'bg-slate-50',
    text: 'text-slate-700',
    border: 'border-slate-200',
    dot: 'bg-slate-400',
  },
  flagged: {
    bg: 'bg-violet-50',
    text: 'text-violet-700',
    border: 'border-violet-200',
    dot: 'bg-violet-500',
  },
  active: {
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    dot: 'bg-emerald-500',
  },
};

// Format currency in Ghana Cedis
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format currency without symbol
export const formatCurrencyNumber = (amount: number): string => {
  return new Intl.NumberFormat('en-GH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Format relative time
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  
  return date.toLocaleDateString('en-GH', { month: 'short', day: 'numeric' });
};

// Format percentage
export const formatPercent = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

// Format number with commas
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-GH').format(value);
};

// Format business ID (monospace)
export const formatId = (id: string): string => {
  return id;
};

// Format GPS coordinates
export const formatCoordinates = (lat: number, lng: number): string => {
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
};