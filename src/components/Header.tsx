import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, User } from "lucide-react";
import { PremiumButton } from "./ui/premium-button";
import { AuthModal } from "./AuthModal";
import { useAuth } from "@/lib/auth";
import { Link } from "react-router-dom";
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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleAuthClick = (mode: 'signin' | 'signup') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleSignOut = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };
  return (
    <>
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
            <Link to="/" className="flex items-center space-x-2" onClick={() => window.scrollTo(0, 0)}>
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
                  onClick={() => window.scrollTo(0, 0)}
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
              {user ? (
                <div className="flex items-center space-x-3">
                  {isAdmin && (
                    <Link to="/admin" onClick={() => window.scrollTo(0, 0)}>
                      <PremiumButton variant="outline" size="sm">
                        <Shield className="w-4 h-4 mr-2" />
                        Admin
                      </PremiumButton>
                    </Link>
                  )}
                  <Link to="/dashboard" onClick={() => window.scrollTo(0, 0)}>
                    <PremiumButton variant="glass" size="sm">
                      <User className="w-4 h-4 mr-2" />
                      Dashboard
                    </PremiumButton>
                  </Link>
                  <PremiumButton variant="outline" size="sm" onClick={handleSignOut}>
                    Sign Out
                  </PremiumButton>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <PremiumButton variant="outline" size="sm" onClick={() => handleAuthClick('signin')}>
                    Sign In
                  </PremiumButton>
                  <PremiumButton variant="gold" size="sm" onClick={() => handleAuthClick('signup')}>
                    Sign Up
                  </PremiumButton>
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
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {item.name}
                  </Link>
                ))}
                
                <div className="pt-4 border-t border-accent/20 space-y-3">
                  {user ? (
                    <>
                      {isAdmin && (
                        <Link to="/admin" onClick={() => {
                          setIsMobileMenuOpen(false);
                          window.scrollTo(0, 0);
                        }}>
                          <PremiumButton variant="outline" className="w-full">
                            <Shield className="w-4 h-4 mr-2" />
                            Admin Panel
                          </PremiumButton>
                        </Link>
                      )}
                      <Link to="/dashboard" onClick={() => {
                        setIsMobileMenuOpen(false);
                        window.scrollTo(0, 0);
                      }}>
                        <PremiumButton variant="glass" className="w-full">
                          <User className="w-4 h-4 mr-2" />
                          Dashboard
                        </PremiumButton>
                      </Link>
                      <PremiumButton variant="outline" className="w-full" onClick={handleSignOut}>
                        Sign Out
                      </PremiumButton>
                    </>
                  ) : (
                    <>
                      <PremiumButton 
                        variant="outline" 
                        className="w-full"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleAuthClick('signin');
                        }}
                      >
                        Sign In
                      </PremiumButton>
                      <PremiumButton 
                        variant="gold" 
                        className="w-full"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          handleAuthClick('signup');
                        }}
                      >
                        Sign Up
                      </PremiumButton>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}