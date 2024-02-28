/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "yoeo4eudm9oody9",
    "created": "2024-02-24 09:36:26.413Z",
    "updated": "2024-02-24 09:36:26.473Z",
    "name": "impacts",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "w5g5hz8a",
        "name": "impact",
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
      "query": "SELECT\n  id,\n  SUM(i) AS impact\nFROM (\n  SELECT\n    reviewer_id AS id,\n    (1 + (progress = 5)) AS i\n  FROM solutions\n  WHERE reviewer_id > ''\n  UNION ALL\n  SELECT\n    author_id AS id,\n    (5 + 10 * (status > 0) + 20 * (status = 5)) AS i\n  FROM problems\n  WHERE author_id > ''\n)\nGROUP BY id"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("yoeo4eudm9oody9");

  return dao.deleteCollection(collection);
})
