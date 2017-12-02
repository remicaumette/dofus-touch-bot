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
    private willDisconnected: boolean;

    /**
     * @param {Game} game The game.
     */
    constructor(game: Game) {
        super("RealmConnection");
        this.game = game;
        /* We defined unhandled messages */
        this.setIgnoredUnhandledMessages([
            "ProtocolRequired", "CredentialsAcknowledgementMessage",
        ]);
        /* We update the game state when the connection is open */
        this.on("open", () => {
            this.game.setState(GameState.CONNECTING);
        });
        /* We update the game state when the connection is close */
        this.on("close", () => {
            if (!this.willDisconnected) {
                this.game.setState(GameState.OFFLINE);
            }
        });
        /* Data handling */
        this.on("HelloConnectMessage", this.onHelloConnectMessage.bind(this));
        this.on("assetsVersionChecked", this.onAssetsVersionChecked.bind(this));
        this.on("LoginQueueStatusMessage", this.onLoginQueueStatusMessage.bind(this));
        this.on("IdentificationSuccessMessage", this.onIdentificationSuccessMessage.bind(this));
        this.on("ServersListMessage", this.onServersListMessage.bind(this));
        this.on("SelectedServerDataMessage", this.onSelectedServerDataMessage.bind(this));
        this.on("serverDisconnecting", this.onServerDisconnecting.bind(this));
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
        this.game.setSalt(data.salt);
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
    }

    /**
     * IdentificationSuccessMessage message handler.
     * @param data Message.
     */
    private onIdentificationSuccessMessage(data: any): void {
        this.game.setId(data.accountId);
        this.game.setNickname(data.nickname);
        this.game.setSecretAsk(data.secretQuestion);
    }

    /**
     * ServersListMessage message handler.
     * @param data Message.
     */
    private onServersListMessage(data: any): void {
        this.servers = data.servers.map((server: any) => new ServerInformations(server));
        this.game.setState(GameState.SELECTING_SERVER);
    }

    /**
     * SelectedServerDataMessage message handler.
     * @param data Message.
     */
    private onSelectedServerDataMessage(data: any): void {
        this.selectedServer = new SelectedServer(data);
        this.game.setState(GameState.SWITCHING);
    }

    /**
     * serverDisconnecting message handler.
     */
    private onServerDisconnecting() {
        this.willDisconnected = true;
    }
}
