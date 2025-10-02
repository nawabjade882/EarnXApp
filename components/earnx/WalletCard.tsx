'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { User } from "@/lib/types";
import { RefreshCw } from 'lucide-react';

type WalletCardProps = {
  user: User;
  btcPrice: number | null;
  lastUpdated: string | null;
  onRefresh: () => void;
};

export function WalletCard({ user, btcPrice, lastUpdated, onRefresh }: WalletCardProps) {
  const btcEq = btcPrice ? (user.inr / btcPrice) : 0;
  
  return (
    <Card className="card shadow-lg h-full">
      <CardHeader>
        <CardTitle>Wallet</CardTitle>
        <CardDescription>INR &rarr; BTC (view)</CardDescription>
      </CardHeader>
      <Separator className="mx-6 w-auto" />
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-sm text-muted-foreground">INR Balance</p>
            <p className="text-4xl font-extrabold tracking-tight">₹{user.inr.toFixed(2)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">BTC Price (INR)</p>
            <p className="font-code font-semibold">
              {btcPrice ? `₹${btcPrice.toLocaleString()}` : 'Loading...'}
            </p>
            <p className="text-xs text-muted-foreground">
              Updated {lastUpdated || '...'}
            </p>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between items-center">
          <div>
            <p className="text-sm text-muted-foreground">BTC Equivalent</p>
            <p className="font-code text-xl font-semibold">{btcEq.toFixed(8)} BTC</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onRefresh}>
            <RefreshCw className="h-4 w-4" />
            <span className="sr-only">Refresh price</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
