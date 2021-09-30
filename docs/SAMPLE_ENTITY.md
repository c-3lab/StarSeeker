# エンティティ登録手順

##  エンティティ投下コマンド例

```
curl -i -H 'Content-Type: application/json' -X POST http://localhost:1026/v2/op/update -d @- <<EOF
{
  "actionType": "append",
  "entities":[
  {
    "id": "XXX001",
    "type": "XXX",
    "locationName": {
      "type": "Text",
      "value": "YYY"
    },
    "address": {
      "type": "Text",
      "value": "ZZZ"
    },
    "location": {
      "type": "geo:point",
      "value": "0.0, 0.0"
    },
    "time": {
      "type": "DateTime",
      "value": "YYYY-mm-ddTHH:MM:SS+09:00"
    }
  }
  ]
}
EOF
```

## エンティティ登録確認

```
curl http://localhost:1026/v2/entities?type=XXX | jq .
```