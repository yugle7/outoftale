/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "xgdykglty7qbum7",
    "created": "2024-02-24 09:36:26.415Z",
    "updated": "2024-02-24 09:36:26.415Z",
    "name": "positions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "jlmfpyhw",
        "name": "users",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      }
    ],
    "indexes": [],
    "listRule": "",
    "viewRule": "",
    "createRule": "",
    "updateRule": "",
    "deleteRule": "",
    "options": {}
  });

  return Dao(db).saveCollection(collection);
}, (db) => {
  const dao = new Dao(db);
  const collection = dao.findCollectionByNameOrId("xgdykglty7qbum7");

  return dao.deleteCollection(collection);
})
