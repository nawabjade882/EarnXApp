'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, Zap, Database, ArrowRight } from "lucide-react";
import Link from "next/link";

type AdminCardProps = {
  onReset: () => void;
};

export function AdminCard({ onReset }: AdminCardProps) {
  const handleReset = () => {
    if (confirm('This will reset your account data but will not delete your login. Continue?')) {
      onReset();
    }
  };
  
  return (
    <Card className="card shadow-lg">
      <CardHeader>
        <CardTitle>Admin / Checks</CardTitle>
      </CardHeader>
      <Separator className="mx-6 w-auto -mt-2 mb-4" />
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-2">
            <ShieldCheck className="h-4 w-4" />
            Anti-fraud
          </Badge>
          <p className="text-sm text-muted-foreground">Basic duplicate‑action guard enabled.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-2">
            <Zap className="h-4 w-4" />
            Rate limit
          </Badge>
          <p className="text-sm text-muted-foreground">Max 1 reward / 10s.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="gap-2">
            <Database className="h-4 w-4" />
            Data
          </Badge>
          <p className="text-sm text-muted-foreground">Stored in Firebase Firestore.</p>
        </div>
        
        <Separator />

        <Link href="/admin" passHref>
           <Button variant="outline" className="w-full justify-between">
              Go to Admin Panel
              <ArrowRight className="h-4 w-4" />
           </Button>
        </Link>
        
        <Button variant="destructive" className="w-full" onClick={handleReset}>
          Danger: Reset my account data
        </Button>
      </CardContent>
    </Card>
  );
}
