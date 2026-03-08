import React, { useState, useEffect, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import * as api from "../../services/superadminAPI";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function fmtCurrency(n) {
  if (n === undefined || n === null) return "—";
  return (
    "$" +
    Number(n).toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}

function fmtDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function MethodBadge({ method }) {
  const map = {
    cash: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    card: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    bank_transfer: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    mobile_money: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  };
  const labels = {
    cash: "Cash",
    card: "Card",
    bank_transfer: "Bank Transfer",
    mobile_money: "Mobile Money",
  };
  const cls =
    map[method] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}
    >
      {labels[method] || method || "—"}
    </span>
  );
}

function InvoiceStatusBadge({ status }) {
  const map = {
    paid: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    unpaid: "bg-slate-500/10 text-slate-400 border-slate-500/20",
    partial: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    overdue: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  const cls =
    map[status] || "bg-slate-500/10 text-slate-400 border-slate-500/20";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${cls}`}
    >
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "—"}
    </span>
  );
}

// ─── Mini Bar Chart ───────────────────────────────────────────────────────────
function MonthlyRevenueChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.revenue || 0), 1);

  if (!data.length) {
    return (
      <div className="flex items-end justify-center gap-2 h-28">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full rounded-t bg-white/10 animate-pulse h-12" />
            <span className="text-[10px] text-slate-600 w-full text-center truncate">
              —
            </span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-end justify-between gap-1.5 h-28">
      {data.map((d) => {
        const pct = Math.max(((d.revenue || 0) / max) * 100, 2);
        const label = d.month
          ? new Date(d.month + "-01").toLocaleDateString("en-US", {
              month: "short",
            })
          : "—";
        return (
          <div
            key={d.month}
            className="flex-1 flex flex-col items-center gap-1 group"
            title={`${d.month}: ${fmtCurrency(d.revenue)}`}
          >
            <div className="w-full flex items-end" style={{ height: "96px" }}>
              <div
                className="w-full bg-primary/70 group-hover:bg-primary rounded-t transition-all duration-500"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-500 group-hover:text-slate-300 transition-colors truncate w-full text-center">
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Summary Card ─────────────────────────────────────────────────────────────
function SummaryCard({ icon, label, value, sub, iconBg, iconColor, loading }) {
  return (
    <div className="bg-surface-dark rounded-xl p-5 border border-white/5 flex items-center gap-4">
      <div className={`${iconBg} p-3 rounded-xl shrink-0`}>
        <span className={`material-symbols-outlined ${iconColor} text-[24px]`}>
          {icon}
        </span>
      </div>
      <div className="min-w-0">
        <p className="text-slate-500 text-xs mb-0.5">{label}</p>
        {loading ? (
          <div className="h-7 w-28 bg-white/10 rounded animate-pulse" />
        ) : (
          <p className="text-white font-bold text-xl truncate">{value}</p>
        )}
        {sub && !loading && (
          <p className="text-slate-500 text-xs mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Finance() {
  // Summary data
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(true);

  // Payments table
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [search, setSearch] = useState("");
  const [tableLoading, setTableLoading] = useState(true);

  const [toast, setToast] = useState(null);
  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  // ── Fetch summary ──
  const fetchSummary = useCallback(async () => {
    setSummaryLoading(true);
    try {
      const data = await api.getFinanceSummary();
      setSummary(data);
    } catch {
      // show zeros
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  // ── Fetch payments ──
  const fetchPayments = useCallback(
    async (page = 1) => {
      setTableLoading(true);
      try {
        const data = await api.getRecentPayments({
          page,
          limit: pagination.limit,
          search,
        });
        setPayments(data.data || []);
        setPagination((p) => ({ ...p, ...(data.pagination || {}), page }));
      } catch {
        setPayments([]);
      } finally {
        setTableLoading(false);
      }
    },
    [search, pagination.limit],
  );

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  useEffect(() => {
    fetchPayments(1);
  }, [search]);

  // ── Compute collection rate ──
  const collectionRate =
    summary && summary.total_invoiced > 0
      ? Math.round((summary.total_revenue / summary.total_invoiced) * 100)
      : 0;

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background-dark">
      <Sidebar />

      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 shrink-0 flex items-center justify-between px-8 border-b border-white/5 bg-background-dark/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Finance Overview
            </h2>
            <p className="text-slate-500 text-xs">
              Platform-wide revenue, collections and payment history.
            </p>
          </div>
          <button
            onClick={() => {
              fetchSummary();
              fetchPayments(1);
              showToast("Data refreshed.");
            }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white text-sm font-medium transition-all border border-white/10"
          >
            <span className="material-symbols-outlined text-[18px]">
              refresh
            </span>
            Refresh
          </button>
        </header>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                icon="payments"
                label="Total Revenue Collected"
                value={fmtCurrency(summary?.total_revenue)}
                iconBg="bg-emerald-500/10"
                iconColor="text-emerald-400"
                loading={summaryLoading}
              />
              <SummaryCard
                icon="receipt_long"
                label="Total Invoiced"
                value={fmtCurrency(summary?.total_invoiced)}
                sub="Across all schools"
                iconBg="bg-blue-500/10"
                iconColor="text-blue-400"
                loading={summaryLoading}
              />
              <SummaryCard
                icon="pending_actions"
                label="Outstanding Balance"
                value={fmtCurrency(summary?.total_pending)}
                sub={
                  summary?.overdue_count > 0
                    ? `${summary.overdue_count} overdue invoice${summary.overdue_count !== 1 ? "s" : ""}`
                    : "No overdue invoices"
                }
                iconBg="bg-amber-500/10"
                iconColor="text-amber-400"
                loading={summaryLoading}
              />
              <SummaryCard
                icon="bar_chart"
                label="Collection Rate"
                value={summaryLoading ? "—" : `${collectionRate}%`}
                sub="Paid / Invoiced"
                iconBg="bg-purple-500/10"
                iconColor="text-purple-400"
                loading={summaryLoading}
              />
            </div>

            {/* ── Revenue Chart + Collection breakdown ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Bar chart */}
              <div className="lg:col-span-2 bg-surface-dark rounded-xl border border-white/5 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      Monthly Revenue
                    </h3>
                    <p className="text-slate-500 text-xs mt-0.5">
                      Last 6 months of collected payments
                    </p>
                  </div>
                  {!summaryLoading && summary?.monthly_revenue?.length > 0 && (
                    <div className="text-right">
                      <p className="text-white font-bold text-lg">
                        {fmtCurrency(
                          summary.monthly_revenue[
                            summary.monthly_revenue.length - 1
                          ]?.revenue,
                        )}
                      </p>
                      <p className="text-slate-500 text-xs">This month</p>
                    </div>
                  )}
                </div>
                <MonthlyRevenueChart data={summary?.monthly_revenue || []} />
              </div>

              {/* Collection breakdown */}
              <div className="bg-surface-dark rounded-xl border border-white/5 p-6 shadow-sm flex flex-col gap-4">
                <div>
                  <h3 className="text-white font-semibold text-base">
                    Collection Breakdown
                  </h3>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Invoice payment status
                  </p>
                </div>

                {summaryLoading ? (
                  <div className="flex flex-col gap-3">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 bg-white/10 rounded-lg animate-pulse"
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {[
                      {
                        label: "Collected",
                        value: summary?.total_paid || 0,
                        color: "bg-emerald-500",
                        textColor: "text-emerald-400",
                      },
                      {
                        label: "Pending",
                        value: summary?.total_pending || 0,
                        color: "bg-amber-500",
                        textColor: "text-amber-400",
                      },
                    ].map(({ label, value, color, textColor }) => {
                      const total = summary?.total_invoiced || 1;
                      const pct = Math.round((value / total) * 100);
                      return (
                        <div key={label} className="flex flex-col gap-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-slate-400 text-sm">
                              {label}
                            </span>
                            <span
                              className={`font-semibold text-sm ${textColor}`}
                            >
                              {fmtCurrency(value)}
                            </span>
                          </div>
                          <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${color} rounded-full transition-all duration-700`}
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <p className="text-slate-600 text-xs text-right">
                            {pct}% of total invoiced
                          </p>
                        </div>
                      );
                    })}

                    {/* Divider */}
                    <div className="border-t border-white/5 pt-3 mt-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400 text-sm">
                          Total Invoiced
                        </span>
                        <span className="text-white font-bold text-sm">
                          {fmtCurrency(summary?.total_invoiced)}
                        </span>
                      </div>
                      {summary?.overdue_count > 0 && (
                        <div className="mt-2 flex items-center gap-2 p-2.5 rounded-lg bg-red-500/5 border border-red-500/10">
                          <span className="material-symbols-outlined text-red-400 text-[16px]">
                            warning
                          </span>
                          <span className="text-red-400 text-xs">
                            {summary.overdue_count} overdue invoice
                            {summary.overdue_count !== 1 ? "s" : ""} need
                            attention
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* ── Payments Table ── */}
            <div className="bg-surface-dark rounded-xl border border-white/5 overflow-hidden shadow-sm">
              {/* Table header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 border-b border-white/5">
                <div className="flex items-center gap-3">
                  <div className="bg-purple-500/10 p-2 rounded-lg">
                    <span className="material-symbols-outlined text-purple-400 text-[20px]">
                      history
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-base">
                      Payment History
                    </h3>
                    <p className="text-slate-500 text-xs">
                      {tableLoading
                        ? "Loading…"
                        : `${pagination.total} payment${pagination.total !== 1 ? "s" : ""} recorded`}
                    </p>
                  </div>
                </div>
                {/* Search */}
                <div className="relative w-full sm:w-64">
                  <span className="material-symbols-outlined text-slate-400 text-[18px] absolute left-3 top-2.5 pointer-events-none">
                    search
                  </span>
                  <input
                    className="w-full bg-[#2e2839] border border-transparent focus:border-primary/50 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-slate-500 outline-none transition-all"
                    placeholder="Search school or invoice…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-white/5 bg-white/[0.02]">
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        School
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        Method
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">
                        Amount
                      </th>
                      <th className="p-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-center">
                        Invoice Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {tableLoading ? (
                      Array.from({ length: 6 }).map((_, i) => (
                        <tr key={i}>
                          {Array.from({ length: 6 }).map((__, j) => (
                            <td key={j} className="p-4">
                              <div className="h-4 bg-white/10 rounded animate-pulse" />
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : payments.length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="p-16 text-center text-slate-500"
                        >
                          <span className="material-symbols-outlined text-5xl block mb-3 opacity-20">
                            payments
                          </span>
                          <p className="font-medium">No payments found</p>
                          {search && (
                            <p className="text-sm mt-1">
                              Try clearing your search.
                            </p>
                          )}
                        </td>
                      </tr>
                    ) : (
                      payments.map((p) => (
                        <tr
                          key={p.payment_id}
                          className="hover:bg-white/[0.025] transition-colors"
                        >
                          {/* Date */}
                          <td className="p-4 text-sm text-slate-400 whitespace-nowrap">
                            {fmtDate(p.payment_date)}
                          </td>

                          {/* School */}
                          <td className="p-4">
                            <p className="text-sm font-medium text-white truncate max-w-[160px]">
                              {p.school_name || "—"}
                            </p>
                            <p className="text-xs text-slate-500">
                              #{String(p.school_id).padStart(4, "0")}
                            </p>
                          </td>

                          {/* Invoice */}
                          <td className="p-4">
                            <p className="text-sm text-white truncate max-w-[180px]">
                              {p.invoice_title || "—"}
                            </p>
                            <p className="text-xs text-slate-500">
                              Total: {fmtCurrency(p.invoice_total)}
                            </p>
                          </td>

                          {/* Method */}
                          <td className="p-4">
                            <MethodBadge method={p.method} />
                          </td>

                          {/* Amount */}
                          <td className="p-4 text-right">
                            <span className="text-emerald-400 font-semibold text-sm">
                              {fmtCurrency(p.amount)}
                            </span>
                          </td>

                          {/* Invoice Status */}
                          <td className="p-4 text-center">
                            <InvoiceStatusBadge status={p.invoice_status} />
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-white/5 bg-white/[0.01]">
                <p className="text-xs text-slate-500">
                  Showing{" "}
                  <span className="text-white font-medium">
                    {pagination.total === 0
                      ? 0
                      : (pagination.page - 1) * pagination.limit + 1}
                    –
                    {Math.min(
                      pagination.page * pagination.limit,
                      pagination.total,
                    )}
                  </span>{" "}
                  of{" "}
                  <span className="text-white font-medium">
                    {pagination.total}
                  </span>{" "}
                  payments
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={pagination.page <= 1 || tableLoading}
                    onClick={() => fetchPayments(pagination.page - 1)}
                    className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_left
                    </span>
                  </button>
                  {Array.from(
                    { length: pagination.totalPages || 1 },
                    (_, i) => i + 1,
                  )
                    .filter(
                      (pg) =>
                        pg === 1 ||
                        pg === pagination.totalPages ||
                        Math.abs(pg - pagination.page) <= 1,
                    )
                    .reduce((acc, pg, idx, arr) => {
                      if (idx > 0 && pg - arr[idx - 1] > 1) acc.push("…");
                      acc.push(pg);
                      return acc;
                    }, [])
                    .map((pg, i) =>
                      pg === "…" ? (
                        <span
                          key={`dot-${i}`}
                          className="px-1 text-slate-600 text-sm"
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={pg}
                          onClick={() => fetchPayments(pg)}
                          disabled={tableLoading}
                          className={`size-7 rounded text-xs font-medium transition-colors ${
                            pg === pagination.page
                              ? "bg-primary text-white shadow-sm"
                              : "hover:bg-white/10 text-slate-400"
                          }`}
                        >
                          {pg}
                        </button>
                      ),
                    )}
                  <button
                    disabled={
                      pagination.page >= (pagination.totalPages || 1) ||
                      tableLoading
                    }
                    onClick={() => fetchPayments(pagination.page + 1)}
                    className="p-1.5 rounded hover:bg-white/10 text-slate-400 disabled:opacity-30 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      chevron_right
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
            toast.type === "error"
              ? "bg-red-500/10 border-red-500/20 text-red-400"
              : "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
          }`}
        >
          <span className="material-symbols-outlined text-[18px]">
            {toast.type === "error" ? "error" : "check_circle"}
          </span>
          {toast.msg}
        </div>
      )}
    </div>
  );
}

export default Finance;
