import {Alert} from "react-native";
import {strings} from "../components/Translations";
import {setToken} from "./user";
import appConfig from "../config";
import {PaymentGatewayAPIKey} from "../config/Constants";

// export function getAuthToken(request: any) {
//     return httpPost(appConfig.paymentTokenAPI().endPoint() + "auth/access-token", request, {"Authorization": "Basic " + PaymentGatewayAPIKey, "Content-Type": "application/vnd.ni-identity.v1+json"});
// }
//
// export function getPaymentURL(outlet_id: any, request: any, token: string) {
//     return httpPost(appConfig.paymentURLAPI().endPoint() + "outlets/" + outlet_id + "/orders", request, {"Authorization": "Bearer " + token, "Content-Type": "application/vnd.ni-payment.v2+json"});
// }
//
// export function getPaymentStatus(outlet_id: any, reference_number: any, token: string) {
//     return httpGet(appConfig.paymentURLAPI().endPoint() + "outlets/" + outlet_id + "/orders/" + reference_number, {"Authorization": "Bearer " + token});
// }

//===========================================================
// OTP APIs
//===========================================================

export function generateOTP(mobileNumber: string) {
    return httpGet("https://api.nexmo.com/verify/json?api_key=2f91f01e&api_secret=mea6QqIDYTCLb7kI&number=" +  mobileNumber+ "&brand=HiHome&code_length=4");
}

export function verifyOTP(request_id: string, otpValue: string) {
    return httpGet("https://api.nexmo.com/verify/check/json?api_key=2f91f01e&api_secret=mea6QqIDYTCLb7kI&request_id=" + request_id + "&code=" + otpValue);
}


function httpGet(url, headers = {}) {
    console.log("REQUEST = ", url)
    return doApi(fetch(url, {
        method: "get",
        headers: buildGetHeaders(headers),
    }), url);
}

function httpPost(url, data, headers = {}) {
    if (data) {
        if (data.constructor === ArrayBuffer) {

        } else if (typeof data === "object") {
            data = JSON.stringify(data);
        }
    }
    return httpPostRaw(url, data, headers);
}

function httpPostRaw(url, data, headers = {}) {
    console.log("REQUEST = ", url)
    console.log("BODY = ", data)
    return fetch(url, {
        method: "post",
        headers: buildHeaders(headers),
        body: data,
    })
        .then(response => {
            return response.json()
                .then(responseJson => {
                    handleHttpResponse(response, responseJson);
                    console.log("RESPONSE = ", responseJson)
                    return responseJson;
                });
        });

}

function doApi(promise: Promise<Response>, url: string) {
    return promise.then((response) => {
        console.log("RESPONSE = ", response)
        return response.json();
    }).then(jsonResponse => {
        console.log("RESPONSE = ", jsonResponse)
        return jsonResponse;
    });
}

function handleHttpResponse(response: any, responseJSON: any) {
    if (response.status === 200) {
        let userT = responseJSON.response_data ? responseJSON.response_data.token : undefined;
        if (userT) {
            updateToken(userT);
        }
    } else {
        if (response && response.status === 401) {
            Alert.alert(strings("app_name"), strings("session_expired"),
                [
                    {
                        text: strings("ok"), onPress: () => {
                            // notifySessionExpired();
                        },
                    },
                ],
                {cancelable: false},
            );
        }
    }
}

function buildHeaders(extra?: any) {
    let headers: any = {
        // "Accept": "application/json",
    };
    return new Headers({...headers, ...extra});
}

function buildGetHeaders(extra?: any) {
    let headers: any = {
    };
    return new Headers({...headers, ...extra});
}


export function checkValidationError(apiResponse: any,
                                     onNoError: (response: any) => void,
                                     onValidationError: (errors: object[], errorMessage: string) => void) {
    if (apiResponse === undefined) {
        onValidationError([], "Null response");
    } else if (apiResponse.error_msg && apiResponse.error_msg.length > 0) {
        let message = apiResponse.error_msg;
        onValidationError(apiResponse.errors, message.trim());
    } else {
        onNoError(apiResponse);
    }
}

// methods need to be implemented in future

function updateToken(token: string) {
    setToken(token);
}
