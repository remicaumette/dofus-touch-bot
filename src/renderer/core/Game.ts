import {GameState} from "@core/GameState";
import {GameConnection} from "@network/GameConnection";
import {RealmConnection} from "@network/RealmConnection";
import {ProtocolConstants} from "@protocol/ProtocolConstants";
import {HttpClient} from "@util/HttpClient";
import {Logger} from "@util/Logger";
import {EventEmitter} from "events";
import {Character} from "@core/Character";

export class Game extends EventEmitter {
    private logger: Logger;
    private login: string;
    private sessionId: string;
    private appVersion: string;
    private buildVersion: string;
    private apiKey: string;
    private token: string;
    private state: GameState;
    private realmConnection: RealmConnection;
    private gameConnection: GameConnection;
    private character: Character;
    private key: number[][];
    private salt: string;
    private id: number;
    private nickname: string;
    private secretAsk: string;

    constructor() {
        super();
        this.logger = new Logger("Game");
        this.state = GameState.OFFLINE;
        this.realmConnection = new RealmConnection(this);
        this.gameConnection = new GameConnection(this);
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
     * @returns {string} The app version.
     */
    public getAppVersion(): string {
        return this.appVersion;
    }

    /**
     * @returns {string} The build version.
     */
    public getBuildVersion(): string {
        return this.buildVersion;
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
     * @returns {Character} The character.
     */
    public getCharacter(): Character {
        return this.character;
    }

    /**
     * Set the character.
     * @param {Character} character The character.
     */
    public setCharacter(character: Character): void {
        this.character = character;
    }

    /**
     * @returns {number[][]} The key used for the authentication.
     */
    public getKey(): number[][] {
        return this.key;
    }

    /**
     * Set the key used for the authentication.
     * @param {number[][]} key The key used for the authentication.
     */
    public setKey(key: number[][]): void {
        this.key = key;
    }

    /**
     * @returns {string} The salt used for the authentication.
     */
    public getSalt(): string {
        return this.salt;
    }

    /**
     * Set the salt used for the authentication.
     * @param {string} salt The salt used for the authentication.
     */
    public setSalt(salt: string): void {
        this.salt = salt;
    }

    /**
     * @returns {number} The account id.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * Set the account id.
     * @param {number} id The account id.
     */
    public setId(id: number): void {
        this.id = id;
    }

    /**
     * @returns {string} The account nickname.
     */
    public getNickname(): string {
        return this.nickname;
    }

    /**
     * Set the account nickname.
     * @param {string} nickname The account nickname.
     */
    public setNickname(nickname: string): void {
        this.nickname = nickname;
    }

    /**
     * @returns {string} The secret ask used for delete a character.
     */
    public getSecretAsk(): string {
        return this.secretAsk;
    }

    /**
     * Set the secret ask used for delete a character.
     * @param {string} secretAsk The secret ask used for delete a character.
     */
    public setSecretAsk(secretAsk: string): void {
        this.secretAsk = secretAsk;
    }

    /**
     * Setup the game, fetching the config, the token and the api key.
     * @param {string} login Login.
     * @param {string} password Password.
     * @returns {Promise<void>} Result.
     */
    public auth(login: string, password: string): Promise<void> {
        return HttpClient.get(`${ProtocolConstants.getProxyUrl()}/config.json`)
            .then((resp) => resp.json())
            .then((resp) => {
                this.sessionId = resp.sessionId;
                return ProtocolConstants.getAppVersion();
            })
            .then((appVersion) => {
                this.appVersion = appVersion;
                return ProtocolConstants.getBuildVersion();
            })
            .then((buildVersion) => {
                this.buildVersion = buildVersion;

                const form: FormData = new FormData();
                form.append("login", login);
                form.append("password", password);
                form.append("long_life_token", "false");
                return HttpClient.post(`${ProtocolConstants.getHaapiUrl()}/Api/CreateApiKey`, form);
            })
            .then((resp) => resp.json())
            .then((resp) => {
                this.apiKey = resp.key;

                const headers: Headers = new Headers();
                headers.append("apikey", this.apiKey);
                return HttpClient.get(
                    `${ProtocolConstants.getHaapiUrl()}/Account/CreateToken?game=${ProtocolConstants.getHaapiGameId()}`,
                    headers);
            })
            .then((resp) => resp.json())
            .then((resp) => {
                this.token = resp.token;
                this.login = login;

                this.setState(GameState.AUTHENTICATED);
            });
    }
}
