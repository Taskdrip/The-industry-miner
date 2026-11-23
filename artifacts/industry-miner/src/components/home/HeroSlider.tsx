import { useState, useEffect } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Link } from "wouter";

const slides = [
  {
    image: "/images/hero-1.png",
    eyebrow: "A platform for people building businesses",
    title: <>Build the business.<br /><em>Become the operator.</em></>,
    description: "Practical learning, experienced mentors and tools to help you move from promising idea to a business built to last.",
    primary: "Explore the platform",
    primaryHref: "#platform",
    secondary: "Browse masterclasses",
    secondaryHref: "#masterclasses",
  },
  {
    image: "/images/hero-2.png",
    eyebrow: "Make your next move visible",
    title: <>A proper website.<br /><em>On your terms.</em></>,
    description: "Choose a website made for your industry, make it yours, and launch a polished home for your business with Website Studio.",
    primary: "Discover Website Studio",
    primaryHref: "/studio",
    secondary: "See how it works",
    secondaryHref: "/studio",
  },
  {
    image: "/images/hero-3.png",
    eyebrow: "Knowledge you can put to work",
    title: <>Learn from people<br /><em>who have built it.</em></>,
    description: "Expert-led masterclasses turn real industry experience into practical steps you can apply to your own business.",
    primary: "Find your masterclass",
    primaryHref: "#masterclasses",
    secondary: "Explore the library",
    secondaryHref: "#courses",
  },
  {
    image: "/images/hero-4.png",
    eyebrow: "Get perspective. Keep moving.",
    title: <>The right support<br /><em>changes the pace.</em></>,
    description: "Get a clearer path through the decisions, systems and growing pains that come with running a business.",
    primary: "Explore mentorship",
    primaryHref: "#mentorship",
    secondary: "Browse resources",
    secondaryHref: "#toolkits",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const motionPreference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotionPreference = () => setReducedMotion(motionPreference.matches);
    syncMotionPreference();
    motionPreference.addEventListener("change", syncMotionPreference);
    return () => motionPreference.removeEventListener("change", syncMotionPreference);
  }, []);

  useEffect(() => {
    if (reducedMotion || isPaused) return;
    const timer = window.setInterval(() => setCurrentSlide((index) => (index + 1) % slides.length), 7200);
    return () => window.clearInterval(timer);
  }, [reducedMotion, isPaused]);

  const showSlide = (index: number) => setCurrentSlide((index + slides.length) % slides.length);
  const slide = slides[currentSlide];

  return (
    <section
      className="landing-hero"
      aria-roledescription="carousel"
      aria-label="The Industry Miner"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
    >
      {slides.map((item, index) => (
        <img
          key={item.image}
          src={item.image}
          alt=""
          aria-hidden="true"
          className="landing-hero-image"
          style={{ opacity: index === currentSlide ? 1 : 0, transform: index === currentSlide && !reducedMotion ? "scale(1.035)" : "scale(1)" }}
        />
      ))}
      <div className="landing-hero-copy" key={currentSlide}>
        <div className="landing-hero-eyebrow">{slide.eyebrow}</div>
        <h1>{slide.title}</h1>
        <p className="landing-hero-description">{slide.description}</p>
        <div className="landing-hero-actions">
          <Link href={slide.primaryHref} data-testid={`link-hero-primary-${currentSlide + 1}`} className="landing-cta-primary">
            {slide.primary}<ArrowUpRight className="h-4 w-4" />
          </Link>
          <Link href={slide.secondaryHref} data-testid={`link-hero-secondary-${currentSlide + 1}`} className="landing-cta-secondary">
            {slide.secondary}<ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      <div className="landing-side-note">Build with clarity · Grow with purpose</div>
      <div className="landing-hero-foot">
        <a href="#platform" data-testid="link-hero-scroll" className="flex items-center gap-2 text-inherit no-underline">
          A more practical way forward <ArrowDown className="h-3 w-3" />
        </a>
        <div className="landing-slide-controls" aria-label="Hero slide controls">
          <button type="button" data-testid="button-hero-previous" onClick={() => showSlide(currentSlide - 1)} aria-label="Previous slide" className="mr-2 grid h-8 w-8 place-items-center border border-white/30 text-white transition-colors hover:bg-white/10">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {slides.map((item, index) => (
            <button
              type="button"
              key={item.eyebrow}
              data-testid={`button-hero-slide-${index + 1}`}
              className="landing-slide-dot"
              onClick={() => showSlide(index)}
              aria-label={`Show slide ${index + 1}: ${item.eyebrow}`}
              aria-current={currentSlide === index}
            />
          ))}
          <span className="landing-slide-number">{String(currentSlide + 1).padStart(2, "0")} / 0{slides.length}</span>
          <button type="button" data-testid="button-hero-next" onClick={() => showSlide(currentSlide + 1)} aria-label="Next slide" className="ml-2 grid h-8 w-8 place-items-center border border-white/30 text-white transition-colors hover:bg-white/10">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
