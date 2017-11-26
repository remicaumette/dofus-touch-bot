import util from "util";

function info(message) {
    console.log(new Date().toISOString() + " - [INFO] "+ message);
}

function debug(message, obj) {
    if (process.env.DEBUG === "true") {
        console.log(new Date().toISOString() + " - [DEBUG] "+ message + (obj ? " = "+ util.inspect(obj) : ""));
    }
}

function error(message, error) {
    console.error(new Date().toISOString() + " - [ERROR] "+ message + (error ? ": "+ error.message : ""));
    process.exit(1);
}

export default {info, debug, error};
