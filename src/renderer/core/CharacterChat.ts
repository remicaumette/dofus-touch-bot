import {EventEmitter} from "events";
import {Channel} from "@protocol/enum/Channel";

export class CharacterChat extends EventEmitter {
    private activeChannels: Channel[];
    private availableChannels: Channel[];

    /**
     * @returns {Channel[]} Active channels.
     */
    public getActiveChannels(): Channel[] {
        return this.activeChannels;
    }

    /**
     * Update the active channel list (activeChannelsUpdated event is emit).
     * @param {Channel[]} activeChannels Active channels.
     */
    public setActiveChannels(activeChannels: Channel[]): void {
        this.activeChannels = activeChannels;
        this.emit("activeChannelsUpdated");
    }

    /**
     * @returns {Channel[]} Available channels.
     */
    public getAvailableChannels(): Channel[] {
        return this.availableChannels;
    }

    /**
     * Update the available channel list (availableChannelsUpdated event is emit).
     * @param {Channel[]} availableChannels The new channel list.
     */
    public setAvailableChannels(availableChannels: Channel[]): void {
        this.availableChannels = availableChannels;
        this.emit("availableChannelsUpdated");
    }
}
