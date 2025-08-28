import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
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
  Calendar,
  Eye,
  Download,
  RefreshCw,
  Trophy,
  Gift
} from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface DashboardStats {
  totalRevenue: number;
  totalTickets: number;
  totalUsers: number;
  totalReferrals: number;
  ticket3Count: number;
  ticket5Count: number;
  freeTickets: number;
  todayRevenue: number;
}

export default function Admin() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalTickets: 0,
    totalUsers: 0,
    totalReferrals: 0,
    ticket3Count: 0,
    ticket5Count: 0,
    freeTickets: 0,
    todayRevenue: 0
  });
  
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [draws, setDraws] = useState<Draw[]>([]);
  const [revenueData, setRevenueData] = useState<Revenue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Real-time subscriptions
  useEffect(() => {
    const ticketsSubscription = supabase
      .channel('tickets')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tickets' }, () => {
        fetchTickets();
        fetchStats();
      })
      .subscribe();

    const usersSubscription = supabase
      .channel('users')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, () => {
        fetchUsers();
        fetchStats();
      })
      .subscribe();

    const referralsSubscription = supabase
      .channel('referrals')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, () => {
        fetchReferrals();
        fetchStats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(ticketsSubscription);
      supabase.removeChannel(usersSubscription);
      supabase.removeChannel(referralsSubscription);
    };
  }, []);

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
      // Get total revenue and ticket counts
      const { data: ticketStats } = await supabase
        .from('tickets')
        .select('ticket_type, amount');

      if (ticketStats) {
        const totalRevenue = ticketStats.reduce((sum, ticket) => sum + ticket.amount, 0);
        const ticket3Count = ticketStats.filter(t => t.ticket_type === 'paid_3').length;
        const ticket5Count = ticketStats.filter(t => t.ticket_type === 'paid_5').length;
        const freeTickets = ticketStats.filter(t => t.ticket_type.startsWith('free')).length;

        // Get today's revenue
        const today = new Date().toISOString().split('T')[0];
        const { data: todayTickets } = await supabase
          .from('tickets')
          .select('amount')
          .gte('created_at', today)
          .lt('created_at', new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

        const todayRevenue = todayTickets?.reduce((sum, ticket) => sum + ticket.amount, 0) || 0;

        // Get user count
        const { count: userCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });

        // Get referral count
        const { count: referralCount } = await supabase
          .from('referrals')
          .select('*', { count: 'exact', head: true });

        setStats({
          totalRevenue,
          totalTickets: ticketStats.length,
          totalUsers: userCount || 0,
          totalReferrals: referralCount || 0,
          ticket3Count,
          ticket5Count,
          freeTickets,
          todayRevenue
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
        .limit(100);

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
        .limit(100);

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
        .limit(100);

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
        .limit(30);

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
      downloadCSV(csv, `${table}_export_${new Date().toISOString().split('T')[0]}.csv`);
      
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
      won: "default"
    };
    
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-secondary-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-premium">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-display font-bold mb-2">Admin Dashboard</h1>
              <p className="text-secondary-foreground">Real-time BigMoney analytics and management</p>
            </div>
            <div className="flex gap-3">
              <PremiumButton variant="outline" onClick={fetchAllData}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </PremiumButton>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-3 py-2 glass rounded-lg border border-accent/30 focus:border-accent focus:outline-none"
              />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <DollarSign className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gradient-gold">
                  ${stats.totalRevenue.toLocaleString()}
                </div>
                <p className="text-xs text-secondary-foreground">
                  Today: ${stats.todayRevenue.toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Tickets</CardTitle>
                <TicketIcon className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalTickets.toLocaleString()}</div>
                <p className="text-xs text-secondary-foreground">
                  Paid: {stats.ticket3Count + stats.ticket5Count} | Free: {stats.freeTickets}
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-secondary-foreground">
                  Registered participants
                </p>
              </CardContent>
            </Card>

            <Card className="glass">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Referrals</CardTitle>
                <Gift className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalReferrals.toLocaleString()}</div>
                <p className="text-xs text-secondary-foreground">
                  Total referral conversions
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="tickets" className="space-y-6">
            <TabsList className="glass">
              <TabsTrigger value="tickets">Tickets</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="draws">Draws</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            {/* Tickets Tab */}
            <TabsContent value="tickets">
              <Card className="glass">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Recent Tickets</CardTitle>
                      <CardDescription>Latest ticket purchases and entries</CardDescription>
                    </div>
                    <PremiumButton variant="outline" onClick={() => exportData('tickets')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </PremiumButton>
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
                          <tr key={ticket.id}>
                            <td className="py-3 text-sm font-mono">{ticket.entry_number}</td>
                            <td className="py-3 text-sm">{ticket.user?.full_name || 'Unknown'}</td>
                            <td className="py-3 text-sm">{getTicketTypeLabel(ticket.ticket_type)}</td>
                            <td className="py-3 text-sm font-semibold">${ticket.amount}</td>
                            <td className="py-3 text-sm">${ticket.draw_type}</td>
                            <td className="py-3">{getStatusBadge(ticket.status)}</td>
                            <td className="py-3 text-sm text-secondary-foreground">
                              {new Date(ticket.created_at).toLocaleDateString()}
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
                      <CardTitle>Registered Users</CardTitle>
                      <CardDescription>Platform user management</CardDescription>
                    </div>
                    <PremiumButton variant="outline" onClick={() => exportData('users')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
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
                          <th className="text-left py-3 text-sm font-medium">Joined</th>
                          <th className="text-left py-3 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {users.map((user) => (
                          <tr key={user.id}>
                            <td className="py-3 text-sm font-medium">{user.full_name}</td>
                            <td className="py-3 text-sm">{user.email}</td>
                            <td className="py-3 text-sm">{user.phone || 'N/A'}</td>
                            <td className="py-3 text-sm text-secondary-foreground">
                              {new Date(user.created_at).toLocaleDateString()}
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
                      <CardTitle>Referral Activity</CardTitle>
                      <CardDescription>Track referral conversions and rewards</CardDescription>
                    </div>
                    <PremiumButton variant="outline" onClick={() => exportData('referrals')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </PremiumButton>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-accent/20">
                          <th className="text-left py-3 text-sm font-medium">Referrer</th>
                          <th className="text-left py-3 text-sm font-medium">Referee</th>
                          <th className="text-left py-3 text-sm font-medium">Code</th>
                          <th className="text-left py-3 text-sm font-medium">Status</th>
                          <th className="text-left py-3 text-sm font-medium">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {referrals.map((referral) => (
                          <tr key={referral.id}>
                            <td className="py-3 text-sm">{referral.referrer?.full_name || 'Unknown'}</td>
                            <td className="py-3 text-sm">{referral.referee?.full_name || 'Unknown'}</td>
                            <td className="py-3 text-sm font-mono">{referral.referral_code}</td>
                            <td className="py-3">{getStatusBadge(referral.status)}</td>
                            <td className="py-3 text-sm text-secondary-foreground">
                              {new Date(referral.created_at).toLocaleDateString()}
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
                      <CardTitle>Draw History</CardTitle>
                      <CardDescription>Past and upcoming draws</CardDescription>
                    </div>
                    <PremiumButton variant="outline" onClick={() => exportData('draws')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
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
                          <th className="text-left py-3 text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {draws.map((draw) => (
                          <tr key={draw.id}>
                            <td className="py-3 text-sm font-semibold">${draw.draw_type}</td>
                            <td className="py-3 text-sm">
                              {new Date(draw.draw_date).toLocaleDateString()}
                            </td>
                            <td className="py-3 text-sm">{draw.total_entries}</td>
                            <td className="py-3 text-sm">
                              {draw.winner?.full_name || 'TBD'}
                            </td>
                            <td className="py-3">{getStatusBadge(draw.status)}</td>
                            <td className="py-3">
                              <PremiumButton variant="outline" size="sm">
                                <Trophy className="w-4 h-4" />
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

            {/* Revenue Tab */}
            <TabsContent value="revenue">
              <Card className="glass">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Revenue Analytics</CardTitle>
                      <CardDescription>Daily revenue breakdown and trends</CardDescription>
                    </div>
                    <PremiumButton variant="outline" onClick={() => exportData('daily_revenue')}>
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </PremiumButton>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-secondary-foreground mb-1">$3 Tickets</div>
                      <div className="text-2xl font-bold text-primary">{stats.ticket3Count}</div>
                      <div className="text-sm text-secondary-foreground">
                        ${(stats.ticket3Count * 3).toLocaleString()} revenue
                      </div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-secondary-foreground mb-1">$5 Tickets</div>
                      <div className="text-2xl font-bold text-primary">{stats.ticket5Count}</div>
                      <div className="text-sm text-secondary-foreground">
                        ${(stats.ticket5Count * 5).toLocaleString()} revenue
                      </div>
                    </div>
                    <div className="glass p-4 rounded-lg">
                      <div className="text-sm text-secondary-foreground mb-1">Free Tickets</div>
                      <div className="text-2xl font-bold text-success">{stats.freeTickets}</div>
                      <div className="text-sm text-secondary-foreground">
                        Quiz + Referrals
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-accent/20">
                          <th className="text-left py-3 text-sm font-medium">Date</th>
                          <th className="text-left py-3 text-sm font-medium">$3 Tickets</th>
                          <th className="text-left py-3 text-sm font-medium">$5 Tickets</th>
                          <th className="text-left py-3 text-sm font-medium">$3 Revenue</th>
                          <th className="text-left py-3 text-sm font-medium">$5 Revenue</th>
                          <th className="text-left py-3 text-sm font-medium">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-accent/10">
                        {revenueData.map((revenue) => (
                          <tr key={revenue.id}>
                            <td className="py-3 text-sm">
                              {new Date(revenue.date).toLocaleDateString()}
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
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}