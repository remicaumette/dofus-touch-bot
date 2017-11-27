import {EventEmitter} from "events";
import {Logger} from "@util/Logger";
import {RealmConnection} from "@network/RealmConnection";
import {GameConnection} from "@network/GameConnection";
import {HttpClient} from "@util/HttpClient";
import {HAAPI_GAME_ID, HAAPI_URL, PROXY_URL} from "@protocol/Constants";
import {GameState} from "@core/GameState";

export class Game extends EventEmitter {
    private logger: Logger;
    private login: string;
    private sessionId: string;
    private apiKey: string;
    private token: string;
    private state: GameState;
    private realmConnection: RealmConnection;
    private gameConnection: GameConnection;

    constructor() {
        super();
        this.logger = new Logger("Game");
        this.state = GameState.OFFLINE;
        this.realmConnection = new RealmConnection(this);
        this.gameConnection = new GameConnection();
    }

    /**
     * @returns {Logger} The logger.
     */
    public getLogger(): Logger {
        return this.logger;
    }

    /**
     * @returns {string} The login.
     */
    public getLogin(): string {
        return this.login;
    }

    /**
     * @returns {string} The session id.
     */
    public getSessionId(): string {
        return this.sessionId;
    }

    /**
     * @returns {string} The api key.
     */
    public getApiKey(): string {
        return this.apiKey;
    }

    /**
     * @returns {string} The token.
     */
    public getToken(): string {
        return this.token;
    }

    /**
     * @returns {GameState} The state.
     */
    public getState(): GameState {
        return this.state;
    }

    /**
     * Update the game state with this.
     * @param {GameState} state The new state.
     */
    public setState(state: GameState): void {
        this.logger.debug("The state will be updated", {from: this.state, to: state});
        this.state = state;
        this.emit("stateUpdated");
    }

    /**
     * @returns {RealmConnection} The realm connection.
     */
    public getRealmConnection(): RealmConnection {
        return this.realmConnection;
    }

    /**
     * @returns {GameConnection} The game connection.
     */
    public getGameConnection(): GameConnection {
        return this.gameConnection;
    }

    /**
     * Setup the game, fetching the config, the token and the api key.
     * @param {string} login Login.
     * @param {string} password Password.
     * @returns {Promise<void>} Result.
     */
    public auth(login: string, password: string): Promise<void> {
        this.logger.info("Authentication...");

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
                this.logger.info("Successfully authenticated");

                this.setState(GameState.AUTHENTICATED);
            });
    }
}
