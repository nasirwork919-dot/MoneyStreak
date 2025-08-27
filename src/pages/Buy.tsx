import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Minus, Plus, Shield, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Buy() {
  const [qty700, setQty700] = useState(1);
  const [qty1000, setQty1000] = useState(1);
  const [agreedToRules, setAgreedToRules] = useState(false);
  const { toast } = useToast();

  const handleProceed = (tier: number, qty: number) => {
    if (!agreedToRules) {
      toast({
        title: "Agreement Required",
        description: "Please confirm you are 18+ and agree to the Official Rules.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Redirecting to Checkout",
      description: `Processing ${qty} ticket(s) for $${tier * qty}...`,
    });

    // TODO: Integrate with Stripe checkout
    setTimeout(() => {
      window.location.href = "/confirmation";
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Choose Your Ticket
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-8">
              Secure checkout via Stripe. 18+ only. No purchase necessary — try the{" "}
              <a href="/quiz" className="text-primary hover:text-accent transition-colors underline">
                free quiz
              </a>
              .
            </p>
          </div>
        </section>

        {/* Ticket Selection */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* $700 Ticket */}
              <div className="card-premium">
                <div className="text-center mb-6">
                  <div className="text-5xl font-display font-bold text-gradient-gold mb-2">
                    $700
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-2">
                    Prize Draw
                  </h3>
                  <p className="text-secondary-foreground">
                    Draw on the 20th of every month
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setQty700(Math.max(1, qty700 - 1))}
                      className="p-2 glass rounded-lg hover:bg-accent/10"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold">{qty700}</div>
                      <div className="text-sm text-secondary-foreground">tickets</div>
                    </div>
                    
                    <button
                      onClick={() => setQty700(Math.min(10, qty700 + 1))}
                      className="p-2 glass rounded-lg hover:bg-accent/10"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                      ${(qty700 * 3).toFixed(2)}
                    </div>
                    <div className="text-sm text-secondary-foreground">
                      ${3} per ticket
                    </div>
                  </div>

                  <PremiumButton
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={() => handleProceed(3, qty700)}
                  >
                    Proceed — ${(qty700 * 3).toFixed(2)}
                  </PremiumButton>
                </div>
              </div>

              {/* $1,000 Ticket */}
              <div className="card-premium">
                <div className="text-center mb-6">
                  <div className="text-5xl font-display font-bold text-gradient-gold mb-2">
                    $1,000
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-2">
                    Prize Draw
                  </h3>
                  <p className="text-secondary-foreground">
                    Draw on the 30th of every month
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setQty1000(Math.max(1, qty1000 - 1))}
                      className="p-2 glass rounded-lg hover:bg-accent/10"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    
                    <div className="text-center">
                      <div className="text-3xl font-bold">{qty1000}</div>
                      <div className="text-sm text-secondary-foreground">tickets</div>
                    </div>
                    
                    <button
                      onClick={() => setQty1000(Math.min(10, qty1000 + 1))}
                      className="p-2 glass rounded-lg hover:bg-accent/10"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary mb-2">
                      ${(qty1000 * 5).toFixed(2)}
                    </div>
                    <div className="text-sm text-secondary-foreground">
                      ${5} per ticket
                    </div>
                  </div>

                  <PremiumButton
                    variant="hero"
                    size="lg"
                    className="w-full"
                    onClick={() => handleProceed(5, qty1000)}
                  >
                    Proceed — ${(qty1000 * 5).toFixed(2)}
                  </PremiumButton>
                </div>
              </div>
            </div>

            {/* Agreement & Trust */}
            <div className="max-w-2xl mx-auto mt-12 space-y-6">
              <div className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  id="agreement"
                  checked={agreedToRules}
                  onChange={(e) => setAgreedToRules(e.target.checked)}
                  className="mt-1 w-4 h-4 accent-primary"
                />
                <label htmlFor="agreement" className="text-sm text-secondary-foreground">
                  I confirm I am 18+ and agree to the{" "}
                  <a href="/rules" className="text-primary hover:text-accent underline">
                    Official Rules
                  </a>
                  .
                </label>
              </div>

              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-6 text-sm text-secondary-foreground">
                  <a href="/rules" className="hover:text-primary transition-colors underline">
                    Official Rules
                  </a>
                  <a href="/quiz" className="hover:text-primary transition-colors underline">
                    Free Entry
                  </a>
                  <a href="/privacy" className="hover:text-primary transition-colors underline">
                    Privacy
                  </a>
                </div>

                <div className="flex justify-center items-center space-x-6">
                  <div className="flex items-center space-x-2">
                    <Shield className="w-4 h-4 text-accent" />
                    <span className="text-sm text-secondary-foreground">Stripe</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CreditCard className="w-4 h-4 text-accent" />
                    <span className="text-sm text-secondary-foreground">Visa • MC • AmEx</span>
                  </div>
                </div>

                <p className="text-xs text-secondary-foreground">
                  Refunds only for duplicate/accidental charges.{" "}
                  <a href="/terms" className="underline hover:text-primary">
                    See Terms
                  </a>
                  .
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