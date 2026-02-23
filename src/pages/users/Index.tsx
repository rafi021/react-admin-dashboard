import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import { ADMIN_API_ENDPOINTS } from "@/lib/config";
import type { AdminAPIResponse, AdminPaginatedAPIResponse, User } from "@/type";
import { useEffect, useState } from "react";
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
  Loader2,
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
import useAuthStore from "@/store/useAuthStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { userSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "@/components/ui/image-upload";

const UsersIndex = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  // const [refreshing, setRefreshing] = useState(false);
  // const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  // const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  // const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  // const [perPage, setPerPage] = useState(10);
  // const [totalPages, setTotalPages] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [from, setFrom] = useState<number | null>(null);
  const [to, setTo] = useState<number | null>(null);

  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  type FormData = z.infer<typeof userSchema>;
  const formAdd = useForm<FormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      role_id: "5",
      avatar: "",
    },
  });

  const handleAddUser = async (data: FormData) => {
    setFormLoading(true);
    try {
      const { data: response } = await axiosPrivate.post<
        AdminAPIResponse<User>
      >(ADMIN_API_ENDPOINTS.USER_CREATE, data);
      if (response.success) {
        setIsAddModalOpen(false);
        formAdd.reset();
        fetchUsers();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFormLoading(false);
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data: response } = await axiosPrivate.get<
        AdminPaginatedAPIResponse<User>
      >(ADMIN_API_ENDPOINTS.USER_INDEX);

      setUsers(response.data || []);
      setTotal(response.total || 0);
      setCurrentPage(response.current_page || 1);
      setLastPage(response.last_page || 1);
      setFrom(response.from || null);
      setTo(response.to || null);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

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

          {isAdmin && (
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus />
              Add User
            </Button>
          )}
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
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name, email, phone"
                className="pl-9"
              />
            </div>

            <Select
              value={roleFilter}
              onValueChange={(value) => setRoleFilter(value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All roles</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="user">User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button disabled={loading}>Apply</Button>
            <Button variant="outline" disabled={loading}>
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
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground px-2">
                Page {currentPage} of {lastPage}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {/* Modals for view, edit, add, delete would go here */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="sm:max-w-137.5 max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user by filling out the form below. Make sure to
              provide valid information for all required fields.
            </DialogDescription>
          </DialogHeader>
          <Form {...formAdd}>
            <form
              className="space-y-6 mt-4"
              onSubmit={formAdd.handleSubmit(handleAddUser)}
            >
              <FormField
                control={formAdd.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        disabled={formLoading}
                        className="focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        placeholder="john doe"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        disabled={formLoading}
                        className="focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        placeholder="john.doe@example.com"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        disabled={formLoading}
                        className="focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        placeholder="(123) 456-7890"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        {...field}
                        disabled={formLoading}
                        className="focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background"
                        placeholder="Enter your password"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="role_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Role
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        disabled={formLoading}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">Merchant</SelectItem>
                          <SelectItem value="6">Staff</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <FormField
                control={formAdd.control}
                name="avatar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">
                      Avatar
                    </FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value ?? ""}
                        onChange={field.onChange}
                        disabled={formLoading}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500 text-xs" />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  disabled={formLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant={"default"}
                  disabled={formLoading}
                  className="hover:bg-amber-700"
                >
                  {formLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UsersIndex;
