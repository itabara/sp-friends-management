const mongodb = require("mongodb").MongoClient;
const EventEmitter = require("events");

class Emitter extends EventEmitter {};

var exports = new Emitter();
exports.db = null;

exports.setMaxListeners(100);

var url = "mongodb://mongodb/friends-management";
mongodb.connect(url, function (err, db) {
  if (err) {
    console.log('Unable to connect to the mongoDB server. Error:', err);
  } else {
    exports.db = db;
    console.log("Connected OK");
    exports.emit("connected");
  }
});
console.log("Connecting to database...");


module.exports = exports;
