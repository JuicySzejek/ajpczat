const mongoose = require("mongoose");

class Database {
    constructor () {
        mongoose.connect('mongodb+srv://szwej:TLs0qoOEInkuB5lL@cluster0.gghgc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority');

        this.connectToMongo();
    }

    connectToMongo() {
        this.db = mongoose.connection;
        this.db.on("error", function (err) {
            console.log("Mongo ma problem");
        });
        this.db.once("open", function () {
            console.log("Mongo jest podłączone i działa!");
            // Operations.DeleteAll(Models.Game);
            // Operations.DeleteAll(Models.Player);
        });
        this.db.once("close", function () {
            console.log("Mongo zostało zamknięte.");
        });
    }
}

module.exports = Database;
