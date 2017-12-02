import {Channel} from "@protocol/enum/Channel";

export class ChatMessage {
    private channel: Channel;
    private content: string;
    private senderId: number;
    private senderName: string;
    private at: Date;

    /**
     * @param data Raw data (normally extract from the ChatServerMessage).
     */
    constructor(data: any) {
        this.channel = data.channel;
        this.content = data.content;
        this.senderId = data.senderId;
        this.senderName = data.senderName;
        this.at = new Date(data.timestamp);
    }

    /**
     * @returns {Channel} The channel.
     */
    public getChannel(): Channel {
        return this.channel;
    }

    /**
     * @returns {string} The content.
     */
    public getContent(): string {
        return this.content;
    }

    /**
     * @returns {number} The sender id.
     */
    public getSenderId(): number {
        return this.senderId;
    }

    /**
     * @returns {string} The sender name.
     */
    public getSenderName(): string {
        return this.senderName;
    }

    /**
     * @returns {Date} When the message was sent.
     */
    public getAt(): Date {
        return this.at;
    }
}
