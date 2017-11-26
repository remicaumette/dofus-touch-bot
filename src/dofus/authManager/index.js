import "whatwg-fetch";

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
        const form = new FormData();
        form.append("login", this.username = login);
        form.append("password", password);
        form.append("long_life_token", false);

        return fetch(this.getHaapiUrl() + "/Api/CreateApiKey", {method: "POST", body: form})
            .then((resp) => {
                if (resp.status === 422) throw new Error("Invalid username or password.");
                if (resp.status === 601) throw new Error("This account must be unlock by your phone.");
                return resp.json();
            })
            .then((resp) => this.apiKey = resp.key);
    }

    createToken() {
        const headers = new Headers();
        headers.append("apikey", this.apiKey);

        return fetch(this.getHaapiUrl() + "/Account/CreateToken?game=" + this.getHaapiId(), {headers})
            .then((resp) => resp.json())
            .then((resp) => this.token = resp.token);
    }
}

export default AuthManager;
