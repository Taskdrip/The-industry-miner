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
    description: "Build a jewellery brand that prints money. Zero experience needed — start, brand and sell jewellery profitably. Now ₦69,000.",
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
          <div className={`absolute inset-0 ${s.id === 5 ? "bg-gradient-to-r from-black/85 via-black/60 to-black/30" : "bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent"}`} />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col justify-center relative z-20">
        <div
          key={currentSlide}
          className="max-w-2xl"
          style={{ animation: "fadeSlideUp 0.7s ease-out both" }}
        >
          {isJewellery ? (
            <div className="inline-flex items-center gap-2 bg-amber-400/20 text-amber-400 border border-amber-400/40 px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6">
              <Gem className="w-3 h-3" />
              {slide.badge}
            </div>
          ) : (
            <div className="inline-block bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
              {slide.badge}
            </div>
          )}

          <h1
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-serif drop-shadow-lg"
            style={isJewellery ? { background: "linear-gradient(135deg,#fff 0%,#e8e8e8 40%,#C9A14A 70%,#e0bc72 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" } : undefined}
          >
            {slide.title}
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-light">
            {slide.description}
          </p>

          <div className="flex gap-4 flex-wrap">
            {isJewellery ? (
              <Link href="/jewellery-masterclass">
                <Button
                  size="lg"
                  className="h-14 px-8 text-lg font-semibold shadow-xl"
                  style={{ background: "#C9A14A", color: "#000" }}
                >
                  🚀 {slide.cta}
                </Button>
              </Link>
            ) : (
              <a href={slide.ctaHref}>
                <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/20">
                  {slide.cta}
                </Button>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="absolute bottom-8 right-8 z-30 flex gap-3">
        <button
          onClick={prevSlide}
          className="h-11 w-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={nextSlide}
          className="h-11 w-11 rounded-full border border-white/20 bg-black/30 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide ? "w-8 bg-primary" : "w-2 bg-white/40 hover:bg-white/60"
            }`}
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
