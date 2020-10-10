import React, {Component} from "react";
import Modal from "react-native-modal";
import {ActivityIndicator, StyleSheet, Text, View} from "react-native";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {getCurrentLocale, strings} from "../Translations";
import ColorTheme from "../../theme/Colors";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import ActionButton from "../ActionButton";
import {RTLView} from "react-native-rtl-layout";
import TextKVInput from "../TextKVInput";
import {showMessageAlert} from "../../common";
import * as Api from "../../lib/api";

interface Props {
    show: boolean;
    hasCurrentPassword?: boolean;
    onDismiss: Function;
    onSuccess: Function;
    onFailure: Function;
}

interface State {
    isActivity?: boolean;
    show: boolean;
    otpSent: boolean;
    otp: string;
    request_id: string;
    current_password: string;
    new_password: string;
    confirm_new_password: string;
}

export default class ChangePasswordView extends Component<Props, State> {
    apiHandler: any;
    apiExHandler: any;

    constructor(props) {
        super(props);
        this.state = {
            show: false,
            otpSent: false,
            isActivity: false,
            otp: "",
            request_id: "",
            current_password: "",
            new_password: "",
            confirm_new_password: "",
        };
    }

    componentDidMount() {
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            show: newProps.show,
            otpSent: false
        });
    }

    validateInputs() {
        if (this.props.hasCurrentPassword && this.state.current_password.length === 0) {
            showMessageAlert(strings("invalid_current_password"));
            return false;
        }

        if (this.state.new_password.length === 0) {
            showMessageAlert(strings("invalid_new_password"));
            return false;
        }

        if (this.state.confirm_new_password.length === 0) {
            showMessageAlert(strings("invalid_confirm_new_password"));
            return false;
        }

        if (this.state.new_password !== this.state.confirm_new_password) {
            showMessageAlert(strings("password_mismatch"));
            return false;
        }

        return true;
    }
    private updatePassword() {
        if (this.validateInputs()) {
            this.setState({isActivity: true});
            let formData = new FormData();
            if (this.props.hasCurrentPassword) {
                formData.append("current_password", this.state.current_password);
            }
            formData.append("new_password", this.state.new_password);
            formData.append("new_confirm_password", this.state.confirm_new_password)
            this.apiHandler = (response) => {
                Api.checkValidationError(response, resp => {
                    if (response.code === 200) {
                        this.props.onSuccess();
                    }
                    this.setState({isActivity: false});
                }, (errors, errorMessage) => {
                    showMessageAlert(errorMessage);
                    this.setState({isActivity: false});
                });
            };
            this.apiExHandler = (reason) => {
                showMessageAlert(reason);
                this.setState({isActivity: false});
            };
            Api.changePassword(formData)
                .then((response) => {
                        this.apiHandler(response);
                    },
                ).catch((reason => {
                    this.apiExHandler(reason);
                }),
            );
        }
    }

    private validateOTP() {
        return true
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
                <View style={[StaticStyles.shadow, {

                    backgroundColor: ColorTheme.white,
                    margin: 0,
                    borderRadius: Constants.messageViewCornerRadius,
                    padding: 2 * Constants.defaultPadding
                }]}>
                    <View style={[StaticStyles.center, {
                        width: 50,
                        height: 50,
                        borderRadius: 25,
                        backgroundColor: ColorTheme.appTheme,
                        alignSelf: "center"
                    }]}>
                        <AppIcon name={"verify_mobile"}
                                 color={ColorTheme.white}
                                 provider={CommonIcons}
                                 size={20}/>
                    </View>
                    {this.state.isActivity &&
                    <ActivityIndicator size={"small"} style={{marginTop: Constants.defaultPadding}}
                                       color={ColorTheme.appTheme}/>}
                    <View style={{height: Constants.defaultPadding}}/>
                    {this.props.hasCurrentPassword && <TextKVInput secure={true}
                                                                   text={this.state.current_password}
                                                                   title={strings("current_password")}
                                                                   placeholder={strings("enter_value")}
                                                                   value={value => {
                                                                       this.setState({current_password: value})
                                                                   }}/>}
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextKVInput secure={true}
                                 text={this.state.new_password}
                                 title={strings("new_password")}
                                 placeholder={strings("enter_value")}
                                 value={value => {
                                     this.setState({new_password: value})
                                 }}/>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextKVInput secure={true}
                                 text={this.state.confirm_new_password}
                                 title={strings("confirm_new_password")}
                                 placeholder={strings("enter_value")}
                                 value={value => {
                                     this.setState({confirm_new_password: value})
                                 }}/>
                    <View style={{height: Constants.defaultPaddingMax}}/>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"normal"}
                                          title={this.state.otpSent ? strings("verify") : strings("update")}
                                          onPress={() => {
                                              this.updatePassword();
                                          }}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"alt"} title={strings("cancel")} onPress={() => {
                                this.props.onDismiss()
                            }}/>
                        </View>
                    </RTLView>
                </View>
            </Modal>
        );
    }

    private dismiss() {
        this.props.onDismiss();
    }
}

const styles = StyleSheet.create({
    container: {
        padding: Constants.defaultPadding,
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center"
    },
});
