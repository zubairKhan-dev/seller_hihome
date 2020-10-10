import React, {Component} from "react";
import {Switch, Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import {strings} from "../Translations";
import Constants from "../../theme/Constants";

interface Props {
    onActive: Function;
    onInActive: Function;
    initialState: boolean;
}

interface State {
    isEnabled: boolean;
}

export default class StockSwitch extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            isEnabled: this.props.initialState,
        };
    }

    toggleSwitch = (value) => {
        this.setState({isEnabled: value});
        setTimeout(() => { this.state.isEnabled ? this.props.onActive() : this.props.onInActive(), 100})
    }

    render() {
        return (
            <View style={StaticStyles.center}>
                <Switch
                    style={{transform: [{scaleX: .7}, {scaleY: .7}]}}
                    trackColor={{false: ColorTheme.white, true: ColorTheme.appThemeSecond}}
                    thumbColor={this.state.isEnabled ? ColorTheme.white : ColorTheme.textGreyDark}
                    ios_backgroundColor={ColorTheme.textGreyLight}
                    onValueChange={this.toggleSwitch}
                    value={this.state.isEnabled}
                />
                <Text
                    style={[StaticStyles.regularFont, {color: this.state.isEnabled ? ColorTheme.appTheme : ColorTheme.textGreyDark ,
                    fontSize: Constants.regularSmallestFontSize, textAlign: "center"}]}>
                    {this.state.isEnabled ? strings("active") : strings("out_of_stock")}
                </Text>
            </View>
        );
    }
}
