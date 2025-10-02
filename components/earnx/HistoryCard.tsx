'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import type { Transaction } from "@/lib/types";
import { format } from 'date-fns';

type HistoryCardProps = {
  history: Transaction[];
};

function TransactionItem({ transaction }: { transaction: Transaction }) {
  const getAmountColor = (amt?: number) => {
    if (amt === undefined) return '';
    return amt >= 0 ? 'text-green-400' : 'text-red-400';
  };

  const formatAmount = (amt?: number) => {
    if (amt === undefined) return '';
    return amt >= 0 ? `+₹${amt.toFixed(2)}` : `−₹${Math.abs(amt).toFixed(2)}`;
  };

  const getStatusBadge = (status?: 'pending' | 'completed' | 'failed') => {
    if (!status) return null;
    let variant: "default" | "secondary" | "destructive" | "outline" = "outline";
    let statusText = status;
    switch (status) {
      case 'pending':
        variant = 'secondary';
        break;
      case 'completed':
        variant = 'default';
        statusText = 'Success';
        break;
      case 'failed':
        variant = 'destructive';
        statusText = 'Cancelled'
        break;
    }
    return <Badge variant={variant} className="capitalize text-xs">{statusText}</Badge>;
  };

  return (
    <div className="flex justify-between items-start p-3 rounded-lg border border-border/50 bg-background/30">
      <div className="space-y-1.5 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="capitalize">{transaction.type}</Badge>
          <p className="text-xs text-muted-foreground">{format(new Date(transaction.t as string), 'MMM d, yyyy, h:mm a')}</p>
          {transaction.type === 'withdraw' && getStatusBadge(transaction.status)}
        </div>
        <p className="text-sm break-words">{transaction.note || ''}</p>
      </div>
      <div className={`font-code font-semibold text-right ml-2 ${getAmountColor(transaction.amt)}`}>
        {formatAmount(transaction.amt)}
      </div>
    </div>
  );
}

function HistoryList({ transactions }: { transactions: Transaction[] }) {
  if (transactions.length === 0) {
    return <p className="text-muted-foreground text-sm text-center py-4">No activity yet.</p>;
  }
  return (
    <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mt-4">
      {transactions.map((h) => (
        <TransactionItem key={h.id} transaction={h} />
      ))}
    </div>
  );
}

export function HistoryCard({ history }: HistoryCardProps) {
  const withdrawalHistory = history.filter(t => t.type === 'withdraw');

  return (
    <Card className="card shadow-lg">
      <CardHeader>
        <CardTitle>History</CardTitle>
      </CardHeader>
      <Separator className="mx-6 w-auto -mt-2 mb-4" />
      <CardContent>
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Transactions</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
          </TabsList>
          <TabsContent value="all">
            <HistoryList transactions={history.slice(0, 50)} />
          </TabsContent>
          <TabsContent value="withdrawals">
            <HistoryList transactions={withdrawalHistory.slice(0, 50)} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
