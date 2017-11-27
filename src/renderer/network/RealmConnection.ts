import {BasicConnection} from "@network/BasicConnection";
import {Game} from "@core/Game";
import {GameState} from "@core/GameState";
import {ProtocolConstants} from "@protocol/ProtocolConstants";

export class RealmConnection extends BasicConnection {
    private game: Game;

    /**
     * @param {Game} game The game.
     */
    constructor(game: Game) {
        super("RealmConnection");
        this.game = game;

        /* We update the game state when the connection is open */
        this.on("open", () => {
            this.game.setState(GameState.SELECTING_SERVER);
        });
        /* We update the game state when the connection is close */
        this.on("close", () => {
            if (this.game.getState() >= GameState.SELECTING_CHARACTER) {
                this.game.setState(GameState.AUTHENTICATED);
            }
        });
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
                    server: "login"
                });
            });
    }
}
