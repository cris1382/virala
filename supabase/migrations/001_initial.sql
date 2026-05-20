-- Users profile table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  role text default 'user',
  stripe_customer_id text,
  subscription_status text default 'free',
  created_at timestamptz default now()
);

-- Generations table
create table if not exists public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  type text check (type in ('image', 'video')),
  prompt text,
  result_url text,
  status text default 'pending',
  created_at timestamptz default now()
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.generations enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

create policy "Users can view own generations" on public.generations
  for select using (auth.uid() = user_id);

create policy "Users can insert own generations" on public.generations
  for insert with check (auth.uid() = user_id);

-- Function to auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call function on new user
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
