export interface IRemoteConfig {
    updateFromRemote: (data: any) => void;
}

export interface APIConfig extends IRemoteConfig {
    protocol(): string;

    server(): string;

    application(): string;

    endPoint(): string;
}

export interface Environment {
    authAPI(): APIConfig;
    sellerAPI(): APIConfig;
    lookupAPI(): APIConfig;
    attachmentAPI(): APIConfig;
}

export const RemoteConfigs: IRemoteConfig[] = [];

export function updateSingleConfig(target: object, rc: object, key, objectKey = undefined) {
    if (objectKey == undefined) objectKey = key;
    if (rc.hasOwnProperty(key)) {
        target[objectKey] = rc[key];
    }
}
