import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PremiumButton } from '@/components/ui/premium-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';
import { Mail, Lock, User, Phone, MapPin } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'signin' | 'signup';
  onModeChange: (mode: 'signin' | 'signup') => void;
}

export function AuthModal({ isOpen, onClose, mode, onModeChange }: AuthModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    phone: '',
    address: ''
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signup') {
        // Sign up user
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) throw authError;

        if (authData.user) {
          // Create user profile
          const { error: profileError } = await supabase
            .from('users')
            .insert({
              id: authData.user.id,
              email: formData.email,
              full_name: formData.fullName,
              phone: formData.phone,
              address: formData.address,
              is_admin: formData.email === 'admin@bigmoney.com' // Auto-admin for demo
            });

          if (profileError) throw profileError;

          toast({
            title: "Account Created!",
            description: "Welcome to BigMoney. You can now purchase tickets.",
          });
        }
      } else {
        // Sign in user
        const { error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) throw error;

        toast({
          title: "Welcome Back!",
          description: "You're now signed in to your BigMoney account.",
        });
      }

      onClose();
      setFormData({ email: '', password: '', fullName: '', phone: '', address: '' });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold text-center">
            {mode === 'signin' ? 'Welcome Back' : 'Join BigMoney'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <>
              <div>
                <Label htmlFor="fullName" className="flex items-center space-x-2 mb-2">
                  <User className="w-4 h-4" />
                  <span>Full Name *</span>
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="glass"
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="flex items-center space-x-2 mb-2">
                  <Phone className="w-4 h-4" />
                  <span>Phone Number</span>
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="glass"
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <Label htmlFor="address" className="flex items-center space-x-2 mb-2">
                  <MapPin className="w-4 h-4" />
                  <span>Address</span>
                </Label>
                <Input
                  id="address"
                  name="address"
                  type="text"
                  value={formData.address}
                  onChange={handleInputChange}
                  className="glass"
                  placeholder="City, State"
                />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="email" className="flex items-center space-x-2 mb-2">
              <Mail className="w-4 h-4" />
              <span>Email *</span>
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleInputChange}
              className="glass"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <Label htmlFor="password" className="flex items-center space-x-2 mb-2">
              <Lock className="w-4 h-4" />
              <span>Password *</span>
            </Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              value={formData.password}
              onChange={handleInputChange}
              className="glass"
              placeholder="Enter your password"
              minLength={6}
            />
          </div>

          <PremiumButton
            type="submit"
            variant="gold"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </PremiumButton>

          <div className="text-center">
            <button
              type="button"
              onClick={() => onModeChange(mode === 'signin' ? 'signup' : 'signin')}
              className="text-sm text-primary hover:text-accent underline"
            >
              {mode === 'signin' 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"
              }
            </button>
          </div>

          {mode === 'signup' && (
            <p className="text-xs text-secondary-foreground text-center">
              By creating an account, you agree to our{' '}
              <a href="/terms" className="text-primary hover:text-accent underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy" className="text-primary hover:text-accent underline">
                Privacy Policy
              </a>
              .
            </p>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}