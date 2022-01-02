-- カテゴリテーブル作成
create table t_category (
category_id integer primary key not null unique,
category_name varchar(20) not null,
category_color varchar(7) not null,
display_order integer not null,
enabled boolean not null
);
-- 点データセットテーブル作成
create table t_point_dataset (
point_dataset_id integer primary key not null unique,
category_id integer references t_category(category_id) not null,
point_dataset_name varchar(50) not null,
point_color_code varchar(7) not null,
entity_type varchar(50) not null,
coordinates_attr_name varchar(50) not null,
register_time_attr_name varchar(50) not null,
enabled boolean not null
);
-- 点詳細表示テーブル
create table t_point_detail (
point_detail_id integer primary key not null unique,
point_dataset_id integer references t_point_dataset(point_dataset_id) not null,
display_order integer not null,
item_attr_name varchar(50) not null,
data_type integer not null,
enabled boolean not null,
display_title varchar(50) not null
);
-- 面データセットテーブル
create table t_surface_dataset (
surface_dataset_id integer primary key not null unique,
category_id integer references t_category(category_id) not null,
surface_dataset_name varchar(50) not null,
border_color_code varchar(7) not null,
fill_color_code varchar(7) not null,
entity_type varchar(50) not null,
coordinates_attr_name varchar(50) not null,
register_time_attr_name varchar(50) not null,
enabled boolean not null
);
-- 面詳細表示テーブル
create table t_surface_detail (
surface_detail_id integer primary key not null unique,
surface_dataset_id integer references t_surface_dataset(surface_dataset_id) not null,
display_order integer not null,
item_attr_name varchar(50) not null,
enabled boolean not null,
display_title varchar(50) not null
);