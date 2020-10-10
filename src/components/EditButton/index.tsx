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
    variant?: string;
}

interface State {
    show: boolean;
}

export default class EditButton extends Component<Props, State> {
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
        let backColor = this.props.variant === "alt" ? ColorTheme.appTheme : ColorTheme.white;
        let titleColor = this.props.variant === "alt" ? ColorTheme.white : ColorTheme.appTheme;
        return (
            <TouchableOpacity onPress={() => {
                this.props.onPress()
            }}>
                <View style={[StaticStyles.center, {
                    borderColor: ColorTheme.appTheme, borderWidth: 1, borderRadius: 11,
                    paddingVertical: 2, paddingHorizontal: 15, height: 22, backgroundColor: backColor,
                }]}>
                    <Text
                        style={{
                            textAlign: "center",
                            color: titleColor,
                            fontSize: 12,
                            fontWeight: "500"
                        }}>{this.props.title ? this.props.title : strings("edit")}</Text>
                </View>
            </TouchableOpacity>
        );
    }
}
