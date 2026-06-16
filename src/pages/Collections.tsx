import { useState } from "react";
import { Search, Download, DollarSign, Calendar, Receipt, User, Smartphone, MapPin, FileText } from "lucide-react";
import { recentCollections, formatCurrency, formatDate } from "../utils/data";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

export function Collections() {
  const [searchTerm, setSearchTerm] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [selectedCollection, setSelectedCollection] = useState<typeof recentCollections[number] | null>(null);

  const filteredCollections = recentCollections.filter(c => {
    const matchesSearch = c.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.receiptNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPayment = paymentFilter === "all" || c.paymentMethod === paymentFilter;

    let matchesDate = true;
    const today = new Date();
    const collectionDate = new Date(c.collectionDate);
    if (dateFilter === "today") {
      matchesDate = collectionDate.toDateString() === today.toDateString();
    } else if (dateFilter === "week") {
      const weekAgo = new Date(today);
      weekAgo.setDate(weekAgo.getDate() - 7);
      matchesDate = collectionDate >= weekAgo;
    } else if (dateFilter === "month") {
      const monthAgo = new Date(today);
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      matchesDate = collectionDate >= monthAgo;
    }

    return matchesSearch && matchesPayment && matchesDate;
  });

  const totalAmount = filteredCollections.reduce((sum, c) => sum + c.amount, 0);

  const paymentMethodLabels: Record<string, string> = {
    cash: "Cash",
    mobile_money: "Mobile Money",
    pos: "POS",
    other: "Other",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Collections Log</h2>
          <p className="text-sm text-muted-foreground">
            {filteredCollections.length} records &bull; Total: {formatCurrency(totalAmount)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Calendar className="w-4 h-4 mr-2" />
            Date Range
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Separator />

      {/* Search & Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by business or receipt number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={paymentFilter} onValueChange={setPaymentFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Payment Method" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Methods</SelectItem>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="mobile_money">Mobile Money</SelectItem>
            <SelectItem value="pos">POS</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="h-8 hidden md:block" />

        <div className="flex items-center gap-1">
          {[
            { value: "all", label: "All" },
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
          ].map(({ value, label }) => (
            <Button
              key={value}
              variant={dateFilter === value ? "default" : "outline"}
              size="sm"
              onClick={() => setDateFilter(value)}
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <DollarSign className="w-4 h-4" />
            Total Collected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-foreground">{formatCurrency(totalAmount)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            From {filteredCollections.length} collection{filteredCollections.length !== 1 ? "s" : ""}
          </p>
        </CardContent>
      </Card>

      {/* Collections Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Receipt #</TableHead>
                <TableHead>Business</TableHead>
                <TableHead>Officer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>GPS Verified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCollections.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                    No collections found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCollections.map((collection) => (
                  <TableRow
                    key={collection.id}
                    className="cursor-pointer"
                    onClick={() => setSelectedCollection(collection)}
                  >
                    <TableCell>
                      <span className="font-mono text-sm">{collection.receiptNumber}</span>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">{collection.businessName}</span>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{collection.officerName}</TableCell>
                    <TableCell>
                      <span className="font-semibold">{formatCurrency(collection.amount)}</span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {paymentMethodLabels[collection.paymentMethod] || collection.paymentMethod}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(collection.collectionDate)}
                    </TableCell>
                    <TableCell>
                      {collection.gpsVerified ? (
                        <Badge variant="success">Verified</Badge>
                      ) : (
                        <Badge variant="outline">Not Verified</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Sheet open={!!selectedCollection} onOpenChange={(open) => { if (!open) setSelectedCollection(null); }}>
        <SheetContent side="right" className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Collection Receipt</SheetTitle>
            <SheetDescription>{selectedCollection?.receiptNumber}</SheetDescription>
          </SheetHeader>
          {selectedCollection && (
            <div className="mt-6 space-y-5">
              <div className="flex items-center gap-3 text-sm">
                <Receipt className="h-4 w-4 text-muted-foreground shrink-0" />
                <div>
                  <p className="text-muted-foreground text-xs">Receipt Number</p>
                  <p className="font-mono font-medium">{selectedCollection.receiptNumber}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Business</p>
                    <p className="font-medium">{selectedCollection.businessName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <User className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Officer</p>
                    <p className="font-medium">{selectedCollection.officerName}</p>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-muted-foreground text-xs">Amount</p>
                  <p className="text-2xl font-bold">{formatCurrency(selectedCollection.amount)}</p>
                </div>
                <Badge variant="outline" className="text-sm">
                  {paymentMethodLabels[selectedCollection.paymentMethod] || selectedCollection.paymentMethod}
                </Badge>
              </div>
              <Separator />
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">Date</p>
                    <p className="font-medium">{formatDate(selectedCollection.collectionDate)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-muted-foreground text-xs">GPS Verification</p>
                    {selectedCollection.gpsVerified ? (
                      <Badge variant="success">Verified</Badge>
                    ) : (
                      <Badge variant="outline">Not Verified</Badge>
                    )}
                  </div>
                </div>
                {selectedCollection.paymentMethod === "mobile_money" && selectedCollection.mobileMoneyRef && (
                  <div className="flex items-center gap-3 text-sm">
                    <Smartphone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <div>
                      <p className="text-muted-foreground text-xs">Mobile Money Ref</p>
                      <p className="font-mono font-medium">{selectedCollection.mobileMoneyRef}</p>
                    </div>
                  </div>
                )}
                {selectedCollection.notes && (
                  <div className="flex items-start gap-3 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-muted-foreground text-xs">Notes</p>
                      <p>{selectedCollection.notes}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
