-- Create tables for the Agro Store Owner Billing System

-- Store Bills Table: Main table for storing bill/invoice information
CREATE TABLE IF NOT EXISTS public.store_bills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_number TEXT NOT NULL UNIQUE,
    bill_date DATE NOT NULL DEFAULT CURRENT_DATE,
    farmer_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    farmer_name TEXT NOT NULL,
    farmer_mobile TEXT,
    subtotal DECIMAL(10,2) NOT NULL,
    gst_total DECIMAL(10,2) NOT NULL,
    grand_total DECIMAL(10,2) NOT NULL,
    payment_method TEXT NOT NULL,
    notes TEXT,
    store_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    is_canceled BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Store Bill Items Table: Details for each product in a bill
CREATE TABLE IF NOT EXISTS public.store_bill_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bill_id UUID NOT NULL REFERENCES public.store_bills(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL, -- Refers to a product in inventory (can be string ID from various systems)
    product_name TEXT NOT NULL,
    hsn_code TEXT, -- Harmonized System Nomenclature code for GST
    quantity DECIMAL(10,2) NOT NULL,
    unit TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL, -- Per unit price
    gst_rate DECIMAL(5,2) NOT NULL, -- GST percentage
    gst_amount DECIMAL(10,2) NOT NULL, -- Total GST amount
    total DECIMAL(10,2) NOT NULL, -- Total amount including GST
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Farmer Purchases Table: Links bills to farmers for purchase history
CREATE TABLE IF NOT EXISTS public.farmer_purchases (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    farmer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    bill_id UUID NOT NULL REFERENCES public.store_bills(id) ON DELETE CASCADE,
    store_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    store_name TEXT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    purchase_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'completed',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_store_bills_store_owner_id ON public.store_bills(store_owner_id);
CREATE INDEX IF NOT EXISTS idx_store_bills_farmer_id ON public.store_bills(farmer_id);
CREATE INDEX IF NOT EXISTS idx_store_bill_items_bill_id ON public.store_bill_items(bill_id);
CREATE INDEX IF NOT EXISTS idx_farmer_purchases_farmer_id ON public.farmer_purchases(farmer_id);
CREATE INDEX IF NOT EXISTS idx_farmer_purchases_store_id ON public.farmer_purchases(store_id);

-- RLS Policies for store_bills table
ALTER TABLE public.store_bills ENABLE ROW LEVEL SECURITY;

-- Store Owner access policies
CREATE POLICY "Store owners can view their own bills"
    ON public.store_bills
    FOR SELECT
    USING (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can insert their own bills"
    ON public.store_bills
    FOR INSERT
    WITH CHECK (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can update their own bills"
    ON public.store_bills
    FOR UPDATE
    USING (auth.uid() = store_owner_id)
    WITH CHECK (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can delete their own bills"
    ON public.store_bills
    FOR DELETE
    USING (auth.uid() = store_owner_id);

-- Farmer access policies (farmers can view bills linked to them)
CREATE POLICY "Farmers can view bills linked to them"
    ON public.store_bills
    FOR SELECT
    USING (auth.uid() = farmer_id);

-- RLS Policies for store_bill_items table
ALTER TABLE public.store_bill_items ENABLE ROW LEVEL SECURITY;

-- Store Owner access policies (via bill_id)
CREATE POLICY "Store owners can view their bill items"
    ON public.store_bill_items
    FOR SELECT
    USING (
        bill_id IN (
            SELECT id FROM public.store_bills WHERE store_owner_id = auth.uid()
        )
    );

CREATE POLICY "Store owners can insert their bill items"
    ON public.store_bill_items
    FOR INSERT
    WITH CHECK (
        bill_id IN (
            SELECT id FROM public.store_bills WHERE store_owner_id = auth.uid()
        )
    );

CREATE POLICY "Store owners can update their bill items"
    ON public.store_bill_items
    FOR UPDATE
    USING (
        bill_id IN (
            SELECT id FROM public.store_bills WHERE store_owner_id = auth.uid()
        )
    )
    WITH CHECK (
        bill_id IN (
            SELECT id FROM public.store_bills WHERE store_owner_id = auth.uid()
        )
    );

CREATE POLICY "Store owners can delete their bill items"
    ON public.store_bill_items
    FOR DELETE
    USING (
        bill_id IN (
            SELECT id FROM public.store_bills WHERE store_owner_id = auth.uid()
        )
    );

-- Farmer access policies (farmers can view bill items linked to them)
CREATE POLICY "Farmers can view bill items for their bills"
    ON public.store_bill_items
    FOR SELECT
    USING (
        bill_id IN (
            SELECT id FROM public.store_bills WHERE farmer_id = auth.uid()
        )
    );

-- RLS Policies for farmer_purchases table
ALTER TABLE public.farmer_purchases ENABLE ROW LEVEL SECURITY;

-- Store Owner access policies
CREATE POLICY "Store owners can view purchases from their store"
    ON public.farmer_purchases
    FOR SELECT
    USING (auth.uid() = store_id);

CREATE POLICY "Store owners can insert purchases for their store"
    ON public.farmer_purchases
    FOR INSERT
    WITH CHECK (auth.uid() = store_id);

CREATE POLICY "Store owners can update purchases for their store"
    ON public.farmer_purchases
    FOR UPDATE
    USING (auth.uid() = store_id)
    WITH CHECK (auth.uid() = store_id);

-- Farmer access policies
CREATE POLICY "Farmers can view their own purchases"
    ON public.farmer_purchases
    FOR SELECT
    USING (auth.uid() = farmer_id);

-- Create a stored procedure to add a record to the farmer_purchases table when a bill is created
CREATE OR REPLACE FUNCTION public.add_to_farmer_purchases()
RETURNS TRIGGER AS $$
BEGIN
    -- Only add to farmer_purchases if a farmer_id is present
    IF NEW.farmer_id IS NOT NULL THEN
        INSERT INTO public.farmer_purchases (
            farmer_id,
            bill_id,
            store_id,
            store_name,
            amount,
            purchase_date,
            status
        ) VALUES (
            NEW.farmer_id,
            NEW.id,
            NEW.store_owner_id,
            (SELECT name FROM public.users WHERE id = NEW.store_owner_id),
            NEW.grand_total,
            NEW.bill_date,
            'completed'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS add_farmer_purchase_on_bill_insert ON public.store_bills;
CREATE TRIGGER add_farmer_purchase_on_bill_insert
AFTER INSERT ON public.store_bills
FOR EACH ROW
EXECUTE FUNCTION public.add_to_farmer_purchases(); 