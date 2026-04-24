// Analytics, Categories, Budgets pages

function AnalyticsPage() {
  const { transactions, getCat, allCats, isEmpty } = useApp();
  const { isMobile, isTablet } = useViewport();
  const [period, setPeriod] = React.useState("month");

  const today = new Date();

  const periodStart = React.useMemo(() => {
    const d = new Date(today);
    if (period === "week") d.setDate(d.getDate() - 7);
    else if (period === "month") d.setMonth(d.getMonth() - 1);
    else if (period === "quarter") d.setMonth(d.getMonth() - 3);
    else d.setFullYear(d.getFullYear() - 1);
    return d;
  }, [period]);

  const prevStart = React.useMemo(() => {
    const d = new Date(periodStart);
    const span = today - periodStart;
    return new Date(d.getTime() - span);
  }, [periodStart]);

  const inPeriod = transactions.filter((t) => new Date(t.date) >= periodStart && new Date(t.date) <= today);
  const inPrev = transactions.filter((t) => new Date(t.date) >= prevStart && new Date(t.date) < periodStart);

  if (isEmpty || inPeriod.length < 5) return <AnalyticsEmpty />;

  // Line chart: income vs expense over time (aggregated by bucket)
  const bucketCount = period === "week" ? 7 : period === "month" ? 10 : period === "quarter" ? 12 : 12;
  const span = today - periodStart;
  const bucketSize = span / bucketCount;
  const timeSeries = [];
  for (let i = 0; i < bucketCount; i++) {
    const bStart = new Date(periodStart.getTime() + i * bucketSize);
    const bEnd = new Date(periodStart.getTime() + (i + 1) * bucketSize);
    const txs = inPeriod.filter((t) => { const d = new Date(t.date); return d >= bStart && d < bEnd; });
    timeSeries.push({
      label: fmtDate(bStart.toISOString(), { short: true }),
      income: txs.filter((t) => t.type === "income").reduce((s, t) => s + t.amountUZS, 0) / 1_000_000,
      expense: txs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountUZS, 0) / 1_000_000,
    });
  }

  // Top 5 by category
  const topBy = (type) => {
    const g = {};
    inPeriod.filter((t) => t.type === type).forEach((t) => {
      g[t.categoryId] = (g[t.categoryId] || 0) + t.amountUZS;
    });
    return Object.entries(g)
      .map(([id, amount]) => ({ id, name: getCat(id)?.name, color: getCat(id)?.color, amount: amount / 1_000_000 }))
      .sort((a, b) => b.amount - a.amount).slice(0, 5);
  };
  const topExpenses = topBy("expense");
  const topIncomes = topBy("income");

  // Category breakdown table
  const breakdown = [];
  const totalPeriod = inPeriod.reduce((s, t) => s + (t.type === "expense" ? t.amountUZS : 0), 0);
  const byCat = {}, byCatCount = {}, byCatPrev = {};
  inPeriod.filter((t) => t.type === "expense").forEach((t) => {
    byCat[t.categoryId] = (byCat[t.categoryId] || 0) + t.amountUZS;
    byCatCount[t.categoryId] = (byCatCount[t.categoryId] || 0) + 1;
  });
  inPrev.filter((t) => t.type === "expense").forEach((t) => {
    byCatPrev[t.categoryId] = (byCatPrev[t.categoryId] || 0) + t.amountUZS;
  });
  Object.entries(byCat).forEach(([id, amt]) => {
    const prev = byCatPrev[id] || 0;
    breakdown.push({
      id, name: getCat(id)?.name, color: getCat(id)?.color,
      amount: amt, pct: (amt / totalPeriod) * 100, count: byCatCount[id],
      trend: prev === 0 ? null : ((amt - prev) / prev) * 100,
    });
  });
  breakdown.sort((a, b) => b.amount - a.amount);

  // Day of week
  const dow = [0, 0, 0, 0, 0, 0, 0];
  inPeriod.forEach((t) => { dow[new Date(t.date).getDay()]++; });
  const dowMax = Math.max(...dow);
  const dowLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const dowData = dowLabels.map((l, i) => ({ day: l, count: dow[i] }));

  const avgSize = inPeriod.reduce((s, t) => s + t.amountUZS, 0) / inPeriod.length;

  return (
    <div style={{ padding: isMobile ? "14px 12px 24px" : isTablet ? "20px 16px 30px" : "24px 36px 40px", maxWidth: 1440, margin: "0 auto" }}>
      {/* Period selector */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: 10, marginBottom: 18 }}>
        <div style={{ display: "flex", flexWrap: "wrap", padding: 4, background: "white", border: "1px solid #EEF2F7", borderRadius: 10 }}>
          {[
            { k: "week", l: "This Week" }, { k: "month", l: "This Month" },
            { k: "quarter", l: "This Quarter" }, { k: "year", l: "This Year" },
          ].map((o) => (
            <button key={o.k} onClick={() => setPeriod(o.k)} style={{
              padding: "7px 14px", background: period === o.k ? "#0F172A" : "transparent",
              color: period === o.k ? "white" : "#64748B",
              border: "none", borderRadius: 7, fontSize: 12.5, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit", transition: "all 150ms",
            }}>{o.l}</button>
          ))}
        </div>
        <div style={{ fontSize: 12, color: "#64748B" }}>
          <span style={{ color: "#0F172A", fontWeight: 600 }}>{inPeriod.length}</span> transactions in period
        </div>
      </div>

      {/* Row 1: Line chart */}
      <Panel title="Income vs Expenses over time" subtitle={`Millions UZS · ${inPeriod.length} transactions`} action={<LegendDots />}>
        <div style={{ height: 280, padding: "8px 14px 0" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={timeSeries} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 4" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10.5 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 10.5 }} />
              <Tooltip content={<LightTooltip unit="M UZS" />} />
              <Line type="monotone" dataKey="income" stroke="#10B981" strokeWidth={2.5} dot={{ fill: "#10B981", r: 3 }} activeDot={{ r: 5 }} />
              <Line type="monotone" dataKey="expense" stroke="#F43F5E" strokeWidth={2.5} dot={{ fill: "#F43F5E", r: 3 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      {/* Row 2 */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20, marginTop: 20 }}>
        <TopCategoriesBar title="Top 5 expense categories" data={topExpenses} tone="expense" />
        <TopCategoriesBar title="Top 5 income categories" data={topIncomes} tone="income" />
      </div>

      {/* Row 3: Category breakdown table */}
      <div style={{ marginTop: 20 }}>
        <Panel title="Category breakdown" subtitle="Expense categories, sorted by spend">
          <div style={{ overflowX: "auto" }}>
          <div style={{ minWidth: isMobile ? 700 : 760, display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 100px 120px", padding: "12px 16px", borderBottom: "1px solid #F1F5F9", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#94A3B8" }}>
            <div>Category</div>
            <div style={{ textAlign: "right" }}>Total</div>
            <div>Share</div>
            <div style={{ textAlign: "right" }}>Count</div>
            <div style={{ textAlign: "right" }}>Trend</div>
          </div>
          {breakdown.map((row) => (
            <div key={row.id} style={{ minWidth: isMobile ? 700 : 760, display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 100px 120px", padding: "13px 16px", borderBottom: "1px solid #F8FAFC", alignItems: "center", fontSize: 13 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 8, height: 8, borderRadius: 2, background: row.color }} />
                <span style={{ fontWeight: 500, color: "#0F172A" }}>{row.name}</span>
              </div>
              <div style={{ textAlign: "right", fontVariantNumeric: "tabular-nums", fontWeight: 600, color: "#0F172A" }}>
                {fmtUZS(row.amount)}<span style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 500, marginLeft: 4 }}>UZS</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ flex: 1, height: 5, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ width: `${row.pct}%`, height: "100%", background: row.color, transition: "width 800ms" }} />
                </div>
                <span style={{ fontSize: 11.5, color: "#475569", fontVariantNumeric: "tabular-nums", minWidth: 38, textAlign: "right" }}>{row.pct.toFixed(1)}%</span>
              </div>
              <div style={{ textAlign: "right", color: "#475569", fontVariantNumeric: "tabular-nums" }}>{row.count}</div>
              <div style={{ textAlign: "right" }}><DeltaPill value={row.trend} invert /></div>
            </div>
          ))}
          </div>
        </Panel>
      </div>

      {/* Row 4 */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.6fr 1fr", gap: 20, marginTop: 20 }}>
        <Panel title="Busiest day of the week" subtitle="When your team logs the most transactions">
          <div style={{ padding: "14px 22px 20px" }}>
            {dowData.map((d) => (
              <div key={d.day} style={{ display: "grid", gridTemplateColumns: "40px 1fr 40px", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ fontSize: 11.5, color: "#64748B", fontWeight: 600 }}>{d.day}</div>
                <div style={{ height: 18, background: "#F8FAFC", borderRadius: 5, overflow: "hidden", position: "relative" }}>
                  <div style={{ width: `${(d.count / dowMax) * 100}%`, height: "100%", background: d.count === dowMax ? "#10B981" : "#CBD5E1", borderRadius: 5, transition: "width 800ms ease-out" }} />
                </div>
                <div style={{ fontSize: 11.5, color: "#0F172A", fontVariantNumeric: "tabular-nums", fontWeight: 600, textAlign: "right" }}>{d.count}</div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="Average transaction size" subtitle="Across all types in this period">
          <div style={{ padding: "24px 22px 28px" }}>
            <div style={{
              fontSize: 44, fontWeight: 500, color: "#0F172A",
              fontFamily: "'Fraunces', serif", letterSpacing: -1.5,
              fontVariantNumeric: "tabular-nums", lineHeight: 1,
            }}>
              {fmtCompact(avgSize)}
              <span style={{ fontSize: 18, color: "#94A3B8", fontWeight: 400, marginLeft: 6, letterSpacing: -0.5 }}>UZS</span>
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 10 }}>
              Exact: <span style={{ color: "#0F172A", fontWeight: 600, fontVariantNumeric: "tabular-nums" }}>{fmtUZS(avgSize)} UZS</span>
            </div>
            <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid #F1F5F9", fontSize: 11.5, color: "#64748B", lineHeight: 1.5 }}>
              Typical expense sits in the <span style={{ color: "#0F172A", fontWeight: 600 }}>{fmtCompact(avgSize * 0.6)}–{fmtCompact(avgSize * 1.4)}</span> UZS range.
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function TopCategoriesBar({ title, data, tone }) {
  const max = Math.max(...data.map((d) => d.amount), 1);
  return (
    <Panel title={title} subtitle={`Top ${data.length} of ${data.length + 1} categories`}>
      <div style={{ padding: "14px 22px 20px" }}>
        {data.map((d, i) => (
          <div key={d.id} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12.5 }}>
                <div style={{ width: 16, height: 16, borderRadius: 4, background: `${d.color}22`, color: d.color, display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700 }}>{i + 1}</div>
                <span style={{ fontWeight: 500, color: "#0F172A" }}>{d.name}</span>
              </div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>
                {d.amount.toFixed(1)}<span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}> M</span>
              </div>
            </div>
            <div style={{ height: 8, background: "#F8FAFC", borderRadius: 4, overflow: "hidden" }}>
              <div style={{ width: `${(d.amount / max) * 100}%`, height: "100%", background: d.color, borderRadius: 4, transition: "width 800ms ease-out" }} />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

function AnalyticsEmpty() {
  return (
    <div style={{ padding: "80px 36px", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ width: 80, height: 80, margin: "0 auto 20px", borderRadius: 20, background: "#F1F5F9", display: "grid", placeItems: "center", color: "#64748B" }}>
          <Icon name="chart" size={34} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 500, color: "#0F172A", fontFamily: "'Fraunces', serif", letterSpacing: -0.5, margin: "0 0 8px" }}>Not enough data yet</h2>
        <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.55, margin: 0 }}>
          Log at least 5 transactions to see your financial patterns — trends, categories, and team velocity.
        </p>
      </div>
    </div>
  );
}

// ---- CATEGORIES ----

function CategoriesPage() {
  const { incomeCats, expenseCats, transactions, addCategory, deleteCategory } = useApp();
  const toast = useToast();
  const { isMobile, isTablet } = useViewport();
  const { t } = useT();

  const countByCat = {};
  transactions.forEach((t) => { countByCat[t.categoryId] = (countByCat[t.categoryId] || 0) + 1; });

  return (
    <div style={{ padding: isMobile ? "14px 12px 24px" : isTablet ? "20px 16px 30px" : "24px 36px 40px", maxWidth: 1280, margin: "0 auto" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 20 }}>
        <CategoryColumn
          title="Income categories" tone="income"
          cats={incomeCats} counts={countByCat}
          onAdd={(n) => { addCategory(n, "income"); toast.push(`"${n}" added`); }}
          onDelete={(id, name) => { deleteCategory(id); toast.push(`"${name}" removed`, "info"); }}
        />
        <CategoryColumn
          title="Expense categories" tone="expense"
          cats={expenseCats} counts={countByCat}
          onAdd={(n) => { addCategory(n, "expense"); toast.push(`"${n}" added`); }}
          onDelete={(id, name) => { deleteCategory(id); toast.push(`"${name}" removed`, "info"); }}
        />
      </div>

      <div style={{ marginTop: 20, padding: "14px 20px", background: "white", border: "1px solid #EEF2F7", borderRadius: 12, display: "flex", alignItems: "center", gap: 10, fontSize: 12.5, color: "#475569" }}>
        <Icon name="info" size={15} style={{ color: "#64748B" }} />
        <div>{t("cat.info")}</div>
      </div>
    </div>
  );
}

function CategoryColumn({ title, cats, counts, onAdd, onDelete, tone }) {
  const [adding, setAdding] = React.useState(false);
  const [name, setName] = React.useState("");
  const accent = tone === "income" ? "#10B981" : "#F43F5E";

  const submit = () => {
    const n = name.trim();
    if (n) { onAdd(n); setName(""); setAdding(false); }
  };

  return (
    <div style={{ background: "white", border: "1px solid #EEF2F7", borderRadius: 14, overflow: "hidden" }}>
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #F8FAFC", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: `${accent}18`, color: accent, display: "grid", placeItems: "center" }}>
            <Icon name={tone === "income" ? "arrow-up" : "arrow-down"} size={15} strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{title}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>{cats.length} total</div>
          </div>
        </div>
      </div>
      <div style={{ padding: "8px 0" }}>
        {cats.map((c) => {
          const count = counts[c.id] || 0;
          const canDelete = !c.locked && count === 0;
          return (
            <div key={c.id} style={{ display: "grid", gridTemplateColumns: "14px 1fr auto auto", gap: 12, alignItems: "center", padding: "10px 20px", borderBottom: "1px solid #F8FAFC" }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: c.color }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 13, color: "#0F172A", fontWeight: 500 }}>{c.name}</span>
                {c.locked && <Icon name="lock" size={11} style={{ color: "#94A3B8" }} />}
              </div>
              <div style={{ fontSize: 11.5, color: "#64748B", fontVariantNumeric: "tabular-nums" }}>
                {count} {count === 1 ? "transaction" : "transactions"}
              </div>
              <button
                disabled={!canDelete}
                onClick={() => canDelete && onDelete(c.id, c.name)}
                title={c.locked ? "Default category — can't delete" : count > 0 ? "Has transactions — can't delete" : "Delete"}
                style={iconBtn("#E11D48", "transparent", !canDelete)}
              ><Icon name="trash" size={12} /></button>
            </div>
          );
        })}
        {adding ? (
          <div style={{ padding: "10px 20px", display: "flex", gap: 8, alignItems: "center", background: "#F8FAFC" }}>
            <input autoFocus value={name} onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") submit(); if (e.key === "Escape") { setAdding(false); setName(""); } }}
              placeholder="Category name" style={{ ...inputStyle, padding: "7px 10px", fontSize: 12.5, flex: 1 }} />
            <button onClick={submit} style={{ padding: "7px 12px", background: accent, color: "white", border: "none", borderRadius: 7, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Add</button>
            <button onClick={() => { setAdding(false); setName(""); }} style={{ padding: "7px 10px", background: "transparent", color: "#64748B", border: "1px solid #E2E8F0", borderRadius: 7, fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}>Cancel</button>
          </div>
        ) : (
          <button onClick={() => setAdding(true)} style={{
            width: "100%", padding: "11px 20px", background: "transparent",
            border: "none", borderTop: "1px dashed #E2E8F0",
            color: "#475569", fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}><Icon name="plus" size={13} strokeWidth={2.5} /> Add category</button>
        )}
      </div>
    </div>
  );
}

// ---- BUDGETS ----

function BudgetsPage({ onAdd }) {
  const { expenseCats, budgets, transactions, setBudget, isEmpty, resolvedTheme } = useApp();
  const dark = resolvedTheme === "dark";
  const toast = useToast();
  const { isMobile, isTablet } = useViewport();
  const { t } = useT();
  const [editingId, setEditingId] = React.useState(null);
  const [draft, setDraft] = React.useState("");
  const [newCategoryId, setNewCategoryId] = React.useState("");
  const [newLimit, setNewLimit] = React.useState("");
  const [recentlyCreatedId, setRecentlyCreatedId] = React.useState(null);

  const parseBudgetAmount = (rawValue) => {
    const digitsOnly = String(rawValue ?? "").replace(/[^\d]/g, "");
    if (digitsOnly.length === 0) return NaN;
    return Number(digitsOnly);
  };

  const thisMonth = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`;
  const spentByCat = {};
  transactions.filter((t) => t.type === "expense" && monthKey(t.date) === thisMonth).forEach((t) => {
    spentByCat[t.categoryId] = (spentByCat[t.categoryId] || 0) + t.amountUZS;
  });

  const over = [], warn = [], setCount = { total: 0, set: 0 };
  expenseCats.forEach((c) => {
    if (c.name === "Other") return;
    setCount.total++;
    const b = budgets[c.id];
    if (b) setCount.set++;
    if (!b) return;
    const pct = ((spentByCat[c.id] || 0) / b) * 100;
    if (pct >= 100) over.push({ ...c, pct, spent: spentByCat[c.id] || 0, budget: b });
    else if (pct >= 70) warn.push({ ...c, pct, spent: spentByCat[c.id] || 0, budget: b });
  });

  const budgetedCats = expenseCats
    .filter((c) => c.name !== "Other")
    .filter((c) => {
      const b = budgets[c.id];
      return b !== null && b !== undefined;
    });

  const canCreateFor = expenseCats
    .filter((c) => c.name !== "Other")
    .filter((c) => budgets[c.id] === null || budgets[c.id] === undefined);

  const MAX_BUDGET = 1_000_000_000;

  const save = (catId) => {
    const amt = parseBudgetAmount(draft);
    if (!isNaN(amt) && amt >= 0) {
      if (amt > MAX_BUDGET) {
        toast.push("Maximum limit is 1,000,000,000 UZS", "error");
        return;
      }
      setBudget(catId, amt || null);
      toast.push(amt === 0 ? "Budget removed" : "Budget updated");
    }
    setEditingId(null); setDraft("");
  };

  const createBudget = () => {
    if (!newCategoryId) {
      toast.push("Please select a category", "error");
      return;
    }
    const amt = parseBudgetAmount(newLimit);
    if (isNaN(amt) || amt <= 0) {
      toast.push("Please enter a valid amount", "error");
      return;
    }
    if (amt > MAX_BUDGET) {
      toast.push("Maximum limit is 1,000,000,000 UZS", "error");
      return;
    }
    setBudget(newCategoryId, amt);
    setRecentlyCreatedId(newCategoryId);
    setTimeout(() => setRecentlyCreatedId(null), 700);
    setNewCategoryId("");
    setNewLimit("");
    toast.push("Budget updated");
  };

  return (
    <div style={{ padding: isMobile ? "14px 12px 24px" : isTablet ? "20px 16px 30px" : "24px 36px 40px", maxWidth: 1440, margin: "0 auto" }}>
      {/* Header text */}
      <div style={{ padding: isMobile ? "14px 12px" : "18px 22px", background: "var(--surface)", border: "1px solid var(--border-soft)", borderRadius: 14, marginBottom: 18, display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: 8 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", fontFamily: "'Fraunces', serif", letterSpacing: -0.3 }}>{t("bg.header.title")}</div>
          <div style={{ fontSize: 12.5, color: "var(--text-secondary)", marginTop: 2 }}>{t("bg.header.sub")}</div>
        </div>
        <div style={{ display: "flex", gap: 12, fontSize: 12, color: "var(--text-secondary)" }}>
          <div>{t("bg.set", { n: setCount.set, total: setCount.total })}</div>
        </div>
      </div>

      {/* Alert banners */}
      {(over.length > 0 || warn.length > 0) && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 18 }}>
          {over.length > 0 && (
            <Banner tone="danger" icon="alert"
              title={over.length === 1 ? t("bg.over.1", { n: over.length }) : t("bg.over.n", { n: over.length })}
              detail={over.map((c) => c.name).join(" · ")} />
          )}
          {warn.length > 0 && (
            <Banner tone="warn" icon="alert"
              title={warn.length === 1 ? t("bg.warn.1", { n: warn.length }) : t("bg.warn.n", { n: warn.length })}
              detail={warn.map((c) => c.name).join(" · ")} />
          )}
        </div>
      )}

      {/* Added budget boxes (top section) */}
      <div style={{ marginBottom: 18 }}>
        {budgetedCats.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {budgetedCats.map((c) => {
          const budget = budgets[c.id];
          const spent = spentByCat[c.id] || 0;
          const pct = budget ? (spent / budget) * 100 : 0;
          const state = !budget ? "unset" : pct >= 100 ? "over" : pct >= 90 ? "red" : pct >= 70 ? "amber" : "good";
          const colors = {
            good:  { bar: "#10B981", tint: "#ECFDF5" },
            amber: { bar: "#F59E0B", tint: "#FFFBEB" },
            red:   { bar: "#F97316", tint: "#FFF7ED" },
            over:  { bar: "#F43F5E", tint: "#FFF1F2" },
            unset: { bar: "#CBD5E1", tint: "#F8FAFC" },
          }[state];
          const editing = editingId === c.id;

            return (
              <div key={c.id} style={{
                background: "var(--surface)", border: `1px solid ${state === "over" ? (dark ? "#7F1D1D" : "#FECACA") : "var(--border-soft)"}`,
                borderRadius: 14, padding: "16px 18px",
                position: "relative", overflow: "hidden",
                animation: recentlyCreatedId === c.id ? "budgetCardIn 360ms cubic-bezier(0.2, 0.9, 0.2, 1)" : "none",
              }}>
                {state === "over" && <div style={{ position: "absolute", top: 10, right: 10, padding: "3px 8px", background: "#FFF1F2", color: "#E11D48", borderRadius: 999, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>Over budget</div>}

                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ width: 32, height: 32, borderRadius: 9, background: `${c.color}18`, color: c.color, display: "grid", placeItems: "center" }}>
                    <Icon name={c.icon} size={16} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", flex: 1 }}>{c.name}</div>
                  <button
                    onClick={() => { setBudget(c.id, null); toast.push("Budget removed"); }}
                    title="Delete budget"
                    style={{
                      width: 28, height: 28, borderRadius: 7, border: "1px solid #FEE2E2",
                      background: "#FFF1F2", color: "#F43F5E",
                      display: "grid", placeItems: "center",
                      cursor: "pointer", flexShrink: 0,
                    }}
                  >
                    <Icon name="trash" size={13} strokeWidth={2} />
                  </button>
                </div>

                {/* Amount display or edit */}
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>Monthly limit</div>
                  {editing ? (
                    <div style={{ display: "flex", gap: 6 }}>
                      <input autoFocus type="text" inputMode="numeric" autoComplete="off" spellCheck={false} value={draft} onChange={(e) => setDraft(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") save(c.id); if (e.key === "Escape") { setEditingId(null); setDraft(""); } }}
                        placeholder="0"
                        style={{ ...inputStyle, padding: "7px 10px", fontSize: 15, fontWeight: 600, fontFamily: "'Fraunces', serif" }} />
                      <button onClick={() => save(c.id)} style={{ padding: "0 11px", background: "#10B981", color: "white", border: "none", borderRadius: 7, cursor: "pointer" }}><Icon name="check" size={14} strokeWidth={2.5} /></button>
                    </div>
                  ) : (
                    <button onClick={() => { setEditingId(c.id); setDraft(budget ? String(budget) : ""); }} style={{
                      background: "transparent", border: "none", padding: 0, cursor: "pointer", fontFamily: "inherit",
                      display: "flex", alignItems: "baseline", gap: 6,
                    }}>
                      <div style={{ fontSize: 22, fontWeight: 500, color: budget ? "var(--text-primary)" : "var(--text-muted)", fontFamily: "'Fraunces', serif", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>
                        {budget ? fmtUZS(budget) : "Set limit"}
                      </div>
                      {budget && <div style={{ fontSize: 11.5, color: "#94A3B8" }}>UZS</div>}
                      <Icon name="edit" size={11} style={{ color: "#94A3B8", marginLeft: 4 }} />
                    </button>
                  )}
                </div>

                {/* Progress bar */}
                <div style={{ height: 7, background: colors.tint, borderRadius: 4, overflow: "hidden", marginBottom: 8 }}>
                  <div style={{
                    width: budget ? `${Math.min(100, pct)}%` : "0%",
                    height: "100%", background: colors.bar, borderRadius: 4,
                    transition: "width 900ms ease-out",
                  }} />
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11.5, fontVariantNumeric: "tabular-nums" }}>
                  {budget ? (
                    <>
                      <span style={{ color: "var(--text-secondary)" }}><span style={{ color: "var(--text-primary)", fontWeight: 600 }}>{fmtCompact(spent)}</span> of {fmtCompact(budget)} UZS</span>
                      <span style={{ color: state === "over" ? "#E11D48" : state === "red" ? "#F97316" : state === "amber" ? "#F59E0B" : "#059669", fontWeight: 600 }}>
                        {pct.toFixed(0)}%
                      </span>
                    </>
                  ) : (
                    <span style={{ color: "#94A3B8" }}>Click above to set a limit</span>
                  )}
                </div>
              </div>
            );
          })}
          </div>
        ) : (
          <BudgetsEmpty />
        )}
      </div>

      {/* Add-new-box section (bottom + prominent) */}
      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 16,
        padding: isMobile ? "14px 12px" : "16px 18px",
        boxShadow: dark ? "none" : "0 8px 22px rgba(15,23,42,0.05)",
      }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 14.5, fontWeight: 700, color: "var(--text-primary)", marginBottom: 3 }}>{t("bg.newBoxTitle")}</div>
          <div style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 1.4 }}>{t("bg.newBoxSub")}</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr auto", gap: 10, alignItems: "end" }}>
          <div>
            <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>
              {t("common.category")}
            </div>
            <select value={newCategoryId} onChange={(e) => setNewCategoryId(e.target.value)} style={{ ...inputStyle, width: "100%" }}>
              <option value="">{t("common.selectCategory")}</option>
              {canCreateFor.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>
              {t("bg.limit")}
            </div>
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              value={newLimit}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^\d]/g, "");
                if (digits === "") { setNewLimit(""); return; }
                const num = Number(digits);
                setNewLimit(String(Math.min(num, MAX_BUDGET)));
              }}
              placeholder={`Max ${MAX_BUDGET.toLocaleString()}`}
              style={{ ...inputStyle, width: "100%" }}
            />
          </div>
          <button
            onClick={createBudget}
            disabled={canCreateFor.length === 0}
            style={{
              width: isMobile ? "100%" : 160,
              padding: "10px 14px",
              background: canCreateFor.length === 0 ? "#CBD5E1" : "#0F172A",
              color: "white",
              border: "none",
              borderRadius: 9,
              fontSize: 12.5,
              fontWeight: 600,
              cursor: canCreateFor.length === 0 ? "not-allowed" : "pointer",
              fontFamily: "inherit",
            }}
          >
            {t("bg.create")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Banner({ tone, icon, title, detail }) {
  const style = {
    danger: { bg: "#FFF1F2", border: "#FECACA", fg: "#9F1239", iconBg: "#F43F5E" },
    warn:   { bg: "#FFFBEB", border: "#FDE68A", fg: "#92400E", iconBg: "#F59E0B" },
  }[tone];
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px 18px", background: style.bg, border: `1px solid ${style.border}`, borderRadius: 12 }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: style.iconBg, color: "white", display: "grid", placeItems: "center", flexShrink: 0 }}>
        <Icon name={icon} size={16} strokeWidth={2.5} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: style.fg }}>{title}</div>
        <div style={{ fontSize: 11.5, color: style.fg, opacity: 0.7, marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

function BudgetsEmpty() {
  return (
    <div style={{ padding: "80px 36px", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 420 }}>
        <div style={{ width: 80, height: 80, margin: "0 auto 20px", borderRadius: 20, background: "#ECFDF5", display: "grid", placeItems: "center", color: "#10B981" }}>
          <Icon name="target" size={34} />
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 500, color: "#0F172A", fontFamily: "'Fraunces', serif", letterSpacing: -0.5, margin: "0 0 8px" }}>No budget limits set</h2>
        <p style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.55, margin: 0 }}>
          Setting limits helps your team spend more consciously. Start with Salaries or Raw Materials — your biggest line items.
        </p>
      </div>
    </div>
  );
}

Object.assign(window, { AnalyticsPage, CategoriesPage, BudgetsPage });
