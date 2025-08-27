import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Download, Play, Eye, Trophy, Calendar } from "lucide-react";

const winners = [
  {
    id: 1,
    name: "Sarah L.",
    state: "TX",
    amount: 700,
    date: "Feb 20, 2025",
    quote: "I can't believe it! This is going to help with my student loans.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 2,
    name: "Marcus R.",
    state: "CA",
    amount: 1000,
    date: "Jan 30, 2025",
    quote: "Transparent and fair - exactly what I hoped for!",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 3,
    name: "Jennifer M.",
    state: "NY",
    amount: 700,
    date: "Jan 20, 2025",
    quote: "The verification process gave me complete confidence.",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 4,
    name: "David K.",
    state: "FL",
    amount: 1000,
    date: "Dec 30, 2024",
    quote: "BigMoney delivers on their promises - highly recommended!",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 5,
    name: "Lisa W.",
    state: "WA",
    amount: 700,
    date: "Dec 20, 2024",
    quote: "The draw was completely transparent and verifiable.",
    image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=400&h=400&fit=crop&crop=face"
  },
  {
    id: 6,
    name: "Robert H.",
    state: "IL",
    amount: 1000,
    date: "Nov 30, 2024",
    quote: "Amazing platform - fair, honest, and life-changing!",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face"
  }
];

const drawProofs = [
  {
    id: "2025-02-20",
    title: "$700 — Feb 20, 2025",
    participantsHash: "a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456",
    seed: "dGhpcyBpcyBhIHNhbXBsZSBzZWVkIGZvciBkZW1vIHB1cnBvc2Vz",
    resultHash: "9876543210fedcba0987654321fedcba09876543210fedcba0987654321fedcba"
  },
  {
    id: "2025-01-30",
    title: "$1,000 — Jan 30, 2025",
    participantsHash: "b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef1234567a",
    seed: "YW5vdGhlciBzYW1wbGUgc2VlZCBmb3IgZGVtb25zdHJhdGlvbg==",
    resultHash: "8765432109edcba098765432109edcba098765432109edcba098765432109edcba"
  }
];

export default function Winners() {
  const [selectedTab, setSelectedTab] = useState("latest");

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
            
            {/* Tabs */}
            <div className="flex justify-center mb-12">
              <div className="glass rounded-lg p-1 inline-flex">
                {["Latest", "2025", "2024"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedTab(tab.toLowerCase())}
                    className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${
                      selectedTab === tab.toLowerCase()
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
              {winners.map((winner) => (
                <div key={winner.id} className="glass rounded-lg p-6 hover-lift cursor-pointer">
                  <div className="relative mb-4">
                    <img
                      src={winner.image}
                      alt={`Winner ${winner.name}`}
                      className="w-20 h-20 rounded-full mx-auto object-cover"
                    />
                    <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                      ${winner.amount.toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <h3 className="font-semibold text-lg mb-1">
                      {winner.name} ({winner.state})
                    </h3>
                    <div className="flex items-center justify-center space-x-2 text-sm text-secondary-foreground mb-3">
                      <Calendar className="w-4 h-4" />
                      <span>{winner.date}</span>
                    </div>
                    <p className="text-sm text-secondary-foreground italic">
                      "{winner.quote}"
                    </p>
                  </div>
                </div>
              ))}
            </div>
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
                      <div className="flex items-center space-x-4 text-sm text-secondary-foreground">
                        <div className="flex items-center space-x-2">
                          <Trophy className="w-4 h-4" />
                          <span>Winner Selected</span>
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

        {/* CTA Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Join Our Winners?
            </h2>
            <p className="text-xl text-secondary-foreground mb-8">
              Enter now for your chance at life-changing prizes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <PremiumButton variant="hero" size="lg" className="flex-1">
                Enter $3 Draw
              </PremiumButton>
              <PremiumButton variant="hero" size="lg" className="flex-1">
                Enter $5 Draw
              </PremiumButton>
            </div>
            
            <p className="text-sm text-secondary-foreground mt-4">
              Or try the <a href="/quiz" className="text-primary hover:text-accent underline">free quiz</a>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}