# StarSeeker - FIWAREのデータを様々な形式で表示・管理が行えるプラットフォーム

![screenshot](img/clip.png)

アーキテクチャ図 TBD

[English README is here](README_en.md)

## 目次

- [StarSeeker - FIWAREのデータを様々な形式で表示・管理が行えるプラットフォーム](#starseeker---fiwareのデータを様々な形式で表示管理が行えるプラットフォーム)
  - [目次](#目次)
  - [本プロジェクトについて](#本プロジェクトについて)
  - [StarSeekerの始め方 クイックスタート](#starseekerの始め方-クイックスタート)
    - [概要](#概要)
    - [インストール方法](#インストール方法)
    - [サンプルデータの投入方法](#サンプルデータの投入方法)
    - [基本的な使い方](#基本的な使い方)
      - [管理者向け](#管理者向け)
      - [アプリケーション起動方法](#アプリケーション起動方法)
      - [利用者向け](#利用者向け)
      - [アプリケーション停止方法](#アプリケーション停止方法)
  - [機能](#機能)
    - [管理機能](#管理機能)
    - [利用者機能](#利用者機能)
  - [利用バージョン](#利用バージョン)

## 本プロジェクトについて

基盤ソフトウェア「[FIWARE](https://www.fiware.org/)」([ファイウェア](https://www.fiware.org/))で蓄積されたデータを、自由に、様々な形式で表示・管理を行うことで、スマートシティを実現するプラットフォーム。

## StarSeekerの始め方 クイックスタート
 
### 概要

- docker-composeで提供しております。
- docker-compose 1.16.1, docker 20.10.7 をインストール済みのUbuntu 20.04上で動作確認しております。

### インストール方法

- git clone
- 作業ディレクトリに移動

  ```
  ~/StarSeeker$ cd StarSeeker
  ```

- MongoDBとPostgreSQLのユーザ、パスワードおよび地図の初期パラメータ値(緯度、経度、ズーム値)を.envに設定

  ```
  ~/StarSeeker/StarSeeker$ cp _env .env
  ~/StarSeeker/StarSeeker$ vi .env # MongoDB、PostgreSQLのアカウントと地図の初期パラメータ値を設定
  ```

- 管理データ格納ディレクトリを作成(samplesをコピー)

  ```
  ~/StarSeeker/StarSeeker$ cp -r operator/samples/ operator/env
  ```

- 管理データ格納ディレクトリにてデータモデルおよびデータを編集
  - データモデル定義ファイル: datamodels.xlsx
  - データファイル: data.xlsx

- Dockerコンテナを展開

  ```
  ~/StarSeeker/StarSeeker$ docker-compose up -d
  ```

- データ管理用コンテナをdockerネットワークに追加

  ```
  ~/StarSeeker/StarSeeker$ cd operator
  ~/StarSeeker/StarSeeker/operator$ docker-compose up -d
  ```

- データ管理用コンテナでデータモデル定義ファイル(datamodel.xlsx)からデータモデル管理テーブル生成スクリプトを作成し、postgresコンテナで実行

  ```
  ~/StarSeeker/StarSeeker/operator$ docker exec op sh -c 'cd /work; ./setup1-op.sh'
  ~/StarSeeker/StarSeeker/operator$ docker exec postgres sh -c 'cd /work; ./setup2-postgres.sh'

  ```

- データモデルが生成されたことを以下のいずれかで確認(ハンバーガーメニューからデータセット選択可能となる)
  - ブラウザで http://Dockerホスト名:3000 に接続
  - データ管理用コンテナからpostgresにクエリを投げてテーブルを直接確認

  ```
  ~/StarSeeker/StarSeeker/operator$ docker exec postgres psql -c 'select * from t_category'
  ~/StarSeeker/StarSeeker/operator$ docker exec postgres psql -c 'select * from t_point_dataset'
  ~/StarSeeker/StarSeeker/operator$ docker exec postgres psql -c 'select * from t_point_detail'
  ~/StarSeeker/StarSeeker/operator$ docker exec postgres psql -c 'select * from t_surface_dataset'
  ~/StarSeeker/StarSeeker/operator$ docker exec postgres psql -c 'select * from t_surface_detail'
  ```

### データの投入と更新

- データ管理用コンテナでデータ(data.xlsx)からNGSI jsonを作成しorionに投入

  ```
  ~/StarSeeker/StarSeeker/operator$ docker exec op sh -c 'cd /work; ./update-op.sh'
  ```

- データが投入されていることを以下のいずれかで確認
  - ブラウザで http://Dockerホスト名:3000 に接続
  - データ管理用コンテナからorionにクエリを投げる

  ```
  ~/StarSeeker/StarSeeker/operator$ docker exec op curl -s http://orion:1026/v2/entities?limit=500
  ```

### 基本的な使い方

#### 管理者向け

- 管理DBへの反映方法
  - カラム情報<br>
    [テーブル構成を参照](docs/DB_TABLE.md)

  - 詳細情報のフィールド名とFIWARE Orionとの対応づけ
    - location(位置情報)とtime(登録時刻)を除く要素名を詳細情報テーブルに追加
      - FIWARE Orion エンティティ サンプル例
        ```
        {
          "id": "ParkId001",
          "type": "Park",
          "address": {  ※詳細表示テーブル紐づけ対象
            "type": "Text",
            "value": "ParkAddress001",
            "metadata": {}
          },
            "location": {
              "type": "geo:point",
              "value": "35.9045568476736, 139.378167943858",
              "metadata": {}
            },
            "locationName": {  ※詳細表示テーブル紐づけ対象
            "type": "Text",
            "value": "Park001",
            "metadata": {}
            },
            "time": {
            "type": "DateTime",
            "value": "2021-08-23T15:00:00.000Z",
            "metadata": {}
            }
        }
        ```
        
        - PostgreSQL 詳細表示テーブル サンプル例
        ```
        postgres=# select * from t_point_detail where point_dataset_id = 1;
        point_detail_id  | point_dataset_id | display_order | item_attr_name | data_type | enabled | display_title
        -----------------+------------------+---------------+----------------+-----------+---------+---------------
                       1 |                1 |             1 | address        |         0 | t       | 住所
                       2 |                1 |             1 | locationName   |         0 | t       | 施設名
        ```

        - Web画面 詳細表示 サンプル例<br>
          ![Sample screen display01](img/park01.png)

#### 利用者向け

- ブラウザから http://Dockerホスト名:3000 でアクセスできます。

- カテゴリの選択
  - 右端のハンバーガーメニューをクリックします。
  ![image001](img/image001.png)
  - 「データセット」をクリックします。
  ![image002](img/image002.png)
  - カテゴリ一覧が表示されることを確認します。
  ![image003](img/image003.png)
- データセットの選択
  - カテゴリ内に格納されているデータセットにチェックを付けます。
  ![image004](img/image004.png)
  - チェック後、ピンが表示されたことを確認します。
  ![image005](img/image005.png)
- 詳細情報の表示
  - ピンをクリックすると詳細情報が表示されます。<br>
  ![image006](img/image006.png)

#### アプリケーション停止方法

- データ管理用コンテナ、その他のコンテナの順にコンテナを停止

  ```
  ~/StarSeeker/StarSeeker/operator$ docker-compose down
  ~/StarSeeker/StarSeeker/operator$ cd ..
  ~/StarSeeker/StarSeeker/$ docker-compose down
  ```

## 利用バージョン

- [next 11.1.0](https://nextjs.org/)
- [react 17.0.2](https://ja.reactjs.org/)
- [typescript 4.3.5](https://www.typescriptlang.org/)
- [eslint 7.32.0](https://eslint.org/)
- [prettier 2.3.2](https://prettier.io/)
- [nestjs 8.0.0](https://nestjs.com/)
- [jest 27.0.6](https://jestjs.io/ja/)
- [Postgresql 13.3](https://www.postgresql.org/)
- [FIWARE Cygnus 2.11.0](https://fiware-cygnus.readthedocs.io/en/master/index.html)
- [FIWARE Orion 3.1.0](https://fiware-orion.readthedocs.io/en/master/index.html)
- [mongoDB 4.4.7](https://www.mongodb.com/)
- [node 16.0.0](https://nodejs.org/ja/about/releases/)

## ライセンス

- [AGPL-3.0](https://github.com/mkyutani/StarSeeker/blob/main/LICENSE)
