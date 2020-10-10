import React, {Component} from "react";
import {Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import Constants from "../../theme/Constants";
import {RTLView} from "react-native-rtl-layout";
import {getCurrentLocale, strings} from "../Translations";
import {TouchableOpacity} from "react-native";

interface Props {
    onPress: Function;
    title?: string;
    selected?: boolean;
}

interface State {
    show: boolean;
    selected: boolean,
}

export default class BorderButton extends Component<Props, State> {
    constructor(props) {
        super(props);
        this.state = {
            show: false,
            selected: false,
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({
            show: newProps.show,
        });
    }

    render() {
        let backColor =  ColorTheme.white;
        let titleColor = this.props.selected ? ColorTheme.appThemeSecond : ColorTheme.grey_add;
        return (
            <TouchableOpacity onPress={() => {
                this.props.onPress()
            }}>
                <View style={[StaticStyles.center, { borderColor: ColorTheme.grey_add, borderWidth: 1, borderRadius: Constants.actionButtonHeight/2,
                    paddingVertical: 2, paddingHorizontal: 15, height: Constants.actionButtonHeight, backgroundColor: backColor,
                }]}>
                    <Text style={[StaticStyles.regularFont, {textAlign: "center", color: titleColor}]}>{this.props.title}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
