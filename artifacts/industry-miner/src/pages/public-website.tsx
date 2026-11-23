import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowUpRight, Download, Globe2, RotateCw } from "lucide-react";
import { getGetPublishedWebsiteQueryKey, getGetWebsiteManifestQueryKey, getGetWebsiteManifestUrl, useGetPublishedWebsite, useGetWebsiteManifest } from "@workspace/api-client-react";
import WebsiteRenderer from "@/components/studio/WebsiteRenderer";

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function PublicWebsite() {
  const { slug = "", pageSlug = "" } = useParams<{ slug: string; pageSlug: string }>();
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [offlineReady, setOfflineReady] = useState(false);
  const [installError, setInstallError] = useState(false);
  const publishedQuery = useGetPublishedWebsite(slug, {
    query: { queryKey: getGetPublishedWebsiteQueryKey(slug), enabled: !!slug, retry: 1 }
  });
  const manifestQuery = useGetWebsiteManifest(slug, {
    query: { queryKey: getGetWebsiteManifestQueryKey(slug), enabled: !!slug, retry: 1 }
  });
  const published = publishedQuery.data;
  const page = published?.document.pages.find((item) => item.slug === pageSlug);
  useEffect(() => {
    if (!manifestQuery.data || !slug) return;
    const link = document.createElement("link");
    link.rel = "manifest";
    link.href = getGetWebsiteManifestUrl(slug);
    link.dataset.industryMinerManifest = slug;
    document.head.appendChild(link);
    const theme = document.createElement("meta");
    theme.name = "theme-color";
    theme.content = manifestQuery.data.theme_color;
    theme.dataset.industryMinerTheme = slug;
    document.head.appendChild(theme);
    let active = true;
    if ("serviceWorker" in navigator) {
      const workerUrl = new URL(`${import.meta.env.BASE_URL}service-worker.js`, window.location.origin);
      navigator.serviceWorker.register(workerUrl, { scope: import.meta.env.BASE_URL })
        .then(() => { if (active) setOfflineReady(true); })
        .catch(() => { if (active) setOfflineReady(false); });
    }
    return () => {
      active = false;
      link.remove();
      theme.remove();
    };
  }, [manifestQuery.data, slug]);
  useEffect(() => {
    setIsInstalled(window.matchMedia("(display-mode: standalone)").matches);
    const onInstallPrompt = (event: Event) => {
      event.preventDefault();
      setInstallPrompt(event as InstallPromptEvent);
    };
    const onInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };
    window.addEventListener("beforeinstallprompt", onInstallPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onInstallPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);
  useEffect(() => {
    if (!published || !manifestQuery.data || !("serviceWorker" in navigator)) return;
    let active = true;
    navigator.serviceWorker.ready.then((registration) => {
      if (!active) return;
      const worker = navigator.serviceWorker.controller ?? registration.active;
      worker?.postMessage({
        type: "CACHE_SITE_DATA",
        slug,
        published,
        manifest: manifestQuery.data,
      });
    }).catch(() => undefined);
    return () => { active = false; };
  }, [manifestQuery.data, published, slug]);

  async function installWebsiteApp() {
    if (!installPrompt) return;
    setInstallError(false);
    try {
      await installPrompt.prompt();
      const choice = await installPrompt.userChoice;
      if (choice.outcome === "accepted") setIsInstalled(true);
    } catch {
      setInstallError(true);
    } finally {
      setInstallPrompt(null);
    }
  }

  if (publishedQuery.isLoading) return <main className="public-loading"><div className="public-loading-card"><span className="studio-kicker">OPENING THE SITE</span><div className="public-skeleton-bar" /><div className="public-skeleton-block" /><div className="public-skeleton-bar short" /></div></main>;
  if (publishedQuery.isError || !published) return <main className="public-error"><div className="public-error-card" role="alert"><span className="public-error-icon"><Globe2 size={22} /></span><p className="studio-kicker">PUBLIC WEBSITE</p><h1>This website isn't available yet.</h1><p>The owner may not have published it, or this address may have changed.</p><button onClick={() => publishedQuery.refetch()} className="public-retry" data-testid="button-retry-public-site"><RotateCw size={15} /> Try again</button><Link href="/studio" className="public-studio-link" data-testid="link-public-studio"><ArrowLeft size={15} /> Go to Website Studio</Link></div></main>;
  if (!page) return <main className="public-error"><div className="public-error-card" role="status"><span className="studio-kicker">PAGE NOT FOUND</span><h1>That page isn't on this site.</h1><p>Choose a page from the navigation to keep exploring.</p><Link href={`/sites/${slug}/${published.document.pages[0]?.slug ?? "home"}`} className="public-studio-link" data-testid="link-public-home"><ArrowLeft size={15} /> Visit the first page</Link></div></main>;
  return <main className="public-site-shell">
    <div className="public-site-banner"><span><Globe2 size={13} /> A live website</span><Link href="/studio" data-testid="link-build-own-site">Build your own with The Industry Miner <ArrowUpRight size={13} /></Link></div>
    <WebsiteRenderer document={published.document} slug={published.slug} page={page} />
    <div className="public-install-note" data-testid="status-public-site">
      <span className="install-note-mark"><span /></span>
      <p>
        <strong>{manifestQuery.data?.name ?? published.document.appName} {isInstalled ? "is installed." : "is ready to install."}</strong>
        <span>{installError ? "Your browser couldn't start installation. Use its Add to Home Screen option instead." : manifestQuery.isError ? "Install details are temporarily unavailable." : offlineReady ? "The website is available on your home screen and can reopen offline after a visit." : "Use your browser's Add to Home Screen option to keep this site close."}</span>
      </p>
      {installPrompt && !isInstalled && <button type="button" onClick={installWebsiteApp} className="public-install-button" data-testid="button-install-site"><Download size={14} /> Install app</button>}
      <span className="studio-mono">PUBLISHED {new Date(published.publishedAt).toLocaleDateString(undefined, { month: "short", year: "numeric" }).toUpperCase()}</span>
    </div>
  </main>;
}
