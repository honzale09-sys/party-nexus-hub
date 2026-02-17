
-- Fix product_variants: admin ALL policy must be PERMISSIVE
DROP POLICY "Admins can manage variants" ON public.product_variants;
CREATE POLICY "Admins can manage variants"
  ON public.product_variants FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Fix "Anyone can view variants" to be PERMISSIVE too
DROP POLICY "Anyone can view variants" ON public.product_variants;
CREATE POLICY "Anyone can view variants"
  ON public.product_variants FOR SELECT TO anon, authenticated
  USING (true);

-- Fix inventory_logs: admin ALL policy must be PERMISSIVE
DROP POLICY "Admins can manage inventory logs" ON public.inventory_logs;
CREATE POLICY "Admins can manage inventory logs"
  ON public.inventory_logs FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
