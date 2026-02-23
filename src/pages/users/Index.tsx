import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ADMIN_API_ENDPOINTS } from "@/lib/config";
import type { AdminPaginatedAPIResponse, User } from "@/type";
import { useCallback, useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Edit,
  Eye,
  Plus,
  RefreshCw,
  Search,
  Trash,
  Users2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const UsersIndex = () => {
  const axiosPrivate = useAxiosPrivate();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);

  const [filters, setFilters] = useState({
    search: "",
    paymentStatus: "all",
    nextDueDate: "",
  });
  const [appliedFilters, setAppliedFilters] = useState(filters);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data: response } = await axiosPrivate.get<
        AdminPaginatedAPIResponse<User>
      >(ADMIN_API_ENDPOINTS.USER_INDEX, {
        params: {
          page: currentPage,
          search: appliedFilters.search || undefined,
          payment_status:
            appliedFilters.paymentStatus !== "all"
              ? appliedFilters.paymentStatus
              : undefined,
          next_due_date: appliedFilters.nextDueDate || undefined,
        },
      });

      setUsers(response.data || []);
      setCurrentPage(response.current_page || 1);
      setLastPage(response.last_page || 1);
      setTotal(response.total || 0);
      setFrom(response.from ?? null);
      setTo(response.to ?? null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [axiosPrivate, appliedFilters, currentPage]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const applyFilters = () => {
    setCurrentPage(1);
    setAppliedFilters(filters);
  };

  const resetFilters = () => {
    const defaultFilters = {
      search: "",
      paymentStatus: "all",
      nextDueDate: "",
    };
    setFilters(defaultFilters);
    setAppliedFilters(defaultFilters);
    setCurrentPage(1);
  };

  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < lastPage;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl md:text-3xl font-bold">Users Management</h1>
          <p className="text-muted-foreground mt-0.5">
            View and manage all system users
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-primary flex items-center gap-1">
            <Users2 className="w-7 h-7" />
            <p className="text-2xl font-bold">{users?.length}</p>
          </div>
          <Button variant={"outline"} onClick={fetchUsers} disabled={loading}>
            <RefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </Button>

          <Button>
            <Plus />
            Add User
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <div className="md:col-span-2 relative">
              <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                placeholder="Search by name, email, phone"
                className="pl-9"
              />
            </div>

            <Select
              value={filters.paymentStatus}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, paymentStatus: value }))
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Payment status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All payments</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
                <SelectItem value="unpaid">Unpaid</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              value={filters.nextDueDate}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, nextDueDate: e.target.value }))
              }
            />
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button onClick={applyFilters} disabled={loading}>
              Apply
            </Button>
            <Button variant="outline" onClick={resetFilters} disabled={loading}>
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>ShopId</TableHead>
                <TableHead>Avatar</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead>Next Due Date</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users?.length > 0 ? (
                users.map((user: User) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.id}</TableCell>
                    <TableCell>{user.shop_id}</TableCell>
                    <TableCell>
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold shadow-sm overflow-hidden">
                        {user?.avatar ? (
                          <img
                            src={user?.avatar}
                            alt="userImage"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-lg font-black">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.phone}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.role_name}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.payment_status === "paid" ? (
                        <Badge variant={"default"}>Paid</Badge>
                      ) : (
                        <Badge variant={"destructive"}>Unpaid</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.next_due_date
                        ? new Date(user.next_due_date).toLocaleDateString()
                        : "-"}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          title="View user details"
                          className="border border-border"
                        >
                          <Eye />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Edit user"
                          className="border border-border"
                        >
                          <Edit />
                        </Button>{" "}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete user"
                          className="border border-border"
                        >
                          <Trash />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="text-center text-muted-foreground"
                  >
                    {loading ? "Loading users..." : "No users found"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {total > 0 && from !== null && to !== null
                ? `Showing ${from}-${to} of ${total}`
                : "No records"}
            </p>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => prev - 1)}
                disabled={!canGoPrev || loading}
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {lastPage}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => prev + 1)}
                disabled={!canGoNext || loading}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersIndex;
