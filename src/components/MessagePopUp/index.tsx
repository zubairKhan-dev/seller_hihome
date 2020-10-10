import React, {Component} from "react";
import Modal from "react-native-modal";
import {Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import Constants from "../../theme/Constants";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import {strings} from "../Translations";
import HFTextHeading from "../HFText/HFTextHeading";
import HFTextRegular from "../HFText/HFTextRegular";
import HFTextLight from "../HFText/HFTextLight";
import ActionButton from "../ActionButton";

interface Props {
    show: boolean;
    heading: string;
    message: string;
    success: boolean;
    onDismiss: Function;
}

interface State {
    show: boolean;
}

export default class MessagePopUp extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
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
                onBackButtonPress={() => {
                    this.dismiss();
                }}
                backdropColor={ColorTheme.white}
                backdropOpacity={0.95}
                avoidKeyboard={true}
                useNativeDriver={true}
            >
                <View style={[StaticStyles.center, StaticStyles.shadow ,{height: 300, backgroundColor: ColorTheme.white, margin: 0, borderRadius: Constants.messageViewCornerRadius, padding: 2 * Constants.defaultPaddingMax}]}>
                    <View style={[StaticStyles.center, {width : 50, height: 50, borderRadius: 25, backgroundColor: ColorTheme.appTheme}]}>
                        <AppIcon name={this.props.success ? "ic_tick" : "ic_close"}
                                 color={ColorTheme.white}
                                 provider={CommonIcons}
                                 size={25}/>
                    </View>
                    <View style={{height: Constants.defaultPadding}}/>
                    <HFTextRegular value={this.props.heading}/>
                    <View style={{height: Constants.defaultPaddingMax}}/>
                    <Text style={{textAlign: "center", color: ColorTheme.textGreyDark, fontSize: 12}}>{this.props.message}</Text>
                    <View style={{height: Constants.defaultPaddingMax}}/>
                    <ActionButton variant={"normal"} title={strings("ok")} onPress={() => {this.props.onDismiss()}}/>
                </View>
            </Modal>
        );
    }
    private dismiss() {
        this.props.onDismiss();
    }
}
