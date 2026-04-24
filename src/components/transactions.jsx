// Transactions page — filters, table, inline edit, pagination

function TransactionsPage() {
  const { transactions, allCats, getCat, team, userCode, deleteTransaction, updateTransaction, isEmpty } = useApp();
  const toast = useToast();
  const { isMobile, isTablet } = useViewport();

  const [from, setFrom] = React.useState("");
  const [to, setTo] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [type, setType] = React.useState("all");
  const [search, setSearch] = React.useState("");
  const [page, setPage] = React.useState(1);
  const [editingId, setEditingId] = React.useState(null);
  const [editDraft, setEditDraft] = React.useState(null);

  const pageSize = 20;

  const filtered = React.useMemo(() => {
    return transactions.filter((t) => {
      if (from && t.date < from) return false;
      if (to && t.date > to + "T23:59:59") return false;
      if (category && t.categoryId !== category) return false;
      if (type !== "all" && t.type !== type) return false;
      if (search) {
        const s = search.toLowerCase();
        const cat = getCat(t.categoryId);
        if (!t.note.toLowerCase().includes(s) && !(cat?.name.toLowerCase().includes(s))) return false;
      }
      return true;
    });
  }, [transactions, from, to, category, type, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const pageRows = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const hasFilters = from || to || category || type !== "all" || search;

  const clearFilters = () => {
    setFrom(""); setTo(""); setCategory(""); setType("all"); setSearch(""); setPage(1);
  };

  const totalIn = filtered.filter((t) => t.type === "income").reduce((s, t) => s + t.amountUZS, 0);
  const totalOut = filtered.filter((t) => t.type === "expense").reduce((s, t) => s + t.amountUZS, 0);

  const startEdit = (tx) => {
    setEditingId(tx.id);
    setEditDraft({ amount: tx.amount, categoryId: tx.categoryId, date: fmtDateInput(tx.date), note: tx.note, currency: tx.currency, type: tx.type });
  };
  const saveEdit = () => {
    updateTransaction(editingId, {
      amount: parseFloat(editDraft.amount),
      categoryId: editDraft.categoryId,
      date: new Date(editDraft.date).toISOString(),
      note: editDraft.note,
      currency: editDraft.currency,
      type: editDraft.type,
    });
    setEditingId(null); setEditDraft(null);
    toast.push("Transaction updated");
  };
  const cancelEdit = () => { setEditingId(null); setEditDraft(null); };
  const del = (id) => { deleteTransaction(id); toast.push("Transaction deleted", "info"); };

  return (
    <div style={{ padding: isMobile ? "14px 12px 24px" : isTablet ? "20px 16px 30px" : "24px 36px 40px", maxWidth: 1440, margin: "0 auto" }}>
      {/* Summary strip */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "repeat(2, minmax(0, 1fr))" : "repeat(4, minmax(0, 1fr))", gap: 12, marginBottom: 16 }}>
        <SummaryTile label="Showing" value={filtered.length} suffix="of all time" icon="list" color="#0F172A" />
        <SummaryTile label="Income total" value={fmtCompact(totalIn) + " UZS"} icon="arrow-up" color="#10B981" />
        <SummaryTile label="Expense total" value={fmtCompact(totalOut) + " UZS"} icon="arrow-down" color="#F43F5E" />
        <SummaryTile label="Net" value={(totalIn - totalOut >= 0 ? "+" : "") + fmtCompact(totalIn - totalOut) + " UZS"} icon="equal" color={totalIn - totalOut >= 0 ? "#10B981" : "#F43F5E"} />
      </div>

      {/* Filter bar */}
      <div style={{
        background: "white", border: "1px solid #EEF2F7", borderRadius: 14,
        padding: isMobile ? 10 : 12, marginBottom: 16,
        display: "grid", gridTemplateColumns: isMobile ? "1fr" : isTablet ? "1fr 1fr" : "1fr auto auto auto auto", gap: 10, alignItems: "center",
      }}>
        <div style={{ position: "relative" }}>
          <Icon name="search" size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} />
          <input
            placeholder="Search notes or categories…"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            style={{
              width: "100%", padding: "9px 12px 9px 36px",
              background: "#F8FAFC", border: "1px solid transparent",
              borderRadius: 9, fontSize: 13, color: "#0F172A",
              outline: "none", fontFamily: "inherit",
            }}
            onFocus={(e) => { e.target.style.background = "white"; e.target.style.borderColor = "#CBD5E1"; }}
            onBlur={(e) => { e.target.style.background = "#F8FAFC"; e.target.style.borderColor = "transparent"; }}
          />
        </div>
        <SegTypeFilter value={type} onChange={(v) => { 
          setType(v); 
          setPage(1);
          if (category) {
            const cat = allCats.find(c => c.id === category);
            if (v !== "all" && cat && cat.type !== v) setCategory("");
          }
        }} />
        <select value={category} onChange={(e) => { setCategory(e.target.value); setPage(1); }} style={selStyle}>
          <option value="">All categories</option>
          {(type === "all" || type === "income") && (
            <optgroup label="Income">
              {allCats.filter((c) => c.type === "income").map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          )}
          {(type === "all" || type === "expense") && (
            <optgroup label="Expense">
              {allCats.filter((c) => c.type === "expense").map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </optgroup>
          )}
        </select>
        <DateRange from={from} to={to} onChange={(f, t) => { setFrom(f); setTo(t); setPage(1); }} />
        {hasFilters && (
          <button onClick={clearFilters} style={{
            padding: "8px 12px", background: "transparent", color: "#64748B",
            border: "1px solid #E2E8F0", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 5, fontFamily: "inherit",
          }}><Icon name="x" size={12} strokeWidth={2.5} /> Clear</button>
        )}
      </div>

      {/* Table */}
      {filtered.length === 0 ? <TxEmpty hasFilters={hasFilters} onClear={clearFilters} /> : (
      <div style={{ background: "white", border: "1px solid #EEF2F7", borderRadius: 14, overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <div style={{ minWidth: isMobile ? 720 : 820, display: "grid", gridTemplateColumns: "110px 180px 1fr 170px 180px 46px", padding: "12px 16px", borderBottom: "1px solid #F1F5F9", fontSize: 10.5, fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#94A3B8" }}>
          <div>Date</div><div>Category</div><div>Note</div><div>Added by</div><div style={{ textAlign: "right" }}>Amount</div><div></div>
        </div>
        {pageRows.map((tx) => (
          <TxRow
            key={tx.id}
            tx={tx}
            editing={editingId === tx.id}
            draft={editDraft}
            onStartEdit={() => startEdit(tx)}
            onCancelEdit={cancelEdit}
            onSaveEdit={saveEdit}
            onDraftChange={(patch) => setEditDraft((d) => ({ ...d, ...patch }))}
            onDelete={() => del(tx.id)}
            userCode={userCode}
            allCats={allCats}
            getCat={getCat}
            team={team}
            compact={isMobile}
          />
        ))}
        </div>
      </div>
      )}

      {/* Pagination */}
      {filtered.length > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", flexDirection: isMobile ? "column" : "row", gap: 10, marginTop: 16, fontSize: 12, color: "#64748B" }}>
          <div>
            Showing <span style={{ color: "#0F172A", fontWeight: 600 }}>{(currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filtered.length)}</span> of <span style={{ color: "#0F172A", fontWeight: 600 }}>{filtered.length}</span>
          </div>
          <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
            <PageBtn disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><Icon name="chevron-left" size={13} /></PageBtn>
            {Array.from({ length: totalPages }).slice(0, 5).map((_, i) => {
              const p = i + 1;
              return <PageBtn key={p} active={p === currentPage} onClick={() => setPage(p)}>{p}</PageBtn>;
            })}
            {totalPages > 5 && <span style={{ color: "#94A3B8", padding: "0 4px" }}>…</span>}
            {totalPages > 5 && <PageBtn active={currentPage === totalPages} onClick={() => setPage(totalPages)}>{totalPages}</PageBtn>}
            <PageBtn disabled={currentPage === totalPages} onClick={() => setPage(currentPage + 1)}><Icon name="chevron-right" size={13} /></PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}

const selStyle = {
  padding: "8px 10px", background: "#F8FAFC",
  border: "1px solid transparent", borderRadius: 9,
  fontSize: 12.5, color: "#0F172A", fontFamily: "inherit",
  outline: "none", minWidth: 160,
};

function SummaryTile({ label, value, suffix, icon, color }) {
  return (
    <div style={{ background: "white", border: "1px solid #EEF2F7", borderRadius: 12, padding: "14px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <div style={{ fontSize: 10.5, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>{label}</div>
        <div style={{ width: 22, height: 22, borderRadius: 6, background: `${color}14`, color, display: "grid", placeItems: "center" }}>
          <Icon name={icon} size={12} strokeWidth={2.5} />
        </div>
      </div>
      <div style={{ fontSize: 20, fontWeight: 500, color: "#0F172A", fontFamily: "'Fraunces', serif", letterSpacing: -0.5, fontVariantNumeric: "tabular-nums" }}>{value}</div>
      {suffix && <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{suffix}</div>}
    </div>
  );
}

function SegTypeFilter({ value, onChange }) {
  const opts = [
    { key: "all", label: "All" },
    { key: "income", label: "Income", color: "#10B981" },
    { key: "expense", label: "Expense", color: "#F43F5E" },
  ];
  return (
    <div style={{ display: "flex", padding: 3, background: "#F1F5F9", borderRadius: 9 }}>
      {opts.map((o) => {
        const active = value === o.key;
        return (
          <button key={o.key} onClick={() => onChange(o.key)} style={{
            padding: "6px 12px", background: active ? "white" : "transparent",
            color: active ? (o.color || "#0F172A") : "#64748B",
            border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
            boxShadow: active ? "0 1px 2px rgba(15,23,42,0.08)" : "none",
            transition: "all 150ms",
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

function DateRange({ from, to, onChange }) {
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  React.useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h); return () => document.removeEventListener("mousedown", h);
  }, []);
  const label = from || to ? `${from || "…"} → ${to || "…"}` : "Date range";
  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        padding: "8px 12px", background: "#F8FAFC",
        border: "1px solid transparent", borderRadius: 9,
        fontSize: 12.5, color: (from || to) ? "#0F172A" : "#64748B",
        fontWeight: (from || to) ? 600 : 500,
        cursor: "pointer", fontFamily: "inherit",
        display: "flex", alignItems: "center", gap: 7,
      }}>
        <Icon name="calendar" size={13} />
        {label}
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "white", border: "1px solid #E2E8F0", borderRadius: 10, padding: 14, boxShadow: "0 16px 40px rgba(15,23,42,0.12)", zIndex: 10, width: 260 }}>
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>From</div>
          <input type="date" value={from} onChange={(e) => onChange(e.target.value, to)} style={{ ...inputStyle, marginBottom: 10 }} />
          <div style={{ fontSize: 10.5, fontWeight: 600, color: "#94A3B8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>To</div>
          <input type="date" value={to} onChange={(e) => onChange(from, e.target.value)} style={inputStyle} />
          <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
            {["7d", "30d", "this month"].map((p) => (
              <button key={p} onClick={() => {
                const now = new Date("2026-04-23");
                if (p === "this month") { onChange("2026-04-01", "2026-04-30"); }
                else {
                  const days = p === "7d" ? 7 : 30;
                  const start = new Date(now); start.setDate(start.getDate() - days);
                  onChange(fmtDateInput(start.toISOString()), fmtDateInput(now.toISOString()));
                }
              }} style={{ padding: "5px 9px", background: "#F1F5F9", border: "none", borderRadius: 6, fontSize: 11, color: "#475569", cursor: "pointer", fontWeight: 600, fontFamily: "inherit" }}>{p}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PageBtn({ children, active, disabled, onClick }) {
  return (
    <button onClick={onClick} disabled={disabled} style={{
      minWidth: 30, height: 30,
      background: active ? "#0F172A" : "white",
      color: active ? "white" : disabled ? "#CBD5E1" : "#475569",
      border: `1px solid ${active ? "#0F172A" : "#E2E8F0"}`, borderRadius: 7,
      fontSize: 12, fontWeight: 600, cursor: disabled ? "not-allowed" : "pointer",
      fontFamily: "inherit",
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      padding: "0 8px",
    }}>{children}</button>
  );
}

function TxRow({ tx, editing, draft, onStartEdit, onCancelEdit, onSaveEdit, onDraftChange, onDelete, userCode, allCats, getCat, team, compact }) {
  const cat = getCat(tx.categoryId);
  const owner = team.find((t) => t.code === tx.ownerCode);
  const isMine = tx.isMine;
  const [hovering, setHovering] = React.useState(false);

  if (editing && draft) {
    const cats = draft.type === "income" ? allCats.filter((c) => c.id.startsWith("inc-")) : allCats.filter((c) => c.id.startsWith("exp-"));
    return (
      <div style={{
        display: "grid", gridTemplateColumns: "110px 180px 1fr 170px 180px 46px",
        minWidth: compact ? 720 : 820,
        padding: "12px 16px", borderBottom: "1px solid #F1F5F9",
        background: "#FFFBEB", alignItems: "center", gap: 10,
      }}>
        <input type="date" value={draft.date} onChange={(e) => onDraftChange({ date: e.target.value })}
          style={{ ...inputStyle, padding: "6px 8px", fontSize: 12 }} />
        <select value={draft.categoryId} onChange={(e) => onDraftChange({ categoryId: e.target.value })}
          style={{ ...inputStyle, padding: "6px 8px", fontSize: 12 }}>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input value={draft.note} onChange={(e) => onDraftChange({ note: e.target.value })}
          style={{ ...inputStyle, padding: "6px 8px", fontSize: 12 }} />
        <div style={{ fontSize: 11.5, color: "#94A3B8" }}>
          {tx.addedByPhone?.replace("+998 ", "") || owner?.name || "You"}
        </div>
        <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
          <input type="number" value={draft.amount} onChange={(e) => onDraftChange({ amount: e.target.value })}
            style={{ ...inputStyle, padding: "6px 8px", fontSize: 12, width: 110, textAlign: "right" }} />
          <select value={draft.currency} onChange={(e) => onDraftChange({ currency: e.target.value })}
            style={{ ...inputStyle, padding: "6px 8px", fontSize: 12, width: 56 }}>
            <option value="UZS">UZS</option><option value="USD">USD</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
          <button onClick={onSaveEdit} style={iconBtn("#10B981", "#ECFDF5")}><Icon name="check" size={14} strokeWidth={2.5} /></button>
          <button onClick={onCancelEdit} style={iconBtn("#64748B", "#F1F5F9")}><Icon name="x" size={14} strokeWidth={2.5} /></button>
        </div>
      </div>
    );
  }

  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        display: "grid", gridTemplateColumns: "110px 180px 1fr 170px 180px 46px",
        minWidth: compact ? 720 : 820,
        padding: "12px 16px", borderBottom: "1px solid #F1F5F9",
        alignItems: "center", gap: 10,
        background: hovering ? "#FAFBFD" : "white",
        transition: "background 120ms",
      }}>
      <div style={{ fontSize: 12, color: "#64748B", fontVariantNumeric: "tabular-nums" }}>{fmtDate(tx.date, { short: true })}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: 6, background: `${cat?.color || "#94A3B8"}18`, color: cat?.color || "#64748B", display: "grid", placeItems: "center" }}>
          <Icon name={cat?.icon || "circle"} size={12} strokeWidth={2} />
        </div>
        <div style={{ fontSize: 12.5, fontWeight: 500, color: "#0F172A" }}>{cat?.name}</div>
      </div>
      <div style={{ fontSize: 13, color: "#0F172A", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{tx.note}</div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#F1F5F9", color: "#0F172A", display: "grid", placeItems: "center", fontSize: 9, fontWeight: 700 }}>
          {owner?.name ? owner.name.split(" ").map((p) => p[0]).join("") : "U"}
        </div>
        <div style={{ fontSize: 11.5, color: "#475569", fontVariantNumeric: "tabular-nums" }}>
          {(tx.addedByPhone || owner?.phone || "—").replace("+998 ", "")}
        </div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: tx.type === "income" ? "#059669" : "#E11D48", fontVariantNumeric: "tabular-nums" }}>
          {tx.type === "income" ? "+" : "−"}{fmtUZS(tx.amount)} <span style={{ fontSize: 10.5, color: "#94A3B8", fontWeight: 500 }}>{tx.currency}</span>
        </div>
        {tx.currency === "USD" && <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 1 }}>≈ {fmtCompact(tx.amountUZS)} UZS</div>}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
        <button
          disabled={!isMine}
          onClick={() => isMine && onStartEdit()}
          title={isMine ? "Edit" : "You can only edit your own transactions"}
          style={iconBtn("#475569", "transparent", !isMine)}
        ><Icon name="edit" size={13} /></button>
        <button
          disabled={!isMine}
          onClick={() => isMine && onDelete()}
          title={isMine ? "Delete" : "You can only delete your own transactions"}
          style={iconBtn("#E11D48", "transparent", !isMine)}
        ><Icon name="trash" size={13} /></button>
      </div>
    </div>
  );
}

function iconBtn(color, bg, disabled) {
  return {
    width: 26, height: 26, background: bg, color: disabled ? "#CBD5E1" : color,
    border: "none", borderRadius: 6, cursor: disabled ? "not-allowed" : "pointer",
    display: "grid", placeItems: "center", fontFamily: "inherit",
  };
}

function TxEmpty({ hasFilters, onClear }) {
  return (
    <div style={{ background: "white", border: "1px solid #EEF2F7", borderRadius: 14, padding: "64px 24px", textAlign: "center" }}>
      <div style={{ width: 64, height: 64, margin: "0 auto 16px", borderRadius: 16, background: "#F1F5F9", display: "grid", placeItems: "center", color: "#64748B" }}>
        <Icon name="receipt" size={28} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, color: "#0F172A", fontFamily: "'Fraunces', serif" }}>No transactions found</div>
      <div style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
        {hasFilters ? "Try clearing your filters to see all transactions." : "Add your first transaction using the button above."}
      </div>
      {hasFilters && <button onClick={onClear} style={{ marginTop: 14, padding: "9px 16px", background: "#0F172A", color: "white", border: "none", borderRadius: 8, fontSize: 12.5, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>Clear filters</button>}
    </div>
  );
}

window.TransactionsPage = TransactionsPage;
