"use client"

import { useState, useMemo } from "react"
import { Search, Eye, Ban, Download } from "lucide-react"
import {
  MiniStats, StatusBadge, TableCard, ActionBtn, TH, TD,
} from "@/components/admin/shared"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

const customersData = [
  { id: 1,  name: "Priya Sharma",    email: "priya@gmail.com",   phone: "+91 98765 43210", orders: 8,  spent: 12480, joined: "Jan 2025", city: "Mumbai",    status: "active" },
  { id: 2,  name: "Ananya Patel",    email: "ananya@yahoo.com",  phone: "+91 87654 32109", orders: 3,  spent:  2247, joined: "Mar 2025", city: "Ahmedabad", status: "active" },
  { id: 3,  name: "Meera Krishnan",  email: "meera@gmail.com",   phone: "+91 76543 21098", orders: 12, spent: 18960, joined: "Nov 2024", city: "Chennai",   status: "active" },
  { id: 4,  name: "Deepika Nair",    email: "deepika@gmail.com", phone: "+91 65432 10987", orders: 1,  spent:  1299, joined: "May 2025", city: "Bangalore", status: "active" },
  { id: 5,  name: "Kavya Reddy",     email: "kavya@gmail.com",   phone: "+91 54321 09876", orders: 6,  spent:  8988, joined: "Feb 2025", city: "Hyderabad", status: "active" },
  { id: 6,  name: "Shreya Iyer",     email: "shreya@outlook.com",phone: "+91 43210 98765", orders: 2,  spent:  1448, joined: "Apr 2025", city: "Pune",      status: "inactive" },
  { id: 7,  name: "Pooja Mehta",     email: "pooja@gmail.com",   phone: "+91 32109 87654", orders: 15, spent: 22140, joined: "Sep 2024", city: "Delhi",     status: "active" },
  { id: 8,  name: "Riya Shah",       email: "riya@gmail.com",    phone: "+91 21098 76543", orders: 4,  spent:  5196, joined: "Dec 2024", city: "Surat",     status: "active" },
  { id: 9,  name: "Nisha Verma",     email: "nisha@gmail.com",   phone: "+91 11987 65432", orders: 7,  spent:  9800, joined: "Oct 2024", city: "Jaipur",    status: "active" },
  { id: 10, name: "Tanvi Joshi",     email: "tanvi@gmail.com",   phone: "+91 09876 54321", orders: 1,  spent:   449, joined: "May 2025", city: "Ahmedabad", status: "active" },
]

export default function AdminCustomersPage() {
  const [search, setSearch]           = useState("")
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customersData[0] | null>(null)
  const [toast, setToast]             = useState("")

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 2500)
  }

  const filtered = useMemo(() =>
    customersData.filter((c) => {
      const q = search.toLowerCase()
      return (
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
      )
    }),
    [search]
  )

  const totalSpent  = customersData.reduce((s, c) => s + c.spent, 0)
  const avgOrderVal = Math.round(totalSpent / customersData.reduce((s, c) => s + c.orders, 0))
  const activeCount = customersData.filter((c) => c.status === "active").length

  return (
    <div className="space-y-5">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0c0f0b] text-white text-[12px] font-medium px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-lg">
          <span className="text-[#81ae74]">✓</span> {toast}
        </div>
      )}

      <MiniStats
        items={[
          { label: "Total Customers", value: "3,471",               color: "text-[#81ae74]" },
          { label: "Active",          value: String(activeCount),   color: "text-[#5c8a4e]" },
          { label: "New This Month",  value: "122",                 color: "text-blue-600"  },
          { label: "Avg Order Value", value: `₹${avgOrderVal}`,    color: "text-[#b2997d]" },
          { label: "Repeat Rate",     value: "68.2%",               color: "text-amber-600" },
        ]}
      />

      <TableCard
        title="All Customers"
        actions={
          <>
            <div className="flex items-center gap-1.5 bg-[#f5f0ea] rounded-full px-3 py-1.5">
              <Search className="h-3.5 w-3.5 text-[#6b6356]" />
              <input
                type="text"
                placeholder="Search by name, email, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-[12px] outline-none text-[#0c0f0b] placeholder:text-[#6b6356] w-40"
              />
            </div>
            <button
              onClick={() => showToast("Customers exported!")}
              className="flex items-center gap-1.5 border border-[#e8e3dc] text-[#6b6356] text-[12px] font-medium px-3 py-1.5 rounded-full hover:bg-[#f5f0ea] transition-colors"
            >
              <Download className="h-3.5 w-3.5" /> Export
            </button>
          </>
        }
        footer={
          <>
            <span>Showing {filtered.length} of 3,471 customers</span>
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
              <th className={TH}>Customer</th>
              <th className={TH}>Contact</th>
              <th className={TH}>City</th>
              <th className={TH}>Orders</th>
              <th className={TH}>Total Spent</th>
              <th className={TH}>Joined</th>
              <th className={TH}>Status</th>
              <th className={TH}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} className="group hover:bg-[#f5f0ea]/40 transition-colors">
                <td className={TD}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-[#f5f0ea] flex items-center justify-center text-[12px] font-semibold text-[#b2997d] shrink-0">
                      {c.name.charAt(0)}
                    </div>
                    <span className="font-medium">{c.name}</span>
                  </div>
                </td>
                <td className={TD}>
                  <p className="text-[11px]">{c.email}</p>
                  <p className="text-[10px] text-[#6b6356]">{c.phone}</p>
                </td>
                <td className={TD}><span className="text-[#6b6356]">{c.city}</span></td>
                <td className={TD}><span className="font-medium">{c.orders}</span></td>
                <td className={TD}>
                  <span className="font-semibold">₹{c.spent.toLocaleString("en-IN")}</span>
                </td>
                <td className={TD}><span className="text-[#6b6356]">{c.joined}</span></td>
                <td className={TD}><StatusBadge status={c.status} /></td>
                <td className={TD}>
                  <div className="flex items-center gap-0.5">
                    <ActionBtn onClick={() => setSelectedCustomer(c)}>
                      <Eye className="h-3.5 w-3.5" />
                    </ActionBtn>
                    <ActionBtn danger onClick={() => showToast(`${c.name} blocked!`)}>
                      <Ban className="h-3.5 w-3.5" />
                    </ActionBtn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {/* Customer Detail Modal */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-sm rounded-2xl">
          <DialogTitle className="font-serif text-xl">Customer Profile</DialogTitle>
          {selectedCustomer && (
            <div className="mt-3 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-full bg-[#f5f0ea] flex items-center justify-center text-xl font-semibold text-[#b2997d]">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-[15px]">{selectedCustomer.name}</p>
                  <p className="text-[12px] text-[#6b6356]">{selectedCustomer.email}</p>
                  <StatusBadge status={selectedCustomer.status} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total Orders",  value: String(selectedCustomer.orders) },
                  { label: "Total Spent",   value: `₹${selectedCustomer.spent.toLocaleString("en-IN")}` },
                  { label: "City",          value: selectedCustomer.city },
                  { label: "Member Since",  value: selectedCustomer.joined },
                ].map((item) => (
                  <div key={item.label} className="bg-[#f5f0ea] rounded-xl p-3">
                    <p className="text-[10px] text-[#6b6356] uppercase tracking-wider mb-0.5">{item.label}</p>
                    <p className="font-semibold text-[13px]">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1 rounded-full text-[12px]" onClick={() => setSelectedCustomer(null)}>
                  Close
                </Button>
                <Button
                  className="flex-1 rounded-full bg-[#81ae74] hover:bg-[#5c8a4e] text-white text-[12px]"
                  onClick={() => { setSelectedCustomer(null); showToast("Email sent to " + selectedCustomer.name) }}
                >
                  Send Email
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
