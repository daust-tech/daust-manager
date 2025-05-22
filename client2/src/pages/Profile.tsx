import { Eye, EyeOff, Mail, Phone, Save } from "lucide-react";
import { useState, type ChangeEvent, type FormEvent, type JSX } from "react";
import { Page } from "../components/layout/Page";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Separator } from "../components/ui/separator";

interface ProfileFormData {
  name: string;
  email: string;
  phone: string;
  role: string;
}

interface PasswordFormData {
  current: string;
  new: string;
  confirm: string;
}

interface PasswordVisibility {
  current: boolean;
  new: boolean;
  confirm: boolean;
}

export function Profile(): JSX.Element {
  const [profile, setProfile] = useState<ProfileFormData>({
    name: "John Doe",
    email: "john.doe@daust.edu",
    phone: "+221 77 123 4567",
    role: "ADMIN",
  });

  const [password, setPassword] = useState<PasswordFormData>({
    current: "",
    new: "",
    confirm: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState<PasswordVisibility>({
    current: false,
    new: false,
    confirm: false,
  });

  const handleProfileChange = (
    field: keyof ProfileFormData,
    value: string
  ): void => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handlePasswordChange = (
    field: keyof PasswordFormData,
    value: string
  ): void => {
    setPassword((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProfileSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // TODO: Implement profile update API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess("Profile updated successfully");
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = async (
    e: FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    if (password.new !== password.confirm) {
      setError("New passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: Implement password update API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess("Password updated successfully");
      setPassword({
        current: "",
        new: "",
        confirm: "",
      });
    } catch (err) {
      setError("Failed to update password");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = (field: keyof PasswordVisibility): void => {
    setShowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <Page
      title="Profile"
      breadcrumbs={[
        { text: "Dashboard", href: "/dashboard" },
        { text: "Profile" },
      ]}
    >
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <div className="grid md:grid-cols-4 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardContent className="pt-6 flex flex-col items-center text-center">
              <Avatar className="h-24 w-24 mb-4">
                <AvatarFallback className="text-3xl">
                  {profile.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-semibold mb-1">{profile.name}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {profile.role}
              </p>

              <div className="w-full space-y-2">
                <div className="flex items-center text-sm">
                  <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{profile.email}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                  <span>{profile.phone}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <div className="md:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <form onSubmit={handleProfileSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleProfileChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleProfileChange("email", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <div className="relative">
                      <Input
                        id="current-password"
                        type={showPassword.current ? "text" : "password"}
                        value={password.current}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handlePasswordChange("current", e.target.value)
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => togglePasswordVisibility("current")}
                      >
                        {showPassword.current ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Input
                        id="new-password"
                        type={showPassword.new ? "text" : "password"}
                        value={password.new}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handlePasswordChange("new", e.target.value)
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => togglePasswordVisibility("new")}
                      >
                        {showPassword.new ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">
                      Confirm New Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="confirm-password"
                        type={showPassword.confirm ? "text" : "password"}
                        value={password.confirm}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                          handlePasswordChange("confirm", e.target.value)
                        }
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full"
                        onClick={() => togglePasswordVisibility("confirm")}
                      >
                        {showPassword.confirm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      <Save className="mr-2 h-4 w-4" />
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Page>
  );
}
