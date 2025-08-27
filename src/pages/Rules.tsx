import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronRight } from "lucide-react";

const sections = [
  { id: "sponsor", title: "Sponsor & Contact Information" },
  { id: "eligibility", title: "Eligibility Requirements" },
  { id: "periods", title: "Entry Periods & Schedule" },
  { id: "entry", title: "How to Enter: Paid & Free Methods" },
  { id: "referral", title: "Referral Program Rules" },
  { id: "selection", title: "Winner Selection & Notification" },
  { id: "prizes", title: "Prizes & Payment Timeline" },
  { id: "odds", title: "Odds of Winning" },
  { id: "publicity", title: "Publicity Release" },
  { id: "disqualification", title: "Disqualification & Fraud Policy" },
  { id: "liability", title: "Limitation of Liability & Disputes" },
  { id: "privacy", title: "Privacy & Data Usage" },
  { id: "governing", title: "Governing Law" },
  { id: "contact-rules", title: "Contact for Official Rules Requests" }
];

export default function Rules() {
  const [activeSection, setActiveSection] = useState("sponsor");

  const scrollToSection = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Official Rules
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-12">
              Complete terms and conditions for BigMoney sweepstakes. Please read carefully 
              before participating.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="container-premium">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Table of Contents */}
              <div className="lg:col-span-1">
                <div className="glass rounded-lg p-6 sticky top-24">
                  <h3 className="text-lg font-display font-semibold mb-4">
                    Table of Contents
                  </h3>
                  <nav className="space-y-2">
                    {sections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left text-sm p-2 rounded hover:bg-accent/10 transition-colors flex items-center justify-between ${
                          activeSection === section.id ? 'text-primary bg-primary/10' : 'text-secondary-foreground'
                        }`}
                      >
                        <span>{section.title}</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Rules Content */}
              <div className="lg:col-span-3 space-y-8">
                <section id="sponsor" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    1. Sponsor & Contact Information
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>
                      <strong>Sponsor:</strong> BigMoney LLC<br />
                      <strong>Address:</strong> [Address to be provided]<br />
                      <strong>Contact Email:</strong> support@bigmoney.com<br />
                      <strong>Rules Requests:</strong> rules@bigmoney.com
                    </p>
                  </div>
                </section>

                <section id="eligibility" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    2. Eligibility Requirements
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>Open to legal residents of the United States who are 18 years of age or older at the time of entry.</p>
                    <p><strong>Excluded:</strong> Employees of BigMoney LLC, their immediate family members, and residents of states where prohibited by law.</p>
                    <p>Void where prohibited or restricted by law.</p>
                  </div>
                </section>

                <section id="periods" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    3. Entry Periods & Schedule
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p><strong>$700 Draw:</strong> Entries accepted monthly. Draw occurs on the 20th of each month at 12:00 PM EST.</p>
                    <p><strong>$1,000 Draw:</strong> Entries accepted monthly. Draw occurs on the 30th of each month at 12:00 PM EST.</p>
                    <p>Entry periods close 24 hours before each draw to allow for verification and preparation.</p>
                  </div>
                </section>

                <section id="entry" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    4. How to Enter: Paid & Free Methods
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p><strong>Paid Entry:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Purchase tickets online at bigmoney.com</li>
                      <li>$3 per entry for $700 draw</li>
                      <li>$5 per entry for $1,000 draw</li>
                      <li>Maximum 10 tickets per person per draw</li>
                    </ul>
                    
                    <p><strong>Free Entry Methods:</strong></p>
                    <ul className="list-disc pl-6 space-y-2">
                      <li><strong>Skill Quiz:</strong> Complete our online quiz with 100% correct answers. Limit 1 free entry per draw period.</li>
                      <li><strong>Mail-in:</strong> Send a postcard with your name, address, phone, email, and preferred draw ($700 or $1,000) to: BigMoney Free Entry, [Address to be provided]</li>
                    </ul>
                  </div>
                </section>

                <section id="referral" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    5. Referral Program Rules
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>After purchasing at least one paid ticket, participants receive a unique referral link.</p>
                    <p>For each new participant who completes a paid purchase using your referral link, you receive one free entry.</p>
                    <p>Referral entries are automatically applied to the next available draw of the referrer's choice.</p>
                    <p>Self-referrals and fraudulent referrals will result in disqualification.</p>
                  </div>
                </section>

                <section id="selection" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    6. Winner Selection & Notification
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>Winners selected using cryptographically secure random number generation with published verification data.</p>
                    <p>Process includes: participant list hash publication, random seed generation, and verifiable result computation.</p>
                    <p>Winners contacted within 24 hours via email and phone.</p>
                    <p>Winners must respond within 7 days to claim prize.</p>
                    <p>Unclaimed prizes will be re-drawn.</p>
                  </div>
                </section>

                <section id="prizes" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    7. Prizes & Payment Timeline
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p><strong>$700 Prize:</strong> Approximate Retail Value $700 USD</p>
                    <p><strong>$1,000 Prize:</strong> Approximate Retail Value $1,000 USD</p>
                    <p>Prizes paid via electronic transfer within 14 days of winner verification.</p>
                    <p>Winners responsible for applicable taxes. Form 1099 issued for prizes $600 and above.</p>
                  </div>
                </section>

                <section id="odds" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    8. Odds of Winning
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>Odds depend on total number of eligible entries received for each draw.</p>
                    <p>Historical odds and participation statistics available at bigmoney.com/winners</p>
                  </div>
                </section>

                <section id="publicity" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    9. Publicity Release
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>By participating, winners consent to use of their name, city, state, and likeness for promotional purposes without additional compensation, except where prohibited by law.</p>
                    <p>Winners may opt out of promotional use while maintaining prize eligibility.</p>
                  </div>
                </section>

                <section id="disqualification" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    10. Disqualification & Fraud Policy
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>Prohibited activities include: multiple accounts, automated entries, fraudulent referrals, and any attempt to manipulate the selection process.</p>
                    <p>Violations result in immediate disqualification and forfeit of all entries and prizes.</p>
                    <p>Sponsor reserves right to verify eligibility and investigate suspicious activity.</p>
                  </div>
                </section>

                <section id="liability" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    11. Limitation of Liability & Disputes
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>Sponsor not responsible for technical malfunctions, network congestion, or other factors beyond sponsor's control.</p>
                    <p>By participating, entrants agree to release sponsor from any liability arising from participation.</p>
                    <p>Disputes resolved through binding arbitration in accordance with sponsor's terms.</p>
                  </div>
                </section>

                <section id="privacy" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    12. Privacy & Data Usage
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>Information collected used for sweepstakes administration and winner notification.</p>
                    <p>Full privacy policy available at bigmoney.com/privacy</p>
                    <p>Participants may request data deletion after sweepstakes conclusion.</p>
                  </div>
                </section>

                <section id="governing" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    13. Governing Law
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>These rules governed by laws of [State], without regard to conflict of law principles.</p>
                    <p>Any legal proceedings must be brought in [State] courts.</p>
                  </div>
                </section>

                <section id="contact-rules" className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-4">
                    14. Contact for Official Rules Requests
                  </h2>
                  <div className="text-secondary-foreground space-y-4">
                    <p>For a copy of these Official Rules or winner information, send a self-addressed stamped envelope to:</p>
                    <p>BigMoney Official Rules Request<br />
                    [Address to be provided]</p>
                    <p>Or email: rules@bigmoney.com</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}