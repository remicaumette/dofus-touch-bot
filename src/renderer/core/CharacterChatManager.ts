import {Character} from "@core/Character";
import {Channel} from "@protocol/enum/Channel";
import {ChatMessage} from "@protocol/type/ChatMessage";
import {EventEmitter} from "events";

export class CharacterChatManager extends EventEmitter {
    private character: Character;
    private channels: Channel[];

    /**
     * @param {Character} character The character.
     */
    constructor(character: Character) {
        super();
        this.character = character;
        this.character.getGame().getGameConnection()
            .on("EnabledChannelsMessage", this.onEnabledChannelsMessage.bind(this));
        this.character.getGame().getGameConnection()
            .on("ChatServerMessage", this.onChatServerMessage.bind(this));
    }

    /**
     * @returns {Channel[]} Available channels.
     */
    public getChannels(): Channel[] {
        return this.channels;
    }

    /**
     * Update the channel list (channelsUpdated event is emit).
     * @param {Channel[]} channels Available channels.
     */
    public setChannels(channels: Channel[]): void {
        this.channels = channels;
        this.emit("channelsUpdated");
    }

    /**
     * EnabledChannelsMessage message handler.
     * @param data Message.
     */
    private onEnabledChannelsMessage(data: any): void {
        this.setChannels(data.channels);
    }

    /**
     * ChatServerMessage message handler.
     * @param data Message.
     */
    private onChatServerMessage(data: any): void {
        const message: ChatMessage = new ChatMessage(data);
        this.emit("chat", message);
    }
}
