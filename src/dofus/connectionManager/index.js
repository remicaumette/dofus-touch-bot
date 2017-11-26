import {logger} from "../util";

class ConnectionManager {
    constructor(client) {
        this.client = client;
    }

    setupBasicSocket() {
        return new Promise((resolve, reject) => {
            let Socket = Primus.createSocket({parser: "json", transformer: "engine.io"});
            let primus = new Socket(this.client.getProxyUrl());

            primus.on("open", () => {
                logger.info("A new connection is open")
            });

            primus.on("data", (data) => {
                logger.debug(data);
            });

            primus.on("error", function error(err) {
                logger.error("", err)
            });

            primus.on("end", () => {
                logger.info("A connection is close")
            });

            primus.open();

            return primus;
        });
    }

    connectToRealm() {
        return this.setupBasicSocket().then((connection) => {
            this.realmConnection = connection;
            return this.client;
        });
    }
}

export default ConnectionManager;
