var databaseUrl = "test";
var collections = ["users", "houses"];
var mongodb = require('mongodb');
var db = require("mongojs").connect(databaseUrl, collections);
var fs = require('fs');

db.houses.find({'_id' : mongodb.ObjectID('51fc208d69d530d467d8076f')}, function(err, houses) {
  console.log(houses);
});
