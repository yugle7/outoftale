/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "o3t8y8r5ea8osdu",
    "created": "2024-02-24 09:36:26.413Z",
    "updated": "2024-02-24 09:36:26.413Z",
    "name": "which",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "fo7fiw5p",
        "name": "name",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": null,
    "updateRule": null,
    "deleteRule": null,
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("o3t8y8r5ea8osdu");

  return dao.deleteCollection(collection);
})
