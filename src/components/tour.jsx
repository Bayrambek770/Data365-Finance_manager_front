// First-time onboarding tour — spotlight style, Russian default

const TOUR_KEY = "xisob_visit_count";

const TOUR_STEPS = [
  {
    targetId: "tour-sidebar-nav",
    placement: "right",
    texts: {
      ru: {
        title: "Навигация",
        body: "Здесь находится главное меню. Переключайтесь между разделами: Обзор, Транзакции, Аналитика, Категории и Бюджеты.",
      },
      en: {
        title: "Navigation",
        body: "This is the main menu. Switch between sections: Overview, Transactions, Analytics, Categories, and Budgets.",
      },
      uz: {
        title: "Navigatsiya",
        body: "Bu asosiy menyu. Bo'limlar o'rtasida o'ting: Umumiy ko'rinish, Tranzaksiyalar, Analitika, Kategoriyalar va Byudjetlar.",
      },
    },
  },
  {
    targetId: "tour-header-add",
    placement: "bottom",
    texts: {
      ru: {
        title: "Добавить транзакцию",
        body: "Нажмите эту кнопку, чтобы добавить доход или расход. Укажите сумму, категорию и дату.",
      },
      en: {
        title: "Add Transaction",
        body: "Click this button to add income or expense. Specify the amount, category and date.",
      },
      uz: {
        title: "Tranzaksiya qo'shish",
        body: "Daromad yoki xarajat qo'shish uchun ushbu tugmani bosing. Miqdor, kategoriya va sanani kiriting.",
      },
    },
  },
  {
    targetId: "tour-overview-hero",
    placement: "bottom",
    texts: {
      ru: {
        title: "Баланс за месяц",
        body: "Главная карточка показывает текущий баланс: доходы минус расходы за этот месяц, а также динамику по сравнению с прошлым месяцем.",
      },
      en: {
        title: "Monthly Balance",
        body: "The main card shows your current balance: income minus expenses for this month, plus the trend compared to last month.",
      },
      uz: {
        title: "Oylik balans",
        body: "Asosiy karta joriy balansni ko'rsatadi: bu oyda daromad minus xarajatlar va o'tgan oy bilan taqqoslaganda o'zgarish.",
      },
    },
  },
  {
    targetId: "tour-overview-chart",
    placement: "top",
    texts: {
      ru: {
        title: "График за 6 месяцев",
        body: "Столбчатая диаграмма отображает доходы и расходы за последние 6 месяцев. Сравнивайте периоды и отслеживайте тенденции.",
      },
      en: {
        title: "6-Month Chart",
        body: "The bar chart displays income and expenses over the last 6 months. Compare periods and track trends.",
      },
      uz: {
        title: "6 oylik grafik",
        body: "Ustunli diagramma so'nggi 6 oy ichidagi daromad va xarajatlarni ko'rsatadi. Davrlarni solishtiring va tendentsiyalarni kuzating.",
      },
    },
  },
  {
    targetId: "tour-overview-donut",
    placement: "top",
    texts: {
      ru: {
        title: "Расходы по категориям",
        body: "Кольцевая диаграмма показывает, на что уходят деньги. Каждый сегмент — отдельная категория расходов.",
      },
      en: {
        title: "Expenses by Category",
        body: "The donut chart shows where the money goes. Each segment is a separate expense category.",
      },
      uz: {
        title: "Kategoriyalar bo'yicha xarajatlar",
        body: "Halqa diagrammasi pul qayerga ketishini ko'rsatadi. Har bir segment alohida xarajat kategoriyasidir.",
      },
    },
  },
  {
    targetId: "tour-overview-recent",
    placement: "top",
    texts: {
      ru: {
        title: "Последние транзакции",
        body: "Список последних операций. Нажмите «Транзакции» в меню, чтобы увидеть все записи, фильтровать и редактировать их.",
      },
      en: {
        title: "Recent Transactions",
        body: "List of recent operations. Click \"Transactions\" in the menu to see all records, filter and edit them.",
      },
      uz: {
        title: "So'nggi tranzaksiyalar",
        body: "So'nggi operatsiyalar ro'yxati. Barcha yozuvlarni ko'rish, filtrlash va tahrirlash uchun menyudagi \"Tranzaksiyalar\"ni bosing.",
      },
    },
  },
  {
    targetId: "tour-sidebar-theme",
    placement: "right",
    texts: {
      ru: {
        title: "Тема оформления",
        body: "Переключайте между светлой и тёмной темой, выбирайте язык интерфейса. Ваши настройки сохраняются автоматически.",
      },
      en: {
        title: "Theme & Language",
        body: "Switch between light and dark theme, choose the interface language. Your settings are saved automatically.",
      },
      uz: {
        title: "Mavzu va til",
        body: "Yorug' va qorong'u mavzu o'rtasida almashtiring, interfeys tilini tanlang. Sozlamalaringiz avtomatik saqlanadi.",
      },
    },
  },
];

const LANG_LABELS = { ru: "РУС", en: "ENG", uz: "UZB" };

function useFirstVisit() {
  const [isFirstVisit] = React.useState(() => {
    try {
      const count = parseInt(localStorage.getItem(TOUR_KEY) || "0", 10);
      return count === 0;
    } catch {
      return false;
    }
  });
  return isFirstVisit;
}

function markVisited() {
  try {
    const count = parseInt(localStorage.getItem(TOUR_KEY) || "0", 10);
    localStorage.setItem(TOUR_KEY, String(count + 1));
  } catch {}
}

function getTargetRect(id) {
  const el = document.getElementById(id);
  if (!el) return null;
  return el.getBoundingClientRect();
}

function SpotlightOverlay({ rect, padding = 10 }) {
  if (!rect) return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(10,15,27,0.72)",
      zIndex: 9000, pointerEvents: "none",
    }} />
  );

  const x = rect.left - padding;
  const y = rect.top - padding;
  const w = rect.width + padding * 2;
  const h = rect.height + padding * 2;
  const r = 12;

  const vw = window.innerWidth;
  const vh = window.innerHeight;

  return (
    <>
      {/* Dark overlay with cutout via SVG mask */}
      <svg
        style={{ position: "fixed", inset: 0, width: "100vw", height: "100vh", zIndex: 9000, pointerEvents: "none" }}
        viewBox={`0 0 ${vw} ${vh}`}
        preserveAspectRatio="none"
      >
        <defs>
          <mask id="tour-spotlight-mask">
            <rect width={vw} height={vh} fill="white" />
            <rect x={x} y={y} width={w} height={h} rx={r} fill="black" />
          </mask>
        </defs>
        <rect width={vw} height={vh} fill="rgba(10,15,27,0.72)" mask="url(#tour-spotlight-mask)" />
      </svg>
      {/* Highlight border */}
      <div style={{
        position: "fixed",
        left: x, top: y, width: w, height: h,
        borderRadius: r,
        boxShadow: "0 0 0 2px #10B981, 0 0 24px rgba(16,185,129,0.35)",
        zIndex: 9001, pointerEvents: "none",
        transition: "all 280ms cubic-bezier(0.4,0,0.2,1)",
      }} />
    </>
  );
}

function TourTooltip({ step, stepIndex, totalSteps, lang, setLang, onNext, onSkip }) {
  const [rect, setRect] = React.useState(null);

  React.useEffect(() => {
    const update = () => {
      const r = getTargetRect(step.targetId);
      setRect(r);
    };
    update();
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step.targetId]);

  // Scroll target into view
  React.useEffect(() => {
    const el = document.getElementById(step.targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "nearest" });
      setTimeout(() => {
        setRect(getTargetRect(step.targetId));
      }, 350);
    }
  }, [step.targetId]);

  const text = step.texts[lang] || step.texts.ru;
  const isLast = stepIndex === totalSteps - 1;

  // Tooltip position
  const tooltipW = 320;
  const tooltipH = 200; // approx
  const pad = 14;

  let tooltipStyle = {
    position: "fixed",
    width: tooltipW,
    zIndex: 9010,
    transition: "all 280ms cubic-bezier(0.4,0,0.2,1)",
  };

  if (rect) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const place = step.placement;

    if (place === "right") {
      let left = rect.right + pad;
      let top = rect.top + rect.height / 2 - tooltipH / 2;
      if (left + tooltipW > vw - 10) left = rect.left - tooltipW - pad;
      if (top < 10) top = 10;
      if (top + tooltipH > vh - 10) top = vh - tooltipH - 10;
      tooltipStyle = { ...tooltipStyle, left, top };
    } else if (place === "bottom") {
      let top = rect.bottom + pad;
      let left = rect.left + rect.width / 2 - tooltipW / 2;
      if (left < 10) left = 10;
      if (left + tooltipW > vw - 10) left = vw - tooltipW - 10;
      if (top + tooltipH > vh - 10) top = rect.top - tooltipH - pad;
      tooltipStyle = { ...tooltipStyle, left, top };
    } else {
      // top
      let top = rect.top - tooltipH - pad;
      let left = rect.left + rect.width / 2 - tooltipW / 2;
      if (left < 10) left = 10;
      if (left + tooltipW > vw - 10) left = vw - tooltipW - 10;
      if (top < 10) top = rect.bottom + pad;
      tooltipStyle = { ...tooltipStyle, left, top };
    }
  } else {
    // Fallback: center
    tooltipStyle = {
      ...tooltipStyle,
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
    };
  }

  const btnLabels = {
    ru: { next: "Далее", done: "Начать работу", skip: "Пропустить" },
    en: { next: "Next", done: "Get Started", skip: "Skip" },
    uz: { next: "Keyingi", done: "Boshlash", skip: "O'tkazib yuborish" },
  };
  const lbl = btnLabels[lang] || btnLabels.ru;

  const stepLabel = { ru: "Шаг", en: "Step", uz: "Qadam" }[lang] || "Шаг";
  const ofLabel = { ru: "из", en: "of", uz: "dan" }[lang] || "из";

  return (
    <>
      <SpotlightOverlay rect={rect} />
      {/* Backdrop — blocks clicks on the page but does NOT dismiss */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9005, cursor: "default" }} />
      <div style={{
        ...tooltipStyle,
        background: "var(--surface, #FFFFFF)",
        borderRadius: 16,
        boxShadow: "0 20px 60px rgba(0,0,0,0.25), 0 0 0 1px rgba(16,185,129,0.2)",
        overflow: "hidden",
        animation: "tourTooltipIn 220ms cubic-bezier(0.4,0,0.2,1)",
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
          padding: "14px 16px 12px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#10B981", boxShadow: "0 0 6px #10B981",
            }} />
            <span style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600 }}>
              {text.title}
            </span>
          </div>
          {/* Lang switcher */}
          <div style={{ display: "flex", gap: 4 }}>
            {["ru", "en", "uz"].map((l) => (
              <button
                key={l}
                onClick={(e) => { e.stopPropagation(); setLang(l); }}
                style={{
                  padding: "2px 7px", borderRadius: 6, border: "none",
                  fontSize: 10, fontWeight: 700, cursor: "pointer",
                  letterSpacing: 0.5,
                  background: lang === l ? "#10B981" : "rgba(255,255,255,0.1)",
                  color: lang === l ? "#fff" : "rgba(226,232,240,0.7)",
                  transition: "all 150ms ease",
                }}
              >
                {LANG_LABELS[l]}
              </button>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "14px 16px 16px" }}>
          <p style={{
            margin: "0 0 16px",
            fontSize: 13.5, lineHeight: 1.6,
            color: "var(--text-secondary, #475569)",
          }}>
            {text.body}
          </p>

          {/* Progress dots */}
          <div style={{ display: "flex", gap: 5, marginBottom: 14, alignItems: "center" }}>
            <span style={{ fontSize: 11, color: "var(--text-muted, #94A3B8)", marginRight: 4 }}>
              {stepLabel} {stepIndex + 1} {ofLabel} {totalSteps}
            </span>
            {TOUR_STEPS.map((_, i) => (
              <div key={i} style={{
                width: i === stepIndex ? 16 : 6,
                height: 6, borderRadius: 3,
                background: i === stepIndex ? "#10B981" : i < stepIndex ? "#10B98166" : "var(--border, #E2E8F0)",
                transition: "all 250ms ease",
              }} />
            ))}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
            <button
              onClick={(e) => { e.stopPropagation(); onSkip(); }}
              style={{
                padding: "7px 14px", borderRadius: 8,
                border: "1px solid var(--border, #E2E8F0)",
                background: "transparent",
                color: "var(--text-muted, #94A3B8)",
                fontSize: 13, cursor: "pointer", fontWeight: 500,
              }}
            >
              {lbl.skip}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onNext(); }}
              style={{
                padding: "7px 20px", borderRadius: 8,
                border: "none",
                background: isLast
                  ? "linear-gradient(135deg, #059669, #10B981)"
                  : "#10B981",
                color: "#fff",
                fontSize: 13, cursor: "pointer", fontWeight: 600,
                boxShadow: "0 2px 8px rgba(16,185,129,0.35)",
              }}
            >
              {isLast ? lbl.done : lbl.next}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function OnboardingTour() {
  const { transactions, isLoading } = useApp();
  const isFirstVisit = useFirstVisit();

  const [active, setActive] = React.useState(false);
  const [stepIndex, setStepIndex] = React.useState(0);
  const [lang, setLang] = React.useState("ru");

  const hasData = transactions && transactions.length > 0;

  React.useEffect(() => {
    if (!isLoading && isFirstVisit && !hasData) {
      // Small delay so the page renders first
      const t = setTimeout(() => setActive(true), 800);
      return () => clearTimeout(t);
    }
  }, [isLoading, isFirstVisit, hasData]);

  const dismiss = React.useCallback(() => {
    markVisited();
    setActive(false);
  }, []);

  const handleNext = React.useCallback(() => {
    if (stepIndex < TOUR_STEPS.length - 1) {
      setStepIndex((i) => i + 1);
    } else {
      dismiss();
    }
  }, [stepIndex, dismiss]);

  if (!active) return null;

  const step = TOUR_STEPS[stepIndex];

  return (
    <TourTooltip
      step={step}
      stepIndex={stepIndex}
      totalSteps={TOUR_STEPS.length}
      lang={lang}
      setLang={setLang}
      onNext={handleNext}
      onSkip={dismiss}
    />
  );
}

window.OnboardingTour = OnboardingTour;
