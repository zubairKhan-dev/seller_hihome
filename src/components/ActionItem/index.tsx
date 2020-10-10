import React, {Component} from "react";
import {Text, View} from "react-native";
import ColorTheme from "../../theme/Colors";
import {StaticStyles} from "../../theme/Styles";
import {AppIcon} from "../../common/IconUtils";
import {CommonIcons} from "../../icons/Common";
import Constants from "../../theme/Constants";

interface Props {
    icon: string;
    title: string;
    onPress: Function;
}

interface State {
    show: boolean;
}

export default class ActionItem extends Component<Props, State> {
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
            <View style={StaticStyles.center}>
                <View style={[StaticStyles.center, {
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    backgroundColor: ColorTheme.appTheme
                }]}>
                    <AppIcon name={this.props.icon}
                             color={ColorTheme.white}
                             provider={CommonIcons}
                             size={22}/>
                </View>
                <View style={{height: Constants.defaultPadding}}/>
                <Text
                    style={{textAlign: "center", color: ColorTheme.black, fontSize: 12, fontWeight: "500"}}>{this.props.title}</Text>
            </View>
        );
    }
}
