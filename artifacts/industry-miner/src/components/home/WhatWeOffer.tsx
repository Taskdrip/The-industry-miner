import { BookOpen, Target, Network, TrendingUp } from "lucide-react";

const pillars = [
  {
    icon: BookOpen,
    title: "Expert-Led Masterclasses",
    description: "Learn step-by-step from industry veterans. From validating your idea to advanced financial modeling."
  },
  {
    icon: Target,
    title: "Industry Toolkits",
    description: "Don't start from scratch. Use our battle-tested templates, legal frameworks, and operational models."
  },
  {
    icon: Network,
    title: "Tailored Networking",
    description: "Connect with like-minded founders, potential co-founders, and industry experts in our private community."
  },
  {
    icon: TrendingUp,
    title: "Exclusive Funding Access",
    description: "Get your pitch deck reviewed and get introduced to our curated network of angel investors and VCs."
  }
];

export default function WhatWeOffer() {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-primary font-bold tracking-wider uppercase text-sm mb-3">Platform Pillars</div>
          <h2 className="text-3xl md:text-5xl font-bold mb-6 text-secondary font-serif">
            Everything you need to Start, Structure, and Scale
          </h2>
          <p className="text-lg text-muted-foreground">
            We provide a comprehensive ecosystem designed specifically for ambitious entrepreneurs who want to build profitable, sustainable businesses.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, index) => (
            <div 
              key={index}
              className="bg-accent/40 rounded-2xl p-8 hover:bg-accent/80 transition-colors duration-300 border border-accent"
            >
              <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6 text-primary">
                <pillar.icon size={28} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-secondary mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
