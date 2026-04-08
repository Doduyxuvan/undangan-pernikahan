-- Wedding Info Table
create table if not exists wedding_info (
  id uuid default gen_random_uuid() primary key,
  groom_name text not null,
  bride_name text not null,
  groom_full_name text,
  bride_full_name text,
  groom_parents text,
  bride_parents text,
  akad_date date,
  akad_time text,
  akad_venue text,
  akad_address text,
  reception_date date not null,
  reception_time text,
  reception_venue text,
  reception_address text,
  maps_url text,
  maps_embed text,
  live_streaming_url text,
  backsound_url text,
  backsound_title text,
  bank_accounts jsonb default '[]'::jsonb,
  hero_image_url text,
  story text,
  updated_at timestamptz default now()
);

-- RSVP Table
create table if not exists rsvp (
  id uuid default gen_random_uuid() primary key,
  guest_name text not null,
  attendance text check (attendance in ('hadir', 'tidak_hadir', 'mungkin')) default 'hadir',
  guests_count int default 1,
  message text,
  created_at timestamptz default now()
);

-- Wishes Table
create table if not exists wishes (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Gallery Table
create table if not exists gallery (
  id uuid default gen_random_uuid() primary key,
  url text not null,
  caption text,
  type text default 'image' check (type in ('image', 'video', 'youtube')),
  youtube_id text,
  "order" int default 0,
  created_at timestamptz default now()
);

-- Timeline Table
create table if not exists timeline (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  date date,
  photo_url text,
  "order" int default 0
);

-- Guests Table
create table if not exists guests (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  slug text unique,
  phone text,
  notes text,
  rsvp_status text default 'belum',
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table wedding_info enable row level security;
alter table rsvp enable row level security;
alter table wishes enable row level security;
alter table gallery enable row level security;
alter table timeline enable row level security;
alter table guests enable row level security;

-- Public read policies
create policy "Public read wedding_info" on wedding_info for select using (true);
create policy "Public read gallery" on gallery for select using (true);
create policy "Public read timeline" on timeline for select using (true);
create policy "Public read wishes" on wishes for select using (true);

-- Public insert policies for RSVP and wishes
create policy "Public insert rsvp" on rsvp for insert with check (true);
create policy "Public insert wishes" on wishes for insert with check (true);

-- Sample wedding data
insert into wedding_info (
  groom_name, bride_name, groom_full_name, bride_full_name,
  groom_parents, bride_parents,
  akad_date, akad_time, akad_venue, akad_address,
  reception_date, reception_time, reception_venue, reception_address
) values (
  'Budi', 'Siti',
  'Muhammad Budi Santoso', 'Siti Rahayu Putri',
  'Putra dari Bapak Ahmad & Ibu Fatimah',
  'Putri dari Bapak Hendra & Ibu Dewi',
  '2025-06-14', '08:00', 'Masjid Al-Ikhlas', 'Jl. Mawar No. 10, Jakarta Selatan',
  '2025-06-14', '11:00', 'Gedung Serbaguna Mulia', 'Jl. Melati No. 25, Jakarta Selatan'
) on conflict do nothing;

-- Admin write policies (menggunakan service role key di API routes)
create policy "Service role full access wedding_info" on wedding_info for all using (true) with check (true);
create policy "Service role full access gallery" on gallery for all using (true) with check (true);
create policy "Service role full access rsvp" on rsvp for all using (true) with check (true);
create policy "Service role full access wishes" on wishes for all using (true) with check (true);
create policy "Service role full access guests" on guests for all using (true) with check (true);
create policy "Public read guests" on guests for select using (true);