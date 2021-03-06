# 管理DBテーブル構成

## カテゴリテーブル (t_category) 
利用用途 : カテゴリ分類を管理

```
No |主キー|外部キー |ユニークキー  |カラム名       |項目名     |項目概要                        |データ型  |桁数|NotNullの有無|備考
---+------+--------+------------+--------------+-----------+--------------------------------+---------+----+-------------+---
1  |〇    |-       |〇          |category_id   |カテゴリID  |検索カテゴリ識別子                |integer  |6   |〇           |
---+------+--------+------------+--------------+-----------+--------------------------------+---------+----+-------------+---
2  |-     |-       |-           |category_name |名前       |カテゴリ名称                      |varchar  |6   |〇           |
---+------+--------+------------+--------------+-----------+--------------------------------+---------+----+-------------+---
3  |-     |-       |-           |category_color|カテゴリ色  |カテゴリメニュー表示カラーコード   |varchar  |7   |〇           |※1
---+------+--------+------------+--------------+-----------+--------------------------------+---------+----+-------------+---
4  |-     |-       |-           |display_order |表示位置    |カテゴリメニューの表示順          |integer  |3   |〇           |※2
---+------+--------+------------+--------------+-----------+--------------------------------+---------+----+-------------+---
5  |-     |-       |-           |enabled       |有効フラグ  |データ表示の有効/無効を管理       |boolean  |-   |〇           |

※1 HTMLカラーコード(#000000)が格納できる文字列7桁を確保する。
※2 カテゴリの表示順を格納する。
```

テーブル格納例
```
category_id | category_name | category_color | display_order | enabled
-------------+---------------+----------------+---------------+---------
            1 | 公共施設      | #00008B        |             1 | t
            2 | 獣害情報      | #FFFC30        |             2 | t
            3 | 市町村情報    | #FFFC30        |             3 | t
```

## 点データセットテーブル (t_point_dataset)  
利用用途 : 点データのタイプ名を管理

```
No |主キー|外部キー |ユニークキー |カラム名                |項目名                |項目概要                          |データ型 |桁数|NotNullの有無|備考
---+------+--------+------------+------------------------+---------------------+---------------------------------+---------+----+-------------+---
1  |〇    |-       |〇          |point_dataset_id        |点データセットID      |点データセット識別子               |integer  |6   |〇           |
---+------+--------+------------+------------------------+---------------------+---------------------------------+---------+----+-------------+---
2  |-     |〇      |-           |category_id             |カテゴリID            |検索カテゴリ識別子                |integer  |6   |〇           |
---+------+--------+------------+------------------------+---------------------+---------------------------------+---------+----+-------------+---
3  |-     |-       |-           |point_dataset_name      |名前                 |点データの名称                    |varchar  |50  |〇           |
---+------+--------+------------+------------------------+---------------------+---------------------------------+---------+----+-------------+---
4  |-     |-       |-           |point_color_code        |点の色コード          |地図に表示する点のカラーコード     |varchar  |7   |〇           |※1
---+------+--------+------------+------------------------+---------------------+---------------------------------+---------+----+-------------+---
5  |-     |-       |-           |entity_type             |Type名               |FIWARE OrionエンティティのType名  |varchar  |50  |〇           |
---+------+--------+------------+------------------------+---------------------+---------------------------------+---------+----+-------------+---
6  |-     |-       |-           |coordinates_attr_name   |座標フィールド名      |点データの表示位置(緯度経度)       |varchar  |50  |〇           |
---+------+--------+------------+------------------------+---------------------+---------------------------------+---------+----+-------------+---
7  |-     |-       |-           |register_time_attr_name |登録時間フィールド名  |点データが登録された日時           |varchar  |50  |〇           |
---+------+--------+------------+------------------------+---------------------+---------------------------------+---------+----+-------------+---
8  |-     |-       |-           |enabled                 |有効フラグ           |データ表示の有効/無効を管理        |boolean   |-   |〇           |

※1 HTMLカラーコード(#000000)が格納できる文字列7桁を確保する。
```

テーブル格納例
```
point_dataset_id | category_id | point_dataset_name | point_color_code |   entity_type    | coordinates_attr_name | register_time_attr_name | enabled
------------------+-------------+--------------------+------------------+------------------+-----------------------+-------------------------+---------
                 1 |           1 | 公園               | #00E500          | Park             | location              | time                    | t
                 2 |           1 | 病院               | #FF0000          | Hospital         | location              | time                    | t
                 3 |           2 | 獣害出没情報       | #FFFC30          | NuisanceWildlife | location              | time                    | t
```
    
## 点詳細表示テーブル (t_point_detail) 
利用用途 : 点データの詳細表示フィールドを管理

```
No |主キー|外部キー |ユニークキー |カラム名          |項目名           |項目概要                                |データ型 |桁数|NotNullの有無|備考
---+------+--------+------------+-----------------+-----------------+---------------------------------------+---------+----+-------------+---
1  |〇    |-       |〇          |point_detail_id  |詳細表示ID        |詳細表示ポップアップ項目識別子           |integer  |6   |〇           |
---+------+--------+------------+-----------------+-----------------+---------------------------------------+---------+----+-------------+---
2  |-     |〇      |-           |point_dataset_id |データセットID    |データセット識別子                       |integer  |6   |〇           |
---+------+--------+------------+-----------------+-----------------+---------------------------------------+---------+----+-------------+---
3  |-     |-       |-           |display_order    |表示順           |詳細表示ポップアップ時の項目表示順        |integer  |3   |〇           |※1
---+------+--------+------------+-----------------+-----------------+---------------------------------------+---------+----+-------------+---
4  |-     |-       |-           |item_attr_name   |項目フィールド名  |FIWARE Orionエンティティの要素名を格納   |varchar  |50  |〇           |※2
---+------+--------+------------+-----------------+-----------------+---------------------------------------+---------+----+-------------+---
5  |-     |-       |-           |data_type        |データタイプ      |ポップアップ表示時のText/画像表示管理    |integer  |1   |〇           |※3
---+------+--------+------------+-----------------+-----------------+---------------------------------------+---------+----+-------------+---
6  |-     |-       |-           |enabled          |有効フラグ        |詳細表示の有効/無効を管理               |boolean   |-   |〇           |
---+------+--------+------------+-----------------+-----------------+---------------------------------------+---------+----+-------------+---
7  |-     |-       |-           |display_title    |表示名           |ポップアップ時の詳細表示項目名           |varchar   |50  |〇           |

※1 ポップアップ時に表示する各項目名の順番(数字)を格納する。			
※2 データセットテーブルにないカラムを格納する。			
※3 Textを表示する場合は0,画像を表示する場合は1を格納する。			
```

テーブル格納例
```
point_detail_id  | point_dataset_id | display_order | item_attr_name | data_type | enabled | display_title
-----------------+------------------+---------------+----------------+-----------+---------+---------------
                 1 |                1 |             1 | address        |         0 | t       | 住所
                 2 |                1 |             1 | locationName   |         0 | t       | 施設名
                 3 |                2 |             1 | address        |         0 | t       | 住所
                 4 |                2 |             1 | locationName   |         0 | t       | 施設名
                 5 |                3 |             1 | animalCategory |         0 | t       | 動物種別
                 6 |                3 |             1 | animalName     |         0 | t       | 動物名
```

## 面データセットテーブル (t_surface_dataset) 
利用用途 : 面データのタイプ名を管理

```
No |主キー |外部キー|ユニークキー |カラム名                 |項目名                   |項目概要                                    |データ型 |桁数|NotNullの有無|備考
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
1  |〇    |-       |〇          |surface_dataset_id      |点データセットID          |点データセット識別子                         |integer  |6   |〇           |
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
2  |-     |〇      |-           |category_id             |カテゴリID                |検索カテゴリ識別子                          |integer  |6   |〇           |
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
3  |-     |-       |-           |surface_dataset_name    |名前                     |点データの名称                              |varchar  |50  |〇           |
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
4  |-     |-       |-           |border_color_code       |面の枠線の色コード        |地図上に表示する面の枠線のカラーコード        |varchar  |7   |〇           |※1
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
5  |-     |-       |-           |fill_color_code         |面の塗りつぶしの色コード  |地図上に表示する面の塗りつぶしカラーコード     |varchar  |7   |〇           |※1
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
6  |-     |-       |-           |entity_type             |Type名                   |FIWARE OrionエンティティのType名            |varchar  |50  |〇           |
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
7  |-     |-       |-           |coordinates_attr_name   |座標フィールド名          |面データの表示位置(緯度経度の配列)            |varchar  |50  |〇           |
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
8  |-     |-       |-           |register_time_attr_name |登録時間フィールド名      |点データが登録された日時                      |varchar  |50  |〇           |
---+------+--------+------------+------------------------+-------------------------+-------------------------------------------+---------+----+-------------+---
9  |-     |-       |-           |enabled                 |有効フラグ                |データ表示の有効/無効を管理                  |boolean  |-   |〇           |

※1 HTMLカラーコード(#000000)が格納できる文字列7桁を確保する。
```

テーブル格納例
```
surface_dataset_id  | category_id | surface_dataset_name | border_color_code | fill_color_code | entity_type | coordinates_attr_name | register_time_attr_name | enabled
--------------------+-------------+----------------------+-------------------+-----------------+-------------+-----------------------+-------------------------+---------
                    1 |           3 | 埼玉県               | #000000           | #006400         | City        | location              | time                    | t
```

## 面詳細表示テーブル (t_surface_detail) 
利用用途 : 面データの詳細表示フィールドを管理

```
No |主キー |外部キー |ユニークキー|カラム名            |項目名           |項目概要                                |データ型 |桁数|NotNullの有無|備考
---+------+--------+------------+-------------------+-----------------+---------------------------------------+---------+----+-------------+---
1  |〇    |-       |〇          |surface_detail_id  |詳細表示ID        |詳細表示ポップアップ項目識別子           |integer  |6   |〇           |
---+------+--------+------------+-------------------+-----------------+---------------------------------------+---------+----+-------------+---
2  |-     |〇      |-           |surface_dataset_id |データセットID    |データセット識別子                      |integer  |6   |〇           |
---+------+--------+------------+-------------------+-----------------+---------------------------------------+---------+----+-------------+---
3  |-     |-       |-           |display_order      |表示順           |詳細表示ポップアップ時の項目表示順        |integer  |3   |〇           |※1
---+------+--------+------------+-------------------+-----------------+---------------------------------------+---------+----+-------------+---
4  |-     |-       |-           |item_attr_name     |項目フィールド名  |FIWARE Orionエンティティの要素名を格納   |varchar  |50  |〇           |※2
---+------+--------+------------+-------------------+-----------------+---------------------------------------+---------+----+-------------+---
5  |-     |-       |-           |enabled            |有効フラグ        |詳細表示の有効/無効を管理               |boolean  |-   |〇           |
---+------+--------+------------+-------------------+-----------------+---------------------------------------+---------+----+-------------+---
6  |-     |-       |-           |display_title      |表示名           |ポップアップ時の詳細表示項目名           |varchar  |50  |〇           |

※1 ポップアップ時に表示する各項目名の順番(数字)を格納する。			
※2 データセットテーブルにないカラムを格納する。			
```

テーブル格納例
```
surface_detail_id  | surface_dataset_id | display_order | item_attr_name | enabled | display_title
-------------------+--------------------+---------------+----------------+---------+---------------
                   1 |                  1 |             1 | cityName       | t       | 都市名
                   2 |                  1 |             1 | prefecture     | t       | 県名
```