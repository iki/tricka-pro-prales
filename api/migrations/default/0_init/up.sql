set
    check_function_bodies = false;

-- enums
create table
    public.gender_keys(id text primary key);

create table
    public.color_keys(id text primary key);

create table
    public.size_keys(id text primary key);

create table
    public.delivery_keys (id text primary key);

create table
    public.reward_keys (id text primary key);

-- t-shirts
create table
    public.tshirts (
        id text primary key,
        "order" integer unique,
        color text references public.color_keys(id) not null,
        gender text references public.gender_keys(id) not null,
        name text not null
    );

-- rewards
create table
    public.rewards (
        id text primary key references public.reward_keys(id),
        "order" integer unique,
        max_tshirts integer not null,
        min_pledge integer not null,
        tshirt text references public.tshirts(id),
        -- nullable (optional) reference
        name text not null
    );

-- users
create table
    public.users (
        email text primary key,
        is_organizer boolean not null default false,
        is_tester boolean not null default false,
        name text not null,
        pledge integer not null default 0,
        token text not null
    );

create index
    name
    on public.pledges using btree (name);

create index
    token
    on public.pledges using btree (token);

create index
    pledge
    on public.pledges using btree (pledge);

-- pledges
create sequence
    public.pledges_id_seq cache 10;

create table
    public.pledges (
        id integer primary key default nextval('public.pledges_id_seq'),
        is_test boolean not null default false,
        date date not null,
        email text references public.users(email) not null,
        name text not null,
        amount integer not null,
        reward_id text references public.rewards(id) not null,
        note text
    );

create index
    email
    on public.pledges using btree (email);

create index
    date
    on public.pledges using btree (date);

create index
    amount
    on public.pledges using btree (amount);

-- surveys
create function
    public.updated_at() returns trigger language plpgsql as $$ begin
    new.updated_at = now();
    return new;
end; $$;

-- selected t-shirts
create table
    public.selected_tshirts (
        is_test boolean not null default false,
        token text references public.users(token) not null,
        index integer not null,
        tshirt text references public.tshirts(id),
        gender text references public.gender_keys(id),
        color text references public.color_keys(id),
        size text references public.size_keys(id),
        created_at timestamp default now(),
        updated_at timestamp,
        unique (token, index),
        check (index >= 0) -- check (index <= max_tshirts)
    );

create event trigger
    public.selected_tshirts_updated_trigger before
update
    on public.selected_thirts for each row
execute
    function public.updated_at();

-- selected uniques
create table
    public.selected_uniques (
        is_test boolean not null default false,
        reward text references public.rewards(id) not null,
        id integer not null,
        token text references public.users(token) not null,
        index integer not null,
        created_at timestamp default now(),
        updated_at timestamp,
        unique (reward, token, index),
        unique (reward, id, is_test),
        check (id >= 0),
        check (index >= 0)
    );

create event trigger
    public.selected_uniques_updated_trigger before
update
    on public.selected_uniques for each row
execute
    function public.updated_at();