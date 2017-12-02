import {Game} from "@core/Game";
import {GameState} from "@core/GameState";
import {BasicConnection} from "@network/BasicConnection";
import {ProtocolConstants} from "@protocol/ProtocolConstants";
import {SelectedServer} from "@protocol/type/SelectedServer";
import {ServerInformations} from "@protocol/type/ServerInformations";

export class RealmConnection extends BasicConnection {
    private game: Game;
    private servers: ServerInformations[];
    private selectedServer: SelectedServer;

    /**
     * @param {Game} game The game.
     */
    constructor(game: Game) {
        super("RealmConnection");
        this.game = game;

        /* We update the game state when the connection is open */
        this.on("open", () => {
            this.game.setState(GameState.CONNECTING);
        });
        /* We update the game state when the connection is close */
        this.on("close", () => {
            if (this.game.getState() < GameState.SWITCHING) {
                this.game.setState(GameState.AUTHENTICATED);
            }
        });
        /* Data handling */
        this.on("HelloConnectMessage", this.onHelloConnectMessage.bind(this));
        this.on("assetsVersionChecked", this.onAssetsVersionChecked.bind(this));
        this.on("LoginQueueStatusMessage", this.onLoginQueueStatusMessage.bind(this));
        this.on("IdentificationSuccessMessage", this.onIdentificationSuccessMessage.bind(this));
        this.on("ServersListMessage", this.onServersListMessage.bind(this));
        this.on("SelectedServerDataMessage", this.onSelectedServerDataMessage.bind(this));
    }

    /**
     * @returns {ServerInformations[]} Available servers.
     */
    public getServers(): ServerInformations[] {
        return this.servers;
    }

    /**
     * @returns {SelectedServer} The selected server.
     */
    public getSelectedServer(): SelectedServer {
        return this.selectedServer;
    }

    /**
     * Select a server.
     * @param {ServerInformations} server The selected server.
     */
    public selectServer(server: ServerInformations) {
        this.logger.info(`Selecting ${server.getName()}`);
        this.sendMessage("ServerSelectionMessage", {serverId: server.getId()});
    }

    /**
     * Connect to the realm server.
     * @returns {Promise<void>} Result.
     */
    public connect(): Promise<void> {
        return this.open(`${ProtocolConstants.getProxyUrl()}/?STICKER=${this.game.getSessionId()}`)
            .then(() => {
                this.send("connecting", {
                    appVersion: this.game.getAppVersion(),
                    buildVersion: this.game.getBuildVersion(),
                    client: "ios",
                    language: "fr",
                    server: "login",
                });
            });
    }

    /**
     * HelloConnectMessage message handler.
     * @param data Message.
     */
    private onHelloConnectMessage(data: any): void {
        this.game.setKey(data.key);
        this.logger.debug("Game.key", this.game.getKey());
        this.game.setSalt(data.salt);
        this.logger.debug("Game.salt", this.game.getSalt());
        this.send("checkAssetsVersion");
    }

    /**
     * assetsVersionChecked message handler.
     */
    private onAssetsVersionChecked(): void {
        this.send("login", {
            key: this.game.getKey(),
            salt: this.game.getSalt(),
            token: this.game.getToken(),
            username: this.game.getLogin(),
        });
    }

    /**
     * LoginQueueStatusMessage message handler.
     * @param data Message.
     */
    private onLoginQueueStatusMessage(data: any): void {
        if (this.game.getState() !== GameState.IN_QUEUE) {
            this.game.setState(GameState.IN_QUEUE);
        }
        this.logger.info(`You're waiting (${data.position}/${data.total})`);
    }

    /**
     * IdentificationSuccessMessage message handler.
     * @param data Message.
     */
    private onIdentificationSuccessMessage(data: any): void {
        this.game.setId(data.accountId);
        this.logger.debug("Game.id", this.game.getId());
        this.game.setNickname(data.nickname);
        this.logger.debug("Game.nickname", this.game.getNickname());
        this.game.setSecretAsk(data.secretQuestion);
        this.logger.debug("Game.secretAsk", this.game.getSecretAsk());
    }

    /**
     * ServersListMessage message handler.
     * @param data Message.
     */
    private onServersListMessage(data: any): void {
        this.logger.debug("RealmConnection.servers", this.servers = data.servers.map((server: any) =>
            new ServerInformations(server)));
        this.game.setState(GameState.SELECTING_SERVER);
    }

    /**
     * SelectedServerDataMessage message handler.
     * @param data Message.
     */
    private onSelectedServerDataMessage(data: any): void {
        this.logger.debug("RealmConnection.selectedServer", this.selectedServer = new SelectedServer(data));
        this.game.setState(GameState.SWITCHING);
    }
}
