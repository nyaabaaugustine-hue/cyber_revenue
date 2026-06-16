import { useState } from "react";
import { Shield, Plus, Search, Mail, Edit, MoreVertical } from "lucide-react";
import { useAuth } from "../utils/AuthContext";
import { hasPermission, roleLabels, roleBadgeStyles } from "../utils/permissions";
import { users, agentStats, formatDate } from "../utils/data";
import { User, UserRole } from "../types";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";

export function Users() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user: currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");

  if (!hasPermission(currentUser?.role || "admin", "users", "view")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  const allUsers: User[] = [
    ...users,
    ...agentStats.map((a) => ({
      id: a.officerId,
      fullName: a.officerName,
      email: `${a.officerName.toLowerCase().replace(" ", ".")}@kma.gov.gh`,
      phone: "+233 XX XXX XXXX",
      role: "field_officer" as UserRole,
      districtId: "dist-1",
      districtName: "Kumasi Metropolitan",
      zoneId: a.zone.split(" - ")[0].toLowerCase().replace(" ", "-"),
      zoneName: a.zone,
      avatarUrl: a.avatarUrl,
      isActive: a.isActive,
      lastActiveAt: a.lastActiveAt,
    })),
  ];

  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === "all" || u.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const statCards = [
    { label: "Total Users", value: allUsers.length },
    { label: "Active", value: allUsers.filter((u) => u.isActive).length },
    { label: "Field Officers", value: allUsers.filter((u) => u.role === "field_officer").length },
    { label: "Admins", value: allUsers.filter((u) => u.role === "admin" || u.role === "manager").length },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground mt-1">Manage system users and their permissions</p>
        </div>
        {hasPermission(currentUser?.role || "admin", "users", "create") && (
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Roles</SelectItem>
            <SelectItem value="super_admin">Super Admin</SelectItem>
            <SelectItem value="district_admin">District Admin</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
            <SelectItem value="field_officer">Field Officer</SelectItem>
            <SelectItem value="supervisor">Supervisor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Zone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Active</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <Sheet key={user.id}>
                    <SheetTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedUser(user)}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                              <AvatarFallback>{user.fullName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium text-foreground">{user.fullName}</p>
                              <p className="text-xs text-muted-foreground">{user.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={roleBadgeStyles[user.role]} variant="outline">
                            {roleLabels[user.role]}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {user.zoneName || user.districtName || "\u2014"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-muted-foreground"}`}
                            />
                            <span className="text-sm text-muted-foreground">
                              {user.isActive ? "Active" : "Inactive"}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {user.lastActiveAt ? formatDate(user.lastActiveAt) : "\u2014"}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <Mail className="w-4 h-4" />
                            </Button>
                            {hasPermission(currentUser?.role || "admin", "users", "edit") && (
                              <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon" onClick={(e) => e.stopPropagation()}>
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>{user.fullName}</SheetTitle>
                        <SheetDescription>{user.email}</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div className="flex items-center gap-4 py-2 border-b">
                          <Avatar className="w-16 h-16">
                            <AvatarImage src={user.avatarUrl} alt={user.fullName} />
                            <AvatarFallback className="text-lg">{user.fullName.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-lg font-semibold">{user.fullName}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Phone</span>
                          <span className="font-medium text-right">{user.phone}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Role</span>
                          <span className="font-medium text-right">
                            <Badge className={roleBadgeStyles[user.role]} variant="outline">
                              {roleLabels[user.role]}
                            </Badge>
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">District</span>
                          <span className="font-medium text-right">{user.districtName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <span className={`w-2 h-2 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-muted-foreground"}`} />
                              <span>{user.isActive ? "Active" : "Inactive"}</span>
                            </div>
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Last Active</span>
                          <span className="font-medium text-right">
                            {user.lastActiveAt ? formatDate(user.lastActiveAt) : "\u2014"}
                          </span>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </TableBody>
        </Table>
      </Card>
    </div>
  );
}
