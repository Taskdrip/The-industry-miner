import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const slides = [
  {
    id: 1,
    image: "/images/hero-1.png",
    title: "Masterclasses by Industry Experts",
    description: "Learn actionable strategies from founders who have built profitable businesses from the ground up.",
    cta: "Explore Masterclasses"
  },
  {
    id: 2,
    image: "/images/hero-2.png",
    title: "Tailored Mentorship",
    description: "Get 1-on-1 guidance to overcome challenges, structure your operations, and scale faster.",
    cta: "Find a Mentor"
  },
  {
    id: 3,
    image: "/images/hero-3.png",
    title: "Comprehensive Toolkits",
    description: "Plug-and-play financial models, operational templates, and marketing frameworks to save you hundreds of hours.",
    cta: "Browse Toolkits"
  },
  {
    id: 4,
    image: "/images/hero-4.png",
    title: "Exclusive Funding Access",
    description: "Prepare your pitch, understand valuation, and connect with our network of early-stage investors.",
    cta: "Learn About Funding"
  }
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

  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden bg-secondary">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-secondary/90 via-secondary/70 to-transparent" />
          
          <div className="container mx-auto px-4 max-w-7xl h-full flex flex-col justify-center relative z-20">
            <div className="max-w-2xl transform transition-all duration-700 translate-y-0">
              <div className="inline-block bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full text-sm font-semibold tracking-wider uppercase mb-6 backdrop-blur-sm">
                Empowering Entrepreneurs
              </div>
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight font-serif drop-shadow-lg">
                {slide.title}
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-10 leading-relaxed font-light">
                {slide.description}
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold shadow-xl shadow-primary/20">
                  {slide.cta}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Controls */}
      <div className="absolute bottom-8 right-8 z-30 flex gap-4">
        <button 
          onClick={prevSlide}
          className="h-12 w-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors"
        >
          <ChevronLeft />
        </button>
        <button 
          onClick={nextSlide}
          className="h-12 w-12 rounded-full border border-white/20 bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-primary hover:border-primary transition-colors"
        >
          <ChevronRight />
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
    </div>
  );
}
