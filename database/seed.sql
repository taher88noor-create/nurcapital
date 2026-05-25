-- ============================================
-- Nür Capital — Seed Data
-- Initial approved assets for MVP
-- ============================================

-- ── Sample Assets ──

INSERT INTO assets (ticker, company_name, asset_type, exchange, country, sector, industry, market_cap, website) VALUES
  ('TSLA', 'Tesla Inc.', 'equity', 'NASDAQ', 'US', 'Consumer Discretionary', 'Electric Vehicles', 800000000000, 'https://tesla.com'),
  ('NOVO-B', 'Novo Nordisk', 'equity', 'CPH', 'Denmark', 'Healthcare', 'Pharmaceuticals', 600000000000, 'https://novonordisk.com'),
  ('ASML', 'ASML Holding', 'equity', 'EURONEXT', 'Netherlands', 'Technology', 'Semiconductor Equipment', 350000000000, 'https://asml.com'),
  ('TSM', 'Taiwan Semiconductor', 'equity', 'NYSE', 'Taiwan', 'Technology', 'Semiconductors', 700000000000, 'https://tsmc.com'),
  ('CRM', 'Salesforce Inc.', 'equity', 'NYSE', 'US', 'Technology', 'Enterprise Software', 250000000000, 'https://salesforce.com'),
  ('COST', 'Costco Wholesale', 'equity', 'NASDAQ', 'US', 'Consumer Staples', 'Retail', 350000000000, 'https://costco.com'),
  ('LLY', 'Eli Lilly and Company', 'equity', 'NYSE', 'US', 'Healthcare', 'Pharmaceuticals', 750000000000, 'https://lilly.com'),
  ('AMD', 'Advanced Micro Devices', 'equity', 'NASDAQ', 'US', 'Technology', 'Semiconductors', 200000000000, 'https://amd.com'),
  ('NFLX', 'Netflix Inc.', 'equity', 'NASDAQ', 'US', 'Communication', 'Streaming', 280000000000, 'https://netflix.com'),
  ('AVGO', 'Broadcom Inc.', 'equity', 'NASDAQ', 'US', 'Technology', 'Semiconductors', 600000000000, 'https://broadcom.com');

-- ── Ethical Screening for seed assets ──

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.92, 'Passes AAOIFI financial ratio thresholds. No identified Israel operations.'
FROM assets WHERE ticker = 'TSLA';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.90, 'Passes AAOIFI thresholds. No identified Israel operations.'
FROM assets WHERE ticker = 'NOVO-B';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.88, 'Passes AAOIFI thresholds. No identified Israel operations.'
FROM assets WHERE ticker = 'ASML';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.91, 'Passes AAOIFI thresholds. No identified Israel operations.'
FROM assets WHERE ticker = 'TSM';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.89, 'Passes AAOIFI thresholds. No significant Israel operations.'
FROM assets WHERE ticker = 'CRM';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.93, 'Passes AAOIFI thresholds. No identified Israel operations.'
FROM assets WHERE ticker = 'COST';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.90, 'Passes AAOIFI thresholds. No significant Israel operations.'
FROM assets WHERE ticker = 'LLY';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.87, 'Passes AAOIFI thresholds. No significant Israel operations.'
FROM assets WHERE ticker = 'AMD';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.86, 'Passes AAOIFI thresholds. No significant Israel operations.'
FROM assets WHERE ticker = 'NFLX';

INSERT INTO ethical_screening (asset_id, halal_status, israel_exposure, screening_status, confidence_score, ethical_notes)
SELECT id, 'compliant', 'clear', 'reviewed', 0.88, 'Passes AAOIFI thresholds. No significant Israel operations.'
FROM assets WHERE ticker = 'AVGO';

-- ── Theme assignments ──

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'TSLA' AND t.theme_name = 'Clean Energy';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'TSLA' AND t.theme_name = 'Battery Technology';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'ASML' AND t.theme_name = 'Semiconductors';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'TSM' AND t.theme_name = 'Semiconductors';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'AMD' AND t.theme_name = 'Semiconductors';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'AVGO' AND t.theme_name = 'Semiconductors';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'CRM' AND t.theme_name = 'AI Infrastructure';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'NOVO-B' AND t.theme_name = 'Healthcare';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'LLY' AND t.theme_name = 'Healthcare';

INSERT INTO asset_themes (asset_id, theme_id)
SELECT a.id, t.id FROM assets a, themes t WHERE a.ticker = 'COST' AND t.theme_name = 'Consumer Staples';
