create table if not exists
public.chronex_product_data (
    product_id uuid not null default gen_random_uuid(),
    product_name text null,
    img JSONB null,
    discount double precision null,
    supplier_price double precision null,
    original_price double precision null,
    discounted_price double precision null,
    description1 text null,
    description2 JSONB null,
    original_quantity double precision null,
    current_quantity double precision null,
    product_status text null,
    product_sold double precision null,
    product_freebies JSONB null,
    category text null,
    created_by uuid null,
    created_at timestamp with time zone null,
    updated_by uuid null,
    updated_at timestamp with time zone null,
    deleted_at timestamp with time zone null,
    constraint chronex_product_data_pkey primary key (product_id)
) tablespace pg_default;

create table if not exists
public.chronex_product_freebies (
    freebies_id uuid not null default gen_random_uuid(),
    freebies_name text null,
    freebies_img bytea null,
    freebies_store_price double precision null,
    freebies_original_quantity double precision null,
    freebies_current_quantity double precision null,
    freebies_status text null,
    created_by uuid null,
    created_at timestamp with time zone null,
    updated_by uuid null,
    updated_at timestamp with time zone null,
    deleted_at timestamp with time zone null,
    constraint chronex_product_freebies_pkey primary key (freebies_id)
) tablespace pg_default;

create table if not exists
public.chronex_product_reviews (
    reviews_id uuid not null default gen_random_uuid(),
    product_id uuid null,
    reviews_name text null,
    reviews_subject text null,
    reviews_message text null,
    reviews_star_rating integer null,
    reviews_status text null,
    created_by uuid null,
    created_at timestamp with time zone null,
    updated_by uuid null,
    updated_at timestamp with time zone null,
    deleted_at timestamp with time zone null,
    constraint chronex_product_reviews_pkey primary key (reviews_id)
) tablespace pg_default;

create table if not exists
public.chronex_product_order (
    order_id uuid not null default gen_random_uuid(),
    customer JSONB null,
    complete_address JSONB null,
    product JSONB null,
    total double precision null,
    order_status text null,
    tracking_id text null,
    sticky_notes JSONB null,
    created_by uuid null,
    created_at timestamp with time zone null,
    updated_by uuid null,
    updated_at timestamp with time zone null,
    deleted_at timestamp with time zone null,
    constraint chronex_product_order_pkey primary key (order_id)
) tablespace pg_default;

create table if not exists
public.chronex_product_home_images (
    home_images_id uuid not null default gen_random_uuid(),
    home_img JSONB null,
    created_by uuid null,
    created_at timestamp with time zone null,
    updated_by uuid null,
    updated_at timestamp with time zone null,
    deleted_at timestamp with time zone null,
    constraint chronex_product_home_images_pkey primary key (home_images_id)
) tablespace pg_default;

-- ALTER TABLE public.chronex_product_order
-- ADD COLUMN sticky_notes JSONB NULL;

ALTER TABLE public.chronex_product_data
ADD COLUMN category text NULL;