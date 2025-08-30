import { useAuth } from '@/lib/auth';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface AdminRouteProps {
  children: React.ReactNode;
}

export function AdminRoute({ children }: AdminRouteProps) {
  const { user, loading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setCheckingAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) throw error;
        setIsAdmin(data?.is_admin || false);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
      } finally {
        setCheckingAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  if (loading || checkingAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-accent/30 border-t-primary rounded-full mx-auto mb-4"></div>
          <p className="text-secondary-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-display font-bold mb-4 text-destructive">Access Denied</h2>
          <p className="text-secondary-foreground mb-6">
            You don't have permission to access the admin panel. Please contact support if you believe this is an error.
          </p>
          <a href="/" className="text-primary hover:text-accent underline">
            Return to Home
          </a>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}