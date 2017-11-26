import {http, logger} from "../util";
import ConnectionManager from "../connectionManager";
import AuthManager from "../authManager";

class Client {
    constructor() {
        this.authManager = new AuthManager(this);
        this.connectionManager = new ConnectionManager(this);
        this.states = {DISCONNECTED: 0, SERVER_CHOICE: 1, CHARACTER_CHOICE: 2, ONLINE: 3};
        this.state = this.states.DISCONNECTED;
    }

    getAppVersion() {
        return "1.12.0";
    }

    getBuildVersion() {
        return "1.27.0";
    }

    getProxyUrl() {
        return "https://proxyconnection.touch.dofus.com";
    }

    getConfigUrl() {
        return this.getProxyUrl() + "/config.json";
    }

    fetchConfig() {
        logger.info("Fetching the configuration");

        return http.doGet(this.getConfigUrl())
            .then((resp) => resp.json())
            .then((resp) => {
                logger.debug("Configuration", this.config = resp);
                return this;
            });
    }

    loginWithUsernameAndPassword(username, password) {
        logger.info("Creating the api key");

        return this.authManager.createApiKey(username, password)
            .then(() => {
                logger.info("Creating the token");
                return this.authManager.createToken();
            }).then(() => {
                logger.info("Connecting the realm");
                return this.connectionManager.connectToRealm();
            });
    }
}

export default Client;
