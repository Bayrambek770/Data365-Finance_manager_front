// Root App

function NotFoundPage() {
  return (
    <div style={{
      minHeight: "100vh", display: "grid", placeItems: "center",
      background: "#F5F7FB", fontFamily: "'Inter', sans-serif",
    }}>
      <div style={{ textAlign: "center", padding: "0 24px" }}>
        <div style={{
          width: 80, height: 80, borderRadius: 20, background: "#0F172A",
          display: "grid", placeItems: "center", margin: "0 auto 28px",
          boxShadow: "inset 0 0 0 1px rgba(16,185,129,0.25)",
        }}>
          <svg viewBox="0 0 24 24" width={50} height={50}>
            <path d="M4 4 L20 20 M20 4 L4 20" stroke="#10B981" strokeWidth="3.2" strokeLinecap="round" fill="none" />
          </svg>
        </div>
        <div style={{
          fontSize: 72, fontWeight: 700, color: "#0F172A", lineHeight: 1,
          fontFamily: "'Fraunces', serif", letterSpacing: -3, marginBottom: 12,
        }}>404</div>
        <div style={{ fontSize: 18, fontWeight: 600, color: "#0F172A", marginBottom: 8 }}>
          Invalid dashboard link
        </div>
        <div style={{ fontSize: 14, color: "#64748B", maxWidth: 360, margin: "0 auto", lineHeight: 1.6 }}>
          This URL doesn't include a valid user code.<br />
          Please use the link provided by your Xisob account, e.g.<br />
          <code style={{
            background: "#F1F5F9", padding: "2px 8px", borderRadius: 6,
            fontSize: 13, color: "#0F172A", fontFamily: "monospace",
          }}>/dashboard/YOUR_CODE</code>
        </div>
      </div>
    </div>
  );
}

function App() {
  const { isLoading, resolvedTheme, userCode } = useApp();
  const { isMobile, isTablet, isDesktop } = useViewport();

  if (!userCode) return <NotFoundPage />;

  const readPageFromPath = React.useCallback(() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const p = parts[2] || "overview";
    return ["overview", "transactions", "analytics", "categories", "budgets"].includes(p) ? p : "overview";
  }, []);

  const [page, setPage] = React.useState(readPageFromPath);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const pushPagePath = React.useCallback((nextPage) => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    const code = (parts[0] === "dashboard" && parts[1]) ? parts[1] : "";
    const nextPath = nextPage === "overview" ? `/dashboard/${code}` : `/dashboard/${code}/${nextPage}`;
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
  }, []);

  React.useEffect(() => {
    window.xisobNav = setPage;
    return () => { window.xisobNav = null; };
  }, []);

  React.useEffect(() => {
    pushPagePath(page);
    window.parent.postMessage({ screenChanged: page }, "*");
  }, [page, pushPagePath]);

  React.useEffect(() => {
    const onPopState = () => setPage(readPageFromPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, [readPageFromPath]);

  const openAdd = () => setModalOpen(true);

  React.useEffect(() => {
    if (isDesktop) setSidebarOpen(true);
    if (isTablet || isMobile) setSidebarOpen(false);
  }, [isDesktop, isTablet, isMobile]);

  React.useEffect(() => {
    const openedOverlay = !isDesktop && sidebarOpen;
    document.body.classList.toggle("sidebar-open", openedOverlay);
    return () => document.body.classList.remove("sidebar-open");
  }, [isDesktop, sidebarOpen]);

  React.useEffect(() => {
    document.body.setAttribute("data-theme", resolvedTheme);
    return () => document.body.removeAttribute("data-theme");
  }, [resolvedTheme]);

  const onNav = React.useCallback((nextPage) => {
    setPage(nextPage);
    if (!isDesktop) setSidebarOpen(false);
  }, [isDesktop]);

  const toggleSidebar = () => setSidebarOpen((v) => !v);

  return (
    <div style={{ minHeight: "100vh", background: "var(--app-bg)", color: "var(--text-primary)", display: "flex" }}>
      <Sidebar
        page={page}
        onNav={onNav}
        open={sidebarOpen}
        isDesktop={isDesktop}
        onClose={() => setSidebarOpen(false)}
      />
      <div style={{ marginLeft: isDesktop ? 240 : 0, flex: 1, minWidth: 0 }}>
        <Header
          page={page}
          onAdd={openAdd}
          onToggleSidebar={toggleSidebar}
          showSidebarToggle={!isDesktop}
        />
        <main data-screen-label={
          page === "overview" ? "01 Overview" :
          page === "transactions" ? "02 Transactions" :
          page === "analytics" ? "03 Analytics" :
          page === "categories" ? "04 Categories" :
          "05 Budgets"
        }>
          {isLoading ? <GlobalPageSkeleton /> : (
            <>
              {page === "overview" && <OverviewPage onAdd={openAdd} />}
              {page === "transactions" && <TransactionsPage />}
              {page === "analytics" && <AnalyticsPage />}
              {page === "categories" && <CategoriesPage />}
              {page === "budgets" && <BudgetsPage onAdd={openAdd} />}
            </>
          )}
        </main>
      </div>
      <AddTransactionModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <TweaksPanel />
      <OnboardingTour />
    </div>
  );
}

function GlobalPageSkeleton() {
  const { isMobile, isTablet } = useViewport();
  const cols = isMobile ? "1fr" : isTablet ? "repeat(2, minmax(0, 1fr))" : "repeat(3, minmax(0, 1fr))";
  return (
    <div style={{ padding: isMobile ? "16px 14px 24px" : isTablet ? "20px 20px 28px" : "24px 36px 40px", display: "grid", gap: 16 }}>
      <div style={{ display: "grid", gridTemplateColumns: cols, gap: 14 }}>
        <Skeleton h={88} r={12} />
        <Skeleton h={88} r={12} />
        <Skeleton h={88} r={12} />
      </div>
      <Skeleton h={280} r={16} />
      <Skeleton h={220} r={16} />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ToastProvider>
    <LocaleProvider>
      <AppProvider>
        <App />
      </AppProvider>
    </LocaleProvider>
  </ToastProvider>
);
