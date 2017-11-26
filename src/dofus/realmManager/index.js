import {EventEmitter} from "fbemitter";

class RealmManager extends EventEmitter {
    constructor(client) {
        super();
        this.setupListeners();

        this.client = client;
    }

    setupListeners() {
        this.addListener("HelloConnectMessage", this.onHelloConnectMessage.bind(this));
        this.addListener("assetsVersionChecked", this.onAssetsVersionChecked.bind(this));
        this.addListener("LoginQueueStatusMessage", this.onLoginQueueStatusMessage.bind(this));
        this.addListener("IdentificationSuccessMessage", this.onIdentificationSuccessMessage.bind(this));
        this.addListener("ServersListMessage", this.onServersListMessage.bind(this));
    }

    onHelloConnectMessage(data) {
        this.salt = data.salt;
        this.key = data.key;
        this.send("checkAssetsVersion");
    }

    onAssetsVersionChecked() {
        this.send("login", {
            key: this.key,
            salt: this.salt,
            token: this.client.authManager.token,
            username: this.client.authManager.username
        });
    }

    onLoginQueueStatusMessage(data) {
        this.queue = {
            position: data.position,
            total: data.total
        };
    }

    onIdentificationSuccessMessage(data) {
        this.account = {
            id: data.accountId,
            nickname: data.nickname,
            secretAsk: data.secretQuestion,
            login: data.login
        };
    }

    onServersListMessage(data) {
        this.client.currentState = this.client.states.SELECTING_SERVER;

        this.servers = data.servers.map((server) => {
            return {
                id: server.id,
                name: server._name,
                charactersCount: server.charactersCount,
                isSelectable: server.isSelectable,
                status: server.status
            };
        });
    }

    send(call, data) {
        this.socket.write({call: call, data: data || {}});
    }

    sendMessage(type, data) {
        this.send("sendMessage", {type, data: data || {}});
    }

    connect() {
        return new Promise((resolve, reject) => {
            try {
                this.socket = new Primus(this.client.getProxyUrl() + "?STICKER=" + this.client.sessionId, {manual: true});

                this.socket.on("data", (data) => {
                    if (data._messageType === "serverDisconnecting") return;
                    this.emit(data._messageType, data);
                });

                this.socket.open();

                this.send("connecting", {
                    appVersion: this.client.getAppVersion(),
                    buildVersion: this.client.getBuildVersion(),
                    client: "ios",
                    language: "fr",
                    server: "login"
                });

                resolve(this.socket);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default RealmManager;
