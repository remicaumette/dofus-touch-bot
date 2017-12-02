import {HttpClient} from "@util/HttpClient";

export class ProtocolConstants {
    /**
     * @returns {string} The proxy url.
     */
    public static getProxyUrl(): string {
        return "https://proxyconnection.touch.dofus.com";
    }

    /**
     * @returns {string} The ankama api url.
     */
    public static getHaapiUrl(): string {
        return "https://haapi.ankama.com/json/Ankama/v2";
    }

    /**
     * @returns {number} The dofus touch game id.
     */
    public static getHaapiGameId(): number {
        return 18;
    }

    /**
     * @returns {Promise<string>} The app version for the app store.
     */
    public static getAppVersion(): Promise<string> {
        return HttpClient.get("https://itunes.apple.com/lookup?id=1041406978")
            .then((resp) => resp.json())
            .then((resp) => resp.results[0].version);
    }

    /**
     * @returns {Promise<string>} The build version.
     */
    public static getBuildVersion(): Promise<string> {
        const regex = /.*buildVersion=("|')([0-9]*\.[0-9]*\.[0-9]*)("|')/g;

        return HttpClient.get(`${ProtocolConstants.getProxyUrl()}/build/script.js`)
            .then((resp) => resp.text())
            .then((resp) => regex.exec(resp.substring(1, 10000))[2]);
    }
}
