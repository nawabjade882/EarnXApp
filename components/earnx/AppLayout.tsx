'use client';

import React from 'react';
import Link from 'next/link';
import { Youtube, Instagram } from 'lucide-react';
import { useUser } from '@/hooks/use-user';
import { useBtcPrice } from '@/hooks/use-btc-price';
import { AuthForm } from '@/components/earnx/AuthForm';
import { WalletCard } from '@/components/earnx/WalletCard';
import { QuickActionsCard } from '@/components/earnx/QuickActionsCard';
import { ReferralCard } from '@/components/earnx/ReferralCard';
import { HistoryCard } from '@/components/earnx/HistoryCard';
import { AdminCard } from '@/components/earnx/AdminCard';
import { Logo } from '@/components/earnx/Logo';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { User } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

function Header({ user, onLogout }: { user: User | null; onLogout: () => void }) {
  return (
    <header className="flex items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-3">
        <Logo />
        <div>
          <div className="text-lg font-bold text-foreground font-headline">EarnX Digital</div>
          <p className="text-xs text-muted-foreground">Tasks • Ads • BTC view</p>
        </div>
      </div>
      {user && (
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="font-code hidden sm:inline-flex">UID: {user.id.slice(0,10)}...</Badge>
          <Button variant="secondary" size="sm" onClick={onLogout}>Logout</Button>
        </div>
      )}
    </header>
  );
}

function TelegramIcon() {
    return (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-5 w-5"
        >
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
        </svg>
    )
}

function Footer() {
  return (
    <footer className="text-center p-6 opacity-85">
        <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">Join our community</p>
            <div className="flex justify-center gap-2">
                <Link href="https://t.me/example" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                      <TelegramIcon />
                    </Button>
                </Link>
                <Link href="https://youtube.com/@example" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                        <Youtube className="h-5 w-5" />
                    </Button>
                </Link>
                <Link href="https://instagram.com/example" target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon">
                        <Instagram className="h-5 w-5" />
                    </Button>
                </Link>
            </div>
        </div>

      <p className="text-sm text-muted-foreground">Now connected to Firebase for a real backend.</p>
      <Link href="/admin" className="text-xs text-muted-foreground/50 hover:text-muted-foreground transition-colors">
        Admin Panel
      </Link>
    </footer>
  );
}

function AppSkeleton() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <Skeleton className="h-[250px] w-full" />
        </div>
        <div className="lg:col-span-2">
          <Skeleton className="h-[250px] w-full" />
        </div>
      </div>
      <Skeleton className="h-[200px] w-full" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[300px] w-full" />
      </div>
    </div>
  )
}

export function AppLayout() {
  const { 
    user, 
    login, 
    signup,
    logout,
    addReward,
    applyReferral,
    withdraw,
    resetAccount,
    isClient,
    loading,
  } = useUser();

  const { btcPrice, lastUpdated, refreshPrice } = useBtcPrice();

  if (!isClient || loading) {
    return (
       <div className="min-h-screen flex flex-col">
          <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
             <Header user={null} onLogout={() => {}} />
             <AppSkeleton />
          </main>
          <Footer />
       </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8">
        <Header user={user} onLogout={logout} />
        {!user ? (
          <AuthForm onLogin={login} onSignup={signup} />
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-1">
                <WalletCard user={user} btcPrice={btcPrice} lastUpdated={lastUpdated} onRefresh={refreshPrice} />
              </div>
              <div className="lg:col-span-2">
                <QuickActionsCard 
                  user={user} 
                  btcPrice={btcPrice}
                  addReward={addReward} 
                  applyReferral={applyReferral}
                  withdraw={withdraw}
                />
              </div>
            </div>
            
            <ReferralCard user={user} />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <HistoryCard history={user.history} />
              <AdminCard onReset={resetAccount} />
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
