import React, {Component} from "react";
import Modal from "react-native-modal";
import {View, TextInput, Text} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {strings, getCurrentLocale, isRTLMode} from "../Translations";
import ActionButton from "../ActionButton";
import {RTLView} from "react-native-rtl-layout";

interface Props {
    show: boolean;
    onDismiss: Function;
    onReject: Function;
}

interface State {
    show: boolean;
    reason: string;
}

export default class RejectPopUp extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            reason: ""
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            show: newProps.show,
        });
    }

    render() {
        return (
            <Modal
                isVisible={this.props.show}
                onBackdropPress={() => this.props.onDismiss()}
                onBackButtonPress={() => {
                    // this.props.onDismiss();
                }}
                backdropColor={ColorTheme.black}
                backdropOpacity={0.5}
                avoidKeyboard={true}
                useNativeDriver={true}
            >
                <View style={[StaticStyles.shadow, {

                    backgroundColor: ColorTheme.white,
                    margin: 0,
                    borderRadius: Constants.messageViewCornerRadius,
                    padding: Constants.defaultPaddingRegular
                }]}>
                    <Text style={{color: ColorTheme.textDark, fontWeight: "500", fontSize: 14}}>{strings("rejection_reason")}</Text>
                    <View style={{height: Constants.defaultPadding}}/>
                    <TextInput textAlignVertical={'top'}
                               autoFocus={true}
                               editable={true}
                               multiline={true}
                               placeholderTextColor={ColorTheme.placeholder}
                               placeholder={strings("enter_content_here")}
                               keyboardType={"default"}
                               value={this.state.reason}
                               style={{
                                   fontSize: 14,
                                   height: 200,
                                   fontWeight: "300",
                                   color: ColorTheme.black,
                                   backgroundColor: ColorTheme.appThemeLight,
                                   marginBottom: Constants.defaultPaddingRegular,
                                   borderRadius: 5,
                                   paddingHorizontal: Constants.defaultPadding,
                                   paddingVertical: Constants.defaultPadding,
                               }}
                               onChangeText={(value) => {
                                   this.setState({reason: value})
                                   // showMessage(value);
                               }}>
                    </TextInput>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"alt"} title={strings("cancel")} onPress={() => {
                                this.props.onDismiss();
                            }}/>
                        </View>
                        <View style={{width: Constants.defaultPadding}}/>
                        <View style={{flex: 1}}>
                            <ActionButton variant={"normal"} title={strings("reject")} onPress={() => {
                                this.props.onReject(this.state.reason);
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
