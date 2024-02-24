/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "khxo995iyyy2lr8",
    "created": "2024-02-24 09:36:26.415Z",
    "updated": "2024-02-24 09:36:26.476Z",
    "name": "ratings",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "ssgalx2x",
        "name": "position",
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
        "id": "utv0n7vt",
        "name": "rating",
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
      "query": "SELECT\n  id,\n  (ROW_NUMBER() OVER(ORDER BY -rating, changed)) AS position,\n  rating\nFROM (\n  SELECT\n    id,\n    SUM(weight) AS rating,\n    MAX(changed) AS changed\n  FROM (\n    SELECT\n      author_id AS id,\n      problem_id,\n      changed\n    FROM solutions\n    WHERE progress=5\n  ) AS s\n  INNER JOIN (\n    SELECT\n      id as problem_id,\n      weight\n    FROM problems\n    WHERE weight > 0\n  ) AS p\n  on p.problem_id = s.problem_id\n  GROUP BY id\n)"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("khxo995iyyy2lr8");

  return dao.deleteCollection(collection);
})
