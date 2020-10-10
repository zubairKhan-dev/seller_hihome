import {APIConfig, updateSingleConfig} from "./def";

export class BaseAPIConfig implements APIConfig {
    private _protocol;
    private _server;
    private _application;
    private _api;
    private _version;

    constructor(prot: string, server: string, app: string, version?: string, api?: string ) {
        this._protocol = prot;
        this._server = server;
        this._application = app;
        this._api = api;
        this._version = version;
        // console.log(prot + server + app + api + version);
    }

    protocol(): string {
        return this._protocol;
    }

    server(): string {
        return this._server;
    }

    application(): string {
        return this._application;
    }

    version(): string {
        return this._version;
    }

    endPoint(): string {
        // if (this._api) {
        //     endPoint = `${this.protocol()}://${this.server()}/${this.application()}/${this._api}`;
        // } if (this._application === "") {
        //     endPoint = `${this.protocol()}://${this.server()}`;
        // } else {
        //     endPoint = `${this.protocol()}://${this.server()}/${this.application()}/`;
        // }
        //
        let version = "";
        if (this._version) {
            version = `v${this._version}`;
        }
        let endPoint = "";
        if (this._application) {
            endPoint = `${this.protocol()}://${this.server()}/${this.application()}/`;
        } else {
            endPoint = `${this.protocol()}://${this.server()}/${version}/`;
        }
        return endPoint;
    }

    updateFromRemote(data: any) {
        if (data) {
            updateSingleConfig(this, data, "protocol", "_protocol");
            updateSingleConfig(this, data, "server", "_server");
            updateSingleConfig(this, data, "application", "_application");
            updateSingleConfig(this, data, "api", "_api");
            updateSingleConfig(this, data, "version", "_version");
        }
    }
}
