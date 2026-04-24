// Shared utilities and UI primitives for Xisob

const getLocale = () => (window.getXisobLocale ? window.getXisobLocale() : "ru");
const htmlLocale = (l) => (l === "uz" ? "uz-UZ" : l === "en" ? "en-US" : "ru-RU");

// ---- Formatters ----
const fmtUZS = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const rounded = Math.round(n);
  return rounded.toLocaleString(htmlLocale(getLocale()));
};

const fmtCompact = (n) => {
  if (n === null || n === undefined || isNaN(n)) return "—";
  const abs = Math.abs(n);
  if (abs >= 1_000_000_000) return (n / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
  if (abs >= 1_000_000) return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  if (abs >= 1_000) return (n / 1_000).toFixed(0) + "K";
  return String(Math.round(n));
};

const fmtMoney = (n, currency = "UZS") => {
  const locale = getLocale();
  const uzsLabel = locale === "ru" ? "сум" : locale === "uz" ? "so'm" : "UZS";
  if (currency === "USD") return "$" + fmtUZS(n);
  return fmtUZS(n) + " " + uzsLabel;
};

const fmtDate = (dateStr, opts = {}) => {
  const d = new Date(dateStr);
  const locale = htmlLocale(getLocale());
  if (opts.short) {
    return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric" }).format(d);
  }
  return new Intl.DateTimeFormat(locale, { month: "short", day: "numeric", year: "numeric" }).format(d);
};

const fmtDateInput = (dateStr) => {
  const d = new Date(dateStr);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

const monthKey = (dateStr) => {
  const d = new Date(dateStr);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const monthLabel = (dateStr) => {
  const d = new Date(dateStr);
  return new Intl.DateTimeFormat(htmlLocale(getLocale()), { month: "short" }).format(d);
};

// ---- Icon set (inline SVG, 1.5px stroke, Lucide-ish) ----
const Icon = ({ name, size = 18, strokeWidth = 1.75, className = "", style = {} }) => {
  const s = { width: size, height: size, ...style };
  const P = { fill: "none", stroke: "currentColor", strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  const paths = {
    "home":      <><path {...P} d="M3 11.5L12 4l9 7.5" /><path {...P} d="M5 10v10h14V10" /></>,
    "list":      <><path {...P} d="M8 6h13M8 12h13M8 18h13" /><circle cx="3.5" cy="6" r="1.2" {...P} /><circle cx="3.5" cy="12" r="1.2" {...P} /><circle cx="3.5" cy="18" r="1.2" {...P} /></>,
    "chart":     <><path {...P} d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
    "tag":       <><path {...P} d="M20.5 12.5l-8 8a2 2 0 01-2.8 0l-6.2-6.2a2 2 0 010-2.8l8-8H20v8.8a2 2 0 01-.5.2z" /><circle cx="16" cy="8" r="1.3" {...P} /></>,
    "target":    <><circle cx="12" cy="12" r="9" {...P} /><circle cx="12" cy="12" r="5" {...P} /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /></>,
    "plus":      <path {...P} d="M12 5v14M5 12h14" />,
    "minus":     <path {...P} d="M5 12h14" />,
    "x":         <path {...P} d="M6 6l12 12M18 6L6 18" />,
    "check":     <path {...P} d="M5 12l5 5L20 7" />,
    "arrow-up":  <path {...P} d="M12 19V5M6 11l6-6 6 6" />,
    "arrow-down":<path {...P} d="M12 5v14M6 13l6 6 6-6" />,
    "arrow-right":<path {...P} d="M5 12h14M13 6l6 6-6 6" />,
    "chevron-down":<path {...P} d="M6 9l6 6 6-6" />,
    "chevron-left":<path {...P} d="M15 18l-6-6 6-6" />,
    "chevron-right":<path {...P} d="M9 6l6 6-6 6" />,
    "search":    <><circle cx="11" cy="11" r="7" {...P} /><path {...P} d="M20 20l-3.5-3.5" /></>,
    "filter":    <path {...P} d="M3 5h18l-7 9v5l-4 2v-7L3 5z" />,
    "trending-up":<><path {...P} d="M3 17l6-6 4 4 8-8" /><path {...P} d="M14 7h7v7" /></>,
    "trending-down":<><path {...P} d="M3 7l6 6 4-4 8 8" /><path {...P} d="M14 17h7v-7" /></>,
    "equal":     <><path {...P} d="M5 9h14M5 15h14" /></>,
    "calendar":  <><rect x="3" y="5" width="18" height="16" rx="2" {...P} /><path {...P} d="M3 10h18M8 3v4M16 3v4" /></>,
    "edit":      <><path {...P} d="M4 20h4l10-10-4-4L4 16v4z" /><path {...P} d="M14 6l4 4" /></>,
    "trash":     <><path {...P} d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13" /><path {...P} d="M10 11v6M14 11v6" /></>,
    "lock":      <><rect x="5" y="11" width="14" height="9" rx="2" {...P} /><path {...P} d="M8 11V7a4 4 0 018 0v4" /></>,
    "shopping-bag":<><path {...P} d="M5 7h14l-1 13H6L5 7z" /><path {...P} d="M9 7V5a3 3 0 016 0v2" /></>,
    "briefcase": <><rect x="3" y="7" width="18" height="13" rx="2" {...P} /><path {...P} d="M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2M3 13h18" /></>,
    "package":   <><path {...P} d="M3 7l9-4 9 4v10l-9 4-9-4V7z" /><path {...P} d="M3 7l9 4 9-4M12 11v10" /></>,
    "globe":     <><circle cx="12" cy="12" r="9" {...P} /><path {...P} d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" /></>,
    "circle":    <circle cx="12" cy="12" r="8" {...P} />,
    "users":     <><circle cx="9" cy="8" r="3.5" {...P} /><path {...P} d="M3 20c0-3 3-5 6-5s6 2 6 5" /><path {...P} d="M16 8a3 3 0 010 6M17 20c0-2.5-1.5-4.5-3.5-5" /></>,
    "truck":     <><path {...P} d="M3 7h11v9H3V7z" /><path {...P} d="M14 10h4l3 3v3h-7v-6z" /><circle cx="7" cy="18" r="2" {...P} /><circle cx="17" cy="18" r="2" {...P} /></>,
    "megaphone": <><path {...P} d="M4 10v5l11 4V6L4 10z" /><path {...P} d="M15 8v9M18 10v5" /></>,
    "zap":       <path {...P} d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />,
    "file-text": <><path {...P} d="M6 3h9l4 4v14H6V3z" /><path {...P} d="M14 3v5h5M9 13h7M9 17h7M9 9h3" /></>,
    "layers":    <><path {...P} d="M12 3l9 5-9 5-9-5 9-5z" /><path {...P} d="M3 13l9 5 9-5M3 17l9 5 9-5" /></>,
    "tool":      <path {...P} d="M14 6a4 4 0 014 4 4 4 0 01-5 4l-6 6a2 2 0 01-3-3l6-6a4 4 0 014-5z" />,
    "sparkles":  <><path {...P} d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M5.6 18.4l2.8-2.8M15.6 8.4l2.8-2.8" /></>,
    "bell":      <><path {...P} d="M6 9a6 6 0 0112 0c0 7 3 8 3 8H3s3-1 3-8z" /><path {...P} d="M10 20a2 2 0 004 0" /></>,
    "more":      <><circle cx="12" cy="5" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" /><circle cx="12" cy="19" r="1.5" fill="currentColor" stroke="none" /></>,
    "menu":      <path {...P} d="M4 6h16M4 12h16M4 18h16" />,
    "receipt":   <><path {...P} d="M6 3h12v18l-3-2-3 2-3-2-3 2V3z" /><path {...P} d="M9 8h6M9 12h6M9 16h3" /></>,
    "plant":     <><path {...P} d="M12 20V10M12 10c0-3-3-6-7-6 0 4 3 7 7 6zM12 10c0-3 3-6 7-6 0 4-3 7-7 6z" /><path {...P} d="M7 20h10" /></>,
    "info":      <><circle cx="12" cy="12" r="9" {...P} /><path {...P} d="M12 8v.01M12 12v4" /></>,
    "alert":     <><path {...P} d="M12 3l10 18H2L12 3z" /><path {...P} d="M12 10v5M12 18v.01" /></>,
    "lightning-bolt": <path {...P} d="M13 3L4 14h6l-1 7 9-11h-6l1-7z" />,
  };
  return (
    <svg viewBox="0 0 24 24" style={s} className={className} aria-hidden="true">
      {paths[name] || paths["circle"]}
    </svg>
  );
};

// ---- Toast ----
const ToastContext = React.createContext({ push: () => {} });

function ToastProvider({ children }) {
  const [toasts, setToasts] = React.useState([]);
  const push = React.useCallback((msg, tone = "success") => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, msg, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8 }}>
        {toasts.map((t) => (
          <div key={t.id} style={{
            background: t.tone === "error" ? "#FEF2F2" : t.tone === "info" ? "#F1F5F9" : "#ECFDF5",
            color: t.tone === "error" ? "#9F1239" : t.tone === "info" ? "#0F172A" : "#065F46",
            border: `1px solid ${t.tone === "error" ? "#FECACA" : t.tone === "info" ? "#E2E8F0" : "#A7F3D0"}`,
            borderRadius: 10,
            padding: "10px 14px",
            fontSize: 13,
            fontWeight: 500,
            boxShadow: "0 8px 24px rgba(15, 23, 42, 0.12)",
            display: "flex", alignItems: "center", gap: 8,
            minWidth: 240,
            animation: "toastIn 180ms ease-out",
          }}>
            <Icon name={t.tone === "error" ? "alert" : t.tone === "info" ? "info" : "check"} size={16} />
            <span>{t.msg}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

const useToast = () => React.useContext(ToastContext);

// ---- Viewport helpers ----
function useViewport() {
  const getWidth = () => {
    try { return window.innerWidth || 1280; } catch (e) { return 1280; }
  };
  const [width, setWidth] = React.useState(getWidth);

  React.useEffect(() => {
    const onResize = () => setWidth(getWidth());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isMobile: width < 768,
    isTablet: width >= 768 && width < 1024,
    isDesktop: width >= 1024,
  };
}

// ---- Count-up hook ----
function useCountUp(target, duration = 900) {
  const [value, setValue] = React.useState(0);
  const startRef = React.useRef(null);
  const rafRef = React.useRef(null);
  const fromRef = React.useRef(0);

  React.useEffect(() => {
    fromRef.current = value;
    startRef.current = null;
    const step = (ts) => {
      if (!startRef.current) startRef.current = ts;
      const progress = Math.min(1, (ts - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(fromRef.current + (target - fromRef.current) * eased);
      if (progress < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line
  }, [target]);

  return value;
}

// ---- Skeleton ----
const Skeleton = ({ w = "100%", h = 16, r = 6, style = {} }) => (
  <div style={{
    width: w, height: h, borderRadius: r,
    background: "linear-gradient(90deg, #EEF2F7 0%, #F8FAFC 50%, #EEF2F7 100%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.4s ease-in-out infinite",
    ...style,
  }} />
);

// ---- Export ----
Object.assign(window, {
  fmtUZS, fmtCompact, fmtMoney, fmtDate, fmtDateInput, monthKey, monthLabel,
  Icon, ToastProvider, useToast, useCountUp, Skeleton, useViewport,
});
