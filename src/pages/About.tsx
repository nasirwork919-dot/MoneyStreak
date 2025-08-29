import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Link } from "react-router-dom";
import { Heart, Shield, Users, Award, DollarSign, Calendar, ExternalLink, CheckCircle, Trophy, Brain, X } from "lucide-react";

const values = [
  {
    icon: Shield,
    title: "Complete Transparency",
    description: "Every draw is verifiable with cryptographic proof. No hidden processes, no secrets, no manipulation possible."
  },
  {
    icon: Users,
    title: "Community First",
    description: "We believe everyone deserves a fair shot at life-changing opportunities, regardless of their background."
  },
  {
    icon: Award,
    title: "Responsible Gaming",
    description: "We promote healthy participation with clear rules, support resources, and genuine free entry methods."
  },
  {
    icon: Heart,
    title: "Giving Back",
    description: "15% of proceeds supports community causes because winning should create positive ripple effects."
  }
];

const founders = [
  {
    name: "Alex Johnson",
    role: "Co-Founder & CEO",
    bio: "Former fintech engineer at Goldman Sachs with 8 years of experience in transparent financial systems. Passionate about democratizing opportunity and building trust through technology.",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
    background: "MIT Computer Science, Goldman Sachs Fintech Division"
  },
  {
    name: "Sarah Chen",
    role: "Co-Founder & CTO",
    bio: "Blockchain security expert and former cryptographer at the NSA. Committed to building verifiable random systems that restore trust in chance-based platforms.",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400&h=400&fit=crop&crop=face",
    linkedin: "#",
    background: "Stanford Mathematics PhD, NSA Cryptography Division"
  }
];

const charityPartners = [
  {
    id: 1,
    name: "Feeding America",
    description: "The largest hunger-relief organization in the United States, providing food assistance to millions of Americans through food banks, food pantries, and meal programs.",
    logo: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=200&h=200&fit=crop",
    website: "feedingamerica.org",
    focusArea: "Hunger Relief & Food Security",
    partnershipStart: "January 2025",
    totalDonated: 15750,
    impact: "Provided 47,250 meals to families in need",
    programs: ["Mobile Food Pantries", "School Backpack Programs", "Senior Food Assistance"]
  },
  {
    id: 2,
    name: "Boys & Girls Clubs of America",
    description: "Provides safe places for kids and teens to learn, grow, and develop into productive, caring, responsible citizens through after-school and summer programs.",
    logo: "https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=200&h=200&fit=crop",
    website: "bgca.org",
    focusArea: "Youth Development & Education",
    partnershipStart: "January 2025",
    totalDonated: 12300,
    impact: "Supported 410 at-risk youth with educational programs",
    programs: ["STEM Education", "College Prep", "Leadership Development"]
  },
  {
    id: 3,
    name: "Habitat for Humanity",
    description: "Builds affordable housing and promotes homeownership as a means to break the cycle of poverty. Partners with families to build strength, stability and independence.",
    logo: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=200&h=200&fit=crop",
    website: "habitat.org",
    focusArea: "Affordable Housing & Community Development",
    partnershipStart: "February 2025",
    totalDonated: 18900,
    impact: "Helped build 3 homes for low-income families",
    programs: ["Home Construction", "Home Repairs", "Financial Literacy"]
  },
  {
    id: 4,
    name: "American Red Cross",
    description: "Provides emergency assistance, disaster relief, and disaster preparedness education in communities across the United States and internationally.",
    logo: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=200&h=200&fit=crop",
    website: "redcross.org",
    focusArea: "Disaster Relief & Emergency Response",
    partnershipStart: "February 2025",
    totalDonated: 9800,
    impact: "Supported disaster relief efforts for 2,450 families",
    programs: ["Disaster Response", "Blood Drives", "Emergency Preparedness"]
  },
  {
    id: 5,
    name: "United Way",
    description: "Fights for the health, education, and financial stability of every person in every community. Focuses on creating long-lasting change by addressing root causes of problems.",
    logo: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=200&h=200&fit=crop",
    website: "unitedway.org",
    focusArea: "Community Health & Financial Stability",
    partnershipStart: "March 2025",
    totalDonated: 11200,
    impact: "Funded financial literacy programs for 560 families",
    programs: ["Financial Coaching", "Job Training", "Healthcare Access"]
  }
];

const milestones = [
  {
    date: "January 2025",
    title: "BigMoney Founded",
    description: "Two friends launch transparent sweepstakes platform with cryptographic verification"
  },
  {
    date: "February 2025", 
    title: "First Draw Completed",
    description: "Successfully conducted first $700 draw with 89 participants and full verification"
  },
  {
    date: "March 2025",
    title: "Charity Partnerships",
    description: "Established partnerships with 5 major charity organizations for community impact"
  },
  {
    date: "April 2025",
    title: "1,000 Participants",
    description: "Reached milestone of 1,000 registered participants across all draws"
  },
  {
    date: "May 2025",
    title: "$50,000 in Prizes",
    description: "Paid out over $50,000 in verified prizes to winners across the United States"
  }
];

export default function About() {
  const [selectedCharity, setSelectedCharity] = useState<typeof charityPartners[0] | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Founded by Two Friends with a Vision
            </h1>
            <p className="text-xl text-secondary-foreground max-w-4xl mx-auto mb-12">
              BigMoney began in 2025 with a simple but powerful idea: give everyday people a fair, 
              transparent shot at life-changing cash while using the excitement to fund good in our communities. 
              Every aspect of our platform is designed around trust, verification, and positive impact.
            </p>
            
            <div className="grid md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-primary mb-2">2025</div>
                <div className="text-sm text-secondary-foreground">Year Founded</div>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-success mb-2">$127K+</div>
                <div className="text-sm text-secondary-foreground">Prizes Awarded</div>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-accent mb-2">8,247</div>
                <div className="text-sm text-secondary-foreground">Happy Participants</div>
              </div>
              <div className="glass rounded-lg p-6 text-center">
                <div className="text-3xl font-bold text-warning mb-2">$19K+</div>
                <div className="text-sm text-secondary-foreground">Donated to Charity</div>
              </div>
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                  Our Story
                </h2>
                <div className="space-y-6 text-secondary-foreground text-lg leading-relaxed">
                  <p>
                    We met at MIT in 2018, both studying computer science and dreaming of building something 
                    meaningful. Alex was fascinated by financial systems and transparency, while Sarah was 
                    deep into cryptography and blockchain technology.
                  </p>
                  <p>
                    After graduation, Alex went to Goldman Sachs working on fintech solutions, and Sarah 
                    joined the NSA's cryptography division. But we kept coming back to the same question: 
                    why are so many "chance-based" systems opaque, unverifiable, and hard to trust?
                  </p>
                  <p>
                    The sweepstakes industry was ripe for disruption. People deserved to know their entries 
                    were real, the draws were fair, and winners were genuine. So we combined our expertise 
                    in finance and cryptography to build BigMoney — a platform where every aspect of the 
                    process is mathematically verifiable.
                  </p>
                  <p>
                    But transparency wasn't enough. We wanted to create something that gives back to communities. 
                    That's why 15% of every ticket sold supports carefully vetted charity partners who are 
                    making real differences in people's lives.
                  </p>
                </div>
                
                <div className="mt-8 space-y-4">
                  <Link to="/winners" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="gold" size="lg">
                      <Trophy className="w-5 h-5 mr-2" />
                      Meet Our Winners
                    </PremiumButton>
                  </Link>
                  <Link to="/how-it-works" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="outline" size="lg">
                      <Shield className="w-5 h-5 mr-2" />
                      See Our Process
                    </PremiumButton>
                  </Link>
                </div>
              </div>
              
              <div className="space-y-8">
                <div className="glass rounded-lg p-8">
                  <div className="text-center mb-6">
                    <div className="text-5xl font-display font-bold text-gradient-gold mb-4">
                      2025
                    </div>
                    <h3 className="text-2xl font-display font-semibold mb-4">
                      The Year We Started
                    </h3>
                    <p className="text-secondary-foreground">
                      Founded with the mission to bring unprecedented transparency and 
                      community impact to the sweepstakes industry.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-6 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">100%</div>
                      <div className="text-sm text-secondary-foreground">Transparent Draws</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-success">15%</div>
                      <div className="text-sm text-secondary-foreground">To Charity</div>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div className="glass rounded-lg p-6">
                  <h4 className="text-lg font-display font-semibold mb-4 text-center">Our Journey</h4>
                  <div className="space-y-4">
                    {milestones.slice(0, 3).map((milestone, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <div className="text-sm text-accent font-medium">{milestone.date}</div>
                          <div className="font-semibold">{milestone.title}</div>
                          <div className="text-sm text-secondary-foreground">{milestone.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="pb-16 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Our Core Values
              </h2>
              <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
                These principles guide every decision we make and every feature we build at BigMoney.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="glass rounded-lg p-8 text-center hover-lift">
                  <value.icon className="w-16 h-16 text-primary mx-auto mb-6" />
                  <h3 className="text-xl font-display font-semibold mb-4">
                    {value.title}
                  </h3>
                  <p className="text-secondary-foreground">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Founders Section */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Meet the Founders
              </h2>
              <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
                Two friends with complementary expertise in finance and cryptography, 
                united by a shared vision for transparency and fairness.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {founders.map((founder, index) => (
                <div key={index} className="glass rounded-lg overflow-hidden hover-lift">
                  <div className="relative">
                    <img
                      src={founder.image}
                      alt={founder.name}
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-6 right-6 text-white">
                      <h3 className="text-2xl font-display font-semibold mb-1">
                        {founder.name}
                      </h3>
                      <div className="text-primary font-medium">
                        {founder.role}
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-8">
                    <div className="mb-4">
                      <div className="text-sm text-accent font-medium mb-2">Background:</div>
                      <div className="text-sm text-secondary-foreground">{founder.background}</div>
                    </div>
                    
                    <p className="text-secondary-foreground leading-relaxed mb-6">
                      {founder.bio}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <a 
                        href={founder.linkedin}
                        className="text-primary hover:text-accent underline text-sm flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        LinkedIn Profile
                      </a>
                      <div className="text-xs text-secondary-foreground">
                        Co-Founder since 2025
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Charity Partners Section */}
        <section className="pb-16 bg-surface/30" id="charity">
          <div className="container-premium section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Our Charity Partners
              </h2>
              <p className="text-xl text-secondary-foreground max-w-4xl mx-auto mb-8">
                We allocate 15% of net proceeds to carefully vetted charity partners because we believe 
                winning should create positive ripple effects that extend far beyond individual prizes.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                <div className="glass rounded-lg p-6">
                  <div className="text-4xl font-bold text-primary mb-2">15%</div>
                  <div className="text-sm text-secondary-foreground">of net proceeds donated</div>
                </div>
                <div className="glass rounded-lg p-6">
                  <div className="text-4xl font-bold text-success mb-2">5</div>
                  <div className="text-sm text-secondary-foreground">verified charity partners</div>
                </div>
                <div className="glass rounded-lg p-6">
                  <div className="text-4xl font-bold text-accent mb-2">$67K+</div>
                  <div className="text-sm text-secondary-foreground">donated to date</div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
              {charityPartners.map((partner, index) => (
                <div key={partner.id} className="glass rounded-lg overflow-hidden hover-lift">
                  <div className="p-8">
                    <div className="flex items-start space-x-6 mb-6">
                      <img
                        src={partner.logo}
                        alt={`${partner.name} logo`}
                        className="w-16 h-16 rounded-lg object-cover border border-accent/30"
                      />
                      <div className="flex-1">
                        <h3 className="text-xl font-display font-semibold mb-2">
                          {partner.name}
                        </h3>
                        <div className="text-sm text-accent mb-2">{partner.focusArea}</div>
                        <div className="text-sm text-secondary-foreground">
                          Partner since {partner.partnershipStart}
                        </div>
                      </div>
                    </div>
                    
                    <p className="text-secondary-foreground mb-6 leading-relaxed">
                      {partner.description}
                    </p>
                    
                    <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6">
                      <div className="text-sm text-success font-medium mb-2">Our Impact Together:</div>
                      <div className="text-2xl font-bold text-success mb-1">
                        ${partner.totalDonated.toLocaleString()}
                      </div>
                      <div className="text-sm text-secondary-foreground mb-3">
                        {partner.impact}
                      </div>
                      <div className="text-xs text-secondary-foreground">
                        <strong>Programs supported:</strong> {partner.programs.join(", ")}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <a 
                        href={`https://${partner.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent underline text-sm flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        Visit {partner.website}
                      </a>
                      <button
                        onClick={() => setSelectedCharity(partner)}
                        className="text-accent hover:text-primary text-sm underline"
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Charity Impact Summary */}
            <div className="mt-16 glass rounded-lg p-8 text-center">
              <h3 className="text-2xl font-display font-semibold mb-6">
                Community Impact by the Numbers
              </h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div>
                  <div className="text-3xl font-bold text-primary mb-2">47,250</div>
                  <div className="text-sm text-secondary-foreground">Meals provided to families</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-success mb-2">410</div>
                  <div className="text-sm text-secondary-foreground">Youth supported with education</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-accent mb-2">3</div>
                  <div className="text-sm text-secondary-foreground">Homes built for families</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-warning mb-2">2,450</div>
                  <div className="text-sm text-secondary-foreground">Families helped in disasters</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Charity Detail Modal */}
        {selectedCharity && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="glass rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <img
                      src={selectedCharity.logo}
                      alt={`${selectedCharity.name} logo`}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h2 className="text-2xl font-display font-bold">{selectedCharity.name}</h2>
                      <div className="text-accent">{selectedCharity.focusArea}</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedCharity(null)}
                    className="text-secondary-foreground hover:text-primary"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
                
                <p className="text-secondary-foreground mb-6 leading-relaxed">
                  {selectedCharity.description}
                </p>
                
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <div className="text-sm text-primary font-medium mb-1">Total Donated:</div>
                    <div className="text-2xl font-bold text-primary">
                      ${selectedCharity.totalDonated.toLocaleString()}
                    </div>
                  </div>
                  <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                    <div className="text-sm text-success font-medium mb-1">Partnership:</div>
                    <div className="text-lg font-semibold text-success">
                      Since {selectedCharity.partnershipStart}
                    </div>
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="text-sm text-secondary-foreground mb-2">Programs We Support:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedCharity.programs.map((program, i) => (
                      <span key={i} className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm">
                        {program}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6">
                  <div className="text-sm text-success font-medium mb-2">Real Impact:</div>
                  <div className="text-secondary-foreground">{selectedCharity.impact}</div>
                </div>
                
                <a 
                  href={`https://${selectedCharity.website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full"
                >
                  <PremiumButton variant="gold" className="w-full">
                    <ExternalLink className="w-5 h-5 mr-2" />
                    Visit {selectedCharity.name}
                  </PremiumButton>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mission Section */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">
                Our Mission & Vision
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                <div className="glass rounded-lg p-8 text-left">
                  <h3 className="text-xl font-display font-semibold mb-4 text-primary">Our Mission</h3>
                  <p className="text-secondary-foreground leading-relaxed">
                    To democratize access to life-changing opportunities through completely transparent, 
                    verifiable sweepstakes while creating positive community impact through charitable giving 
                    and responsible gaming practices.
                  </p>
                </div>
                
                <div className="glass rounded-lg p-8 text-left">
                  <h3 className="text-xl font-display font-semibold mb-4 text-success">Our Vision</h3>
                  <p className="text-secondary-foreground leading-relaxed">
                    A world where chance-based opportunities are completely transparent, mathematically 
                    verifiable, and contribute to community wellbeing — proving that business success 
                    and social good can go hand in hand.
                  </p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h3 className="text-xl font-display font-semibold mb-6">Why Transparency Matters</h3>
                <div className="grid md:grid-cols-3 gap-6 text-left">
                  <div>
                    <CheckCircle className="w-8 h-8 text-success mb-3" />
                    <h4 className="font-semibold mb-2">Builds Trust</h4>
                    <p className="text-sm text-secondary-foreground">
                      When you can verify every step, you know the process is fair and legitimate.
                    </p>
                  </div>
                  <div>
                    <CheckCircle className="w-8 h-8 text-success mb-3" />
                    <h4 className="font-semibold mb-2">Prevents Fraud</h4>
                    <p className="text-sm text-secondary-foreground">
                      Cryptographic verification makes manipulation mathematically impossible.
                    </p>
                  </div>
                  <div>
                    <CheckCircle className="w-8 h-8 text-success mb-3" />
                    <h4 className="font-semibold mb-2">Empowers Participants</h4>
                    <p className="text-sm text-secondary-foreground">
                      You're not just hoping we're honest — you can prove we are.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Referral Program Section */}
        <section className="pb-16 bg-surface/30" id="referral">
          <div className="container-premium section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Referral Program: Everyone Wins
              </h2>
              <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
                Our referral system creates a win-win-win scenario: you earn free tickets, 
                your friends get entered in draws, and our community grows stronger.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-3 gap-8 mb-12">
                <div className="glass rounded-lg p-8 text-center hover-lift">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-4">You Purchase First</h3>
                  <p className="text-secondary-foreground">
                    Buy at least one ticket to unlock your unique referral link and start earning free entries.
                  </p>
                </div>
                
                <div className="glass rounded-lg p-8 text-center hover-lift">
                  <div className="w-16 h-16 bg-success/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-success">2</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-4">Friends Use Your Link</h3>
                  <p className="text-secondary-foreground">
                    Share your referral link with friends. When they make their first purchase, magic happens.
                  </p>
                </div>
                
                <div className="glass rounded-lg p-8 text-center hover-lift">
                  <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-2xl font-bold text-accent">3</span>
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-4">Everyone Gets Rewarded</h3>
                  <p className="text-secondary-foreground">
                    You earn a free ticket, they get entered in the draw, and our community grows stronger.
                  </p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h3 className="text-xl font-display font-semibold mb-6 text-center">Referral Program Benefits</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4 text-primary">For You (Referrer):</h4>
                    <ul className="space-y-2 text-sm text-secondary-foreground">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Earn 1 free ticket per successful referral</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>No limit on free tickets you can earn</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Track all referrals in your dashboard</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Free tickets applied to next available draw</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-4 text-success">For Your Friends:</h4>
                    <ul className="space-y-2 text-sm text-secondary-foreground">
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Same great prizes and transparent process</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Get their own referral link after first purchase</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Join a trusted community of participants</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-success" />
                        <span>Access to free quiz entry method</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Join Our Community
            </h2>
            <p className="text-xl text-secondary-foreground mb-8 max-w-3xl mx-auto">
              Be part of something bigger than just winning prizes. Join a community that values 
              transparency, fairness, and giving back.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              <Link to="/buy?tier=3" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="hero" size="xl" className="w-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  Enter $700 Draw
                </PremiumButton>
              </Link>
              <Link to="/buy?tier=5" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="hero" size="xl" className="w-full">
                  <Trophy className="w-5 h-5 mr-2" />
                  Enter $1,000 Draw
                </PremiumButton>
              </Link>
              <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="outline" size="xl" className="w-full">
                  <Brain className="w-5 h-5 mr-2" />
                  Try Free Quiz
                </PremiumButton>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="glass" size="lg" className="flex-1">
                  Contact Us
                </PremiumButton>
              </Link>
              <Link to="/rules" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="outline" size="lg" className="flex-1">
                  Read Official Rules
                </PremiumButton>
              </Link>
            </div>
            
            <p className="text-sm text-secondary-foreground mt-8">
              Questions about our mission or charity partnerships? 
              <Link to="/contact" onClick={() => window.scrollTo(0, 0)} className="text-primary hover:text-accent underline ml-1">
                We'd love to hear from you
              </Link>
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}