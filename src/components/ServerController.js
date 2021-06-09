class ServerController {
    constructor (nick) {
        this.nick = nick;
    }

    getId (showMessageCallback) {
        $.get('/getId', { nick: this.nick })
            .done((data) => {
                if (data.error == 1) {
                    this.nick = undefined;
                    this.nick = prompt(data.message + " Podaj nick: ");
                    this.getId(showMessageCallback);
                } else {
                    this.lastId = data.id;
                    this.color = data.color;
                    this.zwis(showMessageCallback);
                }
            });
    }

    zwis(showMessageCallback) {
        this.ajax = $.get('/waitForMessage', { id: this.lastId, nick: this.nick });

        this.ajax.done((data) => {
            if (data.success == 1) {
                var objMessage = data.message;
                this.lastId = objMessage.id;
                objMessage.time = new Date(objMessage.time);
                showMessageCallback({
                    message: objMessage.message, 
                    nick: objMessage.nick,
                    time: objMessage.time,
                    color: data.color
                });
            }
            this.zwis(showMessageCallback);
        });
    }

    async sendMessage (messageToSend) {
        this.ajax.abort();
        var sendMessage = $.get('/sendMessage', { nick: this.nick, message: messageToSend });

        var backMessage = await sendMessage.done((data) => {
                if (data.success == 1) {
                    this.lastId++;
                    if (this.lastId >= 1000000) this.lastId = 0;
                    return 1;
                }
            });

        return backMessage;
    }

    async setNick (newNick) {
        this.ajax.abort();
        var setNickMessage = $.get('/setNick', { oldNick: this.nick, newNick: newNick });

        var backMessage = await setNickMessage.done((data) => {
                if (data.success == 1) {
                    this.nick = newNick;
                    return {
                        code: 0,
                        success: 1
                    };
                } else if (data.error != 0) {
                    return {
                        code: data.error,
                        message: data.message
                    };
                }
                return {
                    code: 3,
                    message: "Nieobsłużony błąd"
                };
            });

        return backMessage;
    }

    async setColorOfNick (newColor) {
        this.ajax.abort();
        var setColorMessage = $.get('/setColorOfNick', { nick: this.nick, newColor: newColor });

        var backMessage = await setColorMessage.done((data) => {
                if (data.success == 1) {
                    this.color = newColor;
                    return 1;
                }
                return 0;
            });

        return backMessage;
    }

    onExitIRC () {
        if (this.nick != undefined) {
            $.get('/exitIRC', { nick: this.nick })
            .done((data) => {});
        }
    }
}