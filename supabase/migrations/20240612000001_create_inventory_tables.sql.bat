-- Create tables for the Agro Store Owner Inventory Management

-- Product Categories Table
CREATE TABLE IF NOT EXISTS public.product_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert some common product categories
INSERT INTO public.product_categories (name, description) VALUES
('Seeds', 'Agricultural seeds for various crops'),
('Fertilizers', 'Chemical and organic fertilizers'),
('Pesticides', 'Insecticides, herbicides, and fungicides'),
('Tools', 'Farm tools and equipment'),
('Irrigation', 'Irrigation equipment and supplies'),
('Animal Feed', 'Feed for livestock and poultry'),
('Soil Amendments', 'Products to improve soil quality')
ON CONFLICT DO NOTHING;

-- Products Table
CREATE TABLE IF NOT EXISTS public.store_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.product_categories(id),
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    cost_price DECIMAL(10,2),
    mrp DECIMAL(10,2), -- Maximum Retail Price
    hsn_code TEXT, -- Harmonized System Nomenclature code for GST
    gst_rate DECIMAL(5,2) NOT NULL DEFAULT 5.00, -- GST percentage
    unit TEXT NOT NULL DEFAULT 'piece', -- e.g., kg, liter, piece
    min_stock_level INTEGER DEFAULT 5,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Store Inventory Table
CREATE TABLE IF NOT EXISTS public.store_inventory (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    quantity DECIMAL(10,2) NOT NULL DEFAULT 0,
    last_restock_date DATE,
    expiry_date DATE,
    batch_number TEXT,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(store_owner_id, product_id) -- One inventory record per product per store
);

-- Inventory Transactions Table (for audit trail)
CREATE TABLE IF NOT EXISTS public.inventory_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.store_products(id) ON DELETE CASCADE,
    transaction_type TEXT NOT NULL, -- 'purchase', 'sale', 'adjustment', 'return'
    quantity DECIMAL(10,2) NOT NULL,
    previous_quantity DECIMAL(10,2) NOT NULL,
    new_quantity DECIMAL(10,2) NOT NULL,
    reference_id UUID, -- Could refer to a bill_id or purchase_order_id
    notes TEXT,
    transaction_date TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_store_products_store_owner_id ON public.store_products(store_owner_id);
CREATE INDEX IF NOT EXISTS idx_store_products_category_id ON public.store_products(category_id);
CREATE INDEX IF NOT EXISTS idx_store_inventory_store_owner_id ON public.store_inventory(store_owner_id);
CREATE INDEX IF NOT EXISTS idx_store_inventory_product_id ON public.store_inventory(product_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_store_owner_id ON public.inventory_transactions(store_owner_id);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON public.inventory_transactions(product_id);

-- RLS Policies for product_categories table
ALTER TABLE public.product_categories ENABLE ROW LEVEL SECURITY;

-- Everyone can view product categories
CREATE POLICY "Anyone can view product categories"
    ON public.product_categories
    FOR SELECT
    USING (true);

-- Only admins can modify product categories (handled by service role)

-- RLS Policies for store_products table
ALTER TABLE public.store_products ENABLE ROW LEVEL SECURITY;

-- Store owner policies
CREATE POLICY "Store owners can view their own products"
    ON public.store_products
    FOR SELECT
    USING (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can insert their own products"
    ON public.store_products
    FOR INSERT
    WITH CHECK (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can update their own products"
    ON public.store_products
    FOR UPDATE
    USING (auth.uid() = store_owner_id)
    WITH CHECK (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can delete their own products"
    ON public.store_products
    FOR DELETE
    USING (auth.uid() = store_owner_id);

-- RLS Policies for store_inventory table
ALTER TABLE public.store_inventory ENABLE ROW LEVEL SECURITY;

-- Store owner policies
CREATE POLICY "Store owners can view their own inventory"
    ON public.store_inventory
    FOR SELECT
    USING (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can insert their own inventory"
    ON public.store_inventory
    FOR INSERT
    WITH CHECK (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can update their own inventory"
    ON public.store_inventory
    FOR UPDATE
    USING (auth.uid() = store_owner_id)
    WITH CHECK (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can delete their own inventory"
    ON public.store_inventory
    FOR DELETE
    USING (auth.uid() = store_owner_id);

-- RLS Policies for inventory_transactions table
ALTER TABLE public.inventory_transactions ENABLE ROW LEVEL SECURITY;

-- Store owner policies for transactions
CREATE POLICY "Store owners can view their own inventory transactions"
    ON public.inventory_transactions
    FOR SELECT
    USING (auth.uid() = store_owner_id);

CREATE POLICY "Store owners can insert their own inventory transactions"
    ON public.inventory_transactions
    FOR INSERT
    WITH CHECK (auth.uid() = store_owner_id);

-- No update/delete policies for transactions (audit trail should be immutable)

-- Create functions to manage inventory

-- Function to update inventory when a product is sold
CREATE OR REPLACE FUNCTION public.update_inventory_on_sale()
RETURNS TRIGGER AS $$
DECLARE
    store_id UUID;
    current_qty DECIMAL(10,2);
BEGIN
    -- Get the store_owner_id from the bill
    SELECT store_owner_id INTO store_id FROM public.store_bills WHERE id = NEW.bill_id;
    
    -- Check if the product exists in inventory
    SELECT quantity INTO current_qty 
    FROM public.store_inventory 
    WHERE 
        store_owner_id = store_id AND 
        product_id = (SELECT id FROM public.store_products WHERE id::text = NEW.product_id::text);
    
    IF FOUND THEN
        -- Update inventory quantity
        UPDATE public.store_inventory 
        SET 
            quantity = quantity - NEW.quantity,
            updated_at = now()
        WHERE 
            store_owner_id = store_id AND 
            product_id = (SELECT id FROM public.store_products WHERE id::text = NEW.product_id::text);
        
        -- Record the transaction
        INSERT INTO public.inventory_transactions (
            store_owner_id,
            product_id,
            transaction_type,
            quantity,
            previous_quantity,
            new_quantity,
            reference_id,
            notes
        ) VALUES (
            store_id,
            (SELECT id FROM public.store_products WHERE id::text = NEW.product_id::text),
            'sale',
            NEW.quantity,
            current_qty,
            current_qty - NEW.quantity,
            NEW.bill_id,
            'Sold via bill #' || (SELECT bill_number FROM public.store_bills WHERE id = NEW.bill_id)
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for inventory update on sale
DROP TRIGGER IF EXISTS update_inventory_on_bill_item_insert ON public.store_bill_items;
CREATE TRIGGER update_inventory_on_bill_item_insert
AFTER INSERT ON public.store_bill_items
FOR EACH ROW
EXECUTE FUNCTION public.update_inventory_on_sale(); 