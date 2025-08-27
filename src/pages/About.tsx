import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Heart, Shield, Users, Award } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Transparency",
    description: "Every draw is verifiable with cryptographic proof. No hidden processes, no secrets."
  },
  {
    icon: Users,
    title: "Community",
    description: "We believe in giving everyone a fair shot at life-changing opportunities."
  },
  {
    icon: Award,
    title: "Responsible Play",
    description: "We promote healthy participation with clear rules and support resources."
  },
  {
    icon: Heart,
    title: "Giving Back",
    description: "A portion of proceeds supports community causes and local charities."
  }
];

const founders = [
  {
    name: "Alex Johnson",
    role: "Co-Founder & CEO",
    bio: "Former fintech engineer with a passion for transparency and fair play.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  },
  {
    name: "Sarah Chen",
    role: "Co-Founder & CTO",
    bio: "Blockchain security expert committed to verifiable random systems.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face"
  }
];

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Founded by Two Friends
            </h1>
            <p className="text-xl text-secondary-foreground max-w-4xl mx-auto mb-12">
              BigMoney began in 2025 with a simple idea: give everyday people a fair, transparent shot at 
              life-changing cash — and use the excitement to fund good in our communities.
            </p>
          </div>
        </section>

        {/* Story Section */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                  Our Story
                </h2>
                <div className="space-y-6 text-secondary-foreground">
                  <p>
                    We met in college, both studying computer science and dreaming of building something meaningful. 
                    After years in traditional tech, we kept coming back to the same question: why are so many 
                    "chance-based" systems opaque and hard to trust?
                  </p>
                  <p>
                    The sweepstakes industry needed transparency. People deserved to know their entries were real, 
                    the draws were fair, and winners were genuine. So we built BigMoney — a platform where every 
                    aspect of the process is verifiable.
                  </p>
                  <p>
                    But we didn't stop there. We wanted to create something that gives back. That's why a portion 
                    of every ticket sold supports community causes and local charities.
                  </p>
                </div>
                
                <div className="mt-8">
                  <PremiumButton variant="gold" size="lg">
                    See Our Winners
                  </PremiumButton>
                </div>
              </div>
              
              <div className="glass rounded-lg p-8">
                <div className="text-center">
                  <div className="text-5xl font-display font-bold text-gradient-gold mb-4">
                    2025
                  </div>
                  <h3 className="text-2xl font-display font-semibold mb-4">
                    The Year We Started
                  </h3>
                  <p className="text-secondary-foreground mb-6">
                    Founded with the mission to bring transparency and community impact to sweepstakes.
                  </p>
                  
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">100%</div>
                      <div className="text-sm text-secondary-foreground">Transparent Draws</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-primary">$50K+</div>
                      <div className="text-sm text-secondary-foreground">Prizes Awarded</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="pb-24 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Our Values
              </h2>
              <p className="text-xl text-secondary-foreground max-w-2xl mx-auto">
                The principles that guide everything we do at BigMoney.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="glass rounded-lg p-8 text-center hover-lift">
                  <value.icon className="w-12 h-12 text-primary mx-auto mb-6" />
                  <h3 className="text-xl font-display font-semibold mb-4">
                    {value.title}
                  </h3>
                  <p className="text-secondary-foreground text-sm">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Meet the Founders
              </h2>
              <p className="text-xl text-secondary-foreground">
                Two friends with a shared vision for transparency and fairness.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
              {founders.map((founder, index) => (
                <div key={index} className="glass rounded-lg p-8 text-center hover-lift">
                  <img
                    src={founder.image}
                    alt={founder.name}
                    className="w-32 h-32 rounded-full mx-auto mb-6 object-cover"
                  />
                  <h3 className="text-2xl font-display font-semibold mb-2">
                    {founder.name}
                  </h3>
                  <div className="text-primary font-medium mb-4">
                    {founder.role}
                  </div>
                  <p className="text-secondary-foreground">
                    {founder.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Charity Section */}
        <section className="pb-24 bg-surface/30" id="charity">
          <div className="container-premium section-padding">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Giving Back to Communities
              </h2>
              <p className="text-xl text-secondary-foreground mb-12">
                We allocate a portion of proceeds to community causes because we believe 
                winning should create positive ripple effects beyond individual prizes.
              </p>

              <div className="grid md:grid-cols-3 gap-8 mb-12">
                <div className="glass rounded-lg p-6">
                  <div className="text-3xl font-bold text-primary mb-2">15%</div>
                  <div className="text-sm text-secondary-foreground">of net proceeds donated</div>
                </div>
                <div className="glass rounded-lg p-6">
                  <div className="text-3xl font-bold text-primary mb-2">12</div>
                  <div className="text-sm text-secondary-foreground">community partnerships</div>
                </div>
                <div className="glass rounded-lg p-6">
                  <div className="text-3xl font-bold text-primary mb-2">$25K+</div>
                  <div className="text-sm text-secondary-foreground">donated to date</div>
                </div>
              </div>

              <div className="text-secondary-foreground mb-8">
                <h3 className="text-xl font-display font-semibold mb-4">Current Focus Areas</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>• Education and scholarship programs</div>
                  <div>• Local food banks and shelters</div>
                  <div>• Small business support initiatives</div>
                  <div>• Community health and wellness</div>
                </div>
              </div>

              <PremiumButton variant="outline" size="lg">
                Learn About Our Charity Partners
              </PremiumButton>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-secondary-foreground mb-8">
              Be part of something bigger. Win prizes, support causes, build community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto mb-8">
              <PremiumButton variant="hero" size="lg" className="flex-1">
                Enter Now
              </PremiumButton>
              <PremiumButton variant="glass" size="lg" className="flex-1">
                Read Rules
              </PremiumButton>
            </div>
            
            <p className="text-sm text-secondary-foreground">
              Questions? <a href="/contact" className="text-primary hover:text-accent underline">Contact us</a> — we'd love to hear from you.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}