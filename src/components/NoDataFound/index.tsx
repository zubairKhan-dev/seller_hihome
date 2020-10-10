import React, {Component} from "react";
import {Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import Constants from "../../theme/Constants";
import {strings} from "../Translations";

interface Props {
}

interface State {
}

export default class NoDataFound extends Component<Props, State> {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={[StaticStyles.center, {flex: 1}]}>
                <AppIcon name={"no_data"}
                         color={ColorTheme.placeholder}
                         provider={CommonIcons}
                         size={60}/>
                <View style={{height: Constants.defaultPadding}}/>
                <Text
                    style={{textAlign: "center", color: ColorTheme.grey, fontSize: 16, fontWeight: "500"}}>{strings("no_data_found")}</Text>
            </View>
        );
    }
}
