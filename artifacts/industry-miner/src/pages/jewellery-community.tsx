import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "wouter";
import { ArrowDown, ArrowUpRight, BookOpen, Gem, Lightbulb, UsersRound } from "lucide-react";

function JewelleryIllustration() {
  return (
    <div className="jewel-art jewel-photo">
      <img src="/images/jewellery-community.jpg" alt="A pearl necklace presented in a box, a close-up of jewellery craft and presentation" data-testid="img-community-hero" />
      <span className="jewel-art-index">THE MAKER'S TABLE / 01</span>
      <div className="jewel-art-note"><span>FORM / CRAFT / TRADE</span><strong>Make the work.<br />Build the business.</strong></div>
      <span className="jewel-art-caption">PRACTICAL SUPPORT FOR<br />JEWELLERY ENTREPRENEURS</span>
    </div>
  );
}

const resourceItems = [
  { icon: Lightbulb, title: "Business know-how", text: "Practical guidance to help you think through the business behind your craft." },
  { icon: Gem, title: "Jewellery resources", text: "Materials focused on the realities of making, selling and growing a jewellery brand." },
  { icon: BookOpen, title: "A place to keep learning", text: "Resources to revisit as your ideas, practice and business evolve." },
  { icon: UsersRound, title: "A wider network", text: "Connect with people building businesses, sharing knowledge and making opportunities." },
];

export default function JewelleryCommunity() {
  return (
    <div className="landing-shell min-h-[100dvh] flex flex-col font-sans">
      <Header />
      <main className="community-page flex-grow">
        <section className="community-hero">
          <div className="community-hero-inner">
            <div className="community-hero-copy">
              <span className="landing-kicker"><Gem size={14} /> A place to make the next move</span>
              <h1>Build your jewellery business <em>with the community.</em></h1>
              <p>For jewellery entrepreneurs, makers and growing jewellery brands, The Jewellery Community provides one year of practical business and jewellery resources in one place.</p>
              <div className="community-actions">
                <a href="mailto:support@theindustryminer.com?subject=Jewellery%20Community%20enquiry" data-testid="link-community-enquiry" className="landing-cta-primary">Ask about the community <ArrowUpRight size={16} /></a>
                <a href="#community-resources" data-testid="link-community-resources" className="community-secondary">See what it supports <ArrowDown size={15} /></a>
              </div>
              <div className="community-term"><span>01 YEAR</span><p>Practical business and jewellery resources, available in one place.</p></div>
            </div>
            <JewelleryIllustration />
          </div>
          <div className="community-hero-foot"><span>THE INDUSTRY MINER / JEWELLERY COMMUNITY</span><span>BUILD WITH PURPOSE</span></div>
        </section>
        <section className="community-intro">
          <span className="landing-section-label">For the person behind the pieces</span>
          <h2>Good work deserves a business built to carry it.</h2>
          <p>From the first idea to a growing jewellery brand, the practical side of business matters. The Jewellery Community brings learning and resources together to help you make thoughtful progress, develop your craft into a venture, and keep building with a clearer view of what comes next.</p>
        </section>
        <section className="community-photo-story" aria-label="The craft and the business">
          <div><span className="landing-section-label">The work behind the work</span><h2>From a first piece to a business with a point of view.</h2></div>
          <img src="/images/jewellery-community.jpg" alt="Pearl necklace resting in its presentation box" />
          <p>The Jewellery Community is a place to return to practical business and jewellery resources as your ideas, practice and business evolve. Build with a clearer view of what comes next.</p>
        </section>
        <section className="community-resources" id="community-resources">
          <div className="community-resources-head">
            <div><span className="landing-section-label">A year of practical support</span><h2>Resources for the work behind the work.</h2></div>
            <p>Designed for jewellery entrepreneurs, makers and growing brands at different points in the journey.</p>
          </div>
          <div className="community-resource-list">
            {resourceItems.map(({ icon: Icon, title, text }, index) => (
              <article className="community-resource" key={title} data-testid={`card-community-resource-${index + 1}`}>
                <span className="community-resource-number">0{index + 1}</span>
                <span className="community-resource-icon"><Icon size={20} strokeWidth={1.5} /></span>
                <div><h3>{title}</h3><p>{text}</p></div>
                <ArrowUpRight className="community-resource-arrow" size={17} />
              </article>
            ))}
          </div>
        </section>
        <section className="community-masterclass">
          <div className="community-masterclass-mark"><Gem size={32} strokeWidth={1.2} /></div>
          <div><span className="landing-section-label">Keep learning</span><h2>Want a structured starting point?</h2><p>Explore the Jewellery Masterclass for lessons on starting, structuring and growing a jewellery business.</p></div>
          <Link href="/jewellery-masterclass" data-testid="link-community-masterclass" className="landing-studio-link">Explore the masterclass <ArrowUpRight size={16} /></Link>
        </section>
        <section className="community-close">
          <span className="landing-kicker">Your next chapter starts with a conversation</span>
          <h2>Make room for the business you want to build.</h2>
          <a href="mailto:support@theindustryminer.com?subject=Jewellery%20Community%20enquiry" data-testid="link-community-contact" className="landing-cta-primary">Contact The Industry Miner <ArrowUpRight size={16} /></a>
        </section>
      </main>
      <Footer />
    </div>
  );
}
