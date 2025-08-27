import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Shield, Lock, Award, Users, Ticket, Clock, Trophy, Star } from "lucide-react";

export default function Index() {
  const [timeLeft700, setTimeLeft700] = useState({ days: 8, hours: 14, minutes: 32, seconds: 15 });
  const [timeLeft1000, setTimeLeft1000] = useState({ days: 18, hours: 14, minutes: 32, seconds: 15 });

  useEffect(() => {
    const timer = setInterval(() => {
      // Update countdown timers (simplified for demo)
      setTimeLeft700(prev => ({
        ...prev,
        seconds: prev.seconds > 0 ? prev.seconds - 1 : 59
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const winners = [
    { name: "Sarah L.", state: "TX", amount: 700, date: "Feb 20, 2025", quote: "Life-changing!" },
    { name: "Marcus R.", state: "CA", amount: 1000, date: "Jan 30, 2025", quote: "Transparent and fair!" },
    { name: "Jennifer M.", state: "NY", amount: 700, date: "Jan 20, 2025", quote: "Verified process!" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background"></div>
        
        <div className="container-premium relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 animate-fade-in">
            Win $700 or $1,000
          </h1>
          <h2 className="text-2xl md:text-3xl text-gradient-gold mb-4 animate-fade-up">
            Tickets from $3
          </h2>
          <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-12 animate-fade-up">
            Founded in 2025 by two friends. Transparent monthly draws. Real winners. Real proof.
          </p>

          {/* Countdown Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
            <div className="card-premium text-center">
              <h3 className="text-2xl font-display font-semibold text-gradient-gold mb-2">$700 Draw</h3>
              <p className="text-secondary-foreground mb-4">Every 20th</p>
              <div className="flex justify-center space-x-4 mb-6">
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
              </div>
              <Link to="/buy?tier=3">
                <PremiumButton variant="hero" size="xl" className="w-full">
                  Enter $3 Draw
                </PremiumButton>
              </Link>
            </div>

            <div className="card-premium text-center">
              <h3 className="text-2xl font-display font-semibold text-gradient-gold mb-2">$1,000 Draw</h3>
              <p className="text-secondary-foreground mb-4">Every 30th</p>
              <div className="flex justify-center space-x-4 mb-6">
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
              </div>
              <Link to="/buy?tier=5">
                <PremiumButton variant="hero" size="xl" className="w-full">
                  Enter $5 Draw
                </PremiumButton>
              </Link>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="flex justify-center items-center space-x-6 text-sm text-secondary-foreground mb-8">
            <div className="flex items-center space-x-2" title="Payments processed by Stripe. We never store card data.">
              <Shield className="w-4 h-4 text-accent" />
              <span>Stripe</span>
            </div>
            <div className="flex items-center space-x-2" title="All traffic is encrypted end-to-end.">
              <Lock className="w-4 h-4 text-accent" />
              <span>SSL</span>
            </div>
            <div className="flex items-center space-x-2" title="Draws published with hashes & seeds so you can verify results.">
              <Award className="w-4 h-4 text-accent" />
              <span>RNG Verified</span>
            </div>
            <div className="flex items-center space-x-2" title="You must be 18 or older to participate.">
              <Users className="w-4 h-4 text-accent" />
              <span>18+</span>
            </div>
          </div>

          <p className="text-sm text-secondary-foreground">
            No purchase necessary. Free entry via <Link to="/quiz" className="text-primary hover:text-accent underline">skill quiz</Link>.
          </p>
        </div>
      </section>

      {/* Prize Rows */}
      <section className="section-padding bg-surface/30">
        <div className="container-premium">
          <div className="space-y-24">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center">
                <Ticket className="w-32 h-32 text-primary mx-auto mb-6 hover:rotate-12 transition-transform duration-300" />
              </div>
              <div>
                <h2 className="text-4xl font-display font-bold mb-6">$3 Ticket • $700 Prize</h2>
                <ul className="space-y-3 text-lg text-secondary-foreground mb-8">
                  <li>• Instant entry</li>
                  <li>• Transparent draw</li>
                  <li>• Announced on the 20th</li>
                </ul>
                <Link to="/buy?tier=3">
                  <PremiumButton variant="hero" size="xl" className="mb-4">
                    Enter for $3
                  </PremiumButton>
                </Link>
                <div>
                  <Link to="/rules" className="text-sm text-secondary-foreground hover:text-primary underline">
                    Read Official Rules
                  </Link>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="lg:order-2 text-center">
                <Trophy className="w-32 h-32 text-primary mx-auto mb-6 hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="lg:order-1">
                <h2 className="text-4xl font-display font-bold mb-6">$5 Ticket • $1,000 Prize</h2>
                <ul className="space-y-3 text-lg text-secondary-foreground mb-8">
                  <li>• Verified winners</li>
                  <li>• Auditable draw</li>
                  <li>• Announced on the 30th</li>
                </ul>
                <Link to="/buy?tier=5">
                  <PremiumButton variant="hero" size="xl" className="mb-4">
                    Enter for $5
                  </PremiumButton>
                </Link>
                <div>
                  <Link to="/winners" className="text-sm text-secondary-foreground hover:text-primary underline">
                    See Past Winners
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Winners Carousel */}
      <section className="section-padding">
        <div className="container-premium">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12">Recent Winners</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {winners.map((winner, index) => (
              <div key={index} className="card-premium text-center hover-lift cursor-pointer">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">${winner.amount}</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{winner.name} ({winner.state})</h3>
                <p className="text-secondary-foreground text-sm mb-3">{winner.date}</p>
                <p className="text-secondary-foreground italic">"{winner.quote}"</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/winners">
              <PremiumButton variant="outline" size="lg">View All Winners</PremiumButton>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="section-padding bg-surface/30">
        <div className="container-premium text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-12">Ready to Win?</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/buy">
              <PremiumButton variant="hero" size="xl" className="w-full">
                Buy Tickets Now
              </PremiumButton>
            </Link>
            <Link to="/quiz">
              <PremiumButton variant="outline" size="xl" className="w-full">
                Try Free Quiz
              </PremiumButton>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}