import { ChevronRight } from "lucide-react";
import type { MotifKey } from "@/data/marketplace-catalog";
import { pickProductIcon } from "@/lib/marketplace-icons";
import indEducation from "@/assets/ind-education.jpg";
import indHealthcare from "@/assets/ind-healthcare.jpg";
import indRetail from "@/assets/ind-retail.jpg";
import indManufacturing from "@/assets/ind-manufacturing.jpg";
import indConstruction from "@/assets/ind-construction.jpg";
import indHotel from "@/assets/ind-hotel.jpg";
import indTransport from "@/assets/ind-transport.jpg";
import indFinance from "@/assets/ind-finance.jpg";
import indNgo from "@/assets/ind-ngo.jpg";
import indRealestate from "@/assets/ind-realestate.jpg";
import indLegal from "@/assets/ind-legal.jpg";
import indGovernment from "@/assets/ind-government.jpg";

/**
 * Premium product thumbnail — keeps the same crisp photo quality as the
 * "Shop by industry" cards, but the visual language changes by the actual
 * software/profession: school, tuition, clinic, pharmacy, POS, fleet,
 * legal, salon, gym, farming, factory, AI, etc. No category gets one reused
 * thumbnail treatment for every product.
 */

const MOTIF_IMAGE: Record<MotifKey, string> = {
  school: indEducation, lms: indEducation,
  hospital: indHealthcare, pharma: indHealthcare, vet: indHealthcare,
  retail: indRetail, commerce: indRetail, restaurant: indHotel,
  finance: indFinance, insurance: indFinance,
  construction: indConstruction, manufacturing: indManufacturing,
  warehouse: indManufacturing, logistics: indTransport, auto: indTransport,
  travel: indHotel, event: indHotel,
  government: indGovernment, publicgov: indGovernment, defense: indGovernment,
  admin: indLegal, services: indLegal, specialty: indLegal,
  agriculture: indNgo, religion: indNgo, rental: indRealestate,
  beauty: indRetail, fitness: indRetail,
  media: indEducation, telecom: indTransport,
  ai: indManufacturing,
};

function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

type SceneKind =
  | "school-erp" | "school-analytics" | "parent-mobile" | "kids-learning" | "academy" | "scholarship" | "campus"
  | "lms" | "coaching" | "tuition" | "technical" | "agri-training" | "livestock" | "coding" | "language" | "art" | "music" | "dance" | "fire" | "driving" | "sports" | "martial" | "internship"
  | "hospital" | "clinic" | "maternity" | "mental" | "pharmacy" | "dental" | "ent" | "ortho" | "oncology" | "dialysis" | "hearing" | "pediatric" | "rehab" | "nutrition" | "palliative" | "lab" | "radiology" | "research" | "vet" | "pet" | "optical" | "blood-bank"
  | "retail" | "supermarket" | "kirana" | "vegetable" | "hardware" | "warehouse" | "payments" | "restaurant" | "fast-food" | "chai" | "juice" | "food-truck" | "tiffin" | "cafe" | "bakery" | "sweets" | "icecream" | "hotel" | "resort"
  | "bank" | "wallet" | "remittance" | "atm" | "accounting" | "audit" | "tax" | "loan" | "fund" | "debt" | "gold-trade" | "trading" | "crypto" | "insurance" | "risk"
  | "construction" | "bridge" | "site" | "civil" | "real-estate" | "rental" | "architecture" | "roofing" | "flooring" | "painting" | "plumbing" | "ac-service"
  | "fleet" | "logistics" | "shipping" | "ride" | "travel" | "trek" | "ferry" | "bike" | "car" | "garage" | "rto" | "fuel"
  | "election" | "political" | "government" | "legal" | "patent" | "ngo" | "cooperative" | "religion" | "defense" | "aerospace" | "robotics" | "security" | "identity" | "vault"
  | "salon" | "spa" | "wellness" | "hair" | "beauty-crm" | "gym" | "yoga" | "stadium"
  | "farm" | "crop" | "poultry" | "dairy" | "factory" | "production" | "workshop" | "planning"
  | "ai-builder" | "ai-assistant" | "admin" | "dashboard" | "commerce" | "marketplace" | "shopify" | "creator" | "studio" | "design" | "book" | "photo" | "video" | "event" | "wedding" | "tent" | "cinema" | "laundry" | "print" | "specialty" | "telecom" | "network" | "facility" | "water" | "solar" | "gas";

type SceneSpec = {
  kind: SceneKind;
  label: string;
  image: string;
  tone: [string, string];
  widget: "dashboard" | "calendar" | "ledger" | "pos" | "medical" | "learning" | "map" | "workflow" | "security" | "creative" | "facility";
  chips: [string, string, string];
};

const scenes: Record<SceneKind, SceneSpec> = {
  "school-erp": { kind: "school-erp", label: "School ERP", image: indEducation, tone: ["oklch(0.80 0.16 235)", "oklch(0.70 0.18 290)"], widget: "dashboard", chips: ["Fees", "Exams", "Attendance"] },
  "school-analytics": { kind: "school-analytics", label: "School BI", image: indEducation, tone: ["oklch(0.78 0.17 215)", "oklch(0.86 0.16 95)"], widget: "dashboard", chips: ["KPIs", "Rank", "Reports"] },
  "parent-mobile": { kind: "parent-mobile", label: "Parent App", image: indEducation, tone: ["oklch(0.72 0.18 250)", "oklch(0.76 0.16 160)"], widget: "calendar", chips: ["Chat", "Bus", "Homework"] },
  "kids-learning": { kind: "kids-learning", label: "Kids Learning", image: indEducation, tone: ["oklch(0.86 0.17 95)", "oklch(0.70 0.24 305)"], widget: "learning", chips: ["Stories", "Games", "Stars"] },
  academy: { kind: "academy", label: "Academy", image: indEducation, tone: ["oklch(0.68 0.22 305)", "oklch(0.82 0.15 230)"], widget: "calendar", chips: ["Batches", "Fees", "Progress"] },
  scholarship: { kind: "scholarship", label: "Scholar Hub", image: indEducation, tone: ["oklch(0.82 0.15 240)", "oklch(0.86 0.17 95)"], widget: "ledger", chips: ["Merit", "Aid", "Abroad"] },
  campus: { kind: "campus", label: "Campus Ops", image: indEducation, tone: ["oklch(0.76 0.14 190)", "oklch(0.66 0.16 260)"], widget: "map", chips: ["Hostel", "Route", "Life"] },
  lms: { kind: "lms", label: "LMS", image: indEducation, tone: ["oklch(0.70 0.22 300)", "oklch(0.78 0.15 220)"], widget: "learning", chips: ["Courses", "Quiz", "Certs"] },
  coaching: { kind: "coaching", label: "Coaching", image: indEducation, tone: ["oklch(0.78 0.17 75)", "oklch(0.70 0.22 305)"], widget: "calendar", chips: ["Tests", "Batches", "Ranks"] },
  tuition: { kind: "tuition", label: "Tuition", image: indEducation, tone: ["oklch(0.80 0.14 180)", "oklch(0.68 0.18 260)"], widget: "learning", chips: ["Tutor", "Slots", "Fees"] },
  technical: { kind: "technical", label: "Technical", image: indManufacturing, tone: ["oklch(0.78 0.13 210)", "oklch(0.77 0.16 75)"], widget: "workflow", chips: ["Trades", "Lab", "Skills"] },
  "agri-training": { kind: "agri-training", label: "Agri Training", image: indNgo, tone: ["oklch(0.76 0.17 145)", "oklch(0.84 0.14 85)"], widget: "learning", chips: ["Fields", "Crops", "Batches"] },
  livestock: { kind: "livestock", label: "Livestock", image: indNgo, tone: ["oklch(0.78 0.14 135)", "oklch(0.72 0.12 55)"], widget: "medical", chips: ["Herd", "Vaccine", "Feed"] },
  coding: { kind: "coding", label: "Coding", image: indManufacturing, tone: ["oklch(0.78 0.18 230)", "oklch(0.70 0.22 305)"], widget: "workflow", chips: ["IDE", "Projects", "Jobs"] },
  language: { kind: "language", label: "Language", image: indEducation, tone: ["oklch(0.82 0.13 200)", "oklch(0.80 0.15 95)"], widget: "learning", chips: ["Levels", "Voice", "Fluency"] },
  art: { kind: "art", label: "Art Studio", image: indEducation, tone: ["oklch(0.82 0.17 35)", "oklch(0.70 0.22 305)"], widget: "creative", chips: ["Canvas", "Color", "Portfolios"] },
  music: { kind: "music", label: "Music", image: indHotel, tone: ["oklch(0.74 0.18 300)", "oklch(0.84 0.16 75)"], widget: "creative", chips: ["Recitals", "Lessons", "Tracks"] },
  dance: { kind: "dance", label: "Dance", image: indHotel, tone: ["oklch(0.72 0.22 335)", "oklch(0.84 0.15 80)"], widget: "calendar", chips: ["Routines", "Stage", "Batches"] },
  fire: { kind: "fire", label: "Fire Academy", image: indGovernment, tone: ["oklch(0.68 0.23 30)", "oklch(0.86 0.16 80)"], widget: "security", chips: ["Drills", "Safety", "Crew"] },
  driving: { kind: "driving", label: "Driving", image: indTransport, tone: ["oklch(0.78 0.13 215)", "oklch(0.85 0.14 85)"], widget: "map", chips: ["Slots", "Road", "Tests"] },
  sports: { kind: "sports", label: "Sports", image: indHotel, tone: ["oklch(0.76 0.17 150)", "oklch(0.82 0.16 80)"], widget: "dashboard", chips: ["Teams", "Matches", "Coach"] },
  martial: { kind: "martial", label: "Dojo", image: indHotel, tone: ["oklch(0.72 0.16 25)", "oklch(0.90 0.05 90)"], widget: "calendar", chips: ["Belts", "Classes", "Ranks"] },
  internship: { kind: "internship", label: "Internships", image: indLegal, tone: ["oklch(0.76 0.13 220)", "oklch(0.78 0.14 145)"], widget: "workflow", chips: ["Roles", "Mentor", "Offer"] },
  hospital: { kind: "hospital", label: "Hospital", image: indHealthcare, tone: ["oklch(0.76 0.15 170)", "oklch(0.74 0.14 205)"], widget: "medical", chips: ["OPD", "IPD", "EMR"] },
  clinic: { kind: "clinic", label: "Clinic", image: indHealthcare, tone: ["oklch(0.78 0.14 180)", "oklch(0.73 0.14 220)"], widget: "calendar", chips: ["Queue", "Rx", "Billing"] },
  maternity: { kind: "maternity", label: "Maternity", image: indHealthcare, tone: ["oklch(0.82 0.12 350)", "oklch(0.78 0.14 170)"], widget: "medical", chips: ["ANC", "Baby", "Care"] },
  mental: { kind: "mental", label: "Therapy", image: indHealthcare, tone: ["oklch(0.72 0.12 250)", "oklch(0.76 0.13 165)"], widget: "calendar", chips: ["Sessions", "Mood", "Notes"] },
  pharmacy: { kind: "pharmacy", label: "Pharmacy", image: indHealthcare, tone: ["oklch(0.78 0.15 30)", "oklch(0.74 0.16 350)"], widget: "pos", chips: ["Rx", "Stock", "Expiry"] },
  dental: { kind: "dental", label: "Dental", image: indHealthcare, tone: ["oklch(0.84 0.10 200)", "oklch(0.72 0.12 255)"], widget: "medical", chips: ["Charts", "X-Ray", "Chair"] },
  ent: { kind: "ent", label: "ENT", image: indHealthcare, tone: ["oklch(0.76 0.13 210)", "oklch(0.70 0.16 260)"], widget: "medical", chips: ["Ear", "Nose", "Throat"] },
  ortho: { kind: "ortho", label: "Ortho", image: indHealthcare, tone: ["oklch(0.78 0.11 230)", "oklch(0.72 0.11 40)"], widget: "medical", chips: ["Bones", "Surgery", "Rehab"] },
  oncology: { kind: "oncology", label: "Oncology", image: indHealthcare, tone: ["oklch(0.70 0.16 320)", "oklch(0.76 0.13 190)"], widget: "medical", chips: ["Cycles", "Chemo", "Care"] },
  dialysis: { kind: "dialysis", label: "Dialysis", image: indHealthcare, tone: ["oklch(0.74 0.13 215)", "oklch(0.78 0.14 170)"], widget: "medical", chips: ["Chair", "Vitals", "Shifts"] },
  hearing: { kind: "hearing", label: "Audiology", image: indHealthcare, tone: ["oklch(0.74 0.13 260)", "oklch(0.78 0.12 200)"], widget: "medical", chips: ["Audio", "Tests", "Aids"] },
  pediatric: { kind: "pediatric", label: "Pediatric", image: indHealthcare, tone: ["oklch(0.86 0.14 85)", "oklch(0.80 0.12 340)"], widget: "medical", chips: ["Growth", "Vaccine", "Care"] },
  rehab: { kind: "rehab", label: "Rehab", image: indHealthcare, tone: ["oklch(0.76 0.15 150)", "oklch(0.72 0.12 220)"], widget: "medical", chips: ["Therapy", "Plan", "Progress"] },
  nutrition: { kind: "nutrition", label: "Nutrition", image: indHealthcare, tone: ["oklch(0.80 0.16 120)", "oklch(0.84 0.14 75)"], widget: "dashboard", chips: ["Diet", "Macros", "Goals"] },
  palliative: { kind: "palliative", label: "Palliative", image: indHealthcare, tone: ["oklch(0.74 0.12 255)", "oklch(0.76 0.12 145)"], widget: "medical", chips: ["Home", "Pain", "Support"] },
  lab: { kind: "lab", label: "Lab", image: indHealthcare, tone: ["oklch(0.76 0.13 195)", "oklch(0.72 0.16 280)"], widget: "medical", chips: ["Samples", "LIMS", "Reports"] },
  radiology: { kind: "radiology", label: "Imaging", image: indHealthcare, tone: ["oklch(0.72 0.11 240)", "oklch(0.80 0.10 200)"], widget: "medical", chips: ["Scan", "PACS", "Report"] },
  research: { kind: "research", label: "Research", image: indHealthcare, tone: ["oklch(0.70 0.13 265)", "oklch(0.78 0.14 185)"], widget: "workflow", chips: ["Trials", "Data", "Audit"] },
  vet: { kind: "vet", label: "Veterinary", image: indHealthcare, tone: ["oklch(0.76 0.15 135)", "oklch(0.78 0.12 60)"], widget: "medical", chips: ["Pets", "Vaccine", "Cases"] },
  pet: { kind: "pet", label: "Pet Care", image: indRetail, tone: ["oklch(0.82 0.13 80)", "oklch(0.76 0.15 140)"], widget: "pos", chips: ["Groom", "Food", "Visits"] },
  optical: { kind: "optical", label: "Optical", image: indRetail, tone: ["oklch(0.80 0.12 220)", "oklch(0.74 0.16 300)"], widget: "pos", chips: ["Lenses", "Frame", "Rx"] },
  "blood-bank": { kind: "blood-bank", label: "Blood Bank", image: indHealthcare, tone: ["oklch(0.65 0.22 25)", "oklch(0.82 0.12 80)"], widget: "medical", chips: ["Donors", "Units", "Match"] },
  retail: { kind: "retail", label: "Retail POS", image: indRetail, tone: ["oklch(0.82 0.17 85)", "oklch(0.68 0.20 45)"], widget: "pos", chips: ["Counter", "Stock", "Bill"] },
  supermarket: { kind: "supermarket", label: "Supermarket", image: indRetail, tone: ["oklch(0.82 0.15 105)", "oklch(0.76 0.16 55)"], widget: "pos", chips: ["Scale", "Aisles", "Offers"] },
  kirana: { kind: "kirana", label: "Kirana", image: indRetail, tone: ["oklch(0.86 0.15 80)", "oklch(0.76 0.13 35)"], widget: "ledger", chips: ["Udhar", "Bill", "Stock"] },
  vegetable: { kind: "vegetable", label: "Sabzi POS", image: indRetail, tone: ["oklch(0.76 0.18 130)", "oklch(0.84 0.15 80)"], widget: "pos", chips: ["Weight", "Fresh", "Cash"] },
  hardware: { kind: "hardware", label: "Hardware", image: indConstruction, tone: ["oklch(0.72 0.12 65)", "oklch(0.70 0.10 235)"], widget: "pos", chips: ["Tools", "Parts", "Ledger"] },
  warehouse: { kind: "warehouse", label: "Warehouse", image: indManufacturing, tone: ["oklch(0.76 0.12 210)", "oklch(0.78 0.14 75)"], widget: "workflow", chips: ["Bins", "Stock", "Dispatch"] },
  payments: { kind: "payments", label: "Payments", image: indFinance, tone: ["oklch(0.78 0.15 145)", "oklch(0.82 0.14 85)"], widget: "ledger", chips: ["UPI", "Payout", "QR"] },
  restaurant: { kind: "restaurant", label: "Restaurant", image: indHotel, tone: ["oklch(0.80 0.14 55)", "oklch(0.70 0.17 30)"], widget: "pos", chips: ["Tables", "Kitchen", "KOT"] },
  "fast-food": { kind: "fast-food", label: "Fast Food", image: indHotel, tone: ["oklch(0.82 0.17 60)", "oklch(0.68 0.20 30)"], widget: "pos", chips: ["Queue", "Combo", "Pickup"] },
  chai: { kind: "chai", label: "Chai Counter", image: indHotel, tone: ["oklch(0.70 0.12 55)", "oklch(0.84 0.15 85)"], widget: "pos", chips: ["Cups", "Cash", "Rush"] },
  juice: { kind: "juice", label: "Juice Bar", image: indHotel, tone: ["oklch(0.78 0.17 140)", "oklch(0.86 0.15 75)"], widget: "pos", chips: ["Fresh", "Menu", "Takeaway"] },
  "food-truck": { kind: "food-truck", label: "Food Truck", image: indTransport, tone: ["oklch(0.80 0.16 75)", "oklch(0.70 0.18 30)"], widget: "map", chips: ["Route", "Menu", "Orders"] },
  tiffin: { kind: "tiffin", label: "Tiffin", image: indHotel, tone: ["oklch(0.78 0.13 85)", "oklch(0.72 0.16 145)"], widget: "calendar", chips: ["Meals", "Delivery", "Plan"] },
  cafe: { kind: "cafe", label: "Café", image: indHotel, tone: ["oklch(0.68 0.11 60)", "oklch(0.78 0.12 35)"], widget: "pos", chips: ["Barista", "Tables", "Beans"] },
  bakery: { kind: "bakery", label: "Bakery", image: indHotel, tone: ["oklch(0.84 0.12 65)", "oklch(0.76 0.12 25)"], widget: "pos", chips: ["Cakes", "Oven", "Orders"] },
  sweets: { kind: "sweets", label: "Mithai", image: indHotel, tone: ["oklch(0.86 0.16 90)", "oklch(0.74 0.16 35)"], widget: "pos", chips: ["Kg", "Boxes", "Festive"] },
  icecream: { kind: "icecream", label: "Ice Cream", image: indHotel, tone: ["oklch(0.86 0.11 335)", "oklch(0.76 0.14 200)"], widget: "pos", chips: ["Scoops", "Flavors", "POS"] },
  hotel: { kind: "hotel", label: "Hotel", image: indHotel, tone: ["oklch(0.76 0.12 75)", "oklch(0.68 0.13 245)"], widget: "calendar", chips: ["Rooms", "Guests", "Front Desk"] },
  resort: { kind: "resort", label: "Resort", image: indHotel, tone: ["oklch(0.74 0.14 155)", "oklch(0.82 0.13 85)"], widget: "calendar", chips: ["Villa", "Spa", "Bookings"] },
  bank: { kind: "bank", label: "Banking", image: indFinance, tone: ["oklch(0.74 0.13 220)", "oklch(0.80 0.15 95)"], widget: "ledger", chips: ["Core", "KYC", "Ledger"] },
  wallet: { kind: "wallet", label: "Wallet", image: indFinance, tone: ["oklch(0.78 0.15 145)", "oklch(0.78 0.16 220)"], widget: "ledger", chips: ["QR", "Balance", "Payout"] },
  remittance: { kind: "remittance", label: "Remittance", image: indFinance, tone: ["oklch(0.76 0.14 225)", "oklch(0.82 0.14 85)"], widget: "map", chips: ["FX", "Send", "Track"] },
  atm: { kind: "atm", label: "ATM", image: indFinance, tone: ["oklch(0.70 0.12 250)", "oklch(0.76 0.14 190)"], widget: "security", chips: ["Cash", "Uptime", "Vault"] },
  accounting: { kind: "accounting", label: "Accounting", image: indFinance, tone: ["oklch(0.76 0.12 215)", "oklch(0.82 0.14 90)"], widget: "ledger", chips: ["Ledger", "GST", "P&L"] },
  audit: { kind: "audit", label: "Audit", image: indFinance, tone: ["oklch(0.72 0.12 235)", "oklch(0.82 0.12 80)"], widget: "security", chips: ["Checks", "Risk", "Trail"] },
  tax: { kind: "tax", label: "Tax", image: indFinance, tone: ["oklch(0.80 0.13 80)", "oklch(0.72 0.13 220)"], widget: "ledger", chips: ["GST", "VAT", "Returns"] },
  loan: { kind: "loan", label: "Loans", image: indFinance, tone: ["oklch(0.78 0.14 155)", "oklch(0.76 0.15 90)"], widget: "workflow", chips: ["Score", "EMI", "Approve"] },
  fund: { kind: "fund", label: "Funds", image: indFinance, tone: ["oklch(0.76 0.14 145)", "oklch(0.78 0.14 85)"], widget: "ledger", chips: ["Trust", "Members", "Payout"] },
  debt: { kind: "debt", label: "Debt", image: indFinance, tone: ["oklch(0.70 0.14 30)", "oklch(0.76 0.13 220)"], widget: "workflow", chips: ["Dues", "Recovery", "Risk"] },
  "gold-trade": { kind: "gold-trade", label: "Gold Trade", image: indFinance, tone: ["oklch(0.86 0.17 95)", "oklch(0.70 0.12 55)"], widget: "ledger", chips: ["Gold", "Rates", "Inventory"] },
  trading: { kind: "trading", label: "Trading", image: indFinance, tone: ["oklch(0.78 0.15 145)", "oklch(0.68 0.20 30)"], widget: "dashboard", chips: ["Charts", "Signals", "PnL"] },
  crypto: { kind: "crypto", label: "Crypto AI", image: indFinance, tone: ["oklch(0.74 0.18 275)", "oklch(0.82 0.16 90)"], widget: "dashboard", chips: ["Wallet", "AI", "Risk"] },
  insurance: { kind: "insurance", label: "Insurance", image: indFinance, tone: ["oklch(0.72 0.14 225)", "oklch(0.78 0.14 145)"], widget: "security", chips: ["Policy", "Claim", "KYC"] },
  risk: { kind: "risk", label: "Risk", image: indFinance, tone: ["oklch(0.72 0.16 30)", "oklch(0.72 0.14 230)"], widget: "security", chips: ["Controls", "Score", "Audit"] },
  construction: { kind: "construction", label: "Construction", image: indConstruction, tone: ["oklch(0.78 0.15 70)", "oklch(0.70 0.10 230)"], widget: "workflow", chips: ["Site", "BOQ", "Crew"] },
  bridge: { kind: "bridge", label: "Bridge", image: indConstruction, tone: ["oklch(0.74 0.11 220)", "oklch(0.80 0.15 75)"], widget: "workflow", chips: ["Span", "Civil", "QA"] },
  site: { kind: "site", label: "Site Ops", image: indConstruction, tone: ["oklch(0.80 0.16 80)", "oklch(0.70 0.11 230)"], widget: "calendar", chips: ["Tasks", "Crew", "Material"] },
  civil: { kind: "civil", label: "Civil", image: indConstruction, tone: ["oklch(0.76 0.12 220)", "oklch(0.82 0.14 75)"], widget: "workflow", chips: ["Plans", "Tender", "QA"] },
  "real-estate": { kind: "real-estate", label: "Real Estate", image: indRealestate, tone: ["oklch(0.76 0.12 230)", "oklch(0.80 0.13 85)"], widget: "map", chips: ["Leads", "Units", "Deals"] },
  rental: { kind: "rental", label: "Rental", image: indRealestate, tone: ["oklch(0.74 0.13 210)", "oklch(0.76 0.13 95)"], widget: "calendar", chips: ["Tenant", "Lease", "Rent"] },
  architecture: { kind: "architecture", label: "Design", image: indConstruction, tone: ["oklch(0.78 0.11 235)", "oklch(0.84 0.11 80)"], widget: "creative", chips: ["CAD", "Plans", "Renders"] },
  roofing: { kind: "roofing", label: "Roofing", image: indConstruction, tone: ["oklch(0.72 0.11 45)", "oklch(0.75 0.12 225)"], widget: "facility", chips: ["Roof", "Quote", "Crew"] },
  flooring: { kind: "flooring", label: "Flooring", image: indConstruction, tone: ["oklch(0.74 0.10 60)", "oklch(0.76 0.10 230)"], widget: "facility", chips: ["Tiles", "Area", "Install"] },
  painting: { kind: "painting", label: "Painting", image: indConstruction, tone: ["oklch(0.76 0.16 35)", "oklch(0.70 0.19 300)"], widget: "creative", chips: ["Color", "Walls", "Jobs"] },
  plumbing: { kind: "plumbing", label: "Plumbing", image: indConstruction, tone: ["oklch(0.74 0.13 210)", "oklch(0.76 0.13 155)"], widget: "facility", chips: ["Calls", "Parts", "Jobs"] },
  "ac-service": { kind: "ac-service", label: "AC Service", image: indConstruction, tone: ["oklch(0.78 0.13 205)", "oklch(0.80 0.12 95)"], widget: "facility", chips: ["Service", "AMC", "Tech"] },
  fleet: { kind: "fleet", label: "Fleet", image: indTransport, tone: ["oklch(0.76 0.14 220)", "oklch(0.82 0.14 85)"], widget: "map", chips: ["GPS", "Drivers", "Fuel"] },
  logistics: { kind: "logistics", label: "Logistics", image: indTransport, tone: ["oklch(0.76 0.13 210)", "oklch(0.78 0.14 75)"], widget: "workflow", chips: ["Freight", "3PL", "POD"] },
  shipping: { kind: "shipping", label: "Shipping", image: indTransport, tone: ["oklch(0.72 0.13 220)", "oklch(0.78 0.13 185)"], widget: "map", chips: ["Port", "Cargo", "ETA"] },
  ride: { kind: "ride", label: "Ride", image: indTransport, tone: ["oklch(0.82 0.16 85)", "oklch(0.70 0.14 225)"], widget: "map", chips: ["Trips", "Drivers", "Fare"] },
  travel: { kind: "travel", label: "Travel", image: indHotel, tone: ["oklch(0.76 0.14 185)", "oklch(0.84 0.14 85)"], widget: "calendar", chips: ["Visa", "Tours", "Agents"] },
  trek: { kind: "trek", label: "Trekking", image: indHotel, tone: ["oklch(0.72 0.15 145)", "oklch(0.80 0.13 85)"], widget: "map", chips: ["Trail", "Camp", "Guide"] },
  ferry: { kind: "ferry", label: "Ferry", image: indTransport, tone: ["oklch(0.74 0.13 215)", "oklch(0.78 0.14 185)"], widget: "map", chips: ["Dock", "Tickets", "Trips"] },
  bike: { kind: "bike", label: "Bike", image: indTransport, tone: ["oklch(0.76 0.15 30)", "oklch(0.74 0.12 220)"], widget: "pos", chips: ["Models", "Jobs", "Parts"] },
  car: { kind: "car", label: "Car Dealer", image: indTransport, tone: ["oklch(0.74 0.12 220)", "oklch(0.86 0.14 85)"], widget: "pos", chips: ["Stock", "Leads", "Service"] },
  garage: { kind: "garage", label: "Garage", image: indTransport, tone: ["oklch(0.72 0.12 55)", "oklch(0.72 0.12 225)"], widget: "workflow", chips: ["Jobs", "Parts", "Bay"] },
  rto: { kind: "rto", label: "RTO", image: indGovernment, tone: ["oklch(0.76 0.13 220)", "oklch(0.82 0.14 85)"], widget: "ledger", chips: ["Forms", "Permit", "Tax"] },
  fuel: { kind: "fuel", label: "Fuel", image: indTransport, tone: ["oklch(0.78 0.14 85)", "oklch(0.68 0.17 35)"], widget: "pos", chips: ["Pumps", "Shift", "Stock"] },
  election: { kind: "election", label: "Election", image: indGovernment, tone: ["oklch(0.76 0.14 225)", "oklch(0.86 0.15 85)"], widget: "dashboard", chips: ["Booths", "Votes", "War Room"] },
  political: { kind: "political", label: "Political", image: indGovernment, tone: ["oklch(0.72 0.15 30)", "oklch(0.76 0.13 225)"], widget: "map", chips: ["Cadre", "Wards", "Campaign"] },
  government: { kind: "government", label: "Government", image: indGovernment, tone: ["oklch(0.74 0.13 220)", "oklch(0.80 0.14 85)"], widget: "workflow", chips: ["Citizen", "Files", "Portal"] },
  legal: { kind: "legal", label: "Legal", image: indLegal, tone: ["oklch(0.72 0.12 240)", "oklch(0.82 0.13 85)"], widget: "ledger", chips: ["Cases", "Hearing", "Docs"] },
  patent: { kind: "patent", label: "Patent", image: indLegal, tone: ["oklch(0.76 0.13 220)", "oklch(0.80 0.13 85)"], widget: "security", chips: ["IP", "Filing", "Claims"] },
  ngo: { kind: "ngo", label: "NGO", image: indNgo, tone: ["oklch(0.76 0.15 145)", "oklch(0.84 0.13 85)"], widget: "workflow", chips: ["Donors", "Aid", "Impact"] },
  cooperative: { kind: "cooperative", label: "Cooperative", image: indNgo, tone: ["oklch(0.76 0.14 145)", "oklch(0.78 0.13 85)"], widget: "ledger", chips: ["Members", "Savings", "Loans"] },
  religion: { kind: "religion", label: "Faith", image: indNgo, tone: ["oklch(0.78 0.13 80)", "oklch(0.70 0.13 255)"], widget: "calendar", chips: ["Events", "Donations", "Study"] },
  defense: { kind: "defense", label: "Defense", image: indGovernment, tone: ["oklch(0.66 0.10 145)", "oklch(0.70 0.10 230)"], widget: "security", chips: ["Ops", "Intel", "Secure"] },
  aerospace: { kind: "aerospace", label: "Aerospace", image: indManufacturing, tone: ["oklch(0.72 0.13 230)", "oklch(0.78 0.12 200)"], widget: "dashboard", chips: ["Flight", "Parts", "QA"] },
  robotics: { kind: "robotics", label: "Robotics", image: indManufacturing, tone: ["oklch(0.76 0.13 215)", "oklch(0.76 0.14 300)"], widget: "workflow", chips: ["Bots", "Tasks", "Control"] },
  security: { kind: "security", label: "Security", image: indGovernment, tone: ["oklch(0.70 0.16 30)", "oklch(0.72 0.12 230)"], widget: "security", chips: ["Guard", "Scan", "Alert"] },
  identity: { kind: "identity", label: "Identity", image: indGovernment, tone: ["oklch(0.74 0.13 220)", "oklch(0.78 0.14 150)"], widget: "security", chips: ["KYC", "Verify", "Access"] },
  vault: { kind: "vault", label: "Vault", image: indGovernment, tone: ["oklch(0.68 0.11 250)", "oklch(0.78 0.13 85)"], widget: "security", chips: ["Keys", "Files", "Audit"] },
  salon: { kind: "salon", label: "Salon", image: indRetail, tone: ["oklch(0.78 0.16 340)", "oklch(0.82 0.13 80)"], widget: "calendar", chips: ["Chairs", "Staff", "Booking"] },
  spa: { kind: "spa", label: "Spa", image: indHotel, tone: ["oklch(0.76 0.12 155)", "oklch(0.78 0.12 85)"], widget: "calendar", chips: ["Rooms", "Therapy", "Packages"] },
  wellness: { kind: "wellness", label: "Wellness", image: indHealthcare, tone: ["oklch(0.76 0.14 150)", "oklch(0.78 0.12 210)"], widget: "dashboard", chips: ["Vitals", "Plan", "Goals"] },
  hair: { kind: "hair", label: "Hair Salon", image: indRetail, tone: ["oklch(0.74 0.13 330)", "oklch(0.72 0.11 60)"], widget: "calendar", chips: ["Stylist", "Color", "Slots"] },
  "beauty-crm": { kind: "beauty-crm", label: "Beauty CRM", image: indRetail, tone: ["oklch(0.78 0.16 335)", "oklch(0.76 0.13 85)"], widget: "dashboard", chips: ["Clients", "Offers", "Billing"] },
  gym: { kind: "gym", label: "Gym", image: indHotel, tone: ["oklch(0.76 0.15 145)", "oklch(0.78 0.15 80)"], widget: "dashboard", chips: ["Members", "Plans", "Trainers"] },
  yoga: { kind: "yoga", label: "Yoga", image: indHotel, tone: ["oklch(0.76 0.13 155)", "oklch(0.82 0.11 80)"], widget: "calendar", chips: ["Classes", "Breath", "Plans"] },
  stadium: { kind: "stadium", label: "Stadium", image: indHotel, tone: ["oklch(0.74 0.15 145)", "oklch(0.80 0.13 85)"], widget: "dashboard", chips: ["Seats", "Events", "Crowd"] },
  farm: { kind: "farm", label: "Farm", image: indNgo, tone: ["oklch(0.75 0.17 135)", "oklch(0.84 0.14 85)"], widget: "dashboard", chips: ["Fields", "Input", "Yield"] },
  crop: { kind: "crop", label: "Crop", image: indNgo, tone: ["oklch(0.76 0.18 125)", "oklch(0.82 0.14 80)"], widget: "calendar", chips: ["Sowing", "Spray", "Harvest"] },
  poultry: { kind: "poultry", label: "Poultry", image: indNgo, tone: ["oklch(0.80 0.14 80)", "oklch(0.72 0.13 35)"], widget: "dashboard", chips: ["Flock", "Feed", "Eggs"] },
  dairy: { kind: "dairy", label: "Dairy", image: indNgo, tone: ["oklch(0.84 0.09 220)", "oklch(0.74 0.14 140)"], widget: "pos", chips: ["Milk", "Route", "Fat"] },
  factory: { kind: "factory", label: "Factory", image: indManufacturing, tone: ["oklch(0.76 0.12 215)", "oklch(0.82 0.14 80)"], widget: "workflow", chips: ["Line", "QC", "Output"] },
  production: { kind: "production", label: "Production", image: indManufacturing, tone: ["oklch(0.78 0.13 205)", "oklch(0.78 0.15 75)"], widget: "dashboard", chips: ["Plan", "Batch", "OEE"] },
  workshop: { kind: "workshop", label: "Workshop", image: indManufacturing, tone: ["oklch(0.72 0.12 55)", "oklch(0.76 0.11 220)"], widget: "workflow", chips: ["Jobs", "Tools", "Parts"] },
  planning: { kind: "planning", label: "Planning", image: indManufacturing, tone: ["oklch(0.78 0.13 215)", "oklch(0.70 0.15 300)"], widget: "dashboard", chips: ["MRP", "Capacity", "Orders"] },
  "ai-builder": { kind: "ai-builder", label: "AI Builder", image: indManufacturing, tone: ["oklch(0.76 0.17 250)", "oklch(0.70 0.22 305)"], widget: "workflow", chips: ["Prompt", "Deploy", "AI"] },
  "ai-assistant": { kind: "ai-assistant", label: "AI Assistant", image: indManufacturing, tone: ["oklch(0.78 0.16 225)", "oklch(0.72 0.22 300)"], widget: "dashboard", chips: ["Chat", "Help", "Tasks"] },
  admin: { kind: "admin", label: "Admin", image: indLegal, tone: ["oklch(0.74 0.13 225)", "oklch(0.72 0.16 285)"], widget: "dashboard", chips: ["Users", "Roles", "Settings"] },
  dashboard: { kind: "dashboard", label: "Dashboard", image: indFinance, tone: ["oklch(0.78 0.15 220)", "oklch(0.72 0.18 300)"], widget: "dashboard", chips: ["KPIs", "Charts", "Live"] },
  commerce: { kind: "commerce", label: "Commerce", image: indRetail, tone: ["oklch(0.80 0.15 95)", "oklch(0.70 0.20 305)"], widget: "pos", chips: ["Orders", "Cart", "Stock"] },
  marketplace: { kind: "marketplace", label: "Marketplace", image: indRetail, tone: ["oklch(0.80 0.15 90)", "oklch(0.72 0.18 300)"], widget: "dashboard", chips: ["Vendors", "Listings", "Sales"] },
  shopify: { kind: "shopify", label: "Shopify", image: indRetail, tone: ["oklch(0.76 0.17 135)", "oklch(0.78 0.15 95)"], widget: "pos", chips: ["Store", "Orders", "Apps"] },
  creator: { kind: "creator", label: "Creator", image: indLegal, tone: ["oklch(0.76 0.16 310)", "oklch(0.82 0.14 80)"], widget: "creative", chips: ["Content", "Fans", "Revenue"] },
  studio: { kind: "studio", label: "Studio", image: indLegal, tone: ["oklch(0.74 0.16 300)", "oklch(0.78 0.12 220)"], widget: "creative", chips: ["Jobs", "Crew", "Assets"] },
  design: { kind: "design", label: "Design", image: indConstruction, tone: ["oklch(0.78 0.16 25)", "oklch(0.70 0.20 305)"], widget: "creative", chips: ["Canvas", "Mockups", "Assets"] },
  book: { kind: "book", label: "Book", image: indEducation, tone: ["oklch(0.76 0.12 70)", "oklch(0.72 0.13 230)"], widget: "learning", chips: ["Catalog", "Readers", "Issues"] },
  photo: { kind: "photo", label: "Photo", image: indLegal, tone: ["oklch(0.72 0.14 250)", "oklch(0.82 0.15 80)"], widget: "creative", chips: ["Shoots", "Albums", "Clients"] },
  video: { kind: "video", label: "Video", image: indLegal, tone: ["oklch(0.70 0.16 25)", "oklch(0.72 0.18 300)"], widget: "creative", chips: ["Edit", "Crew", "Deliver"] },
  event: { kind: "event", label: "Event", image: indHotel, tone: ["oklch(0.80 0.15 80)", "oklch(0.72 0.18 300)"], widget: "calendar", chips: ["Guests", "Vendors", "Stage"] },
  wedding: { kind: "wedding", label: "Wedding", image: indHotel, tone: ["oklch(0.82 0.13 350)", "oklch(0.86 0.15 90)"], widget: "calendar", chips: ["Couple", "Decor", "Guests"] },
  tent: { kind: "tent", label: "Tent", image: indHotel, tone: ["oklch(0.78 0.13 80)", "oklch(0.72 0.15 35)"], widget: "facility", chips: ["Inventory", "Crew", "Booking"] },
  cinema: { kind: "cinema", label: "Cinema", image: indHotel, tone: ["oklch(0.70 0.16 25)", "oklch(0.82 0.15 85)"], widget: "pos", chips: ["Shows", "Seats", "Tickets"] },
  laundry: { kind: "laundry", label: "Laundry", image: indRealestate, tone: ["oklch(0.76 0.12 205)", "oklch(0.74 0.13 155)"], widget: "workflow", chips: ["Pickup", "Wash", "Deliver"] },
  print: { kind: "print", label: "Print", image: indRetail, tone: ["oklch(0.78 0.14 220)", "oklch(0.78 0.16 35)"], widget: "workflow", chips: ["Jobs", "Press", "Delivery"] },
  specialty: { kind: "specialty", label: "Specialty", image: indRetail, tone: ["oklch(0.80 0.14 85)", "oklch(0.74 0.15 300)"], widget: "pos", chips: ["Counter", "Stock", "Customers"] },
  telecom: { kind: "telecom", label: "Telecom", image: indTransport, tone: ["oklch(0.76 0.14 220)", "oklch(0.72 0.15 170)"], widget: "map", chips: ["Towers", "Plans", "Billing"] },
  network: { kind: "network", label: "Network", image: indTransport, tone: ["oklch(0.74 0.16 215)", "oklch(0.72 0.16 165)"], widget: "dashboard", chips: ["Nodes", "Uptime", "Alerts"] },
  facility: { kind: "facility", label: "Facility", image: indRealestate, tone: ["oklch(0.76 0.12 220)", "oklch(0.74 0.13 95)"], widget: "facility", chips: ["Assets", "AMC", "Tickets"] },
  water: { kind: "water", label: "Water", image: indNgo, tone: ["oklch(0.76 0.13 205)", "oklch(0.78 0.15 155)"], widget: "dashboard", chips: ["Meters", "Flow", "Billing"] },
  solar: { kind: "solar", label: "Solar", image: indConstruction, tone: ["oklch(0.84 0.16 85)", "oklch(0.74 0.13 210)"], widget: "dashboard", chips: ["Panels", "Energy", "AMC"] },
  gas: { kind: "gas", label: "Gas", image: indTransport, tone: ["oklch(0.80 0.14 85)", "oklch(0.68 0.16 30)"], widget: "pos", chips: ["Cylinders", "Route", "Stock"] },
};

const rules: Array<[RegExp, SceneKind]> = [
  [/montessori|kindergarten|kids|play|wonder|primary|little|pediatric/i, "kids-learning"], [/intelligence|insight|analytics|dashboard|kpi|report/i, "school-analytics"], [/cues|parent|mobile|companion/i, "parent-mobile"], [/scholar|abroad|scholarship/i, "scholarship"], [/hostel|campus|harmony/i, "campus"], [/academy|institute|nurture/i, "academy"], [/school|edu/i, "school-erp"],
  [/competitive|exam|jee|neet|upsc|coaching|test series/i, "coaching"], [/tuition|tutor/i, "tuition"], [/technical|industrial training|iti|vocational|skill/i, "technical"], [/agricultural training/i, "agri-training"], [/livestock/i, "livestock"], [/coding|programming|bootcamp/i, "coding"], [/spoken english|language/i, "language"], [/art|drawing/i, "art"], [/music/i, "music"], [/dance/i, "dance"], [/fire/i, "fire"], [/driving/i, "driving"], [/cricket|sports|match|stadium/i, "sports"], [/dojo|martial/i, "martial"], [/internship/i, "internship"], [/lms|learning|course|training|learn/i, "lms"],
  [/blood bank/i, "blood-bank"], [/pharmacy|pharma|chemist|medicalstock|rx|prescription/i, "pharmacy"], [/dental/i, "dental"], [/\bent\b/i, "ent"], [/ortho/i, "ortho"], [/oncology|cancer/i, "oncology"], [/dialysis/i, "dialysis"], [/hearing|audio/i, "hearing"], [/maternity|bloom|baby/i, "maternity"], [/mental|therapy|counsel|serenity|mindful|calm/i, "mental"], [/rehab|physio|post op/i, "rehab"], [/nutri|diet/i, "nutrition"], [/palliative|hospice/i, "palliative"], [/radiology|scan|imaging|optical|vision|eye/i, "optical"], [/lab|scientific|research|clinical vault/i, "lab"], [/research|trial/i, "research"], [/vet|animal/i, "vet"], [/pet|paws/i, "pet"], [/clinic|opd|patient|health|hospital|care|vital/i, "clinic"],
  [/super ?market/i, "supermarket"], [/kirana/i, "kirana"], [/sabzi|vegetable|fruit/i, "vegetable"], [/hardware|tools/i, "hardware"], [/godown|warehouse|stock|inventory/i, "warehouse"], [/pay|wallet|counter connect|offlinepay/i, "payments"], [/restaurant|resto|food flow|feast/i, "restaurant"], [/fast food/i, "fast-food"], [/chai/i, "chai"], [/juice/i, "juice"], [/food truck/i, "food-truck"], [/tiffin/i, "tiffin"], [/café|cafe|coffee/i, "cafe"], [/bakery|cake/i, "bakery"], [/sweet|mithai/i, "sweets"], [/ice cream|scoop/i, "icecream"], [/hotel|guest|hospitality/i, "hotel"], [/resort/i, "resort"], [/retail|pos|storefront|merchant|order/i, "retail"],
  [/bank|banking/i, "bank"], [/wallet|currency|pocket pay/i, "wallet"], [/send|remittance|global send/i, "remittance"], [/atm/i, "atm"], [/account|ledger|notary ledger|guide ledger/i, "accounting"], [/audit/i, "audit"], [/tax|gst/i, "tax"], [/loan|credit|nbfc|scout/i, "loan"], [/fund|trust|pension/i, "fund"], [/debt/i, "debt"], [/gold|silver/i, "gold-trade"], [/trader|trade|invest|mql|binary/i, "trading"], [/crypto/i, "crypto"], [/policy|insurance|claim/i, "insurance"], [/risk|compliance/i, "risk"],
  [/bridge/i, "bridge"], [/site|project pro/i, "site"], [/civil/i, "civil"], [/estate|property|broker/i, "real-estate"], [/rent|lease/i, "rental"], [/design|archi|exterior|cad/i, "architecture"], [/roof/i, "roofing"], [/floor/i, "flooring"], [/paint/i, "painting"], [/plumb/i, "plumbing"], [/\bac\b|air condition/i, "ac-service"], [/construction|build/i, "construction"],
  [/fleet|vehicle/i, "fleet"], [/logis|cargo|dispatch|delivery|distribution/i, "logistics"], [/ship|port|freight/i, "shipping"], [/ola|ride|taxi/i, "ride"], [/passport|visa|travel|agent|tour/i, "travel"], [/trek|camp/i, "trek"], [/ferry|boat|yacht/i, "ferry"], [/bike/i, "bike"], [/car dealer|car |auto parts/i, "car"], [/garage|workshop|service management/i, "garage"], [/rto|roadworthy/i, "rto"], [/cng|fuel|forecourt|gas/i, "fuel"],
  [/election/i, "election"], [/party|campaign|mla|poli/i, "political"], [/subsidy|public|citizen|governance|government/i, "government"], [/legal|diamond legal|law|court/i, "legal"], [/patent/i, "patent"], [/ngo|aid|grant|charity|trust software/i, "ngo"], [/cooperative|shg|savings/i, "cooperative"], [/bible|quran|temple|ummah|pandit|religious|donation|community/i, "religion"], [/defense|policy hub enterprise/i, "defense"], [/aerospace|star command/i, "aerospace"], [/robot/i, "robotics"], [/security|guard|seal/i, "security"], [/authenti|identity|scan/i, "identity"], [/vault|nano/i, "vault"],
  [/salon|parlour/i, "salon"], [/spa/i, "spa"], [/wellness/i, "wellness"], [/hair|stylist/i, "hair"], [/beauty|billing|appointment|crm/i, "beauty-crm"], [/gym|fitness|trainer|membership/i, "gym"], [/yoga/i, "yoga"],
  [/crop|krishi/i, "crop"], [/poultry/i, "poultry"], [/dairy|milk/i, "dairy"], [/farm|agri/i, "farm"], [/production/i, "production"], [/workshop/i, "workshop"], [/planning|resource/i, "planning"], [/factory|manufacturing|industrial|erp/i, "factory"],
  [/site studio|ai site|builder/i, "ai-builder"], [/assistant|companion|copilot|helpful ai/i, "ai-assistant"], [/admin|panel|stellar|opulence|forge/i, "admin"], [/dashboard|pivot|command center|insight/i, "dashboard"], [/shopify/i, "shopify"], [/marketplace|saas vala|launchpad/i, "marketplace"], [/commerce|e-?commerce|storefront|order/i, "commerce"],
  [/creator/i, "creator"], [/studio|agency/i, "studio"], [/photo/i, "photo"], [/video|production manager/i, "video"], [/book|library|adventure/i, "book"], [/event|banquet|catering|guest/i, "event"], [/wedding/i, "wedding"], [/tent|decor|hall/i, "tent"], [/cinema|box office/i, "cinema"], [/laundry|dhobi/i, "laundry"], [/print|jobregister|job register/i, "print"], [/telecom|isp|internet/i, "telecom"], [/network|monitoring/i, "network"], [/facility|building|asset|maintenance/i, "facility"], [/water/i, "water"], [/solar/i, "solar"], [/gas register/i, "gas"], [/fancy|saree|aroma|watch|toy|flower|furniture|stationery|counter/i, "specialty"],
];

function pickScene(text: string, motif: MotifKey): SceneSpec {
  for (const [rx, key] of rules) if (rx.test(text)) return scenes[key];
  const fallback: Partial<Record<MotifKey, SceneKind>> = {
    school: "school-erp", lms: "lms", hospital: "hospital", pharma: "pharmacy",
    vet: "vet", retail: "retail", commerce: "commerce", restaurant: "restaurant",
    finance: "accounting", insurance: "insurance", construction: "construction",
    manufacturing: "factory", warehouse: "warehouse", logistics: "logistics",
    auto: "garage", travel: "travel", event: "event", government: "government",
    publicgov: "government", defense: "defense", admin: "admin", services: "facility",
    specialty: "specialty", agriculture: "farm", religion: "religion", rental: "rental",
    beauty: "salon", fitness: "gym", media: "studio", telecom: "telecom", ai: "ai-assistant",
  };
  return scenes[fallback[motif] ?? "dashboard"];
}

function Widget({ spec, seed }: { spec: SceneSpec; seed: number }) {
  const [a, b] = spec.tone;
  if (spec.widget === "pos") {
    return (
      <div className="space-y-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2, 3, 4, 5].map((n) => <span key={n} className="h-5 rounded bg-white/16" />)}
        </div>
        <div className="h-8 rounded bg-white/12 p-1.5"><div className="h-full rounded" style={{ background: `linear-gradient(90deg, ${a}, ${b})` }} /></div>
      </div>
    );
  }
  if (spec.widget === "medical") {
    return (
      <div className="grid grid-cols-[1fr_36px] gap-2 items-center">
        <div className="space-y-1.5">{[72, 48, 64].map((w) => <span key={w} className="block h-1.5 rounded-full bg-white/22" style={{ width: `${w}%` }} />)}</div>
        <div className="relative h-9 rounded-full bg-white/14"><span className="absolute left-1/2 top-1 -ml-0.5 h-7 w-1 rounded bg-white/60" /><span className="absolute top-1/2 left-1 -mt-0.5 h-1 w-7 rounded bg-white/60" /></div>
      </div>
    );
  }
  if (spec.widget === "map") {
    return (
      <div className="relative h-16 overflow-hidden rounded-lg bg-white/10">
        <div className="absolute inset-0 opacity-40" style={{ backgroundImage: `linear-gradient(45deg, transparent 46%, ${a} 48%, ${a} 52%, transparent 54%), linear-gradient(-35deg, transparent 46%, ${b} 48%, ${b} 52%, transparent 54%)`, backgroundSize: "44px 36px" }} />
        {[18, 50, 78].map((x, i) => <span key={x} className="absolute h-2.5 w-2.5 rounded-full ring-2 ring-white/50" style={{ left: `${x}%`, top: `${24 + ((seed >> i) % 18)}%`, background: i === 1 ? b : a }} />)}
      </div>
    );
  }
  if (spec.widget === "calendar") {
    return (
      <div className="grid grid-cols-4 gap-1.5">
        {Array.from({ length: 8 }).map((_, n) => <span key={n} className="h-4 rounded bg-white/14" style={{ opacity: n === seed % 8 ? 0.9 : 0.45 }} />)}
      </div>
    );
  }
  if (spec.widget === "ledger") {
    return (
      <div className="space-y-1.5">
        {[82, 58, 72, 46].map((w, n) => <div key={w} className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: n % 2 ? b : a }} /><span className="h-1.5 rounded-full bg-white/24" style={{ width: `${w}%` }} /></div>)}
      </div>
    );
  }
  if (spec.widget === "learning") {
    return (
      <div className="grid grid-cols-[42px_1fr] gap-2 items-center">
        <div className="h-12 rounded-md bg-white/14 border border-white/15" style={{ boxShadow: `inset 4px 0 0 ${a}` }} />
        <div className="space-y-1.5"><span className="block h-2 rounded bg-white/26" /><span className="block h-2 rounded bg-white/18 w-3/4" /><span className="block h-2 rounded bg-white/14 w-1/2" /></div>
      </div>
    );
  }
  if (spec.widget === "security") {
    return (
      <div className="grid grid-cols-[44px_1fr] gap-2 items-center">
        <div className="h-12 rounded-xl bg-white/12 grid place-items-center"><div className="h-7 w-6 rounded-b-lg rounded-t-sm border-2 border-white/50" /></div>
        <div className="space-y-1.5"><span className="block h-2 rounded bg-white/24 w-4/5" /><span className="block h-2 rounded bg-white/16 w-3/5" /><span className="block h-2 rounded" style={{ background: `linear-gradient(90deg, ${a}, ${b})`, width: "70%" }} /></div>
      </div>
    );
  }
  if (spec.widget === "creative") {
    return (
      <div className="grid grid-cols-3 gap-1.5">
        <span className="col-span-2 h-10 rounded bg-white/14" /><span className="h-10 rounded" style={{ background: `linear-gradient(135deg, ${a}, ${b})` }} />
        <span className="h-4 rounded bg-white/20" /><span className="col-span-2 h-4 rounded bg-white/12" />
      </div>
    );
  }
  if (spec.widget === "facility" || spec.widget === "workflow") {
    return (
      <div className="flex items-center gap-1.5">
        {[0, 1, 2].map((n) => <div key={n} className="flex-1 h-12 rounded-lg border border-white/12 bg-white/10 p-1.5"><span className="block h-2 w-2 rounded-full" style={{ background: n % 2 ? b : a }} /><span className="mt-2 block h-1.5 rounded bg-white/18" /><span className="mt-1 block h-1.5 w-2/3 rounded bg-white/12" /></div>)}
      </div>
    );
  }
  return (
    <div className="flex items-end gap-1.5 h-16">
      {[34, 52, 24, 62, 44].map((height, n) => <span key={n} className="flex-1 rounded-t" style={{ height: `${height + ((seed >> n) % 10)}px`, background: n % 2 ? b : a, opacity: 0.72 }} />)}
    </div>
  );
}

type Props = {
  name: string;
  description?: string;
  slug: string;
  palette: [string, string];
  motif: MotifKey;
  className?: string;
  categoryLabel?: string;
  iconName?: string;
};

export function PremiumThumbnail({
  name, description, slug, palette, motif, className, categoryLabel, iconName,
}: Props) {
  const [c1, c2] = palette;
  const scene = pickScene(`${name} ${description ?? ""}`, motif);
  const img = scene.image ?? MOTIF_IMAGE[motif] ?? indEducation;
  const Icon = pickProductIcon(name, iconName);
  const h = hash(slug);

  // Vary focal point so identical images look different across products.
  const focals = [
    "object-center", "object-top", "object-bottom",
    "object-[30%_40%]", "object-[70%_35%]", "object-[45%_65%]",
    "object-[25%_55%]", "object-[75%_60%]",
  ];
  const focal = focals[h % focals.length];
  const angle = 115 + (h % 45);
  const panelSide = h % 2 === 0 ? "left-4" : "right-4";

  // Silence unused-var warnings for props kept in the signature.
  void categoryLabel; void name; void ChevronRight;

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`} aria-hidden="true">
      {/* Photograph */}
      <img
        src={img}
        alt=""
        loading="lazy"
        width={800}
        height={480}
        className={`absolute inset-0 h-full w-full object-cover ${focal} scale-105 transition-transform duration-700 group-hover:scale-115`}
      />

      {/* Profession-specific cinematic wash — lighter for a brighter, premium feel */}
      <div
        className="absolute inset-0 opacity-35 mix-blend-soft-light"
        style={{ background: `linear-gradient(${angle}deg, ${scene.tone[0]} 0%, transparent 55%, ${scene.tone[1]} 100%)` }}
      />

      {/* Subtle top highlight for reflective premium sheen */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, oklch(1 0 0 / 0.10) 0%, transparent 30%, transparent 70%, oklch(0.10 0.04 270 / 0.35) 100%)",
        }}
      />

      {/* Palette accent — thin gradient bar */}
      <div
        className="absolute inset-x-0 top-0 h-[2px] opacity-90"
        style={{ background: `linear-gradient(90deg, ${scene.tone[0]}, ${c1}, ${c2}, ${scene.tone[1]})` }}
      />

      {/* Product icon watermark — pure artwork, no glass boxes */}
      <div className="absolute bottom-3 right-3 h-9 w-9 rounded-lg grid place-items-center"
           style={{ background: `linear-gradient(135deg, ${scene.tone[0]}, ${scene.tone[1]})`, boxShadow: "0 6px 18px oklch(0 0 0 / 0.35), inset 0 1px 0 oklch(1 0 0 / 0.25)" }}>
        <Icon className="h-4.5 w-4.5 text-white drop-shadow" strokeWidth={1.7} />
      </div>
      {/* silence unused refs kept for API compatibility */}
      <span className="hidden">{panelSide}<Widget spec={scene} seed={h} /></span>
    </div>
  );
}
