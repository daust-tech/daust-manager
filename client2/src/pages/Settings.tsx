import { Save } from "lucide-react";
import { FormEvent, useState } from "react";
import { Page } from "../components/layout/Page";
import { Alert, AlertDescription } from "../components/ui/alert";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { Switch } from "../components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";

interface SchoolSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  sms: boolean;
}

interface SecuritySettings {
  twoFactor: boolean;
  sessionTimeout: string;
  passwordExpiry: string;
}

interface AppearanceSettings {
  theme: string;
  fontSize: string;
  density: string;
}

interface Settings {
  school: SchoolSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  appearance: AppearanceSettings;
}

export function Settings(): JSX.Element {
  const [settings, setSettings] = useState<Settings>({
    school: {
      name: "DAUST",
      address: "Dakar, Senegal",
      phone: "+221 33 123 4567",
      email: "contact@daust.edu",
    },
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
    security: {
      twoFactor: false,
      sessionTimeout: "30",
      passwordExpiry: "90",
    },
    appearance: {
      theme: "dark",
      fontSize: "medium",
      density: "comfortable",
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleSchoolChange = (
    field: keyof SchoolSettings,
    value: string
  ): void => {
    setSettings((prev) => ({
      ...prev,
      school: {
        ...prev.school,
        [field]: value,
      },
    }));
  };

  const handleNotificationChange = (
    field: keyof NotificationSettings,
    value: boolean
  ): void => {
    setSettings((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [field]: value,
      },
    }));
  };

  const handleSecurityChange = (
    field: keyof SecuritySettings,
    value: string | boolean
  ): void => {
    setSettings((prev) => ({
      ...prev,
      security: {
        ...prev.security,
        [field]: value,
      },
    }));
  };

  const handleAppearanceChange = (
    field: keyof AppearanceSettings,
    value: string
  ): void => {
    setSettings((prev) => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);

    try {
      // TODO: Implement settings update API call
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess("Settings updated successfully");
    } catch (err) {
      setError("Failed to update settings");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Page
      title="Settings"
      breadcrumbs={[
        { text: "Dashboard", href: "/dashboard" },
        { text: "Settings" },
      ]}
    >
      <form onSubmit={handleSubmit}>
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 text-green-700">
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="school" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-2xl">
            <TabsTrigger value="school">School</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="school">
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="schoolName">School Name</Label>
                  <Input
                    id="schoolName"
                    value={settings.school.name}
                    onChange={(e) => handleSchoolChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={settings.school.address}
                    onChange={(e) =>
                      handleSchoolChange("address", e.target.value)
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={settings.school.phone}
                      onChange={(e) =>
                        handleSchoolChange("phone", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.school.email}
                      onChange={(e) =>
                        handleSchoolChange("email", e.target.value)
                      }
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="emailNotifications">
                    Email Notifications
                  </Label>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.email}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("email", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="pushNotifications">Push Notifications</Label>
                  <Switch
                    id="pushNotifications"
                    checked={settings.notifications.push}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("push", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="smsNotifications">SMS Notifications</Label>
                  <Switch
                    id="smsNotifications"
                    checked={settings.notifications.sms}
                    onCheckedChange={(checked) =>
                      handleNotificationChange("sms", checked)
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                  <Switch
                    id="twoFactor"
                    checked={settings.security.twoFactor}
                    onCheckedChange={(checked) =>
                      handleSecurityChange("twoFactor", checked)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Select
                    value={settings.security.sessionTimeout}
                    onValueChange={(value) =>
                      handleSecurityChange("sessionTimeout", value)
                    }
                  >
                    <SelectTrigger id="sessionTimeout">
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry">Password Expiry (days)</Label>
                  <Select
                    value={settings.security.passwordExpiry}
                    onValueChange={(value) =>
                      handleSecurityChange("passwordExpiry", value)
                    }
                  >
                    <SelectTrigger id="passwordExpiry">
                      <SelectValue placeholder="Select expiry" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 days</SelectItem>
                      <SelectItem value="60">60 days</SelectItem>
                      <SelectItem value="90">90 days</SelectItem>
                      <SelectItem value="180">180 days</SelectItem>
                      <SelectItem value="365">365 days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select
                    value={settings.appearance.theme}
                    onValueChange={(value) =>
                      handleAppearanceChange("theme", value)
                    }
                  >
                    <SelectTrigger id="theme">
                      <SelectValue placeholder="Select theme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fontSize">Font Size</Label>
                  <Select
                    value={settings.appearance.fontSize}
                    onValueChange={(value) =>
                      handleAppearanceChange("fontSize", value)
                    }
                  >
                    <SelectTrigger id="fontSize">
                      <SelectValue placeholder="Select font size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="density">Density</Label>
                  <Select
                    value={settings.appearance.density}
                    onValueChange={(value) =>
                      handleAppearanceChange("density", value)
                    }
                  >
                    <SelectTrigger id="density">
                      <SelectValue placeholder="Select density" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="compact">Compact</SelectItem>
                      <SelectItem value="comfortable">Comfortable</SelectItem>
                      <SelectItem value="spacious">Spacious</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button type="submit" disabled={isLoading}>
            <Save className="mr-2 h-4 w-4" />
            Save Settings
          </Button>
        </div>
      </form>
    </Page>
  );
}
