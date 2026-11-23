import { Link } from "wouter";
import logoUrl from "@assets/brand/logo.png";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, Shield, ChevronDown, Gem, LayoutDashboard, ArrowUpRight, BookOpen, PanelsTopLeft, UsersRound, LibraryBig } from "lucide-react";
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

const discoveryLinks = [
  { href: "/studio", title: "Website Studio", description: "Launch a website built for your kind of business.", icon: PanelsTopLeft, label: "Build" },
  { href: "/domains", title: "Domains & launch", description: "Plan a domain and website launch with our team.", icon: ArrowUpRight, label: "Launch" },
  { href: "/jewellery-community", title: "Jewellery Community", description: "Practical support for jewellery entrepreneurs and makers.", icon: Gem, label: "Community" },
  { href: "#masterclasses", title: "Masterclasses", description: "Learn directly from people doing the work.", icon: BookOpen, label: "Learn" },
  { href: "#toolkits", title: "Practical resources", description: "Field-tested tools for your next move.", icon: LibraryBig, label: "Apply" },
  { href: "#mentorship", title: "Mentorship", description: "Get a sharper perspective on the hard parts.", icon: UsersRound, label: "Grow" },
];

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [masterclassOpen, setMasterclassOpen] = useState(false);
  const [authModal, setAuthModal] = useState<{ open: boolean; tab: "login" | "signup" }>({ open: false, tab: "login" });
  const { user, isAuthenticated, isAdmin, logoutUrl } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProductsOpen(false);
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const initials = user
    ? [user.firstName, user.lastName].filter(Boolean).map((s) => s![0]).join("").toUpperCase() || "U"
    : "";
  const dismissMobile = () => {
    setMobileMenuOpen(false);
    setMasterclassOpen(false);
  };

  return (
    <header className={`landing-header fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "shadow-[0_8px_30px_rgba(24,46,40,.08)]" : ""}`}>
      <div className="mx-auto flex h-[76px] max-w-[1320px] items-center justify-between px-5 md:px-8">
        <Link href="/" data-testid="link-home-brand" className="flex shrink-0 items-center gap-2" aria-label="The Industry Miner home">
          <img src={logoUrl} alt="The Industry Miner" className="h-10 w-auto md:h-11" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Main navigation">
          <button
            type="button"
            data-testid="button-products-menu"
            aria-expanded={productsOpen}
            aria-controls="products-mega-menu"
            onClick={() => setProductsOpen((open) => !open)}
            className="landing-nav-link flex items-center gap-2 bg-transparent text-[12px] font-semibold transition-colors"
          >
            Explore the platform
            <ChevronDown className={`h-3.5 w-3.5 transition-transform ${productsOpen ? "rotate-180" : ""}`} />
          </button>
          <Link href="#courses" data-testid="link-courses-nav" className="landing-nav-link text-[12px] font-semibold transition-colors">Course library</Link>
          <Link href="#mentorship" data-testid="link-mentorship-nav" className="landing-nav-link text-[12px] font-semibold transition-colors">Mentorship</Link>
          <Link href="/jewellery-community" data-testid="link-jewellery-community-nav" className="landing-nav-link text-[12px] font-semibold transition-colors">Jewellery community</Link>
          <Link href="/domains" data-testid="link-domains-nav" className="landing-nav-link text-[12px] font-semibold transition-colors">Domains</Link>
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button data-testid="button-account-menu" aria-label="Open account menu" className="flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#d9825b]">
                  <Avatar className="h-9 w-9 border border-[#c7d0c7]">
                    <AvatarImage src={user?.profileImageUrl ?? undefined} />
                    <AvatarFallback className="bg-[#214d42] text-xs font-bold text-white">{initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-[12px] font-semibold text-[#334943]">{user?.firstName || "Account"}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-[#75837c]" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold">{user?.firstName} {user?.lastName}</p>
                  <p className="truncate text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <Link href="/dashboard" data-testid="link-dashboard-account">
                  <DropdownMenuItem className="cursor-pointer gap-2"><LayoutDashboard className="h-4 w-4 text-primary" />My Dashboard</DropdownMenuItem>
                </Link>
                {isAdmin && <Link href="/admin" data-testid="link-admin-account"><DropdownMenuItem className="cursor-pointer gap-2"><Shield className="h-4 w-4 text-primary" />Admin Panel</DropdownMenuItem></Link>}
                <DropdownMenuSeparator />
                <a href={logoutUrl} data-testid="link-signout-account">
                  <DropdownMenuItem className="cursor-pointer gap-2 text-destructive focus:text-destructive"><LogOut className="h-4 w-4" />Sign out</DropdownMenuItem>
                </a>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" data-testid="button-login" className="landing-login text-[12px] font-semibold" onClick={() => setAuthModal({ open: true, tab: "login" })}>Log in</Button>
              <Button size="sm" data-testid="button-get-started" className="h-10 rounded-sm bg-[#214d42] px-5 text-[12px] font-semibold text-white hover:bg-[#173d34]" onClick={() => setAuthModal({ open: true, tab: "signup" })}>
                Get started <ArrowUpRight className="ml-1.5 h-3.5 w-3.5" />
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          data-testid="button-mobile-menu"
          className="grid h-10 w-10 place-items-center text-[#214d42] lg:hidden"
          onClick={() => setMobileMenuOpen((open) => !open)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {productsOpen && (
        <div id="products-mega-menu" className="landing-menu-panel absolute left-0 right-0 top-full hidden border-y border-[#e1e4da] bg-[#f8f7f1] shadow-[0_22px_45px_rgba(25,46,43,.12)] lg:block">
          <div className="mx-auto grid max-w-[1220px] grid-cols-[.72fr_1.8fr] gap-10 px-8 py-8">
            <div className="border-r border-[#e0e2d9] pr-9">
              <span className="landing-kicker text-[#b66e4c]">One platform, practical progress</span>
              <h2 className="mt-4 text-[33px] leading-[1.02] text-[#203a34]">From first idea to a business that moves.</h2>
              <p className="mt-3 text-[12px] leading-6 text-[#74817a]">Build your capability, get expert perspective, and put the right tools to work.</p>
              <Link href="/studio" data-testid="link-mega-studio" onClick={() => setProductsOpen(false)} className="mt-5 inline-flex items-center gap-2 text-[11px] font-bold text-[#245446]">Start with Website Studio <ArrowUpRight className="h-3.5 w-3.5" /></Link>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {discoveryLinks.map((item) => (
                <Link key={item.title} href={item.href} data-testid={`link-platform-${item.label.toLowerCase()}`} onClick={() => setProductsOpen(false)} className="group flex gap-4 p-4 transition-colors hover:bg-[#eeefe7]">
                  <span className="grid h-10 w-10 shrink-0 place-items-center border border-[#dce1d7] bg-[#f6f5ef] text-[#557569] group-hover:border-[#d9825b] group-hover:text-[#b76443]"><item.icon className="h-4 w-4" /></span>
                  <span><small className="font-mono text-[8px] uppercase tracking-[.16em] text-[#b66e4c]">{item.label}</small><strong className="mt-1 block text-[13px] text-[#283e37]">{item.title}</strong><span className="mt-1 block text-[10px] leading-5 text-[#78857e]">{item.description}</span></span>
                  <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0 text-[#9aa59e] opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
              <Link href="/jewellery-masterclass" data-testid="link-platform-jewellery" onClick={() => setProductsOpen(false)} className="col-span-2 flex items-center gap-3 border-t border-[#e0e2d9] px-4 pt-4 text-[11px] font-semibold text-[#465c52] hover:text-[#b76443]">
                <Gem className="h-4 w-4 text-[#b88752]" /> Jewellery Masterclass <span className="font-normal text-[#859189]">— build and sell with confidence</span><ArrowUpRight className="ml-auto h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="absolute left-0 right-0 top-full border-t border-[#e3e4dc] bg-[#f8f7f1] px-5 pb-6 pt-3 shadow-lg lg:hidden">
          <Link href="/studio" data-testid="link-mobile-studio" onClick={dismissMobile} className="flex items-center justify-between border-b border-[#e5e5dc] py-4 text-[13px] font-bold text-[#214d42]">Website Studio <ArrowUpRight className="h-4 w-4" /></Link>
          <Link href="/jewellery-community" data-testid="link-mobile-jewellery-community" onClick={dismissMobile} className="flex items-center justify-between border-b border-[#e5e5dc] py-4 text-[13px] font-semibold text-[#354c43]">Jewellery community <Gem className="h-4 w-4 text-[#b88752]" /></Link>
          <Link href="/domains" data-testid="link-mobile-domains" onClick={dismissMobile} className="flex items-center justify-between border-b border-[#e5e5dc] py-4 text-[13px] font-semibold text-[#354c43]">Domains & launch <ArrowUpRight className="h-4 w-4" /></Link>
          <button type="button" data-testid="button-mobile-masterclasses" onClick={() => setMasterclassOpen((open) => !open)} aria-expanded={masterclassOpen} className="flex w-full items-center justify-between py-4 text-left text-[13px] font-semibold text-[#354c43]">
            Masterclasses <ChevronDown className={`h-4 w-4 transition-transform ${masterclassOpen ? "rotate-180" : ""}`} />
          </button>
          {masterclassOpen && (
            <div className="mb-2 border-l border-[#d9825b] pl-3">
              <Link href="/jewellery-masterclass" data-testid="link-mobile-jewellery" onClick={dismissMobile} className="flex items-center gap-3 py-3 text-[12px] font-semibold text-[#35564a]"><Gem className="h-4 w-4 text-[#b88752]" /> Jewellery Masterclass</Link>
              <Link href="#courses" data-testid="link-mobile-all-classes" onClick={dismissMobile} className="block py-2 text-[12px] text-[#74817a]">Browse all masterclasses</Link>
            </div>
          )}
          <Link href="#toolkits" data-testid="link-mobile-resources" onClick={dismissMobile} className="block border-t border-[#e5e5dc] py-4 text-[13px] font-semibold text-[#354c43]">Practical resources</Link>
          <Link href="#mentorship" data-testid="link-mobile-mentorship" onClick={dismissMobile} className="block border-t border-[#e5e5dc] py-4 text-[13px] font-semibold text-[#354c43]">Mentorship</Link>
          <Link href="#courses" data-testid="link-mobile-library" onClick={dismissMobile} className="block border-t border-[#e5e5dc] py-4 text-[13px] font-semibold text-[#354c43]">Course library</Link>
          <div className="mt-2 border-t border-[#e5e5dc] pt-4">
            {isAuthenticated ? (
              <>
                <div className="mb-3 flex items-center gap-3">
                  <Avatar className="h-9 w-9"><AvatarImage src={user?.profileImageUrl ?? undefined} /><AvatarFallback className="bg-[#214d42] text-xs font-bold text-white">{initials}</AvatarFallback></Avatar>
                  <div><p className="text-[12px] font-semibold text-[#334943]">{user?.firstName} {user?.lastName}</p><p className="text-[10px] text-[#78857e]">{user?.email}</p></div>
                </div>
                <Link href="/dashboard" data-testid="link-mobile-dashboard" onClick={dismissMobile} className="flex items-center gap-2 py-3 text-[12px] font-semibold text-[#35564a]"><LayoutDashboard className="h-4 w-4" /> My Dashboard</Link>
                {isAdmin && <Link href="/admin" data-testid="link-mobile-admin" onClick={dismissMobile} className="flex items-center gap-2 py-3 text-[12px] font-semibold text-[#35564a]"><Shield className="h-4 w-4" /> Admin Panel</Link>}
                <a href={logoutUrl} data-testid="link-mobile-signout" className="flex items-center gap-2 py-3 text-[12px] font-semibold text-destructive"><LogOut className="h-4 w-4" /> Sign out</a>
              </>
            ) : (
              <div className="flex gap-3">
                <Button variant="outline" data-testid="button-mobile-login" className="h-11 flex-1 border-[#bac8be] text-[#214d42]" onClick={() => { dismissMobile(); setAuthModal({ open: true, tab: "login" }); }}>Log in</Button>
                <Button data-testid="button-mobile-get-started" className="h-11 flex-1 bg-[#214d42] text-white hover:bg-[#173d34]" onClick={() => { dismissMobile(); setAuthModal({ open: true, tab: "signup" }); }}>Get started</Button>
              </div>
            )}
          </div>
        </div>
      )}

      <AuthModal open={authModal.open} defaultTab={authModal.tab} onClose={() => setAuthModal((state) => ({ ...state, open: false }))} />
    </header>
  );
}
