module.exports = function (mongoose) {
    var Schema = mongoose.Schema;

    var messageSchema = new Schema({
        id: { type: Number, required: true },
        nick: { type: String, required: true },
        message: { type: String, required: true },
        time: { type: Date, required: true }
    })

    var userSchema = new Schema({
        nick: { type: String, required: true },
        color: { type: String, required: true }
    })

    var models = {
        Message: mongoose.model("Message", messageSchema),
        User: mongoose.model("User", userSchema),
    }

    return models;
}