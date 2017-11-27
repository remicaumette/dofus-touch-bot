import {BasicConnection} from "@network/BasicConnection";
import {Game} from "@core/Game";
import {APP_VERSION, BUILD_VERSION, PROXY_URL} from "@protocol/Constants";
import {GameState} from "@core/GameState";

export class RealmConnection extends BasicConnection {
    private game: Game;

    /**
     * @param {Game} game The game.
     */
    constructor(game: Game) {
        super("RealmConnection");
        this.game = game;
    }

    onOpen() {
        super.onOpen();
        this.game.setState(GameState.SELECTING_SERVER);
    }

    onClose() {
        super.onClose();
        if (this.game.getState() >= GameState.SELECTING_CHARACTER) {
            this.game.setState(GameState.AUTHENTICATED);
        }
    }

    /**
     * Connect to the realm server.
     * @returns {Promise<void>} Result.
     */
    public connect(): Promise<void> {
        return this.open(`${PROXY_URL}?STICKER=${this.game.getSessionId()}`)
            .then(() => {
                this.send("connecting", {
                    appVersion: APP_VERSION,
                    buildVersion: BUILD_VERSION,
                    client: "ios",
                    language: "fr",
                    server: "login"
                });
            });
    }
}
