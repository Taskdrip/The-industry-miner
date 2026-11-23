import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "wouter";
import { ArrowDown, ArrowUpRight, BookOpen, Gem, Lightbulb, UsersRound } from "lucide-react";

function JewelleryIllustration() {
  return (
    <div className="jewel-art" role="img" aria-label="Original line illustration of jewellery: a pendant, ring and maker's tools">
      <span className="jewel-art-index">THE MAKER'S TABLE / 01</span>
      <svg viewBox="0 0 570 570" aria-hidden="true" className="jewel-art-svg">
        <circle cx="285" cy="285" r="220" fill="none" stroke="#a9b9a9" strokeWidth="1" />
        <circle cx="285" cy="285" r="190" fill="none" stroke="#c2cbbd" strokeWidth="1" strokeDasharray="2 9" />
        <path d="M188 148c15 89 33 149 97 206 62-57 82-117 97-206" fill="none" stroke="#31594b" strokeWidth="5" strokeLinecap="round" />
        <path d="M258 332l27 31 28-31-28-34z" fill="#d98461" stroke="#31594b" strokeWidth="3" strokeLinejoin="round" />
        <path d="M270 332h30m-15-34v65" stroke="#f4e9d5" strokeWidth="2" />
        <circle cx="285" cy="330" r="5" fill="#f4e9d5" />
        <ellipse cx="363" cy="226" rx="29" ry="39" transform="rotate(36 363 226)" fill="none" stroke="#d98461" strokeWidth="6" />
        <path d="M115 375l126-9m-109 31 98-8m-82 29 70-7" stroke="#31594b" strokeWidth="3" strokeLinecap="round" />
        <path d="M130 370l-16 25m36-26-12 24" stroke="#d98461" strokeWidth="3" />
        <path d="M390 374c24-30 54-42 77-37m-60 56c20-18 38-22 59-17" fill="none" stroke="#31594b" strokeWidth="3" strokeLinecap="round" />
        <path d="M95 225h58m-29-29v58m321 104h44m-22-22v44" stroke="#b4c0b2" strokeWidth="1" />
        <circle cx="285" cy="110" r="5" fill="#d98461" />
        <circle cx="465" cy="286" r="4" fill="#d98461" />
      </svg>
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
