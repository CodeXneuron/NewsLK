"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { ALL_CATEGORIES } from "@/types";
import { Bell, BellOff } from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [allNotifications, setAllNotifications] = useState(true);
  
  return (
    <div className="container mx-auto max-w-2xl">
      <h2 className="mb-6 font-headline text-3xl font-bold md:text-4xl">
        Settings
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>
            Manage your push notification preferences.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label htmlFor="all-notifications" className="text-base">
                All Notifications
              </Label>
              <p className="text-sm text-muted-foreground">
                Enable or disable all push notifications.
              </p>
            </div>
            <Switch
              id="all-notifications"
              checked={allNotifications}
              onCheckedChange={setAllNotifications}
              aria-label="Toggle all notifications"
            />
          </div>
          <Separator />
          <div className="space-y-4">
            <h3 className="text-lg font-medium">By Category</h3>
            <p className="text-sm text-muted-foreground">
                Receive notifications only for specific categories. This is disabled if all notifications are on.
            </p>
            {ALL_CATEGORIES.map((category) => (
              <div key={category} className="flex items-center justify-between">
                <Label htmlFor={`category-${category}`} className="flex items-center gap-2">
                  {category}
                </Label>
                <Switch
                  id={`category-${category}`}
                  disabled={allNotifications}
                  aria-label={`Toggle notifications for ${category}`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
