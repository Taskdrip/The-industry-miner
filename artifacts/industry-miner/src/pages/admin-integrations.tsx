import { useState } from "react";
import { Link } from "wouter";
import { useQueryClient } from "@tanstack/react-query";
import {
  getListAdminIntegrationsQueryKey,
  useDeleteAdminIntegration,
  useListAdminIntegrations,
  useSaveAdminIntegration,
  useTestAdminIntegration,
  useUpdateAdminIntegration,
  type IntegrationSetting,
} from "@workspace/api-client-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import "@/landing.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft, Check, CircleAlert, Clock3, KeyRound, Loader2, Mail,
  PlugZap, RefreshCw, ShieldCheck, Trash2, Workflow,
} from "lucide-react";

const categoryNames: Record<IntegrationSetting["category"], string> = {
  payments: "Payments",
  notifications: "Transactional email",
  ai: "AI services",
};

function statusLabel(setting: IntegrationSetting) {
  if (!setting.configured) return "Not configured";
  if (setting.status === "connected") return "Connected";
  if (setting.status === "error") return "Needs attention";
  return "Not tested";
}

export default function AdminIntegrations() {
  const { isLoading: authLoading, isAuthenticated, isAdmin, loginUrl } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const integrations = useListAdminIntegrations();
  const saveIntegration = useSaveAdminIntegration();
  const updateIntegration = useUpdateAdminIntegration();
  const testIntegration = useTestAdminIntegration();
  const deleteIntegration = useDeleteAdminIntegration();
  const [secrets, setSecrets] = useState<Record<string, string>>({});
  const [senders, setSenders] = useState<Record<string, string>>({});
  const [busyProvider, setBusyProvider] = useState<string | null>(null);

  const refresh = () => queryClient.invalidateQueries({ queryKey: getListAdminIntegrationsQueryKey() });

  async function save(setting: IntegrationSetting) {
    const apiKey = secrets[setting.providerId]?.trim();
    const senderEmail = senders[setting.providerId]?.trim();
    if (!apiKey && !senderEmail) return;
    setBusyProvider(setting.providerId);
    saveIntegration.mutate(
      { providerId: setting.providerId, data: { ...(apiKey ? { apiKey } : {}), ...(senderEmail ? { senderEmail } : {}) } },
      {
        onSuccess: () => {
          setSecrets((current) => ({ ...current, [setting.providerId]: "" }));
          toast({ title: "Credentials saved", description: "The secret was stored securely. Saved values are never shown here." });
          void refresh();
        },
        onError: () => toast({ title: "Could not save credentials", description: "Check the provider value and try again.", variant: "destructive" }),
        onSettled: () => setBusyProvider(null),
      },
    );
  }

  function toggle(setting: IntegrationSetting) {
    setBusyProvider(setting.providerId);
    updateIntegration.mutate(
      { providerId: setting.providerId, data: { enabled: !setting.enabled } },
      {
        onSuccess: () => { toast({ title: setting.enabled ? "Integration paused" : "Integration enabled" }); void refresh(); },
        onError: () => toast({ title: "Could not update integration", variant: "destructive" }),
        onSettled: () => setBusyProvider(null),
      },
    );
  }

  function test(setting: IntegrationSetting) {
    setBusyProvider(setting.providerId);
    testIntegration.mutate(
      { providerId: setting.providerId },
      {
        onSuccess: (result) => {
          toast({ title: result.success ? "Connection test passed" : "Connection test needs attention", description: result.message, variant: result.success ? "default" : "destructive" });
          void refresh();
        },
        onError: () => toast({ title: "Connection test failed", description: "The provider could not be reached. Review the configuration and retry.", variant: "destructive" }),
        onSettled: () => setBusyProvider(null),
      },
    );
  }

  function remove(setting: IntegrationSetting) {
    if (!window.confirm(`Remove saved credentials for ${setting.label}? This cannot be undone.`)) return;
    setBusyProvider(setting.providerId);
    deleteIntegration.mutate(
      { providerId: setting.providerId },
      {
        onSuccess: () => { setSecrets((current) => ({ ...current, [setting.providerId]: "" })); toast({ title: "Credentials removed" }); void refresh(); },
        onError: () => toast({ title: "Could not remove credentials", variant: "destructive" }),
        onSettled: () => setBusyProvider(null),
      },
    );
  }

  if (authLoading) {
    return <main className="integration-gate" aria-label="Loading admin access"><div className="integration-skeleton" /><div className="integration-skeleton short" /><div className="integration-skeleton" /></main>;
  }
  if (!isAuthenticated || !isAdmin) {
    return (
      <main className="integration-gate">
        <div className="integration-gate-card">
          <span className="integration-mark"><ShieldCheck /></span>
          <p className="integration-eyebrow">ADMIN ACCESS</p>
          <h1>{isAuthenticated ? "Admin access only" : "Sign in to continue"}</h1>
          <p>{isAuthenticated ? "Provider settings are restricted to Industry Miner administrators." : "Sign in with an administrator account to manage provider settings."}</p>
          {!isAuthenticated && <a className="integration-action primary" href={loginUrl}>Sign in securely</a>}
          <Link className="integration-back" href="/admin"><ArrowLeft size={15} /> Back to course admin</Link>
        </div>
      </main>
    );
  }

  const rows = integrations.data ?? [];
  const groups = (["payments", "notifications", "ai"] as const).map((category) => ({
    category,
    items: rows.filter((item) => item.category === category),
  }));

  return (
    <div className="integration-page min-h-[100dvh]">
      <Header />
      <main className="integration-main">
        <div className="integration-wrap">
          <Link href="/admin" data-testid="link-back-admin" className="integration-back"><ArrowLeft size={15} /> Course admin</Link>
          <header className="integration-heading">
            <div className="integration-heading-icon"><Workflow size={20} /></div>
            <div>
              <p className="integration-eyebrow">PLATFORM SETTINGS / PROVIDERS</p>
              <h1>Integrations</h1>
              <p>Manage encrypted credentials and enable the services used by the platform.</p>
            </div>
          </header>
          <aside className="integration-security" data-testid="notice-integration-security">
            <ShieldCheck size={20} />
            <div><strong>Secrets stay secret.</strong><span>Credentials are encrypted on the server. Saved key values are never returned to this page or displayed after saving.</span></div>
          </aside>
          {integrations.isLoading && <section className="integration-cards-loading" aria-label="Loading integrations">{[1, 2, 3].map((n) => <div className="integration-skeleton" key={n} />)}</section>}
          {integrations.isError && (
            <section className="integration-error" role="alert" data-testid="error-integrations">
              <CircleAlert size={21} /><div><strong>Provider settings could not be loaded.</strong><p>Check your admin session and try again.</p></div>
              <Button variant="outline" onClick={() => void integrations.refetch()} data-testid="button-retry-integrations"><RefreshCw size={15} /> Retry</Button>
            </section>
          )}
          {!integrations.isLoading && !integrations.isError && rows.length === 0 && (
            <section className="integration-empty" data-testid="empty-integrations"><PlugZap size={26} /><h2>No integrations available</h2><p>Provider settings will appear here when they are enabled for this platform.</p></section>
          )}
          {!integrations.isLoading && !integrations.isError && groups.map(({ category, items }) => items.length > 0 && (
            <section className="integration-group" key={category} aria-labelledby={`integration-category-${category}`}>
              <div className="integration-group-title"><span id={`integration-category-${category}`}>{categoryNames[category]}</span><small>{String(items.length).padStart(2, "0")} PROVIDERS</small></div>
              <div className="integration-list">
                {items.map((setting) => {
                  const busy = busyProvider === setting.providerId;
                  return (
                    <article className="integration-card" key={setting.providerId} data-testid={`card-integration-${setting.providerId}`}>
                      <div className="integration-card-top">
                        <div className="integration-brand-icon">{setting.category === "notifications" ? <Mail size={19} /> : setting.category === "payments" ? <Workflow size={19} /> : <KeyRound size={19} />}</div>
                        <div className="integration-card-title"><div><h2>{setting.label}</h2><span className={`integration-status ${setting.status}`} data-testid={`status-integration-${setting.providerId}`}><i />{statusLabel(setting)}</span></div><p>{setting.description}</p></div>
                        <span className="integration-category-tag">{categoryNames[setting.category]}</span>
                      </div>
                      <div className="integration-metadata">
                        <span><strong>Enabled</strong>{setting.enabled ? "Yes" : "No"}</span>
                        <span><strong>Last tested</strong>{setting.lastTestedAt ? new Date(setting.lastTestedAt).toLocaleString() : "Not tested yet"}</span>
                        {setting.senderEmail && <span><strong>Sender</strong>{setting.senderEmail}</span>}
                      </div>
                      <div className="integration-edit">
                        <label htmlFor={`key-${setting.providerId}`}>{setting.configured ? "Replace secret key" : "Secret key"} <small>{setting.configured ? "Optional — leave blank to keep the saved key" : "Enter the provider secret"}</small></label>
                        <Input
                          id={`key-${setting.providerId}`}
                          data-testid={`input-secret-${setting.providerId}`}
                          type="password"
                          autoComplete="new-password"
                          value={secrets[setting.providerId] ?? ""}
                          onChange={(event) => setSecrets((current) => ({ ...current, [setting.providerId]: event.target.value }))}
                          placeholder={setting.configured ? "Saved securely — enter only to replace" : "Paste provider secret"}
                          disabled={busy}
                        />
                        {setting.category === "notifications" && (
                          <label className="integration-sender" htmlFor={`sender-${setting.providerId}`}>Sender email <small>Used for transactional receipts.</small>
                            <Input id={`sender-${setting.providerId}`} data-testid={`input-sender-${setting.providerId}`} type="email" autoComplete="email" value={senders[setting.providerId] ?? setting.senderEmail ?? ""} onChange={(event) => setSenders((current) => ({ ...current, [setting.providerId]: event.target.value }))} placeholder="receipts@yourdomain.com" disabled={busy} />
                          </label>
                        )}
                      </div>
                      {setting.providerId === "resend" && <p className="integration-provider-note" data-testid="note-resend-scope">Resend is used for transactional email such as payment receipts. It does not provide browser push notifications.</p>}
                      <div className="integration-card-actions">
                        <Button onClick={() => save(setting)} disabled={busy || (!secrets[setting.providerId]?.trim() && !senders[setting.providerId]?.trim())} data-testid={`button-save-${setting.providerId}`}>
                          {busy ? <Loader2 className="spin" size={15} /> : <Check size={15} />} Save securely
                        </Button>
                        <Button variant="outline" onClick={() => test(setting)} disabled={busy || !setting.configured || !setting.canTest} data-testid={`button-test-${setting.providerId}`}>
                          {busy ? <Loader2 className="spin" size={15} /> : <PlugZap size={15} />} Test
                        </Button>
                        <Button variant="ghost" onClick={() => toggle(setting)} disabled={busy || !setting.configured} data-testid={`button-toggle-${setting.providerId}`} aria-pressed={setting.enabled}>
                          {setting.enabled ? "Disable" : "Enable"}
                        </Button>
                        {setting.configured && <Button variant="ghost" className="integration-remove" onClick={() => remove(setting)} disabled={busy} data-testid={`button-remove-${setting.providerId}`}><Trash2 size={15} /> Remove</Button>}
                      </div>
                      <div className="integration-footnote"><Clock3 size={13} />{setting.updatedAt ? `Updated ${new Date(setting.updatedAt).toLocaleString()}` : "No saved configuration"}{busy && <span className="integration-working"><Loader2 className="spin" size={13} /> Working</span>}</div>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
          <footer className="integration-footer-note">Provider credentials are stored and managed server-side. This page never reads back secret values.</footer>
        </div>
      </main>
    </div>
  );
}
