import { useState } from "react";
import { IcnSettings as SettingsIcon, IcnShield as Shield, IcnBell as Bell, IcnGlobe as Globe, IcnCircle as Palette, IcnDatabase as Database, IcnSave as Save } from "@/components/ui/Icons";
import { useAuth } from "../utils/AuthContext";
import { hasPermission } from "../utils/permissions";
import { formatCurrency } from "../utils/data";
import { useBusinesses } from "@/hooks/useApiData";
import { useTheme } from "../components/ThemeProvider";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { toast } from "sonner";

export function Settings() {
  const { user } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState("general");
  const { data: businessesData } = useBusinesses({ limit: 100 });
  const businesses = businessesData ?? [];

  if (!hasPermission(user?.role || "admin", "settings", "view")) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
          <p className="text-muted-foreground">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">System Settings</h1>
          <p className="text-muted-foreground mt-1">Configure your district assembly preferences</p>
        </div>
        <Button onClick={() => toast.success('Settings saved successfully')}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">
            <SettingsIcon className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="notifications">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="district">
            <Globe className="w-4 h-4 mr-2" />
            District Setup
          </TabsTrigger>
          <TabsTrigger value="appearance">
            <Palette className="w-4 h-4 mr-2" />
            Appearance
          </TabsTrigger>
          <TabsTrigger value="data">
            <Database className="w-4 h-4 mr-2" />
            Data & Sync
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="district-name">District Name</Label>
                  <Input id="district-name" defaultValue="Kumasi Metropolitan Assembly" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="district-code">District Code</Label>
                  <Input id="district-code" defaultValue="KMA-001" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input id="address" defaultValue="P.O. Box 1234, Kumasi, Ghana" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Contact Phone</Label>
                  <Input id="phone" defaultValue="+233 32 123 4567" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Contact Email</Label>
                  <Input id="email" defaultValue="info@kma.gov.gh" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthly-target">Monthly Target (GHS)</Label>
                  <Input id="monthly-target" type="number" defaultValue="800000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Input id="currency" defaultValue="GHS" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Agent Commission Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Enable Agent Commissions</p>
                  <p className="text-xs text-muted-foreground">Automatically calculate commissions from collections</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commission-rate">Commission Rate (%)</Label>
                  <Input id="commission-rate" type="number" step="0.1" min="0" max="50" defaultValue="7" />
                  <p className="text-xs text-muted-foreground">Percentage of each collection paid as commission</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission-cap">Monthly Cap (GHS)</Label>
                  <Input id="commission-cap" type="number" defaultValue="5000" />
                  <p className="text-xs text-muted-foreground">Maximum commission per agent per month</p>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="commission-min">Minimum Collection Threshold (GHS)</Label>
                <Input id="commission-min" type="number" defaultValue="100" />
                <p className="text-xs text-muted-foreground">Minimum collection amount to earn commission</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg space-y-2">
                <p className="text-sm font-medium text-foreground">Commission Calculation Example</p>
                <div className="text-xs text-muted-foreground space-y-1">
                  <p>Agent collects GHS 5,000 in a month at 7% rate</p>
                  <p>Commission = GHS 5,000 x 7% = <span className="font-bold text-emerald-500">{formatCurrency(350)}</span></p>
                  <p>Capped at GHS 5,000/month — under cap</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="commission-freq">Payout Frequency</Label>
                  <Select defaultValue="monthly">
                    <SelectTrigger id="commission-freq">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="biweekly">Bi-Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="commission-tier">Tiered Commission</Label>
                  <Select defaultValue="flat">
                    <SelectTrigger id="commission-tier">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="flat">Flat Rate</SelectItem>
                      <SelectItem value="tiered">Tiered (Higher rate for higher volume)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { label: "Fraud Alerts", description: "Get notified when potential fraud is detected", defaultChecked: true },
                { label: "Agent Inactivity", description: "Alert when agents are inactive during work hours", defaultChecked: true },
                { label: "Sync Failures", description: "Notify when offline sync fails", defaultChecked: true },
                { label: "High Value Collections", description: "Alert for collections above threshold", defaultChecked: false },
                { label: "Daily Reports", description: "Receive daily summary reports", defaultChecked: true },
                { label: "Weekly Analytics", description: "Weekly performance analytics email", defaultChecked: false },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <Switch defaultChecked={item.defaultChecked} />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="district" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>District & Zone Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { name: "Zone A - Central", info: "890 businesses \u2022 Supervisor: Emmanuel Owusu" },
                { name: "Zone B - Adum", info: "720 businesses \u2022 Supervisor: Akua Mensah" },
                { name: "Zone C - Bantama", info: "650 businesses \u2022 Supervisor: Kofi Asante" },
                { name: "Zone D - Suame", info: "580 businesses \u2022 Supervisor: Ama Boateng" },
                { name: "Zone E - Tafo", info: "580 businesses \u2022 Supervisor: Yaw Darko" },
              ].map((zone, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-foreground">{zone.name}</p>
                    <p className="text-xs text-muted-foreground">{zone.info}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => toast.info(`Editing zone: ${zone.name}`)}>Edit</Button>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed" onClick={() => toast.success('New zone creation form opened')}>
                + Add New Zone
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>Theme</Label>
                <Select value={theme} onValueChange={(v: 'dark' | 'light' | 'system') => setTheme(v)}>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Accent Color</Label>
                <div className="flex gap-2">
                  {[
                    { cls: "bg-indigo-500", name: "Indigo" },
                    { cls: "bg-emerald-500", name: "Emerald" },
                    { cls: "bg-orange-500", name: "Orange" },
                    { cls: "bg-rose-500", name: "Rose" },
                    { cls: "bg-violet-500", name: "Violet" },
                  ].map(({ cls, name }, i) => (
                    <button
                      key={i}
                      className={`w-8 h-8 rounded-full ${cls} ${
                        i === 0 ? "ring-2 ring-ring ring-offset-2 ring-offset-background" : ""
                      }`}
                      onClick={() => toast.success(`Accent color changed to ${name}`)}
                    />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Data & Sync Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    <p className="text-sm font-medium text-foreground">Offline Sync Status</p>
                  </div>
                  <Badge variant="warning">12 pending</Badge>
                </div>
                <Button size="sm" onClick={() => { toast.loading('Syncing...', { duration: 2000 }); setTimeout(() => toast.success('Sync completed successfully'), 2000); }}>Sync Now</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Auto-Sync Interval</p>
                  <p className="text-xs text-muted-foreground">Records sync every 5 minutes</p>
                </div>
                <Select defaultValue="5">
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 minute</SelectItem>
                    <SelectItem value="5">5 minutes</SelectItem>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-foreground">Export Data</p>
                  <p className="text-xs text-muted-foreground">Download all district data</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => {
                    const rows = [["ID", "Name", "Owner", "Phone", "Zone", "Status", "Levy Status", "Outstanding"],
                      ...businesses.map(b => [b.businessId, b.name, b.ownerName, b.ownerPhone, b.zoneName, b.status, b.levyStatus, String(b.totalOutstanding)])
                    ];
                    const csv = rows.map(r => r.join(",")).join("\n");
                    const blob = new Blob([csv], { type: "text/csv" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url;
                    a.download = `businesses-${new Date().toISOString().slice(0,10)}.csv`;
                    a.click(); URL.revokeObjectURL(url);
                    toast.success(`Exported ${businesses.length} businesses as CSV`);
                  }}>Export CSV</Button>
                  <Button variant="outline" size="sm" onClick={() => {
                    const json = JSON.stringify(businesses, null, 2);
                    const blob = new Blob([json], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a"); a.href = url;
                    a.download = `businesses-${new Date().toISOString().slice(0,10)}.json`;
                    a.click(); URL.revokeObjectURL(url);
                    toast.success(`Exported ${businesses.length} businesses as JSON`);
                  }}>Export JSON</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
