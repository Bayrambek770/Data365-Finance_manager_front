// Shell: Sidebar + Header + page routing

const NAV = [
  { id: "overview", label: "Overview", key: "nav.overview", icon: "home" },
  { id: "transactions", label: "Transactions", key: "nav.transactions", icon: "list" },
  { id: "analytics", label: "Analytics", key: "nav.analytics", icon: "chart" },
  { id: "categories", label: "Categories", key: "nav.categories", icon: "tag" },
  { id: "budgets", label: "Budgets", key: "nav.budgets", icon: "target" },
];

function XisobLogo({ size = 28, dark = false }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: 8,
      background: dark ? "#0F172A" : "#0F172A",
      display: "grid", placeItems: "center",
      position: "relative", flexShrink: 0,
      boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.25)",
    }}>
      <svg viewBox="0 0 24 24" width={size * 0.62} height={size * 0.62}>
        <path d="M4 4 L20 20 M20 4 L4 20"
          stroke="#10B981" strokeWidth="3.2" strokeLinecap="round" fill="none" />
      </svg>
    </div>
  );
}

function Sidebar({ page, onNav, open, isDesktop, onClose }) {
  const { team, userCode, myPhone, myName, tweaks, setTweak, resolvedTheme } = useApp();
  const { locale, setLocale, t } = useT();
  const me = team.find((t) => t.code === userCode);
  const dark = resolvedTheme === "dark";

  const bg = "var(--sidebar-bg)";
  const textMuted = dark ? "rgba(226,232,240,0.62)" : "#64748B";
  const textStrong = "var(--text-primary)";
  const border = "var(--sidebar-border)";
  const hoverBg = "var(--surface-soft)";
  const activeBg = dark ? "rgba(16,185,129,0.08)" : "#F0FDF4";
  const show = isDesktop ? true : open;
  const sidebarWidth = 240;

  React.useEffect(() => {
    if (isDesktop || !show) return undefined;
    const onEsc = (e) => {
      if (e.key === "Escape") onClose && onClose();
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isDesktop, show, onClose]);

  return (
    <>
    {!isDesktop && show && (
      <button
        aria-label="Close menu"
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          border: "none",
          background: "rgba(15, 23, 42, 0.35)",
          backdropFilter: "blur(2px)",
          zIndex: 18,
          cursor: "pointer",
        }}
      />
    )}
    <aside style={{
      width: sidebarWidth,
      maxWidth: "86vw",
      height: "100vh",
      background: bg,
      borderRight: `1px solid ${border}`,
      display: "flex", flexDirection: "column",
      position: "fixed", left: 0, top: 0, zIndex: 20,
      transform: show ? "translateX(0)" : "translateX(-100%)",
      transition: "transform 220ms ease",
      visibility: show ? "visible" : "hidden",
      pointerEvents: show ? "auto" : "none",
      boxShadow: !isDesktop && show ? "0 20px 40px rgba(15,23,42,0.25)" : "none",
    }}>
      {/* Logo */}
      <div style={{ padding: "22px 22px 18px", display: "flex", alignItems: "center", gap: 10 }}>
        <XisobLogo size={32} dark={dark} />
        <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
          <div style={{
            fontSize: 18, fontWeight: 700, letterSpacing: -0.3,
            color: textStrong, fontFamily: "'Fraunces', 'Instrument Serif', serif",
          }}>Xisob</div>
          <div style={{ fontSize: 10.5, color: textMuted, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600, marginTop: 2 }}>
            {t("brand.company")}
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav id="tour-sidebar-nav" style={{ padding: "10px 10px", flex: 1, overflowY: "auto" }}>
        <div style={{
          fontSize: 10, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase",
          color: textMuted, padding: "10px 12px 8px",
        }}>{t("brand.workspace")}</div>
        {NAV.map((item) => {
          const active = page === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 11,
                padding: "10px 12px", marginBottom: 2,
                background: active ? activeBg : "transparent",
                border: "none", borderRadius: 8,
                borderLeft: active ? "3px solid #10B981" : "3px solid transparent",
                paddingLeft: active ? 12 : 15,
                color: active ? (dark ? "#34D399" : "#047857") : textStrong,
                fontSize: 13.5, fontWeight: active ? 600 : 500,
                cursor: "pointer",
                transition: "background 120ms, color 120ms",
                textAlign: "left",
                fontFamily: "inherit",
              }}
              onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = hoverBg; }}
              onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
            >
              <Icon name={item.icon} size={17} />
              {t(item.key) || item.label}
            </button>
          );
        })}

        {/* Decorative suzani motif */}
        <div style={{
          margin: "24px 15px 0", padding: "16px 14px",
          background: dark ? "rgba(16,185,129,0.06)" : "#ECFDF5",
          borderRadius: 10,
          border: `1px dashed ${dark ? "rgba(16,185,129,0.2)" : "#A7F3D0"}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
            <Icon name="sparkles" size={14} style={{ color: "#10B981" }} />
            <span style={{ fontSize: 11.5, fontWeight: 700, color: dark ? "#34D399" : "#047857", textTransform: "uppercase", letterSpacing: 1 }}>
              {t("brand.tg.label")}
            </span>
          </div>
          <div style={{ fontSize: 12, color: textMuted, lineHeight: 1.45 }}>
            {t("brand.tg.body")}
          </div>
        </div>
      </nav>

      <div id="tour-sidebar-theme" style={{ padding: "10px 14px 12px", borderTop: `1px solid ${border}` }}>
        <div style={{ fontSize: 10.5, color: textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          {t("tw.sidebar")}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6, marginBottom: 10 }}>
          {[
            { key: "dark", label: t("tw.dark") },
            { key: "light", label: t("tw.light") },
            { key: "system", label: t("tw.system") },
          ].map((opt) => (
            <button key={opt.key} onClick={() => setTweak("sidebarTheme", opt.key)} style={{
              padding: "6px 4px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              fontSize: 11.5,
              fontWeight: 600,
              fontFamily: "inherit",
              background: tweaks.sidebarTheme === opt.key ? "#10B981" : (dark ? "#1E293B" : "#F1F5F9"),
              color: tweaks.sidebarTheme === opt.key ? "white" : textStrong,
            }}>{opt.label}</button>
          ))}
        </div>

        <div style={{ fontSize: 10.5, color: textMuted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          {t("tw.language")}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {[
            { key: "en", label: "EN" },
            { key: "ru", label: "RU" },
            { key: "uz", label: "UZ" },
          ].map((opt) => (
            <button key={opt.key} onClick={() => setLocale(opt.key)} style={{
              padding: "6px 4px",
              borderRadius: 7,
              border: "none",
              cursor: "pointer",
              fontSize: 11.5,
              fontWeight: 700,
              fontFamily: "inherit",
              background: locale === opt.key ? "#10B981" : (dark ? "#1E293B" : "#F1F5F9"),
              color: locale === opt.key ? "white" : textStrong,
            }}>{opt.label}</button>
          ))}
        </div>
      </div>

      {/* User footer */}
      <div style={{
        padding: "14px 18px", borderTop: `1px solid ${border}`,
        display: "flex", alignItems: "center",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: textStrong, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {myName || (myPhone || me?.phone || "User").replace("+998 ", "")}
          </div>
          {(myName && (myPhone || me?.phone)) && (
            <div style={{ fontSize: 11, color: textMuted, marginTop: 1 }}>{myPhone || me?.phone}</div>
          )}
        </div>
      </div>
    </aside>
    </>
  );
}

function Header({ page, onAdd, onToggleSidebar, showSidebarToggle }) {
  const { t } = useT();
  const today = new Date();
  const dateStr = fmtDate(today.toISOString());
  const { isMobile } = useViewport();
  const dowStr = new Intl.DateTimeFormat(
    window.getXisobLocale ? (window.getXisobLocale() === "uz" ? "uz-UZ" : window.getXisobLocale() === "en" ? "en-US" : "ru-RU") : "ru-RU",
    { weekday: "long" }
  ).format(today);

  const pageInfo = {
    overview: { title: t("nav.overview"), sub: t("header.sub.overview") },
    transactions: { title: t("nav.transactions"), sub: t("header.sub.transactions") },
    analytics: { title: t("nav.analytics"), sub: t("header.sub.analytics") },
    categories: { title: t("nav.categories"), sub: t("header.sub.categories") },
    budgets: { title: t("nav.budgets"), sub: t("header.sub.budgets") },
  }[page];

  return (
    <header style={{
      height: isMobile ? 64 : 72, borderBottom: "1px solid var(--border-soft)",
      background: "var(--surface)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: isMobile ? "0 12px" : "0 24px",
      position: "sticky", top: 0, zIndex: 5,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 12, minWidth: 0 }}>
        {showSidebarToggle && (
          <button
            onClick={onToggleSidebar}
            aria-label="Open sidebar"
            style={{
              width: isMobile ? 34 : 36,
              height: isMobile ? 34 : 36,
              borderRadius: 9,
              border: "1px solid var(--border)",
              background: "var(--surface)",
              color: "var(--text-secondary)",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <Icon name="menu" size={16} />
          </button>
        )}
        <div style={{ minWidth: 0 }}>
        <div style={{
          fontSize: isMobile ? 17 : 22, fontWeight: 600, color: "var(--text-primary)",
          fontFamily: "'Fraunces', serif", letterSpacing: -0.5, lineHeight: 1,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{pageInfo.title}</div>
        {!isMobile && <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4, fontWeight: 500 }}>{pageInfo.sub}</div>}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? 8 : 14 }}>
        {!isMobile && (
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 12.5, color: "var(--text-primary)", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{dateStr}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{dowStr}</div>
          </div>
        )}
        {!isMobile && <div style={{ width: 1, height: 26, background: "var(--border)" }} />}
        <button
          id="tour-header-add"
          onClick={onAdd}
          style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: isMobile ? "8px 10px" : "10px 16px",
            background: "#10B981", color: "white", fontWeight: 600, fontSize: isMobile ? 12 : 13,
            border: "none", borderRadius: 9,
            cursor: "pointer",
            boxShadow: "0 1px 2px rgba(16,185,129,0.25), 0 4px 12px rgba(16,185,129,0.2)",
            fontFamily: "inherit",
            transition: "transform 120ms, box-shadow 120ms",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 2px 4px rgba(16,185,129,0.3), 0 8px 20px rgba(16,185,129,0.25)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 1px 2px rgba(16,185,129,0.25), 0 4px 12px rgba(16,185,129,0.2)"; }}
        >
          <Icon name="plus" size={15} strokeWidth={2.5} />
          {isMobile ? t("common.add") : t("header.addTx")}
        </button>
      </div>
    </header>
  );
}

// Tweaks panel
function TweaksPanel() {
  const { tweaks, setTweak, tweaksOpen } = useApp();
  if (!tweaksOpen) return null;

  const Row = ({ label, children }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #F1F5F9" }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: "#475569" }}>{label}</div>
      {children}
    </div>
  );

  const Toggle = ({ value, onChange }) => (
    <button onClick={() => onChange(!value)} style={{
      width: 36, height: 20, borderRadius: 999,
      background: value ? "#10B981" : "#CBD5E1",
      border: "none", cursor: "pointer", padding: 0, position: "relative",
      transition: "background 160ms",
    }}>
      <div style={{
        width: 16, height: 16, borderRadius: "50%", background: "white",
        position: "absolute", top: 2, left: value ? 18 : 2,
        transition: "left 160ms",
        boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
      }} />
    </button>
  );

  return (
    <div style={{
      position: "fixed", right: 20, bottom: 20, zIndex: 50,
      width: 280, background: "white",
      border: "1px solid #E2E8F0", borderRadius: 14,
      boxShadow: "0 20px 50px rgba(15,23,42,0.15)",
      overflow: "hidden",
    }}>
      <div style={{
        padding: "14px 18px", background: "#0F172A", color: "white",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <Icon name="sparkles" size={15} style={{ color: "#10B981" }} />
        <div style={{ fontSize: 13, fontWeight: 600 }}>Tweaks</div>
      </div>
      <div style={{ padding: "6px 18px 16px" }}>
        <Row label="Empty state">
          <Toggle value={tweaks.emptyState} onChange={(v) => setTweak("emptyState", v)} />
        </Row>
        <Row label="Sidebar theme">
          <div style={{ display: "flex", gap: 6 }}>
            {["light", "dark", "system"].map((v) => (
              <button key={v} onClick={() => setTweak("sidebarTheme", v)} style={{
                padding: "5px 11px", fontSize: 11.5, fontWeight: 600,
                background: tweaks.sidebarTheme === v ? "#0F172A" : "#F1F5F9",
                color: tweaks.sidebarTheme === v ? "white" : "#475569",
                border: "none", borderRadius: 7, cursor: "pointer",
                fontFamily: "inherit",
                textTransform: "capitalize",
              }}>{v}</button>
            ))}
          </div>
        </Row>
      </div>
    </div>
  );
}

window.Sidebar = Sidebar;
window.Header = Header;
window.TweaksPanel = TweaksPanel;
window.XisobLogo = XisobLogo;
