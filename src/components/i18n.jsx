// i18n: English / Russian / Uzbek translations for Xisob

const DICT = {
  en: {
    // Brand
    "brand.company": "Chinor Textile",
    "brand.workspace": "Workspace",
    "brand.tg.label": "Telegram bot",
    "brand.tg.body": "Log transactions in Uzbek or Russian from your phone — @XisobBot",

    // Nav
    "nav.overview": "Overview",
    "nav.transactions": "Transactions",
    "nav.analytics": "Analytics",
    "nav.categories": "Categories",
    "nav.budgets": "Budgets",

    // Header
    "header.addTx": "Add Transaction",
    "header.sub.overview": "This month · April 2026",
    "header.sub.transactions": "All activity across your team",
    "header.sub.analytics": "Spot patterns and outliers",
    "header.sub.categories": "Organize how money moves",
    "header.sub.budgets": "Monthly spending limits",

    // Days / months
    "day.0": "Sunday", "day.1": "Monday", "day.2": "Tuesday", "day.3": "Wednesday",
    "day.4": "Thursday", "day.5": "Friday", "day.6": "Saturday",
    "day.s.0": "Sun", "day.s.1": "Mon", "day.s.2": "Tue", "day.s.3": "Wed",
    "day.s.4": "Thu", "day.s.5": "Fri", "day.s.6": "Sat",

    // Common
    "common.cancel": "Cancel",
    "common.save": "Save transaction",
    "common.add": "Add",
    "common.clear": "Clear",
    "common.clearFilters": "Clear filters",
    "common.edit": "Edit",
    "common.delete": "Delete",
    "common.optional": "optional",
    "common.selectCategory": "Select category…",
    "common.amount": "Amount",
    "common.category": "Category",
    "common.date": "Date",
    "common.note": "Note",
    "common.income": "Income",
    "common.expense": "Expense",
    "common.all": "All",
    "common.of": "of",
    "common.total": "total",
    "common.transactions": "transactions",
    "common.transaction": "transaction",
    "common.UZS": "UZS",
    "common.viewAll": "View all →",

    // Overview
    "ov.hero.label": "Net balance · April 2026",
    "ov.hero.vs": "vs {v} UZS in March",
    "ov.mini.income": "Income",
    "ov.mini.expenses": "Expenses",
    "ov.mini.transactions": "Transactions",
    "ov.bars.title": "Income vs Expenses",
    "ov.bars.sub": "Last 6 months, millions UZS",
    "ov.cum": "Cumulative net",
    "ov.donut.title": "Where money goes",
    "ov.donut.sub": "This month by category",
    "ov.donut.total": "Total",
    "ov.recent.title": "Recent transactions",
    "ov.recent.sub": "Last 8 entries across team",
    "ov.team.title": "Team activity",
    "ov.team.sub": "Who logged what this month",
    "ov.team.txs": "txs",
    "ov.empty.title": "Your financial story starts here",
    "ov.empty.body": "Log your first transaction using the Telegram bot @XisobBot or the button below. Xisob will chart your growth from day one.",
    "ov.empty.cta": "Add first transaction",

    // Transactions
    "tx.tile.showing": "Showing",
    "tx.tile.showing.suffix": "of all time",
    "tx.tile.income": "Income total",
    "tx.tile.expense": "Expense total",
    "tx.tile.net": "Net",
    "tx.search": "Search notes or categories…",
    "tx.allCategories": "All categories",
    "tx.dateRange": "Date range",
    "tx.from": "From",
    "tx.to": "To",
    "tx.col.date": "Date",
    "tx.col.category": "Category",
    "tx.col.note": "Note",
    "tx.col.addedBy": "Added by",
    "tx.col.amount": "Amount",
    "tx.showing": "Showing {a}–{b} of {c}",
    "tx.empty.title": "No transactions found",
    "tx.empty.body.filtered": "Try clearing your filters to see all transactions.",
    "tx.empty.body.none": "Add your first transaction using the button above.",
    "tx.toast.updated": "Transaction updated",
    "tx.toast.deleted": "Transaction deleted",
    "tx.edit.tip.mine": "Edit",
    "tx.edit.tip.others": "You can only edit your own transactions",
    "tx.del.tip.mine": "Delete",
    "tx.del.tip.others": "You can only delete your own transactions",
    "tx.inPeriod": "{n} transactions in period",
    "tx.thisMonth": "this month",

    // Analytics
    "an.week": "This Week",
    "an.month": "This Month",
    "an.quarter": "This Quarter",
    "an.year": "This Year",
    "an.line.title": "Income vs Expenses over time",
    "an.line.sub": "Millions UZS · {n} transactions",
    "an.top.expense": "Top 5 expense categories",
    "an.top.income": "Top 5 income categories",
    "an.top.of": "Top {n} of {total} categories",
    "an.breakdown.title": "Category breakdown",
    "an.breakdown.sub": "Expense categories, sorted by spend",
    "an.col.category": "Category",
    "an.col.total": "Total",
    "an.col.share": "Share",
    "an.col.count": "Count",
    "an.col.trend": "Trend",
    "an.dow.title": "Busiest day of the week",
    "an.dow.sub": "When your team logs the most transactions",
    "an.avg.title": "Average transaction size",
    "an.avg.sub": "Across all types in this period",
    "an.avg.exact": "Exact: {v} UZS",
    "an.avg.typical": "Typical expense sits in the {a}–{b} UZS range.",
    "an.empty.title": "Not enough data yet",
    "an.empty.body": "Log at least 5 transactions to see your financial patterns — trends, categories, and team velocity.",

    // Categories
    "cat.income.title": "Income categories",
    "cat.expense.title": "Expense categories",
    "cat.count": "{n} total",
    "cat.name": "Category name",
    "cat.add": "Add category",
    "cat.locked.tip": "Default category — can't delete",
    "cat.hasTxs.tip": "Has transactions — can't delete",
    "cat.delete.tip": "Delete",
    "cat.info": "Default categories can't be removed — they anchor your reports. Categories with transactions can't be deleted; first reassign or delete those transactions.",
    "cat.info.bold": "Default categories",
    "cat.toast.added": "\"{n}\" added",
    "cat.toast.removed": "\"{n}\" removed",

    // Budgets
    "bg.header.title": "Monthly spending limits",
    "bg.header.sub": "Set limits per expense category. Xisob warns your team before you overspend.",
    "bg.set": "{n} / {total} set",
    "bg.over.1": "{n} category is over budget",
    "bg.over.n": "{n} categories are over budget",
    "bg.warn.1": "{n} category is approaching limit",
    "bg.warn.n": "{n} categories are approaching limit",
    "bg.overBadge": "Over budget",
    "bg.limit": "Monthly limit",
    "bg.setLimit": "Set limit",
    "bg.ofLimit": "{s} of {b} UZS",
    "bg.clickSet": "Click above to set a limit",
    "bg.newBoxTitle": "Add new budget box",
    "bg.newBoxSub": "Choose an expense category and enter a monthly limit",
    "bg.create": "Create",
    "bg.toast.removed": "Budget removed",
    "bg.toast.updated": "Budget updated",
    "bg.empty.title": "No budget limits set",
    "bg.empty.body": "Setting limits helps your team spend more consciously. Start with Salaries or Raw Materials — your biggest line items.",

    // Modal
    "m.title.new": "New transaction",
    "m.title.edit": "Edit transaction",
    "m.logged": "Logged as Dilnoza A. · {d}",
    "m.usd": "≈ {v} UZS at today's rate",
    "m.notePlaceholder": "e.g. Chorsu bazaar — weekly restock",
    "m.validate": "Please fill in amount and category",
    "m.toast.saved": "Transaction saved",

    // Tweaks
    "tw.title": "Tweaks",
    "tw.empty": "Empty state",
    "tw.sidebar": "Sidebar theme",
    "tw.light": "Light",
    "tw.dark": "Dark",
    "tw.system": "System",
    "tw.language": "Language",

    // Category NAMES (income)
    "cn.inc-sales": "Sales",
    "cn.inc-services": "Services",
    "cn.inc-investment": "Investment",
    "cn.inc-wholesale": "Wholesale",
    "cn.inc-export": "Export (USD)",
    "cn.inc-other": "Other",
    // Expense
    "cn.exp-salaries": "Salaries",
    "cn.exp-logistics": "Logistics",
    "cn.exp-rent": "Rent",
    "cn.exp-marketing": "Marketing",
    "cn.exp-utilities": "Utilities",
    "cn.exp-taxes": "Taxes",
    "cn.exp-materials": "Raw Materials",
    "cn.exp-equipment": "Equipment",
    "cn.exp-other": "Other",
  },

  ru: {
    "brand.company": "Чинор Текстиль",
    "brand.workspace": "Рабочее пространство",
    "brand.tg.label": "Telegram-бот",
    "brand.tg.body": "Записывайте операции на узбекском или русском с телефона — @XisobBot",

    "nav.overview": "Обзор",
    "nav.transactions": "Операции",
    "nav.analytics": "Аналитика",
    "nav.categories": "Категории",
    "nav.budgets": "Бюджеты",

    "header.addTx": "Добавить операцию",
    "header.sub.overview": "Этот месяц · Апрель 2026",
    "header.sub.transactions": "Вся активность команды",
    "header.sub.analytics": "Найдите закономерности и отклонения",
    "header.sub.categories": "Организуйте движение денег",
    "header.sub.budgets": "Месячные лимиты расходов",

    "day.0": "Воскресенье", "day.1": "Понедельник", "day.2": "Вторник", "day.3": "Среда",
    "day.4": "Четверг", "day.5": "Пятница", "day.6": "Суббота",
    "day.s.0": "Вс", "day.s.1": "Пн", "day.s.2": "Вт", "day.s.3": "Ср",
    "day.s.4": "Чт", "day.s.5": "Пт", "day.s.6": "Сб",

    "common.cancel": "Отмена",
    "common.save": "Сохранить",
    "common.add": "Добавить",
    "common.clear": "Сбросить",
    "common.clearFilters": "Сбросить фильтры",
    "common.edit": "Редактировать",
    "common.delete": "Удалить",
    "common.optional": "необязательно",
    "common.selectCategory": "Выберите категорию…",
    "common.amount": "Сумма",
    "common.category": "Категория",
    "common.date": "Дата",
    "common.note": "Примечание",
    "common.income": "Доход",
    "common.expense": "Расход",
    "common.all": "Все",
    "common.of": "из",
    "common.total": "всего",
    "common.transactions": "операций",
    "common.transaction": "операция",
    "common.UZS": "сум",
    "common.viewAll": "Все →",

    "ov.hero.label": "Чистый баланс · Апрель 2026",
    "ov.hero.vs": "против {v} сум в марте",
    "ov.mini.income": "Доход",
    "ov.mini.expenses": "Расходы",
    "ov.mini.transactions": "Операции",
    "ov.bars.title": "Доходы и расходы",
    "ov.bars.sub": "Последние 6 месяцев, млн сум",
    "ov.cum": "Совокупный баланс",
    "ov.donut.title": "Куда уходят деньги",
    "ov.donut.sub": "Этот месяц по категориям",
    "ov.donut.total": "Всего",
    "ov.recent.title": "Недавние операции",
    "ov.recent.sub": "Последние 8 записей команды",
    "ov.team.title": "Активность команды",
    "ov.team.sub": "Кто добавлял операции в этом месяце",
    "ov.team.txs": "оп.",
    "ov.empty.title": "Ваша финансовая история начинается здесь",
    "ov.empty.body": "Добавьте первую операцию через Telegram-бот @XisobBot или кнопку ниже. Xisob покажет ваш рост с первого дня.",
    "ov.empty.cta": "Добавить первую операцию",

    "tx.tile.showing": "Показано",
    "tx.tile.showing.suffix": "за всё время",
    "tx.tile.income": "Всего доходов",
    "tx.tile.expense": "Всего расходов",
    "tx.tile.net": "Чистый",
    "tx.search": "Поиск по заметкам и категориям…",
    "tx.allCategories": "Все категории",
    "tx.dateRange": "Период",
    "tx.from": "С",
    "tx.to": "По",
    "tx.col.date": "Дата",
    "tx.col.category": "Категория",
    "tx.col.note": "Заметка",
    "tx.col.addedBy": "Добавил",
    "tx.col.amount": "Сумма",
    "tx.showing": "Показано {a}–{b} из {c}",
    "tx.empty.title": "Операции не найдены",
    "tx.empty.body.filtered": "Сбросьте фильтры, чтобы увидеть все операции.",
    "tx.empty.body.none": "Добавьте первую операцию с помощью кнопки выше.",
    "tx.toast.updated": "Операция обновлена",
    "tx.toast.deleted": "Операция удалена",
    "tx.edit.tip.mine": "Редактировать",
    "tx.edit.tip.others": "Можно редактировать только свои операции",
    "tx.del.tip.mine": "Удалить",
    "tx.del.tip.others": "Можно удалять только свои операции",
    "tx.inPeriod": "{n} операций за период",
    "tx.thisMonth": "этот месяц",

    "an.week": "Неделя",
    "an.month": "Месяц",
    "an.quarter": "Квартал",
    "an.year": "Год",
    "an.line.title": "Доходы и расходы во времени",
    "an.line.sub": "Млн сум · {n} операций",
    "an.top.expense": "Топ 5 категорий расходов",
    "an.top.income": "Топ 5 категорий доходов",
    "an.top.of": "Топ {n} из {total} категорий",
    "an.breakdown.title": "Разбивка по категориям",
    "an.breakdown.sub": "Категории расходов по сумме",
    "an.col.category": "Категория",
    "an.col.total": "Сумма",
    "an.col.share": "Доля",
    "an.col.count": "Кол-во",
    "an.col.trend": "Тренд",
    "an.dow.title": "Самый активный день недели",
    "an.dow.sub": "Когда команда чаще всего добавляет операции",
    "an.avg.title": "Средний размер операции",
    "an.avg.sub": "Все типы за период",
    "an.avg.exact": "Точно: {v} сум",
    "an.avg.typical": "Обычный расход в диапазоне {a}–{b} сум.",
    "an.empty.title": "Пока недостаточно данных",
    "an.empty.body": "Добавьте минимум 5 операций, чтобы увидеть ваши финансовые паттерны — тренды, категории и скорость работы команды.",

    "cat.income.title": "Категории доходов",
    "cat.expense.title": "Категории расходов",
    "cat.count": "всего {n}",
    "cat.name": "Название категории",
    "cat.add": "Добавить категорию",
    "cat.locked.tip": "Стандартная категория — нельзя удалить",
    "cat.hasTxs.tip": "Есть операции — нельзя удалить",
    "cat.delete.tip": "Удалить",
    "cat.info": "Стандартные категории нельзя удалить — они нужны для отчётов. Категории с операциями нельзя удалять; сначала переназначьте или удалите операции.",
    "cat.info.bold": "Стандартные категории",
    "cat.toast.added": "«{n}» добавлена",
    "cat.toast.removed": "«{n}» удалена",

    "bg.header.title": "Месячные лимиты расходов",
    "bg.header.sub": "Задайте лимиты по категориям. Xisob предупредит команду перед перерасходом.",
    "bg.set": "{n} из {total} задано",
    "bg.over.1": "{n} категория превысила бюджет",
    "bg.over.n": "{n} категорий превысили бюджет",
    "bg.warn.1": "{n} категория приближается к лимиту",
    "bg.warn.n": "{n} категорий приближаются к лимиту",
    "bg.overBadge": "Превышен",
    "bg.limit": "Лимит в месяц",
    "bg.setLimit": "Задать лимит",
    "bg.ofLimit": "{s} из {b} сум",
    "bg.clickSet": "Нажмите выше, чтобы задать лимит",
    "bg.newBoxTitle": "Добавить новый лимит",
    "bg.newBoxSub": "Выберите категорию расходов и укажите лимит на месяц",
    "bg.create": "Создать",
    "bg.toast.removed": "Лимит удалён",
    "bg.toast.updated": "Лимит обновлён",
    "bg.empty.title": "Лимиты не заданы",
    "bg.empty.body": "Лимиты помогут команде тратить осознаннее. Начните с Зарплат или Сырья — самых крупных статей.",

    "m.title.new": "Новая операция",
    "m.title.edit": "Редактировать операцию",
    "m.logged": "Добавляет Дилноза А. · {d}",
    "m.usd": "≈ {v} сум по сегодняшнему курсу",
    "m.notePlaceholder": "напр. Чорсу базар — недельное пополнение",
    "m.validate": "Укажите сумму и категорию",
    "m.toast.saved": "Операция сохранена",

    "tw.title": "Настройки",
    "tw.empty": "Пустое состояние",
    "tw.sidebar": "Тема сайдбара",
    "tw.light": "Светлая",
    "tw.dark": "Тёмная",
    "tw.system": "Системная",
    "tw.language": "Язык",

    "cn.inc-sales": "Продажи",
    "cn.inc-services": "Услуги",
    "cn.inc-investment": "Инвестиции",
    "cn.inc-wholesale": "Опт",
    "cn.inc-export": "Экспорт (USD)",
    "cn.inc-other": "Прочее",
    "cn.exp-salaries": "Зарплаты",
    "cn.exp-logistics": "Логистика",
    "cn.exp-rent": "Аренда",
    "cn.exp-marketing": "Маркетинг",
    "cn.exp-utilities": "Коммуналка",
    "cn.exp-taxes": "Налоги",
    "cn.exp-materials": "Сырьё",
    "cn.exp-equipment": "Оборудование",
    "cn.exp-other": "Прочее",
  },

  uz: {
    "brand.company": "Chinor Tekstil",
    "brand.workspace": "Ish maydoni",
    "brand.tg.label": "Telegram bot",
    "brand.tg.body": "Amaliyotlarni telefoningizdan o'zbek yoki rus tilida yozib boring — @XisobBot",

    "nav.overview": "Umumiy",
    "nav.transactions": "Amaliyotlar",
    "nav.analytics": "Tahlil",
    "nav.categories": "Kategoriyalar",
    "nav.budgets": "Byudjetlar",

    "header.addTx": "Amaliyot qo'shish",
    "header.sub.overview": "Shu oy · Aprel 2026",
    "header.sub.transactions": "Jamoangizning barcha faoliyati",
    "header.sub.analytics": "Qoliplar va chetga chiqishlarni toping",
    "header.sub.categories": "Pul harakatini tartibga soling",
    "header.sub.budgets": "Oylik sarflash chegaralari",

    "day.0": "Yakshanba", "day.1": "Dushanba", "day.2": "Seshanba", "day.3": "Chorshanba",
    "day.4": "Payshanba", "day.5": "Juma", "day.6": "Shanba",
    "day.s.0": "Yak", "day.s.1": "Dus", "day.s.2": "Sesh", "day.s.3": "Chor",
    "day.s.4": "Pay", "day.s.5": "Jum", "day.s.6": "Shan",

    "common.cancel": "Bekor qilish",
    "common.save": "Saqlash",
    "common.add": "Qo'shish",
    "common.clear": "Tozalash",
    "common.clearFilters": "Filtrlarni tozalash",
    "common.edit": "Tahrirlash",
    "common.delete": "O'chirish",
    "common.optional": "ixtiyoriy",
    "common.selectCategory": "Kategoriya tanlang…",
    "common.amount": "Summa",
    "common.category": "Kategoriya",
    "common.date": "Sana",
    "common.note": "Izoh",
    "common.income": "Kirim",
    "common.expense": "Chiqim",
    "common.all": "Barchasi",
    "common.of": "dan",
    "common.total": "jami",
    "common.transactions": "amaliyot",
    "common.transaction": "amaliyot",
    "common.UZS": "so'm",
    "common.viewAll": "Barchasi →",

    "ov.hero.label": "Sof qoldiq · Aprel 2026",
    "ov.hero.vs": "Martdagi {v} so'mga nisbatan",
    "ov.mini.income": "Kirim",
    "ov.mini.expenses": "Chiqim",
    "ov.mini.transactions": "Amaliyotlar",
    "ov.bars.title": "Kirim va chiqim",
    "ov.bars.sub": "Oxirgi 6 oy, mln so'm",
    "ov.cum": "Yig'indi qoldiq",
    "ov.donut.title": "Pul qayerga ketyapti",
    "ov.donut.sub": "Shu oy kategoriyalar bo'yicha",
    "ov.donut.total": "Jami",
    "ov.recent.title": "Oxirgi amaliyotlar",
    "ov.recent.sub": "Jamoa bo'yicha oxirgi 8 yozuv",
    "ov.team.title": "Jamoa faoliyati",
    "ov.team.sub": "Shu oyda kim nimani yozdi",
    "ov.team.txs": "ta",
    "ov.empty.title": "Moliyaviy hikoyangiz shu yerdan boshlanadi",
    "ov.empty.body": "Birinchi amaliyotni @XisobBot orqali yoki quyidagi tugma bilan yozing. Xisob birinchi kundan o'sishingizni ko'rsatadi.",
    "ov.empty.cta": "Birinchi amaliyotni qo'shish",

    "tx.tile.showing": "Ko'rsatilmoqda",
    "tx.tile.showing.suffix": "butun davr",
    "tx.tile.income": "Jami kirim",
    "tx.tile.expense": "Jami chiqim",
    "tx.tile.net": "Sof",
    "tx.search": "Izoh yoki kategoriya bo'yicha qidirish…",
    "tx.allCategories": "Barcha kategoriyalar",
    "tx.dateRange": "Sana oralig'i",
    "tx.from": "Dan",
    "tx.to": "Gacha",
    "tx.col.date": "Sana",
    "tx.col.category": "Kategoriya",
    "tx.col.note": "Izoh",
    "tx.col.addedBy": "Qo'shgan",
    "tx.col.amount": "Summa",
    "tx.showing": "{c} ta dan {a}–{b}",
    "tx.empty.title": "Amaliyotlar topilmadi",
    "tx.empty.body.filtered": "Barchasini ko'rish uchun filtrlarni tozalang.",
    "tx.empty.body.none": "Yuqoridagi tugma orqali birinchi amaliyotni qo'shing.",
    "tx.toast.updated": "Amaliyot yangilandi",
    "tx.toast.deleted": "Amaliyot o'chirildi",
    "tx.edit.tip.mine": "Tahrirlash",
    "tx.edit.tip.others": "Faqat o'z amaliyotlaringizni tahrirlashingiz mumkin",
    "tx.del.tip.mine": "O'chirish",
    "tx.del.tip.others": "Faqat o'z amaliyotlaringizni o'chirishingiz mumkin",
    "tx.inPeriod": "davrda {n} amaliyot",
    "tx.thisMonth": "shu oy",

    "an.week": "Hafta",
    "an.month": "Oy",
    "an.quarter": "Chorak",
    "an.year": "Yil",
    "an.line.title": "Vaqt ichida kirim va chiqim",
    "an.line.sub": "Mln so'm · {n} amaliyot",
    "an.top.expense": "Top 5 chiqim kategoriyalari",
    "an.top.income": "Top 5 kirim kategoriyalari",
    "an.top.of": "{total} tadan top {n}",
    "an.breakdown.title": "Kategoriyalar bo'yicha",
    "an.breakdown.sub": "Chiqim kategoriyalari, summa bo'yicha",
    "an.col.category": "Kategoriya",
    "an.col.total": "Jami",
    "an.col.share": "Ulush",
    "an.col.count": "Soni",
    "an.col.trend": "Tendensiya",
    "an.dow.title": "Haftaning eng faol kuni",
    "an.dow.sub": "Jamoa ko'proq qachon amaliyot yozadi",
    "an.avg.title": "O'rtacha amaliyot hajmi",
    "an.avg.sub": "Davrdagi barcha turlar bo'yicha",
    "an.avg.exact": "Aniq: {v} so'm",
    "an.avg.typical": "Odatiy chiqim {a}–{b} so'm oralig'ida.",
    "an.empty.title": "Ma'lumot hali yetarli emas",
    "an.empty.body": "Moliyaviy qoliplarni — tendensiyalar, kategoriyalar va jamoa tezligini ko'rish uchun kamida 5 ta amaliyot qo'shing.",

    "cat.income.title": "Kirim kategoriyalari",
    "cat.expense.title": "Chiqim kategoriyalari",
    "cat.count": "jami {n}",
    "cat.name": "Kategoriya nomi",
    "cat.add": "Kategoriya qo'shish",
    "cat.locked.tip": "Standart kategoriya — o'chirib bo'lmaydi",
    "cat.hasTxs.tip": "Amaliyotlari bor — o'chirib bo'lmaydi",
    "cat.delete.tip": "O'chirish",
    "cat.info": "Standart kategoriyalarni o'chirib bo'lmaydi — ular hisobotlarga kerak. Amaliyotli kategoriyalarni o'chirish uchun avval amaliyotlarni qayta tayinlang yoki o'chiring.",
    "cat.info.bold": "Standart kategoriyalar",
    "cat.toast.added": "«{n}» qo'shildi",
    "cat.toast.removed": "«{n}» o'chirildi",

    "bg.header.title": "Oylik sarflash chegaralari",
    "bg.header.sub": "Har bir chiqim kategoriyasiga chegara belgilang. Xisob ortiqcha sarflashdan oldin ogohlantiradi.",
    "bg.set": "{total} dan {n} belgilangan",
    "bg.over.1": "{n} kategoriya byudjetdan oshdi",
    "bg.over.n": "{n} kategoriya byudjetdan oshdi",
    "bg.warn.1": "{n} kategoriya chegaraga yaqinlashmoqda",
    "bg.warn.n": "{n} kategoriya chegaraga yaqinlashmoqda",
    "bg.overBadge": "Chegaradan oshdi",
    "bg.limit": "Oylik chegara",
    "bg.setLimit": "Chegara belgilash",
    "bg.ofLimit": "{b} so'mdan {s}",
    "bg.clickSet": "Chegara belgilash uchun yuqoriga bosing",
    "bg.newBoxTitle": "Yangi limit qo'shish",
    "bg.newBoxSub": "Chiqim kategoriyasini tanlang va oylik limit kiriting",
    "bg.create": "Yaratish",
    "bg.toast.removed": "Byudjet o'chirildi",
    "bg.toast.updated": "Byudjet yangilandi",
    "bg.empty.title": "Byudjet chegaralari belgilanmagan",
    "bg.empty.body": "Chegaralar jamoaga ongli sarflashga yordam beradi. Eng katta moddalardan — Ish haqi yoki Xom ashyodan boshlang.",

    "m.title.new": "Yangi amaliyot",
    "m.title.edit": "Amaliyotni tahrirlash",
    "m.logged": "Dilnoza A. qo'shmoqda · {d}",
    "m.usd": "≈ {v} so'm bugungi kurs bo'yicha",
    "m.notePlaceholder": "masalan, Chorsu bozori — haftalik ta'minot",
    "m.validate": "Summa va kategoriyani to'ldiring",
    "m.toast.saved": "Amaliyot saqlandi",

    "tw.title": "Sozlamalar",
    "tw.empty": "Bo'sh holat",
    "tw.sidebar": "Sayohat mavzusi",
    "tw.light": "Yorug'",
    "tw.dark": "Qorong'u",
    "tw.system": "Tizim",
    "tw.language": "Til",

    "cn.inc-sales": "Sotuvlar",
    "cn.inc-services": "Xizmatlar",
    "cn.inc-investment": "Investitsiya",
    "cn.inc-wholesale": "Ulgurji",
    "cn.inc-export": "Eksport (USD)",
    "cn.inc-other": "Boshqa",
    "cn.exp-salaries": "Ish haqi",
    "cn.exp-logistics": "Logistika",
    "cn.exp-rent": "Ijara",
    "cn.exp-marketing": "Marketing",
    "cn.exp-utilities": "Kommunal",
    "cn.exp-taxes": "Soliqlar",
    "cn.exp-materials": "Xom ashyo",
    "cn.exp-equipment": "Uskunalar",
    "cn.exp-other": "Boshqa",
  },
};

const LocaleContext = React.createContext({ locale: "ru", setLocale: () => {}, t: (k) => k });

const TEXT_TO_KEY = Object.entries(DICT).reduce((acc, [, dict]) => {
  Object.entries(dict).forEach(([k, v]) => {
    if (typeof v === "string" && !/\{[^}]+\}/.test(v)) acc[v] = k;
  });
  return acc;
}, {});

const LOCALE_TO_HTML = { en: "en", ru: "ru", uz: "uz" };

function translateExactText(text, locale) {
  if (!text || typeof text !== "string") return text;
  const trimmed = text.trim();
  if (!trimmed) return text;
  const key = TEXT_TO_KEY[trimmed];
  if (!key) return text;
  const translated = (DICT[locale] && DICT[locale][key]) || DICT.en[key] || trimmed;
  const leading = text.match(/^\s*/)?.[0] || "";
  const trailing = text.match(/\s*$/)?.[0] || "";
  return `${leading}${translated}${trailing}`;
}

function applyTranslationsToNode(node, locale) {
  if (!node) return;
  if (node.nodeType === Node.TEXT_NODE) {
    const next = translateExactText(node.nodeValue, locale);
    if (next !== node.nodeValue) node.nodeValue = next;
    return;
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return;

  if (node.hasAttribute("placeholder")) {
    const next = translateExactText(node.getAttribute("placeholder"), locale);
    if (next !== node.getAttribute("placeholder")) node.setAttribute("placeholder", next);
  }
  if (node.hasAttribute("title")) {
    const next = translateExactText(node.getAttribute("title"), locale);
    if (next !== node.getAttribute("title")) node.setAttribute("title", next);
  }

  node.childNodes.forEach((child) => applyTranslationsToNode(child, locale));
}

function LocaleProvider({ children }) {
  const [locale, setLocale] = React.useState(() => {
    try { return localStorage.getItem("xisob.locale") || "ru"; } catch (e) { return "ru"; }
  });
  const changeLocale = (l) => {
    setLocale(l);
    try { localStorage.setItem("xisob.locale", l); } catch (e) {}
  };
  const t = React.useCallback((key, params) => {
    const dict = DICT[locale] || DICT.en;
    let str = dict[key];
    if (str === undefined) str = DICT.en[key] || key;
    if (params) {
      Object.keys(params).forEach((p) => {
        str = str.replace(new RegExp("\\{" + p + "\\}", "g"), params[p]);
      });
    }
    return str;
  }, [locale]);
  React.useEffect(() => {
    window.__xisobLocale = locale;
    document.documentElement.lang = LOCALE_TO_HTML[locale] || "ru";

    const apply = () => applyTranslationsToNode(document.body, locale);
    apply();

    const observer = new MutationObserver(() => apply());
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["placeholder", "title"],
    });
    return () => observer.disconnect();
  }, [locale]);

  return (
    <LocaleContext.Provider value={{ locale, setLocale: changeLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

const useT = () => React.useContext(LocaleContext);

// Translate a category object's name
const tCat = (t, cat) => {
  if (!cat) return "";
  const key = "cn." + cat.id;
  const translated = t(key);
  return translated === key ? cat.name : translated;
};

// Translate date: month short + day, optionally with year
const tFmtDate = (t, dateStr, opts = {}) => {
  const { locale } = arguments.length > 3 ? arguments[3] : { locale: "en" };
  const d = new Date(dateStr);
  const monthsEn = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  if (opts.short) return `${monthsEn[d.getMonth()]} ${d.getDate()}`;
  return `${monthsEn[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
};

Object.assign(window, {
  LocaleProvider,
  LocaleContext,
  useT,
  tCat,
  I18N_DICT: DICT,
  getXisobLocale: () => window.__xisobLocale || "ru",
});
