import { createFileRoute } from "@tanstack/react-router";
import { MarketHeader } from "@/components/market/MarketHeader";
import {
  QuickActions, LiveStats, FeaturedRow, IndustryGrid,
  TrendingRow, BestSellersRow, NewReleasesRow, AIZone, ProductsByCategory,
} from "@/components/market/sections";
import {
  SuccessStories, AwardsWall, LiveFeed, ValaTV, Academy,
  PartnerEcosystem, FAQ, FinalCTA, Footer,
} from "@/components/market/sections-2";
import { CategoryRows } from "@/components/market/CategoryRows";
import { PremiumHeroSlider } from "@/components/market/PremiumHeroSlider";
import { BecomePartner } from "@/components/market/BecomePartner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Software Vala — The Premium Enterprise Marketplace" },
      { name: "description", content: "1,284 enterprise products across 12 industries. ERP, CRM, HRMS, AI and more — vetted, licensed and supported on one premium marketplace." },
      { property: "og:title", content: "Software Vala — The Premium Enterprise Marketplace" },
      { property: "og:description", content: "Netflix meets Envato for enterprise software. Discover, license and deploy from one place." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <MarketHeader />
      <main className="max-w-[1600px] mx-auto px-4 lg:px-6 py-6 lg:py-8 space-y-8 lg:space-y-12">
        <PremiumHeroSlider />
        <QuickActions />
        <LiveStats />
        <FeaturedRow />
        <IndustryGrid />
        <TrendingRow />
        <BestSellersRow />
        <NewReleasesRow />
        <CategoryRows />
        <ProductsByCategory />
        <AIZone />
        <SuccessStories />
        <AwardsWall />
        <LiveFeed />
        <ValaTV />
        <Academy />
        <PartnerEcosystem />
        <BecomePartner />
        <FAQ />
        <FinalCTA />
        <Footer />
      </main>
    </div>
  );
}
