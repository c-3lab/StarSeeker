-- カテゴリテーブル
insert into t_category (category_id,category_name,category_color,display_order,enabled) values(1,'公共施設','#00008B',1,TRUE);
insert into t_category (category_id,category_name,category_color,display_order,enabled) values(2,'政策区域','#800000',2,TRUE);
insert into t_category (category_id,category_name,category_color,display_order,enabled) values(3,'水域情報','#65ACE4',3,TRUE);
-- 点データセットテーブル
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(1,1,'公園','#00E500','Park','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(2,1,'病院','#FF0000','Hospital','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(3,1,'交番','#00FFFF','PoliceBox','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(4,1,'公民館','#6A5ACD','CommunityCenter','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(5,1,'駐輪場','#0000CD','BicycleParking','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(6,1,'市民センター','#FFA500','CivicCenter','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(7,3,'河川','#4169E1','Stream','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(8,3,'滝','#1E90FF','Waterfall','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(9,3,'湖沼','#87CEFA','Lake','location','time',TRUE);
insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(10,3,'ダム','#AFEEEE','Dam','location','time',TRUE);
-- 点詳細表示テーブル
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(1,1,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(2,1,2,'locationName',0,TRUE,'施設名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(3,2,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(4,2,2,'locationName',0,TRUE,'施設名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(5,3,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(6,3,2,'locationName',0,TRUE,'施設名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(7,4,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(8,4,2,'locationName',0,TRUE,'施設名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(9,5,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(10,5,2,'locationName',0,TRUE,'施設名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(11,6,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(12,6,2,'locationName',0,TRUE,'施設名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(13,7,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(14,7,2,'locationName',0,TRUE,'場所名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(15,7,3,'image',1,TRUE,'画像');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(16,8,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(17,8,2,'locationName',0,TRUE,'場所名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(18,8,3,'image',1,TRUE,'画像');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(19,9,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(20,9,2,'locationName',0,TRUE,'場所名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(21,9,3,'image',1,TRUE,'画像');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(22,10,1,'address',0,TRUE,'住所');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(23,10,2,'locationName',0,TRUE,'場所名');
insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values(24,10,3,'image',1,TRUE,'画像');
-- 面データセットテーブル
insert into t_surface_dataset (surface_dataset_id,category_id,surface_dataset_name,border_color_code,fill_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(1,2,'商業地域','#000000','#006400','CommercialDistrict','location','time',TRUE);
insert into t_surface_dataset (surface_dataset_id,category_id,surface_dataset_name,border_color_code,fill_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(2,2,'都市計画区域','#000000','#3CB371','UrbanPlanningArea','location','time',TRUE);
insert into t_surface_dataset (surface_dataset_id,category_id,surface_dataset_name,border_color_code,fill_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(3,2,'第一種住宅地域','#000000','#7FFFD4','FirstResidentialArea','location','time',TRUE);
insert into t_surface_dataset (surface_dataset_id,category_id,surface_dataset_name,border_color_code,fill_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values(4,2,'景観地域','#000000','#ADFF2F','ScenicZone','location','time',TRUE);
-- 面詳細表示テーブル
insert into t_surface_detail (surface_detail_id,surface_dataset_id,display_order,item_attr_name,enabled,display_title) values(1,1,1,'cityName',TRUE,'都市名');
insert into t_surface_detail (surface_detail_id,surface_dataset_id,display_order,item_attr_name,enabled,display_title) values(2,1,2,'prefecture',TRUE,'県名');
insert into t_surface_detail (surface_detail_id,surface_dataset_id,display_order,item_attr_name,enabled,display_title) values(3,2,1,'cityName',TRUE,'都市名');
insert into t_surface_detail (surface_detail_id,surface_dataset_id,display_order,item_attr_name,enabled,display_title) values(4,2,2,'prefecture',TRUE,'県名');
insert into t_surface_detail (surface_detail_id,surface_dataset_id,display_order,item_attr_name,enabled,display_title) values(5,3,1,'cityName',TRUE,'都市名');
insert into t_surface_detail (surface_detail_id,surface_dataset_id,display_order,item_attr_name,enabled,display_title) values(6,3,2,'prefecture',TRUE,'県名');
insert into t_surface_detail (surface_detail_id,surface_dataset_id,display_order,item_attr_name,enabled,display_title) values(7,4,1,'cityName',TRUE,'都市名');
insert into t_surface_detail (surface_detail_id,surface_dataset_id,display_order,item_attr_name,enabled,display_title) values(8,4,2,'prefecture',TRUE,'県名');
