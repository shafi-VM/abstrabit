-- Smart Bookmark App Database Schema
-- Run this in Supabase SQL Editor

create extension if not exists "pgcrypto";

create table public.bookmarks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  url text not null,
  title text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);

create index bookmarks_user_id_idx on public.bookmarks(user_id);
create index bookmarks_created_at_idx on public.bookmarks(created_at desc);

alter table public.bookmarks enable row level security;

create policy "Users can view own bookmarks"
  on public.bookmarks for select
  using (auth.uid() = user_id);

create policy "Users can insert own bookmarks"
  on public.bookmarks for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookmarks"
  on public.bookmarks for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users can delete own bookmarks"
  on public.bookmarks for delete
  using (auth.uid() = user_id);

create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_bookmarks_updated_at
before update on public.bookmarks
for each row
execute procedure public.update_updated_at_column();

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.bookmarks to authenticated;
