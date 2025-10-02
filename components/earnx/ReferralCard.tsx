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
import { Badge } from "@/components/ui/badge";
import type { User } from "@/lib/types";
import { refCodeFromUid } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { CONFIG } from "@/lib/config";
import { Share2, Gift } from "lucide-react";
import { Progress } from "@/components/ui/progress";


type ReferralCardProps = {
  user: User;
};

function ReferralProgress({ user }: { user: User }) {
  if (!user.usedReferral || user.referralBonusClaimed) {
    return null;
  }

  const adsDone = user.referralTasks?.ads || 0;
  const tasksDone = user.referralTasks?.tasks || 0;
  const adsNeeded = CONFIG.referralAdsNeeded;
  const tasksNeeded = CONFIG.referralTasksNeeded;
  
  const totalProgress = ((adsDone / adsNeeded) + (tasksDone / tasksNeeded)) / 2 * 100;

  return (
    <div className="mt-4 p-4 border rounded-lg bg-background/50">
      <div className="flex items-center gap-2 mb-2">
        <Gift className="h-5 w-5 text-primary" />
        <p className="font-semibold">Unlock Your Referral Bonus!</p>
      </div>
      <p className="text-sm text-muted-foreground mb-3">
        Complete the tasks below to receive your ₹{CONFIG.referralBonusINR.toFixed(2)} bonus for using code <span className="font-code">{user.usedReferral}</span>.
      </p>
      <div className="space-y-2 text-sm">
        <p>Watch Ads: {adsDone} / {adsNeeded}</p>
        <p>Complete Tasks: {tasksDone} / {tasksNeeded}</p>
      </div>
       <Progress value={totalProgress} className="mt-3 h-2" />
    </div>
  );
}


export function ReferralCard({ user }: ReferralCardProps) {
  const { toast } = useToast();
  
  const handleShare = () => {
    const refCode = refCodeFromUid(user.id);
    const msg = encodeURIComponent(`Hey! Try this app EarnX. Download: https://yourapp.link Use my referral code: ${refCode}`);
    window.open(`https://wa.me/?text=${msg}`, '_blank');
    toast({
      title: "WhatsApp opened",
      description: "Share the link with your friends!",
    });
  };

  return (
    <Card className="card shadow-lg">
      <CardHeader>
        <CardTitle>Refer & Earn</CardTitle>
        <CardDescription>Share your code to earn rewards. New users can complete tasks to unlock a bonus!</CardDescription>
      </CardHeader>
      <Separator className="mx-6 w-auto" />
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-grow">
            <p className="text-sm text-muted-foreground">Your referral code:</p>
            <Badge variant="secondary" className="text-lg font-code py-1 px-4">{refCodeFromUid(user.id)}</Badge>
          </div>
          <Button onClick={handleShare} className="w-full sm:w-auto">
            <Share2 className="mr-2 h-4 w-4" />
            Share on WhatsApp
          </Button>
        </div>
        <ReferralProgress user={user} />
      </CardContent>
    </Card>
  );
}
