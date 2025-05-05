-- Create soil_tests table to store individual soil test results
CREATE TABLE IF NOT EXISTS public.soil_tests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    farm_location_id UUID NOT NULL,
    test_date DATE NOT NULL DEFAULT CURRENT_DATE,
    ph DECIMAL(4,2),
    nitrogen DECIMAL(6,2),  -- in ppm or appropriate unit
    phosphorus DECIMAL(6,2), -- in ppm or appropriate unit
    potassium DECIMAL(6,2), -- in ppm or appropriate unit
    organic_matter DECIMAL(5,2), -- percentage
    moisture DECIMAL(5,2), -- percentage
    electrical_conductivity DECIMAL(6,2), -- for salinity measurement
    calcium DECIMAL(6,2),
    magnesium DECIMAL(6,2),
    sulfur DECIMAL(6,2),
    zinc DECIMAL(6,2),
    iron DECIMAL(6,2),
    manganese DECIMAL(6,2),
    copper DECIMAL(6,2),
    boron DECIMAL(6,2),
    notes TEXT,
    lab_report_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create farm_locations table to manage different farm areas
CREATE TABLE IF NOT EXISTS public.farm_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    area DECIMAL(10,2), -- in hectares or acres
    area_unit TEXT DEFAULT 'hectares',
    location_type TEXT, -- field, greenhouse, orchard, etc.
    gps_coordinates TEXT, -- can store as 'lat,long' or use PostGIS extension for proper geo data
    city TEXT,
    state TEXT,
    country TEXT,
    soil_type TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add foreign key constraint to soil_tests
ALTER TABLE public.soil_tests 
    ADD CONSTRAINT fk_soil_tests_farm_location 
    FOREIGN KEY (farm_location_id) 
    REFERENCES public.farm_locations(id) 
    ON DELETE CASCADE;

-- Create soil_recommendations table to store expert advice based on soil conditions
CREATE TABLE IF NOT EXISTS public.soil_recommendations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    soil_test_id UUID REFERENCES public.soil_tests(id) ON DELETE CASCADE,
    category TEXT NOT NULL, -- fertilizer, amendment, crop suggestion, practice
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    priority TEXT, -- high, medium, low
    application_rate TEXT,
    application_method TEXT,
    recommended_products TEXT[],
    expected_benefits TEXT,
    created_by UUID REFERENCES auth.users(id), -- expert who created the recommendation, if applicable
    is_generic BOOLEAN DEFAULT false, -- whether this is a generic recommendation or specific to the test
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add some generic soil condition recommendations
INSERT INTO public.soil_recommendations (category, title, description, priority, application_rate, application_method, recommended_products, expected_benefits, is_generic)
VALUES 
('fertilizer', 'Low Nitrogen Treatment', 'Apply nitrogen-rich fertilizer to address deficiency', 'high', '20-30 kg/hectare', 'Broadcast application before irrigation', ARRAY['Urea', 'Ammonium Sulfate', 'Organic Compost'], 'Improved leaf growth and plant vigor', true),
('amendment', 'Acidic Soil Correction', 'Add agricultural lime to increase soil pH', 'high', '500-1000 kg/hectare depending on severity', 'Broadcast and incorporate into soil', ARRAY['Agricultural Limestone', 'Dolomitic Lime'], 'Balanced pH for better nutrient availability', true),
('amendment', 'Alkaline Soil Correction', 'Add organic matter or sulfur to decrease soil pH', 'high', '200-400 kg/hectare of elemental sulfur', 'Incorporate into soil before planting', ARRAY['Elemental Sulfur', 'Acidic Organic Matter', 'Pine Needles'], 'Reduced pH for better micronutrient availability', true),
('practice', 'Improve Organic Matter', 'Incorporate cover crops and plant residues to improve soil structure', 'medium', 'Cover entire field', 'Plant cover crops after harvest; incorporate residue', ARRAY['Green Manure Crops', 'Compost'], 'Enhanced soil structure, water retention and microbial activity', true),
('practice', 'Soil Erosion Control', 'Implement contour farming and mulching to prevent erosion', 'medium', 'As needed', 'Contour plowing; maintain crop residue', ARRAY['Cover Crops', 'Mulch'], 'Reduced soil loss and improved water infiltration', true);

-- Create RLS policies for soil health tables

-- Soil tests policies
ALTER TABLE public.soil_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own soil tests"
    ON public.soil_tests
    FOR SELECT
    USING (auth.uid() = farmer_id);

CREATE POLICY "Users can insert their own soil tests"
    ON public.soil_tests
    FOR INSERT
    WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Users can update their own soil tests"
    ON public.soil_tests
    FOR UPDATE
    USING (auth.uid() = farmer_id)
    WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Users can delete their own soil tests"
    ON public.soil_tests
    FOR DELETE
    USING (auth.uid() = farmer_id);

-- Farm locations policies
ALTER TABLE public.farm_locations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own farm locations"
    ON public.farm_locations
    FOR SELECT
    USING (auth.uid() = farmer_id);

CREATE POLICY "Users can insert their own farm locations"
    ON public.farm_locations
    FOR INSERT
    WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Users can update their own farm locations"
    ON public.farm_locations
    FOR UPDATE
    USING (auth.uid() = farmer_id)
    WITH CHECK (auth.uid() = farmer_id);

CREATE POLICY "Users can delete their own farm locations"
    ON public.farm_locations
    FOR DELETE
    USING (auth.uid() = farmer_id);

-- Soil recommendations policies
ALTER TABLE public.soil_recommendations ENABLE ROW LEVEL SECURITY;

-- Allow users to view recommendations for their soil tests
CREATE POLICY "Users can view soil recommendations for their tests"
    ON public.soil_recommendations
    FOR SELECT
    USING (
        is_generic OR 
        soil_test_id IN (
            SELECT id FROM public.soil_tests WHERE farmer_id = auth.uid()
        )
    );

-- Allow experts to create recommendations
CREATE POLICY "Experts can create soil recommendations"
    ON public.soil_recommendations
    FOR INSERT
    WITH CHECK (
        is_generic OR 
        auth.uid() = created_by OR
        soil_test_id IN (
            SELECT id FROM public.soil_tests WHERE farmer_id = auth.uid()
        )
    );

-- Allow experts to update their recommendations
CREATE POLICY "Experts can update their soil recommendations"
    ON public.soil_recommendations
    FOR UPDATE
    USING (
        auth.uid() = created_by OR
        (is_generic AND auth.uid() IN (
            SELECT id FROM auth.users WHERE user_type = 'expert'
        ))
    )
    WITH CHECK (
        auth.uid() = created_by OR
        (is_generic AND auth.uid() IN (
            SELECT id FROM auth.users WHERE user_type = 'expert'
        ))
    );

-- Allow experts to delete their recommendations
CREATE POLICY "Experts can delete their soil recommendations"
    ON public.soil_recommendations
    FOR DELETE
    USING (
        auth.uid() = created_by OR
        (is_generic AND auth.uid() IN (
            SELECT id FROM auth.users WHERE user_type = 'expert'
        ))
    ); 