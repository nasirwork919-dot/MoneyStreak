import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function Terms() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-24">
        {/* Hero Section */}
        <section className="section-padding">
          <div className="container-premium text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-secondary-foreground max-w-3xl mx-auto mb-12">
              Terms and conditions for using BigMoney services and participating in our sweepstakes.
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
                  1. Acceptance of Terms
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>By accessing or using BigMoney services, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
                  <p>If you do not agree with any of these terms, you are prohibited from using our services.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  2. Acceptable Use
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Permitted Uses:</strong> You may use our services for lawful purposes in accordance with these terms and our Official Rules.</p>
                  <p><strong>Prohibited Activities:</strong></p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Creating multiple accounts or using false information</li>
                    <li>Attempting to manipulate or interfere with our sweepstakes or systems</li>
                    <li>Using automated tools, bots, or scripts</li>
                    <li>Engaging in fraudulent or illegal activities</li>
                    <li>Harassing other users or our staff</li>
                    <li>Violating any applicable laws or regulations</li>
                  </ul>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  3. Account Registration
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>You must be 18 or older to create an account and participate in our sweepstakes.</p>
                  <p>You're responsible for maintaining the confidentiality of your account credentials.</p>
                  <p>You must provide accurate and complete information when creating your account.</p>
                  <p>One account per person. Multiple accounts will result in disqualification.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  4. Account Termination
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>By You:</strong> You may delete your account at any time through your account settings.</p>
                  <p><strong>By Us:</strong> We may suspend or terminate accounts that violate these terms or our Official Rules.</p>
                  <p><strong>Effect of Termination:</strong> Upon termination, your right to use our services ceases immediately. Pending entries may be forfeited.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  5. Refunds and Payments
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Payment Processing:</strong> All payments are processed securely through Stripe.</p>
                  <p><strong>Refund Policy:</strong> Refunds are only available for duplicate or accidental charges, not for unsuccessful sweepstakes entries.</p>
                  <p><strong>Refund Requests:</strong> Contact support within 30 days of the charge for refund consideration.</p>
                  <p><strong>Prize Payments:</strong> Winners receive prizes via electronic transfer within 14 days of verification.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  6. Intellectual Property
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Our Content:</strong> All content on BigMoney, including text, graphics, logos, and software, is our property or licensed to us.</p>
                  <p><strong>Your Content:</strong> You retain rights to content you submit, but grant us license to use it for service operation and promotion.</p>
                  <p><strong>Restrictions:</strong> You may not copy, modify, distribute, or create derivative works from our content without permission.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  7. Privacy and Data
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your information.</p>
                  <p>By using our services, you consent to our data practices as described in our Privacy Policy.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  8. Indemnification
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>You agree to indemnify and hold BigMoney harmless from any claims, damages, or expenses arising from:</p>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Your use of our services</li>
                    <li>Your violation of these terms</li>
                    <li>Your violation of any third-party rights</li>
                    <li>Any content you submit to our platform</li>
                  </ul>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  9. Limitation of Liability
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>BigMoney's liability is limited to the maximum extent permitted by law.</p>
                  <p>We're not liable for indirect, incidental, special, or consequential damages.</p>
                  <p>Our total liability won't exceed the amount you paid for our services in the 12 months before the claim.</p>
                  <p>Some jurisdictions don't allow liability limitations, so these may not apply to you.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  10. Service Availability
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>We strive for high availability but don't guarantee uninterrupted service.</p>
                  <p>We may modify, suspend, or discontinue services at any time with or without notice.</p>
                  <p>We're not liable for any service interruptions or technical issues.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  11. Changes to Service
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>We may modify our services, features, or pricing at any time.</p>
                  <p>Material changes will be communicated via email or platform notice.</p>
                  <p>Continued use after changes indicates acceptance of modifications.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  12. Dispute Resolution
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p><strong>Informal Resolution:</strong> Contact us first to resolve disputes informally.</p>
                  <p><strong>Binding Arbitration:</strong> Unresolved disputes will be settled through binding arbitration.</p>
                  <p><strong>Class Action Waiver:</strong> You waive the right to participate in class action lawsuits.</p>
                  <p><strong>Governing Law:</strong> These terms are governed by [State] law.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  13. Severability
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>If any provision of these terms is found unenforceable, the remaining provisions will remain in full force.</p>
                </div>
              </div>

              <div className="glass rounded-lg p-8">
                <h2 className="text-2xl font-display font-semibold mb-4">
                  14. Contact Information
                </h2>
                <div className="text-secondary-foreground space-y-4">
                  <p>Questions about these Terms of Service? Contact us:</p>
                  <p>
                    <strong>Email:</strong> legal@bigmoney.com<br />
                    <strong>Mail:</strong> BigMoney Legal Team, [Address to be provided]
                  </p>
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