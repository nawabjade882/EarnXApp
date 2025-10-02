'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type AuthFormProps = {
  onLogin: (email: string, pass: string) => void;
  onSignup: (name: string, email: string, phone: string, pass: string, ref: string) => void;
};

export function AuthForm({ onLogin, onSignup }: AuthFormProps) {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  const [suName, setSuName] = useState('');
  const [suEmail, setSuEmail] = useState('');
  const [suPhone, setSuPhone] = useState('');
  const [suPass, setSuPass] = useState('');
  const [suRef, setSuRef] = useState('');
  
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSignup(suName, suEmail, suPhone, suPass, suRef);
    } catch (error) {
      // Error is already toasted in useUser hook
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onLogin(loginEmail, loginPass);
    } catch (error) {
      // Error is already toasted in useUser hook
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
      <Card className="card shadow-lg">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription>Enter your email and password.</CardDescription>
        </CardHeader>
        <Separator className="mx-6 w-auto" />
        <CardContent className="pt-6">
          <form onSubmit={handleLogin}>
            <div className="space-y-4">
              <Input
                id="loginEmail"
                type="email"
                placeholder="Email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                disabled={loading}
                required
              />
              <Input
                id="loginPass"
                type="password"
                placeholder="Password"
                value={loginPass}
                onChange={(e) => setLoginPass(e.target.value)}
                disabled={loading}
                required
              />
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="card shadow-lg">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
          <CardDescription>New user? Create account.</CardDescription>
        </CardHeader>
        <Separator className="mx-6 w-auto" />
        <CardContent className="pt-6">
            <form onSubmit={handleSignup}>
              <div className="space-y-4">
                <Input
                  id="suName"
                  placeholder="Full name"
                  value={suName}
                  onChange={(e) => setSuName(e.target.value)}
                  disabled={loading}
                  required
                />
                <Input
                  id="suEmail"
                  type="email"
                  placeholder="Email"
                  value={suEmail}
                  onChange={(e) => setSuEmail(e.target.value)}
                  disabled={loading}
                  required
                />
                <div className="flex items-center">
                  <span className="p-2 border border-r-0 rounded-l-md bg-muted text-muted-foreground text-sm">+91</span>
                  <Input
                    id="suPhone"
                    placeholder="10-digit phone number"
                    value={suPhone}
                    onChange={(e) => setSuPhone(e.target.value)}
                    className="rounded-l-none"
                    disabled={loading}
                    required
                    pattern="\d{10}"
                    title="Please enter a 10-digit phone number"
                  />
                </div>
                <Input
                  id="suPass"
                  type="password"
                  placeholder="Password"
                  value={suPass}
                  onChange={(e) => setSuPass(e.target.value)}
                  disabled={loading}
                  required
                  minLength={6}
                />
                <Input
                  id="suRef"
                  placeholder="Referral code (optional)"
                  value={suRef}
                  onChange={(e) => setSuRef(e.target.value)}
                  disabled={loading}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>              </div>
            </form>
        </CardContent>
      </Card>
    </div>
  );
}
