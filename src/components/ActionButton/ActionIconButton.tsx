import * as React from "react";
import {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import Constants from "../../theme/Constants";
import {StaticStyles} from "../../theme/Styles";
import {CommonIcons} from "../../icons/Common";
import {AppIcon} from "../../common/IconUtils";
import {getCurrentLocale, isRTLMode} from "../Translations";
import {RTLView} from "react-native-rtl-layout";
import {TouchableOpacity} from "react-native";

interface Props {
    title: string,
    icon: string,
    onPress: Function;
    iconColor?: string;
    backgroundColor?: string;
    textColor?: string;
}

interface State {
}

export default class ActionIconButton extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        console.log("MODE = " + isRTLMode());
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onPress();
                }}>
                <View style={[styles.container, {height: Constants.actionButtonHeight, borderRadius: Constants.actionButtonHeight/2, backgroundColor: this.props.backgroundColor ? this.props.backgroundColor : ColorTheme.white }]}>
                    <View style={{flexDirection: "row"}}>
                        <View style={{flex: 1}}/>
                        <AppIcon name={this.props.icon}
                                 color={this.props.iconColor}
                                 provider={CommonIcons}
                                 size={18}/>
                                 <View style={{width: 0}}/>
                        <View style={{width: 10}}/>
                        <Text style={[{fontWeight: "600", textAlignVertical: "bottom",  color: this.props.textColor ? this.props.textColor : ColorTheme.buttonBorderGrey}]}>{this.props.title}</Text>
                        <View style={{flex: 1}}/>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: Constants.defaultPadding,
        flexDirection: "row",
       // backgroundColor: ColorTheme.appTheme,
        alignItems: "center",
        justifyContent: "center",
        borderColor: ColorTheme.buttonBorderGrey,
        borderWidth: 1
    },
});
