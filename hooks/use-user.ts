'use client';

import { useState, useEffect, useCallback } from 'react';
import { useToast } from './use-toast';
import type { User, Transaction } from '@/lib/types';
import { CONFIG } from '@/lib/config';
import { auth, db } from '@/lib/firebase';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore';

// Helper to generate a unique ID for transactions
const generateTransactionId = () => `TXN-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const handleUserUpdate = (userData: User | null) => {
    setLoading(true);
    if (!userData) {
      setUser(null);
      setLoading(false);
      return null;
    }
    // Ensure all history timestamps are ISO strings for client-side consistency
    const clientHistory = userData.history.map(h => ({
      ...h,
      id: h.id || generateTransactionId(), // Add id if missing
      t: (h.t instanceof Timestamp) ? h.t.toDate().toISOString() : h.t
    })).sort((a, b) => new Date(b.t).getTime() - new Date(a.t).getTime());
    
    const clientUser = { ...userData, history: clientHistory };
    setUser(clientUser);
    setLoading(false);
    return clientUser;
  };

  const fetchUserData = useCallback(async (firebaseUser: import('firebase/auth').User): Promise<User | null> => {
    try {
        const userDocRef = doc(db, 'users', firebaseUser.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          return userDocSnap.data() as User;
        } else {
          toast({ variant: 'destructive', title: 'Error', description: 'Could not find your user data.' });
          await signOut(auth);
          return null;
        }
    } catch(e) {
        console.error("Fetch user data error", e);
        toast({ variant: 'destructive', title: 'Error', description: 'Failed to load your data.' });
        await signOut(auth);
        return null;
    }
  }, [toast]);

  useEffect(() => {
    setIsClient(true);
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userData = await fetchUserData(firebaseUser);
        handleUserUpdate(userData);
      } else {
        handleUserUpdate(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [fetchUserData]);
  
  const signup = async (name: string, email: string, phone: string, pass: string, ref: string) => {
    if (!name || !email || !phone || !pass) {
      toast({ variant: 'destructive', title: 'Please fill all fields' });
      return;
    }
     if (!/^\d{10}$/.test(phone)) {
        toast({ variant: 'destructive', title: 'Invalid Phone Number', description: 'Please enter a 10-digit phone number.' });
        return;
    }
    
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, pass);
      const firebaseUser = userCredential.user;

      const newUser: User = {
          id: firebaseUser.uid,
          name,
          email,
          phone: `+91${phone}`,
          inr: 0,
          lastRewardAt: 0,
          referrals: [],
          usedReferral: ref && /^REF-/.test(ref.toUpperCase()) ? ref.toUpperCase() : null,
          history: [{ 
            id: generateTransactionId(),
            t: new Date().toISOString(), 
            type: 'signup', 
            note: `Account created${ref ? ` with referral ${ref}` : ''}` 
          }],
          referralTasks: { ads: 0, tasks: 0 },
          referralBonusClaimed: false,
      };

      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      handleUserUpdate(newUser);
      toast({ title: 'Account Created!', description: 'Welcome to EarnX.' });

    } catch (error: any) {
        console.error("Error during user creation:", error);
        handleUserUpdate(null);
        if (error.code === 'auth/email-already-in-use') {
            toast({ variant: 'destructive', title: 'Signup Failed', description: 'This email is already registered.' });
        } else {
            toast({ variant: 'destructive', title: 'Signup Failed', description: error.message });
        }
    } finally {
       setLoading(false);
    }
  };

  const login = async (email: string, pass: string) => {
     if (!email || !pass) {
      toast({ variant: 'destructive', title: 'Please enter email and password.' });
      return;
    }
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const userData = await fetchUserData(userCredential.user);
      handleUserUpdate(userData);
      toast({ title: 'Login Successful', description: 'Welcome back!' });
    } catch (error: any) {
      console.error("Login error:", error);
      handleUserUpdate(null);
      if (error.code === 'auth/user-not-found' || error.code === 'wrong-password' || error.code === 'auth/invalid-credential') {
        toast({ variant: 'destructive', title: 'Login Failed', description: 'Invalid email or password.' });
      } else {
        toast({ variant: 'destructive', title: 'Login Failed', description: error.message });
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      handleUserUpdate(null); 
      if(typeof window !== 'undefined') {
        sessionStorage.removeItem('admin-auth');
      }
      toast({ title: 'Logged out' });
    } catch (error: any) {
      toast({ variant: 'destructive', title: 'Logout failed', description: error.message });
    }
  };
  
  const canReward = () => {
    if (!user) return false;
    const isAllowed = Date.now() - (user.lastRewardAt || 0) >= CONFIG.rewardCooldownMs;
    if (!isAllowed) {
      toast({ title: 'Slow down!', description: 'Please wait before earning another reward.' });
    }
    return isAllowed;
  }
  
  const addReward = async (note: string) => {
    if (!user || !auth.currentUser) return;
    if (!canReward()) return;
  
    const userDocRef = doc(db, 'users', user.id);
  
    try {
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          throw 'Document does not exist!';
        }

        const currentUserData = userDoc.data() as User;
        
        const match = note.match(/(\d+\.\d+)\s*INR/);
        const amount = match ? parseFloat(match[1]) : CONFIG.rewardPerActionINR;

        let newBalance = currentUserData.inr + amount;
        
        const newHistory = [...currentUserData.history, { 
          id: generateTransactionId(),
          t: new Date().toISOString(), 
          type: 'earn' as const, 
          amt: amount, 
          note 
        }];
        
        let newReferralTasks = { ...currentUserData.referralTasks };
        if (currentUserData.usedReferral && !currentUserData.referralBonusClaimed) {
          if (note.toLowerCase().includes('ad')) {
            newReferralTasks.ads = Math.min((newReferralTasks.ads || 0) + 1, CONFIG.referralAdsNeeded);
          } else if (note.toLowerCase().includes('task')) {
            newReferralTasks.tasks = Math.min((newReferralTasks.tasks || 0) + 1, CONFIG.referralTasksNeeded);
          }
        }
  
        let referralBonusClaimed = currentUserData.referralBonusClaimed;
        if (!referralBonusClaimed && currentUserData.usedReferral && newReferralTasks.ads >= CONFIG.referralAdsNeeded && newReferralTasks.tasks >= CONFIG.referralTasksNeeded) {
          newBalance += CONFIG.referralBonusINR;
          newHistory.push({ 
            id: generateTransactionId(),
            t: new Date().toISOString(), 
            type: 'bonus' as const, 
            amt: CONFIG.referralBonusINR, 
            note: `Referral bonus unlocked! (${currentUserData.usedReferral})` 
          });
          referralBonusClaimed = true;
          toast({ title: 'Referral Bonus Unlocked!', description: `You've earned ₹${CONFIG.referralBonusINR}!` });
        }
  
        await updateDoc(userDocRef, {
          inr: newBalance,
          lastRewardAt: Date.now(),
          history: newHistory,
          referralTasks: newReferralTasks,
          referralBonusClaimed: referralBonusClaimed,
        });
  
      const updatedUserData = await fetchUserData(auth.currentUser);
      handleUserUpdate(updatedUserData);
  
    } catch (e) {
      console.error("Error adding reward", e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save your reward.' });
    }
  };
  
  const applyReferral = async (code: string) => {
    if (!user || !auth.currentUser) return;
    if (!code) {
        toast({ variant: 'destructive', title: 'Please enter a referral code.' });
        return;
    }
    if(user.usedReferral) {
        toast({ variant: 'destructive', title: 'Referral code already used.' });
        return;
    }
     if(!/^REF-/.test(code.toUpperCase())) {
        toast({ variant: 'destructive', title: 'Invalid referral code format.' });
        return;
    }
    
    const userDocRef = doc(db, 'users', user.id);
    try {
        const userDoc = await getDoc(userDocRef);
        if(!userDoc.exists()) throw "User doc not found";
        const currentData = userDoc.data() as User;

        const newHistoryEntry: Transaction = { 
          id: generateTransactionId(),
          t: new Date().toISOString(), 
          type: 'bonus' as const, 
          note: `Referral code applied (${code.toUpperCase()}). Complete tasks to unlock bonus.` 
        };
        const newHistory = [...currentData.history, newHistoryEntry];

        await updateDoc(userDocRef, {
          usedReferral: code.toUpperCase(),
          history: newHistory
        });
      
      const updatedUserData = await fetchUserData(auth.currentUser);
      handleUserUpdate(updatedUserData);
      toast({ title: 'Referral Code Applied!', description: 'Complete your first tasks to get the bonus.' });
    } catch (e) {
      console.error("Apply referral error", e);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not apply referral code.' });
    }
  };

  const withdraw = async (amount: number, method: string, id: string) => {
    if (!user || !auth.currentUser) return;
    if (!amount || amount <= 0) {
      toast({ variant: 'destructive', title: 'Please enter a valid amount.' });
      return;
    }
    if (amount < CONFIG.minWithdraw) {
      toast({ variant: 'destructive', title: `Minimum withdrawal is ₹${CONFIG.minWithdraw.toFixed(2)}` });
      return;
    }
    if (amount > user.inr) {
      toast({ variant: 'destructive', title: 'Insufficient balance.' });
      return;
    }
    if (!id) {
        toast({ variant: 'destructive', title: 'Please enter your withdrawal ID.' });
        return;
    }
    
    const fee = +(amount * CONFIG.withdrawFeePct / 100).toFixed(2);
    const credit = +(amount - fee).toFixed(2);
    
    const userDocRef = doc(db, 'users', user.id);
    
    try {
        const userDoc = await getDoc(userDocRef);
        if(!userDoc.exists()) throw "User doc not found";
        const currentData = userDoc.data() as User;

        const newHistoryEntry: Transaction = {
          id: generateTransactionId(),
          t: new Date().toISOString(), 
          type: 'withdraw' as const,
          amt: -amount, 
          note: `Withdrawal to ${id} via ${method.toUpperCase()}. You will receive ₹${credit.toFixed(2)}.`,
          status: 'pending' as const,
        };
        const newHistory = [...currentData.history, newHistoryEntry];

        await updateDoc(userDocRef, {
          inr: currentData.inr - amount,
          history: newHistory
        });

      const updatedUserData = await fetchUserData(auth.currentUser);
      handleUserUpdate(updatedUserData);
      toast({ title: 'Withdrawal Request Submitted', description: `₹${credit.toFixed(2)} will be processed.` });
    } catch (e) {
      console.error("Withdraw error", e);
      toast({ variant: 'destructive', title: 'Error', description: 'Withdrawal request failed.' });
    }
  };

  const resetAccount = async () => {
    if (!user || !auth.currentUser) return;
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDocRef, {
        inr: 0,
        lastRewardAt: 0,
        history: [{ 
          id: generateTransactionId(),
          t: new Date().toISOString(), 
          type: 'signup', 
          note: 'Account data reset.' 
        }],
        referralTasks: { ads: 0, tasks: 0 },
        referralBonusClaimed: false,
        usedReferral: null,
      });

      const updatedUserData = await fetchUserData(auth.currentUser);
      handleUserUpdate(updatedUserData);
      toast({ title: 'Account Data Reset', description: 'Your earnings and history have been cleared.' });
    } catch (e: any) {
      console.error(e);
      toast({variant: 'destructive', title: 'Could not reset account', description: 'Please try again.'});
    } finally {
      setLoading(false);
    }
  };


  return {
    user, 
    isClient,
    loading,
    signup, 
    login, 
    logout,
    addReward,
    applyReferral,
    withdraw,
    resetAccount
  };
}

    