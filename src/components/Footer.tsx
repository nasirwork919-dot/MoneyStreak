import { Link } from "react-router-dom";
import { PremiumButton } from "./ui/premium-button";
import { Shield, Lock, Award, Users } from "lucide-react";

const companyLinks = [
  { name: "About", href: "/about" },
  { name: "Careers", href: "#" },
  { name: "Contact", href: "/contact" },
  { name: "Charity", href: "/about#charity" },
];

const playLinks = [
  { name: "Tickets", href: "/buy" },
  { name: "Free Entry", href: "/quiz" },
  { name: "Winners", href: "/winners" },
  { name: "How It Works", href: "/how-it-works" },
];

const legalLinks = [
  { name: "Official Rules", href: "/rules" },
  { name: "Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
  { name: "Responsible Play", href: "/responsible-play" },
];

const trustBadges = [
  { icon: Shield, label: "Stripe Secure", tooltip: "Payments processed by Stripe. We never store card data." },
  { icon: Lock, label: "SSL Protected", tooltip: "All traffic is encrypted end-to-end." },
  { icon: Award, label: "RNG Verified", tooltip: "Draws published with hashes & seeds so you can verify results." },
  { icon: Users, label: "18+ Only", tooltip: "You must be 18 or older to participate." },
];

export function Footer() {
  return (
    <footer className="bg-surface/50 border-t border-accent/20">
      {/* Newsletter Section */}
      <div className="container-premium py-12 border-b border-accent/10">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-xl font-display font-semibold mb-4">
            Stay Updated
          </h3>
          <p className="text-secondary-foreground mb-6">
            Get notified about draws, winners, and important updates.
          </p>
          <div className="flex gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 glass rounded-lg border border-accent/30 focus:border-accent focus:outline-none focus:ring-2 focus:ring-ring text-sm"
            />
            <PremiumButton variant="gold">
              Subscribe
            </PremiumButton>
          </div>
          <p className="text-xs text-secondary-foreground mt-3">
            We'll only send draw updates & winner announcements.
          </p>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-premium py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Play */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Play</h4>
            <ul className="space-y-3">
              {playLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Legal</h4>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-secondary-foreground hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Trust & Security</h4>
            <div className="grid grid-cols-2 gap-3">
              {trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="glass p-3 rounded-lg text-center hover-lift cursor-help"
                  title={badge.tooltip}
                >
                  <badge.icon className="w-6 h-6 mx-auto mb-2 text-accent" />
                  <p className="text-xs text-secondary-foreground">
                    {badge.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs text-secondary-foreground mt-4">
              Founded 2025
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-accent/10">
        <div className="container-premium py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="text-lg font-display font-bold text-gradient-gold">
                BigMoney
              </div>
            </div>
            
            <p className="text-sm text-secondary-foreground text-center">
              © 2025 BigMoney — Founded by two friends. No purchase necessary. 18+ only. Play responsibly.
            </p>
            
            <div className="text-sm text-secondary-foreground">
              Portions of proceeds support community causes.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}