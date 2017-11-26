export enum Level {
    DEBUG = 2,
    INFO = 1,
    ERROR = 0
}

export class Logger {
    private name: string;
    private loggingLevel: Level = Level.DEBUG;

    constructor(name: string) {
        this.name = name;
    }

    /**
     * The logger's name.
     * @returns {string}
     */
    public getName(): string {
        return this.name;
    }

    /**
     * The logger's print level.
     * @returns {Level}
     */
    public getLoggingLevel(): Level {
        return this.loggingLevel;
    }

    /**
     * Change the logger's print level.
     * @param {Level} loggingLevel
     */
    public setLoggingLevel(loggingLevel: Level): void {
        this.loggingLevel = loggingLevel;
    }


    /**
     * Log an informative message (Logger.loggingLevel must be >= Level.INFO).
     * @param {string} message Message.
     */
    public info(message: string): void {
        if (this.loggingLevel >= Level.INFO) {
            console.log(`%c${new Date().toUTCString()} - [INFO] (${this.name}) - ${message}`, "color: #99C794");
        }
    }

    /**
     * Log a debugging message (Logger.loggingLevel must be >= Level.DEBUG).
     * @param {string} message Message.
     * @param {Object} obj Object to debug.
     */
    public debug(message: string, obj: object): void {
        if (this.loggingLevel >= Level.DEBUG) {
            console.log(`%c${new Date().toUTCString()} - [DEBUG] (${this.name}) - ${message}`, "color: #3f87a6", obj);
        }
    }

    /**
     * Log an error message (Logger.loggingLevel must be >= Level.ERROR).
     * @param {string} message Message.
     * @param {Error} error Error.
     */
    public error(message: string, error: Error): void {
        if (this.loggingLevel >= Level.ERROR) {
            console.log(`%c${new Date().toUTCString()} - [ERROR] (${this.name}) - ${message}: ${error.message}`, "color: #EC5f67");
        }
    }
}
