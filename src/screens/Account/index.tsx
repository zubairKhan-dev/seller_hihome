import * as React from "react";
import {Component} from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
    Platform
} from "react-native";
import ColorTheme from "../../theme/Colors";
import Constants from "../../theme/Constants";
import {getAddress, getUserEmail, getUserFullName, isUserLoggedIn, logout} from "../../lib/user";
import {getCurrentLocale, isRTLMode, strings} from "../../components/Translations";
import {RTLText, RTLView} from "react-native-rtl-layout";
import {showMessageAlert} from "../../common";
import AccountItem from "../../components/AccountItem";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import {AccessToken, LoginManager} from "react-native-fbsdk";
import LoginPopUp from "../../components/LoginPopUp";
import {StaticStyles} from "../../theme/Styles";
import {SafeAreaView} from "react-navigation";
import CodePush from "react-native-code-push";
import FastImage from "react-native-fast-image";
import * as Api from "../../lib/api";
import { showMessage } from "react-native-flash-message";

// {"icon": "subscription", "title": strings("subscription"), "screen": "Subscription"},
// {"icon": "my_earnings", "title": strings("my_earnings"), "screen": "Earnings"},
// {"icon": "customer_reviews", "title": strings("customer_reviews"), "screen": "Reviews"},
// {"icon": "notification_ic", "title": strings("notifications"), "screen": "Notifications"},
interface Props {
    navigation?: any;
}

interface State {
    options: any[];
    showLogin: boolean;
    isAccountEnabled: boolean;
    appVersion?: string;
    logo?: string;
    address?: string;
    sellerProfile?: any;
}

export default class Account extends Component<Props, State> {
    static user: { name: string, id: any, email: string, loggedIn: boolean, avatar: any, username: string };
    focusListener: any;
    apiHandler: any;
    apiExHandler: any;

    constructor(props) {
        super(props);
        this.state = {
            showLogin: false, isAccountEnabled: true, options: [
                {"icon": "profile", "title": "my_profile", "screen": "Profile", "alertMessage": undefined},
                {"icon": "my_license", "title": "my_license", "screen": "License", "alertMessage": undefined},
                {"icon": "map_pin", "title": "my_address", "screen": "MyAddress", "alertMessage": undefined},
                {"icon": "language", "title": "language", "screen": "Language", "alertMessage": undefined},
                {"icon": "contact", "title": "contact_us", "screen": "ContactUs", "alertMessage": undefined},
                {"icon": "contact", "title": "contact_us", "screen": "ContactUs", "alertMessage": undefined}
            ]
        };
    }

    componentDidMount(): void {
        const {navigation} = this.props;
        this.focusListener = navigation.addListener("focus", () => {
            this.getProfile();
        });
        CodePush.getUpdateMetadata().then((metadata) => {
            if (metadata) {
                this.setState({
                    appVersion: metadata.appVersion,
                });
            }
        });
    }

    componentWillUnmount() {
    }

    private getProfile() {
        let formData = new FormData();
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response.code === 200 && resp && resp.seller_details) {
                    let details = resp.seller_details;
                    let address = details.address;
                    this.setState({
                        logo: details.logo,
                        address: details.address,
                        sellerProfile: resp,
                        options: [
                            {"icon": "profile", "title": "my_profile", "screen": "Profile", "alertMessage": undefined},
                            {"icon": "my_license", "title": "my_license", "screen": "License", "alertMessage": undefined},
                            {
                                "icon": "map_pin",
                                "title": "my_address",
                                "screen": "MyAddress",
                                "alertMessage": (address && address.length !== 0) ? " " : strings("missing_address")
                            },
                            {"icon": "language", "title": "language", "screen": "Language", "alertMessage": undefined},
                            {"icon": "contact", "title": "contact_us", "screen": "ContactUs", "alertMessage": undefined},
                            {"icon": "contact", "title": "contact_us", "screen": "ContactUs", "alertMessage": undefined}
                        ]
                    });
                }
            }, (errors, errorMessage) => {
                showMessageAlert(errorMessage);
            });
        };
        this.apiExHandler = (reason) => {
            showMessageAlert(reason);
        };
        Api.getProfile(formData)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    private updateStatus(status) {
        if (this.state.sellerProfile) {
            let formData = new FormData();
            formData.append("license_photo", this.state.sellerProfile.seller_details.license_photo)
            formData.append("user_id", this.state.sellerProfile.id)
            formData.append("first_name", this.state.sellerProfile.first_name)
            formData.append("last_name", this.state.sellerProfile.last_name)
            formData.append("email", this.state.sellerProfile.email)
            formData.append("password", "123456") // REMOVE
            formData.append("c_password", "123456") // REMOVE
            formData.append("phone", "0507467251")
            formData.append("lang", getCurrentLocale())
            formData.append("emirates_id", this.state.sellerProfile.seller_details.emirates_id)
            formData.append("address", this.state.sellerProfile.seller_details.address)
            formData.append("accept_orders", this.state.sellerProfile.seller_details.accept_orders)
            formData.append("legal_business_name", this.state.sellerProfile.seller_details.title)
            formData.append("legal_business_email", this.state.sellerProfile.seller_details.legal_business_email)
            formData.append("c_legal_business_email", this.state.sellerProfile.seller_details.legal_business_email)
            formData.append("legal_business_phone", this.state.sellerProfile.seller_details.legal_business_phone)
            formData.append("contact_us_first_name", this.state.sellerProfile.seller_details.contact_us_first_name)
            formData.append("contact_us_last_name", this.state.sellerProfile.seller_details.contact_us_last_name)
            formData.append("contact_us_email", this.state.sellerProfile.seller_details.contact_us_email)
            formData.append("logo", this.state.sellerProfile.seller_details.logo)
            formData.append("license_id", this.state.sellerProfile.seller_details.license_id)
            formData.append("license_start_date", this.state.sellerProfile.seller_details.license_start_date)
            formData.append("license_end_date", this.state.sellerProfile.seller_details.license_end_date)
            formData.append("city", this.state.sellerProfile.seller_details.city)
            formData.append("pincode", this.state.sellerProfile.seller_details.pincode)
            formData.append("status", status)

            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    if (response.code === 200) {

                    } else {
                        showMessage({
                            message: strings("an_error_occurred"),
                            type: "danger",
                            icon: "info"
                        });
                        setTimeout(() => {
                            this.toggleSwitch(!status);
                        }, 400);
                    }
                }, (errors, errorMessage) => {
                    setTimeout(() => {
                        showMessageAlert(errorMessage);
                    }, 400);
                    setTimeout(() => {
                        this.toggleSwitch(!status);
                    }, 600);
                });
            };
            this.apiExHandler = (reason) => {
                setTimeout(() => {
                    showMessageAlert(reason);
                }, 400);
                setTimeout(() => {
                    this.toggleSwitch(!status);
                }, 600);
            };
            Api.updateProfile(formData)
                .then((response) => {
                        this.apiHandler(response);
                    },
                ).catch((reason => {
                    this.apiExHandler(reason);
                }),
            );
        }
    }

    facebookLogin() {
        LoginManager.logInWithPermissions(["public_profile"]).then(
            function (result) {
                function initUser(accessToken: any) {
                    fetch('https://graph.facebook.com/v2.5/me?fields=email,name,friends&access_token=' + accessToken)
                        .then((response) => response.json())
                        .then((json) => {
                            // Some user object has been set up somewhere, build that user here
                            Account.user.name = json.name
                            Account.user.id = json.id
                            Account.user.email = json.email
                            Account.user.username = json.name
                            Account.user.loggedIn = true
                            console.log("FACEBOOK USER =", Account.user);
                            // this.user.avatar = setAvatar(json.id)
                        })
                        .catch(() => {
                            showMessageAlert('ERROR GETTING DATA FROM FACEBOOK')
                        })
                }

                if (result.isCancelled) {
                    console.log("Login cancelled");
                } else {
                    AccessToken.getCurrentAccessToken().then((data) => {
                        let accessToken = data.accessToken
                        // const { accessToken } = data

                        AccessToken.getCurrentAccessToken().then((data) => {
                            const {accessToken} = data
                            initUser(accessToken)
                        })
                    })

                    console.log(
                        "Login success with permissions: " +
                        result.grantedPermissions.toString()
                    );
                }
            },
            function (error) {
                console.log("Login fail with error: " + error);
            }
        );
    }


    initUser = (accessToken) => {

    }

    // //Create response callback.
    _responseInfoCallback = (error, result) => {
        if (error) {
            showMessageAlert('Error fetching data: ' + error.toString());
        } else {
            console.log("Result: " + result);
            showMessageAlert('Result Name: ' + result);
        }
    }
    toggleSwitch = (value) => {
        this.setState({isAccountEnabled: value});
    }

    renderHeader() {
        return (
            <View style={{
                backgroundColor: ColorTheme.white
            }}>
                <View style={{
                    paddingHorizontal: Constants.defaultPaddingRegular,
                }}>
                    <View style={{height: Constants.defaultPadding}}/>
                    <RTLView locale={getCurrentLocale()}>
                        <View style={{flex: 1}}/>
                        <Text style={StaticStyles.nav_title}>{strings("my_account")}</Text>
                        <View style={{flex: 1}}/>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingMin}}/>
                </View>
            </View>
        );
    }

    renderUserDetails() {
        let itemDimension = 70;
        return (
            <View style={{paddingHorizontal: Constants.defaultPadding, marginTop: Constants.defaultPaddingRegular}}>
                <RTLView locale={getCurrentLocale()}>
                    <View style={{alignItems: "center", justifyContent: "center"}}>
                        <ActivityIndicator size={"small"} style={{position: "absolute"}} color={ColorTheme.black}/>
                        <FastImage
                            style={{
                                width: itemDimension,
                                height: itemDimension,
                                borderWidth: 0.5,
                                borderRadius: Constants.defaultPadding,
                                borderColor: ColorTheme.grey,
                            }}
                            source={{
                                uri: this.state.logo,
                                priority: FastImage.priority.normal,
                            }}
                            onLoadStart={() => {
                            }}
                            onLoadEnd={() => {
                            }}
                        />
                    </View>
                    {/*<Image style={{width: 90, height: 90}} source={require('../../../assets/images/app-logo.png')}/>*/}
                    <View style={{width: Constants.defaultPadding}}/>
                    <View style={{}}>
                        <View style={{flex: 1}}/>
                        <Text style={{
                            fontWeight: "600",
                            fontSize: 15,
                            color: ColorTheme.black,
                            textAlign: isRTLMode() ? "right" : "left"
                        }}>{strings("hello") + getUserFullName()}</Text>
                        <Text style={{
                            fontWeight: "400",
                            fontSize: 11,
                            color: ColorTheme.grey,
                            textAlign: isRTLMode() ? "right" : "left"
                        }}>{getUserEmail()}</Text>
                        <View style={{flex: 1}}/>
                        <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                            <Switch
                                style={{transform: [{scaleX: .7}, {scaleY: .7}]}}
                                trackColor={{false: ColorTheme.white, true: ColorTheme.appThemeSecond}}
                                thumbColor={this.state.isAccountEnabled ? ColorTheme.white : ColorTheme.textGreyDark}
                                ios_backgroundColor={ColorTheme.textGreyLight}
                                onValueChange={(value) => {
                                    this.toggleSwitch(value);
                                    this.updateStatus(value);
                                }}
                                value={this.state.isAccountEnabled}
                            />
                            <Text
                                style={[StaticStyles.regularFont, {
                                    color: this.state.isAccountEnabled ? ColorTheme.appTheme : ColorTheme.textGreyDark,
                                    fontSize: isRTLMode() ? 12 : 11, textAlign: "center"
                                }]}>
                                {this.state.isAccountEnabled ? strings("account_active") : strings("account_inactive")}
                            </Text>
                        </RTLView>
                        {/*<View style={{ alignItems: isRTLMode() ? "flex-end" : "flex-start"}}>*/}
                        {/*    */}
                        {/*</View>*/}
                    </View>
                </RTLView>
            </View>
        )
    }

    renderLoginUser() {
        return (
            <View style={{flex: 1, paddingHorizontal: Constants.defaultPadding, paddingBottom: Constants.marginBottom}}>
                <View
                    style={{height: 3, backgroundColor: ColorTheme.placeholder, opacity: 0.25, marginHorizontal: -20}}/>
                <FlatList
                    data={this.state.options}
                    renderItem={({item, index}) => this.renderRow(item, index)}
                />
            </View>
        );
    }

    renderRow(value, index) {
        if (index === this.state.options.length - 1) {
            return (
                this.renderSignOut()
            )
        } else {
            return (
                <AccountItem alertMessage={value.alertMessage} image={value.icon} title={strings(value.title)}
                             onPress={() => {
                                 this.props.navigation.navigate(value.screen);
                             }}/>
            )
        }

    }

    renderSignOut() {
        return (
            <View style={{flex: 1}}>
                <TouchableOpacity style={{justifyContent: "center"}} onPress={() => {
                    Alert.alert(
                        strings("app_name"),
                        strings("confirm_logout"),
                        [
                            {
                                text: strings("yes"), onPress: () => {
                                    logout();
                                    this.setState({
                                        showLogin: true
                                    })
                                }
                            },
                            {
                                text: strings("no"), onPress: () => {
                                }
                            },
                        ],
                        {cancelable: false},
                    );
                }}>
                    <RTLView locale={getCurrentLocale()} style={{
                        padding: 15,
                        flexDirection: "row",
                        backgroundColor: "white",
                        alignItems: "center"
                    }}>
                        <AppIcon name={"logout"}
                                 color={ColorTheme.grey}
                                 provider={CommonIcons}
                                 size={25}/>
                        <View style={{width: Constants.defaultPaddingRegular}}/>
                        <RTLText fontSize={Constants.regularSmallFontSize} locale={getCurrentLocale()}
                                 style={[{
                                     fontWeight: "500",
                                     color: ColorTheme.grey,
                                     textAlign: isRTLMode() ? "right" : "left",
                                     fontSize: isRTLMode() ? 13 : Constants.regularSmallFontSize
                                 }]}>{strings("sign_out")}</RTLText>
                        <View style={{flex: 1}}/>
                        <RTLText fontSize={Constants.regularSmallFontSize} locale={getCurrentLocale()}
                                 style={[{
                                     fontWeight: "500",
                                     color: ColorTheme.grey,
                                     textAlign: isRTLMode() ? "left" : "right",
                                     fontSize: isRTLMode() ? 13 : Constants.regularSmallFontSize
                                 }]}>{strings("version") + " " + this.state.appVersion}</RTLText>
                    </RTLView>
                </TouchableOpacity>
            </View>
        );
    }

    renderGuestUser() {
        return (
            <View>
                <LoginPopUp navigation={this.props.navigation} show={this.state.showLogin}
                            onDismiss={() => this.setState({showLogin: false})}/>
            </View>
        );
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1, backgroundColor: ColorTheme.white}}>
                {this.renderHeader()}
                {isUserLoggedIn() && this.renderUserDetails()}
                <View style={[{
                    flex: 1,
                    backgroundColor: ColorTheme.white,
                    marginTop: Constants.defaultPadding
                }]}>
                    {!isUserLoggedIn() && <ScrollView style={{marginHorizontal: Constants.defaultPaddingMax}}>
                        {this.renderGuestUser()}
                    </ScrollView>}
                    {isUserLoggedIn() && this.renderLoginUser()}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: ColorTheme.white},
    language: {
        paddingTop: 10,
        textAlign: 'center',
    },
});

{/*<AccountItem image={"login"} title={"Login"} onPress={() => {*/
}
{/*    this.props.navigation.navigate("Login");*/
}
{/*}}/>*/
}
{/*<View style={{height: Constants.defaultPaddingMax}}/>*/
}
{/*<AccountItem image={"enquiry"} title={"FAQs"} onPress={() => {*/
}

{/*}}/>*/
}
{/*<AccountItem image={"settings"} title={"Ar"} onPress={() => {*/
}
{/*    setLanguage("ar")*/
}
{/*}}/>*/
}
{/*<Text style={[StaticStyles.lightFont, {*/
}
{/*    textAlign: "center",*/
}
{/*    color: ColorTheme.textGrey,*/
}
{/*    marginTop: Constants.defaultPaddingMax*/
}
{/*}]}>{"Application Version : v1.0"}</Text>*/
}


{/*<LoginButton*/
}
{/*    onLoginFinished={*/
}
{/*        (error, result) => {*/
}
{/*            if (error) {*/
}
{/*                console.log("login has error: " + result.error);*/
}
{/*            } else if (result.isCancelled) {*/
}
{/*                console.log("login is cancelled.");*/
}
{/*            } else {*/
}
{/*                AccessToken.getCurrentAccessToken().then(*/
}
{/*                    (data) => {*/
}
{/*                        debugger;*/
}
{/*                        console.log(data.accessToken.toString())*/
}
{/*                    }*/
}
{/*                )*/
}
{/*            }*/
}
{/*        }*/
}
{/*    }*/
}
{/*    onLogoutFinished={() => console.log("logout.")}/>*/
}

