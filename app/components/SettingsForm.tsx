"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Bell, Smartphone, Moon, Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function SettingsForm() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);

  const saveSettings = () => {
    toast.success("Preferences saved successfully!");
  };

  return (
    <Card className="max-w-2xl border-border/50 shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Preferences</CardTitle>
        <CardDescription>Manage your notifications and security settings.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Notifications</h3>
          
          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Bell className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold">Email Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive booking confirmations via email.</p>
              </div>
            </div>
            <Switch checked={emailAlerts} onCheckedChange={setEmailAlerts} />
          </div>

          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20 hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="bg-primary/10 p-2 rounded-full">
                <Smartphone className="h-5 w-5 text-primary" />
              </div>
              <div>
                <Label className="text-base font-semibold">SMS Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive text messages for active tickets.</p>
              </div>
            </div>
            <Switch checked={smsAlerts} onCheckedChange={setSmsAlerts} />
          </div>
        </div>

        {/* Security */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-widest">Security</h3>
          <div className="flex items-center justify-between p-4 border rounded-xl bg-muted/20">
            <div className="flex items-center gap-4">
              <div className="bg-destructive/10 p-2 rounded-full">
                <Shield className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <Label className="text-base font-semibold">Change Password</Label>
                <p className="text-sm text-muted-foreground">Update your account password.</p>
              </div>
            </div>
            <Button variant="outline">Update</Button>
          </div>
        </div>

        <Button onClick={saveSettings} className="w-full h-12 text-md font-bold mt-4 shadow-md transition-all">
          Save Preferences
        </Button>
      </CardContent>
    </Card>
  );
}
