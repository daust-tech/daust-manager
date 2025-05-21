import {
  BookOpen,
  Building2,
  Calendar,
  Home,
  LogOut,
  Menu,
  School,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";
import { StudentDashboard } from "../components/dashboard/StudentDashboard";
import { TeacherDashboard } from "../components/dashboard/TeacherDashboard";
import { Button } from "../components/ui/button";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "../components/ui/sheet";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../lib/auth";

interface MenuItem {
  id: string;
  text: string;
  icon: JSX.Element;
  adminOnly?: boolean;
}

const DRAWER_WIDTH = 240;

export function Dashboard(): JSX.Element {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedMenu, setSelectedMenu] = useState<string>("dashboard");
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check if user is loaded from auth context
    if (user !== undefined) {
      setIsLoading(false);
    }
  }, [user]);

  const handleLogout = (): void => {
    logout();
    navigate("/login");
  };

  const menuItems: MenuItem[] = [
    { id: "dashboard", text: "Dashboard", icon: <Home size={20} /> },
    { id: "users", text: "Users", icon: <Users size={20} />, adminOnly: true },
    { id: "courses", text: "Courses", icon: <BookOpen size={20} /> },
    { id: "classes", text: "Classes", icon: <School size={20} /> },
    { id: "schedules", text: "Schedules", icon: <Calendar size={20} /> },
    {
      id: "rooms",
      text: "Rooms",
      icon: <Building2 size={20} />,
      adminOnly: true,
    },
  ];

  const handleNavigate = (id: string): void => {
    setSelectedMenu(id);
    if (id !== "dashboard") {
      navigate(`/${id}`);
    } else {
      navigate("/dashboard");
    }
  };

  const renderSidebar = (): JSX.Element => (
    <div className="h-full flex flex-col py-2">
      <div className="px-6 py-4">
        <h2 className="text-xl font-semibold">DAUST Manager</h2>
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
                variant={selectedMenu === item.id ? "secondary" : "ghost"}
                className={`w-full justify-start mb-1 ${
                  selectedMenu === item.id ? "font-medium" : ""
                }`}
                onClick={() => handleNavigate(item.id)}
              >
                {item.icon}
                <span className="ml-2">{item.text}</span>
              </Button>
            ))}
        </div>
      </ScrollArea>
      <Separator className="my-2" />
      <div className="px-2 pb-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span className="ml-2">Logout</span>
        </Button>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  const renderContent = (): JSX.Element | null => {
    if (!user) return null;

    switch (user.role) {
      case "ADMIN":
        return <AdminDashboard />;
      case "TEACHER":
        return <TeacherDashboard />;
      case "STUDENT":
        return <StudentDashboard />;
      default:
        return <div>Invalid role</div>;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="fixed top-4 left-4 z-40"
          >
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[240px]">
          {renderSidebar()}
        </SheetContent>
      </Sheet>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-[240px] border-r h-screen">
        {renderSidebar()}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6 lg:px-10">
          <div className="lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
              <Menu className="h-6 w-6" />
            </Button>
          </div>
          <div className="font-semibold">
            {menuItems.find((item) => item.id === selectedMenu)?.text}
          </div>
        </div>
        <main className="flex-1 p-6 lg:p-10">{renderContent()}</main>
      </div>
    </div>
  );
}
