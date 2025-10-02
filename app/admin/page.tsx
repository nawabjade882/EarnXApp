'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, doc, getDoc, writeBatch } from 'firebase/firestore';
import type { User, Transaction } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { CONFIG } from '@/lib/config';

const ADMIN_EMAIL = 'yusufytsiddiqui@gmail.com';
const ADMIN_PASSWORD = 'Aalam@123';

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [withdrawals, setWithdrawals] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const allWithdrawals: Transaction[] = [];
      for (const userDoc of usersSnapshot.docs) {
        const user = userDoc.data() as User;
        if (user.history) {
            const userWithdrawals = user.history
                .filter(t => t.type === 'withdraw')
                .map(t => ({...t, userId: user.id, userName: user.name}));
            allWithdrawals.push(...userWithdrawals);
        }
      }
      allWithdrawals.sort((a, b) => new Date(b.t as string).getTime() - new Date(a.t as string).getTime());
      setWithdrawals(allWithdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to fetch withdrawal requests. Check Firestore security rules.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // This effect now only fetches data if authenticated, removing session storage dependency
    if (authenticated) {
      fetchWithdrawals();
    }
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      // No longer using session storage to persist auth state across reloads
    } else {
      toast({
        variant: 'destructive',
        title: 'Authentication Failed',
        description: 'Incorrect email or password.',
      });
    }
  };
  
  const openRejectDialog = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsRejectDialogOpen(true);
  };

  const handleUpdateStatus = async (transaction: Transaction, newStatus: 'completed' | 'failed', reason?: string) => {
     if (!transaction.userId || !transaction.id) {
        toast({ variant: 'destructive', title: 'Error', description: 'Transaction details are missing.'});
        return;
    }
    
    setLoading(true);
    try {
        const userDocRef = doc(db, 'users', transaction.userId);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data() as User;
            let finalNote = transaction.note;
            const batch = writeBatch(db);

            const updatedHistory = userData.history.map(t => {
                if (t.id === transaction.id) {
                   if(newStatus === 'failed') {
                     finalNote = `${t.note} (Cancelled: ${reason})`
                   }
                   return { ...t, status: newStatus, note: finalNote };
                }
                return t;
            });

            if (newStatus === 'failed' && transaction.amt) {
                 const newBalance = userData.inr + Math.abs(transaction.amt);
                 batch.update(userDocRef, { inr: newBalance, history: updatedHistory });
            } else {
                 batch.update(userDocRef, { history: updatedHistory });
            }

            await batch.commit();
            
            toast({ title: 'Success', description: `Transaction marked as ${newStatus}.`});
            fetchWithdrawals(); // Refresh the list
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error updating transaction:', error);
        toast({ variant: 'destructive', title: 'Update Error', description: 'Failed to update transaction status.'});
    } finally {
        setLoading(false);
        setIsRejectDialogOpen(false);
        setRejectionReason('');
        setSelectedTransaction(null);
    }
  }

  if (!authenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[380px]">
          <CardHeader>
            <CardTitle className="text-foreground">Admin Login</CardTitle>
            <CardDescription>Enter your administrator credentials.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                   <Input 
                    id="email" 
                    type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                 <div className="flex flex-col space-y-1.5">
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                     required
                  />
                </div>
                <Button type="submit" className="w-full">Login</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
          <Button onClick={fetchWithdrawals} disabled={loading}>
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount to Send</TableHead>
                  <TableHead>Details (UPI/Paytm ID)</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">Loading requests...</TableCell>
                  </TableRow>
                ) : withdrawals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center h-24">No withdrawal requests found.</TableCell>
                  </TableRow>
                ) : (
                  withdrawals.map((w) => {
                    const totalAmount = Math.abs(w.amt || 0);
                    const amountToSend = totalAmount * (1 - CONFIG.withdrawFeePct / 100);
                    return (
                    <TableRow key={w.id}>
                      <TableCell>
                        <div className="font-medium">{w.userName || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground font-mono">{w.userId}</div>
                      </TableCell>
                      <TableCell>{w.t ? format(new Date(w.t as string), 'MMM d, yyyy h:mm a') : 'N/A'}</TableCell>
                      <TableCell>
                        <div className="font-semibold text-base">₹{amountToSend.toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">(Req: ₹{totalAmount.toFixed(2)})</div>
                      </TableCell>
                      <TableCell className="text-xs max-w-[200px] truncate font-mono" title={w.note}>{w.note}</TableCell>
                      <TableCell>
                        <Badge variant={w.status === 'pending' ? 'secondary' : w.status === 'completed' ? 'default' : 'destructive'} className="capitalize">
                          {w.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {w.status === 'pending' && (
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" onClick={() => handleUpdateStatus(w, 'completed')}>Done</Button>
                            <Button size="sm" variant="destructive" onClick={() => openRejectDialog(w)}>Cancel</Button>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  )})
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
      
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Withdrawal Request</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-2">
            <p className="text-sm text-muted-foreground">Please provide a reason for cancelling. This will be shown to the user and their amount will be refunded.</p>
            <Textarea 
              placeholder="e.g. Invalid UPI ID"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRejectDialogOpen(false)}>Back</Button>
            <Button 
              variant="destructive" 
              onClick={() => selectedTransaction && handleUpdateStatus(selectedTransaction, 'failed', rejectionReason)}
              disabled={!rejectionReason.trim()}
            >
              Confirm Cancellation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default AdminPage;
