-- 1. USERS & SESSIONS (Required for Auth.js / NextAuth)
create table users (
  id uuid default gen_random_uuid() primary key,
  name text,
  email text unique,
  "emailVerified" timestamp,
  image text,
  company_logo text,
  business_name text,
  is_premium boolean default false,
  premium_until timestamp,
  password_hash text,
  created_at timestamp default current_timestamp not null
);

create table accounts (
  id uuid default gen_random_uuid() primary key,
  "userId" uuid references users(id) on delete cascade not null,
  type text not null,
  provider text not null,
  "providerAccountId" text not null,
  refresh_token text,
  access_token text,
  expires_at integer,
  token_type text,
  scope text,
  id_token text,
  session_state text
);

create table sessions (
  id uuid default gen_random_uuid() primary key,
  "sessionToken" text unique not null,
  "userId" uuid references users(id) on delete cascade not null,
  expires timestamp not null
);

-- NextAuth table for EmailProvider (Passwordless Sign-In)
create table verification_token (
  identifier text not null,
  token text not null,
  expires timestamp not null,
  primary key (identifier, token)
);

-- 2. JOBS / DELIVERIES TABLE
create table jobs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null, -- The business owner who created the job
  client_name text not null,
  client_email text not null,
  job_description text not null,
  status text default 'pending' check (status in ('pending', 'completed')),
  delivery_photo_url text,
  signature_photo_url text,
  signed_at timestamp,
  is_deleted boolean default false,
  created_at timestamp default current_timestamp not null
);

-- 3. STRIPE SUBSCRIPTIONS TABLE
create table subscriptions (
  id text primary key,
  user_id uuid references users(id) on delete cascade not null,
  status text,
  price_id text,
  current_period_end timestamp
);

create table gcash_payment_requests (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references users(id) on delete cascade not null,
  amount_cents integer not null,
  status text default 'pending' check (status in ('pending', 'awaiting_verification', 'confirmed', 'rejected')),
  requested_at timestamp default current_timestamp not null,
  confirmed_at timestamp,
  unique (user_id)
);
