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

  const recentOrders = ordersData.slice(0, 5)

  const overviewStats = {
    revenue: stats.totalRevenue,
    orders: stats.totalOrders,
    customers: stats.totalCustomers,
    lowStock: products.filter((product) => product.stock <= 10).length,
  }

  return (
    <AdminOverviewClient 
      stats={overviewStats}
      recentOrders={recentOrders}
      products={products}
      categories={categories}
    />
  )
}
