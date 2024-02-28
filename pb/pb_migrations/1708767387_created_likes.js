/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "ryy5wmm5v6nr09l",
    "created": "2024-02-24 09:36:26.413Z",
    "updated": "2024-02-24 09:36:26.474Z",
    "name": "likes",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "cof3dqkq",
        "name": "r0",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "lky3x35h",
        "name": "r1",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "yjxykeax",
        "name": "r2",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "dcxg8wgm",
        "name": "p0",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "kzjp5zdt",
        "name": "p1",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      },
      {
        "system": false,
        "id": "zri1lf3l",
        "name": "p2",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 1
        }
      }
    ],
    "indexes": [],
    "listRule": null,
    "viewRule": null,
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT\n  id,\n  SUM((1 - p) * (r = 0) * c) AS r0,\n  SUM((1 - p) * (r = 1) * c) AS r1,\n  SUM((1 - p) * (r = 2) * c) AS r2,\n  SUM(p * (r = 0) * c) AS p0,\n  SUM(p * (r = 1) * c) AS p1,\n  SUM(p * (r = 2) * c) AS p2\nFROM (\n  SELECT\n    id, p, r,\n    COUNT(*) AS c\n  FROM (\n    SELECT\n      problem_id AS id,\n      (progress = 5) AS p,\n      react as r\n    FROM solutions\n  )\n  GROUP BY id, p, r\n)\nGROUP BY id"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("ryy5wmm5v6nr09l");

  return dao.deleteCollection(collection);
})
