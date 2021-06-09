module.exports = function () {
    var opers = {
        InsertOne: function (data, callback) {
            data.save(function (error, data) {
                if (callback) {
                    callback();
                }
                // console.log("dodano " + data)
            })
        },

        SelectAll: function (Model, callback) {
            var obj = {};
            Model.find({}, function (err, data) {
                if (err) {
                    obj.data = err;
                } else {
                    obj.data = data;
                }
                callback(obj);
            })
        },

        SelectAndLimit: function (Model, count, callback) {
            var obj = {};
            Model.find({}, function (err, data) {
                if (err) obj.data = err;
                else obj.data = data;
                callback(obj);
            }).limit(count)
        },

        SelectLastMessage: function (Model, callback) {
            var obj = {};
            Model.find().sort({time:-1}).limit(1).exec(function (err, data) {
                if (err) obj.data = err;
                else obj.data = data;
                callback(obj);
              })
        },

        SelectMessageById: function (Model, message_id, callback) {
            var obj = {};
            Model.find({ id: message_id }, function (err, data) {
                if (err) obj.data = err;
                else obj.data = data;
                callback(obj);
            }).limit(1)
        },

        SelectUserByNick: function (Model, nick, callback) {
            var obj = {};
            Model.find({ nick: nick }, function (err, data) {
                if (err) obj.data = err;
                else obj.data = data;
                callback(obj);
            }).limit(1)
        },

        DeleteAll: function (Model) {
            Model.remove(function (err, data) {
                if (err) return console.error(err);
            })
        },

        DeleteByNick: function (Model, nick) {
            Model.deleteOne({ nick: nick }, function (err, data) {
                if (err) return console.error(err);
            })
        },

        DeleteMessagesByLowerTimeThan: function (Model, date1) {
            var obj = {};
            Model.deleteOne({ time: {
                    $lte: date1
                }
            }, function (err, data) {
                if (err) return console.error(err);
              })
        },

        DeleteById: function (Model, _id) {
            Model.remove({ _id: _id }, function (err, data) {
                if (err) return console.error(err);
            })
        },

        DeleteFirst: function (Model) {
            Model.deleteOne({}, function (err, data) {
                if (err) return console.error(err);
            })
        },

        UpdateNick: function (Model, old_nick, new_nick) {
            Model.update({ nick: old_nick }, { nick: new_nick }, function (err) {
                if (err) return console.error(err);
            })
        },

        UpdateColor: function (Model, nick, new_color) {
            Model.update({ nick: nick }, { color: new_color }, function (err) {
                if (err) return console.error(err);
            })
        },
    }

    return opers;

}