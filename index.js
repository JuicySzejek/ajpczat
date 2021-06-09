const express = require('express');
const mongoose = require("mongoose");
const PORT = process.env.PORT || 3000;

let app = express();
const Operations = require("./database/Operations.js")();
const Models = require("./database/Models.js")(mongoose);
const Router = require("./server_files/Router.js");
const Database = require("./database/Database.js");

var bodyParser = require('body-parser');
app.use(bodyParser.json());

var db = new Database();
new Router({ app: app, Operations: Operations, Models: Models });

module.exports = app;
app.listen(PORT, function () { 
    console.log(" === Serwer zostaje uruchomiony na porcie " + PORT + ".");
})
