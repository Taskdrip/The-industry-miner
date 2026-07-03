import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Gem } from "lucide-react";
import { Link } from "wouter";

const slides = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1600&q=80",
    badge: "Empowering Entrepreneurs",
    title: "Masterclasses by Industry Experts",
    description: "Learn actionable strategies from founders who have built profitable businesses from the ground up.",
    cta: "Explore Masterclasses",
    ctaHref: "#masterclasses",
    external: false,
  },
  {
    id: 5,
    image: "https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=1600&q=80",
    badge: "🔥 Limited Seats Available",
    title: "TIM Jewellery Masterclass",
    description: "Build a jewellery brand that prints money. Zero experience needed — start, brand and sell jewellery profitably. 1-Year Subscription · ₦100,000.",
    cta: "View the Masterclass",
    ctaHref: "/jewellery-masterclass",
    external: false,
    accent: "#C9A14A",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1600&q=80",
    badge: "1-on-1 Guidance",
    title: "Tailored Mentorship",
    description: "Get personalised guidance to overcome challenges, structure your operations, and scale faster.",
    cta: "Find a Mentor",
    ctaHref: "#mentorship",
    external: false,
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=1600&q=80",
    badge: "Ready-to-Use Resources",
    title: "Comprehensive Toolkits",
    description: "Plug-and-play financial models, operational templates, and marketing frameworks to save you hundreds of hours.",
    cta: "Browse Toolkits",
    ctaHref: "#toolkits",
    external: false,
  },
  {
    id: 4,
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1600&q=80",
    badge: "Raise Capital",
    title: "Exclusive Funding Access",
    description: "Prepare your pitch, understand valuation, and connect with our network of early-stage investors.",
    cta: "Learn About Funding",
    ctaHref: "#funding",
    external: false,
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  const slide = slides[currentSlide];
  const isJewellery = slide.id === 5;

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden bg-secondary">
      {/* Slides */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div
            className="absolute inset-0 bg-cover bg-center scale-105 transition-transform duration-[8000ms]"
            style={{
              backgroundImage: `url(${s.image})`,
              transform: index === currentSlide ? "scale(1)" : "scale(1.05)",
            }}
          />
          <div className={`absolute inset-0 ${s.id === 5 ? "bg-gradient-to-r from-black/88 via-black/65 to-black/25" : "bg-gradient-to-r from-secondary/92 via-secondary/72 to-transparent"}`} />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col justify-center relative z-20">
        <div
          key={currentSlide}
          className="max-w-2xl"
          style={{ animation: "fadeSlideUp 0.7s ease-out both" }}
        >
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
            isJewellery
              ? "bg-amber-400/15 border-amber-400/40 text-amber-300"
              : "bg-white/10 border-white/20 text-white/80"
          }`}>
            {isJewellery && <Gem className="w-3 h-3" />}
            {slide.badge}
          </div>

          {/* Title */}
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-5 text-white font-serif"
            style={isJewellery ? { background: "linear-gradient(135deg, #fff 0%, #f5e6c8 50%, #C9A14A 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } : {}}
          >
            {slide.title}
          </h1>

          {/* Description */}
          <p className={`text-lg leading-relaxed mb-8 max-w-lg ${isJewellery ? "text-white/70" : "text-white/80"}`}>
            {slide.description}
          </p>

          {/* CTA */}
          <div className="flex items-center gap-4">
            {isJewellery ? (
              <Link href={slide.ctaHref}>
                <button className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-full transition-all shadow-2xl shadow-amber-500/25">
                  {slide.cta} →
                </button>
              </Link>
            ) : slide.external ? (
              <a href={slide.ctaHref} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xl">
                  {slide.cta}
                </Button>
              </a>
            ) : (
              <Link href={slide.ctaHref}>
                <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-bold shadow-xl">
                  {slide.cta}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors border border-white/20"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors border border-white/20"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`transition-all rounded-full ${
              index === currentSlide
                ? "w-6 h-2 bg-primary"
                : "w-2 h-2 bg-white/30 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
      `}</style>
    </div>
  );
}
