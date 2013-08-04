var databaseUrl = "test";
var collections = ["users", "houses"];
var db = require("mongojs").connect(databaseUrl, collections);

db.houses.find(function(err, houses) {
    var i;
    for (i=0; i<houses.length; ++i) {
        console.log(houses[i]);
    }
});
