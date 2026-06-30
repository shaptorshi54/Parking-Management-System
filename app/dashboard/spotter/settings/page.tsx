import SettingsForm from "@/app/components/SettingsForm";

export default function SettingsPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your app preferences and security.</p>
      </div>
      <SettingsForm />
    </div>
  );
}
