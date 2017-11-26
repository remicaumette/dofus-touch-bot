import "whatwg-fetch";

export class HttpClient {
    /**
     * Do a request with the GET method
     * @param {string} url The url.
     * @param {Headers} headers Request headers (optional).
     * @returns {Promise<string>} Body of the response.
     */
    public static get(url: string, headers?: Headers): Promise<Response> {
        return fetch(url, {method: "GET", headers});
    }

    /**
     * Do a request with the GET method
     * @param {string} url The url.
     * @param {any} body Request body (optional).
     * @param {Headers} headers Request headers (optional).
     * @returns {Promise<string>} Body of the response.
     */
    public static post(url: string, body?: any, headers?: Headers): Promise<Response> {
        return fetch(url, {method: "POST", body, headers});
    }
}
