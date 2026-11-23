import { Link } from "wouter";
import { ArrowUpRight } from "lucide-react";

export default function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden bg-secondary">
      <div className="absolute inset-0 opacity-20 bg-[url('/images/hero-4.png')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Take your next step with a little more clarity.
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Learn, find practical support, and build the digital home your business needs next.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="#masterclasses" data-testid="link-cta-masterclasses" className="inline-flex h-14 items-center justify-center gap-2 bg-primary px-8 text-base font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
            Explore Masterclasses <ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href="/studio" data-testid="link-cta-website-studio" className="inline-flex h-14 items-center justify-center gap-2 border border-white/30 px-8 text-base font-semibold text-white transition-colors hover:bg-white/10">
            Build your website <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
