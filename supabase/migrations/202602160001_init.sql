-- Extensions
create extension if not exists "uuid-ossp";

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_url text not null default 'avatars/default.png',
  xp_global integer not null default 0,
  level_global integer not null default 1,
  xp_technique integer not null default 0,
  xp_physique integer not null default 0,
  xp_cardio integer not null default 0,
  xp_tactique integer not null default 0,
  xp_match integer not null default 0,
  club_id uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.clubs (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  city text not null,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add constraint profiles_club_fk
  foreign key (club_id)
  references public.clubs(id)
  on delete set null;

create table if not exists public.sessions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  date date not null,
  duration integer not null check (duration between 10 and 240),
  type text not null check (type in ('training', 'match', 'physical')),
  comment text,
  photo_url text,
  friend_id uuid,
  xp_awarded integer not null,
  created_at timestamptz not null default now()
);

create table if not exists public.session_skills (
  session_id uuid not null references public.sessions(id) on delete cascade,
  skill_type text not null check (skill_type in ('technique', 'physique', 'cardio', 'tactique', 'match')),
  xp_awarded integer not null check (xp_awarded >= 0),
  created_at timestamptz not null default now(),
  primary key (session_id, skill_type)
);

create table if not exists public.friendships (
  user_id uuid not null references auth.users(id) on delete cascade,
  friend_id uuid not null references auth.users(id) on delete cascade,
  status text not null check (status in ('pending', 'accepted', 'rejected')),
  created_at timestamptz not null default now(),
  primary key (user_id, friend_id),
  check (user_id <> friend_id)
);

create table if not exists public.weekly_challenges (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  description text not null,
  xp_reward integer not null,
  condition_type text not null,
  condition_target integer not null,
  start_date date not null,
  end_date date not null,
  created_at timestamptz not null default now(),
  check (start_date <= end_date)
);

create table if not exists public.challenge_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  challenge_id uuid not null references public.weekly_challenges(id) on delete cascade,
  progress integer not null default 0,
  completed_at timestamptz,
  primary key (user_id, challenge_id)
);

-- Indexes
create index if not exists idx_sessions_user_date on public.sessions(user_id, date desc);
create index if not exists idx_profiles_club_id on public.profiles(club_id);
create index if not exists idx_friendships_friend on public.friendships(friend_id, status);
create index if not exists idx_challenge_progress_user on public.challenge_progress(user_id);

-- Utility function level
create or replace function public.compute_level(xp integer)
returns integer
language sql
immutable
as $$
  select greatest(1, floor(power(greatest(xp, 0)::numeric / 100, 2.0 / 3.0))::int);
$$;

-- View for challenge progress
create or replace view public.challenge_progress_view as
select
  cp.user_id,
  c.id as challenge_id,
  c.title,
  c.description,
  c.xp_reward,
  cp.progress,
  c.condition_target as target,
  c.end_date
from public.challenge_progress cp
join public.weekly_challenges c on c.id = cp.challenge_id
where current_date between c.start_date and c.end_date;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;
alter table public.session_skills enable row level security;
alter table public.friendships enable row level security;
alter table public.clubs enable row level security;
alter table public.weekly_challenges enable row level security;
alter table public.challenge_progress enable row level security;

-- Policies
create policy "profiles_select_self_or_friends" on public.profiles
for select using (
  auth.uid() = id
  or exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.user_id = auth.uid() and f.friend_id = profiles.id) or (f.friend_id = auth.uid() and f.user_id = profiles.id))
  )
);

create policy "profiles_update_self" on public.profiles
for update using (auth.uid() = id)
with check (auth.uid() = id);

create policy "sessions_select_owner_or_friend" on public.sessions
for select using (
  auth.uid() = user_id
  or exists (
    select 1 from public.friendships f
    where f.status = 'accepted'
      and ((f.user_id = auth.uid() and f.friend_id = sessions.user_id) or (f.friend_id = auth.uid() and f.user_id = sessions.user_id))
  )
);

create policy "sessions_insert_owner" on public.sessions
for insert with check (auth.uid() = user_id);

create policy "session_skills_select_by_session_access" on public.session_skills
for select using (
  exists (
    select 1 from public.sessions s
    where s.id = session_skills.session_id
      and (
        s.user_id = auth.uid()
        or exists (
          select 1 from public.friendships f
          where f.status = 'accepted'
            and ((f.user_id = auth.uid() and f.friend_id = s.user_id) or (f.friend_id = auth.uid() and f.user_id = s.user_id))
        )
      )
  )
);

create policy "friendships_select_related" on public.friendships
for select using (auth.uid() in (user_id, friend_id));

create policy "friendships_insert_self" on public.friendships
for insert with check (auth.uid() = user_id);

create policy "friendships_update_target" on public.friendships
for update using (auth.uid() = friend_id)
with check (auth.uid() = friend_id);

create policy "clubs_read_all" on public.clubs
for select using (true);

create policy "weekly_challenges_read_all" on public.weekly_challenges
for select using (true);

create policy "challenge_progress_select_self" on public.challenge_progress
for select using (auth.uid() = user_id);

create policy "challenge_progress_mutate_self" on public.challenge_progress
for all using (auth.uid() = user_id)
with check (auth.uid() = user_id);
