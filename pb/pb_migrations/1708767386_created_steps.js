/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "1etekjx96nfaszd",
    "created": "2024-02-24 09:36:26.413Z",
    "updated": "2024-02-24 09:36:26.475Z",
    "name": "steps",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ydqbtlkn",
        "name": "s1",
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
        "id": "ecluyawr",
        "name": "s2",
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
        "id": "t1rbyqep",
        "name": "s3",
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
        "id": "m8f7pt6u",
        "name": "s4",
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
        "id": "xx4fkhnk",
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
        "id": "klgixiux",
        "name": "p2",
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
        "id": "1eq21ljj",
        "name": "p3",
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
        "id": "c6mmmbdc",
        "name": "p4",
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
      "query": "SELECT\n  id,\n  SUM((s > 0) * c) AS s1,\n  SUM((s > 1) * c) AS s2,\n  SUM((s > 2) * c) AS s3,\n  SUM((s > 3) * c) AS s4,\n  SUM(p * (s = 1) * c) AS p1,\n  SUM(p * (s = 2) * c) AS p2,\n  SUM(p * (s = 3) * c) AS p3,\n  SUM(p * (s = 4) * c) AS p4\nFROM (\n  SELECT\n    id, p, s,\n    COUNT(*) AS c\n  FROM (\n    SELECT\n      problem_id AS id,\n      (progress = 5) AS p,\n      MIN(4, step / 2) AS s\n    FROM solutions\n    WHERE step > 1\n  )\n  GROUP BY id, p, s\n)\nGROUP BY id"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("1etekjx96nfaszd");

  return dao.deleteCollection(collection);
})
