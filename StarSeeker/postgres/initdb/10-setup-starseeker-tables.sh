#!/usr/bin/env bash

create_table() {
    table_name=$1
    table_def=$2
    table_status=$(psql -t -A -c "select count(*) from information_schema.tables where table_name = '${table_name}'")
    echo Creating ${table_name} ...
    if [[ $table_status == 0 ]]; then
        psql -t -A -c "${table_def}"
    else
        echo ${table_name} already exists.
    fi
}

create_table t_tenant "create table t_tenant (\
tenant_id serial primary key not null unique,\
tenant_name varchar(50) not null unique\
);"

create_table t_service_path "create table t_service_path (\
service_path_id serial primary key not null unique,\
tenant_id integer references t_tenant(tenant_id) not null,\
service_path_name varchar(550) not null unique\
);"

create_table t_category "create table t_category (\
category_id integer primary key not null unique,\
service_path_id integer references t_service_path(service_path_id) not null,\
category_name varchar(50) not null,\
category_color varchar(32) not null,\
display_order integer not null,\
enabled boolean not null\
);"

create_table t_point_dataset "create table t_point_dataset (\
point_dataset_id integer primary key not null unique,\
category_id integer references t_category(category_id) not null,\
service_path_id integer references t_service_path(service_path_id) not null,\
point_dataset_name varchar(50) not null,\
point_color_code varchar(32) not null,\
entity_type varchar(50) not null,\
coordinates_attr_name varchar(50) not null,\
register_time_attr_name varchar(50) not null,\
enabled boolean not null\
);"

create_table t_point_detail "create table t_point_detail (\
point_detail_id integer primary key not null unique,\
point_dataset_id integer references t_point_dataset(point_dataset_id) not null,\
item_attr_name varchar(50) not null,\
data_type integer not null,\
display_title varchar(50) not null,\
display_order integer not null,\
enabled boolean not null\
);"

create_table t_surface_dataset "create table t_surface_dataset (\
surface_dataset_id integer primary key not null unique,\
category_id integer references t_category(category_id) not null,\
service_path_id integer references t_service_path(service_path_id) not null,\
surface_dataset_name varchar(50) not null,\
border_color_code varchar(32) not null,\
fill_color_code varchar(32) not null,\
entity_type varchar(50) not null,\
coordinates_attr_name varchar(50) not null,\
register_time_attr_name varchar(50) not null,\
enabled boolean not null\
);"

create_table t_surface_detail "create table t_surface_detail (\
surface_detail_id integer primary key not null unique,\
surface_dataset_id integer references t_surface_dataset(surface_dataset_id) not null,\
item_attr_name varchar(50) not null,\
display_title varchar(50) not null,\
display_order integer not null,\
enabled boolean not null\
);"

