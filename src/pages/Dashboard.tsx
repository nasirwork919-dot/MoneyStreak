import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Copy, Share, Trophy, Clock, Users, Ticket, DollarSign, Gift } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserStats {
  totalTickets: number;
  totalSpent: number;
  freeTickets: number;
  referralTickets: number;
  referralConversions: number;
  nextDrawDate: string;
}

interface UserTicket {
  id: string;
  entry_number: string;
  ticket_type: string;
  amount: number;
  draw_type: string;
  draw_date: string;
  status: string;
  created_at: string;
}

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [userProfile, setUserProfile] = useState<any>(null);
  const [stats, setStats] = useState<UserStats>({
    totalTickets: 0,
    totalSpent: 0,
    freeTickets: 0,
    referralTickets: 0,
    referralConversions: 0,
    nextDrawDate: ''
  });
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
      
      // Set up real-time subscriptions
      const ticketsSubscription = supabase
        .channel('user-tickets')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'tickets', filter: `user_id=eq.${user.id}` }, 
          () => fetchUserData()
        )
        .subscribe();

      const referralsSubscription = supabase
        .channel('user-referrals')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'referrals', filter: `referrer_id=eq.${user.id}` }, 
          () => fetchUserData()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(ticketsSubscription);
        supabase.removeChannel(referralsSubscription);
      };
    }
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      // Fetch user profile
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      setUserProfile(profile);
      setReferralCode(profile?.referral_code || '');

      // Fetch user tickets
      const { data: userTickets } = await supabase
        .from('tickets')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      setTickets(userTickets || []);

      // Calculate stats
      if (userTickets) {
        const totalSpent = userTickets
          .filter(t => t.ticket_type.startsWith('paid'))
          .reduce((sum, t) => sum + t.amount, 0);
        
        const freeTickets = userTickets.filter(t => t.ticket_type.startsWith('free')).length;
        const referralTickets = userTickets.filter(t => t.ticket_type === 'free_referral').length;

        // Fetch referral conversions
        const { data: referrals } = await supabase
          .from('referrals')
          .select('*')
          .eq('referrer_id', user.id)
          .eq('status', 'completed');

        setStats({
          totalTickets: userTickets.length,
          totalSpent,
          freeTickets,
          referralTickets,
          referralConversions: referrals?.length || 0,
          nextDrawDate: getNextDrawDate()
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getNextDrawDate = () => {
    const now = new Date();
    const next700 = new Date(now.getFullYear(), now.getMonth(), 20);
    const next1000 = new Date(now.getFullYear(), now.getMonth(), 30);
    
    if (next700 < now) next700.setMonth(next700.getMonth() + 1);
    if (next1000 < now) next1000.setMonth(next1000.getMonth() + 1);
    
    return next700 < next1000 ? next700.toLocaleDateString() : next1000.toLocaleDateString();
  };

  const copyReferralLink = () => {
    const link = `${window.location.origin}/referral/${referralCode}`;
    navigator.clipboard.writeText(link);
    toast({
      title: "Link Copied!",
      description: "Your referral link has been copied to clipboard.",
    });
  };

  const shareReferralLink = () => {
    const link = `${window.location.origin}/referral/${referralCode}`;
    if (navigator.share) {
      navigator.share({
        title: 'Join BigMoney Sweepstakes',
        text: 'Win $700 or $1,000 monthly! Use my referral link:',
        url: link,
      });
    } else {
      copyReferralLink();
    }
  };

  const getTicketTypeLabel = (type: string) => {
    switch (type) {
      case 'paid_3': return '$3 Ticket';
      case 'paid_5': return '$5 Ticket';
      case 'free_quiz': return 'Free Quiz';
      case 'free_referral': return 'Free Referral';
      default: return type;
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      active: 'bg-success/20 text-success',
      drawn: 'bg-warning/20 text-warning',
      won: 'bg-primary/20 text-primary',
      expired: 'bg-secondary/20 text-secondary-foreground'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full ${colors[status as keyof typeof colors] || colors.active}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-accent/30 border-t-primary rounded-full mx-auto mb-4"></div>
            <p className="text-secondary-foreground">Loading your dashboard...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-premium">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Welcome, {userProfile?.full_name?.split(' ')[0] || 'Player'}.
            </h1>
            
            {/* Countdown Cards */}
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="glass rounded-lg p-4">
                <div className="text-sm text-secondary-foreground mb-1">Next $700 Draw</div>
                <div className="text-2xl font-bold text-primary">8d 14h 32m</div>
                <div className="text-xs text-secondary-foreground">January 20, 2025</div>
              </div>
              <div className="glass rounded-lg p-4">
                <div className="text-sm text-secondary-foreground mb-1">Next $1,000 Draw</div>
                <div className="text-2xl font-bold text-primary">18d 14h 32m</div>
                <div className="text-xs text-secondary-foreground">January 30, 2025</div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass rounded-lg p-6 text-center">
              <Ticket className="w-8 h-8 mx-auto mb-3 text-primary" />
              <div className="text-2xl font-bold mb-1">{stats.totalTickets}</div>
              <div className="text-sm text-secondary-foreground">Total Entries</div>
            </div>
            
            <div className="glass rounded-lg p-6 text-center">
              <DollarSign className="w-8 h-8 mx-auto mb-3 text-success" />
              <div className="text-2xl font-bold mb-1">${stats.totalSpent}</div>
              <div className="text-sm text-secondary-foreground">Total Spent</div>
            </div>
            
            <div className="glass rounded-lg p-6 text-center">
              <Gift className="w-8 h-8 mx-auto mb-3 text-accent" />
              <div className="text-2xl font-bold mb-1">{stats.freeTickets}</div>
              <div className="text-sm text-secondary-foreground">Free Tickets</div>
            </div>
            
            <div className="glass rounded-lg p-6 text-center">
              <Users className="w-8 h-8 mx-auto mb-3 text-warning" />
              <div className="text-2xl font-bold mb-1">{stats.referralConversions}</div>
              <div className="text-sm text-secondary-foreground">Referrals</div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Active Entries */}
            <div className="lg:col-span-2">
              <div className="glass rounded-lg p-6">
                <h3 className="text-xl font-display font-semibold mb-6">Your Entries</h3>
                
                {tickets.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-accent/20">
                          <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Entry #</th>
                          <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Type</th>
                          <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Prize</th>
                          <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Draw Date</th>
                          <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {tickets.map((ticket) => (
                          <tr key={ticket.id}>
                            <td className="py-3 text-sm font-mono">{ticket.entry_number}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                ticket.ticket_type.startsWith('free') 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-primary/20 text-primary'
                              }`}>
                                {getTicketTypeLabel(ticket.ticket_type)}
                              </span>
                            </td>
                            <td className="py-3 text-sm font-semibold">${ticket.draw_type}</td>
                            <td className="py-3 text-sm">{new Date(ticket.draw_date).toLocaleDateString()}</td>
                            <td className="py-3">{getStatusBadge(ticket.status)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Ticket className="w-12 h-12 text-secondary-foreground mx-auto mb-4" />
                    <p className="text-secondary-foreground mb-4">No entries yet</p>
                    <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="gold">Buy Your First Ticket</PremiumButton>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Referral Card */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Your Referral Program</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-surface/50 rounded-lg border border-accent/20">
                    <div className="text-xs text-secondary-foreground mb-1">Your Referral Link</div>
                    <div className="text-sm font-mono break-all">
                      bigmoney.com/referral/{referralCode}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <PremiumButton variant="glass" size="sm" className="flex-1" onClick={copyReferralLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </PremiumButton>
                    <PremiumButton variant="glass" size="sm" className="flex-1" onClick={shareReferralLink}>
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </PremiumButton>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-secondary-foreground">Referral Stats:</div>
                    <div className="grid grid-cols-2 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-primary">{stats.referralConversions}</div>
                        <div className="text-xs text-secondary-foreground">Conversions</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-success">{stats.referralTickets}</div>
                        <div className="text-xs text-secondary-foreground">Free Tickets Earned</div>
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-xs text-secondary-foreground">
                    Earn 1 free ticket for each friend who makes a purchase using your link.
                  </p>
                </div>
              </div>

              {/* Quiz Status */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Free Entry Quiz</h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <Trophy className="w-12 h-12 text-primary mx-auto mb-3" />
                    <div className="text-sm text-secondary-foreground mb-2">
                      Daily Challenge Available
                    </div>
                  </div>
                  
                  <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="gold" size="sm" className="w-full">
                      Take Today's Quiz
                    </PremiumButton>
                  </Link>
                  
                  <p className="text-xs text-secondary-foreground text-center">
                    Answer 10 difficult questions correctly to earn a free $5 ticket.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="gold" size="sm" className="w-full">
                      Buy More Tickets
                    </PremiumButton>
                  </Link>
                  
                  <Link to="/winners" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="glass" size="sm" className="w-full">
                      View Winners
                    </PremiumButton>
                  </Link>
                  
                  <Link to="/rules" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="outline" size="sm" className="w-full">
                      Official Rules
                    </PremiumButton>
                  </Link>
                </div>
              </div>

              {/* Account Info */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Account Info</h3>
                
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-secondary-foreground">Email:</span>
                    <div className="font-medium">{userProfile?.email}</div>
                  </div>
                  {userProfile?.phone && (
                    <div>
                      <span className="text-secondary-foreground">Phone:</span>
                      <div className="font-medium">{userProfile.phone}</div>
                    </div>
                  )}
                  <div>
                    <span className="text-secondary-foreground">Member Since:</span>
                    <div className="font-medium">
                      {new Date(userProfile?.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}