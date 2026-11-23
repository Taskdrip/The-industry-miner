import { useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Compass, ExternalLink,
  LayoutTemplate, LoaderCircle, Plus, Search, Sparkles, X
} from "lucide-react";
import {
  getGetMyWebsiteQueryKey, getListMyWebsitesQueryKey, getListSiteTemplatesQueryKey, useInstallWebsiteTemplate,
  useListMyWebsites, useListSiteTemplates
} from "@workspace/api-client-react";
import type { SiteTemplate, Website } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import WebsiteRenderer from "@/components/studio/WebsiteRenderer";

export default function WebsiteStudio() {
  const queryClient = useQueryClient();
  const { user, isLoading: authLoading, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState("All niches");
  const [selected, setSelected] = useState<SiteTemplate | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<SiteTemplate | null>(null);
  const templatesQuery = useListSiteTemplates({ query: { queryKey: getListSiteTemplatesQueryKey(), retry: 1 } });
  const websitesQuery = useListMyWebsites({
    query: { queryKey: getListMyWebsitesQueryKey(), enabled: isAuthenticated, retry: false }
  });
  const install = useInstallWebsiteTemplate();
  const templates = templatesQuery.data ?? [];
  const websites = websitesQuery.data ?? [];
  const niches = useMemo(() => ["All niches", ...Array.from(new Set(templates.map((template) => template.niche))).sort()], [templates]);
  const filtered = useMemo(() => templates.filter((template) => {
    const matchNiche = niche === "All niches" || template.niche === niche;
    const query = search.trim().toLowerCase();
    return matchNiche && (!query || `${template.name} ${template.niche} ${template.description}`.toLowerCase().includes(query));
  }), [templates, niche, search]);

  function installTemplate(template: SiteTemplate) {
    if (!isAuthenticated) {
      setPendingTemplate(template);
      setAuthOpen(true);
      return;
    }
    install.mutate({ data: { templateSlug: template.slug } }, {
      onSuccess: async (website: Website) => {
        setPendingTemplate(null);
        await queryClient.invalidateQueries({ queryKey: getListMyWebsitesQueryKey() });
        await queryClient.invalidateQueries({ queryKey: getGetMyWebsiteQueryKey(website.slug) });
        setLocation(`/studio/sites/${website.slug}`);
      },
    });
  }
  useEffect(() => {
    if (isAuthenticated && pendingTemplate && !install.isPending) {
      const selectedTemplate = pendingTemplate;
      setPendingTemplate(null);
      installTemplate(selectedTemplate);
    }
  }, [isAuthenticated, pendingTemplate]);

  const errorMessage = (error: unknown) => error instanceof Error ? error.message : "We couldn't load this right now.";

  return (
    <main className="studio-shell min-h-[100dvh]">
      <header className="studio-topbar">
        <Link href="/studio" className="studio-wordmark" data-testid="link-studio-home"><span className="studio-mark">IM</span><span>The Industry Miner<small>WEBSITE STUDIO</small></span></Link>
        <div className="studio-topbar-right">
          <span className="studio-trust"><span className="status-dot" />Your next business, online</span>
          {isAuthenticated ? <span className="studio-user" data-testid="text-studio-user">{user?.firstName || user?.email || "Account"}</span> : <button className="quiet-button" onClick={() => setAuthOpen(true)} data-testid="button-studio-signin">Sign in</button>}
        </div>
      </header>

      <section className="studio-intro studio-grid">
        <div className="studio-intro-copy studio-enter">
          <p className="studio-kicker"><Compass size={14} /> THE BUILDING ROOM</p>
          <h1>Start with a site.<br /><em>Build something real.</em></h1>
          <p className="studio-lede">Choose a proven starting point for your niche. Make it yours in the visual editor, then publish a fast, installable website for your customers.</p>
          <a href="#templates" className="intro-link" data-testid="link-browse-templates">Explore the templates <ArrowRight size={16} /></a>
        </div>
        <div className="intro-art" aria-hidden="true">
          <div className="art-note note-one"><span>01 / PICK</span><b>Find your corner</b><small>A practical niche, a clear offer.</small></div>
          <div className="art-note note-two"><span>02 / SHAPE</span><b>Make it yours</b><small>Pages, colors, words, all editable.</small></div>
          <div className="art-arc"><span>IM</span></div>
          <div className="art-caption">BUILT FOR THE<br />INDEPENDENT.</div>
        </div>
        <div className="studio-proof"><span>01</span> Start from a complete, editable site <i /> <span>02</span> Publish when it feels right <i /> <span>03</span> Install it on any phone</div>
      </section>

      <section className="studio-workspace">
        <div className="workspace-head">
          <div><p className="studio-kicker">YOUR WORKSPACE</p><h2>Websites in progress</h2><p className="section-sub">Every business starts somewhere. Pick up where you left off.</p></div>
          {isAuthenticated && <a href="#templates" className="outline-button" data-testid="button-new-website"><Plus size={16} /> New website</a>}
        </div>
        {authLoading ? <div className="workspace-skeleton" aria-label="Checking your account"><div /><div /><div /></div>
          : !isAuthenticated ? <div className="signin-panel" data-testid="state-sites-unauthenticated">
              <div className="signin-stamp"><LayoutTemplate size={24} /></div><div><h3>Your sites live here.</h3><p>Sign in to see your workspace, or browse the template library below.</p></div><button onClick={() => setAuthOpen(true)} className="solid-button" data-testid="button-signin-workspace">Sign in to continue <ArrowRight size={16} /></button>
            </div>
          : websitesQuery.isLoading ? <div className="workspace-skeleton" aria-label="Loading your websites"><div /><div /><div /></div>
          : websitesQuery.isError ? <div className="state-message error-state" role="alert"><strong>Your workspace didn't load.</strong><span>{errorMessage(websitesQuery.error)}</span><button onClick={() => websitesQuery.refetch()} data-testid="button-retry-websites">Try again</button></div>
          : websites.length === 0 ? <div className="workspace-empty" data-testid="state-sites-empty">
              <span className="empty-index">YOUR FIRST BUILD</span><h3>A blank canvas is not the only way.</h3><p>Start with a niche template that already knows what your customers need to see.</p><a href="#templates" className="solid-button" data-testid="link-empty-browse">Find your starting point <ArrowRight size={16} /></a>
            </div>
          : <div className="website-list">{websites.map((website, index) => <article key={website.id} className="website-row" data-testid={`website-row-${website.slug}`}>
              <div className="website-tile" style={{ background: website.draft.backgroundColor }}><span style={{ color: website.draft.primaryColor }}>{website.draft.appName.slice(0, 1)}</span><small>{website.draft.pages.length} PAGES</small></div>
              <div className="website-row-info"><p className="studio-kicker">/{website.slug}</p><h3>{website.name}</h3><span>{website.draft.tagline}</span></div>
              <div className={`publish-pill ${website.publishedAt ? "published" : "draft"}`} data-testid={`status-website-${website.slug}`}><span />{website.publishedAt ? "Published" : "Draft"}</div>
              {website.publishedAt && <Link href={`/sites/${website.slug}/${website.published?.pages[0]?.slug ?? "home"}`} className="row-public-link" data-testid={`link-public-${website.slug}`}><ExternalLink size={14} /> Visit site</Link>}
              <Link href={`/studio/sites/${website.slug}`} className="row-edit-link" data-testid={`link-edit-${website.slug}`}>Open editor <ArrowUpRight size={15} /></Link>
              <span className="row-number">0{index + 1}</span>
            </article>)}</div>}
      </section>

      <section className="template-library" id="templates">
        <div className="template-heading">
          <div><p className="studio-kicker"><Sparkles size={14} /> THE STARTER LIBRARY</p><h2>Good ideas, <em>ready to move.</em></h2><p className="section-sub">Niche-specific foundations, built to be edited—not admired from a distance.</p></div>
          <div className="template-count"><strong>{templates.length.toString().padStart(2, "0")}</strong><span>STARTING POINTS</span></div>
        </div>
        <div className="template-controls">
          <label className="search-control"><Search size={17} /><input aria-label="Search templates" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by business or niche" data-testid="input-template-search" />{search && <button onClick={() => setSearch("")} aria-label="Clear search" data-testid="button-clear-search"><X size={15} /></button>}</label>
          <label className="filter-control"><span className="sr-only">Filter by niche</span><select value={niche} onChange={(event) => setNiche(event.target.value)} data-testid="select-template-niche">{niches.map((item) => <option key={item}>{item}</option>)}</select><ChevronDown size={15} /></label>
        </div>
        {templatesQuery.isLoading ? <div className="template-skeletons" aria-label="Loading templates">{[0, 1, 2].map((item) => <div key={item} className="template-skeleton" />)}</div>
          : templatesQuery.isError ? <div className="state-message error-state" role="alert"><strong>The template library is taking a moment.</strong><span>{errorMessage(templatesQuery.error)}</span><button onClick={() => templatesQuery.refetch()} data-testid="button-retry-templates">Reload templates</button></div>
          : filtered.length === 0 ? <div className="template-empty" data-testid="state-template-empty"><Search size={23} /><h3>No matches yet</h3><p>Try another phrase or choose a wider niche.</p><button onClick={() => { setSearch(""); setNiche("All niches"); }} data-testid="button-reset-filters">Reset filters</button></div>
          : <div className="template-grid">{filtered.map((template, index) => {
              const imageUrl = (() => { try { const url = new URL(template.previewImage); return ["http:", "https:"].includes(url.protocol) ? url.href : ""; } catch { return ""; } })();
              return <article className="template-card" key={template.slug} data-testid={`template-card-${template.slug}`} style={{ animationDelay: `${index * 50}ms` }}>
                <button className="template-visual" onClick={() => setSelected(template)} data-testid={`button-preview-${template.slug}`} aria-label={`Preview ${template.name}`}>
                  {imageUrl ? <img src={imageUrl} alt="" loading="lazy" /> : <div className="template-fallback" style={{ background: template.document.backgroundColor }}><span style={{ color: template.document.primaryColor }}>{template.name.slice(0, 1)}</span><small>{template.niche}</small></div>}
                  <span className="visual-open">Quick preview <ArrowUpRight size={15} /></span>
                  <span className="visual-count">{template.document.pages.length} PAGES</span>
                </button>
                <div className="template-info"><div className="template-meta"><span>{template.niche}</span><span>STARTER SITE</span></div><h3>{template.name}</h3><p>{template.description}</p>
                  <div className="feature-chips">{template.features.slice(0, 3).map((feature) => <span key={feature}>{feature}</span>)}</div>
                  <button className="template-install" onClick={() => installTemplate(template)} disabled={install.isPending} data-testid={`button-install-${template.slug}`}>{install.isPending && pendingTemplate?.slug === template.slug ? <LoaderCircle className="spin" size={16} /> : <Plus size={16} />} Use this template <ArrowRight size={15} /></button>
                </div>
              </article>;
            })}</div>}
      </section>
      <footer className="studio-footer"><Link href="/" data-testid="link-back-home">The Industry Miner</Link><span>Tools for the work you want to do.</span><span className="studio-mono">STUDIO / 01</span></footer>

      {selected && <div className="preview-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setSelected(null)}>
        <section className="preview-dialog" role="dialog" aria-modal="true" aria-labelledby="template-preview-title" data-testid="dialog-template-preview">
          <div className="preview-dialog-head"><div><p className="studio-kicker">{selected.niche} / STARTER SITE</p><h2 id="template-preview-title">{selected.name}</h2></div><button onClick={() => setSelected(null)} className="icon-button" aria-label="Close preview" data-testid="button-close-preview"><X /></button></div>
          <p className="preview-description">{selected.description}</p>
          <div className="template-preview-frame"><WebsiteRenderer document={selected.document} slug={selected.slug} preview /></div>
          <div className="preview-dialog-foot"><span><Check size={15} /> {selected.document.pages.length} editable pages · {selected.features.length} included features</span><button className="solid-button" onClick={() => { setSelected(null); installTemplate(selected); }} data-testid={`button-install-preview-${selected.slug}`}>Start with this site <ArrowRight size={16} /></button></div>
        </section>
      </div>}
      <AuthModal open={authOpen} defaultTab="login" onClose={() => setAuthOpen(false)} />
    </main>
  );
}
