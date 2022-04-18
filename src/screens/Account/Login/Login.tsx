import * as React from "react";
import {Component} from "react";
import {ScrollView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import ColorTheme from "../../../theme/Colors";
import {StaticStyles} from "../../../theme/Styles";
import Constants from "../../../theme/Constants";
import TextKVInput from "../../../components/TextKVInput";
import {getCurrentLocale, isRTLMode, strings} from "../../../components/Translations";
import ActionButton from "../../../components/ActionButton";
import {RTLView} from "react-native-rtl-layout";
import HFTextHeading from "../../../components/HFText/HFTextHeading";
import ForgotPassword from "../../../components/ForgotPassword";
import * as Api from "../../../lib/api";
import LoadingOverlay from "../../../components/Loading";
import {showMessageAlert} from "../../../common";
import {getDeviceId, setProfile, setSeller} from "../../../lib/user";
import Modal from "react-native-modal";
import {AppIcon} from "../../../common/IconUtils";
import {CommonIcons} from "../../../icons/Common";
import SignUp from "./SignUp";
import DeviceInfo from "react-native-device-info";

interface Props {
    navigation: any;
    show: boolean;
    onDismiss: Function;
    onLoginSuccess: Function;
}

interface State {
    loading?: boolean,
    username?: string,
    password?: string,
    errorText?: string,
    forgotPassword: boolean,
    errorOccurred?: boolean,
    showSignUp: boolean;
}

export default class Login extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;

    constructor(props) {
        super(props);
        this.state = {
            showSignUp: false,
            forgotPassword: false,
            loading: false,
            username: "",
            password: ""
        }
    }

    validEmail(email: string) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            return false;
        }
        return true;
    }

    private getPostObj() {
        let formData = new FormData();
        formData.append("email", this.state.username)
        formData.append("password", this.state.password)
        formData.append("device_id", DeviceInfo.getUniqueId())
        formData.append("device_udid", getDeviceId())
        return formData;
    }

    showErrorMessage(messageKey: string) {
        this.setState({errorOccurred: true, errorText: strings(messageKey)});
    }

    hideErrorMessage() {
        this.setState({errorOccurred: false});
    }

    loginUser() {
        this.hideErrorMessage();

        if (this.validInputs()) {
            this.setState({loading: true, errorOccurred: false});
            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    switch (response.code) {
                        case 200 :
                            if (resp) {
                                // analytics().logEvent('Login_Success', {
                                //     user_id: resp.id,
                                // });
                                setProfile(resp);
                                this.getProfile();
                            }
                            break;
                    }
                    this.setState({loading: false});
                }, (errors, errorMessage) => {
                    setTimeout(() => {
                        showMessageAlert(errorMessage);
                    }, 200);
                    this.setState({loading: false});
                });
            };
            this.apiExHandler = (reason) => {
                // showMessage(reason);
                setTimeout(() => {
                    showMessageAlert(reason);
                }, 200);
                this.setState({loading: false});
            };
            Api.loginUser(this.getPostObj())
                .then((response) => {
                        this.apiHandler(response);
                    },
                ).catch((reason => {
                    this.apiExHandler(reason);
                }),
            );
        }
    }

    private getProfile() {
        this.setState({loading: true});
        let formData = new FormData();
        this.apiHandler = (response) => {
            Api.checkValidationError(response, resp => {
                if (response.code === 200 && resp && resp.seller_details) {
                    setSeller(resp);
                    this.props.onLoginSuccess();
                }
                this.setState({loading: false});
            }, (errors, errorMessage) => {
                showMessageAlert(errorMessage);
                this.setState({loading: false});
            });
        };
        this.apiExHandler = (reason) => {
            showMessageAlert(reason);
            this.setState({loading: false});
        };
        Api.getProfile({})
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    validInputs() {

        if(!this.validEmail(this.state.username)){
          this.showErrorMessage("invalid_email");
          return false;
        }

        if (!this.state.password && this.state.password.length === 0) {
            this.showErrorMessage("invalid_password")
            return false;
        }
        return true;
    }

    private getErrors(errors) {
        let errorValue = "";
        if (errors) {
            if (errors.email && errors.email.length > 0) {
                errorValue = errorValue + errors.email[0] + "\n";
            }

            if (errors.phone && errors.phone.length > 0) {
                errorValue = errorValue + errors.phone[0];
            }
        }
        return errorValue;
    }

    private dismiss() {
        this.hideErrorMessage();
        this.setState({
          username: "",
          password: ""
        });
        this.props.onDismiss();
    }

    render() {
        return (
            <Modal
                isVisible={this.props.show}
                onBackButtonPress={() => {
                    this.dismiss();
                }}
                avoidKeyboard={true}
                useNativeDriver={true}
                onBackdropPress={() => this.dismiss()}>
                <View style={{
                    flex: 1,
                    backgroundColor: ColorTheme.white,
                    marginHorizontal: -20,
                    marginVertical: -20,
                    paddingHorizontal: 40,
                    paddingVertical: 40
                }}>
                    <RTLView locale={getCurrentLocale()} style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: Constants.defaultPaddingRegular
                    }}>
                        <View style={{flex: 1}}/>
                        <Text style={[{
                            textAlign: "center", color: "black",
                            fontWeight: "700",
                            fontSize: 18,
                        }]}> {strings("login")}</Text>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity onPress={() => {
                            this.hideErrorMessage();
                            this.dismiss();
                        }}>
                            <AppIcon name={"ic_close"}
                                     color={ColorTheme.appTheme}
                                     provider={CommonIcons}
                                     size={25}/>
                        </TouchableOpacity>
                    </RTLView>
                    <ScrollView style={{marginTop: 70}} showsVerticalScrollIndicator={false}>
                        <HFTextHeading value={strings("hello_welcome")}/>
                        <View style={{height: Constants.defaultPadding}}/>
                        {this.state.errorOccurred &&
                        <View style={[StaticStyles.center, {backgroundColor: "#ffe5e5", borderRadius: 5}]}>
                            <View style={{height: Constants.defaultPadding}}/>
                            <Text style={{
                                color: "red",
                                fontWeight: "400",
                                fontSize: 12,
                                marginTop: 2,
                                alignSelf: "center"
                            }}>{this.state.errorText}</Text>
                            <View style={{height: Constants.defaultPadding}}/>
                        </View>}
                        <View style={{height: Constants.defaultPadding}}/>
                        <TextKVInput text={this.state.username} title={strings("email")}
                                     secure={false}
                                     placeholder={"example@info.com"} 
                                     keyboard={'email-address'}
                                     value={value => {
                            this.setState({username: value})
                        }}/>
                        <View style={{height: Constants.defaultPaddingMax}}/>
                        <TextKVInput text={this.state.password} secure={true} title={strings("password")}
                                     placeholder={"**********"} 
                                     keyboard={'email-address'}
                                     value={value => {
                            this.setState({password: value})
                        }}/>
                        <View style={{height: Constants.defaultPaddingMax}}/>
                        <RTLView locale={getCurrentLocale()}>
                            <TouchableOpacity style={{justifyContent: "center"}} onPress={() => {
                                this.setState({forgotPassword: true})
                            }}>
                                <Text
                                    style={[StaticStyles.text_grey, {textAlign: isRTLMode() ? "right" : "left"}]}>{strings("forgot_password")}</Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                        </RTLView>
                        <View style={{height: Constants.defaultPaddingMax}}/>
                        <ActionButton variant={"normal"} title={strings("login")} onPress={() => {
                            this.loginUser();
                        }}/>
                        <View style={{height: 2 * Constants.defaultPaddingMax}}/>
                        <RTLView locale={getCurrentLocale()}>
                            <View style={{flex: 1}}/>
                            <Text style={{
                                fontWeight: "400",
                                fontSize: 15,
                                color: ColorTheme.grey
                            }}>{strings("dont_have_account")}</Text>
                            <View style={{width: Constants.defaultPadding}}/>
                            <TouchableOpacity style={{justifyContent: "center"}} onPress={() => {
                                this.setState({showSignUp: true})
                            }}>
                                <Text style={{
                                    color: ColorTheme.appTheme,
                                    fontWeight: "600",
                                    fontSize: 15
                                }}>{strings("sign_up")}</Text>
                            </TouchableOpacity>
                            <View style={{flex: 1}}/>
                        </RTLView>
                    </ScrollView>
                    <ForgotPassword show={this.state.forgotPassword}
                                    onDismiss={() => this.setState({forgotPassword: false})}/>
                    {this.state.loading && <LoadingOverlay/>}
                </View>
                {/*<RTLView locale={getCurrentLocale()} style={styles.container}>*/}
                {/*</RTLView>*/}
                <SignUp navigation={this.props.navigation} show={this.state.showSignUp}
                        onDismiss={() => this.setState({showSignUp: false})}/>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: Constants.defaultPaddingMax,
        backgroundColor: ColorTheme.white,
        margin: -20,
    },
});
