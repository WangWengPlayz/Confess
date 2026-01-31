-- Create confessions table
CREATE TABLE IF NOT EXISTS confessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  original_text TEXT NOT NULL,
  english_translation TEXT NOT NULL,
  author_name TEXT,
  is_anonymous BOOLEAN DEFAULT true,
  profile_url TEXT,
  status VARCHAR(50) DEFAULT 'pending', -- pending, approved, rejected, blocked
  blocked_reason TEXT,
  category VARCHAR(50), -- romance, friendship, funny
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  facebook_post_id TEXT,
  is_favorite BOOLEAN DEFAULT false
);

-- Create admin table
CREATE TABLE IF NOT EXISTS admin (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash TEXT NOT NULL,
  page_access_token TEXT,
  facebook_page_id TEXT,
  facebook_page_name TEXT,
  facebook_page_logo_url TEXT,
  is_testing_mode BOOLEAN DEFAULT true,
  testing_account_id TEXT,
  successful_tests INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create testing logs table
CREATE TABLE IF NOT EXISTS testing_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  log_type VARCHAR(50), -- incoming_message, bot_response, translation, moderation, error
  message TEXT NOT NULL,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create moderation log table
CREATE TABLE IF NOT EXISTS moderation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  confession_id UUID NOT NULL REFERENCES confessions(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  action VARCHAR(50), -- blocked, approved, rejected
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create auto-reply template table
CREATE TABLE IF NOT EXISTS auto_reply_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template_type VARCHAR(50), -- welcome, blocked, confirmation, etc
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE confessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin ENABLE ROW LEVEL SECURITY;
ALTER TABLE testing_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE moderation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE auto_reply_templates ENABLE ROW LEVEL SECURITY;

-- Create policies (allow all for now - will be secured in production)
CREATE POLICY "Allow all on confessions" ON confessions FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on admin" ON admin FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on testing_logs" ON testing_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on moderation_logs" ON moderation_logs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on auto_reply_templates" ON auto_reply_templates FOR ALL USING (true) WITH CHECK (true);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_confessions_status ON confessions(status);
CREATE INDEX IF NOT EXISTS idx_confessions_created_at ON confessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_confessions_is_anonymous ON confessions(is_anonymous);
CREATE INDEX IF NOT EXISTS idx_testing_logs_created_at ON testing_logs(created_at DESC);
