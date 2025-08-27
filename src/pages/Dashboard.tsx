import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Copy, Share, Trophy, Clock, Users, Ticket } from "lucide-react";

export default function Dashboard() {
  const firstName = "Alex"; // TODO: Replace with actual user data
  const referralCode = "BM-ALX789"; // TODO: Replace with actual referral code

  const stats = [
    { label: "Paid Entries", value: "3", icon: Ticket, color: "text-primary" },
    { label: "Free Entries", value: "1", icon: Trophy, color: "text-success" },
    { label: "Referrals Converted", value: "0", icon: Users, color: "text-accent" },
    { label: "Total Entries This Period", value: "4", icon: Clock, color: "text-warning" },
  ];

  const activeEntries = [
    { id: "BM-2025-001", type: "$3", drawDate: "Jan 20, 2025", status: "Queued", created: "Jan 5, 2025" },
    { id: "BM-2025-002", type: "$5", drawDate: "Jan 30, 2025", status: "Queued", created: "Jan 8, 2025" },
    { id: "BM-2025-003", type: "$3", drawDate: "Jan 20, 2025", status: "Queued", created: "Jan 10, 2025" },
    { id: "BM-2025-004", type: "Free", drawDate: "Jan 20, 2025", status: "Queued", created: "Jan 12, 2025" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24 pb-16">
        <div className="container-premium">
          {/* Welcome Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-4">
              Welcome, {firstName}.
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
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-lg p-6 text-center">
                <stat.icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-secondary-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Active Entries */}
            <div className="lg:col-span-2">
              <div className="glass rounded-lg p-6">
                <h3 className="text-xl font-display font-semibold mb-6">Active Entries</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-accent/20">
                        <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Entry #</th>
                        <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Type</th>
                        <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Draw Date</th>
                        <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Status</th>
                        <th className="text-left py-3 text-sm font-medium text-secondary-foreground">Created</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent/10">
                      {activeEntries.map((entry) => (
                        <tr key={entry.id}>
                          <td className="py-3 text-sm font-mono">{entry.id}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              entry.type === 'Free' 
                                ? 'bg-success/20 text-success' 
                                : 'bg-primary/20 text-primary'
                            }`}>
                              {entry.type}
                            </span>
                          </td>
                          <td className="py-3 text-sm">{entry.drawDate}</td>
                          <td className="py-3">
                            <span className="px-2 py-1 text-xs bg-warning/20 text-warning rounded-full">
                              {entry.status}
                            </span>
                          </td>
                          <td className="py-3 text-sm text-secondary-foreground">{entry.created}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Referral Card */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Your Referral Link</h3>
                
                <div className="space-y-4">
                  <div className="p-3 bg-surface/50 rounded-lg border border-accent/20">
                    <div className="text-xs text-secondary-foreground mb-1">Your Link</div>
                    <div className="text-sm font-mono break-all">
                      bigmoney.com/referral/{referralCode}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <PremiumButton variant="glass" size="sm" className="flex-1">
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </PremiumButton>
                    <PremiumButton variant="glass" size="sm" className="flex-1">
                      <Share className="w-4 h-4 mr-2" />
                      Share
                    </PremiumButton>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="text-sm text-secondary-foreground">Progress to next free ticket:</div>
                    <div className="w-full bg-surface/50 rounded-full h-2">
                      <div className="bg-gradient-to-r from-primary to-accent h-2 rounded-full w-0"></div>
                    </div>
                    <div className="text-xs text-secondary-foreground">0/1 referrals</div>
                  </div>
                  
                  <p className="text-xs text-secondary-foreground">
                    Share with friends who love sweepstakes.
                  </p>
                </div>
              </div>

              {/* Quiz Status */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Free Entry Quiz</h3>
                
                <div className="space-y-4">
                  <div className="text-sm text-secondary-foreground">
                    Last attempt: <span className="text-success">Passed</span>
                  </div>
                  
                  <div className="text-sm text-secondary-foreground">
                    Next attempt available in: <span className="text-primary font-medium">23h 45m</span>
                  </div>
                  
                  <PremiumButton variant="outline" size="sm" className="w-full" disabled>
                    Take Quiz (Cooldown)
                  </PremiumButton>
                  
                  <p className="text-xs text-secondary-foreground">
                    Answer all questions correctly to earn a free ticket.
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="glass rounded-lg p-6">
                <h3 className="text-lg font-display font-semibold mb-4">Quick Actions</h3>
                
                <div className="space-y-3">
                  <PremiumButton variant="gold" size="sm" className="w-full">
                    Buy More Tickets
                  </PremiumButton>
                  
                  <PremiumButton variant="glass" size="sm" className="w-full">
                    View Winners
                  </PremiumButton>
                  
                  <PremiumButton variant="outline" size="sm" className="w-full">
                    Official Rules
                  </PremiumButton>
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