'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AuthPage() {
   const router = useRouter();
   const [email, setEmail] = useState('');
   const [password, setPassword] = useState('');
   const [username, setUsername] = useState('');
   const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

   const handleSubmit = async (e: React.FormEvent, isLogin: boolean) => {
       e.preventDefault();
       setMessage(null);
       try {
           const endpoint = isLogin ? '/api/auth/login' : '/api/auth/signup';
           const body = isLogin ? { email, password } : { email, password, username };
           const res = await fetch(endpoint, {
               method: 'POST',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(body),
           });
           const data = await res.json();
           
           if (!res.ok) {
               throw new Error(data.error || (isLogin ? 'Login failed' : 'Signup failed'));
           }

           if (isLogin) {
               if (data.token) {
                   router.push('/');
               } else {
                   throw new Error('Authentication failed');
               }
           } else {
               setMessage({ type: 'success', text: data.message });
           }
       } catch (err: any) {
           setMessage({ type: 'error', text: err.message || 'An error occurred' });
       }
   };

   const AuthForm = ({ isLogin }: { isLogin: boolean }) => (
       <form onSubmit={(e) => handleSubmit(e, isLogin)} className="space-y-6">
           <div>
               <Label htmlFor={`${isLogin ? 'login' : 'signup'}-email`} className="text-foreground">Email</Label>
               <Input
                   id={`${isLogin ? 'login' : 'signup'}-email`}
                   type="email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   required
                   className="w-full mt-1 bg-muted"
               />
           </div>
           {!isLogin && (
               <div>
                   <Label htmlFor="signup-username" className="text-foreground">Username</Label>
                   <Input
                       id="signup-username"
                       type="text"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       required
                       className="w-full mt-1 bg-muted"
                   />
               </div>
           )}
           <div>
               <Label htmlFor={`${isLogin ? 'login' : 'signup'}-password`} className="text-foreground">Password</Label>
               <Input
                   id={`${isLogin ? 'login' : 'signup'}-password`}
                   type="password"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   required
                   className="w-full mt-1 bg-muted"
               />
           </div>
           <Button type="submit" className="w-full">{isLogin ? 'Login' : 'Sign Up'}</Button>
       </form>
   );

   return (
       <div className="flex items-center justify-center min-h-screen bg-background">
           <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-lg cyberpunk-border">
               <h2 className="text-3xl font-bold text-center text-primary cyberpunk-glow">NeoCode Nexus Access</h2>
               {message && (
                   <Alert variant={message.type === 'error' ? 'destructive' : 'default'}>
                       {message.type === 'error' ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                       <AlertTitle>{message.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
                       <AlertDescription>{message.text}</AlertDescription>
                   </Alert>
               )}
               <Tabs defaultValue="login" className="w-full">
                   <TabsList className="grid w-full grid-cols-2">
                       <TabsTrigger value="login">Login</TabsTrigger>
                       <TabsTrigger value="signup">Sign Up</TabsTrigger>
                   </TabsList>
                   <TabsContent value="login">
                       <AuthForm isLogin={true} />
                   </TabsContent>
                   <TabsContent value="signup">
                       <AuthForm isLogin={false} />
                   </TabsContent>
               </Tabs>
           </div>
       </div>
   );
}

