var databaseUrl = "test";
var collections = ["users", "houses"];
var db = require("mongojs").connect(databaseUrl, collections);
var fs = require('fs');


db.houses.find(function(err, houses) {
    fs.writeFile('houses.json', JSON.stringify(houses), function (err) {
        if (err) throw err;
        console.log('wrote houses.json');
        process.exit();
    });
});
