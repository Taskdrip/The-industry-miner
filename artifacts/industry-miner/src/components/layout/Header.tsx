import { Link } from "wouter";
import logoUrl from "@assets/brand/logo.png";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Shield } from "lucide-react";
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
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="The Industry Miner" className="h-10 md:h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#masterclasses" className={`text-sm font-semibold hover:text-primary transition-colors ${navTextClass}`}>
            Masterclasses
          </Link>
          <Link href="/jewellery-masterclass" className={`text-sm font-semibold hover:text-primary transition-colors ${navTextClass}`}>
            Jewellery
          </Link>
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
                    {isAdmin && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full mt-1 inline-block">Admin</span>
                    )}
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
                      <Shield className="w-4 h-4" />
                      {isAdmin ? "Admin Panel" : "My Courses"}
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href={logoutUrl} className="flex items-center gap-2 text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant={isScrolled ? "ghost" : "link"}
                  className={isScrolled ? "text-secondary" : "text-white"}
                  onClick={() => setAuthModal({ open: true, tab: "login" })}
                >
                  Log in
                </Button>
                <Button onClick={() => setAuthModal({ open: true, tab: "signup" })}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? (
            <X className={isScrolled ? "text-secondary" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-secondary" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 flex flex-col gap-3 md:hidden border-t">
          <Link href="#masterclasses" className="text-secondary font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Masterclasses</Link>
          <Link href="/jewellery-masterclass" className="text-secondary font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Jewellery Masterclass</Link>
          <Link href="#toolkits" className="text-secondary font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Toolkits</Link>
          <Link href="#mentorship" className="text-secondary font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Mentorship</Link>
          <hr className="my-1" />
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
              {isAdmin && (
                <Link href="/admin" className="flex items-center gap-2 p-2 text-secondary font-semibold" onClick={() => setMobileMenuOpen(false)}>
                  <Shield className="w-4 h-4" /> Admin Panel
                </Link>
              )}
              <a href={logoutUrl} className="flex items-center gap-2 p-2 text-destructive font-semibold">
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
