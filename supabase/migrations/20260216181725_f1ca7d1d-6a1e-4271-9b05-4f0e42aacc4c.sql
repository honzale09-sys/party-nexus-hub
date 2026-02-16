
-- Fix orders: drop restrictive insert policy, recreate as permissive
DROP POLICY "Public can insert orders" ON public.orders;
CREATE POLICY "Public can insert orders"
  ON public.orders FOR INSERT TO anon, authenticated
  WITH CHECK (customer_email IS NOT NULL AND customer_email <> '');

-- Fix order_items: drop restrictive insert policy, recreate as permissive
DROP POLICY "Public can insert order items" ON public.order_items;
CREATE POLICY "Public can insert order items"
  ON public.order_items FOR INSERT TO anon, authenticated
  WITH CHECK (order_id IS NOT NULL);

-- Fix ticket_instances: drop restrictive insert policy, recreate as permissive
DROP POLICY "Public can insert ticket instances" ON public.ticket_instances;
CREATE POLICY "Public can insert ticket instances"
  ON public.ticket_instances FOR INSERT TO anon, authenticated
  WITH CHECK (order_id IS NOT NULL AND qr_code IS NOT NULL);

-- Fix customers: drop restrictive insert policy, recreate as permissive
DROP POLICY "Public can insert customers" ON public.customers;
CREATE POLICY "Public can insert customers"
  ON public.customers FOR INSERT TO anon, authenticated
  WITH CHECK (email IS NOT NULL AND email <> '');
