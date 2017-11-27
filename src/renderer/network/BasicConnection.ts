import {EventEmitter} from "events";
import {Logger} from "@util/Logger";

const Primus = require("./primus");

export class BasicConnection extends EventEmitter {
    private logger: Logger;
    private socket: any;

    /**
     * @param {string} loggerName The logger's name.
     */
    constructor(loggerName: string) {
        super();
        this.logger = new Logger(loggerName);
    }

    /**
     * @returns {Logger} The logger.
     */
    public getLogger(): Logger {
        return this.logger;
    }

    /**
     * @returns {any} The socket.
     */
    protected getSocket(): any {
        return this.socket;
    }

    /**
     * Using for handle opening.
     */
    protected onOpen() {
        this.logger.info("The connection is open");
    }

    /**
     * Call when data received.
     * @param {Object} data Data.
     */
    protected onData(data: any) {
        if (this.listeners(data._messageType).length == 0) {
            this.logger.debug("Unhandled data", data);
        }

        this.emit(data._messageType, data);
    }

    /**
     * Using for handle errors.
     * @param {Error} error Error.
     */
    protected onError(error: Error) {
        this.logger.error("An error occurred on the connection", error);
        this.close();
    }

    /**
     * Using for handle closing.
     */
    protected onClose() {
        this.logger.info("The connection is closed");
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
                this.socket.on("open", this.onOpen.bind(this));
                this.socket.on("data", this.onData.bind(this));
                this.socket.on("error", this.onError.bind(this));
                this.socket.on("close", this.onClose.bind(this));
                this.socket.open();

                resolve();
            } catch (error) {
                this.logger.error(`An error occurred while trying to connect to ${uri}`, error);
                reject(error);
            }
        });
    }

    /**
     * Send raw data.
     * @param {string} call Calling type.
     * @param data Data.
     */
    public send(call: string, data: any) {
        this.socket.write({call: call, data: data || {}});
    }

    /**
     * Send a packet.
     * @param {string} type Packet type.
     * @param data Data.
     */
    public sendMessage(type: string, data: any) {
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
}
