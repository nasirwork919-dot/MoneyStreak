import { useState } from "react";
import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  {
    id: 1,
    question: "Is this gambling?",
    answer: "No. BigMoney runs chance-based sweepstakes with a free entry method. No purchase necessary. See Official Rules for complete details."
  },
  {
    id: 2,
    question: "How do I enter for free?",
    answer: "Take our skill quiz at /quiz. Answer all questions correctly to earn one free ticket per draw period. A mail-in option is also available in the Official Rules."
  },
  {
    id: 3,
    question: "When are winners announced?",
    answer: "$700 winners are announced on the 20th of each month; $1,000 winners on the 30th of each month. See proof at /winners."
  },
  {
    id: 4,
    question: "How are winners chosen?",
    answer: "We freeze the participant list, publish its SHA256 hash, generate a random seed, and compute a verifiable result. Details and audit logs are posted at /winners."
  },
  {
    id: 5,
    question: "How do referrals work?",
    answer: "After you buy at least one ticket, you get a unique link. Each friend who completes a paid purchase using your link earns you one free ticket."
  },
  {
    id: 6,
    question: "What about refunds?",
    answer: "Refunds are only issued for duplicate/accidental charges. Contact support via /contact for assistance."
  },
  {
    id: 7,
    question: "What are the age requirements?",
    answer: "You must be 18 or older to participate. We promote responsible play and have resources available for support."
  },
  {
    id: 8,
    question: "Is my payment secure?",
    answer: "Yes — we use Stripe for secure checkout with SSL encryption. We never store your card data."
  },
  {
    id: 9,
    question: "How do I verify draw results?",
    answer: "We publish participant list hashes, random seeds, and result hashes for each draw. You can independently verify the winner selection process using these cryptographic proofs."
  },
  {
    id: 10,
    question: "What happens if I win?",
    answer: "Winners are contacted within 24 hours and payment is processed within 14 days. We'll also publicly announce your win (with your permission) and provide verification proof."
  }
];

export default function FAQ() {
  const [openItems, setOpenItems] = useState<number[]>([]);

  const toggleItem = (id: number) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-12">
              Everything you need to know about BigMoney sweepstakes, our process, and how to participate.
            </p>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="pb-24">
          <div className="container-premium">
            <div className="max-w-4xl mx-auto">
              <div className="space-y-4">
                {faqs.map((faq) => (
                  <div key={faq.id} className="glass rounded-lg overflow-hidden">
                    <button
                      onClick={() => toggleItem(faq.id)}
                      className="w-full p-6 text-left hover:bg-surface/50 transition-colors flex items-center justify-between"
                    >
                      <h3 className="text-lg font-display font-semibold pr-4">
                        {faq.question}
                      </h3>
                      {openItems.includes(faq.id) ? (
                        <ChevronUp className="w-5 h-5 text-accent flex-shrink-0" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-accent flex-shrink-0" />
                      )}
                    </button>
                    
                    {openItems.includes(faq.id) && (
                      <div className="px-6 pb-6 animate-fade-in">
                        <div className="border-t border-accent/20 pt-4">
                          <p className="text-secondary-foreground">
                            {faq.answer}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Still Have Questions Section */}
        <section className="pb-24 bg-surface/30">
          <div className="container-premium section-padding text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Still Have Questions?
            </h2>
            <p className="text-xl text-secondary-foreground mb-8 max-w-2xl mx-auto">
              Our team is here to help. Reach out with any questions about our sweepstakes, rules, or process.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <a href="/contact" className="flex-1">
                <button className="w-full btn-gold px-6 py-3 rounded-lg font-medium transition-all duration-300">
                  Contact Support
                </button>
              </a>
              <a href="/rules" className="flex-1">
                <button className="w-full btn-glass px-6 py-3 rounded-lg font-medium transition-all duration-300">
                  Read Official Rules
                </button>
              </a>
            </div>
            
            <p className="text-sm text-secondary-foreground mt-6">
              Response time: 24-48 hours • Email: support@bigmoney.com
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}