// UI-only stub. No backend calls; components fall back to static catalog.
import { createServerFn } from "@tanstack/react-start";

export type MarketProduct = {
  id: string;
  slug: string;
  name: string;
  industry_label: string | null;
  icon: string;
  price_label: string;
  price_period: string | null;
  rating: number;
  downloads: number;
  downloads_label: string | null;
  badge: "NEW" | "HOT" | "TOP" | "DEAL" | null;
};

export type MarketIndustry = {
  id: string;
  slug: string;
  name: string;
  icon: string;
  image_key: string | null;
  product_count: number;
  tone: string;
};

export type MarketVendor = {
  id: string;
  slug: string;
  name: string;
  country: string | null;
  verified: boolean;
  rating: number;
  product_count: number;
};

export type Marketplace = {
  featured: MarketProduct[];
  trending: MarketProduct[];
  bestSellers: MarketProduct[];
  newReleases: MarketProduct[];
  aiProducts: MarketProduct[];
  industries: MarketIndustry[];
  vendors: MarketVendor[];
};

export const getMarketplace = createServerFn({ method: "GET" }).handler(
  async (): Promise<Marketplace> => ({
    featured: [],
    trending: [],
    bestSellers: [],
    newReleases: [],
    aiProducts: [],
    industries: [],
    vendors: [],
  }),
);
