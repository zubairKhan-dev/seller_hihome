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
import * as PaymentAPI from "../../lib/PaymentAPI";

interface Props {
    show: boolean;
    mobileNumber?: string;
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
}

export default class VerifyOTPPopUp extends Component<Props, State> {
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

    private generateOTP() {
        this.setState({isActivity: true});
        this.apiHandler = (response) => {
            PaymentAPI.checkValidationError(response, resp => {
                if (resp.status === "0") {
                    this.setState({request_id: resp.request_id, otpSent: true,});
                } else {
                    showMessageAlert(resp.error_text);
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
        PaymentAPI.generateOTP(this.props.mobileNumber)
            .then((response) => {
                    this.apiHandler(response);
                },
            ).catch((reason => {
                this.apiExHandler(reason);
            }),
        );
    }

    private verifyOTP() {
        if (this.validateOTP()) {
            this.setState({isActivity: true});
            this.apiHandler = (response) => {
                PaymentAPI.checkValidationError(response, resp => {
                    if (resp.status === "0") {
                        this.props.onSuccess();
                    } else {
                        showMessageAlert(resp.error_text);
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
            PaymentAPI.verifyOTP(this.state.request_id, this.state.otp)
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
                    height: 300,
                    backgroundColor: ColorTheme.white,
                    margin: 0,
                    borderRadius: Constants.messageViewCornerRadius,
                    padding: 2 * Constants.defaultPadding
                }]}>
                    <View style={[StaticStyles.center, {
                        width: 80,
                        height: 80,
                        borderRadius: 40,
                        backgroundColor: ColorTheme.appTheme,
                        alignSelf: "center"
                    }]}>
                        <AppIcon name={"verify_mobile"}
                                 color={ColorTheme.white}
                                 provider={CommonIcons}
                                 size={40}/>
                    </View>
                    {this.state.isActivity &&
                    <ActivityIndicator size={"small"} style={{marginTop: Constants.defaultPadding}}
                                       color={ColorTheme.appTheme}/>}
                    <View style={{height: Constants.defaultPadding}}/>
                    {!this.state.otpSent && <View>
                        <Text style={{
                            textAlign: "center",
                            color: ColorTheme.textGreyDark,
                            fontSize: 12
                        }}>{strings("otp_send_mobile_message")}</Text>
                        <View style={{height: Constants.defaultPadding}}/>
                        <Text style={{
                            textAlign: "center",
                            color: ColorTheme.textDark,
                            fontSize: 14
                        }}>{this.props.mobileNumber}</Text>
                    </View>}

                    {this.state.otpSent && <View style={{paddingHorizontal: Constants.defaultPaddingMax}}>
                        <TextKVInput keyboard={"numeric"}
                                     text={this.state.otp}
                                     title={strings("otp_sent_message")}
                                     placeholder={strings("enter_otp")}
                                     value={value => {
                                         this.setState({otp: value})
                                     }}/>
                    </View>}

                    <View style={{height: Constants.defaultPaddingMax}}/>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"normal"}
                                          title={this.state.otpSent ? strings("verify") : strings("send_otp")}
                                          onPress={() => {
                                              if (!this.state.otpSent) {
                                                  this.generateOTP();
                                              } else {
                                                  this.verifyOTP();
                                              }
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
