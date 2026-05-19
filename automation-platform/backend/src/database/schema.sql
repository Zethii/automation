-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  username VARCHAR(100) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  avatar_url TEXT,
  subscription_tier VARCHAR(50) DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Content templates
CREATE TABLE IF NOT EXISTS content_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  niche VARCHAR(100) NOT NULL,
  template_type VARCHAR(50) NOT NULL,
  content_template TEXT NOT NULL,
  hashtags TEXT[],
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Generated content
CREATE TABLE IF NOT EXISTS generated_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  template_id UUID REFERENCES content_templates(id),
  niche VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  hashtags TEXT[],
  image_url TEXT,
  affiliate_links JSONB,
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social media accounts
CREATE TABLE IF NOT EXISTS social_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform VARCHAR(50) NOT NULL,
  account_name VARCHAR(255) NOT NULL,
  access_token TEXT,
  refresh_token TEXT,
  account_id VARCHAR(255),
  is_connected BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, platform, account_id)
);

-- Scheduled posts
CREATE TABLE IF NOT EXISTS scheduled_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES generated_content(id) ON DELETE CASCADE,
  platforms VARCHAR(50)[] NOT NULL,
  scheduled_time TIMESTAMP NOT NULL,
  posted_time TIMESTAMP,
  status VARCHAR(50) DEFAULT 'scheduled',
  post_ids JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Affiliate links
CREATE TABLE IF NOT EXISTS affiliate_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  original_url TEXT NOT NULL,
  short_url VARCHAR(255) UNIQUE,
  affiliate_network VARCHAR(100) NOT NULL,
  product_name VARCHAR(255),
  commission_rate DECIMAL(5, 2),
  niche VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Click tracking
CREATE TABLE IF NOT EXISTS link_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
  post_id UUID REFERENCES scheduled_posts(id),
  platform VARCHAR(50),
  referrer TEXT,
  user_agent TEXT,
  ip_address VARCHAR(45),
  clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Conversions
CREATE TABLE IF NOT EXISTS conversions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES affiliate_links(id) ON DELETE CASCADE,
  click_id UUID REFERENCES link_clicks(id),
  amount DECIMAL(10, 2),
  commission DECIMAL(10, 2),
  affiliate_network VARCHAR(100),
  status VARCHAR(50) DEFAULT 'pending',
  converted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- E-commerce products
CREATE TABLE IF NOT EXISTS ecommerce_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  cost DECIMAL(10, 2),
  sku VARCHAR(100) UNIQUE,
  image_urls TEXT[],
  platforms JSONB,
  inventory_count INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Data insights
CREATE TABLE IF NOT EXISTS data_insights (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  insight_type VARCHAR(100) NOT NULL,
  data_source VARCHAR(100),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  data JSONB,
  price DECIMAL(10, 2),
  status VARCHAR(50) DEFAULT 'draft',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Analytics
CREATE TABLE IF NOT EXISTS analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  metric_type VARCHAR(100) NOT NULL,
  metric_value INTEGER,
  platform VARCHAR(50),
  niche VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, date, metric_type, platform)
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_content_user_niche ON generated_content(user_id, niche);
CREATE INDEX idx_scheduled_posts_user_status ON scheduled_posts(user_id, status);
CREATE INDEX idx_affiliate_links_user ON affiliate_links(user_id);
CREATE INDEX idx_link_clicks_link ON link_clicks(link_id);
CREATE INDEX idx_conversions_link ON conversions(link_id);
CREATE INDEX idx_ecommerce_products_user ON ecommerce_products(user_id);
CREATE INDEX idx_analytics_user_date ON analytics(user_id, date);
