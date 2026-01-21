'use client';

import { useState } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function NewsletterSignup() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !email.includes('@')) {
            setStatus('error');
            setMessage('Please enter a valid email address');
            return;
        }

        setStatus('loading');

        try {
            // TODO: Integrate with Firebase or email service
            await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call

            setStatus('success');
            setMessage('Thanks for subscribing!');
            setEmail('');

            // Reset after 3 seconds
            setTimeout(() => {
                setStatus('idle');
                setMessage('');
            }, 3000);
        } catch (error) {
            setStatus('error');
            setMessage('Something went wrong. Please try again.');
        }
    };

    return (
        <Card className="glass overflow-hidden border-border/50">
            <div className="p-2 bg-gradient-to-br from-primary/10 via-transparent to-purple-500/10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="p-1.5 rounded-lg bg-primary/10">
                        <Mail className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm text-white">Stay Updated</h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-1.5">
                    <Input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={status === 'loading' || status === 'success'}
                        className="bg-background/50 border-border/50 focus-visible:ring-primary h-8 text-sm text-white placeholder:text-gray-400"
                    />

                    <Button
                        type="submit"
                        disabled={status === 'loading' || status === 'success'}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground h-8 text-sm font-medium"
                    >
                        {status === 'loading' && (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        )}
                        {status === 'success' && (
                            <Check className="mr-2 h-3 w-3" />
                        )}
                        {status === 'success' ? 'Subscribed!' : 'Subscribe'}
                    </Button>

                    {message && (
                        <p className={`text-xs text-center font-medium ${status === 'success' ? 'text-green-400' : 'text-red-400'
                            }`}>
                            {message}
                        </p>
                    )}
                </form>
            </div>
        </Card>
    );
}
