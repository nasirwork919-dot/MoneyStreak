import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Ticket, Hash, Calendar, DollarSign, Shield, Eye, Trophy } from "lucide-react";

const steps = [
  {
    icon: Ticket,
    title: "Enter",
    description: "Buy tickets or take the free quiz to enter our transparent sweepstakes.",
    details: [
      "Purchase $3 or $5 tickets online",
      "Or answer quiz questions correctly",
      "Mail-in option available in Official Rules"
    ]
  },
  {
    icon: Hash,
    title: "Track",
    description: "Get your entry number and track it in your dashboard with full transparency.",
    details: [
      "Unique entry ID sent via email",
      "View all entries in your dashboard",
      "Real-time status updates"
    ]
  },
  {
    icon: Calendar,
    title: "Draw",
    description: "Monthly draws on the 20th and 30th with verifiable random selection.",
    details: [
      "$700 prize drawn on the 20th",
      "$1,000 prize drawn on the 30th",
      "Cryptographically verifiable process"
    ]
  },
  {
    icon: DollarSign,
    title: "Proof",
    description: "Winners posted with complete verification and audit trails within 14 days.",
    details: [
      "Winner announced publicly",
      "Complete audit logs published",
      "Payment processed within 14 days"
    ]
  }
];

const features = [
  {
    icon: Shield,
    title: "Transparent Process",
    description: "Every draw uses cryptographic hashing and public verification"
  },
  {
    icon: Eye,
    title: "Public Verification",
    description: "Download participant lists and verify results yourself"
  },
  {
    icon: Trophy,
    title: "Real Winners",
    description: "Meet our winners and see their proof of payment"
  }
];

const faqs = [
  {
    question: "How are winners selected?",
    answer: "We use a cryptographically secure random number generator with published seeds and participant list hashes for complete transparency."
  },
  {
    question: "When do draws happen?",
    answer: "$700 draws occur on the 20th of each month, and $1,000 draws occur on the 30th of each month."
  },
  {
    question: "How can I verify the results?",
    answer: "We publish participant list hashes, random seeds, and result hashes for each draw. You can independently verify the winner selection process."
  }
];

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              How It Works
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-12">
              Four simple steps to transparent, verifiable sweepstakes that change lives.
            </p>
          </div>
        </section>

        {/* Steps Section */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="grid lg:grid-cols-4 gap-8 mb-16">
              {steps.map((step, index) => (
                <div key={index} className="text-center">
                  <div className="relative mb-6">
                    <div className="glass w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 hover-lift">
                      <step.icon className="w-10 h-10 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-display font-semibold mb-4">
                    {step.title}
                  </h3>
                  
                  <p className="text-secondary-foreground mb-6">
                    {step.description}
                  </p>
                  
                  <ul className="space-y-2 text-sm text-secondary-foreground">
                    {step.details.map((detail, i) => (
                      <li key={i} className="flex items-center justify-center space-x-2">
                        <div className="w-1.5 h-1.5 bg-accent rounded-full"></div>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Connection Lines for Desktop */}
            <div className="hidden lg:block relative -mt-32 mb-16">
              <div className="absolute top-10 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-accent/50 to-accent/50"></div>
              <div className="absolute top-10 left-1/2 right-1/4 h-0.5 bg-gradient-to-r from-accent/50 to-accent/50 transform -translate-x-1/4"></div>
              <div className="absolute top-10 left-3/4 right-0 h-0.5 bg-gradient-to-r from-accent/50 to-accent/50 transform -translate-x-1/4"></div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="pb-24 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Why BigMoney is Different
              </h2>
              <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
                Complete transparency, verifiable draws, and real community impact.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="glass rounded-lg p-8 text-center hover-lift">
                  <feature.icon className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-display font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-secondary-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-secondary-foreground">
                Everything you need to know about our transparent process.
              </p>
            </div>

            <div className="max-w-3xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass rounded-lg p-6">
                  <h3 className="text-lg font-display font-semibold mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-secondary-foreground">
                    {faq.answer}
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
              Ready to Enter?
            </h2>
            <p className="text-xl text-secondary-foreground mb-8">
              Join thousands of participants in our transparent sweepstakes.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto mb-8">
              <PremiumButton variant="hero" size="xl" className="flex-1">
                Enter $3 — $700 Draw (20th)
              </PremiumButton>
              <PremiumButton variant="hero" size="xl" className="flex-1">
                Enter $5 — $1,000 Draw (30th)
              </PremiumButton>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <PremiumButton variant="outline" size="lg" className="flex-1">
                Try the Quiz
              </PremiumButton>
              <PremiumButton variant="glass" size="lg" className="flex-1">
                See Winners
              </PremiumButton>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}