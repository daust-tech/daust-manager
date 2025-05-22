import {
  Bell,
  BookOpen,
  Building2,
  Calendar,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  Settings,
  User,
  Users,
} from "lucide-react";
import { ReactNode, useState, type JSX } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

interface MenuItem {
  id: string;
  text: string;
  icon: JSX.Element;
  path: string;
  adminOnly?: boolean;
}

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false);

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  const menuItems: MenuItem[] = [
    {
      id: "dashboard",
      text: "Dashboard",
      icon: <LayoutDashboard size={20} />,
      path: "/dashboard",
    },
    {
      id: "users",
      text: "Users",
      icon: <Users size={20} />,
      path: "/users",
      adminOnly: true,
    },
    {
      id: "courses",
      text: "Courses",
      icon: <BookOpen size={20} />,
      path: "/courses",
    },
    {
      id: "classes",
      text: "Classes",
      icon: <School size={20} />,
      path: "/classes",
    },
    {
      id: "schedules",
      text: "Schedules",
      icon: <Calendar size={20} />,
      path: "/schedules",
    },
    {
      id: "rooms",
      text: "Rooms",
      icon: <Building2 size={20} />,
      path: "/rooms",
      adminOnly: true,
    },
    {
      id: "settings",
      text: "Settings",
      icon: <Settings size={20} />,
      path: "/settings",
    },
  ];

  const renderSidebar = (): JSX.Element => (
    <div className="h-full flex flex-col py-2">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold text-primary">DAUST Manager</h2>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="px-2 py-4">
          {menuItems
            .filter(
              (item) => !item.adminOnly || (user && user.role === "ADMIN")
            )
            .map((item) => (
              <Button
                key={item.id}
                variant={
                  location.pathname === item.path ? "secondary" : "ghost"
                }
                className={`w-full justify-start mb-1 ${
                  location.pathname === item.path ? "font-medium" : ""
                }`}
                onClick={() => navigate(item.path)}
              >
                {item.icon}
                <span className="ml-2">{item.text}</span>
              </Button>
            ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4 z-40"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          {renderSidebar()}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[280px] border-r h-screen">
        {renderSidebar()}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <div className="hidden lg:block flex-1" />
          <div className="flex flex-1 items-center justify-end space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                  <Bell size={20} />
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center">
                    3
                  </Badge>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[280px]">
                <div className="flex items-center justify-between p-2">
                  <p className="text-sm font-medium">Notifications</p>
                  <Button variant="ghost" size="sm">
                    Mark all as read
                  </Button>
                </div>
                <DropdownMenuSeparator />
                {[1, 2, 3].map((id) => (
                  <DropdownMenuItem key={id} className="p-3 cursor-pointer">
                    <div>
                      <p className="text-sm font-medium">New announcement</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        There is a new schedule change for your class.
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{user?.name || "User"}</p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </div>
    </div>
  );
}
