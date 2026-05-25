"use client"

import { useState } from "react"
import { Plus, Copy, Trash2 } from "lucide-react"
import { StatusBadge, TableCard, ActionBtn, TH, TD, MiniStats } from "@/components/admin/shared"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const initialCoupons = [
  { id: 1, code: "HERBAL10",  type: "Percentage", value: "10%",  min: 499,  used: 284, max: 500,  expires: "30 Jun 2025", status: "active"   },
  { id: 2, code: "WELCOME15", type: "Percentage", value: "15%",  min: 299,  used: 91,  max: 200,  expires: "31 May 2025", status: "active"   },
  { id: 3, code: "FLAT100",   type: "Fixed",      value: "₹100", min: 999,  used: 47,  max: 100,  expires: "15 Jun 2025", status: "active"   },
  { id: 4, code: "SUMMER20",  type: "Percentage", value: "20%",  min: 1499, used: 12,  max: 50,   expires: "31 May 2025", status: "active"   },
  { id: 5, code: "FIRST50",   type: "Fixed",      value: "₹50",  min: 0,    used: 500, max: 500,  expires: "30 Apr 2025", status: "expired"  },
  { id: 6, code: "AYUR25",    type: "Percentage", value: "25%",  min: 1999, used: 0,   max: 30,   expires: "30 Jun 2025", status: "active"   },
]

export default function AdminCouponsPage() {
  const [coupons, setCoupons]   = useState(initialCoupons)
  const [showModal, setShowModal] = useState(false)
  const [toast, setToast]       = useState("")
  const [form, setForm]         = useState({
    code: "", type: "Percentage", value: "", min: "", max: "", expires: "",
  })

  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }))

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const handleCreate = () => {
    if (!form.code || !form.value) return
    const newCoupon = {
      id: coupons.length + 1,
      code: form.code.toUpperCase(),
      type: form.type,
      value: form.type === "Percentage" ? `${form.value}%` : `₹${form.value}`,
      min: Number(form.min) || 0,
      used: 0,
      max: Number(form.max) || 100,
      expires: form.expires || "—",
      status: "active",
    }
    setCoupons((prev) => [newCoupon, ...prev])
    setShowModal(false)
    setForm({ code: "", type: "Percentage", value: "", min: "", max: "", expires: "" })
    showToast(`Coupon ${newCoupon.code} created!`)
  }

  const handleDelete = (id: number, code: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id))
    showToast(`Coupon ${code} deleted!`)
  }

  const active  = coupons.filter((c) => c.status === "active").length
  const expired = coupons.filter((c) => c.status === "expired").length
  const totalUsed = coupons.reduce((s, c) => s + c.used, 0)

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c0f0b] text-white text-[12px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
          <span className="text-[#81ae74]">✓</span> {toast}
        </div>
      )}

      <MiniStats
        items={[
          { label: "Total Coupons", value: String(coupons.length), color: "text-[#81ae74]" },
          { label: "Active",        value: String(active),         color: "text-[#5c8a4e]" },
          { label: "Expired",       value: String(expired),        color: "text-[#6b6356]" },
          { label: "Total Used",    value: String(totalUsed),      color: "text-[#b2997d]" },
          { label: "Savings Given", value: "₹28.4K",               color: "text-amber-600" },
        ]}
      />

      <TableCard
        title="All Coupons"
        actions={
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 bg-[#81ae74] text-white text-[12px] font-medium px-3 py-1.5 rounded-full hover:bg-[#5c8a4e] transition-colors"
          >
            <Plus className="h-3.5 w-3.5" /> New Coupon
          </button>
        }
      >
        <table className="w-full">
          <thead>
            <tr>
              <th className={TH}>Code</th>
              <th className={TH}>Type</th>
              <th className={TH}>Discount</th>
              <th className={TH}>Min Order</th>
              <th className={TH}>Usage</th>
              <th className={TH}>Expires</th>
              <th className={TH}>Status</th>
              <th className={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((c) => (
              <tr key={c.id} className="group hover:bg-[#f5f0ea]/40 transition-colors">
                <td className={TD}>
                  <code className="bg-[#f5f0ea] text-[#5c8a4e] text-[11px] font-bold px-2 py-1 rounded-lg tracking-wider">
                    {c.code}
                  </code>
                </td>
                <td className={TD}><span className="text-[#6b6356]">{c.type}</span></td>
                <td className={TD}><span className="font-semibold">{c.value}</span></td>
                <td className={TD}>
                  {c.min > 0 ? `₹${c.min.toLocaleString("en-IN")}` : "No minimum"}
                </td>
                <td className={TD}>
                  <div className="flex items-center gap-2">
                    <div className="w-16 bg-[#f5f0ea] rounded-full h-1.5">
                      <div
                        className={`h-1.5 rounded-full ${
                          c.used >= c.max ? "bg-red-500" : "bg-[#81ae74]"
                        }`}
                        style={{ width: `${Math.min((c.used / c.max) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-[11px] ${c.used >= c.max ? "text-red-600" : "text-[#6b6356]"}`}>
                      {c.used}/{c.max}
                    </span>
                  </div>
                </td>
                <td className={TD}><span className="text-[#6b6356]">{c.expires}</span></td>
                <td className={TD}><StatusBadge status={c.status} /></td>
                <td className={TD}>
                  <div className="flex items-center gap-0.5">
                    <ActionBtn onClick={() => { navigator.clipboard?.writeText(c.code); showToast(`Copied: ${c.code}`) }}>
                      <Copy className="h-3.5 w-3.5" />
                    </ActionBtn>
                    <ActionBtn danger onClick={() => handleDelete(c.id, c.code)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {/* Create Coupon Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="font-serif text-xl">Create Coupon</DialogTitle>
          <div className="mt-3 space-y-4">
            <div>
              <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
                Coupon Code *
              </label>
              <Input
                value={form.code}
                onChange={(e) => set("code", e.target.value.toUpperCase())}
                placeholder="e.g. HERBAL20"
                className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74] uppercase font-mono font-semibold tracking-widest"
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
                Discount Type
              </label>
              <select
                value={form.type}
                onChange={(e) => set("type", e.target.value)}
                className="w-full border border-[#e8e3dc] rounded-xl px-3 py-2 text-[13px] bg-white outline-none focus:border-[#81ae74]"
              >
                <option>Percentage</option>
                <option>Fixed Amount</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
                Value ({form.type === "Percentage" ? "%" : "₹"}) *
              </label>
              <Input
                type="number"
                value={form.value}
                onChange={(e) => set("value", e.target.value)}
                placeholder={form.type === "Percentage" ? "10" : "100"}
                className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74]"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
                  Min Order (₹)
                </label>
                <Input
                  type="number"
                  value={form.min}
                  onChange={(e) => set("min", e.target.value)}
                  placeholder="499"
                  className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
                  Max Uses
                </label>
                <Input
                  type="number"
                  value={form.max}
                  onChange={(e) => set("max", e.target.value)}
                  placeholder="100"
                  className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74]"
                />
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-[#6b6356] uppercase tracking-wider mb-1.5">
                Expiry Date
              </label>
              <Input
                type="date"
                value={form.expires}
                onChange={(e) => set("expires", e.target.value)}
                className="rounded-xl border-[#e8e3dc] focus:border-[#81ae74]"
              />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button
              className="flex-1 rounded-full bg-[#81ae74] hover:bg-[#5c8a4e] text-white"
              onClick={handleCreate}
              disabled={!form.code || !form.value}
            >
              Create Coupon
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
