import { useState } from "react";
import { Search, LayoutGrid, List, UserPlus, TrendingUp, Star, Users, MapPin, Phone, Calendar } from "lucide-react";
import { agentStats, formatCurrency, formatDate } from "../utils/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" | "success" | "warning" }> = {
  "in-field": { label: "In Field", variant: "success" },
  "on-break": { label: "On Break", variant: "warning" },
  offline: { label: "Offline", variant: "secondary" },
  active: { label: "In Field", variant: "success" },
  break: { label: "On Break", variant: "warning" },
};

function statusVariant(s: string) {
  return statusMap[s]?.variant ?? "secondary";
}

function statusLabel(s: string) {
  return statusMap[s]?.label ?? s;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

export function Agents() {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedAgent, setSelectedAgent] = useState<typeof agentStats[number] | null>(null);

  const filtered = agentStats.filter(
    (a) =>
      a.officerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalToday = filtered.reduce((s, a) => s + a.todayAmount, 0);
  const avgPerf =
    filtered.length > 0
      ? filtered.reduce((s, a) => s + a.performanceScore, 0) / filtered.length
      : 0;
  const activeNow = filtered.filter((a) => a.isActive).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Agent Management</h2>
          <p className="text-sm text-muted-foreground">{filtered.length} agents registered</p>
        </div>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add Agent
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Today</p>
              <p className="text-2xl font-bold">{formatCurrency(totalToday)}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <Star className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg Performance</p>
              <p className="text-2xl font-bold">{avgPerf.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active Now</p>
              <p className="text-2xl font-bold">{activeNow}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search agents by name or zone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border p-1">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="icon"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {viewMode === "grid" ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((agent) => (
            <Card
              key={agent.officerId}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedAgent(agent)}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={agent.avatarUrl} alt={agent.officerName} />
                      <AvatarFallback>{initials(agent.officerName)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{agent.officerName}</p>
                      <p className="text-sm text-muted-foreground">{agent.zone}</p>
                    </div>
                  </div>
                  <Badge variant={statusVariant(agent.status)}>
                    {statusLabel(agent.status)}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-muted-foreground">Today Collections</p>
                    <p className="font-medium">{agent.todayCollections}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Today Amount</p>
                    <p className="font-medium">{formatCurrency(agent.todayAmount)}</p>
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Performance</span>
                    <span className="font-medium">{agent.performanceScore}%</span>
                  </div>
                  <Progress value={agent.performanceScore} className="h-2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Agent</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Collections</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Performance</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((agent) => (
                <TableRow
                  key={agent.officerId}
                  className="cursor-pointer"
                  onClick={() => setSelectedAgent(agent)}
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={agent.avatarUrl} alt={agent.officerName} />
                        <AvatarFallback className="text-xs">{initials(agent.officerName)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{agent.officerName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{agent.zone}</TableCell>
                  <TableCell>
                    <Badge variant={statusVariant(agent.status)}>
                      {statusLabel(agent.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">{agent.todayCollections}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(agent.todayAmount)}
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <div className="flex items-center gap-2">
                      <Progress value={agent.performanceScore} className="h-2 flex-1" />
                      <span className="text-sm font-medium">{agent.performanceScore}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      <Sheet open={!!selectedAgent} onOpenChange={(open) => { if (!open) setSelectedAgent(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selectedAgent?.officerName}</SheetTitle>
            <SheetDescription>{selectedAgent?.zone}</SheetDescription>
          </SheetHeader>
          {selectedAgent && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-2">
                <Badge variant={statusVariant(selectedAgent.status)}>{statusLabel(selectedAgent.status)}</Badge>
              </div>
              <div className="flex items-center gap-3 text-sm">
                <Star className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground text-xs">Performance Score</span>
                    <span className="font-medium text-sm">{selectedAgent.performanceScore}%</span>
                  </div>
                  <Progress value={selectedAgent.performanceScore} className="h-2 mt-1" />
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-3">Today</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-lg font-bold">{selectedAgent.todayCollections}</p>
                    <p className="text-xs text-muted-foreground">Collections</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-lg font-bold">{formatCurrency(selectedAgent.todayAmount)}</p>
                    <p className="text-xs text-muted-foreground">Amount</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-lg font-bold">{selectedAgent.todayVisits ?? '-'}</p>
                    <p className="text-xs text-muted-foreground">Visits</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs">Weekly Collections</p>
                  <p className="font-medium">{selectedAgent.weekCollections}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(selectedAgent.weekAmount)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs">Monthly Collections</p>
                  <p className="font-medium">{selectedAgent.monthCollections}</p>
                  <p className="text-xs text-muted-foreground">{formatCurrency(selectedAgent.monthAmount)}</p>
                </div>
              </div>
              <Separator />
              {selectedAgent.targetAmount > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground text-xs">Target Progress</span>
                    <span className="font-medium text-sm">{selectedAgent.targetPercent}%</span>
                  </div>
                  <Progress value={selectedAgent.targetPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    GHS {selectedAgent.todayAmount.toLocaleString()} / GHS {selectedAgent.targetAmount.toLocaleString()}
                  </p>
                </div>
              )}
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4 shrink-0" />
                <span>Last active: {formatDate(selectedAgent.lastActiveAt)}</span>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
