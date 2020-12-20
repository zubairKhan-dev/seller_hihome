import {Alert, Platform} from "react-native";
import {strings, getCurrentLocale} from "../components/Translations";
import appConfig from "../config";
import {getToken, logout, setToken} from "./user";
import {XEvents} from "./EventBus";
import Events from "react-native-simple-events";
//===========================================================
// LOGIN & REGISTRATION APIs
//===========================================================

export function registerUser(request: any) {
    return httpPostForm(appConfig.authAPI().endPoint() + "sellers/register", request);
}

export function loginUser(request: any) {
    return httpPostForm(appConfig.authAPI().endPoint() + "sellers/login", request);
}

export function generateOTP(email: string) {
    return httpPost(appConfig.authAPI().endPoint() + email + "/password/send", undefined);
}

export function updatePassword(request: any, otp: string) {
    return httpPost(appConfig.authAPI().endPoint() + "password/reset/" + otp, request);
}

export function loginSocialUser(request: any) {
    return httpPostForm(appConfig.authAPI().endPoint() + "login-social", request);
}

export function registerSocialUser(request: any) {
    return httpPostForm(appConfig.authAPI().endPoint() + "register-social", request);
}

export function changePassword(request: any) {
    return httpPostForm(appConfig.authAPI().endPoint() + "sellers/change-password", request);
}

export function updateProfile(request: any) {
    return httpPostForm(appConfig.authAPI().endPoint() + "sellers/update-profile", request);
}

export function sendFeedback(request: any) {
    return httpPostForm(appConfig.authAPI().endPoint() + "sellers/contact-us", request);
}

export function getProfile(request: any) {
    return httpPostForm(appConfig.authAPI().endPoint() + "sellers/profile", request);
}
//===========================================================
// ORDERS APIs
//===========================================================

export function getOrderStatusList() {
    return httpGet(appConfig.sellerAPI().endPoint() + "sellers/orders/list-orders-status");
}

export function getOrdersList(pageIndex: number) {
    return httpGet(appConfig.sellerAPI().endPoint() + "sellers/orders?per_page=10&status=all&page=" + pageIndex);
}

export function updateOrderStatus(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/orders/change_order_status", request);
}

export function getFoodList(pageIndex: number) {
    return httpGet(appConfig.sellerAPI().endPoint() + "sellers/products?per_page=10&page=" + pageIndex);
}

export function updateProductStatus(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/products/change_product_status", request);
}

export function updateProductStock(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/products/out_of_stock", request);
}

export function addProductImage(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/products/add-images", request);
}

export function removeProductImage(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/products/remove-image", request);
}

export function removeMainImage(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/products/remove-main-image", request);
}

export function addProduct(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/products/create", request);
}

export function updateProduct(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/products/update", request);
}

export function removeProduct(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/products/remove", request);
}

export function getCategories() {
    return httpGet(appConfig.sellerAPI().endPoint() + "categories?per_page=20");
}

export function getCities() {
    return  httpGet(appConfig.sellerAPI().endPoint() + "locations?per_page=10&with_sub_locations=false&must_has_sub_locations=false");
}

export function saveAddress(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/update_address", request);
}

export function getSellerStats(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/dashboard", request);
}

export function forgetPassword(request: any) {
    return httpPostForm(appConfig.sellerAPI().endPoint() + "sellers/forget_password", request);
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

function httpPostForm(url, data, headers = {}) {
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

function httpGet(url) {
    console.log("REQUEST = ", url)
    return doApi(fetch(url, {
        method: "get",
        headers: buildHeaders(),
    }), url);
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
                            logout();
                            Events.trigger(XEvents.SESSION_EXPIRED);
                        },
                    },
                ],
                {cancelable: false},
            );
        }
        // else {
        //     let exc: any = {
        //         type: "webservice_error",
        //     };
        //     let errorMessage = "";
        //     if (response.status === 401) {
        //         errorMessage += strings("invalid_credentials");
        //     } else if (response.reason) {
        //         errorMessage += "Webservice Error \n";
        //         errorMessage += response.status;
        //         errorMessage += " " + response.reason;
        //     }
        //     exc.message = errorMessage;
        //     exc.code = response.status;
        //     exc.toString = () => {
        //         return exc.message;
        //     };
        //     throw exc;
        // }
    }
}

function buildHeaders(extra?: any) {
    let token = getToken();
    console.log("TOKEN", token);
    let headers: any = {
        "Content-Type": "multipart/form-data",
        "Accept-Language": getCurrentLocale(),
        "Accept": "application/json",
        "Authorization": "Bearer " + token,
        "device-type": Platform.OS === "ios" ? "ios" : "android",
        "lang": getCurrentLocale(),
        "type": "formData",
    };
    // if (token)
    //     headers.Token = token;
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
        let rsp = apiResponse.response_data ? apiResponse.response_data : apiResponse;
        onNoError(rsp);
    }
}

// methods need to be implemented in future

function updateToken(token: string) {
    setToken(token);
}
