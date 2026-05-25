"use client"

import { useState, useMemo } from "react"
import { Search, Download, Edit2, Eye } from "lucide-react"
import {
  MiniStats, StatusBadge, TableCard, ActionBtn, TH, TD,
} from "@/components/admin/shared"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const ordersData = [
  { id: "SA-1084", customer: "Priya Sharma",   email: "priya@gmail.com",   items: 2, amount: 1898, payment: "Razorpay", status: "delivered",  date: "25 May 2025", city: "Mumbai" },
  { id: "SA-1083", customer: "Ananya Patel",   email: "ananya@gmail.com",  items: 1, amount:  699, payment: "COD",      status: "shipped",    date: "24 May 2025", city: "Ahmedabad" },
  { id: "SA-1082", customer: "Meera Krishnan", email: "meera@gmail.com",   items: 3, amount: 2247, payment: "UPI",      status: "processing", date: "24 May 2025", city: "Chennai" },
  { id: "SA-1081", customer: "Deepika Nair",   email: "deepika@gmail.com", items: 1, amount: 1299, payment: "Razorpay", status: "pending",    date: "23 May 2025", city: "Bangalore" },
  { id: "SA-1080", customer: "Kavya Reddy",    email: "kavya@gmail.com",   items: 2, amount: 1348, payment: "COD",      status: "delivered",  date: "22 May 2025", city: "Hyderabad" },
  { id: "SA-1079", customer: "Shreya Iyer",    email: "shreya@gmail.com",  items: 1, amount:  549, payment: "UPI",      status: "cancelled",  date: "21 May 2025", city: "Pune" },
  { id: "SA-1078", customer: "Pooja Mehta",    email: "pooja@gmail.com",   items: 4, amount: 3144, payment: "Razorpay", status: "delivered",  date: "21 May 2025", city: "Delhi" },
  { id: "SA-1077", customer: "Riya Shah",      email: "riya@gmail.com",    items: 1, amount:  899, payment: "COD",      status: "shipped",    date: "20 May 2025", city: "Surat" },
  { id: "SA-1076", customer: "Nisha Verma",    email: "nisha@gmail.com",   items: 2, amount: 1598, payment: "UPI",      status: "delivered",  date: "19 May 2025", city: "Jaipur" },
  { id: "SA-1075", customer: "Tanvi Joshi",    email: "tanvi@gmail.com",   items: 1, amount:  449, payment: "COD",      status: "processing", date: "19 May 2025", city: "Ahmedabad" },
]

const STATUS_OPTIONS = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

const ORDER_STEPS = ["Placed", "Confirmed", "Processing", "Packed", "Shipped", "Delivered"]

export default function AdminOrdersPage() {
  const [search, setSearch]         = useState("")
  const [statusFilter, setStatusFilter] = useState("All")
  const [selectedOrder, setSelectedOrder] = useState<typeof ordersData[0] | null>(null)
  const [updateModal, setUpdateModal]   = useState<typeof ordersData[0] | null>(null)
  const [newStatus, setNewStatus]       = useState("Processing")
  const [tracking, setTracking]         = useState("")
  const [toast, setToast]               = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const filtered = useMemo(() => {
    return ordersData.filter((o) => {
      const q = search.toLowerCase()
      const matchSearch =
        o.id.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.email.toLowerCase().includes(q)
      const matchStatus =
        statusFilter === "All" ||
        o.status.toLowerCase() === statusFilter.toLowerCase()
      return matchSearch && matchStatus
    })
  }, [search, statusFilter])

  const delivered  = ordersData.filter((o) => o.status === "delivered").length
  const pending    = ordersData.filter((o) => o.status === "pending" || o.status === "processing").length
  const shipped    = ordersData.filter((o) => o.status === "shipped").length
  const cancelled  = ordersData.filter((o) => o.status === "cancelled").length
  const totalRev   = ordersData.reduce((s, o) => s + o.amount, 0)

  const currentStep = (status: string) => {
    const map: Record<string, number> = {
      placed: 0, confirmed: 1, processing: 2, packed: 3, shipped: 4, delivered: 5,
    }
    return map[status.toLowerCase()] ?? 2
  }

  return (
    <div className="space-y-5">
      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c0f0b] text-white text-[12px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
          <span className="text-[#81ae74]">✓</span> {toast}
        </div>
      )}

      <MiniStats
        items={[
          { label: "Total Orders",  value: "1,284",                      color: "text-[#81ae74]" },
          { label: "Pending",       value: String(pending),              color: "text-amber-600" },
          { label: "Shipped",       value: String(shipped),              color: "text-blue-600" },
          { label: "Delivered",     value: String(delivered),            color: "text-[#5c8a4e]" },
          { label: "Cancelled",     value: String(cancelled),            color: "text-red-600" },
        ]}
      />

      <TableCard
        title="All Orders"
        actions={
          <>
            <div className="flex items-center gap-1.5 bg-[#f5f0ea] rounded-full px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-[#6b6356]" />
              <input
                type="text"
                placeholder="Search order, customer..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[12px] outline-none text-[#0c0f0b] placeholder:text-[#6b6356] w-36"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-[12px] border border-[#e8e3dc] rounded-full px-3 py-1.5 bg-white text-[#0c0f0b] outline-none cursor-pointer"
            >
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>
            <button
              onClick={() => showToast("Orders exported as CSV!")}
              className="flex items-center gap-1.5 border border-[#e8e3dc] text-[#6b6356] text-[12px] font-medium px-3 py-1.5 rounded-full hover:bg-[#f5f0ea] transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </>
        }
        footer={
          <>
            <span>Showing {filtered.length} of 1,284 orders</span>
            <div className="flex gap-1">
              {[1, 2, 3, "›"].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded-lg border border-[#e8e3dc] text-[11px] transition-colors ${
                    p === 1 ? "bg-[#81ae74] text-white border-[#81ae74]" : "hover:bg-[#f5f0ea]"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </>
        }
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={TH}>Order ID</th>
              <th className={TH}>Customer</th>
              <th className={TH}>Items</th>
              <th className={TH}>Amount</th>
              <th className={TH}>Payment</th>
              <th className={TH}>Status</th>
              <th className={TH}>Date</th>
              <th className={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((o) => (
              <tr key={o.id} className="group hover:bg-[#f5f0ea]/40 transition-colors">
                <td className={TD}>
                  <span className="font-semibold text-[#81ae74]">{o.id}</span>
                </td>
                <td className={TD}>
                  <p className="font-medium">{o.customer}</p>
                  <p className="text-[10px] text-[#6b6356]">{o.city}</p>
                </td>
                <td className={TD}>{o.items} item{o.items > 1 ? "s" : ""}</td>
                <td className={TD}>
                  <span className="font-semibold">₹{o.amount.toLocaleString("en-IN")}</span>
                </td>
                <td className={TD}>
                  <span className="text-[11px] text-[#6b6356]">{o.payment}</span>
                </td>
                <td className={TD}><StatusBadge status={o.status} /></td>
                <td className={TD}><span className="text-[#6b6356]">{o.date}</span></td>
                <td className={TD}>
                  <div className="flex items-center gap-0.5">
                    <ActionBtn onClick={() => setSelectedOrder(o)}>
                      <Eye className="h-3.5 w-3.5" />
                    </ActionBtn>
                    <ActionBtn onClick={() => { setUpdateModal(o); setNewStatus("Processing") }}>
                      <Edit2 className="h-3.5 w-3.5" />
                    </ActionBtn>
                    <ActionBtn onClick={() => showToast("Invoice downloaded!")}>
                      <Download className="h-3.5 w-3.5" />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {/* Order Detail Modal */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-md rounded-2xl">
          <DialogTitle className="font-serif text-xl">
            Order {selectedOrder?.id}
          </DialogTitle>
          {selectedOrder && (
            <div className="mt-3 space-y-4">
              {/* Status steps */}
              <div className="flex items-center justify-between">
                {ORDER_STEPS.map((step, i) => {
                  const done = i <= currentStep(selectedOrder.status)
                  const current = i === currentStep(selectedOrder.status)
                  return (
                    <div key={step} className="flex flex-col items-center gap-1 flex-1 relative">
                      {i < ORDER_STEPS.length - 1 && (
                        <div
                          className={`absolute top-3.5 left-1/2 w-full h-0.5 ${
                            i < currentStep(selectedOrder.status) ? "bg-[#81ae74]" : "bg-[#e8e3dc]"
                          }`}
                        />
                      )}
                      <div
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold z-10 ${
                          done
                            ? "bg-[#81ae74] border-[#81ae74] text-white"
                            : "bg-white border-[#e8e3dc] text-[#6b6356]"
                        } ${current ? "ring-2 ring-[#81ae74]/30" : ""}`}
                      >
                        {done ? "✓" : i + 1}
                      </div>
                      <span className={`text-[9px] text-center ${done ? "text-[#5c8a4e] font-medium" : "text-[#6b6356]"}`}>
                        {step}
                      </span>
                    </div>
                  )
                })}
              </div>

              <div className="bg-[#f5f0ea] rounded-xl p-4 space-y-2 text-[12px]">
                <div className="flex justify-between"><span className="text-[#6b6356]">Customer</span><span className="font-medium">{selectedOrder.customer}</span></div>
                <div className="flex justify-between"><span className="text-[#6b6356]">Email</span><span>{selectedOrder.email}</span></div>
                <div className="flex justify-between"><span className="text-[#6b6356]">City</span><span>{selectedOrder.city}</span></div>
                <div className="flex justify-between"><span className="text-[#6b6356]">Payment</span><span>{selectedOrder.payment}</span></div>
                <div className="flex justify-between"><span className="text-[#6b6356]">Items</span><span>{selectedOrder.items}</span></div>
                <div className="flex justify-between border-t border-[#e8e3dc] pt-2 mt-2">
                  <span className="font-semibold">Total</span>
                  <span className="font-semibold text-[15px]">₹{selectedOrder.amount.toLocaleString("en-IN")}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-full" onClick={() => setSelectedOrder(null)}>
                  Close
                </Button>
                <Button
                  className="flex-1 rounded-full bg-[#81ae74] hover:bg-[#5c8a4e] text-white"
                  onClick={() => { setSelectedOrder(null); setUpdateModal(selectedOrder) }}
                >
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={!!updateModal} onOpenChange={() => setUpdateModal(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="font-serif text-xl">Update Status</DialogTitle>
          <p className="text-[12px] text-[#6b6356] mt-1 mb-4">
            Order <span className="font-semibold text-[#81ae74]">{updateModal?.id}</span> — {updateModal?.customer}
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
                New Status
              </label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] outline-none focus:border-[#81ae74] bg-white"
              >
                {["Processing", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
                Tracking Number (optional)
              </label>
              <input
                type="text"
                value={tracking}
                onChange={(e) => setTracking(e.target.value)}
                placeholder="e.g. DTDC1234567890"
                className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] outline-none focus:border-[#81ae74] font-sans"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="outline" className="flex-1 rounded-full" onClick={() => setUpdateModal(null)}>
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-full bg-[#81ae74] hover:bg-[#5c8a4e] text-white"
              onClick={() => { setUpdateModal(null); showToast(`Order updated to: ${newStatus}`) }}
            >
              Update
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
