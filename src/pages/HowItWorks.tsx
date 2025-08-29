import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Link } from "react-router-dom";
import { 
  Ticket, 
  Hash, 
  Calendar, 
  DollarSign, 
  Shield, 
  Eye, 
  Trophy, 
  Clock,
  Users,
  CheckCircle,
  AlertTriangle,
  Download,
  Play,
  ExternalLink,
  Calculator,
  Lock,
  Award,
  Brain
} from "lucide-react";

const processSteps = [
  {
    icon: Ticket,
    title: "Enter the Contest",
    description: "Multiple ways to participate in our transparent sweepstakes system.",
    details: [
      "Purchase $3 tickets for $700 monthly draw (20th of each month)",
      "Purchase $5 tickets for $1,000 monthly draw (30th of each month)", 
      "Take our challenging free quiz (10 extremely difficult questions)",
      "Earn free tickets through our referral program",
      "Mail-in option available (see Official Rules for details)"
    ],
    timeline: "Instant entry confirmation with unique entry number",
    tips: "Buy multiple tickets to increase your odds, or challenge yourself with the free quiz!"
  },
  {
    icon: Hash,
    title: "Transparent Tracking",
    description: "Every entry is tracked with cryptographic precision and full transparency.",
    details: [
      "Receive unique entry number via email immediately",
      "Track all your entries in your personal dashboard",
      "View real-time countdown to next draw",
      "See total participants and your odds",
      "Access complete entry history and status updates"
    ],
    timeline: "Real-time updates throughout the entry period",
    tips: "Check your dashboard regularly to see how many people have entered and your current odds!"
  },
  {
    icon: Calendar,
    title: "Verifiable Draw Process",
    description: "Monthly draws using cryptographically secure random selection with public verification.",
    details: [
      "Participant list frozen 24 hours before draw",
      "SHA256 hash of participant list published publicly",
      "Random seed generated using atmospheric noise",
      "Winner selected using verifiable computation",
      "Complete audit trail published within 1 hour"
    ],
    timeline: "$700 draws on 20th, $1,000 draws on 30th at 12:00 PM EST",
    tips: "Watch our live streams or verify results yourself using our published data!"
  },
  {
    icon: DollarSign,
    title: "Winner Verification & Payment",
    description: "Winners announced immediately with complete verification and fast payment processing.",
    details: [
      "Winner contacted within 24 hours via email and phone",
      "Public announcement with winner's permission",
      "Complete verification documentation published",
      "Payment processed within 14 days of verification",
      "Tax forms provided for prizes $600 and above"
    ],
    timeline: "Payment within 14 days, public verification within 48 hours",
    tips: "Winners must respond within 7 days to claim their prize!"
  }
];

const verificationSteps = [
  {
    step: 1,
    title: "Download Participant List",
    description: "Get the complete list of all entries for any draw",
    action: "Download CSV file from our winners page"
  },
  {
    step: 2,
    title: "Verify Hash",
    description: "Compute SHA256 hash of the participant list",
    action: "Use any SHA256 calculator to verify our published hash"
  },
  {
    step: 3,
    title: "Apply Random Seed",
    description: "Use our published random seed with the participant list",
    action: "Follow our open-source verification script"
  },
  {
    step: 4,
    title: "Confirm Winner",
    description: "Verify the selected winner matches our announcement",
    action: "Compare your result with our published winner"
  }
];

const faqs = [
  {
    question: "How are winners actually selected?",
    answer: "We use a cryptographically secure process: 1) Freeze participant list 24 hours before draw, 2) Publish SHA256 hash of the list, 3) Generate random seed using atmospheric noise, 4) Apply seed to list using modular arithmetic, 5) Publish complete verification data. You can verify every step yourself."
  },
  {
    question: "What makes the free quiz legitimate?",
    answer: "Our quiz contains 10 extremely difficult questions across various subjects. You have 40 seconds per question, can't go back, and must get ALL 10 correct. This ensures it's a genuine skill-based challenge, not a participation trophy. Only about 2-3% of attempts result in free tickets."
  },
  {
    question: "How do referrals work exactly?",
    answer: "After your first purchase, you get a unique referral link. When someone uses your link and makes their first purchase, you both benefit: they get entered in the draw, and you earn a free ticket for the next applicable draw. It's a win-win system that builds our community."
  },
  {
    question: "Can I really verify the draw results myself?",
    answer: "Absolutely! We publish participant list hashes, random seeds, and result hashes for every draw. You can download our verification script, input the data, and confirm the winner selection yourself. This level of transparency is unprecedented in the sweepstakes industry."
  },
  {
    question: "What happens if I win?",
    answer: "Winners are contacted within 24 hours via email and phone. We verify your identity, announce your win publicly (with permission), and process payment within 14 days. You'll also receive complete documentation of the draw process and your verification data."
  },
  {
    question: "How do you ensure fairness?",
    answer: "Multiple safeguards: 1) Cryptographic random selection, 2) Public verification data, 3) Independent audit trails, 4) Real-time participant tracking, 5) Community oversight. Every aspect of our process is designed for maximum transparency and fairness."
  }
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [showVerification, setShowVerification] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              How BigMoney Works
            </h1>
            <p className="text-xl text-secondary-foreground max-w-4xl mx-auto mb-12">
              Complete transparency from entry to payout. Every step is verifiable, every winner is real, 
              and every draw is cryptographically secure. Here's exactly how our process works.
            </p>
            
            <div className="glass rounded-lg p-8 max-w-3xl mx-auto">
              <h3 className="text-xl font-display font-semibold mb-4">Quick Overview</h3>
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div className="text-left space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>$700 draws every 20th of the month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>$1,000 draws every 30th of the month</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Multiple entry methods available</span>
                  </div>
                </div>
                <div className="text-left space-y-2">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Cryptographically verifiable draws</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>Winners paid within 14 days</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-success" />
                    <span>15% of proceeds support charity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Process Steps */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="space-y-16">
              {processSteps.map((step, index) => (
                <div key={index} className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className={`${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                    <div className="flex items-center space-x-4 mb-6">
                      <div className="glass w-16 h-16 rounded-full flex items-center justify-center">
                        <step.icon className="w-8 h-8 text-primary" />
                      </div>
                      <div>
                        <div className="text-sm text-accent font-medium">Step {index + 1}</div>
                        <h3 className="text-2xl font-display font-bold">{step.title}</h3>
                      </div>
                    </div>
                    
                    <p className="text-lg text-secondary-foreground mb-6">
                      {step.description}
                    </p>
                    
                    <ul className="space-y-3 mb-6">
                      {step.details.map((detail, i) => (
                        <li key={i} className="flex items-start space-x-3">
                          <CheckCircle className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-secondary-foreground">{detail}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mb-4">
                      <div className="text-sm text-primary font-medium mb-1">Timeline:</div>
                      <div className="text-sm text-secondary-foreground">{step.timeline}</div>
                    </div>
                    
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                      <div className="text-sm text-accent font-medium mb-1">Pro Tip:</div>
                      <div className="text-sm text-secondary-foreground">{step.tips}</div>
                    </div>
                  </div>
                  
                  <div className={`${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                    <div className="glass rounded-lg p-8 text-center">
                      <step.icon className="w-24 h-24 text-primary mx-auto mb-6" />
                      <div className="text-6xl font-bold text-gradient-gold mb-4">
                        {index + 1}
                      </div>
                      <div className="text-lg font-display font-semibold text-secondary-foreground">
                        {step.title}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Verification Section */}
        <section className="pb-16 bg-surface/30" id="verification">
          <div className="container-premium section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Independent Verification Process
              </h2>
              <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
                Don't just trust us — verify every draw yourself using our published cryptographic data.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {verificationSteps.map((step, index) => (
                  <div key={index} className="glass rounded-lg p-6 hover-lift">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold">
                        {step.step}
                      </div>
                      <h3 className="text-lg font-display font-semibold">{step.title}</h3>
                    </div>
                    <p className="text-secondary-foreground mb-4">{step.description}</p>
                    <div className="bg-accent/10 border border-accent/30 rounded-lg p-3">
                      <div className="text-sm text-accent font-medium">{step.action}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-center">
                <div className="glass rounded-lg p-8">
                  <h3 className="text-xl font-display font-semibold mb-4">Verification Tools</h3>
                  <p className="text-secondary-foreground mb-6">
                    We provide all the tools and data you need to independently verify our draws.
                  </p>
                  <div className="flex flex-wrap justify-center gap-4">
                    <PremiumButton variant="gold" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download Verification Script
                    </PremiumButton>
                    <PremiumButton variant="outline" size="sm">
                      <Calculator className="w-4 h-4 mr-2" />
                      SHA256 Calculator
                    </PremiumButton>
                    <PremiumButton variant="glass" size="sm">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Technical Documentation
                    </PremiumButton>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Entry Methods Deep Dive */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Entry Methods Explained
              </h2>
              <p className="text-xl text-secondary-foreground">
                Choose the entry method that works best for you. All methods have equal chances of winning.
              </p>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Paid Entry */}
              <div className="glass rounded-lg p-8 hover-lift">
                <DollarSign className="w-12 h-12 text-primary mx-auto mb-6" />
                <h3 className="text-2xl font-display font-semibold mb-4 text-center">Paid Entry</h3>
                
                <div className="space-y-4 mb-6">
                  <div className="bg-primary/10 border border-primary/30 rounded-lg p-4">
                    <div className="text-lg font-bold text-primary mb-1">$3 Ticket → $700 Prize</div>
                    <div className="text-sm text-secondary-foreground">Draw every 20th of the month</div>
                  </div>
                  <div className="bg-success/10 border border-success/30 rounded-lg p-4">
                    <div className="text-lg font-bold text-success mb-1">$5 Ticket → $1,000 Prize</div>
                    <div className="text-sm text-secondary-foreground">Draw every 30th of the month</div>
                  </div>
                </div>

                <ul className="space-y-2 text-sm text-secondary-foreground mb-6">
                  <li>• Instant entry confirmation</li>
                  <li>• Secure Stripe payment processing</li>
                  <li>• Maximum 10 tickets per person per draw</li>
                  <li>• Immediate dashboard tracking</li>
                  <li>• Email receipt and entry number</li>
                </ul>

                <Link to="/buy" onClick={() => window.scrollTo(0, 0)}>
                  <PremiumButton variant="hero" className="w-full">
                    Buy Tickets Now
                  </PremiumButton>
                </Link>
              </div>

              {/* Free Quiz Entry */}
              <div className="glass rounded-lg p-8 hover-lift">
                <Trophy className="w-12 h-12 text-success mx-auto mb-6" />
                <h3 className="text-2xl font-display font-semibold mb-4 text-center">Free Quiz Entry</h3>
                
                <div className="bg-success/10 border border-success/30 rounded-lg p-4 mb-6">
                  <div className="text-lg font-bold text-success mb-1">100% Free Entry Method</div>
                  <div className="text-sm text-secondary-foreground">Earn $5 ticket for $700 draw</div>
                </div>

                <ul className="space-y-2 text-sm text-secondary-foreground mb-6">
                  <li>• 10 extremely difficult questions</li>
                  <li>• 40-second timer per question</li>
                  <li>• Must get ALL answers correct</li>
                  <li>• One attempt per 24-hour period</li>
                  <li>• No going back to previous questions</li>
                  <li>• Only ~2-3% success rate</li>
                </ul>

                <div className="bg-warning/10 border border-warning/30 rounded-lg p-3 mb-6">
                  <div className="text-xs text-warning font-medium">Challenge Level: Expert</div>
                  <div className="text-xs text-secondary-foreground">Questions cover science, history, math, geography, and more</div>
                </div>

                <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                  <PremiumButton variant="outline" className="w-full">
                    Take the Challenge
                  </PremiumButton>
                </Link>
              </div>

              {/* Referral Entry */}
              <div className="glass rounded-lg p-8 hover-lift">
                <Users className="w-12 h-12 text-accent mx-auto mb-6" />
                <h3 className="text-2xl font-display font-semibold mb-4 text-center">Referral Program</h3>
                
                <div className="bg-accent/10 border border-accent/30 rounded-lg p-4 mb-6">
                  <div className="text-lg font-bold text-accent mb-1">Earn Free Tickets</div>
                  <div className="text-sm text-secondary-foreground">When friends make purchases</div>
                </div>

                <ul className="space-y-2 text-sm text-secondary-foreground mb-6">
                  <li>• Get unique referral link after first purchase</li>
                  <li>• Earn 1 free ticket per friend conversion</li>
                  <li>• Your friend gets entered, you get rewarded</li>
                  <li>• No limit on referral earnings</li>
                  <li>• Track conversions in your dashboard</li>
                </ul>

                <div className="space-y-3">
                  <Link to="/dashboard" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="glass" className="w-full">
                      Get Your Referral Link
                    </PremiumButton>
                  </Link>
                  <div className="text-xs text-secondary-foreground text-center">
                    Must purchase at least one ticket first
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Technical Transparency */}
        <section className="pb-16 bg-surface/30">
          <div className="container-premium section-padding">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Technical Transparency
              </h2>
              <p className="text-xl text-secondary-foreground max-w-3xl mx-auto">
                We use cutting-edge cryptographic methods to ensure every draw is fair, 
                verifiable, and impossible to manipulate.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
              <div>
                <h3 className="text-2xl font-display font-semibold mb-6">Our Verification Process</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: Lock,
                      title: "Participant List Hashing",
                      description: "We create a SHA256 hash of all participants and publish it before the draw"
                    },
                    {
                      icon: Award,
                      title: "Random Seed Generation", 
                      description: "We use atmospheric noise to generate truly random seeds for winner selection"
                    },
                    {
                      icon: Calculator,
                      title: "Verifiable Computation",
                      description: "Winner selection uses modular arithmetic that anyone can verify independently"
                    },
                    {
                      icon: Eye,
                      title: "Public Audit Trail",
                      description: "Complete verification data published within 1 hour of each draw"
                    }
                  ].map((item, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <item.icon className="w-6 h-6 text-primary mt-1" />
                      <div>
                        <h4 className="font-semibold mb-1">{item.title}</h4>
                        <p className="text-sm text-secondary-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="glass rounded-lg p-8">
                <h4 className="text-xl font-display font-semibold mb-4 text-center">Sample Verification Data</h4>
                <div className="space-y-4 text-sm">
                  <div>
                    <div className="text-secondary-foreground mb-1">Participant List Hash:</div>
                    <div className="font-mono bg-surface/50 p-2 rounded text-xs break-all">
                      a1b2c3d4e5f6789012345678901234567890abcdef1234567890abcdef123456
                    </div>
                  </div>
                  <div>
                    <div className="text-secondary-foreground mb-1">Random Seed:</div>
                    <div className="font-mono bg-surface/50 p-2 rounded text-xs break-all">
                      dGhpcyBpcyBhIHNhbXBsZSBzZWVkIGZvciBkZW1vIHB1cnBvc2Vz
                    </div>
                  </div>
                  <div>
                    <div className="text-secondary-foreground mb-1">Result Hash:</div>
                    <div className="font-mono bg-surface/50 p-2 rounded text-xs break-all">
                      9876543210fedcba0987654321fedcba09876543210fedcba0987654321fedcba
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 text-center">
                  <PremiumButton variant="outline" size="sm" onClick={() => setShowVerification(!showVerification)}>
                    {showVerification ? 'Hide' : 'Show'} Verification Steps
                  </PremiumButton>
                </div>
              </div>
            </div>

            {showVerification && (
              <div className="glass rounded-lg p-8 animate-fade-in">
                <h3 className="text-xl font-display font-semibold mb-6 text-center">
                  How to Verify Results Yourself
                </h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {verificationSteps.map((step, index) => (
                    <div key={index} className="text-center">
                      <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                        {step.step}
                      </div>
                      <h4 className="font-semibold mb-2">{step.title}</h4>
                      <p className="text-sm text-secondary-foreground mb-3">{step.description}</p>
                      <div className="text-xs text-accent">{step.action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-16">
          <div className="container-premium">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Frequently Asked Questions
              </h2>
              <p className="text-xl text-secondary-foreground">
                Everything you need to know about our transparent process and how to participate.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-6">
              {faqs.map((faq, index) => (
                <div key={index} className="glass rounded-lg p-6 hover-lift">
                  <h3 className="text-lg font-display font-semibold mb-3 text-primary">
                    {faq.question}
                  </h3>
                  <p className="text-secondary-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-12">
              <Link to="/faq" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="outline" size="lg">
                  View Complete FAQ
                </PremiumButton>
              </Link>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section-padding bg-gradient-to-r from-background via-surface/50 to-background">
          <div className="container-premium text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Participate?
            </h2>
            <p className="text-xl text-secondary-foreground mb-8 max-w-3xl mx-auto">
              Now that you understand our transparent process, choose your entry method and 
              join thousands of participants in our verifiable sweepstakes.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-8">
              <Link to="/buy?tier=3" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="hero" size="xl" className="w-full">
                  <Calendar className="w-5 h-5 mr-2" />
                  $3 → $700 Prize (20th)
                </PremiumButton>
              </Link>
              <Link to="/buy?tier=5" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="hero" size="xl" className="w-full">
                  <Trophy className="w-5 h-5 mr-2" />
                  $5 → $1,000 Prize (30th)
                </PremiumButton>
              </Link>
              <Link to="/quiz" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="outline" size="xl" className="w-full">
                  <Trophy className="w-5 h-5 mr-2" />
                  Free Quiz Challenge
                </PremiumButton>
              </Link>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
              <Link to="/winners" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="glass" size="lg" className="flex-1">
                  <Eye className="w-5 h-5 mr-2" />
                  See All Winners
                </PremiumButton>
              </Link>
              <Link to="/rules" onClick={() => window.scrollTo(0, 0)}>
                <PremiumButton variant="outline" size="lg" className="flex-1">
                  <Shield className="w-5 h-5 mr-2" />
                  Read Official Rules
                </PremiumButton>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}