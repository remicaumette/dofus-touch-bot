import {EventEmitter} from "events";
import {Logger} from "@util/Logger";
import {RealmConnection} from "@network/RealmConnection";
import {GameConnection} from "@network/GameConnection";
import {HttpClient} from "@util/HttpClient";
import {HAAPI_GAME_ID, HAAPI_URL, PROXY_URL} from "@protocol/Constants";

export class Game extends EventEmitter {
    private logger: Logger;
    private login: string;
    private sessionId: string;
    private apiKey: string;
    private token: string;
    private realmConnection: RealmConnection;
    private gameConnection: GameConnection;

    constructor() {
        super();
        this.logger = new Logger("Game");
        this.realmConnection = new RealmConnection();
        this.gameConnection = new GameConnection();
    }


    /**
     * The login.
     * @returns {string}
     */
    public getLogin(): string {
        return this.login;
    }

    /**
     * The session id.
     * @returns {string}
     */
    public getSessionId(): string {
        return this.sessionId;
    }

    /**
     * The api key.
     * @returns {string}
     */
    public getApiKey(): string {
        return this.apiKey;
    }

    /**
     * The token.
     * @returns {string}
     */
    public getToken(): string {
        return this.token;
    }

    /**
     * Setup the game, fetching the config, the token and the api key.
     * @param {string} login Login.
     * @param {string} password Password.
     * @returns {Promise<void>}
     */
    public setupGame(login: string, password: string): Promise<void> {
        return HttpClient.get(`${PROXY_URL}/config.json`)
            .then((resp) => resp.json())
            .then((resp) => {
                this.logger.debug("Game.sessionId", this.sessionId = resp.sessionId);

                const form: FormData = new FormData();
                form.append("login", login);
                form.append("password", password);
                form.append("long_life_token", "false");
                return HttpClient.post(`${HAAPI_URL}/Api/CreateApiKey`, form);
            })
            .then((resp) => resp.json())
            .then((resp) => {
                this.logger.debug("Game.apiKey", this.apiKey = resp.key);

                const headers: Headers = new Headers();
                headers.append("apikey", this.apiKey);
                return HttpClient.get(`${HAAPI_URL}/Account/CreateToken?game=${HAAPI_GAME_ID}`, headers);
            })
            .then((resp) => resp.json())
            .then((resp) => {
                this.logger.debug("Game.token", this.token = resp.token);
            });
    }
}
