document.addEventListener("DOMContentLoaded", () => {

  const home = document.getElementById("home")
  const add = document.getElementById("add")

  const openAdd = document.getElementById("open-add")
  const save = document.getElementById("save-expense")

  const amountDisplay = document.querySelector(".amount-display")
  const keypadButtons = document.querySelectorAll(".keypad button")
  const categorySelect = document.getElementById("category")
  const categoriesContainer = document.querySelector(".categories")

  const dateLabel = document.getElementById("date-label")
  const prevDay = document.getElementById("prev-day")
  const nextDay = document.getElementById("next-day")
  const openSettings = document.getElementById("open-settings")
  const settingsModal = document.getElementById("settings")
  const closeSettings = document.getElementById("close-settings")
  const saveSettings = document.getElementById("save-settings")
  const dailyLimitInput = document.getElementById("daily-limit")
  const exportCsvBtn = document.getElementById("export-csv")
  const progressFill = document.querySelector(".progress-fill")
  const todayAmountEl = document.querySelector(".today-amount")
  const dailyLimitEl = document.querySelector(".daily-limit")
  const openTransactions = document.getElementById("open-transactions")
  const openWeekly = document.getElementById("open-weekly")
  const transactionsScreen = document.getElementById("transactions")
  const weeklyScreen = document.getElementById("weekly")
  const transactionsList = document.getElementById("transactions-list")
  const commentInput = document.getElementById("comment")
  const cancelAdd = document.getElementById("cancel-add")
  const weekLabel = document.getElementById("week-label")
  const prevWeek = document.getElementById("prev-week")
  const nextWeek = document.getElementById("next-week")
  const weeklyChart = document.getElementById("weekly-chart")
  const weeklyProgressFill = document.querySelector('.weekly-progress-fill')
  const weekToDateEl = document.querySelector('.week-to-date')
  const weeklyBudgetEl = document.querySelector('.weekly-budget')
  const backFromTrans = document.getElementById("back-from-trans")
  const backFromWeek = document.getElementById("back-from-week")
  const weeklyCategoriesEl = document.getElementById("weekly-categories")
  const weeklyBudgetValue = document.querySelector(".weekly-budget-value")
  const viewWeeklyBtn = document.getElementById("view-weekly")

  // 🔒 force correct start screen (iphone safari fix)
  home.classList.add("active")
  add.classList.remove("active")

  let currentAmount = ""
  let expenses = []
  try {
    const raw = localStorage.getItem("expenses")
    expenses = raw ? JSON.parse(raw) : []
  } catch (err) {
    console.error("Failed to parse expenses from localStorage:", err)
    localStorage.removeItem("expenses")
    expenses = []
  }

  // Add IDs to existing expenses that don't have them
  let hasChanges = false
  expenses.forEach(expense => {
    if (!expense.id) {
      expense.id = Date.now() + Math.random().toString(36).substr(2, 9)
      hasChanges = true
    }
  })
  if (hasChanges) {
    try {
      localStorage.setItem("expenses", JSON.stringify(expenses))
      console.log("Added IDs to existing expenses")
    } catch (err) {
      console.error("Failed to save updated expenses with IDs:", err)
    }
  }

  let currentDate = new Date()
  currentDate.setHours(0,0,0,0)

  // settings
  let settings = { dailyLimit: 0 }
  try {
    const sRaw = localStorage.getItem("settings")
    settings = sRaw ? JSON.parse(sRaw) : settings
  } catch (err) {
    console.error("Failed to load settings:", err)
    settings = { dailyLimit: 0 }
  }

  // init settings inputs
  if (dailyLimitInput) dailyLimitInput.value = settings.dailyLimit || ""

  /* date helpers */
  function formatDate(d) {
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    }).toLowerCase()
  }

  function renderDate() {
    dateLabel.textContent = formatDate(currentDate)
  }

  function computeTodayTotal() {
    // compute total for the currently selected date (`currentDate`)
    const today = new Date(currentDate)
    today.setHours(0,0,0,0)
    let total = 0
    expenses.forEach(e => {
      const d = new Date(e.date)
      d.setHours(0,0,0,0)
      if (d.getTime() === today.getTime()) total += Number(e.amount) || 0
    })
    return total
  }

  function updateProgress() {
    const todayTotal = computeTodayTotal()
    const limit = Number(settings.dailyLimit) || 0
    const pct = limit > 0 ? Math.min(100, (todayTotal / limit) * 100) : 0
    const overBudgetPct = limit > 0 ? (todayTotal / limit) * 100 : 0
    
    if (progressFill) {
      progressFill.style.width = pct + "%"
      // Add or remove over-budget class
      if (overBudgetPct > 100) {
        progressFill.classList.add('over-budget')
      } else {
        progressFill.classList.remove('over-budget')
      }
    }
    if (todayAmountEl) todayAmountEl.textContent = `$${todayTotal.toFixed(2)}`
    if (dailyLimitEl) dailyLimitEl.textContent = `$${(limit || 0).toFixed(2)}`
    
    // update weekly progress (week-to-date)
    try {
      if (weeklyProgressFill && weekToDateEl && weeklyBudgetEl) {
        // determine the week being viewed (if any), otherwise current week
        const viewedWeekRef = window._weekRef ? startOfWeek(window._weekRef) : startOfWeek(new Date())
        const isViewingCurrentWeek = viewedWeekRef.getTime() === startOfWeek(new Date()).getTime()
        const weekStart = viewedWeekRef
        let weekEnd = new Date(weekStart)
        // if viewing the current week, show progress up to today; otherwise show full week total
        if (isViewingCurrentWeek) {
          weekEnd = new Date(); weekEnd.setHours(0,0,0,0)
        } else {
          weekEnd.setDate(weekEnd.getDate() + 6)
        }

        let weekSum = 0
        expenses.forEach(e => {
          const d = new Date(e.date); d.setHours(0,0,0,0)
          if (d.getTime() >= weekStart.getTime() && d.getTime() <= weekEnd.getTime()) {
            weekSum += Number(e.amount || 0)
          }
        })

        const weeklyBudget = (Number(settings.dailyLimit) || 0) * 7
        const wpct = weeklyBudget > 0 ? Math.min(100, (weekSum / weeklyBudget) * 100) : 0
        const overWeeklyBudgetPct = weeklyBudget > 0 ? (weekSum / weeklyBudget) * 100 : 0
        
        weeklyProgressFill.style.width = wpct + "%"
        // Add or remove over-budget class for weekly progress
        if (overWeeklyBudgetPct > 100) {
          weeklyProgressFill.classList.add('over-budget')
        } else {
          weeklyProgressFill.classList.remove('over-budget')
        }
        
        weekToDateEl.textContent = `$${weekSum.toFixed(2)}`
        weeklyBudgetEl.textContent = `$${weeklyBudget.toFixed(2)}`
      }
    } catch (err) { console.error('weekly progress update failed', err) }
  }

  /* screen switching */
  openAdd.addEventListener("click", () => {
    // Add growing animation
    openAdd.classList.add('animate')
    
    // Create full-screen transition overlay
    const overlay = document.createElement('div')
    overlay.className = 'transition-overlay'
    document.body.appendChild(overlay)
    
    // Create ripple effect for additional feedback
    const ripple = document.createElement('div')
    ripple.className = 'ripple'
    document.body.appendChild(ripple)
    
    // Navigate to add screen after short delay to let animation start
    setTimeout(() => {
      home.classList.remove("active")
      add.classList.add("active")
      currentAmount = ""
      updateAmount()
    }, 200)
    
    // Remove animation elements after animation completes
    setTimeout(() => {
      openAdd.classList.remove('animate')
      if (overlay.parentNode) {
        overlay.parentNode.removeChild(overlay)
      }
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple)
      }
    }, 800)
  })

  // open transactions / weekly
  if (openTransactions) openTransactions.addEventListener("click", () => {
    // show transactions screen
    [home, add, weeklyScreen, transactionsScreen].forEach(s => s.classList.remove("active"))
    transactionsScreen.classList.add("active")
    renderTransactions()
  })
  if (openWeekly) openWeekly.addEventListener("click", () => {
    [home, add, weeklyScreen, transactionsScreen].forEach(s => s.classList.remove("active"))
    weeklyScreen.classList.add("active")
    // set weekly reference to currentDate
    if (!window._weekRef) window._weekRef = new Date(currentDate)
    renderWeekly(window._weekRef)
  })

  if (backFromTrans) backFromTrans.addEventListener('click', () => {
    [home, add, weeklyScreen, transactionsScreen].forEach(s => s.classList.remove('active'))
    home.classList.add('active')
  })
  if (backFromWeek) backFromWeek.addEventListener('click', () => {
    [home, add, weeklyScreen, transactionsScreen].forEach(s => s.classList.remove('active'))
    home.classList.add('active')
  })

  // settings modal
  if (openSettings) openSettings.addEventListener("click", () => {
    if (settingsModal) settingsModal.hidden = false
  })
  if (closeSettings) closeSettings.addEventListener("click", () => {
    if (settingsModal) settingsModal.hidden = true
  })
  if (saveSettings) saveSettings.addEventListener("click", () => {
    const val = parseFloat(dailyLimitInput.value)
    settings.dailyLimit = Number.isNaN(val) ? 0 : val
    try { localStorage.setItem("settings", JSON.stringify(settings)) } catch (err) { console.error(err) }
    if (settingsModal) settingsModal.hidden = true
    updateProgress()
  })

  if (exportCsvBtn) exportCsvBtn.addEventListener("click", () => {
    // build CSV
    const header = ["amount","category","date"]
    const rows = expenses.map(e => [e.amount, e.category, e.date])
    const csv = [header, ...rows].map(r => r.join(",")).join("\n")
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'expenses.csv'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  })

  save.addEventListener("click", () => {
    if (!currentAmount) return

    const num = parseFloat(currentAmount)
    if (Number.isNaN(num)) return

    const comment = commentInput ? commentInput.value.trim() : ""

    expenses.push({
      id: Date.now() + Math.random().toString(36).substr(2, 9), // unique ID
      amount: num,
      category: categorySelect ? categorySelect.value : "other",
      comment: comment,
      date: new Date().toISOString()
    })

    try {
      localStorage.setItem("expenses", JSON.stringify(expenses))
    } catch (err) {
      console.error("Failed to save expenses:", err)
    }

    add.classList.remove("active")
    home.classList.add("active")
    renderHome()
    updateProgress()
  })

  // Cancel button on pay/add screen — return to home and clear current amount
  if (cancelAdd) cancelAdd.addEventListener('click', () => {
    add.classList.remove('active')
    home.classList.add('active')
    currentAmount = ''
    try { updateAmount() } catch (err) { }
  })

  // Delete transaction functions
  function confirmDeleteTransaction(id, amount, category) {
    if (confirm(`Delete this transaction?\n\n$${Number(amount).toFixed(2)} - ${category}`)) {
      deleteTransaction(id)
    }
  }

  function deleteTransaction(id) {
    const index = expenses.findIndex(expense => expense.id === id)
    if (index !== -1) {
      expenses.splice(index, 1)
      try {
        localStorage.setItem("expenses", JSON.stringify(expenses))
      } catch (err) {
        console.error("Failed to save expenses after deletion:", err)
      }
      // Re-render the transactions list and update other views
      renderTransactions()
      updateProgress()
      renderHome()
    }
  }

  function renderTransactions() {
    if (!transactionsList) return
    transactionsList.innerHTML = ''
    // sort newest -> oldest
    const sorted = expenses.slice().sort((a,b) => new Date(b.date) - new Date(a.date))
    sorted.forEach(e => {
      const row = document.createElement('div')
      row.className = 'transaction'
      row.dataset.id = e.id // Store the ID for later reference

      const rowInner = document.createElement('div')
      rowInner.className = 'row-inner'

      const meta = document.createElement('div')
      meta.className = 'meta'
      const cat = document.createElement('div')
      cat.className = 'category'
      cat.textContent = e.category
      const comment = document.createElement('div')
      comment.className = 'comment'
      comment.textContent = e.comment || ''
      meta.appendChild(cat)
      meta.appendChild(comment)
      const amt = document.createElement('div')
      amt.className = 'amount'
      amt.textContent = `$${Number(e.amount).toFixed(2)}`

      // Create delete button
      const actions = document.createElement('div')
      actions.className = 'actions'
      const deleteBtn = document.createElement('button')
      deleteBtn.className = 'delete-btn'
      deleteBtn.textContent = 'Delete'
      deleteBtn.addEventListener('click', (event) => {
        event.stopPropagation() // Prevent row click events
        confirmDeleteTransaction(e.id, e.amount, e.category)
      })
      actions.appendChild(deleteBtn)

      rowInner.appendChild(meta)
      rowInner.appendChild(amt)
      rowInner.appendChild(actions)

      row.appendChild(rowInner)
      transactionsList.appendChild(row)
    })
  }

  function startOfWeek(d) {
    const dt = new Date(d)
    const day = dt.getDay()
    dt.setDate(dt.getDate() - day)
    dt.setHours(0,0,0,0)
    return dt
  }

  function formatShort(d) {
    return d.toLocaleDateString('en-US', { month:'short', day:'numeric' })
  }

  function renderWeekly(refDate) {
    if (!weeklyChart) return
    const start = startOfWeek(refDate)
    // label
    const end = new Date(start)
    end.setDate(end.getDate() + 6)
    if (weekLabel) weekLabel.textContent = `${formatShort(start)} - ${formatShort(end)}`

    // compute sums per day
    const days = []
    for (let i=0;i<7;i++) {
      const d = new Date(start)
      d.setDate(d.getDate() + i)
      d.setHours(0,0,0,0)
      const total = expenses.reduce((sum,e) => {
        const ed = new Date(e.date); ed.setHours(0,0,0,0)
        return sum + ((ed.getTime() === d.getTime()) ? Number(e.amount||0) : 0)
      }, 0)
      days.push({ date: d, total })
    }

    // prepare axis and bars (fixed physical size handled by CSS)
    const maxData = Math.max(...days.map(d=>d.total), 0)
    // round top value up to nearest 50 for clean axis (e.g. 525 -> 550)
    let topValue = Math.ceil((Math.max(maxData, Number(settings.dailyLimit) || 0)) / 50) * 50
    if (topValue === 0) topValue = 50
    weeklyChart.innerHTML = ''
    const axis = document.createElement('div')
    axis.className = 'weekly-axis'
    // 5 ticks (top -> bottom)
    for (let i=4;i>=0;i--) {
      const v = topValue * (i/4)
      const rounded = Math.round(v / 10) * 10
      const tick = document.createElement('div')
      tick.textContent = `$${rounded}`
      axis.appendChild(tick)
    }
    const container = document.createElement('div')
    container.className = 'weekly-container'
    days.forEach(day => {
      const el = document.createElement('div')
      el.className = 'day-bar'
      const bar = document.createElement('div')
      bar.className = 'bar'
      const pct = topValue > 0 ? (day.total / topValue) : 0
      const maxHeight = 140
      const h = pct * maxHeight
      bar.style.height = `${h}px`
      const lbl = document.createElement('div')
      lbl.className = 'label'
      lbl.textContent = day.date.toLocaleDateString('en-US', { weekday: 'short' })
      el.appendChild(bar)
      el.appendChild(lbl)
      container.appendChild(el)
    })
    weeklyChart.appendChild(axis)
    weeklyChart.appendChild(container)

    // average and summary
    const totalWeek = days.reduce((s,d)=>s+d.total,0)
    const avg = totalWeek / 7
    const avgEl = document.createElement('div')
    avgEl.className = 'week-average'
    avgEl.textContent = `Avg: $${avg.toFixed(2)}`
    weeklyChart.appendChild(avgEl)

    // weekly budget and category totals
    if (weeklyBudgetValue) weeklyBudgetValue.textContent = `$${((Number(settings.dailyLimit)||0)*7).toFixed(2)}`
    if (weeklyCategoriesEl) {
      weeklyCategoriesEl.innerHTML = ''
      const catTotals = {}
      expenses.forEach(e => {
        const ed = new Date(e.date); ed.setHours(0,0,0,0)
        if (ed.getTime() >= start.getTime() && ed.getTime() <= end.getTime()) {
          catTotals[e.category] = (catTotals[e.category] || 0) + Number(e.amount||0)
        }
      })
      Object.keys(catTotals).forEach(cat => {
        const el = document.createElement('div')
        el.className = 'cat'
        el.textContent = `${cat}: $${catTotals[cat].toFixed(2)}`
        weeklyCategoriesEl.appendChild(el)
      })
    }
    // update weekly progress to reflect this viewed week
    try { updateProgress() } catch(err) { console.error(err) }
  }

  // monthly view removed — renderMonthly intentionally omitted to keep app stable

  if (viewWeeklyBtn) viewWeeklyBtn.addEventListener('click', ()=>{ try { viewWeeklyBtn.classList.add('active-toggle'); if (!window._weekRef) window._weekRef = new Date(currentDate); renderWeekly(window._weekRef) } catch(err){ console.error(err) } })

  if (prevWeek) prevWeek.addEventListener('click', () => {
    if (!window._weekRef) window._weekRef = new Date(currentDate)
    window._weekRef.setDate(window._weekRef.getDate() - 7)
    try { renderWeekly(window._weekRef) } catch(err){console.error(err)}
  })
  if (nextWeek) nextWeek.addEventListener('click', () => {
    if (!window._weekRef) window._weekRef = new Date(currentDate)
    window._weekRef.setDate(window._weekRef.getDate() + 7)
    try { renderWeekly(window._weekRef) } catch(err){console.error(err)}
  })

  /* keypad */
  keypadButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const v = btn.textContent

      if (v === "⌫") {
        currentAmount = currentAmount.slice(0, -1)
      } else if (v === ".") {
        if (!currentAmount.includes(".")) currentAmount += "."
      } else {
        currentAmount += v
      }

      updateAmount()
    })
  })

  function updateAmount() {
    if (!amountDisplay) return
    const num = parseFloat(currentAmount)
    const text = currentAmount && !Number.isNaN(num) ? `$${num.toFixed(2)}` : "$0.00"
    amountDisplay.textContent = text

    // scale the displayed amount so large numbers fit and small numbers stay huge
    try {
      // number of visible chars (exclude currency symbol and spaces)
      const visible = text.replace(/[^0-9\.]/g, '')
      const chars = Math.max(1, visible.length)

      // base large size (px) for small numbers; reduce as digits grow
      const base = 140
      // reduce 18px per extra digit beyond 4, but clamp to a minimum size
      const extra = Math.max(0, chars - 4)
      const size = Math.max(40, base - extra * 18)
      amountDisplay.style.fontSize = size + 'px'
      // slightly tighten line-height for large sizes
      amountDisplay.style.lineHeight = size > 80 ? '0.95' : '1.0'
    } catch (err) {
      // ignore sizing failures
      console.error('amount scaling failed', err)
    }
  }

  /* date navigation */
  prevDay.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1)
    renderDate()
    renderHome()
    updateProgress()
  })

  nextDay.addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1)
    renderDate()
    renderHome()
    updateProgress()
  })

  /* render categories */
  function renderHome() {
    categoriesContainer.innerHTML = ""
    const totals = {}

    // initialize totals with available categories (so empty ones show)
    const optionEls = categorySelect ? Array.from(categorySelect.options) : []
    optionEls.forEach(o => { totals[o.value] = 0 })

    // sum only expenses for the currently selected date
    expenses.forEach(e => {
      const d = new Date(e.date)
      d.setHours(0,0,0,0)
      if (d.getTime() !== currentDate.getTime()) return
      totals[e.category] = (totals[e.category] || 0) + Number(e.amount || 0)
    })

    Object.keys(totals).forEach(cat => {
      const row = document.createElement("div")
      row.className = "row"
      row.innerHTML = `<span>${cat}</span><span>$${totals[cat].toFixed(2)}</span>`
      categoriesContainer.appendChild(row)
    })
  }

  /* init */
  renderDate()
  renderHome()
  updateProgress()

})
