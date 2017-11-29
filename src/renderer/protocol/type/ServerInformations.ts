import {ServerStatus} from "@protocol/type/ServerStatus";

export class ServerInformations {
    private id: number;
    private name: string;
    private charactersCount: number;
    private selectable: boolean;
    private status: ServerStatus;

    /**
     * @param data Raw data (normally extract from the ServersListMessage).
     */
    constructor(data: any) {
        this.id = data.id;
        this.name = data._name;
        this.charactersCount = data.charactersCount;
        this.selectable = data.isSelectable;
        this.status = data.status;
    }

    /**
     * @returns {number} The server id.
     */
    public getId(): number {
        return this.id;
    }

    /**
     * @returns {string} The server name.
     */
    public getName(): string {
        return this.name;
    }

    /**
     * @returns {number} The number of character on this server.
     */
    public getCharactersCount(): number {
        return this.charactersCount;
    }

    /**
     * @returns {boolean} If the server can be selected.
     */
    public isSelectable(): boolean {
        return this.selectable;
    }

    /**
     * @returns {ServerStatus} The server status.
     */
    public getStatus(): ServerStatus {
        return this.status;
    }
}
