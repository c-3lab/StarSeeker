# 管理DBデータ追加手順

## 管理DBへのログイン

- postgresデータベースに入る
```
psql -h localhost -p 5432 -U postgres -d postgres
```

## データ追加

- データ追加コマンド例

    - カテゴリテーブル
    ```
    insert into t_category (category_id,category_name,category_color,display_order,enabled) values (1, 'XXX', '#000000', 1, TRUE);
    ```

    - 点データセットテーブル
    ```
    insert into t_point_dataset (point_dataset_id,category_id,point_dataset_name,point_color_code,entity_type,coordinates_attr_name,register_time_attr_name,enabled) values (1, 1, 'XXX', '#000000', 'YYY', 'location', 'time', TRUE);
    ```

    - 点詳細表示テーブル
    ```
    insert into t_point_detail (point_detail_id,point_dataset_id,display_order,item_attr_name,data_type,enabled,display_title) values (1, 1, 1, 'address', 0, TRUE, 'ZZZ');
    ```