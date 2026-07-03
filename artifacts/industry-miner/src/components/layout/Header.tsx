import { Link } from "wouter";
import logoUrl from "@assets/brand/logo.png";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-white/95 backdrop-blur-md shadow-sm py-3" 
          : "bg-transparent py-5"
      }`}
    >
      <div className="container mx-auto px-4 max-w-7xl flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src={logoUrl} alt="The Industry Miner" className="h-10 md:h-12" />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          <Link href="#masterclasses" className={`text-sm font-semibold hover:text-primary transition-colors ${isScrolled ? "text-secondary" : "text-white"}`}>
            Masterclasses
          </Link>
          <Link href="#toolkits" className={`text-sm font-semibold hover:text-primary transition-colors ${isScrolled ? "text-secondary" : "text-white"}`}>
            Toolkits
          </Link>
          <Link href="#mentorship" className={`text-sm font-semibold hover:text-primary transition-colors ${isScrolled ? "text-secondary" : "text-white"}`}>
            Mentorship
          </Link>
          <div className="flex items-center gap-4 ml-4">
            <Button variant={isScrolled ? "ghost" : "link"} className={isScrolled ? "text-secondary" : "text-white"}>
              Log in
            </Button>
            <Button>Get Started</Button>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className={isScrolled ? "text-secondary" : "text-white"} />
          ) : (
            <Menu className={isScrolled ? "text-secondary" : "text-white"} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg py-4 px-4 flex flex-col gap-4 md:hidden border-t">
          <Link href="#masterclasses" className="text-secondary font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Masterclasses</Link>
          <Link href="#toolkits" className="text-secondary font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Toolkits</Link>
          <Link href="#mentorship" className="text-secondary font-semibold p-2" onClick={() => setMobileMenuOpen(false)}>Mentorship</Link>
          <hr className="my-2" />
          <Button variant="outline" className="w-full justify-center">Log in</Button>
          <Button className="w-full justify-center">Get Started</Button>
        </div>
      )}
    </header>
  );
}
