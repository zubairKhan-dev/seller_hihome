import {APIConfig, Environment} from "./def";
import {BaseAPIConfig} from "./BaseAPIConfig";

const PROTOCOL = "http";
const SERVER = "shop.hihoome.com";
const APPLICATION = "api";
const ENDPOINT = "";
const VERSION = "";


// PAYMENT
const PAYMENT_PROTOCOL = "https";
const PAYMENT_SERVER = "api-gateway.sandbox.ngenius-payments.com";
const PAYMENT_TOKEN_APPLICATION = "identity";
const PAYMENT_URL_APPLICATION = "transactions";
const PAYMENT_ENDPOINT = "";

class Config implements Environment {
    authAPI(): APIConfig {
        return new BaseAPIConfig(PROTOCOL, SERVER, APPLICATION, VERSION);
    }

    sellerAPI(): APIConfig {
        return new BaseAPIConfig(PROTOCOL, SERVER, APPLICATION, VERSION);
    }

    lookupAPI(): APIConfig {
        return new BaseAPIConfig(PROTOCOL, SERVER, undefined, VERSION);
    }

    attachmentAPI(): APIConfig {
        return new BaseAPIConfig(PROTOCOL, SERVER, undefined, VERSION);
    }
}

const config = new Config();
export default config;
