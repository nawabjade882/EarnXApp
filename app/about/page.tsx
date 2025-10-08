
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8 min-h-screen flex items-center justify-center">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>About EarnX Digital</CardTitle>
          <CardDescription>
            Welcome to EarnX Digital, your gateway to earning real rewards.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            At EarnX Digital, we believe that your time is valuable. Our platform is designed to provide you with simple and engaging ways to earn real money (INR) directly from your smartphone. Whether you have a few spare minutes or want to dedicate more time, EarnX Digital offers a variety of opportunities to boost your income.
          </p>
          <h3 className="font-semibold text-lg text-foreground">Our Core Features</h3>
          <ul className="list-disc list-inside space-y-2">
            <li><span className="font-semibold text-foreground">Earn Real Cash:</span> Complete simple tasks, watch advertisements, and participate in offers to earn Indian Rupees (INR).</li>
            <li><span className="font-semibold text-foreground">Referral Program:</span> Invite your friends to join EarnX Digital and earn a bonus for every successful referral.</li>
            <li><span className="font-semibold text-foreground">Crypto View:</span> Stay updated with the latest INR to Bitcoin (BTC) conversion rates directly within the app.</li>
            <li><span className="font-semibold text-foreground">Flexible Withdrawals:</span> Easily and securely withdraw your earnings through popular payment methods like Paytm, PhonePe, or any UPI ID.</li>
          </ul>
          <p>
            Our mission is to create a reliable and user-friendly platform where anyone can earn rewards. We are committed to transparency and providing excellent support to our community.
          </p>
          <div className="pt-4">
             <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
