import type { ComponentType } from "react";
import type { DashSpec } from "@/data/dashboards";
import { DashboardView } from "@/components/DashboardView";

import { Alerts, Observability, GeoMonitoring, NOC, Backup, Licenses, Infra, CloudOps, Printing } from "./operations";
import { CommandCenter } from "./command-center";
import { SOC, Fraud, Forensics } from "./security";
import { IAM, UserRoles, Biometric, MDM, RemoteAccess } from "./category-02-identity";
import { Payments, Accounting, Subscriptions, MarketIntel } from "./revenue";
import { Comms, VoiceAI, Gamification } from "./customer";
import { CRM, SalesPipeline, Billing, Support, CustomerSuccess, Onboarding } from "./category-03-revenue";
import { HR, Payroll } from "./people";
import { Projects, Workflows, Knowledge, Files, BrowserWS, DesignSystem, Broadcast } from "./workspace";
import { Analytics, Reporting, DevOps, Repos, APIHub, AppBuilder, DataLake, Governance, Franchise, Inventory, SupplyChain, Procurement, Social, Marketing, SEO, IoTDrones, SmartCity, Energy, Satellite, Robotics, Healthcare, Education, Legal, Quantum, Sandbox, Metaverse, Blockchain } from "./extras";
import { WarRoom, MasterControl, AICopilot, OSControl, SearchPalette, DigitalTwin, KnowledgeGraph } from "./category-01-core";
import { ValaAI, AIApi, AIRecovery, AIIntelligence } from "./category-04-ai";
import { Marketplace, ProductManager, Gallery, Reviews, SubscriptionsSystem, Downloads, Activation } from "./category-05-marketplace";
import { Reseller, FranchiseMgr, Affiliate, Influencer } from "./category-06-partners";
import { ReposDev, GitMgmt, Deployment, Cicd, ApiHubPremium, DevOpsPremium, InfraPremium, ObservabilityPremium } from "./category-07-devops";
import { AnalyticsPremium, ReportingPremium, SEOPremium, SocialPremium, MarketingPremium, MarketIntelPremium, DataLakePremium, GovernancePremium } from "./category-08-analytics";

type Comp = ComponentType<{ d: DashSpec }>;

export const REGISTRY: Record<string, Comp> = {
  "command-center": CommandCenter,
  "alerts": Alerts,
  "observability": ObservabilityPremium,
  "geo-monitoring": GeoMonitoring,
  "noc": NOC,
  "backup": Backup,
  "licenses": Licenses,
  "mdm": MDM,
  "remote-access": RemoteAccess,
  "infra": InfraPremium,
  "cloud": CloudOps,
  "printing": Printing,
  "os-control": OSControl,
  "iam": IAM,
  "user-roles": UserRoles,
  "soc": SOC,
  "fraud": Fraud,
  "forensics": Forensics,
  "biometric": Biometric,
  "crm": CRM,
  "sales-pipeline": SalesPipeline,
  "billing": Billing,
  "payments": Payments,
  "accounting": Accounting,
  "subscriptions": Subscriptions,
  "market-intel": MarketIntelPremium,
  "support": Support,
  "comms": Comms,
  "voice-ai": VoiceAI,
  "gamification": Gamification,
  "customer-success": CustomerSuccess,
  "onboarding": Onboarding,
  "hr": HR,
  "payroll": Payroll,
  "projects": Projects,
  "workflows": Workflows,
  "knowledge": Knowledge,
  "files": Files,
  "search": SearchPalette,
  "browser": BrowserWS,
  "design-system": DesignSystem,
  "broadcast": Broadcast,
  "ai-copilot": AICopilot,
  "vala-ai": ValaAI, "ai-api": AIApi, "ai-recovery": AIRecovery, "ai-intelligence": AIIntelligence,
  "digital-twin": DigitalTwin, "war-room": WarRoom, "master-control": MasterControl,
  "devops": DevOpsPremium, "repos": ReposDev, "api-hub": ApiHubPremium, "app-builder": AppBuilder,
  "git-mgmt": GitMgmt, "deployment": Deployment, "cicd": Cicd,
  "data-lake": DataLakePremium, "governance": GovernancePremium, "knowledge-graph": KnowledgeGraph,
  "marketplace": Marketplace, "franchise": FranchiseMgr, "inventory": Inventory,
  "reseller": Reseller, "affiliate": Affiliate, "influencer": Influencer,
  "product-manager": ProductManager, "gallery": Gallery, "reviews": Reviews,
  "subscriptions-system": SubscriptionsSystem, "downloads": Downloads, "activation": Activation,
  "supply-chain": SupplyChain, "procurement": Procurement,
  "social": SocialPremium, "marketing": MarketingPremium, "seo": SEOPremium,
  "market-intel": MarketIntelPremium,
  "iot-drones": IoTDrones, "smart-city": SmartCity, "energy": Energy,
  "satellite": Satellite, "robotics": Robotics,
  "healthcare": Healthcare, "education": Education, "legal": Legal,
  "research-quantum": Quantum, "sandbox": Sandbox, "metaverse": Metaverse, "blockchain": Blockchain,
};

export function resolveDashboard(slug: string): Comp {
  return REGISTRY[slug] ?? DashboardView;
}
