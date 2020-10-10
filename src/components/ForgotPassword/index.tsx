import React, {Component} from "react";
import Modal from "react-native-modal";
import {ActivityIndicator, Text, TextInput, TouchableOpacity, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import ActionButton from "../ActionButton";
import {getCurrentLocale, strings} from "../Translations";
import {RTLView} from "react-native-rtl-layout";
import * as Api from "../../lib/api";
import analytics from "@react-native-firebase/analytics";
import { showMessageAlert } from "../../common";

interface Props {
    show: boolean;
    onDismiss: Function;
}

interface State {
    loading: boolean;
    show: boolean;
    email?: string;
    resultMessage?: string;
    resultCode?: string;
}

export default class ForgotPassword extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            show: false,
            email: "",
            resultMessage: undefined,
            resultCode: ""
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            show: newProps.show,
            resultMessage: undefined,
            resultCode: "",
            email: ""
        });
    }

    private getPostObj() {
        let formData = new FormData();
        formData.append("email", this.state.email);
        return formData;
    }

    validEmail(email: string) {
        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(email) === false) {
            console.log("Email is Not Correct");
            return false;
        }
        return true;
    }

    forgetPassword() {
        if (this.validEmail(this.state.email)) {
            this.setState({loading: true, resultMessage: undefined});
            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    switch (response.code) {
                        case 200 :
                            if (response.success_msg && response.success_msg.length > 0) {
                                this.setState({resultCode: "1", resultMessage: response.success_msg});
                            } else {
                                this.setState({resultCode: "1", resultMessage: strings("reset_link_sent")});
                            }
                            analytics().logEvent('Forget_Password', {
                                email: this.state.email,
                            });
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
            Api.forgetPassword(this.getPostObj())
                .then((response) => {
                        this.apiHandler(response);
                    },
                ).catch((reason => {
                    this.apiExHandler(reason);
                }),
            );
        } else {
            this.showErrorMessage("invalid_email");
        }
    }

    showErrorMessage(messageKey: string) {
        this.setState({resultCode: "0", resultMessage: strings(messageKey)});
    }

    renderForgotPasswordView() {
        return (
            <View style={{flex: 1}}>
                <Text style={{
                    color: ColorTheme.appTheme,
                    fontWeight: "700",
                    fontSize: 14
                }}>{strings("forgot_password")}</Text>
                <View style={{height: Constants.defaultPaddingMax}}/>
                <Text style={{
                    color: ColorTheme.textGreyDark,
                    fontWeight: "400",
                    fontSize: 14
                }}>{strings("enter_email_message")}</Text>
                <View style={{height: Constants.defaultPadding}}/>
                <View style={{
                    height: 40,
                    borderColor: ColorTheme.grey,
                    borderWidth: 1,
                    borderRadius: 5,
                    padding: Constants.defaultPadding
                }}>
                    <TextInput style={{color: ColorTheme.textDark}} placeholder={"example@info.com"}
                               placeholderTextColor={ColorTheme.placeholder} value={this.state.email}
                               onChangeText={(value) => {
                                   this.setState({email: value})
                               }}/>
                </View>
                <View style={{height: Constants.defaultPadding}}/>
                {this.state.resultMessage && <Text style={{
                    color: this.state.resultCode === "0" ? "red" : ColorTheme.appThemeSecond,
                    fontWeight: "400",
                    fontSize: 14
                }}>{this.state.resultMessage}</Text>}
                <View style={{height: 2 * Constants.defaultPadding}}/>
                {this.state.loading && <ActivityIndicator size={"small"} style={{}} color={ColorTheme.appTheme}/>}
                <View style={{height: 2 * Constants.defaultPaddingRegular}}/>
                <RTLView style={{}} locale={getCurrentLocale()}>
                    <View style={{flex: 1}}>
                        <ActionButton variant={"normal"} title={strings("reset")} onPress={() => {this.forgetPassword();}}/>
                    </View>
                    <View style={{width: Constants.defaultPadding}}/>
                    <View style={{flex: 1}}>
                        <ActionButton variant={"alt"} title={strings("cancel")} onPress={() => {this.props.onDismiss()}}/>
                    </View>
                </RTLView>
            </View>
        );
    }

    render() {
        return (
            <Modal
                isVisible={this.props.show}
                onBackButtonPress={() => {
                    this.dismiss();
                }}
                backdropColor={ColorTheme.white}
                backdropOpacity={0.95}
                avoidKeyboard={true}
                useNativeDriver={true}
            >
                <View style={[StaticStyles.shadow, {
                    height: 320,
                    backgroundColor: ColorTheme.white,
                    borderRadius: Constants.messageViewCornerRadius,
                    padding: Constants.defaultPaddingMax
                }]}>
                    <View style={{flexDirection: "row", marginHorizontal: -20, marginTop: -20}}>
                        <View style={{flex: 1}}/>
                        <TouchableOpacity
                            onPress={() => {
                                this.dismiss();
                            }}>
                            <View style={[StaticStyles.center, {
                                width: 30,
                                height: 30,
                                borderRadius: 15,
                                backgroundColor: ColorTheme.white
                            }]}>
                                <AppIcon name={"ic_close"}
                                         color={ColorTheme.appTheme}
                                         provider={CommonIcons}
                                         size={25}/>
                            </View>
                        </TouchableOpacity>
                    </View>
                    <View style={{height: Constants.defaultPadding}}/>
                    {this.renderForgotPasswordView()}
                </View>
            </Modal>
        );
    }

    private dismiss() {
        this.props.onDismiss();
    }
}
