"use client"

import { useEffect, useRef } from "react"
import { TrendingUp, RefreshCw, ShoppingBag, RotateCcw } from "lucide-react"
import { StatCard, TH, TD } from "@/components/admin/shared"

const topProducts = [
  { name: "Kumkumadi Radiance Serum", category: "Face Care", revenue: 92000, units: 186, growth: "+12%" },
  { name: "Brahmi Hair Oil",          category: "Hair Care", revenue: 72000, units: 212, growth: "+8%"  },
  { name: "Aloe Vera Gel",            category: "Body Care", revenue: 61000, units: 201, growth: "+22%" },
  { name: "Ubtan Body Polish",        category: "Body Care", revenue: 48000, units:  78, growth: "+5%"  },
  { name: "Neem Purifying Cleanser",  category: "Face Care", revenue: 39000, units:  97, growth: "+15%" },
]

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-5">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Monthly Growth"   value="+18.4%"  change="vs last month"       changeType="up"      icon={TrendingUp}    iconColor="green" />
        <StatCard label="Repeat Customers" value="68.2%"   change="+4.1% this month"    changeType="up"      icon={RefreshCw}     iconColor="brown" />
        <StatCard label="Avg Order Value"  value="₹1,389"  change="+₹87 vs last month"  changeType="up"      icon={ShoppingBag}   iconColor="amber" />
        <StatCard label="Return Rate"      value="2.1%"    change="Industry avg: 8%"    changeType="neutral" icon={RotateCcw}     iconColor="red"   />
      </div>

      {/* Charts row 1 */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white border border-[#e8e3dc] rounded-2xl p-5">
          <h2 className="text-[13px] font-semibold mb-1">Daily Orders — Last 30 Days</h2>
          <p className="text-[11px] text-[#6b6356] mb-4">Order volume trend</p>
          <DailyOrdersChart />
        </div>
        <div className="bg-white border border-[#e8e3dc] rounded-2xl p-5">
          <h2 className="text-[13px] font-semibold mb-1">Traffic Sources</h2>
          <p className="text-[11px] text-[#6b6356] mb-4">Where customers come from</p>
          <TrafficChart />
          <div className="mt-4 space-y-1.5">
            {[
              { label: "Organic Search", pct: "42%", color: "#81ae74" },
              { label: "Direct",         pct: "28%", color: "#b2997d" },
              { label: "Social Media",   pct: "18%", color: "#0c0f0b" },
              { label: "Paid Ads",       pct: "12%", color: "#c9b99a" },
            ].map((s) => (
              <div key={s.label} className="flex items-center justify-between text-[11px]">
                <span className="flex items-center gap-1.5 text-[#6b6356]">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ background: s.color }} />
                  {s.label}
                </span>
                <span className="font-medium">{s.pct}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white border border-[#e8e3dc] rounded-2xl p-5">
          <h2 className="text-[13px] font-semibold mb-1">Revenue vs Orders</h2>
          <p className="text-[11px] text-[#6b6356] mb-4">Monthly comparison</p>
          <RevenueOrdersChart />
        </div>
        <div className="bg-white border border-[#e8e3dc] rounded-2xl p-5">
          <h2 className="text-[13px] font-semibold mb-1">New vs Returning Customers</h2>
          <p className="text-[11px] text-[#6b6356] mb-4">Last 6 months</p>
          <CustomerTypeChart />
        </div>
      </div>

      {/* Top products table */}
      <div className="bg-white border border-[#e8e3dc] rounded-2xl overflow-hidden">
        <div className="px-5 py-3.5 border-b border-[#e8e3dc]">
          <h2 className="text-[13px] font-semibold">Top Performing Products</h2>
          <p className="text-[11px] text-[#6b6356]">By revenue this month</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className={TH}>#</th>
                <th className={TH}>Product</th>
                <th className={TH}>Revenue</th>
                <th className={TH}>Units Sold</th>
                <th className={TH}>Growth</th>
                <th className={TH}>Share</th>
              </tr>
            </thead>
            <tbody>
              {topProducts.map((p, i) => {
                const maxRev = topProducts[0].revenue
                const pct = Math.round((p.revenue / maxRev) * 100)
                return (
                  <tr key={p.name} className="group hover:bg-[#f5f0ea]/40 transition-colors">
                    <td className={TD}>
                      <span className="w-6 h-6 rounded-full bg-[#f5f0ea] flex items-center justify-center text-[10px] font-bold text-[#6b6356]">
                        {i + 1}
                      </span>
                    </td>
                    <td className={TD}>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-[10px] text-[#6b6356]">{p.category}</p>
                    </td>
                    <td className={TD}>
                      <span className="font-semibold">₹{(p.revenue / 1000).toFixed(0)}K</span>
                    </td>
                    <td className={TD}>{p.units} units</td>
                    <td className={TD}>
                      <span className="text-[11px] font-semibold text-[#5c8a4e] bg-[#eef5ec] px-2 py-0.5 rounded-full">
                        {p.growth}
                      </span>
                    </td>
                    <td className={TD}>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#f5f0ea] rounded-full h-1.5 w-24">
                          <div
                            className="h-1.5 bg-[#81ae74] rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-[#6b6356]">{pct}%</span>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// ── Chart Components ─────────────────────────────────────────

function DailyOrdersChart() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    import("chart.js/auto").then(({ default: Chart }) => {
      const existing = Chart.getChart(ref.current!)
      if (existing) existing.destroy()
      const labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`)
      const data   = labels.map(() => Math.round(18 + Math.random() * 55))
      new Chart(ref.current!, {
        type: "line",
        data: {
          labels,
          datasets: [{
            label: "Orders",
            data,
            borderColor: "#81ae74",
            backgroundColor: "rgba(129,174,116,0.08)",
            tension: 0.4,
            fill: true,
            pointRadius: 0,
            borderWidth: 2,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 10 } } },
            x: { grid: { display: false }, ticks: { font: { size: 10 }, maxTicksLimit: 10 } },
          },
        },
      })
    })
  }, [])
  return <div className="relative h-[180px]"><canvas ref={ref} /></div>
}

function TrafficChart() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    import("chart.js/auto").then(({ default: Chart }) => {
      const existing = Chart.getChart(ref.current!)
      if (existing) existing.destroy()
      new Chart(ref.current!, {
        type: "doughnut",
        data: {
          labels: ["Organic", "Direct", "Social", "Paid"],
          datasets: [{
            data: [42, 28, 18, 12],
            backgroundColor: ["#81ae74", "#b2997d", "#0c0f0b", "#c9b99a"],
            borderWidth: 0,
            hoverOffset: 4,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: "62%",
          plugins: { legend: { display: false } },
        },
      })
    })
  }, [])
  return <div className="relative h-[140px]"><canvas ref={ref} /></div>
}

function RevenueOrdersChart() {
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
            { label: "Revenue", data: [52000, 68000, 61000, 75000, 82000, 78000, 89000], backgroundColor: "#81ae74", borderRadius: 5, borderSkipped: false },
            { label: "Orders",  data: [38000, 51000, 44000, 58000, 62000, 57000, 68000], backgroundColor: "#b2997d", borderRadius: 5, borderSkipped: false },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom", labels: { font: { size: 10 }, boxWidth: 10 } } },
          scales: {
            y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 10 }, callback: (v) => `₹${Math.round(Number(v) / 1000)}K` } },
            x: { grid: { display: false }, ticks: { font: { size: 10 } } },
          },
        },
      })
    })
  }, [])
  return <div className="relative h-[180px]"><canvas ref={ref} /></div>
}

function CustomerTypeChart() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (!ref.current) return
    import("chart.js/auto").then(({ default: Chart }) => {
      const existing = Chart.getChart(ref.current!)
      if (existing) existing.destroy()
      new Chart(ref.current!, {
        type: "bar",
        data: {
          labels: ["Dec", "Jan", "Feb", "Mar", "Apr", "May"],
          datasets: [
            { label: "New",       data: [120, 95, 140, 110, 130, 122], backgroundColor: "#81ae74", borderRadius: 5, borderSkipped: false },
            { label: "Returning", data: [210, 240, 280, 310, 295, 340], backgroundColor: "#eef5ec", borderRadius: 5, borderSkipped: false },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: "bottom", labels: { font: { size: 10 }, boxWidth: 10 } } },
          scales: {
            y: { grid: { color: "rgba(0,0,0,0.04)" }, ticks: { font: { size: 10 } }, stacked: true },
            x: { grid: { display: false }, ticks: { font: { size: 10 } }, stacked: true },
          },
        },
      })
    })
  }, [])
  return <div className="relative h-[180px]"><canvas ref={ref} /></div>
}
