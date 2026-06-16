import { useState } from 'react';
import {
  IcnTrendUp as TrendingUp, IcnTrendDown as TrendingDown, IcnDollar as DollarSign, IcnArrowUpRight as ArrowUpRight, IcnArrowDownRight as ArrowDownRight,
  IcnFile as FileText, IcnCalendar as Calendar, IcnDownload as Download, IcnFilter as Filter, IcnSearch as Search,
} from '@/components/ui/Icons';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { formatCurrency, formatDate } from '../utils/data';
import { toast } from "sonner";

const mockLedger: LedgerEntry[] = Array.from({ length: 25 }, (_, i) => ({
  id: `ledger-${i}`,
  transactionId: `TXN-${String(10000 + i).padStart(6, '0')}`,
  accountCode: i % 3 === 0 ? '40100' : i % 3 === 1 ? '10100' : '20100',
  accountName: i % 3 === 0 ? 'Market Tolls Revenue' : i % 3 === 1 ? 'Cash & Bank' : 'Accounts Receivable',
  description: ['Daily market collection', 'Levy payment', 'Business operating permit', 'Property rate collection'][i % 4],
  debit: i % 2 === 0 ? Math.random() * 5000 + 500 : 0,
  credit: i % 2 !== 0 ? Math.random() * 5000 + 500 : 0,
  balance: 0,
  entryDate: new Date(Date.now() - i * 3600000 * 24).toISOString(),
  createdBy: 'Dr. Kwame Asante',
  reference: `REF-${String(2000 + i).padStart(6, '0')}`,
  referenceType: ['collection', 'invoice', 'remittance', 'adjustment'][i % 4] as any,
}));

let runningBalance = 125000;
const ledgersWithBalance = mockLedger.map(entry => {
  runningBalance += entry.debit - entry.credit;
  return { ...entry, balance: runningBalance };
});

const mockInvoices: Invoice[] = Array.from({ length: 15 }, (_, i) => {
  const statuses: Invoice['status'][] = ['paid', 'partial', 'overdue', 'sent', 'draft'];
  const totalAmount = Math.random() * 10000 + 500;
  const partialPaid = totalAmount * (Math.random() * 0.8);
  return {
    id: `inv-${i}`,
    invoiceNumber: `INV-${String(2024000 + i).padStart(7, '0')}`,
    businessId: `BIZ-${100 + i}`,
    businessName: `Business ${String.fromCharCode(65 + i)} Enterprises`,
    amount: totalAmount,
    amountPaid: statuses[i % 5] === 'paid' ? totalAmount : statuses[i % 5] === 'partial' ? partialPaid : 0,
    balanceDue: statuses[i % 5] === 'paid' ? 0 : statuses[i % 5] === 'partial' ? totalAmount - partialPaid : totalAmount,
    issueDate: new Date(Date.now() - i * 86400000 * 7).toISOString(),
    dueDate: new Date(Date.now() + (i % 3 === 0 ? -1 : 1) * 86400000 * 15).toISOString(),
    period: `Q${(i % 4) + 1} 2026`,
    status: statuses[i % 5],
    items: [
      { description: 'Market stall levy', quantity: 1, unitPrice: totalAmount * 0.6, amount: totalAmount * 0.6 },
      { description: 'Sanitation fee', quantity: 1, unitPrice: totalAmount * 0.4, amount: totalAmount * 0.4 },
    ],
    notes: '',
  };
});

const mockRemittances: Remittance[] = Array.from({ length: 10 }, (_, i) => ({
  id: `rem-${i}`,
  remittanceNumber: `REM-${String(3000 + i).padStart(6, '0')}`,
  officerId: `OFF-${100 + i}`,
  officerName: ['Kwesi Annan', 'Ama Serwaa', 'Kofi Mensah', 'Yaa Asantewaa', 'Eric Osei'][i % 5],
  amount: Math.random() * 15000 + 2000,
  cashAmount: Math.random() * 5000 + 500,
  mobileMoneyAmount: Math.random() * 8000 + 1000,
  posAmount: Math.random() * 2000 + 200,
  collectionCount: Math.floor(Math.random() * 20 + 5),
  status: ['pending', 'verified', 'rejected'][i % 3] as Remittance['status'],
  submittedAt: new Date(Date.now() - i * 3600000 * 4).toISOString(),
  verifiedAt: i % 3 !== 0 ? new Date(Date.now() - i * 3600000 * 2).toISOString() : null,
  verifiedBy: i % 3 !== 0 ? 'Dr. Kwame Asante' : null,
  notes: '',
}));

const mockCashFlow: CashFlowEntry[] = Array.from({ length: 30 }, (_, i) => {
  const inflows = Math.random() * 50000 + 15000;
  const outflows = Math.random() * 30000 + 10000;
  return {
    date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
    inflows,
    outflows,
    netCashFlow: inflows - outflows,
    balance: 0,
  };
});
let cashBalance = 500000;
mockCashFlow.forEach(entry => {
  cashBalance += entry.netCashFlow;
  entry.balance = cashBalance;
});

import type { LedgerEntry, Invoice, Remittance, CashFlowEntry } from '../types';

export function Ledger() {
  const [selectedLedger, setSelectedLedger] = useState<LedgerEntry | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedRemittance, setSelectedRemittance] = useState<Remittance | null>(null);
  const totalDebits = ledgersWithBalance.reduce((s, e) => s + e.debit, 0);
  const totalCredits = ledgersWithBalance.reduce((s, e) => s + e.credit, 0);
  const totalOutstanding = mockInvoices.filter(i => i.status === 'overdue' || i.status === 'partial').reduce((s, i) => s + i.balanceDue, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">General Ledger</h1>
          <p className="text-sm text-muted-foreground">Chart of accounts and transaction history</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success('Ledger exported as CSV')}><Download className="w-4 h-4 mr-2" />Export</Button>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Debits</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebits)}</div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalCredits)}</div>
            <p className="text-xs text-muted-foreground">Current period</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Position</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalDebits - totalCredits)}</div>
            <p className="text-xs text-muted-foreground">Running balance</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
            <FileText className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-500">{formatCurrency(totalOutstanding)}</div>
            <p className="text-xs text-muted-foreground">Unpaid invoices</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="ledger">
        <TabsList>
          <TabsTrigger value="ledger">Ledger Entries</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="remittances">Remittances</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        {/* Ledger Tab */}
        <TabsContent value="ledger" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search entries..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('Filter panel opened')}><Filter className="w-4 h-4 mr-2" />Filter</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Transaction</TableHead>
                  <TableHead>Account</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Debit</TableHead>
                  <TableHead className="text-right">Credit</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ledgersWithBalance.slice(0, 20).map((entry) => (
                  <Sheet key={entry.id}>
                    <SheetTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedLedger(entry)}>
                        <TableCell className="text-xs">{formatDate(entry.entryDate)}</TableCell>
                        <TableCell className="font-mono text-xs">{entry.transactionId}</TableCell>
                        <TableCell>
                          <div className="text-sm">{entry.accountName}</div>
                          <div className="text-xs text-muted-foreground">{entry.accountCode}</div>
                        </TableCell>
                        <TableCell className="text-sm">{entry.description}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatCurrency(entry.balance)}</TableCell>
                      </TableRow>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>Transaction Details</SheetTitle>
                        <SheetDescription>{entry.transactionId}</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Account</span>
                          <span className="font-medium text-right">{entry.accountCode} - {entry.accountName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Description</span>
                          <span className="font-medium text-right">{entry.description}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Debit</span>
                          <span className="font-medium text-right">{entry.debit > 0 ? formatCurrency(entry.debit) : '-'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Credit</span>
                          <span className="font-medium text-right">{entry.credit > 0 ? formatCurrency(entry.credit) : '-'}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Balance</span>
                          <span className="font-medium text-right">{formatCurrency(entry.balance)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Entry Date</span>
                          <span className="font-medium text-right">{formatDate(entry.entryDate)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Created By</span>
                          <span className="font-medium text-right">{entry.createdBy}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Reference</span>
                          <span className="font-medium text-right">{entry.reference} ({entry.referenceType})</span>
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search invoices..." className="pl-9" />
            </div>
            <Button variant="outline" size="sm" onClick={() => toast.info('Status filter opened')}><Filter className="w-4 h-4 mr-2" />Status</Button>
            <Button size="sm" onClick={() => toast.success('New invoice form opened')}><FileText className="w-4 h-4 mr-2" />New Invoice</Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice #</TableHead>
                  <TableHead>Business</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockInvoices.map((inv) => (
                  <Sheet key={inv.id}>
                    <SheetTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedInvoice(inv)}>
                        <TableCell className="font-mono text-xs">{inv.invoiceNumber}</TableCell>
                        <TableCell className="text-sm font-medium">{inv.businessName}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatCurrency(inv.amount)}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatCurrency(inv.amountPaid)}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatCurrency(inv.balanceDue)}</TableCell>
                        <TableCell className="text-xs">{formatDate(inv.dueDate)}</TableCell>
                        <TableCell>
                          <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'destructive' : inv.status === 'partial' ? 'warning' : inv.status === 'draft' ? 'secondary' : 'info'}>
                            {inv.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>Invoice Details</SheetTitle>
                        <SheetDescription>{inv.invoiceNumber}</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Business</span>
                          <span className="font-medium text-right">{inv.businessName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Total Amount</span>
                          <span className="font-medium text-right">{formatCurrency(inv.amount)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Amount Paid</span>
                          <span className="font-medium text-right text-emerald-500">{formatCurrency(inv.amountPaid)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Balance Due</span>
                          <span className="font-medium text-right text-amber-500">{formatCurrency(inv.balanceDue)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Issue Date</span>
                          <span className="font-medium text-right">{formatDate(inv.issueDate)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Due Date</span>
                          <span className="font-medium text-right">{formatDate(inv.dueDate)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Period</span>
                          <span className="font-medium text-right">{inv.period}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium text-right">
                            <Badge variant={inv.status === 'paid' ? 'success' : inv.status === 'overdue' ? 'destructive' : inv.status === 'partial' ? 'warning' : inv.status === 'draft' ? 'secondary' : 'info'}>
                              {inv.status}
                            </Badge>
                          </span>
                        </div>
                        {inv.items.length > 0 && (
                          <div className="py-2 border-b">
                            <span className="text-muted-foreground block mb-2">Items</span>
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b text-muted-foreground">
                                  <th className="text-left py-1">Description</th>
                                  <th className="text-right py-1">Qty</th>
                                  <th className="text-right py-1">Unit Price</th>
                                  <th className="text-right py-1">Amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {inv.items.map((item, i) => (
                                  <tr key={i} className="border-b last:border-0">
                                    <td className="py-1">{item.description}</td>
                                    <td className="text-right py-1">{item.quantity}</td>
                                    <td className="text-right py-1">{formatCurrency(item.unitPrice)}</td>
                                    <td className="text-right py-1">{formatCurrency(item.amount)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                        {inv.notes && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Notes</span>
                            <span className="font-medium text-right">{inv.notes}</span>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Remittances Tab */}
        <TabsContent value="remittances" className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Remittance #</TableHead>
                  <TableHead>Officer</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Cash</TableHead>
                  <TableHead>Mobile Money</TableHead>
                  <TableHead>POS</TableHead>
                  <TableHead>Collections</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockRemittances.map((rem) => (
                  <Sheet key={rem.id}>
                    <SheetTrigger asChild>
                      <TableRow className="cursor-pointer hover:bg-muted/50" onClick={() => setSelectedRemittance(rem)}>
                        <TableCell className="font-mono text-xs">{rem.remittanceNumber}</TableCell>
                        <TableCell className="text-sm">{rem.officerName}</TableCell>
                        <TableCell className="text-right font-mono text-sm">{formatCurrency(rem.amount)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatCurrency(rem.cashAmount)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatCurrency(rem.mobileMoneyAmount)}</TableCell>
                        <TableCell className="text-right font-mono text-xs">{formatCurrency(rem.posAmount)}</TableCell>
                        <TableCell className="text-right text-sm">{rem.collectionCount}</TableCell>
                        <TableCell>
                          <Badge variant={rem.status === 'verified' ? 'success' : rem.status === 'rejected' ? 'destructive' : 'warning'}>
                            {rem.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-xs">{formatDate(rem.submittedAt)}</TableCell>
                      </TableRow>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-full sm:max-w-lg">
                      <SheetHeader>
                        <SheetTitle>Remittance Details</SheetTitle>
                        <SheetDescription>{rem.remittanceNumber}</SheetDescription>
                      </SheetHeader>
                      <div className="space-y-4 mt-6">
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Officer</span>
                          <span className="font-medium text-right">{rem.officerName}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Total Amount</span>
                          <span className="font-medium text-right">{formatCurrency(rem.amount)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Cash</span>
                          <span className="font-medium text-right">{formatCurrency(rem.cashAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Mobile Money</span>
                          <span className="font-medium text-right">{formatCurrency(rem.mobileMoneyAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">POS</span>
                          <span className="font-medium text-right">{formatCurrency(rem.posAmount)}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Collections</span>
                          <span className="font-medium text-right">{rem.collectionCount}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Status</span>
                          <span className="font-medium text-right">
                            <Badge variant={rem.status === 'verified' ? 'success' : rem.status === 'rejected' ? 'destructive' : 'warning'}>
                              {rem.status}
                            </Badge>
                          </span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                          <span className="text-muted-foreground">Submitted</span>
                          <span className="font-medium text-right">{formatDate(rem.submittedAt)}</span>
                        </div>
                        {rem.verifiedAt && (
                          <>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Verified At</span>
                              <span className="font-medium text-right">{formatDate(rem.verifiedAt)}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b">
                              <span className="text-muted-foreground">Verified By</span>
                              <span className="font-medium text-right">{rem.verifiedBy}</span>
                            </div>
                          </>
                        )}
                        {rem.notes && (
                          <div className="flex justify-between py-2 border-b">
                            <span className="text-muted-foreground">Notes</span>
                            <span className="font-medium text-right">{rem.notes}</span>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        {/* Cash Flow Tab */}
        <TabsContent value="cashflow" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Inflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-emerald-500">{formatCurrency(mockCashFlow.reduce((s, e) => s + e.inflows, 0))}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Total Outflows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-500">{formatCurrency(mockCashFlow.reduce((s, e) => s + e.outflows, 0))}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Net Cash Flow</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(mockCashFlow.reduce((s, e) => s + e.netCashFlow, 0))}</div>
              </CardContent>
            </Card>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead className="text-right">Inflows</TableHead>
                  <TableHead className="text-right">Outflows</TableHead>
                  <TableHead className="text-right">Net</TableHead>
                  <TableHead className="text-right">Balance</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockCashFlow.slice(-15).reverse().map((entry, i) => (
                  <TableRow key={i}>
                    <TableCell className="text-xs">{entry.date}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-emerald-500">{formatCurrency(entry.inflows)}</TableCell>
                    <TableCell className="text-right font-mono text-sm text-red-500">{formatCurrency(entry.outflows)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatCurrency(entry.netCashFlow)}</TableCell>
                    <TableCell className="text-right font-mono text-sm">{formatCurrency(entry.balance)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
