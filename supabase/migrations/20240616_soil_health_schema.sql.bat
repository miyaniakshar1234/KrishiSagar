-- Create soil_tests table
CREATE TABLE IF NOT EXISTS public.soil_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  date DATE NOT NULL,
  location TEXT NOT NULL,
  ph DECIMAL(3,1) NOT NULL,
  nitrogen INTEGER NOT NULL,
  phosphorus INTEGER NOT NULL,
  potassium INTEGER NOT NULL,
  organic_matter DECIMAL(3,1) NOT NULL,
  moisture INTEGER NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create soil_recommendations table
CREATE TABLE IF NOT EXISTS public.soil_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  crop_types TEXT[] NOT NULL,
  soil_condition TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create farm_locations table
CREATE TABLE IF NOT EXISTS public.farm_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  name TEXT NOT NULL,
  coordinates TEXT,
  area DECIMAL(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, name)
);

-- Add Row Level Security policies
ALTER TABLE public.soil_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.soil_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farm_locations ENABLE ROW LEVEL SECURITY;

-- Soil tests policies
CREATE POLICY "Users can view their own soil tests"
  ON public.soil_tests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own soil tests"
  ON public.soil_tests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own soil tests"
  ON public.soil_tests FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own soil tests"
  ON public.soil_tests FOR DELETE
  USING (auth.uid() = user_id);

-- Farm locations policies
CREATE POLICY "Users can view their own farm locations"
  ON public.farm_locations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own farm locations"
  ON public.farm_locations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farm locations"
  ON public.farm_locations FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farm locations"
  ON public.farm_locations FOR DELETE
  USING (auth.uid() = user_id);

-- Soil recommendations are public (read-only for regular users)
CREATE POLICY "Anyone can view soil recommendations"
  ON public.soil_recommendations FOR SELECT
  USING (true);

-- Only admins can manage soil recommendations
CREATE POLICY "Admins can manage soil recommendations"
  ON public.soil_recommendations FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = auth.uid()
      AND users.user_type = 'admin'
    )
  );

-- Insert some sample soil recommendations
INSERT INTO public.soil_recommendations (title, description, crop_types, soil_condition)
VALUES
  ('Low pH Treatment', 'Your soil is slightly acidic. Consider adding agricultural lime at 2-3 tons per hectare to raise pH to optimal levels for most crops.', ARRAY['Rice', 'Wheat', 'Vegetables'], 'acidic'),
  ('Nitrogen Boost', 'Nitrogen levels are below optimal range. Apply organic compost or nitrogen-rich fertilizers like urea in split doses (40kg/ha) for better uptake.', ARRAY['Rice', 'Wheat', 'Maize'], 'low_nitrogen'),
  ('Phosphorus Amendment', 'Phosphorus levels need improvement. Apply single superphosphate (100kg/ha) or rock phosphate before planting to enhance root development.', ARRAY['Pulses', 'Vegetables', 'Fruits'], 'low_phosphorus'),
  ('Organic Matter Enhancement', 'Increase organic matter by incorporating crop residues, applying compost, or using green manures like sesbania or sunhemp.', ARRAY['All Crops'], 'low_organic_matter'),
  ('Potassium Enrichment', 'Potassium levels are low. Apply potash fertilizers (60-80kg/ha) before sowing or planting to improve crop quality and disease resistance.', ARRAY['Fruits', 'Vegetables', 'Oilseeds'], 'low_potassium'),
  ('High pH Management', 'Your soil is alkaline. Apply gypsum, sulfur, or iron sulfate to gradually lower pH. Use acid-loving plants or crops that tolerate alkalinity.', ARRAY['Tea', 'Potato', 'Berry Crops'], 'alkaline'),
  ('Moisture Management', 'Soil moisture levels are low. Consider mulching with organic materials, installing drip irrigation, or using water-retentive soil amendments.', ARRAY['Vegetables', 'Fruits', 'Ornamentals'], 'low_moisture');

-- Create indexes for better query performance
CREATE INDEX soil_tests_user_id_idx ON public.soil_tests (user_id);
CREATE INDEX soil_tests_date_idx ON public.soil_tests (date);
CREATE INDEX farm_locations_user_id_idx ON public.farm_locations (user_id); 