import { useState } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { PremiumButton } from "@/components/ui/premium-button";
import { Mail, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const subjects = [
  "Account Issues",
  "Payment Problems", 
  "Winner Verification",
  "Partnership Inquiry",
  "General Question",
  "Other"
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    consent: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consent) {
      toast({
        title: "Consent Required",
        description: "Please agree to our privacy policy to send your message.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Message Sent",
        description: "Thanks — we'll reply within 48-72 hours.",
      });
      
      // Reset form
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        consent: false
      });
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Contact Us
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-12">
              Have questions about BigMoney? We're here to help with account issues, payments, 
              partnerships, or anything else.
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="container-premium">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Contact Form */}
              <div className="lg:col-span-2">
                <div className="glass rounded-lg p-8">
                  <h2 className="text-2xl font-display font-semibold mb-6">
                    Send us a Message
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 glass rounded-lg border border-accent/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="Your full name"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          required
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 glass rounded-lg border border-accent/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject *
                      </label>
                      <select
                        id="subject"
                        name="subject"
                        required
                        value={formData.subject}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 glass rounded-lg border border-accent/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Select a subject</option>
                        {subjects.map((subject) => (
                          <option key={subject} value={subject}>
                            {subject}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={6}
                        maxLength={500}
                        value={formData.message}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 glass rounded-lg border border-accent/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                        placeholder="Please describe your question or issue..."
                      />
                      <div className="text-xs text-secondary-foreground mt-1">
                        {formData.message.length}/500 characters
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        id="consent"
                        name="consent"
                        checked={formData.consent}
                        onChange={handleInputChange}
                        className="mt-1 w-4 h-4 accent-primary"
                      />
                      <label htmlFor="consent" className="text-sm text-secondary-foreground">
                        I agree to BigMoney's{" "}
                        <a href="/privacy" className="text-primary hover:text-accent underline">
                          Privacy Policy
                        </a>{" "}
                        and consent to being contacted about my inquiry.
                      </label>
                    </div>
                    
                    <PremiumButton
                      type="submit"
                      variant="gold"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </PremiumButton>
                  </form>
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-6">
                <div className="glass rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Mail className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-display font-semibold">
                      Email Support
                    </h3>
                  </div>
                  <p className="text-secondary-foreground mb-3">
                    For general inquiries and support:
                  </p>
                  <a 
                    href="mailto:support@bigmoney.com"
                    className="text-primary hover:text-accent underline font-medium"
                  >
                    support@bigmoney.com
                  </a>
                </div>

                <div className="glass rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Clock className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-display font-semibold">
                      Response Time
                    </h3>
                  </div>
                  <p className="text-secondary-foreground">
                    We typically respond within 48-72 hours during business days.
                  </p>
                </div>

                <div className="glass rounded-lg p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <MapPin className="w-6 h-6 text-primary" />
                    <h3 className="text-lg font-display font-semibold">
                      Responsible Play
                    </h3>
                  </div>
                  <p className="text-secondary-foreground mb-3">
                    If you need help with gambling concerns:
                  </p>
                  <a 
                    href="/responsible-play"
                    className="text-primary hover:text-accent underline"
                  >
                    View Resources & Support
                  </a>
                </div>

                <div className="glass rounded-lg p-6">
                  <h3 className="text-lg font-display font-semibold mb-4">
                    Before You Contact Us
                  </h3>
                  <ul className="space-y-2 text-sm text-secondary-foreground">
                    <li>• Check our <a href="/faq" className="text-primary hover:text-accent underline">FAQ page</a> for quick answers</li>
                    <li>• Review <a href="/rules" className="text-primary hover:text-accent underline">Official Rules</a> for detailed information</li>
                    <li>• Visit your <a href="/dashboard" className="text-primary hover:text-accent underline">Dashboard</a> for account status</li>
                  </ul>
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