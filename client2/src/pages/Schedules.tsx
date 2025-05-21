import { Pencil, PlusCircle, Search, Trash } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Page } from "../components/layout/Page";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { apiService } from "../services/apiService";

interface Course {
  id: string;
  name: string;
}

interface Teacher {
  id: string;
  name: string;
}

interface Class {
  id: string;
  name: string;
  course?: Course;
  teacher?: Teacher;
}

interface Room {
  id: string;
  name: string;
  building: string;
}

interface Schedule {
  id: string;
  class?: Class;
  room?: Room;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

interface FormData {
  classId: string;
  roomId: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export function Schedules(): JSX.Element {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<FormData>({
    classId: "",
    roomId: "",
    dayOfWeek: "",
    startTime: "",
    endTime: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchSchedules();
    fetchClasses();
    fetchRooms();
  }, []);

  const fetchSchedules = async (): Promise<void> => {
    try {
      const response = await apiService.get<Schedule[]>("/schedules");
      setSchedules(response.data);
    } catch (err) {
      setError("Failed to fetch schedules");
    }
  };

  const fetchClasses = async (): Promise<void> => {
    try {
      const response = await apiService.get<Class[]>("/classes");
      setClasses(response.data);
    } catch (err) {
      setError("Failed to fetch classes");
    }
  };

  const fetchRooms = async (): Promise<void> => {
    try {
      const response = await apiService.get<Room[]>("/rooms");
      setRooms(response.data);
    } catch (err) {
      setError("Failed to fetch rooms");
    }
  };

  const handleOpen = (): void => setOpen(true);
  const handleClose = (): void => {
    setOpen(false);
    setFormData({
      classId: "",
      roomId: "",
      dayOfWeek: "",
      startTime: "",
      endTime: "",
    });
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await apiService.post("/schedules", formData);
      handleClose();
      fetchSchedules();
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create schedule");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (field: string, value: string): void => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const filteredSchedules = schedules.filter(
    (schedule) =>
      (schedule.class?.name.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      ) ||
      (schedule.room?.name.toLowerCase() || "").includes(
        searchQuery.toLowerCase()
      )
  );

  const formatTime = (time: string): string => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Page
      title="Schedules"
      breadcrumbs={[
        { text: "Dashboard", href: "/dashboard" },
        { text: "Schedules" },
      ]}
    >
      <Card className="shadow-sm">
        <CardContent className="pt-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center relative w-64">
              <Search className="absolute left-2 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search schedules..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={handleOpen}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Schedule
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Day</TableHead>
                <TableHead>Start Time</TableHead>
                <TableHead>End Time</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSchedules.map((schedule) => (
                <TableRow key={schedule.id}>
                  <TableCell>{schedule.class?.name}</TableCell>
                  <TableCell>{schedule.room?.name}</TableCell>
                  <TableCell>{schedule.dayOfWeek}</TableCell>
                  <TableCell>{formatTime(schedule.startTime)}</TableCell>
                  <TableCell>{formatTime(schedule.endTime)}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredSchedules.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No schedules found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Schedule</DialogTitle>
            <DialogDescription>
              Create a new schedule for a class in a specific room.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="classId">Class</Label>
                <Select
                  value={formData.classId}
                  onValueChange={(value) =>
                    handleSelectChange("classId", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {classes.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        {cls.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="roomId">Room</Label>
                <Select
                  value={formData.roomId}
                  onValueChange={(value) => handleSelectChange("roomId", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a room" />
                  </SelectTrigger>
                  <SelectContent>
                    {rooms.map((room) => (
                      <SelectItem key={room.id} value={room.id}>
                        {room.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Day of Week</Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(value) =>
                    handleSelectChange("dayOfWeek", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONDAY">Monday</SelectItem>
                    <SelectItem value="TUESDAY">Tuesday</SelectItem>
                    <SelectItem value="WEDNESDAY">Wednesday</SelectItem>
                    <SelectItem value="THURSDAY">Thursday</SelectItem>
                    <SelectItem value="FRIDAY">Friday</SelectItem>
                    <SelectItem value="SATURDAY">Saturday</SelectItem>
                    <SelectItem value="SUNDAY">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    name="startTime"
                    type="time"
                    value={formData.startTime}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    name="endTime"
                    type="time"
                    value={formData.endTime}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Adding..." : "Add Schedule"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
