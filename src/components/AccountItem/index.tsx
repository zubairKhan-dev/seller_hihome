import * as React from "react";
import {Component} from "react";
import {StyleSheet, View} from "react-native";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import ColorTheme from "../../theme/Colors";
import Constants from "../../theme/Constants";
import {getCurrentLocale, isRTLMode} from "../Translations";
import {RTLText, RTLView} from "react-native-rtl-layout";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
    title: string,
    image: string,
    secondaryImage?: string
    alertMessage?: string
    onPress: Function;
}

interface State {
}

export default class AccountItem extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.props.onPress();
                }}>
                <View style={{}}>
                    <View style={{height: Constants.defaultPaddingMin}}/>
                    <RTLView style={[styles.container]}  locale={getCurrentLocale()}>
                        <AppIcon name={this.props.image}
                                 color={ColorTheme.appTheme}
                                 provider={CommonIcons}
                                 size={25}/>
                        <View style={{width: Constants.defaultPaddingRegular}}/>
                        <RTLText fontSize={isRTLMode() ? 13 : Constants.regularSmallFontSize} locale={getCurrentLocale()}
                                 style={[{
                                     fontWeight: "500",
                                     color: ColorTheme.textDark,
                                     textAlign: isRTLMode() ? "right" : "left"
                                 }]}>{this.props.title}</RTLText>
                        <View style={{flex: 1}}/>
                        {this.props.alertMessage && <RTLText fontSize={isRTLMode() ? 13 : Constants.regularSmallFontSize} locale={getCurrentLocale()}
                                                             style={[{
                                                                 fontWeight: "300",
                                                                 color: "red",
                                                                 textAlign: isRTLMode() ? "right" : "left"
                                                             }]}>{this.props.alertMessage}</RTLText>}
                        <View style={{width: Constants.defaultPadding}}/>
                        <AppIcon name={isRTLMode() ? "arrow_left" : "arrow"}
                                 color={ColorTheme.textGreyDark}
                                 provider={CommonIcons}
                                 size={10}/>
                    </RTLView>
                    <View style={{height: Constants.defaultPaddingMin}}/>
                    <View style={{
                        height: 1.0,
                        backgroundColor: ColorTheme.separatorColor,
                        opacity: Constants.separatorOpacity
                    }}/>
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: 15,
        flexDirection: "row",
        backgroundColor: "white",
        alignItems: "center"
    },
});
