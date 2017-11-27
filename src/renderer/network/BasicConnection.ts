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
        if (this.listeners(data._messageType).length == 0) {
            this.logger.debug("Unhandled data", data);
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
