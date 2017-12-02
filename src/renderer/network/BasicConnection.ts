import {Logger} from "@util/Logger";
import {EventEmitter} from "events";

const Primus = require("./primus"); // tslint:disable-line

export class BasicConnection extends EventEmitter {
    protected logger: Logger;
    private ignoredUnhandledMessages: string[];
    private socket: any;

    /**
     * @param {string} loggerName The logger's name.
     */
    constructor(loggerName: string) {
        super();
        this.logger = new Logger(loggerName);
        this.ignoredUnhandledMessages = [];
    }

    /**
     * @returns {Logger} The logger.
     */
    public getLogger(): Logger {
        return this.logger;
    }

    /**
     * Send raw data.
     * @param {string} call Calling type.
     * @param data Data.
     */
    public send(call: string, data?: any) {
        this.socket.write({call, data: data || {}});
    }

    /**
     * Send a packet.
     * @param {string} type Packet type.
     * @param data Data.
     */
    public sendMessage(type: string, data?: any) {
        this.send("sendMessage", {type, data: data || {}});
    }

    /**
     * Using for close the connection.
     */
    public close() {
        try {
            this.logger.info("Closing the connection");
            this.socket.close();
        } catch (error) {
            this.logger.error("An error occurred while closing the connection", error);
        }
    }

    /**
     * Open a new connection.
     * @param {string} uri The URI.
     * @returns {Promise<void>} Result.
     */
    protected open(uri: string): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.logger.info(`Trying to connect to ${uri}`);

                this.socket = new Primus(uri, {manual: true, strategy: "disconnect,timeout"});
                this.socket.on("open", this.onOpen.bind(this, resolve));
                this.socket.on("data", this.onData.bind(this));
                this.socket.on("error", this.onError.bind(this));
                this.socket.on("close", this.onClose.bind(this));
                this.socket.open();
            } catch (error) {
                this.logger.error(`An error occurred while trying to connect to ${uri}`, error);
                reject(error);
            }
        });
    }

    /**
     * @returns {string[]} Ignored unhandled messages.
     */
    protected getIgnoredUnhandledMessages(): string[] {
        return this.ignoredUnhandledMessages;
    }

    /**
     * Set ignored unhandled messages.
     * @param {string[]} ignoredUnhandledMessages Ignored unhandled messages.
     */
    protected setIgnoredUnhandledMessages(ignoredUnhandledMessages: string[]): void {
        this.ignoredUnhandledMessages = ignoredUnhandledMessages;
    }

    /**
     * Using for handle opening.
     */
    private onOpen(resolve: any) {
        this.logger.info("The connection is open");
        this.emit("open");
        resolve();
    }

    /**
     * Call when data received.
     * @param {Object} data Data.
     */
    private onData(data: any) {
        const messageType: string = data._messageType;
        if (this.listeners(messageType).length === 0 && this.ignoredUnhandledMessages.indexOf(messageType) === -1) {
            this.logger.debug("Unhandled message", data);
        }
        this.emit(data._messageType, data);
    }

    /**
     * Using for handle errors.
     * @param {Error} error Error.
     */
    private onError(error: Error) {
        this.logger.error("An error occurred on the connection", error);
        this.emit("error", error);
        this.close();
    }

    /**
     * Using for handle closing.
     */
    private onClose() {
        this.logger.info("The connection is closed");
        this.emit("close");
    }
}
