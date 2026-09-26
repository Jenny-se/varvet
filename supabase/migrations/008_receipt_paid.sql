-- Add paid flag to receipts
alter table receipts add column if not exists paid boolean not null default true;
