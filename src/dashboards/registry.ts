import type { ComponentType } from "react";
import type { DashSpec } from "@/data/dashboards";
import { DashboardView } from "@/components/DashboardView";

import { Alerts as _AlertsLegacy, Observability, GeoMonitoring, NOC, Backup, Licenses, Infra, CloudOps, Printing } from "./operations";
import { CommandCenter } from "./command-center";
import { IAM as _IAMlegacy, UserRoles as _URlegacy, Biometric as _Biolegacy, MDM as _MDMlegacy, RemoteAccess as _RAlegacy } from "./category-02-identity";
import { SOC as _SOC, Fraud as _Fraud, Forensics as _Forensics } from "./security";
import { IAM, UserRoles, Biometric, MDM, RemoteAccess } from "./category-02-identity-premium";
void [_IAMlegacy, _URlegacy, _Biolegacy, _MDMlegacy, _RAlegacy, _SOC, _Fraud, _Forensics];
import { Payments, Accounting, Subscriptions, MarketIntel } from "./revenue";
import { Comms as _CommsLegacy, VoiceAI, Gamification as _GamiLegacy } from "./customer";
void _GamiLegacy;
import { CRM as _CRMlegacy, SalesPipeline as _SPlegacy, Billing as _Blegacy, Support as _Suplegacy, CustomerSuccess as _CSlegacy, Onboarding as _Onblegacy } from "./category-03-revenue";
import { CRM, SalesPipeline, Billing, Support, CustomerSuccess, Onboarding } from "./category-03-revenue-premium";
void [_CRMlegacy, _SPlegacy, _Blegacy, _Suplegacy, _CSlegacy, _Onblegacy];
import { HR, Payroll } from "./people";
import { Projects, Workflows, Knowledge as _KnowLegacy, Files as _FilesLegacy, BrowserWS, DesignSystem, Broadcast as _BcastLegacy } from "./workspace";
import { Analytics as _AnalyticsLegacy, Reporting as _ReportingLegacy, DevOps, Repos, APIHub, AppBuilder, DataLake, Governance, Franchise, Inventory, SupplyChain, Procurement, Social as _SocialLegacy, Marketing as _MarketingLegacy, SEO as _SEOLegacy, IoTDrones, SmartCity, Energy, Satellite, Robotics, Healthcare, Education, Legal, Quantum, Sandbox, Metaverse, Blockchain } from "./extras";
void [_AnalyticsLegacy, _ReportingLegacy, _SocialLegacy, _MarketingLegacy, _SEOLegacy];
import { WarRoom, MasterControl, AICopilot, OSControl, SearchPalette, DigitalTwin, KnowledgeGraph } from "./category-01-core";
import { ValaAI as _ValaLegacy, AIApi as _ApiLegacy, AIRecovery as _RecLegacy, AIIntelligence as _IntelLegacy } from "./category-04-ai";
import { ValaAI, AIApi, AIRecovery, AIIntelligence } from "./category-04-ai-premium";
import { Comms, Alerts, Knowledge, Files, Broadcast } from "./category-04-comms-premium";
void [_ValaLegacy, _ApiLegacy, _RecLegacy, _IntelLegacy, _CommsLegacy, _AlertsLegacy, _KnowLegacy, _FilesLegacy, _BcastLegacy];
import { Marketplace, ProductManager, Gallery, Reviews, SubscriptionsSystem, Downloads, Activation } from "./category-05-marketplace";
import { Reseller, FranchiseMgr, Affiliate, Influencer as _InfluencerLegacy } from "./category-06-partners";
import { InfluencerPremium } from "./category-06-influencer-premium";
void _InfluencerLegacy;
import { ReposDev, GitMgmt, Deployment, Cicd, ApiHubPremium, DevOpsPremium, InfraPremium, ObservabilityPremium } from "./category-07-devops";
import { AnalyticsPremium as _AP, ReportingPremium as _RP, SEOPremium as _SP, SocialPremium as _SoP, MarketingPremium as _MP2, MarketIntelPremium, DataLakePremium, GovernancePremium } from "./category-08-analytics";
import { Analytics, Reporting, SEO, Marketing, Social } from "./category-05-analytics-premium";
void [_AP, _RP, _SP, _SoP, _MP2];
import { SOCPremium, FraudPremium, ForensicsPremium, IAMPremium as _IP, UserRolesPremium as _URP, BiometricPremium as _BP, MDMPremium as _MP, RemoteAccessPremium as _RAP } from "./category-09-security";
void [_IP, _URP, _BP, _MP, _RAP];
import { Leads, DocumentFactory, DisasterRecovery, Compliance, Revenue } from "./category-missing";
import { Achievements } from "./category-10-achievements-premium";

type Comp = ComponentType<{ d: DashSpec }>;

export const REGISTRY: Record<string, Comp> = {
  "command-center": CommandCenter,
  "alerts": Alerts,
  "observability": ObservabilityPremium,
  "soc": SOCPremium,
  "fraud": FraudPremium,
  "forensics": ForensicsPremium,
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
  "gamification": Achievements,
  "achievements": Achievements,
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
  "social": Social, "marketing": Marketing, "seo": SEO,
  "analytics": Analytics, "reporting": Reporting,
  "leads": Leads, "document-factory": DocumentFactory,
  "disaster-recovery": DisasterRecovery, "compliance": Compliance, "revenue": Revenue,
  "iot-drones": IoTDrones, "smart-city": SmartCity, "energy": Energy,
  "satellite": Satellite, "robotics": Robotics,
  "healthcare": Healthcare, "education": Education, "legal": Legal,
  "research-quantum": Quantum, "sandbox": Sandbox, "metaverse": Metaverse, "blockchain": Blockchain,
};

export function resolveDashboard(slug: string): Comp {
  return REGISTRY[slug] ?? DashboardView;
}
