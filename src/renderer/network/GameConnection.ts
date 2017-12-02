import {Character} from "@core/Character";
import {Game} from "@core/Game";
import {GameState} from "@core/GameState";
import {BasicConnection} from "@network/BasicConnection";
import {CharacterBaseInformations} from "@protocol/type/CharacterBaseInformations";
import {ObjectItem} from "@protocol/type/ObjectItem";

export class GameConnection extends BasicConnection {
    private game: Game;
    private characters: CharacterBaseInformations[];
    private selectedCharacter: CharacterBaseInformations;

    /**
     * @param {Game} game The game.
     */
    constructor(game: Game) {
        super("GameConnection");
        this.game = game;
        /* We defined unhandled messages */
        this.setIgnoredUnhandledMessages([
            "ProtocolRequired", "BasicAckMessage", "AuthenticationTicketAcceptedMessage", "BasicTimeMessage",
            "ServerSettingsMessage", "ServerOptionalFeaturesMessage", "ServerSessionConstantsMessage",
            "AccountCapabilitiesMessage", "BasicNoOperationMessage", "BasicAckMessage", "QueueStatusMessage",
            "BasicPongMessage", "NotificationListMessage", "ShortcutBarContentMessage", "EmoteListMessage",
            "AlignmentRankUpdateMessage", "PrismsListMessage", "FriendWarnOnConnectionStateMessage",
            "FriendWarnOnLevelGainStateMessage", "FriendGuildWarnOnAchievementCompleteStateMessage",
            "GuildMemberWarnOnConnectionStateMessage", "SequenceNumberRequestMessage", "SpouseStatusMessage",
            "GameRolePlayArenaUpdatePlayerInfosMessage", "CharacterCapabilitiesMessage", "AlmanachCalendarDateMessage",
            "StartupActionsListMessage", "FriendsListMessage", "IgnoredListMessage", "GameContextDestroyMessage",
            "GameContextCreateMessage", "MailStatusMessage", "QuestListMessage", "AchievementListMessage",
            "LifePointsRegenBeginMessage", "TextInformationMessage",
        ]);
        /* We update the game state when the connection is open */
        this.on("open", () => {
            this.game.setState(GameState.CONNECTING);
        });
        /* We update the game state when the connection is close */
        this.on("close", () => {
            this.game.setState(GameState.OFFLINE);
        });
        /* Data handling */
        this.on("HelloGameMessage", this.onHelloGameMessage.bind(this));
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
        this.selectedCharacter = character;
        this.game.setCharacter(new Character(this.game, character));
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
                        address: this.game.getRealmConnection().getSelectedServer().getAddress(),
                        id: this.game.getRealmConnection().getSelectedServer().getId(),
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
     * TrustStatusMessage message handler.
     */
    private onTrustStatusMessage(): void {
        this.sendMessage("CharactersListRequestMessage");
    }

    /**
     * CharactersListMessage message handler.
     * @param data Message.
     */
    private onCharactersListMessage(data: any): void {
        this.sendMessage("BasicPingMessage", {quiet: true});

        this.characters = data.characters.map((character: any) => new CharacterBaseInformations(character));
        this.game.setState(GameState.SELECTING_CHARACTER);
    }

    /**
     * CharacterSelectedSuccessMessage message handler.
     */
    private onCharacterSelectedSuccessMessage(): void {
        this.game.setState(GameState.ONLINE);

        this.sendMessage("QuestListRequestMessage");
        this.sendMessage("FriendsGetListMessage");
        this.sendMessage("IgnoredGetListMessage");
        this.sendMessage("SpouseGetInformationsMessage");
        this.sendMessage("IgnoredGetListMessage");
        this.sendMessage("GameContextCreateRequestMessage");
    }
}
