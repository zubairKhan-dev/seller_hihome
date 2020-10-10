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
}

interface State {
    show: boolean;
}

export default class AddButton extends Component<Props, State> {
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
            <TouchableOpacity onPress={() => {this.props.onPress()}}>
                <View style={[StaticStyles.center, {
                    borderColor: ColorTheme.placeholder, borderWidth: 1, borderRadius: Constants.defaultPaddingRegular,
                    paddingVertical: 3, paddingHorizontal: Constants.defaultPadding
                }]}>
                    <RTLView locale={getCurrentLocale()} style={{alignItems: "center"}}>
                        <AppIcon name={"add"}
                                 color={ColorTheme.appTheme}
                                 provider={CommonIcons}
                                 size={8}/>
                        <View style={{width: Constants.defaultPaddingMin}}/>
                        <Text
                            style={{
                                textAlign: "center",
                                color: ColorTheme.appTheme,
                                fontSize: 13,
                                fontWeight: "700"
                            }}>{strings("add")}</Text>
                    </RTLView>
                </View>
            </TouchableOpacity>
        );
    }
}
