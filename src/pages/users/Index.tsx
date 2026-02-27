import { useAxiosPrivate } from "@/hooks/useAxiosPrivate";
import type { User } from "@/type";
import { useEffect } from "react";
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
import { userEditSchema, userSchema } from "@/lib/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageUpload } from "@/components/ui/image-upload";
import { toast } from "sonner";
import UserSkeleton from "@/components/skeletons/user-skeleton";
import useUsersStore from "@/store/useUsersStore";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
const UsersIndex = () => {
  const axiosPrivate = useAxiosPrivate();
  const { checkIsAdmin } = useAuthStore();
  const isAdmin = checkIsAdmin();

  const {
    users,
    loading,
    refreshing,
    formLoading,
    isEditModalOpen,
    isAddModalOpen,
    isDeleteModalOpen,
    selectedUser,
    searchTerm,
    roleFilter,
    total,
    currentPage,
    lastPage,
    from,
    to,
    setSearchTerm,
    setRoleFilter,
    setIsEditModalOpen,
    setIsAddModalOpen,
    setIsDeleteModalOpen,
    setSelectedUser,
    openEditModal,
    openDeleteModal,
    fetchUsers,
    applyFilters,
    resetFilters,
    goToPage,
    goToPreviousPage,
    goToNextPage,
    addUser,
    updateUser,
    deleteUser,
  } = useUsersStore();

  type FormData = z.infer<typeof userSchema>;
  type EditFormData = z.infer<typeof userEditSchema>;

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

  const formEdit = useForm<EditFormData>({
    resolver: zodResolver(userEditSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      role_id: "5",
      avatar: "",
    },
  });

  const handleAddUser = async (data: FormData) => {
    try {
      const success = await addUser(axiosPrivate, data);
      if (success) {
        toast.success("User created successfully");
        formAdd.reset();
        setIsAddModalOpen(false);
        await fetchUsers(axiosPrivate);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to create user");
    }
  };

  const handleEdit = async (user: User) => {
    if (!user) return;
    openEditModal(user);
    formEdit.reset({
      name: user.name,
      email: user.email,
      phone: user.phone,
      role_id: user.role_id as "5" | "6",
      avatar: user.avatar || "",
    });
  };

  const handleEditUser = async (data: EditFormData) => {
    if (!selectedUser) return;

    try {
      const success = await updateUser(axiosPrivate, selectedUser.id, data);

      if (success) {
        toast.success("User updated successfully");
        setIsEditModalOpen(false);
        setSelectedUser(null);
        await fetchUsers(axiosPrivate);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to update user");
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!selectedUser) return;

    try {
      const success = await deleteUser(axiosPrivate, user.id);
      if (success) {
        toast.success("User deleted successfully");
        setIsDeleteModalOpen(false);
        setSelectedUser(null);
        await fetchUsers(axiosPrivate);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete user");
    } finally {
      setSelectedUser(null);
      setIsDeleteModalOpen(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        await fetchUsers(axiosPrivate);
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch users");
      }
    };

    init();
  }, [axiosPrivate, fetchUsers]);

  const getVisiblePages = () => {
    if (lastPage <= 5) {
      return Array.from({ length: lastPage }, (_, index) => index + 1);
    }

    if (currentPage <= 3) {
      return [1, 2, 3, 4, 5];
    }

    if (currentPage >= lastPage - 2) {
      return [lastPage - 4, lastPage - 3, lastPage - 2, lastPage - 1, lastPage];
    }

    return [
      currentPage - 2,
      currentPage - 1,
      currentPage,
      currentPage + 1,
      currentPage + 2,
    ];
  };

  const visiblePages = getVisiblePages();
  const showLeftEllipsis = visiblePages.length > 0 && visiblePages[0] > 1;
  const showRightEllipsis =
    visiblePages.length > 0 && visiblePages[visiblePages.length - 1] < lastPage;

  if (loading) {
    return <UserSkeleton />;
  }
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
          <Button
            variant={"outline"}
            onClick={() => fetchUsers(axiosPrivate)}
            disabled={refreshing}
          >
            <RefreshCw className={refreshing ? "animate-spin" : ""} />
            Refresh
          </Button>

          {isAdmin && (
            <Button
              variant={"default"}
              onClick={() => setIsAddModalOpen(true)}
              className="hover:bg-amber-700"
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
                <SelectItem value="5">Merchant</SelectItem>
                <SelectItem value="6">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 mt-4">
            <Button
              disabled={loading}
              onClick={() => applyFilters(axiosPrivate)}
            >
              Apply
            </Button>
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => resetFilters(axiosPrivate)}
            >
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
                          onClick={() => handleEdit(user)}
                        >
                          <Edit />
                        </Button>{" "}
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Delete user"
                          className="border border-border"
                          onClick={() => openDeleteModal(user)}
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

            <Pagination className="mx-0 w-auto justify-end">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage <= 1 || loading) return;
                      goToPreviousPage(axiosPrivate);
                    }}
                    aria-disabled={currentPage <= 1 || loading}
                    className={
                      currentPage <= 1 || loading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>

                {showLeftEllipsis && (
                  <>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(axiosPrivate, 1);
                        }}
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                  </>
                )}

                {visiblePages.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      href="#"
                      isActive={page === currentPage}
                      onClick={(e) => {
                        e.preventDefault();
                        if (loading || page === currentPage) return;
                        goToPage(axiosPrivate, page);
                      }}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {showRightEllipsis && (
                  <>
                    <PaginationItem>
                      <PaginationEllipsis />
                    </PaginationItem>
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          goToPage(axiosPrivate, lastPage);
                        }}
                      >
                        {lastPage}
                      </PaginationLink>
                    </PaginationItem>
                  </>
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage >= lastPage || loading) return;
                      goToNextPage(axiosPrivate);
                    }}
                    aria-disabled={currentPage >= lastPage || loading}
                    className={
                      currentPage >= lastPage || loading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
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

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-137.5 max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's information by modifying the fields below. Make
              sure to provide valid information for all required fields.
            </DialogDescription>
          </DialogHeader>
          <Form {...formEdit}>
            <form
              className="space-y-6 mt-4"
              onSubmit={formEdit.handleSubmit(handleEditUser)}
            >
              <FormField
                control={formEdit.control}
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
                control={formEdit.control}
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
                control={formEdit.control}
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
                control={formEdit.control}
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
                control={formEdit.control}
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
                  onClick={() => setIsEditModalOpen(false)}
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
                      Updating...
                    </>
                  ) : (
                    "Update User"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete User Modal */}
      <AlertDialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{selectedUser?.name}</span>'s
              account.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => handleDeleteUser(selectedUser!)}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default UsersIndex;
