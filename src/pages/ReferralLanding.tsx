import { useParams } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Gift, Users, Trophy } from "lucide-react";

export default function ReferralLanding() {
  const { code } = useParams();
  const isLoggedIn = false; // TODO: Replace with actual auth state
  const hasPurchased = false; // TODO: Replace with actual purchase state

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <div className="max-w-4xl mx-auto">
              <Gift className="w-16 h-16 text-primary mx-auto mb-6 animate-pulse-glow" />
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
                Your Friend Invited You
              </h1>
              
              <p className="text-xl text-secondary-foreground mb-8">
                Enter for a chance at $700 or $1,000. If you buy, they earn a free ticket — and so do you after your first referral!
              </p>
              
              <div className="glass rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <div className="text-sm text-secondary-foreground mb-2">Referral Code:</div>
                <div className="font-mono text-xl text-primary font-bold">{code}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="glass rounded-lg p-8 text-center hover-lift">
                <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold mb-4">
                  Win Big Prizes
                </h3>
                <p className="text-secondary-foreground">
                  $700 prizes on the 20th, $1,000 prizes on the 30th of every month.
                </p>
              </div>
              
              <div className="glass rounded-lg p-8 text-center hover-lift">
                <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold mb-4">
                  Help a Friend
                </h3>
                <p className="text-secondary-foreground">
                  Your friend gets a free ticket when you make your first purchase.
                </p>
              </div>
              
              <div className="glass rounded-lg p-8 text-center hover-lift">
                <Gift className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold mb-4">
                  Earn Free Tickets
                </h3>
                <p className="text-secondary-foreground">
                  After your first purchase, you get your own referral link to earn free tickets.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Entry Options */}
        <section className="pb-16 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                Choose Your Entry Method
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* $700 Option */}
                <div className="glass rounded-lg p-8 hover-lift">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-display font-bold text-gradient-gold mb-2">
                      $700
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-2">
                      Monthly Prize
                    </h3>
                    <p className="text-secondary-foreground">
                      Draw on the 20th • Only $3 per ticket
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">$3</div>
                    <a href={`/buy?tier=3&ref=${code}`}>
                      <PremiumButton variant="hero" size="lg" className="w-full">
                        Enter $3 Draw
                      </PremiumButton>
                    </a>
                  </div>
                </div>

                {/* $1000 Option */}
                <div className="glass rounded-lg p-8 hover-lift">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-display font-bold text-gradient-gold mb-2">
                      $1,000
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-2">
                      Monthly Prize
                    </h3>
                    <p className="text-secondary-foreground">
                      Draw on the 30th • Only $5 per ticket
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="text-2xl font-bold text-primary">$5</div>
                    <a href={`/buy?tier=5&ref=${code}`}>
                      <PremiumButton variant="hero" size="lg" className="w-full">
                        Enter $5 Draw
                      </PremiumButton>
                    </a>
                  </div>
                </div>
              </div>

              {/* Free Option */}
              <div className="glass rounded-lg p-8 max-w-2xl mx-auto">
                <h3 className="text-xl font-display font-semibold mb-4">
                  Or Try the Free Quiz
                </h3>
                <p className="text-secondary-foreground mb-6">
                  Answer 5 questions correctly to earn a free ticket. No purchase necessary.
                </p>
                <a href={`/quiz?ref=${code}`}>
                  <PremiumButton variant="outline" size="lg" className="w-full">
                    Take Free Quiz
                  </PremiumButton>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Status Section */}
        {isLoggedIn && hasPurchased && (
          <section className="pb-16">
            <div className="container-premium">
              <div className="max-w-2xl mx-auto text-center">
                <div className="glass rounded-lg p-8">
                  <h3 className="text-2xl font-display font-semibold mb-4 text-success">
                    Purchase Confirmed!
                  </h3>
                  <p className="text-secondary-foreground mb-6">
                    Nice — your purchase will credit your friend with a free ticket, and you now have your own referral link to earn free tickets too!
                  </p>
                  
                  <div className="space-y-3">
                    <PremiumButton variant="gold" className="w-full">
                      View Your Dashboard
                    </PremiumButton>
                    <PremiumButton variant="outline" className="w-full">
                      Get Your Referral Link
                    </PremiumButton>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* How It Works */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                How Referrals Work
              </h2>
              <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
                Everyone wins when you refer friends to BigMoney.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="glass w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">1</span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">
                  You Purchase
                </h3>
                <p className="text-secondary-foreground">
                  Buy your first ticket using your friend's referral link.
                </p>
              </div>
              
              <div className="text-center">
                <div className="glass w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">2</span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">
                  They Get Rewarded
                </h3>
                <p className="text-secondary-foreground">
                  Your friend automatically receives a free ticket for the next draw.
                </p>
              </div>
              
              <div className="text-center">
                <div className="glass w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-primary">3</span>
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">
                  You Start Earning
                </h3>
                <p className="text-secondary-foreground">
                  Get your own referral link and earn free tickets when others use it.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}