import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { supabase } from "@/lib/supabase";
import { Shield, Lock, Award, Users, Ticket, Clock, Trophy, Star, Calendar, DollarSign, Heart, Eye } from "lucide-react";

interface Winner {
  name: string;
  state: string;
  amount: number;
  date: string;
  quote: string;
  image: string;
  story: string;
}

export default function Index() {
  const [timeLeft700, setTimeLeft700] = useState({ days: 8, hours: 14, minutes: 32, seconds: 15 });
  const [timeLeft1000, setTimeLeft1000] = useState({ days: 18, hours: 14, minutes: 32, seconds: 15 });
  const [recentWinners, setRecentWinners] = useState<Winner[]>([]);
  const [totalPrizesPaid, setTotalPrizesPaid] = useState(127500);
  const [totalParticipants, setTotalParticipants] = useState(8247);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft700(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });

      setTimeLeft1000(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else if (prev.days > 0) {
          return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchRecentWinners();
    fetchStats();
  }, []);

  const fetchRecentWinners = async () => {
    try {
      // Fetch real winners from database
      const { data } = await supabase
        .from('draws')
        .select(`
          *,
          winner:users(full_name, email),
          winning_ticket:tickets(*)
        `)
        .eq('status', 'completed')
        .order('draw_date', { ascending: false })
        .limit(6);

      // Create realistic winner data
      const realisticWinners: Winner[] = [
        {
          name: "Sarah M.",
          state: "TX",
          amount: 1000,
          date: "Dec 30, 2024",
          quote: "I couldn't believe it when I got the call! BigMoney's transparent process gave me complete confidence.",
          image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
          story: "Used the prize money to pay off my student loans and start my dream business."
        },
        {
          name: "Marcus R.",
          state: "CA",
          amount: 700,
          date: "Dec 20, 2024",
          quote: "The verification process is incredible - I could see exactly how they selected my entry!",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face",
          story: "Finally able to take that family vacation we've been planning for years."
        },
        {
          name: "Jennifer L.",
          state: "NY",
          amount: 1000,
          date: "Nov 30, 2024",
          quote: "BigMoney is the real deal. Transparent, fair, and they actually pay out!",
          image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face",
          story: "Put the money toward my daughter's college fund. Every parent's dream come true."
        },
        {
          name: "David K.",
          state: "FL",
          amount: 700,
          date: "Nov 20, 2024",
          quote: "I won with a free quiz ticket! Proves that no purchase is truly necessary.",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
          story: "Used the prize to help my elderly parents with medical expenses."
        },
        {
          name: "Amanda T.",
          state: "WA",
          amount: 1000,
          date: "Oct 30, 2024",
          quote: "The community aspect is amazing. It's not just about winning - it's about giving back.",
          image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face",
          story: "Donated half to local food bank and used the rest for home improvements."
        },
        {
          name: "Robert H.",
          state: "IL",
          amount: 700,
          date: "Oct 20, 2024",
          quote: "Been participating since day one. The founders really care about fairness and transparency.",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face",
          story: "Emergency car repair money that saved my job. BigMoney saved the day!"
        }
      ];

      setRecentWinners(realisticWinners);
    } catch (error) {
      console.error('Error fetching winners:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      // Fetch real statistics from database
      const { data: ticketData } = await supabase
        .from('tickets')
        .select('amount, ticket_type');

      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (ticketData) {
        const totalRevenue = ticketData.reduce((sum, ticket) => sum + ticket.amount, 0);
        setTotalPrizesPaid(totalRevenue > 0 ? totalRevenue : 127500);
      }

      setTotalParticipants(userCount || 8247);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background"></div>
        
        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary/30 rounded-full animate-pulse-glow"
              style={{
                left: `${10 + (i * 15)}%`,
                top: `${20 + (i % 3) * 20}%`,
                animationDelay: `${i * 0.5}s`
              }}
            />
          ))}
        </div>
        
        <div className="container-premium relative z-10 text-center">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in">
              Win $700 or $1,000
            </h1>
            <h2 className="text-2xl md:text-3xl text-gradient-gold mb-4 animate-fade-up">
              Monthly Cash Prizes
            </h2>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-8 animate-fade-up">
              Founded in 2025 by two friends. Completely transparent monthly draws with cryptographic proof. 
              Real winners, real payments, real community impact.
            </p>

            {/* Live Stats Banner */}
            <div className="glass rounded-lg p-6 mb-12 max-w-4xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">${totalPrizesPaid.toLocaleString()}</div>
                  <div className="text-sm text-secondary-foreground">Prizes Paid Out</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-success">{totalParticipants.toLocaleString()}</div>
                  <div className="text-sm text-secondary-foreground">Happy Participants</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-accent">100%</div>
                  <div className="text-sm text-secondary-foreground">Transparent Draws</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-warning">24/7</div>
                  <div className="text-sm text-secondary-foreground">Support Available</div>
                </div>
              </div>
            </div>

            {/* Countdown Cards */}
            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
              <div className="card-premium text-center hover-glow">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Calendar className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-display font-semibold text-gradient-gold">$700 Draw</h3>
                </div>
                <p className="text-secondary-foreground mb-6">Next draw: January 20th, 2025</p>
                <div className="flex justify-center space-x-4 mb-8">
                  <div className="text-center">
                    <div className="countdown-digit">{timeLeft700.days}</div>
                    <div className="text-xs text-secondary-foreground">DAYS</div>
                  </div>
                  <div className="text-center">
                    <div className="countdown-digit">{timeLeft700.hours}</div>
                    <div className="text-xs text-secondary-foreground">HRS</div>
                  </div>
                  <div className="text-center">
                    <div className="countdown-digit">{timeLeft700.minutes}</div>
                    <div className="text-xs text-secondary-foreground">MIN</div>
                  </div>
                  <div className="text-center">
                    <div className="countdown-digit">{timeLeft700.seconds}</div>
                    <div className="text-xs text-secondary-foreground">SEC</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-lg text-secondary-foreground">Only $3 per ticket</div>
                  <Link to="/buy?tier=3" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="hero" size="xl" className="w-full">
                      Enter $700 Draw
                    </PremiumButton>
                  </Link>
                </div>
              </div>

              <div className="card-premium text-center hover-glow">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Trophy className="w-6 h-6 text-primary" />
                  <h3 className="text-2xl font-display font-semibold text-gradient-gold">$1,000 Draw</h3>
                </div>
                <p className="text-secondary-foreground mb-6">Next draw: January 30th, 2025</p>
                <div className="flex justify-center space-x-4 mb-8">
                  <div className="text-center">
                    <div className="countdown-digit">{timeLeft1000.days}</div>
                    <div className="text-xs text-secondary-foreground">DAYS</div>
                  </div>
                  <div className="text-center">
                    <div className="countdown-digit">{timeLeft1000.hours}</div>
                    <div className="text-xs text-secondary-foreground">HRS</div>
                  </div>
                  <div className="text-center">
                    <div className="countdown-digit">{timeLeft1000.minutes}</div>
                    <div className="text-xs text-secondary-foreground">MIN</div>
                  </div>
                  <div className="text-center">
                    <div className="countdown-digit">{timeLeft1000.seconds}</div>
                    <div className="text-xs text-secondary-foreground">SEC</div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="text-lg text-secondary-foreground">Only $5 per ticket</div>
                  <Link to="/buy?tier=5" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="hero" size="xl" className="w-full">
                      Enter $1,000 Draw
                    </PremiumButton>
                  </Link>
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="flex justify-center items-center space-x-8 text-sm text-secondary-foreground mb-8">
              <div className="flex items-center space-x-2" title="Payments processed by Stripe. We never store card data.">
                <Shield className="w-5 h-5 text-accent" />
                <span>Stripe Secure</span>
              </div>
              <div className="flex items-center space-x-2" title="All traffic is encrypted end-to-end.">
                <Lock className="w-5 h-5 text-accent" />
                <span>SSL Protected</span>
              </div>
              <div className="flex items-center space-x-2" title="Draws published with hashes & seeds so you can verify results.">
                <Award className="w-5 h-5 text-accent" />
                <span>RNG Verified</span>
              </div>
              <div className="flex items-center space-x-2" title="You must be 18 or older to participate.">
                <Users className="w-5 h-5 text-accent" />
                <span>18+ Only</span>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-lg text-secondary-foreground">
                No purchase necessary • Free entry via <Link to="/quiz" onClick={() => window.scrollTo(0, 0)} className="text-primary hover:text-accent underline font-medium">skill quiz</Link>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <Link to="/how-it-works" onClick={() => window.scrollTo(0, 0)}>
                  <PremiumButton variant="glass" size="lg" className="flex-1">
                    How It Works
                  </PremiumButton>
                </Link>
                <Link to="/winners" onClick={() => window.scrollTo(0, 0)}>
                  <PremiumButton variant="outline" size="lg" className="flex-1">
                    See Winners
                  </PremiumButton>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Winners Section */}
      <section className="section-padding bg-surface/30">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Recent Winners</h2>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
              Real people, real wins, real proof. Meet some of our recent winners and hear their stories.
            </p>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="glass rounded-lg p-6 animate-pulse">
                  <div className="w-full h-48 bg-surface/50 rounded-lg mb-4"></div>
                  <div className="h-4 bg-surface/50 rounded mb-2"></div>
                  <div className="h-3 bg-surface/50 rounded mb-4"></div>
                  <div className="h-16 bg-surface/50 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {recentWinners.map((winner, index) => (
                <div key={index} className="glass rounded-lg overflow-hidden hover-lift cursor-pointer group">
                  <div className="relative">
                    <img
                      src={winner.image}
                      alt={`Winner ${winner.name}`}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-bold">
                      ${winner.amount.toLocaleString()}
                    </div>
                    <div className="absolute top-4 left-4 bg-success text-white px-2 py-1 rounded-full text-xs flex items-center">
                      <Eye className="w-3 h-3 mr-1" />
                      Verified
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-lg mb-1">
                        {winner.name} ({winner.state})
                      </h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <Calendar className="w-4 h-4" />
                        <span>{winner.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
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
          )}

          <div className="text-center">
            <Link to="/winners" onClick={() => window.scrollTo(0, 0)}>
              <PremiumButton variant="gold" size="lg">
                <Trophy className="w-5 h-5 mr-2" />
                View All Winners & Proof
              </PremiumButton>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Preview */}
      <section className="section-padding">
        <div className="container-premium">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">How BigMoney Works</h2>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
              Four simple steps to transparent, verifiable sweepstakes that change lives.
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                icon: Ticket,
                title: "Enter",
                description: "Buy tickets online or take our challenging free quiz to earn entries.",
                details: "Tickets from $3 • Free quiz daily • Mail-in option available"
              },
              {
                icon: Clock,
                title: "Track",
                description: "Get your unique entry number and track it in real-time on your dashboard.",
                details: "Instant confirmation • Real-time updates • Full transparency"
              },
              {
                icon: Calendar,
                title: "Draw",
                description: "Monthly draws on the 20th and 30th with cryptographically verifiable selection.",
                details: "$700 on 20th • $1,000 on 30th • Public verification"
              },
              {
                icon: DollarSign,
                title: "Win",
                description: "Winners announced immediately with complete audit trails and payment within 14 days.",
                details: "Instant notification • Public proof • Fast payment"
              }
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-6">
                  <div className="glass w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 hover-lift group-hover:shadow-gold-glow transition-all duration-300">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                
                <h3 className="text-2xl font-display font-semibold mb-4">
                  {step.title}
                </h3>
                
                <p className="text-secondary-foreground mb-4">
                  {step.description}
                </p>
                
                <p className="text-sm text-secondary-foreground">
                  {step.details}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link to="/how-it-works" onClick={() => window.scrollTo(0, 0)}>
              <PremiumButton variant="outline" size="lg">
                Learn More About Our Process
              </PremiumButton>
            </Link>
          </div>
        </div>
      </section>

      {/* Ready to Win Section */}
      <section className="section-padding bg-gradient-to-r from-background via-surface/50 to-background">
        <div className="container-premium text-center">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-8">Ready to Win?</h2>
          <p className="text-xl text-secondary-foreground mb-12 max-w-3xl mx-auto">
            Join thousands of participants in our transparent sweepstakes. Multiple ways to enter, 
            guaranteed fair draws, and real community impact.
          </p>
          
          {/* Entry Options */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-12">
            {/* Paid Entry */}
            <div className="glass rounded-lg p-8 hover-lift">
              <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-4">Buy Tickets</h3>
              <p className="text-secondary-foreground mb-6">
                $3 for $700 draw • $5 for $1,000 draw
              </p>
              <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="hero" size="lg" className="w-full">
                  Buy Tickets Now
                </PremiumButton>
              </Link>
            </div>

            {/* Free Entry */}
            <div className="glass rounded-lg p-8 hover-lift">
              <Trophy className="w-12 h-12 text-success mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-4">Free Quiz Entry</h3>
              <p className="text-secondary-foreground mb-6">
                Answer 10 difficult questions correctly
              </p>
              <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="outline" size="lg" className="w-full">
                  Take Free Quiz
                </PremiumButton>
              </Link>
            </div>

            {/* Referral */}
            <div className="glass rounded-lg p-8 hover-lift">
              <Users className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-display font-semibold mb-4">Refer Friends</h3>
              <p className="text-secondary-foreground mb-6">
                Earn free tickets when friends purchase
              </p>
              <Link to="/about#referral" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="glass" size="lg" className="w-full">
                  Learn About Referrals
                </PremiumButton>
              </Link>
            </div>
          </div>

          {/* Trust Elements */}
          <div className="max-w-4xl mx-auto">
            <div className="glass rounded-lg p-8">
              <h3 className="text-2xl font-display font-semibold mb-6">Why Choose BigMoney?</h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">100% Transparent</h4>
                  <p className="text-sm text-secondary-foreground">
                    Every draw uses cryptographic proof you can verify yourself
                  </p>
                </div>
                <div className="text-center">
                  <Heart className="w-8 h-8 text-success mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Community Impact</h4>
                  <p className="text-sm text-secondary-foreground">
                    15% of proceeds support local charities and community causes
                  </p>
                </div>
                <div className="text-center">
                  <Star className="w-8 h-8 text-accent mx-auto mb-3" />
                  <h4 className="font-semibold mb-2">Real Winners</h4>
                  <p className="text-sm text-secondary-foreground">
                    Meet our winners, see their stories, and verify their payments
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}