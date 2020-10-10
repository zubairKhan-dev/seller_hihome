import * as React from "react";
import {Component} from "react";
import {StyleSheet, Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import Constants from "../../theme/Constants";
import {StaticStyles} from "../../theme/Styles";
import {TouchableOpacity} from "react-native";

interface Props {
    title: string,
    variant: string,
    onPress: Function;
}

interface State {
}

export default class ActionButton extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchableOpacity
                style={{}}
                onPress={() => {
                    this.props.onPress();
                }}>
                {this.props.variant === "alt" && <View style={[styles.alt_container, {height: Constants.actionButtonHeight, borderRadius: Constants.actionButtonHeight/2}]}>
                    <Text style={[StaticStyles.heavyFont, {textAlign: "center", color: ColorTheme.textGreyDark}]}>{this.props.title}</Text>
                </View>}
                {this.props.variant === "normal" && <View style={[styles.container, {height: Constants.actionButtonHeight, borderRadius: Constants.actionButtonHeight/2}]}>
                    <Text style={[StaticStyles.heavyFont, {textAlign: "center", color: ColorTheme.white}]}>{this.props.title}</Text>
                </View>}

            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        padding: Constants.defaultPadding,
        flexDirection: "row",
        backgroundColor: ColorTheme.appTheme,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 100
    },
    alt_container: {
        padding: Constants.defaultPadding,
        flexDirection: "row",
        backgroundColor: ColorTheme.white,
        alignItems: "center",
        justifyContent: "center",
        minWidth: 100,
        borderWidth: 1,
        borderColor: ColorTheme.appTheme
    },
});
