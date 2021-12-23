import {CameraOptions} from "react-native-image-picker";

export const PaymentGatewayAPIKey = "M2E1ZWI2M2EtYTEwYy00YzgwLTkxZmUtZWRhYTRiNTM4MGRlOmRiNGMyYmQ3LTgzNTItNGVlYi1iZGQ1LWQ4OTU4MGNiYmY1Mg==";
export const SMS_API_Key = "2f91f01e";
export const SMS_API_Secret = "mea6QqIDYTCLb7kI";


//DEVELOPMENT
// export const CODE_PUSH_KEY_ANDROID = "IpAg2HEuKnsAOQRe4TeCrKju3biB1afxzA4Me"; // android/app/src/main/res/values/strings.xml
// export const CODE_PUSH_KEY_IOS = "NmbqpVKflleqvd3AGiGAyvImLeT25tDPJhIsH";
// export const ONESIGNAL_APP_ID = "35f7105d-d2a5-4b44-8f1f-28ea14dfd065";
// export const DISPLAY_NAME = "SellerDev"
// export const BUNDLE_IDENTIFIER = "com.aziz.seller"
// export const APP_ENV = "dev"
// export const APP_VERSION = "1.0.1"

// PRODUCTION
export const CODE_PUSH_KEY_ANDROID = "Cvfx-gQZBKqofEHkfH7C1HXfPX1zRQHKrgYTY"; // android/app/src/main/res/values/strings.xml
export const CODE_PUSH_KEY_IOS = "z2JSc-SS-Nh0aVcVX_pXC6Y1gdqq3Vqda3Xs5"; // info.plist
export const ONESIGNAL_APP_ID = "762be659-3ba5-4e89-83e9-48d9c8586c12";
export const DISPLAY_NAME = "Seller"
export const BUNDLE_IDENTIFIER = "com.hihome.seller"
export const APP_ENV = "production"
export const APP_VERSION = "1.0.1"


export const photoOptions: CameraOptions = {
    mediaType: 'photo',
    saveToPhotos: true,
    maxWidth: 1000,
    maxHeight: 1000,
    quality: 1
};
