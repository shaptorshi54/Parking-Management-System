"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Phone, Mail, ShieldCheck } from "lucide-react";
import { updateProfileAction } from "@/app/actions/user-actions";
import { toast } from "sonner";
import { useState } from "react";

export default function ProfileForm({ user }: { user: any }) {
  const [loading, setLoading] = useState(false);

  return (
    <Card className="max-w-2xl border-border/50 shadow-lg bg-card">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Personal Information</CardTitle>
        <CardDescription>Update your contact details and profile.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={async (formData) => {
          setLoading(true);
          const res = await updateProfileAction(formData);
          setLoading(false);
          if (res?.error) toast.error(res.error);
          else toast.success("Profile updated successfully!");
        }} className="space-y-6">
          
          <input type="hidden" name="userId" value={user.id} />

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2"><User className="h-4 w-4"/> Full Name</Label>
            <Input name="name" defaultValue={user.name} required className="h-12 bg-muted/50" />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2"><Phone className="h-4 w-4"/> Phone Number</Label>
            <Input name="phone" defaultValue={user.phone} required className="h-12 bg-muted/50" />
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2"><Mail className="h-4 w-4"/> Email Address</Label>
            <Input defaultValue={user.email} disabled className="h-12 bg-muted/20 opacity-50 cursor-not-allowed" />
            <p className="text-xs text-muted-foreground mt-1">Email cannot be changed.</p>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground flex items-center gap-2"><ShieldCheck className="h-4 w-4"/> Account Role</Label>
            <div className="h-12 bg-muted/20 rounded-md border flex items-center px-3 opacity-50 cursor-not-allowed">
              <span className="font-bold tracking-wider">{user.role}</span>
            </div>
          </div>

          <Button type="submit" disabled={loading} className="w-full h-12 text-md font-bold mt-4 shadow-md transition-all">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
