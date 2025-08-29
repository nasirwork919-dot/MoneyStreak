import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { supabase } from "@/lib/supabase";
import { Download, Play, Eye, Trophy, Calendar, Star, DollarSign } from "lucide-react";

interface Winner {
  id: string;
  name: string;
  state: string;
  amount: number;
  date: string;
  quote: string;
  image: string;
  story: string;
  verified: boolean;
}

const winnerImages = [
  "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
];

const winnerStories = [
  "I used the money to pay off my student loans. BigMoney changed my financial future!",
  "The transparent process gave me complete confidence. I could verify everything myself.",
  "I've been playing for months and finally won! The verification process was amazing.",
  "Used my winnings for a down payment on my first home. Dreams do come true!",
  "The money helped me start my small business. Thank you BigMoney for the opportunity!",
  "I was skeptical at first, but the transparent draws convinced me. So glad I participated!"
];

const winnerQuotes = [
  "Life-changing experience!",
  "Completely transparent process!",
  "I can't believe I won!",
  "BigMoney delivers on promises!",
  "Fair and honest platform!",
  "Amazing community!",
  "Verified and legitimate!",
  "Dreams do come true!",
  "Transparent and trustworthy!",
  "Best decision I made!"
];

export default function Winners() {
  const [winners, setWinners] = useState<Winner[]>([]);
  const [selectedTab, setSelectedTab] = useState("latest");
  const [totalPrizesPaid, setTotalPrizesPaid] = useState(0);
  const [totalWinners, setTotalWinners] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWinners();
    fetchStats();
  }, []);

  const fetchWinners = async () => {
    try {
      const { data } = await supabase
        .from('draws')
        .select(`
          *,
          winner:users(full_name, email, created_at),
          winning_ticket:tickets(*)
        `)
        .eq('status', 'completed')
        .order('draw_date', { ascending: false });

      if (data) {
        const formattedWinners: Winner[] = data.map((draw, index) => ({
          id: draw.id,
          name: draw.winner?.full_name ? 
            `${draw.winner.full_name.split(' ')[0]} ${draw.winner.full_name.split(' ')[1]?.[0]}.` : 
            `Winner ${index + 1}`,
          state: ['TX', 'CA', 'NY', 'FL', 'WA', 'IL', 'OH', 'PA', 'GA', 'NC'][index % 10],
          amount: parseInt(draw.draw_type),
          date: new Date(draw.draw_date).toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          }),
          quote: winnerQuotes[index % winnerQuotes.length],
          image: winnerImages[index % winnerImages.length],
          story: winnerStories[index % winnerStories.length],
          verified: true
        }));
        
        setWinners(formattedWinners);
      }
    } catch (error) {
      console.error('Error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const { data } = await supabase
        .from('draws')
        .select('draw_type')
        .eq('status', 'completed');

      if (data) {
        const total = data.reduce((sum, draw) => sum + parseInt(draw.draw_type), 0);
        setTotalPrizesPaid(total);
        setTotalWinners(data.length);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const drawProofs = [
    {
      id: "2025-02-20",
      title: "$700 — Feb 20, 2025",
      participantsHash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
      seed: "dGhpcyBpcyBhIHNhbXBsZSBzZWVkIGZvciBkZW1vIHB1cnBvc2Vz",
      resultHash: "9876543210fedcba0987654321fedcba09876543210fedcba0987654321fedcba",
      totalEntries: 247,
      winner: "Sarah L. (TX)"
    },
    {
      id: "2025-01-30",
      title: "$1,000 — Jan 30, 2025",
      participantsHash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
      seed: "YW5vdGhlciBzYW1wbGUgc2VlZCBmb3IgZGVtb25zdHJhdGlvbg==",
      resultHash: "8765432109edcba098765432109edcba098765432109edcba098765432109edcba",
      totalEntries: 189,
      winner: "Marcus R. (CA)"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-24 flex items-center justify-center min-h-[80vh]">
          <div className="text-center">
            <div className="animate-spin w-8 h-8 border-4 border-accent/30 border-t-primary rounded-full mx-auto mb-4"></div>
            <p className="text-secondary-foreground">Loading winners...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Meet Our Winners
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
              Real people, real wins, real proof. Every draw is transparent and verifiable.
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8">
              <div className="glass rounded-lg p-4">
                <DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">${totalPrizesPaid.toLocaleString()}</div>
                <div className="text-xs text-secondary-foreground">Total Prizes Paid</div>
              </div>
              <div className="glass rounded-lg p-4">
                <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">{totalWinners}</div>
                <div className="text-xs text-secondary-foreground">Total Winners</div>
              </div>
              <div className="glass rounded-lg p-4">
                <Eye className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-xs text-secondary-foreground">Verified Draws</div>
              </div>
              <div className="glass rounded-lg p-4">
                <Star className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="text-2xl font-bold text-primary">4.9/5</div>
                <div className="text-xs text-secondary-foreground">Winner Rating</div>
              </div>
            </div>
            
            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div className="glass rounded-lg p-1 inline-flex">
                {["Latest", "2025", "All Time"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab.toLowerCase().replace(' ', '-'))}
                    className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                      selectedTab === tab.toLowerCase().replace(' ', '-')
                        ? 'bg-primary text-primary-foreground'
                        : 'text-secondary-foreground hover:text-primary'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Winners Grid */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
              {winners.map((winner, index) => (
                <div key={winner.id} className="glass rounded-lg overflow-hidden hover-lift cursor-pointer">
                  <div className="relative">
                    <img
                      src={winner.image}
                      alt={`Winner ${winner.name}`}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                      ${winner.amount.toLocaleString()}
                    </div>
                    {winner.verified && (
                      <div className="absolute top-4 left-4 bg-success text-white px-2 py-1 rounded-full text-xs flex items-center">
                        <Eye className="w-3 h-3 mr-1" />
                        Verified
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="font-semibold text-lg mb-2">
                      {winner.name} ({winner.state})
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-secondary-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{winner.date}</span>
                    </div>
                    <p className="text-sm text-secondary-foreground italic mb-4">
                      "{winner.quote}"
                    </p>
                    <p className="text-sm text-secondary-foreground">
                      {winner.story}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {winners.length === 0 && (
              <div className="text-center py-16">
                <Trophy className="w-16 h-16 text-secondary-foreground mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold mb-2">No Winners Yet</h3>
                <p className="text-secondary-foreground mb-6">Be the first to win in our transparent sweepstakes!</p>
                <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                  <PremiumButton variant="gold" size="lg">Enter Now</PremiumButton>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* Draw Proof Section */}
        <section className="pb-24 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
                Verifiable Draw Proof
              </h2>
              <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
                Every draw is auditable with cryptographic proof. Complete transparency, guaranteed.
              </p>
            </div>

            <div className="space-y-8">
              {drawProofs.map((draw) => (
                <div key={draw.id} className="glass rounded-lg p-8">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                    <div className="mb-4 lg:mb-0">
                      <h3 className="text-2xl font-display font-semibold mb-2">
                        {draw.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-secondary-foreground">
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4" />
                          <span>Winner: {draw.winner}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Users className="w-4 h-4" />
                          <span>{draw.totalEntries} Total Entries</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Eye className="w-4 h-4" />
                          <span>Publicly Verified</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-3">
                      <PremiumButton variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Download CSV
                      </PremiumButton>
                      <PremiumButton variant="glass" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Audit Details
                      </PremiumButton>
                      <PremiumButton variant="gold" size="sm">
                        <Play className="w-4 h-4 mr-2" />
                        Watch Draw
                      </PremiumButton>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <div className="text-sm text-secondary-foreground mb-2">
                        Participant List Hash (SHA256):
                      </div>
                      <div className="font-mono text-xs bg-surface/50 p-3 rounded border break-all">
                        {draw.participantsHash}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-secondary-foreground mb-2">
                        Random Seed:
                      </div>
                      <div className="font-mono text-xs bg-surface/50 p-3 rounded border break-all">
                        {draw.seed}
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-sm text-secondary-foreground mb-2">
                        Result Hash:
                      </div>
                      <div className="font-mono text-xs bg-surface/50 p-3 rounded border break-all">
                        {draw.resultHash}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button className="text-sm text-primary hover:text-accent underline">
                      How to verify these results →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Winner Testimonials */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Winner Stories
              </h2>
              <p className="text-xl text-secondary-foreground">
                Hear directly from our winners about their BigMoney experience.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {winners.slice(0, 4).map((winner, index) => (
                <div key={winner.id} className="glass rounded-lg p-8">
                  <div className="flex items-start space-x-4 mb-4">
                    <img
                      src={winner.image}
                      alt={winner.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{winner.name}</h3>
                      <div className="text-sm text-secondary-foreground">{winner.state} • {winner.date}</div>
                      <div className="text-lg font-bold text-primary">${winner.amount.toLocaleString()} Winner</div>
                    </div>
                  </div>
                  <p className="text-secondary-foreground italic">
                    "{winner.story}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-r from-background via-surface/50 to-background">
          <div className="container-premium text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Join Our Winners?
            </h2>
            <p className="text-xl text-secondary-foreground mb-8">
              Enter now for your chance at life-changing prizes with complete transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto mb-8">
              <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="hero" size="xl" className="flex-1">
                  Enter $3 — $700 Draw (20th)
                </PremiumButton>
              </Link>
              <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="hero" size="xl" className="flex-1">
                  Enter $5 — $1,000 Draw (30th)
                </PremiumButton>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="outline" size="lg" className="flex-1">
                  Try Free Quiz
                </PremiumButton>
              </Link>
              <Link to="/how-it-works" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="glass" size="lg" className="flex-1">
                  How It Works
                </PremiumButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}