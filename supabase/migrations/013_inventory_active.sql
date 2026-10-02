-- Add active flag to inventory; existing rows default to active
alter table inventory
  add column if not exists active boolean not null default true;
