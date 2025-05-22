import { coursesApi } from "@/services/apiService";
import { Pencil, PlusCircle, Search, Trash } from "lucide-react";
import {
  useEffect,
  useState,
  type ChangeEvent,
  type FormEvent,
  type JSX,
} from "react";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";

interface Course {
  id: string;
  code: string;
  name: string;
  description: string;
  credits: number;
}

interface FormData {
  code: string;
  name: string;
  description: string;
  credits: string;
}

export function Courses(): JSX.Element {
  const [courses, setCourses] = useState<Course[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<FormData>({
    code: "",
    name: "",
    description: "",
    credits: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async (): Promise<void> => {
    try {
      const response = await coursesApi.getAll();
      setCourses(response.data);
    } catch (err) {
      setError("Failed to fetch courses");
    }
  };

  const handleOpen = (course?: Course): void => {
    if (course) {
      // Edit mode
      console.log("Opening edit mode for course:", course);
      setEditMode(true);
      setEditingCourseId(course.id);
      setFormData({
        code: course.code,
        name: course.name,
        description: course.description || "",
        credits: course.credits.toString(),
      });
    } else {
      // Create mode
      console.log("Opening create mode for course");
      setEditMode(false);
      setEditingCourseId(null);
      setFormData({
        code: "",
        name: "",
        description: "",
        credits: "",
      });
    }
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setEditMode(false);
    setEditingCourseId(null);
    setFormData({
      code: "",
      name: "",
      description: "",
      credits: "",
    });
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (editMode && editingCourseId) {
        // Update existing course
        console.log("Updating course:", editingCourseId, formData);
        await coursesApi.update(editingCourseId, {
          ...formData,
          credits: parseInt(formData.credits, 10),
        });
      } else {
        // Create new course
        console.log("Creating new course:", formData);
        await coursesApi.create({
          ...formData,
          credits: parseInt(formData.credits, 10),
        });
      }
      handleClose();
      fetchCourses();
    } catch (err: any) {
      const action = editMode ? "update" : "create";
      console.error(`Failed to ${action} course:`, err);
      setError(err.response?.data?.message || `Failed to ${action} course`);
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

  const handleDelete = async (courseId: string): Promise<void> => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        console.log("Deleting course:", courseId);
        await coursesApi.delete(courseId);
        fetchCourses();
      } catch (err: any) {
        console.error("Failed to delete course:", err);
        setError(err.response?.data?.message || "Failed to delete course");
      }
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Page
      title="Courses"
      breadcrumbs={[
        { text: "Dashboard", href: "/dashboard" },
        { text: "Courses" },
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
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => handleOpen()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Course
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Credits</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell>{course.code}</TableCell>
                  <TableCell>{course.name}</TableCell>
                  <TableCell className="max-w-md truncate">
                    {course.description}
                  </TableCell>
                  <TableCell>{course.credits}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpen(course)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredCourses.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No courses found.
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
            <DialogTitle>
              {editMode ? "Edit Course" : "Add New Course"}
            </DialogTitle>
            <DialogDescription>
              {editMode
                ? "Update the details for this course."
                : "Create a new course for the school curriculum."}
            </DialogDescription>
          </DialogHeader>
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Course Code</Label>
                <Input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Course Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="credits">Credit Hours</Label>
                <Input
                  id="credits"
                  name="credits"
                  type="number"
                  min="1"
                  value={formData.credits}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <DialogFooter className="mt-6">
              <Button variant="outline" type="button" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading
                  ? editMode
                    ? "Saving..."
                    : "Adding..."
                  : editMode
                  ? "Save Changes"
                  : "Add Course"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
