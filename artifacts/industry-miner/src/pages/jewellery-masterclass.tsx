import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Star, Users, Clock, Award, CheckCircle2, ChevronDown, PlayCircle, Gem, Calendar, Shield, Zap } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

// ─── Constants ───────────────────────────────────────────────────────────────
const CHECKOUT_URL = "https://theindustryminer.com/checkout/?add-to-cart=11642";
const PRICE_NAIRA = 100_000;
const ORIGINAL_PRICE_NAIRA = 150_000;
const SAVINGS = ORIGINAL_PRICE_NAIRA - PRICE_NAIRA;

// ─── Curriculum (3 structured parts) ────────────────────────────────────────
const curriculumParts = [
  {
    part: "I",
    title: "Foundations",
    subtitle: "Build an unshakeable business base",
    color: "#C9A14A",
    lessons: [
      { num: "01", title: "A–Z of Starting a Jewellery Business", featured: true },
      { num: "02", title: "The Art of Building a Business" },
      { num: "03", title: "Having the Right Mindset" },
      { num: "04", title: "The Structure of a Business" },
      { num: "05", title: "Legal Framework in Business Construction" },
      { num: "06", title: "Staffing Top Talents" },
      { num: "07", title: "Employer–Employee Relationship" },
    ],
  },
  {
    part: "II",
    title: "Operations & Growth",
    subtitle: "Run, market and scale your brand",
    color: "#A07840",
    lessons: [
      { num: "08", title: "Advertisement" },
      { num: "09", title: "Record Keeping" },
      { num: "10", title: "Taxation in Business" },
      { num: "11", title: "Licences and Intellectual Property Protection" },
      { num: "12", title: "Evolvement and Venturing" },
      { num: "13", title: "Profit Maximisation in Business" },
      { num: "14", title: "Social Framework in Business Construction" },
    ],
  },
  {
    part: "III",
    title: "Scale & Leadership",
    subtitle: "Lead, protect and dominate your market",
    color: "#8B6535",
    lessons: [
      { num: "15", title: "Business Money Making Machines" },
      { num: "16", title: "Silent Pillars of a Business" },
      { num: "17", title: "The Sitting Boards of a Company" },
      { num: "18", title: "The Enemies of Business Growth" },
      { num: "19", title: "The Coordinated Boss" },
      { num: "20", title: "Visionary Leadership" },
      { num: "21", title: "The Greater Good in Business" },
      { num: "22", title: "Challenges of Running a Business" },
      { num: "23", title: "Understanding Contracts — Part 1" },
      { num: "24", title: "Understanding Contracts — Part 2" },
    ],
  },
];

// ─── Supporting data ─────────────────────────────────────────────────────────
const bonuses = [
  { icon: "01", label: "Business Plan Template", desc: "A structured starting point to clarify your strategy and growth path." },
  { icon: "02", label: "Jewellery Business Checklist", desc: "A practical checklist for the important elements of setting up your business." },
  { icon: "03", label: "Supplier & Shipping Resources", desc: "Supplier and shipping resources included with the programme." },
  { icon: "04", label: "Certificate of Completion", desc: "A certificate of completion for learners who finish the programme." },
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
  { title: "Aspiring Jewellery Entrepreneurs", desc: "You love jewellery and know you've got something special — now it's time to build a real business around it." },
  { title: "Jewellery Designers & Makers", desc: "You have the craft but not the business strategy. This masterclass bridges that gap completely." },
  { title: "Side Hustlers Ready to Go Full-Time", desc: "You're selling occasionally but want systems to turn it into a consistent, full-time income." },
  { title: "Existing Business Owners", desc: "You want to add a jewellery line or take your current shop to the next level." },
];

const faqs = [
  { q: "Do I need prior experience to join?", a: "Absolutely not. This masterclass is designed for complete beginners and experienced jewellery lovers alike. We start from the very foundation and build up systematically." },
  { q: "How long do I have access to the materials?", a: "You receive a full 1-year subscription, giving you 12 months of unlimited access to all 24 video lessons, all bonuses, and any new content added during the year. Revisit any module at your own pace." },
  { q: "Is this only for people in Nigeria?", a: "The programme is designed for jewellery entrepreneurs and makers in Nigeria and elsewhere. Review the curriculum to decide whether its topics fit your market and goals." },
  { q: "What exactly is included in the ₦100,000 subscription?", a: "You get: 24 in-depth video lessons across 3 structured parts, a Business Plan Template, a Jewellery Business Checklist, direct access to vetted suppliers and shipping agents, a Certificate of Completion, and full 1-year access to all course materials and updates." },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`border rounded-2xl overflow-hidden mb-3 transition-colors ${open ? "border-amber-400/40 bg-amber-400/[0.03]" : "border-white/10 bg-white/[0.02]"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <span className="font-medium text-white/90 text-sm md:text-base leading-snug pr-4">{q}</span>
        <ChevronDown className={`w-5 h-5 text-amber-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-6 pb-6 text-white/60 text-sm leading-relaxed border-t border-white/08">
          <div className="pt-4">{a}</div>
        </div>
      )}
    </div>
  );
}

function CurriculumPart({ part }: { part: typeof curriculumParts[0] }) {
  const [open, setOpen] = useState(part.part === "I");
  return (
    <div className={`border rounded-2xl overflow-hidden transition-colors ${open ? "border-amber-400/30" : "border-white/10"}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-5 px-6 py-5 text-left hover:bg-white/[0.03] transition-colors"
      >
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-black text-xs font-black flex-shrink-0"
          style={{ background: part.color }}
        >
          {part.part}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-white text-sm md:text-base">Part {part.part} — {part.title}</div>
          <div className="text-white/45 text-xs mt-0.5">{part.subtitle} · {part.lessons.length} lessons</div>
        </div>
        <ChevronDown className={`w-5 h-5 text-amber-400/70 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="border-t border-white/08 px-6 pb-5 pt-4 bg-white/[0.015]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
            {part.lessons.map((lesson) => (
              <div
                key={lesson.num}
                className={`flex items-start gap-3 py-2 ${lesson.featured ? "sm:col-span-2 bg-amber-400/08 border border-amber-400/20 rounded-xl px-3 mb-1" : ""}`}
              >
                <span
                  className="flex-shrink-0 text-[11px] font-bold tabular-nums mt-0.5"
                  style={{ color: lesson.featured ? part.color : "rgba(255,255,255,0.3)" }}
                >
                  {lesson.num}
                </span>
                <span className={`text-sm leading-snug ${lesson.featured ? "font-semibold" : "text-white/60"}`}
                  style={lesson.featured ? { color: part.color } : {}}>
                  {lesson.title}
                </span>
                {lesson.featured && (
                  <span className="ml-auto flex-shrink-0 text-[9px] bg-amber-400/15 text-amber-400 border border-amber-400/25 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    Flagship
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function JewelleryMasterclass() {
  return (
    <div className="min-h-screen bg-[#070707] text-white masterclass-page" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <Header />

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-28 pb-24 px-4">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(201,161,74,0.07),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-400/[0.04] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-16 items-center relative z-10">
          {/* Left */}
          <div>
            <div className="inline-flex items-center gap-2 bg-amber-400/10 border border-amber-400/25 text-amber-400 text-[11px] font-bold uppercase tracking-[0.15em] px-4 py-2 rounded-full mb-8">
              <Gem className="w-3 h-3" />
              TIM Jewellery Masterclass
            </div>

            <h1
              className="mb-6 leading-[1.05] tracking-tight"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(2.5rem, 5vw, 4.25rem)",
                fontWeight: 700,
                background: "linear-gradient(150deg, #fff 0%, #f0ddb0 50%, #C9A14A 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Build a jewellery business with stronger foundations.
            </h1>

            <p className="text-white/60 text-lg leading-relaxed mb-10 max-w-lg" style={{ fontFamily: "'Inter', sans-serif", fontWeight: 300 }}>
              Explore practical lessons on starting, structuring and growing a jewellery business, from business foundations to operations and leadership.
            </p>

            <div className="flex items-center gap-2 mb-8 text-white/55 text-sm"><Calendar className="w-4 h-4 text-amber-400" /><strong className="text-white">1-year access</strong> to course materials.</div>

            {/* Price card */}
            <div className="inline-flex items-stretch bg-white/[0.04] border border-amber-400/20 rounded-2xl overflow-hidden mb-10">
              <div className="px-6 py-5 border-r border-white/08 text-center">
                <div className="text-[10px] text-white/35 uppercase tracking-[0.12em] mb-1.5 font-medium">Was</div>
                <div className="text-base text-white/25 line-through font-semibold">
                  ₦{ORIGINAL_PRICE_NAIRA.toLocaleString("en-NG")}
                </div>
              </div>
              <div className="px-6 py-5 border-r border-white/08 text-center">
                <div className="text-[10px] text-amber-400 uppercase tracking-[0.12em] font-bold mb-1.5">Subscribe Now</div>
                <div className="text-4xl font-black text-white" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  ₦{PRICE_NAIRA.toLocaleString("en-NG")}
                </div>
              </div>
              <div className="px-5 py-5 flex flex-col items-center justify-center gap-0.5">
                <div className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Save</div>
                <div className="text-sm font-black text-emerald-400">₦{(SAVINGS / 1000).toFixed(0)}k</div>
              </div>
            </div>

            {/* Subscription note */}
            <div className="flex items-center gap-2 mb-8 text-white/50 text-sm">
              <Shield className="w-4 h-4 text-amber-400 flex-shrink-0" />
              One-year subscription · Checkout handled by the payment provider
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <a
                href={CHECKOUT_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-base uppercase tracking-wider px-10 py-5 rounded-full transition-all duration-200 shadow-[0_8px_40px_rgba(201,161,74,0.3)]"
              >
                Register — ₦{PRICE_NAIRA.toLocaleString("en-NG")}
              </a>
            </div>

            {/* Quick-scan inclusions */}
            <div className="grid grid-cols-2 gap-2">
              {["24 video lessons across 3 parts", "Supplier & shipping contacts", "Business plan & checklist", "Certificate of Completion"].map((item) => (
                <div key={item} className="flex items-center gap-2.5 text-sm text-white/70">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Right — hero image */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-[-16px] bg-gradient-to-br from-amber-400/10 to-transparent rounded-3xl blur-2xl" />
            <img
              src="/images/jewellery-community.jpg"
              alt="TIM Jewellery Masterclass"
              className="w-full rounded-3xl shadow-[0_40px_100px_rgba(0,0,0,0.7)] object-cover relative z-10 aspect-[4/5]"
            />
            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-6 bg-[#111] border border-amber-400/30 rounded-2xl px-5 py-4 shadow-xl z-20">
              <div className="text-amber-400 font-black text-2xl" style={{ fontFamily: "'Cormorant Garamond', serif" }}>24</div>
              <div className="text-white/60 text-xs mt-0.5 font-medium">Curriculum lessons</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-y border-white/08 bg-[#0c0c0c] py-12 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { stat: "24", label: "Video Lessons" },
            { stat: "1 Year", label: "Full Access" },
          ].map(({ stat, label }) => (
            <div key={label}>
              <div
                className="text-3xl md:text-4xl font-bold text-amber-400 mb-2"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {stat}
              </div>
              <div className="text-[11px] text-white/40 uppercase tracking-[0.12em] font-medium">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── What's Included ── */}
      <section className="py-24 px-4 bg-[#070707]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 text-amber-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
              <span className="w-10 h-px bg-amber-400/30" />What's Included<span className="w-10 h-px bg-amber-400/30" />
            </div>
            <h2
              className="text-4xl md:text-5xl mb-3"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              Everything You Get in Your Subscription
            </h2>
            <p className="text-white/40 text-sm mt-4">All bonuses unlock the moment you register</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {bonuses.map((b) => (
              <div key={b.label} className="group bg-[#0f0f0f] border border-white/[0.08] hover:border-amber-400/25 rounded-2xl p-6 flex flex-col gap-4 transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-start justify-between">
                <div className="w-11 h-11 bg-amber-400/08 border border-amber-400/15 rounded-xl flex items-center justify-center text-xs font-bold tracking-wider flex-shrink-0">
                    {b.icon}
                  </div>
                  <span className="text-[9px] font-black text-amber-400 bg-amber-400/08 border border-amber-400/15 px-2.5 py-1 rounded-full uppercase tracking-wider">FREE</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-2 leading-snug text-white">{b.label}</h3>
                  <p className="text-white/45 text-xs leading-relaxed">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-base uppercase tracking-wider px-12 py-5 rounded-full transition-all shadow-[0_8px_40px_rgba(201,161,74,0.25)]"
            >
              Claim Your 1-Year Subscription — ₦{PRICE_NAIRA.toLocaleString("en-NG")}
            </a>
          </div>
        </div>
      </section>

      {/* ── Pain Points ── */}
      <section className="py-24 px-4 bg-[#0a0a0a] border-y border-white/05">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 text-amber-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-6">
            <span className="w-10 h-px bg-amber-400/30" />Sound Familiar?<span className="w-10 h-px bg-amber-400/30" />
          </div>
          <h2
            className="text-4xl md:text-5xl mb-12 leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            You Know You Have What It Takes
            <span className="block text-white/30 italic mt-1 text-3xl md:text-4xl" style={{ fontStyle: "italic" }}>
              — But Something Keeps Stopping You
            </span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-left mb-12">
            {painPoints.map((point) => (
              <div key={point} className="flex items-start gap-3 bg-white/[0.02] border border-white/06 rounded-2xl px-5 py-4">
                <span className="w-5 h-5 bg-red-500/12 border border-red-500/20 rounded-full flex items-center justify-center flex-shrink-0 text-red-400 text-[10px] font-black mt-0.5">✕</span>
                <p className="text-white/55 text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-amber-400/08 to-amber-400/03 border border-amber-400/25 rounded-2xl p-8">
            <p className="text-lg text-white/85 leading-relaxed" style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, fontSize: "1.2rem" }}>
              <strong className="text-amber-400">A structured learning resource</strong> for aspiring jewellery entrepreneurs and makers who want to understand the business behind their craft.
            </p>
          </div>
        </div>
      </section>

      {/* ── Video Preview ── */}
      <section className="py-24 px-4 bg-[#070707]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 text-amber-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
            <span className="w-10 h-px bg-amber-400/30" />Watch the Preview<span className="w-10 h-px bg-amber-400/30" />
          </div>
          <h2
            className="text-3xl md:text-4xl mb-10"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            See Inside the Masterclass
          </h2>
          <a
            href="https://youtu.be/qw9t_YRZgX0"
            target="_blank"
            rel="noopener noreferrer"
            className="block relative rounded-3xl overflow-hidden border border-amber-400/15 shadow-[0_0_80px_rgba(201,161,74,0.10)] group"
          >
            <img
              src="/images/jewellery-community.jpg"
              alt="Masterclass Preview"
              className="w-full block"
            />
            <div className="absolute inset-0 bg-black/45 flex items-center justify-center group-hover:bg-black/35 transition-colors">
              <div className="w-20 h-20 bg-amber-400 rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(201,161,74,0.5)] group-hover:scale-110 transition-transform duration-200">
                <PlayCircle className="w-10 h-10 text-black ml-1" />
              </div>
            </div>
          </a>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section className="py-24 px-4 bg-[#0a0a0a] border-y border-white/05">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-3 text-amber-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
              <span className="w-10 h-px bg-amber-400/30" />Full Curriculum<span className="w-10 h-px bg-amber-400/30" />
            </div>
            <h2
              className="text-4xl md:text-5xl mb-4"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              24 Lessons — 3 Structured Parts
            </h2>
            <p className="text-white/40 text-sm">Tap any part to expand the lessons</p>
          </div>

          {/* Overview strip */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            {curriculumParts.map((p) => (
              <div key={p.part} className="text-center border border-white/08 rounded-2xl p-5">
                <div
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif", color: p.color }}
                >
                  Part {p.part}
                </div>
                <div className="text-xs font-semibold text-white mb-0.5">{p.title}</div>
                <div className="text-[11px] text-white/35">{p.lessons.length} lessons</div>
              </div>
            ))}
          </div>

          {/* Expandable parts */}
          <div className="space-y-3">
            {curriculumParts.map((p) => (
              <CurriculumPart key={p.part} part={p} />
            ))}
          </div>

          <div className="mt-10 text-center">
            <div className="inline-flex items-center gap-2 bg-amber-400/08 border border-amber-400/20 rounded-xl px-5 py-3 text-sm font-medium text-amber-400">
              <Zap className="w-4 h-4" />
              All 24 lessons unlock immediately upon registration
            </div>
          </div>
        </div>
      </section>

      {/* ── Who Is This For ── */}
      <section className="py-24 px-4 bg-[#070707]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-3 text-amber-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
            <span className="w-10 h-px bg-amber-400/30" />Made For You<span className="w-10 h-px bg-amber-400/30" />
          </div>
          <h2
            className="text-4xl md:text-5xl mb-12"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
          >
            Who Is This Masterclass For?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left mb-12">
            {forWho.map(({ title, desc }) => (
              <div key={title} className="bg-[#0f0f0f] border border-white/08 hover:border-amber-400/25 rounded-2xl p-6 flex items-start gap-4 transition-all duration-200">
                <div className="w-10 h-10 bg-amber-400/08 border border-amber-400/20 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Gem className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <strong className="text-sm font-semibold block mb-1.5 text-white">{title}</strong>
                  <p className="text-white/50 text-xs leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <a
            href={CHECKOUT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-base uppercase tracking-wider px-12 py-5 rounded-full transition-all shadow-[0_8px_40px_rgba(201,161,74,0.25)]"
          >
            Join the Masterclass
          </a>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-24 px-4 bg-[#070707]">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-3 text-amber-400 text-[11px] font-bold uppercase tracking-[0.15em] mb-5">
              <span className="w-10 h-px bg-amber-400/30" />Questions?<span className="w-10 h-px bg-amber-400/30" />
            </div>
            <h2
              className="text-3xl md:text-4xl"
              style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700 }}
            >
              Frequently Asked Questions
            </h2>
          </div>
          {faqs.map((faq) => (
            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
          ))}
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-28 px-4 bg-gradient-to-b from-[#070707] to-[#0d0800]">
        <div className="max-w-2xl mx-auto text-center">
          <div className="text-xs uppercase tracking-[0.2em] text-amber-400 mb-8">The business behind the craft</div>
          <h2
            className="mb-5 leading-tight"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 4.5vw, 3.5rem)",
              background: "linear-gradient(150deg, #fff 0%, #C9A14A 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Your Jewellery Empire Starts Today
          </h2>
          <p className="text-white/50 text-lg mb-10 leading-relaxed" style={{ fontWeight: 300 }}>
            Explore the course structure and decide whether the programme is the right next step for your jewellery business.
          </p>

          {/* Price display */}
          <div className="inline-flex bg-white/[0.04] border border-amber-400/20 rounded-2xl overflow-hidden mb-8">
            <div className="px-6 py-5 border-r border-white/08 text-center">
              <div className="text-[10px] text-white/30 uppercase tracking-[0.12em] mb-1.5">Was</div>
              <div className="text-base text-white/25 line-through font-semibold">₦{ORIGINAL_PRICE_NAIRA.toLocaleString("en-NG")}</div>
            </div>
            <div className="px-8 py-5 text-center">
              <div className="text-[10px] text-amber-400 uppercase tracking-[0.12em] font-bold mb-1.5">1-Year Subscription</div>
              <div
                className="text-4xl font-bold text-white"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                ₦{PRICE_NAIRA.toLocaleString("en-NG")}
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <a
              href={CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-black font-bold text-lg uppercase tracking-wider px-14 py-6 rounded-full transition-all duration-200 shadow-[0_12px_50px_rgba(201,161,74,0.35)]"
            >
              Join the Masterclass
            </a>
            <p className="text-white/25 text-xs">
              One-year subscription · Checkout handled by the payment provider
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
