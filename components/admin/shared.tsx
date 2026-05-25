import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeType?: "up" | "down" | "neutral"
  icon: LucideIcon
  iconColor?: "green" | "brown" | "amber" | "red"
}

export function StatCard({
  label, value, change, changeType = "up", icon: Icon, iconColor = "green",
}: StatCardProps) {
  const iconStyles = {
    green: "bg-[#eef5ec] text-[#5c8a4e]",
    brown: "bg-[#f5f0ea] text-[#7a6450]",
    amber: "bg-amber-50 text-amber-600",
    red:   "bg-red-50 text-red-600",
  }
  const changeStyles = {
    up:      "text-[#5c8a4e]",
    down:    "text-red-600",
    neutral: "text-[#6b6356]",
  }
  return (
    <div className="bg-white border border-[#e8e3dc] rounded-2xl p-4">
      <div className="flex items-start justify-between mb-3">
        <p className="text-[11px] font-medium text-[#6b6356] uppercase tracking-wider">{label}</p>
        <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", iconStyles[iconColor])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="font-serif text-2xl font-semibold text-[#0c0f0b] mb-1">{value}</p>
      {change && (
        <p className={cn("text-[11px] flex items-center gap-1", changeStyles[changeType])}>
          {changeType === "up" ? "↑" : changeType === "down" ? "↓" : "–"} {change}
        </p>
      )}
    </div>
  )
}

const badgeMap: Record<string, string> = {
  delivered:  "bg-[#eef5ec] text-[#5c8a4e]",
  active:     "bg-[#eef5ec] text-[#5c8a4e]",
  paid:       "bg-[#eef5ec] text-[#5c8a4e]",
  shipped:    "bg-blue-50 text-blue-700",
  processing: "bg-amber-50 text-amber-700",
  pending:    "bg-amber-50 text-amber-700",
  low:        "bg-amber-50 text-amber-700",
  out:        "bg-red-50 text-red-700",
  cancelled:  "bg-red-50 text-red-700",
  inactive:   "bg-[#f5f0ea] text-[#6b6356]",
  expired:    "bg-[#f5f0ea] text-[#6b6356]",
}

export function StatusBadge({ status }: { status: string }) {
  return (
    <span className={cn(
      "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider",
      badgeMap[status.toLowerCase()] ?? "bg-[#f5f0ea] text-[#6b6356]"
    )}>
      {status.replace(/_/g, " ")}
    </span>
  )
}

export function TableCard({
  title, actions, children, footer,
}: {
  title: string
  actions?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div className="bg-white border border-[#e8e3dc] rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#e8e3dc]">
        <h2 className="text-[13px] font-semibold text-[#0c0f0b]">{title}</h2>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="overflow-x-auto">{children}</div>
      {footer && (
        <div className="px-5 py-3 border-t border-[#e8e3dc] flex items-center justify-between text-[12px] text-[#6b6356]">
          {footer}
        </div>
      )}
    </div>
  )
}

export function MiniStats({ items }: { items: { label: string; value: string; color?: string }[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mb-5">
      {items.map((item) => (
        <div key={item.label} className="bg-white border border-[#e8e3dc] rounded-xl p-3 text-center">
          <p className={cn("font-serif text-xl font-semibold mb-0.5", item.color ?? "text-[#81ae74]")}>
            {item.value}
          </p>
          <p className="text-[10px] text-[#6b6356] uppercase tracking-wider">{item.label}</p>
        </div>
      ))}
    </div>
  )
}

export function ActionBtn({
  onClick, danger = false, children, className,
}: {
  onClick?: () => void
  danger?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "p-1.5 rounded-lg text-[#6b6356] transition-all text-[13px]",
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-[#f5f0ea] hover:text-[#5c8a4e]",
        className
      )}
    >
      {children}
    </button>
  )
}

export const TH = "px-4 py-2.5 text-left text-[10px] font-medium text-[#6b6356] uppercase tracking-wider bg-[#f5f0ea] border-b border-[#e8e3dc]"
export const TD = "px-4 py-3 text-[12px] text-[#0c0f0b] border-b border-[#e8e3dc]/60 group-last:border-0"