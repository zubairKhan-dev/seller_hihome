import * as React from "react";
import {Component} from "react";
import {StyleSheet, TextInput, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import {RTLText} from "react-native-rtl-layout";
import {getCurrentLocale, isRTLMode} from "../Translations";
import Constants from "../../theme/Constants";

// <RTLView locale={getCurrentLocale()} style={styles.container}>
interface Props {
    value: string,
    fontSize?: number,
    textColor?: string,
}

interface State {
}

export default class HFTextLight extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <RTLText fontSize={Constants.regularFontSize} locale={getCurrentLocale()}
                     style={[StaticStyles.lightFont, {
                         color: this.props.textColor ? this.props.textColor : ColorTheme.black,
                         fontSize: this.props.fontSize ? this.props.fontSize : Constants.regularFontSize,
                         textAlign: isRTLMode() ? "right" : "left"
                     }]}>{this.props.value}</RTLText>
        );
    }
}

const styles = StyleSheet.create({
    container: {},
});
