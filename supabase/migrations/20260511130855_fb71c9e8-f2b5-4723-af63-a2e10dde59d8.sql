
DELETE FROM public.scan_logs;
DELETE FROM public.ticket_instances;
DELETE FROM public.order_items;
DELETE FROM public.orders;
UPDATE public.ticket_tiers SET quantity_sold = 0;
UPDATE public.events SET capacity_sold = 0;
