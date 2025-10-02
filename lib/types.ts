import type { Timestamp } from 'firebase/firestore';

export type Transaction = {
  id: string; // Unique ID for the transaction
  t: Timestamp | string; // ISO string for client, Timestamp for Firestore
  type: 'signup' | 'bonus' | 'earn' | 'withdraw';
  amt?: number;
  note?: string;
  status?: 'pending' | 'completed' | 'failed';
  userId?: string; // To identify the user on the admin page
  userName?: string; // To display the user name on the admin page
};

export type ReferralTaskProgress = {
  ads: number;
  tasks: number;
};

export interface User {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  phone: string;
  inr: number;
  lastRewardAt: number; // timestamp
  referrals: string[]; // uids of referred users
  usedReferral: string | null;
  history: Transaction[];
  referralTasks: ReferralTaskProgress;
  referralBonusClaimed: boolean;
}
