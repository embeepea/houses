var databaseUrl = "test";
var collections = ["users", "houses"];
var db = require("mongojs").connect(databaseUrl, collections);
var $ = require('jquery').create();

var deferred = $.Deferred();
var promise = deferred.promise();

db.houses.save({'name' : 'Mark', 'unit' : 'feet'}, function(err, value) {
    if (err) {
        console.log('got an error: ' + err);
    } else {
        deferred.resolve(value);
    }
});

promise.done(function(value) {
    console.log('hey hey');
    console.log(value);
});
