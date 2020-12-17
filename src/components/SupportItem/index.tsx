import * as React from "react";
import {Component} from "react";
import {StyleSheet, View} from "react-native";

import ColorTheme from "../../theme/Colors";
import Constants from "../../theme/Constants";
import {getCurrentLocale, isRTLMode} from "../Translations";
import {RTLText, RTLView} from "react-native-rtl-layout";
import { TouchableOpacity } from "react-native-gesture-handler";

interface Props {
    title: string,
    onPress: Function;
}

interface State {
}

export default class SupportItem extends Component<Props, State> {
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

                        <RTLText fontSize={isRTLMode() ? 13 : Constants.regularSmallFontSize} locale={getCurrentLocale()}
                                 style={[{
                                     fontWeight: "500",
                                     color: ColorTheme.textDark,
                                     textAlign: isRTLMode() ? "right" : "left"
                                 }]}>{this.props.title}</RTLText>
                        <View style={{flex: 1}}/>
                        
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
