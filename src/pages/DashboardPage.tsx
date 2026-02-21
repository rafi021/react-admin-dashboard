import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUpRight,
  Boxes,
  CircleDollarSign,
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
} from "lucide-react";
import OrderVolumeChart from "@/components/dashboard/OrderVolumeChart";
import CustomerVisitsChart from "@/components/dashboard/CustomerVisitsChart";

const stats = [
  {
    title: "Total Revenue",
    value: "$24,980",
    trend: "+18.2%",
    detail: "from last month",
    icon: CircleDollarSign,
  },
  {
    title: "Orders",
    value: "1,284",
    trend: "+9.4%",
    detail: "from last month",
    icon: ShoppingCart,
  },
  {
    title: "Products",
    value: "342",
    trend: "+3.1%",
    detail: "active listings",
    icon: Package,
  },
  {
    title: "Customers",
    value: "9,412",
    trend: "+12.6%",
    detail: "active users",
    icon: Users,
  },
];

const recentOrders = [
  {
    id: "#ORD-2418",
    customer: "Olivia Brown",
    total: "$129.00",
    status: "Paid",
  },
  {
    id: "#ORD-2417",
    customer: "Ethan Wilson",
    total: "$89.00",
    status: "Pending",
  },
  {
    id: "#ORD-2416",
    customer: "Sophia Taylor",
    total: "$214.00",
    status: "Shipped",
  },
  {
    id: "#ORD-2415",
    customer: "Liam Anderson",
    total: "$45.00",
    status: "Cancelled",
  },
  {
    id: "#ORD-2414",
    customer: "Ava Martinez",
    total: "$318.00",
    status: "Paid",
  },
];

const topProducts = [
  { name: "Wireless Earbuds Pro", sold: 482, revenue: "$13,496" },
  { name: "Smart Fitness Watch", sold: 356, revenue: "$11,748" },
  { name: "Portable Blender", sold: 290, revenue: "$8,410" },
  { name: "Minimal Desk Lamp", sold: 274, revenue: "$7,945" },
];

const statusClasses: Record<string, string> = {
  Paid: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Shipped: "bg-blue-100 text-blue-700",
  Cancelled: "bg-rose-100 text-rose-700",
};

const DashboardPage = () => {
  return (
    <section className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center justify-between">
                  {item.title}
                  <Icon className="size-4 text-muted-foreground" />
                </CardDescription>
                <CardTitle className="text-2xl tracking-tight">
                  {item.value}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-emerald-600">
                    {item.trend}
                  </span>{" "}
                  {item.detail}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <div>
              <CardTitle>Recent Orders</CardTitle>
              <CardDescription>
                Latest transactions from your store
              </CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View all
              <ArrowUpRight className="size-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-3"
                >
                  <div>
                    <p className="text-sm font-medium">{order.id}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.customer}
                    </p>
                  </div>
                  <div className="text-sm font-semibold">{order.total}</div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
            <CardDescription>Best selling items this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((product) => (
              <div
                key={product.name}
                className="flex items-start justify-between gap-3 rounded-lg border p-3"
              >
                <div className="flex items-center gap-2">
                  <ShoppingBag className="mt-0.5 size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.sold} sold
                    </p>
                  </div>
                </div>
                <p className="text-sm font-semibold">{product.revenue}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <OrderVolumeChart />
        <CustomerVisitsChart />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Items running low in stock</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Boxes className="size-4 text-amber-600" />
                <div>
                  <p className="text-sm font-medium">Premium Hoodie</p>
                  <p className="text-xs text-muted-foreground">Only 8 left</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Restock
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-2">
                <Boxes className="size-4 text-amber-600" />
                <div>
                  <p className="text-sm font-medium">Travel Mug</p>
                  <p className="text-xs text-muted-foreground">Only 5 left</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Restock
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common admin actions</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <Button className="justify-start" variant="outline">
              <ShoppingCart className="size-4" />
              Create Order
            </Button>
            <Button className="justify-start" variant="outline">
              <Package className="size-4" />
              Add Product
            </Button>
            <Button className="justify-start" variant="outline">
              <Users className="size-4" />
              View Customers
            </Button>
            <Button className="justify-start" variant="outline">
              <CircleDollarSign className="size-4" />
              Sales Report
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default DashboardPage;
