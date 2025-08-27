import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-12">
              Your privacy matters to us. Here's how we collect, use, and protect your information.
            </p>
            <p className="text-sm text-secondary-foreground">
              Last updated: January 2025
            </p>
          </div>
        </section>

        <section className="pb-24">
          <div className="container-premium">
            <div className="max-w-4xl mx-auto space-y-8">
              
              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Information We Collect
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Personal Information:</strong> Name, email address, phone number, and mailing address when you create an account or enter our sweepstakes.</p>
                  <p><strong>Payment Information:</strong> We use Stripe to process payments securely. We never store your credit card information on our servers.</p>
                  <p><strong>Technical Information:</strong> IP address, device type, browser information, and usage patterns to improve our service and prevent fraud.</p>
                  <p><strong>Communications:</strong> Records of your interactions with our customer support team.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  How We Use Your Information
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Sweepstakes Administration:</strong> To process entries, conduct drawings, notify winners, and distribute prizes.</p>
                  <p><strong>Account Management:</strong> To maintain your account, provide customer support, and send important updates.</p>
                  <p><strong>Fraud Prevention:</strong> To verify identity, prevent duplicate accounts, and maintain fair play.</p>
                  <p><strong>Communications:</strong> To send draw notifications, winner announcements, and optional marketing communications (you can opt out anytime).</p>
                  <p><strong>Legal Compliance:</strong> To comply with applicable laws, regulations, and tax reporting requirements.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  What We Don't Collect
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Credit Card Data:</strong> All payment processing is handled securely by Stripe. We never see or store your full credit card information.</p>
                  <p><strong>Social Security Numbers:</strong> We don't collect SSNs unless required by law for tax reporting on prizes over $600.</p>
                  <p><strong>Sensitive Personal Data:</strong> We don't collect information about your race, religion, political views, or other sensitive personal characteristics.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Information Sharing
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Service Providers:</strong> We share information with trusted partners like Stripe (payments) and email providers, but only as necessary to provide our services.</p>
                  <p><strong>Legal Requirements:</strong> We may disclose information if required by law, court order, or to protect our rights and safety.</p>
                  <p><strong>Winner Publicity:</strong> With your consent, we may announce your win publicly (first name, last initial, and state).</p>
                  <p><strong>We Never Sell Your Data:</strong> We don't sell, rent, or trade your personal information to third parties for marketing purposes.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Data Retention
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Account Data:</strong> Maintained while your account is active and for a reasonable period afterward for business purposes.</p>
                  <p><strong>Transaction Records:</strong> Kept for tax and legal compliance purposes, typically 7 years.</p>
                  <p><strong>Marketing Communications:</strong> Maintained until you unsubscribe from our communications.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Your Rights
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Access:</strong> You can request a copy of the personal information we have about you.</p>
                  <p><strong>Correction:</strong> You can update or correct your personal information through your account settings.</p>
                  <p><strong>Deletion:</strong> You can request deletion of your account and personal information, subject to legal retention requirements.</p>
                  <p><strong>Opt-Out:</strong> You can unsubscribe from marketing communications at any time.</p>
                  <p><strong>Data Portability:</strong> You can request your data in a machine-readable format.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Cookies and Tracking
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Essential Cookies:</strong> Required for the website to function properly (login sessions, security).</p>
                  <p><strong>Analytics:</strong> We use cookies to understand how visitors use our site to improve user experience.</p>
                  <p><strong>Your Control:</strong> You can manage cookie preferences through your browser settings.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Security Measures
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Encryption:</strong> All data transmission is protected with SSL/TLS encryption.</p>
                  <p><strong>Access Controls:</strong> Limited access to personal information on a need-to-know basis.</p>
                  <p><strong>Regular Audits:</strong> We regularly review our security practices and update them as needed.</p>
                  <p><strong>No Perfect Security:</strong> While we implement strong security measures, no system is 100% secure.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Children's Privacy
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>Our services are intended for adults 18 and older. We don't knowingly collect personal information from children under 18.</p>
                  <p>If we learn that we've collected information from a child under 18, we'll delete it promptly.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Changes to This Policy
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>We may update this privacy policy occasionally. We'll notify you of significant changes via email or prominent notice on our website.</p>
                  <p>Continued use of our services after changes indicates acceptance of the updated policy.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  Contact Us
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>If you have questions about this privacy policy or want to exercise your rights:</p>
                  <p>
                    <strong>Email:</strong> privacy@bigmoney.com<br />
                    <strong>Mail:</strong> BigMoney Privacy Team, [Address to be provided]
                  </p>
                  <p>We'll respond to your inquiry within 30 days.</p>
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