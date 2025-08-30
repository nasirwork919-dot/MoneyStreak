import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { BarChart3, TrendingUp, DollarSign } from 'lucide-react';

interface RevenueData {
  date: string;
  ticket_3_revenue: number;
  ticket_5_revenue: number;
  total_revenue: number;
  ticket_3_count: number;
  ticket_5_count: number;
}

export function RevenueChart() {
  const [revenueData, setRevenueData] = useState<RevenueData[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);

  useEffect(() => {
    fetchRevenueData();
    
    // Set up real-time subscription
    const subscription = supabase
      .channel('revenue-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'daily_revenue' }, () => {
        fetchRevenueData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchRevenueData = async () => {
    try {
      const { data, error } = await supabase
        .from('daily_revenue')
        .select('*')
        .order('date', { ascending: false })
        .limit(30);

      if (error) throw error;

      setRevenueData(data || []);
      
      // Calculate totals
      const total = data?.reduce((sum, day) => sum + day.total_revenue, 0) || 0;
      const today = data?.find(day => day.date === new Date().toISOString().split('T')[0])?.total_revenue || 0;
      
      setTotalRevenue(total);
      setTodayRevenue(today);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setLoading(false);
    }
  };

  const maxRevenue = Math.max(...revenueData.map(d => d.total_revenue), 1);

  if (loading) {
    return (
      <div className="glass rounded-lg p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-surface/50 rounded mb-4"></div>
          <div className="h-64 bg-surface/50 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-display font-semibold mb-2">Revenue Trends (Last 30 Days)</h3>
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <DollarSign className="w-4 h-4 text-primary" />
              <span className="text-secondary-foreground">Total: ${totalRevenue.toLocaleString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-success" />
              <span className="text-secondary-foreground">Today: ${todayRevenue.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <BarChart3 className="w-8 h-8 text-primary" />
      </div>

      {revenueData.length > 0 ? (
        <div className="space-y-3">
          {revenueData.slice(0, 15).map((day, index) => (
            <div key={day.date} className="flex items-center space-x-4">
              <div className="text-xs text-secondary-foreground w-20">
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              
              <div className="flex-1 flex items-center space-x-2">
                {/* $3 Tickets Bar */}
                <div className="flex-1 bg-surface/50 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all duration-500"
                    style={{ width: `${(day.ticket_3_revenue / maxRevenue) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    ${day.ticket_3_revenue}
                  </div>
                </div>
                
                {/* $5 Tickets Bar */}
                <div className="flex-1 bg-surface/50 rounded-full h-6 relative overflow-hidden">
                  <div 
                    className="bg-success h-full rounded-full transition-all duration-500"
                    style={{ width: `${(day.ticket_5_revenue / maxRevenue) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center text-xs font-medium">
                    ${day.ticket_5_revenue}
                  </div>
                </div>
              </div>
              
              <div className="text-sm font-semibold text-primary w-20 text-right">
                ${day.total_revenue}
              </div>
            </div>
          ))}
          
          <div className="flex items-center justify-center space-x-6 pt-4 border-t border-accent/20 text-xs">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-secondary-foreground">$3 Tickets</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-success rounded-full"></div>
              <span className="text-secondary-foreground">$5 Tickets</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-secondary-foreground mx-auto mb-4" />
          <p className="text-secondary-foreground">No revenue data available</p>
        </div>
      )}
    </div>
  );
}