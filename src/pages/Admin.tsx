import { useState, useEffect } from "react";
import { AdminRoute } from "@/components/AdminRoute";
import { RevenueChart } from "@/components/RevenueChart";
import { PremiumButton } from "@/components/ui/premium-button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { supabase, type Ticket, type User, type Referral, type Draw, type Revenue } from "@/lib/supabase";
import { 
  DollarSign, 
  Ticket as TicketIcon, 
  Users, 
  TrendingUp, 
  Eye,
  Download,
  RefreshCw,
  Trophy,
  Gift,
  BarChart3,
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  LogOut,
  Shield
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { format, subDays, startOfDay, endOfDay } from "date-fns";

interface DashboardStats {
  totalRevenue: number;
  totalTickets: number;
  totalUsers: number;
  totalReferrals: number;
  ticket3Count: number;
  ticket5Count: number;
  freeTickets: number;
  todayRevenue: number;
  weeklyRevenue: number;
  monthlyRevenue: number;
  avgTicketValue: number;
  conversionRate: number;
}

interface RevenueByDate {
  date: string;
  ticket_3_revenue: number;
  ticket_5_revenue: number;
  total_revenue: number;
  ticket_3_count: number;
  ticket_5_count: number;
}

export default function Admin() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalTickets: 0,
    totalUsers: 0,
    totalReferrals: 0,
    ticket3Count: 0,
    ticket5Count: 0,
    freeTickets: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    avgTicketValue: 0,
    conversionRate: 0
  });
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [revenueData, setRevenueData] = useState<RevenueByDate[]>([]);
  const [loading, setLoading] = useState(true);
  const [liveUpdates, setLiveUpdates] = useState(true);

  // Real-time subscriptions
  useEffect(() => {
    if (!liveUpdates) return;

    const ticketsSubscription = supabase
      .channel('admin-tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        fetchTickets();
        fetchStats();
        toast({
          title: "Live Update",
          description: "New ticket data received",
        });
      })
      .subscribe();

    const usersSubscription = supabase
      .channel('admin-users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchUsers();
        fetchStats();
        toast({
          title: "Live Update", 
          description: "New user registration",
        });
      })
      .subscribe();

    const referralsSubscription = supabase
      .channel('admin-referrals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, () => {
        fetchReferrals();
        fetchStats();
        toast({
          title: "Live Update",
          description: "New referral activity",
        });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ticketsSubscription);
      supabase.removeChannel(usersSubscription);
      supabase.removeChannel(referralsSubscription);
    };
  }, [liveUpdates]);

  // Initial data fetch
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    await Promise.all([
      fetchStats(),
      fetchTickets(),
      fetchUsers(),
      fetchReferrals(),
      fetchDraws(),
      fetchRevenueData()
    ]);
    setLoading(false);
  };

  const fetchStats = async () => {
    try {
      // Get comprehensive ticket statistics
      const { data: ticketStats } = await supabase
        .from('tickets')
        .select('ticket_type, amount, created_at');

      if (ticketStats) {
        const totalRevenue = ticketStats.reduce((sum, ticket) => sum + ticket.amount, 0);
        const ticket3Count = ticketStats.filter(t => t.ticket_type === 'paid_3').length;
        const ticket5Count = ticketStats.filter(t => t.ticket_type === 'paid_5').length;
        const freeTickets = ticketStats.filter(t => t.ticket_type.startsWith('free')).length;

        // Calculate time-based revenue
        const today = startOfDay(new Date());
        const weekAgo = subDays(today, 7);
        const monthAgo = subDays(today, 30);

        const todayRevenue = ticketStats
          .filter(t => new Date(t.created_at) >= today)
          .reduce((sum, ticket) => sum + ticket.amount, 0);

        const weeklyRevenue = ticketStats
          .filter(t => new Date(t.created_at) >= weekAgo)
          .reduce((sum, ticket) => sum + ticket.amount, 0);

        const monthlyRevenue = ticketStats
          .filter(t => new Date(t.created_at) >= monthAgo)
          .reduce((sum, ticket) => sum + ticket.amount, 0);

        const avgTicketValue = totalRevenue / (ticket3Count + ticket5Count || 1);

        // Get user count
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Get referral count and conversion rate
        const { count: referralCount } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true });

        const conversionRate = userCount ? (referralCount || 0) / userCount * 100 : 0;

        setStats({
          totalRevenue,
          totalTickets: ticketStats.length,
          totalUsers: userCount || 0,
          totalReferrals: referralCount || 0,
          ticket3Count,
          ticket5Count,
          freeTickets,
          todayRevenue,
          weeklyRevenue,
          monthlyRevenue,
          avgTicketValue,
          conversionRate
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard statistics",
        variant: "destructive"
      });
    }
  };

  const fetchTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          user:users(*)
        `)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchReferrals = async () => {
    try {
      const { data, error } = await supabase
        .from('referrals')
        .select(`
          *,
          referrer:referrer_id(full_name, email),
          referee:referee_id(full_name, email)
        `)
        .order('created_at', { ascending: false })
        .limit(200);

      if (error) throw error;
      setReferrals(data || []);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const fetchDraws = async () => {
    try {
      const { data, error } = await supabase
        .from('draws')
        .select(`
          *,
          winner:users(*),
          winning_ticket:tickets(*)
        `)
        .order('draw_date', { ascending: false })
        .limit(50);

      if (error) throw error;
      setDraws(data || []);
    } catch (error) {
      console.error('Error fetching draws:', error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_revenue')
        .select('*')
        .order('date', { ascending: false })
        .limit(60);

      if (error) throw error;
      setRevenueData(data || []);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const exportData = async (table: string) => {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*');

      if (error) throw error;

      const csv = convertToCSV(data);
      downloadCSV(csv, `${table}_export_${format(new Date(), 'yyyy-MM-dd')}.csv`);
      
      toast({
        title: "Export Successful",
        description: `${table} data exported successfully`
      });
    } catch (error) {
      console.error('Error exporting data:', error);
      toast({
        title: "Export Failed",
        description: "Failed to export data",
        variant: "destructive"
      });
    }
  };

  const convertToCSV = (data: any[]) => {
    if (!data.length) return '';
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' ? `"${value}"` : value
      ).join(',')
    );
    
    return [headers, ...rows].join('\n');
  };

  const downloadCSV = (csv: string, filename: string) => {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
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
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      active: "default",
      completed: "secondary",
      pending: "outline",
      won: "default",
      expired: "destructive"
    };
    
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <AdminRoute>
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-secondary-foreground">Loading comprehensive admin dashboard...</p>
          </div>
        </div>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-background">
        {/* Admin Header */}
        <header className="glass border-b border-accent/20 sticky top-0 z-50">
          <div className="container-premium">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <Shield className="w-8 h-8 text-primary" />
                <div>
                  <h1 className="text-xl font-display font-bold">BigMoney Admin</h1>
                  <p className="text-xs text-secondary-foreground">Administrative Dashboard</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-sm text-secondary-foreground">
                  Welcome, {user?.email}
                </div>
                <PremiumButton variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </PremiumButton>
              </div>
            </div>
          </div>
        </header>
        
        <main className="pt-8 pb-16">
        <div className="container-premium">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div>
              <h2 className="text-3xl font-display font-bold mb-2">Real-Time Analytics</h2>
              <p className="text-secondary-foreground">
                Live data updates, user management, and comprehensive sweepstakes oversight
              </p>
            </div>
            <div className="flex items-center gap-3 mt-4 lg:mt-0">
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${liveUpdates ? 'bg-success animate-pulse' : 'bg-secondary'}`}></div>
                <span className="text-sm text-secondary-foreground">
                  {liveUpdates ? 'Live Updates ON' : 'Live Updates OFF'}
                </span>
              </div>
              <PremiumButton 
                variant="outline" 
                size="sm"
                onClick={() => setLiveUpdates(!liveUpdates)}
              >
                {liveUpdates ? 'Disable' : 'Enable'} Live Updates
              </PremiumButton>
              <PremiumButton variant="outline" size="sm" onClick={fetchAllData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh All
              </PremiumButton>
            </div>
          </div>

          {/* Enhanced Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient-gold">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <div className="flex items-center space-x-4 text-xs text-secondary-foreground mt-2">
                  <span>Today: ${stats.todayRevenue.toLocaleString()}</span>
                  <span>Week: ${stats.weeklyRevenue.toLocaleString()}</span>
                </div>
                <div className="text-xs text-accent mt-1">
                  Avg ticket: ${stats.avgTicketValue.toFixed(2)}
                </div>
              </CardContent>
            </Card>

            <Card className="glass hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <TicketIcon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTickets.toLocaleString()}</div>
                <div className="flex items-center space-x-4 text-xs text-secondary-foreground mt-2">
                  <span>Paid: {(stats.ticket3Count + stats.ticket5Count).toLocaleString()}</span>
                  <span>Free: {stats.freeTickets.toLocaleString()}</span>
                </div>
                <div className="text-xs text-accent mt-1">
                  {Math.round((stats.freeTickets / stats.totalTickets) * 100)}% free entries
                </div>
              </CardContent>
            </Card>

            <Card className="glass hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-xs text-secondary-foreground mt-2">
                  Registered participants
                </div>
                <div className="text-xs text-accent mt-1">
                  {Math.round(stats.conversionRate)}% referral rate
                </div>
              </CardContent>
            </Card>

            <Card className="glass hover-lift">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                <Gift className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReferrals.toLocaleString()}</div>
                <div className="text-xs text-secondary-foreground mt-2">
                  Total referral conversions
                </div>
                <div className="text-xs text-accent mt-1">
                  ${(stats.totalReferrals * 5).toLocaleString()} free value
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Revenue Trend Chart */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <RevenueChart />
            </div>

            <Card className="glass">
              <CardHeader>
                <CardTitle>Live Activity Feed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {tickets.slice(0, 8).map((ticket, index) => (
                    <div key={ticket.id} className="flex items-center space-x-3 p-2 bg-surface/30 rounded">
                      <div className={`w-2 h-2 rounded-full ${
                        ticket.ticket_type.startsWith('free') ? 'bg-success' : 'bg-primary'
                      }`}></div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {getTicketTypeLabel(ticket.ticket_type)}
                        </div>
                        <div className="text-xs text-secondary-foreground">
                          {format(new Date(ticket.created_at), 'MMM d, HH:mm')}
                        </div>
                      </div>
                      <div className="text-sm font-semibold">
                        ${ticket.amount}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Tabs */}
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="tickets">Tickets ({stats.totalTickets})</TabsTrigger>
              <TabsTrigger value="users">Users ({stats.totalUsers})</TabsTrigger>
              <TabsTrigger value="referrals">Referrals ({stats.totalReferrals})</TabsTrigger>
              <TabsTrigger value="draws">Draws</TabsTrigger>
              <TabsTrigger value="revenue">Revenue Analytics</TabsTrigger>
            </TabsList>

            {/* Tickets Tab */}
            <TabsContent value="tickets">
              <Card className="glass">
                <CardHeader>
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <CardTitle>Ticket Management</CardTitle>
                      <CardDescription>All ticket purchases and free entries with real-time updates</CardDescription>
                    </div>
                    <div className="flex items-center gap-3 mt-4 lg:mt-0">
                      <div className="grid grid-cols-3 gap-2 text-xs">
                        <div className="bg-primary/20 px-2 py-1 rounded text-center">
                          <div className="font-bold">{stats.ticket3Count}</div>
                          <div>$3 Tickets</div>
                        </div>
                        <div className="bg-success/20 px-2 py-1 rounded text-center">
                          <div className="font-bold">{stats.ticket5Count}</div>
                          <div>$5 Tickets</div>
                        </div>
                        <div className="bg-accent/20 px-2 py-1 rounded text-center">
                          <div className="font-bold">{stats.freeTickets}</div>
                          <div>Free</div>
                        </div>
                      </div>
                      <PremiumButton variant="outline" size="sm" onClick={() => exportData('tickets')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export CSV
                      </PremiumButton>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-accent/20">
                          <th className="text-left py-3 text-sm font-medium">Entry #</th>
                          <th className="text-left py-3 text-sm font-medium">User</th>
                          <th className="text-left py-3 text-sm font-medium">Type</th>
                          <th className="text-left py-3 text-sm font-medium">Amount</th>
                          <th className="text-left py-3 text-sm font-medium">Draw</th>
                          <th className="text-left py-3 text-sm font-medium">Status</th>
                          <th className="text-left py-3 text-sm font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {tickets.map((ticket) => (
                          <tr key={ticket.id} className="hover:bg-surface/30">
                            <td className="py-3 text-sm font-mono">{ticket.entry_number}</td>
                            <td className="py-3 text-sm">{ticket.user?.full_name || 'Unknown'}</td>
                            <td className="py-3">
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                ticket.ticket_type.startsWith('free') 
                                  ? 'bg-success/20 text-success' 
                                  : 'bg-primary/20 text-primary'
                              }`}>
                                {getTicketTypeLabel(ticket.ticket_type)}
                              </span>
                            </td>
                            <td className="py-3 text-sm font-semibold">
                              {ticket.amount > 0 ? `$${ticket.amount}` : 'FREE'}
                            </td>
                            <td className="py-3 text-sm">${ticket.draw_type}</td>
                            <td className="py-3">{getStatusBadge(ticket.status)}</td>
                            <td className="py-3 text-sm text-secondary-foreground">
                              {format(new Date(ticket.created_at), 'MMM d, yyyy HH:mm')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card className="glass">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>User Management</CardTitle>
                      <CardDescription>Registered users and their activity</CardDescription>
                    </div>
                    <PremiumButton variant="outline" size="sm" onClick={() => exportData('users')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Users
                    </PremiumButton>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-accent/20">
                          <th className="text-left py-3 text-sm font-medium">Name</th>
                          <th className="text-left py-3 text-sm font-medium">Email</th>
                          <th className="text-left py-3 text-sm font-medium">Phone</th>
                          <th className="text-left py-3 text-sm font-medium">Referral Code</th>
                          <th className="text-left py-3 text-sm font-medium">Joined</th>
                          <th className="text-left py-3 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {users.map((user) => (
                          <tr key={user.id} className="hover:bg-surface/30">
                            <td className="py-3 text-sm font-medium">{user.full_name}</td>
                            <td className="py-3 text-sm">{user.email}</td>
                            <td className="py-3 text-sm">{user.phone || 'N/A'}</td>
                            <td className="py-3 text-sm font-mono text-accent">{user.referral_code}</td>
                            <td className="py-3 text-sm text-secondary-foreground">
                              {format(new Date(user.created_at), 'MMM d, yyyy')}
                            </td>
                            <td className="py-3">
                              <PremiumButton variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </PremiumButton>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals">
              <Card className="glass">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Referral Analytics</CardTitle>
                      <CardDescription>Track referral performance and conversions</CardDescription>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-sm text-secondary-foreground">
                        Conversion Rate: {stats.conversionRate.toFixed(1)}%
                      </div>
                      <PremiumButton variant="outline" size="sm" onClick={() => exportData('referrals')}>
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </PremiumButton>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-primary">{stats.totalReferrals}</div>
                      <div className="text-sm text-secondary-foreground">Total Referrals</div>
                    </div>
                    <div className="bg-success/10 border border-success/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-success">
                        ${(stats.totalReferrals * 5).toLocaleString()}
                      </div>
                      <div className="text-sm text-secondary-foreground">Free Value Generated</div>
                    </div>
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 text-center">
                      <div className="text-2xl font-bold text-accent">
                        {referrals.filter(r => r.status === 'completed').length}
                      </div>
                      <div className="text-sm text-secondary-foreground">Successful Conversions</div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-accent/20">
                          <th className="text-left py-3 text-sm font-medium">Referrer</th>
                          <th className="text-left py-3 text-sm font-medium">Referee</th>
                          <th className="text-left py-3 text-sm font-medium">Code</th>
                          <th className="text-left py-3 text-sm font-medium">Status</th>
                          <th className="text-left py-3 text-sm font-medium">Date</th>
                          <th className="text-left py-3 text-sm font-medium">Reward</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {referrals.map((referral) => (
                          <tr key={referral.id} className="hover:bg-surface/30">
                            <td className="py-3 text-sm">{referral.referrer?.full_name || 'Unknown'}</td>
                            <td className="py-3 text-sm">{referral.referee?.full_name || 'Unknown'}</td>
                            <td className="py-3 text-sm font-mono text-accent">{referral.referral_code}</td>
                            <td className="py-3">{getStatusBadge(referral.status)}</td>
                            <td className="py-3 text-sm text-secondary-foreground">
                              {format(new Date(referral.created_at), 'MMM d, yyyy')}
                            </td>
                            <td className="py-3 text-sm">
                              {referral.reward_ticket_id ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <Clock className="w-4 h-4 text-warning" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Draws Tab */}
            <TabsContent value="draws">
              <Card className="glass">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Draw Management</CardTitle>
                      <CardDescription>Past and upcoming draws with verification data</CardDescription>
                    </div>
                    <PremiumButton variant="outline" size="sm" onClick={() => exportData('draws')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export Draws
                    </PremiumButton>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-accent/20">
                          <th className="text-left py-3 text-sm font-medium">Prize</th>
                          <th className="text-left py-3 text-sm font-medium">Date</th>
                          <th className="text-left py-3 text-sm font-medium">Entries</th>
                          <th className="text-left py-3 text-sm font-medium">Winner</th>
                          <th className="text-left py-3 text-sm font-medium">Status</th>
                          <th className="text-left py-3 text-sm font-medium">Verification</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {draws.map((draw) => (
                          <tr key={draw.id} className="hover:bg-surface/30">
                            <td className="py-3 text-sm font-semibold">${draw.draw_type}</td>
                            <td className="py-3 text-sm">
                              {format(new Date(draw.draw_date), 'MMM d, yyyy')}
                            </td>
                            <td className="py-3 text-sm">{draw.total_entries.toLocaleString()}</td>
                            <td className="py-3 text-sm">
                              {draw.winner?.full_name || 'TBD'}
                            </td>
                            <td className="py-3">{getStatusBadge(draw.status)}</td>
                            <td className="py-3">
                              {draw.participants_hash ? (
                                <CheckCircle className="w-4 h-4 text-success" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-warning" />
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Revenue Tab */}
            <TabsContent value="revenue">
              <div className="space-y-6">
                <Card className="glass">
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                    <CardDescription>Detailed financial analytics and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-4 gap-6 mb-8">
                      <div className="glass p-4 rounded-lg text-center">
                        <div className="text-sm text-secondary-foreground mb-1">$3 Tickets</div>
                        <div className="text-2xl font-bold text-primary">{stats.ticket3Count}</div>
                        <div className="text-sm text-secondary-foreground">
                          ${(stats.ticket3Count * 3).toLocaleString()} revenue
                        </div>
                      </div>
                      <div className="glass p-4 rounded-lg text-center">
                        <div className="text-sm text-secondary-foreground mb-1">$5 Tickets</div>
                        <div className="text-2xl font-bold text-success">{stats.ticket5Count}</div>
                        <div className="text-sm text-secondary-foreground">
                          ${(stats.ticket5Count * 5).toLocaleString()} revenue
                        </div>
                      </div>
                      <div className="glass p-4 rounded-lg text-center">
                        <div className="text-sm text-secondary-foreground mb-1">Free Tickets</div>
                        <div className="text-2xl font-bold text-accent">{stats.freeTickets}</div>
                        <div className="text-sm text-secondary-foreground">
                          Quiz + Referrals
                        </div>
                      </div>
                      <div className="glass p-4 rounded-lg text-center">
                        <div className="text-sm text-secondary-foreground mb-1">Avg Ticket</div>
                        <div className="text-2xl font-bold text-warning">${stats.avgTicketValue.toFixed(2)}</div>
                        <div className="text-sm text-secondary-foreground">
                          Per purchase
                        </div>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-accent/20">
                            <th className="text-left py-3 text-sm font-medium">Date</th>
                            <th className="text-left py-3 text-sm font-medium">$3 Count</th>
                            <th className="text-left py-3 text-sm font-medium">$5 Count</th>
                            <th className="text-left py-3 text-sm font-medium">$3 Revenue</th>
                            <th className="text-left py-3 text-sm font-medium">$5 Revenue</th>
                            <th className="text-left py-3 text-sm font-medium">Total</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-accent/10">
                          {revenueData.map((revenue) => (
                            <tr key={revenue.date} className="hover:bg-surface/30">
                              <td className="py-3 text-sm">
                                {format(new Date(revenue.date), 'MMM d, yyyy')}
                              </td>
                              <td className="py-3 text-sm">{revenue.ticket_3_count}</td>
                              <td className="py-3 text-sm">{revenue.ticket_5_count}</td>
                              <td className="py-3 text-sm font-semibold">
                                ${revenue.ticket_3_revenue.toLocaleString()}
                              </td>
                              <td className="py-3 text-sm font-semibold">
                                ${revenue.ticket_5_revenue.toLocaleString()}
                              </td>
                              <td className="py-3 text-sm font-bold text-primary">
                                ${revenue.total_revenue.toLocaleString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        </main>
      </div>
    </AdminRoute>
  );
}