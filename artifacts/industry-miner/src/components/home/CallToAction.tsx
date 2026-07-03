import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function CallToAction() {
  return (
    <section className="py-24 relative overflow-hidden bg-secondary">
      <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-secondary to-secondary/80"></div>
      
      <div className="container mx-auto px-4 max-w-4xl relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
          Ready to Scale Your Business?
        </h2>
        <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto leading-relaxed">
          Join 28,000+ entrepreneurs who are building profitable businesses with our expert-led masterclasses and toolkits.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto font-semibold">
            Explore Masterclasses
          </Button>
          <Button size="lg" variant="outline" className="h-14 px-8 text-lg w-full sm:w-auto text-secondary-foreground border-white/20 hover:bg-white/10 hover:text-white">
            View Mentorship Plans
          </Button>
        </div>
      </div>
    </section>
  );
}
