/// <reference path="../pb_data/types.d.ts" />
migrate((db) => {
  const collection = new Collection({
    "id": "lyfhfpwoteyvl0q",
    "created": "2024-02-24 09:36:26.413Z",
    "updated": "2024-02-24 09:36:26.413Z",
    "name": "solutions",
    "type": "base",
    "system": false,
    "schema": [
      {
        "system": false,
        "id": "tjih0mdk",
        "name": "step",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "6oionmyn",
        "name": "react",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "vxdrgkob",
        "name": "author_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "pykgqc8n",
        "name": "author",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 256
        }
      },
      {
        "system": false,
        "id": "exkdf2ja",
        "name": "problem_id",
        "type": "relation",
        "required": true,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "27rpm5hb2squrua",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "yvboameb",
        "name": "reviewer_id",
        "type": "relation",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "collectionId": "_pb_users_auth_",
          "cascadeDelete": false,
          "minSelect": null,
          "maxSelect": 1,
          "displayFields": []
        }
      },
      {
        "system": false,
        "id": "tpfg6alo",
        "name": "reviewer",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 256
        }
      },
      {
        "system": false,
        "id": "0nwfmtno",
        "name": "progress",
        "type": "number",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "noDecimal": false
        }
      },
      {
        "system": false,
        "id": "yqvcny6y",
        "name": "answer",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "4hz3adzb",
        "name": "proof",
        "type": "text",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": null,
          "max": null,
          "pattern": ""
        }
      },
      {
        "system": false,
        "id": "nr0r8mwe",
        "name": "changed",
        "type": "date",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "min": "",
          "max": ""
        }
      },
      {
        "system": false,
        "id": "yyu24xbn",
        "name": "solution",
        "type": "json",
        "required": false,
        "presentable": false,
        "unique": false,
        "options": {
          "maxSize": 4192
        }
      }
    ],
    "indexes": [
      "CREATE INDEX `idx_9b6GX5m` ON `solutions` (`author_id`)",
      "CREATE INDEX `idx_EHj288d` ON `solutions` (`problem_id`)",
      "CREATE INDEX `idx_AXRtcWx` ON `solutions` (`reviewer_id`)"
    ],
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
  const collection = dao.findCollectionByNameOrId("lyfhfpwoteyvl0q");

  return dao.deleteCollection(collection);
})
