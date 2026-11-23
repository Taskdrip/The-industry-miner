import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSlider from "@/components/home/HeroSlider";
import TrustBar from "@/components/home/TrustBar";
import WhatWeOffer from "@/components/home/WhatWeOffer";
import FeaturedCourses from "@/components/home/FeaturedCourses";
import CourseCatalog from "@/components/home/CourseCatalog";
import Testimonials from "@/components/home/Testimonials";
import CallToAction from "@/components/home/CallToAction";
import { ArrowUpRight, PanelsTopLeft, UsersRound, BookOpen, BriefcaseBusiness, Network, Compass } from "lucide-react";
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

function IndustryMinerStory() {
  const supports = [
    { icon: BriefcaseBusiness, label: "Business structuring", title: "Start with a stronger foundation.", copy: "Have a business idea or an existing business that needs structure? Our Business Structuring Program provides personalised business planning, market research, financial modelling, strategic guidance and growth support.", link: "/domains", action: "Build with us" },
    { icon: UsersRound, label: "Jewellery community", title: "Build your jewellery business with us.", copy: "For jewellery entrepreneurs, makers and growing jewellery brands, The Jewellery Community brings one year of practical business and jewellery resources together in one place.", link: "/jewellery-community", action: "Explore the community" },
    { icon: BookOpen, label: "Library", title: "Knowledge you can keep coming back to.", copy: "Explore practical books, eBooks and resources designed to help entrepreneurs learn, think strategically and make better business decisions.", link: "#toolkits", action: "Explore the library" },
    { icon: Network, label: "Network", title: "Connect with people building the future.", copy: "The Industry Miner brings entrepreneurs, mentors, professionals and organisations together to create opportunities for collaboration, knowledge sharing and growth.", link: "/jewellery-community", action: "Join the network" },
    { icon: Compass, label: "Mentorship & impact", title: "Get perspective on the next move.", copy: "Have a business challenge you are trying to solve? Find practical mentorship around strategy, leadership, marketing, sales, technology and growth.", link: "#mentorship", action: "Explore mentorship" },
  ];
  return (
    <section className="home-story" aria-labelledby="home-story-heading">
      <div className="home-story-intro">
        <span className="landing-section-label">A platform for the work</span>
        <h2 id="home-story-heading">Every business starts with an ambition.</h2>
        <p>But turning an idea into a sustainable business, and taking an existing business to its next level, requires more than ambition. It requires knowledge, strategy, structure, expertise, relationships and the right opportunities.</p>
      </div>
      <div className="home-story-list">
        {supports.map(({ icon: Icon, label, title, copy, link, action }, index) => (
          <article className="home-story-row" key={label}>
            <span className="home-story-index">0{index + 1}</span>
            <span className="home-story-icon"><Icon size={19} strokeWidth={1.5} /></span>
            <div className="home-story-copy">
              <span>{label}</span><h3>{title}</h3><p>{copy}</p>
            </div>
            <Link href={link} data-testid={`link-home-story-${index + 1}`} className="home-story-link">{action}<ArrowUpRight size={15} /></Link>
          </article>
        ))}
      </div>
      <div className="home-story-contact">
        <span>Have a business challenge you are trying to solve?</span>
        <a href="mailto:support@theindustryminer.com" data-testid="link-home-contact">Talk with The Industry Miner <ArrowUpRight size={15} /></a>
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
        <IndustryMinerStory />
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
