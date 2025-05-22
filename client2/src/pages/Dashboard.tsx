import { useEffect, useState, type JSX } from "react";
import { AdminDashboard } from "../components/dashboard/AdminDashboard";
import { StudentDashboard } from "../components/dashboard/StudentDashboard";
import { TeacherDashboard } from "../components/dashboard/TeacherDashboard";
import { Skeleton } from "../components/ui/skeleton";
import { useAuth } from "../lib/auth";

export function Dashboard(): JSX.Element {
  const { user, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    console.log("Dashboard - Current user:", user);
    // Check if user is loaded from auth context
    if (user !== undefined || authLoading === false) {
      setIsLoading(false);
    }
  }, [user, authLoading]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    );
  }

  if (!user) {
    console.error("No user found in Dashboard");
    return <div className="p-4">No user found. Please log in again.</div>;
  }

  console.log("Rendering dashboard for role:", user.role);

  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "TEACHER":
      return <TeacherDashboard />;
    case "STUDENT":
      return <StudentDashboard />;
    default:
      console.error("Invalid user role:", user.role);
      return <div className="p-4">Invalid user role: {user.role}</div>;
  }
}
