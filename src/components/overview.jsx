// Overview page — the flagship screen

const { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } = Recharts;

function OverviewPage({ onAdd }) {
  const { transactions, getCat, isEmpty, team } = useApp();
  const { isMobile, isTablet } = useViewport();

  if (isEmpty) return <OverviewEmpty onAdd={onAdd} />;

  // Compute stats
  const today = new Date();
  const curMonthKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const prevDate = new Date(today); prevDate.setMonth(prevDate.getMonth() - 1);
  const prevMonthKey = `${prevDate.getFullYear()}-${String(prevDate.getMonth() + 1).padStart(2, "0")}`;

  const curTxs = transactions.filter((t) => monthKey(t.date) === curMonthKey);
  const prevTxs = transactions.filter((t) => monthKey(t.date) === prevMonthKey);

  const sum = (list, type) => list.filter((t) => t.type === type).reduce((s, t) => s + t.amountUZS, 0);

  const income = sum(curTxs, "income");
  const expense = sum(curTxs, "expense");
  const net = income - expense;
  const prevIncome = sum(prevTxs, "income");
  const prevExpense = sum(prevTxs, "expense");
  const prevNet = prevIncome - prevExpense;

  const deltaPct = (cur, prev) => prev === 0 ? null : ((cur - prev) / Math.abs(prev)) * 100;
  const incomeDelta = deltaPct(income, prevIncome);
  const expenseDelta = deltaPct(expense, prevExpense);
  const netDelta = deltaPct(net, prevNet);

  // 6 months bar data
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(today); d.setMonth(d.getMonth() - i);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const mTxs = transactions.filter((t) => monthKey(t.date) === key);
    months.push({
      month: monthLabel(d.toISOString()),
      income: sum(mTxs, "income") / 1_000_000,
      expense: sum(mTxs, "expense") / 1_000_000,
      current: i === 0,
    });
  }

  // Daily sparkline for current month net
  const sparkData = [];
  const curDay = today.getDate();
  const monthPrefix = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  
  for (let d = 1; d <= curDay; d++) {
    const dayKey = `${monthPrefix}-${String(d).padStart(2, "0")}`;
    const dayTxs = transactions.filter((t) => t.date.startsWith(dayKey));
    const dayIn = dayTxs.filter((t) => t.type === "income").reduce((s, t) => s + t.amountUZS, 0);
    const dayOut = dayTxs.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountUZS, 0);
    sparkData.push({ day: d, net: (dayIn - dayOut) / 1_000_000 });
  }
  // running cumulative
  let run = 0;
  const cumulative = sparkData.map((p) => { run += p.net; return { day: p.day, value: run }; });

  // Expense breakdown for donut
  const expenseByCategory = {};
  curTxs.filter((t) => t.type === "expense").forEach((t) => {
    expenseByCategory[t.categoryId] = (expenseByCategory[t.categoryId] || 0) + t.amountUZS;
  });
  const donutData = Object.entries(expenseByCategory)
    .map(([catId, amt]) => ({ name: getCat(catId)?.name || catId, value: amt, color: getCat(catId)?.color || "#94A3B8", id: catId }))
    .sort((a, b) => b.value - a.value);
  const totalExpense = donutData.reduce((s, d) => s + d.value, 0);

  // Recent 8
  const recent = transactions.slice(0, 8);

  return (
    <div style={{ padding: isMobile ? "14px 12px 24px" : isTablet ? "20px 16px 30px" : "28px 36px 40px", maxWidth: 1440, margin: "0 auto" }}>
      {/* HERO: Net balance with sparkline */}
      <div id="tour-overview-hero" style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E293B 55%, #0F172A 100%)",
        borderRadius: isMobile ? 14 : 20, padding: isMobile ? "18px 14px" : isTablet ? "22px 20px" : "30px 34px",
        color: "white", position: "relative", overflow: "hidden",
        boxShadow: "0 1px 2px rgba(15,23,42,0.1), 0 20px 40px -20px rgba(15,23,42,0.4)",
      }}>
        {/* Suzani dot motif */}
        <div aria-hidden style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(16,185,129,0.12) 1px, transparent 0)",
          backgroundSize: "22px 22px", maskImage: "linear-gradient(to right, transparent, black 40%, black 60%, transparent)",
        }} />
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1.1fr", gap: isMobile ? 18 : 40, alignItems: "center", position: "relative" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", boxShadow: "0 0 0 4px rgba(16,185,129,0.2)" }} />
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 1.4, textTransform: "uppercase", color: "rgba(255,255,255,0.6)" }}>
                {monthLabel(today.toISOString())}
              </div>
            </div>
            <div style={{
              fontSize: isMobile ? 34 : isTablet ? 42 : 56, fontWeight: 500, letterSpacing: -2, lineHeight: 1,
              fontFamily: "'Fraunces', serif", fontVariantNumeric: "tabular-nums",
              color: net >= 0 ? "#FFFFFF" : "#FECACA",
              marginBottom: 6,
            }}>
              <AnimatedNumber value={net} /> <span style={{ fontSize: isMobile ? 16 : 22, color: "rgba(255,255,255,0.5)", fontWeight: 400, letterSpacing: -0.5 }}>UZS</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13 }}>
              <DeltaPill value={netDelta} dark invert={false} />
              <span style={{ color: "rgba(255,255,255,0.55)" }}>vs {fmtUZS(prevNet)} UZS in March</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, minmax(0, 1fr))", gap: isMobile ? 10 : 26, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <MiniStat label="Income" value={income} delta={incomeDelta} color="#34D399" />
              <MiniStat label="Expenses" value={expense} delta={expenseDelta} color="#FB7185" invertDelta />
              <MiniStat label="Transactions" value={curTxs.length} plain />
            </div>
          </div>

          {/* Sparkline area */}
          <div style={{ height: isMobile ? 160 : 200, position: "relative" }}>
            <div style={{ position: "absolute", top: 0, right: 0, display: "flex", gap: 16, fontSize: 11, color: "rgba(255,255,255,0.5)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                <div style={{ width: 8, height: 2, background: "#10B981", borderRadius: 1 }} /> Cumulative net
              </div>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={cumulative} margin={{ top: 24, right: 4, left: 0, bottom: 4 }}>
                <defs>
                  <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="day" hide />
                <YAxis hide domain={["dataMin", "dataMax"]} />
                <Tooltip content={<DarkTooltip unit="M UZS" />} cursor={{ stroke: "rgba(255,255,255,0.15)" }} />
                <Area type="monotone" dataKey="value" stroke="#10B981" strokeWidth={2} fill="url(#netGrad)" />
              </AreaChart>
            </ResponsiveContainer>
            <div style={{ position: "absolute", bottom: -4, left: 0, right: 0, display: "flex", justifyContent: "space-between", fontSize: 10, color: "rgba(255,255,255,0.35)", padding: "0 4px" }}>
              <span>{monthLabel(today.toISOString()).split(" ")[0]} 1</span><span>{curDay}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Second row: 6mo bars + donut */}
      <div style={{ display: "grid", gridTemplateColumns: isTablet || isMobile ? "1fr" : "1.4fr 1fr", gap: 20, marginTop: 20 }}>
        <Panel id="tour-overview-chart" title="Income vs Expenses" subtitle="Last 6 months, millions UZS" action={<LegendDots />}>
          <div style={{ height: 270, padding: "8px 8px 0" }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={months} barGap={4} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="2 4" stroke="#F1F5F9" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#94A3B8", fontSize: 11 }} />
                <Tooltip content={<LightTooltip unit="M UZS" />} cursor={{ fill: "rgba(15,23,42,0.03)" }} />
                <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} maxBarSize={24} />
                <Bar dataKey="expense" fill="#F43F5E" radius={[6, 6, 0, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel id="tour-overview-donut" title="Where money goes" subtitle="This month by category">
          {totalExpense > 0 ? (
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "170px 1fr", gap: 18, padding: "8px 16px 16px", minHeight: 270 }}>
              <div style={{ position: "relative" }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={donutData} dataKey="value" cx="50%" cy="50%" innerRadius={52} outerRadius={78} paddingAngle={2} stroke="none">
                      {donutData.map((d, i) => <Cell key={i} fill={d.color} />)}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", pointerEvents: "none" }}>
                  <div style={{ textAlign: "center" }}>
                    <div style={{ fontSize: 9.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Total</div>
                    <div style={{ fontSize: 17, fontWeight: 600, color: "#0F172A", fontFamily: "'Fraunces', serif", fontVariantNumeric: "tabular-nums", letterSpacing: -0.4 }}>
                      {fmtCompact(totalExpense)}
                    </div>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 7, fontSize: 12, overflow: "hidden" }}>
                {donutData.slice(0, 6).map((d) => {
                  const pct = (d.value / totalExpense) * 100;
                  return (
                    <div key={d.id} style={{ display: "grid", gridTemplateColumns: "10px 1fr auto", gap: 8, alignItems: "center" }}>
                      <div style={{ width: 9, height: 9, borderRadius: 2.5, background: d.color }} />
                      <div style={{ color: "#334155", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{d.name}</div>
                      <div style={{ color: "#0F172A", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{pct.toFixed(1)}%</div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div style={{ minHeight: 270, display: "grid", placeItems: "center" }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", border: "3px dashed #E2E8F0", margin: "0 auto 14px", display: "grid", placeItems: "center" }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", border: "3px dashed #CBD5E1" }} />
                </div>
                <div style={{ fontSize: 13, color: "#94A3B8", fontWeight: 500 }}>No expenses this month</div>
              </div>
            </div>
          )}
        </Panel>
      </div>

      {/* Third row: Recent + Team velocity */}
      <div style={{ display: "grid", gridTemplateColumns: isTablet || isMobile ? "1fr" : "1.4fr 1fr", gap: 20, marginTop: 20 }}>
        <Panel id="tour-overview-recent" title="Recent transactions" subtitle="Last 8 entries across team" action={<a href="#" onClick={(e) => { e.preventDefault(); window.xisobNav && window.xisobNav("transactions"); }} style={linkStyle}>View all →</a>}>
          <div style={{ padding: "4px 0 8px" }}>
            {recent.map((tx) => <TransactionRow key={tx.id} tx={tx} />)}
          </div>
        </Panel>

        <Panel title="Team activity" subtitle="Who logged what this month">
          <TeamActivity transactions={curTxs} />
        </Panel>
      </div>
    </div>
  );
}

// Animated number
function AnimatedNumber({ value }) {
  const v = useCountUp(value, 1100);
  return <span>{fmtUZS(v)}</span>;
}

function DeltaPill({ value, dark = false, invert = false }) {
  if (value === null || isNaN(value) || !isFinite(value)) {
    return <span style={{ fontSize: 12, color: dark ? "rgba(255,255,255,0.5)" : "#94A3B8" }}>—</span>;
  }
  const positive = invert ? value < 0 : value > 0;
  const neutral = Math.abs(value) < 0.5;
  const color = neutral ? (dark ? "rgba(255,255,255,0.6)" : "#64748B") : positive ? "#10B981" : "#F43F5E";
  const bg = dark
    ? (neutral ? "rgba(255,255,255,0.08)" : positive ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)")
    : (neutral ? "#F1F5F9" : positive ? "#ECFDF5" : "#FFF1F2");
  const sign = value > 0 ? "+" : "";
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 3,
      padding: "3px 8px", background: bg, color,
      borderRadius: 999, fontSize: 11.5, fontWeight: 600,
      fontVariantNumeric: "tabular-nums",
    }}>
      <Icon name={neutral ? "equal" : positive ? "arrow-up" : "arrow-down"} size={10} strokeWidth={3} />
      {sign}{value.toFixed(1)}%
    </span>
  );
}

function MiniStat({ label, value, delta, color = "#10B981", plain = false, invertDelta = false }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10.5, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 600, marginBottom: 4 }}>{label}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
        <div style={{ fontSize: 20, fontWeight: 500, color, fontFamily: "'Fraunces', serif", fontVariantNumeric: "tabular-nums", letterSpacing: -0.5 }}>
          {plain ? value : fmtCompact(value)}
        </div>
        {!plain && <DeltaPill value={delta} dark invert={invertDelta} />}
      </div>
    </div>
  );
}

function Panel({ id, title, subtitle, action, children, style = {} }) {
  const { isMobile } = useViewport();
  return (
    <div id={id} style={{
      background: "white", border: "1px solid #EEF2F7", borderRadius: 16,
      overflow: "hidden",
      ...style,
    }}>
      <div style={{ padding: isMobile ? "14px 14px 10px" : "18px 22px 12px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap", borderBottom: "1px solid #F8FAFC" }}>
        <div>
          <div style={{ fontSize: 13.5, fontWeight: 600, color: "#0F172A" }}>{title}</div>
          {subtitle && <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 2 }}>{subtitle}</div>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

const linkStyle = { fontSize: 12, fontWeight: 600, color: "#0F172A", textDecoration: "none" };

function LegendDots() {
  return (
    <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#64748B" }}>
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#10B981" }} />Income
      </span>
      <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
        <span style={{ width: 8, height: 8, borderRadius: 2, background: "#F43F5E" }} />Expense
      </span>
    </div>
  );
}

function LightTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 10, padding: "9px 12px", boxShadow: "0 8px 24px rgba(15,23,42,0.08)", fontSize: 12 }}>
      <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginTop: i === 0 ? 0 : 4 }}>
          <div style={{ width: 8, height: 8, borderRadius: 2, background: p.color }} />
          <span style={{ color: "#475569", textTransform: "capitalize", flex: 1 }}>{p.dataKey}</span>
          <span style={{ fontWeight: 600, fontVariantNumeric: "tabular-nums", color: "#0F172A" }}>
            {typeof p.value === "number" ? p.value.toFixed(1) : p.value} {unit || ""}
          </span>
        </div>
      ))}
    </div>
  );
}

function DarkTooltip({ active, payload, label, unit }) {
  if (!active || !payload || !payload.length) return null;
  return (
    <div style={{ background: "rgba(15,23,42,0.95)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, padding: "7px 11px", fontSize: 11.5, color: "white" }}>
      <div style={{ color: "rgba(255,255,255,0.6)", marginBottom: 2 }}>Day {label}</div>
      <div style={{ fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>
        {payload[0].value.toFixed(1)} {unit}
      </div>
    </div>
  );
}

function TransactionRow({ tx }) {
  const { getCat, team } = useApp();
  const { isMobile } = useViewport();
  const cat = getCat(tx.categoryId);
  const owner = team.find((t) => t.code === tx.ownerCode);
  return (
    <div style={{
      display: "grid", gridTemplateColumns: isMobile ? "30px 1fr auto" : "36px 1fr auto auto", gap: 10, alignItems: "center",
      padding: isMobile ? "10px 12px" : "11px 22px", borderBottom: "1px solid #F8FAFC",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 9,
        background: cat?.color ? `${cat.color}18` : "#F1F5F9",
        color: cat?.color || "#64748B",
        display: "grid", placeItems: "center",
      }}>
        <Icon name={cat?.icon || "circle"} size={16} />
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 500, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {tx.note}
        </div>
        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1, display: "flex", alignItems: "center", gap: 8 }}>
          <span>{cat?.name}</span>
          <span style={{ width: 2, height: 2, borderRadius: "50%", background: "#CBD5E1" }} />
          <span>{owner?.name}</span>
        </div>
      </div>
      {!isMobile && (
        <div style={{ fontSize: 11.5, color: "#94A3B8", fontVariantNumeric: "tabular-nums" }}>
          {fmtDate(tx.date, { short: true })}
        </div>
      )}
      <div style={{
        fontSize: 13.5, fontWeight: 600, fontVariantNumeric: "tabular-nums",
        color: tx.type === "income" ? "#059669" : "#E11D48",
        minWidth: 120, textAlign: "right",
      }}>
        {tx.type === "income" ? "+" : "−"}{fmtUZS(tx.amountUZS)} {tx.currency === "USD" ? <span style={{ fontSize: 10, color: "#94A3B8", fontWeight: 500 }}>(${fmtUZS(tx.amount)})</span> : <span style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 500 }}>UZS</span>}
      </div>
    </div>
  );
}

function TeamActivity({ transactions }) {
  const { team } = useApp();
  const byOwner = {};
  team.forEach((t) => { byOwner[t.code] = { income: 0, expense: 0, count: 0, ...t }; });
  transactions.forEach((t) => {
    if (!byOwner[t.ownerCode]) return;
    byOwner[t.ownerCode].count++;
    byOwner[t.ownerCode][t.type] += t.amountUZS;
  });
  const rows = Object.values(byOwner).sort((a, b) => b.count - a.count);
  const maxCount = Math.max(...rows.map((r) => r.count), 1);

  return (
    <div style={{ padding: "14px 22px 18px" }}>
      {rows.map((r) => (
        <div key={r.code} style={{ marginBottom: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
              <div style={{
                width: 28, height: 28, borderRadius: "50%",
                background: "#F1F5F9", color: "#0F172A",
                display: "grid", placeItems: "center", fontSize: 10.5, fontWeight: 700,
              }}>{r.name.split(" ").map((p) => p[0]).join("")}</div>
              <div>
                <div style={{ fontSize: 12.5, fontWeight: 600, color: "#0F172A" }}>{r.name}</div>
                <div style={{ fontSize: 10.5, color: "#94A3B8" }}>{r.role}</div>
              </div>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#0F172A", fontVariantNumeric: "tabular-nums" }}>
              {r.count} <span style={{ color: "#94A3B8", fontWeight: 500 }}>txs</span>
            </div>
          </div>
          <div style={{ height: 5, background: "#F1F5F9", borderRadius: 3, overflow: "hidden", display: "flex" }}>
            <div style={{ width: `${(r.income / (r.income + r.expense || 1)) * (r.count / maxCount) * 100}%`, background: "#10B981", transition: "width 800ms" }} />
            <div style={{ width: `${(r.expense / (r.income + r.expense || 1)) * (r.count / maxCount) * 100}%`, background: "#F43F5E", transition: "width 800ms" }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function OverviewEmpty({ onAdd }) {
  return (
    <div style={{ padding: "80px 36px", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center", maxWidth: 440 }}>
        <div style={{ width: 120, height: 120, margin: "0 auto 28px", position: "relative" }}>
          <svg viewBox="0 0 120 120" width="120" height="120">
            <defs>
              <linearGradient id="coinG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FEF3C7" /><stop offset="100%" stopColor="#FDE68A" />
              </linearGradient>
            </defs>
            {/* Coins */}
            <ellipse cx="60" cy="104" rx="44" ry="7" fill="#0F172A" opacity="0.06" />
            <ellipse cx="60" cy="94" rx="36" ry="6" fill="url(#coinG)" stroke="#FBBF24" strokeWidth="1.5" />
            <ellipse cx="60" cy="86" rx="36" ry="6" fill="url(#coinG)" stroke="#FBBF24" strokeWidth="1.5" />
            <ellipse cx="60" cy="78" rx="36" ry="6" fill="url(#coinG)" stroke="#FBBF24" strokeWidth="1.5" />
            {/* Plant */}
            <path d="M60 78 C60 60, 60 42, 60 30" stroke="#10B981" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M60 52 C48 48, 40 38, 38 28 C48 30, 56 40, 60 52" fill="#10B981" opacity="0.85" />
            <path d="M60 42 C70 38, 80 30, 82 20 C74 22, 66 30, 60 42" fill="#34D399" opacity="0.85" />
            <circle cx="60" cy="28" r="4" fill="#FBBF24" />
          </svg>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 500, color: "#0F172A", fontFamily: "'Fraunces', serif", letterSpacing: -0.5, margin: "0 0 10px" }}>
          Your financial story starts here
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.55, margin: "0 0 24px" }}>
          Log your first transaction using the Telegram bot @XisobBot or the button below. Xisob will chart your growth from day one.
        </p>
        <button onClick={onAdd} style={{
          padding: "12px 22px", background: "#10B981", color: "white",
          border: "none", borderRadius: 10, fontSize: 13.5, fontWeight: 600, cursor: "pointer",
          display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "inherit",
          boxShadow: "0 4px 14px rgba(16,185,129,0.3)",
        }}>
          <Icon name="plus" size={15} strokeWidth={2.5} />
          Add first transaction
        </button>
      </div>
    </div>
  );
}

Object.assign(window, {
  OverviewPage, Panel, TransactionRow, DeltaPill, LightTooltip, DarkTooltip, LegendDots, MiniStat,
});
