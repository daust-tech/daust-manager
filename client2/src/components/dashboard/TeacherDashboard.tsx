import { BarChart, CalendarDays, GraduationCap, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { apiService } from "../../services/apiService";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

interface TeacherClass {
  id: string;
  name: string;
  section: string;
  courseName: string;
  courseCode: string;
  studentCount: number;
}

interface TodaySchedule {
  id: string;
  className: string;
  courseName: string;
  roomName: string;
  startTime: string;
  endTime: string;
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<TodaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTeacherData = async () => {
      try {
        setIsLoading(true);
        // Fetch teacher's classes
        const classesResponse = await apiService.get(
          `/teachers/${user?.id}/classes`
        );
        setClasses(classesResponse.data);

        // Fetch today's schedule
        const schedulesResponse = await apiService.get(
          `/teachers/${user?.id}/schedules/today`
        );
        setTodaySchedules(schedulesResponse.data);
      } catch (err) {
        console.error("Failed to fetch teacher data:", err);
        setError("Failed to load dashboard data. Please try again later.");

        // Mock data for development
        setClasses([
          {
            id: "1",
            name: "Mathematics 101",
            section: "A",
            courseName: "Introduction to Mathematics",
            courseCode: "MATH101",
            studentCount: 25,
          },
          {
            id: "2",
            name: "Mathematics 201",
            section: "B",
            courseName: "Advanced Mathematics",
            courseCode: "MATH201",
            studentCount: 18,
          },
        ]);

        setTodaySchedules([
          {
            id: "1",
            className: "Mathematics 101",
            courseName: "Introduction to Mathematics",
            roomName: "Room 101",
            startTime: "09:00",
            endTime: "10:30",
          },
          {
            id: "2",
            className: "Mathematics 201",
            courseName: "Advanced Mathematics",
            roomName: "Room 202",
            startTime: "13:00",
            endTime: "14:30",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeacherData();
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="space-y-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-64" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-64 w-full" />
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
      <h1 className="text-2xl font-semibold mb-2">Teacher Dashboard</h1>

      <p className="text-muted-foreground mb-6">
        Welcome, {user?.name}. Manage your classes and schedules from here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Today's Schedule */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>Today's Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            {todaySchedules.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No classes scheduled for today.
              </p>
            ) : (
              <ScrollArea className="h-[240px] pr-4">
                <div className="space-y-3">
                  {todaySchedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="p-3 bg-muted/50 rounded-md"
                    >
                      <h4 className="font-medium">
                        {schedule.className} ({schedule.courseName})
                      </h4>
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm">{schedule.roomName}</p>
                        <Badge variant="outline">
                          {schedule.startTime} - {schedule.endTime}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}

            <div className="mt-4">
              <Button asChild variant="outline" className="w-full">
                <Link to="/schedules">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  View Full Schedule
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Classes */}
        <Card className="h-full">
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            {classes.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You are not assigned to any classes yet.
              </p>
            ) : (
              <ScrollArea className="h-[240px] pr-4">
                <div className="space-y-3">
                  {classes.map((cls) => (
                    <div key={cls.id} className="p-3 bg-muted/50 rounded-md">
                      <h4 className="font-medium">
                        {cls.name} ({cls.section})
                      </h4>
                      <div className="mt-1">
                        <p className="text-sm font-medium">
                          {cls.courseName} ({cls.courseCode})
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {cls.studentCount} Students
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/classes" className="inline-flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>Manage Classes</span>
                </Link>
              </Button>
              <Button asChild>
                <Link to="/schedules" className="inline-flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>View Schedules</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  to="/classes?action=enroll"
                  className="inline-flex items-center"
                >
                  <UserPlus className="mr-2 h-4 w-4" />
                  <span>Manage Students</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link
                  to="/classes?action=grades"
                  className="inline-flex items-center"
                >
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>Manage Grades</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
