'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import type { User } from '@/lib/types';
import { CONFIG } from '@/lib/config';
import { CheckSquare, Film, X, ListTodo, Loader } from 'lucide-react';
import { getPersonalizedTaskSuggestions } from '@/ai/flows/personalized-task-suggestions';

function AdDisplay({ adKey }: { adKey: number }) {
    useEffect(() => {
        // This is the standard AdSense push code.
        // It might throw a "TagError" in development environments like the Studio, which is expected.
        // On a live website, this should work correctly.
        try {
            // @ts-ignore
            (window.adsbygoogle = window.adsbygoogle || []).push({});
        } catch (e) {
            console.error("AdSense error (expected in dev environment):", e);
        }
    }, [adKey]);

    return (
        <>
            {/* <!-- EarnX --> */}
            <ins className="adsbygoogle"
                 style={{ display: 'block' }}
                 data-ad-client="ca-pub-9158865747657748"
                 data-ad-slot="6954754415"
                 data-ad-format="auto"
                 data-full-width-responsive="true"></ins>
        </>
    );
}

type QuickActionsCardProps = {
  user: User;
  btcPrice: number | null;
  addReward: (note: string) => void;
  applyReferral: (code: string) => void;
  withdraw: (amount: number, method: string, id: string) => void;
};


export function QuickActionsCard({ user, btcPrice, addReward, applyReferral, withdraw }: QuickActionsCardProps) {
  const [refInput, setRefInput] = useState('');
  const [wdAmount, setWdAmount] = useState('');
  const [wdMethod, setWdMethod] = useState('paytm');
  const [wdId, setWdId] = useState('');
  const [taskSuggestions, setTaskSuggestions] = useState<string[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);
  const [isAdPlayerOpen, setIsAdPlayerOpen] = useState(false);
  const [adKey, setAdKey] = useState(Date.now());
  const [isTaskListOpen, setIsTaskListOpen] = useState(false);

  const isFetchingAITasks = useRef(false);

  const fallbackTasks = [
    'Watch a video about Bitcoin and earn ₹0.10',
    'Refer a friend to EarnX and earn ₹0.50',
  ];

  const fetchTasks = async () => {
    setLoadingTasks(true);
    setTaskSuggestions(fallbackTasks);

    isFetchingAITasks.current = true;
    try {
      const suggestions = await getPersonalizedTaskSuggestions({
        userId: user.id,
        userHistory: user.history,
        btcPrice: btcPrice || 0,
        referralCode: user.usedReferral || undefined,
      });

      if (isFetchingAITasks.current && suggestions.suggestions && suggestions.suggestions.length > 0) {
        setTaskSuggestions(suggestions.suggestions);
      }
    } catch (error) {
      console.error("Error fetching personalized tasks, using fallback:", error);
    } finally {
      setLoadingTasks(false);
      isFetchingAITasks.current = false;
    }
  };
  
  useEffect(() => {
    if (isTaskListOpen) {
      fetchTasks();
    }
    return () => {
        isFetchingAITasks.current = false;
    }
  }, [isTaskListOpen, user.id, user.history, user.usedReferral, btcPrice]);
  
  const handleWithdraw = () => {
    const amount = parseFloat(wdAmount);
    withdraw(amount, wdMethod, wdId);
    setWdAmount('');
    setWdId('');
  };

  const handleAdWatched = () => {
    addReward('Watched Ad for 0.15 INR');
    setIsAdPlayerOpen(false);
  };

  const openAdDialog = () => {
    setAdKey(Date.now());
    setIsAdPlayerOpen(true);
  }

  return (
    <>
      <Card className="card shadow-lg h-full">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <Separator className="mx-6 w-auto -mt-2 mb-4" />
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Button onClick={() => setIsTaskListOpen(true)} className="justify-start text-left h-auto">
                <ListTodo className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-1">Complete Task</span>
            </Button>
            <Button onClick={openAdDialog} className="justify-start text-left h-auto">
                <Film className="mr-2 h-4 w-4 flex-shrink-0" />
                <span className="flex-1">Watch Ad for 0.15 INR.</span>
            </Button>
          </div>
          
          <Separator />
          
          <div className="space-y-3">
              <div className="flex gap-2">
                <Input 
                  id="refInput" 
                  placeholder="Enter referral code" 
                  value={refInput}
                  onChange={(e) => setRefInput(e.target.value)}
                />
                <Button onClick={() => { applyReferral(refInput); setRefInput(''); }}>Apply</Button>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                  <Input 
                      id="wdAmount" 
                      type="number" 
                      step="0.01" 
                      placeholder="Withdraw amount" 
                      className="flex-grow"
                      value={wdAmount}
                      onChange={(e) => setWdAmount(e.target.value)}
                  />
                  <Select value={wdMethod} onValueChange={setWdMethod}>
                      <SelectTrigger className="w-full sm:w-[120px]">
                          <SelectValue placeholder="Method" />
                      </SelectTrigger>
                      <SelectContent>
                          <SelectItem value="paytm">Paytm</SelectItem>
                          <SelectItem value="phonepe">PhonePe</SelectItem>
                          <SelectItem value="upi">UPI</SelectItem>
                      </SelectContent>
                  </Select>
              </div>
              <Input 
                  id="wdID" 
                  placeholder="Enter your Paytm/UPI ID" 
                  value={wdId}
                  onChange={(e) => setWdId(e.target.value)}
              />
              <Button variant="secondary" className="w-full" onClick={handleWithdraw}>
                  Withdraw (10% fee)
              </Button>
              <p className="text-xs text-muted-foreground text-center">Min withdraw: ₹{CONFIG.minWithdraw.toFixed(2)}</p>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isTaskListOpen} onOpenChange={setIsTaskListOpen}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Available Tasks</DialogTitle>
                <DialogDescription>
                    Complete these tasks to earn rewards. New tasks may appear.
                </DialogDescription>
            </DialogHeader>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-2 py-4">
                {taskSuggestions.length > 0 ? (
                  taskSuggestions.map((task, index) => (
                      <Button key={index} onClick={() => { addReward(task); setIsTaskListOpen(false); }} className="w-full justify-start text-left h-auto">
                      <CheckSquare className="mr-2 h-4 w-4 flex-shrink-0" />
                      <span className="flex-1">{task}</span>
                      </Button>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm text-center">No tasks available right now. Please check back later.</p>
                )}
                 {loadingTasks && (
                  <div className="flex justify-center items-center h-10 mt-2">
                    <Loader className="h-5 w-5 animate-spin text-primary" />
                    <span className="ml-2 text-sm text-muted-foreground">Checking for more tasks...</span>
                  </div>
                )}
            </div>
        </DialogContent>
      </Dialog>

       <Dialog open={isAdPlayerOpen} onOpenChange={setIsAdPlayerOpen}>
          <DialogContent className="sm:max-w-[90vw] h-[90vh] flex flex-col p-0">
             <DialogHeader className="p-4 border-b">
              <DialogTitle>Advertisement</DialogTitle>
              <DialogDescription>
                You will receive your reward after the ad is complete.
              </DialogDescription>
            </DialogHeader>

            <div className="flex-grow flex items-center justify-center text-muted-foreground bg-black/50">
               {isAdPlayerOpen && <AdDisplay key={adKey} />}
            </div>
             
             <div className="p-4 border-t">
                <Button onClick={handleAdWatched} className="w-full">
                  <X className="mr-2 h-4 w-4" />
                  Close Ad & Claim Reward
                </Button>
             </div>
          </DialogContent>
        </Dialog>
    </>
  );
}
