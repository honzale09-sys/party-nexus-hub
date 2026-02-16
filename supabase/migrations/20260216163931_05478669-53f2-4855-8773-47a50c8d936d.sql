
-- Fix the overly permissive INSERT policies by adding basic validation

-- Drop and recreate with validation
DROP POLICY "Public can insert customers" ON public.customers;
CREATE POLICY "Public can insert customers" ON public.customers FOR INSERT WITH CHECK (email IS NOT NULL AND email <> '');

DROP POLICY "Anyone can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders" ON public.orders FOR INSERT WITH CHECK (customer_email IS NOT NULL AND customer_email <> '');

DROP POLICY "Anyone can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items" ON public.order_items FOR INSERT WITH CHECK (order_id IS NOT NULL);

DROP POLICY "Anyone can insert tickets" ON public.ticket_instances;
CREATE POLICY "Public can insert ticket instances" ON public.ticket_instances FOR INSERT WITH CHECK (order_id IS NOT NULL AND qr_code IS NOT NULL);
