"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { TrendingUp, ShoppingCart, Users, Package } from "lucide-react"
import { StatCard, StatusBadge, TableCard, TH, TD } from "@/components/admin/shared"

const recentOrders = [
  { id: "SA-1084", customer: "Priya Sharma",   amount: 1898, status: "delivered",  date: "25 May 2025" },
  { id: "SA-1083", customer: "Ananya Patel",   amount:  699, status: "shipped",    date: "24 May 2025" },
  { id: "SA-1082", customer: "Meera Krishnan", amount: 2247, status: "processing", date: "24 May 2025" },
  { id: "SA-1081", customer: "Deepika Nair",   amount: 1299, status: "pending",    date: "23 May 2025" },
  { id: "SA-1080", customer: "Kavya Reddy",    amount: 1348, status: "delivered",  date: "22 May 2025" },
]

const topProducts = [
  { name: "Kumkumadi Radiance Serum", category: "Face Care", sales: 186, revenue: 92000 },
  { name: "Brahmi Hair Oil",          category: "Hair Care", sales: 212, revenue: 72000 },
  { name: "Aloe Vera Gel",            category: "Body Care", sales: 201, revenue: 61000 },
  { name: "Ubtan Body Polish",        category: "Body Care", sales:  78, revenue: 48000 },
]

// ── Chart Components ─────────────────────────────────────────

function RevenueChart() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    import("chart.js/auto").then(({ default: Chart }) => {
      const existing = Chart.getChart(ref.current!)
      if (existing) existing.destroy()
      new Chart(ref.current!, {
        type: "bar",
        data: {
          labels: ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            {
              label: "Revenue",
              data: [52000, 68000, 61000, 75000, 82000, 78000, 89000],
              backgroundColor: "#81ae74",
              borderRadius: 6,
              borderSkipped: false,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: {
              grid: { color: "rgba(0,0,0,0.04)" },
              ticks: { font: { size: 10 }, callback: (v) => `₹${Math.round(Number(v) / 1000)}K` },
            },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          },
        },
      })
    })
  }, [])
  return (
    <div className="relative h-[200px]">
      <canvas ref={ref} />
    </div>
  )
}

function CategoryChart() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    import("chart.js/auto").then(({ default: Chart }) => {
      const existing = Chart.getChart(ref.current!)
      if (existing) existing.destroy()
      new Chart(ref.current!, {
        type: "doughnut",
        data: {
          labels: ["Face Care", "Hair Care", "Skin Care", "Body Care"],
          datasets: [{
            data: [35, 27, 24, 14],
            backgroundColor: ["#81ae74", "#b2997d", "#0c0f0b", "#c9b99a"],
            borderWidth: 0,
            hoverOffset: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "65%",
          plugins: { legend: { display: false } },
        },
      })
    })
  }, [])
  return (
    <div className="relative h-[160px]">
      <canvas ref={ref} />
    </div>
  )
}

// ── Main Page ────────────────────────────────────────────────

export default function AdminOverviewPage() {
  return (
    <div className="space-y-5">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Revenue"
          value="₹4.82L"
          change="+18.4% this month"
          changeType="up"
          icon={TrendingUp}
          iconColor="green"
        />
        <StatCard
          label="Total Orders"
          value="1,284"
          change="+8.2% this week"
          changeType="up"
          icon={ShoppingCart}
          iconColor="brown"
        />
        <StatCard
          label="Customers"
          value="3,471"
          change="+122 new today"
          changeType="up"
          icon={Users}
          iconColor="amber"
        />
        <StatCard
          label="Low Stock Items"
          value="7"
          change="Needs restocking"
          changeType="down"
          icon={Package}
          iconColor="red"
        />
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white border border-[#e8e3dc] rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-[13px] font-semibold text-[#0c0f0b]">Revenue Overview</h2>
              <p className="text-[11px] text-[#6b6356]">Last 7 months</p>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-[#6b6356]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-[#81ae74] inline-block" />
                Revenue
              </span>
            </div>
          </div>
          <RevenueChart />
        </div>

        {/* Category donut */}
        <div className="bg-white border border-[#e8e3dc] rounded-2xl p-5">
          <h2 className="text-[13px] font-semibold text-[#0c0f0b] mb-1">Sales by Category</h2>
          <p className="text-[11px] text-[#6b6356] mb-4">This month</p>
          <CategoryChart />
          <div className="mt-4 space-y-2">
            {[
              { label: "Face Care",  pct: "35%", color: "#81ae74" },
              { label: "Hair Care",  pct: "27%", color: "#b2997d" },
              { label: "Skin Care",  pct: "24%", color: "#0c0f0b" },
              { label: "Body Care",  pct: "14%", color: "#c9b99a" },
            ].map((c) => (
              <div key={c.label} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[#6b6356]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: c.color }} />
                  {c.label}
                </span>
                <span className="font-medium text-[#0c0f0b]">{c.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tables row */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Recent orders */}
        <TableCard
          title="Recent Orders"
          actions={
            <Link href="/admin/orders" className="text-[11px] text-[#81ae74] hover:text-[#5c8a4e] font-medium">
              View all →
            </Link>
          }
          footer={<span>{recentOrders.length} recent orders shown</span>}
        >
          <table className="w-full">
            <thead>
              <tr>
                <th className={TH}>Order</th>
                <th className={TH}>Customer</th>
                <th className={TH}>Amount</th>
                <th className={TH}>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="group hover:bg-[#f5f0ea]/40 transition-colors">
                  <td className={TD}>
                    <span className="font-semibold text-[#81ae74]">{o.id}</span>
                  </td>
                  <td className={TD}>{o.customer}</td>
                  <td className={TD}>
                    <span className="font-semibold">₹{o.amount.toLocaleString("en-IN")}</span>
                  </td>
                  <td className={TD}><StatusBadge status={o.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>

        {/* Top products */}
        <TableCard
          title="Top Products"
          actions={
            <Link href="/admin/products" className="text-[11px] text-[#81ae74] hover:text-[#5c8a4e] font-medium">
              View all →
            </Link>
          }
          footer={<span>By revenue this month</span>}
        >
          <table className="w-full">
            <thead>
              <tr>
                <th className={TH}>Product</th>
                <th className={TH}>Sales</th>
                <th className={TH}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p) => (
                <tr key={p.name} className="group hover:bg-[#f5f0ea]/40 transition-colors">
                  <td className={TD}>
                    <p className="font-medium text-[#0c0f0b] line-clamp-1">{p.name}</p>
                    <p className="text-[10px] text-[#6b6356]">{p.category}</p>
                  </td>
                  <td className={TD}>{p.sales} sold</td>
                  <td className={TD}>
                    <span className="font-semibold">₹{(p.revenue / 1000).toFixed(0)}K</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>
      </div>
    </div>
  )
}
