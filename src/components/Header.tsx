import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { PremiumButton } from "./ui/premium-button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Tickets", href: "/buy" },
  { name: "Winners", href: "/winners" },
  { name: "How It Works", href: "/how-it-works" },
  { name: "Free Entry", href: "/quiz" },
  { name: "About", href: "/about" },
  { name: "FAQ", href: "/faq" },
  { name: "Official Rules", href: "/rules" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isLoggedIn = false; // TODO: Replace with actual auth state

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        isScrolled
          ? "glass border-b border-accent/20"
          : "bg-transparent"
      )}
    >
      <nav className="container-premium">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-display font-bold text-gradient-gold">
              BigMoney
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  "text-sm font-medium transition-all duration-300 relative",
                  location.pathname === item.href
                    ? "text-primary"
                    : "text-secondary-foreground hover:text-primary"
                )}
              >
                {item.name}
                {location.pathname === item.href && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full" />
                )}
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn ? (
              <div className="flex items-center space-x-3">
                <Link to="/dashboard">
                  <PremiumButton variant="glass" size="sm">
                    <User className="w-4 h-4 mr-2" />
                    Dashboard
                  </PremiumButton>
                </Link>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/buy">
                  <PremiumButton variant="outline" size="sm">
                    Sign In
                  </PremiumButton>
                </Link>
                <Link to="/buy">
                  <PremiumButton variant="gold" size="sm">
                    Sign Up
                  </PremiumButton>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden glass border-t border-accent/20 mt-4 rounded-lg p-4 animate-fade-in">
            <div className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={cn(
                    "block px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    location.pathname === item.href
                      ? "bg-primary/20 text-primary"
                      : "text-secondary-foreground hover:bg-accent/10 hover:text-primary"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              
              <div className="pt-4 border-t border-accent/20 space-y-3">
                {isLoggedIn ? (
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>
                    <PremiumButton variant="glass" className="w-full">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </PremiumButton>
                  </Link>
                ) : (
                  <>
                    <Link to="/buy" onClick={() => setIsMobileMenuOpen(false)}>
                      <PremiumButton variant="outline" className="w-full">
                        Sign In
                      </PremiumButton>
                    </Link>
                    <Link to="/buy" onClick={() => setIsMobileMenuOpen(false)}>
                      <PremiumButton variant="gold" className="w-full">
                        Sign Up
                      </PremiumButton>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}