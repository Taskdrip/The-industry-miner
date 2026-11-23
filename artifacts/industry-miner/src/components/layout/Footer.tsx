import { Link } from "wouter";
import logoUrl from "@assets/brand/logo.png";
import { Facebook, Twitter, Instagram, Linkedin, Youtube, ArrowUpRight } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-secondary text-white/80 pt-16 pb-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
          <div className="lg:col-span-2">
            <img src={logoUrl} alt="The Industry Miner" className="h-12 mb-6 brightness-0 invert" />
            <p className="mb-6 max-w-sm">
              Empowering Entrepreneurs on their journey to Success. Knowledge is power. We give entrepreneurs expert-led masterclasses, toolkits, and mentorship.
            </p>
            <div className="footer-feature-links">
              <Link href="/jewellery-community" data-testid="link-footer-jewellery-community">Jewellery Community <ArrowUpRight size={14} /></Link>
              <Link href="/domains" data-testid="link-footer-domains">Domains & website launch <ArrowUpRight size={14} /></Link>
            </div>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-primary transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Instagram size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="hover:text-primary transition-colors"><Youtube size={20} /></a>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Platform</h4>
            <ul className="space-y-3">
              <li><Link href="/#masterclasses" data-testid="link-footer-masterclasses" className="hover:text-white transition-colors">Masterclasses</Link></li>
              <li><Link href="/#toolkits" data-testid="link-footer-toolkits" className="hover:text-white transition-colors">Toolkits & library</Link></li>
              <li><Link href="/#mentorship" data-testid="link-footer-mentorship" className="hover:text-white transition-colors">Mentorship</Link></li>
              <li><Link href="/studio" data-testid="link-footer-studio" className="hover:text-white transition-colors">Website Studio</Link></li>
              <li><a href="#" className="hover:text-white transition-colors">Funding Access</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Company</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
              <li><a href="mailto:support@theindustryminer.com" data-testid="link-footer-contact" className="hover:text-white transition-colors">Contact us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4 uppercase tracking-wider text-sm">Legal</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">© {new Date().getFullYear()} The Industry Miner. All rights reserved.</p>
          <p className="text-sm font-semibold text-primary">LEARN NEW THINGS DAILY</p>
        </div>
      </div>
    </footer>
  );
}
