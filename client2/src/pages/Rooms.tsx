import { roomsApi } from "@/services/apiService";
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

interface Room {
  id: string;
  name: string;
  capacity: number;
  type: string;
  floor: string;
  building: string;
}

interface FormData {
  name: string;
  capacity: string;
  type: string;
  floor: string;
  building: string;
}

export function Rooms(): JSX.Element {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [formData, setFormData] = useState<FormData>({
    name: "",
    capacity: "",
    type: "CLASSROOM",
    floor: "",
    building: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, []);

  const fetchRooms = async (): Promise<void> => {
    try {
      const response = await roomsApi.getAll();
      setRooms(response.data);
    } catch (err) {
      setError("Failed to fetch rooms");
    }
  };

  const handleOpen = (room?: Room): void => {
    if (room) {
      // Edit mode
      console.log("Opening edit mode for room:", room);
      setEditMode(true);
      setEditingRoomId(room.id);
      setFormData({
        name: room.name,
        capacity: room.capacity.toString(),
        type: room.type || "CLASSROOM",
        floor: room.floor || "",
        building: room.building,
      });
    } else {
      // Create mode
      console.log("Opening create mode for room");
      setEditMode(false);
      setEditingRoomId(null);
      setFormData({
        name: "",
        capacity: "",
        type: "CLASSROOM",
        floor: "",
        building: "",
      });
    }
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
    setEditMode(false);
    setEditingRoomId(null);
    setFormData({
      name: "",
      capacity: "",
      type: "CLASSROOM",
      floor: "",
      building: "",
    });
    setError("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      if (editMode && editingRoomId) {
        // Update existing room
        console.log("Updating room:", editingRoomId, formData);
        await roomsApi.update(editingRoomId, {
          ...formData,
          capacity: parseInt(formData.capacity, 10),
        });
      } else {
        // Create new room
        console.log("Creating new room:", formData);
        await roomsApi.create({
          ...formData,
          capacity: parseInt(formData.capacity, 10),
        });
      }
      handleClose();
      fetchRooms();
    } catch (err: any) {
      const action = editMode ? "update" : "create";
      console.error(`Failed to ${action} room:`, err);
      setError(err.response?.data?.message || `Failed to ${action} room`);
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

  const handleTypeChange = (value: string): void => {
    setFormData({
      ...formData,
      type: value,
    });
  };

  const handleDelete = async (roomId: string): Promise<void> => {
    if (confirm("Are you sure you want to delete this room?")) {
      try {
        console.log("Deleting room:", roomId);
        await roomsApi.delete(roomId);
        fetchRooms();
      } catch (err: any) {
        console.error("Failed to delete room:", err);
        setError(err.response?.data?.message || "Failed to delete room");
      }
    }
  };

  const filteredRooms = rooms.filter(
    (room) =>
      room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.building.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Page
      title="Rooms"
      breadcrumbs={[
        { text: "Dashboard", href: "/dashboard" },
        { text: "Rooms" },
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
                placeholder="Search rooms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button onClick={() => handleOpen()}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Room
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Building</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRooms.map((room) => (
                <TableRow key={room.id}>
                  <TableCell>{room.name}</TableCell>
                  <TableCell>{room.building}</TableCell>
                  <TableCell>{room.floor}</TableCell>
                  <TableCell>{room.type}</TableCell>
                  <TableCell>{room.capacity}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleOpen(room)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500"
                      onClick={() => handleDelete(room.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredRooms.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-8 text-gray-500"
                  >
                    No rooms found.
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
            <DialogTitle>{editMode ? "Edit Room" : "Add New Room"}</DialogTitle>
            <DialogDescription>
              {editMode
                ? "Update the details for this room."
                : "Create a new room for classes and activities."}
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
                <Label htmlFor="name">Room Name/Number</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="building">Building</Label>
                <Input
                  id="building"
                  name="building"
                  value={formData.building}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="floor">Floor</Label>
                <Input
                  id="floor"
                  name="floor"
                  value={formData.floor}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="type">Room Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={handleTypeChange}
                  required
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select room type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CLASSROOM">Classroom</SelectItem>
                    <SelectItem value="LAB">Laboratory</SelectItem>
                    <SelectItem value="OFFICE">Office</SelectItem>
                    <SelectItem value="CONFERENCE">Conference Room</SelectItem>
                    <SelectItem value="OTHER">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="capacity">Capacity</Label>
                <Input
                  id="capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  value={formData.capacity}
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
                  : "Add Room"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Page>
  );
}
