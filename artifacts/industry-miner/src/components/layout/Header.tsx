import { Link } from "wouter";
import logoUrl from "@assets/brand/logo.png";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Shield, ChevronDown, Gem, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AuthModal from "@/components/auth/AuthModal";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [masterclassOpen, setMasterclassOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "login" | "signup" }>({ open: false, tab: "login" });
  const { user, isAuthenticated, isAdmin, logoutUrl } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const initials = user
    ? [user.firstName, user.lastName].filter(Boolean).map((s) => s![0]).join("").toUpperCase() || "U"
    : "";

  const navTextClass = isScrolled ? "text-secondary" : "text-white";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/97 backdrop-blur-md shadow-[0_1px_0_0_rgba(0,0,0,0.06)] py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="The Industry Miner" className="h-10 md:h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {/* Masterclasses dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 text-sm font-semibold hover:text-primary transition-colors outline-none ${navTextClass}`}
              >
                Masterclasses
                <ChevronDown className="w-3.5 h-3.5 opacity-70" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56 mt-1">
              <Link href="/jewellery-masterclass">
                <DropdownMenuItem className="cursor-pointer gap-2.5 py-3">
                  <div className="w-7 h-7 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Gem className="w-3.5 h-3.5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Jewellery Masterclass</div>
                    <div className="text-xs text-muted-foreground">1-Year Subscription · ₦100,000</div>
                  </div>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <Link href="#masterclasses">
                <DropdownMenuItem className="cursor-pointer text-sm text-muted-foreground">
                  View all masterclasses
                </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link href="#toolkits" className={`text-sm font-semibold hover:text-primary transition-colors ${navTextClass}`}>
            Toolkits
          </Link>
          <Link href="#mentorship" className={`text-sm font-semibold hover:text-primary transition-colors ${navTextClass}`}>
            Mentorship
          </Link>

          <div className="flex items-center gap-3 ml-2">
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-full focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
                    <Avatar className="h-9 w-9 border-2 border-primary/30">
                      <AvatarImage src={user?.profileImageUrl ?? undefined} />
                      <AvatarFallback className="bg-primary text-white text-sm font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>
                    <span className={`text-sm font-semibold hidden lg:block ${navTextClass}`}>
                      {user?.firstName || "Account"}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2">
                    <p className="text-sm font-semibold truncate">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <Link href="/dashboard">
                    <DropdownMenuItem className="cursor-pointer gap-2">
                      <LayoutDashboard className="w-4 h-4 text-primary" />
                      <span className="font-semibold">My Dashboard</span>
                    </DropdownMenuItem>
                  </Link>
                  {isAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <Link href="/admin">
                        <DropdownMenuItem className="cursor-pointer gap-2">
                          <Shield className="w-4 h-4 text-primary" />
                          <span className="font-semibold">Admin Panel</span>
                        </DropdownMenuItem>
                      </Link>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <a href={logoutUrl}>
                    <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </a>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`font-semibold ${isScrolled ? "text-secondary hover:text-secondary" : "text-white hover:text-white hover:bg-white/10"}`}
                  onClick={() => setAuthModal({ open: true, tab: "login" })}
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold shadow-sm"
                  onClick={() => setAuthModal({ open: true, tab: "signup" })}
                >
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile menu toggle */}
        <button
          className={`md:hidden p-2 rounded-lg transition-colors ${isScrolled ? "text-secondary hover:bg-muted" : "text-white hover:bg-white/10"}`}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 flex flex-col gap-1 md:hidden border-t border-border">
          {/* Masterclasses section */}
          <button
            onClick={() => setMasterclassOpen(!masterclassOpen)}
            className="flex items-center justify-between text-secondary font-semibold p-2 rounded-lg hover:bg-muted transition-colors"
          >
            Masterclasses
            <ChevronDown className={`w-4 h-4 transition-transform ${masterclassOpen ? "rotate-180" : ""}`} />
          </button>
          {masterclassOpen && (
            <Link
              href="/jewellery-masterclass"
              className="flex items-center gap-3 px-4 py-3 ml-2 rounded-lg bg-amber-50 border border-amber-100"
              onClick={() => { setMobileMenuOpen(false); setMasterclassOpen(false); }}
            >
              <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                <Gem className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="font-semibold text-sm text-secondary">Jewellery Masterclass</div>
                <div className="text-xs text-muted-foreground">1-Year · ₦100,000</div>
              </div>
            </Link>
          )}

          <Link href="#toolkits" className="text-secondary font-semibold p-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Toolkits</Link>
          <Link href="#mentorship" className="text-secondary font-semibold p-2 rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>Mentorship</Link>

          <hr className="my-2 border-border" />
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.profileImageUrl ?? undefined} />
                  <AvatarFallback className="bg-primary text-white text-xs font-bold">{initials}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <Link href="/dashboard" className="flex items-center gap-2 p-2 text-secondary font-semibold rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                <LayoutDashboard className="w-4 h-4 text-primary" /> My Dashboard
              </Link>
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 p-2 text-secondary font-semibold rounded-lg hover:bg-muted" onClick={() => setMobileMenuOpen(false)}>
                  <Shield className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <a href={logoutUrl} className="flex items-center gap-2 p-2 text-destructive font-semibold rounded-lg hover:bg-destructive/5">
                <LogOut className="w-4 h-4" /> Sign Out
              </a>
            </>
          ) : (
            <>
              <Button variant="outline" className="w-full justify-center" onClick={() => { setMobileMenuOpen(false); setAuthModal({ open: true, tab: "login" }); }}>
                Log in
              </Button>
              <Button className="w-full justify-center" onClick={() => { setMobileMenuOpen(false); setAuthModal({ open: true, tab: "signup" }); }}>
                Get Started
              </Button>
            </>
          )}
        </div>
      )}
      <AuthModal
        open={authModal.open}
        defaultTab={authModal.tab}
        onClose={() => setAuthModal((s) => ({ ...s, open: false }))}
      />
    </header>
  );
}
