import { randomUUID } from "node:crypto";
import { and, desc, eq, sql } from "drizzle-orm";
import { Router, type IRouter, type Request, type Response } from "express";
import {
  db,
  websitesTable,
  type WebsiteRow,
} from "@workspace/db";
import {
  GetMyWebsiteParams,
  GetMyWebsiteResponse,
  GetPublishedWebsiteParams,
  GetPublishedWebsiteResponse,
  GetWebsiteManifestParams,
  GetWebsiteManifestResponse,
  InstallWebsiteTemplateBody,
  InstallWebsiteTemplateResponse,
  ListMyWebsitesResponse,
  ListSiteTemplatesResponse,
  PublishWebsiteParams,
  PublishWebsiteResponse,
  SaveWebsiteDraftBody,
  SaveWebsiteDraftParams,
  SaveWebsiteDraftResponse,
  type SiteTemplate,
  type WebsiteDocument,
  type WebsiteSection,
} from "@workspace/api-zod";

const router: IRouter = Router();

type TemplateSeed = {
  slug: string;
  name: string;
  niche: string;
  description: string;
  image: string;
  tagline: string;
  heading: string;
  intro: string;
  primary: string;
  accent: string;
  background: string;
  text: string;
  font: WebsiteDocument["font"];
  features: string[];
};

function buildTemplate(seed: TemplateSeed): SiteTemplate {
  const section = (
    type: WebsiteSection["type"],
    id: string,
    heading: string,
    body: string,
    imageUrl: string | null = null,
    buttonLabel: string | null = null,
    buttonHref: string | null = null,
    items: WebsiteSection["items"] = [],
  ): WebsiteSection => ({
    id,
    type,
    enabled: true,
    heading,
    body,
    imageUrl,
    buttonLabel,
    buttonHref,
    items,
  });

  const document: WebsiteDocument = {
    appName: seed.name,
    tagline: seed.tagline,
    logoUrl: null,
    primaryColor: seed.primary,
    accentColor: seed.accent,
    backgroundColor: seed.background,
    textColor: seed.text,
    font: seed.font,
    footerText: `Thoughtful work, made for ${seed.niche.toLowerCase()}.`,
    pages: [
      {
        slug: "home",
        title: "Welcome",
        sections: [
          section("hero", `${seed.slug}-hero`, seed.heading, seed.intro, seed.image, "Explore our work", "/home"),
          section(
            "features",
            `${seed.slug}-features`,
            "A better way to move forward",
            `A clear, considered approach for every ${seed.niche.toLowerCase()} project.`,
            null,
            null,
            null,
            seed.features.map((feature) => ({
              heading: feature,
              body: "A practical, personal experience shaped around your goals.",
              imageUrl: null,
            })),
          ),
          section("services", `${seed.slug}-services`, "What we do", "Start with the service that fits your next step.", null, "Get in touch", "/contact"),
        ],
      },
      {
        slug: "contact",
        title: "Contact",
        sections: [
          section("contact", `${seed.slug}-contact`, "Let's start a conversation", "Tell us what you are working toward. We will help you find the right next step.", null, "Back to the home page", "/home"),
        ],
      },
    ],
  };

  return {
    slug: seed.slug,
    name: seed.name,
    niche: seed.niche,
    description: seed.description,
    previewImage: seed.image,
    features: seed.features,
    document,
  };
}

const templates: SiteTemplate[] = [
  buildTemplate({
    slug: "atlas-advisory",
    name: "Atlas Advisory",
    niche: "Consulting & professional services",
    description: "A confident, editorial starting point for independent consultants and advisory firms.",
    image: "/images/templates/atlas-advisory.jpg",
    tagline: "Clear thinking. Practical progress.",
    heading: "Make your next move a considered one.",
    intro: "Independent advice for leaders ready to build with focus, make better decisions, and move their business forward.",
    primary: "#244b48", accent: "#bb7750", background: "#f5f2e9", text: "#203b34", font: "editorial",
    features: ["Strategy & planning", "Operations advisory", "Leadership support"],
  }),
  buildTemplate({
    slug: "gather-and-grain",
    name: "Gather & Grain",
    niche: "Food & hospitality",
    description: "A warm, inviting site foundation for restaurants, caterers, and independent food brands.",
    image: "/images/templates/gather-and-grain.jpg",
    tagline: "Good food. Made with care.",
    heading: "A table worth coming back to.",
    intro: "Seasonal ingredients, honest cooking, and generous hospitality for the moments that bring people together.",
    primary: "#4b4935", accent: "#bc7348", background: "#f5efe4", text: "#34382e", font: "friendly",
    features: ["Seasonal menus", "Private dining", "Thoughtful catering"],
  }),
  buildTemplate({
    slug: "meridian-property",
    name: "Meridian Property",
    niche: "Real estate",
    description: "A polished property brand for agents, brokers, and real estate teams.",
    image: "/images/templates/meridian-property.jpg",
    tagline: "Find the place to begin.",
    heading: "Property decisions, made with confidence.",
    intro: "Local expertise and personal guidance to help you find, sell, or invest in property with clarity.",
    primary: "#244969", accent: "#c39b59", background: "#f4f2ec", text: "#263644", font: "modern",
    features: ["Homes for sale", "Local area guidance", "Buyer representation"],
  }),
  buildTemplate({
    slug: "form-and-found",
    name: "Form & Found",
    niche: "Creative studios",
    description: "A clean portfolio and services site for designers, photographers, and creative teams.",
    image: "/images/templates/form-and-found.jpg",
    tagline: "Ideas, given a clear shape.",
    heading: "Creative work with a point of view.",
    intro: "We turn ambitious ideas into identities, digital experiences, and visual systems people remember.",
    primary: "#373847", accent: "#d37254", background: "#f3f1ed", text: "#292b37", font: "editorial",
    features: ["Brand identity", "Digital experiences", "Art direction"],
  }),
  buildTemplate({
    slug: "quiet-standard",
    name: "Quiet Standard",
    niche: "Fashion & jewellery",
    description: "A refined showcase for independent fashion labels, jewellery makers, and boutiques.",
    image: "/images/templates/quiet-standard.jpg",
    tagline: "Made to be kept.",
    heading: "Considered pieces. Lasting character.",
    intro: "Discover a small collection shaped by careful craft, enduring materials, and a more personal kind of luxury.",
    primary: "#403d38", accent: "#be9b69", background: "#f6f2e9", text: "#302e2c", font: "editorial",
    features: ["Made-to-order", "Material stories", "Personal appointments"],
  }),
  buildTemplate({
    slug: "bloomwell-studio",
    name: "Bloomwell Studio",
    niche: "Beauty & wellness",
    description: "A calm, welcoming introduction for wellness practices, salons, and independent beauty brands.",
    image: "/images/templates/bloomwell-studio.jpg",
    tagline: "A little more room to feel well.",
    heading: "Care that meets you where you are.",
    intro: "Personal treatments and thoughtful routines designed to help you feel comfortable, confident, and cared for.",
    primary: "#476456", accent: "#c98373", background: "#f2eee6", text: "#27382f", font: "friendly",
    features: ["Personal consultations", "Specialist treatments", "Simple bookings"],
  }),
  buildTemplate({
    slug: "northstar-legal",
    name: "Northstar Legal",
    niche: "Legal services",
    description: "A clear, reassuring home for small law practices and specialist legal professionals.",
    image: "/images/templates/northstar-legal.jpg",
    tagline: "Good counsel. Clear direction.",
    heading: "Legal guidance for what comes next.",
    intro: "Straightforward legal support for people and businesses navigating important decisions and new opportunities.",
    primary: "#243d50", accent: "#b68e55", background: "#f3f0e8", text: "#252f37", font: "editorial",
    features: ["Business agreements", "Property matters", "Personal guidance"],
  }),
  buildTemplate({
    slug: "forward-fitness",
    name: "Forward Fitness",
    niche: "Fitness & coaching",
    description: "A bold, encouraging site foundation for coaches, studios, and independent fitness professionals.",
    image: "/images/templates/forward-fitness.jpg",
    tagline: "Progress, built around you.",
    heading: "Training that moves with your life.",
    intro: "Personal coaching and practical programs that help you build strength, confidence, and habits that last.",
    primary: "#2e5147", accent: "#d1784d", background: "#f1f1e9", text: "#25332e", font: "modern",
    features: ["One-to-one coaching", "Small group training", "Flexible programs"],
  }),
];

function requireUser(req: Request, res: Response): string | null {
  if (!req.isAuthenticated()) {
    res.status(401).json({ error: "Not authenticated" });
    return null;
  }
  return req.user.id;
}

function serializeWebsite(website: WebsiteRow) {
  return {
    ...website,
    createdAt: website.createdAt.toISOString(),
    updatedAt: website.updatedAt.toISOString(),
    publishedAt: website.publishedAt?.toISOString() ?? null,
  };
}

function parseSlugParam<S extends {
  safeParse(input: unknown):
    | { success: true; data: { slug: string } }
    | { success: false; error: { message: string } };
}>(schema: S, req: Request, res: Response): string | null {
  const parsed = schema.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return null;
  }
  return parsed.data.slug;
}

router.get("/site-templates", (_req, res): void => {
  res.json(ListSiteTemplatesResponse.parse(templates));
});

router.get("/websites", async (req, res): Promise<void> => {
  const ownerId = requireUser(req, res);
  if (!ownerId) return;

  const websites = await db
    .select()
    .from(websitesTable)
    .where(eq(websitesTable.ownerId, ownerId))
    .orderBy(desc(websitesTable.updatedAt));

  res.json(ListMyWebsitesResponse.parse(websites.map(serializeWebsite)));
});

router.post("/websites", async (req, res): Promise<void> => {
  const ownerId = requireUser(req, res);
  if (!ownerId) return;
  const input = InstallWebsiteTemplateBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: input.error.message });
    return;
  }

  const template = templates.find((item) => item.slug === input.data.templateSlug);
  if (!template) {
    res.status(400).json({ error: "Unknown website template" });
    return;
  }

  const name = input.data.name?.trim() || template.name;
  const slugBase = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48) || "my-website";
  const slug = `${slugBase}-${randomUUID().slice(0, 8)}`;
  const [website] = await db
    .insert(websitesTable)
    .values({
      ownerId,
      templateSlug: template.slug,
      slug,
      name,
      draft: template.document,
    })
    .returning();

  res.status(201).json(InstallWebsiteTemplateResponse.parse(serializeWebsite(website)));
});

router.get("/websites/:slug", async (req, res): Promise<void> => {
  const ownerId = requireUser(req, res);
  if (!ownerId) return;
  const slug = parseSlugParam(GetMyWebsiteParams, req, res);
  if (!slug) return;

  const [website] = await db
    .select()
    .from(websitesTable)
    .where(and(eq(websitesTable.ownerId, ownerId), eq(websitesTable.slug, slug)))
    .limit(1);
  if (!website) {
    res.status(404).json({ error: "Website not found" });
    return;
  }
  res.json(GetMyWebsiteResponse.parse(serializeWebsite(website)));
});

router.put("/websites/:slug/draft", async (req, res): Promise<void> => {
  const ownerId = requireUser(req, res);
  if (!ownerId) return;
  const slug = parseSlugParam(SaveWebsiteDraftParams, req, res);
  if (!slug) return;
  const input = SaveWebsiteDraftBody.safeParse(req.body);
  if (!input.success) {
    res.status(400).json({ error: input.error.message });
    return;
  }

  const [website] = await db
    .update(websitesTable)
    .set({
      name: input.data.name,
      draft: input.data.document,
      updatedAt: new Date(),
    })
    .where(and(eq(websitesTable.ownerId, ownerId), eq(websitesTable.slug, slug)))
    .returning();
  if (!website) {
    res.status(404).json({ error: "Website not found" });
    return;
  }
  res.json(SaveWebsiteDraftResponse.parse(serializeWebsite(website)));
});

router.post("/websites/:slug/publish", async (req, res): Promise<void> => {
  const ownerId = requireUser(req, res);
  if (!ownerId) return;
  const slug = parseSlugParam(PublishWebsiteParams, req, res);
  if (!slug) return;

  const [website] = await db
    .update(websitesTable)
    .set({ published: sql`${websitesTable.draft}`, publishedAt: new Date(), updatedAt: new Date() })
    .where(and(eq(websitesTable.ownerId, ownerId), eq(websitesTable.slug, slug)))
    .returning();
  if (!website) {
    res.status(404).json({ error: "Website not found" });
    return;
  }
  res.json(PublishWebsiteResponse.parse(serializeWebsite(website)));
});

router.get("/published-websites/:slug", async (req, res): Promise<void> => {
  const slug = parseSlugParam(GetPublishedWebsiteParams, req, res);
  if (!slug) return;
  const [website] = await db
    .select()
    .from(websitesTable)
    .where(eq(websitesTable.slug, slug))
    .limit(1);
  if (!website?.published || !website.publishedAt) {
    res.status(404).json({ error: "Website is not published" });
    return;
  }

  res.json(GetPublishedWebsiteResponse.parse({
    templateSlug: website.templateSlug,
    slug: website.slug,
    name: website.name,
    document: website.published,
    publishedAt: website.publishedAt.toISOString(),
  }));
});

router.get("/website-manifests/:slug", async (req, res): Promise<void> => {
  const slug = parseSlugParam(GetWebsiteManifestParams, req, res);
  if (!slug) return;
  const [website] = await db
    .select()
    .from(websitesTable)
    .where(eq(websitesTable.slug, slug))
    .limit(1);
  if (!website?.published || !website.publishedAt) {
    res.status(404).json({ error: "Website is not published" });
    return;
  }
  const document = website.published as WebsiteDocument;
  const manifest = GetWebsiteManifestResponse.parse({
    id: `/sites/${website.slug}/`,
    name: document.appName,
    short_name: document.appName.slice(0, 12),
    start_url: `/sites/${website.slug}/${document.pages[0]?.slug ?? "home"}`,
    scope: `/sites/${website.slug}/`,
    display: "standalone",
    background_color: document.backgroundColor,
    theme_color: document.primaryColor,
    icons: [
      { src: "/pwa-icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/pwa-icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
    ],
  });

  res.type("application/manifest+json").json(manifest);
});

export default router;
