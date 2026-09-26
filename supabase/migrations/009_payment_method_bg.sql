-- Replace 'kontant' with 'bg' as payment method
alter table receipts drop constraint if exists receipts_payment_method_check;
alter table receipts add constraint receipts_payment_method_check
  check (payment_method in ('swish', 'bg', 'kort', 'faktura'));

-- Update any existing receipts that used 'kontant'
update receipts set payment_method = 'bg' where payment_method = 'kontant';
