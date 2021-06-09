const path = require('path');
var id = 0;
var callbackid = 0;

class Router {
    constructor (obj) {
        let app = obj.app;
        let Models = obj.Models;
        let Operations = obj.Operations;
        let callbacksArray = [];

        Operations.DeleteAll(Models.User)
        Operations.DeleteAll(Models.Message)

        setInterval(function () {
            Operations.DeleteMessagesByLowerTimeThan(Models.Message, new Date() - 10000)
        }, 1000)

        app
        .get('/', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/index.html"));
        })
        .get('/components/ServerController.js', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/components/ServerController.js"));
        })
        .get('/libs/jquery-1.4.2.min.js', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/libs/jquery-1.4.2.min.js"));
        })
        .get('/libs/jquery.cssemoticons.js', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/libs/jquery.cssemoticons.js"));
        })
        .get('/libs/jquery.cssemoticons.min.js', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/libs/jquery.cssemoticons.min.js"));
        })
        .get('/libs/jquery.tinyscrollbar.js', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/libs/jquery.tinyscrollbar.js"));
        })
        .get('/images/bg-scrollbar-thumb-y.png', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/images/bg-scrollbar-thumb-y.png"));
        })
        .get('/images/bg-scrollbar-track-y.png', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/images/bg-scrollbar-track-y.png"));
        })
        .get('/images/bg-scrollbar-trackend-y.png', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/images/bg-scrollbar-trackend-y.png"));
        })
        .get('/stylesheets/jquery.cssemoticons.css', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/stylesheets/jquery.cssemoticons.css"));
        })
        .get('/style.css', function (req, res) {
            res.sendFile(path.join(__dirname + "/../src/style.css"));
        })
        .get('/getId', function (req, res) {
            let nick = req.query.nick;
            nick = nick.trim();
            if (nick == undefined || nick == "" || nick == " ") {
                res.send({ error: 1, message: "Nick nie może być pusty." });
            } else {
                Operations.SelectUserByNick(Models.User, nick, (obj) => {
                    if (obj.data.length > 0) {
                        res.send({ error: 1, message: "Taki użytkownik już istnieje." });
                    } else {
                        var color_red = Math.floor(Math.random() * (220 + 1))
                        var color_green = Math.floor(Math.random() * (220 + 1))
                        var color_blue = Math.floor(Math.random() * (220 + 1))
            
                        var color_string = "rgb(" + color_red + "," + color_green + "," + color_blue + ")";
            
                        var user = new Models.User({
                            nick: nick,
                            color: color_string
                        });
                        Operations.InsertOne(user);
            
                        Operations.SelectLastMessage(Models.Message, function (obj) {
                            var data = obj.data;
                            if (data.length > 0) {
                                res.send({ id: data[0].id, color: color_string })
                            } else {
                                res.send({ id: id, color: color_string });
                            }
                        });
                    }
                })
            }
        })
        .get('/waitForMessage', function (req, res) {
            var nick = req.query.nick;
            var id = parseInt(req.query.id);
            var i = 0;
            var timeout = setTimeout(() => {
                let findIndexResult = callbacksArray.findIndex((x) => {
                    return x.callbackid == tempCallbackId;
                });

                if (findIndexResult != -1) {
                    callbacksArray.splice(findIndexResult, 1);
                }

                clearTimeout(timeout);
                res.send({ success: 0, message: "brak odpowiedzi" })
            }, 5000)
            if (callbackid > 1000000) callbackid = 0;
            var tempCallbackId = callbackid;
            var callbackObj = new (function () {
                this.endPolling = () => {
                    clearTimeout(this.timeout);
                    let findIndexResult = callbacksArray.findIndex((x) => {
                        return x.callbackid == this.callbackid;
                    });
    
                    if (findIndexResult != -1) {
                        callbacksArray.splice(findIndexResult, 1);
                    }
                    this.res.send({ success: 0, message: "zakończono to zapytanie" })
                }
                this.func = () => {
                    clearTimeout(this.timeout);
                    let findIndexResult = callbacksArray.findIndex((x) => {
                        return x.callbackid == this.callbackid;
                    });
    
                    if (findIndexResult != -1) {
                        callbacksArray.splice(findIndexResult, 1);
                    }
                    if (id >= 1000000) id = 0;
                    Operations.SelectMessageById(Models.Message, id+1, (obj) => {
                        var data = obj.data;
                        if (data.length > 0) {
                            Operations.SelectUserByNick(Models.User, data[0].nick, (obj) => {
                                if (obj.data.length > 0) {
                                    this.res.send({ success: 1, message: data[0], color: obj.data[0].color })
                                }
                            })
                        }
                    });
                },
                this.callbackid = callbackid++
                this.timeout = timeout
                this.nick = nick
                this.res = res
                this.checkDate = new Date()
            })
            callbacksArray.push(callbackObj);
            // res.send({ message: "wiadomość" })
        })
        .get('/sendMessage', function (req, res) {
            var message = req.query.message;
            var nick = req.query.nick;

            if (id >= 1000000) id = 0;

            var message = new Models.Message({
                id: ++id,
                nick: nick,
                message: message,
                time: new Date()
            });
            Operations.InsertOne(message, () => {
                let tempCallbacksArray = [];

                let findIndexResult = callbacksArray.findIndex((x) => {
                    return x.nick == nick;
                });

                while (findIndexResult != -1) {
                    clearTimeout(callbacksArray[findIndexResult].timeout);
                    callbacksArray.splice(findIndexResult, 1);
                    findIndexResult = callbacksArray.findIndex((x) => {
                        return x.nick == nick;
                    });
                }

                console.log(callbacksArray)

                for(var i = 0; i < callbacksArray.length; i++) {
                    tempCallbacksArray.push(callbacksArray[i]);
                }

                tempCallbacksArray.forEach(callbackObj => {
                    callbackObj.func();
                });

                res.send({ success: 1 })
            });
        })
        .get('/exitIRC', function (req, res) {
            let nick = req.query.nick;
            Operations.DeleteByNick(Models.User, nick);
            res.send({})
        })
        .get('/setNick', function (req, res) {
            var oldNick = req.query.oldNick;
            var newNick = req.query.newNick;
            newNick = newNick.trim();
            var checkDate = new Date();

            if (newNick == undefined || newNick == "" || newNick == " ") {
                res.send({ error: 1, message: "Nick nie może być pusty." });
            } else {
                Operations.SelectUserByNick(Models.User, newNick, (obj) => {
                    if (obj.data.length > 0) {
                        res.send({ error: 2, message: "Taki użytkownik już istnieje." });
                    } else {
                        let findIndexResult = callbacksArray.findIndex((x) => {
                            return x.nick == oldNick;
                        });
        
                        while (findIndexResult != -1) {
                            callbacksArray[findIndexResult].endPolling();

                            findIndexResult = callbacksArray.findIndex((x) => {
                                return x.nick == oldNick;
                            });
                        }

                        Operations.UpdateNick(Models.User, oldNick, newNick);
                        res.send({ success: 1 })
                    }
                })
            }
        })
        .get('/setColorOfNick', function (req, res) {
            var nick = req.query.nick;
            var newColor = req.query.newColor;

            Operations.UpdateColor(Models.User, nick, newColor);

            res.send({ success: 1 })
        })
    }
}

module.exports = Router;