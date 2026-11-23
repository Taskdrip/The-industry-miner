import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation, useParams } from "wouter";
import {
  ArrowDown, ArrowLeft, ArrowUp, Check, ChevronDown, ExternalLink,
  Eye, EyeOff, Globe2, LoaderCircle, Plus, Save, Smartphone, Trash2
} from "lucide-react";
import {
  getGetMyWebsiteQueryKey, getGetPublishedWebsiteQueryKey, getListMyWebsitesQueryKey,
  useGetMyWebsite, usePublishWebsite, useSaveWebsiteDraft
} from "@workspace/api-client-react";
import type { Website, WebsiteDocument, WebsitePage, WebsiteSection, WebsiteSectionType } from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import AuthModal from "@/components/auth/AuthModal";
import WebsiteRenderer from "@/components/studio/WebsiteRenderer";

const sectionTypes: WebsiteSectionType[] = ["hero", "features", "about", "services", "gallery", "testimonials", "contact"];
const defaultSection = (type: WebsiteSectionType, number: number): WebsiteSection => ({
  id: `${type}-${Date.now()}-${number}`, type, enabled: true, heading: `A little about ${type}`,
  body: "Add a few thoughtful words here. Tell visitors what makes this business worth choosing.",
  imageUrl: null, buttonLabel: null, buttonHref: null, items: [],
});
const cleanColor = (value: string, fallback: string) => /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
const toSlug = (value: string) => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function WebsiteEditor() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [authOpen, setAuthOpen] = useState(false);
  const [document, setDocument] = useState<WebsiteDocument | null>(null);
  const [siteName, setSiteName] = useState("");
  const [activePage, setActivePage] = useState("");
  const [panel, setPanel] = useState<"content" | "design" | "pages">("content");
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [notice, setNotice] = useState("");
  const initialized = useRef("");
  const savedSnapshot = useRef("");
  const websiteQuery = useGetMyWebsite(slug, { query: { queryKey: getGetMyWebsiteQueryKey(slug), enabled: isAuthenticated && !!slug, retry: false } });
  const saveDraft = useSaveWebsiteDraft();
  const publish = usePublishWebsite();
  const website = websiteQuery.data;

  useEffect(() => {
    if (website && initialized.current !== slug) {
      initialized.current = slug;
      setDocument(website.draft);
      setSiteName(website.name);
      setActivePage(website.draft.pages[0]?.slug ?? "");
      savedSnapshot.current = JSON.stringify({ name: website.name, document: website.draft });
    }
  }, [website, slug]);

  const dirty = useMemo(() => document ? savedSnapshot.current !== JSON.stringify({ name: siteName, document }) : false, [document, siteName]);
  const page = document?.pages.find((item) => item.slug === activePage) ?? document?.pages[0];
  const saving = saveDraft.isPending;
  const published = Boolean(website?.publishedAt);
  const status = saveDraft.isError ? "Save failed — retry when you're ready." : saving ? "Saving changes…" : dirty ? "Unsaved changes" : website?.updatedAt ? "All changes saved" : "Ready to edit";

  function patchDocument(patch: Partial<WebsiteDocument>) {
    setDocument((current) => current ? { ...current, ...patch } : current);
  }
  function patchPage(pageSlug: string, patch: Partial<WebsitePage>) {
    if (!document) return;
    patchDocument({ pages: document.pages.map((item) => item.slug === pageSlug ? { ...item, ...patch } : item) });
  }
  function patchSection(pageSlug: string, sectionId: string, patch: Partial<WebsiteSection>) {
    if (!document) return;
    const target = document.pages.find((item) => item.slug === pageSlug);
    if (!target) return;
    patchPage(pageSlug, { sections: target.sections.map((section) => section.id === sectionId ? { ...section, ...patch } : section) });
  }
  function save(nextAction?: "publish") {
    if (!document || !website) return;
    const data = { name: siteName.trim() || document.appName, document };
    saveDraft.mutate({ slug, data }, {
      onSuccess: async (updated: Website) => {
        setNotice(nextAction ? "Draft saved. Publishing your latest version…" : "Your draft is saved.");
        savedSnapshot.current = JSON.stringify({ name: updated.name, document: updated.draft });
        await queryClient.invalidateQueries({ queryKey: getGetMyWebsiteQueryKey(slug) });
        await queryClient.invalidateQueries({ queryKey: getListMyWebsitesQueryKey() });
        if (nextAction === "publish") {
          publish.mutate({ slug }, {
            onSuccess: async () => {
              await queryClient.invalidateQueries({ queryKey: getGetMyWebsiteQueryKey(slug) });
              await queryClient.invalidateQueries({ queryKey: getListMyWebsitesQueryKey() });
              await queryClient.invalidateQueries({ queryKey: getGetPublishedWebsiteQueryKey(slug) });
              setNotice("Your site is live. The published version is ready to visit.");
            },
            onError: () => setNotice("Your draft is saved, but publishing did not complete. You can retry."),
          });
        }
      },
      onError: () => setNotice("We couldn't save this draft. Your edits are still here; please retry."),
    });
  }
  function addPage() {
    if (!document || document.pages.length >= 12) return;
    let base = "new-page";
    let nextSlug = base;
    let i = 2;
    while (document.pages.some((item) => item.slug === nextSlug)) nextSlug = `${base}-${i++}`;
    const newPage: WebsitePage = { slug: nextSlug, title: "New page", sections: [defaultSection("hero", document.pages.length)] };
    patchDocument({ pages: [...document.pages, newPage] });
    setActivePage(nextSlug);
  }
  function moveSection(sectionIndex: number, direction: -1 | 1) {
    if (!page) return;
    const target = sectionIndex + direction;
    if (target < 0 || target >= page.sections.length) return;
    const sections = [...page.sections];
    [sections[sectionIndex], sections[target]] = [sections[target], sections[sectionIndex]];
    patchPage(page.slug, { sections });
  }
  function reorderPage(index: number, direction: -1 | 1) {
    if (!document) return;
    const target = index + direction;
    if (target < 0 || target >= document.pages.length) return;
    const pages = [...document.pages];
    [pages[index], pages[target]] = [pages[target], pages[index]];
    patchDocument({ pages });
  }
  if (authLoading) return <main className="studio-shell editor-gate"><div className="editor-gate-card"><div className="skeleton-line" /><div className="skeleton-block" /></div></main>;
  if (!isAuthenticated) return <main className="studio-shell editor-gate"><div className="editor-gate-card"><span className="studio-kicker">PRIVATE WORKSPACE</span><h1>Sign in to open your builder.</h1><p>Your draft and publishing controls are available only to the account that owns this site.</p><button className="solid-button" onClick={() => setAuthOpen(true)} data-testid="button-editor-signin">Sign in to continue</button><Link href="/studio" className="back-to-library" data-testid="link-back-studio"><ArrowLeft size={15} /> Back to your studio</Link></div><AuthModal open={authOpen} onClose={() => setAuthOpen(false)} /></main>;
  if (websiteQuery.isLoading) return <main className="studio-shell editor-gate"><div className="editor-loading"><span className="studio-kicker">OPENING YOUR BUILDER</span><div className="skeleton-line" /><div className="skeleton-block" /></div></main>;
  if (websiteQuery.isError || !website || !document) return <main className="studio-shell editor-gate"><div className="editor-gate-card" role="alert"><span className="studio-kicker">SITE NOT AVAILABLE</span><h1>We couldn't open this website.</h1><p>This site may not belong to your account, or it may have been removed.</p><div className="gate-actions"><button className="outline-button" onClick={() => websiteQuery.refetch()} data-testid="button-retry-editor">Try again</button><Link href="/studio" className="solid-button" data-testid="link-editor-library">Return to studio <ArrowRightIcon /></Link></div></div></main>;

  return (
    <main className="studio-shell editor-shell">
      <header className="editor-topbar">
        <Link href="/studio" className="editor-back" data-testid="link-editor-back"><ArrowLeft size={16} /><span>Studio</span></Link>
        <span className="editor-divider" />
        <div className="editor-site-name"><strong>{siteName}</strong><span>/{website.slug}</span></div>
        <div className="editor-save-state" data-testid="status-save"><span className={`save-state-dot ${dirty || saving ? "needs-save" : "is-saved"}`} />{status}</div>
        <div className="editor-top-actions">
          {published && <Link href={`/sites/${slug}/${website.published?.pages[0]?.slug ?? "home"}`} className="editor-preview-link" data-testid="link-visit-published"><ExternalLink size={14} /> Visit live site</Link>}
          <button className="editor-save-button" onClick={() => save()} disabled={!dirty || saving || publish.isPending} data-testid="button-save-draft">{saving ? <LoaderCircle className="spin" size={15} /> : <Save size={15} />} Save draft</button>
          <button className="editor-publish-button" onClick={() => save("publish")} disabled={saving || publish.isPending} data-testid="button-publish">{publish.isPending ? <LoaderCircle className="spin" size={15} /> : <Globe2 size={15} />}{published ? "Publish updates" : "Publish site"}</button>
        </div>
      </header>
      <div className="editor-workarea">
        <aside className="editor-sidebar">
          <div className="editor-sidebar-brand"><span className="studio-mark">IM</span><div><strong>Site editor</strong><small>VISUAL BUILDER</small></div></div>
          <div className="editor-tabs" role="tablist" aria-label="Editor panels">
            {(["content", "pages", "design"] as const).map((tab) => <button key={tab} role="tab" aria-selected={panel === tab} onClick={() => setPanel(tab)} data-testid={`tab-editor-${tab}`}>{tab === "content" ? "Content" : tab === "pages" ? "Pages" : "Design"}</button>)}
          </div>
          <div className="editor-panel-scroll">
            {panel === "content" && <div className="panel-section">
              <div className="panel-title"><div><span className="studio-kicker">PAGE CONTENT</span><h2>{page?.title ?? "Page"}</h2></div><span className="page-counter">{document.pages.indexOf(page!) + 1}/{document.pages.length}</span></div>
              {page?.sections.map((section, index) => <section className={`section-editor ${section.enabled ? "" : "section-disabled"}`} key={section.id} data-testid={`editor-section-${section.id}`}>
                <header className="section-editor-head"><div><span className="section-type-mark">{section.type.slice(0, 1)}</span><strong>{section.type}</strong><span className="section-heading-inline">{section.heading || "Untitled section"}</span></div><div className="section-actions">
                  <button aria-label={`Move ${section.type} up`} onClick={() => moveSection(index, -1)} disabled={index === 0} data-testid={`button-section-up-${section.id}`}><ArrowUp size={14} /></button>
                  <button aria-label={`Move ${section.type} down`} onClick={() => moveSection(index, 1)} disabled={index === page.sections.length - 1} data-testid={`button-section-down-${section.id}`}><ArrowDown size={14} /></button>
                  <button aria-label={section.enabled ? "Hide section" : "Show section"} onClick={() => patchSection(page.slug, section.id, { enabled: !section.enabled })} data-testid={`button-section-toggle-${section.id}`}>{section.enabled ? <Eye size={14} /> : <EyeOff size={14} />}</button>
                  <button aria-label="Remove section" onClick={() => patchPage(page.slug, { sections: page.sections.filter((item) => item.id !== section.id) })} data-testid={`button-section-delete-${section.id}`}><Trash2 size={14} /></button>
                </div></header>
                <div className="section-fields">
                  <Field label="Heading" value={section.heading} onChange={(value) => patchSection(page.slug, section.id, { heading: value })} testId={`input-heading-${section.id}`} />
                  <Field label="Body copy" value={section.body} multiline onChange={(value) => patchSection(page.slug, section.id, { body: value })} testId={`input-body-${section.id}`} />
                  <Field label="Image URL" value={section.imageUrl ?? ""} onChange={(value) => patchSection(page.slug, section.id, { imageUrl: value || null })} placeholder="https://…" testId={`input-image-${section.id}`} />
                  <div className="two-fields"><Field label="Button label" value={section.buttonLabel ?? ""} onChange={(value) => patchSection(page.slug, section.id, { buttonLabel: value || null })} testId={`input-button-label-${section.id}`} /><Field label="Button destination" value={section.buttonHref ?? ""} onChange={(value) => patchSection(page.slug, section.id, { buttonHref: value || null })} placeholder="/about" testId={`input-button-href-${section.id}`} /></div>
                  <ItemsEditor section={section} onChange={(items) => patchSection(page.slug, section.id, { items })} />
                </div>
              </section>)}
              <AddSection onAdd={(type) => patchPage(page!.slug, { sections: [...page!.sections, defaultSection(type, page!.sections.length)] })} />
            </div>}
            {panel === "pages" && <div className="panel-section">
              <div className="panel-title"><div><span className="studio-kicker">SITE MAP</span><h2>Pages & navigation</h2></div></div>
              <p className="panel-description">Navigation follows this page order. Choose a page to edit its title and sections.</p>
              <div className="page-list">{document.pages.map((item, index) => <div className={`page-list-item ${item.slug === page?.slug ? "active" : ""}`} key={item.slug} data-testid={`editor-page-${item.slug}`}>
                <button className="page-select" onClick={() => { setActivePage(item.slug); setPanel("content"); }} data-testid={`button-select-page-${item.slug}`}><span className="page-grip">{String(index + 1).padStart(2, "0")}</span><span><strong>{item.title}</strong><small>/{item.slug}</small></span></button>
                <div className="page-tools"><button aria-label="Move page earlier" onClick={() => reorderPage(index, -1)} disabled={!index} data-testid={`button-page-up-${item.slug}`}><ArrowUp size={14} /></button><button aria-label="Move page later" onClick={() => reorderPage(index, 1)} disabled={index === document.pages.length - 1} data-testid={`button-page-down-${item.slug}`}><ArrowDown size={14} /></button><button aria-label="Delete page" onClick={() => { if (document.pages.length <= 1) return; const next = document.pages.filter((p) => p.slug !== item.slug); patchDocument({ pages: next }); if (activePage === item.slug) setActivePage(next[0].slug); }} disabled={document.pages.length <= 1} data-testid={`button-page-delete-${item.slug}`}><Trash2 size={14} /></button></div>
                <div className="page-edit-fields"><Field label="Navigation label" value={item.title} onChange={(value) => patchPage(item.slug, { title: value })} testId={`input-page-title-${item.slug}`} /><Field label="Page address" value={item.slug} onChange={(value) => { const nextSlug = toSlug(value); patchDocument({ pages: document.pages.map((p) => p.slug === item.slug ? { ...p, slug: nextSlug || item.slug } : p) }); if (activePage === item.slug && nextSlug) setActivePage(nextSlug); }} testId={`input-page-slug-${item.slug}`} /></div>
              </div>)}</div>
              <button className="add-page-button" onClick={addPage} disabled={document.pages.length >= 12} data-testid="button-add-page"><Plus size={16} /> Add page</button>
              <div className="navigation-note"><Smartphone size={16} /><p>Page names appear in the site's navigation and footer. Reorder them to set the reading path.</p></div>
            </div>}
            {panel === "design" && <div className="panel-section">
              <div className="panel-title"><div><span className="studio-kicker">SITE IDENTITY</span><h2>Make it yours.</h2></div></div>
              <Field label="Website name" value={siteName} onChange={(value) => { setSiteName(value); patchDocument({ appName: value }); }} testId="input-site-name" />
              <Field label="Short description" value={document.tagline} onChange={(value) => patchDocument({ tagline: value })} testId="input-tagline" />
              <Field label="Logo image URL" value={document.logoUrl ?? ""} onChange={(value) => patchDocument({ logoUrl: value || null })} placeholder="https://…" testId="input-logo-url" />
              <div className="color-editor"><div className="color-head"><span className="studio-kicker">PALETTE</span><span>Safe, solid colors</span></div>{([
                ["Primary", "primaryColor", "#275d4e"], ["Accent", "accentColor", "#d5885b"], ["Background", "backgroundColor", "#f5f2e9"], ["Text", "textColor", "#203b34"]
              ] as const).map(([label, key, fallback]) => <label className="color-row" key={key}><span>{label}</span><div><input type="color" value={cleanColor(document[key], fallback)} onChange={(event) => patchDocument({ [key]: event.target.value })} data-testid={`input-color-${key}`} /><input className="color-hex" value={document[key]} onChange={(event) => patchDocument({ [key]: event.target.value })} aria-label={`${label} hex color`} data-testid={`input-hex-${key}`} /></div></label>)}</div>
              <label className="field-label editor-field">Typeface<select value={document.font} onChange={(event) => patchDocument({ font: event.target.value as WebsiteDocument["font"] })} data-testid="select-site-font"><option value="modern">Modern — clean and direct</option><option value="editorial">Editorial — considered and classic</option><option value="friendly">Friendly — open and familiar</option></select><ChevronDown size={14} /></label>
              <Field label="Footer note" value={document.footerText} multiline onChange={(value) => patchDocument({ footerText: value })} testId="input-footer-text" />
              <div className="pwa-callout"><Smartphone size={18} /><div><strong>Ready for a home screen</strong><p>Your app name and theme color travel with your installable PWA.</p></div></div>
            </div>}
          </div>
          {notice && <div className={`editor-notice ${notice.includes("couldn't") || notice.includes("did not") ? "notice-error" : ""}`} role="status" data-testid="status-editor-notice"><Check size={15} />{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message" data-testid="button-dismiss-notice">×</button></div>}
          <div className="sidebar-bottom"><span className="studio-mono">DRAFT / {dirty ? "CHANGES PENDING" : "IN SYNC"}</span><button onClick={() => { setLocation(`/sites/${slug}/${page?.slug ?? "home"}`); }} disabled={!published} title={published ? "Open public site" : "Publish this website to preview it publicly"} data-testid="button-open-public"><ExternalLink size={14} /> Public site</button></div>
        </aside>
        <section className="preview-stage" aria-label="Live website preview">
          <div className="preview-stage-head"><div><span className="studio-kicker">LIVE PREVIEW</span><strong>{page?.title ?? document.appName}</strong></div><div className="device-switch" role="group" aria-label="Preview size"><button type="button" className={previewDevice === "desktop" ? "device-active" : ""} onClick={() => setPreviewDevice("desktop")} aria-pressed={previewDevice === "desktop"} data-testid="button-preview-desktop"><Eye size={15} /> Desktop</button><button type="button" className={previewDevice === "mobile" ? "device-active" : ""} onClick={() => setPreviewDevice("mobile")} aria-pressed={previewDevice === "mobile"} data-testid="button-preview-mobile"><Smartphone size={14} /> Mobile</button></div><span className="preview-draft-tag"><span /> DRAFT</span></div>
          <div className={`preview-canvas ${previewDevice === "mobile" ? "preview-mobile" : ""}`}><div className={`site-frame ${previewDevice === "mobile" ? "site-frame-mobile" : ""}`}><WebsiteRenderer document={document} slug={slug} page={page} preview /></div></div>
          <div className="preview-stage-footer"><span><Eye size={14} /> Preview only — this draft is private until published.</span><span>last saved {website.updatedAt ? new Date(website.updatedAt).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" }) : "not yet"}</span></div>
        </section>
      </div>
    </main>
  );
}

function ArrowRightIcon() { return <span aria-hidden="true">→</span>; }
function Field({ label, value, onChange, multiline = false, placeholder, testId }: { label: string; value: string; onChange: (value: string) => void; multiline?: boolean; placeholder?: string; testId: string }) {
  return <label className="field-label editor-field">{label}{multiline ? <textarea value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} data-testid={testId} /> : <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} data-testid={testId} />}</label>;
}
function ItemsEditor({ section, onChange }: { section: WebsiteSection; onChange: (items: WebsiteSection["items"]) => void }) {
  function patch(index: number, field: "heading" | "body" | "imageUrl", value: string) {
    onChange(section.items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: field === "imageUrl" ? value || null : value } : item));
  }
  return <div className="items-editor">
    <div className="items-heading"><span>Content cards <small>{section.items.length}/12</small></span><button onClick={() => onChange([...section.items, { heading: "New detail", body: "A useful detail for your visitors.", imageUrl: null }])} disabled={section.items.length >= 12} data-testid={`button-add-item-${section.id}`}><Plus size={13} /> Add card</button></div>
    {section.items.map((item, index) => <div className="item-edit" key={`${section.id}-item-${index}`}><div className="item-edit-head"><span>ITEM 0{index + 1}</span><button onClick={() => onChange(section.items.filter((_, i) => i !== index))} aria-label="Remove card" data-testid={`button-remove-item-${section.id}-${index}`}><Trash2 size={13} /></button></div><Field label="Card heading" value={item.heading} onChange={(value) => patch(index, "heading", value)} testId={`input-item-heading-${section.id}-${index}`} /><Field label="Card text" value={item.body} multiline onChange={(value) => patch(index, "body", value)} testId={`input-item-body-${section.id}-${index}`} /><Field label="Card image URL" value={item.imageUrl ?? ""} onChange={(value) => patch(index, "imageUrl", value)} testId={`input-item-image-${section.id}-${index}`} /></div>)}
  </div>;
}
function AddSection({ onAdd }: { onAdd: (type: WebsiteSectionType) => void }) {
  const [open, setOpen] = useState(false);
  return <div className="add-section-wrap">{open && <div className="section-type-menu" data-testid="menu-add-section">{sectionTypes.map((type) => <button key={type} onClick={() => { onAdd(type); setOpen(false); }} data-testid={`button-add-section-${type}`}><span>{type.slice(0, 1).toUpperCase()}</span>{type}<Plus size={13} /></button>)}</div>}<button className="add-section-button" onClick={() => setOpen((value) => !value)} data-testid="button-add-section"><Plus size={15} /> Add a section <ChevronDown size={14} /></button></div>;
}
