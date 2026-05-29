import { getDashboardStats, getAdminOrders } from "@/lib/actions/orders"
import { getAdminProducts } from "@/lib/actions/products"
import { getCategories } from "@/lib/actions/categories"
import AdminOverviewClient from "./admin-overview-client"

export default async function AdminOverviewPage() {
  const [stats, ordersData, products, categories] = await Promise.all([
    getDashboardStats(),
    getAdminOrders({ limit: 5 }),
    getAdminProducts(),
    getCategories(),
  ])

  const recentOrders = ordersData.orders.slice(0, 5)

  return (
    <AdminOverviewClient 
      stats={stats}
      recentOrders={recentOrders}
      products={products}
      categories={categories}
    />
  )
}
