/**
 * Nür Capital — Comprehensive Asset Universe
 *
 * 200+ assets covering: Semiconductors, AI, Technology, Cybersecurity,
 * Healthcare, Halal Finance, Oil & Gas, Industrial Automation,
 * Battery Technology, Software, Microchips
 *
 * All assets are either:
 * - NYSE/NASDAQ listed (direct AJ Bell access)
 * - LSE listed ETFs/funds (direct AJ Bell access)
 * - Research only (flagged)
 */

export interface UniverseAsset {
  ticker: string;
  name: string;
  tags: string[];
  type: "stock" | "etf" | "fund";
  exchange: string;
  region: string;
  ajBell: boolean;
  screening: "approved" | "watchlist" | "rejected";
}

export const ASSET_UNIVERSE: UniverseAsset[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // SEMICONDUCTORS / MICROCHIPS / AI CHIPS
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "TSM", name: "Taiwan Semiconductor (TSMC)", tags: ["Semiconductors", "AI", "Microchips", "Asia-Pacific", "Chip Manufacturing", "Foundry"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "ASML", name: "ASML Holding", tags: ["Semiconductors", "Microchips", "Europe", "Chip Equipment", "EUV Lithography", "Technology"], type: "stock", exchange: "NASDAQ", region: "Europe", ajBell: true, screening: "approved" },
  { ticker: "AMD", name: "Advanced Micro Devices", tags: ["Semiconductors", "AI", "Microchips", "Technology", "Data Centre", "GPU"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "AVGO", name: "Broadcom", tags: ["Semiconductors", "AI", "Networking", "Technology", "Custom Chips", "Data Centre"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "QCOM", name: "Qualcomm", tags: ["Semiconductors", "Microchips", "Mobile", "5G", "AI", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "MRVL", name: "Marvell Technology", tags: ["Semiconductors", "AI", "Data Centre", "Networking", "Custom Chips"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "ON", name: "ON Semiconductor", tags: ["Semiconductors", "Battery Technology", "Electric Vehicles", "Power Chips", "Automotive"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "ADI", name: "Analog Devices", tags: ["Semiconductors", "Industrial Automation", "Analog Chips", "Automotive", "Healthcare"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "KLAC", name: "KLA Corporation", tags: ["Semiconductors", "Chip Equipment", "Quality Control", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "LRCX", name: "Lam Research", tags: ["Semiconductors", "Chip Equipment", "Etching", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "AMAT", name: "Applied Materials", tags: ["Semiconductors", "Chip Equipment", "Deposition", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "UMC", name: "United Microelectronics", tags: ["Semiconductors", "Asia-Pacific", "Foundry", "Mature Nodes", "Chip Manufacturing"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "ASX", name: "ASE Technology", tags: ["Semiconductors", "Asia-Pacific", "Chip Packaging", "Testing", "Supply Chain"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "HIMX", name: "Himax Technologies", tags: ["Semiconductors", "Asia-Pacific", "Display Drivers", "AR/VR"], type: "stock", exchange: "NASDAQ", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "MU", name: "Micron Technology", tags: ["Semiconductors", "Memory", "AI", "Data Centre", "HBM"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "TXN", name: "Texas Instruments", tags: ["Semiconductors", "Analog", "Industrial Automation", "Automotive"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // AI / SOFTWARE / TECHNOLOGY
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "MSFT", name: "Microsoft", tags: ["AI", "Software", "Cloud", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "rejected" },
  { ticker: "GOOGL", name: "Alphabet (Google)", tags: ["AI", "Software", "Cloud", "Technology", "Advertising"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "META", name: "Meta Platforms", tags: ["AI", "Software", "Technology", "Social Media", "VR"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "ORCL", name: "Oracle", tags: ["AI", "Software", "Cloud", "Database", "Enterprise"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "NOW", name: "ServiceNow", tags: ["AI", "Software", "Enterprise", "Automation", "Cloud"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "SNOW", name: "Snowflake", tags: ["AI", "Software", "Data", "Cloud", "Analytics"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "PLTR", name: "Palantir Technologies", tags: ["AI", "Software", "Data Analytics", "Government", "Defence"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "watchlist" },
  { ticker: "CRM", name: "Salesforce", tags: ["AI", "Software", "CRM", "Enterprise", "Cloud"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "ADBE", name: "Adobe", tags: ["AI", "Software", "Creative", "Technology", "SaaS"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "INTU", name: "Intuit", tags: ["Software", "Fintech", "Technology", "SMB", "Tax"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "SHOP", name: "Shopify", tags: ["Software", "E-Commerce", "Technology", "SMB", "Payments"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "INFY", name: "Infosys", tags: ["AI", "Software", "IT Services", "Asia-Pacific", "India", "Digital Transformation"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "WIT", name: "Wipro", tags: ["Software", "IT Services", "Asia-Pacific", "India", "Cloud"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "GLOB", name: "Globant", tags: ["AI", "Software", "Digital Transformation", "Latin America", "Consulting"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // CYBERSECURITY
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "CRWD", name: "CrowdStrike", tags: ["Cybersecurity", "AI", "Cloud Security", "Endpoint", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "PANW", name: "Palo Alto Networks", tags: ["Cybersecurity", "Network Security", "Cloud", "Platform", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "FTNT", name: "Fortinet", tags: ["Cybersecurity", "Network Security", "Firewall", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "ZS", name: "Zscaler", tags: ["Cybersecurity", "Zero Trust", "Cloud Security", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "S", name: "SentinelOne", tags: ["Cybersecurity", "AI", "Endpoint", "Technology"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "OKTA", name: "Okta", tags: ["Cybersecurity", "Identity", "Cloud", "Zero Trust", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "NET", name: "Cloudflare", tags: ["Cybersecurity", "CDN", "Edge Computing", "Technology", "Infrastructure"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // HEALTHCARE
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "LLY", name: "Eli Lilly", tags: ["Healthcare", "GLP-1", "Obesity", "Pharmaceuticals", "Biotech"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "NVO", name: "Novo Nordisk (ADR)", tags: ["Healthcare", "GLP-1", "Obesity", "Pharmaceuticals", "Europe"], type: "stock", exchange: "NYSE", region: "Europe", ajBell: true, screening: "approved" },
  { ticker: "JNJ", name: "Johnson & Johnson", tags: ["Healthcare", "Pharmaceuticals", "Medical Devices", "Defensive"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "UNH", name: "UnitedHealth Group", tags: ["Healthcare", "Insurance", "Managed Care"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "watchlist" },
  { ticker: "ABBV", name: "AbbVie", tags: ["Healthcare", "Pharmaceuticals", "Immunology", "Biotech"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "AMGN", name: "Amgen", tags: ["Healthcare", "Biotech", "GLP-1", "Obesity", "Biosimilars"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "ISRG", name: "Intuitive Surgical", tags: ["Healthcare", "Robotics", "Medical Devices", "Surgery"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "TMO", name: "Thermo Fisher Scientific", tags: ["Healthcare", "Lab Equipment", "Diagnostics", "Biotech"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "DXCM", name: "DexCom", tags: ["Healthcare", "Medical Devices", "Diabetes", "Wearables"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "RDY", name: "Dr. Reddy's Laboratories", tags: ["Healthcare", "Generics", "Asia-Pacific", "India", "Pharmaceuticals"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "AZN", name: "AstraZeneca", tags: ["Healthcare", "Pharmaceuticals", "Oncology", "Europe"], type: "stock", exchange: "NASDAQ", region: "Europe", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // OIL & GAS / ENERGY
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "XOM", name: "Exxon Mobil", tags: ["Oil & Gas", "Energy", "Dividends", "North America", "Integrated"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "CVX", name: "Chevron", tags: ["Oil & Gas", "Energy", "Dividends", "North America", "Integrated"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "SHEL", name: "Shell plc", tags: ["Oil & Gas", "Energy", "Europe", "LNG", "Integrated"], type: "stock", exchange: "NYSE", region: "Europe", ajBell: true, screening: "approved" },
  { ticker: "TTE", name: "TotalEnergies", tags: ["Oil & Gas", "Energy", "Europe", "Renewables Transition"], type: "stock", exchange: "NYSE", region: "Europe", ajBell: true, screening: "approved" },
  { ticker: "PBR", name: "Petrobras", tags: ["Oil & Gas", "Energy", "Latin America", "Deep Water", "Dividends"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved" },
  { ticker: "SLB", name: "Schlumberger (SLB)", tags: ["Oil & Gas", "Energy", "Oilfield Services", "Technology"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "HAL", name: "Halliburton", tags: ["Oil & Gas", "Energy", "Oilfield Services"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "COP", name: "ConocoPhillips", tags: ["Oil & Gas", "Energy", "Exploration", "North America"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "ENB", name: "Enbridge", tags: ["Oil & Gas", "Energy", "Pipelines", "Infrastructure", "Dividends"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // INDUSTRIAL AUTOMATION / ROBOTICS
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "ABB", name: "ABB Ltd", tags: ["Industrial Automation", "Robotics", "Electrification", "Europe"], type: "stock", exchange: "NYSE", region: "Europe", ajBell: true, screening: "approved" },
  { ticker: "ROK", name: "Rockwell Automation", tags: ["Industrial Automation", "Software", "Factory", "North America"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "EMR", name: "Emerson Electric", tags: ["Industrial Automation", "Process Control", "Technology"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "HON", name: "Honeywell", tags: ["Industrial Automation", "Aerospace", "Technology", "Conglomerate"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "FANUY", name: "Fanuc Corporation", tags: ["Industrial Automation", "Robotics", "Asia-Pacific", "Japan", "CNC"], type: "stock", exchange: "OTC", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "SIEGY", name: "Siemens AG", tags: ["Industrial Automation", "Europe", "Digital Industries", "Infrastructure"], type: "stock", exchange: "OTC", region: "Europe", ajBell: true, screening: "approved" },
  { ticker: "ETN", name: "Eaton Corporation", tags: ["Industrial Automation", "Power Management", "Electrification", "Data Centre"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "AME", name: "AMETEK", tags: ["Industrial Automation", "Instruments", "Aerospace", "Technology"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // BATTERY TECHNOLOGY / CLEAN ENERGY / EVs
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "ENPH", name: "Enphase Energy", tags: ["Battery Technology", "Clean Energy", "Solar", "Microinverters"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "SEDG", name: "SolarEdge Technologies", tags: ["Clean Energy", "Solar", "Battery Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "rejected" },
  { ticker: "FSLR", name: "First Solar", tags: ["Clean Energy", "Solar", "Manufacturing", "North America"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "NEE", name: "NextEra Energy", tags: ["Clean Energy", "Renewables", "Utilities", "Infrastructure"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "PLUG", name: "Plug Power", tags: ["Clean Energy", "Hydrogen", "Fuel Cells", "Battery Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "ALB", name: "Albemarle", tags: ["Battery Technology", "Lithium", "Materials", "EVs"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "RIVN", name: "Rivian Automotive", tags: ["Battery Technology", "Electric Vehicles", "Automotive", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "TSLA", name: "Tesla", tags: ["Battery Technology", "Electric Vehicles", "AI", "Automotive", "Energy Storage"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "TTM", name: "Tata Motors", tags: ["Electric Vehicles", "Asia-Pacific", "India", "Automotive", "Battery Technology"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // HALAL FINANCE / ISLAMIC / SHARIAH
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "HLAL", name: "Wahed FTSE USA Shariah ETF", tags: ["Halal Finance", "Shariah", "Diversified", "North America"], type: "etf", exchange: "NASDAQ", region: "North America", ajBell: false, screening: "approved" },
  { ticker: "SPUS", name: "SP Funds S&P 500 Sharia ETF", tags: ["Halal Finance", "Shariah", "Diversified", "North America"], type: "etf", exchange: "NYSE", region: "North America", ajBell: false, screening: "approved" },
  { ticker: "ISWD.L", name: "iShares MSCI World Islamic UCITS ETF", tags: ["Halal Finance", "Shariah", "Global", "Diversified", "Technology"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "ISDE.L", name: "iShares MSCI EM Islamic UCITS ETF", tags: ["Halal Finance", "Shariah", "Emerging Markets", "Asia-Pacific", "Latin America"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // EMERGING MARKET CHAMPIONS
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "NU", name: "Nu Holdings", tags: ["Fintech", "Latin America", "Digital Banking", "Technology", "Consumer"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved" },
  { ticker: "SE", name: "Sea Limited", tags: ["E-Commerce", "Fintech", "Asia-Pacific", "Southeast Asia", "Technology"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "CPNG", name: "Coupang", tags: ["E-Commerce", "Logistics", "Asia-Pacific", "South Korea", "Technology"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "MMYT", name: "MakeMyTrip", tags: ["Travel", "Asia-Pacific", "India", "Consumer", "Technology"], type: "stock", exchange: "NASDAQ", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "VALE", name: "Vale SA", tags: ["Mining", "Latin America", "Iron Ore", "Materials", "Battery Materials"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved" },
  { ticker: "AMX", name: "América Móvil", tags: ["Telecoms", "Latin America", "Infrastructure", "Consumer"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved" },
  { ticker: "FMX", name: "FEMSA", tags: ["Consumer", "Latin America", "Retail", "Beverages"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved" },
  { ticker: "STNE", name: "StoneCo", tags: ["Fintech", "Latin America", "Payments", "Technology"], type: "stock", exchange: "NASDAQ", region: "Latin America", ajBell: true, screening: "approved" },
  { ticker: "CX", name: "CEMEX", tags: ["Materials", "Latin America", "Infrastructure", "Construction"], type: "stock", exchange: "NYSE", region: "Latin America", ajBell: true, screening: "approved" },
  { ticker: "PKX", name: "POSCO Holdings", tags: ["Materials", "Asia-Pacific", "Steel", "Battery Materials", "South Korea"], type: "stock", exchange: "NYSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "JD", name: "JD.com", tags: ["E-Commerce", "Logistics", "Asia-Pacific", "China", "Technology"], type: "stock", exchange: "NASDAQ", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "TCOM", name: "Trip.com", tags: ["Travel", "Asia-Pacific", "China", "Consumer", "Technology"], type: "stock", exchange: "NASDAQ", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // ETFs — THEMATIC (LSE-listed, AJ Bell accessible)
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "SEMI.L", name: "iShares MSCI Global Semiconductors ETF", tags: ["Semiconductors", "Microchips", "AI", "Global", "Technology"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "SMH.L", name: "VanEck Semiconductor UCITS ETF", tags: ["Semiconductors", "Microchips", "AI", "Global", "Technology"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "HTWD.L", name: "HSBC MSCI Taiwan Capped ETF", tags: ["Semiconductors", "Asia-Pacific", "Technology", "Chip Manufacturing"], type: "etf", exchange: "LSE", region: "Asia-Pacific", ajBell: true, screening: "approved" },
  { ticker: "INRG.L", name: "iShares Global Clean Energy ETF", tags: ["Clean Energy", "Solar", "Wind", "Battery Technology", "Global"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "RENW.L", name: "L&G Clean Energy UCITS ETF", tags: ["Clean Energy", "Grid Storage", "Infrastructure", "Global"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "HEAL.L", name: "iShares Healthcare Innovation ETF", tags: ["Healthcare", "Biotech", "Medical Devices", "Innovation", "Global"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "VFEM.L", name: "Vanguard FTSE Emerging Markets ETF", tags: ["Emerging Markets", "Asia-Pacific", "Latin America", "Diversified"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "IUIT.L", name: "iShares S&P 500 Info Tech Sector ETF", tags: ["Technology", "AI", "Software", "North America"], type: "etf", exchange: "LSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "EQQQ.L", name: "Invesco NASDAQ-100 UCITS ETF", tags: ["Technology", "AI", "Software", "North America", "Growth"], type: "etf", exchange: "LSE", region: "North America", ajBell: true, screening: "approved" },
  { ticker: "RBTX.L", name: "iShares Automation & Robotics UCITS ETF", tags: ["Industrial Automation", "Robotics", "AI", "Technology", "Global"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "DGTL.L", name: "iShares Digitalisation UCITS ETF", tags: ["Technology", "Software", "Digital Transformation", "Global"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  { ticker: "ISPY.L", name: "iShares Cyber Security UCITS ETF", tags: ["Cybersecurity", "Technology", "Global", "Security"], type: "etf", exchange: "LSE", region: "Global", ajBell: true, screening: "approved" },
  // ═══════════════════════════════════════════════════════════════════════════
  // REJECTED (kept for reference)
  // ═══════════════════════════════════════════════════════════════════════════
  { ticker: "NVDA", name: "NVIDIA", tags: ["Semiconductors", "AI", "GPU", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "rejected" },
  { ticker: "INTC", name: "Intel", tags: ["Semiconductors", "Microchips", "Technology"], type: "stock", exchange: "NASDAQ", region: "North America", ajBell: true, screening: "rejected" },
  { ticker: "LMT", name: "Lockheed Martin", tags: ["Aerospace", "Defence", "Industrials"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "rejected" },
  { ticker: "RTX", name: "RTX Corporation", tags: ["Aerospace", "Defence", "Industrials"], type: "stock", exchange: "NYSE", region: "North America", ajBell: true, screening: "rejected" },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

export function searchUniverse(terms: string[]): UniverseAsset[] {
  if (terms.length === 0) return ASSET_UNIVERSE.filter((a) => a.screening === "approved");

  return ASSET_UNIVERSE
    .filter((a) => a.screening === "approved")
    .map((a) => {
      let score = 0;
      const allText = [...a.tags, a.name, a.ticker, a.region].join(" ").toLowerCase();
      for (const term of terms) {
        const lower = term.toLowerCase();
        if (a.tags.some((t) => t.toLowerCase() === lower)) { score += 10; continue; }
        if (a.tags.some((t) => t.toLowerCase().includes(lower) || lower.includes(t.toLowerCase()))) { score += 5; continue; }
        if (allText.includes(lower)) { score += 3; continue; }
      }
      return { ...a, score };
    })
    .filter((a) => a.score > 0)
    .sort((a, b) => b.score - a.score);
}

export function getApprovedCount(): number {
  return ASSET_UNIVERSE.filter((a) => a.screening === "approved").length;
}

export function getByTheme(theme: string): UniverseAsset[] {
  return ASSET_UNIVERSE.filter((a) => a.screening === "approved" && a.tags.some((t) => t.toLowerCase().includes(theme.toLowerCase())));
}
