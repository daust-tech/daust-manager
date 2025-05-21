import { useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { Skeleton } from "../ui/skeleton";
import { AdminDashboard } from "./AdminDashboard";
import { StudentDashboard } from "./StudentDashboard";
import { TeacherDashboard } from "./TeacherDashboard";

export function Dashboard() {
  const { user, isLoading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && !user) {
      setError("User not authenticated");
    }
  }, [isLoading, user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="space-y-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-60 w-96" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[80vh]">
        <div className="text-red-500 text-lg font-medium">{error}</div>
      </div>
    );
  }

  // Render different dashboards based on user role
  switch (user?.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "TEACHER":
      return <TeacherDashboard />;
    case "STUDENT":
      return <StudentDashboard />;
    default:
      return (
        <div className="flex justify-center items-center min-h-[80vh]">
          <div className="text-red-500 text-lg font-medium">
            Invalid user role
          </div>
        </div>
      );
  }
}
