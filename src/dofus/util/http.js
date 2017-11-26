import fetch from "whatwg-fetch";

const USER_AGENT = "Mozilla/5.0 (Linux; Android 4.4.2; SHIELD Tablet Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/50.0.2661.102 Crosswalk/20.50.533.11 Safari/537.36";

function doGet(url, headers) {
    headers = headers || {};
    headers["User-Agent"] = USER_AGENT;

    return fetch({method: "GET", url, headers});
}

function doPost(url, headers, body) {
    headers = headers || {};
    headers["User-Agent"] = USER_AGENT;

    return fetch({method: "POST", url, headers: new Headers(headers), body: body || undefined});
}

export default {doGet, doPost};
