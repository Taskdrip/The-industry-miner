import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Link } from "wouter";
import { type FormEvent, useState } from "react";
import { ArrowUpRight, Check, Globe2, LockKeyhole, PanelsTopLeft, Send, Server, X } from "lucide-react";

const extensions = [".com", ".org", ".net", ".co", ".io", ".ng", ".com.ng", ".org.ng", ".net.ng"];

export default function Domains() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [domainIdea, setDomainIdea] = useState("");
  const [needs, setNeeds] = useState<string[]>([]);
  const [prepared, setPrepared] = useState(false);
  const toggleNeed = (need: string) => setNeeds((current) => current.includes(need) ? current.filter((item) => item !== need) : [...current, need]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = encodeURIComponent(`Domain & website launch enquiry${domainIdea ? ` — ${domainIdea}` : ""}`);
    const body = encodeURIComponent([
      "Hello The Industry Miner,",
      "",
      "I would like to enquire about domain registration and website launch support.",
      `Name: ${name}`,
      `Email: ${email}`,
      `Domain idea: ${domainIdea || "Not decided yet"}`,
      `I'm interested in: ${needs.length ? needs.join(", ") : "Please advise"}`,
      "",
      "Please share the next steps and current service availability.",
    ].join("\n"));
    setPrepared(true);
    window.location.href = `mailto:support@theindustryminer.com?subject=${subject}&body=${body}`;
  }

  return (
    <div className="landing-shell min-h-[100dvh] flex flex-col font-sans">
      <Header />
      <main className="domains-page flex-grow">
        <section className="domains-hero">
          <div className="domains-hero-copy">
            <span className="landing-kicker"><Globe2 size={14} /> Domains / web launch</span>
            <h1>Your idea deserves its own corner of the <em>internet.</em></h1>
            <p>Planning a website for your business? Tell us what you have in mind. We can discuss domain registration, a website template and launch support through a clearly scoped enquiry.</p>
            <a href="#launch-enquiry" data-testid="link-domains-start-enquiry" className="landing-cta-primary">Start a launch enquiry <ArrowUpRight size={16} /></a>
            <div className="domains-hero-note"><span className="domains-note-mark"><Globe2 size={18} /></span><span><strong>Global extensions and Nigerian .ng options</strong><small>Availability and service details are confirmed after enquiry.</small></span></div>
          </div>
          <div className="domains-visual" aria-label="Illustration of a website being prepared for launch">
            <div className="domains-orbit orbit-a"></div><div className="domains-orbit orbit-b"></div>
            <div className="domains-browser">
              <div className="domains-browser-bar"><i></i><i></i><i></i><span>your-business</span></div>
              <div className="domains-browser-page"><small>YOUR NAME, YOUR SPACE</small><strong>A business<br />worth finding.</strong><span className="domains-browser-button"></span><div className="domains-browser-landscape"><span></span><b></b></div></div>
            </div>
            <div className="domains-float domain-float-one">.com.ng <Check size={13} /></div>
            <div className="domains-float domain-float-two"><LockKeyhole size={14} /> SSL / SECURITY</div>
            <span className="domains-visual-caption">A DIGITAL HOME, BUILT AROUND YOUR BUSINESS</span>
          </div>
        </section>
        <section className="domains-extensions">
          <div className="domains-section-heading"><span className="landing-section-label">Choose a direction</span><h2>Global reach. Local roots.</h2><p>We can discuss common global domain extensions alongside Nigerian options. The right fit depends on your business and what is available when a request is checked.</p></div>
          <div className="extension-panel">
            <div><span className="extension-label">GLOBAL EXTENSIONS</span><div className="extension-list">{extensions.slice(0, 5).map((item) => <span className="extension-chip" key={item} data-testid={`extension-${item.replace(".", "")}`}>{item}</span>)}</div></div>
            <div><span className="extension-label">NIGERIAN EXTENSIONS</span><div className="extension-list">{extensions.slice(5).map((item) => <span className="extension-chip extension-chip-local" key={item} data-testid={`extension-${item.replace(".", "")}`}>{item}</span>)}</div></div>
            <p className="extension-disclaimer"><i></i>These are examples, not availability results. We do not offer a live domain lookup or checkout on this page.</p>
          </div>
        </section>
        <section className="domains-services">
          <div className="domains-services-title"><span className="landing-section-label">From template to launch plan</span><h2>One clear conversation. The right next steps.</h2></div>
          <div className="domains-service-grid">
            <article><span>01</span><Globe2 size={21} /><h3>Domain registration</h3><p>Share the name and extension you have in mind. Registration requests are handled by enquiry; no live availability check or checkout is connected here.</p></article>
            <article><span>02</span><PanelsTopLeft size={21} /><h3>Template installation</h3><p>Discuss an installable website template and the setup your business needs. A provider and hosting arrangement have not yet been connected.</p></article>
            <article><span>03</span><Server size={21} /><h3>Hosting & SSL</h3><p>Hosting and SSL can be part of a future custom-domain launch service. Provisioning is not currently available through this site.</p></article>
          </div>
        </section>
        <section className="studio-publishing">
          <div className="studio-publishing-icon"><PanelsTopLeft size={23} /></div>
          <div className="studio-publishing-copy"><span className="landing-section-label">Available now</span><h2>Website Studio publishes to its current platform.</h2><p>Build and publish your business website through Website Studio. This is separate from registering a custom domain: custom-domain mapping, hosting setup and SSL provisioning are not currently offered through the Studio publishing flow.</p></div>
          <Link href="/studio" data-testid="link-domains-studio" className="landing-studio-link">Explore Website Studio <ArrowUpRight size={16} /></Link>
        </section>
        <section className="launch-enquiry" id="launch-enquiry">
          <div className="launch-enquiry-copy"><span className="landing-section-label">Tell us what you need</span><h2>Start with an enquiry, not a checkout.</h2><p>There is no registrar or hosting provider connected yet. Send us your request by email and we will follow up about availability, scope and next steps. No payment is taken here.</p><div className="enquiry-steps"><span><i>1</i> Share your idea</span><span><i>2</i> We review your request</span><span><i>3</i> Confirm the next steps together</span></div></div>
          <form className="launch-form" onSubmit={handleSubmit}>
            <label htmlFor="launch-name">Your name<input id="launch-name" data-testid="input-launch-name" autoComplete="name" value={name} onChange={(event) => setName(event.target.value)} required placeholder="Name" /></label>
            <label htmlFor="launch-email">Email address<input id="launch-email" data-testid="input-launch-email" autoComplete="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="you@example.com" /></label>
            <label htmlFor="launch-domain">Domain name or idea <span>Optional</span><input id="launch-domain" data-testid="input-launch-domain" value={domainIdea} onChange={(event) => setDomainIdea(event.target.value)} placeholder="e.g. yourbrand.com.ng" /></label>
            <fieldset><legend>What would you like to discuss?</legend><div className="enquiry-options">
              {["Domain registration", "Website template", "Hosting & SSL", "Not sure yet"].map((need) => (
                <button type="button" data-testid={`button-enquiry-${need.toLowerCase().replaceAll(" ", "-").replace("&", "and")}`} aria-pressed={needs.includes(need)} className={`enquiry-option ${needs.includes(need) ? "selected" : ""}`} key={need} onClick={() => toggleNeed(need)}>{needs.includes(need) ? <Check size={14} /> : <span className="enquiry-option-box"></span>}{need}</button>
              ))}
            </div></fieldset>
            <button type="submit" data-testid="button-submit-launch-enquiry" className="launch-submit">Prepare email enquiry <Send size={15} /></button>
            {prepared && <p className="launch-confirmation" role="status" data-testid="status-launch-enquiry"><Check size={15} /> Your email app should open with the request filled in. If it does not, email support@theindustryminer.com.</p>}
            <small className="launch-form-note"><X size={13} /> This form opens your email app. It does not check, reserve or purchase a domain.</small>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  );
}
