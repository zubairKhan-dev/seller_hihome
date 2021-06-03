import {APIConfig, Environment} from "./def";
import {BaseAPIConfig} from "./BaseAPIConfig";

const PROTOCOL = "https";
const SERVER = "hihoome.com";
const APPLICATION = "public/api";
const ENDPOINT = "";
const VERSION = "";
const APPLICATION_RATINGS = "items";

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
