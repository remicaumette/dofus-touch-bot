import {HttpClient} from "@util/HttpClient";

export class ProtocolConstants {
    private static cachedAppVersion: string;
    private static cachedBuildVersion: string;

    public static getProxyUrl(): string {
        return "https://proxyconnection.touch.dofus.com";
    }

    public static getHaapiUrl(): string {
        return "https://haapi.ankama.com/json/Ankama/v2";
    }

    public static getHaapiGameId(): number {
        return 18;
    }

    public static getAppVersion(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (ProtocolConstants.cachedAppVersion) {
                resolve(ProtocolConstants.cachedAppVersion);
            } else {
                HttpClient.get("https://itunes.apple.com/lookup?id=1041406978")
                    .then((resp) => resp.json())
                    .then((resp) => resolve(resp.results[0].version))
                    .catch(reject);
            }
        });
    }

    public static getBuildVersion(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (ProtocolConstants.cachedBuildVersion) {
                resolve(ProtocolConstants.cachedBuildVersion);
            } else {
                const regex = /.*buildVersion=("|')([0-9]*\.[0-9]*\.[0-9]*)("|')/g;

                HttpClient.get(`${ProtocolConstants.getProxyUrl()}/build/script.js`)
                    .then((resp) => resp.text())
                    .then((resp) => resolve(regex.exec(resp.substring(1, 10000))[2]))
                    .catch(reject);
            }
        });
    }
}
