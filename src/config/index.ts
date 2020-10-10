import {APIConfig, Environment, IRemoteConfig, RemoteConfigs} from "./def";
import DevConfig from "./dev";
import QaConfig from "./qa";
import LiveConfig from "./production";
import RNConfig from "react-native-config";

type environment = "dev" | "qa" | "production";

export interface AppConfig extends Environment , IRemoteConfig{
    setEnv(env: environment): void;
}

class AppConfigImpl implements AppConfig {
    private _env: environment;
    private  _config: Environment;
    configs: any = {};

    constructor(env: environment) {
        this.updateConfigEnv(env);
    }
    setEnv(env: environment): void {
        this._env = env;
    }

    authAPI(): APIConfig {
        if (!this.configs.hasOwnProperty("auth"))
            this.configs.auth = this._config.authAPI();
        return this.configs.auth as  APIConfig;
    }

    sellerAPI(): APIConfig {
        if (!this.configs.hasOwnProperty("seller"))
            this.configs.simsari = this._config.sellerAPI();
        return this.configs.simsari as  APIConfig;
    }

    lookupAPI(): APIConfig {
        if (!this.configs.hasOwnProperty("lookup"))
            this.configs.lookup = this._config.lookupAPI();
        return this.configs.lookup as  APIConfig;
    }

    attachmentAPI(): APIConfig {
        if (!this.configs.hasOwnProperty("attachment"))
            this.configs.attachment = this._config.attachmentAPI();
        return this.configs.attachment as  APIConfig;
    }
    updateFromRemote(data: any) {
        const cfg = data.config;
        if (cfg && typeof  cfg === "object") {
            if (cfg.hasOwnProperty("env")) {
                const env = cfg.env;
                this.updateConfigEnv(env);
            }
        }
        const api: any = data.api;
        if (api && typeof  api === "object") {
            this.authAPI().updateFromRemote(api.auth);
            this.sellerAPI().updateFromRemote(api.ecommerce);
            this.lookupAPI().updateFromRemote(api.lookup);
            this.attachmentAPI().updateFromRemote(api.attachment);
        }
    }

    private updateConfigEnv(env: environment) {
        this.setEnv(env);
        switch (this._env) {
            case "dev":
                this._config = DevConfig;
                break;

            case "qa":
                this._config = QaConfig;
                break;

            case "production":
                this._config = LiveConfig;
                break;

            default:
                this._config = LiveConfig;
        }
        this.configs = {};
    }
}

const config: AppConfig = new AppConfigImpl(RNConfig.APP_ENV);
export default config;
RemoteConfigs.push(config);
