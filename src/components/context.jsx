// App-wide context: handles user, transactions CRUD, categories, budgets, tweaks

const AppContext = React.createContext(null);
const useApp = () => React.useContext(AppContext);

function AppProvider({ children }) {
  const seed = window.XisobSeed;
  const API_BASE = window.XISOB_API_BASE || "http://localhost:8000/api";

  const getCodeFromPath = React.useCallback(() => {
    const parts = window.location.pathname.split("/").filter(Boolean);
    if (parts[0] === "dashboard" && parts[1]) return parts[1];
    return "";
  }, []);

  const [userCode, setUserCode] = React.useState(getCodeFromPath());
  
  React.useEffect(() => {
    const handlePopState = () => setUserCode(getCodeFromPath());
    window.addEventListener("popstate", handlePopState);
    const originalPushState = window.history.pushState;
    window.history.pushState = function(...args) {
      originalPushState.apply(this, args);
      setUserCode(getCodeFromPath());
    };
    return () => {
      window.removeEventListener("popstate", handlePopState);
      window.history.pushState = originalPushState;
    };
  }, [getCodeFromPath]);


  const [transactions, setTransactions] = React.useState(seed.TRANSACTIONS);
  const [incomeCats, setIncomeCats] = React.useState(seed.INCOME_CATEGORIES);
  const [expenseCats, setExpenseCats] = React.useState(seed.EXPENSE_CATEGORIES);
  const [budgets, setBudgets] = React.useState(seed.BUDGETS);
  const [myPhone, setMyPhone] = React.useState(null);
  const [myName, setMyName] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(true);

  // Tweaks
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "emptyState": false,
    "sidebarTheme": "light"
  }/*EDITMODE-END*/;
  const [tweaks, setTweaks] = React.useState(() => {
    try {
      const saved = localStorage.getItem("xisob_tweaks");
      return saved ? { ...DEFAULTS, ...JSON.parse(saved) } : DEFAULTS;
    } catch { return DEFAULTS; }
  });
  const [tweaksOpen, setTweaksOpen] = React.useState(false);
  const [isSystemDark, setIsSystemDark] = React.useState(() => {
    try { return window.matchMedia("(prefers-color-scheme: dark)").matches; } catch (e) { return false; }
  });

  React.useEffect(() => {
    const onMessage = (e) => {
      const d = e.data || {};
      if (d.type === "__activate_edit_mode") setTweaksOpen(true);
      if (d.type === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMessage);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMessage);
  }, []);

  React.useEffect(() => {
    let mq;
    try {
      mq = window.matchMedia("(prefers-color-scheme: dark)");
      const onChange = (e) => setIsSystemDark(e.matches);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    } catch (e) {
      return undefined;
    }
  }, []);

  const setTweak = (key, value) => {
    setTweaks((t) => {
      const next = { ...t, [key]: value };
      try { localStorage.setItem("xisob_tweaks", JSON.stringify(next)); } catch {}
      return next;
    });
    window.parent.postMessage({ type: "__edit_mode_set_keys", edits: { [key]: value } }, "*");
  };

  const authHeaders = React.useMemo(() => ({
    "X-User-Code": userCode,
    "Content-Type": "application/json",
  }), [userCode]);

  const normalizeTransactions = React.useCallback((rows) => {
    if (!Array.isArray(rows)) return seed.TRANSACTIONS;
    return rows.map((tx) => {
      const amount = Number(tx.amount || 0);
      const currency = tx.currency || "UZS";
      const amountUZS = tx.amount_uzs ? Number(tx.amount_uzs) : (currency === "USD" ? amount * 12600 : amount);
      return {
        id: tx.id ? String(tx.id) : `tx-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: tx.type || "expense",
        amount,
        currency,
        amountUZS,
        categoryId: tx.category_id || tx.categoryId || "",
        categoryName: tx.category_name || tx.categoryName || "",
        categoryType: tx.category_type || tx.categoryType || tx.type || "",
        date: tx.date || new Date().toISOString(),
        note: tx.note || "",
        source: tx.source || "dashboard",
        addedByPhone: tx.added_by_phone || tx.addedByPhone || "",
        isMine: tx.is_mine !== undefined ? tx.is_mine : true,
        ownerCode: tx.owner_code || tx.ownerCode || tx.added_by_phone || userCode,
      };
    }).sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [seed.TRANSACTIONS, userCode]);

  const normalizeCategories = React.useCallback((rows, type, fallback) => {
    if (!Array.isArray(rows) || rows.length === 0) return fallback;
    
    const palette = type === "income" 
      ? ["#10B981", "#34D399", "#2DD4BF", "#06B6D4"] 
      : ["#F43F5E", "#F59E0B", "#3B82F6", "#8B5CF6", "#EC4899", "#06B6D4", "#FB923C", "#84CC16"];

    return rows
      .filter((c) => (c.type || c.category_type || "") === type)
      .map((c, idx) => {
        const id = c.id ? String(c.id) : `${type}-${Math.random().toString(36).slice(2, 8)}`;
        return {
          id,
          name: c.name,
          type,
          color: c.color || palette[idx % palette.length],
          icon: c.icon || "circle",
          locked: !!c.locked || !!c.is_default,
        };

      });
  }, []);


  const normalizeBudgets = React.useCallback((rows) => {
    if (!Array.isArray(rows)) return {};
    const mapped = {};
    rows.forEach((b) => {
      const categoryId = String(b.category_id || b.categoryId || "");
      if (!categoryId) return;
      // backend uses budget_limit; fallback to limit for flexibility
      const limit = b.budget_limit !== undefined ? b.budget_limit : b.limit;
      mapped[categoryId] = limit === null || limit === undefined ? null : Number(limit);
    });
    return mapped;
  }, []);

  const fetchAllTransactions = React.useCallback(async () => {
    // Load all transaction pages so bot-added entries appear without reload.
    let allRows = [];
    let page = 1;
    while (true) {
      const res = await axios.get(
        `${API_BASE}/transactions?page=${page}&page_size=100`,
        { headers: authHeaders }
      );
      const payload = res.data;
      const rows = Array.isArray(payload) ? payload : (payload?.items || payload?.results || payload?.data || []);
      allRows = allRows.concat(rows);
      const totalPages = payload?.total_pages ?? 1;
      if (page >= totalPages || rows.length === 0) break;
      page++;
    }
    return normalizeTransactions(allRows);
  }, [API_BASE, authHeaders, normalizeTransactions]);

  const areTransactionsEqual = (prev, next) => {
    if (!Array.isArray(prev) || !Array.isArray(next)) return false;
    if (prev.length !== next.length) return false;
    for (let i = 0; i < prev.length; i++) {
      const a = prev[i];
      const b = next[i];
      if (
        a.id !== b.id ||
        a.amount !== b.amount ||
        a.currency !== b.currency ||
        a.date !== b.date ||
        a.note !== b.note ||
        a.categoryId !== b.categoryId ||
        a.type !== b.type
      ) {
        return false;
      }
    }
    return true;
  };

  React.useEffect(() => {
    let mounted = true;
    const load = async () => {
      setIsLoading(true);
      try {
        const [meRes, catRes, budgetRes] = await Promise.allSettled([
          axios.get(`${API_BASE}/me`, { headers: authHeaders }),
          axios.get(`${API_BASE}/categories`, { headers: authHeaders }),
          axios.get(`${API_BASE}/budgets`, { headers: authHeaders }),
        ]);

        if (!mounted) return;

        // Me → phone
        if (meRes.status === "fulfilled") {
          const me = meRes.value?.data || {};
          setMyPhone(me.phone_number || me.phone || null);
          setMyName(me.full_name || me.name || "");
        }

        // Categories → backend returns { income: [...], expense: [...] }
        if (catRes.status === "fulfilled") {
          const data = catRes.value?.data || {};
          if (data.income || data.expense) {
            const allRows = [...(data.income || []), ...(data.expense || [])];
            setIncomeCats(normalizeCategories(allRows, "income", seed.INCOME_CATEGORIES));
            setExpenseCats(normalizeCategories(allRows, "expense", seed.EXPENSE_CATEGORIES));
          } else {
            const rows = Array.isArray(data) ? data : (data.results || []);
            setIncomeCats(normalizeCategories(rows, "income", seed.INCOME_CATEGORIES));
            setExpenseCats(normalizeCategories(rows, "expense", seed.EXPENSE_CATEGORIES));
          }
        }

        // Budgets → backend returns { summary: {...}, budgets: [...] }
        if (budgetRes.status === "fulfilled") {
          const data = budgetRes.value?.data || {};
          const rows = Array.isArray(data) ? data : (data.budgets || data.results || []);
          setBudgets(normalizeBudgets(rows));
        }

        // Transactions
        const normalized = await fetchAllTransactions();
        if (mounted) setTransactions(normalized);

      } catch (e) {
        // Keep seed data if backend is not reachable during local frontend-only runs.
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [API_BASE, authHeaders, fetchAllTransactions, normalizeBudgets, normalizeCategories, seed.EXPENSE_CATEGORIES, seed.INCOME_CATEGORIES]);

  React.useEffect(() => {
    if (!userCode) return undefined;

    let mounted = true;
    let isSyncing = false;

    const syncTransactionsSilently = async () => {
      if (isSyncing) return;
      isSyncing = true;
      try {
        const next = await fetchAllTransactions();
        if (!mounted) return;
        setTransactions((prev) => (areTransactionsEqual(prev, next) ? prev : next));
      } catch (e) {
        // Keep current UI state if a sync attempt fails.
      } finally {
        isSyncing = false;
      }
    };

    const intervalId = window.setInterval(syncTransactionsSilently, 1000);
    const onFocus = () => { syncTransactionsSilently(); };
    const onVisibility = () => {
      if (!document.hidden) syncTransactionsSilently();
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibility);

    // Run an immediate silent sync so users see latest bot entries quickly.
    syncTransactionsSilently();

    return () => {
      mounted = false;
      window.clearInterval(intervalId);
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fetchAllTransactions, userCode]);

  // Effective data — if emptyState tweak is on, show nothing
  const effectiveTxs = tweaks.emptyState ? [] : transactions;
  const effectiveBudgets = tweaks.emptyState
    ? Object.fromEntries(Object.keys(budgets).map((k) => [k, null]))
    : budgets;

  const fmtDateOnly = (d) => d ? String(d).split("T")[0] : undefined;

  // Transaction CRUD
  const addTransaction = async (tx) => {
    const rate = 12600;

    const res = await axios.post(`${API_BASE}/transactions`, {
      type: tx.type,
      amount: tx.amount,
      currency: tx.currency,
      category_id: tx.categoryId,
      date: fmtDateOnly(tx.date),
      note: tx.note || undefined,
    }, { headers: authHeaders });

    const saved = res.data;
    const newTx = {
      id: String(saved.id),
      type: saved.type,
      amount: saved.amount,
      currency: saved.currency,
      amountUZS: saved.currency === "USD" ? saved.amount * rate : saved.amount,
      categoryId: String(saved.category_id),
      categoryName: saved.category_name || "",
      categoryType: saved.type,
      date: saved.date,
      note: saved.note || "",
      source: "dashboard",
      isMine: true,
      ownerCode: userCode,
    };

    setTransactions((t) => [newTx, ...t].sort((a, b) => new Date(b.date) - new Date(a.date)));
    return newTx;
  };

  const updateTransaction = async (id, patch) => {
    await axios.put(`${API_BASE}/transactions/${id}`, {
      type: patch.type,
      amount: patch.amount,
      currency: patch.currency,
      category_id: patch.categoryId,
      date: fmtDateOnly(patch.date),
      note: patch.note || undefined,
    }, { headers: authHeaders });

    setTransactions((t) => t.map((x) => {
      if (x.id !== id) return x;
      const merged = { ...x, ...patch };
      const rate = 12600;
      merged.amountUZS = merged.currency === "USD" ? merged.amount * rate : merged.amount;
      return merged;
    }).sort((a, b) => new Date(b.date) - new Date(a.date)));
  };

  const deleteTransaction = async (id) => {
    await axios.delete(`${API_BASE}/transactions/${id}`, { headers: authHeaders });
    setTransactions((t) => t.filter((x) => x.id !== id));
  };

  // Category management
  const allCats = [...incomeCats, ...expenseCats];
  const getCat = (id) => allCats.find((c) => c.id === id);

  const addCategory = async (name, type) => {
    const colors = ["#0EA5E9", "#8B5CF6", "#F59E0B", "#14B8A6", "#DC2626", "#65A30D"];
    const id = (type === "income" ? "inc-" : "exp-") + name.toLowerCase().replace(/\s+/g, "-") + "-" + Date.now().toString(36);
    const cat = {
      id, name, color: colors[Math.floor(Math.random() * colors.length)],
      icon: "circle", locked: false,
    };

    try {
      await axios.post(`${API_BASE}/categories`, { name, type }, { headers: authHeaders });
    } catch (e) {
      // Fall back to local optimistic behavior.
    }

    if (type === "income") setIncomeCats((c) => [...c, cat]);
    else setExpenseCats((c) => [...c, cat]);
    return cat;
  };
  const deleteCategory = async (id) => {
    try {
      await axios.delete(`${API_BASE}/categories/${id}`, { headers: authHeaders });
    } catch (e) {
      // Fall back to local optimistic behavior.
    }

    setIncomeCats((c) => c.filter((x) => x.id !== id));
    setExpenseCats((c) => c.filter((x) => x.id !== id));
  };

  const setBudget = async (categoryId, amount) => {
    try {
      await axios.put(`${API_BASE}/budgets/${categoryId}`, { amount_limit: amount, currency: "UZS" }, { headers: authHeaders });
    } catch (e) {
      // Fall back to local optimistic behavior.
    }

    setBudgets((b) => ({ ...b, [categoryId]: amount }));
  };

  const resolvedTheme = tweaks.sidebarTheme === "system"
    ? (isSystemDark ? "dark" : "light")
    : tweaks.sidebarTheme;

  const value = {
    userCode,
    team: seed.TEAM,
    transactions: effectiveTxs,
    rawTransactions: transactions,
    incomeCats, expenseCats, allCats, getCat,
    budgets: effectiveBudgets,
    addTransaction, updateTransaction, deleteTransaction,
    addCategory, deleteCategory, setBudget,
    tweaks, setTweak, tweaksOpen,
    resolvedTheme,
    myPhone,
    myName,
    isLoading,
    isEmpty: tweaks.emptyState,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

window.AppContext = AppContext;
window.AppProvider = AppProvider;
window.useApp = useApp;
