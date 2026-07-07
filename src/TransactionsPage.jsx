// src/TransactionsPage.jsx
import React, { useState, useEffect, useRef } from "react";
import Chart from "chart.js/auto";
import {
  getTransactions,
  addTransaction as apiAddTransaction,
  deleteTransaction as apiDeleteTransaction,
} from "./api/transactionsApi";
import { t } from "./translations";
import "./TransactionsPage.scss";

export default function TransactionsPage({ lang = 'en-IN' }) {
  const [transactions, setTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [newTx, setNewTx] = useState({ type: "expense", label: "", amount: "", date: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");

  const chartRef = useRef(null);
  const chartInstanceRef = useRef(null);

  // totals
  const totalIncome = transactions.filter((t) => t.type === "income").reduce((s, t) => s + Number(t.amount), 0);
  const totalExpense = transactions.filter((t) => t.type === "expense").reduce((s, t) => s + Number(t.amount), 0);
  const totalSaving = transactions.filter((t) => t.type === "saving").reduce((s, t) => s + Number(t.amount), 0);

  // smart insights
  let insightMsg = "Add transactions to see insights!";
  if (totalExpense > totalIncome && totalIncome > 0) {
    insightMsg = "Warning: Your expenses exceed your income this period.";
  } else if (totalSaving > 0) {
    insightMsg = `Great job! You've set aside ₹${totalSaving.toLocaleString()} in savings.`;
  } else if (totalIncome > 0 && totalExpense > 0) {
    insightMsg = `You've spent ${Math.round((totalExpense / totalIncome) * 100)}% of your income.`;
  }

  // filtered and sorted list
  const filteredTransactions = transactions.filter(t => {
    const matchesFilter = filterType === "all" || t.type === filterType;
    const matchesSearch = t.label.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "newest") return new Date(b.date) - new Date(a.date);
    if (sortBy === "oldest") return new Date(a.date) - new Date(b.date);
    if (sortBy === "highest") return b.amount - a.amount;
    if (sortBy === "lowest") return a.amount - b.amount;
    return 0;
  });

  // export to CSV
  const handleExportCSV = () => {
    if (filteredTransactions.length === 0) return alert("No transactions to export.");
    const headers = ["Date", "Type", "Description", "Amount (INR)"];
    const rows = filteredTransactions.map(t => [`="${t.date}"`, t.type, t.label, t.amount]);
    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.map(cell => `"${cell}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `transactions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // load transactions from backend
  useEffect(() => {
    let mounted = true;
    async function fetchTxns() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTransactions(); // expects array
        if (!mounted) return;
        const normalized = (data || []).map((d) => ({
          id: d._id || d.id || Date.now().toString(),
          type: d.type || "expense",
          label: d.title || d.label || "Untitled",
          amount: Number(d.amount || 0),
          date: d.date ? String(d.date).slice(0, 10) : new Date().toISOString().slice(0, 10),
          raw: d,
        }));
        
        setTransactions(normalized);
      } catch (err) {
        console.error("fetch error", err);
        setError("Could not load transactions. Check backend.");
      } finally {
        setLoading(false);
      }
    }
    fetchTxns();
    return () => (mounted = false);
  }, []);

  // draw doughnut chart
  useEffect(() => {
    if (!chartRef.current) return;
    if (chartInstanceRef.current) chartInstanceRef.current.destroy();

    chartInstanceRef.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels: ["Income", "Expenses", "Savings"],
        datasets: [
          {
            data: [totalIncome, totalExpense, totalSaving],
            backgroundColor: ["#4caf50", "#ff944d", "#2196f3"],
            borderColor: "#0b1722",
            borderWidth: 2,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        animation: { animateScale: true, animateRotate: true, duration: 1200, easing: 'easeOutQuart' },
        plugins: {
          legend: { display: false },
          tooltip: { 
            bodyFont: { size: 14, family: 'Inter' }, 
            titleFont: { size: 14, family: 'Inter' },
            padding: 12,
            backgroundColor: 'rgba(15, 23, 42, 0.9)',
            cornerRadius: 8
          },
        },
      },
    });

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
        chartInstanceRef.current = null;
      }
    };
  }, [totalIncome, totalExpense, totalSaving]);

  // Add transaction (optimistic add)
  async function handleAddTransaction(e) {
    e.preventDefault();
    if (!newTx.label || !newTx.amount || !newTx.date) return alert("Please fill all fields");

    const payload = {
      title: newTx.label,
      amount: Number(newTx.amount),
      type: newTx.type,
      date: newTx.date,
    };

    // optimistic UI: add locally while request is pending
    const tempId = `temp-${Date.now()}`;
    const optimistic = {
      id: tempId,
      type: payload.type,
      label: payload.title,
      amount: payload.amount,
      date: payload.date,
    };
    setTransactions((prev) => [optimistic, ...prev]);
    setNewTx({ type: "expense", label: "", amount: "", date: "" });
    setSuccessMsg(""); // clear old msg
    setError(null);
    setLoading(true);

    try {
      const created = await apiAddTransaction(payload);
      const normalized = {
        id: created._id || created.id || tempId,
        type: created.type || payload.type,
        label: created.title || created.label || payload.title,
        amount: Number(created.amount ?? payload.amount),
        date: created.date ? (created.date.slice ? created.date.slice(0, 10) : created.date) : payload.date,
        raw: created,
      };
      // replace temp item with created
      setTransactions((prev) => prev.map((t) => (t.id === tempId ? normalized : t)));
      setSuccessMsg("Transaction added successfully!");
      setTimeout(() => setSuccessMsg(""), 2500);
    } catch (err) {
      console.error("Add txn failed:", err);
      // rollback optimistic
      setTransactions((prev) => prev.filter((t) => t.id !== tempId));
      const serverMessage = err?.message || "Network error";
      setError(`Failed to add transaction. ${serverMessage}`);
      alert(`Failed to add transaction. ${serverMessage}`);
    } finally {
      setLoading(false);
    }
  }

  // delete handler
  async function handleDelete(id) {
    if (!window.confirm("Delete this transaction?")) return;
    setLoading(true);
    setError(null);
    try {
      if (String(id).startsWith("local-") || String(id).startsWith("temp-")) {
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      } else {
        await apiDeleteTransaction(id);
        setTransactions((prev) => prev.filter((t) => t.id !== id));
      }
      setSuccessMsg("Transaction deleted");
      setTimeout(() => setSuccessMsg(""), 1800);
    } catch (err) {
      console.error("delete error", err);
      setError("Failed to delete transaction.");
      alert("Failed to delete transaction.");
    } finally {
      setLoading(false);
    }
  }

 

  return (
    <div className="tx-page">
      
      <div className="bg-animation"></div>

      <div className="tx-page-header">
        <h2>{t('Transactions', lang)}</h2>
      </div>

      <div className="tx-hero">
        <div className="tx-summary" aria-hidden>
          <div className="tx-badge income" title="Total income">
            <div className="emoji-wrap">💰</div>
            <div>
              <div className="amount">₹{totalIncome.toLocaleString()}</div>
              <div className="label">{t('Income', lang)}</div>
            </div>
          </div>

          <div className="tx-badge expense" title="Total expenses">
            <div className="emoji-wrap">🛒</div>
            <div>
              <div className="amount">₹{totalExpense.toLocaleString()}</div>
              <div className="label">{t('Expenses', lang)}</div>
            </div>
          </div>

          <div className="tx-badge saving" title="Total savings">
            <div className="emoji-wrap">🌱</div>
            <div>
              <div className="amount">₹{totalSaving.toLocaleString()}</div>
              <div className="label">{t('TotalSavings', lang)}</div>
            </div>
          </div>
        </div>

        <div style={{ flex: "0 0 320px", minWidth: "320px" }}>
          <div className="tx-chart-wrap">
            <canvas ref={chartRef}></canvas>
          </div>
          <div className="tx-legend" aria-hidden>
            <div className="legend-item"><span className="swatch" style={{ background: "#10b981" }} />{t('Income', lang)}</div>
            <div className="legend-item"><span className="swatch" style={{ background: "#ef4444" }} />{t('Expenses', lang)}</div>
            <div className="legend-item"><span className="swatch" style={{ background: "#3b82f6" }} />{t('TotalSavings', lang)}</div>
          </div>
          
          <div className="tx-insight">
            <span style={{ fontSize: "20px" }}>💡</span>
            {insightMsg}
          </div>
        </div>
      </div>

      {loading && <div style={{ margin: "12px 0", color: "#3b82f6", fontWeight: 600 }}>Working…</div>}
      {error && <div style={{ margin: "12px 0", color: "#ef4444", fontWeight: 700 }}>{error}</div>}

      <div className="tx-main-content">
        <div>
          <div className="tx-list-header">
            <h3>Recent History</h3>
          </div>
          
          <div className="tx-controls">
            <div className="tx-search">
              <svg className="icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
              <input 
                type="text" 
                placeholder="Search transactions..." 
                value={searchQuery} 
                onChange={e => setSearchQuery(e.target.value)} 
              />
            </div>
            
            <select className="tx-sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="highest">Highest Amount</option>
              <option value="lowest">Lowest Amount</option>
            </select>
            
            <button className="btn-export" onClick={handleExportCSV} title="Export to CSV">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Export
            </button>
          </div>

          <div className="tx-filters">
            <button className={`filter-btn ${filterType === 'all' ? 'active' : ''}`} onClick={() => setFilterType('all')}>All</button>
            <button className={`filter-btn ${filterType === 'income' ? 'active' : ''}`} onClick={() => setFilterType('income')}>Income</button>
            <button className={`filter-btn ${filterType === 'expense' ? 'active' : ''}`} onClick={() => setFilterType('expense')}>Expenses</button>
            <button className={`filter-btn ${filterType === 'saving' ? 'active' : ''}`} onClick={() => setFilterType('saving')}>Savings</button>
          </div>
          
          <div className="tx-list" aria-live="polite">
            {filteredTransactions.length === 0 ? (
              <div className="empty-state">
                <div className="icon">🧾</div>
                <h4>No transactions found</h4>
                <p>{transactions.length === 0 ? "Add your first income or expense to start tracking!" : "Try adjusting your filters or search query."}</p>
              </div>
            ) : (
              filteredTransactions.map((txn) => (
                <div className="tx-card" key={txn.id}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div className="icon">{txn.type === "income" ? "💰" : txn.type === "expense" ? "🛒" : "🌱"}</div>
                    <div className="meta">
                      <div className="title">{t(txn.label, lang) /* Optional localized category */}</div>
                      <div className="date">{txn.date}</div>
                    </div>
                  </div>

                  <div className="right">
                    <div className={`tx-amount ${txn.type === "income" ? "income" : txn.type === "expense" ? "expense" : "saving"}`}>
                      {txn.type === "income" ? "+" : "-"} ₹{Number(txn.amount).toLocaleString()}
                    </div>
                    <button className="del" onClick={() => handleDelete(txn.id)} title="Delete" aria-label="Delete transaction">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="tx-form">
          <h3>
            <span style={{ fontSize: "24px" }}>✨</span> {t('AddTransaction', lang)}
          </h3>
          <form onSubmit={handleAddTransaction}>
            <div className="form-group">
              <label>Transaction Type</label>
              <select value={newTx.type} onChange={(e) => setNewTx({ ...newTx, type: e.target.value })}>
                <option value="income">{t('Income', lang)}</option>
                <option value="expense">{t('Expenses', lang)}</option>
                <option value="saving">{t('TotalSavings', lang)}</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <input type="text" placeholder={t('WhatFor', lang)} value={newTx.label} onChange={(e) => setNewTx({ ...newTx, label: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Amount (₹)</label>
              <input type="number" min="0" step="0.01" placeholder={t('AmountLabel', lang)} value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} required />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input type="date" value={newTx.date} onChange={(e) => setNewTx({ ...newTx, date: e.target.value })} required />
            </div>

            <div className="form-actions">
              <button type="submit" disabled={loading} className="btn-submit">
                <span>{t('Add', lang)}</span>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
              <button type="button" onClick={() => setNewTx({ type: "expense", label: "", amount: "", date: "" })} className="btn-reset">
                {t('Reset', lang)}
              </button>
            </div>
          </form>
        </div>
      </div>

      {successMsg && (
        <div className="tx-toast">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          {successMsg}
        </div>
      )}
    </div>
  );
}
