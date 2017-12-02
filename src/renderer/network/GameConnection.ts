import {Game} from "@core/Game";
import {BasicConnection} from "@network/BasicConnection";
import {GameState} from "@core/GameState";
import {CharacterBaseInformations} from "@protocol/type/CharacterBaseInformations";

export class GameConnection extends BasicConnection {
    private game: Game;
    private characters: CharacterBaseInformations[];

    /**
     * @param {Game} game The game.
     */
    constructor(game: Game) {
        super("GameConnection");
        this.game = game;

        this.on("open", () => {
            this.game.setState(GameState.CONNECTING_TO_GAME);
        });
        /* We update the game state when the connection is close */
        this.on("close", () => {
            this.game.setState(GameState.AUTHENTICATED);
        });
        /* Data handling */
        this.on("HelloGameMessage", this.onHelloGameMessage.bind(this));
        this.on("QueueStatusMessage", this.onQueueStatusMessage.bind(this));
        this.on("AuthenticationTicketAcceptedMessage", this.onAuthenticationTicketAcceptedMessage.bind(this));
        this.on("TrustStatusMessage", this.onTrustStatusMessage.bind(this));
        this.on("CharactersListMessage", this.onCharactersListMessage.bind(this));
        this.on("CharacterSelectedSuccessMessage", this.onCharacterSelectedSuccessMessage.bind(this));
    }

    /**
     * @returns {CharacterBaseInformations[]} Available characters on this server.
     */
    public getCharacters(): CharacterBaseInformations[] {
        return this.characters;
    }

    /**
     * Select a character.
     * @param {CharacterBaseInformations} character The selected character.
     */
    public selectCharacter(character: CharacterBaseInformations) {
        this.sendMessage("CharacterSelectionMessage", {id: character.getId()});
    }

    /**
     * Connect to the game server.
     * @returns {Promise<void>} Result.
     */
    public connect(): Promise<void> {
        return this.open(
            `${this.game.getRealmConnection().getSelectedServer().getAccess()}/?STICKER=${this.game.getSessionId()}`)
            .then(() => {
                this.send("connecting", {
                    appVersion: this.game.getAppVersion(),
                    buildVersion: this.game.getBuildVersion(),
                    client: "ios",
                    language: "fr",
                    server: {
                        id: this.game.getRealmConnection().getSelectedServer().getId(),
                        address: this.game.getRealmConnection().getSelectedServer().getAddress(),
                        port: this.game.getRealmConnection().getSelectedServer().getPort(),
                    },
                });
            });
    }

    /**
     * HelloGameMessage message handler.
     */
    private onHelloGameMessage(): void {
        this.sendMessage("AuthenticationTicketMessage", {
            lang: "fr",
            ticket: this.game.getRealmConnection().getSelectedServer().getTicket(),
        });
    }

    /**
     * QueueStatusMessage message handler.
     * @param data Message.
     */
    private onQueueStatusMessage(data: any): void {
        this.logger.info(`You're waiting (${data.position}/${data.total})`);
    }

    /**
     * AuthenticationTicketAcceptedMessage message handler.
     */
    private onAuthenticationTicketAcceptedMessage(): void {
        this.logger.info("Authenticated");
    }

    /**
     * TrustStatusMessage message handler.
     */
    private onTrustStatusMessage(): void {
        this.logger.info("Requesting characters");
        this.sendMessage("CharactersListRequestMessage");
    }

    /**
     * CharactersListMessage message handler.
     * @param data Message.
     */
    private onCharactersListMessage(data: any): void {
        this.logger.info("Characters received");
        this.sendMessage("BasicPingMessage", {quiet: true});

        this.logger.debug("GameConnection.characters", this.characters = data.characters
            .map((data: any) => new CharacterBaseInformations(data)));
        this.game.setState(GameState.SELECTING_CHARACTER);
    }

    /**
     * CharacterSelectedSuccessMessage message handler.
     */
    private onCharacterSelectedSuccessMessage(): void {
        this.logger.info("You're connected");
        this.game.setState(GameState.ONLINE);
    }
}
