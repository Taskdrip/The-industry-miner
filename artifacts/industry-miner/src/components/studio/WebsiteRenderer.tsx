import { Link } from "wouter";
import type { CSSProperties } from "react";
import type { WebsiteDocument, WebsitePage, WebsiteSection } from "@workspace/api-client-react";
import { ArrowUpRight } from "lucide-react";

const safeHex = (value: string, fallback: string) => /^#[0-9a-f]{6}$/i.test(value) ? value : fallback;
const safeImage = (value?: string | null) => {
  if (!value) return "";
  if (value.startsWith("/") && !value.startsWith("//")) return value;
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? url.toString() : "";
  } catch {
    return "";
  }
};
const safeLink = (value?: string | null) => {
  if (!value) return null;
  if (value.startsWith("/") && !value.startsWith("//")) return { href: value, external: false };
  if (/^#[a-z0-9_-]+$/i.test(value)) return { href: value, external: false };
  try {
    const url = new URL(value);
    return ["https:", "http:"].includes(url.protocol) ? { href: url.href, external: true } : null;
  } catch {
    return null;
  }
};
const fontMap = {
  modern: "DM Sans, ui-sans-serif, sans-serif",
  editorial: "Georgia, 'Times New Roman', serif",
  friendly: "Trebuchet MS, ui-sans-serif, sans-serif",
};
type Props = { document: WebsiteDocument; slug: string; page?: WebsitePage; preview?: boolean };

function Section({ section, preview }: { section: WebsiteSection; preview?: boolean }) {
  if (!section.enabled) return null;
  const image = safeImage(section.imageUrl);
  const link = safeLink(section.buttonHref);
  const cards = section.items ?? [];
  return (
    <section id={section.id} className={`site-section site-${section.type}`} data-testid={`site-section-${section.id}`}>
      <div className="site-section-copy">
        <p className="site-eyebrow">{section.type}</p>
        <h2>{section.heading}</h2>
        <p className="site-body">{section.body}</p>
        {section.buttonLabel && (
          link && !preview
            ? link.external
              ? <a href={link.href} target="_blank" rel="noopener noreferrer" className="site-action" data-testid={`site-action-${section.id}`}>{section.buttonLabel}<ArrowUpRight size={15} /></a>
              : link.href.startsWith("#")
                ? <a href={link.href} className="site-action" data-testid={`site-action-${section.id}`}>{section.buttonLabel}<ArrowUpRight size={15} /></a>
                : <Link href={link.href} className="site-action" data-testid={`site-action-${section.id}`}>{section.buttonLabel}<ArrowUpRight size={15} /></Link>
            : <span className="site-action">{section.buttonLabel}<ArrowUpRight size={15} /></span>
        )}
      </div>
      {image && <div className="site-image-wrap"><img src={image} alt="" className="site-image" loading={preview ? "eager" : "lazy"} decoding="async" /></div>}
      {cards.length > 0 && <div className="site-item-grid">{cards.map((item, index) => {
        const itemImage = safeImage(item.imageUrl);
        return <article className="site-item" key={`${section.id}-${index}`} data-testid={`site-item-${section.id}-${index}`}>
          {itemImage && <img src={itemImage} alt="" />}
          <span className="site-item-number">0{index + 1}</span>
          <h3>{item.heading}</h3><p>{item.body}</p>
        </article>;
      })}</div>}
    </section>
  );
}

export default function WebsiteRenderer({ document, slug, page, preview = false }: Props) {
  const bg = safeHex(document.backgroundColor, "#f5f2e9");
  const text = safeHex(document.textColor, "#203b34");
  const primary = safeHex(document.primaryColor, "#275d4e");
  const accent = safeHex(document.accentColor, "#d5885b");
  const selected = page ?? document.pages[0];
  const navPages = document.pages.filter((item) => item.slug !== selected?.slug);
  return (
    <div className="site-render" style={{ "--site-bg": bg, "--site-text": text, "--site-primary": primary, "--site-accent": accent, fontFamily: fontMap[document.font] ?? fontMap.modern } as CSSProperties} data-testid="website-preview">
      <header className="site-nav">
        <div className="site-brand">
          {safeImage(document.logoUrl) ? <img src={safeImage(document.logoUrl)} alt="" /> : <span className="site-brand-mark">{document.appName.slice(0, 1).toUpperCase()}</span>}
          <span>{document.appName}</span>
        </div>
        <nav aria-label="Website pages">
          {document.pages.map((item) => preview
            ? <span className={`site-nav-link ${item.slug === selected?.slug ? "is-current" : ""}`} key={item.slug}>{item.title}</span>
            : <Link key={item.slug} href={`/sites/${slug}/${item.slug}`} className={`site-nav-link ${item.slug === selected?.slug ? "is-current" : ""}`} data-testid={`public-nav-${item.slug}`}>{item.title}</Link>
          )}
        </nav>
      </header>
      <main>
        <div className="site-page-heading"><span className="site-eyebrow">{document.tagline}</span><h1>{selected?.title ?? document.appName}</h1></div>
      {(selected?.sections ?? []).map((section) => <Section key={section.id} section={section} preview={preview} />)}
      </main>
      <footer className="site-footer">
        <div><strong>{document.appName}</strong><p>{document.footerText}</p></div>
        <div className="site-footer-pages">{navPages.map((item) => preview ? <span key={item.slug}>{item.title}</span> : <Link key={item.slug} href={`/sites/${slug}/${item.slug}`} data-testid={`footer-nav-${item.slug}`}>{item.title}</Link>)}</div>
        <span className="site-footer-note">A small business, built to last.</span>
      </footer>
    </div>
  );
}
