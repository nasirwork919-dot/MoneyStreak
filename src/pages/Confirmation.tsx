import { useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { CheckCircle, Ticket, Share, BarChart3 } from "lucide-react";

export default function Confirmation() {
  const entryNumber = "BM-2025-007"; // TODO: Replace with actual entry number from URL params or state

  useEffect(() => {
    // Trigger confetti animation
    const timer = setTimeout(() => {
      // Confetti would be triggered here
      console.log("Confetti triggered!");
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section with Confetti */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <div className="max-w-4xl mx-auto">
              {/* Success Icon with Animation */}
              <div className="relative mb-8">
                <div className="animate-scale-in">
                  <CheckCircle className="w-24 h-24 text-success mx-auto mb-6" />
                </div>
                
                {/* Floating particles effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-primary rounded-full animate-pulse-glow"
                      style={{
                        left: `${20 + (i * 10)}%`,
                        top: `${30 + (i % 2) * 40}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 animate-fade-in">
                Your Entry is Confirmed!
              </h1>
              
              <div className="glass rounded-lg p-8 mb-8 max-w-2xl mx-auto animate-fade-up">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <Ticket className="w-6 h-6 text-primary" />
                  <span className="text-lg font-display font-semibold">Entry Number</span>
                </div>
                <div className="font-mono text-3xl font-bold text-gradient-gold mb-4">
                  #{entryNumber}
                </div>
                <p className="text-secondary-foreground">
                  We've emailed your receipt and entry confirmation. Keep this number for your records.
                </p>
              </div>
              
              <p className="text-xl text-secondary-foreground mb-12 animate-fade-up">
                Good luck! Your entry is now in the system and ready for the next draw.
              </p>
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="glass rounded-lg p-6 text-center hover-lift">
                <BarChart3 className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold mb-3">
                  View Dashboard
                </h3>
                <p className="text-secondary-foreground text-sm mb-4">
                  Track your entries, see countdowns, and manage your account.
                </p>
                <a href="/dashboard">
                  <PremiumButton variant="gold" size="sm" className="w-full">
                    Go to Dashboard
                  </PremiumButton>
                </a>
              </div>
              
              <div className="glass rounded-lg p-6 text-center hover-lift">
                <Ticket className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold mb-3">
                  Enter Again
                </h3>
                <p className="text-secondary-foreground text-sm mb-4">
                  Increase your chances with additional entries.
                </p>
                <a href="/buy">
                  <PremiumButton variant="outline" size="sm" className="w-full">
                    Buy More Tickets
                  </PremiumButton>
                </a>
              </div>
              
              <div className="glass rounded-lg p-6 text-center hover-lift">
                <Share className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-display font-semibold mb-3">
                  Share & Earn
                </h3>
                <p className="text-secondary-foreground text-sm mb-4">
                  Get your referral link and earn free tickets.
                </p>
                <a href="/dashboard#referral">
                  <PremiumButton variant="glass" size="sm" className="w-full">
                    Get Referral Link
                  </PremiumButton>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Next Steps */}
        <section className="pb-16 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                What Happens Next?
              </h2>
              
              <div className="space-y-6">
                <div className="glass rounded-lg p-6 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold mb-2">
                        Your Entry is Active
                      </h3>
                      <p className="text-secondary-foreground">
                        Your entry #{entryNumber} is now in our system and will be included in the next applicable draw.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="glass rounded-lg p-6 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold mb-2">
                        Draw Day Notification
                      </h3>
                      <p className="text-secondary-foreground">
                        We'll email you before each draw with the time and live stream details.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="glass rounded-lg p-6 text-left">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-semibold mb-2">
                        Results & Verification
                      </h3>
                      <p className="text-secondary-foreground">
                        Winners are announced immediately, with complete verification proof published on our website.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Important Info */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="max-w-2xl mx-auto">
              <div className="glass rounded-lg p-8 text-center">
                <h3 className="text-xl font-display font-semibold mb-4">
                  Important Information
                </h3>
                
                <div className="space-y-4 text-secondary-foreground text-sm">
                  <p>
                    <strong>Draw Schedule:</strong> $700 draws on the 20th, $1,000 draws on the 30th of each month.
                  </p>
                  <p>
                    <strong>Winner Notification:</strong> Winners are contacted within 24 hours via email and phone.
                  </p>
                  <p>
                    <strong>Payment:</strong> Prizes are paid within 14 days of winner verification.
                  </p>
                  <p>
                    <strong>Questions?</strong> Visit our{" "}
                    <a href="/faq" className="text-primary hover:text-accent underline">
                      FAQ page
                    </a>{" "}
                    or{" "}
                    <a href="/contact" className="text-primary hover:text-accent underline">
                      contact support
                    </a>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}