import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Shield, Phone, Heart, AlertTriangle } from "lucide-react";

const resources = [
  {
    name: "National Council on Problem Gambling",
    phone: "1-800-522-4700",
    website: "ncpgambling.org",
    description: "24/7 confidential helpline and resources"
  },
  {
    name: "Gamblers Anonymous",
    phone: "1-855-222-5542", 
    website: "gamblersanonymous.org",
    description: "Support groups and recovery programs"
  },
  {
    name: "GamCare",
    phone: "0808-8020-133",
    website: "gamcare.org.uk",
    description: "UK-based support and information"
  }
];

const warningSign = [
  "Spending more money than you can afford",
  "Lying about your sweepstakes participation",
  "Feeling anxious or depressed about entering",
  "Neglecting work, family, or responsibilities",
  "Chasing losses with bigger purchases",
  "Unable to stop or reduce participation"
];

export default function ResponsiblePlay() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Play Responsibly
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-12">
              BigMoney is committed to promoting healthy participation. We provide tools, 
              resources, and support for responsible play.
            </p>
          </div>
        </section>

        {/* Key Principles */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="glass rounded-lg p-8 text-center hover-lift">
                <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold mb-4">
                  18+ Only
                </h3>
                <p className="text-secondary-foreground">
                  Our sweepstakes are strictly for adults 18 and older. We verify age during registration.
                </p>
              </div>
              
              <div className="glass rounded-lg p-8 text-center hover-lift">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold mb-4">
                  Set Limits
                </h3>
                <p className="text-secondary-foreground">
                  Only spend what you can afford. Sweepstakes should be entertainment, not investment.
                </p>
              </div>
              
              <div className="glass rounded-lg p-8 text-center hover-lift">
                <Phone className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-xl font-display font-semibold mb-4">
                  Get Help
                </h3>
                <p className="text-secondary-foreground">
                  If participation becomes problematic, resources and support are available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Warning Signs */}
        <section className="pb-16 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Warning Signs
                </h2>
                <p className="text-xl text-secondary-foreground">
                  Be aware of these signs that sweepstakes participation may be becoming problematic.
                </p>
              </div>

              <div className="glass rounded-lg p-8">
                <div className="flex items-start space-x-4 mb-6">
                  <AlertTriangle className="w-8 h-8 text-warning flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="text-xl font-display font-semibold mb-4">
                      If You Notice These Signs
                    </h3>
                    <p className="text-secondary-foreground mb-6">
                      It may be time to take a break or seek support:
                    </p>
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  {warningSign.map((sign, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-warning rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary-foreground">{sign}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-warning/10 border border-warning/30 rounded-lg">
                  <p className="text-warning font-medium">
                    If you recognize these signs in yourself or someone you know, please reach out for help.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Support Resources */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Support Resources
              </h2>
              <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
                Professional help and support are available. These organizations provide confidential assistance.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {resources.map((resource, index) => (
                <div key={index} className="glass rounded-lg p-8 hover-lift">
                  <h3 className="text-xl font-display font-semibold mb-4">
                    {resource.name}
                  </h3>
                  <div className="space-y-3 text-secondary-foreground">
                    <div className="flex items-center space-x-3">
                      <Phone className="w-5 h-5 text-primary" />
                      <a 
                        href={`tel:${resource.phone}`}
                        className="text-primary hover:text-accent font-medium"
                      >
                        {resource.phone}
                      </a>
                    </div>
                    <div>
                      <a 
                        href={`https://${resource.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent underline"
                      >
                        {resource.website}
                      </a>
                    </div>
                    <p className="text-sm">{resource.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Our Commitment */}
        <section className="pb-16 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Our Commitment
              </h2>
              <div className="grid md:grid-cols-2 gap-8 text-left">
                <div className="glass rounded-lg p-6">
                  <h3 className="text-xl font-display font-semibold mb-4">
                    Responsible Marketing
                  </h3>
                  <ul className="space-y-2 text-secondary-foreground text-sm">
                    <li>• We don't target vulnerable populations</li>
                    <li>• Our advertising is honest and transparent</li>
                    <li>• We promote our free entry methods prominently</li>
                    <li>• We include responsible play messaging</li>
                  </ul>
                </div>
                
                <div className="glass rounded-lg p-6">
                  <h3 className="text-xl font-display font-semibold mb-4">
                    Player Protection
                  </h3>
                  <ul className="space-y-2 text-secondary-foreground text-sm">
                    <li>• Clear rules and transparent processes</li>
                    <li>• Account limits and cooling-off periods</li>
                    <li>• Easy access to support resources</li>
                    <li>• Staff training on problem gambling signs</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Self-Assessment Tools */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Self-Assessment
              </h2>
              <p className="text-xl text-secondary-foreground mb-8">
                Ask yourself these questions honestly. If you answer "yes" to several, consider seeking support.
              </p>
              
              <div className="glass rounded-lg p-8 text-left">
                <div className="space-y-4">
                  {[
                    "Do you spend more than you planned on sweepstakes?",
                    "Do you feel restless or irritable when not participating?",
                    "Have you tried to cut back but found it difficult?",
                    "Do you participate to escape problems or negative feelings?",
                    "Have you lied to family or friends about your participation?",
                    "Have you neglected important responsibilities to participate?"
                  ].map((question, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-secondary-foreground">{question}</span>
                    </div>
                  ))}
                </div>
                
                <div className="mt-8 p-4 bg-primary/10 border border-primary/30 rounded-lg">
                  <p className="text-primary font-medium text-center">
                    Remember: Seeking help is a sign of strength, not weakness.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="pb-24 bg-surface/30">
          <div className="container-premium section-padding text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Need Support?
            </h2>
            <p className="text-xl text-secondary-foreground mb-8 max-w-2xl mx-auto">
              If you have concerns about your participation or need help, we're here to listen and provide resources.
            </p>
            
            <div className="space-y-4 max-w-md mx-auto">
              <PremiumButton variant="gold" size="lg" className="w-full">
                <Phone className="w-5 h-5 mr-2" />
                Call Support: 1-800-522-4700
              </PremiumButton>
              
              <a href="/contact">
                <PremiumButton variant="glass" size="lg" className="w-full">
                  Contact BigMoney Team
                </PremiumButton>
              </a>
            </div>
            
            <p className="text-sm text-secondary-foreground mt-6">
              All communications are confidential and non-judgmental.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}