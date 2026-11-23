import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import TrustBar from "@/components/home/TrustBar";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import CourseCatalog from "@/components/home/CourseCatalog";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import { ArrowUpRight, PanelsTopLeft } from "lucide-react";
import { Link } from "wouter";
import "@/landing.css";

function WebsiteStudioFeature() {
  return (
    <section className="landing-studio-feature" id="platform" aria-labelledby="studio-feature-heading">
      <div className="landing-studio-inner">
        <div>
          <div className="landing-kicker"><PanelsTopLeft className="h-3.5 w-3.5" /> A new way to get your business online</div>
          <h2 id="studio-feature-heading">Your website is part of the business. Build it like one.</h2>
          <p>Website Studio pairs an industry-specific starting point with the freedom to make it your own. Shape the pages, tell your story and publish a professional home for the business you are building.</p>
          <Link href="/studio" data-testid="link-studio-feature" className="landing-studio-link">Explore Website Studio <ArrowUpRight className="h-4 w-4" /></Link>
        </div>
        <div className="landing-studio-steps" aria-label="Website Studio process">
          <div className="landing-studio-step"><span>01 / CHOOSE</span><strong>Start in your industry</strong><small>Begin with a relevant site foundation.</small></div>
          <div className="landing-studio-step"><span>02 / SHAPE</span><strong>Make it yours</strong><small>Put your offer and point of view front and center.</small></div>
          <div className="landing-studio-step"><span>03 / PUBLISH</span><strong>Go live with purpose</strong><small>Launch an installable website for your venture.</small></div>
          <Link href="/studio" data-testid="link-studio-start" className="landing-studio-step group text-inherit no-underline transition-colors hover:bg-[#e2e8dd]">
            <span>READY WHEN YOU ARE</span><strong>Build your business site <ArrowUpRight className="inline h-4 w-4 text-[#b66e4c] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></strong><small>Open Website Studio</small>
          </Link>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="landing-shell min-h-[100dvh] flex flex-col font-sans">
      <Header />
      <main className="flex-grow">
        <HeroSlider />
        <WebsiteStudioFeature />
        <TrustBar />
        <div id="toolkits">
          <WhatWeOffer />
        </div>
        <div id="masterclasses">
          <FeaturedCourses />
          <CourseCatalog />
        </div>
        <div id="mentorship">
          <Testimonials />
        </div>
        <CallToAction />
      </main>
      <Footer />
    </div>
  );
}
