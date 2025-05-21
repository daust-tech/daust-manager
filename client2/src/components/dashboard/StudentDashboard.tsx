import {
  BarChart,
  CalendarDays,
  ClipboardCheck,
  GraduationCap,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../lib/auth";
import { apiService } from "../../services/apiService";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Skeleton } from "../ui/skeleton";

interface EnrolledClass {
  id: string;
  name: string;
  section: string;
  courseName: string;
  courseCode: string;
  teacherName: string;
  grade?: string | null;
  progress: number; // 0-100
}

interface TodaySchedule {
  id: string;
  className: string;
  courseName: string;
  roomName: string;
  startTime: string;
  endTime: string;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [todaySchedules, setTodaySchedules] = useState<TodaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsLoading(true);
        // Fetch student's enrolled classes
        const classesResponse = await apiService.get(
          `/students/${user?.id}/classes`
        );
        setEnrolledClasses(classesResponse.data);

        // Fetch today's schedule
        const schedulesResponse = await apiService.get(
          `/students/${user?.id}/schedules/today`
        );
        setTodaySchedules(schedulesResponse.data);
      } catch (err) {
        console.error("Failed to fetch student data:", err);
        setError("Failed to load dashboard data. Please try again later.");

        // Mock data for development
        setEnrolledClasses([
          {
            id: "1",
            name: "Mathematics 101",
            section: "A",
            courseName: "Introduction to Mathematics",
            courseCode: "MATH101",
            teacherName: "Dr. John Doe",
            grade: "A",
            progress: 85,
          },
          {
            id: "2",
            name: "Physics 101",
            section: "B",
            courseName: "Introduction to Physics",
            courseCode: "PHYS101",
            teacherName: "Dr. Jane Smith",
            grade: null,
            progress: 42,
          },
          {
            id: "3",
            name: "Computer Science 101",
            section: "A",
            courseName: "Introduction to Programming",
            courseCode: "CS101",
            teacherName: "Prof. Bob Johnson",
            grade: "B+",
            progress: 68,
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
            className: "Physics 101",
            courseName: "Introduction to Physics",
            roomName: "Room 202",
            startTime: "13:00",
            endTime: "14:30",
          },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStudentData();
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

  const getBadgeVariant = (grade: string) => {
    if (grade.startsWith("A")) return "default";
    if (grade.startsWith("B")) return "secondary";
    if (grade.startsWith("C")) return "outline";
    if (grade.startsWith("D")) return "destructive";
    return "destructive";
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-2">Student Dashboard</h1>

      <p className="text-muted-foreground mb-6">
        Welcome, {user?.name}. View your classes and schedules here.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Today's Schedule */}
        <Card className="md:col-span-5">
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
                      <h4 className="font-medium">{schedule.className}</h4>
                      <p className="text-sm text-muted-foreground">
                        {schedule.courseName}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm">{schedule.roomName}</span>
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

        {/* Enrolled Classes */}
        <Card className="md:col-span-7">
          <CardHeader>
            <CardTitle>My Enrolled Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            {enrolledClasses.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                You are not enrolled in any classes.
              </p>
            ) : (
              <ScrollArea className="h-[320px] pr-4">
                <div className="space-y-4">
                  {enrolledClasses.map((cls) => (
                    <div key={cls.id} className="p-4 bg-muted/50 rounded-md">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-medium">
                            {cls.name} ({cls.section})
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {cls.courseName} ({cls.courseCode})
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            Instructor: {cls.teacherName}
                          </p>
                        </div>
                        {cls.grade && (
                          <Badge variant={getBadgeVariant(cls.grade)}>
                            Grade: {cls.grade}
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-1.5">
                        <div className="text-xs text-muted-foreground flex justify-between">
                          <span>Progress</span>
                          <span>{Math.round(cls.progress)}%</span>
                        </div>
                        <Progress value={cls.progress} className="h-1.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-12">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <Separator className="mb-4" />

            <div className="flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/classes" className="inline-flex items-center">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  <span>View All Classes</span>
                </Link>
              </Button>
              <Button asChild>
                <Link to="/schedules" className="inline-flex items-center">
                  <CalendarDays className="mr-2 h-4 w-4" />
                  <span>View Schedule</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/assignments" className="inline-flex items-center">
                  <ClipboardCheck className="mr-2 h-4 w-4" />
                  <span>My Assignments</span>
                </Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/grades" className="inline-flex items-center">
                  <BarChart className="mr-2 h-4 w-4" />
                  <span>View Grades</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
