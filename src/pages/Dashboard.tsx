import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Link } from "react-router-dom";
import { 
  Copy, 
  Share, 
  Trophy, 
  Clock, 
  Users, 
  Ticket, 
  DollarSign, 
  Gift, 
  Calendar,
  TrendingUp,
  Star,
  Eye,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface UserStats {
  totalTickets: number;
  totalSpent: number;
  freeTickets: number;
  referralTickets: number;
  referralConversions: number;
  nextDrawDate: string;
  winnings: number;
  referralEarnings: number;
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

interface ReferralData {
  id: string;
  referee_name: string;
  referee_email: string;
  status: string;
  created_at: string;
  reward_ticket_id?: string;
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
    nextDrawDate: '',
    winnings: 0,
    referralEarnings: 0
  });
  const [tickets, setTickets] = useState<UserTicket[]>([]);
  const [referrals, setReferrals] = useState<ReferralData[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [timeLeft700, setTimeLeft700] = useState({ days: 8, hours: 14, minutes: 32, seconds: 15 });
  const [timeLeft1000, setTimeLeft1000] = useState({ days: 18, hours: 14, minutes: 32, seconds: 15 });

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setTimeLeft700(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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

      // Fetch referral data
      const { data: referralData } = await supabase
        .from('referrals')
        .select(`
          *,
          referee:referee_id(full_name, email)
        `)
        .eq('referrer_id', user.id)
        .order('created_at', { ascending: false });

      const formattedReferrals = referralData?.map(ref => ({
        id: ref.id,
        referee_name: ref.referee?.full_name || 'Unknown',
        referee_email: ref.referee?.email || 'Unknown',
        status: ref.status,
        created_at: ref.created_at,
        reward_ticket_id: ref.reward_ticket_id
      })) || [];

      setReferrals(formattedReferrals);

      // Calculate stats
      if (userTickets) {
        const totalSpent = userTickets
          .filter(t => t.ticket_type.startsWith('paid'))
          .reduce((sum, t) => sum + t.amount, 0);
        
        const freeTickets = userTickets.filter(t => t.ticket_type.startsWith('free')).length;
        const referralTickets = userTickets.filter(t => t.ticket_type === 'free_referral').length;
        const referralConversions = formattedReferrals.filter(r => r.status === 'completed').length;

        setStats({
          totalTickets: userTickets.length,
          totalSpent,
          freeTickets,
          referralTickets,
          referralConversions,
          nextDrawDate: getNextDrawDate(),
          winnings: 0, // TODO: Calculate from wins
          referralEarnings: referralTickets * 5 // $5 value per free ticket
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
      active: 'bg-success/20 text-success border-success/30',
      drawn: 'bg-warning/20 text-warning border-warning/30',
      won: 'bg-primary/20 text-primary border-primary/30',
      expired: 'bg-secondary/20 text-secondary-foreground border-secondary/30'
    };
    
    return (
      <span className={`px-3 py-1 text-xs rounded-full border ${colors[status as keyof typeof colors] || colors.active}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const getReferralStatusBadge = (status: string) => {
    const colors = {
      pending: 'bg-warning/20 text-warning border-warning/30',
      completed: 'bg-success/20 text-success border-success/30',
      rewarded: 'bg-primary/20 text-primary border-primary/30'
    };
    
    return (
      <span className={`px-3 py-1 text-xs rounded-full border ${colors[status as keyof typeof colors] || colors.pending}`}>
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
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-display font-bold mb-2">
                  Welcome back, {userProfile?.full_name?.split(' ')[0] || 'Player'}!
                </h1>
                <p className="text-secondary-foreground">
                  Track your entries, manage referrals, and stay updated on upcoming draws.
                </p>
              </div>
              <div className="flex items-center space-x-3 mt-4 md:mt-0">
                <PremiumButton variant="outline" size="sm" onClick={fetchUserData}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh Data
                </PremiumButton>
                <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                  <PremiumButton variant="gold" size="sm">
                    <Ticket className="w-4 h-4 mr-2" />
                    Buy More Tickets
                  </PremiumButton>
                </Link>
              </div>
            </div>
            
            {/* Live Countdown Cards */}
            <div className="grid sm:grid-cols-2 gap-6 mb-8">
              <div className="glass rounded-lg p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-secondary-foreground">Next $700 Draw</div>
                    <div className="text-lg font-display font-semibold text-primary">January 20, 2025</div>
                  </div>
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <div className="flex space-x-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{timeLeft700.days}</div>
                    <div className="text-xs text-secondary-foreground">DAYS</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{timeLeft700.hours}</div>
                    <div className="text-xs text-secondary-foreground">HRS</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{timeLeft700.minutes}</div>
                    <div className="text-xs text-secondary-foreground">MIN</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{timeLeft700.seconds}</div>
                    <div className="text-xs text-secondary-foreground">SEC</div>
                  </div>
                </div>
              </div>
              
              <div className="glass rounded-lg p-6 hover-lift">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <div className="text-sm text-secondary-foreground">Next $1,000 Draw</div>
                    <div className="text-lg font-display font-semibold text-success">January 30, 2025</div>
                  </div>
                  <Trophy className="w-8 h-8 text-success" />
                </div>
                <div className="flex space-x-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-success">{timeLeft1000.days}</div>
                    <div className="text-xs text-secondary-foreground">DAYS</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">{timeLeft1000.hours}</div>
                    <div className="text-xs text-secondary-foreground">HRS</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">{timeLeft1000.minutes}</div>
                    <div className="text-xs text-secondary-foreground">MIN</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-success">{timeLeft1000.seconds}</div>
                    <div className="text-xs text-secondary-foreground">SEC</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass rounded-lg p-6 text-center hover-lift">
              <Ticket className="w-10 h-10 mx-auto mb-3 text-primary" />
              <div className="text-3xl font-bold mb-1">{stats.totalTickets}</div>
              <div className="text-sm text-secondary-foreground">Total Entries</div>
              <div className="text-xs text-accent mt-1">Active in upcoming draws</div>
            </div>
            
            <div className="glass rounded-lg p-6 text-center hover-lift">
              <DollarSign className="w-10 h-10 mx-auto mb-3 text-success" />
              <div className="text-3xl font-bold mb-1">${stats.totalSpent}</div>
              <div className="text-sm text-secondary-foreground">Total Invested</div>
              <div className="text-xs text-accent mt-1">Lifetime purchases</div>
            </div>
            
            <div className="glass rounded-lg p-6 text-center hover-lift">
              <Gift className="w-10 h-10 mx-auto mb-3 text-accent" />
              <div className="text-3xl font-bold mb-1">{stats.freeTickets}</div>
              <div className="text-sm text-secondary-foreground">Free Tickets</div>
              <div className="text-xs text-accent mt-1">Quiz + Referrals</div>
            </div>
            
            <div className="glass rounded-lg p-6 text-center hover-lift">
              <Users className="w-10 h-10 mx-auto mb-3 text-warning" />
              <div className="text-3xl font-bold mb-1">{stats.referralConversions}</div>
              <div className="text-sm text-secondary-foreground">Referrals</div>
              <div className="text-xs text-accent mt-1">${stats.referralEarnings} value earned</div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="glass rounded-lg p-1 inline-flex mb-8">
            {[
              { key: 'overview', label: 'Overview', icon: Trophy },
              { key: 'tickets', label: 'My Tickets', icon: Ticket },
              { key: 'referrals', label: 'Referrals', icon: Users },
              { key: 'account', label: 'Account', icon: User }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center space-x-2 px-6 py-3 text-sm font-medium rounded-md transition-all ${
                  activeTab === tab.key
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-secondary-foreground hover:text-primary hover:bg-accent/10'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Quick Actions */}
                  <div className="glass rounded-lg p-6">
                    <h3 className="text-xl font-display font-semibold mb-6">Quick Actions</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <Link to="/buy?tier=3" onClick={() => window.scrollTo(0, 0)}>
                        <PremiumButton variant="hero" className="w-full">
                          <Calendar className="w-4 h-4 mr-2" />
                          Enter $700 Draw
                        </PremiumButton>
                      </Link>
                      <Link to="/buy?tier=5" onClick={() => window.scrollTo(0, 0)}>
                        <PremiumButton variant="hero" className="w-full">
                          <Trophy className="w-4 h-4 mr-2" />
                          Enter $1,000 Draw
                        </PremiumButton>
                      </Link>
                      <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                        <PremiumButton variant="outline" className="w-full">
                          <Star className="w-4 h-4 mr-2" />
                          Try Free Quiz
                        </PremiumButton>
                      </Link>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="glass rounded-lg p-6">
                    <h3 className="text-xl font-display font-semibold mb-6">Recent Activity</h3>
                    {tickets.length > 0 ? (
                      <div className="space-y-4">
                        {tickets.slice(0, 5).map((ticket) => (
                          <div key={ticket.id} className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                ticket.ticket_type.startsWith('free') 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-primary/20 text-primary'
                              }`}>
                                <Ticket className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium">{getTicketTypeLabel(ticket.ticket_type)}</div>
                                <div className="text-sm text-secondary-foreground">
                                  Entry #{ticket.entry_number} • ${ticket.draw_type} Draw
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${ticket.amount}</div>
                              <div className="text-sm">{getStatusBadge(ticket.status)}</div>
                            </div>
                          </div>
                        ))}
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
              )}

              {activeTab === 'tickets' && (
                <div className="glass rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-display font-semibold">Your Ticket History</h3>
                    <div className="text-sm text-secondary-foreground">
                      {tickets.length} total entries
                    </div>
                  </div>
                  
                  {tickets.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-accent/20">
                            <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Entry #</th>
                            <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Type</th>
                            <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Prize Pool</th>
                            <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Draw Date</th>
                            <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Status</th>
                            <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-accent/10">
                          {tickets.map((ticket) => (
                            <tr key={ticket.id} className="hover:bg-surface/30">
                              <td className="py-4 text-sm font-mono">{ticket.entry_number}</td>
                              <td className="py-4">
                                <span className={`px-2 py-1 text-xs rounded-full ${
                                  ticket.ticket_type.startsWith('free') 
                                    ? 'bg-success/20 text-success' 
                                    : 'bg-primary/20 text-primary'
                                }`}>
                                  {getTicketTypeLabel(ticket.ticket_type)}
                                </span>
                              </td>
                              <td className="py-4 text-sm font-semibold">${ticket.draw_type}</td>
                              <td className="py-4 text-sm">{new Date(ticket.draw_date).toLocaleDateString()}</td>
                              <td className="py-4">{getStatusBadge(ticket.status)}</td>
                              <td className="py-4 text-sm font-semibold">
                                {ticket.amount > 0 ? `$${ticket.amount}` : 'FREE'}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Ticket className="w-16 h-16 text-secondary-foreground mx-auto mb-4" />
                      <h4 className="text-lg font-semibold mb-2">No Tickets Yet</h4>
                      <p className="text-secondary-foreground mb-6">
                        Start your BigMoney journey by purchasing your first ticket or taking the free quiz.
                      </p>
                      <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                        <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                          <PremiumButton variant="gold" className="flex-1">Buy Tickets</PremiumButton>
                        </Link>
                        <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                          <PremiumButton variant="outline" className="flex-1">Try Free Quiz</PremiumButton>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'referrals' && (
                <div className="space-y-6">
                  {/* Referral Stats */}
                  <div className="glass rounded-lg p-6">
                    <h3 className="text-xl font-display font-semibold mb-6">Referral Performance</h3>
                    <div className="grid md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-primary mb-2">{stats.referralConversions}</div>
                        <div className="text-sm text-secondary-foreground">Successful Referrals</div>
                        <div className="text-xs text-accent mt-1">Friends who purchased</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-success mb-2">{stats.referralTickets}</div>
                        <div className="text-sm text-secondary-foreground">Free Tickets Earned</div>
                        <div className="text-xs text-accent mt-1">${stats.referralEarnings} value</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-accent mb-2">
                          {stats.referralConversions > 0 ? Math.round((stats.referralConversions / (stats.referralConversions + 5)) * 100) : 0}%
                        </div>
                        <div className="text-sm text-secondary-foreground">Conversion Rate</div>
                        <div className="text-xs text-accent mt-1">Above average!</div>
                      </div>
                    </div>
                  </div>

                  {/* Referral History */}
                  <div className="glass rounded-lg p-6">
                    <h3 className="text-xl font-display font-semibold mb-6">Referral History</h3>
                    {referrals.length > 0 ? (
                      <div className="space-y-4">
                        {referrals.map((referral) => (
                          <div key={referral.id} className="flex items-center justify-between p-4 bg-surface/50 rounded-lg">
                            <div className="flex items-center space-x-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                referral.status === 'completed' 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-warning/20 text-warning'
                              }`}>
                                <Users className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-medium">{referral.referee_name}</div>
                                <div className="text-sm text-secondary-foreground">{referral.referee_email}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div>{getReferralStatusBadge(referral.status)}</div>
                              <div className="text-xs text-secondary-foreground mt-1">
                                {new Date(referral.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <Users className="w-12 h-12 text-secondary-foreground mx-auto mb-4" />
                        <p className="text-secondary-foreground mb-4">No referrals yet</p>
                        <p className="text-sm text-secondary-foreground">
                          Share your referral link to start earning free tickets!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'account' && (
                <div className="glass rounded-lg p-6">
                  <h3 className="text-xl font-display font-semibold mb-6">Account Information</h3>
                  
                  <div className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-secondary-foreground mb-2 block">Full Name</label>
                        <div className="p-3 bg-surface/50 rounded-lg border border-accent/30">
                          {userProfile?.full_name || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-secondary-foreground mb-2 block">Email Address</label>
                        <div className="p-3 bg-surface/50 rounded-lg border border-accent/30">
                          {userProfile?.email || 'Not provided'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-sm text-secondary-foreground mb-2 block">Phone Number</label>
                        <div className="p-3 bg-surface/50 rounded-lg border border-accent/30">
                          {userProfile?.phone || 'Not provided'}
                        </div>
                      </div>
                      <div>
                        <label className="text-sm text-secondary-foreground mb-2 block">Address</label>
                        <div className="p-3 bg-surface/50 rounded-lg border border-accent/30">
                          {userProfile?.address || 'Not provided'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm text-secondary-foreground mb-2 block">Member Since</label>
                      <div className="p-3 bg-surface/50 rounded-lg border border-accent/30">
                        {new Date(userProfile?.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                    </div>

                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                      <div className="text-sm text-primary font-medium mb-2">Account Status:</div>
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span className="text-sm text-secondary-foreground">Verified and Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Referral Program Card */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Your Referral Program</h3>
                
                <div className="space-y-4">
                  <div className="p-4 bg-surface/50 rounded-lg border border-accent/20">
                    <div className="text-xs text-secondary-foreground mb-2">Your Referral Link:</div>
                    <div className="text-sm font-mono break-all text-primary">
                      bigmoney.com/referral/{referralCode}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <PremiumButton variant="glass" size="sm" className="flex-1" onClick={copyReferralLink}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Link
                    </PremiumButton>
                    <PremiumButton variant="glass" size="sm" className="flex-1" onClick={shareReferralLink}>
                      <Share className="w-4 h-4 mr-2" />
                      Share Link
                    </PremiumButton>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-primary">{stats.referralConversions}</div>
                      <div className="text-xs text-secondary-foreground">Conversions</div>
                    </div>
                    <div className="bg-success/10 p-3 rounded-lg">
                      <div className="text-lg font-bold text-success">{stats.referralTickets}</div>
                      <div className="text-xs text-secondary-foreground">Free Tickets</div>
                    </div>
                  </div>
                  
                  <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                    <div className="text-xs text-accent font-medium mb-1">How it works:</div>
                    <div className="text-xs text-secondary-foreground">
                      Share your link → Friend purchases → You both get rewarded!
                    </div>
                  </div>
                </div>
              </div>

              {/* Quiz Status */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Daily Quiz Challenge</h3>
                
                <div className="space-y-4">
                  <div className="text-center">
                    <Star className="w-12 h-12 text-primary mx-auto mb-3" />
                    <div className="text-sm text-secondary-foreground mb-2">
                      Expert Challenge Available
                    </div>
                    <div className="text-xs text-accent">
                      10 difficult questions • 40s each • All correct = $5 ticket
                    </div>
                  </div>
                  
                  <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="gold" size="sm" className="w-full">
                      <Trophy className="w-4 h-4 mr-2" />
                      Take Today's Challenge
                    </PremiumButton>
                  </Link>
                  
                  <div className="bg-warning/10 border border-warning/30 rounded-lg p-3">
                    <div className="text-xs text-warning font-medium mb-1">Success Rate: ~3%</div>
                    <div className="text-xs text-secondary-foreground">
                      Only the most knowledgeable participants earn free tickets through our quiz.
                    </div>
                  </div>
                </div>
              </div>

              {/* Performance Insights */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Your Performance</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-foreground">Total Value:</span>
                    <span className="font-semibold">${(stats.totalSpent + stats.referralEarnings).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-foreground">Free Value Earned:</span>
                    <span className="font-semibold text-success">${stats.referralEarnings}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-secondary-foreground">Member Since:</span>
                    <span className="font-semibold">
                      {new Date(userProfile?.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="pt-4 border-t border-accent/20">
                    <div className="text-sm text-secondary-foreground mb-2">Next Milestones:</div>
                    <div className="space-y-2">
                      {stats.referralConversions < 5 && (
                        <div className="flex items-center space-x-2 text-xs">
                          <div className="w-2 h-2 bg-accent rounded-full"></div>
                          <span>Refer {5 - stats.referralConversions} more friends for bonus rewards</span>
                        </div>
                      )}
                      {stats.totalTickets < 10 && (
                        <div className="flex items-center space-x-2 text-xs">
                          <div className="w-2 h-2 bg-primary rounded-full"></div>
                          <span>Reach 10 total entries for VIP status</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Links */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Quick Links</h3>
                
                <div className="space-y-3">
                  <Link to="/winners" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="glass" size="sm" className="w-full justify-start">
                      <Trophy className="w-4 h-4 mr-2" />
                      View All Winners
                    </PremiumButton>
                  </Link>
                  
                  <Link to="/how-it-works" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="glass" size="sm" className="w-full justify-start">
                      <Eye className="w-4 h-4 mr-2" />
                      How Verification Works
                    </PremiumButton>
                  </Link>
                  
                  <Link to="/rules" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="outline" size="sm" className="w-full justify-start">
                      <Shield className="w-4 h-4 mr-2" />
                      Official Rules
                    </PremiumButton>
                  </Link>
                  
                  <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="outline" size="sm" className="w-full justify-start">
                      <Users className="w-4 h-4 mr-2" />
                      Contact Support
                    </PremiumButton>
                  </Link>
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