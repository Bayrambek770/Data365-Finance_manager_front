// Add Transaction modal

function AddTransactionModal({ open, onClose, initialTx = null }) {
  const { incomeCats, expenseCats, addTransaction, updateTransaction, myName, myPhone } = useApp();
  const toast = useToast();

  const isEdit = !!initialTx;

  const [type, setType] = React.useState(initialTx?.type || "expense");
  const [amount, setAmount] = React.useState(initialTx?.amount ? String(initialTx.amount) : "");
  const [currency, setCurrency] = React.useState(initialTx?.currency || "UZS");
  const [categoryId, setCategoryId] = React.useState(initialTx?.categoryId || "");
  const [date, setDate] = React.useState(initialTx ? fmtDateInput(initialTx.date) : fmtDateInput(new Date()));
  const [note, setNote] = React.useState(initialTx?.note || "");

  React.useEffect(() => {
    if (open && !isEdit) {
      setType("expense"); setAmount(""); setCurrency("UZS");
      setCategoryId(""); setDate(fmtDateInput(new Date())); setNote("");
    }
  }, [open, isEdit]);

  const [saving, setSaving] = React.useState(false);
  const cats = type === "income" ? incomeCats : expenseCats;

  if (!open) return null;


  const submit = async (e) => {
    e.preventDefault();
    if (!amount || !categoryId) {
      toast.push("Please fill in amount and category", "error");
      return;
    }
    const parsedAmount = parseFloat(amount.replace(/[,\s]/g, ""));
    if (!parsedAmount || parsedAmount <= 0) {
      toast.push("Please enter a valid amount", "error");
      return;
    }
    const tx = {
      type, amount: parsedAmount, currency, categoryId,
      date: date, note: note || cats.find((c) => c.id === categoryId)?.name,
    };
    setSaving(true);
    try {
      if (isEdit) {
        await updateTransaction(initialTx.id, tx);
        toast.push("Transaction updated");
      } else {
        await addTransaction(tx);
        toast.push("Transaction saved");
      }
      onClose();
    } catch (err) {
      toast.push("Failed to save — please try again", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(15,23,42,0.35)", backdropFilter: "blur(6px)",
      display: "grid", placeItems: "center", padding: 20,
      animation: "fadeIn 160ms ease-out",
    }} onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} style={{
        width: 480, maxWidth: "100%", background: "white",
        borderRadius: 16, overflow: "hidden",
        boxShadow: "0 30px 80px rgba(15,23,42,0.25)",
        animation: "modalIn 220ms cubic-bezier(0.2, 0.9, 0.3, 1)",
      }}>
        <div style={{ padding: "22px 24px 8px", borderBottom: "1px solid #F1F5F9", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 600, color: "#0F172A", fontFamily: "'Fraunces', serif", letterSpacing: -0.3 }}>
              {isEdit ? "Edit transaction" : "New transaction"}
            </div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
              {myName ? `Logged as ${myName}` : (myPhone ? `Logged as ${myPhone}` : "New entry")} · {fmtDate(new Date().toISOString())}
            </div>
          </div>
          <button type="button" onClick={onClose} style={{
            width: 30, height: 30, display: "grid", placeItems: "center",
            background: "#F1F5F9", color: "#475569", border: "none", borderRadius: 8, cursor: "pointer",
          }}><Icon name="x" size={16} /></button>
        </div>

        <div style={{ padding: "18px 24px 4px" }}>
          {/* Type toggle */}
          <div style={{ display: "flex", padding: 4, background: "#F1F5F9", borderRadius: 10, marginBottom: 16 }}>
            {[
              { key: "income", label: "Income", color: "#10B981", bg: "#ECFDF5", dot: "↑" },
              { key: "expense", label: "Expense", color: "#F43F5E", bg: "#FFF1F2", dot: "↓" },
            ].map((opt) => {
              const active = type === opt.key;
              return (
                <button key={opt.key} type="button" onClick={() => { setType(opt.key); setCategoryId(""); }} style={{
                  flex: 1, padding: "9px 10px",
                  background: active ? "white" : "transparent",
                  color: active ? opt.color : "#64748B",
                  border: "none", borderRadius: 7,
                  fontSize: 13, fontWeight: 600, cursor: "pointer",
                  boxShadow: active ? "0 1px 3px rgba(15,23,42,0.08)" : "none",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  fontFamily: "inherit", transition: "all 150ms",
                }}>
                  <span style={{ fontSize: 16, lineHeight: 1 }}>{opt.dot}</span>
                  {opt.label}
                </button>
              );
            })}
          </div>

          {/* Amount + currency */}
          <Field label="Amount">
            <div style={{ display: "flex", gap: 8 }}>
              <input
                value={amount}
                onChange={(e) => {
                  const raw = e.target.value.replace(/[^\d,. ]/g, "");
                  setAmount(raw);
                }}
                type="text"
                inputMode="numeric"
                placeholder="0"
                style={{ ...inputStyle, flex: 1, fontSize: 20, fontWeight: 600, fontFamily: "'Fraunces', serif", letterSpacing: -0.3 }}
              />
              <select value={currency} onChange={(e) => setCurrency(e.target.value)} style={{ ...inputStyle, width: 90 }}>
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
              </select>
            </div>
            {amount && currency === "USD" && (
              <div style={{ fontSize: 11.5, color: "#64748B", marginTop: 6 }}>
                ≈ {fmtUZS(parseFloat(amount.replace(/[,\s]/g, "")) * 12600)} UZS at today's rate
              </div>
            )}
          </Field>

          {/* Category */}
          <Field label="Category">
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} style={inputStyle}>
              <option value="">Select category…</option>
              {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>

          {/* Date */}
          <Field label="Date">
            <input 
              type="date" 
              value={date} 
              onChange={(e) => setDate(e.target.value)} 
              max={fmtDateInput(new Date())}
              style={inputStyle} 
            />
          </Field>

          {/* Note */}
          <Field label="Note" optional>
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2}
              placeholder="e.g. Chorsu bazaar — weekly restock"
              style={{ ...inputStyle, resize: "none", fontFamily: "inherit" }} />
          </Field>
        </div>

        <div style={{ padding: "16px 24px 22px", borderTop: "1px solid #F1F5F9", display: "flex", gap: 10, background: "#FAFBFD" }}>
          <button type="button" onClick={onClose} style={{
            flex: "0 0 auto", padding: "11px 18px",
            background: "white", color: "#475569",
            border: "1px solid #E2E8F0", borderRadius: 9,
            fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "inherit",
          }}>Cancel</button>
          <button type="submit" disabled={saving} style={{
            flex: 1, padding: "11px 18px",
            background: saving ? "#475569" : "#0F172A", color: "white",
            border: "none", borderRadius: 9,
            fontWeight: 600, fontSize: 13,
            cursor: saving ? "not-allowed" : "pointer",
            fontFamily: "inherit",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            opacity: saving ? 0.7 : 1,
          }}>
            <Icon name={saving ? "more" : "check"} size={15} strokeWidth={2.5} />
            {saving ? "Saving…" : "Save transaction"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%", padding: "10px 12px",
  background: "white",
  border: "1px solid #E2E8F0", borderRadius: 9,
  fontSize: 13.5, color: "#0F172A",
  fontFamily: "inherit",
  outline: "none",
};

function Field({ label, optional, children }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <label style={{ fontSize: 11.5, fontWeight: 600, color: "#475569", textTransform: "uppercase", letterSpacing: 0.8 }}>{label}</label>
        {optional && <span style={{ fontSize: 10.5, color: "#94A3B8" }}>optional</span>}
      </div>
      {children}
    </div>
  );
}

window.AddTransactionModal = AddTransactionModal;
