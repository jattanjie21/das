-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create zones table
CREATE TABLE zones (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  coordinates JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alerts table
CREATE TABLE alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL,
  zone_id UUID REFERENCES zones(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create alert_logs table
CREATE TABLE alert_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  alert_id UUID REFERENCES alerts(id),
  status TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scheduled_alerts table
CREATE TABLE scheduled_alerts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  priority TEXT NOT NULL,
  schedule_date TIMESTAMP WITH TIME ZONE NOT NULL,
  zone_id UUID REFERENCES zones(id),
  recurring BOOLEAN DEFAULT false,
  frequency TEXT CHECK (frequency IN ('daily', 'weekly', 'monthly')),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_run_at TIMESTAMP WITH TIME ZONE,
  next_run_at TIMESTAMP WITH TIME ZONE
);

-- Create index for faster querying of pending alerts
CREATE INDEX idx_scheduled_alerts_status_next_run ON scheduled_alerts(status, next_run_at)
WHERE status = 'pending';

-- Function to update next_run_at based on frequency
CREATE OR REPLACE FUNCTION update_next_run_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.recurring THEN
    CASE NEW.frequency
      WHEN 'daily' THEN
        NEW.next_run_at := NEW.schedule_date + INTERVAL '1 day';
      WHEN 'weekly' THEN
        NEW.next_run_at := NEW.schedule_date + INTERVAL '1 week';
      WHEN 'monthly' THEN
        NEW.next_run_at := NEW.schedule_date + INTERVAL '1 month';
    END CASE;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update next_run_at
CREATE TRIGGER tr_update_next_run_at
  BEFORE INSERT OR UPDATE ON scheduled_alerts
  FOR EACH ROW
  EXECUTE FUNCTION update_next_run_at();

-- Create user_profiles table
CREATE TABLE user_profiles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('admin', 'operator', 'viewer')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trigger to update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_user_profiles_updated_at
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create RLS policies
ALTER TABLE zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE alert_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Zones policies
CREATE POLICY "Enable read access for all users" ON zones
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON zones
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON zones
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Alerts policies
CREATE POLICY "Enable read access for all users" ON alerts
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON alerts
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON alerts
  FOR UPDATE USING (auth.role() = 'authenticated');

-- Alert logs policies
CREATE POLICY "Enable read access for authenticated users" ON alert_logs
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable insert for authenticated users only" ON alert_logs
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Admins can do everything
CREATE POLICY "Admins have full access to user_profiles"
  ON user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles up
      WHERE up.user_id = auth.uid()
      AND up.role = 'admin'
    )
  );

-- Users can read their own profile
CREATE POLICY "Users can read their own profile"
  ON user_profiles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Create function to set default role on user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, role)
  VALUES (NEW.id, 'viewer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set default role
CREATE TRIGGER tr_handle_new_user
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user(); 