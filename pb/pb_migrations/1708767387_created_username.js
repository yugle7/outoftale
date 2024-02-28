/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "oc5afgpeetgtwzq",
    "created": "2024-02-24 09:36:26.412Z",
    "updated": "2024-02-24 09:36:26.473Z",
    "name": "username",
    "type": "view",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "pc4au8ao",
        "name": "which",
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
        "id": "owwrfivy",
        "name": "who",
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
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {
      "query": "SELECT who.id, which, who FROM (\n  SELECT 0 as id, name as which FROM which\n  ORDER BY RANDOM()\n  LIMIT 1) as which\nJOIN (\n  SELECT 0 as id, name as who FROM who\n  ORDER BY RANDOM()\n  LIMIT 1) as who\nON which.id = who.id"
    }
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("oc5afgpeetgtwzq");

  return dao.deleteCollection(collection);
})
