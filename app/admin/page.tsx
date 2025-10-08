
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ArrowRight, History, PenSquare } from 'lucide-react';
import Link from 'next/link';

const ADMIN_EMAIL = 'yusufytsiddiqui@gmail.com';
const ADMIN_PASSWORD = 'Aalam@123';

function AdminDashboardPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Attempt to check auth state on component mount
  useEffect(() => {
    if (sessionStorage.getItem('admin-auth') === 'true') {
      setAuthenticated(true);
    }
  }, []);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      sessionStorage.setItem('admin-auth', 'true');
      setAuthenticated(true);
    } else {
      alert('Incorrect email or password.');
    }
  };
  
  const handleLogout = () => {
    sessionStorage.removeItem('admin-auth');
    setAuthenticated(false);
  };

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
     <div className="container mx-auto p-4 md:p-6 lg:p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" asChild>
                <Link href="/">Back to App</Link>
            </Button>
            <Button onClick={handleLogout} variant="secondary">Logout</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/admin/withdrawals" passHref>
                <Card className="card shadow-lg hover:border-primary transition-colors cursor-pointer h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <History className="h-6 w-6" />
                            Withdrawal Management
                        </CardTitle>
                        <CardDescription>View and manage user withdrawal requests.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex justify-end">
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
             <Link href="/ad-script-generator" passHref>
                <Card className="card shadow-lg hover:border-primary transition-colors cursor-pointer h-full">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                            <PenSquare className="h-6 w-6" />
                            AI Ad Script Generator
                        </CardTitle>
                        <CardDescription>Create promotional ad scripts for the app using AI.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <div className="flex justify-end">
                            <ArrowRight className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </div>
      </div>
  );
}

export default AdminDashboardPage;
