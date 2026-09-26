-- Store recipient email address on receipt (null = no email needed)
alter table receipts add column if not exists email_to text default null;
