import {
  Factory, BarChart3, GraduationCap, Stethoscope, ShoppingCart, Briefcase,
  BrainCircuit, Workflow, Banknote, HardHat, Truck, Hotel, Home, Scale,
  Landmark, Sparkles, HeartHandshake, Cpu, ShieldCheck, TrendingUp,
  Headset, KeyRound, Heart, Award, Globe2,
  // extended library for per-product thumbnails
  BookOpen, School, Library, Presentation, PenTool, Palette, Calculator,
  FlaskConical, Microscope, Atom, Beaker, TestTube, Dna, Activity,
  Syringe, Pill, Ambulance, Bandage, Baby, Bone, Brain, Ear, Eye,
  Building2, Store, ShoppingBag, Package, Boxes, Receipt, CreditCard,
  Wallet, Coins, PiggyBank, LineChart, PieChart, TrendingDown, DollarSign,
  Wrench, Hammer, Ruler, Cog, Gauge, Zap, Fuel, Anchor, Ship, Plane,
  Bus, Car, Bike, Train, MapPin, Map, Navigation, Compass, Route,
  UtensilsCrossed, Coffee, Wine, Pizza, IceCream, Cake, ChefHat,
  Shirt, Scissors, Gem, Camera, Music, Film, Mic, Radio, Tv,
  Wifi, Signal, Server, Database, Cloud, HardDrive, Terminal, Code2,
  Bot, Wand2, Lightbulb, Rocket, Target, Trophy, Flag, Star,
  Users, User, UserCircle, UsersRound, Contact, MessageSquare, Mail,
  Phone, Calendar, Clock, Bell, Search, Settings, Sliders, Filter,
  FileText, ClipboardList, Folder, Archive, Bookmark, Tag, Tags,
  Leaf, Trees, Sprout, Sun, Droplet, Wind, Mountain, Flower,
  Dog, Cat, Bird, Fish, Rabbit,
  Gavel, ScrollText, FileSignature, ShieldAlert, Lock, Fingerprint,
  Megaphone, Volume2, Newspaper, BookMarked, Bookmark as Ribbon,
  Dumbbell, Trees as Park, Tent, Palmtree, MapPinned,
  Warehouse, Container, Forklift, PackageCheck, PackageSearch,
  Bed, BedDouble, Bath, Sofa, DoorOpen, Utensils, WashingMachine,
  Church, Cross, Sparkle,
  Cpu as ChipIcon, Layers, Boxes as BoxIcon,
} from "lucide-react";

/* eslint-disable @typescript-eslint/no-explicit-any */
const map: Record<string, any> = {
  Factory, BarChart3, GraduationCap, Stethoscope, ShoppingCart, Briefcase,
  BrainCircuit, Workflow, Banknote, HardHat, Truck, Hotel, Home, Scale,
  Landmark, Sparkles, HeartHandshake, Cpu, ShieldCheck, TrendingUp,
  Headset, KeyRound, Heart, Award, Globe2,
  BookOpen, School, Library, Presentation, PenTool, Palette, Calculator,
  FlaskConical, Microscope, Atom, Beaker, TestTube, Dna, Activity,
  Syringe, Pill, Ambulance, Bandage, Baby, Bone, Brain, Ear, Eye,
  Building2, Store, ShoppingBag, Package, Boxes, Receipt, CreditCard,
  Wallet, Coins, PiggyBank, LineChart, PieChart, TrendingDown, DollarSign,
  Wrench, Hammer, Ruler, Cog, Gauge, Zap, Fuel, Anchor, Ship, Plane,
  Bus, Car, Bike, Train, MapPin, Map, Navigation, Compass, Route,
  UtensilsCrossed, Coffee, Wine, Pizza, IceCream, Cake, ChefHat,
  Shirt, Scissors, Gem, Camera, Music, Film, Mic, Radio, Tv,
  Wifi, Signal, Server, Database, Cloud, HardDrive, Terminal, Code2,
  Bot, Wand2, Lightbulb, Rocket, Target, Trophy, Flag, Star,
  Users, User, UserCircle, UsersRound, Contact, MessageSquare, Mail,
  Phone, Calendar, Clock, Bell, Search, Settings, Sliders, Filter,
  FileText, ClipboardList, Folder, Archive, Bookmark, Tag, Tags,
  Leaf, Trees, Sprout, Sun, Droplet, Wind, Mountain, Flower,
  Dog, Cat, Bird, Fish, Rabbit,
  Gavel, ScrollText, FileSignature, ShieldAlert, Lock, Fingerprint,
  Megaphone, Volume2, Newspaper, BookMarked,
  Dumbbell, Tent, Palmtree, MapPinned,
  Warehouse, Container, Forklift, PackageCheck, PackageSearch,
  Bed, BedDouble, Bath, Sofa, DoorOpen, Utensils, WashingMachine,
  Church, Cross, Sparkle, Layers,
};

export function resolveIcon(name: string | null | undefined) {
  if (!name) return Briefcase;
  return map[name] ?? Briefcase;
}

/**
 * Keyword → icon rules. First keyword hit wins.
 * Order matters: put more specific words first (e.g. "pharmacy" before "hospital").
 */
const KEYWORD_ICON: Array<[RegExp, any]> = [
  // education
  [/coach|tutor|tuition|classroom|kinder|preschool|nursery/i, Presentation],
  [/exam|quiz|test|assessment|grading|result/i, ClipboardList],
  [/library|book|library|reading|catalog/i, Library],
  [/lms|learning|e-?learning|course|study|training/i, BookOpen],
  [/school|college|university|campus|academy|institute/i, School],
  [/attend|roll|register/i, Contact],
  [/art|paint|design|creative/i, Palette],
  [/math|calc|account/i, Calculator],
  [/science|lab|research/i, FlaskConical],
  // healthcare
  [/pharma|pharmacy|drug|medicine|prescription/i, Pill],
  [/dental|dentist|tooth/i, Sparkle],
  [/vet|animal|pet/i, Dog],
  [/ambul|emergency|trauma|er /i, Ambulance],
  [/lab|diagnostic|patholog|radiolog/i, Microscope],
  [/clinic|opd|doctor|physician|surgery|surgeon/i, Stethoscope],
  [/hospital|ward|icu|nursing/i, Cross],
  [/mental|therapy|counsel/i, Brain],
  [/child|baby|pediatric|maternity/i, Baby],
  [/fitness|gym|workout|yoga|trainer/i, Dumbbell],
  // retail / commerce
  [/pos |point of sale|cashier|billing counter/i, Receipt],
  [/grocery|super ?market|kirana|mart/i, ShoppingCart],
  [/fashion|apparel|cloth|garment|boutique|tailor/i, Shirt],
  [/salon|beauty|spa|barber/i, Scissors],
  [/jewel|gold|diamond|ornament/i, Gem],
  [/electronic|mobile shop|gadget/i, Tv],
  [/pharm/i, Pill],
  [/restaurant|cafe|coffee|bistro|dine|food court|kitchen/i, UtensilsCrossed],
  [/bakery|cake|dessert|pastry/i, Cake],
  [/bar|wine|beverage|drink/i, Wine],
  [/inventory|stock|warehouse|godown/i, Warehouse],
  [/ecommerce|e-?shop|online store|marketplace/i, Store],
  // finance
  [/insur|policy|claim|underwriting/i, ShieldCheck],
  [/loan|lending|credit|nbfc|microfinance/i, Coins],
  [/bank|banking/i, Landmark],
  [/wallet|upi|payment|payout/i, Wallet],
  [/invest|trading|stock|broker|portfolio/i, LineChart],
  [/tax|gst|vat|invoice/i, Receipt],
  [/account|ledger|book ?keep|finance|erp/i, BarChart3],
  // construction / manufacturing
  [/architect|blueprint|drawing|cad/i, Ruler],
  [/civil|contractor|site|project/i, HardHat],
  [/machin|factory|assembly|plant|mill/i, Factory],
  [/quality|qc|qa/i, ShieldCheck],
  [/maintenance|repair|service center|workshop/i, Wrench],
  [/energy|power|utility|electric/i, Zap],
  [/oil|gas|fuel|refinery/i, Fuel],
  // transport / logistics
  [/fleet|vehicle|dispatch|driver/i, Truck],
  [/taxi|cab|ride|uber/i, Car],
  [/bus|route|transit/i, Bus],
  [/train|rail|metro/i, Train],
  [/ship|port|marine|cargo vessel/i, Ship],
  [/air|aviation|flight|plane|airline/i, Plane],
  [/cour|delivery|last mile|parcel/i, PackageCheck],
  [/logistic|freight|supply chain|3pl/i, Container],
  [/warehouse|wms/i, Warehouse],
  [/gps|track|route|navig/i, MapPinned],
  // hotel / travel
  [/hotel|resort|inn|guest ?house/i, BedDouble],
  [/booking|reservation/i, Calendar],
  [/travel|tour|itinerary|holiday|trip/i, Palmtree],
  [/event|banquet|wedding|conference|expo/i, Tent],
  [/spa|wellness/i, Sparkles],
  // government
  [/tax|revenue|customs|excise/i, Receipt],
  [/court|judg|legal|advocate|lawyer|litig/i, Gavel],
  [/police|law enforce|crime|cop/i, ShieldAlert],
  [/defense|army|military|navy/i, ShieldCheck],
  [/passport|visa|immigration|border/i, ScrollText],
  [/municipal|corporation|panchayat|ward/i, Landmark],
  [/election|voter|polling/i, Flag],
  [/certificate|permit|license/i, FileSignature],
  // legal / professional services
  [/agency|studio|creative|marketing|brand/i, Megaphone],
  [/consult|advisor|coach|mentor/i, Briefcase],
  [/hr|payroll|recruit|talent|attendance/i, Users],
  [/crm|lead|sales pipeline|deal/i, TrendingUp],
  [/support|helpdesk|ticket|call center/i, Headset],
  [/document|dms|file manage/i, FileText],
  [/signature|contract|agreement/i, FileSignature],
  // real estate / rental
  [/broker|realtor|property|real ?estate|listing/i, Home],
  [/rental|lease|tenant/i, KeyRound],
  [/facility|building|society|apartment/i, Building2],
  // religion / ngo / agri
  [/temple|church|mosque|religion|worship|donation|charity/i, Church],
  [/ngo|non-?profit|volunteer|fundrais/i, HeartHandshake],
  [/farm|agri|crop|dairy|poult|livestock/i, Sprout],
  [/water|irrig/i, Droplet],
  // media / telecom
  [/broadcast|tv|radio|streaming|ott/i, Tv],
  [/podcast|audio|music/i, Music],
  [/news|editor|publish|magazine/i, Newspaper],
  [/telecom|isp|network|carrier/i, Signal],
  // ai / tech
  [/chatbot|assistant|copilot|agent/i, Bot],
  [/ml|model|neural|deep ?learning|prediction/i, BrainCircuit],
  [/vision|ocr|image|face/i, Camera],
  [/voice|speech|tts|stt/i, Mic],
  [/data|analytic|bi|dashboard|report/i, BarChart3],
  [/cyber|security|firewall|siem|threat/i, ShieldCheck],
  [/cloud|saas|hosting/i, Cloud],
  [/server|infra|devops|kubernetes|docker/i, Server],
  [/api|integration|webhook/i, Code2],
  [/automation|workflow|rpa/i, Workflow],
  // generic fallbacks
  [/dashboard|admin|panel|console/i, Sliders],
  [/mobile|app|ios|android/i, Cpu],
  [/website|portal|cms/i, Globe2],
  [/message|chat|inbox|email/i, MessageSquare],
];




export function pickProductIcon(name: string, fallback?: string) {
  for (const [rx, Icon] of KEYWORD_ICON) {
    if (rx.test(name)) return Icon;
  }
  return resolveIcon(fallback);
}
