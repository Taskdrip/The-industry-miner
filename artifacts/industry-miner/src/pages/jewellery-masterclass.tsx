import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Star, Users, Clock, Award, CheckCircle2, ChevronDown, PlayCircle, Gem } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

const curriculum = [
  { num: "01", title: "A–Z of Starting a Jewellery Business", featured: true },
  { num: "02", title: "The art of building a business" },
  { num: "03", title: "Having the right mindset" },
  { num: "04", title: "The Structure of a business" },
  { num: "05", title: "Legal Framework In Business Construction" },
  { num: "06", title: "Staffing top talents" },
  { num: "07", title: "Employer – Employee relationship" },
  { num: "08", title: "Advertisement" },
  { num: "09", title: "Record keeping" },
  { num: "10", title: "Taxation in business" },
  { num: "11", title: "Licences and Intellectual Property Protection" },
  { num: "12", title: "Evolvement and Venturing" },
  { num: "13", title: "Profit Maximisation in business" },
  { num: "14", title: "Social Framework In Business Construction" },
  { num: "15", title: "Business money making machines" },
  { num: "16", title: "Silent pillars of a business" },
  { num: "17", title: "The sitting boards of a company" },
  { num: "18", title: "The enemies of business growth" },
  { num: "19", title: "The Coordinated Boss" },
  { num: "20", title: "Visionary Leadership" },
  { num: "21", title: "The Greater Good in Business" },
  { num: "22", title: "Challenges of running a business" },
  { num: "23", title: "Understanding Contracts (part 1)" },
  { num: "24", title: "Understanding Contracts (part 2)" },
];

const bonuses = [
  { icon: "📖", label: "Business Plan Template", desc: "A professionally structured roadmap to help you clarify your strategy and growth path." },
  { icon: "✅", label: "Jewellery Business Checklist", desc: "Ensure every critical element of your business is set up and running efficiently." },
  { icon: "📦", label: "Trusted Supplier & Shipping Agent", desc: "Get direct access to a vetted all-in-one supplier and shipping agent." },
  { icon: "🏆", label: "Certificate of Completion", desc: "Showcase your commitment to business excellence." },
];

const painPoints = [
  "You love jewellery but have no idea how to turn it into a real income",
  "You've been 'thinking about it' for months but don't know where to start",
  "You're afraid of pricing wrong and undervaluing your work",
  "You don't know which suppliers are trustworthy and won't rip you off",
  "You post on Instagram but nobody is buying from you",
  "You want a full-time income but feel stuck at the side-hustle stage",
];

const forWho = [
  { title: "Aspiring Jewellery Entrepreneurs", desc: "You love jewellery and you know you've got something special — now it's time to build a real business around it." },
  { title: "Jewellery Designers & Makers", desc: "You have the craft but not the business strategy. This masterclass bridges that gap completely." },
  { title: "Side Hustlers Ready to Go Full-Time", desc: "You're selling occasionally but want systems to turn it into a consistent, full-time income." },
  { title: "Existing Business Owners", desc: "You want to add a jewellery line or take your current shop to the next level." },
];

const testimonials = [
  { initials: "IC", name: "Ifeoma C.", color: "#C9A14A", quote: "This masterclass changed everything for me. Within 6 weeks I had my first 10 customers and made back my investment 3x. The supplier contacts alone are worth triple the price!" },
  { initials: "SO", name: "Sarah O.", color: "#8B7355", quote: "I was completely lost before this. Now I have a proper brand, a pricing strategy, and I'm making consistent sales every week. The business masterclass videos are pure gold." },
  { initials: "DM", name: "Damilola M.", color: "#D4AF7A", quote: "The step-by-step approach is exactly what I needed. I started with zero experience and now I'm running a profitable jewellery business from home. Highly recommend!" },
];

const faqs = [
  { q: "Do I need prior experience to join?", a: "Absolutely not. This masterclass is designed for complete beginners and experienced jewellery lovers alike. We start from the very foundation and build up systematically." },
  { q: "How long do I have access to the materials?", a: "You get 3 months of access to all modules and bonuses through your subscription. This gives you plenty of time to go through everything at your own pace." },
  { q: "How soon can I start making money?", a: "Students have reported making their first sales within days of completing Module 3. With the right strategy and our supplier contacts, results come fast." },
  { q: "Is this only for people in Nigeria?", a: "Not at all. The strategies apply globally. We have students across Africa, the UK, the US, and beyond running profitable jewellery businesses." },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/10 bg-white/[0.03] rounded-xl overflow-hidden mb-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left font-semibold text-white/90 hover:text-white transition-colors"
      >
        <span className="text-sm md:text-base">{q}</span>
        <ChevronDown className={`w-5 h-5 text-amber-400 flex-shrink-0 ml-4 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-5 text-white/55 text-sm leading-relaxed border-t border-white/06">
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  );
}

const CHECKOUT_URL = "https://theindustryminer.com/checkout/?add-to-cart=11642";
const PRICE_NAIRA = 69_000;
const ORIGINAL_PRICE_NAIRA = 150_000;

export default function JewelleryMasterclass() {
  return (
    <div className="min-h-screen bg-[#080808] text-white font-sans">
      <Header />

      {/* Urgency Banner */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-500 to-amber-700 text-black text-center py-3 px-4 text-sm font-bold">
        🔥 LIMITED SEATS — Registration closes soon! Only <strong>17 spots</strong> remaining!
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden pt-24 pb-20 px-4">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-amber-400/5 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/30 text-amber-400 text-xs font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-6">
              <Gem className="w-3 h-3" />
              TIM Jewellery Masterclass
            </div>

            <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-5 bg-gradient-to-br from-white via-gray-100 to-amber-400 bg-clip-text text-transparent">
              BUILD A JEWELLERY BRAND THAT PRINTS MONEY
            </h1>

            <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-lg">
              Zero experience? No problem! Let's go from beginner to boss in no time with proven strategies that show you how to start, brand and sell jewellery profitably.
            </p>

            {/* Social proof */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm">
              <span className="text-amber-400 font-bold text-lg">★★★★★</span>
              <span className="font-bold text-white">4.9/5</span>
              <span className="text-white/30">|</span>
              <span className="text-white/65"><strong className="text-white">500+</strong> students</span>
            </div>

            {/* Price box */}
            <div className="inline-flex bg-white/[0.04] border border-amber-400/20 rounded-2xl overflow-hidden mb-8">
              <div className="px-5 py-4 border-r border-white/08 text-center">
                <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Was</div>
                <div className="text-base text-white/30 line-through font-bold">
                  ₦{ORIGINAL_PRICE_NAIRA.toLocaleString("en-NG")}
                </div>
              </div>
              <div className="px-5 py-4 border-r border-white/08 text-center">
                <div className="text-[10px] text-amber-400 uppercase font-bold tracking-widest mb-1">Now</div>
                <div className="text-3xl font-black text-white">
                  ₦{PRICE_NAIRA.toLocaleString("en-NG")}
                </div>
              </div>
              <div className="px-4 py-4 flex items-center">
                <div className="text-red-400 text-xs font-black text-center leading-tight">
                  SAVE<br />₦81k
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-lg uppercase tracking-wider px-10 py-5 rounded-full transition-all shadow-2xl shadow-amber-500/20"
              >
                🚀 REGISTER NOW
              </a>
            </div>

            {/* Bonus highlights */}
            <div className="flex flex-col gap-2">
              {["Suppliers contact", "Shipping agents", "Business plan & checklist", "Certificate of Completion"].map((item) => (
                <div key={item} className="flex items-center gap-3 text-sm text-white/80">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — image */}
          <div className="relative">
            <div className="absolute inset-[-12px] bg-gradient-to-br from-amber-400/15 to-transparent rounded-3xl blur-2xl" />
            <img
              src="https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=700&q=80"
              alt="TIM Jewellery Masterclass"
              className="w-full rounded-3xl shadow-[0_32px_80px_rgba(0,0,0,0.6)] object-cover relative z-10 aspect-[4/5]"
            />
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-amber-400/15 bg-[#0e0e0e] py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "500+", label: "Students Enrolled" },
            { stat: "4.9/5", label: "Average Rating" },
            { stat: "6", label: "Power Modules" },
            { stat: "3 Months", label: "Full Access" },
          ].map(({ stat, label }) => (
            <div key={label}>
              <div className="text-3xl md:text-4xl font-black text-amber-400 mb-2">{stat}</div>
              <div className="text-xs text-white/45 uppercase tracking-widest font-semibold">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Bonuses */}
      <section className="py-20 px-4 bg-[#080808]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 text-amber-400 text-xs font-bold uppercase tracking-widest mb-4">
              <span className="w-8 h-px bg-amber-400/40" />WHAT'S INCLUDED?<span className="w-8 h-px bg-amber-400/40" />
            </div>
            <h2 className="text-3xl md:text-5xl font-black mb-3">Exclusive Bonuses You Get Today</h2>
            <p className="text-white/45 text-sm">Every bonus below is unlocked free the moment you register</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {bonuses.map((b) => (
              <div key={b.label} className="bg-[#111] border border-white/[0.09] hover:border-amber-400/30 rounded-2xl p-6 flex flex-col gap-4 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="w-11 h-11 bg-amber-400/10 border border-amber-400/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                    {b.icon}
                  </div>
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/20 px-3 py-1 rounded-full uppercase tracking-wider">FREE</span>
                </div>
                <div>
                  <h3 className="text-sm font-bold mb-2 leading-snug">{b.label}</h3>
                  <p className="text-white/50 text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-lg uppercase tracking-wider px-12 py-5 rounded-full transition-all shadow-2xl shadow-amber-500/20"
            >
              Claim Your Spot — ₦{PRICE_NAIRA.toLocaleString("en-NG")} →
            </a>
          </div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-20 px-4 bg-[#0b0b0b] border-y border-white/05">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 text-amber-400 text-xs font-bold uppercase tracking-widest mb-6">
            <span className="w-8 h-px bg-amber-400/40" />Sound Familiar?<span className="w-8 h-px bg-amber-400/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-10 leading-tight">
            You Know You Have What It Takes
            <br />
            <span className="text-white/35">— But Something Keeps Stopping You</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left mb-12">
            {painPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 bg-white/[0.025] border border-white/07 rounded-2xl px-4 py-4">
                <span className="w-5 h-5 bg-red-500/15 border border-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-red-400 text-[10px] font-black mt-0.5">✕</span>
                <p className="text-white/60 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-amber-400/09 to-amber-400/04 border border-amber-400/28 rounded-2xl p-8">
            <p className="text-lg font-semibold text-white/88 leading-relaxed">
              <strong className="text-amber-400">This masterclass is the exact roadmap</strong> that transforms aspiring jewellery lovers into profitable business owners — even if you're starting from absolute zero.
            </p>
          </div>
        </div>
      </section>

      {/* Video Preview */}
      <section className="py-20 px-4 bg-[#080808]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-8 h-px bg-amber-400/40" />Watch the preview<span className="w-8 h-px bg-amber-400/40" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-10">Watch the Masterclass Preview</h2>
          <a
            href="https://youtu.be/qw9t_YRZgX0"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-3xl overflow-hidden border border-amber-400/18 shadow-[0_0_80px_rgba(201,161,74,0.14)] group"
          >
            <img
              src="https://img.youtube.com/vi/qw9t_YRZgX0/maxresdefault.jpg"
              alt="Masterclass Preview"
              className="w-full block"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=900&q=80";
              }}
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-colors">
              <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(201,161,74,0.55)] group-hover:scale-110 transition-transform">
                <PlayCircle className="w-10 h-10 text-black ml-1" />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* Curriculum */}
      <section className="py-20 px-4 bg-[#0b0b0b] border-y border-white/05">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-[#111] to-[#0a0a0a] border border-amber-400/25 rounded-3xl overflow-hidden relative">
            <div className="absolute top-0 right-0 w-72 h-72 bg-amber-400/05 rounded-full blur-[60px] pointer-events-none" />
            <div className="p-8 md:p-12 grid grid-cols-1 lg:grid-cols-[340px_1fr] gap-10 relative">
              {/* Info column */}
              <div className="flex flex-col gap-6">
                <div className="flex items-start justify-between flex-wrap gap-3">
                  <div className="w-14 h-14 bg-amber-400/12 border border-amber-400/25 rounded-2xl flex items-center justify-center text-2xl">🎬</div>
                  <span className="text-[10px] font-black text-amber-400 bg-amber-400/10 border border-amber-400/25 px-3 py-2 rounded-full uppercase tracking-wider">₦120,000 VALUE — FREE</span>
                </div>
                <div>
                  <h3 className="text-xl font-black mb-3 leading-snug">Business Masterclass — Full Video Library</h3>
                  <p className="text-white/55 text-sm leading-relaxed">24 in-depth business masterclass videos covering everything from the A–Z of starting a jewellery business to mindset, contracts, leadership, taxation, legal frameworks, and profit maximisation.</p>
                </div>
                <div className="flex items-center gap-3 bg-amber-400/08 border border-amber-400/20 rounded-xl px-4 py-3">
                  <span className="text-amber-400">⚡</span>
                  <span className="text-xs font-semibold text-amber-400">24 in-depth video lessons included</span>
                </div>
              </div>

              {/* Curriculum grid */}
              <div>
                <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-4">Complete Video Curriculum</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                  {curriculum.map((lesson) => (
                    <div
                      key={lesson.num}
                      className={`flex items-start gap-3 ${lesson.featured ? "col-span-full bg-amber-400/09 border border-amber-400/22 rounded-xl px-4 py-3 mb-2" : ""}`}
                    >
                      <span className={`flex-shrink-0 font-black text-xs mt-0.5 font-variant-numeric-tabular ${lesson.featured ? "text-amber-400" : "text-amber-400/50"}`}>
                        {lesson.num}
                      </span>
                      <span className={`text-xs leading-snug ${lesson.featured ? "text-amber-400 font-black text-sm" : "text-white/55"}`}>
                        {lesson.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who is this for */}
      <section className="py-20 px-4 bg-[#080808]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-8 h-px bg-amber-400/40" />Secure Your Seat<span className="w-8 h-px bg-amber-400/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-12">Who Is This Masterclass For?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left mb-12">
            {forWho.map(({ title, desc }) => (
              <div key={title} className="bg-[#111] border border-white/[0.09] hover:border-amber-400/30 rounded-2xl p-6 flex items-start gap-4 transition-colors">
                <div className="w-10 h-10 bg-amber-400/10 border border-amber-400/22 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Gem className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <strong className="text-sm font-bold block mb-2">{title}</strong>
                  <p className="text-white/55 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-lg uppercase tracking-wider px-12 py-5 rounded-full transition-all shadow-2xl shadow-amber-500/20"
          >
            → Join the Masterclass Now
          </a>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-[#0b0b0b] border-y border-white/05">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
            <span className="w-8 h-px bg-amber-400/40" />Student Results<span className="w-8 h-px bg-amber-400/40" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black mb-3">Real Students, Real Results</h2>
          <p className="text-white/40 text-sm mb-12">★★★★★ Rated 4.9 from 500+ students</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-[#111] border border-white/[0.09] rounded-2xl p-6 flex flex-col gap-4">
                <div className="flex gap-0.5 text-amber-400 text-sm">★★★★★</div>
                <p className="text-white/65 text-sm leading-relaxed italic flex-1">"{t.quote}"</p>
                <div className="flex items-center gap-3 border-t border-white/06 pt-4">
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center font-black text-xs text-black flex-shrink-0"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">{t.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-4 bg-[#0b0b0b]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 text-amber-400 text-xs font-bold uppercase tracking-widest mb-5">
              <span className="w-8 h-px bg-amber-400/40" />Got Questions?<span className="w-8 h-px bg-amber-400/40" />
            </div>
            <h2 className="text-3xl md:text-4xl font-black">Frequently Asked Questions</h2>
          </div>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-[#080808] to-[#0e0a00]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-5xl mb-6">💎</div>
          <h2 className="text-3xl md:text-5xl font-black mb-5 bg-gradient-to-r from-white to-amber-400 bg-clip-text text-transparent">
            Your Jewellery Empire Starts Here
          </h2>
          <p className="text-white/55 text-lg mb-10">
            Join 500+ students already building profitable jewellery businesses. Don't let another month go by wondering "what if".
          </p>

          <div className="inline-flex bg-white/[0.04] border border-amber-400/20 rounded-2xl overflow-hidden mb-8">
            <div className="px-6 py-5 border-r border-white/08 text-center">
              <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Was</div>
              <div className="text-lg text-white/30 line-through font-bold">₦{ORIGINAL_PRICE_NAIRA.toLocaleString("en-NG")}</div>
            </div>
            <div className="px-6 py-5 text-center">
              <div className="text-[10px] text-amber-400 uppercase font-bold tracking-widest mb-1">Today Only</div>
              <div className="text-4xl font-black text-white">₦{PRICE_NAIRA.toLocaleString("en-NG")}</div>
            </div>
          </div>

          <div>
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-black text-xl uppercase tracking-wider px-14 py-6 rounded-full transition-all shadow-2xl shadow-amber-500/25"
            >
              🚀 Claim My Spot Now
            </a>
            <p className="text-white/30 text-sm mt-4">30-Day Money-Back Guarantee · Secure Checkout</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
