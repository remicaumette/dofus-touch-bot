import {http, logger} from "../util";
import Client from "../client";

class AuthManager {
    constructor(client) {
        this.client = client;
    }

    getHaapiUrl() {
        return "https://haapi.ankama.com/json/Ankama/v2";
    }

    getHaapiId() {
        return 18;
    }

    createApiKey(login, password) {
        return http.doPost(this.getHaapiUrl() + "/Api/CreateApiKey", {login, password, long_life_token: false})
            .then((resp) => JSON.parse(resp))
            .then((resp) => {
                logger.debug("Api key", this.apiKey = resp);
                if (resp.reason == "OTPTIMEFAILED") throw new Error("This account must be unlock with your phone.");
                return this.client;
            });
    }

    createToken() {
        console.log(this);
        return http.doGet(this.getHaapiUrl() + "/Account/CreateToken?game=" + this.getHaapiId(), {apikey: this.apiKey.key})
            .then((resp) => JSON.parse(resp))
            .then((resp) => {
                logger.debug("Token", this.token = resp.token);
                return this.client;
            });
    }
}

export default AuthManager;
