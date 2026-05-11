import type { ComponentType } from "react";
import type { DashSpec } from "@/data/dashboards";
import { DashboardView } from "@/components/DashboardView";

import { CommandCenter, Alerts, Observability, GeoMonitoring, NOC, Backup, Licenses, MDM, RemoteAccess, Infra, CloudOps, Printing, OSControl } from "./operations";
import { IAM, UserRoles, SOC, Fraud, Forensics, Biometric } from "./security";
import { CRM, SalesPipeline, Billing, Payments, Accounting, Subscriptions, MarketIntel } from "./revenue";
import { Support, Comms, VoiceAI, Gamification, CustomerSuccess, Onboarding } from "./customer";
import { HR, Payroll } from "./people";
import { Projects, Workflows, Knowledge, Files, SearchPalette, BrowserWS, DesignSystem, Broadcast } from "./workspace";
import { Analytics, Reporting, AICopilot, DigitalTwin, WarRoom, MasterControl, DevOps, Repos, APIHub, AppBuilder, DataLake, Governance, KnowledgeGraph, Marketplace, Franchise, Inventory, SupplyChain, Procurement, Social, Marketing, SEO, IoTDrones, SmartCity, Energy, Satellite, Robotics, Healthcare, Education, Legal, Quantum, Sandbox, Metaverse, Blockchain } from "./extras";

type Comp = ComponentType<{ d: DashSpec }>;

export const REGISTRY: Record<string, Comp> = {
  "command-center": CommandCenter,
  "alerts": Alerts,
  "observability": Observability,
  "geo-monitoring": GeoMonitoring,
  "noc": NOC,
  "backup": Backup,
  "licenses": Licenses,
  "mdm": MDM,
  "remote-access": RemoteAccess,
  "infra": Infra,
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
  "market-intel": MarketIntel,
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
  "analytics": Analytics, "reporting": Reporting, "ai-copilot": AICopilot,
  "digital-twin": DigitalTwin, "war-room": WarRoom, "master-control": MasterControl,
  "devops": DevOps, "repos": Repos, "api-hub": APIHub, "app-builder": AppBuilder,
  "data-lake": DataLake, "governance": Governance, "knowledge-graph": KnowledgeGraph,
  "marketplace": Marketplace, "franchise": Franchise, "inventory": Inventory,
  "supply-chain": SupplyChain, "procurement": Procurement,
  "social": Social, "marketing": Marketing, "seo": SEO,
  "iot-drones": IoTDrones, "smart-city": SmartCity, "energy": Energy,
  "satellite": Satellite, "robotics": Robotics,
  "healthcare": Healthcare, "education": Education, "legal": Legal,
  "research-quantum": Quantum, "sandbox": Sandbox, "metaverse": Metaverse, "blockchain": Blockchain,
};

export function resolveDashboard(slug: string): Comp {
  return REGISTRY[slug] ?? DashboardView;
}
