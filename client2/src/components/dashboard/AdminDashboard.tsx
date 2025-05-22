import {
  BookOpen,
  CalendarDays,
  GraduationCap,
  Home,
  PlusCircle,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { dashboardApi } from "@/services/apiService";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

interface StatsSummary {
  users: number;
  courses: number;
  classes: number;
  rooms: number;
  schedules: number;
}

export function AdminDashboard() {
  const [stats, setStats] = useState<StatsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        // Call API to get dashboard summary data
        const response = await dashboardApi.getSummary();
        setStats(response.data);
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data. Please try again later.");
        // Setting mock data but still showing the error message
        setStats({
          users: 45,
          courses: 24,
          classes: 67,
          rooms: 12,
          schedules: 98,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="space-y-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-4">
        <div className="p-3 bg-red-50 border border-red-300 rounded-md">
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Admin Dashboard</h1>

      <p className="text-muted-foreground mb-6">
        Welcome to the school management system. Here's a summary of your data.
      </p>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6 text-center">
            <Users className="h-10 w-10 text-primary mx-auto mb-2" />
            <h2 className="text-3xl font-bold">{stats?.users}</h2>
            <p className="text-sm text-muted-foreground">Users</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-10 w-10 text-primary mx-auto mb-2" />
            <h2 className="text-3xl font-bold">{stats?.courses}</h2>
            <p className="text-sm text-muted-foreground">Courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <GraduationCap className="h-10 w-10 text-primary mx-auto mb-2" />
            <h2 className="text-3xl font-bold">{stats?.classes}</h2>
            <p className="text-sm text-muted-foreground">Classes</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <Home className="h-10 w-10 text-primary mx-auto mb-2" />
            <h2 className="text-3xl font-bold">{stats?.rooms}</h2>
            <p className="text-sm text-muted-foreground">Rooms</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6 text-center">
            <CalendarDays className="h-10 w-10 text-primary mx-auto mb-2" />
            <h2 className="text-3xl font-bold">{stats?.schedules}</h2>
            <p className="text-sm text-muted-foreground">Schedules</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            <div className="flex flex-wrap gap-2">
              <Button asChild className="flex items-center gap-2">
                <Link to="/users">
                  <Users className="h-4 w-4" />
                  <span>Manage Users</span>
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="flex items-center gap-2"
              >
                <Link to="/users?action=add">
                  <PlusCircle className="h-4 w-4" />
                  <span>Add User</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            <div className="flex flex-wrap gap-2">
              <Button asChild className="flex items-center gap-2">
                <Link to="/courses">
                  <BookOpen className="h-4 w-4" />
                  <span>Manage Courses</span>
                </Link>
              </Button>
              <Button asChild className="flex items-center gap-2">
                <Link to="/classes">
                  <GraduationCap className="h-4 w-4" />
                  <span>Manage Classes</span>
                </Link>
              </Button>
              <Button asChild className="flex items-center gap-2">
                <Link to="/schedules">
                  <CalendarDays className="h-4 w-4" />
                  <span>Manage Schedules</span>
                </Link>
              </Button>
              <Button asChild className="flex items-center gap-2">
                <Link to="/rooms">
                  <Home className="h-4 w-4" />
                  <span>Manage Rooms</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
