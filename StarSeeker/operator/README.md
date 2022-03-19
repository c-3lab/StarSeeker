# StarSeekerデータ管理端末コンテナ

## 概要

StarSeekerデータ管理端末コンテナ(通称operator、コンテナ名op)は、StarSeekerのコンテナネットワークに接続するpython環境のコンテナである。以下の特徴がある。

* 地図管理データベース(PostgreSQL)やブローカー(Orion)に接続するためのPython環境を提供
* Excel (xlsx, csv)で管理されたデータをStarSeekerの地図管理データベース(PostgreSQL)とデータブローカー(Orion)に投入するStartSeekerデータ登録支援ツール`ss_conductor`を提供

## セットアップ

コンテナのセットアップについてはStarSeekerのREADMEを参照すること。

## コンテナの概要

* イメージ: python標準環境(`python:buster`)
* コンテナ名・ホスト名: `op`
* ネットワーク: `starseeker_nw` (StarSeekerが起動されている必要あり)
* 作業ディレクトリ: `/work` (ホストの`StarSeeker/operator/work`と共有)
* 起動コマンドでインストールするもの
  * `libpq-dev` (PostgreSQLクライアントライブラリ)
  * `ss_conductor`ツール
* 環境変数
  * `${DSN}`: StarSeekerのPostgreSQL接続のためのデータソース名文字列
  * `${BROKER}`: StarSeekerのOrion接続のためのエンティティリソースURI

## StarSeekerデータ登録支援ツール`ss_conductor`

`ss_conductor`はStartSeekerのOrionおよびPostgreSQLへのデータ登録、またはそれらのデータ削除を行うための支援ツールである。以下のことを行うことができる。

* データセットカテゴリ定義の登録・削除DDL(SQL)の生成およびpostgresへの送信
* データセット定義の登録・削除DDL(SQL)の生成およびpostgresへの送信
* データの登録JSONおよび削除URI生成およびorionへの送信

StarSeekerのpostgres、orionとss_conductorとの関係を以下に示す。
![`ss_conductor`の役割](img/ss_conductor.png)

### データセットカテゴリ定義の登録DDL(SQL)の生成

* DDL(SQL)の表示

```
$ ss_conductor category create tables.csv category.csv
```

* DDL(SQL)の送信

```
$ ss_conductor category create tables.csv category.csv --send ${DSN}
```

### データセットカテゴリ定義の削除DDL(SQL)の生成

* DDL(SQL)の表示

```
$ ss_conductor category delete tables.csv category.csv
```

* DDL(SQL)の送信

```
$ ss_conductor category delete tables.csv category.csv --send ${DSN}
```

### データセット定義の登録DDL(SQL)の生成

* DDL(SQL)の表示

```
$ ss_conductor dataset create tables.csv dataset.csv
```

* DDL(SQL)の送信

```
$ ss_conductor dataset create tables.csv dataset.csv --send ${DSN}
```

### データセット定義の削除DDL(SQL)の生成

* DDL(SQL)の表示

```
$ ss_conductor dataset delete tables.csv dataset.csv
```

* DDL(SQL)の送信

```
$ ss_conductor dataset delete tables.csv dataset.csv --send ${DSN}
```

### データ登録JSONの生成

* データ登録JSONの表示(JSONそのものではなくpythonデータを表示)

```
$ ss_conductor data create tables.csv data.csv
```

* データ登録JSONの送信

```
$ ss_conductor data create tables.csv data.csv --send ${BROKER}
```

### データ削除URIの生成

* データ削除URIの表示(URIそのものではなくエンティティIDのみ表示)

```
$ ss_conductor data delete tables.csv data.csv
```

* データ削除JSONの送信

```
$ ss_conductor data delete tables.csv data.csv --send ${BROKER}
```

## その他のツール

* xlsx2csv-all.sh: `${DIR}`に含まれる`*.xlsx`のすべてのシートをcsvに変換し`${OUTDIR}`に格納する

## ファイル定義

### テーブル定義ファイル(`tables.xlsx`)

* `ss_conductor`の各機能で使用
* PostgreSQLに作成するテーブル定義とデータセットカテゴリ定義ファイル、データセット定義ファイルの列の定義を含んでいる
* StarSeekerのnodef/nodebの構造に依存するので、基本的にはすでにある定義を削除するべきではない
* データセットごとの属性の追加はテーブル定義ではなくデータセット定義で行う
* 各列の悦明
  * A列: `#`であればこの行を無視
  * B列: PostgreSQLに作成するテーブル名
  * C列: PostgreSQLに作成するテーブルの列名
  * D列: PostgreSQLに作成するテーブルの型名
  * E列: PostgreSQLに作成するテーブルが主キーか(`×`以外の値が入っていれば主キーと認識)
  * F列: PostgreSQLに作成するテーブルの制約(主キー制約以外を記載)
  * G列: PostgreSQLに作成するテーブルにデータカテゴリ定義・データセット定義CSVの列をどのように投入するかを指定
    * `A`, `B`, `C`, ...: データカテゴリ定義・データセット定義CSVの該当列をそのままテーブルに投入
    * `#A`: A列の値を基準として自動採番してテーブルに投入
    * `:A*4`: A列以降を4列ごとの繰り返しとみなし、その1番目の列の値をテーブルに投入
    * `:3`: `:A*4`で指定されている繰り返しの4番目の列の値を投入
* `tables.csv`の解析についての詳細は`StarSeeker/operator/samples/ss_util/ss_conductor`の`loadtable_def()`を参照

### データセットカテゴリ定義ファイル(category.xlsx)

* データセットカテゴリを定義する
* `ss_conductor category`で使用
* 各列の悦明
  * A列: カテゴリID
  * B列: カテゴリの名前(表示名)
  * C列: カテゴリの色(ダイアログの帯の色)
  * D列: 表示順
  * E列: 有効(`〇`ならば有効)

### 点データセット定義ファイル(`point.xlsx`)

* データセットを定義する
* `ss_conductor dataset`で使用
* 各列の悦明
  * A列: 点のID
  * B列: 点が所属するカテゴリID
  * C列: 点が所属するカテゴリ名称
  * D列: 点の名称
  * E列: 点の色(地図上にポイントされるときの色)
  * F列: エンティティ種類名(Orionに登録するエンティティの種類)
  * G列: 有効(`〇`ならば有効)
  * H列: 登録座標属性のID(地図上にポイントする緯度・経度を登録する属性)
  * I列: 登録日属性のID
  * J列: その他属性1の名称
  * K列: その他属性1の属性ID
  * L列: その他属性1の属性種類(StarSeekerが使用する属性。通常は0、画像の場合は1)
  * M列: その他属性1の属性表示順
  * N～Q列: その他属性2の名称、属性ID、属性種類、属性表示順
  * R～U列: その他属性3の名称、属性ID、属性種類、属性表示順
  * V～Y列: その他属性4の名称、属性ID、属性種類、属性表示順
