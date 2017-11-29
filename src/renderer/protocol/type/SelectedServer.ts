import {ServerStatus} from "@protocol/type/ServerStatus";

export class SelectedServer {
    private id: number;
    private address: string;
    private port: number;
    private access: string;
    private ticket: string;

    /**
     * @param data Raw data (normally extract from the SelectedServerDataMessage).
     */
    constructor(data: any) {
        this.id = data.serverId;
        this.address = data.address;
        this.port = data.port;
        this.access = data._access;
        this.ticket = data.ticket;
    }

    /**
     * @returns {number} The server id.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * @returns {string} The server address.
     */
    public getAddress(): string {
        return this.address;
    }

    /**
     * @returns {number} The server port.
     */
    public getPort(): number {
        return this.port;
    }

    /**
     * @returns {string} The server access address.
     */
    public getAccess(): string {
        return this.access;
    }

    /**
     * @returns {string} The ticket (used for the connection).
     */
    public getTicket(): string {
        return this.ticket;
    }
}
